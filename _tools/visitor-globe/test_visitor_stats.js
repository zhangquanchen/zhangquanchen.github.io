// Run with: node _tools/visitor-globe/test_visitor_stats.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const template = fs.readFileSync(path.join(__dirname, '../../_includes/visitor-stats.html'), 'utf8');
const script = template.match(/<script>\s*([\s\S]*?)<\/script>/)[1]
  .replace(/\{\{\s*([^}|]+)[^}]*\}\}/g, (_, key) => JSON.stringify({
    abacus_ns: 'site', abacus_pv: 'pv', abacus_uv: 'uv',
    'site.abacus_uv_offset': 761, 'site.abacus_pv_offset': 627
  }[key.trim()]));

const flag = 'visitor-uv:site:uv';
function load({ store, server, fail = false, locks = null, pending = false }) {
  const elements = {
    'abacus-uv-value': { textContent: '1526' },
    'abacus-pv-value': { textContent: '2427' }
  };
  const timers = [];
  const calls = [];
  vm.runInNewContext(script, {
    document: { getElementById: id => elements[id] },
    navigator: { locks }, AbortController,
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {},
    localStorage: {
      getItem: key => store[key] ?? null,
      setItem: (key, value) => { store[key] = value; }
    },
    fetch: (url, options) => {
      calls.push(url);
      if (pending) return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => reject(Error('timeout')));
      });
      if (fail) return Promise.resolve({ ok: false, json: () => ({ error: 'unavailable' }) });
      const key = url.endsWith('/uv') ? 'uv' : 'pv';
      if (url.includes('/hit/')) server[key]++;
      return Promise.resolve({ ok: true, json: () => ({ value: server[key] }) });
    }
  });
  return { elements, timers, calls };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const value = (page, key) => +String(page.elements['abacus-' + key + '-value'].textContent).replace(/,/g, '');

(async () => {
  const store = {}, server = { uv: 765, pv: 1800 };
  let page = load({ store, server });
  await settle();
  assert.equal(value(page, 'uv'), 1527);
  assert.equal(value(page, 'pv'), 2428);
  assert.ok(store[flag]);

  page = load({ store, server });
  await settle();
  assert.equal(value(page, 'uv'), 1527);
  assert.equal(value(page, 'pv'), 2429);
  assert.ok(page.calls.some(url => url.includes('/get/site/uv')));

  page = load({ store: {}, server });
  await settle();
  assert.equal(value(page, 'uv'), 1528);
  assert.equal(value(page, 'pv'), 2430);
  console.log('ok  new browser increments UV/PV; repeat load increments only PV, without loading the globe');

  page = load({ store, server, fail: true });
  await settle();
  assert.equal(value(page, 'uv'), 1527);
  assert.equal(value(page, 'pv'), 2429);
  const failedStore = {};
  page = load({ store: failedStore, server, fail: true });
  await settle();
  assert.equal(value(page, 'uv'), 1526);
  assert.equal(value(page, 'pv'), 2427);
  assert.equal(failedStore[flag], undefined);
  page = load({ store: failedStore, server });
  await settle();
  assert.ok(failedStore[flag]);
  console.log('ok  service errors retain fallback values, do not mark UV counted, and recover on a later load');

  page = load({ store: {}, server, pending: true });
  page.timers.forEach(fn => fn());
  await settle();
  assert.equal(value(page, 'uv'), 1526);
  assert.equal(value(page, 'pv'), 2427);
  console.log('ok  request timeout preserves visible fallback values');

  let queue = Promise.resolve();
  const locks = { request: (_, fn) => { queue = queue.then(fn); return queue; } };
  const shared = {}, simultaneous = { uv: 765, pv: 1800 };
  load({ store: shared, server: simultaneous, locks });
  load({ store: shared, server: simultaneous, locks });
  await settle();
  assert.deepEqual(simultaneous, { uv: 766, pv: 1802 });
  console.log('ok  simultaneous tabs increment UV only once when Web Locks is available');
})().catch(error => { console.error(error); process.exit(1); });
