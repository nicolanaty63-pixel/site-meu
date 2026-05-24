import { site } from "@/lib/site";
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
        address: {
          "@type": "PostalAddress",
          addressLocality: site.baseTown,
          addressRegion: site.region,
          addressCountry: "GB",
        },
        areaServed: site.serves.map((a) => ({ "@type": "City", name: a })),
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
