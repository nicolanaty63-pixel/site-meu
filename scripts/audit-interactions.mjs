// Interactive audit: forms, mobile nav, keyboard navigation, anchors,
// sticky elements, consent banner, FAQ accordion, review form API.
import { chromium } from "playwright-core";

const BASE = process.env.BASE || "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const issues = [];
const ok = (name) => console.log(`  ok: ${name}`);
const bad = (name, detail) => { issues.push({ name, detail }); console.log(`  FAIL: ${name} — ${detail}`); };

/* ---------- Desktop context ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  // Consent banner: appears, Reject works, choice persists
  console.log("consent banner:");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const reject = page.getByRole("button", { name: "Reject all" }).first();
  if (await reject.isVisible().catch(() => false)) {
    await reject.click();
    await page.waitForTimeout(1500);
    (await reject.isVisible().catch(() => false)) ? bad("banner closes on reject", "still visible") : ok("banner closes on reject");
    await page.reload({ waitUntil: "networkidle" });
    (await page.getByRole("button", { name: "Reject all" }).first().isVisible().catch(() => false))
      ? bad("consent persists", "banner reappeared") : ok("consent persists across reload");
  } else bad("consent banner shows", "not found on first visit");

  // Keyboard navigation on home: tab → focusable links get focus-visible outline
  console.log("keyboard:");
  await page.keyboard.press("Tab");
  const focus1 = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    return { tag: el.tagName, label: el.getAttribute("aria-label") || el.textContent?.slice(0, 30), outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 };
  });
  focus1 ? ok(`first tab stop: ${focus1.tag} (${focus1.label}) outline=${focus1.outline}`) : bad("first tab stop", "nothing focused");
  if (focus1 && !focus1.outline) bad("focus-visible outline", "no visible outline on keyboard focus");
  // Tab through 15 stops, all must be visible elements
  let hiddenFocusable = 0;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const vis = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return true;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (!vis) hiddenFocusable++;
  }
  hiddenFocusable ? bad("hidden focusable elements", `${hiddenFocusable} tab stops with zero size`) : ok("15 tab stops all visible");

  // Contact form: validation + demo submit
  console.log("contact form:");
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Request free quote/i }).click();
  const invalid = await page.evaluate(() => document.querySelectorAll("input:invalid, select:invalid, textarea:invalid").length);
  invalid > 0 ? ok(`native validation blocks empty submit (${invalid} invalid fields)`) : bad("contact validation", "empty form submitted");
  await page.fill('input[name="name"]', "Audit Test");
  await page.fill('input[name="phone"]', "07000000000");
  await page.fill('input[name="email"]', "audit@test.co.uk");
  await page.selectOption('select[name="service"]', { index: 1 });
  await page.fill('textarea[name="message"]', "Automated audit message.");
  await page.check('input[name="consent"]');
  await page.getByRole("button", { name: /Request free quote/i }).click();
  await page.waitForTimeout(600);
  (await page.getByText("Thank you!").isVisible().catch(() => false)) ? ok("contact form sent state") : bad("contact form sent state", "no confirmation shown");

  // Quote form on /free-quote + #quote anchor
  console.log("quote form:");
  await page.goto(`${BASE}/free-quote`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.querySelector('a[href="#quote"]')?.scrollIntoView());
  await page.click('a[href="#quote"]');
  await page.waitForTimeout(900);
  const nearQuote = await page.evaluate(() => {
    const q = document.getElementById("quote");
    return q ? Math.abs(q.getBoundingClientRect().top) < 300 : false;
  });
  nearQuote ? ok("#quote anchor scrolls to form") : bad("#quote anchor", "did not scroll near form");
  // Two quote forms exist on this page (hero + #quote anchor) — scope to #quote
  const qf = page.locator("#quote");
  await qf.locator('input[name="name"]').fill("Audit Test");
  await qf.locator('input[name="phone"]').fill("07000000000");
  await qf.locator('input[name="email"]').fill("audit@test.co.uk");
  await qf.locator('select[name="service"]').selectOption({ index: 1 });
  await qf.locator('input[name="consent"]').check();
  await qf.getByRole("button", { name: /Get my free quote/i }).click();
  await page.waitForTimeout(600);
  (await page.getByText(/Request received/i).isVisible().catch(() => false)) ? ok("quote form sent state") : bad("quote form sent state", "no confirmation");

  // FAQ accordion
  console.log("faq:");
  await page.goto(`${BASE}/free-quote`, { waitUntil: "networkidle" });
  // First FAQ item starts open — test the second (collapsed) one
  const faqBtn = page.locator("section :is(button, summary)").filter({ hasText: /\?/ }).nth(1);
  if (await faqBtn.count()) {
    const before = await page.evaluate(() => document.body.innerText.length);
    await faqBtn.scrollIntoViewIfNeeded();
    await faqBtn.click();
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => document.body.innerText.length);
    // Single-open accordion: opening item 2 also closes item 1, so total text
    // can shrink — aria-expanded is the reliable signal.
    const expanded = await faqBtn.getAttribute("aria-expanded");
    expanded === "true" && after !== before ? ok("FAQ expands on click") : bad("FAQ accordion", `text ${before}->${after}, aria-expanded=${expanded}`);
  } else bad("FAQ accordion", "no FAQ toggle found");

  // Review form API (local only — in-memory store)
  console.log("reviews api:");
  const apiRes = await page.evaluate(async () => {
    const r = await fetch("/api/reviews", { method: "GET" });
    return { status: r.status, ok: r.ok };
  });
  apiRes.ok ? ok(`GET /api/reviews -> ${apiRes.status}`) : bad("reviews api", `GET -> ${apiRes.status}`);

  await ctx.close();
}

/* ---------- Mobile context ---------- */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  });
  const page = await ctx.newPage();
  console.log("mobile nav:");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const r = page.getByRole("button", { name: "Reject all" }).first();
  if (await r.isVisible().catch(() => false)) await r.click().catch(() => {});

  const burger = page.getByRole("button", { name: "Toggle menu" });
  await burger.click();
  await page.waitForTimeout(400);
  const expanded = await burger.getAttribute("aria-expanded");
  expanded === "true" ? ok("menu opens, aria-expanded=true") : bad("mobile menu aria-expanded", expanded);
  const menuLink = page.locator("header a", { hasText: "Services" }).last();
  (await menuLink.isVisible()) ? ok("menu links visible") : bad("mobile menu links", "Services link not visible");
  const bodyLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
  bodyLocked ? ok("body scroll locked while menu open") : bad("menu scroll lock", "body not locked");
  await menuLink.click();
  await page.waitForLoadState("networkidle");
  const menuClosed = await page.evaluate(() => document.body.style.overflow !== "hidden");
  menuClosed ? ok("menu closes on navigation") : bad("menu close", "body still locked after nav");

  // Touch targets: all visible links/buttons >= 24px in both dimensions (WCAG 2.2 AA)
  console.log("touch targets:");
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const small = await page.evaluate(() => {
    const els = [...document.querySelectorAll("a, button")];
    return els
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || s.visibility === "hidden") return false;
        // WCAG 2.5.8 exempts links inline within a sentence/paragraph
        if (s.display === "inline") return false;
        return (r.width < 24 || r.height < 24);
      })
      .map((el) => `${el.tagName}:${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`)
      .slice(0, 10);
  });
  small.length ? bad("touch targets < 24px", small.join(" | ")) : ok("all touch targets >= 24px");

  // Sticky quote bar on /free-quote
  console.log("sticky quote bar:");
  await page.goto(`${BASE}/free-quote`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(800);
  const sticky = await page.evaluate(() => {
    const els = [...document.querySelectorAll("div, nav, a")].filter((e) => {
      const s = getComputedStyle(e);
      return (s.position === "fixed") && e.getBoundingClientRect().top > window.innerHeight - 160 && e.getBoundingClientRect().height > 30;
    });
    return els.length;
  });
  sticky > 0 ? ok("sticky quote bar appears on scroll") : bad("sticky quote bar", "not found after scrolling");

  // WhatsApp button has accessible name
  const wa = await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((x) => (x.href || "").includes("wa.me") || (x.href || "").includes("whatsapp"));
    return a ? { label: a.getAttribute("aria-label") || a.textContent?.trim() } : null;
  });
  wa ? (wa.label ? ok(`whatsapp button labelled: "${wa.label.slice(0, 30)}"`) : bad("whatsapp a11y", "no accessible name")) : ok("no whatsapp button on this page (skip)");

  await ctx.close();
}

await browser.close();
console.log(`\n==== interactions: ${issues.length} issues ====`);
for (const i of issues) console.log(`FAIL ${i.name}: ${i.detail}`);
process.exit(issues.length ? 1 : 0);
