"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";
import FormConsent from "@/components/FormConsent";

// Conversion-focused quote form. Front-end demo — wire `FormData` to an API
// route, Resend/Formspree, or a CRM to capture leads in production.
export default function QuoteForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Honeypot anti-spam: silently ignore if the hidden field was filled.
    const hp = e.currentTarget.elements.namedItem("_hp") as HTMLInputElement | null;
    if (hp?.value) return;
    setSent(true);
  }

  if (sent) {
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-base font-bold text-ink transition-transform hover:scale-[1.02]"
        >
          Get my free quote
          <Icon name="arrow" className="h-4 w-4" />
        </button>
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
