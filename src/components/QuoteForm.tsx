"use client";

import { AnimatePresence } from "framer-motion";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";
import { useLeadForm } from "@/lib/use-lead-form";
import {
  TextField,
  SelectField,
  TextareaField,
  ConsentCheckbox,
  Honeypot,
  SubmitButton,
  LeadErrorBanner,
  LeadSuccess,
} from "@/components/lead/fields";

// Conversion-focused quote form. Renders more than once per page (hero +
// #quote section) — each instance gets its own hook state, so that's fine.
export default function QuoteForm() {
  const f = useLeadForm({ source: "free-quote" });

  if (f.status === "success") {
    return (
      <LeadSuccess
        className="glass-strong min-h-[28rem] rounded-3xl p-8"
        title="Request received — thank you!"
        message="One of our team will call you within 24 hours to arrange your free, no-obligation consultation. Prefer to talk now?"
      />
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

      <form onSubmit={f.onSubmit} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" value={f.values.name} onChange={(v) => f.setField("name", v)} error={f.errors.name} placeholder="John Smith" autoComplete="name" disabled={f.busy} />
          <TextField label="Phone" type="tel" value={f.values.phone} onChange={(v) => f.setField("phone", v)} error={f.errors.phone} placeholder="07848 484088" autoComplete="tel" disabled={f.busy} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" type="email" value={f.values.email} onChange={(v) => f.setField("email", v)} error={f.errors.email} placeholder="you@email.co.uk" autoComplete="email" disabled={f.busy} />
          <TextField label="Postcode" value={f.values.postcode} onChange={(v) => f.setField("postcode", v)} error={f.errors.postcode} placeholder="WD4 8AB" autoComplete="postal-code" disabled={f.busy} />
        </div>

        <SelectField label="What do you need?" value={f.values.service} onChange={(v) => f.setField("service", v)} error={f.errors.service} disabled={f.busy}>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
          <option value="Multiple / not sure">Multiple / not sure</option>
        </SelectField>

        <TextareaField label="Project details" hint="(optional)" rows={3} value={f.values.message} onChange={(v) => f.setField("message", v)} error={f.errors.message} placeholder="Tell us a little about your project and timescale…" disabled={f.busy} />

        <Honeypot inputRef={f.honeypotRef} />
        <ConsentCheckbox checked={f.values.consent} onChange={(v) => f.setField("consent", v)} error={f.errors.consent} disabled={f.busy} />

        <AnimatePresence>
          {f.formError && <LeadErrorBanner message={f.formError} />}
        </AnimatePresence>

        <SubmitButton busy={f.busy} label="Get my free quote" busyLabel="Sending…" className="px-6 py-4 text-base font-bold" />

        <p className="flex items-center justify-center gap-2 text-center text-xs text-concrete-dark">
          <Icon name="shield" className="h-3.5 w-3.5 text-gold" />
          Free &amp; no-obligation · We reply within 24 hours · Your details stay private
        </p>
      </form>
    </div>
  );
}
