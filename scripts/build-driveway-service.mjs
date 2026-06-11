import sharp from "sharp";
import { existsSync } from "node:fs";

// Driveways & Paving service tile (real client photo, rrr.jpg).
// Source is portrait 3024x4032; the tile is fixed 4:3, so the crop is baked
// here rather than shipped oversized: bottom-weighted window keeps the block
// paving (the service) as the focal point with the front door + porch above
// for kerb-appeal context. 1600x1200 q82 WebP ≈ retina for the ~700px tile.
const SRC = "C:/Users/merie/Downloads/rrr.jpg";
const OUT = "C:/Users/merie/site-meu/public/driveway-block-paving.webp";

if (!existsSync(SRC)) {
  console.error(`MISSING source: ${SRC}`);
  process.exit(1);
}

const TOP = 1620; // px from the top of the 4032px source (door + paving window)
await sharp(SRC)
  .rotate()
  .extract({ left: 0, top: TOP, width: 3024, height: 2268 }) // exact 4:3
  .resize({ width: 1600, height: 1200 })
  .sharpen({ sigma: 0.6 })
  .webp({ quality: 82 })
  .toFile(OUT);

const info = await sharp(OUT).metadata();
console.log(`driveway-block-paving.webp  ${info.width}x${info.height} (top=${TOP})`);
