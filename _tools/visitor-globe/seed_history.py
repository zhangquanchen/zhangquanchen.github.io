#!/usr/bin/env python3
"""Backfill the visitors the globe can no longer account for — as an estimate.

READ THIS BEFORE TRUSTING THE DOTS THIS WRITES.

Between 2026-05-15 and 2026-08-01 the site counted 379 unique visitors, and
where they came from was stored only in third-party services that have since
died with the data inside:

    clustrmaps.com   until 2026-06-02; the domain expired and now serves a
                     registrar parking page, so nothing can be read back
    getpantry.cloud  until 2026-08-01; permanent HTTP 400 from every network

Nothing was archived anywhere else: Google Analytics was never configured, the
Wayback Machine has no capture of the site or of the Pantry URL, and the old
client only cached a throttle timestamp in localStorage. Those locations are
gone for good.

Six of the 379 were re-measured by the current per-country counter on the day
it was introduced, which leaves 373 with no recorded origin. This script
spreads those 373 over a plausible readership for an English-language academic
homepage in multimodal-LLM research — heavily China, then the US, then the
usual research centres. The shape is a guess. It is not measurement.

The estimated baseline was subsequently set to 1,000 at the site owner's
request, preserving the original proportions with integer rounding. This
baseline is an estimate, not an additional 627 measured visits.

Every dot it writes is keyed "seed:<CC>" so it can be told apart from real
data, counted separately in the snapshot's "estimated" field, and removed in
one step:

    python3 _tools/visitor-globe/seed_history.py --clear

Run with no arguments to (re)write the estimate; it is idempotent.
"""
import json
import os
import sys
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
COUNTRIES = os.path.join(HERE, "countries.json")
OUT = os.path.join(ROOT, "assets", "visitor-globe", "visitors.json")

SEED_PREFIX = "seed:"

# Owner-selected estimated baseline, scaled from the original 373 distribution.
UNPLACED = 1000

# Estimated shares, not observations. Adjust freely — the assertion below is
# the only thing that has to hold.
DISTRIBUTION = {
    "CN": 426, "US": 198, "SG": 43, "HK": 35, "GB": 32, "DE": 30, "JP": 27,
    "KR": 24, "CA": 22, "AU": 19, "IN": 19, "FR": 16, "CH": 13, "NL": 13, "TW": 11,
    "IL": 8, "SE": 8, "IT": 8, "ES": 5, "RU": 5, "BR": 5, "PL": 5, "IE": 5,
    "VN": 5, "TH": 3, "AE": 3, "FI": 3, "BE": 3, "AT": 3, "NO": 3,
}


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return default


def write(snapshot):
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")


def rebuild(cells):
    cells = dict(sorted(cells.items()))
    total = sum(int(c["n"]) for c in cells.values())
    estimated = sum(int(c["n"]) for k, c in cells.items() if k.startswith(SEED_PREFIX))
    return {
        "v": 1,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "regions": len(cells),
        "total": total,
        "estimated": estimated,
        "cells": cells,
    }


def main(argv):
    countries = load_json(COUNTRIES, {}).get("countries") or {}
    if not countries:
        raise SystemExit(f"missing or empty country table: {COUNTRIES}")

    previous = (load_json(OUT, {}) or {}).get("cells") or {}
    measured = {k: v for k, v in previous.items() if not k.startswith(SEED_PREFIX)}

    if "--clear" in argv:
        snapshot = rebuild(measured)
        write(snapshot)
        print(f"removed the estimate; {snapshot['regions']} measured regions "
              f"/ {snapshot['total']} visits remain")
        return 0

    total = sum(DISTRIBUTION.values())
    if total != UNPLACED:
        raise SystemExit(f"distribution sums to {total}, expected {UNPLACED}")

    unknown = sorted(set(DISTRIBUTION) - set(countries))
    if unknown:
        raise SystemExit(f"no centroid for: {', '.join(unknown)}")

    cells = dict(measured)
    for code, count in DISTRIBUTION.items():
        meta = countries[code]
        cells[SEED_PREFIX + code] = {
            "n": count,
            "lat": meta["lat"],
            "lon": meta["lon"],
            "l": meta["name"],
            "est": 1,
        }

    snapshot = rebuild(cells)
    write(snapshot)
    print(f"wrote {len(DISTRIBUTION)} estimated regions / {total} visits "
          f"alongside {len(measured)} measured")
    print(f"snapshot: {snapshot['regions']} regions / {snapshot['total']} visits "
          f"({snapshot['estimated']} estimated) -> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
