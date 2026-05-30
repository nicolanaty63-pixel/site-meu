import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import { projects, serviceSlugFor, type Project } from "@/lib/data";

type Filter =
  | { kind: "service"; slug: string }
  | { kind: "area"; name: string };

/** Projects only become case-study deep-links when they have BOTH a slug and
 *  a detail block. Modal-only projects are excluded so we never link to a
 *  thin destination. */
function indexedProjects(): Project[] {
  return projects.filter((p) => p.slug && p.detail);
}

function matches(p: Project, f: Filter): boolean {
  if (f.kind === "service") {
    return p.services.some((label) => serviceSlugFor(label) === f.slug);
  }
  // Area name match — project locations are free-text ("St Albans,
  // Hertfordshire", "Watford", etc.), so a case-insensitive substring is
  // the most reliable join. Area pages with zero matches render nothing.
  return p.location.toLowerCase().includes(f.name.toLowerCase());
}

/**
 * Recent matching case-studies block. Renders nothing when there are zero
 * matches — important for area pages where many areas don't yet have a
 * published case study. Max 3 results to stay scannable.
 */
export default function RelatedProjectsFor({
  filter,
  heading,
  eyebrow = "Recent work",
  max = 3,
}: {
  filter: Filter;
  heading: string;
  eyebrow?: string;
  max?: number;
}) {
  const items = indexedProjects().filter((p) => matches(p, filter)).slice(0, max);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 py-14">
      <Container>
        <SectionHeading center eyebrow={eyebrow} title={heading} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Reveal key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-surface/40 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
              >
                <div
                  className={`relative overflow-hidden ${
                    p.wideCard ? "aspect-video" : p.span ? "aspect-[4/5]" : "aspect-[4/3]"
                  }`}
                >
                  <Photo
                    src={p.afterImage || p.image}
                    alt={`${p.title} — case study preview`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    quality={85}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gold">
                    <Icon name="pin" className="h-3.5 w-3.5" />
                    {p.location}
                  </div>
                  <h3 className="mt-1.5 text-lg font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-concrete">
                    {p.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                    View case study
                    <Icon
                      name="arrow"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
