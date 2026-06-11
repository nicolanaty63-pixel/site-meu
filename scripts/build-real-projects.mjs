import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Real-photography project cards (May 2026 client photo batch).
// Two collages (zellige bathroom, herringbone v2) + three single heroes
// (utility, garden, driveway), all baked to card-ready WebP so they slot
// into the existing card frames untouched. Same treatment as
// build-herringbone-collage.mjs: cover-crop, light sharpen, q92; the
// <Photo> component layers the global warm grade at render time.
const SRC = "C:/Users/merie/Downloads";
const PUB = "C:/Users/merie/site-meu/public";
const OUT = join(PUB, "projects");
mkdirSync(OUT, { recursive: true });

const W = 1600;
const H = 1200;
const G = 14;
const SEAM = { r: 12, g: 12, b: 14 };
const heroW = 1040;
const sideW = W - G - heroW;
const sideH = Math.round((H - G) / 2);

const cover = (path, w, h) =>
  sharp(path)
    .rotate()
    .resize({ width: w, height: h, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .toBuffer();

const collage = async (out, heroPath, topPath, bottomPath, heroSide) => {
  const [hero, top, bottom] = await Promise.all([
    cover(heroPath, heroW, H),
    cover(topPath, sideW, sideH),
    cover(bottomPath, sideW, sideH),
  ]);
  const heroX = heroSide === "right" ? sideW + G : 0;
  const sideX = heroSide === "right" ? 0 : heroW + G;
  await sharp({ create: { width: W, height: H, channels: 3, background: SEAM } })
    .composite([
      { input: hero, left: heroX, top: 0 },
      { input: top, left: sideX, top: 0 },
      { input: bottom, left: sideX, top: sideH + G },
    ])
    .webp({ quality: 92 })
    .toFile(join(OUT, out));
  console.log(`${out}  (collage, hero ${heroSide})`);
};

const single = async (out, path, w, h) => {
  await sharp(path)
    .rotate()
    .resize({ width: w, height: h, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 92 })
    .toFile(join(OUT, out));
  console.log(`${out}  ${w}x${h}`);
};

const wa = (t) => join(SRC, `WhatsApp Image 2026-05-29 at ${t}.jpeg`);
const sources = [
  wa("22.11.04"), wa("22.11.24"), wa("22.11.13"),
  wa("22.29.21"), wa("22.29.21 (1)"), join(SRC, "1h.jpeg"),
  wa("22.16.17 (2)"), wa("22.21.03 (1)"),
  join(PUB, "landscaping-garden-nicolla.jpg"),
];
for (const f of sources) {
  if (!existsSync(f)) {
    console.error(`MISSING source: ${f}`);
    process.exit(1);
  }
}

// Zellige bathroom — hero RIGHT collage.
await collage("zellige-bathroom.webp", wa("22.11.04"), wa("22.11.24"), wa("22.11.13"), "right");

// Singles.
await single("utility-room.webp", wa("22.16.17 (2)"), 1280, 1600); // 4:5 span card
// Driveway: trim the photographer's car bumper out of the bottom-left corner
// (extract keeps exact 4:3 so the final resize is a pure downscale).
await sharp(wa("22.21.03 (1)"))
  .rotate()
  .extract({ left: 480, top: 0, width: 1568, height: 1176 })
  .resize({ width: 1600, height: 1200, fit: "cover", position: "centre" })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 92 })
  .toFile(join(OUT, "driveway-paving.webp"));
console.log("driveway-paving.webp  1600x1200 (bumper cropped)");
await single("garden-transformation.webp", join(PUB, "landscaping-garden-nicolla.jpg"), 1600, 1200);

// Lightbox heroes (afterImage) — without these the modal falls back to the
// placeholder before/after slider. Landscape jobs get 16:9; the utility room
// is a span project so its modal frame is portrait 4:5 (second angle for
// variety against the straight-on card shot).
await single("zellige-bathroom-wide.webp", wa("22.11.04"), 2048, 1152);
await single("utility-room-angle.webp", wa("22.16.17 (1)"), 1280, 1600);
await single("driveway-paving-wide.webp", wa("22.21.03"), 2048, 1152);
// Garden 16:9: trim sky rather than patio (the foreground porcelain is the work).
await sharp(join(PUB, "landscaping-garden-nicolla.jpg"))
  .rotate()
  .extract({ left: 0, top: 180, width: 1600, height: 900 })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 92 })
  .toFile(join(OUT, "garden-transformation-wide.webp"));
console.log("garden-transformation-wide.webp  1600x900 (sky-trimmed)");

console.log("done");
