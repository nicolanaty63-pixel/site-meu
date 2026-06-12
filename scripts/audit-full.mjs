// Full-site runtime audit: crawls every sitemap route at multiple viewports.
// Per page+viewport: console errors/warnings, page errors, horizontal overflow,
// cumulative layout shift during load+scroll, broken images.
// Once per page (desktop): title/description/canonical, h1 count, JSON-LD
// validity, image alt coverage, internal link collection.
// Finally: every discovered internal path is status-checked.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";

const res = await fetch(`${BASE}/sitemap.xml`);
const xml = await res.text();
const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((v, i, a) => a.indexOf(v) === i);
console.log(`routes from sitemap: ${routes.length}`);

const viewports = [
  { name: "xs-320", w: 320, h: 568, mobile: true },
  { name: "mob-390", w: 390, h: 844, mobile: true },
  { name: "tab-768", w: 768, h: 1024, mobile: true },
  { name: "lg-1024", w: 1024, h: 768, mobile: false },
  { name: "desk-1440", w: 1440, h: 900, mobile: false },
];

const IGNORED_CONSOLE = [
  /Download the React DevTools/,
  /\[Fast Refresh\]/,
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
const issues = [];
const allInternalHrefs = new Set();

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  // dismiss consent once per context via pre-set localStorage? keep simple: click per page
  for (const route of routes) {
    const page = await ctx.newPage();
    const consoleMsgs = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        const t = m.text();
        if (!IGNORED_CONSOLE.some((re) => re.test(t))) consoleMsgs.push(`${m.type()}: ${t.slice(0, 200)}`);
      }
    });
    page.on("pageerror", (e) => consoleMsgs.push(`pageerror: ${String(e).slice(0, 200)}`));

    try {
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 45000 });
      for (const text of ["Reject all", "Accept all"]) {
        const b = page.getByRole("button", { name: text }).first();
        if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); break; }
      }
      // slow scroll through the page to trigger lazy content + late shifts
      await page.evaluate(async () => {
        const total = document.documentElement.scrollHeight;
        for (let y = 0; y < total; y += window.innerHeight * 0.8) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, total);
        await new Promise((r) => setTimeout(r, 300));
      });

      const data = await page.evaluate(() => {
        const overflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
        const brokenImgs = [...document.querySelectorAll("img")]
          .filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy")
          .map((i) => i.currentSrc || i.src)
          .slice(0, 5);
        return { overflow, brokenImgs, cls: window.__cls ?? -1 };
      });

      if (consoleMsgs.length) issues.push({ route, vp: vp.name, type: "console", detail: [...new Set(consoleMsgs)].slice(0, 5) });
      if (data.overflow > 1) issues.push({ route, vp: vp.name, type: "h-overflow", detail: `${data.overflow}px` });
      if (data.cls > 0.05) issues.push({ route, vp: vp.name, type: "CLS", detail: data.cls.toFixed(4) });
      if (data.brokenImgs.length) issues.push({ route, vp: vp.name, type: "broken-img", detail: data.brokenImgs });

      // Page-level (desktop only) checks
      if (vp.name === "desk-1440") {
        const meta = await page.evaluate(() => {
          const h1s = document.querySelectorAll("h1").length;
          const title = document.title;
          const desc = document.querySelector('meta[name="description"]')?.content || "";
          const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
          const og = document.querySelector('meta[property="og:image"]')?.content || "";
          const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
            try { JSON.parse(s.textContent); return "ok"; } catch (e) { return "INVALID: " + String(e).slice(0, 80); }
          });
          const imgsNoAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
          const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
          return { h1s, title, descLen: desc.length, canonical, og: !!og, jsonLd, imgsNoAlt, links };
        });
        if (meta.h1s !== 1) issues.push({ route, vp: vp.name, type: "h1-count", detail: meta.h1s });
        if (!meta.title) issues.push({ route, vp: vp.name, type: "no-title", detail: "" });
        if (meta.descLen === 0) issues.push({ route, vp: vp.name, type: "no-description", detail: "" });
        if (!meta.canonical) issues.push({ route, vp: vp.name, type: "no-canonical", detail: "" });
        else if (new URL(meta.canonical).pathname.replace(/\/$/, "") !== route.replace(/\/$/, ""))
          issues.push({ route, vp: vp.name, type: "canonical-mismatch", detail: meta.canonical });
        if (!meta.og) issues.push({ route, vp: vp.name, type: "no-og-image", detail: "" });
        if (meta.jsonLd.some((j) => j !== "ok")) issues.push({ route, vp: vp.name, type: "invalid-jsonld", detail: meta.jsonLd.filter((j) => j !== "ok") });
        if (meta.imgsNoAlt > 0) issues.push({ route, vp: vp.name, type: "img-no-alt", detail: meta.imgsNoAlt });
        for (const href of meta.links) {
          if (href && (href.startsWith("/") || href.startsWith(BASE))) {
            const path = href.startsWith(BASE) ? new URL(href).pathname : href.split("#")[0];
            if (path) allInternalHrefs.add(path);
          }
        }
      }
    } catch (e) {
      issues.push({ route, vp: vp.name, type: "navigation-failed", detail: String(e).slice(0, 150) });
    }
    await page.close();
  }
  await ctx.close();
  console.log(`viewport ${vp.name} done`);
}

// Status-check every discovered internal path
const linkResults = [];
for (const path of [...allInternalHrefs].sort()) {
  try {
    const r = await fetch(`${BASE}${path}`, { redirect: "manual" });
    if (r.status >= 400) linkResults.push({ path, status: r.status });
    else if (r.status >= 300) linkResults.push({ path, status: r.status, to: r.headers.get("location") });
  } catch (e) {
    linkResults.push({ path, status: "ERR" });
  }
}
for (const l of linkResults) {
  if (l.status >= 400 || l.status === "ERR") issues.push({ route: l.path, vp: "-", type: "broken-link", detail: l.status });
  else issues.push({ route: l.path, vp: "-", type: "redirecting-link", detail: `${l.status} -> ${l.to}` });
}

await browser.close();

console.log(`\n==== ${issues.length} issues ====`);
for (const i of issues) console.log(`[${i.type}] ${i.route} @ ${i.vp}: ${JSON.stringify(i.detail)}`);
writeFileSync("verify-out/audit-full.json", JSON.stringify(issues, null, 2));
console.log("\nwritten to verify-out/audit-full.json");
