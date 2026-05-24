"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects as allProjects, type Project } from "@/lib/data";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";

const ICONS = ["bath", "kitchen", "floor", "tile", "build", "tile"] as const;

export default function ProjectGallery({
  items = allProjects,
}: {
  items?: Project[];
}) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.category)))],
    [items]
  );
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<Project | null>(null);

  const filtered =
    filter === "All" ? items : items.filter((p) => p.category === filter);

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              filter === c
                ? "border-gold bg-gold text-ink"
                : "border-white/15 text-concrete hover:border-white/40 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {filtered.map((p, i) => (
          <motion.button
            key={p.title}
            layout
            onClick={() => setActive(p)}
            className={`group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 text-left ${
              p.span ? "lg:[&_.ph]:aspect-[4/5]" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
          >
            <div
              className={`ph relative ${p.span ? "aspect-[4/5]" : "aspect-[4/3]"} overflow-hidden`}
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <Photo
                  variant={p.variant}
                  icon={ICONS[p.variant % ICONS.length]}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  {p.category} · {p.location}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {p.title}
                </h3>
              </div>
              <span className="absolute right-4 top-4 grid h-9 w-9 translate-y-1 place-items-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <Icon name="arrow" className="h-4 w-4 -rotate-45" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-charcoal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Photo
                  variant={active.variant}
                  icon={ICONS[active.variant % ICONS.length]}
                />
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/80"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
              <div className="p-6 sm:p-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  {active.category} · {active.location}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  {active.title}
                </h3>
                <p className="mt-3 leading-relaxed text-concrete">
                  {active.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-concrete"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
