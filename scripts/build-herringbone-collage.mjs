import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// Herringbone Oak Hallway — project-card collage.
// Builds ONE premium 4:3 collage (hero-left + two stacked supporting) and bakes
// it to a single WebP so it drops straight into the existing <Photo src> slot:
// the card's aspect-[4/3] frame, radius, hover-zoom and overlay stay untouched.
// The <Photo> component layers the global warm brand grade on top, so we keep
// the bake natural and only apply a light counter-downscale sharpen.
const SRC = "C:/Users/merie/Downloads";
const OUT = "C:/Users/merie/site-meu/public/projects";
mkdirSync(OUT, { recursive: true });

// Canvas: 4:3 to match the card frame exactly. 1600x1200 is comfortably retina
// for the ~420px-wide card tile.
const W = 1600;
const H = 1200;
const G = 14; // seam between tiles (no outer margin — collage bleeds to edges)
const SEAM = { r: 12, g: 12, b: 14 }; // dark neutral grid seam

// Hero gets the larger share (~golden ratio). Supporting column fills the rest.
const heroW = 1040;
const rightW = W - G - heroW;
const rightH = Math.round((H - G) / 2);

const sharpenAndCover = (file, w, h) =>
  sharp(join(SRC, file))
    .rotate() // respect EXIF orientation
    .resize({ width: w, height: h, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .toBuffer();

const sources = ["1h.jpeg", "2h.jpeg", "3h.jpeg"];
for (const f of sources) {
  if (!existsSync(join(SRC, f))) {
    console.error(`MISSING source: ${f}`);
    process.exit(1);
  }
}

const [hero, topRight, bottomRight] = await Promise.all([
  sharpenAndCover("1h.jpeg", heroW, H), // establishing hero (full height)
  sharpenAndCover("2h.jpeg", rightW, rightH), // warm oak detail
  sharpenAndCover("3h.jpeg", rightW, rightH), // cooler grey detail
]);

const out = join(OUT, "herringbone-hallway.webp");
await sharp({
  create: { width: W, height: H, channels: 3, background: SEAM },
})
  .composite([
    { input: hero, left: 0, top: 0 },
    { input: topRight, left: heroW + G, top: 0 },
    { input: bottomRight, left: heroW + G, top: rightH + G },
  ])
  .webp({ quality: 92 })
  .toFile(out);

const info = await sharp(out).metadata();
console.log(`herringbone-hallway.webp  ${info.width}x${info.height}`);
console.log(`  hero ${heroW}x${H} | right ${rightW}x${rightH} (x2)`);
console.log("done");
