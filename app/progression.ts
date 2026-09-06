import { itemGuides, type PhaseKey } from "./data";
import { findMapItems, type MapItem } from "./map-items";

export type PickupGate = {
  chapterId: string;
  after?: string;
  requires?: string;
  difficulty?: "pickup" | "enemy" | "boss" | "quest";
};

export type PickupContext = {
  preferredLayer?: MapItem["layer"];
  categoryPattern?: RegExp;
};

export const PHASE_START: Record<PhaseKey, string> = {
  early: "first-steps",
  mid: "liurnia-south",
  late: "gelmir",
  dlc: "gravesite",
};

export const literalItemName = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/＋/g, "+").replace(/[^a-z0-9+]+/g, " ").trim();

const gate = (chapterId: string, after?: string, requires?: string, difficulty: PickupGate["difficulty"] = after ? "boss" : "pickup"): PickupGate => ({ chapterId, after, requires, difficulty });

const EXACT_GATES = new Map<string, PickupGate>(([
  // Acquisition sections of the dedicated Fextralife item pages, checked
  // 2026-09-06. Explicit identities beat the map's optional location suffixes.
  ["Lordsworn's Greatsword", gate("first-steps", undefined, "opening the carriage chest on the western edge of Gatefront Ruins")],
  ["Uchigatana", gate("first-steps", undefined, "looting the corpse on the upper ledge inside Deathtouched Catacombs; no boss kill is required")],
  ["Longbow", gate("first-steps", undefined, "buying it from the Twin Maiden Husks for 1,200 runes after the Roundtable invitation; Samurai already starts with it")],
  ["Longsword", gate("first-steps", undefined, "buying it from the Twin Maiden Husks for 1,000 runes after the Roundtable invitation; Vagabond already starts with it")],
  ["Scimitar", gate("first-steps", undefined, "buying it from the Twin Maiden Husks for 600 runes; Warrior already starts with two")],
  ["Broadsword", gate("first-steps", undefined, "buying it for 1,800 runes from the coastal merchant south-east of Coastal Cave; Confessor starts with it")],
  ["Shortbow", gate("first-steps", undefined, "buying it for 600 runes from the coastal merchant south-east of Coastal Cave")],
  ["Halberd", gate("first-steps", undefined, "buying it for 1,200 runes from the merchant beside the northern Limgrave bridge; Vagabond starts with it")],
  ["Short Spear", gate("first-steps", undefined, "buying it for 600 runes from the Twin Maiden Husks; Prophet starts with it")],
  ["Short Sword", gate("first-steps", undefined, "buying it for 600 runes from the northern Limgrave merchant; Astrologer starts with it")],
  ["Dagger", gate("first-steps", undefined, "buying it for 400 runes from the Twin Maiden Husks")],
  ["Rapier", gate("first-steps", undefined, "buying it for 1,000 runes from the Twin Maiden Husks")],
  ["Twinblade", gate("first-steps", undefined, "using Torrent to jump into the enclosed south-east building at Dragon-Burnt Ruins, then opening its cellar chest; avoid the separate trapped chest")],
  ["Glintstone Staff", gate("first-steps", undefined, "defeating the lone Noble Sorcerer south of Waypoint Ruins, west of the small graveyard; Prisoner starts with it", "enemy")],
  ["Astrologer's Staff", gate("liurnia-south", undefined, "buying it for 800 runes from the Liurnia Lake Shore merchant; Astrologer starts with it")],
  ["Estoc", gate("liurnia-south", undefined, "buying it for 3,000 runes from the southern Liurnia merchant or Patches at Scenic Isle; Prisoner starts with it")],
  ["Dragon Communion Seal", gate("stormveil", undefined, "returning to Stranded Graveyard with two Stonesword Keys, dodging the Fringefolk Hero's Grave chariot and defeating the Banished Knight at the upper tunnel's end; the Ulcerated Tree Spirit is not required", "enemy")],
  ["Clawmark Seal", gate("first-steps", undefined, "giving Gurranq one Deathroot, following the Summonwater Village Tibia Mariner and Bestial Sanctum steps", "quest")],
  ["Grave Scythe", gate("first-steps", undefined, "farming the scythe skeletons between Saintsbridge and Summonwater Village; destroy the reviving bones", "enemy")],
  ["Bandit's Curved Sword", gate("weeping", undefined, "farming the curved-sword skeleton immediately beside Church of Pilgrimage; destroy its reviving bones", "enemy")],
  ["Clayman's Harpoon", gate("first-steps", undefined, "taking the Siofra River Well lift in Mistwood and farming spear-wielding Claymen in the entrance ruins; no underground boss is required", "enemy")],
  ["Guardian's Swordspear", gate("weeping", undefined, "farming Guardians around the Weeping Peninsula Minor Erdtree; stay clear of the Avatar if it is not on the current route", "enemy")],
  ["Rogier's Rapier", gate("stormveil", "Defeat Godrick", "speaking to Rogier on the Roundtable balcony after Godrick; the reward is already +8, so do not spend stones reinforcing a second rapier", "quest")],
  ["Noble's Slender Sword", gate("first-steps", undefined, "farming sword-bearing Wandering Nobles in the caravan west of Waypoint Ruins; the drop is rare", "enemy")],
  ["Reduvia", gate("first-steps", "Defeat Bloody Finger Nerijus with Yura at Murkwater", "defeating Nerijus during the Murkwater ravine invasion; let Yura help", "enemy")],
  ["Warpick", gate("first-steps", undefined, "farming warpick-bearing Godrick Soldiers at Gatefront Ruins", "enemy")],
  ["Halo Scythe", gate("caelid", undefined, "farming scythe-bearing Cleanrot Knights south of Inner Aeonia; the spear-bearing knights cannot drop it", "enemy")],
  ["Cleanrot Spear", gate("caelid", undefined, "farming spear-bearing Cleanrot Knights south of Inner Aeonia; avoid the central O'Neil arena unless that boss is on the route", "enemy")],
  ["Cleanrot Knight's Sword", gate("caelid", undefined, "farming the Cleanrot Knights near Inner Aeonia; there is no need to wait for Elphael", "enemy")],
  ["Staff of the Guilty", gate("liurnia-south", undefined, "farming the Thorn Sorcerer with the blazing staff north-west of the Artist's Shack; this avoids a later Mt. Gelmir farm", "enemy")],
  ["Cipher Pata", gate("first-steps", undefined, "dropping from the Roundtable balcony and running through the left-hand rooms to the corpse on the bed; Alberich need not be defeated")],
  ["Ripple Blade", gate("caria", "Defeat Royal Knight Loretta", "dropping from Three Sisters onto Caria Manor's roof and buying the weapon from Pidia")],
  ["Lazuli Glintstone Sword", gate("academy", undefined, "farming the Lazuli Sorcerer just south of the Schoolhouse Classroom grace inside Raya Lucaria", "enemy")],
  ["Albinauric Bow", gate("haligtree", undefined, "farming Albinauric archers south-west of Ordina after obtaining both Haligtree medallion halves", "enemy")],
  ["Pickaxe", gate("first-steps", undefined, "farming pickaxe-bearing Miners inside Limgrave Tunnels, then resting at the grace to reset them", "enemy")],
  ["Messmer Soldier's Spear", gate("ensiss", "Defeat Rellana", "farming spear-bearing Messmer Soldiers at the camp west of Moorth Ruins in Scadu Altus", "enemy")],
  ["Spear", gate("stormveil", "Defeat Margit", "farming spear-bearing Exile Soldiers near Rampart Tower; do not kill Patches for his upgraded spear", "enemy")],
  ["Lordsworn's Straight Sword", gate("first-steps", undefined, "farming sword-bearing Godrick Soldiers at Gatefront Ruins", "enemy")],
  ["Clinging Bone", gate("liurnia-south", undefined, "receiving the Haligtree Secret Medallion (Right) from Albus, then defeating Ensha's invasion on returning to Roundtable Hold", "enemy")],
  ["Erdsteel Dagger", gate("first-steps", "Return to Kenneth for the Erdsteel Dagger", "clearing Fort Haight, then returning to Kenneth above the Mistwood road", "quest")],
  ["Crescent Moon Axe", gate("stormveil", "Defeat Margit", "farming axe-bearing Exile Soldiers in Stormveil's courtyard", "enemy")],
  ["Chainlink Flail", gate("liurnia-south", undefined, "farming the flail-bearing Pumpkin Head in the camp north of Foot of the Four Belfries", "enemy")],
  ["Glaive", gate("liurnia-south", undefined, "farming the glaive skeleton on the road immediately east of Church of Vows", "enemy")],
  ["Ornamental Straight Sword", gate("liurnia-south", undefined, "taking the Imbued Sword Key from the Four Belfries summit chest, opening the Precipice of Anticipation waygate and defeating the Grafted Scion", "boss")],
  ["Golem's Halberd", gate("stormveil", "Defeat Margit", "farming the weapon-bearing golems on Limgrave Tower Bridge; this is an enemy fight, not a free pickup", "enemy")],
  ["Warhawk's Talon", gate("stormveil", "Defeat Margit", "farming Warhawks outside the Rampart Tower grace in Stormveil", "enemy")],
  ["Treespear", gate("liurnia-south", undefined, "following the road south-east from Liurnia Highway South to the carriage beside the broken bridge and opening its chest")],
  ["Glintstone Kris", gate("gelmir", undefined, "completing Sellen's Azur, Lusat and body-transfer steps, then using her assistance sign outside Raya Lucaria's Grand Library and defeating Jerren", "quest")],
  ["Envoy's Long Horn", gate("leyndell", undefined, "farming the Large Oracle Envoy beyond East Capital Rampart before the capital becomes ash", "enemy")],
  ["Envoy's Greathorn", gate("haligtree", undefined, "farming the Giant Oracle Envoys on the Haligtree canopy; this is a dangerous late-game farm", "enemy")],
  ["Shamshir", gate("first-steps", undefined, "descending Highroad Cave's waterfall section and looting the bat-covered platform; the boss is not required")],
  ["Lizard Greatsword", gate("gravesite", undefined, "farming the greatsword-bearing imp near the entrance to Fog Rift Catacombs; the Death Knight is not required", "enemy")],
  ["Sword of Darkness", gate("shadow-keep", undefined, "taking the Stone-Sheathed Sword from Fog Rift Catacombs first, then raising it at the Darkness altar in Ruins of Unte; the initial altar becomes inert")],
  ["Golden Halberd", gate("weeping", undefined, "returning to the First Step to defeat the Tree Sentinel after the early Weeping Peninsula levels and upgrades", "boss")],
  ["Bloodfiend's Fork", gate("gravesite", undefined, "farming fork-bearing Bloodfiends in Prospect Town or near Ruined Forge Lava Intake", "enemy")],
  ["Backhand Blade", gate("gravesite", undefined, "looting beside the coffin north-east of Scorched Ruins; the nearby enemies can be bypassed")],
  ["Magma Blade", gate("gelmir", "Defeat Godskin Noble", "farming orange-blade Man-Serpents beyond Temple of Eiglay; the weapon is a rare drop, not a guaranteed boss reward", "enemy")],
  ["Firespark Perfume Bottle", gate("gravesite", undefined, "opening the camp chest south of Castle Front grace; Rellana is not required")],
  ["Smithscript Dagger", gate("gravesite", undefined, "inside Ruined Forge Lava Intake, take the first ladder down and turn right after the fire blob; loot the corpse by the golem in the back of the room")],
  ["Caestus", gate("stormveil", "Defeat Margit", "progressing through Stormveil's side entrance to the Rusty Key, then returning to Gostoc and buying the fists for 800 runes")],
  ["Idus Sword", gate("liurnia-south", undefined, "with the Tarnished Pack installed, loot the corpse beneath the tree north-west of Liurnia Lake Shore, below the Malefactor's Evergaol cliff; Idus Knights already start with this weapon")],
  ["Large Club", gate("first-steps", undefined, "riding to the corpse below the cliff east of Forlorn Hound Evergaol; the demi-humans can be bypassed")],
  ["Bloodhound's Fang", gate("weeping", undefined, "defeating Bloodhound Knight Darriwil at Forlorn Hound Evergaol in southern Limgrave", "boss")],
  ["Carian Glintstone Staff", gate("academy", undefined, "entering Raya Lucaria with the Academy Glintstone Key and looting the corpse in the Church of the Cuckoo")],
  ["Academy Glintstone Staff", gate("liurnia-south", undefined, "farming the staff-wielding Academy sorcerers; Thops's later quest reward is an alternative, not a required detour", "enemy")],
  ["Ordovis' Greatsword", gate("leyndell", undefined, "defeating the two Crucible Knights at Auriza Hero's Grave in the Capital Outskirts", "boss")],
  ["Ordovis's Greatsword", gate("leyndell", undefined, "defeating the two Crucible Knights at Auriza Hero's Grave in the Capital Outskirts", "boss")],
  ["Gargoyle's Greatsword", gate("deeproot", "Defeat the Valiant Gargoyles", "defeating both Valiant Gargoyles in Siofra Aqueduct", "boss")],
  ["Gargoyle's Blackblade", gate("leyndell", undefined, "returning to Bestial Sanctum to defeat Black Blade Kindred once the party reaches the capital's level and upgrade range", "boss")],
  ["Godslayer's Greatsword", gate("leyndell", undefined, "returning to the Divine Tower of Caelid basement to defeat its Godskin Apostle at the capital's level and upgrade range", "boss")],
  ["Iron Cleaver", gate("weeping", undefined, "farming cleaver-wielding Misbegotten in Castle Morne's courtyard", "enemy")],
  ["Iron Greatsword", gate("leyndell", undefined, "farming the large red-maned Misbegotten in Leyndell before the capital changes to ash", "enemy")],
  ["Anvil Hammer", gate("gravesite", undefined, "lowering the pipe in Ruined Forge Lava Intake, climbing the pipe and examining the forge altar; no boss fight is required")],
  ["Euporia", gate("enir", undefined, "burning the sealing tree to enter Enir-Ilim, then following the hidden drop-down route from Spiral Rise back into Belurat")],
  ["Bloodfiend's Arm", gate("gravesite", undefined, "defeating the large club-wielding Bloodfiend in Prospect Town", "enemy")],
  ["Dragon-Hunter's Great Katana", gate("jagged", undefined, "defeating Ancient Dragon-Man at the bottom of Dragon's Pit", "boss")],
  ["Red Bear's Claw", gate("rauh", undefined, "defeating Red Bear inside the Northern Nameless Mausoleum", "boss")],
  // Active build buffs, catalysts and memory slots. These gates keep the loadout
  // card aligned with the actual acquisition and prerequisite rather than only
  // the broad region in which an imported build happens to mention the buff.
  ["Finger Seal", gate("first-steps", "Accept Melina's invitation and meet Smithing Master Hewg", "reaching Roundtable Hold; Prophet and Confessor start with a seal", "quest")],
  ["Golden Vow (Spell)", gate("gelmir", undefined, "reaching the Corpse-Stench Shack on Mt. Gelmir without defeating a boss")],
  ["Flame, Grant me Strength", gate("caelid", undefined, "riding behind Fort Gael and looting the corpse without fighting the Flame Chariots")],
  ["Bloodflame Blade", gate("liurnia-south", undefined, "killing the Teardrop Scarab north-west of Rose Church", "enemy")],
  ["Scholar's Armament", gate("first-steps", undefined, "defeating the Mad Pumpkin Head below Waypoint Ruins and buying the spell from Sellen", "boss")],
  ["Scholar's Shield", gate("first-steps", undefined, "defeating the Mad Pumpkin Head below Waypoint Ruins and buying the spell from Sellen", "boss")],
  ["Bestial Vitality", gate("caria", "Give Gurranq Deathroots three and four, then calm him", "giving Gurranq the first three Deathroots", "quest")],
  ["Blessing's Boon", gate("liurnia-south", undefined, "buying the incantation from Miriel at the Church of Vows", "quest")],
  ["Blessing of the Erdtree", gate("leyndell", "Defeat Godfrey's golden shade", "reaching the Queen's Bedchamber after Godfrey's golden shade", "boss")],
  ["Black Flame's Protection", gate("mountaintops", "Collect Haligtree Secret Medallion (Left)", "obtaining both secret medallion halves and asking Gideon about them", "quest")],
  ["Protection of the Erdtree", gate("altus", undefined, "killing the Teardrop Scarab on the Altus stone ruin", "enemy")],
  ["Electrify Armament", gate("liurnia-south", undefined, "taking the Dragon Cult Prayerbook from the Leyndell Knight south of Artist's Shack and giving it to Miriel", "enemy")],
  ["Poison Armament", gate("caelid", undefined, "killing the invisible Teardrop Scarab in Aeonia Swamp", "enemy")],
  ["Black Flame Blade", gate("stormveil", "Defeat Margit", "opening the Godskin Prayerbook cellar with one Stonesword Key and giving the book to Miriel or Corhyn", "quest")],
  ["Order's Blade", gate("first-steps", undefined, "meeting D west of Summonwater Village and buying the incantation from him", "quest")],
  ["Terra Magica", gate("liurnia-south", undefined, "clearing Academy Crystal Cave and defeating its two Crystalians", "boss")],
  ["Unseen Form", gate("altus", undefined, "solving the Mirage Rise phantom-crests puzzle")],
  ["Memory Stone - Twin Maiden Husks", gate("first-steps", "Accept Melina's invitation and meet Smithing Master Hewg", "buying the Memory Stone from the Twin Maiden Husks for 3,000 runes", "quest")],
  ["Memory Stone - Oridys's Rise", gate("weeping", undefined, "finding the three wise beasts around Oridys's Rise")],
  ["Memory Stone - Converted Tower", gate("liurnia-south", undefined, "using the Erudition gesture or climbing the ruined wall at Converted Tower")],
  ["Memory Stone - Testu's Rise", gate("liurnia-south", undefined, "finding the three wise beasts on Testu's Rise island")],
  ["Memory Stone - Raya Lucaria Academy", gate("academy", "Defeat Red Wolf of Radagon", "defeating the Red Wolf of Radagon", "boss")],
  ["Memory Stone - Seluvis's Rise", gate("caria", "Defeat Royal Knight Loretta", "reaching Seluvis's Rise after Loretta", "quest")],
  ["Memory Stone - Lenne's Rise", gate("caelid", undefined, "using Torrent's spirit spring to enter Lenne's Rise without a boss fight")],
  ["Memory Stone - Hermit Village", gate("gelmir", undefined, "defeating Demi-Human Queen Maggie at the end of Hermit Village", "boss")],
  ["Ash of War: War Cry", gate("first-steps", undefined, "buying the Ash of War from Knight Bernahl at Warmaster's Shack")],
  ["Ash of War: Braggart's Roar", gate("leyndell", undefined, "looting Iron Ball only if Boggart dies in the chosen Dung Eater branch; he never sells it. Skip this pickup if keeping Boggart alive", "quest")],
  ["Ash of War: Endure", gate("first-steps", undefined, "buying the Ash of War from Knight Bernahl at Warmaster's Shack")],
  ["Ash of War: Royal Knight's Resolve", gate("gelmir", "Defeat Godskin Noble", "reaching the hidden room beyond Temple of Eiglay in Volcano Manor", "boss")],
  ["Ash of War: Seppuku", gate("mountaintops", undefined, "killing the invisible Teardrop Scarab on the frozen lake east of Freezing Lake grace", "enemy")],
  ["Ash of War: Sacred Order", gate("altus", undefined, "killing the Teardrop Scarab north of Abandoned Coffin grace", "enemy")],
  ["Ash of War: Square Off", gate("first-steps", undefined, "taking the Siofra River Well lift in Mistwood and killing the Teardrop Scarab on the river cliff", "enemy")],
  ["Ash of War: Troll's Roar", gate("mountaintops", undefined, "looting the top of the large rock south-east of Church of Repose")],
  ["Ash of War: Bloody Slash", gate("first-steps", undefined, "defeating the Godrick Knight atop Fort Haight", "enemy")],
  ["Bloody Slash", gate("first-steps", undefined, "defeating the Godrick Knight atop Fort Haight", "enemy")],
  ["Great Épée", gate("first-steps", undefined, "opening the chest in the enemy camp north-east of Agheel Lake South")],
  ["Winged Sword Insignia", gate("liurnia-south", undefined, "defeating the Cleanrot Knight at the end of Stillwater Cave", "boss")],
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
  ["Dark Moon Greatsword", gate("ainsel", "Defeat Astel", "finishing Ranni's quest after Astel", "quest")],
  ["Giant's Red Braid", gate("mountaintops", "Defeat Fire Giant", "defeating the Fire Giant and exchanging its Remembrance")],
  ["Hand of Malenia", gate("haligtree", "Defeat Malenia", "defeating Malenia and exchanging her Remembrance")],
  ["Scarlet Aeonia", gate("haligtree", "Defeat Malenia", "defeating Malenia and exchanging her Remembrance")],
  ["Dragoncrest Greatshield Talisman", gate("haligtree", "Defeat Loretta", "reaching Elphael after defeating Loretta", "quest")],
  ["Rotten Winged Sword Insignia", gate("haligtree", "Defeat Loretta", "reaching Elphael and completing Millicent's final assistance step")],
  ["Millicent's Prosthesis", gate("haligtree", "Defeat Loretta", "reaching Elphael and resolving Millicent's final choice", "quest")],
  ["Shard of Alexander", gate("farum", "Godskin Duo", "reaching Alexander in Farum Azula after the Godskin Duo", "quest")],
  ["Dragon King's Cragblade", gate("farum", "Defeat Dragonlord Placidusax", "defeating Placidusax and exchanging his Remembrance")],
  ["Maliketh's Black Blade", gate("farum", "Defeat Maliketh", "defeating Maliketh and exchanging his Remembrance")],
  ["Black Blade", gate("farum", "Defeat Maliketh", "defeating Maliketh and exchanging his Remembrance")],
  ["Axe of Godfrey", gate("ashen", "Defeat Godfrey / Hoarah Loux", "defeating Godfrey and exchanging his Remembrance")],
  ["Hoarah Loux's Earthshaker", gate("ashen", "Defeat Godfrey / Hoarah Loux", "defeating Godfrey and exchanging his Remembrance")],
  ["Sacred Relic Sword", gate("ashen", "Defeat Radagon and Elden Beast", "defeating Elden Beast and exchanging its Remembrance")],
  ["Marika's Hammer", gate("ashen", "Defeat Radagon and Elden Beast", "defeating Elden Beast and exchanging its Remembrance")],
  ["Erdtree's Favor +2", gate("ashen", undefined, "reaching Leyndell after Maliketh changes the capital")],
  ["Mohgwyn's Sacred Spear", gate("mohgwyn", "Defeat Mohg", "defeating Mohg and exchanging his Remembrance")],
  ["Dragoncrest Shield Talisman", gate("caelid", undefined, "taking the Bestial Sanctum exterior drop-down route")],
  ["Dragoncrest Shield Talisman +1", gate("altus", undefined, "opening the Stonesword Key room in Sainted Hero's Grave")],
  ["Dragoncrest Shield Talisman +2", gate("farum", undefined, "reaching the floating debris below Dragon Temple Lift")],
  ["Assassin's Cerulean Dagger", gate("caria", "Clear Black Knife Catacombs", "defeating the Black Knife Assassin behind the catacombs' hidden wall", "boss")],
  ["Horn Bow", gate("first-steps", undefined, "taking the Siofra River Well lift and using the Hallowhorn Grounds bridge supports to reach the corpse")],
  ["Gargoyle's Twinblade", gate("deeproot", "Defeat the Valiant Gargoyles", "defeating both Valiant Gargoyles in Siofra Aqueduct", "boss")],
  ["Wing of Astel", gate("ainsel", undefined, "entering Ainsel River Main through Renna's Rise and taking the upper Uhl Palace Ruins path")],
  ["Magic Scorpion Charm", gate("altus", "Give Amber Starlight to Seluvis and collect Magic Scorpion Charm", "finishing Seluvis's potion and puppet steps before giving Ranni the Fingerslayer Blade", "quest")],
  ["Taker's Cameo", gate("mountaintops", "Defeat Juno Hoslow", "finishing the third Volcano Manor letter and reporting to Tanith", "quest")],
  ["Swarm of Flies", gate("mohgwyn", undefined, "looting the corpse in the eastern blood-marsh cave while avoiding or clearing the Albinaurics")],
  ["White Mask", gate("mohgwyn", undefined, "defeating the Nameless White Mask invader near the blood-marsh tunnel before Mohg is killed", "enemy")],
  ["Old Lord's Talisman", gate("farum", "Defeat Godskin Duo", "reaching Dragon Temple Rooftop and opening the Beastman-guarded rotunda chest", "boss")],

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
  ["Staff of the Great Beyond", gate("metyr", "Defeat Metyr after ringing the Miyr bell", "defeating Metyr and exchanging her Remembrance")],
  ["Gazing Finger", gate("metyr", "Defeat Metyr after ringing the Miyr bell", "defeating Metyr and exchanging her Remembrance")],
  ["Maternal Staff", gate("metyr", "Defeat Metyr after ringing the Miyr bell", "finishing Ymir's quest after Metyr")],
  ["Sword of Night", gate("metyr", "Defeat Metyr after ringing the Miyr bell", "finishing Ymir's quest and giving Jolán the Iris of Occultation")],
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
  ["Talisman of the Dread", gate("gravesite", undefined, "looting the corpse inside Elder's Hovel in Gravesite Plain")],
  ["Bloodsucking Cracked Tear", gate("shadow-keep", undefined, "defeating the Furnace Golem blocking Ruins of Unte", "boss")],
  ["Gaius's Greaves", gate("gaius-avatar", "Defeat Commander Gaius", "defeating the wolf-riding Albinauric between Gaius's arena and Scadutree Chalice", "enemy")],

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
  ["Carian Sorcery Sword", gate("ensiss", "Defeat Rellana", "reaching Highroad Cross in Scadu Altus, then dropping into northern Castle Ensis")],
  ["Fire Knight's Greatsword", gate("shadow-keep")],
  ["Poisoned Hand", gate("gravesite")], ["Poison Lizard Greatsword", gate("gravesite")],
  ["Ancient Meteoric Ore Greatsword", gate("ensiss", "Defeat Rellana", "clearing Ruined Forge of Starfall Past in Scadu Altus")],
  ["Great Katana", gate("gravesite")], ["Keen Great Katana", gate("gravesite")],
  ["Opaline Hardtear", gate("caelid", "Defeat Starscourge Radahn", "returning to the Dragonbarrow Minor Erdtree after Radahn instead of fighting its high-level Avatar early")],
  ["Stonebarb Cracked Tear", gate("caelid", "Defeat Starscourge Radahn", "returning to the Dragonbarrow Minor Erdtree after Radahn instead of fighting its high-level Avatar early")],
  ["Graven-Mass Talisman", gate("haligtree", undefined, "opening Albinauric Rise in the Consecrated Snowfield")],
  ["Meteorite of Astel", gate("haligtree", undefined, "defeating Astel, Stars of Darkness in Yelough Anix Tunnel", "boss")],
  ["Explosive Ghostflame", gate("haligtree", undefined, "defeating the Death Rite Bird near Apostate Derelict at night", "boss")],
  ["Unendurable Frenzy", gate("haligtree", undefined, "opening the underground chest in Yelough Anix Ruins")],

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
  ["Rakshasa's Great Katana", gate("shadow-keep", "Defeat Golden Hippopotamus", "taking Shadow Keep's hidden coffin route to Eastern Nameless Mausoleum and defeating Rakshasa", "boss")],
  ["Rakshasa Set", gate("shadow-keep", "Defeat Golden Hippopotamus", "taking Shadow Keep's hidden coffin route to Eastern Nameless Mausoleum and defeating Rakshasa", "boss")],
  ["Claws of Night", gate("metyr")],
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

function broadCoordinateGate(marker?: MapItem): PickupGate | undefined {
  if (marker?.layer !== "surface") return undefined;
  if (marker.x >= 75) return gate("farum");
  if (marker.x >= 55 && marker.y <= 21) return gate("haligtree");
  if (marker.x >= 48 && marker.x < 60 && marker.y > 21 && marker.y <= 32) return gate("haligtree");
  if (marker.x >= 50 && marker.y <= 35) return gate("mountaintops");
  if (marker.x >= 49 && marker.y >= 57) return gate("caelid");
  if (marker.y >= 80) return gate("weeping");
  if (marker.x <= 27 && marker.y >= 28 && marker.y < 39) return gate("gelmir");
  if (marker.x <= 28 && marker.y >= 39 && marker.y < 45) return gate("caria");
  if (marker.x <= 32 && marker.y >= 45 && marker.y <= 66) return gate("liurnia-south");
  if (marker.x >= 27 && marker.x <= 40 && marker.y >= 28 && marker.y <= 45) return gate("altus");
  if (marker.x > 40 && marker.y >= 32 && marker.y <= 45) return gate("leyndell");
  return undefined;
}

export function pickupGate(item: string, context: PickupContext = {}): PickupGate | undefined {
  const literal = literalItemName(item);
  // Map markers append a location to an item's name. Gate the item itself,
  // rather than treating "Anvil Hammer - Ruined Forge Lava Intake" as new gear.
  const baseName = item.split(/\s+[-–—]\s+/)[0];
  const baseExact = EXACT_GATES.get(literalItemName(baseName));
  if (baseExact) return baseExact;
  if (literal === literalItemName("Beast Claw")) {
    const wantsWeapon = context.preferredLayer === "shadow" || Boolean(context.categoryPattern?.test("Weapons"));
    const wantsSpell = context.preferredLayer === "surface" || Boolean(context.categoryPattern?.test("Spells"));
    if (wantsWeapon && !wantsSpell) return gate("gravesite", undefined, "defeating Logur, the hostile Beast Claw wielder in Gravesite Plain", "enemy");
    if (wantsSpell && !wantsWeapon) return gate("altus", "Collect the fifth Deathroot from the Wyndham Ruins Tibia Mariner", "giving Gurranq a total of five Deathroots", "quest");
  }
  const exact = EXACT_GATES.get(literal);
  if (exact) return exact;
  if (/^Cuckoo Knight/i.test(item)) return gate("liurnia-south");
  if (/^Gelmir Knight/i.test(item)) return gate("gelmir");
  const physick = PHYSICK_GATES[item];
  if (physick) return gate(physick, undefined, "waiting until the route reaches the Erdtree Avatar's intended region and level band");
  const mapMatches = findMapItems(item, context.preferredLayer, context.categoryPattern);
  const exactMatches = mapMatches.filter((match) => literalItemName(match.name) === literal);
  const containedMatches = mapMatches.filter((match) => {
    const name = literalItemName(match.name);
    return name.split(" ").length > 1 && literal.includes(name);
  });
  const locationMatches = mapMatches.filter((match) => literalItemName(match.name.split(/\s+[-–—]\s+/)[0]) === literal);
  const marker = exactMatches.find((match) => match.layer === context.preferredLayer)
    || exactMatches[0]
    || locationMatches.find((match) => match.layer === context.preferredLayer)
    || locationMatches[0]
    || containedMatches.find((match) => match.layer === context.preferredLayer)
    || containedMatches[0];
  const byCoordinate = coordinateGate(marker);
  if (byCoordinate) return byCoordinate;
  const guideGate = REGION_GATES.find(([pattern]) => pattern.test(itemGuides[item] || ""))?.[1];
  if (guideGate) return guideGate;
  const broadCoordinate = broadCoordinateGate(marker);
  if (broadCoordinate) return broadCoordinate;
  const markerText = `${marker?.name || item} ${marker?.description || ""}`;
  return REGION_GATES.find(([pattern]) => pattern.test(markerText))?.[1];
}

export function deferredPickupGate(item: string, context?: PickupContext): PickupGate | undefined {
  return pickupGate(item, context);
}
