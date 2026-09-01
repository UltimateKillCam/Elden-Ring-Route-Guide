import type { Build } from "./data";

export type QuestTrackId =
  | "alexander"
  | "boc"
  | "blackguard-boggart"
  | "corhyn-goldmask"
  | "d-gurranq"
  | "diallos-jarburg"
  | "dung-eater"
  | "frenzied-flame"
  | "hyetta"
  | "irina-edgar"
  | "latenna"
  | "millicent"
  | "minor-side-content"
  | "nepheli-kenneth"
  | "patches"
  | "rogier"
  | "sellen"
  | "seluvis"
  | "thops"
  | "varre"
  | "volcano-manor"
  | "yura"
  | "dlc-ansbach-freyja"
  | "dlc-hornsent-leda"
  | "dlc-igon-priestess"
  | "dlc-moore"
  | "dlc-thiollier"
  | "dlc-ymir-jolan";

export type QuestTrack = {
  id: QuestTrackId;
  name: string;
  act: "Base game" | "Shadow of the Erdtree";
  summary: string;
  reward: string;
  source: string;
  requires?: QuestTrackId[];
};

// Ranni/Fia are deliberately absent: their chains are part of the all-Remembrance
// route (Astel and Fortissax). Roderika, Melina and mandatory access states are core
// systems rather than optional NPC tracks. Ymir's bell route remains core for Metyr;
// only the Jolan reward branch is selectable here.
export const OPTIONAL_QUEST_TRACKS: QuestTrack[] = [
  { id: "alexander", name: "Iron Fist Alexander", act: "Base game", summary: "Free Alexander, meet him after Radahn and complete his Farum Azula duel.", reward: "Shard of Alexander and Alexander's Innards", source: "https://eldenring.wiki.gg/wiki/Iron_Fist_Alexander" },
  { id: "boc", name: "Boc the Seamster", act: "Base game", summary: "Restore Boc's tailoring service and preserve his safe ending.", reward: "Free garment alterations and My Lord gesture", source: "https://eldenring.wiki.gg/wiki/Boc_the_Seamster" },
  { id: "blackguard-boggart", name: "Blackguard Big Boggart", act: "Base game", summary: "Buy Rya's necklace and prawn before moving Boggart to Altus for the Dung Eater invasion.", reward: "Boiled Prawn/Crab shop, Seedbed Curse and Iron Ball", source: "https://eldenring.wiki.gg/wiki/Blackguard" },
  { id: "corhyn-goldmask", name: "Corhyn and Goldmask", act: "Base game", summary: "Follow the Golden Order investigation through Leyndell and the Mountaintops.", reward: "Mending Rune of Perfect Order and Goldmask's Set", source: "https://eldenring.wiki.gg/wiki/Brother_Corhyn" },
  { id: "d-gurranq", name: "D and Gurranq", act: "Base game", summary: "Start D's introduction, collect all nine Deathroots in route order and calm Gurranq without killing him.", reward: "Every Bestial reward through the Ancient Dragon Smithing Stone", source: "https://eldenring.wiki.gg/wiki/Gurranq" },
  { id: "diallos-jarburg", name: "Diallos and Jar-Bairn", act: "Base game", summary: "Follow Diallos from Liurnia to the Manor and finish the Jarburg sequence.", reward: "Companion Jar and Hoslow's Petal Whip", source: "https://eldenring.wiki.gg/wiki/Diallos", requires: ["alexander", "volcano-manor"] },
  { id: "dung-eater", name: "Dung Eater", act: "Base game", summary: "Collect Seedbed Curses and choose the ending-rune or puppet outcome. Boggart is a separate optional branch, not a prerequisite.", reward: "Mending Rune of the Fell Curse or Dung Eater Puppet", source: "https://eldenring.wiki.gg/wiki/Loathsome_Dung_Eater" },
  { id: "frenzied-flame", name: "Frenzied Flame", act: "Base game", summary: "Follow Shabriri and the Three Fingers only when deliberately choosing this route.", reward: "Lord of Frenzied Flame ending and Frenzied Flame Seal", source: "https://eldenring.wiki.gg/wiki/Three_Fingers" },
  { id: "hyetta", name: "Hyetta", act: "Base game", summary: "Deliver the grapes and fingerprint grape through the Frenzied Flame Proscription.", reward: "Frenzied Flame Seal", source: "https://eldenring.wiki.gg/wiki/Hyetta", requires: ["irina-edgar", "frenzied-flame"] },
  { id: "irina-edgar", name: "Irina and Edgar", act: "Base game", summary: "Deliver Irina's letter, resolve Castle Morne and face Edgar in Liurnia.", reward: "Banished Knight's Halberd +8 and Shabriri Grape", source: "https://eldenring.wiki.gg/wiki/Castellan_Edgar" },
  { id: "latenna", name: "Latenna", act: "Base game", summary: "Recruit Latenna after Albus and bring her to Apostate Derelict.", reward: "Latenna the Albinauric and Somber Ancient Dragon Smithing Stone", source: "https://eldenring.wiki.gg/wiki/Latenna_the_Albinauric" },
  { id: "millicent", name: "Millicent and Gowry", act: "Base game", summary: "Repair the needle, follow Millicent and choose her Haligtree branch.", reward: "Rotten Winged Sword Insignia or Millicent's Prosthesis; Miquella's Needle route", source: "https://eldenring.wiki.gg/wiki/Millicent" },
  { id: "minor-side-content", name: "Minor NPC encounters", act: "Base game", summary: "Include self-contained NPC and puzzle encounters that are not needed for a Remembrance or selected build.", reward: "Gestures, small rewards and optional puzzle loot", source: "https://eldenring.wiki.gg/wiki/NPCs" },
  { id: "nepheli-kenneth", name: "Nepheli, Kenneth and Gostoc", act: "Base game", summary: "Complete Kenneth's opening, preserve Nepheli and install her at Stormveil.", reward: "Two Ancient Dragon Smithing Stones and Arsenal Charm", source: "https://eldenring.wiki.gg/wiki/Nepheli_Loux" },
  { id: "patches", name: "Patches", act: "Base game", summary: "Spare Patches and follow every relocation through Shaded Castle.", reward: "Magma Whip Candlestick, Bull-Goat access and gestures", source: "https://eldenring.wiki.gg/wiki/Patches_the_Untethered" },
  { id: "rogier", name: "Sorcerer Rogier", act: "Base game", summary: "Investigate Stormveil's corpse and the Black Knifeprint before joining Ranni.", reward: "Rogier's Rapier, Spellblade Set and story dialogue", source: "https://eldenring.wiki.gg/wiki/Sorcerer_Rogier" },
  { id: "sellen", name: "Sorceress Sellen", act: "Base game", summary: "Find the primeval sorcerers and resolve Sellen against Jerren.", reward: "Sorcery equipment, spells and branch rewards", source: "https://eldenring.wiki.gg/wiki/Sorceress_Sellen" },
  { id: "seluvis", name: "Preceptor Seluvis", act: "Base game", summary: "Finish the potion and puppet stages before giving Ranni the Fingerslayer Blade.", reward: "Magic Scorpion Charm and selected puppet", source: "https://eldenring.wiki.gg/wiki/Preceptor_Seluvis" },
  { id: "thops", name: "Thops", act: "Base game", summary: "Give Thops the spare Academy key and recover his final rewards.", reward: "Thops's Barrier, staff and bell bearing", source: "https://eldenring.wiki.gg/wiki/Thops" },
  { id: "varre", name: "White Mask Varre", act: "Base game", summary: "Complete Rose Church and Mohgwyn invasion stages without using the medal to overlevel.", reward: "Early Mohgwyn access, Varre's Bouquet and invasion items", source: "https://eldenring.wiki.gg/wiki/White_Mask_Varre" },
  { id: "volcano-manor", name: "Volcano Manor residents", act: "Base game", summary: "Complete contracts and preserve Rya, Tanith and Bernahl before Rykard.", reward: "Contract armour, weapons, talismans and Manor quest rewards", source: "https://eldenring.wiki.gg/wiki/Volcano_Manor" },
  { id: "yura", name: "Yura and Eleonora", act: "Base game", summary: "Follow Yura from Limgrave through the Academy and Second Church.", reward: "Nagakiba, Eleonora's Poleblade and Purifying Crystal Tear", source: "https://eldenring.wiki.gg/wiki/Bloody_Finger_Hunter_Yura" },
  { id: "dlc-ansbach-freyja", name: "Ansbach and Freyja", act: "Shadow of the Erdtree", summary: "Complete the Storehouse letter exchange before Messmer and the sealing tree.", reward: "Freyja and Ansbach equipment plus final-battle rewards", source: "https://eldenring.wiki.gg/wiki/Sir_Ansbach" },
  { id: "dlc-hornsent-leda", name: "Hornsent and Leda", act: "Shadow of the Erdtree", summary: "Resolve the crosses, invasion signs and Messmer/Rauh branches.", reward: "Branch-specific talismans, armour and weapons", source: "https://eldenring.wiki.gg/wiki/Hornsent" },
  { id: "dlc-igon-priestess", name: "Igon and Dragon Communion Priestess", act: "Shadow of the Erdtree", summary: "Carry Igon's route to Bayle and choose the Priestess concoction branch.", reward: "Igon's and Priestess branch equipment", source: "https://eldenring.wiki.gg/wiki/Igon" },
  { id: "dlc-moore", name: "Moore and the Forager Brood", act: "Shadow of the Erdtree", summary: "Collect cookbooks before answering Moore after the great rune breaks.", reward: "Forager cookbooks, Verdigris gear and Moore's Bell Bearing", source: "https://eldenring.wiki.gg/wiki/Moore" },
  { id: "dlc-thiollier", name: "Thiollier and St. Trina", act: "Shadow of the Erdtree", summary: "Move Thiollier to the Fissure, relay St. Trina's words and preserve his finale summon.", reward: "Thiollier's equipment and St. Trina's Blossom", source: "https://eldenring.wiki.gg/wiki/Thiollier" },
  { id: "dlc-ymir-jolan", name: "Jolan's Ymir branch", act: "Shadow of the Erdtree", summary: "Metyr remains in the core route; select this for Jolan dialogue and reward decisions.", reward: "Swordhand of Night rewards, Anna/Jolan spirit branch", source: "https://eldenring.wiki.gg/wiki/Jol%C3%A1n,_Swordhand_of_Night" },
];

export const ALL_OPTIONAL_QUEST_TRACK_IDS = OPTIONAL_QUEST_TRACKS.map((track) => track.id);

type TrackRule = { id: QuestTrackId; test: RegExp };

// Specific rules must precede broad rules because many descriptions mention Ranni,
// Fia, Messmer or another core character while documenting an optional branch.
const LABEL_TRACK_RULES: TrackRule[] = [
  { id: "dlc-ansbach-freyja", test: /ansbach|freyja|secret rite scroll|letter for freyja/i },
  { id: "dlc-hornsent-leda", test: /hornsent|leda|dryleaf dane|divine beast head|grandam|scorpion stew/i },
  { id: "dlc-igon-priestess", test: /igon|bayle|dragon communion priestess|thiollier's concoction at night/i },
  { id: "dlc-moore", test: /moore|forager brood/i },
  { id: "dlc-thiollier", test: /thiollier|st\. trina|garden of deep purple|imbibe|black syrup/i },
  { id: "dlc-ymir-jolan", test: /jolan|swordhand of night|night katana|iris of grace|iris of occultation/i },
  { id: "seluvis", test: /seluvis|amber draught|amber starlight|magic scorpion charm|puppet/i },
  { id: "millicent", test: /millicent|gowry|unalloyed gold needle|valkyrie's prosthesis|prosthesis-wearer|rott?en winged sword|miquella's needle/i },
  { id: "nepheli-kenneth", test: /nepheli|kenneth|stormhawk king|gostoc|chrysalids' memento/i },
  { id: "corhyn-goldmask", test: /corhyn|goldmask|law of regression|radagon revelation|perfect order/i },
  { id: "diallos-jarburg", test: /diallos|jar-bairn|jarburg|alexander's innards|companion jar/i },
  { id: "blackguard-boggart", test: /blackguard|boggart|boiled prawn|boiled crab|rya's necklace/i },
  { id: "volcano-manor", test: /volcano manor|tanith|rykard's arena|drawing-room|drawing room|istvan|rileigh|juno hoslow|serpent's amnion|\brya\b|zorayas|knight bernahl|warmaster's shack|bernahl's red|recusant bernahl/i },
  { id: "patches", test: /patches|tragoth|dancer's castanets|magma whip candlestick|bull-goat/i },
  { id: "dung-eater", test: /dung eater|seedbed curse|fell curse/i },
  { id: "hyetta", test: /hyetta|shabriri grape|fingerprint grape/i },
  { id: "irina-edgar", test: /irina|edgar|revenger's shack|revenger/i },
  { id: "frenzied-flame", test: /shabriri|three fingers|frenzied flame by accident|inherit.*flame/i },
  { id: "latenna", test: /latenna|apostate derelict/i },
  { id: "alexander", test: /alexander|wailing dunes/i },
  { id: "rogier", test: /rogier|black knifeprint|corpse below stormveil/i },
  { id: "sellen", test: /sellen|lusat|azur|witch-hunter jerren|primeval sorcer/i },
  { id: "thops", test: /thops|second academy glintstone key|spare key/i },
  { id: "varre", test: /varre|white mask|lord of blood's favor|pureblood knight|magnus.*writheblood/i },
  { id: "yura", test: /yura|nerijus|ravenmount|eleonora|nagakiba|purifying crystal tear/i },
  { id: "boc", test: /\bboc\b|sewing needle|gold sewing needle|you're beautiful|call you lord/i },
  { id: "d-gurranq", test: /\bgurranq\b|\bdeathroot\b|summonwater village tibia mariner|meet d\b/i },
  { id: "minor-side-content", test: /darriwil with blaidd|spirit jellyfish sisters/i },
];

const CORE_ROUTE_LABELS = new Set([
  "Speak to Leda at the cocoon and enter the Realm of Shadow",
  "Defeat Bayle the Dread",
  "Defeat Leda and her allies",
  "Defeat Swordhand of Night Jolan and Count Ymir",
  "Ask Seluvis about Nokron and take his introduction",
  "Give Seluvis's Introduction to Sellen at Waypoint Ruins",
  "Confirm the Radahn Festival through Blaidd or Iji",
  "Collect Fingerslayer Blade but do not give it to Ranni",
  "Give Fingerslayer Blade to Ranni only after the selected Seluvis outcome",
  "Receive the Carian Inverted Statue from Ranni",
  "Meet Ymir and Jolan at the cathedral",
  "Return to Ymir for the second ruins map",
  "Return to Ymir and exhaust both characters' dialogue",
  "Inspect Ymir's empty throne and defeat Swordhand of Night Anna",
  "Defeat Metyr after ringing the Miyr bell",
]);

export function optionalQuestTrackForLabel(label: string): QuestTrackId | undefined {
  return optionalQuestTracksForLabel(label)[0];
}

export function optionalQuestTracksForLabel(label: string): QuestTrackId[] {
  if (CORE_ROUTE_LABELS.has(label)) return [];
  return Array.from(new Set(LABEL_TRACK_RULES.filter((rule) => rule.test.test(label)).map((rule) => rule.id)));
}

const BUILD_TRACK_RULES: TrackRule[] = [
  { id: "alexander", test: /shard of alexander|warrior jar shard|alexander's innards/i },
  { id: "boc", test: /boc|gold sewing needle/i },
  { id: "blackguard-boggart", test: /blackguard|boggart|iron ball/i },
  { id: "corhyn-goldmask", test: /goldmask|corhyn|mending rune of perfect order/i },
  { id: "d-gurranq", test: /gurranq|bestial|beastclaw greathammer|cinquedea/i },
  { id: "diallos-jarburg", test: /companion jar|diallos|hoslow's petal whip/i },
  { id: "dung-eater", test: /dung eater|omen set|sword of milos/i },
  { id: "frenzied-flame", test: /frenzied flame seal/i },
  { id: "hyetta", test: /hyetta/i },
  { id: "irina-edgar", test: /banished knight's halberd \+8|edgar/i },
  { id: "latenna", test: /latenna/i },
  { id: "millicent", test: /millicent's prosthesis|rotten winged sword insignia|flock's canvas talisman|miquella's needle/i },
  { id: "nepheli-kenneth", test: /nepheli|stormhawk axe|arsenal charm/i },
  { id: "patches", test: /magma whip candlestick|bull-goat|patches/i },
  { id: "rogier", test: /rogier's rapier|spellblade set/i },
  { id: "sellen", test: /sellen|azur's glintstone|lusat's glintstone|glintstone kris/i },
  { id: "seluvis", test: /magic scorpion charm|seluvis|puppet/i },
  { id: "thops", test: /thops's barrier|thops/i },
  { id: "varre", test: /varre's bouquet|white mask|war surgeon/i },
  { id: "volcano-manor", test: /rykard progression|taker's cameo|scaled set|crepus's vial|hoslow's set|raging wolf set|gelmir's fury|volcano manor progression/i },
  { id: "yura", test: /nagakiba|eleonora's poleblade|raptor of the mists|yura|purifying crystal tear/i },
  { id: "dlc-ansbach-freyja", test: /ansbach|freyja|golden lion shield|obsidian lamina/i },
  { id: "dlc-hornsent-leda", test: /hornsent|leda|lacerating crossed-tree|retaliatory crossed-tree|falx/i },
  { id: "dlc-igon-priestess", test: /igon|priestess heart|flowerstone gavel/i },
  { id: "dlc-moore", test: /verdigris|moore/i },
  { id: "dlc-thiollier", test: /thiollier|st\. trina's blossom|velvet sword of st trina/i },
  { id: "dlc-ymir-jolan", test: /jolan|sword of night|claws of night|night set/i },
];

const BUILD_TRACK_ALTERNATIVES: Partial<Record<QuestTrackId, RegExp>> = {
  "frenzied-flame": /frenzied flame seal only if|frenzied flame seal or finger seal/i,
  hyetta: /only if hyetta|otherwise finger seal/i,
};

export function requiredQuestTracksForBuild(build: Build): QuestTrackId[] {
  // Only equipment/rewards should force an optional route. A guide's flavour text or
  // temporary sourced bridge may mention an NPC without actually requiring the chain.
  const text = JSON.stringify({ phases: build.phases, quest: build.quest, publishedLoadout: build.publishedLoadout, publishedStages: build.publishedStages });
  return BUILD_TRACK_RULES.filter((rule) => rule.test.test(text) && !BUILD_TRACK_ALTERNATIVES[rule.id]?.test(text)).map((rule) => rule.id);
}

export function requiredQuestTracksForParty(builds: Build[]): QuestTrackId[] {
  return expandQuestTrackIds(builds.flatMap(requiredQuestTracksForBuild));
}

export function expandQuestTrackIds(ids: Iterable<QuestTrackId>): QuestTrackId[] {
  const expanded = new Set(ids);
  let changed = true;
  while (changed) {
    changed = false;
    for (const track of OPTIONAL_QUEST_TRACKS) {
      if (!expanded.has(track.id)) continue;
      for (const requirement of track.requires || []) {
        if (expanded.has(requirement)) continue;
        expanded.add(requirement);
        changed = true;
      }
    }
  }
  return [...expanded];
}
