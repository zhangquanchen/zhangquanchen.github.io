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

# The globe used to accumulate visitors in a getpantry.cloud basket, which has
# been returning "Pantry is having critical issues" since some point after the
# 2026-06 launch — taking two months of real locations offline. The data is
# probably still in there, so keep knocking: the first run that gets a reply
# imports those dots and commits them, after which they live in git for good.
LEGACY_PANTRY_ID = os.environ.get("LEGACY_PANTRY_ID",
                                  "6600f0f7-29ce-49d2-be7c-b635f02c75e7")
LEGACY_PANTRY_BASKET = os.environ.get("LEGACY_PANTRY_BASKET", "visitor-globe")
LEGACY_URL = os.environ.get("LEGACY_PANTRY_URL", "")   # overridable for testing
LEGACY_PREFIX = "legacy:"

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


def import_legacy_cells(carried):
    """Merge the old Pantry basket into `carried` (keyed "legacy:lat,lon").

    Entries are {"n": count, "l": "City, Country"} keyed by integer-degree
    lat,lon; very old ones stored a bare count. Counts only ever move up, so a
    partial read can never shrink the map.
    """
    url = LEGACY_URL or (f"https://getpantry.cloud/apiv1/pantry/{LEGACY_PANTRY_ID}"
                         f"/basket/{LEGACY_PANTRY_BASKET}")
    if not url:
        return
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "visitor-globe-sync"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            basket = json.loads(resp.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001 — any failure just means "not yet"
        print(f"legacy pantry unavailable ({e}); keeping {len(carried)} imported cells")
        return

    added = 0
    for key, value in (basket.get("cells") or {}).items():
        try:
            lat, lon = (float(p) for p in key.split(",", 1))
        except ValueError:
            continue
        if isinstance(value, dict):
            count, label = int(value.get("n") or 0), (value.get("l") or "")
        else:
            count, label = int(value or 0), ""
        if count <= 0:
            continue
        slot = carried.setdefault(LEGACY_PREFIX + key,
                                  {"n": 0, "lat": lat, "lon": lon, "l": label})
        if count > slot["n"]:
            slot["n"] = count
            added += 1
        if label:
            slot["l"] = label
    print(f"legacy pantry: recovered {len(carried)} cells ({added} updated)")


def main():
    countries = load_json(COUNTRIES, {}).get("countries") or {}
    if not countries:
        raise SystemExit(f"missing or empty country table: {COUNTRIES}")

    previous = load_json(OUT, {})

    # Anything already recovered stays put even if Pantry breaks again.
    cells = {k: v for k, v in (previous.get("cells") or {}).items()
             if k.startswith(LEGACY_PREFIX)}
    import_legacy_cells(cells)

    print(f"sweeping {len(countries)} country counters in '{NAMESPACE}'")
    for code, meta in sorted(countries.items()):
        count = counter_value(f"{PREFIX}{code}")
        if count:
            cells[code] = {"n": count, "lat": meta["lat"], "lon": meta["lon"],
                           "l": meta["name"]}
            print(f"  {code} {meta['name']}: {count}")

    cells = dict(sorted(cells.items()))
    total = sum(c["n"] for c in cells.values())
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
