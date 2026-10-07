import * as Sentry from "@sentry/nextjs";
import {
  CLIENT_IGNORE_ERRORS,
  DATA_COLLECTION_OFF,
  DENY_URLS,
  scrubBreadcrumb,
  scrubEvent,
  scrubSpan,
} from "@/lib/sentry-scrub";

/**
 * The Sentry browser SDK and its configuration — tuned for an animation-heavy
 * site. This module is the only one that imports the SDK in the browser, and
 * it is loaded on demand by lib/sentry-client.ts once the page has finished
 * loading, so none of it sits on the page's start-up path.
 *
 * - No Session Replay, no profiling, no interaction recording.
 * - Nothing is stored on the device (no cookies, no localStorage) and nothing
 *   personal is sent — see lib/sentry-scrub.ts — so it runs without consent.
 * - A visit that is not sampled and has no error sends nothing at all.
 */

// Default integrations that are left out on purpose:
const LEFT_OUT = new Set([
  // Wraps every requestAnimationFrame callback, timer and event listener in a
  // try/catch — a cost on each frame of the animations. Errors thrown there
  // still reach window.onerror and are reported by GlobalHandlers.
  "BrowserApiErrors",
  // Sends a "session" ping on every page view.
  "BrowserSession",
  // Reads locale and time zone through Intl: the slowest single call of the
  // SDK's start-up, for context we do not need.
  "CultureContext",
  // Console output as breadcrumbs: never (see scrubBreadcrumb).
  "Console",
  // Only relevant to AI chat applications.
  "ConversationId",
]);

// Every kind of downloaded resource the browser reports (script, image,
// stylesheet, font…): none of them gets its own span.
const RESOURCE_SPAN_OPS = [
  "audio",
  "beacon",
  "body",
  "css",
  "early-hints",
  "embed",
  "frame",
  "icon",
  "iframe",
  "image",
  "img",
  "input",
  "link",
  "navigation",
  "object",
  "other",
  "ping",
  "script",
  "track",
  "video",
].map((type) => `resource.${type}`);

/** Page loads + Web Vitals are measured on about 1 in 10 visits. */
const TRACED_VISITS = 0.1;

/** Starts the SDK. Called once, by lib/sentry-client.ts. */
export function start(dsn: string): void {
  // The 1-in-10 decision is made here, once per page load, so the other nine
  // visits don't run the tracing and Web Vitals code at all — they only get
  // error reporting.
  const traced = Math.random() < TRACED_VISITS;

  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV, // production / preview

    tracesSampleRate: traced ? 1 : undefined,
    // No trace headers on any request (requests are not traced at all, so
    // nothing is ever attached to Google Analytics calls either).
    tracePropagationTargets: [],

    // Session Replay stays off: it would serialise every style change the
    // animations write on every frame.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,

    integrations: (defaults) => [
      ...defaults.filter((i) => !LEFT_OUT.has(i.name) && i.name !== "BrowserTracing"),
      ...(traced
        ? [
            Sentry.browserTracingIntegration({
              // Page-load timings and Web Vitals only. A page load here
              // downloads ~70 files; one span for each (plus one per request
              // and per long task) cost main-thread time and a ~150 KB
              // upload per traced visit.
              ignoreResourceSpans: RESOURCE_SPAN_OPS,
              traceFetch: false,
              traceXHR: false,
              enableLongTask: false,
              enableLongAnimationFrame: false,
              // Trace links live in memory, never in sessionStorage.
              linkPreviousTrace: "in-memory",
            }),
          ]
        : []),
    ],

    // No outcome reports for visits that were simply not sampled.
    sendClientReports: false,

    dataCollection: DATA_COLLECTION_OFF,
    ignoreErrors: CLIENT_IGNORE_ERRORS,
    denyUrls: DENY_URLS,
    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSendSpan: scrubSpan,
  });
}

/** Reports one error. `unhandled` marks errors nothing in the page caught. */
export function capture(error: unknown, unhandled: boolean): void {
  Sentry.captureException(
    error,
    unhandled ? { mechanism: { type: "auto.browser.global_handlers.onerror", handled: false } } : undefined,
  );
}

export const captureRouterTransitionStart = Sentry.captureRouterTransitionStart;
