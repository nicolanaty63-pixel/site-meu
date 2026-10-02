"use client";

import { useEffect, useRef } from "react";
import { WM_LH, WM_PADX, WM_Y0 } from "./wordmark-geometry";

type Glyph = { c: string; d: string; x: number; bb: [number, number, number, number] };
type WordmarkData = {
  size: number;
  cap: number;
  desc: number;
  lines: { t: string; w: number; g: Glyph[] }[];
};

/**
 * Progressive enhancement of the hero <h1> (spec §4.4) — a 1:1 port of the
 * prototype's "hero wordmark" block. After hydration, once the CSS line
 * entrance has finished, the glyph outlines (loaded on demand) are drawn as
 * SVG over the server-rendered text in exactly the same box. Near the
 * pointer, letters turn into dashed gold-on-navy vector outlines; a gliding
 * selection frame with handles, a size label and a connector follows the
 * hovered letter, with small specks; letters can be dragged and spring back;
 * after ~0.9s without the pointer an idle sweep travels along the lines.
 * Every per-frame write goes straight to the SVG — no React re-renders.
 */
export default function HeroWordmark() {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const h1 = host?.closest("h1");
    if (!host || !h1) return;
    let disposed = false;
    let unmount: (() => void) | null = null;
    const entrance = [...h1.querySelectorAll<HTMLElement>(".hv-li")].flatMap((el) =>
      el.getAnimations().map((a) => a.finished.catch(() => undefined)),
    );
    Promise.all([import("./hero-wordmark-glyphs.json"), Promise.all(entrance)])
      .then(([mod]) => {
        if (!disposed) unmount = mountWordmark(h1, host, mod.default as unknown as WordmarkData);
      })
      .catch(() => {
        /* the server-rendered title simply stays */
      });
    return () => {
      disposed = true;
      unmount?.();
    };
  }, []);

  return <span ref={hostRef} aria-hidden="true" />;
}

type G = {
  el: SVGGElement;
  f: SVGPathElement;
  o: SVGPathElement;
  c: string;
  x: number;
  y: number;
  bb: [number, number, number, number];
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  k: number;
};
type Speck = { el: SVGRectElement; a: number; r: number; t0: number; life: number; ph: number; f: number };

function mountWordmark(h1: HTMLElement, host: HTMLElement, WM: WordmarkData): () => void {
  const NS = "http://www.w3.org/2000/svg";
  const mk = <K extends keyof SVGElementTagNameMap>(t: K, a: Record<string, string | number> = {}) => {
    const e = document.createElementNS(NS, t);
    for (const k in a) e.setAttribute(k, String(a[k]));
    return e;
  };
  const S = WM.size;
  const LH = WM_LH;
  const Y0 = WM_Y0;
  const PADX = WM_PADX;
  const W = Math.max(...WM.lines.map((l) => l.w)) + PADX * 2;
  const H = Y0 + (WM.lines.length - 1) * LH + WM.desc + 6;
  const uid = `hvwm${Math.random().toString(36).slice(2, 8)}`;

  const svg = mk("svg", { viewBox: `${-PADX} 0 ${W} ${H}`, class: "hv-wm-svg", "aria-hidden": "true", focusable: "false" });
  const defs = mk("defs");
  svg.appendChild(defs);
  const glyphs: G[] = [];
  WM.lines.forEach((ln, i) => {
    const base = Y0 + i * LH;
    const cp = mk("clipPath", { id: `${uid}c${i}` });
    cp.appendChild(mk("rect", { x: -PADX, y: base - 84, width: W, height: 84 + WM.desc + 4 }));
    defs.appendChild(cp);
    const outer = mk("g", { class: "hv-ln", "clip-path": `url(#${uid}c${i})` });
    const inner = mk("g", { class: "hv-lni" });
    outer.appendChild(inner);
    svg.appendChild(outer);
    ln.g.forEach((gl) => {
      const g = mk("g", { class: "hv-g" });
      const f = mk("path", { class: "hv-f", d: gl.d });
      const o = mk("path", { class: "hv-o", d: gl.d, "stroke-opacity": "0" });
      g.appendChild(f);
      g.appendChild(o);
      inner.appendChild(g);
      g.setAttribute("transform", `translate(${gl.x.toFixed(2)},${base.toFixed(2)})`);
      glyphs.push({ el: g, f, o, c: gl.c, x: gl.x, y: base, bb: gl.bb, dx: 0, dy: 0, vx: 0, vy: 0, k: 0 });
    });
  });

  // selection frame, handles, label, connector, specks
  const ui = mk("g", { class: "hv-ui" });
  svg.appendChild(ui);
  const con = mk("path", { class: "hv-con" });
  ui.appendChild(con);
  const sel = mk("rect", { class: "hv-sel" });
  ui.appendChild(sel);
  const hds = [0, 1, 2, 3].map(() => {
    const r = mk("rect", { class: "hv-hd", opacity: "0" });
    ui.appendChild(r);
    return r;
  });
  const lbl = mk("text", { class: "hv-lbl" });
  ui.appendChild(lbl);
  const specks: Speck[] = [];
  for (let i = 0; i < 15; i++) {
    const r = mk("rect", { class: "hv-sp", width: 2.4, height: 2.4, opacity: "0" });
    ui.appendChild(r);
    specks.push({ el: r, a: 0, r: 0, t0: 0, life: 0, ph: Math.random() * 6.28, f: 1.5 + Math.random() * 2 });
  }
  host.appendChild(svg);
  h1.classList.add("hv-wm-on");

  // geometry
  let scalePx = 1;
  let r1 = 60;
  let r0 = 18;
  const measure = () => {
    const r = svg.getBoundingClientRect();
    if (!r.width) return;
    scalePx = r.width / W;
    r1 = Math.min(200 / scalePx, 2.3 * S);
    r0 = r1 * (1 - 0.7);
    const dash = 4 / scalePx;
    const gap = 2 / scalePx;
    const sw = 1.5 / scalePx;
    glyphs.forEach((g) => {
      g.o.setAttribute("stroke-width", sw.toFixed(2));
      g.o.setAttribute("stroke-dasharray", `${dash.toFixed(2)} ${gap.toFixed(2)}`);
    });
    sel.setAttribute("stroke-width", (1 / scalePx).toFixed(2));
    con.setAttribute("stroke-width", (1 / scalePx).toFixed(2));
    con.setAttribute("stroke-dasharray", `${(3 / scalePx).toFixed(2)} ${(3 / scalePx).toFixed(2)}`);
    hds.forEach((h) => {
      h.setAttribute("width", (5 / scalePx).toFixed(2));
      h.setAttribute("height", (5 / scalePx).toFixed(2));
      h.setAttribute("stroke-width", (1 / scalePx).toFixed(2));
    });
    lbl.setAttribute("font-size", (10 / scalePx).toFixed(2));
    specks.forEach((s) => {
      s.el.setAttribute("width", (2.4 / scalePx).toFixed(2));
      s.el.setAttribute("height", (2.4 / scalePx).toFixed(2));
    });
  };
  measure();
  const ro = new ResizeObserver(measure);
  ro.observe(svg);

  const toVB = (e: PointerEvent): [number, number] => {
    const r = svg.getBoundingClientRect();
    const k = W / r.width;
    return [(e.clientX - r.left) * k - PADX, (e.clientY - r.top) * k];
  };
  const box = (g: G) => [g.x + g.bb[0] + g.dx, g.y + g.bb[1] + g.dy, g.x + g.bb[2] + g.dx, g.y + g.bb[3] + g.dy];
  const hit = (px: number, py: number) => {
    let best: G | null = null;
    let bd = 1e9;
    for (const g of glyphs) {
      const b = box(g);
      if (px >= b[0] - 3 && px <= b[2] + 3 && py >= b[1] - 6 && py <= b[3] + 6) {
        const d = Math.hypot(px - (b[0] + b[2]) / 2, py - (b[1] + b[3]) / 2);
        if (d < bd) {
          bd = d;
          best = g;
        }
      }
    }
    return best;
  };

  // pointer state
  const fineMQ = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  let inside = false;
  let px = -1e4;
  let py = -1e4;
  let drag: G | null = null;
  let dragId = -1;
  let dsx = 0;
  let dsy = 0;
  let awayAt = performance.now();
  let active: G | null = null;

  const onEnter = () => {
    inside = true;
  };
  const onLeave = () => {
    inside = false;
    awayAt = performance.now();
    if (!drag) px = py = -1e4;
  };
  const onMove = (e: PointerEvent) => {
    if (!fineMQ.matches && !drag) return;
    [px, py] = toVB(e);
    if (drag) {
      drag.dx = px - dsx;
      drag.dy = py - dsy;
      drag.vx = drag.vy = 0;
    }
  };
  // Pointer drag (mouse as in the prototype; touch too — horizontal drags,
  // since touch-action: pan-y keeps vertical swipes scrolling the page).
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const [x, y] = toVB(e);
    const g = hit(x, y);
    if (!g) return;
    drag = g;
    dragId = e.pointerId;
    dsx = x - g.dx;
    dsy = y - g.dy;
    px = x;
    py = y;
    g.el.classList.add("hv-drag");
    try {
      svg.setPointerCapture(e.pointerId);
    } catch {
      /* pointer already gone */
    }
    if (e.pointerType === "mouse") e.preventDefault();
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== dragId) return;
    drag.el.classList.remove("hv-drag");
    drag = null;
    if (!inside || e.pointerType !== "mouse") {
      px = py = -1e4;
      awayAt = performance.now();
    }
  };
  svg.addEventListener("pointerenter", onEnter);
  svg.addEventListener("pointerleave", onLeave);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onUp);

  // idle sweep
  let swStart = performance.now() + 400;
  let swLine = 0;
  const sweep = (now: number): [number, number] | null => {
    const vel = 230;
    const span = W + r1 * 2;
    const dur = (span / vel) * 1000;
    const t = now - swStart;
    if (t < 0) return null;
    if (t > dur) {
      swStart = now + 900;
      swLine = (swLine + 1) % WM.lines.length;
      return null;
    }
    return [-PADX - r1 + span * (t / dur), Y0 + swLine * LH - WM.cap * 0.5];
  };

  // selection frame state
  let fx = 0;
  let fy = 0;
  let fw = 0;
  let fh = 0;
  let fInit = false;
  const rnd = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };
  let speckSeedFor: G | null = null;

  let raf = 0;
  let visible = true;
  const loop = (now: number) => {
    raf = 0;
    const reduce = reduceMQ.matches;
    let cx = px;
    let cy = py;
    let virt = false;
    if (!inside && !drag && !reduce && now - awayAt > 900) {
      const v = sweep(now);
      if (v) {
        [cx, cy] = v;
        virt = true;
      } else {
        cx = cy = -1e4;
      }
    } else if (!inside && !drag) {
      cx = cy = -1e4;
    }
    // reveal + spring back
    for (const g of glyphs) {
      const b = box(g);
      const gx = (b[0] + b[2]) / 2;
      const gy = (b[1] + b[3]) / 2;
      const d = Math.hypot(cx - gx, cy - gy) - Math.min(b[2] - b[0], b[3] - b[1]) * 0.25;
      let k = d <= r0 ? 1 : d >= r1 ? 0 : 1 - (d - r0) / (r1 - r0);
      if (g === drag) k = 1;
      if (Math.abs(k - g.k) > 0.01) {
        g.k = k;
        g.f.setAttribute("fill-opacity", (1 - k).toFixed(2));
        g.o.setAttribute("stroke-opacity", k.toFixed(2));
      }
      if (g !== drag && (g.dx || g.dy || g.vx || g.vy)) {
        if (reduce) {
          g.dx = g.dy = g.vx = g.vy = 0;
        } else {
          g.vx += -0.11 * g.dx - 0.16 * g.vx;
          g.vy += -0.11 * g.dy - 0.16 * g.vy;
          g.dx += g.vx;
          g.dy += g.vy;
          if (Math.abs(g.dx) < 0.05 && Math.abs(g.dy) < 0.05 && Math.abs(g.vx) < 0.05 && Math.abs(g.vy) < 0.05)
            g.dx = g.dy = g.vx = g.vy = 0;
        }
      }
      g.el.setAttribute("transform", `translate(${(g.x + g.dx).toFixed(2)},${(g.y + g.dy).toFixed(2)})`);
    }
    // selection
    const h = drag || hit(cx, cy);
    if (h) active = h;
    const show = !!h || (inside && !!active) || (virt && !!active);
    if (active) {
      const b = box(active);
      const pad = 6;
      const tx = b[0] - pad;
      const ty = b[1] - pad;
      const tw = b[2] - b[0] + pad * 2;
      const th = b[3] - b[1] + pad * 2;
      if (!fInit) {
        fx = tx;
        fy = ty;
        fw = tw;
        fh = th;
        fInit = true;
      } else {
        const e = reduce ? 1 : 0.16;
        fx += (tx - fx) * e;
        fy += (ty - fy) * e;
        fw += (tw - fw) * e;
        fh += (th - fh) * e;
      }
      sel.setAttribute("x", fx.toFixed(2));
      sel.setAttribute("y", fy.toFixed(2));
      sel.setAttribute("width", fw.toFixed(2));
      sel.setAttribute("height", fh.toFixed(2));
      const hs = 5 / scalePx;
      [
        [fx, fy],
        [fx + fw, fy],
        [fx, fy + fh],
        [fx + fw, fy + fh],
      ].forEach((p, i) => {
        hds[i].setAttribute("x", (p[0] - hs / 2).toFixed(2));
        hds[i].setAttribute("y", (p[1] - hs / 2).toFixed(2));
      });
      const size = Math.round(S * scalePx);
      const fmt = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v * scalePx))}`;
      lbl.textContent = drag ? `${fmt(drag.dx)}, ${fmt(drag.dy)} px` : `${active.c}  ·  ${size} px`;
      lbl.setAttribute("x", fx.toFixed(2));
      lbl.setAttribute("y", (fy - 9 / scalePx).toFixed(2));
      con.setAttribute(
        "d",
        `M${(fx + fw).toFixed(1)},${fy.toFixed(1)} L${(fx + fw + 14 / scalePx).toFixed(1)},${(fy - 14 / scalePx).toFixed(1)}`,
      );
      // specks around the active letter
      if (speckSeedFor !== active) {
        speckSeedFor = active;
        const R = rnd(glyphs.indexOf(active) * 7919 + 17);
        specks.forEach((s) => {
          s.a = R() * 6.283;
          s.r = 0.55 + R() * 0.9;
          s.t0 = now - R() * 2000;
          s.life = 1400 + R() * 2200;
          s.ph = R() * 6.283;
          s.f = 1.2 + R() * 2.4;
        });
      }
      const bcx = (b[0] + b[2]) / 2;
      const bcy = (b[1] + b[3]) / 2;
      const hd = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2;
      specks.forEach((s, i) => {
        if (now - s.t0 > s.life) {
          const R = rnd((now | 0) + i * 31);
          s.a = R() * 6.283;
          s.r = 0.55 + R() * 0.9;
          s.t0 = now;
          s.life = 1400 + R() * 2200;
          s.ph = R() * 6.283;
        }
        const x = bcx + Math.cos(s.a) * hd * s.r;
        const y = bcy + Math.sin(s.a) * hd * s.r * 0.8;
        const on = Math.sin((now / 1000) * s.f * 6.283 + s.ph) > 0.25 && !reduce;
        s.el.setAttribute("x", x.toFixed(1));
        s.el.setAttribute("y", y.toFixed(1));
        s.el.setAttribute("opacity", show && on ? "1" : "0");
      });
    }
    sel.classList.toggle("hv-on", show);
    lbl.classList.toggle("hv-on", show);
    hds.forEach((x) => x.setAttribute("opacity", show ? "1" : "0"));
    con.style.visibility = show ? "visible" : "hidden";
    if (visible) raf = requestAnimationFrame(loop);
  };

  // run only while the title is on screen and the tab is visible
  const resume = () => {
    if (visible && !raf && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) resume();
  });
  io.observe(h1);
  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else resume();
  };
  document.addEventListener("visibilitychange", onVis);
  resume();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    svg.remove();
    h1.classList.remove("hv-wm-on");
  };
}
