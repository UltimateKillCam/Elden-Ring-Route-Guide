import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAPTER_ECONOMY,
  EQUIP_LOAD_BY_ENDURANCE,
  ORIGINS,
  bossHealthMultiplier,
  equipLoadTier,
  expectedPerPlayerBossPot,
  lossAdjustedRuneBudget,
  planBuildStatTarget,
  planWeaponUpgrade,
  radagonSoresealBridgeAdvice,
  recommendOrigin,
  runesToNextLevel,
  selectOptionalRuneBosses,
} from "../app/run-planner.ts";

test("origin and rune constants match known game values", () => {
  assert.equal(ORIGINS.length, 10);
  for (const origin of ORIGINS) {
    assert.equal(Object.values(origin.attributes).reduce((sum, value) => sum + value, 0), origin.level + 79);
  }
  assert.deepEqual([1, 9, 11, 12, 50].map(runesToNextLevel), [673, 811, 847, 1038, 15102]);
  assert.equal(recommendOrigin({
    vigor: 60, mind: 9, endurance: 30, strength: 80,
    dexterity: 9, intelligence: 7, faith: 8, arcane: 11,
  }).origin.name, "Hero");
});

test("all chapter budgets have complete, coherent income bands", () => {
  assert.equal(CHAPTER_ECONOMY.length, 30);
  assert.equal(new Set(CHAPTER_ECONOMY.map((chapter) => chapter.chapterId)).size, 30);
  for (const chapter of CHAPTER_ECONOMY) {
    assert.ok(chapter.fieldRunesLow <= chapter.fieldRunesHigh);
    assert.ok(chapter.bossRunes >= 0);
    assert.ok(chapter.purchaseReserve > 0);
    assert.ok(chapter.grossLossAdjustedRunes >= chapter.netPlanningRunes);
  }
  assert.equal(lossAdjustedRuneBudget(900, .1), 1000);
});

test("co-op calculations are deterministic", () => {
  assert.deepEqual([1, 2, 3].map((players) => bossHealthMultiplier(players)), [1, 1.6, 2.3]);
  assert.deepEqual([1, 2, 3, 4].map((players) => expectedPerPlayerBossPot(1000, players)), [1000, 1000, 1250, 1250]);
  assert.equal(expectedPerPlayerBossPot(1000, 4, "seamless"), 1000);
});

test("rune recovery selects easier accessible bosses until the shortfall is funded", () => {
  const recovery = selectOptionalRuneBosses(7_000, "first-steps", 2, "standard");
  assert.ok(recovery.perPlayerRunes >= 7_000);
  assert.ok(recovery.bosses.length > 0);
  assert.ok(recovery.bosses.every((boss) => boss.chapterId === "first-steps"));
  assert.deepEqual([...recovery.bosses].map((boss) => boss.difficulty), [...recovery.bosses].map((boss) => boss.difficulty).sort());
});

test("upgrade plans include exact material purchase ceilings", () => {
  const standard = planWeaponUpgrade("standard", 0, 25);
  const somber = planWeaponUpgrade("somber", 0, 10);
  assert.equal(standard.materialPurchaseRunes, 129600);
  assert.equal(somber.materialPurchaseRunes, 97000);
  assert.equal(standard.materials.find((item) => item.tier === 1)?.quantity, 12);
  assert.equal(standard.unpricedMaterials.length, 1);
  assert.equal(somber.unpricedMaterials.length, 1);
});

test("equip load thresholds use strict game boundaries", () => {
  assert.equal(EQUIP_LOAD_BY_ENDURANCE[8], 45);
  assert.equal(EQUIP_LOAD_BY_ENDURANCE[99], 160);
  assert.equal(equipLoadTier(29.99, 100), "light");
  assert.equal(equipLoadTier(30, 100), "medium");
  assert.equal(equipLoadTier(70, 100), "heavy");
  assert.equal(equipLoadTier(100, 100), "overloaded");
});

test("build targets are repeatable and spend exactly the target level", () => {
  const build = { id: "str-fai", stats: "STR / FAI", startingClass: "Hero", role: "melee incantation hybrid" };
  const first = planBuildStatTarget(build, 150, { faith: 46, dexterity: 18 });
  const second = planBuildStatTarget(build, 150, { faith: 46, dexterity: 18 });
  assert.deepEqual(first, second);
  assert.equal(Object.values(first.attributes).reduce((sum, value) => sum + value, 0), 229);
  assert.ok(first.attributes.faith >= 46);
  assert.ok(first.attributes.dexterity >= 18);
});

test("Radagon's Soreseal advice identifies a true early requirement bridge", () => {
  const baseStats = { vigor: 25, mind: 12, endurance: 15, strength: 15, dexterity: 13, intelligence: 9, faith: 9, arcane: 7 };
  const advice = radagonSoresealBridgeAdvice({ baseStats, requiredStats: { strength: 20 }, targetLevel: 35, phase: "early" });
  assert.equal(advice.status, "use");
  assert.deepEqual(advice.bridgedRequirements, ["strength"]);
  assert.equal(advice.savedLevels, 5);
});
