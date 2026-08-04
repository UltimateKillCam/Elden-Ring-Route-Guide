import { itemGuides, type PhaseKey } from "./data";
import { findMapItems, type MapItem } from "./map-items";

export type PickupGate = {
  chapterId: string;
  after?: string;
  requires?: string;
};

export const PHASE_START: Record<PhaseKey, string> = {
  early: "first-steps",
  mid: "liurnia-south",
  late: "gelmir",
  dlc: "gravesite",
};

export const literalItemName = (value: string) => value.toLowerCase().replace(/＋/g, "+").replace(/[^a-z0-9+]+/g, " ").trim();

const gate = (chapterId: string, after?: string, requires?: string): PickupGate => ({ chapterId, after, requires });

const EXACT_GATES = new Map<string, PickupGate>(([
  // Base-game remembrance rewards and quest rewards that must not appear before their boss.
  ["Axe of Godrick", gate("stormveil", "Defeat Godrick", "defeating Godrick and exchanging his Remembrance at Roundtable Hold")],
  ["Grafted Dragon", gate("stormveil", "Defeat Godrick", "defeating Godrick and exchanging his Remembrance at Roundtable Hold")],
  ["Carian Regal Scepter", gate("academy", "Defeat Rennala", "defeating Rennala and exchanging her Remembrance")],
  ["Starscourge Greatsword", gate("caelid", "Defeat Starscourge Radahn", "defeating Radahn and exchanging his Remembrance")],
  ["Lion Greatbow", gate("caelid", "Defeat Starscourge Radahn", "defeating Radahn and exchanging his Remembrance")],
  ["Winged Greathorn", gate("nokron", "Defeat Regal Ancestor Spirit", "defeating the Regal Ancestor Spirit")],
  ["Ancestral Spirit's Horn", gate("nokron", "Defeat Regal Ancestor Spirit", "defeating the Regal Ancestor Spirit")],
  ["Blasphemous Blade", gate("rykard", "Defeat Rykard", "defeating Rykard and exchanging his Remembrance")],
  ["Rykard's Rancor", gate("rykard", "Defeat Rykard", "defeating Rykard and giving the Remembrance to Enia")],
  ["Morgott's Cursed Sword", gate("leyndell", "Defeat Morgott", "defeating Morgott and exchanging his Remembrance")],
  ["Bastard's Stars", gate("ainsel", "Defeat Astel", "defeating Astel and exchanging its Remembrance")],
  ["Dark Moon Greatsword", gate("ainsel", "Defeat Astel", "finishing Ranni's quest after Astel")],
  ["Giant's Red Braid", gate("mountaintops", "Defeat Fire Giant", "defeating the Fire Giant and exchanging its Remembrance")],
  ["Hand of Malenia", gate("haligtree", "Defeat Malenia", "defeating Malenia and exchanging her Remembrance")],
  ["Scarlet Aeonia", gate("haligtree", "Defeat Malenia", "defeating Malenia and exchanging her Remembrance")],
  ["Dragoncrest Greatshield Talisman", gate("haligtree", "Defeat Loretta", "reaching Elphael after defeating Loretta")],
  ["Rotten Winged Sword Insignia", gate("haligtree", "Defeat Loretta", "reaching Elphael and completing Millicent's final assistance step")],
  ["Millicent's Prosthesis", gate("haligtree", "Defeat Loretta", "reaching Elphael and resolving Millicent's final choice")],
  ["Shard of Alexander", gate("farum", "Godskin Duo", "reaching Alexander in Farum Azula after the Godskin Duo")],
  ["Dragon King's Cragblade", gate("farum", "Defeat Dragonlord Placidusax", "defeating Placidusax and exchanging his Remembrance")],
  ["Maliketh's Black Blade", gate("farum", "Defeat Maliketh", "defeating Maliketh and exchanging his Remembrance")],
  ["Black Blade", gate("farum", "Defeat Maliketh", "defeating Maliketh and exchanging his Remembrance")],
  ["Axe of Godfrey", gate("ashen", "Defeat Godfrey / Hoarah Loux", "defeating Godfrey and exchanging his Remembrance")],
  ["Hoarah Loux's Earthshaker", gate("ashen", "Defeat Godfrey / Hoarah Loux", "defeating Godfrey and exchanging his Remembrance")],
  ["Sacred Relic Sword", gate("ashen", "Defeat Radagon and Elden Beast", "defeating Elden Beast and exchanging its Remembrance")],
  ["Marika's Hammer", gate("ashen", "Defeat Radagon and Elden Beast", "defeating Elden Beast and exchanging its Remembrance")],
  ["Erdtree's Favor +2", gate("ashen", undefined, "reaching Leyndell after Maliketh changes the capital")],
  ["Mohgwyn's Sacred Spear", gate("mohgwyn", "Defeat Mohg", "defeating Mohg and exchanging his Remembrance")],

  // DLC remembrance and quest rewards.
  ["Greatsword of Solitude", gate("gravesite", "Defeat Blackgaol Knight", "defeating the Blackgaol Knight")],
  ["Rellana's Twin Blades", gate("ensiss", "Defeat Rellana", "defeating Rellana and exchanging her Remembrance")],
  ["Rellana's Twin Moons", gate("ensiss", "Defeat Rellana", "defeating Rellana and exchanging her Remembrance")],
  ["Putrescence Cleaver", gate("fissure", "Defeat Putrescent Knight", "defeating the Putrescent Knight and exchanging its Remembrance")],
  ["Sword Lance", gate("gaius-avatar", "Defeat Commander Gaius", "defeating Commander Gaius and exchanging his Remembrance")],
  ["Shadow Sunflower Blossom", gate("gaius-avatar", "Defeat Scadutree Avatar", "defeating the Scadutree Avatar and exchanging its Remembrance")],
  ["Flowerstone Gavel", gate("jagged", "Defeat Bayle", "defeating Bayle and returning to the Dragon Communion Priestess")],
  ["Igon's Greatbow", gate("jagged", "Defeat Bayle", "defeating Bayle with Igon's quest advanced")],
  ["Greatsword of Damnation", gate("abyss", "Defeat Midra", "defeating Midra and exchanging his Remembrance")],
  ["Staff of the Great Beyond", gate("metyr", "Defeat Metyr", "defeating Metyr and exchanging her Remembrance")],
  ["Gazing Finger", gate("metyr", "Defeat Metyr", "defeating Metyr and exchanging her Remembrance")],
  ["Maternal Staff", gate("metyr", "Defeat Metyr", "finishing Ymir's quest after Metyr")],
  ["Sword of Night", gate("metyr", "Defeat Metyr", "finishing Ymir's quest and giving Jolán the Iris of Occultation")],
  ["Spear of the Impaler", gate("messmer", "Defeat Messmer", "defeating Messmer and exchanging his Remembrance")],
  ["Messmer's Orb", gate("messmer", "Defeat Messmer", "defeating Messmer and exchanging his Remembrance")],
  ["Poleblade of the Bud", gate("rauh", "Defeat Romina", "defeating Romina and exchanging her Remembrance")],
  ["Ansbach's Longbow", gate("shadow-keep", "Resolve the Leda and Ansbach Storehouse signs", "using the gold sign to protect Ansbach from Leda in the Specimen Storehouse")],
  ["Leda's Sword", gate("enir", "Defeat Leda and her allies", "defeating Leda and her allies in Enir-Ilim")],
  ["Dane's Footwork", gate("enir", "Defeat Leda and her allies", "defeating Leda and her allies in Enir-Ilim")],
  ["Obsidian Lamina", gate("enir", "Defeat Promised Consort Radahn", "finishing Ansbach's route after the final DLC boss")],
  ["Greatsword of Radahn (Lord)", gate("enir", "Defeat Promised Consort Radahn", "defeating Promised Consort Radahn and exchanging his Remembrance")],
  ["Greatsword of Radahn (Light)", gate("enir", "Defeat Promised Consort Radahn", "defeating Promised Consort Radahn and exchanging his Remembrance")],
  ["Divine Beast Frost Stomp", gate("gravesite", "Clear Belurat and defeat Divine Beast Dancing Lion", "defeating the Divine Beast Dancing Lion and exchanging its Remembrance")],
  ["Lacerating Crossed-Tree", gate("shadow-keep", "Resolve the Leda and Hornsent bridge summon signs", "helping Leda defeat Hornsent and reporting to her at Highroad Cross")],
  ["Retaliatory Crossed-Tree", gate("shadow-keep", "Resolve the Leda and Ansbach Storehouse signs", "helping Leda defeat Ansbach and reporting to her at Highroad Cross")],

  // Named late-region pickups that must not be emitted at the generic late-phase start.
  ["Giant-Crusher", gate("leyndell")],
  ["Siluria's Tree", gate("deeproot", "Defeat Crucible Knight Siluria", "defeating Crucible Knight Siluria in Deeproot Depths")],
  ["Prince of Death's Staff", gate("deeproot")],
  ["Dragon Halberd", gate("caria", "Meet Blaidd in Siofra", "taking the Siofra River Well lift in Mistwood and defeating the Dragonkin Soldier at the north end of the underground river")],
  ["Hoslow's Petal Whip", gate("mountaintops", "Defeat Juno Hoslow", "defeating Juno Hoslow for the final Volcano Manor contract")],
  ["Death Ritual Spear", gate("mountaintops")], ["Zamor Curved Sword", gate("mountaintops")],
  ["Dragonscale Blade", gate("ainsel")],
  ["St. Trina's Torch", gate("haligtree")], ["Golden Order Greatsword", gate("haligtree")],
  ["Haligtree Crest Greatshield", gate("haligtree", "Defeat Loretta", "reaching Elphael after defeating Loretta")],
  ["Carian Sorcery Sword", gate("shadow-keep")],
  ["Fire Knight's Greatsword", gate("shadow-keep")],
  ["Poisoned Hand", gate("gravesite")], ["Poison Lizard Greatsword", gate("gravesite")],
  ["Ancient Meteoric Ore Greatsword", gate("shadow-keep")],
  ["Great Katana", gate("gravesite")], ["Keen Great Katana", gate("gravesite")],
  ["Opaline Hardtear", gate("caelid", "Defeat Starscourge Radahn", "returning to the Dragonbarrow Minor Erdtree after Radahn instead of fighting its high-level Avatar early")],
  ["Stonebarb Cracked Tear", gate("caelid", "Defeat Starscourge Radahn", "returning to the Dragonbarrow Minor Erdtree after Radahn instead of fighting its high-level Avatar early")],

  // DLC pickups whose marker text omits its region.
  ["Milady", gate("ensiss")], ["Ash of War: Wing Stance", gate("ensiss")], ["Rellana's Cameo", gate("ensiss")],
  ["Wolf Crest Shield", gate("ensiss")], ["Moonrithyll's Knight Sword", gate("ensiss")], ["Glintblade Trio", gate("ensiss")],
  ["Two-Handed Sword Talisman", gate("rauh")], ["Death Knight's Longhaft Axe - Scorpion River Catacombs", gate("rauh")],
  ["Smithscript Axe - Taylew's Ruined Forge", gate("rauh")], ["Smithscript Shield - Taylew's Ruined Forge", gate("rauh")],
  ["Smithscript Greathammer - Taylew's Ruined Forge", gate("rauh")], ["Knight's Lightning Spear - Scorpion River Catacombs", gate("rauh")],
  ["Devonia's Hammer", gate("rauh")], ["Crucible Hammer-Helm", gate("rauh")], ["Golem Fist", gate("rauh")],
  ["Sharpshot Talisman", gate("shadow-keep")], ["Main-gauche", gate("shadow-keep")], ["Tooth Whip", gate("shadow-keep")],
  ["Repeating Crossbow", gate("shadow-keep")], ["Queelign's Greatsword", gate("shadow-keep")], ["Dryleaf Arts", gate("shadow-keep")],
  ["Rabbath's Cannon", gate("shadow-keep")], ["Dryleaf Seal", gate("shadow-keep")], ["Shattered Stone Talisman", gate("shadow-keep")],
  ["Winged Serpent Helm", gate("shadow-keep")], ["Golden Lion Shield", gate("shadow-keep")], ["Sword of Light", gate("shadow-keep")],
  ["Dancing Blade of Ranah", gate("fissure")], ["Chilling Perfume Bottle - Lamenter's Gaol", gate("fissure")],
  ["Spirit Glaive", gate("fissure")], ["Lightning Perfume Bottle", gate("fissure")], ["Lamenting Visage - Lamenter's Gaol", gate("fissure")],
  ["Frenzyflame Perfume Bottle", gate("abyss")], ["Madding Hand", gate("abyss")],
  ["Rakshasa's Great Katana", gate("metyr")], ["Rakshasa Set", gate("metyr")], ["Claws of Night", gate("metyr")],
  ["Gravitational Missile", gate("gaius-avatar")],
] as Array<[string, PickupGate]>).map(([item, value]) => [literalItemName(item), value]));

const REGION_GATES: Array<[RegExp, PickupGate]> = [
  [/Ashen Capital|Capital of Ash/i, gate("ashen")],
  [/Castle Morne|Weeping Peninsula|Morne Tunnel|Tombsward/i, gate("weeping")],
  [/Stormveil/i, gate("stormveil", "Defeat Margit", "defeating Margit before entering Stormveil")],
  [/Caria Manor|Three Sisters/i, gate("caria", "Defeat Royal Knight Loretta", "clearing Caria Manor when the item is behind Loretta")],
  [/Raya Lucaria|Academy of Raya Lucaria/i, gate("academy")],
  [/Liurnia|Academy Gate Town|Church of Irith/i, gate("liurnia-south")],
  [/Caelid|Dragonbarrow|Sellia|Redmane|Gael Tunnel/i, gate("caelid")],
  [/Siofra/i, gate("caria")],
  [/Nokron/i, gate("nokron")],
  [/(?<!Scadu )\bAltus\b|Lux Ruins|Windmill Village/i, gate("altus")],
  [/Volcano Manor|Mt\. Gelmir|Gelmir|Seethewater/i, gate("gelmir")],
  [/Leyndell|Royal Capital|Capital Outskirts/i, gate("leyndell")],
  [/Ainsel|Nokstella|Lake of Rot|Grand Cloister/i, gate("ainsel")],
  [/Deeproot/i, gate("deeproot")],
  [/Consecrated Snowfield|Ordina|Haligtree|Elphael|Drainage Channel/i, gate("haligtree")],
  [/Forbidden Lands|Mountaintops|Flame Peak|Castle Sol/i, gate("mountaintops")],
  [/Mohgwyn/i, gate("mohgwyn")],
  [/Crumbling Farum Azula|Farum Azula/i, gate("farum")],

  [/Enir-Ilim|Cleansing Chamber/i, gate("enir")],
  [/Ancient Ruins of Rauh|Rauh Base|Taylew|Church of the Bud|Scorpion River/i, gate("rauh")],
  [/Dark Chamber|Specimen Storehouse/i, gate("messmer")],
  [/Cathedral of Manus Metyr|Finger Ruins|Count Ymir|Jolán/i, gate("metyr")],
  [/Abyssal Woods|Darklight Catacombs|Midra's Manse/i, gate("abyss")],
  [/Jagged Peak|Dragon's Pit|Grand Altar of Dragon Communion|Bayle/i, gate("jagged")],
  [/Scaduview|Hinterland|Shadow Keep, Back Gate/i, gate("gaius-avatar")],
  [/Shadow Keep|Scadu Altus|Bonny Village|Moorth Ruins|Ruins of Unte/i, gate("shadow-keep")],
  [/Cerulean Coast|Stone Coffin Fissure|Charo's Hidden Grave|Lamenter's Gaol/i, gate("fissure")],
  [/Castle Ensis|Castle-Lord's Chamber|Ensis/i, gate("ensiss")],
  [/Gravesite Plain|Belurat|Fog Rift|Church of Consolation|Western Nameless Mausoleum/i, gate("gravesite")],
];

const PHYSICK_GATES: Record<string, string> = {
  "Crimsonburst Crystal Tear": "weeping", "Opaline Bubbletear": "weeping", "Holy-Shrouding Cracked Tear": "liurnia-south",
  "Lightning-Shrouding Cracked Tear": "liurnia-south", "Magic-Shrouding Cracked Tear": "liurnia-south",
  "Flame-Shrouding Cracked Tear": "caelid", "Greenburst Crystal Tear": "caelid", "Opaline Hardtear": "caelid",
  "Stonebarb Cracked Tear": "caelid", "Cerulean Crystal Tear A": "gelmir", "Ruptured Crystal Tear": "gelmir",
  "Cerulean Crystal Tear B": "mountaintops", "Crimson Bubbletear": "mountaintops", "Thorny Cracked Tear": "haligtree",
};

function coordinateGate(marker?: MapItem): PickupGate | undefined {
  if (marker?.layer !== "surface") return undefined;
  if (marker.x >= 32 && marker.x <= 35.5 && marker.y >= 68.5 && marker.y <= 71.5) return gate("stormveil", "Defeat Margit", "defeating Margit before entering Stormveil");
  if (marker.x >= 57 && marker.x <= 59.5 && marker.y >= 13 && marker.y <= 20.5) return gate("haligtree", "Defeat Loretta", "defeating Loretta before descending into Elphael");
  return undefined;
}

export function pickupGate(item: string): PickupGate | undefined {
  const exact = EXACT_GATES.get(literalItemName(item));
  if (exact) return exact;
  const physick = PHYSICK_GATES[item];
  if (physick) return gate(physick, undefined, "waiting until the route reaches the Erdtree Avatar's intended region and level band");
  const mapMatches = findMapItems(item);
  const marker = mapMatches.find((match) => literalItemName(match.name) === literalItemName(item))
    || (literalItemName(item).split(" ").length > 1 ? mapMatches[0] : undefined);
  const byCoordinate = coordinateGate(marker);
  if (byCoordinate) return byCoordinate;
  const text = `${marker?.name || item} ${marker?.description || ""} ${itemGuides[item] || ""}`;
  return REGION_GATES.find(([pattern]) => pattern.test(text))?.[1];
}

export function deferredPickupGate(item: string): PickupGate | undefined {
  return pickupGate(item);
}
