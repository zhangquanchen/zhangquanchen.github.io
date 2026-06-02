#!/usr/bin/env python3
"""Generate a compact land-dot grid for the self-hosted visitor globe.

Downloads a low-resolution Natural Earth land polygon set and samples an
(approximately) equal-area grid of points, keeping only those that fall on
land. The result is a tiny JSON file shipped in the repo so the runtime globe
needs zero third-party requests to draw the continents.

Re-run with:  python3 _tools/visitor-globe/gen_land_dots.py
Output:       assets/visitor-globe/land-dots.json
"""
import json
import math
import os
import sys
import urllib.request

SOURCES = [
    "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json",
    "https://cdn.jsdelivr.net/gh/martynafford/natural-earth-geojson@master/110m/physical/ne_110m_land.json",
]

OUT = os.path.join(os.path.dirname(__file__), "..", "..",
                   "assets", "visitor-globe", "land-dots.json")

# Grid resolution. Smaller LAT_STEP => denser globe + bigger file.
LAT_STEP = 2.0          # degrees between latitude rings
BASE_LON_STEP = 2.0     # base longitude spacing at the equator
LAT_LIMIT = 84.0        # skip the poles (no land that matters, avoids clutter)


def fetch_geojson():
    last = None
    for url in SOURCES:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=30).read()
            print(f"fetched {len(data)} bytes from {url}")
            return json.loads(data)
        except Exception as e:  # noqa: BLE001
            last = e
            print(f"failed {url}: {e}")
    raise SystemExit(f"could not download land data: {last}")


def polygons_from(geojson):
    """Yield each polygon as a list of rings (lists of [lon, lat])."""
    for feat in geojson.get("features", []):
        geom = feat.get("geometry") or {}
        gtype = geom.get("type")
        coords = geom.get("coordinates") or []
        if gtype == "Polygon":
            yield coords
        elif gtype == "MultiPolygon":
            for poly in coords:
                yield poly


def point_in_ring(lon, lat, ring):
    """Ray-casting point-in-polygon for a single ring."""
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > lat) != (yj > lat)) and \
           (lon < (xj - xi) * (lat - yi) / (yj - yi + 1e-12) + xi):
            inside = not inside
        j = i
    return inside


def point_on_land(lon, lat, polygons, bboxes):
    for poly, (minx, miny, maxx, maxy) in zip(polygons, bboxes):
        if lon < minx or lon > maxx or lat < miny or lat > maxy:
            continue
        # even-odd across all rings (outer + holes) of this polygon
        wind = False
        for ring in poly:
            if point_in_ring(lon, lat, ring):
                wind = not wind
        if wind:
            return True
    return False


def main():
    geojson = fetch_geojson()
    polygons = list(polygons_from(geojson))
    bboxes = []
    for poly in polygons:
        xs = [p[0] for ring in poly for p in ring]
        ys = [p[1] for ring in poly for p in ring]
        bboxes.append((min(xs), min(ys), max(xs), max(ys)))
    print(f"{len(polygons)} polygons")

    dots = []
    lat = -LAT_LIMIT
    while lat <= LAT_LIMIT:
        cosl = max(math.cos(math.radians(lat)), 0.15)
        lon_step = BASE_LON_STEP / cosl
        lon = -180.0
        while lon < 180.0:
            if point_on_land(lon, lat, polygons, bboxes):
                dots.append([round(lon, 1), round(lat, 1)])
            lon += lon_step
        lat += LAT_STEP

    # Flatten to a single number array to keep the file small.
    flat = []
    for lon, lat in dots:
        flat.append(lon)
        flat.append(lat)

    out = {"v": 1, "step": LAT_STEP, "count": len(dots), "lonlat": flat}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    size = os.path.getsize(OUT)
    print(f"wrote {len(dots)} land dots -> {OUT} ({size/1024:.1f} KB)")


if __name__ == "__main__":
    sys.exit(main())
