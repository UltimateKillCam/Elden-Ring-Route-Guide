import type { Build } from "./data";

export const additionalSourcedBuilds: Build[] = [
  {
    id: "game8-wing-stance-milady",
    name: "Wing Stance Milady",
    stats: "STR / DEX / FAI",
    role: "Melee",
    playstyle: "Game8's two-handed Quality Milady setup uses Wing Stance for fast multi-hit strings, leaping thrusts and poise damage. The Finger Seal is carried only to cast buffs; there is no shield or guard-counter plan.",
    complexity: "Published guide",
    phases: {
      early: "Sourced bridge until Milady",
      mid: "Sourced bridge until Milady",
      late: "Sourced bridge until Milady",
      dlc: "Quality Milady + Wing Stance",
    },
    tags: ["milady", "wing stance", "quality", "two-handed", "multi-hit", "no shield"],
    startingClass: "Samurai",
    mechanic: "Light attacks",
    collection: "Other guides",
    availableFrom: "dlc",
    phaseBridges: {
      early: "fextra-berserker",
      mid: "fextra-champion",
      late: "fextra-slumberingswordstress",
    },
    publishedLoadout: {
      level: "RL 150–192",
      weapon: "Quality Milady +25",
      offhand: "Finger Seal for buffs only; no shield",
      skill: "Wing Stance",
      talismans: ["Rellana's Cameo", "Millicent's Prosthesis", "Rotten Winged Sword Insignia"],
      armour: "No specific armour required by the source; keep a medium roll",
      spells: ["Golden Vow", "Flame, Grant Me Strength"],
      flask: "Stonebarb Cracked Tear + Thorny Cracked Tear",
      stats: "VIG 60, MND 25, END 30, STR 54, DEX 60, INT 9, FAI 25, ARC 8 at RL 192; the source also gives an RL 150 starting point",
    },
    source: {
      label: "Game8: Wing Stance Milady Build Guide",
      url: "https://game8.co/games/Elden-Ring/archives/460059",
    },
  },
];
