// Remove the child from the landscaping photo by cloning a clean background
// region translated ALONG the wall/grass seam (so brick coping, courses, the
// seam line and the turf all map onto themselves with zero misalignment), then
// feather-blending it over the child. Pure pixel compositing — no generative
// fill — so there are no AI hallucination artifacts.
//
// Usage: node scripts/landscaping-remove-child.mjs [dx] [out.png] [--final]
import sharp from "sharp";

const SRC = "C:/Users/merie/Downloads/WhatsApp Image 2026-05-29 at 22.27.46.jpeg";
const DX = Number(process.argv[2] ?? 95); // horizontal clone shift (px)
const OUT = process.argv[3] ?? "verify-out/landscaping/preview.png";
const FINAL = process.argv.includes("--final");

const SLOPE = -0.2758; // seam_y = 789.59 + SLOPE*x  (least-squares, residual 3.7px)
const DY = SLOPE * DX; // vertical companion shift keeps the translation parallel to the seam

// Destination patch covering the child (head→boots), the yellow ball and shadow.
const PX0 = 311, PY0 = 600, PX1 = 410, PY1 = 832;
const FE = 16; // feather width (px) on each edge

const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data); // copy

const sample = (fx, fy, c) => {
  // bilinear sample of channel c at fractional (fx,fy)
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const x1 = Math.min(x0 + 1, width - 1), y1 = Math.min(y0 + 1, height - 1);
  const tx = fx - x0, ty = fy - y0;
  const at = (x, y) => data[(y * width + x) * channels + c];
  const top = at(x0, y0) * (1 - tx) + at(x1, y0) * tx;
  const bot = at(x0, y1) * (1 - tx) + at(x1, y1) * tx;
  return top * (1 - ty) + bot * ty;
};

for (let y = PY0; y < PY1; y++) {
  for (let x = PX0; x < PX1; x++) {
    const wEdge = smooth(
      Math.min(
        (x - PX0) / FE,
        (PX1 - 1 - x) / FE,
        (y - PY0) / FE,
        (PY1 - 1 - y) / FE,
      ),
    );
    if (wEdge <= 0) continue;
    const sx = x + DX, sy = y + DY;
    const di = (y * width + x) * channels;
    for (let c = 0; c < 3; c++) {
      const s = sample(sx, sy, c);
      out[di + c] = Math.round(wEdge * s + (1 - wEdge) * data[di + c]);
    }
  }
}

const pipe = sharp(out, { raw: { width, height, channels } });
if (FINAL) {
  // Full-res cleaned master saved as high-quality JPEG into public/ (matches the
  // raw-photo-in-public convention; next/image handles delivery optimisation).
  await pipe
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toFile("public/landscaping-garden-nicolla.jpg");
  console.log("wrote public/landscaping-garden-nicolla.jpg");
} else {
  // Preview: zoom the patched area so edits are easy to scrutinise.
  await pipe
    .extract({ left: 200, top: 560, width: 360, height: 320 })
    .resize({ width: 720 })
    .png()
    .toFile(OUT);
  console.log("wrote", OUT, "DX=", DX, "DY=", DY.toFixed(1));
}
