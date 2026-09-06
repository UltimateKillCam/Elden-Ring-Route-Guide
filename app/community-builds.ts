import type { Build } from "./data";

// Published equipment read from EIP's public build-planner records on 2026-09-06.
// The planner supplies acquisition timing and a compatible starter, not invented
// author breakpoints. Great Runes and Scadutree Blessings are not assumed active.
export const communityBuilds: Build[] = [
  {
    id: "eip-bleed-brawler", name: "Bleed Brawler — Cragblade Star Fist",
    stats: "STR / FAI", attributes: ["Strength", "Faith"], combatStyles: ["Melee"], role: "Melee",
    playstyle: "nfroude10's published Strength/Faith fist build uses Heavy Star Fist with Cragblade and charged attacks. Golden Vow and Flame, Grant Me Strength support the physical damage. Great Stars with Prayerful Strike is the author's alternative, not a required intermediate weapon; this route stays with fists. The published Millicent's Prosthesis choice conflicts with her assistance reward. Two-hand the fist weapon to use the paired moveset; one copy supplies both hands. The two named Crystal Tears support charged attacks and stance pressure. No Great Rune bonus is assumed in the stat plan, and the DLC Viridian Amber Medallion +3 is deferred until its own route chapter.",
    complexity: "Published guide", startingClass: "Wretch", mechanic: "Charged attacks", collection: "Other guides", availableFrom: "late",
    phases: { early: "Fist starter", mid: "Keep the fist starter", late: "Heavy Star Fist", dlc: "Heavy Star Fist" },
    tags: ["star fist", "cragblade", "charged attacks", "stance", "bleed", "eip", "published community build"],
    publishedLoadout: {
      level: "RL 150", weapon: "Heavy Star Fist", offhand: "Clawmark Seal", skill: "Cragblade",
      talismans: ["Axe Talisman", "Viridian Amber Medallion +3", "Winged Sword Insignia", "Millicent's Prosthesis"],
      armour: "Rotten Gravekeeper Cloak (Altered), Sorcerer Manchettes, Rotten Duelist Greaves",
      spells: ["Golden Vow", "Flame, Grant Me Strength"], flask: "Spiked Cracked Tear + Stonebarb Cracked Tear",
      stats: "VIG 50, MND 14, END 30, STR 80, DEX 10, INT 10, FAI 25, ARC 10",
    },
    source: { label: "EIP / nfroude10: Bleed Brawler", url: "https://eip.gg/elden-ring/builds/bleed-brawler-star-fist-great-stars/" },
  },
  {
    id: "eip-winterlion-bloodfiend", name: "Winterlion — Bloodfiend's Arm",
    stats: "STR / ARC / FAI", attributes: ["Strength", "Arcane", "Faith"], combatStyles: ["Melee"], role: "Melee",
    playstyle: "Winterlion's published setup pairs a Blood-affinity Bloodfiend's Arm with Cragblade, charged attacks and Golden Vow/Flame, Grant Me Strength. It uses Chain armour and a Dragon Communion Seal. Keep the heavy-weapon starter through the base game, then collect the arm in Prospect Town. The author's earlier Physick alternative is Stonebarb Cracked Tear; Bloodsucking Cracked Tear is a later optional replacement with a continuous HP drain. Use the paired charged-attack talisman and Physick bonuses for heavy openings, and leave stamina for the next dodge. The source is RL 199, not a level-150 stat spread, and its Great Rune is not assumed active by this planner.",
    complexity: "Published guide", startingClass: "Vagabond", mechanic: "Charged attacks", collection: "Other guides", availableFrom: "dlc",
    phases: { early: "Heavy-weapon starter", mid: "Keep the heavy-weapon starter", late: "Keep the heavy-weapon starter", dlc: "Blood Bloodfiend's Arm" },
    tags: ["bloodfiend arm", "blood affinity", "arcane", "cragblade", "charged attacks", "bleed", "eip", "published community build"],
    publishedLoadout: {
      level: "RL 199", weapon: "Blood Bloodfiend's Arm", offhand: "Dragon Communion Seal", skill: "Cragblade",
      talismans: ["Two-Handed Sword Talisman", "Axe Talisman", "Lord of Blood's Exultation", "Erdtree's Favor +2"],
      armour: "Chain Coif, Chain Armor, Chain Gauntlets, Chain Leggings",
      spells: ["Golden Vow", "Flame, Grant Me Strength"], flask: "Stonebarb Cracked Tear + Spiked Cracked Tear",
      stats: "VIG 50, MND 15, END 45, STR 50, DEX 13, INT 10, FAI 25, ARC 70",
    },
    source: { label: "EIP: Winterlion BloodFiend Arm", url: "https://eip.gg/elden-ring/builds/winterlion-bloodfiend-arm/" },
  },
];
