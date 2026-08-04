# Tarnished Together

A responsive Elden Ring route planner for solo runs and 2–6 player groups. It supports solo play, standard co-op and the PC Seamless Co-op mod.

The app includes:

- the complete Fextralife build catalogue, curated progression builds and sourced meme/cosplay builds;
- a 29-chapter base-game and Shadow of the Erdtree route;
- every Remembrance boss, plus Bayle;
- player-specific gear and world-progress tracking;
- level, weapon-upgrade and Scadutree Blessing targets;
- multiple local autosave slots plus JSON export/import.
- a controller/follower LAN mode where each follower can browse the full route, update their own item checks and rune counters, and receive live host progress.

## Run for your local co-op group

Double-click `Start-LAN.cmd`. The launcher builds the current guide, opens the controller on this PC, and prints a complete build-catalogue link and a live route link for each home-network address. Other players do not need a ChatGPT account. Each follower chooses their character, can browse every chapter and can update only that character’s pickups and rune counters; the controller retains shared boss, quest, build and route control.

Use the links under **Home network links**. Addresses under **Other network adapters** are normally VPN or virtual-machine adapters and should not be sent to another computer on your Wi-Fi.

If the correct `192.168.x.x` or `10.x.x.x` link still times out, double-click `Allow-LAN-Through-Firewall.cmd`, approve the Windows prompt, and try again. It opens only TCP port 8787 on Private networks.

Keep the launcher window open while playing. If Windows Firewall asks for access, allow Node.js on Private networks only. The shared expedition state is saved in the ignored `work` directory and is restored the next time the LAN host starts.

## Run locally

Node.js 22.13 or later is required.

```bash
npm install
npm run dev
```

Use `npm test` to build the site and check the content contract. Use `npm run lint` for source checks.

Game data is written for Elden Ring App/Regulation 1.16.1 and is sourced in the app's Company page. This is an unofficial fan project.
