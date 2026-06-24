import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Hero from "@/components/home/Hero";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Magnetic from "@/components/motion/Magnetic";
import BudgetCalculator from "@/components/guides/BudgetCalculator";
import { projects, services, testimonials } from "@/lib/data";
import { site } from "@/lib/site";

// Small inline 5-star row (gold), used by the trust strip + testimonials.
function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className={`${className} fill-current`} />
      ))}
    </span>
  );
}

// Flagship services shown on the homepage (one-liners from data.ts `short`).
// The full canonical set of 9 lives on /services — linked at the foot.
const flagshipServices = services.slice(0, 6);

// Featured Projects — the visual centrepiece. A curated, asymmetric editorial
// gallery built ENTIRELY from real project photography. Each tile maps to a
// real case study; the lone exterior (landscaping) sits last and smaller as a
// breadth signal. Aspect ratios are chosen so the feature (16:10, 8 cols) and
// the portrait (4:5, 4 cols) resolve to the same height on the top row.
const pick = (slug: string) => projects.find((p) => p.slug === slug);
const gallery = [
  {
    p: pick("spa-style-master-bathroom-st-albans"),
    img: "/projects/spa-bathroom-after.webp",
    span: "md:col-span-8",
    ratio: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 760px",
  },
  {
    p: pick("minimalist-guest-bathroom-st-albans"),
    img: "/projects/guest-bathroom-after.webp",
    span: "md:col-span-4",
    ratio: "aspect-[4/5]",
    sizes: "(max-width: 1023px) 100vw, 380px",
  },
  {
    p: pick("modern-shaker-kitchen-watford"),
    img: "/projects/shaker-kitchen-after.webp",
    span: "md:col-span-6",
    ratio: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 560px",
  },
  {
    p: pick("luxury-kitchen-dining-space-berkhamsted"),
    img: "/projects/kitchen-diner-after.webp",
    span: "md:col-span-6",
    ratio: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 560px",
  },
  {
    p: pick("warm-laminate-living-space-watford"),
    img: "/projects/laminate-living-after.webp",
    span: "md:col-span-6",
    ratio: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 560px",
  },
  {
    p: projects.find((p) => p.category === "Landscaping"),
    img: "/projects/garden-transformation-wide.webp",
    span: "md:col-span-6",
    ratio: "aspect-[16/10]",
    sizes: "(max-width: 1023px) 100vw, 560px",
  },
].filter((g): g is typeof g & { p: NonNullable<(typeof g)["p"]> } => Boolean(g.p));

// Three real MyBuilder reviews chosen for a luxury audience: a 32-year trade
// peer, a "looks very high-end" private client, and a discerning repeat
// client. Headlines are verbatim phrases lifted from each review.
const featuredQuotes = [testimonials[2], testimonials[1], testimonials[3]];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Trust strip — folds the old badges + stats into one slim, scannable
          line directly under the hero. Answers "why trust this company?" */}
      <section className="section-band">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 py-6 text-sm text-concrete">
              <span className="flex items-center gap-2">
                <Stars className="h-3.5 w-3.5" />
                <strong className="font-semibold text-white">{site.rating}</strong>
                rated
              </span>
              <span className="text-concrete-dark">•</span>
              <span>
                <strong className="font-semibold text-white">
                  {site.reviewCount}+
                </strong>{" "}
                verified reviews
              </span>
              <span className="text-concrete-dark">•</span>
              <span>
                <strong className="font-semibold text-white">
                  {site.clientsServed}+
                </strong>{" "}
                homeowners served
              </span>
              <span className="text-concrete-dark">•</span>
              <span>
                <strong className="font-semibold text-white">
                  {site.yearsExperience}+
                </strong>{" "}
                years
              </span>
              <span className="text-concrete-dark">•</span>
              <span>Fully insured &amp; guaranteed</span>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Services — editorial, type-led, with ONE real craft image. No cards,
          no stock filler. Answers "what services?" + "what quality?" */}
      <section id="services" className="py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="What we do"
                title="A complete renovation service, finished to a premium standard"
                subtitle="One team, end to end — design, build and finish. Selective work, meticulous detailing, no shortcuts."
              />
              <div className="mt-9 border-t border-white/10">
                {flagshipServices.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-6 border-b border-white/10 py-5 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-gold">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-concrete">
                        {s.short}
                      </p>
                    </div>
                    <Icon
                      name="arrow"
                      className="h-5 w-5 shrink-0 text-gold/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </Link>
                ))}
              </div>
              <Link
                href="/services"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
              >
                View all services
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <Reveal scale className="relative">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
                <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]">
                  <Photo
                    src="/about/about-craft.webp"
                    alt="Brushed-brass tapware on a Carrara marble vanity — craftsmanship detail from a Nicolla Contractors bathroom"
                    sizes="(max-width: 1023px) 100vw, 560px"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  Craftsmanship in every detail
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Featured Projects — THE STAR. Large real photography, minimal text,
          strong hierarchy. Answers "what quality of work can I expect?" */}
      <section id="projects" className="py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Selected work"
              title="Recent transformations"
              subtitle="A few of the spaces we've rebuilt across Hertfordshire & North London."
            />
            <Reveal>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
              >
                View all projects
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
            {gallery.map((g, i) => {
              const href =
                g.p.slug && g.p.detail ? `/projects/${g.p.slug}` : "/projects";
              return (
                <StaggerItem key={g.img} variant="tile" className={g.span}>
                  <Link
                    href={href}
                    className="group relative block overflow-hidden rounded-3xl ring-1 ring-white/10"
                  >
                    <div className={`relative ${g.ratio}`}>
                      <div className="absolute inset-0 transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]">
                        <Photo
                          src={g.img}
                          alt={`${g.p.title} — ${g.p.category} renovation in ${g.p.location} by Nicolla Contractors`}
                          sizes={g.sizes}
                          priority={i === 0}
                          eager
                        />
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                        {g.p.category}
                      </span>
                      <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                        {g.p.title}
                      </h3>
                      <p className="text-sm text-concrete">{g.p.location}</p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* Testimonials — quiet editorial pull-quotes, no carousel. Real,
          verified reviews. Answers "why should I trust this company?" */}
      <section id="testimonials" className="section-band py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Trusted by discerning homeowners
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-concrete">
              <Stars className="h-4 w-4" />
              <span>
                <strong className="font-semibold text-white">
                  {site.rating}
                </strong>{" "}
                from {site.reviewCount}+ verified MyBuilder reviews
              </span>
            </div>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {featuredQuotes.map((t) => (
              <Reveal key={t.headline}>
                <figure className="flex h-full flex-col">
                  <span className="h-px w-10 bg-gold" />
                  <blockquote className="mt-5 font-display text-xl font-semibold leading-snug text-white">
                    “{t.headline}”
                  </blockquote>
                  <figcaption className="mt-auto pt-6 text-sm">
                    <span className="font-medium text-white">{t.name}</span>
                    <span className="mt-0.5 block text-concrete">
                      {t.job} · {t.location}
                    </span>
                    <span className="mt-2 block text-xs text-concrete-dark">
                      Verified MyBuilder review · {t.date}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/testimonials"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
            >
              Read all reviews
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* Cost estimator — practical, fast. Answers "how much will it cost?"
          and primes the quote. Reuses the existing BudgetCalculator. */}
      <section id="estimator" className="py-24">
        <Container>
          <SectionHeading
            center
            eyebrow="Plan your budget"
            title="See an instant cost estimate"
            subtitle="Choose your project, size and finish for an indicative range — then book a free, accurate quote."
          />
          <div className="mx-auto mt-12 max-w-5xl">
            <BudgetCalculator />
          </div>
        </Container>
      </section>

      {/* Final CTA — strong but understated. Answers "how do I get a quote?"
          Links to /free-quote (the homepage form is intentionally omitted
          until lead capture is production-ready). */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.05] to-transparent" />
        </div>
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Start your transformation
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-concrete">
              Free, no-obligation quotes across Hertfordshire &amp; North London.
              Join {site.clientsServed}+ homeowners who trusted us with their
              renovation.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Link
                  href="/free-quote"
                  className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-semibold text-ink shadow-[0_10px_40px_-12px_rgba(200,162,76,0.6)] transition-transform hover:scale-[1.03]"
                >
                  Get a free quote
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </Magnetic>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition-colors hover:border-gold/50"
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                Call {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
