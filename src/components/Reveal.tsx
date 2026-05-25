"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, DURATION, VIEWPORT } from "@/components/motion/tokens";
import { useIsMobile } from "@/components/motion/useIsMobile";

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = false,
  scale = false,
  duration = DURATION.base,
  once = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  /** Soft de-blur entrance (desktop only — skipped on mobile for performance). */
  blur?: boolean;
  /** Subtle scale-up entrance. */
  scale?: boolean;
  duration?: number;
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduce) return <div className={className}>{children}</div>;

  // Gentler, snappier motion on phones; blur filters are dropped (costly on GPU).
  const travel = isMobile ? Math.min(y, 16) : y;
  const useBlur = blur && !isMobile;
  const dur = isMobile ? Math.max(0.45, duration - 0.2) : duration;

  const hidden = {
    opacity: 0,
    y: travel,
    ...(scale ? { scale: 0.96 } : {}),
    ...(useBlur ? { filter: "blur(12px)" } : {}),
  };
  const shown = {
    opacity: 1,
    y: 0,
    ...(scale ? { scale: 1 } : {}),
    ...(useBlur ? { filter: "blur(0px)" } : {}),
  };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once, margin: VIEWPORT.margin }}
      transition={{ duration: dur, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
