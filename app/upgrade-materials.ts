import { mapItems, type MapItem } from "./map-items";
import { CHAPTER_ECONOMY, planWeaponUpgrade, type UpgradePath } from "./run-planner";

export type MaterialSource = {
  id: string; path: UpgradePath; tier: number | "ancient"; chapterId: string;
  capacity: number; unitCost: number; location: string; directions: string;
  marker?: MapItem; mapQuery: string; source: string; unlockLabel?: string;
};
export type MaterialAllocation = { source: MaterialSource; quantity: number; material: string };
export type MaterialUsage = Record<string, number>;
const chapterOrder = new Map(CHAPTER_ECONOMY.map((chapter, index) => [chapter.chapterId, index]));

function pickup(path: UpgradePath, tier: number | "ancient", chapterId: string, markerId: number, capacity: number, location: string, directions: string, unlockLabel?: string): MaterialSource {
  const marker = mapItems.find((item) => item.url.includes(`id=${markerId}&`));
  if (!marker) throw new Error(`Missing smithing material map marker ${markerId}`);
  return { id: `pickup-${markerId}`, path, tier, chapterId, capacity, unitCost: 0, location, directions, marker, mapQuery: marker.name, source: marker.url, unlockLabel };
}
function shop(path: UpgradePath, tier: number, chapterId: string, id: string, capacity: number, unitCost: number, location: string, directions: string, unlockLabel?: string): MaterialSource {
  return { id: `${id}-${tier}`, path, tier, chapterId, capacity, unitCost, location, directions, mapQuery: location,
    source: `https://eldenring.wiki.fextralife.com/${path === "somber" ? "Somber+" : ""}Smithing+Stone+(${tier})`, unlockLabel };
}

// Deliberately finite world stock, not a respawn/farming estimate. Quantities are
// conservative where the older map and current item guide disagree (e.g. mines).
const p = pickup;
const s = shop;
export const MATERIAL_SOURCES: readonly MaterialSource[] = [
  p("standard", 1, "first-steps", 1969, 1, "Church of Elleh", "Take the loose stone on the smithing anvil beside Kale."),
  p("standard", 1, "first-steps", 3888, 8, "Limgrave Tunnels", "Enter the mine at Agheel Lake's north-west corner. Search the yellow wall deposits on each mining floor and the side passages before the boss lift. The Troll is not required for these stones."),
  s("standard", 1, "first-steps", "west-limgrave-stock", 3, 200, "Nomadic Merchant (West Limgrave)", "Find the merchant under the coastal ruin south of Coastal Cave. Buy only the missing number; his three stones do not restock."),
  p("standard", 1, "weeping", 3894, 9, "Morne Tunnel", "Enter the mine in the ravine west of the peninsula's Minor Erdtree. Collect the yellow deposits around the wooden platforms and lower mining chamber; the boss can be left alive."),
  p("standard", 2, "weeping", 477, 1, "Castle Morne courtyard", "From Castle Morne Lift enter the courtyard, take the left steps and loot the corpse among the dogs."),
  p("standard", 2, "weeping", 737, 1, "Castle Morne ramparts", "Climb the ladder at the back of the courtyard, then descend the next ladder on the right. Follow the wall to the Misbegotten chopping a corpse and loot it."),
  p("standard", 2, "weeping", 7008, 1, "Castle Morne Rampart Gaol", "From Behind the Castle descend toward the square roof opening above the Whip room. Drop carefully onto its wooden beams and loot the corpse before reaching the floor."),
  s("standard", 2, "weeping", "morne-stock", 1, 400, "Nomadic Merchant (Weeping Peninsula)", "Speak to the merchant beside Castle Morne Rampart grace. His shop has one Smithing Stone [2]."),
  s("standard", 2, "weeping", "isolated-peninsula-stock", 3, 400, "Isolated Merchant (Weeping Peninsula)", "Follow the western coast south past the Walking Mausoleum to Isolated Merchant's Shack. Buy up to three Smithing Stones [2]."),
  p("standard", 2, "stormveil", 3953, 1, "Stormveil Castle", "From Nepheli's room pass the wooden barricades west and climb the stairs on the right to loot the corpse."),
  p("standard", 2, "stormveil", 6063, 1, "Stormveil Castle", "Search the upper ledge beside the corridor leading to Secluded Cell. Reach it from the castle ramparts and loot the seated corpse."),
  p("standard", 2, "stormveil", 1104, 1, "Stormveil Castle", "From Rampart Tower reach the top of the castle wall and loot behind the explosive barrels. Clear the immediate threat before approaching the barrels."),
  p("standard", 2, "stormveil", 974, 1, "Stormveil Castle", "Follow the upper ramparts to the ballista guards and loot the corpse on their platform."),
  p("standard", 2, "stormveil", 906, 1, "Stormveil Castle", "Climb the broken sections of the outer castle walls to reach the corpse on the exterior ledge."),
  p("standard", 3, "stormveil", 909, 1, "Stormveil outer cliffs", "Follow the castle's outer cliff path past the bladed birds and loot the corpse. Margit must be defeated before taking the castle route."),
  p("standard", 3, "liurnia-south", 3502, 8, "Raya Lucaria Crystal Tunnel", "Enter the mine in the lake's north-east cliff. Collect yellow wall deposits while descending its lifts and side rooms. These pickups are before the Crystalian boss."),
  p("standard", 3, "liurnia-south", 6871, 3, "East of Academy Gate Town", "Search the stone gazebo south-east of Academy Gate Town grace. Loot its statue without drawing the giant crayfish from the water to the south."),
  p("standard", 3, "liurnia-south", 1506, 1, "Laskyar Ruins", "Loot the seated corpse just outside the central gazebo; avoid the enemies rising from the flooded ruins."),
  p("standard", 4, "academy", 1705, 9, "Ruin-Strewn Precipice", "From Bellum Church descend to the northern ravine, enter Ravine-Veiled Village and climb the mine ladders and lifts. Collect yellow wall deposits. Stop before Magma Wyrm Makar's fog; no Altus boss kill is needed. Carry a bow for bats on the narrow platforms."),
  p("standard", 4, "academy", 2053, 1, "Camp below The Four Belfries", "Open the chest in the soldier camp below The Four Belfries. Avoid bringing the patrols together while crossing the camp."),
  p("standard", 4, "caelid", 3764, 8, "Gael Tunnel", "Enter from the Caelid side and descend the platforms. Collect the yellow deposits on the way to the rear entrance grace; reaching that grace lets you leave without fighting the Magma Wyrm."),
  p("standard", 5, "caelid", 2953, 8, "Sellia Crystal Tunnel", "Enter from the north of the Aeonia swamp, climb the huts and wooden walkways and collect yellow deposits along the mining route. Watch for the pests' projectiles. Do not enter the Fallingstar Beast fog for these stones."),
  p("standard", 5, "altus", 2777, 6, "Altus Tunnel", "Take the right-hand side room after the grace, then search the next cavern's wall, underside of its walkway and southern roots. Collect the last deposits beside the boss-door cavern; the Crystalian duo is not needed for these pickups."),
  p("standard", 6, "altus", 7951, 3, "Sealed Tunnel", "Below the lift, reveal the two southern illusory walls and descend into the root chamber. Lure the Abductor Virgin into the glowing cracked statue on the eastern side, take its stones and leave the boss alone."),
  p("standard", 6, "gelmir", 10104, 3, "Hermit's Shack", "Follow the western Mt. Gelmir circuit toward Hermit's Shack. Lure the nearby Runebear into the glowing cracked statue and loot the stones after it breaks; killing the bear is unnecessary."),
  p("standard", 6, "leyndell", 4111, 7, "Leyndell, Royal Capital", "Search Fortified Manor's descending stairs and patio, the platform reached by its ladder, the ground near the Omenkiller, the area beyond the lower tree spirit, the small roof beyond the manor, and the ledge south of West Capital Rampart near poison flowers. Collect these before Maliketh changes the capital."),
  p("standard", 7, "mountaintops", 6209, 3, "First Church of Marika", "From the church go east onto the low ridge and loot the seated corpse."),
  p("standard", 7, "mountaintops", 3537, 3, "Freezing Lake", "At the western foot of the frozen lake find the glowing cracked statue. Lure a nearby golem's attack into it, collect the stones and leave; killing Borealis is unnecessary."),
  p("standard", 7, "mountaintops", 3801, 3, "Castle Sol", "Climb the ladder behind Church of the Eclipse, follow the outer walls and drop through the roof opening into the rat-filled building. Loot the corpse; Commander Niall is not required for this pickup."),
  p("standard", 7, "mountaintops", 2810, 1, "Guardians' Garrison", "Climb to the upper ramparts and follow the walkway beyond the Flame Guardian to the corpse."),
  p("standard", 7, "haligtree", 8609, 3, "Western Consecrated Snowfield", "North of the Mohgwyn waygate, lure the bear from the eastern slope into the glowing cracked statue. Take the stones without chasing the bear."),
  p("standard", 8, "haligtree", 8603, 8, "Yelough Anix Tunnel", "Enter the mine below Yelough Anix Ruins. Search wall deposits and side chambers while descending the frozen mine. The Ancient Dragon stone is in the pit below, but Astel's boss room is not required for the mine pickups."),
  p("standard", 8, "haligtree", 9836, 3, "Cave of the Forlorn approach", "Near the cave entrance find the glowing cracked statue and lure the giant crab into breaking it. Loot the stones without entering the cave's boss route."),
  p("standard", 8, "haligtree", 8610, 1, "Western Consecrated Snowfield", "Loot the Smithing Stone [8] from the same bear-broken statue that holds three Smithing Stones [7], north of the Mohgwyn waygate."),
  p("standard", "ancient", "haligtree", 6399, 1, "Church of Repose", "From Church of Repose ride south-east to the enormous skull. Take the stone inside its mouth; no boss or quest reward is required."),
  p("standard", "ancient", "haligtree", 4496, 1, "Yelough Anix Tunnel", "In the mine's lower icy pit, loot the Ancient Dragon stone from the corpse while avoiding the Alabaster Lord. Do not enter Astel's fog."),
  p("somber", 1, "first-steps", 3889, 1, "Limgrave Tunnels", "At the lift leading toward the Troll, use the ledges along the shaft wall to reach the corpse with the white stone. Stop on each ledge rather than dropping straight down; no boss kill is needed."),
  p("somber", 1, "weeping", 3895, 3, "Morne Tunnel", "Search the white deposits and side recesses while descending Morne Tunnel. The regular yellow stones are a different material; leave the Scaly Misbegotten alive if only gathering supplies."),
  p("somber", 2, "weeping", 491, 1, "Western Weeping Peninsula beach", "Follow the western coast south from Church of Pilgrimage to the beach north of Isolated Merchant's Shack. Find the fallen chair surrounded by four Spirit Jellyfish and loot its corpse. No boss or Blaidd quest is needed."),
  p("somber", 5, "caelid", 4253, 1, "Gaol Cave", "Spend two Stonesword Keys at the cave in the scarlet-rot lake west of Fort Gael. Follow the cells to the lever, open them and collect the stone from the unlocked cells. The Frenzied Duelist is not required."),
  p("somber", 6, "altus", 7453, 2, "Old Altus Tunnel", "Use two Stonesword Keys at the mine north of Erdtree-Gazing Hill. Search the white deposits in the main cavern and its storage-side passages; leave the Stonedigger Troll boss if not selected."),
  p("somber", 6, "caelid", 7909, 1, "Sellia Crystal Tunnel", "Take the Somber [6] from the Fallingstar Beast reward screen after the route's bell-bearing fight. This is a one-time boss reward, not a mine-wall pickup.", "Sellia Crystal Tunnel: defeat the Fallingstar Beast for Somberstone Miner's Bell Bearing [1]"),
  p("somber", 7, "gelmir", 6863, 1, "Volcano Manor, beyond Temple of Eiglay", "After Godskin Noble, take the temple lift upstairs and drop from the balcony to the lava-side path. Follow the slugs, cross to the open window beside the Abductor Virgin and continue through the manor toward the Stonesword Key fog door above the throne room. Spend two keys, descend the hanging cages, then climb to the balcony corpse outside. Do not attempt the old pre-boss bridge jump.", "Defeat Godskin Noble"),
  p("somber", 7, "mountaintops", 7401, 1, "North of Zamor Ruins", "Follow the road north from Zamor Ruins and shoot the scarab clinging to the frozen tree. Collect its drop before continuing toward the narrow bridge."),
  p("somber", 8, "leyndell", 2317, 1, "Dragonbarrow West", "From Dragonbarrow West reach the fallen tree south-west of Caelid's Divine Tower. Shoot the explosive scarab and wait for the blast before approaching. This is a no-boss pickup, not a reason to fight Dragonbarrow's dragons."),
  p("somber", 9, "mountaintops", 5601, 1, "West of Farum Greatbridge", "Use the Bestial Sanctum waygate, ride south to Farum Greatbridge grace and search west of the bridge for the scarab. Avoid the dragon and Black Blade Kindred; take the drop and fast-travel away."),
  p("somber", "ancient", "haligtree", 8299, 1, "Elphael Prayer Room", "After Loretta, leave Prayer Room along the first walkway. Drop to the gazebo with the red scarab, climb the diagonal support opposite it and open the chest in the small room between the columns. Malenia is not required.", "Defeat Loretta and descend into Elphael"),
  p("somber", "ancient", "mohgwyn", 4701, 1, "Mohgwyn Dynasty Mausoleum", "From Dynasty Mausoleum Midpoint climb the stairs toward the lift. Open the chest at the foot of the large statue opposite the lift, guarded by Albinaurics and a Sanguine Noble. Clear or lure the guards first; Mohg need not be defeated for the chest."),
  p("standard", "ancient", "gravesite", 655552, 1, "Suppressing Pillar", "From Castle Front ride south-east along the Pillar Path, then continue to the tall Suppressing Pillar. Ride its internal lift and open the chest at the top. This chest is outside Dragon's Pit and needs no dungeon boss."),
  p("standard", "ancient", "ensiss", 655190, 1, "Ruined Forge Lava Intake", "Reach the forge south-east of Castle Front. Descend its ladders and platforms to the lever, lower the metal pipe and climb that pipe. Near the top jump right to the stairs and examine the furnace for the stone. The forge has no boss; watch for lava and blobs."),
  p("somber", "ancient", "jagged", 655385, 1, "Jagged Peak Mountainside", "After reaching Jagged Peak through Dragon's Pit, follow the path south-west from Mountainside grace and use both spiritsprings. Turn around at the second landing, drop to the ledge immediately below and follow it north-east to the corpse. Bayle is not required.", "Defeat Ancient Dragon-Man in Dragon's Pit"),
  ...[1, 2, 3, 4].map((tier) => s("somber", tier, "liurnia-south", "iji-stock", tier < 3 ? Infinity : 3, [0, 2000, 3000, 4000, 6000][tier], "War Counselor Iji", "Follow western Liurnia's road through Kingsrealm Ruins, strike the illusory road-blocking wall and speak to Iji beside Road to the Manor grace. Buy the missing stones. Somber [1]/[2] are unlimited; [3]/[4] are limited to three each. If Iji has died naturally, give his bell bearing to the Twin Maiden Husks; do not kill him for access.")),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((tier) => {
    const bearing = Math.ceil(tier / 2);
    const chapterId = ["", "liurnia-south", "altus", "mountaintops", "farum"][bearing];
    const unlockLabel = ["", "Defeat the Crystalian for Smithing-Stone Miner's Bell Bearing [1]", "Sealed Tunnel: Smithing-Stone Miner's Bell Bearing [2]", "Zamor Ruins: Smithing-Stone Miner's Bell Bearing [3]", "Defeat Godskin Duo for Smithing-Stone Miner's Bell Bearing [4]"][bearing];
    const direction = ["", "Defeat the Crystalian at the bottom of Raya Lucaria Crystal Tunnel.", "At Sealed Tunnel strike the illusory wall beside the grace, then open the first chamber's chest. No boss is required.", "Open the cellar chest at Zamor Ruins after Morgott grants access to the Mountaintops.", "Defeat the Godskin Duo in Farum Azula; this shop is unavailable before that fight."][bearing];
    return s("standard", tier, chapterId, "standard-husks", Infinity, [0, 200, 400, 600, 900, 1200, 1500, 2400, 3600][tier], "Twin Maiden Husks", `${direction} Return to Roundtable Hold and choose Offer a bell bearing at the Twin Maiden Husks. Then open Purchase and buy only the missing stones. Stock is unlimited after the hand-in.`, unlockLabel);
  }),
  ...[3, 4, 5, 6, 7, 8, 9].map((tier) => {
    const bearing = tier === 9 ? 5 : Math.ceil(tier / 2);
    const chapterId = bearing === 2 ? "altus" : bearing === 3 ? "mountaintops" : "farum";
    const unlockLabel = { 2: "Altus Tunnel: defeat the Crystalian duo for Somberstone Miner's Bell Bearing [2]", 3: "First Church of Marika: collect Somberstone Miner's Bell Bearing [3]", 4: "Tempest-Facing Balcony: collect Somberstone Miner's Bell Bearing [4] from the nearby cliff-edge corpse", 5: "Beside the Great Bridge: collect Somberstone Miner's Bell Bearing [5] from the altar below the grace" }[bearing];
    const direction = { 2: "Defeat the Crystalian duo in Altus Tunnel.", 3: "Loot the corpse just outside First Church of Marika; no Borealis kill is required.", 4: "Loot the cliff-edge corpse near Tempest-Facing Balcony in Farum Azula.", 5: "Collect the bearing from the altar below Beside the Great Bridge in Farum Azula, guarded by beastmen." }[bearing];
    return s("somber", tier, chapterId, "somber-husks", Infinity, [0, 2000, 3000, 4000, 6000, 9000, 12000, 16000, 20000, 25000][tier], "Twin Maiden Husks", `${direction} Give the bearing to the Twin Maiden Husks at Roundtable Hold, then buy the missing Somber stones from Purchase.`, unlockLabel);
  }),
];

/** Allocate only verified stock, preferring local free pickups, then shops. */
export function allocateUpgradeMaterials(path: UpgradePath, from: number, to: number, chapterId: string, used: MaterialUsage = {}) {
  const nextUsage = { ...used };
  const allocations: MaterialAllocation[] = [];
  const missing: string[] = [];
  for (const material of planWeaponUpgrade(path, Math.min(from, to), to).materials) {
    let remaining = material.quantity;
    const sources = MATERIAL_SOURCES.filter((source) => source.path === path && source.tier === material.tier && (chapterOrder.get(source.chapterId) ?? Infinity) <= (chapterOrder.get(chapterId) ?? -1))
      .sort((a, b) => {
        const rank = (source: MaterialSource) => source.chapterId === chapterId && !source.unitCost ? 0 : !Number.isFinite(source.capacity) ? 1 : source.chapterId === chapterId ? 2 : 3;
        return rank(a) - rank(b) || (chapterOrder.get(b.chapterId)! - chapterOrder.get(a.chapterId)!);
      });
    for (const source of sources) {
      const quantity = Math.min(remaining, Math.max(0, source.capacity - (nextUsage[source.id] || 0)));
      if (!quantity) continue;
      allocations.push({ source, quantity, material: material.name });
      nextUsage[source.id] = (nextUsage[source.id] || 0) + quantity;
      remaining -= quantity;
      if (!remaining) break;
    }
    if (remaining) missing.push(`${remaining}× ${material.name}`);
  }
  return { allocations, usage: nextUsage, missing };
}

export function suppliedUpgradeTarget(path: UpgradePath, from: number, desired: number, chapterId: string, used: MaterialUsage = {}) {
  for (let target = desired; target >= Math.min(from, desired); target--) {
    const plan = allocateUpgradeMaterials(path, from, target, chapterId, used);
    if (!plan.missing.length) return { ...plan, target, limited: target < desired };
  }
  return { allocations: [] as MaterialAllocation[], usage: { ...used }, missing: [], target: Math.min(from, desired), limited: desired > from };
}
