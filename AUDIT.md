# Route and data audit

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
