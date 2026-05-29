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
  title: "Services — Bathrooms, Kitchens, Tiling & Flooring",
  description:
    "Bathroom renovation, kitchen fitting, precision tiling and flooring installation, plus full home refurbishment across London, North London and Hertfordshire. Fully-insured contractors rated 4.9/5.",
  path: "/services",
});

// Real photography per service (same assets as the homepage Services grid).
// Slugs without an entry fall back to the placeholder <Photo> tile.
const serviceImages: Record<string, string> = {
  "bathroom-renovations": "/lisa-anna-yhodTxZQQxw-unsplash.jpeg",
  "kitchen-renovations": "/franco-debartolo-ORzG4HrA9rI-unsplash.jpeg",
  tiling: "/tilingjj.jpeg",
  "laminate-flooring": "/claire-rendall-b6kAwr1i0Iw-unsplash.jpg",
  "flooring-installation": "/tile-merchant-ireland-Wblr6Q2Vr70-unsplash.jpeg",
  "home-refurbishment": "/brett-jordan-yica25Tg73w-unsplash.jpeg",
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
                        variant={i}
                        icon={s.icon}
                        caption={s.title}
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
                      <Link
                        href="/contact"
                        className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
                      >
                        Enquire about {s.title.toLowerCase()}
                        <Icon name="arrow" className="h-4 w-4" />
                      </Link>
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
