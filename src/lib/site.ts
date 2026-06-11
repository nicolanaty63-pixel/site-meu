// Central business info (NAP) — reused across the site and in SEO schema.

export const site = {
  name: "Nicolla Contractors Ltd",
  shortName: "Nicolla Contractors",
  legalName: "Nicolla Contractors Ltd",
  tagline: "Premium Building & Renovation",
  description:
    "Nicolla Contractors Ltd is a premium construction and renovation company based in Kings Langley, Hertfordshire, serving London, North London and across Hertfordshire. We specialise in bathroom renovation, kitchen fitting, tiling, flooring installation and complete home refurbishment — delivered with meticulous attention to detail.",

  // Contact
  phoneDisplay: "07848 484088",
  phoneHref: "tel:+447848484088",
  whatsapp: "447848484088",
  email: "info@nicollacontractors.co.uk",

  // Location & service area
  baseTown: "Kings Langley",
  region: "Hertfordshire",
  country: "United Kingdom",
  // Optional NAP / GBP-aligned fields. Schema.tsx conditionally surfaces each
  // of these in the GeneralContractor JSON-LD ONLY when defined here — leave
  // undefined rather than inventing values. Source of truth for what's
  // missing and what unlocks what is BUSINESS-DATA.md at the repo root.
  /** First line of registered office address — e.g. "10 High Street". */
  streetAddress: undefined as string | undefined,
  /** UK postcode of registered office — e.g. "WD4 8AB". */
  postalCode: undefined as string | undefined,
  /** Geo coordinates of registered office or service centre. */
  geo: undefined as { latitude: number; longitude: number } | undefined,
  /** External profile URLs (GBP, MyBuilder, Facebook, Instagram, LinkedIn).
   *  Each adds a sameAs link from the entity for knowledge-graph signal. */
  sameAs: undefined as string[] | undefined,
  // Single source of truth — JSON-LD areaServed, footer copy, and area-pill
  // lists all derive from this. Keep in sync with src/lib/areas.ts.
  serves: [
    "Kings Langley",
    "Watford",
    "St Albans",
    "Hemel Hempstead",
    "Rickmansworth",
    "Berkhamsted",
    "Bushey",
    "Harpenden",
    "Radlett",
    "North London",
  ],

  // Reputation
  rating: 4.9,
  reviewCount: 115, // matches the public MyBuilder profile count
  yearsExperience: 15,
  projectsCompleted: 100,

  // URLs — primary canonical domain is the non-www apex (www redirects to it).
  url: "https://nicollacontractors.co.uk",

  // Broader service regions for local SEO + structured data (areaServed).
  serviceRegions: ["London", "North London", "Hertfordshire"],

  hours: "Mon–Sat, 8:00am – 6:00pm",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
] as const;
