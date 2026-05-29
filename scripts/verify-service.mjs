import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Usage: node scripts/verify-service.mjs <service-slug>
const slug = process.argv[2];
if (!slug) {
  console.error("usage: verify-service.mjs <service-slug>");
  process.exit(2);
}

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), `../verify-out/service-${slug}`);
mkdirSync(OUT, { recursive: true });

const URL = "https://nicollacontractors.co.uk/services?v=" + Date.now();
const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        vp.name === "mobile"
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
          : "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    });
    const page = await ctx.newPage();

    console.log(`[${vp.name}] goto`);
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });

    for (const text of ["Reject all", "Accept all"]) {
      const btn = page.getByRole("button", { name: text }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(400);

    const section = page.locator(`#${slug}`);
    await section.waitFor({ state: "visible", timeout: 15000 });
    await section.scrollIntoViewIfNeeded();

    // Wait for the lazy-loaded next/image to actually finish downloading.
    const img = section.locator("img").first();
    await img.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(
      (el) => el && el.complete && el.naturalWidth > 0,
      await img.elementHandle(),
      { timeout: 30000 },
    );
    await page.waitForTimeout(400); // settle reveal motion

    const box = await section.boundingBox();
    const imgInfo = await img.evaluate((el) => ({
      currentSrc: el.currentSrc || el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      clientWidth: el.clientWidth,
      clientHeight: el.clientHeight,
      complete: el.complete,
      dpr: window.devicePixelRatio,
    }));
    console.log(`[${vp.name}] section box:`, box);
    console.log(`[${vp.name}] img:`, imgInfo);
    console.log(
      `[${vp.name}] frame aspect: ${(imgInfo.clientWidth / imgInfo.clientHeight).toFixed(3)} (target 1.333 = 4:3)`,
    );

    if (box) {
      await page.screenshot({
        path: resolve(OUT, `${vp.name}-section.png`),
        clip: {
          x: Math.max(0, box.x - 8),
          y: Math.max(0, box.y - 8),
          width: Math.min(vp.width, box.width + 16),
          height: box.height + 16,
        },
      });
    }
    await page.screenshot({
      path: resolve(OUT, `${vp.name}-services-full.png`),
      fullPage: true,
    });

    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerW = await page.evaluate(() => window.innerWidth);
    console.log(`[${vp.name}] overflow: scrollWidth=${scrollW} innerWidth=${innerW}`);

    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`done — output in verify-out/service-${slug}/`);
