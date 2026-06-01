import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import FAQ from "@/components/FAQ";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/ui/Icon";
import { guides, getGuide } from "@/lib/guides";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMeta({
    title: g.metaTitle,
    description: g.metaDescription,
    path: `/guides/${g.slug}`,
  });
}

// Render simple inline markdown emphasis (**bold**) inside a paragraph string.
// Kept deliberately small — guide content uses ** for emphasis only.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const service = services.find((s) => s.slug === g.serviceSlug);

  // Article + FAQPage + BreadcrumbList JSON-LD. Article schema feeds rich
  // results eligibility for informational queries; FAQPage matches the
  // visible FAQ block; Breadcrumb mirrors the visible Breadcrumbs UI.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${site.url}/guides/${g.slug}/#article`,
        headline: g.title,
        description: g.metaDescription,
        author: { "@id": `${site.url}/#business` },
        publisher: { "@id": `${site.url}/#business` },
        datePublished: g.publishedDate,
        dateModified: g.lastUpdated,
        mainEntityOfPage: `${site.url}/guides/${g.slug}`,
        ...(service && {
          about: {
            "@type": "Service",
            name: service.title,
            "@id": `${site.url}/services/${service.slug}/#service`,
          },
        }),
        inLanguage: "en-GB",
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/guides/${g.slug}/#faq`,
        mainEntity: g.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cost guides",
            item: `${site.url}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: g.title,
            item: `${site.url}/guides/${g.slug}`,
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

      <PageHero eyebrow="Cost guide" title={g.title} subtitle={g.intro} />

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/guides", label: "Cost guides" },
          { label: g.title },
        ]}
      />

      {/* Body */}
      <section className="py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            <p className="text-sm text-concrete-dark">
              Last updated: <time dateTime={g.lastUpdated}>{g.lastUpdated}</time>
            </p>

            {g.sections.map((sec, i) => (
              <Reveal key={i} className="mt-12">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {sec.heading}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-concrete">
                  {sec.paragraphs.map((p, j) => (
                    <p key={j}>{renderInline(p)}</p>
                  ))}
                </div>

                {sec.bullets && (
                  <ul className="mt-5 space-y-3 leading-relaxed text-concrete">
                    {sec.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3">
                        <Icon
                          name="check"
                          className="mt-1.5 h-4 w-4 shrink-0 text-gold"
                        />
                        <span>{renderInline(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.priceTable && (
                  <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                    {sec.priceTable.caption && (
                      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-concrete">
                        {sec.priceTable.caption}
                      </div>
                    )}
                    <table className="w-full text-sm">
                      <tbody>
                        {sec.priceTable.rows.map((r, j) => (
                          <tr
                            key={j}
                            className="border-b border-white/5 last:border-0 align-top"
                          >
                            <td className="px-5 py-4 text-white">
                              <div className="font-medium">{r.label}</div>
                              {r.notes && (
                                <div className="mt-1 text-xs leading-relaxed text-concrete-dark">
                                  {r.notes}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 text-right font-semibold text-gold">
                              {r.range}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Reveal>
            ))}

            {/* CTA back to service pillar */}
            {service && (
              <Reveal className="mt-14">
                <div className="rounded-2xl border border-white/10 bg-surface/40 p-6 text-center sm:p-8">
                  <p className="text-sm uppercase tracking-wider text-gold">
                    Ready for a real quote?
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                    See our {service.title.toLowerCase()} service
                  </h3>
                  <p className="mt-3 text-sm text-concrete">
                    {service.short}
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
                    >
                      {service.title} service
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/free-quote"
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                    >
                      Get a free quote
                      <Icon name="arrow" className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
          </article>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Common questions" />
          <div className="mt-10">
            <FAQ items={g.faqs} />
          </div>
        </Container>
      </section>

      {/* Other guides */}
      <section className="border-t border-white/10 py-20">
        <Container className="text-center">
          <h2 className="text-xl font-semibold text-white">Other cost guides</h2>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {guides
              .filter((other) => other.slug !== g.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/guides/${other.slug}`}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-concrete transition-colors hover:border-gold/50 hover:text-white"
                >
                  {other.ctaLabel}
                </Link>
              ))}
          </div>
        </Container>
      </section>
    </>
  );
}
