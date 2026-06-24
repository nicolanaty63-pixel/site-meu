import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import Hero from "@/components/home/Hero";
import ProjectCard from "@/components/home/ProjectCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import Magnetic from "@/components/motion/Magnetic";
import { projects, stats, badges, process } from "@/lib/data";
import { site } from "@/lib/site";

// Flagship services featured on the homepage with premium copy + photography.
// The full set (incl. laminate flooring & refurbishment) lives on /services.
const featuredServices = [
  {
    slug: "bathroom-renovations",
    title: "Luxury Bathroom Renovations",
    blurb:
      "Spa-inspired bathrooms designed and built end to end — flawless tiling, seamless waterproofing and finishes made to last.",
    image: "/lisa-anna-yhodTxZQQxw-unsplash.jpeg",
    icon: "bath",
  },
  {
    slug: "tiling",
    title: "Precision Tiling Services",
    blurb:
      "Perfectly aligned porcelain, natural stone and large-format tiling across floors, walls and wet areas — sealed and faultless.",
    image: "/tilingjj.jpeg",
    icon: "tile",
  },
  {
    slug: "kitchen-renovations",
    title: "High-End Kitchen Transformations",
    blurb:
      "Bespoke kitchens fitted with precise carpentry, premium worktops and clean, considered lines that elevate the whole home.",
    image: "/franco-debartolo-ORzG4HrA9rI-unsplash.jpeg",
    icon: "kitchen",
  },
  {
    slug: "home-extensions",
    title: "Bespoke Home Extensions",
    blurb:
      "Single and double-storey extensions designed and built end to end — foundations, structure and a flawless finish that flows into your existing home.",
    image: "/brett-jordan-yica25Tg73w-unsplash.jpeg",
    icon: "extension",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Trust badges */}
      <section className="section-band">
        <Stagger className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px px-5 py-2 sm:px-6 lg:grid-cols-4">
          {badges.map((b) => (
            <StaggerItem key={b.title} className="flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  {b.title}
                </span>
                <span className="block text-xs text-concrete">{b.sub}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Stats — animated counters */}
      <section className="py-16">
        <Container>
          <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label} variant="tile">
                <div className="glass-strong rounded-2xl p-6 text-center transition-transform duration-500 hover:-translate-y-1">
                  <div className="font-display text-4xl font-extrabold text-gold-gradient sm:text-5xl">
                    <Counter
                      to={s.value}
                      decimals={s.decimals ?? 0}
                      suffix={s.suffix ?? ""}
                    />
                  </div>
                  <div className="mt-2 text-sm text-concrete">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Services */}
      <section id="services" className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[150px]" />
        </div>
        <Container>
          <SectionHeading
            center
            eyebrow="What we do"
            title="Premium services, delivered properly"
            subtitle="From a single room to a complete refurbishment, every project gets the same meticulous standard of workmanship."
          />
          <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:gap-10">
            {featuredServices.map((s, i) => {
              // Centre a lone final card so an odd count stays balanced and
              // equally sized within the 2-column grid (no left-aligned orphan).
              const isLoneLast =
                i === featuredServices.length - 1 &&
                featuredServices.length % 2 === 1;
              return (
                <StaggerItem
                  key={s.slug}
                  variant="tile"
                  className={
                    isLoneLast
                      ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%_-_1rem)] lg:w-[calc(50%_-_1.25rem)]"
                      : ""
                  }
                >
                  <Link
                    href={`/services/${s.slug}`}
                    className="service-card group flex h-full flex-col rounded-2xl p-7"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-concrete">
                      {s.blurb}
                    </p>
                    <span className="mt-5 text-sm font-medium text-gold">
                      Explore service
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
            >
              View all services
              <Icon
                name="arrow"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* Project showcase */}
      <section className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-[-8%] top-1/4 h-[26rem] w-[26rem] rounded-full bg-navy/30 blur-[140px]" />
        </div>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Our work"
              title="Recent projects"
              subtitle="A glimpse of the spaces we've transformed across Hertfordshire and North London."
            />
            <Reveal>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
              >
                View all projects
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <StaggerItem key={p.title} variant="tile">
                <ProjectCard
                  title={p.title}
                  category={p.category}
                  location={p.location}
                  variant={p.variant}
                  icon={p.icon}
                  image={p.image}
                  // Deep-link straight to the case study when one exists —
                  // the generic /projects hub is only the fallback.
                  href={p.slug && p.detail ? `/projects/${p.slug}` : "/projects"}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Before / after */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Before & after"
              title="The transformation speaks for itself"
              subtitle="Drag the slider to see the difference our team makes. Tired, dated spaces become bright, premium rooms built to last."
            />
            <Reveal scale className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />
              <BeforeAfterSlider
                beforeCaption="Dated & tired"
                afterCaption="Premium finish"
                before={
                  <Photo
                    variant={2}
                    icon="bath"
                    src="/before.jpg"
                    alt="Bathroom before renovation — dated suite and worn tiling"
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    quality={90}
                  />
                }
                after={
                  <Photo
                    variant={1}
                    icon="bath"
                    src="/after.jpg"
                    alt="The same bathroom after renovation — premium modern finish"
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    quality={90}
                  />
                }
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process timeline */}
      <section className="section-band py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="How it works"
            title="A simple, transparent process"
            subtitle="No surprises — just a clear path from first call to finished room."
          />
          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <StaggerItem key={step.title} className="relative">
                <span className="font-display text-3xl font-extrabold text-gold/30">
                  0{i + 1}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-concrete">
                  {step.desc}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Testimonials"
            title="Loved by homeowners across Hertfordshire"
            subtitle="Don't just take our word for it — here's what our customers say about working with us."
          />
          <div className="mt-12">
            <TestimonialsSection />
          </div>
        </Container>
      </section>

      {/* Cinematic CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="surface-concrete absolute inset-0 opacity-70" />
          <div className="animate-drift-a absolute left-1/2 top-1/2 h-[26rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[150px]" />
          <div className="bg-grid absolute inset-0 opacity-30" />
          <div className="grain absolute inset-0 opacity-[0.05]" />
          <div className="vignette absolute inset-0" />
        </div>
        <Container>
          <Reveal scale className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Start your transformation today
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-concrete">
              Free, no-obligation quotes. Join {site.clientsServed}+ homeowners who
              trusted us with their renovation.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Link
                  href="/contact"
                  className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-semibold text-ink shadow-[0_10px_40px_-12px_rgba(200,162,76,0.6)] transition-transform hover:scale-[1.03]"
                >
                  Get a free quote
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </Magnetic>
              <a
                href={site.phoneHref}
                className="glass inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-4 font-semibold text-white transition-colors hover:border-gold/50"
              >
                <Icon name="phone" className="h-4 w-4 text-gold" />
                Call {site.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="FAQ"
            title="Frequently asked questions"
          />
          <div className="mt-12">
            <FAQ />
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Get in touch"
                title="Start your project today"
                subtitle="Tell us what you have in mind and we'll arrange a free, no-obligation consultation and quote."
              />
              <div className="mt-8 space-y-4">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                    <Icon name="phone" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-concrete">Call us</span>
                    <span className="block font-medium text-white">
                      {site.phoneDisplay}
                    </span>
                  </span>
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                    <Icon name="mail" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-concrete">Email</span>
                    <span className="block font-medium text-white">
                      {site.email}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
                    <Icon name="pin" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-concrete">Based in</span>
                    <span className="block font-medium text-white">
                      {site.baseTown}, {site.region}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
