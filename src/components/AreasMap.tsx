"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT, VIEWPORT } from "@/components/motion/tokens";
import Icon from "@/components/ui/Icon";
import { areas } from "@/lib/areas";
import { site } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* Geometry — real WGS84 town coordinates, equirectangular projection. */
/* The viewBox aspect matches the km aspect of the bounds, so the      */
/* horizontal and vertical scales are equal and the distance rings are */
/* true to scale.                                                      */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 806;
const BOUNDS = { latMin: 51.53, latMax: 51.88, lngMin: -0.66, lngMax: 0.04 };
// ~69.0 km per degree of longitude at this latitude; 111.2 km per degree of latitude.
const KM_PER_UNIT = ((BOUNDS.lngMax - BOUNDS.lngMin) * 69.0) / VB_W;

type LabelSide = "top" | "bottom" | "left" | "right";

type Town = {
  slug: string;
  lat: number;
  lng: number;
  /** Short tooltip line, condensed from the area page intro. */
  blurb: string;
  labelSide: LabelSide;
  tipBelow?: boolean;
  tipAlign?: "left" | "right";
  base?: boolean;
};

const TOWNS: Town[] = [
  {
    slug: "kings-langley",
    lat: 51.712,
    lng: -0.452,
    blurb: "Our home town — where it all started, and still our base today.",
    labelSide: "left",
    base: true,
  },
  {
    slug: "watford",
    lat: 51.656,
    lng: -0.397,
    blurb: "Premium bathroom & kitchen renovations, tiling and flooring.",
    labelSide: "left",
  },
  {
    slug: "st-albans",
    lat: 51.755,
    lng: -0.336,
    blurb: "Spa-style bathrooms, bespoke kitchens and flawless flooring.",
    labelSide: "right",
  },
  {
    slug: "hemel-hempstead",
    lat: 51.753,
    lng: -0.449,
    blurb: "Bathrooms, kitchens, tiling and flooring — clean, punctual, premium.",
    labelSide: "top",
  },
  {
    slug: "rickmansworth",
    lat: 51.638,
    lng: -0.473,
    blurb: "Bathrooms, kitchens and floors with meticulous attention to detail.",
    labelSide: "bottom",
  },
  {
    slug: "berkhamsted",
    lat: 51.76,
    lng: -0.563,
    blurb: "Luxury bathrooms, kitchens, tiling and flooring with a flawless finish.",
    labelSide: "top",
    tipAlign: "left",
  },
  {
    slug: "bushey",
    lat: 51.645,
    lng: -0.36,
    blurb: "Precision tiling, flooring and premium bathroom & kitchen renovations.",
    labelSide: "bottom",
  },
  {
    slug: "harpenden",
    lat: 51.817,
    lng: -0.357,
    blurb: "Bespoke kitchens, spa-style bathrooms and engineered flooring.",
    labelSide: "top",
    tipBelow: true,
  },
  {
    slug: "radlett",
    lat: 51.685,
    lng: -0.318,
    blurb: "Luxury home renovations — from single rooms to full refurbishments.",
    labelSide: "right",
  },
  {
    slug: "north-london",
    lat: 51.575,
    lng: -0.14,
    blurb: "Expert renovations, tiling and flooring across North London.",
    labelSide: "top",
    tipAlign: "right",
  },
];

function project(lat: number, lng: number) {
  return {
    x: ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * VB_W,
    y: ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * VB_H,
  };
}

// Join with lib/areas so names/counties stay in sync with the SEO pages.
// `!` is safe: every slug above must exist in lib/areas — a missing one
// fails the static build immediately rather than shipping silently.
const MAP_AREAS = TOWNS.map((t) => {
  const a = areas.find((x) => x.slug === t.slug)!;
  return { ...t, name: a.name, county: a.county, ...project(t.lat, t.lng) };
});

const BASE_TOWN = MAP_AREAS.find((t) => t.base)!;

// Constellation lines derived from each area's real `nearby` relations.
const slugByName = new Map(areas.map((a) => [a.name, a.slug]));
const pointBySlug = new Map(MAP_AREAS.map((t) => [t.slug, t]));
const LINKS: { a: { x: number; y: number }; b: { x: number; y: number }; key: string }[] = [];
{
  const seen = new Set<string>();
  for (const area of areas) {
    for (const n of area.nearby) {
      const other = slugByName.get(n);
      if (!other) continue;
      const key = [area.slug, other].sort().join("--");
      const a = pointBySlug.get(area.slug);
      const b = pointBySlug.get(other);
      if (!a || !b || seen.has(key)) continue;
      seen.add(key);
      LINKS.push({ a, b, key });
    }
  }
}

const LABEL_POS: Record<LabelSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-2 text-right",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

/* ------------------------------------------------------------------ */
/* Entrance variants — one IntersectionObserver on the root, children  */
/* inherit the "show" trigger and time themselves with explicit delays.*/
/* ------------------------------------------------------------------ */

const rootV: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};
const ringV: Variants = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { duration: 1.1, delay: 0.25 + i * 0.15, ease: EASE_OUT },
  }),
};
const lineV: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, delay: 0.35 + i * 0.045, ease: EASE_OUT },
  }),
};
const markerV: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.55, delay: 0.6 + i * 0.07, ease: EASE_OUT },
  }),
};
const asideV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25, ease: EASE_OUT } },
};

export default function AreasMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const ring10 = 10 / KM_PER_UNIT;
  const ring20 = 20 / KM_PER_UNIT;

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT}
      variants={rootV}
      className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-center lg:gap-14"
      onMouseLeave={() => setActive(null)}
    >
      {/* ---- Map panel ---- */}
      <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-charcoal/60">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(49,58,82,0.22),transparent_55%)]" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block h-auto w-full" aria-hidden="true">
          <defs>
            <radialGradient id="am-glow-gold">
              <stop offset="0%" stopColor="rgba(200, 162, 76, 0.13)" />
              <stop offset="100%" stopColor="rgba(200, 162, 76, 0)" />
            </radialGradient>
            <radialGradient id="am-glow-navy">
              <stop offset="0%" stopColor="rgba(63, 74, 107, 0.35)" />
              <stop offset="100%" stopColor="rgba(63, 74, 107, 0)" />
            </radialGradient>
            <pattern id="am-grid" width="62.5" height="62.5" patternUnits="userSpaceOnUse">
              <path d="M 62.5 0 H 0 V 62.5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width={VB_W} height={VB_H} fill="url(#am-grid)" />
          <circle cx={820} cy={110} r={320} fill="url(#am-glow-navy)" />
          <circle cx={BASE_TOWN.x} cy={BASE_TOWN.y} r={330} fill="url(#am-glow-gold)" />

          {/* True-to-scale distance rings around our base */}
          {[ring10, ring20].map((r, i) => (
            <motion.circle
              key={r}
              custom={i}
              variants={ringV}
              cx={BASE_TOWN.x}
              cy={BASE_TOWN.y}
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="3 7"
            />
          ))}
          <motion.text
            custom={2}
            variants={ringV}
            x={BASE_TOWN.x}
            y={BASE_TOWN.y - ring10 - 10}
            textAnchor="middle"
            fontSize="11"
            letterSpacing="0.12em"
            fill="rgba(255,255,255,0.28)"
          >
            10 KM
          </motion.text>
          <motion.text
            custom={2}
            variants={ringV}
            x={BASE_TOWN.x + ring20 + 14}
            y={BASE_TOWN.y + 4}
            fontSize="11"
            letterSpacing="0.12em"
            fill="rgba(255,255,255,0.28)"
          >
            20 KM
          </motion.text>

          {/* Constellation lines between neighbouring service areas */}
          {LINKS.map((l, i) => (
            <motion.line
              key={l.key}
              custom={i}
              variants={lineV}
              x1={l.a.x}
              y1={l.a.y}
              x2={l.b.x}
              y2={l.b.y}
              stroke="rgba(200, 162, 76, 0.16)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* ---- Interactive markers (real links to each area page) ---- */}
        <div className="absolute inset-0">
          {MAP_AREAS.map((t, i) => {
            const isActive = active === t.slug;
            const tipAlign =
              t.tipAlign === "left"
                ? "-left-3"
                : t.tipAlign === "right"
                  ? "-right-3"
                  : "left-1/2 -translate-x-1/2";
            return (
              <Link
                key={t.slug}
                href={`/areas/${t.slug}`}
                aria-label={`Renovations in ${t.name}`}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(t.x / VB_W) * 100}%`, top: `${(t.y / VB_H) * 100}%`, zIndex: isActive ? 30 : 10 }}
                onMouseEnter={() => setActive(t.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.slug)}
                onBlur={() => setActive(null)}
              >
                <motion.span custom={i} variants={markerV} className="relative grid h-9 w-9 place-items-center">
                  {/* Soft radar pulse (desktop only — gated in globals.css) */}
                  <span
                    className="animate-area-pulse absolute h-3 w-3 rounded-full bg-gold/70 opacity-0"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  {t.base && <span className="absolute h-6 w-6 rounded-full border border-gold/40" />}
                  <span
                    className={`relative rounded-full bg-gold-light shadow-[0_0_14px_3px_rgba(200,162,76,0.5)] transition-transform duration-300 ${
                      t.base ? "h-3 w-3" : "h-2 w-2"
                    } ${isActive ? "scale-150" : ""}`}
                  />
                  <span
                    className={`absolute hidden whitespace-nowrap text-[11px] font-medium tracking-wide transition-colors duration-300 sm:block md:text-xs ${
                      LABEL_POS[t.labelSide]
                    } ${isActive ? "text-gold-light" : "text-white/80"}`}
                  >
                    {t.name}
                    {t.base && (
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
                        Our base
                      </span>
                    )}
                  </span>
                </motion.span>

                {/* Hover / focus tooltip (pointer devices) */}
                <span
                  data-tip
                  className={`pointer-events-none absolute hidden w-60 rounded-2xl border border-white/10 bg-[#11162a]/95 p-4 shadow-2xl backdrop-blur-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:block ${
                    t.tipBelow ? "top-[calc(100%+10px)]" : "bottom-[calc(100%+10px)]"
                  } ${tipAlign} ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : `opacity-0 ${t.tipBelow ? "-translate-y-1.5" : "translate-y-1.5"}`
                  }`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {t.county}
                  </span>
                  <span className="mt-1 block font-display text-base font-semibold text-white">{t.name}</span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-concrete">{t.blurb}</span>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-gold-light">
                    Renovations in {t.name}
                    <Icon name="arrow" className="h-3 w-3" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Compass */}
        <div className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[10px] font-semibold tracking-widest text-white/40 sm:right-5 sm:top-5">
          <span className="absolute top-1 h-1 w-px bg-gold/60" />N
        </div>

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-4 left-4 hidden items-center gap-5 text-[11px] text-concrete sm:flex sm:bottom-5 sm:left-5">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_8px_2px_rgba(200,162,76,0.5)]" />
            Service area
          </span>
          <span className="flex items-center gap-2">
            <span className="relative grid h-4 w-4 place-items-center">
              <span className="absolute h-4 w-4 rounded-full border border-gold/40" />
              <span className="h-2 w-2 rounded-full bg-gold-light" />
            </span>
            Our base
          </span>
        </div>

        {/* Caption */}
        <div className="pointer-events-none absolute bottom-4 right-4 hidden text-[10px] uppercase tracking-[0.2em] text-white/25 md:block sm:bottom-5 sm:right-5">
          Hertfordshire &amp; North London · to scale
        </div>
      </div>

      {/* ---- Area index ---- */}
      <motion.div variants={asideV}>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
          <Icon name="pin" className="h-4 w-4" />
          Browse by area
        </div>
        <p className="mt-2 text-sm leading-relaxed text-concrete">
          Based in {site.baseTown}, serving homeowners across Hertfordshire &amp; North London.
        </p>
        <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {MAP_AREAS.map((t) => {
            const isActive = active === t.slug;
            return (
              <li key={t.slug}>
                <Link
                  href={`/areas/${t.slug}`}
                  className="group flex items-center justify-between gap-4 py-3"
                  onMouseEnter={() => setActive(t.slug)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                        isActive ? "bg-gold shadow-[0_0_8px_2px_rgba(200,162,76,0.5)]" : "bg-white/25"
                      }`}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block truncate font-medium transition-colors duration-300 ${
                          isActive ? "text-gold-light" : "text-white"
                        }`}
                      >
                        {t.name}
                      </span>
                      <span className="block text-xs text-concrete-dark">{t.county}</span>
                    </span>
                  </span>
                  <Icon
                    name="arrow"
                    className={`h-4 w-4 shrink-0 text-gold transition-all duration-300 ${
                      isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
}
