"use client";

import { useEffect, useRef } from "react";

const ITEM_SCALE = 0.03;
const STACK_DIST = 30;
const STACK_POS = 0.2;
const SCALE_END = 0.1;
const BASE_SCALE = 0.85;

/**
 * ScrollStack (React Bits, spec §4.7). Cards pin with CSS position:sticky
 * (top: 20vh + i·30px) — no JS transforms for pinning, which is what made
 * the earlier version jitter. JS only scales each card from 1 down to
 * .85 + i·.03 as it settles, between 20% and 10% of the viewport, with the
 * prototype's exact formula. One passive scroll listener, rAF-throttled,
 * transforms written through the DOM. Reduced motion: no scaling.
 */
export default function ScrollStack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = ref.current;
    if (!stack || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = [...stack.querySelectorAll<HTMLElement>(".hv-ss-card")];
    let tops: number[] = [];
    const last: string[] = [];
    let ticking = false;

    const measure = () => {
      const st = stack.getBoundingClientRect().top + window.scrollY;
      tops = cards.map((c) => st + c.offsetTop);
    };
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const sp = vh * STACK_POS;
      const se = vh * SCALE_END;
      cards.forEach((c, i) => {
        const top = tops[i];
        const tStart = top - sp - STACK_DIST * i;
        const tEnd = top - se;
        const k = Math.max(0, Math.min(1, (y - tStart) / Math.max(1, tEnd - tStart)));
        const target = BASE_SCALE + i * ITEM_SCALE;
        const sc = (1 - k * (1 - target)).toFixed(4);
        if (last[i] !== sc) {
          last[i] = sc;
          c.style.transform = `scale(${sc})`;
        }
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const remeasure = () => {
      measure();
      update();
    };
    remeasure();
    document.fonts.ready.then(remeasure);
    const t = window.setTimeout(remeasure, 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      cards.forEach((c) => (c.style.transform = ""));
    };
  }, []);

  return (
    <div ref={ref} className="hv-ss-stack">
      {children}
    </div>
  );
}
