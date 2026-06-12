# PROJECT-HANDOVER.md — Nicolla Contractors Ltd website

Last updated: **12 June 2026** (prepared for migration to a new dev machine).
Goal: a new developer or new machine is productive immediately. Working rules
live in `CLAUDE.md` (read it first); topic docs: `BUSINESS-DATA.md`, `SEO.md`,
`SEO-STRATEGY.md`, `COPY.md`, `PHOTOGRAPHY-BRIEF.md`,
`GOOGLE-BUSINESS-PROFILE.md`.

---

## Repository & URLs

| What | Where |
|---|---|
| Repository | https://github.com/nicolanaty63-pixel/site-meu |
| Production branch | `main` — **every push auto-deploys via Vercel** (~30–60 s, occasionally ~10 min queue) |
| Feature branch | `lead-capture` (on origin) — gated lead-form implementation, see below |
| Live site | https://nicollacontractors.co.uk (apex canonical; `www` 301s to apex) |
| MyBuilder profile (source of genuine reviews) | https://www.mybuilder.com/profile/view/ns_tiling_solutions — 4.9/5, 115 reviews; blocks server-side fetch (403), scrape via headless browser |
| Companies House | company no. **15281877** |
| Hosting | Vercel (project linked to the repo) |

## Current status: LIVE — refinement mode

⚠️ **Every push to `main` deploys to production.** Build must be green and
changes verified at mobile/tablet/desktop before pushing.

The design layer is complete (dark/gold premium identity — locked). Content
integrity work is done: all testimonials are genuine, reputation figures are
sourced, portfolio is real photography. The one critical functional gap is
**lead capture** (forms on production are demo-only — built, gated, not yet
deployed; see below).

## Completed work (as of 12 Jun 2026)

- **Full site build:** Home, About, 9 service pages, Projects (6 real-photo
  portfolio items), 10 area pages, cost Guides, Testimonials, Contact,
  Free-quote LP, legal pages, GDPR consent gating.
- **SEO architecture:** per-page metadata, sitemap/robots/manifest,
  `GeneralContractor` JSON-LD graph, service × area × guides internal mesh.
- **Testimonials integrity (RESOLVED):** nine genuine MyBuilder reviews in
  `lib/data.ts` (lightly brand-edited per the owner's explicit 12 Jun 2026
  direction — provenance comment on the array). All fabricated testimonials
  removed. `site.reviewCount = 115` matches the public MyBuilder profile.
- **Reputation split (owner decision, commit `b556ba9`):**
  `site.clientsServed = 350` (owner-attested; "happy clients"/"trusted by"
  surfaces) vs `site.reviewCount = 115` (review/rating claims + schema).
  Both are correct for their context — do **not** "reconcile" them.
- **Full production audit (commit `c9fb001`):** purged stale review-count
  claims, fixed reduced-motion hydration errors (`useReducedMotionSafe`
  hook), dialog a11y, form label association, schema aggregateRating dedupe,
  branded 404. Harnesses: `scripts/audit-full.mjs`, `audit-interactions.mjs`.
- **/guides hub (commit `87edd3b`):** premium cost-guides hub with instant
  `BudgetCalculator.tsx` (ranges mirror `guides.ts` tables).
- **/areas interactive coverage map** (`src/components/AreasMap.tsx`): inline
  SVG, real WGS84 coords; verify harness `scripts/verify-areas-map.mjs`.
- **Customer review system:** `api/reviews` (rate-limited, deduped, Upstash
  Redis; in-memory fallback in dev) + `ReviewForm`/`CustomerReviews`.
- **Performance:** imperative `Counter`, mobile effect gating, unified image
  grade via `ui/Photo.tsx`.
- **Lead capture chain** — complete and e2e-verified on branch
  `lead-capture` (commit `d9597ba`, pushed to origin). Deployment gated.

## Remaining work (in priority order)

1. **Deploy lead capture** — production forms currently show success without
   sending anything (leads silently lost). Everything is built; blocked only
   on the Resend/DNS gate below.
2. **Complete NAP for local SEO** — `streetAddress`, `postalCode`, `geo`,
   `sameAs` in `site.ts` are intentionally `undefined`; fill with real values
   only (per `BUSINESS-DATA.md`).
3. **Owner confirmation** of two budget-calculator modelling choices
   (quality multipliers ×1/×1.25/×1.55; Home Refurbishment size ranges) —
   derived by Claude, not yet explicitly approved.
4. **Real trust marks** (accreditations, insurer, platform badges) when real
   credentials are supplied — never invent.
5. **Google Business Profile** — checklist in `GOOGLE-BUSINESS-PROFILE.md`;
   status unconfirmed.

## Pending: Resend configuration & DNS verification

**Status: nothing started** — no Resend account, domain not verified, no API
key. This is the only blocker for lead capture. Steps (owner action needed):

1. Create a Resend account at https://resend.com (free tier is fine).
2. Add the domain `nicollacontractors.co.uk` under **Domains** and add the
   DNS records Resend shows at the domain registrar; wait for "Verified".
   (For testing only, `onboarding@resend.dev` can be used as the sender —
   it can deliver only to the Resend account's own email.)
3. Create an API key. Set `RESEND_API_KEY`, `LEAD_TO_EMAIL`,
   `LEAD_FROM_EMAIL` in `.env.local` (see `.env.example` on the
   `lead-capture` branch) **and** in Vercel env (production + preview).
4. End-to-end test: run the `lead-capture` branch locally, submit the real
   form, confirm the email arrives with Reply-To = customer address; re-run
   the mock e2e suite.
5. Only then merge `lead-capture` → `main` and push (= production deploy).

## Setup on a new machine

```bash
git clone https://github.com/nicolanaty63-pixel/site-meu.git && cd site-meu
npm install        # Node 20+ (last developed on Node 24)
npm run dev        # http://localhost:3000 — runs with ZERO env vars
npm run build      # must pass before any push (push = deploy!)
```

- No `.env.local` is required to run: reviews fall back to in-memory in dev,
  and lead forms on `main` are demo-only. Env vars are only needed for the
  lead-capture branch (see `.env.example` there).
- Verify/audit harnesses (`scripts/verify-*.mjs`, `scripts/audit-*.mjs`) use
  `playwright-core` driving headless **Edge** (`channel: "msedge"`); on a
  machine without Edge, install it or switch the channel to `"chrome"`.
- Image optimisers (`scripts/optimize-*.mjs`) read sources from a hardcoded
  `SRC` folder — adjust per machine.
- Local quirks worth knowing: Chromium never lazy-loads below-fold images on
  small viewports on this site (gallery/services tiles use `eager` on
  `Photo`); the local `next start` image optimizer can deadlock on concurrent
  cold AVIF encodes — restart the server and warm variants sequentially.

## Credentials required (no secrets in the repo — ever)

| Credential | Used for | Status |
|---|---|---|
| Vercel account (project linked to repo) | hosting, auto-deploy on `main` | ✅ live |
| `RESEND_API_KEY` (+ `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) | lead email delivery | ❌ to create — blocks lead deploy |
| `UPSTASH_REDIS_REST_URL`/`TOKEN` | customer review store | ✅ assumed in Vercel env (verify there) |
| GitHub access to `nicolanaty63-pixel/site-meu` | push/deploy | ✅ exists |
| Domain DNS (registrar) | site + Resend domain verification | owner-held |
| Google Business Profile login | local SEO | ⚠️ status unconfirmed |

Local secrets go in `.env.local` (gitignored); production secrets in the
Vercel dashboard. **Nothing secret lives on the old machine** — no
`.env.local` existed there at handover.

## Deployment process

`main` is production. Flow: edit → `npx tsc --noEmit` + `npm run build`
green → verify at 390/768/1440 px (use/extend `scripts/verify-*.mjs`) →
commit → push → Vercel auto-deploys. No staging branch; treat every push as
a release. After deploying, confirm the new build is actually live (diff a
DOM/asset signature, not just a 200) and spot-check critical pages.

## Future improvements (after the priorities above)

- Real before/after pairs (tripod-matched — `PHOTOGRAPHY-BRIEF.md`) to bring
  back a before/after slider with genuine transformations.
- Grow the portfolio with the collage pattern as jobs complete.
- `sameAs` profile links + platform badges (MyBuilder/Checkatrade) once
  linkable; call-tracking number.
- Compress legacy stock JPEGs in `public/`.

## Rules that protect the business (read before editing content)

- **No fake reviews. No fake projects. No fake form success. No invented
  business data** — unconfirmed fields stay omitted (see `BUSINESS-DATA.md`).
- Branding is locked; refine, don't redesign.
- Preserve the SEO route structure (`/services/[slug]`, `/areas/[slug]`,
  guides); add a 301 in `next.config.mjs` whenever a URL is retired.
- Verify every visual change on mobile/tablet/desktop before pushing.
- Business facts change in exactly one place: `src/lib/site.ts` /
  `lib/legal.ts`; reputation figures only in `site.ts`.
