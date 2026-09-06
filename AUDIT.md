# Route and data audit

## Build/path review — 6 September 2026

The live Fextralife `Build_Guides` category has 172 dedicated guide pages. All 172
were fetched and compared with the importer; no guide was missing after adding
Idus Knight Starter. The selectable catalogue now contains 203 builds. The
remaining 82 legacy experimental records are still excluded from new runs.

Added two independently published community loadouts:

- [nfroude10's Bleed Brawler](https://eip.gg/elden-ring/builds/bleed-brawler-star-fist-great-stars/):
  Heavy Star Fist/Cragblade, with the author's optional Great Stars variant omitted
  from the mandatory weapon route. Public planner record `cmq45bjpc00a8m77kdhjakfxy`.
- [Winterlion BloodFiend Arm](https://eip.gg/elden-ring/builds/winterlion-bloodfiend-arm/):
  Blood-affinity arm/Cragblade; retains the author's Stonebarb alternative instead
  of assuming an early Bloodsucking tear. Record `cmo9s9mta001qm7hf4nbucn70`.

The public planner records, not just their article descriptions, were checked for
weapons, affinity, talismans, armour, spells and attributes. These are community
builds with named sources, not an assertion that every author has optimal choices.

Changes:

- One chapter-aware weapon schedule now drives the route, equipment timeline,
  upgrade planning and selected-build summary. Inferred middle-stage bridges no
  longer force a second temporary weapon. A final weapon obtainable before its
  published level bracket can be used without an intervening weapon detour.
- Quality Knight and Colossal Hammer retain their saved IDs and four-stage paths.
  Their first weapon checkboxes retain their old completion keys.
- Every main-weapon record named in selectable phase cards now has an acquisition gate.
  Checked the missing acquisition sections against the dedicated Fextralife item
  pages: early purchases, enemy farms, quest rewards and boss drops are distinct.
  Examples include early Guardian's Swordspear farming, Magma Blade after Godskin
  Noble, Albinauric Bow in Snowfield and the Dragonbarrow Godskin Apostle reward
  being held until a later, appropriate combat tier.
- Straight/curly apostrophes, accents and map-location suffixes now resolve to the
  same item. Anvil Hammer and similar suffixed markers cannot bypass an exact gate.
- Winged/Rotten Winged Insignia, turtle, Dragoncrest and Alexander talisman
  families cannot consume two equipment slots. The shield-free Milady source
  correction removes its impossible pair. Square Off is removed from the sourced
  greatsword bridge; Carian Slicer is treated as a spell, not a weapon skill.
- Idus Knight retains its actual starting sword. Both Tarnished Pack origins are
  selectable and accepted by LAN/public session validation, with pack labels.
  [Idus Sword acquisition](https://eldenring.wiki.gg/wiki/Idus_Sword) is a southern
  Liurnia corpse for other origins, not a northern merchant purchase.

`npm run audit:sources` repeats the live catalogue comparison. `npm run audit:paths`
regenerates per-build JSON and a readable `work/build-review/BUILD-ROUTES.md` schedule.
The automated path tests visit 6,090 build/chapter combinations; they validate the
planner against its acquisition data, not against a complete in-game playthrough.

The installed regulation file's hash still matches the numeric baseline below.
No game files or player saves were modified. Quest triggers and travel instructions
are sourced from documentation; regulation parameters alone cannot prove them.

Remaining limits: combat difficulty varies with player skill and co-op scaling;
the new source guides have not all been playtested on each platform. Some published
loadouts list alternatives, and armour/weight previews still need the player's
actual equipped items. This review does not establish that every optional quest
branch or every possible NG+ equipment combination is covered.

Verified numeric-data baseline: Elden Ring App/Regulation 1.17, checked 1 September
2026. The Tarnished Pack's two origins, eight armaments, four armour sets and two
altered armour variants are represented.

## What is checked in code

- Optional questlines are selected per run. Ranni, Fia, mandatory access and every
  Remembrance remain core. Build rewards auto-enable their quest tracks and track
  dependencies are expanded automatically.
- Chapters have explicit access prerequisites. The route can be inspected early, but
  completion is disabled until the required boss, key item or world-state card is done.
- Equipment acquisition separates a harmless pickup from an enemy, boss or quest
  reward. Named exceptions hold high-difficulty rewards until their intended chapter.
- All new-run build choices cite a published build guide, apart from Quality Knight and
  Colossal Hammer, retained because an existing run uses them. The legacy experimental
  catalogue remains readable by old saves but is not assignable to a new run.
- LAN followers join a generic address with a shared six-digit code, then enter the
  host-only code for their character. An opaque HttpOnly session is bound to that player;
  the server enforces checklist/stat/rune/weapon ownership without controller access.
- The D/Gurranq selection includes all nine Deathroots, the non-lethal hostile
  checkpoint after the fourth hand-in and every numbered reward through the Ancient
  Dragon Smithing Stone.

## Local game-data verification

The installed `regulation.bin` was read without modifying the game. Its SHA-256 is
`FB4AFD25E70EFFC9F9523D3ABA89B1FB3E08B0800D8EFB9A535CAB038C5E8BBD` and its internal
version is `11701000`. Equipment, requirements, weight, reinforcement and shop data were
checked against EquipParamWeapon, EquipParamProtector, EquipParamAccessory,
EquipParamGoods, CharaInitParam, ReinforceParamWeapon and ShopLineupParam.

## Source policy

Game-state and quest ordering prefer Elden Ring wiki.gg and the official Bandai Namco
DLC-access/patch pages. Fextralife remains a build and map reference because the project
explicitly imports its published catalogue. Published build additions retain a link to
the page that supplied the loadout; a weapon location page alone is not treated as a
build source.

## Deliberate limits

The planner does not promise that every optional NPC reward can be collected in one
world: mutually exclusive choices are shown at the affected card. Map coordinates and
descriptions are guide data, while numeric equipment records are the locally verified
game-data layer. A later game patch requires rerunning the regulation audit. Tarnished
Pack invasion events and cosmetic Torrent attire are outside the build planner's route
scope; its origins and equipment are included in planning calculations.

## Verification

`npm test` typechecks and builds the production app, then covers quest state chains, map
resolution, access gates, equipment-stage continuity, importer boundaries and a live
LAN controller/follower exchange. `npm run lint` must also finish without warnings.

## Functionality review — 6 September 2026

This pass checked application behaviour and selected buff errors; it is not a new
claim that every imported guide and quest branch has been manually verified.

Fixed:

- Changing level pace no longer clears the completed checklist.
- Current-objective instructions, step numbers and the automatic map target come
  from the displayed chapter. Individual cards can be previewed on the map; advancing
  the current step returns the map to automatic following.
- Optional per-player detours have skip/restore controls. Skips resolve the same share
  of progress in the chapter, overall header and run settings.
- Checkpoints are expandable and labelled start-of-chapter. Inputs are rendered only
  when opened. Finished cards can be hidden without deleting their progress.
- The catalogue renders 24 builds per page and searches a cached equipment index.
  Search handles punctuation, accents and reordered words. All builds remain available.
- Chapter-only navigation reuses the route plan. Run settings reuse its progress
  count instead of recalculating every chapter again.
- Followers can pause host-chapter following while retaining live checklist updates.
  Background updates no longer force them out of the selected-build view.
- Build details use a native modal dialog for focus containment and Escape-to-close.
  Text and controls were enlarged, and completed cards remain legible.
- Imports are validated before replacing the active run. An unreadable browser library
  is preserved, autosaving over it is paused, and a recovery download is offered.
  A deliberately empty library no longer resurrects an old legacy run.

Buff corrections were checked against Eldenpedia:

- [Buff categories](https://eldenring.wiki.gg/wiki/Buffs): conflicting aura and weapon
  buffs appear as alternatives, not successive casts. Known buff spells whose
  requirements exceed the displayed recommended stats stay out of the casting order.
- [War Cry](https://eldenring.wiki.gg/wiki/War_Cry),
  [Barbaric Roar](https://eldenring.wiki.gg/wiki/Barbaric_Roar) and
  [Braggart's Roar](https://eldenring.wiki.gg/wiki/Skill%3A_Braggart%27s_Roar)
  are weapon buffs, not body buffs.
- [Endure](https://eldenring.wiki.gg/wiki/Skill%3A_Endure) and
  [Unseen Form](https://eldenring.wiki.gg/wiki/Unseen_Form) use the unique category.
- [Boggart](https://eldenring.wiki.gg/wiki/Blackguard) drops Iron Ball on death; it is
  not a shop purchase. The Ash pickup explains the consequence and can be skipped
  to preserve him. Generic Ash text no longer overrides sourced location descriptions.

Remaining limits: the initial JavaScript bundle still includes the large guide/map
catalogues; pagination reduces rendering work, not download size. A labelled area
fallback is not an exact item marker. Cross-device browser interaction and every
optional quest outcome still need separate end-to-end verification. Automated LAN
permission/state tests do not substitute for playing through all branches.

## Follow-up usability and budget review — 6 September 2026

Saved-run usage no longer constrains build corrections. This supersedes earlier
notes about keeping Quality Knight and Colossal Hammer unchanged. Stored saves
were not deleted as part of the code review.

- Quality Knight now follows Vagabond's Longsword into Claymore at Castle Morne,
  retaining Claymore through the DLC. The sword-and-shield baseline, starting class
  and Beast Crest Heater Shield come from
  [Samurai Gamers' Quality PvE guide](https://samurai-gamers.com/elden-ring/best-quality-builds-for-pve/).
  Claymore uses its native Lion's Claw rather than an incompatible skill suggestion.
- Colossal Hammer follows Large Club into Giant-Crusher with Cragblade, retaining
  a Strength/charged-heavy playstyle. This removes the Great Club skill conflict and
  the Anvil Hammer stat detour. Equipment choices are grounded in
  [Mobalytics' Strength guide](https://mobalytics.gg/gamebase/guides/elden-ring-strength-build).
  This is a reviewed route based on the guide, not a claim that every planning
  milestone is specified by its author.
- Setup and catalogue previews use the same weapon schedule as acquisition cards.
  A weapon replacement no longer inherits the old weapon's upgrade level merely
  because both use regular stones. An affinity change retains its level.
- Checkpoint fields hold a local draft until Enter or blur, reducing repeated route
  calculation and network updates. They validate blank, fractional and invalid
  values. Build/class and weapon-lookup caches survive ordinary progress updates.
- Recorded RL plus held runes now replace lifetime income estimates when choosing
  affordable targets. Only this chapter's planned optional-fight reward is added;
  owned reinforcement levels reduce the remaining stone budget. A lowered funded
  target is no longer mistaken for being overlevelled against the guide.
- Missing chapter prerequisites link directly to their checklist cards, with focus
  handling and current-chapter navigation labels.
- Local Node development no longer depends on starting the Cloudflare emulator.
  The Worker emulator remains available with `npm run dev:cloud`; production hosting
  and the LAN gateway configuration are retained.

Verification: production build and TypeScript checks passed; 1,140 stage cards had
zero hard failures or unresolved non-meme fields; all 68 automated route,
checkpoint, equipment, catalogue, LAN and public-session tests passed. This does not replace
a full multiplayer playthrough. Budgets still estimate unrecorded income and exclude
weapon-specific smith service fees; those limitations are stated in the UI.

## Rune-boss options and weapon supplies — 6 September 2026

- Added 25 sourced encounters from early caves through Mountaintops, Snowfield and
  the DLC. The checkpoint now provides an expandable add-boss catalogue as well as
  replacement and skip controls. Difficulty-3 fights and fights with a later local
  prerequisite are manual alternatives, not automatic income assumptions. Suggested
  levels are planner estimates; NG payouts and encounter identity come from linked
  Fextralife boss pages. DLC guidance includes Scadutree Fragment preparation.
- Regular and Somber upgrades now generate named acquisition cards with quantities,
  prices, finite/unlimited stock, source links and explicit bell-bearing prerequisites.
  A per-player allocation ledger prevents reusing finite pickups across forecast
  upgrades; limited paid merchant stock is conservatively shared for Seamless runs.
  Already-owned stones can satisfy a card. This is a route allocation, not a live
  inventory reader, and currently plans the active primary weapon only.
- Supply-aware upgrade caps avoid requiring unavailable tiers. Ancient stones remain
  finite. Shop purchases are ordered after the required bearing encounter/pickup;
  the smith card requires its supply cards to be completed first. Standard co-op
  prerequisite checks use the assigned player's own-world completion.
- Imported smithing-material markers from the existing Fextralife map exports.
  Supply pins use source IDs directly, including underground and DLC layers, rather
  than fuzzy matching repeated stone names. Roundtable shop steps show directions
  instead of inventing an overworld pin. Generated batches now typecheck without the
  previous giant-array TypeScript suppression.
- Fixed the map matcher so a shorter DLC name cannot hide the exact base-game name
  (Sword of Night versus Sword of Night and Flame).

References: [regular stone locations and shops](https://eldenring.wiki.fextralife.com/Smithing+Stones),
[Somber stones](https://eldenring.wiki.fextralife.com/Somber+Smithing+Stones),
[Iji stock](https://eldenring.wiki.fextralife.com/War+Counselor+Iji),
[Ancient Dragon stones](https://eldenring.wiki.fextralife.com/Ancient+Dragon+Smithing+Stone),
[Somber Ancient stones](https://eldenring.wiki.fextralife.com/Somber+Ancient+Dragon+Smithing+Stone).
Individual boss pages and precise material-marker links are recorded alongside
the data. Directions are paraphrased; mine counts use the lower figure where the
cached map and item guide disagree. Smith service fees remain an additional cost.

Verification: the production build, TypeScript check and 1,140-card build audit
passed. All 73 tests in the full suite passed, followed by two additional passing
checks for complete-route material prerequisites and honest Roundtable map handling
(75 tests in total). The boss catalogue now has 62 entries. No deployment or saved
run deletion was performed. Multiplayer behavior was checked by the existing LAN
and public-session integration tests, not a second physical PC playthrough.

## Pages release and final usability pass — 6 September 2026

- Added a host-only **Skip rune boss** action to the route card and current-step
  panel. It changes the boss selection and recalculates funding instead of marking
  the boss skipped while still counting its reward. Existing completion and other
  chapters' selections are preserved.
- Added static-export checks for missing JS/CSS and incorrect repository base
  paths, plus a public deployment manifest carrying the GitHub commit SHA. This
  permits verification that Pages actually serves the new release.
- The existing shared-room service must be published with catalogue changes because
  it validates build IDs and starting classes independently of the Pages client.
- New regression checks cover route-card skip permissions, funding removal and
  invalid Pages exports. Private local saves and research caches remain ignored.
- The first Pages release check caught Vinext's root-relative self-hosted font URLs
  on the Linux runner. A project-owned post-transform now prefixes those injected
  URLs before bundling, preserving preload/SSR/hydration consistency without changing
  local development or third-party URLs. The dependency itself was not edited.
