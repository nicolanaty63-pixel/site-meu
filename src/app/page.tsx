import Link from "next/link";

const stats = [
  { value: "120+", label: "Proiecte livrate" },
  { value: "98%", label: "Clienți mulțumiți" },
  { value: "8 ani", label: "Experiență" },
  { value: "24h", label: "Timp de răspuns" },
];

const services = [
  {
    title: "Design UI/UX",
    desc: "Interfețe clare și elegante, gândite în jurul utilizatorului.",
    icon: (
      <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm5 14h6M12 15v4" />
    ),
  },
  {
    title: "Dezvoltare web",
    desc: "Site-uri și aplicații rapide, scalabile, cu cod curat.",
    icon: <path d="m8 9-3 3 3 3m8-6 3 3-3 3M14 5l-4 14" />,
  },
  {
    title: "Branding",
    desc: "Identitate vizuală memorabilă, coerentă pe toate canalele.",
    icon: <path d="M12 3v18M5 8l7-5 7 5-7 5-7-5Z" />,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-24 text-center sm:pt-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Disponibili pentru proiecte noi
          </span>

          <h1 className="mx-auto mt-7 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Experiențe digitale <span className="text-gradient">premium</span>{" "}
            pentru brandul tău
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Suntem Nova Studio — proiectăm și construim site-uri moderne, rapide
            și memorabile. De la idee la lansare, ne ocupăm de fiecare detaliu.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-transform hover:scale-[1.03] sm:w-auto"
            >
              Începe un proiect
            </Link>
            <Link
              href="/services"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
            >
              Vezi serviciile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#0b0c14] px-6 py-8 text-center">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-sm text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ce putem face împreună
          </h2>
          <p className="mt-4 text-zinc-400">
            Servicii complete pentru a-ți duce produsul digital la nivelul
            următor.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 text-indigo-300 ring-1 ring-inset ring-white/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  {s.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {s.desc}
              </p>
              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors group-hover:text-indigo-200"
              >
                Află mai mult
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/20 px-8 py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hai să construim ceva remarcabil
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            Spune-ne despre proiectul tău și revenim cu o propunere în 24 de ore.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3 text-sm font-semibold text-zinc-900 transition-transform hover:scale-[1.03]"
          >
            Contactează-ne
          </Link>
        </div>
      </section>
    </>
  );
}
