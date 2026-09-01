export type BuffKind = "incantation" | "sorcery" | "ash" | "weapon-skill";
export type BuffGroup = "aura" | "body" | "weapon" | "regeneration" | "field" | "shield";

export type BuildBuff = {
  id: string;
  name: string;
  acquisitionItem: string;
  kind: BuffKind;
  group: BuffGroup;
  aliases: string[];
  catalyst?: "Sacred Seal" | "Glintstone Staff";
  memorySlots?: number;
  requirements?: string;
  effect: string;
  acquisition: string;
  activation: string;
  wiki: string;
  castOrder: number;
};

const spellBuffs: BuildBuff[] = [
  {
    id: "golden-vow-spell", name: "Golden Vow", acquisitionItem: "Golden Vow (Spell)", kind: "incantation", group: "aura",
    aliases: ["golden vow"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "25 Faith",
    effect: "Raises the damage dealt and damage negation of the caster and nearby allies for 80 seconds.",
    acquisition: "At the Corpse-Stench Shack on Mt. Gelmir, loot the corpse inside the shack. Anastasia can invade here, but defeating her is not required to take the spell.",
    activation: "Memorize it at a grace, hold a Sacred Seal, gather the party within range and cast it before entering the fight.",
    wiki: "https://eldenring.wiki.gg/wiki/Golden_Vow", castOrder: 30,
  },
  {
    id: "flame-grant-me-strength", name: "Flame, Grant Me Strength", acquisitionItem: "Flame, Grant me Strength", kind: "incantation", group: "body",
    aliases: ["flame grant me strength", "grant me strength"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "15 Faith",
    effect: "Raises physical and fire attack power and stamina recovery for 30 seconds.",
    acquisition: "Ride behind Fort Gael in western Caelid and loot the body between the two Flame Chariots. Stay on Torrent and leave immediately; neither chariot has to be killed.",
    activation: "Memorize it at a grace and cast it with a Sacred Seal after longer-duration buffs, immediately before the pull.",
    wiki: "https://eldenring.wiki.gg/wiki/Flame%2C_Grant_Me_Strength", castOrder: 90,
  },
  {
    id: "bloodflame-blade", name: "Bloodflame Blade", acquisitionItem: "Bloodflame Blade", kind: "incantation", group: "weapon",
    aliases: ["bloodflame blade"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "12 Faith and 10 Arcane",
    effect: "Coats a compatible right-hand weapon in bloodflame for 60 seconds, adding fire damage and delayed blood-loss buildup.",
    acquisition: "Kill the correct Teardrop Scarab in the marsh north-west of Rose Church in Liurnia; the second nearby scarab is a decoy and drops nothing.",
    activation: "Put the buffable weapon in the right hand and a Sacred Seal in the left, then cast before the fight. If the spell is greyed out, the weapon or its affinity cannot accept an external coating.",
    wiki: "https://eldenring.wiki.gg/wiki/Bloodflame_Blade", castOrder: 70,
  },
  {
    id: "scholars-armament", name: "Scholar's Armament", acquisitionItem: "Scholar's Armament", kind: "sorcery", group: "weapon",
    aliases: ["scholar s armament", "scholars armament"], catalyst: "Glintstone Staff", memorySlots: 1, requirements: "12 Intelligence",
    effect: "Adds magic damage to a compatible right-hand weapon for 90 seconds.",
    acquisition: "Defeat the Mad Pumpkin Head below Waypoint Ruins, speak to Sorceress Sellen and buy the sorcery for 3,000 runes.",
    activation: "Put the buffable weapon in the right hand and a Glintstone Staff in the left, memorize the sorcery and cast it before combat.",
    wiki: "https://eldenring.wiki.gg/wiki/Scholar%27s_Armament", castOrder: 70,
  },
  {
    id: "bestial-vitality", name: "Bestial Vitality", acquisitionItem: "Bestial Vitality", kind: "incantation", group: "regeneration",
    aliases: ["bestial vitality"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "12 Faith",
    effect: "Restores HP gradually for 120 seconds.",
    acquisition: "Give Gurranq a total of three Deathroots. The route obtains these from Summonwater Village, Deathtouched Catacombs and the eastern Liurnia Tibia Mariner.",
    activation: "Memorize it and cast it with a Sacred Seal before long exploration stretches or before the shorter offensive buffs.",
    wiki: "https://eldenring.wiki.gg/wiki/Bestial_Vitality", castOrder: 10,
  },
  {
    id: "blessings-boon", name: "Blessing's Boon", acquisitionItem: "Blessing's Boon", kind: "incantation", group: "regeneration",
    aliases: ["blessing s boon", "blessings boon"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "24 Faith",
    effect: "Restores HP gradually for the caster and nearby allies for 90 seconds.",
    acquisition: "At the Church of Vows in eastern Liurnia, speak to Miriel and buy the incantation for 4,000 runes.",
    activation: "Memorize it, gather the party nearby and cast it with a Sacred Seal before the shorter offensive buffs.",
    wiki: "https://eldenring.wiki.gg/wiki/Blessing%27s_Boon", castOrder: 10,
  },
  {
    id: "blessing-of-the-erdtree", name: "Blessing of the Erdtree", acquisitionItem: "Blessing of the Erdtree", kind: "incantation", group: "regeneration",
    aliases: ["blessing of the erdtree"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "38 Faith",
    effect: "Provides the stronger long-duration HP regeneration buff to the caster and nearby allies.",
    acquisition: "After defeating Godfrey's golden shade in Leyndell, enter the Queen's Bedchamber on the route to Morgott and loot the spell from the bed.",
    activation: "Memorize it, gather the party and cast it before Golden Vow and other shorter buffs. It replaces weaker regeneration incantations rather than stacking with them.",
    wiki: "https://eldenring.wiki.gg/wiki/Blessing_of_the_Erdtree", castOrder: 10,
  },
  {
    id: "black-flames-protection", name: "Black Flame's Protection", acquisitionItem: "Black Flame's Protection", kind: "incantation", group: "body",
    aliases: ["black flame s protection", "black flames protection"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "30 Faith",
    effect: "Greatly reduces physical damage taken for 70 seconds, but reduces healing received.",
    acquisition: "After obtaining both Haligtree Secret Medallion halves, ask Gideon about the secret medallion at Roundtable Hold and buy the incantation from him. If Gideon has left, buy it from the Twin Maiden Husks.",
    activation: "Memorize and cast it with a Sacred Seal only when its physical defence is worth the healing penalty. It is a body buff and replaces Flame, Grant Me Strength.",
    wiki: "https://eldenring.wiki.gg/wiki/Black_Flame%27s_Protection", castOrder: 90,
  },
  {
    id: "protection-of-the-erdtree", name: "Protection of the Erdtree", acquisitionItem: "Protection of the Erdtree", kind: "incantation", group: "body",
    aliases: ["protection of the erdtree"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "35 Faith",
    effect: "Raises non-physical damage negation for the caster and nearby allies.",
    acquisition: "On the Altus Plateau, kill the Teardrop Scarab on top of the stone ruin north-east of the Grand Lift approach.",
    activation: "Memorize it, gather the party and cast with a Sacred Seal when an encounter deals mixed elemental damage. It replaces other body buffs.",
    wiki: "https://eldenring.wiki.gg/wiki/Protection_of_the_Erdtree", castOrder: 90,
  },
  {
    id: "electrify-armament", name: "Electrify Armament", acquisitionItem: "Electrify Armament", kind: "incantation", group: "weapon",
    aliases: ["electrify armament"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "15 Faith",
    effect: "Adds lightning damage to a compatible right-hand weapon for 90 seconds.",
    acquisition: "Kill the Leyndell Knight south of the Artist's Shack in eastern Liurnia for the Dragon Cult Prayerbook, give it to Miriel at the Church of Vows, then buy the incantation for 4,000 runes.",
    activation: "Put the compatible weapon in the right hand and a Sacred Seal in the left, then cast before combat. It cannot coexist with another weapon coating.",
    wiki: "https://eldenring.wiki.gg/wiki/Electrify_Armament", castOrder: 70,
  },
  {
    id: "poison-armament", name: "Poison Armament", acquisitionItem: "Poison Armament", kind: "incantation", group: "weapon",
    aliases: ["poison armament"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "10 Faith",
    effect: "Coats a compatible right-hand weapon with poison.",
    acquisition: "Kill the invisible Teardrop Scarab on the north-east edge of Aeonia Swamp in Caelid; watch the glowing tracks and strike ahead of them.",
    activation: "Put a compatible weapon in the right hand and a Sacred Seal in the left, memorize the spell and cast before combat.",
    wiki: "https://eldenring.wiki.gg/wiki/Poison_Armament", castOrder: 70,
  },
  {
    id: "black-flame-blade", name: "Black Flame Blade", acquisitionItem: "Black Flame Blade", kind: "incantation", group: "weapon",
    aliases: ["black flame blade"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "17 Faith",
    effect: "Briefly coats a compatible right-hand weapon in black flame; it is intended to be recast around attack openings.",
    acquisition: "In Stormveil, use one Stonesword Key on the cellar fog wall below Rampart Tower, take the Godskin Prayerbook and give it to Miriel or Corhyn, then buy the incantation.",
    activation: "Memorize it, hold a compatible right-hand weapon and a Sacred Seal, then cast immediately before attacking because the coating is very short.",
    wiki: "https://eldenring.wiki.gg/wiki/Black_Flame_Blade", castOrder: 95,
  },
  {
    id: "orders-blade", name: "Order's Blade", acquisitionItem: "Order's Blade", kind: "incantation", group: "weapon",
    aliases: ["order s blade", "orders blade"], catalyst: "Sacred Seal", memorySlots: 1, requirements: "13 Intelligence and 13 Faith",
    effect: "Adds holy damage to a compatible right-hand weapon and is especially useful against Those Who Live in Death.",
    acquisition: "Meet D west of Summonwater Village, exhaust his dialogue and buy the incantation from him for 3,000 runes at the village or Roundtable Hold.",
    activation: "Put the compatible weapon in the right hand and a Sacred Seal in the left, then cast before combat.",
    wiki: "https://eldenring.wiki.gg/wiki/Order%27s_Blade", castOrder: 70,
  },
  {
    id: "scholars-shield", name: "Scholar's Shield", acquisitionItem: "Scholar's Shield", kind: "sorcery", group: "shield",
    aliases: ["scholar s shield", "scholars shield"], catalyst: "Glintstone Staff", memorySlots: 1, requirements: "12 Intelligence",
    effect: "Improves the damage negation and guard boost of the shield held in the left hand.",
    acquisition: "Defeat the Mad Pumpkin Head below Waypoint Ruins, speak to Sorceress Sellen and buy the sorcery for 2,500 runes.",
    activation: "Hold the shield in the left hand and a staff in the right, cast the sorcery, then return the main weapon to the right hand without unequipping the shield.",
    wiki: "https://eldenring.wiki.gg/wiki/Scholar%27s_Shield", castOrder: 70,
  },
  {
    id: "terra-magica", name: "Terra Magica", acquisitionItem: "Terra Magica", kind: "sorcery", group: "field",
    aliases: ["terra magica"], catalyst: "Glintstone Staff", memorySlots: 1, requirements: "20 Intelligence",
    effect: "Creates a sigil that raises magic damage while the caster remains inside it.",
    acquisition: "Clear Academy Crystal Cave in western Liurnia, defeat the two Crystalians, take the lift behind their arena and open the chest at the top of the academy tower.",
    activation: "Memorize it and cast with a staff at the place from which you intend to attack; stay inside the sigil while dealing magic damage.",
    wiki: "https://eldenring.wiki.gg/wiki/Terra_Magica", castOrder: 50,
  },
  {
    id: "unseen-form", name: "Unseen Form", acquisitionItem: "Unseen Form", kind: "sorcery", group: "body",
    aliases: ["unseen form"], catalyst: "Glintstone Staff", memorySlots: 1, requirements: "16 Intelligence",
    effect: "Makes the caster harder for enemies to detect for a short time.",
    acquisition: "Solve the Mirage Rise phantom-crests puzzle in western Altus, climb the revealed tower and open the chest at the top.",
    activation: "Memorize and cast it with a staff before stealth approaches. It is a body buff and will replace another body buff.",
    wiki: "https://eldenring.wiki.gg/wiki/Unseen_Form", castOrder: 90,
  },
];

const skillBuffs: BuildBuff[] = [
  ["golden-vow-ash", "Golden Vow (skill)", "Ash of War: Golden Vow", "aura", ["golden vow"], "Apply the Ash of War to a spare light weapon or the listed main weapon at a grace, then use the skill with the party nearby before combat."],
  ["cragblade", "Cragblade", "Ash of War: Cragblade", "weapon", ["cragblade"], "Apply it to the listed compatible weapon at a grace and use the skill before attacking; the weapon coating and stance-damage bonus are temporary."],
  ["determination", "Determination", "Ash of War: Determination", "weapon", ["determination"], "Apply it to the listed weapon and activate it immediately before the attack you want to strengthen."],
  ["royal-knights-resolve", "Royal Knight's Resolve", "Ash of War: Royal Knight's Resolve", "weapon", ["royal knight s resolve"], "Apply it to the listed weapon and activate it immediately before the high-damage hit; changing weapons removes the effect."],
  ["war-cry", "War Cry", "Ash of War: War Cry", "body", ["war cry"], "Apply it at a grace, then activate it before combat to gain its temporary attack bonus and altered heavy attacks."],
  ["barbaric-roar", "Barbaric Roar", "Ash of War: Barbaric Roar", "body", ["barbaric roar"], "Apply it at a grace, then activate it before combat for its temporary attack bonus and altered heavy-attack chain."],
  ["braggarts-roar", "Braggart's Roar", "Ash of War: Braggart's Roar", "body", ["braggart s roar"], "Apply it to the compatible weapon and activate it before combat. It is a body buff, so another body buff will replace it."],
  ["seppuku", "Seppuku", "Ash of War: Seppuku", "weapon", ["seppuku"], "Apply it to the compatible weapon and activate it before combat to add blood loss; repeat separately for each weapon in a dual-wield setup."],
  ["sacred-order", "Sacred Order", "Ash of War: Sacred Order", "weapon", ["sacred order"], "Apply it to the listed compatible weapon and activate it before combat for the temporary holy weapon buff."],
  ["flaming-strike", "Flaming Strike coating", "Ash of War: Flaming Strike", "weapon", ["flaming strike"], "Use the skill, then press the heavy-attack follow-up to coat the weapon in fire; the initial flame alone does not apply the coating."],
  ["chilling-mist", "Chilling Mist coating", "Ash of War: Chilling Mist", "weapon", ["chilling mist"], "Use the skill to create the frost cloud and coat the weapon; the coating is temporary."],
  ["poisonous-mist", "Poisonous Mist coating", "Ash of War: Poisonous Mist", "weapon", ["poisonous mist"], "Use the skill to create the poison cloud and coat the weapon before continuing the attack chain."],
  ["lightning-slash", "Lightning Slash coating", "Ash of War: Lightning Slash", "weapon", ["lightning slash"], "Use the skill to strike and leave the weapon temporarily coated in lightning."],
  ["endure", "Endure", "Ash of War: Endure", "body", ["endure"], "Apply it at a grace and activate immediately before committing to a close-range trade; its defence and poise window is very short."],
  ["barricade-shield", "Barricade Shield", "Ash of War: Barricade Shield", "shield", ["barricade shield"], "Apply it to the listed shield and activate before blocking a demanding attack string."],
] .map(([id, name, acquisitionItem, group, aliases, activation]) => ({
  id, name, acquisitionItem, group, aliases, activation,
  kind: "ash" as const, effect: "Temporary buff supplied by the selected build's weapon skill.",
  acquisition: `Obtain ${acquisitionItem} at the route card shown for the selected build, then apply it at a Site of Grace or through Smithing Master Hewg.`,
  wiki: `https://eldenring.wiki.gg/wiki/${String(acquisitionItem).replace(/ /g, "_").replace(/'/g, "%27")}`,
  castOrder: group === "aura" ? 30 : group === "weapon" ? 70 : 90,
})) as BuildBuff[];

const normal = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const includesAlias = (text: string, aliases: string[]) => aliases.some((alias) => text.includes(normal(alias)));

export const buildBuffs = [...spellBuffs, ...skillBuffs];

export function buffsForLoadout(loadout: { spells: string[]; skill: string }) {
  const spellText = normal(loadout.spells.join(" | "));
  const skillText = /default skill|no ash of war pickup required/i.test(loadout.skill) ? "" : normal(loadout.skill);
  const goldenVowAshInSpellNotes = /\bgolden vow ash of war\b/.test(spellText);
  const matches = [
    ...spellBuffs.filter((buff) => !(goldenVowAshInSpellNotes && buff.id === "golden-vow-spell") && includesAlias(spellText, buff.aliases)),
    ...skillBuffs.filter((buff) => includesAlias(skillText, buff.aliases)),
    ...(goldenVowAshInSpellNotes ? skillBuffs.filter((buff) => buff.id === "golden-vow-ash") : []),
  ];
  return matches.filter((buff, index) => matches.findIndex((candidate) => candidate.id === buff.id) === index);
}

export function buffForPickup(item: string, slot?: string) {
  const itemName = normal(item);
  return buildBuffs.find((buff) => normal(buff.acquisitionItem) === itemName && (slot !== "skill" || buff.kind === "ash"))
    || buildBuffs.find((buff) => normal(buff.acquisitionItem) === itemName);
}

export function buffSupportItems(loadout: { weapon: string; offhand: string; spells: string[]; skill: string }) {
  const buffs = buffsForLoadout(loadout).filter((buff) => buff.kind === "incantation" || buff.kind === "sorcery");
  const equipment = normal(`${loadout.weapon} ${loadout.offhand}`);
  const items: Array<{ item: string; slot: string }> = [];
  if (buffs.some((buff) => buff.catalyst === "Sacred Seal") && !equipment.includes("seal")) items.push({ item: "Finger Seal", slot: "buff catalyst" });
  if (buffs.some((buff) => buff.catalyst === "Glintstone Staff") && !/staff|scepter/.test(equipment)) items.push({ item: "Demi-Human Queen's Staff", slot: "buff catalyst" });
  const listedSpells = new Set(loadout.spells.map(normal).filter((spell) => spell && !/^(?:none|n a|any other|up to you)/.test(spell)));
  const memorySlots = Math.max(buffs.reduce((total, buff) => total + (buff.memorySlots || 0), 0), listedSpells.size);
  const memoryStones = [
    "Memory Stone - Twin Maiden Husks", "Memory Stone - Oridys's Rise", "Memory Stone - Converted Tower",
    "Memory Stone - Testu's Rise", "Memory Stone - Raya Lucaria Academy", "Memory Stone - Seluvis's Rise",
    "Memory Stone - Lenne's Rise", "Memory Stone - Hermit Village",
  ];
  for (let index = 0; index < Math.min(memoryStones.length, Math.max(0, memorySlots - 2)); index += 1) items.push({ item: memoryStones[index], slot: "memory slot" });
  return items;
}

export function buffRoutine(loadout: { spells: string[]; skill: string }) {
  const buffs = buffsForLoadout(loadout).sort((left, right) => left.castOrder - right.castOrder);
  if (!buffs.length) return "No active buff is specified by this sourced stage.";
  const spellBuffsInRoutine = buffs.filter((buff) => buff.memorySlots);
  const catalysts = Array.from(new Set(spellBuffsInRoutine.map((buff) => buff.catalyst).filter(Boolean)));
  const groups = new Map<BuffGroup, BuildBuff[]>();
  buffs.forEach((buff) => groups.set(buff.group, [...(groups.get(buff.group) || []), buff]));
  const clashes = [...groups.entries()].filter(([group, values]) => ["body", "weapon", "regeneration", "shield"].includes(group) && values.length > 1);
  return [
    spellBuffsInRoutine.length ? `At a grace, memorize ${spellBuffsInRoutine.map((buff) => `${buff.name} (${buff.memorySlots} slot)`).join(", ")}${catalysts.length ? ` and equip ${catalysts.join(" plus ")}` : ""}.` : "",
    `Use in this order: ${buffs.map((buff, index) => `${index + 1}) ${buff.name}`).join("; ")}.`,
    clashes.length ? `Only one ${clashes.map(([group]) => group).join(" or ")} buff in the same category remains active; use the one appropriate to the encounter instead of casting both.` : "",
  ].filter(Boolean).join(" ");
}
