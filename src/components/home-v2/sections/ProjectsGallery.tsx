import Link from "next/link";
import { projects } from "@/lib/data";
import { projectsCopy } from "../copy";
import AccordionGallery, { type GalleryItem } from "./AccordionGallery";
import "../styles/projects.css";

const hidden = new Set<string>(projectsCopy.hiddenTitles);

const items: GalleryItem[] = projects
  .filter((p) => p.image && !hidden.has(p.title))
  .map((p) => ({
    title: p.title,
    meta: `${p.category} · ${p.location}`,
    // deep-link to the case study when one exists
    href: p.slug && p.detail ? `/projects/${p.slug}` : "/projects",
    image: p.image as string,
  }));

/** Recent projects (spec §3.5) as an AccordionGallery. */
export default function ProjectsGallery() {
  return (
    <section id="projects" data-hv="projects" className="hv-lv hv-lv-projects">
      <div className="hv-lv-orb" aria-hidden="true" />
      <div className="hv-lv-wrap">
        <div className="hv-lv-row">
          <div className="hv-lv-head hv-rv">
            <span className="hv-lv-eyebrow">
              <i />
              {projectsCopy.eyebrow}
            </span>
            <h2>
              {projectsCopy.titleLead} <em className="hv-gd">{projectsCopy.titleAccent}</em>
            </h2>
            <p>{projectsCopy.subtitle}</p>
          </div>
          <Link className="hv-lv-pill hv-rv hv-d1" href="/projects">
            {projectsCopy.more}{" "}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </Link>
        </div>
        <AccordionGallery items={items} label="Recent projects" />
      </div>
    </section>
  );
}
