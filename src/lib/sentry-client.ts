/**
 * Browser error monitoring — the small part that is in the page from the start.
 *
 * The Sentry SDK is about 60 KB (gzip) and its start-up costs main-thread
 * time. Loaded with the page, that time lands in the same task as hydration,
 * exactly when the hero animation starts, and the download competes with the
 * page's own images and fonts. So the SDK (lib/sentry-browser.ts) is fetched
 * a few seconds after the page's `load` event, when the browser is idle, and
 * started in a task of its own. If an error happens before that, the SDK is
 * fetched at once and the error is handed over — nothing is missed.
 *
 * Without NEXT_PUBLIC_SENTRY_DSN none of this does anything.
 */

type Sdk = typeof import("./sentry-browser");

/** How long after `load` the SDK is fetched when nothing has gone wrong. */
const SDK_DELAY_MS = 3000;
const MAX_PENDING = 10;

let sdk: Sdk | undefined;
let fetchSdk: (() => void) | undefined;
const pending: { error: unknown; unhandled: boolean }[] = [];

/** Reports an error to Sentry, now or as soon as the SDK has started. */
export function reportClientError(error: unknown, unhandled = false): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  if (sdk) {
    sdk.capture(error, unhandled);
    return;
  }
  if (pending.length < MAX_PENDING) pending.push({ error, unhandled });
  // An error is waiting: don't wait for the idle slot.
  fetchSdk?.();
}

/** Next.js router hook: lets Sentry time client-side navigations. */
export function routerTransitionStart(href: string, navigationType: string): void {
  sdk?.captureRouterTransitionStart(href, navigationType);
}

const whenIdle = (fn: () => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fn, { timeout: 2000 });
  else window.setTimeout(fn, 200);
};

/** Schedules the SDK. Called once, from instrumentation-client.ts. */
export function startSentryWhenIdle(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn || typeof window === "undefined") return;

  // Until the SDK is running, keep what the page fails to catch.
  const onError = (e: ErrorEvent) => {
    if (e.error) reportClientError(e.error, true);
  };
  const onRejection = (e: PromiseRejectionEvent) => reportClientError(e.reason, true);
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  let requested = false;
  fetchSdk = () => {
    if (requested) return;
    requested = true;
    import("./sentry-browser")
      .then((m) =>
        // The chunk has just been evaluated; start the SDK in the next idle
        // slot so that neither step makes a long task.
        whenIdle(() => {
          m.start(dsn);
          window.removeEventListener("error", onError);
          window.removeEventListener("unhandledrejection", onRejection);
          sdk = m;
          for (const p of pending.splice(0)) m.capture(p.error, p.unhandled);
        }),
      )
      // The chunk failed to load (offline, blocked): monitoring stays off and
      // the site is unaffected.
      .catch(() => {});
  };

  const schedule = () => window.setTimeout(() => whenIdle(() => fetchSdk?.()), SDK_DELAY_MS);
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
}
