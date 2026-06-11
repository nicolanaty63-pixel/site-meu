"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import { submitLead } from "@/lib/lead";
import Icon from "@/components/ui/Icon";
import FormConsent from "@/components/FormConsent";

// Conversion-focused quote form — posts to /api/lead. Success only renders
// after the server confirms delivery; failures keep the visitor's input and
// surface direct contact channels instead.
export default function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  // Form-mount timestamp for the server-side time-trap spam check.
  const [mountedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      await submitLead(e.currentTarget, "quote-form", mountedAt);
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong grid min-h-[28rem] place-items-center rounded-3xl p-8 text-center"
      >
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-white">
            Request received — thank you!
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-concrete">
            One of our team will call you within 24 hours to arrange your free,
            no-obligation consultation. Prefer to talk now?
          </p>
          <a
            href={site.phoneHref}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            <Icon name="phone" className="h-4 w-4" />
            Call {site.phoneDisplay}
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-white">Get your free quote</h3>
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
          No obligation
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-concrete">
        <span className="flex gap-0.5 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" className="h-3.5 w-3.5 fill-current" />
          ))}
        </span>
        Rated {site.rating}/5 by {site.reviewCount}+ homeowners
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" placeholder="John Smith" />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            placeholder="07848 484088"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@email.co.uk"
          />
          <Field
            label="Postcode"
            name="postcode"
            placeholder="WD4 8AB"
            required={false}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-concrete">
            What do you need?
          </label>
          <select
            name="service"
            required
            defaultValue=""
            className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
          >
            <option value="" disabled>
              Select a service…
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Multiple / not sure">Multiple / not sure</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-concrete">
            Project details{" "}
            <span className="text-concrete-dark">(optional)</span>
          </label>
          <textarea
            name="message"
            rows={3}
            placeholder="Tell us a little about your project and timescale…"
            className="w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
          />
        </div>
        <FormConsent />
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-base font-bold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Get my free quote"}
          {status !== "sending" && <Icon name="arrow" className="h-4 w-4" />}
        </button>
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            <p className="font-medium">{error}</p>
            <p className="mt-2 text-red-200/80">
              Your details haven&apos;t been lost — please try again, or reach
              us directly:{" "}
              <a href={site.phoneHref} className="font-semibold underline">
                {site.phoneDisplay}
              </a>{" "}
              ·{" "}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold underline"
              >
                {site.email}
              </a>
            </p>
          </div>
        )}
        <p className="flex items-center justify-center gap-2 text-center text-xs text-concrete-dark">
          <Icon name="shield" className="h-3.5 w-3.5 text-gold" />
          Free &amp; no-obligation · We reply within 24 hours · Your details stay
          private
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-concrete">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
      />
    </div>
  );
}
