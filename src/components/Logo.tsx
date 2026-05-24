import Image from "next/image";

/**
 * Brand logo — single source of truth for the company's visual identity.
 *
 * To use your real artwork: replace `public/logo-nicolla.webp` with your file.
 * - Keep the same filename (logo-nicolla.webp) for zero code changes, OR
 * - Update LOGO_SRC / dimensions below if you use a different file or format.
 *
 * The image keeps its aspect ratio (height is fixed via className, width auto),
 * so it never stretches. If your real logo has different proportions, update
 * LOGO_WIDTH / LOGO_HEIGHT to match it.
 */
export const LOGO_SRC = "/logo-nicolla-mark.png";

// Intrinsic dimensions of the artwork (used for aspect ratio).
const LOGO_WIDTH = 362;
const LOGO_HEIGHT = 367;

export default function Logo({
  className = "h-9 w-auto",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Nicolla Contractors Ltd"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}
