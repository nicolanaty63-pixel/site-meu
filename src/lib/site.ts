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
  reviewCount: 100,
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
