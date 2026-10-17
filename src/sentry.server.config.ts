import * as Sentry from "@sentry/nextjs";
import {
  DATA_COLLECTION_OFF,
  IGNORE_SPANS,
  SERVER_IGNORE_ERRORS,
  scrubBreadcrumb,
  scrubEvent,
  scrubSpan,
} from "@/lib/sentry-scrub";

// Server (Node.js runtime) error monitoring. Loaded by instrumentation.ts.
// Without NEXT_PUBLIC_SENTRY_DSN nothing is initialised.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV,
    tracesSampleRate: 0.1,
    // Outgoing requests (Resend, Upstash) carry no Sentry trace headers.
    tracePropagationTargets: [],
    sendClientReports: false,
    // Console output never becomes a breadcrumb: server logs carry lead
    // details for recovery (see scrubBreadcrumb).
    integrations: (defaults) => defaults.filter((i) => i.name !== "Console"),

    dataCollection: DATA_COLLECTION_OFF,
    ignoreErrors: SERVER_IGNORE_ERRORS,
    ignoreSpans: IGNORE_SPANS,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSendSpan: scrubSpan,
  });
}
