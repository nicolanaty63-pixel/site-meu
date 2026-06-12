"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/components/motion/tokens";
import useReducedMotionSafe from "@/components/motion/useReducedMotionSafe";

/**
 * Page-transition wrapper. `template.tsx` re-mounts on every navigation (unlike
 * layout), so each route fades up gently — a polished, studio-grade transition.
 * Transform-only (opacity + y) so it never reflows or breaks the hero's offset,
 * and fully skipped for reduced-motion users.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotionSafe();
  if (reduce) return <>{children}</>;

  // Opacity-only: no transform on the page wrapper, so text is never rasterized
  // through a transformed ancestor (which softens it on high-DPI mobile).
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
