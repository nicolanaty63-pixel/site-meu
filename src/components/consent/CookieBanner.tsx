"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useConsent } from "./ConsentProvider";
import { cookieCategories } from "@/lib/consent";

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-gold" : "bg-white/20"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const {
    showBanner,
    showPreferences,
    acceptAll,
    rejectAll,
    save,
    openPreferences,
    closePreferences,
    prefs,
  } = useConsent();

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Reflect current choices (or unticked defaults) when opening preferences.
  useEffect(() => {
    if (showPreferences) {
      setAnalytics(prefs?.analytics ?? false);
      setMarketing(prefs?.marketing ?? false);
    }
  }, [showPreferences, prefs]);

  return (
    <>
      {/* Banner */}
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            role="region"
            aria-label="Cookie consent"
            initial={{ y: 140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 140, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="glass-strong fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl p-5 shadow-2xl sm:p-6"
          >
            <h2 className="text-base font-semibold text-white">
              We value your privacy
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-concrete">
              We use strictly necessary cookies to make our site work. With your
              consent, we&apos;d also like to use analytics cookies to improve
              it. You can accept all, reject non-essential cookies, or choose
              which to allow. Read our{" "}
              <Link href="/cookie-policy" className="text-gold underline">
                Cookie Policy
              </Link>
              .
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={acceptAll}
                className="flex-1 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
              >
                Accept all
              </button>
              <button
                onClick={rejectAll}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Reject all
              </button>
              <button
                onClick={openPreferences}
                className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-concrete transition-colors hover:text-white"
              >
                Customise
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences modal */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreferences}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
          >
            <motion.div
              className="glass-strong w-full max-w-lg rounded-2xl p-6 sm:p-8"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-white">
                Cookie preferences
              </h2>
              <p className="mt-2 text-sm text-concrete">
                Choose which cookies to allow. Necessary cookies are always on.
                See our{" "}
                <Link href="/cookie-policy" className="text-gold underline">
                  Cookie Policy
                </Link>{" "}
                for details.
              </p>

              <div className="mt-5 space-y-3">
                {cookieCategories.map((c) => {
                  const checked =
                    c.key === "necessary"
                      ? true
                      : c.key === "analytics"
                        ? analytics
                        : marketing;
                  return (
                    <div
                      key={c.key}
                      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-surface/40 p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          {c.title}
                          {c.locked && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-concrete">
                              Always active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-concrete">
                          {c.description}
                        </p>
                      </div>
                      <Toggle
                        label={c.title}
                        checked={checked}
                        disabled={c.locked}
                        onChange={
                          c.key === "analytics"
                            ? setAnalytics
                            : c.key === "marketing"
                              ? setMarketing
                              : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => save({ analytics, marketing })}
                  className="flex-1 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
                >
                  Save preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Accept all
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Reject all
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
