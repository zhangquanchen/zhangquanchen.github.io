/*!
 * Self-hosted visitor globe — a dependency-free 3D rotating globe drawn on a
 * <canvas> with an orthographic projection. Continents are rendered from a
 * small vendored land-dot grid (assets/visitor-globe/land-dots.json) so the
 * widget never depends on a third-party script at render time (works behind
 * the GFW, unlike clustrmaps.com / Cloudflare).
 *
 * Visitor location is resolved live from the viewer's IP via a China-reachable
 * HTTPS geolocation API, and (optionally) accumulated server-side so the globe
 * shows the real geographic distribution of all past visitors.
 *
 * Public API:  VisitorGlobe.init(options)
 */
(function () {
  "use strict";

  var DEG = Math.PI / 180;

  var DEFAULTS = {
    mount: "vg-globe",
    size: 220,
    dataUrl: "/assets/visitor-globe/land-dots.json",
    autoRotate: true,
    speed: 7,                 // degrees per second
    tilt: 16,                 // fixed latitude the globe is centered on
    interactive: true,        // drag to spin
    geo: true,                // resolve + plot the current visitor by IP
    captionId: null,          // element id to write "from City, Country" into
    storage: null,            // optional cumulative store, see README
    countEveryHours: 12,      // only contribute this browser to the map this often
    colors: {
      atmosphere: "rgba(150,212,242,0.45)",
      oceanLit: "#f2fbff",
      oceanMid: "#cdebfa",
      oceanDark: "#a4d8f0",
      land: "#33b985",
      landFar: "#93d8ba",
      graticule: "rgba(70,120,150,0.10)",
      rim: "rgba(120,170,205,0.55)",
      visitor: "#ff5a5f",
      visitorGlow: "rgba(255,90,95,0.40)",
      you: "#f6a623",
      youRing: "rgba(246,166,35,0.95)"
    }
  };

  // turn "rgba(r,g,b,a)" / "rgb(r,g,b)" into the same colour at zero alpha
  function fade(color) {
    var m = /rgba?\(([^)]+)\)/.exec(color);
    if (!m) return "rgba(0,0,0,0)";
    var p = m[1].split(",");
    return "rgba(" + (+p[0]) + "," + (+p[1]) + "," + (+p[2]) + ",0)";
  }

  function deepDefaults(opts, defs) {
    var out = {};
    for (var k in defs) out[k] = defs[k];
    for (var j in opts) {
      if (j === "colors" && opts.colors) {
        out.colors = {};
        for (var c in defs.colors) out.colors[c] = defs.colors[c];
        for (var d in opts.colors) out.colors[d] = opts.colors[d];
      } else {
        out[j] = opts[j];
      }
    }
    return out;
  }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // ---- IP geolocation (tries several China-reachable HTTPS providers) -------
  function fetchVisitorGeo() {
    var providers = [
      {
        url: "https://get.geojs.io/v1/ip/geo.json",
        parse: function (d) {
          return { lat: +d.latitude, lon: +d.longitude, city: d.city, country: d.country };
        }
      },
      {
        url: "https://ipwho.is/",
        parse: function (d) {
          if (d && d.success === false) return null;
          return { lat: +d.latitude, lon: +d.longitude, city: d.city, country: d.country };
        }
      },
      {
        url: "https://ipinfo.io/json",
        parse: function (d) {
          var loc = (d.loc || "").split(",");
          return { lat: +loc[0], lon: +loc[1], city: d.city, country: d.country };
        }
      }
    ];
    var i = 0;
    function tryNext() {
      if (i >= providers.length) return Promise.reject(new Error("geo failed"));
      var p = providers[i++];
      return fetch(p.url, { mode: "cors" })
        .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
        .then(function (d) {
          var g = p.parse(d);
          if (!g || !isFinite(g.lat) || !isFinite(g.lon)) throw new Error("bad geo");
          return g;
        })
        .catch(tryNext);
    }
    return tryNext();
  }

  // ---- Optional cumulative storage adapter (Pantry: getpantry.cloud) --------
  // Stored shape: { cells: { "lat,lon": { n: count, l: "City, Country" }, ... } }
  // where lat/lon are integer-degree buckets (~city/region granularity).
  // Legacy numeric values ({ "lat,lon": count }) are still read for compat.
  function makeStore(cfg) {
    if (!cfg || !cfg.provider) return null;
    if (cfg.provider === "pantry" && cfg.pantryId) {
      var base = "https://getpantry.cloud/apiv1/pantry/" + cfg.pantryId +
                 "/basket/" + (cfg.basket || "visitor-globe");
      return {
        read: function () {
          return fetch(base, { mode: "cors" })
            .then(function (r) { return r.ok ? r.json() : {}; })
            .then(function (d) { return (d && d.cells) ? d.cells : {}; })
            .catch(function () { return {}; });
        },
        write: function (cells) {
          return fetch(base, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cells: cells })
          }).catch(function () {});
        }
      };
    }
    return null;
  }

  function VisitorGlobe(options) {
    var cfg = deepDefaults(options || {}, DEFAULTS);
    var mount = typeof cfg.mount === "string" ? document.getElementById(cfg.mount) : cfg.mount;
    if (!mount) return;

    var size = cfg.size;
    var dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    if (getComputedStyle(mount).position === "static") mount.style.position = "relative";

    var canvas = document.createElement("canvas");
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.style.display = "block";
    canvas.style.cursor = cfg.interactive ? "grab" : "default";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Rotating globe of visitor locations");
    mount.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);   // draw in CSS pixels; back the canvas at device resolution

    // tooltip shown when hovering a visitor dot
    var tip = document.createElement("div");
    tip.style.cssText = "position:absolute;pointer-events:none;z-index:5;opacity:0;" +
      "transform:translate(-50%,-145%);transition:opacity .12s;white-space:nowrap;" +
      "background:rgba(13,18,38,0.94);color:#fff;font-size:11px;line-height:1.3;" +
      "padding:4px 8px;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,0.28);";
    mount.appendChild(tip);
    function showTip(text, x, y) {
      tip.textContent = text; tip.style.left = x + "px"; tip.style.top = y + "px";
      tip.style.opacity = "1";
    }
    function hideTip() { tip.style.opacity = "0"; }

    var cx = size / 2, cy = size / 2;
    var R = size / 2 * 0.78;   // leave headroom for the atmosphere halo

    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var state = {
      yaw: -100,                 // start centered on the Pacific-ish so Asia+Americas show
      tilt: cfg.tilt,
      autoRotate: cfg.autoRotate && !reduceMotion,
      land: [],                  // [lon,lat,...]
      visitorCells: [],          // [{lon,lat,count}]
      maxCount: 1,
      you: null,                 // {lon,lat,city,country}
      dragging: false,
      hovering: false,
      lastX: 0, lastY: 0,
      lastT: 0
    };
    this.state = state;

    // project lon/lat (deg) to screen using orthographic projection centered
    // at (yaw, tilt). Returns null when the point is on the far hemisphere.
    function project(lon, lat) {
      var phi0 = state.tilt * DEG;
      var dl = (lon - state.yaw) * DEG;
      var la = lat * DEG;
      var cosc = Math.sin(phi0) * Math.sin(la) +
                 Math.cos(phi0) * Math.cos(la) * Math.cos(dl);
      if (cosc < 0) return null;
      var x = Math.cos(la) * Math.sin(dl);
      var y = Math.cos(phi0) * Math.sin(la) - Math.sin(phi0) * Math.cos(la) * Math.cos(dl);
      return { x: cx + R * x, y: cy - R * y, depth: cosc };
    }

    function drawSphere() {
      // 1) soft atmospheric halo glowing past the rim
      var halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.26);
      halo.addColorStop(0, cfg.colors.atmosphere);
      halo.addColorStop(1, fade(cfg.colors.atmosphere));
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.26, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // 2) the ocean sphere, lit from the upper-left for a 3D feel
      var g = ctx.createRadialGradient(
        cx - R * 0.42, cy - R * 0.46, R * 0.05,
        cx, cy, R * 1.08);
      g.addColorStop(0, cfg.colors.oceanLit);
      g.addColorStop(0.55, cfg.colors.oceanMid);
      g.addColorStop(1, cfg.colors.oceanDark);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // 3) a subtle specular highlight on the lit side
      var spec = ctx.createRadialGradient(
        cx - R * 0.4, cy - R * 0.44, 0,
        cx - R * 0.4, cy - R * 0.44, R * 0.7);
      spec.addColorStop(0, "rgba(255,255,255,0.12)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = spec;
      ctx.fill();

      // 4) crisp rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = cfg.colors.rim;
      ctx.stroke();
    }

    function drawGraticule() {
      ctx.strokeStyle = cfg.colors.graticule;
      ctx.lineWidth = 1;
      var lat, lon, first, p;
      for (lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); first = true;
        for (lon = -180; lon <= 180; lon += 4) {
          p = project(lon, lat);
          if (!p) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (lon = -180; lon < 180; lon += 30) {
        ctx.beginPath(); first = true;
        for (lat = -80; lat <= 80; lat += 4) {
          p = project(lon, lat);
          if (!p) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
    }

    function drawLand() {
      var arr = state.land, i, lon, lat, p;
      // near band (brighter, larger)
      ctx.fillStyle = cfg.colors.land;
      ctx.beginPath();
      for (i = 0; i < arr.length; i += 2) {
        lon = arr[i]; lat = arr[i + 1];
        p = project(lon, lat);
        if (!p || p.depth < 0.45) continue;
        var r = 1.0 + 1.1 * p.depth;
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
      // far band (dim) for a sense of curvature near the limb
      ctx.fillStyle = cfg.colors.landFar;
      ctx.beginPath();
      for (i = 0; i < arr.length; i += 2) {
        lon = arr[i]; lat = arr[i + 1];
        p = project(lon, lat);
        if (!p || p.depth >= 0.45) continue;
        var r2 = 0.7 + 0.8 * p.depth;
        ctx.moveTo(p.x + r2, p.y);
        ctx.arc(p.x, p.y, r2, 0, Math.PI * 2);
      }
      ctx.fill();
    }

    function drawVisitorCells() {
      var cells = state.visitorCells, i, c, p;
      for (i = 0; i < cells.length; i++) {
        c = cells[i];
        p = project(c.lon, c.lat);
        c.vis = !!p;
        if (!p) continue;
        var mag = Math.sqrt(c.count / state.maxCount);     // 0..1
        var r = (1.6 + 3.8 * mag) * (0.55 + 0.45 * p.depth);
        c.sx = p.x; c.sy = p.y; c.hit = r + 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 2.5, 0, Math.PI * 2);
        ctx.fillStyle = cfg.colors.visitorGlow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = cfg.colors.visitor;
        ctx.globalAlpha = 0.6 + 0.4 * p.depth;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function drawYou(now) {
      if (!state.you) return;
      var p = project(state.you.lon, state.you.lat);
      state.you.vis = !!p;
      if (!p) return;
      state.you.sx = p.x; state.you.sy = p.y; state.you.hit = 11;
      var pulse = (Math.sin(now / 480) + 1) / 2;     // 0..1
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 + 7 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = fade(cfg.colors.youRing).replace(",0)", "," + (0.75 * (1 - pulse)) + ")");
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = cfg.colors.you;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120,70,0,0.9)";
      ctx.fill();
    }

    function frame(now) {
      if (!state.lastT) state.lastT = now;
      var dt = (now - state.lastT) / 1000;
      state.lastT = now;
      if (state.autoRotate && !state.dragging && !state.hovering) {
        state.yaw = (state.yaw + cfg.speed * dt) % 360;
      }
      ctx.clearRect(0, 0, size, size);
      drawSphere();
      drawGraticule();
      drawLand();
      drawVisitorCells();
      drawYou(now);
      requestAnimationFrame(frame);
    }

    // ---- interactivity: drag to spin + hover/tap a dot to see its origin ----
    function labelFor(hit) {
      if (hit.type === "you") {
        var place = [state.you.city, state.you.country].filter(Boolean).join(", ");
        return place ? ("You · " + place) : "You are here";
      }
      var c = hit.cell, name = c.label;
      if (!name) {
        name = Math.abs(Math.round(c.lat)) + "°" + (c.lat >= 0 ? "N" : "S") + " " +
               Math.abs(Math.round(c.lon)) + "°" + (c.lon >= 0 ? "E" : "W");
      }
      return name + " · " + c.count + (c.count > 1 ? " visitors" : " visitor");
    }
    function hitTest(lx, ly) {
      var best = null, bestD = Infinity, i, c, d;
      for (i = 0; i < state.visitorCells.length; i++) {
        c = state.visitorCells[i];
        if (!c.vis) continue;
        d = Math.sqrt((lx - c.sx) * (lx - c.sx) + (ly - c.sy) * (ly - c.sy));
        if (d <= Math.max(c.hit, 9) && d < bestD) { bestD = d; best = { type: "cell", cell: c, sx: c.sx, sy: c.sy }; }
      }
      if (state.you && state.you.vis) {
        d = Math.sqrt((lx - state.you.sx) * (lx - state.you.sx) + (ly - state.you.sy) * (ly - state.you.sy));
        if (d <= 11 && d < bestD) { best = { type: "you", sx: state.you.sx, sy: state.you.sy }; }
      }
      return best;
    }
    function localPos(e) {
      var rect = canvas.getBoundingClientRect();
      var src = e.touches && e.touches[0] ? e.touches[0] : e;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }

    if (cfg.interactive) {
      var onDown = function (x, y) {
        state.dragging = true; state.lastX = x; state.lastY = y;
        canvas.style.cursor = "grabbing";
      };
      var onMove = function (x, y) {
        if (!state.dragging) return;
        state.yaw = (state.yaw - (x - state.lastX) * 0.5) % 360;
        state.tilt = clamp(state.tilt + (y - state.lastY) * 0.3, -75, 75);
        state.lastX = x; state.lastY = y;
      };
      var onUp = function () { state.dragging = false; canvas.style.cursor = "grab"; };

      canvas.addEventListener("mousedown", function (e) { onDown(e.clientX, e.clientY); });
      window.addEventListener("mousemove", function (e) { onMove(e.clientX, e.clientY); });
      window.addEventListener("mouseup", onUp);

      // hover the globe: pause spin and reveal the dot's origin
      canvas.addEventListener("mouseenter", function () { state.hovering = true; });
      canvas.addEventListener("mouseleave", function () { state.hovering = false; hideTip(); });
      canvas.addEventListener("mousemove", function (e) {
        if (state.dragging) { hideTip(); return; }
        var pos = localPos(e), hit = hitTest(pos.x, pos.y);
        if (hit) { showTip(labelFor(hit), hit.sx, hit.sy); canvas.style.cursor = "pointer"; }
        else { hideTip(); canvas.style.cursor = "grab"; }
      });

      // touch: tap a dot to show its origin, otherwise drag to spin
      canvas.addEventListener("touchstart", function (e) {
        var pos = localPos(e), hit = hitTest(pos.x, pos.y);
        if (hit) { state.hovering = true; showTip(labelFor(hit), hit.sx, hit.sy); }
        else { var t = e.touches[0]; onDown(t.clientX, t.clientY); }
      }, { passive: true });
      canvas.addEventListener("touchmove", function (e) {
        var t = e.touches[0]; onMove(t.clientX, t.clientY);
      }, { passive: true });
      canvas.addEventListener("touchend", function () {
        onUp(); state.hovering = false; setTimeout(hideTip, 1800);
      });
    }

    // pause the animation loop entirely when the tab is hidden
    document.addEventListener("visibilitychange", function () {
      state.lastT = 0;
    });

    // ---- load land data + kick off rendering ----
    fetch(cfg.dataUrl, { mode: "cors" })
      .then(function (r) { return r.json(); })
      .then(function (d) { state.land = d.lonlat || []; })
      .catch(function () { /* still show the ocean sphere */ })
      .then(function () { requestAnimationFrame(frame); });

    // ---- visitor geo + cumulative distribution ----
    var store = makeStore(cfg.storage);

    function cellsToArray(cells) {
      var arr = [], max = 1;
      for (var k in cells) {
        var parts = k.split(",");
        var lat = +parts[0], lon = +parts[1];
        var v = cells[k], n, label = "";
        if (v && typeof v === "object") { n = +v.n; label = v.l || ""; }
        else { n = +v; }
        if (!isFinite(lat) || !isFinite(lon) || !n) continue;
        arr.push({ lat: lat, lon: lon, count: n, label: label });
        if (n > max) max = n;
      }
      state.maxCount = max;
      return arr;
    }

    if (store) {
      store.read().then(function (cells) {
        state.visitorCells = cellsToArray(cells);
      });
    }

    if (cfg.geo) {
      fetchVisitorGeo().then(function (g) {
        state.you = g;
        if (cfg.captionId) {
          var el = document.getElementById(cfg.captionId);
          if (el) {
            var place = [g.city, g.country].filter(Boolean).join(", ");
            el.textContent = place ? ("You're visiting from " + place) : "";
          }
        }
        // point the globe at the visitor on first load (nice reveal)
        if (!state.dragging) state.yaw = g.lon;

        if (store) contribute(g);
      }).catch(function () { /* no dot, globe still spins */ });
    }

    function contribute(g) {
      var flagKey = "vg-counted";
      var now = Date.now();
      var last = 0;
      try { last = +localStorage.getItem(flagKey) || 0; } catch (e) {}
      if (now - last < cfg.countEveryHours * 3600 * 1000) return;
      var key = Math.round(g.lat) + "," + Math.round(g.lon);
      var label = [g.city, g.country].filter(Boolean).join(", ");
      store.read().then(function (cells) {
        var prev = cells[key];
        var prevN = (prev && typeof prev === "object") ? (+prev.n || 0) : (+prev || 0);
        var prevL = (prev && typeof prev === "object") ? (prev.l || "") : "";
        cells[key] = { n: prevN + 1, l: label || prevL };
        state.visitorCells = cellsToArray(cells);
        return store.write(cells);
      }).then(function () {
        try { localStorage.setItem(flagKey, String(now)); } catch (e) {}
      });
    }
  }

  window.VisitorGlobe = { init: function (opts) { return new VisitorGlobe(opts); } };
})();
