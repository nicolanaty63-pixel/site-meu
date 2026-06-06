import Image from "next/image";
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
  /** Real photo path or URL. When set, a real image is shown instead of the placeholder. */
  src?: string;
  alt?: string;
  label?: string;
  caption?: string;
  variant?: number;
  icon?: IconName;
  tone?: "default" | "before" | "after";
  className?: string;
  /** Responsive sizes hint for next/image (improves sharpness on large tiles). */
  sizes?: string;
  /**
   * CSS object-position for the cover crop (e.g. "center 40%"). Lets a specific
   * tile steer its focal point so the crop emphasises the right part of the
   * photo. Omitted = browser default (centred), so existing tiles are unchanged.
   */
  position?: string;
  /** Eager-load + preload for above-the-fold LCP imagery. */
  priority?: boolean;
  /** next/image re-encode quality (default 75). Raise for hero/showcase photos. */
  quality?: number;
};

/**
 * Project imagery. If `src` is provided it renders a real photo (next/image,
 * cover-fit, lazy-loaded). Otherwise it shows a tasteful dark placeholder so
 * the layout always looks intentional. Drop real photos in /public/projects
 * and set the `image` fields in lib/data.ts to go live.
 */
export default function Photo({
  src,
  alt,
  label,
  caption,
  variant = 0,
  icon = "build",
  tone = "default",
  className = "",
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  priority = false,
  quality,
  position,
}: Props) {
  const tint = tints[variant % tints.length];
  // Only desaturate the placeholder for "before"; real photos keep natural colour.
  const grayscale = !src && tone === "before" ? "grayscale" : "";

  return (
    <div
      className={`surface-concrete relative h-full w-full overflow-hidden ${grayscale} ${className}`}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt ?? label ?? "Nicolla Contractors project"}
            fill
            priority={priority}
            quality={quality}
            className="img-grade object-cover"
            style={position ? { objectPosition: position } : undefined}
            sizes={sizes}
          />
          {/* Unified warm brand wash — keeps every photo on one premium tone */}
          <div className="img-grade-wash pointer-events-none absolute inset-0" />
        </>
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${tint}`} />
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 grid place-items-center">
            <Icon name={icon} className="h-16 w-16 text-white/10" />
          </div>
        </>
      )}

      {tone !== "default" && (
        <span className="absolute left-3 top-3 z-10 rounded-full border border-gold/30 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold backdrop-blur">
          {tone}
        </span>
      )}
      {(label || caption) && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4">
          {label && (
            <div className="text-sm font-semibold text-white">{label}</div>
          )}
          {caption && <div className="text-xs text-concrete">{caption}</div>}
        </div>
      )}
    </div>
  );
}
