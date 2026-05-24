import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

const trust = [
  { icon: "star", label: `${site.rating} / 5`, sub: "Average rating" },
  { icon: "check", label: `${site.reviewCount}+`, sub: "Verified reviews" },
  { icon: "shield", label: "Fully insured", sub: "Workmanship guaranteed" },
  { icon: "broom", label: "Clean & tidy", sub: "On time, every time" },
] as const;

export default function TestimonialsSection() {
  return (
    <div>
      {/* Rating summary + trust badges */}
      <div className="mx-auto mb-14 grid max-w-4xl items-stretch gap-5 sm:grid-cols-[minmax(0,0.9fr)_1.4fr]">
        <Reveal className="glass-strong flex flex-col items-center justify-center rounded-3xl px-8 py-8 text-center">
          <div className="font-display text-7xl font-extrabold leading-none text-gold-gradient">
            {site.rating}
          </div>
          <div className="mt-3 flex gap-0.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" className="h-5 w-5 fill-current" />
            ))}
          </div>
          <div className="mt-3 text-sm text-concrete">
            Based on {site.reviewCount}+ reviews
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gold">
            Highly rated on MyBuilder
          </div>
        </Reveal>

        <Reveal delay={0.1} className="grid grid-cols-2 gap-3">
          {trust.map((b) => (
            <div
              key={b.sub}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface/40 p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-white">
                  {b.label}
                </div>
                <div className="text-xs text-concrete">{b.sub}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <Testimonials />
    </div>
  );
}
