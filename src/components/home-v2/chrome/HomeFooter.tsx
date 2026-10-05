import Link from "next/link";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/data";
import { legal, legalPages } from "@/lib/legal";
import Logo from "@/components/Logo";
import ManageCookiesButton from "@/components/consent/ManageCookiesButton";
import "../styles/footer.css";

const ico = {
  className: "hv-lv-ico",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/**
 * Home footer (spec §3.12): the same content and columns as the site-wide
 * Footer, in the redesign's styling, with both phone numbers.
 *
 * `wave` is the maintenance screen's variant (styles/maintenance.css): a solid
 * footer with the nav's gold wave, flipped, on its top edge.
 */
export default function HomeFooter({ wave = false }: { wave?: boolean }) {
  return (
    <footer data-hv="footer" className={`hv-lv hv-lv-footer${wave ? " hv-mt-footer" : ""}`}>
      {wave && (
        <svg
          className="hv-mt-wave"
          viewBox="0 0 1440 26"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hv-mt-foil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8F6D2A" />
              <stop offset=".22" stopColor="#E9D287" />
              <stop offset=".5" stopColor="#B8903F" />
              <stop offset=".78" stopColor="#F3E5A8" />
              <stop offset="1" stopColor="#A47F35" />
            </linearGradient>
          </defs>
          <path
            className="hv-mt-wf"
            d="M0,0 H1440 V13 C1320,23 1200,3 1080,13 C960,23 840,3 720,13 C600,23 480,3 360,13 C240,23 120,3 0,13 Z"
          />
          <path
            className="hv-mt-ws"
            d="M0,13 C120,3 240,23 360,13 C480,3 600,23 720,13 C840,3 960,23 1080,13 C1200,3 1320,23 1440,13"
          />
          <path
            className="hv-mt-wh"
            d="M0,13 C120,3 240,23 360,13 C480,3 600,23 720,13 C840,3 960,23 1080,13 C1200,3 1320,23 1440,13"
          />
        </svg>
      )}
      <div className="hv-lv-wrap hv-lv-fgrid">
        <div className="hv-lv-fbrand">
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo className="hv-lv-flogo" />
          </Link>
          <p>
            {site.tagline} in {site.baseTown}, {site.region}. Bathrooms, kitchens, tiling,
            flooring and complete home refurbishment — done properly.
          </p>
          <div className="hv-lv-frate">
            <svg {...ico}>
              <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
            </svg>
            {site.rating} / 5 on MyBuilder · {site.clientsServed}+ happy clients
          </div>
        </div>

        <div className="hv-lv-fcol hv-c2">
          <h4>Explore</h4>
          <ul>
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/areas">Areas we cover</Link>
            </li>
            <li>
              <Link href="/guides">Cost guides</Link>
            </li>
            <li>
              <Link href="/free-quote">Free quote</Link>
            </li>
          </ul>
        </div>

        <div className="hv-lv-fcol hv-c3">
          <h4>Services</h4>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hv-lv-fcol hv-c3">
          <h4>Get in touch</h4>
          <ul className="hv-lv-fcontact">
            <li>
              <svg {...ico}>
                <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 0 1 13 0c0 4.5-6.5 10-6.5 10Z" />
                <circle cx="12" cy="11" r="2.3" />
              </svg>
              <span>
                {site.baseTown}, {site.region}
                <br />
                <span className="hv-dim">Serving {site.serves.slice(0, 4).join(", ")} & more</span>
              </span>
            </li>
            <li>
              <svg {...ico}>
                <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 11l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
              </svg>
              <span>
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
                <br />
                <a href={site.phone2Href}>{site.phone2Display}</a>
              </span>
            </li>
            <li>
              <svg {...ico}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <svg {...ico}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5V12l3 2" />
              </svg>
              <span>{site.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hv-lv-fbot">
        <div className="hv-lv-wrap">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            {legal.companyNumber && (
              <>
                {" "}
                <span className="hv-nowrap">
                  {site.legalName} — Company No. {legal.companyNumber}
                </span>
              </>
            )}
          </p>
          <nav aria-label="Legal">
            {legalPages.map((p) => (
              <Link key={p.href} href={p.href}>
                {p.label}
              </Link>
            ))}
            <ManageCookiesButton className="hv-lv-fcookie">Cookie preferences</ManageCookiesButton>
          </nav>
        </div>
      </div>
    </footer>
  );
}
