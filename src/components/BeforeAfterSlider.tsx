"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export default function BeforeAfterSlider({
  before,
  after,
  className = "",
}: {
  before: ReactNode;
  after: ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div
      className={`relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl border border-white/10 ${className}`}
    >
      <div className="absolute inset-0">{before}</div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {after}
      </div>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px -translate-x-1/2 bg-gold"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-ink text-gold shadow-lg">
          <span className="text-sm">↔</span>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
