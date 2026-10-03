"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { HeroSlide } from "../copy";
import "../styles/carousel.css";

const VISIBLE = 4;

/**
 * DepthCarousel (React Bits, spec §4.5): a fanned stack of photo cards
 * receding to the right. No buttons — visitors swipe: pointer drag (card
 * follows, changes at 45px), two-finger trackpad swipe (changes at 60px,
 * 750ms lock, vertical scrolling untouched), click a back card to bring it
 * forward, ←/→ while hovered or focused.
 *
 * Each card's depth index (--k / --kk) drives its transform, opacity, blur
 * and tint in CSS, so the server HTML is already laid out at every
 * breakpoint; JS only moves the indices and the dragged card.
 */
export default function DepthCarousel({ slides, label }: { slides: HeroSlide[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const n = slides.length;

  useEffect(() => {
    const dc = rootRef.current;
    if (!dc) return;
    const cards = [...dc.querySelectorAll<HTMLElement>(".hv-dc-card")];
    const mob = window.matchMedia("(max-width: 860px)");
    const tilt = () => (mob.matches ? 16 : 22);
    let act = 0;

    const layout = () => {
      cards.forEach((c, i) => {
        const k = (i - act + n) % n;
        const vis = k < VISIBLE;
        c.style.setProperty("--k", String(k));
        c.style.setProperty("--kk", String(vis ? k : VISIBLE));
        c.classList.toggle("hv-front", k === 0);
        c.classList.toggle("hv-hidden", !vis);
        c.setAttribute("aria-hidden", k === 0 ? "false" : "true");
      });
      if (liveRef.current) liveRef.current.textContent = `${slides[act].title} — ${act + 1} of ${n}`;
    };
    const go = (i: number) => {
      act = ((i % n) + n) % n;
      layout();
    };
    const front = () => cards[act];
    const follow = (d: number, transition: string) => {
      const f = front();
      f.style.transition = transition;
      f.style.transform = `translate3d(${(d * 0.5).toFixed(1)}px,0,0) rotateY(${(tilt() + d * 0.04).toFixed(2)}deg)`;
    };
    const release = () => {
      const f = front();
      f.style.transition = "";
      f.style.transform = "";
    };

    // pointer drag
    let down = false;
    let moved = false;
    let axis: "x" | "y" | null = null;
    let sx = 0;
    let sy = 0;
    let dxNow = 0;
    let pid = -1;
    let pressed: HTMLElement | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      moved = false;
      axis = null;
      dxNow = 0;
      sx = e.clientX;
      sy = e.clientY;
      pid = e.pointerId;
      pressed = (e.target as Element).closest<HTMLElement>(".hv-dc-card");
      try {
        dc.setPointerCapture(pid);
      } catch {
        /* pointer already gone */
      }
      front().style.transition = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (!down || e.pointerId !== pid) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis !== "x") return;
      moved = true;
      dxNow = dx;
      follow(Math.max(-160, Math.min(160, dx)), "none");
    };
    const onEnd = (e: PointerEvent) => {
      if (!down || e.pointerId !== pid) return;
      down = false;
      try {
        dc.releasePointerCapture(pid);
      } catch {
        /* already released */
      }
      release();
      if (axis === "x" && dxNow < -45) go(act + 1);
      else if (axis === "x" && dxNow > 45) go(act - 1);
      else if (!moved && e.type === "pointerup" && pressed && !pressed.classList.contains("hv-front"))
        go(cards.indexOf(pressed));
      else layout();
      pressed = null;
    };

    // two-finger trackpad swipe
    let wAcc = 0;
    let wLock = 0;
    let wTimer = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || down) return;
      e.preventDefault();
      const now = performance.now();
      if (now < wLock) return;
      wAcc += e.deltaX;
      window.clearTimeout(wTimer);
      follow(Math.max(-160, Math.min(160, -wAcc * 0.6)), "transform .12s linear");
      if (Math.abs(wAcc) > 60) {
        release();
        go(act + (wAcc > 0 ? 1 : -1));
        wAcc = 0;
        wLock = now + 750;
        return;
      }
      wTimer = window.setTimeout(() => {
        wAcc = 0;
        release();
        layout();
      }, 160);
    };

    // ←/→ while hovered (prototype) or focused (keyboard users)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (!dc.matches(":hover") && !dc.contains(document.activeElement)) return;
      if (dc.contains(document.activeElement)) e.preventDefault();
      go(act + (e.key === "ArrowRight" ? 1 : -1));
    };
    const onBreakpoint = () => layout();

    dc.addEventListener("pointerdown", onDown);
    dc.addEventListener("pointermove", onMove);
    dc.addEventListener("pointerup", onEnd);
    dc.addEventListener("pointercancel", onEnd);
    dc.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    mob.addEventListener("change", onBreakpoint);
    layout();
    return () => {
      dc.removeEventListener("pointerdown", onDown);
      dc.removeEventListener("pointermove", onMove);
      dc.removeEventListener("pointerup", onEnd);
      dc.removeEventListener("pointercancel", onEnd);
      dc.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      mob.removeEventListener("change", onBreakpoint);
      window.clearTimeout(wTimer);
    };
  }, [n, slides]);

  return (
    <div
      ref={rootRef}
      className="hv-dc"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      data-hv-cursor="swipe"
    >
      {slides.map((s, i) => {
        const k = i;
        const vis = k < VISIBLE;
        return (
          <div
            key={s.src}
            className={`hv-dc-card${k === 0 ? " hv-front" : ""}${vis ? "" : " hv-hidden"}`}
            style={{ "--k": k, "--kk": vis ? k : VISIBLE } as React.CSSProperties}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={k !== 0}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 860px) 250px, 360px"
              priority={k === 0}
              loading={k === 0 ? undefined : "lazy"}
              fetchPriority={k === 0 ? "high" : "low"}
              draggable={false}
              style={{ objectFit: "cover", objectPosition: s.position ?? "center" }}
            />
            <div className="hv-dc-cap">
              <b>{s.title}</b>
              <span>{s.line}</span>
            </div>
          </div>
        );
      })}
      <p ref={liveRef} className="hv-sr" aria-live="polite" />
    </div>
  );
}
