"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useIsMobile } from "@/components/motion/useIsMobile";

/**
 * A clipping fill layer that gently parallaxes its children as the page
 * scrolls. Drop it inside a `relative overflow-hidden` box (it positions
 * itself absolutely to fill the parent). The inner layer is oversized so the
 * translation never reveals an edge. Honours prefers-reduced-motion.
 */
export default function ParallaxImage({
  children,
  className = "",
  amount = 12,
}: {
  children: ReactNode;
  className?: string;
  /** Peak travel as a % of the layer height (kept < 15 to avoid edge gaps). */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Scroll-linked transforms are the main cause of mobile scroll-jank, so the
  // parallax is held static on phones / reduced-motion (image just sits still).
  const disabled = reduce || isMobile;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? ["0%", "0%"] : [`-${amount}%`, `${amount}%`],
  );

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
