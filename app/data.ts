import { wikiBuilds } from "./wiki-builds";
import { sourcedMemeBuilds } from "./meme-builds";
import { additionalSourcedBuilds } from "./sourced-builds";
import { weaponResolutions } from "./weapon-resolutions";

export type PhaseKey = "early" | "mid" | "late" | "dlc";

export type BuildSource = { label: string; url: string };

export type Build = {
  id: string;
  name: string;
  stats: string;
  role: string;
  playstyle: string;
  complexity: "Easy" | "Moderate" | "Advanced" | "Published guide";
  phases: Record<PhaseKey, string>;
  quest?: string;
  tags: string[];
  startingClass: "Vagabond" | "Warrior" | "Hero" | "Bandit" | "Astrologer" | "Prophet" | "Samurai" | "Prisoner" | "Confessor" | "Wretch" | "Not specified";
  mechanic: string;
  collection: "Curated" | "Fextralife" | "Other guides" | "Meme / cosplay";
  availableFrom?: PhaseKey;
  publishedLoadout?: Omit<StageLoadout, "talismanSlots">;
  publishedStages?: Partial<Record<PhaseKey, Omit<StageLoadout, "talismanSlots">>>;
  phaseBridges?: Partial<Record<PhaseKey, string>>;
  guideCategories?: string[];
  source: BuildSource;
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
  source: source || {
    label: `${phases[3].replace(/ \+.*/, "").replace(/ \/.*/, "")} weapon reference`,
    url: `https://eldenring.wiki.gg/index.php?search=${encodeURIComponent(phases[3].replace(/ \+.*/, "").replace(/ \/.*/, ""))}`,
  },
});

const curatedBuilds: Build[] = [
  build("quality-knight", "Quality Knight", "STR / DEX", "Frontline", "A flexible knight using stance-breaking skills and a quicker DLC finish.", ["Longsword", "Claymore", "Quality Great Épée", "Milady + Wing Stance"], ["quality", "sword", "guard"], "Easy"),
  build("heavy-greatsword", "Heavy Greatsword Knight", "STR", "Frontline", "Measured colossal swings, high poise and reliable stance damage.", ["Lordsworn's Greatsword", "Claymore", "Greatsword", "Greatsword of Solitude"], ["strength", "greatsword", "stance"], "Easy"),
  build("colossal-wanderer", "Colossal Wandering Swordsman", "STR → STR / ARC", "Breaker", "Charged heavies and crouch pokes with one purposeful DLC respec.", ["Zweihander", "Grafted Blade Greatsword", "Ruins Greatsword", "Ancient Meteoric Ore Greatsword"], ["strength", "colossal", "respec"], "Advanced"),
  build("lightning-greataxe", "Lightning Greataxe", "STR / FAI", "Bruiser", "Heavy axe blows backed by buffs and late-game lightning mobility.", ["Greataxe", "Axe of Godrick", "Great Stars", "Death Knight's Longhaft Axe"], ["strength", "faith", "lightning"]),
  build("guard-hammer", "Guard-Counter Great Hammer", "STR / FAI", "Tank", "Blocks, counters and heals through pressure without becoming a shield exploit.", ["Morning Star", "Brick Hammer", "Great Stars + Prayerful Strike", "Black Steel Greathammer"], ["strength", "guard", "holy"], "Easy"),
  build("colossal-hammer", "Colossal Hammer", "STR", "Breaker", "War cries and charged heavies with enormous stagger potential.", ["Large Club", "Great Club", "Giant-Crusher", "Anvil Hammer"], ["strength", "hammer", "stance"], "Easy"),
  build("anchor-bruiser", "Piercing Status Bruiser", "STR / ARC", "Bruiser", "Pierce counters, sustain and a late frost/arcane pivot.", ["Battle Axe", "Rusted Anchor", "Great Stars", "Putrescence Cleaver"], ["strength", "arcane", "status"]),
  build("compact-axe", "Compact Axe Adventurer", "STR / DEX", "Skirmisher", "Fast axes evolve into summoned skeleton attacks and throwable steel.", ["Hand Axe", "Sacrificial Axe", "Rosus' Axe", "Smithscript Axe"], ["axe", "quality", "ranged"]),
  build("halberd-commander", "Halberd Commander", "STR / FAI", "Support", "Reach, charge attacks and a party-wide rally buff.", ["Halberd", "Golden Halberd", "Commander's Standard", "Death Knight's Longhaft Axe"], ["halberd", "support", "faith"], "Easy"),
  build("great-spear-paladin", "Great-Spear Paladin", "STR / DEX / FAI", "Tank", "Shield pokes and charged thrusts with ranged holy pressure later.", ["Lance", "Treespear", "Siluria's Tree", "Barbed Staff-Spear"], ["spear", "guard", "holy"], "Moderate", "Crucible and DLC progression"),
  build("strength-fist", "Strength Fist Fighter", "STR", "Breaker", "Endure-powered close combat and rapid stance breaks.", ["Caestus", "Spiked Caestus", "Star Fist", "Red Bear's Claw"], ["fist", "strength", "bleed"], "Advanced"),
  build("mobile-claw", "Mobile Claw Hunter", "DEX", "Skirmisher", "Quickstep, aerial slashes and controlled bleed pressure.", ["Hookclaws", "Raptor Talons", "Bloodhound Claws", "Beast Claw"], ["dexterity", "claw", "mobile"]),
  build("holy-board", "Holy Sword-and-Board", "FAI", "Tank", "Guard counters and Sacred Blade grow into a holy support setup.", ["Broadsword + Sacred Blade", "Golden Epitaph", "Coded Sword", "Sword of Light"], ["faith", "holy", "guard"], "Easy"),
  build("guard-thrust", "Strength Guard-Thrust Specialist", "STR", "Tank", "A safe counter-hit specialist that graduates into an attacking shield weapon.", ["Great Épée", "Lance", "Serpent-Hunter", "Sword Lance"], ["strength", "thrust", "guard"], "Easy"),
  build("rapier-duelist", "Classical Rapier Duelist", "DEX", "Duelist", "Parries, counter-hits and precise thrusting attacks.", ["Rapier", "Rogier's Rapier +8", "Frozen Needle", "Main-gauche + Milady"], ["dexterity", "thrust", "parry"]),
  build("heavy-duelist", "Heavy-Thrusting Duelist", "DEX", "Duelist", "Running attacks and charged counter-thrusts rather than status spam.", ["Keen Great Épée", "Godskin Stitcher", "Dragon King's Cragblade", "Sword Lance"], ["dexterity", "thrust", "lightning"]),
  build("samurai", "Traditional Samurai", "DEX", "Duelist", "Unsheathe evolves into long-reach katana pressure and a great-katana finale.", ["Uchigatana", "Nagakiba", "Hand of Malenia", "Keen Great Katana"], ["dexterity", "katana", "bleed"], "Moderate", "Yura quest"),
  build("dragon-samurai", "Dragon Hunter Samurai", "DEX", "Boss hunter", "Ice lightning for general play and a dragon-specialist DLC weapon.", ["Uchigatana", "Dragonscale Blade", "Dragon-Hunter's Great Katana", "Dragon-Hunter's Great Katana + Dragonwound"], ["dexterity", "katana", "dragon"]),
  build("sacred-twinblade", "Sacred Twinblade", "DEX / FAI", "Striker", "Fast twinblade pressure that shifts between black flame and holy damage.", ["Twinblade", "Godskin Peeler", "Black Flame Tornado Peeler", "Black Steel Twinblade"], ["dexterity", "faith", "twinblade"]),
  build("curved-dancer", "Curved-Sword Dancer", "DEX", "Striker", "Flowing multihit strings with deliberately restrained buff stacking.", ["Shamshir", "Scavenger's Curved Sword", "Flowing Curved Sword", "Dancing Blade of Ranah"], ["dexterity", "curved", "multihit"]),
  build("backhand", "Backhand Skirmisher", "DEX", "Skirmisher", "Dodges through attacks and answers from blind angles.", ["Shamshir", "Mantis Blade", "Flowing Curved Sword", "Backhand Blade + Blind Spot"], ["dexterity", "mobile", "curved"]),
  build("whip", "Whip Controller", "DEX", "Controller", "Long-range sweeps, charged Urumi heavies and measured status buildup.", ["Whip", "Urumi", "Hoslow's Petal Whip", "Tooth Whip"], ["dexterity", "whip", "control"], "Moderate", "Volcano Manor contracts"),
  build("reaper", "Reaper Pilgrim", "DEX / FAI → ARC", "Striker", "Wide scythe control that finishes as a flowing arcane duelist.", ["Scythe", "Winged Scythe", "Grave Scythe + Stormcaller", "Obsidian Lamina"], ["reaper", "faith", "arcane"], "Advanced", "Ansbach quest"),
  build("lightning-spear", "Lightning Spear Thrower", "DEX / FAI", "Ranged striker", "Thrusts in melee and throws lightning at priority targets.", ["Short Spear", "Cross-Naginata", "Bolt of Gransax", "Spear of the Impaler"], ["dexterity", "faith", "lightning"]),
  build("mobile-archer", "Mobile Archer", "DEX", "Ranged", "Jump shots, Barrage and agile bow play with a light melee backup.", ["Shortbow", "Horn Bow", "Black Bow", "Ansbach's Longbow"], ["dexterity", "bow", "ranged"], "Advanced", "Ansbach quest choice"),
  build("crossbow", "Crossbow Engineer", "VIG / END", "Ranged", "Ammunition choice matters more than damage stats; carries a practical sidearm.", ["Light Crossbow", "Arbalest", "Pulley Crossbow", "Repeating Crossbow"], ["crossbow", "ranged", "utility"], "Moderate"),
  build("critical-assassin", "Critical-Hit Assassin", "DEX / FAI", "Specialist", "Parries and stance breaks convert into high-value critical attacks.", ["Misericorde", "Erdsteel Dagger", "Black Knife", "Main-gauche"], ["dexterity", "dagger", "critical"], "Advanced", "Kenneth Haight reward"),
  build("throwing-assassin", "Throwing-Blade Assassin", "DEX", "Ranged", "Starts with consumable throws and becomes a true ranged-dagger build.", ["Dagger + Kukri", "Black Knife", "Black Knife + utility dagger", "Smithscript Dagger"], ["dexterity", "dagger", "ranged"]),
  build("pure-sorcerer", "Pure Sorcerer", "INT", "Caster", "Efficient ranged sorcery with an optional finger-magic pivot in the DLC.", ["Demi-Human Queen's Staff", "Academy Glintstone Staff", "Carian Regal Scepter", "Maternal Staff"], ["intelligence", "sorcery", "ranged"], "Easy", "Thops and Ranni progression"),
  build("carian-greatsword", "Carian Greatsword Mage", "INT → INT / FAI", "Spellblade", "Sword sorceries and magical greatswords become a paired elemental style.", ["Magic Longsword", "Carian Knight's Sword", "Dark Moon Greatsword", "Rellana's Twin Blades"], ["intelligence", "spellblade", "quest"], "Advanced", "Ranni quest"),
  build("dex-spellblade", "Dexterity Spellblade", "DEX / INT", "Spellblade", "Fast melee weapons with large-area magical weapon skills.", ["Magic Estoc", "Wing of Astel", "Death Ritual Spear", "Star-Lined Sword"], ["dexterity", "intelligence", "magic"]),
  build("gravity-knight", "Gravity Knight", "STR / INT → STR / ARC", "Breaker", "Gravity pulls and heavy weapons with one clean DLC respec.", ["Lordsworn's Greatsword + Gravitas", "Meteoric Ore Blade", "Fallingstar Beast Jaw", "Ancient Meteoric Ore Greatsword"], ["strength", "gravity", "respec"], "Advanced"),
  build("frost-knight", "Frost Knight", "DEX / INT", "Controller", "Reliable physical damage with frostbite as a secondary payoff.", ["Cold Uchigatana", "Frozen Needle", "Zamor Curved Sword", "Cold Milady"], ["dexterity", "intelligence", "frost"]),
  build("death-knight", "Death Knight Sorcerer", "STR / INT", "Spellblade", "Summoned skeletons, ghostflame and mobile rancor pressure.", ["Sacrificial Axe", "Rosus' Axe", "Helphen's Steeple", "Spirit Sword"], ["intelligence", "death", "spellblade"]),
  build("magic-polearm", "Magic Polearm Scholar", "DEX / INT", "Spellblade", "Long-reaching weapon skills and a weapon that doubles as a catalyst.", ["Magic Great Épée", "Death Ritual Spear", "Loretta's War Sickle", "Carian Sorcery Sword"], ["dexterity", "intelligence", "polearm"]),
  build("golden-scholar", "Golden Order Scholar", "INT / FAI", "Caster support", "A true dual-school caster that consolidates catalysts in the DLC.", ["Meteorite Staff + Finger Seal", "Carian Staff + Golden Order Seal", "Prince of Death's Staff", "Staff of the Great Beyond"], ["intelligence", "faith", "caster"], "Advanced", "Ranni and Fia quests"),
  build("crucible-paladin", "Crucible Paladin", "STR / FAI", "Tank", "Durable melee backed by Crucible magic and measured healing.", ["Morning Star + Sacred Blade", "Golden Halberd", "Ordovis's Greatsword", "Black Steel Greathammer"], ["strength", "faith", "crucible"]),
  build("flame-knight", "Flame-Art Knight", "STR / DEX / FAI", "Bruiser", "Rotates between flaming sword pressure, magma and giant fire.", ["Flame Art Claymore", "Magma Wyrm's Scalesword", "Giant's Red Braid", "Queelign's Greatsword"], ["faith", "fire", "greatsword"]),
  build("blackflame", "Blackflame Apostle", "DEX / FAI", "Striker", "Percentage-based black flame pressure and a quick holy twinblade finish.", ["Flame Art Uchigatana + Godslayer Seal", "Godslayer's Greatsword", "Godslayer incantations", "Euporia"], ["faith", "blackflame", "twinblade"]),
  build("lightning-lancer", "Lightning Lancer", "DEX / FAI", "Striker", "Mounted thrusts and counter-hits become an aggressive blink-lightning style.", ["Lance", "Treespear", "Bolt of Gransax", "Death Knight's Twin Axes"], ["faith", "lightning", "spear"]),
  build("bestial-cleric", "Bestial Cleric", "STR / FAI", "Bruiser", "Throws stones at range and crushes openings in melee.", ["Large Club", "Cinquedea + Clawmark Seal", "Beastclaw Greathammer", "Devonia's Hammer"], ["strength", "faith", "bestial"], "Moderate", "Gurranq Deathroot rewards"),
  build("stormcaller", "Dragon-Cult Stormcaller", "FAI / DEX", "Caster", "Lightning incantations with a polearm fallback and optional arcane pivot.", ["Pike + Finger Seal", "Gravel Stone Seal", "Bolt of Gransax", "Flowerstone Gavel"], ["faith", "lightning", "dragon"], "Advanced"),
  build("frenzy", "Frenzied Pilgrim", "DEX / FAI", "Specialist", "Madness-flavoured fire that stays useful against immune PvE targets.", ["Short Spear + Frenzied Burst", "Vyke's War Spear", "Frenzied Flame Seal", "Frenzyflame Perfume Bottle"], ["faith", "frenzy", "fire"], "Moderate", "Hyetta quest"),
  build("pyromancer", "Fire Giant Pyromancer", "FAI / DEX", "Caster", "Close-range flame, giant fire and wide perfume clouds.", ["Finger Seal + Catch Flame", "Giant's Seal", "Giant's Red Braid", "Firespark Perfume Bottle"], ["faith", "fire", "caster"]),
  build("bleed-duelist", "Bleed Duelist", "DEX / ARC", "Duelist", "Four distinct weapon skills keep bleed from becoming repetitive.", ["Reduvia", "Bloody Helice", "Morgott's Cursed Sword", "Obsidian Lamina"], ["dexterity", "arcane", "bleed"], "Moderate", "Ansbach quest"),
  build("poison-brawler", "Poison Brawler", "ARC / DEX", "Striker", "Poison enables burst windows while physical damage handles immunity.", ["Venomous Fang", "Serpentbone Blade", "Poison Antspur Rapier", "Poisoned Hand"], ["arcane", "poison", "fist"]),
  build("rot-duelist", "Scarlet-Rot Duelist", "DEX / ARC", "Duelist", "A thrusting poison start that matures into true scarlet rot weapons.", ["Estoc + Poisonous Mist", "Antspur Rapier", "Scorpion's Stinger", "Poleblade of the Bud"], ["dexterity", "arcane", "rot"]),
  build("dragon-communion", "Dragon-Communion Knight", "ARC / FAI", "Caster bruiser", "Dragon maw attacks break stance while arcane weapons cover fast openings.", ["Dragon Communion Seal + Reduvia", "Regalia of Eochaid", "Marais Executioner's Sword", "Flowerstone Gavel"], ["arcane", "faith", "dragon"]),
  build("sleep", "Sleep Swordsman", "DEX / INT", "Controller", "Uses sleep where it works and keeps a cold sidearm for immune enemies.", ["Sword of St. Trina", "Cold sidearm", "St. Trina's Torch", "Velvet Sword of St. Trina"], ["dexterity", "intelligence", "sleep"]),
  build("thrusting-shield", "Thrusting-Shield Vanguard", "STR / DEX", "Tank", "Conventional shield pokes evolve into a weapon that guards while attacking.", ["Short Spear + Heater Shield", "Great Épée + Towershield", "Lance + Ant's Skull Plate", "Carian Thrusting Shield"], ["guard", "thrust", "shield"], "Easy"),

  build("storm-vanguard", "Stormbound Vanguard", "STR / DEX", "Frontline", "Storm skills maintain pressure before a defensive DLC greatsword finish.", ["Longsword + Storm Blade", "Banished Knight's Halberd +8", "Stormhawk Axe", "Greatsword of Solitude"], ["storm", "quality", "stance"]),
  build("frostflail", "Frostflail Astronomer", "DEX / INT", "Controller", "Frost control evolves from flail counters into explosive perfume clouds.", ["Cold Flail", "Frozen Needle", "Bastard's Stars", "Chilling Perfume Bottle"], ["frost", "intelligence", "flail"]),
  build("dryleaf", "Dryleaf Disciple", "STR / DEX", "Breaker", "A light-load martial artist focused on Endure, counters and stance breaks.", ["Caestus", "Katar", "Star Fist", "Dryleaf Arts / Dane's Footwork"], ["martial", "quality", "fist"], "Advanced"),
  build("smithscript", "Smithscript Arsenalist", "STR / DEX", "Ranged utility", "A changing kit of thrown steel and ammunition for any engagement range.", ["Spear + Spectral Lance", "Jar Cannon", "Pulley Crossbow", "Smithscript Dagger, Cirque & Spear"], ["quality", "ranged", "smithscript"], "Advanced"),
  build("retaliation", "Golden Retaliation Captain", "STR / FAI", "Tank support", "Reflects self-cast holy discs and enemy magic into shield projectiles.", ["Sacred Longsword + Heater Shield", "Discus of Light", "Erdtree Greatshield", "Smithscript Shield"], ["faith", "shield", "support"], "Advanced"),
  build("nightblade", "Nightblade Fencer", "DEX", "Duelist", "Fast duelling with feints, flowing attacks and guard-piercing darkness.", ["Estoc", "Ornamental Straight Sword", "Nox Flowing Sword", "Sword of Night"], ["dexterity", "duelist", "night"]),
  build("blood-dancer", "Twinblade Blood Dancer", "DEX / ARC", "Striker", "Mobile multihit pressure without dual jump-attack spam.", ["Twinblade", "Eleonora's Poleblade", "Blood Godskin Peeler", "Falx"], ["dexterity", "arcane", "twinblade"]),
  build("bonebow", "Bonebow Beastmaster", "DEX / ARC", "Ranged", "Status arrows and spirit-assisted volleys with a light melee sidearm.", ["Shortbow", "Serpent Bow", "Pulley Bow", "Bone Bow"], ["dexterity", "arcane", "bow"], "Advanced"),
  build("artillerist", "Full Moon Artillerist", "DEX / INT", "Ranged", "A deliberate artillery character built around bolts, pots and cannons.", ["Light Crossbow", "Full Moon Crossbow", "Jar Cannon", "Rabbath's Cannon"], ["intelligence", "crossbow", "ranged"]),
  build("ice-dragoon", "Ice-Lightning Dragoon", "STR / DEX", "Skirmisher", "Frost-lightning buffs, long reach and an aggressive blink finish.", ["Short Spear", "Dragon Halberd", "Dragonscale Blade", "Death Knight's Twin Axes"], ["quality", "lightning", "frost"]),
  build("eochaid", "Eochaid Drill Knight", "STR / ARC", "Bruiser", "Charged corkscrew attacks give way to a mobile frost/arcane cleaver.", ["Broadsword", "Regalia of Eochaid", "Marais Executioner's Sword", "Putrescence Cleaver"], ["strength", "arcane", "charged"]),
  build("finger-oracle", "Finger Oracle", "STR / INT / FAI", "Novelty caster", "A strange but viable finger-themed caster with one late respec.", ["Club + mixed catalysts", "Ringed Finger", "Prince of Death's Staff", "Great Beyond Staff + Gazing Finger"], ["novelty", "caster", "respec"], "Advanced", "Ymir quest"),
  build("liturgist", "Golden Order Liturgist", "INT / FAI", "Caster support", "Ranged holy discs, buffs and a dependable sword fallback.", ["Sacred Blade weapon", "Golden Order Seal + Discus", "Golden Order Greatsword", "Leda's Sword"], ["intelligence", "faith", "holy"], "Advanced"),
  build("first-lord", "Roar of the First Lord", "STR", "Breaker", "Roars, charged heavies and hyper-armour recreate the First Lord's rhythm.", ["Highland Axe", "Grafted Blade Greatsword", "Axe of Godfrey", "Greatsword of Radahn (Lord)"], ["strength", "roar", "stance"]),
  build("bloodfiend", "Bloodfiend Juggernaut", "STR / ARC", "Breaker", "Slow, punishing blood attacks deliberately held behind progression caps.", ["Club", "Rusted Anchor", "Occult Great Stars", "Bloodfiend's Arm"], ["strength", "arcane", "bleed"], "Easy"),
  build("ghostflame", "Ghostflame Hexer", "INT / FAI", "Caster", "Frost, lingering ghostflame and putrescence control whole arenas.", ["Glintstone Staff + Magic Sword", "Death's Poker", "Helphen's Steeple + death sorceries", "Spirit Glaive + putrescence sorceries"], ["intelligence", "faith", "frost"], "Advanced", "Fia quest"),
  build("storm-perfumer", "Storm-Painter Perfumer", "DEX / FAI", "Elementalist", "Precise lightning thrusts alternate with wide elemental clouds.", ["Erdsteel Dagger + pots", "Lightning incantations + Aromatics", "Bolt of Gransax", "Lightning Perfume Bottle"], ["dexterity", "faith", "perfume"]),
  build("venom-alchemist", "Venom Alchemist", "DEX / ARC", "Controller", "Layered poison pressure with a physical backup for immune enemies.", ["Dagger + Poisonous Mist", "Coil Shield + Serpent Bow", "Venomous Fang", "Deadly Poison Perfume Bottle"], ["dexterity", "arcane", "poison"]),
  build("destined-templar", "Destined Death Templar", "STR / FAI", "Bruiser", "Health reduction and heavy holy/fire damage with a deliberate late respec.", ["Winged Scythe", "Black Knife", "Maliketh's Black Blade", "Greatsword of Damnation"], ["strength", "faith", "destined death"], "Advanced"),
  build("grafted-scion", "Grafted Scion", "STR / DEX", "Trophy fighter", "Changes identity after each major lord by wielding boss trophies.", ["Battle Axe", "Grafted Dragon", "Axe of Godrick", "Greatsword of Radahn (Light)"], ["quality", "remembrance", "respec"], "Advanced"),
  build("torch-saint", "Torch Saint", "DEX / FAI", "Novelty support", "Utility torches and fire pressure with a conventional Flame Art sidearm.", ["Steel-Wire Torch + Spear", "Sentry's Torch", "St. Trina's Torch", "Nanaya's Torch"], ["novelty", "faith", "fire"], "Advanced"),
  build("blue-dancer", "Blue Dancer Ascetic", "DEX", "Duelist", "Low equipment load rewards clean spacing and disciplined aggression.", ["Shamshir", "Katar", "Ornamental Straight Sword", "Pata"], ["dexterity", "light load", "duelist"], "Advanced"),
  build("trollsmith", "Trollsmith Thrower", "STR", "Breaker", "Classic charged-heavy play gains a spectacular thrown hammer in the DLC.", ["Large Club", "Brick Hammer", "Giant-Crusher", "Smithscript Greathammer"], ["strength", "hammer", "ranged"]),
  build("countermage", "Glintblade Countermage", "DEX / INT", "Spellblade", "Parries spells and converts openings into magical criticals.", ["Magic Rapier + Carian Retaliation", "Carian Knight's Sword", "Glintstone Kris", "Carian Sorcery Sword"], ["dexterity", "intelligence", "parry"], "Advanced"),
  build("dragonslayer-bow", "Greatbow Dragonslayer", "STR / DEX", "Ranged", "A co-op back-line siege archer with a lightweight melee fallback.", ["Longbow", "Erdtree Greatbow", "Lion Greatbow", "Igon's Greatbow"], ["quality", "greatbow", "dragon"], "Advanced", "Igon quest"),

  build("powerstance-spears", "Twin-Spear Jump Attacker", "STR / DEX", "Melee", "Alternates safe thrusts with committed dual-spear jump attacks when a boss leaves a full opening.", ["Short Spear + Partisan", "Cross-Naginata + Spiked Spear", "Keen Cross-Naginata pair", "Messmer Soldier's Spear pair"], ["quality", "spear", "jump"], "Moderate", undefined, { label: "EIP PvE: Dual Wielding Spear Build", url: BUILD_SOURCES.eip }, "Jump attacks", "Vagabond"),
  build("guardian-swordspear", "Guardian Swordspear Twinblade", "DEX", "Melee", "Fast halberd light strings and paired pressure built around the Guardian's Swordspear's strong Keen scaling.", ["Halberd", "Guardian's Swordspear", "Keen Guardian's Swordspear pair", "Guardian's Swordspear pair + Divine Beast Frost Stomp"], ["dexterity", "halberd", "multihit"], "Moderate", undefined, { label: "EIP PvE: Dual Guardian Swordspear", url: BUILD_SOURCES.eip }, "Light attacks", "Samurai"),
  build("blasphemous-vicar", "Blasphemous Blade Vicar", "STR / FAI", "Melee", "A Faith greatsword route centred on Taker's Flames, with healing kept as sustain rather than a reason to ignore mechanics.", ["Lordsworn's Greatsword + Sacred Blade", "Magma Wyrm's Scalesword", "Blasphemous Blade", "Blasphemous Blade + Talisman of the Dread"], ["strength", "faith", "fire"], "Easy", "Rya and Rykard progression", { label: "PCGamesN: Blasphemous Blade build", url: BUILD_SOURCES.pcGamesN }, "Skill damage", "Hero"),
  build("halo-reaper", "Halo Scythe Disciple", "DEX / FAI", "Ranged", "Uses ordinary scythe sweeps up close and Miquella's Ring of Light when spacing or co-op aggro makes range safer.", ["Winged Scythe", "Halo Scythe", "Halo Scythe + Grave Scythe", "Halo Scythe + Barbed Staff-Spear"], ["dexterity", "faith", "reaper", "ranged"], "Moderate", undefined, { label: "EIP PvE: Halo Scythe build", url: BUILD_SOURCES.eip }, "Ranged attacks", "Confessor"),
  build("nebula-astel", "Wing of Astel Nebula", "DEX / INT", "Melee", "Curved-sword spacing sets up Nebula bursts for large targets without requiring a long buff routine.", ["Magic Shamshir", "Wing of Astel", "Wing of Astel + Carian Regal Scepter", "Wing of Astel + Staff of the Great Beyond"], ["dexterity", "intelligence", "curved", "stance"], "Moderate", "Ranni progression", { label: "PCGamesN: Wing of Astel build", url: BUILD_SOURCES.pcGamesN }, "Stance damage", "Prisoner"),
  build("poison-lizard", "Poison Lizard Greatsword", "STR / ARC", "Melee", "A conventional greatsword build that adds poison and the Lizard Greatsword's projectile heavy attack in the DLC.", ["Claymore + Poisonous Mist", "Iron Greatsword", "Occult Flamberge", "Poison Lizard Greatsword"], ["strength", "arcane", "poison", "charged"], "Moderate", undefined, { label: "PCGamesN: Poison Lizard build", url: BUILD_SOURCES.pcGamesN }, "Charged attacks", "Bandit"),
  build("thorn-sorcerer", "Briar and Thorn Sorcerer", "INT / ARC", "Ranged", "A blood-sorcery route using ordinary glintstone spells until the specialised thorn equipment becomes available.", ["Meteorite Staff", "Albinauric Staff", "Staff of the Guilty + Briars of Punishment", "Maternal Staff + Impenetrable Thorns"], ["intelligence", "arcane", "sorcery", "bleed"], "Advanced", "Ymir quest", { label: "PCGamesN: Bleeding Thorns Mage", url: BUILD_SOURCES.pcGamesN }, "Spell damage", "Astrologer"),
  build("lightning-perfumer", "Lightning Perfume Prophet", "DEX / FAI", "Ranged", "Lightning incantations carry the base game before the perfume bottle supplies broad, close-to-mid-range lightning clouds.", ["Finger Seal + Lightning Spear", "Gravel Stone Seal", "Bolt of Gransax", "Lightning Perfume Bottle"], ["dexterity", "faith", "lightning", "perfume", "ranged"], "Moderate", undefined, { label: "PCGamesN: Lightning Perfume Bottle Prophet", url: BUILD_SOURCES.pcGamesN }, "Ranged attacks", "Prophet"),
  build("fire-knight-greatsword", "Fire Knight Greatsword", "STR / FAI", "Melee", "Heavy flaming sweeps and Messmer incantations with a DLC weapon whose thrusting heavy attacks reward deliberate spacing.", ["Flame Art Claymore", "Magma Wyrm's Scalesword", "Blasphemous Blade", "Fire Knight's Greatsword + Flame Spear"], ["strength", "faith", "fire", "charged"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Hero"),
  build("sunflower-crusader", "Shadow Sunflower Crusader", "STR / FAI", "Melee", "A holy great-weapon progression that finishes with repeated sunflower slams and substantial stance pressure.", ["Sacred Large Club", "Great Stars + Prayerful Strike", "Envoy's Long Horn", "Shadow Sunflower Blossom"], ["strength", "faith", "great hammer", "stance"], "Easy", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Stance damage", "Hero"),
  build("black-steel-bulwark", "Black Steel Bulwark", "STR / FAI", "Melee", "Guard counters and holy retaliation culminate in the Black Steel Greatshield and a controllable thrusting sidearm.", ["Broadsword + Brass Shield", "Golden Greatshield + Great Épée", "Haligtree Crest Greatshield + Treespear", "Black Steel Greatshield + Queelign's Greatsword"], ["strength", "faith", "guard", "shield"], "Easy", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Guard counters", "Hero"),
  build("night-claws", "Claws of Night Hunter", "DEX", "Ranged", "Fast claw strings share a build with thrown fan blades, giving the same weapon a real answer at two ranges.", ["Hookclaws", "Raptor Talons", "Bloodhound Claws", "Claws of Night"], ["dexterity", "claw", "ranged", "multihit"], "Advanced", "Jolán and Ymir quest", { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Light attacks", "Samurai"),
  build("rakshasa-counter", "Rakshasa Counter-Slasher", "DEX", "Melee", "Great-katana reach and counter-hit timing lead into Rakshasa's aggressive Weed Cutter chains.", ["Uchigatana", "Nagakiba", "Keen Great Katana", "Rakshasa's Great Katana"], ["dexterity", "katana", "counter"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Skill damage", "Samurai"),
  build("horned-storm", "Horned Warrior Stormblade", "STR / DEX", "Melee", "Curved-greatsword fundamentals gain a high-commitment horned storm skill for large punish windows.", ["Dismounter", "Omen Cleaver", "Beastman's Cleaver", "Horned Warrior's Greatsword"], ["quality", "curved greatsword", "storm", "stance"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Stance damage", "Vagabond"),
  build("spread-crossbow", "Spread Crossbow Trapper", "DEX / ARC", "Ranged", "Uses crafted bolts and status ammunition; the DLC spread pattern rewards close-range openings without replacing the sidearm.", ["Light Crossbow", "Pulley Crossbow", "Pulley Crossbow + status bolts", "Spread Crossbow"], ["dexterity", "arcane", "crossbow", "status"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Status buildup", "Bandit"),
  build("golem-fist", "Golem Fist Boxer", "STR", "Melee", "A fist build whose charged heavy eventually launches a short-range projectile while retaining strong close pressure.", ["Caestus", "Spiked Caestus", "Star Fist", "Golem Fist"], ["strength", "fist", "charged"], "Moderate", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Hero"),
  build("serpent-flail", "Serpent Flail Demolitionist", "DEX / FAI", "Melee", "Flail guard counters and charged attacks finish with the Serpent Flail's delayed explosive coating.", ["Flail", "Nightrider Flail", "Family Heads", "Serpent Flail"], ["dexterity", "faith", "flail", "charged"], "Advanced", undefined, { label: "Shadow of the Erdtree weapon catalogue", url: BUILD_SOURCES.dlcWeapons }, "Charged attacks", "Confessor"),
  build("sword-of-darkness", "Sword of Darkness Knight", "STR / FAI", "Melee", "A sword-and-seal knight that uses holy damage early before shifting to the Sword of Darkness's resistance debuff.", ["Sacred Lordsworn's Straight Sword", "Golden Epitaph", "Coded Sword", "Sword of Darkness + Dryleaf Seal"], ["strength", "faith", "holy", "skill"], "Moderate", "Stone-Sheathed Sword altar route", { label: "PC Gamer: Unholy Knight", url: BUILD_SOURCES.pcGamerDlc }, "Skill damage", "Hero"),
  build("carian-shield-sorcerer", "Carian Shield Sorcerer", "DEX / INT", "Hybrid", "Casts through the Carian Sorcery Sword while the thrusting shield handles guarded pressure and counters.", ["Estoc + Demi-Human Queen's Staff", "Carian Knight's Sword + staff", "Loretta's War Sickle + Carian Regal Scepter", "Carian Sorcery Sword + Carian Thrusting Shield"], ["dexterity", "intelligence", "sorcery", "guard"], "Advanced", undefined, { label: "PC Gamer: Carian Spellblade", url: BUILD_SOURCES.pcGamerDlc }, "Guard counters", "Prisoner"),
  build("wing-stance-duelist", "Wing Stance Court Duelist", "STR / DEX", "Melee", "A clean duelling route centred on stance choice: light slash strings for pressure or the heavy leap for a punish.", ["Rapier", "Rogier's Rapier", "Cleanrot Knight's Sword", "Milady + Wing Stance / Main-gauche"], ["quality", "light greatsword", "critical", "stance"], "Advanced", undefined, { label: "PC Gamer: Courtly Duelist", url: BUILD_SOURCES.pcGamerDlc }, "Critical attacks", "Vagabond"),
  build("red-bear", "Red Bear Berserker", "STR / DEX", "Melee", "Relentless claw strings and Red Bear Hunt reward staying close without relying on dual-wield jump spam.", ["Hookclaws", "Bloodhound Claws", "Star Fist", "Red Bear's Claw"], ["quality", "claw", "multihit", "bleed"], "Advanced", undefined, { label: "PC Gamer: Bearserker", url: BUILD_SOURCES.pcGamerDlc }, "Light attacks", "Vagabond"),
  build("pure-priestess", "Co-op Erdtree Priestess", "FAI", "Ranged", "A genuine co-op Faith caster balancing ranged incantations, buffs and area healing rather than MMO-style threat roles.", ["Finger Seal + Catch Flame", "Godslayer's Seal", "Erdtree Seal", "Dryleaf Seal + Knight's Lightning Spear"], ["faith", "caster", "coop", "ranged"], "Moderate", undefined, { label: "EIP PvE: Pure Faith Priestess", url: BUILD_SOURCES.eip }, "Spell damage", "Prophet"),
  build("magma-sorcerer", "Gelmir Magma Sorcerer", "INT / FAI", "Ranged", "Magma sorceries deny space and punish large enemies while a light greatsword covers fast melee openings.", ["Meteorite Staff + Magic Longsword", "Gelmir Glintstone Staff", "Magma Blade + Gelmir Staff", "Staff of the Great Beyond + Rykard's Rancor"], ["intelligence", "faith", "magma", "caster"], "Advanced", "Volcano Manor progression", { label: "EIP PvE: Magmage", url: BUILD_SOURCES.eip }, "Spell damage", "Astrologer"),
  build("black-blade-colossus", "Maliketh Black Blade", "STR / FAI", "Melee", "Colossal holy and fire damage with Destined Death used for boss openings rather than repeated skill trading.", ["Sacred Claymore", "Golden Halberd", "Maliketh's Black Blade", "Maliketh's Black Blade + Black Blade incantation"], ["strength", "faith", "colossal", "destined death"], "Advanced", undefined, { label: "EIP PvE: Black Blade STR/Faith", url: BUILD_SOURCES.eip }, "Skill damage", "Hero"),
  build("messmer-impaler", "Messmer Impaler", "DEX / FAI", "Ranged", "Spear thrusts and fire incantations converge on Messmer's assault skill and a throwable heavy attack.", ["Short Spear + Flame Sling", "Cross-Naginata + Black Flame", "Bolt of Gransax", "Spear of the Impaler + Fire Serpent"], ["dexterity", "faith", "spear", "fire", "ranged"], "Advanced", undefined, { label: "PC Gamer DLC build guide", url: BUILD_SOURCES.pcGamerDlc }, "Skill damage", "Confessor"),
];

export const builds: Build[] = [...curatedBuilds, ...wikiBuilds, ...additionalSourcedBuilds, ...sourcedMemeBuilds];

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
  weaponChoice?: {
    rationale: string;
    sources: BuildSource[];
  };
};

const includesAny = (build: Build, values: string[]) => {
  const text = `${build.name} ${build.stats} ${build.role} ${build.tags.join(" ")} ${build.playstyle}`.toLowerCase();
  return values.some((value) => text.includes(value));
};

const unique = (items: string[]) => Array.from(new Set(items));

const PHASES: PhaseKey[] = ["early", "mid", "late", "dlc"];

const statCodes = (build: Build) => ["STR", "DEX", "INT", "FAI", "ARC"].filter((stat) => build.stats.toUpperCase().includes(stat));

const weaponKinds = (weapon: string) => {
  const text = weapon.toLowerCase();
  return [
    "colossal sword", "colossal weapon", "curved greatsword", "greatsword", "straight sword", "curved sword",
    "great katana", "katana", "twinblade", "great spear", "spear", "halberd", "great hammer", "hammer",
    "greataxe", "axe", "fist", "claw", "katar", "dagger", "rapier", "thrusting sword", "light greatsword",
    "flail", "reaper", "whip", "bow", "crossbow", "staff", "seal", "shield", "torch",
  ].filter((kind) => text.includes(kind));
};

function closestPublishedStage(build: Build, phase: PhaseKey) {
  const explicitBridge = build.phaseBridges?.[phase];
  if (explicitBridge) return builds.find((candidate) => candidate.id === explicitBridge && candidate.publishedLoadout);
  const targetKinds = weaponKinds(build.publishedLoadout?.weapon || "");
  const targetStats = statCodes(build);
  const candidates = builds.filter((candidate) =>
    candidate.id !== build.id &&
    candidate.collection === "Fextralife" &&
    candidate.publishedLoadout &&
    (candidate.availableFrom || "early") === phase,
  );

  return candidates.sort((a, b) => {
    const score = (candidate: Build) => {
      const candidateKinds = weaponKinds(candidate.publishedLoadout?.weapon || "");
      const sharedStats = statCodes(candidate).filter((stat) => targetStats.includes(stat)).length;
      const sharedKinds = candidateKinds.filter((kind) => targetKinds.includes(kind)).length;
      return sharedKinds * 12 + sharedStats * 6 + Number(candidate.mechanic === build.mechanic) * 8 + Number(candidate.role === build.role) * 4 + Number(candidate.startingClass === build.startingClass) * 2;
    };
    return score(b) - score(a) || a.name.localeCompare(b.name);
  })[0];
}

export function stageLoadout(build: Build, phase: PhaseKey): StageLoadout {
  const exactStage = build.publishedStages?.[phase];
  if (exactStage) return { ...exactStage, talismanSlots: `${exactStage.talismans.length} listed by source` };
  if (build.publishedLoadout) {
    const available = build.availableFrom || "early";
    if (PHASES.indexOf(phase) < PHASES.indexOf(available)) {
      const immediatelyBeforeMainWeapon = PHASES.indexOf(phase) === PHASES.indexOf(available) - 1 && PHASES.indexOf(phase) > 0 && !build.phaseBridges?.[phase];
      const borrowed = closestPublishedStage(build, immediatelyBeforeMainWeapon ? PHASES[PHASES.indexOf(phase) - 1] : phase);
      if (borrowed?.publishedLoadout) {
        const resolution = weaponResolutions[borrowed.id];
        return {
          ...borrowed.publishedLoadout,
          weapon: resolution?.weapon || borrowed.publishedLoadout.weapon,
          talismanSlots: `${borrowed.publishedLoadout.talismans.length} listed by source`,
          borrowedFrom: { ...borrowed.source, buildName: borrowed.name },
          weaponChoice: resolution && { rationale: resolution.rationale, sources: resolution.sources },
        };
      }
    }
    const resolution = weaponResolutions[build.id];
    return {
      ...build.publishedLoadout,
      weapon: resolution?.weapon || build.publishedLoadout.weapon,
      talismanSlots: `${build.publishedLoadout.talismans.length} listed by source`,
      weaponChoice: resolution && { rationale: resolution.rationale, sources: resolution.sources },
    };
  }

  const casterInt = includesAny(build, ["intelligence", "sorcer", "magic", "spellblade", "gravity", "frost", "death"]);
  const casterFaith = includesAny(build, ["faith", "holy", "fire", "lightning", "dragon", "bestial", "frenzy", "blackflame", "crucible"]);
  const arcane = includesAny(build, ["arcane", "bleed", "poison", "rot", "dragon-communion"]);
  const guard = includesAny(build, ["tank", "guard", "shield"]);
  const ranged = includesAny(build, ["ranged", "bow", "crossbow", "artillerist", "throw"]);
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
        ? ["Graven-School Talisman", "Radagon Icon"]
        : casterFaith
          ? ["Faithful's Canvas Talisman", "Two Fingers Heirloom"]
          : charged
            ? ["Axe Talisman", "Green Turtle Talisman"]
            : ["Green Turtle Talisman", "Crimson Amber Medallion"];

  const midTalismans = guard
    ? ["Curved Sword Talisman", "Greatshield Talisman", "Arsenal Charm +1"]
    : ranged
      ? ["Arrow's Reach Talisman", "Arrow's Sting Talisman", "Green Turtle Talisman"]
      : critical
        ? ["Dagger Talisman", "Assassin's Cerulean Dagger", "Green Turtle Talisman"]
        : casterInt
          ? ["Graven-School Talisman", "Radagon Icon", "Cerulean Amber Medallion +1"]
          : casterFaith
            ? ["Faithful's Canvas Talisman", "Radagon Icon", "Fire or Lightning Scorpion Charm"]
            : multihit
              ? ["Winged Sword Insignia", "Green Turtle Talisman", "Claw Talisman"]
              : charged
                ? ["Axe Talisman", "Green Turtle Talisman", "Arsenal Charm +1"]
                : ["Green Turtle Talisman", "Erdtree's Favor", "Dragoncrest Shield Talisman +1"];

  const lateTalismans = guard
    ? ["Greatshield Talisman", "Curved Sword Talisman", "Dragoncrest Greatshield Talisman", "Great-Jar's Arsenal"]
    : ranged
      ? ["Arrow's Sting Talisman", "Shard of Alexander", "Dragoncrest Greatshield Talisman", "Green Turtle Talisman"]
      : critical
        ? ["Dagger Talisman", "Shard of Alexander", "Assassin's Cerulean Dagger", "Dragoncrest Greatshield Talisman"]
        : casterInt
          ? ["Graven-Mass Talisman", "Radagon Icon", "Godfrey Icon", "Magic Scorpion Charm"]
          : casterFaith
            ? ["Flock's Canvas Talisman", "Radagon Icon", "Godfrey Icon", "Fire, Lightning or Sacred Scorpion Charm"]
            : multihit
              ? ["Rotten Winged Sword Insignia", "Millicent's Prosthesis", "Shard of Alexander", "Dragoncrest Greatshield Talisman"]
              : charged
                ? ["Axe Talisman", "Shard of Alexander", "Dragoncrest Greatshield Talisman", "Great-Jar's Arsenal"]
                : ["Shard of Alexander", "Erdtree's Favor +2", "Dragoncrest Greatshield Talisman", "Green Turtle Talisman"];

  let dlcTalismans = guard
    ? ["Greatshield Talisman", "Pearl Shield Talisman", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"]
    : ranged
      ? ["Arrow's Soaring Sting Talisman", "Sharpshot Talisman", "Shard of Alexander", "Two-Headed Turtle Talisman"]
      : critical
        ? ["Blade of Mercy", "Dagger Talisman", "Shard of Alexander", "Two-Headed Turtle Talisman"]
        : casterInt
          ? ["Graven-Mass Talisman", "Beloved Stardust or Radagon Icon", "Godfrey Icon", "Dragoncrest Greatshield Talisman"]
          : casterFaith
            ? ["Flock's Canvas Talisman", "Talisman of the Dread or elemental charm", "Godfrey Icon", "Two-Headed Turtle Talisman"]
            : multihit
              ? ["Rotten Winged Sword Insignia", "Millicent's Prosthesis", "Retaliatory Crossed-Tree", "Two-Headed Turtle Talisman"]
              : charged
                ? ["Two-Handed Sword Talisman", "Axe Talisman", "Shard of Alexander", "Two-Headed Turtle Talisman"]
                : ["Shard of Alexander", "Two-Headed Sword Talisman", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"];

  if (arcane && includesAny(build, ["bleed", "blood"])) {
    const sets: Record<PhaseKey, string[]> = {
      early: ["Green Turtle Talisman", "Claw Talisman"],
      mid: ["Lord of Blood's Exultation", "Winged Sword Insignia", "Green Turtle Talisman"],
      late: ["Lord of Blood's Exultation", "Rotten Winged Sword Insignia", "Shard of Alexander", "Dragoncrest Greatshield Talisman"],
      dlc: ["Lord of Blood's Exultation", "Retaliatory Crossed-Tree", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"],
    };
    dlcTalismans = sets.dlc;
    if (phase === "early") earlyTalismans.splice(0, earlyTalismans.length, ...sets.early);
    if (phase === "mid") midTalismans.splice(0, midTalismans.length, ...sets.mid);
    if (phase === "late") lateTalismans.splice(0, lateTalismans.length, ...sets.late);
  } else if (arcane && includesAny(build, ["poison", "rot", "venom"])) {
    dlcTalismans = ["Kindred of Rot's Exultation", "Rotten Winged Sword Insignia", "Two-Headed Turtle Talisman", "Dragoncrest Greatshield Talisman"];
  }

  const talismanSets: Record<PhaseKey, string[]> = { early: earlyTalismans, mid: midTalismans, late: lateTalismans, dlc: dlcTalismans };
  const skill = guard
    ? "No Skill shield; Impaling Thrust, Square Off or Prayerful Strike on the weapon"
    : ranged
      ? "Barrage or Mighty Shot early; use the named weapon skill when the route changes"
      : critical
        ? "Parry or Carian Retaliation, with Determination on the critical weapon"
        : charged
          ? "Cragblade, Lion's Claw, Giant Hunt or War Cry according to weapon class"
          : multihit
            ? "Sword Dance, Repeating Thrust or the named weapon's multihit skill"
            : casterInt
              ? "Carian Grandeur, Glintblade Phalanx or the named magic weapon skill"
              : casterFaith
                ? "Sacred Blade, Flaming Strike or the named elemental weapon skill"
                : "Keep the named skill; use Impaling Thrust or Sword Dance on infusible weapons";

  const spells = unique([
    ...(casterInt ? [phase === "early" ? "Glintstone Pebble" : "Great Glintstone Shard", "Carian Slicer", phase === "dlc" ? "Glintblade Trio or build-specific DLC sorcery" : "Scholar's Armament or build-specific sorcery"] : []),
    ...(casterFaith ? [phase === "early" ? "Catch Flame" : "Golden Vow", "Flame, Grant Me Strength or build-specific body buff", phase === "dlc" ? "Knight's Lightning Spear or build-specific DLC incantation" : "Heal or ranged elemental incantation"] : []),
    ...(arcane && includesAny(build, ["dragon"]) ? ["Dragonclaw", "Rotten Breath or the current dragon breath"] : []),
  ]);

  const offhand = guard
    ? phase === "early" ? "100% physical medium shield" : "Medium or greatshield kept within medium load"
    : casterInt && casterFaith
      ? phase === "dlc" ? "Staff of the Great Beyond" : "Best available staff plus seal"
      : casterInt
        ? "Best available staff for the chosen sorcery school"
        : casterFaith
          ? "Seal that boosts the build's incantation school"
          : ranged
            ? "Light melee sidearm; carry the ammunition types the next area supports"
            : "Second weapon only when the moveset benefits from paired attacks";

  const namedMidSet = casterInt || casterFaith || ranged || lightLoad ? "Carian Knight Set" : "Knight Set";
  const namedLateSet = guard || charged ? "Scaled Set" : namedMidSet;
  const startingArmour = build.startingClass === "Not specified"
    ? "Recommended starting-class armour"
    : `${build.startingClass} starting armour`;
  const armour = phase === "early"
    ? `${startingArmour}; remove the heaviest piece only if the equipment screen shows Heavy Load`
    : phase === "mid"
      ? `${namedMidSet}; wear only the pieces that keep the equipment screen at ${lightLoad ? "Light Load" : "Medium Load"}`
      : `${namedLateSet}; wear only the pieces that keep the equipment screen at ${lightLoad ? "Light Load" : "Medium Load"}`;

  const flask = guard
    ? "Opaline Hardtear + Greenburst Crystal Tear"
    : casterInt
      ? "Magic-Shrouding Cracked Tear + Cerulean Hidden Tear"
      : casterFaith && includesAny(build, ["fire", "blackflame", "frenzy"])
        ? "Flame-Shrouding Cracked Tear + Opaline Hardtear"
        : casterFaith && includesAny(build, ["lightning"])
          ? "Lightning-Shrouding Cracked Tear + Greenburst Crystal Tear"
          : multihit
            ? "Thorny Cracked Tear + Greenburst Crystal Tear"
            : charged
              ? "Spiked Cracked Tear + Stonebarb Cracked Tear"
              : "Opaline Hardtear + the elemental or stamina tear that fits the current weapon";

  const mainStats = build.stats.replace("→", "then");
  const stats: Record<PhaseKey, string> = {
    early: `VIG 25 first; meet ${mainStats} weapon requirements; END or MND only as needed`,
    mid: `VIG 40; raise the first listed damage stat toward 35–40; keep enough END for medium roll`,
    late: `VIG 55–60; main damage stat 55–60; secondary stat 25–40; MND 20–30 for regular skill or spell use`,
    dlc: `Keep VIG 60; finish the main scaling stat at 60–80; use remaining levels for END, MND and the listed secondary stat`,
  };

  return {
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
  };
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
  { id: "weeping", act: "Base game", title: "The Weeping Peninsula", region: "Weeping Peninsula", level: "18–30", upgrade: "+3–5 / Somber +2", grace: "Castle Morne Rampart", x: 37, y: 91, phase: "early", summary: "Finish early weapon pickups, finite Somber stones, Boc's sewing tools and the complete Irina and Edgar chain.", essentials: ["Clear Coastal Cave and return Boc's Sewing Needle", "Defeat Darriwil with Blaidd at Forlorn Hound Evergaol, then speak to Blaidd for the finite Somber Smithing Stone [2]", "Morne Tunnel: collect the finite Somber Smithing Stone [1] and sweep the wall deposits", "Speak to Irina before entering Castle Morne", "Give Irina's letter to Edgar before the boss", "Defeat Leonine Misbegotten", "Collect the finite Somber Smithing Stone [1] on the shoreline behind Castle Morne", "Show Edgar the Grafted Blade Greatsword", "Return to Irina and Edgar before leaving"], directions: "Clear Coastal Cave and claim Blaidd's fixed Somber [2] reward before crossing the Bridge of Sacrifice. Sweep Morne Tunnel, then speak to Irina, take her letter through Castle Morne to Edgar, defeat Leonine and collect the shoreline Somber [1] before reporting back to Edgar and Irina.", boss: "Leonine Misbegotten", quest: "Blaidd, Boc, Irina and Edgar", repeatInStandard: true },
  { id: "stormveil", act: "Base game", title: "Stormveil Castle", region: "Stormhill & Stormveil", level: "30–40", upgrade: "+4–7 / Somber +2–3", grace: "Stormveil Main Gate", x: 28, y: 63, phase: "early", summary: "Secure the first Great Rune while preserving Gostoc, Rogier, Nepheli and Roderika's later rewards.", essentials: ["Defeat Margit", "Keep Gatekeeper Gostoc alive for his later Ancient Dragon Smithing Stone", "Collect Chrysalids' Memento for Roderika", "Collect Iron Whetblade and Misericorde", "Defeat the Lion Guardian for its fixed Somber Smithing Stone [1]", "Meet Rogier in the chapel and inspect the corpse below Stormveil", "Meet Nepheli before Godrick", "Defeat Godrick the Grafted", "Move Roderika to Roundtable Hold and unlock spirit tuning"], directions: "Take Gostoc's side path but leave him alive. Meet Rogier and Nepheli, collect Roderika's memento, the Lion Guardian's fixed Somber [1] and the rewards beneath the castle before Godrick. Afterward alternate Roderika and Hewg dialogue at Roundtable until spirit tuning opens.", boss: "Godrick the Grafted", remembrance: true, quest: "Gostoc, Rogier, Nepheli and Roderika", repeatInStandard: true },
  { id: "liurnia-south", act: "Base game", title: "Liurnia South", region: "Liurnia of the Lakes", level: "40–50", upgrade: "+7–10 / Somber +3–4", grace: "Lake-Facing Cliffs", x: 37, y: 47, phase: "mid", summary: "Start Varre and Latenna, preserve Ensha's missable gesture and prepare the Academy key route.", essentials: ["Meet Hyetta and give her the first Shabriri Grape", "Meet Thops at Church of Irith", "Speak to Ensha at Roundtable Hold before taking a secret medallion", "Find Albus and collect Haligtree Secret Medallion (Right)", "Clear Lakeside Crystal Cave and show Latenna the medallion", "Accept Latenna's request and receive her spirit ashes", "Meet Varre at Rose Church and choose that the Fingers seemed off", "Complete three invasions or defeat Magnus at Writheblood Ruins", "Soak the Lord of Blood's Favor in maiden blood and return to Varre", "Keep the Pureblood Knight's Medal but do not use it for early farming", "Reach Iji in north-west Liurnia; buy only the finite Somber Smithing Stone [3] and [4] stock each active unique weapon needs", "Collect Academy Glintstone Key", "Defeat the Crystalian for Smithing-Stone Miner's Bell Bearing [1]"], directions: "Use the lake shallows as a hub. Start Hyetta and Thops, visit Albus before Latenna beyond Lakeside Crystal Cave, finish Varre at Rose Church and reserve Iji's three finite Somber [3] and three finite Somber [4] stones for active weapons. Collect the Academy key and end at Raya Lucaria Crystal Tunnel.", quest: "Ensha, Latenna, Varre, Hyetta and Thops" },
  { id: "academy", act: "Base game", title: "Academy of Raya Lucaria", region: "Raya Lucaria", level: "50–60", upgrade: "+10–12 / Somber +4–5", grace: "Main Academy Gate", x: 43, y: 42, phase: "mid", summary: "Unlock rebirth, finish Thops and advance Yura without letting upgraded uniques run ahead.", essentials: ["Use Yura's red summon sign on the Main Academy Gate bridge", "Defeat Red Wolf of Radagon", "Collect Radagon Icon", "Collect the second Academy Glintstone Key", "Give the spare key to Thops and recover Thops's Barrier afterward", "Defeat Rennala", "Unlock respecs with Larval Tears"], directions: "Before entering, help Yura from the red sign beyond the northern seal. Inside, collect the spare key from the church rooftop route, give it to Thops and later recover his bell bearing and Barrier near Schoolhouse Classroom before Rennala.", boss: "Rennala, Queen of the Full Moon", remembrance: true, quest: "Yura and Thops", repeatInStandard: true },
  { id: "caria", act: "Base game", title: "Caria and Ranni", region: "West Liurnia", level: "55–65", upgrade: "+11–13 / Somber +5", grace: "Road to the Manor", x: 28, y: 35, phase: "mid", summary: "Preserve Rogier and Nepheli's rewards, begin Ranni and activate Radahn's Festival without entering Altus early.", essentials: ["Clear Black Knife Catacombs and give the Black Knifeprint to Rogier", "Use the Four Belfries return waygate and collect the Stormhawk King", "Give Nepheli the Stormhawk King after her Village of the Albinaurics dialogue", "Defeat Royal Knight Loretta", "Exhaust Rogier before joining Ranni", "Speak to Ranni and all three retainers", "Meet Blaidd in Siofra", "Ask Seluvis about Nokron and take his introduction", "Give Seluvis's Introduction to Sellen at Waypoint Ruins", "Return to Blaidd in Siofra and exhaust his dialogue", "Do not attack Seluvis or any quest NPC"], directions: "Finish Rogier's Black Knifeprint and collect Nepheli's Stormhawk King first. Clear Caria Manor, enter Ranni's service, then follow Blaidd through Seluvis and Sellen to activate Radahn's Festival.", boss: "Royal Knight Loretta", quest: "Rogier, Nepheli, Ranni and Radahn Festival activation", repeatInStandard: true },
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
  { id: "mohgwyn", act: "Base game", title: "Mohgwyn Palace", region: "Mohgwyn Palace", level: "120–140", upgrade: "+24–25 / Somber +9–10", grace: "Dynasty Mausoleum Midpoint", x: 45, y: 82, phase: "late", summary: "Complete Varre's remaining rewards, collect Mohg's countermeasure and defeat the second boss required for DLC access.", essentials: ["Finish Varre's invasion and maiden-blood steps", "Use the Pureblood Knight's Medal or Consecrated Snowfield waygate", "Speak to Varre at Dynasty Mausoleum Midpoint and invade him", "Collect the Purifying Crystal Tear from Eleonora at the Second Church of Marika", "Mix Purifying Crystal Tear before Mohg", "Defeat Mohg"], directions: "Enter with Varre's medal after completing his audience or use the blood-stained waygate on the Snowfield's western cliff. Follow the blood marsh to Dynasty Mausoleum Midpoint, finish Varre's red-sign invasion, then use the tear in the Wondrous Physick before Mohg's phase-transition ritual.", boss: "Mohg, Lord of Blood", remembrance: true, quest: "Varre rewards and DLC access gate", repeatInStandard: true },
  { id: "farum", act: "Base game", title: "Crumbling Farum Azula", region: "Farum Azula", level: "125–145", upgrade: "+25 / Somber +10", grace: "Dragon Temple", x: 78, y: 25, phase: "late", summary: "Finish Alexander, Gideon's reports and the original-capital checks before Maliketh changes the world.", essentials: ["Confirm Goldmask's Mountaintops message and every original-capital pickup are complete", "Collect Gideon's rewards for Mohg, Malenia, Haligtree and Mohgwyn before Maliketh", "Speak to Melina at the Forge and commit to the cardinal sin", "Tempest-Facing Balcony: collect Somberstone Miner's Bell Bearing [4] from the nearby cliff-edge corpse", "Defeat Godskin Duo for Smithing-Stone Miner's Bell Bearing [4]", "Meet Alexander beyond the Dragon Temple Lift and finish his duel", "Beside the Great Bridge: collect Somberstone Miner's Bell Bearing [5] from the altar below the grace", "Find the hidden Placidusax drop-down", "Defeat Dragonlord Placidusax", "Confirm Bolt of Gransax and Coded Sword are collected", "Defeat Maliketh only after every listed check"], directions: "Finish Gideon's reports before using the Forge. In Farum Azula take Somber bearing [4] just after Tempest-Facing Balcony, defeat the Godskin Duo, finish Alexander and collect Somber bearing [5] below Beside the Great Bridge. Take the Placidusax drop-down and only then approach Maliketh; his defeat permanently creates the Ashen Capital and moves Gideon.", boss: "Maliketh, the Black Blade", remembrance: true, quest: "Gideon, Alexander and the hard Ashen Capital world-state change", repeatInStandard: true },
  { id: "ashen", act: "Base game", title: "The Elden Throne", region: "Leyndell, Ashen Capital", level: "135–155", upgrade: "+25 / Somber +10", grace: "Leyndell, Capital of Ash", x: 62, y: 38, phase: "late", summary: "Collect the post-Maliketh quest rewards and conclude the base game without accidentally entering Journey 2.", essentials: ["Collect Goldmask's Mending Rune of Perfect Order below the colosseum", "Collect any remaining Ashen Capital rewards", "Defeat Gideon Ofnir", "Defeat Godfrey / Hoarah Loux", "Defeat Radagon and Elden Beast", "Choose ending; do not start Journey 2"], directions: "From Capital of Ash, collect Goldmask's rune before crossing the buried capital. Defeat Gideon, climb to the Queen's Bedchamber, defeat Godfrey and enter the Erdtree. After choosing an ending, decline Journey 2 at Roundtable Hold so the DLC route remains available.", boss: "Elden Beast", remembrance: true, quest: "Goldmask reward and base-game finale", repeatInStandard: true },
  { id: "gravesite", act: "Shadow of the Erdtree", title: "Gravesite Plain", region: "Gravesite Plain", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 1–3", grace: "Gravesite Plain", x: 35, y: 79, phase: "dlc", summary: "Enter after Radahn and Mohg, collect the pre-rune-break NPC rewards and establish a modest blessing curve.", essentials: ["Confirm Radahn and Mohg are defeated", "Touch Miquella's withered arm in Mohg's arena", "Speak to Leda at the cocoon and enter the Realm of Shadow", "Meet Freyja and Hornsent at Three-Path Cross", "Meet Moore and Ansbach at Main Gate Cross", "Assist the friendly Forager Brood before its cookbook opportunities close", "Get Black Syrup from Moore and give it to Thiollier", "Tell Thiollier you are weary of life and keep Thiollier's Concoction", "Collect two Scadutree Fragments at Church of Consolation", "Defeat Blackgaol Knight", "Defeat Fire Knight Queelign's Belurat invasion", "Clear Belurat and defeat Divine Beast Dancing Lion", "Wear the Divine Beast Head for Hornsent Grandam and give her Scorpion Stew to Hornsent"], directions: "After Elden Beast, enter through Mohg's cocoon. Meet every follower, collect Moore and Thiollier's pre-break items and help the non-hostile Forager Brood. Defeat Queelign's Belurat invasion and Dancing Lion, then use the Divine Beast Head with Hornsent Grandam before the rune breaks.", boss: "Divine Beast Dancing Lion", remembrance: true, quest: "Pre-rune-break follower, Hornsent Grandam and Queelign rewards", repeatInStandard: true },
  { id: "ensiss", act: "Shadow of the Erdtree", title: "Castle Ensis", region: "Castle Ensis", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 4–6", grace: "Castle Ensis Checkpoint", x: 55, y: 63, phase: "dlc", summary: "Clear Ensis, meet Dane and only then cross one of the great-rune trigger boundaries.", essentials: ["Collect the Three-Path Cross and Castle Ensis Cross fragments", "Finish Moore, Thiollier, Freyja, Hornsent and Ansbach dialogue", "Collect Milady and Wing Stance inside Castle Ensis", "Defeat Rellana", "Enter Scadu Altus but stop at Highroad Cross", "Read the Monk's Missive and use May the Best Win before Dryleaf Dane", "Defeat Dryleaf Dane and collect Dryleaf Arts", "Revisit every follower before any rune-break boundary", "Avoid Shadow Keep, eastern Scadu Altus, Rauh Base and the Bonny Village bridges until ready", "Trigger the great-rune break only after the follower check"], directions: "Clear Castle Ensis and Rellana, stop at Highroad Cross and duel Dane with the gesture from the Monk's Missive. Revisit all followers before crossing a Shadow Keep, eastern-Altus, Bonny or Rauh trigger boundary.", boss: "Rellana, Twin Moon Knight", remembrance: true, quest: "Dryleaf Dane and DLC great-rune break checkpoint", repeatInStandard: true },
  { id: "fissure", act: "Shadow of the Erdtree", title: "Cerulean Coast & Fissure", region: "Southern Shore", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 6–8", grace: "Fissure Depths", x: 32, y: 92, summary: "Use the great-rune break to open the Fissure, then finish Thiollier and St. Trina's required dialogue before the DLC finale.", essentials: ["Confirm Miquella's great rune has broken and the Fissure seal is open", "Buy Thiollier's remaining stock and give him the Black Syrup", "Reach the Cerulean Coast map by the Ellac River route", "Descend Stone Coffin Fissure", "Defeat Putrescent Knight", "Imbibe St. Trina's nectar four times until she speaks", "Tell Thiollier St. Trina's words and defeat his invasion", "Imbibe again and exhaust Thiollier's dialogue"], directions: "From Castle Front descend through the Ellac River cave and follow the river south to Cerulean Coast. After the great-rune message removes the seal, descend the coffins to Fissure Depths. Defeat Putrescent Knight, repeatedly imbibe the nectar despite the deaths, relay the words to Thiollier and resolve his invasion so he remains available at Enir-Ilim.", boss: "Putrescent Knight", remembrance: true, quest: "Thiollier summon and St. Trina reward", repeatInStandard: true },
  { id: "shadow-keep", act: "Shadow of the Erdtree", title: "Shadow Keep Crossroads", region: "Scadu Altus", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 8–10", grace: "Highroad Cross", x: 57, y: 45, summary: "Resolve every post-break choice, Queelign's Iris reward and the Storehouse exchanges before Messmer.", essentials: ["Speak to Leda, Hornsent, Ansbach, Freyja, Moore, Thiollier and Dane after the rune breaks", "Choose Moore's answer only after collecting the available Forager Brood cookbooks", "Collect the O Mother gesture north of Bonny Village", "Defeat Fire Knight Queelign's Church of the Crusade invasion", "Find Queelign in Shadow Keep Prayer Room and choose the Iris reward", "Resolve the Leda and Hornsent bridge summon signs before entering Messmer's arena", "Defeat Golden Hippopotamus", "Open Storehouse First Floor, Seventh Floor, Loft and Back Gate paths", "Speak to Freyja on the seventh floor and then tell Ansbach about her", "Give Ansbach the Secret Rite Scroll and receive the Letter for Freyja", "Deliver Ansbach's letter to Freyja and exhaust both characters", "Resolve the Leda and Ansbach Storehouse signs for the party's required reward", "Do not enter Messmer's arena until every faction card is complete"], directions: "Revisit all followers first. Collect O Mother and finish Queelign's second invasion and Prayer Room choice. Resolve Leda's bridge signs, then complete the Freyja/Ansbach scroll and letter order before Messmer.", quest: "Queelign, Moore, Hornsent, Leda, Ansbach and Freyja irreversible choices", repeatInStandard: true },
  { id: "gaius-avatar", act: "Shadow of the Erdtree", title: "Scaduview & Hinterland", region: "Shadow Keep rear", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 10–12", grace: "Shadow Keep, Back Gate", x: 67, y: 32, summary: "Collect a measured set of fragments and clear two optional Remembrances behind the keep.", essentials: ["Defeat Commander Gaius", "Collect Scaduview Chalice fragments but stop at target", "Open Hinterland with the O Mother gesture", "Defeat Scadutree Avatar"], directions: "Climb the Specimen Storehouse to the loft and back gate. Take the field path for Gaius, then use the hidden statue route for Hinterland and the Tree-Worship Passage.", boss: "Commander Gaius & Scadutree Avatar", remembrance: true, repeatInStandard: true },
  { id: "jagged", act: "Shadow of the Erdtree", title: "Jagged Peak", region: "Jagged Peak", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 11–13", grace: "Jagged Peak Summit", x: 81, y: 66, summary: "Finish Igon and deliberately choose the Dragon Communion Priestess reward branch before Bayle.", essentials: ["Speak to Igon beside Pillar Path Waypoint", "Defeat Ancient Dragon-Man in Dragon's Pit", "Meet the Dragon Communion Priestess at the Grand Altar", "Choose whether to give the Priestess Thiollier's Concoction at night", "Speak to Igon after the two drakes fight and receive his finger", "Defeat Ancient Dragon Senessax", "Use Igon's summon sign inside Bayle's arena", "Defeat Bayle the Dread", "Return to Igon and the Dragon Communion Priestess for both reward sets"], directions: "Meet Igon and the Priestess before climbing. Give the Priestess Thiollier's Concoction at night only for her spirit and Dragonbolt; leave her awake for Flowerstone Gavel and Priestess Heart. Summon Igon inside Bayle's arena and revisit both afterward.", boss: "Bayle the Dread", quest: "Igon and mutually exclusive Dragon Communion Priestess rewards", repeatInStandard: true },
  { id: "abyss", act: "Shadow of the Erdtree", title: "Abyssal Woods", region: "Abyssal Woods", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 12–14", grace: "Second Floor Chamber", x: 76, y: 83, summary: "Use Shadow Keep's hidden coffin route and clear the mandatory catacomb boss before Midra.", essentials: ["Take the hidden ladder beside Shadow Keep's main plaza", "Ride the stone coffin to Castle Watering Hole", "Clear Darklight Catacombs and defeat Jori, Elder Inquisitor", "Cross Abyssal Woods without Torrent", "Enter Midra's Manse and pull the portrait lever", "Defeat Midra"], directions: "Use the ladder and waterfall passage in Shadow Keep to reach the coffin. Clear Darklight Catacombs and Jori to open Abyssal Woods, sneak past the untouchable enemies, then reach Midra through the manse library and portrait passage.", boss: "Midra, Lord of Frenzied Flame", remembrance: true, repeatInStandard: true },
  { id: "metyr", act: "Shadow of the Erdtree", title: "Cathedral of Manus Metyr", region: "Scadu Altus & Finger Ruins", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 13–15", grace: "Cathedral of Manus Metyr", x: 76, y: 46, summary: "Complete Ymir's two maps in order, ring both ruin bells and resolve Jolan only after Metyr and Ymir.", essentials: ["Meet Ymir and Jolan at the cathedral", "Ring the Finger Ruins of Rhia bell", "Return to Ymir for the second ruins map", "Open the Hinterland with O Mother and ring the Dheo bell", "Return to Ymir and exhaust both characters' dialogue", "Inspect Ymir's empty throne and defeat Swordhand of Night Anna", "Ring the Miyr bell and defeat Metyr", "Defeat Ymir and Jolan's invasion", "Choose Jolan's Iris reward before leaving the cathedral"], directions: "Reach the cathedral from Bonny Village. Follow Ymir's first map to Rhia, report back for the second map, then use O Mother at Shadow Keep's statue to reach Dheo. After reporting both bells, reload until Ymir leaves his throne, descend to Miyr and finish Metyr before resolving Ymir and Jolan above.", boss: "Metyr, Mother of Fingers", remembrance: true, quest: "Ymir, Jolan and Anna reward choice", repeatInStandard: true },
  { id: "messmer", act: "Shadow of the Erdtree", title: "The Dark Chamber", region: "Shadow Keep", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 14–16", grace: "Dark Chamber Entrance", x: 58, y: 38, summary: "Enter the arena only after the bridge signs and Storehouse exchanges, then use the intended Hornsent summon outcome.", essentials: ["Confirm the Leda and Hornsent bridge signs are no longer pending", "Confirm Ansbach and Freyja's letter exchange is complete", "Choose whether to summon Hornsent inside Messmer before crossing the fog", "Defeat Messmer", "Exhaust Hornsent after the fight if he was summoned", "Collect Messmer's Kindling"], directions: "At Dark Chamber Entrance, stop once more before crossing the fog because entering the arena removes the Leda/Hornsent bridge signs. If continuing Hornsent's route, use his sign inside the arena and exhaust him after the fight. Keep Messmer's Kindling for Rauh.", boss: "Messmer the Impaler", remembrance: true, quest: "Hornsent outcome and Messmer's Kindling", repeatInStandard: true },
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

export const chapters: Chapter[] = chapterData.map((chapter) => ({ ...chapter, ...sourcedMapCoordinates[chapter.id] }));

export const itemGuides: Record<string, string> = {
  "Golden Seed (Ordina Liturgical Town)": "From the Ordina, Liturgical Town grace, ride west-northwest beyond the buildings, then turn north toward the riverbank. The seed is beneath the small illusory tree on the rocks above the river.",
  Longsword: "Purchase from the Twin Maiden Husks after reaching Roundtable Hold.",
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
};

export const sources = [
  ["Patch 1.16.1", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-1161"],
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
