"use client";

import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { isClosed } from "@/lib/maintenance";

/** The segment Next selects for a URL that matches no route (app/not-found). */
const NOT_FOUND_SEGMENT = "/_not-found";

/**
 * Route-aware switch for the site chrome in the root layout.
 *
 * The Home page (`/`) ships its own navigation, footer and backgrounds
 * (components/home-v2), and so does the maintenance screen shown on closed
 * sections (lib/maintenance). On those routes the shared chrome — ambient
 * background, ScrollProgress, Navbar, Footer and the `<main>` top padding —
 * steps aside and the page renders its own landmarks. Every other route
 * renders exactly what it always has.
 */
function useOwnChrome() {
  const pathname = usePathname();
  // A URL that matches no route is the 404 page, which keeps the shared
  // chrome — also under a closed section (/about/typo).
  const notFound = useSelectedLayoutSegment() === NOT_FOUND_SEGMENT;
  return !notFound && (pathname === "/" || isClosed(pathname));
}

/** Renders its children on every route except those with their own chrome. */
export function NotOnHome({ children }: { children: React.ReactNode }) {
  return useOwnChrome() ? null : <>{children}</>;
}

/** The page `<main>`: padded below the fixed Navbar everywhere except the
 *  routes with their own chrome, where the page provides its own `<main>`. */
export function SiteMain({ children }: { children: React.ReactNode }) {
  if (useOwnChrome()) return <>{children}</>;
  return <main className="pt-28 sm:pt-52">{children}</main>;
}
