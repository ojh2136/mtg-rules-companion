const { appCardFromScryfall, getJson, normalizeName, updateMeta, writeJson } = require("./shared");

async function main() {
  console.log("Finding Scryfall Oracle cards bulk file...");
  const bulk = await getJson("https://api.scryfall.com/bulk-data");
  const oracleCards = (bulk.data || []).find((entry) => entry.type === "oracle_cards");
  if (!oracleCards?.download_uri) throw new Error("Scryfall oracle_cards bulk file not found");

  console.log("Downloading Scryfall cards. This can take a little while...");
  const rawCards = await getJson(oracleCards.download_uri, { timeoutMs: 180000 });
  const cards = rawCards
    .filter((card) => !card.digital || card.layout)
    .map(appCardFromScryfall)
    .filter((card) => card.name && card.text !== undefined);

  const index = {};
  cards.forEach((card, position) => {
    index[normalizeName(card.name)] = position;
    card.name.split(" // ").forEach((part) => {
      index[normalizeName(part)] = position;
    });
  });

  writeJson("cards.json", cards);
  writeJson("card-index.json", index);
  updateMeta({
    cardsUpdatedAt: new Date().toISOString(),
    cardCount: cards.length,
    sources: ["Scryfall bulk oracle_cards"]
  });
  console.log(`Saved ${cards.length} Scryfall cards.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
