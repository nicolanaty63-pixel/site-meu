// Empirical verification of the stats Counter smoothness.
// Loads the home page at mobile / tablet / desktop viewports, applies CPU
// throttling (to emulate weaker mobile silicon), scrolls the stats section
// into view, then samples the "350+" counter's rendered text every animation
// frame. Reports: sample count, monotonicity, and the largest single-frame
// jump as a % of the target (350). A smooth count => many samples, strictly
// non-decreasing, small max-jump. A janky count => few samples + large jumps.
import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const TARGET = 350; // the "Happy customers" stat

const viewports = [
  { name: "mobile (iPhone)", w: 390, h: 844, cpu: 6 },
  { name: "tablet (iPad)", w: 768, h: 1024, cpu: 4 },
  { name: "desktop", w: 1440, h: 900, cpu: 1 },
];

const browser = await chromium.launch({ channel: "msedge", headless: true });
let failed = false;

try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.cpu > 1,
    });
    const page = await ctx.newPage();
    const client = await ctx.newCDPSession(page);
    await client.send("Emulation.setCPUThrottlingRate", { rate: vp.cpu });

    await page.goto(BASE, { waitUntil: "networkidle" });

    // Locate the "Happy customers" (350+) counter by its label, structure-
    // agnostic so this works on both the old DOM (<span>123+</span>) and the
    // new DOM (<span><span>123</span>+</span>). Find the stat tile whose text
    // includes the label, then return the first descendant span containing a
    // digit (the counter root).
    const handle = await page.evaluateHandle(() => {
      const hasDigitSpan = (d) =>
        Array.from(d.querySelectorAll("span")).some((s) => /\d/.test(s.textContent || ""));
      const tiles = Array.from(document.querySelectorAll("div")).filter(
        (d) => /Happy customers/i.test(d.textContent || "") && hasDigitSpan(d),
      );
      // smallest matching tile that still contains the counter span = the stat
      // card itself (not a big page-level ancestor, not the bare label div).
      tiles.sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
      const tile = tiles[0];
      if (!tile) return null;
      const span = Array.from(tile.querySelectorAll("span")).find((s) =>
        /\d/.test(s.textContent || ""),
      );
      return span || null;
    });

    const el = handle.asElement();
    if (!el) {
      console.log(`\n${vp.name}: ✗ could not locate the customers counter`);
      failed = true;
      await ctx.close();
      continue;
    }

    // Start the rAF sampler FIRST (counters are below the fold, still at 0),
    // then trigger the once:true animation by scrolling them into view on the
    // 2nd tick. This captures the count from ~0 rather than joining it late,
    // so the measured step sizes reflect the real animation, not sampler
    // start-up latency.
    const samples = await page.evaluate(async (node) => {
      const inner = node.querySelector(":scope > span") || node;
      const out = [];
      const t0 = performance.now();
      let scrolled = false;
      await new Promise((resolve) => {
        const tick = () => {
          const v = parseFloat((inner.textContent || "0").replace(/[^\d.]/g, "")) || 0;
          out.push([Math.round(performance.now() - t0), v]);
          if (!scrolled) {
            node.scrollIntoView({ block: "center", behavior: "instant" });
            scrolled = true;
          }
          if (performance.now() - t0 < 2600) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
      return out;
    }, el);

    // Analyse — trim the leading pre-trigger zeros so we measure the count
    // itself (keep one zero so the first real step is measured from 0).
    const allValues = samples.map((s) => s[1]);
    let firstNonZero = allValues.findIndex((v) => v > 0);
    if (firstNonZero < 0) firstNonZero = allValues.length;
    const values = allValues.slice(Math.max(0, firstNonZero - 1));
    const final = values[values.length - 1];
    let monotonic = true;
    let maxJump = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] < values[i - 1] - 0.001) monotonic = false;
      maxJump = Math.max(maxJump, values[i] - values[i - 1]);
    }
    const maxJumpPct = ((maxJump / TARGET) * 100).toFixed(1);
    const distinct = new Set(values).size;
    const reached = Math.abs(final - TARGET) < 0.5;

    // Heuristic pass: smooth = lands on target, never goes backwards, and no
    // single frame jumps more than ~12% of the total range.
    const pass = reached && monotonic && maxJump <= TARGET * 0.12;
    if (!pass) failed = true;

    console.log(`\n${vp.name}  [CPU throttle ${vp.cpu}x]`);
    console.log(`  samples captured : ${samples.length}`);
    console.log(`  distinct values  : ${distinct}`);
    console.log(`  final value      : ${final} (target ${TARGET}) ${reached ? "✓" : "✗"}`);
    console.log(`  monotonic (no backward jumps): ${monotonic ? "✓" : "✗"}`);
    console.log(`  largest single-frame jump    : ${maxJump.toFixed(1)} (${maxJumpPct}% of range) ${maxJump <= TARGET * 0.12 ? "✓" : "✗"}`);
    console.log(`  => ${pass ? "PASS (smooth)" : "FAIL (janky)"}`);

    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${failed ? "OVERALL: ✗ FAIL" : "OVERALL: ✓ ALL VIEWPORTS SMOOTH"}`);
process.exit(failed ? 1 : 0);
