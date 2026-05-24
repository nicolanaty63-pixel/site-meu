"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="surface-concrete absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
        <div className="absolute left-1/2 top-1/4 h-[36rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[150px]" />
        <div className="bg-grid absolute inset-0 opacity-60" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-sm text-gold"
          >
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            {site.rating}/5 · {site.reviewCount}+ happy customers
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          >
            Building &amp; renovation,
            <br />
            <span className="text-gold-gradient">crafted to perfection</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-concrete"
          >
            {site.name} delivers premium bathrooms, kitchens, tiling and flooring
            across {site.region} and North London — with the punctuality,
            cleanliness and craftsmanship our customers rave about.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Get a free quote
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View our work
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-concrete"
          >
            {[
              { icon: "shield", label: "Fully insured" },
              { icon: "clock", label: "Always on time" },
              { icon: "broom", label: "Clean & tidy" },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-2">
                <Icon
                  name={b.icon as "shield"}
                  className="h-4 w-4 text-gold"
                />
                {b.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-concrete-dark"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <Icon name="chevron" className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
