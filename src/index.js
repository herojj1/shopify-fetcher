import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 8000;

const SHOP_API_BASE = process.env.SHOP_API_BASE
  || "https://shop.app/web/api/catalog/search";
const PRICE_FLOOR = 0.10;
const PRICE_CEIL  = 5.00;
const DEV_TAG     = "@Mod_By_Kamal";
const DEFAULT_LIMIT = 100;
const MAX_LIMIT     = 1000;
const CONCURRENCY   = 6;
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

function parsePrice(raw) {
  if (raw === null || raw === undefined) return null;
  const cleaned = String(raw).replace(/[^\d.,]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function siteFromCheckout(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch { return null; }
}

function harvestVariants(node, out) {
  if (!node || typeof node !== "object") return;

  if (
    node.id !== undefined &&
    (node.checkoutUrl || node.checkout_url) &&
    (node.price || node.priceRange)
  ) {
    const checkout = node.checkoutUrl || node.checkout_url;
    const site = siteFromCheckout(checkout);

    if (site) {
      let priceVal = null;
      let currency = "USD";

      if (typeof node.price === "object" && node.price !== null) {
        priceVal = parsePrice(node.price.amount ?? node.price.value);
        currency = node.price.currencyCode || node.price.currency || "USD";
      } else {
        priceVal = parsePrice(node.price);
      }

      if (priceVal !== null && priceVal >= PRICE_FLOOR && priceVal <= PRICE_CEIL) {
        let vid = String(node.id);
        if (vid.startsWith("gid://shopify/ProductVariant/")) {
          vid = vid.split("/").pop();
        }
        out.push({
          site, variant_id: vid, price_num: priceVal, currency,
          checkout,
          title: node.displayName || node.title || "",
          available: node.availableForSale !== false,
        });
      }
    }
  }

  for (const key of Object.keys(node)) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) harvestVariants(item, out);
    } else if (child && typeof child === "object") {
      harvestVariants(child, out);
    }
  }
}

function extractJson(text) {
  if (!text) return null;
  const t = text.trim();
  try { return JSON.parse(t); } catch {}
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const brace = t.search(/[{[]/);
  if (brace >= 0) {
    const slice = t.slice(brace);
    for (let end = slice.length; end > 20; end--) {
      try { return JSON.parse(slice.slice(0, end)); } catch {}
    }
  }
  return null;
}

async function searchOnce(keyword) {
  const url = new URL(SHOP_API_BASE);
  url.searchParams.set("query", keyword);
  url.searchParams.set("limit", "10");
  url.searchParams.set("products_limit", "10");
  url.searchParams.set("ships_to", "US");
  url.searchParams.set("available_for_sale", "1");

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch(url.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json, text/markdown, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://shop.app/",
        },
      });
      if (r.ok) {
        const ct = r.headers.get("content-type") || "";
        if (ct.includes("json")) return await r.json().catch(() => null);
        return extractJson(await r.text());
      }
      if (r.status === 429 || r.status >= 500) {
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      return null;
    } catch {
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}

async function fetchAllVariants(keyword, wantResult) {
  const suffixes = ["", " cheap", " sale", " deal", " new", " mini", " under 5"];
  const passes = Math.min(suffixes.length, Math.max(3, Math.ceil(wantResult / 10) + 1));
  const queries = suffixes.slice(0, passes).map(s => keyword + s);

  const all = [];
  for (let i = 0; i < queries.length; i += CONCURRENCY) {
    const batch = queries.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(q => searchOnce(q).then(d => {
        if (!d) return [];
        const bucket = [];
        harvestVariants(d, bucket);
        return bucket;
      }))
    );
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        all.push(...r.value);
      }
    }
    if (all.length >= wantResult * 3) break;
  }
  return all;
}

function dedupe(list) {
  const seen = new Set();
  const out  = [];
  for (const v of list) {
    if (!v.variant_id || seen.has(v.variant_id)) continue;
    seen.add(v.variant_id);
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
      for (const v of clean) {
        res.write(JSON.stringify(shape(v)) + "\n");
      }
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
  console.log(`shopify-fetcher running on port ${PORT}`);
});
