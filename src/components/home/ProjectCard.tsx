"use client";

import Link from "next/link";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import ParallaxImage from "@/components/motion/ParallaxImage";
import type { IconName } from "@/lib/data";

/**
 * Premium portfolio card: scroll parallax on the image, smooth hover zoom,
 * a gradient scrim and a "View project" label that reveals on hover.
 */
export default function ProjectCard({
  title,
  category,
  location,
  variant,
  icon,
  image,
  href = "/projects",
}: {
  title: string;
  category: string;
  location: string;
  variant: number;
  icon: IconName;
  image?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 transition-all duration-500 hover:border-gold/40 hover:shadow-[0_30px_70px_-32px_rgba(0,0,0,0.85)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ParallaxImage amount={10}>
          <div className="h-full w-full transition-transform duration-[1100ms] ease-out group-hover:scale-110">
            <Photo src={image} variant={variant} icon={icon} alt={title} />
          </div>
        </ParallaxImage>

        {/* Scrim — deepens on hover for legibility + drama */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

        {/* Gold edge that traces in on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 transition-all duration-500 group-hover:ring-gold/30" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            {category} · {location}
          </span>
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
          <span className="mt-2 flex translate-y-1 items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View project
            <Icon name="arrow" className="h-4 w-4 text-gold" />
          </span>
        </div>
      </div>
    </Link>
  );
}
