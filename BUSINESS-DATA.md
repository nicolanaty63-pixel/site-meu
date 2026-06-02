# Business data — what's real, what's missing, what unlocks what

This is the single map of which real-world business fields the site uses and
where each one surfaces (legal pages, JSON-LD schema, Google Business
Profile signals, etc.). The rule is **never invent data** — every field below
is either real-and-shipped, or omitted entirely until the real value is
confirmed.

> **How to fill anything in:** edit `src/lib/site.ts` or `src/lib/legal.ts`,
> ship the change. The schema and legal pages light up automatically — no
> other code changes needed.

---

## ✓ Already real and live

| Field | Source | Surfaces on |
|---|---|---|
| Business name | `site.name` | Every page title, OG, schema |
| Legal name | `site.legalName` | Schema `legalName`, legal pages |
| Phone (display) | `site.phoneDisplay` = `"07848 484088"` | Navbar, footer, contact, schema `telephone` |
| Phone (E.164) | `site.phoneHref` = `"tel:+447848484088"` | Every `tel:` link |
| WhatsApp deeplink ID | `site.whatsapp` = `"447848484088"` | Floating WhatsApp button |
| General contact email | `site.email` = `"info@nicollacontractors.co.uk"` | Contact page, schema `email`, legal |
| Base town | `site.baseTown` = `"Kings Langley"` | Schema `addressLocality`, area pages |
| Region | `site.region` = `"Hertfordshire"` | Schema `addressRegion`, area pages |
| Service area cities (× 10) | `site.serves` + `src/lib/areas.ts` | Schema `areaServed`, `/areas/[slug]` × 10 |
| Service regions (× 3) | `site.serviceRegions` | Schema `areaServed` (broader Place entities) |
| Average rating | `site.rating` = `4.9` | Schema `aggregateRating.ratingValue` |
| Review count | `site.reviewCount` = `350` | Schema `aggregateRating.reviewCount` |
| Years experience | `site.yearsExperience` = `15` | About + service pages |
| Opening hours | `site.hours` + Schema `openingHoursSpecification` (Mon–Sat 08:00–18:00) | Schema, contact page |
| Brand logo | `public/logo-nicolla-mark.png` | Navbar, footer, schema `logo`, manifest icon |
| OG share card | `public/og.jpg` | Schema `image`, OG, Twitter card |

---

## ✗ Missing — currently omitted from schema and legal pages

These fields are typed in code as `string | undefined` (or similar). Every
consumer is conditional — the moment you fill in the real value, the
corresponding text/schema appears on production without any code change.

### Companies House / regulatory

| Field | Edit in | Unlocks when filled |
|---|---|---|
| Companies House registered number | `legal.companyNumber` | Privacy policy `<li>`, terms "About us" sentence, GDPR "Data controller" paragraph |
| Registered office (full address line) | `legal.registeredOffice` | Same three pages as above |
| ICO Data Protection register ref | `legal.icoRegistration` | Privacy policy `<li>`, GDPR paragraph |
| VAT number (if registered) | `legal.vatNumber` | *(no current consumer — add to footer or terms if useful when filed)* |

### NAP / Google Business Profile alignment

| Field | Edit in | Unlocks when filled |
|---|---|---|
| First line of street address | `site.streetAddress` | Schema `address.streetAddress` |
| Postcode | `site.postalCode` | Schema `address.postalCode` |
| Geo coordinates (lat/lng) | `site.geo` | Schema `geo` block with `GeoCoordinates` |

### Profile URLs (sameAs signal)

`site.sameAs` is currently `undefined`. When set to an array of public-facing
profile URLs, each appears as a `sameAs` entry on the homepage
`GeneralContractor` entity — strong knowledge-graph signal that the same
business is referenced across the web. Suggested when available:

- Google Business Profile listing URL
- MyBuilder profile URL
- Facebook page URL
- Instagram profile URL
- LinkedIn company page URL
- Any trade-body listing (TrustMark, Federation of Master Builders, Checkatrade, etc.)

Set as `sameAs: ["https://...", "https://...", ...]`.

---

## 🟡 Soft signals worth a sanity check

| Field | Current value | Notes |
|---|---|---|
| `priceRange` in schema | `"££"` | Soft Google convention (£ to ££££ tiers). Reasonable for premium renovation; adjust if a different tier reads truer. |
| `openingHoursSpecification` | Mon–Sat 08:00–18:00 | Make sure this is what you actually trade. Easy to differentiate (e.g. shorter Saturday) by editing `src/components/Schema.tsx`. |
| `privacy@nicollacontractors.co.uk` | Used in `legal.privacyEmail` | Set up the alias or change to `info@…` if the dedicated address isn't routed yet. |
| `legal.lastUpdated` | `"24 May 2026"` | Update next time the legal text materially changes. |

---

## How the schema decision flow works

```
site.streetAddress / postalCode / geo / sameAs   defined?
        │                                            │
        │ no                                         │ yes
        ▼                                            ▼
schema omits the field entirely        schema includes the field
(conservative, no invention)           (full GBP/NAP signal lights up)
```

No engineering required to switch — just edit `src/lib/site.ts`, commit,
push. Same for the legal page fields in `src/lib/legal.ts`.

---

## What we will NOT do

- Invent a Companies House number, ICO reference, postcode, address, or geo
  coordinates "as a placeholder" — would degrade trust if visible, and
  would mis-direct local SEO if shipped to schema.
- Add a fake GBP URL to `sameAs`.
- Display bracketed placeholder strings on legal pages (this was a real bug
  found in the Phase 3 audit and is now fixed via the conditional renders).
