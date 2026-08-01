import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = "https://eldenring.wiki.fextralife.com/ws/calculator/weapon/getBasicPlus";
const wikiApi = "https://eldenring.wiki.gg/api.php";
const bolsteringSourcePage = "Armaments by Bolstering Material";
const userAgent = "TarnishedTogetherRoutePlanner/1.0 (personal build-planner data import)";
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const normal = (value) => value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const fetchWithRetry = async (url, attempts = 4) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) throw new Error(`${url} returned ${response.status}`);
    await sleep(750 * attempt);
  }
  throw new Error(`Could not fetch ${url}`);
};

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Fextralife weapon catalogue returned ${response.status}`);
const rows = await response.json();
const compact = [];
for (let start = 0; start < rows.length; start += 20) {
  const batch = rows.slice(start, start + 20);
  const enriched = await Promise.all(batch.map(async ({ name, type, weaponClass }) => {
    try {
      const detailResponse = await fetch(`https://eldenring.wiki.fextralife.com/ws/calculator/weapon/getData/${encodeURIComponent(name)}/Standard`);
      const detail = detailResponse.ok ? (await detailResponse.json())?.[0] : undefined;
      return { name, type, weaponClass, weight: detail?.weight ?? null, reqStr: detail?.reqStr ?? 0, reqDex: detail?.reqDex ?? 0, reqInt: detail?.reqInt ?? 0, reqFai: detail?.reqFai ?? 0, reqArc: detail?.reqArc ?? 0 };
    } catch {
      return { name, type, weaponClass, weight: null, reqStr: 0, reqDex: 0, reqInt: 0, reqFai: 0, reqArc: 0 };
    }
  }));
  compact.push(...enriched);
}
// These ensure source-named unique weapons remain in the import even if a map
// point is renamed. Reinforcement type is independently read from wiki.gg.
const supplementalDlcNames = [
  "Ancient Meteoric Ore Greatsword", "Anvil Hammer", "Barbed Staff-Spear", "Carian Sorcery Sword",
  "Claws of Night", "Curseblade's Cirque", "Dancing Blade of Ranah", "Devonia's Hammer",
  "Dragon-Hunter's Great Katana", "Euporia", "Falx", "Flowerstone Gavel", "Gazing Finger",
  "Greatsword of Damnation", "Greatsword of Radahn (Light)", "Greatsword of Radahn (Lord)",
  "Greatsword of Solitude", "Horned Warrior's Sword", "Leda's Sword", "Obsidian Lamina",
  "Poleblade of the Bud", "Putrescence Cleaver", "Rakshasa's Great Katana", "Rellana's Twin Blades",
  "Red Bear's Claw", "Shadow Sunflower Blossom", "Spear of the Impaler", "Star-Lined Sword",
  "Sword Lance", "Sword of Night", "Tooth Whip", "Velvet Sword of St. Trina",
];
const wikiTitleAliases = new Map([
  ["Beast Claw", "Beast Claw (weapon)"],
  ["Stone-Sheathed Sword Altar", "Stone-Sheathed Sword"],
]);

const bolsteringApi = `${wikiApi}?action=parse&page=${encodeURIComponent(bolsteringSourcePage)}&prop=wikitext&format=json&origin=*`;
const bolsteringText = (await (await fetchWithRetry(bolsteringApi)).json())?.parse?.wikitext?.["*"] || "";
const upgradeByName = new Map();
for (const block of bolsteringText.split(/\n\s*\|-\s*\n/)) {
  const nameMatch = block.match(/\[\[File:[^\]]+\|link=([^\]]+)\]\]\s*\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (!nameMatch) continue;
  const upgrade = block.includes("[[Somberstones|Somberstone]]") ? "Somber" : block.includes("[[Smithing Stones|Smithing Stone]]") ? "Normal" : undefined;
  if (upgrade) upgradeByName.set(normal(nameMatch[2]), upgrade);
}

const mapSource = await readFile(new URL("../app/map-items.ts", import.meta.url), "utf8");
const mapArray = mapSource.match(/export const mapItems: MapItem\[\] = (\[[\s\S]*?\]);\s*\n\nexport type MapRoutePoint/);
if (!mapArray) throw new Error("Could not read the generated map item array.");
const mapItems = JSON.parse(mapArray[1]);
const catalogueText = (await Promise.all([
  "data.ts", "wiki-builds.ts", "meme-builds.ts", "sourced-builds.ts", "weapon-resolutions.ts",
].map((file) => readFile(new URL(`../app/${file}`, import.meta.url), "utf8")))).join("\n").toLowerCase();
const baseNames = new Set(compact.map((record) => record.name.toLowerCase()));
const dlcCandidates = [...new Set([
  ...mapItems.filter((item) => item.layer === "shadow" && /weapon|shield/i.test(item.category)).map((item) => item.name.replace(/\s+-\s+.*$/, "")).filter((name) => catalogueText.includes(name.toLowerCase())),
  ...supplementalDlcNames,
])].filter((name) => !baseNames.has(name.toLowerCase()));

for (const candidate of dlcCandidates) {
  const name = wikiTitleAliases.get(candidate) || candidate;
  const recordName = candidate === "Stone-Sheathed Sword Altar" ? name : candidate;
  const api = `${wikiApi}?action=parse&page=${encodeURIComponent(name)}&prop=wikitext&format=json&origin=*`;
  const detailResponse = await fetchWithRetry(api);
  const detail = (await detailResponse.json())?.parse?.wikitext?.["*"] || "";
  const field = (key) => detail.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n|}]*)`, "i"))?.[1]?.trim();
  const numeric = (key) => Number.parseFloat(field(key) || "0") || 0;
  const weight = Number.parseFloat(field("weight") || "");
  const upgrade = upgradeByName.get(normal(name)) || upgradeByName.get(normal(candidate));
  if (!detail || !Number.isFinite(weight)) throw new Error(`Wiki item data could not be resolved for ${candidate} (${name}).`);
  if (!upgrade) throw new Error(`Reinforcement type could not be resolved for ${candidate} (${name}).`);
  compact.push({ name: recordName, type: upgrade === "Somber" ? "Unique 10" : "Normal", weaponClass: field("type") || "DLC weapon", weight, reqStr: numeric("str_req"), reqDex: numeric("dex_req"), reqInt: numeric("int_req"), reqFai: numeric("fai_req"), reqArc: numeric("arc_req") });
  await sleep(350);
}

const dlcSomber = compact.filter((record) => !baseNames.has(record.name.toLowerCase()) && record.type === "Unique 10").map((record) => record.name);

const output = `// Generated by scripts/import-weapon-upgrades.mjs from the Fextralife calculator and Elden Ring wiki.gg item/bolstering records.\n` +
`// ${sourceUrl}\n// ${wikiApi}?page=${encodeURIComponent(bolsteringSourcePage)}\n// ${wikiApi}\n` +
`export type WeaponUpgradeRecord = { name: string; type: string; weaponClass: string; weight: number | null; reqStr: number; reqDex: number; reqInt: number; reqFai: number; reqArc: number };\n` +
`export const WEAPON_UPGRADE_RECORDS: readonly WeaponUpgradeRecord[] = ${JSON.stringify(compact, null, 2)};\n` +
`export const DLC_SOMBER_WEAPONS = ${JSON.stringify(dlcSomber, null, 2)} as const;\n` +
`const normal = (value: string) => value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();\n` +
`export function findWeaponUpgradeRecord(value: string): WeaponUpgradeRecord | undefined {\n` +
`  const source = \` \${normal(value)} \`;\n` +
`  return [...WEAPON_UPGRADE_RECORDS].sort((a, b) => b.name.length - a.name.length).find((entry) => source.includes(\` \${normal(entry.name)} \`));\n` +
`}\n` +
`export function weaponUpgradePath(value: string): "standard" | "somber" | "none" {\n` +
`  const record = findWeaponUpgradeRecord(value);\n` +
`  if (record) return record.type === "Unique 10" ? "somber" : record.type === "Unique 0" ? "none" : "standard";\n` +
`  const source = \` \${normal(value)} \`;\n` +
`  return DLC_SOMBER_WEAPONS.some((name) => source.includes(\` \${normal(name)} \`)) ? "somber" : "standard";\n` +
`}\n`;

await writeFile(new URL("../app/weapon-upgrades.ts", import.meta.url), output);
console.log(`Wrote ${compact.length} calculator weapon records.`);
