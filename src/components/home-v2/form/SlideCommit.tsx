"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import "../styles/slide-commit.css";

export type SlideCommitResult = "ok" | "invalid" | "error";

export type SlideCommitHandle = {
  /** Keyboard commit path (e.g. Enter in the last field): springs the
   *  capsule to the end, then commits. */
  commit: () => void;
};

export type SlideCommitProps = {
  /** Idle label inside the track. */
  label?: string;
  /** Label shown once committed. */
  doneLabel?: string;
  /** Label shown in the error state. */
  errorLabel?: string;
  /** Synchronous pre-check run the moment the slide completes; false →
   *  immediate error state (no spinner), like the prototype. */
  validate?: () => boolean;
  /** The real submission. "ok" → success (settle, landing dip, hold
   *  ≈1100ms, then onDone); "invalid" / "error" → error state. The spinner
   *  shows while it is pending (at least ~900ms, so it never flashes). */
  onCommit: () => Promise<SlideCommitResult>;
  /** Fires after the post-success hold. */
  onDone?: () => void;
  /** Called whenever the error state starts (to surface field errors). */
  onReject?: (result: SlideCommitResult) => void;
  ariaLabel?: string;
  ref?: React.Ref<SlideCommitHandle>;
};

const PAD = 4;
const GR = 24;
const K = 260 + 0.5 * 640; // speed 50
const M = 0.9;
const CRIT = 2 * Math.sqrt(K * M);
const BOUNCE = 0.38;
const DIP = 0.026;
const HOLD = 1100;
const LAT = 900;

/**
 * SlideCommit (React Bits, spec §4.15) — a 1:1 port of the prototype's
 * stretch-capsule slider: drag the gold handle to the end to send. Critically
 * damped spring (stiffness 260 + .5·640, mass .9), return bounce .38,
 * landing dip .026, ≈1100ms hold before success; the label fades as the
 * capsule stretches, it squashes when pulled left and swells 1.03 on mouse
 * hover; ←/→/End/Enter/Home/Escape on the keyboard; errors turn it brick
 * and shake it back to the start. All frames are written to the DOM.
 */
export default function SlideCommit({
  label = "Slide to send",
  doneLabel = "Sent",
  errorLabel = "Check your email",
  validate,
  onCommit,
  onDone,
  onReject,
  ariaLabel,
  ref,
}: SlideCommitProps) {
  const scRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const contRef = useRef<HTMLDivElement>(null);
  const labRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const spinRef = useRef<HTMLSpanElement>(null);
  const cb = useRef({ validate, onCommit, onDone, onReject });
  cb.current = { validate, onCommit, onDone, onReject };
  const commitRef = useRef<(viaKey: boolean) => void>(() => {});

  useImperativeHandle(ref, () => ({ commit: () => commitRef.current(true) }), []);

  useEffect(() => {
    const sc = scRef.current!;
    const track = trackRef.current!;
    const cap = capRef.current!;
    const cont = contRef.current!;
    const lab = labRef.current!;
    const arrow = arrowRef.current!;
    const spin = spinRef.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    let W = 0;
    let H = 0;
    let GRIP = 48;
    let INNER = 272;
    let TRAVEL = 224;
    const size = () => {
      const r = track.getBoundingClientRect();
      W = r.width;
      H = r.height;
      GRIP = H - 2 * PAD;
      INNER = W - 2 * PAD;
      TRAVEL = Math.max(1, INNER - GRIP);
    };
    let x = 0;
    let anchor = 0;
    let shown = 1;
    let spinV = 0;
    let phase: "idle" | "pending" | "done" | "error" = "idle";
    let grip: { id: number; grab: number | null; moved: boolean; hist: [number, number][] } | null = null;
    let hot = false;
    let raf = 0;
    let run = 0;
    let timer = 0;
    let homeT = 0;
    const tweens = new Set<number>();
    let alive = true;

    const render = () => {
      const seen = clamp(x, 0, TRAVEL);
      const edge = seen + GRIP + clamp(anchor - seen, 0, TRAVEL);
      cap.style.clipPath = `inset(0 ${(INNER - edge).toFixed(2)}px 0 0 round ${GR}px)`;
      cont.style.transform = `translateX(${((seen + edge) / 2 - INNER / 2).toFixed(2)}px)`;
      const q = 1 - Math.min(0.08, Math.max(0, -x) / 110);
      const sw = hot && !grip && phase === "idle" && !reduce ? 1.03 : 1;
      cap.style.transform = `scale(${(q * sw).toFixed(4)},${(sw / q).toFixed(4)})`;
      cap.style.transformOrigin = `${seen.toFixed(1)}px 50%`;
      lab.style.opacity = clamp(1 - seen / (TRAVEL * 0.55), 0, 1).toFixed(3);
      arrow.style.opacity = (shown * clamp(1 - (seen - TRAVEL * 0.55) / (TRAVEL * 0.4), 0, 1)).toFixed(3);
      spin.style.opacity = spinV.toFixed(3);
      cap.setAttribute("aria-valuenow", String(Math.round((seen / TRAVEL) * 100)));
    };
    const stopX = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const spring = (target: number, v0: number, damping: number, done?: () => void) => {
      stopX();
      let v = v0;
      let last = performance.now();
      const step = (now: number) => {
        let dt = Math.min(0.04, (now - last) / 1000);
        last = now;
        while (dt > 0) {
          const h = Math.min(0.004, dt);
          dt -= h;
          const a = (-K * (x - target) - damping * v) / M;
          v += a * h;
          x += v * h;
        }
        render();
        if (Math.abs(x - target) < 0.05 && Math.abs(v) < 1) {
          x = target;
          render();
          raf = 0;
          done?.();
          return;
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const tween = (get: () => number, set: (v: number) => void, to: number, dur: number, delay = 0) => {
      const from = get();
      const t0 = performance.now() + delay;
      let id = 0;
      const f = (now: number) => {
        tweens.delete(id);
        if (!alive) return;
        if (now < t0) {
          id = requestAnimationFrame(f);
          tweens.add(id);
          return;
        }
        const k = Math.min(1, (now - t0) / dur);
        set(from + (to - from) * (1 - Math.pow(1 - k, 3)));
        render();
        if (k < 1) {
          id = requestAnimationFrame(f);
          tweens.add(id);
        }
      };
      id = requestAnimationFrame(f);
      tweens.add(id);
    };
    const setPhase = (p: typeof phase) => {
      phase = p;
      sc.dataset.phase = p;
    };
    const restartAnim = (el: HTMLElement, cls: string) => {
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    };
    const goHome = (v: number) => {
      if (reduce) {
        x = 0;
        render();
        return;
      }
      spring(0, Math.min(0, v), CRIT * (1 - BOUNCE));
    };
    const resolve = (viaKey: boolean) => {
      setPhase("done");
      anchor = x;
      tween(() => spinV, (v) => (spinV = v), 0, 120);
      if (reduce) {
        x = 0;
        render();
      } else {
        spring(0, 0, CRIT);
        if (!viaKey && DIP > 0) restartAnim(track, "hv-dip");
      }
      timer = window.setTimeout(() => cb.current.onDone?.(), HOLD);
    };
    const reject = (result: SlideCommitResult) => {
      setPhase("error");
      tween(() => spinV, (v) => (spinV = v), 0, 120);
      tween(() => shown, (v) => (shown = v), 1, 200, 120);
      cb.current.onReject?.(result);
      if (reduce) goHome(0);
      else {
        restartAnim(track, "hv-shake");
        homeT = window.setTimeout(() => {
          if (!grip) goHome(0);
        }, 300);
      }
      timer = window.setTimeout(() => {
        if (phase === "error") setPhase("idle");
      }, 1500);
    };
    const doCommit = (viaKey: boolean) => {
      window.clearTimeout(timer);
      const id = ++run;
      x = TRAVEL;
      render();
      if (cb.current.validate && !cb.current.validate()) {
        reject("invalid");
        return;
      }
      setPhase("pending");
      tween(() => shown, (v) => (shown = v), 0, 200);
      tween(() => spinV, (v) => (spinV = v), 1, 200);
      const minWait = new Promise((r) => window.setTimeout(r, LAT));
      Promise.all([cb.current.onCommit(), minWait])
        .then(([result]) => {
          if (!alive || id !== run) return;
          if (result === "ok") resolve(viaKey);
          else reject(result);
        })
        .catch(() => {
          if (alive && id === run) reject("error");
        });
    };
    const commit = (viaKey: boolean) => {
      if (phase === "pending" || phase === "done") return;
      size();
      if (viaKey && !reduce) spring(TRAVEL, 0, CRIT, () => doCommit(true));
      else doCommit(viaKey);
    };
    commitRef.current = commit;

    const local = (cx: number) => cx - track.getBoundingClientRect().left;
    const vel = (h: [number, number][]) => {
      if (h.length < 2) return 0;
      const [t0, x0] = h[0];
      const [t1, x1] = h[h.length - 1];
      return ((x1 - x0) / Math.max(1, t1 - t0)) * 1000;
    };
    const onDown = (e: PointerEvent) => {
      if (grip || phase === "pending" || phase === "done" || e.button !== 0) return;
      e.preventDefault();
      size();
      stopX();
      grip = { id: e.pointerId, grab: null, moved: false, hist: [] };
      sc.setAttribute("data-held", "");
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        /* pointer gone */
      }
    };
    const onMove = (e: PointerEvent) => {
      const g = grip;
      if (!g || g.id !== e.pointerId) return;
      const at = local(e.clientX);
      if (g.grab === null) {
        g.grab = at - x;
        return;
      }
      const next = clamp(at - g.grab, 0, TRAVEL);
      if (Math.abs(next - x) > 0.5) g.moved = true;
      g.hist.push([e.timeStamp, next]);
      if (g.hist.length > 4) g.hist.shift();
      x = next;
      render();
    };
    const onUp = (e: PointerEvent) => {
      const g = grip;
      if (!g || g.id !== e.pointerId) return;
      grip = null;
      sc.removeAttribute("data-held");
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        /* released */
      }
      if (x >= TRAVEL) doCommit(false);
      else if (g.moved) goHome(vel(g.hist));
      else render();
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        hot = true;
        render();
      }
    };
    const onLeave = () => {
      hot = false;
      render();
    };
    const onKey = (e: KeyboardEvent) => {
      if (phase === "pending" || phase === "done") return;
      const st = TRAVEL / 10;
      if (e.key === "End" || e.key === "Enter") {
        e.preventDefault();
        commit(true);
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        size();
        x = Math.min(TRAVEL, x + st);
        render();
        if (x >= TRAVEL) doCommit(true);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        x = Math.max(0, x - st);
        render();
      } else if (e.key === "Home" || e.key === "Escape") {
        e.preventDefault();
        x = 0;
        render();
      }
    };
    const onResize = () => {
      size();
      render();
    };

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    cap.addEventListener("pointerenter", onEnter);
    cap.addEventListener("pointerleave", onLeave);
    cap.addEventListener("keydown", onKey);
    const ro = new ResizeObserver(onResize);
    ro.observe(track);
    size();
    render();
    document.fonts.ready.then(() => alive && onResize());
    return () => {
      alive = false;
      stopX();
      tweens.forEach((id) => cancelAnimationFrame(id));
      window.clearTimeout(timer);
      window.clearTimeout(homeT);
      ro.disconnect();
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      cap.removeEventListener("pointerenter", onEnter);
      cap.removeEventListener("pointerleave", onLeave);
      cap.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={scRef} className="hv-sc" data-phase="idle">
      <div ref={trackRef} className="hv-sc-track">
        <span ref={labRef} className="hv-sc-label" aria-hidden="true">
          <span className="hv-sc-text hv-plain">{label}</span>
          <span className="hv-sc-text hv-err">{errorLabel}</span>
        </span>
        <div
          ref={capRef}
          className="hv-sc-cap"
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel ?? label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <div ref={contRef} className="hv-sc-content">
            <span ref={arrowRef} className="hv-sc-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </span>
            <span ref={spinRef} className="hv-sc-spin" aria-hidden="true" style={{ opacity: 0 }}>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeOpacity=".25" />
                <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="hv-sc-done" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {doneLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
