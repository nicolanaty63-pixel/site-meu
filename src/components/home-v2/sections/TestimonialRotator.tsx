"use client";

import { useEffect, useRef } from "react";
import type { HomeTestimonial } from "../copy";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The rotating quote (spec §4.11). One requestAnimationFrame progress value
 * drives both the 13s rotation and the gold progress line (no CSS timer, no
 * pause on hover — that caused a bug before; keyboard focus inside the
 * letter does pause it). Starts when the letter is 30% visible; each switch
 * fades quote + reviewer out (.45s), swaps at 480ms, fades back in and
 * redraws the underline.
 */
export default function TestimonialRotator({ items, intervalMs }: { items: HomeTestimonial[]; intervalMs: number }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const card = root?.closest<HTMLElement>(".hv-card2");
    if (!root || !card) return;
    const q = root.querySelector<HTMLElement>(".hv-q")!;
    const qt = root.querySelector<HTMLElement>(".hv-qt:not(.hv-ghost)")!;
    const who = root.querySelector<HTMLElement>(".hv-who")!;
    const whoText = root.querySelector<HTMLElement>(".hv-wt:not(.hv-ghost)")!;
    const bar = root.querySelector<HTMLElement>(".hv-tprog i")!;
    const cnt = root.querySelector<HTMLElement>(".hv-tcount")!;
    const path = root.querySelector<SVGPathElement>(".hv-q svg path")!;
    const n = items.length;
    let i = 0;
    let paused = false;
    let switching = false;
    let elapsed = 0;
    let last = 0;
    let raf = 0;
    let swapTimer = 0;

    const setWho = (t: HomeTestimonial) => {
      const b = document.createElement("b");
      b.textContent = t.name;
      whoText.replaceChildren(b, ` · ${t.meta}`);
    };
    const setCount = (k: number) => {
      const b = document.createElement("b");
      b.textContent = pad(k + 1);
      cnt.replaceChildren(b, ` / ${pad(n)}`);
    };
    const show = (k: number) => {
      i = k;
      q.classList.add("hv-out");
      who.classList.add("hv-out");
      path.style.transition = "none";
      path.style.strokeDashoffset = "1000";
      swapTimer = window.setTimeout(() => {
        qt.textContent = items[i].quote;
        setWho(items[i]);
        setCount(i);
        q.classList.remove("hv-out");
        who.classList.remove("hv-out");
        void path.getBoundingClientRect();
        path.style.transition = "";
        path.style.strokeDashoffset = "0";
        elapsed = 0;
        switching = false;
      }, 480);
    };
    const frame = (now: number) => {
      if (!last) last = now;
      const d = Math.min(100, now - last);
      last = now;
      if (!paused && !switching) elapsed += d;
      const k = Math.min(1, elapsed / intervalMs);
      bar.style.transform = `scaleX(${k.toFixed(4)})`;
      if (k >= 1 && !switching) {
        switching = true;
        show((i + 1) % n);
      }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(card);
    const onFocusIn = () => (paused = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!card.contains(e.relatedTarget as Node | null)) paused = false;
    };
    card.addEventListener("focusin", onFocusIn);
    card.addEventListener("focusout", onFocusOut);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(swapTimer);
      card.removeEventListener("focusin", onFocusIn);
      card.removeEventListener("focusout", onFocusOut);
    };
  }, [items, intervalMs]);

  const t = items[0];
  return (
    <div ref={rootRef}>
      {/* Every quote is stacked invisibly in the same grid cell, so the letter
          always reserves the tallest one — rotating to a shorter review never
          shifts the page below (the prototype only reserved 4.4em). */}
      <div className="hv-q">
        <span className="hv-qcell">
          <span className="hv-qt">{t.quote}</span>
          {items.map((it) => (
            <span key={it.quote} className="hv-qt hv-ghost" aria-hidden="true">
              {it.quote}
            </span>
          ))}
        </span>
        <svg viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 9 C 80 4, 160 12, 240 7 S 360 3, 398 8" />
        </svg>
      </div>
      <div className="hv-who">
        <span className="hv-qcell">
          <span className="hv-wt">
            <b>{t.name}</b> · {t.meta}
          </span>
          {items.map((it) => (
            <span key={it.quote} className="hv-wt hv-ghost" aria-hidden="true">
              <b>{it.name}</b> · {it.meta}
            </span>
          ))}
        </span>
      </div>
      <div className="hv-tprog">
        <i />
      </div>
      <div className="hv-tcount">
        <b>{pad(1)}</b> / {pad(items.length)}
      </div>
    </div>
  );
}
