import { createServer } from "vite";
import { writeFile, mkdir } from "node:fs/promises";
import { parseFextralifeBuildPage } from "./import-fextralife-builds.mjs";

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: "custom" });
try {
  const { selectableBuilds, stageLoadout, chapters } = await server.ssrLoadModule("/app/data.ts");
  const { pickupGate } = await server.ssrLoadModule("/app/progression.ts");
  const { findWeaponUpgradeRecords } = await server.ssrLoadModule("/app/weapon-upgrades.ts");
  const { routeLoadout } = await server.ssrLoadModule("/app/build-routing.ts");
  const phases = ["early", "mid", "late", "dlc"];
  const report = { checkedAt: new Date().toISOString(), selectableBuilds: selectableBuilds.length, sourceCoverage: null, builds: [] };
  if (process.argv.includes("--live")) {
    const query = async (params) => {
      const response = await fetch(`https://eldenring.wiki.fextralife.com/api.php?${new URLSearchParams({ ...params, format: "json", formatversion: "2" })}`);
      if (!response.ok) throw new Error(`Fextralife API returned ${response.status}`);
      return response.json();
    };
    let continuation = {};
    const titles = [];
    do {
      const result = await query({ action: "query", list: "categorymembers", cmtitle: "Category:Build_Guides", cmlimit: "500", cmnamespace: "0", ...continuation });
      titles.push(...result.query.categorymembers.map((page) => page.title).filter((title) => / Build$/.test(title)));
      continuation = result.continue;
    } while (continuation);
    const sourceCoverage = { canonicalPages: titles.length, importedPages: selectableBuilds.filter((build) => build.collection === "Fextralife").length, missing: [], changed: [] };
    for (let index = 0; index < titles.length; index += 40) {
      const result = await query({ action: "query", prop: "revisions|categories", rvprop: "content", rvslots: "main", cllimit: "500", titles: titles.slice(index, index + 40).join("|") });
      for (const page of result.query.pages) {
        const parsed = parseFextralifeBuildPage({ title: page.title, wikitext: page.revisions[0].slots.main.content, categories: (page.categories || []).map((category) => category.title) });
        const existing = selectableBuilds.find((build) => build.id === parsed.id);
        if (!existing) sourceCoverage.missing.push({ id: parsed.id, name: parsed.name, source: parsed.source });
        else {
          const fields = Object.keys(parsed.publishedLoadout).filter((field) => JSON.stringify(parsed.publishedLoadout[field]) !== JSON.stringify(existing.publishedLoadout[field]));
          if (fields.length) sourceCoverage.changed.push({ id: parsed.id, fields });
        }
      }
    }
    report.sourceCoverage = sourceCoverage;
    console.log(JSON.stringify(sourceCoverage, null, 2));
  }
  for (const build of selectableBuilds) {
    const path = phases.map((phase) => {
      const loadout = stageLoadout(build, phase);
      const weapons = findWeaponUpgradeRecords(loadout.weapon).map((weapon) => ({ name: weapon.name, type: weapon.weaponClass, requirements: [weapon.reqStr, weapon.reqDex, weapon.reqInt, weapon.reqFai, weapon.reqArc], gate: pickupGate(weapon.name, { categoryPattern: /weapon|shield/i, preferredLayer: phase === "dlc" ? "shadow" : undefined }) }));
      return { phase, weapon: loadout.weapon, skill: loadout.skill, weapons, source: loadout.borrowedFrom || build.source };
    });
    const route = [];
    for (const chapter of chapters) {
      const loadout = routeLoadout(build, chapter);
      if (route.at(-1)?.weapon === loadout.weapon && route.at(-1)?.skill === loadout.skill) continue;
      route.push({ chapter: chapter.id, weapon: loadout.weapon, skill: loadout.skill });
    }
    report.builds.push({ id: build.id, name: build.name, stats: build.stats, source: build.source, path, route });
  }
  await mkdir("work/build-review", { recursive: true });
  await writeFile("work/build-review/catalogue.json", JSON.stringify(report, null, 2));
  await writeFile("work/build-review/weapon-paths.txt", report.builds.map((build) => `${build.id} | ${build.stats} | ${build.path.map((stage) => `${stage.weapon} [${stage.weapons.map((weapon) => weapon.gate?.chapterId || "ungated").join(",")}]`).join(" → ")}`).join("\n"));
  await writeFile("work/build-review/chapter-paths.txt", report.builds.map((build) => `${build.id} | ${build.stats} | ${build.route.map((stage) => `${stage.chapter}: ${stage.weapon}`).join(" → ")}`).join("\n"));
  const chapterNames = new Map(chapters.map((chapter) => [chapter.id, chapter.title]));
  const escape = (value) => value.replace(/\|/g, "\\|").replace(/\n/g, " ");
  const markdown = [
    "# Build weapon-route review", "",
    `Generated ${report.checkedAt.slice(0, 10)}. ${report.selectableBuilds} selectable builds across ${chapters.length} chapters.`, "",
    "This is the planner's computed acquisition schedule, not a claim that every loadout has been playtested. Difficulty placement is a planner decision; published guide links identify the actual build sources. Required boss/quest steps remain on the individual route cards. Starting-class equipment can be available before its world pickup.", "",
    "A temporary starter is retained until the defining weapon becomes obtainable. Explicit published multi-stage builds use their reviewed sequences; saved-run usage does not freeze a build. Skill changes on the same weapon do not mean buying another copy.", "",
    "| Build and source | Attributes | Weapon changes |", "| --- | --- | --- |",
    ...report.builds.map((build) => `| [${escape(build.name)}](${build.source.url}) | ${escape(build.stats)} | ${build.route.filter((step, index, route) => !index || route[index - 1].weapon !== step.weapon).map((step) => `${escape(chapterNames.get(step.chapter))}: ${escape(step.weapon)}`).join(" → ")} |`), "",
  ].join("\n");
  await writeFile("work/build-review/BUILD-ROUTES.md", markdown);
  console.log(`Reviewed ${report.builds.length} builds across ${chapters.length} chapters; report: work/build-review/catalogue.json`);
} finally {
  await server.close();
}
