const http = require("http");
const fs = require("fs");
const path = require("path");
const db = require("./scripts/db");
const { appCardFromScryfall, getJson, normalizeName, readJson, rootDir, updateMeta, writeJson } = require("./scripts/shared");

const PORT = Number(process.env.PORT || 4177);
const HOST = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(res, value, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(value));
}

function sendText(res, value, status = 200) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(value);
}

function cardsDb() {
  return {
    cards: readJson("cards.json", []),
    index: readJson("card-index.json", {})
  };
}

function findLocalCard(query) {
  const { cards, index } = cardsDb();
  const normalized = normalizeName(query);
  const exact = index[normalized];
  if (exact !== undefined) return cards[exact];
  return cards.find((card) => normalizeName(card.name).includes(normalized) || normalized.includes(normalizeName(card.name)));
}

async function apiCardNamed(reqUrl, res) {
  const query = reqUrl.searchParams.get("name") || reqUrl.searchParams.get("fuzzy") || reqUrl.searchParams.get("exact") || "";
  if (!query.trim()) {
    sendJson(res, { error: "Missing card name" }, 400);
    return;
  }
  const databaseCard = await db.findCard(query);
  if (databaseCard) {
    sendJson(res, databaseCard);
    return;
  }
  const local = findLocalCard(query);
  if (local) {
    sendJson(res, local);
    return;
  }
  const card = await getJson(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(query)}`);
  sendJson(res, appCardFromScryfall(card));
}

async function apiAutocomplete(reqUrl, res) {
  const query = reqUrl.searchParams.get("q") || "";
  if (query.length < 2) {
    sendJson(res, []);
    return;
  }
  const databaseSuggestions = await db.autocompleteCards(query);
  if (databaseSuggestions?.length) {
    sendJson(res, databaseSuggestions);
    return;
  }
  const { cards } = cardsDb();
  if (cards.length) {
    const normalized = normalizeName(query);
    sendJson(
      res,
      cards
        .filter((card) => normalizeName(card.name).includes(normalized))
        .slice(0, 12)
        .map((card) => card.name)
    );
    return;
  }
  const payload = await getJson(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`);
  sendJson(res, (payload.data || []).slice(0, 12));
}

async function apiCombos(reqUrl, res) {
  const query = (reqUrl.searchParams.get("q") || "").toLowerCase();
  const databaseCombos = await db.searchCombos(query);
  if (databaseCombos) {
    sendJson(res, databaseCombos);
    return;
  }
  const combos = readJson("combos.json", []);
  const filtered = query
    ? combos.filter((combo) => [combo.cards?.join(" "), combo.result, combo.pattern, combo.needs].join(" ").toLowerCase().includes(query))
    : combos;
  sendJson(res, filtered.slice(0, 250));
}

async function apiRulings(reqUrl, res) {
  const query = (reqUrl.searchParams.get("q") || "").toLowerCase();
  const databaseRulings = await db.searchRulings(query);
  if (databaseRulings) {
    sendJson(res, databaseRulings);
    return;
  }
  const rulings = readJson("rulings.json", []);
  const filtered = query
    ? rulings.filter((ruling) => [ruling.title, ruling.question, ruling.whatHappens?.join(" ")].join(" ").toLowerCase().includes(query))
    : rulings;
  sendJson(res, filtered.slice(0, 100));
}

async function apiIngestSpellbook(res) {
  const existing = readJson("combos.json", []);
  const comboById = new Map(existing.map((combo) => [combo.id, combo]));
  const meta = readJson("meta.json", {});
  let nextUrl = `https://backend.commanderspellbook.com/variants/?limit=100&offset=${Number(meta.spellbookNextOffset || 0)}`;
  let pages = 0;
  while (nextUrl && pages < 25) {
    const payload = await getJson(nextUrl);
    (payload.results || []).forEach((variant) => {
      const cards = (variant.uses || []).map((use) => use.card?.name).filter(Boolean);
      if (!cards.length) return;
      const result = (variant.produces || []).map((item) => item.feature?.name).filter(Boolean).join(", ");
      const needs = [variant.manaNeeded ? `Mana needed: ${variant.manaNeeded}.` : "", variant.easyPrerequisites || "", variant.notablePrerequisites || ""].filter(Boolean).join(" ") || "Check Commander Spellbook for exact setup.";
      const combo = {
        id: `spellbook:${variant.id}`,
        source: "Commander Spellbook",
        cards,
        result: result || "Combo result listed on Commander Spellbook.",
        pattern: variant.bracketTag ? `Commander Spellbook bracket ${variant.bracketTag}` : "Commander Spellbook combo",
        needs,
        steps: variant.description || "",
        popularity: variant.popularity || 0
      };
      comboById.set(combo.id, combo);
    });
    const combos = [...comboById.values()];
    const nextOffset = payload.next ? Number(new URL(payload.next).searchParams.get("offset") || 0) : null;
    writeJson("combos.json", combos);
    updateMeta({ combosUpdatedAt: new Date().toISOString(), comboCount: combos.length, comboSource: "Commander Spellbook variants", spellbookNextOffset: nextOffset, spellbookDone: !payload.next });
    nextUrl = payload.next;
    pages += 1;
  }
  const combos = [...comboById.values()];
  writeJson("combos.json", combos);
  await db.upsertCombos(combos);
  updateMeta({ combosUpdatedAt: new Date().toISOString(), comboCount: combos.length, comboSource: "Commander Spellbook variants", spellbookDone: !nextUrl, spellbookNextOffset: nextUrl ? Number(new URL(nextUrl).searchParams.get("offset") || 0) : null });
  sendJson(res, { ok: true, count: combos.length, done: !nextUrl });
}

function serveStatic(reqUrl, res) {
  const pathname = decodeURIComponent(reqUrl.pathname);
  const safePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const fullPath = path.resolve(rootDir, safePath);
  if (!fullPath.startsWith(rootDir)) {
    sendText(res, "Forbidden", 403);
    return;
  }
  fs.readFile(fullPath, (error, data) => {
    if (error) {
      sendText(res, "Not found", 404);
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(fullPath)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  try {
    if (reqUrl.pathname === "/api/status") {
      const databaseCounts = await db.counts();
      sendJson(res, {
        meta: readJson("meta.json", {}),
        database: db.databaseEnabled() ? "postgres" : "json",
        cards: databaseCounts?.cards ?? readJson("cards.json", []).length,
        combos: databaseCounts?.combos ?? readJson("combos.json", []).length,
        rulings: databaseCounts?.rulings ?? readJson("rulings.json", []).length
      });
    } else if (reqUrl.pathname === "/api/cards/named") {
      await apiCardNamed(reqUrl, res);
    } else if (reqUrl.pathname === "/api/cards/autocomplete") {
      await apiAutocomplete(reqUrl, res);
    } else if (reqUrl.pathname === "/api/combos") {
      await apiCombos(reqUrl, res);
    } else if (reqUrl.pathname === "/api/rulings") {
      await apiRulings(reqUrl, res);
    } else if (reqUrl.pathname === "/api/ingest/spellbook" && req.method === "POST") {
      await apiIngestSpellbook(res);
    } else {
      serveStatic(reqUrl, res);
    }
  } catch (error) {
    sendJson(res, { error: error.message }, 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Stackwise local server running at http://${HOST}:${PORT}/`);
});
