import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourcePath = resolve(root, "work", "fextralife-builds.html");
const outputPath = resolve(root, "app", "wiki-builds.ts");
const html = await readFile(sourcePath, "utf8");

const decode = (value) => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const text = (value = "") => decode(value
  .replace(/<br\s*\/?>/gi, ", ")
  .replace(/<[^>]+>/g, " "))
  .replace(/\s+/g, " ")
  .replace(/\s+,/g, ",")
  .trim();

const splitItems = (value) => value
  .split(/,|\s+&\s+|\s+or\s+/i)
  .map((item) => item.trim())
  .filter(Boolean);

const buildHeadings = [...html.matchAll(/<h3 class="bonfire"><a id="([^"]+)"><\/a>([\s\S]*?)<\/h3>/gi)];
const buildAnchors = new Set(buildHeadings.map((match) => match[1].toLowerCase()));
const seen = new Set();
const seenNames = new Set();
const records = [];
const memeAnchors = new Set(["blueballer", "kungfukatarist"]);

const categoryRanges = [
  ["Intelligence Builds", 'title="Elden Ring Builds#intelligence" href="/Builds#intelligence"', 'title="Elden Ring Builds#faith" href="/Builds#faith"'],
  ["Faith Builds", 'title="Elden Ring Builds#faith" href="/Builds#faith"', 'title="Elden Ring Builds#arcane" href="/Builds#arcane"'],
  ["Arcane Builds", 'title="Elden Ring Builds#arcane" href="/Builds#arcane"', 'title="Elden Ring Builds#strength" href="/Builds#strength"'],
  ["Strength Builds", 'title="Elden Ring Builds#strength" href="/Builds#strength"', 'title="Elden Ring Builds#dexterity" href="/Builds#dexterity"'],
  ["Dexterity Builds", 'title="Elden Ring Builds#dexterity" href="/Builds#dexterity"', "See all our SOTE Builds"],
  ["All SOTE Builds", "See all our SOTE Builds", "See all our Best Builds"],
];

const fextraCategories = new Map();
for (const [category, startMarker, endMarker] of categoryRanges) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) continue;
  const anchors = [...html.slice(start, end).matchAll(/href="\/Builds#([^"]+)"/gi)]
    .map((match) => match[1].toLowerCase())
    .filter((anchor) => buildAnchors.has(anchor));
  for (const anchor of anchors) {
    const categories = fextraCategories.get(anchor) || [];
    if (!categories.includes(category)) categories.push(category);
    fextraCategories.set(anchor, categories);
  }
}

function cleanName(rawHeading) {
  return text(rawHeading)
    .replace(/^Elden Ring\s*/i, "")
    .replace(/\s*\((?:[^)]*(?:build|beginner|level|shadow of the erdtree|all game|journey)[^)]*)\)\s*$/i, "")
    .replace(/\s+(?:Build\s+Guide|Guide\s+Build|Build|Guide)\s*$/i, "")
    .trim();
}

function phaseFor(heading) {
  const lower = heading.toLowerCase();
  if (/shadow of the erdtree|\bsote\b|\bdlc\b/.test(lower)) return "dlc";
  if (/all game|beginner/.test(lower)) return "early";
  const level = Number(lower.match(/level\s*(\d+)/)?.[1] || 0);
  if (level && level <= 40) return "early";
  if (level && level <= 80) return "mid";
  return "late";
}

function levelFor(heading, phase) {
  const explicit = heading.match(/\(([^)]*(?:Level|Beginner|Shadow of the Erdtree|All Game|Journey)[^)]*)\)/i)?.[1];
  if (explicit) return text(explicit);
  return { early: "Beginner / all game", mid: "Midgame", late: "Endgame / NG+", dlc: "Shadow of the Erdtree" }[phase];
}

function statCodes(value) {
  const replacements = [
    ["Strength", "STR"], ["Dexterity", "DEX"], ["Intelligence", "INT"],
    ["Faith", "FAI"], ["Arcane", "ARC"], ["Vigor", "VIG"],
    ["Mind", "MND"], ["Endurance", "END"],
  ];
  const codes = replacements.filter(([name]) => new RegExp(`\\b${name}\\b`, "i").test(value)).map(([, code]) => code);
  return [...new Set(codes)].join(" / ") || "Source stats";
}

function mechanicFor(value) {
  const lower = value.toLowerCase();
  if (/parry|critical|backstab/.test(lower)) return "Critical attacks";
  if (/block counter|guard counter|barricade|greatshield|shield crash/.test(lower)) return "Guard counters";
  if (/jump attack|claw talisman|raptor's black feathers/.test(lower)) return "Jump attacks";
  if (/charged|war cry|roar/.test(lower)) return "Charged attacks";
  if (/stance|stagger|colossal|great hammer/.test(lower)) return "Stance damage";
  if (/bleed|hemorrhage|poison|scarlet rot|frostbite|sleep|madness/.test(lower)) return "Status buildup";
  if (/bow|crossbow|greatbow|cannon|arrow/.test(lower)) return "Ranged attacks";
  if (/sorcer|incantation|spell|seal|staff/.test(lower)) return "Spell damage";
  if (/successive|dual wield|powerstance|twinblade|fist|claw/.test(lower)) return "Light attacks";
  return "Skill damage";
}

function startingClass(value) {
  const classes = ["Vagabond", "Warrior", "Hero", "Bandit", "Astrologer", "Prophet", "Samurai", "Prisoner", "Confessor", "Wretch"];
  return classes.find((candidate) => new RegExp(`\\b${candidate}\\b`, "i").test(value)) || "Not specified";
}

for (let index = 0; index < buildHeadings.length; index += 1) {
  const match = buildHeadings[index];
  const anchor = match[1].toLowerCase();
  if (seen.has(anchor)) continue;
  const end = buildHeadings[index + 1]?.index ?? html.length;
  const block = html.slice(match.index + match[0].length, end);
  const fields = {};

  for (const listItem of block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const itemHtml = listItem[1];
    const strongLabel = itemHtml.match(/^\s*<strong>([\s\S]*?)<\/strong>\s*:/i);
    const plain = text(itemHtml);
    const plainLabel = plain.match(/^([^:]{2,42}):\s*(.+)$/);
    const label = text(strongLabel?.[1] || plainLabel?.[1] || "");
    if (!label) continue;
    const rawValue = strongLabel
      ? itemHtml.slice((strongLabel.index || 0) + strongLabel[0].length)
      : plainLabel?.[2] || "";
    fields[label] ??= text(rawValue);
  }

  const heading = text(match[2]);
  const weapon = fields["Main Weapon"] || fields["Main Weapon/s"] || fields.Weapon || fields["Right Hand"] || "Not specified by source";
  const hasBuildFields = fields.Class || fields.Weapon || fields["Main Weapon"] || fields["Main Weapon/s"];
  if (!hasBuildFields) continue;

  const phase = phaseFor(heading);
  const level = levelFor(heading, phase);
  const unavailable = `Published from ${level}`;
  const phases = { early: unavailable, mid: unavailable, late: unavailable, dlc: unavailable };
  const phaseOrder = ["early", "mid", "late", "dlc"];
  for (const candidate of phaseOrder.slice(phaseOrder.indexOf(phase))) phases[candidate] = weapon;

  const statsText = [fields["Primary Stats"], fields["Secondary Stats"], fields.Stats].filter(Boolean).join("; ");
  const spells = [fields.Spells, fields["Primary Spells"], fields["Main Spells"], fields["Support Spells"], fields["Other Spells"]].filter(Boolean).join(", ");
  const combined = Object.values(fields).join(" ");
  const name = cleanName(match[2]);
  if (seenNames.has(name.toLowerCase())) {
    seen.add(anchor);
    continue;
  }
  const offhand = [fields.Shield, fields["Off-Hand Weapon"], fields["Off-Hand Weapon (Optional)"], fields["Optional Off-Hand"], fields.Seal, fields.Catalyst, fields["Left Hand"]].filter(Boolean).join("; ") || "Not specified by source";
  const talismans = splitItems(fields.Talismans || "Not specified by source");
  const physick = fields["Crystal Tear"] || fields["Mix of Wonderous Physick"] || "Not specified by source";

  records.push({
    id: `fextra-${anchor}`,
    name,
    stats: statCodes(statsText),
    role: "Published build",
    playstyle: `Published ${level.toLowerCase()} setup using ${weapon}${fields.Skills ? ` with ${fields.Skills}` : ""}.`,
    complexity: "Published guide",
    phases,
    tags: ["fextralife", phase, mechanicFor(combined).toLowerCase().replace(/\s+/g, "-"), ...(memeAnchors.has(anchor) ? ["meme", "cosplay"] : [])],
    startingClass: startingClass(fields.Class || ""),
    mechanic: mechanicFor(combined),
    collection: "Fextralife",
    guideCategories: fextraCategories.get(anchor) || [],
    availableFrom: phase,
    publishedLoadout: {
      level,
      weapon,
      offhand,
      skill: fields.Skills || "Not specified by source",
      talismans,
      armour: fields.Armor || "Not specified by source",
      spells: splitItems(spells),
      flask: `${fields["Flask Spread"] || "Flask spread not specified"}; Physick: ${physick}`,
      stats: statsText || "Not specified by source",
    },
    source: {
      label: `Fextralife: ${name}`,
      url: `https://eldenring.wiki.fextralife.com/Builds#${anchor}`,
    },
  });
  seen.add(anchor);
  seenNames.add(name.toLowerCase());
}

const output = `// Generated from https://eldenring.wiki.fextralife.com/Builds by scripts/import-fextralife-builds.mjs.\n` +
  `// Do not hand-edit sourced loadouts; rerun the importer against a freshly downloaded page.\n` +
  `import type { Build } from "./data";\n\n` +
  `export const wikiBuilds: Build[] = ${JSON.stringify(records, null, 2)};\n`;

await writeFile(outputPath, output, "utf8");
console.log(`Wrote ${records.length} sourced Fextralife builds to ${outputPath}`);
