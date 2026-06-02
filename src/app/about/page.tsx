import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import Counter from "@/components/Counter";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import ParallaxImage from "@/components/motion/ParallaxImage";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { stats } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Us — Trusted Builders in Hertfordshire",
  description:
    "Learn about Nicolla Contractors Ltd, a premium home refurbishment company in Kings Langley, Hertfordshire. Reliable, professional builders rated 4.9/5 by 350+ customers.",
  path: "/about",
});

const values = [
  {
    icon: "ruler" as const,
    title: "Attention to detail",
    desc: "Customers talk about our high quality finish and great workmanship. We obsess over the details others rush — level floors, perfect tile lines and flawless seals.",
  },
  {
    icon: "clock" as const,
    title: "Punctual & reliable",
    desc: "Fast and reliable, every time. We turn up when we say we will, keep to the timeline we agree and keep you updated throughout.",
  },
  {
    icon: "broom" as const,
    title: "Respect for your home",
    desc: "Clean and tidy every single day — dust sheets down, areas protected and a full clean before we leave. We treat your home like our own.",
  },
  {
    icon: "handshake" as const,
    title: "Friendly communication",
    desc: "Approachable, professional people who keep you informed throughout — no jargon, no surprises, just clear and honest conversation.",
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

      {/* Story — editorial craft feature */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-6%] top-1/4 h-[26rem] w-[26rem] rounded-full bg-gold/[0.06] blur-[150px]" />
        </div>
        <Container>
          <Stagger className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Editorial image — single tall portrait, layered + colour-graded */}
            <StaggerItem variant="tile" className="relative">
              {/* Layered ambient glow */}
              <div className="pointer-events-none absolute -inset-4 -z-10">
                <div className="absolute bottom-0 left-0 h-2/3 w-2/3 rounded-full bg-gold/10 blur-3xl" />
                <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-full bg-navy/40 blur-3xl" />
              </div>
              {/* Offset matte frame for depth (desktop) */}
              <div className="pointer-events-none absolute inset-0 hidden translate-x-5 translate-y-5 rounded-[2rem] border border-gold/15 lg:block" />

              <figure className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_44px_100px_-45px_rgba(0,0,0,0.95)]">
                <ParallaxImage amount={12}>
                  <div className="h-full w-full transition-transform duration-[1300ms] ease-out group-hover:scale-105">
                    <Photo
                      src="/about/about-craft.webp"
                      alt="Bespoke bathroom renovation — Carrara marble vanity with brushed-brass widespread tap and gold-framed mirror"
                      sizes="(max-width: 1023px) 100vw, 560px"
                    />
                  </div>
                </ParallaxImage>

                {/* Editorial depth — the warm grade itself is applied uniformly
                    by <Photo> (shared brand tone); this adds navy/ink falloff */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-navy/25" />
                <div className="vignette pointer-events-none absolute inset-0" />
                <div className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />

                {/* Architectural photo caption */}
                <figcaption className="absolute bottom-5 left-5 flex items-center gap-3">
                  <span className="h-9 w-px bg-gold/70" />
                  <span className="leading-tight">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                      Bespoke bathroom
                    </span>
                    <span className="block text-sm font-medium text-white/90">
                      Carrara marble, brushed-brass detail
                    </span>
                  </span>
                </figcaption>
              </figure>

              {/* Floating credential plate — text-led, offset bottom-right */}
              <div className="glass-strong absolute -bottom-5 -right-3 z-20 hidden items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl sm:flex lg:-right-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <Icon name="ruler" className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-white">
                    Precision, by hand
                  </span>
                  <span className="block text-xs text-concrete">
                    Every join considered
                  </span>
                </span>
              </div>
            </StaggerItem>

            {/* Story copy */}
            <StaggerItem className="lg:pl-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <span className="h-px w-6 bg-gold/60" />
                Our story
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-[1.12] text-white sm:text-4xl lg:text-[2.6rem]">
                Craftsmanship, honesty and pride in every job
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-concrete">
                For over {site.yearsExperience} years, Nicolla Contractors has
                helped homeowners across {site.region} and North London transform
                their spaces — from spa-style bathrooms and bespoke kitchens to
                flawless tiling, flooring and full refurbishments.
              </p>
              <div className="mt-4 space-y-4 leading-relaxed text-concrete">
                <p>
                  We&apos;re a close-knit team of skilled tradespeople who
                  genuinely care about the work — and we treat every home as if it
                  were our own. It&apos;s why customers describe us as fast and
                  reliable, professional and clean and tidy, with a high quality
                  finish in every job.
                </p>
                <p>
                  No shortcuts, no mess left behind, no surprises. Just premium
                  work, done properly.
                </p>
              </div>
              <Link
                href="/contact"
                className="btn-sheen group mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink shadow-[0_10px_40px_-12px_rgba(200,162,76,0.6)] transition-transform hover:scale-[1.03]"
              >
                Work with us
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </StaggerItem>
          </Stagger>
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
