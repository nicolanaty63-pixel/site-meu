"use client";

import { useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { services } from "@/lib/data";
import { site } from "@/lib/site";
import { leadSchema, type LeadField } from "@/lib/lead-schema";
import Icon from "@/components/ui/Icon";

type Values = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  consent: boolean;
};
type FieldErrors = Partial<Record<LeadField, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  consent: false,
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-ink"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  // Bot traps: honeypot (read from the DOM, since bots fill the element, not
  // React state) + time-trap (how long the form was on screen before submit).
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(Date.now());

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear that field's error as the user corrects it.
    if (errors[key as LeadField]) {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
    if (formError) setFormError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError(null);

    const elapsedMs = Date.now() - mountedAt.current;
    const candidate = {
      ...values,
      company: honeypotRef.current?.value ?? "",
      elapsedMs,
    };

    // 1) Client-side validation with the SAME schema the server enforces.
    const result = leadSchema.safeParse(candidate);
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const f = issue.path[0] as LeadField | undefined;
        if (f && !next[f]) next[f] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    // 2) Submit to the API route (authoritative validation + Resend delivery).
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lead-source": "contact" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          service: values.service,
          message: values.message,
          consent: values.consent,
          company: candidate.company,
          elapsedMs,
        }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

      // Surface a server validation error inline; anything else as a banner.
      let message = "Something went wrong sending your enquiry.";
      let field: string | undefined;
      try {
        const data = await res.json();
        if (typeof data?.error === "string" && data.error) message = data.error;
        if (typeof data?.field === "string") field = data.field;
      } catch {
        /* keep default */
      }

      if (res.status === 422 && field) {
        setErrors({ [field as LeadField]: message });
        setStatus("idle");
      } else {
        setFormError(message);
        setStatus("error");
      }
    } catch {
      setFormError(
        "We couldn't reach our enquiry system — please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  // ── Success state — premium confirmation, not an alert ──
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid min-h-[26rem] place-items-center rounded-2xl border border-white/10 bg-surface/60 p-8 text-center"
      >
        <div>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 16 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold"
          >
            <Icon name="check" className="h-8 w-8" />
          </motion.div>
          <h3 className="mt-6 text-2xl font-semibold text-white">Enquiry sent — thank you</h3>
          <p className="mx-auto mt-3 max-w-sm text-concrete">
            We&apos;ve received your details and will be in touch within 24 hours to
            arrange your free consultation.
          </p>
          <p className="mt-5 text-sm text-concrete-dark">
            Need us sooner?{" "}
            <a href={site.phoneHref} className="font-semibold text-gold hover:underline">
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </motion.div>
    );
  }

  const busy = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/10 bg-surface/60 p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          value={values.name}
          onChange={(v) => setField("name", v)}
          error={errors.name}
          placeholder="John Smith"
          autoComplete="name"
          disabled={busy}
        />
        <Field
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(v) => setField("phone", v)}
          error={errors.phone}
          placeholder="07848 484088"
          autoComplete="tel"
          disabled={busy}
        />
      </div>

      <div className="mt-5">
        <Field
          label="Email"
          type="email"
          value={values.email}
          onChange={(v) => setField("email", v)}
          error={errors.email}
          placeholder="you@email.co.uk"
          autoComplete="email"
          disabled={busy}
        />
      </div>

      <div className="mt-5">
        <SelectField
          label="Service"
          value={values.service}
          onChange={(v) => setField("service", v)}
          error={errors.service}
          disabled={busy}
        />
      </div>

      <div className="mt-5">
        <TextareaField
          label="Project details"
          value={values.message}
          onChange={(v) => setField("message", v)}
          error={errors.message}
          placeholder="Tell us about your project, location and rough timescale…"
          disabled={busy}
        />
      </div>

      {/* Consent + honeypot */}
      <div className="mt-5 space-y-3">
        {/* Honeypot: invisible to humans, often auto-filled by bots. */}
        <div aria-hidden="true" className="hidden">
          <label>
            Company
            <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-3 text-xs leading-relaxed text-concrete">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => setField("consent", e.target.checked)}
            disabled={busy}
            aria-invalid={!!errors.consent}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#c8a24c]"
          />
          <span>
            I consent to Nicolla Contractors Ltd storing and using the details I
            provide to respond to my enquiry, in line with the{" "}
            <Link href="/privacy-policy" className="text-gold underline">
              Privacy Policy
            </Link>
            . We will not share your details or send marketing without your consent.
          </span>
        </label>
        {errors.consent && <FieldError id="consent-error">{errors.consent}</FieldError>}

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-concrete-dark">
          <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          Your data is processed securely and never sold. See our{" "}
          <Link href="/gdpr" className="underline">
            GDPR notice
          </Link>
          .
        </p>
      </div>

      {/* Submission-level error banner (network / server) */}
      <AnimatePresence>
        {formError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
          >
            <p>{formError}</p>
            <p className="mt-1.5 text-red-200/80">
              You can also reach us directly:{" "}
              <a href={site.phoneHref} className="font-semibold underline">
                {site.phoneDisplay}
              </a>{" "}
              ·{" "}
              <a href={`mailto:${site.email}`} className="font-semibold underline">
                {site.email}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {busy ? (
          <>
            <Spinner />
            Sending…
          </>
        ) : (
          <>
            Request free quote
            <Icon name="arrow" className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-concrete-dark">
        Free, no-obligation. We reply within 24 hours.
      </p>
    </form>
  );
}

/* ── Field primitives ───────────────────────────────────────────── */

const inputBase =
  "w-full rounded-xl border bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:ring-2";
function ring(error?: string) {
  return error
    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
    : "border-white/10 focus:border-gold/60 focus:ring-gold/25";
}

function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-300">
      <Icon name="close" className="h-3 w-3 shrink-0" />
      {children}
    </p>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${ring(error)} disabled:opacity-60`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${ring(error)} disabled:opacity-60`}
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
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} resize-none ${ring(error)} disabled:opacity-60`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
