/** Deterministic run-planning math. This module deliberately has no UI or catalog imports. */

export const STAT_KEYS = [
  "vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane",
] as const;

export type StatKey = (typeof STAT_KEYS)[number];
export type AttributeBlock = Record<StatKey, number>;

export type Origin = {
  id: string;
  name: string;
  level: number;
  attributes: AttributeBlock;
};

const attributes = (
  vigor: number, mind: number, endurance: number, strength: number,
  dexterity: number, intelligence: number, faith: number, arcane: number,
): AttributeBlock => ({ vigor, mind, endurance, strength, dexterity, intelligence, faith, arcane });

/** The ten character origins, using their exact unmodified starting levels and attributes. */
export const ORIGINS: readonly Origin[] = [
  { id: "vagabond", name: "Vagabond", level: 9, attributes: attributes(15, 10, 11, 14, 13, 9, 9, 7) },
  { id: "warrior", name: "Warrior", level: 8, attributes: attributes(11, 12, 11, 10, 16, 10, 8, 9) },
  { id: "hero", name: "Hero", level: 7, attributes: attributes(14, 9, 12, 16, 9, 7, 8, 11) },
  { id: "bandit", name: "Bandit", level: 5, attributes: attributes(10, 11, 10, 9, 13, 9, 8, 14) },
  { id: "astrologer", name: "Astrologer", level: 6, attributes: attributes(9, 15, 9, 8, 12, 16, 7, 9) },
  { id: "prophet", name: "Prophet", level: 7, attributes: attributes(10, 14, 8, 11, 10, 7, 16, 10) },
  { id: "samurai", name: "Samurai", level: 9, attributes: attributes(12, 11, 13, 12, 15, 9, 8, 8) },
  { id: "prisoner", name: "Prisoner", level: 9, attributes: attributes(11, 12, 11, 11, 14, 14, 6, 9) },
  { id: "confessor", name: "Confessor", level: 10, attributes: attributes(10, 13, 10, 12, 12, 9, 14, 9) },
  { id: "wretch", name: "Wretch", level: 1, attributes: attributes(10, 10, 10, 10, 10, 10, 10, 10) },
] as const;

export const ORIGIN_BY_ID: Readonly<Record<string, Origin>> = Object.freeze(
  Object.fromEntries(ORIGINS.flatMap((origin) => [[origin.id, origin], [origin.name.toLowerCase(), origin]])),
);

export type OriginRecommendation = {
  origin: Origin;
  minimumLevel: number;
  investedPoints: number;
  wastedStartingPoints: number;
  finalAttributes: AttributeBlock;
};

export function recommendOrigins(
  target: Partial<AttributeBlock>,
  limit = ORIGINS.length,
): OriginRecommendation[] {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError("limit must be a positive integer");
  return ORIGINS.map((origin) => {
    const finalAttributes = { ...origin.attributes };
    let investedPoints = 0;
    let wastedStartingPoints = 0;
    for (const stat of STAT_KEYS) {
      const wanted = Math.max(1, Math.min(99, Math.floor(target[stat] ?? 1)));
      const gain = Math.max(0, wanted - origin.attributes[stat]);
      investedPoints += gain;
      wastedStartingPoints += Math.max(0, origin.attributes[stat] - wanted);
      finalAttributes[stat] += gain;
    }
    return {
      origin,
      minimumLevel: origin.level + investedPoints,
      investedPoints,
      wastedStartingPoints,
      finalAttributes,
    };
  }).sort((a, b) =>
    a.minimumLevel - b.minimumLevel
    || a.wastedStartingPoints - b.wastedStartingPoints
    || a.origin.level - b.origin.level
    || a.origin.name.localeCompare(b.origin.name)
  ).slice(0, limit);
}

export function recommendOrigin(target: Partial<AttributeBlock>): OriginRecommendation {
  return recommendOrigins(target, 1)[0];
}

/** Exact in-game rune cost for advancing from `level` to `level + 1`. */
export function runesToNextLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1 || level >= 713) {
    throw new RangeError("level must be an integer from 1 to 712");
  }
  const growth = level <= 11 ? 0 : (level - 11) * 0.02;
  return Math.floor((level + 81) ** 2 * (growth + 0.1) + 1);
}

export function runesBetweenLevels(fromLevel: number, toLevel: number): number {
  if (!Number.isInteger(fromLevel) || !Number.isInteger(toLevel)
    || fromLevel < 1 || toLevel > 713 || toLevel < fromLevel) {
    throw new RangeError("levels must be integers with 1 <= fromLevel <= toLevel <= 713");
  }
  let total = 0;
  for (let level = fromLevel; level < toLevel; level += 1) total += runesToNextLevel(level);
  return total;
}

/** Gross earnings required to retain `netRunes` after the chosen expected loss rate. */
export function lossAdjustedRuneBudget(netRunes: number, lossRate: number): number {
  if (!Number.isFinite(netRunes) || netRunes < 0) throw new RangeError("netRunes must be non-negative");
  if (!Number.isFinite(lossRate) || lossRate < 0 || lossRate >= 1) {
    throw new RangeError("lossRate must be at least 0 and less than 1");
  }
  return Math.ceil(netRunes / (1 - lossRate));
}

export type CoopMode = "standard" | "seamless";

/** Vanilla: 1.0x / 1.6x / 2.3x. Seamless defaults to +100% per extra player. */
export function bossHealthMultiplier(
  players: number,
  mode: CoopMode = "standard",
  seamlessPerExtraPlayer = 1,
): number {
  if (!Number.isInteger(players) || players < 1) throw new RangeError("players must be a positive integer");
  if (mode === "standard") return players === 1 ? 1 : players === 2 ? 1.6 : 2.3;
  if (!Number.isFinite(seamlessPerExtraPlayer) || seamlessPerExtraPlayer < 0) {
    throw new RangeError("seamlessPerExtraPlayer must be non-negative");
  }
  return 1 + (players - 1) * seamlessPerExtraPlayer;
}

/**
 * Expected boss-rune pot per player. In a normal co-op rotation each player
 * receives 75% in their own hosted clear and 25% for up to two clears as a
 * summoned cooperator. Solo and Seamless use the listed base reward.
 */
export function expectedPerPlayerBossPot(
  baseBossRunes: number,
  players: number,
  mode: CoopMode = "standard",
): number {
  if (!Number.isFinite(baseBossRunes) || baseBossRunes < 0) {
    throw new RangeError("baseBossRunes must be non-negative");
  }
  if (!Number.isInteger(players) || players < 1) throw new RangeError("players must be a positive integer");
  return mode === "seamless"
    ? baseBossRunes
    : players === 1
      ? baseBossRunes
      : Math.round(baseBossRunes * (.75 + .25 * Math.min(2, players - 1)));
}

export type OptionalRuneBoss = {
  id: string;
  chapterId: string;
  name: string;
  location: string;
  runes: number;
  difficulty: 1 | 2 | 3;
  directions: string;
};

/**
 * Optional, progression-safe rune bosses. Rewards are NG host rewards. The
 * list deliberately favours short caves, catacombs and readable field fights;
 * it excludes bosses behind later story kills and quest-hostile NPC murders.
 */
export const OPTIONAL_RUNE_BOSSES: readonly OptionalRuneBoss[] = [
  { id: "beastman-groveside", chapterId: "first-steps", name: "Beastman of Farum Azula", location: "Groveside Cave", runes: 1_000, difficulty: 1, directions: "From Church of Elleh, ride north into the woods and enter Groveside Cave beside the soldier camp. Clear the wolves, summon the Lone Wolf Ashes if wanted, then defeat the Beastman in the final cavern." },
  { id: "demihuman-chiefs", chapterId: "first-steps", name: "Demi-Human Chiefs", location: "Coastal Cave", runes: 1_200, difficulty: 1, directions: "Ride west from The First Step and drop to the beach, then enter Coastal Cave. Use a torch through the first chamber and defeat both chiefs; killing one makes the remaining demi-humans easier to control." },
  { id: "pumpkin-waypoint", chapterId: "first-steps", name: "Mad Pumpkin Head", location: "Waypoint Ruins Cellar", runes: 1_100, difficulty: 1, directions: "Ride east from Agheel Lake North to Waypoint Ruins, descend the central cellar and attack the boss from behind rather than striking its armoured head. Open the rear room afterward to meet Sellen." },
  { id: "watchdog-stormfoot", chapterId: "first-steps", name: "Erdtree Burial Watchdog", location: "Stormfoot Catacombs", runes: 1_300, difficulty: 1, directions: "From Church of Elleh, follow the cliffs north-west to the catacomb door. Pull the lever beyond the fire-pillared halls, return to the locked doors by the grace and defeat the Watchdog." },
  { id: "troll-limgrave", chapterId: "first-steps", name: "Stonedigger Troll", location: "Limgrave Tunnels", runes: 1_800, difficulty: 1, directions: "Enter Limgrave Tunnels at the north end of Agheel Lake. Ride both lifts down, collect the smithing stones on the way and use charged or strike attacks against the Troll at the bottom." },
  { id: "tibia-summonwater", chapterId: "first-steps", name: "Tibia Mariner", location: "Summonwater Village", runes: 2_400, difficulty: 1, directions: "Follow the road east from Saintsbridge into Summonwater Village. Stay mounted, strike the boat between teleports and ignore the skeletons unless they block the approach; speak to D and use the Deathroot introduction afterward." },

  { id: "miranda-tombsward", chapterId: "weeping", name: "Miranda the Blighted Bloom", location: "Tombsward Cave", runes: 2_100, difficulty: 1, directions: "From the Church of Pilgrimage ride south-west, drop to the lower path and enter Tombsward Cave. Carry Neutralizing Boluses, clear the poison flowers and use fire against Miranda." },
  { id: "scaly-morne", chapterId: "weeping", name: "Scaly Misbegotten", location: "Morne Tunnel", runes: 2_000, difficulty: 1, directions: "Enter Morne Tunnel in the ravine west of the Minor Erdtree. Work down through the miners, open the final doors and use quick attacks or guard counters against the Scaly Misbegotten." },
  { id: "shade-tombsward", chapterId: "weeping", name: "Cemetery Shade", location: "Tombsward Catacombs", runes: 2_200, difficulty: 1, directions: "Enter Tombsward Catacombs north of the Minor Erdtree, lower the flame pillar by striking it, pull the lever and return to the grace doors. Keep moving to avoid the Shade's paralysis grab." },
  { id: "runebear-earthbore", chapterId: "weeping", name: "Runebear", location: "Earthbore Cave", runes: 2_600, difficulty: 2, directions: "Enter Earthbore Cave in the northern Weeping Peninsula, cross the collapsing floor and follow the tunnel to the den. Stay tight to the bear's flank instead of retreating in a straight line." },
  { id: "night-cavalry-weeping", chapterId: "weeping", name: "Night's Cavalry", location: "Castle Morne Rampart", runes: 3_400, difficulty: 2, directions: "Rest at Castle Morne Rampart and pass time until night. Fight the rider on the road in front of the grace; keep the nearby giant out of the fight and punish after the horse charges past." },
  { id: "avatar-weeping", chapterId: "weeping", name: "Erdtree Avatar", location: "Weeping Peninsula Minor Erdtree", runes: 3_600, difficulty: 2, directions: "Approach the Minor Erdtree from the Tombsward side after completing the peninsula caves. Fight on open ground, stay behind the Avatar and sprint sideways when the golden projectiles begin." },
  { id: "deathbird-weeping", chapterId: "weeping", name: "Deathbird", location: "North-west of Castle Morne", runes: 3_900, difficulty: 2, directions: "Pass time until night, then ride to the ruins on the cliff north-west of Castle Morne. Use Sacred Blade or Holy Water Pots and attack the head after its long recovery animations." },
  { id: "zamor-weeping", chapterId: "weeping", name: "Ancient Hero of Zamor", location: "Weeping Evergaol", runes: 5_400, difficulty: 3, directions: "Use one Stonesword Key at the Weeping Evergaol east of the Fourth Church of Marika. Keep medium distance to bait the lunging slash, then punish once and retreat before frost builds." },

  { id: "assassin-deathtouched", chapterId: "stormveil", name: "Black Knife Assassin", location: "Deathtouched Catacombs", runes: 1_600, difficulty: 1, directions: "From Warmaster's Shack ride east along the northern cliff to Deathtouched Catacombs. Pull the lever above the skeleton hall and return to the grace doors; the Assassin starts injured and can be staggered." },
  { id: "duelist-murkwater", chapterId: "stormveil", name: "Grave Warden Duelist", location: "Murkwater Catacombs", runes: 1_700, difficulty: 1, directions: "Follow the stream north from Agheel Lake, enter Murkwater Catacombs and pull the lever behind the imp rooms. Circle the Duelist and punish the end of each hammer chain." },
  { id: "darriwil", chapterId: "stormveil", name: "Bloodhound Knight Darriwil", location: "Forlorn Hound Evergaol", runes: 1_900, difficulty: 2, directions: "Enter the evergaol south of Agheel Lake South. If Blaidd's Mistwood howl steps were completed, use his gold summon sign inside; otherwise dodge through Darriwil's sweeping attacks and punish the landing." },
  { id: "crucible-stormhill", chapterId: "stormveil", name: "Crucible Knight", location: "Stormhill Evergaol", runes: 2_100, difficulty: 3, directions: "Enter the evergaol south of Stormhill Shack after the easier Limgrave bosses. Stay close, dodge toward the shield side and take only one punish after each combo; jump over the phase-two tail sweep." },
  { id: "night-cavalry-limgrave", chapterId: "stormveil", name: "Night's Cavalry", location: "Agheel Lake North bridge", runes: 2_400, difficulty: 2, directions: "At night, clear the soldiers from the bridge south-east of Agheel Lake North, then draw the rider onto the open road. Attack after its glaive sweep or dismount it with repeated heavy attacks." },
  { id: "deathbird-limgrave", chapterId: "stormveil", name: "Deathbird", location: "East of Warmaster's Shack", runes: 2_800, difficulty: 2, directions: "Pass time until night at Warmaster's Shack and ride east to the stone ruins. Trigger the bird away from the trolls and use Sacred Blade or Holy Water Pots against its head." },
  { id: "tree-sentinel", chapterId: "stormveil", name: "Tree Sentinel", location: "Church of Elleh road", runes: 3_200, difficulty: 2, directions: "Return to the road between The First Step and Church of Elleh once the party has upgraded weapons. Fight mounted in the open field and punish after the halberd slam rather than trading into the shield." },
  { id: "agheel", chapterId: "stormveil", name: "Flying Dragon Agheel", location: "Agheel Lake", runes: 5_000, difficulty: 3, directions: "Approach the burning camp in Agheel Lake to trigger the dragon. Stay mounted, strike a leg after grounded attacks and sprint sideways—not backward—when Agheel takes off to breathe fire." },

  { id: "spiritcaller-roads-end", chapterId: "liurnia-south", name: "Spiritcaller Snail", location: "Road's End Catacombs", runes: 3_000, difficulty: 1, directions: "Follow the western Liurnia cliff north of the Converted Tower to Road's End Catacombs. Strike the illusory walls, pull the lever, then ignore the summoned knight and search the arena edges for the glowing Snail." },
  { id: "cleanrot-stillwater", chapterId: "liurnia-south", name: "Cleanrot Knight", location: "Stillwater Cave", runes: 3_300, difficulty: 1, directions: "Enter Stillwater Cave below the Lake-Facing Cliffs. Bring Preserving Boluses, keep to the dry ledges and use a Spirit Ash to split the Knight's attention in the poison arena." },
  { id: "adan", chapterId: "liurnia-south", name: "Adan, Thief of Fire", location: "Malefactor's Evergaol", runes: 3_800, difficulty: 2, directions: "Ride west from Liurnia Lake Shore to the evergaol above the cliff. Interrupt Adan's healing flask and roll through Flame of the Fell God before closing in." },
  { id: "bols", chapterId: "liurnia-south", name: "Bols, Carian Knight", location: "Cuckoo's Evergaol", runes: 4_600, difficulty: 2, directions: "Reach Cuckoo's Evergaol on the western Liurnia shore. Stay beneath the troll's sword arm, leave the magic phalanx before it fires, then return for a charged attack after each slam." },
  { id: "tibia-liurnia", chapterId: "academy", name: "Tibia Mariner", location: "East Liurnia", runes: 4_700, difficulty: 1, directions: "From Artist's Shack follow the eastern road north to the flooded graves. Fight mounted, follow each teleport and ignore the skeletons unless they prevent a clean hit on the boat." },
  { id: "night-cavalry-liurnia", chapterId: "academy", name: "Night's Cavalry", location: "Gate Town Bridge", runes: 5_600, difficulty: 2, directions: "Pass time until night at Gate Town Bridge and ride south-east down the road. Draw the rider away from other enemies and punish the recovery after its glaive charge." },
  { id: "avatar-liurnia", chapterId: "caria", name: "Erdtree Avatar", location: "South-west Liurnia Minor Erdtree", runes: 5_800, difficulty: 2, directions: "Ride to the Minor Erdtree west of the Converted Tower. Stay behind the Avatar, avoid fighting on the broken ground and sprint sideways through the golden projectile sequence." },

  { id: "pumpkin-caelem", chapterId: "caelid", name: "Mad Pumpkin Head duo", location: "Caelem Ruins", runes: 6_300, difficulty: 1, directions: "Descend the cellar at Caelem Ruins. Rush the sleeping hammer wielder first to turn the fight into a one-on-one, then attack both enemies from behind to avoid the armoured heads." },
  { id: "magma-gael", chapterId: "caelid", name: "Magma Wyrm", location: "Gael Tunnel", runes: 7_500, difficulty: 2, directions: "Enter Gael Tunnel from northern Limgrave for the grace, then use the Caelid entrance for the boss route. Stay beside the rear legs and move away whenever magma pools block the floor." },
  { id: "hugues", chapterId: "caelid", name: "Battlemage Hugues", location: "Sellia Evergaol", runes: 7_800, difficulty: 2, directions: "After lighting Sellia's three rooftop braziers, ride south-west to Sellia Evergaol. Rush Hugues during long spell casts and retreat when the Haima hammer appears." },
  { id: "oneil", chapterId: "caelid", name: "Commander O'Neil", location: "Swamp of Aeonia", runes: 12_000, difficulty: 2, directions: "Ride into the eastern Swamp of Aeonia and fight from Torrent. Remove the summoned soldiers first, then circle O'Neil and punish the end of his slow halberd strings while avoiding the scarlet-rot wind." },
  { id: "putrid-avatar-caelid", chapterId: "caelid", name: "Putrid Avatar", location: "West Caelid Minor Erdtree", runes: 9_600, difficulty: 3, directions: "Approach the Minor Erdtree north-east of Smoldering Church only during the Caelid chapter. Stay behind the Avatar, disengage from the scarlet-rot slam and sprint sideways through its golden bolts." },
  { id: "greyoll", chapterId: "caelid", name: "Elder Dragon Greyoll", location: "Dragonbarrow", runes: 50_000, difficulty: 2, directions: "Use the Bestial Sanctum waygate, ride south to Fort Faroth and attack Greyoll's tail from the Site-of-Grace side where the smaller dragons do not reach. Use a bleed weapon to shorten the large health pool; spend the reward immediately at the grace." },

  { id: "troll-old-altus", chapterId: "altus", name: "Stonedigger Troll", location: "Old Altus Tunnel", runes: 9_600, difficulty: 1, directions: "Use two Stonesword Keys at Old Altus Tunnel north of Erdtree-Gazing Hill. Take the lifts to the bottom, clear the explosive-barrel rooms and use strike damage against the Troll." },
  { id: "tibia-wyndham", chapterId: "altus", name: "Tibia Mariner", location: "Wyndham Ruins", runes: 14_000, difficulty: 2, directions: "Ride north from Erdtree-Gazing Hill into Wyndham Ruins. Stay mounted, keep the boat between you and the summoned giant skeleton and close in after each teleport." },
] as const;

export function selectOptionalRuneBosses(
  shortfall: number,
  chapterId: string,
  players: number,
  mode: CoopMode,
): { bosses: OptionalRuneBoss[]; perPlayerRunes: number } {
  if (!Number.isFinite(shortfall) || shortfall <= 0) return { bosses: [], perPlayerRunes: 0 };
  const candidates = OPTIONAL_RUNE_BOSSES
    .filter((boss) => boss.chapterId === chapterId)
    .sort((a, b) => a.difficulty - b.difficulty || b.runes - a.runes || a.name.localeCompare(b.name));
  const bosses: OptionalRuneBoss[] = [];
  let perPlayerRunes = 0;
  for (const boss of candidates) {
    if (perPlayerRunes >= shortfall) break;
    bosses.push(boss);
    perPlayerRunes += expectedPerPlayerBossPot(boss.runes, players, mode);
  }
  return { bosses, perPlayerRunes };
}

export type UpgradePath = "standard" | "somber";
export type UpgradeMaterial = {
  name: string;
  tier: number | "ancient";
  quantity: number;
  purchasable: boolean;
  purchaseRunes: number | null;
};
export type UpgradePlan = {
  path: UpgradePath;
  fromLevel: number;
  toLevel: number;
  materials: UpgradeMaterial[];
  materialPurchaseRunes: number;
  reinforcementRunes: number | null;
  knownRuneTotal: number;
  hasUnknownServiceCost: boolean;
  unpricedMaterials: readonly string[];
};

const STANDARD_STONE_PRICES = [0, 200, 400, 600, 900, 1200, 1500, 2400, 3600] as const;
const SOMBER_STONE_PRICES = [0, 2000, 3000, 4000, 6000, 9000, 12000, 16000, 20000, 25000] as const;

export function planWeaponUpgrade(
  path: UpgradePath,
  fromLevel: number,
  toLevel: number,
  serviceRuneCosts?: Readonly<Partial<Record<number, number>>>,
): UpgradePlan {
  const maximum = path === "standard" ? 25 : 10;
  if (!Number.isInteger(fromLevel) || !Number.isInteger(toLevel)
    || fromLevel < 0 || toLevel > maximum || toLevel < fromLevel) {
    throw new RangeError(`upgrade levels must satisfy 0 <= fromLevel <= toLevel <= ${maximum}`);
  }
  const grouped = new Map<string, UpgradeMaterial>();
  let materialPurchaseRunes = 0;
  let reinforcementRunes = 0;
  let hasUnknownServiceCost = false;
  for (let resultingLevel = fromLevel + 1; resultingLevel <= toLevel; resultingLevel += 1) {
    const ancient = resultingLevel === maximum;
    const tier = ancient ? "ancient" : path === "standard" ? Math.ceil(resultingLevel / 3) : resultingLevel;
    const quantity = path === "standard" && !ancient ? [2, 4, 6][(resultingLevel - 1) % 3] : 1;
    const price = ancient ? null : path === "standard"
      ? STANDARD_STONE_PRICES[tier as number]
      : SOMBER_STONE_PRICES[tier as number];
    const name = ancient
      ? path === "standard" ? "Ancient Dragon Smithing Stone" : "Somber Ancient Dragon Smithing Stone"
      : path === "standard" ? `Smithing Stone [${tier}]` : `Somber Smithing Stone [${tier}]`;
    const prior = grouped.get(name);
    grouped.set(name, {
      name,
      tier,
      quantity: (prior?.quantity ?? 0) + quantity,
      purchasable: !ancient,
      purchaseRunes: price === null ? null : (prior?.purchaseRunes ?? 0) + price * quantity,
    });
    if (price !== null) materialPurchaseRunes += price * quantity;
    const service = serviceRuneCosts?.[resultingLevel];
    if (service === undefined) hasUnknownServiceCost = true;
    else if (!Number.isFinite(service) || service < 0) throw new RangeError("service rune costs must be non-negative");
    else reinforcementRunes += service;
  }
  const materials = [...grouped.values()];
  const unpricedMaterials = materials.filter((item) => item.purchaseRunes === null).map((item) => item.name);
  return {
    path, fromLevel, toLevel, materials, materialPurchaseRunes,
    reinforcementRunes: hasUnknownServiceCost ? null : reinforcementRunes,
    knownRuneTotal: materialPurchaseRunes + reinforcementRunes,
    hasUnknownServiceCost,
    unpricedMaterials,
  };
}

export type ChapterEconomy = {
  chapterId: string;
  targetRuneLevel: number;
  standardUpgradeTarget: number;
  somberUpgradeTarget: number;
  lossRate: number;
  /** Conservative/comfortable rune pickups from traversal and ordinary enemies. */
  fieldRunesLow: number;
  fieldRunesHigh: number;
  /** Listed chapter boss rewards before co-op rotation adjustment. */
  bossRunes: number;
  /** Runes intentionally left uncommitted for merchants, arrows and consumables. */
  purchaseReserve: number;
  levelingRunesFromPrevious: number;
  standardMaterialRunesFromPrevious: number;
  somberMaterialRunesFromPrevious: number;
  netPlanningRunes: number;
  grossLossAdjustedRunes: number;
};

const CHAPTER_TARGETS = [
  ["first-steps", 15, 2, 1, .12], ["weeping", 30, 5, 2, .12], ["stormveil", 40, 7, 3, .12],
  ["liurnia-south", 50, 10, 4, .10], ["academy", 60, 12, 5, .10], ["caria", 65, 13, 5, .10],
  ["caelid", 70, 15, 6, .10], ["nokron", 80, 18, 6, .10], ["altus", 90, 19, 7, .10],
  ["gelmir", 95, 20, 7, .08], ["leyndell", 105, 22, 8, .08], ["ainsel", 110, 22, 8, .08],
  ["deeproot", 110, 22, 8, .08], ["mountaintops", 120, 24, 9, .08], ["rykard", 125, 24, 9, .08],
  ["haligtree", 135, 25, 10, .08], ["mohgwyn", 140, 25, 10, .08], ["farum", 145, 25, 10, .08],
  ["ashen", 150, 25, 10, .08], ["gravesite", 150, 25, 10, .06], ["ensiss", 152, 25, 10, .06],
  ["fissure", 154, 25, 10, .06], ["shadow-keep", 156, 25, 10, .06], ["gaius-avatar", 158, 25, 10, .06],
  ["jagged", 160, 25, 10, .06], ["abyss", 162, 25, 10, .06], ["metyr", 164, 25, 10, .06],
  ["messmer", 166, 25, 10, .06], ["rauh", 168, 25, 10, .06], ["enir", 170, 25, 10, .06],
] as const;

// Route-income planning bands. Boss totals use the chapter's principal encounters;
// field bands are deliberately conservative because enemy farming and deaths vary.
const CHAPTER_INCOME: Readonly<Record<string, readonly [number, number, number, number]>> = {
  "first-steps": [6_000, 12_000, 4_200, 5_000],
  weeping: [12_000, 24_000, 18_000, 7_500],
  stormveil: [18_000, 32_000, 32_000, 8_000],
  "liurnia-south": [24_000, 45_000, 28_000, 10_000],
  academy: [28_000, 50_000, 54_000, 12_000],
  caria: [24_000, 42_000, 22_000, 10_000],
  caelid: [45_000, 80_000, 100_000, 15_000],
  nokron: [35_000, 65_000, 64_000, 12_000],
  altus: [55_000, 95_000, 80_000, 18_000],
  gelmir: [45_000, 80_000, 65_000, 15_000],
  leyndell: [65_000, 110_000, 200_000, 20_000],
  ainsel: [45_000, 80_000, 92_000, 15_000],
  deeproot: [45_000, 75_000, 130_000, 15_000],
  mountaintops: [75_000, 130_000, 270_000, 25_000],
  rykard: [35_000, 60_000, 130_000, 15_000],
  haligtree: [110_000, 190_000, 680_000, 30_000],
  mohgwyn: [90_000, 160_000, 420_000, 25_000],
  farum: [100_000, 175_000, 670_000, 30_000],
  ashen: [55_000, 90_000, 950_000, 25_000],
  gravesite: [90_000, 150_000, 120_000, 30_000],
  ensiss: [70_000, 120_000, 240_000, 25_000],
  fissure: [80_000, 135_000, 200_000, 25_000],
  "shadow-keep": [120_000, 200_000, 200_000, 35_000],
  "gaius-avatar": [85_000, 145_000, 490_000, 30_000],
  jagged: [100_000, 170_000, 490_000, 30_000],
  abyss: [100_000, 170_000, 410_000, 30_000],
  metyr: [85_000, 145_000, 420_000, 30_000],
  messmer: [90_000, 155_000, 400_000, 30_000],
  rauh: [110_000, 185_000, 380_000, 35_000],
  enir: [125_000, 210_000, 500_000, 40_000],
};

export const CHAPTER_ECONOMY: readonly ChapterEconomy[] = CHAPTER_TARGETS.map((row, index) => {
  const [chapterId, targetRuneLevel, standardUpgradeTarget, somberUpgradeTarget, lossRate] = row;
  const previous = CHAPTER_TARGETS[index - 1];
  const previousLevel = previous?.[1] ?? 1;
  const previousStandard = previous?.[2] ?? 0;
  const previousSomber = previous?.[3] ?? 0;
  const levelingRunesFromPrevious = runesBetweenLevels(previousLevel, targetRuneLevel);
  const standardMaterialRunesFromPrevious = planWeaponUpgrade("standard", previousStandard, standardUpgradeTarget).materialPurchaseRunes;
  const somberMaterialRunesFromPrevious = planWeaponUpgrade("somber", previousSomber, somberUpgradeTarget).materialPurchaseRunes;
  const [fieldRunesLow, fieldRunesHigh, bossRunes, purchaseReserve] = CHAPTER_INCOME[chapterId];
  // A character follows one weapon path; budget the costlier path instead of double-counting both.
  const netPlanningRunes = levelingRunesFromPrevious
    + Math.max(standardMaterialRunesFromPrevious, somberMaterialRunesFromPrevious);
  return {
    chapterId, targetRuneLevel, standardUpgradeTarget, somberUpgradeTarget, lossRate,
    fieldRunesLow, fieldRunesHigh, bossRunes, purchaseReserve,
    levelingRunesFromPrevious, standardMaterialRunesFromPrevious, somberMaterialRunesFromPrevious,
    netPlanningRunes, grossLossAdjustedRunes: lossAdjustedRuneBudget(netPlanningRunes, lossRate),
  };
});

export const CHAPTER_ECONOMY_BY_ID: Readonly<Record<string, ChapterEconomy>> = Object.freeze(
  Object.fromEntries(CHAPTER_ECONOMY.map((chapter) => [chapter.chapterId, chapter])),
);

/** Exact maximum equip load table from the Endurance stat table (END 1-99). */
const EQUIP_LOAD_VALUES = [
  45,45,45,45,45,45,45,45,46.6,48.2,49.8,51.4,52.9,54.5,56.1,57.7,59.3,60.9,62.5,64.1,
  65.6,67.2,68.8,70.4,72,73,74.1,75.2,76.4,77.6,78.9,80.2,81.5,82.8,84.1,85.4,86.8,88.1,
  89.5,90.9,92.3,93.7,95.1,96.5,97.9,99.4,100.8,102.2,103.7,105.2,106.6,108.1,109.6,111,
  112.5,114,115.5,117,118.5,120,121,122.1,123.1,124.1,125.1,126.2,127.2,128.2,129.2,130.3,
  131.3,132.3,133.3,134.4,135.4,136.4,137.4,138.5,139.5,140.5,141.5,142.6,143.6,144.6,145.6,
  146.7,147.7,148.7,149.7,150.8,151.8,152.8,153.8,154.9,155.9,156.9,157.9,159,160,
] as const;

export const EQUIP_LOAD_BY_ENDURANCE: Readonly<Record<number, number>> = Object.freeze(
  Object.fromEntries(EQUIP_LOAD_VALUES.map((load, index) => [index + 1, load])),
);

export type EquipLoadTier = "light" | "medium" | "heavy" | "overloaded";
export type EquipLoadModifiers = {
  arsenal?: "none" | "arsenal" | "arsenal+1" | "great-jar";
  erdtree?: "none" | "favor" | "favor+1" | "favor+2";
  enduranceBonus?: number;
};

const ARSENAL_MULTIPLIER = { none: 1, arsenal: 1.15, "arsenal+1": 1.17, "great-jar": 1.19 } as const;
const ERDTREE_MULTIPLIER = { none: 1, favor: 1.05, "favor+1": 1.065, "favor+2": 1.08 } as const;

export function maxEquipLoad(endurance: number, modifiers: EquipLoadModifiers = {}): number {
  if (!Number.isFinite(endurance)) throw new RangeError("endurance must be finite");
  const effective = Math.max(1, Math.min(99, Math.floor(endurance + (modifiers.enduranceBonus ?? 0))));
  const base = EQUIP_LOAD_BY_ENDURANCE[effective];
  return Number((base
    * ARSENAL_MULTIPLIER[modifiers.arsenal ?? "none"]
    * ERDTREE_MULTIPLIER[modifiers.erdtree ?? "none"]).toFixed(3));
}

export function equipLoadTier(currentWeight: number, maximumLoad: number): EquipLoadTier {
  if (!Number.isFinite(currentWeight) || currentWeight < 0 || !Number.isFinite(maximumLoad) || maximumLoad <= 0) {
    throw new RangeError("weight must be non-negative and maximumLoad must be positive");
  }
  const ratio = currentWeight / maximumLoad;
  return ratio < .3 ? "light" : ratio < .7 ? "medium" : ratio < 1 ? "heavy" : "overloaded";
}

export function maxWeightForTier(maximumLoad: number, tier: Exclude<EquipLoadTier, "overloaded">): number {
  if (!Number.isFinite(maximumLoad) || maximumLoad <= 0) throw new RangeError("maximumLoad must be positive");
  if (tier === "light") return maximumLoad * .3;
  if (tier === "medium") return maximumLoad * .7;
  return maximumLoad;
}

export type BuildPlanningProfile = {
  id: string;
  name?: string;
  stats: string;
  tags?: readonly string[];
  role?: string;
  playstyle?: string;
  mechanic?: string;
  startingClass?: string;
};

export type BuildStatTarget = {
  buildId: string;
  targetRuneLevel: number;
  origin: Origin;
  attributes: AttributeBlock;
  priorities: readonly StatKey[];
  notes: readonly string[];
};

function buildPriorities(build: BuildPlanningProfile): StatKey[] {
  const text = `${build.stats} ${build.tags?.join(" ") ?? ""} ${build.role ?? ""} ${build.playstyle ?? ""} ${build.mechanic ?? ""}`.toLowerCase();
  const found: StatKey[] = [];
  const checks: [RegExp, StatKey][] = [
    [/\bstr(?:ength)?\b/, "strength"], [/\bdex(?:terity)?\b/, "dexterity"],
    [/\bint(?:elligence)?\b|sorcer|spell/, "intelligence"], [/\bfai(?:th)?\b|incant/, "faith"],
    [/\barc(?:ane)?\b|bleed|occult|poison/, "arcane"],
  ];
  for (const [pattern, stat] of checks) if (pattern.test(text)) found.push(stat);
  if (!found.length) found.push("strength", "dexterity");
  return found;
}

function desiredVigor(level: number): number {
  return level <= 25 ? 20 : level <= 40 ? 25 : level <= 60 ? 35 : level <= 90 ? 40 : level <= 125 ? 50 : 60;
}

export function planBuildStatTarget(
  build: BuildPlanningProfile,
  targetRuneLevel: number,
  exactRequirements: Partial<AttributeBlock> = {},
): BuildStatTarget {
  if (!Number.isInteger(targetRuneLevel) || targetRuneLevel < 1 || targetRuneLevel > 713) {
    throw new RangeError("targetRuneLevel must be an integer from 1 to 713");
  }
  const priorities = buildPriorities(build);
  const text = `${build.stats} ${build.tags?.join(" ") ?? ""} ${build.role ?? ""} ${build.playstyle ?? ""}`.toLowerCase();
  const caster = /\bcaster\b|\bsorcer|\bspell|\bincant|\bmage\b|\bmagic\b/.test(text) || priorities.includes("intelligence") || priorities.includes("faith");
  const heavy = /heavy|guard|shield|tank|colossal|great hammer/.test(text) || priorities.includes("strength");
  for (const [stat, value] of Object.entries(exactRequirements)) {
    if (!STAT_KEYS.includes(stat as StatKey) || !Number.isInteger(value) || value < 1 || value > 99) {
      throw new RangeError("exact requirements must be integer attributes from 1 to 99");
    }
  }
  const requirement: Partial<AttributeBlock> = { vigor: Math.min(25, desiredVigor(targetRuneLevel)) };
  for (const stat of priorities) requirement[stat] = targetRuneLevel < 40 ? 16 : 20;
  if (caster) requirement.mind = 16;
  if (heavy) requirement.endurance = 15;
  for (const stat of STAT_KEYS) {
    const exact = exactRequirements[stat];
    if (exact !== undefined) requirement[stat] = Math.max(requirement[stat] ?? 1, exact);
  }

  const namedOrigin = build.startingClass && build.startingClass !== "Not specified"
    ? ORIGIN_BY_ID[build.startingClass.toLowerCase()] : undefined;
  const origin = namedOrigin && namedOrigin.level <= targetRuneLevel
    ? namedOrigin : recommendOrigins(requirement).find((item) => item.origin.level <= targetRuneLevel)?.origin ?? ORIGIN_BY_ID.wretch;
  const result = { ...origin.attributes };
  let points = targetRuneLevel - origin.level;
  // Hard equipment/spell requirements are always funded before route soft-cap goals.
  for (const stat of STAT_KEYS) {
    const target = exactRequirements[stat] ?? 0;
    while (points > 0 && result[stat] < target) {
      result[stat] += 1;
      points -= 1;
    }
  }
  const unmetRequirements = STAT_KEYS.filter((stat) => result[stat] < (exactRequirements[stat] ?? 0));
  const damageGoal = targetRuneLevel >= 150 ? (priorities.length === 1 ? 60 : 50)
    : targetRuneLevel >= 100 ? (priorities.length === 1 ? 50 : 40)
    : targetRuneLevel >= 60 ? (priorities.length === 1 ? 40 : 32)
    : targetRuneLevel >= 40 ? 25 : 18;
  const goals: Partial<AttributeBlock> = {
    vigor: desiredVigor(targetRuneLevel),
    mind: caster ? (targetRuneLevel >= 150 ? 32 : targetRuneLevel >= 90 ? 26 : targetRuneLevel >= 50 ? 22 : 18) : 14,
    endurance: heavy ? (targetRuneLevel >= 150 ? 35 : targetRuneLevel >= 90 ? 28 : 20)
      : targetRuneLevel >= 150 ? 25 : targetRuneLevel >= 60 ? 20 : 15,
  };
  for (const stat of priorities) goals[stat] = damageGoal;

  const goalOrder = ["vigor", ...priorities, ...(caster ? ["mind"] as const : []), "endurance"] as StatKey[];
  while (points > 0) {
    const candidates = goalOrder.filter((stat) => result[stat] < (goals[stat] ?? result[stat]));
    if (!candidates.length) break;
    candidates.sort((a, b) => {
      const aDeficit = ((goals[a] ?? 0) - result[a]) / (goals[a] ?? 1);
      const bDeficit = ((goals[b] ?? 0) - result[b]) / (goals[b] ?? 1);
      return bDeficit - aDeficit || goalOrder.indexOf(a) - goalOrder.indexOf(b);
    });
    result[candidates[0]] += 1;
    points -= 1;
  }
  const weighted: StatKey[] = [
    ...priorities, ...priorities, ...priorities, "vigor", "vigor",
    ...(caster ? ["mind"] as StatKey[] : []), "endurance",
  ];
  const caps: AttributeBlock = attributes(60, 38, 50, 80, 80, 80, 80, 80);
  let cursor = 0;
  while (points > 0) {
    const available = weighted.filter((stat) => result[stat] < caps[stat]);
    const fallback = STAT_KEYS.find((stat) => result[stat] < 99);
    const stat = available.length ? available[cursor % available.length] : fallback;
    if (!stat) break;
    result[stat] += 1;
    points -= 1;
    cursor += 1;
  }
  return {
    buildId: build.id,
    targetRuneLevel,
    origin,
    attributes: result,
    priorities,
    notes: [
      `Exact RL${targetRuneLevel} allocation from ${origin.name}.`,
      ...(unmetRequirements.length
        ? [`RL${targetRuneLevel} is too low to meet: ${unmetRequirements.join(", ")}.`]
        : Object.keys(exactRequirements).length ? ["Exact equipment requirements were funded before soft-cap goals."] : []),
      "Targets are route-planning defaults; meet weapon and spell requirements before damage soft caps.",
    ],
  };
}

export type SoresealAdviceInput = {
  baseStats: AttributeBlock;
  requiredStats?: Partial<Pick<AttributeBlock, "strength" | "dexterity" | "endurance">>;
  targetLevel: number;
  phase?: "early" | "mid" | "late" | "dlc";
  alreadyEquipped?: boolean;
};

export type SoresealAdvice = {
  status: "use" | "optional" | "retire" | "not-needed";
  recommended: boolean;
  effectiveStats: AttributeBlock;
  bridgedRequirements: readonly ("strength" | "dexterity" | "endurance")[];
  savedLevels: number;
  damageTakenMultiplier: 1.15;
  weight: 0.8;
  acquisition: string;
  reasons: readonly string[];
};

export function radagonSoresealBridgeAdvice(input: SoresealAdviceInput): SoresealAdvice {
  if (!Number.isInteger(input.targetLevel) || input.targetLevel < 1 || input.targetLevel > 713) {
    throw new RangeError("targetLevel must be an integer from 1 to 713");
  }
  const effectiveStats = { ...input.baseStats };
  for (const stat of ["vigor", "endurance", "strength", "dexterity"] as const) effectiveStats[stat] += 5;
  const bridgedRequirements: ("strength" | "dexterity" | "endurance")[] = [];
  let savedLevels = 0;
  for (const stat of ["strength", "dexterity", "endurance"] as const) {
    const required = input.requiredStats?.[stat];
    if (required !== undefined && input.baseStats[stat] < required && effectiveStats[stat] >= required) {
      bridgedRequirements.push(stat);
      savedLevels += required - input.baseStats[stat];
    }
  }
  const earlyWindow = input.targetLevel <= 60 && input.phase !== "late" && input.phase !== "dlc";
  const optionalWindow = input.targetLevel <= 80 && input.phase !== "dlc";
  const status = bridgedRequirements.length && earlyWindow ? "use"
    : bridgedRequirements.length && optionalWindow ? "optional"
    : input.alreadyEquipped ? "retire" : "not-needed";
  return {
    status,
    recommended: status === "use",
    effectiveStats,
    bridgedRequirements,
    savedLevels,
    damageTakenMultiplier: 1.15,
    weight: .8,
    acquisition: "Fort Faroth in Dragonbarrow; it can be collected without defeating a boss.",
    reasons: status === "use"
      ? [`Bridges ${bridgedRequirements.join(" and ")} now, saving ${savedLevels} early levels.`, "Retire it when the base requirements are met or around RL80; its 15% extra damage taken scales poorly later."]
      : status === "optional"
        ? ["It still bridges a requirement, but the 15% damage-taken penalty makes it a short-term choice."]
        : ["It no longer bridges a requirement efficiently; use a defensive or damage talisman instead."],
  };
}
