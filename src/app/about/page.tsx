import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import Counter from "@/components/Counter";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { stats } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us — Trusted Builders in Hertfordshire",
  description:
    "Learn about Nicolla Contractors Ltd, a premium home refurbishment company in Kings Langley, Hertfordshire. Reliable, professional builders rated 4.9/5 by 100+ customers.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "ruler" as const,
    title: "Attention to detail",
    desc: "We obsess over the details others miss — clean lines, perfect joints and a flawless finish every time.",
  },
  {
    icon: "clock" as const,
    title: "Punctual & reliable",
    desc: "We turn up when we say we will and keep to the timeline we agree. Your time matters.",
  },
  {
    icon: "broom" as const,
    title: "Respect for your home",
    desc: "Dust sheets down, areas protected and a full clean before we leave. We treat your home like our own.",
  },
  {
    icon: "handshake" as const,
    title: "Friendly communication",
    desc: "Clear, honest updates throughout — no jargon, no surprises, just straightforward conversation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Premium builders with a reputation built on trust"
        subtitle={`${site.name} is a construction and renovation company in ${site.baseTown}, ${site.region}, delivering high-quality workmanship across the region.`}
      />

      {/* Story */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Photo variant={4} icon="build" caption="Craftsmanship you can trust" />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="Craftsmanship, honesty and pride in every job"
              />
              <div className="mt-5 space-y-4 leading-relaxed text-concrete">
                <p>
                  For over {site.yearsExperience} years, Nicolla Contractors has
                  helped homeowners across {site.region} and North London
                  transform their spaces — from spa-style bathrooms and bespoke
                  kitchens to flawless tiling, flooring and full refurbishments.
                </p>
                <p>
                  We&apos;re a close-knit team of skilled tradespeople who genuinely
                  care about the work. That&apos;s why our customers consistently
                  highlight our punctuality, cleanliness, communication and the
                  quality of our finish — and why so many come back to us and
                  recommend us to friends.
                </p>
                <p>
                  No shortcuts, no mess left behind, no surprises. Just premium
                  work, done properly.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                Work with us
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-charcoal/40 py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <Reveal key={s.label} className="text-center">
                <div className="font-display text-4xl font-extrabold text-gold-gradient sm:text-5xl">
                  <Counter
                    to={s.value}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix ?? ""}
                  />
                </div>
                <div className="mt-2 text-sm text-concrete">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Why choose us"
            title="The Nicolla difference"
            subtitle="The values our customers mention again and again in their reviews."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-5 rounded-2xl border border-white/10 bg-surface/40 p-7">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-concrete">
                      {v.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Ready to transform your home?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete">
              Book your free consultation today and find out why we&apos;re rated{" "}
              {site.rating}/5.
            </p>
            <Link
              href="/contact"
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
