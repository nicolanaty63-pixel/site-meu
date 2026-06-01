# SEO Strategy — Nicolla Contractors

Living document. Updated as the architecture evolves. Phase 1 shipped on the
commit that introduces this file; Phase 2+ (see *Roadmap*) require approval.

---

## 1. Business + entity

- **Name:** Nicolla Contractors Ltd
- **Type:** GeneralContractor (schema.org)
- **Base:** Kings Langley, Hertfordshire
- **Service regions:** London, North London, Hertfordshire

The single source of truth for the entity is `src/lib/site.ts`. Schema.org
markup in `src/components/Schema.tsx` derives the homepage `GeneralContractor`
+ `WebSite` graph from there; per-page `Service`, `GeneralContractor` (area
scoped), `FAQPage`, `BreadcrumbList`, and `CollectionPage` graphs are emitted
inline in the relevant route files. **Do not duplicate the entity** — extend
the existing schema before adding a new graph.

---

## 2. Search intent map

Six core service clusters, each split by intent. Anchor pages live at
`/services/[slug]`; supporting copy and rich-result eligibility (FAQPage)
live on the same page.

### Bathroom renovation
- **Commercial:** *bathroom renovation, bathroom fitters, bathroom installers*
- **Local commercial:** *bathroom renovation [area], bathroom fitters near me*
- **Long tail:** *spa-style bathroom renovation, walk-in shower installation,
  freestanding bath fitting*
- **Comparison:** *best bathroom renovation company [area]*
- **Informational:** *how long does a bathroom renovation take, bathroom
  renovation cost UK*
- **High-intent:** *bathroom renovation quote, bathroom renovation [area]
  prices, free quote bathroom*

### Kitchen renovation
- **Commercial:** *kitchen renovation, kitchen fitters, bespoke kitchens*
- **Local commercial:** *kitchen renovation [area], kitchen fitters [area]*
- **Long tail:** *shaker kitchen installation, quartz worktop fitting,
  kitchen diner conversion*
- **Comparison:** *best kitchen fitter [area]*
- **Informational:** *kitchen renovation timeline, kitchen renovation cost*
- **High-intent:** *kitchen renovation quote [area]*

### Tiling
- **Commercial:** *tiler, tiling contractor, large-format tiling*
- **Local commercial:** *tiler [area], tiling contractor near me*
- **Long tail:** *porcelain tiling, zellige splashback, herringbone tile lay*
- **Comparison:** *best tiling company [area]*
- **High-intent:** *tiling quote, tiler hire [area]*

### Laminate flooring
- **Commercial:** *laminate flooring installation, laminate flooring installer*
- **Local commercial:** *laminate flooring [area], laminate fitter near me*
- **Long tail:** *acoustic underlay laminate, click-lock laminate, AC4 laminate*
- **Informational:** *how long does laminate flooring last, best laminate*
- **High-intent:** *laminate flooring quote [area]*

### Flooring installation (engineered/LVT/wood)
- **Commercial:** *flooring contractor, engineered wood installer, LVT fitter*
- **Local commercial:** *flooring contractor [area]*
- **Long tail:** *herringbone parquet installation, engineered oak fitting*
- **High-intent:** *flooring installation quote [area]*

### Home refurbishment & general building
- **Commercial:** *home refurbishment, builders, general contractor*
- **Local commercial:** *builders [area], home refurbishment company [area]*
- **Long tail:** *full house renovation, plastering & decorating package,
  partition wall installation*
- **High-intent:** *refurbishment quote [area]*

Each `[area]` slot is filled by the geo cluster below.

---

## 3. Geo architecture

Single area entity at `/areas/[slug]` with a per-area `GeneralContractor`
schema, full service grid (descriptive anchors), nearby-areas crosslinks, and
local social proof.

**Current coverage (10 area pages):**

| Area | County | Slug |
|---|---|---|
| Kings Langley | Hertfordshire | `kings-langley` *(base town)* |
| Watford | Hertfordshire | `watford` |
| St Albans | Hertfordshire | `st-albans` |
| Hemel Hempstead | Hertfordshire | `hemel-hempstead` |
| Rickmansworth | Hertfordshire | `rickmansworth` |
| Berkhamsted | Hertfordshire | `berkhamsted` |
| Bushey | Hertfordshire | `bushey` |
| Harpenden | Hertfordshire | `harpenden` |
| Radlett | Hertfordshire | `radlett` |
| North London | London | `north-london` |

**Anti-pattern we explicitly avoid:**

> **No `/services/[slug]/[area]` combo pages.** 6 services × 10 areas = 60
> thin variants ≡ doorway pages, penalised by Google's site reputation abuse
> guidance. Service + area discoverability is already handled by:
> - `/services/[slug]` listing every area as a descriptive anchor
>   (`Bathroom Renovations in Watford`)
> - `/areas/[slug]` listing every service as a descriptive anchor
>   (`Bathroom Renovations in Watford`)
> - Cross-cluster linking through nearby-areas chips and the global nav

This is the **scalable** local SEO architecture for a 10-area / 6-service
trade business. Combo pages get considered **only** when a specific
service + area combination accumulates measurable real search demand
(check GSC) and we can write genuinely unique content for it.

---

## 4. Schema coverage (live)

| Route | Graph types |
|---|---|
| `/` | `GeneralContractor`, `WebSite` |
| `/services/[slug]` | `Service` (areaServed City[]), `BreadcrumbList`, `FAQPage` |
| `/areas/[slug]` | `GeneralContractor` (City areaServed), `BreadcrumbList` |
| `/projects` | `CollectionPage`, `ItemList` of `CreativeWork`, `BreadcrumbList` |

Future candidates: `Review` / `LocalBusiness` enhancement on `/testimonials`
(unique to that page so no duplication risk).

---

## 5. Internal linking

- **Service → Area:** descriptive anchors (`[Service] in [Area]`)
- **Area → Service:** descriptive anchors (`[Service] in [Area]`)
- **Area → Area (nearby):** descriptive anchors (`Builders in [Area]`)
- **Breadcrumbs:** visible UI on `/services/[slug]` and `/areas/[slug]`,
  plus `BreadcrumbList` schema
- **Global nav:** Home / About / Services / Projects / Testimonials / Contact

---

## 6. Sitemap signals

Priority + changeFrequency reflect commercial intent and content velocity:

| Bucket | Priority | changeFrequency |
|---|---|---|
| Home | 1.0 | weekly |
| `/free-quote`, `/contact` | 0.9 | monthly |
| `/services`, `/areas`, `/projects` | 0.8 | monthly–weekly |
| `/testimonials` | 0.7 | weekly |
| `/services/[slug]` | 0.8 | monthly |
| `/areas/[slug]` | 0.7 | monthly |
| `/about` | 0.6 | monthly |
| Legal | 0.3 | yearly |

---

## 7. Topical authority architecture (shipped)

The cluster system is built on three layers of the existing graph — **no
new thin routes were created.** Authority compounds on the pillars we
already publish.

```
                  ┌──────────────────────────────────────┐
                  │  Homepage  ·  GeneralContractor      │
                  │  knowsAbout: [24 trade subtopics]    │
                  └──────────────────────────────────────┘
                                     │
   ┌──────────┬──────────┬───────────┼──────────┬──────────┬──────────┐
   ▼          ▼          ▼           ▼          ▼          ▼          ▼
[Bath]   [Kitchen]   [Tiling]   [Laminate]  [Flooring]  [Refurb]   [About]
   │          │          │           │          │          │
   │ ─ 5 service-specific FAQs (FAQPage JSON-LD per page)
   │ ─ areaServed: 10 City entities + 3 broader Places
   │ ─ Service schema with provider GeneralContractor
   │ ─ BreadcrumbList + visible Breadcrumbs UI
   │ ─ Descriptive area anchors ("Bathroom Renovations in Watford" × 10)
   │ ─ RelatedServices cluster links (curated 2–3 per pillar)
   │
   └─→ /areas/[slug] × 10 (Hertfordshire + North London)
              │ ─ GeneralContractor schema scoped to the area
              │ ─ Service grid with strong anchors back to pillars
              │ ─ Nearby-area crosslinks
              ▼
        /projects (CollectionPage + ItemList of 7 CreativeWork)
              │ ─ Project modal exposes service tags as deep links
              │   into the relevant pillar (resolved by serviceSlugFor()).
```

**Per-service cluster signals now live:**

| Pillar | Cluster FAQs | Related services | Inbound deep-linking surfaces |
|---|---|---|---|
| Bathroom Renovations | 5 | Tiling, Flooring Installation, Home Refurb | Area pages × 10, Project modal, Schema knowsAbout |
| Kitchen Renovations | 5 | Tiling, Flooring Installation, Home Refurb | Area pages × 10, Project modal, Schema knowsAbout |
| Tiling | 5 | Bathroom, Kitchen, Home Refurb | Area pages × 10, Project modal, Schema knowsAbout |
| Laminate Flooring | 5 | Flooring Installation, Home Refurb, Tiling | Area pages × 10, Project modal, Schema knowsAbout |
| Flooring Installation | 5 | Laminate, Tiling, Home Refurb | Area pages × 10, Project modal, Schema knowsAbout |
| Home Refurbishment | 5 | Bathroom, Kitchen, Flooring | Area pages × 10, Project modal, Schema knowsAbout |

**30 substantive Q&A pairs** are now in the FAQPage graph (was 6 generic
pairs duplicated across all six service pages — same FAQs everywhere is a
near-duplicate-content signal Google can flatten; service-specific
strengthens each pillar independently).

**`knowsAbout`** declares 24 trade subtopics on the homepage
`GeneralContractor` entity — direct semantic relevance signal for queries
that don't include the brand or service-page title.

---

## 8. Cost-guide informational cluster (shipped Phase 3)

A dedicated `/guides/[slug]` cluster targets early-buying-intent
informational queries (e.g. *bathroom renovation cost UK*,
*kitchen renovation cost UK*) that don't convert directly but feed
authority into the commercial pillars at `/services/[slug]`.

**Guides published (5, ~800–1200 words each):**

| Guide | Pillar fed |
|---|---|
| `/guides/bathroom-renovation-cost-uk` | `/services/bathroom-renovations` |
| `/guides/kitchen-renovation-cost-uk` | `/services/kitchen-renovations` |
| `/guides/tiling-cost-uk` | `/services/tiling` |
| `/guides/flooring-installation-cost-uk` | `/services/laminate-flooring` |
| `/guides/home-refurbishment-cost-uk` | `/services/home-refurbishment` |

**Authority signals per guide:**

- `Article` JSON-LD with `author`, `publisher`, `datePublished`, `dateModified`,
  `mainEntityOfPage`, `about` (the linked Service entity), `inLanguage: en-GB`
- `FAQPage` JSON-LD with 5 guide-specific Q&A pairs
- `BreadcrumbList` JSON-LD + visible `Breadcrumbs` UI
- Real price tables (UK 2026 market ranges, explicitly hedged as indicative)
- Cross-link back to the matching `/services/[slug]` pillar at the end of the body
- Cross-links to all sibling guides

**Service pillar gains contextual CTA** ("Curious about pricing first? See
bathroom renovation cost guide") under the free-quote button — single,
non-spammy inbound link from the commercial page to its informational sibling.

**Sitemap:** guides at priority 0.7, monthly changeFrequency, lastmod from
the guide entry's own `lastUpdated` field.

**Anti-pattern avoided:** *no per-area cost guides* (e.g.
`bathroom-renovation-cost-watford`). That's the classic doorway pattern —
covered explicitly in §9.

---

## 9. Project case-study pages (shipped Phase 3, Step 6)

5 projects with real photography and substantive scope now have dedicated
case-study routes at `/projects/[slug]`. The 2 projects without real
photos or substantive material **deliberately stay modal-only** — the
"prefer 10 strong pages over 50 weak ones" rule.

| Project | Page | Modal only |
|---|---|---|
| Spa-Style Master Bathroom | `/projects/spa-style-master-bathroom-st-albans` | — |
| Modern Shaker Kitchen | `/projects/modern-shaker-kitchen-watford` | — |
| Warm Laminate Living Space | `/projects/warm-laminate-living-space-watford` | — |
| Minimalist Guest Bathroom | `/projects/minimalist-guest-bathroom-st-albans` | — |
| Luxury Kitchen & Dining Space | `/projects/luxury-kitchen-dining-space-berkhamsted` | — |
| Herringbone Oak Hallway | — | ✓ (no real photo) |
| Zellige Feature Splashback | — | ✓ (no real photo) |

**Each case-study page contains** (all hand-written per project — no shared
boilerplate, no AI filler):

- Intro paragraph (project-specific editorial pull-quote)
- At-a-glance card: location · on-site duration · services used (deep
  links to the matching `/services/[slug]` pillars)
- Hero photo at the natural aspect for the project (16:9 wide or 4:5
  portrait depending on the photo composition)
- **Scope of work** — 6–7 trade-voice items, specific to the project
- **Challenges we solved** — 3 real technical challenges + how we solved them
- **Process &amp; execution** — 5-phase on-site programme with day/week banding
- **Materials &amp; finishes** — 5–7 visible material specs
- **Outcome** — qualitative result paragraph
- **Services used** (related-services cluster card grid, deep-linked to pillars)
- **Other transformations** (related projects in the same category)
- CTA → `/free-quote`

**JSON-LD per case-study page:**

- `CreativeWork` (name, description, image, locationCreated, creator,
  keywords, `about` → matching Service entities, `inLanguage: en-GB`)
- `BreadcrumbList` (Home › Projects › [Project Name])
- The CreativeWork `@id` matches the `ItemList` entries on `/projects` so
  the graph is self-consistent.

**Modal upgrade:** when a project has a `slug + detail`, the gallery
modal gains a "View full case study →" outlined button next to the
existing "Start a project like this" primary CTA. Projects without a
slug keep the existing modal-only flow.

**Sitemap:** project pages at priority 0.7, monthly changeFrequency.

**Anti-patterns avoided this step:**

- ❌ Boilerplate per-project copy (every page is hand-written)
- ❌ Fabricated client names, exact prices, fake testimonials
- ❌ Pages for projects without real photography (would be thin)
- ❌ Splitting one project across multiple pages

---

## 10. Roadmap (Phase 4+, require approval before shipping)

- **Per-project pages (`/projects/[slug]`):** requires bespoke per-project
  body content (problem → process → photo set → outcome). Without that,
  thin pages do more harm than good.
- **Review schema on `/testimonials`:** only on that page; needs each
  testimonial to have a stable date + author. Already in data, just
  needs to surface in JSON-LD.
- **Service combo pages (only specific ones):** consider only when a
  combo (e.g. `bathroom renovation Watford`) shows real GSC demand and
  we have unique copy + case studies.
- **Google Business Profile alignment:** verify the GBP entity matches
  schema.org NAP exactly (name + address + phone). Currently the schema
  uses placeholder address — fill the real registered office before
  pushing on GBP.
- **Reviews backfill:** map real MyBuilder reviews into the data layer
  (currently themed copy not real person-attributed). This unlocks
  trustworthy `Review` schema.
- **Lighthouse SEO + Performance pass:** baseline against the live URL,
  fix Largest Contentful Paint on mobile hero, audit Total Blocking
  Time on the masonry gallery.

---

## 11. Anti-patterns (do not introduce)

- Doorway pages (service × area thin variants)
- Keyword-stuffed H1s / meta descriptions
- Hidden text / cloaked anchors
- Duplicate schema on shared components rendered on multiple pages
- Sitemap entries for legacy / redirect-only URLs
- `noindex` on commercial pages by accident
- New routes outside the existing `/services/`, `/areas/`, `/projects/`,
  `/free-quote`, legal namespace without architectural review
