"use client";

import { useRef, useState } from "react";
import { leadSchema } from "@/lib/lead-schema";

/**
 * The one shared brain for every lead form on the site (Contact + all Quote
 * forms). Owns the field state, the isomorphic Zod validation, the bot traps
 * (honeypot + time-trap), the POST to /api/lead, and the success/error status —
 * so every form behaves identically. Each form only supplies its own JSX.
 */

export type LeadValues = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  postcode: string;
  consent: boolean;
};

export type LeadErrors = Partial<Record<keyof LeadValues, string>>;
export type LeadStatus = "idle" | "submitting" | "success" | "error";

const EMPTY: LeadValues = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  postcode: "",
  consent: false,
};

export type UseLeadFormOptions = {
  /** Sent as the `x-lead-source` header so emails show which form fired. */
  source: string;
  /** Contact form requires project details; quick-quote forms don't. */
  requireMessage?: boolean;
};

export function useLeadForm({ source, requireMessage = false }: UseLeadFormOptions) {
  const [values, setValues] = useState<LeadValues>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  // Bots fill the DOM element, not React state — so read the honeypot via ref.
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number>(Date.now());

  function setField<K extends keyof LeadValues>(key: K, value: LeadValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (formError) setFormError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError(null);

    const elapsedMs = Date.now() - mountedAt.current;
    const company = honeypotRef.current?.value ?? "";

    // 1) Client-side validation with the SAME schema the server enforces.
    const result = leadSchema.safeParse({ ...values, company, elapsedMs });
    const next: LeadErrors = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const f = issue.path[0] as keyof LeadValues | undefined;
        if (f && !next[f]) next[f] = issue.message;
      }
    }
    if (requireMessage && values.message.trim().length < 10 && !next.message) {
      next.message = "Please add a few details about your project (10+ characters)";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});

    // 2) Submit to the shared API route.
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-lead-source": source },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          service: values.service,
          message: values.message,
          postcode: values.postcode,
          consent: values.consent,
          company,
          elapsedMs,
        }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }

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
        setErrors({ [field as keyof LeadValues]: message });
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

  return {
    values,
    errors,
    status,
    formError,
    busy: status === "submitting",
    setField,
    onSubmit,
    honeypotRef,
  };
}
