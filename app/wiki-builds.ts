// Generated from canonical Fextralife Build Guides pages by scripts/import-fextralife-builds.mjs.
// Do not hand-edit sourced loadouts; rerun the importer against the live MediaWiki API.
import type { Build } from "./data";

export const wikiBuilds: Build[] = [
  {
    "id": "fextra-allknowingsage",
    "name": "All-Knowing Sage",
    "stats": "INT / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Staff of the Great Beyond, while not offering the highest sorcery scaling, provides decent performance at 50 Intelligence and 50 Faith, achieving 315 sorcery scaling. This flexibility allows players to cast a variety of spells without swapping gear. This build also leverages the Sword of Night and Flame, which scales well with Intelligence and Faith, and provides versatile combat options with its powerful magic and fire-based weapon skills. The Bloodsucking Cracked Tear for a 20% damage boost, countering its health-draining effect with the Blessing of the Erdtree spell. The spell selection for this build is diverse, catering to different elemental damage types. For Holy damage, \"Multilayered Ring of Light\" and \"Elden Stars\" are effective, with the former being particularly versatile and the latter useful for initiating boss fights. Lightning spells include \"Knight's Lightning Spear\" and \"Ancient Dragons' Lightning Strike,\" both of which deliver high damage and stance-breaking potential. Fire spells like \"Flame of the Fell God\" and \"Giantsflame Take Thee\" are excellent for their respective scenarios. Magic damage spells include \"Ancient Death Rancor,\" \"Night Comet,\" and \"Loretta's Greatbow,\" each providing unique advantages in different combat situations. For physical damage, \"Pest-Threaded Spears,\" \"Stone of Gurranq,\" and \"Rock Sling\" offer powerful options, though elemental spells are generally preferred due to their synergy with various buffs.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 172",
      "mid": "Published from 172",
      "late": "Published from 172",
      "dlc": "Staff of the Great Beyond, and Sword of Night and Flame"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "172",
      "weapon": "Staff of the Great Beyond, and Sword of Night and Flame",
      "offhand": "No off-hand item required",
      "skill": "Night-and-Flame Stance",
      "talismans": [
        "Godfrey Icon",
        "Graven-Mass Talisman",
        "Flock's Canvas Talisman",
        "Magic Scorpion Charm"
      ],
      "armour": "Greathelm, All-Knowing Armor, All-Knowing Gauntlets, All-Knowing Greaves",
      "spells": [
        "Multilayered Ring of Light",
        "Elden Stars",
        "Knight's Lightning Spear",
        "Ancient Dragons' Lightning Strike",
        "Flame of the Fell God",
        "Giantsflame Take Thee",
        "Frenzied Burst",
        "Rykard's Rancor",
        "Ancient Death Rancor",
        "Night Comet",
        "Loretta's Greatbow",
        "Mass of Putrescence",
        "Pest-Thread Spears",
        "Stone of Gurranq",
        "Rock Sling"
      ],
      "flask": "Equal Charges; Physick: Bloodsucking Cracked Tear, Oil-Soaked Tear",
      "stats": "Intelligence, Vigor, Faith; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: All-Knowing Sage",
      "url": "https://eldenring.wiki.fextralife.com/All-Knowing_Sage_Build"
    }
  },
  {
    "id": "fextra-archer",
    "name": "Archer",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This is a true weapon-only archer with no melee fallback. Open normal encounters with the Longbow and Mighty Shot, using the longer draw only while the target is unaware or locked in an animation; once an enemy crosses into short range, swap to the Shortbow so rolling and jumping shots preserve movement. Barrage is reserved for a boss recovery, a large stationary target, or a status-arrow window because holding it in neutral drains FP and stamina while leaving no guard option. Normal arrows handle weak enemies economically, while expensive ammunition should be saved for targets that survive long enough to justify it. Dexterity raises bow damage, Mind buys more skill use, and Vigor and Endurance prevent one missed spacing check from ending the fight. The build succeeds by controlling distance and planning ammunition, not by trading hits.",
    "complexity": "Published guide",
    "phases": {
      "early": "Shortbow and Longbow",
      "mid": "Shortbow and Longbow",
      "late": "Shortbow and Longbow",
      "dlc": "Shortbow and Longbow"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "ranged-attacks"
    ],
    "startingClass": "Bandit",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Shortbow and Longbow",
      "offhand": "No off-hand item required",
      "skill": "Ash of War: Barrage & Ash of War: Mighty Shot",
      "talismans": [],
      "armour": "Light or medium weight",
      "spells": [],
      "flask": "Split between HP and FP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Dexterity & Mind; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Archer",
      "url": "https://eldenring.wiki.fextralife.com/Archer_Build"
    }
  },
  {
    "id": "fextra-barbarian",
    "name": "Barbarian",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "The Zweihander turns War Cry into a charged-attack build: activate the skill before contact, then its temporary weapon buff replaces the normal heavy with a forward-driving charge that can interrupt light enemies and build stance damage quickly. In the field, draw one target at a time, start the charged heavy outside its swing, and use a normal light only when the first impact leaves a safe finish. Against bosses, refresh War Cry before the opener, release one fully charged heavy into a long recovery, and take the critical after a stance break instead of emptying the stamina bar on another swing. Axe Talisman raises fully charged attacks, while high Vigor, Endurance and poise make a deliberate trade survivable without giving up a medium roll. War Cry costs FP only when refreshed, but every transformed heavy consumes enough stamina that one must remain in reserve for defence. Fast or evasive bosses can step around the linear charge, and a missed Zweihander heavy has a long recovery, so the build rewards prediction rather than repeated R2 inputs.",
    "complexity": "Published guide",
    "phases": {
      "early": "Zweihander",
      "mid": "Zweihander",
      "late": "Zweihander",
      "dlc": "Zweihander"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "charged-attacks"
    ],
    "startingClass": "Hero",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Zweihander",
      "offhand": "No off-hand item required",
      "skill": "Ash of War: War Cry",
      "talismans": [],
      "armour": "Heavies you can and still med roll (high Poise ideal)",
      "spells": [],
      "flask": "Mostly HP, 1 or 2 FP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Strength & Endurance; Vigor & Dexterity"
    },
    "source": {
      "label": "Fextralife: Barbarian",
      "url": "https://eldenring.wiki.fextralife.com/Barbarian_Build"
    }
  },
  {
    "id": "fextra-battlemage",
    "name": "Battlemage",
    "stats": "STR / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "A melee mage Build that uses Sorceries as their only means of damage while wielding a Shield in their off-hand to protect themselves and buff their damage. Carian Greatsword is there for AoE when needed, and Loretta's Greatbow is there for long range damage as necessary. The way this Build works is that you use the Jellyfish Shield in your left hand and the Carian Glintstone Staff in your right, and use Carian Slicer as your melee attack. It's cheaper than Glintstone Pebble, allowing you to use it nearly twice as much, helping to preserve FP. You can use your Jellyfish Shield to Block effectively, and also use its Skill: Contagious Fury to boost your damage by 20% for 30 seconds, including your Spell Damage. This lets you defeat enemies more easily, and sometimes gives you just enough damage to one shot enemies with Glintstone Pebble. Raises attack power for a certain duration.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Carian Glintstone Staff",
      "dlc": "Carian Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Carian Glintstone Staff",
      "offhand": "Jellyfish Shield",
      "skill": "Contagious Fury",
      "talismans": [],
      "armour": "Any that can med roll",
      "spells": [
        "Carian Slicer",
        "Carian Greatsword",
        "Carian Piercer",
        "Glintstone Pebble",
        "Loretta's Greatbow"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Mind, Vigor & Strength"
    },
    "source": {
      "label": "Fextralife: Battlemage",
      "url": "https://eldenring.wiki.fextralife.com/Battlemage_Build"
    }
  },
  {
    "id": "fextra-berserker",
    "name": "Berserker",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength-based Bulid that focuses on deal high damage per swing and via Jump Attacks. You can use Quickstep to dodge attacks and position yourself behind or on the side of enemies easily for follow up attacks as well after landing a Jump Attack. Jumping with L1 is absolutely devastating and one shots most enemies, and staggers those it doesn't allowing you to roll away or Quickstep away easily. Heavy Armor and high Endurance allows you good Physical protection while allowing you to still med roll, which is a must. You need to be able to roll well, even if you do have Quickstep. Eventually you can wear the heaviest armor you find and stop worrying about med roll and just use Quickstep once you get the hang of it.",
    "complexity": "Published guide",
    "phases": {
      "early": "Claymore and Lordsworn's Greatsword",
      "mid": "Claymore and Lordsworn's Greatsword",
      "late": "Claymore and Lordsworn's Greatsword",
      "dlc": "Claymore and Lordsworn's Greatsword"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "skill-damage"
    ],
    "startingClass": "Vagabond",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Claymore and Lordsworn's Greatsword",
      "offhand": "No off-hand item required",
      "skill": "Ash of War: Quickstep",
      "talismans": [],
      "armour": "Heaviest you can wear and still med roll",
      "spells": [],
      "flask": "All HP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Endurance & Vigor; Strength & Dexterity"
    },
    "source": {
      "label": "Fextralife: Berserker",
      "url": "https://eldenring.wiki.fextralife.com/Berserker_Build"
    }
  },
  {
    "id": "fextra-blackarrow",
    "name": "Black Arrow",
    "stats": "STR / DEX / FAI / VIG",
    "role": "Published build",
    "playstyle": "A Bow Build that focuses on the use of the Black Bow to take down enemies and bosses at range. Blue Dancer Charm gives you a decent amount of damage with this build as long as you can keep your equip load low. The way this Build works is that you'll buff with Golden Vow and use Barrage against hard to kill enemies, otherwise you'll jump shoot and land shoot enemies or roll shoot them with your Bow, since Black Bow operates like a Shortbow, allowing you to do this. Flame, Grant Me Strength is useful when you need even more damage. You do 100% physical damage with this build, so this really helps out, and the Old Lord's Talisman helps extend the duration so you don't have to rebuff so quickly.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Black Bow & any Seal that weighs nothing",
      "dlc": "Black Bow & any Seal that weighs nothing"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Black Bow & any Seal that weighs nothing",
      "offhand": "No off-hand item required",
      "skill": "Barrage",
      "talismans": [
        "Old Lord's Talisman",
        "Arrow's Sting Talisman",
        "Shard of Alexander (or Ritual Sword Talisman)",
        "Blue Dancer Charm"
      ],
      "armour": "Little or no Armor",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP, few FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor & Faith"
    },
    "source": {
      "label": "Fextralife: Black Arrow",
      "url": "https://eldenring.wiki.fextralife.com/Black_Arrow_Build"
    }
  },
  {
    "id": "fextra-blackblade",
    "name": "Black Blade",
    "stats": "STR / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "The Black Blade Build uses the Black Blade Incantation to open difficult fights, placing a -10% Max Health debuff on the enemy or Boss for a short time from range. This HP does not come back once this buff expires, so it's only necessary to use this once per fight, but you can use it again if you need a ranged option. Ideally you want to use Destined Death from Maliketh's Black Blade immediately after this because Destined Death also applies a stacking -10% Max Health debuff. If both of these are applied at the same time, then the enemy or Boss loses 20% of their Max HP that doesn't come back. Use Golden Vow to boost your damage and defenses, and Blessing of the Erdtree to keep your HP topped off. You can add other Incantations if you want because you'll have decent Incantation Scaling with the Clawmark Seal since you prioritize Strength and Faith. Use Jump Attacks on regular enemies, and remember that R1s and R2s with Maliketh's Black Blade have some hyper armor, allowing you to attack through other attacks most of the time. In addition to dealing immediate damage, this attack reduces the enemy's maximum HP and continues to wear down HP for a short time.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Maliketh's Black Blade & Clawmark Seal",
      "dlc": "Maliketh's Black Blade & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Maliketh's Black Blade & Clawmark Seal",
      "offhand": "No off-hand item required",
      "skill": "Destined Death",
      "talismans": [
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander",
        "Sacred Scorpion Charm",
        "Claw Talisman"
      ],
      "armour": "Maliketh's Set or any Armor with high Poise",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Black Blade"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Black Blade",
      "url": "https://eldenring.wiki.fextralife.com/Black_Blade_Build"
    }
  },
  {
    "id": "fextra-blackflamespellblade",
    "name": "Black Flame Spellblade",
    "stats": "DEX / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "You'll use your Ash of War, whichever one you chose to help set Hemorrhage or Black Flame, depending on what you're facing. Black Flame Blade is more useful when enemies cannot Bleed, when cooperating, or when you cannot hit an enemy often enough to set Hemorrhage because they are so aggressive. You'll use Black Flame when you need range, and Scouring Black Flame when you need AoE. The way this Build works is that you'll choose one of the weapons listed above because they come with Bleed on them natively, they call be buffed with Bloodflame Blade, and they can use the Ashes of War listed above. You'll buff with Bloodflame Blade and Golden Vow as you make your way through Dungeons to increase your damage and Bleeding, and also your protection. A favorite skill of dexterous warriors. This momentum can connect into a final heavy attack. Perform a crossing slash attack from a low stance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Cross-Naginata, Flamberge, Scythe, Grave Scythe, Nagakiba",
      "dlc": "Cross-Naginata, Flamberge, Scythe, Grave Scythe, Nagakiba"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Cross-Naginata, Flamberge, Scythe, Grave Scythe, Nagakiba",
      "offhand": "Finger Seal",
      "skill": "Repeating Thrust, Spinning Slash, Sword Dance or Double Slash",
      "talismans": [],
      "armour": "Any that allows for med roll",
      "spells": [
        "Bloodflame Blade",
        "Black Flame Blade",
        "Black Flame",
        "Scouring Black Flame",
        "Golden Vow"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Dexterity; Mind & Vigor"
    },
    "source": {
      "label": "Fextralife: Black Flame Spellblade",
      "url": "https://eldenring.wiki.fextralife.com/Black_Flame_Spellblade_Build"
    }
  },
  {
    "id": "fextra-blackguard",
    "name": "Black Guard",
    "stats": "DEX / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Back Guard build highlights the Clinging Bone weapon, it has physical and magic damage and is equipped with a unique skill, Lifesteal Fist. The skill shows that it grabs onto a \"humanoid\" type of enemy, it goes through enemies that are even blocking, damaging, and heals about 30% of your max health. The skill predominantly does insane magic damage making it possible to pair with other items such as the Magic Scorpion Charm to further boost its damage. What's also great about this is the flexibility of how you can approach combat, such as using block-counters, dual-wield, you can steal health from your enemies, and you can even swap between the alternate weapons that come with this such as Marais Executioner's Sword or Regalia of Eochaid. As for shields, this build primarily uses the Scorpion Kite Shield because of its low strength requirement, but if you want to have better defenses, you can opt for the Jellyfish Shield in exchange for points into the strength requirement. By having these pieces on, the build can reach the desired number of Poise so that you can trade hits and use other talismans that can benefit the weapons of this build. For talismans, Ritual Sword Talisman is good to raise the attack power when you're at max HP, and considering that you have a lifesteal skill, you'll most likely be at max HP for most of the time, so why not have that boost of damage whenever you're healthy.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Clinging Bone; Marais Executioner's Sword",
      "dlc": "Clinging Bone; Marais Executioner's Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "light-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Light attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "Dexterity Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Clinging Bone; Marais Executioner's Sword",
      "offhand": "Scorpion Kite Shield; Finger Seal",
      "skill": "Lifesteal Fist, Eochaid's Dancing Blade",
      "talismans": [
        "Ritual Sword Talisman",
        "Rotten Winged Sword Insignia",
        "Winged Sword Insignia",
        "Shard of Alexander"
      ],
      "armour": "Greathelm, Royal Remains Armor, Lionel's Gauntlets, Royal Remains Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Thorny Cracked Tear",
      "stats": "Dexterity, Arcane, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Black Guard",
      "url": "https://eldenring.wiki.fextralife.com/Black_Guard_Build"
    }
  },
  {
    "id": "fextra-blackhammer",
    "name": "Black Hammer",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build that utilizes the DLC exclusive Black Steel Greathammer that deals heavy holy damage. The Holy-Shrouding Cracked Tear is recommended to further boost holy damage, while the Stonebarb Cracked Tear is used to enhance stance-breaking potential, making it easier to land critical hits on bosses. For Great Runes, Radahn's Great Rune is favored for its boost to health, FP, and stamina, though Godrick's Great Rune is also a viable option for players who choose to use Sacred Order, as it enhances multiple stats. The Black Hammer build in Elden Ring's Shadow of the Erdtree DLC revolves around the Black Steel Greathammer, a unique weapon that deals both physical and holy damage. This weapon stands out due to its innate scaling with Strength, Dexterity, and Faith, and its ability to be infused with Ashes of War or weapon buffs, making it highly versatile. One of the most distinctive features of this weapon is its unique block counter mechanic, where dragging the hammer along the ground creates a trail of holy damage, reminiscent of the Black Knights who wielded this weapon. The initial strike deals damage proportional to the weapon's scaling, with the block counter trail dealing 100% holy damage. For this build, a Sacred infusion is recommended as it offers slightly more damage output on the holy trail than a Heavy infusion, especially at higher levels.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 165",
      "mid": "Published from 165",
      "late": "Published from 165",
      "dlc": "Black Steel Greathammer"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "165",
      "weapon": "Black Steel Greathammer",
      "offhand": "Clawmark Seal,; Black Steel Greatshield",
      "skill": "Sacred Blade",
      "talismans": [
        "Two-Headed Turtle Talisman",
        "Curved Sword Talisman",
        "Blade of Mercy"
      ],
      "armour": "Helm of Night, Black Knight Armor, Gauntlets of Night, Black Knight Greaves",
      "spells": [
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Holy-Shrouding Cracked Tear, Stonebarb Cracked Tear",
      "stats": "Vigor, Faith; Endurance, Strength, Mind"
    },
    "source": {
      "label": "Fextralife: Black Hammer",
      "url": "https://eldenring.wiki.fextralife.com/Black_Hammer_Build"
    }
  },
  {
    "id": "fextra-blackknifeassassin",
    "name": "Black Knife Assassin",
    "stats": "DEX / FAI / VIG",
    "role": "Published build",
    "playstyle": "A Dexterity/Faith Build that uses dual Daggers to rapidly strike enemies and Bosses for high damage the further into combo chains you go. The way this Build works is that you'll buff with Golden Vow and then you'll use your L1 combos to stun lock most enemies, building up your Attack Power because of Millicent's Prosthesis and Winged Sword Insignia. You can use Bloodhound's Step to dodge easily, or you can use Quickstep if you find it difficult to use Bloodhound's Step. You can use Blessing of the Erdtree and Flame, Grant Me Strength to buff healing and damage for Boss fights. And you can use Blade of Death when you need a ranged option, because melee wouldn't work or work well. Because you have high Poise from your Armor setup, and you because you'll be using the Dragoncrest Greatshield Talisman, you can trade damage without being interrupted quite often, and you'll have very good protection. Unleash the power of the Rune of Death to fire off a blade-like projectile. In addition to dealing immediate damage, the blade reduces the enemy's maximum HP and continues to wear down HP for a while.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Erdsteel Dagger x2, Black Knife & any Sacred Seal",
      "dlc": "Erdsteel Dagger x2, Black Knife & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "critical-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Critical attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Erdsteel Dagger x2, Black Knife & any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "Blade of Death, Bloodhound's Step & Parry",
      "talismans": [
        "Winged Sword Insignia",
        "Millicent's Prosthesis",
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander"
      ],
      "armour": "Black Knife Hood, Black Knife Armor, Fire Prelate Gauntlets & Fire Prelate Greaves",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Faith; Vigor"
    },
    "source": {
      "label": "Fextralife: Black Knife Assassin",
      "url": "https://eldenring.wiki.fextralife.com/Black_Knife_Assassin_Build"
    }
  },
  {
    "id": "fextra-blackflameapostle",
    "name": "Blackflame Apostle",
    "stats": "DEX / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Faith-Dex Build that focuses on the use of Black Flame to boost damage and give multiple options to every scenario. Black Flame Blade has a very short cast time but very short duration. It does extra damage, and it's damage over time is based on the Max HP of the enemy, so it's more effective against high HP targets like Bosses and tough enemies, and is fantastic in Co Op where Bosses and enemies have even more HP. It also is good against enemies that can't Bleed. The way this Build works is that you'll carry your Seal in your left hand and weapon in your right, buffing it with either Black Flame Blade or Bloodflame Blade depending on the circumstance. Bloodflame Blade will boost your Bleed build up on your weapon, so if it already has Bleed on it, it will be even higher. It also boosts damage a bit. Blood Oath skill granted by the Lord of Blood.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Any Weapon that has Bleed on it by default such as the Uchigatana, Nightrider Flail",
      "late": "Any Weapon that has Bleed on it by default such as the Uchigatana, Nightrider Flail",
      "dlc": "Any Weapon that has Bleed on it by default such as the Uchigatana, Nightrider Flail"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "status-buildup"
    ],
    "startingClass": "Prophet",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Any Weapon that has Bleed on it by default such as the Uchigatana, Nightrider Flail",
      "offhand": "Finger Seal",
      "skill": "Bloody Slash or Unsheathe work well, but you can use any you like",
      "talismans": [],
      "armour": "Any",
      "spells": [
        "Black Flame",
        "Black Flame Blade",
        "Catch Flame",
        "Bloodflame Blade"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Mind; Vigor & Dexterity"
    },
    "source": {
      "label": "Fextralife: Blackflame Apostle",
      "url": "https://eldenring.wiki.fextralife.com/Blackflame_Apostle_Build"
    }
  },
  {
    "id": "fextra-blackflamebushido",
    "name": "Blackflame Bushido",
    "stats": "DEX / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Dexterity/Faith Build that uses the Cross-Naginata to set Hemorrhage and Black Flame on enemies in melee range. Black Flame Blade is used on more difficult enemies, and since you have high Faith the damage it adds to your attacks is substantial, and this is in addition to the Black Flame damage over time it places on the enemy. Black Flame is great for range when you need it, and Scouring Black Flame is a good AoE that can hit multiple enemies and is good at mid range when enemies are aggressive, and Black Flame might miss. It works well to charge it for a larger radius, making it hit more effectively and increasing its damage due to Godfrey Icon. The way this Build works is that you'll buff with Golden Vow and you'll use Bloodflame Blade to help set Hemorrhage on most regular enemies, as it adds to the native bleeding of the Cross-Naginata or Nagakiba. You'll then use Phantom Slash if you're using Cross-Naginata or Sword Dance or Double Slash if you're using Nagakiba. Phantom Slash applies Bloodflame Blade if you're buffed with it to its attacks, and what's great is that it will connect even if you get staggered during your own attack animation, allowing you to stagger enemies in many cases, and allowing you to recover and attack. You'll have to choose your openings a bit more carefully when using Sword Dance or Double Slash, but Sword Dance still has fantastic range.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Cross-Naginata",
      "dlc": "Cross-Naginata"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Cross-Naginata",
      "offhand": "Finger Seal",
      "skill": "Phantom Slash, Sword Dance or Double Slash",
      "talismans": [
        "Shard of Alexander",
        "Radagon's Soreseal",
        "Godfrey Icon",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "White Mask & White Reed Set",
      "spells": [
        "Golden Vow",
        "Black Flame",
        "Bloodflame Blade",
        "Black Flame Blade",
        "Scouring Black Flame",
        "Black Flame Ritual",
        "Black Flame's Protection"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Blackflame Bushido",
      "url": "https://eldenring.wiki.fextralife.com/Blackflame_Bushido_Build"
    }
  },
  {
    "id": "fextra-blasphemousbeastmaster",
    "name": "Blasphemous Beastmaster",
    "stats": "STR / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Strength/Faith hybrid build that uses Bestial Incantations and the Blasphemous Blade to destroy enemies at range or in melee combat. The way this Build works is that you'll focus on using Stone of Gurranq to range down enemies when you can, using the Blasphemous Blade as back up for instances where it is just easier to melee enemies or use Taker's Flames. You'll buff with Golden Vow constantly to maintain this buff whenever you are in combat, using Flame, Grant Me Strength for tougher enemies and boss fights. Beast Claw is used for AoE if you need any, and Bestial Sling can be used to take down big targets from close range if you need it. You'll carry the Blasphemous Blade and Clawmark Seal in your right hand and Cinquedea in your left, two-handing the Seal when you cast spells to gain extra damage from Strength Scaling, and bonus damage to Bestial Incantations from Cinquedea. Raise the sacred sword aloft to set it ablaze with blasphemous flames, then bring it down to fire off a forward blast.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Blasphemous Blade, Cinquedea, Clawmark Seal",
      "dlc": "Blasphemous Blade, Cinquedea, Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Blasphemous Blade, Cinquedea, Clawmark Seal",
      "offhand": "No off-hand item required",
      "skill": "Taker's Flames",
      "talismans": [
        "Ritual Sword Talisman",
        "Radagon's Soreseal",
        "Green Turtle Talisman",
        "Dragoncrest Shield Talisman +1"
      ],
      "armour": "Any that still allows you to med roll",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Stone of Gurranq",
        "Beast Claw",
        "Bestial Sling"
      ],
      "flask": "Some HP, mostly FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Blasphemous Beastmaster",
      "url": "https://eldenring.wiki.fextralife.com/Blasphemous_Beastmaster_Build"
    }
  },
  {
    "id": "fextra-blasphemousherald",
    "name": "Blasphemous Herald",
    "stats": "STR / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "A melee build that uses Jump Attacks and the Blasphemous Blade to demolish enemies point blank and at range. You'll swap to Gargoyle's Blackblade when Fire Damage is resisted to give you Holy Damage, and you'll change the Affinity on the Gargoyle's Greatsword to Sacred with the Sacred Order Ash of War. The way this Build works is that you'll buff with Golden Vow as you'll use Jump Attacks to destroy enemies with Blasphemous Blade in the right hand and Gargoyle's Greatsword in the left. You'll swap the damage type of the Gargoyle's Greatsword to Flame Art with Flaming Strike, when using Blasphemous Blade. And Jump Attacks are deadly with Raptor's Black Feathers and Claw Talisman. Clawmark Seal also allows you to cast Incantations with decent Scaling in a pinch, though you won't lean on them as you'll do way more damage with Jump Attacks and Taker's Flame/Corpse Wax Cutter. Raise the sacred sword aloft to set it ablaze with blasphemous flames, then bring it down to fire off a forward blast. Lost skill of ancient heroes.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Blasphemous Blade, Gargoyle's Blackblade, Gargoyle's Greatsword & Clawmark Seal",
      "dlc": "Blasphemous Blade, Gargoyle's Blackblade, Gargoyle's Greatsword & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Blasphemous Blade, Gargoyle's Blackblade, Gargoyle's Greatsword & Clawmark Seal",
      "offhand": "No off-hand item required",
      "skill": "Taker's Flame, Corpse Wax Cutter, Flaming Strike & Sacred Order",
      "talismans": [
        "Shard of Alexander",
        "Great-Jar's Arsenal",
        "Claw Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Raptor's Black Feathers and any other Armor that allows medium rolling",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Flame, Grant Me Strength",
        "Lightning Spear",
        "Black Flame",
        "Stone of Gurranq"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Blasphemous Herald",
      "url": "https://eldenring.wiki.fextralife.com/Blasphemous_Herald_Build"
    }
  },
  {
    "id": "fextra-blazingblackblade",
    "name": "Blazing Blackblade",
    "stats": "FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Blazing Blackblade build highlights the Hookclaws weapon, it is a good weapon out of all of the claws because you can acquire this weapon easily when you explore Stormveil Castle and it has great length or reach compared to other claws which can be quite an issue when facing enemies or bosses that have unusual design and movement. The Hookclaws in this build come with the Ash of War: Flaming Strike skill and are infused with Flame art. Upgrading the weapon to the Flame art infusion helps in achieving the minimum requirements of the weapon of 8 STR and 14 DEX, allowing the build to focus on upgrading the primary stat of this build, Faith, making it possible to equip any incantation you want to use, or in this case, specifically the spells Golden Vow and Flame, Grant Me Strength that contributes to increasing the damage of the weapon. For Armor, when you start, consider using the Knight Set and switching to Maliketh's Set upon acquiring it late in the game. The reason why the Knight Set and Maliketh's Set are noted above is to acquire that 51 Poise, and you want to have that high poise to determine how you can resist collapsing under enemy attacks since for the most part, this build requires you to trade attacks when in combat. For talismans, first on the list is the Fire Scorpion Charm, which helps increase the weapon's fire damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Hookclaws",
      "dlc": "Hookclaws"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Hookclaws",
      "offhand": "Finger Seal",
      "skill": "Flaming Strike",
      "talismans": [
        "Fire Scorpion Charm",
        "Dragoncrest Greatshield Talisman",
        "Rotten Winged Sword Insignia",
        "Shard of Alexander"
      ],
      "armour": "Knight Set (Early Playthrough), Maliketh's Set (Main Armor set for this build)",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Thorny Cracked Tear",
      "stats": "Faith, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Blazing Blackblade",
      "url": "https://eldenring.wiki.fextralife.com/Blazing_Blackblade_Build"
    }
  },
  {
    "id": "fextra-blazingbushido",
    "name": "Blazing Bushido",
    "stats": "STR / DEX / VIG / MND",
    "role": "Published build",
    "playstyle": "A Samurai Build that uses the Nagakiba and a Greatbow to take on enemies at range or in close combat. Bloodflame Blade applies 40% of your Incantation Scaling to your Weapon as Fire Damage for 60 seconds, and also makes Bleed Build Up last a second or so after you stop swinging, allowing you to set Bleeding more easily on enemies, as their Bleed Bar doesn't deplete as quickly. It has a faster cast time, and you can pull it off in combat with some practice if you need to reapply it. The Greatbow has D/D Scaling with these so it makes sense to pump both for max damage with the Nagakiba and Greatbow. Additionally, keeping the Nagakiba only Physical Damage, will allow you to buff it with Bloodflame Blade. You'll use Flame, Grant Me Strength to buff your Physical and Fire Damage by 20%, which applies to your Bow attacks as well as your Bloodflame Blade, which is excellent. It has short duration so you'll likely use it far more outside of combat than once it has begun.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Nagakiba, Greatbow, Finger Seal",
      "dlc": "Nagakiba, Greatbow, Finger Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Samurai",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Nagakiba, Greatbow, Finger Seal",
      "offhand": "No off-hand item required",
      "skill": "Unsheathe & Rain of Arrows",
      "talismans": [
        "Ritual Sword Talisman",
        "Blessed Dew Talisman",
        "Arrow's Sting Talisman",
        "Carian Filigreed Crest"
      ],
      "armour": "Any that still allows med roll",
      "spells": [
        "Bloodflame Blade",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Blazing Bushido",
      "url": "https://eldenring.wiki.fextralife.com/Blazing_Bushido_Build"
    }
  },
  {
    "id": "fextra-blazingexecutioner",
    "name": "Blazing Executioner",
    "stats": "STR / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength Build that focuses on the use of the Crescent Moon Axe and the Flaming Strike Ash of War. Flaming Strike is exceptional in this build because it will increase your already high damage, but will deal Fire Damage and allow for a follow up attack that deals decent damage. Don't forget that you can just use Flaming Strike without the follow up for easy to kill enemies to save on FP. The way this Build works is that you'll use Flaming Strike to buff your Fire Crescent Moon Axe and than use the R2 and Charged R2 attacks to sweep multiple enemies, and Jump Attacks to take on single enemies. Skill that emits flame in a wide frontward arc. This will also coat the armament in fire.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Levels",
      "mid": "Published from All Levels",
      "late": "Crescent Moon Axe",
      "dlc": "Crescent Moon Axe"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Levels",
      "weapon": "Crescent Moon Axe",
      "offhand": "No off-hand item required",
      "skill": "Flaming Strike",
      "talismans": [
        "Shard of Alexander",
        "Claw Talisman",
        "Dragoncrest Greatshield Talisman",
        "Axe Talisman"
      ],
      "armour": "Raging Wolf Set & Blaidd's Set",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Blazing Executioner",
      "url": "https://eldenring.wiki.fextralife.com/Blazing_Executioner_Build"
    }
  },
  {
    "id": "fextra-blooddancer",
    "name": "Blood Dancer",
    "stats": "DEX / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "An Bleed Build focused on Arcane and the use of Eleonora's Poleblade to deal incredible damage very quickly and set the Hemorrhage status effect. You can use Dragonice to wipe out packs of enemies or to set Frostbite on Bosses, though you'll want to lead with Rotten Breath first if they can be effected by Scarlet Rot. Lightning Spear can be used to pick off lone enemies at range, or to range down a single target, and Dragonclaw is used situationally when you need burst Physical Damage. The way this Build works is that you'll buff with Flame, Grant Me Strength for tough fights to boost both your Physical and Fire Damage, and Eleonora's Poleblade does both. Most of the time you'll be leading with Bloodblade Dance to stagger enemies and to Hemorrhage them as quickly as you can.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Eleonora's Poleblade & Dragon Communion Seal",
      "dlc": "Eleonora's Poleblade & Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Eleonora's Poleblade & Dragon Communion Seal",
      "offhand": "No off-hand item required",
      "skill": "Bloodblade Dance",
      "talismans": [],
      "armour": "Mask of Confidence, and any armor as long as you can med roll",
      "spells": [
        "Dragonclaw",
        "Dragonice",
        "Rotten Breath",
        "Flame, Grant Me Strength",
        "Lightning Spear"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Mind & Dexterity"
    },
    "source": {
      "label": "Fextralife: Blood Dancer",
      "url": "https://eldenring.wiki.fextralife.com/Blood_Dancer_Build"
    }
  },
  {
    "id": "fextra-blooddragon",
    "name": "Blood Dragon",
    "stats": "DEX / FAI / ARC / VIG / END",
    "role": "Published build",
    "playstyle": "The way this Build works is that you will Duplicate the Ashes of War: Bloody Slash to put it on both your Scimitars (or other curved swords), and select the Bleed Affinity so that they both apply Bleed build up when they hit an enemy. This will also allow them to scale with Arcane, which both increases their outright damage, and also increases the amount of Bleed build up they apply when hitting an enemy, making enemies Hemorrhage more quickly, ripping off huge chunks of HP. You can use Bloody Slash against more difficult enemies and Bosses, and its damage increases with weapon upgrades and Arcane, so the more you increase Arcane the more damage this Skill will do. Use this on hard to kill Bosses and enemies as it does incredible damage over time if you can build up their Scarlet Rot bar enough. Dragonclaw is your Spell for tough enemies that turtle behind Shields, making it hard for you to get to them with your Swords. If you have 84 FP you can cast this again much more quickly than the first cast, allowing for a \"two-hit\" combo that should kill almost anything. Blood Oath skill granted by the Lord of Blood. From a low stance, coat the blade in your own blood to unleash a rending blood slash in a wide arc.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Dual Scimitars",
      "late": "Dual Scimitars",
      "dlc": "Dual Scimitars"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "spell-damage"
    ],
    "startingClass": "Warrior",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Dual Scimitars",
      "offhand": "Finger Seal",
      "skill": "Bloody Slash",
      "talismans": [],
      "armour": "Heaviest you can wear and still med roll",
      "spells": [
        "Dragonclaw",
        "Rotten Breath"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Dexterity, Faith and Endurance"
    },
    "source": {
      "label": "Fextralife: Blood Dragon",
      "url": "https://eldenring.wiki.fextralife.com/Blood_Dragon_Build"
    }
  },
  {
    "id": "fextra-bloodlancer",
    "name": "Blood Lancer",
    "stats": "STR / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build that uses the Sword Lance to perform devastating heavy damage towards enemies. This weapon is technically a heavy thrusting sword, with R1 attacks similar to other heavy thrusting swords but R2 attacks that mimic the Lance weapon. Its running R2 attack is particularly notable, allowing multiple hits on enemies, closing the distance, and helping to duck under attacks, making it a versatile weapon for building up bleed and boosting attack power. Great Rune choices include Morgott's Great Rune for maximum health, which synergizes with Blood Tax's healing, Malenia's Great Rune for health restoration upon attacking after taking damage, and Radahn's Great Rune for a balance of health, FP, and stamina. Blood Tax enables rapid hits, building up attack power with talismans like Rotten Winged Sword Insignia and Thorny Cracked Tear. This is particularly effective when combined with the Bloodsucking Cracked Tear, which increases damage by 20% while gradually draining health. The healing from Blood Tax offsets the health drain, making it ideal for boss fights and landscape exploration. The armor for this build is Commander Gaius's Set, providing over 51 poise to avoid interruption during Blood Tax.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 160+",
      "mid": "Published from 160+",
      "late": "Published from 160+",
      "dlc": "Sword Lance"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "160+",
      "weapon": "Sword Lance",
      "offhand": "No off-hand item required",
      "skill": "Blood Tax",
      "talismans": [
        "Shard of Alexander",
        "Lord of Blood's Exultation",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Gaius's Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Bloodsucking Cracked Tear, Greenburst Crystal Tear",
      "stats": "Vigor, Arcane; Strength, Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Blood Lancer",
      "url": "https://eldenring.wiki.fextralife.com/Blood_Lancer_Build"
    }
  },
  {
    "id": "fextra-bloodblade",
    "name": "Bloodblade",
    "stats": "DEX / ARC / VIG / END",
    "role": "Published build",
    "playstyle": "A Bleed-focused Build that uses the Bleed Status Effect to continuously rip off huge chunks of enemy health via dual blades. The way this Build works is that you slot the Ash of War: Bloody Slash on to both Scimitars so that when you strike with both weapons via L1 you build up Bleed faster. Focus on using running and jumping L1 attacks as these do 4 hits very quickly, as opposed to just L1 by itself which does 2 or rolling L1 which does 3. Keep in mind enemy Bleed bars are not visible, but they drain just like players, meaning you must strike repeatedly and often or you won't rip off chunks of HP via Bleed. Play aggressively, but make sure not to get yourself killed going for the Bleed proc. Wear the heaviest Armor you can and still mid roll, so that if you do get hit, it deals the least amount of damage possible.",
    "complexity": "Published guide",
    "phases": {
      "early": "Scimitar x2",
      "mid": "Scimitar x2",
      "late": "Scimitar x2",
      "dlc": "Scimitar x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "critical-attacks"
    ],
    "startingClass": "Warrior",
    "mechanic": "Critical attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Scimitar x2",
      "offhand": "Any that can Parry",
      "skill": "Ash of War: Bloody Slash x2",
      "talismans": [],
      "armour": "Heaviest you can wear and still Med Roll",
      "spells": [],
      "flask": "All HP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Vigor & Endurance; Dexterity & Arcane"
    },
    "source": {
      "label": "Fextralife: Bloodblade",
      "url": "https://eldenring.wiki.fextralife.com/Bloodblade_Build"
    }
  },
  {
    "id": "fextra-bloodhound",
    "name": "Bloodhound",
    "stats": "STR / DEX / VIG",
    "role": "Published build",
    "playstyle": "A Dexterity Build that focuses on the use of the Bloodhound's Fang and its weapon skill Bloodhound's Finesse. The way this Build works is that you'll use Bloodhound's Fang from almost the beginning the game, essentially after you defeat Bloodhound Knight Darriwil, which should be first thing. You should two-hand it and lean into its weapon skill: Bloodhound's Finesse as much as possible. Bloodhound's Finesse gives you some i-frames during its initial attack animation, and some again when you dash forward and strike if you use the follow up attack. Try not to focus on the Bleed Build Up of this weapon, since enemies will usually die before it triggers 9 out of 10 times, but you might be well off to use Blood Grease during Boss fights or other Greases to further boost your damage, so make sure to do this! Utilize jump attacks with this build when you can as well since the Bloodhound's Fang has a higher Jump Attack Damage multiplier than other Curved Greatswords and also because you'll be wearing Raptor's Black Feathers and Claw Talisman, both further boost Jump Attack Damage. Slash upwards with the Bloodhound's Fang, using the momentum of the strike to perform a backwards somersault and gain some distance from foes.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Levels",
      "mid": "Published from All Levels",
      "late": "Bloodhound's Fang",
      "dlc": "Bloodhound's Fang"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Levels",
      "weapon": "Bloodhound's Fang",
      "offhand": "No off-hand item required",
      "skill": "Bloodhound's Finesse",
      "talismans": [
        "Bull-Goat's Talisman",
        "Shard of Alexander",
        "Claw Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Raptor's Black Feathers & any armor that adds up to 51 Poise with the Bull-Goat's Talisman equipped",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Strength"
    },
    "source": {
      "label": "Fextralife: Bloodhound",
      "url": "https://eldenring.wiki.fextralife.com/Bloodhound_Build"
    }
  },
  {
    "id": "fextra-bloodyballerina",
    "name": "Bloody Ballerina",
    "stats": "ARC / VIG / END",
    "role": "Published build",
    "playstyle": "An Arcane Build that focuses on the use of the Bloody Helice weapon and its weapon skill: Dynast's Finesse The way this Build works is that you'll be using Dynast's Finesse during your tough enemy and Boss fights, while using R1 and R2 attacks on trash enemies to conserve FP. The follow up attack of Dynast's Finesse will get you back into melee range, and does significant Stance Damage, allowing you to stagger enemies quite easily. Further attacks usually trigger Hemorrhage, which will proc your Attack Power buffs from Lord of Blood's Exultation and White Mask, allowing you to pump out even more damage as the fight goes on. When the enemy counter attacks, simply use L2 again to i-frame away and repeat this process. Dynast's Finesse uses considerable amount of Stamina to both spin away and attack, so you need TONS of Stamina to be able to maneuver as much as you want with this Build. This is why have high Endurance, use the Green Turtle Talisman, and Viridian Amber Medallion +2 and you could even use the Green Turtle Shield on your back for more Stamina regen. Nimbly avoid an attack, securing some distance from foes.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Bloody Helice",
      "dlc": "Bloody Helice"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Bloody Helice",
      "offhand": "No off-hand item required",
      "skill": "Dynast's Finesse",
      "talismans": [
        "Shard of Alexander",
        "Lord of Blood's Exultation",
        "Green Turtle Talisman",
        "Viridian Amber Medallion +2"
      ],
      "armour": "White Mask, and any other Armor you want",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Bloody Ballerina",
      "url": "https://eldenring.wiki.fextralife.com/Bloody_Ballerina_Build"
    }
  },
  {
    "id": "fextra-bloodybeastclaw",
    "name": "Bloody Beastclaw",
    "stats": "ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The build highlights the Beast Claw weapon you can acquire from a hostile NPC, just southeast of the first Site of Grace in Gravesite Plain. Several things are worth noting: First, the weapon allows the wielder to perform rapid and consecutive attacks, making some enemies flinch and preventing them from making a move. Second, this weapon naturally builds up bleed on hit, eventually triggering Hemorrhage. So it's highly recommended to set the weapon to the Occult infusion for consistency in triggering the bleed effect. The ash of war or skill that this weapon uses is Savage Claws. The skill is great to use in certain scenarios such as if you dodge an enemy attack and you find yourself back to back, you can trigger the skill and it will make the character immediately turn and track the enemy with its hits. You can also use this skill early before an enemy approaches you or even aggressively because it will always have you lunge forward and land those attacks. Not only does it fit the theme of the build but it provides the build with 51 Poise, which will prevent you from being interrupted when you attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Beast Claw"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "light-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Light attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Beast Claw",
      "offhand": "Sacrificial Axe",
      "skill": "Savage Claws",
      "talismans": [
        "Two-Headed Turtle Talisman",
        "Lord of Blood's Exultation",
        "Crusade Insignia",
        "Shard of Alexander"
      ],
      "armour": "Horned Warrior Helm, Horned Warrior Armor, Lionel's Gauntlets, Horned Warrior Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Thorny Cracked Tear, Greenburst Crystal Tear",
      "stats": "Arcane, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Bloody Beastclaw",
      "url": "https://eldenring.wiki.fextralife.com/Bloody_Beastclaw_Build"
    }
  },
  {
    "id": "fextra-bloodybowman",
    "name": "Bloody Bowman",
    "stats": "STR / DEX / VIG",
    "role": "Published build",
    "playstyle": "Black Bow behaves like a longbow with the mobile shot options of a shortbow, so this build keeps pressure while rolling, jumping and landing rather than planting its feet. Use ordinary arrows for weak targets, Serpent Arrows to establish poison on durable enemies, and Bloodbone Arrows with Barrage when repeated hits can actually trigger hemorrhage. Against bosses, wait for a committed animation, fire Barrage through the full safe window, then move before stamina empties; single evasive targets are better handled with jump or roll shots. Arrow's Sting and Shard of Alexander raise direct and skill damage, while White Mask and Lord of Blood's Exultation are worthwhile only when the target can bleed. Ritual Sword rewards clean spacing but disappears after any damage. The setup has no melee safety net, consumes crafted ammunition continuously and loses much of its identity against enemies immune to both poison and bleed.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Black Bow",
      "dlc": "Black Bow"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Black Bow",
      "offhand": "No off-hand item required",
      "skill": "Barrage",
      "talismans": [
        "Ritual Sword Talisman",
        "Shard of Alexander",
        "Arrow's Sting Talisman",
        "Spear Talisman (or Lord of Blood's Exultation)"
      ],
      "armour": "White Mask, any Light Armor",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Strength; Vigor"
    },
    "source": {
      "label": "Fextralife: Bloody Bowman",
      "url": "https://eldenring.wiki.fextralife.com/Bloody_Bowman_Build"
    }
  },
  {
    "id": "fextra-blueballer",
    "name": "Blue Baller",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Blue Baller guild highlights the Iron Ball fists weapon that is equipped with incredible damage, it can be acquired early in the game, and it has a unique boxing-like nature and significant stance damage from their charged heavy attacks which you can often stance break tough enemies with just two charged heavy attacks. Pairing this weapon with the Stonebarb Cracked Tear further increases your stance damage, allowing the player to stance-break bosses with two charged heavy attacks, which in the opinion, is something that is incredibly fast. And obviously, once they are down, you can follow up with a critical attack or punish the target with consecutive hits. In addition to the Iron Ball weapon, this build is also equipped with the Academy Glintstone Staff to buff the Heavy Iron Balls with magic. By conjuring the spell Scholar's Armament, it will add more magic damage to your attacks, giving you a higher total attack rating than a purely physical infusion. As for the skill, this build comes with the Endure ash of war, which is particularly useful because it not only prevents interruptions but also significantly reduces the damage you take. With this build, you can tank through hits due to your high poise. Even if you wouldn't be staggered, using Endure allows you to mitigate damage and continue your attacks.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Iron Ball; Academy Glintstone Staff",
      "dlc": "Iron Ball; Academy Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters",
      "meme",
      "cosplay"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Iron Ball; Academy Glintstone Staff",
      "offhand": "No off-hand item required",
      "skill": "Endure",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Axe Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Greathelm, Tree Surcoat, Scaled Gauntlets, Scaled Greaves",
      "spells": [
        "Scholar's Armament"
      ],
      "flask": "Equal Charges; Physick: Stonebarb Cracked Tear, Thorny Cracked Tear",
      "stats": "Strength, Intelligence, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Blue Baller",
      "url": "https://eldenring.wiki.fextralife.com/Blue_Baller_Build"
    }
  },
  {
    "id": "fextra-cariancavalier",
    "name": "Carian Cavalier",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "Casting Freezing Mist on a Boss first will debuff them and increase the damage you do to them before beginning your assault. Cast this an then try to keep them in the mist until Frostbite triggers and then go to town. Loretta's Slash is very situational, and this build is not setup to optimize its damage. However, it's great against enemies that hit hard since they can't stagger you out of it, allowing you to connect for damage 99% of the time. Trading damage is fine with this build since you have high protection. The way this Build works is that you'll use the very fast attacks of Loretta's War Sickle to melt enemies in one or two attacks, and Bosses in less than a minute. When you combine the fast attacks of the War Sickle with high Poise and Talismans like Winged Sword Insignia and Millicent's Prosthesis you get very high DPS. Halberds are exceptional on horseback because of their hitboxes and attack speed, so learn to fight from horseback when you can, and consider adding the Lance Talisman when doing so for even more damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Loretta's War Sickle & any Staff",
      "dlc": "Loretta's War Sickle & any Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Loretta's War Sickle & any Staff",
      "offhand": "Finger Seal",
      "skill": "Loretta's Slash",
      "talismans": [
        "Bull-Goat's Talisman",
        "Dragoncrest Greatshield Talisman",
        "Winged Sword Insignia",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Royal Knight Set or any with high Poise",
      "spells": [
        "Freezing Mist"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Carian Cavalier",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Cavalier_Build"
    }
  },
  {
    "id": "fextra-cariancleaver",
    "name": "Carian Cleaver",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Carian Cleaver build highlights high damage of spellcasting and melee attacks. If you're looking for that balance between casting spells and being effective in melee combat, then this build is for you. For this build to work you'll need to acquire the Iron Cleaver for melee combat and set it to magic infusion to acquire that high damage value, the reason why it uses this weapon apart from its high damage value is its R2 attack which allows the character to charge and lunge forward to close the gap when attacking an enemy. To further boost the weapon's attack, pairing it with the Royal Knight's Resolve skill makes it seamless to damage and kill enemies. For shields, this build uses the Jellyfish Shield. It's a good addition for defense and countering enemy attacks but the main highlight is using the shield's skill \"Contagious Fury\" to further buff your damage by 20%. The best way to do this is to equip your scepter and axe weapons > use Royal Knight's Resolve > switch the scepter to the shield > and then use Contagious Fury. When it comes to Armor, you can use what you prefer, but for this build, the following pieces are used (Carian Knight Helm, Carian Knight Armor, Banished Knight Gauntlets, Banished Knight Greaves) for added poise value and to take as much hits if you are put in a tricky situation and when spamming attacks.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Iron Cleaver, Carian Regal Scepter",
      "dlc": "Iron Cleaver, Carian Regal Scepter"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Iron Cleaver, Carian Regal Scepter",
      "offhand": "Jellyfish Shield; Academy Glintstone Staff",
      "skill": "Royal Knight's Resolve",
      "talismans": [
        "Ritual Sword Talisman",
        "Axe Talisman",
        "Magic Scorpion Charm"
      ],
      "armour": "Carian Knight Helm, Carian Knight Armor, Banished Knight Gauntlets, Banished Knight Greaves",
      "spells": [
        "Greatblade Phalanx"
      ],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Spiked Cracked Tear",
      "stats": "Intelligence, Vigor, Mind; Endurance, Strength"
    },
    "source": {
      "label": "Fextralife: Carian Cleaver",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Cleaver_Build"
    }
  },
  {
    "id": "fextra-carianknight",
    "name": "Carian Knight",
    "stats": "INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The build focuses on stance breaking to take advantage of the weapon's high critical rating. Spells are chosen not for their damage but for their stance damage. This approach allows the Carian Sorcery Sword to be used effectively in both melee and casting roles, with spells functioning similarly to Ashes of War. For instance, Greatblade Phalanx is favored for its substantial stance damage, allowing for block counters and continued stance pressure. Glintblade Trio, a new spell from the DLC, can be cast multiple times for added stance damage, leading to frequent stance breaks in boss fights and against enemies. The build includes the Magic-Shrouding Cracked Tear to boost melee damage. Previously, this weapon was not very viable due to its intelligence scaling, which is still significantly worse compared to the Carian Regal Scepter. On average, it does about 30% less damage per spell cast than the Carian Regal Scepter.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 154",
      "mid": "Published from 154",
      "late": "Published from 154",
      "dlc": "Carian Sorcery Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "154",
      "weapon": "Carian Sorcery Sword",
      "offhand": "Wolf Crest Shield; Academy Glintstone Staff",
      "skill": "Impaling Thrust, Carian Retaliation",
      "talismans": [
        "Magic Scorpion Charm",
        "Blade of Mercy",
        "Crusade Insignia",
        "Two-Headed Turtle Talisman"
      ],
      "armour": "Carian Knight Helm, Rellana's Armor, Beast Champion Gauntlets, Rellana's Greaves",
      "spells": [
        "Glintblade Trio",
        "Greatblade Phalanx",
        "Rellana's Twin Moons",
        "Scholar's Shield"
      ],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Opaline Hardtear",
      "stats": "Intelligence, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Carian Knight",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Knight_Build"
    }
  },
  {
    "id": "fextra-carianshieldknight",
    "name": "Carian Shield Knight",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build that utilizes the Carian Thrusting Shield as your main weapon, allowing you to block and attack at the same time. The Carian Shield Knight build in Elden Ring focuses on using the Carian Thrusting Shield, which was introduced in the Shadow of the Erdtree update. This build is centered around the shield's ability to perform thrusting attacks while simultaneously blocking, making it incredibly effective for dealing counter damage and breaking enemy stances. The Carian Thrusting Shield is one of two new thrusting shields and requires minimal investment in Strength, Dexterity, and Intelligence, making it accessible to a wide range of builds. Weighing about 10 with a 76 Guard Boost on the standard infusion, it provides excellent defensive power without being overly heavy. Even on the heavy infusion, where the Guard Boost is slightly lower, the shield remains highly efficient compared to other greatshields, which typically weigh twice as much for similar defense. One of the shield's key features is that it allows you to block and attack in the same animation. While the shield doesn't offer 100% physical protection, it provides 94%, meaning only 6% of incoming damage passes through.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 163",
      "mid": "Published from 163",
      "late": "Published from 163",
      "dlc": "Not specified by source"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "163",
      "weapon": "Not specified by source",
      "offhand": "Carian Thrusting Shield",
      "skill": "Cragblade",
      "talismans": [
        "Spear Talisman",
        "Rotten Winged Sword Insignia",
        "Two-Headed Turtle Talisman",
        "Blade of Mercy"
      ],
      "armour": "Royal Knight Helm, Rellana's Armor, Royal Knight Gauntlets, Royal Knight Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Deflecting Hardtear, Stonebarb Cracked Tear",
      "stats": "Strength, Vigor; Endurance, Mind, Intelligence"
    },
    "source": {
      "label": "Fextralife: Carian Shield Knight",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Shield_Knight_Build"
    }
  },
  {
    "id": "fextra-cariansovereignty",
    "name": "Carian Sovereignty",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build for those who enjoy using the spells while still using a melee weapon. This Sovereign Spellblade build emphasizes the destructive power of the Carian Sovereignty skill, making it a good choice for players seeking high damage output. The Ash of War itself, highlights its ability to charge up a magic sword that delivers a long-range slash, followed by a horizontal AOE attack. This skill is reminiscent of the Carian Grandeur but stands out due to its higher damage and substantial stance damage. For the weapon, this build uses the Claymore, a greatsword that provides the highest hyper armor, essential for avoiding interruptions during the skill's charge-up. The Claymore's excellent R2 and charged R2 attacks offer great reach, complementing the build's focus on stance damage rather than pure melee output. The weapon is set to the Magic infusion for optimal damage and effective spellcasting. In the off-hand, the Carian Regal Scepter is used for its exceptional sorcery scaling at 80 INT, allowing the use of powerful spells like Terra Magica and Greatblade Phalanx.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 172",
      "mid": "Published from 172",
      "late": "Published from 172",
      "dlc": "Claymore"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "172",
      "weapon": "Claymore",
      "offhand": "Carian Regal Scepter; Academy Glintstone Staff",
      "skill": "Carian Sovereignty",
      "talismans": [
        "Shard of Alexander",
        "Godfrey Icon",
        "Magic Scorpion Charm"
      ],
      "armour": "Spellblade Set or Rakshasa Set",
      "spells": [
        "Terra Magica",
        "Greatblade Phalanx",
        "Great Glintstone Shard"
      ],
      "flask": "Equal Charges; Physick: Winged Crystal Tear, Stonebarb Cracked Tear",
      "stats": "Intelligence, Vigor; Mind, Endurance, Strength"
    },
    "source": {
      "label": "Fextralife: Carian Sovereignty",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Sovereignty_Build"
    }
  },
  {
    "id": "fextra-carianspellknight",
    "name": "Carian Spellknight",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "Rykard's Rancor gives you a high damage Fire Spell you can use when enemies are highly magic resistant. Greatblade Phalanx is used to help stagger an enemy when connecting with Carian Grandeur close to the time it lands. You can use Terra Magica to buff your Magic Damage before a tough fight if you have time, making you even more deadly. The way this Build works is that you'll use your Shield to Block Counter regular enemies around the landscape. You'll use Carian Grandeur to one shot anything that's more difficult, and you can use Loretta's Greatbow and Great Glintstone Shard to pick things off at range as necessary.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Longsword & Carian Regal Scepter",
      "dlc": "Longsword & Carian Regal Scepter"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Longsword & Carian Regal Scepter",
      "offhand": "Carian Knight's Shield; Academy Glintstone Staff",
      "skill": "Carian Grandeur",
      "talismans": [
        "Magic Scorpion Charm",
        "Godfrey Icon",
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander"
      ],
      "armour": "Carian Knight Helm & Spellblades Set",
      "spells": [
        "Terra Magica",
        "Greatblade Phalanx",
        "Loretta's Greatbow",
        "Scholar's Shield",
        "Great Glintstone Shard",
        "Rykard's Rancor",
        "Founding Rain of Stars"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Carian Spellknight",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Spellknight_Build"
    }
  },
  {
    "id": "fextra-cariantwinblade",
    "name": "Carian Twinblade",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The weapon can be obtained by progressing the game and beating Rellana Twin Moon Knight in Castle Ensis. Rellana's Twinblade is a paired weapon that deals physical, magic, and fire damage — with STR, DEX, INT, and FAI scaling. The weapon comes with a unique skill, Moon-and-Fire Stance, where the character enters a stance to imbue its weapon with magic or fire. The magic-imbued weapon executes these waves of projectiles, while the fire-imbued weapon executes a stylish move that bathes the target with an AOE flame. And with the requirements of this weapon, you'll most likely find yourself spreading out points to STR, DEX, INT, and FAI. However, to get the most out of this weapon, in practice that putting more points into Strength and Dexterity makes such a change in terms of damage output. This build can also paired with the Golden Order Seal if you want to make this into a hybrid melee-spellcaster build which requires you to prioritize cranking up points into Faith and Intelligence. Not only does it fit with the theme of this build, but it also has good Poise and protection values.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Rellana's Twinblade, Golden Order Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Rellana's Twinblade, Golden Order Seal",
      "offhand": "No off-hand item required",
      "skill": "Moon-and-Fire Stance",
      "talismans": [
        "Rellana's Cameo",
        "Two-Headed Turtle Talisman",
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander"
      ],
      "armour": "Rellana's Set",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Magic-Shrouding Cracked Tear",
      "stats": "Strength, Dexterity, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Carian Twinblade",
      "url": "https://eldenring.wiki.fextralife.com/Carian_Twinblade_Build"
    }
  },
  {
    "id": "fextra-champion",
    "name": "Champion",
    "stats": "STR / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A dual-wielding Build that focuses on the use of Greatsword and Heavy Armor to tank hits while dealing devastating damage via Jump Attacks. Golden Vow lasts 45 seconds when used on an Ash of War, and increases your Attack Rating by about 10%, while also improving your Resistance by 5%. Determination is used in combat to boost the damage of both weapons, but the catch is that you need to connect with them at the same instant or you only get the increased damage on the first hit. This is another reason this build uses Jump Attacks, because both weapons connect at the same time. The way this build works is that you'll try to get Jump Attacks with your two Greatswords, which are boosted by the Claw Talisman. Besides this, you'll buff yourself with Golden Vow on your left weapon, and Determination on your right. Skill passed down from antiquity among the knights of the capital. Raise armament aloft and pledge to honor the Erdtree in battle, granting self and nearby allies increased attack power and defense.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Lordsworn's Greatsword & Claymore",
      "late": "Lordsworn's Greatsword & Claymore",
      "dlc": "Lordsworn's Greatsword & Claymore"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "skill-damage"
    ],
    "startingClass": "Vagabond",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Lordsworn's Greatsword & Claymore",
      "offhand": "No off-hand item required",
      "skill": "Golden Vow & Determination",
      "talismans": [],
      "armour": "Banished Knight Set",
      "spells": [],
      "flask": "Mostly HP, a couple of FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Endurance & Strength; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Champion",
      "url": "https://eldenring.wiki.fextralife.com/Champion_Build"
    }
  },
  {
    "id": "fextra-coldbloodedraptor",
    "name": "Cold-Blooded Raptor",
    "stats": "STR / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "A Strength/Intelligence Build that uses Claws to deal damage rapidly, and to also set the Hemorrhage and Frostbite status effects. You'll build up Hemorrhage and Frostbite on anything that doesn't die in a few hits, ripping off huge chunks of HP rapidly, making your damage output very high. The way this Build works is that you'll two hand your Claws, which brings out a second one and buff with Royal Knight's Resolve to boost the damage with both Claws. This is possible because they are only considered one Weapon, and buffs both Claws. You'll then Jump Attack enemies or bosses for increased damage, finishing them off with R1 attacks if they survive. You can supplement your melee playstyle with spells to give you ranged attacks, though they will be less powerful than a pure mage Build. Still you have options depending on the situation, and Greatblade Phalanx is fantastic as it works well with a melee playstyle and helps to stagger enemies. Hold the flat of the armament to your face and pledge your resolve, greatly powering up your next attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Bloodhound Claws, Sacrificial Axe & Academy Glintstone Staff",
      "dlc": "Bloodhound Claws, Sacrificial Axe & Academy Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Bloodhound Claws, Sacrificial Axe & Academy Glintstone Staff",
      "offhand": "No off-hand item required",
      "skill": "Royal Knight's Resolve & Golden Vow",
      "talismans": [
        "Lord of Blood's Exultation",
        "Claw Talisman",
        "Green Turtle Talisman",
        "Winged Sword Insignia"
      ],
      "armour": "Raptor's Black Feathers, Haima Glintstone Crown and any other gloves and legs that allow you to med roll",
      "spells": [
        "Great Glintstone Shard",
        "Loretta's Greatbow",
        "Terra Magica",
        "Adula's Moonblade",
        "Greatblade Phalanx"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Cold-Blooded Raptor",
      "url": "https://eldenring.wiki.fextralife.com/Cold-Blooded_Raptor_Build"
    }
  },
  {
    "id": "fextra-coldstormcleric",
    "name": "Coldstorm Cleric",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This build is also paired with the Fire's Deadly Sin Incantation, to continuously retrigger the Frostbite Status Effect since it is a continuous source of fire damage it can reliably reset the Frostbite status effect on enemies for build that inflicts frostbite rapidly. Coldstorm Cleric is a build that makes use of a Flail, such as a Chainlink Flail, and its high damage and Strength scaling. This is paired with the Stormcaller Ash of War to increase Bloodloss build-up, maximizing damage output and the chance to stagger opponents. This build does heavy damage to targets, but it also builds up Frostbite once you add the cold infusion, and blood loss maximizing your damage output. Overall, this build utilizes each equipment piece to increase damage output enhance to reusability of the Stormcaller skill, and continuously cause a Status Effect build-up on opponents to further maximize their damage intake. Other equipment pieces you can carry should typically increase the damage of your build. When finally implementing this build, wait for an opening before finally mashing L2 to trigger the Stormcaller skill, getting in a number of hits that would build Frostbite, Hemorrhage, and build your attack power which could work all together to stagger your opponent and give you a chance to continuously repeat the process and melt away opponent HP.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Chainlink Flail",
      "dlc": "Chainlink Flail"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Chainlink Flail",
      "offhand": "Cuckoo Greatshield; Finger Seal",
      "skill": "Stormcaller",
      "talismans": [
        "Bull-Goat's Talisman",
        "Warrior Jar Shard",
        "Shard of Alexander",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Marais Mask, Noble's Traveling Garb, Scaled Gauntlets, Scaled Greaves",
      "spells": [
        "Fire's Deadly Sin"
      ],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, and Strength; Mind, Endurance, and Faith"
    },
    "source": {
      "label": "Fextralife: Coldstorm Cleric",
      "url": "https://eldenring.wiki.fextralife.com/Coldstorm_Cleric_Build"
    }
  },
  {
    "id": "fextra-colossalcrusher",
    "name": "Colossal Crusher",
    "stats": "STR / VIG / END",
    "role": "Published build",
    "playstyle": "The way this Build works is that you'll run around using the Troll's Roar Ash of War to stagger enemies and then follow up with a Critical Attack finishing them off in a matter of seconds. Troll's Roar has a rather long cast time, making it challenging to pull off most of the time, except that you will have high Poise Armor so you will be able to pull this off even if hit. Colossal Weapons trigger both of these Talismans twice when doing a Critical Attack, making them twice as effective. When facing Bosses consider swapping out these two Talismans for Dragoncrest Greatshield Talisman and Green Turtle Talisman because you won't be doing as many Critical Strikes. Remember to use the follow up attack when using Troll's Roar to deal even more damage, and to stagger enemies that don't stagger from the roar itself.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Giant-Crusher & Highland Axe",
      "dlc": "Giant-Crusher & Highland Axe"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Giant-Crusher & Highland Axe",
      "offhand": "No off-hand item required",
      "skill": "Troll's Roar",
      "talismans": [
        "Roar Medallion",
        "Shard of Alexander",
        "Assassin's Cerulean Dagger",
        "Assassin's Crimson Dagger"
      ],
      "armour": "Bull-Goat Set or other high Poise Armor",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Colossal Crusher",
      "url": "https://eldenring.wiki.fextralife.com/Colossal_Crusher_Build"
    }
  },
  {
    "id": "fextra-colossalknight",
    "name": "Colossal Knight",
    "stats": "STR / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength focused Build that uses the Greatsword to pound enemies into the dirt using Charge Attacks. Learning when to use War Cry and how to use it is important because you don't have a ton of FP and you don't want to waste it needlessly. But be sure when using it to lead enemies with R2, and attack with it before they do so that you stagger them and they cannot get an attack off. Much like the Barbarian Build this build takes advantage of War Cry's change to R2 attacks, allowing you to deal devastating damage. Both of these Talismans buff your R2, allowing you to deal substantial damage. If you can chain two R2s together you will send enemies flying into the air, giving you a great opportunity to retreat and regenerate Stamina using the Green Turtle Talisman, and then return for more. Give a war cry to rally the spirit and increase attack power.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Greatsword",
      "late": "Greatsword",
      "dlc": "Greatsword"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "charged-attacks"
    ],
    "startingClass": "Vagabond",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Greatsword",
      "offhand": "No off-hand item required",
      "skill": "War Cry",
      "talismans": [],
      "armour": "Heaviest you can wear and still med roll",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Colossal Knight",
      "url": "https://eldenring.wiki.fextralife.com/Colossal_Knight_Build"
    }
  },
  {
    "id": "fextra-colossusguardian",
    "name": "Colossus Guardian",
    "stats": "STR / VIG / END",
    "role": "Published build",
    "playstyle": "The Colossus Guardian Build is a pure Strength Build that focuses on one-handing a single Colossus Weapon to devastating results. The way this Build works is that you slot the Ash of War: Barbaric Roar onto the Prelate's Inferno Crozier with the Blood Affinity so that you set Hemorrhage on enemies, dealing massive damage and triggering Lord of Blood's Exultation, increasing your damage. Barbaric Roar will overwrite any weapon buff you use, so it's best to choose one with a status effect if you can, and Blood still leaves B scaling in Strength. You can buff with Flame, Grant Me Strength before tough fights and Bosses, and use Bestial Vitality to heal up small damage you might take over the course of a level or dungeon. You will take damage with this Build as you exchange blows with enemies and Bosses. Using Barbaric Roar will change your R2 attack into a three hit combo that's boosted by Roar Talisman, and Axe Talisman if you hold it all the way down, though it fires off slower if you do this. However, it deals more damage and stagger damage when doing so. You use a high Poise Armor Set like Lionel's Set so that you can successfully pull off your full R2 chain without interruption.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Prelate's Inferno Crozier, any Sacred Seal and a Dagger",
      "dlc": "Prelate's Inferno Crozier, any Sacred Seal and a Dagger"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Prelate's Inferno Crozier, any Sacred Seal and a Dagger",
      "offhand": "No off-hand item required",
      "skill": "Barbaric Roar",
      "talismans": [
        "Roar Medallion",
        "Axe Talisman",
        "Green Turtle Talisman",
        "Lord of Blood's Exultation"
      ],
      "armour": "Lionel's Set",
      "spells": [
        "Flame, Grant Me Strength",
        "Bestial Vitality"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Colossus Guardian",
      "url": "https://eldenring.wiki.fextralife.com/Colossus_Guardian_Build"
    }
  },
  {
    "id": "fextra-crimsonduelist",
    "name": "Crimson Duelist",
    "stats": "ARC / VIG / END",
    "role": "Published build",
    "playstyle": "An Arcane build that uses Rogier's Rapier and Sepukku to bleed enemies to death very quickly. The way this Build works is that you'll buff yourself with Seppuku and use the unique R2 attack of Rogier's Rapier that hits twice to one shot most enemies, triggering blood loss with nearly every R2 attack, boosting your Attack Power from White Mask and Lord of Blood's Exultation, as well as Winged Sword Insignia and Millicent's Prosthesis. This gives you very high Attack Rating very quickly, and is easy to maintain since you can one shot most every enemy quickly. By using Carian Retaliation on a Shield in your left hand you will be have the most possible frames for Parrying, making it easier to Parry than just about any other setup. This allows you to get Critical Attacks when needed, when you aren't focusing on R2s of course. You can also Parry spells, and fling them back at casters for more damage as well. Increases attack power and improves ability to inflict blood loss.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Rogier's Rapier",
      "dlc": "Rogier's Rapier"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Rogier's Rapier",
      "offhand": "Any Small Shield",
      "skill": "Seppuku and Carian Retaliation",
      "talismans": [
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Lord of Blood's Exultation",
        "Spear Talisman (or Dagger Talisman)"
      ],
      "armour": "White Mask and light armor for Light Equip Load setup.",
      "spells": [],
      "flask": "Mostly HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Crimson Duelist",
      "url": "https://eldenring.wiki.fextralife.com/Crimson_Duelist_Build"
    }
  },
  {
    "id": "fextra-crucibleknight",
    "name": "Crucible Knight",
    "stats": "STR / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "The way this Build works is that you'll use Ordovis' Vortex on Bosses and difficult enemies in order to defeat them quickly. The charged version of this weapon skill has HUGE stagger potential and usually two casts of this will drop a Boss if they aren't dead by then. Golden Vow and Flame, Grant Me Strength are used to buff your damage with your attacks, weapon skill and Spells since they all deal physical damage or fire damage. Apsects of the Crucible: Tail is a great AoE that can trigger Rotten Winged Sword Insignia, unlike Ordovis' Vortex, so is best used on packs of enemies to ramp up your Attack Power. It can stagger them easily, particularly when charged, and deals decent damage. It's also a great gap closer to get back in melee range. This skill can be charged to increase its power.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Ordovis' Greatsword & Clawmark Seal",
      "dlc": "Ordovis' Greatsword & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Ordovis' Greatsword & Clawmark Seal",
      "offhand": "No off-hand item required",
      "skill": "Ordovis' Vortex",
      "talismans": [
        "Shard of Alexander",
        "Godfrey Icon",
        "Flock's Canvas Talisman",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Crucible Axe Set",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Aspects of the Crucible: Tail",
        "Aspects of the Crucible: Horns",
        "Aspects of the Crucible: Breath"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Crucible Knight",
      "url": "https://eldenring.wiki.fextralife.com/Crucible_Knight_Build"
    }
  },
  {
    "id": "fextra-crusader",
    "name": "Crusader",
    "stats": "FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A melee/caster hybrid that focuses on Faith and Block Counters to obliterate enemies with holy or fire damage. This is crucial since you want to be able to change damage types (Fire or Holy) depending on the scenario. You can use Elden Stars to begin Boss fights, particularly on the landscape where they are typically not aggroed until you engage them, and Lightning Spear is a good ranged option, as is Black Flame if you want a Fire option. Many spells recently got buffed so you can test them out, but you have crazy high Incantation Scaling so you'll do fantastic damage. The way this Build works is that you'll buff with Golden Vow as you travel around the game attacking enemies with Sword Dance or with Block Counters after they attack into your Brass Shield. You'll use Barricade Shield in sections and for Bosses that it is needed for, where Blocking makes a lot of sense, and you'll unslot in sections that you don't need it, allowing you to use Sword Dance without two-handing your Gargoyle's Greatsword. Barricade Shield (12 FP, Ash of War). Skill made famous by Sir Neidhardt.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Gargoyle's Greatsword & Erdtree Seal",
      "dlc": "Gargoyle's Greatsword & Erdtree Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Gargoyle's Greatsword & Erdtree Seal",
      "offhand": "Brass Shield",
      "skill": "Barricade Shield & Sword Dance",
      "talismans": [
        "Curved Sword Talisman",
        "Flock's Canvas Talisman",
        "Shard of Alexander",
        "Fire Scorpion Charm"
      ],
      "armour": "Haligtree Knight Helm & any armor that allows you to medium roll",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Elden Stars",
        "Lightning Spear",
        "Black Blade",
        "Black Flame's Protection"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Vigor; Mind"
    },
    "source": {
      "label": "Fextralife: Crusader",
      "url": "https://eldenring.wiki.fextralife.com/Crusader_Build"
    }
  },
  {
    "id": "fextra-crystalmage",
    "name": "Crystal Mage",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "The Crystal Mage Build is an Intelligence focused Build that uses Crystal and Glintstone Sorceries to dispatch enemies at range. This Build uses the Crystal Staff to boost the damage of both Crystal Torrent and Shattering Crystal. Lusat's Glintstone Staff costs too much FP to use consistently, and you do not meet the requirements to use Carian Regal Staff yet, so this is the next best one when it comes to scaling. Use Shattering Crystal to AoE and against big enemies, as they get hit by the most Crystals. You'll use Contagious Fury by keeping your Shield in your left hand, buffing your spell damage by 20% for 30 seconds when you use it. This helps range things down more easily, and it has a short animation, allowing you to use it rather easily in boss encounters. Bestial Vitality is there for a small heal over time to restore health to reactive Ritual Sword Talisman when you reach full HP, increasing your damage by 10% once again. Raises attack power for a certain duration.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Crystal Staff, Finger Seal",
      "dlc": "Crystal Staff, Finger Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Crystal Staff, Finger Seal",
      "offhand": "Jellyfish Shield",
      "skill": "Contagious Fury",
      "talismans": [
        "Magic Scorpion Charm",
        "Ritual Sword Talisman",
        "Dragoncrest Shield Talisman",
        "Godfrey Icon"
      ],
      "armour": "Any that still allows you to med roll",
      "spells": [
        "Crystal Torrent",
        "Shattering Crystal",
        "Glintstone Pebble",
        "Great Glintstone Shard",
        "Comet",
        "Terra Magica",
        "Bestial Vitality"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Crystal Mage",
      "url": "https://eldenring.wiki.fextralife.com/Crystal_Mage_Build"
    }
  },
  {
    "id": "fextra-darkpaladin",
    "name": "Dark Paladin",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "You can get this weapon a bit later in the game (in Castle Ensis) after clearing the first legacy dungeon or even early on if you decide to explore. Milady is no exception to this since its heavy attack executes two strong swings and if you press the button again, it follows up with another two swings, making it useful and quite effective when it comes to building up attack power, especially once it is paired with the right talismans and other buffs. Milady is a weapon that scales well with the Keen upgrade, which is best for the primary stat of this build, Dexterity. Golden Vow is great for buffing your damage and resistance, also great if you are playing online co-op. While Cragblade is more of a self-centric buff that increases your damage, making it easier to break an enemy's stance, and pairing it with Exalted Flesh just takes it to another level. The Dark Paladin build also comes equipped with the Wolf Crest Shield, one of the new shields you can find in Castle Ensis. This shield works perfectly for this build because it only has 12 Strength requirement (the same requirement needed for the Milady weapon), and at full upgrade it has 66 Guard Boost, considering that this is only a medium shield. You can opt to using other armor, but the Solitude Set fits well for the theme of this build.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Milady"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Milady",
      "offhand": "Wolf Crest Shield",
      "skill": "Golden Vow, Cragblade",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Dragoncrest Greatshield Talisman",
        "Great-Jar's Arsenal"
      ],
      "armour": "Solitude Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Thorny Cracked Tear",
      "stats": "Dexterity, Endurance, Vigor; Mind"
    },
    "source": {
      "label": "Fextralife: Dark Paladin",
      "url": "https://eldenring.wiki.fextralife.com/Dark_Paladin_Build"
    }
  },
  {
    "id": "fextra-darkmoonspellblade",
    "name": "Darkmoon Spellblade",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "A melee mage build that focuses on the use of the Dark Moon Greatsword and other Glintblade Sorceries to destroy its enemies. You can use Unseen Form to help you navigate levels, avoiding ranged enemies that might hit you unsuspectingly, allowing you to range them down with Glintstone Pebble or Magic Glintblade. Loretta's Greatbow is there for very long range when the situation calls for it. Sometimes you just need a bit of range, and this spell single handedly takes care of that. It generally goes something like this, buff your Greatsword with L2, cast Magic Glintblade or Greatblade Phalanx and then either hold R2 or charge forward into range and then hold R2 and then hit R2 again. You're trying to time it so that the wave from the Greatsword connects with the enemy around the same time as the spell, or just before, so that the spell staggers after the wave, allowing you an opening for a second wave. Temporarily increases magic attack power and imbues blade with frost.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Dark Moon Greatsword & Carian Glintblade Staff",
      "dlc": "Dark Moon Greatsword & Carian Glintblade Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Dark Moon Greatsword & Carian Glintblade Staff",
      "offhand": "No off-hand item required",
      "skill": "Moonlight Greatsword",
      "talismans": [
        "Godfrey Icon",
        "Radagon Icon",
        "Stargazer Heirloom",
        "Green Turtle Talisman"
      ],
      "armour": "Any that still allows med rolling",
      "spells": [
        "Magic Glintblade",
        "Glintstone Pebble",
        "Greatblade Phalanx",
        "Loretta's Greatbow",
        "Unseen Form"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Mind; Vigor"
    },
    "source": {
      "label": "Fextralife: Darkmoon Spellblade",
      "url": "https://eldenring.wiki.fextralife.com/Darkmoon_Spellblade_Build"
    }
  },
  {
    "id": "fextra-acolyte",
    "name": "Acolyte",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "If you don't want to keep respeccing depending on if the boss is resistant to holy, fire or lightning, and also want to play at a meta level (around 150) for the fun of the restriction and PVP concerns, give this a go. This build is designed around Lightning so the personal choice for general PVE is: equip Gravel Stone Seal and Lightning incantations such as Lanseax Glaive and Fortissax's Lightning Spear, and also equip the Bolt of Gransax. Tanks you when you're overwhelmed so you can put down AOEs, as well as target bulky enemies from long range with Bolt of Gransax's ash of war. Also buff the Keen Greatsword with lightning and go to town with poise breaking and knocking down. In another slot equip Erdtree Seal for applying buffs with even greater Faith scaling efficiency. You can also play around with using the Discus of Light incantation with this seal, for extremely low FP cost while mowing through enemies you have on a train toward you. ,, OPTIMISATION CHOICES, If you don't ever want to use dragon breath attacks or Greyoll's Roar, you may want to go Wretch or something else as starting class and optimize by not levelling Arcane at all. You could also not put much if any levels in Strength if you want to use something like the Uchigatana or other lighter weapons.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Keen Greatsword, Bolt of Gransax",
      "dlc": "Keen Greatsword, Bolt of Gransax"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Bandit",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Keen Greatsword, Bolt of Gransax",
      "offhand": "Frenzied Flame Seal, Erdtree Seal",
      "skill": "Ancient Lightning Spear",
      "talismans": [],
      "armour": "Light armor sets. Use Radiant Gold Mask for thematic aesthetics, then Elden Bling whatever works with mid-rolling still.",
      "spells": [
        "Golden Vow",
        "Flame Grant Me Strength",
        "Bloodflame Blade",
        "Electrify Armament",
        "Greyoll's Roar"
      ],
      "flask": "3 Cerulean, 11 Crimson; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith, Dexterity; Vig, End, Mind"
    },
    "source": {
      "label": "Fextralife: Acolyte",
      "url": "https://eldenring.wiki.fextralife.com/Acolyte_Build"
    }
  },
  {
    "id": "fextra-blackbladeslicer",
    "name": "Black Blade Slicer",
    "stats": "STR / DEX / FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "This endgame hybrid layers Destined Death from several distinct tools rather than repeating one animation. Open from safety with the Black Knife's Blade of Death to cut maximum HP and start its burn, cast Black Blade when the longer incantation window is available, then move into Maliketh's Black Blade only for a punish large enough to contain Destined Death's committed swings. Reapplying the same source refreshes rather than stacks its effect, so rotate tools for coverage and use the Serpent Bow or status incantations when melee access is poor. Shard of Alexander strengthens the weapon skills, Radagon Icon shortens the casting side, and a shield or Black Knife armour supports a more cautious approach between bursts. The build can answer bleed, rot, frost and poison matchups, but that breadth demands Strength, Dexterity, Faith and Arcane requirements. Long animations and the spread stat budget are the price for percentage-based pressure against high-health PvE targets.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Black Knife, Maliketh's Black Blade, Serpent Bow",
      "dlc": "Black Knife, Maliketh's Black Blade, Serpent Bow"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "status-buildup"
    ],
    "startingClass": "Confessor",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Black Knife, Maliketh's Black Blade, Serpent Bow",
      "offhand": "Any but try Kite Shield; Finger Seal",
      "skill": "Blade of Death, Destined Death, Mighty Shot",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Shard of Alexander",
        "Crucible Feather Talisman",
        "Radagon Icon"
      ],
      "armour": "Any but you might like Black Knife Set or Maliketh's Set",
      "spells": [
        "Swarm of Flies",
        "Frozen Lightning Spear",
        "Pest Threads",
        "Scarlet Aeonia",
        "Poison Mist",
        "bloodboon",
        "Bloodflame Talons",
        "Black Blade"
      ],
      "flask": "As you need, you can sustain most boss fights with just 2 cerulean flasks at 26 mind; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "60 vigor, 26 mind, 12 dex, 8 str, 18 faith, 16 arcane; 17 arcane, 46 faith, 34 strength"
    },
    "source": {
      "label": "Fextralife: Black Blade Slicer",
      "url": "https://eldenring.wiki.fextralife.com/Black_Blade_Slicer_Build"
    }
  },
  {
    "id": "fextra-championofrot",
    "name": "Champion of Rot",
    "stats": "STR / DEX / FAI / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Opaline Hardtear is used to all damage negations by 15% for 3 minutes. For enemies where you can't apply Scarlet Rot, you will be relying on the Poleblade of the Bud to deal physical damage, and Pest-Thread Spears as a ranged option. Pest-Thread Spears is also an excellent incantation to use against massive enemies, if you get right under them before casting this, you'll get multiple hits, and this incantation does a high level of stance damage. Your remaining Incantations are more situational or utility; Rotten Butterflies is good as a zone spacer for distant enemies, who may with timing run into the butterfly explosion and start procuring Rot buildup. Ekzykes's Decay is a good boss opener for applying Rot at a distance, but consumes a high level of FP. Golden Vow is your standard pre-boss buff for damage increase. * Offhand Weapon: Dragon Communion Seal * Equipment: Rot Grease, Hefty Rot Pot, Ironjar Aromatic The Champion of Rot Build features a Scarlet Rot status effect build designed from the DLC and combining base game items. The main damage output of this build centers around applying rot to the enemy while whittling them down with attacks and incantations, and eventually exploding the status effect with The Poison Flower Blooms Twice.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Published from 150",
      "dlc": "Poleblade of the Bud, Antspur Rapier (Keen)"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "status-buildup"
    ],
    "startingClass": "Wretch",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Poleblade of the Bud, Antspur Rapier (Keen)",
      "offhand": "Dragon Communion Seal; Carian Knight Shield",
      "skill": "Romina's Purification, The Poison Flower Blooms Twice",
      "talismans": [
        "Shard of Alexander",
        "Kindred of Rot's Exultation",
        "Dragoncrest Greatshield Talisman",
        "Radagon Icon"
      ],
      "armour": "Malenia's Winged Helm, Rakshasa Armor, Rakshasa Gauntlets, Rakshasa Greaves",
      "spells": [
        "Scarlet Aeonia",
        "Rotten Butterflies",
        "Pest-Thread Spears",
        "Ekzykes's Decay",
        "Heal from Afar",
        "Golden Vow"
      ],
      "flask": "11 Crimson, 3 Cerulean; Physick: Opaline Hardtear, Cerulean-Sapping Cracked Tear",
      "stats": "Dexterity, Vigor, Arcane, Faith; Strength, Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Champion of Rot",
      "url": "https://eldenring.wiki.fextralife.com/Champion_of_Rot_Build"
    }
  },
  {
    "id": "fextra-cipherprophet",
    "name": "Cipher Prophet",
    "stats": "STR / DEX / INT / FAI / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Cipher Prophet is an extremely easy medium build to use, collect for, and adjust to your liking. Equip one of the sacred Ash of War to your blade for now, and you can do solid melee or throw fireballs at bosses until they croak. Startup: You can grab all this stuff without killing a single boss. First get the horse, snag the Limgrave map, and get the seed in route to get the Beast Crest Heater Shield, pop up on top of the cliff and grab Ash of War: Golden Vow, then get the Saintsbridge Site of Grace after. You should also go to the broken cart near the Bridge of Sacrifice in the Weeping Peninsula and grab the Spiked Mace for a strike damage weapon. Circle back to the Castleward Tunnel and challenge Margit to unlock the Roundtable and buy the Flame Sling, then jump off the balcony and go right to pick up the Cipher Pata. Roll thru some boards on the floor to get to a chest that holds the Two Fingers Heirloom talisman for a 5 level bump to your Faith. You can stay at Medium Load when you equip the Longsword, Beast Crest Heater Shield, Finger Seal, Bandit Mask, Knight Armor, Chain Gauntlets, and Chain Leggings without putting anything into Endurance, so it's only a couple of levels to get to the full Knight Set if you want to use it.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Midgame",
      "mid": "Cipher Pata",
      "late": "Cipher Pata",
      "dlc": "Cipher Pata"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "spell-damage"
    ],
    "startingClass": "Prophet",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "Midgame",
      "weapon": "Cipher Pata",
      "offhand": "Finger Seal; Beast Crest Heater Shield initially, any other low strength shield you prefer later, based on boss/area progression.",
      "skill": "Unblockable Blade",
      "talismans": [
        "Two Fingers Heirloom",
        "Green Turtle Talisman"
      ],
      "armour": "Knight Set",
      "spells": [
        "Golden Vow"
      ],
      "flask": "Adjustable. Take more crimson flasks when you are focusing on melee and more cerulean flasks for casting.; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": ", 40 Vigor (60 by endgame), 15+ Mind as needed for FP, 10+ Endurance as needed for the armor set you prefer., 12 Strength (Just add your first level here to gain access to a good number of weapons and shields), 10 Dexterity (Prophet Initial), 7 Intelligence (Prophet Initial), 30+ Faith (minimum), 10 Arcane (Prophet Initial)"
    },
    "source": {
      "label": "Fextralife: Cipher Prophet",
      "url": "https://eldenring.wiki.fextralife.com/Cipher_Prophet_Build"
    }
  },
  {
    "id": "fextra-deathknight",
    "name": "Death Knight",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "If you can get the drop on a tough enemy or Boss, you'll place Terra Magica down first to boost your Magic Damage even further, before unloading with Ancient Death Rancor, and then firing off the Night Comet ability of Night and Flame when they get close to you. You'll swap to Ancient Death Rancor for more difficult enemies, and you'll use the Night Comet ability of Sword of Night and Flame to finish them of while they are staggered from Ancient Death Rancor. The way this Build works is that you'll buff with Golden Vow and use Rancor and Sword of Night and Flame to take on regular enemies, using Carian Knight's Shield to Block Counter as needed. Night-and-Flame-Stance (Unique). Hold the sword level and prepare to cast a sorcery. The weapons in this build apply Madness 55.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Sword of Night and Flame, Carian Regal Scepter & Frenzied Flame Seal",
      "dlc": "Sword of Night and Flame, Carian Regal Scepter & Frenzied Flame Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "stance-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Stance damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Sword of Night and Flame, Carian Regal Scepter & Frenzied Flame Seal",
      "offhand": "Carian Knight's Shield; Academy Glintstone Staff",
      "skill": "Night-and-Flame-Stance",
      "talismans": [
        "Magic Scorpion Charm",
        "Great-Jar's Arsenal",
        "Assassin's Cerulean Dagger",
        "Shard of Alexander"
      ],
      "armour": "Night's Cavalry Helm, Night's Cavalry Armor, Lionel's Greaves, & Lionel's Gauntlets",
      "spells": [
        "Rancorcall",
        "Ancient Death Rancor",
        "Golden Vow",
        "Terra Magica"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Death Knight",
      "url": "https://eldenring.wiki.fextralife.com/Death_Knight_Build"
    }
  },
  {
    "id": "fextra-deathmage",
    "name": "Death Mage",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A mage build that focuses on the use of Death Sorceries and the Prince of Death's Staff. Sword of Night and Flame is your melee option, since Rancorcall and Ancient Death Rancor are useless at point blank range as they will fly over the target and miss. The way this Build works is that you'll buff with Golden Vow and then cast Rancorcall on regular trash enemies, using Explosive Ghostflame or Rykard's Rancor on groups of enemies to AoE them down quickly. Ancient Death Rancor is great against hard to kill enemies and Bosses, especially if you charge it and are standing in Terra Magica when you cast it. It can often stagger bosses or outright kill them before they ever reach you. Rykard's Rancor gives you a fire option that you can use Flame, Grant Me Strength to buff as well as Fire Scorpion Charm. It's good against magic resistant enemies or those weak to fire. Night-and-Flame Stance (Unique).",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Sword of Night and Flame, Golden Order Seal & Prince of Death's Staff",
      "dlc": "Sword of Night and Flame, Golden Order Seal & Prince of Death's Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Sword of Night and Flame, Golden Order Seal & Prince of Death's Staff",
      "offhand": "No off-hand item required",
      "skill": "Night-and-Flame Stance",
      "talismans": [
        "Magic Scorpion Charm",
        "Graven-Mass Talisman",
        "Ritual Sword Talisman",
        "Godfrey Icon"
      ],
      "armour": "Any Armor that allows you to medium roll.",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Rancorcall",
        "Ancient Death Rancor",
        "Explosive Ghostflame",
        "Terra Magica",
        "Rykard's Rancor"
      ],
      "flask": "Split FP & HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Death Mage",
      "url": "https://eldenring.wiki.fextralife.com/Death_Mage_Build"
    }
  },
  {
    "id": "fextra-deathblade",
    "name": "Deathblade",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "An Intelligence/Faith Build thas uses the Sword of Night and Flame to full effect, while also using both Sorceries and Incantations to dispatch enemies. You also deal incredible damage just with regular melee attacks, as the Sword of Night and Flame has one of the highest Attack Ratings in Elden Ring. If you can get someone to drop you a second one, consider dual wielding them for even more deadly melee attacks. The way this Build works is that you'll prioritize using the magic attack of Sword of Night and Flame, by using things that boost its damage, as well as the damage of your regular weapon attacks. Magic Scorpion Charm, Golden Vow, Spellblade Set and Terra Magica all boost this damage, making it much more deadly. You can still use the Flame attack when you want as well, but you'll buff with Flame, Grant Me Strength instead of Terra Magica when using it to boost Fire Damage instead of magic. You'll supplement your melee attacks and weapon skills with magic, most notably Black Flame when you need some mid range Fire Damage, or Magic Glintblade when you need mid range Magic Damage. You'll use Loretta's Greatbow to take out things from really long range, and Ancient Death Rancor is there to stagger enemies and Bosses (particularly those that you can target the head), giving you an opening to use Sword of Night and Flame's Skills.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Sword of Night and Flame, Prince of Death's Staff & Golden Order Seal",
      "dlc": "Sword of Night and Flame, Prince of Death's Staff & Golden Order Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "stance-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Stance damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Sword of Night and Flame, Prince of Death's Staff & Golden Order Seal",
      "offhand": "No off-hand item required",
      "skill": "Night-and-Flame Stance",
      "talismans": [
        "Fire Scorpion Charm",
        "Magic Scorpion Charm",
        "Dragoncrest Shield Talisman +1",
        "Godfrey Icon"
      ],
      "armour": "Any that allows you to med roll. Spellblade Set boosts Night and Flame's Magic attack by 2% per piece",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Black Flame",
        "Loretta's Greatbow",
        "Terra Magica",
        "Magic Glintblade",
        "Ancient Death Rancor"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Deathblade",
      "url": "https://eldenring.wiki.fextralife.com/Deathblade_Build"
    }
  },
  {
    "id": "fextra-devoniashammer",
    "name": "Devonia's Hammer",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Morgott's Great Rune is also a solid option for increased health, which is beneficial for surviving damage trades. Overall, the Devonia Devastator build is about standing toe-to-toe with bosses, taking hits, and breaking enemy stances with the powerful Devonia's Vortex skill. Devonia's Hammer is a colossal weapon that deals primarily physical damage, with some holy damage, and scales exceptionally well with strength. It also offers decent faith scaling and boasts a fantastic guard boost, making it a powerful choice for heavy hitters. The weapon skill, Devonia's Vortex, resembles Ordovis's Vortex from the Greatsword of Ordovis. This skill involves a twirling motion followed by a powerful ground slam, which can be charged for increased damage. When combined with talismans like Shard of Alexander and Godfrey Icon, the damage output becomes substantial. The predominantly physical damage of this weapon is easily boosted by buffs like Flame, Grant Me Strength or Exalted Flesh.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Devonia's Hammer"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Devonia's Hammer",
      "offhand": "Erdtree Seal",
      "skill": "Devonia's Vortex",
      "talismans": [
        "Two-Handed Sword Talisman",
        "Shard of Alexander",
        "Great-Jar's Arsenal",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Crucible Hammer-Helm, Crucible Tree Armor, Crucible Gauntlets, Crucible Greaves",
      "spells": [
        "Flame, Grant Me Strength",
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength, Vigor; Endurance, Faith, Mind"
    },
    "source": {
      "label": "Fextralife: Devonia's Hammer",
      "url": "https://eldenring.wiki.fextralife.com/Devonia's_Hammer_Build"
    }
  },
  {
    "id": "fextra-divinewarrior",
    "name": "Divine Warrior",
    "stats": "FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Next, let's take a closer look at the weapon skill, Euporia Vortex. This skill requires about a second to wind up the blade, after which it starts spinning as you walk forward, hitting enemies repeatedly. This spinning attack is similar to the Spinning Weapon skill or the attack used by the Godskin Apostle boss, making it a familiar mechanic for those who have encountered that enemy. Euporia Vortex is quite costly at 28 FP, making it one of the most expensive weapon skills in Elden Ring. While the damage output is decent, the real advantage of this weapon skill lies in a unique property of the Euporia weapon. When you attack repeatedly in a short period—roughly within 10 seconds—you need to hit about seven times when two-handing the weapon. The Divine Warrior build features the Euporia weapon, a hidden weapon that players can find close to the end of the DLC. This build focuses on maximizing the potential of this twin blade weapon, which is notable for its weight of 8.5, making it one of the heaviest twin blades in the game, rivaled only by the Gargoyle's Twinblade.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Euporia"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Euporia",
      "offhand": "Finger Seal",
      "skill": "Euporia Vortex",
      "talismans": [
        "Two-Handed Sword Talisman",
        "Shard of Alexander",
        "Two-Headed Turtle Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Divine Bird Set",
      "spells": [
        "Flame, Grant Me Strength",
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Divine Warrior",
      "url": "https://eldenring.wiki.fextralife.com/Divine_Warrior_Build"
    }
  },
  {
    "id": "fextra-doubledragon",
    "name": "Double Dragon",
    "stats": "STR / DEX / ARC / VIG / END",
    "role": "Published build",
    "playstyle": "A build that focuses on the fighting technique rather than the speed and damage of the attack. The Double Dragon build is a poison and Scarlet rot build focusing on using Dane's Footwork, a unique hand-to-hand weapon, and the Ash of War \"The Poison Flower Blooms Twice. \" The Ash of War \"The Poison Flower Blooms Twice\" is the cornerstone of this build. This skill deals damage with the initial kick upon teleporting into an enemy. The weapon chosen for this build is Dane's Footwork. This weapon features numerous kicks in its attacks, including regular, jump, and running attacks, which are all enhanced by the Shattered Stone Talisman. The general strategy involves initiating combat with kicks to build up poison on the target, then using \"The Poison Flower Blooms Twice\" to deal significant damage and start building Scarlet Rot. This process is repeated, alternating between the status effects, to maximize damage output.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 164",
      "mid": "Published from 164",
      "late": "Published from 164",
      "dlc": "Dane's Footwork"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "status-buildup"
    ],
    "startingClass": "Not specified",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "164",
      "weapon": "Dane's Footwork",
      "offhand": "Poisoned Hand",
      "skill": "The Poison Flower Blooms Twice, Scarlet Rot",
      "talismans": [
        "Shattered Stone Talisman",
        "Shard of Alexander",
        "Kindred of Rot's Exultation"
      ],
      "armour": "N/A - Uses Rock Heart",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Thorny Cracked Tear",
      "stats": "Vigor, Arcane; Strength, Dexterity, Endurance"
    },
    "source": {
      "label": "Fextralife: Double Dragon",
      "url": "https://eldenring.wiki.fextralife.com/Double_Dragon_Build"
    }
  },
  {
    "id": "fextra-dragondancer",
    "name": "Dragon Dancer",
    "stats": "FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "An Arcane Build that focuses on the use of Dragon Incantations. On Bosses you'll buff with Golden Vow and Flame, Grant Me Strength and then use Eochaid's Dancing Blade when you have an opening, followed by a Dragonmaw for devastating damage after your Attack Power has been buffed high from the weapon skill. You can use Dragonmaw on tough to kill mobile enemies, and Agheel's Flame and Ekzykes's Decay on groups of enemies, or when you need to set Scarlet Rot. Greyoll's Roar can be used to debuff a Boss if you need extra damage, just make sure to use it first for best results. The way this Build works is that you'll buff with Golden Vow and then try to use your weapon skill: Eochaid's Dancing Blade on at least one enemy to ramp up your Attack Power from your Talismans. Then you can R1 attack enemies, rebuffing with Dancing Blade as necessary to keep your Attack Power up. Infuse the sword with energy, then fling it forwards in a corkscrew attack. The sword continuously deals damage while violently spinning.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Regalia of Eochaid & Dragon Communion Seal",
      "dlc": "Regalia of Eochaid & Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Regalia of Eochaid & Dragon Communion Seal",
      "offhand": "No off-hand item required",
      "skill": "Eochaid's Dancing Blade",
      "talismans": [
        "Shard of Alexander",
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Godfrey Icon"
      ],
      "armour": "Silver Tear Mask and any Armor",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Dragonclaw",
        "Dragonmaw",
        "Agheel's Flame",
        "Ekzykes's Decay",
        "Greyoll's Roar"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Mind & Faith"
    },
    "source": {
      "label": "Fextralife: Dragon Dancer",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_Dancer_Build"
    }
  },
  {
    "id": "fextra-dragongod",
    "name": "Dragon God",
    "stats": "FAI / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Golden Vow is good to buff the damage and get more protection while Flame, Grant Me Strength raises the power of spells that deal physical attacks and if you have any incantations that do fire damage. Golden Vow is a spell that you will be using more frequently especially if you are exploring, while Flame, Grant Me Strength is good to use right before you fight a boss. Rotten Breath is considered to be like a weak version of Ekzykes's Decay, and the reason why it's on this build is because you can cast this spell while you're on horseback, this way if you are fighting field bosses, you can cast this spell while mounted. Ekzykes's Decay is (obviously) the powerful version of Rotten Breath, best used against elite enemies or bosses that you fight toe-to-toe to deal physical damage with Scarlet Rot. When it comes to the Flask of Wondrous Physick, since there is little protection in this build, Opaline Hardtear and Opaline Bubbletear are great to use. Opaline Bubbletear is good for being aggressive at the beginning of a boss fight, allowing you to cast a spell and not get damaged from the first incoming enemy attack. The Dragon God build for Elden Ring's Shadow of the Erdtree is a build that focuses on the use of Dragon Communion Incantations, and uses a new item, the Rock Heart, to further boost the damage of the spells.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 165",
      "mid": "Published from 165",
      "late": "Published from 165",
      "dlc": "Bloodfiend's Fork, Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "165",
      "weapon": "Bloodfiend's Fork, Dragon Communion Seal",
      "offhand": "No off-hand item required",
      "skill": "Sword Dance or Braggart's Roar",
      "talismans": [
        "Blue Dancer Charm",
        "Crusade Insignia",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Rock Heart transformation (no armour)",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Ekzykes's Decay",
        "Rotten Breath",
        "Dragonmaw"
      ],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Opaline Bubbletear",
      "stats": "Arcane, Vigor, Mind; Faith, Endurance"
    },
    "source": {
      "label": "Fextralife: Dragon God",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_God_Build"
    }
  },
  {
    "id": "fextra-dragonknight",
    "name": "Dragon Knight",
    "stats": "FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "The way this Build works is that you'll increase your Arcane to make your Spells hit hard, and to boost the damage of your Weapon. You should use an Occult Affinity Weapon, with the Bloody Slash Skill, which scales with Arcane for maximum Bloody Slash damage, but you can use any Skill you want. You'll use Agheel's Flame or Smarag's Glintstone Breath to take out enemies with larger health pools or Bosses, holding down R1 to cast the spell fully twice. Make sure to equip the Scorpion Charm that best suits the breath you intend to use. You need at least 25 Faith to use Golden Vow, and 23 to use certain Dragon Spells, so you can't have less than this. You'll use your Jellyfish Shield's ability: Contagious Fury to boost your Spell Damage and Weapon Damage, and Golden Vow to do the same. You can then chuck Lightning Spears or Black Flame balls at enemies or use Bloody Slash. Blood Oath skill granted by the Lord of Blood.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Any that can use Bloody Slash & Dragon Communion Seal",
      "dlc": "Any that can use Bloody Slash & Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Any that can use Bloody Slash & Dragon Communion Seal",
      "offhand": "Jellyfish Shield",
      "skill": "Bloody Slash & Contagious Fury",
      "talismans": [
        "Radagon's Soreseal",
        "Fire Scorpion Charm",
        "Magic Scorpion Charm",
        "Faithful's Canvas Talisman"
      ],
      "armour": "Silver Tear Mask, and any armor that allows you to med roll",
      "spells": [
        "Golden Vow",
        "Blessing's Boon",
        "Lightning Spear",
        "Flame, Grant Me Strength",
        "Black Flame",
        "Stone of Gurranq",
        "Agheel's Flame",
        "Smarag's Glintstone Breath",
        "Rotten Breath"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Faith & Mind"
    },
    "source": {
      "label": "Fextralife: Dragon Knight",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_Knight_Build"
    }
  },
  {
    "id": "fextra-dragonpriest",
    "name": "Dragon Priest",
    "stats": "FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "The Finger Seal is the weapon: this beginner caster does not need a melee armament to complete its combat loop. Catch Flame is the fast, close-range answer for single enemies and punish windows, while Dragonfire is held to sweep a pack or a broad boss hitbox with its cone; release it early if the target turns toward you rather than being locked into the long breath animation. Start a pull from range, let enemies group together, cast Dragonfire across the line, then use Catch Flame on anything that reaches casting distance. Mind supports repeated breaths, Vigor covers the risk of casting close, Faith raises the early fire damage, and Arcane is added only as later dragon incantations require it. The setup spends FP quickly and has no shield or physical fallback, so fire-resistant enemies and aggressive bosses demand shorter casts and more Cerulean charges.",
    "complexity": "Published guide",
    "phases": {
      "early": "Any",
      "mid": "Any",
      "late": "Any",
      "dlc": "Any"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "skill-damage"
    ],
    "startingClass": "Prophet",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Any",
      "offhand": "Any; Finger Seal",
      "skill": "No Skill",
      "talismans": [],
      "armour": "Any",
      "spells": [
        "Catch Flame",
        "Dragonfire"
      ],
      "flask": "Most FP, 1 or 2 HP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Mind & Vigor; Faith & Arcane"
    },
    "source": {
      "label": "Fextralife: Dragon Priest",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_Priest_Build"
    }
  },
  {
    "id": "fextra-dragonpriestess",
    "name": "Dragon Priestess",
    "stats": "FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Dragon Priestess build focuses on using Dragon Cult Incantations. The spell has incredible range and can still release projectiles even if the caster is interrupted mid-animation. Charging it up increases its damage, and its significant stance damage allows for breaking boss stances effectively. Morgott's Great Rune for extra health and Malenia's Great Rune for health regeneration upon taking damage are also viable options. When a boss is stance broken, a powerful combination involves using Knight's Lightning Spear followed by a charged Ancient Dragons' Lightning Strike. The synergy between these spells makes this build extremely potent in boss fights, often bypassing the challenging second phases of many encounters. It is a good ranged single-target spell that can be charged for extra damage, ideal for eliminating regular enemies efficiently. Lightning Strike is another useful spell for dealing with groups of enemies, as its straight-line AOE can hit multiple targets.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 159",
      "mid": "Published from 159",
      "late": "Published from 159",
      "dlc": "Coded Sword, Erdtree Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "159",
      "weapon": "Coded Sword, Erdtree Seal",
      "offhand": "Gravel Stone Seal",
      "skill": "Unblockable Blade",
      "talismans": [
        "Flock's Canvas Talisman",
        "Godfrey Icon",
        "Lightning Scorpion Charm",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "N/A - Uses Priestess Heart",
      "spells": [
        "Knight's Lightning Spear",
        "Ancient Dragons' Lightning Strike"
      ],
      "flask": "Equal Charges; Physick: Lightning-Shrouding Cracked Tear, Greenburst Crystal Tear",
      "stats": "Faith, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Dragon Priestess",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_Priestess_Build"
    }
  },
  {
    "id": "fextra-dragonwarrior",
    "name": "Dragon Warrior",
    "stats": "FAI / ARC / VIG / END",
    "role": "Published build",
    "playstyle": "An Arcane Build that uses Bleed and rapid attacks to build up Attack Power and then unleash deadly Dragon attacks. You can use Ekzykes's Decay to set Scarlet Rot on tough Bosses from range, or to AoE down groups of enemies from a distance. (Note: Patch 1.07 nerfed the additional bleed build up gained from Sepukku and also the status damage done when dual wielding. This is because in order to get the multi-hit bonus, you want to do a L1 combo, at which point you will almost certainly have triggered a bleed anyway - especially seeing as you have two blood affinity curved swords and may have used sepukku on 1-2 of your swords as well. The way this Build works is that you'll buff with Golden Vow and Seppuku when generally moving about the landscape to attack enemies, only buffing your right hand weapon unless facing something fierce. You can use Blessing's Boon and buff your left hand weapon as well when facing tough enemies or Bosses to further boost damage and surviveability. You'll try to do running L1 attacks to proc Hemorrhage as quickly as possible, which boosts your Attack Power by 30% thanks to Lord of Blood's Exultation and White Mask. Increases attack power and improves ability to inflict blood loss.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Bandit's Curved Sword x2",
      "dlc": "Bandit's Curved Sword x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "light-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Light attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Bandit's Curved Sword x2",
      "offhand": "Finger Seal",
      "skill": "Seppuku x2",
      "talismans": [
        "Lord of Blood's Exultation",
        "Primal Glintstone Blade",
        "Millicent's Prosthesis",
        "Winged Sword Insignia"
      ],
      "armour": "White Mask, and heavy armor with good Poise",
      "spells": [
        "Golden Vow",
        "Blessing's Boon",
        "Ekzykes's Decay",
        "Dragonclaw",
        "Dragonmaw"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Faith & Endurance"
    },
    "source": {
      "label": "Fextralife: Dragon Warrior",
      "url": "https://eldenring.wiki.fextralife.com/Dragon_Warrior_Build"
    }
  },
  {
    "id": "fextra-dragonscaledaimyo",
    "name": "Dragonscale Daimyo",
    "stats": "STR / DEX / VIG",
    "role": "Published build",
    "playstyle": "A melee build that focuses on the use of Dragonscale Blade and its weapon skill: Ice Lightning Sword. The way this Build works is that you'll buff your Fire Uchigatana with Flaming Strike and then use Ice Lightning Sword on an enemy or boss in order to deal some damage while also adding Lightning Damage to your Dragonscale Blade, as well as adding Frostbite build up to its attacks. This will allow you very high damage with repeated strikes while dual wielding. Or you can use the Jellyfish Shield in your left hand instead of the Fire Uchigatana, which will allow you to use Ice Lightning Sword while two-handing, buffing your weapon, and then swapping to one hand and using Contagious Fury on the Shield to get even more damage. You can reach over 900 Attack Power this way, which is deadly. Skill that emits flame in a wide frontward arc. This will also coat the armament in fire.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Dragonscale Blade & Uchigatana",
      "dlc": "Dragonscale Blade & Uchigatana"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Dragonscale Blade & Uchigatana",
      "offhand": "Jellyfish Shield",
      "skill": "Ice Lightning Sword & Flaming Strike",
      "talismans": [
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Shard of Alexander",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any Armor that allows you to medium roll.",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor"
    },
    "source": {
      "label": "Fextralife: Dragonscale Daimyo",
      "url": "https://eldenring.wiki.fextralife.com/Dragonscale_Daimyo_Build"
    }
  },
  {
    "id": "fextra-dragonslayer",
    "name": "Dragonslayer",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The recommended Great Runes for this build include Radahn's Great Rune for additional health, FP, and stamina, Morgott's Great Rune for extra health, or Malenia's Great Rune for health regeneration upon taking damage and immediately attacking back. This build utilizes the Dragon-Hunter's Great Katana, a new weapon type that combines elements of a katana and a curved great sword. This hybrid weapon has a unique move set, size, and weight, dealing 100% physical damage and featuring scaling in both strength and dexterity. The Dragon Hunter's Great Katana scales evenly with strength and dexterity, providing the highest attack rating when points are equally distributed between these attributes. For example, allocating 55 points to strength and 45 to dexterity or vice versa results in slightly lower attack ratings compared to an even split. Players aiming to maximize their damage should aim for balanced stat increases, such as 60/60 or higher. This weapon also has a blood loss buildup of 55, though it's not the primary focus of the build. Blood loss will trigger occasionally but is not a reliable source of damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 158",
      "mid": "Published from 158",
      "late": "Published from 158",
      "dlc": "Dragon-Hunter's Great Katana"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "158",
      "weapon": "Dragon-Hunter's Great Katana",
      "offhand": "Sacrificial Axe",
      "skill": "Dragonwound Slash",
      "talismans": [
        "Shard of Alexander",
        "Godfrey Icon",
        "Two-Handed Sword Talisman",
        "Two-Headed Turtle Talisman"
      ],
      "armour": "Rakshasa Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength, Dexterity, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Dragonslayer",
      "url": "https://eldenring.wiki.fextralife.com/Dragonslayer_Build"
    }
  },
  {
    "id": "fextra-drakeknight",
    "name": "Drake Knight",
    "stats": "STR / FAI / VIG",
    "role": "Published build",
    "playstyle": "Magma Wyrm's Scalesword supplies both the neutral weapon and the burst plan for this Strength/Faith bruiser. Cast Golden Vow and Flame, Grant Me Strength before a boss, fight normally with the curved greatsword until a long recovery appears, then use Magma Guillotine's leap and commit to the second chopping input only when the target cannot retaliate. The initial plunge delivers the immediate burst while the magma left on the floor punishes enemies that remain in place. Fire Scorpion Charm and Shard of Alexander amplify that punish, Carian Filigreed Crest makes repeated attempts cheaper, and Dragoncrest Greatshield offsets some of the defensive cost of staying close. The Clawmark Seal permits additional bestial or utility incantations, but they are optional rather than the main loop. Fire resistance and mobile bosses reduce the magma payoff, and forcing the follow-up through a short opening turns the skill's hyper armour into a losing trade.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Magma Wyrm's Scalesword & Clawmark Seal",
      "dlc": "Magma Wyrm's Scalesword & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Magma Wyrm's Scalesword & Clawmark Seal",
      "offhand": "No off-hand item required",
      "skill": "Magma Guillotine",
      "talismans": [
        "Fire Scorpion Charm",
        "Shard of Alexander",
        "Dragoncrest Greatshield Talisman",
        "Carian Filigreed Crest"
      ],
      "armour": "Any Armor that allows you to medium roll",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor"
    },
    "source": {
      "label": "Fextralife: Drake Knight",
      "url": "https://eldenring.wiki.fextralife.com/Drake_Knight_Build"
    }
  },
  {
    "id": "fextra-duelswordduelist",
    "name": "Duel Sword Duelist",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Additionally, the Horned Warrior Sword deals 100% physical damage, scaling with Strength, Dexterity, and Faith. This makes it one of the few weapons in the game to scale with Faith while retaining pure physical damage output. The weapon skill, Horn Calling, complements this versatility by delivering 100% Holy damage, giving you the flexibility to adapt your damage type depending on the enemy. While the weapon itself excels at physical damage, Horn Calling shines in exploration and dungeon encounters due to its strong AOE potential, quick cast speed, and excellent damage output when built correctly. It is ideal for clearing clusters of enemies, especially in open areas, thanks to its wide AOE radius and reliable range. However, its usefulness varies in boss fights. The Horned Warrior's Sword is the key weapon for this build. Unlike traditional dual-wielding curved swords, this feature adds a layer of defense without the need for a shield.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 160+",
      "mid": "Published from 160+",
      "late": "Published from 160+",
      "dlc": "Horned Warrior's Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "160+",
      "weapon": "Horned Warrior's Sword",
      "offhand": "Erdtree Seal",
      "skill": "Horn Calling",
      "talismans": [
        "Shard of Alexander",
        "Sacred Scorpion Charm",
        "Ritual Sword Talisman"
      ],
      "armour": "Divine Bird Helm, Leda's Armor, Leyndell Knight Gauntlets, Malformed Dragon Greaves",
      "spells": [
        "Golden Vow (Spell)",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Deflecting Hardtear",
      "stats": "Dexterity, Vigor; Endurance, Faith, Mind"
    },
    "source": {
      "label": "Fextralife: Duel Sword Duelist",
      "url": "https://eldenring.wiki.fextralife.com/Duel_Sword_Duelist_Build"
    }
  },
  {
    "id": "fextra-eldenlord",
    "name": "Elden Lord",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Quality (Strength/Dexterity) Build that uses Axe of Godfrey and its weapon skill Regal Roar to pancake foes. The way this Build works is that you'll use Regal Roar on a tough enemy or group of enemies in order to knock them into the air, dealing substantial damage while also changing your R2 and charged R2 attacks and buffing your damage. Roar Medallion and Highland Axe both buff your Roar and follow up attack damage. You'll then proceed to attack with R2s and charged R2s to pound enemies to death quickly, trading damage as necessary, since you'll win every trade. You can rebuff with Regal Roar as necessary, making sure to use it when bosses are just walking into the edge of it, which should give you time to cast it and follow up with R2 without getting hit more than once, so you aren't staggered. Let loose a mighty war cry, raising attack power, while sending out a shockwave that cannot be guarded against by stomping the ground. While active, strong attack becomes a lunging slash.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Axe of Godfrey & Highland Axe",
      "dlc": "Axe of Godfrey & Highland Axe"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Axe of Godfrey & Highland Axe",
      "offhand": "No off-hand item required",
      "skill": "Regal Roar",
      "talismans": [
        "Roar Medallion",
        "Shard of Alexander",
        "Dragoncrest Greatshield Talisman",
        "Axe Talisman"
      ],
      "armour": "Any Armor that allows you to medium roll",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Elden Lord",
      "url": "https://eldenring.wiki.fextralife.com/Elden_Lord_Build"
    }
  },
  {
    "id": "fextra-elementalist",
    "name": "Elementalist",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "An Intelligence/Faith Build that can cast nearly any spell in the game, and only uses ranged magic to destroy enemies. Lightning Spear is your Lightning Damage spell that you'll use to take out enemies weak to Lightning. You can charge it for extra damage as needed and it does +10% damage in the rain. Black Flame is your ranged Fire Damage spell that deals that can be charged for extra damage, and also does a small damage over time based on the max HP of the enemy. Stone of Guarranq is your ranged Physical Damage spell that can be chained effectively at modest range. You can also use Rock Sling, but it casts slower, though it does have longer range and does more stagger damage. The way this Build works is that you will use Prince of Death's Staff to cast Sorceries and Golden Order Seal to cast Incantations. You'll buff with Golden Vow to increase your spell damage, as well as boost your defenses.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Prince of Death's Staff & Golden Order Seal",
      "dlc": "Prince of Death's Staff & Golden Order Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Prince of Death's Staff & Golden Order Seal",
      "offhand": "No off-hand item required",
      "skill": "No Skill",
      "talismans": [
        "Green Turtle Talisman",
        "Marika's Soreseal",
        "Ritual Sword Talisman",
        "Primal Glintstone Blade"
      ],
      "armour": "Any that still allows you to medium roll",
      "spells": [
        "Stone of Gurranq",
        "Lightning Spear",
        "Black Flame",
        "Catch Flame",
        "Great Glintstone Shard",
        "Triple Rings of Light",
        "Golden Vow"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Elementalist",
      "url": "https://eldenring.wiki.fextralife.com/Elementalist_Build"
    }
  },
  {
    "id": "fextra-enchantedknight",
    "name": "Enchanted Knight",
    "stats": "INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A medium-armor melee-based sorcerer Build that allows you to Block with a Shield while attacking with Carian Sword Sorceries in your right hand. Spam Carian Slicer to melt bosses and tough enemies and use Carian Greatsword when mounted or when getting too close to some enemies is risky. Use Carian Piercer against NPC Invaders, and use Glintstone Pebble to tackle flying enemies or enemies you cannot reach with melee attacks. You need to have a well rounded stat spread for this Build since you are playing it like a melee character that uses a Shield, so good Vigor and Endurance helps with Blocking and taking damage. Make sure you have enough Intelligence to deal damage, but don't go crazy and leave your character vulnerable. You will be in melee range so you will get hit. When facing tough enemies buff with Barricade Shield to reduce the Stamina consumption of Blocking so that you have more Stamina to use Carian Slicer or Carian Greatsword.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Carian Glintstone Staff",
      "late": "Carian Glintstone Staff",
      "dlc": "Carian Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "guard-counters"
    ],
    "startingClass": "Astrologer",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Carian Glintstone Staff",
      "offhand": "Blue-Gold Kite Shield",
      "skill": "Ash of War: Barricade Shield",
      "talismans": [],
      "armour": "Carian Knight Set",
      "spells": [
        "Carian Slicer",
        "Carian Piercer",
        "Carian Greatsword",
        "Glintstone Pebble"
      ],
      "flask": "Most FP, Some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Vigor; Mind & Endurance"
    },
    "source": {
      "label": "Fextralife: Enchanted Knight",
      "url": "https://eldenring.wiki.fextralife.com/Enchanted_Knight_Build"
    }
  },
  {
    "id": "fextra-eochaidexecutioner",
    "name": "Eochaid Executioner",
    "stats": "STR / ARC / VIG",
    "role": "Published build",
    "playstyle": "A Strength/Arcane Build that uses the Marais Executioner's Sword or Regalia of Eochaid to deal massive damage via Eochaid's Dancing Blade The way this Build works is that you'll use Eochaid's Dancing Blade on just about every enemy, when you aren't doing Block Counters off of your Blocks. You're goal is always to get at least one enemy with this Skill in order to boost your Attack Power via Rotten Winged Sword Insignia and Millicent's Prosthesis so that subsequent attacks deal more damage. Eochaid's Dancing Blade scales off of Strength and Arcane primarily, so you want to invest points heavily here in order to boost its damage as high as possible. You can buff with Flame, Grant Me Strength as needed, since you do mostly Physical Damage with your attacks and with Eochaid's Dancing Blade. Don't forget that you can Block Counter enemies with your Shield by pressing R2 after blocking, and if you stagger an enemy can do a Charged L2 to finish them off quite easily. Infuse the sword with energy, then fling it forwards in a corkscrew attack. The sword continuously deals damage while violently spinning.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Marais Executioner's Sword",
      "dlc": "Marais Executioner's Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Marais Executioner's Sword",
      "offhand": "Banished Knight's Shield; Finger Seal",
      "skill": "Eochaid's Dancing Blade",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Shard of Alexander",
        "Green Turtle Talisman",
        "Godfrey Icon"
      ],
      "armour": "Any that still allows you to medium roll",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Arcane; Vigor"
    },
    "source": {
      "label": "Fextralife: Eochaid Executioner",
      "url": "https://eldenring.wiki.fextralife.com/Eochaid_Executioner_Build"
    }
  },
  {
    "id": "fextra-fireknightimpaler",
    "name": "Fire Knight Impaler",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Fire Knight Impaler build for Elden Ring's Shadow of the Erdtree is a build that utilizes the Spear of the Impaler weapon, a fantastic weapon that does physical and fire damage, and scales with Faith and Dexterity. This build uses Faith (a little over Dexterity) because of its weapon skill, Messmer's Assault, to effectively boost the damage of the skills' first attack, which is 100% fire damage. Before covering the skill of this weapon, there is one thing to mention about the Spear of the Impaler, is that pressing the R2 button or using a heavy attack/charged heavy attack will make the character throw the spear at a decent distance. By using a charged heavy attack, the spear will explode upon impact, causing a pool of magma to drop onto the feet of the target, dealing damage over time for a short time. Messmer's Assault is a powerful skill for the Spear of the Impaler weapon, what this does is on its first input, it does this sweeping fire attack, followed by a combo poking move, and finishes off with an aerial move, plunging the weapon to the ground, causing an AOE effect of spears that burst from the ground, dealing massive damage. These are three separate button presses, so you can stop the full chain at any time, allowing you to mix up your moves and use them effectively depending on what enemy or boss you are facing. The strength of this skill is its initial attack which is the fire-sweeping attack, it does significant damage at a significant range.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Spear of the Impaler"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Spear of the Impaler",
      "offhand": "Erdtree Seal",
      "skill": "Messmer's Assault",
      "talismans": [
        "Bull-Goat's Talisman",
        "Shard of Alexander",
        "Fire Scorpion Charm",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Winged Serpent Helm, Fire Knight Armor, Fire Knight Gauntlets, Fire Knight Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Opaline Hardtear",
      "stats": "Faith, Vigor, Dexterity; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Fire Knight Impaler",
      "url": "https://eldenring.wiki.fextralife.com/Fire_Knight_Impaler_Build"
    }
  },
  {
    "id": "fextra-flamedancer",
    "name": "Flame Dancer",
    "stats": "STR / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength/Faith Build that uses the Whip: Giant's Red Braid to great effect, while also slinging Fire Spells. Buff with Golden Vow and Flame, Grant Me Strength as needed to further boost your damage. The way this Build works is that you'll be wielding a Greatshield in order to Block Counter with your Whip. Whips have very long range so you can hit enemies easily with Block Counters, and you'll have a bigger opening due to the Greatshield. Note that you won't stagger enemies on one Block Counter with a Whip, but Whips cannot deal Critical Hits anyway, so this is not so important. Giant's Red Braid scales with Strength and Faith, making it a good candidate for a Greatshield, but also for the Clawmark Seal that increases in damage with both of these Stats. This allows you to use Incantations effectively, though not as effectively as a pure Incantation build. Flame Dance is your AoE spell that obliterates packs of enemies and causes them to flinch on each hit.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Giant's Red Braid & Clawmark Seal",
      "dlc": "Giant's Red Braid & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Giant's Red Braid & Clawmark Seal",
      "offhand": "Any Greatshield",
      "skill": "Flame Dance",
      "talismans": [
        "Fire Scorpion Charm",
        "Ritual Sword Talisman",
        "Shard of Alexander",
        "Great-Jar's Arsenal"
      ],
      "armour": "Any Armor that has high Poise.",
      "spells": [
        "Flame, Grant Me Strength",
        "Golden Vow",
        "Black Flame",
        "Black Flame Ritual",
        "Flame, Fall Upon Them"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Flame Dancer",
      "url": "https://eldenring.wiki.fextralife.com/Flame_Dancer_Build"
    }
  },
  {
    "id": "fextra-flameguardian",
    "name": "Flame Guardian",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Since the theme of this build is fire or flames, hence the name of the build being \"Flame Guardian\", there are specific items that are a must-have such as the Fire Scorpion Charm and Flame-Shrouding Cracked Tear making any fire-based skills or spells powerful. Specifically for this build, the primary flame spell it uses is the Flame of the Fell God because it summons this large orb of fire that detonates after some time. If timed correctly, executing a combo such as conjuring the spell, and then aggressively attacking the target with the Flaming Strike skill with normal attacks will apply significant damage after the orb detonates. Alternatively, other flame-type spells can also work here such as Giantsflame Take Thee, Black Flame, Frenzied Burst, Golden Vow (Spell), or Flame, Grant me Strength. The Flame Guardian build for Elden Ring features the Curved Great Club weapon or as one of the community members has pointed it to be \"Bonk, but in cursive\". Aside from it being a perfect aesthetic fit for this build, the Curved Great Club has the highest damage when it is set to the Flame-art infusion, and it has great reach since it is extremely long for a great club weapon, making it quite useful in a lot of situations. The weapon of this build is equipped with the Flaming Strike ash of war/skill, allowing the player to release flames in a wide frontward arc and it also adds a cool effect that coats the weapon in fire.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 157",
      "mid": "Published from 157",
      "late": "Curved Great Club, Erdtree Seal",
      "dlc": "Curved Great Club, Erdtree Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "157",
      "weapon": "Curved Great Club, Erdtree Seal",
      "offhand": "No off-hand item required",
      "skill": "Flaming Strike",
      "talismans": [
        "Fire Scorpion Charm",
        "Bull-Goat's Talisman",
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander"
      ],
      "armour": "Bloodsoaked Mask, Bloodsoaked Manchettes, Blackflame Monk Armor, Blackflame Monk Greaves",
      "spells": [
        "Flame of the Fell God",
        "Giantsflame Take Thee",
        "Black Flame",
        "Frenzied Burst",
        "Golden Vow (Spell)",
        "Flame, Grant me Strength"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Faith-knot Crystal Tear",
      "stats": "Faith, Vigor, Mind; Endurance, Strength"
    },
    "source": {
      "label": "Fextralife: Flame Guardian",
      "url": "https://eldenring.wiki.fextralife.com/Flame_Guardian_Build"
    }
  },
  {
    "id": "fextra-freezingbattlemage",
    "name": "Freezing Battlemage",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "A melee mage build that uses Carian Slicer and other Carian Sword Sorceries to their fullest! You'll use Adula's Moonblade for larger enemies that are hard to hit with Carian Slicer and for AoE groups, and the damage of this Spell and all Cold Sorceries is boosted by 10% because of the Snow Witch Hat. Carian Piercer is there for NPC invaders or actual invaders, as it has incredible hit boxes, and allows you to roll catch easily. Glinstone Icecrag is your ranged option that helps build up Frostbite, and deals decent damage, but is slow and doesn't have great range. The way this Build works is that you'll use Carian Slicer to its fullest by casting it with Lusat's Glintstone Staff and wielding Carian Glintstone Staff in the other hand or by using Contagious Fury from the Jellyfish Shield. Lusat's Glintstone Staff increases FP cost by 50%, but Carian Slicer only costs 6 FP to begin with, so you can get away with it here in order to boost damage. Raises attack power for a certain duration.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Lusat's Glintstone Staff & Carian Glintstone Staff",
      "dlc": "Lusat's Glintstone Staff & Carian Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Lusat's Glintstone Staff & Carian Glintstone Staff",
      "offhand": "Jellyfish Shield; Finger Seal",
      "skill": "Contagious Fury",
      "talismans": [
        "Graven-School Talisman",
        "Graven-Mass Talisman",
        "Magic Scorpion Charm",
        "Ritual Sword Talisman"
      ],
      "armour": "Snow Witch Hat, and any that still allows you to medium roll",
      "spells": [
        "Carian Slicer",
        "Adula's Moonblade",
        "Carian Piercer",
        "Glintstone Icecrag",
        "Zamor Ice Storm",
        "Freezing Mist"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Mind & Vigor"
    },
    "source": {
      "label": "Fextralife: Freezing Battlemage",
      "url": "https://eldenring.wiki.fextralife.com/Freezing_Battlemage_Build"
    }
  },
  {
    "id": "fextra-frenziedacolyte",
    "name": "Frenzied Acolyte",
    "stats": "FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "An Arcane/Faith Build that focuses on casting incantations from range, only meleeing when absolutely necessary. Black Flame is there when you don't need either of these to kill enemies, and will conserve some FP, as well as deal damage over time based on the Max HP of the target. Lightning Spear can be cast when Fire is not a good damage type. You'll buff with Golden Vow and Flame, Grant Me Strength as necessary. Often time you won't need these to one shot most enemies, but if you aren't killing most enemies in one cast then you'll want to use Golden Vow. Use Flame, Grant Me Strength for Boss encounters or tough enemies. The way this Build works is that you'll use the Dragon Communion Seal in your right hand to cast spells, because it has better Incantation Scaling at this point in the game, and you'll keep the other Seals in your off hand, rotating them to boost the damage of whichever spell you might be casting. For instance, you'd have the Godslayer's Seal in your left hand when casting Black Flame, and rotate to Frenzied Flame Seal when casting The Flame of Frenzy or Frenzied Burst, and Gravel Stone Seal when casting Lightning Spear.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Dragon Communion Seal, Frenzied Flame Seal, Gravel Stone Seal, Godslayer's Seal & any melee Weapon that can take an Ash of War",
      "dlc": "Dragon Communion Seal, Frenzied Flame Seal, Gravel Stone Seal, Godslayer's Seal & any melee Weapon that can take an Ash of War"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Dragon Communion Seal, Frenzied Flame Seal, Gravel Stone Seal, Godslayer's Seal & any melee Weapon that can take an Ash of War",
      "offhand": "No off-hand item required",
      "skill": "Bloodhound's Step",
      "talismans": [
        "Godfrey Icon",
        "Ritual Sword Talisman",
        "Faithful's Canvas Talisman",
        "Fire Scorpion Charm"
      ],
      "armour": "Silver Tear Mask, Commoner's Garb, Noble's Glove, Noble's Trousers",
      "spells": [
        "The Flame of Frenzy",
        "Frenzied Burst",
        "Black Flame",
        "Lightning Spear",
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Frenzied Acolyte",
      "url": "https://eldenring.wiki.fextralife.com/Frenzied_Acolyte_Build"
    }
  },
  {
    "id": "fextra-frostknight",
    "name": "Frost Knight",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "The Frost Knight Build is a melee focused Build that uses the Ice Spear Ash of War to deal Magic Damage at range, and to set the Frostbite Status Effect reliably on enemies. This Build uses Ice Spear to add even more Magic Damage to the Clayman's Harpoon, and to range down enemies from a distance. It also sets the Frostbite Status Effect with enough hits, wiping out a chunk of enemy HP, increasing the damage they take, and reducing their Stamina recovery. Additionally, Ice Spear does tons of Stance damage at range, allowing you to break enemy stances easily, allowing for frequent critical attacks. When combined with Block Counters, that also do very high stance damage, you can soften enemies up as they approach and then finish them with Block Counters or stagger them and then finish them. Terra Magica is there to buff your damage in fights where you can setup beforehand, just make sure to remain in its area to gain increased damage. You can use Scholar's Armament if you went Standard or Heavy on your weapon instead of Cold or Frost to further buff your damage. Magic Glintblade is there for a longer range option, and Greatblade Phalanx is useful for stagger damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Clayman's Harpoon & any Staff",
      "dlc": "Clayman's Harpoon & any Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Clayman's Harpoon & any Staff",
      "offhand": "Carian Knight's Shield",
      "skill": "Ice Spear & Carian Retaliation",
      "talismans": [
        "Magic Scorpion Charm",
        "Carian Filigreed Crest",
        "Curved Sword Talisman",
        "Greatshield Talisman"
      ],
      "armour": "Any that still allows you to med roll",
      "spells": [
        "Scholar's Shield",
        "Terra Magica",
        "Magic Glintblade",
        "Greatblade Phalanx",
        "Scholar's Armament"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Frost Knight",
      "url": "https://eldenring.wiki.fextralife.com/Frost_Knight_Build"
    }
  },
  {
    "id": "fextra-frostpaladin",
    "name": "Frost Paladin",
    "stats": "STR / DEX / VIG / MND",
    "role": "Published build",
    "playstyle": "The way this Build works is that you'll use the Zamor Curved Sword and its weapon skill Zamor Ice Storm to devastating effect. Zamor Ice Storm deals exclusively Magic Damage and sets Frostbite, despite the weapon having no Magic Damage itself, nor any Intelligence scaling. However, it deals very high damage, particularly when boosted by Shard of Alexander and Magic Scorpion Charm. Because you don't need to focus on your damaging stats (STR and DEX) as much, because they don't boost the damage of Zamor Ice Storm, this allows you to drop points into Faith to pick up other buffs like Golden Vow, which will further boosts you Zamor Ice Storm damage, which is great. You can also do Block Counter relatively well with this Build due to the Curved Sword Talisman, and because you have Assassin's Cerulean Dagger slotted you can refund FP when you Critical Strike after a Block Counter, allowing you to use Zamor Ice Storm more easily.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Zamor Curved Sword & Clawmark Seal",
      "dlc": "Zamor Curved Sword & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Zamor Curved Sword & Clawmark Seal",
      "offhand": "Kite Shield",
      "skill": "Zamor Ice Storm",
      "talismans": [
        "Shard of Alexander",
        "Magic Scorpion Charm",
        "Curved Sword Talisman",
        "Assassin's Cerulean Dagger"
      ],
      "armour": "Fingerprint Set",
      "spells": [
        "Blessing's Boon"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor & Mind; Strength & Dexterity"
    },
    "source": {
      "label": "Fextralife: Frost Paladin",
      "url": "https://eldenring.wiki.fextralife.com/Frost_Paladin_Build"
    }
  },
  {
    "id": "fextra-frostfumonk",
    "name": "Frost-Fu Monk",
    "stats": "STR / DEX / INT / VIG / END",
    "role": "Published build",
    "playstyle": "Since the theme of this build is \"Frost\", it uses the Cold infusion and switched the skill from its default to the Divine Beast Frost Stomp. Imbuing the weapon with the Cold infusion is just about the same damage output that you get if you go for the Heavy infusion. Naturally, with the cold infusion, you'll get the frostbite buildup from using Divine Beast Frost Stomp plus more damage, and it can also make your targets flinch in the middle of your long combos. Swapping the default skill Palm Blast to Divine Beast Frost Stomp takes this build to another level, not only are you capable of executing fast hand-to-hand combos, but using the skill, provides more ways of attacking and killing enemies. The Frost-Fu Monk build highlights a new weapon type, Hand-to-Hand Arts, specifically the Dryleaf Arts weapon. The weapon can be obtained as a drop after defeating Dryleaf Dane. Approach the NPC and use the May the Best Win gesture to trigger the boss fight. The Dryleaf Arts weapon is also quite versatile to use and has cool rapid combos, but what stands out is its running R2 combo and the jumping attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Dryleaf Arts"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Dryleaf Arts",
      "offhand": "No off-hand item required",
      "skill": "Divine Beast Frost Stomp",
      "talismans": [
        "Blue Dancer Charm",
        "Dragoncrest Greatshield Talisman",
        "Bull-Goat's Talisman",
        "Shard of Alexander"
      ],
      "armour": "Dane's Hat, Messmer Soldier Armor, Horned Warrior Gauntlets, Horned Warrior Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Thorny Cracked Tear",
      "stats": "Strength, Dexterity, Intelligence Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Frost-Fu Monk",
      "url": "https://eldenring.wiki.fextralife.com/Frost-Fu_Monk_Build"
    }
  },
  {
    "id": "fextra-ghostblade",
    "name": "Ghostblade",
    "stats": "STR / DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Ghostblade is a quality build that utilizes Death's Poker and its unique weapon skill Ghostflame Ignition. This skill primarily scales with intelligence to heavy damage to targets. Ghostblade build is a quality build that relies on a Death's Poker to deal with normal attacks to its enemies and even burst down bosses with its unique skill, the Ghostflame Ignition. Not only does this skill do heavy damage to targets, but it also builds up Frostbite leading to more possible damage. The way how this build behaves is the user will focus on using the Ghostflame Ignition as the main damage dealer to enemies. This skill can be utilized in two different ways, first after pressing R2, quickly pressing R1 will let the user cast a fire trail that continuously deals damage to enemies. The R1 variant of this skill is a great opener in boss fights or any other enemies since the target tries to close its distance to the user, it will already suffer damage over time from the flame trail and also build Frostbite. This build explores the following talismans, the Warrior Jar Shard or Shard of Alexander for further damage increase overall, Magic Scorpion Charm for even more damage since the Ghostflame Ignition scales purely with Intelligence, Dragoncrest Greatshield to offset the Magic Scorpion Charm 10% physical damage taken increase and lastly, Curved Sword Talisman to increase the guard counter damage of this build.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Death's Poker, Staff of Loss",
      "dlc": "Death's Poker, Staff of Loss"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Death's Poker, Staff of Loss",
      "offhand": "Scorpion Kite Shield",
      "skill": "Ghostflame Ignition",
      "talismans": [
        "Warrior Jar Shard",
        "Shard of Alexander",
        "Magic Scorpion Charm",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Sanguine Noble Hood, Maliketh's Armor, Maliketh's Gauntlets, Maliketh's Greaves or any armor with high protection and 51+ Poise",
      "spells": [
        "Terra Magica"
      ],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, Strength, Dexterity & Intelligence; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Ghostblade",
      "url": "https://eldenring.wiki.fextralife.com/Ghostblade_Build"
    }
  },
  {
    "id": "fextra-gladiator",
    "name": "Gladiator",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Gladiator is a strength build that utilizes a cold-infused Highland Axe and a Redmane Shield. Primarily scales with strength and heavily relies on Stamp (Upward Cut) to shell out damage and takes advantage of the hyper armor that it provides that can brace incoming damage. Leading to stance breaks and critical strikes. The Gladiator build is a straightforward but aggressive build that relies on cold-infused Highland Axe for damage. The main key point of this build is the Stamp ( Upward Cut ) Ashes of War which lets you mitigate incoming damage and allow your character to go under hyper armor. You will receive mitigated damage but 90% of the time, an upward cut will connect, dealing a considerable amount of raw and stance damage. Repeat this strategy to break the stance of the enemy and dish out critical hits. Guard Counters are at your disposal, dealing decent damage with the use of Redmane Shield.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Highland Axe",
      "dlc": "Highland Axe"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Highland Axe",
      "offhand": "Redmane Shield",
      "skill": "Stamp (Upward Cut)",
      "talismans": [
        "Shard of Alexander",
        "Dagger Talisman",
        "Bull-Goat's Talisman",
        "Assassin's Cerulean Dagger"
      ],
      "armour": "Rotten Duelist Helm, Rotten Gravekeeper Cloak, Bull-Goats Gaunlets, Rotten Duelist Greaves",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, Strength & Dexterity; Endurance, Mind & Mind"
    },
    "source": {
      "label": "Fextralife: Gladiator",
      "url": "https://eldenring.wiki.fextralife.com/Gladiator_Build"
    }
  },
  {
    "id": "fextra-godslayer",
    "name": "Godslayer",
    "stats": "STR / DEX / FAI / VIG",
    "role": "Published build",
    "playstyle": "A Dexterity/Faith/Strength Build that focuses exclusively on the use of Godslayer's Greatsword. The way this Build works is that you'll use The Queen's Black Flame to dispatch the toughest enemies and bosses in Elden Ring, while using R1 and R2 attacks on normal enemies. You'll buff with Golden Vow and Flame, Grant Me Strength as necessary to further boost damage when needed. The Queen's Black Flame has a rather long wind up making it hard to land without trading damage, which is why you will have high Poise from your Armor (over 100) ideally, which will allow you to shrug off even the hardest hitting attacks and still keep using this Skill. Remember that the Queen's Black Flame sets the Black Flame status effect, which deals damage based on the Max HP of the target. Additional input allows for a follow-up attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Godslayer's Greatsword & any Sacred Seal",
      "dlc": "Godslayer's Greatsword & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Godslayer's Greatsword & any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "The Queen's Black Flame",
      "talismans": [
        "Shard of Alexander",
        "Carian Filigreed Crest",
        "Bull-Goat's Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any Armor with high Poise, the higher the better.",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Strength & Faith"
    },
    "source": {
      "label": "Fextralife: Godslayer",
      "url": "https://eldenring.wiki.fextralife.com/Godslayer_Build"
    }
  },
  {
    "id": "fextra-goldbreaker",
    "name": "Gold Breaker",
    "stats": "STR / DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Gold Breaker Build is an \"NG+\" build that utilizes Marika's Hammer, a weapon you acquire by trading the Elden Remembrance with Enia at Roundtable Hold after defeating the final boss in Elden Ring. Even though it was tempting not to create a build that focuses on the weapon, in practice that there is much more the hammer weapon can offer and this build has come up with a build that players can resort to if they want to use Marika's Hammer. Marika's Hammer is the primary equipment used for this build, although the weapon has holy damage (considered the worst damage type in general), it deals both Physical and Holy damage but most of it comes from Physical damage. It also has great scaling in terms of potential multiple playthroughs because the weapon scales with Strength, Dexterity, and Faith which are stats you would eventually improve to get more value out of the weapon. Another thing that makes the weapon special is its skill, Gold Breaker, triggering the character to leap up high and slam the ground causing a large AoE explosion that can hit multiple targets, a perfect skill for farming or if you are cornered by a group of enemies. And even if you don't use it as a way to one-shot a group, the skill is still viable to deal high damage and make a strong enemy such as a boss flinch or even send them flying up for a brief moment, allowing you to reassess your next move or use another Gold Breaker.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from NG+",
      "mid": "Published from NG+",
      "late": "Marika's Hammer",
      "dlc": "Marika's Hammer"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "NG+",
      "weapon": "Marika's Hammer",
      "offhand": "Golden Greatshield; Finger Seal",
      "skill": "Gold Breaker, Golden Vow",
      "talismans": [
        "Assassin's Cerulean Dagger",
        "Carian Filigreed Crest",
        "Shard of Alexander",
        "Warrior Jar Shard"
      ],
      "armour": "Leyndell Knight Set",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Holy-Shrouding Cracked Tear, Strength-knot Crystal Tear",
      "stats": "Strength, Vigor, Endurance; Faith, Dexterity, Mind"
    },
    "source": {
      "label": "Fextralife: Gold Breaker",
      "url": "https://eldenring.wiki.fextralife.com/Gold_Breaker_Build"
    }
  },
  {
    "id": "fextra-goldenchampion",
    "name": "Golden Champion",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Dexterity-based tank build that can Block-Counter, Dual Wield and Parry all in one setup. Ornamental Straight Sword is actually a \"paired weapon\" allowing you to single hand or dual wield them by pressing Triangle + R1. The way this Build works is that you'll buff with Golden Tempering, increasing your Holy Damage and changing your R2 to a special flurry that hits repeatedly with both swords, even if only one is currently equipped. You can use Golden Vow as necessary as well to help with more difficult areas and bosses, You'll use your Sword and Shield setup most of the time, using Golden Parry to Parry enemies from a safe distance, and using your charged R2 to hit enemies repeatedly. Some tough enemies or Bosses you'll go hyper aggressive, and dual wield swinging through enemy attacks to increase your damage as quickly as possible, building up your damage thanks to your Talismans. While in effect, strong attack performs a dual-wielding combo attack. Perform an Erdtree incantation and swing the shield to deflect enemy attacks and break their stance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Ornamental Straight Sword & any Sacred Seal",
      "dlc": "Ornamental Straight Sword & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "critical-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Critical attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Ornamental Straight Sword & any Sacred Seal",
      "offhand": "Banished Knight's Shield",
      "skill": "Golden Tempering & Golden Parry",
      "talismans": [
        "Winged Sword Insignia",
        "Millicent's Prosthesis",
        "Dragoncrest Greatshield Talisman",
        "Spear Talisman"
      ],
      "armour": "Banished Knight Set",
      "spells": [
        "Golden Vow",
        "Blessing's Boon",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Golden Champion",
      "url": "https://eldenring.wiki.fextralife.com/Golden_Champion_Build"
    }
  },
  {
    "id": "fextra-goldenswordsage",
    "name": "Golden Sword Sage",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Faith/Intelligence Build that focuses on the use of Holy Damage and Golden Order Incantations. Triple Rings of Light is used to deal with enemies that dodge when you fling spells, like Black Knife Assassins, Bloodhound Knights, or Godskin Apostles. It deals slightly more damage than Discus of Light on average, but costs about 3x the FP, so avoid using it regularly. Elden Stars is your super long range spell that's good at picking off enemies from a long distance, or harassing Bosses while you attack with other spells or Unblockable Blade. The way this Build works is that you'll be wielding the Coded Sword, which deals 100% Holy Damage and only scales with Faith. You'll use Sacred Scorpion Charm, Ritual Sword Talisman and Holy-Shrouding Cracked Tear to boost its damage. Use Unblockable Blade for a small cluster of enemies, or against Bosses or enemies that use Shields. Discus of Light is your go to offensive Golden Order Incantation, and its boosted in damage by Sacred Scorpion Charm, Ritual Sword Talisman, Holy-Shrouded Cracked Tear, Golden Order Seal and Radiant Gold Mask.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Coded Sword, Sword of Night and Flame, and Golden Order Seal",
      "dlc": "Coded Sword, Sword of Night and Flame, and Golden Order Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Coded Sword, Sword of Night and Flame, and Golden Order Seal",
      "offhand": "Blue-Gold Kite Shield",
      "skill": "Unblockable Blade & Barricade Shield",
      "talismans": [
        "Sacred Scorpion Charm",
        "Ritual Sword Talisman",
        "Ritual Shield Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Radiant Gold Mask, and any Armor with high Poise.",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Discus of Light",
        "Triple Rings of Light",
        "Radagon's Rings of Light",
        "Elden Stars",
        "Litany of Proper Death."
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Golden Sword Sage",
      "url": "https://eldenring.wiki.fextralife.com/Golden_Sword_Sage_Build"
    }
  },
  {
    "id": "fextra-goldeneyebow",
    "name": "Goldeneye Bow",
    "stats": "DEX / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A purely ranged Bow Build that focuses on dealing Holy Damage and Bleed, while casting some Incantations. You'll use Barrage and quick shots with the Black Bow to set Hemorrhage on targets that are too hard to kill at range, or range is simply not an option using Blood Arrows. You can also pop on the Silver Tear Mask and use the Swarm of Flies spell to assist you here. Protection of the Erdtree can be used before bosses that deal fire, magic, holy or lightning damage that's hard to dodge. The way this Build works is that you'll buff with Golden Vow and you'll use Golden Arrows to take down targets from a distance with your Erdtree Bow using Mighty Shot. Some fights you won't be able to stay far away and that's when you'll swap to your Black Bow. Blessing of the Erdtree is used to keep your HP at full so you gain extra damage and should be used before boss fights, or when you need to heal but aren't in immediate danger.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Erdtree Bow, Black Bow & Finger Seal",
      "dlc": "Erdtree Bow, Black Bow & Finger Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Erdtree Bow, Black Bow & Finger Seal",
      "offhand": "No off-hand item required",
      "skill": "Mighty Shot & Barrage",
      "talismans": [
        "Arrow's Reach Talisman",
        "Arrow's Sting Talisman",
        "Ritual Sword Talisman",
        "Sacred Scorpion Charm"
      ],
      "armour": "Any you can wear and still medium roll. Silver Tear Mask is good if you don't boost Arcane.",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Protection of the Erdtree",
        "Swarm of Flies",
        "Elden Stars"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Mind; Dexterity & Vigor"
    },
    "source": {
      "label": "Fextralife: Goldeneye Bow",
      "url": "https://eldenring.wiki.fextralife.com/Goldeneye_Bow_Build"
    }
  },
  {
    "id": "fextra-gravitygod",
    "name": "Gravity God",
    "stats": "STR / DEX / VIG",
    "role": "Published build",
    "playstyle": "A melee build that uses a ranged weapon ability to stagger and deal fantastic damage while remaining safely. The way this Build works is that you'll buff with Golden Vow as you travel around using Gravity Bolt at will to destroy enemies before they can even attack you once. Because Gravity Bolt staggers most enemies in one cast, even if it doesn't kill them it will often disable them preventing them from reaching you. Gravity Bolt does mostly Physical Damage, which is great against just about every enemy type in the game, and the stagger it provides allows you to stun lock many difficult enemies and Bosses repeatedly from a safe distance. You can also deal good Jump Attack damage with this Build because it is a Colossal Weapon and because of Raptor's Black Feathers. If you want even more Jump Attack damage you can replace Dragoncrest Greatshield Talisman with Claw Talisman.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Fallingstar Beast Jaw & any Sacred Seal",
      "dlc": "Fallingstar Beast Jaw & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Fallingstar Beast Jaw & any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "Gravity Bolt",
      "talismans": [
        "Shard of Alexander",
        "Ritual Sword Talisman",
        "Carian Filigreed Crest",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Okina Mask, Raptor's Black Feathers, and any Armor that allows you to medium roll",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor"
    },
    "source": {
      "label": "Fextralife: Gravity God",
      "url": "https://eldenring.wiki.fextralife.com/Gravity_God_Build"
    }
  },
  {
    "id": "fextra-gravitysorcerer",
    "name": "Gravity Sorcerer",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "Gravity Well is outperformed by Collapsing Stars, which deals about 40% more damage and is more FP efficient, making it the preferred choice. Meteorite of Astel is chosen over the regular Meteorite spell due to its higher damage output and faster summoning of meteors, despite its higher FP cost. This spell is particularly effective when used in combination with the Cerulean Hidden Tear, allowing for continuous casting without consuming FP. Gravitational Missile, obtained from defeating the Falling Star Beast boss, is one of the new spells introduced with the DLC. It deals 100% magic damage, making it compatible with the Magic Scorpion Charm and Magic-Shrouding Cracked Tear. The spell shoots an orb that pulls enemies towards it before detonating in a large explosion. The first aspect to consider for a Gravity Sorcerer build is the choice of staff. This build features 80 Intelligence, maximizing the effectiveness of this staff.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 156",
      "mid": "Published from 156",
      "late": "Published from 156",
      "dlc": "Carian Regal Scepter"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "156",
      "weapon": "Carian Regal Scepter",
      "offhand": "Meteorite Staff, Golden Order Seal",
      "skill": "No Skill",
      "talismans": [
        "Graven-Mass Talisman",
        "Godfrey Icon"
      ],
      "armour": "Preceptor's Big Hat, Ruler's Robe, Preceptor's Gloves, Preceptor's Trousers",
      "spells": [
        "Collapsing Stars",
        "Meteorite of Astel",
        "Gravitational Missile",
        "Blades of Stone",
        "Rock Sling"
      ],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Cerulean Hidden Tear",
      "stats": "Intelligence, Vigor; Mind, Faith"
    },
    "source": {
      "label": "Fextralife: Gravity Sorcerer",
      "url": "https://eldenring.wiki.fextralife.com/Gravity_Sorcerer_Build"
    }
  },
  {
    "id": "fextra-grimreaper",
    "name": "Grim Reaper",
    "stats": "STR / ARC / VIG",
    "role": "Published build",
    "playstyle": "Poison Armament and Poison Mist are useful against Bleed Immune enemies, providing you an option in these cases. You can also use Mushroom Crown and Kindred of Rot's Exultation in these cases to keep your Attack Power high. The way this Build works is that you'll buff your Scythe with Bloodflame Blade and use Stormcaller to rapidly strike enemies or Bosses for high damage and decent Bleed Build Up. The Grave Scythe has native Bleed Build Up on hit, and when combined with Bloodflame Blade, this only becomes more effective. This results in insane Attack Power, particularly when buffed with Golden Vow and Flame, Grant Me Strength, where you can reach over 2500!",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Grave Scythe & Dragon Communion Seal",
      "dlc": "Grave Scythe & Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "status-buildup"
    ],
    "startingClass": "Not specified",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Grave Scythe & Dragon Communion Seal",
      "offhand": "No off-hand item required",
      "skill": "Stormcaller",
      "talismans": [
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Lord of Blood's Exultation",
        "Shard of Alexander"
      ],
      "armour": "White Mask and and the heaviest Armor that still allows you to medium roll",
      "spells": [
        "Bloodflame Blade",
        "Poison Armament",
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Poison Mist",
        "Swarm of Flies"
      ],
      "flask": "Mostly HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Strength; Vigor"
    },
    "source": {
      "label": "Fextralife: Grim Reaper",
      "url": "https://eldenring.wiki.fextralife.com/Grim_Reaper_Build"
    }
  },
  {
    "id": "fextra-guardiangolem",
    "name": "Guardian Golem",
    "stats": "STR / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength build that focuses on the use of the Golem's Halberd for devastating damage. Royal Knight's Resolve is quite cheap FP wise, and buffs your next attack by 80%, which allows for your Charged R2s to hit like a truck, and also your Block Counters as well. Use this as often as needed, particularly in Boss fights to make them go faster. The way this Build works is that you'll two-hand the Golem's Halberd getting very high Attack Rating and you can use just about any attack with it effectively. You can Block Counter very easily with this Weapon since it has great Guard Boos and you have Curved Sword Talisman. You can Jump Attack easily and have Claw Talisman. And you can Charged R2 for high damage and Stance Damage and have Axe Talisman. By wearing very heavy armor with high poise and protection, as well as stacking Dragoncrest Greatshield Talisman, you are able to play very aggressively with little fear of dying from hits.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Golem's Halberd",
      "dlc": "Golem's Halberd"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Golem's Halberd",
      "offhand": "No off-hand item required",
      "skill": "Royal Knight's Resolve",
      "talismans": [
        "Curved Sword Talisman",
        "Claw Talisman",
        "Axe Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any that has at least 51 Poise",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Guardian Golem",
      "url": "https://eldenring.wiki.fextralife.com/Guardian_Golem_Build"
    }
  },
  {
    "id": "fextra-haimahoplite",
    "name": "Haima Hoplite",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Haima Hoplite is based on Strength and Intelligence stat attributes to utilize the Clayman's Harpoon's Physical and Magic damage. Paired with the Impaling Thrust and Repeating Thrust Ashes of War, this build can stance-break targets or even burst down bosses with highly damaging repeating thrusts. The Haima Hoplite build is a Strength and Intelligence build that relies on a Clayman's Harpoon to deal damage to targets. Its uncommon weapon damage type which can deal with physical and magic damage simultaneously opens up interesting setups such as utilizing Scholar's Armaments for more damage. As mentioned, the user will rely on its physical and magic damage when dealing damage to targets. Using the Academy Glintstone Staff will let the user buff the Clayman Harpoon's Magic Damage by imbuing the weapon with Scholar's Armament. In this manner, Clayman Harpoon's repeating thrust can easily score high damage numbers due to added damage from the Scholar Armament. When fighting bosses, it is suggested to switch to Impaling Thrust Ashes of War to quickly break the target's stance and be open from Critical Strikes.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Clayman's Harpoon, Academy Glintstone Staff",
      "dlc": "Clayman's Harpoon, Academy Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Clayman's Harpoon, Academy Glintstone Staff",
      "offhand": "Cuckoo Greatshield",
      "skill": "Repeating Thrust, Impaling Thrust",
      "talismans": [
        "Shard of Alexander",
        "Curved Sword Talisman",
        "Spear Talisman",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Cuckoo Knight Helm, Blaidd's Armor, Cuckoo Knight Gauntlets, Cuckoo Knight Greaves or any armor with high protection and 51+ Poise",
      "spells": [
        "Terra Magica",
        "Scholar's Armament"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, Strength & Intelligence; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Haima Hoplite",
      "url": "https://eldenring.wiki.fextralife.com/Haima_Hoplite_Build"
    }
  },
  {
    "id": "fextra-hellfireherald",
    "name": "Hellfire Herald",
    "stats": "FAI / VIG / END",
    "role": "Published build",
    "playstyle": "A Dual-Wielding Greatsword Build that flattens enemies with Jump Attacks while using both Fire and Holy Damage. The way this Build works is that you'll use two Royal Knight's Resolves on two Iron Greatswords either setting them both Flame Art or both Sacred depending on the enemies you are facing. An Intelligence/Faith Build thas uses the Sword of Night and Flame to full effect, while also using both Sorceries and Incantations to dispatch enemies. You also deal incredible damage just with regular melee attacks, as the Sword of Night and Flame has one of the highest Attack Ratings in Elden Ring. Golden Vow increases your overall damage and defenses, allowing you to deal even more damage while becoming even tankier. Flame, Grant Me Strength allows you buff both your Fire and Physical Damage, and when you have two Flame Art infused Iron Greatswords that's a huge damage boost. The way this Build works is that you'll prioritize using the magic attack of Sword of Night and Flame, by using things that boost its damage, as well as the damage of your regular weapon attacks. Magic Scorpion Charm, Golden Vow, Spellblade Set and Terra Magica all boost this damage, making it much more deadly. You can still use the Flame attack when you want as well, but you'll buff with Flame, Grant Me Strength instead of Terra Magica when using it to boost Fire Damage instead of magic.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Iron Greatsword x2",
      "dlc": "Iron Greatsword x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Iron Greatsword x2",
      "offhand": "Finger Seal",
      "skill": "Royal Knight's Resolve x2",
      "talismans": [
        "Fire Scorpion Charm",
        "Magic Scorpion Charm",
        "Dragoncrest Shield Talisman +1",
        "Godfrey Icon"
      ],
      "armour": "Raptor's Black Feathers & the heaviest you can wear and still med roll",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Blessing's Boon",
        "Lightning Spear"
      ],
      "flask": "Split between FP & HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Hellfire Herald",
      "url": "https://eldenring.wiki.fextralife.com/Hellfire_Herald_Build"
    }
  },
  {
    "id": "fextra-howlingstarfist",
    "name": "Howling Starfist",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Dexterity Build that uses Fists to set Bleeding and to range down enemies with Beast's Roar. Charged R2 attacks are very good with the Star Fist because they deal exceptional stance damage, and also count as two-hits, dealing incredible damage and building up Bleed faster than some other Fist R2s. Use them when you can. This Ash of War has tremendous range and decent damage, allowing you to shore up the weakest aspect of Fist Weapons, range. The way this Build works is that you'll buff with Bloodflame Blade as necessary in order to add more Bleeding build up to your Star Fist, which you will be dual wielding. Attacking repeatedly will not only increase your Attack Power thanks to Rotten Winged Sword Insignia, but also because you will eventually trigger Hemorrhage, triggering White Mask and Lord of Blood's Exultation, further boosting Attack Power. The weapons in this build apply Hemorrhage 45, Madness 55.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Star Fist, Highland Axe & Frenzied Flame Seal",
      "dlc": "Star Fist, Highland Axe & Frenzied Flame Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Star Fist, Highland Axe & Frenzied Flame Seal",
      "offhand": "No off-hand item required",
      "skill": "Beast's roar",
      "talismans": [
        "Roar Medallion",
        "Shard of Alexander",
        "Lord of Blood's Exultation",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "White Mask, and any other Armor that gives you lots of Poise",
      "spells": [
        "Bloodflame Blade"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Howling Starfist",
      "url": "https://eldenring.wiki.fextralife.com/Howling_Starfist_Build"
    }
  },
  {
    "id": "fextra-inquisitor",
    "name": "Inquisitor",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Quality (Strength/Dexterity) Build that focuses on the use of the Ghiza's Wheel Colossal Weapon for optimal damage. When the wheel spins after an R2 or charged R2, you'll often trigger Hemorrhage in one attack, which will trigger Lord of Blood's Exultation and White Mask if you're using it. This boosts your Attack Power even higher, and you'll often trigger Millicent's Prosthesis at the same time, getting even higher attack rating. Spinning Wheel does not trigger Hemorrhage easily, and does not trigger Winged Sword Insignia or Millicent's Prosthesis, so it's not particularly useful for tough enemies so this build does not use it often. Instead you'll use Jump Attack, buff with Contagious Fury to further boost your R2 damage, and use Charged R2s for even more damage and stagger. The way this Build works is that you'll use the one-handed R2 and one-handed charged R2 attacks of Ghiza's Wheel to take advantage of Axe Talisman, and to give you hyper armor, but most importantly to hit multiple times as the wheel spins when it lands. If you two-hand this weapon then it spins behind you instead of in front of you, so it's important to one-hand it and use these R2 attacks, because R1s don't make the wheel spin. Raises attack power for a certain duration.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Ghiza's Wheel",
      "dlc": "Ghiza's Wheel"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Ghiza's Wheel",
      "offhand": "Jellyfish Shield",
      "skill": "Contagious Fury",
      "talismans": [
        "Axe Talisman",
        "Lord of Blood's Exultation",
        "Claw Talisman",
        "Millicent's Prosthesis"
      ],
      "armour": "Heaviest you can wear and still medium roll",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Endurance & Vigor"
    },
    "source": {
      "label": "Fextralife: Inquisitor",
      "url": "https://eldenring.wiki.fextralife.com/Inquisitor_Build"
    }
  },
  {
    "id": "fextra-knightblade",
    "name": "Knight Blade",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "The Knight Blade is a build that highlights a new weapon, the Backhand Blade. The weapon is not optimized for block countering due to its low guard boost, but it has a cool spinning attack that can attack multiple enemies at once if you manage to pull off a block counter. The weapon's attack chain covers a large AoE, making it excellent for clearing out groups of smaller enemies. The Ash of War: Blind Spot, is what truly makes this weapon shine. Blind Spot allows you to sidestep an attack and strike from behind, with iFrames that let you dodge through attacks and reposition mid-combo. This mechanic is akin to a sidestep or quickstep followed by an attack in one animation,. Using it twice in combat can drain your stamina completely if you have an average amount. To cover this weakness, the build is optimized with a lot of stamina and is equipped with a talisman for stamina recovery, allowing you to use this ability more often.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Backhand Blade"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Backhand Blade",
      "offhand": "Great Turtle Shell",
      "skill": "Blind Spot",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Dragoncrest Greatshield Talisman",
        "Two-Headed Turtle Talisman"
      ],
      "armour": "Black Knight Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Thorny Cracked Tear",
      "stats": "Dexterity, Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Knight Blade",
      "url": "https://eldenring.wiki.fextralife.com/Knight_Blade_Build"
    }
  },
  {
    "id": "fextra-kungfukatarist",
    "name": "Kung Fu Katarist",
    "stats": "FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Kung Fu Katarist heavily relies on the weapon Katar, buffed with Electrify Armament to deal with lightning-imbued consecutive attacks and inflict high damage numbers. Since the Katar can do thrust damage, it can wield the Impaling Thrust Ashes of War to break enemy defenses and stances. The Kung Fu Katarist is a hyper-aggressive build that deals the majority of its damage by inflicting lightning-imbued consecutive attacks on targets. Due to its tanking capability, it can receive hits and trade blows with its targets, while dishing out its attack combinations. Users need to ensure to use the Electrify Armament before engaging in a fight to reach high damage potential. If the enemy is resistant to lightning attacks, on the other hand, the build is equipped with the following incantation, Bloodflame Blade and Order's Blade to be versatile in combat. In this manner, it will allow the user to use a different kind of element to buff the katar before engaging in combat. The Golden Vow incantations provide more Attack and Defense, to support the build's playstyle. The Wrath of Gold is suggested when dealing with a large group of enemies since the Katar is most effective when dealing with a single enemy.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Katar, Erdtree Seal",
      "dlc": "Katar, Erdtree Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters",
      "meme",
      "cosplay"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Katar, Erdtree Seal",
      "offhand": "No off-hand item required",
      "skill": "Impaling Thrust",
      "talismans": [
        "Dragoncrest Greatshield Talisman",
        "Spear Talisman",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Haligtree Knight Helm, Blackflame Monk Armor, Scaled Gauntlets, Scaled Greaves or any armor with high protection and 51+ Poise",
      "spells": [
        "Golden Vow",
        "Electrify Armament",
        "Bloodflame Blade",
        "Order's Blade",
        "Wrath of Gold"
      ],
      "flask": "Mostly HP & Some SP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor & Faith; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Kung Fu Katarist",
      "url": "https://eldenring.wiki.fextralife.com/Kung_Fu_Katarist_Build"
    }
  },
  {
    "id": "fextra-flyingmantis",
    "name": "Flying Mantis",
    "stats": "DEX / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "Jumping attack focused build with wide sweeps applying bleed and frostbite. Main method of attacking is the mid-air L1, which does a wide sweep with both scythes in a large arc, dealing both huge upfront damage and applying both frostbite and bleed. Chilling Mist doubles frost output, once frostbite is applied, switch to your sacred seal to cast Black Flame Blade, then jump back in and to reset the frostbite bar, doing additional health % damage from the Black Flame DoT. No block option, so stay mobile. If you prefer, once you get a second scythe from NG+ or a friend dropping one for you, you can replace the grave scythe and drop the faith aspect entirely, just using firebombs to reset frost, and put Ash of War: Bloodhound's Step as your main weapon art, setting the affinity to either frost or bleed according to your preference once you have the appropriate whetblades.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Grave Scythe in main hand, Scythe in off-hand",
      "dlc": "Grave Scythe in main hand, Scythe in off-hand"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Vagabond",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Grave Scythe in main hand, Scythe in off-hand",
      "offhand": "Finger Seal",
      "skill": "Ash of War: Chilling Mist with Keen affinity on main hand, Ash of War: Hoarfrost Stomp with Frost affinity on offhand.",
      "talismans": [
        "Claw Talisman"
      ],
      "armour": "White Mask, Raptor's Black Feathers, heaviest armor that lets you medium-roll.",
      "spells": [
        "Black Flame Blade"
      ],
      "flask": "1 Cerulean, rest Crimson; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, Endurance & Dexterity.; Faith"
    },
    "source": {
      "label": "Fextralife: Flying Mantis",
      "url": "https://eldenring.wiki.fextralife.com/Flying_Mantis_Build"
    }
  },
  {
    "id": "fextra-ghostflamewarrior",
    "name": "Ghostflame Warrior",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Helphen's Steeple is played as a heavy Strength/Intelligence greatsword, not as a back-line staff caster. Activate Ruinous Ghostflame before engagement to coat the blade with added magic damage and frost buildup, land charged heavies or jump attacks during real openings, then take the critical when the accumulated stance damage breaks the target. The frost proc supplies a burst and leaves the enemy taking increased damage, so refresh the weapon buff and continue physical pressure rather than chasing an immediate second proc. Armour above 51 poise helps a planned heavy survive light interruption, but medium load must be preserved for attacks that should be rolled. One Cerulean flask is usually enough because FP is spent on the weapon buff instead of a spell rotation. Magic-resistant or highly mobile enemies reduce the ghostflame portion, while reckless charged attacks still lose to faster boss strings despite the poise.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Helphen's Steeple, Academy Glintstone Staff (Optional)",
      "dlc": "Helphen's Steeple, Academy Glintstone Staff (Optional)"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Helphen's Steeple, Academy Glintstone Staff (Optional)",
      "offhand": "No off-hand item required",
      "skill": "Ruinous Ghostflame",
      "talismans": [],
      "armour": "Any above 51 Poise, and med load",
      "spells": [],
      "flask": "13 Crimson, 1 Cerulean; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Int, Vig, Str; End, Mind"
    },
    "source": {
      "label": "Fextralife: Ghostflame Warrior",
      "url": "https://eldenring.wiki.fextralife.com/Ghostflame_Warrior_Build"
    }
  },
  {
    "id": "fextra-knightofthorns",
    "name": "Knight of Thorns",
    "stats": "INT / FAI / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "Since this build takes place so late in the game, class doesn't really feel relevant for it, so use whichever you want. For flasks, use whatever you want, but it is recommended having at least 5 Cerulean flasks for consistent casting. It is recommended casting as close to an enemy as possible because according to the friend it's more effective that way. For weapons, it is recommended the Ripple Blade for its pure Arcane scaling, but you could use any Blood Loss weapon too. Also consider either the Albinauric Staff or the Staff of the Guilty. The Albinauric Staff has Arcane scaling, but the Staff of the Guilty would boost Impenetrable Thorns, so it's your choice. A second Staff of the Guilty in the offhand is also preferable for the added passive. For talismans, it is recommended Lord of Blood's Exultation, which boosts your attack power whenever blood loss occurs, the Graven-Mass Talisman, which boosts sorceries by 8%, and the Dragoncrest Greatshield, since the physical defense from Alberich's set is pretty lacking.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Shadow of the Erdtree",
      "mid": "Published from Shadow of the Erdtree",
      "late": "Published from Shadow of the Erdtree",
      "dlc": "Ripple Blade"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "Shadow of the Erdtree",
      "weapon": "Ripple Blade",
      "offhand": "Albinauric Staff",
      "skill": "Wild Strikes",
      "talismans": [
        "Lord of Blood's Exultation",
        "Graven-Mass Talisman",
        "Dragoncrest Greatshield Talisman",
        "Radagon Icon"
      ],
      "armour": "Alberich's Set",
      "spells": [
        "Impenetrable Thorns"
      ],
      "flask": "3/4 Cerulean flasks, rest Crimson flasks.; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane, Vigor; Mind, Faith, Int"
    },
    "source": {
      "label": "Fextralife: Knight of Thorns",
      "url": "https://eldenring.wiki.fextralife.com/Knight_of_Thorns_Build"
    }
  },
  {
    "id": "fextra-level30poisonbleedwretch",
    "name": "Level 30 Poison/Bleed Wretch",
    "stats": "DEX / ARC / VIG",
    "role": "Published PvP build",
    "playstyle": "Strong but balanced low-level invasion build that uses Radagon's Soreseal, applies poison increasing its attack power, and uses Reduvia as a finisher. Both swords used can be replaced with your preference, as long as you can power stance and apply poison affinity to both. Starting off, power stance your straight swords. Power stancing is using each sword in a different hand, then executing attacks with L1 on controller; right click on PC. The diagonal crossing motion on the first two parts of the combo very rapidly applies poison. After applying pressure with the poison, continue to apply pressure with more power stancing or switch to your off-hand, Reduvia. Reduvia's normal attacks are good at staggering low poise targets at close range, and also good as a surprise albeit tiny close gap with its heavy attack, good for punishing rolls too. If you're tired, just use its ability, Reduvia Blood Blade, a spammable, fast casting skill that fires a medium range projectile, applying big bleeds from a safe distance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 30",
      "mid": "Published from 30",
      "late": "Warhawk's Talon +2 (Left), Cane Sword +2 (Right), Reduvia +1",
      "dlc": "Warhawk's Talon +2 (Left), Cane Sword +2 (Right), Reduvia +1"
    },
    "tags": [
      "fextralife",
      "pvp",
      "late",
      "status-buildup"
    ],
    "startingClass": "Wretch",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "PvP Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "30",
      "weapon": "Warhawk's Talon +2 (Left), Cane Sword +2 (Right), Reduvia +1",
      "offhand": "Pillory Shield +2",
      "skill": "Ash of War: Carian Retaliation (Shield), Ash of War: Poisonous Mist and/or Ash of War: Poison Moth Flight (Swords), Reduvia Blood Blade",
      "talismans": [
        "Radagon's Soreseal"
      ],
      "armour": "Any Medium Weight Set",
      "spells": [],
      "flask": "1 FP, remaining flasks HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "28 Arcane, 31 (26 base) Vigor; 23 (13 base) Dexterity"
    },
    "source": {
      "label": "Fextralife: Level 30 Poison/Bleed Wretch",
      "url": "https://eldenring.wiki.fextralife.com/Level_30_Poison-Bleed_Wretch_Build"
    }
  },
  {
    "id": "fextra-level60sttrinasconfessor",
    "name": "Level 60 St. Trina's Confessor",
    "stats": "STR / DEX / INT / VIG / END",
    "role": "Published PvP build",
    "playstyle": "The build revolves around applying sleep with the Sword of St Trina's power stance, with a Pulley Crossbow as off-hand, using Sleepbone Bolts for a close to medium range 3 shot sleep burst. Death's Poker is there for a stylish finisher or for higher poise targets, though it doesn't apply sleep but frostbite. To start off, power stance your Swords of St. Trina. Power stancing is using each sword in a different hand, then executing attacks with L1 on controller; right click on PC. The diagonal crossing motion on the first two parts of the combo very rapidly applies sleep. Sleep works differently from the way it works in small targets in PvE, in which it doesn't open up the target for a critical hit, but instead, breaks his stance for a good while, allowing you to back away and recover stamina, chain the rest of your combo, or pull off a Ghostflame Ignition. You have to be careful when you want to use your sleep openings to deal big damage, as if you hit the target right after the sleep procs, it will cancel the sleep animation. Plus, the sleep animation is not the longest, so act swiftly and know what you want to go for before it happens.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 60",
      "mid": "Published from 60",
      "late": "Sword of St Trina +3, Sword of St Trina +3 (Off-hand), Death's Poker +3, Pulley Crossbow (Off-hand) +3",
      "dlc": "Sword of St Trina +3, Sword of St Trina +3 (Off-hand), Death's Poker +3, Pulley Crossbow (Off-hand) +3"
    },
    "tags": [
      "fextralife",
      "pvp",
      "late",
      "guard-counters"
    ],
    "startingClass": "Confessor",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "PvP Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "60",
      "weapon": "Sword of St Trina +3, Sword of St Trina +3 (Off-hand), Death's Poker +3, Pulley Crossbow (Off-hand) +3",
      "offhand": "No off-hand item required",
      "skill": "Mists of Slumber (Sword of St. Trina), Ghostflame Ignition (Death's Poker)",
      "talismans": [
        "Radagon's Soreseal",
        "Winged Sword Insignia",
        "Green Turtle Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any Medium Weight Set",
      "spells": [],
      "flask": "1 FP, remaining in HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "14 Intelligence, 17 (12 base) Strength, 18 (13 base) Dexterity; 25 (20 base) Endurance, 49 (44 base) Vigor"
    },
    "source": {
      "label": "Fextralife: Level 60 St. Trina's Confessor",
      "url": "https://eldenring.wiki.fextralife.com/Level_60_St._Trina's_Confessor_Build"
    }
  },
  {
    "id": "fextra-lightningdragoon",
    "name": "Lightning Dragoon",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Quality (Strength/Dexterity) melee build that uses the Bolt of Gransax and a Greatshield to electrifying effect You'll use Ancient Lightning Spear to pick off enemies at range as needed, particularly difficult enemies that can be killed quickly with it, or using it against Bosses when melee is not the best option. Ancient Lightning Spear hits much harder than the Lightning Spear Incantation, and costs about the same FP with this setup, and has much more range as well. You can charge it up for extra damage if you want, or just use it regularly when you don't have the spacing or time to do so. The way this Build works is that you'll buff with Golden Vow and you'll Block Counter as necessary. You'll use Bolt of Gransax as your primary weapon, dealing Physical and Lightning Damage, only swapping to Cleanrot Spear or Treespear when enemies resist Lighting Damage. Since you're using a Shield and Spear you can Block and attack at the same time, protecting yourself from attacks while also dealing damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Bolt of Gransax & Cleanrot Spear",
      "dlc": "Bolt of Gransax & Cleanrot Spear"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Bolt of Gransax & Cleanrot Spear",
      "offhand": "Golden Greatshield; Finger Seal",
      "skill": "Ancient Lightning Spear & Sacred Phalanx",
      "talismans": [
        "Shard of Alexander",
        "Radagon's Soreseal",
        "Ritual Sword Talisman",
        "Carian Filigreed Crest"
      ],
      "armour": "Consort's Mask & Leyndell Knight Set",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Strength & Endurance"
    },
    "source": {
      "label": "Fextralife: Lightning Dragoon",
      "url": "https://eldenring.wiki.fextralife.com/Lightning_Dragoon_Build"
    }
  },
  {
    "id": "fextra-lightninglancer",
    "name": "Lightning Lancer",
    "stats": "STR / DEX / FAI / MND / END",
    "role": "Published build",
    "playstyle": "A tanky Faith Build that allow for the use of offensive and defensive Incantations while playing in melee. The Sword Sage is a combination of Intelligence and Faith, using the Sword of Night and Flame and Death Sorceries. The way this Build works is that you increase your Intelligence and Faith high enough to use Sword of Night and Flame and Ancient Death Rancor, which requires 34 Int and 24 Faith. Sword of Night and Flame has an amazing Weapon Art that allows you to do a Comet-like beam with L2 and R1 that does insane damage and has great range. You'll use Golden Vow, Electrify Armament and Blessing's Boon to buff before tough fights, like boss encounters. Golden Vow boosts your overall damage (including spells), as well as defenses. Electrify Armament buffs your Lighting Damage on your melee attacks by a lot, and Blessing's Boon heals you over time. Ancient Death Rancor does incredible stagger damage to enemies, allowing you to pin them down if you spam this, which is fantastic solo and in co op play. It's particularly good against fast moving enemies and bosses that are hard to hit with Sword of Night and Flame's Weapon arts",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Treespear & Clawmark Seal/Gravel Stone Seal",
      "dlc": "Treespear & Clawmark Seal/Gravel Stone Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Treespear & Clawmark Seal/Gravel Stone Seal",
      "offhand": "Golden Greatshield",
      "skill": "Sacred Order, Golden Vow, & Barricade Shield",
      "talismans": [],
      "armour": "Leyndell Knight Set",
      "spells": [
        "Lightning Spear",
        "Electrify Armament",
        "Blessing's Boon"
      ],
      "flask": "Mostly FP, some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength, Faith & Endurance; Dexterity & Mind"
    },
    "source": {
      "label": "Fextralife: Lightning Lancer",
      "url": "https://eldenring.wiki.fextralife.com/Lightning_Lancer_Build"
    }
  },
  {
    "id": "fextra-madking",
    "name": "Mad King",
    "stats": "DEX / FAI / ARC / VIG",
    "role": "Published build",
    "playstyle": "An Arcane/Faith/Dexterity Build that focuses on the use of Madness and Morgott's Cursed Sword. The way this Build works is that you'll use your high Arcane to build up Bleed and Madness quickly via attacks and spells. Swarm of Flies is a good opener on tough enemies that you can then use Cursed-Blood Slice against to set Hemorrhage, as well deal a good amount of damage. Unendurable Frenzy can be used in boss fights after popping the Cerulean Hidden Tear to melt Bosses in just a few seconds. Just hold the button down and stay out of range of the enemy's attacks and you're golden. Frenzied Burst is great for picking off enemies at long range when needed. It deals incredibly high damage and pierced the blocks of enemies. Golden Vow and Flame, Grant Me Strength are there to buff your damage further when needed.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Morgott's Cursed Sword, Dragon Communion Seal & Frenzied Flame Seal",
      "dlc": "Morgott's Cursed Sword, Dragon Communion Seal & Frenzied Flame Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Morgott's Cursed Sword, Dragon Communion Seal & Frenzied Flame Seal",
      "offhand": "No off-hand item required",
      "skill": "Cursed-Blood Slice",
      "talismans": [
        "Shard of Alexander",
        "Fire Scorpion Charm",
        "Ritual Sword Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Heaviest you can wear and still medium roll",
      "spells": [
        "Swarm of Flies",
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Unendurable Frenzy",
        "Frenzied Burst"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Arcane; Faith & Vigor"
    },
    "source": {
      "label": "Fextralife: Mad King",
      "url": "https://eldenring.wiki.fextralife.com/Mad_King_Build"
    }
  },
  {
    "id": "fextra-magicarcher",
    "name": "Magic Archer",
    "stats": "STR / INT / VIG / END",
    "role": "Published build",
    "playstyle": "Horn Bow and Magic Arrows form the main long-range lane: the bow deals native magic damage and specifically improves Magic Arrows, while Mighty Shot converts a safe opening into one stronger guard-piercing hit. Keep the Misbegotten Shortbow ready with Rain of Arrows for a large or stationary target; its clustered impacts apply poison or bleed efficiently, but the 20 FP cost makes it a planned status setup rather than the default attack. If enemies surround the firing position or ammunition must be conserved, swap to the paired Lazuli Glintstone Swords and use their quick dual-wield strings to make space. Strength and Intelligence support the mixed bow damage, Vigor and armour allow one mistake, and Endurance keeps repeated draws from emptying stamina. Different arrow types are the build's matchup system, so restock before a dungeon instead of discovering mid-boss that the correct damage or status ammunition is gone. Fast enemies that constantly close distance force more sword use and expose the build's weaker melee investment.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Horn Bow, Misbegotten Shortbow and Lazuli Glintstone Sword x2",
      "late": "Horn Bow, Misbegotten Shortbow and Lazuli Glintstone Sword x2",
      "dlc": "Horn Bow, Misbegotten Shortbow and Lazuli Glintstone Sword x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "ranged-attacks"
    ],
    "startingClass": "Bandit",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Horn Bow, Misbegotten Shortbow and Lazuli Glintstone Sword x2",
      "offhand": "No off-hand item required",
      "skill": "Rain of Arrows & Mighty Shot",
      "talismans": [],
      "armour": "Heaviest you can and still med roll",
      "spells": [],
      "flask": "Mostly HP, Some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Vigor; Endurance and Intelligence"
    },
    "source": {
      "label": "Fextralife: Magic Archer",
      "url": "https://eldenring.wiki.fextralife.com/Magic_Archer_Build"
    }
  },
  {
    "id": "fextra-magicdragonknight",
    "name": "Magic Dragonknight",
    "stats": "ARC / VIG / END",
    "role": "Published build",
    "playstyle": "Smarag's Glintstone Breath is your go to Dragon Spell, as it deals a ton of damage, and outperforms Borealis's Mist in the majority of cases, except when enemies have huge HP pools, setting Frostbite may benefit you more here if you can't kill the Boss fast enough with Smarag's Glintstone Breath. Agheel's Flame is a nice Fire alternative to Smarag's Glintstone Breath, and you should use the Fire Scorpion Charm instead of Magic Scorpion Charm when using this one. Ezyke's Decay is good against tough enemies that you may need the Scarlet Rot status effect against, but it isn't always needed. (Patch 1.07 decrease the damage of breath spells in PvP. Use the Cerulean Hidden Tear when beginning Boss fights to remove FP cost for 10 seconds, in order to nuke Bosses before they can even attack. The way this Build works is that you'll buff with Golden Vow and use Block-Counters to deal with trash enemies. Most regular attacks bounce off the Jellyfish Shield because it's a Greatshield, making Block-Counters easier, and the damage of these is increased by the Curved Sword Talisman. Raises attack power for a certain duration.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Ripple Blade & Dragon Communion Seal",
      "dlc": "Ripple Blade & Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Ripple Blade & Dragon Communion Seal",
      "offhand": "Jellyfish Shield",
      "skill": "Contagious Fury",
      "talismans": [
        "Magic Scorpion Charm",
        "Ritual Sword Talisman",
        "Curved Sword Talisman",
        "Flock's Canvas Talisman"
      ],
      "armour": "Silver Tear Mask & other Armor with good Poise",
      "spells": [
        "Golden Vow",
        "Smarag's Glintstone Breath",
        "Agheel's Flame",
        "Borealis's Mist",
        "Ekzykes's Decay"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Magic Dragonknight",
      "url": "https://eldenring.wiki.fextralife.com/Magic_Dragonknight_Build"
    }
  },
  {
    "id": "fextra-magmablade",
    "name": "Magma Blade",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Magma Spitter build is introduced, centered around the Magma Blade—a weapon available in the base game rather than a DLC addition. The video emphasizes that while there are numerous builds utilizing this weapon online, this particular build incorporates new items to enhance its effectiveness, making it stand out. Another key component of the build is the Oil-Soaked Tear, which debuffs enemies by coating them in oil, making them more vulnerable to fire damage. This effect is especially potent when combined with the Flame-Shrouding Cracked Tear in the Flask of Wondrous Physick, further enhancing the fire damage output. The guide suggests using a single Magma Blade rather than dual-wielding, as the weapon skill utilizes only one blade, making dual-wielding unnecessary unless focusing solely on the dual-wield moveset. The Magma Blade, a curved sword dealing both physical and fire damage, scales with strength, dexterity, and faith. The build is optimized by focusing heavily on strength, allowing for the use of a greatshield, which synergizes well with the weapon's playstyle. The weapon skill, Magma Shower, mimics the animation of Spinning Slash, creating a spinning attack that releases magma onto the ground.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 171",
      "mid": "Published from 171",
      "late": "Published from 171",
      "dlc": "Magma Blade"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "171",
      "weapon": "Magma Blade",
      "offhand": "Erdtree Seal; One-Eyed Shield",
      "skill": "Magma Shower, Flame Spit",
      "talismans": [
        "Talisman of the Dread",
        "Shard of Alexander",
        "Fire Scorpion Charm"
      ],
      "armour": "Fire Knight Helm, Fire Knight Armor, Scaled Gauntlets, Scaled Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Oil-Soaked Tear, Flame-Shrouding Cracked Tear",
      "stats": "Strength, Vigor; Endurance, Mind, Dexterity"
    },
    "source": {
      "label": "Fextralife: Magma Blade",
      "url": "https://eldenring.wiki.fextralife.com/Magma_Blade_Build"
    }
  },
  {
    "id": "fextra-magus",
    "name": "Magus",
    "stats": "DEX / INT / VIG",
    "role": "Published build",
    "playstyle": "A melee-mage Build that uses Scholar's Armament and Glintstone Phalanx to deal Critical Damage to enemies. Use Glintstone Pebble to thin out enemies or to reach enemies you cannot get with melee attacks, or on horseback as necessary. Use Carian Greatsword when outnumbered or when on horseback to dispatch enemies easily. The way this Build works is that you'll buff your Rapier with Scholar's Armament and then hit L2 to use Glintstone Phalanx. Make sure you use the Keen version of this Ash of War or you won't be able to buff it! Glintstone Phalanx usually staggers enemies in one or two bursts, so be ready to deal Critical Damage with your Rapier which has a Critical Rating of 130 which is pretty damn good.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Rapier",
      "late": "Rapier",
      "dlc": "Rapier"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "skill-damage"
    ],
    "startingClass": "Astrologer",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Rapier",
      "offhand": "Academy Glintstone Staff",
      "skill": "Ash of War: Glintblade Phalanx",
      "talismans": [],
      "armour": "Carian Knight Set",
      "spells": [
        "Scholar's Armament",
        "Glintstone Pebble",
        "Carian Greatsword"
      ],
      "flask": "Slightly more FP than HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Dexterity; Vigor"
    },
    "source": {
      "label": "Fextralife: Magus",
      "url": "https://eldenring.wiki.fextralife.com/Magus_Build"
    }
  },
  {
    "id": "fextra-maternalmage",
    "name": "Maternal Mage",
    "stats": "INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Glintstone Nail will be your go-to ranged projectile spell that you'll often use. It does 100% magic damage, it has a bit of tracking, and it can be charged up for extra damage, pretty reliable to attack targets and killing them even before they know you're there. The next spell is Glintstone Nails, which is a multiple-projectile version of the Glintstone Nail. You may notice that the damage of this spell is about 10-20% higher than the Glintstone Nail, and the reason why this build has this spell is that it does good Stance Damage, resulting in breaking the stance of the targeted enemy. The fourth spell this build has is Cherishing Fingers. This spell does 100% physical damage, it doesn't deal magic damage, and it is another AOE spell that conjures these large fingers around you. It can be charged for increased damage, and it can ward off projectiles only if you fully cast the spell and the fingers that come out of the ground are around you. Best used against enemies or bosses that are aggressive, and targets that are heavily resistant to magic damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Carian Regal Scepter"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Carian Regal Scepter",
      "offhand": "Maternal Staff",
      "skill": "No Skill",
      "talismans": [
        "Crusade Insignia",
        "Blessed Blue Dew Talisman",
        "Graven-Mass Talisman",
        "Godfrey Icon"
      ],
      "armour": "High Priest Hat, Finger Robe, Bull-Goat Gauntlets, Bull-Goat Greaves",
      "spells": [
        "Glintstone Nail",
        "Glintstone Nails",
        "Fleeting Microcosm",
        "Cherishing Fingers"
      ],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Opaline Hardtear",
      "stats": "Intelligence, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Maternal Mage",
      "url": "https://eldenring.wiki.fextralife.com/Maternal_Mage_Build"
    }
  },
  {
    "id": "fextra-messmerflame",
    "name": "Messmer Flame",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Messmer Flame Build combines the Fire Knight Ash of War with the Fire Knight's Greatsword and several Messmer Flame spells from the DLC. Fire Knight's Greatsword is a Colossal Sword with a high attack rating. It has been infused with the Flame Spear Ash of War set to Flame Art infusion, resulting in a weapon that deals significant fire damage. The fire damage is approximately two-thirds of the total damage, with the remaining one-third being physical damage. The Flame-Shrouding Cracked Tear is used to boost fire damage and the Oil-Soaked Tear to debuff enemies, making them take increased fire damage when near the player. This is particularly effective in close-range combat. In the off-hand, the Fire Knight's Seal is used, which boosts Messmer Flame incantations by 15%. Although the incantation scaling is slightly lower than the Erdtree Seal, the convenience of having the seal in the off-hand allows for seamless transitions between casting spells and using the weapon.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 165",
      "mid": "Published from 165",
      "late": "Published from 165",
      "dlc": "Fire Knight's Greatsword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "165",
      "weapon": "Fire Knight's Greatsword",
      "offhand": "Fire Knight's Seal",
      "skill": "Flame Skewer",
      "talismans": [
        "Bull-Goat's Talisman"
      ],
      "armour": "Messmer's Helm, Fire Knight Armor, Fire Knight Gauntlets, Fire Knight Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Fire Serpent",
        "Messmer's Orb"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Oil-Soaked Tear",
      "stats": "Faith, Vigor; Mind, Endurance, Strength"
    },
    "source": {
      "label": "Fextralife: Messmer Flame",
      "url": "https://eldenring.wiki.fextralife.com/Messmer_Flame_Build"
    }
  },
  {
    "id": "fextra-meteormage",
    "name": "Meteor Mage",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "An Intelligence Mage Build that uses Gravity Sorceries that deal both Physical and Magic Damage to cataclysmic effect. The way this Build works is that you'll hold the Meteorite Staff in your left hand in order to give you a passive increase to Gravity Sorcery damage (+30%). You'll then cast with the Carian Regal Scepter in your right hand because it has better Sorcery Scaling at higher Intelligence levels. You'll use Collapsing Stars and Gravity Well for trash enemies as these are easiest to use in these type of encounters, and remember these spells PULL enemies towards you. Rock Sling is there when you need Physical Damage, or are trying to stagger a Boss. It's hard to use in close quarters so it's very situational. Spinning Weapon (12 FP, defensive). The weapons in this build apply Madness 55.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Carian Regal Scepter, Meteorite Staff, & Frenzied Flame Seal",
      "dlc": "Carian Regal Scepter, Meteorite Staff, & Frenzied Flame Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Carian Regal Scepter, Meteorite Staff, & Frenzied Flame Seal",
      "offhand": "No off-hand item required",
      "skill": "Spinning Weapon",
      "talismans": [
        "Ritual Sword Talisman",
        "Magic Scorpion Charm",
        "Godfrey Icon",
        "Graven-Mass Talisman"
      ],
      "armour": "Any Light Armor",
      "spells": [
        "Collapsing Stars",
        "Gravity Well",
        "Rock Sling",
        "Meteorite",
        "Meteorite of Astel"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Meteor Mage",
      "url": "https://eldenring.wiki.fextralife.com/Meteor_Mage_Build"
    }
  },
  {
    "id": "fextra-meteoricmarauder",
    "name": "Meteoric Marauder",
    "stats": "STR / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The weapon skill, White Light Charge, charges you forward in a line for 10 FP, thrusting into the target for modest damage. While the initial damage isn't very high, the follow-up detonation deals significant damage in a small AOE. This skill is an excellent gap closer, particularly useful against bosses that move quickly or have combo attacks that end behind you. The stance damage from both the initial hit and the follow-up is significant, allowing you to stance-break bosses while dealing a lot of damage. The Meteoric Marauder build for Elden Ring's Shadow of the Erdtree DLC centers around the Ancient Meteoric Ore Greatsword, obtainable from the Ruined Forge of Starfall Past without encountering a boss, making it easily accessible. This build features a 'bonk' weapon, emphasizing strength and arcane attributes. The Ancient Meteoric Ore Sword scales predominantly with these attributes, offering a high attack rating that deals both physical and magic damage, a rare combination in Elden Ring. Managing your equip load is crucial to avoid fat rolling while wielding this weapon. Additionally, when fully upgraded to 60, the sword provides a decent guard boost, enabling effective blocking and countering. This can be handy when you need to block in a pinch while exploring or during boss fights, so don't be afraid to block with this weapon.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 164",
      "mid": "Published from 164",
      "late": "Published from 164",
      "dlc": "Ancient Meteoric Ore Greatsword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "164",
      "weapon": "Ancient Meteoric Ore Greatsword",
      "offhand": "Sacrificial Axe",
      "skill": "White Light Charge",
      "talismans": [
        "Shard of Alexander",
        "Spear Talisman",
        "Two-Handed Sword Talisman",
        "Carian Filigreed Crest"
      ],
      "armour": "Greathelm, Black Knight Armor, Black Knight Gauntlets, Black Knight Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Stonebarb Cracked Tear, Opaline Hardtear",
      "stats": "Strength, Vigor, Endurance; Arcane, Mind"
    },
    "source": {
      "label": "Fextralife: Meteoric Marauder",
      "url": "https://eldenring.wiki.fextralife.com/Meteoric_Marauder_Build"
    }
  },
  {
    "id": "fextra-moonlightcrusader",
    "name": "Moonlight Crusader",
    "stats": "INT / VIG / MND",
    "role": "Published build",
    "playstyle": "An Intelligence Build that uses the Dark Moon Greatsword and spells to range down enemies from a distance. Terra Magica boosts all Magic Damage when standing inside its area of effect, so this includes Moonlight Greatsword and any melee attacks you do while inside it, since the Greatsword does some Magic Damage as well. Use this to boost your damage when needed. The way this Build works is that you'll be using the Moonlight Greatsword ability of the Dark Moon Greatsword to change the R2 attack into a wave that can stagger enemies at range when fully charged. This wave deals 100% Magic Damage, which is why this build raises Intelligence very high, even though the Greatsword can scale with other stats. Casting Greatblade Phalanx and then hitting with a fully-charged wave from Moonlight Greatsword will stagger most enemies and some Bosses. This combination is extremely deadly and you should use it as much as possible when facing difficult enemies. Lastly, hitting Bosses with Ranni's Dark Moon will debuff them and can even trigger Frostbite, further reducing the protection they have. Use this first when beginning Boss fights when possible.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Dark Moon Greatsword & Carian Regal Scepter",
      "dlc": "Dark Moon Greatsword & Carian Regal Scepter"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Dark Moon Greatsword & Carian Regal Scepter",
      "offhand": "Academy Glintstone Staff",
      "skill": "Moonlight Greatsword",
      "talismans": [
        "Shard of Alexander",
        "Godfrey Icon",
        "Magic Scorpion Charm",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Heaviest you can wear and still medium roll",
      "spells": [
        "Ranni's Dark Moon",
        "Greatblade Phalanx",
        "Terra Magica",
        "Comet"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Moonlight Crusader",
      "url": "https://eldenring.wiki.fextralife.com/Moonlight_Crusader_Build"
    }
  },
  {
    "id": "fextra-moonveilresurrected",
    "name": "Moonveil Resurrected",
    "stats": "DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Though previously affected by several nerfs, Moonveil's weapon skill, Transient Moonlight, has now regained its potency, making it an excellent choice for dealing massive damage. This build takes advantage of these improvements, shifting away from relying on stance breaks and instead focusing on pure damage output through the weapon skill. The key to this build lies in the use of Transient Moonlight, which fires waves of magic that vary in damage depending on whether the horizontal or vertical slash is used. The horizontal wave offers area-of-effect damage, making it ideal for groups of enemies, while the vertical wave delivers stronger, more focused damage for single targets. In terms of armor, the build features a mix of the Okina Mask, two pieces of the Nox Swordstress Set, and the All-Knowing Gauntlets, reaching 51 Poise with the help of the Bull-Goat's Talisman. While Poise is not essential for the build, it provides added resilience during exploration, preventing stagger from weaker enemies. However, for boss encounters, lighter armor may be preferable to allow for quicker, more agile movement, particularly through light rolling. The Shard of Alexander enhances the damage of Transient Moonlight, while Rellana's Cameo boosts damage by 45% when the weapon skill is charged briefly before release.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 160+",
      "mid": "Published from 160+",
      "late": "Published from 160+",
      "dlc": "Moonveil"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "160+",
      "weapon": "Moonveil",
      "offhand": "No off-hand item required",
      "skill": "Transient Moonlight",
      "talismans": [
        "Rellana's Cameo",
        "Shard of Alexander",
        "Magic Scorpion Charm"
      ],
      "armour": "Okina Mask, Nox Swordstress Armor, All-Knowing Gauntlets, Nox Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Bloodsucking Cracked Tear, Magic-Shrouding Cracked Tear",
      "stats": "Intelligence, Vigor; Mind, Endurance, Dexterity"
    },
    "source": {
      "label": "Fextralife: Moonveil Resurrected",
      "url": "https://eldenring.wiki.fextralife.com/Moonveil_Resurrected_Build"
    }
  },
  {
    "id": "fextra-moonveilsamurai",
    "name": "Moonveil Samurai",
    "stats": "DEX / INT / VIG",
    "role": "Published build",
    "playstyle": "Moonveil is the centre of this level-50 spellblade, with the Academy Glintstone Staff covering situations where drawing the katana is unsafe. Loretta's Greatbow opens on distant priority targets, Glintstone Pebble supplies an efficient mid-range cast, and Carian Greatsword sweeps groups that would punish Moonveil's narrower attacks. At melee range, hold Transient Moonlight only through a confirmed opening: use the quick horizontal follow-up for groups or short recoveries and the vertical heavy follow-up when stance damage matters. After a stance break, take the critical so Assassin's Cerulean Dagger can refund FP, while Carian Filigreed Crest reduces the cost of reaching that break. Intelligence and Vigor lead the level plan, with Dexterity supporting Moonveil after its requirements are met. The build deals heavily concentrated magic damage and spends FP for both spells and skill attacks, so magic-resistant enemies and careless Transient Moonlight spam are its clearest problems.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Moonveil",
      "late": "Moonveil",
      "dlc": "Moonveil"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "ranged-attacks"
    ],
    "startingClass": "Samurai",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Moonveil",
      "offhand": "Academy Glintstone Staff",
      "skill": "Transient Moonlight",
      "talismans": [],
      "armour": "Land of Reeds Set",
      "spells": [
        "Loretta's Greatbow",
        "Glintstone Pebble",
        "Carian Greatsword"
      ],
      "flask": "Slightly more HP than FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence &Vigor; Dexterity"
    },
    "source": {
      "label": "Fextralife: Moonveil Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Moonveil_Samurai_Build"
    }
  },
  {
    "id": "fextra-moonveilshinobi",
    "name": "Moonveil Shinobi",
    "stats": "DEX / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "This level-100 version coordinates Moonveil with a cold Uchigatana and Glintstone Phalanx so several stance and status hits arrive together. Cast the phalanx before entering, close behind its delayed blades, then release Transient Moonlight's heavy follow-up as they connect; the combined impact builds stance damage while the two katanas threaten hemorrhage and frostbite during continued pressure. Take non-boss criticals instead of extending the combo so Assassin's Cerulean Dagger refunds FP, and let Carian Filigreed Crest lower the cost of repeating the setup. Great Glintstone Shard and Loretta's Greatbow cover targets that will not allow melee, while Terra Magica is worthwhile only when a boss will remain inside the field. Intelligence and Vigor are primary, with Dexterity and Mind added after the weapons and casting rhythm are comfortable. The sequence loses efficiency if the phalanx fires before Moonveil is in range, and highly mobile or magic-resistant bosses can deny both the field spell and the synchronised burst.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Moonveil, Uchigatana and any Staff",
      "dlc": "Moonveil, Uchigatana and any Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Moonveil, Uchigatana and any Staff",
      "offhand": "No off-hand item required",
      "skill": "Transient Moonlight & Glinstone Phalanx",
      "talismans": [
        "Carian Filigreed Crest",
        "Assassin's Cerulean Dagger",
        "Magic Scorpion Charm",
        "Green Turtle Talisman"
      ],
      "armour": "Any that can still med roll",
      "spells": [
        "Loretta's Greatbow",
        "Great Glintstone Shard",
        "Terra Magica"
      ],
      "flask": "Slightly more HP than FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence &Vigor; Dexterity & Mind"
    },
    "source": {
      "label": "Fextralife: Moonveil Shinobi",
      "url": "https://eldenring.wiki.fextralife.com/Moonveil_Shinobi_Build"
    }
  },
  {
    "id": "fextra-nebulaknight",
    "name": "Nebula Knight",
    "stats": "DEX / INT / VIG / END",
    "role": "Published build",
    "playstyle": "A Dexterity/Intelligence Build that uses the Wing of Astel to great effect by capitalizing on its weapon skill Nebula. Nebula is really your go to for Boss encounters, and it shoots out star clusters in front of you that explode dealing Magic Damage. You can cast Nebula and then follow up with a Charged R2 for great stagger damage, or just spam Nebula. The Nebula Knight Build uses a combination of Block Counters and the weapon skill of Wing of Astel: Nebula to handle any situation effectively. Because Wing of Astel scales well with both Dexterity and Intelligence, this build does not use a Great Shield, due to low Strength. Carian Knight's Shield is an excellent choice for those using a Shield with no Strength investment. And because Scholar's Shield further increases its mitigations and Guard Boost, it only gets even more effective. Wing of Astel has a unique R2 attack and charged R2 attack that fires 1 or 2 waves of magic forward, depending on whether you charged it or not.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Wing of Astel and any Staff",
      "dlc": "Wing of Astel and any Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Wing of Astel and any Staff",
      "offhand": "Carian Knight's Shield",
      "skill": "Nebula",
      "talismans": [
        "Magic Scorpion Charm",
        "Shard of Alexander",
        "Assassin's Cerulean Dagger",
        "Curved Sword Talisman"
      ],
      "armour": "Scaled Armor Set or any Armor with high Poise",
      "spells": [
        "Scholar's Shield",
        "Terra Magica"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Dexterity; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Nebula Knight",
      "url": "https://eldenring.wiki.fextralife.com/Nebula_Knight_Build"
    }
  },
  {
    "id": "fextra-nightclaw",
    "name": "Nightclaw",
    "stats": "DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The \"Nightclaw\" build is centered around the new DLC weapon, the Claws of Night. This claw weapon stands out as a unique and powerful tool in the player's arsenal. Not only is it a dexterity-scaling weapon, but it also deals both physical and magic damage—an unusual combination that sets it apart from most other weapons in the game. Their ability to deal both physical and magic damage without scaling with other stats like intelligence or arcane makes them particularly intriguing. Malenia's Great Rune can also be effective, providing health regeneration upon taking damage, which synergizes with the build's aggressive playstyle. One of the unique interactions with the Claws of Night is the ability to increase the damage of thrown attacks using the Smithing Talisman. Although the damage from throwing the weapon might not be significant, it adds a strategic layer, especially in fights where maintaining distance is crucial. Another advantage of this weapon is the synergy with the Axe Talisman, which boosts the damage of charged heavy attacks, further increasing the effectiveness of the thrown weapon.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 168",
      "mid": "Published from 168",
      "late": "Published from 168",
      "dlc": "Claws of Night"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "light-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Light attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "168",
      "weapon": "Claws of Night",
      "offhand": "Messmer Soldier Shield",
      "skill": "Scattershot Throw",
      "talismans": [
        "Smithing Talisman",
        "Axe Talisman",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Leda's Armor, Black Knight Helm, Black Knight Gauntlets, Black Knight Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Thorny Cracked Tear, Winged Crystal Tear",
      "stats": "Dexterity, Vigor; Endurance, Mind, Intelligence"
    },
    "source": {
      "label": "Fextralife: Nightclaw",
      "url": "https://eldenring.wiki.fextralife.com/Nightclaw_Build"
    }
  },
  {
    "id": "fextra-nobleswordsman",
    "name": "Noble Swordsman",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Noble Swordsman Build is Dexterity build and an essential \"all-game\" build that players can use throughout the entirety of the game. This build uses a single straight sword, it does not come equipped with any other weapon or shield, and it is phenomenal for stance-breaking and critical attacks. To make this build work, first off, you need to acquire a straight sword, and these weapons are either the Noble's Slender Sword or Lordsworn's Straight Sword weapon. The Noble's Slender Sword is what it is recommended to and is what this build uses since is that it has a longer reach and better points in terms of damage output. A few other notes to highlight is that this build is versatile, you can use \"Grease\" items to coat and buff your weapon with different elements depending on the weakness of the enemy or boss you are fighting. Also, you may want to stack up with the Exalted Flesh which temporarily boosts the Physical Attack. Finally, using Radahn's Great Rune in the opinion works perfectly for this build since it raises the player's maximum HP, FP, and Stamina. * Since the build uses pieces of light armor, the Blue Dancer Charm is great for boosting the damage with it.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Noble's Slender Sword",
      "dlc": "Noble's Slender Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Noble's Slender Sword",
      "offhand": "No off-hand item required",
      "skill": "Square Off",
      "talismans": [
        "Blue Dancer Charm",
        "Shard of Alexander",
        "Warrior Jar Shard",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Aristocrat Hat, Page Garb, Perfumer Gloves, Page Trousers",
      "spells": [],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity, Vigor, Mind; Strength, Endurance"
    },
    "source": {
      "label": "Fextralife: Noble Swordsman",
      "url": "https://eldenring.wiki.fextralife.com/Noble_Swordsman_Build"
    }
  },
  {
    "id": "fextra-paladin",
    "name": "Paladin",
    "stats": "STR / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "This beginner Paladin protects a summon or co-op partner with a one-handed weapon, Brass Shield and Finger Seal rather than trying to draw artificial threat. Cast Golden Vow before a hard pull so the whole group gains attack and defence, summon before entering the arena, then activate Barricade Shield when a boss string would otherwise exhaust stamina. Block the committed hit, answer with a guard counter, and return behind the shield instead of extending into an unsafe combo. Urgent Heal is the quick self-recovery; Heal is slower but can restore nearby allies when the arena is calm. Faith improves healing and support first, Vigor keeps blocked chip or elemental damage survivable, Endurance funds blocks and medium roll, and Strength stops at weapon and shield requirements. Unblockable attacks, elemental chip and empty stamina punish passive turtling, so dodging remains mandatory when the shield is the wrong answer.",
    "complexity": "Published guide",
    "phases": {
      "early": "Any one-handed and a Sacred Seal",
      "mid": "Any one-handed and a Sacred Seal",
      "late": "Any one-handed and a Sacred Seal",
      "dlc": "Any one-handed and a Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "guard-counters"
    ],
    "startingClass": "Confessor",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Any one-handed and a Sacred Seal",
      "offhand": "Brass Shield",
      "skill": "Ash of War: Barricade Shield & Ash of War: Golden Vow",
      "talismans": [],
      "armour": "The heaviest you can wear and still mid-roll",
      "spells": [
        "Urgent Heal",
        "Heal"
      ],
      "flask": "Mostly HP with 1 or 2 FP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Faith & Vigor; Endurance & Strength"
    },
    "source": {
      "label": "Fextralife: Paladin",
      "url": "https://eldenring.wiki.fextralife.com/Paladin_Build"
    }
  },
  {
    "id": "fextra-perfectpaladin",
    "name": "Perfect Paladin",
    "stats": "STR / FAI / VIG / END",
    "role": "Published build",
    "playstyle": "A Strength/Faith Build that focuses on the use of Block Counters and buffs to slash enemies to pieces. Sacred Blade is exceptional since patch 1.07 and using it point blank will both deal damage with the weapon and the holy wave, making it deadly up close. It also buffs your weapon for more damage and for longer, allowing you to get more out of it even after you've used it. Use this periodically to rebuff your weapon and when you need a ranged attack. Flame, Grant Me Strength and Blessing of the Erdtree are really reserved for Boss fights where you need a little extra. It would be a hassle to buff with them both and Golden Vow constantly, not to mention they would be a huge drain on FP, so only use them when you really need them. The way this Build works is that you'll use Golden Vow to buff your defense and damage, and then use your Greatshield to Block enemy attacks, following up with a Block Counter when necessary, staggering enemies and often giving you a free attack if you don't kill them outright.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Levels",
      "mid": "Published from All Levels",
      "late": "Miquellan Knight's Sword & Clawmark Seal",
      "dlc": "Miquellan Knight's Sword & Clawmark Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Levels",
      "weapon": "Miquellan Knight's Sword & Clawmark Seal",
      "offhand": "Haligtree Crest Greatshield",
      "skill": "Sacred Blade",
      "talismans": [
        "Bull-Goat's Talisman",
        "Shard of Alexander",
        "Curved Sword Talisman",
        "Sacred Scorpion Charm"
      ],
      "armour": "Haligtree Knight Set and Greathelm",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Blessing of the Erdtree"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Faith; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Perfect Paladin",
      "url": "https://eldenring.wiki.fextralife.com/Perfect_Paladin_Build"
    }
  },
  {
    "id": "fextra-piercingpaladin",
    "name": "Piercing Paladin",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Leda's Sword primarily deals physical damage, with a bit of holy damage, and scales mostly with dexterity, though it also has some strength and faith scaling. The weapon skill, Needle Piercer, also does a mix of physical and holy damage, with the majority being physical. To maximize damage, you'll want to increase dexterity and bring faith up to 25 to use incantations like Golden Vow and Flame, Grant Me Strength, which significantly enhance the weapon and skill's performance. The Deflecting Hardtear is noteworthy, as it allows for perfect blocking of physical attacks, significantly reducing damage taken and enhancing block counter damage. Leda's Sword features an excellent move set, perfect for chaining attacks and building up attack power through successive hits. Unlike the Dark Paladin build, which focused on block counters, this build emphasizes rapid attacks and timed combinations. Needle Piercer, the weapon skill, benefits from the Spear Talisman, which boosts counter damage during an enemy's attack animation. The skill requires precise positioning due to its range limitations, making it effective in boss fights where enemies keep their distance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 161",
      "mid": "Published from 161",
      "late": "Published from 161",
      "dlc": "Leda's Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "161",
      "weapon": "Leda's Sword",
      "offhand": "Golden Order Seal; Carian Thrusting Shield",
      "skill": "Needle Piercer",
      "talismans": [
        "Two-Headed Turtle Talisman",
        "Millicent's Prosthesis"
      ],
      "armour": "Oathseeker Knight Helm, Leda's Armor, Black Knight Gauntlets, Black Knight Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Deflecting Hardtear, Winged Crystal Tear",
      "stats": "Dexterity, Vigor; Mind, Endurance, Faith"
    },
    "source": {
      "label": "Fextralife: Piercing Paladin",
      "url": "https://eldenring.wiki.fextralife.com/Piercing_Paladin_Build"
    }
  },
  {
    "id": "fextra-pyromancer",
    "name": "Pyromancer",
    "stats": "FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Faith spellcaster Build that only uses Fire Magic to burn enemies to a crisp. Giantsflame Take This is your Boss killer and is useful against tough enemies and tightly packed groups. It's expensive so don't use it all the time, just when you need it. The rest of the time use Flame, Fall Upon Them to deal with regular groups of enemies, since it's more Mana efficient and can AoE very effectively, often killing many enemies at once. You'll use Golden Vow to buff yourself, increasing your spell damage as well as defenses, and you can use Flame, Grant Me Strength for tougher fights and Bosses. Is a Dragon killer, and is very effective against enemies you can get under, or that are very large in size, since each column can hit for very good damage. Flame of the Fell God works well as a setup spell cast before you aggro a tough enemy or at the beginning of a Boss fight when it's closing the distance to you. If you fire off Giantsflame Take Thee immediately after casting this, they will usually detonate together for some serious burst damage.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Erdtree Seal & Giant's Seal",
      "dlc": "Erdtree Seal & Giant's Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Erdtree Seal & Giant's Seal",
      "offhand": "No off-hand item required",
      "skill": "No Skill",
      "talismans": [
        "Godfrey Icon",
        "Fire Scorpion Charm",
        "Ritual Sword Talisman (or Canvas Flock's Talisman)",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Light Armor so you can Light Roll",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Burn, O Flame!",
        "Flame of the Fell God",
        "Flame, Fall Upon Them",
        "Giantsflame Take Thee"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Mind; Vigor"
    },
    "source": {
      "label": "Fextralife: Pyromancer",
      "url": "https://eldenring.wiki.fextralife.com/Pyromancer_Build"
    }
  },
  {
    "id": "fextra-pyromancerperfumer",
    "name": "Pyromancer Perfumer",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "However, it makes such a difference when you dual wield this weapon, this way, your character will attack with both hands and it triggers this cool cross-pattern animation, allowing for more damage. The charged heavy attack is even mind-blowing to use, it will make the character do this twirling move and scatter this delayed AOE attack of flames. And even if it's delayed, you can cast this early, and by the time an enemy approaches you, it detonates, damaging and even making them flinch, allowing for follow-up attacks or even using another charged heavy attack. So try to practice using this, and get comfortable with it, because it's such a great move. The Pyromancer Perfumer build for Elden Ring's Shadow of the Erdtree showcases the new weapon type, Perfume Bottles, and This build uses the Firespark Perfume Bottle. This weapon has DEX scaling and 100% fire damage, which means other equipment or spells that boost the fire attack are best paired with it such as the Fire Scorpion Charm, the Flame, Grant Me Strength spell, and even the Flame-Shrouding Cracked Tear. For skills, consider using Quickstep or Bloodhound's Step. This allows for a nimble playstyle where you can quickly dodge incoming attacks, use it as a defensive maneuver to reposition yourself, and then follow up with charged heavy attacks.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Firespark Perfume Bottle, Golden Order Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Firespark Perfume Bottle, Golden Order Seal",
      "offhand": "No off-hand item required",
      "skill": "Quickstep or Bloodhound's Step",
      "talismans": [
        "Fire Scorpion Charm",
        "Dragoncrest Greatshield Talisman",
        "Perfumer's Talisman",
        "Axe Talisman"
      ],
      "armour": "Perfumer Hood, Perfumer Robe, Perfumer Gloves",
      "spells": [
        "Flame, Grant Me Strength",
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Flame-Shrouding Cracked Tear, Spiked Cracked Tear",
      "stats": "Dexterity, Vigor; Endurance, Mind, Faith"
    },
    "source": {
      "label": "Fextralife: Pyromancer Perfumer",
      "url": "https://eldenring.wiki.fextralife.com/Pyromancer_Perfumer_Build"
    }
  },
  {
    "id": "fextra-redlightning",
    "name": "Red Lightning",
    "stats": "FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "A Faith Build that focuses on the use of Dragon Cult Incantations that deal Lightning Damage. The way this Build works is that you'll only be casting Incantations for your damage, and all of these Spells deal Lightning Damage. You can of course sub in other spells against Lightning Resistant enemies, but Lightning in general is a pretty good damage type. Lightning Strike is your bread and butter spell that can AoE enemies in a line and does fairly good damage. Lansseax's Glaive does like a sweet in front of you of Red Lightning and it deals damage in an AoE behind that. This Spell has hyper armor allowing you to tank through most hits and still get the cast off and is good against large groups of enemies or very fast enemies like the Tree Sentinels, Night's Cavalry and Bloodhound Knights, as their movements are erratic, making it difficult to land more target spells.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Erdtree Seal & Gravel Stone Seal",
      "dlc": "Erdtree Seal & Gravel Stone Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Erdtree Seal & Gravel Stone Seal",
      "offhand": "No off-hand item required",
      "skill": "No Skill",
      "talismans": [
        "Lightning Scorpion Charm",
        "Ritual Sword Talisman",
        "Flock's Canvas Talisman",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any Armor that allows you to medium roll.",
      "spells": [
        "Golden Vow",
        "Lightning Strike",
        "Lightning Spear",
        "Lansseax's Glaive",
        "Frozen Lightning Spear",
        "Ancient Dragons' Lightning Strike"
      ],
      "flask": "Split FP & HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Vigor; Mind"
    },
    "source": {
      "label": "Fextralife: Red Lightning",
      "url": "https://eldenring.wiki.fextralife.com/Red_Lightning_Build"
    }
  },
  {
    "id": "fextra-redrogue",
    "name": "Red Rogue",
    "stats": "DEX / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Red Rogue build for Elden Ring features the Reduvia dagger weapon, it is recommended to if you are starting your journey for the first time or a New Game Plus, choose the Bandit class at it can utilize this weapon from the get-go upon obtaining the weapon, the class will also have met all the stat requirements of the Reduvia Dagger. This is a simple and straightforward build that will work in the Shadow of the Erdtree expansion because of how much Bleed build-up it can apply to the enemies. To boost the damage of this weapon and other factors such as a faster build-up of the Bleed status effect and the effectiveness of the weapon's skill, this build has added tons of points to Arcane, which is a must to work. What makes this weapon unique for this build is its skill, which is the Reduvia Blood Blade. Ideally, you want to have something that provides you with at least 51 Poise so that you can trade hits. On the other hand, the armor pieces that are used for this build, obviously does not meet the 51 Poise requirement noted above, but for it to reach that number, it has Bull-Goat's Talisman equipped to raise Poise by 33%. Other talismans equipped are Shard of Alexander or Warrior Jar Shard to boost the attack power of the weapon's skill, Millicent's Prosthesis for extra Dex, and Lord of Blood's Exultation to raise the attack power for 20 seconds when Hemorrhage triggers which for this build, is the highlight, and will happen all the time.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Reduvia",
      "dlc": "Reduvia"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Bandit",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Reduvia",
      "offhand": "No off-hand item required",
      "skill": "Reduvia Blood Blade",
      "talismans": [
        "Millicent's Prosthesis",
        "Bull-Goat's Talisman",
        "Lord of Blood's Exultation",
        "Shard of Alexander"
      ],
      "armour": "Skeletal Mask, Nox Swordstress Armor, Scaled Gauntlets, Nox Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenspill Crystal Tear, Dexterity-knot Crystal Tear",
      "stats": "Arcane, Vigor, Endurance; Dexterity, Mind"
    },
    "source": {
      "label": "Fextralife: Red Rogue",
      "url": "https://eldenring.wiki.fextralife.com/Red_Rogue_Build"
    }
  },
  {
    "id": "fextra-rimeronin",
    "name": "Rime Ronin",
    "stats": "DEX / INT / VIG",
    "role": "Published build",
    "playstyle": "The second use is by using Cold Bone Arrows to help set the Frostbite Status Effect at range, either after you've stripped it off or leading with it in a fight to get some Frostbite built up before you use Chilling Mist. The way this Build works is that you'll lead off with Chilling Mist, using it to set the Frostbite Status Effect on your target, while simultaneously buffing your Cold Nagakiba with even more Frostbite Build up. Frostbite will allow you to deal more damage to your target, while ripping off 10% of the targets max HP. You can use the Black Bow in 2 ways. First you can use it with Fire Arrows to remove the Frostbite Status Effect so you can reapply it and take another 10% HP of the target. This doesn't always make sense when the target doesn't have much health remaining or it's just easier to have the increased damage buff from Frostbite, so you won't do this all the time. Coat armament in frost, and then slash, spreading frigid mist forwards. The armament retains its frost for a while.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Nagakiba & Black Bow",
      "dlc": "Nagakiba & Black Bow"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Nagakiba & Black Bow",
      "offhand": "No off-hand item required",
      "skill": "Chilling Mist",
      "talismans": [
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Bull-Goat's Talisman",
        "Shard of Alexander"
      ],
      "armour": "Zamor Set or any that allows you to medium roll",
      "spells": [],
      "flask": "Mostly HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Intelligence; Vigor"
    },
    "source": {
      "label": "Fextralife: Rime Ronin",
      "url": "https://eldenring.wiki.fextralife.com/Rime_Ronin_Build"
    }
  },
  {
    "id": "fextra-royalknight",
    "name": "Royal Knight",
    "stats": "STR / INT / VIG / END",
    "role": "Published build",
    "playstyle": "Wolf's Assault does devastating damage if you can land the first hit, and the AoE will often one shot groups of enemies, and both of these hits build up Frostbite, though the normal weapon attacks of the Royal Greatsword do not. You can swap to the Clayman's Harpoon, using the Cold version for better Strength scaling, and to help set the Frostbite status effect more easily. You'll use Ice Spear with it to range enemies when needed, using to Stance Break enemies by filling their stagger meter now and then. The way this Build works is that you'll swap between using the Royal Greatsword and Clayman's Harpoon depending on the circumstances, while Blocking with your Eclipse Greatshield and using Guard Counters for massive damage and Critical Attacks. You can buff with Scholar's Shield if you want to equip a staff, which further boosts the Guard Boost and damage negation of your Shield, making you damn near invincible while Blocking. Keep in mind you can use Clayman's Harpoon to Block and attack at the same time, so it's a good strategy against enemies you are having a hard time with.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Royal Greatsword & Clayman's Harpoon",
      "dlc": "Royal Greatsword & Clayman's Harpoon"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Royal Greatsword & Clayman's Harpoon",
      "offhand": "Eclipse Greatshield; Academy Glintstone Staff",
      "skill": "Wolf's Assault & Ice Spear",
      "talismans": [
        "Shard of Alexander",
        "Radagon's Soreseal",
        "Great-Jar's Arsenal",
        "Carian Filigreed Crest"
      ],
      "armour": "Haima Glintstone Crown & any that still allows you to medium roll",
      "spells": [
        "Scholar's Shield (optional)"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Intelligence; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Royal Knight",
      "url": "https://eldenring.wiki.fextralife.com/Royal_Knight_Build"
    }
  },
  {
    "id": "fextra-samurai",
    "name": "Samurai",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The beginner Samurai controls the first engagement with the Longbow, then finishes at katana range with Uchigatana rather than forcing one weapon into every situation. Mighty Shot is for an unaware target or a long boss recovery; ordinary arrows conserve FP while thinning a camp before it can surround you. When an enemy closes, hold Unsheathe only long enough to read the opening: use the fast horizontal follow-up for a short punish or crowd coverage, and the stronger vertical follow-up when there is time to build stance damage. Roll away and re-enter with Unsheathe instead of mashing the full katana light chain into retaliation. Dexterity raises both weapons, Vigor is the first safety investment, Endurance supports repeated bow and katana actions, and Mind only needs to cover deliberate skill use. The route has no spell buffs or heavy shield, so armour, ammunition discipline and clean dodge timing carry fights that resist bleed.",
    "complexity": "Published guide",
    "phases": {
      "early": "Uchigatana and Longbow",
      "mid": "Uchigatana and Longbow",
      "late": "Uchigatana and Longbow",
      "dlc": "Uchigatana and Longbow"
    },
    "tags": [
      "fextralife",
      "pve",
      "early",
      "ranged-attacks"
    ],
    "startingClass": "Samurai",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "early",
    "publishedLoadout": {
      "level": "Beginner",
      "weapon": "Uchigatana and Longbow",
      "offhand": "No off-hand item required",
      "skill": "Ash of War: Unsheathe & Ash of War: Mighty Shot",
      "talismans": [],
      "armour": "Land of Reeds Set",
      "spells": [],
      "flask": "Mostly HP and 1 or 2 FP; Physick: Opaline Bubbletear, Crimsonburst Crystal Tear",
      "stats": "Dexterity & Vigor; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Samurai_Build"
    }
  },
  {
    "id": "fextra-samuraisniper",
    "name": "Samurai Sniper",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Albinauric Bow is the bow weapon this build uses because out of all the bows, the Albinauric Bow scales best in Dexterity, which is something that is best paired with Lightning Arrows to deal significant damage. The Samurai Sniper build utilizes the Albinauric Bow and the Lightning Nagakiba weapon, and this build is something anyone can try and use for exploration purposes, especially, when you start your journey in Shadow of the Erdtree. The ash of war or skill that is used on this build is Lightning Slash, a skill that calls down a bolt of lightning into the weapon and creates an explosive shock upon swinging the weapon. After a period of time, the lightning effect will remain on the weapon, allowing the player to deal lightning damage. This build also has the Erdtree Seal so that it allows you to cast Golden Vow and acquire that buff to attack and defense. For what it's worth, this build uses these pieces for fashion and to fit the samurai theme, but essentially, it's enough Poise value for the character to take a hit since you will be trading attacks when you're in combat. On the other hand, if you are mid-maxing this build, you would go for other armor pieces that have that 51 Poise. For talismans, the Arrow's Sting Talisman is a must-have for this build because it raises the attack power of the arrows used by the bow weapon, Ritual Sword Talisman to amplify the damage when your HP is at max.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Albinauric Bow, Nagakiba, Erdtree Seal",
      "dlc": "Albinauric Bow, Nagakiba, Erdtree Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Albinauric Bow, Nagakiba, Erdtree Seal",
      "offhand": "No off-hand item required",
      "skill": "Lightning Slash, Mighty Shot",
      "talismans": [
        "Arrow's Sting Talisman",
        "Ritual Sword Talisman",
        "Shard of Alexander",
        "Warrior Jar Shard"
      ],
      "armour": "Okina Mask, Ronin's Armor, Redmane Knight Gauntlets, Ronin's Greaves",
      "spells": [
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Dexterity-knot Crystal Tear",
      "stats": "Dexterity, Vigor; Mind, Endurance, Faith"
    },
    "source": {
      "label": "Fextralife: Samurai Sniper",
      "url": "https://eldenring.wiki.fextralife.com/Samurai_Sniper_Build"
    }
  },
  {
    "id": "fextra-sanguinesamurai",
    "name": "Sanguine Samurai",
    "stats": "DEX / ARC / VIG / MND",
    "role": "Published build",
    "playstyle": "You'll use Rivers of Blood as your \"default\" attack, because this build raises the cost of it via Carian Filigreed Crest, and give you FP back with Sacrificial Axe. This combined with 30 or so Mind allows you to pretty much use it at will, as long as you have a few FP flasks. If you manage to acquire Millicent's Prosthesis and Rotten Sword Insignia you can actually use both, but you will need someone to drop you one or the other. The way this Build works is that you will carry Rivers of Blood in your right hand, and use Sacrificial Axe and Dragon Communion Seal in your left. Sacrificial Axe will give you 4 FP, even when you don't meet the requirements for it, every time you kill an enemy as long as it's in your left hand. You can buff with Flame, Grant Me Strength when you're heading into a Boss fight or a difficult enemy because Rivers of Blood does both Physical and Fire Damage, benefitting immensely from this Incantation. You can add others as well since you'll have fairly good Incantation Scaling thanks to the Dragon Communion Seal and high Arcane, but these are optional. Corpse Piler (17 FP, Unique Weapon).",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Rivers of Blood, Sacrificial Axe, and Dragon Communion Seal",
      "dlc": "Rivers of Blood, Sacrificial Axe, and Dragon Communion Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Rivers of Blood, Sacrificial Axe, and Dragon Communion Seal",
      "offhand": "No off-hand item required",
      "skill": "Corpse Piler",
      "talismans": [
        "Lord of Blood's Exultation",
        "Rotten Winged Sword Insignia",
        "Carian Filigreed Crest",
        "Shard of Alexander"
      ],
      "armour": "White Mask or Okina Mask, and any armor that allows you to med roll",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Dexterity; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Sanguine Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Sanguine_Samurai_Build"
    }
  },
  {
    "id": "fextra-sanguinespellblade",
    "name": "Sanguine Spellblade",
    "stats": "INT / FAI / ARC / VIG",
    "role": "Published build",
    "playstyle": "An Arcane/Intelligence Build that focuses on the use of Thorn Sorceries to make enemies bleed at range. The way this Build works is that you'll use Seppuku on your Rapier to add to its Bleed Infused Build Up, and also trigger Lord of Blood's Exultation on yourself. This will boost your sorcery damage, so that you can one shot most enemies with Briars of Punishment. You can buff also with Golden Vow if you need more damage, and you can use Blessing of the Erdtree if you find you are taking too much damage from your own spells, though Taker's Cameo should offset this in most cases. Be sure to use Terra Magica when starting boss fights for increased damage, and use Roger's Rapier to melee enemies that get close to you re-triggering Lord of Blood's Exultation. Increases attack power and improves ability to inflict blood loss.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Albinauric Staff, Dragon Communion Seal, Staff of the Guilty & Rogier's Rapier",
      "dlc": "Albinauric Staff, Dragon Communion Seal, Staff of the Guilty & Rogier's Rapier"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Albinauric Staff, Dragon Communion Seal, Staff of the Guilty & Rogier's Rapier",
      "offhand": "No off-hand item required",
      "skill": "Seppuku",
      "talismans": [
        "Graven-Mass Talisman",
        "Magic Scorpion Charm",
        "Lord of Blood's Exultation",
        "Taker's Cameo"
      ],
      "armour": "Alberich's Set (for extra Thorn Sorcery damage)",
      "spells": [
        "Golden Vow",
        "Blessing of the Erdtree",
        "Terra Magica",
        "Unseen Form",
        "Briars of Punishment",
        "Briars of Sin"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane & Vigor; Intelligence & Faith"
    },
    "source": {
      "label": "Fextralife: Sanguine Spellblade",
      "url": "https://eldenring.wiki.fextralife.com/Sanguine_Spellblade_Build"
    }
  },
  {
    "id": "fextra-savageslasher",
    "name": "Savage Slasher",
    "stats": "ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "What's great about this weapon is it has a hybrid set of moves of a curved sword and katana that has better poise damage and reach when you're using certain movements such as a jump attack or a running-dash attack. The default skill of this weapon is Overhead Stance, a move that allows the character to switch their posture into this samurai pose, bringing the weapon over their head. And by pressing the R2 button executes a triple slash, while R1 will make the character attack with a single forward slash. On the other hand, you can use Savage Lion's Claw which has better utility and versatility when it comes to dealing more damage, stance damage, and is quite effective against elite enemies and bosses. Unfortunately, the set itself does not have the recommended number of Poise, however, you can still make it work by pairing a specific talisman to this build. Regardless, for this build to work so that you don't get interrupted when you're attacking with the Great Katana is that you must have armor pieces or an armor set that can provide you with the recommended Poise of 51. For talismans, this build has Shard of Alexander to boost the damage of Savage Lion's Claw or Overhead Stance. Rotten Winged Sword Insignia is perfect for this build to get that increase of damage with successive attacks coming from Savage Lion's Claw or Overhead Stance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Great Katana"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Great Katana",
      "offhand": "No off-hand item required",
      "skill": "Savage Lion's Claw, Overhead Stance",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Dragoncrest Greatshield Talisman",
        "Bull-Goat's Talisman",
        "Shard of Alexander"
      ],
      "armour": "Oathseeker Knight Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Thorny Cracked Tear",
      "stats": "Arcane, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Savage Slasher",
      "url": "https://eldenring.wiki.fextralife.com/Savage_Slasher_Build"
    }
  },
  {
    "id": "fextra-scarletspear",
    "name": "Scarlet Spear",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Dexterity Build that focuses on the use of dual spears and the Scarlet Rot and Poison status effects. The way this Build works is that you'll use dual wield two Rotten Crystal Spears to not only apply Scarlet Rot, but also build up your Attack Power quickly via very fast L1 attacks thanks to the Winged Sword Insignia and Millicent's Prosthesis. Dual Spear attacks are some of the fastest in Elden Ring, and they attack faster than many R1 attacks of other weapons. Additionally, Spears deal Thrust Damage which deals increased damage to enemies in the forward motion of their attack (called Counter Damage). This allows you to shell out some incredible damage when your Attack Power is buffed if you can trade blows with Bosses, particularly because this build has Spear Talisman slotted which further increases this damage. Coil Shield can trigger Deadly Poison (a stronger form of Poison) on Bosses easily with one use, or two at most, triggering your Kindred of Rot's Exultation at the beginning of the fight, allowing you to have buffed Attack Power from the very beginning all while the Boss takes damage over time. Charge Forth (16 FP, Ash of War, chargeable). Quickly charge forward with the armament at the hip, carrying the momentum into a thrust.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Rotten Crystal Spear x2",
      "dlc": "Rotten Crystal Spear x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Rotten Crystal Spear x2",
      "offhand": "Coil Shield",
      "skill": "Charge Forth & Viper Bite",
      "talismans": [
        "Kindred of Rot's Exultation",
        "Winged Sword Insignia",
        "Millicent's Prosthesis",
        "Spear Talisman"
      ],
      "armour": "Redmane Knight Set or any armor with high protection and 51+ Poise",
      "spells": [],
      "flask": "All HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Scarlet Spear",
      "url": "https://eldenring.wiki.fextralife.com/Scarlet_Spear_Build"
    }
  },
  {
    "id": "fextra-scorchingslayer",
    "name": "Scorching Slayer",
    "stats": "STR / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A melee focused build that uses Flames of the Redmanes to stagger enemies and bring them to their knees. The way this Build works is that you'll buff with Bloodflame Blade to increase your damage and to help set Hemorrhage on enemies. Despite the fact this weapon has no native Bleed Buildup, it can still do so somewhat effectively due to the speed at which it attacks. Additionally, when Flames of the Redmanes is cast while Bloodflame Blade is active, you will also apply this to enemies as well. Cast Flames of the Redmanes often to stagger enemies and move in for Critical Hits in order to regain FP via Assassin's Cerulean Dagger. Once Bosses go down you can spam R1 attacks to proc Hemorrhage, and to deal massive damage. Flame, Grant Me Strength should be reserved for Boss fights and tough enemies.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Gargoyle's Twinblade & any Sacred Seal",
      "dlc": "Gargoyle's Twinblade & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Gargoyle's Twinblade & any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "Flame of the Redmanes",
      "talismans": [
        "Winged Sword Insignia",
        "Assassin's Cerulean Dagger",
        "Fire Scorpion Charm",
        "Green Turtle Talisman"
      ],
      "armour": "Any that can still med roll",
      "spells": [
        "Bloodflame Blade",
        "Flame, Grant Me Strength",
        "Electrify Armament"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Vigor; Mind & Endurance"
    },
    "source": {
      "label": "Fextralife: Scorching Slayer",
      "url": "https://eldenring.wiki.fextralife.com/Scorching_Slayer_Build"
    }
  },
  {
    "id": "fextra-serpentsamurai",
    "name": "Serpent Samurai",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Dexterity Build that uses poison to great effect using the Serpentbone Blade and the Uchigatana. The way this Build works is that you'll be dual wielding the Serpentbone Blade and Uchigatana (or Wakizashi) most of the time, using L1 for dual wield combos when you want, or L2 for Double Slash if you need it. The idea is to set the Poison Status effect using a Poison infused Uchigatana and Serpentbone Blade to boost Attack Power, as well as striking repeatedly to boost Attack Power, to crank out high damage per strike. It works well to single hand the Serpentbone Blade when facing difficult enemies that don't stagger easily in order to use the Charged R2 attacks, which usually stagger them in two uses, often finishing them off quickly. Because you have high Poise, you can often swing through at least one attack from them. Perform a crossing slash attack from a low stance. Poison Moth Flight (7 FP, Ash of War). Slash with a poison-infused blade.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Serpentbone Blade & Uchigatana (or Wakizashi)",
      "dlc": "Serpentbone Blade & Uchigatana (or Wakizashi)"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "critical-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Critical attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Serpentbone Blade & Uchigatana (or Wakizashi)",
      "offhand": "No off-hand item required",
      "skill": "Double Slash, Poison Moth Flight & Parry",
      "talismans": [
        "Kindred of Rot's Exultation",
        "Millicent's Prosthesis",
        "Winged Sword Insignia",
        "Shard of Alexander"
      ],
      "armour": "Mushroom Crown & any high Poise Armor",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Serpent Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Serpent_Samurai_Build"
    }
  },
  {
    "id": "fextra-shadowsunflowerblossom",
    "name": "Shadow Sunflower Blossom",
    "stats": "STR / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build that utilizes the Shadow Sunflower Blossom to deal heavy damage against enemies and bosses. The Sunflower Smasher build in Elden Ring focuses on using the Shadow Sunflower Blossom, a colossal hammer obtained by defeating the Scadu Tree Avatar and exchanging its remembrance at the Roundtable Hold. This colossal weapon excels at stance damage, making it ideal for breaking enemy poise. The Shadow Sunflower Blossom deals a mix of physical and holy damage, with scaling in both strength and faith. The Holy-Shrouding Cracked Tear is used to boost holy damage, while the Stonebarb Cracked Tear helps with stance breaking in boss fights. Several Great Runes are viable, including Radahn's Great Rune for FP, stamina, and health boosts, Malenia's Great Rune for health regeneration when trading damage, or Morgott's Great Rune for increased health. Shadow Sunflower Headbutt is a multi-hit weapon skill that deals both physical and holy damage. Subsequent uses of the skill can chain into additional hits for a total of four strikes.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 160+",
      "mid": "Published from 160+",
      "late": "Published from 160+",
      "dlc": "Shadow Sunflower Blossom"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "160+",
      "weapon": "Shadow Sunflower Blossom",
      "offhand": "Clawmark Seal,",
      "skill": "Shadow Sunflower Headbutt",
      "talismans": [
        "Two-Handed Sword Talisman",
        "Shard of Alexander",
        "Two-Headed Turtle Talisman",
        "Blade of Mercy"
      ],
      "armour": "Pumpkin Helm, Raptor's Black Feathers, Radahn's Gauntlets, Radahn's Greaves",
      "spells": [
        "Elden Stars",
        "Flame, Grant Me Strength",
        "Golden Vow"
      ],
      "flask": "Equal Charges; Physick: Holy-Shrouding Cracked Tear, Stonebarb Cracked Tear",
      "stats": "Vigor, Strength, Faith; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Shadow Sunflower Blossom",
      "url": "https://eldenring.wiki.fextralife.com/Shadow_Sunflower_Blossom_Build"
    }
  },
  {
    "id": "fextra-shadowblade",
    "name": "Shadowblade",
    "stats": "DEX / ARC / VIG / MND / END",
    "role": "Published build",
    "playstyle": "In the Shadow of the Erdtree DLC, the Shadow Blade build focuses on using the Smithscript Dagger, a unique throwing blade that allows for ranged attacks with every strike, whether it's a running attack, jumping attack, or heavy attack. Despite its long-range capability, the Smithscript Dagger has lower damage output, requiring multiple attacks to deal significant damage. Players will find that, although the weapon provides range, enemies often close the distance quickly, making it essential to learn how to maintain effective spacing during combat. When riding, players can unleash a barrage of throws, dealing substantial damage from a safe distance. Dexterity with Piercing Throw is ideal for exploration and dealing with elite enemies, while the blood setup with Scattershot Throw excels in situations requiring rapid bleed buildup. Dual-wielding the Smithscript Dagger enhances attack speed and damage, making it essential to maximize the weapon's potential. Light armor is favored to maintain agility and maximize rolling distance, crucial for avoiding damage. Players aiming to use the Blue Dancer Charm for increased physical damage should keep their total equip load below 16 to maximize its effectiveness.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Smithscript Dagger"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Arcane Builds",
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Smithscript Dagger",
      "offhand": "Sacrificial Axe",
      "skill": "Scattershot Throw, Piercing Throw",
      "talismans": [
        "Shard of Alexander",
        "Smithing Talisman",
        "Lord of Blood's Exultation",
        "Crusade Insignia"
      ],
      "armour": "Shadow Militiaman Set",
      "spells": [],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Arcane, Dexterity, Vigor; Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Shadowblade",
      "url": "https://eldenring.wiki.fextralife.com/Shadowblade_Build"
    }
  },
  {
    "id": "fextra-silentspearcaller",
    "name": "Silent Spearcaller",
    "stats": "INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A stealth melee build that uses the Death Ritual Spear to range down targets or stab them to death up close. This typically allows you another backstab, if you did one already, or to kill them using one of the afore mentioned Spells or abilities. The way this Build works is that you'll buff yourself with Unseen Form, making you hard to see vs enemies. You can then cast Night Shard, Night Comet or simply use Spearcall Ritual or backstab if you can get close enough. During Boss fights you won't be able to hide, so you'll need to drop Terra Magica and try to spam Spearcall Ritual as much as possible, or case Night Comet if more prudent. Either of these should allow you to range down targets before they get to close, but if they do, smack them with your Spear!",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Death Ritual Spear, Carian Regal Scepter & Staff of Loss",
      "dlc": "Death Ritual Spear, Carian Regal Scepter & Staff of Loss"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Death Ritual Spear, Carian Regal Scepter & Staff of Loss",
      "offhand": "No off-hand item required",
      "skill": "Spearcall Ritual",
      "talismans": [
        "Shard of Alexander",
        "Ritual Sword Talisman",
        "Magic Scorpion Charm",
        "Bull-Goat's Talisman"
      ],
      "armour": "Black Knife Set (so your footsteps are muffled)",
      "spells": [
        "Unseen Form",
        "Night Comet",
        "Night Shard",
        "Terra Magica"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Vigor; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Silent Spearcaller",
      "url": "https://eldenring.wiki.fextralife.com/Silent_Spearcaller_Build"
    }
  },
  {
    "id": "fextra-slumberingswordstress",
    "name": "Slumbering Swordstress",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Quality (Strength/Dexterity) Build that uses Sleep to dispatch enemies very quickly. The way this Build works is that you'll use two Sword of St. Trina to dual wield attack enemies and set them asleep quickly while fighting them. Dual Wield attacks hit more rapidly than single attacks, allowing you to build up enemy Sleep bars much more quickly. You can use Mists of Slumber to begin the fight, often putting enemies to sleep quickly, but if not your right hand weapon will be buffed with more Sleep build up. This will allow you to put the enemy to sleep more easily with follow up attacks. This mist inflicts the sleep ailment upon foes. The weapons in this build apply Sleep 66.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Sword of St. Trina x2",
      "dlc": "Sword of St. Trina x2"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Sword of St. Trina x2",
      "offhand": "No off-hand item required",
      "skill": "Mists of Slumber",
      "talismans": [
        "Ancestral Spirit's Horn",
        "Great-Jar's Arsenal",
        "Winged Sword Insignia",
        "Rotten Winged Sword Insignia"
      ],
      "armour": "Any light armor that allows you to light roll",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Strength; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Slumbering Swordstress",
      "url": "https://eldenring.wiki.fextralife.com/Slumbering_Swordstress_Build"
    }
  },
  {
    "id": "fextra-sorcerer",
    "name": "Sorcerer",
    "stats": "DEX / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "This legacy pure-caster route uses the Meteorite Staff and a compact spell bar built around range and FP efficiency. Glintstone Pebble is the default single-target cast, Glintstone Arc cuts through aligned groups, Great Glintstone Shard spends more FP for a stronger punish, and Loretta's Greatbow opens from extreme distance. Rock Sling deals physical damage and heavy stance pressure when magic resistance or a boss matchup makes glintstone inefficient; cast it with enough room for all three rocks to clear nearby walls. Carry a 100% physical shield only as an emergency block, then disengage instead of trying to trade like a spellblade. Intelligence is the damage priority, Mind determines how long the rotation lasts, and Vigor prevents a failed cast from becoming a one-shot. Determination remains listed by the historical source, but current rules do not let it increase sorcery damage, so it must not be treated as part of the buff sequence.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Meteorite Staff",
      "dlc": "Meteorite Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "ranged-attacks"
    ],
    "startingClass": "Astrologer",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Meteorite Staff",
      "offhand": "Any 100% Physical Block",
      "skill": "Determination",
      "talismans": [],
      "armour": "Queen's Crescent Crown & the heaviest Armor you can wear and still med roll",
      "spells": [
        "Glintstone Pebble",
        "Glintstone Arc",
        "Great Glintstone Shard",
        "Loretta's Greatbow",
        "Rock Sling"
      ],
      "flask": "Mostly FP some HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Mind; Vigor & Dexterity"
    },
    "source": {
      "label": "Fextralife: Sorcerer",
      "url": "https://eldenring.wiki.fextralife.com/Sorcerer_Build"
    }
  },
  {
    "id": "fextra-sorcerysentinel",
    "name": "Sorcery Sentinel",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "Watchdog's Staff gives this Strength/Dexterity bruiser two separate answers without requiring Intelligence: colossal jump and normal attacks deal strike damage up close, while Sorcery of the Crozier releases homing magic projectiles when a target refuses melee. Begin difficult fights with Golden Vow and Flame, Grant Me Strength from the seal, use a jump attack to start stance pressure, then continue only while the enemy remains in recovery; take the critical instead of spending stamina on another swing after the break. Ritual Sword and Magic Scorpion reward staying untouched before the ranged cast, Claw Talisman strengthens the jump opener, and Green Turtle restores the stamina the heavy weapon consumes. The projectile is a spacing tool rather than permission to spam, because its FP cost competes with the two buffs. Keep medium load and enough Vigor to survive a trade, but do not mistake the staff's range for a conventional sorcery build.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Watchdog's Staff & any Sacred Seal",
      "dlc": "Watchdog's Staff & any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Watchdog's Staff & any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "Sorcery of the Crozier",
      "talismans": [
        "Ritual Sword Talisman",
        "Magic Scorpion Charm",
        "Green Turtle Talisman",
        "Claw Talisman"
      ],
      "armour": "Any that still allows you to medium roll",
      "spells": [
        "Flame, Grant Me Strength",
        "Golden Vow"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Sorcery Sentinel",
      "url": "https://eldenring.wiki.fextralife.com/Sorcery_Sentinel_Build"
    }
  },
  {
    "id": "fextra-soulsamurai",
    "name": "Soul Samurai",
    "stats": "DEX / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "The way this Build works is that you'll use Unseen Form and the Black Knife Set to sneak up on enemies getting easy backstabs and attacks. You can use Greatblade Phalanx when you know enemies are going to come at you, and cast Freezing Mist on tough enemies and Bosses to soften up their defenses via the Frostbite status effect. Loretta's Greatbow is useful for situations where you need some long range or things will be markedly more difficult, and you can use Carian Retaliation to parry projectiles, which is great. Cast Founding Rain of Stars at the beginning of Boss fights when they start to come at you, and try to fight around the AoE it creates for best results. Try to dodge and use Double Slash while they are still in the AoE of FRoS. Scholar's Armament is your buff to really boost your damage over the top of a magic infused or cold infused Nagakiba. By keeping it Keen and using Scholar's Armament you will have higher damage potential as long as it remanis buffed. Perform a crossing slash attack from a low stance.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Nagakiba & Academy Glintstone Staff",
      "dlc": "Nagakiba & Academy Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Nagakiba & Academy Glintstone Staff",
      "offhand": "Finger Seal",
      "skill": "Double Slash",
      "talismans": [
        "Dragoncrest Greatshield Talisman",
        "Shard of Alexander",
        "Magic Scorpion Charm",
        "Millicent's Prosthesis"
      ],
      "armour": "Black Knife Set",
      "spells": [
        "Greatblade Phalanx",
        "Founding Rain of Stars",
        "Unseen Form",
        "Loretta's Greatbow",
        "Carian Retaliation",
        "Scholar's Armament",
        "Terra Magica",
        "Freezing Mist"
      ],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Dexterity; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Soul Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Soul_Samurai_Build"
    }
  },
  {
    "id": "fextra-spellblade",
    "name": "Spellblade",
    "stats": "DEX / INT / VIG / MND",
    "role": "Published build",
    "playstyle": "A melee-focused Mage Build that uses magic to enhance and deal damage up close to enemies. The way this Build works is that you'll buff your Rapier or Estoc with Scholar's Armament to double your melee damage or so early on, allowing you to one or two shot most enemies. Make sure that you have both your Staff and Weapon out at the same time or you won't be able to buff it. You can use Glintstone Pebble to thin enemies when their are many to prevent yourself from being swarmed, and also to hit enemies that you can't get to physically. You'll spam this repeatedly when you get openings to melt Boss HP. Just know that you deal almost no Stagger with this Spell so you will have to read enemy ques and dodge when they begin to retaliate. You can use a Shield in some scenarios where Blocking is beneficial, but it rarely is since it drains your Stamina when Blocking and you need it to attack rapidly with Carian Slicer.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Demi-Human Queen's Staff and Estoc",
      "dlc": "Demi-Human Queen's Staff and Estoc"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Prisoner",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Demi-Human Queen's Staff and Estoc",
      "offhand": "Any 100% Physical (optional)",
      "skill": "Ash of War: Impaling Thrust",
      "talismans": [],
      "armour": "Any, but get pieces that increase Intelligence when possible",
      "spells": [
        "Scholar's Armament",
        "Glintstone Pebble",
        "Carian Slicer"
      ],
      "flask": "Split evenly between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Vigor; Dexterity & Mind"
    },
    "source": {
      "label": "Fextralife: Spellblade",
      "url": "https://eldenring.wiki.fextralife.com/Spellblade_Build"
    }
  },
  {
    "id": "fextra-spellsword",
    "name": "Spellsword",
    "stats": "STR / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Primarily scales with strength and intelligence and heavily relies on periodic stance-breaking and critical hits. On the other hand, since this build involves Academy Glintstone Staff and having 50 intelligence, you do have options to add more spells but consider keeping it to a minimum so you can maximize the original build setup of the Spellblade. Spellblade build is an aggressive build that relies on a Claymore to deal major damage to its enemy. Glintblade Phalanx on the other hand is a great addition to the Spellblade's repertoire as it further enhances the stance-breaking capabilities of the build. The way how this build behaves is you will constantly use the R2 charge attacks of your Claymore buffed with Scholar Armament. With Claymore's incredibly long reach and powerful thrust attack, fights with regular enemies or even boss fights can be trivialized due to the Spellblade's immense stance damage. On top of that, Glintblade Phalanx adds more value to this build by providing bonus range damage and a unique follow-up thrust attack that can be done in a quick manner. However, the main takeaway is the additional stance damage that it can provide thus it will work wonders with Claymore.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Claymore x1, Academy Glintstone Staff",
      "dlc": "Claymore x1, Academy Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Claymore x1, Academy Glintstone Staff",
      "offhand": "No off-hand item required",
      "skill": "Glintblade Phalanx",
      "talismans": [
        "Axe Talisman",
        "Shard of Alexander",
        "Assassin's Cerulean Dagger",
        "Spear Talisman"
      ],
      "armour": "Carian Knight Helm, Blue Silver Mail Armor, Black Knife Gauntlets, Black Knife Greaves, or any armor with high protection and 51+ Poise",
      "spells": [
        "Scholar's Armament"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Vigor, Strength & Intelligence; Endurance & Mind"
    },
    "source": {
      "label": "Fextralife: Spellsword",
      "url": "https://eldenring.wiki.fextralife.com/Spellsword_Build"
    }
  },
  {
    "id": "fextra-spellthief",
    "name": "Spellthief",
    "stats": "DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Spellthief build features the Glintstone Kris dagger, although the weapon itself doesn't feature anything major, however, it has a 110 Critical Rating which is average for a dagger weapon, it has decent damage, it's a light weapon, and comes with a unique weapon skill, the Glintstone Dart that works similarly to a sorcery spell, Glintstone Pebble. The difference with Glintstone Dart is after casting the dart, you can follow up with a thrusting attack which is completely optional. What's great about this is you can poke enemies from afar, potentially spamming the dart, but in some cases, if an enemy tries to close in, you can immediately use the thrusting attack for that advantage. Another difference between the Glintstone Dart and the Glintstone Pebble is the weapon skill, Glintstone Dart, costs more FP but deals more damage. The build comes with a shield and this build uses the Carian Knight's Shield, not only does it fit the theme but it's something it is recommended to since the build has high Intelligence. It is entirely optional, but you can have the shield with no skill so that it is easier to manage the Glintstone Kris, and block attacks when needed, however, consider having the Carian Retaliation skill to parry attacks. And what Carian Retaliation offers is it makes parrying easy because of its great iframes, if done correctly, you can parry an enemy, and follow up with a critical attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Glintstone Kris",
      "dlc": "Glintstone Kris"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Glintstone Kris",
      "offhand": "Carian Knight's Shield",
      "skill": "Glintstone Dart, Carian Retaliation",
      "talismans": [
        "Magic Scorpion Charm",
        "Ritual Sword Talisman",
        "Godfrey Icon",
        "Shard of Alexander"
      ],
      "armour": "Spellblade's Pointed Hat, Black Knife Armor, Spellblade's Gloves, Spellblade's Trousers",
      "spells": [],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Intelligence-knot Crystal Tear",
      "stats": "Dexterity, Intelligence, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Spellthief",
      "url": "https://eldenring.wiki.fextralife.com/Spellthief_Build"
    }
  },
  {
    "id": "fextra-starlinedsamurai",
    "name": "Star-Lined Samurai",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "One of the features of the Star-Lined Sword's weapon skill, Onze's Line of Stars, is its effectiveness in cleaving through multiple enemies. This skill provides longer reach than the sword itself, allowing you to strike targets that would normally be out of range. Mastering this weapon involves learning to judge when to use a single press of L2 for that extended reach and when to rely on regular attacks. Unlike many weapon skills that lock you into a full combo once initiated, this skill allows for partial execution. The Star-Lined Sword stands out due to its dual damage type, dealing both physical and magic damage. Approximately two-thirds of its damage output is physical, with the remaining one-third being magic. The weapon scales with strength, dexterity, and intelligence, though it notably favors dexterity over the other attributes. The lack of strength benefits makes it more practical to wield this katana one-handed while equipping a shield in the off-hand.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 151",
      "mid": "Published from 151",
      "late": "Published from 151",
      "dlc": "Star-Lined Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "151",
      "weapon": "Star-Lined Sword",
      "offhand": "Wolf Crest Shield",
      "skill": "Onze's Line of Stars",
      "talismans": [
        "Bull-Goat's Talisman",
        "Shard of Alexander",
        "Two-Headed Turtle Talisman"
      ],
      "armour": "Iron Kasa, Tree Surcoat, White Reed Gauntlets, White Reed Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Deflecting Hardtear",
      "stats": "Dexterity, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Star-Lined Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Star-Lined_Samurai_Build"
    }
  },
  {
    "id": "fextra-level75sanguinelightningassassin",
    "name": "Level 75 Sanguine Lightning Assassin",
    "stats": "STR / DEX / END",
    "role": "Published PvP build",
    "playstyle": "Medium level invasion build with emphasis on high damage output from stealth. Designed to combat multiple Furled Finger/Hunter enemies by taking out the host in a single, powerful attack. Be prepared to use the Flask of Wondrous Physick. A lot of hosts in this level range will go down in a single hit, however if they have either obtained or been given higher level gear, you will need to buff with the FoWP. If they have any Great Runes equipped, a gold circle icon will appear next to their health bar, ALWAYS assume it's Godrick's Great Rune and use the FoWP to get the increase in damage, you will need it. The previously mentioned talismans will make weapon abilities incredibly powerful. If they are, break away and use a Phantom Bloody Finger to reposition and find a safe place to enter stealth. When you have entered stealth, sneak near the host and find a decent vantage point to either snipe with the Bolt of Gransax's Ancient Lightning Spear or an opening to rush in with the Dragon King's Cragblade's Thundercloud Form.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 75",
      "mid": "Published from 75",
      "late": "Bolt of Gransax, Dragon King's Cragblade",
      "dlc": "Bolt of Gransax, Dragon King's Cragblade"
    },
    "tags": [
      "fextralife",
      "pvp",
      "late",
      "charged-attacks"
    ],
    "startingClass": "Samurai",
    "mechanic": "Charged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "PvP Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "75",
      "weapon": "Bolt of Gransax, Dragon King's Cragblade",
      "offhand": "Optional",
      "skill": "Ancient Lightning Spear, Thundercloud Form, Bloodhound's Step, Beast's Roar",
      "talismans": [
        "Concealing Veil",
        "Shard of Alexander",
        "Godfrey Icon",
        "Millicent's Prosthesis"
      ],
      "armour": "Okina Mask for +3 dex or Consort's Mask for +1 dex",
      "spells": [],
      "flask": "8 red/6 blue (4 red/3 blue as a phantom). Flask of Wondrous Physick: Dexterity-knot Crystal Tear and Lightning-Shrouding Cracked Tear; Physick: Dexterity-knot Crystal Tear, Lightning-Shrouding Cracked Tear",
      "stats": "40 Dexterity, 20 Strength; That's up to you and your playstyle. With high endurance you can dual wield the Bolt of Gransax, the Dragon King's Cragblade and 2 light weapons. Use light weapons to apply any Ashes of War you want to use otherwise."
    },
    "source": {
      "label": "Fextralife: Level 75 Sanguine Lightning Assassin",
      "url": "https://eldenring.wiki.fextralife.com/Level_75_Sanguine_Lightning_Assassin_Build"
    }
  },
  {
    "id": "fextra-level8090sorcererduelist",
    "name": "Level 80/90 Sorcerer Duelist",
    "stats": "STR / INT / VIG",
    "role": "Published PvP build",
    "playstyle": "Carian Slicer has amazing damage and will stagger anyone with 30 or lower poise (at this level not everyone invests in this), so combining this with the extra cast speed gives you a reliable melee weapon that hits harder and comes out faster than most others in the game. Swift Glintstone Shard is an excellent poke tool at medium range, and can be chained into a quick-cast Comet which allows for a surprising burst of damage (this will often roll catch if they're charging towards you and try to roll through the SGS). Throw in Carian Piercer for poke builds (UGS crouch/power stance thrusting/BHS spammers) and Eternal Darkness for casters and this build has very competitive all-rounder. The trick is to charge-cast the first glintblade, then quick-cast the second as soon as the animation of lowering your staff ends. A moment after casting the second glintblade, cast Collapsing Stars. If it hits (and you timed it right), CS will pull the target into the glintblades as they fire (they can't roll out of the pull animation). PvP duel build for meta level 80-90, combining versatile and high-damage spells with decent poise and life pool for trading. 40 virtual dex from Azur's Glintstone Staff plus the 30 from Radagon Icon puts you over the cast speed cap (if you don't know, Dexterity affects cast speed capping out at 70, and these two items give you that effect). The source's obsolete chain-casting note is not used.",
    "complexity": "Published legacy guide",
    "phases": {
      "early": "Published from 80",
      "mid": "Published from 80",
      "late": "Azur's Glintstone Staff",
      "dlc": "Azur's Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pvp",
      "late",
      "critical-attacks",
      "legacy-source"
    ],
    "startingClass": "Astrologer",
    "mechanic": "Critical attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "PvP Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "80",
      "weapon": "Azur's Glintstone Staff",
      "offhand": "Finger Seal",
      "skill": "Optional parry/quickstep etc.",
      "talismans": [
        "Graven-Mass Talisman",
        "Great-Jar's Arsenal",
        "Stargazer Heirloom",
        "Radagon Icon"
      ],
      "armour": "Queen's Crescent Crown(+3 int),Veteran's Armor,any light gloves with >0 poise (e.g. Astrologer Gloves), Banished Knight Greaves",
      "spells": [
        "Carian Slicer",
        "Swift Glintstone Shard",
        "Comet",
        "Carian Piercer",
        "Terra Magica",
        "Eternal Darkness"
      ],
      "flask": "Balanced Crimson/Cerulean charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "35/40 Vigor, 55/60 (47/52 base +8 from gear) Intelligence (level 80/90 respectively); 26Mind,15Endurance (you do not need to meet strength requirement of Azur's Glintstone Staff to use it)"
    },
    "source": {
      "label": "Fextralife: Level 80/90 Sorcerer Duelist",
      "url": "https://eldenring.wiki.fextralife.com/Level_80-90_Sorcerer_Duelist_Build"
    }
  },
  {
    "id": "fextra-roundtableassassin",
    "name": "Roundtable Assassin",
    "stats": "DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Roundtable Assassin separates infiltration, ordinary combat and executions across a large tool belt. Use Assassin's Approach or Assassin's Gambit to cross noisy ground and reach a backstab, Darkness or Shadow Bait to redirect groups, and the Crepus's Black-Key Crossbow to apply poison or scarlet rot before a dangerous target reaches melee. Ornamental Straight Swords handle sustained engagements; Miséricorde is swapped in only for backstabs, parries or stance-break criticals, where its critical modifier matters. The Wooden Greatshield offers a safe guard option when stealth fails, while Rejection creates space and Lord's Heal or Lord's Aid provides utility rather than damage. Dexterity leads weapon damage, Faith and Mind support the incantation kit, and 18 Endurance preserves medium load across the equipment swaps. Bosses cannot be hidden from, so the build must convert to status bolts, clean defence and critical opportunities instead of relying on stealth.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Ornamental Straight Swords (R1), Miséricorde (R2)",
      "dlc": "Ornamental Straight Swords (R1), Miséricorde (R2)"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "status-buildup"
    ],
    "startingClass": "Confessor",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Ornamental Straight Swords (R1), Miséricorde (R2)",
      "offhand": "Wooden Greatshield (L1), Finger Seal (L2), Crepus's Black-Key Crossbow (L3)",
      "skill": "Assassin's Gambit, Poison Moth Flight",
      "talismans": [],
      "armour": "Confessor Set",
      "spells": [
        "Assassin's Approach",
        "Darkness",
        "Rejection",
        "Shadow Bait",
        "Lord's Aid",
        "Lord's Heal"
      ],
      "flask": "Mostly Crimson Flasks, 1/2 Cerulean Flasks; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dex/Fth; Vig/Mnd/End (18 Endurance for med. Load)"
    },
    "source": {
      "label": "Fextralife: Roundtable Assassin",
      "url": "https://eldenring.wiki.fextralife.com/Roundtable_Assassin_Build"
    }
  },
  {
    "id": "fextra-silentspellblade",
    "name": "Silent Spellblade",
    "stats": "STR / INT / VIG",
    "role": "Published build",
    "playstyle": "A cunning Dark Moon Greatsword build for Ranni the Witch fanatics, wielding the Greatsword into Journey 2+ while cosplaying the Black Knife Assassin for stealth and/or aesthetics. Being unheard and unseen makes using the Dark Moon Greatsword that much less of a hitch, plus it helps that the Black Knife set looks. The choice of staff is circumstantial. Staff of Loss is for the landscape; use to increase Night Comet for otherwise dodging enemies, or pile damage on bigger enemies like the ones in Caelid, combined with Greatblade Phalanx and Moonlight Greatsword, to make quicker work of them. For the armor the armor is chosen to resemble Black Knife Assassin, but trade the Black Knife Greaves for Fire Prelate's. This amounts to decent poise without clashing with the BKA aesthetics. But the poise matters because buffing Dark Moon Greatsword and the sorceries you cast have pretty slow animation, meaning your enemies could otherwise interrupt. And in addition to stealth without having to slow yourself with crouching, it looks cool, and the fact it's a BKA using Ranni's Sword really denotes fanatacism for the witch herself.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Dark Moon Greatsword, and either Staff of Loss",
      "dlc": "Dark Moon Greatsword, and either Staff of Loss"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Dark Moon Greatsword, and either Staff of Loss",
      "offhand": "No off-hand item required",
      "skill": "Moonlight Greatsword",
      "talismans": [
        "Shard of Alexander",
        "Magic Scorpion Charm",
        "Godfrey Icon",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Black Knife Set, but swap Black Knife Greaves for Fire Prelate's Greaves, for poise",
      "spells": [
        "Night Comet",
        "Glintstone Cometshard",
        "Greatblade Phalanx",
        "Ambush Shard",
        "Terra Magica",
        "Loretta's Greatbow",
        "Ranni's Dark Moon"
      ],
      "flask": "3 Cerulean Flasks, rest Crimson Flasks; Physick: Greenburst Crystal Tear, Magic-Shrouding Cracked Tear",
      "stats": "Intelligence; Strength, Vigor"
    },
    "source": {
      "label": "Fextralife: Silent Spellblade",
      "url": "https://eldenring.wiki.fextralife.com/Silent_Spellblade_Build"
    }
  },
  {
    "id": "fextra-twinaxedeathknight",
    "name": "Twin Axe Death Knight",
    "stats": "STR / DEX / FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Death Knight's Twin Axes are a paired weapon, so they can be wielded as a single axe or as dual axes at reduced weight. The paired move set for axes is not the strongest of the paired weapons, but it holds its own for versatility and damage, and the weapon deals lightning damage alongside its physical damage. The requirements are modest for a level 150 build — 14 Strength, 12 Dexterity and 16 Faith — and the weapon scales with all three. That leaves room to push Strength hard as the primary damage stat while keeping Faith at a level that unlocks the build's buffs. Using Blinkbolt: Twinaxe Using it reactively to something already coming at you will get you hit. Used on anticipation instead, it becomes an evasion tool: you can pass through attacks that would otherwise land heavily, and it covers a wide range of them. Occasionally you will phase through something by luck, but the reliable version of this skill is the one where you already know the enemy's pattern. One quirk to be aware of: although the axes are a paired weapon, the skill only uses one axe and returns the other to your off-hand. That rules out pairing it with a bleed axe or another weapon to add an effect during the spin.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Death Knight's Twin Axes"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Death Knight's Twin Axes",
      "offhand": "Erdtree Seal",
      "skill": "Blinkbolt: Twinaxe",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Shard of Alexander",
        "Two-Headed Turtle Talisman"
      ],
      "armour": "Death Knight Helm, Death Knight Armor, Death Knight Gauntlets, Malformed Dragon Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Thorny Cracked Tear, Greenburst Crystal Tear",
      "stats": "Strength, Vigor, Mind; Faith, Dexterity, Endurance"
    },
    "source": {
      "label": "Fextralife: Twin Axe Death Knight",
      "url": "https://eldenring.wiki.fextralife.com/Twin_Axe_Death_Knight_Build"
    }
  },
  {
    "id": "fextra-starscourge",
    "name": "Starscourge",
    "stats": "STR / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A Strength Build that uses the Starscourge Greatsword and its devastating weapon skill: Starcaller Cry. Make sure you use the follow up attack to finish off tougher to kill enemies, since it does far more damage than the cry itself. The way this Build works is that you'll use Sacrificial Axe in your offhand and Starscourge Greatsword in your right. When you dual wield the Starscourge Greatsword, since it's a paired weapon, you will still technically have the Axe equipped, which will provide you 4 FP every time you kill an enemy. This allows you to use Starcaller Cry more liberally, which is great. Jump Attacks can be used on lone enemies or on Bosses that you struggle to perform Starcaller Cry against. Remember to start the cry when bosses are just on the edge of the AoE to give you time to pull off the follow up attack without being interrupted. Your armor does have good Poise, but some bosses hit really hard.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Starscourge Greatsword & Sacrificial Axe",
      "dlc": "Starscourge Greatsword & Sacrificial Axe"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Starscourge Greatsword & Sacrificial Axe",
      "offhand": "No off-hand item required",
      "skill": "Starcaller Cry",
      "talismans": [
        "Rotten Winged Sword Insignia (or Winged Sword Insignia)",
        "Shard of Alexander",
        "Great-Jar's Arsenal"
      ],
      "armour": "General Radahn Set",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Endurance; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Starscourge",
      "url": "https://eldenring.wiki.fextralife.com/Starscourge_Build"
    }
  },
  {
    "id": "fextra-stormarrow",
    "name": "Storm Arrow",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Storm Arrow Build features a pure bow build designed specifically for the DLC. Utilizing Ansbach's Longbow and the Albinauric Bow, this build is challenging to play but rewarding for those who master it. The build uses two bows: Ansbach's Longbow and the Albinauric Bow. The Albinauric Bow, equipped with Mighty Shot, delivers high damage and is ideal for picking off enemies from a distance. The Albinauric Bow is particularly effective in situations where precision and conservation of arrows are crucial, such as in legacy dungeons or the open landscape. Ansbach's Longbow, on the other hand, is equipped with Fan Shot, which fires arrows in a spread pattern and excels in boss fights. This weapon skill has impressive range and damage, capable of tracking and hitting bosses effectively. However, Fan Shot consumes eight arrows per use, making it impractical for regular enemies due to the high arrow consumption.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 153",
      "mid": "Published from 153",
      "late": "Published from 153",
      "dlc": "Ansbach's Longbow, Albinauric Bow"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "ranged-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Ranged attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "153",
      "weapon": "Ansbach's Longbow, Albinauric Bow",
      "offhand": "No off-hand item required",
      "skill": "Fan Shot, Mighty Shot",
      "talismans": [
        "Blue Dancer Charm",
        "Arrow's Sting Talisman",
        "Arrow's Soaring Sting Talisman",
        "Shard of Alexander"
      ],
      "armour": "N/A - Uses Lamenter's Mask",
      "spells": [],
      "flask": "Equal Charges; Physick: Bloodsucking Cracked Tear, Crimsonburst Crystal Tear",
      "stats": "Dexterity, Vigor; Strength, Mind, Endurance"
    },
    "source": {
      "label": "Fextralife: Storm Arrow",
      "url": "https://eldenring.wiki.fextralife.com/Storm_Arrow_Build"
    }
  },
  {
    "id": "fextra-stormblessed",
    "name": "Storm Blessed",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A build that utilizes the Greatspear Messmer Soldier's Spear to deal heavy amounts of damage. The Storm bessed build focuses on maximizing the potential of the Messmer Soldier's Spear and utilizing a medium shield to enhance both offensive and defensive capabilities. The Messmer Soldier's Spear, a weapon classified as a great spear rather than a standard spear, serves as the centerpiece of this build. The decision to use the heavy infusion is twofold: first, it maximizes the weapon's strength scaling, and second, it synergizes with the newly introduced Two-Handed Sword Talisman, which increases damage while two-handing. This combination allows for significant damage output, particularly when paired with the Spear Talisman, which enhances physical damage during counterattacks. One of the standout features of the Messmer Soldier's Spear is its charged heavy attack, which performs a double poke. This unique attack is particularly effective when using talismans like Rotten Winged Sword Insignia or Millicent's Prosthesis, which boost damage with successive hits. Additionally, the double poke makes it easier to apply status effects like bleed, poison, or frostbite, though this build opts to focus on raw physical damage instead.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 165",
      "mid": "Published from 165",
      "late": "Published from 165",
      "dlc": "Messmer Soldier's Spear"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "165",
      "weapon": "Messmer Soldier's Spear",
      "offhand": "Messmer Soldier Shield",
      "skill": "Royal Knight's Resolve, Storm Wall",
      "talismans": [
        "Spear Talisman",
        "Axe Talisman",
        "Two-Handed Sword Talisman"
      ],
      "armour": "St. Trina's Blossom",
      "spells": [],
      "flask": "Equal Charges; Physick: Spiked Cracked Tear, Bloodsucking Cracked Tear",
      "stats": "Strength, Vigor; Endurance, Mind, Dexterity"
    },
    "source": {
      "label": "Fextralife: Storm Blessed",
      "url": "https://eldenring.wiki.fextralife.com/Storm_Blessed_Build"
    }
  },
  {
    "id": "fextra-stormblade",
    "name": "Stormblade",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "A Dexterity warrior that focuses on melee attacks and the liberal use of Storm Blade to annihilate foes at any distance. The idea here is that you replace your regular R1 and R2 attacks with L2 since it: a) swings faster, b) deals more damage and c) can be used at range or in melee. The way this Build works is that you'll buff with Golden Vow and Electrify Armament if needed while on the landscape, attacking enemies at range with Storm Blade, and dealing extra damage when they are in melee range due to the hit box of the weapon itself and the added Lightning Damage from Electrify Armament. When you face bosses you'll want to buff with Flame, Grant Me Strength, Golden Vow and Bloodflame Blade and then get into melee range ASAP and start spamming Storm Blade. Because the weapon itself also connects, you deal incredible damage, and you also build up Hemorrhage, which then rips off another huge chunk of HP. Lost skill of Stormveil.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Levels",
      "mid": "Published from All Levels",
      "late": "Flamberge",
      "dlc": "Flamberge"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Levels",
      "weapon": "Flamberge",
      "offhand": "Finger Seal",
      "skill": "Storm Blade",
      "talismans": [
        "Shard of Alexander",
        "Ritual Sword Talisman",
        "Millicent's Prosthesis",
        "Carian Filigreed Crest"
      ],
      "armour": "Any Armor that allows you to medium roll.",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Electrify Armament",
        "Bloodflame Blade"
      ],
      "flask": "Split FP & HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Mind & Endurance"
    },
    "source": {
      "label": "Fextralife: Stormblade",
      "url": "https://eldenring.wiki.fextralife.com/Stormblade_Build"
    }
  },
  {
    "id": "fextra-stormbladesamurai",
    "name": "Stormblade Samurai",
    "stats": "DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This build is an evolution of the Storm Blade build, initially featuring the Flamberge and Storm Blade weapon skill to devastate enemies. The addition of the Great Katana, which offers higher damage and longer reach compared to the Flamberge, enhances the build further. The great katana is set to the Keen infusion, emphasizing dexterity for maximum damage. The Storm Blade weapon skill attacks at the same speed regardless of the weapon, making it ideal for slower weapons. The Storm Blade Samurai build, effectively combines Storm Hawk arrows and the Storm Blade Ash of War, along with a new talisman to significantly boost damage output. In addition to the great katana, the build incorporates the Albinauric Bow for ranged attacks using regular and Stormwing Bone Arrows. This synergy is enhanced by a talisman that boosts the damage of both Storm Blade and Storm Hawk arrows. Although primarily using regular arrows to conserve the farmed Stormwing bone arrows, the build remains versatile, allowing the use of various arrow types based on the situation.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 151",
      "mid": "Published from 151",
      "late": "Published from 151",
      "dlc": "Great Katana"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "151",
      "weapon": "Great Katana",
      "offhand": "Great Turtle Shell",
      "skill": "Storm Blade",
      "talismans": [
        "Ritual Sword Talisman",
        "Crusade Insignia",
        "Blessed Blue Dew Talisman"
      ],
      "armour": "Divine Beast Helm, Divine Beast Warrior Armor, Horned Warrior Gauntlets, Blaidd's Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Winged Crystal Tear",
      "stats": "Dexterity, Vigor; Mind, Endurance, Intelligence"
    },
    "source": {
      "label": "Fextralife: Stormblade Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Stormblade_Samurai_Build"
    }
  },
  {
    "id": "fextra-supremesamurai",
    "name": "Supreme Samurai",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "Nagakiba's reach and a pure Dexterity investment make this a spacing-focused katana build rather than a dual-wield bleed race. Apply the grease that matches the encounter before committing, use ordinary thrusts and slashes to test the enemy's range, then enter Unsheathe only when a punish is available. The light follow-up comes out faster and is the safer answer when the recovery is uncertain; the heavy follow-up travels farther, deals more stance damage and belongs after a move you already know is finished. Shard of Alexander raises both releases, Dragoncrest Greatshield cushions close-range mistakes, and Great-Jar's Arsenal plus Bull-Goat's Talisman support the listed armour without surrendering medium roll or useful poise. Dexterity drives damage, Vigor keeps the duelist alive and Endurance funds armour, long attack strings and repeated stance entries. The build has no native projectile or spell lane, and enemies that resist the selected grease still have to be beaten through clean physical spacing and stance breaks.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Nagakiba",
      "dlc": "Nagakiba"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Nagakiba",
      "offhand": "No off-hand item required",
      "skill": "Unsheathe",
      "talismans": [
        "Shard of Alexander",
        "Dragoncrest Greatshield Talisman",
        "Great-Jar's Arsenal",
        "Bull-Goat's Talisman"
      ],
      "armour": "Nox Swordstress Armor, White Reed Gauntlets, Ronin's Greaves, Iron Kasa",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Supreme Samurai",
      "url": "https://eldenring.wiki.fextralife.com/Supreme_Samurai_Build"
    }
  },
  {
    "id": "fextra-swordsage",
    "name": "Sword Sage",
    "stats": "INT / FAI / VIG / MND",
    "role": "Published build",
    "playstyle": "The Sword Sage is a combination of Intelligence and Faith, using the Sword of Night and Flame and Death Sorceries. The way this Build works is that you increase your Intelligence and Faith high enough to use Sword of Night and Flame and Ancient Death Rancor, which requires 34 Int and 24 Faith. Sword of Night and Flame has an amazing Weapon Art that allows you to do a Comet-like beam with L2 and R1 that does insane damage and has great range. L2 and R2 is a flame strike in an AoE in front of you that can wipe out packs of enemies. Ancient Death Rancor does incredible stagger damage to enemies, allowing you to pin them down if you spam this, which is fantastic solo and in co op play. It's particularly good against fast moving enemies and bosses that are hard to hit with Sword of Night and Flame's Weapon arts Night-and-Flame Stance (Unique). Hold the sword level and prepare to cast a sorcery.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Sword of Night and Flame & Meteorite Staff",
      "late": "Sword of Night and Flame & Meteorite Staff",
      "dlc": "Sword of Night and Flame & Meteorite Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "stance-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Stance damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Sword of Night and Flame & Meteorite Staff",
      "offhand": "No off-hand item required",
      "skill": "Night-and-Flame Stance",
      "talismans": [],
      "armour": "Any that still lets you med roll",
      "spells": [
        "Rancorcall",
        "Ancient Death Rancor"
      ],
      "flask": "Split between FP & HP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Faith; Vigor & Mind"
    },
    "source": {
      "label": "Fextralife: Sword Sage",
      "url": "https://eldenring.wiki.fextralife.com/Sword_Sage_Build"
    }
  },
  {
    "id": "fextra-swordsaint",
    "name": "Sword Saint",
    "stats": "STR / DEX / FAI / VIG",
    "role": "Published build",
    "playstyle": "A Dexterity/Faith/Strength Build that focuses on using the Sacred Relic Sword and Wave of Gold. The way this Build works is that you'll use Wave of Gold to take out packs of large enemies and on Bosses that aren't Holy Damage Resistant. This build uses Carian Filigreed Crest and Sword of Milos to help manage FP, so you can use Wave of Gold often and not worry about how much FP it costs. When facing Holy Resistant enemies you'll use Jump Attacks to take them out, since Sword of Milos deals 100% Physical Damage, and Sacred Relic Sword deals about 63% Physical Damage. This will allow you to still deal great damage when attacking this way, bypassing this resistance, and the Claw Talisman only boosts this damage further. You could use the Raptor's Black Feathers for even more Jump Attack Damage if you wish.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Sacred Relic Sword, Sword of Milos, and any Sacred Seal",
      "dlc": "Sacred Relic Sword, Sword of Milos, and any Sacred Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Not specified",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Faith Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Sacred Relic Sword, Sword of Milos, and any Sacred Seal",
      "offhand": "No off-hand item required",
      "skill": "Wave of Gold",
      "talismans": [
        "Shard of Alexander",
        "Carian Filigreed Crest",
        "Claw Talisman",
        "Sacred Scorpion Charm"
      ],
      "armour": "Any Armor with high Poise, the higher the better.",
      "spells": [
        "Golden Vow"
      ],
      "flask": "Split between HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Faith; Strength & Vigor"
    },
    "source": {
      "label": "Fextralife: Sword Saint",
      "url": "https://eldenring.wiki.fextralife.com/Sword_Saint_Build"
    }
  },
  {
    "id": "fextra-swordsmanofsttrina",
    "name": "Swordsman of St. Trina",
    "stats": "STR / DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This weapon, an upgrade from the original Sword of St. Trina, boasts better stats and introduces the Eternal Sleep status effect. While many bosses in the game are immune to sleep, this build demonstrates how to effectively use sleep as a backup strategy. The main differences between the Velvet Sword of St. Trina and the original Sword of St. Trina are the damage types and status effects. The Velvet Sword of St. Trina deals more magic damage, while the original does more physical damage. The Mists of Eternal Sleep weapon skill is crucial, dealing 70 Eternal Sleep buildup with the spray and an additional 42 when the weapon connects. Buffing the weapon increases the Eternal Sleep buildup to 57 on regular attacks, making it more effective than the weapon skill itself. Always rebuff your weapon to maximize the buildup effect. For armor, the build uses the following pieces of the Scaled Armor Set (Scaled Armor, Scaled Gauntlets, Scaled Greaves) with St. Trina's Blossom helmet, providing a good look while maintaining enough poise to prevent interruptions during block counters.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 153",
      "mid": "Published from 153",
      "late": "Published from 153",
      "dlc": "Velvet Sword of St. Trina, Lordsworn's Straight Sword (Cold)"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "status-buildup"
    ],
    "startingClass": "Not specified",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "153",
      "weapon": "Velvet Sword of St. Trina, Lordsworn's Straight Sword (Cold)",
      "offhand": "Crossed-Tree Towershield",
      "skill": "Mists of Eternal Sleep, Square Off",
      "talismans": [
        "Two-Headed Turtle Talisman",
        "Blade of Mercy",
        "Dagger Talisman",
        "St"
      ],
      "armour": "St. Trina's Blossom, Scaled Armor, Scaled Gauntlets, Scaled Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity, Endurance, Vigor; Strength, Mind"
    },
    "source": {
      "label": "Fextralife: Swordsman of St. Trina",
      "url": "https://eldenring.wiki.fextralife.com/Swordsman_of_St._Trina_Build"
    }
  },
  {
    "id": "fextra-templar",
    "name": "Templar",
    "stats": "FAI / VIG / END",
    "role": "Published build",
    "playstyle": "Golden Vow is used when Cooperating to buff your group, or your Spirit Summons if you are using a group of them. Sacred Blade is much better when playing solo, as it gives you a ranged option, and buffs your damage considerably for a short while, though it has a long wind up making it hard to use mid boss fight. Aspects of the Crucible: Tail is your AoE clear spell, and can be replaced with any other AoE when you get one, but it does substantial stagger damage as well, and can drop Trolls and other large enemies with 2 casts. Remember you can hold the cast button when using it to do 2 tail swipes. The way this Build works is that you Block Counter off of attacks into your Shield by pressing R2. This often staggers enemies allowing you a Critical Attack, dealing devastating damage, but if not the Block Counter itself does substantial damage on its own. You'll use Barricade Shield to reduce the Stamina consumption used to Block, allowing for more Block Counters, since these consume considerable Stamina.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 50",
      "mid": "Noble's Slender Sword",
      "late": "Noble's Slender Sword",
      "dlc": "Noble's Slender Sword"
    },
    "tags": [
      "fextralife",
      "pve",
      "mid",
      "guard-counters"
    ],
    "startingClass": "Confessor",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Faith Builds"
    ],
    "availableFrom": "mid",
    "publishedLoadout": {
      "level": "50",
      "weapon": "Noble's Slender Sword",
      "offhand": "Brass Shield; Finger Seal",
      "skill": "Ash of War: Golden Vow, Ash of War: Sacred Blade, Ash of War: Barricade Shield",
      "talismans": [],
      "armour": "Mausoleum Knight Armor, Greathelm, Knight Greaves, & Knight Gauntlets",
      "spells": [
        "Blessing's Boon",
        "Aspects of the Crucible: Tail"
      ],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith & Endurance; Vigor"
    },
    "source": {
      "label": "Fextralife: Templar",
      "url": "https://eldenring.wiki.fextralife.com/Templar_Build"
    }
  },
  {
    "id": "fextra-thunderingswordspear",
    "name": "Thundering Swordspear",
    "stats": "DEX / VIG",
    "role": "Published build",
    "playstyle": "A melee focused build that uses Lighting to strike enemies at range, and to boost damage in melee. The way this Build works is that you'll buff with Golden Vow as you make your way around the game, one shotting most easy enemies with Thunderbolt from range, or even tough enemies as necessary. Thunderbolt scales off of base weapon damage and Dexterity scaling, and this is why this build uses the Guardian's Swordspear. It has very high base damage and A scaling in Dexterity, and doesn't require much Strength investment. Cast Flame, Grant Me Strength when you need extra damage like in a Boss fight or before a tough enemy, and the same with Electrify Armament. Both will boost your melee damage, but not Thunderbolt. You can dispatch any in melee if they approach you due to your high Attack Rating, and you can Block with your Shield as necessary. Avoid Block Countering with this Weapon though as it is slow and will likely get you hit.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 100",
      "mid": "Published from 100",
      "late": "Guardian's Swordspear & Finger Seal",
      "dlc": "Guardian's Swordspear & Finger Seal"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "spell-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Spell damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "100",
      "weapon": "Guardian's Swordspear & Finger Seal",
      "offhand": "Banished Knight's Shield",
      "skill": "Thunderbolt",
      "talismans": [
        "Lightning Scorpion Charm",
        "Radagon's Soreseal",
        "Green Turtle Talisman",
        "Dragoncrest Shield Talisman +1"
      ],
      "armour": "Great Helm, Tree Coat, Chain Gloves, Chain Greaves",
      "spells": [
        "Golden Vow",
        "Flame, Grant Me Strength",
        "Electrify Armament",
        "Blessing's Boon"
      ],
      "flask": "Split HP and FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity; Vigor"
    },
    "source": {
      "label": "Fextralife: Thundering Swordspear",
      "url": "https://eldenring.wiki.fextralife.com/Thundering_Swordspear_Build"
    }
  },
  {
    "id": "fextra-towerknight",
    "name": "Tower Knight",
    "stats": "STR / DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This build utilizes the Morning Star hammer weapon and the Cragblade ash of war to easily break the stance or \"stance break\" against enemies. This build uses the Morning Star weapon. A hammer weapon fits well for this build since charged heavy attacks from a hammer deal 36 stance damage, and block counters also deal 36 stance damage. This is important since most bosses in Elden Ring have about 80 Stance while others have 100+ (120 for example for Godrick the Grafted). And if you deal the said amount of stance damage in a short period, they'll become vulnerable to critical attacks, hitting them a couple of times, or even a combination of both. Combining the Cragblade ash of war for this build will help you achieve the goal of easily breaking a target's stance since this skill applies a buff that increases physical attack power by 15%, stance damage by 10%, and stamina damage against a blocking enemy by 50%. The ideal strategy when using the weapon and the skill is to activate the buff with Cragblade before you engage a boss battle, use charged heavy attacks as quickly as you can, and use a block counter to break their stance, following up with critical attacks or a string of attacks to punish the target while it is unable to move. Generally, you can use other hammers but the Morning Star is the best weapon to use for this build since it has bleed build-up that applies blood loss which is a good negative status effect to apply on some bosses.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Morning Star",
      "dlc": "Morning Star"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Morning Star",
      "offhand": "Manor Towershield; Academy Glintstone Staff; Finger Seal",
      "skill": "Cragblade",
      "talismans": [
        "Green Turtle Talisman",
        "Axe Talisman",
        "Curved Sword Talisman",
        "Greatshield Talisman"
      ],
      "armour": "Knight Set",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Greenburst Crystal Tear, Spiked Cracked Tear",
      "stats": "Strength, Vigor, Endurance; Mind, Intelligence, Dexterity"
    },
    "source": {
      "label": "Fextralife: Tower Knight",
      "url": "https://eldenring.wiki.fextralife.com/Tower_Knight_Build"
    }
  },
  {
    "id": "fextra-vampiricknight",
    "name": "Vampiric Knight",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A melee build that focuses on out healing damage taken while shredding enemies to death with the Butchering Knife. The way this Build works is that you'll stack healing over time effects so that you keep gaining health while trading damage. Icon Shield and Blessed Dew Talisman both heal you over time, and Butchering Knife heals you for 1% of your max HP per strike. Wild Strikes is a fantastic Ash of War for this Weapon because it strikes rapidly helping to trigger that 1% heal more often as well as increasing your Attack Power via Rotten Winged Sword Insignia, and it has hyper Armor making it difficult for you to be interrupted. Additionally you can R1 or R2 out of Wild Strikes for more attacks that can often finish off enemies and Boss or minimally stagger them depending on how much you've hit them already.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Butchering Knife",
      "dlc": "Butchering Knife"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Butchering Knife",
      "offhand": "Icon Shield",
      "skill": "Prayerful Strike",
      "talismans": [
        "Rotten Winged Sword Insignia",
        "Blessed Dew Talisman",
        "Shard of Alexander",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "Any armor with high Poise and protection, the higher the better",
      "spells": [],
      "flask": "Mostly HP, some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity & Vigor; Endurance"
    },
    "source": {
      "label": "Fextralife: Vampiric Knight",
      "url": "https://eldenring.wiki.fextralife.com/Vampiric_Knight_Build"
    }
  },
  {
    "id": "fextra-vanquisher",
    "name": "Vanquisher",
    "stats": "STR / DEX / VIG / MND",
    "role": "Published build",
    "playstyle": "The Vanquisher Build is an \"all-game\" build that players can use fairly at the beginning of the game and until the end. The highlight of this build is the Dragon Halberd weapon, making it special because of the skill that is associated, which is the Ash of War: Spinning Slash that buffs the damage with Ice Lightning by 160 Lightning Damage and 80 Frost build up for 45 seconds. Not only does it have great damage, but the weapon has a decent guard boost. The Dragon Halberd weapon can be acquired in the early stages of the game if you're playing for the first time, and this is dropped by the Dragonkin Soldier boss located in Siofra River. The reason why this weapon is interesting is how it is empowered with Ice Lightning when using the Ash of War: Spinning Slash, when you use the skill, it buffs the weapon damage with Ice Lightning by 160 Lightning Damage and 80 Frost build-up for 45 seconds. It is an effect that is unique to this weapon. The Dragon Halberd also has a great attack rating with 55 Strength, 45 Dexterity, and bolsters Physical Damage. Apart from that since this build doesn't come with a shield, unlike the other builds, the Dragon Halberd has a decent guard boost if fully upgraded for blocking enemy attacks.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Dragon Halberd",
      "dlc": "Dragon Halberd"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Dragon Halberd",
      "offhand": "Finger Seal",
      "skill": "Spinning Slash",
      "talismans": [
        "Shard of Alexander",
        "Ritual Sword Talisman",
        "Dragoncrest Greatshield Talisman",
        "Spear Talisman"
      ],
      "armour": "Gelmir Knight Helm, Gelmir Knight Armor, Cuckoo Knight Gauntlets, Gelmir Knight Greaves",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Strength-knot Crystal Tear, Dexterity-knot Crystal Tear",
      "stats": "Strength, Vigor, Dexterity; Mind"
    },
    "source": {
      "label": "Fextralife: Vanquisher",
      "url": "https://eldenring.wiki.fextralife.com/Vanquisher_Build"
    }
  },
  {
    "id": "fextra-venomousbloodblade",
    "name": "Venomous Bloodblade",
    "stats": "STR / DEX / VIG / END",
    "role": "Published build",
    "playstyle": "A Quality Build that uses Bleed and Poison to boost Attack Power extremely high while dual wielding Curved Swords. You'll then swing repeatedly with L1, blending enemies down quickly to trigger both Millicent's Prosthesis and Rotten Winged Sword Insignia to further increase your Attack Power, giving you an Attack Rating of well over 1k with each Curved Sword. This allows you to attack rapidly with very high damage, with the occasional Hemorrhage proc, and while the enemy remains Poisoned. The way this Build works is that you'll typically buff your left-hand weapon with Seppuku to increase its Bleed build up and damage and to trigger Lord of Blood's Exultation. Then you'll lead most fights with Poisonous Mist in order to set Poisoned to also boost your Attack Power by 30% thanks to the Mushroom Crown and Kindred of Rot's Exultation. If enemies are immune to Poisoned and Bleed, you can still trigger Lord of Blood's Exultation repeatedly with Seppuku as necessary and you can use the Raw Meat Dumpling to set Poisoned on yourself to gain Kindred of Rot's Exultation's buff. Bathe armament in poison, and then slash, spreading toxic mist forwards. The armament retains its poison for a while.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150",
      "mid": "Published from 150",
      "late": "Scavenger's Curved Sword & Bandit's Curved Sword (if you can get a second Scavenger's Curved Sword from someone that would be better)",
      "dlc": "Scavenger's Curved Sword & Bandit's Curved Sword (if you can get a second Scavenger's Curved Sword from someone that would be better)"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "status-buildup"
    ],
    "startingClass": "Not specified",
    "mechanic": "Status buildup",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "Strength Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150",
      "weapon": "Scavenger's Curved Sword & Bandit's Curved Sword (if you can get a second Scavenger's Curved Sword from someone that would be better)",
      "offhand": "No off-hand item required",
      "skill": "Poisonous Mist & Seppuku",
      "talismans": [
        "Millicent's Prosthesis",
        "Winged Sword Insignia",
        "Kindred of Rot's Exultation",
        "Lord of Blood's Exultation"
      ],
      "armour": "White Mask or Mushroom Crown & any that allows you to med roll",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Strength & Dexterity; Vigor & Endurance"
    },
    "source": {
      "label": "Fextralife: Venomous Bloodblade",
      "url": "https://eldenring.wiki.fextralife.com/Venomous_Bloodblade_Build"
    }
  },
  {
    "id": "fextra-voidknight",
    "name": "Void Knight",
    "stats": "DEX / VIG / MND / END",
    "role": "Published build",
    "playstyle": "The Void Knight build for Elden Ring's Shadow of the Erdtree highlights a new weapon and shield exclusively found in the DLC, the Sword of Night and the Shield of Night. The Sword of Night is a standard weapon, it has bloodloss buildup, scales and has pretty decent Dexterity, it has magic damage but majority of it being physical, and it comes with a unique weapon skill, the Witching Hour Slash. This skill makes the character hold its weapon to the side, and pulling the character forward while attacking with a fast triple slash. Since the weapon does not have a good reach unlike other katanas, the skill actually has great range when used, making it possible to land your hits on the targeted enemy. Additionally, you can also charge the skill for increased ranged and damage. The build also comes with the Shield of Night. The shield has a weight value of 2.0, it has attack power physical and magic, anad even though the defense and guard boost values are not good, the shield scales with Dexterity and it comes with a unique skill, Revenge of the Night. By default, using the skill shoots out a mid-range projectile that deals modest damage of 100% magic, in exchange for a low cost of 5 FP.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150+",
      "mid": "Published from 150+",
      "late": "Published from 150+",
      "dlc": "Sword of Night"
    },
    "tags": [
      "fextralife",
      "pve",
      "dlc",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds",
      "SOTE Builds"
    ],
    "availableFrom": "dlc",
    "publishedLoadout": {
      "level": "150+",
      "weapon": "Sword of Night",
      "offhand": "Shield of Night",
      "skill": "Witching Hour Slash, Revenge of the Night",
      "talismans": [
        "Crusade Insignia",
        "Shard of Alexander",
        "Blessed Blue Dew Talisman",
        "Godfrey Icon"
      ],
      "armour": "Helm of Night, Armor of Night, Black Knight Gauntlets, Black Knight Greaves",
      "spells": [],
      "flask": "Equal Charges; Physick: Magic-Shrouding Cracked Tear, Opaline Hardtear",
      "stats": "Dexterity, Vigor; Endurance, Mind"
    },
    "source": {
      "label": "Fextralife: Void Knight",
      "url": "https://eldenring.wiki.fextralife.com/Void_Knight_Build"
    }
  },
  {
    "id": "fextra-warriorwizard",
    "name": "Warrior Wizard",
    "stats": "INT / VIG",
    "role": "Published build",
    "playstyle": "A melee mage build that focuses on destroying enemies up close with weapon spells. Loretta's Greatbow is there for a ranged option in case you need to pick off an enemy or two safely, and you can drop Terra Magica before using it to boost your damage further. The way this Build works is that you'll main using Carian Slicer as your primary attack using the Carian Regal Scepter in your right hand to cast, and Carian Glintstone Staff in your left to buff its damage. Gavel of Haima can be chained if you cast with alternating staffs, R1, L1, R1, L1 etc, allowing you to keep staggering an enemy or boss for modest damage. This makes guard breaks happen often, allowing you more opening to attack. Use Lusat's Glintstone Staff for boss fights where you need more damage, and FP isn't an issue. In boss fights you want to kill as quickly as possible, so even 10% more damage is useful.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Carian Regal Scepter, Lusat's Glintstone Staff, & Carian Glintstone Staff",
      "dlc": "Carian Regal Scepter, Lusat's Glintstone Staff, & Carian Glintstone Staff"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Intelligence Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Carian Regal Scepter, Lusat's Glintstone Staff, & Carian Glintstone Staff",
      "offhand": "Carian Knight's Shield",
      "skill": "No Skill",
      "talismans": [
        "Magic Scorpion Charm",
        "Graven-Mass Talisman",
        "Dragoncrest Greatshield Talisman",
        "Radagon Icon"
      ],
      "armour": "Beast Champion Set & Greathelm",
      "spells": [
        "Terra Magica",
        "Gavel of Haima",
        "Loretta's Greatbow",
        "Carian Slicer",
        "Carian Piercer",
        "Carian Greatsword",
        "Adula's Moonblade"
      ],
      "flask": "Split HP & FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Intelligence & Vigor"
    },
    "source": {
      "label": "Fextralife: Warrior Wizard",
      "url": "https://eldenring.wiki.fextralife.com/Warrior_Wizard_Build"
    }
  },
  {
    "id": "fextra-warriorofwaves",
    "name": "Warrior of Waves",
    "stats": "STR / DEX / INT / VIG / MND / END",
    "role": "Published build",
    "playstyle": "This build primarily focuses on the use of the Ruins Greatsword weapon, a colossal sword that has fantastic scaling and devastating power once it is fully upgraded. The default skill for this weapon is the Wave of Destruction, a devastating weapon skill that shows the character raising the weapon and slamming it on the ground to release a vertical wave of gravity magic. The weapon skill damage scares primarily with weapon level. There are minor increases in damage from Strength levels and the least increase from Intelligence levels. The Ruins Greatsword weapon is a colossal weapon that requires 50 STR and 16 INT. Most of the damage output of this weapon is physical and has some magic to it. Elden Ring Map here This boss fight is only accessible before the festival OR after defeating Starscourge Radahn and exhausting Witch-Hunter Jerren's subsequent dialogue (Video Location). To maximize the physical damage of this weapon, consuming items such as the Exalted Flesh increases the Physical Damage by 20% (15% in PvP0 for 30 seconds or even conjuring Flame, Grant Me Strength to raise the physical attack power of this weapon.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from All Game",
      "mid": "Published from All Game",
      "late": "Ruins Greatsword",
      "dlc": "Ruins Greatsword"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "skill-damage"
    ],
    "startingClass": "Not specified",
    "mechanic": "Skill damage",
    "collection": "Fextralife",
    "guideCategories": [
      "Strength Builds",
      "All Game Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "All Game",
      "weapon": "Ruins Greatsword",
      "offhand": "Academy Glintstone Staff; Finger Seal",
      "skill": "Wave of Destruction",
      "talismans": [
        "Taker's Cameo",
        "Carian Filigreed Crest",
        "Great-Jar's Arsenal",
        "Shard of Alexander"
      ],
      "armour": "Greathelm, Beast Champion Armor, Beast Champion Gauntlets, Beast Champion Greaves",
      "spells": [
        "Flame, Grant Me Strength"
      ],
      "flask": "Equal Charges; Physick: Strength-knot Crystal Tear, Spiked Cracked Tear",
      "stats": "Strength, Vigor, Endurance; Mind, Intelligence, Dexterity"
    },
    "source": {
      "label": "Fextralife: Warrior of Waves",
      "url": "https://eldenring.wiki.fextralife.com/Warrior_of_Waves_Build"
    }
  },
  {
    "id": "fextra-waterfowlwarrior",
    "name": "Waterfowl Warrior",
    "stats": "DEX / VIG / END",
    "role": "Published build",
    "playstyle": "Unlike other Katana Builds, Hemorrhage doesn't play a huge roll in this Build because Waterfowl Dance doesn't build up Bleed fast at all, so don't worry about it, and don't try to maximize Bleeding Build Up. The way this Build works is that you'll use the regular attacks of Hand of Malenia to deal with regular enemies, two-handing it in order to gain max damage and keep your equip load a bit lighter for more armor with higher Poise. You'll use Waterfowl Dance on tough to kill enemies, packs of enemies and Bosses, using your high Poise and hyper armor of the skill to strike them repeatedly for very high damage, triggering Millicent's Prosthesis and Winged Sword Insignia, boosting repeated L2 damage. Stamina is an issue for this Build because Waterfowl Dance eats it up, and you likely won't be able to use 3 consecutive L2 pulls twice, without waiting for your Stamina to replenish. Use Greenburst Crystal Tear when facing Bosses to keep your Stamina high, so you don't run out mid attack.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from 150-200",
      "mid": "Published from 150-200",
      "late": "Hand of Malenia",
      "dlc": "Hand of Malenia"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "guard-counters"
    ],
    "startingClass": "Not specified",
    "mechanic": "Guard counters",
    "collection": "Fextralife",
    "guideCategories": [
      "Dexterity Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "150-200",
      "weapon": "Hand of Malenia",
      "offhand": "No off-hand item required",
      "skill": "Waterfowl Dance",
      "talismans": [
        "Shard of Alexander",
        "Millicent's Prosthesis",
        "Winged Sword Insignia",
        "Dragoncrest Greatshield Talisman"
      ],
      "armour": "They heaviest you can wear and still Medium Roll.",
      "spells": [],
      "flask": "Mostly HP some FP; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Dexterity; Endurance & Vigor"
    },
    "source": {
      "label": "Fextralife: Waterfowl Warrior",
      "url": "https://eldenring.wiki.fextralife.com/Waterfowl_Warrior_Build"
    }
  },
  {
    "id": "fextra-zealousfurytemplar",
    "name": "Zealous Fury Templar",
    "stats": "FAI / VIG / MND / END",
    "role": "Published build",
    "playstyle": "Early on you will want to farm for a Brass Shield and the Golden Vow ashes. You will want to target medium rolls throughout this build, start with raising Vigor to 15 then STR to 16 and DEX to 13 for the Claymore, this weapon offers slashes and stabs. From here you can play sword and shield or talisman and shield with the early incantations, use Golden Vow to buff, you heal to heal and fire spells for damage. By level 40 you should have about 20 Vigor, 14 Mind, 14 Endurance and 24 Faith and can level as you choose, want more hp, then go Vigor, more FP go Mind, need more stamina (use the turtle talisman) or equip load go Endurance and when those feel good go Faith for damage. Sword and Shield with incantations will carry you quite well into the later game where you want to target the Blasphemous Blade as early as you can. Until this point, before you begin dual-wielding Greatswords you can choose to forgo the shield and do so sooner. Obtain the Claw Talisman and prioritize jumping L1 attacks for massive damage and poise damage. With high Faith you have options for Holy and Fire damage on your swords as well as lightning, fire, holy primary incantations, a large variety of buffs, magic, ice, rot dragon incantations, poison and bleed incantations and so much more.",
    "complexity": "Published guide",
    "phases": {
      "early": "Published from Endgame / NG+",
      "mid": "Published from Endgame / NG+",
      "late": "Blasphemous Blade",
      "dlc": "Blasphemous Blade"
    },
    "tags": [
      "fextralife",
      "pve",
      "late",
      "jump-attacks"
    ],
    "startingClass": "Confessor",
    "mechanic": "Jump attacks",
    "collection": "Fextralife",
    "guideCategories": [
      "PvE Builds"
    ],
    "availableFrom": "late",
    "publishedLoadout": {
      "level": "Endgame / NG+",
      "weapon": "Blasphemous Blade",
      "offhand": "Brass Shield; Finger Seal",
      "skill": "Taker's Flames",
      "talismans": [
        "Claw Talisman"
      ],
      "armour": "Anything in Mid-roll, Confessor set until altered Mausoleum Knight Armor with hood or no helm.",
      "spells": [
        "Lightning Spear",
        "Black Flame",
        "Frenzied Burst"
      ],
      "flask": "1/2 Cerulean Flasks, rest Crimson Flasks; Physick: Opaline Hardtear, Greenburst Crystal Tear",
      "stats": "Faith / Vigor; Mind / Endurance"
    },
    "source": {
      "label": "Fextralife: Zealous Fury Templar",
      "url": "https://eldenring.wiki.fextralife.com/Zealous_Fury_Templar_Build"
    }
  }
];
