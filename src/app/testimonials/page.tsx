import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import TestimonialsSection from "@/components/TestimonialsSection";
import CustomerReviews from "@/components/reviews/CustomerReviews";
import Icon from "@/components/ui/Icon";
import { testimonials } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: `Testimonials — ${site.rating}/5 from ${site.reviewCount}+ Customers`,
  description:
    "Read reviews for Nicolla Contractors Ltd. Homeowners across Hertfordshire praise our professionalism, punctuality, attention to detail and high-quality workmanship.",
  path: "/testimonials",
});

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What our customers say"
        subtitle="We're proud of our reputation — built one happy customer at a time."
      />

      {/* Rating + trust badges + carousel */}
      <section className="py-20">
        <Container>
          <TestimonialsSection />
        </Container>
      </section>

      {/* Grid */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="More reviews"
            title="Real words from real customers"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 3) * 0.06}>
                <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-7">
                  <Stars n={t.rating} />
                  <figcaption className="mt-4 font-semibold text-white">
                    “{t.headline}”
                  </figcaption>
                  <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                    {t.quote}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display font-bold text-gold">
                      {t.name.charAt(0)}
                    </span>
                    <div className="text-sm">
                      <div className="font-medium text-white">{t.name}</div>
                      <div className="text-concrete-dark">
                        {t.job} · {t.location}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-concrete-dark">
                    Verified MyBuilder review for Nicolla Contractors Ltd ·{" "}
                    {t.date}
                  </p>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Customer-submitted reviews: form + live feed (newest first) */}
      <section className="bg-charcoal/30">
        <Container>
          <CustomerReviews />
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Join {site.clientsServed}+ happy clients
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Get your free quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
