import Link from "next/link";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/data";
import { legalPages } from "@/lib/legal";
import Icon from "@/components/ui/Icon";
import ManageCookiesButton from "@/components/consent/ManageCookiesButton";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link
            href="/"
            className="inline-block"
            aria-label={`${site.name} home`}
          >
            <Logo className="h-16 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-concrete">
            {site.tagline} in {site.baseTown}, {site.region}. Bathrooms,
            kitchens, tiling, flooring and complete home refurbishment — done
            properly.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-gold">
            <Icon name="star" className="h-4 w-4" />
            {site.rating} / 5 · {site.reviewCount}+ happy customers
          </div>
        </div>

        {/* Nav */}
        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-3">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-concrete transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/areas"
                className="text-sm text-concrete transition-colors hover:text-gold"
              >
                Areas we cover
              </Link>
            </li>
            <li>
              <Link
                href="/guides"
                className="text-sm text-concrete transition-colors hover:text-gold"
              >
                Cost guides
              </Link>
            </li>
            <li>
              <Link
                href="/free-quote"
                className="text-sm text-concrete transition-colors hover:text-gold"
              >
                Free quote
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-white">Services</h4>
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-concrete transition-colors hover:text-gold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-concrete">
            <li className="flex items-start gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {site.baseTown}, {site.region}
                <br />
                <span className="text-concrete-dark">
                  Serving {site.serves.slice(0, 4).join(", ")} & more
                </span>
              </span>
            </li>
            <li>
              <a
                href={site.phoneHref}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Icon name="phone" className="h-4 w-4 shrink-0 text-gold" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Icon name="mail" className="h-4 w-4 shrink-0 text-gold" />
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="clock" className="h-4 w-4 shrink-0 text-gold" />
              {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-concrete-dark sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          >
            {legalPages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="transition-colors hover:text-gold"
              >
                {p.label}
              </Link>
            ))}
            <ManageCookiesButton className="transition-colors hover:text-gold">
              Cookie preferences
            </ManageCookiesButton>
          </nav>
        </div>
      </div>
    </footer>
  );
}
