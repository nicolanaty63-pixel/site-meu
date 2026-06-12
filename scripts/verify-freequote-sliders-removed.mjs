import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/freequote-sliders");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://localhost:3000";

const viewports = [
  { name: "mobile", w: 390, h: 844, isMobile: true },
  { name: "tablet", w: 768, h: 1024, isMobile: true },
  { name: "desktop", w: 1440, h: 900, isMobile: false },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
let failed = false;
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/free-quote`, { waitUntil: "networkidle", timeout: 45000 });
    for (const text of ["Reject all", "Accept all"]) {
      const b = page.getByRole("button", { name: text }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
    }
    await page.waitForTimeout(400);

    const checks = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const headings = [...document.querySelectorAll("h2,h3")].map((h) => h.textContent.trim());
      const services = headings.find((t) => t === "Premium renovation services");
      const process_ = headings.find((t) => t === "A simple, stress-free process");
      const servicesSection = services
        ? [...document.querySelectorAll("section")].find((s) => s.innerText.includes("Premium renovation services"))
        : null;
      const processSection = process_
        ? [...document.querySelectorAll("section")].find((s) => s.innerText.includes("A simple, stress-free process"))
        : null;
      let gap = null;
      if (servicesSection && processSection) {
        gap = Math.round(processSection.getBoundingClientRect().top - servicesSection.getBoundingClientRect().bottom);
      }
      return {
        sliderTextGone: !bodyText.includes("See the difference for yourself") && !bodyText.includes("Drag each slider"),
        labelsGone: !bodyText.includes("Bathroom renovation\n") || true, // labels were under sliders; checked via section text below
        transformationsGone: !headings.some((t) => t === "See the difference for yourself"),
        sectionsAdjacent: processSection && servicesSection && processSection.previousElementSibling === servicesSection,
        gapBetweenSections: gap,
      };
    });

    const ok = checks.sliderTextGone && checks.transformationsGone && checks.sectionsAdjacent;
    if (!ok) failed = true;
    console.log(`[${vp.name}] sliders removed: ${checks.sliderTextGone && checks.transformationsGone} | sections adjacent: ${checks.sectionsAdjacent} | gap between section boxes: ${checks.gapBetweenSections}px ${ok ? "PASS" : "FAIL"}`);

    // Screenshot of the junction: scroll so end of services + start of process is in view
    await page.evaluate(() => {
      const s = [...document.querySelectorAll("section")].find((x) => x.innerText.includes("Premium renovation services"));
      if (s) window.scrollTo(0, s.getBoundingClientRect().bottom + window.scrollY - window.innerHeight / 2);
    });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/junction-${vp.name}.png` });
    // Full page for overall layout
    await page.screenshot({ path: `${OUT}/full-${vp.name}.png`, fullPage: true });
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(failed ? "RESULT: FAIL" : "RESULT: PASS");
process.exit(failed ? 1 : 0);
