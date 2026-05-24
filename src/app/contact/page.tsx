"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

const info = [
  { label: "Email", value: "salut@novastudio.ro" },
  { label: "Telefon", value: "+40 712 345 678" },
  { label: "Locație", value: "București, România" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Hai să stăm de vorbă"
        subtitle="Completează formularul de mai jos sau scrie-ne direct. Revenim în maximum 24 de ore."
      />

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {info.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-xs uppercase tracking-wider text-zinc-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg font-medium text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
              {sent ? (
                <div className="grid min-h-[20rem] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
                      ✓
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">
                      Mesaj trimis!
                    </h3>
                    <p className="mt-2 text-zinc-400">
                      Îți mulțumim. Revenim cât de curând.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nume" name="name" placeholder="Ion Popescu" />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="ion@email.ro"
                    />
                  </div>
                  <Field
                    label="Subiect"
                    name="subject"
                    placeholder="Despre ce vrei să discutăm?"
                  />
                  <div>
                    <label className="mb-2 block text-sm text-zinc-300">
                      Mesaj
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Spune-ne despre proiectul tău..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c14] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-indigo-400/60"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-transform hover:scale-[1.01]"
                  >
                    Trimite mesajul
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-300">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0b0c14] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-indigo-400/60"
      />
    </div>
  );
}
