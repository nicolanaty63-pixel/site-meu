import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
// 404
const resp = await page.goto("http://localhost:3000/this-page-does-not-exist", { waitUntil: "networkidle" });
const branded = await page.evaluate(() => document.body.innerText.includes("Back to home") && document.querySelectorAll("h1").length === 1);
console.log(`404 status=${resp.status()} branded=${branded}`);
// lightbox focus trap
await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
const r = page.getByRole("button", { name: "Reject all" }).first();
if (await r.isVisible().catch(() => false)) await r.click().catch(() => {});
await page.locator("button.group").first().click();
await page.waitForTimeout(900);
const dialog = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  return d ? { modal: d.getAttribute("aria-modal"), label: d.getAttribute("aria-label"), focusInside: d.contains(document.activeElement) } : null;
});
console.log("lightbox dialog:", JSON.stringify(dialog));
// tab 25 times — focus must stay inside the dialog
let escaped = 0;
for (let i = 0; i < 25; i++) {
  await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement));
  if (!inside) escaped++;
}
console.log(`focus escaped dialog: ${escaped}/25 tabs`);
await page.keyboard.press("Escape");
await page.waitForTimeout(600);
const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
const focusRestored = await page.evaluate(() => document.activeElement?.tagName);
console.log(`escape closes: ${closed}, focus restored to: ${focusRestored}`);
await browser.close();
