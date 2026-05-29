"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { site } from "@/lib/site";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import Magnetic from "@/components/motion/Magnetic";
import ParallaxImage from "@/components/motion/ParallaxImage";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { EASE_OUT } from "@/components/motion/tokens";

const ease = EASE_OUT;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const tile = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } },
};

// Curated hero showcase — real renovation photography, optimized to WebP.
const SHOWCASE_KITCHEN = "/hero/hero-kitchen.webp";
const SHOWCASE_BATHROOM = "/hero/hero-bathroom.webp";
const SHOWCASE_FLOORING = "/hero/hero-flooring.webp";

function Stars() {
  return (
    <span className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className="h-3.5 w-3.5 fill-current" />
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Cinematic exit: copy drifts up + fades as you scroll past the hero.
  // Disabled on phones / reduced-motion to keep scrolling perfectly smooth.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const copyStyle = reduce || isMobile ? undefined : { y: copyY, opacity: copyOpacity };

  return (
    <section ref={ref} className="relative -mt-28 overflow-hidden sm:-mt-52">
      {/* Ambient backdrop — slow-drifting light for living depth */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 to-ink" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="animate-drift-a absolute left-[-10%] top-1/3 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-[170px]" />
        <div className="animate-drift-b absolute right-[-6%] top-0 h-[30rem] w-[30rem] rounded-full bg-navy/40 blur-[150px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-52 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* LEFT — copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={copyStyle}
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            UK Renovation Specialists
          </motion.span>

          <motion.h1
            variants={item}
            className="text-shadow-hero mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Premium Home Renovations{" "}
            <span className="text-gold-shimmer">Built With Precision</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg leading-relaxed text-concrete sm:text-xl"
          >
            Bathrooms, kitchens &amp; flooring transformations across the UK.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/free-quote"
                className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink shadow-[0_10px_40px_-12px_rgba(200,162,76,0.6)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_18px_54px_-12px_rgba(200,162,76,0.75)] sm:w-auto"
              >
                Get Free Quote
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </Magnetic>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:scale-[1.04] hover:border-gold/40 hover:bg-white/10"
            >
              <Icon name="phone" className="h-4 w-4 text-gold" />
              Call Now
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-concrete"
          >
            <Stars />
            <span>Trusted by {site.reviewCount}+ homeowners</span>
            <span className="text-concrete-dark">•</span>
            <span>{site.rating}★ rated craftsmanship</span>
          </motion.div>
        </motion.div>

        {/* RIGHT — 3-image showcase collage */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gold/5 blur-2xl" />

          <div className="flex flex-col gap-4 lg:grid lg:h-[34rem] lg:grid-cols-5 lg:grid-rows-2 xl:h-[38rem]">
            {/* Image 1 — largest (kitchen) */}
            <motion.div
              variants={tile}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.85)] lg:aspect-auto lg:col-span-3 lg:row-span-2"
            >
              <ParallaxImage amount={7}>
                <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                  <Photo
                    src={SHOWCASE_KITCHEN}
                    alt="Premium open-plan kitchen and dining renovation with walnut cabinetry"
                    sizes="(max-width: 1023px) 100vw, 700px"
                    priority
                  />
                </div>
              </ParallaxImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20" />
              {/* On lg+ the "100+ Homeowners served" stat card overhangs the
                  collage's bottom-left — move the label to the top-left there
                  so it never collides. Below lg, the stat is hidden, so the
                  original bottom-left placement still reads as intended. */}
              <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-wider text-gold lg:bottom-auto lg:top-5">
                Kitchen &amp; dining
              </span>
            </motion.div>

            {/* Image 2 — bathroom */}
            <motion.div
              variants={tile}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.85)] lg:aspect-auto lg:col-span-2"
            >
              <ParallaxImage amount={13}>
                <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                  <Photo
                    src={SHOWCASE_BATHROOM}
                    alt="Modern grey bathroom renovation with walk-in shower and freestanding bath"
                    sizes="(max-width: 1023px) 100vw, 460px"
                  />
                </div>
              </ParallaxImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-gold">
                Bathroom renovation
              </span>
            </motion.div>

            {/* Image 3 — flooring */}
            <motion.div
              variants={tile}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.85)] lg:aspect-auto lg:col-span-2"
            >
              <ParallaxImage amount={13}>
                <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-105">
                  <Photo
                    src={SHOWCASE_FLOORING}
                    alt="Herringbone parquet wood flooring installation"
                    sizes="(max-width: 1023px) 100vw, 460px"
                  />
                </div>
              </ParallaxImage>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/20" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-gold">
                Flooring installation
              </span>
            </motion.div>
          </div>

          {/* Floating stat badge for layered depth */}
          <motion.div
            variants={item}
            className="animate-floaty glass-strong absolute -bottom-5 left-3 z-20 hidden items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl lg:flex"
          >
            <div className="font-display text-2xl font-extrabold leading-none text-gold-gradient">
              {site.reviewCount}+
            </div>
            <div className="text-xs leading-tight text-concrete">
              Homeowners
              <br />
              served
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
        >
          <motion.span
            animate={{ y: [0, 9, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-[11px] font-medium uppercase tracking-[0.2em] text-concrete-dark"
          >
            Scroll
            <Icon name="chevron" className="h-4 w-4 text-gold" />
          </motion.span>
        </motion.div>
      )}
    </section>
  );
}
