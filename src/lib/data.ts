// Content data for Nicolla Contractors Ltd.
// Testimonials are original, review-style copy written from the themes the
// company is known for (punctuality, professionalism, attention to detail,
// cleanliness, quality, reliability, communication) — not copied from any
// real person's review.

export type IconName =
  | "bath"
  | "kitchen"
  | "tile"
  | "plank"
  | "floor"
  | "build"
  | "shield"
  | "star"
  | "clock"
  | "broom"
  | "ruler"
  | "handshake"
  | "check";

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  icon: IconName;
  keyword: string;
};

export const services: Service[] = [
  {
    slug: "bathroom-renovations",
    title: "Bathroom Renovations",
    short: "Luxury bathrooms designed and built end to end.",
    description:
      "Complete bathroom renovations from concept to completion — walk-in showers, freestanding baths, underfloor heating, premium tiling and flawless waterproofing.",
    features: [
      "Full design & supply service",
      "Wet rooms & walk-in showers",
      "Waterproof tanking & sealing",
      "Underfloor heating",
    ],
    icon: "bath",
    keyword: "bathroom renovation UK",
  },
  {
    slug: "kitchen-renovations",
    title: "Kitchen Renovations",
    short: "Bespoke kitchens fitted to the highest standard.",
    description:
      "Kitchen renovation specialists delivering bespoke fitted kitchens, worktops, splashbacks and integrated appliances with precise carpentry and clean lines.",
    features: [
      "Bespoke fitted kitchens",
      "Worktops & splashbacks",
      "Appliance integration",
      "Plumbing & electrics coordinated",
    ],
    icon: "kitchen",
    keyword: "kitchen renovation specialists",
  },
  {
    slug: "tiling",
    title: "Tiling",
    short: "Precision tiling for floors, walls and wet areas.",
    description:
      "Expert tiling contractors working with porcelain, ceramic, natural stone and large-format tiles — perfectly aligned, sealed and finished.",
    features: [
      "Floor & wall tiling",
      "Large-format & natural stone",
      "Mosaic & feature walls",
      "Sealing & grouting",
    ],
    icon: "tile",
    keyword: "tiling contractors",
  },
  {
    slug: "laminate-flooring",
    title: "Laminate Flooring",
    short: "Hard-wearing laminate, installed seamlessly.",
    description:
      "Professional laminate flooring installation with proper subfloor preparation, underlay and crisp trims for a durable, premium finish.",
    features: [
      "Subfloor preparation",
      "Acoustic underlay",
      "Precision cutting & trims",
      "Skirting & threshold finishing",
    ],
    icon: "plank",
    keyword: "laminate flooring installation",
  },
  {
    slug: "flooring-installation",
    title: "Flooring Installation",
    short: "Engineered wood, LVT, vinyl and more.",
    description:
      "Flooring contractors fitting engineered wood, luxury vinyl tile (LVT), vinyl and solid wood with levelled subfloors and immaculate detailing.",
    features: [
      "Engineered & solid wood",
      "Luxury vinyl tile (LVT)",
      "Self-levelling subfloors",
      "Pattern & herringbone lays",
    ],
    icon: "floor",
    keyword: "flooring contractors",
  },
  {
    slug: "home-refurbishment",
    title: "Home Refurbishment & Building",
    short: "General building and full home improvements.",
    description:
      "Complete home refurbishment and general building work — plastering, partitions, joinery, decorating and full project management under one trusted team.",
    features: [
      "Full home refurbishment",
      "Plastering & partitions",
      "Carpentry & joinery",
      "Project management",
    ],
    icon: "build",
    keyword: "home refurbishment company",
  },
];

export type Project = {
  title: string;
  category: string;
  location: string;
  summary: string;
  tags: string[];
  variant: number;
  span?: boolean; // larger masonry tile
};

export const projects: Project[] = [
  {
    title: "Spa-Style Bathroom",
    category: "Bathroom",
    location: "St Albans",
    summary:
      "A complete bathroom transformation with a walk-in rain shower, large-format porcelain and warm underfloor heating.",
    tags: ["Bathroom", "Tiling", "Underfloor heating"],
    variant: 0,
    span: true,
  },
  {
    title: "Modern Shaker Kitchen",
    category: "Kitchen",
    location: "Watford",
    summary:
      "Bespoke shaker units, quartz worktops and a herringbone LVT floor for a bright, family-ready kitchen.",
    tags: ["Kitchen", "Flooring"],
    variant: 1,
  },
  {
    title: "Herringbone Hallway",
    category: "Flooring",
    location: "Hemel Hempstead",
    summary:
      "Engineered oak laid in a classic herringbone pattern with a perfectly levelled subfloor.",
    tags: ["Flooring", "Engineered wood"],
    variant: 2,
  },
  {
    title: "Natural Stone Wet Room",
    category: "Bathroom",
    location: "Rickmansworth",
    summary:
      "Fully tanked wet room finished in honed natural stone with a linear drain.",
    tags: ["Bathroom", "Tiling"],
    variant: 3,
  },
  {
    title: "Open-Plan Refurbishment",
    category: "Refurbishment",
    location: "Kings Langley",
    summary:
      "A full ground-floor refurbishment — partitions removed, replastered, rewired and redecorated throughout.",
    tags: ["Refurbishment", "Building"],
    variant: 4,
    span: true,
  },
  {
    title: "Feature Tiled Splashback",
    category: "Tiling",
    location: "North London",
    summary:
      "A statement zellige-style splashback bringing texture and warmth to a contemporary kitchen.",
    tags: ["Tiling", "Kitchen"],
    variant: 5,
  },
];

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  headline: string;
  quote: string;
  job: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    location: "Watford",
    rating: 5,
    headline: "Fantastic workmanship",
    quote:
      "From start to finish the standard was outstanding. The team arrived on time every day, kept everything spotless and the finished bathroom is better than we imagined.",
    job: "Bathroom renovation",
  },
  {
    name: "James P.",
    location: "St Albans",
    rating: 5,
    headline: "Very professional and reliable",
    quote:
      "Reliable, tidy and genuinely professional. They did exactly what they said they would, when they said they would. I wouldn't hesitate to use them again.",
    job: "Kitchen renovation",
  },
  {
    name: "Priya K.",
    location: "Hemel Hempstead",
    rating: 5,
    headline: "Attention to detail was excellent",
    quote:
      "The attention to detail was excellent — every tile and joint is perfect. You can tell they take real pride in their work.",
    job: "Tiling & flooring",
  },
  {
    name: "David R.",
    location: "Rickmansworth",
    rating: 5,
    headline: "Great communication",
    quote:
      "Brilliant communication throughout. Any questions I had were answered quickly and clearly, and there were no surprises along the way.",
    job: "Home refurbishment",
  },
  {
    name: "Emma L.",
    location: "Kings Langley",
    rating: 5,
    headline: "Clean and tidy",
    quote:
      "They treated our home with real respect — dust sheets down every day and a full clean before they left. So refreshing to find tradespeople like this.",
    job: "Laminate flooring",
  },
  {
    name: "Michael T.",
    location: "North London",
    rating: 5,
    headline: "Would highly recommend",
    quote:
      "Friendly, punctual and the quality of the finish is superb. I've already recommended them to two neighbours. Top-class team.",
    job: "Flooring installation",
  },
];

export type FAQ = { q: string; a: string };

export const faqs: FAQ[] = [
  {
    q: "Which areas do you cover?",
    a: "We're based in Kings Langley and work throughout Hertfordshire and North London — including Watford, Hemel Hempstead, St Albans and Rickmansworth. If you're nearby, just ask.",
  },
  {
    q: "Do you offer free quotes?",
    a: "Yes. We provide a free, no-obligation consultation and written quote for every project, with clear pricing and no hidden costs.",
  },
  {
    q: "Are you insured?",
    a: "Absolutely. We are fully insured and every project is carried out to current UK building standards by experienced, vetted tradespeople.",
  },
  {
    q: "Do you guarantee your work?",
    a: "Yes — all of our workmanship is backed by a guarantee, and we stand behind every job long after completion.",
  },
  {
    q: "Can you supply materials and design too?",
    a: "We can manage the full project, from design and material selection to supply and installation, or work alongside your own chosen products.",
  },
  {
    q: "How long does a typical renovation take?",
    a: "It depends on scope, but a bathroom is typically 1–2 weeks and a kitchen 2–3 weeks. We agree a clear timeline before we start and keep you updated throughout.",
  },
];

export type Step = { title: string; desc: string };

export const process: Step[] = [
  {
    title: "Consultation",
    desc: "We visit, listen to your ideas and assess the space — free of charge and with no obligation.",
  },
  {
    title: "Design & Quote",
    desc: "You receive a clear written quote and a plan, with material options and a realistic timeline.",
  },
  {
    title: "Preparation",
    desc: "We protect your home, prepare the area and schedule each trade so work runs smoothly.",
  },
  {
    title: "Build",
    desc: "Our team delivers the work to an exacting standard, keeping things clean and communicating daily.",
  },
  {
    title: "Handover",
    desc: "A final walkthrough, a full clean and your workmanship guarantee — done properly.",
  },
];

export type Stat = {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

export const stats: Stat[] = [
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average rating" },
  { value: 100, suffix: "+", label: "Happy customers" },
  { value: 8, suffix: "+", label: "Years experience" },
  { value: 100, suffix: "%", label: "Recommended" },
];

export type Badge = { icon: IconName; title: string; sub: string };

export const badges: Badge[] = [
  { icon: "star", title: "4.9 / 5 Rated", sub: "100+ reviews" },
  { icon: "shield", title: "Fully Insured", sub: "Workmanship guaranteed" },
  { icon: "clock", title: "Always On Time", sub: "Reliable & punctual" },
  { icon: "broom", title: "Clean & Tidy", sub: "We respect your home" },
];
