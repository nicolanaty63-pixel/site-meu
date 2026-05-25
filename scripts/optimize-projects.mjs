import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Project gallery imagery for Nicolla Contractors.
// Same cover-crop / WebP treatment as the hero/about/services scripts so every
// photo shares one cohesive brand tone (the <Photo> component also applies the
// global warm grade on top). Missing sources are skipped, so you can re-run
// this after dropping in a newly generated photo without errors.
const SRC = "C:/Users/merie/Downloads";
const OUT = "C:/Users/merie/site-meu/public/projects";
mkdirSync(OUT, { recursive: true });

// Spa-Style Master Bathroom (span card -> 4:5; modal slider -> 16:9 aspect-video).
const jobs = [
  // Slider AFTER + gallery card both use this 16:9 frame (whole room, uncropped).
  { in: "alex-tyson-HoLDkpTD4LU-unsplash.jpg", out: "spa-bathroom-after.webp", w: 1920, h: 1080 },
  // Slider BEFORE — generate the "same room, pre-renovation" photo externally
  // (see the img2img brief), save the source into Downloads with this exact
  // name, then re-run `node scripts/optimize-projects.mjs`.
  { in: "spa-bathroom-before-src.jpg", out: "spa-bathroom-before.webp", w: 1920, h: 1080 },
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
    .modulate({ saturation: 0.95 }) // keep cohesive with the other photos
    .webp({ quality: 82 })
    .toFile(join(OUT, job.out));
  const info = await sharp(join(OUT, job.out)).metadata();
  console.log(`${job.out}  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`);
}
console.log("done");
