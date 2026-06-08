const { getJson, updateMeta, writeJson } = require("./shared");
const db = require("./db");

const SUBREDDIT = process.env.REDDIT_SUBREDDIT || "mtgrules";
const LIMIT = Number(process.env.REDDIT_LIMIT || 100);
const MAX_PAGES = Number(process.env.REDDIT_MAX_PAGES || 10);

function extractBracketedCards(text) {
  return [...String(text || "").matchAll(/\[\[([^\]]+)\]\]/g)]
    .map((match) => match[1].split("|")[0].trim())
    .filter(Boolean)
    .filter((name, index, names) => names.findIndex((item) => item.toLowerCase() === name.toLowerCase()) === index);
}

function postToRulingCandidate(post) {
  const data = post.data || {};
  const text = [data.title || "", data.selftext || ""].join("\n").trim();
  return {
    id: `reddit:${data.id}`,
    source: "reddit",
    subreddit: SUBREDDIT,
    title: data.title || "Untitled Reddit question",
    question: text,
    cards: extractBracketedCards(text),
    url: data.permalink ? `https://www.reddit.com${data.permalink}` : "",
    createdUtc: data.created_utc || null,
    score: data.score || 0,
    verified: false,
    whatHappens: [],
    notes: "Imported as a candidate scenario. Verify against Oracle text and rules before using as an authoritative ruling."
  };
}

async function main() {
  const candidates = [];
  let after = "";
  let pages = 0;

  while (pages < MAX_PAGES) {
    const url = `https://www.reddit.com/r/${SUBREDDIT}/new.json?limit=${LIMIT}${after ? `&after=${after}` : ""}`;
    console.log(`Loading Reddit page ${pages + 1}: r/${SUBREDDIT}`);
    const payload = await getJson(url);
    const posts = payload.data?.children || [];
    posts.forEach((post) => candidates.push(postToRulingCandidate(post)));
    after = payload.data?.after || "";
    pages += 1;
    if (!after || !posts.length) break;
  }

  writeJson("rulings.json", candidates);
  if (db.databaseEnabled()) {
    console.log("Saving Reddit ruling candidates to Postgres...");
    await db.upsertRulings(candidates);
  }
  updateMeta({
    rulingsUpdatedAt: new Date().toISOString(),
    rulingCandidateCount: candidates.length,
    rulingSource: `reddit/r/${SUBREDDIT}`
  });
  console.log(`Saved ${candidates.length} Reddit ruling candidates.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
