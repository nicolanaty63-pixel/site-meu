import Link from "next/link";

const cols = [
  {
    title: "Companie",
    items: [
      { href: "/about", label: "Despre noi" },
      { href: "/services", label: "Servicii" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Servicii",
    items: [
      { href: "/services", label: "Design UI/UX" },
      { href: "/services", label: "Dezvoltare web" },
      { href: "/services", label: "Branding" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#07080d]/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
              N
            </span>
            <span className="text-white">Nova Studio</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
            Construim produse digitale rapide și elegante. Design premium,
            tehnologie modernă și atenție la fiecare detaliu.
          </p>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Nova Studio. Toate drepturile rezervate.</p>
          <p>Construit cu Next.js & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
