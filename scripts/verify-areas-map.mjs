import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/areas-map");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3000";

const viewports = [
  { name: "mobile", w: 390, h: 844, isMobile: true },
  { name: "tablet", w: 768, h: 1024, isMobile: true },
  { name: "desktop", w: 1440, h: 900, isMobile: false },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
let failed = false;
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    await page.goto(`${BASE}/areas`, { waitUntil: "networkidle", timeout: 45000 });
    for (const text of ["Reject all", "Accept all"]) {
      const b = page.getByRole("button", { name: text }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
    }

    // Scroll the map into view and let entrance animations finish
    await page.evaluate(() => {
      const svg = document.querySelector("section svg");
      svg?.scrollIntoView({ block: "center", behavior: "instant" });
    });
    await page.waitForTimeout(2800);

    const checks = await page.evaluate(() => {
      const areaLinks = [...document.querySelectorAll('a[href^="/areas/"]')].filter(
        (a) => !a.closest("footer") && !a.closest("nav")
      );
      const slugs = new Set(areaLinks.map((a) => a.getAttribute("href")));
      const svg = document.querySelector("section svg");
      const lines = svg ? svg.querySelectorAll("line").length : 0;
      const circles = svg ? svg.querySelectorAll("circle").length : 0;
      // marker visibility: opacity should have animated to 1
      const marker = areaLinks.find((a) => a.getAttribute("aria-label")?.startsWith("Renovations in"));
      const markerSpan = marker?.querySelector("span");
      const markerOpacity = markerSpan ? parseFloat(getComputedStyle(markerSpan).opacity) : 0;
      // no horizontal overflow
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      return {
        uniqueAreaHrefs: slugs.size,
        markerLinkCount: areaLinks.filter((a) => a.getAttribute("aria-label")?.startsWith("Renovations in")).length,
        listLinkCount: areaLinks.length,
        svgPresent: !!svg,
        lines,
        circles,
        markerOpacity,
        horizOverflowPx: overflow,
        oldGridGone: !document.body.innerText.includes("As our home town, Kings Langley is where it all started"),
      };
    });

    const ok =
      checks.svgPresent &&
      checks.uniqueAreaHrefs === 10 &&
      checks.markerLinkCount === 10 &&
      checks.lines >= 15 &&
      checks.markerOpacity > 0.95 &&
      checks.horizOverflowPx <= 0 &&
      checks.oldGridGone &&
      consoleErrors.length === 0;
    if (!ok) failed = true;
    console.log(
      `[${vp.name}] svg:${checks.svgPresent} hrefs:${checks.uniqueAreaHrefs}/10 markers:${checks.markerLinkCount} lines:${checks.lines} markerOpacity:${checks.markerOpacity} overflow:${checks.horizOverflowPx}px oldGridGone:${checks.oldGridGone} consoleErrors:${consoleErrors.length} ${ok ? "PASS" : "FAIL"}`
    );
    if (consoleErrors.length) console.log(`  errors: ${consoleErrors.slice(0, 3).join(" | ")}`);

    await page.screenshot({ path: `${OUT}/areas-${vp.name}.png` });
    await page.screenshot({ path: `${OUT}/areas-${vp.name}-full.png`, fullPage: true });

    // Desktop: hover a marker and capture the tooltip
    if (!vp.isMobile) {
      const watford = page.locator('a[aria-label="Renovations in Watford"]');
      await watford.hover();
      await page.waitForTimeout(500);
      const tipVisible = await page.evaluate(() => {
        const a = document.querySelector('a[aria-label="Renovations in Watford"]');
        const tip = a?.querySelector("span[data-tip]");
        if (!tip) return false;
        const s = getComputedStyle(tip);
        return parseFloat(s.opacity) > 0.9 && tip.textContent.includes("Premium bathroom");
      });
      console.log(`[desktop] hover tooltip visible with blurb: ${tipVisible}`);
      if (!tipVisible) failed = true;
      await page.screenshot({ path: `${OUT}/areas-desktop-hover.png` });

      // Hovering a list row highlights its marker (cross-highlight)
      const row = page.locator('ul a[href="/areas/st-albans"]');
      await row.hover();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/areas-desktop-listhover.png` });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
process.exit(failed ? 1 : 0);
