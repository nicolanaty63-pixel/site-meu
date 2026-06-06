import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Verify the Landscaping service tile across breakpoints.
// Usage: node scripts/verify-landscaping.mjs [baseUrl]
const BASE = process.argv[2] || "http://localhost:3000";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/landscaping");
mkdirSync(OUT, { recursive: true });

const SLUG = "landscaping";
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
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
    for (const text of ["Reject all", "Accept all"]) {
      const btn = page.getByRole("button", { name: text }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(300);

    const section = page.locator(`#${SLUG}`);
    await section.waitFor({ state: "visible", timeout: 15000 });
    await section.scrollIntoViewIfNeeded();
    const img = section.locator("img").first();
    await img.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(
      (el) => el && el.complete && el.naturalWidth > 0,
      await img.elementHandle(),
      { timeout: 30000 },
    );
    await page.waitForTimeout(350);

    const info = await img.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        currentSrc: el.currentSrc || el.src,
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        objectFit: cs.objectFit,
      };
    });
    const frameAspect = info.clientWidth / info.clientHeight;
    const natAspect = info.naturalWidth / info.naturalHeight;
    const okFrame = Math.abs(frameAspect - 4 / 3) < 0.02;
    const okSrc = /landscaping-garden-nicolla/.test(decodeURIComponent(info.currentSrc));
    const okNoStretch = Math.abs(natAspect - 4 / 3) < 0.02 && info.objectFit === "cover";
    if (!okFrame) problems++;
    if (!okSrc) problems++;
    if (!okNoStretch) problems++;
    console.log(
      `[${vp.name}] #${SLUG}: frame=${frameAspect.toFixed(3)}${okFrame ? " ok(4:3)" : " !!"}` +
        ` natural=${info.naturalWidth}x${info.naturalHeight}(${natAspect.toFixed(3)}) fit=${info.objectFit}` +
        ` src=${okSrc ? "ok" : "WRONG"}`,
    );

    const box = await section.boundingBox();
    if (box) {
      await page.screenshot({
        path: resolve(OUT, `card-${vp.name}.png`),
        clip: {
          x: Math.max(0, box.x - 8),
          y: Math.max(0, box.y - 8),
          width: Math.min(vp.width, box.width + 16),
          height: box.height + 16,
        },
      });
    }
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerW = await page.evaluate(() => window.innerWidth);
    const overflow = scrollW > innerW + 1;
    if (overflow) problems++;
    console.log(`[${vp.name}] overflow: ${scrollW}/${innerW}${overflow ? " !! OVERFLOW" : " ok"}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\n${problems === 0 ? "PASS" : problems + " PROBLEM(S)"} — screenshots in verify-out/landscaping/`);
process.exit(problems === 0 ? 0 : 1);
