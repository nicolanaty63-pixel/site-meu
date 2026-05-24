"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials as defaultData, type Testimonial } from "@/lib/data";
import Icon from "@/components/ui/Icon";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function Testimonials({
  items = defaultData,
}: {
  items?: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused, go]);

  const t = items[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[20rem] overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-8 sm:min-h-[18rem] sm:p-12">
        <Icon
          name="quote"
          className="absolute right-6 top-6 h-12 w-12 text-gold/20"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Stars n={t.rating} />
            <h3 className="mt-5 text-xl font-semibold text-white">
              “{t.headline}”
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-concrete">
              {t.quote}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display font-bold text-gold">
                {t.name.charAt(0)}
              </span>
              <div>
                <div className="font-medium text-white">{t.name}</div>
                <div className="text-sm text-concrete-dark">
                  {t.job} · {t.location}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
        >
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
