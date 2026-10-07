import type { Breadcrumb, BrowserOptions, ErrorEvent } from "@sentry/nextjs";

/** The span shape `beforeSendSpan` receives (the SDK does not export it by name). */
type StreamedSpan = Parameters<NonNullable<BrowserOptions["beforeSendSpan"]>>[0];

/**
 * Privacy rules for Sentry, shared by the browser, server and edge SDKs.
 *
 * Goal (UK GDPR): a visitor's name, phone, email, message or IP address never
 * reaches Sentry. Three layers:
 *   1. DATA_COLLECTION_OFF — the SDK does not collect identity, cookies,
 *      headers, bodies, query strings or local variables in the first place.
 *   2. scrubBreadcrumb — console output and typed input never become
 *      breadcrumbs; request breadcrumbs keep only method, path and status.
 *   3. scrubEvent / scrubSpan — the last gate before anything is sent: the
 *      request is reduced to method + path, the user is removed, and any
 *      email- or phone-shaped text is masked wherever it appears.
 */

/** Everything the SDK would otherwise collect automatically — switched off. */
export const DATA_COLLECTION_OFF = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  graphQL: { document: false, variables: false },
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
} satisfies BrowserOptions["dataCollection"];

/** Browser noise that is never our bug. */
export const CLIENT_IGNORE_ERRORS: (string | RegExp)[] = [
  // Layout notices some browsers raise as errors.
  /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/,
  // A fetch the page itself cancelled (navigation away, a newer request).
  /AbortError/,
  /The (user|operation was) aborted/i,
  /signal is aborted without reason/i,
  // Promise rejections with a non-Error value, almost always from extensions.
  /Non-Error promise rejection captured/,
  /Object captured as promise rejection/,
];

/** Errors raised inside browser extensions, not in the site's own code. */
export const DENY_URLS: RegExp[] = [
  /^chrome-extension:\/\//,
  /^moz-extension:\/\//,
  /^safari(-web)?-extension:\/\//,
];

/** Server noise: expected control flow and connections the visitor dropped. */
export const SERVER_IGNORE_ERRORS: (string | RegExp)[] = [
  "NEXT_NOT_FOUND",
  "NEXT_REDIRECT",
  "NEXT_HTTP_ERROR_FALLBACK",
  /ResponseAborted/,
  /aborted/i,
  "ECONNRESET",
  "EPIPE",
];

/** Requests that are not worth a trace: unknown URLs (bots) and the tunnel. */
export const IGNORE_SPANS: RegExp[] = [
  /\/_not-found/,
  /\/monitoring/,
  /\.(php|aspx?|env|git)\b/i,
  // Middleware runs on every page request and image/asset handlers are not
  // our code: neither is worth a trace.
  /^middleware\b/,
  /\/_next\//,
];

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/gi;
// Phone numbers: international ("+44 7848 484088") or UK national ("07848
// 484088", "(01923) 123456"), with spaces, dots, dashes or brackets between the
// digits. Anchored so version strings, timestamps and ids are left alone.
const PHONE =
  /(?:\+\d{1,3}[\s().-]*\d(?:[\s().-]*\d){7,12})|(?<![\w.-])\(?0\d(?:[\s().-]*\d){8,11}(?![\w-])/g;

// IP addresses: IPv4, and IPv6 in full or "::" compressed form (times such as
// 10:04:29 have neither eight groups nor a "::").
const IPV4 = /\b\d{1,3}(?:\.\d{1,3}){3}\b/g;
const IPV6 =
  /(?<![\w.])(?:(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|(?:[0-9a-f]{1,4}:)*[0-9a-f]{0,4}::(?:[0-9a-f]{1,4}:)*[0-9a-f]{0,4})(?!\w)/gi;
// A query string wherever it appears inside a longer text ("GET /page?a=b").
const QUERY = /\?[^\s"'<>#]*=[^\s"'<>#]*/g;

/**
 * Removes query strings and masks anything shaped like an email address, a
 * phone number or an IP address (the rate limiter's error messages, for
 * instance, quote a key that contains the visitor's IP).
 */
export function scrubText(value: string): string {
  return value
    .replace(QUERY, "")
    .replace(EMAIL, "[email]")
    .replace(IPV4, "[ip]")
    .replace(IPV6, "[ip]")
    .replace(PHONE, "[phone]");
}

/** Drops the query string and the fragment of a URL or path. */
export function stripQuery(url: string): string {
  const cut = url.search(/[?#]/);
  return cut === -1 ? url : url.slice(0, cut);
}

/** Recursively masks strings; bounded so a hostile payload cannot stall it. */
function scrubDeep(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return scrubText(value);
  if (!value || typeof value !== "object" || depth > 6) return value;
  if (Array.isArray(value)) return value.map((v) => scrubDeep(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = scrubDeep(v, depth + 1);
  }
  return out;
}

/**
 * Breadcrumbs: keep navigation, clicks and request status. Drop console
 * output (server logs carry lead details for recovery) and typed input.
 */
export function scrubBreadcrumb(crumb: Breadcrumb): Breadcrumb | null {
  if (crumb.category === "console" || crumb.category === "ui.input") return null;

  if (crumb.category === "fetch" || crumb.category === "xhr" || crumb.category === "http") {
    const d = crumb.data ?? {};
    crumb.data = {
      ...(typeof d.method === "string" ? { method: d.method } : {}),
      ...(typeof d.url === "string" ? { url: stripQuery(d.url) } : {}),
      ...(d.status_code !== undefined ? { status_code: d.status_code } : {}),
    };
    return crumb;
  }

  if (crumb.category === "navigation" && crumb.data) {
    const { from, to } = crumb.data as { from?: unknown; to?: unknown };
    crumb.data = {
      ...(typeof from === "string" ? { from: stripQuery(from) } : {}),
      ...(typeof to === "string" ? { to: stripQuery(to) } : {}),
    };
    return crumb;
  }

  if (typeof crumb.message === "string") crumb.message = scrubText(crumb.message);
  if (crumb.data) crumb.data = scrubDeep(crumb.data) as Breadcrumb["data"];
  return crumb;
}

/** Errors: the last gate before an event leaves the browser or the server. */
export function scrubEvent(event: ErrorEvent): ErrorEvent | null {
  // Who and from where: never.
  delete event.user;
  delete event.server_name;

  // The request: method, path and browser name only — no body, cookies,
  // query string or any other header.
  if (event.request) {
    const userAgent = event.request.headers?.["User-Agent"] ?? event.request.headers?.["user-agent"];
    event.request = {
      ...(event.request.method ? { method: event.request.method } : {}),
      ...(event.request.url ? { url: stripQuery(event.request.url) } : {}),
      ...(userAgent ? { headers: { "User-Agent": userAgent } } : {}),
    };
  }

  if (typeof event.message === "string") event.message = scrubText(event.message);
  if (event.logentry?.message) event.logentry.message = scrubText(event.logentry.message);
  if (event.logentry?.params) delete event.logentry.params;
  for (const ex of event.exception?.values ?? []) {
    if (typeof ex.value === "string") ex.value = scrubText(ex.value);
    // Local variables are off (stackFrameVariables), belt and braces:
    for (const frame of ex.stacktrace?.frames ?? []) delete frame.vars;
  }
  if (typeof event.transaction === "string") event.transaction = stripQuery(event.transaction);

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs
      .map((c) => scrubBreadcrumb(c))
      .filter((c): c is Breadcrumb => c !== null);
  }
  if (event.extra) event.extra = scrubDeep(event.extra) as ErrorEvent["extra"];
  if (event.tags) event.tags = scrubDeep(event.tags) as ErrorEvent["tags"];
  // Trace data attached to the event can repeat the request's URL.
  if (event.contexts) event.contexts = scrubDeep(event.contexts) as ErrorEvent["contexts"];
  return event;
}

const URL_ATTRIBUTE = /(^|\.)(url|href|target|route|path|referrer|referer)(\.|$)|^http\.(url|target)$/i;
const DROP_ATTRIBUTE = /^(url\.query|url\.fragment|http\.query|http\.fragment|client\.address|user\.|network\.peer\.address|http\.client_ip|user_agent\.original)/i;

/** Spans (page loads, requests): path only, no query strings, no addresses. */
export function scrubSpan(span: StreamedSpan): StreamedSpan {
  if (typeof span.name === "string") span.name = scrubText(stripQuery(span.name));
  const attrs = span.attributes as Record<string, unknown> | undefined;
  if (attrs) {
    for (const key of Object.keys(attrs)) {
      if (DROP_ATTRIBUTE.test(key)) {
        delete attrs[key];
        continue;
      }
      const raw = attrs[key];
      // Streamed attributes are either plain values or { value, type } pairs.
      const holder =
        raw && typeof raw === "object" && "value" in (raw as object)
          ? (raw as { value: unknown })
          : null;
      const v = holder ? holder.value : raw;
      if (typeof v !== "string") continue;
      const clean = scrubText(URL_ATTRIBUTE.test(key) ? stripQuery(v) : v);
      if (holder) holder.value = clean;
      else attrs[key] = clean;
    }
  }
  return span;
}
