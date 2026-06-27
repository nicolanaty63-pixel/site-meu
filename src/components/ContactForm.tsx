"use client";

import { AnimatePresence } from "framer-motion";
import { services } from "@/lib/data";
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

export default function ContactForm() {
  const f = useLeadForm({ source: "contact", requireMessage: true });

  if (f.status === "success") {
    return (
      <LeadSuccess
        className="min-h-[26rem] rounded-2xl border border-white/10 bg-surface/60 p-8"
        title="Enquiry sent — thank you"
        message="We've received your details and will be in touch within 24 hours to arrange your free consultation."
      />
    );
  }

  return (
    <form onSubmit={f.onSubmit} noValidate className="rounded-2xl border border-white/10 bg-surface/60 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" value={f.values.name} onChange={(v) => f.setField("name", v)} error={f.errors.name} placeholder="John Smith" autoComplete="name" disabled={f.busy} />
        <TextField label="Phone" type="tel" value={f.values.phone} onChange={(v) => f.setField("phone", v)} error={f.errors.phone} placeholder="07848 484088" autoComplete="tel" disabled={f.busy} />
      </div>

      <div className="mt-5">
        <TextField label="Email" type="email" value={f.values.email} onChange={(v) => f.setField("email", v)} error={f.errors.email} placeholder="you@email.co.uk" autoComplete="email" disabled={f.busy} />
      </div>

      <div className="mt-5">
        <SelectField label="Service" value={f.values.service} onChange={(v) => f.setField("service", v)} error={f.errors.service} disabled={f.busy}>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>{s.title}</option>
          ))}
          <option value="Other">Something else</option>
        </SelectField>
      </div>

      <div className="mt-5">
        <TextareaField label="Project details" value={f.values.message} onChange={(v) => f.setField("message", v)} error={f.errors.message} placeholder="Tell us about your project, location and rough timescale…" disabled={f.busy} />
      </div>

      <div className="mt-5">
        <Honeypot inputRef={f.honeypotRef} />
        <ConsentCheckbox checked={f.values.consent} onChange={(v) => f.setField("consent", v)} error={f.errors.consent} disabled={f.busy} />
      </div>

      <AnimatePresence>
        {f.formError && (
          <div className="mt-5">
            <LeadErrorBanner message={f.formError} />
          </div>
        )}
      </AnimatePresence>

      <SubmitButton busy={f.busy} label="Request free quote" className="mt-5 px-6 py-3.5" />
      <p className="mt-3 text-center text-xs text-concrete-dark">
        Free, no-obligation. We reply within 24 hours.
      </p>
    </form>
  );
}
