import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import BudgetCalculator from "@/components/guides/BudgetCalculator";
import Icon from "@/components/ui/Icon";
import { guides, guideReadMinutes } from "@/lib/guides";
import { services } from "@/lib/data";
import { site } from "@/lib/site";

type TrustIcon = React.ComponentProps<typeof Icon>["name"];

export const metadata = pageMeta({
  title: "Cost Guides & Budget Calculator — UK Renovation Pricing",
  description: `Estimate your renovation budget in seconds, then dig into honest UK 2026 cost guides for bathrooms, kitchens, tiling, flooring and refurbishments. Rated ${site.rating}/5.`,
  path: "/guides",
});

// Why the estimates can be trusted — every line is backed by site.ts data or
// the editorial stance of the guides themselves. No invented credentials.
const trust: Array<{ icon: TrustIcon; title: string; desc: string }> = [
  {
    icon: "check",
    title: `Based on ${site.projectsCompleted}+ completed projects`,
    desc: "Every range is sanity-checked against work we've actually delivered, not scraped averages.",
  },
  {
    icon: "pin",
    title: "Built from real Hertfordshire renovation costs",
    desc: "Local labour and material rates for the areas we serve — not a national mean that fits nobody.",
  },
  {
    icon: "clock",
    title: "Updated for current labour and material rates",
    desc: "Guides are reviewed and re-priced for 2026, and each one shows its last-updated date.",
  },
  {
    icon: "shield",
    title: "No clickbait pricing",
    desc: "Ranges are honest and clearly hedged — never a too-good-to-be-true headline number.",
  },
  {
    icon: "handshake",
    title: "Real contractor experience",
    desc: `${site.yearsExperience}+ years on the tools, rated ${site.rating}/5 by ${site.reviewCount}+ homeowners.`,
  },
  {
    icon: "ruler",
    title: "Professional workmanship standards",
    desc: "The same finish-obsessed standard behind every estimate we publish.",
  },
];

export default function GuidesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Cost guides & budget calculator"
        title="Honest UK renovation pricing"
        subtitle={`Real 2026 cost ranges for the work we do every day across ${site.region} and North London — estimate your budget in seconds, then see exactly where the money goes.`}
      />

      {/* ---- Section 1: budget calculator ---- */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Instant estimate"
            title="Estimate your project budget"
            subtitle="Get a realistic renovation cost estimate in under 30 seconds."
          />
          <Reveal duration={0.5} className="mt-10">
            <BudgetCalculator />
          </Reveal>
        </Container>
      </section>

      {/* ---- Section 2: cost guides ---- */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="In-depth guides"
            title="The full cost guides"
            subtitle="What each project actually costs, where the budget goes, and the choices that move it."
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => {
              const service = services.find((s) => s.slug === g.serviceSlug);
              const mins = guideReadMinutes(g);
              return (
                <StaggerItem key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_60px_-28px_rgba(200,162,76,0.35)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      {service && (
                        <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                          <Icon name={service.icon} className="h-5 w-5" />
                        </span>
                      )}
                      {service && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-concrete">
                          {service.title}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 text-lg font-semibold leading-snug text-white">
                      {g.title}
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                        Typical cost · {g.costBadge}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-concrete-dark">
                        <Icon name="clock" className="h-3.5 w-3.5" />
                        {mins} min read
                      </span>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-concrete">
                      {g.intro.slice(0, 150)}…
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 border-t border-white/10 pt-4 text-sm font-medium text-gold">
                      Read the guide
                      <Icon
                        name="arrow"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* ---- Section 3: trust & transparency ---- */}
      <section className="section-band py-16 sm:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Trust & transparency"
            title="Why our estimates are realistic"
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trust.map((t) => (
              <StaggerItem key={t.title}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-colors duration-300 hover:border-gold/30">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={t.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-concrete">
                    {t.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ---- Section 4: conversion CTA ---- */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal duration={0.5}>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-6 py-16 text-center sm:px-10">
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                Need a fixed quote?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-concrete">
                Online calculators are useful for budgeting, but every home is
                different. Get a detailed quote tailored to your project.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform duration-200 hover:scale-[1.03]"
                >
                  Get a Quote
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <a
                  href={site.phoneHref}
                  className="glass inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition-colors duration-200 hover:border-gold/50"
                >
                  <Icon name="phone" className="h-4 w-4 text-gold" />
                  Call {site.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
