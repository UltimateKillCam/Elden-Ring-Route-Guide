import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Miniflare } from "miniflare";
import { createServer } from "vite";

test("public sessions create rooms, reserve builds and protect player progress", { timeout: 60_000 }, async () => {
  const miniflare = new Miniflare({
    modules: true,
    script: `export default { fetch() { return new Response("ok"); } }`,
    compatibilityDate: "2026-01-01",
    d1Databases: ["DB"],
  });
  const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
  try {
    const db = await miniflare.getD1Database("DB");
    const migration = await readFile("drizzle/0000_curvy_lilandra.sql", "utf8");
    for (const statement of migration.split("--> statement-breakpoint")) await db.exec(statement.replace(/\s+/g, " ").trim());
    const { handleSessionApi } = await vite.ssrLoadModule("/worker/session-api.ts");
    const call = (path, init) => handleSessionApi(new Request(`https://sessions.invalid${path}`, init), db);

    const createdResponse = await call("/api/sessions", {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": "198.51.100.10" },
      body: JSON.stringify({ mode: "seamless", playerCount: 2 }),
    });
    const created = await createdResponse.json();
    assert.equal(createdResponse.status, 201);
    assert.match(created.code, /^\d{6}$/);
    assert.match(created.hostToken, /^[a-f0-9]{64}$/);
    assert.equal(created.expedition, null);
    assert.deepEqual(created.slots, [{ playerId: "player-2", claimed: false }]);

    const readResponse = await call(`/api/sessions/${created.code}`, { method: "GET" });
    assert.equal(readResponse.headers.get("access-control-allow-origin"), "*");
    assert.equal((await readResponse.json()).playerCount, 2);

    const malformedCodeResponse = await call(`/api/sessions/${created.code}extra`, { method: "GET" });
    assert.equal(malformedCodeResponse.status, 404);

    const joinResponse = await call(`/api/sessions/${created.code}/join`, {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": "198.51.100.11" },
      body: JSON.stringify({ playerId: "player-2", name: "Melina", buildId: "colossal-hammer", startingClass: "Hero" }),
    });
    const joined = await joinResponse.json();
    assert.equal(joinResponse.status, 201);
    assert.match(joined.guestToken, /^[a-f0-9]{64}$/);
    assert.equal(joined.you, "player-2");
    assert.equal(joined.slots[0].startingClass, "Hero");

    const duplicateResponse = await call(`/api/sessions/${created.code}/join`, {
      method: "POST",
      headers: { "content-type": "application/json", "cf-connecting-ip": "198.51.100.12" },
      body: JSON.stringify({ playerId: "player-2", name: "Ranni", buildId: "quality-knight", startingClass: "Astrologer" }),
    });
    const duplicate = await duplicateResponse.json();
    assert.equal(duplicateResponse.status, 409, JSON.stringify(duplicate));

    const expedition = {
      schema: 1,
      saveId: "public-test",
      activeChapterId: "first-steps",
      name: "Public test",
      mode: "seamless",
      players: [
        { id: "player-1", name: "Host", buildId: "quality-knight", startingClass: "Vagabond", color: "#d8ad62" },
        { id: "player-2", name: "Placeholder", buildId: "quality-knight", startingClass: "Vagabond", color: "#7db6a8" },
      ],
      hostId: "player-1",
      completed: {},
      createdAt: new Date().toISOString(),
    };
    const saveResponse = await call(`/api/sessions/${created.code}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${created.hostToken}`, "content-type": "application/json" },
      body: JSON.stringify({ expedition, baseRevision: 0 }),
    });
    const saved = await saveResponse.json();
    assert.equal(saveResponse.status, 200);
    assert.deepEqual(saved.expedition.players[1], { id: "player-2", name: "Melina", buildId: "colossal-hammer", startingClass: "Hero", color: "#7db6a8" });

    const startedSettingsResponse = await call(`/api/sessions/${created.code}`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${created.hostToken}`, "content-type": "application/json" },
      body: JSON.stringify({ mode: "standard", playerCount: 2 }),
    });
    assert.equal(startedSettingsResponse.status, 409);

    const forbiddenProgress = await call(`/api/sessions/${created.code}/progress`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${joined.guestToken}`, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-1", value: 55 }),
    });
    assert.equal(forbiddenProgress.status, 403);

    const progressResponse = await call(`/api/sessions/${created.code}/progress`, {
      method: "PATCH",
      headers: { authorization: `Bearer ${joined.guestToken}`, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-2", value: 55 }),
    });
    const progress = await progressResponse.json();
    assert.equal(progressResponse.status, 200);
    assert.equal(progress.expedition.checkpointLevels["academy:player-2"], 55);

    const unchangedResponse = await call(`/api/sessions/${created.code}?revision=${progress.revision}`, {
      method: "GET",
      headers: { authorization: `Bearer ${joined.guestToken}` },
    });
    assert.equal(unchangedResponse.status, 204);

    const staleResponse = await call(`/api/sessions/${created.code}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${created.hostToken}`, "content-type": "application/json" },
      body: JSON.stringify({ expedition, baseRevision: 1 }),
    });
    assert.equal(staleResponse.status, 409);
  } finally {
    await vite.close();
    await miniflare.dispose();
  }
});
