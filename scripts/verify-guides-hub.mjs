// Verify the Cost Guides & Budget Calculator hub: structure, calculator
// math, interactions, console cleanliness, overflow — at 3 viewports.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/guides-hub");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3000";

const viewports = [
  { name: "mobile", w: 390, h: 844, isMobile: true },
  { name: "tablet", w: 768, h: 1024, isMobile: true },
  { name: "desktop", w: 1440, h: 900, isMobile: false },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
let failed = false;
const fail = (vp, msg) => { failed = true; console.log(`  FAIL [${vp}]: ${msg}`); };

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${BASE}/guides`, { waitUntil: "networkidle", timeout: 45000 });
  for (const text of ["Reject all", "Accept all"]) {
    const b = page.getByRole("button", { name: text }).first();
    if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
  }
  await page.waitForTimeout(600);

  // Structure
  const s = await page.evaluate(() => {
    const txt = document.body.innerText;
    return {
      calcTitle: txt.includes("Estimate your project budget"),
      typeButtons: [...document.querySelectorAll('button[aria-pressed]')].length,
      trustTitle: txt.includes("Why our estimates are realistic"),
      trustCards: txt.includes("No clickbait pricing") && txt.includes("Real contractor experience"),
      ctaTitle: txt.includes("Need a fixed quote?"),
      costBadges: (txt.match(/Typical cost ·/g) || []).length,
      readTimes: (txt.match(/min read/g) || []).length,
      guideCards: document.querySelectorAll('a[href^="/guides/"]').length,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    };
  });
  if (!s.calcTitle) fail(vp.name, "calculator heading missing");
  if (s.typeButtons < 12) fail(vp.name, `expected 12 option buttons (6 type + 3 size + 3 quality), got ${s.typeButtons}`);
  if (!s.trustTitle || !s.trustCards) fail(vp.name, "trust section incomplete");
  if (!s.ctaTitle) fail(vp.name, "CTA section missing");
  if (s.costBadges !== 5) fail(vp.name, `expected 5 cost badges, got ${s.costBadges}`);
  if (s.readTimes < 5) fail(vp.name, `expected 5 read times, got ${s.readTimes}`);
  if (s.overflow > 1) fail(vp.name, `horizontal overflow ${s.overflow}px`);

  // Calculator math: default = Bathroom Medium Standard -> £8,000 – £15,000
  await page.waitForTimeout(500);
  const def = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.innerText || "");
  if (!def.includes("£8,000") || !def.includes("£15,000")) fail(vp.name, `default estimate wrong: ${def.slice(0, 80).replace(/\n/g, " | ")}`);

  // Kitchen + Large + Luxury -> 30000 x 1.55 = £46,500+
  await page.getByRole("button", { name: "Kitchen Renovation" }).click();
  await page.getByRole("button", { name: "Large", exact: true }).click();
  await page.getByRole("button", { name: "Luxury", exact: true }).click();
  await page.waitForTimeout(600); // count-up settles (<=300ms)
  const r = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.innerText || "");
  if (!r.includes("£46,500+")) fail(vp.name, `kitchen/large/luxury expected £46,500+, got: ${r.slice(0, 60).replace(/\n/g, " | ")}`);
  if (!r.includes("Kitchen Renovation · Large · Luxury finish")) fail(vp.name, "summary line wrong");

  // Guide deep-link follows selected type; CTA links to /contact
  const links = await page.evaluate(() => {
    const live = document.querySelector('[aria-live="polite"]');
    return [...(live?.querySelectorAll("a") ?? [])].map((a) => a.getAttribute("href"));
  });
  if (!links.includes("/contact")) fail(vp.name, `result CTA missing /contact link: ${links}`);
  if (!links.includes("/guides/kitchen-renovation-cost-uk")) fail(vp.name, `guide deep-link wrong: ${links}`);

  if (errors.length) fail(vp.name, `console errors: ${errors.slice(0, 3).join(" | ")}`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/guides-${vp.name}.png` });
  await page.screenshot({ path: `${OUT}/guides-${vp.name}-full.png`, fullPage: true });
  console.log(`[${vp.name}] structure+math+links checked`);
  await ctx.close();
}

// Reduced-motion hydration check on the new page
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${BASE}/guides`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  if (errors.length) fail("reduced-motion", errors.slice(0, 2).join(" | "));
  else console.log("[reduced-motion] no hydration/page errors");
  await ctx.close();
}

await browser.close();
console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
process.exit(failed ? 1 : 0);
