import { site } from "@/lib/site";

// Central legal/company details. The optional fields are intentionally left
// `undefined` until the real value is confirmed — every consumer renders them
// conditionally, so bracket-placeholder strings can never leak into HTML or
// JSON-LD. When the real value is available, set it here and it surfaces
// automatically on every legal page that references it.

type Legal = {
  companyName: string;
  /** Companies House registered number — set when filed. */
  companyNumber?: string;
  /** Registered office address, formatted as one line. Set when confirmed. */
  registeredOffice?: string;
  /** ICO Data Protection register reference. Set when registered. */
  icoRegistration?: string;
  /** VAT number, if registered. */
  vatNumber?: string;
  privacyEmail: string;
  contactEmail: string;
  phone: string;
  phoneHref: string;
  lastUpdated: string;
  governingLaw: string;
};

export const legal: Legal = {
  companyName: site.legalName,
  companyNumber: undefined,
  registeredOffice: undefined,
  icoRegistration: undefined,
  vatNumber: undefined,

  privacyEmail: "privacy@nicollacontractors.co.uk",
  contactEmail: site.email,
  phone: site.phoneDisplay,
  phoneHref: site.phoneHref,

  lastUpdated: "24 May 2026",
  governingLaw: "England & Wales",
};

export const legalPages = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/gdpr", label: "GDPR Notice" },
] as const;
