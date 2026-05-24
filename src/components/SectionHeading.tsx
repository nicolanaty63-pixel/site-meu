import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? "text-gold-dark" : "text-gold"
          }`}
        >
          <span className="h-px w-6 bg-gold/60" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${
          light ? "text-charcoal" : "text-white"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-concrete-dark" : "text-concrete"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
