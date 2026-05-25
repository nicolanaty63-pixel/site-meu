import sharp from "sharp";
import { mkdirSync } from "node:fs";

// Distinct editorial treatment for the About "Our story" feature:
// a tighter 4:5 portrait crop (the hero uses the full 3:4 frame) with a gentle
// warm/contrast grade baked in to sit naturally on the dark brand palette.
const SRC = "C:/Users/merie/Downloads/jonathan-taylor-o_oP1TDxTV4-unsplash.jpg";
const OUT = "C:/Users/merie/site-meu/public/about";
mkdirSync(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
await sharp(SRC)
  .rotate()
  .resize({ width: 1200, height: 1500, fit: "cover", position: "centre" })
  .modulate({ saturation: 0.92, brightness: 1.02 }) // calmer, editorial tone
  .linear(1.06, -6) // gentle contrast lift
  .webp({ quality: 84 })
  .toFile(OUT + "/about-craft.webp");

const info = await sharp(OUT + "/about-craft.webp").metadata();
console.log(`about-craft.webp  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`);
