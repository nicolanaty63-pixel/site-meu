import Icon from "@/components/ui/Icon";
import type { IconName } from "@/lib/data";

const tints = [
  "from-zinc-700/40 via-zinc-900/20 to-transparent",
  "from-amber-700/25 via-zinc-900/10 to-transparent",
  "from-stone-600/35 via-zinc-900/15 to-transparent",
  "from-neutral-700/35 via-zinc-900/10 to-transparent",
  "from-yellow-800/25 via-zinc-900/15 to-transparent",
  "from-zinc-600/35 via-zinc-900/10 to-transparent",
];

type Props = {
  label?: string;
  caption?: string;
  variant?: number;
  icon?: IconName;
  tone?: "default" | "before" | "after";
  className?: string;
};

/**
 * Tasteful placeholder for project imagery. Designed to look intentional
 * (dark concrete + gold accent) so the layout reads as premium before real
 * photography is dropped in. Swap for <Image/> when assets are available.
 */
export default function Photo({
  label,
  caption,
  variant = 0,
  icon = "build",
  tone = "default",
  className = "",
}: Props) {
  const tint = tints[variant % tints.length];
  const grayscale = tone === "before" ? "grayscale" : "";

  return (
    <div
      className={`surface-concrete relative h-full w-full overflow-hidden ${grayscale} ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${tint}`} />
      {/* fine architectural lines */}
      <div className="bg-grid absolute inset-0 opacity-40" />
      {/* watermark icon */}
      <div className="absolute inset-0 grid place-items-center">
        <Icon name={icon} className="h-16 w-16 text-white/10" />
      </div>
      {tone !== "default" && (
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
          {tone}
        </span>
      )}
      {(label || caption) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {label && (
            <div className="text-sm font-semibold text-white">{label}</div>
          )}
          {caption && (
            <div className="text-xs text-concrete">{caption}</div>
          )}
        </div>
      )}
    </div>
  );
}
