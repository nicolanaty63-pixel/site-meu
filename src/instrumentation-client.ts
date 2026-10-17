import { routerTransitionStart, startSentryWhenIdle } from "@/lib/sentry-client";

// Runs in the browser before the app hydrates, so it stays tiny: it only
// schedules the Sentry SDK for after the page has loaded. The SDK itself and
// its configuration are in lib/sentry-browser.ts.
startSentryWhenIdle();

export const onRouterTransitionStart = routerTransitionStart;
