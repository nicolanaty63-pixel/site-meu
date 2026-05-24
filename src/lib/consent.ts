// Cookie consent storage + helpers (PECR / ICO compliant).
// - Non-essential cookies/scripts must NOT run before explicit consent.
// - Consent is versioned and expires, prompting periodic re-consent.

export type ConsentPrefs = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  v: number;
  ts: number;
  prefs: ConsentPrefs;
};

export const CONSENT_KEY = "nicolla-cookie-consent";
export const CONSENT_VERSION = 1;
// Re-ask for consent after ~6 months (ICO guidance: refresh periodically).
export const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 180;

export const DEFAULT_PREFS: ConsentPrefs = {
  analytics: false,
  marketing: false,
};

export function loadConsent(): ConsentPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw) as ConsentRecord;
    if (rec.v !== CONSENT_VERSION) return null;
    if (Date.now() - rec.ts > CONSENT_TTL_MS) return null;
    return {
      analytics: Boolean(rec.prefs?.analytics),
      marketing: Boolean(rec.prefs?.marketing),
    };
  } catch {
    return null;
  }
}

export function saveConsent(prefs: ConsentPrefs): void {
  if (typeof window === "undefined") return;
  const rec: ConsentRecord = { v: CONSENT_VERSION, ts: Date.now(), prefs };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  } catch {
    /* storage unavailable — fail closed (no consent recorded) */
  }
}

export const cookieCategories = [
  {
    key: "necessary" as const,
    title: "Strictly necessary",
    locked: true,
    description:
      "Required for the website to function — including remembering your cookie choices and keeping the site secure. These cannot be switched off.",
  },
  {
    key: "analytics" as const,
    title: "Analytics",
    locked: false,
    description:
      "Help us understand how visitors use the site (e.g. Google Analytics, with IP anonymisation) so we can improve it. Set only with your consent.",
  },
  {
    key: "marketing" as const,
    title: "Marketing",
    locked: false,
    description:
      "Used to measure advertising and show relevant content. Set only with your consent.",
  },
];
