const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const safeRecord = (value: unknown): value is Record<string, unknown> => record(value) && Object.keys(value).length <= 20000 && !Object.keys(value).some((key) => ["__proto__", "constructor", "prototype"].includes(key));
const integer = (value: unknown, min: number, max: number) => typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;
const stats = new Set(["vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane"]);

/** Validate before touching the active save. Accept missing checkpoint maps from legacy exports. */
export function validateRunImport(value: unknown): void {
  if (!record(value) || value.schema !== 1 || !["solo", "standard", "seamless"].includes(String(value.mode))) throw new Error("This is not a supported run file.");
  if (typeof value.name !== "string" || typeof value.createdAt !== "string" || !Number.isFinite(Date.parse(value.createdAt))) throw new Error("The run name or creation date is missing.");
  if (!Array.isArray(value.players) || value.players.length < 1 || value.players.length > 6) throw new Error("A run must contain 1–6 players.");
  const ids = new Set<string>();
  for (const player of value.players) {
    if (!record(player) || typeof player.id !== "string" || !/^player-[1-6]$/.test(player.id) || ids.has(player.id) || typeof player.name !== "string" || typeof player.buildId !== "string" || !player.buildId.trim() || typeof player.color !== "string") throw new Error("A player record is missing or invalid.");
    ids.add(player.id);
  }
  if (!ids.has(String(value.hostId))) throw new Error("The host must be one of the saved players.");
  if (!safeRecord(value.completed) || Object.values(value.completed).some((entry) => typeof entry !== "boolean")) throw new Error("The saved checklist is invalid.");
  for (const [key, min, max] of [["checkpointRunes", 0, Number.MAX_SAFE_INTEGER], ["checkpointLevels", 1, 713], ["checkpointWeaponLevels", 0, 25]] as const) {
    const entries = value[key];
    if (entries !== undefined && (!safeRecord(entries) || Object.values(entries).some((entry) => !integer(entry, min, max)))) throw new Error(`Invalid values in ${key}.`);
  }
  if (value.checkpointStats !== undefined && (!safeRecord(value.checkpointStats) || Object.values(value.checkpointStats).some((entry) => !safeRecord(entry) || Object.entries(entry).some(([key, amount]) => !stats.has(key) || !integer(amount, 1, 99))))) throw new Error("Saved attributes must be whole numbers from 1 to 99.");
  if (value.levelOffset !== undefined && !integer(value.levelOffset, 0, 20)) throw new Error("Invalid level pace.");
  if (value.lossRate !== undefined && !integer(value.lossRate, 0, 100)) throw new Error("Invalid rune loss allowance.");
  if (value.runeBossSelections !== undefined && (!safeRecord(value.runeBossSelections) || Object.values(value.runeBossSelections).some((entry) => !Array.isArray(entry) || entry.some((id) => typeof id !== "string")))) throw new Error("Invalid optional boss selections.");
  if (value.optionalQuestTracks !== undefined && (!Array.isArray(value.optionalQuestTracks) || value.optionalQuestTracks.some((id) => typeof id !== "string"))) throw new Error("Invalid optional quest selections.");
}
