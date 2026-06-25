"use client";

/**
 * Root error boundary (Vector 5) — catches errors in the root layout itself,
 * so it must render its own <html>/<body>. Digest only; no message/stack.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          background: "#0a0d18",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong</h1>
            <p style={{ color: "#9aa1b8" }}>Please refresh the page.</p>
            {error.digest && (
              <p style={{ fontSize: 12, color: "#697089" }}>
                Reference: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                marginTop: 16,
                padding: "10px 24px",
                borderRadius: 9999,
                border: "none",
                background: "#c8a24c",
                color: "#0a0d18",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
