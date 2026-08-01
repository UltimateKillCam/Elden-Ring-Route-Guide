import assert from "node:assert/strict";
import test from "node:test";

import { isGenericArmourSpecification, splitArmourSpecification } from "../app/equipment-data.ts";
import { findWeaponUpgradeRecord, weaponUpgradePath } from "../app/weapon-upgrades.ts";

test("starting and sourced armour sets expand into exact weighted pieces", () => {
  const vagabond = splitArmourSpecification("Vagabond starting armour");
  assert.equal(vagabond.length, 4);
  assert.equal(vagabond.reduce((sum, piece) => sum + piece.weight, 0), 23.8);
  assert.deepEqual(splitArmourSpecification("Carian Knight Set").map((piece) => piece.slot), ["head", "chest", "arms", "legs"]);
  assert.equal(isGenericArmourSpecification("N/A; wear anything that allows a medium roll"), true);
});

test("calculator weapon records supply path, weight and requirements", () => {
  const moonveil = findWeaponUpgradeRecord("Moonveil + Transient Moonlight");
  assert.equal(moonveil?.weight, 6.5);
  assert.equal(moonveil?.reqInt, 23);
  assert.equal(weaponUpgradePath("Moonveil"), "somber");
  assert.equal(weaponUpgradePath("Longsword"), "standard");
  assert.equal(weaponUpgradePath("Meteorite Staff"), "none");
  assert.equal(weaponUpgradePath("Rellana's Twin Blades"), "somber");
  assert.equal(weaponUpgradePath("Milady + Wing Stance"), "standard");
});
