import { wikiBuilds } from "./wiki-builds";
import { sourcedMemeBuilds } from "./meme-builds";
import { additionalSourcedBuilds } from "./sourced-builds";
import { weaponResolutions } from "./weapon-resolutions";
import { findWeaponUpgradeRecord } from "./weapon-upgrades";
import { applyQuestRoutePatches } from "./quest-route";

export type PhaseKey = "early" | "mid" | "late" | "dlc";

export type BuildSource = { label: string; url: string };

export type Build = {
  id: string;
  name: string;
  stats: string;
  role: string;
  playstyle: string;
  complexity: "Easy" | "Moderate" | "Advanced" | "Published guide" | "Published legacy guide";
  phases: Record<PhaseKey, string>;
  quest?: string;
  tags: string[];
  startingClass: "Vagabond" | "Warrior" | "Hero" | "Bandit" | "Astrologer" | "Prophet" | "Samurai" | "Prisoner" | "Confessor" | "Wretch" | "Idus Knight" | "Heavy Knight" | "Not specified";
  mechanic: string;
  collection: "Curated" | "Fextralife" | "Other guides" | "Meme / cosplay";
  availableFrom?: PhaseKey;
  publishedLoadout?: Omit<StageLoadout, "talismanSlots">;
  publishedStages?: Partial<Record<PhaseKey, Omit<StageLoadout, "talismanSlots">>>;
  phaseBridges?: Partial<Record<PhaseKey, string>>;
  guideCategories?: string[];
  source: BuildSource;
  /** True only when the loadout itself is traceable to a published build guide. */
  audited?: boolean;
};

const BUILD_SOURCES = {
  eip: "https://eip.gg/elden-ring/builds/pve/",
  pcGamerDlc: "https://www.pcgamer.com/games/rpg/shadow-of-the-erdtree-best-builds/",
  pcGamesN: "https://www.pcgamesn.com/elden-ring/builds-best",
  dlcWeapons: "https://eldenring.wiki.gg/wiki/Weapons_(Shadow_of_the_Erdtree)",
} as const;

function recommendStartingClass(stats: string, tags: string[]): Build["startingClass"] {
  const upper = stats.toUpperCase();
  const has = (stat: string) => upper.includes(stat);
  const count = ["STR", "DEX", "INT", "FAI", "ARC"].filter(has).length;
  if (count >= 4 || tags.includes("novelty")) return "Wretch";
  if (has("INT") && has("DEX")) return "Prisoner";
  if (has("STR") && has("DEX")) return "Vagabond";
  if (has("STR") && has("FAI")) return "Hero";
  if (has("DEX") && has("FAI")) return "Confessor";
  if (has("INT") && has("FAI")) return "Astrologer";
  if (has("ARC")) return "Bandit";
  if (has("INT")) return "Astrologer";
  if (has("FAI")) return "Prophet";
  if (has("DEX")) return "Samurai";
  if (has("STR")) return "Hero";
  return "Vagabond";
}

function inferMechanic(role: string, playstyle: string, tags: string[]) {
  const text = `${role} ${playstyle} ${tags.join(" ")}`.toLowerCase();
  if (/critical|parry|assassin/.test(text)) return "Critical attacks";
  if (/jump|aerial/.test(text)) return "Jump attacks";
  if (/guard|shield|counter/.test(text)) return "Guard counters";
  if (/charged|charge|roar/.test(text)) return "Charged attacks";
  if (/stance|breaker|colossal|great hammer|hammer/.test(text)) return "Stance damage";
  if (/multihit|twinblade|claw|fist|martial|dancer/.test(text)) return "Light attacks";
  if (/bow|crossbow|ranged|throw|artiller/.test(text)) return "Ranged attacks";
  if (/sorcer|spell|caster|intelligence/.test(text)) return "Spell damage";
  if (/bleed|poison|rot|frost|sleep|status/.test(text)) return "Status buildup";
  return "Skill damage";
}

const build = (
  id: string,
  name: string,
  stats: string,
  role: string,
  playstyle: string,
  phases: [string, string, string, string],
  tags: string[],
  complexity: Build["complexity"] = "Moderate",
  quest?: string,
  source?: BuildSource,
  mechanic?: string,
  startingClass?: Build["startingClass"],
): Build => ({
  id,
  name,
  stats,
  role,
  playstyle,
  complexity,
  phases: { early: phases[0], mid: phases[1], late: phases[2], dlc: phases[3] },
  tags,
  quest,
  startingClass: startingClass || recommendStartingClass(stats, tags),
  mechanic: mechanic || inferMechanic(role, playstyle, tags),
  collection: "Curated",
  audited: Boolean(source && source.url !== BUILD_SOURCES.dlcWeapons) || id === "quality-knight" || id === "colossal-hammer",
  source: source || {
    label: `${phases[3].replace(/ \+.*/, "").replace(/ \/.*/, "")} weapon reference`,
    url: `https://eldenring.wiki.gg/index.php?search=${encodeURIComponent(phases[3].replace(/ \+.*/, "").replace(/ \/.*/, ""))}`,
  },
});

const curatedBuilds: Build[] = [
  build("quality-knight", "Quality Knight", "STR / DEX", "Frontline", "Quality infusion keeps one Strength/Dexterity weapon honest at every stage: the Longsword and Claymore cover Limgrave with poking heavies and Stamp, the Quality Great Épée adds broad heavy sweeps, and Milady with Wing Stance closes the run. The field loop is poke and reset — running thrusts into approach animations, guard counters on shield enemies, single heavies when poise damage matters. Hold Wing Stance before bosses: the three-slash string pressures short recoveries, while the leaping thrust punishes whiffs with the kit's heaviest poise damage. Stonebarb Cracked Tear raises stance buildup behind every heavy, Curved Sword Talisman pays the guard counters the loop already uses, and Golden Vow covers the modest per-hit output of a split-stat weapon. End every string with stamina left to roll, because the leaping thrust commits hard enough to be punished in turn. Splitting levels across two attack stats ramps slower than a focused infusion, there is no native ranged tool, and stagger-immune opponents reduce the plan to plain R1 trading.", ["Longsword", "Claymore", "Quality Great Épée", "Milady + Wing Stance"], ["quality", "sword", "guard"], "Easy", undefined, undefined, "Stance damage"),
  build("heavy-greatsword", "Heavy Greatsword Knight", "STR", "Frontline", "Measured colossal swings, high poise and reliable stance damage.", ["Lordsworn's Greatsword", "Claymore", "Greatsword", "Greatsword of Solitude"], ["strength", "greatsword", "stance"], "Easy"),
  build("colossal-wanderer", "Colossal Wandering Swordsman", "STR / ARC", "Breaker", "Heavy-infused colossal swords establish the moveset; after Nokron, an Occult affinity adds Arcane scaling without changing the stat plan.", ["Heavy Zweihander", "Heavy Greatsword", "Occult Greatsword", "Ancient Meteoric Ore Greatsword"], ["strength", "arcane", "colossal"], "Advanced"),
  build("lightning-greataxe", "Lightning Greataxe", "STR / FAI", "Bruiser", "Heavy axe blows backed by buffs and late-game lightning mobility.", ["Greataxe", "Axe of Godrick", "Great Stars", "Death Knight's Longhaft Axe"], ["strength", "faith", "lightning"]),
  build("guard-hammer", "Guard-Counter Great Hammer", "STR / FAI", "Tank", "Blocks, counters and heals through pressure without becoming a shield exploit.", ["Morning Star", "Brick Hammer", "Great Stars + Prayerful Strike", "Black Steel Greathammer"], ["strength", "guard", "holy"], "Easy"),
  build("colossal-hammer", "Colossal Hammer", "STR", "Breaker", "Two or three charged hammer hits collapse most enemies, and the kit banks stance damage until a critical is guaranteed. Barbaric Roar keeps the Large Club and Great Club relevant early by turning heavy attacks into a forward-charging combo, while later weapons diversify: Endure lets the Giant-Crusher armour through a windup to guarantee its charged R2, and the Anvil Hammer's Golden Land detonates a ring of golden spears for burst and stance pressure after the slam. Field play is decisive spacing — walk targets down, swing once into attack recoveries, and never chain a second swing without stamina to roll. Axe Talisman raises charged-attack damage, Stonebarb Cracked Tear raises stance buildup, and Great-Jar's Arsenal pays for the heavy armour that makes trades winnable. Roar Medallion belongs only while Barbaric Roar is equipped, the kind of stage-specific swap this route demands. Whiffed charged R2s are long, punishable animations, fast evasive bosses deny the openings, and ranged enemies stall the walk-down indefinitely.", ["Large Club", "Great Club", "Giant-Crusher", "Anvil Hammer"], ["strength", "hammer", "stance"], "Easy", undefined, undefined, "Stance damage"),
  build("anchor-bruiser", "Piercing Status Bruiser", "STR / ARC", "Bruiser", "Pierce counters, sustain and a late frost/arcane pivot.", ["Battle Axe", "Rusted Anchor", "Great Stars", "Putrescence Cleaver"], ["strength", "arcane", "status"]),
  build("compact-axe", "Compact Axe Adventurer", "STR / DEX", "Skirmisher", "Fast axes evolve into summoned skeleton attacks and throwable steel.", ["Hand Axe", "Sacrificial Axe", "Rosus' Axe", "Smithscript Axe"], ["axe", "quality", "ranged"]),
  build("halberd-commander", "Halberd Commander", "STR / FAI", "Support", "Reach, charge attacks and a party-wide rally buff.", ["Halberd", "Golden Halberd", "Commander's Standard", "Death Knight's Longhaft Axe"], ["halberd", "support", "faith"], "Easy"),
  build("great-spear-paladin", "Great-Spear Paladin", "STR / DEX / FAI", "Tank", "Shield pokes and charged thrusts with ranged holy pressure later.", ["Lance", "Treespear", "Siluria's Tree", "Barbed Staff-Spear"], ["spear", "guard", "holy"], "Moderate", "Crucible and DLC progression"),
  build("strength-fist", "Strength Fist Fighter", "STR", "Breaker", "Endure-powered close combat and rapid stance breaks.", ["Caestus", "Spiked Caestus", "Star Fist", "Red Bear's Claw"], ["fist", "strength", "bleed"], "Advanced"),
  build("mobile-claw", "Mobile Claw Hunter", "DEX", "Skirmisher", "Quickstep, aerial slashes and controlled bleed pressure.", ["Hookclaws", "Raptor Talons", "Bloodhound Claws", "Beast Claw"], ["dexterity", "claw", "mobile"]),
  build("holy-board", "Holy Sword-and-Board", "FAI", "Tank", "Guard counters and Sacred Blade grow into a holy support setup.", ["Broadsword + Sacred Blade", "Broadsword + Sacred Blade", "Coded Sword", "Sword of Light"], ["faith", "holy", "guard"], "Easy"),
  build("guard-thrust", "Strength Guard-Thrust Specialist", "STR", "Tank", "A safe counter-hit specialist that graduates into an attacking shield weapon.", ["Great Épée", "Lance", "Serpent-Hunter", "Sword Lance"], ["strength", "thrust", "guard"], "Easy"),
  build("rapier-duelist", "Classical Rapier Duelist", "DEX", "Duelist", "Parries, counter-hits and precise thrusting attacks.", ["Rapier", "Rogier's Rapier +8", "Frozen Needle", "Main-gauche + Milady"], ["dexterity", "thrust", "parry"]),
  build("heavy-duelist", "Heavy-Thrusting Duelist", "DEX", "Duelist", "Running attacks and charged counter-thrusts rather than status spam.", ["Keen Great Épée", "Keen Great Épée", "Dragon King's Cragblade", "Sword Lance"], ["dexterity", "thrust", "lightning"]),
  build("samurai", "Traditional Samurai", "DEX", "Duelist", "Unsheathe evolves into long-reach katana pressure and a great-katana finale.", ["Uchigatana", "Nagakiba", "Hand of Malenia", "Keen Great Katana"], ["dexterity", "katana", "bleed"], "Moderate", "Yura quest"),
  build("dragon-samurai", "Dragon Hunter Samurai", "DEX", "Boss hunter", "Ice lightning for general play and a dragon-specialist DLC weapon.", ["Uchigatana", "Uchigatana", "Dragonscale Blade", "Dragon-Hunter's Great Katana + Dragonwound"], ["dexterity", "katana", "dragon"]),
  build("sacred-twinblade", "Sacred Twinblade", "DEX / FAI", "Striker", "Fast twinblade pressure that shifts between black flame and holy damage.", ["Twinblade", "Godskin Peeler", "Godskin Peeler + Black Flame Tornado", "Black Steel Twinblade"], ["dexterity", "faith", "twinblade"]),
  build("curved-dancer", "Curved-Sword Dancer", "DEX", "Striker", "Flowing multihit strings with deliberately restrained buff stacking.", ["Shamshir", "Scavenger's Curved Sword", "Flowing Curved Sword", "Dancing Blade of Ranah"], ["dexterity", "curved", "multihit"]),
  build("backhand", "Backhand Skirmisher", "DEX", "Skirmisher", "Dodges through attacks and answers from blind angles.", ["Shamshir", "Mantis Blade", "Flowing Curved Sword", "Backhand Blade + Blind Spot"], ["dexterity", "mobile", "curved"]),
  build("whip", "Whip Controller", "DEX", "Controller", "Long-range sweeps, charged Urumi heavies and measured status buildup.", ["Whip", "Urumi", "Hoslow's Petal Whip", "Tooth Whip"], ["dexterity", "whip", "control"], "Moderate", "Volcano Manor contracts"),
  build("reaper", "Reaper Pilgrim", "DEX / ARC", "Striker", "Wide scythe sweeps use Dexterity first, then Blood and Occult affinities add Arcane scaling before the flowing DLC finale.", ["Keen Scythe", "Blood Grave Scythe + Stormcaller", "Occult Grave Scythe + Stormcaller", "Obsidian Lamina"], ["reaper", "dexterity", "arcane"], "Advanced", "Ansbach quest"),
  build("lightning-spear", "Lightning Spear Thrower", "DEX / FAI", "Ranged striker", "Thrusts in melee and throws lightning at priority targets.", ["Short Spear", "Cross-Naginata", "Bolt of Gransax", "Spear of the Impaler"], ["dexterity", "faith", "lightning"]),
  build("mobile-archer", "Mobile Archer", "DEX", "Ranged", "Jump shots, Barrage and agile bow play with a light melee backup.", ["Shortbow", "Horn Bow", "Black Bow", "Ansbach's Longbow"], ["dexterity", "bow", "ranged"], "Advanced", "Ansbach quest choice"),
  build("crossbow", "Crossbow Engineer", "STR / DEX", "Ranged", "Meet Strength and Dexterity requirements first; ammunition choice then matters more than further damage-stat investment.", ["Light Crossbow", "Arbalest", "Pulley Crossbow", "Repeating Crossbow"], ["crossbow", "ranged", "utility"], "Moderate"),
  build("critical-assassin", "Critical-Hit Assassin", "DEX / FAI", "Specialist", "Parries and stance breaks convert into high-value critical attacks.", ["Misericorde", "Erdsteel Dagger", "Black Knife", "Main-gauche"], ["dexterity", "dagger", "critical"], "Advanced", "Kenneth Haight reward"),
  build("throwing-assassin", "Throwing-Blade Assassin", "DEX", "Ranged", "Starts with consumable throws and becomes a true ranged-dagger build.", ["Dagger + Kukri", "Black Knife", "Black Knife + utility dagger", "Smithscript Dagger"], ["dexterity", "dagger", "ranged"]),
  build("pure-sorcerer", "Pure Sorcerer", "INT", "Caster", "Efficient ranged sorcery with an optional finger-magic pivot in the DLC.", ["Demi-Human Queen's Staff", "Academy Glintstone Staff", "Carian Regal Scepter", "Maternal Staff"], ["intelligence", "sorcery", "ranged"], "Easy", "Thops and Ranni progression"),
  build("carian-greatsword", "Carian Greatsword Mage", "INT / FAI", "Spellblade", "Magic swordplay develops into a dual-school spellblade; Intelligence leads early while Faith is raised steadily for the same final setup.", ["Magic Longsword", "Sword of Night and Flame", "Sword of Night and Flame + Carian sword sorceries", "Rellana's Twin Blades"], ["intelligence", "faith", "spellblade", "quest"], "Advanced", "Caria Manor and Rellana progression"),
  build("dex-spellblade", "Dexterity Spellblade", "DEX / INT", "Spellblade", "Fast melee weapons with large-area magical weapon skills.", ["Magic Estoc", "Magic Estoc", "Death Ritual Spear", "Star-Lined Sword"], ["dexterity", "intelligence", "magic"]),
  build("gravity-knight", "Gravity Knight", "STR / INT", "Breaker", "Gravity pulls and heavy weapons stay on Strength and Intelligence from Limgrave onward; the late weapon remains effective throughout the DLC.", ["Lordsworn's Greatsword + Gravitas", "Meteoric Ore Blade", "Fallingstar Beast Jaw", "Fallingstar Beast Jaw + gravity sorceries"], ["strength", "intelligence", "gravity"], "Advanced"),
  build("frost-knight", "Frost Knight", "DEX / INT", "Controller", "Reliable physical damage with frostbite as a secondary payoff.", ["Cold Uchigatana", "Frozen Needle", "Zamor Curved Sword", "Cold Milady"], ["dexterity", "intelligence", "frost"]),
  build("death-knight", "Death Knight Sorcerer", "STR / INT", "Spellblade", "Summoned skeletons, ghostflame and mobile rancor pressure.", ["Sacrificial Axe", "Rosus' Axe", "Helphen's Steeple", "Spirit Sword"], ["intelligence", "death", "spellblade"]),
  build("magic-polearm", "Magic Polearm Scholar", "DEX / INT", "Spellblade", "Long-reaching weapon skills and a weapon that doubles as a catalyst.", ["Magic Great Épée", "Magic Great Épée", "Loretta's War Sickle", "Carian Sorcery Sword"], ["dexterity", "intelligence", "polearm"]),
  build("golden-scholar", "Golden Order Scholar", "INT / FAI", "Caster support", "A true dual-school caster that consolidates catalysts in the DLC.", ["Meteorite Staff + Finger Seal", "Carian Glintstone Staff + Finger Seal", "Prince of Death's Staff", "Staff of the Great Beyond"], ["intelligence", "faith", "caster"], "Advanced", "Ranni and Fia quests"),
  build("crucible-paladin", "Crucible Paladin", "STR / FAI", "Tank", "Durable melee backed by Crucible magic and measured healing.", ["Morning Star + Sacred Blade", "Golden Halberd", "Ordovis's Greatsword", "Black Steel Greathammer"], ["strength", "faith", "crucible"]),
  build("flame-knight", "Flame-Art Knight", "STR / DEX / FAI", "Bruiser", "Rotates between flaming sword pressure, magma and giant fire.", ["Flame Art Claymore", "Magma Wyrm's Scalesword", "Giant's Red Braid", "Queelign's Greatsword"], ["faith", "fire", "greatsword"]),
  build("blackflame", "Blackflame Apostle", "DEX / FAI", "Striker", "Percentage-based black flame pressure and a quick holy twinblade finish.", ["Flame Art Uchigatana + Godslayer's Seal", "Godslayer's Greatsword", "Godslayer's Greatsword + Godslayer's Seal", "Euporia"], ["faith", "blackflame", "twinblade"]),
  build("lightning-lancer", "Lightning Lancer", "DEX / FAI", "Striker", "Mounted thrusts and counter-hits become an aggressive blink-lightning style.", ["Lance", "Treespear", "Bolt of Gransax", "Death Knight's Twin Axes"], ["faith", "lightning", "spear"]),
  build("bestial-cleric", "Bestial Cleric", "STR / FAI", "Bruiser", "Throws stones at range and crushes openings in melee.", ["Large Club", "Cinquedea + Clawmark Seal", "Beastclaw Greathammer", "Devonia's Hammer"], ["strength", "faith", "bestial"], "Moderate", "Gurranq Deathroot rewards"),
  build("stormcaller", "Dragon-Cult Stormcaller", "FAI / DEX", "Caster", "Lightning incantations with a polearm fallback and optional arcane pivot.", ["Pike + Finger Seal", "Pike + Finger Seal", "Bolt of Gransax", "Flowerstone Gavel"], ["faith", "lightning", "dragon"], "Advanced"),
  build("frenzy", "Frenzied Pilgrim", "DEX / FAI", "Specialist", "Madness-flavoured fire that stays useful against immune PvE targets.", ["Short Spear + Frenzied Burst", "Vyke's War Spear", "Frenzied Flame Seal", "Frenzyflame Perfume Bottle"], ["faith", "frenzy", "fire"], "Moderate", "Hyetta quest"),
  build("pyromancer", "Fire Giant Pyromancer", "FAI / DEX", "Caster", "Close-range flame, giant fire and wide perfume clouds.", ["Finger Seal + Catch Flame", "Godslayer's Seal + Catch Flame", "Giant's Red Braid", "Firespark Perfume Bottle"], ["faith", "fire", "caster"]),
  build("bleed-duelist", "Bleed Duelist", "DEX / ARC", "Duelist", "Four distinct weapon skills keep bleed from becoming repetitive.", ["Reduvia", "Bloody Helice", "Morgott's Cursed Sword", "Obsidian Lamina"], ["dexterity", "arcane", "bleed"], "Moderate", "Ansbach quest"),
  build("poison-brawler", "Poison Brawler", "ARC / DEX", "Striker", "Poison enables burst windows while physical damage handles immunity.", ["Venomous Fang", "Venomous Fang", "Poison Antspur Rapier", "Poisoned Hand"], ["arcane", "poison", "fist"]),
  build("rot-duelist", "Scarlet-Rot Duelist", "DEX / ARC", "Duelist", "A thrusting poison start that matures into true scarlet rot weapons.", ["Estoc + Poisonous Mist", "Antspur Rapier", "Scorpion's Stinger", "Poleblade of the Bud"], ["dexterity", "arcane", "rot"]),
  build("dragon-communion", "Dragon-Communion Knight", "ARC / FAI", "Caster bruiser", "Dragon maw attacks break stance while arcane weapons cover fast openings.", ["Dragon Communion Seal + Reduvia", "Regalia of Eochaid", "Marais Executioner's Sword", "Flowerstone Gavel"], ["arcane", "faith", "dragon"]),
  build("sleep", "Sleep Swordsman", "DEX / INT", "Controller", "Uses sleep where it works and keeps a cold sidearm for immune enemies.", ["Sword of St. Trina", "Cold sidearm", "St. Trina's Torch", "Velvet Sword of St. Trina"], ["dexterity", "intelligence", "sleep"]),
  build("thrusting-shield", "Thrusting-Shield Vanguard", "STR / DEX", "Tank", "Conventional shield pokes evolve into a weapon that guards while attacking.", ["Short Spear + Heater Shield", "Great Épée + Towershield", "Lance + Ant's Skull Plate", "Carian Thrusting Shield"], ["guard", "thrust", "shield"], "Easy"),

  build("storm-vanguard", "Stormbound Vanguard", "STR / DEX", "Frontline", "Storm skills maintain pressure before a defensive DLC greatsword finish.", ["Longsword + Storm Blade", "Banished Knight's Halberd +8", "Stormhawk Axe", "Greatsword of Solitude"], ["storm", "quality", "stance"]),
  build("frostflail", "Frostflail Astronomer", "DEX / INT", "Controller", "Frost control evolves from flail counters into explosive perfume clouds.", ["Cold Flail", "Frozen Needle", "Bastard's Stars", "Chilling Perfume Bottle"], ["frost", "intelligence", "flail"]),
  build("dryleaf", "Dryleaf Disciple", "STR / DEX", "Breaker", "A light-load martial artist focused on Endure, counters and stance breaks.", ["Caestus", "Katar", "Star Fist", "Dryleaf Arts / Dane's Footwork"], ["martial", "quality", "fist"], "Advanced"),
  build("smithscript", "Smithscript Arsenalist", "STR / DEX", "Ranged utility", "A changing kit of thrown steel and ammunition for any engagement range.", ["Spear + Spectral Lance", "Spear + Spectral Lance", "Pulley Crossbow", "Smithscript Dagger, Curseblade's Cirque & Smithscript Spear"], ["quality", "ranged", "smithscript"], "Advanced"),
  build("retaliation", "Golden Retaliation Captain", "STR / FAI", "Tank support", "Reflects self-cast holy discs and enemy magic into shield projectiles.", ["Sacred Longsword + Heater Shield", "Sacred Longsword + Finger Seal", "Erdtree Greatshield", "Smithscript Shield"], ["faith", "shield", "support", "discus of light"], "Advanced"),
  build("nightblade", "Nightblade Fencer", "DEX", "Duelist", "Fast duelling with feints, flowing attacks and guard-piercing darkness.", ["Estoc", "Ornamental Straight Sword", "Nox Flowing Sword", "Sword of Night"], ["dexterity", "duelist", "night"]),
  build("blood-dancer", "Twinblade Blood Dancer", "DEX / ARC", "Striker", "Mobile multihit pressure without dual jump-attack spam.", ["Twinblade", "Eleonora's Poleblade", "Blood Godskin Peeler", "Falx"], ["dexterity", "arcane", "twinblade"]),
  build("bonebow", "Bonebow Beastmaster", "DEX / ARC", "Ranged", "Status arrows and spirit-assisted volleys with a light melee sidearm.", ["Shortbow", "Serpent Bow", "Pulley Bow", "Bone Bow"], ["dexterity", "arcane", "bow"], "Advanced"),
  build("artillerist", "Full Moon Artillerist", "STR / DEX / INT", "Ranged", "A viable novelty artillery route: meet the cannon's Strength requirement gradually while Dexterity and Intelligence support the Full Moon Crossbow.", ["Light Crossbow", "Full Moon Crossbow", "Jar Cannon", "Rabbath's Cannon"], ["strength", "dexterity", "intelligence", "crossbow", "ranged", "novelty"]),
  build("ice-dragoon", "Ice-Lightning Dragoon", "STR / DEX", "Skirmisher", "Frost-lightning buffs, long reach and an aggressive blink finish.", ["Short Spear", "Dragon Halberd", "Dragonscale Blade", "Death Knight's Twin Axes"], ["quality", "lightning", "frost"]),
  build("eochaid", "Eochaid Drill Knight", "STR / ARC", "Bruiser", "Charged corkscrew attacks give way to a mobile frost/arcane cleaver.", ["Broadsword", "Regalia of Eochaid", "Marais Executioner's Sword", "Putrescence Cleaver"], ["strength", "arcane", "charged"]),
  build("finger-oracle", "Finger Oracle", "STR / INT / FAI", "Novelty caster", "A strange but viable mixed caster that raises Intelligence and Faith throughout, using Strength only to meet its finger-weapon requirements.", ["Club + mixed catalysts", "Ringed Finger", "Prince of Death's Staff", "Staff of the Great Beyond + Gazing Finger"], ["novelty", "caster"], "Advanced", "Ymir quest"),
  build("liturgist", "Golden Order Liturgist", "INT / FAI", "Caster support", "Ranged holy discs, buffs and a dependable sword fallback.", ["Sacred Blade weapon", "Sacred Longsword + Finger Seal + Discus", "Golden Order Greatsword", "Leda's Sword"], ["intelligence", "faith", "holy"], "Advanced"),
  build("first-lord", "Roar of the First Lord", "STR", "Breaker", "Roars, charged heavies and hyper-armour recreate the First Lord's rhythm.", ["Highland Axe", "Grafted Blade Greatsword", "Axe of Godfrey", "Greatsword of Radahn (Lord)"], ["strength", "roar", "stance"]),
  build("bloodfiend", "Bloodfiend Juggernaut", "STR / ARC", "Breaker", "Slow, punishing blood attacks deliberately held behind progression caps.", ["Club", "Rusted Anchor", "Occult Great Stars", "Bloodfiend's Arm"], ["strength", "arcane", "bleed"], "Easy"),
  build("ghostflame", "Ghostflame Hexer", "INT / FAI", "Caster", "Frost, lingering ghostflame and putrescence control whole arenas.", ["Glintstone Staff + Magic Sword", "Death's Poker", "Helphen's Steeple + death sorceries", "Spirit Glaive + putrescence sorceries"], ["intelligence", "faith", "frost"], "Advanced", "Fia quest"),
  build("storm-perfumer", "Storm-Painter Perfumer", "DEX / FAI", "Elementalist", "Precise lightning thrusts alternate with wide elemental clouds.", ["Erdsteel Dagger + pots", "Erdsteel Dagger + Finger Seal", "Bolt of Gransax", "Lightning Perfume Bottle"], ["dexterity", "faith", "perfume", "lightning"]),
  build("venom-alchemist", "Venom Alchemist", "DEX / ARC", "Controller", "Layered poison pressure with a physical backup for immune enemies.", ["Dagger + Poisonous Mist", "Coil Shield + Serpent Bow", "Venomous Fang", "Deadly Poison Perfume Bottle"], ["dexterity", "arcane", "poison"]),
  build("destined-templar", "Destined Death Templar", "STR / FAI", "Bruiser", "Sacred great-weapon fundamentals lead directly into Destined Death and the same Strength/Faith pressure in the DLC.", ["Sacred Claymore", "Golden Halberd", "Maliketh's Black Blade", "Greatsword of Damnation"], ["strength", "faith", "greatsword", "destined death"], "Advanced"),
  build("grafted-scion", "Grafted Scion", "STR / DEX", "Trophy fighter", "A viable novelty route that invests in Strength and Dexterity throughout while changing boss-trophy weapons after major victories.", ["Battle Axe", "Grafted Dragon", "Axe of Godrick", "Greatsword of Radahn (Light)"], ["quality", "remembrance", "novelty"], "Advanced"),
  build("torch-saint", "Torch Saint", "DEX / FAI", "Novelty support", "Utility torches and fire pressure with a conventional Flame Art sidearm.", ["Steel-Wire Torch + Spear", "Sentry's Torch", "St. Trina's Torch", "Nanaya's Torch"], ["novelty", "faith", "fire"], "Advanced"),
  build("blue-dancer", "Blue Dancer Ascetic", "DEX", "Duelist", "Low equipment load rewards clean spacing and disciplined aggression.", ["Shamshir", "Katar", "Ornamental Straight Sword", "Pata"], ["dexterity", "light load", "duelist"], "Advanced"),
  build("trollsmith", "Trollsmith Thrower", "STR", "Breaker", "Classic charged-heavy play gains a spectacular thrown hammer in the DLC.", ["Large Club", "Brick Hammer", "Giant-Crusher", "Smithscript Greathammer"], ["strength", "hammer", "ranged"]),
  build("countermage", "Glintblade Countermage", "DEX / INT", "Spellblade", "Parries spells and converts openings into magical criticals.", ["Magic Rapier + Carian Retaliation", "Carian Knight's Sword", "Glintstone Kris", "Carian Sorcery Sword"], ["dexterity", "intelligence", "parry"], "Advanced"),
  build("dragonslayer-bow", "Greatbow Dragonslayer", "STR / DEX", "Ranged", "A co-op back-line siege archer with a lightweight melee fallback.", ["Longbow", "Erdtree Greatbow", "Lion Greatbow", "Igon's Greatbow"], ["quality", "greatbow", "dragon"], "Advanced", "Igon quest"),

  build("powerstance-spears", "Twin-Spear Jump Attacker", "DEX / STR", "Melee", "Powerstancing two spears puts a second hitbox on every input: the L1 double-poke outranges most answers, and a jump attack lands both blades at once for doubled stance damage — the engine of the build. The field loop holds enemies at spear-tip range, running L1 into approach animations, rolling when they commit, then resetting. Bosses open with Golden Vow and a jump attack: both heads connect in one impact window, so Claw Talisman applies to the whole slam, and L1 strings bleed the target down after the first knockdown. Spear Talisman converts the same thrusts into counter-hit damage against animations, while Rotten Winged Sword Insignia and Millicent's Prosthesis stack attack power off the natural double-hit, making every extra poke worth more. Ancient Lightning Spear spends FP punishing distance or long casts the pokes cannot reach. Never jump-attack into an active hitbox, and end strings with a dodge in reserve. The narrow thrust hitbox whiffs laterally, evasive bosses deny the contact the ramp needs, and with no status engine the pair grinds against high physical negation.", ["Short Spear + Partisan", "Cross-Naginata + Spiked Spear", "Keen Cross-Naginata pair", "Messmer Soldier's Spear pair"], ["quality", "spear", "jump"], "Moderate", undefined, { label: "EIP PvE: Dual Wielding Spear Build", url: BUILD_SOURCES.eip }, "Jump attacks", "Vagabond"),
  build("guardian-swordspear", "Dual Guardian Swordspear", "DEX", "Melee", "Guardian's Swordspears are halberd-class weapons with unusually fast strings, and a powerstanced Keen pair turns every swing into a two-hit volley that feeds consecutive-hit bonuses quickly. Field play keeps medium range: running L1 sweeps catch approach animations, and each L1 registers two hits toward Winged Sword Insignia and Millicent's Prosthesis, so attack power climbs within a single enemy pack. Bosses open with Golden Vow and a jumping L1 — both weapons land together for heavy stance damage — then Repeating Thrust spends longer recoveries, its rapid multi-thrust driving the talismans toward their caps while chipping poise toward a critical. That interaction is the core idea: single hits are modest, but the talismans pay per hit, so hit count becomes the real damage stat. The skill costs FP each use, and volley strings recover slowly, so stamina discipline caps every chain. Evasive bosses that refuse sustained contact evaporate the payoff, armoured late bosses blunt the raw output, and the Keen pair waits on farming a rare Guardian drop.", ["Halberd", "Guardian's Swordspear", "Keen Guardian's Swordspear pair", "Keen Guardian's Swordspear pair"], ["dexterity", "halberd", "multihit"], "Moderate", undefined, { label: "EIP PvE: Dual Guardian Swordspear", url: BUILD_SOURCES.eip }, "Light attacks", "Samurai"),
  build("blasphemous-vicar", "Blasphemous Blade Vicar", "STR / FAI", "Melee", "Taker's Flames is the whole identity: the Blasphemous Blade's skill sends a slow, hyper-armoured fire wave that deals heavy damage, knocks targets down and restores health for every enemy it touches, while the blade heals you on nearby kills. The field loop is efficient by design — greatsword swings for trash, Taker's Flames through corridors and packs to clear and refill health in one action. Bosses open with Golden Vow and Flame, Grant Me Strength, then the punish waits for a full recovery animation: release the wave only when it can connect end to end, because the startup is interruptible and the healing rewards full contact. Shard of Alexander raises the skill, Fire Scorpion Charm stacks onto the same wave, and Carian Filigreed Crest keeps repeat casts affordable — each multiplies the build's single most efficient action. Before Rykard falls the run stands in with Sacred Blade or Magma Wyrm's Scalesword. Careless waves into short openings are the classic way to lose, fire-resistant bosses delete the payoff, and the healing should justify good trades rather than excuse bad ones.", ["Lordsworn's Greatsword + Sacred Blade", "Magma Wyrm's Scalesword", "Blasphemous Blade", "Blasphemous Blade + Talisman of the Dread"], ["strength", "faith", "fire"], "Easy", "Rya and Rykard progression", { label: "PCGamesN: Blasphemous Blade build", url: BUILD_SOURCES.pcGamesN }, "Skill damage", "Hero"),
  build("halo-reaper", "Halo Scythe Disciple", "DEX / FAI", "Ranged", "The Halo Scythe swings a long, wide arc with innate blood loss, and its skill Miquella's Ring of Light fires an inexpensive holy ring that chains for little FP, so melee sweeps and ranged pressure come from one weapon. Field play leans on reach: out-range everything, sweep wide arcs through packs, and throw rings at distant or grouped enemies before they close. Bosses open from maximum range with chained rings to chip and stack holy damage, then punish recoveries with charged sweeps whose blood buildup hemorrhages inside long strings, while Shard of Alexander and Sacred Scorpion Charm boost that ring directly. FP economy stays friendly, leaving Cerulean charges free for emergencies. Discipline is spacing-first: scythe recoveries are long on whiffs, so never end a sweep inside an active hitbox, and release rings from outside lunge range. Cramped arenas punish both the wide swings and the straight-line projectile, holy-resistant bosses cut the ranged game in half, and the bleed side does nothing against immune targets.", ["Winged Scythe", "Halo Scythe", "Halo Scythe + Grave Scythe", "Halo Scythe + Barbed Staff-Spear"], ["dexterity", "faith", "reaper", "ranged"], "Moderate", undefined, { label: "wiki.gg: Halo Scythe", url: "https://eldenring.wiki.gg/wiki/Halo_Scythe" }, "Ranged attacks", "Confessor"),
  build("nebula-astel", "Wing of Astel Nebula", "DEX / INT", "Melee", "Wing of Astel carries two free magic tools: its uncharged and charged heavies both release curved-sword beams that cost no FP, and its skill Nebula plants a chain of delayed starbursts that detonate together for heavy magic and poise damage. The field loop is baiting — beam an approaching pack, then place Nebula where a committed enemy is about to step so several bursts overlap its hitbox. Bosses get the full ritual: Terra Magica at the arena edge, Golden Vow, and Howl of Shabriri with its negation penalty accepted, because a target committing inside the sigil eats Nebula plus charged beams under every multiplier at once — the setup is long, but one overlap can stance-break and gut slower bosses. The Finger Seal rides along so buffs never force a weapon swap. The bursts are delayed and cannot track, so Nebula only lands on committed animations, and Howl's lowered defences demand clean dodging. Small, fast enemies escape both the star field and the buff window, and magic-resistant bosses blunt every tool at once.", ["Magic Shamshir", "Magic Shamshir", "Wing of Astel + Finger Seal", "Wing of Astel + Finger Seal"], ["dexterity", "intelligence", "curved", "stance"], "Moderate", "Ranni progression", { label: "PCGamesN: Wing of Astel build", url: BUILD_SOURCES.pcGamesN }, "Stance damage", "Prisoner"),
  build("poison-lizard", "Poison Lizard Greatsword", "DEX / ARC", "Melee", "The Poison Lizard Greatsword makes poison a property of the weapon itself: every swing carries buildup, and its heavies flick a forked-tongue projectile that also applies status, so even spacing chip accumulates toward the proc. The field loop sets poison first — a flick or two triggers it, the damage-over-time then works on its own, and the greatsword frame keeps physical pressure underneath. Boss fights pivot on the burst: as the poison bar fills, The Poison Flower Blooms Twice detonates for damage scaling with the buildup it consumes, so the punish is buildup, dodge the recovery, release the skill inside the burst window. Kindred of Rot's Exultation raises attack power whenever poison procs nearby, interacting directly with how often this weapon forces procs. Buildup needs contact time, so trade only with reach advantage and never chase the proc into an active hitbox. Poison-immune enemies collapse the plan to plain greatsword fundamentals, disengaging bosses reset buildup, and the burst needs FP plus a window that relentless fights rarely grant.", ["Claymore + Poisonous Mist", "Iron Greatsword + Poisonous Mist", "Poison Flamberge", "Poison Lizard Greatsword"], ["dexterity", "arcane", "poison", "charged"], "Moderate", undefined, { label: "PCGamesN: Poison Lizard build", url: BUILD_SOURCES.pcGamesN }, "Charged attacks", "Bandit"),
  build("thorn-sorcerer", "Briar and Thorn Sorcerer", "INT / FAI / ARC", "Ranged", "Thorn sorceries pay in blood as well as FP — Briars of Sin and Briars of Punishment carve the caster's health to send piercing briars that build hemorrhage through bodies and cover, while Impenetrable Thorns erupts a point-blank briar wall for its hardest burst. The field loop casts from angles: Briars of Punishment travels through intervening enemies, so packs bleed together while you reset spacing behind cover. Bosses open at maximum range with Briars of Sin chips, punish recoveries with Briars of Punishment chains, and when a boss commits point-blank, Impenetrable Thorns converts the moment into the full burst. Staff of the Guilty raises thorn-sorcery damage specifically, the Maternal Staff carries scaling through the DLC, spare Arcane raises hemorrhage buildup, and Lord of Blood's Exultation pays on the procs this school forces constantly. Health costs make Vigor and flask discipline central, since every whiffed cast is paid for twice. Rushers that deny cast time are the worst matchup, sloppy aim taxes your own health, and Impenetrable Thorns stays locked until Shadow Keep.", ["Meteorite Staff", "Academy Glintstone Staff", "Staff of the Guilty + Briars of Punishment", "Maternal Staff + Impenetrable Thorns"], ["intelligence", "faith", "arcane", "sorcery", "bleed"], "Advanced", "Ymir quest", { label: "PCGamesN: Bleeding Thorns Mage", url: BUILD_SOURCES.pcGamesN }, "Spell damage", "Astrologer"),
  build("lightning-perfumer", "Lightning Perfume Prophet", "DEX / FAI", "Ranged", "Rolling Sparks is the payoff: the Lightning Perfume Bottle's skill sprays a mist then detonates a chain of lightning bursts, so aiming the spray at a target's feet keeps successive explosions concentrated on one body. The base-game half is orthodox casting — Lightning Spear from a Finger Seal carries early range, Knight's Lightning Spear covers long lanes later, and Dexterity and Faith split between bottle and incantation scaling. Blasphemous Blade waits as the healing melee answer when casting space collapses. Bosses open with Golden Vow, bait a commitment, then drop Rolling Sparks at the boss's feet during recovery and step out before the chain finishes; Perfumer's Talisman and Shard of Alexander both boost that skill directly. Repeated sprays drain Cerulean charges quickly, and the close-range casting animation remains punishable. Aggressive duelists that deny the foot placement blunt the skill, and with the launch-era one-shot burst long nerfed, this setup lives on repeated concentrated chains rather than a single delete.", ["Finger Seal + Lightning Spear", "Finger Seal + Lightning Spear", "Blasphemous Blade", "Lightning Perfume Bottle + Blasphemous Blade"], ["dexterity", "faith", "lightning", "perfume", "ranged"], "Moderate", undefined, { label: "PCGamesN: Lightning Perfume Bottle Prophet", url: BUILD_SOURCES.pcGamesN }, "Ranged attacks", "Prophet"),
  build("fire-knight-greatsword", "Fire Knight Greatsword", "STR / FAI", "Melee", "Heavy flaming sweeps and Messmer incantations with a DLC weapon whose thrusting heavy attacks reward deliberate spacing.", ["Flame Art Claymore", "Magma Wyrm's Scalesword", "Blasphemous Blade", "Fire Knight's Greatsword + Flame Spear"], ["strength", "faith", "fire", "charged"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Hero"),
  build("sunflower-crusader", "Shadow Sunflower Crusader", "STR / FAI", "Melee", "A holy great-weapon progression that finishes with repeated sunflower slams and substantial stance pressure.", ["Sacred Large Club", "Great Stars + Prayerful Strike", "Envoy's Long Horn", "Shadow Sunflower Blossom"], ["strength", "faith", "great hammer", "stance"], "Easy", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Stance damage", "Hero"),
  build("black-steel-bulwark", "Black Steel Bulwark", "STR / FAI", "Melee", "Guard counters and holy retaliation culminate in the Black Steel Greatshield and a controllable thrusting sidearm.", ["Broadsword + Brass Shield", "Golden Greatshield + Great Épée", "Haligtree Crest Greatshield + Treespear", "Black Steel Greatshield + Queelign's Greatsword"], ["strength", "faith", "guard", "shield"], "Easy", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Guard counters", "Hero"),
  build("night-claws", "Claws of Night Hunter", "DEX", "Ranged", "Fast claw strings share a build with thrown fan blades, giving the same weapon a real answer at two ranges.", ["Hookclaws", "Raptor Talons", "Bloodhound Claws", "Claws of Night"], ["dexterity", "claw", "ranged", "multihit"], "Advanced", "Jolán and Ymir quest", { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Light attacks", "Samurai"),
  build("rakshasa-counter", "Rakshasa Counter-Slasher", "DEX", "Melee", "Great-katana reach and counter-hit timing lead into Rakshasa's aggressive Weed Cutter chains.", ["Uchigatana", "Nagakiba", "Keen Nagakiba", "Rakshasa's Great Katana"], ["dexterity", "katana", "counter"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Skill damage", "Samurai"),
  build("horned-storm", "Horned Warrior Stormblade", "STR / DEX", "Melee", "Curved-greatsword fundamentals gain a high-commitment horned storm skill for large punish windows.", ["Dismounter", "Omen Cleaver", "Beastman's Cleaver", "Horned Warrior's Greatsword"], ["quality", "curved greatsword", "storm", "stance"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Stance damage", "Vagabond"),
  build("spread-crossbow", "Spread Crossbow Trapper", "DEX / ARC", "Ranged", "Uses crafted bolts and status ammunition; the DLC spread pattern rewards close-range openings without replacing the sidearm.", ["Light Crossbow", "Light Crossbow", "Pulley Crossbow + status bolts", "Spread Crossbow"], ["dexterity", "arcane", "crossbow", "status"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Status buildup", "Bandit"),
  build("golem-fist", "Golem Fist Boxer", "STR", "Melee", "A fist build whose charged heavy eventually launches a short-range projectile while retaining strong close pressure.", ["Caestus", "Spiked Caestus", "Star Fist", "Golem Fist"], ["strength", "fist", "charged"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Hero"),
  build("serpent-flail", "Serpent Flail Demolitionist", "DEX / FAI", "Melee", "Flail guard counters and charged attacks finish with the Serpent Flail's delayed explosive coating.", ["Flail", "Nightrider Flail", "Family Heads", "Serpent Flail"], ["dexterity", "faith", "flail", "charged"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Confessor"),
  build("sword-of-darkness", "Sword of Darkness Knight", "STR / FAI", "Melee", "The Sword of Darkness defines the kit: its skill Wave of Darkness sweeps a ring of dark fog that damages nearby enemies as holy damage and lowers their holy negation, so every hit that follows lands harder inside the window. The field loop opens each engagement with the wave, then cleans up within the debuff using sword strikes and cheap incants from the Dryleaf Seal. Bosses open with Golden Vow, land Wave of Darkness at the edge of its range, and spend the lowered-negation window on the biggest punish available — charged sword attacks or lightning incants, which Golden Vow's flat boost and the fog's holy cut amplify together. Blessed Blue Dew supports the skill's FP demand across long fights. The fog ring is point-blank, so releasing it means standing inside punish range, and the window must be spent before it lapses. The central weapon requires the Stone-Sheathed Sword altar detour, so the base game runs an ordinary sacred sword-and-seal plan, and holy-resistant bosses halve both the wave and everything that follows.", ["Sacred Lordsworn's Straight Sword", "Sacred Lordsworn's Straight Sword", "Coded Sword", "Sword of Darkness + Dryleaf Seal"], ["strength", "faith", "holy", "skill"], "Moderate", "Stone-Sheathed Sword altar route", { label: "PC Gamer: Unholy Knight", url: BUILD_SOURCES.pcGamerDlc }, "Skill damage", "Hero"),
  build("carian-shield-sorcerer", "Carian Shield Sorcerer", "STR / DEX / INT", "Hybrid", "The Carian Sorcery Sword casts from the sword hand: its heavy-attack inputs release the equipped Carian sword sorcery, so Slicer, Greatsword or Piercer fire without swapping weapons, while the Carian Thrusting Shield covers guard-counter defence. The field loop alternates cheap thrusts, blocked pressure behind the shield, and a heavy-input cast whenever range or groups demand — a spellblade that never changes loadouts mid-fight. Ymir's nail sorceries extend the ranged half, and Beloved Stardust speeds every cast at the permanent price of increased damage taken. Bosses open with Golden Vow and a guard-counter or thrust to bait commitment, then punish recoveries with point-blank Sorcery Sword casts, where Carian Slicer's speed and the sword's thrusts stack stance damage toward frequent breaks. Heavy-input casting drains FP and stamina, and the base game builds the same habits with Estoc and conventional staves first. Both signature weapons are DLC items, the three-stat spread thins every damage pool, and Beloved Stardust's downside makes careless casting lethal.", ["Estoc + Demi-Human Queen's Staff", "Carian Knight's Sword + staff", "Loretta's War Sickle + Carian Regal Scepter", "Carian Sorcery Sword + Carian Thrusting Shield"], ["strength", "dexterity", "intelligence", "sorcery", "guard"], "Advanced", undefined, { label: "PC Gamer: Carian Spellblade", url: BUILD_SOURCES.pcGamerDlc }, "Guard counters", "Prisoner"),
  build("wing-stance-duelist", "Wing Stance Court Duelist", "STR / DEX", "Melee", "Milady is a light greatsword with fast, flowing normals, and Wing Stance turns it into a decision tree: held, the light input releases a three-slash string for pressure, while the heavy input leaps forward with a thrust carrying reach, poise damage and the best punish value. The field loop is footsies — hold the stance at mid-range, release the slash string into approach animations, and use the leaping thrust to close whiffs. Bosses open with Golden Vow and a deliberate stance hold, because Rellana's Cameo raises attack power while a skill's stance is held before release, so the thrust lands at its ceiling; re-hold through each recovery to repeat. The Main-gauche converts readable humanoid attacks and spell casts into parries, and parries convert into dagger criticals worth more than any sword hit. With no shield and no status engine, the discipline is timing: never release the thrust into an active hitbox, and keep stamina for a roll after every string. Evasive or hyper-armoured bosses deny the thrust windows, and the full package only exists inside the DLC.", ["Rapier", "Rogier's Rapier", "Cleanrot Knight's Sword", "Milady + Wing Stance / Main-gauche"], ["quality", "light greatsword", "critical", "stance"], "Advanced", undefined, { label: "PC Gamer: Courtly Duelist", url: BUILD_SOURCES.pcGamerDlc }, "Critical attacks", "Vagabond"),
  build("red-bear", "Red Bear Berserker", "STR / DEX", "Melee", "Red Bear's Claw fights in flurries: its light chain is among the fastest claw strings, its bleed builds steadily, and its skill Red Bear Hunt launches a committed mauling that spends the whole FP bar at once. The field loop is unbroken contact — stay inside swing range, chain light attacks through enemy flinches, and let kill momentum carry from pack to pack. Bosses are opened with Golden Vow and immediate contact: Winged or Rotten Winged Sword Insignia and Millicent's Prosthesis stack attack power per hit, hemorrhage procs fire Lord of Blood's Exultation, and these separate layers multiply into the flurry; Red Bear Hunt is spent only when a full recovery window can contain it, with Shard of Alexander when it lands often or Carian Filigreed Crest when it rarely does. FP and stamina discipline decide whether the Hunt is affordable, and light armour makes every gamble real damage taken. The whole bonus stack resets when contact breaks, so one disengagement erases the momentum. Bleed-immune enemies strip the biggest proc layer, and flurries into high-negation bosses slow to a crawl.", ["Hookclaws", "Hookclaws", "Star Fist", "Red Bear's Claw"], ["quality", "claw", "multihit", "bleed"], "Advanced", undefined, { label: "PC Gamer: Bearserker", url: BUILD_SOURCES.pcGamerDlc }, "Light attacks", "Vagabond"),
  build("pure-priestess", "Co-op Erdtree Priestess", "FAI", "Ranged", "The kit is a spell bar rebuilt per encounter: offensive incants — Catch Flame close, Lightning Spear and Knight's Lightning Spear at range, Black Flame for tanky targets — sit alongside protections such as Flame, Protect Me, Black Flame's Protection and Protection of the Erdtree, plus Golden Vow and heal-over-time for the party. The field loop reads the roster first: buff, pick a school the boss does not resist, and cast from behind the front line while Urgent Heal covers chip between volleys. Bosses open with Golden Vow and a long-range incant, then punish commitment windows with Knight's Lightning Spear or charged casts; the co-op role is uptime, so hold a lane where a dodge still reaches the host. A Dragon Communion Seal can ride along for dragon-incant options while a pure-Faith seal does the main casting, and memory slots are the real constraint — swapping bars between bosses is that discipline. No single school peaks, and holy-resistant bosses flatly resist the default tools. That breadth trades burst damage for coverage, the exact co-op bargain this build makes.", ["Finger Seal + Catch Flame", "Godslayer's Seal", "Erdtree Seal", "Dryleaf Seal + Knight's Lightning Spear"], ["faith", "caster", "coop", "ranged"], "Moderate", undefined, { label: "EIP PvE: Pure Faith Priestess", url: BUILD_SOURCES.eip }, "Spell damage", "Prophet"),
  build("magma-sorcerer", "Gelmir Magma Sorcerer", "INT / FAI", "Ranged", "Magma sorceries fight the ground rather than the target: Magma Shot pools lava under a standing enemy and its charge extends the pool's reach, while Roiling Magma plants a delayed second eruption, so the field loop walks large or slow targets into their own lava and fires ordinary glintstone projectiles when pooling range is unsafe. Bosses open by laying a pool into their approach path, then punish every recovery with charge-capped Magma Shots — Godfrey Icon boosts exactly those charged casts, and the Gelmir Glintstone Staff raises magma-school damage specifically; the published twin-staff setup carries that boost in both hands. Holding the charge too long wastes the punish window, so release timing matters. Rellana's Twin Blades are the DLC melee answer for rushers that close the casting lane. Each pool is an FP investment that only pays if the target stays in it, so maximum-lunge-range placement and pre-laying lava before aggro are core habits. Fire-immune bosses delete the whole school, and hyper-aggressive duelists deny both the pool setup and the charged cast window.", ["Meteorite Staff + Magic Longsword", "Gelmir Glintstone Staff", "Dual Gelmir Glintstone Staff", "Dual Gelmir Glintstone Staff + Rellana's Twin Blades"], ["intelligence", "faith", "magma", "caster"], "Advanced", "Volcano Manor progression", { label: "EIP PvE: Magmage", url: BUILD_SOURCES.eip }, "Spell damage", "Astrologer"),
  build("black-blade-colossus", "Maliketh Black Blade", "STR / FAI", "Melee", "Maliketh's Black Blade is a colossal sword whose skill Destined Death delivers a committed, armoured combo dealing immediate damage, a burning tick and a cut to maximum health — a percentage effect that grows with boss health pools. The published route spends most of the game in stand-ins: a Sacred Claymore early and the Golden Halberd through the midgame, because the true weapon cannot exist until Maliketh falls. Bosses open from range with the Black Blade incantation, which applies its own temporary max-HP cut, then the punish walks into a full recovery and releases Destined Death so the two cuts stack while Golden Vow raises every swing between them. Strength scaling supports a Clawmark Seal for Blessing of the Erdtree and utility incants, and the colossal frame trades through lighter interruptions with natural hyper armour. Destined Death's animation is long enough that forcing it into a short opening loses the trade. The EIP setup values breadth and fashion over an optimised stack, so evasive bosses that starve the punish plan leave only colossal pokes behind.", ["Sacred Claymore", "Golden Halberd", "Maliketh's Black Blade", "Maliketh's Black Blade + Black Blade incantation"], ["strength", "faith", "colossal", "destined death"], "Advanced", undefined, { label: "EIP PvE: Black Blade STR/Faith", url: BUILD_SOURCES.eip }, "Skill damage", "Hero"),
  build("messmer-impaler", "Messmer Impaler", "DEX / FAI", "Ranged", "The Spear of the Impaler is a great spear with two ranges: thrusts control mid-space, charged heavies throw it as a fire-wreathed javelin, and Messmer's Assault unleashes a multi-thrust chain ending in a flame slam, the heaviest punish. The field loop holds thrust range, throws the javelin at mid-range approaches, and sends the tracking Fire Serpent incantation through gaps the spear cannot reach. Bosses open with Golden Vow and Flame, Grant Me Strength, which boosts both the physical thrusts and the fire half; the punish waits for a committed recovery, releases the full Assault chain including the slam only when every input can land, then steps out. Shard of Alexander raises the skill, Fire Scorpion Charm boosts the javelin and slam, and Spear Talisman turns the thrusts into counter-hits, three talismans amplifying one layer each of the same sequence. Heavy Dexterity and Messmer's own drop gate the weapon, so the run starts with ordinary spear stand-ins. Fire-resistant bosses halve the javelin and slam, and mobile targets turn the Assault chain into a suicide animation.", ["Short Spear + Flame Sling", "Cross-Naginata + Black Flame", "Bolt of Gransax", "Spear of the Impaler + Fire Serpent"], ["dexterity", "faith", "spear", "fire", "ranged"], "Advanced", undefined, { label: "wiki.gg: Spear of the Impaler", url: "https://eldenring.wiki.gg/wiki/Spear_of_the_Impaler" }, "Skill damage", "Confessor"),
];

export const builds: Build[] = [...curatedBuilds, ...wikiBuilds, ...additionalSourcedBuilds, ...sourcedMemeBuilds];

// Legacy curated experiments stay loadable so an existing save is never broken,
// but new runs may only choose a published build or one of the two locally-used
// routes retained at the user's request. A weapon catalogue is an acquisition
// source, not evidence that a multi-stage build is sound.
export const selectableBuilds: Build[] = builds.filter((candidate) => candidate.collection !== "Curated" || candidate.audited);

const selectableBuildNumbers = new Map(selectableBuilds.map((candidate, index) => [candidate.id, index + 1]));

export function catalogueNumber(build: Build | string) {
  return selectableBuildNumbers.get(typeof build === "string" ? build : build.id);
}

export type StageLoadout = {
  level: string;
  weapon: string;
  offhand: string;
  skill: string;
  talismanSlots: string;
  talismans: string[];
  armour: string;
  spells: string[];
  flask: string;
  stats: string;
  borrowedFrom?: BuildSource & { buildName: string };
  sourceUse?: "temporary-stage" | "curated-baseline";
  weaponChoice?: {
    rationale: string;
    sources: BuildSource[];
  };
};

const includesAny = (build: Build, values: string[]) => {
  const text = `${build.name} ${build.stats} ${build.role} ${build.tags.join(" ")} ${build.mechanic}`.toLowerCase();
  return values.some((value) => text.includes(value));
};

const unique = (items: string[]) => Array.from(new Set(items));

const PHASES: PhaseKey[] = ["early", "mid", "late", "dlc"];

const statCodes = (build: Build) => ["STR", "DEX", "INT", "FAI", "ARC"].filter((stat) => build.stats.toUpperCase().includes(stat));

const normalWords = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const weaponClassCache = new Map<string, string>();

function weaponClass(weapon: string) {
  const cacheKey = normalWords(weapon);
  const cached = weaponClassCache.get(cacheKey);
  if (cached) return cached;
  const recorded = findWeaponUpgradeRecord(weapon)?.weaponClass;
  if (recorded) {
    const result = recorded.toLowerCase();
    weaponClassCache.set(cacheKey, result);
    return result;
  }
  const text = cacheKey;
  const aliases: [RegExp, string][] = [
    [/glintstone staff|\bstaff\b/, "glintstone staff"], [/sacred seal|\bseal\b/, "sacred seal"],
    [/hand to hand|dryleaf|danes footwork/, "hand-to-hand"], [/beast claw/, "beast claw"],
    [/backhand blade/, "backhand blade"], [/throwing blade|smithscript dagger/, "throwing blade"],
    [/perfume bottle/, "perfume bottle"], [/light greatsword|\bmilady\b/, "light greatsword"],
    [/heavy thrusting|great epee|godskin stitcher/, "heavy thrusting sword"], [/thrusting sword|\brapier\b|\bestoc\b/, "thrusting sword"],
    [/colossal sword/, "colossal sword"], [/colossal weapon/, "colossal weapon"], [/curved greatsword/, "curved greatsword"],
    [/great katana/, "great katana"], [/great spear/, "great spear"], [/great hammer/, "great hammer"],
    [/straight sword|longsword|broadsword/, "straight sword"], [/curved sword/, "curved sword"], [/greatsword/, "greatsword"],
    [/twinblade/, "twinblade"], [/halberd/, "halberd"], [/spear|lance/, "spear"], [/greatbow/, "greatbow"],
    [/crossbow|ballista|cannon/, "crossbow"], [/shortbow|longbow|\bbow\b/, "bow"], [/greataxe/, "greataxe"],
    [/greatshield/, "greatshield"], [/shield/, "shield"], [/katana/, "katana"], [/reaper|scythe/, "reaper"],
    [/\bclaw|talons/, "claw"], [/\bfist|caestus|katar/, "fist"], [/dagger|misericorde/, "dagger"],
    [/\bflail/, "flail"], [/\bwhip|urumi/, "whip"], [/\bhammer|club/, "hammer"], [/\baxe/, "axe"],
  ];
  const result = aliases.find(([pattern]) => pattern.test(text))?.[1] || "unknown";
  weaponClassCache.set(cacheKey, result);
  return result;
}

const weaponFamily = (value: string) => {
  const kind = weaponClass(value);
  if (["glintstone staff", "sacred seal"].includes(kind)) return "catalyst";
  if (["bow", "greatbow", "crossbow", "throwing blade"].includes(kind)) return "ranged";
  if (["spear", "great spear", "halberd", "reaper"].includes(kind)) return "polearm";
  if (["colossal sword", "colossal weapon", "great hammer", "greataxe", "greatsword", "curved greatsword", "hammer"].includes(kind)) return "heavy";
  if (["katana", "great katana", "straight sword", "curved sword", "light greatsword", "thrusting sword", "heavy thrusting sword"].includes(kind)) return "blade";
  if (["twinblade", "claw", "beast claw", "fist", "hand-to-hand", "backhand blade"].includes(kind)) return "rapid";
  if (["shield", "greatshield"].includes(kind)) return "shield";
  return kind;
};

const combatStyle = (build: Build, weapon: string) => {
  const family = weaponFamily(weapon);
  if (family === "catalyst") return "caster";
  if (family === "ranged") return "ranged";
  if (build.mechanic === "Spell damage") return "spellblade";
  if (build.mechanic === "Ranged attacks") return "ranged-melee";
  if (build.mechanic === "Guard counters") return "guard";
  if (["Light attacks", "Status buildup"].includes(build.mechanic)) return "rapid";
  if (["Charged attacks", "Jump attacks", "Stance damage"].includes(build.mechanic)) return "heavy";
  return "melee";
};

const compatibleMechanic = (left: string, right: string) => {
  if (left === right) return true;
  const groups = [
    ["Charged attacks", "Jump attacks", "Stance damage", "Skill damage"],
    ["Light attacks", "Status buildup", "Critical attacks", "Skill damage"],
    ["Spell damage", "Ranged attacks", "Skill damage"],
    ["Guard counters", "Stance damage", "Skill damage"],
  ];
  return groups.some((group) => group.includes(left) && group.includes(right));
};

const publishedWeaponAt = (build: Build, phase: PhaseKey) => build.publishedStages?.[phase]?.weapon || build.publishedLoadout?.weapon || "";

function desiredWeapon(build: Build, phase: PhaseKey) {
  const resolution = weaponResolutions[build.id];
  return resolution?.weapons?.[phase] || resolution?.weapon || build.publishedLoadout?.weapon || build.phases[phase];
}

function earlyStarterWeapon(build: Build, eventualWeapon: string) {
  const family = weaponFamily(eventualWeapon);
  const stats = statCodes(build);
  const catalystLane = family === "catalyst" || (build.mechanic === "Spell damage" && /\b(?:staff|seal)\b/i.test(eventualWeapon));
  if (catalystLane) {
    if (stats.includes("FAI") && !stats.includes("INT")) return build.mechanic === "Guard counters" ? "Broadsword + Finger Seal" : "Finger Seal";
    if (build.startingClass === "Prisoner") return "Glintstone Staff + Estoc";
    return build.startingClass === "Astrologer" ? "Astrologer's Staff + Short Sword" : "Astrologer's Staff";
  }
  if (family === "ranged") return build.startingClass === "Bandit" ? "Shortbow" : "Light Crossbow";
  if (family === "polearm") return stats.includes("STR") ? "Halberd" : "Short Spear";
  if (family === "heavy") return stats.includes("STR") ? "Large Club" : "Lordsworn's Greatsword";
  if (family === "rapid") return stats.includes("STR") ? "Caestus" : "Hookclaws";
  if (family === "shield") return "Longsword + Heater Shield";
  if (family === "blade") {
    if (build.startingClass === "Samurai") return "Uchigatana";
    if (build.startingClass === "Prisoner") return "Estoc";
    if (build.startingClass === "Confessor") return "Broadsword";
    return "Longsword";
  }
  return build.startingClass === "Hero" ? "Battle Axe" : build.startingClass === "Samurai" ? "Uchigatana" : "Longsword";
}

function earlyStarterSkill(starter: string) {
  const weapon = normalWords(starter);
  if (weapon.includes("halberd")) return "Charge Forth (default skill)";
  if (weapon.includes("short spear") || weapon.includes("estoc")) return "Impaling Thrust (default skill)";
  if (weapon.includes("large club") || weapon === "club") return "Barbaric Roar (default skill)";
  if (weapon.includes("lordsworn's greatsword")) return "Stamp (Upward Cut) (default skill)";
  if (weapon.includes("dagger")) return "Quickstep (default skill)";
  if (weapon.includes("uchigatana")) return "Unsheathe (default skill)";
  if (weapon.includes("longsword") || weapon.includes("broadsword")) return "Square Off (default skill)";
  if (weapon.includes("battle axe")) return "Wild Strikes (default skill)";
  if (weapon.includes("shortbow")) return "Barrage (default skill)";
  if (weapon.includes("light crossbow")) return "Kick (default skill)";
  if (weapon.includes("staff") || weapon.includes("finger seal")) return "No Skill";
  return "Use the weapon's default skill (no Ash of War pickup required)";
}

function markIntrinsicStarterSkill(phase: PhaseKey, loadout: StageLoadout): StageLoadout {
  if (phase !== "early") return loadout;
  const starterSkill = earlyStarterSkill(loadout.weapon);
  const unmarkedStarterSkill = starterSkill.replace(/\s*\((?:default skill|no Ash of War pickup required)\)$/i, "");
  return normalWords(loadout.skill) === normalWords(unmarkedStarterSkill) ? { ...loadout, skill: starterSkill } : loadout;
}

function applyEarlyStarter(build: Build, phase: PhaseKey, loadout: StageLoadout): StageLoadout {
  if (phase !== "early") return loadout;
  let starter = earlyStarterWeapon(build, loadout.weapon);
  if (loadout.spells.length && /\bseal\b/i.test(loadout.weapon) && !/\bseal\b/i.test(`${starter} ${loadout.offhand}`)) starter += " + Finger Seal";
  if (loadout.spells.length && /\bstaff\b/i.test(loadout.weapon) && !/\bstaff\b/i.test(`${starter} ${loadout.offhand}`)) starter += build.startingClass === "Prisoner" ? " + Glintstone Staff" : " + Demi-Human Queen's Staff";
  if (normalWords(loadout.weapon) === normalWords(starter)) return markIntrinsicStarterSkill(phase, loadout);
  const starterNote = /\bLarge Club\b/i.test(starter) ? " Two-hand the Large Club until reaching 22 STR; 15 STR meets its effective two-handed requirement." : "";
  return markIntrinsicStarterSkill(phase, {
    ...loadout,
    weapon: starter,
    skill: earlyStarterSkill(starter),
    stats: `${loadout.stats}${starterNote}`,
    weaponChoice: {
      rationale: `Start with ${starter} so the build uses its intended damage stats and combat rhythm immediately. Keep it until the route creates the card for ${loadout.weapon}; no respec is needed for that replacement.`,
      sources: [loadout.borrowedFrom || build.source, build.source].map(({ label, url }) => ({ label, url })),
    },
  });
}

function offPathRequirement(build: Build, weapon: string) {
  const targetStats = statCodes(build);
  const requirements = findWeaponUpgradeRecord(weapon);
  const requirementStats: [string, number][] = requirements ? [
    ["STR", requirements.reqStr], ["DEX", requirements.reqDex], ["INT", requirements.reqInt],
    ["FAI", requirements.reqFai], ["ARC", requirements.reqArc],
  ] : [];
  return requirementStats.reduce((total, [stat, value]) => total + (!targetStats.includes(stat) && value > 12 ? value - 12 : 0), 0);
}

function scorePublishedStage(build: Build, phase: PhaseKey, candidate: Build, previous?: Build) {
  const targetWeapon = desiredWeapon(build, phase);
  const candidateWeapon = publishedWeaponAt(candidate, phase);
  const targetClass = weaponClass(targetWeapon);
  const candidateClass = weaponClass(candidateWeapon);
  const targetFamily = weaponFamily(targetWeapon);
  const candidateFamily = weaponFamily(candidateWeapon);
  const targetStats = statCodes(build);
  const candidateStats = statCodes(candidate);
  const sharedStats = candidateStats.filter((stat) => targetStats.includes(stat)).length;
  const targetStyle = combatStyle(build, targetWeapon);
  const candidateStyle = combatStyle(candidate, candidateWeapon);
  const sourcePhase = candidate.availableFrom || "early";
  const requirementTax = offPathRequirement(build, candidateWeapon);
  let score = 0;
  score += targetClass !== "unknown" && targetClass === candidateClass ? 90 : targetFamily !== "unknown" && targetFamily === candidateFamily ? 48 : 0;
  score += targetStats.length ? (sharedStats / targetStats.length) * 45 : 10;
  score -= Math.max(0, candidateStats.length - sharedStats) * 16;
  score += candidateStats.length > 0 && candidateStats.every((stat) => targetStats.includes(stat)) ? 18 : 0;
  score += candidate.mechanic === build.mechanic ? 32 : compatibleMechanic(candidate.mechanic, build.mechanic) ? 13 : -12;
  const casterOrRangedMismatch = [candidateStyle, targetStyle].some((style) => style === "caster" || style === "ranged");
  score += candidateStyle === targetStyle ? 24 : casterOrRangedMismatch ? -42 : candidateFamily === targetFamily ? 7 : -10;
  score -= requirementTax * 7;
  if (!build.tags.includes("meme") && candidate.tags.some((tag) => tag === "meme" || tag === "cosplay")) score -= 100;
  score += sourcePhase === phase ? 5 : 0;
  if (previous) {
    const previousWeapon = publishedWeaponAt(previous, phase);
    score += previous.id === candidate.id ? 34 : weaponClass(previousWeapon) === candidateClass ? 18 : weaponFamily(previousWeapon) === candidateFamily ? 9 : -8;
    const previousStats = statCodes(previous);
    score += previousStats.some((stat) => candidateStats.includes(stat)) ? 6 : -12;
  }
  return score;
}

const DEFAULT_PHASE_BRIDGES: Record<string, Partial<Record<PhaseKey, string>>> = {
  "fextra-stormblessed": { early: "fextra-vanquisher", mid: "fextra-vanquisher", late: "fextra-lightningdragoon" },
  "fextra-dragonpriestess": { early: "fextra-paladin", mid: "fextra-paladin", late: "fextra-templar" },
  "fextra-dragongod": { early: "fextra-dragonpriest", mid: "fextra-dragonpriest", late: "fextra-blooddragon" },
  "fextra-redlightning": { early: "fextra-paladin", mid: "fextra-templar" },
  "fextra-blackflamespellblade": { early: "fextra-paladin", mid: "fextra-blackflameapostle" },
  "fextra-goldeneyebow": { early: "fextra-archer", mid: "fextra-archer" },
  "fextra-blackflamebushido": { early: "fextra-paladin", mid: "fextra-blackflameapostle" },
  "fextra-blackknifeassassin": { early: "fextra-paladin", mid: "fextra-blackflameapostle" },
  "fextra-pyromancer": { early: "fextra-paladin", mid: "fextra-templar" },
  "fextra-dragondancer": { early: "fextra-dragonpriest", mid: "fextra-blooddragon" },
  "fextra-dragonknight": { early: "fextra-dragonpriest", mid: "fextra-blooddragon" },
  "fextra-sanguinespellblade": { early: "fextra-dragonpriest", mid: "fextra-blooddragon" },
};

function closestPublishedStage(build: Build, phase: PhaseKey, previous?: Build) {
  const explicitBridge = build.phaseBridges?.[phase] || DEFAULT_PHASE_BRIDGES[build.id]?.[phase];
  if (explicitBridge) return builds.find((candidate) => candidate.id === explicitBridge && (candidate.publishedStages?.[phase] || candidate.publishedLoadout));
  const targetStats = statCodes(build);
  const phaseIndex = PHASES.indexOf(phase);
  let candidates = builds.filter((candidate) =>
    candidate.id !== build.id &&
    candidate.collection !== "Curated" &&
    Boolean(candidate.publishedStages?.[phase] || (candidate.publishedLoadout && PHASES.indexOf(candidate.availableFrom || "early") <= phaseIndex)),
  );
  if (!build.tags.includes("meme")) {
    const nonMemeCandidates = candidates.filter((candidate) => !candidate.tags.some((tag) => tag === "meme" || tag === "cosplay"));
    if (nonMemeCandidates.length) candidates = nonMemeCandidates;
  }
  const withSharedStats = candidates.filter((candidate) => !targetStats.length || statCodes(candidate).some((stat) => targetStats.includes(stat)));
  if (withSharedStats.length) candidates = withSharedStats;
  const targetFamily = weaponFamily(desiredWeapon(build, phase));
  const inFamily = candidates.filter((candidate) => weaponFamily(publishedWeaponAt(candidate, phase)) === targetFamily);
  const globallyCleanStats = candidates.filter((candidate) => statCodes(candidate).every((stat) => targetStats.includes(stat)));
  const cleanFamily = inFamily.filter((candidate) => statCodes(candidate).every((stat) => targetStats.includes(stat)));
  if (cleanFamily.length) candidates = cleanFamily;
  else if (inFamily.length) candidates = inFamily;
  else if (globallyCleanStats.length) candidates = globallyCleanStats;
  const cleanRequirements = candidates.filter((candidate) => offPathRequirement(build, publishedWeaponAt(candidate, phase)) <= 4);
  if (cleanRequirements.length) candidates = cleanRequirements;
  return candidates.sort((a, b) => scorePublishedStage(build, phase, b, previous) - scorePublishedStage(build, phase, a, previous) || a.name.localeCompare(b.name))[0];
}

const bridgePlanCache = new Map<string, Partial<Record<PhaseKey, Build>>>();

function bridgePlan(build: Build) {
  const cached = bridgePlanCache.get(build.id);
  if (cached) return cached;
  const plan: Partial<Record<PhaseKey, Build>> = {};
  const availableIndex = build.publishedLoadout ? PHASES.indexOf(build.availableFrom || "early") : PHASES.length;
  let previous: Build | undefined;
  for (const [index, phase] of PHASES.entries()) {
    if (index >= availableIndex) break;
    const candidate = closestPublishedStage(build, phase, previous);
    if (candidate) {
      plan[phase] = candidate;
      previous = candidate;
    }
  }
  bridgePlanCache.set(build.id, plan);
  return plan;
}

export function stageLoadout(build: Build, phase: PhaseKey): StageLoadout {
  const exactStage = build.publishedStages?.[phase];
  if (exactStage) return markIntrinsicStarterSkill(phase, { ...exactStage, talismanSlots: `${exactStage.talismans.length} listed by source` });
  if (build.publishedLoadout) {
    const available = build.availableFrom || "early";
    if (PHASES.indexOf(phase) < PHASES.indexOf(available)) {
      const borrowed = bridgePlan(build)[phase];
      const borrowedLoadout = borrowed?.publishedStages?.[phase] || borrowed?.publishedLoadout;
      if (borrowed && borrowedLoadout) {
        const resolution = weaponResolutions[borrowed.id];
        const bridgeWeapon = borrowed.publishedStages?.[phase]?.weapon || resolution?.weapons?.[phase] || resolution?.weapon || borrowedLoadout.weapon;
        const targetStage = stageLoadout({
          ...build,
          publishedLoadout: undefined,
          publishedStages: undefined,
          phaseBridges: undefined,
        }, phase);
        const phaseIndex = PHASES.indexOf(phase);
        const skillAvailable = !(/royal knight's resolve|seppuku/i.test(borrowedLoadout.skill) && phaseIndex < PHASES.indexOf("late"))
          && !(/cragblade|lion's claw|giant hunt|flaming strike/i.test(borrowedLoadout.skill) && phaseIndex < PHASES.indexOf("mid"));
        const bridgeSkill = /^(?:n\/?a|none|not specified)/i.test(borrowedLoadout.skill) || !skillAvailable
          ? targetStage.skill
          : borrowedLoadout.skill;
        return applyEarlyStarter(build, phase, {
          ...targetStage,
          weapon: bridgeWeapon,
          skill: bridgeSkill,
          borrowedFrom: { ...borrowed.source, buildName: borrowed.name },
          sourceUse: "temporary-stage",
          weaponChoice: resolution
            ? { rationale: resolution.rationale, sources: resolution.sources }
            : {
                rationale: `${bridgeWeapon} supplies a sourced ${phase} weapon lane with compatible damage stats and combat rhythm. The remaining equipment and stat plan are generated for ${build.name}, not copied from ${borrowed.name}.`,
                sources: [borrowed.source, build.source],
              },
        });
      }
    }
    const resolution = weaponResolutions[build.id];
    return applyEarlyStarter(build, phase, {
      ...build.publishedLoadout,
      weapon: resolution?.weapons?.[phase] || resolution?.weapon || build.publishedLoadout.weapon,
      talismanSlots: `${build.publishedLoadout.talismans.length} listed by source`,
      weaponChoice: resolution && { rationale: resolution.rationale, sources: resolution.sources },
    });
  }

  const damageStats = statCodes(build);
  const casterInt = damageStats.includes("INT") && includesAny(build, ["intelligence", "sorcer", "magic", "spellblade", "gravity", "frost", "death"]);
  const casterFaith = damageStats.includes("FAI") && includesAny(build, ["faith", "holy", "fire", "lightning", "dragon", "bestial", "frenzy", "blackflame", "crucible"]);
  const arcane = includesAny(build, ["arcane", "bleed", "poison", "rot", "dragon-communion"]);
  const guard = includesAny(build, ["tank", "guard", "shield"]);
  const ranged = weaponFamily(desiredWeapon(build, phase)) === "ranged";
  const multihit = includesAny(build, ["multihit", "twinblade", "claw", "fist", "dancer", "backhand"]);
  const charged = includesAny(build, ["strength", "hammer", "colossal", "charged", "roar", "breaker"]);
  const critical = includesAny(build, ["critical", "parry", "assassin", "countermage"]);
  const lightLoad = includesAny(build, ["light load", "blue dancer", "ascetic"]);

  const levels: Record<PhaseKey, string> = { early: "RL 25–40", mid: "RL 60–90", late: "RL 120–150", dlc: "RL 150–170" };
  const slots: Record<PhaseKey, string> = { early: "1 slot at start; 2 after Margit", mid: "3 slots after two Great Runes", late: "4 slots after Golden Godfrey", dlc: "4 slots" };

  const earlyTalismans = guard
    ? ["Curved Sword Talisman", "Green Turtle Talisman"]
    : ranged
      ? ["Arrow's Reach Talisman", "Green Turtle Talisman"]
      : casterInt
        ? ["Crimson Amber Medallion", "Green Turtle Talisman"]
        : casterFaith
          ? ["Crimson Amber Medallion", "Green Turtle Talisman"]
          : charged
            ? ["Axe Talisman", "Green Turtle Talisman"]
            : ["Green Turtle Talisman", "Crimson Amber Medallion"];

  const midTalismans = guard
    ? ["Curved Sword Talisman", "Greatshield Talisman", "Arsenal Charm +1"]
    : ranged
      ? ["Arrow's Reach Talisman", "Arrow's Sting Talisman", "Green Turtle Talisman"]
      : critical
        ? ["Assassin's Crimson Dagger", "Assassin's Cerulean Dagger", "Green Turtle Talisman"]
        : casterInt
          ? ["Graven-School Talisman", "Radagon Icon", "Cerulean Amber Medallion"]
          : casterFaith
            ? ["Faithful's Canvas Talisman", "Two Fingers Heirloom", "Radagon Icon"]
            : multihit
              ? ["Winged Sword Insignia", "Green Turtle Talisman", "Claw Talisman"]
              : charged
                ? ["Axe Talisman", "Green Turtle Talisman", "Arsenal Charm +1"]
                : ["Green Turtle Talisman", "Erdtree's Favor", "Dragoncrest Shield Talisman +1"];

  const lateTalismans = guard
    ? ["Greatshield Talisman", "Curved Sword Talisman", "Dragoncrest Shield Talisman +2", "Great-Jar's Arsenal"]
    : ranged
      ? ["Arrow's Reach Talisman", "Arrow's Sting Talisman", "Ritual Sword Talisman", "Dragoncrest Shield Talisman +2"]
      : critical
        ? ["Dagger Talisman", "Assassin's Cerulean Dagger", "Ritual Sword Talisman", "Dragoncrest Shield Talisman +2"]
        : casterInt
          ? ["Graven-Mass Talisman", "Radagon Icon", "Godfrey Icon", "Ritual Sword Talisman"]
          : casterFaith
            ? ["Faithful's Canvas Talisman", "Two Fingers Heirloom", "Radagon Icon", "Godfrey Icon"]
            : multihit
              ? ["Winged Sword Insignia", "Claw Talisman", "Green Turtle Talisman", "Dragoncrest Shield Talisman +2"]
              : charged
                ? ["Axe Talisman", "Green Turtle Talisman", "Dragoncrest Shield Talisman +2", "Great-Jar's Arsenal"]
                : ["Erdtree's Favor", "Ritual Shield Talisman", "Dragoncrest Shield Talisman +2", "Green Turtle Talisman"];

  let dlcTalismans = guard
    ? ["Greatshield Talisman", "Pearl Shield Talisman", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"]
    : ranged
      ? ["Arrow's Soaring Sting Talisman", "Sharpshot Talisman", "Arrow's Sting Talisman", "Two-Headed Turtle Talisman"]
      : critical
        ? ["Blade of Mercy", "Dagger Talisman", "Ritual Sword Talisman", "Two-Headed Turtle Talisman"]
        : casterInt
          ? ["Graven-Mass Talisman", "Radagon Icon", "Godfrey Icon", "Dragoncrest Greatshield Talisman"]
          : casterFaith
            ? ["Faithful's Canvas Talisman", "Flock's Canvas Talisman", "Godfrey Icon", "Two-Headed Turtle Talisman"]
            : multihit
              ? ["Winged Sword Insignia", "Claw Talisman", "Blade of Mercy", "Two-Headed Turtle Talisman"]
              : charged
                ? ["Two-Handed Sword Talisman", "Axe Talisman", "Great-Jar's Arsenal", "Two-Headed Turtle Talisman"]
                : ["Ritual Sword Talisman", "Two-Handed Sword Talisman", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"];

  if (arcane && includesAny(build, ["bleed", "blood"])) {
    const sets: Record<PhaseKey, string[]> = {
      early: ["Green Turtle Talisman", "Claw Talisman"],
      mid: ["Winged Sword Insignia", "Claw Talisman", "Green Turtle Talisman"],
      late: ["Lord of Blood's Exultation", "Winged Sword Insignia", "Green Turtle Talisman", "Dragoncrest Shield Talisman +2"],
      dlc: ["Lord of Blood's Exultation", "Winged Sword Insignia", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"],
    };
    dlcTalismans = sets.dlc;
    if (phase === "early") earlyTalismans.splice(0, earlyTalismans.length, ...sets.early);
    if (phase === "mid") midTalismans.splice(0, midTalismans.length, ...sets.mid);
    if (phase === "late") lateTalismans.splice(0, lateTalismans.length, ...sets.late);
  } else if (arcane && includesAny(build, ["poison", "rot", "venom"])) {
    dlcTalismans = ["Kindred of Rot's Exultation", "Rotten Winged Sword Insignia", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"];
  }

  const talismanSets: Record<PhaseKey, string[]> = { early: earlyTalismans, mid: midTalismans, late: lateTalismans, dlc: dlcTalismans };
  const chargedSkill = phase === "early"
    ? "War Cry or Endure"
    : phase === "mid"
      ? "Cragblade, Lion's Claw, Giant Hunt or War Cry according to weapon class"
      : "Cragblade, Lion's Claw, Giant Hunt or Royal Knight's Resolve according to weapon class";
  const skill = guard
    ? phase === "early" || phase === "mid"
      ? "No Skill shield; Impaling Thrust or Square Off on the weapon"
      : "No Skill shield; Impaling Thrust, Square Off or Prayerful Strike on the weapon"
    : ranged
      ? "Barrage or Mighty Shot early; use the named weapon skill when the route changes"
      : critical
        ? "Parry or Carian Retaliation, with Determination on the critical weapon"
        : charged
          ? chargedSkill
          : multihit
            ? "Sword Dance, Repeating Thrust or the named weapon's multihit skill"
            : casterInt
              ? "Carian Grandeur, Glintblade Phalanx or the named magic weapon skill"
              : casterFaith
                ? "Sacred Blade, Flaming Strike or the named elemental weapon skill"
                : "Keep the named skill; use Impaling Thrust or Sword Dance on infusible weapons";

  const spells = unique([
    ...(casterInt ? [phase === "early" ? "Glintstone Pebble" : "Great Glintstone Shard", "Carian Slicer", phase === "early" ? "Glintstone Arc" : phase === "dlc" ? "Glintblade Trio" : "Rock Sling"] : []),
    ...(casterFaith
      ? phase === "early"
        ? ["Catch Flame", "Flame Sling", "Heal"]
        : phase === "mid"
          ? ["Lightning Spear", "Flame, Grant Me Strength", "Heal"]
          : ["Golden Vow", "Flame, Grant Me Strength", phase === "dlc" ? "Knight's Lightning Spear" : "Lightning Spear"]
      : []),
    ...(arcane && includesAny(build, ["dragon"]) ? ["Dragonclaw", phase === "early" ? "Dragonfire" : "Rotten Breath"] : []),
  ]);

  const guardCatalyst = casterInt && casterFaith
    ? phase === "dlc" ? "Staff of the Great Beyond" : "Demi-Human Queen's Staff + Finger Seal"
    : casterInt ? phase === "early" ? "Demi-Human Queen's Staff" : "Academy Glintstone Staff"
      : casterFaith ? "Finger Seal" : "";
  const offhand = guard
    ? `Heater Shield${guardCatalyst ? ` + ${guardCatalyst}` : ""}`
    : casterInt && casterFaith
      ? phase === "early" ? "Demi-Human Queen's Staff + Finger Seal" : phase === "dlc" ? "Staff of the Great Beyond" : "Academy Glintstone Staff + Finger Seal"
      : casterInt
        ? phase === "early" ? "Demi-Human Queen's Staff" : "Academy Glintstone Staff"
        : casterFaith
          ? "Finger Seal"
          : arcane && includesAny(build, ["dragon"])
            ? "Dragon Communion Seal"
          : ranged
            ? "Short Sword"
            : "No off-hand item required";

  const namedMidSet = casterInt || casterFaith || ranged || lightLoad ? "Carian Knight Set" : "Knight Set";
  const namedLateSet = namedMidSet;
  const plannedStartingClass = build.startingClass === "Not specified" ? recommendStartingClass(build.stats, build.tags) : build.startingClass;
  const startingArmour = plannedStartingClass === "Wretch"
    ? "No starting armour (Wretch); buy the Knight Set at Roundtable Hold"
    : `${plannedStartingClass} starting armour`;
  const armour = phase === "early"
    ? `${startingArmour}; remove the heaviest piece only if the equipment screen shows Heavy Load`
    : phase === "mid"
      ? `${namedMidSet}; wear only the pieces that keep the equipment screen at ${lightLoad ? "Light Load" : "Medium Load"}`
      : `${namedLateSet}; wear only the pieces that keep the equipment screen at ${lightLoad ? "Light Load" : "Medium Load"}`;

  const earlyFlask = "Opaline Bubbletear + Crimsonburst Crystal Tear";
  const flask = phase === "early"
    ? earlyFlask
    : guard
      ? "Opaline Hardtear + Greenburst Crystal Tear"
      : casterInt
        ? phase === "mid" ? "Magic-Shrouding Cracked Tear + Opaline Bubbletear" : "Magic-Shrouding Cracked Tear + Cerulean Hidden Tear"
        : casterFaith && includesAny(build, ["fire", "blackflame", "frenzy"])
          ? "Flame-Shrouding Cracked Tear + Opaline Hardtear"
          : casterFaith && includesAny(build, ["lightning"])
            ? "Lightning-Shrouding Cracked Tear + Greenburst Crystal Tear"
            : multihit
              ? phase === "mid" ? "Greenburst Crystal Tear + Dexterity-knot Crystal Tear" : "Thorny Cracked Tear + Greenburst Crystal Tear"
              : charged
                ? "Spiked Cracked Tear + Stonebarb Cracked Tear"
                : "Opaline Hardtear + Greenburst Crystal Tear";

  const mainStats = build.stats.replace("→", "then");
  const spellRequirement = casterInt || casterFaith ? "; meet every equipped spell's listed requirement before memorizing it" : "";
  const stats: Record<PhaseKey, string> = {
    early: `VIG 25 first; meet ${mainStats} weapon requirements${spellRequirement}; END or MND only as needed`,
    mid: `VIG 40; raise the first listed damage stat toward 35–40${spellRequirement}; keep enough END for medium roll`,
    late: `VIG 55–60; main damage stat 55–60; secondary stat 25–40${spellRequirement}; MND 20–30 for regular skill or spell use`,
    dlc: `Keep VIG 60; finish the main scaling stat at 60–80${spellRequirement}; use remaining levels for END, MND and the listed secondary stat`,
  };

  const curatedBaseline = build.collection === "Curated" ? bridgePlan(build)[phase] : undefined;
  return applyEarlyStarter(build, phase, {
    level: levels[phase],
    weapon: build.phases[phase],
    offhand,
    skill,
    talismanSlots: slots[phase],
    talismans: unique(talismanSets[phase]),
    armour,
    spells,
    flask,
    stats: stats[phase],
    borrowedFrom: curatedBaseline ? { ...curatedBaseline.source, buildName: curatedBaseline.name } : undefined,
    sourceUse: curatedBaseline ? "curated-baseline" : undefined,
    weaponChoice: curatedBaseline ? {
      rationale: `${build.name} is a curated progression variant built on the sourced ${curatedBaseline.name} ${phase} setup. Its named weapon stays in the same damage-stat and combat-style lane while the route advances toward the final build.`,
      sources: [curatedBaseline.source, build.source],
    } : undefined,
  });
}

export type Chapter = {
  id: string;
  act: "Base game" | "Shadow of the Erdtree";
  title: string;
  region: string;
  level: string;
  upgrade: string;
  blessing?: string;
  grace: string;
  x: number;
  y: number;
  phase?: PhaseKey;
  summary: string;
  essentials: string[];
  directions: string;
  boss?: string;
  remembrance?: boolean;
  quest?: string;
  repeatInStandard?: boolean;
};

const chapterData: Chapter[] = [
  { id: "first-steps", act: "Base game", title: "First Steps", region: "West Limgrave", level: "1–15", upgrade: "+0–2 / Somber +1", grace: "The First Step", x: 34, y: 76, phase: "early", summary: "Unlock Torrent, Roundtable Hold and the opening smithing services before assembling every player's first functional kit.", essentials: ["Church of Elleh: Crafting Kit, Kale and smithing table", "Gatefront: Whetstone Knife and first map", "Accept Melina's accord and receive Torrent", "Meet Renna at Church of Elleh at night", "Meet Boc south-east of Agheel Lake North", "Meet Roderika at Stormhill Shack", "Enter Margit's arena once to trigger the Roundtable Hold invitation", "Accept Melina's invitation and meet Smithing Master Hewg", "Clear Fort Haight and speak to Kenneth Haight", "Collect Dectus Medallion (Left) at Fort Haight", "Third Church: Flask of Wondrous Physick", "Optional no-boss Fort Faroth detour: take the waygate behind Third Church to Bestial Sanctum, ride south and loot Radagon's Soreseal via the fort's roof-to-rafters route", "WARNING — Radagon's Soreseal increases all damage taken by 15%; use it only while the early stat gain outweighs the penalty, then unequip it", "Limgrave Tunnels: sweep the wall deposits and collect the finite Somber Smithing Stone [1] before leaving"], directions: "Walk north from The First Step to Church of Elleh, then continue to Gatefront and rest there to accept Melina's accord and receive Torrent. Return to Elleh at night for Renna, visit Roderika, and enter Margit's arena once; defeating him is not required for Melina's Roundtable invitation. Meet Hewg before the route asks for upgrades beyond the Church of Elleh table's +3 regular or +1 Somber limit. Then sweep Fort Haight, Third Church and Limgrave Tunnels. The Fort Faroth run is an optional no-boss loot detour: avoid combat, grab the Soreseal and fast-travel out." },
  { id: "weeping", act: "Base game", title: "The Weeping Peninsula", region: "Weeping Peninsula", level: "18–30", upgrade: "+3–5 / Somber +2", grace: "Castle Morne Rampart", x: 37, y: 91, phase: "early", summary: "Sweep the peninsula's early upgrade materials and complete only the optional NPC tracks selected for this run.", essentials: ["Clear Coastal Cave and return Boc's Sewing Needle", "Defeat Darriwil with Blaidd at Forlorn Hound Evergaol, then speak to Blaidd for the finite Somber Smithing Stone [2]", "Morne Tunnel: collect the finite Somber Smithing Stone [1] and sweep the wall deposits", "Speak to Irina before entering Castle Morne", "Give Irina's letter to Edgar before the boss", "Defeat Leonine Misbegotten", "Collect the finite Somber Smithing Stone [1] on the shoreline behind Castle Morne", "Show Edgar the Grafted Blade Greatsword", "Return to Irina and Edgar before leaving"], directions: "Clear Coastal Cave and claim Blaidd's fixed Somber [2] reward if those optional tracks are enabled. Sweep Morne Tunnel, then follow the Irina and Edgar cards only when that quest was selected.", boss: "Leonine Misbegotten", quest: "Selected optional tracks: Blaidd, Boc, Irina and Edgar", repeatInStandard: true },
  { id: "stormveil", act: "Base game", title: "Stormveil Castle", region: "Stormhill & Stormveil", level: "30–40", upgrade: "+4–7 / Somber +2–3", grace: "Stormveil Main Gate", x: 28, y: 63, phase: "early", summary: "Secure the first Great Rune while preserving Gostoc, Rogier, Nepheli and Roderika's later rewards.", essentials: ["Defeat Margit", "Keep Gatekeeper Gostoc alive for his later Ancient Dragon Smithing Stone", "Collect Chrysalids' Memento for Roderika", "Collect Iron Whetblade and Misericorde", "Defeat the Lion Guardian for its fixed Somber Smithing Stone [1]", "Meet Rogier in the chapel and inspect the corpse below Stormveil", "Meet Nepheli before Godrick", "Defeat Godrick the Grafted", "Move Roderika to Roundtable Hold and unlock spirit tuning"], directions: "Take Gostoc's side path but leave him alive. Meet Rogier and Nepheli, collect Roderika's memento, the Lion Guardian's fixed Somber [1] and the rewards beneath the castle before Godrick. Afterward alternate Roderika and Hewg dialogue at Roundtable until spirit tuning opens.", boss: "Godrick the Grafted", remembrance: true, quest: "Gostoc, Rogier, Nepheli and Roderika", repeatInStandard: true },
  { id: "liurnia-south", act: "Base game", title: "Liurnia South", region: "Liurnia of the Lakes", level: "40–50", upgrade: "+7–10 / Somber +3–4", grace: "Lake-Facing Cliffs", x: 37, y: 47, phase: "mid", summary: "Start Varre and Latenna, preserve Ensha's missable gesture and prepare the Academy key route.", essentials: ["Meet Hyetta and give her the first Shabriri Grape", "Meet Thops at Church of Irith", "Speak to Ensha at Roundtable Hold before taking a secret medallion", "Find Albus and collect Haligtree Secret Medallion (Right)", "Clear Lakeside Crystal Cave and show Latenna the medallion", "Accept Latenna's request and receive her spirit ashes", "Meet Varre at Rose Church and choose that the Fingers seemed off", "Use three Festering Bloody Fingers for Varre; offline players may defer Magnus to Altus", "If Varre's invasion trial is complete, soak the Lord of Blood's Favor in maiden blood and return to Varre", "Keep the Pureblood Knight's Medal if received, but do not use it for early farming", "Reach Iji in north-west Liurnia; buy only the finite Somber Smithing Stone [3] and [4] stock each active unique weapon needs", "Collect Academy Glintstone Key", "Defeat the Crystalian for Smithing-Stone Miner's Bell Bearing [1]"], directions: "Use the lake shallows as a hub. Start Hyetta and Thops, visit Albus before Latenna beyond Lakeside Crystal Cave, and advance Varre with three online invasion attempts. Offline players defer Magnus until the Altus route reaches Writheblood Ruins. Reserve Iji's finite Somber [3] and [4] stones for active weapons, collect the Academy key and end at Raya Lucaria Crystal Tunnel.", quest: "Ensha, Latenna, Varre, Hyetta and Thops" },
  { id: "academy", act: "Base game", title: "Academy of Raya Lucaria", region: "Raya Lucaria", level: "50–60", upgrade: "+10–12 / Somber +4–5", grace: "Main Academy Gate", x: 43, y: 42, phase: "mid", summary: "Defeat Rennala, finish Thops and advance Yura without letting upgraded uniques run ahead.", essentials: ["Use Yura's red summon sign on the Main Academy Gate bridge", "Defeat Red Wolf of Radagon", "Collect Radagon Icon", "Collect the second Academy Glintstone Key", "Give the spare key to Thops and recover Thops's Barrier afterward", "Defeat Rennala"], directions: "Before entering, help Yura from the red sign beyond the northern seal. Inside, collect the spare key from the church rooftop route, give it to Thops and later recover his bell bearing and Barrier near Schoolhouse Classroom before Rennala. Rebirth is now available if the player deliberately chooses it, but this route never requires a respec.", boss: "Rennala, Queen of the Full Moon", remembrance: true, quest: "Yura and Thops", repeatInStandard: true },
  { id: "caria", act: "Base game", title: "Caria and Ranni", region: "West Liurnia", level: "55–65", upgrade: "+11–13 / Somber +5", grace: "Road to the Manor", x: 28, y: 35, phase: "mid", summary: "Preserve Rogier and Nepheli's rewards, begin Ranni and activate Radahn's Festival without entering Altus early.", essentials: ["Clear Black Knife Catacombs and give the Black Knifeprint to Rogier", "Use the Four Belfries return waygate and collect the Stormhawk King", "Give Nepheli the Stormhawk King after her Village of the Albinaurics dialogue", "Defeat Royal Knight Loretta", "Exhaust Rogier before joining Ranni", "Speak to Ranni and all three retainers", "Meet Blaidd in Siofra", "Ask Iji about Jerren to confirm the Radahn Festival", "Return to Blaidd in Siofra and exhaust his dialogue", "Do not attack Seluvis or any quest NPC"], directions: "Finish Rogier's Black Knifeprint and collect Nepheli's Stormhawk King first. Clear Caria Manor, enter Ranni's service, meet Blaidd in Siofra, then ask Iji about Jerren to start the Radahn Festival. Seluvis and Sellen are visited here only when that optional questline was selected.", boss: "Royal Knight Loretta", quest: "Rogier, Nepheli, Ranni and Radahn Festival activation", repeatInStandard: true },
  { id: "caelid", act: "Base game", title: "The Radahn Festival", region: "South Caelid", level: "60–70", upgrade: "+12–15 / Somber +5–6", grace: "Chamber Outside the Plaza", x: 72, y: 63, phase: "mid", summary: "Start Millicent safely, open Nokron and satisfy the first half of the DLC access requirement.", essentials: ["Collect Map: Caelid", "Defeat Commander O'Neil in Aeonia Swamp and take the Unalloyed Gold Needle", "Give the needle to Gowry, reload, then give the repaired needle to Millicent", "Reload Church of the Plague, exhaust Millicent, then revisit Gowry's Shack", "Collect Dectus Medallion (Right) at Fort Faroth without fighting Greyoll", "If the optional early detour was skipped, loot Radagon's Soreseal now via Fort Faroth's roof-to-rafters route; WARNING — it increases all damage taken by 15%", "Sellia Crystal Tunnel: defeat the Fallingstar Beast for Somberstone Miner's Bell Bearing [1]", "Use the sending gate at Impassable Greatbridge", "Speak to Jerren in Redmane Plaza to begin the festival", "Defeat Starscourge Radahn", "Exhaust Alexander and Blaidd in the Wailing Dunes before leaving"], directions: "Enter from Smoldering Church, finish O'Neil and Millicent's Church of the Plague steps, then clear Sellia Crystal Tunnel for Somber stones [1] and [2]. Visit Fort Faroth for the medallion and the Soreseal fallback if needed, then follow the southern road to Impassable Greatbridge and the Wailing Dunes.", boss: "Starscourge Radahn", remembrance: true, quest: "Millicent, Ranni and Alexander; DLC access requirement", repeatInStandard: true },
  { id: "nokron", act: "Base game", title: "Nokron Expedition", region: "Nokron & Siofra", level: "70–80", upgrade: "+15–18 / Somber +6", grace: "Nokron, Eternal City", x: 51, y: 70, phase: "mid", summary: "Collect Mimic Tear and the Fingerslayer Blade, but hold the blade until Altus supplies Seluvis's missable reward.", essentials: ["Defeat Mimic Tear", "Collect Mimic Tear Ashes behind Stonesword seal", "Collect Fingerslayer Blade but do not give it to Ranni", "Defeat Regal Ancestor Spirit"], directions: "Enter the crater south of Mistwood and cross the rooftops. Take the Fingerslayer Blade from Night's Sacred Ground but keep it in inventory; giving it to Ranni now kills Seluvis and loses Magic Scorpion Charm.", boss: "Regal Ancestor Spirit", remembrance: true, quest: "Hold the Fingerslayer Blade for Seluvis", repeatInStandard: true },
  { id: "altus", act: "Base game", title: "Altus Supply Line", region: "Altus Plateau", level: "75–90", upgrade: "+16–19 / Somber +6–7", grace: "Altus Highway Junction", x: 55, y: 35, phase: "mid", summary: "Resolve Seluvis safely, advance Boc, Fia, Millicent and Goldmask, and avoid entering the capital early.", essentials: ["Use both Dectus Medallion halves at the Grand Lift", "Rest at Altus Plateau grace and revisit Roundtable quest NPCs", "Give D the Weathered Dagger from Fia and reload Roundtable Hold", "Collect Amber Starlight north-east of Altus Highway Junction", "Finish Seluvis's potion and puppet steps unless delaying for Dung Eater Puppet", "Give Amber Starlight to Seluvis and collect Magic Scorpion Charm", "Do not give Ranni the Amber Draught", "Give Fingerslayer Blade to Ranni only after the selected Seluvis outcome", "Receive the Carian Inverted Statue from Ranni", "Use the statue in Carian Study Hall and collect the Cursemark of Death", "Give Boc the Gold Sewing Needle and use You're Beautiful instead of a Larval Tear", "Collect Valkyrie's Prosthesis from the Shaded Castle", "Give the prosthesis to Millicent at Erdtree-Gazing Hill", "Defeat the Godskin Apostle at Windmill Village and speak to Millicent", "Find Goldmask at the Forest-Spanning Greatbridge and reunite Corhyn with him", "Altus Tunnel: defeat the Crystalian duo for Somberstone Miner's Bell Bearing [2]", "Sealed Tunnel: Smithing-Stone Miner's Bell Bearing [2]"], directions: "Rest on Altus to advance Roundtable, resolve Fia's dagger and Seluvis before handing Ranni the blade. If a selected build needs Dung Eater Puppet, hold the potion, charm and blade hand-in until Leyndell instead. Finish Boc, Millicent and Goldmask, then clear Altus Tunnel and Sealed Tunnel for both upgrade-material bell bearings before the capital.", quest: "Seluvis hard lock, Boc, Fia, Millicent and Goldmask", repeatInStandard: true },
  { id: "gelmir", act: "Base game", title: "Volcano Manor — first visit", region: "Mt. Gelmir", level: "80–95", upgrade: "+18–20 / Somber +7", grace: "Volcano Manor", x: 35, y: 29, phase: "late", summary: "Resolve Rya and the available contracts, finish Sellen's sorcery branch and leave Rykard alive.", essentials: ["Join Volcano Manor and take the Drawing-Room Key", "Complete Old Knight Istvan and Rileigh contracts", "Take Bernahl's red letter after Rileigh", "Defeat Magma Wyrm Makar and complete Patches' Tragoth request", "Advance Diallos and Rya dialogue", "Defeat Godskin Noble", "Collect Serpent's Amnion and give it to Rya", "Reload, find Rya in the side room and settle the Tonic of Forgetfulness decision", "Meet Primeval Sorcerer Azur and receive Comet Azur", "Show Comet Azur to Sellen and find Master Lusat in Sellia Hideaway", "Move Sellen's primal glintstone and resolve the Sellen or Jerren summon signs", "Do not defeat Rykard before Juno, Bernahl and Rya are complete"], directions: "Complete the Manor letters and side requests, give Rya the Serpent's Amnion and settle her disappearance. On Mt. Gelmir start Sellen's Azur/Lusat finale and resolve her summon signs after Radahn. Leave Rykard alive.", quest: "Rya, Patches, Bernahl, Diallos and Sellen", repeatInStandard: true },
  { id: "leyndell", act: "Base game", title: "Leyndell, Royal Capital", region: "Leyndell", level: "90–110", upgrade: "+20–22 / Somber +7–8", grace: "East Capital Rampart", x: 63, y: 37, phase: "late", summary: "Enter with two Great Runes, finish the original-capital contracts and resolve the quest states Maliketh will remove.", essentials: ["Confirm at least two Great Runes are obtained", "Defeat Draconic Tree Sentinel and enter Leyndell", "Complete Bernahl's Vargram and Wilhelm invasion in Fortified Manor", "Return to Bernahl for Gelmir's Fury", "Collect Bolt of Gransax before Maliketh", "Collect Coded Sword before Maliketh", "Collect the Seedbed Curses in Fortified Manor and East Capital Rampart", "Buy prawn from Blackguard Boggart before releasing Dung Eater", "Visit Dung Eater's projection and unlock his sewer gaol before the Ashen transition", "Release Dung Eater, defeat his moat invasion and choose the curse or puppet route", "Collect Golden Order Principia above Erdtree Sanctuary", "Learn Law of Regression and cast it before Radagon's statue", "Tell Goldmask that Radagon is Marika", "Defeat Godfrey's golden shade", "Defeat Morgott", "Finish Nepheli and Kenneth, then reload Godrick's throne room with Gostoc alive"], directions: "Clear Bernahl's contract and the two legendary weapons before climbing the roots. Resolve Boggart and Dung Eater in the sewers and moat, then retrieve the Principia and solve Goldmask's statue message. After Morgott, finish Nepheli and Kenneth for their throne-room smithing stones.", boss: "Morgott, the Omen King", remembrance: true, quest: "Bernahl, Dung Eater, Goldmask, Nepheli and original-capital missables", repeatInStandard: true },
  { id: "ainsel", act: "Base game", title: "Moonlight Depths", region: "Ainsel, Nokstella & Lake of Rot", level: "90–110", upgrade: "+20–22 / Somber +8", grace: "Ainsel River Main", x: 48, y: 55, phase: "late", summary: "Finish Ranni's underground journey, unlock Moonlight Altar and collect the actual quest reward.", essentials: ["Take the Miniature Ranni and exhaust dialogue at three graces", "Defeat Baleful Shadow", "Collect Dark Moon Ring from Rennala's locked chest", "Defeat Astel", "Take the lift to Moonlight Altar", "Defeat or pass Glintstone Dragon Adula", "Give Ranni the Dark Moon Ring beneath Cathedral of Manus Celes", "Collect Dark Moon Greatsword and exhaust Iji, Blaidd and Ranni aftermath dialogue"], directions: "Use Renna's Rise waygate, speak to the doll at Ainsel graces and follow Nokstella through Lake of Rot and Astel. After Astel, cross Moonlight Altar to the cathedral, descend the floor opening and give Ranni the ring.", boss: "Astel, Naturalborn of the Void", remembrance: true, quest: "Ranni ending and Dark Moon Greatsword", repeatInStandard: true },
  { id: "deeproot", act: "Base game", title: "Deeproot and Fia", region: "Deeproot Depths", level: "90–110", upgrade: "+20–22 / Somber +8", grace: "Across the Roots", x: 55, y: 50, summary: "Resolve Fia and D's brother after obtaining Ranni's Cursemark and collect Deeproot's build rewards.", essentials: ["Defeat the Valiant Gargoyles and give D's brother the Twinned Set", "Defeat Crucible Knight Siluria", "Defeat Fia's Champions", "Give Fia the Cursemark of Death", "Exhaust Fia's dialogue and reload", "Enter the deathbed dream", "Defeat Lichdragon Fortissax", "Reload Fia and D's brother for the Mending Rune and Twinned Set"], directions: "After the Gargoyles, give the silent man outside their arena D's Twinned Set and take the coffin to Deeproot. Clear Siluria and Fia's Champions, give Fia the Cursemark and reload through Fortissax, then return once more for both quest rewards.", boss: "Lichdragon Fortissax", remembrance: true, quest: "Fia, D and the Mending Rune of the Death-Prince", repeatInStandard: true },
  { id: "mountaintops", act: "Base game", title: "Mountaintops of the Giants", region: "Mountaintops", level: "105–120", upgrade: "+22–24 / Somber +8–9", grace: "Zamor Ruins", x: 68, y: 20, phase: "late", summary: "Finish the last Manor, Latenna, Millicent and Goldmask stops, secure the Haligtree route and stop before the Forge.", essentials: ["Receive Rold Medallion from Melina after Morgott", "Use Grand Lift of Rold and enter the Mountaintops", "Zamor Ruins: Smithing-Stone Miner's Bell Bearing [3]", "First Church of Marika: collect Somberstone Miner's Bell Bearing [3]", "Meet Millicent at Ancient Snow Valley Ruins", "Meet Corhyn and Goldmask on the bridge south of Stargazers' Ruins", "Complete Shabriri and Yura decisions without inheriting the Frenzied Flame by accident", "Defeat Juno Hoslow for the final Volcano Manor contract", "Defeat Commander Niall at Castle Sol", "Collect Haligtree Secret Medallion (Left)", "Summon Latenna at Apostate Derelict for the Somber Ancient Dragon Smithing Stone", "Defeat Fire Giant", "Do not use the Forge until the quest safety check is complete"], directions: "Use Rold, collect both miner bell bearings at Zamor Ruins and First Church of Marika, then finish Millicent, Goldmask and Juno before clearing Castle Sol. With both secret halves reach Apostate Derelict and summon Latenna before Fire Giant. Wait at the Forge until every pre-burning card is complete.", boss: "Fire Giant", remembrance: true, quest: "Latenna and final pre-Forge NPC checks", repeatInStandard: true },
  { id: "rykard", act: "Base game", title: "Volcano Manor — Rykard", region: "Mt. Gelmir", level: "110–125", upgrade: "+22–24 / Somber +8–9", grace: "Volcano Manor", x: 35, y: 29, phase: "late", summary: "Return only after the Mountaintops contract so no Manor or Jarburg reward is lost.", essentials: ["Report Juno Hoslow's defeat to Tanith", "Finish Rya's dialogue and choice", "Collect Bernahl, Patches and Tanith contract rewards", "Advance Diallos to Jarburg and exhaust Jar-Bairn", "Defeat Rykard", "Reload Rykard's arena for Tanith and finish Patches at Shaded Castle and Murkwater Cave"], directions: "After Juno, exhaust every Manor resident and advance Diallos in Jarburg before fighting Rykard. Afterward reload the arena for Tanith, find Patches at Shaded Castle for the castanets, then return to Murkwater Cave for his final shop state.", boss: "Rykard, Lord of Blasphemy", remembrance: true, quest: "Final Volcano Manor, Patches, Diallos and Jar-Bairn lock point", repeatInStandard: true },
  { id: "haligtree", act: "Base game", title: "Consecrated Snowfield & Haligtree", region: "Consecrated Snowfield, Miquella's Haligtree & Elphael", level: "120–140", upgrade: "+24–25 / Somber +9–10", grace: "Haligtree Canopy", x: 23, y: 17, phase: "late", summary: "Open the secret lift route, finish Millicent's final branch and clear the optional endgame Remembrances without skipping their prerequisites.", essentials: ["Hoist the secret medallion at the Grand Lift of Rold", "Clear Hidden Path to the Haligtree and collect the Snowfield map", "Light all four Ordina evergaol statues", "Use the Ordina waygate to reach the Haligtree Canopy", "Defeat Loretta and descend into Elphael", "Meet Millicent at the Prayer Room", "Defeat the Ulcerated Tree Spirit beside the Drainage Channel", "Choose Millicent's gold summon sign and collect Rotten Winged Sword Insignia", "Return to Millicent after reloading and recover the Unalloyed Gold Needle", "Collect Dragoncrest Greatshield Talisman in Elphael", "Defeat Malenia", "Return the needle to Malenia's bloom for Miquella's Needle"], directions: "At the Grand Lift of Rold choose 'Hoist secret medallion'. Clear the Hidden Path, cross the snowfield to Ordina and light its four rooftop statues inside the evergaol. The opened waygate reaches Haligtree Canopy. Defeat Loretta before entering Elphael, then complete Millicent's Drainage Channel summon branch before Malenia.", boss: "Malenia, Goddess of Rot", remembrance: true, quest: "Millicent's summon choice and Miquella's Needle", repeatInStandard: true },
  { id: "mohgwyn", act: "Base game", title: "Mohgwyn Palace", region: "Mohgwyn Palace", level: "120–140", upgrade: "+24–25 / Somber +9–10", grace: "Dynasty Mausoleum Midpoint", x: 45, y: 82, phase: "late", summary: "Complete Varre's remaining rewards, use Mohg's countermeasure and defeat the second boss required for DLC access.", essentials: ["Use the Pureblood Knight's Medal or Consecrated Snowfield waygate", "Speak to Varre at Dynasty Mausoleum Midpoint and invade him", "Mix Purifying Crystal Tear before Mohg", "Defeat Mohg"], directions: "Enter with Varre's medal after completing his audience or use the blood-stained waygate on the Snowfield's western cliff. Follow the blood marsh to Dynasty Mausoleum Midpoint, finish Varre's red-sign invasion, then use Eleonora's tear in the Wondrous Physick before Mohg's phase-transition ritual.", boss: "Mohg, Lord of Blood", remembrance: true, quest: "Varre rewards and DLC access gate", repeatInStandard: true },
  { id: "farum", act: "Base game", title: "Crumbling Farum Azula", region: "Farum Azula", level: "125–145", upgrade: "+25 / Somber +10", grace: "Dragon Temple", x: 78, y: 25, phase: "late", summary: "Finish Alexander, Gideon's reports and the original-capital checks before Maliketh changes the world.", essentials: ["Confirm Goldmask's Mountaintops message and every original-capital pickup are complete", "Collect Gideon's rewards for Mohg, Malenia, Haligtree and Mohgwyn before Maliketh", "Speak to Melina at the Forge and commit to the cardinal sin", "Tempest-Facing Balcony: collect Somberstone Miner's Bell Bearing [4] from the nearby cliff-edge corpse", "Defeat Godskin Duo for Smithing-Stone Miner's Bell Bearing [4]", "Meet Alexander beyond the Dragon Temple Lift and finish his duel", "Beside the Great Bridge: collect Somberstone Miner's Bell Bearing [5] from the altar below the grace", "Find the hidden Placidusax drop-down", "Defeat Dragonlord Placidusax", "Confirm Bolt of Gransax and Coded Sword are collected", "Defeat Maliketh only after every listed check"], directions: "Finish Gideon's reports before using the Forge. In Farum Azula take Somber bearing [4] just after Tempest-Facing Balcony, defeat the Godskin Duo, finish Alexander and collect Somber bearing [5] below Beside the Great Bridge. Take the Placidusax drop-down and only then approach Maliketh; his defeat permanently creates the Ashen Capital and moves Gideon.", boss: "Maliketh, the Black Blade", remembrance: true, quest: "Gideon, Alexander and the hard Ashen Capital world-state change", repeatInStandard: true },
  { id: "ashen", act: "Base game", title: "The Elden Throne", region: "Leyndell, Ashen Capital", level: "135–155", upgrade: "+25 / Somber +10", grace: "Leyndell, Capital of Ash", x: 62, y: 38, phase: "late", summary: "Collect the post-Maliketh quest rewards and conclude the base game without accidentally entering Journey 2.", essentials: ["Collect Goldmask's Mending Rune of Perfect Order below the colosseum", "Collect any remaining Ashen Capital rewards", "Defeat Gideon Ofnir", "Defeat Godfrey / Hoarah Loux", "Defeat Radagon and Elden Beast", "Choose ending; do not start Journey 2"], directions: "From Capital of Ash, collect Goldmask's rune before crossing the buried capital. Defeat Gideon, climb to the Queen's Bedchamber, defeat Godfrey and enter the Erdtree. After choosing an ending, decline Journey 2 at Roundtable Hold so the DLC route remains available.", boss: "Elden Beast", remembrance: true, quest: "Goldmask reward and base-game finale", repeatInStandard: true },
  { id: "gravesite", act: "Shadow of the Erdtree", title: "Gravesite Plain", region: "Gravesite Plain", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 1–3", grace: "Gravesite Plain", x: 35, y: 79, phase: "dlc", summary: "Enter after Radahn and Mohg, collect the pre-rune-break NPC rewards and establish a modest blessing curve.", essentials: ["Confirm Radahn and Mohg are defeated", "Touch Miquella's withered arm in Mohg's arena", "Speak to Leda at the cocoon and enter the Realm of Shadow", "Meet Freyja and Hornsent at Three-Path Cross", "Meet Moore and Ansbach at Main Gate Cross", "Assist the friendly Forager Brood before its cookbook opportunities close", "Get Black Syrup from Moore and give it to Thiollier", "Tell Thiollier you are weary of life and keep Thiollier's Concoction", "Collect two Scadutree Fragments at Church of Consolation", "Defeat Blackgaol Knight", "Defeat Fire Knight Queelign's Belurat invasion", "Clear Belurat and defeat Divine Beast Dancing Lion", "Wear the Divine Beast Head for Hornsent Grandam and give her Scorpion Stew to Hornsent"], directions: "After Elden Beast, enter through Mohg's cocoon. Meet every follower, collect Moore and Thiollier's pre-break items and help the non-hostile Forager Brood. Defeat Queelign's Belurat invasion and Dancing Lion, then use the Divine Beast Head with Hornsent Grandam before the rune breaks.", boss: "Divine Beast Dancing Lion", remembrance: true, quest: "Pre-rune-break follower, Hornsent Grandam and Queelign rewards", repeatInStandard: true },
  { id: "ensiss", act: "Shadow of the Erdtree", title: "Castle Ensis", region: "Castle Ensis", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 4–6", grace: "Castle Ensis Checkpoint", x: 55, y: 63, phase: "dlc", summary: "Clear Ensis, meet Dane and only then cross one of the great-rune trigger boundaries.", essentials: ["Collect the Three-Path Cross and Castle Ensis Cross fragments", "Finish Moore, Thiollier, Freyja, Hornsent and Ansbach dialogue", "Collect Milady and Wing Stance inside Castle Ensis", "Defeat Rellana", "Enter Scadu Altus but stop at Highroad Cross", "Read the Monk's Missive and use May the Best Win before Dryleaf Dane", "Defeat Dryleaf Dane and collect Dryleaf Arts", "Revisit every follower before any rune-break boundary", "Avoid Shadow Keep, eastern Scadu Altus, Rauh Base and the Bonny Village bridges until ready", "Trigger the great-rune break only after the follower check"], directions: "Clear Castle Ensis and Rellana, stop at Highroad Cross and duel Dane with the gesture from the Monk's Missive. Revisit all followers before crossing a Shadow Keep, eastern-Altus, Bonny or Rauh trigger boundary.", boss: "Rellana, Twin Moon Knight", remembrance: true, quest: "Dryleaf Dane and DLC great-rune break checkpoint", repeatInStandard: true },
  { id: "fissure", act: "Shadow of the Erdtree", title: "Cerulean Coast & Fissure", region: "Southern Shore", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 6–8", grace: "Fissure Depths", x: 32, y: 92, summary: "Use the great-rune break to open the Fissure, then finish Thiollier and St. Trina's required dialogue before the DLC finale.", essentials: ["Confirm Miquella's great rune has broken and the Fissure seal is open", "Buy Thiollier's remaining stock and tell him St. Trina's location", "Reach the Cerulean Coast map by the Ellac River route", "Descend Stone Coffin Fissure", "Defeat Putrescent Knight", "Imbibe St. Trina's nectar four times until she speaks", "Tell Thiollier St. Trina's words and defeat his invasion", "Imbibe again and exhaust Thiollier's dialogue"], directions: "From Castle Front descend through the Ellac River cave and follow the river south to Cerulean Coast. After the great-rune message removes the seal, send Thiollier to St. Trina and descend the coffins to Fissure Depths. Defeat Putrescent Knight, repeatedly imbibe the nectar despite the deaths, relay the words to Thiollier and resolve his invasion so he remains available at Enir-Ilim.", boss: "Putrescent Knight", remembrance: true, quest: "Thiollier summon and St. Trina reward", repeatInStandard: true },
  { id: "shadow-keep", act: "Shadow of the Erdtree", title: "Shadow Keep Crossroads", region: "Scadu Altus", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 8–10", grace: "Highroad Cross", x: 57, y: 45, summary: "Resolve every post-break choice, Queelign's Iris reward and the Storehouse exchanges before Messmer.", essentials: ["Speak to Leda, Hornsent, Ansbach, Freyja, Moore, Thiollier and Dane after the rune breaks", "Choose Moore's answer only after collecting the available Forager Brood cookbooks", "Collect the O Mother gesture north of Bonny Village", "Defeat Fire Knight Queelign's Church of the Crusade invasion", "Find Queelign in Shadow Keep Prayer Room and choose the Iris reward", "Resolve the Leda and Hornsent bridge summon signs before entering Messmer's arena", "Defeat Golden Hippopotamus", "Open Storehouse First Floor, Seventh Floor, Loft and Back Gate paths", "Speak to Freyja on the seventh floor and then tell Ansbach about her", "Give Ansbach the Secret Rite Scroll and receive the Letter for Freyja", "Deliver Ansbach's letter to Freyja and exhaust both characters", "Resolve the Leda and Ansbach Storehouse signs for the party's required reward", "Do not enter Messmer's arena until every faction card is complete"], directions: "Revisit all followers first. Collect O Mother and finish Queelign's second invasion and Prayer Room choice. Resolve Leda's bridge signs, then complete the Freyja/Ansbach scroll and letter order before Messmer.", quest: "Queelign, Moore, Hornsent, Leda, Ansbach and Freyja irreversible choices", repeatInStandard: true },
  { id: "gaius-avatar", act: "Shadow of the Erdtree", title: "Scaduview & Hinterland", region: "Shadow Keep rear", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 10–12", grace: "Shadow Keep, Back Gate", x: 67, y: 32, summary: "Collect a measured set of fragments and clear two optional Remembrances behind the keep.", essentials: ["Defeat Commander Gaius", "Collect Scaduview Chalice fragments but stop at target", "Open Hinterland with the O Mother gesture", "Defeat Scadutree Avatar"], directions: "Climb the Specimen Storehouse to the loft and back gate. Take the field path for Gaius, then use the hidden statue route for Hinterland and the Tree-Worship Passage.", boss: "Commander Gaius, Scadutree Avatar", remembrance: true, repeatInStandard: true },
  { id: "jagged", act: "Shadow of the Erdtree", title: "Jagged Peak", region: "Jagged Peak", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 11–13", grace: "Jagged Peak Summit", x: 81, y: 66, summary: "Finish Igon and deliberately choose the Dragon Communion Priestess reward branch before Bayle.", essentials: ["Speak to Igon beside Pillar Path Waypoint", "Defeat Ancient Dragon-Man in Dragon's Pit", "Meet the Dragon Communion Priestess at the Grand Altar", "Choose whether to give the Priestess Thiollier's Concoction at night", "Speak to Igon after the two drakes fight and receive his finger", "Defeat Ancient Dragon Senessax", "Use Igon's summon sign inside Bayle's arena", "Defeat Bayle the Dread", "Return to Igon and the Dragon Communion Priestess for both reward sets"], directions: "Meet Igon and the Priestess before climbing. Give the Priestess Thiollier's Concoction at night only for her spirit and Dragonbolt; leave her awake for Flowerstone Gavel and Priestess Heart. Summon Igon inside Bayle's arena and revisit both afterward.", boss: "Bayle the Dread", quest: "Igon and mutually exclusive Dragon Communion Priestess rewards", repeatInStandard: true },
  { id: "abyss", act: "Shadow of the Erdtree", title: "Abyssal Woods", region: "Abyssal Woods", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 12–14", grace: "Second Floor Chamber", x: 76, y: 83, summary: "Use Shadow Keep's hidden coffin route and clear the mandatory catacomb boss before Midra.", essentials: ["Take the hidden ladder beside Shadow Keep's main plaza", "Ride the stone coffin to Castle Watering Hole", "Clear Darklight Catacombs and defeat Jori, Elder Inquisitor", "Cross Abyssal Woods without Torrent", "Enter Midra's Manse and pull the portrait lever", "Defeat Midra"], directions: "Use the ladder and waterfall passage in Shadow Keep to reach the coffin. Clear Darklight Catacombs and Jori to open Abyssal Woods, sneak past the untouchable enemies, then reach Midra through the manse library and portrait passage.", boss: "Midra, Lord of Frenzied Flame", remembrance: true, repeatInStandard: true },
  { id: "metyr", act: "Shadow of the Erdtree", title: "Cathedral of Manus Metyr", region: "Scadu Altus & Finger Ruins", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 13–15", grace: "Cathedral of Manus Metyr", x: 76, y: 46, summary: "Complete Ymir's two maps in order, ring both ruin bells and resolve Jolan only after Metyr and Ymir.", essentials: ["Meet Ymir and Jolan at the cathedral", "Ring the Finger Ruins of Rhia bell", "Return to Ymir for the second ruins map", "Open the Hinterland with O Mother and ring the Dheo bell", "Return to Ymir and exhaust both characters' dialogue", "Inspect Ymir's empty throne and defeat Swordhand of Night Anna", "Defeat Metyr after ringing the Miyr bell", "Defeat Ymir and Jolan's invasion", "Choose Jolan's Iris reward before leaving the cathedral"], directions: "Reach the cathedral from Bonny Village. Follow Ymir's first map to Rhia, report back for the second map, then use O Mother at Shadow Keep's statue to reach Dheo. After reporting both bells, reload until Ymir leaves his throne, descend to Miyr, ring its bell and defeat Metyr before resolving Ymir and Jolan above.", boss: "Metyr, Mother of Fingers", remembrance: true, quest: "Ymir, Jolan and Anna reward choice", repeatInStandard: true },
  { id: "messmer", act: "Shadow of the Erdtree", title: "The Dark Chamber", region: "Shadow Keep", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 14–16", grace: "Dark Chamber Entrance", x: 58, y: 38, summary: "Enter the arena only after the bridge signs and Storehouse exchanges, then use the intended Hornsent summon outcome.", essentials: ["Confirm the Leda and Hornsent bridge signs are no longer pending", "Confirm Ansbach and Freyja's letter exchange is complete", "Choose whether to summon Hornsent inside Messmer before crossing the fog", "Defeat Messmer the Impaler", "Exhaust Hornsent after the fight if he was summoned", "Collect Messmer's Kindling"], directions: "At Dark Chamber Entrance, stop once more before crossing the fog because entering the arena removes the Leda/Hornsent bridge signs. If continuing Hornsent's route, use his sign inside the arena and exhaust him after the fight. Keep Messmer's Kindling for Rauh.", boss: "Messmer the Impaler", remembrance: true, quest: "Hornsent outcome and Messmer's Kindling", repeatInStandard: true },
  { id: "rauh", act: "Shadow of the Erdtree", title: "Ancient Ruins of Rauh", region: "Rauh", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 15–17", grace: "Church of the Bud", x: 31, y: 33, summary: "Cross Rauh and verify the actual sealing-tree blockers before committing Messmer's Kindling.", essentials: ["Collect Map: Rauh Ruins from the lower ravine route", "Resolve Hornsent's Rauh invasion if his Messmer route continued", "Confirm Thiollier was invaded and heard St. Trina's final words", "Confirm Ansbach has the Secret Rite Scroll and the Freyja exchange is complete", "Confirm the Leda, Hornsent and Ansbach invasion choices are resolved", "Confirm Moore's answer and resulting location are known", "Defeat Romina", "Confirm Messmer's Kindling is in inventory", "Do not touch the sealing tree until every follower check is complete", "Burn the sealing tree with Messmer's Kindling"], directions: "Take Shadow Keep's western bridge to Rauh and resolve Hornsent before Church of the Bud if his route remains active. After Romina, stop at the sealing tree and verify each named state. Using Messmer's Kindling advances Enir-Ilim and closes unresolved follower branches.", boss: "Romina, Saint of the Bud", remembrance: true, quest: "Hard DLC quest lock point", repeatInStandard: true },
  { id: "enir", act: "Shadow of the Erdtree", title: "Enir-Ilim Finale", region: "Enir-Ilim", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 17–20", grace: "Divine Gate Front Staircase", x: 43, y: 23, summary: "Resolve the follower battle, finish Ansbach and Thiollier, and complete every Remembrance.", essentials: ["Defeat Leda and her allies", "Summon eligible allies for their quest rewards", "Spend remaining fragments up to the desired difficulty", "Defeat Promised Consort Radahn"], directions: "From the cleansed tower, climb Enir-Ilim's spiral streets and rooftops, pass the purification chamber, and ascend the final staircase to the Gate of Divinity.", boss: "Promised Consort Radahn", remembrance: true, quest: "DLC finale", repeatInStandard: true },
];

const sourcedMapCoordinates: Record<string, { x: number; y: number }> = {
  "first-steps": { x: 39.104, y: 76.300 },
  weeping: { x: 44.912, y: 83.835 },
  stormveil: { x: 34.991, y: 70.929 },
  "liurnia-south": { x: 31.984, y: 66.800 },
  academy: { x: 21.571, y: 51.810 },
  caria: { x: 20.577, y: 44.809 },
  caelid: { x: 62.111, y: 76.260 },
  nokron: { x: 47.748, y: 71.948 },
  altus: { x: 33.122, y: 39.328 },
  gelmir: { x: 25.383, y: 34.076 },
  leyndell: { x: 46.532, y: 38.837 },
  ainsel: { x: 29.650, y: 46.994 },
  deeproot: { x: 45.656, y: 37.631 },
  mountaintops: { x: 57.111, y: 35.235 },
  haligtree: { x: 57.359, y: 19.193 },
  mohgwyn: { x: 57.889, y: 71.023 },
  farum: { x: 84.020, y: 48.636 },
  ashen: { x: 45.588, y: 39.249 },
  gravesite: { x: 43.837, y: 62.878 },
  ensiss: { x: 46.382, y: 53.220 },
  fissure: { x: 50.131, y: 71.803 },
  "shadow-keep": { x: 47.654, y: 52.682 },
  "gaius-avatar": { x: 50.609, y: 44.992 },
  jagged: { x: 62.375, y: 64.592 },
  abyss: { x: 49.767, y: 62.506 },
  metyr: { x: 54.119, y: 50.891 },
  messmer: { x: 49.342, y: 45.294 },
  rauh: { x: 38.030, y: 50.293 },
  enir: { x: 38.065, y: 53.993 },
};

export const chapters: Chapter[] = chapterData.map((chapter) => applyQuestRoutePatches({ ...chapter, ...sourcedMapCoordinates[chapter.id] }));

export const itemGuides: Record<string, string> = {
  "Golden Seed (Ordina Liturgical Town)": "From the Ordina, Liturgical Town grace, ride west-northwest beyond the buildings, then turn north toward the riverbank. The seed is beneath the small illusory tree on the rocks above the river.",
  Longsword: "Purchase from the Twin Maiden Husks after reaching Roundtable Hold.",
  Halberd: "Buy it from the Nomadic Merchant beside the campfire east of Saintsbridge in north Limgrave. A Vagabond can instead keep the Halberd from their starting equipment.",
  "Astrologer's Staff": "Use the staff included in the Astrologer's starting equipment; this starter is only assigned when the recommended origin begins with it.",
  "Glintstone Staff": "Use the staff included in the Prisoner's starting equipment; this starter is only assigned when the recommended origin begins with it.",
  "Finger Seal": "Buy it from the Twin Maiden Husks at Roundtable Hold after accepting Melina's invitation. A Confessor or Prophet already starts with one.",
  "Memory Stone - Twin Maiden Husks": "After accepting Melina's Roundtable Hold invitation, buy the Memory Stone from the Twin Maiden Husks for 3,000 runes. It permanently adds one memory slot.",
  "Memory Stone - Oridys's Rise": "At Oridys's Rise in the Weeping Peninsula, interact with the imp statue, find the three spectral wise beasts around the tower, then open the chest at the top.",
  "Memory Stone - Converted Tower": "At Converted Tower in south-west Liurnia, climb the broken outer wall and jump onto the roof, then open the chest at the top. The Erudition puzzle is optional.",
  "Memory Stone - Testu's Rise": "On Testu's Rise island in north Liurnia, interact with the imp statue, find the three spectral wise beasts, then open the tower chest.",
  "Memory Stone - Raya Lucaria Academy": "Defeat the Red Wolf of Radagon inside Raya Lucaria; the Memory Stone is awarded automatically.",
  "Memory Stone - Seluvis's Rise": "After defeating Royal Knight Loretta and entering Ranni's service, climb Seluvis's Rise and open the chest on its upper floor.",
  "Memory Stone - Lenne's Rise": "In Dragonbarrow, use the spirit spring east of Lenne's Rise to land on its balcony, enter through the upper opening and open the chest. The sealed front door is not required.",
  "Memory Stone - Hermit Village": "At the north end of Hermit Village on Mt. Gelmir, defeat Demi-Human Queen Maggie; she drops the Memory Stone.",
  Shortbow: "Use the Bandit's starting Shortbow, or buy one from the Nomadic Merchant on the west Limgrave beach beneath the Coastal Cave approach.",
  "Light Crossbow": "Buy it from the Nomadic Merchant on the west side of the Weeping Peninsula before entering Castle Morne.",
  "Short Spear": "Buy it from the Twin Maiden Husks at Roundtable Hold after accepting Melina's invitation.",
  Dagger: "Buy it from the Twin Maiden Husks at Roundtable Hold; it is only a fast starter until the sourced fist, claw or backhand weapon is unlocked.",
  Club: "Use the Wretch's starting Club, or buy one from the Nomadic Merchant on the west Limgrave beach near Coastal Cave.",
  "Battle Axe": "Use the Hero's starting Battle Axe; this starter is assigned to Hero-based paths and is replaced by the first sourced weapon card.",
  Estoc: "Use the Estoc included in the Prisoner's starting equipment.",
  Broadsword: "Use the Broadsword included in the Confessor's starting equipment.",
  "Heater Shield": "Use the Heater Shield from the Vagabond's starting equipment, or buy it from the Twin Maiden Husks at Roundtable Hold.",
  "Knight Set": "Purchase all four pieces from the Twin Maiden Husks at Roundtable Hold after the hold opens.",
  "Carian Knight Set": "Inside Raya Lucaria, pass the graveyard and cross the narrow wooden bridge. Before the large rotating lift, turn right, drop to the ledge and follow the path to the worshipped tombstone; loot all four pieces from the corpse.",
  "Scaled Set": "Join Volcano Manor, take the first drawing-room assassination letter, defeat Old Knight Istvan at the red sign north of Warmaster's Shack, then receive the complete set from Tanith.",
  Claymore: "Open the chest inside Castle Morne, just beyond the burning corpse pile.",
  "Lordsworn's Greatsword": "Loot the chest on the carriage beside Gatefront Ruins.",
  Zweihander: "Buy from the Isolated Merchant in the far west of Weeping Peninsula.",
  "Morning Star": "Open the broken carriage chest on the road south of Bridge of Sacrifice.",
  "Large Club": "Loot the body below the southern cliff east of Forlorn Hound Evergaol.",
  "Rusted Anchor": "Defeat the Scaly Misbegotten at the end of Morne Tunnel.",
  "Great Épée": "Open the chest in the enemy camp north-east of Agheel Lake South.",
  Uchigatana: "Take it from the ledge inside Deathtouched Catacombs in northern Limgrave.",
  Twinblade: "Use Torrent to enter the sealed cellar at Dragon-Burnt Ruins.",
  Flail: "Open the carriage chest at Gatefront Ruins.",
  "Sword of St. Trina": "Cross the rot above Forsaken Ruins in Caelid and open the imp-sealed cellar.",
  Reduvia: "Defeat Bloody Finger Nerijus in the ravine north of Agheel Lake.",
  "Demi-Human Queen's Staff": "Defeat the Demi-Human Queen at Demi-Human Forest Ruins.",
  "Golden Halberd": "Defeat the Tree Sentinel patrolling north of The First Step.",
  Caestus: "Buy from Gatekeeper Gostoc after opening Stormveil's main gate.",
  Hookclaws: "Loot the body on the ground floor of Stormveil's wine-cellar route.",
  Scythe: "Open the side-room chest in Cliffbottom Catacombs.",
  "Winged Scythe": "Open the underground chest at Tombsward Ruins.",
  "Dragon Communion Seal": "Use two Stonesword Keys in Fringefolk Hero's Grave and defeat the knight spirit.",
  "Mimic Tear Ashes": "From Night's Sacred Ground, open the imp-sealed room with one Stonesword Key.",
  "Axe of Godrick": "After defeating Godrick, take his Remembrance to Finger Reader Enia at Roundtable Hold and choose Axe of Godrick.",
  "Grafted Dragon": "After defeating Godrick, take his Remembrance to Finger Reader Enia at Roundtable Hold and choose Grafted Dragon.",
  "Carian Regal Scepter": "After defeating Rennala, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Starscourge Greatsword": "After defeating Radahn, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Lion Greatbow": "After defeating Radahn, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Blasphemous Blade": "After the delayed Rykard fight, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Morgott's Cursed Sword": "After defeating Morgott, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Bastard's Stars": "After defeating Astel, exchange its Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Giant's Red Braid": "After defeating Fire Giant, exchange its Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Hand of Malenia": "After defeating Malenia, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Dragon King's Cragblade": "After defeating Dragonlord Placidusax, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Maliketh's Black Blade": "After defeating Maliketh, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Axe of Godfrey": "After defeating Godfrey and Hoarah Loux, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Hoarah Loux's Earthshaker": "After defeating Godfrey and Hoarah Loux, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Sacred Relic Sword": "After defeating Elden Beast, exchange the Elden Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Marika's Hammer": "After defeating Elden Beast, exchange the Elden Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Rellana's Twin Blades": "After defeating Rellana, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Putrescence Cleaver": "After defeating Putrescent Knight, exchange its Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Shadow Sunflower Blossom": "After defeating Scadutree Avatar, exchange its Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Staff of the Great Beyond": "After defeating Metyr, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Gazing Finger": "After defeating Metyr, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Spear of the Impaler": "After defeating Messmer, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Poleblade of the Bud": "After defeating Romina, exchange her Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Greatsword of Radahn (Lord)": "After defeating Promised Consort Radahn, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Greatsword of Radahn (Light)": "After defeating Promised Consort Radahn, exchange his Remembrance with Finger Reader Enia at Roundtable Hold.",
  "Obsidian Lamina": "Complete Ansbach's route, summon him for the final battle if available and collect the weapon from his body after Promised Consort Radahn.",
  "Ansbach's Longbow": "In the Specimen Storehouse, use the gold summon sign to protect Ansbach from Leda; the bow is awarded when the invasion ends.",
  "Lacerating Crossed-Tree": "At the Shadow Keep bridge signs, assist Leda against Hornsent, then report to her at Highroad Cross.",
  "Retaliatory Crossed-Tree": "At Ansbach's Storehouse signs, assist Leda against Ansbach, then report to her at Highroad Cross. This ends Ansbach's finale rewards.",
  "Assassin's Cerulean Dagger": "In Black Knife Catacombs, ride a rising guillotine to the upper passage, reveal the hidden wall at the dead end and defeat the Black Knife Assassin.",
  "Horn Bow": "Take the Siofra River Well lift in Mistwood, reach Hallowhorn Grounds and drop from the bridge-support route to the corpse below the stairs.",
  "Gargoyle's Twinblade": "Defeat both Valiant Gargoyles in Siofra Aqueduct; the twinblade is awarded with the boss drops before taking the coffin to Deeproot.",
  "Wing of Astel": "Enter Ainsel River Main through Renna's Rise, take the left tunnel and follow the upper Uhl Palace Ruins cliff path to the chest above the Withered Astel.",
  "Magic Scorpion Charm": "Complete Seluvis's potion and puppet steps, give him the Amber Starlight and collect the charm before giving Ranni the Fingerslayer Blade.",
  "Taker's Cameo": "Defeat Juno Hoslow for the third Volcano Manor letter in the Mountaintops, then report to Tanith before defeating Rykard.",
  "Swarm of Flies": "In Mohgwyn Palace's blood marsh, loot the corpse inside the shallow cave along the eastern wall; the nearby Albinaurics can be bypassed or cleared.",
  "White Mask": "Before killing Mohg, defeat the Nameless White Mask invader beside the Giant Crow near the blood-marsh tunnel exit in Mohgwyn Palace.",
  "Old Lord's Talisman": "After the Godskin Duo, reach Dragon Temple Rooftop, descend the ladder from the balcony north of the Great Bridge and open the Beastman-guarded rotunda chest.",
  "Talisman of the Dread": "In Gravesite Plain, enter Elder's Hovel and loot the corpse inside; no boss is required.",
  "Bloodsucking Cracked Tear": "Reach Ruins of Unte from Shadow Keep and defeat the dormant Furnace Golem blocking the entrance after waking it with a Hefty Furnace Pot.",
  "Gaius's Greaves": "After Commander Gaius, follow the road toward Scadutree Chalice and defeat the wolf-riding Albinauric near Albinauric's Shack.",
};

export const sources = [
  ["Verified data baseline: patch 1.17", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-117"],
  ["Tarnished Pack contents and availability", "https://en.bandainamcoent.eu/elden-ring/news/how-get-new-elden-ring-classes-weapons-and-torrent-skin-customizations"],
  ["Starting origins and base stats", "https://eldenring.wiki.gg/wiki/Origin"],
  ["Build calculator and base weapon requirements", "https://eldenring.wiki.fextralife.com/Build+Calculator"],
  ["Exact rune level costs", "https://eldenring.wiki.gg/wiki/Level"],
  ["Rune loss and recovery rules", "https://eldenring.wiki.gg/wiki/Runes"],
  ["Equip-load thresholds", "https://eldenring.wiki.gg/wiki/Equipment_load"],
  ["Smithing stone quantities and costs", "https://eldenring.wiki.gg/wiki/Smithing_Stones"],
  ["Current armour weights and poise", "https://jerp.tv/eldenring/armor/"],
  ["PvE build catalogue", "https://eip.gg/elden-ring/builds/pve/"],
  ["Fextralife complete build catalogue", "https://eldenring.wiki.fextralife.com/Builds"],
  ["Game8 Wing Stance Milady guide", "https://game8.co/games/Elden-Ring/archives/460059"],
  ["Shadow of the Erdtree tested builds", "https://www.pcgamer.com/games/rpg/shadow-of-the-erdtree-best-builds/"],
  ["Current build reference", "https://www.pcgamesn.com/elden-ring/builds-best"],
  ["Stance and poise mechanics", "https://eldenring.wiki.gg/wiki/Poise"],
  ["Critical attack mechanics", "https://eldenring.wiki.gg/wiki/Critical"],
  ["Realm of Shadow access", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-enter-the-realm-of-shadow"],
  ["Shadow Realm Blessings", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-strengthen-your-character-shadow-of-the-erdtree"],
  ["Talismans and pouch slots", "https://eldenring.wiki.gg/wiki/Talismans"],
  ["Radagon's Soreseal route and 15% damage penalty", "https://eldenring.wiki.gg/wiki/Radagon%27s_Soreseal"],
  ["Somberstone Miner's Bell Bearings and shop unlocks", "https://eldenring.wiki.gg/wiki/Somberstone_Miner%27s_Bell_Bearing"],
  ["Finite Somber Smithing Stone locations", "https://eldenring.wiki.gg/wiki/Somber_Smithing_Stones"],
  ["War Counselor Iji's Somber stone stock", "https://eldenring.wiki.gg/wiki/War_Counselor_Iji"],
  ["Blaidd's fixed Somber Smithing Stone reward", "https://eldenring.wiki.gg/wiki/Blaidd"],
  ["Seamless Co-op progression FAQ", "https://ersc-docs.github.io/faq/"],
  ["Fextralife interactive maps", "https://eldenring.wiki.fextralife.com/Interactive+Map"],
  ["MapGenie Lands Between map", "https://mapgenie.io/elden-ring/maps/the-lands-between"],
  ["MapGenie Shadow Realm map", "https://mapgenie.io/elden-ring/maps/the-shadow-realm"],
  ["Elden Ring progression bands", "https://eldenringprogress.com/"],
  ["Recommended level by location", "https://eldenring.wiki.gg/wiki/Recommended_Level_by_Location"],
  ["Base-game walkthrough and quest-safe route", "https://eldenring.wiki.gg/wiki/Walkthrough"],
  ["Boss and access prerequisites", "https://eldenring.wiki.gg/wiki/Bosses"],
  ["Volcano Manor and Rykard lock point", "https://eldenring.wiki.gg/wiki/Volcano_Manor"],
  ["Shadow of the Erdtree walkthrough and quest checkpoints", "https://eldenring.wiki.gg/wiki/Walkthrough/Shadow_of_the_Erdtree"],
  ["Bolt of Gransax pre-Ashen missable", "https://eldenring.wiki.gg/wiki/Bolt_of_Gransax"],
  ["Millicent quest route", "https://eldenring.wiki.gg/wiki/Millicent"],
  ["Seluvis quest lock point", "https://eldenring.wiki.gg/wiki/Preceptor_Seluvis"],
  ["Boc safe quest ending", "https://eldenring.wiki.gg/wiki/Demi-Human_Boc"],
  ["Sellen and Jerren reward choice", "https://eldenring.wiki.gg/wiki/Sorceress_Sellen"],
  ["Dung Eater ending and puppet routes", "https://eldenring.wiki.gg/wiki/Dung_Eater"],
  ["Fire Knight Queelign reward choice", "https://eldenring.wiki.gg/wiki/Fire_Knight_Queelign_(NPC)"],
] as const;
