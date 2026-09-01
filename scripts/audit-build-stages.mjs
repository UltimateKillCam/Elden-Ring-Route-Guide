import { createServer } from "vite";

const phases = ["early", "mid", "late", "dlc"];
const phaseLevels = { early: 60, mid: 90, late: 150, dlc: 170 };
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });

try {
  const catalogue = await server.ssrLoadModule("/app/data.ts");
  const weapons = await server.ssrLoadModule("/app/weapon-upgrades.ts");
  const planner = await server.ssrLoadModule("/app/run-planner.ts");
  const failures = [];
  const warnings = [];

  for (const build of catalogue.builds) {
    for (const phase of phases) {
      const stage = catalogue.stageLoadout(build, phase);
      const records = [
        ...weapons.findWeaponUpgradeRecords(stage.weapon),
        ...weapons.findWeaponUpgradeRecords(stage.offhand),
      ];
      const requirements = {};
      for (const record of records) {
        for (const [stat, value] of Object.entries({
          strength: record.reqStr,
          dexterity: record.reqDex,
          intelligence: record.reqInt,
          faith: record.reqFai,
          arcane: record.reqArc,
        })) if (value > 0) requirements[stat] = Math.max(requirements[stat] || 0, value);
      }
      const plannedClass = build.startingClass === "Not specified"
        ? planner.planBuildStatTarget(build, 170).origin.name
        : build.startingClass;
      const plan = planner.planBuildStatTarget(
        { ...build, startingClass: plannedClass },
        phaseLevels[phase],
        requirements,
      );
      if (plan.notes.some((note) => note.startsWith("RL") && note.includes("too low"))) {
        failures.push(`${build.id} ${phase}: RL${phaseLevels[phase]} cannot fund ${stage.weapon} + ${stage.offhand}`);
      }

      const spellText = stage.spells.join(" | ");
      const sorceryText = stage.spells.filter((spell) => !/\bbreath\b/i.test(spell)).join(" | ");
      const equipped = `${stage.weapon} ${stage.offhand}`;
      const needsStaff = /glint|comet|phalanx|sorcer|terra magica|moon|rancor|meteor|carian|haima|icecrag|rock sling|briar|thorn/i.test(sorceryText);
      const needsSeal = /golden vow|flame|lightning|black flame|blessing|heal|rejection|darkness|bloodflame|electrify|dragon|aeonia|pest|swarm|bloodboon|elden stars|gurranq|wrath/i.test(spellText);
      const hasStaff = records.some((record) => /glintstone staff/i.test(record.weaponClass)) || /staff|scepter|great beyond/i.test(equipped);
      const hasSeal = records.some((record) => /sacred seal/i.test(record.weaponClass)) || /seal|great beyond/i.test(equipped);
      if (needsStaff && !hasStaff) failures.push(`${build.id} ${phase}: sorceries have no staff`);
      if (needsSeal && !hasSeal) failures.push(`${build.id} ${phase}: incantations have no seal`);

      const talismanText = stage.talismans.join(" | ");
      if (/Rotten Winged Sword Insignia/i.test(talismanText) && /Millicent['’]s Prosthesis/i.test(talismanText)) {
        failures.push(`${build.id} ${phase}: mutually exclusive Millicent rewards`);
      }
      const allText = [stage.weapon, stage.offhand, stage.skill, stage.armour, stage.flask, ...stage.spells, ...stage.talismans].join(" | ");
      if (/not specified by source|recommended starting-class|best available|build-specific/i.test(allText) && !build.tags.includes("meme")) {
        warnings.push(`${build.id} ${phase}: ${allText}`);
      }
    }
  }

  console.log(`Audited ${catalogue.builds.length * phases.length} stage cards.`);
  console.log(`Hard failures: ${failures.length}`);
  if (failures.length) console.log(failures.join("\n"));
  console.log(`Unresolved non-meme fields: ${warnings.length}`);
  if (warnings.length) console.log(warnings.join("\n"));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
