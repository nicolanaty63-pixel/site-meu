export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative pb-12 pt-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        {eyebrow && (
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-indigo-300">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
