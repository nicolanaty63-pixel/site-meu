import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/perf");
mkdirSync(OUT, { recursive: true });
const BASE = "https://nicollacontractors.co.uk";

const routes = [
  "/",
  "/services",
  "/services/bathroom-renovations",
  "/projects",
  "/areas/watford",
  "/contact",
  // New phase-3 routes
  "/guides",
  "/guides/bathroom-renovation-cost-uk",
  "/guides/home-refurbishment-cost-uk",
];
const viewports = [
  { name: "mobile", w: 375, h: 812, isMobile: true },
  { name: "desktop", w: 1440, h: 900, isMobile: false },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];

try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      userAgent: vp.isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    });

    for (const path of routes) {
      const page = await ctx.newPage();
      const resourceList = [];
      const consoleErrors = [];

      page.on("response", async (r) => {
        try {
          const sz = Number(r.headers()["content-length"] || 0) || 0;
          const ct = r.headers()["content-type"] || "";
          resourceList.push({ url: r.url(), status: r.status(), ct, sz });
        } catch {}
      });
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
      });

      // Inject web-vitals-style observers BEFORE goto so we catch everything.
      await page.addInitScript(() => {
        window.__webVitals = {
          lcp: null,
          cls: 0,
          fcp: null,
          ttfb: null,
          longTasks: [],
          maxLongTaskMs: 0,
          totalBlockingMs: 0,
        };
        try {
          const nav = performance.getEntriesByType("navigation")[0];
          if (nav) window.__webVitals.ttfb = nav.responseStart - nav.requestStart;
        } catch {}
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            window.__webVitals.lcp = {
              value: last.renderTime || last.loadTime || last.startTime,
              tag: last.element?.tagName?.toLowerCase(),
              src: last.url || last.element?.currentSrc || last.element?.src,
              size: Math.round(last.size || 0),
            };
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch {}
        try {
          let cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) cls += entry.value;
            }
            window.__webVitals.cls = cls;
          }).observe({ type: "layout-shift", buffered: true });
        } catch {}
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
              if (entry.name === "first-contentful-paint") {
                window.__webVitals.fcp = entry.startTime;
              }
            }
          }).observe({ type: "paint", buffered: true });
        } catch {}
        // Long tasks (>50ms) — TBT proxy + INP candidates
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const dur = entry.duration;
              window.__webVitals.longTasks.push(Math.round(dur));
              if (dur > window.__webVitals.maxLongTaskMs) {
                window.__webVitals.maxLongTaskMs = Math.round(dur);
              }
              // Total blocking time approximation: portion of long tasks >50ms
              if (dur > 50) {
                window.__webVitals.totalBlockingMs += Math.round(dur - 50);
              }
            }
          }).observe({ type: "longtask", buffered: true });
        } catch {}
      });

      const url = `${BASE}${path}?v=${Date.now()}`;
      const key = `${vp.name}${path}`;
      console.log(`[${key}] loading`);

      const startNav = Date.now();
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
      // Scroll to settle CLS for any below-fold layout shift
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        await new Promise((r) => {
          let y = 0;
          const id = setInterval(() => {
            y += 600;
            window.scrollTo(0, y);
            if (y >= h) {
              clearInterval(id);
              setTimeout(r, 300);
            }
          }, 100);
        });
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1200);

      // INP-style probe: time a click on the most expensive interactive
      // element on the page (FAQ accordion if present, otherwise nav button).
      let inpProxy = null;
      try {
        const faqButton = page.locator("button[aria-expanded]").first();
        if (await faqButton.isVisible().catch(() => false)) {
          const before = await page.evaluate(() => performance.now());
          await faqButton.click({ timeout: 5000 });
          await page.waitForTimeout(50);
          const after = await page.evaluate(() => performance.now());
          inpProxy = Math.round(after - before);
        }
      } catch {}

      const vitals = await page.evaluate(() => window.__webVitals);
      vitals.inpProxy = inpProxy;
      const loadMs = Date.now() - startNav;

      // Find oversized images (natural pixel size much greater than rendered size)
      const imgIssues = await page.evaluate(() => {
        const issues = [];
        document.querySelectorAll("img").forEach((img) => {
          if (!img.complete) return;
          const cssW = img.clientWidth;
          const cssH = img.clientHeight;
          const nW = img.naturalWidth;
          const nH = img.naturalHeight;
          if (cssW === 0 || cssH === 0) return;
          const dpr = window.devicePixelRatio || 2;
          const overserveX = nW / (cssW * dpr);
          if (overserveX > 1.5) {
            issues.push({
              src: (img.currentSrc || img.src).slice(0, 120),
              alt: img.alt,
              cssW,
              cssH,
              natW: nW,
              natH: nH,
              overserveX: Math.round(overserveX * 100) / 100,
            });
          }
        });
        return issues.slice(0, 5);
      });

      // Find images missing alt
      const missingAlt = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("img"))
          .filter((img) => !img.alt && !img.getAttribute("aria-hidden"))
          .map((img) => (img.currentSrc || img.src).slice(0, 120))
          .slice(0, 5);
      });

      // Total resource weight by type
      const summary = {};
      let totalKB = 0;
      for (const r of resourceList) {
        const cat = r.ct.startsWith("image/")
          ? "image"
          : r.ct.includes("javascript")
            ? "js"
            : r.ct.includes("css")
              ? "css"
              : r.ct.includes("font")
                ? "font"
                : r.ct.includes("html")
                  ? "html"
                  : "other";
        summary[cat] = (summary[cat] || 0) + r.sz;
        totalKB += r.sz;
      }
      const formatted = Object.fromEntries(
        Object.entries(summary).map(([k, v]) => [k, Math.round(v / 1024)]),
      );

      results.push({
        key,
        path,
        viewport: vp.name,
        loadMs,
        lcp: vitals.lcp,
        cls: Math.round((vitals.cls || 0) * 1000) / 1000,
        fcp: vitals.fcp ? Math.round(vitals.fcp) : null,
        ttfb: vitals.ttfb ? Math.round(vitals.ttfb) : null,
        longTaskCount: vitals.longTasks.length,
        maxLongTaskMs: vitals.maxLongTaskMs,
        totalBlockingMs: vitals.totalBlockingMs,
        inpProxyMs: vitals.inpProxy,
        weightKB: Math.round(totalKB / 1024),
        weightByType: formatted,
        imgOverserved: imgIssues,
        missingAlt,
        consoleErrors,
      });

      console.log(
        `[${key}] LCP=${vitals.lcp?.value ? Math.round(vitals.lcp.value) : "?"}ms CLS=${vitals.cls.toFixed(3)} FCP=${vitals.fcp ? Math.round(vitals.fcp) : "?"}ms weight=${Math.round(totalKB / 1024)}KB`,
      );
      await page.close();
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

writeFileSync(resolve(OUT, "report.json"), JSON.stringify(results, null, 2));

// Summary
console.log("\n========= SUMMARY =========");
console.log("CWV thresholds: LCP good <2500ms, CLS good <0.1, FCP good <1800ms");
for (const r of results) {
  const lcpV = r.lcp?.value;
  const lcpFlag = lcpV == null ? "?" : lcpV < 2500 ? "✓" : lcpV < 4000 ? "⚠" : "✗";
  const clsFlag = r.cls < 0.1 ? "✓" : r.cls < 0.25 ? "⚠" : "✗";
  const fcpFlag = r.fcp == null ? "?" : r.fcp < 1800 ? "✓" : r.fcp < 3000 ? "⚠" : "✗";
  console.log(
    `${r.key.padEnd(40)} LCP=${(Math.round(lcpV || 0) + "ms").padStart(7)}${lcpFlag}  CLS=${r.cls.toFixed(3)}${clsFlag}  FCP=${(r.fcp + "ms").padStart(7)}${fcpFlag}  ${r.weightKB}KB total`,
  );
}

console.log("\n========= ISSUES =========");
for (const r of results) {
  if (r.imgOverserved.length || r.missingAlt.length || r.consoleErrors.length) {
    console.log(`\n${r.key}`);
    if (r.imgOverserved.length) {
      console.log("  Oversized images (natural >> rendered):");
      for (const i of r.imgOverserved)
        console.log(`    ${i.natW}x${i.natH} for ${i.cssW}x${i.cssH} (${i.overserveX}x):  ${i.src.slice(50)}`);
    }
    if (r.missingAlt.length) {
      console.log("  Images missing alt:");
      for (const u of r.missingAlt) console.log(`    ${u}`);
    }
    if (r.consoleErrors.length) {
      console.log("  Console errors:");
      for (const e of r.consoleErrors.slice(0, 3)) console.log(`    ${e.slice(0, 120)}`);
    }
  }
}
console.log(`\nReport: verify-out/perf/report.json`);
