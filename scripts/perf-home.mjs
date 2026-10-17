// Home scroll-performance harness (CLAUDE.md §11 pattern: playwright-core + headless Chromium).
//
//   node scripts/perf-home.mjs --base http://localhost:3100 --out scripts/perf-out/baseline [--vp desktop,mobile] [--maps .]
//   node scripts/perf-home.mjs --analyze scripts/perf-out/baseline [--maps .]      # re-read saved traces, no browser
//
// For each viewport it opens `/` from a production server, warms the page, then records a CDP
// trace (devtools.timeline + frames + user timing) and a CPU profile while it
//   (a) scrolls the whole page in ~60 steps with 50 ms waits,
//   (b) drags the DepthCarousel two cards,
//   (c) opens and closes the FAQ folder,
//   (d) moves the pointer across the glow cards and the hero wordmark (desktop only),
// all at 4× CPU throttling. It prints: long tasks (>50 ms) with their top self-time functions and
// source files, scripting / rendering / painting ms, frames over 16.7 and 33 ms, the heaviest
// Layout / UpdateLayer / Paint / style-recalc events with the DOM node they hit, long animation
// frames with script attribution, and the compositor layer count. Raw traces, the CPU profile and a
// JSON summary are written under --out.
//
// `--maps DIR` points at a checkout whose `.next` was built with `productionBrowserSourceMaps`
// so minified function names map back to src/ files (analysis builds only — never commit that).
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const BASE = opt("--base", "http://localhost:3100");
const ANALYZE = opt("--analyze", null);
const OUT = ANALYZE || opt("--out", "scripts/perf-out/run");
const VPS = opt("--vp", "desktop,mobile").split(",");
const MAPS = opt("--maps", null);
const THROTTLE = Number(opt("--cpu", "4"));
const INVALIDATIONS = argv.includes("--invalidations"); // also record why style/layout were invalidated (heavier trace)
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- source maps (optional) ------------------------------------------------------------------
let SourceMapConsumer = null;
if (MAPS) {
  try { ({ SourceMapConsumer } = await import("source-map-js")); } catch { console.log("(source-map-js missing: attribution by chunk only)"); }
}
const consumers = new Map();
function originOf(url, line, col) {
  if (!SourceMapConsumer || !url) return null;
  const m = url.match(/\/_next\/(static\/.+?\.js)(\?|$)/);
  if (!m) return null;
  const f = path.join(MAPS, ".next", m[1] + ".map");
  if (!existsSync(f)) return null;
  if (!consumers.has(f)) consumers.set(f, new SourceMapConsumer(JSON.parse(readFileSync(f, "utf8"))));
  const p = consumers.get(f).originalPositionFor({ line: line + 1, column: col });
  return p && p.source ? { source: p.source.replace(/^webpack:\/\/(_N_E\/)?/, "").replace(/\?.*$/, ""), name: p.name, line: p.line } : null;
}
const shortSrc = (s) => (s ? s.replace(/^\.\//, "").replace(/.*node_modules\//, "npm:") : "(unmapped)");

// ---- viewports ------------------------------------------------------------------------------
const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const VIEW = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, touch: false },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: IPHONE_UA, touch: true },
};
const PHASES = ["scroll", "drag", "faq", "hover"];

// ---- analysis -------------------------------------------------------------------------------
function analyze({ traceEvents, profile, obs, perfMarks, layers, cfg, vpName, errors, faqState }) {
  // the page's main thread: CrRendererMain with the most FunctionCall events
  const threadNames = new Map();
  for (const e of traceEvents) if (e.name === "thread_name") threadNames.set(`${e.pid}:${e.tid}`, e.args?.name);
  const fcCount = new Map();
  for (const e of traceEvents) if (e.name === "FunctionCall") fcCount.set(`${e.pid}:${e.tid}`, (fcCount.get(`${e.pid}:${e.tid}`) || 0) + 1);
  const [mainKey] = [...fcCount].filter(([k]) => threadNames.get(k) === "CrRendererMain").sort((a, b) => b[1] - a[1])[0] || [...fcCount].sort((a, b) => b[1] - a[1])[0] || [""];
  const [PID, TID] = mainKey.split(":").map(Number);
  const marks = Object.fromEntries(traceEvents.filter((e) => e.cat?.includes("blink.user_timing") && /-(start|end)$/.test(e.name)).map((e) => [e.name, e.ts]));
  const t0 = marks["scroll-start"], t1 = marks["hover-end"];
  const phaseOf = (ts) => { for (const p of PHASES) if (ts >= marks[`${p}-start`] && ts <= marks[`${p}-end`]) return p; return "between"; };
  const main = traceEvents.filter((e) => e.pid === PID && e.tid === TID && e.ph === "X" && e.ts >= t0 && e.ts <= t1).sort((a, b) => a.ts - b.ts || b.dur - a.dur);

  // self time per event (children subtracted) and per category
  const stack = [];
  for (const e of main) {
    while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent) parent.childDur = (parent.childDur || 0) + (e.dur || 0);
    stack.push(e);
  }
  const CAT = {
    scripting: /^(FunctionCall|EvaluateScript|v8\.|V8\.|TimerFire|EventDispatch|RunMicrotasks|FireAnimationFrame|FireIdleCallback|XHR|MajorGC|MinorGC|GCEvent|BlinkGC|ParseHTML|RequestAnimationFrame|ScheduleStyleRecalculation|UpdateCounters|ResourceReceivedData)/,
    rendering: /^(Layout|UpdateLayoutTree|RecalculateStyles|StyleRecalc|UpdateLayer|PrePaint|HitTest|IntersectionObserverController|ScrollLayer|Animation|AnimationFrame|SetLayerTreeId|UpdateLayerTree)/,
    painting: /^(Paint|PaintImage|RasterTask|CompositeLayers|Layerize|Commit|ImageDecode|DecodeImage|Decode LazyPixelRef|DrawLazyPixelRef|GPUTask)/,
  };
  const cat = { scripting: 0, rendering: 0, painting: 0, other: 0 };
  const byName = new Map();
  for (const e of main) {
    const self = Math.max(0, (e.dur || 0) - (e.childDur || 0)) / 1000;
    if (/RunTask$/.test(e.name)) continue;
    const c = CAT.scripting.test(e.name) ? "scripting" : CAT.rendering.test(e.name) ? "rendering" : CAT.painting.test(e.name) ? "painting" : "other";
    cat[c] += self;
    byName.set(e.name, (byName.get(e.name) || 0) + self);
  }
  const windowMs = (t1 - t0) / 1000;
  const tasks = main.filter((e) => e.name === "RunTask");
  const busyMs = tasks.reduce((s, e) => s + e.dur / 1000, 0);
  const scrollWindowMs = (marks["scroll-end"] - marks["scroll-start"]) / 1000;
  const scrollBusyMs = tasks.filter((e) => phaseOf(e.ts) === "scroll").reduce((s, e) => s + e.dur / 1000, 0);

  // CPU profile: samples with timestamps
  const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
  const samples = [];
  let ts = profile.startTime;
  for (let i = 0; i < profile.samples.length; i++) { ts += profile.timeDeltas[i] || 0; samples.push({ ts, id: profile.samples[i] }); }
  const descCache = new Map();
  const describe = (id) => {
    if (descCache.has(id)) return descCache.get(id);
    const cf = nodes.get(id)?.callFrame || {};
    const o = originOf(cf.url, cf.lineNumber, cf.columnNumber);
    const d = { fn: cf.functionName || "(anonymous)", url: (cf.url || "").replace(/^https?:\/\/[^/]+/, ""), src: o ? shortSrc(o.source) : cf.url ? "(unmapped)" : cf.functionName, name: o?.name, line: o?.line };
    descCache.set(id, d);
    return d;
  };
  const isIdle = (d) => /^\((idle|program|garbage collector)\)$/.test(d.fn);

  // long tasks with attribution
  const longTasks = tasks.filter((e) => e.dur > 50000).map((e) => {
    const per = new Map();
    for (let i = 0; i < samples.length; i++) { const s = samples[i]; if (s.ts < e.ts || s.ts > e.ts + e.dur) continue; const d = (samples[i + 1]?.ts ?? e.ts + e.dur) - s.ts; per.set(s.id, (per.get(s.id) || 0) + d); }
    const top = [...per].sort((a, b) => b[1] - a[1]).map(([id, us]) => ({ ...describe(id), ms: +(us / 1000).toFixed(1) })).filter((t) => !isIdle(t)).slice(0, 5);
    const kinds = {};
    for (const c of main) if (c.ts >= e.ts && c.ts + c.dur <= e.ts + e.dur && c.name !== "RunTask") kinds[c.name] = (kinds[c.name] || 0) + Math.max(0, c.dur - (c.childDur || 0)) / 1000;
    return { phase: phaseOf(e.ts), at: +((e.ts - t0) / 1000).toFixed(0), ms: +(e.dur / 1000).toFixed(1), top, kinds: Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v.toFixed(0)}ms`) };
  });

  // CPU self time by source file / app function over the whole window
  const bySrc = new Map(), byFn = new Map();
  let sampledTotal = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]; if (s.ts < t0 || s.ts > t1) continue;
    const d = (samples[i + 1]?.ts ?? s.ts) - s.ts; const dsc = describe(s.id); if (isIdle(dsc)) continue;
    sampledTotal += d;
    bySrc.set(dsc.src === "(unmapped)" ? dsc.url.split("/").pop() : dsc.src, (bySrc.get(dsc.src === "(unmapped)" ? dsc.url.split("/").pop() : dsc.src) || 0) + d);
    if (/src\//.test(dsc.src)) { const k = `${dsc.src.replace(/^src\//, "")}:${dsc.name || dsc.fn}${dsc.line ? `:${dsc.line}` : ""}`; byFn.set(k, (byFn.get(k) || 0) + d); }
  }
  const topSrc = [...bySrc].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => [k, +(v / 1000).toFixed(0)]);
  const topAppFn = [...byFn].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => [k, +(v / 1000).toFixed(0)]);

  // frames: PipelineReporter b/e pairs on the compositor (frame_reporter.state)
  const begins = new Map(); const frames = [];
  for (const e of traceEvents) {
    if (e.name !== "PipelineReporter") continue;
    const id = e.id2?.local ?? e.id;
    if (e.ph === "b") begins.set(id, e);
    else if (e.ph === "e") { const b = begins.get(id); if (b) { begins.delete(id); if (b.ts >= t0 && b.ts <= t1) frames.push({ dur: (e.ts - b.ts) / 1000, state: b.args?.frame_reporter?.state || b.args?.chrome_frame_reporter?.state || "", phase: phaseOf(b.ts), scroll: b.args?.frame_reporter?.scroll_state }); } }
  }
  const presented = frames.filter((f) => /PRESENTED/.test(f.state));
  const dropped = frames.filter((f) => /DROPPED/.test(f.state));
  const q = (arr, p) => (arr.length ? +arr.map((f) => f.dur).sort((a, b) => a - b)[Math.min(arr.length - 1, Math.floor(arr.length * p))].toFixed(1) : 0);
  const scrollFrames = presented.filter((f) => f.phase === "scroll");
  const phaseFrames = (ph) => { const pf = presented.filter((f) => f.phase === ph); return { presented: pf.length, dropped: dropped.filter((f) => f.phase === ph).length, over16: pf.filter((f) => f.dur > 16.7).length, over33: pf.filter((f) => f.dur > 33).length, p50: q(pf, 0.5), p95: q(pf, 0.95), max: q(pf, 1) }; };
  const frameStats = { presented: presented.length, dropped: dropped.length, over16: presented.filter((f) => f.dur > 16.7).length, over33: presented.filter((f) => f.dur > 33).length, p95: q(presented, 0.95), scroll: phaseFrames("scroll"), drag: phaseFrames("drag"), faq: phaseFrames("faq"), hover: phaseFrames("hover"), between: phaseFrames("between") };

  // heaviest render events with their node
  const heavy = {};
  const nodeOf = (e) => e.args?.endData?.layoutRoots?.[0]?.nodeName || e.args?.data?.nodeName || (e.args?.beginData?.elementCount != null ? `${e.args.beginData.elementCount} elements` : "-");
  const extraOf = (e) => (e.name === "Paint" && e.args?.data?.clip ? `clip ${Math.round(e.args.data.clip[2] - e.args.data.clip[0])}×${Math.round(e.args.data.clip[5] - e.args.data.clip[1])}` : e.name === "Layout" ? `${e.args?.beginData?.dirtyObjects ?? "?"}/${e.args?.beginData?.totalObjects ?? "?"} objects${e.args?.beginData?.partialLayout ? ", partial" : ""}` : "");
  const counts = {};
  for (const name of ["Layout", "UpdateLayoutTree", "UpdateLayer", "Paint", "PaintImage", "PrePaint", "HitTest"]) {
    const evs = main.filter((e) => e.name === name);
    counts[name] = { total: evs.length, scroll: evs.filter((e) => phaseOf(e.ts) === "scroll").length, ms: +evs.reduce((s, e) => s + Math.max(0, e.dur - (e.childDur || 0)) / 1000, 0).toFixed(0) };
    heavy[name] = evs.sort((a, b) => b.dur - a.dur).slice(0, 5).map((e) => ({ ms: +(e.dur / 1000).toFixed(1), phase: phaseOf(e.ts), node: nodeOf(e), extra: extraOf(e) }));
  }
  // which nodes get laid out / painted most during the scroll
  const nodeTally = (name) => { const m = new Map(); for (const e of main) if (e.name === name && phaseOf(e.ts) === "scroll") { const k = nodeOf(e); m.set(k, (m.get(k) || 0) + 1); } return [...m].sort((a, b) => b[1] - a[1]).slice(0, 6); };
  const scrollLayoutNodes = nodeTally("Layout"), scrollPaintNodes = nodeTally("Paint");

  // why style / layout were invalidated (only with --invalidations) and who scheduled the recalcs
  const invalidations = {};
  const stackWho = (e) => { const st = e.args?.data?.stackTrace || e.args?.beginData?.stackTrace || []; const top = st[0]; if (!top) return "(no stack)"; const o = originOf(top.url, top.lineNumber, top.columnNumber); return o ? `${shortSrc(o.source).replace(/^src\//, "")}:${o.name || top.functionName || "?"}:${o.line}` : `${top.functionName || "?"}@${(top.url || "").split("/").pop().slice(0, 24)}`; };
  for (const name of ["StyleRecalcInvalidationTracking", "LayoutInvalidationTracking", "StyleInvalidatorInvalidationTracking", "PaintInvalidationTracking", "ScheduleStyleRecalculation", "InvalidateLayout"]) {
    const per = {};
    for (const e of traceEvents) {
      if (e.name !== name || e.pid !== PID || e.tid !== TID || e.ts < t0 || e.ts > t1) continue;
      const ph = phaseOf(e.ts); const d = e.args?.data || {};
      const key = /Tracking$/.test(name) ? `${d.reason || "?"}${d.changedClass ? " ." + d.changedClass : ""}${d.changedAttribute ? " [" + d.changedAttribute + "]" : ""}${d.changedPseudo ? " " + d.changedPseudo : ""}${d.extraData ? " " + String(d.extraData).slice(0, 40) : ""} on ${d.nodeName || "?"}` : stackWho(e);
      per[ph] = per[ph] || new Map(); per[ph].set(key, (per[ph].get(key) || 0) + 1);
    }
    const out = {}; for (const [ph, m] of Object.entries(per)) out[ph] = [...m].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => [k, v]);
    if (Object.keys(out).length) invalidations[name] = out;
  }
  const recalcs = main.filter((e) => e.name === "UpdateLayoutTree");
  const ec = recalcs.map((e) => e.args?.elementCount).filter((x) => x != null).sort((a, b) => a - b);
  const recalcStats = ec.length ? { count: recalcs.length, elementsP50: ec[Math.floor(ec.length / 2)], elementsP90: ec[Math.floor(ec.length * 0.9)], elementsMax: ec[ec.length - 1], wholeDocument: ec.filter((x) => x >= ec[ec.length - 1] * 0.95).length, scrollWholeDocument: recalcs.filter((e) => phaseOf(e.ts) === "scroll" && (e.args?.elementCount ?? 0) >= ec[ec.length - 1] * 0.95).length } : null;

  // long animation frames (perf-time marks)
  const loafWin = (obs.loaf || []).filter((e) => e.t >= perfMarks["scroll-start"] && e.t <= perfMarks["hover-end"]).map((e) => ({ ...e, phase: PHASES.find((p) => e.t >= perfMarks[`${p}-start`] && e.t <= perfMarks[`${p}-end`]) || "between" }));
  const loafScripts = new Map();
  for (const e of loafWin) for (const s of e.scripts) { const o = s.line != null ? null : null; const k = `${s.inv || s.type || "?"} ← ${s.fn || "(anon)"} @ ${s.url.split("/").pop().slice(0, 28)}`; const v = loafScripts.get(k) || { n: 0, ms: 0 }; v.n++; v.ms += s.d; loafScripts.set(k, v); void o; }

  return {
    viewport: vpName, cpu: THROTTLE, errors, faqState, windowMs: +windowMs.toFixed(0), busyMs: +busyMs.toFixed(0), busyPct: +((busyMs / windowMs) * 100).toFixed(1),
    scrollBusyPct: +((scrollBusyMs / scrollWindowMs) * 100).toFixed(1), scrollWindowMs: +scrollWindowMs.toFixed(0),
    longTaskCount: longTasks.length, longTaskByPhase: Object.fromEntries([...PHASES, "between"].map((p) => [p, longTasks.filter((t) => t.phase === p).length])), longTasks,
    categoriesMs: Object.fromEntries(Object.entries(cat).map(([k, v]) => [k, +v.toFixed(0)])), topEventNames: [...byName].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => [k, +v.toFixed(0)]),
    cpuBySource: topSrc, cpuByAppFunction: topAppFn, sampledCpuMs: +(sampledTotal / 1000).toFixed(0),
    frames: frameStats, renderCounts: counts, heavy, scrollLayoutNodes, scrollPaintNodes, layers, recalcStats, invalidations,
    loaf: { count: loafWin.length, blockingMs: +loafWin.reduce((s, e) => s + e.block, 0).toFixed(0), byPhase: Object.fromEntries(PHASES.map((p) => [p, loafWin.filter((e) => e.phase === p).length])), topScripts: [...loafScripts].sort((a, b) => b[1].ms - a[1].ms).slice(0, 10).map(([k, v]) => [k, v.n, +v.ms.toFixed(0)]) },
  };
}

function print(r, cfg) {
  const line = (s = "") => console.log(s);
  line(`\n=== ${r.viewport} ${cfg.viewport.width}×${cfg.viewport.height} @ ${r.cpu}× CPU — window ${r.windowMs} ms, main thread busy ${r.busyMs} ms (${r.busyPct} %); during the scroll ${r.scrollBusyPct} % of ${r.scrollWindowMs} ms${r.errors?.length ? `  PAGE ERRORS: ${r.errors.join(" | ")}` : ""}`);
  line(`  FAQ folder state after open: ${JSON.stringify(r.faqState)}`);
  line(`  long tasks >50 ms: ${r.longTaskCount}  by phase ${JSON.stringify(r.longTaskByPhase)}`);
  for (const t of r.longTasks.slice(0, 12)) line(`    [${t.phase} +${t.at}ms] ${t.ms} ms — ${t.kinds.join(", ")} — top: ${t.top.map((x) => `${x.name || x.fn}@${x.src}${x.line ? ":" + x.line : ""} ${x.ms}ms`).join("; ")}`);
  const c = r.categoriesMs;
  line(`  main-thread self time ms — scripting ${c.scripting}, rendering ${c.rendering}, painting ${c.painting}, other ${c.other}`);
  line(`  top trace events: ${r.topEventNames.map(([k, v]) => `${k}=${v}`).join("  ")}`);
  line(`  CPU by source (sampled, ms): ${r.cpuBySource.map(([k, v]) => `${k}=${v}`).join("  ")}`);
  line(`  CPU by app function (ms): ${r.cpuByAppFunction.map(([k, v]) => `${k}=${v}`).join("  ")}`);
  const f = r.frames;
  line(`  frames: ${f.presented} presented, ${f.dropped} dropped, >16.7ms ${f.over16}, >33ms ${f.over33}, p95 ${f.p95} ms`);
  for (const ph of ["scroll", "drag", "faq", "hover", "between"]) { const x = f[ph]; if (x?.presented) line(`    ${ph.padEnd(7)} ${x.presented} presented, ${x.dropped} dropped, >16.7ms ${x.over16}, >33ms ${x.over33}, p50 ${x.p50} / p95 ${x.p95} / max ${x.max} ms`); }
  line(`  render events (total / during scroll / self ms): ${Object.entries(r.renderCounts).map(([k, v]) => `${k} ${v.total}/${v.scroll}/${v.ms}`).join("  ")}`);
  line(`  scroll-phase Layout roots: ${r.scrollLayoutNodes.map(([k, v]) => `${k}×${v}`).join(" | ")}`);
  line(`  scroll-phase Paint nodes: ${r.scrollPaintNodes.map(([k, v]) => `${k}×${v}`).join(" | ")}`);
  for (const [k, v] of Object.entries(r.heavy)) if (v.length) line(`  heaviest ${k}: ${v.map((h) => `${h.ms}ms [${h.phase}] ${h.node}${h.extra ? ` (${h.extra})` : ""}`).join(" | ")}`);
  if (r.layers) line(`  layers: max ${r.layers.max} (${r.layers.snapshots} tree changes), page-sized ${r.layers.pageSized}: ${r.layers.pageSizedLayers.map((l) => `${l.node} ${l.size} [${l.reasons.join(",")}]`).join(" | ")}`);
  if (r.recalcStats) line(`  style recalcs: ${r.recalcStats.count}; elements p50 ${r.recalcStats.elementsP50} / p90 ${r.recalcStats.elementsP90} / max ${r.recalcStats.elementsMax}; whole-document recalcs ${r.recalcStats.wholeDocument} (${r.recalcStats.scrollWholeDocument} during scroll)`);
  for (const [name, per] of Object.entries(r.invalidations || {})) for (const [ph, list] of Object.entries(per)) line(`  ${name} [${ph}]: ${list.map(([k, v]) => `${k}×${v}`).join(" | ")}`);
  line(`  long animation frames: ${r.loaf.count} (blocking ${r.loaf.blockingMs} ms) by phase ${JSON.stringify(r.loaf.byPhase)}`);
  for (const [k, n, ms] of r.loaf.topScripts) line(`    ${k}  ×${n}  ${ms} ms`);
}

// ---- analyze-only mode ----------------------------------------------------------------------
if (ANALYZE) {
  const summary = {};
  for (const vpName of VPS) {
    const f = (n) => path.join(OUT, `${vpName}.${n}.json`);
    if (!existsSync(f("trace"))) continue;
    const { traceEvents } = JSON.parse(readFileSync(f("trace"), "utf8"));
    const profile = JSON.parse(readFileSync(f("profile"), "utf8"));
    const meta = JSON.parse(readFileSync(f("meta"), "utf8"));
    const r = analyze({ traceEvents, profile, ...meta, cfg: VIEW[vpName], vpName });
    summary[vpName] = r; print(r, VIEW[vpName]);
    writeFileSync(path.join(OUT, `${vpName}.json`), JSON.stringify(r, null, 1));
  }
  writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 1));
  process.exit(0);
}

// ---- live run -------------------------------------------------------------------------------
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu-rasterization"] });
const summary = {};

for (const vpName of VPS) {
  const cfg = VIEW[vpName];
  const { touch, ...ctxOpts } = cfg;
  const ctx = await browser.newContext(ctxOpts);
  await ctx.addInitScript(() => {
    try { localStorage.setItem("nicolla-cookie-consent", JSON.stringify({ v: 1, ts: Date.now(), prefs: { analytics: false, marketing: false } })); } catch {}
    window.__loaf = []; window.__lt = [];
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ t: e.startTime, d: e.duration }); }).observe({ type: "longtask", buffered: true }); } catch {}
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__loaf.push({ t: e.startTime, d: e.duration, block: e.blockingDuration, scripts: (e.scripts || []).map((s) => ({ url: (s.sourceURL || "").replace(/^https?:\/\/[^/]+/, ""), fn: s.sourceFunctionName || "", inv: s.invoker || "", type: s.invokerType, d: s.duration, forced: s.forcedStyleAndLayoutDuration })) });
      }).observe({ type: "long-animation-frame", buffered: true });
    } catch {}
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  const cdp = await ctx.newCDPSession(page);

  // ---- load + warm ----
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(3500); // hero entrance + wordmark mount
  await page.evaluate(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } scrollTo(0, 0); });
  await sleep(2000);
  const totalScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

  // ---- layers ----
  const layerSnapshots = [];
  await cdp.send("DOM.enable");
  await cdp.send("LayerTree.enable");
  cdp.on("LayerTree.layerTreeDidChange", (e) => { if (e.layers) layerSnapshots.push(e.layers); });

  // ---- trace + profile ----
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  const traceEvents = [];
  cdp.on("Tracing.dataCollected", (e) => traceEvents.push(...e.value));
  const traceDone = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 250 });
  await cdp.send("Tracing.start", {
    traceConfig: { includedCategories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "blink.user_timing", "v8.execute", "__metadata", ...(INVALIDATIONS ? ["disabled-by-default-devtools.timeline.stack", "disabled-by-default-devtools.timeline.invalidationTracking", "disabled-by-default-blink.invalidation"] : [])], recordMode: "recordContinuously" },
    transferMode: "ReportEvents",
  });
  await cdp.send("Profiler.start");
  const mark = (n) => page.evaluate((n) => performance.mark(n), n);
  const gesture = async (x, y, dy, speed = 1600) => cdp.send("Input.synthesizeScrollGesture", { x, y, yDistance: -dy, gestureSourceType: touch ? "touch" : "mouse", speed, preventFling: true });
  const W = cfg.viewport.width, Hh = cfg.viewport.height;

  // (a) full-page scroll, ~60 steps, 50 ms apart
  await mark("scroll-start");
  const step = Math.ceil(totalScroll / 60);
  for (let i = 0; i < 60; i++) { await gesture(W / 2, Hh * 0.6, step); await sleep(50); }
  await sleep(400);
  await mark("scroll-end");

  // (b) carousel: back to the hero, drag two cards
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await sleep(700);
  const dc = await page.locator(".hv-dc").first().boundingBox();
  await mark("drag-start");
  if (dc) {
    for (let k = 0; k < 2; k++) {
      const cx = dc.x + dc.width / 2, cy = dc.y + dc.height / 2;
      if (touch) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: cx, y: cy }] });
        for (let i = 1; i <= 14; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: cx - i * 12, y: cy }] }); await sleep(16); }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      } else {
        await page.mouse.move(cx, cy); await page.mouse.down();
        for (let i = 1; i <= 14; i++) { await page.mouse.move(cx - i * 12, cy); await sleep(16); }
        await page.mouse.up();
      }
      await sleep(900);
    }
  }
  await mark("drag-end");

  // (c) FAQ folder: open and close
  await page.evaluate(() => { document.querySelector("#faq")?.scrollIntoView({ behavior: "instant", block: "start" }); scrollBy({ top: 200, behavior: "instant" }); });
  await sleep(600);
  const ff = await page.locator(".hv-ff").first().boundingBox();
  await mark("faq-start");
  let faqState = null;
  if (ff) {
    const tx = ff.x + ff.width / 2, ty = ff.y + ff.height - 24;
    if (touch) await page.tap(".hv-ff-trigger").catch(() => page.touchscreen.tap(tx, ty));
    else await page.mouse.move(tx, ty, { steps: 10 });
    await sleep(2500);
    faqState = await page.evaluate(() => { const f = document.querySelector(".hv-ff"); return f ? { open: f.hasAttribute("data-open"), live: f.hasAttribute("data-live") } : null; });
    if (touch) await page.tap(".hv-ff-trigger").catch(() => page.touchscreen.tap(tx, ty));
    else await page.mouse.move(W / 2, 20, { steps: 10 });
    await sleep(1200);
  }
  await mark("faq-end");

  // (d) pointer across the glow cards and the hero wordmark (fine pointer only)
  await mark("hover-start");
  if (!touch) {
    await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "instant", block: "center" }));
    await sleep(600);
    const cards = await page.locator(".hv-bgl").all();
    for (const c of cards.slice(0, 3)) { const b = await c.boundingBox(); if (!b) continue; for (let i = 0; i <= 10; i++) { await page.mouse.move(b.x + (b.width * i) / 10, b.y + b.height / 2); await sleep(30); } }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await sleep(600);
    const h1 = await page.locator("h1").first().boundingBox();
    if (h1) for (let i = 0; i <= 30; i++) { await page.mouse.move(h1.x + (h1.width * i) / 30, h1.y + h1.height * (0.3 + 0.4 * Math.sin(i / 3))); await sleep(33); }
    await sleep(1200);
  }
  await mark("hover-end");

  // ---- stop + collect ----
  const { profile } = await cdp.send("Profiler.stop");
  await cdp.send("Tracing.end");
  await traceDone;
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  const obs = await page.evaluate(() => ({ loaf: window.__loaf, lt: window.__lt }));
  const perfMarks = await page.evaluate(() => Object.fromEntries(performance.getEntriesByType("mark").map((m) => [m.name, m.startTime])));

  // layers: the largest snapshot, with reasons for page-sized layers
  let layers = null;
  if (layerSnapshots.length) {
    const biggest = layerSnapshots.reduce((a, b) => (b.length > a.length ? b : a));
    const pageSized = biggest.filter((l) => l.width * l.height >= cfg.viewport.width * cfg.viewport.height * 0.9);
    const named = [];
    for (const l of pageSized.slice(0, 8)) {
      let node = "-";
      if (l.backendNodeId) { try { const { node: n } = await cdp.send("DOM.describeNode", { backendNodeId: l.backendNodeId }); const a = {}; for (let i = 0; i < (n.attributes || []).length; i += 2) a[n.attributes[i]] = n.attributes[i + 1]; node = `${n.localName || n.nodeName}${a.id ? "#" + a.id : ""}${a.class ? "." + a.class.trim().split(/\s+/).slice(0, 3).join(".") : ""}`; } catch {} }
      let reasons = []; try { ({ compositingReasons: reasons } = await cdp.send("LayerTree.compositingReasons", { layerId: l.layerId })); } catch {}
      named.push({ node, size: `${Math.round(l.width)}×${Math.round(l.height)}`, reasons: reasons.slice(0, 4) });
    }
    layers = { max: biggest.length, snapshots: layerSnapshots.length, pageSized: pageSized.length, pageSizedLayers: named };
  }

  writeFileSync(path.join(OUT, `${vpName}.trace.json`), JSON.stringify({ traceEvents }));
  writeFileSync(path.join(OUT, `${vpName}.profile.json`), JSON.stringify(profile));
  writeFileSync(path.join(OUT, `${vpName}.meta.json`), JSON.stringify({ obs, perfMarks, layers, errors, faqState }));
  const r = analyze({ traceEvents, profile, obs, perfMarks, layers, errors, faqState, cfg, vpName });
  summary[vpName] = r;
  writeFileSync(path.join(OUT, `${vpName}.json`), JSON.stringify(r, null, 1));
  print(r, cfg);
  await ctx.close();
}
await browser.close();
writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 1));
console.log(`\nwritten: ${OUT}/{desktop,mobile}.json, *.trace.json, *.profile.json, summary.json`);
