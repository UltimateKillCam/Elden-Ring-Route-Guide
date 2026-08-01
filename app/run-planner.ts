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
 * Expected boss-rune pot per player. Standard assumes the group rotates each
 * world: 75% of the host reward baseline plus 25% for up to two co-op clears.
 * Seamless shares one persistent-world clear, so each player's planning pot is B.
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
    : Math.round(baseBossRunes * (.75 + .25 * Math.min(2, players - 1)));
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
