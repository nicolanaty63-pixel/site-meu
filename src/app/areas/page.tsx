import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Icon from "@/components/ui/Icon";
import { areas } from "@/lib/areas";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Areas We Cover — Builders in London, North London & Hertfordshire",
  description:
    "Nicolla Contractors provides bathroom renovation, kitchen fitting, tiling and home refurbishment across London, North London and Hertfordshire — including Watford, St Albans, Hemel Hempstead and more.",
  path: "/areas",
});

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Areas we cover"
        title="Builders across Hertfordshire & North London"
        subtitle={`Based in ${site.baseTown}, we serve homeowners throughout the region. Find your area below for local renovation services.`}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {areas.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/areas/${a.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                    <Icon name="pin" className="h-4 w-4" />
                    {a.county}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {a.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                    {a.intro}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    Renovations in {a.name}
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
