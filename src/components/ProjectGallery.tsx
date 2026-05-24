"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects as allProjects, type Project } from "@/lib/data";
import Photo from "@/components/ui/Photo";
import Icon from "@/components/ui/Icon";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

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
  const filtered = useMemo(
    () =>
      filter === "All" ? items : items.filter((p) => p.category === filter),
    [filter, items]
  );

  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : filtered[index];

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i === null ? i : (i - 1 + filtered.length) % filtered.length
      ),
    [filtered.length]
  );

  // Reset selection whenever the filter changes
  useEffect(() => setIndex(null), [filter]);

  // Keyboard navigation + body scroll lock while the modal is open
  useEffect(() => {
    if (index === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, next, prev]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => {
          const count =
            c === "All"
              ? items.length
              : items.filter((p) => p.category === c).length;
          const activeFilter = filter === c;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                activeFilter
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-concrete hover:border-white/40 hover:text-white"
              }`}
            >
              {c}
              <span
                className={`text-xs ${
                  activeFilter ? "text-ink/70" : "text-concrete-dark"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {filtered.map((p, i) => (
          <motion.button
            key={p.title}
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            className="group block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-surface/40 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_30px_80px_-30px_rgba(200,162,76,0.5)]"
          >
            <div
              className={`relative overflow-hidden ${
                p.span ? "aspect-[4/5]" : "aspect-[4/3]"
              }`}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <Photo variant={p.variant} icon={p.icon} src={p.image} alt={p.title} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold backdrop-blur">
                {p.category}
              </span>
              <span className="glass absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-white">
                <Icon name="clock" className="h-3.5 w-3.5 text-gold" />
                {p.duration}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-gold">
                <Icon name="pin" className="h-3.5 w-3.5" />
                {p.location}
              </div>
              <h3 className="mt-1.5 text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-concrete">
                {p.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.services.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-concrete"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs text-concrete-dark">View details</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold">
                  Open
                  <Icon
                    name="arrow"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="glass-strong relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl"
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Before / after comparison */}
              <div className="relative">
                <BeforeAfterSlider
                  key={active.title}
                  className="!aspect-video !rounded-none !border-0"
                  before={
                    <Photo
                      tone="before"
                      variant={active.beforeVariant}
                      icon={active.icon}
                      src={active.beforeImage}
                      alt={`${active.title} — before`}
                    />
                  }
                  after={
                    <Photo
                      tone="after"
                      variant={active.variant}
                      icon={active.icon}
                      src={active.afterImage}
                      alt={`${active.title} — after`}
                    />
                  }
                />

                <button
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/80"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>

                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      aria-label="Previous project"
                      className="absolute left-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon name="arrow" className="h-5 w-5 rotate-180" />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next project"
                      className="absolute right-3 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
                    >
                      <Icon name="arrow" className="h-5 w-5" />
                    </button>
                  </>
                )}

                <span className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                  Drag to compare · {index! + 1} / {filtered.length}
                </span>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
                    {active.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-concrete">
                    <Icon name="pin" className="h-4 w-4 text-gold" />
                    {active.location}
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-concrete">
                  {active.summary}
                </p>

                <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-concrete-dark">
                      Completion time
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-medium text-white">
                      <Icon name="clock" className="h-4 w-4 text-gold" />
                      {active.duration}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-concrete-dark">
                      Location
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-medium text-white">
                      <Icon name="pin" className="h-4 w-4 text-gold" />
                      {active.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-concrete-dark">
                      Services used
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.services.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-concrete"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href="/contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
                >
                  Start a project like this
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
