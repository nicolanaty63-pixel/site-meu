"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials as defaultData, type Testimonial } from "@/lib/data";
import Icon from "@/components/ui/Icon";
import { EASE_OUT } from "@/components/motion/tokens";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function Testimonials({
  items = defaultData,
}: {
  items?: Testimonial[];
}) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const paginate = useCallback(
    (dir: number) =>
      setState(([i]) => [(i + dir + items.length) % items.length, dir]),
    [items.length]
  );
  const goTo = (i: number) => setState(([prev]) => [i, i > prev ? 1 : -1]);

  // Auto-advance pauses for hover, keyboard focus AND touch (WCAG 2.2.2),
  // and never runs for reduced-motion users.
  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => paginate(1), 6000);
    return () => clearInterval(id);
  }, [paused, reduce, paginate]);

  const t = items[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={() => setPaused(true)}
    >
      <div className="glass-strong relative min-h-[22rem] overflow-hidden rounded-3xl p-8 sm:p-12">
        <Icon
          name="quote"
          className="absolute right-6 top-6 h-14 w-14 text-gold/15"
        />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE_OUT }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) paginate(1);
              else if (info.offset.x > 80) paginate(-1);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-between gap-3">
              <Stars n={t.rating} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                <Icon name="check" className="h-3.5 w-3.5" />
                Verified review
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-white">
              “{t.headline}”
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-concrete">
              {t.quote}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3">
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
              <div className="max-w-[13rem] text-right text-xs text-concrete-dark">
                <div className="font-medium text-concrete">
                  Verified MyBuilder review for Nicolla Contractors Ltd
                </div>
                <div>{t.date}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </button>
        {/* Wraps on narrow screens so the 36px dot hit-areas and the arrow
            buttons never get flex-shrunk below tappable size */}
        <div className="flex max-w-full flex-wrap justify-center">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              // Larger hit area for finger-friendly tapping on mobile (h-9 w-9
              // = 36px exceeds the 32px minimum); the visible pill stays at
              // its original 8px height with the active/inactive widths.
              className="group inline-flex h-9 w-9 items-center justify-center"
            >
              <span
                aria-hidden
                className={`block h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-gold"
                    : "w-2.5 bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
        >
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
