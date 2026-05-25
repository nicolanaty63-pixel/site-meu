import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "C:/Users/merie/Downloads";
const OUT = "C:/Users/merie/site-meu/public/hero";
mkdirSync(OUT, { recursive: true });

// Portrait source photos -> resized WebP for a fast, sharp hero showcase.
const jobs = [
  { in: "prydumano-design-1Uw-a7Os5rk-unsplash.jpg", out: "hero-kitchen.webp" },
  { in: "alex-tyson-wy01YvgelLM-unsplash.jpg", out: "hero-bathroom.webp" },
  { in: "jonathan-taylor-o_oP1TDxTV4-unsplash.jpg", out: "hero-flooring.webp" },
];

for (const job of jobs) {
  const meta = await sharp(join(SRC, job.in)).metadata();
  await sharp(join(SRC, job.in))
    .rotate() // respect EXIF orientation
    .resize({ width: 1400, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, job.out));
  const info = await sharp(join(OUT, job.out)).metadata();
  console.log(
    `${job.out}  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`,
  );
}
console.log("done");
