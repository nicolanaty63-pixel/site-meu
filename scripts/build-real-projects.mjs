import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Real-photography project imagery (May 2026 client photo batch).
// Currently builds the landscaping project's card (4:3) and lightbox hero
// (16:9). Cover-crop, light sharpen, q92 — the <Photo> component layers the
// global warm grade at render time.
const SRC = "C:/Users/merie/Downloads";
const PUB = "C:/Users/merie/site-meu/public";
const OUT = join(PUB, "projects");
mkdirSync(OUT, { recursive: true });

const single = async (out, path, w, h) => {
  await sharp(path)
    .rotate()
    .resize({ width: w, height: h, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 92 })
    .toFile(join(OUT, out));
  console.log(`${out}  ${w}x${h}`);
};

const GARDEN = join(PUB, "landscaping-garden-nicolla.jpg");
if (!existsSync(GARDEN)) {
  console.error(`MISSING source: ${GARDEN}`);
  process.exit(1);
}

await single("garden-transformation.webp", GARDEN, 1600, 1200);

// Lightbox hero (afterImage) — without it the modal falls back to the
// placeholder before/after slider. 16:9 with the sky trimmed rather than the
// patio (the foreground porcelain is the work).
await sharp(GARDEN)
  .rotate()
  .extract({ left: 0, top: 180, width: 1600, height: 900 })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 92 })
  .toFile(join(OUT, "garden-transformation-wide.webp"));
console.log("garden-transformation-wide.webp  1600x900 (sky-trimmed)");

console.log("done");
