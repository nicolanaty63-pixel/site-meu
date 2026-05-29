"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeCaption,
  afterCaption,
  className = "",
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  beforeCaption?: string;
  afterCaption?: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);

  // Each side's overlay (image, label, caption) lives inside a wrapper that's
  // clipped to its own visible half — symmetric clip-paths guarantee that the
  // label sitting at a side's far corner never bleeds across the divider.
  const beforeClip = `inset(0 0 0 ${pos}%)`;
  const afterClip = `inset(0 ${100 - pos}% 0 0)`;

  const pillCls =
    "absolute top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur";
  const captionCls =
    "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs text-concrete";

  return (
    <div
      className={`relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl border border-white/10 ${className}`}
    >
      {/* BEFORE side — visible on the right of the divider */}
      <div className="absolute inset-0" style={{ clipPath: beforeClip }}>
        {before}
        <span className={`${pillCls} right-3`}>{beforeLabel}</span>
        {beforeCaption && (
          <div className={`${captionCls} text-right`}>{beforeCaption}</div>
        )}
      </div>

      {/* AFTER side — visible on the left of the divider */}
      <div className="absolute inset-0" style={{ clipPath: afterClip }}>
        {after}
        <span className={`${pillCls} left-3`}>{afterLabel}</span>
        {afterCaption && <div className={captionCls}>{afterCaption}</div>}
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
