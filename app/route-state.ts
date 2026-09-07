/** Shared checklist semantics for the route, map and overall progress. */
type ChecklistTask = { id: string; perPlayer: boolean };
type ChecklistRun = { players: { id: string }[]; completed: Record<string, boolean> };

export function checklistKeys(task: ChecklistTask, run: ChecklistRun) {
  return task.perPlayer ? run.players.map((player) => `${task.id}:${player.id}`) : [task.id];
}

export function checklistDone(task: ChecklistTask, run: ChecklistRun) {
  return Boolean(run.completed[`${task.id}:skipped`]) || checklistKeys(task, run).every((key) => run.completed[key]);
}

export function checklistProgress(tasks: ChecklistTask[], run: ChecklistRun) {
  let resolved = 0;
  let total = 0;
  for (const task of tasks) {
    const keys = checklistKeys(task, run);
    total += keys.length;
    resolved += run.completed[`${task.id}:skipped`] ? keys.length : keys.filter((key) => run.completed[key]).length;
  }
  return total ? Math.round(resolved / total * 100) : 0;
}

export function nextChapterTask<T extends ChecklistTask>(tasks: T[], run: ChecklistRun) {
  const index = tasks.findIndex((task) => !checklistDone(task, run));
  return index < 0 ? undefined : { task: tasks[index], index };
}

export function changeLevelPace<T extends { levelOffset?: number }>(run: T, levelOffset: number): T {
  return { ...run, levelOffset };
}

/** Skipping a funding fight removes its income, not just its checklist card. */
export function skipRuneBoss<T extends { runeBossSelections?: Record<string, string[]> }>(run: T, chapterId: string, bossId: string, plannedIds: string[]): T {
  const selected = run.runeBossSelections?.[chapterId] ?? plannedIds;
  return { ...run, runeBossSelections: { ...run.runeBossSelections, [chapterId]: selected.filter((id) => id !== bossId) } };
}

export function routePlanningKey(run: object | null) {
  // Browsing a chapter must not rebuild the entire party's equipment and rune plan.
  return run ? JSON.stringify({ ...run, activeChapterId: undefined }) : "";
}

export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function matchesSearch(index: string, query: string) {
  return normalizeSearch(query).split(/\s+/).every((word) => index.includes(word));
}

/** Filters only the visible list. Route order, gating and the next step stay intact. */
export function matchesRouteTask(task: { label: string; detail: string; scope?: string; playerId?: string; perPlayer: boolean }, query: string, playerId: string) {
  const forPlayer = !playerId || task.perPlayer || !task.playerId || task.playerId === playerId;
  return forPlayer && matchesSearch(normalizeSearch(`${task.label} ${task.detail} ${task.scope ?? ""}`), query);
}

export function cataloguePage<T>(items: T[], requestedPage: number, pageSize = 24) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.max(0, Math.min(pages - 1, requestedPage));
  return { page, pages, items: items.slice(page * pageSize, (page + 1) * pageSize), from: items.length ? page * pageSize + 1 : 0, to: Math.min(items.length, (page + 1) * pageSize) };
}
