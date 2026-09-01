import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const wikiApi = "https://eldenring.wiki.gg/api.php";
const bolsteringSourcePage = "Armaments by Bolstering Material";
const userAgent = "TarnishedTogetherRoutePlanner/1.0 (personal build-planner data import)";
const EXPECTED_BOLSTERING_COUNT = 478;
const EXPECTED_WIKI_CATALOGUE_COUNT = 479;
const EXPECTED_OUTPUT_COUNT = 487;
const EXPECTED_DLC_SOMBER_COUNT = 56;
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
export const normalizeWeaponName = (value) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normal = normalizeWeaponName;
const outputPath = new URL("../app/weapon-upgrades.ts", import.meta.url);
const generatedNormalizer = `const normal = (value: string) => value.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();`;
export const REGULATION_117_WEAPON_SUPPLEMENT = [
  { regulationId: 3560000, name: "Leontiel's Greatsword", type: "Unique 10", weaponClass: "Greatsword", weight: 9.5, reqStr: 13, reqDex: 26, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 8530000, name: "Hefty Scimitar", type: "Normal", weaponClass: "Curved Greatsword", weight: 9.5, reqStr: 13, reqDex: 11, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 13510000, name: "Golden Order Flail", type: "Unique 10", weaponClass: "Flail", weight: 5, reqStr: 9, reqDex: 16, reqInt: 0, reqFai: 26, reqArc: 0 },
  { regulationId: 31540000, name: "Silver Grooved Shield", type: "Normal", weaponClass: "Medium Shield", weight: 3, reqStr: 9, reqDex: 12, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 62520000, name: "Ritual Thrusting Shield", type: "Normal", weaponClass: "Thrusting Shield", weight: 10, reqStr: 13, reqDex: 12, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 64530000, name: "Reverse-Bladed Sword", type: "Normal", weaponClass: "Backhand Blade", weight: 3, reqStr: 9, reqDex: 11, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 66530000, name: "Reed Great Katana", type: "Normal", weaponClass: "Great Katana", weight: 10, reqStr: 11, reqDex: 16, reqInt: 0, reqFai: 0, reqArc: 0 },
  { regulationId: 67530000, name: "Idus Sword", type: "Normal", weaponClass: "Light Greatsword", weight: 7, reqStr: 10, reqDex: 15, reqInt: 0, reqFai: 0, reqArc: 0 },
];
const fetchWithRetry = async (url, attempts = 4) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) throw new Error(`${url} returned ${response.status}`);
    await sleep(750 * attempt);
  }
  throw new Error(`Could not fetch ${url}`);
};

function bolsteringEntries(source) {
  if (typeof source !== "string" || !source.trim()) throw new Error("wiki.gg bolstering source is empty.");
  const entries = [];
  for (const block of source.split(/\n\s*\|-\s*\n/)) {
    const nameMatch = block.match(/\[\[File:[^\]]+\|link=([^\]]+)\]\]\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
    if (!nameMatch) continue;
    const upgrade = block.includes("[[Somberstones|Somberstone]]")
      ? "Somber"
      : block.includes("[[Smithing Stones|Smithing Stone]]")
        ? "Normal"
        : /\{\{No\}\}\s*Unupgradable/i.test(block)
          ? "None"
          : undefined;
    if (!upgrade) throw new Error(`wiki.gg has no recognised bolstering material for ${nameMatch[3] || nameMatch[2]}.`);
    entries.push({ pageTitle: nameMatch[2], name: nameMatch[3] || nameMatch[2], upgrade, dlc: /\{\{SOTE\}\}/.test(block) });
  }
  const names = new Set();
  for (const entry of entries) {
    const key = normal(entry.name);
    if (names.has(key)) throw new Error(`Duplicate wiki.gg armament name: ${entry.name}`);
    names.add(key);
  }
  return entries;
}

export function parseBolsteringCatalogue(source, { expectedCount = EXPECTED_WIKI_CATALOGUE_COUNT } = {}) {
  const entries = bolsteringEntries(source);
  if (entries.length !== expectedCount) throw new Error(`Expected ${expectedCount} wiki.gg armament records, parsed ${entries.length}.`);
  return entries;
}

export function regulationWeaponRecords(records = REGULATION_117_WEAPON_SUPPLEMENT) {
  if (records.length !== 8) throw new Error(`Expected 8 regulation 1.17 weapon records, received ${records.length}.`);
  const ids = new Set();
  const names = new Set();
  return records.map(({ regulationId, ...record }) => {
    if (!Number.isInteger(regulationId) || regulationId <= 0) throw new Error(`Invalid regulation weapon ID for ${record.name}.`);
    if (ids.has(regulationId)) throw new Error(`Duplicate regulation weapon ID: ${regulationId}`);
    if (names.has(normal(record.name))) throw new Error(`Duplicate regulation weapon name: ${record.name}`);
    ids.add(regulationId);
    names.add(normal(record.name));
    return record;
  });
}

export function parseBolsteringTypes(source, { expectedCount = EXPECTED_BOLSTERING_COUNT } = {}) {
  const upgrades = new Map();
  for (const entry of bolsteringEntries(source)) {
    if (entry.upgrade !== "None") upgrades.set(normal(entry.name), entry.upgrade);
  }
  if (upgrades.size !== expectedCount) throw new Error(`Expected ${expectedCount} wiki.gg bolstering records, parsed ${upgrades.size}.`);
  return upgrades;
}

const wikiField = (source, key) => source.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n|}]*)`, "i"))?.[1]?.trim();

export function wikiWeaponRecord(entry, detail) {
  if (!detail || typeof detail !== "string") throw new Error(`Wiki item data is missing for ${entry.name}.`);
  const requirement = (key) => {
    const raw = wikiField(detail, key);
    if (!raw || /^[-–—]$/.test(raw)) return 0;
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0 || value > 99) throw new Error(`Wiki item data has an invalid ${key} for ${entry.name}.`);
    return value;
  };
  const weight = Number.parseFloat(wikiField(detail, "weight") || "");
  const weaponClass = wikiField(detail, "type");
  if (!Number.isFinite(weight) || weight < 0) throw new Error(`Wiki item data has an invalid weight for ${entry.name}.`);
  if (!weaponClass) throw new Error(`Wiki item data has no weapon class for ${entry.name}.`);
  return {
    name: entry.name,
    type: entry.upgrade === "Somber" ? "Unique 10" : entry.upgrade === "None" ? "Unique 0" : "Normal",
    weaponClass,
    weight,
    reqStr: requirement("str_req"),
    reqDex: requirement("dex_req"),
    reqInt: requirement("int_req"),
    reqFai: requirement("fai_req"),
    reqArc: requirement("arc_req"),
  };
}

function validateOutputRecords(records) {
  if (records.length !== EXPECTED_OUTPUT_COUNT) throw new Error(`Expected ${EXPECTED_OUTPUT_COUNT} weapon upgrade records, generated ${records.length}.`);
  const names = new Set();
  for (const record of records) {
    if (names.has(record.name)) throw new Error(`Duplicate weapon upgrade record: ${record.name}`);
    if (!Number.isFinite(record.weight) || record.weight < 0) throw new Error(`Weapon upgrade record has an invalid weight: ${record.name}`);
    for (const key of ["reqStr", "reqDex", "reqInt", "reqFai", "reqArc"]) {
      if (!Number.isInteger(record[key]) || record[key] < 0 || record[key] > 99) throw new Error(`Weapon upgrade record has an invalid ${key}: ${record.name}`);
    }
    names.add(record.name);
  }
}

async function main() {
  const bolsteringParams = new URLSearchParams({ action: "parse", page: bolsteringSourcePage, prop: "wikitext", format: "json", formatversion: "2" });
  const bolsteringApi = `${wikiApi}?${bolsteringParams}`;
  const bolsteringText = (await (await fetchWithRetry(bolsteringApi)).json())?.parse?.wikitext || "";
  const catalogue = parseBolsteringCatalogue(bolsteringText);
  const canonicalTypes = new Map(catalogue.map((entry) => [normal(entry.name), entry.upgrade]));
  if (canonicalTypes.get("longsword") !== "Normal" || canonicalTypes.get("moonveil") !== "Somber" || canonicalTypes.get("meteorite staff") !== "None") {
    throw new Error("wiki.gg bolstering classifications failed their canonical checks.");
  }

  const wikiTitleAliases = new Map([["Beast Claw", "Beast Claw (weapon)"]]);
  const records = [];
  for (let start = 0; start < catalogue.length; start += 50) {
    const batch = catalogue.slice(start, start + 50);
    const requestedTitles = batch.map((entry) => wikiTitleAliases.get(entry.name) || entry.pageTitle);
    const detailParams = new URLSearchParams({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      rvslots: "main",
      redirects: "1",
      titles: requestedTitles.join("|"),
      format: "json",
      formatversion: "2",
    });
    const response = await (await fetchWithRetry(`${wikiApi}?${detailParams}`)).json();
    const titleLinks = new Map();
    for (const link of [...(response?.query?.normalized || []), ...(response?.query?.redirects || [])]) titleLinks.set(normal(link.from), link.to);
    const pages = new Map((response?.query?.pages || []).map((page) => [normal(page.title), page]));
    const returnedTitle = (requestedTitle) => {
      let title = requestedTitle;
      const seen = new Set();
      while (titleLinks.has(normal(title)) && !seen.has(normal(title))) {
        seen.add(normal(title));
        title = titleLinks.get(normal(title));
      }
      return title;
    };
    batch.forEach((entry, index) => {
      const requestedTitle = requestedTitles[index];
      const page = pages.get(normal(returnedTitle(requestedTitle)));
      const detail = page?.revisions?.[0]?.slots?.main?.content;
      if (!page || page.missing) throw new Error(`wiki.gg weapon page is missing for ${entry.name} (${requestedTitle}).`);
      records.push(wikiWeaponRecord(entry, detail));
    });
    if (start + 50 < catalogue.length) await sleep(350);
  }

  records.push(...regulationWeaponRecords());
  validateOutputRecords(records);
  const recordsByName = new Map(records.map((record) => [normal(record.name), record]));
  for (const [name, expected] of [
    ["Golem Fist", ["Normal", "Fist", 6, 24, 8, 11, 11, 0]],
    ["Sword of Light", ["Unique 10", "Straight Sword", 4, 14, 11, 0, 24, 0]],
    ["Staff of the Great Beyond", ["Unique 10", "Glintstone Staff", 2, 7, 0, 25, 25, 0]],
  ]) {
    const record = recordsByName.get(normal(name));
    const actual = record && [record.type, record.weaponClass, record.weight, record.reqStr, record.reqDex, record.reqInt, record.reqFai, record.reqArc];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`wiki.gg canonical weapon check failed for ${name}: ${JSON.stringify(actual)}.`);
  }
  const dlcSomber = catalogue.filter((entry) => entry.dlc && entry.upgrade === "Somber").map((entry) => entry.name);
  if (dlcSomber.length !== EXPECTED_DLC_SOMBER_COUNT) throw new Error(`Expected ${EXPECTED_DLC_SOMBER_COUNT} DLC Somber weapons, generated ${dlcSomber.length}.`);

  const output = `// Generated by scripts/import-weapon-upgrades.mjs from Elden Ring wiki.gg records and the regulation 1.17 Tarnished Pack supplement.\n` +
`// ${bolsteringApi}\n// ${wikiApi}\n` +
`// Regulation 1.17 SHA-256: FB4AFD25E70EFFC9F9523D3ABA89B1FB3E08B0800D8EFB9A535CAB038C5E8BBD\n` +
`export type WeaponUpgradeRecord = { name: string; type: string; weaponClass: string; weight: number | null; reqStr: number; reqDex: number; reqInt: number; reqFai: number; reqArc: number };\n` +
`export const WEAPON_UPGRADE_RECORDS: readonly WeaponUpgradeRecord[] = ${JSON.stringify(records, null, 2)};\n` +
`export const DLC_SOMBER_WEAPONS = ${JSON.stringify(dlcSomber, null, 2)} as const;\n` +
`${generatedNormalizer}\n` +
`const SORTED_WEAPON_UPGRADE_RECORDS = [...WEAPON_UPGRADE_RECORDS].sort((a, b) => b.name.length - a.name.length);\n` +
`export function findWeaponUpgradeRecords(value: string): WeaponUpgradeRecord[] {\n` +
`  const source = \` \${normal(value)} \`;\n` +
`  const matches = SORTED_WEAPON_UPGRADE_RECORDS.filter((entry) => source.includes(\` \${normal(entry.name)} \`));\n` +
`  return matches\n` +
`    .filter((entry) => !matches.some((other) => other !== entry && normal(other.name).includes(normal(entry.name))))\n` +
`    .sort((a, b) => source.indexOf(\` \${normal(a.name)} \`) - source.indexOf(\` \${normal(b.name)} \`));\n` +
`}\n` +
`export function findWeaponUpgradeRecord(value: string): WeaponUpgradeRecord | undefined {\n` +
`  return findWeaponUpgradeRecords(value)[0];\n` +
`}\n` +
`export function weaponUpgradePath(value: string): "standard" | "somber" | "none" {\n` +
`  const record = findWeaponUpgradeRecord(value);\n` +
`  if (record) return record.type === "Unique 10" ? "somber" : record.type === "Unique 0" ? "none" : "standard";\n` +
`  const source = \` \${normal(value)} \`;\n` +
`  return DLC_SOMBER_WEAPONS.some((name) => source.includes(\` \${normal(name)} \`)) ? "somber" : "standard";\n` +
`}\n`;

  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${records.length} wiki.gg weapon records.`);
}

async function refreshGeneratedRuntime() {
  const source = await readFile(outputPath, "utf8");
  const next = source.replace(/const normal = \(value: string\) => value\.normalize\("NFKD"\).*?\.trim\(\);/, generatedNormalizer);
  if (next === source) throw new Error("Generated weapon normalizer was not found or was already current.");
  await writeFile(outputPath, next, "utf8");
  console.log("Refreshed the generated weapon lookup runtime without refetching the wiki.gg catalogue.");
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.includes("--refresh-runtime")) await refreshGeneratedRuntime();
  else await main();
}
