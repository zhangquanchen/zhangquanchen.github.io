#!/usr/bin/env python3
"""Snapshot the visitor map into assets/visitor-globe/visitors.json.

This file is the reason the globe can show past visitors at all. Serving it
from the site's own origin means no third-party call at page load, and — more
to the point — it means the map lives in git. The globe lost its entire history
twice before this existed:

    clustrmaps.com   the domain expired; it now serves a registrar parking page
    getpantry.cloud  permanent HTTP 400 "Pantry is having critical issues"

Both had been the only copy of the data. Nothing here is allowed to be the only
copy of anything again, so this job merges every source it can reach and never
lets a count go down: an unreachable recorder costs today's increments, not the
map.

Three kinds of key end up in the snapshot, and they are deliberately
distinguishable so any one of them can be audited or dropped on its own:

    "seed:cn-1"   estimated backfill, see seed_history.py — not measured
    "CN"          country bucket from the public Abacus counter
    "40,116"      whole-degree cell from the project's own recorder

Run locally with:  python3 _tools/visitor-globe/sync_visitors.py
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
COUNTRIES = os.path.join(HERE, "countries.json")
CONFIG = os.path.join(ROOT, "_config.yml")
OUT = os.environ.get("VISITOR_SNAPSHOT") or os.path.join(
    ROOT, "assets", "visitor-globe", "visitors.json")

API = os.environ.get("ABACUS_BASE", "https://abacus.jasoncameron.dev").rstrip("/")
NAMESPACE = os.environ.get("ABACUS_NAMESPACE", "zhangquanchen.github.io")
PREFIX = os.environ.get("ABACUS_GEO_PREFIX", "geo_")

SEED_PREFIX = "seed:"
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


def get_json(url, timeout=30, pace=True):
    """GET a JSON document. Returns None for 404, retries on 429/5xx."""
    delay = 2.0
    for attempt in range(MAX_RETRIES):
        if pace:
            limiter.wait()
        req = urllib.request.Request(url, headers={"User-Agent": "visitor-globe-sync"})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                if pace:
                    limiter.observe(resp.headers)
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                if pace:
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


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return default


def recorder_base():
    """Read the recorder URL from _config.yml so the site and this job agree."""
    override = os.environ.get("VISITOR_RECORDER")
    if override is not None:
        return override.strip().rstrip("/")
    try:
        with open(CONFIG, encoding="utf-8") as f:
            found = re.search(r'^visitor_globe_recorder\s*:\s*"?([^"#\s]*)"?',
                              f.read(), re.MULTILINE)
    except OSError:
        return ""
    return found.group(1).rstrip("/") if found else ""


def keep(cells, key, count, lat, lon, label):
    """Merge one observation. Counts only ever move up."""
    if count <= 0:
        return
    slot = cells.setdefault(key, {"n": 0, "lat": lat, "lon": lon, "l": label})
    slot["n"] = max(int(slot.get("n") or 0), int(count))
    if label:
        slot["l"] = label


def read_recorder(cells, previous):
    """Fold in the project's own recorder: whole-degree cells with city labels."""
    base = recorder_base()
    if not base:
        print("no recorder configured; skipping")
        return
    try:
        # A sleeping deployment can take a while to answer its first request.
        data = get_json(f"{base}/cells", timeout=60, pace=False)
    except Exception as e:  # noqa: BLE001 — an outage must not fail the job
        print(f"recorder unreachable ({e}); keeping the cells already in git")
        data = None

    if not data:
        for key, cell in (previous or {}).items():
            if "," in key and not key.startswith(SEED_PREFIX):
                keep(cells, key, cell.get("n"), cell.get("lat"), cell.get("lon"),
                     cell.get("l") or "")
        return

    added = 0
    for key, cell in (data.get("cells") or {}).items():
        try:
            lat, lon = float(cell["lat"]), float(cell["lon"])
        except (KeyError, TypeError, ValueError):
            continue
        keep(cells, key, cell.get("n") or 0, lat, lon, cell.get("l") or "")
        added += 1
    print(f"recorder: {added} cells / {data.get('total', 0)} visits")


def read_counter(cells, countries):
    """Fold in the public per-country counter used when the recorder is down."""
    print(f"sweeping {len(countries)} country counters in '{NAMESPACE}'")
    for code, meta in sorted(countries.items()):
        data = get_json(f"{API}/get/{NAMESPACE}/{PREFIX}{code}")
        value = (data or {}).get("value")
        if isinstance(value, int) and value > 0:
            keep(cells, code, value, meta["lat"], meta["lon"], meta["name"])
            print(f"  {code} {meta['name']}: {value}")


def main():
    countries = load_json(COUNTRIES, {}).get("countries") or {}
    if not countries:
        raise SystemExit(f"missing or empty country table: {COUNTRIES}")

    previous = (load_json(OUT, {}) or {}).get("cells") or {}
    cells = {}

    # The estimated backfill is never re-derived; it just rides along.
    for key, cell in previous.items():
        if key.startswith(SEED_PREFIX):
            cells[key] = cell

    read_recorder(cells, previous)
    read_counter(cells, countries)

    # Whatever the sources said, the map cannot shrink.
    for key, cell in previous.items():
        keep(cells, key, cell.get("n") or 0, cell.get("lat"), cell.get("lon"),
             cell.get("l") or "")

    cells = dict(sorted(cells.items()))
    total = sum(c["n"] for c in cells.values())
    seeded = sum(c["n"] for k, c in cells.items() if k.startswith(SEED_PREFIX))

    # Only the dots are worth a commit; "updated" alone would churn the history.
    if cells == previous:
        print(f"snapshot unchanged ({len(cells)} regions, {total} visits)")
        return 0

    snapshot = {
        "v": 1,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "regions": len(cells),
        "total": total,
        "estimated": seeded,
        "cells": cells,
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    print(f"wrote {len(cells)} regions / {total} visits "
          f"({seeded} estimated) -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
