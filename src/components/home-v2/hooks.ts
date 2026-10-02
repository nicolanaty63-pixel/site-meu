"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Shared client hooks for the Home v2 components. All of them are SSR-safe:
 * the server snapshot is the conservative value (motion allowed, no fine
 * pointer, not mobile), and the real value arrives on hydration.
 */

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

/** Live `matchMedia(query).matches`; `serverValue` during SSR/hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** `prefers-reduced-motion: reduce`. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Desktop-class pointer: `(hover: hover) and (pointer: fine)`. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** True once `ref`'s element has crossed `threshold` visibility. Never resets. */
export function useInViewOnce<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0, rootMargin = "0px" }: { threshold?: number; rootMargin?: string } = {},
): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold, rootMargin]);
  return seen;
}
