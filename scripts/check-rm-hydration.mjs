import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text().slice(0, 300)); });
page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 300)));
for (const route of ["/", "/areas", "/free-quote", "/projects"]) {
  await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
}
console.log("console errors/warnings with prefers-reduced-motion:", errors.length);
errors.slice(0, 8).forEach((e) => console.log(" -", e));
// also: is content visible (not stuck at opacity 0)?
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
const vis = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  return h1 ? getComputedStyle(h1).opacity : "no-h1";
});
console.log("h1 opacity under reduced motion:", vis);
await browser.close();
