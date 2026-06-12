"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";
import QuoteForm from "@/components/QuoteForm";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
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

const chips = [
  { icon: "star", label: `${site.rating}/5 rated` },
  { icon: "check", label: `${site.clientsServed}+ homeowners` },
  { icon: "shield", label: "Fully insured" },
  { icon: "clock", label: "24-hr response" },
] as const;

export default function QuoteHero() {
  return (
    <section className="relative -mt-28 overflow-hidden pb-16 pt-32 sm:-mt-52 sm:pt-60">
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="surface-concrete absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink" />
        <div className="absolute left-[12%] top-1/4 h-[34rem] w-[40rem] -translate-x-1/2 rounded-full bg-gold/12 blur-[160px]" />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="grain absolute inset-0 opacity-[0.06]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="glass inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-1.5 text-sm text-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Free, no-obligation quote
          </motion.div>

          <motion.h1
            variants={item}
            className="text-shadow-hero mt-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Your dream renovation,{" "}
            <span className="text-gold-gradient">without the stress</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-lg leading-relaxed text-concrete"
          >
            Premium bathrooms, kitchens, tiling and flooring across{" "}
            {site.region} and North London — built by a team homeowners trust.
            Punctual, tidy, fully insured and finished to the highest standard.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-3"
          >
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 text-sm text-concrete"
              >
                <Icon name={c.icon} className="h-4 w-4 text-gold" />
                {c.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 hidden items-center gap-3 text-sm text-concrete lg:flex"
          >
            <Icon name="arrow" className="h-5 w-5 rotate-90 text-gold" />
            Tell us about your project — it takes under a minute.
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          id="quote-top"
        >
          <QuoteForm />
        </motion.div>
      </div>
    </section>
  );
}
