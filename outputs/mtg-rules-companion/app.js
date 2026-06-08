const rules = [
  {
    id: "priority",
    title: "Priority and the Stack",
    refs: "CR 117, CR 405, CR 608",
    summary: "Players need priority to cast most spells or activate abilities. Objects on the stack resolve one at a time after all players pass.",
    details:
      "After a spell or ability is put on the stack, players get chances to respond. The top object resolves first. When it resolves, you follow its instructions as much as possible, then players get priority again.",
    tags: ["stack", "instant", "respond", "resolution"],
    example: "If Lightning Bolt is on the stack, a player can cast Counterspell before Bolt resolves. If everyone passes, Counterspell resolves first."
  },
  {
    id: "targets",
    title: "Targets",
    refs: "CR 115, CR 608.2b",
    summary: "Targets are chosen as a spell or ability is put on the stack. A spell checks target legality again as it resolves.",
    details:
      "If every target of a spell or ability is illegal when it tries to resolve, it does not resolve and none of its effects happen. If at least one target is still legal, it resolves and affects the legal targets it can.",
    tags: ["target", "hexproof", "ward", "protection"],
    example: "If the only target of Murder gains hexproof before Murder resolves, Murder does not resolve."
  },
  {
    id: "triggered",
    title: "Triggered Abilities",
    refs: "CR 603",
    summary: "Triggered abilities begin with when, whenever, or at. They trigger automatically and are put on the stack the next time a player would receive priority.",
    details:
      "Triggered abilities are not cast. Once triggered, removing the source usually does not remove the ability from the stack unless the ability needs information it no longer has.",
    tags: ["when", "whenever", "at", "ETB", "dies"],
    example: "A creature with 'When this enters, draw a card' still gives the draw trigger even if the creature is destroyed in response."
  },
  {
    id: "replacement",
    title: "Replacement Effects",
    refs: "CR 614, CR 616",
    summary: "Replacement effects use words like instead, with, as, skip, or enters tapped. They modify events before those events happen.",
    details:
      "Replacement effects do not use the stack. If multiple replacement effects try to change the same event, the affected player or controller of the affected object often chooses the order to apply them.",
    tags: ["instead", "as", "enters", "skip", "replacement"],
    example: "Rest in Peace changes a card going to a graveyard into exile. No one can respond after the card has 'started' going to the graveyard."
  },
  {
    id: "sba",
    title: "State-Based Actions",
    refs: "CR 704",
    summary: "The game constantly cleans up impossible or losing states before players get priority.",
    details:
      "State-based actions destroy creatures with lethal damage, put creatures with 0 or less toughness into graveyards, make players lose for 0 or less life, clean up duplicate legendary permanents, and more.",
    tags: ["lethal", "legend", "0 toughness", "poison"],
    example: "A 2/2 creature with 2 damage marked is destroyed before any player can cast another spell."
  },
  {
    id: "combat",
    title: "Combat Damage",
    refs: "CR 506-510, CR 702",
    summary: "Combat follows ordered steps. First strike and double strike create an extra combat damage step.",
    details:
      "Attacks are declared, then blocks are declared, then damage is assigned and dealt. Trample, deathtouch, first strike, and protection can change what legal or useful damage assignment looks like.",
    tags: ["attack", "block", "trample", "deathtouch", "first strike"],
    example: "With deathtouch and trample, assigning 1 damage to each blocking creature can be lethal, letting the rest trample over."
  },
  {
    id: "layers",
    title: "Continuous Effects and Layers",
    refs: "CR 613",
    summary: "Continuous effects are applied in a structured layer system, then by dependency and timestamp when needed.",
    details:
      "Layer questions usually matter when effects change text, types, colors, abilities, power, or toughness. Type-changing effects like Blood Moon are evaluated before ability-adding or removing effects in later layers.",
    tags: ["layers", "timestamp", "dependency", "Blood Moon"],
    example: "Blood Moon makes nonbasic lands Mountains in layer 4. Effects that depend on land types may change after that effect applies."
  },
  {
    id: "copy",
    title: "Copy Effects",
    refs: "CR 707",
    summary: "A copy uses the copiable values of the object, usually what is printed plus other copy effects.",
    details:
      "Counters, Auras, Equipment, most continuous buffs, and damage are not copied. Copy effects can copy choices stated by the copying effect, depending on the wording.",
    tags: ["copy", "clone", "token"],
    example: "Clone copying a 2/2 creature with a +1/+1 counter enters as the printed creature, not with the counter."
  }
];

const scenarios = [
  {
    id: "ward",
    title: "Targeting Ward",
    short: "Lightning Bolt targets a creature with ward 2.",
    cards: ["Lightning Bolt", "Coppercoat Vanguard"],
    ruleIds: ["priority", "targets", "triggered"],
    steps: [
      "You cast Lightning Bolt and choose the ward creature as the target.",
      "Ward sees that the permanent became the target of a spell an opponent controls, so ward triggers.",
      "The ward trigger goes on the stack above Lightning Bolt.",
      "When the ward trigger resolves, the Bolt's controller must pay the ward cost. If they do not, Lightning Bolt is countered.",
      "If the cost is paid, Lightning Bolt stays on the stack. Players may respond again before it resolves."
    ]
  },
  {
    id: "hexproof",
    title: "Target Becomes Illegal",
    short: "A targeted creature gains hexproof before the spell resolves.",
    cards: ["Murder", "Snakeskin Veil"],
    ruleIds: ["priority", "targets"],
    steps: [
      "A spell with a target is cast and placed on the stack.",
      "Before it resolves, the target gains hexproof from the spell's controller.",
      "As the spell tries to resolve, the game checks whether its targets are still legal.",
      "If its only target is now illegal, the spell does not resolve and none of its instructions happen.",
      "If the spell has multiple targets and at least one is still legal, it resolves for the legal targets."
    ]
  },
  {
    id: "torpor",
    title: "Enter-the-Battlefield Lockout",
    short: "Torpor Orb changes whether ETB abilities trigger.",
    cards: ["Torpor Orb", "Mulldrifter"],
    ruleIds: ["triggered", "replacement"],
    steps: [
      "A creature enters the battlefield while Torpor Orb is already on the battlefield.",
      "The game checks whether any triggered abilities should trigger from that event.",
      "Torpor Orb says creatures entering do not cause abilities to trigger.",
      "The ETB ability never triggers, so it is never put on the stack.",
      "Removing Torpor Orb afterward does not recreate a trigger that was stopped."
    ]
  },
  {
    id: "bloodmoon",
    title: "Blood Moon and Land Types",
    short: "Type-changing effects can erase land abilities.",
    cards: ["Blood Moon", "Urborg, Tomb of Yawgmoth"],
    ruleIds: ["layers"],
    steps: [
      "Continuous effects are applied using the layer system.",
      "Blood Moon's type-changing effect applies to nonbasic lands in layer 4.",
      "A nonbasic land that becomes a Mountain has the Mountain subtype and the intrinsic mana ability for Mountains.",
      "Changing a land to a basic land type removes its old rules text unless another effect says otherwise.",
      "Layer dependency can matter when another land effect changes what Blood Moon applies to."
    ]
  },
  {
    id: "trample",
    title: "Deathtouch Plus Trample",
    short: "A trampler with deathtouch is blocked.",
    cards: ["Questing Beast", "Typhoid Rats"],
    ruleIds: ["combat", "sba"],
    steps: [
      "During combat damage assignment, the attacking creature must assign lethal damage to each blocker before assigning excess to the defending player.",
      "Deathtouch makes any nonzero amount of damage from that source lethal for assignment purposes.",
      "The attacker can assign 1 damage to a blocker, then assign the remaining damage to the defending player or planeswalker being attacked.",
      "Damage is dealt at the same time in that combat damage step.",
      "State-based actions then destroy creatures that have lethal damage."
    ]
  },
  {
    id: "copycounter",
    title: "Copying a Modified Creature",
    short: "A Clone copies a creature with counters and Auras.",
    cards: ["Clone", "Grizzly Bears"],
    ruleIds: ["copy", "layers"],
    steps: [
      "A copy effect looks at the copied object's copiable values.",
      "Copiable values include the printed characteristics plus other copy effects that changed them.",
      "Counters, damage, Auras, Equipment, and most temporary buffs are not copied.",
      "The copying object enters as the copied card's base characteristics.",
      "After it exists, other continuous effects can apply to the copy normally."
    ]
  }
];

const communityExamples = [
  {
    id: "community-etali-bauble",
    title: "Etali, Vexing Bauble, Hexing Squelcher",
    short: "Does Etali's ETB get countered, and what about the free spells?",
    mine: ["Hexing Squelcher"],
    opponent: ["Vexing Bauble"],
    cast: "Etali, Primal Conqueror",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast"
  },
  {
    id: "community-krark-counter",
    title: "Krark, Bolt, Counterspell",
    short: "Which resolves first: Krark's trigger or the counterspell?",
    mine: ["Krark, the Thumbless"],
    opponent: [],
    cast: "Lightning Bolt",
    response: "Counterspell",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast"
  },
  {
    id: "community-blood-moon",
    title: "Blood Moon and a Nonbasic Land",
    short: "What happens when a nonbasic land is on the opponent's board?",
    mine: ["Blood Moon"],
    opponent: ["Command Tower"],
    cast: "",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast"
  },
  {
    id: "community-twinflame-path",
    title: "Twinflame, Etali, Path to Exile",
    short: "Path removes the only Twinflame target before Twinflame resolves.",
    mine: ["Etali, Primal Conqueror"],
    opponent: [],
    cast: "Twinflame",
    response: "Path to Exile",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "mine:0",
    responseTarget: "mine:0"
  },
  {
    id: "community-eldrazi-confluence",
    title: "Eldrazi Confluence Blinking Etali",
    short: "Can the same blink mode target the same Etali three times?",
    mine: ["Etali, Primal Conqueror"],
    opponent: [],
    cast: "Eldrazi Confluence",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "mine:0",
    responseTarget: "cast"
  },
  {
    id: "community-reanimate-fated-return",
    title: "Reanimate and Fated Return",
    short: "Opponent can target the same graveyard card and move it first.",
    mine: [],
    opponent: [],
    cast: "Reanimate",
    response: "Fated Return",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "other"
  },
  {
    id: "community-displacer-kitten-twinflame-etali",
    title: "Displacer Kitten, Twinflame, and Etali",
    short: "Kitten can blink Etali, but that makes Twinflame lose its only target.",
    mine: ["Etali, Primal Conqueror", "Displacer Kitten"],
    opponent: [],
    cast: "Twinflame",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "mine:0",
    responseTarget: "cast",
    ruling: {
      title: "Displacer Kitten blinking Etali during Twinflame",
      ruleIds: ["priority", "targets", "triggered"],
      facts: ["cast trigger", "blink", "target becomes illegal"],
      whatHappens: [
        "You cast Twinflame targeting Etali.",
        "Twinflame is a noncreature spell, so Displacer Kitten triggers.",
        "Yes, you can target Etali with the Displacer Kitten trigger because Etali is a nonland permanent you control.",
        "The Kitten trigger goes on the stack above Twinflame.",
        "If the Kitten trigger resolves first, Etali is exiled and returned as a new object.",
        "Etali enters, so its ETB ability triggers.",
        "Twinflame is still targeting the old Etali object that left the battlefield.",
        "When Twinflame tries to resolve, its only target is illegal.",
        "Twinflame does not resolve, so you do not create an Etali token with Twinflame."
      ],
      steps: [
        "Displacer Kitten triggers when you cast a noncreature spell, not when that spell resolves.",
        "That triggered ability can target up to one nonland permanent you control, so Etali is a legal target.",
        "A permanent that leaves the battlefield and returns becomes a new object with no memory of its previous existence.",
        "Twinflame's target was the original Etali object.",
        "If every target of a spell is illegal when it tries to resolve, that spell does not resolve and none of its effects happen.",
        "You may choose zero targets for Displacer Kitten, or target a different nonland permanent you control, if you want Twinflame to still copy Etali."
      ]
    }
  },
  {
    id: "community-sunfrill-sawhorn",
    title: "Sunfrill Imitator copying Sawhorn Nemesis",
    short: "Copying Sawhorn does not copy the player chosen for the original Sawhorn.",
    mine: ["Sunfrill Imitator", "Sawhorn Nemesis"],
    opponent: [],
    cast: "",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "combat",
    castTarget: "auto",
    responseTarget: "cast",
    ruling: {
      title: "Sunfrill copying Sawhorn",
      ruleIds: ["copy", "replacement"],
      facts: ["copy effect", "choices are not copied", "damage replacement"],
      whatHappens: [
        "Sunfrill Imitator attacks.",
        "Its attack trigger can make it become a copy of Sawhorn Nemesis.",
        "The original Sawhorn's chosen player is not copied.",
        "Sunfrill did not enter as Sawhorn, so Sunfrill never chose a player for that Sawhorn ability.",
        "Sunfrill has the damage-doubling text, but it has no chosen player to refer to.",
        "Damage is not doubled by Sunfrill and then doubled again.",
        "Only the original Sawhorn Nemesis doubles damage to its own chosen player or permanents that player controls."
      ],
      steps: [
        "Copy effects copy copiable values, not choices made for another permanent unless an effect specifically says to copy those choices.",
        "Sawhorn Nemesis's chosen player is tied to that specific Sawhorn object.",
        "Sunfrill Imitator becomes a copy during combat; it did not enter the battlefield as Sawhorn Nemesis.",
        "Because Sunfrill never made its own Sawhorn choice, its copied damage-doubling ability has no chosen player to apply to.",
        "The result is not quadruple damage. The original Sawhorn's replacement effect still works for the player chosen for that original Sawhorn."
      ]
    }
  },
  {
    id: "community-fiery-grismold",
    title: "Fiery Confluence and Grismold",
    short: "Modal spell instructions finish before death triggers go on the stack.",
    mine: ["Grismold, the Dreadsower"],
    opponent: [],
    cast: "Fiery Confluence",
    response: "",
    castController: "opponent",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast",
    ruling: {
      title: "Fiery Confluence killing Grismold",
      ruleIds: ["priority", "triggered", "sba"],
      facts: ["modal spell", "triggers wait", "state-based actions"],
      whatHappens: [
        "Fiery Confluence resolves as one spell.",
        "Its chosen modes are followed in order.",
        "No player gets priority between those modes.",
        "Creature-token death triggers can trigger during the spell, but they do not go on the stack yet.",
        "Grismold does not get +1/+1 counters in the middle of Fiery Confluence resolving.",
        "If Fiery Confluence deals enough damage to Grismold during resolution, Grismold dies before those triggers resolve.",
        "So yes, Fiery Confluence can kill a 3/3 Grismold even if 1/1 creature tokens die during the same spell."
      ],
      steps: [
        "For a Confluence spell, modes are chosen as the spell is cast, then the chosen instructions are performed while the spell resolves.",
        "If a chosen mode is repeated, those repeated instructions still happen during the same spell resolution.",
        "Triggered abilities that trigger during that resolution wait until the next time a player would receive priority.",
        "State-based actions are checked after Fiery Confluence finishes resolving, before those waiting triggers are put on the stack.",
        "If Grismold has lethal damage at that point, it is put into its owner's graveyard.",
        "After that, the waiting token-death triggers are put on the stack, but they will not save that Grismold."
      ]
    }
  },
  {
    id: "community-living-death-triggers",
    title: "Living Death trigger order",
    short: "Leaves and enters triggers wait, then players order their own triggers after the spell finishes.",
    mine: [],
    opponent: [],
    cast: "Living Death",
    response: "",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast",
    ruling: {
      title: "Living Death and delayed trigger placement",
      ruleIds: ["priority", "triggered", "sba"],
      facts: ["triggers wait", "APNAP order", "single spell resolution"],
      whatHappens: [
        "Living Death starts resolving.",
        "Players exile creature cards from graveyards.",
        "Players sacrifice creatures.",
        "Then the exiled creature cards enter the battlefield.",
        "Any dies, leaves-the-battlefield, or enters-the-battlefield triggers wait during all of this.",
        "After Living Death fully finishes resolving, state-based actions are checked.",
        "Then all waiting triggers are put on the stack.",
        "Each player chooses the order for triggers they control.",
        "Those triggers are put on the stack in APNAP order, not in the exact chronological order they happened."
      ],
      steps: [
        "No trigger is put on the stack while Living Death is still resolving.",
        "Triggers can trigger during the sacrifice part and during the enter-the-battlefield part, but they wait.",
        "After the spell finishes, the game gathers all waiting triggers that need to be put on the stack.",
        "The active player puts the triggers they control on the stack in any order they choose.",
        "Then each other player in turn order does the same for triggers they control.",
        "Because the last triggers put on the stack resolve first, nonactive-player triggers will usually resolve before active-player triggers.",
        "The game does not force leaves triggers to be stacked before enters triggers merely because they happened earlier."
      ]
    }
  },
  {
    id: "community-thoracle-doomsday",
    title: "Thassa's Oracle and Doomsday",
    short: "Doomsday can set up Oracle, but the clean win depends on resolving Oracle's trigger with a tiny library.",
    mine: [],
    opponent: [],
    cast: "Thassa's Oracle",
    response: "Doomsday",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main",
    castTarget: "auto",
    responseTarget: "cast-trigger",
    ruling: {
      title: "Thassa's Oracle plus Doomsday",
      ruleIds: ["priority", "triggered", "sba"],
      facts: ["Oracle win line", "triggered ability", "library size matters"],
      whatHappens: [
        "You cast Thassa's Oracle.",
        "Thassa's Oracle resolves and enters the battlefield.",
        "Its enter-the-battlefield trigger goes on the stack.",
        "Doomsday must resolve before that Oracle trigger resolves if you want it to change your library for the Oracle check.",
        "Doomsday leaves you with five cards in your library and exiles the rest.",
        "Then Oracle's trigger resolves.",
        "You look at the top X cards, where X is your devotion to blue.",
        "If your devotion to blue is greater than or equal to the number of cards in your library, you win the game.",
        "So with Doomsday leaving five cards, you need devotion to blue of five or more at Oracle trigger resolution unless you draw or remove more cards first."
      ],
      steps: [
        "Thassa's Oracle does not win when it is cast; it wins, if at all, when its triggered ability resolves.",
        "Doomsday is normally cast before Oracle or after Oracle's ETB trigger is on the stack, depending on the line.",
        "The app's board-only combo detector can miss this because Doomsday is a sorcery line, not a permanent sitting on the battlefield.",
        "If Oracle's trigger resolves while your library has five cards and your devotion to blue is less than five, you do not win from Oracle.",
        "Many Doomsday piles include ways to draw through the pile or otherwise reduce the library before Oracle's trigger resolves."
      ]
    }
  }
];

const commanderCombos = [
  {
    cards: ["Dramatic Reversal", "Isochron Scepter"],
    result: "Infinite untaps, storm count, and mana if your nonland mana sources make enough mana.",
    pattern: "Repeatable untap engine",
    needs: "Isochron Scepter has Dramatic Reversal imprinted, and your nonland mana sources make at least 3 mana."
  },
  {
    cards: ["Basalt Monolith", "Rings of Brighthearth"],
    result: "Infinite colorless mana once Rings copies Basalt Monolith's untap ability.",
    pattern: "Mana rock untap loop",
    needs: "You can pay the Rings copy cost during the loop."
  },
  {
    cards: ["Exquisite Blood", "Sanguine Bond"],
    result: "A life-loss or life-gain event starts an infinite drain loop.",
    pattern: "Life trigger loop",
    needs: "A player loses life or you gain life to start the loop."
  },
  {
    cards: ["Dualcaster Mage", "Twinflame"],
    result: "Infinite hasty creature tokens if Twinflame can target a creature and Dualcaster copies it.",
    pattern: "Copy spell loop",
    needs: "Twinflame is on the stack targeting a creature you control, then Dualcaster Mage copies it."
  },
  {
    cards: ["Gravecrawler", "Phyrexian Altar"],
    result: "Infinite casts, death triggers, and sacrifice triggers with another Zombie available.",
    pattern: "Graveyard recast loop",
    needs: "You control another Zombie and Gravecrawler can be cast from your graveyard."
  },
  {
    cards: ["Niv-Mizzet, Parun", "Curiosity"],
    result: "Drawing and damage trigger each other for a near-infinite damage/card-draw loop.",
    pattern: "Draw-damage loop",
    needs: "Curiosity is attached to Niv-Mizzet and a draw or damage trigger starts the loop."
  },
  {
    cards: ["Bloodchief Ascension", "Mindcrank"],
    result: "Infinite mill, lifeloss, and lifegain triggers.",
    pattern: "Mill-drain loop",
    needs: "Bloodchief Ascension has three or more quest counters and an opponent loses life or mills."
  },
  {
    cards: ["Walking Ballista", "Heliod, Sun-Crowned"],
    result: "Infinite damage and lifegain triggers.",
    pattern: "Counter-damage loop",
    needs: "Walking Ballista has lifelink from Heliod and enough counters to begin dealing damage."
  },
  {
    cards: ["Kinnan, Bonder Prodigy", "Basalt Monolith"],
    result: "Infinite colorless mana.",
    pattern: "Mana rock untap loop",
    needs: "Kinnan makes Basalt Monolith produce extra mana."
  },
  {
    cards: ["Peregrine Drake", "Deadeye Navigator"],
    result: "Infinite blinking, ETB/LTB triggers, and mana from lands.",
    pattern: "Blink mana loop",
    needs: "Deadeye Navigator is paired with Peregrine Drake and your lands produce enough mana."
  },
  {
    cards: ["Chatterfang, Squirrel General", "Pitiless Plunderer"],
    result: "Infinite Treasure tokens, death triggers, ETB/LTB triggers, and sacrifice triggers.",
    pattern: "Token-sacrifice loop",
    needs: "You can create or sacrifice a creature to start the loop."
  },
  {
    cards: ["The Gitrog Monster", "Dakmor Salvage"],
    result: "Infinite self-mill and discard/draw triggers.",
    pattern: "Dredge draw loop",
    needs: "A discard outlet or cleanup hand-size discard lets Dakmor Salvage keep dredging."
  },
  {
    cards: ["Underworld Breach", "Lion's Eye Diamond", "Brain Freeze"],
    result: "Near-infinite storm count, self-mill, and mana.",
    pattern: "Escape storm loop",
    needs: "Enough cards in graveyard to keep escaping Brain Freeze and Lion's Eye Diamond."
  },
  {
    cards: ["Sensei's Divining Top", "Mystic Forge", "Foundry Inspector"],
    result: "Infinite card draw, draw triggers, and storm count.",
    pattern: "Top-of-library artifact loop",
    needs: "You can cast Sensei's Divining Top from the top of your library for reduced cost."
  },
  {
    cards: ["Felidar Guardian", "Restoration Angel"],
    result: "Infinite ETB and LTB triggers.",
    pattern: "Blink pair loop",
    needs: "Each creature can blink the other and re-enter to repeat the loop."
  },
  {
    cards: ["Aggravated Assault", "Sword of Feast and Famine"],
    result: "Infinite combat phases.",
    pattern: "Combat untap loop",
    needs: "Equipped creature deals combat damage to a player and your lands produce enough mana."
  },
  {
    cards: ["Food Chain", "Squee, the Immortal"],
    result: "Infinite creature-spell-only colored mana and infinite creature casts.",
    pattern: "Exile-cast mana loop",
    needs: "Food Chain can exile Squee, then Squee can be cast from exile."
  },
  {
    cards: ["Ghostly Flicker", "Peregrine Drake", "Archaeomancer"],
    result: "Infinite blinking, ETB/LTB triggers, land untaps, and mana.",
    pattern: "Spell recursion blink loop",
    needs: "Ghostly Flicker can target the Drake and Archaeomancer, and lands make enough mana."
  },
  {
    cards: ["Staff of Domination", "Priest of Titania"],
    result: "Infinite green mana, untaps, lifegain, and card draw.",
    pattern: "Mana creature untap loop",
    needs: "Priest of Titania taps for at least 5 green mana."
  },
  {
    cards: ["Thassa's Oracle", "Demonic Consultation"],
    result: "Exile your library and win the game.",
    pattern: "Oracle win line",
    needs: "Thassa's Oracle trigger is on the stack before resolving Demonic Consultation."
  },
  {
    cards: ["Thassa's Oracle", "Doomsday"],
    result: "Set up a tiny library and win with Thassa's Oracle if devotion is high enough or the pile draws down further.",
    pattern: "Oracle win line",
    needs: "Doomsday must resolve before Thassa's Oracle's triggered ability resolves. With five cards left, your devotion to blue must be at least five unless the pile reduces your library further."
  }
];

const SPELLBOOK_API = "https://backend.commanderspellbook.com";
const SPELLBOOK_CACHE_KEY = "stackwise.spellbookCombos.v1";
const SAVED_RULINGS_KEY = "stackwise.savedRulings.v1";
const SPELLBOOK_SYNC_LIMIT = 100;
const SPELLBOOK_MAX_PAGES = 220;
let spellbookCombos = [];
let spellbookSyncing = false;
let savedRulings = [];

let selectedCards = [];
let activeRuleId = "priority";
let cardSuggestionNames = [];
let activeSuggestionIndex = -1;
let suggestionRequestId = 0;
let suggestionTimer;
let boardSuggestionNames = [];
let activeBoardSuggestionIndex = -1;
let boardSuggestionRequestId = 0;
let boardSuggestionTimer;
let boardSuggestionRange = null;
let liveBoard = {
  mine: [],
  opponent: [],
  cast: null,
  response: null,
  castTarget: "auto",
  responseTarget: "cast",
  castController: "mine",
  manaMode: "paid",
  turnPhase: "main"
};
let liveAutocomplete = {
  inputId: "",
  suggestionsId: "",
  names: [],
  activeIndex: -1,
  requestId: 0,
  timer: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(text) {
  $("#statusPill").textContent = text;
}

function matchingRules(text) {
  const value = text.toLowerCase();
  return rules.filter((rule) => {
    const haystack = [rule.title, rule.summary, rule.details, rule.refs, ...rule.tags].join(" ").toLowerCase();
    return haystack.includes(value);
  });
}

function renderFocus(ruleIds = ["priority", "targets", "triggered"]) {
  $("#focusChips").innerHTML = ruleIds
    .map((id) => rules.find((rule) => rule.id === id))
    .filter(Boolean)
    .map((rule) => `<span class="chip">${rule.title}</span>`)
    .join("");
}

function renderSelectedCards() {
  const container = $("#selectedCards");
  if (!selectedCards.length) {
    container.innerHTML = `<div class="empty-state">Search for cards or choose a scenario to see Oracle text, likely rules, and a resolution path.</div>`;
    return;
  }

  container.innerHTML = selectedCards
    .map((card) => {
      const img = card.image || "";
      return `
        <article class="card-row">
          ${img ? `<img src="${img}" alt="${card.name} card image" />` : `<div class="brand-mark" aria-hidden="true">${card.name.slice(0, 1)}</div>`}
          <div>
            <h3>${card.name}</h3>
            <p>${card.text || "No Oracle text available."}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderScenarios() {
  $("#scenarioStrip").innerHTML = scenarios
    .map(
      (scenario) => `
        <button class="scenario-button" data-scenario="${scenario.id}">
          <strong>${scenario.title}</strong>
          <span>${scenario.short}</span>
        </button>
      `
    )
    .join("");
}

function renderCommunityExamples() {
  const container = $("#communityExamples");
  if (!container) return;
  const filter = $("#librarySearch")?.value.trim().toLowerCase() || "";
  const examples = communityExamples.filter((example) => `${example.title} ${example.short}`.toLowerCase().includes(filter));
  container.innerHTML = examples
    .map(
      (example) => `
        <button class="community-example" data-community-example="${example.id}">
          <strong>${escapeHtml(example.title)}</strong>
          <span>${escapeHtml(example.short)}</span>
        </button>
      `
    )
    .join("") || `<div class="empty-state">No matching examples.</div>`;
}

function knownLineExamples() {
  return communityExamples.filter((example) => example.ruling && (example.cast || example.response));
}

function renderKnownLineOptions() {
  const select = $("#knownLineSelect");
  if (!select) return;
  select.innerHTML = `
    <option value="">Choose a learned line</option>
    ${knownLineExamples()
      .map((example) => `<option value="${escapeHtml(example.id)}">${escapeHtml(example.title)}</option>`)
      .join("")}
  `;
}

function renderCommanderCombos() {
  const container = $("#comboResearch");
  if (!container) return;
  const filter = $("#librarySearch")?.value.trim().toLowerCase() || "";
  const combos = allCommanderCombos()
    .filter((combo) => `${comboCardText(combo)} ${combo.result} ${combo.pattern} ${combo.needs}`.toLowerCase().includes(filter))
    .slice(0, 250);
  container.innerHTML = combos
    .map(
      (combo) => `
        <article class="combo-card">
          <strong>${escapeHtml(comboCardText(combo))}</strong>
          <span>${escapeHtml(combo.result)}</span>
          <span>${escapeHtml(combo.needs)}</span>
          <em>${escapeHtml(combo.source ? `${combo.source} · ${combo.pattern}` : combo.pattern)}</em>
        </article>
      `
    )
    .join("") || `<div class="empty-state">No matching combos. Sync Commander Spellbook or try another filter.</div>`;
}

function renderAnswer(title, steps, ruleIds, engine = null) {
  $("#answerTitle").textContent = title;
  $("#answerSteps").innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
  if (engine) {
    $("#engineSummary").classList.add("active");
    $("#engineSummary").innerHTML = `
      <h3>${escapeHtml(engine.title)}</h3>
      <p>${escapeHtml(engine.summary)}</p>
      <div class="engine-facts">
        ${engine.facts.map((fact) => `<span class="engine-fact">${escapeHtml(fact)}</span>`).join("")}
      </div>
    `;
  } else {
    $("#engineSummary").classList.remove("active");
    $("#engineSummary").innerHTML = "";
  }
  $("#relatedRules").innerHTML = ruleIds
    .map((id) => rules.find((rule) => rule.id === id))
    .filter(Boolean)
    .map(
      (rule) => `
        <button class="mini-rule" data-open-rule="${rule.id}">
          <strong>${rule.refs}</strong>
          <p>${rule.summary}</p>
        </button>
      `
    )
    .join("");
  renderFocus(ruleIds);
}

function renderRulesList(filter = "") {
  const visibleRules = filter ? matchingRules(filter) : rules;
  $("#ruleList").innerHTML = visibleRules
    .map(
      (rule) => `
        <button class="rule-card ${rule.id === activeRuleId ? "active" : ""}" data-rule="${rule.id}">
          <h3>${rule.title}</h3>
          <p>${rule.summary}</p>
        </button>
      `
    )
    .join("");
  if (!visibleRules.find((rule) => rule.id === activeRuleId) && visibleRules[0]) {
    activeRuleId = visibleRules[0].id;
  }
  renderRuleDetail(activeRuleId);
}

function renderRuleDetail(ruleId) {
  const rule = rules.find((item) => item.id === ruleId) || rules[0];
  activeRuleId = rule.id;
  $$(".rule-card").forEach((button) => button.classList.toggle("active", button.dataset.rule === rule.id));
  $("#ruleDetail").innerHTML = `
    <p class="eyebrow">${rule.refs}</p>
    <h2>${rule.title}</h2>
    <div class="tag-row">${rule.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
    <p>${rule.details}</p>
    <div class="example-box">
      <h3>Table Example</h3>
      <p>${rule.example}</p>
    </div>
  `;
  renderFocus([rule.id]);
}

function switchView(viewId) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
}

async function fetchCard(name) {
  setStatus("Searching cards");
  try {
    const localResponse = await fetch(`/api/cards/named?name=${encodeURIComponent(name)}`);
    if (localResponse.ok) return localResponse.json();
  } catch {}

  const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error("Card not found");
  const card = await response.json();
  const image = card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "";
  const text = card.oracle_text || card.card_faces?.map((face) => `${face.name}: ${face.oracle_text || ""}`).join(" // ");
  return {
    name: card.name,
    text,
    image,
    typeLine: card.type_line || card.card_faces?.map((face) => face.type_line).filter(Boolean).join(" // ") || "",
    keywords: card.keywords || []
  };
}

async function fetchCardSuggestions(query) {
  try {
    const localResponse = await fetch(`/api/cards/autocomplete?q=${encodeURIComponent(query)}`);
    if (localResponse.ok) return (await localResponse.json()).slice(0, 10);
  } catch {}

  const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Suggestions unavailable");
  const payload = await response.json();
  return (payload.data || []).slice(0, 10);
}

function setSuggestionsExpanded(isExpanded) {
  $("#cardSearch").setAttribute("aria-expanded", String(isExpanded));
  $("#cardSuggestions").classList.toggle("open", isExpanded);
}

function renderCardSuggestions(names, stateText = "") {
  const container = $("#cardSuggestions");
  cardSuggestionNames = names;
  activeSuggestionIndex = names.length ? 0 : -1;

  if (stateText) {
    container.innerHTML = `<div class="suggestion-state">${escapeHtml(stateText)}</div>`;
    setSuggestionsExpanded(true);
    return;
  }

  if (!names.length) {
    container.innerHTML = "";
    setSuggestionsExpanded(false);
    return;
  }

  container.innerHTML = names
    .map(
      (name, index) => `
        <button
          class="suggestion-item ${index === activeSuggestionIndex ? "active" : ""}"
          type="button"
          role="option"
          aria-selected="${index === activeSuggestionIndex}"
          data-card-suggestion="${escapeHtml(name)}"
        >
          <span>${escapeHtml(name)}</span>
          <span class="suggestion-type">Card</span>
        </button>
      `
    )
    .join("");
  setSuggestionsExpanded(true);
}

function highlightSuggestion(index) {
  if (!cardSuggestionNames.length) return;
  activeSuggestionIndex = (index + cardSuggestionNames.length) % cardSuggestionNames.length;
  $$(".suggestion-item").forEach((item, itemIndex) => {
    const isActive = itemIndex === activeSuggestionIndex;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    if (isActive) item.scrollIntoView({ block: "nearest" });
  });
}

function hideCardSuggestions() {
  cardSuggestionNames = [];
  activeSuggestionIndex = -1;
  $("#cardSuggestions").innerHTML = "";
  setSuggestionsExpanded(false);
}

async function updateCardSuggestions(query) {
  const value = query.trim();
  clearTimeout(suggestionTimer);

  if (value.length < 2) {
    hideCardSuggestions();
    return;
  }

  const requestId = ++suggestionRequestId;
  renderCardSuggestions([], "Looking for cards...");

  try {
    const names = await fetchCardSuggestions(value);
    if (requestId !== suggestionRequestId) return;
    renderCardSuggestions(names, names.length ? "" : "No matching cards found.");
  } catch {
    if (requestId !== suggestionRequestId) return;
    renderCardSuggestions([], "Suggestions are unavailable.");
  }
}

function setBoardSuggestionsExpanded(isExpanded) {
  $("#boardQuestion").setAttribute("aria-expanded", String(isExpanded));
  $("#boardSuggestions").classList.toggle("open", isExpanded);
}

function getBoardSuggestionQuery() {
  const input = $("#boardQuestion");
  const cursor = input.selectionStart || 0;
  const beforeCursor = input.value.slice(0, cursor);
  const match = beforeCursor.match(/[A-Za-z0-9,' -]{2,}$/);
  if (!match) return null;

  const fragment = match[0];
  const words = fragment.trim().split(/\s+/).filter(Boolean);
  const stopWords = new Set(["i", "cast", "casts", "target", "targeting", "with", "and", "my", "their", "a", "an", "the", "on", "to", "using", "activate", "activated", "then"]);
  while (words.length > 1 && stopWords.has(words[0].toLowerCase())) {
    words.shift();
  }

  const queryWords = words.slice(-3);
  const query = queryWords.join(" ").trim();
  if (query.length < 2) return null;

  const queryOffset = fragment.lastIndexOf(query);
  return {
    query,
    start: cursor - fragment.length + queryOffset,
    end: cursor
  };
}

function renderBoardSuggestions(names, stateText = "") {
  const container = $("#boardSuggestions");
  boardSuggestionNames = names;
  activeBoardSuggestionIndex = names.length ? 0 : -1;

  if (stateText) {
    container.innerHTML = `<div class="suggestion-state">${escapeHtml(stateText)}</div>`;
    setBoardSuggestionsExpanded(true);
    return;
  }

  if (!names.length) {
    container.innerHTML = "";
    setBoardSuggestionsExpanded(false);
    return;
  }

  container.innerHTML = names
    .map(
      (name, index) => `
        <button
          class="suggestion-item ${index === activeBoardSuggestionIndex ? "active" : ""}"
          type="button"
          role="option"
          aria-selected="${index === activeBoardSuggestionIndex}"
          data-board-suggestion="${escapeHtml(name)}"
        >
          <span>${escapeHtml(name)}</span>
          <span class="suggestion-type">Insert</span>
        </button>
      `
    )
    .join("");
  setBoardSuggestionsExpanded(true);
}

function highlightBoardSuggestion(index) {
  if (!boardSuggestionNames.length) return;
  activeBoardSuggestionIndex = (index + boardSuggestionNames.length) % boardSuggestionNames.length;
  $$("#boardSuggestions .suggestion-item").forEach((item, itemIndex) => {
    const isActive = itemIndex === activeBoardSuggestionIndex;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    if (isActive) item.scrollIntoView({ block: "nearest" });
  });
}

function hideBoardSuggestions() {
  boardSuggestionNames = [];
  activeBoardSuggestionIndex = -1;
  boardSuggestionRange = null;
  $("#boardSuggestions").innerHTML = "";
  setBoardSuggestionsExpanded(false);
}

async function updateBoardSuggestions() {
  const match = getBoardSuggestionQuery();
  clearTimeout(boardSuggestionTimer);

  if (!match) {
    hideBoardSuggestions();
    return;
  }

  boardSuggestionRange = match;
  const requestId = ++boardSuggestionRequestId;
  renderBoardSuggestions([], "Looking for cards...");

  try {
    const names = await fetchCardSuggestions(match.query);
    if (requestId !== boardSuggestionRequestId) return;
    renderBoardSuggestions(names, names.length ? "" : "No matching cards found.");
  } catch {
    if (requestId !== boardSuggestionRequestId) return;
    renderBoardSuggestions([], "Suggestions are unavailable.");
  }
}

function insertBoardSuggestion(name) {
  const input = $("#boardQuestion");
  const range = boardSuggestionRange || getBoardSuggestionQuery();
  if (!range) return;

  const before = input.value.slice(0, range.start);
  const after = input.value.slice(range.end);
  const needsTrailingSpace = after.length === 0 || !/^\s|[.,!?;:)]/.test(after);
  const inserted = `${name}${needsTrailingSpace ? " " : ""}`;
  input.value = `${before}${inserted}${after}`;
  const cursor = before.length + inserted.length;
  input.focus();
  input.setSelectionRange(cursor, cursor);
  hideBoardSuggestions();
}

function liveZoneLabel(zone) {
  if (zone === "mine") return "My Board";
  if (zone === "opponent") return "Opponent Board";
  if (zone === "response") return "Opponent Response";
  return "Cast";
}

function liveZoneInputId(zone) {
  return zone === "mine" ? "myBoardSearch" : zone === "opponent" ? "opponentBoardSearch" : zone === "response" ? "responseSearch" : "castSearch";
}

function liveZoneSuggestionsId(zone) {
  return zone === "mine" ? "myBoardSuggestions" : zone === "opponent" ? "opponentBoardSuggestions" : zone === "response" ? "responseSuggestions" : "castSuggestions";
}

function cardBrief(card) {
  return card.typeLine || card.text || "Card loaded";
}

function renderLiveZone(zone) {
  const targetId = zone === "mine" ? "myBoardCards" : zone === "opponent" ? "opponentBoardCards" : zone === "response" ? "responseCardSlot" : "castCardSlot";
  const cards = zone === "cast" || zone === "response" ? (liveBoard[zone] ? [liveBoard[zone]] : []) : liveBoard[zone];
  const container = $(`#${targetId}`);
  if (!container) return;

  if (!cards.length) {
    container.innerHTML = `<div class="empty-state">${zone === "cast" ? "No spell selected." : zone === "response" ? "No response selected." : "No permanents added."}</div>`;
    return;
  }

  container.innerHTML = cards
    .map(
      (card, index) => `
        <article class="live-card-pill">
          <div>
            <strong>${escapeHtml(card.name)}</strong>
            <span>${escapeHtml(cardBrief(card))}</span>
          </div>
          <button class="remove-card" data-remove-zone="${zone}" data-remove-index="${index}" aria-label="Remove ${escapeHtml(card.name)}">X</button>
        </article>
      `
    )
    .join("");
}

function renderLiveBoard() {
  renderLiveZone("mine");
  renderLiveZone("opponent");
  renderLiveZone("cast");
  renderLiveZone("response");
  renderTargetControls();
}

function boardTargetEntries() {
  return [
    ...liveBoard.mine.map((card, index) => ({ key: `mine:${index}`, card, label: `${card.name} (my board)`, side: "my board" })),
    ...liveBoard.opponent.map((card, index) => ({ key: `opponent:${index}`, card, label: `${card.name} (opponent board)`, side: "opponent board" }))
  ];
}

function findBoardTarget(key) {
  return boardTargetEntries().find((entry) => entry.key === key) || null;
}

function renderTargetControls() {
  const entries = boardTargetEntries();
  const castTarget = $("#castTarget");
  const responseTarget = $("#responseTarget");

  if (castTarget) {
    const current = entries.some((entry) => entry.key === liveBoard.castTarget) ? liveBoard.castTarget : "auto";
    liveBoard.castTarget = current;
    castTarget.innerHTML = `
      <option value="auto">Auto / choose during analysis</option>
      ${entries.map((entry) => `<option value="${escapeHtml(entry.key)}">${escapeHtml(entry.label)}</option>`).join("")}
    `;
    castTarget.value = current;
  }

  if (responseTarget) {
    const baseValues = ["cast", "cast-trigger", "other"];
    const current = baseValues.includes(liveBoard.responseTarget) || entries.some((entry) => entry.key === liveBoard.responseTarget) ? liveBoard.responseTarget : "cast";
    liveBoard.responseTarget = current;
    responseTarget.innerHTML = `
      <option value="cast">The cast spell</option>
      <option value="cast-trigger">A cast trigger or ability</option>
      ${entries.map((entry) => `<option value="${escapeHtml(entry.key)}">${escapeHtml(entry.label)}</option>`).join("")}
      <option value="other">Something else</option>
    `;
    responseTarget.value = current;
  }
}

function hideLiveSuggestions() {
  if (liveAutocomplete.suggestionsId) {
    const list = $(`#${liveAutocomplete.suggestionsId}`);
    if (list) {
      list.innerHTML = "";
      list.classList.remove("open");
    }
  }
  if (liveAutocomplete.inputId) {
    const input = $(`#${liveAutocomplete.inputId}`);
    if (input) input.setAttribute("aria-expanded", "false");
  }
  liveAutocomplete.names = [];
  liveAutocomplete.activeIndex = -1;
}

function renderLiveSuggestions(inputId, suggestionsId, names, stateText = "") {
  const input = $(`#${inputId}`);
  const list = $(`#${suggestionsId}`);
  if (!input || !list) return;

  liveAutocomplete.inputId = inputId;
  liveAutocomplete.suggestionsId = suggestionsId;
  liveAutocomplete.names = names;
  liveAutocomplete.activeIndex = names.length ? 0 : -1;

  if (stateText) {
    list.innerHTML = `<div class="suggestion-state">${escapeHtml(stateText)}</div>`;
    list.classList.add("open");
    input.setAttribute("aria-expanded", "true");
    return;
  }

  if (!names.length) {
    hideLiveSuggestions();
    return;
  }

  list.innerHTML = names
    .map(
      (name, index) => `
        <button
          class="suggestion-item ${index === liveAutocomplete.activeIndex ? "active" : ""}"
          type="button"
          role="option"
          aria-selected="${index === liveAutocomplete.activeIndex}"
          data-live-suggestion="${escapeHtml(name)}"
        >
          <span>${escapeHtml(name)}</span>
          <span class="suggestion-type">Card</span>
        </button>
      `
    )
    .join("");
  list.classList.add("open");
  input.setAttribute("aria-expanded", "true");
}

function highlightLiveSuggestion(index) {
  if (!liveAutocomplete.names.length) return;
  liveAutocomplete.activeIndex = (index + liveAutocomplete.names.length) % liveAutocomplete.names.length;
  $$(`#${liveAutocomplete.suggestionsId} .suggestion-item`).forEach((item, itemIndex) => {
    const isActive = itemIndex === liveAutocomplete.activeIndex;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    if (isActive) item.scrollIntoView({ block: "nearest" });
  });
}

async function updateLiveSuggestions(zone) {
  const inputId = liveZoneInputId(zone);
  const suggestionsId = liveZoneSuggestionsId(zone);
  const input = $(`#${inputId}`);
  if (!input) return;

  const value = input.value.trim();
  clearTimeout(liveAutocomplete.timer);

  if (value.length < 2) {
    hideLiveSuggestions();
    return;
  }

  const requestId = ++liveAutocomplete.requestId;
  renderLiveSuggestions(inputId, suggestionsId, [], "Looking for cards...");

  try {
    const names = await fetchCardSuggestions(value);
    if (requestId !== liveAutocomplete.requestId) return;
    renderLiveSuggestions(inputId, suggestionsId, names, names.length ? "" : "No matching cards found.");
  } catch {
    if (requestId !== liveAutocomplete.requestId) return;
    renderLiveSuggestions(inputId, suggestionsId, [], "Suggestions are unavailable.");
  }
}

async function addLiveCard(zone, query) {
  const value = query.trim();
  if (!value) return;

  let card;
  try {
    hideLiveSuggestions();
    card = await fetchCard(value);
  } catch {
    setStatus("Card not found");
    return;
  }

  if (zone === "cast" || zone === "response") {
    liveBoard[zone] = card;
  } else {
    liveBoard[zone] = [...liveBoard[zone].filter((item) => item.name !== card.name), card].slice(-8);
  }

  const input = $(`#${liveZoneInputId(zone)}`);
  if (input) input.value = "";
  renderLiveBoard();
  analyzeLiveBoard();
  renderRulingPrompt();
  setStatus(`${liveZoneLabel(zone)} updated`);
}

function removeLiveCard(zone, index) {
  if (zone === "cast" || zone === "response") {
    liveBoard[zone] = null;
  } else {
    liveBoard[zone].splice(index, 1);
  }
  renderLiveBoard();
  analyzeLiveBoard();
  renderRulingPrompt();
}

function resetLiveBoardState() {
  liveBoard = {
    mine: [],
    opponent: [],
    cast: null,
    response: null,
    castTarget: "auto",
    responseTarget: "cast",
    castController: "mine",
    manaMode: "paid",
    turnPhase: "main"
  };

  ["myBoardSearch", "opponentBoardSearch", "castSearch", "responseSearch"].forEach((id) => {
    const input = $(`#${id}`);
    if (input) input.value = "";
  });
}

async function fetchExampleCards(names) {
  const uniqueNames = [...new Set(names.filter(Boolean))];
  const cards = await Promise.all(
    uniqueNames.map(async (name) => {
      try {
        return await fetchCard(name);
      } catch {
        return { name, text: "Card could not be loaded. Check spelling.", image: "", typeLine: "Unknown", keywords: [] };
      }
    })
  );
  return cards.reduce((lookup, card, index) => {
    lookup[uniqueNames[index]] = card;
    lookup[card.name] = card;
    return lookup;
  }, {});
}

async function loadCommunityExample(exampleId) {
  const example = communityExamples.find((item) => item.id === exampleId);
  if (!example) return;

  setStatus("Loading example...");

  try {
    const lookup = await fetchExampleCards([...example.mine, ...example.opponent, example.cast, example.response]);
    resetLiveBoardState();
    liveBoard.mine = example.mine.map((name) => lookup[name]).filter(Boolean);
    liveBoard.opponent = example.opponent.map((name) => lookup[name]).filter(Boolean);
    liveBoard.cast = example.cast ? lookup[example.cast] : null;
    liveBoard.response = example.response ? lookup[example.response] : null;
    liveBoard.castController = example.castController;
    liveBoard.manaMode = example.manaMode;
    liveBoard.turnPhase = example.turnPhase;
    liveBoard.castTarget = example.castTarget;
    liveBoard.responseTarget = example.responseTarget;

    $("#castController").value = liveBoard.castController;
    $("#castManaMode").value = liveBoard.manaMode;
    $("#turnPhase").value = liveBoard.turnPhase;
    if ($("#knownLineSelect")) $("#knownLineSelect").value = example.ruling ? example.id : "";
    hideLiveSuggestions();
    renderLiveBoard();
    analyzeLiveBoard();
    renderRulingPrompt();
    switchView("judge");
    if (example.ruling) renderKnownRuling(example.ruling);
    setStatus("Example loaded");
  } catch {
    setStatus("Example cards unavailable");
  }
}

function boardNames(cards) {
  return cards.length ? cards.map((card) => card.name).join(", ") : "none";
}

function selectedTargetLabel(value) {
  if (!value || value === "auto") return "Auto / not specified";
  if (value === "cast") return liveBoard.cast ? `${liveBoard.cast.name} on the stack` : "The cast spell";
  if (value === "cast-trigger") return "A cast trigger or ability";
  if (value === "other") return "Something else";
  const target = findBoardTarget(value);
  return target ? target.label : value;
}

function cardLine(card) {
  if (!card) return "none";
  const type = card.typeLine ? ` (${card.typeLine})` : "";
  return `${card.name}${type}`;
}

function buildRulingPromptText() {
  const question = ($("#rulingQuestionText")?.value || "").trim();
  const lines = [
    "Please answer this Magic: The Gathering rules question in a clear judge-style way.",
    "",
    "Use this output style:",
    "What happens:",
    "1. Short step-by-step resolution.",
    "2. Say which object resolves first.",
    "3. Say whether targets are still legal.",
    "4. Say what happens to any spell, ability, trigger, or permanent involved.",
    "",
    "Board state:",
    `My board: ${boardNames(liveBoard.mine)}`,
    `Opponent board: ${boardNames(liveBoard.opponent)}`,
    "",
    "Stack / action:",
    `Casting player: ${liveBoard.castController === "mine" ? "Me" : "Opponent"}`,
    `Timing: ${liveBoard.turnPhase}`,
    `Mana spent: ${liveBoard.manaMode}`,
    `Spell or permanent being cast: ${cardLine(liveBoard.cast)}`,
    `Cast target: ${selectedTargetLabel(liveBoard.castTarget)}`,
    `Opponent response: ${cardLine(liveBoard.response)}`,
    `Response target: ${selectedTargetLabel(liveBoard.responseTarget)}`,
    "",
    "Question:",
    question || "What happens from this board state and stack?"
  ];

  const relevantCards = [...liveBoard.mine, ...liveBoard.opponent, liveBoard.cast, liveBoard.response].filter(Boolean);
  if (relevantCards.length) {
    lines.push("", "Relevant Oracle text:");
    relevantCards.forEach((card) => {
      lines.push(`- ${card.name}: ${card.text || card.typeLine || "Oracle text unavailable in app cache."}`);
    });
  }

  return lines.join("\n");
}

function renderRulingPrompt() {
  const output = $("#rulingPromptOutput");
  if (!output) return "";
  const prompt = buildRulingPromptText();
  output.textContent = prompt;
  $("#questionTitle").textContent = liveBoard.cast ? `Ask about ${liveBoard.cast.name}` : "Prompt ready";
  return prompt;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function loadSavedRulings() {
  try {
    savedRulings = JSON.parse(localStorage.getItem(SAVED_RULINGS_KEY) || "[]");
  } catch {
    savedRulings = [];
  }
}

function saveSavedRulings() {
  localStorage.setItem(SAVED_RULINGS_KEY, JSON.stringify(savedRulings.slice(0, 30)));
}

function renderSavedRulings() {
  const container = $("#savedRulings");
  if (!container) return;
  if (!savedRulings.length) {
    container.innerHTML = `<div class="empty-state">No saved ruling notes yet.</div>`;
    return;
  }
  container.innerHTML = savedRulings
    .slice(0, 8)
    .map(
      (ruling, index) => `
        <article class="saved-ruling-card">
          <strong>${escapeHtml(ruling.title)}</strong>
          <p>${escapeHtml(ruling.answer.slice(0, 220))}${ruling.answer.length > 220 ? "..." : ""}</p>
          <button type="button" data-load-saved-ruling="${index}">Load</button>
          <button type="button" data-delete-saved-ruling="${index}">Delete</button>
        </article>
      `
    )
    .join("");
}

function saveCurrentRulingNote() {
  const prompt = buildRulingPromptText();
  const answer = ($("#rulingAnswerText")?.value || "").trim();
  if (!answer) {
    setStatus("Paste an answer first");
    return;
  }
  const title = liveBoard.cast ? `${liveBoard.cast.name} ruling` : "Saved ruling";
  savedRulings = [{ title, prompt, answer, savedAt: new Date().toISOString() }, ...savedRulings].slice(0, 30);
  saveSavedRulings();
  renderSavedRulings();
  setStatus("Ruling saved");
}

function controllerLabel(value = liveBoard.castController) {
  return value === "opponent" ? "Opponent" : "Me";
}

function manaModeLabel(value = liveBoard.manaMode) {
  if (value === "free") return "No mana was spent";
  if (value === "unknown") return "Not sure";
  return "Mana was spent";
}

function phaseLabel(value = liveBoard.turnPhase) {
  if (value === "combat") return "Combat";
  if (value === "end") return "End step";
  if (value === "unknown") return "Not sure";
  return "Main phase";
}

function responseTargetLabel(value = liveBoard.responseTarget) {
  if (value === "cast-trigger") return "A cast trigger or ability";
  if (value === "other") return "Something else";
  const boardTarget = findBoardTarget(value);
  if (boardTarget) return boardTarget.label;
  return "The cast spell";
}

function castTargetLabel(value = liveBoard.castTarget) {
  if (value === "auto") return "Auto / choose during analysis";
  const boardTarget = findBoardTarget(value);
  return boardTarget ? boardTarget.label : "Auto / choose during analysis";
}

function buildBoardStateSummary() {
  return `
    <div class="board-state-summary">
      <div>
        <h3>Cast</h3>
        <p>${escapeHtml(liveBoard.cast ? liveBoard.cast.name : "No cast card selected")}</p>
        <p>${escapeHtml(controllerLabel())} casting, ${escapeHtml(manaModeLabel())}, ${escapeHtml(phaseLabel())}</p>
        <p>Target: ${escapeHtml(castTargetLabel())}</p>
      </div>
      <div>
        <h3>Opponent Response</h3>
        <p>${escapeHtml(liveBoard.response ? liveBoard.response.name : "none")}</p>
        <p>${escapeHtml(responseTargetLabel())}</p>
      </div>
      <div>
        <h3>My Board</h3>
        <p>${escapeHtml(boardNames(liveBoard.mine))}</p>
      </div>
      <div>
        <h3>Opponent Board</h3>
        <p>${escapeHtml(boardNames(liveBoard.opponent))}</p>
      </div>
    </div>
  `;
}

function renderRelatedRuleCards(ruleIds) {
  return ruleIds
    .map((id) => rules.find((rule) => rule.id === id))
    .filter(Boolean)
    .map(
      (rule) => `
        <div class="mini-rule">
          <strong>${rule.refs}</strong>
          <p>${rule.summary}</p>
        </div>
      `
    )
    .join("");
}

function renderKnownRuling(ruling) {
  if (!ruling) return;
  const ruleIds = ruling.ruleIds || ["priority"];
  $("#questionTitle").textContent = ruling.title;
  $("#questionAnswer").innerHTML = `
    ${buildBoardStateSummary()}
    <div class="what-happens">
      <h3>What happens</h3>
      ${renderWhatHappens((ruling.whatHappens || []).join ? ruling.whatHappens.join("\n") : ruling.whatHappens)}
    </div>
    <div class="engine-summary active">
      <h3>${escapeHtml(ruling.title)}</h3>
      <p>${escapeHtml("Known community ruling pattern loaded into the live rules engine.")}</p>
      <div class="engine-facts">${(ruling.facts || []).map((fact) => `<span class="engine-fact">${escapeHtml(fact)}</span>`).join("")}</div>
    </div>
    <ol class="steps">${(ruling.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    ${renderRelatedRuleCards(ruleIds)}
  `;
  renderFocus(ruleIds);
}

function renderWhatHappens(value) {
  const text = `${value || ""}`.trim();
  if (!text) return "";

  const lines = text
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((line) => line.trim())
    .filter(Boolean);

  return `
    <div class="what-happens-lines">
      ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function shortCardName(cardOrName) {
  const name = typeof cardOrName === "string" ? cardOrName : cardOrName?.name || "";
  return name.split(" // ")[0];
}

function normalizeCardName(name) {
  return shortCardName(name)
    .toLowerCase()
    .replace(/[^\w\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function comboCardText(combo) {
  return combo.cards.join(" + ");
}

function allCommanderCombos() {
  const seen = new Set();
  return [...spellbookCombos, ...commanderCombos].filter((combo) => {
    const key = `${comboCardText(combo)}|${combo.result}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function updateSpellbookStatus(text = "") {
  const status = $("#spellbookStatus");
  if (!status) return;
  if (text) {
    status.textContent = text;
    return;
  }
  status.textContent = spellbookCombos.length
    ? `Using ${spellbookCombos.length.toLocaleString()} synced Commander Spellbook variants plus starter combos.`
    : "Using starter combo set.";
}

function resultTextFromVariant(variant) {
  return (variant.produces || [])
    .map((item) => item.feature?.name)
    .filter(Boolean)
    .join(", ");
}

function requirementsTextFromVariant(variant) {
  const parts = [
    variant.manaNeeded ? `Mana needed: ${variant.manaNeeded}.` : "",
    variant.easyPrerequisites || "",
    variant.notablePrerequisites || "",
    (variant.requires || [])
      .map((item) => item.template?.name)
      .filter(Boolean)
      .map((name) => `Requires ${name}.`)
      .join(" ")
  ].filter(Boolean);

  return parts.join(" ") || "Check Commander Spellbook for exact board state, zones, and repeat steps.";
}

function mapSpellbookVariant(variant) {
  const cards = (variant.uses || []).map((use) => use.card?.name).filter(Boolean);
  if (!cards.length) return null;
  return {
    id: `spellbook:${variant.id}`,
    source: "Commander Spellbook",
    cards,
    result: resultTextFromVariant(variant) || "Combo result listed on Commander Spellbook.",
    pattern: variant.bracketTag ? `Commander Spellbook bracket ${variant.bracketTag}` : "Commander Spellbook combo",
    needs: requirementsTextFromVariant(variant),
    steps: variant.description || "",
    popularity: variant.popularity || 0
  };
}

function loadSpellbookCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(SPELLBOOK_CACHE_KEY) || "[]");
    spellbookCombos = Array.isArray(cached) ? cached : [];
  } catch {
    spellbookCombos = [];
  }
  updateSpellbookStatus();
}

async function loadBackendCombos() {
  try {
    const response = await fetch("/api/combos");
    if (!response.ok) return;
    const combos = await response.json();
    if (!Array.isArray(combos) || !combos.length) return;
    spellbookCombos = combos;
    renderCommanderCombos();
    analyzeLiveBoard();
    updateSpellbookStatus(`Loaded ${spellbookCombos.length.toLocaleString()} combo variants from the local database.`);
  } catch {}
}

async function loadBackendStatus() {
  const status = $("#backendStatus");
  if (!status) return;
  try {
    const response = await fetch("/api/status");
    if (!response.ok) throw new Error("No backend");
    const payload = await response.json();
    status.textContent = `Local database: ${payload.cards.toLocaleString()} cards, ${payload.combos.toLocaleString()} combos, ${payload.rulings.toLocaleString()} ruling patterns.`;
  } catch {
    status.textContent = "Local backend not detected. The app is using browser APIs and starter data.";
  }
}

function saveSpellbookCache() {
  try {
    localStorage.setItem(SPELLBOOK_CACHE_KEY, JSON.stringify(spellbookCombos));
  } catch {
    updateSpellbookStatus("Synced combos loaded for this session. Browser storage is full, so they were not cached.");
  }
}

async function syncCommanderSpellbook() {
  if (spellbookSyncing) return;
  spellbookSyncing = true;
  $("#syncSpellbook").disabled = true;
  updateSpellbookStatus("Syncing Commander Spellbook...");

  const synced = [];
  let nextUrl = `${SPELLBOOK_API}/variants?limit=${SPELLBOOK_SYNC_LIMIT}`;
  let pages = 0;

  try {
    try {
      const localSync = await fetch("/api/ingest/spellbook", { method: "POST" });
      if (localSync.ok) {
        const payload = await localSync.json();
        const localCombos = await fetch("/api/combos");
        spellbookCombos = localCombos.ok ? await localCombos.json() : [];
        saveSpellbookCache();
        renderCommanderCombos();
        analyzeLiveBoard();
        updateSpellbookStatus(`Synced ${Number(payload.count || spellbookCombos.length).toLocaleString()} Commander Spellbook variants into the local database.`);
        setStatus("Spellbook synced");
        return;
      }
    } catch {}

    while (nextUrl && pages < SPELLBOOK_MAX_PAGES) {
      const response = await fetch(nextUrl, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Commander Spellbook sync failed");
      const payload = await response.json();
      (payload.results || []).forEach((variant) => {
        const combo = mapSpellbookVariant(variant);
        if (combo) synced.push(combo);
      });
      pages += 1;
      nextUrl = payload.next;
      updateSpellbookStatus(`Syncing Commander Spellbook... ${synced.length.toLocaleString()} variants loaded`);
    }

    spellbookCombos = synced;
    saveSpellbookCache();
    renderCommanderCombos();
    analyzeLiveBoard();
    updateSpellbookStatus(`Synced ${spellbookCombos.length.toLocaleString()} Commander Spellbook variants.`);
    setStatus("Spellbook synced");
  } catch (error) {
    updateSpellbookStatus(`Could not sync Commander Spellbook from this browser. ${error.message || "Starter combos are still available."}`);
    setStatus("Spellbook sync unavailable");
  } finally {
    spellbookSyncing = false;
    $("#syncSpellbook").disabled = false;
  }
}

function clearSpellbookCache() {
  spellbookCombos = [];
  localStorage.removeItem(SPELLBOOK_CACHE_KEY);
  renderCommanderCombos();
  analyzeLiveBoard();
  updateSpellbookStatus();
  setStatus("Spellbook sync cleared");
}

function detectCommanderCombos(cards) {
  const boardNames = new Set(cards.map((card) => normalizeCardName(card.name)));
  return allCommanderCombos().filter((combo) => combo.cards.every((name) => boardNames.has(normalizeCardName(name)))).slice(0, 6);
}

function commanderComboLines(extraCard = null, extraSide = "") {
  const groups = [
    { side: "your board", cards: liveBoard.mine },
    { side: "opponent's board", cards: liveBoard.opponent }
  ];

  if (extraCard && extraSide) {
    const targetGroup = groups.find((group) => group.side === extraSide);
    if (targetGroup) targetGroup.cards = [...targetGroup.cards, extraCard];
  }

  return groups.flatMap((group) =>
    detectCommanderCombos(group.cards).map(
      (combo) =>
        `${group.side === "your board" ? "Your board" : "Opponent's board"} has ${comboCardText(combo)}. This is a Commander combo pattern: ${combo.result} Check the setup: ${combo.needs}`
    )
  );
}

function withCommanderComboLines(whatHappens, extraCard = null, extraSide = "") {
  const lines = commanderComboLines(extraCard, extraSide);
  if (!lines.length) return whatHappens;
  const base = `${whatHappens || ""}`.trim();
  const genericBase = base.startsWith("The engine found the rules concepts") || base.endsWith("is checked against the current board state.");
  return [genericBase ? "" : base, ...lines].filter(Boolean).join("\n");
}

function targetKindFor(card) {
  const text = `${card.text || ""}`.toLowerCase();
  if (text.includes("any target")) return "any target";
  if (text.includes("target creature")) return "target creature";
  if (text.includes("target artifact")) return "target artifact";
  if (text.includes("target enchantment")) return "target enchantment";
  if (text.includes("target nonland permanent")) return "target nonland permanent";
  if (text.includes("target permanent")) return "target permanent";
  if (text.includes("target spell")) return "target spell";
  if (text.includes("target player")) return "target player";
  return "target";
}

function permanentMatchesTarget(card, targetKind) {
  const typeLine = `${card.typeLine || ""}`.toLowerCase();
  if (targetKind === "any target") return true;
  if (targetKind === "target permanent") return true;
  if (targetKind === "target nonland permanent") return !typeLine.includes("land");
  if (targetKind === "target creature") return typeLine.includes("creature");
  if (targetKind === "target artifact") return typeLine.includes("artifact");
  if (targetKind === "target enchantment") return typeLine.includes("enchantment");
  return !targetKind.includes("spell") && !targetKind.includes("player");
}

function describeBoardCard(card, side) {
  return `${card.name} (${side})`;
}

function landSubtypeSummary(card) {
  const typeLine = `${card.typeLine || ""}`;
  const subtypes = typeLine.split("—")[1]?.trim();
  return subtypes || "no printed basic land subtype";
}

function buildStaticBoardEngine() {
  const myCards = liveBoard.mine.map((card) => ({ ...card, side: "my board" }));
  const opponentCards = liveBoard.opponent.map((card) => ({ ...card, side: "opponent board" }));
  const allCards = [...myCards, ...opponentCards];
  const analyzed = allCards.map((card) => classifyCard(card));
  const bloodMoon = analyzed.find((card) => card.features.bloodMoonEffect);
  const nonbasicLands = analyzed.filter((card) => card !== bloodMoon && card.features.nonbasicLand);
  const ruleIds = ["priority"];
  const steps = [];
  const facts = [...new Set(analyzed.flatMap((card) => card.facts || []))];

  if (bloodMoon && nonbasicLands.length) {
    addRule(ruleIds, "layers");
    steps.push(`${bloodMoon.name} creates a continuous effect that applies to nonbasic lands on the battlefield.`);
    steps.push(`${nonbasicLands.map((card) => describeBoardCard(card, card.side)).join(", ")} ${nonbasicLands.length === 1 ? "is" : "are"} nonbasic land${nonbasicLands.length === 1 ? "" : "s"}, so ${bloodMoon.name} applies.`);
    nonbasicLands.forEach((land) => {
      steps.push(`${land.name} becomes a Mountain. It has the Mountain subtype and the intrinsic mana ability "{T}: Add {R}."`);
      steps.push(`${land.name} loses its printed rules text and other land types it had before, unless another effect is adding something back.`);
    });
    steps.push("This does not make the land basic. It remains nonbasic, but its land type and abilities are changed by the continuous effect.");
    steps.push("This effect does not use the stack. It applies as soon as the land is on the battlefield while Blood Moon is active.");
    return {
      title: "Blood Moon and nonbasic lands",
      steps,
      ruleIds,
      whatHappens: `${bloodMoon.name} makes the opponent's nonbasic land a Mountain immediately. It keeps being nonbasic, but it loses its printed text and taps for red while Blood Moon applies.`,
      engine: {
        title: "Continuous effect and layers",
        summary: `${bloodMoon.name} changes each nonbasic land into a Mountain while its effect applies.`,
        facts: ["Clear ruling", ...facts]
      }
    };
  }

  const fallback = buildInteractionEngine([...liveBoard.mine, ...liveBoard.opponent]);
  return {
    ...fallback,
    engine: {
      ...fallback.engine,
      facts: ["Likely ruling", ...fallback.engine.facts]
    }
  };
}

function buildCastInteractionEngine() {
  const castCard = liveBoard.cast;
  if (!castCard) {
    return {
      result: null,
      boardCards: [],
      castAnalysis: null
    };
  }

  const myCards = liveBoard.mine.map((card) => ({ ...card, side: "my board" }));
  const opponentCards = liveBoard.opponent.map((card) => ({ ...card, side: "opponent board" }));
  const boardCards = [...myCards, ...opponentCards];
  const responseCard = liveBoard.response ? { ...liveBoard.response, side: "opponent response" } : null;
  const castAnalysis = classifyCard(castCard);
  const analyzedBoard = boardCards.map((card) => classifyCard(card));
  const responseAnalysis = responseCard ? classifyCard(responseCard) : null;
  const selectedCastTarget = findBoardTarget(liveBoard.castTarget);
  const selectedResponseTarget = findBoardTarget(liveBoard.responseTarget);
  const cardsForFallback = [castCard, ...liveBoard.mine, ...liveBoard.opponent];
  const fallback = buildInteractionEngine(cardsForFallback);
  const ruleIds = ["priority"];
  const steps = [];
  const facts = [...new Set([...(castAnalysis.facts || []), ...(responseAnalysis?.facts || []), ...analyzedBoard.flatMap((card) => card.facts || [])])];
  let title = `${castCard.name} vs live board`;
  let summary = `${castCard.name} is being evaluated against the current permanents on both boards.`;
  let whatHappens = `${castCard.name} is checked against the current board state.`;
  let confidence = "Clear ruling";
  const noManaCounterCards = analyzedBoard.filter((card) => card.features.noManaCounterTrigger);
  const uncounterableCards = analyzedBoard.filter((card) => card.features.makesYourSpellsUncounterable && card.side === "my board");
  const instantSorceryCastTriggers = analyzedBoard.filter((card) => card.side === "my board" && card.features.instantSorceryCastTrigger);
  const krarkTriggers = analyzedBoard.filter((card) => card.side === "my board" && card.features.krarkStyleTrigger);
  const bloodMoonEffects = analyzedBoard.filter((card) => card.features.bloodMoonEffect);
  let originalCounteredByResponse = false;
  const castControllerText = liveBoard.castController === "opponent" ? "opponent" : "you";
  const castControllerPossessive = liveBoard.castController === "opponent" ? "opponent's" : "your";
  const castWasFree = liveBoard.manaMode === "free";
  const castManaUnknown = liveBoard.manaMode === "unknown";
  const responseTargetsCast = liveBoard.responseTarget === "cast";
  const responseTargetsTrigger = liveBoard.responseTarget === "cast-trigger";
  const responseTargetsPermanent = Boolean(selectedResponseTarget);
  let castTargetRemovedByResponse = false;

  if (!boardCards.length && !responseCard) {
    addRule(ruleIds, "priority");
    steps.push(`${castCard.name} is cast and put on the stack.`);
    if (castAnalysis.features.targeter) {
      addRule(ruleIds, "targets");
      steps.push(`${castCard.name} needs a legal ${targetKindFor(castCard)} when it is cast.`);
    }
    steps.push("With no permanents added to either board, the live board does not add any permanent-based interaction.");
    steps.push("Players can still respond with spells or abilities from hidden zones, but those are not represented in this board state.");
    return {
      result: {
        title: castCard.name,
        steps,
        ruleIds,
        engine: {
          title,
          summary,
          facts: facts.length ? facts : ["cast", "stack"]
        }
      },
      boardCards,
      castAnalysis
    };
  }

  if (castAnalysis.features.land) {
    steps.push(`${castCard.name} is a land, so it is played, not cast. It does not use the stack and it cannot be countered as a spell.`);
  } else {
    steps.push(`${castCard.name} is the object being cast by ${castControllerText}, so it starts on the stack before it affects the battlefield.`);
  }

  if (castAnalysis.features.nonbasicLand && bloodMoonEffects.length) {
    addRule(ruleIds, "layers");
    title = `${castCard.name} under Blood Moon`;
    summary = `${bloodMoonEffects.map((card) => card.name).join(", ")} applies immediately to ${castCard.name} as a nonbasic land.`;
    whatHappens = `${castCard.name} enters under Blood Moon as a Mountain. It is still nonbasic, but it loses its printed text and taps for red while Blood Moon applies.`;
    steps.push(`${bloodMoonEffects.map((card) => describeBoardCard(card, card.side)).join(", ")} applies to nonbasic lands as a continuous effect.`);
    steps.push(`As ${castCard.name} enters the battlefield, it is a nonbasic land, so it becomes a Mountain.`);
    steps.push(`${castCard.name} keeps being nonbasic, but it has the Mountain subtype and "{T}: Add {R}."`);
    steps.push(`${castCard.name} loses its printed rules text and other land types while Blood Moon's effect applies, unless another effect adds something back.`);
    steps.push("No player can respond to Blood Moon changing the land after it enters; the effect is continuous and does not use the stack.");
  }

  if (castAnalysis.features.repeatableModalSpell && castAnalysis.features.blinkNonlandPermanent && selectedCastTarget) {
    const targetName = shortCardName(selectedCastTarget.card);
    addRule(ruleIds, "targets");
    addRule(ruleIds, "triggered");
    title = `${castCard.name} repeated blink mode`;
    summary = `${castCard.name} can choose the same blink mode more than once, but blinking the same target multiple times does not keep finding the returned object.`;
    whatHappens = [
      `You cast ${castCard.name}.`,
      "You choose the second mode three times.",
      `You choose ${targetName} as the target for each instance.`,
      `First blink resolves: ${targetName} is exiled and returned tapped.`,
      `${targetName} enters, so its ETB triggers once.`,
      `The remaining two blink instructions do not affect the new ${targetName}.`,
      `You do not get three ${targetName} ETB triggers.`
    ].join("\n");
    steps.push(`${castCard.name} lets you choose the same mode more than once, so choosing the second mode three times is legal.`);
    steps.push(`You can choose ${selectedCastTarget.card.name} as the target for each repeated instance of that mode while casting ${castCard.name}.`);
    steps.push(`When the first blink instruction resolves, ${selectedCastTarget.card.name} is exiled and returned to the battlefield tapped under its owner's control.`);
    steps.push(`The returned ${selectedCastTarget.card.name} is a new game object. It is not the same object that the remaining two repeated target instructions were pointing at.`);
    if (classifyCard(selectedCastTarget.card).features.etbTrigger) {
      steps.push(`Because ${selectedCastTarget.card.name} entered the battlefield, its enter-the-battlefield ability triggers once from that return.`);
    }
    steps.push("The remaining repeated blink instructions do not exile and return the new object, so they do not create additional ETB triggers.");
  }

  const displacerKitten = analyzedBoard.find((card) => card.side === "my board" && card.features.displacerKitten);
  if (displacerKitten && castAnalysis.features.tokenCopyOfCreature && selectedCastTarget) {
    const targetName = shortCardName(selectedCastTarget.card);
    addRule(ruleIds, "priority");
    addRule(ruleIds, "targets");
    addRule(ruleIds, "triggered");
    title = `${displacerKitten.name} and ${castCard.name}`;
    summary = `${displacerKitten.name} can blink ${targetName}, but if it does, ${castCard.name}'s target becomes illegal.`;
    whatHappens = [
      `You cast ${castCard.name} targeting ${targetName}.`,
      `${castCard.name} is a noncreature spell, so ${displacerKitten.name} triggers.`,
      `Yes, you can target ${targetName} with the ${displacerKitten.name} trigger because ${targetName} is a nonland permanent you control.`,
      `The ${displacerKitten.name} trigger goes on the stack above ${castCard.name}.`,
      `If the ${displacerKitten.name} trigger resolves first, ${targetName} is exiled and returned as a new object.`,
      `${targetName} enters, so its ETB ability triggers.`,
      `${castCard.name} is still targeting the old ${targetName} object that left the battlefield.`,
      `When ${castCard.name} tries to resolve, its only target is illegal.`,
      `${castCard.name} does not resolve, so you do not create an ${targetName} token with ${castCard.name}.`
    ].join("\n");
    steps.push(`${displacerKitten.name} triggers when you cast a noncreature spell. ${castCard.name} is a sorcery, so that trigger happens after ${castCard.name} is cast.`);
    steps.push(`${displacerKitten.name}'s trigger can target up to one nonland permanent you control. ${selectedCastTarget.card.name} is legal if you control it.`);
    steps.push(`If ${selectedCastTarget.card.name} leaves and returns before ${castCard.name} resolves, it is a new object.`);
    steps.push(`${castCard.name}'s target was the old object, so ${castCard.name}'s only target is illegal on resolution.`);
    steps.push(`If you want ${castCard.name} to still copy ${selectedCastTarget.card.name}, choose zero targets for ${displacerKitten.name} or blink a different nonland permanent you control.`);
  }

  if (castAnalysis.features.thassasOracle && responseAnalysis?.features.doomsday) {
    addRule(ruleIds, "priority");
    addRule(ruleIds, "triggered");
    title = "Thassa's Oracle plus Doomsday";
    summary = "Doomsday can set up a Thassa's Oracle win, but Oracle checks devotion and library size only when its ETB trigger resolves.";
    whatHappens = [
      "You cast Thassa's Oracle.",
      "Thassa's Oracle resolves and enters the battlefield.",
      "Its enter-the-battlefield trigger goes on the stack.",
      "Doomsday must resolve before that Oracle trigger resolves if you want it to change your library for the Oracle check.",
      "Doomsday leaves you with five cards in your library and exiles the rest.",
      "Then Oracle's trigger resolves.",
      "You look at the top X cards, where X is your devotion to blue.",
      "If your devotion to blue is greater than or equal to the number of cards in your library, you win the game.",
      "So with Doomsday leaving five cards, you need devotion to blue of five or more at Oracle trigger resolution unless you draw or remove more cards first."
    ].join("\n");
    steps.push("Thassa's Oracle's win check is part of a triggered ability, not the spell resolving.");
    steps.push("Doomsday is a sorcery, so by default it cannot be cast after Oracle's trigger is on the stack unless another effect lets you cast it at instant speed.");
    steps.push("The common Doomsday plan is to cast Doomsday first, build a pile, then cast Oracle and use the pile to make the library small enough before Oracle's trigger resolves.");
    steps.push("If your library has five cards when Oracle's trigger resolves, Oracle wins only if your devotion to blue is at least five.");
  }

  if (castAnalysis.features.doomsday && responseAnalysis?.features.thassasOracle) {
    addRule(ruleIds, "priority");
    addRule(ruleIds, "triggered");
    title = "Doomsday into Thassa's Oracle";
    summary = "Doomsday makes the library small, then Thassa's Oracle can win when its ETB trigger resolves if devotion is high enough.";
    whatHappens = [
      "Doomsday resolves first and leaves you with five chosen cards in your library.",
      "Then you cast Thassa's Oracle later from your hand, library, or pile line if you can.",
      "Oracle enters and its ETB trigger goes on the stack.",
      "When that trigger resolves, it compares your devotion to blue to the number of cards in your library.",
      "If devotion is greater than or equal to your library size, you win.",
      "If your library still has five cards, devotion to blue must be five or more unless another effect drew or removed cards from the library first."
    ].join("\n");
    steps.push("Doomsday by itself does not win the game; it sets up a five-card library.");
    steps.push("Thassa's Oracle wins only if its triggered ability resolves with enough devotion relative to your library size.");
  }

  if (castAnalysis.features.returnsCreatureFromAnyGraveyard && responseAnalysis?.features.returnsCreatureFromYourGraveyard) {
    addRule(ruleIds, "priority");
    addRule(ruleIds, "targets");
    title = `${castCard.name} and ${responseCard.name}`;
    summary = `${responseCard.name} can respond, but it cannot target a creature card in ${castControllerPossessive} graveyard because it only targets a creature card from its controller's graveyard.`;
    whatHappens = `${responseCard.name} cannot take the creature card you targeted with ${castCard.name}. If the opponent has their own legal creature card in their graveyard, ${responseCard.name} may return that first. Then ${castCard.name} resolves and returns your targeted creature card if it is still in the graveyard.`;
    steps.push(`${castCard.name} targets a creature card in a graveyard. In your example, that target is a creature card in your graveyard.`);
    steps.push(`${responseCard.name} can be cast in response because it is an instant, so it goes on the stack above ${castCard.name}.`);
    steps.push(`${responseCard.name} says "from your graveyard," meaning from the graveyard of ${responseCard.name}'s controller. Your opponent cannot choose the creature card in your graveyard as its target.`);
    steps.push(`If the opponent has a legal creature card in their own graveyard, ${responseCard.name} can return that card first. That does not change ${castCard.name}'s target.`);
    steps.push(`When ${castCard.name} resolves, it checks whether its target creature card is still in the graveyard. If it is still there, you put it onto the battlefield under your control and lose life equal to its mana value.`);
    steps.push(`If some other legal response exiles or moves the creature card you targeted with ${castCard.name}, then ${castCard.name}'s only target is illegal and ${castCard.name} does not resolve.`);
  }

  if (castAnalysis.features.returnsCreatureFromAnyGraveyard && responseAnalysis?.features.returnsCreatureFromAnyGraveyard) {
    addRule(ruleIds, "priority");
    addRule(ruleIds, "targets");
    title = `${castCard.name} and ${responseCard.name}`;
    summary = `${responseCard.name} can legally target the same creature card in a graveyard. If it resolves first and moves that card, ${castCard.name}'s target is gone.`;
    whatHappens = `If your opponent casts ${responseCard.name} targeting the same creature card in your graveyard, ${responseCard.name} resolves first and returns that card under their control. Then ${castCard.name} tries to resolve, but its only target is no longer in the graveyard, so ${castCard.name} does not resolve and you do not lose life from it.`;
    steps.push(`${castCard.name} targets a creature card in a graveyard. In your example, that target is a creature card in your graveyard.`);
    steps.push(`${responseCard.name} is an instant, so your opponent can cast it in response while ${castCard.name} is still on the stack.`);
    steps.push(`${responseCard.name} also targets a creature card from a graveyard, so it can legally choose the same creature card in your graveyard.`);
    steps.push(`${responseCard.name} is on top of the stack, so it resolves first if everyone passes.`);
    steps.push(`When ${responseCard.name} resolves, that creature card leaves the graveyard and enters the battlefield under your opponent's control. It gains indestructible from ${responseCard.name}.`);
    steps.push(`Then ${castCard.name} tries to resolve. Its target is no longer in the graveyard, so the target is illegal.`);
    steps.push(`Because ${castCard.name} has no legal target left, it does not resolve. You do not return the creature and you do not lose life from ${castCard.name}.`);
  }

  if (instantSorceryCastTriggers.length && includesAny(castAnalysis.text, ["instant", "sorcery"])) {
    addRule(ruleIds, "triggered");
    steps.push(`${instantSorceryCastTriggers.map((card) => card.name).join(", ")} triggers when you finish casting ${castCard.name}. That trigger is put on the stack above ${castCard.name} before any player can respond.`);
  }

  if (responseAnalysis?.features.counterspell && responseTargetsCast) {
    addRule(ruleIds, "targets");
    originalCounteredByResponse = true;
    steps.push(`Opponent response: ${responseCard.name} is cast after ${castCard.name} and any cast triggers are already on the stack. If it targets ${castCard.name}, it goes on top of the stack and resolves before those lower objects.`);
    steps.push(`If ${responseCard.name} resolves first, it counters ${castCard.name}; ${castCard.name} leaves the stack and will not resolve.`);
    whatHappens = `${responseCard.name} counters ${castCard.name}. The original spell leaves the stack and does not resolve.`;
  }

  if (responseAnalysis?.features.counterspell && responseTargetsTrigger) {
    addRule(ruleIds, "targets");
    if (responseAnalysis.features.countersAbility || responseAnalysis.features.countersSpellOrAbility) {
      whatHappens = `${responseCard.name} counters the triggered ability. The trigger does not resolve, but ${castCard.name} remains on the stack unless something else counters it.`;
      steps.push(`Opponent response: ${responseCard.name} is targeting a triggered ability. Because it can counter abilities, it can target the cast trigger if that trigger is on the stack.`);
      if (krarkTriggers.length) {
        steps.push(`If ${responseCard.name} counters ${krarkTriggers.map((card) => card.name).join(", ")}'s trigger, no coin is flipped and that trigger does not copy or return ${castCard.name}.`);
      }
      steps.push(`${castCard.name} remains on the stack unless some other effect counters or moves it.`);
    } else {
      confidence = "Invalid target";
      whatHappens = `${responseCard.name} cannot legally target that triggered ability with its current wording. Choose the cast spell as the target, or use a card that can counter abilities.`;
      steps.push(`Opponent response target issue: ${responseCard.name} appears to counter spells, not triggered abilities. It cannot legally target a cast trigger or ability with the current Oracle text.`);
      steps.push(`If the opponent wants to stop the trigger, they need a card that can counter a triggered ability, such as an effect worded "counter target activated or triggered ability."`);
    }
  }

  if (responseAnalysis?.features.counterspell && liveBoard.responseTarget === "other") {
    addRule(ruleIds, "targets");
    confidence = "Needs target details";
    whatHappens = `${responseCard.name} is aimed at something outside the modeled stack interaction, so it does not affect ${castCard.name} or its trigger unless the target is changed.`;
    steps.push(`Opponent response: ${responseCard.name} is set to target something else. This means it does not counter ${castCard.name} or the cast trigger unless the target choice is changed.`);
    steps.push("To produce a precise ruling, set the response target to the cast spell or the cast trigger, or add the actual object being targeted to the board state.");
  }

  if (responseCard && responseTargetsPermanent) {
    addRule(ruleIds, "targets");
    steps.push(`Opponent response: ${responseCard.name} targets ${selectedResponseTarget.label}. It is on top of the stack and resolves before ${castCard.name}.`);
    if (responseAnalysis?.features.exile || responseAnalysis?.features.destroy) {
      steps.push(`If ${responseCard.name} resolves, ${selectedResponseTarget.card.name} leaves the battlefield before ${castCard.name} resolves.`);
      if (selectedCastTarget && selectedCastTarget.key === selectedResponseTarget.key && castAnalysis.features.targeter) {
        castTargetRemovedByResponse = true;
        whatHappens = `${responseCard.name} removes ${selectedResponseTarget.card.name} before ${castCard.name} resolves. Since ${castCard.name}'s only target is gone, ${castCard.name} does not resolve.`;
        steps.push(`${castCard.name}'s chosen target was ${selectedCastTarget.card.name}, so that target is now illegal when ${castCard.name} tries to resolve.`);
      }
    }
  }

  if (krarkTriggers.length && responseAnalysis?.features.counterspell && responseTargetsCast && includesAny(castAnalysis.text, ["instant", "sorcery"])) {
    addRule(ruleIds, "triggered");
    addRule(ruleIds, "copy");
    title = `${castCard.name}, Krark trigger, and counter response`;
    summary = `The opponent's counterspell can resolve before the Krark trigger, but the Krark trigger still resolves afterward.`;
    whatHappens = `${responseCard.name} counters ${castCard.name} first. Krark's trigger still resolves afterward: losing the flip returns nothing, while winning creates a copy that can still resolve.`;
    steps.push(`Then ${krarkTriggers.map((card) => card.name).join(", ")}'s trigger resolves even though ${castCard.name} is no longer on the stack.`);
    steps.push(`If you lose the coin flip, ${castCard.name} cannot be returned to your hand because it is no longer on the stack. It stays wherever the counterspell put it, usually the graveyard.`);
    steps.push(`If you win the coin flip, Krark still creates a copy of ${castCard.name} even though the original was countered. The copy is created on the stack and can resolve if no one counters it.`);
  }

  if (castManaUnknown) {
    confidence = "Needs one choice";
    steps.push(`Missing info: whether mana was spent to cast ${castCard.name} matters for effects that care about spells cast for no mana.`);
  }

  if (noManaCounterCards.length) {
    addRule(ruleIds, "triggered");
    addRule(ruleIds, "targets");
    const baubleNames = noManaCounterCards.map((card) => describeBoardCard(card, card.side)).join(", ");
    steps.push(`${baubleNames} watches for spells cast with no mana spent to cast them. It counters spells, not triggered abilities.`);
    if (castWasFree) {
      steps.push(`Because the cast setting says no mana was spent, ${baubleNames} triggers for ${castCard.name} itself as it is cast.`);
      if (liveBoard.castController === "mine" && uncounterableCards.length) {
        steps.push(`${uncounterableCards.map((card) => describeBoardCard(card, card.side)).join(", ")} says spells you control can't be countered, so that trigger cannot counter ${castCard.name}.`);
      } else {
        steps.push(`If nothing says ${castControllerPossessive} spells can't be countered, that trigger can counter ${castCard.name}.`);
      }
    } else if (!castManaUnknown) {
      steps.push(`Because the cast setting says mana was spent to cast ${castCard.name}, ${baubleNames} does not trigger for ${castCard.name} itself.`);
    }
    if (liveBoard.castController === "mine" && uncounterableCards.length) {
      steps.push(`${uncounterableCards.map((card) => describeBoardCard(card, card.side)).join(", ")} says spells you control can't be countered, so counter effects can still trigger but they fail to counter your spells while that effect applies.`);
    }
  }

  if (castAnalysis.features.etbTrigger) {
    addRule(ruleIds, "triggered");
    if (noManaCounterCards.length) {
      steps.push(`Bottom line: ${noManaCounterCards.map((card) => card.name).join(", ")} does not counter ${castCard.name}'s ETB ability, because that ability is a triggered ability, not a spell being cast.`);
    }
    steps.push(`${castCard.name} entering the battlefield creates a triggered ability. That ETB ability is not a spell, so effects that say "counter that spell" do not counter the ETB ability itself.`);
  }

  if (castAnalysis.features.castsWithoutPaying) {
    addRule(ruleIds, "triggered");
    addRule(ruleIds, "priority");
    title = `${castCard.name} ETB vs live board`;
    summary = `${castCard.name}'s ETB ability is checked separately from the spells it may let you cast without paying mana.`;
    whatHappens = `${castCard.name}'s ETB ability is not a spell, so spell-countering effects do not counter that ability. Any free spells cast from the ETB are checked separately.`;
    steps.push(`When ${castCard.name}'s ETB ability resolves, it can let you cast exiled nonland cards without paying their mana costs.`);
    if (noManaCounterCards.length) {
      steps.push(`Each spell you cast this way has no mana spent to cast it, so ${noManaCounterCards.map((card) => card.name).join(", ")} will trigger for each of those spells.`);
      if (uncounterableCards.length) {
        steps.push(`Because ${uncounterableCards.map((card) => card.name).join(", ")} says your spells can't be countered, those triggered abilities cannot actually counter the spells you control while that effect remains true.`);
      } else if (liveBoard.castController === "opponent") {
        steps.push(`Hexing-style protection on your board protects your spells, not the opponent's spells. If the opponent controls the free spells, your "spells you control can't be countered" effect will not protect them.`);
      } else {
        steps.push(`Without an effect saying your spells can't be countered, those no-mana counter triggers can counter the free spells cast from ${castCard.name}'s ETB ability.`);
      }
    }
  }

  if (castAnalysis.features.targeter) {
    addRule(ruleIds, "targets");
    const targetKind = targetKindFor(castCard);
    const possibleTargets = boardCards.filter((card) => permanentMatchesTarget(card, targetKind));
    if (selectedCastTarget) {
      steps.push(`${castCard.name} is set to target ${selectedCastTarget.label}.`);
    } else if (possibleTargets.length) {
      steps.push(`${castCard.name} asks for ${targetKind}. On this board, likely permanent targets include ${possibleTargets.map((card) => describeBoardCard(card, card.side)).join(", ")}.`);
    } else {
      steps.push(`${castCard.name} asks for ${targetKind}, and no current battlefield permanent clearly matches that target requirement.`);
    }

    possibleTargets.forEach((card) => {
      const analyzed = classifyCard(card);
      if (analyzed.features.wardSelf) {
        addRule(ruleIds, "triggered");
        steps.push(`If ${castCard.name} targets ${card.name}, ${card.name}'s ward ability triggers and goes on the stack above ${castCard.name}.`);
        steps.push(`When that ward trigger resolves, ${castCard.name}'s controller must pay the ward cost or ${castCard.name} is countered.`);
      }
    });
  } else {
    steps.push(`${castCard.name} does not appear to use the word "target", so it does not choose specific targets as it is cast unless another effect changes how it is cast.`);
  }

  analyzedBoard.forEach((card) => {
    if (card.features.wardGranter && castAnalysis.features.targeter) {
      addRule(ruleIds, "triggered");
      steps.push(`${card.name} grants ward to a subset of permanents. Before choosing a target for ${castCard.name}, check whether the chosen permanent is one of the objects ${card.name} protects.`);
    }

    if (card.features.triggerStopper && castAnalysis.features.etbTrigger) {
      addRule(ruleIds, "triggered");
      steps.push(`${card.name} stops relevant enter-the-battlefield abilities from triggering. If ${castCard.name} enters as a creature, its ETB ability may never go on the stack.`);
    }

    if (card.features.graveyardReplacement && (castAnalysis.features.damage || castAnalysis.features.destroy || castAnalysis.features.exile)) {
      addRule(ruleIds, "replacement");
      addRule(ruleIds, "sba");
      steps.push(`${card.name} can replace where cards go after ${castCard.name} deals damage, destroys something, or causes a graveyard event.`);
    }

    if (card.features.typeChanger || card.features.nonbasicLandRule) {
      addRule(ruleIds, "layers");
      steps.push(`${card.name} has a continuous effect. Apply it before deciding the final characteristics of any affected permanents while ${castCard.name} is resolving.`);
    }
  });

  if (castTargetRemovedByResponse) {
    addRule(ruleIds, "targets");
    steps.push(`Because all of ${castCard.name}'s targets are illegal when it tries to resolve, ${castCard.name} does not resolve and none of its effects happen.`);
    if (castAnalysis.features.tokenCopyOfCreature) {
      steps.push(`${castCard.name} creates no token copy, so no copied creature enters and no enter-the-battlefield ability from that token triggers.`);
      whatHappens = `${responseCard.name} removes ${selectedResponseTarget.card.name} before ${castCard.name} resolves. ${castCard.name} has no legal target, so it creates no token and no ETB trigger happens from a token copy.`;
    }
  } else if (originalCounteredByResponse && krarkTriggers.length) {
    addRule(ruleIds, "sba");
    steps.push(`The original ${castCard.name} will not resolve after being countered. Only a copy created by the Krark trigger can resolve from this sequence.`);
    steps.push("After any surviving copy resolves, apply its effects, then check state-based actions before any player gets priority again.");
  } else if (originalCounteredByResponse) {
    steps.push(`Because ${castCard.name} was countered by ${responseCard.name}, the original spell will not resolve.`);
  } else if (castAnalysis.features.land) {
    steps.push(`After ${castCard.name} is played, the game continues with ${castCard.name} affected by any applicable continuous effects.`);
  } else if (castAnalysis.features.damage || castAnalysis.features.destroy || castAnalysis.features.exile) {
    addRule(ruleIds, "sba");
    steps.push(`After ${castCard.name} resolves, apply its damage, destroy, or exile instructions as much as possible.`);
    steps.push("Then state-based actions are checked before any player gets priority again.");
  } else {
    steps.push(`When ${castCard.name} resolves, follow its Oracle text as much as possible, then check state-based actions.`);
  }

  if (steps.length <= 3) {
    fallback.ruleIds.forEach((id) => addRule(ruleIds, id));
    fallback.steps.forEach((step) => steps.push(step));
    title = fallback.engine.title;
    summary = fallback.engine.summary;
  }

  return {
    result: {
      title: castCard.name,
      steps: [...new Set(steps)],
      ruleIds,
      whatHappens,
      engine: {
        title,
        summary,
        facts: facts.length ? [confidence, ...facts] : [confidence, ...fallback.engine.facts]
      }
    },
    boardCards,
    castAnalysis
  };
}

function analyzeLiveBoard() {
  if (!liveBoard.cast && !liveBoard.mine.length && !liveBoard.opponent.length) {
    $("#questionTitle").textContent = "Waiting for a cast";
    $("#questionAnswer").innerHTML = `<p>Add cards to either board, then choose a card to cast with the current board state.</p>`;
    renderFocus(["priority"]);
    return;
  }

  if (!liveBoard.cast) {
    const boardOnly = buildStaticBoardEngine();
    const related = boardOnly.ruleIds.map((id) => rules.find((rule) => rule.id === id)).filter(Boolean);
    $("#questionTitle").textContent = boardOnly.engine.facts.includes("Clear ruling") ? "Current board ruling" : "Choose a card to cast";
    $("#questionAnswer").innerHTML = `
      ${buildBoardStateSummary()}
      <div class="what-happens">
        <h3>What happens</h3>
        ${renderWhatHappens(withCommanderComboLines(boardOnly.whatHappens || boardOnly.engine.summary))}
      </div>
      <div class="engine-summary active">
        <h3>${escapeHtml(boardOnly.engine.title)}</h3>
        <p>${escapeHtml(boardOnly.engine.summary)}</p>
        <div class="engine-facts">${boardOnly.engine.facts.map((fact) => `<span class="engine-fact">${escapeHtml(fact)}</span>`).join("")}</div>
      </div>
      <ol class="steps">${boardOnly.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      ${related
        .map(
          (rule) => `
            <div class="mini-rule">
              <strong>${rule.refs}</strong>
              <p>${rule.summary}</p>
            </div>
          `
        )
        .join("")}
      <p>Set a cast or played card if you want to test a new object entering this board state.</p>
    `;
    renderFocus(boardOnly.ruleIds);
    return;
  }

  const castEngine = buildCastInteractionEngine();
  const result = castEngine.result;
  const related = result.ruleIds.map((id) => rules.find((rule) => rule.id === id)).filter(Boolean);
  const castComboSide = liveBoard.castController === "opponent" ? "opponent's board" : "your board";
  $("#questionTitle").textContent = liveBoard.cast ? `Casting ${liveBoard.cast.name}` : "Current board";
  $("#questionAnswer").innerHTML = `
    ${buildBoardStateSummary()}
    <div class="what-happens">
      <h3>What happens</h3>
      ${renderWhatHappens(withCommanderComboLines(result.whatHappens || result.engine.summary, liveBoard.cast, castComboSide))}
    </div>
    <div class="engine-summary active">
      <h3>${escapeHtml(result.engine.title)}</h3>
      <p>${escapeHtml(result.engine.summary)}</p>
      <div class="engine-facts">${result.engine.facts.map((fact) => `<span class="engine-fact">${escapeHtml(fact)}</span>`).join("")}</div>
    </div>
    <ol class="steps">${result.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
    ${related
      .map(
        (rule) => `
          <div class="mini-rule">
            <strong>${rule.refs}</strong>
            <p>${rule.summary}</p>
          </div>
        `
      )
      .join("")}
  `;
  renderFocus(result.ruleIds);
}

async function addCardFromQuery(query) {
  const value = query.trim();
  if (!value) return;

  let card;
  try {
    hideCardSuggestions();
    card = await fetchCard(value);
  } catch {
    setStatus("Card not found");
    return;
  }

  selectedCards = [...selectedCards.filter((item) => item.name !== card.name), card].slice(-4);
  $("#cardSearch").value = "";
  renderSelectedCards();

  try {
    explainSelectedCards();
    setStatus("Card loaded");
  } catch (error) {
    console.error(error);
    setStatus("Engine error");
  }
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function classifyCard(card) {
  const text = `${card.name || ""} ${card.typeLine || ""} ${card.text || ""} ${(card.keywords || []).join(" ")}`.toLowerCase();
  const typeText = `${card.typeLine || ""}`.toLowerCase();
  const isLand = typeText.includes("land");
  const isBasicLand = typeText.includes("basic land");
  const isPermanent = includesAny(text, ["creature", "artifact", "enchantment", "planeswalker", "battle", "land"]);
  const hasEtbTrigger = /(when|whenever) .* enters/.test(text) || text.includes("when this creature enters");
  const grantsWard = text.includes("has ward") || text.includes("have ward") || text.includes("gain ward");
  const makesYourSpellsUncounterable = text.includes("spells you control can't be countered");
  const noManaCounterTrigger = text.includes("if no mana was spent to cast it") && text.includes("counter that spell");
  const castsWithoutPaying = text.includes("cast") && text.includes("without paying") && text.includes("mana cost");
  const instantSorceryCastTrigger = text.includes("whenever you cast an instant or sorcery spell");
  const krarkStyleTrigger = instantSorceryCastTrigger && text.includes("flip a coin") && text.includes("return that spell") && text.includes("copy that spell");
  const tokenCopyOfCreature =
    (text.includes("token") && text.includes("copy of target creature")) ||
    (text.includes("token") && text.includes("copy of") && text.includes("target creature"));
  const repeatableModalSpell = text.includes("you may choose the same mode more than once");
  const blinkNonlandPermanent = text.includes("exile target nonland permanent") && text.includes("return it to the battlefield");
  const returnsCreatureFromAnyGraveyard = text.includes("target creature card from a graveyard");
  const returnsCreatureFromYourGraveyard = text.includes("target creature card from your graveyard");
  const thassasOracle = text.includes("thassa's oracle") && text.includes("greater than or equal to the number of cards in your library");
  const doomsday = text.includes("doomsday") && text.includes("search your library and graveyard for five cards");
  const displacerKitten = text.includes("displacer kitten") && text.includes("whenever you cast a noncreature spell") && text.includes("exile up to one target nonland permanent you control");
  const features = {
    targeter: /\btarget\b/.test(text),
    counterspell: text.includes("counter target") || text.includes("counter up to one target"),
    countersOnlySpell: text.includes("counter target spell") && !text.includes("activated or triggered ability"),
    countersAbility: text.includes("counter target activated or triggered ability") || text.includes("counter target triggered ability") || text.includes("counter target ability"),
    countersSpellOrAbility: text.includes("counter target spell or ability"),
    ward: text.includes("ward"),
    wardSelf: text.includes("ward") && !grantsWard,
    wardGranter: grantsWard,
    hexproof: text.includes("hexproof"),
    grantsHexproof: text.includes("gains hexproof") || text.includes("hexproof until") || text.includes("have hexproof"),
    protection: text.includes("protection from"),
    etbTrigger: hasEtbTrigger,
    triggerStopper: text.includes("entering") && text.includes("don't cause abilities to trigger"),
    noManaCounterTrigger,
    makesYourSpellsUncounterable,
    selfUncounterable: text.includes("this spell can't be countered") || text.includes("can't be countered"),
    castsWithoutPaying,
    instantSorceryCastTrigger,
    krarkStyleTrigger,
    tokenCopyOfCreature,
    repeatableModalSpell,
    blinkNonlandPermanent,
    returnsCreatureFromAnyGraveyard,
    returnsCreatureFromYourGraveyard,
    thassasOracle,
    doomsday,
    displacerKitten,
    replacement: includesAny(text, [" instead", "as this enters", "as it enters", "enters the battlefield with", "skip "]),
    graveyardReplacement: text.includes("would be put into a graveyard") || (text.includes("graveyard") && text.includes("exile") && text.includes("instead")),
    damage: /deals? \d+ damage/.test(text) || text.includes("deals damage"),
    destroy: text.includes("destroy target") || text.includes("destroy all"),
    exile: text.includes("exile target") || text.includes("exile all"),
    trample: text.includes("trample"),
    deathtouch: text.includes("deathtouch"),
    firstStrike: text.includes("first strike") || text.includes("double strike"),
    copy: text.includes("copy") || text.includes("becomes a copy"),
    counters: text.includes("counter") && !text.includes("counter target"),
    auraEquipment: includesAny(text, ["enchant ", "equip ", "equipped creature", "enchanted creature"]),
    typeChanger:
      includesAny(text, ["are mountains", "are swamps", "loses all abilities", "base power and toughness"]) ||
      (text.includes("becomes") && !text.includes("becomes the target")),
    nonbasicLandRule: text.includes("nonbasic lands") || text.includes("each land is"),
    bloodMoonEffect: text.includes("nonbasic lands are mountains"),
    land: isLand,
    nonbasicLand: isLand && !isBasicLand,
    spell: includesAny(text, ["instant", "sorcery"]),
    permanent: isPermanent
  };

  const facts = [];
  if (features.targeter) facts.push("targets");
  if (features.counterspell) facts.push("counters spells");
  if (features.countersAbility) facts.push("counters abilities");
  if (features.noManaCounterTrigger) facts.push("counters free spells");
  if (features.makesYourSpellsUncounterable) facts.push("your spells can't be countered");
  if (features.castsWithoutPaying) facts.push("casts spells for free");
  if (features.instantSorceryCastTrigger) facts.push("instant/sorcery cast trigger");
  if (features.krarkStyleTrigger) facts.push("coin-flip cast trigger");
  if (features.wardSelf) facts.push("ward");
  if (features.wardGranter) facts.push("grants ward");
  if (features.hexproof || features.grantsHexproof) facts.push("hexproof");
  if (features.etbTrigger) facts.push("ETB trigger");
  if (features.triggerStopper) facts.push("stops ETB triggers");
  if (features.replacement) facts.push("replacement effect");
  if (features.graveyardReplacement) facts.push("graveyard replacement");
  if (features.trample) facts.push("trample");
  if (features.deathtouch) facts.push("deathtouch");
  if (features.copy) facts.push("copy effect");
  if (features.tokenCopyOfCreature) facts.push("token copy spell");
  if (features.repeatableModalSpell) facts.push("repeatable modes");
  if (features.blinkNonlandPermanent) facts.push("blink mode");
  if (features.returnsCreatureFromAnyGraveyard) facts.push("graveyard target");
  if (features.returnsCreatureFromYourGraveyard) facts.push("own graveyard only");
  if (features.thassasOracle) facts.push("Oracle win check");
  if (features.doomsday) facts.push("five-card library setup");
  if (features.displacerKitten) facts.push("noncreature spell blink trigger");
  if (features.typeChanger || features.nonbasicLandRule) facts.push("continuous effect");
  if (features.bloodMoonEffect) facts.push("Blood Moon effect");
  if (features.nonbasicLand) facts.push("nonbasic land");

  return { ...card, text, features, facts };
}

function addRule(ruleIds, id) {
  if (!ruleIds.includes(id)) ruleIds.push(id);
}

function findCard(cards, predicate) {
  return cards.find((card) => predicate(card.features, card));
}

function buildInteractionEngine(cards) {
  const analyzed = cards.map(classifyCard);
  const names = analyzed.map((card) => card.name).join(" + ");
  const ruleIds = ["priority"];
  const steps = [];
  const facts = [...new Set(analyzed.flatMap((card) => card.facts))];
  let title = "Oracle-based interaction";
  let summary = "The engine found the rules concepts in the selected Oracle text and built a likely resolution path.";

  const targeter = findCard(analyzed, (features) => features.targeter && !features.counterspell);
  const counterspell = findCard(analyzed, (features) => features.counterspell);
  const wardPermanent = findCard(analyzed, (features) => features.wardSelf);
  const wardGranter = findCard(analyzed, (features) => features.wardGranter);
  const hexproofCard = findCard(analyzed, (features) => features.grantsHexproof || features.hexproof || features.protection);
  const etbCard = findCard(analyzed, (features) => features.etbTrigger);
  const triggerStopper = findCard(analyzed, (features) => features.triggerStopper);
  const graveyardReplacement = findCard(analyzed, (features) => features.graveyardReplacement);
  const destroyOrDamage = findCard(analyzed, (features) => features.destroy || features.damage || features.exile);
  const typeChanger = findCard(analyzed, (features) => features.typeChanger || features.nonbasicLandRule);
  const copyCard = findCard(analyzed, (features) => features.copy);
  const modifiedCard = findCard(analyzed, (features, card) => card !== copyCard && (features.counters || features.auraEquipment || features.typeChanger));
  const trampler = findCard(analyzed, (features) => features.trample);
  const deathtoucher = findCard(analyzed, (features) => features.deathtouch);

  if (counterspell && analyzed.length > 1) {
    addRule(ruleIds, "targets");
    title = "Counterspell check";
    summary = `${counterspell.name} can interact only with an object that is still a legal target on the stack.`;
    steps.push(`${counterspell.name} is cast targeting a spell on the stack, not a permanent already on the battlefield.`);
    steps.push("Players get priority to respond before the counterspell resolves.");
    steps.push(`When ${counterspell.name} resolves, it checks whether its target spell is still legal.`);
    steps.push("If the target is legal, that spell is countered and put into its owner's graveyard unless another effect changes where it goes.");
    steps.push("If the target became illegal or is no longer on the stack, the counterspell does not resolve.");
  }

  if (targeter && wardPermanent && targeter !== wardPermanent) {
    addRule(ruleIds, "targets");
    addRule(ruleIds, "triggered");
    title = "Targeting a ward permanent";
    summary = `${targeter.name} appears to target ${wardPermanent.name}, and ward creates a triggered ability above the original spell or ability.`;
    steps.push(`${targeter.name} is put on the stack and chooses ${wardPermanent.name} as a target if it is a legal target.`);
    steps.push(`${wardPermanent.name}'s ward ability triggers because it became the target of a spell or ability an opponent controls.`);
    steps.push("The ward trigger is put on the stack above the original object.");
    steps.push(`When the ward trigger resolves, ${targeter.name}'s controller must pay the ward cost or ${targeter.name} is countered.`);
    steps.push(`If the cost is paid, ${targeter.name} remains on the stack and can resolve later if its target is still legal.`);
  }

  if (targeter && wardGranter && targeter !== wardGranter && !steps.length) {
    addRule(ruleIds, "targets");
    addRule(ruleIds, "triggered");
    title = "Granted ward check";
    summary = `${wardGranter.name} appears to grant ward to other eligible permanents, so the protected object matters.`;
    steps.push(`${targeter.name} chooses its target as it is put on the stack.`);
    steps.push(`${wardGranter.name} does not automatically mean every permanent has ward. Check exactly which objects its text grants ward to.`);
    steps.push(`If ${targeter.name} targets a permanent currently granted ward by ${wardGranter.name}, that ward ability triggers and goes on the stack above ${targeter.name}.`);
    steps.push(`When the ward trigger resolves, ${targeter.name}'s controller must pay the ward cost or ${targeter.name} is countered.`);
    steps.push(`If ${targeter.name} targets ${wardGranter.name} itself and ${wardGranter.name} only grants ward to other objects, no ward trigger happens from that grant.`);
  }

  if (targeter && hexproofCard && targeter !== hexproofCard) {
    addRule(ruleIds, "targets");
    title = "Target legality can change";
    summary = `${hexproofCard.name} can affect whether ${targeter.name}'s target remains legal before resolution.`;
    steps.push(`${targeter.name} chooses its target as it is put on the stack.`);
    steps.push(`${hexproofCard.name} can be used before ${targeter.name} resolves if its timing allows it.`);
    steps.push(`If the target gains hexproof or relevant protection from ${targeter.name}'s controller, the game checks that target again on resolution.`);
    steps.push(`If all of ${targeter.name}'s targets are illegal then, ${targeter.name} does not resolve and none of its effects happen.`);
    steps.push("If at least one target is still legal, the spell or ability resolves and affects only the legal targets it can.");
  }

  if (triggerStopper && etbCard && triggerStopper !== etbCard) {
    addRule(ruleIds, "triggered");
    title = "ETB trigger suppression";
    summary = `${triggerStopper.name} stops the enter-the-battlefield ability on ${etbCard.name} from triggering.`;
    steps.push(`${triggerStopper.name} must already apply at the moment ${etbCard.name} enters the battlefield.`);
    steps.push(`${etbCard.name} enters the battlefield, then the game checks whether any abilities trigger from that event.`);
    steps.push(`${triggerStopper.name}'s effect says that event does not cause the relevant abilities to trigger.`);
    steps.push(`${etbCard.name}'s enter-the-battlefield ability is never put on the stack.`);
    steps.push(`Removing ${triggerStopper.name} afterward does not recreate a trigger that was prevented from triggering.`);
  }

  if (graveyardReplacement && destroyOrDamage && graveyardReplacement !== destroyOrDamage) {
    addRule(ruleIds, "replacement");
    addRule(ruleIds, "sba");
    title = "Graveyard event replacement";
    summary = `${graveyardReplacement.name} can replace where cards go after ${destroyOrDamage.name} destroys, damages, or exiles objects.`;
    steps.push(`${destroyOrDamage.name} resolves or damage is dealt, then the game determines what would go to the graveyard.`);
    steps.push(`${graveyardReplacement.name}'s replacement effect changes that event before it happens.`);
    steps.push("Because replacement effects do not use the stack, players cannot wait for the card to start going to the graveyard and then respond.");
    steps.push("If multiple replacement effects apply to the same object, the affected object's controller or affected player usually chooses the order.");
  }

  if (typeChanger && !steps.length) {
    addRule(ruleIds, "layers");
    title = "Continuous effect and layers";
    summary = `${typeChanger.name} changes characteristics continuously, so the layer system decides the final result.`;
    steps.push(`${typeChanger.name}'s continuous effect is active as long as its stated condition is true.`);
    steps.push("Apply continuous effects in layer order before deciding the object's final text, type, abilities, power, or toughness.");
    steps.push("Type-changing effects are applied before ability-adding or ability-removing effects in later layers.");
    steps.push("If two effects depend on one another, dependency can change the order; otherwise timestamp order often breaks ties within a layer.");
    if (typeChanger.features.nonbasicLandRule) {
      steps.push("If a nonbasic land becomes a basic land type, it gains the intrinsic mana ability for that type and usually loses its printed rules text unless another effect says otherwise.");
    }
  }

  if (copyCard) {
    addRule(ruleIds, "copy");
    if (modifiedCard) addRule(ruleIds, "layers");
    title = "Copy values check";
    summary = `${copyCard.name} uses copiable values, so counters, Auras, Equipment, and many temporary changes are treated separately.`;
    steps.push(`${copyCard.name}'s copy effect looks for the object's copiable values.`);
    steps.push("Copiable values usually mean printed characteristics plus other copy effects that already changed those values.");
    if (modifiedCard) {
      steps.push(`${modifiedCard.name}'s counters, Auras, Equipment, damage, and most non-copy continuous effects are not copied.`);
    }
    steps.push(`${copyCard.name} becomes or enters as the copied object using those copiable values.`);
    steps.push("After the copy exists, other continuous effects, counters, and attachments can apply to it normally.");
  }

  if (trampler && deathtoucher) {
    addRule(ruleIds, "combat");
    addRule(ruleIds, "sba");
    title = "Combat damage shortcut";
    summary = `${trampler.name === deathtoucher.name ? trampler.name : `${trampler.name} and ${deathtoucher.name}`} creates a trample/deathtouch-style damage question.`;
    steps.push("During combat damage assignment, an attacking creature with trample must assign lethal damage to blockers before assigning excess damage to the defending player or planeswalker.");
    steps.push("Deathtouch makes any nonzero combat damage from that source lethal for damage assignment.");
    steps.push("That means 1 damage can usually be assigned to each blocker, with the rest assigned as trample damage.");
    steps.push("Damage is dealt simultaneously in the relevant combat damage step.");
    steps.push("State-based actions then destroy creatures that have lethal damage.");
  }

  if (!steps.length) {
    analyzed.forEach((card) => {
      if (card.features.targeter) {
        addRule(ruleIds, "targets");
        steps.push(`${card.name} uses the word "target", so its targets are chosen as it is put on the stack and checked again as it resolves.`);
      }
      if (card.features.etbTrigger) {
        addRule(ruleIds, "triggered");
        steps.push(`${card.name} has an enter-the-battlefield triggered ability, so it triggers after the event and then goes on the stack.`);
      }
      if (card.features.replacement) {
        addRule(ruleIds, "replacement");
        steps.push(`${card.name} appears to use a replacement effect, which modifies an event before it happens and does not use the stack.`);
      }
    });
  }

  if (!steps.length) {
    steps.push("The engine did not find a high-confidence card-to-card rule collision yet.");
    steps.push("Start by asking which object is on the stack, what it targets, and whether either card creates a triggered, replacement, or continuous effect.");
    steps.push("After each spell or ability resolves, check state-based actions before any player gets priority.");
    addRule(ruleIds, "targets");
  }

  return {
    title: names || "Selected cards",
    steps: [...new Set(steps)],
    ruleIds,
    engine: {
      title,
      summary,
      facts: facts.length ? facts : ["priority", "stack check", "Oracle text scan"]
    }
  };
}

function inferRuleIdsFromCards(cards) {
  return buildInteractionEngine(cards).ruleIds;
}

function explainSelectedCards() {
  const result = buildInteractionEngine(selectedCards);
  renderAnswer(result.title, result.steps, result.ruleIds, result.engine);
}

function analyzeQuestion() {
  hideLiveSuggestions();
  analyzeLiveBoard();
  renderRulingPrompt();
}

function switchLibraryTab(tabName) {
  $$("[data-library-tab]").forEach((button) => {
    const isActive = button.dataset.libraryTab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  $$("[data-library-pane]").forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.libraryPane === tabName);
  });
}

function bindEvents() {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));

  $("#scenarioStrip").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-scenario]");
    if (!button) return;
    const scenario = scenarios.find((item) => item.id === button.dataset.scenario);
    renderAnswer(scenario.title, scenario.steps, scenario.ruleIds);
    selectedCards = scenario.cards.map((name) => ({ name, text: "Load this card with search to view current Oracle text.", image: "" }));
    renderSelectedCards();
  });

  $("#ruleList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-rule]");
    if (!button) return;
    renderRuleDetail(button.dataset.rule);
  });

  $("#relatedRules").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-rule]");
    if (!button) return;
    switchView("rules");
    renderRulesList($("#globalSearch").value.trim());
    renderRuleDetail(button.dataset.openRule);
  });

  $("#addCard").addEventListener("click", async () => {
    await addCardFromQuery($("#cardSearch").value);
  });

  $("#cardSearch").addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightSuggestion(activeSuggestionIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightSuggestion(activeSuggestionIndex - 1);
      return;
    }

    if (event.key === "Escape") {
      hideCardSuggestions();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const pickedName = cardSuggestionNames[activeSuggestionIndex];
      addCardFromQuery(pickedName || $("#cardSearch").value);
    }
  });

  $("#cardSearch").addEventListener("input", (event) => {
    clearTimeout(suggestionTimer);
    suggestionTimer = setTimeout(() => updateCardSuggestions(event.target.value), 180);
  });

  $("#cardSuggestions").addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  $("#cardSuggestions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-suggestion]");
    if (!button) return;
    $("#cardSearch").value = button.dataset.cardSuggestion;
    addCardFromQuery(button.dataset.cardSuggestion);
  });

  [
    ["mine", "myBoardSearch"],
    ["opponent", "opponentBoardSearch"],
    ["cast", "castSearch"],
    ["response", "responseSearch"]
  ].forEach(([zone, inputId]) => {
    const input = $(`#${inputId}`);
    if (!input) return;

    input.addEventListener("input", () => {
      clearTimeout(liveAutocomplete.timer);
      liveAutocomplete.timer = setTimeout(() => updateLiveSuggestions(zone), 180);
    });

    input.addEventListener("keydown", (event) => {
      const suggestionsOpen = liveAutocomplete.inputId === inputId && $(`#${liveZoneSuggestionsId(zone)}`).classList.contains("open");

      if (event.key === "ArrowDown" && suggestionsOpen) {
        event.preventDefault();
        highlightLiveSuggestion(liveAutocomplete.activeIndex + 1);
        return;
      }

      if (event.key === "ArrowUp" && suggestionsOpen) {
        event.preventDefault();
        highlightLiveSuggestion(liveAutocomplete.activeIndex - 1);
        return;
      }

      if (event.key === "Escape" && suggestionsOpen) {
        event.preventDefault();
        hideLiveSuggestions();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const pickedName = suggestionsOpen ? liveAutocomplete.names[liveAutocomplete.activeIndex] : "";
        addLiveCard(zone, pickedName || input.value);
      }
    });
  });

  $$("#myBoardSuggestions, #opponentBoardSuggestions, #castSuggestions, #responseSuggestions").forEach((list) => {
    list.addEventListener("mousedown", (event) => {
      event.preventDefault();
    });

    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-live-suggestion]");
      if (!button) return;
      const zone = list.id === "myBoardSuggestions" ? "mine" : list.id === "opponentBoardSuggestions" ? "opponent" : list.id === "responseSuggestions" ? "response" : "cast";
      addLiveCard(zone, button.dataset.liveSuggestion);
    });
  });

  $$("[data-add-zone]").forEach((button) => {
    button.addEventListener("click", () => {
      const zone = button.dataset.addZone;
      addLiveCard(zone, $(`#${liveZoneInputId(zone)}`).value);
    });
  });

  $("#setCastCard").addEventListener("click", () => {
    addLiveCard("cast", $("#castSearch").value);
  });

  $("#setResponseCard").addEventListener("click", () => {
    addLiveCard("response", $("#responseSearch").value);
  });

  $("#loadKnownLine").addEventListener("click", () => {
    const exampleId = $("#knownLineSelect").value;
    if (!exampleId) {
      setStatus("Choose a line");
      return;
    }
    loadCommunityExample(exampleId);
  });

  $("#communityExamples").addEventListener("click", (event) => {
    const button = event.target.closest("[data-community-example]");
    if (!button) return;
    loadCommunityExample(button.dataset.communityExample);
  });

  $$("[data-library-tab]").forEach((button) => {
    button.addEventListener("click", () => switchLibraryTab(button.dataset.libraryTab));
  });

  $("#librarySearch").addEventListener("input", () => {
    renderCommunityExamples();
    renderCommanderCombos();
  });

  $("#syncSpellbook").addEventListener("click", syncCommanderSpellbook);
  $("#clearSpellbookCache").addEventListener("click", clearSpellbookCache);

  $("#buildRulingPrompt").addEventListener("click", () => {
    renderRulingPrompt();
    setStatus("Prompt built");
  });

  $("#copyRulingPrompt").addEventListener("click", async () => {
    await copyText(renderRulingPrompt());
    setStatus("Prompt copied");
  });

  $("#rulingQuestionText").addEventListener("input", () => {
    renderRulingPrompt();
  });

  $("#saveRulingNote").addEventListener("click", saveCurrentRulingNote);

  $("#clearRulingDraft").addEventListener("click", () => {
    $("#rulingAnswerText").value = "";
    setStatus("Draft cleared");
  });

  $("#savedRulings").addEventListener("click", (event) => {
    const loadButton = event.target.closest("[data-load-saved-ruling]");
    const deleteButton = event.target.closest("[data-delete-saved-ruling]");
    if (loadButton) {
      const ruling = savedRulings[Number(loadButton.dataset.loadSavedRuling)];
      if (!ruling) return;
      $("#rulingPromptOutput").textContent = ruling.prompt;
      $("#rulingAnswerText").value = ruling.answer;
      $("#questionTitle").textContent = ruling.title;
      setStatus("Saved ruling loaded");
      return;
    }
    if (deleteButton) {
      savedRulings.splice(Number(deleteButton.dataset.deleteSavedRuling), 1);
      saveSavedRulings();
      renderSavedRulings();
      setStatus("Saved ruling deleted");
    }
  });

  $("#clearLiveBoard").addEventListener("click", () => {
    resetLiveBoardState();
    $("#castController").value = liveBoard.castController;
    $("#castManaMode").value = liveBoard.manaMode;
    $("#turnPhase").value = liveBoard.turnPhase;
    $("#castTarget").value = liveBoard.castTarget;
    $("#responseTarget").value = liveBoard.responseTarget;
    hideLiveSuggestions();
    renderLiveBoard();
    analyzeLiveBoard();
    renderRulingPrompt();
    setStatus("Table reset");
  });

  $("#castController").addEventListener("change", (event) => {
    liveBoard.castController = event.target.value;
    analyzeLiveBoard();
    renderRulingPrompt();
  });

  $("#castManaMode").addEventListener("change", (event) => {
    liveBoard.manaMode = event.target.value;
    analyzeLiveBoard();
    renderRulingPrompt();
  });

  $("#turnPhase").addEventListener("change", (event) => {
    liveBoard.turnPhase = event.target.value;
    analyzeLiveBoard();
    renderRulingPrompt();
  });

  $("#responseTarget").addEventListener("change", (event) => {
    liveBoard.responseTarget = event.target.value;
    analyzeLiveBoard();
    renderRulingPrompt();
  });

  $("#castTarget").addEventListener("change", (event) => {
    liveBoard.castTarget = event.target.value;
    analyzeLiveBoard();
    renderRulingPrompt();
  });

  $$("[data-clear-zone]").forEach((button) => {
    button.addEventListener("click", () => {
      liveBoard[button.dataset.clearZone] = [];
      renderLiveBoard();
      analyzeLiveBoard();
      renderRulingPrompt();
    });
  });

  $("#judge").addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-zone]");
    if (!removeButton) return;
    removeLiveCard(removeButton.dataset.removeZone, Number(removeButton.dataset.removeIndex));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".card-search-field")) hideCardSuggestions();
    if (!event.target.closest(".live-search-field")) hideLiveSuggestions();
  });

  $("#clearCards").addEventListener("click", () => {
    selectedCards = [];
    renderSelectedCards();
    renderAnswer("Choose a scenario", ["Select a preset interaction or add cards to build a rules path."], ["priority"]);
  });

  $("#copyAnswer").addEventListener("click", async () => {
    const text = [$("#answerTitle").textContent, ...$$(".steps li").map((item, index) => `${index + 1}. ${item.textContent}`)].join("\n");
    await navigator.clipboard.writeText(text);
    setStatus("Copied");
  });

  $("#globalSearch").addEventListener("input", (event) => {
    const value = event.target.value.trim();
    renderRulesList(value);
    if (value) {
      const found = matchingRules(value);
      if (found.length) renderFocus(found.slice(0, 3).map((rule) => rule.id));
    }
  });

  $("#analyzeQuestion").addEventListener("click", analyzeQuestion);
}

renderScenarios();
renderCommunityExamples();
renderKnownLineOptions();
loadSavedRulings();
loadSpellbookCache();
renderCommanderCombos();
loadBackendCombos();
loadBackendStatus();
renderSelectedCards();
renderRulesList();
renderAnswer(scenarios[0].title, scenarios[0].steps, scenarios[0].ruleIds);
renderLiveBoard();
renderRulingPrompt();
renderSavedRulings();
bindEvents();
