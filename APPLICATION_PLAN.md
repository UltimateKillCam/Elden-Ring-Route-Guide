# Tarnished Together — application plan

Status: implemented and under continuous content verification.

## 1. Product decision

Build a responsive companion web application named **Tarnished Together**. It will work on desktop beside a PC session and on a phone or tablet beside a PlayStation session. No game integration is required, so the same planner works for standard multiplayer and the PC Seamless Co-op mod.

The experience is a guided expedition rather than a database: create a party, choose 2–6 builds, and receive one balanced route that says what to do next, where it is, who receives each item, which steps each player must repeat, and why the stop belongs at that point in progression.

## 2. Verified scope baseline

- Locally verified content baseline: Elden Ring App/Regulation **1.17**, checked 1 September 2026.
- The Tarnished Pack's two starting classes, eight armaments, four armour sets and two altered variants are represented. Its invasion events and cosmetic Torrent customisations remain outside the build planner's route scope.
- Base-game route: all 15 Remembrance bosses, required intermediate bosses, selected-build quests, important missables, Elden Beast, then DLC.
- DLC route: all 10 Remembrance bosses plus Bayle and required intermediate encounters.
- DLC access is gated behind Starscourge Radahn and Mohg, Lord of Blood.
- Scadutree Blessing is treated as the DLC's main balance gate because it raises attack power and damage negation only in the Realm of Shadow.

## 3. The 25 additions to the supplied build catalogue

These are the additional lanes to take the catalogue from 50 to 75. Exact stat cards, upgrade levels, locations, and quest dependencies will be encoded during the content phase.

1. **Stormbound Vanguard** — STR/DEX: Longsword with Storm Blade → Banished Knight's Halberd → Stormhawk Axe → Greatsword of Solitude. Mobile mid-range pressure and dependable stance damage.
2. **Frostflail Astronomer** — DEX/INT: Flail with Cold affinity → Frozen Needle → Bastard's Stars → Chilling Perfume Bottle. Frost control that evolves from melee into explosive spell-like attacks.
3. **Dryleaf Disciple** — STR/DEX: Caestus → Katar → Star Fist → Dryleaf Arts or Dane's Footwork. A light-load martial artist built around Endure, counters, and stance breaks.
4. **Smithscript Arsenalist** — quality: Spear with Spectral Lance and throwing consumables → Jar Cannon → Pulley Crossbow → Smithscript Dagger, Cirque, and Spear. A flexible ranged toolkit rather than a single-weapon build.
5. **Golden Retaliation Captain** — STR/FAI: Sacred straight sword and heater shield → Discus of Light → Erdtree Greatshield → Smithscript Shield. Bounces the character's own holy discs back as shield projectiles.
6. **Nightblade Fencer** — DEX: Estoc → Ornamental Straight Sword → Nox Flowing Sword → Sword of Night. Fast duelling, feints, and guard-piercing weapon skills.
7. **Twinblade Blood Dancer** — DEX/ARC: Twinblade → Eleonora's Poleblade → Blood Godskin Peeler → Falx. Mobile multihit pressure without relying on dual jump-attack spam.
8. **Bonebow Beastmaster** — DEX/ARC: Shortbow → Serpent Bow → Pulley Bow → Bone Bow. Status arrows early and summoned-spirit volleys in the DLC.
9. **Full Moon Artillerist** — DEX/INT: Light Crossbow → Full Moon Crossbow → Jar Cannon → Rabbath's Cannon. A deliberate ranged build using bolts, pots, and a melee sidearm.
10. **Ice-Lightning Dragoon** — STR/DEX: Short Spear → Dragon Halberd → Dragonscale Blade → Death Knight's Twin Axes. A frost-lightning skirmisher with several distinct movesets.
11. **Eochaid Drill Knight** — STR/ARC: Broadsword → Regalia of Eochaid → Marais Executioner's Sword → Putrescence Cleaver. Charged corkscrew attacks give way to a mobile frost/arcane finisher.
12. **Finger Oracle** — STR/INT/FAI, one late respec: Club and mixed catalysts → Ringed Finger → Prince of Death's Staff → Staff of the Great Beyond and Gazing Finger. The principal viable novelty build.
13. **Golden Order Liturgist** — INT/FAI: Sacred Blade weapon → Golden Order Seal and Discus of Light → Golden Order Greatsword → Leda's Sword. Ranged holy support with a strong melee fallback.
14. **Roar of the First Lord** — STR: Highland Axe → Grafted Blade Greatsword → Axe of Godfrey → Greatsword of Radahn (Lord). Charged heavies, roars, and hyper-armour rather than repeated weapon-skill spam.
15. **Bloodfiend Juggernaut** — STR/ARC: Club → Rusted Anchor → Blood or Occult Great Stars → Bloodfiend's Arm. Powerful but capped by delayed acquisition and upgrade limits.
16. **Ghostflame Hexer** — INT/FAI: Glintstone staff and Magic sword → Death's Poker → Helphen's Steeple and death sorceries → Spirit Glaive with putrescence sorceries. Area control and frost rather than pure beam casting.
17. **Storm-Painter Perfumer** — DEX/FAI: Erdsteel Dagger and fire pots → lightning incantations and Spark Aromatic → Bolt of Gransax → Lightning Perfume Bottle. Alternates precise thrusts with wide elemental clouds.
18. **Venom Alchemist** — DEX/ARC: Dagger with Poisonous Mist → Coil Shield and Serpent Bow → Venomous Fang → Deadly Poison Perfume Bottle. Uses poison as pressure while keeping a physical backup for immune enemies.
19. **Destined Death Templar** — STR/FAI: Winged Scythe → Black Knife → Maliketh's Black Blade → Greatsword of Damnation. Health reduction, holy/fire damage, and a deliberate late respec.
20. **Grafted Scion** — quality with one late respec: Battle Axe → Grafted Dragon → Axe of Godrick → Greatsword of Radahn (Light). A Remembrance-trophy build that changes combat identity after each major lord.
21. **Torch Saint** — DEX/FAI: Steel-Wire Torch and spear → Sentry's Torch → St. Trina's Torch → Nanaya's Torch. A viable novelty route with a conventional Flame Art sidearm for resistant bosses.
22. **Blue Dancer Ascetic** — DEX: Shamshir at very low equipment load → Katar → Ornamental Straight Sword → Pata. Rewards spacing and low weight rather than armour or status stacking.
23. **Trollsmith Thrower** — STR: Large Club → Brick Hammer → Giant-Crusher → Smithscript Greathammer. Classic charged-heavy play that gains a thrown heavy attack in the DLC.
24. **Glintblade Countermage** — DEX/INT: Magic Rapier and Carian Retaliation shield → Carian Knight's Sword → Glintstone Kris → Carian Sorcery Sword. Parries spells and converts openings into magic criticals.
25. **Greatbow Dragonslayer** — STR/DEX: Longbow → Erdtree Greatbow → Lion Greatbow → Igon's Greatbow. A co-op back-line siege archer with a lightweight melee backup.

During implementation, these additions will be checked for non-random acquisition, quest conflicts, minimum requirements, affinity availability, and patch-appropriate balance. A build that fails those checks will be adjusted before it enters the selectable catalogue.

## 4. Main user journey

1. **Create expedition** — choose Standard Co-op or Seamless Co-op, enter 2–6 player names, select experience level, and choose balance strictness.
2. **Choose builds** — searchable cards show role, damage types, complexity, early/mid/late/DLC gear, playstyle, quest burden, and possible party overlap.
3. **Review party** — warn about excessive competition for unique weapons, damage-type gaps, quest conflicts, or too many upgrade paths of the same type.
4. **Generate route** — merge the chosen build requirements with the all-Remembrance spine, important missables, flask progression, smithing access, rune opportunities, and DLC blessings.
5. **Run dashboard** — show the current objective, next three stops, expected level/upgrade band, party readiness, and a compact regional map.
6. **Complete stops** — tick shared or player-specific tasks; reveal concise directions from the nearest Site of Grace and identify the intended recipient.
7. **Export/import** — download one versioned JSON expedition file and restore it on another device.

## 5. Route and balance engine

The route generator will use dependency data, not a fixed walkthrough.

Each route node contains:

- region and sub-area;
- recommended rune-level band;
- regular and Somber upgrade caps;
- prerequisites and unlocks;
- map position and nearest Site of Grace;
- acquisition type: pickup, shop, boss, scarab, dialogue, quest reward, or farm;
- ownership: party-wide, host-world, every player, or named player;
- quest and lockout flags;
- source links and a last-verified patch;
- short directions and a warning for irreversible choices.

Generation rules:

- Start from the all-Remembrance boss dependency graph.
- Add only the nodes required by selected builds and the agreed important-missable set.
- Group nearby objectives into regional excursions to minimise backtracking.
- Delay items from regions above the current progression tier unless they are low-power utility pickups.
- Gate regular and Somber upgrades by the current region's target range; a newly acquired weapon may be caught up to the party cap but not pushed beyond it.
- Add bell bearings when they become appropriate so replacement weapons can be upgraded without farming.
- Add ordinary rune sources only when the party is below the next area's level floor; never prescribe repetitive rune farms.
- Give Scadutree Fragment stops a blessing target per DLC chapter rather than collecting the maximum immediately.
- Detect quest collisions and order the relevant dialogue/invasion/summon choices before their lockout events.

## 6. Multiplayer-specific behaviour

**Standard co-op:** boss and quest progression belongs to the current host's world. The route will display “repeat in each world” on required bosses, quest flags, and unique pickups, with a per-player completion matrix.

**Seamless Co-op:** the current mod documentation says gameplay follows host progression, persistent boss/scarab rewards can be received by nearby players, ordinary pickups such as Golden Seeds and Sacred Tears are individual, and bell-bearing shop state is host-dependent. The planner will therefore tag each task with the exact handling rule and recommend solo completion/backups around fragile quest steps.

This distinction is part of route generation, not a footnote.

## 7. Screens and visual direction

- **Expedition setup:** cinematic dark parchment, warm gold accents, six simple player slots, and a prominent “Forge our route” action.
- **Build codex:** card grid with weapon-class silhouettes rendered through CSS/iconography, role chips, progression rail, and party-fit filters.
- **Route dashboard:** the main screen. Left side is a chapter timeline; centre is the current objective and guide; right side is the party readiness panel on desktop. On mobile these become three swipe-friendly sections.
- **Map view:** original stylised regional diagrams with terrain colour blocks and numbered pins. Each pin opens directions from a Site of Grace and an optional external exact-map/source link. No MapGenie art will be copied or hotlinked.
- **Party sheet:** each player's build stage, stats target, weapons, upgrade level, flask state, quest flags, and outstanding items.
- **Build detail:** early/mid/late/DLC tabs with playstyle, stat priority, gear swaps, spells/Ashes, and the reason each transition happens.

## 8. Local data and portability

- Browser local storage holds expeditions and preferences; no account is required.
- Autosave after every checklist change.
- Exported JSON contains a schema version, party, choices, generated route, and completion state.
- Import validates the file, previews changes, and never overwrites an existing expedition without confirmation.
- A “reset expedition” action requires explicit confirmation.

## 9. Content structure

The application data will be separated from interface code:

- `builds`: all 75 build progressions and party roles;
- `items`: weapons, catalysts, talismans, spells, Spirit Ashes, upgrade resources, and key items;
- `locations`: regions, Sites of Grace, coordinates, and directions;
- `bosses`: Remembrance and required gateway encounters;
- `quests`: steps, triggers, dependencies, lockouts, rewards, and conflicts;
- `routeNodes`: reusable objectives connected by prerequisites;
- `balanceTiers`: level, upgrade, flask, and Scadutree targets.

Every factual record will carry source URLs and a verification date so later patches can be audited without rewriting the application.

## 10. Delivery phases

### Phase A — research dataset

Normalise the supplied 50 builds, validate the 25 additions, construct the boss/quest graph, and author locations and directions for every required item. This is the largest phase because route quality depends on the data.

### Phase B — functional application

Create expedition setup, build selection, dynamic route generation, current/next objectives, player assignment, checklist state, and JSON export/import.

### Phase C — maps and complete route content

Add the regional schematic maps, every Remembrance chapter, key quest lockouts, upgrade-material stops, flask progression, and the DLC blessing curve.

### Phase D — validation and release

Test representative 2-, 4-, and 6-player parties; test both multiplayer modes; verify dependency ordering and quest conflicts; test mobile and desktop layouts; then publish a private shareable URL while retaining local functionality.

## 11. Acceptance tests

- Any combination of 2–6 builds produces a route with no missing prerequisites.
- Every required item names a recipient and provides a location, nearest grace, directions, and source.
- No build is left below the chapter's expected effectiveness, and no selected weapon exceeds the chapter's upgrade cap.
- All base-game Remembrances occur before Elden Beast; the route moves into the DLC only after Elden Beast, Radahn, and Mohg are complete.
- All DLC Remembrances and Bayle are represented in a sensible blessing-scaled order.
- Ranni's chain reaches Nokron and the Mimic Tear content without missing the Fingerslayer Blade dependency.
- Standard and Seamless modes assign repetition/ownership correctly.
- Export followed by import restores the party, generated route, and every completion flag.
- The primary route controls remain usable at phone width and with keyboard navigation.

## 12. Sources used for this plan

- Bandai Namco, [Patch Notes Version 1.16.1](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-1161)
- Bandai Namco, [Patch Notes Version 1.17](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-117)
- Bandai Namco, [How to enter the Realm of Shadow](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-enter-the-realm-of-shadow)
- Bandai Namco, [How to strengthen your character in Shadow of the Erdtree](https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-strengthen-your-character-shadow-of-the-erdtree)
- Bandai Namco, [Tarnished Pack availability and contents](https://en.bandainamcoent.eu/elden-ring/news/how-get-new-elden-ring-classes-weapons-and-torrent-skin-customizations)
- ER Seamless Co-op documentation, [Progress and item behaviour FAQ](https://ersc-docs.github.io/faq/)
- Elden Ring Progress, [progression level and upgrade bands](https://eldenringprogress.com/)
- Eldenpedia, [Ranni the Witch](https://eldenring.wiki.gg/wiki/Ranni_the_Witch)
- Eldenpedia, [Remembrances](https://eldenring.wiki.gg/wiki/Remembrances)
- MapGenie, [Elden Ring interactive map](https://mapgenie.io/elden-ring)
