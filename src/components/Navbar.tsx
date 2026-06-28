"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/Logo";
import GooeyNav from "@/components/GooeyNav";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      // backdrop-blur-md (12px) instead of -xl (24px): halves the per-frame
      // compositor cost of the sticky-when-scrolled glass effect, which is
      // one of the canonical causes of scroll lag on mobile Safari / Chrome.
      // bg-ink/80 underneath means the visual change is barely perceptible.
      // transform-gpu promotes the header into its own compositor layer so
      // the bg/border transition doesn't re-rasterize the area underneath.
      className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-ink/80 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-28 max-w-6xl items-center justify-between px-5 sm:h-52 sm:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center"
          aria-label={`${site.name} home`}
        >
          <Logo className="h-20 w-auto sm:h-48" priority />
        </Link>

        {/* Desktop nav — GooeyNav (premium gold gooey). Phone/tablet keep the
            hamburger menu below (lg:hidden) to protect mobile/tablet UX. */}
        <div className="hidden lg:block">
          <GooeyNav
            items={nav.map((l) => ({ label: l.label, href: l.href }))}
            colors={[1, 2, 3, 4]}
            initialActiveIndex={Math.max(
              0,
              nav.findIndex((l) => l.href === pathname),
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end gap-1.5 sm:flex">
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <Icon name="phone" className="h-4 w-4" />
              {site.phoneDisplay}
            </a>
            <span className="inline-flex items-center gap-1.5 text-xs text-concrete">
              <span className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" className="h-3 w-3 fill-current" />
                ))}
              </span>
              {site.rating}/5 · Highly rated on MyBuilder
            </span>
          </div>

          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-md border border-white/10 text-white lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-5 pb-8 pt-4 lg:hidden">
          <div className="flex flex-col">
            {nav.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`border-b border-white/5 py-3.5 text-lg ${
                    active ? "text-gold" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={site.phoneHref}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 font-medium text-ink"
            >
              <Icon name="phone" className="h-4 w-4" />
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
