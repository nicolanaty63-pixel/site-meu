import Image from "next/image";

/**
 * Brand logo lockup. The gold puzzle-house MARK is the only image
 * (`/logo-mark.png`); the wordmark and the "Simply Perfection" tagline are
 * LIVE TEXT so their typography can be controlled with Tailwind classes.
 *
 * The wordmark is stacked (NICOLLA / CONTRACTORS) so the lockup stays narrow
 * enough to sit beside the nav links. `compact` is the footer variant.
 */
export const LOGO_SRC = "/logo-mark.png";
const MARK_W = 80;
const MARK_H = 80;

export default function Logo({
  priority = false,
  compact = false,
  className = "",
}: {
  priority?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const wordmark = `font-display font-semibold uppercase leading-[1.08] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.45)] ${
    compact
      ? "text-sm tracking-[0.13em]"
      : "text-[13px] tracking-[0.1em] sm:text-[15px] sm:tracking-[0.13em]"
  }`;

  return (
    <span
      className={`inline-flex items-center ${compact ? "gap-2.5" : "gap-2.5 sm:gap-3"} ${className}`}
    >
      <Image
        src={LOGO_SRC}
        alt=""
        width={MARK_W}
        height={MARK_H}
        priority={priority}
        sizes={compact ? "40px" : "48px"}
        className={`${compact ? "h-10" : "h-10 sm:h-12"} w-auto`}
      />
      <span className="flex flex-col items-center">
        <span className={wordmark}>Nicolla</span>
        <span className={wordmark}>Contractors</span>
        {/* Tagline — minimalist architectural styling (live text) */}
        <span className="mt-1.5 text-xs font-light uppercase tracking-widest text-zinc-500">
          Simply Perfection
        </span>
      </span>
    </span>
  );
}
