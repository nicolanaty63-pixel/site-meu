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

/** Authoritative validation. Runs on the server; mirrored on the client for UX. */
export function validateReview(input: ReviewInput): ValidationResult {
  if (typeof input.company === "string" && input.company.trim() !== "") {
    return { ok: false, code: "bot", error: "Submission rejected." };
  }
  const elapsed = Number(input.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < REVIEW_RULES.minFillMs) {
    return { ok: false, code: "bot", error: "Submission rejected." };
  }

  const name = typeof input.name === "string" ? clean(input.name) : "";
  if (name.length < REVIEW_RULES.nameMin || name.length > REVIEW_RULES.nameMax) {
    return {
      ok: false,
      code: "validation",
      field: "name",
      error: `Please enter your name (${REVIEW_RULES.nameMin}–${REVIEW_RULES.nameMax} characters).`,
    };
  }

  const rating = Number(input.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      ok: false,
      code: "validation",
      field: "rating",
      error: "Please select a star rating from 1 to 5.",
    };
  }

  const text = typeof input.text === "string" ? clean(input.text) : "";
  if (text.length < REVIEW_RULES.textMin) {
    return {
      ok: false,
      code: "validation",
      field: "text",
      error: `Your review is a little short — please write at least ${REVIEW_RULES.textMin} characters.`,
    };
  }
  if (text.length > REVIEW_RULES.textMax) {
    return {
      ok: false,
      code: "validation",
      field: "text",
      error: `Please keep your review under ${REVIEW_RULES.textMax} characters.`,
    };
  }

  let service: string | undefined;
  if (typeof input.service === "string" && input.service.trim() !== "") {
    service = VALID_SERVICES.has(input.service) ? input.service : undefined;
  }

  return { ok: true, value: { name, rating, text, service } };
}
