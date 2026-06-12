import { pageMeta } from "@/lib/seo";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import AreasMap from "@/components/AreasMap";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Areas We Cover — Hertfordshire & North London",
  description:
    "Bathroom renovation, kitchen fitting, tiling and refurbishment across Hertfordshire & North London — Watford, St Albans, Hemel Hempstead and more.",
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
          <AreasMap />
        </Container>
      </section>
    </>
  );
}
