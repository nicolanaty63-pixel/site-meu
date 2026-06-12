import Link from "next/link";
import Container from "@/components/Container";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

// Branded 404 — replaces the unstyled Next.js default. Kept server-only and
// light: no motion, just the brand frame and the two most useful exits.
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="font-display text-7xl font-extrabold text-gold-gradient sm:text-8xl">
            404
          </p>
          <h1 className="mt-6 text-3xl font-extrabold text-white sm:text-4xl">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-4 leading-relaxed text-concrete">
            The page you&apos;re looking for may have moved or never existed.
            Head back home, or tell us about your project — we reply within 24
            hours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Back to home
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href={site.phoneHref}
              className="glass inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-semibold text-white transition-colors hover:border-gold/50"
            >
              <Icon name="phone" className="h-4 w-4 text-gold" />
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
