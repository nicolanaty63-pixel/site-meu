import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/reviews");
mkdirSync(OUT, { recursive: true });
const URL = `${BASE}/testimonials`;

let problems = 0;
const check = (cond, label) => {
  console.log(`${cond ? "  ok " : "  !! "}${label}`);
  if (!cond) problems++;
};

const browser = await chromium.launch({ channel: "msedge", headless: true });
async function dismissConsent(page) {
  for (const t of ["Reject all", "Accept all"]) {
    const b = page.getByRole("button", { name: t }).first();
    if (await b.isVisible().catch(() => false)) {
      await b.click().catch(() => {});
      break;
    }
  }
}

try {
  // ---- DESKTOP: empty state + validation + submit + success + feed ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle", timeout: 45000 });
    await dismissConsent(page);

    console.log("\n[desktop] empty state");
    await page.getByText("No customer reviews yet").scrollIntoViewIfNeeded();
    check(await page.getByText("No customer reviews yet").isVisible(), "empty state visible");
    await page.screenshot({ path: resolve(OUT, "desktop-1-empty.png"), fullPage: true });

    console.log("[desktop] client validation (short text, no rating)");
    await page.getByLabel("Full name").fill("Jo");
    await page.getByLabel("Your review").fill("short");
    await page.waitForTimeout(2700); // clear the bot time-trap
    await page.getByRole("button", { name: "Submit review" }).click();
    const vErr = page.locator("form").getByRole("alert");
    await vErr.waitFor({ state: "visible", timeout: 4000 }).catch(() => {});
    const vErrText = await vErr.innerText().catch(() => "");
    check(/star rating/.test(vErrText), `validation error shown (no network): "${vErrText.trim()}"`);
    await page.screenshot({ path: resolve(OUT, "desktop-2-validation.png"), clip: await formClip(page) });

    console.log("[desktop] happy path submit");
    await page.getByLabel("Full name").fill("Daniel Hughes");
    await page.getByRole("radio", { name: "5 stars" }).click();
    await page.getByLabel("Service (optional)").selectOption("Bathroom Renovations");
    await page.getByLabel("Your review").fill(
      "Outstanding work on our bathroom — the tiling is flawless, the team were punctual, tidy and a pleasure to have in the house. Highly recommended.",
    );
    await page.waitForTimeout(2700);
    await page.getByRole("button", { name: "Submit review" }).click();
    const success = page.getByText("Thank you for your review!");
    await success.waitFor({ state: "visible", timeout: 15000 });
    check(true, "success state shown");
    await page.screenshot({ path: resolve(OUT, "desktop-3-success.png"), fullPage: true });

    // The new review should now be in the feed.
    await page.waitForTimeout(800);
    const card = page.locator("figure", { hasText: "Daniel Hughes" }).first();
    await card.scrollIntoViewIfNeeded();
    check(await card.isVisible(), "submitted review appears in feed");
    check(await card.getByText(/flawless/).isVisible().catch(() => false), "review content visible");
    check(await card.locator("time").isVisible().catch(() => false), "date shown on card");
    check(await card.getByLabel(/5 out of 5 stars/).isVisible().catch(() => false), "rating stars shown");
    check(await card.getByText("Bathroom Renovations").isVisible().catch(() => false), "service shown");
    await page.screenshot({ path: resolve(OUT, "desktop-4-feed.png"), clip: await cardsClip(page) });

    // Existing curated sections untouched.
    check(await page.getByText("Real words from real customers").isVisible().catch(() => false), "existing curated grid still present");

    // No horizontal overflow.
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const iw = await page.evaluate(() => window.innerWidth);
    check(sw <= iw + 1, `no horizontal overflow (${sw}/${iw})`);
    await ctx.close();
  }

  // ---- second review to confirm NEWEST-FIRST ordering -----------------------
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    await dismissConsent(page);
    await page.getByLabel("Full name").fill("Priya Patel");
    await page.getByRole("radio", { name: "4 stars" }).click();
    await page.getByLabel("Your review").fill(
      "Really happy with our new kitchen — great communication from start to finish and a beautiful finish on the worktops and units.",
    );
    await page.waitForTimeout(2700);
    await page.getByRole("button", { name: "Submit review" }).click();
    await page.getByText("Thank you for your review!").waitFor({ state: "visible", timeout: 15000 });
    await page.waitForTimeout(600);
    const firstCard = page.locator("section.bg-charcoal\\/30 figure").first();
    const firstText = await firstCard.innerText();
    check(/Priya Patel/.test(firstText), `newest review first (got "${(firstText.split("\n").pop() || "").trim()}")`);
    await ctx.close();
  }

  // ---- TABLET + MOBILE: responsiveness, input usability, no overflow --------
  for (const vp of [
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    await dismissConsent(page);
    console.log(`\n[${vp.name}] responsiveness`);

    // Inputs must be >=16px font to avoid iOS focus-zoom.
    await page.getByLabel("Your review").scrollIntoViewIfNeeded();
    const fs = await page.getByLabel("Your review").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    check(fs >= 16, `review input font-size ${fs}px (>=16, no mobile zoom)`);

    // Star buttons are comfortably tappable.
    const star = page.getByRole("radio", { name: "5 stars" });
    const box = await star.boundingBox();
    check(box && box.width >= 32 && box.height >= 32, `star tap target ${box && Math.round(box.width)}x${box && Math.round(box.height)}px`);

    await page.screenshot({ path: resolve(OUT, `${vp.name}-form.png`), clip: await formClip(page) });

    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const iw = await page.evaluate(() => window.innerWidth);
    check(sw <= iw + 1, `no horizontal overflow (${sw}/${iw})`);

    // Feed cards present + full-page shot.
    await page.getByText("Reviews from our customers").scrollIntoViewIfNeeded();
    await page.screenshot({ path: resolve(OUT, `${vp.name}-full.png`), fullPage: true });
    await ctx.close();
  }
} finally {
  await browser.close();
}

async function formClip(page) {
  const el = page.locator("form").first();
  const b = await el.boundingBox();
  return b ? { x: Math.max(0, b.x - 10), y: Math.max(0, b.y - 60), width: b.width + 20, height: b.height + 80 } : undefined;
}
async function cardsClip(page) {
  const el = page.locator("section.bg-charcoal\\/30");
  const b = await el.boundingBox();
  return b ? { x: Math.max(0, b.x), y: Math.max(0, b.y), width: b.width, height: Math.min(b.height, 700) } : undefined;
}

console.log(`\n${problems === 0 ? "PASS" : problems + " PROBLEM(S)"} — screenshots in verify-out/reviews/`);
process.exit(problems === 0 ? 0 : 1);
