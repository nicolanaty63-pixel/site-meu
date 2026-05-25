"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, DURATION, VIEWPORT } from "@/components/motion/tokens";

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  scale = false,
  duration = DURATION.base,
  once = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Subtle scale-up entrance. */
  scale?: boolean;
  duration?: number;
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  // ONE consistent transform path (opacity + translate, optional scale), with
  // NO `filter`/`blur` on text. The initial and animate states share the same
  // property set and resolve to an identity resting state (y:0, scale:1), so a
  // property can never get orphaned/stuck — which is what left section headings
  // blurred on mobile (a stranded `filter: blur(12px)`).
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, ...(scale ? { scale: 0.96 } : {}) }}
      whileInView={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once, margin: VIEWPORT.margin }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
