import Reveal from "@/components/Reveal";
import Container from "@/components/Container";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-8rem] h-[24rem] w-[44rem] -translate-x-1/2 rounded-full bg-gold/10 blur-[140px]" />
        <div className="bg-grid absolute inset-0 opacity-50" />
      </div>
      <Container className="py-20 text-center sm:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            {eyebrow}
            <span className="h-px w-6 bg-gold/60" />
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-concrete">
              {subtitle}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
