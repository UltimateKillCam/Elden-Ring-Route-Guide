# Tarnished Together

A responsive Elden Ring route planner for 2–6 players. It supports standard co-op and the PC Seamless Co-op mod.

The app includes:

- 75 builds with early, mid, late and DLC equipment;
- a 29-chapter base-game and Shadow of the Erdtree route;
- every Remembrance boss, plus Bayle;
- player-specific gear and world-progress tracking;
- level, weapon-upgrade and Scadutree Blessing targets;
- local autosave and JSON export/import.
- a controller/follower LAN mode with live read-only progress for other devices.

## Run for your local co-op group

Double-click `Start-LAN.cmd`. The launcher builds the current guide, opens the controller on this PC, and prints two read-only links for each home-network address: a complete build catalogue for choosing before the run and the live route follower. Other players do not need a ChatGPT account and cannot assign builds or change route progress.

Keep the launcher window open while playing. If Windows Firewall asks for access, allow Node.js on Private networks only. The shared expedition state is saved in the ignored `work` directory and is restored the next time the LAN host starts.

## Run locally

Node.js 22.13 or later is required.

```bash
npm install
npm run dev
```

Use `npm test` to build the site and check the content contract. Use `npm run lint` for source checks.

Game data is written for Elden Ring App/Regulation 1.16.1 and is sourced in the app's Company page. This is an unofficial fan project.
