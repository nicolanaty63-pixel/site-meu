import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/home-slider");
mkdirSync(OUT, { recursive: true });

const URL = "https://nicollacontractors.co.uk/?v=" + Date.now();
const viewports = [
  { name: "mobile", width: 375, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const vp of viewports) {
    const isTouch = vp.name !== "desktop";
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: isTouch,
      hasTouch: isTouch,
      userAgent: isTouch
        ? vp.name === "mobile"
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
          : "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
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

    // Find the slider by its aria-label.
    const range = page.getByLabel("Drag to compare before and after");
    await range.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Wait for BOTH images inside the slider to fully load.
    const sliderRoot = range.locator("xpath=ancestor::div[contains(@class,'aspect-')]").first();
    const imgs = sliderRoot.locator("img");
    const count = await imgs.count();
    console.log(`[${vp.name}] slider img count=${count}`);
    for (let i = 0; i < count; i++) {
      const el = await imgs.nth(i).elementHandle();
      await page.waitForFunction(
        (e) => e && e.complete && e.naturalWidth > 0,
        el,
        { timeout: 30000 },
      );
    }
    await page.waitForTimeout(400);

    const info = await sliderRoot.evaluate((root) => {
      const allImgs = Array.from(root.querySelectorAll("img"));
      return allImgs.map((img) => ({
        src: (img.currentSrc || img.src).slice(0, 120),
        natW: img.naturalWidth,
        cliW: img.clientWidth,
        cliH: img.clientHeight,
        complete: img.complete,
      }));
    });
    console.log(`[${vp.name}] slider images:`, JSON.stringify(info, null, 2));

    const box = await sliderRoot.boundingBox();
    console.log(`[${vp.name}] slider box:`, box);
    if (box) {
      console.log(
        `[${vp.name}] slider aspect: ${(box.width / box.height).toFixed(3)} (target 1.333)`,
      );
    }

    // Capture five states across the drag range: 0/25/50/75/100.
    // React patches the native HTMLInputElement.value setter — going through
    // it directly is the only way to make React see a programmatic change.
    for (const pos of [0, 25, 50, 75, 100]) {
      await range.evaluate((el, v) => {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        ).set;
        setter.call(el, String(v));
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }, pos);
      await page.waitForTimeout(400);
      if (box) {
        await page.screenshot({
          path: resolve(OUT, `${vp.name}-pos${pos}.png`),
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
    console.log(`[${vp.name}] overflow: scrollWidth=${scrollW} innerWidth=${innerW}`);

    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log("done — output in verify-out/home-slider/");
