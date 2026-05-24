import PageHeader from "@/components/PageHeader";

const values = [
  {
    title: "Calitate, nu compromisuri",
    desc: "Fiecare pixel și fiecare linie de cod contează. Livrăm doar lucruri de care suntem mândri.",
  },
  {
    title: "Transparență totală",
    desc: "Comunicăm clar, la timp și fără surprize. Știi mereu în ce stadiu e proiectul.",
  },
  {
    title: "Viteză și performanță",
    desc: "Construim produse rapide, optimizate și plăcute de folosit pe orice dispozitiv.",
  },
  {
    title: "Parteneri pe termen lung",
    desc: "Nu livrăm și dispărem. Rămânem alături de tine pentru creștere continuă.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Despre noi"
        title="O echipă mică, cu ambiții mari"
        subtitle="Suntem Nova Studio — designeri și dezvoltatori pasionați care transformă idei în produse digitale memorabile."
      />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Povestea noastră
            </h2>
            <div className="mt-5 space-y-4 text-zinc-400">
              <p>
                Am pornit în 2017 cu o convingere simplă: tehnologia bună
                trebuie să arate bine și să fie ușor de folosit. De atunci, am
                ajutat zeci de companii să își construiască prezența online.
              </p>
              <p>
                Combinăm designul atent cu inginerie solidă. Rezultatul? Produse
                digitale care nu doar arată premium, ci și performează — rapid,
                accesibil și scalabil.
              </p>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-cyan-500/20">
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-7xl font-bold text-white/80">N</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Valorile noastre
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <h3 className="text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
