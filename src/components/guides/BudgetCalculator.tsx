"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Pricing model.                                                      */
/*                                                                     */
/* Base ranges are indexed by project SIZE and mirror the published    */
/* cost-guide tables in src/lib/guides.ts (same figures a visitor sees */
/* one click deeper — the two surfaces must never disagree). Quality   */
/* applies a multiplier on top: Standard x1, Premium x1.25, Luxury     */
/* x1.55, rounded to the nearest £500. All output is explicitly        */
/* "indicative" — same hedging as the guides; never a fixed price.     */
/* ------------------------------------------------------------------ */

type Range = { min: number; max: number | null };

type ProjectType = {
  key: string;
  label: string;
  icon: IconName;
  /** [small, medium, large] base ranges at Standard quality. */
  base: [Range, Range, Range];
  /** Slug of the matching cost guide, when one exists. */
  guideSlug?: string;
  guideLabel?: string;
};

const TYPES: ProjectType[] = [
  {
    key: "bathroom",
    label: "Bathroom Renovation",
    icon: "bath",
    base: [
      { min: 5000, max: 8000 },
      { min: 8000, max: 15000 },
      { min: 15000, max: null },
    ],
    guideSlug: "bathroom-renovation-cost-uk",
    guideLabel: "bathroom cost guide",
  },
  {
    key: "kitchen",
    label: "Kitchen Renovation",
    icon: "kitchen",
    base: [
      { min: 8000, max: 15000 },
      { min: 15000, max: 30000 },
      { min: 30000, max: null },
    ],
    guideSlug: "kitchen-renovation-cost-uk",
    guideLabel: "kitchen cost guide",
  },
  {
    key: "flooring",
    label: "Flooring",
    icon: "plank",
    base: [
      { min: 1500, max: 5000 },
      { min: 5000, max: 10000 },
      { min: 10000, max: null },
    ],
    guideSlug: "flooring-installation-cost-uk",
    guideLabel: "flooring cost guide",
  },
  {
    key: "refurbishment",
    label: "Home Refurbishment",
    icon: "extension",
    // Anchored to the whole-house guide: cosmetic refresh £500–£900/sqm
    // (~£25k–£45k small home, ~£45k–£90k at 100 sqm); larger scopes step
    // into strip-out territory.
    base: [
      { min: 25000, max: 45000 },
      { min: 45000, max: 90000 },
      { min: 90000, max: null },
    ],
    guideSlug: "home-refurbishment-cost-uk",
    guideLabel: "refurbishment cost guide",
  },
  {
    key: "landscaping",
    label: "Landscaping",
    icon: "landscape",
    base: [
      { min: 2000, max: 8000 },
      { min: 8000, max: 20000 },
      { min: 20000, max: null },
    ],
  },
  {
    key: "driveway",
    label: "Driveway",
    icon: "paving",
    base: [
      { min: 3000, max: 10000 },
      { min: 10000, max: 20000 },
      { min: 20000, max: null },
    ],
  },
];

const SIZES = ["Small", "Medium", "Large"] as const;
const QUALITY = [
  { label: "Standard", mult: 1 },
  { label: "Premium", mult: 1.25 },
  { label: "Luxury", mult: 1.55 },
] as const;

const round500 = (v: number) => Math.round(v / 500) * 500;
const gbp = (v: number) => `£${v.toLocaleString("en-GB")}`;

function estimate(type: ProjectType, size: number, quality: number): Range {
  const base = type.base[size];
  const mult = QUALITY[quality].mult;
  return {
    min: round500(base.min * mult),
    max: base.max === null ? null : round500(base.max * mult),
  };
}

/** Imperative count-up (rAF + textContent, zero re-renders per frame —
 *  same discipline as Counter.tsx). ≤300ms, ease-out, snaps for
 *  prefers-reduced-motion. */
function useCountUp(value: number, suffix: string) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = gbp(value) + suffix;
      return;
    }
    const duration = 250;
    const from = Math.max(0, value * 0.5);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent =
        gbp(Math.round((from + (value - from) * eased) / 100) * 100) +
        (t === 1 ? suffix : "");
      if (t < 1) raf = requestAnimationFrame(tick);
      else node.textContent = gbp(value) + suffix;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, suffix]);
  return ref;
}

function Amount({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useCountUp(value, suffix);
  // Server-renders the final value so the markup is meaningful without JS
  return <span ref={ref}>{gbp(value) + suffix}</span>;
}

function OptionButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-gold bg-gold/10 text-white shadow-[0_0_20px_-6px_rgba(200,162,76,0.45)]"
          : "border-white/10 bg-surface/40 text-concrete hover:border-white/30 hover:text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function BudgetCalculator() {
  const [typeKey, setTypeKey] = useState(TYPES[0].key);
  const [size, setSize] = useState(1); // Medium default
  const [quality, setQuality] = useState(0);

  const type = TYPES.find((t) => t.key === typeKey)!;
  const { min, max } = estimate(type, size, quality);

  return (
    <div className="glass-strong overflow-hidden rounded-3xl border border-white/10">
      <div className="grid lg:grid-cols-[1.25fr_1fr]">
        {/* ---- Controls ---- */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div role="group" aria-labelledby="calc-type-label">
            <p
              id="calc-type-label"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-gold"
            >
              Project type
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {TYPES.map((t) => (
                <OptionButton
                  key={t.key}
                  selected={t.key === typeKey}
                  onClick={() => setTypeKey(t.key)}
                  className="flex flex-col items-start gap-2 !p-4 text-left"
                >
                  <Icon
                    name={t.icon}
                    className={`h-5 w-5 ${t.key === typeKey ? "text-gold" : "text-concrete-dark"}`}
                  />
                  <span className="leading-tight">{t.label}</span>
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="mt-7" role="group" aria-labelledby="calc-size-label">
            <p
              id="calc-size-label"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-gold"
            >
              Project size
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {SIZES.map((s, i) => (
                <OptionButton key={s} selected={size === i} onClick={() => setSize(i)}>
                  {s}
                </OptionButton>
              ))}
            </div>
          </div>

          <div className="mt-7" role="group" aria-labelledby="calc-quality-label">
            <p
              id="calc-quality-label"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-gold"
            >
              Quality level
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {QUALITY.map((q, i) => (
                <OptionButton key={q.label} selected={quality === i} onClick={() => setQuality(i)}>
                  {q.label}
                </OptionButton>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Result ---- */}
        <div className="relative border-t border-white/10 bg-gradient-to-br from-gold/[0.12] via-charcoal/60 to-charcoal/60 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.04]" />
          <div
            // Re-mounts on every selection change so the 250ms fade+scale
            // entrance replays (transform/opacity only, no spring).
            key={`${typeKey}-${size}-${quality}`}
            className="animate-calc-in relative flex h-full flex-col"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Estimated budget
            </p>
            <p className="mt-4 font-display text-4xl font-extrabold leading-tight text-gold-gradient sm:text-5xl">
              {max === null ? (
                <Amount value={min} suffix="+" />
              ) : (
                <>
                  <Amount value={min} />
                  <span className="px-1 text-2xl text-white/40 sm:text-3xl">–</span>
                  <Amount value={max} />
                </>
              )}
            </p>
            <p className="mt-3 text-sm text-concrete">
              {type.label} · {SIZES[size]} · {QUALITY[quality].label} finish
            </p>
            <p className="mt-4 text-xs leading-relaxed text-concrete-dark">
              Indicative 2026 range based on our published cost guides and real
              project costs across Hertfordshire. Every home is different — a
              fixed price needs a proper site visit.
            </p>
            <div className="mt-auto pt-6">
              <Link
                href="/contact"
                className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition-transform duration-200 hover:scale-[1.02]"
              >
                Request an Accurate Quote
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              {type.guideSlug && (
                <Link
                  href={`/guides/${type.guideSlug}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-gold transition-colors duration-200 hover:text-gold-light"
                >
                  Read the full {type.guideLabel}
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
