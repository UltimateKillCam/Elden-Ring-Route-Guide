"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { builds, chapters, itemGuides, sources, type Build, type Chapter, type PhaseKey } from "./data";

type Mode = "standard" | "seamless";
type View = "route" | "codex" | "party";
type Player = { id: string; name: string; buildId: string; color: string };
type Expedition = {
  schema: 1;
  name: string;
  mode: Mode;
  players: Player[];
  hostId: string;
  completed: Record<string, boolean>;
  createdAt: string;
};
type Task = {
  id: string;
  label: string;
  detail: string;
  kind: "objective" | "boss" | "gear" | "quest";
  playerId?: string;
  perPlayer: boolean;
  scope: string;
  item?: string;
};

const PLAYER_COLORS = ["#d8ad62", "#7db6a8", "#b987aa", "#7698c8", "#c5775e", "#a7a36c"];
const PHASE_START: Record<PhaseKey, string> = {
  early: "first-steps",
  mid: "liurnia-south",
  late: "gelmir",
  dlc: "gravesite",
};
const STORAGE_KEY = "tarnished-together-expedition-v1";

const makePlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `player-${index + 1}`,
    name: `Tarnished ${index + 1}`,
    buildId: builds[index % builds.length].id,
    color: PLAYER_COLORS[index],
  }));

const wikiUrl = (item: string) =>
  `https://eldenring.wiki.fextralife.com/${encodeURIComponent(item.replace(/ \+.*/, "").replace(/ \/.*/, ""))}`;

const inferGuide = (item: string, chapter: Chapter) => {
  const exact = Object.entries(itemGuides).find(([key]) => item.includes(key));
  if (exact) return exact[1];
  if (chapter.act === "Shadow of the Erdtree") {
    return `Acquire this during the ${chapter.region} leg. Start from ${chapter.grace}; use the item name in the linked map search, then return to the party route.`;
  }
  return `Pick this up during the ${chapter.region} sweep. Begin at ${chapter.grace}, search the exact item name on the linked map, and keep the weapon at this chapter's upgrade cap.`;
};

function tasksForChapter(chapter: Chapter, expedition: Expedition): Task[] {
  const tasks: Task[] = [];
  chapter.essentials.forEach((label, index) => {
    const isBoss = label.startsWith("Defeat");
    const isQuest = /speak|meet|quest|dialogue|decision|finish|resolve|ranni|fia|millicent|leda|ansbach|thiollier|moore|igon|varre/i.test(label);
    const individualPickup = /Sacred Tear|Golden Seed|collect|pickup|medallion|key/i.test(label);
    const perPlayer = expedition.mode === "standard" || individualPickup;
    tasks.push({
      id: `${chapter.id}-essential-${index}`,
      label,
      detail: isBoss
        ? `Fight at the end of this route segment. Target ${chapter.level} and ${chapter.upgrade}; stop upgrading once the party reaches the listed cap.`
        : `${chapter.directions} This stop protects the route from missed rewards or an unnecessary return trip.`,
      kind: isBoss ? "boss" : isQuest ? "quest" : "objective",
      perPlayer,
      scope: perPlayer ? "Each player" : expedition.mode === "seamless" ? "Shared session" : "Party",
    });
  });

  if (chapter.phase && PHASE_START[chapter.phase] === chapter.id) {
    expedition.players.forEach((player) => {
      const selected = builds.find((candidate) => candidate.id === player.buildId)!;
      const item = selected.phases[chapter.phase!];
      tasks.push({
        id: `${chapter.id}-gear-${player.id}`,
        label: `${item}`,
        detail: inferGuide(item, chapter),
        kind: "gear",
        playerId: player.id,
        perPlayer: false,
        scope: player.name,
        item,
      });
    });
  }

  if (chapter.boss && !chapter.essentials.some((entry) => entry.includes(chapter.boss!.split(",")[0]))) {
    tasks.push({
      id: `${chapter.id}-boss`,
      label: `Defeat ${chapter.boss}`,
      detail: `This is ${chapter.remembrance ? "a Remembrance encounter" : "a major encounter"}. Enter around ${chapter.level} with weapons no higher than ${chapter.upgrade}.`,
      kind: "boss",
      perPlayer: expedition.mode === "standard",
      scope: expedition.mode === "standard" ? "Repeat in each world" : "Shared boss reward",
    });
  }
  return tasks;
}

const taskKeys = (task: Task, expedition: Expedition) =>
  task.perPlayer ? expedition.players.map((player) => `${task.id}:${player.id}`) : [task.id];

const taskDone = (task: Task, expedition: Expedition) =>
  taskKeys(task, expedition).every((key) => expedition.completed[key]);

function Setup({ onCreate, imported }: { onCreate: (expedition: Expedition) => void; imported: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [mode, setMode] = useState<Mode>("standard");
  const [count, setCount] = useState(2);
  const [name, setName] = useState("Our path to the Elden Ring");
  const [players, setPlayers] = useState<Player[]>(makePlayers(2));

  const changeCount = (value: number) => {
    setCount(value);
    setPlayers((current) => {
      if (value > current.length) return [...current, ...makePlayers(value).slice(current.length)];
      return current.slice(0, value);
    });
  };

  const updatePlayer = (index: number, patch: Partial<Player>) => {
    setPlayers((current) => current.map((player, playerIndex) => (playerIndex === index ? { ...player, ...patch } : player)));
  };

  return (
    <main className="setup-shell">
      <div className="setup-ornament" aria-hidden="true"><span /><i /><span /></div>
      <section className="setup-copy">
        <p className="eyebrow">A co-op route planner for Elden Ring</p>
        <h1>Tarnished<br /><em>Together</em></h1>
        <p className="lede">Plan a 2–6 player run through the base game and Shadow of the Erdtree. The route assigns gear, bosses, quests and upgrades at an appropriate level.</p>
        <div className="feature-line">
          <span>75 evolving builds</span><span>Base game + Erdtree</span><span>Local & private</span>
        </div>
      </section>

      <section className="setup-card" aria-label="Create an expedition">
        <div className="step-kicker">New expedition</div>
        <label className="field-label" htmlFor="expedition-name">Name your run</label>
        <input id="expedition-name" className="text-input" value={name} onChange={(event) => setName(event.target.value)} />

        <fieldset className="mode-field">
          <legend className="field-label">How are you playing?</legend>
          <button className={mode === "standard" ? "mode-option selected" : "mode-option"} onClick={() => setMode("standard")} type="button">
            <span className="mode-mark">PS</span><span><strong>Standard co-op</strong><small>PC & PlayStation · repeat world progress</small></span>
          </button>
          <button className={mode === "seamless" ? "mode-option selected" : "mode-option"} onClick={() => setMode("seamless")} type="button">
            <span className="mode-mark">∞</span><span><strong>Seamless Co-op</strong><small>PC mod · host-aware shared progress</small></span>
          </button>
        </fieldset>

        <div className="party-count">
          <span className="field-label">Company size</span>
          <div className="segmented" role="group" aria-label="Company size">
            {[2, 3, 4, 5, 6].map((size) => <button type="button" className={count === size ? "active" : ""} key={size} onClick={() => changeCount(size)}>{size}</button>)}
          </div>
        </div>

        <div className="setup-players">
          {players.map((player, index) => (
            <div className="setup-player" key={player.id} style={{ "--player": player.color } as React.CSSProperties}>
              <span className="player-rune">{index + 1}</span>
              <input aria-label={`Player ${index + 1} name`} value={player.name} onChange={(event) => updatePlayer(index, { name: event.target.value })} />
              <select aria-label={`${player.name} build`} value={player.buildId} onChange={(event) => updatePlayer(index, { buildId: event.target.value })}>
                {builds.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
              </select>
            </div>
          ))}
        </div>

        <button className="forge-button" type="button" onClick={() => onCreate({ schema: 1, name: name.trim() || "Untitled expedition", mode, players, hostId: players[0].id, completed: {}, createdAt: new Date().toISOString() })}>
          Generate route <span>→</span>
        </button>
        <label className="import-link">Or import a shared expedition<input type="file" accept="application/json" onChange={imported} /></label>
      </section>
      <p className="setup-note">Unofficial fan companion · full spoilers · data baseline 1.16.1</p>
    </main>
  );
}

function MapPanel({ chapter, expedition, onSelect }: { chapter: Chapter; expedition: Expedition; onSelect: (id: string) => void }) {
  const actChapters = chapters.filter((candidate) => candidate.act === chapter.act);
  return (
    <div className={`route-map ${chapter.act === "Shadow of the Erdtree" ? "shadow-map" : "lands-map"}`}>
      <div className="terrain terrain-a" /><div className="terrain terrain-b" /><div className="terrain terrain-c" />
      <div className="map-title"><span>{chapter.act === "Base game" ? "The Lands Between" : "Realm of Shadow"}</span><small>Route overview</small></div>
      {actChapters.map((pin) => {
        const tasks = tasksForChapter(pin, expedition);
        const done = tasks.every((task) => taskDone(task, expedition));
        return (
          <button
            type="button"
            aria-label={`${pin.title}${done ? ", complete" : ""}`}
            title={pin.title}
            onClick={() => onSelect(pin.id)}
            className={`map-pin ${pin.id === chapter.id ? "current" : ""} ${done ? "done" : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            key={pin.id}
          ><span>{actChapters.indexOf(pin) + 1}</span></button>
        );
      })}
      <div className="map-compass" aria-hidden="true">N<span>✦</span></div>
      <div className="map-current"><span>Current region</span><strong>{chapter.region}</strong><small>from {chapter.grace}</small></div>
    </div>
  );
}

function RouteView({ expedition, setExpedition, activeId, setActiveId }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; activeId: string; setActiveId: (id: string) => void }) {
  const chapter = chapters.find((candidate) => candidate.id === activeId) || chapters[0];
  const tasks = tasksForChapter(chapter, expedition);
  const completedTasks = tasks.filter((task) => taskDone(task, expedition)).length;
  const chapterIndex = chapters.indexOf(chapter);

  const toggle = (key: string) => {
    setExpedition((current) => current ? { ...current, completed: { ...current.completed, [key]: !current.completed[key] } } : current);
  };

  const goNextIncomplete = () => {
    const next = chapters.find((candidate, index) => index > chapterIndex && !tasksForChapter(candidate, expedition).every((task) => taskDone(task, expedition)));
    if (next) setActiveId(next.id);
  };

  return (
    <div className="route-layout">
      <aside className="chapter-rail" aria-label="Route chapters">
        <div className="rail-heading"><span>Journey</span><strong>{chapters.filter((candidate) => candidate.act === "Base game").length + 1} chapters</strong></div>
        {(["Base game", "Shadow of the Erdtree"] as const).map((act) => (
          <div key={act} className="act-group">
            <p>{act}</p>
            {chapters.filter((candidate) => candidate.act === act).map((candidate) => {
              const candidateTasks = tasksForChapter(candidate, expedition);
              const done = candidateTasks.every((task) => taskDone(task, expedition));
              const current = candidate.id === chapter.id;
              return <button type="button" onClick={() => setActiveId(candidate.id)} className={`${current ? "active" : ""} ${done ? "done" : ""}`} key={candidate.id}><i>{done ? "✓" : chapters.indexOf(candidate) + 1}</i><span><strong>{candidate.title}</strong><small>{candidate.region}</small></span></button>;
            })}
          </div>
        ))}
      </aside>

      <section className="route-main">
        <div className="chapter-hero">
          <div>
            <p className="eyebrow">Chapter {chapterIndex + 1} · {chapter.act}</p>
            <h2>{chapter.title}</h2>
            <p>{chapter.summary}</p>
          </div>
          <div className="readiness-seal"><span>{completedTasks}/{tasks.length}</span><small>objectives</small></div>
        </div>

        <div className="balance-bar">
          <div><span>Rune level</span><strong>{chapter.level}</strong></div>
          <div><span>Weapon ceiling</span><strong>{chapter.upgrade}</strong></div>
          {chapter.blessing && <div><span>Blessing target</span><strong>{chapter.blessing}</strong></div>}
          <div><span>Begin from</span><strong>{chapter.grace}</strong></div>
        </div>

        <MapPanel chapter={chapter} expedition={expedition} onSelect={setActiveId} />

        <div className="objectives-heading"><div><p className="eyebrow">Ordered stops</p><h3>Do these before moving on</h3></div><span>{Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% complete</span></div>
        <div className="task-list">
          {tasks.map((task, index) => {
            const owner = task.playerId ? expedition.players.find((player) => player.id === task.playerId) : undefined;
            const done = taskDone(task, expedition);
            return (
              <article className={`task-card ${done ? "complete" : ""}`} key={task.id} style={owner ? { "--player": owner.color } as React.CSSProperties : undefined}>
                <div className="task-index">{done ? "✓" : String(index + 1).padStart(2, "0")}</div>
                <div className="task-body">
                  <div className="task-meta"><span className={`kind ${task.kind}`}>{task.kind}</span><span className="scope">{task.scope}</span></div>
                  <h4>{task.label}</h4>
                  <p>{task.detail}</p>
                  {task.item && <div className="task-links"><a href={wikiUrl(task.item)} target="_blank" rel="noreferrer">Item reference ↗</a><a href="https://mapgenie.io/elden-ring" target="_blank" rel="noreferrer">Search on map ↗</a></div>}
                  {task.perPlayer ? (
                    <div className="player-checks">
                      {expedition.players.map((player) => {
                        const key = `${task.id}:${player.id}`;
                        return <button type="button" key={key} className={expedition.completed[key] ? "checked" : ""} onClick={() => toggle(key)} style={{ "--player": player.color } as React.CSSProperties}><i>{expedition.completed[key] ? "✓" : ""}</i>{player.name}</button>;
                      })}
                    </div>
                  ) : (
                    <button type="button" className="complete-button" onClick={() => toggle(task.id)}><i>{done ? "✓" : ""}</i>{done ? "Completed" : "Mark complete"}</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="chapter-nav">
          <button type="button" disabled={chapterIndex === 0} onClick={() => setActiveId(chapters[chapterIndex - 1].id)}>← Previous chapter</button>
          <button type="button" className="primary" disabled={chapterIndex === chapters.length - 1} onClick={goNextIncomplete}>Next unfinished chapter →</button>
        </div>
      </section>

      <aside className="company-panel">
        <p className="eyebrow">Your company</p>
        {expedition.players.map((player) => {
          const selected = builds.find((candidate) => candidate.id === player.buildId)!;
          const phase = chapter.act === "Shadow of the Erdtree" ? "dlc" : chapterIndex < 3 ? "early" : chapterIndex < 9 ? "mid" : "late";
          return <div className="company-member" key={player.id} style={{ "--player": player.color } as React.CSSProperties}><span>{player.name.slice(0, 1).toUpperCase()}</span><div><strong>{player.name}</strong><small>{selected.name}</small><p>{selected.phases[phase]}</p></div></div>;
        })}
        <div className="mode-note"><strong>{expedition.mode === "standard" ? "Standard co-op rules" : "Seamless rules"}</strong><p>{expedition.mode === "standard" ? "World-state steps are tracked for every player. Rotate hosts and tick each copy." : "The route follows host progression. Individual pickups remain assigned separately."}</p></div>
      </aside>
    </div>
  );
}

function CodexView({ expedition, setExpedition }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>> }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All roles");
  const [selected, setSelected] = useState<Build | null>(null);
  const roles = ["All roles", ...Array.from(new Set(builds.map((candidate) => candidate.role))).sort()];
  const filtered = builds.filter((candidate) => {
    const haystack = `${candidate.name} ${candidate.stats} ${candidate.role} ${candidate.tags.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (role === "All roles" || candidate.role === role);
  });

  const assign = (playerId: string, buildId: string) => setExpedition((current) => current ? { ...current, players: current.players.map((player) => player.id === playerId ? { ...player, buildId } : player) } : current);

  return (
    <section className="codex-page">
      <div className="page-heading"><div><p className="eyebrow">75 paths · four stages each</p><h2>Build codex</h2><p>Each build has early, mid, late and DLC gear. The routes avoid long farms and the most overpowering setups.</p></div><div className="codex-count"><strong>{filtered.length}</strong><span>builds shown</span></div></div>
      <div className="codex-tools"><label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Frost, bow, faith…" /></label><label><span>Party role</span><select value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((option) => <option key={option}>{option}</option>)}</select></label></div>
      <div className="build-grid">
        {filtered.map((candidate) => {
          const owners = expedition.players.filter((player) => player.buildId === candidate.id);
          return <article className="build-card" key={candidate.id} onClick={() => setSelected(candidate)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelected(candidate); }}>
            <div className="build-card-top"><span className="build-number">{String(builds.indexOf(candidate) + 1).padStart(2, "0")}</span><div className="difficulty"><i />{candidate.complexity}</div></div>
            <h3>{candidate.name}</h3><p className="stats">{candidate.stats} · {candidate.role}</p><p>{candidate.playstyle}</p>
            <div className="mini-phases"><span>{candidate.phases.early}</span><i>→</i><span>{candidate.phases.dlc}</span></div>
            <div className="tag-row">{candidate.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            {owners.length > 0 && <div className="owners">Chosen by {owners.map((owner) => owner.name).join(", ")}</div>}
            <button type="button">Inspect build <span>↗</span></button>
          </article>;
        })}
      </div>

      {selected && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}><aside className="build-drawer" aria-modal="true" role="dialog"><button className="drawer-close" onClick={() => setSelected(null)} aria-label="Close build detail">×</button><p className="eyebrow">Build {builds.indexOf(selected) + 1} of 75</p><h2>{selected.name}</h2><div className="drawer-meta"><span>{selected.stats}</span><span>{selected.role}</span><span>{selected.complexity}</span></div><p className="drawer-playstyle">{selected.playstyle}</p>{selected.quest && <div className="quest-callout"><strong>Quest dependency</strong><span>{selected.quest}</span></div>}<div className="phase-list">{(["early", "mid", "late", "dlc"] as PhaseKey[]).map((phase, index) => <div key={phase}><i>{index + 1}</i><span><small>{phase === "dlc" ? "Shadow of the Erdtree" : `${phase} game`}</small><strong>{selected.phases[phase]}</strong><p>{phase === "early" ? "Core identity comes online with minimal travel." : phase === "mid" ? "A meaningful weapon or mechanic change at the Liurnia–Altus tier." : phase === "late" ? "Base-game form at endgame upgrade caps." : "Final expression using Realm of Shadow equipment."}</p></span></div>)}</div><label className="assign-label">Assign this build<select defaultValue="" onChange={(event) => { if (event.target.value) assign(event.target.value, selected.id); }}><option value="">Choose a player…</option>{expedition.players.map((player) => <option value={player.id} key={player.id}>{player.name}</option>)}</select></label></aside></div>}
    </section>
  );
}

function PartyView({ expedition, setExpedition, onExport, onImport, onReset }: { expedition: Expedition; setExpedition: React.Dispatch<React.SetStateAction<Expedition | null>>; onExport: () => void; onImport: (event: React.ChangeEvent<HTMLInputElement>) => void; onReset: () => void }) {
  const totalKeys = chapters.flatMap((chapter) => tasksForChapter(chapter, expedition)).flatMap((task) => taskKeys(task, expedition));
  const completed = totalKeys.filter((key) => expedition.completed[key]).length;
  const updatePlayer = (id: string, patch: Partial<Player>) => setExpedition((current) => current ? { ...current, players: current.players.map((player) => player.id === id ? { ...player, ...patch } : player) } : current);
  return <section className="party-page"><div className="page-heading"><div><p className="eyebrow">Expedition management</p><h2>{expedition.name}</h2><p>{expedition.mode === "standard" ? "Standard co-op across independent worlds" : "Seamless Co-op with host-led progression"}</p></div><div className="progress-medallion"><strong>{Math.round((completed / Math.max(totalKeys.length, 1)) * 100)}%</strong><span>route complete</span></div></div>
    <div className="party-cards">{expedition.players.map((player, index) => { const selected = builds.find((candidate) => candidate.id === player.buildId)!; return <article key={player.id} style={{ "--player": player.color } as React.CSSProperties}><div className="portrait">{player.name.slice(0, 1).toUpperCase()}</div><div className="party-card-head"><input value={player.name} onChange={(event) => updatePlayer(player.id, { name: event.target.value })} /><span>Player {index + 1}</span></div><select value={player.buildId} onChange={(event) => updatePlayer(player.id, { buildId: event.target.value })}>{builds.map((candidate) => <option value={candidate.id} key={candidate.id}>{candidate.name}</option>)}</select><p>{selected.playstyle}</p><div className="party-stats"><span><small>Focus</small>{selected.stats}</span><span><small>Role</small>{selected.role}</span></div><label className="host-radio"><input type="radio" name="host" checked={expedition.hostId === player.id} onChange={() => setExpedition((current) => current ? { ...current, hostId: player.id } : current)} /> {expedition.hostId === player.id ? "Current host" : "Make host"}</label></article>; })}</div>
    <div className="save-panel"><div><p className="eyebrow">Carry the route</p><h3>Save and share</h3><p>Your progress stays on this device. Export a small expedition file to move it to another phone or share it with the company.</p></div><div className="save-actions"><button type="button" className="primary" onClick={onExport}>Export expedition</button><label>Import file<input type="file" accept="application/json" onChange={onImport} /></label><button type="button" className="danger" onClick={onReset}>Start over</button></div></div>
    <div className="source-panel"><p className="eyebrow">Reference shelf</p><h3>Sources and version</h3><p>Content baseline: App/Regulation 1.16.1, checked 1 August 2026. External references open in a new tab.</p><div>{sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer">{label}<span>↗</span></a>)}</div></div>
  </section>;
}

export default function Home() {
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>("route");
  const [activeId, setActiveId] = useState(chapters[0].id);
  const [toast, setToast] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setExpedition(JSON.parse(saved));
      } catch { localStorage.removeItem(STORAGE_KEY); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (expedition) localStorage.setItem(STORAGE_KEY, JSON.stringify(expedition));
      else localStorage.removeItem(STORAGE_KEY);
    }, 180);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [expedition, hydrated]);

  const progress = useMemo(() => {
    if (!expedition) return 0;
    const keys = chapters.flatMap((chapter) => tasksForChapter(chapter, expedition)).flatMap((task) => taskKeys(task, expedition));
    return Math.round((keys.filter((key) => expedition.completed[key]).length / Math.max(keys.length, 1)) * 100);
  }, [expedition]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.schema !== 1 || !Array.isArray(parsed.players) || parsed.players.length < 2 || parsed.players.length > 6) throw new Error();
        setExpedition(parsed); setView("route"); notify("Expedition imported");
      } catch { notify("That expedition file is not valid"); }
    };
    reader.readAsText(file);
    event.target.value = "";
  };
  const handleExport = () => {
    if (!expedition) return;
    const blob = new Blob([JSON.stringify(expedition, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${expedition.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "expedition"}.json`; anchor.click(); URL.revokeObjectURL(url); notify("Expedition exported");
  };
  const handleReset = () => { if (window.confirm("Start a new expedition? The current local progress will be removed unless you export it first.")) { setExpedition(null); setView("route"); setActiveId(chapters[0].id); } };

  if (!hydrated) return <main className="loading-screen"><span>✦</span><p>Reading the guidance of grace…</p></main>;
  if (!expedition) return <Setup onCreate={(created) => { setExpedition(created); notify("Route created"); }} imported={handleImport} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => { setView("route"); setActiveId(chapters[0].id); }}><span>✦</span><strong>Tarnished <em>Together</em></strong></button>
        <nav aria-label="Primary"><button type="button" className={view === "route" ? "active" : ""} onClick={() => setView("route")}>Route</button><button type="button" className={view === "codex" ? "active" : ""} onClick={() => setView("codex")}>Build codex</button><button type="button" className={view === "party" ? "active" : ""} onClick={() => setView("party")}>Company</button></nav>
        <div className="top-progress"><span><i style={{ width: `${progress}%` }} /></span><strong>{progress}%</strong><button type="button" onClick={handleExport} aria-label="Export expedition">⇩</button></div>
      </header>
      {view === "route" && <RouteView expedition={expedition} setExpedition={setExpedition} activeId={activeId} setActiveId={setActiveId} />}
      {view === "codex" && <CodexView expedition={expedition} setExpedition={setExpedition} />}
      {view === "party" && <PartyView expedition={expedition} setExpedition={setExpedition} onExport={handleExport} onImport={handleImport} onReset={handleReset} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
