import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const clientDirectory = resolve(root, "dist/client");
const workerUrl = pathToFileURL(resolve(root, "dist/server/index.js"));
workerUrl.searchParams.set("static-export", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const basePath = (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "");
const requestPaths = basePath ? [`${basePath}/`, "/"] : ["/"];
let html = "";

for (const requestPath of requestPaths) {
  const response = await worker.fetch(
    new Request(`https://pages.invalid${requestPath}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const candidate = await response.text();
  if (response.ok && /<title>Tarnished Together \| Elden Ring Co-op Route Planner<\/title>/i.test(candidate)) {
    html = candidate;
    break;
  }
}

if (!html) throw new Error("Could not render the GitHub Pages entry document.");
if (basePath && !html.includes(`${basePath}/assets/`)) {
  throw new Error(`Static entry document does not contain the configured base path ${basePath}.`);
}
if (basePath && !html.includes(`content="${basePath}/og.png"`)) {
  throw new Error(`Static metadata does not contain the configured base path ${basePath}.`);
}

await mkdir(clientDirectory, { recursive: true });
await Promise.all([
  writeFile(resolve(clientDirectory, "index.html"), html, "utf8"),
  writeFile(resolve(clientDirectory, "404.html"), html, "utf8"),
  writeFile(resolve(clientDirectory, ".nojekyll"), "", "utf8"),
]);

console.log(`Wrote GitHub Pages export to ${clientDirectory}${basePath ? ` for ${basePath}` : ""}.`);
