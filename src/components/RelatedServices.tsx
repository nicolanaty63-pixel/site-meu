import Link from "next/link";
import Container from "@/components/Container";
import Icon from "@/components/ui/Icon";
import { services } from "@/lib/data";

/**
 * Curated cross-cluster service links shown at the bottom of every
 * /services/[slug] page. Signals the topical-authority graph to crawlers and
 * gives visitors a logical next step after reading about the current service.
 *
 * Source of truth is the `related` slugs array on each Service entry in
 * src/lib/data.ts — no mapping in this component.
 */
export default function RelatedServices({
  fromSlug,
  relatedSlugs,
}: {
  fromSlug: string;
  relatedSlugs: string[];
}) {
  const items = relatedSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s) && s!.slug !== fromSlug);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 py-14">
      <Container>
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Related services
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Often paired with this work
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-concrete">
                {s.short}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold">
                Explore {s.title.toLowerCase()}
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
