# SEO Reference — Nicolla Contractors Ltd

UK English, local-first. Primary location: Kings Langley, Hertfordshire.
Service area: Hertfordshire & North London.

## Target keywords → page mapping

| Keyword | Target page |
|---|---|
| builders near me | Home `/`, `/areas/*` |
| flooring contractors London | `/areas/north-london`, `/services/laminate-flooring` |
| bathroom renovation specialists | `/services/bathroom-renovations` |
| kitchen renovation company | `/services/kitchen-renovations` |
| laminate flooring installation | `/services/laminate-flooring` |
| tiling services UK | `/services/tiling` |
| home refurbishment company | `/services/home-refurbishment` |
| builders Watford / St Albans / … | `/areas/watford`, `/areas/st-albans`, … |

## Meta titles & descriptions (live on the site)

| Page | Title | Description (≈155 chars) |
|---|---|---|
| Home | Nicolla Contractors Ltd \| Premium Builders & Renovation in Hertfordshire | Premium bathroom, kitchen, tiling & flooring renovations across Hertfordshire & North London. Rated 4.9/5 by 350+ homeowners. Free quote. |
| About | About Us — Trusted Builders in Hertfordshire | Learn about Nicolla Contractors, a premium home refurbishment company in Kings Langley. Reliable, professional builders rated 4.9/5. |
| Services | Services — Bathrooms, Kitchens, Tiling & Flooring | Bathroom & kitchen renovations, tiling, laminate & flooring installation, refurbishment in Hertfordshire & North London. Rated 4.9/5. |
| Service pages | {Service} — Hertfordshire & North London | Per-service description + keyword + 4.9/5 + free quotes. |
| Projects | Projects — Our Portfolio of Renovations | Browse recent bathroom, kitchen, tiling & flooring projects with before & after transformations. |
| Testimonials | Testimonials — 4.9/5 from 350+ Customers | Reviews praising professionalism, punctuality, attention to detail and high-quality workmanship. |
| Contact | Contact — Free Quotes for Builders in Hertfordshire | Contact us for a free, no-obligation quote. Bathroom, kitchen, tiling, flooring & refurbishment specialists. |
| Free quote | Free Renovation Quote — Bathrooms, Kitchens, Tiling & Flooring | Free, no-obligation renovation quote. Rated 4.9/5 — reply within 24 hours. |
| Areas | Areas We Cover — Builders in Hertfordshire & North London | Renovations across Watford, St Albans, Hemel Hempstead & more. |
| Area pages | Builders in {Town} — Bathrooms, Kitchens, Tiling & Flooring | Trusted builders & renovation specialists in {Town}. Rated 4.9/5 — free quotes. |
| Legal pages | Privacy Policy / Cookie Policy / Terms & Conditions / GDPR Notice | Indexable, with last-updated dates. |

## Local SEO structure
- **Service pages:** `/services/[slug]` — one per service, keyword-optimized H1, Service + Breadcrumb schema.
- **Area pages:** `/areas/[slug]` — one per town, LocalBusiness + Breadcrumb schema, internal links to services and nearby areas.
- **Internal linking:** Home & footer → service pages; area pages → service pages & nearby areas; services → areas. This builds a topical local mesh.

## Structured data (JSON-LD) implemented
- Site-wide: `GeneralContractor` + `WebSite` (in `<Schema/>`) with `aggregateRating`, `areaServed`, `hasOfferCatalog`.
- Service pages: `Service` + `BreadcrumbList`.
- Area pages: `GeneralContractor` (areaServed = town) + `BreadcrumbList`.

## On-page checklist (already applied)
- One H1 per page, descriptive H2s with keywords.
- `metadataBase`, canonical URLs, Open Graph + Twitter tags.
- `sitemap.xml` (all routes incl. services, areas, legal) + `robots.txt`.
- Mobile-first, fast (static prerender), accessible.
- Locale `en-GB`, UK English copy.

## Next steps to climb rankings
1. Replace placeholder NAP with real details; keep identical to GBP.
2. Optimise the Google Business Profile (see `GOOGLE-BUSINESS-PROFILE.md`).
3. Add real project photography (alt text with service + town).
4. Build citations + earn reviews steadily.
5. Consider a `/blog` for content targeting long-tail local queries.
