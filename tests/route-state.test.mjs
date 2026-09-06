import assert from "node:assert/strict";
import test from "node:test";
import { cataloguePage, changeLevelPace, checklistDone, checklistProgress, matchesSearch, nextChapterTask, normalizeSearch, routePlanningKey } from "../app/route-state.ts";
import { buffRoutine, buffForPickup } from "../app/buffs.ts";
import { validateRunImport } from "../app/save-validation.ts";

const run = { players: [{ id: "player-1" }, { id: "player-2" }], completed: {} };

test("next step is selected from the displayed chapter, including partially completed party pickups", () => {
  const tasks = [{ id: "here-one", perPlayer: false }, { id: "here-two", perPlayer: true }];
  const partial = { ...run, completed: { "other-chapter": false, "here-one": true, "here-two:player-1": true } };
  assert.equal(nextChapterTask(tasks, partial).task.id, "here-two");
  assert.equal(nextChapterTask(tasks, partial).index, 1);
  assert.equal(checklistDone(tasks[1], partial), false);
  assert.equal(nextChapterTask(tasks, { ...partial, completed: { ...partial.completed, "here-two:player-2": true } }), undefined);
});

test("skipped optional steps resolve progress for the whole party and can be restored", () => {
  const tasks = [{ id: "boss", perPlayer: false }, { id: "detour", perPlayer: true }];
  const skipped = { ...run, completed: { boss: true, "detour:skipped": true } };
  assert.equal(checklistProgress(tasks, skipped), 100);
  assert.equal(nextChapterTask(tasks, skipped), undefined);
  assert.equal(checklistProgress(tasks, { ...skipped, completed: { boss: true } }), 33);
  assert.equal(checklistProgress([], run), 0);
});

test("changing level pace never resets progress or entered character checkpoints", () => {
  const original = { ...run, completed: { margit: true }, checkpointStats: { "first-steps:player-1": { vigor: 27 } }, checkpointRunes: { "first-steps:player-1": 2129 }, levelOffset: 0 };
  const updated = changeLevelPace(original, 10);
  assert.equal(updated.levelOffset, 10);
  assert.equal(updated.completed, original.completed);
  assert.equal(updated.checkpointStats, original.checkpointStats);
  assert.equal(updated.checkpointRunes, original.checkpointRunes);
  assert.equal(original.levelOffset, 0);
});

test("chapter navigation reuses the route model but actual progress and budgets invalidate it", () => {
  assert.equal(routePlanningKey({ ...run, activeChapterId: "first-steps" }), routePlanningKey({ ...run, activeChapterId: "altus" }));
  assert.notEqual(routePlanningKey(run), routePlanningKey({ ...run, completed: { margit: true } }));
  assert.notEqual(routePlanningKey(run), routePlanningKey({ ...run, levelOffset: 5 }));
  assert.equal(routePlanningKey(null), "");
});

test("catalogue paging never removes builds and clamps after a filter reduces the list", () => {
  const items = Array.from({ length: 183 }, (_, index) => index);
  const pages = Array.from({ length: 8 }, (_, page) => cataloguePage(items, page));
  assert.deepEqual(pages.flatMap((page) => page.items), items);
  assert.ok(pages.every((page) => page.items.length <= 24));
  assert.equal(cataloguePage([1], 7).page, 0);
  assert.deepEqual(cataloguePage([], 0), { page: 0, pages: 1, from: 0, to: 0, items: [] });
});

test("weapon search ignores punctuation, accents, case and word order", () => {
  const index = normalizeSearch("Bloodhound’s Fang • Flame, Grant Me Strength — Érdtree");
  for (const query of ["  bloodhounds fang  ", "FANG bloodhound's", "flame strength", "erdtree", ""]) assert.equal(matchesSearch(index, query), true, query);
  assert.equal(matchesSearch(index, "fang moonveil"), false);
});

test("conflicting aura and weapon buffs are choices, not consecutive casts", () => {
  const routine = buffRoutine({ spells: ["Golden Vow", "Bloodflame Blade"], skill: "Golden Vow and Cragblade" });
  assert.match(routine, /Choose one aura buff: Golden Vow OR Golden Vow \(skill\)/);
  assert.match(routine, /Choose one weapon buff: Bloodflame Blade OR Cragblade on the same weapon/);
  assert.doesNotMatch(routine, /\d\) Bloodflame Blade; \d\) Cragblade/);
});

test("roar buffs can coexist with a body buff; Endure and Unseen Form are unique", () => {
  for (const name of ["War Cry", "Barbaric Roar", "Braggart's Roar"]) assert.equal(buffForPickup(`Ash of War: ${name}`).group, "weapon");
  assert.equal(buffForPickup("Ash of War: Endure").group, "unique");
  assert.equal(buffForPickup("Unseen Form").group, "unique");
  assert.doesNotMatch(buffRoutine({ spells: ["Flame Grant Me Strength"], skill: "Braggart's Roar" }), /Choose one|instead of casting both/);
});

test("buff instructions with unmet requirements are excluded from the casting order", () => {
  const routine = buffRoutine({ spells: ["Golden Vow", "Flame Grant Me Strength"], skill: "Cragblade" }, { faith: 15, intelligence: 9, arcane: 8 });
  assert.match(routine, /1\) Cragblade; 2\) Flame, Grant Me Strength/);
  assert.match(routine, /Not yet castable.*Golden Vow requires 25 Faith/);
  assert.doesNotMatch(routine, /\d\) Golden Vow/);
});

test("save validation accepts legacy checkpoints and rejects broken or unsafe imports without mutating them", () => {
  const save = { schema: 1, name: "Existing run", mode: "solo", players: [{ id: "player-1", name: "Sam", buildId: "colossal-hammer", color: "#d8ad62" }], hostId: "player-1", createdAt: "2026-09-06T12:00:00Z", completed: { margit: true } };
  const before = JSON.stringify(save);
  assert.doesNotThrow(() => validateRunImport(save));
  assert.equal(JSON.stringify(save), before);
  for (const patch of [
    { completed: null }, { completed: [] }, { completed: { margit: "true" } },
    { checkpointLevels: { chapter: -1 } }, { checkpointStats: { chapter: { vigor: 100 } } },
    { players: [...save.players, ...save.players] }, { hostId: "player-2" },
    { runeBossSelections: { chapter: "boss" } }, { optionalQuestTracks: "ranni" }, { createdAt: "not a date" },
  ]) assert.throws(() => validateRunImport({ ...save, ...patch }), JSON.stringify(patch));
  assert.throws(() => validateRunImport({ ...save, completed: JSON.parse('{"__proto__":true}') }));
});
test("skipping a rune boss removes funding without erasing progress or other chapters", async () => {
  const { skipRuneBoss } = await import("../app/route-state.ts");
  const run = { completed: { earlier: true }, runeBossSelections: { weeping: ["scaly-morne"] } };
  const next = skipRuneBoss(run, "first-steps", "troll-limgrave", ["troll-limgrave", "beastman-groveside"]);
  assert.deepEqual(next.runeBossSelections["first-steps"], ["beastman-groveside"]);
  assert.deepEqual(next.runeBossSelections.weeping, ["scaly-morne"]);
  assert.deepEqual(next.completed, { earlier: true });
  assert.equal(run.runeBossSelections["first-steps"], undefined);
  assert.deepEqual(skipRuneBoss(next, "first-steps", "beastman-groveside", []).runeBossSelections["first-steps"], []);
});
