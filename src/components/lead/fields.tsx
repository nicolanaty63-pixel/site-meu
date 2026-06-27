"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/site";

/* Shared, premium form parts used by every lead form (Contact + Quote) so the
   feedback — inline errors, spinner, success, error banner — is identical. */

export function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-300">
      <Icon name="close" className="h-3 w-3 shrink-0" />
      {children}
    </p>
  );
}

const inputBase =
  "w-full rounded-xl border bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:ring-2 disabled:opacity-60";
function ring(error?: string) {
  return error
    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
    : "border-white/10 focus:border-gold/60 focus:ring-gold/25";
}

export function TextField({
  label, value, onChange, error, type = "text", placeholder, autoComplete, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
  type?: string; placeholder?: string; autoComplete?: string; disabled?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">{label}</label>
      <input
        id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete} disabled={disabled}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${ring(error)}`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function SelectField({
  label, value, onChange, error, disabled, children,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
  disabled?: boolean; children: React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">{label}</label>
      <select
        id={id} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${ring(error)}`}
      >
        <option value="" disabled>Select a service…</option>
        {children}
      </select>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function TextareaField({
  label, value, onChange, error, placeholder, disabled, rows = 5, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
  placeholder?: string; disabled?: boolean; rows?: number; hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-concrete">
        {label}
        {hint && <span className="text-concrete-dark"> {hint}</span>}
      </label>
      <textarea
        id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        placeholder={placeholder} disabled={disabled}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} resize-none ${ring(error)}`}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/** Hidden honeypot — invisible to humans, often auto-filled by bots. */
export function Honeypot({ inputRef }: { inputRef: React.Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="hidden">
      <label>
        Company
        <input ref={inputRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function ConsentCheckbox({
  checked, onChange, error, disabled,
}: {
  checked: boolean; onChange: (v: boolean) => void; error?: string; disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <label className="flex items-start gap-3 text-xs leading-relaxed text-concrete">
        <input
          type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          disabled={disabled} aria-invalid={!!error}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c8a24c]"
        />
        <span>
          I consent to Nicolla Contractors Ltd storing and using the details I provide to
          respond to my enquiry, in line with the{" "}
          <Link href="/privacy-policy" className="text-gold underline">Privacy Policy</Link>.
          We will not share your details or send marketing without your consent.
        </span>
      </label>
      {error && <FieldError>{error}</FieldError>}
      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-concrete-dark">
        <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
        Your data is processed securely and never sold. See our{" "}
        <Link href="/gdpr" className="underline">GDPR notice</Link>.
      </p>
    </div>
  );
}

export function SubmitButton({
  busy, label, busyLabel = "Sending…", className = "",
}: {
  busy: boolean; label: string; busyLabel?: string; className?: string;
}) {
  return (
    <button
      type="submit" disabled={busy} aria-busy={busy}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gold font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${className}`}
    >
      {busy ? (
        <><Spinner />{busyLabel}</>
      ) : (
        <>{label}<Icon name="arrow" className="h-4 w-4" /></>
      )}
    </button>
  );
}

export function LeadErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
      className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
    >
      <p>{message}</p>
      <p className="mt-1.5 text-red-200/80">
        You can also reach us directly:{" "}
        <a href={site.phoneHref} className="font-semibold underline">{site.phoneDisplay}</a>{" · "}
        <a href={`mailto:${site.email}`} className="font-semibold underline">{site.email}</a>
      </p>
    </motion.div>
  );
}

export function LeadSuccess({
  title, message, className = "",
}: {
  title: string; message: string; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`grid place-items-center text-center ${className}`}
    >
      <div>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 16 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold"
        >
          <Icon name="check" className="h-8 w-8" />
        </motion.div>
        <h3 className="mt-6 text-2xl font-semibold text-white">{title}</h3>
        <p className="mx-auto mt-3 max-w-sm text-concrete">{message}</p>
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
