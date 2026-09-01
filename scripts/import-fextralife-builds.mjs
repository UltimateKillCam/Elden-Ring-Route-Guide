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
    && !/^(?:\d+(?:\.\d+)? in total\b|It can no longer be used\b|Skill of\b|Archery Skill\b|A truly knightly Skill\b|Follow up with\b|Ready the bow\b|Sheathe blade\b|Hold your armament\b|Imbue the\b|Defensive skill\b|Carian royal prestige\b|The ghostflame adds\b|Flaming Strike \(\d+ FP\b)/i.test(sentence);
  const whySentences = sentences(why);
  const howSentences = sentences(how);
  const gearSentences = sentences(gear);
  const statSentences = sentences(stats);
  const selected = [
    ...whySentences.filter(useful).slice(0, 4),
    ...howSentences.filter(useful).slice(0, 6),
  ]
    .filter((sentence, index, values) => values.findIndex((candidate) => candidate.toLowerCase() === sentence.toLowerCase()) === index);
  for (const supplements of [gearSentences, statSentences]) {
    for (const sentence of supplements.filter(useful)) {
      if (selected.length >= 8) break;
      if (!selected.some((candidate) => candidate.toLowerCase() === sentence.toLowerCase())) selected.push(sentence);
    }
  }
  if (!selected.length) return fallback;
  let result = "";
  for (const sentence of selected) {
    if (result && `${result} ${sentence}`.length > 1500) break;
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
const playstyleOverrides = new Map([
  ["Archer", "This is a true weapon-only archer with no melee fallback. Open normal encounters with the Longbow and Mighty Shot, using the longer draw only while the target is unaware or locked in an animation; once an enemy crosses into short range, swap to the Shortbow so rolling and jumping shots preserve movement. Barrage is reserved for a boss recovery, a large stationary target, or a status-arrow window because holding it in neutral drains FP and stamina while leaving no guard option. Normal arrows handle weak enemies economically, while expensive ammunition should be saved for targets that survive long enough to justify it. Dexterity raises bow damage, Mind buys more skill use, and Vigor and Endurance prevent one missed spacing check from ending the fight. The build succeeds by controlling distance and planning ammunition, not by trading hits."],
  ["Barbarian", "The Zweihander turns War Cry into a charged-attack build: activate the skill before contact, then its temporary weapon buff replaces the normal heavy with a forward-driving charge that can interrupt light enemies and build stance damage quickly. In the field, draw one target at a time, start the charged heavy outside its swing, and use a normal light only when the first impact leaves a safe finish. Against bosses, refresh War Cry before the opener, release one fully charged heavy into a long recovery, and take the critical after a stance break instead of emptying the stamina bar on another swing. Axe Talisman raises fully charged attacks, while high Vigor, Endurance and poise make a deliberate trade survivable without giving up a medium roll. War Cry costs FP only when refreshed, but every transformed heavy consumes enough stamina that one must remain in reserve for defence. Fast or evasive bosses can step around the linear charge, and a missed Zweihander heavy has a long recovery, so the build rewards prediction rather than repeated R2 inputs."],
  ["Dragon Priest", "The Finger Seal is the weapon: this beginner caster does not need a melee armament to complete its combat loop. Catch Flame is the fast, close-range answer for single enemies and punish windows, while Dragonfire is held to sweep a pack or a broad boss hitbox with its cone; release it early if the target turns toward you rather than being locked into the long breath animation. Start a pull from range, let enemies group together, cast Dragonfire across the line, then use Catch Flame on anything that reaches casting distance. Mind supports repeated breaths, Vigor covers the risk of casting close, Faith raises the early fire damage, and Arcane is added only as later dragon incantations require it. The setup spends FP quickly and has no shield or physical fallback, so fire-resistant enemies and aggressive bosses demand shorter casts and more Cerulean charges."],
  ["Sorcery Sentinel", "Watchdog's Staff gives this Strength/Dexterity bruiser two separate answers without requiring Intelligence: colossal jump and normal attacks deal strike damage up close, while Sorcery of the Crozier releases homing magic projectiles when a target refuses melee. Begin difficult fights with Golden Vow and Flame, Grant Me Strength from the seal, use a jump attack to start stance pressure, then continue only while the enemy remains in recovery; take the critical instead of spending stamina on another swing after the break. Ritual Sword and Magic Scorpion reward staying untouched before the ranged cast, Claw Talisman strengthens the jump opener, and Green Turtle restores the stamina the heavy weapon consumes. The projectile is a spacing tool rather than permission to spam, because its FP cost competes with the two buffs. Keep medium load and enough Vigor to survive a trade, but do not mistake the staff's range for a conventional sorcery build."],
  ["Paladin", "This beginner Paladin protects a summon or co-op partner with a one-handed weapon, Brass Shield and Finger Seal rather than trying to draw artificial threat. Cast Golden Vow before a hard pull so the whole group gains attack and defence, summon before entering the arena, then activate Barricade Shield when a boss string would otherwise exhaust stamina. Block the committed hit, answer with a guard counter, and return behind the shield instead of extending into an unsafe combo. Urgent Heal is the quick self-recovery; Heal is slower but can restore nearby allies when the arena is calm. Faith improves healing and support first, Vigor keeps blocked chip or elemental damage survivable, Endurance funds blocks and medium roll, and Strength stops at weapon and shield requirements. Unblockable attacks, elemental chip and empty stamina punish passive turtling, so dodging remains mandatory when the shield is the wrong answer."],
  ["Drake Knight", "Magma Wyrm's Scalesword supplies both the neutral weapon and the burst plan for this Strength/Faith bruiser. Cast Golden Vow and Flame, Grant Me Strength before a boss, fight normally with the curved greatsword until a long recovery appears, then use Magma Guillotine's leap and commit to the second chopping input only when the target cannot retaliate. The initial plunge delivers the immediate burst while the magma left on the floor punishes enemies that remain in place. Fire Scorpion Charm and Shard of Alexander amplify that punish, Carian Filigreed Crest makes repeated attempts cheaper, and Dragoncrest Greatshield offsets some of the defensive cost of staying close. The Clawmark Seal permits additional bestial or utility incantations, but they are optional rather than the main loop. Fire resistance and mobile bosses reduce the magma payoff, and forcing the follow-up through a short opening turns the skill's hyper armour into a losing trade."],
  ["Bloody Bowman", "Black Bow behaves like a longbow with the mobile shot options of a shortbow, so this build keeps pressure while rolling, jumping and landing rather than planting its feet. Use ordinary arrows for weak targets, Serpent Arrows to establish poison on durable enemies, and Bloodbone Arrows with Barrage when repeated hits can actually trigger hemorrhage. Against bosses, wait for a committed animation, fire Barrage through the full safe window, then move before stamina empties; single evasive targets are better handled with jump or roll shots. Arrow's Sting and Shard of Alexander raise direct and skill damage, while White Mask and Lord of Blood's Exultation are worthwhile only when the target can bleed. Ritual Sword rewards clean spacing but disappears after any damage. The setup has no melee safety net, consumes crafted ammunition continuously and loses much of its identity against enemies immune to both poison and bleed."],
  ["Black Blade Slicer", "This endgame hybrid layers Destined Death from several distinct tools rather than repeating one animation. Open from safety with the Black Knife's Blade of Death to cut maximum HP and start its burn, cast Black Blade when the longer incantation window is available, then move into Maliketh's Black Blade only for a punish large enough to contain Destined Death's committed swings. Reapplying the same source refreshes rather than stacks its effect, so rotate tools for coverage and use the Serpent Bow or status incantations when melee access is poor. Shard of Alexander strengthens the weapon skills, Radagon Icon shortens the casting side, and a shield or Black Knife armour supports a more cautious approach between bursts. The build can answer bleed, rot, frost and poison matchups, but that breadth demands Strength, Dexterity, Faith and Arcane requirements. Long animations and the spread stat budget are the price for percentage-based pressure against high-health PvE targets."],
  ["Ghostflame Warrior", "Helphen's Steeple is played as a heavy Strength/Intelligence greatsword, not as a back-line staff caster. Activate Ruinous Ghostflame before engagement to coat the blade with added magic damage and frost buildup, land charged heavies or jump attacks during real openings, then take the critical when the accumulated stance damage breaks the target. The frost proc supplies a burst and leaves the enemy taking increased damage, so refresh the weapon buff and continue physical pressure rather than chasing an immediate second proc. Armour above 51 poise helps a planned heavy survive light interruption, but medium load must be preserved for attacks that should be rolled. One Cerulean flask is usually enough because FP is spent on the weapon buff instead of a spell rotation. Magic-resistant or highly mobile enemies reduce the ghostflame portion, while reckless charged attacks still lose to faster boss strings despite the poise."],
  ["Roundtable Assassin", "The Roundtable Assassin separates infiltration, ordinary combat and executions across a large tool belt. Use Assassin's Approach or Assassin's Gambit to cross noisy ground and reach a backstab, Darkness or Shadow Bait to redirect groups, and the Crepus's Black-Key Crossbow to apply poison or scarlet rot before a dangerous target reaches melee. Ornamental Straight Swords handle sustained engagements; Miséricorde is swapped in only for backstabs, parries or stance-break criticals, where its critical modifier matters. The Wooden Greatshield offers a safe guard option when stealth fails, while Rejection creates space and Lord's Heal or Lord's Aid provides utility rather than damage. Dexterity leads weapon damage, Faith and Mind support the incantation kit, and 18 Endurance preserves medium load across the equipment swaps. Bosses cannot be hidden from, so the build must convert to status bolts, clean defence and critical opportunities instead of relying on stealth."],
  ["Sorcerer", "This legacy pure-caster route uses the Meteorite Staff and a compact spell bar built around range and FP efficiency. Glintstone Pebble is the default single-target cast, Glintstone Arc cuts through aligned groups, Great Glintstone Shard spends more FP for a stronger punish, and Loretta's Greatbow opens from extreme distance. Rock Sling deals physical damage and heavy stance pressure when magic resistance or a boss matchup makes glintstone inefficient; cast it with enough room for all three rocks to clear nearby walls. Carry a 100% physical shield only as an emergency block, then disengage instead of trying to trade like a spellblade. Intelligence is the damage priority, Mind determines how long the rotation lasts, and Vigor prevents a failed cast from becoming a one-shot. Determination remains listed by the historical source, but current rules do not let it increase sorcery damage, so it must not be treated as part of the buff sequence."],
  ["Samurai", "The beginner Samurai controls the first engagement with the Longbow, then finishes at katana range with Uchigatana rather than forcing one weapon into every situation. Mighty Shot is for an unaware target or a long boss recovery; ordinary arrows conserve FP while thinning a camp before it can surround you. When an enemy closes, hold Unsheathe only long enough to read the opening: use the fast horizontal follow-up for a short punish or crowd coverage, and the stronger vertical follow-up when there is time to build stance damage. Roll away and re-enter with Unsheathe instead of mashing the full katana light chain into retaliation. Dexterity raises both weapons, Vigor is the first safety investment, Endurance supports repeated bow and katana actions, and Mind only needs to cover deliberate skill use. The route has no spell buffs or heavy shield, so armour, ammunition discipline and clean dodge timing carry fights that resist bleed."],
  ["Magic Archer", "Horn Bow and Magic Arrows form the main long-range lane: the bow deals native magic damage and specifically improves Magic Arrows, while Mighty Shot converts a safe opening into one stronger guard-piercing hit. Keep the Misbegotten Shortbow ready with Rain of Arrows for a large or stationary target; its clustered impacts apply poison or bleed efficiently, but the 20 FP cost makes it a planned status setup rather than the default attack. If enemies surround the firing position or ammunition must be conserved, swap to the paired Lazuli Glintstone Swords and use their quick dual-wield strings to make space. Strength and Intelligence support the mixed bow damage, Vigor and armour allow one mistake, and Endurance keeps repeated draws from emptying stamina. Different arrow types are the build's matchup system, so restock before a dungeon instead of discovering mid-boss that the correct damage or status ammunition is gone. Fast enemies that constantly close distance force more sword use and expose the build's weaker melee investment."],
  ["Moonveil Samurai", "Moonveil is the centre of this level-50 spellblade, with the Academy Glintstone Staff covering situations where drawing the katana is unsafe. Loretta's Greatbow opens on distant priority targets, Glintstone Pebble supplies an efficient mid-range cast, and Carian Greatsword sweeps groups that would punish Moonveil's narrower attacks. At melee range, hold Transient Moonlight only through a confirmed opening: use the quick horizontal follow-up for groups or short recoveries and the vertical heavy follow-up when stance damage matters. After a stance break, take the critical so Assassin's Cerulean Dagger can refund FP, while Carian Filigreed Crest reduces the cost of reaching that break. Intelligence and Vigor lead the level plan, with Dexterity supporting Moonveil after its requirements are met. The build deals heavily concentrated magic damage and spends FP for both spells and skill attacks, so magic-resistant enemies and careless Transient Moonlight spam are its clearest problems."],
  ["Moonveil Shinobi", "This level-100 version coordinates Moonveil with a cold Uchigatana and Glintstone Phalanx so several stance and status hits arrive together. Cast the phalanx before entering, close behind its delayed blades, then release Transient Moonlight's heavy follow-up as they connect; the combined impact builds stance damage while the two katanas threaten hemorrhage and frostbite during continued pressure. Take non-boss criticals instead of extending the combo so Assassin's Cerulean Dagger refunds FP, and let Carian Filigreed Crest lower the cost of repeating the setup. Great Glintstone Shard and Loretta's Greatbow cover targets that will not allow melee, while Terra Magica is worthwhile only when a boss will remain inside the field. Intelligence and Vigor are primary, with Dexterity and Mind added after the weapons and casting rhythm are comfortable. The sequence loses efficiency if the phalanx fires before Moonveil is in range, and highly mobile or magic-resistant bosses can deny both the field spell and the synchronised burst."],
  ["Supreme Samurai", "Nagakiba's reach and a pure Dexterity investment make this a spacing-focused katana build rather than a dual-wield bleed race. Apply the grease that matches the encounter before committing, use ordinary thrusts and slashes to test the enemy's range, then enter Unsheathe only when a punish is available. The light follow-up comes out faster and is the safer answer when the recovery is uncertain; the heavy follow-up travels farther, deals more stance damage and belongs after a move you already know is finished. Shard of Alexander raises both releases, Dragoncrest Greatshield cushions close-range mistakes, and Great-Jar's Arsenal plus Bull-Goat's Talisman support the listed armour without surrendering medium roll or useful poise. Dexterity drives damage, Vigor keeps the duelist alive and Endurance funds armour, long attack strings and repeated stance entries. The build has no native projectile or spell lane, and enemies that resist the selected grease still have to be beaten through clean physical spacing and stance breaks."],
]);

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
  const researchedPlaystyle = playstyleOverrides.get(name) || sourceGameplay(wikitext, fallbackPlaystyle);
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
    const vagueDescriptions = records.filter((record) => record.playstyle.length < 600 || (record.playstyle.match(/[.!?]+/g) || []).length < 5);
    if (vagueDescriptions.length) throw new Error(`Fextralife gameplay descriptions are too shallow: ${vagueDescriptions.map((record) => record.name).join(", ")}`);
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
