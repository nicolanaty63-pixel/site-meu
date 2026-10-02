"use client";

import { usePathname } from "next/navigation";

/**
 * Route-aware switch for the site chrome in the root layout.
 *
 * The Home page (`/`) ships its own navigation, footer and backgrounds
 * (components/home-v2), so on `/` the shared chrome — ambient background,
 * ScrollProgress, Navbar, Footer and the `<main>` top padding — steps aside
 * and the page renders its own landmarks. Every other route renders exactly
 * what it always has.
 */
function useIsHome() {
  return usePathname() === "/";
}

/** Renders its children on every route except Home. */
export function NotOnHome({ children }: { children: React.ReactNode }) {
  return useIsHome() ? null : <>{children}</>;
}

/** The page `<main>`: padded below the fixed Navbar everywhere except Home,
 *  where the page provides its own `<main>`. */
export function SiteMain({ children }: { children: React.ReactNode }) {
  if (useIsHome()) return <>{children}</>;
  return <main className="pt-28 sm:pt-52">{children}</main>;
}
