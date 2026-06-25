import { z } from "zod";
import { services } from "@/lib/data";

/**
 * Isomorphic review rules, types and validation — safe to import on the client
 * (no Redis / node:crypto / server-only here). The server module
 * `@/lib/reviews` re-uses this so the form and the API agree on the exact same
 * bounds and the client can mirror validation for instant feedback.
 */

export type Review = {
  id: string;
  name: string;
  rating: number; // 1–5
  text: string;
  service?: string;
  createdAt: number; // epoch ms
};

export const REVIEW_RULES = {
  nameMin: 2,
  nameMax: 60,
  textMin: 20,
  textMax: 1500,
  maxStored: 500,
  rateMax: 3,
  rateWindowSec: 60 * 60,
  minFillMs: 2500,
  dupTtlSec: 60 * 60 * 24,
} as const;

// Allowed values for the optional service select.
export const SERVICE_OPTIONS: string[] = [
  ...services.map((s) => s.title),
  "Other",
];
const VALID_SERVICES = new Set(SERVICE_OPTIONS);

// Strip control characters but keep tab (\x09) and newline (\x0a).
const CONTROL_CHARS = /[\x00-\x08\x0b-\x1f\x7f]/g;
export function clean(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(CONTROL_CHARS, "")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type ReviewInput = {
  name?: unknown;
  rating?: unknown;
  text?: unknown;
  service?: unknown;
  company?: unknown; // honeypot — must be empty
  elapsedMs?: unknown; // ms since the form rendered — bot time-trap
};

export type ValidationResult =
  | { ok: true; value: Omit<Review, "id" | "createdAt"> }
  | { ok: false; code: "validation" | "bot"; error: string; field?: string };

/**
 * Strict Zod schema for a review submission.
 * - `.strictObject` rejects ANY unexpected key (mass-assignment defence:
 *   `id`, `createdAt`, `__proto__`, `isAdmin`, … can never sneak in).
 * - `company` / `elapsedMs` are allowed through (bot traps handled below) so
 *   strict mode doesn't reject the real payload.
 * - `clean()` runs inside the transform, then bounds are re-checked via pipe.
 */
const reviewSchema = z.strictObject({
  name: z
    .string()
    .transform(clean)
    .pipe(z.string().min(REVIEW_RULES.nameMin).max(REVIEW_RULES.nameMax)),
  rating: z.coerce.number().int().min(1).max(5),
  text: z
    .string()
    .transform(clean)
    .pipe(z.string().min(REVIEW_RULES.textMin).max(REVIEW_RULES.textMax)),
  service: z
    .string()
    .trim()
    .refine((v) => VALID_SERVICES.has(v))
    .optional()
    .catch(undefined),
  company: z.unknown().optional(), // honeypot — validated as a bot trap below
  elapsedMs: z.unknown().optional(), // time-trap — validated as a bot trap below
});

const FIELD_MSG: Record<string, string> = {
  name: `Please enter your name (${REVIEW_RULES.nameMin}–${REVIEW_RULES.nameMax} characters).`,
  rating: "Please select a star rating from 1 to 5.",
  text: `Please write a review of ${REVIEW_RULES.textMin}–${REVIEW_RULES.textMax} characters.`,
  service: "Please choose a valid service.",
};

/** Authoritative validation. Runs on the server; mirrored on the client for UX. */
export function validateReview(input: ReviewInput): ValidationResult {
  // 1) Bot traps first — generic rejection so bots learn nothing.
  if (typeof input.company === "string" && input.company.trim() !== "") {
    return { ok: false, code: "bot", error: "Submission rejected." };
  }
  const elapsed = Number(input.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < REVIEW_RULES.minFillMs) {
    return { ok: false, code: "bot", error: "Submission rejected." };
  }

  // 2) Strict, typed structured validation.
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]?.toString() ?? "text";
    return {
      ok: false,
      code: "validation",
      field,
      error: FIELD_MSG[field] ?? "Please check your details and try again.",
    };
  }

  const { name, rating, text, service } = parsed.data;
  return { ok: true, value: { name, rating, text, service } };
}
