import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const services = [
  {
    title: "Design UI/UX",
    desc: "Wireframe-uri, prototipuri interactive și interfețe finale care pun utilizatorul pe primul loc.",
  },
  {
    title: "Dezvoltare web",
    desc: "Site-uri și aplicații moderne cu Next.js, React și cele mai bune practici de performanță.",
  },
  {
    title: "Branding & identitate",
    desc: "Logo, paletă, tipografie și ghid de brand coerent pe toate canalele.",
  },
  {
    title: "Magazine online",
    desc: "Soluții e-commerce rapide, sigure și optimizate pentru conversii.",
  },
  {
    title: "Optimizare SEO",
    desc: "Structură tehnică și conținut care te ajută să fii găsit în Google.",
  },
  {
    title: "Mentenanță & suport",
    desc: "Actualizări, monitorizare și îmbunătățiri continue după lansare.",
  },
];

const steps = [
  { n: "01", title: "Descoperire", desc: "Înțelegem obiectivele, publicul și nevoile tale." },
  { n: "02", title: "Design", desc: "Cream conceptul vizual și experiența utilizatorului." },
  { n: "03", title: "Dezvoltare", desc: "Transformăm designul în cod rapid și curat." },
  { n: "04", title: "Lansare", desc: "Testăm, publicăm și optimizăm continuu." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Servicii"
        title="Tot ce ai nevoie pentru online"
        subtitle="De la prima schiță la lansare și mentenanță — oferim servicii complete pentru produsul tău digital."
      />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Cum lucrăm
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="text-3xl font-bold text-gradient">{step.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/20 px-8 py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ai un proiect în minte?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-300">
            Scrie-ne și hai să discutăm cum te putem ajuta.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3 text-sm font-semibold text-zinc-900 transition-transform hover:scale-[1.03]"
          >
            Cere o ofertă
          </Link>
        </div>
      </section>
    </>
  );
}
