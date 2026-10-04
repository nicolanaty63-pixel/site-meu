"use client";

import { usePathname } from "next/navigation";
import { isClosed } from "@/lib/maintenance";

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
  return pathname === "/" || isClosed(pathname);
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
