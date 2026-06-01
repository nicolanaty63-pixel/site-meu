import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Icon from "@/components/ui/Icon";
import { guides } from "@/lib/guides";
import { services } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Cost Guides — Renovation Pricing UK 2026",
  description: `Honest UK 2026 cost guides for bathroom and kitchen renovations, tiling, flooring installation and whole-house refurbishments. Real price ranges, breakdown by trade, no fluff.`,
  path: "/guides",
});

export default function GuidesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Cost guides"
        title="Honest UK renovation pricing"
        subtitle={`Real 2026 cost ranges for the work we do every day across ${site.region} and North London — what each project actually costs, where the money goes, and the choices that move the budget.`}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => {
              const service = services.find((s) => s.slug === g.serviceSlug);
              return (
                <Reveal key={g.slug} delay={(i % 3) * 0.06}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
                  >
                    {service && (
                      <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                        <Icon name={service.icon} className="h-5 w-5" />
                      </span>
                    )}
                    <h2 className="mt-4 text-lg font-semibold leading-snug text-white">
                      {g.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-concrete">
                      {g.intro.slice(0, 180)}…
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">
                      Read the guide
                      <Icon
                        name="arrow"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
