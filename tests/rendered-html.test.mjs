import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished expedition setup", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(html, /<title>Tarnished Together \| Elden Ring Co-op Route Planner<\/title>/i);
  assert.match(page, /Tarnished/);
  assert.match(page, /Together/);
  assert.match(page, /Create route/);
  assert.match(page, /Standard co-op/);
  assert.match(page, /Seamless Co-op/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("ships the curated, complete wiki and sourced build catalogues with the full remembrance route", async () => {
  const [data, wikiBuilds, sourcedBuilds, memeBuilds] = await Promise.all([
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/wiki-builds.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sourced-builds.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/meme-builds.ts", import.meta.url), "utf8"),
  ]);
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.equal((data.match(/^\s*build\(/gm) ?? []).length, 100);
  assert.equal((wikiBuilds.match(/^\s*"id": "fextra-/gm) ?? []).length, 160);
  assert.equal((wikiBuilds.match(/^\s*"collection": "Fextralife"/gm) ?? []).length, 160);
  assert.equal((sourcedBuilds.match(/^\s*id: "game8-/gm) ?? []).length, 1);
  assert.equal((sourcedBuilds.match(/^\s*id: "mobalytics-/gm) ?? []).length, 4);
  assert.equal((memeBuilds.match(/^\s*id: "meme-/gm) ?? []).length, 6);
  assert.match(data, /wikiBuilds.*additionalSourcedBuilds.*sourcedMemeBuilds/);
  assert.ok((data.match(/remembrance:\s*true/g) ?? []).length >= 22);
  for (const boss of [
    "Godrick the Grafted",
    "Rennala, Queen of the Full Moon",
    "Starscourge Radahn",
    "Regal Ancestor Spirit",
    "Rykard, Lord of Blasphemy",
    "Morgott, the Omen King",
    "Astel, Naturalborn of the Void",
    "Lichdragon Fortissax",
    "Fire Giant",
    "Malenia, Goddess of Rot",
    "Mohg, Lord of Blood",
    "Dragonlord Placidusax",
    "Maliketh, the Black Blade",
    "Hoarah Loux",
    "Elden Beast",
    "Divine Beast Dancing Lion",
    "Rellana, Twin Moon Knight",
    "Putrescent Knight",
    "Commander Gaius",
    "Scadutree Avatar",
    "Midra, Lord of Frenzied Flame",
    "Metyr, Mother of Fingers",
    "Messmer the Impaler",
    "Romina, Saint of the Bud",
    "Promised Consort Radahn",
  ]) assert.match(data, new RegExp(boss.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /new Blob/);
  assert.match(page, /FileReader/);
  assert.match(page, /task\.perPlayer/);
  assert.match(page, /setup-build-grid/);
  assert.match(page, /Full loadout/);
  assert.match(data, /stageLoadout/);
  assert.match(data, /talismanSlots/);
  assert.match(data, /Two-Headed Turtle Talisman/);
  assert.match(data, /startingClass/);
  assert.match(data, /mechanic/);
  assert.match(data, /PC Gamer: Courtly Duelist/);
  assert.match(page, /Combat focus/);
  assert.match(page, /Starting class/);
  assert.match(page, /Sort by/);
  assert.match(page, /Source category/);
  assert.match(page, /Meme \/ cosplay/);
  assert.match(page, /Other guides/);
  assert.match(data, /closestPublishedStage/);
  assert.doesNotMatch(data, /Clear Gael Tunnel if needed by a build|Castle Morne weapon pickups|Collect key Altus build items|Collect early DLC build replacements|Collect Storehouse build items/);
  assert.match(sourcedBuilds, /Wing Stance Milady/);
  assert.match(sourcedBuilds, /Finger Seal for buffs only; no shield/);
  assert.doesNotMatch(sourcedBuilds, /Guard counters/);
  assert.match(data, /build\("quality-knight"[\s\S]*?\["Longsword", "Claymore", "Quality Great .*?", "Milady \+ Wing Stance"\]/);
  assert.match(data, /build\("colossal-hammer"[\s\S]*?\["Large Club", "Great Club", "Giant-Crusher", "Anvil Hammer"\]/);
  assert.match(sourcedBuilds, /Lordsworn’s Greatsword remains equipped from Gatefront until Rykard/);
  assert.match(sourcedBuilds, /Bloodhound’s Fang Finesse/);
});

test("uses plain product copy and the revised social card", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page, /One company\. One balanced path|without turning anyone|Forge our route/);
  assert.doesNotMatch(page, /Local\s*&\s*Private|75 evolving builds/i);
  assert.doesNotMatch(layout, /One company\. One balanced path/);
  assert.match(layout, /\/og\.png/);
});

test("includes a read-only LAN follower and Elden Ring build filters", async () => {
  const [page, progression, server, packageJson, mapItems, data, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/progression.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/lan-server.mjs", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/map-items.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Complete and continue/);
  assert.match(page, /Updates from the host/);
  assert.match(page, /catalogueOnly/);
  assert.match(page, /Compare every sourced build before the run controller assigns them/);
  assert.match(page, /Strength.*Dexterity.*Intelligence.*Faith.*Arcane.*Ranged/);
  assert.doesNotMatch(page, /Party role|All roles/);
  assert.match(server, /Only the controller can change expedition settings/);
  assert.match(server, /text\/event-stream/);
  assert.match(server, /broadcastExpedition/);
  assert.match(server, /mutationSource = "player"/);
  assert.match(page, /new EventSource\("\/api\/expedition\/events"\)/);
  assert.match(page, /window\.addEventListener\("focus", refreshNow\)/);
  assert.match(page, /activeChapterId/);
  assert.match(page, /selectRouteChapter/);
  assert.match(server, /\/api\/player-progress/);
  assert.match(server, /Players can only update their own checklist/);
  assert.match(server, /Players can only update their own level/);
  assert.match(server, /Players can only update their own stats/);
  assert.match(server, /Stats must be integers from 1 to 99/);
  assert.match(server, /Players can only update their own weapon level/);
  assert.match(server, /Weapon level must be an integer from 0 to 25/);
  assert.match(server, /Build catalogue/);
  assert.match(server, /\?catalog=1/);
  assert.match(server, /x-control-token/);
  assert.match(server, /Other network adapters/);
  assert.match(page, /map-c5431314-6159-4599-9668-0ccf4e1f8e9a/);
  assert.match(page, /map-96747699-d8a3-44b4-b2d6-cf6b45c579c6/);
  assert.match(page, /the-shadow-realm/);
  assert.match(packageJson, /scripts\/lan-server\.mjs/);
  assert.match(page, /loadoutPickups/);
  assert.match(progression, /export const literalItemName/);
  assert.match(page, /exactMatches\.length \? exactMatches : embeddedMatches\.length/);
  assert.match(page, /loadout-item-/);
  assert.match(page, /equip unlocked items/);
  assert.match(page, /Equip only what has been collected/);
  assert.match(page, /Keep the current equipment unchanged/);
  assert.doesNotMatch(page, /after collecting the item cards above/);
  assert.doesNotMatch(page, /legacyId/);
  assert.match(page, /FLASK_UPGRADE_STOPS/);
  assert.match(data, /Accept Melina's accord and receive Torrent/);
  assert.match(data, /Enter Margit's arena once to trigger the Roundtable Hold invitation/);
  assert.match(data, /Accept Melina's invitation and meet Smithing Master Hewg/);
  assert.match(page, /regular armaments only to \+3 and Somber armaments only to \+1/);
  assert.match(page, /Winning is not required/);
  assert.match(mapItems, /cleanImportedDescription/);
  assert.match(page, /Meet Nepheli before Godrick.*Secluded Cell/s);
  assert.match(page, /"Meet Patches at Scenic Isle": "Patches \(First Liurnia Location\)"/);
  assert.match(page, /"Spare Patches and reopen his Murkwater Cave shop": "first-steps-quest-patches-murkwater-cave"/);
  assert.match(page, /"Spare Patches and reopen his Murkwater Cave shop": "Patches \(Bossfight\)"/);
  const { findMapItem } = await import("../app/map-items.ts");
  assert.doesNotMatch(findMapItem("Nepheli Loux")?.description ?? "", /�/);
  assert.match(page, /Golden Seed - 2x Capital Outskirts West/);
  assert.match(page, /Sacred Tear \(First Church of Marika\)/);
  assert.match(page, /Flask upgrade for every player/);
  assert.match(page, /5 levels below guide/);
  assert.match(page, /weapon-upgrade ceilings are lowered together/);
  assert.match(page, /Rune top-up:/);
  assert.match(page, /only recommends a fully funded level/);
  assert.match(page, /Start-of-chapter checkpoint/);
  assert.match(page, /before levelling or reinforcing a weapon/);
  assert.match(page, /do not wait until the end of the chapter/);
  assert.match(page, /Selected builds/);
  assert.match(page, /this page only shows chosen builds/);
  assert.match(page, /EquipmentTimeline/);
  assert.match(page, /Stats at this point/);
  assert.match(page, /Talismans equipped/);
  assert.match(page, /From \$\{snapshot\.chapter\.title\}/);
  assert.match(page, /Current RL/);
  assert.match(page, /checkpointLevels/);
  assert.match(page, /checkpointStats/);
  assert.match(page, /checkpointWeaponLevels/);
  assert.match(page, /carriedCheckpointNumber/);
  assert.match(page, /carriedCheckpointStats/);
  assert.match(page, /carriedWeaponCheckpoint/);
  assert.match(page, /only change values that have increased/);
  assert.match(page, /held runes again because that balance does not carry forward/);
  assert.match(page, /statScheduleText/);
  assert.match(page, /Apply them exactly as follows/);
  assert.match(page, /Chapter target/);
  assert.match(page, /Enter all eight current stats/);
  assert.match(page, /Current stats match the number of levels/);
  assert.match(page, /Active weapon/);
  assert.match(page, /The stone budget below now starts from the entered/);
  assert.match(page, /safeDesiredUpgrade/);
  assert.match(page, /const routeModel = useMemo/);
  assert.match(page, /currentTask\.mapQuery \|\| objectiveMapQuery\(currentTask\.label\)/);
  assert.match(page, /mapQuery: boss\.mapQuery \|\| `\$\{boss\.name\} \$\{boss\.location\}`/);
  assert.match(page, /tasksByChapter/);
  assert.match(styles, /content-visibility: auto/);
  assert.match(page, /previousUpgradePaths\[player\.id\] === path/);
  assert.match(page, /previousUpgradePath === upgradePath/);
  assert.match(page, /Replace with/);
  assert.match(page, /Skip this boss/);
  assert.match(page, /const optional = \/\^\(\?:Optional\|Optionally\|If the optional\)/);
  assert.match(page, /Optional rune bosses have been removed because this character is already above the chapter target/);
  assert.match(page, /everyRecordedPlayerIsOverTarget/);
  assert.match(page, /No levels recommended; RL/);
  assert.match(page, /SAVE_LIBRARY_KEY/);
  assert.match(page, /Duplicate current/);
  assert.match(page, /Which character are you playing/);
  assert.match(page, /Solo playthrough/);
  assert.doesNotMatch(page, /The model is short|stay at RL.*next mandatory boss payout/);
  assert.match(progression, /const EXACT_GATES/);
  assert.match(progression, /const REGION_GATES/);
  assert.match(progression, /Stormveil\/i, gate\("stormveil"/);
  assert.match(progression, /Scadu.*Altus/);
  assert.match(progression, /export function deferredPickupGate/);
  assert.match(progression, /Sacred Relic Sword.*ashen/);
  assert.match(progression, /Greatsword of Radahn \(Lord\).*enir/);
  assert.doesNotMatch(page, /TimingNote|Use the previous-stage setup until/);
  assert.match(page, /afterObjective/);
  assert.match(page, /const embeddedMatches = allMatches/);
  assert.match(page, /OBJECTIVE_MAP_LAYERS/);
  assert.match(mapItems, /Number\(b\.name === query\) - Number\(a\.name === query\)/);
  assert.match(page, /const slotPriority/);
  assert.match(page, /slotPriority\(a\) - slotPriority\(b\)/);
  assert.equal((page.match(/slot: pickup\.slot/g) || []).length, 2);
  assert.match(progression, /marker\.x >= 32.*marker\.y >= 68\.5/);
  assert.match(progression, /marker\.x >= 57.*marker\.y >= 13/);
  assert.match(progression, /function broadCoordinateGate/);
  assert.match(progression, /marker\.x >= 49.*marker\.y >= 57.*gate\("caelid"\)/);
  assert.match(progression, /\^Cuckoo Knight.*gate\("liurnia-south"\)/);
  assert.match(progression, /Drainage Channel\/i, gate\("haligtree"/);
  assert.match(progression, /"Stonebarb Cracked Tear": "caelid"/);
  assert.match(progression, /"Opaline Hardtear": "caelid"/);
  assert.match(progression, /Opaline Hardtear.*Defeat Starscourge Radahn/);
  assert.match(progression, /Blasphemous Blade.*gate\("rykard"/);
  assert.match(progression, /Retaliatory Crossed-Tree.*Resolve the Leda and Ansbach Storehouse signs/);
  assert.match(page, /Skip this item/);
  assert.match(page, /Restore item/);
  assert.match(page, /const guide = essentialGuide/);
  assert.match(page, /Some rewards are mutually exclusive/);
  assert.match(data, /Keep Gatekeeper Gostoc alive/);
  assert.match(data, /Give Irina's letter to Edgar before the boss/);
  assert.match(data, /Give Nepheli the Stormhawk King/);
  assert.match(data, /use You're Beautiful instead of a Larval Tear/);
  assert.match(data, /resolve the Sellen or Jerren summon signs/);
  assert.match(data, /choose the curse or puppet route/);
  assert.match(data, /choose the Iris reward/);
  assert.match(data, /Collect Gideon's rewards.*before Maliketh/);
  assert.match(mapItems, /Found in a cellar underneath the Mistwood Ruins/);
  assert.match(mapItems, /requires 1 Stonesword Key to unlock/);
});

test("every ordered objective resolves to a sourced item or map marker", async () => {
  const [page, data, mapSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/map-items.ts", import.meta.url), "utf8"),
  ]);
  const mapItems = JSON.parse(mapSource.match(/export const mapItems: MapItem\[\] = (\[[\s\S]*?\]);\n\nexport type MapRoutePoint/)[1]);
  const routePoints = JSON.parse(mapSource.match(/export const mapRoutePoints: MapRoutePoint\[\] = (\[[\s\S]*?\]);\n\nconst clean/)[1]);
  const aliasBlock = page.match(/const ESSENTIAL_MAP_QUERIES[\s\S]*?\n};/)[0];
  const aliases = Object.fromEntries([...aliasBlock.matchAll(/^\s*"([^"]+)": "([^"]+)",?$/gm)].map((match) => [match[1], match[2]]));
  const clean = (value) => value.toLowerCase().replace(/[+＋]\d+/g, "").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
  const matches = (value, candidate) => {
    const query = clean(value);
    const name = clean(candidate);
    return name.length > 3 && (query.includes(name) || name.includes(query));
  };
  const labels = [...data.matchAll(/essentials: \[(.*?)\]/g)]
    .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]));
  for (const label of labels) {
    if (mapItems.some((item) => matches(label, item.name))) continue;
    const query = aliases[label] || label.replace(/^Defeat\s+/i, "").replace(/^Speak (?:to|with)\s+/i, "").trim().split(":")[0].split(",")[0].trim();
    assert.ok(routePoints.some((point) => matches(query, point.name)), `No sourced map target for: ${label}`);
  }
  assert.match(page, /const mapLayer = mappedPoint\?\.layer \|\| objectiveLayer/);
  assert.match(page, /OBJECTIVE_MAP_LAYERS/);
});
