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
  /** Slugs of semantically related services — drives the cross-cluster
   *  "RelatedServices" block on /services/[slug] and signals the internal
   *  authority graph to crawlers. */
  related?: string[];
  /** Service-specific FAQs. When present, both the visible FAQ block and the
   *  FAQPage JSON-LD on the service page use these. Falls back to the
   *  general `faqs` array below when omitted. */
  faqs?: { q: string; a: string }[];
};

export const services: Service[] = [
  {
    slug: "bathroom-renovations",
    title: "Bathroom Renovations",
    short: "Luxury bathrooms designed and built end to end.",
    description:
      "Turn a tired bathroom into a calm, spa-like retreat. We design and build complete bathroom renovations — walk-in showers, freestanding baths, premium tiling, underfloor heating and flawless waterproofing. Every join sealed, every tile aligned, every detail considered.",
    features: [
      "Full design & supply service",
      "Wet rooms & walk-in showers",
      "Waterproof tanking & sealing",
      "Underfloor heating",
    ],
    icon: "bath",
    keyword: "bathroom renovation UK",
    related: ["tiling", "flooring-installation", "home-refurbishment"],
    faqs: [
      {
        q: "How long does a typical bathroom renovation take?",
        a: "Most full bathroom renovations take 1–2 weeks once we're on site, depending on layout changes, tile choice and any underfloor heating. We agree the timeline up front and update you every step.",
      },
      {
        q: "Do you handle the plumbing and electrics in-house?",
        a: "Yes. We coordinate all wet trades and certified electricians as part of one team, so there's a single point of contact and no scheduling gaps between trades. Gas Safe and Part P certificates are issued at handover.",
      },
      {
        q: "Can you fit a walk-in shower in a small bathroom?",
        a: "In most layouts, yes. We've designed walk-in showers into Victorian terrace ensuites and compact family bathrooms across Watford, St Albans and Kings Langley — the right glass, hardware and drainage make the room feel bigger, not smaller.",
      },
      {
        q: "What waterproofing do you use?",
        a: "All wet areas are fully tanked behind the tiles using primer, a waterproof tanking membrane and silicone-cured corners — so leaks behind tiling never become a problem. Tanking is invisible once tiled, but it's the difference between a 1-year and a 20-year bathroom.",
      },
      {
        q: "Is underfloor heating worth fitting?",
        a: "On stone or porcelain floors, yes — it transforms how the room feels and is affordable on a small footprint. Electric mat works for retrofit, wet underfloor heating where there's a manifold nearby. We'll recommend what fits your project.",
      },
    ],
  },
  {
    slug: "kitchen-renovations",
    title: "Kitchen Renovations",
    short: "Bespoke kitchens fitted to the highest standard.",
    description:
      "The kitchen is the heart of the home, so it deserves to be done right. As kitchen renovation specialists, we fit bespoke kitchens, worktops, splashbacks and integrated appliances with precise carpentry and clean, modern lines.",
    features: [
      "Bespoke fitted kitchens",
      "Worktops & splashbacks",
      "Appliance integration",
      "Plumbing & electrics coordinated",
    ],
    icon: "kitchen",
    keyword: "kitchen renovation specialists",
    related: ["tiling", "flooring-installation", "home-refurbishment"],
    faqs: [
      {
        q: "How long does a kitchen renovation take?",
        a: "A typical fitted kitchen is 2–3 weeks on site, depending on whether walls are moving and how bespoke the units are. Quartz worktops are templated after the carcasses are installed and fitted a week or so later, so we allow for the supplier's lead time when agreeing the schedule.",
      },
      {
        q: "Do you supply the kitchen units or fit ones we've bought?",
        a: "Both. We work with trade kitchen ranges, the major high-street brands (Howdens, B&Q, IKEA, Magnet) and bespoke makers, and we'll happily fit a kitchen you've sourced yourself. We'll flag anything that won't work in your space before it ships.",
      },
      {
        q: "Can you move the kitchen to a different room?",
        a: "Yes. We've turned dining rooms into kitchen-diners, knocked through to gardens, and re-routed gas, water, waste and electrics to suit. We handle the building work, certification and finishing so it lands as one coherent space.",
      },
      {
        q: "What worktop materials do you fit?",
        a: "Quartz (most popular for durability and finish), granite, solid surface (Corian-style), porcelain and solid wood. We template after the units are installed for an exact fit; veined slabs are dry-laid and reviewed with you before final cuts.",
      },
      {
        q: "Will you connect the appliances?",
        a: "Yes. Gas hobs (by a Gas Safe-registered engineer), induction hobs, integrated ovens, dishwashers, washing machines, fridges and extractor hoods — all certified and signed off. Manuals and warranties are bundled at handover.",
      },
    ],
  },
  {
    slug: "tiling",
    title: "Tiling",
    short: "Precision tiling for floors, walls and wet areas.",
    description:
      "Crisp, perfectly aligned tiling makes all the difference. Our expert tiling contractors work with porcelain, ceramic, natural stone and large-format tiles across floors, walls and wet areas — sealed, grouted and finished to a flawless standard.",
    features: [
      "Floor & wall tiling",
      "Large-format & natural stone",
      "Mosaic & feature walls",
      "Sealing & grouting",
    ],
    icon: "tile",
    keyword: "tiling contractors",
    related: ["bathroom-renovations", "kitchen-renovations", "home-refurbishment"],
    faqs: [
      {
        q: "Do you tile floors or walls only?",
        a: "Both. Floors, walls, splashbacks, wet rooms, feature walls — we tile from porcelain and ceramic through to natural stone, zellige and large-format slabs. Most of our work is full bathrooms and kitchens, but we also do single-wall feature jobs.",
      },
      {
        q: "Can you tile over existing tiles?",
        a: "Sometimes. The surface needs to be flat, well-bonded and primed correctly. On a sound substrate, tiling over is fine and saves the cost of stripping; if there's any hollowness or movement, we strip back and start clean. We'll inspect and tell you honestly.",
      },
      {
        q: "What about large-format tiles and slabs?",
        a: "Large-format (600×1200mm+) and slab tiling is our specialty. They need precise levelling on the substrate, the right adhesive system (a back-buttered S1 or S2 deformable), careful cutting on a wet saw or rail-cutter, and the right hands. The finish is unmatched.",
      },
      {
        q: "How long does tiling typically take?",
        a: "A standard bathroom takes 3–5 days to tile, grout and seal. Floor areas depend on tile size and pattern — herringbone or chevron lays take roughly 1.5× a straight lay. Adhesive and grout need time to cure before the room is fully back in use.",
      },
      {
        q: "Do you grout and seal the tiles too?",
        a: "Always. We grout with the colour you specify, seal natural stone with the correct impregnator, and silicone-finish all internal corners and worktop joins. Sealed grout and stone stays clean far longer; we'll explain how to look after it.",
      },
    ],
  },
  {
    slug: "laminate-flooring",
    title: "Laminate Flooring",
    short: "Hard-wearing laminate, installed seamlessly.",
    description:
      "Smart, hard-wearing and superb value. Our laminate flooring installation includes proper subfloor preparation, acoustic underlay, precise cutting and neat trims — so your new floor looks seamless and feels solid underfoot for years.",
    features: [
      "Subfloor preparation",
      "Acoustic underlay",
      "Precision cutting & trims",
      "Skirting & threshold finishing",
    ],
    icon: "plank",
    keyword: "laminate flooring installation",
    related: ["flooring-installation", "home-refurbishment", "tiling"],
    faqs: [
      {
        q: "What's the difference between laminate, LVT and engineered wood?",
        a: "Laminate is a hard-wearing photographic surface on an HDF core — best value, brilliant in living rooms and hallways. LVT is a vinyl-based plank, warmer underfoot, the right choice for kitchens and family bathrooms. Engineered wood is real timber veneer on a stable core — most premium feel underfoot. We fit all three and explain the trade-offs honestly.",
      },
      {
        q: "Will laminate work in a kitchen or bathroom?",
        a: "AC5-rated laminate with sealed click joints can work in a kitchen — we'll spec a moisture-rated product if so. We don't recommend laminate in bathrooms; LVT or porcelain tile is a far better fit for wet areas and lasts much longer.",
      },
      {
        q: "Do I need acoustic underlay?",
        a: "Yes — we always lay quality acoustic underlay (3–5mm). It reduces noise downstairs, smooths small subfloor imperfections, and the floor feels noticeably better underfoot. The cheaper underlays make a real difference you'll regret skipping.",
      },
      {
        q: "How long does laminate flooring last?",
        a: "A quality AC4–AC5 board, properly installed over a level subfloor with the right underlay, will last 10–20+ years in a busy household. Keep it dry, use felt pads on furniture, and avoid dragging anything heavy across it.",
      },
      {
        q: "Do you remove the old floor first?",
        a: "Yes. We lift the existing covering, dispose of it cleanly, then prep the subfloor — sweep, check for level, apply self-levelling compound if needed — before laying underlay and the new floor. The prep stage is what makes the finished floor feel solid.",
      },
    ],
  },
  {
    slug: "flooring-installation",
    title: "Flooring Installation",
    short: "Engineered wood, LVT, vinyl and more.",
    description:
      "Beautiful flooring transforms a room, and we install it properly. As flooring contractors we fit engineered and solid wood, luxury vinyl tile (LVT) and vinyl — levelling subfloors, laying with precision and finishing every edge cleanly for floors that last.",
    features: [
      "Engineered & solid wood",
      "Luxury vinyl tile (LVT)",
      "Self-levelling subfloors",
      "Pattern & herringbone lays",
    ],
    icon: "floor",
    keyword: "flooring contractors",
    related: ["laminate-flooring", "tiling", "home-refurbishment"],
    faqs: [
      {
        q: "What flooring types do you install?",
        a: "Engineered and solid wood, luxury vinyl tile (LVT), vinyl plank and laminate. We focus on hard flooring; for carpet we work with a trusted carpet fitter and coordinate the schedule so the rooms hand over together.",
      },
      {
        q: "Can you lay herringbone or chevron patterns?",
        a: "Yes — herringbone parquet and chevron lays are some of our favourite jobs. The finished result looks spectacular but the lay takes about 1.5× longer than a straight-plank lay and the subfloor has to be very precisely level. Worth it.",
      },
      {
        q: "Do you level the subfloor first?",
        a: "Always check, and if it's out of spec we self-level with the correct compound. A wavy or stepped subfloor will telegraph through any floor finish — fixing it first is non-negotiable for a premium feel underfoot.",
      },
      {
        q: "Will you fit skirting, scotia and threshold trims?",
        a: "Yes. New skirting, scotia, threshold strips and door trims as needed — colour-matched to the floor or to your existing decor. We never leave gappy edges or exposed expansion gaps; the trim work is what makes the floor look professionally fitted.",
      },
      {
        q: "Can you install over underfloor heating?",
        a: "Yes — engineered wood and LVT both work brilliantly over UFH. We use stable products with the right thermal rating, follow the manufacturer's acclimatisation period, and run the heating to spec during commissioning.",
      },
    ],
  },
  {
    slug: "home-refurbishment",
    title: "Home Refurbishment & Building",
    short: "General building and full home improvements.",
    description:
      "Planning something bigger? Our home refurbishment and general building service brings everything under one trusted team — plastering, partitions, carpentry, decorating and full project management, with one point of contact and one consistent standard.",
    features: [
      "Full home refurbishment",
      "Plastering & partitions",
      "Carpentry & joinery",
      "Project management",
    ],
    icon: "build",
    keyword: "home refurbishment company",
    related: ["bathroom-renovations", "kitchen-renovations", "flooring-installation"],
    faqs: [
      {
        q: "What does a full home refurbishment include?",
        a: "Anything from a single-room rip-out-and-rebuild to a whole-house refurb: structural openings, plastering, electrics, plumbing, decorating, kitchen, bathrooms, flooring and final clean — all managed under one programme with one project manager.",
      },
      {
        q: "Can you do extensions, or only internal work?",
        a: "Our core is internal refurbishment and fit-out. For new-build extensions we work alongside a structural engineer and a main contractor and take on the internal works including 1st and 2nd fix. We're honest about what we do best and where we partner.",
      },
      {
        q: "Do you handle building regs and certificates?",
        a: "Yes. Electrical Part P certificates, Gas Safe sign-off, building control liaison and structural sign-off where needed — we arrange certification through the relevant body and hand the paperwork over at the end of the job.",
      },
      {
        q: "How long does a typical full refurb take?",
        a: "Depends on scope. A flat refurb is typically 6–10 weeks; a full Victorian terrace refurb can run 12–20+ weeks. We agree a phased schedule with milestones up front, so you can see exactly when each room hands over.",
      },
      {
        q: "Can we live in the house during the work?",
        a: "For single-room work, usually yes. For a full refurb without a working kitchen or bathroom, most clients move out for the heavy phase. We keep the site clean, dust-sheeted and secure throughout regardless.",
      },
    ],
  },
];

/**
 * Resolve a project's free-text service string (e.g. "Bathroom renovation",
 * "Large-format tiling", "Skirting & trims") to the slug of the matching
 * service page, or null if no clean mapping exists. Used by ProjectGallery to
 * make the service tags inside the modal clickable, strengthening the
 * project ↔ service internal authority graph.
 */
export function serviceSlugFor(label: string): string | null {
  const l = label.toLowerCase();
  if (l.includes("bathroom")) return "bathroom-renovations";
  if (l.includes("kitchen")) return "kitchen-renovations";
  if (l.includes("laminate")) return "laminate-flooring";
  if (l.includes("tiling") || l.includes("tile")) return "tiling";
  if (l.includes("flooring") || l.includes("wood") || l.includes("herringbone"))
    return "flooring-installation";
  if (l.includes("refurb") || l.includes("building")) return "home-refurbishment";
  return null;
}

export type Project = {
  title: string;
  category: string;
  location: string;
  summary: string;
  services: string[];
  duration: string;
  variant: number;
  beforeVariant: number;
  icon: IconName;
  span?: boolean; // larger masonry tile
  wideCard?: boolean; // render the gallery card as 16:9 (whole room) instead of the span/portrait crop
  // Optional real photography. Set these to a /public path (e.g.
  // "/projects/spa-bathroom.webp") or a licensed Unsplash/Pexels URL to replace
  // the placeholder. Leave undefined to keep the placeholder.
  image?: string;
  beforeImage?: string;
  afterImage?: string;
};

export const projects: Project[] = [
  {
    title: "Spa-Style Master Bathroom",
    category: "Bathroom",
    location: "St Albans, Hertfordshire",
    summary:
      "A dated family bathroom reimagined as a calm, hotel-style retreat — walk-in rain shower, large-format porcelain and warm underfloor heating.",
    services: ["Bathroom renovation", "Tiling", "Underfloor heating"],
    duration: "12 days",
    variant: 0,
    beforeVariant: 2,
    icon: "bath",
    // Full 16:9 card so the whole room shows uncropped (this project only).
    wideCard: true,
    image: "/projects/spa-bathroom-after.webp",
    afterImage: "/projects/spa-bathroom-after.webp",
    // BEFORE: generate the "same room, pre-renovation" photo (see brief),
    // run `node scripts/optimize-projects.mjs`, then uncomment this line:
    // beforeImage: "/projects/spa-bathroom-before.webp",
  },
  {
    title: "Modern Shaker Kitchen",
    category: "Kitchen",
    location: "Watford, Hertfordshire",
    summary:
      "Bespoke shaker units, quartz worktops and a herringbone floor combine for a bright, hard-working family kitchen.",
    services: ["Kitchen renovation", "Flooring", "Tiling"],
    duration: "3 weeks",
    variant: 1,
    beforeVariant: 3,
    icon: "kitchen",
    // Landscape after-photo (greige shaker run, marble splashback, quartz
    // waterfall island) — 16:9 wideCard matches the source composition and
    // keeps the pantry → range → fridge symmetry intact.
    wideCard: true,
    image: "/projects/shaker-kitchen-after.webp",
    afterImage: "/projects/shaker-kitchen-after.webp",
  },
  {
    title: "Herringbone Oak Hallway",
    category: "Flooring",
    location: "Hemel Hempstead",
    summary:
      "Engineered oak laid in a classic herringbone pattern over a perfectly levelled subfloor, with crisp trims throughout.",
    services: ["Flooring installation", "Engineered wood"],
    duration: "5 days",
    variant: 2,
    beforeVariant: 4,
    icon: "floor",
  },
  {
    title: "Zellige Feature Splashback",
    category: "Tiling",
    location: "North London",
    summary:
      "A statement zellige-style splashback bringing texture, warmth and a handmade finish to a contemporary kitchen.",
    services: ["Tiling", "Kitchen"],
    duration: "4 days",
    variant: 5,
    beforeVariant: 1,
    icon: "tile",
  },
  {
    title: "Warm Laminate Living Space",
    category: "Laminate",
    location: "Watford",
    summary:
      "Hard-wearing wood-effect laminate with acoustic underlay and neat skirting — a fast, flawless refresh for a busy living room.",
    services: ["Laminate flooring", "Skirting & trims"],
    duration: "4 days",
    variant: 1,
    beforeVariant: 2,
    icon: "plank",
    // Landscape after-photo — matches the Spa-Style 16:9 wideCard treatment so
    // the full open-plan sweep (sofa → kitchen → dining) reads uncropped.
    wideCard: true,
    image: "/projects/laminate-living-after.webp",
    afterImage: "/projects/laminate-living-after.webp",
  },
  {
    title: "Minimalist Guest Bathroom",
    category: "Bathroom",
    location: "St Albans",
    summary:
      "Clean lines and concealed fittings in a compact guest bathroom, finished with large-format tiles and brushed brass.",
    services: ["Bathroom renovation", "Large-format tiling"],
    duration: "10 days",
    variant: 2,
    beforeVariant: 3,
    icon: "bath",
    // Portrait photo -> 4:5 span tile + centred portrait hero (this project only).
    span: true,
    image: "/projects/guest-bathroom-after.webp",
    afterImage: "/projects/guest-bathroom-after.webp",
  },
  {
    title: "Luxury Kitchen & Dining Space",
    category: "Kitchen",
    location: "Berkhamsted",
    summary:
      "A sociable kitchen-diner with a large island, porcelain floor tiles and integrated appliances — built for entertaining.",
    services: ["Kitchen renovation", "Tiling", "Flooring"],
    duration: "4 weeks",
    variant: 0,
    beforeVariant: 4,
    icon: "kitchen",
    // Landscape after-photo (walnut island, dining extension, porcelain floor) —
    // 16:9 wideCard matches the source composition; the previous span:true 4:5
    // would have cropped either the fridge or the dining side.
    wideCard: true,
    image: "/projects/kitchen-diner-after.webp",
    afterImage: "/projects/kitchen-diner-after.webp",
  },
];

export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  headline: string;
  quote: string;
  job: string;
  date: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    location: "Watford",
    rating: 5,
    headline: "Fantastic workmanship",
    quote:
      "Fantastic workmanship from start to finish. The team were professional, punctual and left everything clean and tidy every day. The finish is better than we imagined.",
    job: "Bathroom renovation",
    date: "March 2026",
  },
  {
    name: "James P.",
    location: "St Albans",
    rating: 5,
    headline: "Very professional and reliable",
    quote:
      "Fast, reliable and a pleasure to deal with. They did exactly what they promised, when they promised. I wouldn't hesitate to recommend them.",
    job: "Kitchen renovation",
    date: "February 2026",
  },
  {
    name: "Priya K.",
    location: "Hemel Hempstead",
    rating: 5,
    headline: "Attention to detail was excellent",
    quote:
      "The attention to detail was excellent — every tile is perfect. You can tell they take real pride in their work.",
    job: "Tiling & flooring",
    date: "January 2026",
  },
  {
    name: "David R.",
    location: "Rickmansworth",
    rating: 5,
    headline: "Great communication",
    quote:
      "Brilliant communication throughout and a beautiful, high quality finish. Honest, professional and trustworthy from start to finish.",
    job: "Home refurbishment",
    date: "December 2025",
  },
  {
    name: "Emma L.",
    location: "Kings Langley",
    rating: 5,
    headline: "Clean and tidy",
    quote:
      "So clean and tidy — they treated our home with real respect, dust sheets down every day and a full clean before they left. The new floors look gorgeous.",
    job: "Laminate flooring",
    date: "November 2025",
  },
  {
    name: "Michael T.",
    location: "North London",
    rating: 5,
    headline: "Would highly recommend",
    quote:
      "Great workmanship and genuinely friendly people. Punctual, and the quality of the finish is superb — we've already recommended them to neighbours.",
    job: "Flooring installation",
    date: "October 2025",
  },
  {
    name: "Grace H.",
    location: "Berkhamsted",
    rating: 5,
    headline: "Punctual and spotless",
    quote:
      "Punctual every single morning and incredibly tidy — you'd never have known a major job was happening. The new bathroom is absolutely stunning.",
    job: "Bathroom renovation",
    date: "April 2026",
  },
  {
    name: "Tom B.",
    location: "Watford",
    rating: 5,
    headline: "Reliable and great value",
    quote:
      "Reliable, professional and great value. They kept us updated daily and the quality of the finish is first class. Couldn't be happier with the result.",
    job: "Kitchen & tiling",
    date: "March 2026",
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
  { value: 15, suffix: "+", label: "Years experience" },
  { value: 100, suffix: "%", label: "Recommended" },
];

export type Badge = { icon: IconName; title: string; sub: string };

export const badges: Badge[] = [
  { icon: "star", title: "4.9 / 5 Rated", sub: "100+ reviews" },
  { icon: "shield", title: "Fully Insured", sub: "Workmanship guaranteed" },
  { icon: "clock", title: "Always On Time", sub: "Reliable & punctual" },
  { icon: "broom", title: "Clean & Tidy", sub: "We respect your home" },
];
