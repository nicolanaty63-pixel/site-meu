import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Container from "@/components/Container";

export type Crumb = { href?: string; label: string };

/**
 * Compact site breadcrumb trail. Renders right under the PageHero on detail
 * pages so visitors (and crawlers) see the position in the site hierarchy
 * even before the schema.org BreadcrumbList in the page's JSON-LD.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="-mt-6 pb-4 pt-2">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-concrete-dark">
          {items.map((c, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                {c.href && !isLast ? (
                  <Link
                    href={c.href}
                    className="text-concrete transition-colors hover:text-gold"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "text-concrete" : ""}
                  >
                    {c.label}
                  </span>
                )}
                {!isLast && (
                  <Icon
                    name="chevron"
                    className="h-3 w-3 -rotate-90 text-concrete-dark"
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
