// Single source of truth for service imagery. Both the /services overview
// tiles and each /services/[slug] detail hero import from here, so the two
// can never drift — the same slug always renders the same photo, at the same
// fixed 4:3 frame, on every breakpoint.

export const serviceImages: Record<string, string> = {
  "bathroom-renovations": "/lisa-anna-yhodTxZQQxw-unsplash.jpeg",
  "kitchen-renovations": "/franco-debartolo-ORzG4HrA9rI-unsplash.jpeg",
  tiling: "/tilingjj.jpeg",
  "laminate-flooring": "/claire-rendall-b6kAwr1i0Iw-unsplash.jpg",
  // Two-storey rear extension mid-build (scaffolding + blockwork) — moved
  // here from the retired Home Refurbishment & Building section. Landscape
  // ~4:3 source, so the fixed-ratio tile shows it uncropped-in-spirit at
  // every breakpoint with no focal-point override needed.
  "home-extensions": "/brett-jordan-yica25Tg73w-unsplash.jpeg",
  "loft-conversions": "/toa-heftiba-WqE24tdeRMU-unsplash.jpg",
  roofing: "/clement-proust-RO9HIOzFSX0-unsplash.jpg",
  // Real finished-garden photo, retouched to remove a child from the lawn.
  // Already 4:3, so it fills the card with no crop at any breakpoint.
  landscaping: "/landscaping-garden-nicolla.jpg",
  // Real client photo (rrr.jpg) — 4:3 crop baked by
  // scripts/build-driveway-service.mjs, bottom-weighted so the block paving
  // stays the focal point at every breakpoint.
  "driveways-paving": "/driveway-block-paving.webp",
};

// Focal point for the 4:3 cover crop on tiles whose source is a tall portrait,
// so the most important part stays in frame. Same crop at every breakpoint
// (the card ratio is fixed), so it reads on desktop, tablet and mobile alike.
export const servicePositions: Record<string, string> = {
  // Loft: lift the crop toward the exposed beams + sloped ceiling — the
  // unmistakable "loft" read — while keeping the seating below in frame.
  "loft-conversions": "center 38%",
  // Roofing: hold the tile field and ridge against the sky for clear roofing
  // emphasis, trimming the eaves at the foot of the portrait.
  roofing: "center 42%",
};
