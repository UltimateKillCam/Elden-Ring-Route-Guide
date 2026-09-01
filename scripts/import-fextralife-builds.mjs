import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outputPath = resolve(root, "app", "wiki-builds.ts");
const wikiApi = "https://eldenring.wiki.fextralife.com/api.php";
const sourceCategory = "Build_Guides";
const userAgent = "TarnishedTogetherRoutePlanner/1.0 (personal build-planner data import)";
const EXPECTED_BUILD_COUNT = 171;
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const phaseOverrides = new Map([
  ["Knight of Thorns", "dlc"], ["Acolyte", "late"], ["Black Blade Slicer", "late"],
  ["Cipher Prophet", "mid"], ["Flying Mantis", "late"], ["Ghostflame Warrior", "late"],
  ["Roundtable Assassin", "late"], ["Silent Spellblade", "late"], ["Zealous Fury Templar", "late"],
  ["Level 30 Poison/Bleed Wretch", "late"], ["Level 60 St. Trina's Confessor", "late"],
  ["Level 75 Sanguine Lightning Assassin", "late"], ["Level 80/90 Sorcerer Duelist", "late"],
]);

const decode = (value) => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&middot;/gi, "·")
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

const correctSourceText = (value) => value
  .replace(/[’‘]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/\bShadown Sunflower Blossom\b/g, "Shadow Sunflower Blossom")
  .replace(/\bKnight Comet\b/g, "Night Comet")
  .replace(/\bEkzyke's Decay\b/g, "Ekzykes's Decay")
  .replace(/\bGreat Glinstone Shard\b/g, "Great Glintstone Shard")
  .replace(/\bPrince of Death Staff\b/g, "Prince of Death's Staff")
  .replace(/\bFlame Grant me Strength\b/gi, "Flame, Grant Me Strength")
  .replace(/\bCarian Filigree Crest\b/g, "Carian Filigreed Crest")
  .replace(/\bAssasin's Cerulean Dagger\b/g, "Assassin's Cerulean Dagger")
  .replace(/\bGreat-Jars Arsenal\b/g, "Great-Jar's Arsenal")
  .replace(/\bSord Lance\b/g, "Sword Lance")
  .replace(/\bLighting Spear\b/g, "Lightning Spear")
  .replace(/\bEarly one\b/g, "Early on")
  .replace(/\boutpit\b/g, "output")
  .replace(/\btheir teams burns\b/g, "their team burns")
  .replace(/\bFlame-Shrouded Cracked Tear\b/g, "Flame-Shrouding Cracked Tear")
  .replace(/\bSacred Scorpion Charm\/Fire Scorpion Charm\b/g, "Fire Scorpion Charm");

const splitItems = (value) => value
  .replace(/Flame, Grant Me Strength/gi, (match) => match.replace(",", "<comma>"))
  .replace(/Burn, O Flame!/gi, (match) => match.replace(",", "<comma>"))
  .replace(/Flame, Fall Upon Them/gi, (match) => match.replace(",", "<comma>"))
  .replace(/O, Flame!/gi, (match) => match.replace(",", "<comma>"))
  .split(/,|\.\s+|\s+(?:&|and\/or|and|or)\s+/i)
  .map((item) => item.replace(/<comma>/g, ",").trim())
  .map((item) => item.replace(/^(?:and|or)\s+/i, "").trim())
  .map((item) => item === "Rancor" ? "Rancorcall" : item)
  .filter((item) => item && !/^(?:n\/?a|none|not specified by source)$/i.test(item));

const memeAnchors = new Set(["blueballer", "kungfukatarist"]);

function cleanName(rawHeading) {
  return text(rawHeading)
    .replace(/^Elden Ring\s*/i, "")
    .replace(/\s*\((?:[^)]*(?:build|beginner|level|shadow of the erdtree|all game|journey)[^)]*)\)\s*$/i, "")
    .replace(/\s+(?:Build\s+Guide|Guide\s+Build|Build|Guide)\s*$/i, "")
    .trim();
}

function phaseFor(name, fields, source) {
  const override = phaseOverrides.get(name);
  if (override) return override;
  const descriptor = `${fields.tagline || ""} ${fields.level || ""} ${source.slice(0, 1500)}`.toLowerCase();
  if (/shadow of the erdtree|\bsote\b|\bdlc\b/.test(descriptor)) return "dlc";
  if (/beginner|low-level/.test(descriptor)) return "early";
  const level = Number(`${fields.level || ""} ${fields.tagline || ""}`.match(/(?:level\s*)?(\d{2,3})/i)?.[1] || 0);
  if (level && level <= 40) return "early";
  if (level && level <= 90) return "mid";
  if (/all[ -]?game/.test(descriptor)) return "late";
  return "late";
}

function levelFor(fields, phase) {
  const explicit = correctSourceText(text(fields.level || fields.tagline || ""));
  if (explicit) return explicit;
  return { early: "Beginner / all game", mid: "Midgame", late: "Endgame / NG+", dlc: "Shadow of the Erdtree" }[phase];
}

function statCodes(value) {
  const replacements = [
    [/\b(?:strength|str)\b/i, "STR"], [/\b(?:dexterity|dex)\b/i, "DEX"], [/\b(?:intelligence|int)\b/i, "INT"],
    [/\b(?:faith|fai|fth)\b/i, "FAI"], [/\b(?:arcane|arc)\b/i, "ARC"], [/\b(?:vigor|vig)\b/i, "VIG"],
    [/\b(?:mind|mnd|min)\b/i, "MND"], [/\b(?:endurance|end)\b/i, "END"],
  ];
  const codes = replacements.filter(([pattern]) => pattern.test(value)).map(([, code]) => code);
  return [...new Set(codes)].join(" / ") || "Source stats";
}

function mechanicFor(value) {
  const lower = value.toLowerCase();
  if (/parry|critical|backstab/.test(lower)) return "Critical attacks";
  if (/bleed|hemorrhage|poison|scarlet rot|frostbite|sleep|madness/.test(lower)) return "Status buildup";
  if (/block counter|guard counter|barricade|greatshield|shield crash/.test(lower)) return "Guard counters";
  if (/jump attack|claw talisman|raptor's black feathers/.test(lower)) return "Jump attacks";
  if (/charged|war cry|roar/.test(lower)) return "Charged attacks";
  if (/stance|stagger|colossal|great hammer/.test(lower)) return "Stance damage";
  if (/bow|crossbow|greatbow|cannon|arrow/.test(lower)) return "Ranged attacks";
  if (/sorcer|incantation|spell|seal|staff/.test(lower)) return "Spell damage";
  if (/successive|dual wield|powerstance|twinblade|fist|claw/.test(lower)) return "Light attacks";
  return "Skill damage";
}

function startingClass(value) {
  const classes = ["Vagabond", "Warrior", "Hero", "Bandit", "Astrologer", "Prophet", "Samurai", "Prisoner", "Confessor", "Wretch"];
  return classes.find((candidate) => new RegExp(`\\b${candidate}\\b`, "i").test(value)) || "Not specified";
}

const cleanWikiText = (value = "") => correctSourceText(text(value
  .replace(/\[https?:\/\/[^\s\]]+\s+([^|\]]+)(?:\|[^\]]*)?\]/g, "$1")
  .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, page, label) => label || page)
  .replace(/'{2,}/g, "")
  .replace(/\{\{([^{}|]+)(?:\|[^{}]*)?\}\}/g, "$1")));

function sourceSection(source, headingPattern) {
  const headings = [...source.matchAll(/<htmltag\b[^>]*tagname=["']h2["'][^>]*>(.*?)<\/htmltag>|^={2,}\s*(.*?)\s*={2,}\s*$/gim)];
  const headingIndex = headings.findIndex((match) => headingPattern.test(cleanWikiText(match[1] || match[2] || "")));
  if (headingIndex < 0) return "";
  const start = headings[headingIndex].index + headings[headingIndex][0].length;
  const end = headings[headingIndex + 1]?.index ?? source.length;
  return source.slice(start, end);
}

function sourceProse(value) {
  return value
    .replace(/\{\|[\s\S]*?\|\}/g, " ")
    .replace(/<div\b[^>]*>[\s\S]*?<\/div>/gi, " ")
    .replace(/<youtube>[\s\S]*?<\/youtube>/gi, " ")
    .split(/\n\s*\n+/)
    .map((paragraph) => cleanWikiText(paragraph))
    .filter((paragraph) => paragraph.length >= 24 && !/^(?:Related Elden Ring Builds|Category:|https?:\/\/)/i.test(paragraph));
}

function sourceGameplay(source, fallback) {
  const why = sourceProse(sourceSection(source, /^Why Play\b/i));
  const how = sourceProse(sourceSection(source, /^How to Play\b/i));
  const gear = sourceProse(sourceSection(source, /\bBuild Gear$/i));
  const stats = sourceProse(sourceSection(source, /\bBuild Stats and Attributes$/i));
  const sentences = (paragraphs) => paragraphs.flatMap((paragraph) => {
    const protectedText = paragraph.replace(/\bSt\./g, "St<dot>").replace(/(\d)\.(\d)/g, "$1<dot>$2");
    return (protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map((sentence) => sentence.replace(/<dot>/g, ".").trim());
  });
  const useful = (sentence) => /\b(?:use|using|cast|attack|strike|block|guard|counter|critical|stealth|dodge|roll|jump|shoot|fire|charge|buff|debuff|stance|skill|spell|weapon|bow|shield|staff|seal|damage|range|melee|boss|enemy|frost|bleed|poison|rot|sleep|madness|stagger|poise)\b/i.test(sentence)
    && !/\b(?:attribute allocation|at level \d+ (?:are|is)|anything above those numbers|to use everything in this build|check that against your Endurance|full set comes to|no longer applies its buff|has been patched)\b/i.test(sentence)
    && !/^\d+(?:\.\d+)? in total\b/i.test(sentence);
  const whySentences = sentences(why);
  const howSentences = sentences(how);
  const gearSentences = sentences(gear);
  const statSentences = sentences(stats);
  const selected = [
    ...whySentences.filter(useful).slice(0, 3),
    ...howSentences.filter(useful).slice(0, 3),
  ]
    .filter((sentence, index, values) => values.findIndex((candidate) => candidate.toLowerCase() === sentence.toLowerCase()) === index);
  for (const supplements of [gearSentences, statSentences]) {
    for (const sentence of supplements.filter(useful)) {
      if (selected.length >= 4) break;
      if (!selected.some((candidate) => candidate.toLowerCase() === sentence.toLowerCase())) selected.push(sentence);
    }
  }
  if (!selected.length) return fallback;
  let result = "";
  for (const sentence of selected) {
    if (result && `${result} ${sentence}`.length > 900) break;
    result = `${result}${result ? " " : ""}${sentence}`;
  }
  return result || fallback;
}

export function parseBuildLoadoutWikitext(source) {
  if (typeof source !== "string" || !source.trim()) throw new Error("Fextralife build wikitext is empty.");
  const start = source.search(/\{\{\s*Template:BuildLoadout\b/i);
  if (start < 0) throw new Error("Could not locate Template:BuildLoadout.");
  let depth = 0;
  let end = -1;
  for (let index = start; index < source.length - 1; index += 1) {
    const pair = source.slice(index, index + 2);
    if (pair === "{{") { depth += 1; index += 1; }
    else if (pair === "}}") {
      depth -= 1;
      index += 1;
      if (depth === 0) { end = index + 1; break; }
    }
  }
  if (end < 0) throw new Error("Template:BuildLoadout is not closed.");
  const rawFields = {};
  let activeKey;
  for (const line of source.slice(start, end).split("\n")) {
    const parameter = line.match(/^\s*\|\s*([a-z][a-z0-9]*)\s*=\s*(.*)$/i);
    if (parameter) {
      activeKey = parameter[1].toLowerCase();
      rawFields[activeKey] = parameter[2];
    } else if (activeKey && !/^\s*\}\}/.test(line)) rawFields[activeKey] += ` ${line.trim()}`;
  }
  const fields = Object.fromEntries(Object.entries(rawFields).map(([key, value]) => [key, cleanWikiText(value)]));
  if (!fields.name) throw new Error("Template:BuildLoadout has no name.");
  return fields;
}

const pageUrl = (title) => `https://eldenring.wiki.fextralife.com/${encodeURIComponent(title.replace(/ /g, "_"))}`;
const usable = (value) => value && !/^(?:n\/?a|none|-+|not specified)$/i.test(value);
const combine = (...values) => values.filter(usable).join("; ") || "Not specified by source";
const primaryChoice = (value) => usable(value) ? value.split(/\s+or\s+/i)[0].trim() : "";
const idSlug = (name) => name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const sourceCategories = (categories) => [...new Set(categories
  .map((category) => category.replace(/^Category:/, "").replace(/_/g, " "))
  .filter((category) => /^(?:PvE|PvP|Strength|Dexterity|Intelligence|Faith|Arcane) Builds$/.test(category)))];

const fieldFallbacks = new Map([
  ["Knight of Thorns", {
    class: "Any", primarystats: "Arcane, Vigor", secondarystats: "Mind, Faith, Intelligence",
    weapon: "Ripple Blade or any blood-loss weapon", offhand: "Albinauric Staff or Staff of the Guilty", skills: "Wild Strikes",
    talismans: "Lord of Blood's Exultation, Graven-Mass Talisman, Dragoncrest Greatshield Talisman, Radagon Icon",
    armor: "Alberich's Set", spells: "Impenetrable Thorns", flask: "At least 5 Cerulean, remaining Crimson",
  }],
  ["Level 30 Poison/Bleed Wretch", { talismans: "Radagon's Soreseal" }],
  ["Level 80/90 Sorcerer Duelist", { weapon: "Azur's Glintstone Staff" }],
]);
const fieldOverrides = new Map([
  ["All-Knowing Sage", {
    skills: "Night-and-Flame Stance",
    talismans: "Godfrey Icon, Graven-Mass Talisman, Flock's Canvas Talisman, Magic Scorpion Charm",
  }],
  ["Acolyte", { weapon: "Keen Greatsword, Bolt of Gransax", sealstaff: "Frenzied Flame Seal, Erdtree Seal or Gravel Stone Seal", spells: "Golden Vow, Flame Grant Me Strength, Bloodflame Blade, Electrify Armament, Greyoll's Roar" }],
  ["Black Blade Slicer", {
    weapon: "Black Knife, Maliketh's Black Blade, Serpent Bow", skills: "Blade of Death, Destined Death, Mighty Shot",
    talismans: "Rotten Winged Sword Insignia, Shard of Alexander, Crucible Feather Talisman, Radagon Icon",
  }],
  ["Champion of Rot", { offhand: "Dragon Communion Seal" }],
  ["Cipher Prophet", {
    weapon: "Cipher Pata", offhand: "Finger Seal", skills: "Unblockable Blade",
    talismans: "Two Fingers Heirloom, Green Turtle Talisman", spells: "Golden Vow", armor: "Knight Set",
  }],
  ["Flying Mantis", { talismans: "Claw Talisman" }],
  ["Silent Spellblade", {
    talismans: "Shard of Alexander, Magic Scorpion Charm, Godfrey Icon, Dragoncrest Greatshield Talisman",
    crystaltear: "Greenburst Crystal Tear, Magic-Shrouding Cracked Tear",
  }],
  ["Zealous Fury Templar", { weapon: "Blasphemous Blade", offhand: "Brass Shield", talismans: "Claw Talisman", skills: "Taker's Flames" }],
  ["Level 60 St. Trina's Confessor", {
    talismans: "Radagon's Soreseal, Winged Sword Insignia, Green Turtle Talisman, Dragoncrest Greatshield Talisman",
  }],
  ["Level 75 Sanguine Lightning Assassin", {
    weapon: "Bolt of Gransax, Dragon King's Cragblade", skills: "Ancient Lightning Spear, Thundercloud Form, Bloodhound's Step, Beast's Roar",
    talismans: "Concealing Veil, Shard of Alexander, Godfrey Icon, Millicent's Prosthesis",
    crystaltear: "Dexterity-knot Crystal Tear, Lightning-Shrouding Cracked Tear",
  }],
  ["Level 80/90 Sorcerer Duelist", { spells: "Carian Slicer, Swift Glintstone Shard, Comet, Carian Piercer, Terra Magica, Eternal Darkness" }],
  ["Roundtable Assassin", { spells: "Assassin's Approach, Darkness, Rejection, Shadow Bait, Lord's Aid, Lord's Heal" }],
  ["Blasphemous Beastmaster", { weapon: "Blasphemous Blade, Cinquedea, Clawmark Seal" }],
  ["Dragon God", { weapon: "Bloodfiend's Fork, Dragon Communion Seal", armor: "Rock Heart transformation (no armour)" }],
  ["Dragon Priestess", { weapon: "Coded Sword, Erdtree Seal" }],
  ["Sword Saint", { spells: "Golden Vow" }],
  ["Frost Paladin", { spells: "Blessing's Boon" }],
  ["Moonveil Resurrected", { spells: "" }],
  ["Stormblade Samurai", { spells: "" }],
  ["Star-Lined Samurai", { spells: "" }],
]);
const skillFallbacks = new Map([
  ["All-Knowing Sage", "Night-and-Flame Stance"],
  ["Acolyte", "Ancient Lightning Spear"],
  ["Dragon Priest", "No Skill"],
  ["Dragon Priestess", "Unblockable Blade"],
  ["Elementalist", "No Skill"],
  ["Gravity Sorcerer", "No Skill"],
  ["Maternal Mage", "No Skill"],
  ["Messmer Flame", "Flame Skewer"],
  ["Moonveil Resurrected", "Transient Moonlight"],
  ["Pyromancer", "No Skill"],
  ["Red Lightning", "No Skill"],
  ["Stormblade Samurai", "Storm Blade"],
  ["Vampiric Knight", "Prayerful Strike"],
  ["Warrior Wizard", "No Skill"],
]);
const legacyPatchBuilds = new Set(["Level 80/90 Sorcerer Duelist"]);

export function parseFextralifeBuildPage({ title, wikitext, categories = [] }) {
  const parsedFields = parseBuildLoadoutWikitext(wikitext);
  const name = cleanName(parsedFields.name || title);
  const fields = { ...parsedFields };
  for (const [key, value] of Object.entries(fieldFallbacks.get(name) || {})) if (!usable(fields[key])) fields[key] = value;
  Object.assign(fields, fieldOverrides.get(name));
  const phase = phaseFor(name, fields, wikitext);
  const level = levelFor(fields, phase);
  const statsText = combine(fields.primarystats, fields.secondarystats);
  const weapon = combine(primaryChoice(fields.weapon), primaryChoice(fields.altweapon || fields.alternateweapon));
  const spells = splitItems(fields.spells || "").filter((item) => !/^(?:optional|any other|anything you want|choose from|definitely utilize|two fingers incantations|namely:)\b/i.test(item) && !/[.;].{24,}/.test(item));
  let offhand = combine(primaryChoice(fields.offhand), primaryChoice(fields.shield), primaryChoice(fields.sealstaff));
  if (spells.length) {
    const equipped = `${weapon} ${offhand}`;
    const dualCatalyst = /Staff of the Great Beyond/i.test(equipped);
    const needsStaff = /\b(?:glint|comet|phalanx|sorcer|terra magica|moon|rancor|meteor|carian|haima|zamora?|icecrag|rock sling|briars?|thorns?)\b/i.test(spells.join(" ")) || (/\bINT\b/.test(statCodes(statsText)) && !/\bFAI\b/.test(statCodes(statsText)));
    const needsSeal = /\b(?:golden vow|flame|lightning|black flame|incant|blessing|heal|rejection|darkness|bloodflame|electrify|dragon|aeonia|pest|swarm|mist|bloodboon|elden stars|gurranq|wrath)\b/i.test(spells.join(" ")) || (/\bFAI\b/.test(statCodes(statsText)) && !/\bINT\b/.test(statCodes(statsText)));
    const supports = [];
    if (!dualCatalyst && needsStaff && !/\bstaff\b/i.test(equipped)) supports.push(phase === "early" ? "Demi-Human Queen's Staff" : "Academy Glintstone Staff");
    if (!dualCatalyst && needsSeal && !/\bseal\b/i.test(equipped)) supports.push("Finger Seal");
    if (supports.length) offhand = combine(offhand === "Not specified by source" ? "" : offhand, ...supports);
  }
  if (offhand === "Not specified by source") offhand = "No off-hand item required";
  const guideCategories = sourceCategories(categories);
  if (phase === "dlc") guideCategories.push("SOTE Builds");
  if (/all[ -]?game/i.test(fields.tagline || "")) guideCategories.push("All Game Builds");
  const pvp = guideCategories.includes("PvP Builds");
  const anchor = idSlug(name);
  const mechanic = mechanicFor(Object.values(fields).join(" "));
  const unavailable = `Published from ${level}`;
  const phases = { early: unavailable, mid: unavailable, late: unavailable, dlc: unavailable };
  const phaseOrder = ["early", "mid", "late", "dlc"];
  for (const candidate of phaseOrder.slice(phaseOrder.indexOf(phase))) phases[candidate] = weapon;
  const physick = splitItems(fields.crystaltear || "").slice(0, 2).join(", ") || (phase === "early" ? "Opaline Bubbletear, Crimsonburst Crystal Tear" : "Opaline Hardtear, Greenburst Crystal Tear");
  const skill = usable(fields.skills) ? fields.skills : skillFallbacks.get(name) || "Use the named weapon's default skill";
  let talismans = splitItems(fields.talismans || "").filter((item) => !/more suggested|more talismans/i.test(item));
  if (talismans.some((item) => item.startsWith("Rotten Winged Sword Insignia")) && talismans.includes("Millicent's Prosthesis")) {
    talismans = talismans.filter((item) => item !== "Millicent's Prosthesis");
    if (!talismans.some((item) => item.includes("Winged Sword Insignia"))) talismans.push("Winged Sword Insignia");
  }
  talismans = [...new Set(talismans)].slice(0, 4);
  const fallbackPlaystyle = `Published ${level.toLowerCase()} setup using ${weapon}${usable(skill) ? ` with ${skill}` : ""}.`;
  const researchedPlaystyle = sourceGameplay(wikitext, fallbackPlaystyle);
  return {
    id: `fextra-${anchor}`,
    name,
    stats: statCodes(statsText),
    role: pvp ? "Published PvP build" : "Published build",
    playstyle: `${researchedPlaystyle}${legacyPatchBuilds.has(name) ? " The source's obsolete chain-casting note is not used." : ""}`,
    complexity: legacyPatchBuilds.has(name) ? "Published legacy guide" : "Published guide",
    phases,
    tags: ["fextralife", pvp ? "pvp" : "pve", phase, mechanic.toLowerCase().replace(/\s+/g, "-"), ...(legacyPatchBuilds.has(name) ? ["legacy-source"] : []), ...(memeAnchors.has(anchor) ? ["meme", "cosplay"] : [])],
    startingClass: startingClass(fields.class || ""),
    mechanic,
    collection: "Fextralife",
    guideCategories,
    availableFrom: phase,
    publishedLoadout: {
      level,
      weapon,
      offhand,
      skill,
      talismans,
      armour: usable(fields.armor) ? fields.armor : "Not specified by source",
      spells,
      flask: `${usable(fields.flask) ? fields.flask : spells.length ? "Balanced Crimson/Cerulean charges" : "Mostly Crimson, 1-2 Cerulean"}; Physick: ${physick}`,
      stats: statsText,
    },
    source: { label: `Fextralife: ${name}`, url: pageUrl(title) },
  };
}

export function parseFextralifeBuilds(pages, { expectedCount = EXPECTED_BUILD_COUNT } = {}) {
  if (!Array.isArray(pages) || !pages.length) throw new Error("Fextralife build page collection is empty.");
  const records = pages.map(parseFextralifeBuildPage);
  if (records.length !== expectedCount) throw new Error(`Expected ${expectedCount} Fextralife builds, parsed ${records.length}.`);
  const duplicateIds = records.filter((record, index) => records.findIndex((candidate) => candidate.id === record.id) !== index);
  const duplicateNames = records.filter((record, index) => records.findIndex((candidate) => candidate.name.toLowerCase() === record.name.toLowerCase()) !== index);
  if (duplicateIds.length) throw new Error(`Duplicate Fextralife build IDs: ${duplicateIds.map((record) => record.id).join(", ")}`);
  if (duplicateNames.length) throw new Error(`Duplicate Fextralife build names: ${duplicateNames.map((record) => record.name).join(", ")}`);
  const uncategorized = records.filter((record) => !record.guideCategories.length);
  if (uncategorized.length) throw new Error(`Builds missing source categories: ${uncategorized.map((record) => record.id).join(", ")}`);
  for (const obsolete of ["Mage", "Status Blademaster", "Dark Knight"]) {
    if (records.some((record) => record.name === obsolete)) throw new Error(`Obsolete Fextralife build was imported: ${obsolete}`);
  }
  const requiredAdditions = ["Knight of Thorns", "Champion of Rot", "Acolyte", "Black Blade Slicer", "Cipher Prophet", "Flying Mantis", "Ghostflame Warrior", "Roundtable Assassin", "Silent Spellblade", "Zealous Fury Templar", "Level 30 Poison/Bleed Wretch", "Level 60 St. Trina's Confessor", "Level 75 Sanguine Lightning Assassin", "Level 80/90 Sorcerer Duelist"];
  const missingAdditions = requiredAdditions.filter((name) => !records.some((record) => record.name === name));
  if (expectedCount === EXPECTED_BUILD_COUNT && missingAdditions.length) throw new Error(`Verified Fextralife additions are missing: ${missingAdditions.join(", ")}`);
  if (expectedCount === EXPECTED_BUILD_COUNT && records.filter((record) => record.tags.includes("pvp")).length !== 4) throw new Error("Expected exactly four published PvP builds.");
  if (expectedCount === EXPECTED_BUILD_COUNT) {
    const genericDescriptions = records.filter((record) => /^Published .* setup using /i.test(record.playstyle));
    if (genericDescriptions.length) throw new Error(`Fextralife source guidance is missing for: ${genericDescriptions.map((record) => record.name).join(", ")}`);
    const duplicateDescriptions = records.filter((record, index) => records.findIndex((candidate) => candidate.playstyle.toLowerCase() === record.playstyle.toLowerCase()) !== index);
    if (duplicateDescriptions.length) throw new Error(`Duplicate Fextralife gameplay descriptions: ${duplicateDescriptions.map((record) => record.name).join(", ")}`);
  }
  return records;
}

const fetchWithRetry = async (url, attempts = 4) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": userAgent } });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) throw new Error(`${url} returned ${response.status}`);
    await sleep(750 * attempt);
  }
  throw new Error(`Could not fetch ${url}`);
};

async function main() {
  const categoryParams = new URLSearchParams({ action: "query", list: "categorymembers", cmtitle: `Category:${sourceCategory}`, cmlimit: "500", cmtype: "page", format: "json", formatversion: "2" });
  const members = (await (await fetchWithRetry(`${wikiApi}?${categoryParams}`)).json())?.query?.categorymembers || [];
  const titles = members.map((member) => member.title).filter((title) => / Build$/.test(title));
  if (titles.length !== EXPECTED_BUILD_COUNT) throw new Error(`Expected ${EXPECTED_BUILD_COUNT} canonical Build Guides pages, received ${titles.length}.`);
  const pages = [];
  for (let start = 0; start < titles.length; start += 50) {
    const params = new URLSearchParams({
      action: "query", prop: "revisions|categories", rvprop: "content", rvslots: "main", cllimit: "500",
      redirects: "1", titles: titles.slice(start, start + 50).join("|"), format: "json", formatversion: "2",
    });
    const response = await (await fetchWithRetry(`${wikiApi}?${params}`)).json();
    for (const page of response?.query?.pages || []) {
      const wikitext = page?.revisions?.[0]?.slots?.main?.content;
      if (!wikitext || page.missing) throw new Error(`Fextralife build page is missing: ${page.title}`);
      pages.push({ title: page.title, wikitext, categories: (page.categories || []).map((category) => category.title) });
    }
    if (start + 50 < titles.length) await sleep(350);
  }
  const records = parseFextralifeBuilds(pages);
  const output = `// Generated from canonical Fextralife Build Guides pages by scripts/import-fextralife-builds.mjs.\n` +
    `// Do not hand-edit sourced loadouts; rerun the importer against the live MediaWiki API.\n` +
    `import type { Build } from "./data";\n\n` +
    `export const wikiBuilds: Build[] = ${JSON.stringify(records, null, 2)};\n`;
  await writeFile(outputPath, output, "utf8");
  console.log(`Wrote ${records.length} canonical Fextralife builds to ${outputPath}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await main();
