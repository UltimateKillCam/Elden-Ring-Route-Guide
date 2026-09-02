import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomInt } from "node:crypto";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const responseCookies = (response) => {
  const values = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : String(response.headers.get("set-cookie") || "").split(/,(?=\s*[^;,]+=)/);
  return values.map((value) => value.trim().split(";")[0]).filter(Boolean);
};

test("LAN sessions enforce player ownership, revision safety, and serialized persistence", { timeout: 45_000 }, async () => {
  const root = process.cwd();
  const gatewayPort = randomInt(18_000, 20_000);
  const appPort = randomInt(22_000, 24_000);
  const statePath = join(root, "work", `lan-test-${process.pid}.json`);
  await writeFile(join(root, "dist", ".lan-build-stamp"), new Date().toISOString(), "utf8");
  const joinCode = "482913";
  const controlToken = "1234567890abcdef1234567890abcdef1234567890abcdef";
  const server = spawn(process.execPath, ["scripts/lan-server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      ELDEN_RING_LAN_PORT: String(gatewayPort),
      ELDEN_RING_APP_PORT: String(appPort),
      ELDEN_RING_STATE_PATH: statePath,
      ELDEN_RING_NO_BROWSER: "1",
      ELDEN_RING_APP_STDIO: "ignore",
      ELDEN_RING_JOIN_CODE: joinCode,
      ELDEN_RING_CONTROL_TOKEN: controlToken,
    },
    stdio: "ignore",
    windowsHide: true,
  });

  try {
    const base = `http://127.0.0.1:${gatewayPort}`;
    let started = false;
    for (let attempt = 0; attempt < 100 && !started; attempt += 1) {
      try { started = (await fetch(`${base}/api/expedition`)).ok; } catch { await delay(200); }
    }
    assert.equal(started, true, "LAN gateway did not start");

    const anonymous = await fetch(`${base}/api/expedition`);
    assert.deepEqual(await anonymous.json(), { enabled: true, requiresJoin: true, revision: 0 });
    const privateInfo = await fetch(`${base}/api/lan-info`);
    assert.equal(privateInfo.status, 403);
    const hostInfo = await fetch(`${base}/api/lan-info?control=${controlToken}`);
    assert.equal((await hostInfo.json()).joinCode, joinCode);

    const join = await fetch(`${base}/api/join`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: joinCode }),
    });
    assert.equal(join.status, 200);
    const joinedCookies = responseCookies(join);
    assert.ok(joinedCookies.some((value) => /^tarnished-together-join=\d{6}$/.test(value)));
    assert.ok(joinedCookies.some((value) => /^tarnished-together-session=[a-f0-9]{64}$/.test(value)));
    const cookie = joinedCookies.join("; ");
    const legacyCookie = joinedCookies.find((value) => value.startsWith("tarnished-together-join="));

    const expedition = {
      schema: 1,
      saveId: "integration-run",
      activeChapterId: "academy",
      name: "Integration run",
      mode: "seamless",
      players: [
        { id: "player-1", name: "Tarnished 1", buildId: "quality-knight", color: "#d8ad62" },
        { id: "player-2", name: "Tarnished 2", buildId: "colossal-hammer", startingClass: "Hero", color: "#7db6a8" },
      ],
      hostId: "player-1",
      completed: {},
      createdAt: new Date().toISOString(),
    };
    const controllerWrite = await fetch(`${base}/api/expedition`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-control-token": controlToken },
      body: JSON.stringify({ expedition }),
    });
    assert.equal(controllerWrite.status, 200);
    assert.equal((await controllerWrite.json()).revision, 1);

    const followerRead = await fetch(`${base}/api/expedition`, { headers: { cookie } });
    assert.equal((await followerRead.json()).expedition.activeChapterId, "academy");
    const followerWrite = await fetch(`${base}/api/expedition`, {
      method: "PUT",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ expedition: null }),
    });
    assert.equal(followerWrite.status, 403);

    const unclaimedProgress = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-1", value: 52 }),
    });
    assert.equal(unclaimedProgress.status, 403);
    assert.match((await unclaimedProgress.json()).error, /Choose your character/);

    const playerInfoResponse = await fetch(`${base}/api/lan-info`, { headers: { "x-control-token": controlToken } });
    const playerInfo = await playerInfoResponse.json();
    assert.equal(playerInfo.players.length, 2);
    const playerOneCode = playerInfo.players.find((player) => player.id === "player-1").code;
    const playerTwoCode = playerInfo.players.find((player) => player.id === "player-2").code;
    assert.match(playerOneCode, /^\d{6}$/);
    assert.notEqual(playerOneCode, playerTwoCode);

    const wrongClaim = await fetch(`${base}/api/claim-player`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ playerId: "player-2", code: playerOneCode }),
    });
    assert.equal(wrongClaim.status, 400);

    const claim = await fetch(`${base}/api/claim-player`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ playerId: "player-1", code: playerOneCode }),
    });
    assert.equal(claim.status, 200);
    assert.equal((await claim.json()).you, "player-1");

    const legacyWrite = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie: legacyCookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-1", value: 52 }),
    });
    assert.equal(legacyWrite.status, 403);

    const ownProgress = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-1", value: 52 }),
    });
    const updated = await ownProgress.json();
    assert.equal(ownProgress.status, 200);
    assert.equal(updated.expedition.checkpointLevels["academy:player-1"], 52);

    const spoofedIdentity = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ playerId: "player-2", kind: "levels", key: "academy:player-2", value: 60 }),
    });
    assert.equal(spoofedIdentity.status, 403);

    const crossPlayerKey = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: "academy:player-2", value: 60 }),
    });
    assert.equal(crossPlayerKey.status, 403);

    const malformedKey = await fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "completed", key: "../academy-player-1", value: true }),
    });
    assert.equal(malformedKey.status, 400);

    const staleControllerWrite = await fetch(`${base}/api/expedition`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-control-token": controlToken },
      body: JSON.stringify({ expedition, baseRevision: 1 }),
    });
    const conflict = await staleControllerWrite.json();
    assert.equal(staleControllerWrite.status, 409);
    assert.equal(conflict.expedition.checkpointLevels["academy:player-1"], 52);

    const concurrentWrites = await Promise.all(Array.from({ length: 8 }, (_, index) => fetch(`${base}/api/player-progress`, {
      method: "PATCH",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ kind: "levels", key: `race-${index}:player-1`, value: 50 + index }),
    })));
    assert.ok(concurrentWrites.every((response) => response.status === 200));

    const finalRead = await fetch(`${base}/api/expedition`, { headers: { cookie } });
    const finalState = await finalRead.json();
    for (let index = 0; index < 8; index += 1) assert.equal(finalState.expedition.checkpointLevels[`race-${index}:player-1`], 50 + index);
    const persisted = JSON.parse(await readFile(statePath, "utf8"));
    assert.equal(persisted.revision, finalState.revision);
    assert.deepEqual(persisted.expedition.checkpointLevels, finalState.expedition.checkpointLevels);

    const currentControllerWrite = await fetch(`${base}/api/expedition`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-control-token": controlToken },
      body: JSON.stringify({ expedition: { ...finalState.expedition, name: "Revision-safe run" }, baseRevision: finalState.revision }),
    });
    assert.equal(currentControllerWrite.status, 200);
    assert.equal((await currentControllerWrite.json()).expedition.name, "Revision-safe run");

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const rejected = await fetch(`${base}/api/claim-player`, {
        method: "POST",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({ playerId: "player-2", code: "000000" }),
      });
      assert.equal(rejected.status, 400);
    }
    const rateLimited = await fetch(`${base}/api/claim-player`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ playerId: "player-2", code: "000000" }),
    });
    assert.equal(rateLimited.status, 429);
  } finally {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true });
    else server.kill("SIGTERM");
    await Promise.race([new Promise((resolve) => server.once("exit", resolve)), delay(5_000)]);
    await rm(statePath, { force: true });
    await rm(`${statePath}.tmp`, { force: true });
  }
});
