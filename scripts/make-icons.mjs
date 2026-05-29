import sharp from "sharp";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "public/logo-nicolla-mark.png");
const APP = resolve(ROOT, "src/app");

// App Router convention: src/app/icon.png becomes the favicon at /icon (Next
// auto-injects <link rel="icon" type="image/png" sizes="WxH" href="/icon.png">).
// Transparent background is fine for browser tabs.
await sharp(SRC)
  .resize(192, 192, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ quality: 92 })
  .toFile(resolve(APP, "icon.png"));

// iOS home screen icon. Apple flattens transparency to white if no bg, which
// is wrong for a gold mark on dark — flatten on the ink colour to keep the
// premium look on the home screen.
await sharp(SRC)
  .resize(180, 180, {
    fit: "contain",
    background: { r: 11, g: 14, b: 19, alpha: 1 }, // brand ink
  })
  .flatten({ background: { r: 11, g: 14, b: 19 } })
  .png({ quality: 92 })
  .toFile(resolve(APP, "apple-icon.png"));

console.log("Generated:");
console.log("  src/app/icon.png        192×192 (transparent)");
console.log("  src/app/apple-icon.png  180×180 (ink bg)");
