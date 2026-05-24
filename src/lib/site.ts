// Central business info (NAP) — reused across the site and in SEO schema.
// NOTE: phone/email are safe placeholders (Ofcom reserved 07700 900xxx range).
// Replace with the real contact details before going live.

export const site = {
  name: "Nicolla Contractors Ltd",
  shortName: "Nicolla Contractors",
  legalName: "Nicolla Contractors Ltd",
  tagline: "Premium Building & Renovation",
  description:
    "Nicolla Contractors Ltd is a premium construction and renovation company in Kings Langley, Hertfordshire. We specialise in bathroom and kitchen renovations, tiling, laminate and flooring installation, and complete home refurbishment — delivered with meticulous attention to detail.",

  // Contact (placeholders — replace before launch)
  phoneDisplay: "07700 900123",
  phoneHref: "tel:+447700900123",
  whatsapp: "447700900123",
  email: "info@nicollacontractors.co.uk",

  // Location & service area
  baseTown: "Kings Langley",
  region: "Hertfordshire",
  country: "United Kingdom",
  serves: [
    "Kings Langley",
    "Watford",
    "Hemel Hempstead",
    "St Albans",
    "Rickmansworth",
    "North London",
  ],

  // Reputation
  rating: 4.9,
  reviewCount: 100,
  yearsExperience: 15,
  projectsCompleted: 100,

  // URLs
  url: "https://www.nicollacontractors.co.uk",

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
