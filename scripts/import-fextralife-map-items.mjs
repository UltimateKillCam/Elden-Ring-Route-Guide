import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const maps = [
  { layer: "surface", code: "mapA", file: "work/fextra-map-embed.html" },
  { layer: "underground", code: "mapB", file: "work/map-c5431314-6159-4599-9668-0ccf4e1f8e9a.html" },
  { layer: "ashen", code: "mapC", file: "work/map-96747699-d8a3-44b4-b2d6-cf6b45c579c6.html" },
  { layer: "shadow", code: "mapD", file: "work/fextra-shadow-embed.html" },
];

const usefulCategory = /weapon|shield|talisman|spell|armor|ash of war|ashes of war|spirit ashes|flask upgrades/i;
const smithingMaterial = (item) => /^(?:Somber )?(?:Ancient Dragon )?Smithing Stone/i.test(item.name);
const routeCategory = /^(locations|sites? of grace|bosses|npcs?|maps|key|key items|flask upgrades)$/i;

const plainText = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/\s+/g, " ")
  .trim();

const records = [];
const routeRecords = [];
for (const map of maps) {
  const html = await readFile(path.join(root, map.file), "utf8");
  const match = html.match(/var items = (\[.*\]);\r?\n/);
  if (!match) throw new Error(`Could not find map items in ${map.file}`);
  const items = JSON.parse(match[1]);
  for (const item of items) {
    if ((!usefulCategory.test(item.category) && !smithingMaterial(item)) || !item.name?.trim()) continue;
    records.push({
      name: item.name.trim(),
      category: item.category,
      description: plainText(item.description),
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
      description: plainText(item.description),
      layer: map.layer,
      x: Number((Number(item.y) / 256 * 100).toFixed(3)),
      y: Number((-Number(item.x) / 256 * 100).toFixed(3)),
      url: `https://eldenring.wiki.fextralife.com/Interactive+Map?id=${item.id}&code=${map.code}`,
    });
  }
}

// Separate contextually typed batches avoid TypeScript's huge-literal union limit.
function typedRecords(name, type, values) {
  let text = `export const ${name}: ${type}[] = [];\n`;
  for (let index = 0; index < values.length; index += 250) {
    text += `${name}.push(\n${JSON.stringify(values.slice(index, index + 250), null, 2).slice(2, -2)}\n);\n`;
  }
  return `${text}\n`;
}
const output = `// Generated from the Fextralife interactive-map data. Do not hand edit.\n` +
`export type MapItem = { name: string; category: string; description: string; layer: "surface" | "underground" | "ashen" | "shadow"; x: number; y: number; url: string };\n\n` +
typedRecords("mapItems", "MapItem", records) +
`export type MapRoutePoint = MapItem;\n\n` +
typedRecords("mapRoutePoints", "MapRoutePoint", routeRecords) +
`const clean = (value: string) => value.normalize("NFKD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[’‘]/g, "\'").replace(/＋/g, "+").replace(/[^a-z0-9+ ]/g, " ").replace(/\\s+/g, " ").trim();\n\n` +
`const cleanImportedDescription = (value: string) => value.replace(/\\uFFFD+/g, " ").replace(/\\s+([,.;:])/g, "$1").replace(/\\s+/g, " ").trim();\n` +
`const cleanMapItem = <T extends MapItem>(item: T): T => item.description.includes("\\uFFFD") ? { ...item, description: cleanImportedDescription(item.description) } : item;\n` +
`const searchableMapItems = mapItems.map((item) => ({ item, name: clean(item.name) })).filter(({ name }) => name.length > 3);\n` +
`const searchableRoutePoints = mapRoutePoints.map((point) => ({ point, name: clean(point.name) }));\n` +
`const mapItemSearchCache = new Map<string, MapItem[]>();\n` +
`const routePointSearchCache = new Map<string, MapRoutePoint | undefined>();\n\n` +
`export function findMapItems(value: string, preferredLayer?: MapItem["layer"], categoryPattern?: RegExp) {\n` +
`  const query = clean(value);\n` +
`  const cacheKey = [query, preferredLayer, categoryPattern?.source, categoryPattern?.flags].join("\\u0000");\n` +
`  const cached = mapItemSearchCache.get(cacheKey);\n` +
`  if (cached) return cached.slice();\n` +
`  const candidates = searchableMapItems\n` +
`    .filter(({ item }) => !categoryPattern || categoryPattern.test(item.category))\n` +
`    .filter(({ name }) => name.length > 3 && (query.includes(name) || name.includes(query)))\n` +
`    .sort((a, b) => Number(b.name === query) - Number(a.name === query) || b.name.length - a.name.length || Number(b.item.layer === preferredLayer) - Number(a.item.layer === preferredLayer));\n` +
`  const chosen: MapItem[] = [];\n` +
`  const occupied: Array<[number, number]> = [];\n` +
`  const names = new Set<string>();\n` +
`  for (const candidate of candidates) {\n` +
`    if (names.has(candidate.name)) continue;\n` +
`    const start = query.indexOf(candidate.name);\n` +
`    const end = start + candidate.name.length;\n` +
`    if (start >= 0 && occupied.some(([from, to]) => start < to && end > from)) continue;\n` +
`    chosen.push(cleanMapItem(candidate.item));\n` +
`    names.add(candidate.name);\n` +
`    if (start >= 0) occupied.push([start, end]);\n` +
`  }\n` +
`  mapItemSearchCache.set(cacheKey, chosen);\n` +
`  return chosen.slice();\n` +
`}\n\n` +
`export function findMapItem(value: string, preferredLayer?: MapItem["layer"]) {\n` +
`  return findMapItems(value, preferredLayer)[0];\n` +
`}\n\n` +
`export function findMapRoutePoint(value: string, preferredLayer?: MapItem["layer"]) {\n` +
`  const query = clean(value);\n` +
`  if (query.length < 3) return undefined;\n` +
`  const cacheKey = [query, preferredLayer].join("\\u0000");\n` +
`  if (routePointSearchCache.has(cacheKey)) return routePointSearchCache.get(cacheKey);\n` +
`  const categoryPriority = (category: string) => /locations/i.test(category) ? 0 : /grace/i.test(category) ? 1 : /boss/i.test(category) ? 2 : /npc/i.test(category) ? 3 : 4;\n` +
`  const ranked = searchableRoutePoints\n` +
`    .map(({ point, name }) => { const match = name === query ? 0 : name.startsWith(query) ? 1 : query.startsWith(name) ? 2 : name.includes(query) ? 3 : query.includes(name) ? 4 : 99; return { point, match }; })\n` +
`    .filter(({ match }) => match < 99)\n` +
`    .sort((a, b) => a.match - b.match || categoryPriority(a.point.category) - categoryPriority(b.point.category) || a.point.name.length - b.point.name.length);\n` +
`  const chosen = ranked.find(({ point }) => point.layer === preferredLayer)?.point || ranked[0]?.point;\n` +
`  const result = chosen ? cleanMapItem(chosen) : undefined;\n` +
`  routePointSearchCache.set(cacheKey, result);\n` +
`  return result;\n` +
`}\n`;

await writeFile(path.join(root, "app/map-items.ts"), output, "utf8");
console.log(`Wrote ${records.length} item locations and ${routeRecords.length} route points.`);
