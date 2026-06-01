"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { services } from "@/lib/data";
import Icon from "@/components/ui/Icon";
import FormConsent from "@/components/FormConsent";

// Front-end demo form. To make it live, post `FormData` to an API route,
// a form service (Formspree/Resend) or wire up the mailto fallback.
export default function ContactForm() {
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
        className="grid min-h-[26rem] place-items-center rounded-2xl border border-white/10 bg-surface/60 p-8 text-center"
      >
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold text-white">
            Thank you!
          </h3>
          <p className="mt-3 max-w-sm text-concrete">
            Your enquiry has been received. We&apos;ll be in touch within 24
            hours to arrange your free consultation.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-surface/60 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="John Smith" />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="07848 484088"
        />
      </div>
      <div className="mt-5">
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.co.uk"
        />
      </div>
      <div className="mt-5">
        <label className="mb-2 block text-sm text-concrete">Service</label>
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
          <option value="Other">Something else</option>
        </select>
      </div>
      <div className="mt-5">
        <label className="mb-2 block text-sm text-concrete">
          Project details
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project, location and rough timescale…"
          className="w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
        />
      </div>
      <div className="mt-5">
        <FormConsent />
      </div>
      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.02]"
      >
        Request free quote
        <Icon name="arrow" className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-concrete-dark">
        Free, no-obligation. We reply within 24 hours.
      </p>
    </form>
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
      <label className="mb-2 block text-sm text-concrete">{label}</label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25"
      />
    </div>
  );
}
