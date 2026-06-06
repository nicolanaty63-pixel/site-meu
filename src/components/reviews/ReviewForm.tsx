"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import {
  REVIEW_RULES,
  SERVICE_OPTIONS,
  validateReview,
} from "@/lib/reviews-shared";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-base text-white placeholder-concrete-dark outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/25";

/** Accessible interactive 1–5 star rating (radiogroup, keyboard + hover). */
function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  const shown = hover || value;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Star rating"
        className="flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            className="rounded-md p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold/50"
          >
            <Icon
              name="star"
              className={`h-8 w-8 transition-colors ${
                n <= shown ? "fill-current text-gold" : "text-white/20"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-concrete" aria-live="polite">
        {shown ? labels[shown] : "Tap to rate"}
      </span>
    </div>
  );
}

export default function ReviewForm() {
  const router = useRouter();
  const formId = useId();
  const renderedAt = useRef<number>(Date.now());

  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const textLen = text.trim().length;
  const overMax = textLen > REVIEW_RULES.textMax;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setError(null);
    setFieldError(null);

    // Mirror the server's validation for instant feedback. Use a generous
    // elapsed value so legitimate (already-rendered) forms always pass the trap.
    const elapsedMs = Date.now() - renderedAt.current;
    const check = validateReview({ name, rating, text, service, company, elapsedMs });
    if (!check.ok) {
      if (check.code === "bot") {
        setError("Something looked off with the submission. Please try again.");
      } else {
        setFieldError(check.field ?? null);
        setError(check.error);
      }
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, text, service, company, elapsedMs }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        field?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setFieldError(data.field ?? null);
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      // Reveal the new review (server component re-reads the store).
      router.refresh();
    } catch {
      setStatus("error");
      setError("Network error — please check your connection and try again.");
    }
  }

  function reset() {
    setName("");
    setRating(0);
    setText("");
    setService("");
    setCompany("");
    setError(null);
    setFieldError(null);
    setStatus("idle");
    renderedAt.current = Date.now();
  }

  // ---- success state -------------------------------------------------------
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid min-h-[26rem] place-items-center rounded-2xl border border-white/10 bg-surface/60 p-8 text-center"
        role="status"
      >
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <Icon name="check" className="h-8 w-8" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold text-white">
            Thank you for your review!
          </h3>
          <p className="mt-3 max-w-sm text-concrete">
            It&apos;s now live below — we really appreciate you taking the time to
            share your experience.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
          >
            Write another review
          </button>
        </div>
      </motion.div>
    );
  }

  // ---- form (idle / submitting / error) ------------------------------------
  const submitting = status === "submitting";
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/10 bg-surface/60 p-6 sm:p-8"
    >
      {/* Honeypot — hidden from humans, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="grid gap-5">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="mb-2 block text-sm text-concrete"
          >
            Full name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={REVIEW_RULES.nameMax}
            placeholder="John Smith"
            aria-invalid={fieldError === "name"}
            className={`${inputClass} ${fieldError === "name" ? "border-red-400/70" : ""}`}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm text-concrete">Your rating</span>
          <StarInput value={rating} onChange={setRating} />
        </div>

        <div>
          <label
            htmlFor={`${formId}-service`}
            className="mb-2 block text-sm text-concrete"
          >
            Service{" "}
            <span className="text-concrete-dark">(optional)</span>
          </label>
          <select
            id={`${formId}-service`}
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${formId}-text`}
            className="mb-2 block text-sm text-concrete"
          >
            Your review
          </label>
          <textarea
            id={`${formId}-text`}
            name="text"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell others about the work we did, the team, and the finish…"
            aria-invalid={fieldError === "text"}
            className={`${inputClass} resize-none ${fieldError === "text" ? "border-red-400/70" : ""}`}
          />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-concrete-dark">
              Minimum {REVIEW_RULES.textMin} characters
            </span>
            <span className={overMax ? "text-red-400" : "text-concrete-dark"}>
              {textLen}/{REVIEW_RULES.textMax}
            </span>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <Icon name="close" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-ink transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              Submitting…
            </>
          ) : (
            <>
              Submit review
              <Icon name="arrow" className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-concrete-dark">
          Your review appears on this page straight away.
        </p>
      </div>
    </form>
  );
}
