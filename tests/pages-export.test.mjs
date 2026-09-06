import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validatePagesAssets } from "../scripts/validate-pages-export.mjs";
import { prefixHostedFontPaths, pagesFontPaths } from "../build/pages-font-paths.ts";

test("Pages validation rejects missing assets and root paths on a repository site", async () => {
  const directory = await mkdtemp(join(tmpdir(), "tarnished-pages-test-"));
  try {
    await mkdir(join(directory, "assets"));
    await writeFile(join(directory, "assets", "app.js"), "export {};");
    await writeFile(join(directory, "assets", "app.css"), "body { color: white; }");
    const html = '<script src="/guide/assets/app.js"></script><link href="/guide/assets/app.css" rel="stylesheet">';
    assert.equal((await validatePagesAssets(html, directory, "/guide")).length, 2);
    await assert.rejects(validatePagesAssets(html.replace("/guide/assets/app.js", "/assets/app.js"), directory, "/guide"), /base path/);
    await assert.rejects(validatePagesAssets(html.replace("app.css", "missing.css"), directory, "/guide"), /Missing or empty/);
    await assert.rejects(validatePagesAssets('<html>Loading</html>', directory, "/guide"), /JavaScript and stylesheet/);
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("Pages font fix covers injected CSS without changing local or external URLs", () => {
  const css = 'src:url(/assets/_vinext_fonts/geist/test.woff2); preload="/assets/_vinext_fonts/mono/test.woff2"; external="https://example.com/assets/_vinext_fonts/other.woff2"';
  const fixed = prefixHostedFontPaths(css, "/Elden-Ring-Route-Guide");
  assert.match(fixed, /url\(\/Elden-Ring-Route-Guide\/assets\//);
  assert.match(fixed, /preload="\/Elden-Ring-Route-Guide\/assets\//);
  assert.match(fixed, /https:\/\/example.com\/assets\//);
  assert.equal(prefixHostedFontPaths(fixed, "/Elden-Ring-Route-Guide"), fixed);
  assert.equal(prefixHostedFontPaths(css, ""), css);
  const plugin = pagesFontPaths("/guide");
  assert.match(plugin.transform(css, "/repo/app/layout.tsx").code, /\/guide\/assets\//);
  assert.equal(plugin.transform(css, "/repo/node_modules/dependency.js"), null);
});
