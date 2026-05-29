import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// The logo is rendered at h-48 (192px) on the desktop navbar at most. At dpr=2
// that's a 384px-tall source; the current 362×367 PNG is fine resolution-wise
// for that display, but the file is 97KB because of the PNG encoder. Letting
// next/image optimize it (re-encode to webp/avif, generate retina srcset) is
// the real win — this just keeps the source at a sane upper bound so the
// optimizer never has to scale down a needlessly large image.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "public/logo-nicolla-mark.png");

const meta = await sharp(SRC).metadata();
await sharp(SRC)
  .resize(384, 384, { fit: "inside" }) // preserve aspect; cap longer edge at 384
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(SRC + ".tmp");

// Atomic-ish swap
const fs = await import("node:fs/promises");
await fs.rename(SRC + ".tmp", SRC);

const after = await sharp(SRC).metadata();
console.log(
  `logo-nicolla-mark.png  ${meta.width}x${meta.height} -> ${after.width}x${after.height}`,
);
