/**
 * Geometry of the hero wordmark, in glyph units (EB Garamond 800 italic at
 * 100 units/em — hero-wordmark-glyphs.json). Mirrors the prototype script:
 *   W = widest line + 2·PADX, H = Y0 + (lines−1)·LH + desc + 6.
 * The server-rendered <h1> text and the client SVG overlay both use these, so
 * the swap from text to vector letters is pixel-identical.
 */
export const WM_SIZE = 100;
export const WM_LH = 96;
export const WM_Y0 = 76;
export const WM_PADX = 10;
export const WM_DESC = 29.8;
export const WM_W = 991.9 + 2 * WM_PADX; // 1011.9
export const WM_H = WM_Y0 + 2 * WM_LH + WM_DESC + 6; // 303.8
