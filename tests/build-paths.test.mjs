import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";

const PHASES = ["early", "mid", "late", "dlc"];
const DAMAGE_STATS = ["STR", "DEX", "INT", "FAI", "ARC"];

let cataloguePromise;
let catalogueServer;

function loadCatalogue() {
  cataloguePromise ??= (async () => {
    catalogueServer = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
    const data = await catalogueServer.ssrLoadModule("/app/data.ts");
    const weapons = await catalogueServer.ssrLoadModule("/app/weapon-upgrades.ts");
    const questRoute = await catalogueServer.ssrLoadModule("/app/quest-route.ts");
    const mapItems = await catalogueServer.ssrLoadModule("/app/map-items.ts");
    const planner = await catalogueServer.ssrLoadModule("/app/run-planner.ts");
    const questTracks = await catalogueServer.ssrLoadModule("/app/quest-tracks.ts");
    const access = await catalogueServer.ssrLoadModule("/app/access-graph.ts");
    const buffs = await catalogueServer.ssrLoadModule("/app/buffs.ts");
    const progression = await catalogueServer.ssrLoadModule("/app/progression.ts");
    const resolutions = await catalogueServer.ssrLoadModule("/app/weapon-resolutions.ts");
    return { ...data, ...weapons, ...questRoute, ...mapItems, ...planner, ...questTracks, ...access, ...buffs, ...progression, ...resolutions, close: async () => undefined };
  })();
  return cataloguePromise;
}

after(async () => { if (catalogueServer) await catalogueServer.close(); });

test("optional quest dependencies and core access gates remain explicit", async () => {
  const catalogue = await loadCatalogue();
  try {
    assert.deepEqual(new Set(catalogue.expandQuestTrackIds(["hyetta"])), new Set(["hyetta", "irina-edgar", "frenzied-flame"]));
    assert.deepEqual(new Set(catalogue.expandQuestTrackIds(["dung-eater"])), new Set(["dung-eater"]), "Boggart is useful but not required for Dung Eater");
    assert.equal(catalogue.optionalQuestTracksForLabel("Meet Rya and recover her necklace without killing Boggart").includes("blackguard-boggart"), true);
    assert.equal(catalogue.CHAPTER_ACCESS.gravesite.requirements.includes("Defeat Mohg"), true);
    assert.equal(catalogue.CHAPTER_ACCESS.ainsel.requirements.includes("Use Renna's Rise waygate and collect Miniature Ranni"), true);
    assert.equal(catalogue.isAccessRequirementTask("stormveil", "Defeat Margit"), true);
    assert.equal(catalogue.isAccessRequirementTask("stormveil", "Defeat Godrick the Grafted"), false);
    assert.ok(catalogue.selectableBuilds.length < catalogue.builds.length, "unaudited local experiments should not be assignable to new runs");
    assert.deepEqual(catalogue.selectableBuilds.filter((build) => build.collection === "Curated" && ["Quality Knight", "Colossal Hammer"].includes(build.name)).map((build) => build.name), ["Quality Knight", "Colossal Hammer"]);
  } finally {
    await catalogue.close();
  }
});

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

test("the optional Gurranq route accounts for every Deathroot and the hostile checkpoint", async () => {
  const catalogue = await loadCatalogue();
  try {
    const gurranqCards = catalogue.chapters.flatMap((chapter) => chapter.essentials.filter((label) => catalogue.optionalQuestTracksForLabel(label).includes("d-gurranq")));
    assert.equal(gurranqCards.filter((label) => /Deathroot|Summonwater Village Tibia Mariner/.test(label)).length, 10, "opening encounter plus Deathroots two through nine must all be routed");
    assert.ok(gurranqCards.includes("Give Gurranq Deathroots three and four, then calm him"));
    assert.match(catalogue.QUEST_STEP_GUIDES["Give Gurranq Deathroots three and four, then calm him"], /30%.*Do not kill/is);
  } finally {
    await catalogue.close();
  }
});

const statCodes = (build) => DAMAGE_STATS.filter((stat) => build.stats.toUpperCase().includes(stat));

test("the selectable catalogue has stable contiguous numbers and distinct researched guidance", async () => {
  const catalogue = await loadCatalogue();
  try {
    assert.equal(catalogue.selectableBuilds.length, 200);
    assert.deepEqual(catalogue.selectableBuilds.map((build) => catalogue.catalogueNumber(build)), Array.from({ length: 200 }, (_, index) => index + 1));
    for (const build of catalogue.selectableBuilds) {
      assert.equal(catalogue.catalogueNumber({ ...build }), catalogue.catalogueNumber(build), `${build.name} numbering depends on object identity`);
      assert.ok(build.playstyle.length >= 200, `${build.name} lacks a detailed combat description`);
      assert.doesNotMatch(build.playstyle, /^Published .* setup using /i, `${build.name} retained generic importer prose`);
      for (const phase of PHASES) {
        const stage = catalogue.stageLoadout(build, phase);
        assert.ok(stage.weapon && stage.skill && stage.stats, `${build.name} ${phase} lacks actionable progression`);
      }
    }
    assert.equal(new Set(catalogue.selectableBuilds.map((build) => build.playstyle.toLowerCase())).size, 200, "build descriptions must be unique");
    assert.equal(catalogue.catalogueNumber("meme-jar-jar"), 200);
  } finally {
    await catalogue.close();
  }
});

test("every generated progression bridge is source-backed, timely and stat-compatible", async () => {
  const catalogue = await loadCatalogue();
  try {
    assert.equal(catalogue.builds.length, 282);
    for (const build of catalogue.builds) {
      for (const phase of PHASES) {
        const stage = catalogue.stageLoadout(build, phase);
        if (build.collection === "Curated") {
          assert.equal(stage.sourceUse, "curated-baseline", `${build.name} ${phase} has no published baseline`);
        }
        if (!stage.borrowedFrom) continue;
        const source = catalogue.builds.find((candidate) => candidate.name === stage.borrowedFrom.buildName && candidate.source.url === stage.borrowedFrom.url);
        assert.ok(source?.publishedStages?.[phase] || source?.publishedLoadout, `${build.name} ${phase} points to a missing source build`);
        assert.ok(source.publishedStages?.[phase] || source.guideCategories?.includes("All Game Builds") || PHASES.indexOf(source.availableFrom || "early") <= PHASES.indexOf(phase), `${build.name} ${phase} borrows future gear from ${source.name}`);
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

test("temporary bridges borrow only a sourced weapon lane", async () => {
  const catalogue = await loadCatalogue();
  try {
    const targetFields = ["level", "offhand", "talismanSlots", "talismans", "armour", "spells", "flask"];
    const chapterIndex = new Map(catalogue.chapters.map((chapter, index) => [chapter.id, index]));
    const phaseStarts = PHASES.map((phase) => chapterIndex.get(catalogue.PHASE_START[phase]));
    let checked = 0;
    for (const build of catalogue.selectableBuilds.filter((candidate) => candidate.publishedLoadout)) {
      const availableIndex = PHASES.indexOf(build.availableFrom || "early");
      for (const phase of PHASES.slice(0, availableIndex)) {
        const stage = catalogue.stageLoadout(build, phase);
        const baseline = catalogue.stageLoadout({
          ...build,
          publishedLoadout: undefined,
          publishedStages: undefined,
          phaseBridges: undefined,
        }, phase);
        assert.equal(stage.sourceUse, "temporary-stage", `${build.name} ${phase} lacks bridge provenance`);
        for (const field of targetFields) {
          assert.deepEqual(stage[field], baseline[field], `${build.name} ${phase} copied bridge ${field}`);
        }
        assert.ok(stage.stats.startsWith(baseline.stats), `${build.name} ${phase} replaced target stat guidance`);
        const phaseIndex = PHASES.indexOf(phase);
        const phaseEnd = phaseIndex === PHASES.length - 1 ? Number.POSITIVE_INFINITY : phaseStarts[phaseIndex + 1] - 1;
        const timedFields = [
          [stage.talismans, /talisman/i],
          [stage.spells, /spell/i],
          [[stage.flask], /flask/i],
        ];
        for (const [items, categoryPattern] of timedFields) {
          for (const item of items) {
            const timing = catalogue.deferredPickupGate(item, { preferredLayer: phase === "dlc" ? "shadow" : undefined, categoryPattern });
            if (!timing) continue;
            assert.ok(chapterIndex.get(timing.chapterId) <= phaseEnd, `${build.name} ${phase} names ${item} before ${timing.chapterId}`);
          }
        }
        assert.equal(stage.talismans.includes("Rotten Winged Sword Insignia") && stage.talismans.includes("Millicent's Prosthesis"), false, `${build.name} ${phase} requires mutually exclusive Millicent rewards`);
        checked += 1;
      }
    }
    assert.ok(checked > 300, "expected to validate the full late/DLC bridge catalogue");

    const sourced = catalogue.builds.find((candidate) => candidate.id === "mobalytics-bloodhounds-fang");
    const snapshot = structuredClone(sourced);
    const early = catalogue.stageLoadout(sourced, "early");
    assert.deepEqual(early.talismans, sourced.publishedStages.early.talismans, "explicit published stages must remain authoritative");
    assert.deepEqual(sourced, snapshot, "stage generation must not mutate source records");
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

test("map identity, acquisition gates and quest anchors stay unambiguous", async () => {
  const catalogue = await loadCatalogue();
  try {
    assert.equal(catalogue.findMapItems("Dragoncrest Shield Talisman +2", "surface", /talisman/i)[0]?.name, "Dragoncrest Shield Talisman +2");
    assert.notEqual(catalogue.literalItemName("Dragoncrest Shield Talisman +2"), catalogue.literalItemName("Dragoncrest Shield Talisman"));
    assert.equal(catalogue.literalItemName("Great Épée"), catalogue.literalItemName("Great Epee"));
    assert.equal(catalogue.literalItemName("Miséricorde"), catalogue.literalItemName("Misericorde"));
    assert.equal(catalogue.findWeaponUpgradeRecord("Great Epee")?.name, "Great Épée");
    assert.equal(catalogue.findWeaponUpgradeRecord("Miséricorde")?.name, "Misericorde");
    assert.equal(catalogue.findMapItems("Beast Claw", "shadow", /weapon/i)[0]?.layer, "shadow");
    assert.equal(catalogue.findMapItems("Beast Claw", "surface", /spell/i)[0]?.layer, "surface");
    assert.equal(catalogue.deferredPickupGate("Beast Claw", { preferredLayer: "shadow", categoryPattern: /weapon/i })?.chapterId, "gravesite");
    assert.equal(catalogue.deferredPickupGate("Beast Claw", { preferredLayer: "surface", categoryPattern: /spell/i })?.chapterId, "altus");
    assert.equal(catalogue.deferredPickupGate("Bloody Slash")?.chapterId, "first-steps");
    assert.equal(catalogue.deferredPickupGate("Ash of War: Bloody Slash")?.chapterId, "first-steps");
    const exactGates = [
      ["Ash of War: Square Off", "first-steps"],
      ["Ash of War: Troll's Roar", "mountaintops"],
      ["Assassin's Cerulean Dagger", "caria"],
      ["Horn Bow", "first-steps"],
      ["Gargoyle's Twinblade", "deeproot"],
      ["Wing of Astel", "ainsel"],
      ["Magic Scorpion Charm", "altus"],
      ["Taker's Cameo", "mountaintops"],
      ["Swarm of Flies", "mohgwyn"],
      ["White Mask", "mohgwyn"],
      ["Old Lord's Talisman", "farum"],
      ["Talisman of the Dread", "gravesite"],
      ["Bloodsucking Cracked Tear", "shadow-keep"],
      ["Gaius's Greaves", "gaius-avatar"],
      ["Carian Sorcery Sword", "ensiss"],
      ["Ancient Meteoric Ore Greatsword", "ensiss"],
      ["Rakshasa's Great Katana", "shadow-keep"],
      ["Staff of the Great Beyond", "metyr"],
    ];
    for (const [item, chapterId] of exactGates) {
      assert.equal(catalogue.deferredPickupGate(item)?.chapterId, chapterId, `${item} has the wrong acquisition chapter`);
    }
    assert.equal(catalogue.deferredPickupGate("Gargoyle's Twinblade")?.after, "Defeat the Valiant Gargoyles");
    assert.equal(catalogue.deferredPickupGate("Gaius's Greaves")?.difficulty, "enemy");
    assert.equal(catalogue.deferredPickupGate("Bloodsucking Cracked Tear")?.difficulty, "boss");
    for (const item of ["Graven-Mass Talisman", "Meteorite of Astel", "Explosive Ghostflame", "Unendurable Frenzy"]) {
      assert.equal(catalogue.deferredPickupGate(item)?.chapterId, "haligtree", `${item} must wait for Consecrated Snowfield access`);
    }

    const ainsel = catalogue.chapters.find((chapter) => chapter.id === "ainsel").essentials;
    assert.ok(ainsel.indexOf("Collect the Dark Moon Greatsword") > ainsel.indexOf("Give Ranni the Dark Moon Ring beneath Cathedral of Manus Celes"));
    assert.ok(ainsel.indexOf("Resolve Blaidd and Iji's aftermath") > ainsel.indexOf("Collect the Dark Moon Greatsword"));
    const haligtree = catalogue.chapters.find((chapter) => chapter.id === "haligtree").essentials;
    assert.ok(haligtree.indexOf("Collect the ninth Deathroot in Hidden Path to the Haligtree") > haligtree.indexOf("Hoist the secret medallion at the Grand Lift of Rold"));
    const caria = catalogue.chapters.find((chapter) => chapter.id === "caria").essentials;
    assert.ok(caria.indexOf("Collect the third Deathroot from the eastern Liurnia Tibia Mariner") < caria.indexOf("Defeat Vyke and give Hyetta the Fingerprint Grape"));
    assert.ok(caria.indexOf("Defeat Vyke and give Hyetta the Fingerprint Grape") < caria.indexOf("Clear Black Knife Catacombs and give the Black Knifeprint to Rogier"));
    const leyndell = catalogue.chapters.find((chapter) => chapter.id === "leyndell").essentials;
    assert.ok(leyndell.indexOf("Optional: finish Hyetta beneath Leyndell") < leyndell.indexOf("Speak to Melina at East Capital Rampart"));
    assert.ok(leyndell.indexOf("Speak to Melina at East Capital Rampart") < leyndell.indexOf("Defeat Morgott"));
    assert.throws(
      () => catalogue.applyQuestRoutePatches({ id: "haligtree", essentials: ["unrelated"] }),
      /missing.*anchor/i,
      "a renamed quest anchor must fail validation instead of appending",
    );
  } finally {
    await catalogue.close();
  }
});

test("phase-specific resolutions and corrected route cards stay progression-safe", async () => {
  const catalogue = await loadCatalogue();
  try {
    const fextra = catalogue.builds.filter((build) => build.collection === "Fextralife");
    assert.equal(fextra.length, 171);
    for (const name of ["Knight of Thorns", "Champion of Rot", "Acolyte", "Black Blade Slicer", "Cipher Prophet", "Flying Mantis", "Ghostflame Warrior", "Roundtable Assassin", "Silent Spellblade", "Zealous Fury Templar", "Level 30 Poison/Bleed Wretch", "Level 60 St. Trina's Confessor", "Level 75 Sanguine Lightning Assassin", "Level 80/90 Sorcerer Duelist"]) {
      assert.ok(fextra.some((build) => build.name === name), `canonical Fextralife build is missing: ${name}`);
    }
    assert.deepEqual(fextra.filter((build) => ["Mage", "Status Blademaster", "Dark Knight"].includes(build.name)), []);
    assert.ok(fextra.every((build) => !/\/Builds#/.test(build.source.url)), "Fextralife builds must use canonical dedicated-page URLs");
    assert.equal(fextra.filter((build) => build.tags.includes("pvp")).length, 4);
    assert.ok(fextra.filter((build) => build.tags.includes("pvp")).every((build) => build.availableFrom === "late"), "PvP twink loadouts must wait for their actual late-game gear");
    for (const id of Object.keys(catalogue.weaponResolutions)) assert.ok(catalogue.builds.some((build) => build.id === id), `orphaned weapon resolution: ${id}`);

    const allLabels = catalogue.chapters.flatMap((chapter) => chapter.essentials);
    assert.equal(allLabels.filter((label) => label === "Get Black Syrup from Moore and give it to Thiollier").length, 1);
    assert.equal(allLabels.filter((label) => /defeat eleonora/i.test(label)).length, 1);
    assert.equal(catalogue.chapters.find((chapter) => chapter.id === "gaius-avatar").boss, "Commander Gaius, Scadutree Avatar");
    assert.ok(catalogue.chapters.find((chapter) => chapter.id === "metyr").essentials.includes("Defeat Metyr after ringing the Miyr bell"));
    assert.equal(catalogue.chapters.find((chapter) => chapter.id === "academy").essentials.some((label) => /respec|rebirth/i.test(label)), false);
  } finally {
    await catalogue.close();
  }
});

test("build rewards enable only their actual optional quest tracks", async () => {
  const catalogue = await loadCatalogue();
  try {
    const tracksFor = (id) => catalogue.requiredQuestTracksForBuild(catalogue.builds.find((build) => build.id === id));
    assert.equal(tracksFor("strength-fist").includes("blackguard-boggart"), false, "Star Fist is a Leyndell pickup, not a Boggart reward");
    assert.equal(tracksFor("mobile-claw").includes("d-gurranq"), false, "the DLC Beast Claw weapon is unrelated to Gurranq");
    assert.equal(tracksFor("bestial-cleric").includes("d-gurranq"), true, "Bestial rewards must retain Gurranq's route");
    assert.equal(catalogue.optionalQuestTracksForLabel("Meet Knight Bernahl at Warmaster's Shack").includes("volcano-manor"), true);
    assert.deepEqual(catalogue.CHAPTER_ACCESS.rauh.requirements, ["Defeat Messmer", "Collect Messmer's Kindling"]);
  } finally {
    await catalogue.close();
  }
});

test("sourced active buffs have an acquisition, support equipment and route timing", async () => {
  const catalogue = await loadCatalogue();
  try {
    const recognised = new Set();
    for (const build of catalogue.selectableBuilds) {
      for (const phase of PHASES) {
        const loadout = catalogue.stageLoadout(build, phase);
        for (const buff of catalogue.buffsForLoadout(loadout)) {
          recognised.add(buff.id);
          assert.ok(buff.acquisition.length > 50, `${buff.name} lacks acquisition instructions`);
          assert.ok(buff.activation.length > 40, `${buff.name} lacks equip/use instructions`);
          assert.ok(catalogue.deferredPickupGate(buff.acquisitionItem) || catalogue.findMapItems(buff.acquisitionItem).length, `${buff.name} lacks a progression gate or sourced map marker`);
          if (buff.memorySlots) assert.ok(buff.catalyst, `${buff.name} lacks a catalyst`);
        }
      }
    }
    assert.ok(recognised.has("golden-vow-spell"));
    assert.ok(recognised.has("flame-grant-me-strength"));
    assert.ok(recognised.has("bloodflame-blade"));
    assert.ok(recognised.has("scholars-armament"));
    for (const buildId of ["mobalytics-moonveil", "fextra-stormblessed"]) {
      const loadout = catalogue.stageLoadout(catalogue.builds.find((build) => build.id === buildId), "early");
      assert.match(loadout.skill, /default skill/i, `${buildId} should identify its intrinsic starter skill`);
      assert.deepEqual(catalogue.buffsForLoadout({ spells: [], skill: loadout.skill }), [], `${buildId} should not create an Ash pickup for an intrinsic skill`);
    }
    const routine = catalogue.buffRoutine({ spells: ["Golden Vow", "Flame Grant me Strength"], skill: "Cragblade" });
    assert.match(routine, /memorize Golden Vow \(1 slot\).*Flame, Grant Me Strength \(1 slot\).*Sacred Seal/i);
    assert.match(routine, /1\) Golden Vow.*2\) Cragblade.*3\) Flame, Grant Me Strength/i);
    assert.deepEqual(catalogue.buffsForLoadout({ spells: ["Golden Vow (Ash of War before 25 FAI)"], skill: "Default skill" }).map((buff) => buff.id), ["golden-vow-ash"]);
  } finally {
    await catalogue.close();
  }
});
