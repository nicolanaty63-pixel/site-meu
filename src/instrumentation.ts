import * as Sentry from "@sentry/nextjs";

// Next.js instrumentation hook: loads the Sentry config for the runtime this
// server instance is running in.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Reports errors from Server Components, route handlers and middleware.
export const onRequestError = Sentry.captureRequestError;
