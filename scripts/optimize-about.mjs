import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Distinct editorial treatment for the About "Our story" feature:
// a tighter 4:5 portrait crop (the hero uses the full 3:4 frame) with a gentle
// warm/contrast grade baked in to sit naturally on the dark brand palette.
// Source is a landscape (3:2) bathroom shot — right-aligned crop keeps the
// brushed-brass tap, Carrara marble and gold mirror; the plant frond is the
// part that drops out.
const SRC = "C:/Users/merie/Downloads/clay-banks-vYUkbsJ-Aq4-unsplash.jpg";
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/about");
mkdirSync(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
await sharp(SRC)
  .rotate()
  .resize({ width: 1200, height: 1500, fit: "cover", position: "right" })
  .modulate({ saturation: 0.92, brightness: 1.02 }) // calmer, editorial tone
  .linear(1.06, -6) // gentle contrast lift
  .webp({ quality: 84 })
  .toFile(OUT + "/about-craft.webp");

const info = await sharp(OUT + "/about-craft.webp").metadata();
console.log(`about-craft.webp  ${meta.width}x${meta.height} -> ${info.width}x${info.height}`);
