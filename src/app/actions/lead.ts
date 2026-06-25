"use server";

import { leadSchema } from "@/lib/lead-schema";

/**
 * Secure Next.js Server Action boilerplate (Vector 2).
 *
 * Pattern: validate EVERYTHING server-side with the strict Zod schema, trip
 * bots silently, and NEVER leak internals/PII to the client. Wire to a form:
 *   <form action={submitLead}> … </form>
 * or call from an onSubmit handler. Pair with the Vector 4 edge rate-limiter
 * and the Vector 5 generic-error discipline for full coverage.
 */

const MIN_FILL_MS = 2500;

export type LeadActionResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

export async function submitLead(formData: FormData): Promise<LeadActionResult> {
  // 1) Bot traps — generic rejection so bots learn nothing.
  if ((formData.get("company")?.toString() ?? "") !== "") {
    return { ok: false, error: "Submission rejected." };
  }
  const elapsed = Number(formData.get("elapsedMs"));
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { ok: false, error: "Submission rejected." };
  }

  // 2) Strict, typed validation of the raw form data.
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    service: formData.get("service") ?? undefined,
    message: formData.get("message"),
    consent:
      formData.get("consent") === "on" || formData.get("consent") === "true",
    company: formData.get("company") ?? "",
    elapsedMs: elapsed,
  });
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]?.toString();
    return { ok: false, error: "Please check your details and try again.", field };
  }

  try {
    // 3) Deliver via your provider (Resend) using a SERVER-ONLY secret.
    //    Keep it stateless — email and discard; NEVER log the PII payload.
    //    await sendLeadEmail(parsed.data);
    return { ok: true };
  } catch {
    // 4) Generic failure only — no stack trace, no PII (see Vector 5 `fail()`).
    return { ok: false, error: "Something went wrong — please call us instead." };
  }
}
