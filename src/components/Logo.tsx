import Image from "next/image";

/**
 * Brand logo lockup — the single source of truth for the company signature.
 *
 * The gold puzzle-house MARK is the only image (`/logo-mark.png`, isolated
 * from the original badge artwork — the mark itself is unchanged). The
 * wordmark and the "Simply Perfection" tagline are now LIVE TEXT so they stay
 * crisp at every size and can be tuned for legibility on any background —
 * including the transparent navbar over hero photography.
 *
 * The wordmark is stacked (NICOLLA / CONTRACTORS) so the lockup stays narrow
 * enough to sit beside the nav links without crowding, and uses the navbar's
 * generous height. The tagline is a small, wide-tracked gold small-caps line
 * centred beneath the wordmark — a quiet luxury signature.
 *
 * `compact` renders the (slightly smaller) footer variant.
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
  const wordmark = `font-display font-semibold uppercase leading-[1.08] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] ${
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
        // Decorative: the company name is conveyed by the adjacent live text
        // (and the wrapping link's aria-label), so the mark is alt="".
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
        <span
          // Centred beneath the wordmark; the left text-indent offsets the
          // trailing letter-spacing so it sits optically centred.
          className={`mt-1 uppercase text-gold/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] ${
            compact
              ? "text-[8px] tracking-[0.26em] [text-indent:0.26em]"
              : "text-[7.5px] tracking-[0.24em] [text-indent:0.24em] sm:text-[9px] sm:tracking-[0.3em] sm:[text-indent:0.3em]"
          }`}
        >
          Simply Perfection
        </span>
      </span>
    </span>
  );
}
