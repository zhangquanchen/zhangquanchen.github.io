#!/usr/bin/env python3
"""Tests for the snapshot merge rules in sync_visitors.py.

The rules exist because the globe has twice been left with an empty map by a
recorder that went away. What must hold, whatever any recorder says today:

    a count never goes down
    an unreachable recorder costs today's increments, not its past cells
    the estimated backfill is carried through untouched

Running the real job takes minutes (it sweeps 243 rate-limited counters), so
this stubs both recorders locally and drives the script over them.

    python3 _tools/visitor-globe/test_sync.py
"""
import json
import os
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
SYNC = os.path.join(HERE, "sync_visitors.py")

# What the stubbed recorders will answer with on the next request.
STATE = {"counters": {}, "cells": None, "recorder_up": True}


class Stub(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def _send(self, code, body):
        payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if self.path == "/cells":
            if not STATE["recorder_up"]:
                return self._send(503, {"error": "down"})
            cells = STATE["cells"] or {}
            return self._send(200, {
                "v": 1, "regions": len(cells),
                "total": sum(c["n"] for c in cells.values()), "cells": cells,
            })
        if self.path.startswith("/get/"):
            key = self.path.rsplit("/", 1)[-1]
            value = STATE["counters"].get(key)
            if value is None:
                return self._send(404, {"error": "Key not found"})
            return self._send(200, {"value": value})
        self._send(404, {"error": "not found"})


def run_sync(snapshot_path, recorder):
    env = dict(os.environ)
    env.update({
        "VISITOR_SNAPSHOT": snapshot_path,
        "VISITOR_RECORDER": recorder,
        "ABACUS_BASE": f"http://127.0.0.1:{PORT}",
        "ABACUS_NAMESPACE": "test",
        "ABACUS_GEO_PREFIX": "geo_",
    })
    done = subprocess.run([sys.executable, SYNC], env=env,
                          capture_output=True, text=True)
    if done.returncode != 0:
        raise AssertionError(f"sync failed:\n{done.stdout}\n{done.stderr}")
    return done.stdout


def read(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write(path, cells):
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"v": 1, "cells": cells}, f)


def counts(snapshot):
    return {k: v["n"] for k, v in snapshot["cells"].items()}


def check(name, got, want):
    if got != want:
        raise AssertionError(f"{name}\n  got:  {got}\n  want: {want}")
    print(f"ok  {name}")


BEIJING = {"n": 7, "lat": 39.904, "lon": 116.407, "l": "Beijing, China"}
SEED = {"seed:GB": {"n": 12, "lat": 55.378, "lon": -3.436,
                    "l": "United Kingdom", "est": 1}}

server = HTTPServer(("127.0.0.1", 0), Stub)
PORT = server.server_address[1]
threading.Thread(target=server.serve_forever, daemon=True).start()
RECORDER = f"http://127.0.0.1:{PORT}"


def main():
    workdir = tempfile.mkdtemp(prefix="vg-sync-test-")
    snap = os.path.join(workdir, "visitors.json")

    # 1. Both recorders reporting, nothing on disk yet.
    STATE["counters"] = {"geo_CN": 3, "geo_US": 1}
    STATE["cells"] = {"40,116": dict(BEIJING)}
    run_sync(snap, RECORDER)
    check("merges city cells and country counters",
          counts(read(snap)), {"40,116": 7, "CN": 3, "US": 1})

    # 2. The recorder disappears. Its cells are already in git and must stay.
    STATE["recorder_up"] = False
    run_sync(snap, RECORDER)
    check("keeps the recorder's cells while it is unreachable",
          counts(read(snap)), {"40,116": 7, "CN": 3, "US": 1})
    STATE["recorder_up"] = True

    # 3. A counter that resets (or a partial read) must not shrink the map.
    STATE["counters"] = {"geo_CN": 1}
    STATE["cells"] = {"40,116": {**BEIJING, "n": 2}}
    run_sync(snap, RECORDER)
    check("never lets a count go down",
          counts(read(snap)), {"40,116": 7, "CN": 3, "US": 1})

    # 4. Real growth still gets through.
    STATE["counters"] = {"geo_CN": 9, "geo_JP": 2}
    STATE["cells"] = {"40,116": {**BEIJING, "n": 8},
                      "1,104": {"n": 3, "lat": 1.35, "lon": 103.8, "l": "Singapore"}}
    run_sync(snap, RECORDER)
    check("takes increases from either recorder",
          counts(read(snap)),
          {"1,104": 3, "40,116": 8, "CN": 9, "JP": 2, "US": 1})

    # 5. The estimated backfill rides along untouched, and stays countable.
    #    Bump a counter too, so the job actually rewrites the file.
    write(snap, {**read(snap)["cells"], **SEED})
    STATE["counters"] = {"geo_CN": 9, "geo_JP": 5}
    run_sync(snap, RECORDER)
    after = read(snap)
    check("carries the estimated backfill through a sync",
          after["cells"]["seed:GB"], SEED["seed:GB"])
    check("reports the estimate separately from measurements",
          (after["total"], after["estimated"]), (38, 12))

    # 6. Nothing changed -> no rewrite, so the git history stays quiet.
    before = open(snap, encoding="utf-8").read()
    out = run_sync(snap, RECORDER)
    check("leaves the file alone when nothing moved",
          (open(snap, encoding="utf-8").read() == before,
           "snapshot unchanged" in out),
          (True, True))

    print("\nall snapshot merge checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
