import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

// Uniform 4:3 cards for the premium services grid. Slight desaturation keeps
// the four photos cohesive against the dark brand palette.
const SRC = "C:/Users/merie/Downloads";
const OUT = "C:/Users/merie/site-meu/public/services";
mkdirSync(OUT, { recursive: true });

const jobs = [
  { in: "lisa-anna-yhodTxZQQxw-unsplash.jpg", out: "service-bathroom.webp" },
  { in: "tilingjj.jpeg", out: "service-tiling.webp" },
  { in: "franco-debartolo-ORzG4HrA9rI-unsplash.jpg", out: "service-kitchen.webp" },
  { in: "tile-merchant-ireland-Wblr6Q2Vr70-unsplash.jpg", out: "service-flooring.webp" },
  { in: "brett-jordan-yica25Tg73w-unsplash.jpg", out: "service-refurbishment.webp" },
];

for (const job of jobs) {
  const meta = await sharp(join(SRC, job.in)).metadata();
  await sharp(join(SRC, job.in))
    .rotate()
    .resize({ width: 1200, height: 900, fit: "cover", position: "centre" })
    .modulate({ saturation: 0.95 })
    .webp({ quality: 82 })
    .toFile(join(OUT, job.out));
  const info = await sharp(join(OUT, job.out)).metadata();
  console.log(`${job.out}  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`);
}
console.log("done");
