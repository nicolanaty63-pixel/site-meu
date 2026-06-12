# CLAUDE.md — Nicolla Contractors

This file is the **single source of truth** for how work is performed on this
repository. Read it fully at the start of every session before making changes.
It encodes the business context, the brand lock, the non-negotiable rules, the
technical architecture, and the exact build/verify/deploy workflow.

> **One-line mental model:** This site is in **refinement mode**. The goal is to
> make the existing site *better*, not bigger. Refine, don't rebuild. Prefer 50
> small, justified improvements over 5 large ones. Every change must earn its place.

---

## 1. The business

| Field | Value |
|---|---|
| Business name | **Nicolla Contractors Ltd** |
| Industry | Construction / Renovation / Home Improvement |
| Positioning | **Premium** contractor brand (luxury, high-trust) |
| Base | Kings Langley, Hertfordshire |
| Service area | Hertfordshire & North London (Watford, St Albans, Hemel Hempstead, Rickmansworth, Berkhamsted, Bushey, Harpenden, Radlett, + North London) |
| Live site | https://nicollacontractors.co.uk (apex is canonical; `www` 301s to apex) |

**Primary goals, in priority order:** generate leads → build trust → showcase
workmanship → rank locally → convert visitors into enquiries.

**Real business data lives in code, not prose.** Authoritative sources:
- `src/lib/site.ts` — NAP, phone, email, rating, review count, hours, service areas.
- `BUSINESS-DATA.md` — the map of what business data is **real-and-live** vs
  **missing-and-intentionally-omitted**. Read it before touching schema, legal
  pages, or any business fact. Fields that aren't confirmed are typed
  `string | undefined` and conditionally omitted — **never invent a placeholder.**

---

## 2. Golden rules (non-negotiable)

These override convenience, cleverness, and "while I'm here" urges.

1. **Refine, don't rebuild.** No redesigns, no layout rewrites, no re-architecture
   unless explicitly requested.
2. **Brand is locked.** Do not change the colour system, typography system, dark
   theme, or gold accents. No trendy visual gimmicks.
3. **No fake anything.** Never create fake reviews, projects, statistics, awards,
   certifications, testimonials, or business data. Only real, confirmed information.
4. **Mobile and tablet are first-class.** Any change that harms mobile/tablet UX is
   unacceptable. Verify all three viewports for every visual/layout change.
5. **Never trade performance for visual effects.** Protect Core Web Vitals, scroll
   smoothness, and image performance.
6. **Preserve the SEO architecture.** Don't break the sitemap, schema, service/area
   structure, internal linking, or guides. No keyword stuffing, doorway pages, thin
   content, or duplicate pages.
7. **Smallest effective change.** Audit → identify → explain → implement minimal fix
   → verify. Justify every change.

---

## 3. Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict).
- **Tailwind CSS v4** (CSS-first config via `@theme` in `src/app/globals.css`;
  there is **no `tailwind.config`** — tokens are defined in CSS).
- **framer-motion v12** for motion.
- **@upstash/redis** for the customer-review store (in-memory fallback in dev).
- Fonts: **Inter** (sans) + **Sora** (display) via `next/font/google`.
- Hosting: **Vercel**, auto-deploys on push to `main`. Repo:
  `github.com/nicolanaty63-pixel/site-meu`.
- Node 20+ (dev machine runs v24). Windows dev environment (PowerShell) — see §11.

---

## 4. Repository map — where things live

```
src/
  app/
    layout.tsx            Root layout, global <head> metadata, fonts, ambient bg,
                          Navbar/Footer/WhatsApp/CookieBanner/Schema mount points
    page.tsx              Home
    globals.css           Tailwind @theme tokens + ALL custom utilities/animations
    template.tsx          Per-route enter transition
    manifest.ts robots.ts sitemap.ts   Generated SEO/PWA endpoints
    services/page.tsx · services/[slug]/page.tsx
    projects/page.tsx · projects/[slug]/page.tsx
    areas/page.tsx · areas/[slug]/page.tsx        (10 service-area pages)
    guides/page.tsx · guides/[slug]/page.tsx      (cost guides)
    about · contact · free-quote · testimonials   (pages)
    privacy-policy · terms · cookie-policy · gdpr  (legal)
    api/reviews/route.ts  Review submit/list API (rate-limited, deduped)
  components/
    ui/Photo.tsx          THE image component — always render photos through this
    ui/Icon.tsx           Single inline-SVG icon set (typed IconName)
    Counter.tsx           Animated stat counter (imperative DOM — see §6)
    Navbar · Footer · Schema · FAQ · Breadcrumbs · Container · SectionHeading
    home/Hero.tsx home/ProjectCard.tsx home/TrustMarquee.tsx
    motion/               Reveal, Stagger, Magnetic, ParallaxImage, useIsMobile, tokens
    consent/              ConsentProvider, CookieBanner, Analytics (GDPR gating)
    reviews/              CustomerReviews, ReviewForm (REAL user reviews)
    lp/                   QuoteHero, StickyQuoteBar (free-quote landing)
    ContactForm · QuoteForm · FormConsent
  lib/
    site.ts               ★ Business NAP / reputation / nav — single source of truth
    data.ts               ★ services, projects, testimonials, faqs, stats, badges, process
    areas.ts              ★ service-area page content (keep in sync with site.serves)
    guides.ts             ★ cost-guide content
    legal.ts              ★ legal-page content + company/ICO/VAT fields (conditional)
    seo.ts reviews.ts reviews-shared.ts consent.ts
scripts/                  Node ESM tooling: image optimisers + verify-*.mjs harnesses
public/                   Static assets (hero/, projects/, og.jpg, logo, stock photos)
```

Root docs to consult: `BUSINESS-DATA.md`, `SEO-STRATEGY.md`, `SEO.md`,
`COPY.md`, `GOOGLE-BUSINESS-PROFILE.md`, `PHOTOGRAPHY-BRIEF.md`.

---

## 5. Brand system (locked — match exactly, never introduce new values)

Tokens are defined in `src/app/globals.css` under `@theme`. Use the Tailwind
classes that map to them (`text-gold`, `bg-ink`, `text-concrete`, etc.).

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0a0d18` | Page background (near-black navy) |
| `charcoal` | `#0f1322` | Section bands |
| `surface` / `surface-2` | `#161b2e` / `#20273e` | Cards, panels |
| `navy` / `navy-light` | `#313a52` / `#3f4a6b` | Brand navy (from logo) |
| `gold` / `gold-light` / `gold-dark` | `#c8a24c` / `#e7cd8c` / `#9c7a30` | **Accent only** |
| `concrete` / `concrete-dark` | `#9aa1b8` / `#697089` | Body / muted text |

- **Fonts:** display = Sora (`font-display`), body = Inter (default). Headings get
  negative tracking + `text-wrap: balance` (already in `@layer base`).
- **Signature effects** (already built — reuse, don't reinvent): `.text-gold-gradient`,
  `.text-gold-shimmer`, `.glass` / `.glass-strong`, `.btn-sheen`, `.bg-grid`,
  `.surface-concrete`, `.grain`, `.vignette`, `.img-grade` (+`.img-grade-wash`).
- The colour scheme is **dark only** (`color-scheme: dark`). Do not add a light mode.

---

## 6. Key architectural conventions (follow these — they encode hard-won fixes)

**Images → always `components/ui/Photo.tsx`.** It wraps `next/image` (AVIF/WebP,
lazy by default, `fill` + `object-cover`), applies the unified brand colour grade
(`.img-grade` + warm wash), and falls back to a tasteful placeholder when no `src`
is set. Pass `priority` for above-the-fold LCP images, `sizes` for correct
resolution, `quality={90}` only for hero/showcase shots (allow-listed in
`next.config.mjs` `images.qualities: [75, 90]`).

**Counters → imperative, never per-frame React state.** `Counter.tsx` animates by
writing `node.textContent` via a ref inside `requestAnimationFrame` — **zero
re-renders during the count.** This is deliberate: the previous `setState`-per-frame
version (× 4 simultaneous counters) caused dropped frames and visible number-jumping
on mobile/tablet. If you touch it: keep it stateless, keep `prefers-reduced-motion`
snapping, keep it landing on the exact target. Don't reintroduce per-frame `setState`.

**Mobile/tablet performance gating is intentional** (`globals.css`, `@media
(max-width: 1023px)` + `prefers-reduced-motion`). Below `lg`:
- continuous blur-orb animations (`animate-drift-*`, `animate-floaty`) and
  `text-gold-shimmer` are disabled;
- `.img-grade-wash` drops `mix-blend-mode: soft-light` (very expensive on mobile
  GPUs) for a cheap alpha tint.
Parallax (`motion/ParallaxImage`) and the hero scroll-transform are disabled on
mobile via `motion/useIsMobile`. **Do not undo these gates** to add desktop polish to
mobile. If you add a new continuous/blend/parallax effect, gate it the same way.

**Motion → use the shared primitives** in `components/motion/` (`Reveal`, `Stagger`/
`StaggerItem`, `Magnetic`). They already respect reduced-motion and avoid
filter/blur transitions that jank on mobile. Don't hand-roll new scroll animations.

**Structured data → `components/Schema.tsx`** emits the `GeneralContractor` +
`WebSite` JSON-LD graph from `site.ts`/`data.ts`. Service/area/project/guide pages
emit their own `Service`/`FAQPage`/`BreadcrumbList`/`ItemList`/`Article` JSON-LD.
`aggregateRating` is driven by `site.rating` / `site.reviewCount` — these must
reflect **real** review data (see §13).

**Consent → `components/consent/`.** Analytics only loads after consent. Don't add
trackers outside this gate.

**Forms** post nothing yet — see §13 (Known issues). `FormConsent` + a honeypot are
already wired; preserve them when making forms live.

---

## 7. Content rules

All copy must be **useful, human, conversion-focused, professional.** Avoid AI
filler, repetitive wording, and generic contractor clichés ("we're the best",
"quality you can trust"). Write in the brand's calm, confident, trade-credible
voice — concrete specifics (materials, process, timelines) over adjectives.

- Prefer **high-quality** content over **high-volume** content. Don't spin up thin
  pages to chase keywords.
- Per-page copy should be unique. No duplicated boilerplate across services/areas/projects.
- `COPY.md` holds approved messaging; align with it.

---

## 8. SEO rules

**Preserve** the existing architecture: sitemap (`app/sitemap.ts`), schema
(`Schema.tsx` + per-page JSON-LD), service structure, area structure, internal
linking (`RelatedServices`, `RelatedProjectsFor`, breadcrumbs), and the guides
cluster.

- `site.serves` (in `site.ts`) is the single source for served areas; keep
  `lib/areas.ts` in sync with it. `areaServed` in schema derives from it.
- Redirects live in `next.config.mjs` (`www`→apex; retired
  `/services/flooring-installation` → `/services/laminate-flooring`; legacy
  `/pages/*`). Add a 301 there whenever a URL is retired — never leave a 404 for an
  indexed URL.
- **Never:** keyword-stuff, build doorway pages, publish thin content, or create
  duplicate pages. Meta keywords are ignored by Google — don't expand them.
- See `SEO-STRATEGY.md` / `SEO.md` for the full plan and what's already shipped.

---

## 9. Images

Priority order: **(1) real project photos → (2) real transformation photos →
(3) real before/after pairs.** Stock is a fallback, and only premium, realistic,
consistently-graded stock.

- All photos render through `Photo` so they share one grade and one crop discipline.
- Never ship low-quality, stretched, or inconsistently-cropped images. Match aspect
  ratios already in use (project cards use `wideCard` 16:9 or `span` 4:5 — see
  `data.ts` `Project` type).
- Optimise new originals with the `scripts/optimize-*.mjs` helpers before adding
  them; keep delivered weight low. `PHOTOGRAPHY-BRIEF.md` defines the look.
- Real before/after images belong in case studies (`data.ts` `beforeImage`/
  `afterImage`); don't fake a transformation by pairing two unrelated stock photos.

---

## 10. Projects (trust assets)

Project pages exist to prove craftsmanship. Each should foreground
**transformation, craftsmanship, process, and outcome** (the `ProjectDetail` type:
`intro`, `scope`, `challenges`, `process`, `materials`, `outcome` — all unique per
project, trade voice). No filler, no duplicated project content. Only projects
substantial enough to deserve a page get a `slug` + `detail`; others stay in the
gallery. Prefer a few strong case studies over many weak ones.

---

## 11. Mobile-first verification + the dev environment

**Every visual/layout change must be verified on desktop, tablet, AND mobile.**
The repo ships a Playwright harness pattern for exactly this.

- Standard viewports used by the verify scripts: **mobile 390×844, tablet 768×1024,
  desktop 1440×900**, plus CPU throttling to emulate weaker silicon.
- Harness uses `playwright-core` driving **headless Edge** (`channel: "msedge"`).
  ⚠️ Headless desktop (even throttled) **cannot fully reproduce a real low-end
  phone's main thread** — trust the structural reasoning, not just synthetic numbers.

**Windows / PowerShell gotchas (apply only when developing on Windows):**
- Kill the dev/prod server with PowerShell, not git-bash: `Get-Process node | Stop-Process -Force`. `pkill` from bash does **not** reliably kill Node on Windows, which leaves a **stale server on port 3000** (causes `EADDRINUSE` and tests hitting an old build). Always confirm the port owner before trusting results.
- Use PowerShell syntax in the PowerShell tool (`$null`, `$env:VAR`, backtick continuation).

**macOS notes (project migrated to a MacBook in June 2026):**
- Standard Unix tooling applies (`lsof -i :3000`, `kill`); the PowerShell notes above are historical.
- The verify harnesses launch headless **Edge** via `channel: "msedge"` in
  `playwright-core`. If Edge isn't installed on the Mac, either install it or
  switch the harness `channel` to `"chrome"` — the scripts have no other
  Windows dependency.
- Image-optimiser scripts (`scripts/optimize-*.mjs`) read source photos from a
  hardcoded `SRC` folder (historically the Windows `Downloads` folder) — adjust
  the path per machine before running.

---

## 12. Build / verify / deploy

```bash
npm run dev      # local dev (http://localhost:3000)
npm run build    # production build — MUST pass before any deploy
npm run start    # serve the production build locally for verification
npm run lint     # next lint
npx tsc --noEmit # type-check (strict)
```

**Before every deployment:**
1. `npx tsc --noEmit` and `npm run build` both clean.
2. Verify locally on **desktop + tablet + mobile** (real resize or the Playwright
   harness in `scripts/verify-*.mjs`).
3. Confirm no regressions on the pages you touched.

**Deploy:** push to `main` → Vercel builds & deploys automatically.
- This is a **production deploy**; only push when the change is verified and the
  user has asked to deploy. End commit messages with the standard Claude
  co-author trailer (e.g. `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`).

**After deployment, verify production:**
1. Confirm the new build is actually live (e.g. diff a known DOM/asset signature,
   not just a 200).
2. Check critical pages render (`/`, `/services/[slug]`, `/projects/[slug]`,
   `/areas/[slug]`, `/free-quote`, `/contact`).
3. Confirm no broken routes / 404s on changed URLs (and that retired URLs 301).

A verify script can target production: `BASE="https://nicollacontractors.co.uk"
node scripts/verify-counter.mjs`.

---

## 13. Known issues & open decisions (state at last audit — resolve, don't ignore)

These are real, confirmed gaps. Treat them as the backlog; fixing them beats adding
new things.

1. **Lead forms are demo-only in production — leads are silently lost.** On
   `main`, `ContactForm.tsx` and `QuoteForm.tsx` just set a "sent" state; the
   only live endpoint is `api/reviews`. **The complete fix is already built**
   on branch **`lead-capture`** (commit `d9597ba`, pushed to origin) — see §16
   for what it contains and the hard deployment gate. Do **not** rebuild this;
   merge the branch once the gate is satisfied.
2. **RESOLVED (June 2026): testimonials are now genuine.** `data.ts` carries
   nine real MyBuilder reviews (lightly brand-edited per the owner's explicit
   12 Jun 2026 direction; provenance comment on the array) and
   `site.reviewCount` is 115, matching the public MyBuilder profile. All
   reputation figures (stats, badges, metas) derive from `site.ts` — never
   hardcode a rating/review/experience number anywhere else. Never add
   fabricated testimonials.
3. **Service list is canonical at 9 services** (the `services` array in
   `data.ts`: bathroom-renovations, kitchen-renovations, tiling,
   laminate-flooring, home-extensions, loft-conversions, roofing, landscaping,
   driveways-paving). Footer, sitemap, schema and `/services` all derive from
   it — keep it that way.
4. **Incomplete NAP for local SEO.** `streetAddress`, `postalCode`, `geo`, `sameAs`
   in `site.ts` are intentionally `undefined`. Filling them with **real** values
   (per `BUSINESS-DATA.md`) lights up local schema with zero code risk — high local
   SEO ROI when the data is provided.
5. **Trust signals are text-only.** No real accreditation/insurer/company-number
   marks yet. Add them **only when the real credentials are supplied.**

---

## 14. Decision framework & default mindset

When multiple solutions exist, choose the one that maximises, in tension order:
**trust → professionalism → simplicity → maintainability → conversion.** Avoid
complexity unless it provides measurable value.

Operate as a blend of **Senior UX Designer + Senior Frontend Engineer + Senior SEO
Consultant + Senior CRO Specialist**. For every proposed change, be able to answer:
*does this increase trust, conversion, or perceived quality — without harming mobile,
performance, brand, or SEO?* If not, don't do it.

> The objective is not to add more things. The objective is to make the website
> **better** — through many small, verified, justified refinements.

---

## 15. Environment variables & external services

**No secrets in the repo — ever.** Local secrets go in `.env.local`
(gitignored); production secrets live in the Vercel dashboard.

| Variable | Used by | Status |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | `api/reviews` store | should exist in Vercel env (verify there — not needed locally; dev uses an in-memory fallback) |
| `RESEND_API_KEY` | `api/lead` (branch `lead-capture`) | ❌ not created yet — blocks lead-capture deploy |
| `LEAD_TO_EMAIL` / `LEAD_FROM_EMAIL` | `api/lead` recipient/sender | documented in `.env.example` on the `lead-capture` branch |
| `RESEND_API_URL` | test-only endpoint override | leave unset in production |

There is **no `.env.example` on `main`** — it arrives with the `lead-capture`
branch. The site runs locally with **zero env vars** (reviews fall back to
in-memory; lead forms on `main` are demo-only).

External services: **Vercel** (hosting, auto-deploy from `main`),
**Upstash Redis** (review store), **Resend** (lead email — account not yet
created), **GitHub** (`nicolanaty63-pixel/site-meu`).

---

## 16. Lead capture — implementation & deployment gate

Branch **`lead-capture`** (commit `d9597ba`, on origin) contains the complete,
e2e-verified implementation (11/11 assertions against a mock provider):

- `src/app/api/lead/route.ts` — server-side validation, honeypot + time-trap +
  per-IP rate limit (in-memory, per-instance — fine at current traffic),
  GDPR consent recorded in the delivery email, Reply-To set to the customer.
- `src/lib/lead.ts` — Resend HTTP API client (no SDK).
- `ContactForm.tsx` / `QuoteForm.tsx` upgraded: real submission, honest error
  states with direct-contact fallbacks. Honeypot + `FormConsent` preserved.
- `.env.example` — setup instructions for the three env vars.

**DNS / Resend status (as of 12 Jun 2026): nothing started.** No Resend
account exists, the domain is not verified, no API key has been issued.

**Hard gate — do not merge/deploy until, in order:**
1. Resend account created and domain `nicollacontractors.co.uk` verified (DNS
   records added at the registrar; or use `onboarding@resend.dev` as
   `LEAD_FROM_EMAIL` for testing only).
2. `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` set in `.env.local`
   (local) **and** Vercel env (production + preview).
3. A real end-to-end inbox test: submit the form locally → email arrives at
   the real inbox with Reply-To = customer address. Re-run the mock e2e suite.

Never reintroduce fake form success.

---

## 17. Cost guides (`/guides`)

- Content lives in `src/lib/guides.ts` (per-guide cost tables, factors, FAQs);
  pages render via `guides/page.tsx` + `guides/[slug]/page.tsx`.
- `src/components/BudgetCalculator.tsx` is the instant calculator on the hub —
  its ranges **mirror the `guides.ts` tables**; keep them in sync when prices
  change.
- ⚠️ Two modelling choices were derived by Claude and have **not** been
  explicitly confirmed by the owner: the quality multipliers
  (standard ×1 / premium ×1.25 / luxury ×1.55) and the Home Refurbishment
  small/medium/large ranges. Confirm with the owner before treating them as
  business-approved figures.

---

## 18. Next priorities (June 2026)

1. **Activate lead capture** — the Resend gate in §16, then merge
   `lead-capture` → `main`. Highest-value open item; production forms
   currently lose every lead.
2. **Complete NAP for local SEO** — real `streetAddress`, `postalCode`, `geo`,
   `sameAs` in `site.ts` (per `BUSINESS-DATA.md`); zero code risk, high ROI.
3. **Owner confirmation** of the budget-calculator modelling choices (§17).
4. **Real trust marks** (accreditations, insurer, platform badges) only when
   the real credentials are supplied.
5. **Google Business Profile** — work the checklist in
   `GOOGLE-BUSINESS-PROFILE.md` (status unconfirmed).
