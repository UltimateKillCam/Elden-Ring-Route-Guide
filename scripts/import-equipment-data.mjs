import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const JERP_COMMIT = "2ad5e0ee88209855531a8b3ec4bf5d68bb1b0105";
const JERP_DATA_URL = `https://raw.githubusercontent.com/jerpdoesgames/EldenRingArmorOptimizer/${JERP_COMMIT}/armor/data/armor.js`;
const JERP_REPOSITORY_URL = "https://github.com/jerpdoesgames/EldenRingArmorOptimizer";
const JERP_LIVE_URL = "https://jerp.tv/eldenring/armor/";
const JERP_LICENSE_URL = "https://github.com/jerpdoesgames/EldenRingArmorOptimizer/blob/main/LICENSE";
const EXPECTED_JERP_ARMOUR_COUNT = 704;
const EXPECTED_REFERENCED_PIECE_COUNT = 269;
const REGULATION_117_SHA256 = "FB4AFD25E70EFFC9F9523D3ABA89B1FB3E08B0800D8EFB9A535CAB038C5E8BBD";

export const REGULATION_117_ARMOUR_SUPPLEMENT = [
  { itemID: 5340000, name: "Broken Gold Mask", slotType: 1, weight: 2, poise: 2 },
  { itemID: 5340100, name: "Gold Tattoo (Chest)", slotType: 2, weight: 2.2, poise: 5 },
  { itemID: 5340200, name: "Gold Tattoo (Arm)", slotType: 3, weight: 0.6, poise: 1 },
  { itemID: 5340300, name: "Gold Tattoo (Leg)", slotType: 4, weight: 3.5, poise: 4 },
  { itemID: 5350000, name: "Silver Grooved Helm", slotType: 1, weight: 3, poise: 6 },
  { itemID: 5350100, name: "Silver Grooved Armor", slotType: 2, weight: 7.1, poise: 16 },
  { itemID: 5350200, name: "Silver Grooved Gauntlets", slotType: 3, weight: 2.4, poise: 3 },
  { itemID: 5350300, name: "Silver Grooved Greaves", slotType: 4, weight: 4.4, poise: 8 },
  { itemID: 5351100, name: "Silver Grooved Armor (Altered)", slotType: 2, weight: 6.5, poise: 12 },
  { itemID: 5360000, name: "Leontiel's Hat", slotType: 1, weight: 3.2, poise: 3 },
  { itemID: 5360100, name: "Leontiel's Armor", slotType: 2, weight: 8.3, poise: 8 },
  { itemID: 5360200, name: "Leontiel's Leather Gloves", slotType: 3, weight: 1.9, poise: 2 },
  { itemID: 5360300, name: "Leontiel's Boots", slotType: 4, weight: 4.7, poise: 5 },
  { itemID: 5361000, name: "Leontiel's Hat (Altered)", slotType: 1, weight: 3, poise: 3 },
  { itemID: 5370000, name: "Steel Helm", slotType: 1, weight: 7.9, poise: 13 },
  { itemID: 5370100, name: "Steel Armor", slotType: 2, weight: 18.5, poise: 35 },
  { itemID: 5370200, name: "Steel Gauntlets", slotType: 3, weight: 6.1, poise: 10 },
  { itemID: 5370300, name: "Steel Greaves", slotType: 4, weight: 11.3, poise: 19 },
];

const specificationFiles = ["app/wiki-builds.ts", "app/meme-builds.ts", "app/sourced-builds.ts"];

// Set names used by the sourced build prose are not rows in Jerp's piece-level
// table. Keep their default, unaltered four-piece expansions explicit here.
const setAliases = {
  "Vagabond starting armour": ["Vagabond Knight Helm", "Vagabond Knight Armor", "Vagabond Knight Gauntlets", "Vagabond Knight Greaves"],
  "Warrior starting armour": ["Blue Cloth Cowl", "Blue Cloth Vest", "Warrior Gauntlets", "Warrior Greaves"],
  "Hero starting armour": ["Champion Headband", "Champion Pauldron", "Champion Bracers", "Champion Gaiters"],
  "Bandit starting armour": ["Bandit Mask", "Bandit Garb", "Bandit Manchettes", "Bandit Boots"],
  "Astrologer starting armour": ["Astrologer Hood", "Astrologer Robe", "Astrologer Gloves", "Astrologer Trousers"],
  "Prophet starting armour": ["Prophet Blindfold", "Prophet Robe", "Prophet Trousers"],
  "Samurai starting armour": ["Land of Reeds Helm", "Land of Reeds Armor", "Land of Reeds Gauntlets", "Land of Reeds Greaves"],
  "Prisoner starting armour": ["Prisoner Iron Mask", "Prisoner Clothing", "Prisoner Trousers"],
  "Confessor starting armour": ["Confessor Hood", "Confessor Armor", "Confessor Gloves", "Confessor Boots"],
  "Confessor Set": ["Confessor Hood", "Confessor Armor", "Confessor Gloves", "Confessor Boots"],
  "Idus Knight starting armour": ["Silver Grooved Helm", "Silver Grooved Armor", "Silver Grooved Gauntlets", "Silver Grooved Greaves"],
  "Heavy Knight starting armour": ["Steel Helm", "Steel Armor", "Steel Gauntlets", "Steel Greaves"],
  "Gold Tattoo Set": ["Broken Gold Mask", "Gold Tattoo (Chest)", "Gold Tattoo (Arm)", "Gold Tattoo (Leg)"],
  "Leontiel's Set": ["Leontiel's Hat", "Leontiel's Armor", "Leontiel's Leather Gloves", "Leontiel's Boots"],
  "Silver Grooved Set": ["Silver Grooved Helm", "Silver Grooved Armor", "Silver Grooved Gauntlets", "Silver Grooved Greaves"],
  "Steel Set": ["Steel Helm", "Steel Armor", "Steel Gauntlets", "Steel Greaves"],
  "Alberich's Set": ["Alberich's Pointed Hat", "Alberich's Robe", "Alberich's Bracers", "Alberich's Trousers"],
  "Spellblade Set": ["Spellblade's Pointed Hat", "Spellblade's Traveling Attire", "Spellblade's Gloves", "Spellblade's Trousers"],
  "Spellblades Set": ["Spellblade's Pointed Hat", "Spellblade's Traveling Attire", "Spellblade's Gloves", "Spellblade's Trousers"],
  "Banished Knight Set": ["Banished Knight Helm", "Banished Knight Armor", "Banished Knight Gauntlets", "Banished Knight Greaves"],
  "Beast Champion Set": ["Beast Champion Helm", "Beast Champion Armor", "Beast Champion Gauntlets", "Beast Champion Greaves"],
  "Black Knife Set": ["Black Knife Hood", "Black Knife Armor", "Black Knife Gauntlets", "Black Knife Greaves"],
  "Black Knight Set": ["Black Knight Helm", "Black Knight Armor", "Black Knight Gauntlets", "Black Knight Greaves"],
  "Bull-Goat Set": ["Bull-Goat Helm", "Bull-Goat Armor", "Bull-Goat Gauntlets", "Bull-Goat Greaves"],
  "Carian Knight Set": ["Carian Knight Helm", "Carian Knight Armor", "Carian Knight Gauntlets", "Carian Knight Greaves"],
  "Leyndell Knight Set": ["Leyndell Knight Helm", "Leyndell Knight Armor", "Leyndell Knight Gauntlets", "Leyndell Knight Greaves"],
  "Crucible Axe Set": ["Crucible Axe Helm", "Crucible Axe Armor", "Crucible Gauntlets", "Crucible Greaves"],
  "Divine Bird Set": ["Divine Bird Helm", "Divine Bird Warrior Armor", "Divine Bird Warrior Gauntlets", "Divine Bird Warrior Greaves"],
  "Fingerprint Set": ["Fingerprint Helm", "Fingerprint Armor", "Fingerprint Gauntlets", "Fingerprint Greaves"],
  "Gaius's Set": ["Gaius's Helm", "Gaius's Armor", "Gaius's Gauntlets", "Gaius's Greaves"],
  "General Radahn Set": ["Radahn's Redmane Helm", "Radahn's Lion Armor", "Radahn's Gauntlets", "Radahn's Greaves"],
  "Haligtree Knight Set": ["Haligtree Knight Helm", "Haligtree Knight Armor", "Haligtree Knight Gauntlets", "Haligtree Knight Greaves"],
  "Knight Set": ["Knight Helm", "Knight Armor", "Knight Gauntlets", "Knight Greaves"],
  "Maliketh's Set": ["Maliketh's Helm", "Maliketh's Armor", "Maliketh's Gauntlets", "Maliketh's Greaves"],
  "Land of Reeds Set": ["Land of Reeds Helm", "Land of Reeds Armor", "Land of Reeds Gauntlets", "Land of Reeds Greaves"],
  "Lionel's Set": ["Lionel's Helm", "Lionel's Armor", "Lionel's Gauntlets", "Lionel's Greaves"],
  "Night's Cavalry Set": ["Night's Cavalry Helm", "Night's Cavalry Armor", "Night's Cavalry Gauntlets", "Night's Cavalry Greaves"],
  "Oathseeker Knight Set": ["Oathseeker Knight Helm", "Oathseeker Knight Armor", "Oathseeker Knight Gauntlets", "Oathseeker Knight Greaves"],
  "Raging Wolf Set": ["Raging Wolf Helm", "Raging Wolf Armor", "Raging Wolf Gauntlets", "Raging Wolf Greaves"],
  "Blaidd's Set": ["Black Wolf Mask", "Blaidd's Armor", "Blaidd's Gauntlets", "Blaidd's Greaves"],
  "Rakshasa Set": ["Rakshasa Helm", "Rakshasa Armor", "Rakshasa Gauntlets", "Rakshasa Greaves"],
  "Redmane Knight Set": ["Redmane Knight Helm", "Redmane Knight Armor", "Redmane Knight Gauntlets", "Redmane Knight Greaves"],
  "Rellana's Set": ["Rellana's Helm", "Rellana's Armor", "Rellana's Gloves", "Rellana's Greaves"],
  "Royal Knight Set": ["Royal Knight Helm", "Royal Knight Armor", "Royal Knight Gauntlets", "Royal Knight Greaves"],
  "Scaled Armor Set": ["Scaled Helm", "Scaled Armor", "Scaled Gauntlets", "Scaled Greaves"],
  "Scaled Set": ["Scaled Helm", "Scaled Armor", "Scaled Gauntlets", "Scaled Greaves"],
  "Shadow Militiaman Set": ["Shadow Militiaman Helm", "Shadow Militiaman Armor", "Shadow Militiaman Gauntlets", "Shadow Militiaman Greaves"],
  "Solitude Set": ["Helm of Solitude", "Armor of Solitude", "Gauntlets of Solitude", "Greaves of Solitude"],
  "White Reed Set": ["Okina Mask", "White Reed Armor", "White Reed Gauntlets", "White Reed Greaves"],
  "Zamor Set": ["Zamor Mask", "Zamor Armor", "Zamor Bracelets", "Zamor Legwraps"],
};

// Corrections for the small number of colloquial names and source typos.
const nameAliases = {
  "Jar helm": "Jar",
  "Great Helm": "Greathelm",
  "Tree Coat": "Tree Surcoat",
  "Chain Gloves": "Chain Gauntlets",
  "Chain Greaves": "Chain Leggings",
  "Bull-Goats Gaunlets": "Bull-Goat Gauntlets",
  "Noble's Glove": "Noble's Gloves",
};

const genericPatterns = [
  /^n\/?a\b/i,
  /not specified/i,
  /cosmetic .* character/i,
  /no specific armou?r/i,
  /transformation \(no armou?r\)/i,
  /^(?:(?:the|they)\s+)?(?:any|heaviest|light|little or no)\b/i,
  /allows? (?:you )?to (?:medium|med|mid|light|fast) roll/i,
  /high poise/i,
  /high protection/i,
];

const normalize = (value) => value
  .normalize("NFKD")
  .replace(/[’‘]/g, "'")
  .toLowerCase()
  .replace(/[^a-z0-9']+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

export function parseJerpArmourSource(source, { expectedCount = EXPECTED_JERP_ARMOUR_COUNT } = {}) {
  if (typeof source !== "string" || !source.trim()) throw new Error("Jerp armour source is empty.");
  const sourceMatch = source.match(/const armor = (\[[\s\S]*\]);?\s*$/);
  if (!sourceMatch) throw new Error("Could not locate the Jerp armour array.");
  let armour;
  try {
    armour = JSON.parse(sourceMatch[1]);
  } catch (error) {
    throw new Error(`Could not parse the Jerp armour array: ${error.message}`);
  }
  if (!Array.isArray(armour)) throw new Error("Jerp armour data is not an array.");
  if (armour.length !== expectedCount) throw new Error(`Expected ${expectedCount} Jerp armour records, received ${armour.length}.`);
  const names = new Set();
  for (const [index, piece] of armour.entries()) {
    if (!piece || typeof piece !== "object" || Array.isArray(piece)) throw new Error(`Jerp armour record ${index} is not an object.`);
    if (typeof piece.name !== "string" || !piece.name.trim()) throw new Error(`Jerp armour record ${index} has no name.`);
    if (names.has(piece.name)) throw new Error(`Duplicate Jerp armour name: ${piece.name}`);
    if (!Number.isInteger(piece.itemID)) throw new Error(`Jerp armour record ${piece.name} has an invalid itemID.`);
    if (![1, 2, 3, 4].includes(piece.slotType)) throw new Error(`Jerp armour record ${piece.name} has an invalid slotType.`);
    if (!Number.isFinite(piece.weight) || piece.weight < 0) throw new Error(`Jerp armour record ${piece.name} has an invalid weight.`);
    if (!Number.isFinite(piece.poise) || piece.poise < 0) throw new Error(`Jerp armour record ${piece.name} has invalid poise.`);
    names.add(piece.name);
  }
  return armour;
}

export function assertNoUnresolvedArmourSpecifications(values) {
  if (!values.length) return;
  throw new Error(`Unresolved non-generic armour specifications:\n${[...new Set(values)].sort().map((value) => `- ${value}`).join("\n")}`);
}

export function regulationArmourRecords(records = REGULATION_117_ARMOUR_SUPPLEMENT) {
  if (records.length !== 18) throw new Error(`Expected 18 regulation 1.17 armour records, received ${records.length}.`);
  const ids = new Set();
  const names = new Set();
  for (const piece of records) {
    if (!Number.isInteger(piece.itemID) || piece.itemID <= 0) throw new Error(`Invalid regulation armour ID for ${piece.name}.`);
    if (ids.has(piece.itemID)) throw new Error(`Duplicate regulation armour ID: ${piece.itemID}`);
    if (names.has(piece.name)) throw new Error(`Duplicate regulation armour name: ${piece.name}`);
    if (![1, 2, 3, 4].includes(piece.slotType)) throw new Error(`Invalid regulation armour slot for ${piece.name}.`);
    if (!Number.isFinite(piece.weight) || piece.weight < 0 || !Number.isFinite(piece.poise) || piece.poise < 0) throw new Error(`Invalid regulation armour stats for ${piece.name}.`);
    ids.add(piece.itemID);
    names.add(piece.name);
  }
  return records;
}

async function main() {
  const response = await fetch(JERP_DATA_URL);
  if (!response.ok) throw new Error(`Could not download Jerp armour data: ${response.status} ${response.statusText}`);
  const jerpArmour = parseJerpArmourSource(await response.text());
  const allArmour = [...jerpArmour, ...regulationArmourRecords()];
  const byName = new Map(allArmour.map((piece) => [piece.name, piece]));
  if (byName.size !== allArmour.length) throw new Error("Duplicate armour name across Jerp and regulation 1.17 records.");

for (const [alias, names] of Object.entries(setAliases)) {
  for (const name of names) if (!byName.has(name)) throw new Error(`Unknown Jerp piece ${name} in set alias ${alias}`);
}
for (const [alias, name] of Object.entries(nameAliases)) {
  if (!byName.has(name)) throw new Error(`Unknown Jerp piece ${name} in name alias ${alias}`);
}

const specifications = [];
for (const file of specificationFiles) {
  const text = await readFile(path.join(root, file), "utf8");
  const fileSpecifications = [...text.matchAll(/"?armour"?\s*:\s*"([^"]*)"/g)].map((match) => match[1]);
  if (!fileSpecifications.length) throw new Error(`No armour specifications found in ${file}.`);
  specifications.push(...fileSpecifications);
}

function resolveSpecification(value) {
  const text = normalize(value);
  const matches = [];
  for (const piece of allArmour) {
    const phrase = normalize(piece.name);
    const index = ` ${text} `.indexOf(` ${phrase} `);
    if (index >= 0) matches.push({ name: piece.name, index });
  }
  for (const [alias, name] of Object.entries(nameAliases)) {
    const index = ` ${text} `.indexOf(` ${normalize(alias)} `);
    if (index >= 0) matches.push({ name, index });
  }
  for (const [alias, names] of Object.entries(setAliases)) {
    const index = ` ${text} `.indexOf(` ${normalize(alias)} `);
    if (index >= 0) names.forEach((name, slotOffset) => matches.push({ name, index: index + slotOffset / 10 }));
  }
  return [...new Map(matches.sort((a, b) => a.index - b.index).map((match) => [match.name, match])).values()].map((match) => match.name);
}

const referencedNames = new Set();
Object.values(setAliases).flat().forEach((name) => referencedNames.add(name));
REGULATION_117_ARMOUR_SUPPLEMENT.forEach((piece) => referencedNames.add(piece.name));
const unresolvedSpecifications = [];
for (const specification of specifications) {
  const matches = resolveSpecification(specification);
  matches.forEach((name) => referencedNames.add(name));
  if (!matches.length && !genericPatterns.some((pattern) => pattern.test(specification.trim()))) unresolvedSpecifications.push(specification);
}
assertNoUnresolvedArmourSpecifications(unresolvedSpecifications);

const slotNames = { 1: "head", 2: "chest", 3: "arms", 4: "legs" };
const pieces = [...referencedNames]
  .map((name) => byName.get(name))
  .sort((a, b) => a.slotType - b.slotType || a.name.localeCompare(b.name))
  .map((piece) => ({ name: piece.name, slot: slotNames[piece.slotType], weight: piece.weight, poise: piece.poise }));
if (pieces.length !== EXPECTED_REFERENCED_PIECE_COUNT) throw new Error(`Expected ${EXPECTED_REFERENCED_PIECE_COUNT} referenced armour pieces, resolved ${pieces.length}.`);

const header = `// Generated by scripts/import-equipment-data.mjs.\n` +
  `// Armour stats: Jerp's Elden Ring Armor Optimizer plus the regulation 1.17 Tarnished Pack supplement.\n` +
  `// Data: ${JERP_DATA_URL}\n` +
  `// Repository: ${JERP_REPOSITORY_URL} (GPL-3.0; ${JERP_LICENSE_URL})\n` +
  `// Live reference: ${JERP_LIVE_URL}\n` +
  `// Scope: exact pieces referenced by the build armour specifications imported into app/data.ts.\n\n`;

const output = header +
`export type ArmourSlot = "head" | "chest" | "arms" | "legs";\n` +
`export type ArmourPiece = { name: string; slot: ArmourSlot; weight: number; poise: number };\n\n` +
`export const EQUIPMENT_DATA_SOURCES = ${JSON.stringify([
  { label: "Jerp Elden Ring Armor Optimizer", url: JERP_LIVE_URL, dataUrl: JERP_DATA_URL, repositoryUrl: JERP_REPOSITORY_URL, licenseUrl: JERP_LICENSE_URL, gameVersion: "1.16 / Shadow of the Erdtree", commit: JERP_COMMIT },
  { label: "Local Elden Ring regulation", url: "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-117", gameVersion: "1.17 / Tarnished Pack", regulationVersion: 11701000, sha256: REGULATION_117_SHA256 },
], null, 2)} as const;\n\n` +
`export const ARMOUR_PIECES: readonly ArmourPiece[] = ${JSON.stringify(pieces, null, 2)};\n\n` +
`export const ARMOUR_SET_ALIASES: Readonly<Record<string, readonly string[]>> = ${JSON.stringify(setAliases, null, 2)};\n\n` +
`export const ARMOUR_NAME_ALIASES: Readonly<Record<string, string>> = ${JSON.stringify(nameAliases, null, 2)};\n\n` +
`const NORMALIZED_GENERIC_ARMOUR = ${JSON.stringify(genericPatterns.map((pattern) => ({ source: pattern.source, flags: pattern.flags })), null, 2)}.map(({ source, flags }) => new RegExp(source, flags));\n` +
`const normalizeArmourText = (value: string) => value.normalize("NFKD").replace(/[’‘]/g, "'").toLowerCase().replace(/[^a-z0-9']+/g, " ").replace(/\\s+/g, " ").trim();\n` +
`const phraseIndex = (source: string, phrase: string) => (\` \${source} \`).indexOf(\` \${phrase} \`);\n` +
`export const ARMOUR_PIECE_BY_NAME = new Map(ARMOUR_PIECES.map((piece) => [piece.name, piece]));\n\n` +
`/** Splits source prose into canonical Jerp armour pieces, expanding named sets and ignoring generic roll advice. */\n` +
`export function splitArmourSpecification(value: string): ArmourPiece[] {\n` +
`  const source = normalizeArmourText(value);\n` +
`  if (!source) return [];\n` +
`  const candidates: Array<{ names: readonly string[]; index: number; length: number }> = [];\n` +
`  for (const piece of ARMOUR_PIECES) { const phrase = normalizeArmourText(piece.name); const index = phraseIndex(source, phrase); if (index >= 0) candidates.push({ names: [piece.name], index, length: phrase.length }); }\n` +
`  for (const [alias, name] of Object.entries(ARMOUR_NAME_ALIASES)) { const phrase = normalizeArmourText(alias); const index = phraseIndex(source, phrase); if (index >= 0) candidates.push({ names: [name], index, length: phrase.length }); }\n` +
`  for (const [alias, names] of Object.entries(ARMOUR_SET_ALIASES)) { const phrase = normalizeArmourText(alias); const index = phraseIndex(source, phrase); if (index >= 0) candidates.push({ names, index, length: phrase.length }); }\n` +
`  const selected = candidates.sort((a, b) => b.length - a.length || a.index - b.index).filter((candidate, position, sorted) => !sorted.slice(0, position).some((other) => other.index < candidate.index + candidate.length && candidate.index < other.index + other.length));\n` +
`  const matches = selected.sort((a, b) => a.index - b.index).flatMap((match) => match.names.map((name, slotOffset) => ({ name, index: match.index + slotOffset / 10 })));\n` +
`  const ordered = [...new Map(matches.map((match) => [match.name, match])).values()];\n` +
`  return ordered.map(({ name }) => ARMOUR_PIECE_BY_NAME.get(name)).filter((piece): piece is ArmourPiece => Boolean(piece));\n` +
`}\n\n` +
`/** True only when a specification contains no named equipment and is generic/N/A prose. */\n` +
`export function isGenericArmourSpecification(value: string): boolean {\n` +
`  return splitArmourSpecification(value).length === 0 && NORMALIZED_GENERIC_ARMOUR.some((pattern) => pattern.test(value.trim()));\n` +
`}\n`;

await writeFile(path.join(root, "app/equipment-data.ts"), output, "utf8");
console.log(`Wrote ${pieces.length} referenced armour pieces from ${new Set(specifications).size} unique specifications.`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) await main();
