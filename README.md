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
- public co-op rooms where GitHub Pages users join with a six-digit code and choose their own build and starting class.

## Public co-op rooms

Public rooms use the dedicated Cloudflare Worker in `worker/public-session-worker.ts` and the D1 schema in `db/schema.ts`. The production binding is declared in `wrangler.sessions.jsonc`. After authenticating Wrangler, apply and deploy it with:

```bash
npm run db:migrate:sessions
npm run deploy:sessions
```

Set the GitHub repository variable `SESSION_API_BASE` to the resulting `workers.dev` origin.

The Pages workflow exposes that origin as `NEXT_PUBLIC_SESSION_API_BASE`. Standard or Seamless Co-op creates a 24-hour room immediately and shows its code during setup. A joining player enters the code at the top of the Pages app, reserves an open slot, and chooses a build and one of the ten base-game starting classes. Host and guest tokens are stored only in their respective browsers; D1 stores token hashes.

## Run for your local co-op group

Double-click [`desktop\\runtime\\Tarnished Together.exe`](desktop/runtime/Tarnished%20Together.exe) for the desktop application, or use `Start-LAN.cmd` for the terminal launcher. Both start the same local server and show one network address plus a six-digit join code. Other players do not need a ChatGPT account or a special URL. Each follower chooses their character, can browse every chapter and can update only that character’s pickups, rune, level, stat and weapon checkpoints; the controller retains shared boss, quest, build and route control.

Use the address shown in the desktop app or under **Home network links**, then enter the displayed join code. Addresses under **Other network adapters** are normally VPN or virtual-machine adapters and should not be sent to another computer on your Wi-Fi.

If the correct `192.168.x.x` or `10.x.x.x` link still times out, double-click `Allow-LAN-Through-Firewall.cmd`, approve the Windows prompt, and try again. It opens only TCP port 8787 on Private networks.

Keep the launcher window open while playing. If Windows Firewall asks for access, allow Node.js on Private networks only. The shared expedition state is saved in the ignored `work` directory and is restored the next time the LAN host starts.

### Using the route

- The next-step card and map belong to the chapter you are viewing. Use **Show on map**
  on any step to preview it, or **Follow next step** to return to the current objective.
- Open **Start-of-chapter checkpoint** on arrival, before spending runes. Update your
  current stats and weapon level, and enter held runes. Previously entered stats carry
  forward; held runes do not.
- Press **Enter** or leave a checkpoint field to save it; **Escape** cancels the edit.
  Blank, fractional and out-of-range values are rejected instead of silently changed.
  Enter both RL and held runes to use that balance in place of projected lifetime
  income. Assigned optional-boss rewards are included only as a planned top-up;
  complete those fights before spending that portion of the budget. Reinforcement
  service fees remain weapon-specific and are shown separately at the smith.
- A different weapon starts its upgrade budget at +0. Affinity changes on the same
  weapon retain the recorded reinforcement level.
- In the checkpoint, expand **Add another rune boss** to compare fights by reward,
  suggested level, difficulty and location. Add, replace or skip a fight there to
  recalculate its contribution to the budget. Harder alternatives are manual choices;
  they are not automatically added to cover a shortfall. Select only uncleared bosses.
- **Skip rune boss** also works directly on the current route card. It removes the
  expected reward and recalculates affordable levels and upgrades; it does not mark
  an unbeaten boss complete. Use the checkpoint to add the fight back later.
- Weapon upgrades now have **Collect / Buy** cards before the smith visit. Each lists
  the assigned player and weapon, stone tier and quantity, location, directions and
  purchase price where applicable. Check inventory first and only obtain the missing
  amount; mark the card complete if you already have it. Unlimited shops require their
  bell-bearing step first. Ancient stones and other finite sources are not reusable.
- Supply planning covers the route's active primary weapon, including replacement
  weapons and Somber reinforcement. If verified stock cannot reach the guide target,
  the checkpoint explains the lower supplied target instead of inventing stock. It
  does not read your inventory or track spending on additional off-hand weapons.
- Locked chapters list missing prerequisites. Select one to open its chapter and
  focus the required step; this does not mark it complete.
- **Hide finished** hides completed and skipped cards. Optional detours can be restored
  later, and changing the level pace preserves existing progress.
- Followers can turn off **Follow host’s chapter** to browse independently. Checklist
  changes still arrive automatically.
- Catalogues show 24 builds per page. Search works across equipment names and ignores
  punctuation and word order. Weapon previews show the route's actual chapter
  transitions rather than every source-guide alternative.
- If browser saves cannot be read, download the recovery backup before importing a
  valid run export. The recovery file preserves the original data for repair.

## Run locally

Node.js 22.13 or later is required.

```bash
npm install
npm run dev
```

The development preview uses Node without the Cloudflare emulator. Use
`npm run dev:cloud` only when developing the hosted Worker integration. Production
builds retain the hosted configuration; the desktop/LAN launchers are unchanged.

Use `npm test` to build the site and check the content contract. Use `npm run lint` for source checks.

### Publishing updates

Push tested source to `main` to run the GitHub Pages deployment. The export validates
the repository base path and confirms every referenced script/style asset exists.
Its `deployment.json` records the published commit, so a completed upload can be
checked against the live site rather than inferred from a successful push.

The public join-code service is a separate Worker. When build IDs, starting classes
or session validation change, deploy it with `npm run deploy:sessions` as well;
otherwise a newer Pages catalogue can be rejected by an older room service.

Numeric game data is locally verified against Elden Ring App/Regulation 1.17, checked 1 September 2026, and is sourced in the app's Company page. The Tarnished Pack's two origins, eight armaments, four armour sets and two altered variants are included. This is an unofficial fan project.
