/**
 * Home-only copy — the approved text of the Home redesign prototype
 * (documentation/design-handoff/nicolla-home-reference.html).
 *
 * Business data is NOT duplicated here: services, projects, FAQs, stats,
 * testimonials, phone numbers, rating and review count stay wired to
 * src/lib/data.ts and src/lib/site.ts. Any reputation figure in this file is
 * interpolated from `site`, never hardcoded.
 */
import { site } from "@/lib/site";
import { faqs, services } from "@/lib/data";

/* ---------------------------------------------------------------- nav ---- */
export const navCopy = {
  cta: "Get in touch",
  drawerQuote: "Get free quote",
  drawerRating: `${site.rating} / 5 · ${site.reviewCount}+ reviews`,
  /** Roman numerals shown beside the drawer links, in nav order. */
  numerals: ["I", "II", "III", "IV", "V", "VI"],
} as const;

/* --------------------------------------------------------------- hero ---- */
export const heroCopy = {
  /** Three lines of the H1 — must match hero-wordmark-glyphs.json line by line. */
  titleLines: ["Built once.", "Built right.", "Built as if it were ours."],
  paragraph: `Bathroom, kitchen and flooring transformations, delivered by one team across Hertfordshire and the UK. Rated ${site.rating} / 5 by the homeowners we have built for.`,
  cta: "Get in touch",
  carouselLabel: "Recent work",
} as const;

export type HeroSlide = {
  src: string;
  alt: string;
  title: string;
  line: string;
  /** Optional background-position / object-position override. */
  position?: string;
};

/** DepthCarousel slides, in the reference order. Photos: the prototype's
 *  `--lv-*` placeholders mapped to the matching files in /public. */
export const heroSlides: HeroSlide[] = [
  {
    src: "/hero/hero-kitchen.webp",
    alt: "Premium open-plan kitchen and dining renovation with walnut cabinetry",
    title: "Kitchen & dining",
    line: "Open-plan renovation, walnut cabinetry",
  },
  {
    src: "/hero/hero-bathroom.webp",
    alt: "Modern grey bathroom renovation with walk-in shower and freestanding bath",
    title: "Bathroom renovation",
    line: "Walk-in shower & freestanding bath",
  },
  {
    src: "/hero/hero-flooring.webp",
    alt: "Herringbone parquet wood flooring installation",
    title: "Flooring installation",
    line: "Herringbone parquet",
  },
  {
    src: "/projects/spa-bathroom-after.webp",
    alt: "Spa-style master bathroom renovation in St Albans",
    title: "Spa-Style Master Bathroom",
    line: "St Albans",
    position: "60% 50%",
  },
  {
    src: "/projects/shaker-kitchen-after.webp",
    alt: "Modern shaker kitchen renovation in Watford",
    title: "Modern Shaker Kitchen",
    line: "Watford",
  },
];

/* ----------------------------------------------------- what we do ---- */
export const servicesCopy = {
  eyebrow: "What we do",
  /** Rendered as: Premium services,<br/>delivered <em>properly.</em> */
  titleLead: "Premium services,",
  titleTail: "delivered",
  titleAccent: "properly.",
  subtitle:
    "From a single room to a complete refurbishment, every project gets the same meticulous standard of workmanship.",
  cardLink: "Explore service",
  more: "View all services",
} as const;

/** Flagship services featured on Home (same selection and copy the Home has
 *  always carried). `slug` must exist in `services` (lib/data.ts); the photo
 *  comes from lib/service-images.ts for that slug. */
export const featuredServices = [
  {
    slug: "bathroom-renovations",
    title: "Luxury Bathroom Renovations",
    blurb:
      "Spa-inspired bathrooms designed and built end to end — flawless tiling, seamless waterproofing and finishes made to last.",
  },
  {
    slug: "tiling",
    title: "Precision Tiling Services",
    blurb:
      "Perfectly aligned porcelain, natural stone and large-format tiling across floors, walls and wet areas — sealed and faultless.",
  },
  {
    slug: "kitchen-renovations",
    title: "High-End Kitchen Transformations",
    blurb:
      "Bespoke kitchens fitted with precise carpentry, premium worktops and clean, considered lines that elevate the whole home.",
  },
  {
    slug: "home-extensions",
    title: "Bespoke Home Extensions",
    blurb:
      "Single and double-storey extensions designed and built end to end — foundations, structure and a flawless finish that flows into your existing home.",
  },
] as const;

/* -------------------------------------------------------- projects ---- */
export const projectsCopy = {
  eyebrow: "Our work",
  titleLead: "Recent",
  titleAccent: "projects",
  subtitle: "A glimpse of the spaces we've transformed across Hertfordshire and North London.",
  more: "View all projects",
  /** Kept in lib/data.ts but not shown on Home. */
  hiddenTitles: ["Minimalist Guest Bathroom"],
} as const;

/* --------------------------------------------------- before / after ---- */
export const beforeAfterCopy = {
  eyebrow: "Before & after",
  titleLines: ["The transformation", "speaks for itself."],
  subtitle:
    "Drag the slider to see the difference our team makes. Tired, dated spaces become bright, premium rooms built to last.",
  before: {
    src: "/before.jpg",
    alt: "Bathroom before renovation — dated suite and worn tiling",
    tag: "Before",
    caption: "Dated & tired",
  },
  after: {
    src: "/after.jpg",
    alt: "The same bathroom after renovation — premium modern finish",
    tag: "After",
    caption: "Premium finish",
  },
  rangeLabel: "Drag to compare before and after",
} as const;

/* ---------------------------------------------------- how it works ---- */
export const processCopy = {
  eyebrow: "How it works",
  /** Rendered as: From first visit<br/>to final <em>handover.</em> */
  titleLead: "From first visit",
  titleTail: "to final",
  titleAccent: "handover.",
  paragraph:
    "No surprises and no vanishing acts. You will know who is on site, what happens next and what it costs, from the day we meet to the day we hand over the keys.",
  cta: "Book a consultation",
  steps: [
    {
      title: "Consultation",
      text: "A free site visit to walk the space with you, hear what you want and assess what is possible.",
    },
    {
      title: "Design & Quote",
      text: "A written, itemised quote with material options and a project timeline you can plan around.",
    },
    {
      title: "Preparation",
      text: "We protect your home, prepare the area and book every trade in advance so the work flows.",
    },
    {
      title: "Build",
      text: "Our team carries out the work to a high standard, with a daily update so you always know where things stand.",
    },
    {
      title: "Handover",
      text: "A final inspection together, a thorough clean, and our workmanship warranty in writing.",
    },
  ],
} as const;

/* ---------------------------------------------------- testimonials ---- */
export type HomeTestimonial = {
  /** Trimmed excerpt, exactly as approved in the reference. */
  quote: string;
  name: string;
  /** "Job · Location · Date", exactly as approved in the reference. */
  meta: string;
};

/** Six excerpts trimmed from the genuine MyBuilder reviews in
 *  `testimonials` (lib/data.ts) — each comment names its source entry. */
export const homeTestimonials: HomeTestimonial[] = [
  {
    // testimonials[0] — Homeowner, Watford, Bathroom remodel, May 2024
    quote:
      "“Not a single thing I can fault! The team were excellent at communication, timekeeping and professional in all manners… I highly, highly recommend!”",
    name: "Homeowner",
    meta: "Bathroom remodel · Watford · May 2024",
  },
  {
    // testimonials[1] — Private Client, Aylesbury, Bathroom renovation, March 2019
    quote:
      "“Their finish was excellent, and it looks very high-end. It is exactly how we wanted it.”",
    name: "Private Client",
    meta: "Bathroom renovation · Aylesbury · March 2019",
  },
  {
    // testimonials[2] — Building Contractor, Slough, 3 en suite bathrooms, kitchen & floors, November 2018
    quote:
      "“I’ve been in building 32 years and they are one of the best tiling contractors I’ve seen.”",
    name: "Building Contractor",
    meta: "3 en suite bathrooms, kitchen & floors · Slough · November 2018",
  },
  {
    // testimonials[3] — Sunita, Uxbridge, Flooring in open plan kitchen and living room, February 2019
    quote:
      "“Punctual, get on with the job, and their workmanship is carefully carried out with a flawless finish.”",
    name: "Sunita",
    meta: "Flooring in open plan kitchen & living room · Uxbridge · February 2019",
  },
  {
    // testimonials[4] — Private Client, Pinner, Bathroom, kitchen renovation & boiler replacement, March 2024
    quote:
      "“Communication fantastic, they left no mess and the finish was top class. Would definitely recommend and use again.”",
    name: "Private Client",
    meta: "Bathroom, kitchen renovation & boiler · Pinner · March 2024",
  },
  {
    // testimonials[5] — Robin, Uxbridge, Tiling for kitchen, hallway and patio, May 2020
    quote:
      "“They really treated the job like it was their own house — which is a rare attribute these days.”",
    name: "Robin",
    meta: "Tiling for kitchen, hallway & patio · Uxbridge · May 2020",
  },
];

export const testimonialsCopy = {
  eyebrow: "What clients say",
  rating: site.rating,
  ratingOutOf: "/ 5",
  ratingLine: `From ${site.reviewCount}+ verified reviews left by the homeowners who lived through the build.`,
  more: "Read every review",
  /** Rotation period in ms. */
  intervalMs: 13000,
} as const;

/* ------------------------------------------------------------- FAQ ---- */
export const faqCopy = {
  eyebrow: "FAQ",
  title: "Frequently asked questions",
  folderLabel: "Questions",
  folderSub: `${faqs.length} answers inside`,
  clientLabel: "Client",
  usLabel: "Nicolla Contractors",
  hintPointer: "Hover the folder, pick a question — or drag the notes around.",
  hintTouch: "Tap the folder, then pick a question.",
} as const;

/* --------------------------------------------------------- contact ---- */
export const contactCopy = {
  eyebrow: "Get in touch",
  title: "Start your project today",
  subtitle:
    "Tell us what you have in mind and we'll arrange a free, no-obligation consultation and quote.",
  callLabel: "Call us",
  emailLabel: "Email",
  basedLabel: "Based in",
} as const;

/* ------------------------------------------------- lead stepper ---- */
/** Step 1 chips. Each sends the full service title from `services`
 *  (lib/data.ts), looked up by slug; "Something else" sends "Other". */
const serviceTitle = (slug: string) => {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`copy.ts: unknown service slug "${slug}"`);
  return s.title;
};
export const jobChips: { label: string; service: string }[] = [
  { label: "Bathroom", service: serviceTitle("bathroom-renovations") },
  { label: "Kitchen", service: serviceTitle("kitchen-renovations") },
  { label: "Tiling", service: serviceTitle("tiling") },
  { label: "Flooring", service: serviceTitle("laminate-flooring") },
  { label: "Extension", service: serviceTitle("home-extensions") },
  { label: "Loft conversion", service: serviceTitle("loft-conversions") },
  { label: "Roofing", service: serviceTitle("roofing") },
  { label: "Landscaping", service: serviceTitle("landscaping") },
  { label: "Driveway & paving", service: serviceTitle("driveways-paving") },
  { label: "Something else", service: "Other" },
];

export const startChips = [
  "As soon as possible",
  "Within 1–3 months",
  "Later this year",
  "Just exploring for now",
] as const;

export const stepperCopy = {
  header: "Free quote · 4 quick questions",
  headerAside: "About 20 seconds",
  questionOf: (i: number, n: number) => `Question ${i} of ${n}`,
  steps: [
    { title: "What do you need done?", error: "Pick one to continue." },
    { title: "When would you like to start?", error: "Pick one to continue." },
    { title: "Best number to call you on?", error: "Please enter a valid UK phone number." },
    { title: "Where should we send your quote?", error: "Please enter a valid email address." },
  ],
  phoneLabel: "Phone",
  phonePlaceholder: site.phoneDisplay,
  nameLabel: "Your name",
  namePlaceholder: "John",
  emailLabel: "Email",
  emailPlaceholder: "you@email.co.uk",
  privacyLine:
    "By sending, you agree to Nicolla Contractors Ltd using these details to respond to your enquiry. Never shared, never sold.",
  back: "Back",
  next: "Continue",
  /** Sent inside `message` (the lead schema has no timing field). */
  messageFromStart: (start: string) => `Preferred start: ${start}`,
  slide: { label: "Slide to send", doneLabel: "Sent", errorLabel: "Check your email" },
  success: {
    title: (name: string) => (name ? `Thank you, ${name} — we’ll be in touch` : "Thank you — we’ll be in touch"),
    /** Truthful to the pipeline: /api/lead emails the team (Reply-To = the
     *  customer); no copy is sent to the customer. */
    line: (phone: string, email: string) =>
      `We’ll call you on ${phone} to talk through your project and arrange a free visit — or reply to ${email}.`,
  },
} as const;
