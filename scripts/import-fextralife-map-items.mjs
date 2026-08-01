import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const maps = [
  { layer: "surface", code: "mapA", file: "work/fextra-map-embed.html" },
  { layer: "underground", code: "mapB", file: "work/map-c5431314-6159-4599-9668-0ccf4e1f8e9a.html" },
  { layer: "ashen", code: "mapC", file: "work/map-96747699-d8a3-44b4-b2d6-cf6b45c579c6.html" },
  { layer: "shadow", code: "mapD", file: "work/fextra-shadow-embed.html" },
];

const usefulCategory = /weapon|shield|talisman|spell|armor|ash of war|ashes of war|spirit ashes/i;
const routeCategory = /^(locations|sites? of grace|bosses|npcs?|maps|key|key items|flask upgrades)$/i;

const records = [];
const routeRecords = [];
for (const map of maps) {
  const html = await readFile(path.join(root, map.file), "utf8");
  const match = html.match(/var items = (\[.*\]);\r?\n/);
  if (!match) throw new Error(`Could not find map items in ${map.file}`);
  const items = JSON.parse(match[1]);
  for (const item of items) {
    if (!usefulCategory.test(item.category) || !item.name?.trim()) continue;
    records.push({
      name: item.name.trim(),
      layer: map.layer,
      x: Number((Number(item.y) / 256 * 100).toFixed(3)),
      y: Number((-Number(item.x) / 256 * 100).toFixed(3)),
      url: `https://eldenring.wiki.fextralife.com/Interactive+Map?id=${item.id}&code=${map.code}`,
    });
  }
  for (const item of items) {
    if (!routeCategory.test(item.category) || !item.name?.trim()) continue;
    routeRecords.push({
      name: item.name.trim(),
      category: item.category,
      layer: map.layer,
      x: Number((Number(item.y) / 256 * 100).toFixed(3)),
      y: Number((-Number(item.x) / 256 * 100).toFixed(3)),
      url: `https://eldenring.wiki.fextralife.com/Interactive+Map?id=${item.id}&code=${map.code}`,
    });
  }
}

const output = `// Generated from the Fextralife interactive-map data. Do not hand edit.\n` +
`export type MapItem = { name: string; layer: "surface" | "underground" | "ashen" | "shadow"; x: number; y: number; url: string };\n\n` +
`export const mapItems: MapItem[] = ${JSON.stringify(records, null, 2)};\n\n` +
`export type MapRoutePoint = MapItem & { category: string };\n\n` +
`export const mapRoutePoints: MapRoutePoint[] = ${JSON.stringify(routeRecords, null, 2)};\n\n` +
`const clean = (value: string) => value.toLowerCase().replace(/[+＋]\\d+/g, "").replace(/[^a-z0-9' ]/g, " ").replace(/\\s+/g, " ").trim();\n\n` +
`export function findMapItem(value: string, preferredLayer?: MapItem["layer"]) {\n` +
`  const query = clean(value);\n` +
`  const matches = mapItems.filter((item) => { const name = clean(item.name); return name.length > 3 && (query.includes(name) || name.includes(query)); });\n` +
`  return matches.find((item) => item.layer === preferredLayer) || matches[0];\n` +
`}\n\n` +
`export function findMapRoutePoint(value: string, preferredLayer?: MapItem["layer"]) {\n` +
`  const query = clean(value);\n` +
`  if (query.length < 3) return undefined;\n` +
`  const categoryPriority = (category: string) => /locations/i.test(category) ? 0 : /grace/i.test(category) ? 1 : /boss/i.test(category) ? 2 : /npc/i.test(category) ? 3 : 4;\n` +
`  return mapRoutePoints\n` +
`    .map((point) => { const name = clean(point.name); const match = name === query ? 0 : name.startsWith(query) ? 1 : query.startsWith(name) ? 2 : name.includes(query) ? 3 : query.includes(name) ? 4 : 99; return { point, match }; })\n` +
`    .filter(({ point, match }) => match < 99 && (!preferredLayer || point.layer === preferredLayer))\n` +
`    .sort((a, b) => a.match - b.match || categoryPriority(a.point.category) - categoryPriority(b.point.category) || a.point.name.length - b.point.name.length)[0]?.point;\n` +
`}\n`;

await writeFile(path.join(root, "app/map-items.ts"), output, "utf8");
console.log(`Wrote ${records.length} item locations and ${routeRecords.length} route points.`);
