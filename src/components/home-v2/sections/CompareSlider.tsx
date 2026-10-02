"use client";

import { useRef } from "react";
import Image from "next/image";

type Side = { src: string; alt: string; tag: string; caption: string };

/**
 * Before/after slider (spec §4.9): a native range input laid over the
 * photos drives the two clip-paths and the gold divider — written straight
 * to the DOM on input (no re-render per frame). Keyboard-accessible via the
 * range input itself.
 */
export default function CompareSlider({ before, after, label }: { before: Side; after: Side; label: string }) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const set = (v: number) => {
    if (beforeRef.current) beforeRef.current.style.clipPath = `inset(0 0 0 ${v}%)`;
    if (afterRef.current) afterRef.current.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    if (divRef.current) divRef.current.style.left = `${v}%`;
  };

  return (
    <div className="hv-lv-ba-slider">
      <div ref={beforeRef} className="hv-lv-ba-side" style={{ clipPath: "inset(0 0 0 50%)" }}>
        <Image src={before.src} alt={before.alt} fill sizes="(max-width: 1023px) 92vw, 540px" quality={90} className="hv-ph" />
        <div className="hv-wash" />
        <span className="hv-lv-tag hv-r">{before.tag}</span>
        <div className="hv-lv-ba-cap hv-r">{before.caption}</div>
      </div>
      <div ref={afterRef} className="hv-lv-ba-side" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <Image src={after.src} alt={after.alt} fill sizes="(max-width: 1023px) 92vw, 540px" quality={90} className="hv-ph" />
        <div className="hv-wash" />
        <span className="hv-lv-tag hv-l">{after.tag}</span>
        <div className="hv-lv-ba-cap">{after.caption}</div>
      </div>
      <div ref={divRef} className="hv-lv-ba-div" style={{ left: "50%" }}>
        <div className="hv-lv-ba-handle" aria-hidden="true">
          ↔
        </div>
      </div>
      <input
        type="range"
        className="hv-lv-ba-range"
        min={0}
        max={100}
        defaultValue={50}
        aria-label={label}
        onInput={(e) => set(Number(e.currentTarget.value))}
      />
    </div>
  );
}
