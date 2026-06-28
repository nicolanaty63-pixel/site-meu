// Content data for Nicolla Contractors Ltd.
// Testimonials are genuine customer reviews quoted verbatim from the
// company's public MyBuilder profile (see the source comment on the array).

import { site } from "@/lib/site";

export type IconName =
  | "bath"
  | "kitchen"
  | "tile"
  | "plank"
  | "floor"
  | "extension"
  | "loft"
  | "roof"
  | "landscape"
  | "paving"
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
    related: ["tiling", "laminate-flooring", "kitchen-renovations"],
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
    related: ["tiling", "laminate-flooring", "bathroom-renovations"],
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
    related: ["bathroom-renovations", "kitchen-renovations", "laminate-flooring"],
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
    related: ["bathroom-renovations", "tiling", "kitchen-renovations"],
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
    slug: "home-extensions",
    title: "Home Extensions",
    short: "Single & double-storey extensions, built end to end.",
    description:
      "Create the space your home has been missing. We design and build single-storey, double-storey and wrap-around extensions — from foundations and structural steelwork through to a fully finished, decorated room that flows seamlessly into the existing house. One team, one standard, one point of contact.",
    features: [
      "Single & double-storey extensions",
      "Foundations & structural steel",
      "Building control & regs managed",
      "Seamless tie-in to your existing home",
    ],
    icon: "extension",
    keyword: "house extension builders",
    related: ["loft-conversions", "kitchen-renovations", "roofing"],
    faqs: [
      {
        q: "Do I need planning permission for an extension?",
        a: "Many single-storey rear extensions fall under permitted development, but it depends on the size, your property and whether you're in a conservation area. We assess this early, handle the planning or lawful-development application where it's needed, and never start ground works until approvals and building control are in place.",
      },
      {
        q: "How long does a typical extension take?",
        a: "A single-storey rear extension is usually 8–12 weeks on site; double-storey and wrap-around builds run longer. We give you a phased programme up front — foundations, structure, weathertight shell, then first and second fix — so you always know what's happening that week.",
      },
      {
        q: "Will you manage the structural design and building control?",
        a: "Yes. We work with a structural engineer for the steel and foundation design and liaise with building control through to final sign-off, handing you the completion certificate at the end. It's all coordinated under one contract.",
      },
      {
        q: "Can we stay in the house during the build?",
        a: "In most cases, yes. The extension is built as a sealed shell before we break through to the existing house, so the messiest work stays outside until the final tie-in. We dust-sheet, protect and clean the site every day.",
      },
    ],
  },
  {
    slug: "loft-conversions",
    title: "Loft Conversions",
    short: "Unlock a bright new room in your roof space.",
    description:
      "Turn unused loft space into a light-filled bedroom, home office or en-suite. We handle the full conversion — structural floor, dormers or rooflights, staircase, insulation and a finished, regulation-compliant room — designed to add real space and lasting value to your home.",
    features: [
      "Dormer, hip-to-gable & rooflight",
      "Structural floor & staircase",
      "Insulation & fire-regs compliant",
      "En-suite & built-in storage",
    ],
    icon: "loft",
    keyword: "loft conversion specialists",
    related: ["home-extensions", "roofing", "bathroom-renovations"],
    faqs: [
      {
        q: "Is my loft suitable for a conversion?",
        a: "Most are. The key factors are the usable head height, the roof pitch and the existing structure. We carry out a free survey to measure the available height and advise on the best conversion type — rooflight, dormer or hip-to-gable — for your roof.",
      },
      {
        q: "Do loft conversions need building regulations?",
        a: "Always. A loft conversion must meet structural, fire-safety, insulation and staircase regulations. We design to spec, work with a structural engineer and see it through building control sign-off, so the new room is fully certified.",
      },
      {
        q: "How much head height do I need?",
        a: "As a rule of thumb you want around 2.2–2.4m at the highest point before conversion. If you're short on height, a dormer — or in some cases lowering the ceiling in the room below — can help. We'll tell you honestly at the survey whether it's worth doing.",
      },
      {
        q: "How long does a loft conversion take?",
        a: "A typical dormer loft conversion is around 6–8 weeks on site. Most of the structural and weatherproofing work happens externally first, so disruption inside the home is limited until the staircase goes in.",
      },
    ],
  },
  {
    slug: "roofing",
    title: "Roofing Services",
    short: "Repairs, re-roofs and flat roofs, built to last.",
    description:
      "A roof that's watertight and finished properly protects everything beneath it. We carry out pitched re-roofs, flat-roof systems, repairs, fascias, soffits and guttering — using quality materials and clean detailing, with every job left weathertight and backed by a guarantee.",
    features: [
      "Pitched re-roofs & repairs",
      "Flat roofing (EPDM & GRP)",
      "Fascias, soffits & guttering",
      "Leadwork & chimney flashing",
    ],
    icon: "roof",
    keyword: "roofing contractors",
    related: ["home-extensions", "loft-conversions", "landscaping"],
    faqs: [
      {
        q: "Do you repair roofs as well as replace them?",
        a: "Yes. Many leaks come down to slipped tiles, failed flashing or worn flat-roof felt and can be fixed without a full re-roof. We inspect first and recommend the most cost-effective option honestly — a repair where it will last, a re-roof where it won't.",
      },
      {
        q: "What flat roofing systems do you install?",
        a: "EPDM rubber and GRP fibreglass for most domestic flat roofs — both far longer-lasting than traditional felt. We spec the right system for the roof's size, access and use, including warm-roof build-ups under a loft or extension.",
      },
      {
        q: "Is your roofing work guaranteed?",
        a: "Yes. New roofs and flat-roof systems are covered by a workmanship guarantee, and many of the materials we fit carry their own manufacturer warranty on top. We hand the paperwork over at completion.",
      },
      {
        q: "Can you roof a new extension or loft conversion?",
        a: "Absolutely — roofing is part of our extension and loft work, handled in-house and detailed to tie cleanly into the existing roofline rather than bolted on as an afterthought.",
      },
    ],
  },
  {
    slug: "landscaping",
    title: "Landscaping",
    short: "Considered outdoor spaces, built to a premium finish.",
    description:
      "Bring the same craftsmanship outdoors. We design and build patios, garden walls, turfing, planting beds, fencing and full garden transformations — levelled, drained and finished properly so your outdoor space looks intentional and lasts through every season.",
    features: [
      "Patios & natural stone paving",
      "Garden walls & raised beds",
      "Turfing & planting",
      "Fencing & drainage",
    ],
    icon: "landscape",
    keyword: "landscaping services",
    related: ["driveways-paving", "home-extensions", "tiling"],
    faqs: [
      {
        q: "Do you design the garden or only build it?",
        a: "Both. We can work to your own design or a garden designer's plans, or develop a simple layout with you at the quote stage — levels, materials and planting — so you can picture the finished space before we start.",
      },
      {
        q: "What patio materials do you lay?",
        a: "Porcelain, natural stone (sandstone, limestone, granite) and block paving. Outdoor porcelain is increasingly popular for its clean, low-maintenance finish; we lay everything on a proper sub-base with falls for drainage so it stays flat and puddle-free.",
      },
      {
        q: "Will the patio drain properly?",
        a: "Yes — correct falls and a compacted sub-base are non-negotiable on any paving we lay. Where needed we add channel or soakaway drainage so surface water runs away from the house in line with current regulations.",
      },
      {
        q: "Do you handle levels and groundwork?",
        a: "We do. Excavation, levelling, retaining walls and sub-base preparation are the foundation of a garden that lasts — we get the groundwork right before anything visible goes down.",
      },
    ],
  },
  {
    slug: "driveways-paving",
    title: "Driveways & Paving",
    short: "Durable, great-looking driveways laid to last.",
    description:
      "A well-built driveway lifts the whole front of your home. We lay block paving, resin-bound, porcelain and natural stone driveways and paths — excavated, sub-based and edged correctly, with proper drainage built in for a finish that stays level, clean and solid for years.",
    features: [
      "Block paving & natural stone",
      "Resin-bound surfacing",
      "Permeable, SUDS-compliant drainage",
      "Kerbs, edging & groundwork",
    ],
    icon: "paving",
    keyword: "driveways and paving",
    related: ["landscaping", "home-extensions", "tiling"],
    faqs: [
      {
        q: "What driveway surfaces do you install?",
        a: "Block paving, resin-bound gravel, porcelain and natural stone. Block paving is hard-wearing and easily repaired; resin-bound gives a smooth, contemporary, permeable finish. We'll match the surface to your home and budget.",
      },
      {
        q: "Do I need planning permission for a new driveway?",
        a: "Usually not, provided the surface is permeable or drains to a soakaway within your property rather than onto the road — which is how we build them. Non-permeable driveways over 5m² draining to the highway can need permission; we design to stay compliant.",
      },
      {
        q: "How long does a driveway take to install?",
        a: "A typical domestic driveway is around 1–2 weeks depending on size, surface and the groundwork involved. Resin-bound needs a dry, cured base before the topping goes down, so we plan the schedule around the weather.",
      },
      {
        q: "Will the driveway drain correctly?",
        a: "Yes. We build in permeable surfacing or linear drainage and proper falls so water never pools or runs toward the house, meeting SUDS guidance for surface water.",
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
    return "laminate-flooring";
  if (l.includes("landscap") || l.includes("garden")) return "landscaping";
  if (l.includes("driveway") || l.includes("paving") || l.includes("patio"))
    return "driveways-paving";
  if (l.includes("roof")) return "roofing";
  if (l.includes("loft")) return "loft-conversions";
  if (l.includes("extension")) return "home-extensions";
  if (l.includes("refurb") || l.includes("building")) return "home-extensions";
  return null;
}

/** Long-form case-study content for projects substantial enough to deserve
 *  a dedicated /projects/[slug] page. When omitted, the project stays in
 *  the gallery modal only — the "prefer 10 strong pages over 50 weak ones"
 *  rule. Every field is unique per project; no shared boilerplate. */
export type ProjectDetail = {
  metaTitle: string;
  metaDescription: string;
  /** 1–2 sentence pull-quote that opens the case study, shown right under
   *  the hero image. Should read as editorial, not marketing. */
  intro: string;
  /** What the job actually covered, in trade-voice. */
  scope: string[];
  /** Real technical challenges the trade had to solve on this project. */
  challenges: string[];
  /** On-site programme broken into phases. */
  process: Array<{ phase: string; detail: string }>;
  /** Visible materials + finishes specified for this room. */
  materials: string[];
  /** The qualitative outcome — what the space now is vs. what it was. */
  outcome: string;
};

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
  /** When set, this project gets a dedicated /projects/[slug] case-study
   *  page. Detail must also be present — type isn't enforced but the route
   *  filter requires both. */
  slug?: string;
  detail?: ProjectDetail;
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
    slug: "spa-style-master-bathroom-st-albans",
    detail: {
      metaTitle:
        "Spa-Style Master Bathroom Renovation in St Albans — Case Study",
      metaDescription:
        "A 12-day master bathroom renovation in St Albans, Hertfordshire — walk-in rain shower, large-format porcelain, freestanding bath and underfloor heating. Real case study by Nicolla Contractors.",
      intro:
        "A dated 1980s suite stripped back to brick and rebuilt as a calm, hotel-style retreat. Twelve days on site, finished as a single coherent room rather than a set of fittings stacked together.",
      scope: [
        "Full strip-out of the existing suite, removal of the airing-cupboard partition wall and disposal of all redundant fittings.",
        "Repositioned soil pipe and re-routed cold/hot feeds to suit the new layout (freestanding bath on the long wall, walk-in shower at the end).",
        "Full waterproof tanking system applied over the new floor build-up before tiling.",
        "Electric underfloor heating mat embedded under porcelain throughout, controlled by a programmable thermostat.",
        "Large-format porcelain tiling to all walls and floor, including the shower zone, with silicone-finished internal corners.",
        "Brushed-brass brassware set installed and commissioned — concealed shower mixer, basin tap and bath filler.",
      ],
      challenges: [
        "Original suspended timber floor needed strengthening in two joist bays before the freestanding bath could be sited — the new bath is heavier than the old built-in.",
        "Veined large-format porcelain was dry-laid in the workshop and on site before any cuts to keep the vein direction running across the room as one continuous sweep.",
        "Recessed wall niche in the shower had to be set out before tanking — it lines up exactly with the central tile course rather than sitting where the studs happened to land.",
      ],
      process: [
        {
          phase: "Days 1–2 · Strip-out + protection",
          detail:
            "Existing suite removed, partition wall taken down, dust sheets and door protection in place. Skip on the drive, debris cleared each day.",
        },
        {
          phase: "Days 3–5 · First fix",
          detail:
            "Soil pipe rerouted, hot/cold feeds repositioned for the new layout, electrical first-fix for the underfloor heating, mirror lighting and extractor.",
        },
        {
          phase: "Days 6–7 · Floor build-up + tanking",
          detail:
            "Joist strengthening for the freestanding bath, plywood overlay, primer and Schlüter-system tanking on walls and floor, underfloor heating mat laid into self-leveller.",
        },
        {
          phase: "Days 8–11 · Tiling",
          detail:
            "Walls then floor in the large-format porcelain. Dry-laid for vein matching, cut on a rail-cutter, set with S2 adhesive. Grouted on day 11, silicone the next morning.",
        },
        {
          phase: "Day 12 · Second fix + handover",
          detail:
            "Brassware fitted and commissioned, glass shower screen installed, bath filled and tested, full clean, walkthrough with the homeowners.",
        },
      ],
      materials: [
        "Large-format porcelain — 600×1200, matte greige, walls and floor",
        "Freestanding stone-composite bath",
        "Walk-in glass shower screen with chrome bracing",
        "Brushed-brass shower mixer + basin tap + bath filler (matched set)",
        "Electric underfloor heating mat with programmable thermostat",
        "Schlüter-system waterproof tanking membrane",
      ],
      outcome:
        "What was a tired family bathroom now reads as a hotel suite — single material running across walls and floor, calm tone, warm underfloor, and a walk-in shower that fits the proportions of the room rather than being squeezed into a corner. The homeowners moved back in on day 13.",
    },
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
    slug: "modern-shaker-kitchen-watford",
    detail: {
      metaTitle:
        "Modern Shaker Kitchen Renovation in Watford — Case Study",
      metaDescription:
        "A 3-week Watford kitchen renovation — greige shaker units with chrome bar pulls, full-slab quartz worktops, marble splashback and a stainless French-door fridge. Real Nicolla Contractors case study.",
      intro:
        "A 1930s semi where the kitchen had been broadly the same since the 1990s. Three weeks on site, replaced with a quiet greige shaker run, a quartz waterfall island and a marble splashback that lifts the whole room.",
      scope: [
        "Full strip-out of the existing kitchen including units, worktops, splashback tiles and old vinyl flooring.",
        "Plaster repairs and a skim coat where the original tiling had been hacked off.",
        "Electrical first-fix for the new appliance positions plus relocated socket runs above the worktop.",
        "Gas-Safe re-certification of the hob connection after the unit was repositioned.",
        "Bespoke shaker carcasses fitted with chrome bar pulls, including a tall pantry tower flanking the range.",
        "Full-slab quartz worktop templated after the carcasses were in and fitted a week later.",
        "Marble splashback behind the range, mitred to wrap the corner cleanly.",
      ],
      challenges: [
        "The original walls were noticeably out of square — every plinth, worktop end and pantry filler was cut bespoke on site rather than supplied to a standard length.",
        "The existing hob feed sat in a position that wouldn't suit the new layout — re-routed and re-certified by a Gas Safe engineer rather than left in place.",
        "Quartz could only be templated after the carcasses were physically installed, which forced a one-week gap mid-programme. We used the gap to fit the splashback and decorate the room, so the kitchen wasn't sat idle.",
      ],
      process: [
        {
          phase: "Days 1–3 · Strip-out + plaster",
          detail:
            "Old kitchen removed in a single day; plaster repairs where the existing tiling came off; floor protection laid for the rest of the programme.",
        },
        {
          phase: "Days 4–6 · First fix",
          detail:
            "Electrical first-fix for new socket positions, plumbing for the new sink position, gas re-routing and Gas Safe re-cert booked.",
        },
        {
          phase: "Days 7–10 · Units in",
          detail:
            "Bespoke shaker carcasses delivered and fitted in sequence — base units first, then tall units flanking the range, doors and drawers hung last.",
        },
        {
          phase: "Days 11–14 · Quartz template + splashback",
          detail:
            "Quartz templated end of week two; splashback fitted while the slab was being machined; room redecorated.",
        },
        {
          phase: "Days 15–18 · Quartz fit + appliances + handover",
          detail:
            "Worktop fitted, sink and hob commissioned, appliances integrated and tested, full clean, walkthrough.",
        },
      ],
      materials: [
        "Bespoke shaker doors in matte greige with chrome bar pulls",
        "Full-slab quartz worktop, island waterfall ends",
        "Veined marble splashback behind the range, mitred returns",
        "Stainless steel French-door fridge",
        "Brushed-brass mixer tap with separate filtered-water spout",
        "Integrated dishwasher and double oven",
      ],
      outcome:
        "A bright, hard-working family kitchen that finally fits the shape of the room. The original layout is broadly retained, but every cabinet end and worktop edge has been cut to fit — so nothing reads as off-the-shelf despite using a standard trade-brand carcass system.",
    },
  },
  {
    title: "Warm Laminate Living Space",
    category: "Flooring",
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
    slug: "warm-laminate-living-space-watford",
    detail: {
      metaTitle:
        "Warm Laminate Living Space — Watford Open-Plan Floor Refresh",
      metaDescription:
        "An open-plan Watford ground floor with new wood-effect AC4 laminate, acoustic underlay and neat scotia trims — fitted in 4 days. Real Nicolla Contractors case study.",
      intro:
        "An open-plan living-dining-kitchen ground floor where the carpet had taken a battering. Four days on site, replaced with a single AC4 wood-effect laminate flowing from front door to back without a threshold break.",
      scope: [
        "Lift and dispose of existing carpet and underlay across the open-plan ground floor.",
        "Subfloor inspection, sweep, and self-levelling compound where needed to bring the surface within manufacturer tolerance.",
        "Lay 4mm acoustic underlay throughout.",
        "Straight-plank lay of AC4 wood-effect laminate from the entrance hall through living, dining and kitchen zones — no threshold break between rooms.",
        "Scotia fitted to existing skirting, colour-matched to the floor.",
        "New oak threshold strips at the doorways to bathroom and stairs.",
      ],
      challenges: [
        "The original chipboard subfloor stepped about 12mm at the kitchen threshold — needed self-levelling compound, not just a transition strip, to keep the run continuous.",
        "Existing skirting was painted in place and the homeowner didn't want to repaint, so we fitted slimline scotia colour-matched to the floor rather than lifting and refitting skirting.",
        "Awkward cut around five radiator pipe positions and the freestanding wood-burner hearth — each one templated with a pipe-rose tool for a tight fit.",
      ],
      process: [
        {
          phase: "Day 1 · Strip + prep",
          detail:
            "Carpet lifted and disposed of, gripper rods removed, subfloor swept, self-levelling compound applied at the kitchen threshold step.",
        },
        {
          phase: "Day 2 · Underlay + start of lay",
          detail:
            "Acoustic underlay rolled and joined, first courses set out from the longest wall, straight-plank lay started.",
        },
        {
          phase: "Day 3 · Finish lay",
          detail:
            "Cut around radiator pipes, fireplace hearth and door frames. Final courses scribed at the opposite wall. Expansion gap maintained at every edge.",
        },
        {
          phase: "Day 4 · Trims + handover",
          detail:
            "Scotia fitted to existing skirting, oak threshold strips at the bathroom and stair doorways, hoover, walkthrough.",
        },
      ],
      materials: [
        "AC4-rated wood-effect laminate (oak look), 8mm",
        "4mm acoustic underlay with foil moisture barrier",
        "Colour-matched scotia (PVC) for skirting cover",
        "Solid oak threshold strips at doorways",
        "Expansion-gap spacers maintained on every edge",
      ],
      outcome:
        "A single hard-wearing floor running from the front door to the back, with no threshold break between rooms. The kitchen and the living area now read as one space instead of two zones divided by a transition strip. Fast turnaround, minimal disruption, finished cleanly.",
    },
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
    slug: "minimalist-guest-bathroom-st-albans",
    detail: {
      metaTitle:
        "Minimalist Guest Bathroom Renovation in St Albans — Case Study",
      metaDescription:
        "A 10-day compact guest bathroom renovation in St Albans — walk-in shower, large-format porcelain, brushed-brass concealed fittings, frameless glass. Real Nicolla Contractors case study.",
      intro:
        "A compact guest bathroom that needed to feel much bigger than its footprint suggested. Ten days on site, finished as a minimalist room with concealed plumbing, large-format porcelain and a frameless glass screen.",
      scope: [
        "Full strip-out of the existing en-suite including suite, tiling and old extraction.",
        "Concealed cistern frame and back-to-wall toilet specified to recover 15cm of usable depth.",
        "Repositioned shower waste with proper falls in the new screed.",
        "Full waterproof tanking system to all wet areas before tiling.",
        "Large-format porcelain to all walls and floor.",
        "Brushed-brass concealed shower mixer, basin tap and waste.",
        "Frameless 8mm glass shower screen on a hinged pivot.",
        "Recessed wall niche in the shower with integrated LED strip.",
      ],
      challenges: [
        "Tight footprint — the concealed cistern frame took 15cm off the available depth, which forced the doorway to be re-hung swinging outward rather than inward.",
        "Brushed-brass spec needed the correct primer base on the substrate to keep the finish from spotting under hard water.",
        "Single-skin external wall on the shower side needed an additional insulation board behind the tanking to stop cold-bridge condensation.",
      ],
      process: [
        {
          phase: "Days 1–2 · Strip-out",
          detail:
            "Existing suite removed, tiles hacked off, old extractor removed, doorway re-hung on its new swing direction.",
        },
        {
          phase: "Days 3–4 · First fix",
          detail:
            "Shower waste repositioned and falls created in screed, electrical first-fix for the niche LED + extractor, concealed cistern frame fitted.",
        },
        {
          phase: "Days 5–6 · Tanking + insulation",
          detail:
            "Insulation board added to the single-skin wall, full waterproof tanking system applied to walls and floor, niche set out.",
        },
        {
          phase: "Days 6–9 · Tiling",
          detail:
            "Walls and floor in large-format porcelain. Tight cuts around the cistern and niche. Grouted and silicone-finished on day 9.",
        },
        {
          phase: "Day 10 · Second fix + handover",
          detail:
            "Brushed-brass mixer commissioned, frameless shower screen fitted, basin and toilet plumbed, niche LED tested, walkthrough and clean.",
        },
      ],
      materials: [
        "600×600 large-format porcelain, walls and floor",
        "Concealed-cistern WC frame + back-to-wall pan",
        "Brushed-brass concealed thermostatic shower mixer + waste set",
        "Frameless 8mm hinged glass shower screen",
        "Recessed wall niche with warm-white LED strip",
        "Insulation board behind the single-skin external-wall tanking",
      ],
      outcome:
        "A compact guest bathroom that punches well above its size. Concealed services, single material across walls and floor, no visible visual clutter — the room feels deliberate rather than tight.",
    },
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
    slug: "luxury-kitchen-dining-space-berkhamsted",
    detail: {
      metaTitle:
        "Luxury Kitchen & Dining Space in Berkhamsted — Case Study",
      metaDescription:
        "A 4-week kitchen-diner build in Berkhamsted — structural opening, marble-waterfall island with dining extension, light oak cabinetry and herringbone engineered flooring. Real Nicolla Contractors case study.",
      intro:
        "A separate kitchen and dining room turned into one sociable open-plan kitchen-diner. Four weeks on site, structural opening included, finished as a single coherent room with a marble waterfall island flowing into a dining extension.",
      scope: [
        "Structural opening between the original kitchen and the dining room — RSJ installed, supported, plastered.",
        "Full strip-out of both rooms and removal of the old internal partition.",
        "Services first-fix coordinated across the new open footprint — gas, water, waste and electrics.",
        "Light oak cabinetry with vertical fluted detailing on the island return.",
        "Full-slab marble worktop, waterfall ends, dining extension run continuous with the island.",
        "Herringbone engineered oak flooring across the whole new open-plan space.",
        "Premium integrated appliance package (induction hob, downdraft extractor, double oven, integrated fridge-freezer, integrated dishwasher).",
      ],
      challenges: [
        "Structural opening required a structural-engineer design + Building Control sign-off — programmed for the first week of the job before any joinery arrived on site.",
        "Walnut bespoke run had a 10-week off-site joinery lead time — sequenced against the on-site programme so units arrived the week structural work finished.",
        "Marble slab selection done in person at the slab yard to choose the vein direction — book-matched across the island top and the waterfall ends.",
        "Downdraft extractor on the island needed a duct run cast into the screed before the floor was laid.",
      ],
      process: [
        {
          phase: "Week 1 · Structural opening + strip-out",
          detail:
            "Steel installed in the new opening, supported, plastered. Both rooms stripped, partition wall removed. Services capped.",
        },
        {
          phase: "Week 1–2 · First fix",
          detail:
            "Gas, water and waste re-routed for the new island position, downdraft duct run laid in screed, electrical first-fix for the new open space.",
        },
        {
          phase: "Week 3 · Units fitted",
          detail:
            "Walnut bespoke carcasses delivered and fitted in sequence. Island assembled in position around the downdraft chassis. Doors hung last.",
        },
        {
          phase: "Late week 3 – week 4 · Marble template + fit",
          detail:
            "Marble templated end of week three after units were in. Slab machined off-site for the bookmatched vein. Fitted on site week four — waterfall ends, dining extension run continuous with the worktop.",
        },
        {
          phase: "End of week 4 · Flooring + handover",
          detail:
            "Herringbone engineered oak laid across the new open space, scotia and threshold strips, appliances integrated and commissioned, full clean and handover.",
        },
      ],
      materials: [
        "Light oak bespoke cabinetry with fluted island return",
        "Full-slab marble worktop, book-matched, waterfall ends, dining extension run",
        "Herringbone engineered oak flooring across the open footprint",
        "Induction hob with island downdraft extractor",
        "Integrated double oven, fridge-freezer and dishwasher",
        "Brushed-brass mixer tap (matched to the brassware on the prep sink)",
        "Internal RSJ for the new open structural opening",
      ],
      outcome:
        "What was two cramped, dated rooms is now a single open-plan kitchen-diner where the family hosts every weekend. The downdraft extractor keeps the island sightline clean from the dining end of the room. Marble worktop and the dining extension read as one continuous slab.",
    },
  },
  // ——— Real-photography projects (May 2026 client batch) ———————————————
  // Locations are region-level and durations are omitted until the owner
  // confirms the real values — never invent either. Images built by
  // scripts/build-real-projects.mjs.
  {
    title: "Porcelain Patio & Garden Transformation",
    category: "Landscaping",
    location: "Hertfordshire",
    summary:
      "Large-format porcelain laid level off the house, a crisp artificial lawn and timber sleeper beds planted along the boundary — finished with LED edge lighting so the garden earns its keep after dark.",
    services: [
      "Porcelain patio",
      "Artificial lawn",
      "Sleeper planting beds",
      "LED edge lighting",
    ],
    duration: "",
    variant: 3,
    beforeVariant: 0,
    icon: "build",
    image: "/projects/garden-transformation.webp",
    // 16:9 lightbox hero (sky trimmed so the porcelain stays in frame).
    afterImage: "/projects/garden-transformation-wide.webp",
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
  // ——— ALL GENUINE MyBuilder reviews ————————————————————————————————————
  // Text lightly edited at the owner's direction: personal references to
  // the principal are replaced with the company name (pronouns harmonised);
  // sentiment, substance, ratings, jobs, locations and dates are unchanged
  // and each entry maps 1:1 to a real review on the profile below.
  // Source: https://www.mybuilder.com/profile/view/ns_tiling_solutions
  // (displays as "Nicolla Contractors Ltd", Kings Langley — 4.9/5, 115
  // reviews, Verified by MyBuilder). Jobs/dates/locations exactly as
  // published. Display names: the public username, softened to a first name
  // only where the username unambiguously contains one (e.g. sunita67563 →
  // Sunita). Headlines are verbatim phrases lifted from each review.
  {
    name: "Homeowner",
    location: "Watford",
    rating: 5,
    headline: "Not a single thing I can fault",
    quote:
      "I wanted to make sure I was giving an honest review so I waited to really put the new bathroom to the test... There is not a single thing I can fault! The Nicolla Contractors team were excellent at communication, timekeeping and professional in all manners. They gave some unreal advice on the best products and materials to use within the bathroom for a long lasting high end finish. … Nothing was ever too much trouble and I can not recommend them enough. … I HIGHLY HIGHLY recommend!",
    job: "Bathroom remodel",
    date: "May 2024",
  },
  {
    name: "Private Client",
    location: "Aylesbury",
    rating: 5,
    headline: "It looks very high-end",
    quote:
      "The Nicolla Contractors team came and did the plumbing, tiling, and furniture fixing for a bathroom renovation for us… I hired Nicolla Contractors because they were the most honest of all the tradesmen I met with. … I have a very high attention to detail, which the team was very capable to meet. … Their finish was excellent, and it looks very high-end. It is exactly how we wanted it.",
    job: "Bathroom renovation",
    date: "March 2019",
  },
  {
    name: "Building Contractor",
    location: "Slough",
    rating: 5,
    headline: "One of the best tiling contractors I've seen",
    quote:
      "I'm a building contractor running major refurbishments, renovations and extensions. The Nicolla Contractors team has more than impressed me… my projects demand high end finishes so we are very selective with trades, especially finishing trades. Nicolla Contractors has passed with flying colours. Great communication, they listen to requirements and their finished product is second to none… I've been in building 32 years and they are one of the best tiling contractors I've seen or had the pleasure of working with.",
    job: "3 en suite bathrooms, kitchen & floors",
    date: "November 2018",
  },
  {
    name: "Sunita",
    location: "Uxbridge",
    rating: 5,
    headline: "The best builder I have come across",
    quote:
      "Having had three houses refurbished and being particularly fussy, I would like to say that Nicolla Contractors have been the best builders I have come across. They are punctual, get on with the job, and their workmanship is carefully carried out with a flawless finish. … My family and friends have already requested that Nicolla Contractors also complete their building work. May I add they are also trustworthy — this was paramount to my family.",
    job: "Flooring in open plan kitchen and living room",
    date: "February 2019",
  },
  {
    name: "Private Client",
    location: "Pinner",
    rating: 5,
    headline: "The finish was top class",
    quote:
      "Great working with Nicolla Contractors. Communication fantastic, they left no mess and the finish was top class. They accommodated requests that came up during the build in a sensible way. Would definitely recommend and use again. Thank you Nicolla Contractors.",
    job: "Bathroom, kitchen renovation & boiler replacement",
    date: "March 2024",
  },
  {
    name: "Robin",
    location: "Uxbridge",
    rating: 5,
    headline: "They treated the job like it was their own house",
    quote:
      "The Nicolla Contractors team just completed an outdoor tiling job which had a few tricky areas which needed some special attention. I have to say I am so impressed with the end result. The guys worked tirelessly over three days to get the job done and were clinical in making every last bit perfect. They really treated the job like it was their own house which is a rare attribute these days. I cannot recommend Nicolla Contractors enough…",
    job: "Tiling for kitchen, hallway and patio",
    date: "May 2020",
  },
  {
    name: "Amanda",
    location: "Gerrards Cross",
    rating: 5,
    headline: "Everything you could want",
    quote:
      "The Nicolla Contractors team were everything you could want in a decorator. Always very polite, extremely hardworking, on a couple of days even putting in a 12-hour day, and excellent attention to detail. They left the place beautifully tidy as well as beautifully decorated. A great team.",
    job: "Painting & decorating house ready for sale",
    date: "October 2023",
  },
  {
    name: "Homeowner",
    location: "Gerrards Cross",
    rating: 5,
    headline: "Left it spotless",
    quote:
      "The Nicolla Contractors team did a very good job laying new laminate flooring to my kitchen and hallway. They were very tidy cleaning up after they finished and left it spotless. Always arrived on time. I was very pleased with the final result. … Would have no hesitation in recommending this company to people — they are very good tradesmen.",
    job: "Fitting new laminate flooring to kitchen and hallway",
    date: "April 2024",
  },
  {
    name: "Dorothy",
    location: "Watford",
    rating: 5,
    headline: "Finished the job beautifully",
    quote:
      "The Nicolla Contractors team were very professional. Turned up when they said, replied promptly to email queries. Finished the job beautifully. All in all a job well done.",
    job: "Engineered wood flooring in lounge",
    date: "June 2021",
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

// All reputation figures derive from src/lib/site.ts (the single source of
// verified business data) so they can never drift from the MyBuilder profile.
export const stats: Stat[] = [
  { value: site.rating, decimals: 1, suffix: "/5", label: "Average rating" },
  { value: site.clientsServed, suffix: "+", label: "Happy clients" },
  { value: site.yearsExperience, suffix: "+", label: "Years experience" },
  { value: site.projectsCompleted, suffix: "+", label: "MAJOR PROJECTS COMPLETED" },
];

export type Badge = { icon: IconName; title: string; sub: string };

export const badges: Badge[] = [
  { icon: "star", title: `${site.rating} / 5 Rated`, sub: `${site.reviewCount}+ reviews` },
  { icon: "shield", title: "Fully Insured", sub: "Workmanship guaranteed" },
  { icon: "clock", title: "Always On Time", sub: "Reliable & punctual" },
  { icon: "broom", title: "Clean & Tidy", sub: "We respect your home" },
];
