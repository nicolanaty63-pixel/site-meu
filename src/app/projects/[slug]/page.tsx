import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { projects, services, serviceSlugFor } from "@/lib/data";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/** Only projects with both a slug AND a detail block become routes. */
const indexedProjects = projects.filter((p) => p.slug && p.detail);

export function generateStaticParams() {
  return indexedProjects.map((p) => ({ slug: p.slug! }));
}

const getProject = (slug: string) =>
  indexedProjects.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.detail) return {};
  return pageMeta({
    title: p.detail.metaTitle,
    description: p.detail.metaDescription,
    path: `/projects/${p.slug}`,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.detail) notFound();
  const d = p.detail!;

  // Related services for THIS project — derived from the free-text services
  // array via the shared slug resolver so the cluster graph is consistent.
  const relatedServiceSlugs = Array.from(
    new Set(
      p.services
        .map((s) => serviceSlugFor(s))
        .filter((x): x is string => x !== null),
    ),
  );
  const relatedServices = relatedServiceSlugs
    .map((s) => services.find((svc) => svc.slug === s))
    .filter((x): x is (typeof services)[number] => Boolean(x));

  // Related projects — same category, excluding self, prefer those with a
  // slug (so the link goes to a real case study). Cap at 3.
  const relatedProjects = projects
    .filter((other) => other.slug !== p.slug && other.category === p.category)
    .sort((a, b) => (a.slug ? -1 : 1) - (b.slug ? -1 : 1))
    .slice(0, 3);

  const heroImage = p.afterImage || p.image;
  const absImage = heroImage ? `${site.url}${heroImage}` : undefined;

  // CreativeWork + BreadcrumbList JSON-LD. The CreativeWork @id matches the
  // ItemList entries already on /projects so the graph is self-consistent.
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${site.url}/projects/${p.slug}/#project`,
        name: p.title,
        description: p.summary,
        url: `${site.url}/projects/${p.slug}`,
        ...(absImage && { image: absImage }),
        locationCreated: { "@type": "Place", name: p.location },
        creator: { "@id": `${site.url}/#business` },
        keywords: p.services.join(", "),
        inLanguage: "en-GB",
        // Surface the trade-relevant Service entities so this project links
        // into the topical authority graph at the schema level too.
        ...(relatedServices.length > 0 && {
          about: relatedServices.map((s) => ({
            "@type": "Service",
            "@id": `${site.url}/services/${s.slug}/#service`,
            name: s.title,
          })),
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${site.url}/projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: p.title,
            item: `${site.url}/projects/${p.slug}`,
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
        eyebrow={`${p.category} · ${p.location}`}
        title={p.title}
        subtitle={p.summary}
      />

      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/projects", label: "Projects" },
          { label: p.title },
        ]}
      />

      {/* At-a-glance */}
      <section className="py-8">
        <Container>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-surface/40 p-6 sm:grid-cols-3 sm:p-7">
            <div>
              <div className="text-xs uppercase tracking-wider text-concrete-dark">
                Location
              </div>
              <div className="mt-1 flex items-center gap-2 font-medium text-white">
                <Icon name="pin" className="h-4 w-4 text-gold" />
                {p.location}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-concrete-dark">
                On-site duration
              </div>
              <div className="mt-1 flex items-center gap-2 font-medium text-white">
                <Icon name="clock" className="h-4 w-4 text-gold" />
                {p.duration}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-concrete-dark">
                Services used
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.services.map((s) => {
                  const sslug = serviceSlugFor(s);
                  const cls =
                    "rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-concrete";
                  return sslug ? (
                    <Link
                      key={s}
                      href={`/services/${sslug}`}
                      className={`${cls} transition-colors hover:border-gold/40 hover:text-white`}
                    >
                      {s}
                    </Link>
                  ) : (
                    <span key={s} className={cls}>
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Hero image */}
      {heroImage && (
        <section className="pb-8">
          <Container>
            <Reveal>
              <div
                className={`relative overflow-hidden rounded-3xl border border-white/10 ${
                  p.span ? "mx-auto aspect-[4/5] max-w-md" : "aspect-video"
                }`}
              >
                <Photo
                  src={heroImage}
                  alt={`${p.title} — completed view`}
                  sizes="(max-width: 1023px) 100vw, 960px"
                  quality={90}
                />
              </div>
              <p className="mt-3 text-center text-sm italic text-concrete">
                {d.intro}
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Body */}
      <section className="py-8">
        <Container>
          <article className="mx-auto max-w-3xl space-y-14">
            {/* Scope */}
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Scope of work
              </h2>
              <ul className="mt-5 space-y-3 leading-relaxed text-concrete">
                {d.scope.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <Icon
                      name="check"
                      className="mt-1.5 h-4 w-4 shrink-0 text-gold"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Challenges */}
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Challenges we solved
              </h2>
              <ul className="mt-5 space-y-3 leading-relaxed text-concrete">
                {d.challenges.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <Icon
                      name="ruler"
                      className="mt-1.5 h-4 w-4 shrink-0 text-gold"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Process */}
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Process &amp; execution
              </h2>
              <ol className="mt-5 space-y-5">
                {d.process.map((step, i) => (
                  <li
                    key={i}
                    className="rounded-2xl border border-white/10 bg-surface/40 p-5"
                  >
                    <div className="text-sm font-semibold uppercase tracking-wider text-gold">
                      {step.phase}
                    </div>
                    <p className="mt-2 leading-relaxed text-concrete">
                      {step.detail}
                    </p>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* Materials */}
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Materials &amp; finishes
              </h2>
              <ul className="mt-5 grid gap-3 leading-relaxed text-concrete sm:grid-cols-2">
                {d.materials.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <Icon
                      name="check"
                      className="mt-1.5 h-4 w-4 shrink-0 text-gold"
                    />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Outcome */}
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Outcome
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-concrete">
                {d.outcome}
              </p>
            </Reveal>
          </article>
        </Container>
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="seam-top py-20">
          <Container>
            <SectionHeading
              center
              eyebrow="Trades involved"
              title="Services used on this project"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                    {s.short}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    See {s.title.toLowerCase()}
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading
              center
              eyebrow={`More ${p.category.toLowerCase()} projects`}
              title="Other transformations"
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {relatedProjects.map((other) => {
                const href = other.slug
                  ? `/projects/${other.slug}`
                  : "/projects";
                return (
                  <Link
                    key={other.title}
                    href={href}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                      <Icon name="pin" className="h-3.5 w-3.5" />
                      {other.location}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {other.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                      {other.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                      {other.slug ? "View case study" : "See in gallery"}
                      <Icon
                        name="arrow"
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Want a project like this?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete">
              Tell us what you have in mind and we&apos;ll come back with a
              free, no-obligation quote within 24 hours.
            </p>
            <Link
              href="/free-quote"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Get a free quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
