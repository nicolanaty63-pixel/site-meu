"use client";

import { useEffect, useRef } from "react";

const AMP = 5;
const PERIOD = 20;
const LINE = 0.72;
const STEP_LEAD = 30;

/**
 * The gold zigzag thread (spec §4.10): a path (amplitude 5px, period 20px)
 * down the steps, drawn with stroke-dashoffset as the steps cross 72% of
 * the viewport; each step lights up as the line reaches it. Passive scroll
 * listener, DOM writes only. Reduced motion: fully drawn, every step lit.
 *
 * Geometry (the box's document offset and height, each step's offset) is
 * measured once per resize; the scroll path is arithmetic on `scrollY` and
 * writes only when a value changes. The earlier version called
 * getBoundingClientRect() on the box and on every step in each scroll frame
 * — a forced layout per frame (~10 ms per visit at 4× CPU, and every write
 * before it was paid for twice).
 */
export default function ThreadSteps({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const svg = svgRef.current;
    const base = baseRef.current;
    const draw = drawRef.current;
    if (!box || !svg || !base || !draw) return;
    const steps = [...box.querySelectorAll<HTMLElement>(".hv-step")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let L = 0;
    let boxTop = 0; // document-relative
    let boxH = 1;
    let stepTops: number[] = [];
    let lastOffset = "";
    const lit: boolean[] = steps.map(() => false);
    const animTimers: number[] = steps.map(() => 0);

    const thread = () => {
      const line = window.scrollY + window.innerHeight * LINE;
      const k = reduce ? 1 : Math.max(0, Math.min(1, (line - boxTop) / boxH));
      const off = (L * (1 - k)).toFixed(2);
      if (off !== lastOffset) {
        lastOffset = off;
        draw.style.strokeDashoffset = off;
      }
      steps.forEach((s, i) => {
        const on = reduce || stepTops[i] + STEP_LEAD < line;
        if (on !== lit[i]) {
          lit[i] = on;
          // composited for the 0.8s transition only, then folded back
          s.classList.add("hv-anim");
          window.clearTimeout(animTimers[i]);
          animTimers[i] = window.setTimeout(() => s.classList.remove("hv-anim"), 900);
          s.classList.toggle("hv-on", on);
        }
      });
    };
    const measure = () => {
      const r = box.getBoundingClientRect();
      boxTop = r.top + window.scrollY;
      boxH = Math.max(1, r.height);
      stepTops = steps.map((s) => s.getBoundingClientRect().top + window.scrollY);
    };
    const build = () => {
      measure();
      const h = boxH;
      svg.setAttribute("viewBox", `0 0 28 ${h}`);
      const pts: string[] = [];
      for (let y = 0, i = 0; y <= h; y += PERIOD / 2, i++) pts.push(`${14 + (i % 2 ? AMP : -AMP)},${y}`);
      const d = `M${pts.join("L")}`;
      base.setAttribute("d", d);
      draw.setAttribute("d", d);
      L = draw.getTotalLength();
      draw.style.strokeDasharray = String(L);
      lastOffset = "";
      thread();
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        thread();
      });
    };
    build();
    document.fonts.ready.then(build);
    const t = window.setTimeout(build, 600);
    const ro = new ResizeObserver(build);
    ro.observe(box);
    // anything above the section changing height moves the steps' offsets
    window.addEventListener("resize", measure);
    window.addEventListener("load", build);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      animTimers.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", build);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={boxRef} className="hv-steps">
      <svg ref={svgRef} className="hv-thread" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="hv-proc-foil" x1="0" y1="0" x2="0" y2="1400" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E9D287" />
            <stop offset=".35" stopColor="#B8903F" />
            <stop offset=".7" stopColor="#F3E5A8" />
            <stop offset="1" stopColor="#A47F35" />
          </linearGradient>
        </defs>
        <path ref={baseRef} className="hv-base" />
        <path ref={drawRef} className="hv-draw" />
      </svg>
      {children}
    </div>
  );
}
