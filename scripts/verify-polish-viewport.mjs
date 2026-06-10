import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../verify-out/polish-vp");
mkdirSync(OUT, { recursive: true });
const BASE = "https://nicollacontractors.co.uk";

const pages = [
  { slug: "home", path: "/" },
  { slug: "services", path: "/services" },
  { slug: "svc-bath", path: "/services/bathroom-renovations" },
  { slug: "svc-laminate", path: "/services/laminate-flooring" },
  { slug: "projects", path: "/projects" },
  { slug: "proj-spa", path: "/projects/spa-style-master-bathroom-st-albans" },
  { slug: "proj-laminate", path: "/projects/warm-laminate-living-space-watford" },
  { slug: "about", path: "/about" },
  { slug: "areas", path: "/areas" },
  { slug: "area-watford", path: "/areas/watford" },
  { slug: "area-bushey", path: "/areas/bushey" },
  { slug: "guides", path: "/guides" },
  { slug: "guide-bath", path: "/guides/bathroom-renovation-cost-uk" },
  { slug: "contact", path: "/contact" },
  { slug: "free-quote", path: "/free-quote" },
  { slug: "testimonials", path: "/testimonials" },
];

const viewports = [
  { name: "mobile", w: 375, h: 812, isMobile: true },
  { name: "tablet", w: 768, h: 1024, isMobile: true },
  { name: "desktop", w: 1440, h: 900, isMobile: false },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      userAgent: vp.isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    });
    for (const p of pages) {
      const page = await ctx.newPage();
      await page.goto(`${BASE}${p.path}?v=${Date.now()}`, { waitUntil: "networkidle", timeout: 45000 });
      for (const text of ["Reject all", "Accept all"]) {
        const b = page.getByRole("button", { name: text }).first();
        if (await b.isVisible().catch(() => false)) { await b.click().catch(()=>{}); break; }
      }
      await page.waitForTimeout(500);
      // Take 3 vertical slices: hero, mid-page, late
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const positions = [0, Math.min(Math.round(total * 0.4), total - vp.h), Math.max(0, total - vp.h - 100)];
      for (let i = 0; i < positions.length; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), positions[i]);
        await page.waitForTimeout(400);
        await page.screenshot({ path: resolve(OUT, `${vp.name}-${p.slug}-${i}.png`), fullPage: false, animations: "disabled" });
      }
      await page.close();
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log("done");
