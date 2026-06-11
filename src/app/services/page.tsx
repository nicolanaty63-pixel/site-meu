import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { services } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Services — Renovations, Extensions, Lofts & Roofing",
  description:
    "Bathroom & kitchen renovations, tiling and flooring, plus house extensions, loft conversions, roofing, landscaping and driveways across London, North London and Hertfordshire. Fully-insured contractors rated 4.9/5.",
  path: "/services",
});

// Real photography per service (same assets as the homepage Services grid).
// Slugs without an entry fall back to the placeholder <Photo> tile.
const serviceImages: Record<string, string> = {
  "bathroom-renovations": "/lisa-anna-yhodTxZQQxw-unsplash.jpeg",
  "kitchen-renovations": "/franco-debartolo-ORzG4HrA9rI-unsplash.jpeg",
  tiling: "/tilingjj.jpeg",
  "laminate-flooring": "/claire-rendall-b6kAwr1i0Iw-unsplash.jpg",
  // Two-storey rear extension mid-build (scaffolding + blockwork) — moved
  // here from the retired Home Refurbishment & Building section. Landscape
  // ~4:3 source, so the fixed-ratio tile shows it uncropped-in-spirit at
  // every breakpoint with no focal-point override needed.
  "home-extensions": "/brett-jordan-yica25Tg73w-unsplash.jpeg",
  "loft-conversions": "/toa-heftiba-WqE24tdeRMU-unsplash.jpg",
  roofing: "/clement-proust-RO9HIOzFSX0-unsplash.jpg",
  // Real finished-garden photo, retouched to remove a child from the lawn.
  // Already 4:3, so it fills the card with no crop at any breakpoint.
  landscaping: "/landscaping-garden-nicolla.jpg",
  // Driveways still renders the placeholder <Photo> treatment until
  // licensed photography lands.
};

// Focal point for the 4:3 cover crop on tiles whose source is a tall portrait,
// so the most important part stays in frame. Same crop at every breakpoint
// (the card ratio is fixed), so it reads on desktop, tablet and mobile alike.
const servicePositions: Record<string, string> = {
  // Loft: lift the crop toward the exposed beams + sloped ceiling — the
  // unmistakable "loft" read — while keeping the seating below in frame.
  "loft-conversions": "center 38%",
  // Roofing: hold the tile field and ridge against the sky for clear roofing
  // emphasis, trimming the eaves at the foot of the portrait.
  roofing: "center 42%",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Complete construction & renovation services"
        subtitle="Whatever your project, we bring the same premium standard — meticulous, reliable and finished to perfection."
      />

      <section className="py-20">
        <Container>
          <div className="space-y-20">
            {services.map((s, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={s.slug}
                  id={s.slug}
                  className="grid items-center gap-10 lg:grid-cols-2"
                >
                  <Reveal className={reversed ? "lg:order-2" : ""}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                      <Photo
                        src={serviceImages[s.slug]}
                        position={servicePositions[s.slug]}
                        variant={i}
                        icon={s.icon}
                        caption={s.title}
                        // Same Chromium quirk as the project gallery: native
                        // lazy-load never fires for below-fold images on
                        // small viewports, leaving tiles blank on mobile.
                        eager
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.08} className={reversed ? "lg:order-1" : ""}>
                    <div>
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                        <Icon name={s.icon} className="h-6 w-6" />
                      </span>
                      <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                        {s.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-concrete">
                        {s.description}
                      </p>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {s.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-sm text-concrete"
                          >
                            <Icon
                              name="check"
                              className="h-4 w-4 shrink-0 text-gold"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link
                          href={`/services/${s.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                        >
                          More on {s.title.toLowerCase()}
                          <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-light"
                        >
                          Enquire about {s.title.toLowerCase()}
                          <Icon name="arrow" className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete">
              Tell us about your space and we&apos;ll recommend the best approach —
              free of charge. Serving {site.serves.slice(0, 4).join(", ")} & more.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Request a free quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
