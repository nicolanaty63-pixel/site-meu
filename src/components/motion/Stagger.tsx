"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, DURATION } from "@/components/motion/tokens";

/** Parent: orchestrates a gentle stagger when scrolled into view. */
export const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// Single, consistent variants — every state resolves to an identity resting
// state (y:0, scale:1) with NO filter, so no property gets orphaned/stuck.
const itemV: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};
const tileV: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

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
      viewport={{ once, amount, margin: "-80px" }}
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
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variant === "tile" ? tileV : itemV}>
      {children}
    </motion.div>
  );
}
