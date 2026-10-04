/**
 * The maintenance switch for the inner pages.
 *
 * While a section is closed, its pages (the section root and everything under
 * it) render the one "We're working on this page" screen
 * (components/home-v2/maintenance/MaintenancePage) in the Home v2 design, and
 * the site chrome steps aside for it (components/SiteChrome). Metadata, the
 * sitemap and the 200 status are untouched.
 *
 * - Reopen one section: remove it from CLOSED_SECTIONS.
 * - Reopen everything: set MAINTENANCE_ENABLED = false.
 * No other edit is needed — the original page components are untouched.
 */
export const MAINTENANCE_ENABLED = false;

export const CLOSED_SECTIONS = [
  "/about",
  "/services",
  "/projects",
  "/testimonials",
  "/contact",
  "/areas",
  "/guides",
] as const;

const LABELS: Record<(typeof CLOSED_SECTIONS)[number], string> = {
  "/about": "About",
  "/services": "Services",
  "/projects": "Projects",
  "/testimonials": "Testimonials",
  "/contact": "Contact",
  "/areas": "Areas we cover",
  "/guides": "Cost guides",
};

/** The closed section a path belongs to, or null. */
function closedSection(pathname: string) {
  return CLOSED_SECTIONS.find((s) => pathname === s || pathname.startsWith(`${s}/`)) ?? null;
}

/** True when `pathname` (a section root or anything under it) is closed. */
export function isClosed(pathname: string): boolean {
  return MAINTENANCE_ENABLED && closedSection(pathname) !== null;
}

/** The section name shown on the maintenance page, e.g. "Projects". */
export function sectionOf(pathname: string): string {
  const s = closedSection(pathname);
  return s ? LABELS[s] : "";
}
