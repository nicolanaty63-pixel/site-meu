import { NextResponse } from "next/server";

/**
 * Client-safe failure (Vector 5). Returns a GENERIC message + a short
 * correlation `ref`; full error detail is logged SERVER-SIDE ONLY and the
 * user's request body (PII) is never logged. Use in every route catch block so
 * no handler can leak a stack trace or DB error to the browser. Responses are
 * `no-store` so error bodies are never cached.
 */
export function fail(status: number, clientMessage: string, err?: unknown) {
  const ref = crypto.randomUUID().slice(0, 8);
  if (err) {
    const safe =
      err instanceof Error
        ? { name: err.name, message: err.message }
        : { message: "non-error thrown" };
    console.error(`[api ${status}] ref=${ref}`, safe); // no payload, no PII
  }
  return NextResponse.json(
    { ok: false, error: clientMessage, ref },
    { status, headers: { "cache-control": "no-store" } },
  );
}
