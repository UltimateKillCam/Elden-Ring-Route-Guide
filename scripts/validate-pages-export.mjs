import { stat } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";

/** Catch a broken repository base path or missing assets before publishing. */
export async function validatePagesAssets(html, directory, basePath = "") {
  const prefix = `${basePath.replace(/\/$/, "")}/assets/`;
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  const assets = [...new Set(references.filter((value) => value.startsWith("/") && value.includes("/assets/")))];
  if (!assets.some((value) => /\.js(?:\?|$)/.test(value)) || !assets.some((value) => /\.css(?:\?|$)/.test(value))) {
    throw new Error("Pages export must include its JavaScript and stylesheet assets.");
  }
  for (const asset of assets) {
    if (!asset.startsWith(prefix)) throw new Error(`Asset ignores the Pages base path: ${asset}`);
    const pathname = decodeURIComponent(new URL(asset, "https://pages.invalid").pathname).slice(basePath.length);
    const file = resolve(directory, `.${pathname}`);
    const localPath = relative(directory, file);
    if (localPath.startsWith("..") || isAbsolute(localPath)) throw new Error("Pages asset escapes the export directory.");
    const info = await stat(file).catch(() => undefined);
    if (!info?.isFile() || !info.size) throw new Error(`Missing or empty Pages asset: ${asset}`);
  }
  return assets;
}
