export type AccessRequirement = {
  chapterId: string;
  requirements: string[];
  evidence: string;
};

// These are traversal/boss requirements, not merely suggested route order. They are
// kept outside the prose so tests can prove that a later card is never presented as
// physically reachable before its prerequisite chapter has been cleared.
export const CHAPTER_ACCESS: Record<string, AccessRequirement> = {
  stormveil: { chapterId: "stormveil", requirements: ["Defeat Margit"], evidence: "https://eldenring.wiki.gg/wiki/Bosses#Facing_the_shardbearers" },
  academy: { chapterId: "academy", requirements: ["Collect Academy Glintstone Key"], evidence: "https://eldenring.wiki.gg/wiki/Academy_Glintstone_Key" },
  caelid: { chapterId: "caelid", requirements: ["Confirm the Radahn Festival through Blaidd or Iji"], evidence: "https://eldenring.wiki.gg/wiki/Starscourge_Radahn#First_Encounter_(Starscourge_Radahn)" },
  nokron: { chapterId: "nokron", requirements: ["Defeat Starscourge Radahn"], evidence: "https://eldenring.wiki.gg/wiki/Nokron,_Eternal_City" },
  altus: { chapterId: "altus", requirements: ["Collect Dectus Medallion (Left) at Fort Haight", "Collect Dectus Medallion (Right) at Fort Faroth without fighting Greyoll"], evidence: "https://eldenring.wiki.gg/wiki/Grand_Lift_of_Dectus" },
  leyndell: { chapterId: "leyndell", requirements: ["Confirm at least two Great Runes are obtained"], evidence: "https://eldenring.wiki.gg/wiki/Bosses#Shardbearers" },
  ainsel: { chapterId: "ainsel", requirements: ["Give Fingerslayer Blade to Ranni only after the selected Seluvis outcome", "Use Renna's Rise waygate and collect Miniature Ranni"], evidence: "https://eldenring.wiki.gg/wiki/Ranni_the_Witch" },
  mountaintops: { chapterId: "mountaintops", requirements: ["Defeat Morgott", "Receive Rold Medallion from Melina after Morgott"], evidence: "https://eldenring.wiki.gg/wiki/Rold_Medallion" },
  haligtree: { chapterId: "haligtree", requirements: ["Collect Haligtree Secret Medallion (Left)", "Find Albus and collect Haligtree Secret Medallion (Right)"], evidence: "https://eldenring.wiki.gg/wiki/Miquella%27s_Haligtree" },
  farum: { chapterId: "farum", requirements: ["Defeat Fire Giant"], evidence: "https://eldenring.wiki.gg/wiki/Crumbling_Farum_Azula" },
  ashen: { chapterId: "ashen", requirements: ["Defeat Maliketh only after every listed check"], evidence: "https://eldenring.wiki.gg/wiki/Leyndell,_Ashen_Capital" },
  gravesite: { chapterId: "gravesite", requirements: ["Defeat Starscourge Radahn", "Defeat Mohg"], evidence: "https://en.bandainamcoent.eu/elden-ring/news/how-access-elden-ring-shadow-of-the-erdtree-dlc" },
  fissure: { chapterId: "fissure", requirements: ["Confirm Miquella's great rune has broken and the Fissure seal is open"], evidence: "https://eldenring.wiki.gg/wiki/Stone_Coffin_Fissure" },
  "gaius-avatar": { chapterId: "gaius-avatar", requirements: ["Open Storehouse First Floor, Seventh Floor, Loft and Back Gate paths"], evidence: "https://eldenring.wiki.gg/wiki/Shadow_Keep" },
  rauh: { chapterId: "rauh", requirements: ["Defeat Messmer", "Collect Messmer's Kindling"], evidence: "https://eldenring.wiki.gg/wiki/Ancient_Ruins_of_Rauh" },
  enir: { chapterId: "enir", requirements: ["Defeat Romina", "Burn the sealing tree with Messmer's Kindling"], evidence: "https://eldenring.wiki.gg/wiki/Enir-Ilim" },
};

export function missingAccessRequirements(chapterId: string, isCompleted: (label: string) => boolean): AccessRequirement | undefined {
  const gate = CHAPTER_ACCESS[chapterId];
  if (!gate) return undefined;
  const requirements = gate.requirements.filter((label) => !isCompleted(label));
  return requirements.length ? { ...gate, requirements } : undefined;
}

export function isAccessRequirementTask(chapterId: string, label: string) {
  return CHAPTER_ACCESS[chapterId]?.requirements.includes(label) ?? false;
}
