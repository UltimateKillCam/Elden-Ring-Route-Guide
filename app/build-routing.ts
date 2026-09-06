import { chapters, recommendStartingClass, stageLoadout, type Build, type Chapter, type PhaseKey, type StageLoadout } from "./data";
import { PHASE_START, pickupGate } from "./progression";
import { findWeaponUpgradeRecords } from "./weapon-upgrades";

const phases: PhaseKey[] = ["early", "mid", "late", "dlc"];
const chapterIndex = new Map(chapters.map((chapter, index) => [chapter.id, index]));
const startingWeapons: Record<string, [string, string]> = {
  Vagabond: ["Longsword", "Square Off (default skill)"], Warrior: ["Scimitar", "Spinning Slash (default skill)"],
  Hero: ["Battle Axe", "Wild Strikes (default skill)"], Bandit: ["Great Knife", "Quickstep (default skill)"],
  Astrologer: ["Astrologer's Staff", "No Skill"], Prophet: ["Finger Seal", "No Skill"],
  Samurai: ["Uchigatana", "Unsheathe (default skill)"], Prisoner: ["Estoc", "Impaling Thrust (default skill)"],
  Confessor: ["Broadsword", "Square Off (default skill)"], Wretch: ["Club", "Barbaric Roar (default skill)"],
  "Idus Knight": ["Idus Sword", "Impaling Thrust (default skill)"], "Heavy Knight": ["Hefty Scimitar", "Spinning Slash (default skill)"],
};

export function phaseAtChapter(chapter: Chapter): PhaseKey {
  const index = chapterIndex.get(chapter.id) ?? 0;
  return [...phases].reverse().find((phase) => index >= chapterIndex.get(PHASE_START[phase])!) || "early";
}

function weaponReadyAt(loadout: StageLoadout, phase: PhaseKey, origin: string) {
  const records = findWeaponUpgradeRecords(loadout.weapon);
  if (!records.length) return chapterIndex.get(PHASE_START[phase])!;
  const gates = records.map((record) => pickupGate(record.name, { categoryPattern: /weapon|shield/i, preferredLayer: phase === "dlc" ? "shadow" : undefined }));
  // Unknown location is not evidence of early access. Keep the source phase
  // until a verified acquisition gate exists for every equipped armament.
  return Math.max(...gates.map((gate, index) => records[index].name === startingWeapons[origin]?.[0] ? 0 : gate ? chapterIndex.get(gate.chapterId)! : chapterIndex.get(PHASE_START[phase])!));
}

const routeCache = new WeakMap<Build, Map<string, StageLoadout>>();

/** One weapon schedule shared by the equipment timeline, upgrade budget and route. */
export function routeLoadout(build: Build, chapter: Chapter): StageLoadout {
  let plan = routeCache.get(build);
  if (!plan) {
    plan = new Map();
    const stages = phases.map((phase) => ({ phase, loadout: stageLoadout(build, phase) }));
    const origin = build.startingClass === "Not specified" ? recommendStartingClass(build.stats, build.tags) : build.startingClass;
    const candidates = stages.map((stage) => ({ ...stage, readyAt: weaponReadyAt(stage.loadout, stage.phase, origin) }));
    const [startingWeapon, startingSkill] = startingWeapons[origin] || startingWeapons.Vagabond;
    let previousWeapon = startingWeapon;
    let previousSkill = startingSkill;
    chapters.forEach((current, index) => {
      const phase = phaseAtChapter(current);
      const stage = stages.find((candidate) => candidate.phase === phase)!.loadout;
      const eligible = candidates.filter((candidate) => candidate.readyAt <= index &&
        // Inferred bridge stages are alternatives, not additional purchases.
        // Keep the first weapon lane until the actual published weapon unlocks.
        (candidate.phase === "early" || candidate.loadout.sourceUse !== "temporary-stage") &&
        // Explicit curated milestones describe a planned progression, not a rush.
        (build.collection !== "Curated" || phases.indexOf(candidate.phase) <= phases.indexOf(phase)));
      const chosen = eligible.at(-1);
      if (chosen) {
        previousWeapon = chosen.loadout.weapon;
        previousSkill = chosen.loadout.skill;
      }
      plan!.set(current.id, { ...stage, weapon: previousWeapon, skill: previousSkill,
        borrowedFrom: chosen ? chosen.loadout.borrowedFrom : stage.borrowedFrom });
    });
    routeCache.set(build, plan);
  }
  return plan.get(chapter.id)!;
}

const usefulWeaponCache = new WeakMap<Build, Set<string>>();
export function sameWeaponUpgradeTrack(left: string, right: string) {
  const names = (value: string) => findWeaponUpgradeRecords(value).map((weapon) => weapon.name).join("|");
  const a = names(left);
  return Boolean(a && a === names(right));
}

const transitionCache = new WeakMap<Build, { chapter: Chapter; weapon: string }[]>();

/** The short catalogue preview uses the exact same schedule as the route. */
export function weaponTransitions(build: Build) {
  const cached = transitionCache.get(build);
  if (cached) return cached;
  const result: { chapter: Chapter; weapon: string }[] = [];
  for (const chapter of chapters) {
    const weapon = routeLoadout(build, chapter).weapon;
    if (result.at(-1)?.weapon !== weapon) result.push({ chapter, weapon });
  }
  transitionCache.set(build, result);
  return result;
}

export function isRoutedWeapon(build: Build, item: string) {
  let names = usefulWeaponCache.get(build);
  if (!names) {
    names = new Set(chapters.flatMap((chapter) => findWeaponUpgradeRecords(routeLoadout(build, chapter).weapon).map((weapon) => weapon.name)));
    usefulWeaponCache.set(build, names);
  }
  const records = findWeaponUpgradeRecords(item);
  return !records.length || records.some((record) => names!.has(record.name));
}

/** Upgraded variants replace their lower tier; they do not occupy another pouch. */
export function compatibleTalismans(items: string[]) {
  const families = new Map<string, { name: string; rank: number }>();
  for (const item of items) {
    const name = item.normalize("NFKD").replace(/[’‘]/g, "'").toLowerCase();
    const family = /(?:rotten )?winged sword insignia/.test(name) ? "winged insignia"
      : /(?:two-headed |green )turtle talisman/.test(name) ? "turtle"
      : /dragoncrest (?:greatshield|shield) talisman/.test(name) ? "dragoncrest"
      : /warrior jar shard|shard of alexander/.test(name) ? "alexander"
      : name.replace(/\s*\+\d+$/, "").trim();
    const rank = /rotten winged|two-headed turtle|shard of alexander/.test(name) ? 1
      : /dragoncrest greatshield/.test(name) ? 3 : Number(name.match(/\+(\d+)$/)?.[1] || 0);
    const current = families.get(family);
    if (!current || rank > current.rank) families.set(family, { name: item, rank });
  }
  return [...families.values()].map((item) => item.name);
}
