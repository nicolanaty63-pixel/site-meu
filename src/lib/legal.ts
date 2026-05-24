import { site } from "@/lib/site";

// Central legal/company details. Replace ALL bracketed placeholders with the
// company's real registered information before publishing. Have a solicitor
// review the legal pages for your specific circumstances.

export const legal = {
  companyName: site.legalName,
  // Companies House registered number
  companyNumber: "[COMPANY NUMBER — e.g. 12345678]",
  // Registered office address (as filed at Companies House)
  registeredOffice:
    "[Registered office address], Kings Langley, Hertfordshire [POSTCODE], United Kingdom",
  // ICO Data Protection register reference (if registered)
  icoRegistration: "[ICO REGISTRATION REFERENCE — e.g. ZA123456]",
  vatNumber: "[VAT NUMBER if registered — e.g. GB123456789]",

  // Contact points
  privacyEmail: "privacy@nicollacontractors.co.uk",
  contactEmail: site.email,
  phone: site.phoneDisplay,
  phoneHref: site.phoneHref,

  // Maintenance
  lastUpdated: "24 May 2026",
  governingLaw: "England & Wales",
} as const;

export const legalPages = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/gdpr", label: "GDPR Notice" },
] as const;
