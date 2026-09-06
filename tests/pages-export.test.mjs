import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validatePagesAssets } from "../scripts/validate-pages-export.mjs";

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
