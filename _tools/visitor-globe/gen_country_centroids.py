#!/usr/bin/env python3
"""Generate the ISO-3166 country/region table used by the visitor globe.

The globe aggregates visitors per country because the counter backend
(abacus.jasoncameron.dev) only stores integers under keys that cannot be
listed — so the snapshot job has to know the complete key space up front.
This table *is* that key space, plus the coordinates each bucket is drawn at.

Re-run with:  python3 _tools/visitor-globe/gen_country_centroids.py
Output:       _tools/visitor-globe/countries.json
"""
import csv
import io
import json
import os
import sys
import urllib.request

SOURCES = [
    "https://raw.githubusercontent.com/google/dspl/master/samples/google/canonical/countries.csv",
    "https://cdn.jsdelivr.net/gh/google/dspl@master/samples/google/canonical/countries.csv",
]

OUT = os.path.join(os.path.dirname(__file__), "countries.json")

# Displayed exactly as written; keeps the map consistent with the naming used
# across mainland-Chinese sites while still plotting each place separately.
NAME_OVERRIDES = {
    "HK": "Hong Kong, China",
    "MO": "Macao, China",
    "TW": "Taiwan, China",
    "GB": "United Kingdom",
    "US": "United States",
    "RU": "Russia",
    "KR": "South Korea",
    "KP": "North Korea",
    "IR": "Iran",
    "SY": "Syria",
    "VE": "Venezuela",
    "BO": "Bolivia",
    "TZ": "Tanzania",
    "VN": "Vietnam",
    "LA": "Laos",
    "MD": "Moldova",
    "CZ": "Czechia",
    "BN": "Brunei",
}

# Antarctica has no permanent population and its centroid drags the globe's
# label list around, so it is not worth a bucket.
SKIP = {"AQ"}


def fetch_csv():
    last = None
    for url in SOURCES:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
            print(f"fetched {len(data)} bytes from {url}")
            return data
        except Exception as e:  # noqa: BLE001
            last = e
            print(f"failed {url}: {e}")
    raise SystemExit(f"could not download country data: {last}")


def main():
    rows = csv.DictReader(io.StringIO(fetch_csv()))
    table = {}
    for row in rows:
        code = (row.get("country") or "").strip().upper()
        if len(code) != 2 or code in SKIP:
            continue
        try:
            lat = round(float(row["latitude"]), 3)
            lon = round(float(row["longitude"]), 3)
        except (TypeError, ValueError):
            continue
        name = NAME_OVERRIDES.get(code) or (row.get("name") or code).strip()
        table[code] = {"lat": lat, "lon": lon, "name": name}

    missing = sorted(set(NAME_OVERRIDES) - set(table))
    if missing:
        print(f"warning: override codes absent from source: {', '.join(missing)}")

    out = {"v": 1, "count": len(table), "countries": dict(sorted(table.items()))}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1, sort_keys=False)
        f.write("\n")
    print(f"wrote {len(table)} countries -> {OUT} "
          f"({os.path.getsize(OUT) / 1024:.1f} KB)")


if __name__ == "__main__":
    sys.exit(main())
