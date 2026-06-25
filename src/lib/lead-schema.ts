import { z } from "zod";
import { clean } from "@/lib/reviews-shared";

/**
 * Strict, isomorphic Zod schema for a lead/contact submission.
 * Reuse for the Server Action (authoritative) AND mirror on the client for UX.
 * `.strictObject` rejects unknown keys; `clean()` strips tags/control chars.
 */
export const leadSchema = z.strictObject({
  name: z.string().transform(clean).pipe(z.string().min(2).max(80)),
  email: z.email().max(254).transform((s) => s.trim().toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9 +()\-]{7,32}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  service: z.string().trim().max(60).optional(),
  message: z.string().transform(clean).pipe(z.string().min(10).max(2000)),
  consent: z.literal(true), // GDPR: explicit, unticked-by-default consent
  company: z.unknown().optional(), // honeypot — validated as a bot trap
  elapsedMs: z.coerce.number().optional(), // time-trap
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
