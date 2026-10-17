/**
 * One requestAnimationFrame loop for every per-frame effect on Home.
 *
 * Several independent rAF loops all serialise into the same frame anyway; one
 * loop makes the order explicit (lower priority number runs first) and makes
 * "nothing runs when nothing moves" verifiable: the loop starts with the first
 * subscriber, stops with the last, and pauses while the tab is hidden.
 * Subscribers keep their own gating (IntersectionObserver, reduced motion) and
 * unsubscribe as soon as they have nothing to animate.
 */
type Tick = (now: number, dt: number) => void;
type Entry = { fn: Tick; priority: number };

const entries: Entry[] = [];
let raf = 0;
let last = 0;
let hiddenHooked = false;

const frame = (now: number) => {
  raf = 0;
  const dt = last ? Math.min(100, now - last) : 16;
  last = now;
  // copy: a subscriber may unsubscribe itself (or others) while we iterate
  for (const e of entries.slice()) e.fn(now, dt);
  if (entries.length && !document.hidden) raf = requestAnimationFrame(frame);
};

const start = () => {
  if (!raf && entries.length && !document.hidden) {
    last = 0;
    raf = requestAnimationFrame(frame);
  }
};

const onVisibility = () => {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
  } else start();
};

/** Run `fn` every frame until `unsubscribe(fn)`. Lower `priority` runs earlier. */
export function subscribe(fn: Tick, priority = 0): () => void {
  if (!entries.some((e) => e.fn === fn)) {
    entries.push({ fn, priority });
    entries.sort((a, b) => a.priority - b.priority);
  }
  if (!hiddenHooked) {
    hiddenHooked = true;
    document.addEventListener("visibilitychange", onVisibility);
  }
  start();
  return () => unsubscribe(fn);
}

export function unsubscribe(fn: Tick): void {
  const i = entries.findIndex((e) => e.fn === fn);
  if (i !== -1) entries.splice(i, 1);
  if (!entries.length) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

/** True while at least one effect is ticking (used by the verification scripts). */
export function isTicking(): boolean {
  return raf !== 0;
}

/** How many effects are subscribed right now (used by the verification scripts). */
export function subscriberCount(): number {
  return entries.length;
}
