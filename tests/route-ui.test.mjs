import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

let server;
let loaded;
async function components() {
  return loaded ??= (async () => {
    server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom", plugins: [{
      name: "test-route-components",
      transform(code, id) {
        if (id.replaceAll("\\", "/").endsWith("/app/page.tsx")) return `${code}\nexport { RouteView, CodexView, tasksForChapter, equipmentTimeline, defaultPlayerStartingClass, buildForPlayer, WeaponRoutePreview, RuneCheckpointPanel, progressionTasksForChapter, runeSupportPlan, affordableLevelAndUpgrade, missingTaskPrerequisites, MapPanel };`;
      },
    }] });
    return server.ssrLoadModule("/app/page.tsx");
  })();
}
after(async () => { await server?.close(); });

const task = (id, label, extras = {}) => ({ id, label, detail: `Instructions for ${label}`, kind: "objective", scope: "Shared session", perPlayer: false, ...extras });
const expedition = { schema: 1, name: "Test run", mode: "seamless", players: [{ id: "player-1", name: "Sam", buildId: "colossal-hammer", color: "#d8ad62" }, { id: "player-2", name: "Aaron", buildId: "quality-knight", color: "#7db6a8" }], hostId: "player-1", createdAt: "2026-09-06", completed: {} };
const props = { expedition, activeId: "liurnia-south", tasksByChapter: { "first-steps": [task("old", "Earlier unfinished task")], "liurnia-south": [task("scenic", "Meet Patches at Scenic Isle", { mapQuery: "Scenic Isle" })] }, runeSupport: {}, setExpedition() {}, setActiveId() {} };

test("rendered objective and map both refer to the displayed chapter rather than an earlier incomplete chapter", async () => {
  const { RouteView } = await components();
  const html = renderToStaticMarkup(createElement(RouteView, props));
  const current = html.match(/aria-label="Current objective"[\s\S]*?<\/section>/)?.[0];
  assert.match(current, /Meet Patches at Scenic Isle/);
  assert.doesNotMatch(current, /Earlier unfinished task/);
  assert.match(html, /Showing objective/);
  assert.match(html, /Show on map/);
  assert.match(html, /<details id="chapter-checkpoint"/);
  assert.doesNotMatch(html, /class="rune-balance-grid"/);
});

test("optional per-player pickups have skip and restore controls for the host", async () => {
  const { RouteView } = await components();
  const optionalProps = { ...props, activeId: "first-steps", tasksByChapter: { "first-steps": [task("optional", "Optional detour", { perPlayer: true, optional: true })] } };
  assert.match(renderToStaticMarkup(createElement(RouteView, optionalProps)), />Skip item<\/button>/);
  const skipped = { ...optionalProps, expedition: { ...expedition, completed: { "optional:skipped": true } } };
  assert.match(renderToStaticMarkup(createElement(RouteView, skipped)), />Restore item<\/button>/);
});

test("the catalogue renders a bounded first page with real loadout buttons", async () => {
  const { CodexView } = await components();
  const html = renderToStaticMarkup(createElement(CodexView, { catalogueOnly: true }));
  assert.equal((html.match(/class="build-card"/g) || []).length, 24);
  assert.match(html, /aria-label="Build pages"/);
  assert.match(html, /aria-label="Full loadout:/);
});

test("the corrected Quality route collects Claymore once at Castle Morne, not an unnecessary Longsword", async () => {
  const { tasksForChapter } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const tasks = tasksForChapter(chapters[0], expedition);
  assert.equal(tasks.find((task) => task.item === "Large Club" && task.playerId === "player-1")?.id, "first-steps-gear-player-1");
  assert.equal(tasks.some((task) => task.item === "Longsword" && task.playerId === "player-2"), false);
  const morne = tasksForChapter(chapters.find((chapter) => chapter.id === "weeping"), expedition);
  assert.equal(morne.filter((task) => task.item === "Claymore" && task.playerId === "player-2").length, 1);
});

test("the real route excludes unused bridges and acquires defining equipment only once", async () => {
  const { tasksForChapter, defaultPlayerStartingClass } = await components();
  const { builds, chapters } = await server.ssrLoadModule("/app/data.ts");
  for (const [id, expected, chapterId, unwanted] of [
    ["fextra-stormblessed", "Messmer Soldier's Spear", "ensiss", "Dragon Halberd"],
    ["eip-bleed-brawler", "Star Fist", "leyndell", "Great Stars"],
    ["eip-winterlion-bloodfiend", "Bloodfiend's Arm", "gravesite", "Great Club"],
  ]) {
    const build = builds.find((build) => build.id === id);
    const run = { ...expedition, mode: "solo", optionalQuestTracks: [], players: [{ ...expedition.players[0], buildId: id, startingClass: defaultPlayerStartingClass(build) }] };
    const pickups = chapters.flatMap((chapter) => tasksForChapter(chapter, run).filter((task) => task.slot === "weapon").map((task) => ({ chapterId: chapter.id, item: task.item, id: task.id })));
    assert.equal(pickups.some((task) => task.item?.includes(unwanted)), false, `${id} still routes an unused temporary weapon`);
    const required = pickups.filter((task) => task.item?.includes(expected));
    assert.equal(required.length, 1, `${id}: defining weapon must have exactly one acquisition card`);
    assert.equal(required[0].chapterId, chapterId);
  }
});

test("Tarnished Pack builds retain their starting class through setup", async () => {
  const { defaultPlayerStartingClass, tasksForChapter } = await components();
  const { builds, chapters } = await server.ssrLoadModule("/app/data.ts");
  const idus = builds.find((build) => build.id === "fextra-idusknightstarter");
  assert.equal(defaultPlayerStartingClass(idus), "Idus Knight");
  assert.ok(idus.tags.includes("tarnished-pack-required"));
  for (const build of builds.filter((build) => build.startingClass === "Not specified")) {
    assert.ok(!["Idus Knight", "Heavy Knight"].includes(defaultPlayerStartingClass(build)), `${build.id} silently requires a paid origin`);
  }
  const run = { ...expedition, mode: "solo", optionalQuestTracks: [], players: [{ ...expedition.players[0], buildId: idus.id, startingClass: "Idus Knight" }] };
  const liurnia = tasksForChapter(chapters.find((chapter) => chapter.id === "liurnia-south"), run);
  assert.equal(liurnia.some((task) => task.slot === "weapon" && task.item === "Idus Sword"), false, "the starting sword must not require a second pickup");
});

test("catalogue weapon previews contain only real chapter transitions", async () => {
  const { WeaponRoutePreview } = await components();
  const { builds } = await server.ssrLoadModule("/app/data.ts");
  const html = renderToStaticMarkup(createElement(WeaponRoutePreview, { build: builds.find((build) => build.id === "fextra-stormblessed") }));
  assert.match(html, /Halberd/);
  assert.match(html, /Messmer Soldier/);
  assert.doesNotMatch(html, /Dragon Halberd|Bolt of Gransax/);
  assert.equal((html.match(/<li>/g) || []).length, 2);
});

test("a locked chapter links directly to the missing prerequisite card", async () => {
  const { RouteView } = await components();
  const html = renderToStaticMarkup(createElement(RouteView, { ...props, activeId: "nokron", tasksByChapter: {
    caelid: [task("radahn", "Defeat Starscourge Radahn")], nokron: [task("mimic", "Defeat Mimic Tear")],
  } }));
  assert.match(html, /Finish these prerequisites/);
  assert.match(html, /Defeat Starscourge Radahn<small>The Radahn Festival · Open this step/);
  assert.match(html, /id="task-mimic" tabindex="-1"/);
  assert.match(html, /aria-current="step"/);
});

test("planning caches survive parsed saves but distinguish different starting classes", async () => {
  const { buildForPlayer } = await components();
  const player = { ...expedition.players[0], startingClass: "Hero" };
  assert.equal(buildForPlayer(player), buildForPlayer(JSON.parse(JSON.stringify(player))));
  assert.notEqual(buildForPlayer(player), buildForPlayer({ ...player, startingClass: "Wretch" }));
});

test("checkpoint fields reject empty, fractional and out-of-range input without inventing zero or one", async () => {
  await components();
  const { checkpointInputError, CheckpointInput } = await server.ssrLoadModule("/app/checkpoint-input.tsx");
  for (const value of ["", " ", "0", "100", "1.5", "NaN", "Infinity"]) assert.ok(checkpointInputError(value, 1, 99), value);
  for (const value of ["1", "41", "99"]) assert.equal(checkpointInputError(value, 1, 99), "");
  assert.equal(checkpointInputError("0", 0, 10), "");
  assert.ok(checkpointInputError("11", 0, 10));
  const html = renderToStaticMarkup(createElement(CheckpointInput, { value: 41, min: 1, max: 713, onCommit() {}, "aria-label": "Sam current RL" }));
  assert.match(html, /value="41"/);
  assert.match(html, /step="1"/);
});

test("a replacement regular weapon starts its upgrade instructions at zero, not the previous weapon's upgrade", async () => {
  const { progressionTasksForChapter, buildForPlayer } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const { sameWeaponUpgradeTrack } = await server.ssrLoadModule("/app/build-routing.ts");
  assert.equal(sameWeaponUpgradeTrack("Heavy Claymore", "Quality Claymore"), true);
  assert.equal(sameWeaponUpgradeTrack("Longsword", "Claymore"), false);
  const run = { ...expedition, players: [{ ...expedition.players[1], id: "player-1", startingClass: "Vagabond" }], mode: "solo", checkpointWeaponLevels: { "first-steps:player-1": 3 } };
  const support = { "first-steps": { levels: { "player-1": 15 }, upgrades: { "player-1": 3 }, bosses: [] }, weeping: { levels: { "player-1": 25 }, upgrades: { "player-1": 5 }, bosses: [] } };
  assert.equal(buildForPlayer(run.players[0]).id, "quality-knight");
  const tasks = progressionTasksForChapter(chapters.find((chapter) => chapter.id === "weeping"), run, support);
  assert.match(tasks.find((task) => task.kind === "upgrade").detail, /from \+0 to \+5/);
});

test("a recorded wallet funds the actual checkpoint, not estimated lifetime income", async () => {
  const { runeSupportPlan, progressionTasksForChapter, RuneCheckpointPanel } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const { CHAPTER_ECONOMY_BY_ID } = await server.ssrLoadModule("/app/run-planner.ts");
  const run = { ...expedition, mode: "solo", players: [expedition.players[0]], checkpointLevels: { "weeping:player-1": 15 }, checkpointRunes: { "weeping:player-1": 0 }, runeBossSelections: { weeping: [] } };
  const empty = runeSupportPlan(run);
  assert.equal(empty.weeping.levels["player-1"], 15);
  assert.equal(empty.weeping.upgrades["player-1"], 0);
  const detail = progressionTasksForChapter(chapters.find((chapter) => chapter.id === "weeping"), run, empty).find((task) => task.kind === "level").detail;
  assert.match(detail, /checkpoint's 0 held runes/);
  assert.doesNotMatch(detail, /Conservative cumulative income|Buy \d+ levels/);
  const html = renderToStaticMarkup(createElement(RuneCheckpointPanel, { chapter: chapters.find((chapter) => chapter.id === "weeping"), expedition: run, support: empty, setExpedition() {} }));
  assert.match(html, /Keep RL15; this budget does not fund another level/);
  assert.doesNotMatch(html, /already meets or exceeds the|Next: buy 0/);
  const funded = runeSupportPlan({ ...run, checkpointRunes: { "weeping:player-1": 1000000 } });
  assert.equal(funded.weeping.levels["player-1"], CHAPTER_ECONOMY_BY_ID.weeping.targetRuneLevel);
  assert.equal(funded.weeping.upgrades["player-1"], CHAPTER_ECONOMY_BY_ID.weeping.standardUpgradeTarget);
  const overlevelled = runeSupportPlan({ ...run, checkpointLevels: { "weeping:player-1": 80 } });
  assert.equal(overlevelled.weeping.levels["player-1"], 80);
  assert.equal(overlevelled.weeping.bosses.length, 0);
});

test("checkpoint funding charges only the remaining upgrades on the owned weapon", async () => {
  const { affordableLevelAndUpgrade } = await components();
  const { planWeaponUpgrade } = await server.ssrLoadModule("/app/run-planner.ts");
  const remaining = planWeaponUpgrade("standard", 3, 5).materialPurchaseRunes;
  const result = affordableLevelAndUpgrade({ originLevel: 15, minimumLevel: 15, desiredLevel: 15, minimumUpgrade: 3, ownedUpgrade: 3, desiredUpgrade: 5, path: "standard", availableRunes: remaining });
  assert.equal(result.level, 15);
  assert.equal(result.upgrade, 5);
  assert.equal(result.materialRunes, remaining);
});

test("stone supplies are finite, tier-correct and never borrowed from a later shop", async () => {
  await components();
  const { allocateUpgradeMaterials, suppliedUpgradeTarget, MATERIAL_SOURCES } = await server.ssrLoadModule("/app/upgrade-materials.ts");
  const initial = allocateUpgradeMaterials("standard", 0, 2, "first-steps");
  assert.deepEqual(initial.missing, []);
  assert.equal(initial.allocations.reduce((n, entry) => n + entry.quantity, 0), 6);
  assert.ok(initial.allocations.every(({ source }) => source.tier === 1 && source.chapterId === "first-steps"));
  const depleted = Object.fromEntries(MATERIAL_SOURCES.filter((source) => source.path === "standard" && source.chapterId === "first-steps").map((source) => [source.id, source.capacity]));
  const blocked = suppliedUpgradeTarget("standard", 0, 3, "first-steps", depleted);
  assert.equal(blocked.target, 0);
  assert.equal(blocked.limited, true);
  const late = allocateUpgradeMaterials("standard", 0, 24, "farum", depleted);
  assert.deepEqual(late.missing, []);
  assert.ok(late.allocations.filter(({ source }) => source.unitCost && source.tier >= 7).every(({ source }) => /Godskin Duo/.test(source.unlockLabel)));
  const somber = allocateUpgradeMaterials("somber", 1, 2, "weeping");
  assert.equal(somber.allocations[0].source.marker.url.includes("id=491&"), true);
  assert.equal(somber.allocations[0].source.unlockLabel, undefined, "the beach pickup must not silently enable Blaidd's optional quest");
  assert.ok(allocateUpgradeMaterials("somber", 1, 3, "first-steps").missing.length > 0);
});

test("material cards precede upgrades and follow their bell-bearing unlocks", async () => {
  const { tasksForChapter } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const run = { ...expedition, mode: "solo", optionalQuestTracks: [], players: [expedition.players[0]] };
  for (const id of ["liurnia-south", "altus", "mountaintops", "farum"]) {
    const chapter = chapters.find((entry) => entry.id === id);
    const support = { [id]: { levels: { "player-1": 100 }, upgrades: { "player-1": id === "farum" ? 24 : id === "mountaintops" ? 18 : id === "altus" ? 12 : 6 }, bosses: [] } };
    const tasks = tasksForChapter(chapter, run, support);
    const upgrade = tasks.find((entry) => entry.kind === "upgrade");
    assert.ok(upgrade, id);
    const supplies = tasks.filter((entry) => entry.material);
    assert.ok(supplies.length > 0, id);
    for (const supply of supplies) {
      assert.ok(tasks.indexOf(supply) < tasks.indexOf(upgrade));
      assert.ok(upgrade.prerequisiteIds.includes(supply.id));
      assert.match(supply.detail, /Area:|Price:/);
      assert.ok(supply.sourceUrl);
      for (const label of supply.prerequisiteLabels ?? []) {
        const localGate = tasks.findIndex((entry) => entry.label === label);
        if (localGate >= 0) assert.ok(localGate < tasks.indexOf(supply), `${id} buys before ${label}`);
      }
    }
  }
});

test("an upgrade needs collected materials, and standard co-op unlocks are checked for the right player", async () => {
  const { missingTaskPrerequisites } = await components();
  const bearing = task("bearing", "Unlock stone shop", { perPlayer: true });
  const supply = task("supply-player-1", "Buy stones", { playerId: "player-1", prerequisiteLabels: [bearing.label] });
  const upgrade = task("upgrade-player-1", "Upgrade", { playerId: "player-1", prerequisiteIds: [supply.id] });
  const all = [bearing, supply, upgrade];
  assert.equal(missingTaskPrerequisites(supply, all, expedition).length, 1);
  assert.equal(missingTaskPrerequisites(supply, all, { ...expedition, completed: { "bearing:player-1": true } }).length, 0);
  assert.equal(missingTaskPrerequisites(upgrade, all, { ...expedition, completed: { "supply-player-1:skipped": true } }).length, 1);
  assert.equal(missingTaskPrerequisites(upgrade, all, { ...expedition, completed: { "supply-player-1": true } }).length, 0);
});

test("new boss options can be added even with none selected, while hard alternatives stay manual", async () => {
  const { RuneCheckpointPanel } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const { OPTIONAL_RUNE_BOSSES, selectOptionalRuneBosses } = await server.ssrLoadModule("/app/run-planner.ts");
  const html = renderToStaticMarkup(createElement(RuneCheckpointPanel, { chapter: chapters.find((chapter) => chapter.id === "mountaintops"), expedition, support: { mountaintops: { levels: {}, upgrades: {}, bosses: [] } }, setExpedition() {} }));
  assert.match(html, /Add another rune boss/);
  assert.match(html, /Add Borealis the Freezing Fog/);
  assert.match(html, /Harder alternative/);
  assert.match(html, /100,000/);
  assert.match(html, /Encounter guide/);
  assert.ok(OPTIONAL_RUNE_BOSSES.length >= 55);
  for (const chapter of chapters) assert.ok(selectOptionalRuneBosses(1000000, chapter.id, 2, "seamless").bosses.every((boss) => boss.difficulty < 3 && !boss.prerequisiteLabel));
});

test("material pins retain their exact source and underground map layer", async () => {
  const { MapPanel } = await components();
  const { MATERIAL_SOURCES } = await server.ssrLoadModule("/app/upgrade-materials.ts");
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const source = MATERIAL_SOURCES.find((entry) => entry.id === "pickup-4701");
  const material = task("stone", "Collect ancient stone", { item: source.marker.name, mapMarker: source.marker });
  const html = renderToStaticMarkup(createElement(MapPanel, { chapter: chapters.find((entry) => entry.id === "mohgwyn"), expedition, chapterTasks: [material], tasksByChapter: {}, onSelect() {} }));
  assert.match(html, /map-layer-underground/);
  assert.match(html, /Mohgwyn Dynasty Mausoleum/);
});

test("the complete material route has no missing or later prerequisite labels", async () => {
  const { tasksForChapter, runeSupportPlan } = await components();
  const { chapters, builds } = await server.ssrLoadModule("/app/data.ts");
  const somberBuild = builds.find((build) => build.id === "moonveil") ?? builds.find((build) => build.name === "Moonveil Samurai");
  assert.ok(somberBuild);
  for (const buildId of ["colossal-hammer", "quality-knight", somberBuild.id]) {
    const run = { ...expedition, mode: "solo", optionalQuestTracks: [], players: [{ ...expedition.players[0], buildId }] };
    const support = runeSupportPlan(run);
    const tasks = chapters.flatMap((chapter) => tasksForChapter(chapter, run, support));
    for (const entry of tasks.filter((entry) => entry.material || entry.kind === "upgrade")) for (const label of entry.prerequisiteLabels ?? []) {
      const index = tasks.findIndex((candidate) => candidate.label === label);
      assert.ok(index >= 0, `${buildId}: missing ${label}`);
      assert.ok(index < tasks.indexOf(entry), `${buildId}: ${entry.label} appears before ${label}`);
    }
  }
});

test("Roundtable supplies do not pin an unrelated chapter location", async () => {
  const { MapPanel } = await components();
  const { chapters } = await server.ssrLoadModule("/app/data.ts");
  const shop = task("buy-stones", "Buy Smithing Stone [1]", { material: "Smithing Stone [1]", mapQuery: "Twin Maiden Husks", mapLocation: "Roundtable Hold · Twin Maiden Husks" });
  const html = renderToStaticMarkup(createElement(MapPanel, { chapter: chapters.find((chapter) => chapter.id === "liurnia-south"), expedition, chapterTasks: [shop], tasksByChapter: {}, onSelect() {} }));
  assert.match(html, /Roundtable Hold/);
  assert.match(html, /no overworld position/);
  assert.doesNotMatch(html, /map-tiles/);
});
test("rune fight route cards offer a host-only skip with a budget explanation", async () => {
  const { RouteView } = await components();
  const runeTask = task("topup", "Rune top-up: Beastman", { kind: "boss", runeBossId: "beastman-groveside" });
  const runeProps = { ...props, activeId: "first-steps", tasksByChapter: { "first-steps": [runeTask] } };
  const html = renderToStaticMarkup(createElement(RouteView, runeProps));
  assert.match(html, /Skip rune boss/);
  assert.match(html, /reward from the budget/);
  assert.doesNotMatch(renderToStaticMarkup(createElement(RouteView, { ...runeProps, readOnly: true, viewerPlayerId: "player-2" })), /Skip rune boss/);
});
