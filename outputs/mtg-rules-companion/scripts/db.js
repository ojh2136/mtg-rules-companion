const { normalizeName } = require("./shared");

let pool;

function databaseEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!databaseEnabled()) return null;
  if (!pool) {
    let Pool;
    try {
      ({ Pool } = require("pg"));
    } catch {
      throw new Error("DATABASE_URL is set, but the pg package is missing. Run npm install.");
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const activePool = getPool();
  if (!activePool) return null;
  return activePool.query(sql, params);
}

async function ensureSchema() {
  if (!databaseEnabled()) return false;
  await query(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      normalized_name TEXT NOT NULL,
      type_line TEXT,
      oracle_text TEXT,
      image_url TEXT,
      keywords JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  await query("CREATE INDEX IF NOT EXISTS cards_normalized_name_idx ON cards (normalized_name);");
  await query("CREATE INDEX IF NOT EXISTS cards_name_lower_idx ON cards (lower(name));");

  await query(`
    CREATE TABLE IF NOT EXISTS combos (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      cards JSONB NOT NULL,
      result TEXT,
      pattern TEXT,
      needs TEXT,
      steps TEXT,
      popularity INTEGER DEFAULT 0,
      url TEXT,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  await query("CREATE INDEX IF NOT EXISTS combos_cards_idx ON combos USING gin (cards);");

  await query(`
    CREATE TABLE IF NOT EXISTS rulings (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      subreddit TEXT,
      title TEXT,
      question TEXT,
      cards JSONB DEFAULT '[]'::jsonb,
      url TEXT,
      created_utc DOUBLE PRECISION,
      score INTEGER DEFAULT 0,
      verified BOOLEAN DEFAULT false,
      what_happens JSONB DEFAULT '[]'::jsonb,
      notes TEXT,
      imported_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS ingestion_runs (
      id SERIAL PRIMARY KEY,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT,
      started_at TIMESTAMPTZ DEFAULT now(),
      finished_at TIMESTAMPTZ
    );
  `);
  return true;
}

function dbCardToAppCard(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    text: row.oracle_text || "",
    typeLine: row.type_line || "",
    image: row.image_url || "",
    keywords: row.keywords || []
  };
}

function dbRulingToAppRuling(row) {
  return {
    id: row.id,
    source: row.source,
    subreddit: row.subreddit,
    title: row.title,
    question: row.question,
    cards: row.cards || [],
    url: row.url,
    createdUtc: row.created_utc,
    score: row.score,
    verified: row.verified,
    whatHappens: row.what_happens || [],
    notes: row.notes
  };
}

async function upsertCards(cards) {
  if (!databaseEnabled()) return false;
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (const card of cards) {
      await client.query(
        `
          INSERT INTO cards (id, name, normalized_name, type_line, oracle_text, image_url, keywords, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, now())
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            normalized_name = EXCLUDED.normalized_name,
            type_line = EXCLUDED.type_line,
            oracle_text = EXCLUDED.oracle_text,
            image_url = EXCLUDED.image_url,
            keywords = EXCLUDED.keywords,
            updated_at = now()
        `,
        [card.id, card.name, normalizeName(card.name), card.typeLine, card.text, card.image, JSON.stringify(card.keywords || [])]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return true;
}

async function upsertCombos(combos) {
  if (!databaseEnabled()) return false;
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (const combo of combos) {
      await client.query(
        `
          INSERT INTO combos (id, source, cards, result, pattern, needs, steps, popularity, url, updated_at)
          VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, now())
          ON CONFLICT (id) DO UPDATE SET
            source = EXCLUDED.source,
            cards = EXCLUDED.cards,
            result = EXCLUDED.result,
            pattern = EXCLUDED.pattern,
            needs = EXCLUDED.needs,
            steps = EXCLUDED.steps,
            popularity = EXCLUDED.popularity,
            url = EXCLUDED.url,
            updated_at = now()
        `,
        [combo.id, combo.source, JSON.stringify(combo.cards || []), combo.result, combo.pattern, combo.needs, combo.steps, combo.popularity || 0, combo.url || ""]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return true;
}

async function upsertRulings(rulings) {
  if (!databaseEnabled()) return false;
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    for (const ruling of rulings) {
      await client.query(
        `
          INSERT INTO rulings (id, source, subreddit, title, question, cards, url, created_utc, score, verified, what_happens, notes, imported_at)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11::jsonb, $12, now())
          ON CONFLICT (id) DO UPDATE SET
            source = EXCLUDED.source,
            subreddit = EXCLUDED.subreddit,
            title = EXCLUDED.title,
            question = EXCLUDED.question,
            cards = EXCLUDED.cards,
            url = EXCLUDED.url,
            created_utc = EXCLUDED.created_utc,
            score = EXCLUDED.score,
            verified = EXCLUDED.verified,
            what_happens = EXCLUDED.what_happens,
            notes = EXCLUDED.notes,
            imported_at = now()
        `,
        [
          ruling.id,
          ruling.source,
          ruling.subreddit || "",
          ruling.title || "",
          ruling.question || "",
          JSON.stringify(ruling.cards || []),
          ruling.url || "",
          ruling.createdUtc || null,
          ruling.score || 0,
          Boolean(ruling.verified),
          JSON.stringify(ruling.whatHappens || []),
          ruling.notes || ""
        ]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
  return true;
}

async function findCard(name) {
  if (!databaseEnabled()) return null;
  await ensureSchema();
  const normalized = normalizeName(name);
  const exact = await query("SELECT * FROM cards WHERE normalized_name = $1 LIMIT 1", [normalized]);
  if (exact.rows[0]) return dbCardToAppCard(exact.rows[0]);
  const fuzzy = await query("SELECT * FROM cards WHERE normalized_name LIKE $1 OR $1 LIKE normalized_name || '%' ORDER BY length(name) LIMIT 1", [`%${normalized}%`]);
  return dbCardToAppCard(fuzzy.rows[0]);
}

async function autocompleteCards(search) {
  if (!databaseEnabled()) return null;
  await ensureSchema();
  const normalized = normalizeName(search);
  const result = await query("SELECT name FROM cards WHERE normalized_name LIKE $1 ORDER BY name LIMIT 12", [`%${normalized}%`]);
  return result.rows.map((row) => row.name);
}

async function searchCombos(search = "") {
  if (!databaseEnabled()) return null;
  await ensureSchema();
  const queryText = `%${String(search).toLowerCase()}%`;
  const result = search
    ? await query(
        `
          SELECT * FROM combos
          WHERE lower(cards::text || ' ' || coalesce(result, '') || ' ' || coalesce(pattern, '') || ' ' || coalesce(needs, '')) LIKE $1
          ORDER BY popularity DESC NULLS LAST, updated_at DESC
          LIMIT 250
        `,
        [queryText]
      )
    : await query("SELECT * FROM combos ORDER BY popularity DESC NULLS LAST, updated_at DESC LIMIT 250");
  return result.rows;
}

async function searchRulings(search = "") {
  if (!databaseEnabled()) return null;
  await ensureSchema();
  const queryText = `%${String(search).toLowerCase()}%`;
  const result = search
    ? await query(
        `
          SELECT * FROM rulings
          WHERE lower(coalesce(title, '') || ' ' || coalesce(question, '') || ' ' || cards::text || ' ' || what_happens::text) LIKE $1
          ORDER BY imported_at DESC
          LIMIT 100
        `,
        [queryText]
      )
    : await query("SELECT * FROM rulings ORDER BY imported_at DESC LIMIT 100");
  return result.rows.map(dbRulingToAppRuling);
}

async function counts() {
  if (!databaseEnabled()) return null;
  await ensureSchema();
  const result = await query(`
    SELECT
      (SELECT count(*)::int FROM cards) AS cards,
      (SELECT count(*)::int FROM combos) AS combos,
      (SELECT count(*)::int FROM rulings) AS rulings
  `);
  return result.rows[0];
}

module.exports = {
  databaseEnabled,
  ensureSchema,
  upsertCards,
  upsertCombos,
  upsertRulings,
  findCard,
  autocompleteCards,
  searchCombos,
  searchRulings,
  counts
};
