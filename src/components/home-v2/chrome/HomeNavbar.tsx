"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { navCopy } from "../copy";
import "../styles/nav.css";

const Arrow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 26 10" aria-hidden="true">
    <path d="M0 5h24M19 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

/**
 * Home navigation (spec §3.1 / §4.1): fixed navy bar that shrinks once the
 * page scrolls past 40px, the gold metallic wave hanging below it, and the
 * full-screen drawer behind the burger (≤1180px).
 */
export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Off Home (the maintenance screen) the bar marks the section being viewed
  // and the contact links point back at Home's contact section.
  const pathname = usePathname();
  const isHome = pathname === "/";
  const current = isHome
    ? undefined
    : nav.find((l) => l.href !== "/" && (pathname === l.href || pathname.startsWith(`${l.href}/`)))
        ?.href;
  const contactHref = isHome ? "#contact" : "/#contact";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) burgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    drawerRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    // The drawer only exists below 1180px; widening the window closes it.
    const mq = window.matchMedia("(min-width: 1181px)");
    const onWide = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [open, close]);

  return (
    <header data-hv="nav" className={`hv-navroot${open ? " hv-menu" : ""}`}>
      <nav className={`hv-nav${scrolled ? " hv-on" : ""}`} aria-label="Main">
        <Link href="/" className="hv-logo" aria-label={`${site.name} home`}>
          <Image
            src="/home-v2/seal.svg"
            alt=""
            width={192}
            height={192}
            unoptimized
            fetchPriority="low"
          />
        </Link>
        <ul>
          {nav.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={l.href === current ? "hv-current" : undefined}
                aria-current={(isHome ? l.href === "/" : l.href === current) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hv-right">
          <a className="hv-rate-pill" href={contactHref}>
            <span>{navCopy.cta}</span>
            <Arrow className="hv-ar" />
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="hv-burger"
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            aria-controls="hv-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
        <div className="hv-wave" aria-hidden="true" />
      </nav>

      <div id="hv-drawer" ref={drawerRef} className="hv-drawer" inert={!open}>
        {nav.map((l, i) => (
          <Link
            key={l.href}
            className={`hv-m${l.href === current ? " hv-current" : ""}`}
            href={l.href}
            aria-current={l.href === current ? "page" : undefined}
            onClick={() => close(false)}
          >
            <span>{navCopy.numerals[i]}</span>
            {l.label}
          </Link>
        ))}
        <div className="hv-dfoot">
          <b className="hv-dnum hv-num">
            <a href={site.phoneHref}>{site.phoneDisplay}</a>
            <span className="hv-dnum2">
              {" · "}
              <a href={site.phone2Href}>{site.phone2Display}</a>
            </span>
          </b>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{navCopy.drawerRating}</span>
          <a className="hv-btn" href={contactHref} onClick={() => close(false)}>
            <i className="hv-tk hv-a" />
            <i className="hv-tk hv-b" />
            {navCopy.drawerQuote}
          </a>
        </div>
      </div>
    </header>
  );
}
