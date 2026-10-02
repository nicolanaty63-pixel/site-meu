import { EB_Garamond, Playfair_Display } from "next/font/google";

/**
 * Home-only typefaces. Imported solely from the Home tree (via HomeRoot), so
 * the font files are declared and preloaded on `/` only — no other route
 * downloads them. Inter and Sora come from the root layout as everywhere.
 *
 * The approved prototype ships EB Garamond 400, 400 italic and 800 italic
 * and Playfair Display 400/500/600 + 500 italic — exactly what is loaded
 * here, so intermediate weights resolve the same way they do in the
 * reference. The 800 italic display cut is split out on its own so the hero
 * title (the LCP element) is the only Home face that gets preloaded.
 */
const garamondDisplay = EB_Garamond({
  subsets: ["latin"],
  weight: "800",
  style: "italic",
  variable: "--hv-font-display",
  display: "swap",
});

const garamondText = EB_Garamond({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--hv-font-serif",
  display: "swap",
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--hv-font-caps",
  display: "swap",
  preload: false,
});

/** Font-variable classes, applied on the `.hv2` root. */
export const homeFontVars = [
  garamondDisplay.variable,
  garamondText.variable,
  playfair.variable,
].join(" ");
