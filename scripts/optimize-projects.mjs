import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Project gallery imagery for Nicolla Contractors.
// Same cover-crop / WebP treatment as the hero/about/services scripts so every
// photo shares one cohesive brand tone (the <Photo> component also applies the
// global warm grade on top). Missing sources are skipped, so you can re-run
// this after dropping in a newly generated photo without errors.
const SRC = "C:/Users/merie/Downloads";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/projects");
mkdirSync(OUT, { recursive: true });

// Spa-Style Master Bathroom (span card -> 4:5; modal slider -> 16:9 aspect-video).
// 2560×1440 (16:9) at high quality so next/image has a crisp retina-grade
// source for the full-width modal slider; the <Photo> grade adds brand tone.
const jobs = [
  // Spa-Style Master Bathroom — landscape source -> 16:9 (card + modal hero).
  { in: "alex-tyson-HoLDkpTD4LU-unsplash.jpg", out: "spa-bathroom-after.webp", w: 2560, h: 1440 },
  // Minimalist Guest Bathroom — portrait source kept as a 4:5 editorial frame
  // (span card + centred portrait hero) so the focal point isn't cropped.
  { in: "point3d-commercial-imaging-ltd-krQbRzuJke0-unsplash.jpg", out: "guest-bathroom-after.webp", w: 1600, h: 2000 },
  // Warm Laminate Living Space — landscape source -> 16:9 (wideCard + modal).
  // Open-plan living/dining/kitchen with the wood-effect laminate as the hero
  // surface; centre crop keeps the sofa-to-dining sweep intact.
  { in: "alex-tyson-VUfe8alBlUo-unsplash.jpg", out: "laminate-living-after.webp", w: 2560, h: 1440 },
  // Luxury Kitchen & Dining Space — landscape source -> 16:9 (wideCard + modal).
  // Open-plan kitchen-diner: round dining table left, marble-waterfall island with
  // bar stools centre/right, herringbone oak floor; centre crop preserves the
  // full dining → island → kitchen sweep.
  { in: "alex-tyson-U-0-AgPDpHk-unsplash.jpg", out: "kitchen-diner-after.webp", w: 2560, h: 1440 },
  // Modern Shaker Kitchen — landscape source -> 16:9 (wideCard + modal).
  // Greige shaker cabinets with glass-front uppers, stainless range + hood,
  // marble splashback, white quartz waterfall island; centre crop keeps the
  // tall pantry → range → fridge symmetry intact.
  { in: "asr-design-studio-CwnPmtA2NHc-unsplash.jpg", out: "shaker-kitchen-after.webp", w: 2560, h: 1440 },
  // Slider BEFORE — generate the "same room, pre-renovation" photo externally
  // (see the img2img brief), save the source into Downloads with this exact
  // name, then re-run `node scripts/optimize-projects.mjs`.
  { in: "spa-bathroom-before-src.jpg", out: "spa-bathroom-before.webp", w: 2560, h: 1440 },
];

for (const job of jobs) {
  const src = join(SRC, job.in);
  if (!existsSync(src)) {
    console.log(`skip (source not found): ${job.in}`);
    continue;
  }
  const meta = await sharp(src).metadata();
  await sharp(src)
    .rotate() // respect EXIF orientation
    .resize({ width: job.w, height: job.h, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 }) // counter downscale softening — keeps edges crisp
    .webp({ quality: 92 })
    .toFile(join(OUT, job.out));
  const info = await sharp(join(OUT, job.out)).metadata();
  console.log(`${job.out}  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`);
}
console.log("done");
