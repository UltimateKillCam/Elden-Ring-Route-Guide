# Tarnished Together

A responsive Elden Ring route planner for solo runs and 2–6 player groups. It supports solo play, standard co-op and the PC Seamless Co-op mod.

The app includes:

- the complete Fextralife build catalogue, curated progression builds and sourced meme/cosplay builds;
- a 30-chapter base-game and Shadow of the Erdtree route;
- every Remembrance boss, plus Bayle;
- per-run optional questline selection, with build-required rewards enabled automatically;
- player-specific gear and world-progress tracking;
- level, weapon-upgrade and Scadutree Blessing targets;
- multiple local autosave slots plus JSON export/import.
- a controller/follower LAN mode where each follower can browse the full route, update their own item checks and rune counters, and receive live host progress.

## Run for your local co-op group

Double-click [`desktop\\runtime\\Tarnished Together.exe`](desktop/runtime/Tarnished%20Together.exe) for the desktop application, or use `Start-LAN.cmd` for the terminal launcher. Both start the same local server and show one network address plus a six-digit join code. Other players do not need a ChatGPT account or a special URL. Each follower chooses their character, can browse every chapter and can update only that character’s pickups, rune, level, stat and weapon checkpoints; the controller retains shared boss, quest, build and route control.

Use the address shown in the desktop app or under **Home network links**, then enter the displayed join code. Addresses under **Other network adapters** are normally VPN or virtual-machine adapters and should not be sent to another computer on your Wi-Fi.

If the correct `192.168.x.x` or `10.x.x.x` link still times out, double-click `Allow-LAN-Through-Firewall.cmd`, approve the Windows prompt, and try again. It opens only TCP port 8787 on Private networks.

Keep the launcher window open while playing. If Windows Firewall asks for access, allow Node.js on Private networks only. The shared expedition state is saved in the ignored `work` directory and is restored the next time the LAN host starts.

## Run locally

Node.js 22.13 or later is required.

```bash
npm install
npm run dev
```

Use `npm test` to build the site and check the content contract. Use `npm run lint` for source checks.

Numeric game data is locally verified against Elden Ring App/Regulation 1.17, checked 1 September 2026, and is sourced in the app's Company page. The Tarnished Pack's two origins, eight armaments, four armour sets and two altered variants are included. This is an unofficial fan project.
