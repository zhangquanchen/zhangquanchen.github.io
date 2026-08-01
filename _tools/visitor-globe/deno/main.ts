/**
 * Visitor-globe recorder — where the dots on the homepage globe come from.
 *
 * The globe has already outlived two free stores that took their data with
 * them: clustrmaps.com (domain expired, now a registrar parking page) and
 * getpantry.cloud (permanent HTTP 400). Neither kept a copy anywhere we
 * controlled, so every dot recorded between 2026-05 and 2026-08 was lost.
 *
 * This service is therefore only the *hot* store. The durable copies are made
 * by _tools/visitor-globe/sync_visitors.py, which reads /cells once a day and
 * commits the result into the site's own git history (and mirrors it to a
 * Hugging Face dataset). If this deployment disappears tomorrow, the map is
 * still in the repo and the globe still renders it.
 *
 * The browser calls /hit here first and only falls back to the public Abacus
 * counter when this is unreachable, so a visit is counted exactly once and an
 * outage costs resolution rather than data:
 *
 *     here    -> city-level dots (lat/lon rounded to whole degrees)
 *     Abacus  -> country-level dots
 *
 * Routes:
 *   GET /hit?cc=CN&lat=39.9&lon=116.4&city=Beijing&country=China
 *   GET /cells    aggregated map, consumed by the sync job
 *   GET /health   keepalive target
 *
 * Deploy:  deployctl deploy --project=<project> --prod main.ts
 */

// Deploy provides the managed store; a path is only useful for local runs and
// tests, which must not scribble on the default database.
const kv = await Deno.openKv(Deno.env.get("VG_KV_PATH") || undefined);

/** A returning browser is ignored for this long. The client throttles itself
 * too; this is the copy a crafted request cannot skip. KV rejects a
 * non-integer expiry, so round rather than trusting the env var to divide. */
const DEDUP_MS = Math.max(
  1000,
  Math.round(Number(Deno.env.get("DEDUP_HOURS") ?? 12) * 3600 * 1000),
);
/** Salts the stored IP fingerprints. Set it in the project's env vars. */
const IP_SALT = Deno.env.get("IP_SALT") ?? "visitor-globe";
const MAX_CELLS = Number(Deno.env.get("MAX_CELLS") ?? 5000);

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://zhangquanchen.github.io,http://localhost:4000,http://127.0.0.1:4000")
  .split(",").map((o) => o.trim()).filter(Boolean);

interface Cell {
  n: number;
  lat: number;
  lon: number;
  l: string;
  cc: string;
}

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0] ?? "*";
  return {
    "access-control-allow-origin": allow,
    "vary": "origin",
    "cache-control": "no-store",
  };
}

function json(body: unknown, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });
}

async function fingerprint(ip: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${IP_SALT}|${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "";
}

/** "Beijing, China", but just "Singapore" for the city-states. */
function placeLabel(city: string, country: string): string {
  if (city && country && city !== country) return `${city}, ${country}`;
  return country || city;
}

async function readCells(): Promise<Record<string, Cell>> {
  const cells: Record<string, Cell> = {};
  for await (const entry of kv.list<Cell>({ prefix: ["cell"] })) {
    cells[String(entry.key[1])] = entry.value;
  }
  return cells;
}

async function summary() {
  const cells = await readCells();
  let total = 0;
  for (const c of Object.values(cells)) total += c.n ?? 0;
  return { cells, regions: Object.keys(cells).length, total };
}

/** Record one visit. Returns whether it counted (dedup may swallow it). */
async function record(
  key: string,
  lat: number,
  lon: number,
  label: string,
  cc: string,
): Promise<boolean> {
  // Retry the read-modify-write until no concurrent hit lands in between.
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await kv.get<Cell>(["cell", key]);
    if (existing.value === null) {
      const { regions } = await summary();
      if (regions >= MAX_CELLS) return false; // refuse to grow without bound
    }
    const next: Cell = existing.value
      ? {
        ...existing.value,
        n: (existing.value.n ?? 0) + 1,
        l: label || existing.value.l,
        cc: cc || existing.value.cc,
      }
      : { n: 1, lat: round(lat, 3), lon: round(lon, 3), l: label, cc };

    const res = await kv.atomic()
      .check(existing)
      .set(["cell", key], next)
      .commit();
    if (res.ok) return true;
  }
  return false;
}

function round(v: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
}

function finite(v: string | null, lo: number, hi: number): number | null {
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= lo && n <= hi ? n : null;
}

async function handleHit(req: Request, url: URL, origin: string | null) {
  const lat = finite(url.searchParams.get("lat"), -90, 90);
  const lon = finite(url.searchParams.get("lon"), -180, 180);
  if (lat === null || lon === null) {
    return json({ ok: false, reason: "missing coordinates" }, origin, 400);
  }

  // Claim the dedup slot before recording, so a failure halfway through can
  // only ever lose a visit — never count one twice. The window is enforced by
  // comparing the stored timestamp rather than by trusting expiry to be
  // prompt: KV only promises to drop expired entries eventually, and the local
  // backend can serve one for minutes. expireIn is here to bound the set's
  // size, not to decide who gets counted.
  const fp = await fingerprint(clientIp(req));
  const seen = await kv.get<number>(["seen", fp]);
  const now = Date.now();

  let counted = false;
  const lapsed = seen.value === null || now - seen.value >= DEDUP_MS;
  const claim = lapsed
    ? await kv.atomic()
      .check(seen)
      .set(["seen", fp], now, { expireIn: DEDUP_MS * 2 })
      .commit()
    : { ok: false };

  if (claim.ok) {
    const cc = (url.searchParams.get("cc") ?? "").slice(0, 2).toUpperCase();
    const city = (url.searchParams.get("city") ?? "").slice(0, 80).trim();
    const country = (url.searchParams.get("country") ?? "").slice(0, 80).trim();
    const label = placeLabel(city, country);
    counted = await record(
      `${Math.round(lat)},${Math.round(lon)}`,
      lat,
      lon,
      label,
      cc,
    );
  }

  const { regions, total } = await summary();
  return json({ ok: true, counted, regions, total }, origin);
}

export async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  try {
    return await route(req, origin);
  } catch (err) {
    // A bare throw would answer without CORS headers, which the browser
    // reports as a network error rather than the failure it actually is.
    console.error(err);
    return json({ ok: false, reason: "internal error" }, origin, 500);
  }
}

if (import.meta.main) Deno.serve(handler);

async function route(req: Request, origin: string | null): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders(origin),
        "access-control-allow-methods": "GET, OPTIONS",
      },
    });
  }
  if (req.method !== "GET") {
    return json({ ok: false, reason: "method not allowed" }, origin, 405);
  }

  switch (url.pathname) {
    case "/hit":
      return await handleHit(req, url, origin);

    case "/cells": {
      const { cells, regions, total } = await summary();
      return json({
        v: 1,
        updated: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
        regions,
        total,
        cells,
      }, origin);
    }

    case "/health": {
      const { regions, total } = await summary();
      return json({ ok: true, regions, total }, origin);
    }

    case "/":
      return json({
        service: "visitor-globe",
        routes: ["/hit?cc=&lat=&lon=&city=&country=", "/cells", "/health"],
        source:
          "https://github.com/zhangquanchen/zhangquanchen.github.io/tree/main/_tools/visitor-globe/deno",
      }, origin);

    default:
      return json({ ok: false, reason: "not found" }, origin, 404);
  }
}
