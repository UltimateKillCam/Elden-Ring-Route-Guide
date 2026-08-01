export type PhaseKey = "early" | "mid" | "late" | "dlc";

export type BuildSource = { label: string; url: string };

export type Build = {
  id: string;
  name: string;
  stats: string;
  role: string;
  playstyle: string;
  complexity: "Easy" | "Moderate" | "Advanced";
  phases: Record<PhaseKey, string>;
  quest?: string;
  tags: string[];
  startingClass: "Vagabond" | "Warrior" | "Hero" | "Bandit" | "Astrologer" | "Prophet" | "Samurai" | "Prisoner" | "Confessor" | "Wretch";
  mechanic: string;
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
  source: source || {
    label: `${phases[3].replace(/ \+.*/, "").replace(/ \/.*/, "")} weapon reference`,
    url: `https://eldenring.wiki.gg/index.php?search=${encodeURIComponent(phases[3].replace(/ \+.*/, "").replace(/ \/.*/, ""))}`,
  },
});

export const builds: Build[] = [
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
};

const includesAny = (build: Build, values: string[]) => {
  const text = `${build.name} ${build.stats} ${build.role} ${build.tags.join(" ")} ${build.playstyle}`.toLowerCase();
  return values.some((value) => text.includes(value));
};

const unique = (items: string[]) => Array.from(new Set(items));

export function stageLoadout(build: Build, phase: PhaseKey): StageLoadout {
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

  const armour = lightLoad
    ? "Stay below 30% equip load; Blue Dancer Charm is optional only while physical damage remains high"
    : guard || charged
      ? phase === "early" ? "Medium roll; aim for 51 poise" : "Medium roll; 51–101 poise depending on Endurance and shield weight"
      : casterInt || casterFaith || ranged
        ? "Medium roll; use 51 poise when possible, otherwise prioritise casting or ammunition weight"
        : "Medium roll and at least 51 poise; armour choice is cosmetic once the target is met";

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

export const chapters: Chapter[] = [
  { id: "first-steps", act: "Base game", title: "First Steps", region: "West Limgrave", level: "1–15", upgrade: "+0–2 / Somber +1", grace: "The First Step", x: 34, y: 76, phase: "early", summary: "Unlock the core systems, assemble every player's first functional kit, and avoid high-level detours.", essentials: ["Church of Elleh: Crafting Kit and Kale", "Gatefront: Whetstone Knife and first map", "Third Church: Flask of Wondrous Physick", "Limgrave Tunnels: early Smithing Stones"], directions: "From The First Step, ride north to Church of Elleh, then follow the road to Gatefront. Sweep east only as far as the Third Church before returning to Limgrave Tunnels." },
  { id: "weeping", act: "Base game", title: "The Weeping Peninsula", region: "Weeping Peninsula", level: "18–30", upgrade: "+3–5 / Somber +2", grace: "Castle Morne Rampart", x: 37, y: 91, phase: "early", summary: "Finish early weapon pickups, flask upgrades and the peninsula's compact quest chain.", essentials: ["Collect three Sacred Tears", "Castle Morne weapon pickups", "Defeat Leonine Misbegotten", "Speak to Irina and Edgar before leaving"], directions: "Cross the Bridge of Sacrifice, activate the rampart grace, then make a clockwise sweep of the three churches before ending at Castle Morne.", boss: "Leonine Misbegotten", repeatInStandard: true },
  { id: "stormveil", act: "Base game", title: "Stormveil Castle", region: "Stormhill & Stormveil", level: "30–40", upgrade: "+4–7 / Somber +2–3", grace: "Stormveil Main Gate", x: 28, y: 63, phase: "early", summary: "Secure the first Great Rune and the castle's high-value build tools without over-upgrading.", essentials: ["Defeat Margit", "Collect Iron Whetblade and Misericorde", "Meet Rogier and Nepheli", "Defeat Godrick the Grafted"], directions: "Enter via the side path suggested by Gostoc. Clear each interior grace before the courtyard, then descend for the hidden items before challenging Godrick.", boss: "Godrick the Grafted", remembrance: true, repeatInStandard: true },
  { id: "liurnia-south", act: "Base game", title: "Liurnia South", region: "Liurnia of the Lakes", level: "40–50", upgrade: "+7–10 / Somber +3–4", grace: "Lake-Facing Cliffs", x: 37, y: 47, phase: "mid", summary: "Catch replacement weapons up to the party cap and prepare the Academy key route.", essentials: ["Meet Hyetta and Thops", "Reach Iji in north-west Liurnia", "Collect Academy Glintstone Key", "Raya Lucaria Crystal Tunnel bell bearing"], directions: "Descend from Lake-Facing Cliffs, tag the map stone, then use the lake shallows as a hub. Finish at the crystal tunnel in the north-east." },
  { id: "academy", act: "Base game", title: "Academy of Raya Lucaria", region: "Raya Lucaria", level: "50–60", upgrade: "+10–12 / Somber +4–5", grace: "Main Academy Gate", x: 43, y: 42, phase: "mid", summary: "Unlock rebirth and the second early Remembrance without letting upgraded uniques run ahead.", essentials: ["Defeat Red Wolf of Radagon", "Collect Radagon Icon", "Defeat Rennala", "Unlock respecs with Larval Tears"], directions: "Use the south gate seal, follow the graveyard and waterwheel path, then clear the debate hall rooftops before entering the Grand Library.", boss: "Rennala, Queen of the Full Moon", remembrance: true, repeatInStandard: true },
  { id: "caria", act: "Base game", title: "Caria and Ranni", region: "West Liurnia", level: "55–65", upgrade: "+11–13 / Somber +5", grace: "Road to the Manor", x: 28, y: 35, phase: "mid", summary: "Begin Ranni's chain, preserving access to Nokron, Mimic Tear and several build rewards.", essentials: ["Defeat Royal Knight Loretta", "Speak to Ranni and all three retainers", "Meet Blaidd in Siofra", "Do not attack Seluvis or quest NPCs"], directions: "Pass the illusory wall north of Kingsrealm Ruins, rest by Iji, clear Caria Manor, then visit all three towers behind the manor.", boss: "Royal Knight Loretta", quest: "Ranni: oath and Nokron setup", repeatInStandard: true },
  { id: "caelid", act: "Base game", title: "The Radahn Festival", region: "South Caelid", level: "60–70", upgrade: "+12–15 / Somber +5–6", grace: "Chamber Outside the Plaza", x: 72, y: 63, phase: "mid", summary: "Open Nokron and satisfy the first half of the DLC access requirement.", essentials: ["Collect Caelid map fragments", "Clear Gael Tunnel if needed by a build", "Activate the festival", "Defeat Starscourge Radahn"], directions: "Enter Caelid from Smoldering Church, follow the southern road to Redmane Castle, then use the festival lift to reach the battlefield.", boss: "Starscourge Radahn", remembrance: true, quest: "Ranni: stars resume", repeatInStandard: true },
  { id: "nokron", act: "Base game", title: "Nokron Expedition", region: "Nokron & Siofra", level: "70–80", upgrade: "+15–18 / Somber +6", grace: "Nokron, Eternal City", x: 51, y: 70, phase: "mid", summary: "Collect Mimic Tear, advance Ranni and secure the underground Remembrance.", essentials: ["Defeat Mimic Tear", "Collect Mimic Tear Ashes behind Stonesword seal", "Collect Fingerslayer Blade", "Defeat Regal Ancestor Spirit"], directions: "Enter the crater south of Mistwood, cross the rooftops into Nokron, then branch west for the ancestral flame pillars and south for Night's Sacred Ground.", boss: "Regal Ancestor Spirit", remembrance: true, quest: "Ranni: Fingerslayer Blade", repeatInStandard: true },
  { id: "altus", act: "Base game", title: "Altus Supply Line", region: "Altus Plateau", level: "75–90", upgrade: "+16–19 / Somber +6–7", grace: "Altus Highway Junction", x: 55, y: 35, phase: "mid", summary: "Open the plateau, collect replacement-weapon materials, and avoid prematurely entering the capital.", essentials: ["Dectus Lift or Ruin-Strewn Precipice", "Collect Golden Seeds along the highway", "Sealed Tunnel: Smithing-Stone Bell Bearing 2", "Collect key Altus build items"], directions: "Use the highway junction as a hub. Sweep north to the map stone, west toward Gelmir, and east to the sealed tunnel outside Leyndell." },
  { id: "gelmir", act: "Base game", title: "Volcano Manor", region: "Mt. Gelmir", level: "80–95", upgrade: "+18–20 / Somber +7", grace: "Volcano Manor", x: 35, y: 29, phase: "late", summary: "Complete required contracts before defeating the manor lord and collect fire-aligned build pieces.", essentials: ["Join Volcano Manor", "Finish selected contracts before Rykard", "Defeat Godskin Noble", "Defeat Rykard"], directions: "Approach from Altus via the Bridge of Iniquity or accept Rya's invitation. Finish every desired contract before taking the audience waygate.", boss: "Rykard, Lord of Blasphemy", remembrance: true, quest: "Volcano Manor contracts lock after Rykard", repeatInStandard: true },
  { id: "leyndell", act: "Base game", title: "Leyndell, Royal Capital", region: "Leyndell", level: "90–110", upgrade: "+20–22 / Somber +7–8", grace: "East Capital Rampart", x: 63, y: 37, phase: "late", summary: "Clear capital missables before the world-state change and claim Morgott's Remembrance.", essentials: ["Collect Bolt of Gransax before Maliketh", "Collect Coded Sword and capital gear", "Defeat Godfrey's golden shade", "Defeat Morgott"], directions: "Enter through the east rampart, descend the main avenue, clear the fortified manor and spear monument, then climb the roots to the Elden Throne.", boss: "Morgott, the Omen King", remembrance: true, quest: "Capital missables", repeatInStandard: true },
  { id: "ainsel", act: "Base game", title: "Moonlight Depths", region: "Ainsel, Nokstella & Lake of Rot", level: "90–110", upgrade: "+20–22 / Somber +8", grace: "Ainsel River Main", x: 48, y: 55, phase: "late", summary: "Finish Ranni's underground journey and defeat the voidborn Remembrance.", essentials: ["Take the Miniature Ranni and exhaust dialogue", "Defeat Baleful Shadow", "Collect Dark Moon Ring", "Defeat Astel"], directions: "Use Renna's Rise waygate, follow the river through Nokstella, cross the Lake of Rot using pressure plates, then descend the Grand Cloister coffin.", boss: "Astel, Naturalborn of the Void", remembrance: true, quest: "Ranni: Moonlight Altar", repeatInStandard: true },
  { id: "deeproot", act: "Base game", title: "Deeproot and Fia", region: "Deeproot Depths", level: "90–110", upgrade: "+20–22 / Somber +8", grace: "Across the Roots", x: 55, y: 50, summary: "Resolve Fia's chain after obtaining Ranni's Cursemark and face the lichdragon.", essentials: ["Give Fia the Cursemark of Death", "Exhaust Fia's dialogue and reload", "Enter the deathbed dream", "Defeat Lichdragon Fortissax"], directions: "Reach Deeproot through the Siofra Aqueduct coffin, cross the roots into the ruined city, and climb the upper roots to Fia's arena.", boss: "Lichdragon Fortissax", remembrance: true, quest: "Fia quest", repeatInStandard: true },
  { id: "mountaintops", act: "Base game", title: "Mountaintops of the Giants", region: "Mountaintops", level: "105–120", upgrade: "+22–24 / Somber +8–9", grace: "Zamor Ruins", x: 68, y: 20, phase: "late", summary: "Collect late upgrades, finish time-sensitive NPC steps and reach the Forge.", essentials: ["Zamor Ruins: Smithing-Stone Bell Bearing 3", "Complete Shabriri/Yura decisions", "Castle Sol for Haligtree medallion", "Defeat Fire Giant"], directions: "Follow the chain bridge from Zamor Ruins, branch north to Castle Sol, then return south-east across the frozen lake to the giant's forge.", boss: "Fire Giant", remembrance: true, repeatInStandard: true },
  { id: "haligtree", act: "Base game", title: "Consecrated Snowfield & Haligtree", region: "Haligtree", level: "120–140", upgrade: "+24–25 / Somber +9–10", grace: "Haligtree Canopy", x: 23, y: 17, phase: "late", summary: "Complete the optional endgame branch and its hardest base-game Remembrance before Farum Azula.", essentials: ["Use both Haligtree Secret Medallion halves", "Solve Ordina's evergaol", "Defeat Loretta", "Finish Millicent before Malenia", "Defeat Malenia"], directions: "Use the secret lift path, cross the snowfield to Ordina, light the four statues, then descend the Haligtree from canopy to roots.", boss: "Malenia, Goddess of Rot", remembrance: true, quest: "Millicent quest lock", repeatInStandard: true },
  { id: "mohgwyn", act: "Base game", title: "Mohgwyn Palace", region: "Mohgwyn Palace", level: "120–140", upgrade: "+24–25 / Somber +9–10", grace: "Dynasty Mausoleum Midpoint", x: 45, y: 82, phase: "late", summary: "Complete the second DLC gate without using the palace as a repetitive rune farm.", essentials: ["Enter through Varre or Snowfield waygate", "Collect Purifying Crystal Tear if desired", "Finish relevant Varre steps", "Defeat Mohg"], directions: "From Palace Approach, follow the blood marsh west, climb through the mausoleum caves, and take the lift beside the midpoint grace.", boss: "Mohg, Lord of Blood", remembrance: true, quest: "DLC access gate", repeatInStandard: true },
  { id: "farum", act: "Base game", title: "Crumbling Farum Azula", region: "Farum Azula", level: "125–145", upgrade: "+25 / Somber +10", grace: "Dragon Temple", x: 78, y: 25, phase: "late", summary: "Finish the final bell bearings, defeat two Remembrance bosses and trigger the capital's irreversible change.", essentials: ["Godskin Duo: Bell Bearings 4", "Find the hidden Placidusax drop-down", "Defeat Dragonlord Placidusax", "Defeat Maliketh only after capital checks"], directions: "Advance to Dragon Temple, detour from Beside the Great Bridge to the empty grave platform for Placidusax, then return for Maliketh.", boss: "Maliketh, the Black Blade", remembrance: true, quest: "Point of no return for Leyndell", repeatInStandard: true },
  { id: "ashen", act: "Base game", title: "The Elden Throne", region: "Leyndell, Ashen Capital", level: "135–155", upgrade: "+25 / Somber +10", grace: "Leyndell, Capital of Ash", x: 62, y: 38, phase: "late", summary: "Conclude the base game only after every party build and quest is ready for the DLC.", essentials: ["Defeat Gideon Ofnir", "Defeat Godfrey / Hoarah Loux", "Defeat Radagon and Elden Beast", "Choose ending; do not start Journey 2"], directions: "Cross the buried capital toward the sanctuary, climb to the Queen's Bedchamber, then continue through the thorns after Godfrey.", boss: "Elden Beast", remembrance: true, quest: "Base-game finale", repeatInStandard: true },
  { id: "gravesite", act: "Shadow of the Erdtree", title: "Gravesite Plain", region: "Gravesite Plain", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 1–3", grace: "Gravesite Plain", x: 35, y: 79, phase: "dlc", summary: "Introduce DLC gear gradually and establish the blessing curve before the first legacy dungeon.", essentials: ["Church of Consolation fragments", "Collect early DLC build replacements", "Defeat Blackgaol Knight", "Clear Belurat and Dancing Lion"], directions: "From Gravesite Plain, sweep south-east to the church, return through Scorched Ruins, then take the western road into Belurat.", boss: "Divine Beast Dancing Lion", remembrance: true, repeatInStandard: true },
  { id: "ensiss", act: "Shadow of the Erdtree", title: "Castle Ensis", region: "Castle Ensis", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 4–6", grace: "Castle Ensis Checkpoint", x: 55, y: 63, phase: "dlc", summary: "Finish first-wave DLC weapon swaps and open Scadu Altus at a controlled blessing level.", essentials: ["Collect nearby Miquella Crosses", "Finish early Moore and Thiollier dialogue", "Clear Castle Ensis", "Defeat Rellana"], directions: "Cross Ellac Greatbridge, enter the castle checkpoint, open the rear shortcut, and climb the moonlit stairs to the upper arena.", boss: "Rellana, Twin Moon Knight", remembrance: true, quest: "Early follower dialogue", repeatInStandard: true },
  { id: "fissure", act: "Shadow of the Erdtree", title: "Cerulean Coast & Fissure", region: "Southern Shore", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 6–8", grace: "Fissure Depths", x: 32, y: 92, summary: "Resolve Thiollier's sleep path and the southern Remembrance before major quest flags break.", essentials: ["Reach Cerulean Coast map", "Advance Thiollier and St. Trina", "Descend Stone Coffin Fissure", "Defeat Putrescent Knight"], directions: "Follow the Ellac River downstream to the coast, ride south to the fissure, then descend the long platforming route to its depths.", boss: "Putrescent Knight", remembrance: true, quest: "Thiollier and St. Trina", repeatInStandard: true },
  { id: "shadow-keep", act: "Shadow of the Erdtree", title: "Shadow Keep Crossroads", region: "Scadu Altus", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 8–10", grace: "Highroad Cross", x: 57, y: 45, summary: "Handle the great-rune break, route every follower conversation, and open the DLC's major branches.", essentials: ["Speak to every follower before and after the rune breaks", "Defeat Golden Hippopotamus", "Open Storehouse paths", "Do not burn the sealing tree"], directions: "Approach Shadow Keep from Highroad Cross. After the rune message, revisit Leda, Hornsent, Ansbach, Freyja, Moore, Thiollier and Dane before pushing deeper.", quest: "Major DLC quest-state checkpoint", repeatInStandard: true },
  { id: "gaius-avatar", act: "Shadow of the Erdtree", title: "Scaduview & Hinterland", region: "Shadow Keep rear", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 10–12", grace: "Shadow Keep, Back Gate", x: 67, y: 32, summary: "Collect a measured set of fragments and clear two optional Remembrances behind the keep.", essentials: ["Defeat Commander Gaius", "Collect Scaduview Chalice fragments but stop at target", "Open Hinterland with the O Mother gesture", "Defeat Scadutree Avatar"], directions: "Climb the Specimen Storehouse to the loft and back gate. Take the field path for Gaius, then use the hidden statue route for Hinterland and the Tree-Worship Passage.", boss: "Commander Gaius & Scadutree Avatar", remembrance: true, repeatInStandard: true },
  { id: "jagged", act: "Shadow of the Erdtree", title: "Jagged Peak", region: "Jagged Peak", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 11–13", grace: "Jagged Peak Summit", x: 81, y: 66, summary: "Finish Igon's quest and the dragon superboss at a fair blessing level.", essentials: ["Speak to Igon at each stop", "Defeat Ancient Dragon Senessax", "Summon Igon inside the summit arena", "Defeat Bayle the Dread"], directions: "Enter Dragon's Pit south-east of Castle Ensis, emerge at the Terminus, then follow the peak's spiritsprings upward through the dragon battles.", boss: "Bayle the Dread", quest: "Igon quest", repeatInStandard: true },
  { id: "abyss", act: "Shadow of the Erdtree", title: "Abyssal Woods", region: "Abyssal Woods", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 12–14", grace: "Second Floor Chamber", x: 76, y: 83, summary: "Descend beneath Shadow Keep and resolve the hidden frenzy Remembrance.", essentials: ["Use the coffin below Shadow Keep", "Clear Darklight Catacombs", "Cross the woods without Torrent", "Defeat Midra"], directions: "Find the hidden ladder by the keep's main plaza, ride the coffin into lower Scadu, clear Darklight Catacombs, then follow the eastern woods to Midra's Manse.", boss: "Midra, Lord of Frenzied Flame", remembrance: true, repeatInStandard: true },
  { id: "metyr", act: "Shadow of the Erdtree", title: "Cathedral of Manus Metyr", region: "Scadu Altus & Finger Ruins", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 13–15", grace: "Cathedral of Manus Metyr", x: 76, y: 46, summary: "Complete Ymir's ruin maps and unlock the finger-sorcery build rewards.", essentials: ["Ring the Rhia and Dheo ruin bells", "Exhaust Jolan and Ymir dialogue", "Enter the throne passage", "Defeat Metyr"], directions: "Reach the cathedral through Bonny Village, follow Ymir's two map clues to the southern and northern finger ruins, then inspect his throne when he leaves.", boss: "Metyr, Mother of Fingers", remembrance: true, quest: "Ymir and Jolan", repeatInStandard: true },
  { id: "messmer", act: "Shadow of the Erdtree", title: "The Dark Chamber", region: "Shadow Keep", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 14–16", grace: "Dark Chamber Entrance", x: 58, y: 38, summary: "Resolve faction summons and defeat the first mandatory DLC lord.", essentials: ["Finish Ansbach and Freyja letter exchange", "Resolve Leda/Hornsent summon choices", "Collect Storehouse build items", "Defeat Messmer"], directions: "Return to the Specimen Storehouse, climb the exterior statues and upper lofts, then take the final lift to the Dark Chamber.", boss: "Messmer the Impaler", remembrance: true, quest: "Faction summon choices", repeatInStandard: true },
  { id: "rauh", act: "Shadow of the Erdtree", title: "Ancient Ruins of Rauh", region: "Rauh", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 15–17", grace: "Church of the Bud", x: 31, y: 33, summary: "Cross Rauh, finish the remaining follower errands, and obtain access to Enir-Ilim.", essentials: ["Collect Rauh map from the lower ravine route", "Finish Moore and Dryleaf Dane checks", "Defeat Romina", "Burn the sealing tree only when all quests are ready"], directions: "Take Shadow Keep's western bridge into the ruins, use the lower interior passages to cross broken spans, then descend to the Church of the Bud.", boss: "Romina, Saint of the Bud", remembrance: true, quest: "Sealing-tree point of no return", repeatInStandard: true },
  { id: "enir", act: "Shadow of the Erdtree", title: "Enir-Ilim Finale", region: "Enir-Ilim", level: "150+", upgrade: "Max weapons", blessing: "Scadutree 17–20", grace: "Divine Gate Front Staircase", x: 43, y: 23, summary: "Resolve the follower battle, finish Ansbach and Thiollier, and complete every Remembrance.", essentials: ["Defeat Leda and her allies", "Summon eligible allies for their quest rewards", "Spend remaining fragments up to the desired difficulty", "Defeat Promised Consort Radahn"], directions: "From the cleansed tower, climb Enir-Ilim's spiral streets and rooftops, pass the purification chamber, and ascend the final staircase to the Gate of Divinity.", boss: "Promised Consort Radahn", remembrance: true, quest: "DLC finale", repeatInStandard: true },
];

export const itemGuides: Record<string, string> = {
  Longsword: "Purchase from the Twin Maiden Husks after reaching Roundtable Hold.",
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
};

export const sources = [
  ["Patch 1.16.1", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-1161"],
  ["Starting origins and base stats", "https://eldenring.wiki.gg/wiki/Origin"],
  ["PvE build catalogue", "https://eip.gg/elden-ring/builds/pve/"],
  ["Shadow of the Erdtree tested builds", "https://www.pcgamer.com/games/rpg/shadow-of-the-erdtree-best-builds/"],
  ["Current build reference", "https://www.pcgamesn.com/elden-ring/builds-best"],
  ["Stance and poise mechanics", "https://eldenring.wiki.gg/wiki/Poise"],
  ["Critical attack mechanics", "https://eldenring.wiki.gg/wiki/Critical"],
  ["Realm of Shadow access", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-enter-the-realm-of-shadow"],
  ["Shadow Realm Blessings", "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-strengthen-your-character-shadow-of-the-erdtree"],
  ["Talismans and pouch slots", "https://eldenring.wiki.gg/wiki/Talismans"],
  ["Seamless Co-op progression FAQ", "https://ersc-docs.github.io/faq/"],
  ["MapGenie interactive map", "https://mapgenie.io/elden-ring"],
  ["Elden Ring progression bands", "https://eldenringprogress.com/"],
] as const;
