import { site } from "@/lib/site";
import { jsonLdHtml } from "@/lib/jsonld";
import { services } from "@/lib/data";

// LocalBusiness / GeneralContractor structured data for local SEO + rich results.
export default function Schema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GeneralContractor",
        "@id": `${site.url}/#business`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        description: site.description,
        telephone: site.phoneHref.replace("tel:", ""),
        email: site.email,
        priceRange: "££",
        image: `${site.url}/og.jpg`,
        logo: `${site.url}/logo-nicolla-mark.png`,
        // Topical expertise — strengthens the entity's semantic relevance for
        // the trade niches the business actually delivers (vs. inferred from
        // page content alone). Each item is a search-meaningful subtopic
        // covered substantively in service pages and FAQs.
        knowsAbout: [
          "Bathroom renovation",
          "Walk-in showers",
          "Wet rooms",
          "Waterproof tanking",
          "Underfloor heating",
          "Kitchen renovation",
          "Bespoke kitchen fitting",
          "Quartz worktops",
          "Splashback installation",
          "Porcelain tiling",
          "Natural stone tiling",
          "Large-format tile installation",
          "Zellige feature walls",
          "Engineered wood flooring",
          "Solid wood flooring",
          "Luxury vinyl tile (LVT)",
          "Laminate flooring installation",
          "Herringbone parquet",
          "Self-levelling subfloors",
          "Home refurbishment",
          "Full house renovation",
          "Plastering and partitions",
          "Carpentry and joinery",
          "Skirting and trims",
        ],
        address: {
          "@type": "PostalAddress",
          ...(site.streetAddress && { streetAddress: site.streetAddress }),
          addressLocality: site.baseTown,
          addressRegion: site.region,
          ...(site.postalCode && { postalCode: site.postalCode }),
          addressCountry: "GB",
        },
        // Conditionally surfaced — both are completely absent from the JSON-LD
        // until real data is supplied in src/lib/site.ts. See BUSINESS-DATA.md.
        ...(site.geo && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: site.geo.latitude,
            longitude: site.geo.longitude,
          },
        }),
        ...(site.sameAs && site.sameAs.length > 0 && { sameAs: site.sameAs }),
        areaServed: [...new Set([...site.serviceRegions, ...site.serves])].map(
          (a) => ({ "@type": "Place", name: a }),
        ),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: site.rating,
          reviewCount: site.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Construction & Renovation Services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.description,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#business` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
    />
  );
}
