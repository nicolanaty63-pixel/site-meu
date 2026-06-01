import { pageMeta } from "@/lib/seo";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import QuoteHero from "@/components/lp/QuoteHero";
import StickyQuoteBar from "@/components/lp/StickyQuoteBar";
import QuoteForm from "@/components/QuoteForm";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQ from "@/components/FAQ";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { services, process, stats } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Free Renovation Quote — Bathrooms, Kitchens, Tiling & Flooring",
  description:
    "Get a free, no-obligation renovation quote from Nicolla Contractors Ltd. Premium bathrooms, kitchens, tiling & flooring across Hertfordshire & North London. Rated 4.9/5 — we reply within 24 hours.",
  path: "/free-quote",
});

const beforeAfters = [
  { icon: "bath" as const, before: 2, after: 0, label: "Bathroom renovation" },
  { icon: "kitchen" as const, before: 3, after: 1, label: "Kitchen renovation" },
];

const reasons = [
  {
    icon: "shield" as const,
    title: "Trusted & fully insured",
    desc: "Vetted, experienced tradespeople working to current UK building standards — with every job guaranteed.",
  },
  {
    icon: "star" as const,
    title: "Premium craftsmanship",
    desc: "A high quality finish in every detail. Rated 4.9/5 by over 100 happy homeowners.",
  },
  {
    icon: "clock" as const,
    title: "Reliable & punctual",
    desc: "We turn up when we say we will, keep to the timeline and finish on schedule.",
  },
  {
    icon: "broom" as const,
    title: "Stress-free & tidy",
    desc: "We protect your home, clean up daily and manage everything — so you don't have to.",
  },
];

export default function FreeQuotePage() {
  return (
    <>
      <QuoteHero />

      {/* Stats */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <Reveal key={s.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-gold-gradient sm:text-5xl">
                  <Counter
                    to={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix ?? ""}
                  />
                </div>
                <div className="mt-1.5 text-sm text-concrete">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why homeowners choose us */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Why homeowners choose us"
            title="Renovating should feel exciting, not stressful"
            subtitle="We take care of everything — so you get a beautiful, premium finish without the headaches."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={r.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-concrete">
                    {r.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Service highlights */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="What we do"
            title="Premium renovation services"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.06}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-surface/40 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-concrete">
                      {s.short}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Before / after */}
      <section className="border-y border-white/10 bg-charcoal/40 py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Real transformations"
            title="See the difference for yourself"
            subtitle="Drag each slider to reveal the finished result."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {beforeAfters.map((b) => (
              <Reveal key={b.label}>
                <BeforeAfterSlider
                  before={<Photo tone="before" variant={b.before} icon={b.icon} />}
                  after={<Photo tone="after" variant={b.after} icon={b.icon} />}
                />
                <p className="mt-3 text-center text-sm text-concrete">
                  {b.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Stress-free process */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="How it works"
            title="A simple, stress-free process"
            subtitle="From your first call to the final clean, we keep things clear and easy."
          />
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li>
                  <span className="font-display text-3xl font-extrabold text-gold/30">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-concrete">
                    {step.desc}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Social proof */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Trusted by homeowners"
            title="Rated 4.9/5 across Hertfordshire"
          />
          <div className="mt-12">
            <TestimonialsSection />
          </div>
        </Container>
      </section>

      {/* Urgency CTA */}
      <section className="py-20">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-6 py-16 text-center sm:px-10">
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.05]" />
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ink/40 px-4 py-1.5 text-sm font-medium text-gold">
                <Icon name="clock" className="h-4 w-4" />
                Limited availability — 2026 diary filling fast
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                Book your free consultation today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-concrete">
                We take on a select number of projects each month to give every
                home the quality and attention it deserves. Most quotes are
                returned within 24 hours.
              </p>
              <a
                href="#quote"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-ink transition-transform hover:scale-[1.03]"
              >
                Claim your free quote
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Quote form */}
      <section id="quote" className="py-20">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Free quote"
                title="Request your free, no-obligation quote"
                subtitle="Tell us about your project and we'll be in touch within 24 hours with honest advice and clear pricing."
              />
              <div className="mt-8 space-y-3">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-concrete">
                      Prefer to call?
                    </span>
                    <span className="block font-medium text-white">
                      {site.phoneDisplay}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                    <Icon name="pin" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-concrete">
                      Covering
                    </span>
                    <span className="block font-medium text-white">
                      {site.serves.slice(0, 4).join(", ")} &amp; more
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <QuoteForm />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container>
          <SectionHeading
            center
            eyebrow="FAQ"
            title="Your questions, answered"
          />
          <div className="mt-12">
            <FAQ />
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="pb-20">
        <Container>
          <Reveal className="text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
              Let&apos;s build something you&apos;ll love
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete">
              Join over {site.reviewCount} happy homeowners across {site.region}{" "}
              and North London.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#quote"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Get my free quote
                <Icon name="arrow" className="h-4 w-4" />
              </a>
              <a
                href={site.phoneHref}
                className="glass inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition-colors hover:border-gold/50"
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                Call {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <StickyQuoteBar />
    </>
  );
}
