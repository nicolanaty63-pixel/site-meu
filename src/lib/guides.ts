// Cost-guide cluster. Each guide is a substantive (~800-1200 word) editorial
// piece targeted at informational/early-buying-intent queries that don't
// convert directly but feed authority into the service pillars at
// /services/[slug]. Price figures are publicly known UK trade-market ranges
// (as published by Checkatrade, MyBuilder, Which? at time of writing) with
// explicit "indicative" hedging — never quoted as fixed prices.

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  priceTable?: {
    caption?: string;
    rows: Array<{ label: string; range: string; notes?: string }>;
  };
};

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Service pillar this guide supports — used for the cross-link and
   *  in-content breadcrumb back to the relevant pillar. */
  serviceSlug: string;
  publishedDate: string;
  lastUpdated: string;
  sections: GuideSection[];
  faqs: Array<{ q: string; a: string }>;
  /** Short label used in service-pillar CTAs. */
  ctaLabel: string;
};

export const guides: Guide[] = [
  // ────────────────────────────────────────────────────────────────────
  {
    slug: "bathroom-renovation-cost-uk",
    title: "Bathroom Renovation Cost UK: 2026 Pricing Guide",
    metaTitle:
      "Bathroom Renovation Cost UK 2026 — Honest Pricing Guide",
    metaDescription:
      "How much does a bathroom renovation cost in the UK in 2026? Indicative ranges for small, mid and luxury bathrooms — what affects the price, full breakdown by trade and material.",
    intro:
      "Planning a bathroom renovation and trying to get a feel for the budget before you ring round for quotes? Here's an honest, no-nonsense guide to typical UK bathroom renovation costs in 2026 — what you'd pay for a small en-suite, a standard family bathroom or a luxury spa-style refit, and what really moves the price up or down.",
    serviceSlug: "bathroom-renovations",
    publishedDate: "2026-05-29",
    lastUpdated: "2026-05-29",
    ctaLabel: "See bathroom renovation cost guide",
    sections: [
      {
        heading: "Typical UK bathroom renovation costs (indicative)",
        paragraphs: [
          "Bathroom renovation prices vary widely — the size of the room, the specification of the fittings and how much building work is involved all push the figure significantly. The ranges below are typical 2026 UK prices for a complete bathroom renovation including labour, materials, plumbing and electrics. They're indicative, not fixed — every project should be quoted properly after a site visit.",
        ],
        priceTable: {
          caption: "Full bathroom renovation, supplied and fitted",
          rows: [
            {
              label: "Small bathroom / en-suite (basic spec)",
              range: "£5,000 – £8,000",
              notes:
                "Like-for-like rip-out, mid-range fittings, standard ceramic tiles, no layout changes.",
            },
            {
              label: "Standard family bathroom (mid-range)",
              range: "£8,000 – £15,000",
              notes:
                "Quality fittings, porcelain tiles to floor + walls, possibly small layout tweaks.",
            },
            {
              label: "Premium / spa-style bathroom",
              range: "£15,000 – £30,000",
              notes:
                "Walk-in shower, freestanding bath, large-format porcelain or natural stone, underfloor heating, premium hardware.",
            },
            {
              label: "Luxury / wet room with full rebuild",
              range: "£30,000 – £60,000+",
              notes:
                "Structural changes, bespoke joinery, top-tier brassware (e.g. Vola, Lefroy Brooks), full tanking, smart controls.",
            },
          ],
        },
      },
      {
        heading: "What actually drives the cost",
        paragraphs: [
          "Two bathrooms of the same square-metre can quote very differently. The big drivers are usually a combination of building work, fitting choices and tile spec.",
        ],
        bullets: [
          "**Walls or services moving.** Knocking out a stud wall, repositioning soil pipes or moving the toilet across the room adds builder + plumber days and almost always needs Building Control sign-off.",
          "**Tile choice.** Standard ceramic walls can be tiled in a day; large-format porcelain on the floor with herringbone walls is 3–5 times the labour at a higher material cost.",
          "**Walk-in shower vs enclosure.** A walk-in or wet room needs proper falls in the floor, full tanking and frameless glass — premium look, premium cost. A standard quadrant enclosure is a fraction.",
          "**Underfloor heating.** Electric mat retrofit on top of the existing floor is the most affordable; wet UFH from a manifold is more expensive but more efficient long-term.",
          "**Brassware brand.** A full set of premium taps + shower mixer + waste from a brand like Hansgrohe or Vola can be £2,000–£8,000 of the budget alone.",
          "**Bath choice.** A standard acrylic bath is £200–£400; a freestanding stone-composite bath is £1,500–£4,000+ and needs a stronger floor.",
        ],
      },
      {
        heading: "Cost breakdown by trade and material",
        paragraphs: [
          "For a typical £10,000–£15,000 mid-range bathroom renovation in the UK, here's roughly how the budget splits. Percentages vary, but the proportions are a useful sanity check when comparing quotes.",
        ],
        priceTable: {
          caption: "Typical share of a mid-range bathroom budget",
          rows: [
            { label: "Labour (plumber, tiler, builder, electrician)", range: "40–50%" },
            { label: "Tiles + waterproofing materials", range: "15–25%" },
            { label: "Sanitaryware (bath, basin, toilet, shower)", range: "12–18%" },
            { label: "Brassware (taps, mixer, waste)", range: "8–15%" },
            { label: "Underfloor heating + electrics", range: "5–10%" },
            { label: "Sundries + waste removal", range: "2–5%" },
          ],
        },
      },
      {
        heading: "How long it takes",
        paragraphs: [
          "Most full bathroom renovations take 1–2 weeks on site once trades start. A simple like-for-like swap can be done in 4–5 days; a walk-in shower with underfloor heating and large-format porcelain typically runs closer to 10–14 days. Wet rooms or projects with layout changes can stretch to 3 weeks with the curing time for waterproofing membranes and screeds.",
        ],
      },
      {
        heading: "Getting a realistic quote",
        paragraphs: [
          "Online cost calculators give you a rough range but a real quote needs a site visit. A good contractor will measure up, ask what fittings you have in mind (or recommend ranges to suit your budget), check the existing pipework and walls, and come back with a written quote that itemises labour, materials and any provisional sums for things that can't be confirmed until the room is stripped.",
          "Beware of quotes that don't break down the cost — you'll have no way to compare like-for-like with the next builder. And ignore anyone who gives you a fixed price over the phone before they've seen the room. The variance between bathrooms is too high for that to be honest.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a small bathroom renovation cost in the UK?",
        a: "A small bathroom or en-suite renovation with mid-range fittings typically costs £5,000–£8,000 in the UK in 2026, assuming a like-for-like layout and standard ceramic tiling. Add walk-in showers, underfloor heating or large-format porcelain and the figure rises into the £8,000–£12,000 range.",
      },
      {
        q: "Is it cheaper to do a like-for-like bathroom or move things around?",
        a: "Like-for-like is significantly cheaper. Keeping the toilet, bath and basin in their existing positions saves plumber days, avoids touching the soil stack and usually keeps the project on the side of permitted development — no Building Control involvement. Moving fittings can add £1,500–£4,000 to the total.",
      },
      {
        q: "How much does a luxury bathroom cost in the UK?",
        a: "A luxury or spa-style bathroom in 2026 typically falls in the £15,000–£30,000 range and can exceed £50,000 for premium brassware (Vola, Lefroy Brooks), bespoke joinery, natural stone walls and full wet-room conversions with structural work.",
      },
      {
        q: "How long does a bathroom renovation take?",
        a: "Most full bathroom renovations take 1–2 weeks on site, with simple swaps closer to 4–5 days and complex wet rooms with layout changes running 2–3 weeks. Waterproofing membranes and screeds need curing time, so rushing the programme is rarely possible.",
      },
      {
        q: "Is underfloor heating worth fitting?",
        a: "On stone or porcelain floors, yes — it transforms how the room feels underfoot and is affordable on a small footprint (£400–£900 for an electric mat retrofit). Wet underfloor heating is more efficient long-term but needs a manifold connection and is significantly more to install.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "kitchen-renovation-cost-uk",
    title: "Kitchen Renovation Cost UK: 2026 Pricing Guide",
    metaTitle:
      "Kitchen Renovation Cost UK 2026 — Honest Pricing Guide",
    metaDescription:
      "Typical UK kitchen renovation costs in 2026 — standard, bespoke and luxury price ranges, what affects the figure, breakdown by units, worktops, appliances and labour.",
    intro:
      "Kitchen renovation costs in the UK range from a few thousand pounds for a basic carcass swap to well over £50,000 for a bespoke kitchen-diner. This guide breaks down typical 2026 prices, where the money actually goes, and the choices that move the budget up or down sharply.",
    serviceSlug: "kitchen-renovations",
    publishedDate: "2026-05-29",
    lastUpdated: "2026-05-29",
    ctaLabel: "See kitchen renovation cost guide",
    sections: [
      {
        heading: "Typical UK kitchen renovation costs (indicative)",
        paragraphs: [
          "Kitchen prices depend heavily on three things: who's making the units, what the worktop is, and whether the layout is changing. The ranges below are typical 2026 UK prices for a complete kitchen renovation including supply, fitting, basic plumbing and electrics.",
        ],
        priceTable: {
          caption: "Full kitchen renovation, supplied and fitted",
          rows: [
            {
              label: "Standard / trade-brand kitchen",
              range: "£8,000 – £15,000",
              notes:
                "Trade or high-street brand units (Howdens, B&Q, IKEA), laminate worktop, like-for-like layout, mid-range integrated appliances.",
            },
            {
              label: "Mid-range / quality fitted kitchen",
              range: "£15,000 – £30,000",
              notes:
                "Quality trade brand or mid-tier supplier, quartz worktop, shaker or modern slab doors, brand-name appliances (Bosch, Neff).",
            },
            {
              label: "Bespoke or premium fitted kitchen",
              range: "£30,000 – £60,000",
              notes:
                "Bespoke joinery, full-length quartz/granite/porcelain worktops, premium appliances (Miele, Wolf), island, possibly a layout change.",
            },
            {
              label: "Luxury / kitchen-diner conversion",
              range: "£60,000 – £150,000+",
              notes:
                "Structural opening (RSJ), top-tier bespoke joinery, premium stone, Sub-Zero / La Cornue appliances, integrated AV, full kitchen-diner build.",
            },
          ],
        },
      },
      {
        heading: "What actually drives the cost",
        paragraphs: [
          "The same square-metre kitchen can quote anywhere across the ranges above depending on a handful of decisions. The biggest swings come from the unit supplier and the worktop.",
        ],
        bullets: [
          "**Unit supplier.** Trade kitchens (Howdens, Magnet) come in at one price; high-street modular (IKEA, Wren) at another; UK bespoke makers (Plain English, deVOL) at multiples again. Bespoke is roughly 3–5× a trade kitchen of the same footprint.",
          "**Worktop material.** Laminate £400–£900 per kitchen; quartz £2,000–£5,000; book-matched veined porcelain or marble slabs can be £6,000–£15,000+.",
          "**Layout changes.** Moving the sink, hob or fridge a couple of metres adds plumber and electrician days. Knocking a wall through for an open-plan kitchen-diner adds a structural engineer, an RSJ, Building Control sign-off and significantly more building work.",
          "**Appliances.** A budget integrated package can be £1,500–£3,000; a brand-name premium spec (Bosch series 8, Neff N90, Quooker) typically £4,000–£8,000; luxury (Miele, Wolf, Sub-Zero) can run £15,000–£40,000+.",
          "**Island vs no island.** Adding a proper island typically adds £3,000–£8,000 to the units + worktop, plus services if it has a hob or sink.",
        ],
      },
      {
        heading: "Cost breakdown by component",
        paragraphs: [
          "For a typical £20,000 mid-range fitted kitchen with quartz worktops, here's roughly how the budget splits.",
        ],
        priceTable: {
          caption: "Typical share of a mid-range kitchen budget",
          rows: [
            { label: "Cabinets / carcasses + doors", range: "30–40%" },
            { label: "Worktop (quartz typical)", range: "15–25%" },
            { label: "Appliances (integrated)", range: "15–25%" },
            { label: "Fitting labour (joiner + plumber + electrician + tiler)", range: "20–30%" },
            { label: "Splashbacks + tiling", range: "3–7%" },
            { label: "Sink + tap", range: "3–6%" },
          ],
        },
      },
      {
        heading: "How long it takes",
        paragraphs: [
          "A typical fitted kitchen is 2–3 weeks on site. Quartz worktops are templated only after the units are in, then fitted around a week later, so the kitchen is usable some way before the very last fix. Bespoke kitchens take longer — joinery lead times alone can be 8–12+ weeks before fitting even starts. Knock-through projects with structural openings add 2–4 weeks at the front for the structural work, plastering and curing.",
        ],
      },
      {
        heading: "Getting a realistic quote",
        paragraphs: [
          "Kitchens are one of the easier projects to compare apples-to-apples: ask each contractor to itemise units, worktop, appliances, fitting labour, splashback, plumbing/electrical changes and waste removal. Make sure the appliance spec matches across quotes — \"integrated dishwasher\" can mean a £350 own-brand unit or a £1,400 Miele, and the price gap is real.",
          "Most reputable contractors will quote off your designer's plans (or generate plans with you in the kitchen-supplier showroom). Avoid finalising your unit choice until you've had a contractor walk the room — a layout that works on paper sometimes doesn't survive contact with where the soil stack actually runs.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a new kitchen cost in the UK in 2026?",
        a: "A complete fitted kitchen in the UK typically costs £8,000–£15,000 for a standard trade-brand kitchen, £15,000–£30,000 for a quality mid-range fit with quartz worktops, and £30,000–£60,000+ for bespoke joinery with premium appliances. Luxury or kitchen-diner conversions can exceed £100,000.",
      },
      {
        q: "Is it cheaper to keep the existing kitchen layout?",
        a: "Yes — significantly. Like-for-like layouts keep the existing plumbing and electrical positions, avoid touching gas connections, and skip Building Control involvement. Moving the sink or hob a couple of metres typically adds £1,000–£3,000; knocking through to create an open-plan kitchen-diner can add £8,000–£25,000+ for the structural work alone.",
      },
      {
        q: "How long does a kitchen renovation take?",
        a: "A typical fitted kitchen is 2–3 weeks on site. Bespoke kitchens take longer because of joinery lead times (8–12+ weeks before fit). Projects involving a structural knock-through add 2–4 weeks at the front of the programme.",
      },
      {
        q: "What's the cheapest part of a kitchen to upgrade later?",
        a: "Handles, taps and splashback tiles are inexpensive upgrades you can phase later. Worktops, cabinets and integrated appliances are much harder to swap once fitted — so it's worth getting those right at the start even if it stretches the budget.",
      },
      {
        q: "Do I need building regs for a new kitchen?",
        a: "A like-for-like swap doesn't trigger Building Regs. Gas hob installation and any new electrical work must be certified (Gas Safe and Part P respectively). Knock-throughs, new structural openings or relocating drainage do need Building Control sign-off — your builder should manage this as part of the project.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "tiling-cost-uk",
    title: "Tiling Cost UK: 2026 Per-Square-Metre and Project Guide",
    metaTitle: "Tiling Cost UK 2026 — Per sqm and Project Pricing",
    metaDescription:
      "How much does tiling cost in the UK in 2026? Per-square-metre rates for porcelain, natural stone and large-format tiles, typical bathroom and kitchen tiling project costs.",
    intro:
      "Tiling costs in the UK are usually quoted per square metre, but the per-sqm rate hides a lot of variables — tile size, lay pattern, substrate preparation and grouting choices all push the figure up or down. Here's a clear 2026 breakdown of typical UK tiling costs.",
    serviceSlug: "tiling",
    publishedDate: "2026-05-29",
    lastUpdated: "2026-05-29",
    ctaLabel: "See tiling cost guide",
    sections: [
      {
        heading: "Typical UK tiling costs (per sqm, indicative)",
        paragraphs: [
          "Per-sqm rates separate labour (fitting) from materials (tiles, adhesive, grout). Both move depending on the tile and the room, so the realistic way to compare quotes is by total project cost — but the table below gives a starting frame for what you should be paying.",
        ],
        priceTable: {
          caption: "Labour-only tiling rates (supply not included)",
          rows: [
            {
              label: "Standard ceramic, straight lay",
              range: "£30 – £45/sqm",
              notes: "Simple bathroom or splashback work, square edges, basic grout.",
            },
            {
              label: "Porcelain, straight lay",
              range: "£40 – £60/sqm",
              notes: "Most common bathroom + kitchen tile; harder to cut than ceramic.",
            },
            {
              label: "Large-format (600×1200mm+) porcelain or slab",
              range: "£60 – £100/sqm",
              notes:
                "Needs back-buttering, S1/S2 adhesive, rail-cutter and two-person handling. Far higher skill requirement.",
            },
            {
              label: "Natural stone (marble, travertine, limestone)",
              range: "£55 – £85/sqm",
              notes: "Plus sealing and edge work; slower to cut and grout.",
            },
            {
              label: "Mosaic / zellige / herringbone lay",
              range: "£60 – £110/sqm",
              notes: "Pattern lays take 1.5–2× a straight lay. Mosaics charged by area but very labour-intensive.",
            },
          ],
        },
      },
      {
        heading: "Typical tiling project costs",
        paragraphs: [
          "Most homeowners want a project number rather than a per-sqm figure. Below are typical 2026 UK ranges for common projects, including labour and standard adhesive/grout (tiles supplied separately unless noted).",
        ],
        priceTable: {
          caption: "Project rates — fitting only",
          rows: [
            {
              label: "Bathroom — walls + floor, standard porcelain",
              range: "£1,200 – £2,500",
              notes: "Typical 4–5 day fitting programme for a 6–8 sqm bathroom.",
            },
            {
              label: "Bathroom — walls + floor, large-format porcelain",
              range: "£1,800 – £3,800",
              notes: "Same room, premium tile + lay pattern + more cutting waste.",
            },
            {
              label: "Kitchen splashback (single wall)",
              range: "£250 – £700",
              notes: "Depends on tile size and pattern.",
            },
            {
              label: "Wet-room floor + walls with tanking",
              range: "£2,500 – £5,500",
              notes: "Includes proper falls, tanking membrane and silicone-finished corners.",
            },
            {
              label: "Hallway / living-room floor (~20 sqm)",
              range: "£900 – £2,000",
              notes: "Adds self-levelling compound prep if subfloor is out of spec.",
            },
          ],
        },
      },
      {
        heading: "What affects the per-sqm rate",
        paragraphs: [
          "Two tilers with the same hourly rate can quote very differently on the same room. The drivers are usually:",
        ],
        bullets: [
          "**Tile size.** Bigger tiles cover more area but take longer to handle and cut. Anything above 600×600mm typically pushes the per-sqm labour up.",
          "**Lay pattern.** Straight lay is the baseline; brick-bond adds a little; herringbone, chevron or diagonal lay adds 30–60% to the labour because of the extra cuts and setting-out.",
          "**Substrate prep.** A flat, primed wall is quick to tile. Old plaster that needs taking back, uneven floors needing self-leveller, or hollow tiles that have to come off first all add days.",
          "**Tile material.** Natural stone is slower to cut cleanly and most need sealing before grouting. Porcelain is harder than ceramic — wet-saws are essential for clean cuts.",
          "**Grout choice.** Standard cement grout is included in most labour quotes; epoxy grout (much more durable in wet areas but harder to work with) adds material cost and labour time.",
        ],
      },
      {
        heading: "Hidden costs to ask about",
        paragraphs: [
          "Three things sometimes appear as extras after a tiling quote is accepted: waste removal of the old floor or tiles, self-levelling compound if the substrate needs it, and silicone finishing in internal corners. None of these are unreasonable to charge for — but they should be itemised at quote stage, not invoiced as surprises.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does tiling cost per square metre in the UK?",
        a: "Tiling labour in the UK typically costs £30–£45/sqm for standard ceramic, £40–£60/sqm for porcelain, £60–£100/sqm for large-format porcelain or slab tiles, and £55–£85/sqm for natural stone. Pattern lays (herringbone, chevron) add 30–60% to the straight-lay rate.",
      },
      {
        q: "How much does it cost to tile a bathroom?",
        a: "Tiling labour for a standard 6–8 sqm bathroom with porcelain walls and floor typically costs £1,200–£2,500 in the UK in 2026. Large-format porcelain or pattern lays push the figure to £1,800–£3,800. Tiles supplied separately.",
      },
      {
        q: "Is large-format tiling more expensive?",
        a: "Yes. Large-format tiles (600×1200mm and slabs) need back-buttering, deformable adhesive, specialist rail-cutters and usually two people to handle. Labour rates are typically £60–£100/sqm — 50–70% higher than standard porcelain — but the finished look is genuinely premium and joints are far fewer.",
      },
      {
        q: "Do I need to seal natural stone tiles?",
        a: "Yes. Natural stone (marble, limestone, travertine) needs sealing before grouting and again after, plus periodic re-sealing depending on traffic. A good tiler will price the sealer in; ask for the product name so you can buy more for future maintenance.",
      },
      {
        q: "Can you tile over existing tiles?",
        a: "Sometimes — but only if the existing tiles are sound, well-bonded, flat and primed correctly. On a good substrate it saves stripping cost; if any tiles are hollow or there's any movement, it's a false economy and the right move is to strip and start clean.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "flooring-installation-cost-uk",
    title: "Flooring Installation Cost UK: 2026 Per-Square-Metre Guide",
    metaTitle: "Flooring Installation Cost UK 2026 — Per sqm Guide",
    metaDescription:
      "UK 2026 flooring installation costs — LVT, engineered wood, solid wood, laminate per sqm rates, project costs and what drives the price.",
    intro:
      "Flooring installation costs in the UK depend on the material, the room and the level of subfloor prep needed. This guide covers per-sqm rates and typical project costs for laminate, LVT, engineered wood and solid wood — plus the patterns and prep work that move the price.",
    serviceSlug: "laminate-flooring",
    publishedDate: "2026-05-29",
    lastUpdated: "2026-05-29",
    ctaLabel: "See flooring installation cost guide",
    sections: [
      {
        heading: "Typical UK flooring costs (per sqm, indicative)",
        paragraphs: [
          "Per-sqm rates below include labour and standard underlay; the floor itself is supplied separately. Pattern lays (herringbone, chevron) add 30–50% to the straight-plank rate.",
        ],
        priceTable: {
          caption: "Labour-only fitting rates (excludes floor + skirting)",
          rows: [
            {
              label: "Laminate, straight plank lay",
              range: "£10 – £18/sqm",
              notes: "Quickest material to fit; most cost-effective option.",
            },
            {
              label: "LVT click or glue-down",
              range: "£18 – £35/sqm",
              notes: "Click is faster; glue-down is more stable for wet areas + UFH.",
            },
            {
              label: "Engineered wood, straight plank lay",
              range: "£20 – £35/sqm",
              notes: "Standard straight-plank in 180–220mm widths.",
            },
            {
              label: "Solid wood, straight plank lay",
              range: "£25 – £45/sqm",
              notes: "Slower to acclimatise; secret-nail or glue-down installs.",
            },
            {
              label: "Engineered or solid wood, herringbone / chevron",
              range: "£35 – £70/sqm",
              notes: "Pattern lay adds significant labour; subfloor levelling must be precise.",
            },
            {
              label: "Self-levelling subfloor preparation",
              range: "£12 – £25/sqm",
              notes: "Add-on when the existing subfloor is out of spec.",
            },
          ],
        },
      },
      {
        heading: "Typical project costs",
        paragraphs: [
          "Below are ballpark project rates — labour only, with the floor itself supplied separately.",
        ],
        priceTable: {
          caption: "Project rates — fitting only",
          rows: [
            {
              label: "Single living room (~20 sqm) — laminate",
              range: "£250 – £500",
              notes: "Quick straight-plank lay, basic underlay.",
            },
            {
              label: "Single living room (~20 sqm) — engineered wood",
              range: "£500 – £900",
              notes: "Standard plank in mid-grade engineered.",
            },
            {
              label: "Hallway + landing — engineered wood herringbone",
              range: "£900 – £2,200",
              notes: "Pattern lay over levelled subfloor, mitred returns at doorways.",
            },
            {
              label: "Open-plan living/dining (~40 sqm) — LVT",
              range: "£800 – £1,800",
              notes: "Glue-down LVT for stability over the larger run.",
            },
            {
              label: "Whole-floor refit (~80 sqm) — engineered wood straight lay",
              range: "£2,200 – £4,500",
              notes: "Excludes subfloor self-leveller, skirting and threshold trims.",
            },
          ],
        },
      },
      {
        heading: "What drives the price",
        paragraphs: [
          "Beyond the material itself, the things that change a flooring quote are:",
        ],
        bullets: [
          "**Subfloor condition.** A flat, dry, level subfloor is quick to floor over. A wavy concrete slab, hollow chipboard or old residual adhesive can need self-levelling, plywood overlay or strip-out — easily £400–£1,500 added on a medium room.",
          "**Pattern lay.** Herringbone, chevron or diagonal patterns are about 1.5–2× the labour of a straight plank lay because of the extra cuts, setting-out and mitred returns at doorways.",
          "**Skirting + trims.** Removing and refitting skirting (or fitting scotia + threshold strips) is often quoted separately — clarify if it's included or not.",
          "**Old floor removal.** Lifting carpet is fast; removing old laminate is moderate; chipping out original tiles is slow and dusty. Each impacts the total programme.",
          "**Underfloor heating compatibility.** Engineered wood and LVT both work over UFH but need a specific build-up + acclimatisation. Solid wood is typically not recommended over UFH.",
        ],
      },
      {
        heading: "Material cost ranges to budget for",
        paragraphs: [
          "Floors are sold per pack but trade prices per sqm give you something to plan against. Standard UK 2026 ranges, supplied (not fitted):",
        ],
        priceTable: {
          caption: "Indicative material costs (supply only)",
          rows: [
            { label: "Laminate (AC4-AC5, mid-range)", range: "£12 – £35/sqm" },
            { label: "LVT (mid-range brand)", range: "£25 – £55/sqm" },
            { label: "Engineered wood (oak, 14–20mm)", range: "£35 – £90/sqm" },
            { label: "Solid wood (oak, 18–22mm)", range: "£45 – £120/sqm" },
            { label: "Underlay (acoustic 3–5mm)", range: "£3 – £10/sqm" },
          ],
        },
      },
    ],
    faqs: [
      {
        q: "How much does it cost to install flooring per sqm in the UK?",
        a: "UK 2026 labour rates per square metre are roughly: laminate £10–£18, LVT £18–£35, engineered wood £20–£35, solid wood £25–£45, and herringbone / chevron pattern lays £35–£70. These exclude the floor itself, skirting and threshold trims.",
      },
      {
        q: "Is laminate cheaper to install than engineered wood?",
        a: "Yes — usually about half the labour per sqm for the install itself, and the materials are also cheaper (£12–£35/sqm for laminate vs £35–£90/sqm for engineered wood). The trade-off is feel and longevity: AC4–AC5 laminate lasts 10–20 years; engineered wood typically 25–40 years and can be re-sanded once.",
      },
      {
        q: "How much extra is herringbone or chevron pattern flooring?",
        a: "Pattern lays typically add 30–50% to the straight-plank labour rate because of the extra setting-out and cuts. On a 20 sqm room, that's £200–£500 extra in labour, plus more material waste (figure 10–15% more boards).",
      },
      {
        q: "Do I need to level my subfloor?",
        a: "If it's out of spec — yes. Most flooring manufacturers specify a tolerance (typically 3mm over 2m). Out-of-tolerance subfloors telegraph through the finished floor and void the warranty. Self-levelling compound costs £12–£25/sqm fitted and is one of those things it's a false economy to skip.",
      },
      {
        q: "Will my new floor work over underfloor heating?",
        a: "Engineered wood and LVT work brilliantly over UFH. Most click laminates are also UFH-compatible at the right thickness. Solid wood is generally not recommended over UFH — it's too prone to movement. Confirm the specific product's UFH rating before purchase.",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  {
    slug: "home-refurbishment-cost-uk",
    title: "Home Refurbishment Cost UK: 2026 Whole-House Guide",
    metaTitle: "Home Refurbishment Cost UK 2026 — Whole House Guide",
    metaDescription:
      "How much does it cost to refurbish a house in the UK in 2026? Whole-house refurbishment ranges, per-room costs and what drives the budget on a full refurb.",
    intro:
      "A full home refurbishment can be anywhere from a £40,000 cosmetic refresh to a £400,000+ structural rebuild. This guide is an honest 2026 walk-through of typical UK whole-house refurbishment costs, the per-room rough ranges, and the structural decisions that move the budget hardest.",
    serviceSlug: "home-refurbishment",
    publishedDate: "2026-05-29",
    lastUpdated: "2026-05-29",
    ctaLabel: "See home refurbishment cost guide",
    sections: [
      {
        heading: "Typical UK whole-house refurbishment costs",
        paragraphs: [
          "Whole-house refurb costs are usually quoted per square metre of floor area in the UK, but the spread is wide because what's included can differ massively from project to project. Below are typical 2026 ranges for the three most common scopes.",
        ],
        priceTable: {
          caption: "Whole-house refurbishment ranges",
          rows: [
            {
              label: "Cosmetic refresh (paint, floors, kitchen + bathroom updates)",
              range: "£500 – £900/sqm",
              notes:
                "No structural work; existing layout retained. ~£40k–£90k for a 100 sqm house.",
            },
            {
              label: "Full strip-out refurb (new kitchen, new bathrooms, new floors, rewire, replumb)",
              range: "£1,200 – £1,800/sqm",
              notes:
                "No structural changes but everything inside replaced. ~£120k–£180k for a 100 sqm house.",
            },
            {
              label: "Refurb with structural changes (knock-throughs, extensions)",
              range: "£1,800 – £3,200/sqm",
              notes:
                "Open-plan changes, possibly a side return or rear extension. ~£180k–£320k for a 100 sqm house.",
            },
            {
              label: "Premium / heritage refurb (period property, conservation)",
              range: "£2,500 – £4,500/sqm",
              notes:
                "Listed building consent, conservation-grade materials, full restoration of original features.",
            },
          ],
        },
      },
      {
        heading: "Per-room rough costs to plan against",
        paragraphs: [
          "Most homeowners find it easier to think in rooms than in £/sqm. The figures below are full-spec mid-range works including labour and materials.",
        ],
        priceTable: {
          caption: "Per-room indicative costs (mid-range, supplied + fitted)",
          rows: [
            { label: "Kitchen renovation (standard fitted)", range: "£8,000 – £30,000" },
            { label: "Family bathroom renovation", range: "£8,000 – £15,000" },
            { label: "En-suite renovation", range: "£5,000 – £10,000" },
            { label: "Living/dining room redecorate + new floor", range: "£3,000 – £7,000" },
            { label: "Bedroom redecorate + carpet", range: "£1,500 – £3,500" },
            { label: "Hallway redecorate + new floor", range: "£2,000 – £5,000" },
            { label: "Full house rewire (3-bed)", range: "£5,500 – £9,000" },
            { label: "Full house replumb (3-bed)", range: "£4,500 – £8,500" },
            { label: "Full house plaster (3-bed)", range: "£8,000 – £15,000" },
          ],
        },
      },
      {
        heading: "What drives the refurbishment budget",
        paragraphs: [
          "Refurbs have more cost drivers than any other project type because there are so many trades involved. The big swings:",
        ],
        bullets: [
          "**Structural work.** A single steel beam (RSJ) to open up a kitchen-diner can be £8,000–£20,000 by the time you've paid the structural engineer, the steel, the Building Control fees and the building work either side. Side returns or rear extensions add £40,000–£120,000+.",
          "**Whole-house first fix.** Rewiring + replumbing + central heating refresh on a 3-bed terrace is typically £15,000–£28,000 and is the single biggest first-fix cost most homeowners don't anticipate.",
          "**Kitchen + bathrooms spec.** As covered in the dedicated cost guides, a single bathroom can be £5k or £30k; kitchens range £8k to £60k+. On a full refurb with two bathrooms and a kitchen, this alone can be £25k–£100k+.",
          "**Project management overhead.** A managed refurb (one main contractor handling all trades) typically adds 10–20% over self-managing trades — but for most homeowners this is a sensible cost, because the schedule risk on self-managed refurbs is real.",
          "**Period property surprises.** Plaster lath needing to come off, joists rotted from historic leaks, lead pipes still in place — older houses always have a few. Allow a contingency of 10–15%.",
        ],
      },
      {
        heading: "How long it takes",
        paragraphs: [
          "Programme length matters as much as cost because it affects whether you can live in the house. Indicative durations:",
        ],
        bullets: [
          "Cosmetic refresh: 4–8 weeks",
          "Single-room strip-out (kitchen or bathroom): 2–3 weeks each",
          "Whole-house strip-out refurb: 12–20 weeks",
          "Refurb with structural work: 16–28 weeks",
          "Full Victorian terrace + extension: 28–52+ weeks",
        ],
      },
      {
        heading: "Living in vs moving out",
        paragraphs: [
          "Most homeowners move out for the heavy phase of a full refurb — typically the 4–8 weeks while the kitchen + bathrooms are stripped and the first-fix is happening. Living in is possible for a phased refurb where rooms come back online sequentially, but you'll be living in a building site for months and the contractor will be working around your stuff, which slows them down and costs more.",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does it cost to refurbish a house in the UK in 2026?",
        a: "Typical UK whole-house refurbishment costs in 2026: £500–£900/sqm for a cosmetic refresh, £1,200–£1,800/sqm for a full strip-out refurb, £1,800–£3,200/sqm with structural changes, and £2,500–£4,500/sqm for premium or heritage work. A 100 sqm house is roughly £40k–£90k cosmetic, £120k–£180k full strip-out.",
      },
      {
        q: "Is it cheaper to renovate one room at a time or all at once?",
        a: "All at once is usually 10–20% cheaper. Trades work more efficiently when they can move room to room, scaffolding and skip costs are shared, and project management overhead is one cost not many. The downside is upfront cashflow and the disruption of the whole house being unavailable at once.",
      },
      {
        q: "How long does a full house refurbishment take?",
        a: "A whole-house strip-out refurb typically runs 12–20 weeks on site for a 3-bed UK terrace. Add 4–8 weeks if structural changes are involved (knock-throughs, side return). Heritage or listed-building work can extend significantly because of consents and specialist materials.",
      },
      {
        q: "Can we live in the house during a full refurb?",
        a: "For single-room work — usually yes. For a full refurb with no working kitchen or bathroom for several weeks, most clients move out for the heavy phase. Phased refurbs where rooms come back online sequentially can be lived in, but the schedule will run longer and the cost will be higher because the contractor has to work around occupied rooms.",
      },
      {
        q: "Do I need planning permission for a refurbishment?",
        a: "Internal works don't typically need planning permission, but structural changes (knock-throughs, new openings), extensions and changes affecting the exterior of a listed building or property in a conservation area do. Building Regulations sign-off is needed for any structural opening, new bathrooms, electrical work and heating changes — your contractor should manage these.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
