# Stackwise

Stackwise is a first prototype for learning Magic: The Gathering rules through card interactions.

Open `index.html` directly in a browser, or run the local backend:

```bash
npm start
```

Then open `http://127.0.0.1:4177/`.

The app includes:

- A card interaction lab with preset rules scenarios.
- Live card lookup and autocomplete suggestions through Scryfall's public API.
- Card-name autocomplete inside board-state questions.
- An Oracle-text interaction engine that classifies selected cards and builds a likely resolution path.
- A rules map for core Comprehensive Rules topics.
- A live-board builder with separate player boards and a cast slot that explains how the cast card interacts with current permanents.
- An opponent response slot for stack interactions such as counterspells cast after a spell and its cast triggers.
- Response target selection for the cast spell, a cast trigger or ability, or another target.
- Cast target selection for targeted spells, including responses that remove that target before resolution.
- A plain-English "What happens" summary above the detailed stack and rules explanation.
- Repeatable modal spell support, including blink modes that target the same permanent multiple times.
- Community-style example questions that load real board states into the live ruling engine.
- Known community ruling patterns for copy choices, modal spell resolution, and delayed trigger placement after a spell fully resolves.
- A Commander combo research shelf with common infinite-combo patterns and results.
- Live-board infinite combo detection for either player's board using the local Commander combo catalog.
- Commander Spellbook sync controls that can import and cache combo variants from the public Spellbook backend when the browser/network allows it.
- A local backend server with JSON database files under `data/`.
- Ingestion scripts for Scryfall cards, Commander Spellbook combo variants, and Reddit ruling-question candidates.
- Non-board combo examples such as Thassa's Oracle plus Doomsday, where the key interaction depends on stack timing and library size rather than permanents sitting on the battlefield.
- A Board Question "Known stack line" picker for loading learned spell/trigger combo lines directly into the live ruling view.
- Displacer Kitten plus targeted spell handling, including cases where blinking the target makes the original spell lose its only target.
- Judge-context controls for casting player, whether mana was spent, and timing.
- Confidence labels and missing-info prompts for ambiguous live rulings.
- Static board-state explanations for continuous effects such as Blood Moon affecting nonbasic lands.
- Graveyard target checks for reanimation stack fights such as Reanimate versus Fated Return.

Community questions, including examples inspired by places like r/mtgrules, should be used as scenario ideas and regression tests. The app should verify those scenarios against Oracle text and rules concepts instead of treating comments as authority.

Commander combo examples are curated from public combo resources such as Commander Spellbook and EDHREC. EDHREC exposes combo pages/static data, while Commander Spellbook is the combo-focused search system EDHREC directs users toward. The Reference Library can sync Commander Spellbook variants through the local backend from `https://backend.commanderspellbook.com/variants`; if browser or network access blocks that request, the starter catalog and direct Spellbook link remain available. Treat local combo matches as strong prompts to check prerequisites until each combo's exact execution steps are modeled in the interaction engine.

## Local database ingestion

From this folder:

```bash
npm run ingest:scryfall
npm run ingest:spellbook
npm run ingest:reddit
```

`ingest:scryfall` downloads Scryfall's Oracle card bulk data into `data/cards.json` and `data/card-index.json`.

`ingest:spellbook` downloads Commander Spellbook combo variants into `data/combos.json`.

Commander Spellbook may rate-limit long downloads. The importer uses small pages, waits between requests, saves progress after every page, and resumes from `spellbookNextOffset` in `data/meta.json`.

If you see HTTP 429, the Spellbook API is asking this connection to cool down. Wait 30-60 minutes and run:

```bash
npm run ingest:spellbook
```

For a slower, gentler sync on Windows PowerShell:

```powershell
$env:SPELLBOOK_LIMIT=10
$env:SPELLBOOK_DELAY_MS=5000
$env:SPELLBOOK_RATE_LIMIT_WAIT_MS=120000
npm run ingest:spellbook
```

`ingest:reddit` downloads recent `r/mtgrules` posts into `data/rulings.json` as candidate scenarios. These are not treated as authority until verified against Oracle text and rules.

You can tune Reddit ingestion:

```bash
set REDDIT_SUBREDDIT=mtgrules
set REDDIT_MAX_PAGES=25
set REDDIT_LIMIT=100
npm run ingest:reddit
```

The local server exposes:

- `GET /api/status`
- `GET /api/cards/named?name=Card Name`
- `GET /api/cards/autocomplete?q=partial`
- `GET /api/combos?q=search`
- `GET /api/rulings?q=search`
- `POST /api/ingest/spellbook`

The built-in rule summaries are educational references, not tournament authority. For official calls, verify against the current Wizards of the Coast Comprehensive Rules, Magic Tournament Rules, Infraction Procedure Guide, and Oracle card text.
