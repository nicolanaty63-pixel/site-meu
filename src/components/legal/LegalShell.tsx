import Link from "next/link";
import { legalPages } from "@/lib/legal";

export default function LegalShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
          Legal
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 text-lg leading-relaxed text-concrete">{intro}</p>
        )}
        <p className="mt-4 text-sm text-concrete-dark">
          Last updated: <time>{updated}</time>
        </p>

        <div className="legal mt-10">{children}</div>

        <nav
          aria-label="Legal pages"
          className="mt-14 flex flex-wrap gap-2 border-t border-white/10 pt-8"
        >
          {legalPages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-concrete transition-colors hover:border-gold/50 hover:text-white"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
