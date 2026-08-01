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
  assert.match(sourcedBuilds, /Wing Stance Milady/);
  assert.match(sourcedBuilds, /Finger Seal for buffs only; no shield/);
  assert.doesNotMatch(sourcedBuilds, /Guard counters/);
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
  const [page, server, packageJson, mapItems] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../scripts/lan-server.mjs", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/map-items.ts", import.meta.url), "utf8"),
  ]);
  assert.match(page, /Complete and continue/);
  assert.match(page, /Updates from the host/);
  assert.match(page, /catalogueOnly/);
  assert.match(page, /Compare every sourced build before the run controller assigns them/);
  assert.match(page, /Strength.*Dexterity.*Intelligence.*Faith.*Arcane.*Ranged/);
  assert.doesNotMatch(page, /Party role|All roles/);
  assert.match(server, /Follower access is read-only/);
  assert.match(server, /Build catalogue/);
  assert.match(server, /\?catalog=1/);
  assert.match(server, /x-control-token/);
  assert.match(server, /Other network adapters/);
  assert.match(page, /map-c5431314-6159-4599-9668-0ccf4e1f8e9a/);
  assert.match(page, /map-96747699-d8a3-44b4-b2d6-cf6b45c579c6/);
  assert.match(page, /the-shadow-realm/);
  assert.match(packageJson, /scripts\/lan-server\.mjs/);
  assert.match(page, /loadoutPickups/);
  assert.match(page, /loadout-item-/);
  assert.match(page, /equip unlocked items/);
  assert.match(page, /Equip only what has been collected/);
  assert.match(page, /Keep the current equipment unchanged/);
  assert.doesNotMatch(page, /after collecting the item cards above/);
  assert.doesNotMatch(page, /legacyId/);
  assert.match(page, /FLASK_UPGRADE_STOPS/);
  assert.match(page, /Golden Seed - 2x Capital Outskirts West/);
  assert.match(page, /Sacred Tear \(First Church of Marika\)/);
  assert.match(page, /Flask upgrade for every player/);
  assert.match(page, /DEFERRED_AVATAR_ITEMS/);
  assert.match(page, /ITEM_REGION_GATES/);
  assert.match(page, /\[\/Stormveil\/i, "stormveil"\]/);
  assert.match(page, /deferredChapterForPickup/);
  assert.match(page, /marker\.x >= 32.*marker\.y >= 68\.5/);
  assert.match(page, /"Stonebarb Cracked Tear": "caelid"/);
  assert.match(page, /"Opaline Hardtear": "caelid"/);
  assert.match(page, /Skip this item/);
  assert.match(page, /Restore item/);
  assert.match(mapItems, /Found in a cellar underneath the Mistwood Ruins/);
  assert.match(mapItems, /requires 1 Stonesword Key to unlock/);
});
