"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, DURATION } from "@/components/motion/tokens";
import { useIsMobile } from "@/components/motion/useIsMobile";

/** Parent: orchestrates a gentle stagger when scrolled into view. */
export const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemV = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
});

const tileV = (y: number): Variants => ({
  hidden: { opacity: 0, y, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
});

export function Stagger({
  children,
  className = "",
  once = true,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
  /** Fraction of the element that must be visible before animating. */
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={containerV}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  variant = "item",
}: {
  children: ReactNode;
  className?: string;
  variant?: "item" | "tile";
}) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduce) return <div className={className}>{children}</div>;

  const y = isMobile ? 16 : variant === "tile" ? 34 : 28;
  const variants = variant === "tile" ? tileV(y) : itemV(y);

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
