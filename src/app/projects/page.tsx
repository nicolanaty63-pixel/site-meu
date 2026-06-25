import { pageMeta } from "@/lib/seo";
import { jsonLdHtml } from "@/lib/jsonld";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ProjectGallery from "@/components/ProjectGallery";
import Icon from "@/components/ui/Icon";
import { projects } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Projects — Our Portfolio of Renovations",
  description:
    "Browse recent bathroom renovations, kitchen renovations, tiling and flooring projects by Nicolla Contractors across Hertfordshire and North London.",
  path: "/projects",
});

// CollectionPage + ItemList — gives Google a structured view of the portfolio,
// each project surfaced as a CreativeWork referencing its image and location.
const projectsLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${site.url}/projects/#collection`,
      url: `${site.url}/projects`,
      name: "Renovation projects by Nicolla Contractors",
      description:
        "Bathroom, kitchen, tiling and flooring projects completed across Hertfordshire and North London.",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#business` },
    },
    {
      "@type": "ItemList",
      "@id": `${site.url}/projects/#itemlist`,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          // Reference the dedicated case-study page via @id when present so
          // crawlers connect this list item to the full project page.
          ...(p.slug && p.detail && {
            "@id": `${site.url}/projects/${p.slug}/#project`,
            url: `${site.url}/projects/${p.slug}`,
          }),
          name: p.title,
          description: p.summary,
          locationCreated: { "@type": "Place", name: p.location },
          keywords: p.services.join(", "),
          creator: { "@id": `${site.url}/#business` },
          ...(p.afterImage && {
            image: `${site.url}${p.afterImage}`,
          }),
        },
      })),
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
      ],
    },
  ],
};

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(projectsLd) }}
      />

      <PageHero
        eyebrow="Portfolio"
        title="Projects we're proud of"
        subtitle="A selection of recent transformations. Filter by type and tap any project to take a closer look."
      />

      <section className="py-20">
        <Container>
          <ProjectGallery />
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Imagine what we could do for your home
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Start your project
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
