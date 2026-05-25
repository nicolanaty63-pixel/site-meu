import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import ProjectGallery from "@/components/ProjectGallery";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";

export const metadata = pageMeta({
  title: "Projects — Our Portfolio of Renovations",
  description:
    "Browse recent bathroom renovations, kitchen renovations, tiling and flooring projects by Nicolla Contractors across Hertfordshire and North London. Before & after transformations.",
  path: "/projects",
});

const beforeAfters = [
  { icon: "bath" as const, before: 2, after: 1, label: "Bathroom renovation" },
  { icon: "kitchen" as const, before: 3, after: 4, label: "Kitchen renovation" },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects we're proud of"
        subtitle="A selection of recent transformations. Filter by type and tap any project to take a closer look."
      />

      <section className="py-20">
        <Container>
          <ProjectGallery />
        </Container>
      </section>

      {/* Before / after showcase */}
      <section className="border-y border-white/10 bg-charcoal/40 py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Before & after"
            title="See the transformation"
            subtitle="Drag each slider to reveal the finished result."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {beforeAfters.map((b) => (
              <Reveal key={b.label}>
                <BeforeAfterSlider
                  before={
                    <Photo tone="before" variant={b.before} icon={b.icon} />
                  }
                  after={
                    <Photo tone="after" variant={b.after} icon={b.icon} />
                  }
                />
                <p className="mt-3 text-center text-sm text-concrete">
                  {b.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gold/15 via-charcoal to-charcoal px-8 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Imagine what we could do for your home
            </h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Start your project
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
