"use client";

import { Component, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { builds, chapters, itemGuides, sources, stageLoadout, type Build, type Chapter, type PhaseKey } from "./data";
import { findMapItem, findMapItems, findMapRoutePoint, type MapItem } from "./map-items";
import { deferredPickupGate, literalItemName, PHASE_START, type PickupGate } from "./progression";
import { splitArmourSpecification } from "./equipment-data";
import {
  CHAPTER_ECONOMY,
  CHAPTER_ECONOMY_BY_ID,
  OPTIONAL_RUNE_BOSSES,
  expectedPerPlayerBossPot,
  maxEquipLoad,
  maxWeightForTier,
  planBuildStatTarget,
  planWeaponUpgrade,
  radagonSoresealBridgeAdvice,
  recommendedOptionalBossLevel,
  runesBetweenLevels,
  selectOptionalRuneBosses,
  type AttributeBlock,
  type OptionalRuneBoss,
  type StatKey,
  type UpgradePath,
} from "./run-planner";
import { findWeaponUpgradeRecord, weaponUpgradePath } from "./weapon-upgrades";

type Mode = "solo" | "standard" | "seamless";
type View = "route" | "codex" | "party";
type LanMode = "none" | "controller" | "follower";
type Player = { id: string; name: string; buildId: string; color: string };
type Expedition = {
  schema: 1;
  saveId?: string;
  name: string;
  mode: Mode;
  players: Player[];
  hostId: string;
  completed: Record<string, boolean>;
  createdAt: string;
  lossRate?: number;
  levelOffset?: number;
  checkpointRunes?: Record<string, number>;
  checkpointLevels?: Record<string, number>;
  checkpointStats?: Record<string, Partial<AttributeBlock>>;
  checkpointWeaponLevels?: Record<string, number>;
  runeBossSelections?: Record<string, string[]>;
};
type SaveLibrary = { activeId: string | null; saves: Record<string, Expedition> };
type Task = {
  id: string;
  label: string;
  detail: string;
  kind: "objective" | "boss" | "gear" | "quest" | "level" | "upgrade" | "armour";
  playerId?: string;
  perPlayer: boolean;
  scope: string;
  item?: string;
  slot?: string;
  afterObjective?: string;
  optional?: boolean;
  runeBossId?: string;
};

const PLAYER_COLORS = ["#d8ad62", "#7db6a8", "#b987aa", "#7698c8", "#c5775e", "#a7a36c"];
const STORAGE_KEY = "tarnished-together-expedition-v1";
const SAVE_LIBRARY_KEY = "tarnished-together-save-library-v2";

const newSaveId = () => `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Route render failed", error, info.componentStack); }
  render() {
    if (this.state.failed) return <main className="route-error"><div><strong>Tarnished Together</strong><h1>The route could not be displayed</h1><p>Your saved run has not been deleted. Restart the LAN guide, then reload this page. If the problem remains, export the terminal text when reporting it.</p><button type="button" onClick={() => window.location.reload()}>Reload route</button></div></main>;
    return this.props.children;
  }
}

const makePlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `player-${index + 1}`,
    name: `Tarnished ${index + 1}`,
    buildId: builds[index % builds.length].id,
    color: PLAYER_COLORS[index],
  }));

const wikiUrl = (item: string) => {
  const page = item.startsWith("Golden Seed") ? "Golden Seed" : item.startsWith("Sacred Tear") ? "Sacred Tear" : item.replace(/ \+.*/, "").replace(/ \/.*/, "");
  return `https://eldenring.wiki.fextralife.com/${encodeURIComponent(page)}`;
};

const ATTRIBUTE_FILTERS = ["All builds", "Strength", "Dexterity", "Intelligence", "Faith", "Arcane", "Ranged"];
const COLLECTION_FILTERS = ["All sources", "Curated", "Fextralife", "Other guides", "Meme / cosplay"];
const FEXTRA_CATEGORY_FILTERS = ["All Fextralife groups", ...Array.from(new Set(builds.flatMap((candidate) => candidate.guideCategories || [])))];
const MECHANIC_FILTERS = ["All focuses", ...Array.from(new Set(builds.map((candidate) => candidate.mechanic))).sort()];
const SORT_OPTIONS = ["Catalogue order", "Collection", "Attribute", "Combat focus", "Starting class", "Name"];
const PHASE_ORDER: PhaseKey[] = ["early", "mid", "late", "dlc"];

function buildClassification(build: Build) {
  const stats = build.stats.toUpperCase();
  const attributes = ([
    ["Strength", "STR"],
    ["Dexterity", "DEX"],
    ["Intelligence", "INT"],
    ["Faith", "FAI"],
    ["Arcane", "ARC"],
  ] as const).filter(([, code]) => stats.includes(code)).map(([attribute]) => attribute);
  const text = `${build.name} ${build.stats} ${build.tags.join(" ")} ${build.playstyle} ${Object.values(build.phases).join(" ")}`.toLowerCase();
  const ranged = /bow|crossbow|ranged|sorcer|spell|incant|caster|projectile|throw|cannon/.test(text);
  return {
    attributes: attributes.length ? attributes.join(" / ") : "Quality",
    range: ranged ? "Ranged" : "Melee",
  };
}

function plannerStartingClass(build: Build) {
  return build.startingClass === "Not specified" ? planBuildStatTarget(build, 170).origin.name : build.startingClass;
}

function buildSearchText(build: Build) {
  const classification = buildClassification(build);
  const loadouts = PHASE_ORDER.map((phase) => stageLoadout(build, phase));
  return [
    build.name,
    build.stats,
    classification.range,
    build.tags.join(" "),
    (build.guideCategories || []).join(" "),
    build.playstyle,
    ...Object.values(build.phases),
    ...loadouts.flatMap((loadout) => [loadout.weapon, loadout.offhand, loadout.skill, loadout.armour, loadout.talismans.join(" "), loadout.spells.join(" ")]),
  ].join(" ").toLowerCase();
}

function matchesBuildFilter(build: Build, filter: string) {
  const classification = buildClassification(build);
  if (filter === "All builds") return true;
  if (filter === "Ranged") return classification.range === "Ranged";
  return classification.attributes.includes(filter);
}

function matchesCollection(build: Build, collection: string) {
  if (collection === "All sources") return true;
  if (collection === "Meme / cosplay") return build.collection === collection || build.tags.includes("meme");
  return build.collection === collection;
}

function sortBuilds(candidates: Build[], order: string) {
  const sorted = [...candidates];
  if (order === "Catalogue order") return sorted.sort((a, b) => builds.indexOf(a) - builds.indexOf(b));
  if (order === "Collection") return sorted.sort((a, b) => a.collection.localeCompare(b.collection) || a.name.localeCompare(b.name));
  if (order === "Attribute") return sorted.sort((a, b) => buildClassification(a).attributes.localeCompare(buildClassification(b).attributes) || a.name.localeCompare(b.name));
  if (order === "Combat focus") return sorted.sort((a, b) => a.mechanic.localeCompare(b.mechanic) || a.name.localeCompare(b.name));
  if (order === "Starting class") return sorted.sort((a, b) => a.startingClass.localeCompare(b.startingClass) || a.name.localeCompare(b.name));
  return sorted.sort((a, b) => a.name.localeCompare(b.name));
}

const inferGuide = (item: string, chapter: Chapter) => {
  const exact = Object.entries(itemGuides).find(([key]) => item.includes(key));
  if (exact) return `Area: ${chapter.region}. ${exact[1]}`;
  const marker = findMapItem(item, mapLayerForChapter(chapter)) || findMapItem(item);
  if (marker?.description) return `Area: ${chapter.region}. ${marker.description}`;
  if (chapter.act === "Shadow of the Erdtree") {
    return `Area: ${chapter.region}. Begin at ${chapter.grace}, follow the active map marker to the named item, collect it, then return to this chapter's ordered steps.`;
  }
  return `Area: ${chapter.region}. Begin at ${chapter.grace}, follow the active map marker to the named item, collect it, and keep the weapon at this chapter's upgrade cap.`;
};

type LoadoutPickup = { item: string; slot: string };

const cleanItemName = (value: string) => value.toLowerCase().replace(/[+＋]\d+/g, "").replace(/[^a-z0-9]+/g, " ").trim();
function loadoutPickups(loadout: ReturnType<typeof stageLoadout>, chapter: Chapter): LoadoutPickup[] {
  const layer = mapLayerForChapter(chapter);
  const fields: Array<{ slot: string; values: string[]; categories: RegExp }> = [
    { slot: "weapon", values: [loadout.weapon], categories: /weapon|shield|ash/i },
    { slot: "off-hand", values: [loadout.offhand], categories: /weapon|shield/i },
    { slot: "skill", values: [loadout.skill], categories: /ash/i },
    { slot: "talisman", values: loadout.talismans, categories: /talisman/i },
    { slot: "armour", values: splitArmourSpecification(loadout.armour).map((piece) => piece.name), categories: /armor/i },
    { slot: "spell", values: loadout.spells, categories: /spell/i },
    { slot: "Physick tear", values: [loadout.flask], categories: /flask/i },
  ];
  const pickups: LoadoutPickup[] = [];
  for (const field of fields) {
    for (const value of field.values) {
      const layerMatches = findMapItems(value, layer, field.categories);
      const allMatches = findMapItems(value, undefined, field.categories);
      const exactMatches = allMatches.filter((match) => literalItemName(match.name) === literalItemName(value));
      const embeddedMatches = allMatches
        .filter((match) => {
          const name = literalItemName(match.name);
          return name.split(" ").length > 1 && literalItemName(value).includes(name);
        })
        .filter((match, _, candidates) => !candidates.some((other) => other !== match && literalItemName(other.name).includes(literalItemName(match.name))));
      const candidateMatches = exactMatches.length ? exactMatches : embeddedMatches.length ? embeddedMatches : layerMatches;
      const isChoice = /\bor\b|according to|best available|build-specific|named weapon/i.test(value) && ["off-hand", "skill", "talisman", "armour", "spell"].includes(field.slot);
      const selectedMatches = isChoice && candidateMatches.length > 1
        ? [...candidateMatches].sort((a, b) => cleanItemName(value).indexOf(cleanItemName(a.name)) - cleanItemName(value).indexOf(cleanItemName(b.name))).slice(0, 1)
        : candidateMatches;
      for (const match of selectedMatches) pickups.push({ item: match.name, slot: field.slot });
      if (!candidateMatches.length && /weapon|off-hand/.test(field.slot)) {
        for (const known of Object.keys(itemGuides)) {
          if (cleanItemName(value).includes(cleanItemName(known))) pickups.push({ item: known, slot: field.slot });
        }
      }
    }
  }
  return pickups.filter((pickup, index) => pickups.findIndex((candidate) => cleanItemName(candidate.item) === cleanItemName(pickup.item)) === index);
}

function routeTiming(value: string, phase: PhaseKey): PickupGate | undefined {
  const phaseStart = chapters.findIndex((chapter) => chapter.id === PHASE_START[phase]);
  const mapMatches = findMapItems(value);
  const exactMatches = mapMatches.filter((item) => literalItemName(item.name) === literalItemName(value));
  const embeddedMatches = mapMatches
    .filter((item) => literalItemName(item.name).split(" ").length > 1 && literalItemName(value).includes(literalItemName(item.name)))
    .filter((item, _, matches) => !matches.some((other) => other !== item && literalItemName(other.name).includes(literalItemName(item.name))));
  const candidates = new Set([value, ...(exactMatches.length ? exactMatches : embeddedMatches).map((item) => item.name)]);
  Object.keys(itemGuides).forEach((item) => {
    if (literalItemName(value).includes(literalItemName(item))) candidates.add(item);
  });
  return [...candidates]
    .map((item) => deferredPickupGate(item))
    .filter((timing): timing is PickupGate => Boolean(timing) && chapters.findIndex((chapter) => chapter.id === timing.chapterId) >= phaseStart)
    .sort((a, b) => chapters.findIndex((chapter) => chapter.id === b!.chapterId) - chapters.findIndex((chapter) => chapter.id === a!.chapterId))[0];
}

function TimingNote({ value, phase }: { value: string; phase: PhaseKey }) {
  const timing = routeTiming(value, phase);
  if (!timing) return null;
  const chapter = chapters.find((candidate) => candidate.id === timing.chapterId);
  return <small className="route-timing">Use the previous-stage setup until {chapter?.title || timing.chapterId}{timing.after ? ` — after ${timing.after.replace(/^Defeat\s+/i, "")}` : ""}.</small>;
}

function orderPickupTasks(tasks: Task[], chapter: Chapter) {
  const remaining = [...tasks];
  const ordered: Task[] = [];
  let x = chapter.x;
  let y = chapter.y;
  while (remaining.length) {
    remaining.sort((a, b) => {
      const slotPriority = (task: Task) => task.slot === "weapon" ? 0 : task.slot === "off-hand" || task.slot === "skill" ? 1 : 2;
      const pointA = a.item && findMapItem(a.item, mapLayerForChapter(chapter));
      const pointB = b.item && findMapItem(b.item, mapLayerForChapter(chapter));
      const distanceA = pointA ? (pointA.x - x) ** 2 + (pointA.y - y) ** 2 : Number.POSITIVE_INFINITY;
      const distanceB = pointB ? (pointB.x - x) ** 2 + (pointB.y - y) ** 2 : Number.POSITIVE_INFINITY;
      return slotPriority(a) - slotPriority(b) || distanceA - distanceB || a.id.localeCompare(b.id);
    });
    const next = remaining.shift()!;
    ordered.push(next);
    const point = next.item && findMapItem(next.item, mapLayerForChapter(chapter));
    if (point) { x = point.x; y = point.y; }
  }
  return ordered;
}

function insertGatedPickupTasks(tasks: Task[], pickups: Task[], chapter: Chapter) {
  const beforeBoss = pickups.filter((task) => !task.afterObjective);
  if (beforeBoss.length) {
    const finalBossName = chapter.boss?.split(",")[0];
    const finalBossIndex = finalBossName ? tasks.findIndex((task) => task.label.includes(finalBossName)) : -1;
    tasks.splice(finalBossIndex >= 0 ? finalBossIndex : tasks.length, 0, ...orderPickupTasks(beforeBoss, chapter));
  }
  const gates = Array.from(new Set(pickups.map((task) => task.afterObjective).filter(Boolean))) as string[];
  gates.forEach((afterObjective) => {
    const gated = orderPickupTasks(pickups.filter((task) => task.afterObjective === afterObjective), chapter);
    const objectiveIndex = tasks.findIndex((task) => task.label.includes(afterObjective));
    tasks.splice(objectiveIndex >= 0 ? objectiveIndex + 1 : tasks.length, 0, ...gated);
  });
}

const ESSENTIAL_GUIDES: Record<string, string> = {
  "Church of Elleh: Crafting Kit, Kale and smithing table": "From The First Step, walk north while avoiding the Tree Sentinel and activate the Church of Elleh grace. Buy the Crafting Kit from Kalé and exhaust his dialogue. The anvil beside him can reinforce regular armaments only to +3 and Somber armaments only to +1; Hewg is required beyond those limits.",
  "Gatefront: Whetstone Knife and first map": "At Gatefront Ruins, take the West Limgrave map from the roadside pillar. Go down the stairs in the southern camp, open the chest for the Whetstone Knife, then leave east along the main road.",
  "Third Church: Flask of Wondrous Physick": "Follow the road east through Mistwood to the Third Church of Marika. Take the Sacred Tear and Flask of Wondrous Physick, rest at the grace, then head west toward Agheel Lake.",
  "Limgrave Tunnels: early Smithing Stones": "Enter the mine in the cliff at the north-west corner of Agheel Lake. Collect the visible Smithing Stones from the walls, clear as much of the tunnel as the party needs, then continue to the next route card.",
  "Collect Map: Caelid": "Take Map: Caelid from the roadside pillar beside the nomadic merchant near Caelid Highway South, then continue south toward Redmane Castle.",
  "Sealed Tunnel: Smithing-Stone Miner's Bell Bearing [2]": "Enter Sealed Tunnel outside Leyndell. Strike the illusory wall beside the grace, then open the chest in the first chamber for Smithing-Stone Miner's Bell Bearing [2].",
  "Collect two Scadutree Fragments at Church of Consolation": "Ride south-east from Gravesite Plain to the Church of Consolation and take both Scadutree Fragments from the altar.",
  "Accept Melina's accord and receive Torrent": "Rest at the Gatefront grace. Accept Melina's accord to unlock leveling and receive the Spectral Steed Whistle, then put the whistle in a pouch or quick-item slot and summon Torrent before continuing.",
  "Meet Renna at Church of Elleh at night": "After receiving Torrent, pass time until night and fast-travel to Church of Elleh. Tell Renna that you can call the spectral steed; she gives the Spirit Calling Bell and Lone Wolf Ashes. If she no longer appears, both can later be bought from the Twin Maiden Husks.",
  "Enter Margit's arena once to trigger the Roundtable Hold invitation": "From Stormhill Shack, follow the road through the soldiers and ballista to Castleward Tunnel. Activate its grace, enter Margit's fog and begin the fight once. Winning is not required: after the attempt, rest at a Site of Grace and Melina will offer to take you to Roundtable Hold. The intended route leaves Margit's defeat for the Stormveil chapter.",
  "Accept Melina's invitation and meet Smithing Master Hewg": "Accept Melina's Roundtable Hold invitation. Activate the Table of Lost Grace, then take the eastern corridor and speak to Smithing Master Hewg at his anvil until his dialogue repeats. Hewg can reinforce past regular +3 and Somber +1. Visit the Twin Maiden Husks in the north-west room, but keep every weapon within the current chapter cap.",
  "Meet Nepheli before Godrick": "From the Secluded Cell grace, go south away from Godrick's fog, pass the troll and two soldiers, and enter the small side room near the golden sapling. Exhaust Nepheli Loux's dialogue before defeating Godrick; this unlocks her summon sign and preserves the later Arsenal Charm reward.",
  "Speak to Ensha at Roundtable Hold before taking a secret medallion": "Speak to Ensha beside Gideon's room before collecting Albus's medallion half. This records his pre-invasion dialogue and the missable What Do You Want? gesture; after the medallion triggers his invasion, defeat him and collect the Royal Remains set outside Gideon's room.",
  "Ask Seluvis about Nokron and take his introduction": "After joining Ranni, descend Seluvis's Rise and ask him about Nokron. Take Seluvis's Introduction; do not give Ranni the Fingerslayer Blade until the route explicitly clears Seluvis's reward.",
  "Give Seluvis's Introduction to Sellen at Waypoint Ruins": "Defeat the Mad Pumpkin Head below Waypoint Ruins if needed, open Sellen's room and show her Seluvis's Introduction. Ask about General Radahn, then return to Blaidd in Siofra River.",
  "Finish Seluvis and collect Magic Scorpion Charm before handing over the Fingerslayer Blade": "Give Seluvis's potion to the chosen recipient, find his puppet cellar in the ruins between Ranni's and Renna's rises, buy a puppet, reload and ask for another. Give him the Amber Starlight from north-east Altus and collect Magic Scorpion Charm. Giving Ranni the Fingerslayer Blade first ends this quest and loses the charm.",
  "Collect Amber Starlight north-east of Altus Highway Junction": "From Altus Highway Junction ride north-east through the narrow shaded ravine toward Sainted Hero's Grave. Take the Amber Starlight from the ground before the statue, then return to Seluvis; do not give his resulting draught to Ranni.",
  "Use the statue in Carian Study Hall and collect the Cursemark of Death": "Place the Carian Inverted Statue on the pedestal inside Carian Study Hall. Traverse the inverted hall to Liurnia Tower Bridge, defeat the Godskin Noble and climb the Divine Tower of Liurnia for the Cursemark needed by Fia.",
  "Give Nepheli the Stormhawk King after her Village of the Albinaurics dialogue": "Speak to Nepheli below the stone bridge at Village of the Albinaurics and defeat the Omenkiller. After Gideon rejects her at Roundtable, give her the Stormhawk King from Chapel of Anticipation; do not give her Seluvis's potion if preserving her smithing-stone reward.",
  "Give D the Weathered Dagger from Fia and reload Roundtable Hold": "After resting on Altus, let Fia hold you and accept the Weathered Dagger. Give it to D, reload, then enter the newly opened room past Hewg. Take the Twinned Set and exhaust Fia before she leaves for Deeproot.",
  "Give Boc the Gold Sewing Needle and use You're Beautiful instead of a Larval Tear": "Give Boc the Gold Sewing Needle while carrying altered demigod armour, then use the You're Beautiful prattling pate beside him and affirm that he is beautiful. Do not give him a Larval Tear; rebirth kills him shortly afterward.",
  "Defeat Commander O'Neil in Aeonia Swamp and take the Unalloyed Gold Needle": "Ride into the eastern Aeonia Swamp and circle O'Neil on Torrent while clearing his summoned soldiers. Take the broken needle to Gowry's Shack south of Sellia; reload at a grace before returning for the repaired needle.",
  "Collect Valkyrie's Prosthesis from the Shaded Castle": "Enter the Shaded Castle from the north-west poison rampart and follow the inner wall to the room guarded by a Cleanrot Knight. Open the chest for the prosthesis; Elemer does not need to be defeated for this item.",
  "Move Sellen's primal glintstone and resolve the Sellen or Jerren summon signs": "After finding Lusat, take Sellen's primal glintstone from Witchbane Ruins and place it in the puppet beneath the ruins near Ranni's Rise. Exhaust Jerren after Radahn and at Witchbane, then choose the gold sign outside Rennala for Sellen's spell rewards or the red sign for Jerren's Ancient Dragon Smithing Stone.",
  "Find Goldmask at the Forest-Spanning Greatbridge and reunite Corhyn with him": "Use the sending gate beside the Forest-Spanning Greatbridge grace to reach the broken northern span and speak to Goldmask. Tell Corhyn his location near the Altus map pillar, reload, then exhaust both together on the bridge.",
  "Complete Old Knight Istvan and Rileigh contracts": "Read the red letter in Volcano Manor's drawing room. Defeat Istvan at the red mark north of Warmaster's Shack, report to Tanith, then read the second letter and defeat Rileigh at the Altus red mark south of Bridge of Iniquity before reporting again.",
  "Do not defeat Rykard before the Mountaintops contract and Rya checks": "Stop before Tanith's audience chamber. Rykard's death makes the manor residents leave and can forfeit contract dialogue and rewards. Continue only after Juno Hoslow is defeated, Rya's choice is settled, and Bernahl and Patches have paid their rewards.",
  "Collect Bolt of Gransax before Maliketh": "From Erdtree Sanctuary, take the lift west, descend the stairs and drop from the railing onto the giant golden spear. Walk up the spear to the Bolt. It becomes unobtainable after Maliketh turns Leyndell into the Ashen Capital.",
  "Collect Coded Sword before Maliketh": "From West Capital Rampart, enter the fortified manor that mirrors Roundtable Hold and open the throne-room doors. Take the Coded Sword from the throne before defeating Maliketh.",
  "Complete Goldmask, Corhyn, Dung Eater and Gideon reward checks before the Forge": "Before using the Forge, finish Corhyn and Goldmask's Mountaintops dialogue, resolve Dung Eater's underground-gaol route and collect Gideon's available shardbearer rewards. Also finish any Melina dialogue you want to hear. The Forge advances several NPC states; Maliketh later removes the original capital.",
  "Confirm Bolt of Gransax and Coded Sword are collected": "Check both weapons in inventory before approaching Maliketh. If either is missing, return to the original Leyndell now; defeating Maliketh permanently removes their pickup locations.",
  "Light all four Ordina evergaol statues": "Enter Ordina's evergaol at the imp statue. Light the ground-level western candle, the roof candle reached by the western ladder, the central tower candle and the north-east rooftop candle. Use cover or Sentry's Torch against invisible assassins; all four remain lit after death.",
  "Choose Millicent's gold summon sign and collect Rotten Winged Sword Insignia": "After killing the Drainage Channel Ulcerated Tree Spirit, reload the area and use the gold summon sign on the ledge above the rot pool. Help Millicent defeat her sisters; the red sign kills her and gives the different Prosthesis reward instead.",
  "Finish Varre's invasion and maiden-blood steps": "After speaking to the Two Fingers, meet Varre at Rose Church. Use three Festering Bloody Fingers or defeat Magnus at Writheblood Ruins, accept the Lord of Blood's Favor, soak it in maiden blood at the Church of Inhibition or Chapel of Anticipation, then return for the reusable finger and Pureblood Knight's Medal.",
  "Collect the Purifying Crystal Tear from Eleonora at the Second Church of Marika": "Advance Yura through the Ravenmount Assassin sign at Main Academy Gate, then visit the Second Church of Marika in Altus. Speak to the dying Yura and defeat Eleonora when she invades; she drops the Purifying Crystal Tear.",
  "Release Dung Eater, defeat his moat invasion and choose the curse or puppet route": "Use a Seedbed Curse to receive the Sewer-Gaol Key, free Dung Eater below the Underground Roadside and read his Roundtable message. Buy prawn from Boggart first, then defeat Dung Eater at the outer-moat invasion. For his ending, feed the body five Seedbed Curses; for the puppet, delay Seluvis's potion and Fingerslayer hand-in until now and administer the potion before progressing Ranni.",
  "Trigger the great-rune break only after the follower check": "After revisiting every named follower, ride north from Highroad Cross toward Shadow Keep until the on-screen message says a great rune and powerful charm have broken. This opens Stone Coffin Fissure but changes Moore, Hornsent, Leda, Freyja, Ansbach and Thiollier dialogue, so do not trigger it early.",
  "Give Ansbach the Secret Rite Scroll before finishing Freyja's letter exchange": "In Specimen Storehouse, find the Secret Rite Scroll above Storehouse Fourth Floor and give it to Ansbach on the first floor. Speak to Freyja on the seventh floor, ask Ansbach for his letter, then deliver it to Freyja. Exhaust both before Messmer or the sealing tree advances them.",
  "Choose Moore's answer only after collecting the available Forager Brood cookbooks": "Moore's post-break question is irreversible. 'Put it behind you' sends him to Leda's final battle and lets you recover his gear and bell bearing there; 'remain sad forever' leaves his body and rewards near Church of the Crusade; 'I don't know' postpones the choice. Collect the living Forager Brood cookbooks before choosing.",
  "Resolve the Leda and Hornsent bridge summon signs before entering Messmer's arena": "At Shadow Keep's burning-boat bridge, choose one sign or deliberately ignore both before entering Messmer. Helping Hornsent awards Swift Slash and keeps his Messmer/Rauh route; helping Leda removes Hornsent and awards Lacerating Crossed-Tree after reporting to her. The signs disappear as soon as Messmer's arena is entered.",
  "Resolve the Leda and Ansbach Storehouse signs for the party's required reward": "If Leda targets Ansbach, red and gold signs appear in his Storehouse room. Use the gold sign to protect Ansbach, receive Ansbach's Longbow and keep him for Enir-Ilim and Obsidian Lamina. Use the red sign only if a selected build specifically needs Retaliatory Crossed-Tree; this kills Ansbach and ends his finale rewards. In normal co-op the alternate result can be taken in another player's world.",
  "Find Queelign in Shadow Keep Prayer Room and choose the Iris reward": "After both Queelign invasions, open the Prayer Room with its key and speak to him. Iris of Grace gives Fire Knight Queelign spirit ashes; Iris of Occultation gives Queelign's Greatsword. The choice is permanent, so use the reward named by the selected build.",
  "Choose whether to summon Hornsent inside Messmer before crossing the fog": "If Hornsent survived the bridge choice, his gold sign is inside Messmer's arena. Summoning him and exhausting him afterward continues his Rauh invasion; defeating Messmer without summoning him changes his later placement. Decide now because crossing the fog also closes the bridge-sign event.",
  "Imbibe St. Trina's nectar four times until she speaks": "At Garden of Deep Purple, choose Imbibe Nectar and accept the death repeatedly. Return after each respawn; on the fourth imbibing St. Trina speaks. Continue until all dialogue repeats before reporting her words to Thiollier.",
  "Ring the Finger Ruins of Rhia bell": "From Cerulean Coast Cross, ride east into the Finger Ruins of Rhia. Stay around the outer rim to avoid the central enemies, reach the hanging finger at the northern centre and sound the bell while wearing Ymir's Hole-Laden Necklace.",
  "Open the Hinterland with O Mother and ring the Dheo bell": "At Shadow Keep, Back Gate, enter the side chapel and perform O Mother before Marika's statue to open the hidden wall. Cross Hinterland and Fingerstone Hill to the Dheo hanging finger, then sound it with Ymir's necklace.",
  "Do not touch the sealing tree until every follower check is complete": "Stop after Romina. Before interacting with the sealing tree, finish Moore, Thiollier, Hornsent, Ansbach, Freyja, Leda, Dane, Igon, Ymir and Jolan, collect their available rewards and confirm Ansbach and Thiollier are eligible for Enir-Ilim. Burning the tree is the DLC's final shared quest cutoff.",
};

const ESSENTIAL_MAP_QUERIES: Record<string, string> = {
  "Axe of Godrick": "Godrick the Grafted",
  "Grafted Dragon": "Godrick the Grafted",
  "Carian Regal Scepter": "Rennala, Queen of the Full Moon",
  "Starscourge Greatsword": "Starscourge Radahn",
  "Lion Greatbow": "Starscourge Radahn",
  "Blasphemous Blade": "Rykard, Lord of Blasphemy",
  "Morgott's Cursed Sword": "Morgott, the Omen King",
  "Bastard's Stars": "Astel, Naturalborn of the Void",
  "Giant's Red Braid": "Fire Giant",
  "Hand of Malenia": "Malenia, Goddess of Rot",
  "Dragon King's Cragblade": "Dragonlord Placidusax",
  "Maliketh's Black Blade": "Beast Clergyman / Maliketh, The Black Blade",
  "Axe of Godfrey": "Godfrey, First Elden Lord",
  "Hoarah Loux's Earthshaker": "Godfrey, First Elden Lord",
  "Sacred Relic Sword": "Radagon of the Golden Order",
  "Marika's Hammer": "Radagon of the Golden Order",
  "Rellana's Twin Blades": "Rellana, Twin Moon Knight",
  "Putrescence Cleaver": "Putrescent Knight",
  "Shadow Sunflower Blossom": "Scadutree Avatar",
  "Staff of the Great Beyond": "Metyr, Mother of Fingers",
  "Gazing Finger": "Metyr, Mother of Fingers",
  "Spear of the Impaler": "Messmer the Impaler",
  "Poleblade of the Bud": "Romina, Saint of the Bud",
  "Greatsword of Radahn (Lord)": "Radahn, Consort of Miquella - Enir-Ilim",
  "Greatsword of Radahn (Light)": "Radahn, Consort of Miquella - Enir-Ilim",
  "Obsidian Lamina": "Radahn, Consort of Miquella - Enir-Ilim",
  "Church of Elleh: Crafting Kit, Kale and smithing table": "Church of Elleh",
  "Gatefront: Whetstone Knife and first map": "Gatefront Ruins",
  "Third Church: Flask of Wondrous Physick": "Third Church of Marika",
  "Limgrave Tunnels: early Smithing Stones": "Limgrave Tunnels",
  "Accept Melina's accord and receive Torrent": "Gatefront Ruins",
  "Enter Margit's arena once to trigger the Roundtable Hold invitation": "Margit, the Fell Omen",
  "Accept Melina's invitation and meet Smithing Master Hewg": "Margit, the Fell Omen",
  "Speak to Ensha at Roundtable Hold before taking a secret medallion": "Haligtree Secret Medallion (Right)",
  "Return to Blaidd in Siofra and exhaust his dialogue": "Blaidd (Ranni's Quest - First Location)",
  "Speak to Jerren in Redmane Plaza to begin the festival": "Redmane Castle Plaza",
  "Use both Dectus Medallion halves at the Grand Lift": "Grand Lift of Dectus",
  "Rest at Altus Plateau grace and revisit Roundtable quest NPCs": "Altus Plateau (Site of Grace)",
  "Complete Old Knight Istvan and Rileigh contracts": "Volcano Manor",
  "Exhaust Alexander and Blaidd in the Wailing Dunes before leaving": "Starscourge Radahn",
  "Do not give Ranni the Amber Draught": "Ranni the Witch",
  "Reload, find Rya in the side room and settle the Tonic of Forgetfulness decision": "Rya (End of Questline Location)",
  "Do not defeat Rykard before Juno, Bernahl and Rya are complete": "Rykard, Lord of Blasphemy",
  "Complete Bernahl's Vargram and Wilhelm invasion in Fortified Manor": "Fortified Manor, First Floor",
  "Learn Law of Regression and cast it before Radagon's statue": "Erdtree Sanctuary",
  "Visit Dung Eater's projection and unlock his sewer gaol before the Ashen transition": "Dung Eater",
  "Collect any remaining Ashen Capital rewards": "Leyndell, Capital of Ash",
  "Assist the friendly Forager Brood before its cookbook opportunities close": "Moore - Belurat Tower Settlement",
  "Revisit every follower before any rune-break boundary": "Highroad Cross",
  "Choose Moore's answer only after collecting the available Forager Brood cookbooks": "Moore - Belurat Tower Settlement",
  "Do not enter Messmer's arena until every faction card is complete": "Messmer's Dark Chamber",
  "Resolve the Leda and Ansbach Storehouse signs for the party's required reward": "Storehouse, First Floor",
  "Meet Rogier in the chapel and inspect the corpse below Stormveil": "Sorcerer Rogier (First Location)",
  "Meet Nepheli before Godrick": "Nepheli Loux",
  "Collect the second Academy Glintstone Key": "Academy Glintstone Key (B)",
  "Exhaust Rogier before joining Ranni": "Sorcerer Rogier (First Location)",
  "Move Sellen's primal glintstone and resolve the Sellen or Jerren summon signs": "Witch-Hunter Jerren (Third Location)",
  "Buy prawn from Blackguard Boggart before releasing Dung Eater": "Blackguard Big Boggart",
  "Release Dung Eater, defeat his moat invasion and choose the curse or puppet route": "Dung Eater",
  "Finish Nepheli and Kenneth, then reload Godrick's throne room with Gostoc alive": "Godrick the Grafted",
  "Defeat or pass Glintstone Dragon Adula": "Glintstone Dragon Adula",
  "Collect Gideon's rewards for Mohg, Malenia, Haligtree and Mohgwyn before Maliketh": "Gideon Ofnir",
  "Confirm the Leda, Hornsent and Ansbach invasion choices are resolved": "Church of the Bud",
  "Confirm Moore's answer and resulting location are known": "Church of the Bud",
  "Advance Bernahl, Patches, Diallos and Rya dialogue": "Rya (Second Location)",
  "Do not defeat Rykard before the Mountaintops contract and Rya checks": "Rykard's Great Rune",
  "Confirm at least two Great Runes are obtained": "Draconic Tree Sentinel",
  "Finish Rya's dialogue and choice": "Rya (End of Questline Location)",
  "Collect Bernahl, Patches and Tanith contract rewards": "Tanith",
  "Light all four Ordina evergaol statues": "Ordina, Liturgical Town",
  "Defeat Loretta and descend into Elphael": "Loretta, Knight of the Haligtree",
  "Return the needle to Malenia's bloom for Miquella's Needle": "Malenia, Goddess of Rot",
  "Finish Varre's invasion and maiden-blood steps": "White-Mask Varre (Second Location)",
  "Speak to Melina at the Forge and commit to the cardinal sin": "Forge of the Giants",
  "Confirm Radahn and Mohg are defeated": "Mohg, Lord of Blood",
  "Touch Miquella's withered arm in Mohg's arena": "Cocoon of the Empyrean",
  "Speak to Leda at the cocoon and enter the Realm of Shadow": "Cocoon of the Empyrean",
  "Clear Belurat and defeat Divine Beast Dancing Lion": "Divine Beast Dancing Lion - Belurat Tower Settlement",
  "Finish Moore, Thiollier, Freyja, Hornsent and Ansbach dialogue": "Three-Path Cross",
  "Trigger the great-rune break only after the follower check": "Highroad Cross",
  "Imbibe St. Trina's nectar four times until she speaks": "St. Trina - Stone Coffin Fissure",
  "Do not defeat Messmer until the faction checks are complete": "Messmer's Dark Chamber",
  "Return to Ymir and exhaust both characters' dialogue": "Count Ymir",
  "Inspect Ymir's empty throne and defeat Swordhand of Night Anna": "Finger Ruins of Miyr",
  "Ring the Miyr bell and defeat Metyr": "Metyr, Mother of Fingers",
  "Collect Map: Rauh Ruins from the lower ravine route": "Map: Rauh Ruins",
  "Finish Moore, Thiollier, Hornsent, Ansbach, Freyja, Leda, Dane, Igon and Ymir reward checks": "Church of the Bud",
  "Do not touch the sealing tree until every follower check is complete": "Church of the Bud",
  "Meet Rogier and Nepheli": "Sorcerer Rogier (First Location)",
  "Reach Iji in north-west Liurnia": "War Counselor Iji",
  "Collect Academy Glintstone Key": "Academy Glintstone Key (A)",
  "Speak to Ranni and all three retainers": "Ranni the Witch",
  "Meet Blaidd in Siofra": "Blaidd (Ranni's Quest - First Location)",
  "Collect Map: Caelid": "Map (Caelid)",
  "Activate the festival": "Redmane Castle Plaza",
  "Finish selected contracts before Rykard": "Tanith",
  "Defeat Godfrey's golden shade": "Godfrey, First Elden Lord (Golden Shade)",
  "Defeat Baleful Shadow": "Nokstella Waterfall Basin",
  "Exhaust Fia's dialogue and reload": "Fia (Second Location)",
  "Enter the deathbed dream": "Prince of Death's Throne",
  "Use both Haligtree Secret Medallion halves": "Grand Lift of Rold",
  "Solve Ordina's evergaol": "Ordina, Liturgical Town",
  "Finish Millicent before Malenia": "Millicent (Final Location)",
  "Finish relevant Varre steps": "White-Mask Varre (Second Location)",
  "Enter through Varre or Snowfield waygate": "Palace Approach Ledge-Road",
  "Defeat Mohg": "Mohg, Lord of Blood",
  "Find the hidden Placidusax drop-down": "Beside the Great Bridge",
  "Defeat Maliketh only after capital checks": "Beast Clergyman / Maliketh, The Black Blade",
  "Defeat Godfrey / Hoarah Loux": "Godfrey, First Elden Lord",
  "Defeat Radagon and Elden Beast": "Radagon of the Golden Order",
  "Choose ending; do not start Journey 2": "Fractured Marika",
  "Defeat Blackgaol Knight": "Western Nameless Mausoleum",
  "Clear Belurat and Dancing Lion": "Divine Beast Dancing Lion - Belurat Tower Settlement",
  "Collect nearby Miquella Crosses": "Three-Path Cross",
  "Speak to every follower before and after the rune breaks": "Highroad Cross",
  "Open Storehouse paths": "Storehouse, First Floor",
  "Do not burn the sealing tree": "Church of the Bud",
  "Cross the woods without Torrent": "Abyssal Woods",
  "Summon Igon inside the summit arena": "Bayle the Dread",
  "Ring the Rhia and Dheo ruin bells": "Finger Ruins of Rhia",
  "Enter the throne passage": "Count Ymir",
  "Collect Rauh map from the lower ravine route": "Map: Rauh Ruins",
  "Burn the sealing tree only when all quests are ready": "Church of the Bud",
  "Defeat Leda and her allies": "Cleansing Chamber Anteroom",
  "Summon eligible allies for their quest rewards": "Cleansing Chamber Anteroom",
  "Spend remaining fragments up to the desired difficulty": "Spiral Rise",
};

const OBJECTIVE_MAP_LAYERS: Record<string, MapItem["layer"]> = {
  "Meet Blaidd in Siofra": "underground",
  "Return to Blaidd in Siofra and exhaust his dialogue": "underground",
  "Collect Dark Moon Ring": "surface",
  "Collect the Purifying Crystal Tear from Eleonora at the Second Church of Marika": "surface",
  "Confirm Radahn and Mohg are defeated": "underground",
  "Touch Miquella's withered arm in Mohg's arena": "underground",
  "Speak to Leda at the cocoon and enter the Realm of Shadow": "underground",
};

const mapLayerForObjective = (chapter: Chapter, label: string) => OBJECTIVE_MAP_LAYERS[label] || mapLayerForChapter(chapter);

const FLASK_UPGRADE_STOPS: Record<string, string[]> = {
  "first-steps": ["Sacred Tear (Third Church of Marika)", "Golden Seed - Fort Haight"],
  weeping: ["Golden Seed - Weeping Peninsula", "Sacred Tear (Church of Pilgrimage)", "Sacred Tear (Fourth Church of Marika)", "Sacred Tear (Callu Baptismal Church)"],
  stormveil: ["Golden Seed (A) - Stormveil Castle"],
  "liurnia-south": ["Sacred Tear (Church of Irith)", "Golden Seed - Academy Gate Town"],
  academy: ["Golden Seed - Raya Lucaria Academy"],
  caria: ["Golden Seed - Caria Manor", "Sacred Tear (Bellum Church)", "Sacred Tear (Church of Inhibition)"],
  caelid: ["Golden Seed - South Caelid", "Golden Seed - Sellia, Town of Sorcery", "Sacred Tear (Church of the Plague)"],
  nokron: ["Golden Seed"],
  altus: ["Golden Seed - Altus Highway Junction", "Golden Seed - Lux Ruins", "Golden Seed - Minor Erdtree Altus Plateau", "Golden Seed - Windmill Village", "Sacred Tear (Second Church of Marika)", "Sacred Tear (Stormcaller Church)"],
  gelmir: ["Golden Seed - Seethewater River", "Golden Seed - Northwest Mt. Gelmir"],
  leyndell: ["Golden Seed - 2x Capital Outskirts West", "Golden Seed - 2x Capital Outskirts Northwest", "Golden Seed - 2x Leyndell Royal Capital"],
  ainsel: ["Golden Seed - Ainsel River", "Golden Seed - Grand Cloister"],
  mountaintops: ["Golden Seed - Forbidden Lands", "Golden Seed - Flame Peak", "Golden Seed - Mountaintops of the Giants East", "Sacred Tear (Church of Ripose)", "Sacred Tear (First Church of Marika)"],
  haligtree: ["Golden Seed (Consecrated Snowfield)", "Golden Seed (Ordina Liturgical Town)", "Golden Seed - Elphael, Brace of the Haligtree"],
  mohgwyn: ["Golden Seed - Mohgwyn Palace"],
};

function objectiveMapQuery(label: string) {
  if (ESSENTIAL_MAP_QUERIES[label]) return ESSENTIAL_MAP_QUERIES[label];
  const withoutAction = label.replace(/^Defeat\s+/i, "").replace(/^Speak (?:to|with)\s+/i, "").trim();
  return withoutAction.split(":")[0].split(",")[0].trim();
}

function essentialGuide(chapter: Chapter, label: string, index: number) {
  if (ESSENTIAL_GUIDES[label]) return ESSENTIAL_GUIDES[label];
  const objectiveLayer = mapLayerForObjective(chapter, label);
  const mappedItem = findMapItem(label, objectiveLayer);
  const mappedPoint = findMapRoutePoint(objectiveMapQuery(label), objectiveLayer);
  const description = mappedItem?.description || mappedPoint?.description;
  if (description) return `Area: ${chapter.region}. Start from ${chapter.grace}. ${description}`;
  const previous = index > 0 ? ` after completing “${chapter.essentials[index - 1]}”` : "";
  return `Area: ${chapter.region}. Start from ${chapter.grace}${previous}. ${chapter.directions} Complete the named objective before checking off this card.`;
}

const STAT_LABELS: Record<StatKey, string> = { vigor: "VIG", mind: "MND", endurance: "END", strength: "STR", dexterity: "DEX", intelligence: "INT", faith: "FAI", arcane: "ARC" };
const formatRunes = (value: number) => Math.max(0, Math.round(value)).toLocaleString("en-GB");

function phaseForChapter(chapter: Chapter): PhaseKey {
  const index = chapters.indexOf(chapter);
  const dlc = chapters.findIndex((candidate) => candidate.id === PHASE_START.dlc);
  const late = chapters.findIndex((candidate) => candidate.id === PHASE_START.late);
  const mid = chapters.findIndex((candidate) => candidate.id === PHASE_START.mid);
  return index >= dlc ? "dlc" : index >= late ? "late" : index >= mid ? "mid" : "early";
}

function weaponRequirements(value: string): Partial<AttributeBlock> {
  const record = findWeaponUpgradeRecord(value);
  if (!record) return {};
  return {
    ...(record.reqStr ? { strength: record.reqStr } : {}),
    ...(record.reqDex ? { dexterity: record.reqDex } : {}),
    ...(record.reqInt ? { intelligence: record.reqInt } : {}),
    ...(record.reqFai ? { faith: record.reqFai } : {}),
    ...(record.reqArc ? { arcane: record.reqArc } : {}),
  };
}

function completeCheckpointStats(value?: Partial<AttributeBlock>): AttributeBlock | undefined {
  if (!value || !(Object.keys(STAT_LABELS) as StatKey[]).every((stat) => Number.isInteger(value[stat]) && Number(value[stat]) >= 1 && Number(value[stat]) <= 99)) return undefined;
  return value as AttributeBlock;
}

function statScheduleText(previous: AttributeBlock, current: AttributeBlock, fromLevel: number, priorities: readonly StatKey[], requirements: Partial<AttributeBlock> = {}, maximumPoints = Number.POSITIVE_INFINITY) {
  const priorityOrder = (Object.keys(STAT_LABELS) as StatKey[]).sort((a, b) => {
    const requirementA = previous[a] < (requirements[a] ?? 0) ? 0 : 1;
    const requirementB = previous[b] < (requirements[b] ?? 0) ? 0 : 1;
    const routeOrder = (stat: StatKey) => stat === "vigor" ? 0 : priorities.includes(stat) ? 1 + priorities.indexOf(stat) : stat === "mind" ? 10 : stat === "endurance" ? 11 : 20;
    return requirementA - requirementB || routeOrder(a) - routeOrder(b);
  });
  let nextLevel = fromLevel + 1;
  let pointsLeft = maximumPoints;
  const scheduled = { ...previous };
  const steps: string[] = [];
  for (const stat of priorityOrder) {
    const amount = Math.min(pointsLeft, Math.max(0, current[stat] - previous[stat]));
    if (!amount) continue;
    const first = nextLevel;
    const last = nextLevel + amount - 1;
    scheduled[stat] += amount;
    steps.push(`${first === last ? `RL${first}` : `RL${first}–${last}`}: ${STAT_LABELS[stat]} to ${scheduled[stat]} (${amount} ${amount === 1 ? "point" : "points"})`);
    nextLevel = last + 1;
    pointsLeft -= amount;
  }
  const unfilled = priorityOrder.filter((stat) => scheduled[stat] < current[stat]);
  const warning = unfilled.length ? ` Remaining target deficits carry into the next checkpoint: ${unfilled.map((stat) => STAT_LABELS[stat]).join(", ")}` : "";
  return steps.length ? `${steps.join("; ")}${warning}` : "No levels are due at this checkpoint";
}

function expectedRunesBeforeBoss(chapterIndex: number, expedition: Expedition) {
  const lossRate = Math.min(.3, Math.max(.1, (expedition.lossRate ?? 20) / 100));
  const economyMode = expedition.mode === "solo" ? "seamless" : expedition.mode;
  return CHAPTER_ECONOMY.slice(0, chapterIndex + 1).reduce((total, economy, index) => {
    const boss = index < chapterIndex ? expectedPerPlayerBossPot(economy.bossRunes, expedition.players.length, economyMode) : 0;
    total.low += Math.floor(economy.fieldRunesLow * (1 - lossRate)) + boss;
    total.high += Math.floor(economy.fieldRunesHigh * (1 - lossRate)) + boss;
    return total;
  }, { low: 0, high: 0 });
}

function guideTargets(economy: (typeof CHAPTER_ECONOMY)[number], levelOffset: number) {
  const offset = Math.max(0, Math.min(20, Math.floor(levelOffset)));
  return {
    runeLevel: Math.max(1, economy.targetRuneLevel - offset),
    standardUpgrade: Math.max(0, economy.standardUpgradeTarget - Math.floor(offset / 5)),
    somberUpgrade: Math.max(0, economy.somberUpgradeTarget - Math.floor(offset / 10)),
  };
}

function affordableLevelAndUpgrade({
  originLevel,
  minimumLevel,
  desiredLevel,
  minimumUpgrade,
  desiredUpgrade,
  path,
  availableRunes,
}: {
  originLevel: number;
  minimumLevel: number;
  desiredLevel: number;
  minimumUpgrade: number;
  desiredUpgrade: number;
  path?: UpgradePath;
  availableRunes: number;
}) {
  const maximumUpgrade = path === "somber" ? 10 : 25;
  const safeDesiredUpgrade = path ? Math.max(0, Math.min(maximumUpgrade, desiredUpgrade)) : 0;
  const safeMinimumUpgrade = path ? Math.max(0, Math.min(safeDesiredUpgrade, minimumUpgrade)) : 0;
  for (let level = desiredLevel; level >= Math.max(originLevel, minimumLevel); level -= 1) {
    const levelGap = desiredLevel - level;
    const upgradeReduction = path === "somber" ? Math.ceil(levelGap / 10) : Math.ceil(levelGap / 5);
    const upgrade = path ? Math.max(safeMinimumUpgrade, safeDesiredUpgrade - upgradeReduction) : 0;
    const materialRunes = path ? planWeaponUpgrade(path, 0, upgrade).materialPurchaseRunes : 0;
    const levelRunes = runesBetweenLevels(originLevel, level);
    if (levelRunes + materialRunes <= availableRunes) return { level, upgrade, levelRunes, materialRunes };
  }
  return { level: Math.max(originLevel, minimumLevel), upgrade: safeMinimumUpgrade, levelRunes: 0, materialRunes: 0 };
}

type RuneSupportChapter = {
  bosses: OptionalRuneBoss[];
  chapterBossRunes: number;
  cumulativeBossRunes: number;
  levels: Record<string, number>;
  upgrades: Record<string, number>;
};

function runeSupportPlan(expedition: Expedition): Record<string, RuneSupportChapter> {
  const result: Record<string, RuneSupportChapter> = {};
  let cumulativeBossRunes = 0;
  const levelOffset = expedition.levelOffset ?? 0;
  const economyMode = expedition.mode === "solo" ? "seamless" : expedition.mode;
  const previousLevels: Record<string, number> = {};
  const previousUpgrades: Record<string, number> = {};
  const previousUpgradePaths: Record<string, UpgradePath | undefined> = {};

  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex += 1) {
    const chapter = chapters[chapterIndex];
    const economy = CHAPTER_ECONOMY_BY_ID[chapter.id];
    if (!economy) continue;
    const targets = guideTargets(economy, levelOffset);
    const expected = expectedRunesBeforeBoss(chapterIndex, expedition);
    let maximumShortfall = 0;

    for (const player of expedition.players) {
      const selected = builds.find((candidate) => candidate.id === player.buildId)!;
      const loadout = stageLoadout(selected, phaseForChapter(chapter));
      const plannedClass = selected.startingClass === "Not specified" ? planBuildStatTarget(selected, 170).origin.name : selected.startingClass;
      const plan = planBuildStatTarget({ ...selected, startingClass: plannedClass }, targets.runeLevel, weaponRequirements(loadout.weapon));
      const pathResult = weaponUpgradePath(loadout.weapon);
      const path: UpgradePath | undefined = pathResult === "none" ? undefined : pathResult;
      const desiredUpgrade = path === "somber" ? targets.somberUpgrade : targets.standardUpgrade;
      const materials = path ? planWeaponUpgrade(path, 0, desiredUpgrade).materialPurchaseRunes : 0;
      const required = runesBetweenLevels(plan.origin.level, targets.runeLevel) + materials + economy.purchaseReserve;
      maximumShortfall = Math.max(maximumShortfall, required - expected.low - cumulativeBossRunes);
    }

    const manualSelection = expedition.runeBossSelections?.[chapter.id];
    const recovery = manualSelection
      ? {
          bosses: manualSelection.map((id) => OPTIONAL_RUNE_BOSSES.find((boss) => boss.id === id && boss.chapterId === chapter.id)).filter((boss): boss is OptionalRuneBoss => Boolean(boss)),
          perPlayerRunes: manualSelection.reduce((total, id) => {
            const boss = OPTIONAL_RUNE_BOSSES.find((candidate) => candidate.id === id && candidate.chapterId === chapter.id);
            return total + (boss ? expectedPerPlayerBossPot(boss.runes, expedition.players.length, economyMode) : 0);
          }, 0),
        }
      : selectOptionalRuneBosses(maximumShortfall, chapter.id, expedition.players.length, economyMode);
    cumulativeBossRunes += recovery.perPlayerRunes;
    const levels: Record<string, number> = {};
    const upgrades: Record<string, number> = {};
    for (const player of expedition.players) {
      const selected = builds.find((candidate) => candidate.id === player.buildId)!;
      const loadout = stageLoadout(selected, phaseForChapter(chapter));
      const plannedClass = selected.startingClass === "Not specified" ? planBuildStatTarget(selected, 170).origin.name : selected.startingClass;
      const plan = planBuildStatTarget({ ...selected, startingClass: plannedClass }, targets.runeLevel, weaponRequirements(loadout.weapon));
      const pathResult = weaponUpgradePath(loadout.weapon);
      const path: UpgradePath | undefined = pathResult === "none" ? undefined : pathResult;
      const desiredUpgrade = path === "somber" ? targets.somberUpgrade : targets.standardUpgrade;
      const spendable = Math.max(0, expected.low + cumulativeBossRunes - economy.purchaseReserve);
      const funded = affordableLevelAndUpgrade({
        originLevel: plan.origin.level,
        minimumLevel: previousLevels[player.id] ?? plan.origin.level,
        desiredLevel: targets.runeLevel,
        minimumUpgrade: previousUpgradePaths[player.id] === path ? (previousUpgrades[player.id] ?? 0) : 0,
        desiredUpgrade,
        path,
        availableRunes: spendable,
      });
      levels[player.id] = funded.level;
      upgrades[player.id] = funded.upgrade;
      previousLevels[player.id] = funded.level;
      previousUpgrades[player.id] = funded.upgrade;
      previousUpgradePaths[player.id] = path;
    }
    result[chapter.id] = {
      bosses: recovery.bosses,
      chapterBossRunes: recovery.perPlayerRunes,
      cumulativeBossRunes,
      levels,
      upgrades,
    };
  }
  return result;
}

function progressionTasksForChapter(chapter: Chapter, expedition: Expedition, support: Record<string, RuneSupportChapter> = runeSupportPlan(expedition)): Task[] {
  const economy = CHAPTER_ECONOMY_BY_ID[chapter.id];
  if (!economy) return [];
  const chapterIndex = chapters.indexOf(chapter);
  const previousEconomy = CHAPTER_ECONOMY[chapterIndex - 1];
  const phase = phaseForChapter(chapter);
  const previousPhase = chapterIndex > 0 ? phaseForChapter(chapters[chapterIndex - 1]) : phase;
  const expected = expectedRunesBeforeBoss(chapterIndex, expedition);
  const lossRate = expedition.lossRate ?? 20;
  const chapterSupport = support[chapter.id];
  const levelOffset = expedition.levelOffset ?? 0;
  const targets = guideTargets(economy, levelOffset);
  const result: Task[] = (chapterSupport?.bosses ?? []).map((boss) => ({
    id: `${chapter.id}-rune-boss-${boss.id}`,
    label: `Rune top-up: ${boss.name}`,
    detail: `${boss.location}. ${boss.directions} Listed solo reward: ${formatRunes(boss.runes)} runes. ${expedition.mode === "standard" ? `Complete it in each player's world; the planner budgets 75% for that player's hosted clear plus 25% for up to two clears as a summoned cooperator.` : expedition.mode === "solo" ? "Defeat it once in this world." : "Complete it once in the shared Seamless world."} This fight was added because the conservative rune budget needs it before the next funded level recommendation.`,
    kind: "boss" as const,
    perPlayer: expedition.mode === "standard",
    scope: expedition.mode === "standard" ? "Each player's world" : expedition.mode === "solo" ? "Solo" : "Shared session",
    optional: false,
    runeBossId: boss.id,
  }));

  for (const player of expedition.players) {
    const selected = builds.find((candidate) => candidate.id === player.buildId)!;
    const currentLoadout = stageLoadout(selected, phase);
    const currentWeapon = findWeaponUpgradeRecord(currentLoadout.weapon);
    const plannedClass = selected.startingClass === "Not specified"
      ? planBuildStatTarget(selected, 170).origin.name
      : selected.startingClass;
    const planningBuild = { ...selected, startingClass: plannedClass };
    const fundedTargetLevel = chapterSupport?.levels[player.id] ?? targets.runeLevel;
    const currentPlan = planBuildStatTarget(planningBuild, fundedTargetLevel, weaponRequirements(currentLoadout.weapon));
    const previousTargetLevel = previousEconomy
      ? (support[chapters[chapterIndex - 1]?.id]?.levels[player.id] ?? guideTargets(previousEconomy, levelOffset).runeLevel)
      : currentPlan.origin.level;
    const previousLoadout = stageLoadout(selected, previousPhase);
    const enteredLevel = expedition.checkpointLevels?.[`${chapter.id}:${player.id}`];
    const levelingFrom = Math.min(fundedTargetLevel, Math.max(currentPlan.origin.level, enteredLevel ?? previousTargetLevel));
    const enteredStats = completeCheckpointStats(expedition.checkpointStats?.[`${chapter.id}:${player.id}`]);
    const previousPlan = enteredLevel !== undefined
      ? planBuildStatTarget(planningBuild, levelingFrom, weaponRequirements(currentLoadout.weapon))
      : previousEconomy
      ? planBuildStatTarget(planningBuild, previousTargetLevel, weaponRequirements(previousLoadout.weapon))
      : { ...currentPlan, targetRuneLevel: currentPlan.origin.level, attributes: currentPlan.origin.attributes };
    const levelRunes = runesBetweenLevels(levelingFrom, fundedTargetLevel);
    const cumulativeLevelRunes = runesBetweenLevels(currentPlan.origin.level, fundedTargetLevel);
    const pathResult = weaponUpgradePath(currentLoadout.weapon);
    const upgradePath: UpgradePath | undefined = pathResult === "none" ? undefined : pathResult;
    const currentUpgrade = chapterSupport?.upgrades[player.id] ?? (upgradePath === "somber" ? targets.somberUpgrade : targets.standardUpgrade);
    const previousPathResult = weaponUpgradePath(previousLoadout.weapon);
    const previousUpgradePath: UpgradePath | undefined = previousPathResult === "none" ? undefined : previousPathResult;
    const plannedPreviousUpgrade = previousEconomy && previousUpgradePath === upgradePath
      ? (support[chapters[chapterIndex - 1]?.id]?.upgrades[player.id] ?? 0)
      : 0;
    const enteredWeaponLevel = expedition.checkpointWeaponLevels?.[`${chapter.id}:${player.id}`];
    const previousUpgrade = enteredWeaponLevel === undefined
      ? plannedPreviousUpgrade
      : Math.min(currentUpgrade, enteredWeaponLevel);
    const cumulativeMaterials = upgradePath ? planWeaponUpgrade(upgradePath, 0, currentUpgrade).materialPurchaseRunes : 0;
    const supplementalRunes = chapterSupport?.cumulativeBossRunes ?? 0;
    const projectedLow = expected.low + supplementalRunes - cumulativeLevelRunes - cumulativeMaterials - economy.purchaseReserve;
    const projectedHigh = expected.high + supplementalRunes - cumulativeLevelRunes - cumulativeMaterials - economy.purchaseReserve;
    const changes = statScheduleText(enteredStats ?? previousPlan.attributes, currentPlan.attributes, levelingFrom, currentPlan.priorities, weaponRequirements(currentLoadout.weapon), fundedTargetLevel - levelingFrom);
    const requirementText = currentWeapon
      ? ` Weapon requirements: ${[["STR", currentWeapon.reqStr], ["DEX", currentWeapon.reqDex], ["INT", currentWeapon.reqInt], ["FAI", currentWeapon.reqFai], ["ARC", currentWeapon.reqArc]].filter(([, value]) => Number(value) > 0).map(([stat, value]) => `${stat} ${value}`).join(", ") || "none"}.`
      : "";
    const soreseal = radagonSoresealBridgeAdvice({
      baseStats: previousPlan.attributes,
      requiredStats: weaponRequirements(currentLoadout.weapon),
      targetLevel: fundedTargetLevel,
      phase,
    });
    const targetNote = fundedTargetLevel < targets.runeLevel
      ? `The published guide target is RL${economy.targetRuneLevel}${levelOffset ? ` and this run is set ${levelOffset} levels below it` : ""}; the conservative income available here funds RL${fundedTargetLevel}, so that is the recommendation instead of displaying an unaffordable level.`
      : `This fully funds the ${levelOffset ? `RL${targets.runeLevel} target (${levelOffset} below the published guide)` : `published RL${targets.runeLevel} target`}.`;
    const budgetStatus = `After the assigned levels, reinforcement-material ceiling and ${formatRunes(economy.purchaseReserve)} reserve, the conservative projected balance is ${formatRunes(Math.max(0, projectedLow))} runes (${formatRunes(Math.max(0, projectedHigh))} on the comfortable estimate). ${targetNote}`;

    result.push({
      id: `${chapter.id}-level-${player.id}`,
      label: enteredLevel !== undefined && enteredLevel >= fundedTargetLevel ? `${player.name}: remain at RL${enteredLevel}` : `${player.name}: level from RL${levelingFrom} to RL${fundedTargetLevel}`,
      detail: `Rest at ${chapter.grace}. ${enteredLevel !== undefined ? `The checkpoint records RL${enteredLevel}. ` : ""}${levelingFrom < fundedTargetLevel ? `Buy ${fundedTargetLevel - levelingFrom} levels for ${formatRunes(levelRunes)} runes. Apply them exactly as follows: ${changes}.` : `Do not buy levels in this chapter; the recorded level already meets or exceeds the RL${fundedTargetLevel} route target.`} Planned class: ${currentPlan.origin.name}.${requirementText} Conservative cumulative income is ${formatRunes(expected.low + supplementalRunes)} runes after the ${lossRate}% field-loss allowance, completed-boss rotation and ${formatRunes(supplementalRunes)} from assigned rune top-up bosses. Keep ${formatRunes(economy.purchaseReserve)} unspent for merchants, arrows and consumables. ${budgetStatus}${soreseal.recommended ? ` Radagon's Soreseal can temporarily bridge ${soreseal.bridgedRequirements.map((stat) => STAT_LABELS[stat]).join("/")}; it also makes you take 15% more damage, so remove it once natural requirements are met.` : ""}`,
      kind: "level",
      playerId: player.id,
      perPlayer: false,
      scope: player.name,
    });

    if (upgradePath && currentUpgrade > previousUpgrade) {
      const upgrade = planWeaponUpgrade(upgradePath, previousUpgrade, currentUpgrade);
      const materials = upgrade.materials.map((material) => `${material.quantity}× ${material.name}`).join(", ");
      const smith = chapter.id === "first-steps"
        ? "At the Church of Elleh smithing table"
        : "At Smithing Master Hewg in Roundtable Hold";
      const smithLimit = chapter.id === "first-steps"
        ? " This table cannot reinforce beyond regular +3 or Somber +1."
        : " Hewg is available after the Roundtable invitation step in First Steps.";
      result.push({
        id: `${chapter.id}-upgrade-${player.id}-${upgradePath}`,
        label: `${player.name}: ${currentLoadout.weapon} to +${currentUpgrade}`,
        detail: `${smith}, take the active ${upgradePath === "somber" ? "Somber" : "regular"} weapon from +${previousUpgrade} to +${currentUpgrade}: ${materials}.${smithLimit} Buying every purchasable stone in this step would cost at most ${formatRunes(upgrade.materialPurchaseRunes)} runes; stones collected from this route reduce that amount. The reinforcement service price is weapon-specific and is shown before confirmation, so pay it only after keeping the ${formatRunes(economy.purchaseReserve)} merchant reserve. If ${currentLoadout.weapon} is still behind a later route card, reinforce the currently equipped bridge weapon to this cap and save enough stones to catch the named weapon up when collected. Do not exceed +${currentUpgrade} in this chapter.`,
        kind: "upgrade",
        playerId: player.id,
        perPlayer: false,
        scope: player.name,
      });
    }

    const isPhaseStart = PHASE_START[phase] === chapter.id;
    if (isPhaseStart) {
      const parsedArmour = splitArmourSpecification(currentLoadout.armour);
      const armourPieces = parsedArmour.length ? parsedArmour : splitArmourSpecification(`${currentPlan.origin.name} starting armour`);
      const armourWeight = armourPieces.reduce((sum, piece) => sum + piece.weight, 0);
      const armourPoise = armourPieces.reduce((sum, piece) => sum + piece.poise, 0);
      const offhand = findWeaponUpgradeRecord(currentLoadout.offhand);
      const knownWeight = armourWeight + (currentWeapon?.weight ?? 0) + (offhand?.weight ?? 0);
      const light = /light load|below 30%|blue dancer/i.test(currentLoadout.armour);
      const maximumLoad = maxEquipLoad(currentPlan.attributes.endurance);
      const loadLimit = maxWeightForTier(maximumLoad, light ? "light" : "medium");
      const remaining = loadLimit - knownWeight;
      const pieces = armourPieces.length ? armourPieces.map((piece) => `${piece.name} ${piece.weight}`).join(", ") : currentLoadout.armour;
      const acquisition = /starting armour/i.test(currentLoadout.armour) || !parsedArmour.length
        ? `The starting set is already owned when ${currentPlan.origin.name} is chosen.`
        : Array.from(new Set([currentLoadout.armour.includes("Carian Knight") ? itemGuides["Carian Knight Set"] : "", currentLoadout.armour.includes("Scaled") ? itemGuides["Scaled Set"] : "", currentLoadout.armour.includes("Knight Set") && !currentLoadout.armour.includes("Carian") ? itemGuides["Knight Set"] : ""].filter(Boolean))).join(" ");
      result.push({
        id: `${chapter.id}-armour-${player.id}`,
        label: `${player.name}: armour and equip-load check`,
        detail: `${pieces}. ${acquisition} Named armour totals ${armourWeight.toFixed(1)} weight and ${armourPoise} poise. With ${currentLoadout.weapon}${currentWeapon?.weight != null ? ` (${currentWeapon.weight} weight)` : ""}${offhand?.weight != null ? ` and the named off-hand (${offhand.weight})` : ""}, the verified subtotal is ${knownWeight.toFixed(1)}. END ${currentPlan.attributes.endurance} gives ${maximumLoad.toFixed(1)} maximum load; stay below ${loadLimit.toFixed(1)} for ${light ? "Light" : "Medium"} Load. That leaves ${remaining.toFixed(1)} for the other hand slots and talismans. Confirm the words “${light ? "Light" : "Medium"} Load” on the Status screen; if it says Heavy Load, remove the heaviest armour piece before leaving the grace.`,
        kind: "armour",
        playerId: player.id,
        perPlayer: false,
        scope: player.name,
      });
    }
  }
  return result;
}

function tasksForChapter(chapter: Chapter, expedition: Expedition, support?: Record<string, RuneSupportChapter>): Task[] {
  const tasks: Task[] = [];
  chapter.essentials.forEach((label, index) => {
    const isBoss = label.startsWith("Defeat");
    const isQuest = /speak|meet|quest|dialogue|decision|finish|resolve|ranni|fia|millicent|leda|ansbach|thiollier|moore|igon|varre/i.test(label);
    const individualPickup = /Sacred Tear|Golden Seed|collect|pickup|medallion|key/i.test(label);
    const perPlayer = expedition.mode === "standard" || individualPickup;
    const essentialItem = findMapItem(label, mapLayerForObjective(chapter, label));
    const guide = essentialGuide(chapter, label, index);
    tasks.push({
      id: `${chapter.id}-essential-${index}`,
      label,
      detail: isBoss
        ? `${guide} Target ${chapter.level} and ${chapter.upgrade}; stop upgrading once the party reaches the listed cap.`
        : guide,
      kind: isBoss ? "boss" : isQuest ? "quest" : "objective",
      perPlayer,
      scope: perPlayer ? "Each player" : expedition.mode === "seamless" ? "Shared session" : expedition.mode === "solo" ? "Solo" : "Party",
      item: essentialItem?.name,
    });
  });

  const flaskTasks = (FLASK_UPGRADE_STOPS[chapter.id] || []).map((item) => ({
    id: `${chapter.id}-flask-${cleanItemName(item).replace(/ /g, "-")}`,
    label: item,
    detail: `Flask upgrade for every player. ${inferGuide(item, chapter)}`,
    kind: "objective" as const,
    perPlayer: true,
    scope: "Each player",
    item,
  }));
  if (flaskTasks.length) {
    const finalBossName = chapter.boss?.split(",")[0];
    const finalBossIndex = finalBossName ? tasks.findIndex((task) => task.label.includes(finalBossName)) : -1;
    const insertAt = chapter.id === "first-steps" ? 3 : finalBossIndex >= 0 ? finalBossIndex : tasks.length;
    tasks.splice(insertAt, 0, ...flaskTasks);
  }

  if (chapter.phase && PHASE_START[chapter.phase] === chapter.id) {
    const pickupTasks: Task[] = [];
    expedition.players.forEach((player) => {
      const selected = builds.find((candidate) => candidate.id === player.buildId)!;
      const loadout = stageLoadout(selected, chapter.phase!);
      const playerPickupTasks: Task[] = [];
      const phaseIndex = PHASE_ORDER.indexOf(chapter.phase!);
      const earlierItems = new Set(PHASE_ORDER.slice(0, phaseIndex).flatMap((phase) => loadoutPickups(stageLoadout(selected, phase), chapter)).map((pickup) => cleanItemName(pickup.item)));
      const newPickups = loadoutPickups(loadout, chapter).filter((pickup) => !earlierItems.has(cleanItemName(pickup.item)) && !deferredPickupGate(pickup.item));
      newPickups.forEach((pickup, pickupIndex) => {
        const itemKey = cleanItemName(pickup.item).replace(/ /g, "-");
        const pickupTask: Task = {
          id: pickup.slot === "weapon" && pickupIndex === 0 ? `${chapter.id}-gear-${player.id}` : `${chapter.id}-loadout-item-${player.id}-${selected.id}-${itemKey}`,
          label: pickup.item,
          detail: `For ${player.name}'s ${selected.name} ${chapter.phase === "dlc" ? "DLC" : chapter.phase} setup. ${inferGuide(pickup.item, chapter)} Once collected, equip it in the ${pickup.slot} slot if this stage uses it.${loadout.borrowedFrom ? ` This temporary stage comes from the sourced ${loadout.borrowedFrom.buildName} guide.` : ""}`,
          kind: "gear",
          playerId: player.id,
          perPlayer: false,
          scope: player.name,
          item: pickup.item,
          slot: pickup.slot,
          optional: true,
        };
        pickupTasks.push(pickupTask);
        playerPickupTasks.push(pickupTask);
      });
      const unlockedItems = playerPickupTasks.filter((task) => !expedition.completed[`${task.id}:skipped`] && Boolean(expedition.completed[task.id])).map((task) => task.label);
      tasks.push({
        id: `${chapter.id}-loadout-${player.id}`,
        label: `${selected.name}: equip unlocked items`,
        detail: unlockedItems.length
          ? `For ${player.name}. Equip only what has been collected: ${unlockedItems.join(", ")}. Keep the current weapon, armour, talismans, skills and Physick in every other slot until their own route cards are completed.`
          : `For ${player.name}. No new build item has been collected yet. Keep the current equipment unchanged; this card will update as the individual item steps above are completed.`,
        kind: "gear",
        playerId: player.id,
        perPlayer: false,
        scope: player.name,
        optional: true,
      });
    });
    tasks.splice(tasks.length - expedition.players.length, 0, ...orderPickupTasks(pickupTasks, chapter));
  }

  const deferredTasks: Task[] = [];
  expedition.players.forEach((player) => {
    const selected = builds.find((candidate) => candidate.id === player.buildId)!;
    const seen = new Set<string>();
    PHASE_ORDER.forEach((phase) => {
      const loadout = stageLoadout(selected, phase);
      loadoutPickups(loadout, chapter).forEach((pickup) => {
        const itemKey = cleanItemName(pickup.item);
        if (seen.has(itemKey)) return;
        seen.add(itemKey);
        const pickupGate = deferredPickupGate(pickup.item);
        if (pickupGate?.chapterId !== chapter.id) return;
        deferredTasks.push({
          id: `${chapter.id}-loadout-item-${player.id}-${selected.id}-${itemKey.replace(/ /g, "-")}`,
          label: pickup.item,
          detail: `For ${player.name}'s ${selected.name} setup. ${pickupGate.requires ? `Prerequisite: ${pickupGate.requires}. ` : ""}${inferGuide(pickup.item, chapter)} Once collected, equip it in the ${pickup.slot} slot when the build stage calls for it. If this optional fight is not comfortable yet, skip the card and return before leaving this chapter.`,
          kind: "gear",
          playerId: player.id,
          perPlayer: false,
          scope: player.name,
          item: pickup.item,
          slot: pickup.slot,
          afterObjective: pickupGate.after,
          optional: true,
        });
      });
    });
  });
  if (deferredTasks.length) {
    insertGatedPickupTasks(tasks, deferredTasks, chapter);
  }

  const planningTasks = progressionTasksForChapter(chapter, expedition, support);
  if (planningTasks.length) {
    const lastBossIndex = tasks.reduce((found, task, index) => task.kind === "boss" ? index : found, -1);
    tasks.splice(lastBossIndex >= 0 ? lastBossIndex : tasks.length, 0, ...planningTasks);
  }

  if (chapter.boss && !chapter.essentials.some((entry) => entry.includes(chapter.boss!.split(",")[0]))) {
    tasks.push({
      id: `${chapter.id}-boss`,
      label: `Defeat ${chapter.boss}`,
      detail: `This is ${chapter.remembrance ? "a Remembrance encounter" : "a major encounter"}. Enter around ${chapter.level} with weapons no higher than ${chapter.upgrade}.`,
      kind: "boss",
      perPlayer: expedition.mode === "standard",
      scope: expedition.mode === "standard" ? "Repeat in each world" : expedition.mode === "solo" ? "Solo boss reward" : "Shared boss reward",
    });
  }
  return tasks;
}

const taskKeys = (task: Task, expedition: Expedition) =>
  task.perPlayer ? expedition.players.map((player) => `${task.id}:${player.id}`) : [task.id];

const taskDone = (task: Task, expedition: Expedition) =>
  Boolean(expedition.completed[`${task.id}:skipped`]) || taskKeys(task, expedition).every((key) => expedition.completed[key]);

function nextIncompleteTask(expedition: Expedition, tasksByChapter?: Record<string, Task[]>) {
  for (const chapter of chapters) {
    const task = (tasksByChapter?.[chapter.id] ?? tasksForChapter(chapter, expedition)).find((candidate) => !taskDone(candidate, expedition));
    if (task) return { chapter, task };
  }
  return null;
}

function FullBuildDetails({ build, onClose, assignLabel, onAssign }: { build: Build; onClose: () => void; assignLabel?: string; onAssign?: () => void }) {
  const classification = buildClassification(build);
  const plannedClass = plannerStartingClass(build);
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="loadout-dialog" role="dialog" aria-modal="true" aria-label={`${build.name} full build`}>
        <button className="drawer-close" onClick={onClose} aria-label="Close build detail">×</button>
        <div className="loadout-title">
          <div><p className="eyebrow">Build {builds.indexOf(build) + 1} of {builds.length}</p><h2>{build.name}</h2><p>{build.playstyle}</p></div>
          <div className="drawer-meta"><span>{build.collection}</span><span>{classification.attributes}</span><span>{classification.range}</span><span>{build.mechanic}</span><span>Start: {plannedClass}{build.startingClass === "Not specified" ? " · calculated" : ""}</span><span>{build.complexity}</span></div>
        </div>
        <a className="build-source" href={build.source.url} target="_blank" rel="noreferrer">Source: {build.source.label} ↗</a>
        {build.quest && <div className="quest-callout"><strong>Quest dependency</strong><span>{build.quest}</span></div>}
        <div className="loadout-stages">
          {(["early", "mid", "late", "dlc"] as PhaseKey[]).map((phase) => {
            const loadout = stageLoadout(build, phase);
            const checkpointLevel: Record<PhaseKey, number> = { early: 40, mid: 90, late: 150, dlc: 170 };
            const weapon = findWeaponUpgradeRecord(loadout.weapon);
            const statPlan = planBuildStatTarget({ ...build, startingClass: plannedClass }, checkpointLevel[phase], weaponRequirements(loadout.weapon));
            const parsedArmour = splitArmourSpecification(loadout.armour);
            const armourPieces = parsedArmour.length ? parsedArmour : splitArmourSpecification(`${plannedClass} starting armour`);
            const armourWeight = armourPieces.reduce((sum, piece) => sum + piece.weight, 0);
            const mediumLimit = maxWeightForTier(maxEquipLoad(statPlan.attributes.endurance), /light load|below 30%|blue dancer/i.test(loadout.armour) ? "light" : "medium");
            return (
              <article key={phase}>
                <header><span>{phase === "dlc" ? "DLC" : phase}</span><small>{loadout.level}</small></header>
                <div className="loadout-weapon"><small>Main weapon</small><strong>{loadout.weapon}</strong><TimingNote value={loadout.weapon} phase={phase} /></div>
                <dl>
                  <div><dt>Off hand</dt><dd>{loadout.offhand}</dd></div>
                  <div><dt>Skill plan</dt><dd>{loadout.skill}</dd></div>
                  <div><dt>Talismans</dt><dd><small>{loadout.talismanSlots}</small>{loadout.talismans.map((talisman) => <span key={talisman}>{talisman}<TimingNote value={talisman} phase={phase} /></span>)}</dd></div>
                  <div><dt>Armour</dt><dd>{loadout.armour}</dd></div>
                  <div><dt>Weight check</dt><dd>{armourPieces.length ? `${armourWeight.toFixed(1)} armour weight; ${weapon?.weight != null ? `${weapon.weight} main-weapon weight; ` : ""}${mediumLimit.toFixed(1)} total-load limit at END ${statPlan.attributes.endurance}.` : `Use the Status screen limit of ${mediumLimit.toFixed(1)} total weight at END ${statPlan.attributes.endurance}; the source does not name individual pieces for this stage.`}</dd></div>
                  <div><dt>Spells</dt><dd>{loadout.spells.length ? loadout.spells.map((spell) => <span key={spell}>{spell}</span>) : build.publishedLoadout ? "Not specified by source" : "No required spells; use consumables for ranged utility."}</dd></div>
                  <div><dt>Physick</dt><dd>{loadout.flask}</dd></div>
                  <div><dt>Stats</dt><dd>{(Object.keys(STAT_LABELS) as StatKey[]).map((stat) => `${STAT_LABELS[stat]} ${statPlan.attributes[stat]}`).join(" · ")}<small>{loadout.stats}</small></dd></div>
                </dl>
                {loadout.borrowedFrom && <a className="borrowed-source" href={loadout.borrowedFrom.url} target="_blank" rel="noreferrer">Temporary stage from {loadout.borrowedFrom.buildName} ↗</a>}
                {loadout.weaponChoice && <div className="weapon-choice-source"><strong>Why this named option</strong><p>{loadout.weaponChoice.rationale}</p><div>{loadout.weaponChoice.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></div>}
              </article>
            );
          })}
        </div>
        <p className="loadout-note">{build.publishedStages ? "Every stage is taken from the linked progression guide. A named weapon remains in use until the guide’s actual replacement is obtainable." : build.publishedLoadout ? "The build's published stage is reproduced from its linked source. Earlier gaps use the closest matching Fextralife stage and show that source on the stage; once the build's own weapon is available it is carried forward." : "Talismans are listed in slot order. Swap the defensive slot for the boss-specific elemental drake talisman when needed."}</p>
        {onAssign && <button type="button" className="assign-build-button" onClick={onAssign}>{assignLabel || "Choose this build"}</button>}
      </section>
    </div>
  );
}

function Setup({ onCreate, imported }: { onCreate: (expedition: Expedition) => void; imported: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [mode, setMode] = useState<Mode>("standard");
  const [count, setCount] = useState(2);
  const [name, setName] = useState("Our path to the Elden Ring");
  const [lossRate, setLossRate] = useState(20);
  const [levelOffset, setLevelOffset] = useState(0);
  const [players, setPlayers] = useState<Player[]>(makePlayers(2));
  const [activePlayer, setActivePlayer] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All builds");
  const [collection, setCollection] = useState("All sources");
  const [mechanic, setMechanic] = useState("All focuses");
  const [fextraCategory, setFextraCategory] = useState("All Fextralife groups");
  const [sort, setSort] = useState("Catalogue order");
  const [detail, setDetail] = useState<Build | null>(null);

  const visibleBuilds = sortBuilds(builds.filter((candidate) => {
    return buildSearchText(candidate).includes(query.toLowerCase()) && matchesBuildFilter(candidate, filter) && matchesCollection(candidate, collection) && (mechanic === "All focuses" || candidate.mechanic === mechanic) && (fextraCategory === "All Fextralife groups" || candidate.guideCategories?.includes(fextraCategory));
  }), sort);

  const changeCount = (value: number) => {
    setCount(value);
    if (activePlayer >= value) setActivePlayer(0);
    setPlayers((current) => {
      if (value > current.length) return [...current, ...makePlayers(value).slice(current.length)];
      return current.slice(0, value);
    });
  };

  const updatePlayer = (index: number, patch: Partial<Player>) => {
    setPlayers((current) => current.map((player, playerIndex) => (playerIndex === index ? { ...player, ...patch } : player)));
  };

  const chooseBuild = (candidate: Build) => {
    updatePlayer(activePlayer, { buildId: candidate.id });
    setDetail(null);
  };

  return (
    <main className="setup-page">
      <header className="setup-header">
        <div><strong>Tarnished Together</strong><span>Elden Ring co-op route planner</span></div>
        <label className="plain-import">Import saved run<input type="file" accept="application/json" onChange={imported} /></label>
      </header>

      <section className="run-settings" aria-label="Run settings">
        <div className="settings-title"><span>1</span><div><h1>Set up the party</h1><p>Choose the multiplayer rules and name each player.</p></div></div>
        <div className="settings-grid">
          <label><span>Run name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <div><span className="settings-label">Mode</span><div className="plain-segmented"><button type="button" className={mode === "solo" ? "active" : ""} onClick={() => { setMode("solo"); changeCount(1); }}>Solo</button><button type="button" className={mode === "standard" ? "active" : ""} onClick={() => { setMode("standard"); if (count < 2) changeCount(2); }}>Standard co-op</button><button type="button" className={mode === "seamless" ? "active" : ""} onClick={() => { setMode("seamless"); if (count < 2) changeCount(2); }}>Seamless Co-op</button></div></div>
          <div><span className="settings-label">Players</span><div className="plain-segmented count-buttons">{[1, 2, 3, 4, 5, 6].map((size) => <button type="button" className={count === size ? "active" : ""} disabled={mode === "solo" && size !== 1} key={size} onClick={() => { changeCount(size); if (size === 1) setMode("solo"); else if (mode === "solo") setMode("standard"); }}>{size}</button>)}</div></div>
          <label><span>Rune loss allowance</span><select value={lossRate} onChange={(event) => setLossRate(Number(event.target.value))}><option value={10}>10% · confident</option><option value={20}>20% · normal</option><option value={30}>30% · cautious</option></select><small className="setting-help">The level plan subtracts this share of field runes for deaths, missed enemies and consumables kept in inventory.</small></label>
          <label><span>Level pace</span><select value={levelOffset} onChange={(event) => setLevelOffset(Number(event.target.value))}><option value={0}>Match guide levels</option><option value={5}>5 levels below guide</option><option value={10}>10 levels below guide</option><option value={15}>15 levels below guide</option><option value={20}>20 levels below guide</option></select><small className="setting-help">Rune-level recommendations and weapon-upgrade ceilings are lowered together. The planner still funds every recommendation.</small></label>
        </div>
        <div className="player-setup-list">
          {players.map((player, index) => {
            const selected = builds.find((candidate) => candidate.id === player.buildId)!;
            return <div className={activePlayer === index ? "active" : ""} key={player.id} style={{ "--player": player.color } as React.CSSProperties}><button type="button" onClick={() => setActivePlayer(index)}><i>{index + 1}</i><span><strong>{player.name}</strong><small>{selected.name}</small></span><b>{activePlayer === index ? "Choosing now" : "Edit build"}</b></button><input aria-label={`Player ${index + 1} name`} value={player.name} onChange={(event) => updatePlayer(index, { name: event.target.value })} /></div>;
          })}
        </div>
      </section>

      <section className="build-picker">
        <div className="picker-heading"><div className="settings-title"><span>2</span><div><h2>Choose a build for {players[activePlayer].name}</h2><p>Open any build to see the complete equipment plan before assigning it.</p></div></div><div className="selected-build-summary"><small>Currently selected</small><strong>{builds.find((candidate) => candidate.id === players[activePlayer].buildId)?.name}</strong></div></div>
        <div className="picker-tools extended"><label><span>Search builds</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Weapon, damage type or playstyle" /></label><label><span>Source category</span><select value={collection} onChange={(event) => setCollection(event.target.value)}>{COLLECTION_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Fextralife group</span><select value={fextraCategory} onChange={(event) => setFextraCategory(event.target.value)}>{FEXTRA_CATEGORY_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Build type</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>{ATTRIBUTE_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Combat focus</span><select value={mechanic} onChange={(event) => setMechanic(event.target.value)}>{MECHANIC_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{SORT_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label><p>{visibleBuilds.length} of {builds.length} builds</p></div>
        <div className="setup-build-grid">
          {visibleBuilds.map((candidate) => {
            const selected = candidate.id === players[activePlayer].buildId;
            const classification = buildClassification(candidate);
            return <article className={selected ? "selected" : ""} key={candidate.id}>
              <header><div><span>{String(builds.indexOf(candidate) + 1).padStart(2, "0")}</span><small>{candidate.complexity}</small></div><h3>{candidate.name}</h3><p>{classification.attributes} · {classification.range}</p><b className="collection-pill">{candidate.collection}</b>{candidate.guideCategories?.length ? <p className="guide-groups">{candidate.guideCategories.join(" · ")}</p> : null}</header>
              <p className="setup-playstyle">{candidate.playstyle}</p>
              <div className="build-facts"><span><small>Starting class</small>{plannerStartingClass(candidate)}{candidate.startingClass === "Not specified" ? " (calculated)" : ""}</span><span><small>Combat focus</small>{candidate.mechanic}</span></div>
              <div className="weapon-timeline">{(["early", "mid", "late", "dlc"] as PhaseKey[]).map((phase) => { const stage = stageLoadout(candidate, phase); return <div key={phase}><small>{phase}{stage.borrowedFrom ? " · sourced bridge" : ""}</small><span>{stage.weapon}</span></div>; })}</div>
              <footer><button type="button" onClick={() => setDetail(candidate)}>Full loadout</button><button type="button" className={selected ? "assigned" : ""} onClick={() => chooseBuild(candidate)}>{selected ? "Assigned" : `Assign to ${players[activePlayer].name}`}</button></footer>
            </article>;
          })}
        </div>
      </section>

      <div className="setup-actions"><div><strong>{players.length} {players.length === 1 ? "player" : "players"} ready</strong><span>{mode === "solo" ? "Solo route with no co-op rune reduction." : mode === "standard" ? "Standard co-op; world steps will be repeated per player." : "Seamless Co-op; host and individual pickups are tracked separately."} Rune plans keep a {lossRate}% loss allowance and run {levelOffset ? `${levelOffset} levels below guide pace` : "at guide pace"}.</span></div><button type="button" onClick={() => onCreate({ schema: 1, saveId: newSaveId(), name: name.trim() || "Untitled expedition", mode, players, hostId: players[0].id, completed: {}, createdAt: new Date().toISOString(), lossRate, levelOffset, checkpointRunes: {}, checkpointLevels: {}, checkpointStats: {}, checkpointWeaponLevels: {}, runeBossSelections: {} })}>Create route</button></div>
      <footer className="setup-footer">Unofficial fan project. Full spoilers. Data baseline: regulation 1.16.1.</footer>
      {detail && <FullBuildDetails build={detail} onClose={() => setDetail(null)} assignLabel={`Assign to ${players[activePlayer].name}`} onAssign={() => chooseBuild(detail)} />}
    </main>
  );
}

type MapLayer = MapItem["layer"];

const MAP_TILE_ROOTS: Record<MapLayer, string> = {
  surface: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/map-50be4728-3907-4f33-8857-7f063e0d24eb/map-tiles.4",
  underground: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/map-c5431314-6159-4599-9668-0ccf4e1f8e9a/map-tiles.4",
  ashen: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/map-96747699-d8a3-44b4-b2d6-cf6b45c579c6/map-tiles.1",
  shadow: "https://eldenring.wiki.fextralife.com/file/Elden-Ring/map-9d02bccc-081b-4a1d-b26e-a363f366fb40/map-tiles.3",
};
const MAP_TILE_LEVELS: Record<MapLayer, number> = {
  surface: 7,
  underground: 7,
  ashen: 6,
  shadow: 6,
};

function mapLayerForChapter(chapter: Chapter): MapLayer {
  if (chapter.act === "Shadow of the Erdtree") return "shadow";
  if (["nokron", "ainsel", "deeproot", "mohgwyn"].includes(chapter.id)) return "underground";
  if (chapter.id === "ashen") return "ashen";
  return "surface";
}

function MapPanel({ chapter, expedition, chapterTasks, tasksByChapter, onSelect }: { chapter: Chapter; expedition: Expedition; chapterTasks: Task[]; tasksByChapter: Record<string, Task[]>; onSelect: (id: string) => void }) {
  const chapterMapLayer = mapLayerForChapter(chapter);
  const currentTask = chapterTasks.find((task) => !taskDone(task, expedition));
  const objectiveLayer = currentTask ? mapLayerForObjective(chapter, currentTask.label) : chapterMapLayer;
  const mappedItem = currentTask?.item ? findMapItem(currentTask.item, objectiveLayer) : undefined;
  const mappedObjective = !mappedItem && currentTask ? findMapRoutePoint(objectiveMapQuery(currentTask.label), objectiveLayer) : undefined;
  const mappedPoint = mappedItem || mappedObjective || findMapRoutePoint(chapter.grace, objectiveLayer);
  const mapLayer = mappedPoint?.layer || objectiveLayer;
  const mapChapters = chapters.filter((candidate) => mapLayerForChapter(candidate) === mapLayer);
  const isDlc = mapLayer === "shadow";
  const fextraMap = isDlc ? "https://eldenring.wiki.fextralife.com/Shadow+of+the+Erdtree+Map" : "https://eldenring.wiki.fextralife.com/Interactive+Map";
  const mapGenie = isDlc ? "https://mapgenie.io/elden-ring/maps/the-shadow-realm" : "https://mapgenie.io/elden-ring/maps/the-lands-between";
  const mapTitle = mapLayer === "shadow" ? "Realm of Shadow" : mapLayer === "underground" ? "Underground" : mapLayer === "ashen" ? "Leyndell, Ashen Capital" : "The Lands Between";
  const tileLevel = MAP_TILE_LEVELS[mapLayer];
  const tileCount = 2 ** tileLevel;
  const zoom = mapLayer === "surface" || mapLayer === "underground" ? 18 : 10;
  const rawFocusX = mappedPoint?.layer === mapLayer ? mappedPoint.x : chapter.x;
  const rawFocusY = mappedPoint?.layer === mapLayer ? mappedPoint.y : chapter.y;
  const edge = 50 / zoom;
  const focusX = Math.max(edge, Math.min(100 - edge, rawFocusX));
  const focusY = Math.max(edge, Math.min(100 - edge, rawFocusY));
  const tileStartX = Math.max(0, Math.floor(((focusX - edge) / 100) * tileCount));
  const tileEndX = Math.min(tileCount - 1, Math.ceil(((focusX + edge) / 100) * tileCount));
  const tileStartY = Math.max(0, Math.floor(((focusY - edge) / 100) * tileCount));
  const tileEndY = Math.min(tileCount - 1, Math.ceil(((focusY + edge) / 100) * tileCount));
  const visibleTiles = [];
  for (let tileY = tileStartY; tileY <= tileEndY; tileY += 1) {
    for (let tileX = tileStartX; tileX <= tileEndX; tileX += 1) visibleTiles.push({ tileX, tileY });
  }
  const viewPosition = (x: number, y: number) => ({
    left: `${50 + (x - focusX) * zoom}%`,
    top: `${50 + (y - focusY) * zoom}%`,
  });
  return (
    <div className={`route-map map-layer-${mapLayer}`}>
      <div className="map-title"><span>{mapTitle}</span><small>Maximum-detail Fextralife tiles · active stage</small></div>
      <div className="map-art">
        <div className="map-tiles" aria-hidden="true" style={{ left: `${50 - focusX * zoom}%`, top: `${50 - focusY * zoom}%`, width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          {visibleTiles.map(({ tileX, tileY }) => <span className="map-tile" key={`tile-${tileX}-${tileY}`} style={{ left: `${(tileX / tileCount) * 100}%`, top: `${(tileY / tileCount) * 100}%`, width: `${100 / tileCount}%`, height: `${100 / tileCount}%`, backgroundImage: `url(${MAP_TILE_ROOTS[mapLayer]}/${tileLevel}/${tileX}/${tileY}.jpg)` }} />)}
        </div>
        {mapChapters.map((pin) => {
          const tasks = tasksByChapter[pin.id] ?? [];
          const done = tasks.every((task) => taskDone(task, expedition));
          const position = viewPosition(pin.x, pin.y);
          const visible = Number.parseFloat(position.left) >= -5 && Number.parseFloat(position.left) <= 105 && Number.parseFloat(position.top) >= -5 && Number.parseFloat(position.top) <= 105;
          if (!visible) return null;
          return (
            <button
              type="button"
              aria-label={`${pin.title}${done ? ", complete" : ""}`}
              title={pin.title}
              onClick={() => onSelect(pin.id)}
              className={`map-pin ${pin.id === chapter.id ? "current" : ""} ${done ? "done" : ""}`}
              style={position}
              key={pin.id}
            ><span>{chapters.indexOf(pin) + 1}</span></button>
          );
        })}
        {mappedPoint?.layer === mapLayer && <a className="map-item-pin" href={mappedPoint.url} target="_blank" rel="noreferrer" title={mappedPoint.name} style={viewPosition(mappedPoint.x, mappedPoint.y)}><i /> <span>{mappedPoint.name}</span></a>}
      </div>
      <div className="map-compass" aria-hidden="true">N<span>✦</span></div>
      <div className="map-current"><span>{mappedPoint?.layer === mapLayer ? "Current objective" : "Current region"}</span><strong>{mappedPoint?.layer === mapLayer ? mappedPoint.name : chapter.region}</strong><small>{currentTask ? currentTask.label : `from ${chapter.grace}`}</small></div>
      <div className="map-sources"><a href={fextraMap} target="_blank" rel="noreferrer">Open Fextralife map ↗</a><a href={mapGenie} target="_blank" rel="noreferrer">Open MapGenie ↗</a></div>
    </div>
  );
}

function BossMapThumbnail({ boss }: { boss: OptionalRuneBoss }) {
  const marker = findMapItem(boss.name, "surface") || findMapRoutePoint(`${boss.name} ${boss.location}`, "surface") || findMapRoutePoint(boss.location, "surface");
  const layer = marker?.layer || "surface";
  const level = MAP_TILE_LEVELS[layer];
  const count = 2 ** level;
  const tileX = marker ? Math.max(0, Math.min(count - 1, Math.floor(marker.x / 100 * count))) : 0;
  const tileY = marker ? Math.max(0, Math.min(count - 1, Math.floor(marker.y / 100 * count))) : 0;
  const imageUrl = `${MAP_TILE_ROOTS[layer]}/${level}/${tileX}/${tileY}.jpg`;
  return <div className="rune-boss-picture" style={{ backgroundImage: `url(${imageUrl})` }}><span>{marker ? boss.location : boss.name}</span></div>;
}

function RuneCheckpointPanel({
  chapter,
  expedition,
  support,
  setExpedition,
  viewerPlayerId,
  onViewerUpdate,
}: {
  chapter: Chapter;
  expedition: Expedition;
  support: Record<string, RuneSupportChapter>;
  setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>;
  viewerPlayerId?: string;
  onViewerUpdate?: (kind: "completed" | "runes" | "levels" | "stats" | "weapons", key: string, value: boolean | number | Partial<AttributeBlock>) => void;
}) {
  const economy = CHAPTER_ECONOMY_BY_ID[chapter.id];
  if (!economy) return null;
  const chapterIndex = chapters.indexOf(chapter);
  const currentSupport = support[chapter.id];
  const previousSupport = chapterIndex > 0 ? support[chapters[chapterIndex - 1].id] : undefined;
  const selectedBosses = currentSupport?.bosses ?? [];
  const alternatives = OPTIONAL_RUNE_BOSSES.filter((boss) => boss.chapterId === chapter.id);

  const setRunes = (playerId: string, value: number) => {
    const key = `${chapter.id}:${playerId}`;
    if (viewerPlayerId) {
      if (viewerPlayerId !== playerId) return;
      setExpedition((current) => current ? { ...current, checkpointRunes: { ...(current.checkpointRunes || {}), [key]: value } } : current);
      onViewerUpdate?.("runes", key, value);
      return;
    }
    setExpedition((current) => current ? { ...current, checkpointRunes: { ...(current.checkpointRunes || {}), [key]: value } } : current);
  };
  const setLevel = (playerId: string, value: number) => {
    const key = `${chapter.id}:${playerId}`;
    const level = Math.max(1, Math.min(713, Math.floor(value || 1)));
    if (viewerPlayerId) {
      if (viewerPlayerId !== playerId) return;
      setExpedition((current) => current ? { ...current, checkpointLevels: { ...(current.checkpointLevels || {}), [key]: level } } : current);
      onViewerUpdate?.("levels", key, level);
      return;
    }
    setExpedition((current) => current ? { ...current, checkpointLevels: { ...(current.checkpointLevels || {}), [key]: level } } : current);
  };
  const setStat = (playerId: string, stat: StatKey, value: number) => {
    const key = `${chapter.id}:${playerId}`;
    const statValue = Math.max(1, Math.min(99, Math.floor(value || 1)));
    const update = (current: Expedition) => ({ ...current, checkpointStats: { ...(current.checkpointStats || {}), [key]: { ...(current.checkpointStats?.[key] || {}), [stat]: statValue } } });
    if (viewerPlayerId) {
      if (viewerPlayerId !== playerId) return;
      const stats = { ...(expedition.checkpointStats?.[key] || {}), [stat]: statValue };
      setExpedition((current) => current ? update(current) : current);
      onViewerUpdate?.("stats", key, stats);
      return;
    }
    setExpedition((current) => current ? update(current) : current);
  };
  const setWeaponLevel = (playerId: string, value: number, maximum: number) => {
    const key = `${chapter.id}:${playerId}`;
    const weaponLevel = Math.max(0, Math.min(maximum, Math.floor(value || 0)));
    const update = (current: Expedition) => ({ ...current, checkpointWeaponLevels: { ...(current.checkpointWeaponLevels || {}), [key]: weaponLevel } });
    if (viewerPlayerId) {
      if (viewerPlayerId !== playerId) return;
      setExpedition((current) => current ? update(current) : current);
      onViewerUpdate?.("weapons", key, weaponLevel);
      return;
    }
    setExpedition((current) => current ? update(current) : current);
  };

  const setBosses = (ids: string[]) => setExpedition((current) => current ? {
    ...current,
    runeBossSelections: { ...(current.runeBossSelections || {}), [chapter.id]: ids },
  } : current);
  const replaceBoss = (index: number, id: string) => {
    const ids = selectedBosses.map((boss) => boss.id);
    ids[index] = id;
    setBosses(Array.from(new Set(ids)));
  };
  const resetBosses = () => setExpedition((current) => {
    if (!current) return current;
    const selections = { ...(current.runeBossSelections || {}) };
    delete selections[chapter.id];
    return { ...current, runeBossSelections: selections };
  });

  return <section className="rune-checkpoint">
    <header><div><p className="eyebrow">Rune checkpoint</p><h3>Enter what each player is holding</h3><p>Enter the rune counter before spending at this chapter. The result includes the level cost, the maximum stone purchase for the planned weapon ceiling and the protected merchant reserve. Boss targets follow the published location tiers, with a small increase for the harder fights. <a href="https://eldenring.wiki.gg/wiki/Recommended_Level_by_Location" target="_blank" rel="noreferrer">Level basis ↗</a></p></div>{!viewerPlayerId && expedition.runeBossSelections?.[chapter.id] && <button type="button" onClick={resetBosses}>Restore recommended bosses</button>}</header>
    <div className="rune-balance-grid">
      {expedition.players.map((player) => {
        const build = builds.find((candidate) => candidate.id === player.buildId)!;
        const loadout = stageLoadout(build, phaseForChapter(chapter));
        const pathResult = weaponUpgradePath(loadout.weapon);
        const path: UpgradePath | undefined = pathResult === "none" ? undefined : pathResult;
        const level = currentSupport?.levels[player.id] ?? guideTargets(economy, expedition.levelOffset ?? 0).runeLevel;
        const previousLevel = previousSupport?.levels[player.id] ?? planBuildStatTarget(build, level).origin.level;
        const upgrade = currentSupport?.upgrades[player.id] ?? 0;
        const previousChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : undefined;
        const previousLoadout = previousChapter ? stageLoadout(build, phaseForChapter(previousChapter)) : undefined;
        const previousPathResult = previousLoadout ? weaponUpgradePath(previousLoadout.weapon) : "none";
        const previousPath: UpgradePath | undefined = previousPathResult === "none" ? undefined : previousPathResult;
        const previousUpgrade = previousPath === path ? (previousSupport?.upgrades[player.id] ?? 0) : 0;
        const levelCost = runesBetweenLevels(Math.min(previousLevel, level), level);
        const key = `${chapter.id}:${player.id}`;
        const held = expedition.checkpointRunes?.[key];
        const currentLevel = expedition.checkpointLevels?.[key];
        const savedStats = expedition.checkpointStats?.[key] || {};
        const savedWeaponLevel = expedition.checkpointWeaponLevels?.[key];
        const maximumWeaponLevel = path === "somber" ? 10 : 25;
        const enteredWeaponLevel = path && savedWeaponLevel !== undefined ? Math.min(maximumWeaponLevel, savedWeaponLevel) : undefined;
        const upgradeFrom = enteredWeaponLevel ?? previousUpgrade;
        const materialCost = path ? planWeaponUpgrade(path, Math.min(upgradeFrom, upgrade), upgrade).materialPurchaseRunes : 0;
        const required = levelCost + materialCost + economy.purchaseReserve;
        const actualStats = completeCheckpointStats(savedStats);
        const levelingFrom = Math.min(level, Math.max(planBuildStatTarget(build, level).origin.level, currentLevel ?? previousLevel));
        const exactLevelPlan = planBuildStatTarget(build, level, weaponRequirements(loadout.weapon));
        const exactStartPlan = planBuildStatTarget(build, levelingFrom, weaponRequirements(loadout.weapon));
        const recommendedNow = planBuildStatTarget(build, currentLevel ?? previousLevel, weaponRequirements(loadout.weapon));
        const originLevel = recommendedNow.origin.level;
        const currentLevelForWeapon = currentLevel ?? previousLevel;
        const previousSpan = Math.max(1, previousLevel - originLevel);
        const chapterSpan = Math.max(1, level - previousLevel);
        const recommendedWeaponNow = !path ? 0 : currentLevelForWeapon <= previousLevel
          ? Math.max(0, Math.min(previousUpgrade, Math.floor(previousUpgrade * Math.max(0, currentLevelForWeapon - originLevel) / previousSpan)))
          : Math.max(previousUpgrade, Math.min(upgrade, Math.floor(previousUpgrade + (upgrade - previousUpgrade) * Math.min(1, (currentLevelForWeapon - previousLevel) / chapterSpan))));
        const exactChanges = statScheduleText(actualStats ?? exactStartPlan.attributes, exactLevelPlan.attributes, levelingFrom, exactLevelPlan.priorities, weaponRequirements(loadout.weapon), level - levelingFrom);
        const enteredPointTotal = actualStats ? (Object.keys(STAT_LABELS) as StatKey[]).reduce((sum, stat) => sum + actualStats[stat] - recommendedNow.origin.attributes[stat], 0) : undefined;
        const expectedPointTotal = currentLevel !== undefined ? currentLevel - recommendedNow.origin.level : undefined;
        const withBosses = (held ?? 0) + (currentSupport?.chapterBossRunes ?? 0);
        const gap = Math.max(0, required - withBosses);
        const editable = !viewerPlayerId || viewerPlayerId === player.id;
        return <article key={player.id} style={{ "--player": player.color } as React.CSSProperties}>
          <div><strong>{player.name}</strong><span>RL{previousLevel} → RL{level}</span></div>
          <div className="checkpoint-inputs"><label>Current RL<input type="number" min="1" max="713" step="1" disabled={!editable} value={currentLevel ?? ""} placeholder={`Expected ${previousLevel}`} onChange={(event) => setLevel(player.id, Number(event.target.value))} /></label><label>Runes held<input type="number" min="0" step="100" disabled={!editable} value={held ?? ""} placeholder="Enter current runes" onChange={(event) => setRunes(player.id, Math.max(0, Number(event.target.value) || 0))} /></label></div>
          <div className="checkpoint-stats"><div className="stat-grid-heading"><span>Stat</span><span>Current</span><span>At this RL</span><span>Chapter target</span></div>{(Object.keys(STAT_LABELS) as StatKey[]).map((stat) => { const actual = savedStats[stat]; const now = recommendedNow.attributes[stat]; const target = exactLevelPlan.attributes[stat]; return <label key={stat}><span>{STAT_LABELS[stat]}</span><input aria-label={`${player.name} ${STAT_LABELS[stat]}`} type="number" min="1" max="99" disabled={!editable} value={actual ?? ""} placeholder={String(now)} onChange={(event) => setStat(player.id, stat, Number(event.target.value))} /><b className={actual === undefined ? "" : actual < now ? "behind" : actual > now ? "ahead" : "matched"}>{now}</b><b>{target}</b></label>; })}</div>
          {path && <div className="weapon-checkpoint"><div><span>Active weapon</span><strong>{loadout.weapon}</strong><small>{path === "somber" ? "Somber" : "Regular"} reinforcement</small></div><label>Current +<input aria-label={`${player.name} current weapon level`} type="number" min="0" max={maximumWeaponLevel} disabled={!editable} value={enteredWeaponLevel ?? ""} placeholder={String(recommendedWeaponNow)} onChange={(event) => setWeaponLevel(player.id, Number(event.target.value), maximumWeaponLevel)} /></label><div><span>At this RL</span><b className={enteredWeaponLevel === undefined ? "" : enteredWeaponLevel < recommendedWeaponNow ? "behind" : enteredWeaponLevel > recommendedWeaponNow ? "ahead" : "matched"}>+{recommendedWeaponNow}</b></div><div><span>Chapter target</span><b>+{upgrade}</b></div></div>}
          {currentLevel === undefined ? <p className="stat-check waiting">Enter the current RL and all eight stats from the Status screen.</p> : !actualStats ? <p className="stat-check waiting">Enter all eight current stats to base the level plan on the real character.</p> : enteredPointTotal !== expectedPointTotal ? <p className="stat-check warning">The entered stats account for {enteredPointTotal} allocated levels, but RL{currentLevel} should account for {expectedPointTotal}. Recheck the character Status screen.</p> : <p className="stat-check ready">Current stats match the number of levels available at RL{currentLevel}.</p>}
          <p className="level-instruction">{currentLevel !== undefined && currentLevel >= level ? `No levels needed; RL${currentLevel} already meets the RL${level} target.` : `Next: buy ${Math.max(0, level - levelingFrom)} levels to reach RL${level}. ${exactChanges}.`}</p>
          {path && <p className="weapon-instruction">{upgradeFrom >= upgrade ? `${loadout.weapon} is already at or above this chapter's +${upgrade} ceiling. Do not reinforce it further yet.` : `Reinforce ${loadout.weapon} from +${upgradeFrom} to +${upgrade}. The stone budget below now starts from the entered +${upgradeFrom} level.`}</p>}
          <dl><div><dt>Levels</dt><dd>{formatRunes(levelCost)}</dd></div><div><dt>Stone ceiling</dt><dd>{formatRunes(materialCost)}</dd></div><div><dt>Reserve</dt><dd>{formatRunes(economy.purchaseReserve)}</dd></div><div><dt>Boss top-up</dt><dd>+{formatRunes(currentSupport?.chapterBossRunes ?? 0)}</dd></div></dl>
          {held === undefined ? <p className="rune-status waiting">Enter the current counter for an exact check.</p> : gap > 0 ? <p className="rune-status short">Need {formatRunes(gap)} more. Choose a higher-value replacement below, or skip optional fights and accept the planner’s lower funded target.</p> : <p className="rune-status ready">Funded with {formatRunes(withBosses - required)} left after the reserve.</p>}
        </article>;
      })}
    </div>
    {selectedBosses.length > 0 && <div className="rune-boss-manager"><div className="objectives-heading"><div><p className="eyebrow">Optional rune fights</p><h3>Recommended top-up bosses</h3></div><span>{selectedBosses.length} selected</span></div><div className="rune-boss-grid">{selectedBosses.map((boss, index) => <article key={`${boss.id}-${index}`}><BossMapThumbnail boss={boss} /><div className="rune-boss-copy"><strong>{boss.name}</strong><span>{boss.location}</span><dl><div><dt>Recommended</dt><dd>RL {recommendedOptionalBossLevel(boss)}+</dd></div><div><dt>Solo reward</dt><dd>{formatRunes(boss.runes)}</dd></div></dl>{!viewerPlayerId && <div className="rune-boss-actions"><label>Replace with<select value={boss.id} onChange={(event) => replaceBoss(index, event.target.value)}>{alternatives.filter((candidate) => candidate.id === boss.id || !selectedBosses.some((selected) => selected.id === candidate.id)).map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name} · RL {recommendedOptionalBossLevel(candidate)} · {formatRunes(candidate.runes)}</option>)}</select></label><button type="button" onClick={() => setBosses(selectedBosses.filter((_, bossIndex) => bossIndex !== index).map((candidate) => candidate.id))}>Skip this boss</button></div>}</div></article>)}</div></div>}
    {!selectedBosses.length && alternatives.length > 0 && !viewerPlayerId && <div className="empty-rune-bosses"><p>No optional rune boss is selected. The planner has lowered the funded level to match that choice.</p><button type="button" onClick={resetBosses}>Use recommended bosses</button></div>}
  </section>;
}

function RouteView({ expedition, setExpedition, tasksByChapter, runeSupport, activeId, setActiveId, readOnly = false, viewerPlayerId, onViewerUpdate }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; tasksByChapter: Record<string, Task[]>; runeSupport: Record<string, RuneSupportChapter>; activeId: string; setActiveId: (id: string) => void; readOnly?: boolean; viewerPlayerId?: string; onViewerUpdate?: (kind: "completed" | "runes" | "levels" | "stats" | "weapons", key: string, value: boolean | number | Partial<AttributeBlock>) => void }) {
  const chapter = chapters.find((candidate) => candidate.id === activeId) || chapters[0];
  const tasks = tasksByChapter[chapter.id] ?? [];
  const completedTasks = tasks.filter((task) => taskDone(task, expedition)).length;
  const chapterIndex = chapters.indexOf(chapter);
  const nextStep = nextIncompleteTask(expedition, tasksByChapter);

  const toggle = (key: string) => {
    if (readOnly) {
      if (!viewerPlayerId || (!key.endsWith(`:${viewerPlayerId}`) && !key.includes(viewerPlayerId))) return;
      const value = !expedition.completed[key];
      setExpedition((current) => current ? { ...current, completed: { ...current.completed, [key]: value } } : current);
      onViewerUpdate?.("completed", key, value);
      return;
    }
    setExpedition((current) => current ? { ...current, completed: { ...current.completed, [key]: !current.completed[key] } } : current);
  };

  const completeAndContinue = () => {
    if (!nextStep) return;
    if (readOnly) {
      if (!viewerPlayerId) return;
      const key = nextStep.task.perPlayer ? `${nextStep.task.id}:${viewerPlayerId}` : nextStep.task.playerId === viewerPlayerId ? nextStep.task.id : "";
      if (key) toggle(key);
      return;
    }
    const completed = { ...expedition.completed };
    taskKeys(nextStep.task, expedition).forEach((key) => { completed[key] = true; });
    const updated = { ...expedition, completed };
    setExpedition(updated);
    const following = nextIncompleteTask(updated, tasksByChapter);
    if (following) setActiveId(following.chapter.id);
  };

  const skipAndContinue = () => {
    if (!nextStep?.task.optional || readOnly) return;
    const completed = { ...expedition.completed, [`${nextStep.task.id}:skipped`]: true };
    const updated = { ...expedition, completed };
    setExpedition(updated);
    const following = nextIncompleteTask(updated, tasksByChapter);
    if (following) setActiveId(following.chapter.id);
  };

  const toggleSkipped = (task: Task) => {
    if (readOnly || !task.optional) return;
    setExpedition((current) => {
      if (!current) return current;
      const completed = { ...current.completed };
      const key = `${task.id}:skipped`;
      if (completed[key]) delete completed[key];
      else completed[key] = true;
      return { ...current, completed };
    });
  };

  const goNextIncomplete = () => {
    const next = chapters.find((candidate, index) => index > chapterIndex && !(tasksByChapter[candidate.id] ?? []).every((task) => taskDone(task, expedition)));
    if (next) setActiveId(next.id);
  };

  return (
    <div className="route-layout">
      <aside className="chapter-rail" aria-label="Route chapters">
        <div className="rail-heading"><span>Journey</span><strong>{chapters.length} chapters</strong></div>
        {(["Base game", "Shadow of the Erdtree"] as const).map((act) => (
          <div key={act} className="act-group">
            <p>{act}</p>
            {chapters.filter((candidate) => candidate.act === act).map((candidate) => {
              const candidateTasks = tasksByChapter[candidate.id] ?? [];
              const done = candidateTasks.every((task) => taskDone(task, expedition));
              const current = candidate.id === chapter.id;
              return <button type="button" onClick={() => setActiveId(candidate.id)} className={`${current ? "active" : ""} ${done ? "done" : ""}`} key={candidate.id}><i>{done ? "✓" : chapters.indexOf(candidate) + 1}</i><span><strong>{candidate.title}</strong><small>{candidate.region}</small></span></button>;
            })}
          </div>
        ))}
      </aside>

      <section className="route-main">
        <div className="chapter-hero">
          <div>
            <p className="eyebrow">Chapter {chapterIndex + 1} · {chapter.act}</p>
            <h2>{chapter.title}</h2>
            <p>{chapter.summary}</p>
          </div>
          <div className="readiness-seal"><span>{completedTasks}/{tasks.length}</span><small>objectives</small></div>
        </div>

        {nextStep ? (
          <section className="next-step-panel" aria-label="Current objective">
            <div className="next-step-number"><span>Next</span><strong>{String(chapters.indexOf(nextStep.chapter) + 1).padStart(2, "0")}</strong></div>
            <div className="next-step-copy">
              <p>{nextStep.chapter.region} · from {nextStep.chapter.grace}</p>
              <h3>{nextStep.task.label}</h3>
              <span>{nextStep.task.detail}</span>
              <small>Target {nextStep.chapter.level} · {nextStep.chapter.upgrade}{nextStep.task.scope ? ` · ${nextStep.task.scope}` : ""}</small>
            </div>
            <div className="next-step-actions">
              {activeId !== nextStep.chapter.id && <button type="button" onClick={() => setActiveId(nextStep.chapter.id)}>Show area</button>}
              {(!readOnly || (viewerPlayerId && (nextStep.task.perPlayer || nextStep.task.playerId === viewerPlayerId))) && <button type="button" className="primary" onClick={completeAndContinue}>{readOnly ? "Mark my step complete" : "Complete and continue"}</button>}
              {!readOnly && nextStep.task.optional && <button type="button" onClick={skipAndContinue}>Skip this item</button>}
              {readOnly && <span>{viewerPlayerId ? `Following as ${expedition.players.find((player) => player.id === viewerPlayerId)?.name}` : "Updates from the host"}</span>}
            </div>
          </section>
        ) : <section className="next-step-panel route-finished"><div><p>Route complete</p><h3>All objectives have been checked off.</h3></div></section>}

        <div className="balance-bar">
          <div><span>Rune level</span><strong>{chapter.level}</strong></div>
          <div><span>Weapon ceiling</span><strong>{chapter.upgrade}</strong></div>
          {chapter.blessing && <div><span>Blessing target</span><strong>{chapter.blessing}</strong></div>}
          <div><span>Begin from</span><strong>{chapter.grace}</strong></div>
        </div>

        {chapter.quest && <div className="quest-callout"><strong>Quest safety</strong><span>{chapter.quest}. Some rewards are mutually exclusive; follow the named choice needed by the selected build. In standard co-op, the alternate reward can be taken in another player&apos;s world.</span></div>}

        <MapPanel chapter={chapter} expedition={expedition} chapterTasks={tasks} tasksByChapter={tasksByChapter} onSelect={setActiveId} />

        <RuneCheckpointPanel chapter={chapter} expedition={expedition} support={runeSupport} setExpedition={setExpedition} viewerPlayerId={viewerPlayerId} onViewerUpdate={onViewerUpdate} />

        <div className="objectives-heading"><div><p className="eyebrow">Ordered stops</p><h3>Do these before moving on</h3></div><span>{Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% complete</span></div>
        <div className="task-list">
          {tasks.map((task, index) => {
            const owner = task.playerId ? expedition.players.find((player) => player.id === task.playerId) : undefined;
            const done = taskDone(task, expedition);
            const skipped = Boolean(expedition.completed[`${task.id}:skipped`]);
            const mapItem = task.item ? findMapItem(task.item, mapLayerForObjective(chapter, task.label)) : undefined;
            return (
              <article className={`task-card ${done ? "complete" : ""} ${skipped ? "skipped" : ""}`} key={task.id} style={owner ? { "--player": owner.color } as React.CSSProperties : undefined}>
                <div className="task-index">{skipped ? "—" : done ? "✓" : String(index + 1).padStart(2, "0")}</div>
                <div className="task-body">
                  <div className="task-meta"><span className={`kind ${task.kind}`}>{task.kind}</span><span className="scope">{task.scope}</span>{task.optional && <span className="scope">Optional</span>}{skipped && <span className="scope">Skipped</span>}</div>
                  <h4>{task.label}</h4>
                  <p>{task.detail}</p>
                  {task.item && <div className="task-links"><a href={wikiUrl(task.item)} target="_blank" rel="noreferrer">Item reference ↗</a>{mapItem && <a href={mapItem.url} target="_blank" rel="noreferrer">Exact Fextralife marker ↗</a>}<a href={chapter.act === "Shadow of the Erdtree" ? "https://mapgenie.io/elden-ring/maps/the-shadow-realm" : "https://mapgenie.io/elden-ring/maps/the-lands-between"} target="_blank" rel="noreferrer">Search on MapGenie ↗</a></div>}
                  {task.perPlayer ? (
                    <div className="player-checks">
                      {expedition.players.map((player) => {
                        const key = `${task.id}:${player.id}`;
                        return <button type="button" disabled={readOnly && viewerPlayerId !== player.id} key={key} className={expedition.completed[key] ? "checked" : ""} onClick={() => toggle(key)} style={{ "--player": player.color } as React.CSSProperties}><i>{expedition.completed[key] ? "✓" : ""}</i>{player.name}</button>;
                      })}
                    </div>
                  ) : (!readOnly || task.playerId === viewerPlayerId) ? (
                    <div className="task-actions">
                      {!skipped && <button type="button" className="complete-button" onClick={() => toggle(task.id)}><i>{done ? "✓" : ""}</i>{done ? "Completed" : "Mark complete"}</button>}
                      {task.optional && !readOnly && <button type="button" className="complete-button skip-button" onClick={() => toggleSkipped(task)}><i>{skipped ? "↶" : "—"}</i>{skipped ? "Restore item" : "Skip item"}</button>}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        <div className="chapter-nav">
          <button type="button" disabled={chapterIndex === 0} onClick={() => setActiveId(chapters[chapterIndex - 1].id)}>← Previous chapter</button>
          <button type="button" className="primary" disabled={chapterIndex === chapters.length - 1} onClick={goNextIncomplete}>Next unfinished chapter →</button>
        </div>
      </section>

      <aside className="company-panel">
        <p className="eyebrow">Your company</p>
        {expedition.players.map((player) => {
          const selected = builds.find((candidate) => candidate.id === player.buildId)!;
          const phase = chapter.act === "Shadow of the Erdtree" ? "dlc" : chapterIndex < 3 ? "early" : chapterIndex < 9 ? "mid" : "late";
          return <div className="company-member" key={player.id} style={{ "--player": player.color } as React.CSSProperties}><span>{player.name.slice(0, 1).toUpperCase()}</span><div><strong>{player.name}</strong><small>{selected.name}</small><p>{selected.phases[phase]}</p></div></div>;
        })}
        <div className="mode-note"><strong>{expedition.mode === "solo" ? "Solo route" : expedition.mode === "standard" ? "Standard co-op rules" : "Seamless rules"}</strong><p>{expedition.mode === "solo" ? "Boss rewards use the full solo payout and every pickup belongs to this character." : expedition.mode === "standard" ? "World-state steps are tracked for every player. Rotate hosts and tick each copy." : "The route follows host progression. Individual pickups remain assigned separately."}</p></div>
      </aside>
    </div>
  );
}

function CodexView({ expedition, catalogueOnly = false }: { expedition?: Expedition; catalogueOnly?: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All builds");
  const [collection, setCollection] = useState("All sources");
  const [mechanic, setMechanic] = useState("All focuses");
  const [fextraCategory, setFextraCategory] = useState("All Fextralife groups");
  const [sort, setSort] = useState("Catalogue order");
  const [selected, setSelected] = useState<Build | null>(null);
  const filtered = sortBuilds(builds.filter((candidate) => {
    return buildSearchText(candidate).includes(query.toLowerCase()) && matchesBuildFilter(candidate, filter) && matchesCollection(candidate, collection) && (mechanic === "All focuses" || candidate.mechanic === mechanic) && (fextraCategory === "All Fextralife groups" || candidate.guideCategories?.includes(fextraCategory));
  }), sort);

  return (
    <section className="codex-page">
      <div className="page-heading"><div><p className="eyebrow">{builds.length} sourced builds · source-linked stages</p><h2>{catalogueOnly ? "Build catalogue" : "Build codex"}</h2><p>{catalogueOnly ? "Compare every sourced build before the run controller assigns them. Search includes weapons, off-hands, skills, armour, talismans and spells." : "Each published build keeps its documented setup; earlier gaps use a clearly linked stage from the closest matching sourced build."}</p></div><div className="codex-count"><strong>{filtered.length}</strong><span>builds shown</span></div></div>
      <div className="codex-tools extended"><label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Frost, bow, faith…" /></label><label><span>Source category</span><select value={collection} onChange={(event) => setCollection(event.target.value)}>{COLLECTION_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Fextralife group</span><select value={fextraCategory} onChange={(event) => setFextraCategory(event.target.value)}>{FEXTRA_CATEGORY_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Build type</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>{ATTRIBUTE_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Combat focus</span><select value={mechanic} onChange={(event) => setMechanic(event.target.value)}>{MECHANIC_FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label><label><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}>{SORT_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label></div>
      <div className="build-grid">
        {filtered.map((candidate) => {
          const owners = expedition?.players.filter((player) => player.buildId === candidate.id) || [];
          const classification = buildClassification(candidate);
          return <article className="build-card" key={candidate.id} onClick={() => setSelected(candidate)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelected(candidate); }}>
            <div className="build-card-top"><span className="build-number">{String(builds.indexOf(candidate) + 1).padStart(2, "0")}</span><div className="difficulty"><i />{candidate.complexity}</div></div>
            <h3>{candidate.name}</h3><p className="stats">{classification.attributes} · {classification.range}</p><b className="collection-pill">{candidate.collection}</b>{candidate.guideCategories?.length ? <p className="guide-groups">{candidate.guideCategories.join(" · ")}</p> : null}<p>{candidate.playstyle}</p>
            <div className="build-facts"><span><small>Starting class</small>{plannerStartingClass(candidate)}{candidate.startingClass === "Not specified" ? " (calculated)" : ""}</span><span><small>Combat focus</small>{candidate.mechanic}</span></div>
            <div className="mini-phases"><span>{stageLoadout(candidate, "early").weapon}</span><i>→</i><span>{stageLoadout(candidate, "dlc").weapon}</span></div>
            <div className="tag-row">{candidate.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            {owners.length > 0 && <div className="owners">Chosen by {owners.map((owner) => owner.name).join(", ")}</div>}
            <button type="button">Full loadout <span>↗</span></button>
          </article>;
        })}
      </div>

      {selected && <FullBuildDetails build={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ReadOnlyBuildCatalogue({ lanAvailable }: { lanAvailable: boolean }) {
  return (
    <main className="app-shell catalogue-shell">
      <header className="catalogue-header">
        <div><strong>Tarnished Together</strong><span>Build catalogue</span></div>
        <div><b>Read-only</b>{lanAvailable && <button type="button" onClick={() => { window.location.href = "/?follow=1"; }}>Follow the live route</button>}</div>
      </header>
      <CodexView catalogueOnly />
    </main>
  );
}

function PartyView({ expedition, setExpedition, saveLibrary, activeSaveId, onSelectSave, onNewSave, onDuplicateSave, onDeleteSave, onExport, onImport }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; saveLibrary: SaveLibrary; activeSaveId: string | null; onSelectSave: (id: string) => void; onNewSave: () => void; onDuplicateSave: () => void; onDeleteSave: () => void; onExport: () => void; onImport: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const totalKeys = chapters.flatMap((chapter) => tasksForChapter(chapter, expedition)).flatMap((task) => taskKeys(task, expedition));
  const completed = totalKeys.filter((key) => expedition.completed[key]).length;
  const updatePlayer = (id: string, patch: Partial<Player>) => setExpedition((current) => current ? { ...current, players: current.players.map((player) => player.id === id ? { ...player, ...patch } : player) } : current);
  return <section className="party-page"><div className="page-heading"><div><p className="eyebrow">Run settings</p><h2>{expedition.name}</h2><p>{expedition.mode === "solo" ? "Solo playthrough" : expedition.mode === "standard" ? "Standard co-op across independent worlds" : "Seamless Co-op with host-led progression"}</p></div><div className="progress-medallion"><strong>{Math.round((completed / Math.max(totalKeys.length, 1)) * 100)}%</strong><span>route complete</span></div></div>
    <div className="party-cards">{expedition.players.map((player, index) => { const selected = builds.find((candidate) => candidate.id === player.buildId)!; const classification = buildClassification(selected); return <article key={player.id} style={{ "--player": player.color } as React.CSSProperties}><div className="portrait">{player.name.slice(0, 1).toUpperCase()}</div><div className="party-card-head"><input value={player.name} onChange={(event) => updatePlayer(player.id, { name: event.target.value })} /><span>Player {index + 1}</span></div><select value={player.buildId} onChange={(event) => updatePlayer(player.id, { buildId: event.target.value })}>{builds.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.name}</option>)}</select><p>{selected.playstyle}</p><div className="party-stats"><span><small>Attributes</small>{classification.attributes}</span><span><small>Range</small>{classification.range}</span></div><label className="host-radio"><input type="radio" name="host" checked={expedition.hostId === player.id} onChange={() => setExpedition((current) => current ? { ...current, hostId: player.id } : current)} /> {expedition.hostId === player.id ? "Current host" : "Make host"}</label></article>; })}</div>
    <div className="save-panel"><div><p className="eyebrow">Rune plan</p><h3>Level and loss allowances</h3><p>Expected field income is reduced before levels are assigned. If the conservative balance cannot pay for the selected pace, the route inserts easier optional bosses and only recommends a fully funded level. Golden Rune items remain emergency reserves.</p></div><div className="loss-setting"><label>Allow for <select value={expedition.lossRate ?? 20} onChange={(event) => setExpedition((current) => current ? { ...current, lossRate: Number(event.target.value) } : current)}><option value={10}>10% lost</option><option value={20}>20% lost</option><option value={30}>30% lost</option></select></label><label>Run <select value={expedition.levelOffset ?? 0} onChange={(event) => setExpedition((current) => current ? { ...current, levelOffset: Number(event.target.value), completed: {} } : current)}><option value={0}>at guide level</option><option value={5}>5 levels below</option><option value={10}>10 levels below</option><option value={15}>15 levels below</option><option value={20}>20 levels below</option></select></label></div></div>
    <div className="save-panel save-library-panel"><div><p className="eyebrow">Saved runs</p><h3>Switch without moving files</h3><p>Every run is stored in this browser. Export is still available for backups and moving a run to another device.</p><div className="save-library-list">{Object.values(saveLibrary.saves).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((save) => <button type="button" className={save.saveId === activeSaveId ? "active" : ""} key={save.saveId} onClick={() => onSelectSave(save.saveId!)}><strong>{save.name}</strong><span>{save.players.length === 1 ? "Solo" : `${save.players.length} players`} · {new Date(save.createdAt).toLocaleDateString()}</span></button>)}</div></div><div className="save-actions"><button type="button" className="primary" onClick={onNewSave}>New run</button><button type="button" onClick={onDuplicateSave}>Duplicate current</button><button type="button" onClick={onExport}>Export current</button><label>Import file<input type="file" accept="application/json" onChange={onImport} /></label><button type="button" className="danger" onClick={onDeleteSave}>Delete current</button></div></div>
    <div className="source-panel"><p className="eyebrow">Reference shelf</p><h3>Sources and version</h3><p>Content baseline: App/Regulation 1.16.1, checked 1 August 2026. External references open in a new tab.</p><div>{sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer">{label}<span>↗</span></a>)}</div></div>
  </section>;
}

function Home() {
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [saveLibrary, setSaveLibrary] = useState<SaveLibrary>({ activeId: null, saves: {} });
  const [activeSaveId, setActiveSaveId] = useState<string | null>(null);
  const [viewerPlayerId, setViewerPlayerId] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [lanMode, setLanMode] = useState<LanMode | null>(null);
  const [catalogueOnly, setCatalogueOnly] = useState(false);
  const [view, setView] = useState<View>("route");
  const [activeId, setActiveId] = useState(chapters[0].id);
  const [toast, setToast] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controlToken = useRef("");
  const lanRevision = useRef(-1);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const params = new URLSearchParams(window.location.search);
      const requestedCatalogue = params.get("catalog") === "1";
      if (!cancelled) setCatalogueOnly(requestedCatalogue);
      let localExpedition: Expedition | null = null;
      let localLibrary: SaveLibrary = { activeId: null, saves: {} };
      try {
        const libraryText = localStorage.getItem(SAVE_LIBRARY_KEY);
        if (libraryText) {
          const parsed = JSON.parse(libraryText) as SaveLibrary;
          if (parsed && typeof parsed.saves === "object") localLibrary = parsed;
        }
        const legacyText = localStorage.getItem(STORAGE_KEY);
        if (!Object.keys(localLibrary.saves).length && legacyText) {
          const legacy = JSON.parse(legacyText) as Expedition;
          const id = legacy.saveId || newSaveId();
          legacy.saveId = id;
          localLibrary = { activeId: id, saves: { [id]: legacy } };
        }
        localExpedition = localLibrary.activeId ? localLibrary.saves[localLibrary.activeId] || null : null;
        if (localExpedition && !localExpedition.saveId) {
          const id = newSaveId(); localExpedition = { ...localExpedition, saveId: id }; localLibrary = { activeId: id, saves: { ...localLibrary.saves, [id]: localExpedition } };
        }
      } catch { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(SAVE_LIBRARY_KEY); }
      if (!cancelled) { setSaveLibrary(localLibrary); setActiveSaveId(localLibrary.activeId); }

      try {
        const response = await fetch("/api/expedition", { cache: "no-store" });
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("application/json")) {
          const remote = await response.json();
          if (remote.enabled === true) {
            const token = params.get("control") || "";
            const mode: LanMode = token ? "controller" : "follower";
            const requestedViewer = params.get("follow") || localStorage.getItem("tarnished-together-viewer-player") || "";
            controlToken.current = token;
            lanRevision.current = Number(remote.revision || 0);
            if (!cancelled) {
              setLanMode(mode);
              const rawChoice = remote.expedition || (mode === "controller" ? localExpedition : null);
              const chosen = rawChoice && !rawChoice.saveId ? { ...rawChoice, saveId: newSaveId() } : rawChoice;
              setExpedition(chosen);
              if (mode === "follower" && chosen?.players.some((player: Player) => player.id === requestedViewer)) setViewerPlayerId(requestedViewer);
              setHydrated(true);
            }
            return;
          }
        }
      } catch { /* Hosted and development builds use device-local storage. */ }

      if (!cancelled) {
        setLanMode("none");
        setExpedition(localExpedition);
        setHydrated(true);
      }
    };
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated || lanMode === null || lanMode === "follower") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (expedition?.saveId) {
        setSaveLibrary((current) => ({ activeId: expedition.saveId!, saves: { ...current.saves, [expedition.saveId!]: expedition } }));
        setActiveSaveId(expedition.saveId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expedition));
      }
      if (lanMode === "controller") {
        void fetch("/api/expedition", {
          method: "PUT",
          headers: { "content-type": "application/json", "x-control-token": controlToken.current },
          body: JSON.stringify({ expedition }),
        });
      }
    }, 180);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [expedition, hydrated, lanMode]);

  useEffect(() => {
    if (!hydrated || lanMode === "follower") return;
    localStorage.setItem(SAVE_LIBRARY_KEY, JSON.stringify(saveLibrary));
  }, [saveLibrary, hydrated, lanMode]);

  useEffect(() => {
    if (!hydrated || lanMode !== "follower") return;
    let active = true;
    const poll = async () => {
      try {
        const response = await fetch("/api/expedition", { cache: "no-store" });
        if (!response.ok) return;
        const remote = await response.json();
        const revision = Number(remote.revision || 0);
        if (active && revision !== lanRevision.current) {
          lanRevision.current = revision;
          setExpedition(remote.expedition || null);
        }
      } catch { /* The next poll will retry. */ }
    };
    const interval = window.setInterval(() => { void poll(); }, 1200);
    return () => { active = false; window.clearInterval(interval); };
  }, [hydrated, lanMode]);

  const routeModel = useMemo(() => {
    if (!expedition) return { runeSupport: {} as Record<string, RuneSupportChapter>, tasksByChapter: {} as Record<string, Task[]>, progress: 0 };
    const runeSupport = runeSupportPlan(expedition);
    const tasksByChapter = Object.fromEntries(chapters.map((chapter) => [chapter.id, tasksForChapter(chapter, expedition, runeSupport)]));
    const keys = Object.values(tasksByChapter).flatMap((tasks) => tasks.flatMap((task) => taskKeys(task, expedition)));
    const progress = Math.round((keys.filter((key) => expedition.completed[key]).length / Math.max(keys.length, 1)) * 100);
    return { runeSupport, tasksByChapter, progress };
  }, [expedition]);
  const progress = routeModel.progress;

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const openSave = (id: string) => {
    const selected = saveLibrary.saves[id];
    if (!selected) return;
    setActiveSaveId(id); setSaveLibrary((current) => ({ ...current, activeId: id })); setExpedition(selected); setView("route"); setActiveId(chapters[0].id);
  };
  const newRun = () => { setExpedition(null); setActiveSaveId(null); setSaveLibrary((current) => ({ ...current, activeId: null })); setView("route"); setActiveId(chapters[0].id); };
  const duplicateRun = () => {
    if (!expedition) return;
    const saveId = newSaveId();
    const copy: Expedition = { ...expedition, saveId, name: `${expedition.name} copy`, completed: { ...expedition.completed }, checkpointRunes: { ...expedition.checkpointRunes }, checkpointLevels: { ...expedition.checkpointLevels }, checkpointStats: Object.fromEntries(Object.entries(expedition.checkpointStats || {}).map(([key, stats]) => [key, { ...stats }])), checkpointWeaponLevels: { ...expedition.checkpointWeaponLevels }, runeBossSelections: { ...expedition.runeBossSelections }, createdAt: new Date().toISOString() };
    setSaveLibrary((current) => ({ activeId: saveId, saves: { ...current.saves, [saveId]: copy } })); setActiveSaveId(saveId); setExpedition(copy); notify("Run duplicated");
  };
  const deleteRun = () => {
    if (!activeSaveId || !window.confirm(`Delete “${expedition?.name || "this run"}” from this browser?`)) return;
    const remaining = { ...saveLibrary.saves }; delete remaining[activeSaveId];
    const nextId = Object.keys(remaining)[0] || null;
    setSaveLibrary({ activeId: nextId, saves: remaining }); setActiveSaveId(nextId); setExpedition(nextId ? remaining[nextId] : null); setView("route"); setActiveId(chapters[0].id);
  };
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.schema !== 1 || !Array.isArray(parsed.players) || parsed.players.length < 1 || parsed.players.length > 6) throw new Error();
        parsed.saveId = newSaveId();
        setExpedition(parsed); setActiveSaveId(parsed.saveId); setSaveLibrary((current) => ({ activeId: parsed.saveId, saves: { ...current.saves, [parsed.saveId]: parsed } })); setView("route"); notify("Run imported as a new save");
      } catch { notify("That expedition file is not valid"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  };
  const handleExport = () => {
    if (!expedition) return;
    const blob = new Blob([JSON.stringify(expedition, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${expedition.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "expedition"}.json`; anchor.click(); URL.revokeObjectURL(url); notify("Expedition exported");
  };
  const viewerUpdate = (kind: "completed" | "runes" | "levels" | "stats" | "weapons", key: string, value: boolean | number | Partial<AttributeBlock>) => {
    if (!viewerPlayerId) return;
    void fetch("/api/player-progress", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ playerId: viewerPlayerId, kind, key, value }) }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Update failed");
      lanRevision.current = Number(body.revision || lanRevision.current); setExpedition(body.expedition);
    }).catch((error) => notify(error instanceof Error ? error.message : "Could not save progress"));
  };

  if (!hydrated) return <main className="loading-screen"><span>✦</span><p>Reading the guidance of grace…</p></main>;
  if (catalogueOnly) return <ReadOnlyBuildCatalogue lanAvailable={lanMode !== "none"} />;
  if (!expedition && lanMode === "follower") return <main className="follower-waiting"><strong>Tarnished Together</strong><h1>Waiting for the host</h1><p>The route will appear here after the host creates or restores an expedition.</p><button type="button" onClick={() => { window.location.href = "/?catalog=1"; }}>Browse all builds while you wait</button><span>Follower view · refreshes automatically</span></main>;
  if (!expedition) return <Setup onCreate={(created) => { setExpedition(created); notify("Route created"); }} imported={handleImport} />;

  const readOnly = lanMode === "follower";
  if (readOnly && !expedition.players.some((player) => player.id === viewerPlayerId)) return <main className="viewer-chooser"><div><p className="eyebrow">Join this run</p><h1>Which character are you playing?</h1><p>This only gives you control of that character’s item checklist and rune entries. You can still browse every chapter and step.</p>{expedition.players.map((player) => <button type="button" key={player.id} onClick={() => { setViewerPlayerId(player.id); localStorage.setItem("tarnished-together-viewer-player", player.id); const url = new URL(window.location.href); url.searchParams.set("follow", player.id); window.history.replaceState({}, "", url); }}>{player.name}<span>{builds.find((build) => build.id === player.buildId)?.name}</span></button>)}</div></main>;

  return (
    <main className={`app-shell ${readOnly ? "follower-mode" : ""}`}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => { setView("route"); setActiveId(chapters[0].id); }}><span>✦</span><strong>Tarnished <em>Together</em></strong></button>
        <nav aria-label="Primary"><button type="button" className={view === "route" ? "active" : ""} onClick={() => setView("route")}>Route</button>{readOnly && <button type="button" onClick={() => { window.location.href = "/?catalog=1"; }}>Build catalogue</button>}{!readOnly && <><button type="button" className={view === "codex" ? "active" : ""} onClick={() => setView("codex")}>Build codex</button><button type="button" className={view === "party" ? "active" : ""} onClick={() => setView("party")}>Company</button></>}</nav>
        <div className="top-progress"><span><i style={{ width: `${progress}%` }} /></span><strong>{progress}%</strong>{readOnly ? <b className="lan-badge">{expedition.players.find((player) => player.id === viewerPlayerId)?.name}</b> : <select className="save-switcher" aria-label="Current saved run" value={activeSaveId || expedition.saveId || ""} onChange={(event) => openSave(event.target.value)}>{Object.values(saveLibrary.saves).map((save) => <option value={save.saveId} key={save.saveId}>{save.name}</option>)}</select>}</div>
      </header>
      {(view === "route" || readOnly) && <RouteView expedition={expedition} setExpedition={setExpedition} tasksByChapter={routeModel.tasksByChapter} runeSupport={routeModel.runeSupport} activeId={activeId} setActiveId={setActiveId} readOnly={readOnly} viewerPlayerId={viewerPlayerId} onViewerUpdate={viewerUpdate} />}
      {!readOnly && view === "codex" && <CodexView expedition={expedition} />}
      {!readOnly && view === "party" && <PartyView expedition={expedition} setExpedition={setExpedition} saveLibrary={saveLibrary} activeSaveId={activeSaveId} onSelectSave={openSave} onNewSave={newRun} onDuplicateSave={duplicateRun} onDeleteSave={deleteRun} onExport={handleExport} onImport={handleImport} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

export default function PlannerPage() {
  return <RouteErrorBoundary><Home /></RouteErrorBoundary>;
}
