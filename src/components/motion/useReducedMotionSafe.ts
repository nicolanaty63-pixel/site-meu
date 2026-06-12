"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe prefers-reduced-motion.
 *
 * framer-motion's `useReducedMotion` reads matchMedia synchronously on the
 * first client render, while the server always renders the "motion" branch.
 * Any component that switches its TREE or style props on the result therefore
 * hydrates different markup for reduced-motion users and throws React #418
 * on every page (verified with `reducedMotion: "reduce"` in the audit).
 *
 * This hook returns false on the server AND the first client render so the
 * markup always matches, then flips after mount — reduced-motion users get
 * the static tree one paint later. Use this (not framer's hook) whenever the
 * result changes what is rendered; framer's hook remains fine for
 * effect-only gating (e.g. pausing a carousel interval).
 */
export default function useReducedMotionSafe() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}
