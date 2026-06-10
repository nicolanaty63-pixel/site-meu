import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/polish");
mkdirSync(OUT, { recursive: true });

const BASE = process.env.AUDIT_BASE || "https://nicollacontractors.co.uk";

const routes = [
  { slug: "home", path: "/" },
  { slug: "about", path: "/about" },
  { slug: "services", path: "/services" },
  { slug: "projects", path: "/projects" },
  { slug: "testimonials", path: "/testimonials" },
  { slug: "contact", path: "/contact" },
  { slug: "free-quote", path: "/free-quote" },
  { slug: "service-laminate", path: "/services/laminate-flooring" },
  { slug: "service-bathroom", path: "/services/bathroom-renovations" },
  { slug: "service-kitchen", path: "/services/kitchen-renovations" },
  { slug: "area-watford", path: "/areas/watford" },
  { slug: "area-kings-langley", path: "/areas/kings-langley" },
  { slug: "privacy", path: "/privacy-policy" },
  { slug: "terms", path: "/terms" },
  { slug: "cookie", path: "/cookie-policy" },
  { slug: "gdpr", path: "/gdpr" },
];

const viewports = [
  { name: "mobile", width: 375, height: 812, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const findings = []; // collected across all (route, viewport) pairs

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      userAgent: vp.isMobile
        ? vp.name === "mobile"
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
          : "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    });

    for (const route of routes) {
      const page = await ctx.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const requestFailures = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
      });
      page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 300)));
      page.on("requestfailed", (r) => {
        if (!r.url().includes("favicon")) {
          requestFailures.push(`${r.failure()?.errorText || "?"} ${r.url().slice(0, 160)}`);
        }
      });

      const url = `${BASE}${route.path}?v=${Date.now()}`;
      const key = `${vp.name}/${route.slug}`;
      console.log(`[${key}] goto ${route.path}`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      } catch (e) {
        console.log(`[${key}] goto failed: ${e.message.slice(0, 100)}`);
        findings.push({ key, type: "goto-failed", detail: e.message.slice(0, 200) });
        await page.close();
        continue;
      }

      // Dismiss cookie banner (uniform behaviour).
      for (const text of ["Reject all", "Accept all"]) {
        const btn = page.getByRole("button", { name: text }).first();
        if (await btn.isVisible().catch(() => false)) {
          await btn.click().catch(() => {});
          break;
        }
      }
      await page.waitForTimeout(500);

      // === Probes ===
      const probe = await page.evaluate((vw) => {
        const out = {};
        out.scrollWidth = document.documentElement.scrollWidth;
        out.innerWidth = window.innerWidth;
        out.scrollHeight = document.documentElement.scrollHeight;

        // Find every element that pokes past the viewport edge.
        const overflowers = [];
        document.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 0 && r.height > 0) {
            // Skip well-known offscreen patterns: visually-hidden, fixed offscreen.
            const cs = getComputedStyle(el);
            if (cs.position === "fixed") return;
            if (cs.visibility === "hidden" || cs.display === "none") return;
            const tag = el.tagName.toLowerCase();
            const cls = el.className?.toString().slice(0, 60) || "";
            overflowers.push({
              tag,
              cls,
              right: Math.round(r.right),
              width: Math.round(r.width),
            });
          }
        });
        out.overflowers = overflowers.slice(0, 10);

        // Tap-target audit on links + buttons (44px is the Apple/Material min).
        const tapIssues = [];
        document.querySelectorAll("a, button, [role='button']").forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.height < 32 || r.width < 32) {
            tapIssues.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || "").trim().slice(0, 30),
              w: Math.round(r.width),
              h: Math.round(r.height),
            });
          }
        });
        out.tapIssues = tapIssues.slice(0, 8);

        // Inputs with font-size < 16px trigger iOS auto-zoom on focus.
        const smallInputs = [];
        document.querySelectorAll("input, select, textarea").forEach((el) => {
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs < 16 && el.type !== "hidden" && el.type !== "range") {
            smallInputs.push({
              tag: el.tagName.toLowerCase(),
              type: el.type,
              fs,
              name: el.name || el.id,
            });
          }
        });
        out.smallInputs = smallInputs.slice(0, 8);

        // Broken images
        const brokenImgs = [];
        document.querySelectorAll("img").forEach((img) => {
          if (img.complete && img.naturalWidth === 0) {
            brokenImgs.push({ src: img.src.slice(0, 160), alt: img.alt });
          }
        });
        out.brokenImgs = brokenImgs.slice(0, 5);

        return out;
      }, vp.width);

      // Take full-page screenshot (capped reasonable height).
      const ssPath = resolve(OUT, `${vp.name}-${route.slug}.png`);
      try {
        await page.screenshot({ path: ssPath, fullPage: true, animations: "disabled" });
      } catch (e) {
        // very tall pages may fail; fall back to viewport
        await page.screenshot({ path: ssPath, fullPage: false });
      }

      findings.push({
        key,
        path: route.path,
        scrollWidth: probe.scrollWidth,
        innerWidth: probe.innerWidth,
        scrollHeight: probe.scrollHeight,
        horizontalOverflow: probe.scrollWidth > probe.innerWidth,
        overflowers: probe.overflowers,
        tapIssues: probe.tapIssues,
        smallInputs: probe.smallInputs,
        brokenImgs: probe.brokenImgs,
        consoleErrors,
        pageErrors,
        requestFailures,
      });

      await page.close();
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

writeFileSync(
  resolve(OUT, "report.json"),
  JSON.stringify(findings, null, 2),
);

// Concise console summary
const issues = findings.filter(
  (f) =>
    f.horizontalOverflow ||
    f.overflowers.length ||
    f.tapIssues.length ||
    f.smallInputs.length ||
    f.brokenImgs.length ||
    f.consoleErrors.length ||
    f.pageErrors.length ||
    f.requestFailures.length,
);
console.log(`\n=== Summary: ${issues.length}/${findings.length} pages with issues ===`);
for (const f of issues) {
  const tags = [];
  if (f.horizontalOverflow) tags.push(`OVERFLOW(${f.scrollWidth}>${f.innerWidth})`);
  if (f.overflowers.length) tags.push(`overflowers=${f.overflowers.length}`);
  if (f.tapIssues.length) tags.push(`tap=${f.tapIssues.length}`);
  if (f.smallInputs.length) tags.push(`small-input=${f.smallInputs.length}`);
  if (f.brokenImgs.length) tags.push(`broken-img=${f.brokenImgs.length}`);
  if (f.consoleErrors.length) tags.push(`console=${f.consoleErrors.length}`);
  if (f.pageErrors.length) tags.push(`page-err=${f.pageErrors.length}`);
  if (f.requestFailures.length) tags.push(`req-fail=${f.requestFailures.length}`);
  console.log(`  ${f.key} — ${tags.join(" ")}`);
}
console.log(`\nFull report: verify-out/polish/report.json`);
