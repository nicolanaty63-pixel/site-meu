import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { sectionOf } from "@/lib/maintenance";
import HomeRoot from "../HomeRoot";
import HomeNavbar from "../chrome/HomeNavbar";
import HomeFooter from "../chrome/HomeFooter";
import HomeCursor from "../chrome/HomeCursor";
import HomeStylesheet from "./HomeStylesheet";
import { maintenanceCopy as copy } from "./copy";
import "../styles/maintenance.css";

// Re-exported so a closed page needs a single import for its early return.
export { isClosed } from "@/lib/maintenance";

/**
 * The one "We're working on this page" screen, shown by every closed route
 * (lib/maintenance) in place of its own content. Like Home, it renders its
 * own chrome and landmarks — see components/SiteChrome.
 */
export default function MaintenancePage({ section }: { section: string }) {
  return (
    <HomeRoot>
      <HomeNavbar />
      <main className="hv-mt">
        <div className="hv-mt-cloud hv-mt-a" aria-hidden="true" />
        <div className="hv-mt-cloud hv-mt-c" aria-hidden="true" />
        <div className="hv-mt-in">
          <div className="hv-mt-text">
            <p className="hv-mt-label hv-mt-fade">{sectionOf(section)}</p>
            <h1 className="hv-mt-title">
              <span className="hv-mt-l">
                <span>{copy.titleLines[0]}</span>
              </span>{" "}
              <span className="hv-mt-l">
                <span>{copy.titleLines[1]}</span>
              </span>
            </h1>
            <p className="hv-mt-p hv-mt-fade hv-mt-d1">{copy.paragraph}</p>
            <Link className="hv-btn-wave hv-mt-cta hv-mt-fade hv-mt-d2" href="/">
              <span data-t={copy.cta}>{copy.cta}</span>
              <svg viewBox="0 0 26 10" aria-hidden="true">
                <path d="M0 5h24M19 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </Link>
            <div className="hv-mt-reach hv-mt-fade hv-mt-d3">
              <p className="hv-mt-tel hv-num">
                <a href={site.phoneHref}>{site.phoneDisplay}</a>
                <span>{copy.or}</span>
                <a href={site.phone2Href}>{site.phone2Display}</a>
              </p>
              <a className="hv-mt-mail" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </div>
          <figure className="hv-mt-shot">
            <div className="hv-mt-img">
              <Image
                src={copy.photo.src}
                alt={copy.photo.alt}
                fill
                priority
                sizes="(max-width: 900px) min(560px, 90vw), 450px"
              />
            </div>
            <figcaption className="hv-mt-fade hv-mt-d3">{copy.photo.caption}</figcaption>
          </figure>
        </div>
      </main>
      <HomeFooter wave />
      <HomeCursor />
      <HomeStylesheet />
    </HomeRoot>
  );
}
