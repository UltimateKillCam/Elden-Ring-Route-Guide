import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const PHASES = ["early", "mid", "late", "dlc"];
const DAMAGE_STATS = ["STR", "DEX", "INT", "FAI", "ARC"];

async function loadCatalogue() {
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
  const data = await server.ssrLoadModule("/app/data.ts");
  const weapons = await server.ssrLoadModule("/app/weapon-upgrades.ts");
  const questRoute = await server.ssrLoadModule("/app/quest-route.ts");
  const mapItems = await server.ssrLoadModule("/app/map-items.ts");
  const planner = await server.ssrLoadModule("/app/run-planner.ts");
  return { ...data, ...weapons, ...questRoute, ...mapItems, ...planner, close: () => server.close() };
}

test("quest route keeps every Kenneth state change and merges the Soreseal advisory", async () => {
  const catalogue = await loadCatalogue();
  try {
    const firstSteps = catalogue.chapters.find((chapter) => chapter.id === "first-steps");
    const labels = firstSteps.essentials;
    const kenneth = [
      "Meet Kenneth Haight above the Mistwood road",
      "Clear Fort Haight and collect Bloody Slash",
      "Return to Kenneth for the Erdsteel Dagger",
      "Rest at Fort Haight West, then pledge service to Kenneth",
      "Revisit Kenneth on Fort Haight's battlements",
    ];
    assert.deepEqual(labels.filter((label) => /Kenneth|Fort Haight and collect Bloody Slash/.test(label)), kenneth);
    assert.ok(kenneth.every((label) => catalogue.QUEST_STEP_GUIDES[label]?.length > 80));
    assert.ok(Object.keys(catalogue.QUEST_STEP_GUIDES).length >= 180, "quest audit lost detailed route instructions");
    assert.doesNotMatch(labels.join("\n"), /^WARNING/m);
    assert.equal(labels.filter((label) => /Radagon's Soreseal/.test(label)).length, 1);
    const patchesLabel = "Spare Patches and reopen his Murkwater Cave shop";
    const scenicLabel = "Meet Patches at Scenic Isle";
    assert.ok(labels.includes(patchesLabel), "Patches' Murkwater Cave encounter is missing from Limgrave");
    assert.ok(catalogue.chapters.find((chapter) => chapter.id === "liurnia-south").essentials.includes(scenicLabel), "Patches' Scenic Isle encounter is missing from Liurnia");
    assert.match(catalogue.QUEST_STEP_GUIDES[patchesLabel], /half health.*Stop attacking.*reload the cave/is);
  } finally {
    await catalogue.close();
  }
});

test("Yura's route preserves every encounter before Eleonora", async () => {
  const catalogue = await loadCatalogue();
  try {
    const expected = [
      ["first-steps", "Meet Yura beneath the ruin north-east of Seaside Ruins"],
      ["first-steps", "Defeat Bloody Finger Nerijus with Yura at Murkwater"],
      ["academy", "Use Yura's red summon sign on the Main Academy Gate bridge"],
      ["academy", "Speak to Yura after the Ravenmount Assassin"],
      ["altus", "Meet Yura at the Second Church and defeat Eleonora"],
    ];
    for (const [chapterId, label] of expected) {
      assert.ok(catalogue.chapters.find((chapter) => chapter.id === chapterId)?.essentials.includes(label), `${label} is missing from ${chapterId}`);
      assert.ok(catalogue.QUEST_STEP_GUIDES[label]?.length > 100, `${label} lacks a complete guide`);
    }
    assert.match(catalogue.QUEST_STEP_GUIDES[expected.at(-1)[1]], /Prerequisite check:.*Seaside Ruins.*Nerijus.*red summon sign.*Ravenmount Assassin/is);
  } finally {
    await catalogue.close();
  }
});

const statCodes = (build) => DAMAGE_STATS.filter((stat) => build.stats.toUpperCase().includes(stat));

test("every generated progression bridge is source-backed, timely and stat-compatible", async () => {
  const catalogue = await loadCatalogue();
  try {
    assert.equal(catalogue.builds.length, 271);
    for (const build of catalogue.builds) {
      for (const phase of PHASES) {
        const stage = catalogue.stageLoadout(build, phase);
        if (build.collection === "Curated") {
          assert.equal(stage.sourceUse, "curated-baseline", `${build.name} ${phase} has no published baseline`);
        }
        if (!stage.borrowedFrom) continue;
        const source = catalogue.builds.find((candidate) => candidate.name === stage.borrowedFrom.buildName && candidate.source.url === stage.borrowedFrom.url);
        assert.ok(source?.publishedLoadout, `${build.name} ${phase} points to a missing source build`);
        assert.ok(PHASES.indexOf(source.availableFrom || "early") <= PHASES.indexOf(phase), `${build.name} ${phase} borrows future gear from ${source.name}`);
        const targetStats = statCodes(build);
        const sourceStats = statCodes(source);
        if (targetStats.length && sourceStats.length) {
          assert.ok(targetStats.some((stat) => sourceStats.includes(stat)), `${build.name} ${phase} shares no damage stat with ${source.name}`);
        }
      }
    }
  } finally {
    await catalogue.close();
  }
});

test("curated paths avoid respec pivots and severe off-path weapon requirements", async () => {
  const catalogue = await loadCatalogue();
  try {
    for (const build of catalogue.builds.filter((candidate) => candidate.collection === "Curated")) {
      assert.doesNotMatch(`${build.stats} ${build.playstyle} ${build.tags.join(" ")}`, /(?:→|\brespec\b)/i, `${build.name} still advertises a respec`);
      const targetStats = statCodes(build);
      for (const phase of PHASES) {
        const stage = catalogue.stageLoadout(build, phase);
        const weapon = catalogue.findWeaponUpgradeRecord(stage.weapon);
        if (!weapon) continue;
        const requirements = { STR: weapon.reqStr, DEX: weapon.reqDex, INT: weapon.reqInt, FAI: weapon.reqFai, ARC: weapon.reqArc };
        for (const [stat, value] of Object.entries(requirements)) {
          assert.ok(targetStats.includes(stat) || value < 25, `${build.name} ${phase} needs ${stat} ${value} for ${weapon.name}, outside ${build.stats}`);
        }
      }
    }
    const quality = catalogue.builds.find((build) => build.id === "quality-knight");
    const colossal = catalogue.builds.find((build) => build.id === "colossal-hammer");
    assert.deepEqual(PHASES.map((phase) => quality.phases[phase]), ["Longsword", "Claymore", "Quality Great Épée", "Milady + Wing Stance"]);
    assert.deepEqual(PHASES.map((phase) => colossal.phases[phase]), ["Large Club", "Great Club", "Giant-Crusher", "Anvil Hammer"]);
  } finally {
    await catalogue.close();
  }
});

test("every optional rune boss resolves to its own encounter marker", async () => {
  const catalogue = await loadCatalogue();
  try {
    for (const boss of catalogue.OPTIONAL_RUNE_BOSSES) {
      const query = boss.mapQuery || `${boss.name} ${boss.location}`;
      const marker = catalogue.findMapRoutePoint(query, "surface");
      assert.ok(marker, `${boss.name} has no map marker`);
    }
    const markerFor = (id) => {
      const boss = catalogue.OPTIONAL_RUNE_BOSSES.find((candidate) => candidate.id === id);
      return catalogue.findMapRoutePoint(boss.mapQuery || `${boss.name} ${boss.location}`, "surface")?.name;
    };
    assert.equal(markerFor("hugues"), "Battlemage Hugues");
    assert.equal(markerFor("avatar-liurnia"), "Minor Erdtree (Liurnia Southwest)");
    assert.equal(markerFor("putrid-avatar-caelid"), "Erdtree Avatar (Caelid)");
    assert.equal(markerFor("troll-old-altus"), "Old Altus Tunnel");
  } finally {
    await catalogue.close();
  }
});

test("Storm Blessed follows one quality polearm lane into its published DLC build", async () => {
  const catalogue = await loadCatalogue();
  try {
    const build = catalogue.builds.find((candidate) => candidate.id === "fextra-stormblessed");
    assert.ok(build);
    const stages = PHASES.map((phase) => catalogue.stageLoadout(build, phase));
    assert.equal(stages[0].weapon, "Halberd");
    assert.equal(stages[1].weapon, "Dragon Halberd");
    assert.match(stages[2].weapon, /spear|gransax/i);
    assert.equal(stages[3].weapon, "Messmer Soldier's Spear");
    assert.deepEqual(stages.slice(0, 3).map((stage) => stage.borrowedFrom?.buildName), ["Vanquisher", "Vanquisher", "Lightning Dragoon"]);
  } finally {
    await catalogue.close();
  }
});
