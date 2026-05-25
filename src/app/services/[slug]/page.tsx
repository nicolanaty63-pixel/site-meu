import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQ from "@/components/FAQ";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { services } from "@/lib/data";
import { areas } from "@/lib/areas";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

const getService = (slug: string) => services.find((s) => s.slug === slug);

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMeta({
    title: `${s.title} — London, North London & Hertfordshire`,
    description: `${s.description} Trusted ${s.keyword}, rated ${site.rating}/5 by ${site.reviewCount}+ homeowners. Free quotes across London, North London & ${site.region}.`,
    path: `/services/${s.slug}`,
  });
}

const benefits = [
  "Premium, high quality finish in every detail",
  "Punctual, reliable and finished on schedule",
  "Clean and tidy — your home protected every day",
  "Fully insured with a workmanship guarantee",
];

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/services/${s.slug}/#service`,
        name: s.title,
        serviceType: s.keyword,
        description: s.description,
        areaServed: [...new Set([...site.serviceRegions, ...site.serves])].map(
          (a) => ({ "@type": "Place", name: a }),
        ),
        provider: {
          "@type": "GeneralContractor",
          name: site.name,
          telephone: site.phoneHref.replace("tel:", ""),
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: site.rating,
            reviewCount: site.reviewCount,
            bestRating: 5,
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${site.url}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: s.title,
            item: `${site.url}/services/${s.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <PageHero eyebrow="Service" title={s.title} subtitle={s.description} />

      {/* Overview */}
      <section className="py-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Photo variant={0} icon={s.icon} caption={s.title} />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Expert {s.title.toLowerCase()} across {site.region}
              </h2>
              <p className="mt-3 leading-relaxed text-concrete">
                {s.description} We&apos;re proud to be trusted {s.keyword},
                rated {site.rating}/5 by {site.reviewCount}+ homeowners across{" "}
                {site.region} and North London.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-concrete"
                  >
                    <Icon name="check" className="h-4 w-4 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/free-quote"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Get a free {s.title.toLowerCase()} quote
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="border-y border-white/10 bg-charcoal/40 py-16">
        <Container>
          <SectionHeading
            center
            eyebrow="Why choose us"
            title={`Why homeowners trust us with their ${s.title.toLowerCase()}`}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b} delay={(i % 4) * 0.06}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-surface/40 p-5">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <p className="text-sm leading-relaxed text-concrete">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Social proof */}
      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow="Testimonials" title="Rated 4.9/5" />
          <div className="mt-12">
            <TestimonialsSection />
          </div>
        </Container>
      </section>

      {/* Areas */}
      <section className="py-12">
        <Container className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {s.title} across our areas
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/areas/${a.slug}`}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-concrete transition-colors hover:border-gold/50 hover:text-white"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Common questions" />
          <div className="mt-12">
            <FAQ />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-14 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Ready for your {s.title.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete">
              Get a free, no-obligation quote today.
            </p>
            <Link
              href="/free-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Get my free quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
