const { getJson, readJson, updateMeta, writeJson } = require("./shared");

const API = "https://backend.commanderspellbook.com";
const LIMIT = Number(process.env.SPELLBOOK_LIMIT || 25);
const MAX_PAGES = Number(process.env.SPELLBOOK_MAX_PAGES || 40);
const DELAY_MS = Number(process.env.SPELLBOOK_DELAY_MS || 3000);
const MAX_RETRIES = Number(process.env.SPELLBOOK_MAX_RETRIES || 3);
const RATE_LIMIT_WAIT_MS = Number(process.env.SPELLBOOK_RATE_LIMIT_WAIT_MS || 90000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(error) {
  const retryAfter = error.headers?.["retry-after"];
  if (!retryAfter) return RATE_LIMIT_WAIT_MS;

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds)) return Math.max(seconds * 1000, RATE_LIMIT_WAIT_MS);

  const dateMs = Date.parse(retryAfter);
  if (Number.isFinite(dateMs)) return Math.max(dateMs - Date.now(), RATE_LIMIT_WAIT_MS);

  return RATE_LIMIT_WAIT_MS;
}

async function getJsonPolitely(url) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await getJson(url, { retries: 0 });
    } catch (error) {
      const canRetry = error.statusCode === 429 && attempt < MAX_RETRIES;
      if (!canRetry) throw error;

      const waitMs = parseRetryAfterMs(error);
      console.log(`Spellbook is rate limiting. Waiting ${Math.round(waitMs / 1000)} seconds before retry ${attempt + 1}/${MAX_RETRIES}...`);
      await sleep(waitMs);
    }
  }
  throw new Error(`Could not load ${url}`);
}

function resultTextFromVariant(variant) {
  return (variant.produces || []).map((item) => item.feature?.name).filter(Boolean).join(", ");
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

function mapVariant(variant) {
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
    popularity: variant.popularity || 0,
    url: variant.publicUrl || variant.url || ""
  };
}

async function main() {
  const existing = readJson("combos.json", []);
  const comboById = new Map(existing.map((combo) => [combo.id, combo]));
  const meta = readJson("meta.json", {});
  const resumeOffset = Number(process.env.SPELLBOOK_OFFSET || meta.spellbookNextOffset || 0);
  let nextUrl = `${API}/variants/?limit=${LIMIT}&offset=${resumeOffset}`;
  let pages = 0;

  while (nextUrl && pages < MAX_PAGES) {
    console.log(`Loading Spellbook page ${pages + 1} from offset ${new URL(nextUrl).searchParams.get("offset") || 0}...`);
    const payload = await getJsonPolitely(nextUrl);
    (payload.results || []).forEach((variant) => {
      const combo = mapVariant(variant);
      if (combo) comboById.set(combo.id, combo);
    });
    const combos = [...comboById.values()];
    const nextOffset = payload.next ? Number(new URL(payload.next).searchParams.get("offset") || 0) : null;
    writeJson("combos.json", combos);
    updateMeta({
      combosUpdatedAt: new Date().toISOString(),
      comboCount: combos.length,
      comboSource: "Commander Spellbook variants",
      spellbookNextOffset: nextOffset,
      spellbookDone: !payload.next
    });
    console.log(`Saved progress: ${combos.length} combo variants.`);
    nextUrl = payload.next;
    pages += 1;
    if (nextUrl && DELAY_MS > 0) await sleep(DELAY_MS);
  }

  const combos = [...comboById.values()];
  writeJson("combos.json", combos);
  updateMeta({
    combosUpdatedAt: new Date().toISOString(),
    comboCount: combos.length,
    comboSource: "Commander Spellbook variants",
    spellbookNextOffset: nextUrl ? Number(new URL(nextUrl).searchParams.get("offset") || 0) : null,
    spellbookDone: !nextUrl
  });
  console.log(nextUrl ? `Paused after ${combos.length} variants. Run again to continue.` : `Saved ${combos.length} Commander Spellbook combo variants.`);
}

main().catch((error) => {
  const existing = readJson("combos.json", []);
  const meta = readJson("meta.json", {});
  updateMeta({
    combosLastErrorAt: new Date().toISOString(),
    combosLastError: error.message,
    comboCount: existing.length,
    spellbookDone: false
  });
  console.error("Commander Spellbook ingestion could not finish.");
  console.error(error.message);
  console.error(`Saved/kept local combo database with ${existing.length} combo variants.`);
  if (error.statusCode === 429) {
    console.error("Spellbook is temporarily rate limiting this connection. Waiting 30-60 minutes usually clears it.");
  }
  if (meta.spellbookNextOffset !== undefined && meta.spellbookNextOffset !== null) {
    console.error(`Run npm run ingest:spellbook again later to resume near offset ${meta.spellbookNextOffset}.`);
  }
  console.error("Tip: for an extra gentle sync, set SPELLBOOK_LIMIT=10 and SPELLBOOK_DELAY_MS=5000 before running again.");
  process.exit(0);
});
