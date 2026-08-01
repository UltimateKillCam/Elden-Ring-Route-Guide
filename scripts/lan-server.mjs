import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { createServer, request as httpRequest } from "node:http";
import { networkInterfaces } from "node:os";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";

const root = process.cwd();
const gatewayPort = Number(process.env.ELDEN_RING_LAN_PORT || 8787);
const appPort = Number(process.env.ELDEN_RING_APP_PORT || 4173);
const statePath = join(root, "work", "lan-expedition.json");
const clientDir = join(root, "dist", "client");
const controlToken = randomBytes(24).toString("hex");

const assetTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

let expedition = null;
let revision = 0;
let appProcess;

async function loadState() {
  try {
    const saved = JSON.parse(await readFile(statePath, "utf8"));
    expedition = saved.expedition || null;
    revision = Number(saved.revision || 0);
  } catch {
    expedition = null;
  }
}

async function saveState() {
  await mkdir(dirname(statePath), { recursive: true });
  const temporary = `${statePath}.tmp`;
  await writeFile(temporary, JSON.stringify({ revision, expedition }, null, 2), "utf8");
  await rename(temporary, statePath);
}

function startNpm(args, options) {
  if (process.platform === "win32") {
    return spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npm.cmd", ...args], options);
  }
  return spawn("npm", args, options);
}

function runNpm(args) {
  return new Promise((resolve, reject) => {
    const child = startNpm(args, { cwd: root, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`npm exited with code ${code}`)));
  });
}

async function waitForApp() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${appPort}/`);
      if (response.ok) return;
    } catch { /* Start-up is still in progress. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("The application server did not start in time.");
}

function sendJson(response, status, body) {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(text),
    "cache-control": "no-store",
  });
  response.end(text);
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) throw new Error("Request is too large");
  }
  return JSON.parse(body || "{}");
}

function validExpedition(value) {
  return value === null || (
    value && value.schema === 1 && Array.isArray(value.players) &&
    value.players.length >= 2 && value.players.length <= 6 &&
    value.completed && typeof value.completed === "object"
  );
}

async function serveClientAsset(pathname, request, response) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  const filePath = resolve(clientDir, `.${decodedPath}`);
  const relativePath = relative(clientDir, filePath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath) || !decodedPath.startsWith("/assets/")) return false;

  try {
    const file = await stat(filePath);
    if (!file.isFile()) return false;

    const extension = extname(filePath).toLowerCase();
    response.writeHead(200, {
      "content-type": assetTypes[extension] || "application/octet-stream",
      "content-length": file.size,
      "cache-control": "public, max-age=31536000, immutable",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
    return true;
  } catch {
    return false;
  }
}

function proxyToApp(request, response) {
  const headers = {
    ...request.headers,
    "x-forwarded-host": request.headers.host,
    "x-forwarded-proto": "http",
  };
  delete headers["accept-encoding"];
  const upstream = httpRequest({
    hostname: "127.0.0.1",
    port: appPort,
    method: request.method,
    path: request.url,
    headers,
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  upstream.on("error", () => sendJson(response, 502, { error: "Application server unavailable" }));
  request.pipe(upstream);
}

function localAddresses() {
  return Object.values(networkInterfaces()).flat().filter((entry) =>
    entry && entry.family === "IPv4" && !entry.internal,
  ).map((entry) => entry.address);
}

async function openController(url) {
  if (process.platform !== "win32") return;
  const opener = spawn("rundll32", ["url.dll,FileProtocolHandler", url], { detached: true, stdio: "ignore", windowsHide: true });
  opener.unref();
}

async function main() {
  console.log("Preparing the LAN guide...\n");
  await runNpm(["run", "build"]);
  await loadState();

  appProcess = startNpm(["run", "start", "--", "--host", "127.0.0.1", "--port", String(appPort)], {
    cwd: root,
    stdio: "inherit",
    windowsHide: true,
  });
  await waitForApp();

  const server = createServer(async (request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if ((request.method === "GET" || request.method === "HEAD") && await serveClientAsset(url.pathname, request, response)) {
      return;
    }
    if (url.pathname === "/api/expedition" && request.method === "GET") {
      sendJson(response, 200, { enabled: true, revision, expedition });
      return;
    }
    if (url.pathname === "/api/expedition" && request.method === "PUT") {
      if (request.headers["x-control-token"] !== controlToken) {
        sendJson(response, 403, { error: "Follower access is read-only" });
        return;
      }
      try {
        const body = await readJson(request);
        if (!validExpedition(body.expedition)) throw new Error("Invalid expedition");
        expedition = body.expedition;
        revision += 1;
        await saveState();
        sendJson(response, 200, { enabled: true, revision });
      } catch (error) {
        sendJson(response, 400, { error: error instanceof Error ? error.message : "Invalid request" });
      }
      return;
    }
    proxyToApp(request, response);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(gatewayPort, "0.0.0.0", resolve);
  });

  const controllerUrl = `http://localhost:${gatewayPort}/?control=${controlToken}`;
  const followerUrls = localAddresses().map((address) => ({
    route: `http://${address}:${gatewayPort}/?follow=1`,
    catalogue: `http://${address}:${gatewayPort}/?catalog=1`,
  }));
  console.log("\nLAN guide is running. Keep this window open while you play.\n");
  console.log(`Controller (your PC):\n  ${controllerUrl}\n`);
  console.log("Read-only links (send the pair matching your home network):");
  followerUrls.forEach((urls) => {
    console.log(`  Build catalogue: ${urls.catalogue}`);
    console.log(`  Live route:      ${urls.route}\n`);
  });
  console.log("\nIf Windows asks, allow Node.js on Private networks only. Press Ctrl+C to stop.\n");
  await openController(controllerUrl);

  const stop = () => {
    server.close();
    if (appProcess && !appProcess.killed) appProcess.kill();
    process.exit(0);
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}

main().catch((error) => {
  console.error(`\nCould not start the LAN guide: ${error.message}`);
  if (appProcess && !appProcess.killed) appProcess.kill();
  process.exit(1);
});
