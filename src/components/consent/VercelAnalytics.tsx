"use client";

import { Analytics } from "@vercel/analytics/next";
import { useConsent } from "./ConsentProvider";

/**
 * GDPR-safe Vercel Analytics loader.
 * Although Vercel Analytics is privacy-friendly by default (no cookies,
 * anonymized data), we still respect the user's analytics consent preference
 * to maintain consistency with the site's privacy-first approach.
 */
export default function VercelAnalytics() {
  const { prefs } = useConsent();

  // Only load Vercel Analytics if user has granted analytics consent
  if (!prefs?.analytics) return null;

  return <Analytics />;
}
