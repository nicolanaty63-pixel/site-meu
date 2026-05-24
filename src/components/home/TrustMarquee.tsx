const items = [
  "Highly rated on MyBuilder",
  "4.9 / 5 average rating",
  "100+ happy clients",
  "Trusted by homeowners",
  "Fully insured",
  "12-month workmanship guarantee",
  "Punctual & professional",
  "Clean & tidy finish",
];

export default function TrustMarquee() {
  const row = [...items, ...items];
  return (
    <div className="marquee-paused relative overflow-hidden border-y border-white/10 bg-charcoal/70 py-4">
      <div className="animate-marquee flex w-max items-center">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center text-sm font-medium uppercase tracking-[0.15em] text-concrete"
          >
            {t}
            <span className="mx-7 h-1.5 w-1.5 rounded-full bg-gold/70" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-charcoal to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-charcoal to-transparent" />
    </div>
  );
}
