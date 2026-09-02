import { spawn, spawnSync } from "node:child_process";
import { randomBytes, randomInt } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { createServer, request as httpRequest } from "node:http";
import { networkInterfaces } from "node:os";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";

const root = process.cwd();
const gatewayPort = Number(process.env.ELDEN_RING_LAN_PORT || 8787);
const appPort = Number(process.env.ELDEN_RING_APP_PORT || 4173);
const statePath = resolve(process.env.ELDEN_RING_STATE_PATH || join(root, "work", "lan-expedition.json"));
const buildStampPath = join(root, "dist", ".lan-build-stamp");
const clientDir = join(root, "dist", "client");
const configuredControlToken = process.env.ELDEN_RING_CONTROL_TOKEN || "";
const configuredJoinCode = process.env.ELDEN_RING_JOIN_CODE || "";
const controlToken = /^[a-f0-9]{48}$/.test(configuredControlToken) ? configuredControlToken : randomBytes(24).toString("hex");
const joinCode = /^\d{6}$/.test(configuredJoinCode) ? configuredJoinCode : String(randomInt(100000, 1_000_000));
const followerSessionLifetime = 86_400_000;

const assetTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let expedition = null;
let revision = 0;
let mutationSource = "loaded";
let appProcess;
const expeditionStreams = new Set();
const followerSessions = new Map();
const playerClaimCodes = new Map();
const authenticationFailures = new Map();
let mutationQueue = Promise.resolve();

async function loadState() {
  try {
    const saved = JSON.parse(await readFile(statePath, "utf8"));
    if (!saved || !validExpedition(saved.expedition) || !Number.isInteger(saved.revision) || saved.revision < 0) throw new Error("Invalid saved LAN state");
    expedition = saved.expedition;
    revision = saved.revision;
  } catch (error) {
    expedition = null;
    revision = 0;
    if (error && typeof error === "object" && error.code === "ENOENT") return;
    const backup = `${statePath}.corrupt-${Date.now()}`;
    try {
      await rename(statePath, backup);
      console.error(`Saved LAN state was invalid and has been preserved at ${backup}.`);
    } catch {
      console.error("Saved LAN state was invalid and could not be loaded.");
    }
  }
}

async function saveState() {
  await mkdir(dirname(statePath), { recursive: true });
  const temporary = `${statePath}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify({ revision, expedition }, null, 2), "utf8");
    await rename(temporary, statePath);
  } finally {
    await rm(temporary, { force: true });
  }
}

function mutateState(operation) {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(() => undefined, () => undefined);
  return result;
}

async function commitExpedition(nextExpedition, source) {
  const previous = { expedition, revision, mutationSource };
  expedition = nextExpedition;
  revision += 1;
  mutationSource = source;
  try {
    await saveState();
  } catch (error) {
    expedition = previous.expedition;
    revision = previous.revision;
    mutationSource = previous.mutationSource;
    throw error;
  }
  broadcastExpedition();
  return { enabled: true, revision, source: mutationSource, expedition: structuredClone(expedition) };
}

function startNpm(args, options) {
  if (process.platform === "win32") {
    return spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npm.cmd", ...args], options);
  }
  return spawn("npm", args, options);
}

function runNpm(args) {
  return new Promise((resolve, reject) => {
    const child = startNpm(args, { cwd: root, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`npm exited with code ${code}`)));
  });
}

async function waitForApp() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${appPort}/`);
      if (response.ok) return;
    } catch { /* Start-up is still in progress. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("The application server did not start in time.");
}

async function newestModified(path) {
  const entry = await stat(path);
  if (!entry.isDirectory()) return entry.mtimeMs;
  const children = await readdir(path, { withFileTypes: true });
  return Math.max(entry.mtimeMs, ...(await Promise.all(children
    .filter((child) => child.name !== "work" && child.name !== "node_modules" && child.name !== "dist")
    .map((child) => newestModified(join(path, child.name))))));
}

async function buildIsStale() {
  if (process.env.ELDEN_RING_FORCE_BUILD === "1") return true;
  try {
    const [outputTime, appTime, packageTime] = await Promise.all([
      newestModified(buildStampPath),
      newestModified(join(root, "app")),
      newestModified(join(root, "package.json")),
    ]);
    return Math.max(appTime, packageTime) > outputTime;
  } catch {
    return true;
  }
}

function sendJson(response, status, body) {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  response.end(text);
}

function expeditionSnapshot(request) {
  return { enabled: true, revision, source: mutationSource, expedition, you: request ? followerSession(request)?.playerId || null : undefined };
}

function cookies(request) {
  return Object.fromEntries(String(request.headers.cookie || "").split(";").map((value) => {
    const separator = value.indexOf("=");
    return separator < 0 ? [] : [value.slice(0, separator).trim(), value.slice(separator + 1).trim()];
  }).filter(([key, value]) => key && value));
}

function isControllerRequest(request, url) {
  return request.headers["x-control-token"] === controlToken || url.searchParams.get("control") === controlToken;
}

function followerSession(request) {
  const token = cookies(request)["tarnished-together-session"];
  if (!token) return undefined;
  const session = followerSessions.get(token);
  if (!session) return undefined;
  if (session.expiresAt <= Date.now()) {
    followerSessions.delete(token);
    return undefined;
  }
  return session;
}

function isJoined(request) {
  return cookies(request)["tarnished-together-join"] === joinCode || Boolean(followerSession(request));
}

function claimCodeFor(playerId) {
  if (playerClaimCodes.has(playerId)) return playerClaimCodes.get(playerId);
  let code;
  do code = String(randomInt(100000, 1_000_000));
  while ([...playerClaimCodes.values()].includes(code));
  playerClaimCodes.set(playerId, code);
  return code;
}

function authenticationKey(request, scope) {
  return `${scope}:${request.socket.remoteAddress || "unknown"}`;
}

function authenticationRateLimited(request, scope) {
  const key = authenticationKey(request, scope);
  const current = authenticationFailures.get(key);
  if (!current || current.expiresAt <= Date.now()) {
    authenticationFailures.delete(key);
    return false;
  }
  return current.count >= 10;
}

function recordAuthenticationFailure(request, scope) {
  const key = authenticationKey(request, scope);
  const current = authenticationFailures.get(key);
  authenticationFailures.set(key, current && current.expiresAt > Date.now()
    ? { ...current, count: current.count + 1 }
    : { count: 1, expiresAt: Date.now() + 60_000 });
}

function clearAuthenticationFailures(request, scope) {
  authenticationFailures.delete(authenticationKey(request, scope));
}

function writeExpeditionEvent(response) {
  response.write(`data: ${JSON.stringify(expeditionSnapshot())}\n\n`);
}

function broadcastExpedition() {
  for (const response of expeditionStreams) {
    try {
      writeExpeditionEvent(response);
    } catch {
      expeditionStreams.delete(response);
    }
  }
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("Request is too large");
  }
  return JSON.parse(body || "{}");
}

function validExpedition(value) {
  if (value === null) return true;
  const plainRecord = (record) => Boolean(record) && typeof record === "object" && !Array.isArray(record);
  const boundedEntries = (record) => plainRecord(record) && Object.keys(record).length <= 20_000;
  const startingClasses = new Set(["Vagabond", "Warrior", "Hero", "Bandit", "Astrologer", "Prophet", "Samurai", "Prisoner", "Confessor", "Wretch"]);
  if (!value || value.schema !== 1 || !["solo", "standard", "seamless"].includes(value.mode) || !Array.isArray(value.players) || value.players.length < 1 || value.players.length > 6) return false;
  const playerIds = value.players.map((player) => player?.id);
  if (new Set(playerIds).size !== playerIds.length || value.players.some((player) => !player || !/^player-[1-6]$/.test(player.id) || typeof player.name !== "string" || typeof player.buildId !== "string" || !player.buildId.trim() || (player.startingClass !== undefined && !startingClasses.has(player.startingClass)))) return false;
  if (!playerIds.includes(value.hostId) || typeof value.name !== "string" || typeof value.createdAt !== "string") return false;
  if (!boundedEntries(value.completed) || Object.values(value.completed).some((entry) => typeof entry !== "boolean")) return false;
  const numericMaps = [
    [value.checkpointRunes, 0, Number.MAX_SAFE_INTEGER],
    [value.checkpointLevels, 1, 713],
    [value.checkpointWeaponLevels, 0, 25],
  ];
  for (const [record, minimum, maximum] of numericMaps) {
    if (record === undefined) continue;
    if (!boundedEntries(record) || Object.values(record).some((entry) => !Number.isInteger(entry) || entry < minimum || entry > maximum)) return false;
  }
  if (value.checkpointStats !== undefined) {
    const statKeys = new Set(["vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane"]);
    if (!boundedEntries(value.checkpointStats) || Object.values(value.checkpointStats).some((stats) => !boundedEntries(stats) || Object.entries(stats).some(([key, entry]) => !statKeys.has(key) || !Number.isInteger(entry) || entry < 1 || entry > 99))) return false;
  }
  if (value.runeBossSelections !== undefined && (!boundedEntries(value.runeBossSelections) || Object.values(value.runeBossSelections).some((entry) => !Array.isArray(entry) || entry.some((id) => typeof id !== "string")))) return false;
  if (value.optionalQuestTracks !== undefined && (!Array.isArray(value.optionalQuestTracks) || value.optionalQuestTracks.some((entry) => typeof entry !== "string"))) return false;
  return true;
}

const validProgressKey = (key) => /^[a-z0-9]+(?:[a-z0-9:_-]*[a-z0-9])?$/i.test(key) && key.length <= 300;
const checkpointKeyOwnedBy = (key, playerId) => /^[a-z0-9-]+:player-[1-6]$/i.test(key) && key.endsWith(`:${playerId}`);
const checklistKeyOwnedBy = (key, playerId) => checkpointKeyOwnedBy(key, playerId) || key.endsWith(`-${playerId}`) || key.includes(`-${playerId}-`);

async function serveClientAsset(pathname, request, response) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const filePath = resolve(clientDir, `.${decodedPath}`);
  const relativePath = relative(clientDir, filePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath) || !decodedPath.startsWith("/assets/")) return false;

  try {
    const file = await stat(filePath);
    if (!file.isFile()) return false;

    const extension = extname(filePath).toLowerCase();
    response.writeHead(200, {
      "content-type": assetTypes[extension] || "application/octet-stream",
      "content-length": file.size,
      "cache-control": "public, max-age=31536000, immutable",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
    return true;
  } catch {
    return false;
  }
}

function proxyToApp(request, response) {
  const headers = {
    ...request.headers,
    "x-forwarded-host": request.headers.host,
    "x-forwarded-proto": "http",
  };
  delete headers["accept-encoding"];
  const upstream = httpRequest({
    hostname: "127.0.0.1",
    port: appPort,
    method: request.method,
    path: request.url,
    headers,
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  upstream.on("error", () => sendJson(response, 502, { error: "Application server unavailable" }));
  request.pipe(upstream);
}

function localAddresses() {
  const virtualAdapter = /tailscale|vethernet|virtual|vmware|hyper-v|wsl|docker|loopback|local area connection\*/i;
  const privateAddress = (address) => /^10\./.test(address) || /^192\.168\./.test(address) || (() => {
    const match = address.match(/^172\.(\d+)\./);
    return match && Number(match[1]) >= 16 && Number(match[1]) <= 31;
  })();

  return Object.entries(networkInterfaces()).flatMap(([adapter, entries]) =>
    (entries || []).filter((entry) => entry.family === "IPv4" && !entry.internal).map((entry) => ({
      address: entry.address,
      adapter,
      preferred: privateAddress(entry.address) && !virtualAdapter.test(adapter),
    })),
  ).sort((a, b) => Number(b.preferred) - Number(a.preferred) || a.adapter.localeCompare(b.adapter));
}

async function openController(url) {
  if (process.platform !== "win32") return;
  const opener = spawn("rundll32", ["url.dll,FileProtocolHandler", url], { detached: true, stdio: "ignore", windowsHide: true });
  opener.unref();
}

async function main() {
  console.log("Preparing the LAN guide...\n");
  if (await buildIsStale()) {
    await runNpm(["run", "build"]);
    await writeFile(buildStampPath, new Date().toISOString(), "utf8");
  }
  else console.log("Using the existing production build. Set ELDEN_RING_FORCE_BUILD=1 to rebuild.\n");
  await loadState();

  appProcess = startNpm(["run", "start", "--", "--host", "127.0.0.1", "--port", String(appPort)], {
    cwd: root,
    stdio: process.env.ELDEN_RING_APP_STDIO === "ignore" ? "ignore" : "inherit",
    windowsHide: true,
  });
  await waitForApp();

  const server = createServer(async (request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if ((request.method === "GET" || request.method === "HEAD") && await serveClientAsset(url.pathname, request, response)) {
      return;
    }
    if (url.pathname === "/api/lan-info" && request.method === "GET") {
      if (!isControllerRequest(request, url)) {
        sendJson(response, 403, { error: "Only the host can view the join code" });
        return;
      }
      const preferred = localAddresses().find((network) => network.preferred) || localAddresses()[0];
      sendJson(response, 200, {
        joinCode,
        address: preferred ? `http://${preferred.address}:${gatewayPort}/` : `http://localhost:${gatewayPort}/`,
        players: (expedition?.players || []).map((player) => ({ id: player.id, name: player.name, code: claimCodeFor(player.id) })),
      });
      return;
    }
    if (url.pathname === "/api/join" && request.method === "POST") {
      if (authenticationRateLimited(request, "join")) {
        sendJson(response, 429, { error: "Too many join attempts; wait one minute and try again" });
        return;
      }
      try {
        const body = await readJson(request);
        if (String(body.code || "").replace(/\D/g, "") !== joinCode) {
          recordAuthenticationFailure(request, "join");
          sendJson(response, 403, { error: "That join code is not active on this host" });
          return;
        }
        clearAuthenticationFailures(request, "join");
        const sessionToken = randomBytes(32).toString("hex");
        followerSessions.set(sessionToken, { playerId: null, expiresAt: Date.now() + followerSessionLifetime });
        response.setHeader("set-cookie", [
          `tarnished-together-join=${joinCode}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
          `tarnished-together-session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        ]);
        sendJson(response, 200, expeditionSnapshot());
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid join request" });
      }
      return;
    }
    if (url.pathname === "/api/claim-player" && request.method === "POST") {
      if (!isJoined(request)) {
        sendJson(response, 403, { error: "Join this run before choosing a character" });
        return;
      }
      const session = followerSession(request);
      if (!session) {
        sendJson(response, 403, { error: "Enter the join code again before choosing a character" });
        return;
      }
      if (authenticationRateLimited(request, "claim")) {
        sendJson(response, 429, { error: "Too many character-code attempts; wait one minute and try again" });
        return;
      }
      try {
        const body = await readJson(request);
        if (!expedition) throw new Error("The host has not started a run");
        const playerId = String(body.playerId || "");
        if (!expedition.players.some((candidate) => candidate.id === playerId)) throw new Error("Unknown player");
        if (String(body.code || "").replace(/\D/g, "") !== claimCodeFor(playerId)) {
          recordAuthenticationFailure(request, "claim");
          throw new Error("That character code is not valid");
        }
        clearAuthenticationFailures(request, "claim");
        session.playerId = playerId;
        sendJson(response, 200, expeditionSnapshot(request));
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid player claim" });
      }
      return;
    }
    if (url.pathname === "/api/expedition" && request.method === "GET") {
      if (!isControllerRequest(request, url) && !isJoined(request)) {
        sendJson(response, 200, { enabled: true, requiresJoin: true, revision });
        return;
      }
      sendJson(response, 200, expeditionSnapshot(request));
      return;
    }
    if (url.pathname === "/api/expedition/events" && request.method === "GET") {
      if (!isJoined(request) && !isControllerRequest(request, url)) {
        sendJson(response, 403, { error: "Join this run before opening live updates" });
        return;
      }
      response.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-store, no-transform",
        "connection": "keep-alive",
        "x-accel-buffering": "no",
      });
      response.flushHeaders?.();
      expeditionStreams.add(response);
      writeExpeditionEvent(response);
      const heartbeat = setInterval(() => response.write(": keep-alive\n\n"), 15_000);
      request.once("close", () => {
        clearInterval(heartbeat);
        expeditionStreams.delete(response);
      });
      return;
    }
    if (url.pathname === "/api/expedition" && request.method === "PUT") {
      if (request.headers["x-control-token"] !== controlToken) {
        sendJson(response, 403, { error: "Only the controller can change expedition settings" });
        return;
      }
      try {
        const body = await readJson(request);
        if (!validExpedition(body.expedition)) throw new Error("Invalid expedition");
        const baseRevision = body.baseRevision === undefined ? undefined : Number(body.baseRevision);
        if (baseRevision !== undefined && (!Number.isInteger(baseRevision) || baseRevision < 0)) throw new Error("Invalid base revision");
        const result = await mutateState(async () => {
          if (baseRevision !== undefined && baseRevision !== revision) return { conflict: true, snapshot: { ...expeditionSnapshot(), expedition: structuredClone(expedition) } };
          return { conflict: false, snapshot: await commitExpedition(structuredClone(body.expedition), "controller") };
        });
        if (result.conflict) sendJson(response, 409, { ...result.snapshot, error: "The expedition changed on another device" });
        else sendJson(response, 200, result.snapshot);
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request" });
      }
      return;
    }
    if (url.pathname === "/api/player-progress" && request.method === "PATCH") {
      if (!isJoined(request)) {
        sendJson(response, 403, { error: "Join this run before updating player progress" });
        return;
      }
      const session = followerSession(request);
      if (!session) {
        sendJson(response, 403, { error: "Enter the join code again before updating player progress" });
        return;
      }
      if (!session.playerId) {
        sendJson(response, 403, { error: "Choose your character before updating player progress" });
        return;
      }
      try {
        if (!expedition) throw new Error("The host has not started a run");
        const body = await readJson(request);
        const playerId = session.playerId;
        if (body.playerId !== undefined && body.playerId !== playerId) {
          sendJson(response, 403, { error: "Players cannot update another character" });
          return;
        }
        const key = String(body.key || "");
        if (!validProgressKey(key)) throw new Error("Invalid progress key");
        if (body.kind === "completed") {
          if (!checklistKeyOwnedBy(key, playerId)) {
            sendJson(response, 403, { error: "Players can only update their own checklist" });
            return;
          }
          if (typeof body.value !== "boolean") throw new Error("Checklist values must be boolean");
        } else if (body.kind === "runes") {
          if (!checkpointKeyOwnedBy(key, playerId)) {
            sendJson(response, 403, { error: "Players can only update their own rune balance" });
            return;
          }
          const runes = Number(body.value);
          if (!Number.isSafeInteger(runes) || runes < 0) throw new Error("Runes must be a non-negative integer");
        } else if (body.kind === "levels") {
          if (!checkpointKeyOwnedBy(key, playerId)) {
            sendJson(response, 403, { error: "Players can only update their own level" });
            return;
          }
          const level = Number(body.value);
          if (!Number.isInteger(level) || level < 1 || level > 713) throw new Error("Level must be an integer from 1 to 713");
        } else if (body.kind === "stats") {
          if (!checkpointKeyOwnedBy(key, playerId)) {
            sendJson(response, 403, { error: "Players can only update their own stats" });
            return;
          }
          const statKeys = ["vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane"];
          if (!body.value || typeof body.value !== "object" || Array.isArray(body.value)) throw new Error("Invalid stat checkpoint");
          for (const stat of statKeys) {
            if (body.value[stat] === undefined) continue;
            const number = Number(body.value[stat]);
            if (!Number.isInteger(number) || number < 1 || number > 99) throw new Error("Stats must be integers from 1 to 99");
          }
          if (Object.keys(body.value).some((stat) => !statKeys.includes(stat))) throw new Error("Invalid stat checkpoint");
        } else if (body.kind === "weapons") {
          if (!checkpointKeyOwnedBy(key, playerId)) {
            sendJson(response, 403, { error: "Players can only update their own weapon level" });
            return;
          }
          const weaponLevel = Number(body.value);
          if (!Number.isInteger(weaponLevel) || weaponLevel < 0 || weaponLevel > 25) throw new Error("Weapon level must be an integer from 0 to 25");
        } else {
          throw new Error("Unknown progress update");
        }
        const snapshot = await mutateState(async () => {
          if (!expedition) throw new Error("The host has not started a run");
          if (!expedition.players.some((candidate) => candidate.id === playerId)) throw new Error("Unknown player");
          const next = structuredClone(expedition);
          if (body.kind === "completed") next.completed[key] = body.value;
          else if (body.kind === "runes") {
            next.checkpointRunes ||= {};
            next.checkpointRunes[key] = Number(body.value);
          } else if (body.kind === "levels") {
            next.checkpointLevels ||= {};
            next.checkpointLevels[key] = Number(body.value);
          } else if (body.kind === "stats") {
            next.checkpointStats ||= {};
            next.checkpointStats[key] = Object.fromEntries(Object.entries(body.value).map(([stat, value]) => [stat, Number(value)]));
          } else if (body.kind === "weapons") {
            next.checkpointWeaponLevels ||= {};
            next.checkpointWeaponLevels[key] = Number(body.value);
          }
          if (!validExpedition(next)) throw new Error("Player progress would make the expedition invalid");
          return commitExpedition(next, "player");
        });
        sendJson(response, 200, { ...snapshot, you: playerId });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request" });
      }
      return;
    }
    proxyToApp(request, response);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(gatewayPort, "0.0.0.0", resolve);
  });

  const controllerUrl = `http://localhost:${gatewayPort}/?control=${controlToken}`;
  const followerUrls = localAddresses().map((network) => ({
    ...network,
    route: `http://${network.address}:${gatewayPort}/`,
    catalogue: `http://${network.address}:${gatewayPort}/?catalog=1`,
  }));
  console.log("\nLAN guide is running. Keep this window open while you play.\n");
  console.log(`Controller (your PC):\n  ${controllerUrl}\n`);
  const preferredUrls = followerUrls.filter((urls) => urls.preferred);
  const otherUrls = followerUrls.filter((urls) => !urls.preferred);
  console.log("Home network links (send these to the other PC):");
  (preferredUrls.length ? preferredUrls : followerUrls).forEach((urls) => {
    console.log(`  ${urls.adapter} (${urls.address})`);
    console.log(`  Open this address: ${urls.route}`);
    console.log(`  Join code:         ${joinCode}`);
    console.log(`  Build catalogue:   ${urls.catalogue}\n`);
  });
  if (preferredUrls.length && otherUrls.length) {
    console.log("Other network adapters (usually ignore these):");
    otherUrls.forEach((urls) => console.log(`  ${urls.adapter}: ${urls.address}`));
    console.log("");
  }
  console.log("\nIf Windows asks, allow Node.js on Private networks only. Press Ctrl+C to stop.\n");
  if (process.env.ELDEN_RING_NO_BROWSER !== "1") await openController(controllerUrl);

  const stop = () => {
    for (const response of expeditionStreams) response.end();
    expeditionStreams.clear();
    server.close();
    if (appProcess && !appProcess.killed) {
      if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(appProcess.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true });
      else appProcess.kill("SIGTERM");
    }
    process.exit(0);
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}

main().catch((error) => {
  console.error(`\nCould not start the LAN guide: ${error.message}`);
  if (appProcess && !appProcess.killed) appProcess.kill();
  process.exit(1);
});
