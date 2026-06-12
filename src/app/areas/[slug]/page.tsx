import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import TestimonialsSection from "@/components/TestimonialsSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedProjectsFor from "@/components/RelatedProjectsFor";
import Icon from "@/components/ui/Icon";
import { areas, getArea } from "@/lib/areas";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  return pageMeta({
    title: `Builders in ${area.name} — Premium Renovations`,
    description: `Trusted builders & renovation specialists in ${area.name}, ${area.county}. Bathrooms, kitchens, tiling and flooring. Rated ${site.rating}/5 — free quotes.`,
    path: `/areas/${area.slug}`,
  });
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Local landing node. Deliberately NO aggregateRating here: the one
        // review pool belongs to the single sitewide /#business entity —
        // cloning it onto 10 area entities multiplies the same 115 reviews
        // across 11 rated businesses, which Google's review-snippet
        // guidelines treat as spammy markup.
        "@type": "GeneralContractor",
        "@id": `${site.url}/areas/${area.slug}/#business`,
        name: `${site.name} — ${area.name}`,
        url: `${site.url}/areas/${area.slug}`,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        areaServed: { "@type": "City", name: area.name },
        parentOrganization: { "@id": `${site.url}/#business` },
        address: {
          "@type": "PostalAddress",
          addressLocality: site.baseTown,
          addressRegion: site.region,
          addressCountry: "GB",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Areas",
            item: `${site.url}/areas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: area.name,
            item: `${site.url}/areas/${area.slug}`,
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

      <PageHero
        eyebrow={`${area.county} · Local builders`}
        title={`Builders & Renovation in ${area.name}`}
        subtitle={area.intro}
      />

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/areas", label: "Areas" },
          { label: area.name },
        ]}
      />

      {/* Local intro + CTA */}
      <section className="py-20">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-concrete">
              Whether you&apos;re planning a new bathroom, a dream kitchen, fresh
              flooring or a full refurbishment, Nicolla Contractors brings
              premium craftsmanship, reliability and a spotless finish to homes
              across {area.name}. We&apos;re fully insured, rated{" "}
              {site.rating}/5 by {site.reviewCount}+ homeowners, and we reply to
              every enquiry within 24 hours.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/free-quote"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Get a free quote in {area.name}
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
              <a
                href={site.phoneHref}
                className="glass inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition-colors hover:border-gold/50"
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Services */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Our services"
            title={`Renovation services in ${area.name}`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {s.title} in {area.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                    {s.short}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    Learn more
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

      {/* Recent case-studies in this area — silent when no matches, so areas
          without a published case study don't render an empty section. */}
      <RelatedProjectsFor
        filter={{ kind: "area", name: area.name }}
        heading={`Recent projects in ${area.name}`}
        eyebrow="Local work"
      />

      {/* Social proof */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Trusted locally"
            title={`Rated 4.9/5 near ${area.name}`}
          />
          <div className="mt-12">
            <TestimonialsSection />
          </div>
        </Container>
      </section>

      {/* Nearby areas */}
      <section className="border-t border-white/10 py-20">
        <Container className="text-center">
          <h2 className="text-xl font-semibold text-white">Nearby areas</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {area.nearby.map((n) => {
              const match = areas.find((a) => a.name === n);
              return match ? (
                <Link
                  key={n}
                  href={`/areas/${match.slug}`}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-concrete transition-colors hover:border-gold/50 hover:text-white"
                >
                  Builders in {n}
                </Link>
              ) : (
                <span
                  key={n}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-concrete-dark"
                >
                  {n}
                </span>
              );
            })}
            <Link
              href="/areas"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              All areas →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
