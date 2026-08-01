"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { builds, chapters, itemGuides, sources, stageLoadout, type Build, type Chapter, type PhaseKey } from "./data";
import { findMapItem, findMapItems, findMapRoutePoint, type MapItem } from "./map-items";

type Mode = "standard" | "seamless";
type View = "route" | "codex" | "party";
type LanMode = "none" | "controller" | "follower";
type Player = { id: string; name: string; buildId: string; color: string };
type Expedition = {
  schema: 1;
  name: string;
  mode: Mode;
  players: Player[];
  hostId: string;
  completed: Record<string, boolean>;
  createdAt: string;
};
type Task = {
  id: string;
  label: string;
  detail: string;
  kind: "objective" | "boss" | "gear" | "quest";
  playerId?: string;
  perPlayer: boolean;
  scope: string;
  item?: string;
  slot?: string;
  optional?: boolean;
};

const PLAYER_COLORS = ["#d8ad62", "#7db6a8", "#b987aa", "#7698c8", "#c5775e", "#a7a36c"];
const PHASE_START: Record<PhaseKey, string> = {
  early: "first-steps",
  mid: "liurnia-south",
  late: "gelmir",
  dlc: "gravesite",
};
const STORAGE_KEY = "tarnished-together-expedition-v1";

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
  if (exact) return exact[1];
  const marker = findMapItem(item, mapLayerForChapter(chapter)) || findMapItem(item);
  if (marker?.description) return marker.description;
  if (chapter.act === "Shadow of the Erdtree") {
    return `Acquire this during the ${chapter.region} leg. Start from ${chapter.grace}; use the item name in the linked map search, then return to the party route.`;
  }
  return `Pick this up during the ${chapter.region} sweep. Begin at ${chapter.grace}, search the exact item name on the linked map, and keep the weapon at this chapter's upgrade cap.`;
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
    { slot: "armour", values: [loadout.armour], categories: /armor/i },
    { slot: "spell", values: loadout.spells, categories: /spell/i },
    { slot: "Physick tear", values: [loadout.flask], categories: /flask/i },
  ];
  const pickups: LoadoutPickup[] = [];
  for (const field of fields) {
    for (const value of field.values) {
      const matches = findMapItems(value, layer, field.categories);
      const isChoice = /\bor\b|according to|best available|build-specific|named weapon/i.test(value) && ["off-hand", "skill", "talisman", "armour", "spell"].includes(field.slot);
      const selectedMatches = isChoice && matches.length > 1
        ? [...matches].sort((a, b) => cleanItemName(value).indexOf(cleanItemName(a.name)) - cleanItemName(value).indexOf(cleanItemName(b.name))).slice(0, 1)
        : matches;
      for (const match of selectedMatches) pickups.push({ item: match.name, slot: field.slot });
      if (!matches.length && /weapon|off-hand/.test(field.slot)) {
        for (const known of Object.keys(itemGuides)) {
          if (cleanItemName(value).includes(cleanItemName(known))) pickups.push({ item: known, slot: field.slot });
        }
      }
    }
  }
  return pickups.filter((pickup, index) => pickups.findIndex((candidate) => cleanItemName(candidate.item) === cleanItemName(pickup.item)) === index);
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

const ESSENTIAL_GUIDES: Record<string, string> = {
  "Church of Elleh: Crafting Kit and Kale": "From The First Step, ride north to the ruined church. Buy the Crafting Kit from Kalé, speak to him until his dialogue repeats, then continue north-east toward Gatefront.",
  "Gatefront: Whetstone Knife and first map": "At Gatefront Ruins, take the West Limgrave map from the roadside pillar. Go down the stairs in the southern camp, open the chest for the Whetstone Knife, then leave east along the main road.",
  "Third Church: Flask of Wondrous Physick": "Follow the road east through Mistwood to the Third Church of Marika. Take the Sacred Tear and Flask of Wondrous Physick, rest at the grace, then head west toward Agheel Lake.",
  "Limgrave Tunnels: early Smithing Stones": "Enter the mine in the cliff at the north-west corner of Agheel Lake. Collect the visible Smithing Stones from the walls, clear as much of the tunnel as the party needs, then continue to the next route card.",
};

const ESSENTIAL_MAP_QUERIES: Record<string, string> = {
  "Church of Elleh: Crafting Kit and Kale": "Church of Elleh",
  "Gatefront: Whetstone Knife and first map": "Gatefront Ruins",
  "Third Church: Flask of Wondrous Physick": "Third Church of Marika",
  "Limgrave Tunnels: early Smithing Stones": "Limgrave Tunnels",
  "Meet Rogier and Nepheli": "Sorcerer Rogier (First Location)",
  "Reach Iji in north-west Liurnia": "War Counselor Iji",
  "Collect Academy Glintstone Key": "Academy Glintstone Key (A)",
  "Speak to Ranni and all three retainers": "Ranni the Witch",
  "Meet Blaidd in Siofra": "Blaidd (Ranni's Quest - First Location)",
  "Collect Caelid map fragments": "Map (Caelid)",
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

const DEFERRED_AVATAR_ITEMS: Record<string, string> = {
  "Crimsonburst Crystal Tear": "weeping",
  "Opaline Bubbletear": "weeping",
  "Holy-Shrouding Cracked Tear": "liurnia-south",
  "Lightning-Shrouding Cracked Tear": "liurnia-south",
  "Magic-Shrouding Cracked Tear": "liurnia-south",
  "Flame-Shrouding Cracked Tear": "caelid",
  "Greenburst Crystal Tear": "caelid",
  "Opaline Hardtear": "caelid",
  "Stonebarb Cracked Tear": "caelid",
  "Cerulean Crystal Tear A": "gelmir",
  "Ruptured Crystal Tear": "gelmir",
  "Cerulean Crystal Tear B": "mountaintops",
  "Crimson Bubbletear": "mountaintops",
  "Thorny Cracked Tear": "haligtree",
};

const ITEM_REGION_GATES: Array<[RegExp, string]> = [
  [/Castle Morne|Weeping Peninsula|Morne Tunnel|Tombsward/i, "weeping"],
  [/Stormveil/i, "stormveil"],
  [/Caria Manor/i, "caria"],
  [/Raya Lucaria|Academy of Raya Lucaria/i, "academy"],
  [/Liurnia|Academy Gate Town|Church of Irith/i, "liurnia-south"],
  [/Caelid|Dragonbarrow|Sellia|Redmane|Gael Tunnel/i, "caelid"],
  [/Siofra|Nokron/i, "nokron"],
  [/\bAltus\b|Lux Ruins|Windmill Village/i, "altus"],
  [/Volcano Manor|Mt\. Gelmir|Gelmir|Seethewater/i, "gelmir"],
  [/Leyndell|Royal Capital|Capital Outskirts/i, "leyndell"],
  [/Ainsel|Nokstella|Lake of Rot|Grand Cloister/i, "ainsel"],
  [/Deeproot/i, "deeproot"],
  [/Consecrated Snowfield|Ordina|Haligtree|Elphael/i, "haligtree"],
  [/Forbidden Lands|Mountaintops|Flame Peak|Castle Sol/i, "mountaintops"],
  [/Mohgwyn/i, "mohgwyn"],
  [/Crumbling Farum Azula|Farum Azula/i, "farum"],
];

function deferredChapterForPickup(item: string, phase: PhaseKey) {
  const marker = findMapItem(item);
  const coordinateGate = marker?.layer === "surface" && marker.x >= 32 && marker.x <= 35.5 && marker.y >= 68.5 && marker.y <= 71.5 ? "stormveil" : undefined;
  const target = DEFERRED_AVATAR_ITEMS[item] || coordinateGate || ITEM_REGION_GATES.find(([pattern]) => pattern.test(`${marker?.name || item} ${marker?.description || ""}`))?.[1];
  if (!target) return undefined;
  if (target === "weeping" || target === "stormveil") return target;
  const phaseStart = chapters.findIndex((candidate) => candidate.id === PHASE_START[phase]);
  const targetIndex = chapters.findIndex((candidate) => candidate.id === target);
  return targetIndex >= phaseStart ? target : undefined;
}

function objectiveMapQuery(label: string) {
  if (ESSENTIAL_MAP_QUERIES[label]) return ESSENTIAL_MAP_QUERIES[label];
  const withoutAction = label.replace(/^Defeat\s+/i, "").replace(/^Speak (?:to|with)\s+/i, "").trim();
  return withoutAction.split(":")[0].split(",")[0].trim();
}

function essentialGuide(chapter: Chapter, label: string, index: number) {
  if (ESSENTIAL_GUIDES[label]) return ESSENTIAL_GUIDES[label];
  if (index === 0) return `Start from ${chapter.grace} and make this the first stop in the ${chapter.region} route. Complete it, then continue to the next card below.`;
  return `Continue from “${chapter.essentials[index - 1]}” to this stop. Complete it once, then move directly to the next card below.`;
}

function tasksForChapter(chapter: Chapter, expedition: Expedition): Task[] {
  const tasks: Task[] = [];
  chapter.essentials.forEach((label, index) => {
    if (/Collect three Sacred Tears|Collect Golden Seeds along the highway|Castle Morne weapon pickups|Collect key Altus build items|Collect early DLC build replacements|Collect Storehouse build items/i.test(label)) return;
    const isBoss = label.startsWith("Defeat");
    const isQuest = /speak|meet|quest|dialogue|decision|finish|resolve|ranni|fia|millicent|leda|ansbach|thiollier|moore|igon|varre/i.test(label);
    const individualPickup = /Sacred Tear|Golden Seed|collect|pickup|medallion|key/i.test(label);
    const perPlayer = expedition.mode === "standard" || individualPickup;
    const essentialItem = findMapItem(label, mapLayerForChapter(chapter));
    tasks.push({
      id: `${chapter.id}-essential-${index}`,
      label,
      detail: isBoss
        ? `Fight at the end of this route segment. Target ${chapter.level} and ${chapter.upgrade}; stop upgrading once the party reaches the listed cap.`
        : essentialGuide(chapter, label, index),
      kind: isBoss ? "boss" : isQuest ? "quest" : "objective",
      perPlayer,
      scope: perPlayer ? "Each player" : expedition.mode === "seamless" ? "Shared session" : "Party",
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
      const newPickups = loadoutPickups(loadout, chapter).filter((pickup) => !earlierItems.has(cleanItemName(pickup.item)) && !deferredChapterForPickup(pickup.item, chapter.phase!));
      newPickups.forEach((pickup, pickupIndex) => {
        const itemKey = cleanItemName(pickup.item).replace(/ /g, "-");
        const pickupTask: Task = {
          id: pickup.slot === "weapon" && pickupIndex === 0 ? `${chapter.id}-gear-${player.id}` : `${chapter.id}-loadout-item-${player.id}-${selected.id}-${itemKey}`,
          label: pickup.item,
          detail: `For ${player.name}'s ${selected.name} ${chapter.phase === "dlc" ? "DLC" : chapter.phase} setup. ${inferGuide(pickup.item, chapter)}${loadout.borrowedFrom ? ` This temporary stage comes from the sourced ${loadout.borrowedFrom.buildName} guide.` : ""}`,
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
        if (deferredChapterForPickup(pickup.item, phase) !== chapter.id) return;
        deferredTasks.push({
          id: `${chapter.id}-loadout-item-${player.id}-${selected.id}-${itemKey.replace(/ /g, "-")}`,
          label: pickup.item,
          detail: `Optional item for ${player.name}'s ${selected.name} setup, delayed until its region is open. ${inferGuide(pickup.item, chapter)} Skip it if the fight or detour is not comfortable yet; the route will continue normally.`,
          kind: "gear",
          playerId: player.id,
          perPlayer: false,
          scope: player.name,
          item: pickup.item,
          slot: pickup.slot,
          optional: true,
        });
      });
    });
  });
  if (deferredTasks.length) {
    const finalBossName = chapter.boss?.split(",")[0];
    const finalBossIndex = finalBossName ? tasks.findIndex((task) => task.label.includes(finalBossName)) : -1;
    tasks.splice(finalBossIndex >= 0 ? finalBossIndex : tasks.length, 0, ...orderPickupTasks(deferredTasks, chapter));
  }

  if (chapter.boss && !chapter.essentials.some((entry) => entry.includes(chapter.boss!.split(",")[0]))) {
    tasks.push({
      id: `${chapter.id}-boss`,
      label: `Defeat ${chapter.boss}`,
      detail: `This is ${chapter.remembrance ? "a Remembrance encounter" : "a major encounter"}. Enter around ${chapter.level} with weapons no higher than ${chapter.upgrade}.`,
      kind: "boss",
      perPlayer: expedition.mode === "standard",
      scope: expedition.mode === "standard" ? "Repeat in each world" : "Shared boss reward",
    });
  }
  return tasks;
}

const taskKeys = (task: Task, expedition: Expedition) =>
  task.perPlayer ? expedition.players.map((player) => `${task.id}:${player.id}`) : [task.id];

const taskDone = (task: Task, expedition: Expedition) =>
  Boolean(expedition.completed[`${task.id}:skipped`]) || taskKeys(task, expedition).every((key) => expedition.completed[key]);

function nextIncompleteTask(expedition: Expedition) {
  for (const chapter of chapters) {
    const task = tasksForChapter(chapter, expedition).find((candidate) => !taskDone(candidate, expedition));
    if (task) return { chapter, task };
  }
  return null;
}

function FullBuildDetails({ build, onClose, assignLabel, onAssign }: { build: Build; onClose: () => void; assignLabel?: string; onAssign?: () => void }) {
  const classification = buildClassification(build);
  return (
    <div className="drawer-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section className="loadout-dialog" role="dialog" aria-modal="true" aria-label={`${build.name} full build`}>
        <button className="drawer-close" onClick={onClose} aria-label="Close build detail">×</button>
        <div className="loadout-title">
          <div><p className="eyebrow">Build {builds.indexOf(build) + 1} of {builds.length}</p><h2>{build.name}</h2><p>{build.playstyle}</p></div>
          <div className="drawer-meta"><span>{build.collection}</span><span>{classification.attributes}</span><span>{classification.range}</span><span>{build.mechanic}</span><span>Start: {build.startingClass}</span><span>{build.complexity}</span></div>
        </div>
        <a className="build-source" href={build.source.url} target="_blank" rel="noreferrer">Source: {build.source.label} ↗</a>
        {build.quest && <div className="quest-callout"><strong>Quest dependency</strong><span>{build.quest}</span></div>}
        <div className="loadout-stages">
          {(["early", "mid", "late", "dlc"] as PhaseKey[]).map((phase) => {
            const loadout = stageLoadout(build, phase);
            return (
              <article key={phase}>
                <header><span>{phase === "dlc" ? "DLC" : phase}</span><small>{loadout.level}</small></header>
                <div className="loadout-weapon"><small>Main weapon</small><strong>{loadout.weapon}</strong></div>
                <dl>
                  <div><dt>Off hand</dt><dd>{loadout.offhand}</dd></div>
                  <div><dt>Skill plan</dt><dd>{loadout.skill}</dd></div>
                  <div><dt>Talismans</dt><dd><small>{loadout.talismanSlots}</small>{loadout.talismans.map((talisman) => <span key={talisman}>{talisman}</span>)}</dd></div>
                  <div><dt>Armour</dt><dd>{loadout.armour}</dd></div>
                  <div><dt>Spells</dt><dd>{loadout.spells.length ? loadout.spells.map((spell) => <span key={spell}>{spell}</span>) : build.publishedLoadout ? "Not specified by source" : "No required spells; use consumables for ranged utility."}</dd></div>
                  <div><dt>Physick</dt><dd>{loadout.flask}</dd></div>
                  <div><dt>Stats</dt><dd>{loadout.stats}</dd></div>
                </dl>
                {loadout.borrowedFrom && <a className="borrowed-source" href={loadout.borrowedFrom.url} target="_blank" rel="noreferrer">Temporary stage from {loadout.borrowedFrom.buildName} ↗</a>}
                {loadout.weaponChoice && <div className="weapon-choice-source"><strong>Why this named option</strong><p>{loadout.weaponChoice.rationale}</p><div>{loadout.weaponChoice.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></div>}
              </article>
            );
          })}
        </div>
        <p className="loadout-note">{build.publishedLoadout ? "The build's published stage is reproduced from its linked source. Earlier gaps use the closest matching Fextralife stage and show that source on the stage; once the build's own weapon is available it is carried forward." : "Talismans are listed in slot order. Swap the defensive slot for the boss-specific elemental drake talisman when needed."}</p>
        {onAssign && <button type="button" className="assign-build-button" onClick={onAssign}>{assignLabel || "Choose this build"}</button>}
      </section>
    </div>
  );
}

function Setup({ onCreate, imported }: { onCreate: (expedition: Expedition) => void; imported: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [mode, setMode] = useState<Mode>("standard");
  const [count, setCount] = useState(2);
  const [name, setName] = useState("Our path to the Elden Ring");
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
          <div><span className="settings-label">Mode</span><div className="plain-segmented"><button type="button" className={mode === "standard" ? "active" : ""} onClick={() => setMode("standard")}>Standard co-op</button><button type="button" className={mode === "seamless" ? "active" : ""} onClick={() => setMode("seamless")}>Seamless Co-op</button></div></div>
          <div><span className="settings-label">Players</span><div className="plain-segmented count-buttons">{[2, 3, 4, 5, 6].map((size) => <button type="button" className={count === size ? "active" : ""} key={size} onClick={() => changeCount(size)}>{size}</button>)}</div></div>
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
              <div className="build-facts"><span><small>Starting class</small>{candidate.startingClass}</span><span><small>Combat focus</small>{candidate.mechanic}</span></div>
              <div className="weapon-timeline">{(["early", "mid", "late", "dlc"] as PhaseKey[]).map((phase) => { const stage = stageLoadout(candidate, phase); return <div key={phase}><small>{phase}{stage.borrowedFrom ? " · sourced bridge" : ""}</small><span>{stage.weapon}</span></div>; })}</div>
              <footer><button type="button" onClick={() => setDetail(candidate)}>Full loadout</button><button type="button" className={selected ? "assigned" : ""} onClick={() => chooseBuild(candidate)}>{selected ? "Assigned" : `Assign to ${players[activePlayer].name}`}</button></footer>
            </article>;
          })}
        </div>
      </section>

      <div className="setup-actions"><div><strong>{players.length} players ready</strong><span>{mode === "standard" ? "Standard co-op; world steps will be repeated per player." : "Seamless Co-op; host and individual pickups are tracked separately."}</span></div><button type="button" onClick={() => onCreate({ schema: 1, name: name.trim() || "Untitled expedition", mode, players, hostId: players[0].id, completed: {}, createdAt: new Date().toISOString() })}>Create route</button></div>
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

function MapPanel({ chapter, expedition, onSelect }: { chapter: Chapter; expedition: Expedition; onSelect: (id: string) => void }) {
  const chapterMapLayer = mapLayerForChapter(chapter);
  const currentTask = tasksForChapter(chapter, expedition).find((task) => !taskDone(task, expedition));
  const mappedItem = currentTask?.item ? findMapItem(currentTask.item, chapterMapLayer) : undefined;
  const mappedObjective = !mappedItem && currentTask ? findMapRoutePoint(objectiveMapQuery(currentTask.label), chapterMapLayer) : undefined;
  const mappedPoint = mappedItem || mappedObjective || findMapRoutePoint(chapter.grace, chapterMapLayer);
  const mapLayer = mappedPoint?.layer || chapterMapLayer;
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
  const tileStartX = Math.max(0, Math.floor(((focusX - edge) / 100) * tileCount) - 1);
  const tileEndX = Math.min(tileCount - 1, Math.ceil(((focusX + edge) / 100) * tileCount) + 1);
  const tileStartY = Math.max(0, Math.floor(((focusY - edge) / 100) * tileCount) - 1);
  const tileEndY = Math.min(tileCount - 1, Math.ceil(((focusY + edge) / 100) * tileCount) + 1);
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
          const tasks = tasksForChapter(pin, expedition);
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

function RouteView({ expedition, setExpedition, activeId, setActiveId, readOnly = false }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; activeId: string; setActiveId: (id: string) => void; readOnly?: boolean }) {
  const chapter = chapters.find((candidate) => candidate.id === activeId) || chapters[0];
  const tasks = tasksForChapter(chapter, expedition);
  const completedTasks = tasks.filter((task) => taskDone(task, expedition)).length;
  const chapterIndex = chapters.indexOf(chapter);
  const nextStep = nextIncompleteTask(expedition);

  useEffect(() => {
    if (readOnly && nextStep && activeId !== nextStep.chapter.id) setActiveId(nextStep.chapter.id);
  }, [activeId, nextStep, readOnly, setActiveId]);

  const toggle = (key: string) => {
    if (readOnly) return;
    setExpedition((current) => current ? { ...current, completed: { ...current.completed, [key]: !current.completed[key] } } : current);
  };

  const completeAndContinue = () => {
    if (!nextStep || readOnly) return;
    const completed = { ...expedition.completed };
    taskKeys(nextStep.task, expedition).forEach((key) => { completed[key] = true; });
    const updated = { ...expedition, completed };
    setExpedition(updated);
    const following = nextIncompleteTask(updated);
    if (following) setActiveId(following.chapter.id);
  };

  const skipAndContinue = () => {
    if (!nextStep?.task.optional || readOnly) return;
    const completed = { ...expedition.completed, [`${nextStep.task.id}:skipped`]: true };
    const updated = { ...expedition, completed };
    setExpedition(updated);
    const following = nextIncompleteTask(updated);
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
    const next = chapters.find((candidate, index) => index > chapterIndex && !tasksForChapter(candidate, expedition).every((task) => taskDone(task, expedition)));
    if (next) setActiveId(next.id);
  };

  return (
    <div className="route-layout">
      <aside className="chapter-rail" aria-label="Route chapters">
        <div className="rail-heading"><span>Journey</span><strong>{chapters.filter((candidate) => candidate.act === "Base game").length + 1} chapters</strong></div>
        {(["Base game", "Shadow of the Erdtree"] as const).map((act) => (
          <div key={act} className="act-group">
            <p>{act}</p>
            {chapters.filter((candidate) => candidate.act === act).map((candidate) => {
              const candidateTasks = tasksForChapter(candidate, expedition);
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
              {!readOnly && <button type="button" className="primary" onClick={completeAndContinue}>Complete and continue</button>}
              {!readOnly && nextStep.task.optional && <button type="button" onClick={skipAndContinue}>Skip this item</button>}
              {readOnly && <span>Updates from the host</span>}
            </div>
          </section>
        ) : <section className="next-step-panel route-finished"><div><p>Route complete</p><h3>All objectives have been checked off.</h3></div></section>}

        <div className="balance-bar">
          <div><span>Rune level</span><strong>{chapter.level}</strong></div>
          <div><span>Weapon ceiling</span><strong>{chapter.upgrade}</strong></div>
          {chapter.blessing && <div><span>Blessing target</span><strong>{chapter.blessing}</strong></div>}
          <div><span>Begin from</span><strong>{chapter.grace}</strong></div>
        </div>

        <MapPanel chapter={chapter} expedition={expedition} onSelect={setActiveId} />

        <div className="objectives-heading"><div><p className="eyebrow">Ordered stops</p><h3>Do these before moving on</h3></div><span>{Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% complete</span></div>
        <div className="task-list">
          {tasks.map((task, index) => {
            const owner = task.playerId ? expedition.players.find((player) => player.id === task.playerId) : undefined;
            const done = taskDone(task, expedition);
            const skipped = Boolean(expedition.completed[`${task.id}:skipped`]);
            const mapItem = task.item ? findMapItem(task.item, mapLayerForChapter(chapter)) : undefined;
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
                        return <button type="button" disabled={readOnly} key={key} className={expedition.completed[key] ? "checked" : ""} onClick={() => toggle(key)} style={{ "--player": player.color } as React.CSSProperties}><i>{expedition.completed[key] ? "✓" : ""}</i>{player.name}</button>;
                      })}
                    </div>
                  ) : !readOnly ? (
                    <div className="task-actions">
                      {!skipped && <button type="button" className="complete-button" onClick={() => toggle(task.id)}><i>{done ? "✓" : ""}</i>{done ? "Completed" : "Mark complete"}</button>}
                      {task.optional && <button type="button" className="complete-button skip-button" onClick={() => toggleSkipped(task)}><i>{skipped ? "↶" : "—"}</i>{skipped ? "Restore item" : "Skip item"}</button>}
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
        <div className="mode-note"><strong>{expedition.mode === "standard" ? "Standard co-op rules" : "Seamless rules"}</strong><p>{expedition.mode === "standard" ? "World-state steps are tracked for every player. Rotate hosts and tick each copy." : "The route follows host progression. Individual pickups remain assigned separately."}</p></div>
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
            <div className="build-facts"><span><small>Starting class</small>{candidate.startingClass}</span><span><small>Combat focus</small>{candidate.mechanic}</span></div>
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

function PartyView({ expedition, setExpedition, onExport, onImport, onReset }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; onExport: () => void; onImport: (event: React.ChangeEvent<HTMLInputElement>) => void; onReset: () => void }) {
  const totalKeys = chapters.flatMap((chapter) => tasksForChapter(chapter, expedition)).flatMap((task) => taskKeys(task, expedition));
  const completed = totalKeys.filter((key) => expedition.completed[key]).length;
  const updatePlayer = (id: string, patch: Partial<Player>) => setExpedition((current) => current ? { ...current, players: current.players.map((player) => player.id === id ? { ...player, ...patch } : player) } : current);
  return <section className="party-page"><div className="page-heading"><div><p className="eyebrow">Expedition management</p><h2>{expedition.name}</h2><p>{expedition.mode === "standard" ? "Standard co-op across independent worlds" : "Seamless Co-op with host-led progression"}</p></div><div className="progress-medallion"><strong>{Math.round((completed / Math.max(totalKeys.length, 1)) * 100)}%</strong><span>route complete</span></div></div>
    <div className="party-cards">{expedition.players.map((player, index) => { const selected = builds.find((candidate) => candidate.id === player.buildId)!; const classification = buildClassification(selected); return <article key={player.id} style={{ "--player": player.color } as React.CSSProperties}><div className="portrait">{player.name.slice(0, 1).toUpperCase()}</div><div className="party-card-head"><input value={player.name} onChange={(event) => updatePlayer(player.id, { name: event.target.value })} /><span>Player {index + 1}</span></div><select value={player.buildId} onChange={(event) => updatePlayer(player.id, { buildId: event.target.value })}>{builds.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.name}</option>)}</select><p>{selected.playstyle}</p><div className="party-stats"><span><small>Attributes</small>{classification.attributes}</span><span><small>Range</small>{classification.range}</span></div><label className="host-radio"><input type="radio" name="host" checked={expedition.hostId === player.id} onChange={() => setExpedition((current) => current ? { ...current, hostId: player.id } : current)} /> {expedition.hostId === player.id ? "Current host" : "Make host"}</label></article>; })}</div>
    <div className="save-panel"><div><p className="eyebrow">Carry the route</p><h3>Save and share</h3><p>Progress is saved automatically. Export an expedition file for backup or to move the route to another computer.</p></div><div className="save-actions"><button type="button" className="primary" onClick={onExport}>Export expedition</button><label>Import file<input type="file" accept="application/json" onChange={onImport} /></label><button type="button" className="danger" onClick={onReset}>Start over</button></div></div>
    <div className="source-panel"><p className="eyebrow">Reference shelf</p><h3>Sources and version</h3><p>Content baseline: App/Regulation 1.16.1, checked 1 August 2026. External references open in a new tab.</p><div>{sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer">{label}<span>↗</span></a>)}</div></div>
  </section>;
}

export default function Home() {
  const [expedition, setExpedition] = useState<Expedition | null>(null);
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
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) localExpedition = JSON.parse(saved);
      } catch { localStorage.removeItem(STORAGE_KEY); }

      try {
        const response = await fetch("/api/expedition", { cache: "no-store" });
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("application/json")) {
          const remote = await response.json();
          if (remote.enabled === true) {
            const token = params.get("control") || "";
            const mode: LanMode = token ? "controller" : "follower";
            controlToken.current = token;
            lanRevision.current = Number(remote.revision || 0);
            if (!cancelled) {
              setLanMode(mode);
              setExpedition(remote.expedition || (mode === "controller" ? localExpedition : null));
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
      if (expedition) localStorage.setItem(STORAGE_KEY, JSON.stringify(expedition));
      else localStorage.removeItem(STORAGE_KEY);
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

  const progress = useMemo(() => {
    if (!expedition) return 0;
    const keys = chapters.flatMap((chapter) => tasksForChapter(chapter, expedition)).flatMap((task) => taskKeys(task, expedition));
    return Math.round((keys.filter((key) => expedition.completed[key]).length / Math.max(keys.length, 1)) * 100);
  }, [expedition]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.schema !== 1 || !Array.isArray(parsed.players) || parsed.players.length < 2 || parsed.players.length > 6) throw new Error();
        setExpedition(parsed); setView("route"); notify("Expedition imported");
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
  const handleReset = () => { if (window.confirm("Start a new expedition? The current local progress will be removed unless you export it first.")) { setExpedition(null); setView("route"); setActiveId(chapters[0].id); } };

  if (!hydrated) return <main className="loading-screen"><span>✦</span><p>Reading the guidance of grace…</p></main>;
  if (catalogueOnly) return <ReadOnlyBuildCatalogue lanAvailable={lanMode !== "none"} />;
  if (!expedition && lanMode === "follower") return <main className="follower-waiting"><strong>Tarnished Together</strong><h1>Waiting for the host</h1><p>The route will appear here after the host creates or restores an expedition.</p><button type="button" onClick={() => { window.location.href = "/?catalog=1"; }}>Browse all builds while you wait</button><span>Follower view · refreshes automatically</span></main>;
  if (!expedition) return <Setup onCreate={(created) => { setExpedition(created); notify("Route created"); }} imported={handleImport} />;

  const readOnly = lanMode === "follower";

  return (
    <main className={`app-shell ${readOnly ? "follower-mode" : ""}`}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => { setView("route"); setActiveId(chapters[0].id); }}><span>✦</span><strong>Tarnished <em>Together</em></strong></button>
        <nav aria-label="Primary"><button type="button" className={view === "route" ? "active" : ""} onClick={() => setView("route")}>Route</button>{readOnly && <button type="button" onClick={() => { window.location.href = "/?catalog=1"; }}>Build catalogue</button>}{!readOnly && <><button type="button" className={view === "codex" ? "active" : ""} onClick={() => setView("codex")}>Build codex</button><button type="button" className={view === "party" ? "active" : ""} onClick={() => setView("party")}>Company</button></>}</nav>
        <div className="top-progress"><span><i style={{ width: `${progress}%` }} /></span><strong>{progress}%</strong>{readOnly ? <b className="lan-badge">Following</b> : <button type="button" onClick={handleExport} aria-label="Export expedition">⇩</button>}</div>
      </header>
      {(view === "route" || readOnly) && <RouteView expedition={expedition} setExpedition={setExpedition} activeId={activeId} setActiveId={setActiveId} readOnly={readOnly} />}
      {!readOnly && view === "codex" && <CodexView expedition={expedition} />}
      {!readOnly && view === "party" && <PartyView expedition={expedition} setExpedition={setExpedition} onExport={handleExport} onImport={handleImport} onReset={handleReset} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
