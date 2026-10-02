"use client";

import { useEffect } from "react";
import "../styles/reveal.css";

/**
 * Below-the-fold reveals (spec 4.17). Server-rendered sections opt in with
 * `className="hv-rv"` (+ `hv-d1`…`hv-d4` for the .12s stagger); this single
 * observer adds `hv-in` once each element is 12% visible. A MutationObserver
 * picks up elements that mount later (lazy, client-only sections).
 * Reduced motion and no-JS are handled in reveal.css.
 */
export default function RevealObserver() {
  useEffect(() => {
    const roots = [...document.querySelectorAll(".hv2")];
    if (!roots.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("hv-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      for (const root of roots)
        root.querySelectorAll(".hv-rv:not(.hv-in)").forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          io.observe(el);
        });
    };
    scan();
    const mo = new MutationObserver(scan);
    for (const root of roots) mo.observe(root, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
