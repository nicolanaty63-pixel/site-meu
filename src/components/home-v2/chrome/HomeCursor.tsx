"use client";

import { useEffect, useRef } from "react";
import "../styles/cursor.css";

const BIG =
  'a, button, label, select, input[type="range"], [role="button"], [role="slider"], [data-hv-cursor="big"]';
const SWIPE = '[data-hv-cursor="swipe"]';

/**
 * Custom cursor (spec §4.16) for fine pointers only: a 30px gold ring that
 * eases after the pointer (lerp .16) and a 5px pale-gold dot on it. Grows
 * over interactive elements and turns into a "swipe" disc over the hero
 * carousel. Also renders the prototype's film grain (desktop only).
 * Positions are written straight to the DOM — no React re-renders.
 */
export default function HomeCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".hv2");
    const cur = curRef.current;
    const dot = dotRef.current;
    if (!root || !cur || !dot) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let shown = false;
    let active = false;

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    };
    const tick = () => {
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      if (Math.abs(mx - cx) < 0.1 && Math.abs(my - cy) < 0.1) {
        cx = mx;
        cy = my;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      place(cur, cx, cy);
    };
    const setVisible = (v: boolean) => {
      shown = v;
      cur.classList.toggle("hv-show", v);
      dot.classList.toggle("hv-show", v);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        cx = mx;
        cy = my;
        setVisible(true);
      }
      place(dot, mx, my);
      if (reduce.matches) {
        cx = mx;
        cy = my;
        place(cur, cx, cy);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      const swipe = !!t?.closest(SWIPE);
      cur.classList.toggle("hv-drag", swipe);
      cur.classList.toggle("hv-big", !swipe && !!t?.closest(BIG));
    };
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };

    const start = () => {
      if (active) return;
      active = true;
      root.classList.add("hv-cursor-on");
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.addEventListener("pointerout", onLeave, { passive: true });
    };
    const stop = () => {
      if (!active) return;
      active = false;
      root.classList.remove("hv-cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeave);
      cancelAnimationFrame(raf);
      raf = 0;
      setVisible(false);
    };
    const sync = () => (fine.matches ? start() : stop());
    sync();
    fine.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return (
    <>
      <div className="hv-grain" aria-hidden="true" />
      <div ref={curRef} className="hv-cur" aria-hidden="true" />
      <div ref={dotRef} className="hv-dot" aria-hidden="true" />
    </>
  );
}
