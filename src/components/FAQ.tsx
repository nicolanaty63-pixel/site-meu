"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs as defaultFaqs, type FAQ as FAQItem } from "@/lib/data";
import Icon from "@/components/ui/Icon";
import { EASE_OUT, DURATION } from "@/components/motion/tokens";

export default function FAQ({ items = defaultFaqs }: { items?: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface/40">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-white">{item.q}</span>
              <Icon
                name="chevron"
                className={`h-5 w-5 shrink-0 text-gold transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 leading-relaxed text-concrete">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
