import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Verify the two updated service tiles (loft + roofing) across breakpoints.
// Usage: node scripts/verify-service-images.mjs [baseUrl]
// Defaults to a local server; pass the production URL to verify the deploy.
const BASE = process.argv[2] || "http://localhost:3000";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/service-images");
mkdirSync(OUT, { recursive: true });

const SLUGS = ["loft-conversions", "roofing"];
const URL = `${BASE}/services?v=${Date.now()}`;
const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "mobile", width: 375, height: 667, mobile: true },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
let problems = 0;
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
    });
    const page = await ctx.newPage();
    console.log(`\n[${vp.name}] goto ${URL}`);
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });

    for (const text of ["Reject all", "Accept all"]) {
      const btn = page.getByRole("button", { name: text }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(300);

    for (const slug of SLUGS) {
      const section = page.locator(`#${slug}`);
      await section.waitFor({ state: "visible", timeout: 15000 });
      await section.scrollIntoViewIfNeeded();
      const img = section.locator("img").first();
      await img.waitFor({ state: "visible", timeout: 15000 });
      await page.waitForFunction(
        (el) => el && el.complete && el.naturalWidth > 0,
        await img.elementHandle(),
        { timeout: 30000 },
      );
      await page.waitForTimeout(350); // settle reveal motion

      const info = await img.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          currentSrc: el.currentSrc || el.src,
          naturalWidth: el.naturalWidth,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          objectFit: cs.objectFit,
          objectPosition: cs.objectPosition,
        };
      });
      const aspect = (info.clientWidth / info.clientHeight).toFixed(3);
      const okAspect = Math.abs(info.clientWidth / info.clientHeight - 4 / 3) < 0.02;
      const okSrc = /toa-heftiba|clement-proust/.test(decodeURIComponent(info.currentSrc));
      if (!okAspect) problems++;
      if (!okSrc) problems++;
      console.log(
        `[${vp.name}] #${slug}: aspect=${aspect}${okAspect ? " ok(4:3)" : " !! expected 1.333"}` +
          ` fit=${info.objectFit} pos=${info.objectPosition} src=${okSrc ? "ok" : "WRONG"}`,
      );

      const box = await section.boundingBox();
      if (box) {
        await page.screenshot({
          path: resolve(OUT, `${vp.name}-${slug}.png`),
          clip: {
            x: Math.max(0, box.x - 8),
            y: Math.max(0, box.y - 8),
            width: Math.min(vp.width, box.width + 16),
            height: box.height + 16,
          },
        });
      }
    }

    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerW = await page.evaluate(() => window.innerWidth);
    const overflow = scrollW > innerW + 1;
    if (overflow) problems++;
    console.log(`[${vp.name}] overflow: scrollWidth=${scrollW} innerWidth=${innerW}${overflow ? " !! HORIZONTAL OVERFLOW" : " ok"}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${problems === 0 ? "PASS" : problems + " PROBLEM(S)"} — screenshots in verify-out/service-images/`);
process.exit(problems === 0 ? 0 : 1);
