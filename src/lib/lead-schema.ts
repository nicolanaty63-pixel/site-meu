import { z } from "zod";
import { clean } from "@/lib/reviews-shared";

/**
 * Single, isomorphic Zod schema for a contact / lead submission.
 *
 * Used in TWO places so the rules can never drift:
 *   • client (ContactForm) — instant inline field errors before any network hop
 *   • server (/api/lead)   — the AUTHORITATIVE gate; the client check is only UX
 *
 * `.strictObject` rejects unknown keys; `clean()` strips HTML tags + control
 * chars (defence-in-depth before the value is ever placed in an email).
 * Every rule carries a human message so the same text drives the inline UI.
 */
export const leadSchema = z.strictObject({
  name: z
    .string()
    .transform(clean)
    .pipe(z.string().min(2, "Please enter your name").max(80, "That name is too long")),

  email: z
    .email("Enter a valid email address")
    .max(254, "That email is too long")
    .transform((s) => s.trim().toLowerCase()),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9 +()\-]{7,20}$/, "Enter a valid phone number"),

  service: z
    .string()
    .trim()
    .min(1, "Please choose a service")
    .max(80, "That service name is too long"),

  // Optional at the schema level so quick-quote forms can submit a short/empty
  // note; the Contact form enforces a 10-char minimum client-side via the hook.
  message: z
    .string()
    .transform(clean)
    .pipe(z.string().max(2000, "Please keep your message under 2000 characters"))
    .optional(),

  // Optional — the quote forms collect a postcode to scope the estimate.
  postcode: z.string().trim().max(12, "That postcode looks too long").optional(),

  // GDPR: explicit, unticked-by-default consent. Must be a real boolean `true`.
  consent: z
    .boolean()
    .refine((v) => v === true, "Please tick the consent box so we can reply"),

  // Anti-spam — never shown to humans; validated purely as a bot trap.
  company: z.unknown().optional(), // honeypot (must be empty)
  elapsedMs: z.coerce.number().optional(), // ms since the form mounted (time-trap)
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** The user-facing fields, in display order — handy for the client form. */
export const LEAD_FIELDS = ["name", "phone", "email", "service", "message", "consent"] as const;
export type LeadField = (typeof LEAD_FIELDS)[number];
