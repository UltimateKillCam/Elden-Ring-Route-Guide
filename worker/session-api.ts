import { selectableBuilds } from "../app/data";

const SESSION_LIFETIME = 86_400_000;
const BUILD_IDS = new Set(selectableBuilds.map((build) => build.id));
const STARTING_CLASSES = new Set(["Vagabond", "Warrior", "Hero", "Bandit", "Astrologer", "Prophet", "Samurai", "Prisoner", "Confessor", "Wretch"]);
export const SESSION_CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-max-age": "86400",
  "cache-control": "no-store",
};

type SessionRow = {
  code: string;
  host_token_hash: string;
  revision: number;
  mode: string;
  player_count: number;
  expedition: string | null;
  expires_at: number;
};

type GuestRow = {
  player_id: string;
  token_hash: string;
  name: string;
  build_id: string;
  starting_class: string;
};

type ExpeditionPlayer = { id: string; name: string; buildId: string; color: string; startingClass?: string };
type Expedition = {
  schema: 1;
  mode: "solo" | "standard" | "seamless";
  name: string;
  players: ExpeditionPlayer[];
  hostId: string;
  completed: Record<string, boolean>;
  createdAt: string;
  checkpointRunes?: Record<string, number>;
  checkpointLevels?: Record<string, number>;
  checkpointStats?: Record<string, Record<string, number>>;
  checkpointWeaponLevels?: Record<string, number>;
  runeBossSelections?: Record<string, string[]>;
  optionalQuestTracks?: string[];
  [key: string]: unknown;
};

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: SESSION_CORS_HEADERS });
const bearerToken = (request: Request) => request.headers.get("authorization")?.match(/^Bearer\s+([a-f0-9]{64})$/i)?.[1].toLowerCase() || "";
const randomHex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
const randomCode = () => String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);

async function tokenHash(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function validExpedition(value: unknown): value is Expedition {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const expedition = value as Expedition;
  if (expedition.schema !== 1 || !["solo", "standard", "seamless"].includes(expedition.mode) || !Array.isArray(expedition.players) || expedition.players.length < 1 || expedition.players.length > 6) return false;
  const ids = expedition.players.map((player) => player?.id);
  if (new Set(ids).size !== ids.length) return false;
  if (expedition.players.some((player) => !player || !/^player-[1-6]$/.test(player.id) || typeof player.name !== "string" || player.name.length > 40 || !BUILD_IDS.has(player.buildId) || (player.startingClass !== undefined && !STARTING_CLASSES.has(player.startingClass)))) return false;
  if (!ids.includes(expedition.hostId) || typeof expedition.name !== "string" || typeof expedition.createdAt !== "string") return false;
  if (!expedition.completed || typeof expedition.completed !== "object" || Array.isArray(expedition.completed) || Object.values(expedition.completed).some((entry) => typeof entry !== "boolean")) return false;
  return JSON.stringify(expedition).length <= 524_288;
}

const validProgressKey = (key: string) => /^[a-z0-9]+(?:[a-z0-9:_-]*[a-z0-9])?$/i.test(key) && key.length <= 300;
const checkpointKeyOwnedBy = (key: string, playerId: string) => /^[a-z0-9-]+:player-[1-6]$/i.test(key) && key.endsWith(`:${playerId}`);
const checklistKeyOwnedBy = (key: string, playerId: string) => checkpointKeyOwnedBy(key, playerId) || key.endsWith(`-${playerId}`) || key.includes(`-${playerId}-`);

async function sessionRow(db: D1Database, code: string) {
  const row = await db.prepare("SELECT code, host_token_hash, revision, mode, player_count, expedition, expires_at FROM public_sessions WHERE code = ?").bind(code).first<SessionRow>();
  if (!row || row.expires_at <= Date.now()) return null;
  return row;
}

async function guestRows(db: D1Database, code: string) {
  return (await db.prepare("SELECT player_id, token_hash, name, build_id, starting_class FROM public_session_guests WHERE session_code = ? ORDER BY player_id").bind(code).all<GuestRow>()).results;
}

function parsedExpedition(row: SessionRow) {
  if (!row.expedition) return null;
  try { return JSON.parse(row.expedition) as Expedition; } catch { return null; }
}

function snapshot(row: SessionRow, guests: GuestRow[], you?: string | null) {
  return {
    enabled: true,
    code: row.code,
    revision: row.revision,
    mode: row.mode,
    playerCount: row.player_count,
    expedition: parsedExpedition(row),
    slots: Array.from({ length: row.player_count - 1 }, (_, index) => {
      const playerId = `player-${index + 2}`;
      const guest = guests.find((candidate) => candidate.player_id === playerId);
      return guest ? { playerId, claimed: true, name: guest.name, buildId: guest.build_id, startingClass: guest.starting_class } : { playerId, claimed: false };
    }),
    you: you || null,
  };
}

async function authenticateHost(request: Request, row: SessionRow) {
  const token = bearerToken(request);
  return Boolean(token) && await tokenHash(token) === row.host_token_hash;
}

async function authenticateGuest(request: Request, db: D1Database, code: string) {
  const token = bearerToken(request);
  if (!token) return null;
  const hash = await tokenHash(token);
  return db.prepare("SELECT player_id, token_hash, name, build_id, starting_class FROM public_session_guests WHERE session_code = ? AND token_hash = ?").bind(code, hash).first<GuestRow>();
}

async function rateLimited(request: Request, db: D1Database, scope: string, limit: number, windowMs: number) {
  await db.prepare("DELETE FROM public_session_rate_limits WHERE expires_at <= ?").bind(Date.now()).run();
  const address = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${address}:${bucket}`;
  const result = await db.prepare("INSERT INTO public_session_rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count").bind(key, (bucket + 1) * windowMs).first<{ count: number }>();
  return Number(result?.count || 1) > limit;
}

async function createSession(request: Request, db: D1Database) {
  if (await rateLimited(request, db, "create", 10, 3_600_000)) return json({ error: "Too many sessions created from this connection; try again later" }, 429);
  const body = await request.json() as { mode?: string; playerCount?: number };
  const mode = body.mode;
  const playerCount = Number(body.playerCount);
  if (!mode || !["standard", "seamless"].includes(mode) || !Number.isInteger(playerCount) || playerCount < 2 || playerCount > 6) return json({ error: "Choose Standard or Seamless Co-op with 2 to 6 players" }, 400);
  const hostToken = randomHex();
  const hostTokenHash = await tokenHash(hostToken);
  const now = Date.now();
  await db.prepare("DELETE FROM public_sessions WHERE expires_at <= ?").bind(now).run();
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = randomCode();
    try {
      await db.prepare("INSERT INTO public_sessions (code, host_token_hash, revision, mode, player_count, expedition, created_at, expires_at) VALUES (?, ?, 0, ?, ?, NULL, ?, ?)").bind(code, hostTokenHash, mode, playerCount, now, now + SESSION_LIFETIME).run();
      const row = await sessionRow(db, code);
      return json({ ...snapshot(row!, []), hostToken }, 201);
    } catch (error) {
      if (!String(error).toLowerCase().includes("unique")) throw error;
    }
  }
  return json({ error: "Could not allocate a join code; try again" }, 503);
}

async function readSession(request: Request, db: D1Database, row: SessionRow) {
  const url = new URL(request.url);
  const requestedRevision = Number(url.searchParams.get("revision"));
  if (url.searchParams.has("revision") && Number.isInteger(requestedRevision) && requestedRevision >= row.revision) {
    return new Response(null, { status: 204, headers: SESSION_CORS_HEADERS });
  }
  const guests = await guestRows(db, row.code);
  const guest = await authenticateGuest(request, db, row.code);
  return json(snapshot(row, guests, guest?.player_id));
}

async function updateSettings(request: Request, db: D1Database, row: SessionRow) {
  if (!await authenticateHost(request, row)) return json({ error: "Only the host can change session settings" }, 403);
  if (row.expedition) return json({ error: "The route has already started" }, 409);
  const body = await request.json() as { mode?: string; playerCount?: number };
  const mode = body.mode;
  const playerCount = Number(body.playerCount);
  if (!mode || !["standard", "seamless"].includes(mode) || !Number.isInteger(playerCount) || playerCount < 2 || playerCount > 6) return json({ error: "Choose Standard or Seamless Co-op with 2 to 6 players" }, 400);
  const guests = await guestRows(db, row.code);
  if (guests.some((guest) => Number(guest.player_id.replace("player-", "")) > playerCount)) return json({ error: "A joined player is using a slot above the new party size" }, 409);
  const result = await db.prepare("UPDATE public_sessions SET mode = ?, player_count = ? WHERE code = ? AND expedition IS NULL").bind(mode, playerCount, row.code).run();
  if (!result.meta.changes) return json({ error: "The route has already started" }, 409);
  return json(snapshot({ ...row, mode, player_count: playerCount }, guests));
}

async function joinSession(request: Request, db: D1Database, row: SessionRow) {
  if (await rateLimited(request, db, "join", 20, 60_000)) return json({ error: "Too many join attempts; wait one minute and try again" }, 429);
  const body = await request.json() as { playerId?: string; name?: string; buildId?: string; startingClass?: string };
  const playerId = String(body.playerId || "");
  const slot = Number(playerId.replace("player-", ""));
  const name = String(body.name || "").trim().slice(0, 40);
  const buildId = String(body.buildId || "");
  const startingClass = String(body.startingClass || "");
  if (!Number.isInteger(slot) || slot < 2 || slot > row.player_count) return json({ error: "Choose an available player slot" }, 400);
  if (!name) return json({ error: "Enter your character name" }, 400);
  if (!BUILD_IDS.has(buildId)) return json({ error: "Choose a listed build" }, 400);
  if (!STARTING_CLASSES.has(startingClass)) return json({ error: "Choose an Elden Ring starting class" }, 400);
  const guestToken = randomHex();
  const hash = await tokenHash(guestToken);
  try {
    await db.prepare("INSERT INTO public_session_guests (session_code, player_id, token_hash, name, build_id, starting_class, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(row.code, playerId, hash, name, buildId, startingClass, Date.now()).run();
  } catch (error) {
    if (String(error).toLowerCase().includes("unique")) return json({ error: "That player slot has already been claimed" }, 409);
    throw error;
  }
  let current = row;
  for (let attempt = 0; attempt < 3 && current.expedition; attempt += 1) {
    const expedition = parsedExpedition(current);
    const player = expedition?.players.find((candidate) => candidate.id === playerId);
    if (!expedition || !player) break;
    Object.assign(player, { name, buildId, startingClass });
    const result = await db.prepare("UPDATE public_sessions SET expedition = ?, revision = revision + 1 WHERE code = ? AND revision = ?").bind(JSON.stringify(expedition), row.code, current.revision).run();
    if (result.meta.changes) { current = { ...current, expedition: JSON.stringify(expedition), revision: current.revision + 1 }; break; }
    current = await sessionRow(db, row.code) || current;
  }
  const guests = await guestRows(db, row.code);
  return json({ ...snapshot(current, guests, playerId), guestToken }, 201);
}

async function saveExpedition(request: Request, db: D1Database, row: SessionRow) {
  if (!await authenticateHost(request, row)) return json({ error: "Only the host can change expedition settings" }, 403);
  const body = await request.json() as { expedition?: unknown; baseRevision?: number };
  if (!validExpedition(body.expedition)) return json({ error: "Invalid expedition" }, 400);
  const baseRevision = Number(body.baseRevision);
  if (!Number.isInteger(baseRevision) || baseRevision < 0) return json({ error: "Invalid base revision" }, 400);
  const guests = await guestRows(db, row.code);
  const next = structuredClone(body.expedition);
  for (const guest of guests) {
    const player = next.players.find((candidate) => candidate.id === guest.player_id);
    if (!player) return json({ error: `${guest.player_id} joined this run and cannot be removed` }, 409);
    Object.assign(player, { name: guest.name, buildId: guest.build_id, startingClass: guest.starting_class });
  }
  const result = await db.prepare("UPDATE public_sessions SET expedition = ?, mode = ?, player_count = ?, revision = revision + 1 WHERE code = ? AND revision = ?").bind(JSON.stringify(next), next.mode, next.players.length, row.code, baseRevision).run();
  if (!result.meta.changes) {
    const current = await sessionRow(db, row.code);
    return json({ ...snapshot(current!, await guestRows(db, row.code)), error: "The expedition changed on another device" }, 409);
  }
  const updated = { ...row, expedition: JSON.stringify(next), mode: next.mode, player_count: next.players.length, revision: baseRevision + 1 };
  return json(snapshot(updated, guests));
}

async function updateProgress(request: Request, db: D1Database, row: SessionRow) {
  const guest = await authenticateGuest(request, db, row.code);
  if (!guest) return json({ error: "Join this run before updating player progress" }, 403);
  const expedition = parsedExpedition(row);
  if (!expedition) return json({ error: "The host has not started a run" }, 409);
  const body = await request.json() as { kind?: string; key?: string; value?: unknown };
  const key = String(body.key || "");
  if (!validProgressKey(key)) return json({ error: "Invalid progress key" }, 400);
  if (body.kind === "completed") {
    if (!checklistKeyOwnedBy(key, guest.player_id)) return json({ error: "Players can only update their own checklist" }, 403);
    if (typeof body.value !== "boolean") return json({ error: "Checklist values must be boolean" }, 400);
    expedition.completed[key] = body.value;
  } else if (["runes", "levels", "weapons"].includes(String(body.kind))) {
    if (!checkpointKeyOwnedBy(key, guest.player_id)) return json({ error: "Players can only update their own checkpoints" }, 403);
    const value = Number(body.value);
    const bounds = body.kind === "runes" ? [0, Number.MAX_SAFE_INTEGER] : body.kind === "levels" ? [1, 713] : [0, 25];
    if (!Number.isSafeInteger(value) || value < bounds[0] || value > bounds[1]) return json({ error: "Invalid checkpoint value" }, 400);
    const field = body.kind === "runes" ? "checkpointRunes" : body.kind === "levels" ? "checkpointLevels" : "checkpointWeaponLevels";
    const record = (expedition[field] ||= {}) as Record<string, number>;
    record[key] = value;
  } else if (body.kind === "stats") {
    if (!checkpointKeyOwnedBy(key, guest.player_id)) return json({ error: "Players can only update their own stats" }, 403);
    const stats = body.value;
    const statKeys = new Set(["vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane"]);
    if (!stats || typeof stats !== "object" || Array.isArray(stats) || Object.entries(stats).some(([stat, value]) => !statKeys.has(stat) || !Number.isInteger(value) || Number(value) < 1 || Number(value) > 99)) return json({ error: "Invalid stat checkpoint" }, 400);
    expedition.checkpointStats ||= {};
    expedition.checkpointStats[key] = Object.fromEntries(Object.entries(stats).map(([stat, value]) => [stat, Number(value)]));
  } else return json({ error: "Unknown progress update" }, 400);
  const result = await db.prepare("UPDATE public_sessions SET expedition = ?, revision = revision + 1 WHERE code = ? AND revision = ?").bind(JSON.stringify(expedition), row.code, row.revision).run();
  if (!result.meta.changes) return json({ error: "The expedition changed; refresh and try again" }, 409);
  return json({ ...snapshot({ ...row, expedition: JSON.stringify(expedition), revision: row.revision + 1 }, await guestRows(db, row.code), guest.player_id) });
}

export async function handleSessionApi(request: Request, db: D1Database) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: SESSION_CORS_HEADERS });
  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "api" && parts[1] === "sessions" && request.method === "POST") return createSession(request, db);
    const code = String(parts[2] || "");
    if (parts[0] !== "api" || parts[1] !== "sessions" || !/^\d{6}$/.test(code)) return json({ error: "Session not found" }, 404);
    const row = await sessionRow(db, code);
    if (!row) return json({ error: "That join code is not active" }, 404);
    if (parts.length === 3 && request.method === "GET") return readSession(request, db, row);
    if (parts.length === 3 && request.method === "PATCH") return updateSettings(request, db, row);
    if (parts.length === 3 && request.method === "PUT") return saveExpedition(request, db, row);
    if (parts[3] === "join" && parts.length === 4 && request.method === "POST") return joinSession(request, db, row);
    if (parts[3] === "progress" && parts.length === 4 && request.method === "PATCH") return updateProgress(request, db, row);
    return json({ error: "Session endpoint not found" }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Session request failed" }, 500);
  }
}
