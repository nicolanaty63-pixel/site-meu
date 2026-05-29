import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Usage: node scripts/verify-project.mjs "<exact project title>" [category]
const title = process.argv[2];
const category = process.argv[3]; // optional filter chip name
if (!title) {
  console.error("usage: verify-project.mjs <title> [category]");
  process.exit(2);
}
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), `../verify-out/${slug}`);
mkdirSync(OUT, { recursive: true });

const URL = "https://nicollacontractors.co.uk/projects?v=" + Date.now();
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

    const card = page.locator(`button:has-text("${title}")`).first();
    await card.waitFor({ state: "visible", timeout: 15000 });
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    const cardBox = await card.boundingBox();
    const cardImg = card.locator("img").first();
    const cardImgInfo = await cardImg.evaluate((el) => ({
      currentSrc: el.currentSrc || el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      clientWidth: el.clientWidth,
      clientHeight: el.clientHeight,
      dpr: window.devicePixelRatio,
    }));
    console.log(`[${vp.name}] card box:`, cardBox);
    console.log(`[${vp.name}] card img:`, cardImgInfo);
    console.log(
      `[${vp.name}] card aspect: ${(cardImgInfo.clientWidth / cardImgInfo.clientHeight).toFixed(3)}`,
    );

    if (cardBox) {
      await page.screenshot({
        path: resolve(OUT, `${vp.name}-card.png`),
        clip: {
          x: Math.max(0, cardBox.x - 8),
          y: Math.max(0, cardBox.y - 8),
          width: Math.min(vp.width, cardBox.width + 16),
          height: cardBox.height + 16,
        },
      });
    }
    await page.screenshot({
      path: resolve(OUT, `${vp.name}-projects-full.png`),
      fullPage: true,
    });

    await card.click();
    await page.waitForTimeout(700);
    const modal = page.locator("div.glass-strong").first();
    await modal.waitFor({ state: "visible", timeout: 10000 });
    const modalImg = modal.locator("img").first();
    const modalImgInfo = await modalImg.evaluate((el) => ({
      currentSrc: el.currentSrc || el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      clientWidth: el.clientWidth,
      clientHeight: el.clientHeight,
    }));
    console.log(`[${vp.name}] modal img:`, modalImgInfo);
    console.log(
      `[${vp.name}] modal aspect: ${(modalImgInfo.clientWidth / modalImgInfo.clientHeight).toFixed(3)}`,
    );

    await page.screenshot({ path: resolve(OUT, `${vp.name}-modal.png`) });

    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);

    if (category) {
      const chip = page.getByRole("button", { name: new RegExp(`^${category}`) }).first();
      if (await chip.isVisible().catch(() => false)) {
        await chip.click();
        await page.waitForTimeout(700);
        const filteredCard = page.locator(`button:has-text("${title}")`).first();
        const visible = await filteredCard.isVisible().catch(() => false);
        console.log(`[${vp.name}] PROBE filter=${category} visible=${visible}`);
        await page.screenshot({ path: resolve(OUT, `${vp.name}-filter.png`), fullPage: true });
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
console.log(`done — output in verify-out/${slug}/`);
