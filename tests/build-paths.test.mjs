import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

const PHASES = ["early", "mid", "late", "dlc"];
const DAMAGE_STATS = ["STR", "DEX", "INT", "FAI", "ARC"];

async function loadCatalogue() {
  const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
  const data = await server.ssrLoadModule("/app/data.ts");
  const weapons = await server.ssrLoadModule("/app/weapon-upgrades.ts");
  return { ...data, ...weapons, close: () => server.close() };
}

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
