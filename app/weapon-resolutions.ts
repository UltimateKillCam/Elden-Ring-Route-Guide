import type { BuildSource, PhaseKey } from "./data";

type WeaponResolution = {
  weapon: string;
  weapons?: Partial<Record<PhaseKey, string>>;
  rationale: string;
  sources: BuildSource[];
};

const fextra = (anchor: string, name: string): BuildSource => ({
  label: `Fextralife: ${name}`,
  url: `https://eldenring.wiki.fextralife.com/Builds#${anchor}`,
});

const wiki = (slug: string, label: string): BuildSource => ({
  label,
  url: `https://eldenring.wiki.gg/wiki/${slug}`,
});

// Fextralife deliberately leaves some slots open. These overrides name one real
// option supported by the linked build/item guides; the imported source text is
// kept unchanged in wiki-builds.ts.
export const weaponResolutions: Record<string, WeaponResolution> = {
  "fextra-carianshieldknight": {
    weapon: "Carian Thrusting Shield (two-handed)",
    rationale: "The build's apparent N/A main-hand entry is resolved to the Carian Thrusting Shield that the same guide lists with Cragblade; it functions as both weapon and shield.",
    sources: [fextra("carianshieldknight", "Carian Shield Knight")],
  },
  "fextra-spellblade": {
    weapon: "Demi-Human Queen's Staff + Estoc",
    rationale: "The source names Estoc first among its Dexterity one-handed choices; Estoc also has the specified Impaling Thrust and is obtainable from Patches in Limgrave.",
    sources: [fextra("spellblade", "Spellblade"), wiki("Estoc", "Eldenpedia: Estoc")],
  },
  "fextra-frostknight": {
    weapon: "Clayman's Harpoon + Academy Glintstone Staff",
    rationale: "At this level-100 Intelligence stage, Academy Glintstone Staff is the strongest no-penalty pure-Intelligence staff across 41–68 Intelligence.",
    sources: [fextra("frostknight", "Frost Knight"), wiki("Academy_Glintstone_Staff", "Eldenpedia: Academy Glintstone Staff")],
  },
  "fextra-moonveilshinobi": {
    weapon: "Moonveil + Uchigatana + Academy Glintstone Staff",
    rationale: "The two katanas remain as published; Academy Glintstone Staff concretely fills the level-100 casting slot and leads no-penalty staves across 41–68 Intelligence.",
    sources: [fextra("moonveilshinobi", "Moonveil Shinobi"), wiki("Academy_Glintstone_Staff", "Eldenpedia: Academy Glintstone Staff")],
  },
  "fextra-nebulaknight": {
    weapon: "Wing of Astel + Carian Regal Scepter",
    rationale: "This level-150 Intelligence-first setup can use Carian Regal Scepter, the strongest no-penalty pure-Intelligence staff from 68 Intelligence upward.",
    sources: [fextra("nebulaknight", "Nebula Knight"), wiki("Carian_Regal_Scepter", "Eldenpedia: Carian Regal Scepter")],
  },
  "fextra-paladin": {
    weapon: "Broadsword + Finger Seal",
    rationale: "Broadsword is available immediately, works one-handed with the guide's Brass Shield and has the highest attack power among regular straight swords. Finger Seal is strongest at the build's early 10–26 Faith range.",
    sources: [wiki("Broadsword", "Eldenpedia: Broadsword"), wiki("Finger_Seal", "Eldenpedia: Finger Seal")],
  },
  "fextra-dragonpriest": {
    weapon: "Finger Seal → Dragon Communion Seal (no required melee weapon)",
    rationale: "The sourced Dragon Priest guide says the build has little use for melee weapons: begin with Prophet's Finger Seal, then take the Limgrave Dragon Communion Seal for the Faith/Arcane dragon spells.",
    sources: [
      { label: "MGN: Fextralife Dragon Priest guide", url: "https://mgn.gg/elden-ring-prophet-class-guide-how-to-build-a-dragon-priest" },
      wiki("Dragon_Communion_Seal", "Eldenpedia: Dragon Communion Seal"),
    ],
  },
  "fextra-blackflameapostle": {
    weapon: "Uchigatana + Godslayer's Seal",
    rationale: "Uchigatana is the first innate-bleed option named by the build, is easy to obtain in Limgrave and accepts Bloody Slash or Unsheathe as required.",
    sources: [fextra("blackflameapostle", "Blackflame Apostle"), wiki("Uchigatana", "Eldenpedia: Uchigatana")],
  },
  "fextra-blackknifeassassin": {
    weapon: "Erdsteel Dagger x2 + Black Knife + Godslayer's Seal",
    rationale: "Godslayer's Seal concretely fills the general casting slot and is the strongest pure-Faith seal from 27 through 68 Faith, the useful range for this Dexterity/Faith split.",
    sources: [fextra("blackknifeassassin", "Black Knife Assassin"), wiki("Godslayer%27s_Seal", "Eldenpedia: Godslayer's Seal")],
  },
  "fextra-godslayer": {
    weapon: "Godslayer's Greatsword + Godslayer's Seal",
    rationale: "The matching seal is strongest for Godslayer incantations and is the leading pure-Faith seal from 27 through 68 Faith.",
    sources: [fextra("godslayer", "Elden Godslayer"), wiki("Godslayer%27s_Seal", "Eldenpedia: Godslayer's Seal")],
  },
  "fextra-swordsaint": {
    weapon: "Sacred Relic Sword + Sword of Milos + Erdtree Seal",
    rationale: "Erdtree Seal is weightless and becomes the strongest Faith-only seal above 68 Faith, making it the concrete endgame choice for the build's unspecified seal slot.",
    sources: [fextra("swordsaint", "Elden Sword Saint"), wiki("Erdtree_Seal", "Eldenpedia: Erdtree Seal")],
  },
  "fextra-barbarian": {
    weapon: "Zweihander",
    rationale: "The source names Zweihander as its concrete colossal weapon, so the route uses that rather than inventing a later alternative.",
    sources: [fextra("barbarian", "Barbarian")],
  },
  "fextra-colossusguardian": {
    weapon: "Prelate's Inferno Crozier + Clawmark Seal + Miséricorde",
    rationale: "Clawmark Seal is specifically suited to high-Strength, low-to-mid-Faith builds. Miséricorde fills the open dagger slot with the game's highest critical multiplier.",
    sources: [wiki("Clawmark_Seal", "Eldenpedia: Clawmark Seal"), wiki("Mis%C3%A9ricorde", "Eldenpedia: Miséricorde")],
  },
  "fextra-scorchingslayer": {
    weapon: "Gargoyle's Twinblade + Clawmark Seal",
    rationale: "Clawmark Seal is the documented fit for a high-Strength, low-to-mid-Faith build and is obtainable well before this level-100 stage.",
    sources: [fextra("scorchingslayer", "Scorching Slayer"), wiki("Clawmark_Seal", "Eldenpedia: Clawmark Seal")],
  },
  "fextra-sorcerysentinel": {
    weapon: "Watchdog's Staff + Clawmark Seal",
    rationale: "The Strength-focused build only needs a modest-Faith catalyst for its buffs; Clawmark Seal is specifically recommended for high Strength with low-to-mid Faith.",
    sources: [fextra("sorcerysentinel", "Sorcery Sentinel"), wiki("Clawmark_Seal", "Eldenpedia: Clawmark Seal")],
  },
  "fextra-gravitygod": {
    weapon: "Fallingstar Beast Jaw + Clawmark Seal",
    rationale: "Clawmark Seal matches the build's high Strength and small Faith investment and is obtainable far earlier than this endgame stage.",
    sources: [fextra("gravitygod", "Gravity God"), wiki("Clawmark_Seal", "Eldenpedia: Clawmark Seal")],
  },
  "fextra-cariancavalier": {
    weapon: "Loretta's War Sickle + Staff of Loss",
    rationale: "A sourced walkthrough of this exact Fextralife build identifies Staff of Loss as its casting tool; it meets the build's minimal one-spell requirement without assuming a full sorcerer stat spread.",
    sources: [{ label: "AOEAH: Fextralife Carian Cavalier equipment", url: "https://www.aoeah.com/news/1203--elden-ring-best-106-strength-dexterity-build--lorettas-war-sickle-build-guide-in-elden-ring" }],
  },
  "fextra-blackarrow": {
    weapon: "Black Bow + Frenzied Flame Seal",
    rationale: "The guide specifically asks for a weightless seal. Frenzied Flame Seal weighs 0.0 and has no attribute requirements, so it adds no build tax to the archer.",
    sources: [fextra("blackarrow", "Black Arrow"), wiki("Frenzied_Flame_Seal", "Eldenpedia: Frenzied Flame Seal")],
  },
  "fextra-goldenchampion": {
    weapon: "Ornamental Straight Sword + Frenzied Flame Seal",
    rationale: "For this Dexterity-first build's buff-only casting slot, Frenzied Flame Seal is weightless, has no requirements and is the only seal that also scales with Dexterity.",
    sources: [fextra("goldenchampion", "Golden Champion"), wiki("Frenzied_Flame_Seal", "Eldenpedia: Frenzied Flame Seal")],
  },
  "fextra-blooddragon": {
    weapon: "Bandit's Curved Sword x2 + Dragon Communion Seal",
    rationale: "The build allows any infusable curved swords. Bandit's Curved Sword is documented as generally the strongest infusable curved sword and can be farmed in Weeping Peninsula before midgame.",
    sources: [fextra("blooddragon", "Blood Dragon"), wiki("Bandit%27s_Curved_Sword", "Eldenpedia: Bandit's Curved Sword")],
  },
  "fextra-dragonknight": {
    weapon: "Occult Iron Greatsword (Bloody Slash) + Dragon Communion Seal",
    rationale: "A sourced walkthrough of this exact level-100 build specifies the Occult Iron Greatsword for Bloody Slash and the Dragon Communion Seal for its Faith/Arcane casting.",
    sources: [{ label: "UTPlay: Fextralife Dragon Knight equipment", url: "https://www.utplay.com/news/2278--elden-ring-faith-arcane-build-guide-equipment-stats-talismans-spells--gameplay-tips-of-level-100-dragon-knight" }],
  },
  "fextra-frenziedacolyte": {
    weapon: "Occult Glaive (Bloodhound's Step) + Dragon Communion Seal + Frenzied Flame Seal + Gravel Stone Seal + Godslayer's Seal",
    rationale: "A sourced walkthrough of this exact Fextralife build names the Occult Glaive, using Bloodhound's Step for spacing before returning to spellcasting.",
    sources: [{ label: "GoldKK: Fextralife Frenzied Acolyte equipment", url: "https://www.goldkk.com/news/2211--elden-ring-madness-incantation-build-guide--how-to-build-a-frenzied-acolyte-at-level-100" }],
  },
  "fextra-dragonwarrior": {
    weapon: "Bandit's Curved Sword x2 + Dragon Communion Seal",
    rationale: "The source names Bandit's Curved Swords first; the item reference also identifies them as generally the strongest infusable curved swords for the build's Seppuku setup.",
    sources: [fextra("dragonwarrior", "Dragon Warrior"), wiki("Bandit%27s_Curved_Sword", "Eldenpedia: Bandit's Curved Sword")],
  },
};
