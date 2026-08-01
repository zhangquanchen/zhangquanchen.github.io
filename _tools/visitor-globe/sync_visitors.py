#!/usr/bin/env python3
"""Snapshot the per-country visitor counters into a static JSON file.

Browsers increment one counter per country on abacus.jasoncameron.dev. Abacus
counters are unlisted — there is no "list all keys in this namespace" call — so
this job sweeps the full ISO-3166 key space from _tools/visitor-globe/countries.json
and writes the non-zero buckets to assets/visitor-globe/visitors.json.

Serving that snapshot from the site's own origin is what makes the globe show
past visitors at all: it needs no third-party read at page load, so it cannot be
taken out by a free JSON host going down (which is exactly how the previous
getpantry.cloud backend failed) or by a cross-border network block.

A visitor sees their own region immediately regardless — the browser merges it
into the map locally — so running this once a day is enough.

Run locally with:  python3 _tools/visitor-globe/sync_visitors.py
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
COUNTRIES = os.path.join(HERE, "countries.json")
OUT = os.path.join(HERE, "..", "..", "assets", "visitor-globe", "visitors.json")

API = os.environ.get("ABACUS_BASE", "https://abacus.jasoncameron.dev").rstrip("/")
NAMESPACE = os.environ.get("ABACUS_NAMESPACE", "zhangquanchen.github.io")
PREFIX = os.environ.get("ABACUS_GEO_PREFIX", "geo_")

MAX_RETRIES = 4
# Pause once this few requests are left in the current window, rather than
# guessing a fixed delay: the quota is per IP and may be shared with whatever
# else the runner is doing.
RESERVE = 3


class RateLimiter:
    """Paces requests using Abacus's RateLimit-* response headers."""

    def __init__(self):
        self.remaining = None
        self.reset_at = 0.0

    def wait(self):
        if self.remaining is None or self.remaining > RESERVE:
            return
        pause = self.reset_at - time.time() + 0.5
        if pause > 0:
            time.sleep(pause)
        self.remaining = None

    def observe(self, headers):
        try:
            self.remaining = int(headers.get("RateLimit-Remaining"))
            self.reset_at = float(headers.get("RateLimit-Reset"))
        except (TypeError, ValueError):
            self.remaining = None


limiter = RateLimiter()


def get_json(url):
    """GET a JSON document. Returns None for 404, retries on 429/5xx."""
    delay = 2.0
    for attempt in range(MAX_RETRIES):
        limiter.wait()
        req = urllib.request.Request(url, headers={"User-Agent": "visitor-globe-sync"})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                limiter.observe(resp.headers)
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                limiter.observe(e.headers)
                return None
            if e.code == 429 or e.code >= 500:
                if attempt == MAX_RETRIES - 1:
                    raise
                wait = delay
                retry_after = e.headers.get("Retry-After")
                if retry_after:
                    try:
                        # Abacus reports Retry-After in milliseconds.
                        wait = max(1.0, float(retry_after) / 1000.0)
                    except ValueError:
                        pass
                print(f"  {e.code} on {url}, retrying in {wait:.1f}s")
                time.sleep(wait)
                delay *= 2
                continue
            raise
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if attempt == MAX_RETRIES - 1:
                raise
            print(f"  {e} on {url}, retrying in {delay:.1f}s")
            time.sleep(delay)
            delay *= 2
    return None


def counter_value(key):
    data = get_json(f"{API}/get/{NAMESPACE}/{key}")
    if not data:
        return 0
    value = data.get("value")
    return value if isinstance(value, int) and value > 0 else 0


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return default


def main():
    countries = load_json(COUNTRIES, {}).get("countries") or {}
    if not countries:
        raise SystemExit(f"missing or empty country table: {COUNTRIES}")

    previous = load_json(OUT, {})

    print(f"sweeping {len(countries)} country counters in '{NAMESPACE}'")
    cells = {}
    total = 0
    for code, meta in sorted(countries.items()):
        count = counter_value(f"{PREFIX}{code}")
        if count:
            cells[code] = {"n": count, "lat": meta["lat"], "lon": meta["lon"],
                           "l": meta["name"]}
            total += count
            print(f"  {code} {meta['name']}: {count}")

    cells = dict(sorted(cells.items()))
    # Only the dots are worth a commit; "updated" alone would churn the history.
    if cells == previous.get("cells"):
        print(f"snapshot unchanged ({len(cells)} regions, {total} visits)")
        return 0

    snapshot = {
        "v": 1,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "regions": len(cells),
        "total": total,
        "cells": cells,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"wrote {len(cells)} regions / {total} visits -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
