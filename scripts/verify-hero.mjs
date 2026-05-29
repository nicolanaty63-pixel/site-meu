import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/hero-label");
mkdirSync(OUT, { recursive: true });

const URL = "https://nicollacontractors.co.uk/?v=" + Date.now();
const viewports = [
  { name: "mobile", width: 375, height: 812 },
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

    // Find the Kitchen & dining label by its text.
    const label = page.getByText(/^Kitchen\s*&\s*dining$/i).first();
    await label.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const labelBox = await label.boundingBox();
    console.log(`[${vp.name}] label box:`, labelBox);

    // The stat card is hidden < lg.
    const stat = page.getByText(/Homeowners/).first();
    const statVisible = await stat.isVisible().catch(() => false);
    const statBox = statVisible ? await stat.boundingBox() : null;
    console.log(`[${vp.name}] stat visible=${statVisible} box:`, statBox);

    if (labelBox && statBox) {
      const overlap = !(
        labelBox.x + labelBox.width <= statBox.x ||
        statBox.x + statBox.width <= labelBox.x ||
        labelBox.y + labelBox.height <= statBox.y ||
        statBox.y + statBox.height <= labelBox.y
      );
      console.log(`[${vp.name}] LABEL/STAT OVERLAP = ${overlap}`);
    }

    // Screenshot the hero region (top of page).
    await page.screenshot({
      path: resolve(OUT, `${vp.name}-hero.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(vp.height, 1200) },
      fullPage: false,
    });

    // Tight crop around the kitchen tile (where the label lives).
    const kitchenTile = label.locator(
      "xpath=ancestor::div[contains(@class,'rounded-3xl')][1]",
    );
    const ktBox = await kitchenTile.boundingBox();
    if (ktBox) {
      await page.screenshot({
        path: resolve(OUT, `${vp.name}-kitchen-tile.png`),
        clip: {
          x: Math.max(0, ktBox.x - 12),
          y: Math.max(0, ktBox.y - 12),
          width: Math.min(vp.width, ktBox.width + 24),
          // Add headroom below the tile so the overhanging stat card (if any)
          // is captured in the same frame.
          height: ktBox.height + 60,
        },
      });
    }

    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log("done");
