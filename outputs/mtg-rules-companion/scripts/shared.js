const fs = require("fs");
const path = require("path");
const https = require("https");

const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readJson(fileName, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(fileName, value) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, fileName), `${JSON.stringify(value, null, 2)}\n`);
}

function updateMeta(patch) {
  const meta = readJson("meta.json", {});
  writeJson("meta.json", { ...meta, ...patch });
}

function getJson(url, options = {}) {
  const retries = options.retries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? 60000;
  const timeoutMs = options.timeoutMs ?? 30000;
  return new Promise((resolve, reject) => {
    const request = https
      .get(url, { headers: { Accept: "application/json", "User-Agent": "StackwiseLocal/0.1" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          resolve(getJson(new URL(res.headers.location, url).toString(), options));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        res.on("end", () => {
          const data = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode === 429 && retries > 0) {
            const retryAfter = Number(res.headers["retry-after"]);
            const waitMs = Number.isFinite(retryAfter) ? Math.max(retryAfter * 1000, retryDelayMs) : retryDelayMs;
            console.log(`Rate limited by remote API. Waiting ${Math.round(waitMs / 1000)} seconds before retry...`);
            setTimeout(() => {
              getJson(url, { ...options, retries: retries - 1 }).then(resolve).catch(reject);
            }, waitMs);
            return;
          }
          if (res.statusCode < 200 || res.statusCode >= 300) {
            const error = new Error(`HTTP ${res.statusCode} from ${url}`);
            error.statusCode = res.statusCode;
            error.headers = res.headers;
            error.url = url;
            error.body = data.slice(0, 500);
            reject(error);
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Timed out while loading ${url}`));
    });
  });
}

function normalizeName(name) {
  return String(name || "")
    .split(" // ")[0]
    .toLowerCase()
    .replace(/[^\w\s'-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function appCardFromScryfall(card) {
  return {
    id: card.id,
    name: card.name,
    text: card.oracle_text || (card.card_faces || []).map((face) => `${face.name}: ${face.oracle_text || ""}`).join(" // "),
    typeLine: card.type_line || (card.card_faces || []).map((face) => face.type_line).filter(Boolean).join(" // ") || "",
    image: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
    keywords: card.keywords || []
  };
}

module.exports = {
  rootDir,
  dataDir,
  ensureDataDir,
  readJson,
  writeJson,
  updateMeta,
  getJson,
  normalizeName,
  appCardFromScryfall
};
