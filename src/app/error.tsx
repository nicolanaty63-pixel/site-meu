"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary (Vector 5). Renders ONLY the opaque `digest` —
 * never the error message or stack — so internals never reach the browser.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client telemetry: log ONLY the opaque digest (no message/stack/PII).
    console.error("Unhandled UI error", { digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">Error</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-white">
        Something went wrong
      </h1>
      <p className="mt-3 leading-relaxed text-concrete">
        We hit an unexpected problem. Please try again — or contact us directly
        and we&apos;ll help right away.
      </p>
      {error.digest && (
        <p className="mt-4 font-mono text-xs text-concrete-dark">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-gold px-6 py-3 font-semibold text-ink transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:border-gold/50"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
