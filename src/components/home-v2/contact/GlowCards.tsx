"use client";

import { useEffect, useRef } from "react";

const TURN_MS = 7000; // one turn per 7s (contact.css: hv-cone-turn)

/**
 * BorderGlow (React Bits, spec §4.13) driver for the contact cards: the glow
 * travels clockwise around each border forever, cards offset by 120°,
 * edge proximity 86 (100 while hovered). The sweep itself is two compositor
 * transform animations in contact.css (a rotating cone window over a
 * counter-rotated static fill); this component gives each card its size
 * (`--bw`/`--bh`, the cone squares are sized from them), its phase
 * (`--phase`), runs the animations only while the cards are on screen
 * (`hv-sweep`) and brightens on hover. Reduced motion: a still glow.
 * The first version rewrote the mask angle from a rAF loop on every frame.
 */
export default function GlowCards({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".hv-bgl")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    cards.forEach((c, i) => {
      c.style.setProperty("--edge-proximity", "86");
      if (reduce) c.style.setProperty("--cursor-angle", `${i * 120}deg`);
      else c.style.setProperty("--phase", `${(-(i * TURN_MS) / 3 / 1000).toFixed(3)}s`);
      const enter = () => c.style.setProperty("--edge-proximity", "100");
      const leave = () => c.style.setProperty("--edge-proximity", "86");
      c.addEventListener("pointerenter", enter);
      c.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        c.removeEventListener("pointerenter", enter);
        c.removeEventListener("pointerleave", leave);
      });
    });
    // the glow layers are sized from the card (measured once per resize)
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        // the padding box: what `inset: 0` covered on the old pseudo-elements;
        // --bd / --bde are the diagonals (the rotating squares' sides)
        const w = el.clientWidth;
        const h = el.clientHeight;
        el.style.setProperty("--bw", `${w}px`);
        el.style.setProperty("--bh", `${h}px`);
        el.style.setProperty("--bd", `${Math.ceil(Math.hypot(w, h))}px`);
        el.style.setProperty("--bde", `${Math.ceil(Math.hypot(w + 80, h + 80))}px`);
      }
    });
    cards.forEach((c) => ro.observe(c));
    cleanups.push(() => ro.disconnect());
    if (reduce) return () => cleanups.forEach((f) => f());

    // the animations run only while a card is on screen
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        cards.forEach((c) => c.classList.toggle("hv-sweep", visible));
      },
      { rootMargin: "80px" },
    );
    cards.forEach((c) => io.observe(c));
    return () => {
      io.disconnect();
      cards.forEach((c) => c.classList.remove("hv-sweep"));
      cleanups.forEach((f) => f());
    };
  }, []);

  return (
    <div ref={ref} className="hv-lv-rows hv-rv hv-d1">
      {children}
    </div>
  );
}
