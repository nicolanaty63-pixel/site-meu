"use client";

import { useEffect, useRef } from "react";

/**
 * Count-up number (spec §4.6): once 60% visible, eases 0 → value over 1.7s
 * (ease-out cubic). The final value is server-rendered (no-JS, crawlers,
 * screen readers); the client resets it just before counting. Writes
 * textContent from a ref inside rAF — zero React re-renders, the same
 * discipline as components/Counter.tsx. Reduced motion: final value only.
 */
export default function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${to.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / 1700);
          const e = 1 - Math.pow(1 - k, 3);
          el.textContent = `${(to * e).toFixed(decimals)}${suffix}`;
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    el.textContent = `${(0).toFixed(decimals)}${suffix}`;
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = final;
    };
  }, [to, decimals, suffix, final]);

  return <span ref={ref}>{final}</span>;
}
