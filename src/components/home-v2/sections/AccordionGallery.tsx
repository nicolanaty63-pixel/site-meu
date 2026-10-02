"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type GalleryItem = { title: string; meta: string; href: string; image: string };

const RATIO = 0.52;
const TILT = 8;
const PARALLAX = 0.5;
const GAP = 10;
const DEFAULT_INDEX = 2;

/**
 * AccordionGallery (React Bits, spec §4.8): the open panel takes .52 of the
 * row; the others are tilted 8°, grayscale under a 35% navy veil, their
 * image drifting with the parallax. Hover opens (mouse), first tap opens /
 * second tap follows the link (touch), focus and arrow keys work too.
 * Vertical strips ≤640px.
 */
export default function AccordionGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // Was the pressed panel already open when the pointer went down? (Focus
  // fires before click and would otherwise make every first tap navigate.)
  const openAtDown = useRef<boolean | null>(null);
  const [active, setActive] = useState(Math.min(DEFAULT_INDEX, items.length - 1));
  const [media, setMedia] = useState(320);
  const n = items.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const vertical = window.matchMedia("(max-width: 640px)");
    const measure = () => {
      const r = root.getBoundingClientRect();
      const total = vertical.matches ? r.height : r.width;
      const usable = Math.max(total - GAP * (n - 1), 120);
      setMedia(Math.max(140, usable * RATIO * 1.22));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [n]);

  const hoverable = () => window.matchMedia("(hover: hover)").matches;

  return (
    <div
      ref={rootRef}
      className="hv-ag"
      role="group"
      aria-label={label}
      style={
        { "--ag-media": `${media.toFixed(0)}px`, "--grow": ((RATIO * (n - 1)) / (1 - RATIO)).toFixed(3) } as React.CSSProperties
      }
    >
      {items.map((it, i) => {
        const on = i === active;
        const rot = on ? 0 : i < active ? TILT : -TILT;
        const drift = Math.max(-1.5, Math.min(1.5, active - i));
        const shift = on ? 0 : drift * PARALLAX * media * 0.06;
        return (
          <Link
            key={it.title}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            href={it.href}
            className={`hv-ag-panel${on ? " hv-on" : ""}`}
            aria-label={`${it.title} — ${it.meta}`}
            aria-current={on ? "true" : undefined}
            style={{ "--rot": `${rot}deg` } as React.CSSProperties}
            onPointerEnter={() => {
              if (hoverable()) setActive(i);
            }}
            onPointerDown={() => {
              openAtDown.current = i === active;
            }}
            onFocus={() => setActive(i)}
            onClick={(e) => {
              const wasOpen = openAtDown.current ?? i === active;
              openAtDown.current = null;
              if (!wasOpen) {
                e.preventDefault();
                setActive(i);
              }
            }}
            onKeyDown={(e) => {
              let next = -1;
              if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
              else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
              if (next < 0) return;
              e.preventDefault();
              setActive(next);
              panelRefs.current[next]?.focus();
            }}
          >
            <span className="hv-ag-frame">
              <span
                className="hv-ag-media"
                style={{ "--sx": `${shift.toFixed(1)}px`, "--sy": `${shift.toFixed(1)}px` } as React.CSSProperties}
              >
                <Image
                  src={it.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 720px"
                  style={{ objectFit: "cover" }}
                />
              </span>
              <span className="hv-ag-overlay" />
            </span>
            <span className="hv-ag-label">
              <span className="hv-ag-bar" />
              <span className="hv-ag-text">
                <b>{it.title}</b>
                <small>{it.meta}</small>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
