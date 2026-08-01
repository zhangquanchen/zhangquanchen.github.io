/*
 * Headless smoke test for the globe's data path (snapshot -> dots -> counter).
 * Stubs just enough DOM to load globe.js outside a browser.
 *
 * Run with:  node _tools/visitor-globe/test_globe.js
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");

const SCRIPT = path.join(__dirname, "..", "..", "assets", "visitor-globe", "globe.js");
const SNAPSHOT = {
  cells: {
    CN: { n: 5, lat: 35.862, lon: 104.195, l: "China" },
    US: { n: 2, lat: 37.09, lon: -95.713, l: "United States" }
  }
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

function makeEnv({ geo, hits, store }) {
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
    if (url.includes("/hit/")) {
      hits.push(url);
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 1 }) });
    }
    if (geo && (url.includes("geojs") || url.includes("ipwho") || url.includes("ipinfo"))) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(geo) });
    }
    return Promise.reject(new Error("offline: " + url));
  };
  return { win, elements };
}

function run(name, { geo, store = {} }) {
  const hits = [];
  const { win, elements } = makeEnv({ geo, hits, store });
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
    counter: { base: "https://abacus.example", namespace: "site.example", prefix: "geo_" }
  });

  // let the stubbed promise chain settle
  return new Promise((resolve) => setImmediate(() => setImmediate(() => setImmediate(() => {
    resolve({ name, state: globe.state, hits, caption: elements["vg-caption"].textContent });
  }))));
}

function cellsByLabel(state) {
  return Object.fromEntries(state.visitorCells.map((c) => [c.label, c.count]));
}

(async () => {
  let r = await run("fresh visitor from a new region", {
    geo: { latitude: "1.3667", longitude: "103.8", city: "Singapore",
           country: "Singapore", country_code: "SG" }
  });
  let cells = cellsByLabel(r.state);
  assert.deepStrictEqual(cells, { China: 5, "United States": 2, Singapore: 1 },
    "snapshot regions plus the viewer's own");
  assert.deepStrictEqual(r.hits, ["https://abacus.example/hit/site.example/geo_SG"],
    "counts the visit once, under the country key");
  assert.strictEqual(r.state.maxCount, 5, "largest bucket drives dot scaling");
  assert.strictEqual(r.caption, "You're visiting from Singapore, Singapore · 3 regions on the map");
  console.log("ok  " + r.name);

  r = await run("returning visitor inside the throttle window", {
    geo: { latitude: "39.9", longitude: "116.4", city: "Beijing",
           country: "China", country_code: "CN" },
    store: { "vg-counted": String(Date.now()) }
  });
  cells = cellsByLabel(r.state);
  assert.deepStrictEqual(cells, { China: 5, "United States": 2 },
    "already-counted browser must not inflate its bucket");
  assert.deepStrictEqual(r.hits, [], "no second increment inside the window");
  console.log("ok  " + r.name);

  r = await run("geolocation unavailable", { geo: null });
  cells = cellsByLabel(r.state);
  assert.deepStrictEqual(cells, { China: 5, "United States": 2 },
    "past visitors still render without the viewer's own location");
  assert.strictEqual(r.state.you, null);
  assert.strictEqual(r.caption, "2 regions on the map");
  console.log("ok  " + r.name);

  console.log("\nall globe data-path checks passed");
})().catch((e) => { console.error(e); process.exit(1); });
