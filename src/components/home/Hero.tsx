"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { projects } from "@/lib/data";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";

const ease = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const tile = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
};

// Showcase projects (real photos appear automatically once set in lib/data.ts).
const kitchen = projects.find((p) => p.category === "Kitchen");
const bathroom = projects.find((p) => p.category === "Bathroom");
const flooring = projects.find((p) => p.category === "Flooring");

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
  return (
    <section className="relative -mt-40 overflow-hidden sm:-mt-48">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 to-ink" />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute left-[-10%] top-1/3 h-[34rem] w-[34rem] rounded-full bg-gold/10 blur-[170px]" />
        <div className="absolute right-[-6%] top-0 h-[30rem] w-[30rem] rounded-full bg-navy/40 blur-[150px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-40 sm:px-6 sm:pb-24 sm:pt-48 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* LEFT — copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            UK Renovation Specialists
          </motion.span>

          <motion.h1
            variants={item}
            className="text-shadow-hero mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Premium Home Renovations{" "}
            <span className="text-gold-gradient">Built With Precision</span>
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
            <Link
              href="/free-quote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_14px_44px_-10px_rgba(200,162,76,0.6)]"
            >
              Get Free Quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all duration-300 hover:scale-[1.04] hover:bg-white/10"
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
              <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-105">
                <Photo
                  src={kitchen?.image}
                  icon="kitchen"
                  variant={1}
                  alt="Luxury kitchen renovation"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-wider text-gold">
                Kitchen renovation
              </span>
            </motion.div>

            {/* Image 2 — bathroom */}
            <motion.div
              variants={tile}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.85)] lg:aspect-auto lg:col-span-2"
            >
              <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-105">
                <Photo
                  src={bathroom?.image}
                  icon="bath"
                  variant={0}
                  alt="Modern bathroom renovation"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-gold">
                Bathroom renovation
              </span>
            </motion.div>

            {/* Image 3 — flooring */}
            <motion.div
              variants={tile}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_34px_70px_-25px_rgba(0,0,0,0.85)] lg:aspect-auto lg:col-span-2"
            >
              <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-105">
                <Photo
                  src={flooring?.image}
                  icon="floor"
                  variant={2}
                  alt="Flooring installation"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-gold">
                Flooring installation
              </span>
            </motion.div>
          </div>

          {/* Floating stat badge for layered depth */}
          <motion.div
            variants={item}
            className="glass-strong absolute -bottom-5 left-3 z-20 hidden items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl lg:flex"
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
    </section>
  );
}
