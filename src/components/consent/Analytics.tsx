"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

/**
 * GDPR-safe analytics loader.
 * Google Analytics is ONLY injected after the visitor grants analytics
 * consent, and runs with IP anonymisation. If NEXT_PUBLIC_GA_ID is not set,
 * nothing loads (safe default for development).
 */
export default function Analytics() {
  const { prefs } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!prefs?.analytics || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
