"use client";

import { useEffect, useRef } from "react";

const SPEED = 360 / 7000; // one turn per 7s

/**
 * BorderGlow (React Bits, spec §4.13) driver for the contact cards: the glow
 * travels clockwise around each border forever, cards offset by 120°,
 * edge proximity 86 (100 while hovered). One rAF loop for all cards,
 * running only while they are on screen. Reduced motion: a still glow.
 */
export default function GlowCards({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".hv-bgl")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offsets = cards.map((_, i) => i * 120);
    const cleanups: (() => void)[] = [];
    cards.forEach((c, i) => {
      c.style.setProperty("--edge-proximity", "86");
      c.style.setProperty("--cursor-angle", `${offsets[i]}deg`);
      const enter = () => c.style.setProperty("--edge-proximity", "100");
      const leave = () => c.style.setProperty("--edge-proximity", "86");
      c.addEventListener("pointerenter", enter);
      c.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        c.removeEventListener("pointerenter", enter);
        c.removeEventListener("pointerleave", leave);
      });
    });
    if (reduce) return () => cleanups.forEach((f) => f());

    let visible = false;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const a = (now - t0) * SPEED;
      cards.forEach((c, i) => c.style.setProperty("--cursor-angle", `${((a + offsets[i]) % 360).toFixed(2)}deg`));
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "80px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, []);

  return (
    <div ref={ref} className="hv-lv-rows hv-rv hv-d1">
      {children}
    </div>
  );
}
