/** Provenance for the local data used to verify numeric equipment records. */
export const GAME_DATA_BASELINE = {
  gameDirectory: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\ELDEN RING\\Game",
  appVersion: "1.17",
  regulationVersion: 11701000,
  regulationSha256: "FB4AFD25E70EFFC9F9523D3ABA89B1FB3E08B0800D8EFB9A535CAB038C5E8BBD",
  checked: "2026-09-01",
  currentReleasedVersion: "1.17",
  currentPatchReleased: "2026-08-27",
  currentPatchAudited: true,
  currentPatchUrl: "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-patch-notes-version-117",
  verifiedTables: [
    "EquipParamWeapon",
    "EquipParamProtector",
    "EquipParamAccessory",
    "EquipParamGoods",
    "CharaInitParam",
    "ReinforceParamWeapon",
    "ShopLineupParam",
  ],
} as const;
