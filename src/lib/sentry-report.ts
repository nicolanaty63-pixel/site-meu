import * as Sentry from "@sentry/nextjs";

/** Which part of the lead pipeline an API failure belongs to. */
export type FailureArea = "lead" | "reviews";

/**
 * Tags everything Sentry records during the current request with its area, so
 * an alert can watch `area:lead`. Call it first in a route handler: unexpected
 * exceptions (reported through `onRequestError`) then carry the tag too.
 */
export function markArea(area: FailureArea): void {
  Sentry.setTag("area", area);
}

/**
 * Reports a real failure (the email provider or the store throwing) from a
 * route's existing catch block. Only the error is passed on — never the
 * request body or any of the visitor's details. A visitor's own mistake
 * (validation, rate limit) is not a failure and must not be reported.
 */
export function reportFailure(area: FailureArea, err: unknown, kind?: string): void {
  Sentry.captureException(err, { tags: { area, ...(kind ? { kind } : {}) } });
}
