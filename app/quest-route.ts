export type QuestRouteStep = {
  label: string;
  detail: string;
};

type QuestRoutePatch = {
  remove?: string[];
  before?: string;
  after?: string;
  steps: QuestRouteStep[];
};

const step = (label: string, detail: string): QuestRouteStep => ({ label, detail });

// These patches turn compressed quest summaries into individually checkable game-state changes.
// Each entry is positioned beside an existing route anchor so the resulting list remains chronological.
const QUEST_ROUTE_PATCHES: Record<string, QuestRoutePatch[]> = {
  "first-steps": [
    {
      remove: ["WARNING — Radagon's Soreseal increases all damage taken by 15%; use it only while the early stat gain outweighs the penalty, then unequip it"],
      steps: [],
    },
    {
      before: "Meet Boc south-east of Agheel Lake North",
      steps: [
        step("Speak to White Mask Varre at The First Step", "At The First Step grace, exhaust Varre's dialogue before leaving Limgrave. Do not attack him. His next location unlocks after Godrick and the Two Fingers audience."),
        step("Meet Yura beneath the ruin north-east of Seaside Ruins", "From Seaside Ruins, ride north-east to the large collapsed stone arch and exhaust Yura's warning about Agheel. This records his opening encounter before the later academy invasion."),
        step("Defeat Bloody Finger Nerijus with Yura at Murkwater", "Follow the stream north from Agheel Lake toward Murkwater Cave. When Nerijus invades, survive until Yura arrives, defeat Nerijus, then continue north beneath the overpass and exhaust Yura's dialogue."),
        step("Spare Patches and reopen his Murkwater Cave shop", "Enter Murkwater Cave, open the boss chest and fight Patches only until he surrenders at roughly half health. Stop attacking, accept his surrender, reload the cave and exhaust his dialogue so his shop opens. Never kill him if preserving his Volcano Manor rewards."),
        step("Meet D and defeat the Summonwater Village Tibia Mariner", "Speak to D west of Summonwater Village, defeat the Tibia Mariner in the flooded ruins, then speak to D again at the village entrance or Roundtable Hold. Use the waygate he marks behind Third Church and give the Deathroot to Gurranq."),
        step("Free Iron Fist Alexander above Saintsbridge", "Climb the ledge south of Saintsbridge, follow Alexander's calls and strike his rear with charged attacks until he comes free. Exhaust his dialogue for the Triumphant Delight gesture before he moves toward Gael Tunnel."),
        step("Meet Knight Bernahl at Warmaster's Shack", "Visit Warmaster's Shack during daytime and exhaust Bernahl's dialogue. This encounter is optional for progress, but records him before he relocates to Volcano Manor."),
      ],
    },
    {
      after: "Meet Roderika at Stormhill Shack",
      steps: [
        step("Let Fia hold you once at Roundtable Hold", "In the room beside Smithing Master Hewg, let Fia hold you and exhaust her dialogue. Use the Baldachin's Blessing afterward to remove its temporary maximum-HP penalty."),
        step("Meet Diallos at Roundtable Hold", "Find Diallos near the central table and exhaust his dialogue about his servant Lanya. His next mandatory appearance is in Academy Gate Town before Rykard."),
        step("Meet Brother Corhyn at Roundtable Hold", "Speak to Corhyn in the main Roundtable chamber and exhaust his dialogue. Buy any required incantations now; he leaves for Altus after the plateau is reached."),
      ],
    },
    {
      remove: ["Clear Fort Haight and speak to Kenneth Haight"],
      before: "Collect Dectus Medallion (Left) at Fort Haight",
      steps: [
        step("Meet Kenneth Haight above the Mistwood road", "From Mistwood Outskirts, follow the road east toward Third Church. Kenneth is calling from the top of the ruined arch spanning the road; climb the rubble, speak to him and accept the request to reclaim Fort Haight."),
        step("Clear Fort Haight and collect Bloody Slash", "Enter Fort Haight from Fort Haight West, clear the ground floor and battlements, then defeat the Godrick Knight commander at the top. He drops Ash of War: Bloody Slash and completing this fight advances Kenneth."),
        step("Return to Kenneth for the Erdsteel Dagger", "Fast-travel back to Mistwood Outskirts, climb to Kenneth's original position and report that Fort Haight is clear. Exhaust his dialogue to receive the Erdsteel Dagger."),
        step("Rest at Fort Haight West, then pledge service to Kenneth", "After receiving the dagger, rest at Fort Haight West or reload the area, return to Kenneth's original ruin and speak again. Accept 'Pledge service' when offered; this is safe and is required to continue his route."),
        step("Revisit Kenneth on Fort Haight's battlements", "Rest or fast-travel once more, return to Fort Haight and climb to the battlements where the knight commander stood. Ignore or clear the demi-humans, then exhaust Kenneth's dialogue about finding a true lord. Leave him alive for the Nepheli throne-room ending."),
      ],
    },
  ],
  weeping: [
    {
      after: "Clear Coastal Cave and return Boc's Sewing Needle",
      steps: [
        step("Speak to Boc at Lake-Facing Cliffs after Coastal Cave", "After returning the Sewing Needle, rest at Lake-Facing Cliffs in Liurnia and exhaust Boc beside the grace. Tell him he may call you Lord; this moves his tailoring service along the route."),
      ],
    },
  ],
  stormveil: [
    {
      after: "Collect Chrysalids' Memento for Roderika",
      steps: [
        step("Give Roderika the Chrysalids' Memento before Godrick", "Return to Stormhill Shack before defeating Godrick and give Roderika the memento. If she has already moved, continue at Roundtable Hold; the quest still progresses, but this conversation is no longer available."),
      ],
    },
    {
      after: "Defeat Godrick the Grafted",
      steps: [
        step("Speak to Nepheli and Gideon after Godrick", "At Roundtable Hold, speak to Nepheli outside Gideon's study for the Arsenal Charm, then speak to Gideon and exhaust his new dialogue about her. Do not give Nepheli Seluvis's potion later."),
        step("Meet the Two Fingers and return to Varre's message", "Enter the newly opened Two Fingers chamber at Roundtable Hold and exhaust Enia and the Fingers audience. Return to The First Step, read Varre's message, then leave his Rose Church meeting for Liurnia."),
        step("Exhaust Rogier at Roundtable Hold", "Speak to Rogier on the balcony overlooking the hall. Ask about the corpse beneath Stormveil and exhaust every topic; this enables the Black Knifeprint investigation with Fia and Ranni."),
        step("Return the Chrysalids' Memento route and collect the Crimson Hood", "After Roderika moves to Roundtable Hold, revisit the pile of bodies where the memento was found and collect the Crimson Hood. This pickup appears only after her move."),
      ],
    },
  ],
  "liurnia-south": [
    {
      after: "Meet Hyetta and give her the first Shabriri Grape",
      steps: [
        step("Give Hyetta the second grape at Purified Ruins", "Find the underground chamber in Purified Ruins for a Shabriri Grape, then meet Hyetta on the western edge of the ruins and give it to her. Exhaust her dialogue before reloading."),
        step("Give Hyetta the third grape at Gate Town Bridge", "Meet Hyetta just north of Gate Town Bridge grace and give her a third Shabriri Grape. Tell her the grapes are human eyes, rest at the grace, speak to her again, then rest and exhaust her once more so she moves to Bellum Church."),
      ],
    },
    {
      after: "Meet Thops at Church of Irith",
      steps: [
        step("Find Diallos beside Lanya in Academy Gate Town", "From Academy Gate Town grace, go north-northwest across the flooded rooftops to find Diallos over Lanya's body. Exhaust him here, then return to Roundtable Hold and exhaust his new dialogue before joining Volcano Manor."),
        step("Meet Rya and recover her necklace without killing Boggart", "Meet Rya in the pavilion east of Scenic Isle. Speak to Blackguard Big Boggart at Boilprawn Shack, buy Rya's Necklace for 1,000 runes, buy at least one Boiled Prawn to preserve his Dung Eater route, then return the necklace to Rya and exhaust her invitation."),
        step("Meet Patches at Scenic Isle", "After sparing Patches in Murkwater Cave, speak to him at Scenic Isle and exhaust his dialogue about Raya Lucaria and Volcano Manor before travelling to Mt. Gelmir."),
      ],
    },
    {
      after: "Find Albus and collect Haligtree Secret Medallion (Right)",
      steps: [
        step("Defeat Ensha and speak to Gideon about the medallion", "Return to Roundtable Hold after taking Albus's medallion half. Defeat Ensha when he invades, collect the Royal Remains set outside Gideon's room, then speak to Gideon about Ensha and the Albinaurics."),
        step("Speak to Nepheli at the Village and defeat the Omenkiller", "Find Nepheli beneath the stone bridge on the approach to the Village of the Albinaurics and exhaust her dialogue. Defeat the Omenkiller, then speak to Nepheli downstairs at Roundtable Hold and speak to Gideon about her despair."),
      ],
    },
    {
      after: "Accept Latenna's request and receive her spirit ashes",
      steps: [
        step("Defeat Edgar the Revenger and keep his Shabriri Grape", "After completing Irina and Edgar at Castle Morne, visit Revenger's Shack in western Liurnia. Rest at the grace and defeat Edgar when he invades; keep the Shabriri Grape for Hyetta's later route."),
      ],
    },
  ],
  academy: [
    {
      after: "Use Yura's red summon sign on the Main Academy Gate bridge",
      steps: [
        step("Speak to Yura after the Ravenmount Assassin", "After helping Yura through the red sign north of Main Academy Gate, find him on the bridge near the summon sign and exhaust his dialogue. Collect his Smithing Stone [5] and Ash of War: Raptor of the Mists reward before leaving."),
      ],
    },
    {
      after: "Give the spare key to Thops and recover Thops's Barrier afterward",
      steps: [
        step("Loot Thops at Schoolhouse Classroom", "Reload after giving Thops the spare key, travel to Schoolhouse Classroom, exit toward the waterwheel and loot Thops's body for his Bell Bearing, Academy Glintstone Staff and Thops's Barrier sorcery. Return to Church of Irith for the optional scarab that drops the matching Ash of War."),
      ],
    },
  ],
  caria: [
    {
      before: "Clear Black Knife Catacombs and give the Black Knifeprint to Rogier",
      steps: [
        step("Defeat Vyke and give Hyetta the Fingerprint Grape", "Defeat Festering Fingerprint Vyke outside Church of Inhibition, then meet Hyetta at Bellum Church and give her the Fingerprint Grape. Exhaust her dialogue; she next appears beneath Leyndell after Mohg, the Omen."),
      ],
    },
    {
      after: "Exhaust Rogier before joining Ranni",
      steps: [
        step("Report Ranni's cursemark identity to Rogier", "After Ranni turns you away or after discussing the Black Knifeprint, return to Rogier and exhaust his plan to enter Ranni's service. Revisit Ranni, join her, then later reload Roundtable Hold until Rogier dies and collect his Bell Bearing, Spellblade Set and letter."),
      ],
    },
    {
      after: "Speak to Ranni and all three retainers",
      steps: [
        step("Return upstairs to Ranni before leaving Three Sisters", "After speaking to the spectral Blaidd, Iji and Seluvis below the tower, return to Ranni at the top and exhaust her dialogue. The barrier around the tower will not clear until all required conversations are complete."),
      ],
    },
  ],
  caelid: [
    {
      before: "Use the sending gate at Impassable Greatbridge",
      steps: [
        step("Meet Alexander inside Gael Tunnel before the festival", "Enter Gael Tunnel from the Caelid side, open the small door beside Alexander and exhaust his dialogue about the festival. Defeating the Magma Wyrm is optional for his quest; use the rear exit if the party is not ready."),
      ],
    },
  ],
  altus: [
    {
      after: "Rest at Altus Plateau grace and revisit Roundtable quest NPCs",
      steps: [
        step("Tell Corhyn where to find Goldmask", "After Corhyn announces his departure from Roundtable, find him north of Altus Highway Junction near the map pillar and exhaust him. Find Goldmask on the broken Forest-Spanning Greatbridge, return to Corhyn with the location, reload, then exhaust both together on the bridge."),
        step("Meet Boc at Altus Highway Junction", "Rest at Altus Highway Junction and exhaust Boc beside the grace. This records his move before the final East Capital Rampart step."),
      ],
    },
    {
      before: "Collect Amber Starlight north-east of Altus Highway Junction",
      steps: [
        step("Meet Yura at the Second Church and defeat Eleonora", "From Altus Highway Junction, reach the Second Church of Marika, speak to the dying Yura and take Nagakiba, then defeat Eleonora's invasion. Keep the Purifying Crystal Tear for Mohg and exhaust the invasion reward screen before leaving."),
      ],
    },
  ],
  gelmir: [
    {
      before: "Join Volcano Manor and take the Drawing-Room Key",
      steps: [
        step("Let Patches kick you from the First Mt. Gelmir Campsite", "From First Mt. Gelmir Campsite, follow the rainbow stones west to Patches at the cliff edge. Let the scene play, then return to Patches and exhaust his dialogue before entering Volcano Manor."),
        step("Use Rya's invitation to enter Volcano Manor", "If Rya's necklace was returned, meet her at the top of the Grand Lift of Dectus and accept her transport to Volcano Manor. If she is at Lux Ruins because the lift was bypassed, use that location instead."),
      ],
    },
    {
      after: "Advance Diallos and Rya dialogue",
      steps: [
        step("Speak to every Manor resident after each contract", "After each Tanith contract, exhaust Tanith, Rya, Diallos, Bernahl and Patches before taking the next letter. Their dialogue advances independently and several rewards disappear when Rykard dies."),
      ],
    },
    {
      remove: ["Move Sellen's primal glintstone and resolve the Sellen or Jerren summon signs"],
      after: "Show Comet Azur to Sellen and find Master Lusat in Sellia Hideaway",
      steps: [
        step("Return to Sellen after finding Lusat", "Return to Sellen at Waypoint Ruins after receiving Stars of Ruin from Lusat. Exhaust her dialogue and collect the Starlight Shard reward before continuing her body-transfer request."),
        step("Take Sellen's primal glintstone at Witchbane Ruins", "After Radahn is defeated, speak to Sellen at Waypoint Ruins, then meet her restrained body below Witchbane Ruins in the Weeping Peninsula. Exhaust her and take Sellen's Primal Glintstone."),
        step("Exhaust Jerren at Redmane and Witchbane Ruins", "Return to Redmane Castle after the festival, speak to Jerren in the throne room until he announces his departure, reload, then meet him beside Sellen's body in Witchbane Ruins and exhaust him."),
        step("Insert Sellen's glintstone into the hidden puppet", "At the ruins between Ranni's Rise and Renna's Rise, reveal the illusory floor and the second illusory wall, then insert the Primal Glintstone into Sellen's puppet body."),
        step("Choose Sellen or Jerren outside Rennala's library", "Outside Raya Lucaria Grand Library, choose one summon sign. Gold helps Sellen and preserves her sorcery rewards; red helps Jerren and gives an Ancient Dragon Smithing Stone. After the fight, exhaust the survivor, reload the library and revisit Azur and Lusat for any available armour sets."),
      ],
    },
  ],
  leyndell: [
    {
      before: "Defeat Morgott",
      steps: [
        step("Optional: finish Hyetta beneath Leyndell", "Defeat Mohg, the Omen in the Subterranean Shunning-Grounds, strike the altar behind his chest and descend the hidden platforming route to Frenzied Flame Proscription. Hyetta waits beside the sealed door. Only remove all armour and accept the Three Fingers if deliberately completing her Frenzied Flame Seal branch; this locks the ending until Miquella's Needle is used in Placidusax's arena. After the embrace, exhaust Hyetta for the seal."),
      ],
    },
    {
      before: "Defeat Morgott",
      steps: [
        step("Speak to Melina at East Capital Rampart", "Rest at East Capital Rampart and exhaust Melina's departure dialogue before continuing through Leyndell. Her summon sign is later available outside Morgott's arena if wanted."),
      ],
    },
    {
      after: "Finish Nepheli and Kenneth, then reload Godrick's throne room with Gostoc alive",
      steps: [
        step("Collect the Nepheli and Gostoc throne-room rewards", "After Morgott is dead and both Nepheli and Kenneth have completed their earlier steps, rest at Godrick the Grafted grace, walk into the throne room and exhaust Nepheli and Kenneth. Nepheli gives an Ancient Dragon Smithing Stone; buy a second one from Gostoc if he is alive."),
      ],
    },
  ],
  ainsel: [
    {
      before: "Take the Miniature Ranni and exhaust dialogue at three graces",
      steps: [
        step("Use Renna's Rise waygate and collect Miniature Ranni", "After giving Ranni the Fingerslayer Blade, reload Three Sisters until Renna's Rise opens. Use its waygate to Ainsel River Main, collect Miniature Ranni from the coffin near the grace, then choose 'Talk to miniature Ranni' repeatedly at the grace until she answers."),
      ],
    },
    {
      remove: ["Collect Dark Moon Greatsword and exhaust Iji, Blaidd and Ranni aftermath dialogue"],
      after: "Collect Dark Moon Greatsword and exhaust Iji, Blaidd and Ranni aftermath dialogue",
      steps: [
        step("Collect the Dark Moon Greatsword", "After placing the Dark Moon Ring on Ranni's finger, wait for her scene to finish and collect the Dark Moon Greatsword where she was sitting before leaving the cavern."),
        step("Resolve Blaidd and Iji's aftermath", "Return to Ranni's Rise, defeat the hostile Blaidd outside and collect his equipment. Speak to Iji about Blaidd, reload Road to the Manor and collect Iji's Bell Bearing and helm from his body. Return to Ranni's chamber grace for her final doll dialogue."),
      ],
    },
  ],
  mountaintops: [
    {
      after: "Meet Corhyn and Goldmask on the bridge south of Stargazers' Ruins",
      steps: [
        step("Give Goldmask the Law of Regression revelation", "If not already completed in Leyndell, cast Law of Regression before Radagon's statue and tell Goldmask that Radagon is Marika. In the Mountaintops, exhaust Goldmask and Corhyn on the bridge south of Stargazers' Ruins before using the Forge."),
        step("Reunite the Spirit Jellyfish sisters at Stargazers' Ruins", "At Stargazers' Ruins, summon Roderika's Spirit Jellyfish Ashes beside the speaking jellyfish. Wait for their dialogue and disappearance, then open the newly unsealed cellar for the Primal Glintstone Blade."),
      ],
    },
  ],
  rykard: [
    {
      remove: ["Advance Diallos to Jarburg and exhaust Jar-Bairn"],
      before: "Defeat Rykard",
      steps: [
        step("Start Jar-Bairn's quest in Jarburg", "Drop down the eastern Liurnia cliff slabs into Jarburg, rest at the grace and exhaust Jar-Bairn repeatedly, reloading until he asks you to become Potentate. Answer that you will, then explain your hands are not smooth when the option appears."),
        step("Move Diallos to Jarburg and exhaust both jars", "After Diallos leaves Volcano Manor, reload Jarburg until he appears in a hut. Alternate between Diallos and Jar-Bairn, resting between dialogue changes, until both repeat themselves."),
      ],
    },
    {
      after: "Defeat Rykard",
      steps: [
        step("Finish Diallos and Jar-Bairn after the poacher attack", "Return to Jarburg after Rykard and reload until the poacher attack occurs. Speak to the dying Diallos, tell him he defended the jars, reload and collect his gear, then exhaust Jar-Bairn until he leaves."),
        step("Give Alexander's Innards to Jar-Bairn", "After Alexander's Farum Azula duel, return to Jarburg, give his Innards to Jar-Bairn, exhaust the dialogue and reload to collect the Companion Jar talisman."),
      ],
    },
  ],
  haligtree: [
    {
      after: "Return to Millicent after reloading and recover the Unalloyed Gold Needle",
      steps: [
        step("Finish Gowry after Millicent's quest", "Return to Gowry's Shack after recovering Millicent's needle and exhaust his final dialogue. After the assisted ending, kill Gowry if he remains alive to obtain Flock's Canvas Talisman and his Bell Bearing; if he is already dead, loot both from the chair."),
      ],
    },
  ],
  gravesite: [
    {
      remove: ["Assist the friendly Forager Brood before its cookbook opportunities close"],
      after: "Meet Moore and Ansbach at Main Gate Cross",
      steps: [
        step("Optional: collect Forager Brood Cookbook 1", "Do not attack the friendly pest. Find it just west of Ruined Forge of Starfall Past along the cliff edge, interact and receive Forager Brood Cookbook [1]."),
        step("Optional: collect Forager Brood Cookbook 2", "Do not attack the friendly pest east of Prospect Town. Approach without locking on, interact and receive Forager Brood Cookbook [2]."),
        step("Optional: collect Forager Brood Cookbook 3", "From Cerulean Coast, reach the north-east corner of the lightning-ram forest near the Ellac River Furnace Golem. Interact peacefully with the pest for Forager Brood Cookbook [3]."),
      ],
    },
    {
      after: "Speak to Leda at the cocoon and enter the Realm of Shadow",
      steps: [
        step("Meet Thiollier at Pillar Path Cross", "Ride east from Castle Front to Pillar Path Cross and exhaust Thiollier's dialogue before the great rune breaks. Buy anything needed and later bring him Moore's Black Syrup."),
        step("Open Hornsent Grandam's storeroom before Dancing Lion", "In Belurat, collect the Storeroom Key from the upper waterfall path, open the locked room near Small Private Altar and exhaust Hornsent Grandam while she is still hostile. Return with the Divine Beast Head after the boss for the Watchful Spirit reward and stew dialogue."),
      ],
    },
  ],
  ensiss: [
    {
      before: "Trigger the great-rune break only after the follower check",
      steps: [
        step("Optional: heal the Forager Brood for Cookbook 4", "North of Church of the Crusade, find the shivering friendly pest. Use a Warming Stone or Sunwarmth Stone beside it, fast-travel or reload, then interact for Forager Brood Cookbook [4]. Do not attack it."),
        step("Optional: collect Forager Brood Cookbook 5", "From Moorth Ruins, take the flower-and-perfumer cave into the poisonous swamp to the north. Keep to the right cliff edge, find the friendly pest and interact for Forager Brood Cookbook [5]."),
      ],
    },
  ],
  "shadow-keep": [
    {
      before: "Choose Moore's answer only after collecting the available Forager Brood cookbooks",
      steps: [
        step("Optional: collect Forager Brood Cookbook 6", "From Church District Highroad, ride west up the cliff above the tunnel road and continue to Shadow Keep's outer eastern wall. Interact peacefully with the pest for Forager Brood Cookbook [6]."),
        step("Optional: return to Moore for Forager Brood Cookbook 7", "After collecting Cookbooks [1] through [6], return to Moore at Main Gate Cross and choose 'Talk to Moore' until he gives Forager Brood Cookbook [7]. Do this before choosing his post-rune-break fate."),
      ],
    },
  ],
  jagged: [
    {
      remove: ["Return to Igon and the Dragon Communion Priestess for both reward sets"],
      after: "Defeat Bayle the Dread",
      steps: [
        step("Loot Igon's body at Pillar Path Waypoint", "Return to Igon's original roadside location south of Pillar Path Waypoint after Bayle. Loot his body for Igon's Greatbow, armour and bell bearing."),
        step("Collect the chosen Dragon Communion Priestess reward", "Return to the Grand Altar. If no concoction was given, exhaust the Priestess for the Flowerstone Gavel and Priestess Heart. If Thiollier's Concoction was given at night, exhaust her for Dragonbolt of Florissax and the Ancient Dragon Florissax spirit ash instead. These outcomes are mutually exclusive in one world."),
      ],
    },
  ],
  metyr: [
    {
      after: "Ring the Finger Ruins of Rhia bell",
      steps: [
        step("Report the Rhia bell and speak to Jolan", "Return to Cathedral of Manus Metyr, report to Ymir for Beloved Stardust and the second map, then exhaust Jolan by the pillar. Repeat the Jolan check after each later bell."),
      ],
    },
    {
      remove: ["Defeat Ymir and Jolan's invasion", "Choose Jolan's Iris reward before leaving the cathedral"],
      after: "Ring the Miyr bell and defeat Metyr",
      steps: [
        step("Defeat Swordhand of Night Jolan and Count Ymir", "Return to the cathedral after Metyr. Defeat Jolan when she invades, then defeat Count Ymir when he appears. Reload the cathedral and collect Ymir's Bell Bearing and equipment from the throne."),
        step("Choose Jolan's Iris reward", "Find the wounded Jolan at her usual pillar. Iris of Grace gives the Swordhand of Night Jolan spirit ash; Iris of Occultation gives the Sword of Night. The choice is permanent in this world."),
        step("Optionally unite Jolan and Anna's spirit ashes", "If Jolan's spirit ash was chosen, reach Rabbath's Rise from Shaman Village, drop to Anna's hidden puppet body and interact to create the Jolan and Anna spirit ash. The combined ash can be separated again at the same body."),
      ],
    },
  ],
  enir: [
    {
      after: "Defeat Promised Consort Radahn",
      steps: [
        step("Collect Ansbach and Thiollier's finale rewards", "Reload the final arena entrance after the boss. If their quests were completed, loot Ansbach's body for the Obsidian Lamina, Furious Blade of Ansbach and his set, and loot Thiollier's body for Thiollier's Hidden Needle and his set."),
        step("Return to St. Trina after Miquella's defeat", "Fast-travel to Garden of Deep Purple after the final boss and inspect St. Trina to collect St. Trina's Blossom, completing her aftermath reward."),
      ],
    },
  ],
};

const EXISTING_QUEST_GUIDES: Record<string, string> = {
  "Collect Chrysalids' Memento for Roderika": "From Rampart Tower, cross the rooftops and reach the dining hall with the Grafted Scion. Enter the adjacent room with two dogs, take Chrysalids' Memento from the pile of bodies, then return it to Roderika at Stormhill Shack before Godrick if she has not moved.",
  "Meet Rogier in the chapel and inspect the corpse below Stormveil": "Find Rogier in Stormveil's chapel and exhaust him. From Liftside Chamber, take the hidden ledge route into the depths, defeat the Ulcerated Tree Spirit, inspect the giant corpse and touch the nearby bloodstain showing Rogier before reporting to him at Roundtable Hold.",
  "Move Roderika to Roundtable Hold and unlock spirit tuning": "At Roundtable Hold, ask Hewg about Roderika, speak to Roderika by the fireplace, then return to Hewg and ask him to watch over her. Reload the hold and exhaust both until Roderika sits opposite Hewg as a Spirit Tuner.",
  "Use Yura's red summon sign on the Main Academy Gate bridge": "From Main Academy Gate grace, walk north through the seal without activating it and continue to the first break in the bridge. Use Yura's red sign, help him defeat the Ravenmount Assassin, then speak to Yura on the bridge for Raptor of the Mists and Smithing Stone [5].",
  "Exhaust Rogier before joining Ranni": "After giving Rogier the Black Knifeprint, exhaust him until he asks you to locate Ranni's cursemark. Speak to Ranni, return to Rogier with her response, then follow his suggestion to enter her service. Joining Ranni before this dialogue can skip parts of Rogier's investigation but does not block Ranni.",
  "Speak to Ranni and all three retainers": "At Ranni's Rise, accept Ranni's service, then go downstairs and exhaust the spectral Iji, Blaidd and Seluvis. Return upstairs and exhaust Ranni again; the tower barrier clears only after every required conversation is complete.",
  "Meet Blaidd in Siofra": "Enter Siofra River Well in Mistwood, follow the river north past the Ancestral Woods pillars and find Blaidd at the eastern cliff edge overlooking the broken bridge. Exhaust his dialogue about Nokron before returning to Seluvis.",
  "Return to Blaidd in Siofra and exhaust his dialogue": "After showing Seluvis's letter to Sellen and learning Radahn halts the stars, return to Blaidd at his Siofra cliff position and exhaust him. He directs you to the Radahn Festival and the Redmane sending gate becomes the intended route.",
  "Speak to Jerren in Redmane Plaza to begin the festival": "Use the Impassable Greatbridge waygate, enter Redmane Plaza and exhaust Jerren on the platform. Choose that you are ready when prepared; the cutscene opens the church lift to the Wailing Dunes.",
  "Exhaust Alexander and Blaidd in the Wailing Dunes before leaving": "After Radahn, activate Starscourge Radahn grace, find Alexander scavenging south-east of the grace and Blaidd north of it, and exhaust both. Reload only after both repeat themselves so their Liurnia/Ranni states advance.",
  "Rest at Altus Plateau grace and revisit Roundtable quest NPCs": "After first resting in Altus, return to Roundtable Hold. Exhaust Corhyn before/after his departure, Fia for the Weathered Dagger when available, Gideon, D, Nepheli, Enia and the Dung Eater projection before continuing.",
  "Do not give Ranni the Amber Draught": "After Seluvis gives the Amber Draught, keep it in inventory and never administer it to Ranni. Doing so makes Ranni hostile and requires absolution; it provides no route reward and can disrupt her progression.",
  "Reload, find Rya in the side room and settle the Tonic of Forgetfulness decision": "After giving Rya the Serpent's Amnion, reload, take Tanith's Tonic and reach Rya's hiding room beyond Temple of Eiglay. For her complete reward, do not kill her and do not give the tonic; exhaust her, defeat Rykard, then return for Daedicar's Woe and Zorayas's Letter. Giving the tonic is the alternate ending and killing her ends the quest immediately.",
  "Show Comet Azur to Sellen and find Master Lusat in Sellia Hideaway": "Show Comet Azur to Sellen at Waypoint Ruins, accept her request and receive the Sellian Sealbreaker. In Sellia Hideaway, cross the crystal caverns, open the sealed chamber and interact with Lusat for Stars of Ruin, then report back to Sellen.",
  "Confirm at least two Great Runes are obtained": "Open the Key Items tab and confirm two Great Runes have been acquired, normally Godrick's and Rennala's or Radahn's. Speak to Enia at Roundtable Hold after the second; the capital seal beyond Draconic Tree Sentinel will then open.",
  "Tell Goldmask that Radagon is Marika": "After casting Law of Regression before the statue west of Erdtree Sanctuary, read the revealed message, return to Goldmask and Corhyn near the colosseum and choose 'Radagon is Marika'. Exhaust both and collect the Immutable Shield reward from Corhyn.",
  "Finish Nepheli and Kenneth, then reload Godrick's throne room with Gostoc alive": "Verify Nepheli received the Stormhawk King, Kenneth reached Fort Haight's battlements, Morgott is dead and Gostoc was not killed. Rest at Godrick the Grafted grace, reload once if necessary, then enter the throne room and exhaust all three NPCs.",
  "Exhaust Fia's dialogue and reload": "After giving Fia the Cursemark at Prince of Death's Throne, let her hold you and exhaust every option. Rest or reload repeatedly until she is asleep, then interact with her to enter the Deathbed Dream.",
  "Finish Rya's dialogue and choice": "Before Rykard, find Rya in her Temple of Eiglay side room and make the selected tonic decision. For the full letter and talisman ending, leave her alive without the tonic, defeat Rykard, return and exhaust her, then reload for Zorayas's Letter and Daedicar's Woe.",
  "Collect Bernahl, Patches and Tanith contract rewards": "Before asking Tanith for Rykard, confirm Bernahl paid Gelmir's Fury and the Raging Wolf Set, Patches paid the Magma Whip Candlestick after a reload, and Tanith paid every Istvan, Rileigh and Juno reward. Rykard makes the residents leave.",
  "Return the needle to Malenia's bloom for Miquella's Needle": "After Malenia, reload the boss arena and interact with the large scarlet bloom while carrying the Unalloyed Gold Needle. Receive Miquella's Needle and a Somber Ancient Dragon Smithing Stone; keep the needle for the optional Frenzied Flame cure in Placidusax's arena.",
  "Speak to Melina at the Forge and commit to the cardinal sin": "After every pre-Forge safety check, rest at Forge of the Giants and choose to listen to the flame. Confirm the cardinal-sin prompt only when ready; this moves the run to Crumbling Farum Azula and advances Roundtable/NPC states.",
  "Collect Goldmask's Mending Rune of Perfect Order below the colosseum": "In Ashen Capital, follow the path beneath the colosseum to Goldmask's body and take the Mending Rune of Perfect Order. Reload and return to collect Goldmask's Set before the finale.",
  "Choose ending; do not start Journey 2": "After Elden Beast, activate the desired summon sign or interact with Marika and choose the intended mending rune. After the ending, decline 'Begin Journey 2' at Roundtable Hold so the DLC and unfinished pickups remain accessible.",
  "Confirm Radahn and Mohg are defeated": "Verify Starscourge Radahn and Mohg, Lord of Blood are dead. Both are mandatory DLC access conditions; Mohg's arena must contain Miquella's cocoon and the withered arm interaction.",
  "Speak to Leda at the cocoon and enter the Realm of Shadow": "After Mohg and Radahn, exhaust Leda beside Miquella's cocoon, interact with the withered arm and accept transport. Activate Gravesite Plain grace before continuing so the party can return safely.",
  "Finish Moore, Thiollier, Freyja, Hornsent and Ansbach dialogue": "Before approaching the rune-break boundary, revisit Main Gate Cross, Pillar Path Cross and Three-Path Cross. Exhaust Moore, Thiollier, Freyja, Hornsent and Ansbach until every line repeats and secure Black Syrup/Thiollier's Concoction.",
  "Revisit every follower before any rune-break boundary": "Make one final pre-break circuit of Leda, Hornsent, Freyja, Moore, Ansbach and Thiollier. Do not ride toward Shadow Keep, cross Bonny Village's eastern bridges or enter Rauh Base until the pre-break conversations and available cookbook steps are complete.",
  "Return to Ymir and exhaust both characters' dialogue": "After ringing the Dheo bell, return to Cathedral of Manus Metyr and exhaust Ymir for the third map and rewards, then exhaust Jolan at her pillar. Rest until Ymir leaves the throne before inspecting it.",
  "Inspect Ymir's empty throne and defeat Swordhand of Night Anna": "When Ymir leaves, interact with the throne to reveal the ladder into Finger Ruins of Miyr. Descend and defeat Recusant Swordhand of Night Anna when she invades, then continue to the final hanging bell.",
  "Confirm the Leda, Hornsent and Ansbach invasion choices are resolved": "Before Romina, verify the Leda-Hornsent bridge signs and Leda-Ansbach Storehouse signs are gone and their rewards were collected. Unresolved signs can disappear when Messmer or the sealing tree advances the faction quest.",
  "Confirm Moore's answer and resulting location are known": "Record Moore's post-break answer: 'Put it behind you' sends him to Leda's Enir-Ilim battle, 'Remain sad forever' sends his body near Church of the Crusade, and 'I don't know' leaves him at Main Gate Cross. Collect the reward at that resulting location later.",
  "Defeat Leda and her allies": "At Cleansing Chamber Anteroom, summon eligible allies and enter Leda's arena. Defeat each opposing follower, then loot the arena for Leda's Sword and every fallen follower's available equipment before climbing onward.",
  "Summon eligible allies for their quest rewards": "Use Ansbach and Thiollier in Leda's battle and/or the final boss if their signs are present. Their quest rewards are obtained from their bodies near the final arena entrance after Promised Consort Radahn, so reload and loot both afterward.",
  "Optional no-boss Fort Faroth detour: take the waygate behind Third Church to Bestial Sanctum, ride south and loot Radagon's Soreseal via the fort's roof-to-rafters route": "This is optional. Take the waygate behind Third Church to Bestial Sanctum, ride south past the bridge and dragons to Fort Faroth, run past the bats, climb the ladder, drop through the roof opening and follow the rafters to the corpse holding Radagon's Soreseal. Fast-travel out without fighting the fort enemies. The talisman adds 5 VIG, END, STR and DEX but increases damage taken by 15%; equip it only while the stat gain is worth that penalty and remove it once natural requirements are met.",
  "Meet Boc south-east of Agheel Lake North": "From Agheel Lake North, follow the road south-east and listen for a voice beside the small grove. Roll into or strike the talking red-leaf bush to reveal Boc, then exhaust his dialogue and take the mushrooms he offers.",
  "Meet Roderika at Stormhill Shack": "Follow the main road north through Gatefront to Stormhill Shack. Activate the grace and exhaust Roderika's dialogue; continue until she gives both the Sitting Sideways gesture and Spirit Jellyfish Ashes.",
  "Clear Coastal Cave and return Boc's Sewing Needle": "Speak to Boc beside Coastal Cave grace, defeat both Demi-Human Chiefs, take the Sewing Needle and Tailoring Tools, then return to Boc without leaving the cave and give him the needle. Exhaust him afterward.",
  "Defeat Darriwil with Blaidd at Forlorn Hound Evergaol, then speak to Blaidd for the finite Somber Smithing Stone [2]": "After hearing Blaidd howl in Mistwood, ask Kale at Church of Elleh about it and use the Finger Snap gesture beneath Mistwood Ruins to meet Blaidd. At Forlorn Hound Evergaol, use Blaidd's gold sign, defeat Bloodhound Knight Darriwil, then speak to Blaidd outside for Somber Smithing Stone [2] and Iji's introduction.",
  "Speak to Irina before entering Castle Morne": "Immediately south of Bridge of Sacrifice, find Irina beside the road. Exhaust her dialogue and accept Irina's Letter before entering Castle Morne; this is also the prerequisite for Hyetta's first appearance in Liurnia.",
  "Give Irina's letter to Edgar before the boss": "From Castle Morne Lift, cross the courtyard, climb the western ramparts and drop to the north-east tower where Edgar sits. Give him Irina's Letter and exhaust him before fighting Leonine Misbegotten.",
  "Return to Irina and Edgar before leaving": "After showing Edgar the Grafted Blade Greatsword, return to Irina's roadside location north of Bridge of Sacrifice. Speak to Edgar beside her body until his dialogue repeats; his next encounter is the Revenger's Shack invasion in western Liurnia.",
  "Meet Hyetta and give her the first Shabriri Grape": "At Lake-Facing Cliffs, give Hyetta the Shabriri Grape found below Stormveil and exhaust her dialogue for the As You Wish gesture. She appears only after Irina's quest has been started.",
  "Meet Thops at Church of Irith": "Enter Church of Irith immediately west of Lake-Facing Cliffs. Speak to Thops, donate 10 runes and exhaust every academy topic; do not try to give him the Academy entrance key.",
  "Accept Latenna's request and receive her spirit ashes": "After Albus gives the right medallion half, clear Lakeside Crystal Cave and exit through the rear to Slumbering Wolf's Shack. Show Latenna the medallion, promise to take her to the Haligtree and exhaust her until she becomes Latenna the Albinauric spirit ash.",
  "Meet Varre at Rose Church and choose that the Fingers seemed off": "After the Two Fingers audience, meet Varre outside Rose Church, exhaust him and answer that the Fingers seemed off. Accept five Festering Bloody Fingers; do not attack him.",
  "Soak the Lord of Blood's Favor in maiden blood and return to Varre": "Use the corpse at Church of Inhibition or Chapel of Anticipation for maiden blood; do not kill Irina or Hyetta. Return the bloodied Favor to Varre, let him anoint the finger, exhaust him and receive both the Bloody Finger and Pureblood Knight's Medal.",
  "Give the spare key to Thops and recover Thops's Barrier afterward": "Take the second Academy Glintstone Key from the chandelier reached across Raya Lucaria's rooftops. Give that spare key to Thops at Church of Irith, collect the Erudition gesture, reload, then find his body outside Schoolhouse Classroom for his staff, Bell Bearing and Barrier sorcery.",
  "Clear Black Knife Catacombs and give the Black Knifeprint to Rogier": "Ride north-east from Ruined Labyrinth to Black Knife Catacombs. Reveal the hidden wall at the end of the guillotine-riding route, defeat the Black Knife Assassin, take the Black Knifeprint to Rogier at Roundtable Hold and exhaust his explanation.",
  "Use the Four Belfries return waygate and collect the Stormhawk King": "Take the Imbued Sword Key at The Four Belfries and use it on the 'Precipice of Anticipation' waygate. Defeat the Grafted Scion, return to the chapel, open the side door and climb to the roof for the Stormhawk King; also collect the Stormhawk Deenh ashes inside.",
  "Do not attack Seluvis or any quest NPC": "Keep all named NPCs alive. If an NPC has become hostile accidentally, stop progressing their route and seek absolution with Celestial Dew at Church of Vows; absolution cannot revive a dead NPC.",
  "Give the needle to Gowry, reload, then give the repaired needle to Millicent": "Take the broken needle from Commander O'Neil to Gowry's Shack, exhaust Gowry, rest at a grace and collect the repaired needle. Give it to Millicent at Church of the Plague, then rest before speaking to her again.",
  "Reload Church of the Plague, exhaust Millicent, then revisit Gowry's Shack": "Rest after giving Millicent the needle, exhaust her standing dialogue in Church of the Plague, reload, then return to Gowry's Shack and exhaust her there. Reload again and speak to Gowry after he returns.",
  "Collect Fingerslayer Blade but do not give it to Ranni": "Cross Nokron's rooftops to Night's Sacred Ground and open the chest beneath the giant corpse for the Fingerslayer Blade. Keep it in inventory until the route has secured Seluvis's Magic Scorpion Charm; handing it to Ranni kills Seluvis and ends his rewards.",
  "Finish Seluvis's potion and puppet steps unless delaying for Dung Eater Puppet": "Choose the intended potion recipient before advancing Ranni. The safe Nepheli route is to show the potion to Gideon and let him dispose of it. Then find Seluvis's hidden puppet cellar, confront him, buy a puppet, reload the area and ask for another puppet before offering Amber Starlight.",
  "Give Amber Starlight to Seluvis and collect Magic Scorpion Charm": "After completing Seluvis's potion and puppet requirement, give him the Amber Starlight. Reload and exhaust him to receive the Magic Scorpion Charm. Do this before giving Ranni the Fingerslayer Blade.",
  "Give Fingerslayer Blade to Ranni only after the selected Seluvis outcome": "Once Magic Scorpion Charm or the chosen puppet outcome is safely obtained, give the Fingerslayer Blade to Ranni at Ranni's Rise. Exhaust her and receive the Carian Inverted Statue; this opens Renna's Rise after a reload.",
  "Receive the Carian Inverted Statue from Ranni": "Remain at Ranni's Rise after handing over the Fingerslayer Blade and exhaust Ranni until the Carian Inverted Statue appears in inventory. Do not leave before the reward prompt has completed.",
  "Give the prosthesis to Millicent at Erdtree-Gazing Hill": "Find Millicent just north of Erdtree-Gazing Hill grace, give her Valkyrie's Prosthesis and exhaust her dialogue. She then becomes available at Windmill Village after the Godskin Apostle.",
  "Defeat the Godskin Apostle at Windmill Village and speak to Millicent": "Climb Dominula to defeat the Godskin Apostle, activate Windmill Heights grace, rest or reload, then find Millicent beside the grace and exhaust her before entering the Mountaintops.",
  "Join Volcano Manor and take the Drawing-Room Key": "Speak to Tanith at Volcano Manor, choose to join and receive the Drawing-Room Key. Open the western drawing room, take the Recusant Finger and first letter, then exhaust Rya, Diallos, Bernahl and Patches before doing a contract.",
  "Defeat Magma Wyrm Makar and complete Patches' Tragoth request": "After completing Tanith's first contract, take Patches' letter. Defeat Magma Wyrm Makar at Ruin-Strewn Precipice if still alive, rest at its grace, use the red sign to invade Great Horned Tragoth, then report to Patches, reload and ask again for the Magma Whip Candlestick.",
  "Advance Diallos and Rya dialogue": "After each of the first two Manor contracts, exhaust Diallos and Rya in their rooms and reload the manor. Check Rya's alternate form and the hidden wall in the first drawing-room room before defeating Godskin Noble.",
  "Collect Serpent's Amnion and give it to Rya": "After Godskin Noble, take Serpent's Amnion from the altar, return it to Rya and exhaust her. Reload, speak to Tanith about Rya's absence, take the Tonic of Forgetfulness and find Rya in the side room reached beyond Temple of Eiglay.",
  "Meet Primeval Sorcerer Azur and receive Comet Azur": "Cross Hermit Village in Mt. Gelmir to Primeval Sorcerer Azur beside the grace. Interact until Comet Azur is received, then return to Sellen at Waypoint Ruins and show it to her.",
  "Return to Bernahl for Gelmir's Fury": "After helping Bernahl defeat Vargram and Wilhelm in Fortified Manor, return to Bernahl in Volcano Manor and exhaust him. Collect Gelmir's Fury and the Raging Wolf Set before Rykard causes the residents to leave.",
  "Take the Miniature Ranni and exhaust dialogue at three graces": "Collect Miniature Ranni beside Ainsel River Main grace. At Ainsel River Main, Nokstella and Nokstella Waterfall Basin, repeatedly select 'Talk to miniature Ranni' until all dialogue repeats; the first response takes three attempts.",
  "Give Ranni the Dark Moon Ring beneath Cathedral of Manus Celes": "After Astel, use the ring to pass the sealed barrier, ride to Cathedral of Manus Celes, descend the hole inside and place the Dark Moon Ring on Ranni's finger. Wait for the full scene and collect the Dark Moon Greatsword where she was sitting.",
  "Collect Dark Moon Greatsword and exhaust Iji, Blaidd and Ranni aftermath dialogue": "Take the Dark Moon Greatsword, return to Ranni's chamber grace and speak to the miniature doll. Then resolve hostile Blaidd outside Ranni's Rise and Iji at Road to the Manor, reloading each location for their final drops.",
  "Defeat the Valiant Gargoyles and give D's brother the Twinned Set": "In Siofra Aqueduct, find D's silent brother before the gargoyle fog and give him the complete Twinned Set taken from D. Defeat both Valiant Gargoyles, rest in the coffin at the waterfall and enter Deeproot Depths.",
  "Defeat Fia's Champions": "Cross Deeproot to Prince of Death's Throne and defeat every wave of Fia's Champions. Activate the grace, speak to Fia and choose that you want to be held rather than rejecting her.",
  "Give Fia the Cursemark of Death": "At Prince of Death's Throne, let Fia hold you, exhaust her and give the Cursemark taken from Divine Tower of Liurnia. Reload until she is asleep and the deathbed-dream interaction appears.",
  "Reload Fia and D's brother for the Mending Rune and Twinned Set": "After Fortissax, reload beside Fia and take the Mending Rune of the Death-Prince. Reload again for D's brother, exhaust him, then reload once more to recover the Twinned Set, Inseparable Sword and Fia's Hood/robe pieces.",
  "Meet Millicent at Ancient Snow Valley Ruins": "Rest at Ancient Snow Valley Ruins, find Millicent beside the grace and exhaust her dialogue about the Haligtree and Malenia before visiting Castle Sol.",
  "Meet Corhyn and Goldmask on the bridge south of Stargazers' Ruins": "From Ancient Snow Valley Ruins, ride to the high bridge south of Stargazers' Ruins. Exhaust Corhyn and Goldmask there after telling Goldmask the Radagon revelation in Leyndell; do this before the Forge.",
  "Complete Shabriri and Yura decisions without inheriting the Frenzied Flame by accident": "Speak to Shabriri at Zamor Ruins for his dialogue and the location of Yura's armour. Do not open the Three Fingers door beneath Leyndell unless deliberately choosing Frenzied Flame; entering naked locks the ending until Miquella's Needle is used in Placidusax's arena.",
  "Do not use the Forge until the quest safety check is complete": "Stop at Forge of the Giants. Confirm Corhyn/Goldmask, Dung Eater, Latenna, Volcano Manor, Melina dialogue and every original-Leyndell pickup listed by the route before selecting the forge dialogue.",
  "Reload Rykard's arena for Tanith and finish Patches at Shaded Castle and Murkwater Cave": "After Rykard, reload his arena and speak to Tanith. Find Patches on the bridge before Elemer at Shaded Castle for Dancer's Castanets, give them to Tanith if desired, then return to Murkwater Cave, fight Patches only until he surrenders, accept it and reload to reopen his shop.",
  "Meet Millicent at the Prayer Room": "After Loretta, descend into Elphael to Prayer Room grace and exhaust Millicent nearby. Do this before killing the Drainage Channel Ulcerated Tree Spirit.",
  "Return to Millicent after reloading and recover the Unalloyed Gold Needle": "After helping Millicent via the gold sign, speak to her beside the rot pool, reload once and take the Unalloyed Gold Needle from her body. Do not drop onto or kill her directly, which prevents the needle reward.",
  "Speak to Varre at Dynasty Mausoleum Midpoint and invade him": "Near Dynasty Mausoleum Midpoint, use Varre's red invasion sign, defeat him in his world, then continue forward and speak to the wounded Varre on the floor. Exhaust him and reload to collect Varre's Bouquet.",
  "Confirm Goldmask's Mountaintops message and every original-capital pickup are complete": "Before using the Forge or defeating Maliketh, verify Goldmask and Corhyn were exhausted on the Mountaintops bridge and that Bolt of Gransax, Coded Sword, Fortified Manor rewards and the original capital Seedbed Curses are in inventory.",
  "Meet Alexander beyond the Dragon Temple Lift and finish his duel": "Spend two Stonesword Keys at Dragon Temple Lift, cross the upper ruins and fallen tower to Alexander's arena. Exhaust him, accept the duel, defeat him and take Shard of Alexander and Alexander's Innards for Jar-Bairn.",
  "Meet Freyja and Hornsent at Three-Path Cross": "At Three-Path Cross, exhaust Freyja and Hornsent separately, collect the nearby Miquella Cross note and Scadutree Fragment, then revisit both after major bosses and the great-rune break.",
  "Meet Moore and Ansbach at Main Gate Cross": "At Main Gate Cross outside Belurat, exhaust Moore and Ansbach, buy from Moore if needed, ask Ansbach about the crosses and collect the map/notes beside the grace before entering Belurat.",
  "Get Black Syrup from Moore and give it to Thiollier": "After meeting Thiollier, return to Moore and ask for something black to receive Black Syrup. Give it to Thiollier, exhaust his explanation and keep the resulting concoction for the Dragon Communion Priestess choice.",
  "Tell Thiollier you are weary of life and keep Thiollier's Concoction": "After giving Black Syrup, tell Thiollier you are weary of life. Receive Thiollier's Concoction and do not consume or discard it; it is needed for the optional Priestess reward branch.",
  "Wear the Divine Beast Head for Hornsent Grandam and give her Scorpion Stew to Hornsent": "After Dancing Lion, wear the Divine Beast Head and exhaust Grandam in the Belurat storeroom for Watchful Spirit. Rest, return for Scorpion Stew, then give the stew to Hornsent at Three-Path Cross before the great rune breaks for additional dialogue and the Furnace Visage reward later.",
  "Confirm Miquella's great rune has broken and the Fissure seal is open": "Trigger the great-rune break only after the pre-break follower sweep. Return to the sealed chasm in southern Cerulean Coast; the barrier should now be gone, allowing the descent to Stone Coffin Fissure.",
  "Buy Thiollier's remaining stock and give him the Black Syrup": "Before telling Thiollier to move south, buy any desired poison items, give him Moore's Black Syrup and obtain the concoction. After the great rune breaks, tell him St. Trina's location so he relocates to Garden of Deep Purple.",
  "Tell Thiollier St. Trina's words and defeat his invasion": "After hearing St. Trina say to kill Miquella, report the exact words to Thiollier repeatedly. Rest, return to Garden of Deep Purple and defeat Thiollier when he invades; reload and speak to him beside St. Trina.",
  "Imbibe again and exhaust Thiollier's dialogue": "After Thiollier's invasion, continue imbibing nectar until St. Trina's dialogue is exhausted, relay every line to Thiollier and exhaust him. This preserves his summon signs and post-finale equipment reward.",
  "Speak to Leda, Hornsent, Ansbach, Freyja, Moore, Thiollier and Dane after the rune breaks": "Immediately after the great-rune message, revisit Highroad Cross, Three-Path Cross, Main Gate Cross, Pillar Path Cross and Moorth Ruins. Exhaust each named follower before making Leda's targets, Moore's answer or entering Shadow Keep.",
  "Speak to Freyja on the seventh floor and then tell Ansbach about her": "Find Freyja beside the Storehouse Seventh Floor grace and exhaust her problem. Before handing over the Secret Rite Scroll, return to Ansbach on the first floor and tell him about Freyja so the letter branch remains available.",
  "Give Ansbach the Secret Rite Scroll and receive the Letter for Freyja": "Take the Secret Rite Scroll from the upper Storehouse Fourth Floor route, give it to Ansbach only after discussing Freyja, rest and return to receive Letter for Freyja.",
  "Deliver Ansbach's letter to Freyja and exhaust both characters": "Bring Ansbach's letter to Freyja on the seventh floor and exhaust her for the Golden Lion Shield. Return to Ansbach and exhaust his response before resolving Leda's Storehouse signs or defeating Messmer.",
  "Speak to Igon beside Pillar Path Waypoint": "Find Igon shouting on the road south of Pillar Path Waypoint and exhaust every line before entering Dragon's Pit. Do not kill him; his summon and rewards depend on his later finger item.",
  "Meet the Dragon Communion Priestess at the Grand Altar": "At Grand Altar of Dragon Communion, exhaust the Priestess during daytime, accept her request to kill Bayle and receive Ancient Dragon's Blessing. Decide the concoction branch before progressing the summit.",
  "Choose whether to give the Priestess Thiollier's Concoction at night": "For her spirit ash/incantation branch, pass time until night, wait for her to fall asleep and administer Thiollier's Concoction without speaking first. For Flowerstone Gavel and Priestess Heart, never administer it. The rewards are mutually exclusive per world.",
  "Speak to Igon after the two drakes fight and receive his finger": "Defeat the two fighting Jagged Peak drakes, then find Igon east of the arena and exhaust him until Igon's Furled Finger is received. Without it, his Bayle summon sign does not appear.",
  "Use Igon's summon sign inside Bayle's arena": "Cross Bayle's fog, then use Igon's gold sign on the ground just inside the arena. Summon him before defeating Bayle to hear and complete his battle sequence; the sign is not outside the fog.",
  "Meet Ymir and Jolan at the cathedral": "Enter Cathedral of Manus Metyr, exhaust Ymir for the Hole-Laden Necklace and first ruins map, buy any required sorceries, then speak to Jolan against the right-hand pillar until she repeats herself.",
  "Return to Ymir for the second ruins map": "After ringing Rhia, return to Ymir, exhaust him for Beloved Stardust and the second map, then exhaust Jolan. Do not skip the Jolan conversation between bell stages.",
  "Confirm the Leda and Hornsent bridge signs are no longer pending": "Before Messmer, return to the burning-boat bridge and verify the red/gold Leda-Hornsent signs were resolved or deliberately skipped. Entering Messmer's arena permanently removes them.",
  "Confirm Ansbach and Freyja's letter exchange is complete": "Check that Freyja received Ansbach's letter and awarded the Golden Lion Shield, and that Ansbach received the Secret Rite Scroll. If either remains in the Storehouse, finish it before Messmer.",
  "Exhaust Hornsent after the fight if he was summoned": "If Hornsent was summoned inside Messmer's arena, rest at the Dark Chamber grace and exhaust him beside the grace. This moves him to the Rauh invasion; leaving without the conversation can obscure his next state.",
  "Resolve Hornsent's Rauh invasion if his Messmer route continued": "If Hornsent survived Leda and was summoned for Messmer, ride from Church of the Bud, Main Entrance toward the scarlet-rot stairs and defeat his invasion. Collect his Falx and armour before Romina.",
  "Confirm Thiollier was invaded and heard St. Trina's final words": "Before burning the sealing tree, verify Thiollier's Garden invasion is defeated and that all St. Trina/Thiollier dialogue repeats. This makes Thiollier eligible for the Enir-Ilim summon and finale drops.",
  "Confirm Ansbach has the Secret Rite Scroll and the Freyja exchange is complete": "Before Romina, verify Ansbach received the Secret Rite Scroll, Freyja received his letter and both have left or repeat their completed dialogue. Burning the tree closes this exchange.",
  "Confirm Messmer's Kindling is in inventory": "Open the Key Items tab and verify Messmer's Kindling was awarded after Messmer. It is mandatory to burn the sealing tree after Romina; if absent, return to the Dark Chamber and confirm the boss reward state.",
};

export const QUEST_STEP_GUIDES: Record<string, string> = {
  ...EXISTING_QUEST_GUIDES,
  ...Object.fromEntries(
    Object.values(QUEST_ROUTE_PATCHES).flatMap((patches) => patches.flatMap((patch) => patch.steps.map((entry) => [entry.label, entry.detail]))),
  ),
};

export function applyQuestRoutePatches<T extends { id: string; essentials: string[] }>(chapter: T): T {
  const patches = QUEST_ROUTE_PATCHES[chapter.id];
  if (!patches) return chapter;
  const essentials = [...chapter.essentials];
  for (const patch of patches) {
    for (const label of patch.remove || []) {
      const existing = essentials.indexOf(label);
      if (existing >= 0) essentials.splice(existing, 1);
    }
    let insertion = essentials.length;
    if (patch.before) {
      const anchor = essentials.indexOf(patch.before);
      if (anchor >= 0) insertion = anchor;
    } else if (patch.after) {
      const anchor = essentials.indexOf(patch.after);
      if (anchor >= 0) insertion = anchor + 1;
    }
    essentials.splice(insertion, 0, ...patch.steps.map((entry) => entry.label));
  }
  return { ...chapter, essentials };
}
