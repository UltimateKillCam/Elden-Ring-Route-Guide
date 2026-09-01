import assert from "node:assert/strict";
import test from "node:test";

import { parseBuildLoadoutWikitext, parseFextralifeBuilds } from "../scripts/import-fextralife-builds.mjs";
import { assertNoUnresolvedArmourSpecifications, parseJerpArmourSource, regulationArmourRecords } from "../scripts/import-equipment-data.mjs";
import { normalizeWeaponName, parseBolsteringCatalogue, parseBolsteringTypes, regulationWeaponRecords, wikiWeaponRecord } from "../scripts/import-weapon-upgrades.mjs";

const buildFixture = {
  title: "Shadow Sunflower Blossom Build",
  categories: ["Category:Strength Builds"],
  wikitext: `{{Template:BuildLoadout
| name = Shadow Sunflower Blossom
| tagline = Shadow of the Erdtree &middot; Level 160
| class = Hero
| primarystats = [[Strength]], [[Faith]]
| weapon = Shadown Sunflower Blossom
| armor = [https://qa8.wiki.fextralife.com/Divine_Beast_Head Divine Beast Head|target=_blank]
| skills = [[Shadow Sunflower Headbutt]]
| flask = Equal Charges
 | crystaltear = [[Holy-Shrouding Cracked Tear]], [[Stonebarb Cracked Tear]]
}}
<htmltag tagname="h2" class="bonfire">Why Play the Shadow Sunflower Blossom Build in Elden Ring</htmltag>
Use the colossal flower's broad normal swings to control groups, then save its unique skill for long boss openings. Holy damage is the main payoff, while the weapon's physical damage keeps ordinary enemies manageable.
<htmltag tagname="h2" class="bonfire">How to Play the Shadow Sunflower Blossom Build</htmltag>
Use Shadow Sunflower Headbutt only when all three slams can land without trading through a boss combo.
<htmltag tagname="h2" class="bonfire">Related Elden Ring Builds</htmltag>`,
};

test("Fextralife build parsing is bounded and preserves known source corrections", () => {
  const records = parseFextralifeBuilds([buildFixture], { expectedCount: 1 });
  assert.equal(records[0].publishedLoadout.weapon, "Shadow Sunflower Blossom");
  assert.equal(records[0].phases.dlc, "Shadow Sunflower Blossom");
  assert.match(records[0].playstyle, /broad normal swings to control groups/);
  assert.match(records[0].playstyle, /all three slams can land without trading/);
  assert.doesNotMatch(records[0].playstyle, /Related Elden Ring Builds/);
  assert.equal(records[0].publishedLoadout.armour, "Divine Beast Head");
  assert.deepEqual(records[0].guideCategories, ["Strength Builds", "SOTE Builds"]);
  assert.deepEqual(records[0].publishedLoadout.talismans, []);
  assert.deepEqual(records[0].attributes, ["Strength", "Faith"]);
  assert.deepEqual(records[0].combatStyles, ["Melee", "Ranged"]);
  assert.throws(() => parseFextralifeBuilds([buildFixture], { expectedCount: 2 }), /Expected 2 Fextralife builds, parsed 1/);
  assert.throws(() => parseBuildLoadoutWikitext("{{Template:BuildLoadout\n| name = Broken"), /not closed/);
});

test("Fextralife build parsing resolves compound spell and reward defects", () => {
  const fixture = {
    title: "Death Mage Build",
    categories: ["Category:Intelligence Builds"],
    wikitext: `{{Template:BuildLoadout
| name = Death Mage
| tagline = Level 150
| primarystats = Intelligence
| weapon = Sword of Night and Flame, Golden Order Seal & Prince of Death Staff
| spells = Explosive Ghostflame. Terra Magica
| talismans = Rotten Winged Sword Insignia, Millicent's Prosthesis
}}`,
  };
  const [record] = parseFextralifeBuilds([fixture], { expectedCount: 1 });
  assert.equal(record.publishedLoadout.weapon, "Sword of Night and Flame, Golden Order Seal & Prince of Death's Staff");
  assert.deepEqual(record.publishedLoadout.spells, ["Explosive Ghostflame", "Terra Magica"]);
  assert.deepEqual(record.publishedLoadout.talismans, ["Rotten Winged Sword Insignia"]);
});

test("Fextralife classification overrides reject noisy or invented attributes", () => {
  const fixture = (name, primary, secondary, weapon) => ({
    title: `${name} Build`,
    categories: ["Category:PvE Builds"],
    wikitext: `{{Template:BuildLoadout
| name = ${name}
| primarystats = ${primary}
| secondarystats = ${secondary}
| weapon = ${weapon}
}}`,
  });
  const [cipher] = parseFextralifeBuilds([fixture("Cipher Prophet", "Faith, 12 Strength for weapons and shields", "10 Dexterity, 7 Intelligence, 10 Arcane (Prophet Initial)", "Cipher Pata")], { expectedCount: 1 });
  const [thorns] = parseFextralifeBuilds([fixture("Knight of Thorns", "Arcane, Vigor", "Mind, Faith, Intelligence", "Ripple Blade")], { expectedCount: 1 });
  const [duelist] = parseFextralifeBuilds([fixture("Level 80/90 Sorcerer Duelist", "Intelligence", "Vigor, Mind (do not meet the Strength requirement)", "Azur's Glintstone Staff")], { expectedCount: 1 });
  assert.deepEqual([cipher.stats, thorns.stats, duelist.stats], ["FAI", "ARC / INT", "INT"]);
  assert.deepEqual(cipher.attributes, ["Faith"]);
  assert.deepEqual(thorns.attributes, ["Arcane", "Intelligence"]);
  assert.deepEqual(duelist.attributes, ["Intelligence"]);
});

test("Jerp armour parsing rejects truncated, duplicate, and unresolved input", () => {
  const piece = { name: "Iron Helmet", itemID: 40000, slotType: 1, weight: 3.8, poise: 6 };
  const source = `const armor = ${JSON.stringify([piece])};`;
  assert.deepEqual(parseJerpArmourSource(source, { expectedCount: 1 }), [piece]);
  assert.throws(() => parseJerpArmourSource(source, { expectedCount: 2 }), /Expected 2 Jerp armour records, received 1/);
  assert.throws(() => parseJerpArmourSource(`const armor = ${JSON.stringify([piece, piece])};`, { expectedCount: 2 }), /Duplicate Jerp armour name/);
  assert.throws(() => parseJerpArmourSource(`const armor = ${JSON.stringify([{ ...piece, weight: null }])};`, { expectedCount: 1 }), /invalid weight/);
  assert.doesNotThrow(() => assertNoUnresolvedArmourSpecifications([]));
  assert.throws(() => assertNoUnresolvedArmourSpecifications(["Mystery knight outfit"]), /Mystery knight outfit/);
});

test("wiki.gg weapon import validation fails instead of manufacturing missing details", () => {
  const entry = { name: "Longsword", pageTitle: "Longsword", upgrade: "Normal", dlc: false };
  const detail = `{{Infobox Weapon
| type = Straight Sword
| weight = 3.5
| str_req = 10
| dex_req = 10
| int_req = -
| fai_req = -
| arc_req = -
}}`;
  assert.deepEqual(wikiWeaponRecord(entry, detail), {
    name: "Longsword",
    type: "Normal",
    weaponClass: "Straight Sword",
    weight: 3.5,
    reqStr: 10,
    reqDex: 10,
    reqInt: 0,
    reqFai: 0,
    reqArc: 0,
  });
  assert.throws(() => wikiWeaponRecord(entry, ""), /data is missing/);
  assert.throws(() => wikiWeaponRecord(entry, detail.replace("weight = 3.5", "weight = unknown")), /invalid weight/);
  assert.throws(() => wikiWeaponRecord(entry, detail.replace("str_req = 10", "str_req = 100")), /invalid str_req/);
  assert.throws(() => wikiWeaponRecord(entry, detail.replace("type = Straight Sword", "type =")), /no weapon class/);
});

test("wiki.gg bolstering parsing verifies source shape and count", () => {
  const source = [
    "[[File:Longsword.png|link=Longsword]] [[Longsword]] [[Smithing Stones|Smithing Stone]]",
    "[[File:Moonveil.png|link=Moonveil]] [[Moonveil]] [[Somberstones|Somberstone]]",
  ].join("\n|-\n");
  const upgrades = parseBolsteringTypes(source, { expectedCount: 2 });
  assert.equal(upgrades.get("longsword"), "Normal");
  assert.equal(upgrades.get("moonveil"), "Somber");
  assert.throws(() => parseBolsteringTypes(source, { expectedCount: 3 }), /Expected 3 wiki.gg bolstering records, parsed 2/);
  assert.throws(() => parseBolsteringTypes("", { expectedCount: 0 }), /source is empty/);
});

test("wiki.gg armament catalogue retains display names, DLC markers, and unupgradable weapons", () => {
  const source = [
    "[[File:Longsword.png|link=Longsword]] [[Longsword]]\n|[[Smithing Stones|Smithing Stone]]",
    "[[File:Madding Hand.png|link=Madding Hand (weapon)]] [[Madding Hand (weapon)|Madding Hand]]<sup>{{SOTE}}</sup>\n|[[Somberstones|Somberstone]]",
    "[[File:Meteorite Staff.png|link=Meteorite Staff]] [[Meteorite Staff]]\n|{{No}} Unupgradable",
  ].join("\n|-\n");
  assert.deepEqual(parseBolsteringCatalogue(source, { expectedCount: 3 }), [
    { pageTitle: "Longsword", name: "Longsword", upgrade: "Normal", dlc: false },
    { pageTitle: "Madding Hand (weapon)", name: "Madding Hand", upgrade: "Somber", dlc: true },
    { pageTitle: "Meteorite Staff", name: "Meteorite Staff", upgrade: "None", dlc: false },
  ]);
  assert.throws(() => parseBolsteringCatalogue(`${source}\n|-\n${source.split("\n|-\n")[0]}`, { expectedCount: 4 }), /Duplicate wiki.gg armament name/);
});

test("weapon importer identity ignores Latin diacritics without losing words", () => {
  assert.equal(normalizeWeaponName("Great Épée"), normalizeWeaponName("Great Epee"));
  assert.equal(normalizeWeaponName("Miséricorde"), normalizeWeaponName("Misericorde"));
});

test("regulation 1.17 supplements are bounded and reject duplicate IDs", () => {
  assert.equal(regulationWeaponRecords().length, 8);
  assert.equal(regulationArmourRecords().length, 18);
  const weapons = regulationWeaponRecords();
  assert.deepEqual(
    weapons.find((record) => record.name === "Idus Sword"),
    { name: "Idus Sword", type: "Normal", weaponClass: "Light Greatsword", weight: 7, reqStr: 10, reqDex: 15, reqInt: 0, reqFai: 0, reqArc: 0 },
  );
  assert.throws(() => regulationWeaponRecords([
    { regulationId: 1, ...weapons[0] },
    { regulationId: 1, ...weapons[1] },
    ...Array.from({ length: 6 }, (_, index) => ({ regulationId: index + 2, ...weapons[index + 2] })),
  ]), /Duplicate regulation weapon ID/);
});
