/*
 * Headless smoke test for the globe's data path (snapshot -> dots -> recorder).
 * Stubs just enough DOM to load globe.js outside a browser.
 *
 * The behaviour worth protecting is that a visit reaches exactly one recorder:
 * the project's own endpoint when it answers, the public counter when it does
 * not. Reporting to both would double-count everyone once the sync job adds
 * the two tallies together.
 *
 * Run with:  node _tools/visitor-globe/test_globe.js
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const SCRIPT = path.join(__dirname, "..", "..", "assets", "visitor-globe", "globe.js");
const RECORDER = "https://recorder.example";
const COUNTER = { base: "https://abacus.example", namespace: "site.example", prefix: "geo_" };

const SNAPSHOT = {
  cells: {
    CN: { n: 5, lat: 35.862, lon: 104.195, l: "China" },
    US: { n: 2, lat: 37.09, lon: -95.713, l: "United States" },
    "40,116": { n: 57, lat: 39.904, lon: 116.407, l: "Beijing, China" },
    "seed:GB": { n: 12, lat: 55.378, lon: -3.436, l: "United Kingdom", est: 1 }
  }
};

const SINGAPORE = {
  latitude: "1.3667", longitude: "103.8", city: "Singapore",
  country: "Singapore", country_code: "SG"
};
const BEIJING = {
  latitude: "39.9042", longitude: "116.4074", city: "Beijing",
  country: "China", country_code: "CN"
};

function noopContext() {
  const gradient = { addColorStop() {} };
  return new Proxy({}, {
    get(_, prop) {
      if (prop === "createRadialGradient" || prop === "createLinearGradient") {
        return () => gradient;
      }
      return () => {};
    },
    set() { return true; }
  });
}

function makeEnv({ geo, calls, store, recorderUp }) {
  const elements = {};
  const element = (id) => (elements[id] = elements[id] || {
    id, style: {}, textContent: "", appendChild() {}, addEventListener() {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    setAttribute() {}
  });

  const win = {
    devicePixelRatio: 1,
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame() {},
    addEventListener() {}
  };

  win.document = {
    getElementById: (id) => (id === "vg-globe" || id === "vg-caption" ? element(id) : null),
    createElement: () => ({
      style: {}, addEventListener() {}, setAttribute() {},
      getContext: noopContext, getBoundingClientRect: () => ({ left: 0, top: 0 })
    }),
    addEventListener() {}
  };
  win.getComputedStyle = () => ({ position: "static" });
  win.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); }
  };
  win.fetch = (url) => {
    if (url.includes("land-dots")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ lonlat: [0, 0] }) });
    }
    if (url.includes("visitors.json")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(SNAPSHOT) });
    }
    if (url.startsWith(RECORDER)) {
      calls.recorder.push(url);
      return recorderUp
        ? Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, counted: true }) })
        : Promise.reject(new Error("recorder down"));
    }
    if (url.includes("/hit/")) {
      calls.counter.push(url);
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 1 }) });
    }
    if (geo && (url.includes("geojs") || url.includes("ipwho") || url.includes("ipinfo"))) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(geo) });
    }
    return Promise.reject(new Error("offline: " + url));
  };
  return { win, elements };
}

function run(name, { geo, store = {}, recorder = RECORDER, recorderUp = true }) {
  const calls = { recorder: [], counter: [] };
  const { win, elements } = makeEnv({ geo, calls, store, recorderUp });
  const sandbox = `(function(window, document, getComputedStyle, localStorage, fetch, requestAnimationFrame){${
    fs.readFileSync(SCRIPT, "utf8")
  }})`;
  // eslint-disable-next-line no-eval
  eval(sandbox)(win, win.document, win.getComputedStyle, win.localStorage,
                win.fetch, win.requestAnimationFrame);

  const globe = win.VisitorGlobe.init({
    mount: "vg-globe",
    captionId: "vg-caption",
    snapshotUrl: "/assets/visitor-globe/visitors.json",
    dataUrl: "/assets/visitor-globe/land-dots.json",
    countEveryHours: 12,
    recorder,
    counter: COUNTER
  });

  // let the stubbed promise chain settle
  const settle = (n) => new Promise((resolve) => {
    const tick = () => (n-- > 0 ? setImmediate(tick) : resolve());
    tick();
  });
  return settle(6).then(() => ({
    name, state: globe.state, calls, store,
    caption: elements["vg-caption"].textContent
  }));
}

function cellsByLabel(state) {
  return Object.fromEntries(state.visitorCells.map((c) => [c.label, c.count]));
}

const PAST = {
  China: 5, "United States": 2, "Beijing, China": 57, "United Kingdom": 12
};

(async () => {
  let r = await run("recorder answers", { geo: SINGAPORE });
  assert.deepStrictEqual(cellsByLabel(r.state), { ...PAST, Singapore: 1 },
    "snapshot regions plus the viewer's own, labelled without repeating a city-state");
  assert.deepStrictEqual(r.calls.recorder, [
    RECORDER + "/hit?lat=1.3667&lon=103.8&cc=SG&city=Singapore&country=Singapore"
  ], "reports the visit to the project's own recorder, with coordinates");
  assert.deepStrictEqual(r.calls.counter, [],
    "and must NOT also tell the public counter — that would double-count");
  assert.ok(r.store["vg-counted"], "records the throttle stamp on success");
  assert.strictEqual(r.state.maxCount, 57, "largest bucket drives dot scaling");
  assert.strictEqual(r.caption,
    "You're visiting from Singapore · 5 regions on the map");
  console.log("ok  " + r.name);

  r = await run("recorder unreachable", { geo: SINGAPORE, recorderUp: false });
  assert.strictEqual(r.calls.recorder.length, 1, "tries its own recorder first");
  assert.deepStrictEqual(r.calls.counter,
    ["https://abacus.example/hit/site.example/geo_SG"],
    "falls back to the public counter so the visit is not lost");
  assert.ok(r.store["vg-counted"], "the fallback also stamps the throttle");
  console.log("ok  " + r.name);

  r = await run("no recorder configured", { geo: SINGAPORE, recorder: "" });
  assert.deepStrictEqual(r.calls.recorder, []);
  assert.deepStrictEqual(r.calls.counter,
    ["https://abacus.example/hit/site.example/geo_SG"],
    "an unset recorder degrades to the counter, it does not break counting");
  console.log("ok  " + r.name);

  r = await run("returning visitor inside the throttle window", {
    geo: BEIJING,
    store: { "vg-counted": String(Date.now()) }
  });
  assert.deepStrictEqual(cellsByLabel(r.state), PAST,
    "already-counted browser must not inflate its bucket");
  assert.deepStrictEqual(r.calls.recorder, [], "no report inside the window");
  assert.deepStrictEqual(r.calls.counter, []);
  console.log("ok  " + r.name);

  r = await run("geolocation unavailable", { geo: null });
  assert.deepStrictEqual(cellsByLabel(r.state), PAST,
    "past visitors still render without the viewer's own location");
  assert.strictEqual(r.state.you, null);
  assert.strictEqual(r.caption, "4 regions on the map");
  console.log("ok  " + r.name);

  console.log("\nall globe data-path checks passed");
})().catch((e) => { console.error(e); process.exit(1); });
