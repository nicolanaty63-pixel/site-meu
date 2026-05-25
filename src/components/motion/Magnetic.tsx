"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Subtle "magnetic" pull toward the cursor — a hallmark of high-end agency
 * sites. Kept gentle (small displacement, springy return) so it reads premium
 * rather than gimmicky. No effect on touch / reduced-motion.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.3,
  radius = 90,
}: {
  children: ReactNode;
  className?: string;
  /** 0–1: how strongly the element follows the cursor. */
  strength?: number;
  /** Max displacement in px. */
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    const clamp = (v: number) => Math.max(-radius, Math.min(radius, v));
    mx.set(clamp(dx));
    my.set(clamp(dy));
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
