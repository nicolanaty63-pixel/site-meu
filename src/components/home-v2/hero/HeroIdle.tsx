"use client";

import { useEffect } from "react";

/**
 * Marks the hero `hv-idle` while it is fully off screen. The CTA's gold sheen
 * (`.hv-btn-wave span::after`, an infinite background-position animation)
 * pauses under that class: a main-thread animation that otherwise kept the
 * page restyling and repainting on every frame for the whole visit.
 */
export default function HeroIdle() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hv2 .hv-hero");
    if (!hero) return;
    const io = new IntersectionObserver((entries) => {
      hero.classList.toggle("hv-idle", !entries.some((e) => e.isIntersecting));
    });
    io.observe(hero);
    return () => {
      io.disconnect();
      hero.classList.remove("hv-idle");
    };
  }, []);
  return null;
}
