import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 8000;

// ── LOCKED PRICE BAND: $0.10 – $5.00 ────────────────────────────────
const PRICE_FLOOR = 0.10;
const PRICE_CEIL  = 5.00;

const SEARCH_ENDPOINTS = [
  "https://shop.app/agents/search",
  "https://shop.app/web/api/catalog/search",
];

const DEV_TAG       = "@SUPERGREMLIN01";
const DEFAULT_LIMIT = 100;
const MAX_LIMIT     = 1000;
const CONCURRENCY   = 4;
const MAX_RETRIES   = 2;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age":       "86400",
};

app.use((req, res, next) => {
  res.set(CORS);
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function siteFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch { return null; }
}

function fillTemplate(tpl, id) {
  if (!tpl) return "";
  return tpl
    .replace(/\{id\}/gi, id)
    .replace(/%7Bid%7D/gi, id)
    .replace(/%7bid%7d/gi, id);
}

function parseMarkdown(text) {
  if (!text || typeof text !== "string") return [];
  if (text.trim().startsWith("# Error")) return [];

  const blocks = text.split(/\n\s*---\s*\n/);
  const out = [];

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const title = lines[0];
    if (title.startsWith("#")) continue;

    const priceLine = lines[1] || "";
    const priceMatch = priceLine.match(/\$\s*([\d.,]+)/);
    if (!priceMatch) continue;
    const price = parseFloat(priceMatch[1].replace(/,/g, ""));
    if (!Number.isFinite(price)) continue;
    if (price < PRICE_FLOOR || price > PRICE_CEIL) continue;

    let productUrl = "";
    let checkoutTpl = "";
    let productId = "";

    for (const l of lines) {
      if (!productUrl && /^https?:\/\//i.test(l)
          && !/^img:/i.test(l)
          && !/^checkout:/i.test(l)
          && !/\/cart\//.test(l)) {
        productUrl = l;
      }
      if (!checkoutTpl && /^checkout:\s*/i.test(l)) {
        checkoutTpl = l.replace(/^checkout:\s*/i, "").trim();
      }
      if (!productId && /^id:\s*/i.test(l)) {
        productId = l.replace(/^id:\s*/i, "").trim();
      }
    }

    let variantId = "";
    if (productUrl) {
      const m = productUrl.match(/[?&]variant=(\d+)/);
      if (m) variantId = m[1];
    }
    if (!variantId) {
      const m = block.match(/\((\d{6,})\)/);
      if (m) variantId = m[1];
    }
    if (!variantId) {
      const m = block.match(/\/cart\/(\d+)/);
      if (m) variantId = m[1];
    }

    let checkout = fillTemplate(checkoutTpl, variantId);
    if (!checkout && productUrl && variantId) {
      const site = siteFromUrl(productUrl);
      if (site) checkout = `${site}/cart/${variantId}:1`;
    }

    const site = siteFromUrl(productUrl) || siteFromUrl(checkout);
    if (!site) continue;

    out.push({
      site,
      variant_id: variantId || productId || "",
      price_num: price,
      currency: "USD",
      checkout,
      title,
      available: true,
    });
  }

  return out;
}

async function searchOnce(keyword) {
  for (const base of SEARCH_ENDPOINTS) {
    const url = new URL(base);
    url.searchParams.set("query", keyword);
    url.searchParams.set("limit", "10");
    url.searchParams.set("ships_to", "US");
    url.searchParams.set("available_for_sale", "1");
    url.searchParams.set("min_price", PRICE_FLOOR.toFixed(2));
    url.searchParams.set("max_price", PRICE_CEIL.toFixed(2));

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const r = await fetch(url.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/markdown, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://shop.app/",
          },
        });
        if (r.ok) {
          const text = await r.text();
          const items = parseMarkdown(text);
          if (items.length) return items;
          break;
        }
        if (r.status === 429 || r.status >= 500) {
          await new Promise(res => setTimeout(res, 300 * (attempt + 1)));
          continue;
        }
        break;
      } catch {
        if (attempt < MAX_RETRIES) {
          await new Promise(res => setTimeout(res, 300 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
  }
  return [];
}

async function fetchAllVariants(keyword, wantResult) {
  const suffixes = ["", " cheap", " sale", " deal", " new", " mini"];
  const passes = Math.min(suffixes.length, Math.max(3, Math.ceil(wantResult / 10) + 1));
  const queries = suffixes.slice(0, passes).map(s => keyword + s);

  const all = [];
  for (let i = 0; i < queries.length; i += CONCURRENCY) {
    const batch = queries.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map(q => searchOnce(q)));
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        all.push(...r.value);
      }
    }
    if (all.length >= wantResult * 2) break;
  }
  return all;
}

function dedupe(list) {
  const seen = new Set();
  const out  = [];
  for (const v of list) {
    const key = v.variant_id || v.checkout;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function shape(v) {
  return {
    site: v.site,
    variant_id: v.variant_id,
    price: `${v.price_num.toFixed(2)} ${v.currency}`,
    checkout: v.checkout,
    title: v.title,
    dev: DEV_TAG,
  };
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "shopify-fetcher",
    price_band: `$${PRICE_FLOOR.toFixed(2)} – $${PRICE_CEIL.toFixed(2)}`,
  });
});

app.get("/", async (req, res) => {
  if (!req.query.keyword) {
    return res.sendFile(join(__dirname, "..", "public", "index.html"));
  }

  const keyword = String(req.query.keyword || "").trim();
  if (!keyword) return res.status(400).json({ error: "keyword required" });

  const wantResult = Math.min(
    parseInt(req.query.result || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
    MAX_LIMIT
  );
  const format = String(req.query.format || "").toLowerCase();
  const stream = req.query.stream === "1";

  try {
    if (stream) {
      res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.flushHeaders?.();

      const raw   = await fetchAllVariants(keyword, wantResult);
      const clean = dedupe(raw).slice(0, wantResult);
      for (const v of clean) res.write(JSON.stringify(shape(v)) + "\n");
      return res.end();
    }

    const raw   = await fetchAllVariants(keyword, wantResult);
    const clean = dedupe(raw).slice(0, wantResult);
    const results = clean.map(shape);

    if (format === "raw" || format === "array") return res.json(results);

    return res.json({
      query: keyword,
      price_band: `$${PRICE_FLOOR.toFixed(2)} – $${PRICE_CEIL.toFixed(2)}`,
      total: results.length,
      results,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`shopify-fetcher running on port ${PORT} | band $${PRICE_FLOOR}–$${PRICE_CEIL}`);
});
