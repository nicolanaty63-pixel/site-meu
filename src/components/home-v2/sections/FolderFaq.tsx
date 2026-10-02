"use client";

import { useEffect, useRef } from "react";
import type { Body as MatterBody, Engine as MatterEngine } from "matter-js";
import type { FAQ } from "@/lib/data";

type Copy = { folderLabel: string; folderSub: string; clientLabel: string; usLabel: string };

const P = { spread: 300, lift: 26, tilt: 8, openDuration: 520, stagger: 45, drift: 0.5 };
const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;
const pad2 = (n: number) => String(n).padStart(2, "0");
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * FAQ — FolderFloat (React Bits, spec §4.12) + the conversation card. A
 * port of the prototype's block: the folder opens on hover (tap on touch;
 * tapping outside closes), the notes fly out in rows (45ms stagger, 520ms,
 * spring easing), then — on fine and coarse pointers alike — matter-js
 * (imported only on the first open) lets them drift in zero gravity and be
 * dragged. Picking a note closes the folder and fades the card to that
 * question. Reduced motion: no flight, no physics.
 */
export default function FolderFaq({ faqs, copy }: { faqs: FAQ[]; copy: Copy }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const convRef = useRef<HTMLDivElement>(null);
  const n = faqs.length;

  useEffect(() => {
    const root = rootRef.current;
    const conv = convRef.current;
    if (!root || !conv) return;
    const items = [...root.querySelectorAll<HTMLButtonElement>(".hv-ff-item")];
    const anchor = root.querySelector<HTMLElement>(".hv-ff-items")!;
    const trig = root.querySelector<HTMLButtonElement>(".hv-ff-trigger")!;
    const cvBox = conv.querySelector<HTMLElement>(".hv-in")!;
    const cvQ = conv.querySelector<HTMLElement>(".hv-q")!;
    const cvA = conv.querySelector<HTMLElement>(".hv-a")!;
    const cvC = conv.querySelector<HTMLElement>(".hv-ctr")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hoverOK = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let spread = P.spread;
    let open = false;
    let pos: { x: number; y: number; r: number }[] = [];
    let sizes: { w: number; h: number }[] = [];
    let liveTimer = 0;
    let popTimer = 0;
    let pickTimer = 0;
    let matter: typeof import("matter-js") | null = null;
    let matterLoading: Promise<void> | null = null;
    let alive = true;
    type World = {
      engine: MatterEngine | null;
      bodies: MatterBody[];
      sizes: { w: number; h: number }[];
      raf: number;
      last: number;
      t0: number;
      drag: { i: number; id: number; dx: number; dy: number; sx: number; sy: number; moved: boolean } | null;
      zone: { left: number; right: number; top: number; bottom: number } | null;
      live: boolean;
    };
    const W: World = { engine: null, bodies: [], sizes: [], raf: 0, last: 0, t0: 0, drag: null, zone: null, live: false };

    const layout = () => {
      const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
      let row: { i: number; pw: number }[] = [];
      let width = 0;
      items.forEach((el, i) => {
        const pw = sizes[i] ? sizes[i].w : PAD + (el.textContent?.length ?? 0) * CHAR;
        if (row.length && width + GAP + pw > spread * 2) {
          rows.push({ items: row, width });
          row = [];
          width = 0;
        }
        row.push({ i, pw });
        width += (row.length > 1 ? GAP : 0) + pw;
      });
      if (row.length) rows.push({ items: row, width });
      pos = [];
      rows.forEach((r, ri) => {
        let x = -r.width / 2;
        const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
        r.items.forEach(({ i, pw }) => {
          const j = jitter(i);
          pos[i] = { x: x + pw / 2 + shift + (j - 0.5) * 6, y: -P.lift - ri * ROW - j * 6, r: P.tilt * (j * 2 - 1) };
          x += pw + GAP;
        });
      });
      items.forEach((el, i) => {
        el.style.setProperty("--x", `${pos[i].x.toFixed(1)}px`);
        el.style.setProperty("--y", `${pos[i].y.toFixed(1)}px`);
        el.style.setProperty("--r", `${pos[i].r.toFixed(2)}deg`);
      });
    };
    const measure = () => {
      const box = root.parentElement!.getBoundingClientRect();
      spread = Math.min(P.spread, Math.max(140, (box.width - 40) / 2));
      root.style.setProperty("--ff-spread", `${spread}px`);
      sizes = items.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
      if (!W.live) layout();
    };

    const stopPhysics = () => {
      window.clearTimeout(liveTimer);
      cancelAnimationFrame(W.raf);
      W.raf = 0;
      if (W.engine && matter) {
        W.bodies.forEach((b, i) => {
          items[i].style.setProperty("--x", `${b.position.x.toFixed(1)}px`);
          items[i].style.setProperty("--y", `${(b.position.y - W.sizes[i].h / 2).toFixed(1)}px`);
        });
        matter.Composite.clear(W.engine.world, false, true);
        matter.Engine.clear(W.engine);
        W.engine = null;
      }
      W.bodies = [];
      W.drag = null;
      W.live = false;
      root.removeAttribute("data-live");
    };
    const startPhysics = () => {
      if (!matter || W.engine || !open || !alive) return;
      const { Bodies, Body, Composite, Engine } = matter;
      const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
      engine.enableSleeping = false;
      W.engine = engine;
      W.sizes = items.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));
      const ys = pos.map((p) => p.y);
      const zone = {
        left: -spread - ZONE_PAD,
        right: spread + ZONE_PAD,
        top: Math.min(...ys) - ZONE_PAD,
        bottom: -P.lift + Math.max(...W.sizes.map((s) => s.h)),
      };
      W.zone = zone;
      W.bodies = items.map((_, i) => {
        const { w: bw, h: bh } = W.sizes[i];
        const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
          chamfer: { radius: Math.min(bh / 2 - 1, 16) },
          restitution: 0.55,
          friction: 0,
          frictionAir: 0.08,
          inertia: Infinity,
        });
        b.plugin = { phase: jitter(i) * Math.PI * 2 };
        return b;
      });
      const T = 80;
      const walls = [
        Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, { isStatic: true }),
        Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, { isStatic: true }),
        Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, { isStatic: true }),
        Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, { isStatic: true }),
      ];
      Composite.add(engine.world, [...W.bodies, ...walls]);
      W.live = true;
      W.last = 0;
      W.t0 = performance.now();
      root.setAttribute("data-live", "");
      const tick = (now: number) => {
        if (!W.engine) return;
        const dt = W.last ? Math.min(32, now - W.last) : 16;
        W.last = now;
        const t = (now - W.t0) / 1000;
        const k = P.drift * 0.00005 * Math.min(1, t / 2);
        W.bodies.forEach((b, i) => {
          if (W.drag && W.drag.i === i) return;
          const ph = (b.plugin as { phase: number }).phase;
          Body.applyForce(b, b.position, {
            x: Math.sin(t * 0.9 + ph) * k * b.mass,
            y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass,
          });
        });
        Engine.update(W.engine, dt);
        W.bodies.forEach((b, i) => {
          items[i].style.setProperty("--x", `${b.position.x.toFixed(1)}px`);
          items[i].style.setProperty("--y", `${(b.position.y - W.sizes[i].h / 2).toFixed(1)}px`);
        });
        W.raf = requestAnimationFrame(tick);
      };
      W.raf = requestAnimationFrame(tick);
    };
    const loadMatter = () => {
      if (matter || matterLoading || reduce) return matterLoading;
      matterLoading = import("matter-js").then((m) => {
        matter = (m as unknown as { default?: typeof import("matter-js") }).default ?? m;
      });
      return matterLoading;
    };

    const set = (next: boolean) => {
      if (next === open) return;
      open = next;
      if (!open) stopPhysics();
      root.toggleAttribute("data-open", open);
      trig.setAttribute("aria-expanded", String(open));
      items.forEach((el) => {
        el.tabIndex = open ? 0 : -1;
        el.setAttribute("aria-hidden", String(!open));
      });
      window.clearTimeout(liveTimer);
      if (open && !reduce) {
        const ready = loadMatter();
        liveTimer = window.setTimeout(() => {
          if (matter) startPhysics();
          else ready?.then(startPhysics);
        }, P.openDuration + (n - 1) * P.stagger + 80);
      }
    };
    const pick = (i: number) => {
      cvBox.classList.add("hv-out");
      window.clearTimeout(pickTimer);
      pickTimer = window.setTimeout(() => {
        cvC.textContent = `${pad2(i + 1)} / ${pad2(n)}`;
        cvQ.textContent = faqs[i].q;
        cvA.textContent = faqs[i].a;
        cvBox.classList.remove("hv-out");
      }, 320);
      window.clearTimeout(popTimer);
      items[i].setAttribute("data-pop", "");
      popTimer = window.setTimeout(() => items[i].removeAttribute("data-pop"), 320);
      set(false);
    };
    const pointerAt = (e: PointerEvent) => {
      const r = anchor.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Document,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
    };

    items.forEach((el, i) => {
      on(el, "pointerdown", (e) => {
        if (!W.live || e.button !== 0 || !matter) return;
        const b = W.bodies[i];
        if (!b) return;
        const p = pointerAt(e);
        W.drag = { i, id: e.pointerId, dx: b.position.x - p.x, dy: b.position.y - p.y, sx: e.clientX, sy: e.clientY, moved: false };
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer gone */
        }
      });
      on(el, "pointermove", (e) => {
        const d = W.drag;
        if (!d || d.i !== i || d.id !== e.pointerId || !matter || !W.zone) return;
        if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
          d.moved = true;
          el.setAttribute("data-drag", "");
        }
        if (!d.moved) return;
        const b = W.bodies[i];
        const { w: bw, h: bh } = W.sizes[i];
        const z = W.zone;
        const p = pointerAt(e);
        const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
        const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
        matter.Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
        matter.Body.setPosition(b, { x, y });
      });
      const up = (e: PointerEvent) => {
        const d = W.drag;
        if (!d || d.i !== i || d.id !== e.pointerId) return;
        W.drag = null;
        el.removeAttribute("data-drag");
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
        if (!d.moved && e.type === "pointerup") pick(i);
      };
      on(el, "pointerup", up);
      on(el, "pointercancel", up);
      on(el, "click", (e) => {
        if (!W.live || e.detail === 0) pick(i);
      });
    });
    if (hoverOK) {
      on(root, "pointerenter", () => set(true));
      on(root, "pointerleave", () => {
        if (!W.drag) set(false);
      });
    } else {
      on(
        document,
        "pointerdown",
        (e) => {
          if (open && !root.contains(e.target as Node)) set(false);
        },
        { passive: true },
      );
    }
    on(trig, "click", () => set(!open));
    on(root, "keydown", (e) => {
      if (e.key === "Escape" && open) {
        e.stopPropagation();
        set(false);
        trig.focus();
      }
    });

    measure();
    document.fonts.ready.then(() => alive && measure());
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      cleanups.forEach((f) => f());
      stopPhysics();
      window.clearTimeout(popTimer);
      window.clearTimeout(pickTimer);
    };
  }, [faqs, n]);

  return (
    <div className="hv-faqf hv-rv hv-d1">
      <div className="hv-faqf-left">
        <div ref={rootRef} className="hv-ff" data-physics="" style={{ "--ff-n": n } as React.CSSProperties}>
          <div className="hv-ff-items">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                type="button"
                className="hv-ff-item"
                tabIndex={-1}
                aria-hidden="true"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="hv-ff-drift">{f.q}</span>
              </button>
            ))}
          </div>
          <div className="hv-ff-folder">
            <span className="hv-ff-back" aria-hidden="true" />
            <span className="hv-ff-paper" aria-hidden="true" />
            <span className="hv-ff-front" aria-hidden="true">
              <span className="hv-ff-label">{copy.folderLabel}</span>
              <span className="hv-ff-sub">{copy.folderSub}</span>
            </span>
            <button
              type="button"
              className="hv-ff-trigger"
              aria-expanded="false"
              aria-label={`${copy.folderLabel}, ${copy.folderSub}`}
              data-hv-cursor="big"
            />
          </div>
        </div>
      </div>
      <div ref={convRef} className="hv-faqf-conv">
        <span className="hv-ctr">
          {pad2(1)} / {pad2(n)}
        </span>
        <div className="hv-in" aria-live="polite">
          <div className="hv-turn hv-client">
            <span className="hv-who">{copy.clientLabel}</span>
            <p className="hv-q">{faqs[0].q}</p>
          </div>
          <div className="hv-turn hv-us">
            <span className="hv-who">{copy.usLabel}</span>
            <p className="hv-a">{faqs[0].a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
