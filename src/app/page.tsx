import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Counter from "@/components/Counter";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { services, projects, stats, badges, process } from "@/lib/data";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Trust badges */}
      <section className="border-y border-white/10 bg-charcoal/60">
        <Container className="grid grid-cols-2 gap-px py-2 lg:grid-cols-4">
          {badges.map((b) => (
            <Reveal key={b.title} className="flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  {b.title}
                </span>
                <span className="block text-xs text-concrete">{b.sub}</span>
              </span>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Stats — animated counters */}
      <section className="py-16">
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

      {/* Services */}
      <section id="services" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Premium services, delivered properly"
            subtitle="From a single room to a complete refurbishment, every project gets the same meticulous standard of workmanship."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-7 transition-colors hover:border-gold/40 hover:bg-surface"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                    {s.short}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    Learn more
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Project showcase */}
      <section className="py-20">
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
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
              >
                View all projects
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Link
                  href="/projects"
                  className="group block overflow-hidden rounded-2xl border border-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                      <Photo variant={p.variant} icon={services[i]?.icon} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                        {p.category} · {p.location}
                      </span>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        {p.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
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
            <Reveal>
              <BeforeAfterSlider
                before={
                  <Photo
                    tone="before"
                    variant={2}
                    icon="bath"
                    caption="Dated & tired"
                  />
                }
                after={
                  <Photo
                    tone="after"
                    variant={1}
                    icon="bath"
                    caption="Premium finish"
                  />
                }
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process timeline */}
      <section className="border-y border-white/10 bg-charcoal/40 py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="How it works"
            title="A simple, transparent process"
            subtitle="No surprises — just a clear path from first call to finished room."
          />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="relative">
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Testimonials"
            title="Rated 4.9/5 by our customers"
            subtitle="Don't just take our word for it — here's what homeowners across Hertfordshire say."
          />
          <div className="mt-12">
            <Testimonials />
          </div>
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
