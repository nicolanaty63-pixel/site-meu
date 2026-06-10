"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function Counter({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.4,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const node = numRef.current;
    if (!node) return;

    const write = (n: number) => {
      // Imperative DOM write — no React state, so no per-frame re-render.
      // This is the whole point: the previous implementation called
      // setState every rAF frame (× 4 simultaneous counters), and on
      // mobile the resulting re-render storm dropped frames. Because the
      // count is wall-clock driven, a dropped frame made the value *jump*
      // rather than just lowering the framerate. A single textContent write
      // per frame keeps the main thread free, so frames aren't dropped.
      node.textContent = n.toFixed(decimals);
    };

    // Honour reduced-motion (and skip the animation work entirely): snap to
    // the final value.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      write(to);
      return;
    }

    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      // easeOutQuad — gentler ramp-in than cubic. On low-end mobile the device
      // renders fewer frames, so per-frame steps are larger; cubic's steep
      // start put the biggest step right at the top of the count, which reads
      // as a "jump". Quad spreads the motion more evenly so each visible step
      // is smaller, while still settling premium-ly at the end.
      const eased = 1 - Math.pow(1 - p, 2);
      if (p < 1) {
        write(to * eased);
        raf = requestAnimationFrame(step);
      } else {
        write(to); // land on the exact target, never 349.97
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, decimals]);

  return (
    <span ref={ref}>
      <span ref={numRef}>{(0).toFixed(decimals)}</span>
      {suffix}
    </span>
  );
}
