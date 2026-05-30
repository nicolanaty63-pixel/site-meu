import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/scroll");
mkdirSync(OUT, { recursive: true });

const BASE = process.env.SCROLL_BASE || "https://nicollacontractors.co.uk";
const ROUTES = (
  process.env.SCROLL_ROUTES ||
  "/,/services,/projects,/free-quote,/areas/watford,/guides/bathroom-renovation-cost-uk"
).split(",");

const PROFILES = [
  // Mid-range mobile with 4x CPU throttle is a reasonable lower-bound proxy
  // for "low-end Android". Most premium contractor-site visitors are on
  // mid-range devices, not flagships.
  { name: "mobile-throttled", w: 375, h: 812, isMobile: true, cpu: 4 },
  // Tablet with 2x throttle — iPads / mid-range Android tablets.
  { name: "tablet-throttled", w: 768, h: 1024, isMobile: true, cpu: 2 },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];

try {
  for (const profile of PROFILES) {
    const ctx = await browser.newContext({
      viewport: { width: profile.w, height: profile.h },
      deviceScaleFactor: 2,
      isMobile: profile.isMobile,
      hasTouch: true,
      userAgent: profile.isMobile
        ? profile.name.startsWith("mobile")
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
          : "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    });

    for (const route of ROUTES) {
      const page = await ctx.newPage();

      // Throttle CPU via CDP so the measurement reflects real-world conditions.
      const client = await ctx.newCDPSession(page);
      await client.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });

      // Capture longtasks AND raf frame deltas. Long tasks alone don't catch
      // compositor/paint jank (backdrop-blur on sticky navbar etc) — rAF
      // deltas do, because frames get pushed past 16.7ms when the GPU can't
      // composite in time.
      await page.addInitScript(() => {
        window.__scroll = {
          longTasks: [],
          totalLongTaskMs: 0,
          frames: [],
          slowFrames: 0,
          jankFrames: 0,
          rafRunning: false,
          scrollStart: null,
          scrollEnd: null,
        };
        try {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (
                window.__scroll.scrollStart != null &&
                e.startTime >= window.__scroll.scrollStart &&
                (window.__scroll.scrollEnd == null ||
                  e.startTime <= window.__scroll.scrollEnd)
              ) {
                window.__scroll.longTasks.push(Math.round(e.duration));
                window.__scroll.totalLongTaskMs += Math.round(e.duration);
              }
            }
          }).observe({ type: "longtask", buffered: true });
        } catch {}
        // Start an rAF loop that records deltas. The page is asked to
        // toggle scroll measurement on/off via the controller below.
        let last = performance.now();
        function tick(t) {
          if (window.__scroll.rafRunning) {
            const dt = t - last;
            window.__scroll.frames.push(Math.round(dt));
            // 16.7ms ideal; >32ms = visibly slow (skipped frame); >50ms = clear jank
            if (dt > 50) window.__scroll.jankFrames++;
            else if (dt > 32) window.__scroll.slowFrames++;
          }
          last = t;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });

      await page.goto(`${BASE}${route}?v=${Date.now()}`, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      // Dismiss cookie banner
      for (const text of ["Reject all", "Accept all"]) {
        const b = page.getByRole("button", { name: text }).first();
        if (await b.isVisible().catch(() => false)) {
          await b.click().catch(() => {});
          break;
        }
      }
      await page.waitForTimeout(400);

      // Programmatic incremental scroll — closer to real swipe-and-stop pattern
      // than instant teleport. Returns total ms spent.
      const scrollMs = await page.evaluate(async () => {
        const totalH = document.documentElement.scrollHeight;
        const vp = window.innerHeight;
        const target = Math.max(0, totalH - vp);
        const step = Math.max(80, Math.round(vp * 0.18));
        window.__scroll.scrollStart = performance.now();
        window.__scroll.frames = [];
        window.__scroll.slowFrames = 0;
        window.__scroll.jankFrames = 0;
        window.__scroll.rafRunning = true;
        const start = performance.now();
        let y = 0;
        while (y < target) {
          y += step;
          window.scrollTo({ top: y, behavior: "auto" });
          await new Promise((r) => setTimeout(r, 30));
        }
        await new Promise((r) => setTimeout(r, 250));
        window.__scroll.rafRunning = false;
        window.__scroll.scrollEnd = performance.now();
        return Math.round(performance.now() - start);
      });

      const data = await page.evaluate(() => window.__scroll);

      const totalFrames = data.frames.length;
      const sumFrameMs = data.frames.reduce((a, b) => a + b, 0);
      const avgFrameMs = totalFrames > 0 ? sumFrameMs / totalFrames : 0;
      const maxFrameMs = data.frames.reduce((m, v) => Math.max(m, v), 0);
      results.push({
        profile: profile.name,
        route,
        scrollMs,
        totalFrames,
        avgFrameMs: Math.round(avgFrameMs * 10) / 10,
        maxFrameMs,
        slowFrames: data.slowFrames, // 32-50ms (skipped 1 frame)
        jankFrames: data.jankFrames, // >50ms (visible jank)
        slowPct:
          totalFrames > 0
            ? Math.round((data.slowFrames / totalFrames) * 100)
            : 0,
        jankPct:
          totalFrames > 0
            ? Math.round((data.jankFrames / totalFrames) * 100)
            : 0,
        longTaskCount: data.longTasks.length,
        totalLongTaskMs: data.totalLongTaskMs,
      });

      await page.close();
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

writeFileSync(resolve(OUT, "report.json"), JSON.stringify(results, null, 2));

console.log("\n=== Scroll smoothness — rAF frame timings during scroll ===");
console.log("16.7ms = ideal (60fps); >32ms = skipped frame; >50ms = visible jank");
console.log("(target: <5% slowFrames, <1% jankFrames)\n");
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
console.log(
  pad("profile/route", 50) +
    rpad("frames", 8) +
    rpad("avgFr", 7) +
    rpad("maxFr", 7) +
    rpad("slow", 6) +
    rpad("jank", 6) +
    rpad("slow%", 7) +
    rpad("jank%", 7),
);
console.log("-".repeat(96));
for (const r of results) {
  console.log(
    pad(`${r.profile}${r.route}`, 50) +
      rpad(r.totalFrames, 8) +
      rpad(r.avgFrameMs, 7) +
      rpad(r.maxFrameMs, 7) +
      rpad(r.slowFrames, 6) +
      rpad(r.jankFrames, 6) +
      rpad(r.slowPct + "%", 7) +
      rpad(r.jankPct + "%", 7),
  );
}
console.log(`\nReport: verify-out/scroll/report.json`);
