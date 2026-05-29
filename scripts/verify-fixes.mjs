import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/qa-fixes");
mkdirSync(OUT, { recursive: true });
const BASE = "https://nicollacontractors.co.uk";

const browser = await chromium.launch({ channel: "msedge", headless: true });

async function newCtx(width, height, isMobile = true) {
  return browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile,
    hasTouch: isMobile,
    userAgent: isMobile
      ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
      : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  });
}

async function dismissBanner(page) {
  for (const text of ["Reject all", "Accept all"]) {
    const b = page.getByRole("button", { name: text }).first();
    if (await b.isVisible().catch(() => false)) {
      await b.click().catch(() => {});
      return;
    }
  }
}

try {
  // === A. Testimonial dots — hit area + type=button ===
  for (const [name, w, h] of [["mobile", 375, 812], ["tablet", 768, 1024]]) {
    const ctx = await newCtx(w, h);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/testimonials?v=${Date.now()}`, { waitUntil: "networkidle" });
    await dismissBanner(page);
    await page.waitForTimeout(500);
    const firstDot = page.getByLabel("Go to testimonial 2").first();
    await firstDot.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const dotInfo = await firstDot.evaluate((el) => ({
      type: el.getAttribute("type"),
      w: el.getBoundingClientRect().width,
      h: el.getBoundingClientRect().height,
    }));
    console.log(`[${name}] testimonial dot:`, dotInfo);

    // Screenshot the carousel controls
    const controls = firstDot.locator("xpath=ancestor::div[contains(@class,'mt-6')][1]");
    const box = await controls.boundingBox();
    if (box) {
      await page.screenshot({
        path: resolve(OUT, `${name}-testimonial-dots.png`),
        clip: { x: 0, y: Math.max(0, box.y - 8), width: w, height: box.height + 16 },
      });
    }
    await ctx.close();
  }

  // === B. Form input font-size ===
  for (const [name, w, h] of [["mobile", 375, 812]]) {
    const ctx = await newCtx(w, h);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/contact?v=${Date.now()}`, { waitUntil: "networkidle" });
    await dismissBanner(page);
    await page.waitForTimeout(500);

    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("input, select, textarea"))
        .filter((el) => el.type !== "hidden")
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          type: el.type,
          name: el.name || el.id,
          fs: parseFloat(getComputedStyle(el).fontSize),
        }));
    });
    console.log(`[${name}] /contact inputs font-size:`);
    for (const i of inputs) console.log(" ", JSON.stringify(i));

    // Screenshot contact form
    await page.locator("form").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const form = page.locator("form").first();
    const fbox = await form.boundingBox();
    if (fbox) {
      await page.screenshot({
        path: resolve(OUT, `${name}-contact-form.png`),
        clip: { x: 0, y: Math.max(0, fbox.y - 8), width: w, height: Math.min(1400, fbox.height + 16) },
      });
    }
    await ctx.close();
  }

  // === C. Legal pages tables ===
  for (const [name, w, h] of [["mobile", 375, 812], ["tablet", 768, 1024]]) {
    for (const slug of ["privacy-policy", "cookie-policy"]) {
      const ctx = await newCtx(w, h);
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${slug}?v=${Date.now()}`, { waitUntil: "networkidle" });
      await dismissBanner(page);
      await page.waitForTimeout(400);

      const tableInfo = await page.evaluate((vw) => {
        const t = document.querySelector(".legal table");
        if (!t) return null;
        t.scrollIntoView({ block: "center" });
        const r = t.getBoundingClientRect();
        return {
          width: Math.round(r.width),
          right: Math.round(r.right),
          parentRight: Math.round(t.parentElement.getBoundingClientRect().right),
          parentWidth: Math.round(t.parentElement.getBoundingClientRect().width),
          viewport: vw,
        };
      }, w);
      console.log(`[${name}] /${slug} table:`, tableInfo);

      const t = page.locator(".legal table").first();
      if (await t.isVisible().catch(() => false)) {
        await t.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const tbox = await t.boundingBox();
        if (tbox) {
          await page.screenshot({
            path: resolve(OUT, `${name}-${slug}-table.png`),
            clip: {
              x: 0,
              y: Math.max(0, tbox.y - 8),
              width: w,
              height: Math.min(700, tbox.height + 16),
            },
          });
        }
      }
      // Check no horizontal page overflow.
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      console.log(`[${name}] /${slug} page scrollWidth=${scrollW} viewport=${w}`);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log("done");
