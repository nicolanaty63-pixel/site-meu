# PROJECT-HANDOVER.md — Nicolla Contractors Ltd website

Read time: ~8 minutes. Goal: a new developer or new machine is productive
immediately. Working rules live in `CLAUDE.md` (read it first); topic docs:
`BUSINESS-DATA.md`, `SEO.md`, `SEO-STRATEGY.md`, `COPY.md`,
`PHOTOGRAPHY-BRIEF.md`, `GOOGLE-BUSINESS-PROFILE.md`.

---

## What this is

Lead-generation marketing site for **Nicolla Contractors Ltd** — premium
renovation contractor (bathrooms, kitchens, tiling, flooring, refurbishment)
in Kings Langley, Hertfordshire, serving Hertfordshire & North London.
Success metric: enquiries via form, phone, and WhatsApp.

- **Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4
  (CSS-first `@theme`, no tailwind.config) · framer-motion · @upstash/redis
  (customer-review store; in-memory fallback in dev).
- **Repo:** https://github.com/nicolanaty63-pixel/site-meu (branch `main`)
- **Live site:** https://nicollacontractors.co.uk — apex canonical, www → apex.

## Current status: LIVE — refinement mode

⚠️ **Every push to `main` auto-deploys to production via Vercel.** Build must
be green and changes verified (mobile 390px first) before pushing.

The design layer is complete (dark/gold premium identity — locked, do not
redesign). Real phone number is live. The site is in continuous refinement;
the open critical items are below.

### 🔴 Open critical items
1. **Lead forms are demo-only in production** — `ContactForm`/`QuoteForm`
   show success without sending anything. A complete fix (API route →
   Resend, validation, spam defence, honest error states, 11-assertion e2e
   suite) **exists on the primary dev machine, intentionally unpushed** —
   deployment is gated on Resend domain verification + API key + a real
   inbox test. Do not duplicate this work; see "Lead capture" below.
2. **Placeholder testimonials** in `lib/data.ts` are authored copy presented
   with "Verified/MyBuilder" framing, and `site.ts` carries a 4.9 rating +
   review count surfaced in JSON-LD `aggregateRating`. Replace with real
   platform reviews or strip all verification claims (UK DMCC Act 2024 +
   Google structured-data policy). The new `api/reviews` system collects
   REAL customer reviews — that is the intended long-term source.
3. **Portfolio truth pass** — several project cards are placeholders or stock
   photos with invented job metadata; real photography only (the Herringbone
   Oak Hallway collage card is the quality bar).

## Setup on a new machine (~5 commands)

```bash
git clone https://github.com/nicolanaty63-pixel/site-meu.git && cd site-meu
npm install                 # Node 20+ (developed on Node 24, Windows/PowerShell)
cp .env.example .env.local  # if present on that machine — see Credentials
npm run dev                 # http://localhost:3000
npm run build               # must pass before any push (push = deploy!)
```

Screenshot verification drives the system Edge/Chrome via `puppeteer-core`
(`npm i --no-save puppeteer-core`). Image pipelines (`scripts/*.mjs`, sharp)
expect sources in the machine's `Downloads` folder — adjust `SRC` per machine.
`scripts/verify-*.mjs` are the existing verification harnesses — reuse them.

## Completed work (major milestones)

- **Full site build:** Home, About, Services (+ per-service pages incl.
  Landscaping), Projects (+ per-project), Areas (10 town pages), cost Guides,
  Testimonials, Contact, Free-quote LP, legal pages, GDPR consent gating.
- **SEO architecture:** per-page metadata, sitemap/robots/manifest,
  LocalBusiness JSON-LD, local keyword mesh (`/services/*` × `/areas/*` ×
  guides). Strategy in `SEO-STRATEGY.md`; keyword map in `SEO.md`.
- **Customer review system:** `api/reviews` (rate-limited, deduped,
  Upstash Redis) + `ReviewForm`/`CustomerReviews` on /testimonials —
  collects real reviews to eventually replace the placeholder testimonials.
- **Real phone number** live in `site.ts` (navbar, footer, schema, WhatsApp).
- **Performance:** Counter rewritten imperatively (no per-frame re-renders);
  image pipeline → WebP q92 with unified brand grade via `ui/Photo.tsx`.
- **Herringbone Oak Hallway** project card: first real-photography portfolio
  item — 3 site photos baked into one 4:3 collage WebP
  (`scripts/build-herringbone-collage.mjs`); the reusable pattern for future cards.
- **Lead capture chain** (local, unpushed — see critical item #1).
- **Full UX/CRO/SEO audit** (June 2026) — findings drive the roadmap.

## Active priorities (in order)

1. Resend verification → deploy the local lead-capture work (see gate below).
2. Reviews cleanup: real reviews in, verification claims out (incl. schema).
3. Portfolio truth pass (real photos only; hide empty before/after sliders).
4. Favicon/app icon from `public/logo-nicolla-mark.png`.
5. Sticky mobile CTA bar site-wide (`StickyQuoteBar` exists on /free-quote).
6. Verifiable identity in footer: street address / Companies House no. /
   insurer (fields already conditional in `lib/legal.ts` — fill, don't invent).

## Lead capture — deployment gate (critical item #1)

The implementation (API route `src/app/api/lead/route.ts`, `src/lib/lead.ts`,
upgraded forms, `.env.example`) lives uncommitted on the primary dev machine.
**Before it is pushed/deployed, verify in this order:**
1. Resend account exists and domain `nicollacontractors.co.uk` is verified (DNS).
2. `RESEND_API_KEY` set in `.env.local` (local) and Vercel env (prod + preview).
3. End-to-end test: submit the real form locally → email arrives in the real
   inbox, Reply-To = customer address. Re-run the mock-provider e2e suite.
Only then commit + push (which deploys). Never reintroduce fake form success.

## Credentials required (no secrets in the repo — ever)

| Credential | Used for | Status |
|---|---|---|
| Vercel account (project linked to repo) | hosting, auto-deploy on `main` | ✅ live |
| `RESEND_API_KEY` (+ `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) | lead email delivery | ❌ to create — blocks lead deploy |
| Upstash Redis credentials | customer review store | ✅ assumed in Vercel env (verify) |
| GitHub access to `nicolanaty63-pixel/site-meu` | push/deploy | ✅ exists |
| Domain DNS (registrar) | site + Resend domain verification | owner-held |
| Google Business Profile login | local SEO (`GOOGLE-BUSINESS-PROFILE.md` checklist) | ⚠️ status unconfirmed |
| MyBuilder/Checkatrade/Google review profiles | real reviews import | ⚠️ unknown |

Local secrets go in `.env.local` (gitignored); production secrets in the
Vercel dashboard.

## Deployment process

`main` is production. Flow: edit → `npm run build` green → verify at
390/820/1440px (use/extend `scripts/verify-*.mjs`) → commit → push →
Vercel auto-deploys. No staging branch; treat every push as a release.
Note: `/api/lead`'s rate limiter (when deployed) is in-memory per-instance —
acceptable at current traffic; `api/reviews` already uses Redis.

## External services

| Service | Purpose | State |
|---|---|---|
| **Vercel** | hosting/CDN, auto-deploy from `main` | ✅ live |
| **Upstash Redis** | review store for `api/reviews` | ✅ in use |
| **Resend** | lead email (HTTP API, no SDK) | code ready locally; account/key needed |
| **Google Business Profile** | map-pack local SEO | ⚠️ unconfirmed — checklist in repo |
| **WhatsApp** | floating contact button (real number) | ✅ live |
| GitHub | source of truth | active |

## Future roadmap (after the critical items)

- Real before/after pairs (tripod-matched — `PHOTOGRAPHY-BRIEF.md`) to
  activate the currently-placeholder slider sections.
- Grow the portfolio with the collage pattern as jobs complete.
- FAQPage schema; `sameAs` profile links once external profiles are live.
- Localise hero H1 to Hertfordshire & North London; trim mobile homepage
  length; compress legacy stock JPEGs in `public/`.
- Call-tracking number; platform badges (MyBuilder/Checkatrade) once linkable.

## Rules that protect the business (read before editing content)

- **No fake reviews. No fake projects. No fake form success. No invented
  business data** — unconfirmed fields stay omitted (see `BUSINESS-DATA.md`).
- Branding is locked; refine, don't redesign.
- Preserve the SEO route structure (`/services/[slug]`, `/areas/[slug]`, guides).
- Verify every visual change on mobile (390px) before pushing — pushes deploy.
- Business facts change in exactly one place: `src/lib/site.ts` / `lib/legal.ts`.
