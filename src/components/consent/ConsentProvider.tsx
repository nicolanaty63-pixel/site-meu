"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadConsent, saveConsent, type ConsentPrefs } from "@/lib/consent";

type ConsentContextValue = {
  prefs: ConsentPrefs | null; // null = no decision yet
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (prefs: ConsentPrefs) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}

export default function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<ConsentPrefs | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [ready, setReady] = useState(false);

  // Read any stored consent after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    setPrefs(loadConsent());
    setReady(true);
  }, []);

  // Allow other components (e.g. footer link) to reopen preferences.
  useEffect(() => {
    const handler = () => setShowPreferences(true);
    window.addEventListener("open-cookie-preferences", handler);
    return () =>
      window.removeEventListener("open-cookie-preferences", handler);
  }, []);

  const commit = useCallback((next: ConsentPrefs) => {
    saveConsent(next);
    setPrefs(next);
    setShowPreferences(false);
  }, []);

  const acceptAll = useCallback(
    () => commit({ analytics: true, marketing: true }),
    [commit]
  );
  const rejectAll = useCallback(
    () => commit({ analytics: false, marketing: false }),
    [commit]
  );
  const save = useCallback((p: ConsentPrefs) => commit(p), [commit]);
  const openPreferences = useCallback(() => setShowPreferences(true), []);
  const closePreferences = useCallback(() => setShowPreferences(false), []);

  const showBanner = ready && prefs === null;

  return (
    <ConsentContext.Provider
      value={{
        prefs,
        showBanner,
        showPreferences,
        acceptAll,
        rejectAll,
        save,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
