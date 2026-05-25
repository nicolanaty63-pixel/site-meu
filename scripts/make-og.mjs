import sharp from "sharp";
// 1200x630 social-share card: premium interior, brand-ink scrim, centred gold logo.
const W = 1200, H = 630;
const base = await sharp("public/franco-debartolo-ORzG4HrA9rI-unsplash.jpeg")
  .resize(W, H, { fit: "cover", position: "centre" })
  .modulate({ brightness: 0.92, saturation: 0.85 })
  .toBuffer();
const scrim = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 10, g: 13, b: 24, alpha: 0.6 } },
}).png().toBuffer();
const logo = await sharp("public/logo-nicolla-mark.png").resize({ width: 480 }).toBuffer();
const lm = await sharp(logo).metadata();
await sharp(base)
  .composite([
    { input: scrim },
    { input: logo, left: Math.round((W - lm.width) / 2), top: Math.round((H - lm.height) / 2) },
  ])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile("public/og.jpg");
const out = await sharp("public/og.jpg").metadata();
console.log(`og.jpg created ${out.width}x${out.height}`);
