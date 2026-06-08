const db = require("./db");

async function main() {
  if (!db.databaseEnabled()) {
    throw new Error("DATABASE_URL is not set. Add it to Render or set it in PowerShell before running this command.");
  }
  await db.ensureSchema();
  console.log("Postgres tables are ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
