"use client";

import { useEffect, useRef } from "react";

const AMP = 5;
const PERIOD = 20;

/**
 * The gold zigzag thread (spec §4.10): a path (amplitude 5px, period 20px)
 * down the steps, drawn with stroke-dashoffset as the steps cross 72% of
 * the viewport; each step lights up as the line reaches it. Passive scroll
 * listener, DOM writes only. Reduced motion: fully drawn, every step lit.
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

    const thread = () => {
      const r = box.getBoundingClientRect();
      const line = window.innerHeight * 0.72;
      const k = reduce ? 1 : Math.max(0, Math.min(1, (line - r.top) / r.height));
      draw.style.strokeDashoffset = String(L * (1 - k));
      steps.forEach((s) => s.classList.toggle("hv-on", reduce || s.getBoundingClientRect().top + 30 < line));
    };
    const build = () => {
      const h = box.getBoundingClientRect().height;
      svg.setAttribute("viewBox", `0 0 28 ${h}`);
      const pts: string[] = [];
      for (let y = 0, i = 0; y <= h; y += PERIOD / 2, i++) pts.push(`${14 + (i % 2 ? AMP : -AMP)},${y}`);
      const d = `M${pts.join("L")}`;
      base.setAttribute("d", d);
      draw.setAttribute("d", d);
      L = draw.getTotalLength();
      draw.style.strokeDasharray = String(L);
      draw.style.strokeDashoffset = String(L);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
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
