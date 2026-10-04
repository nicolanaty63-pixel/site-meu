/**
 * Copy for the maintenance screen — the approved text of the prototype
 * (documentation/design-handoff/maintenance/nicolla-maintenance-reference.html).
 * Phone numbers and email are not duplicated here; they come from lib/site.ts.
 */
export const maintenanceCopy = {
  /** Two lines of the H1 — each rises inside its own clip. */
  titleLines: ["We’re working", "on this page."],
  paragraph:
    "It will be back shortly. Until then, our recent work, services and reviews are all on the home page — or give us a call and we’ll talk your project through.",
  cta: "Go to the home page",
  /** Sits between the two phone numbers. */
  or: "or",
  photo: {
    src: "/hero/hero-flooring.webp",
    alt: "Herringbone floor being laid, with a combination square",
    caption: "Herringbone floor, halfway through.",
  },
} as const;
