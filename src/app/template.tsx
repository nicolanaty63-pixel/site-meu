"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/motion/tokens";

/**
 * Page-transition wrapper. `template.tsx` re-mounts on every navigation (unlike
 * layout), so each route fades up gently — a polished, studio-grade transition.
 * Transform-only (opacity + y) so it never reflows or breaks the hero's offset,
 * and fully skipped for reduced-motion users.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
