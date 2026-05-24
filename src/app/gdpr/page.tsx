import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "GDPR Data Processing Notice",
  description:
    "A concise UK GDPR data processing notice from Nicolla Contractors Ltd: controller details, purposes, lawful bases, recipients, retention, transfers and your rights.",
  alternates: { canonical: "/gdpr" },
};

export default function GdprPage() {
  return (
    <LegalShell
      title="GDPR Data Processing Notice"
      intro="A summary of how we process personal data under the UK GDPR. This notice complements our full Privacy Policy."
      updated={legal.lastUpdated}
    >
      <h2>Data controller</h2>
      <p>
        {legal.companyName} (company number {legal.companyNumber}), registered
        office {legal.registeredOffice}. ICO registration:{" "}
        {legal.icoRegistration}. Data protection contact:{" "}
        <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.
      </p>

      <h2>What we process and why</h2>
      <ul>
        <li>
          <strong>Enquiry &amp; quote handling</strong> — name, contact details
          and project information, to respond to you and prepare a quote. Lawful
          bases: steps prior to a contract and legitimate interests.
        </li>
        <li>
          <strong>Service delivery</strong> — to perform our building and
          renovation contracts. Lawful basis: performance of a contract.
        </li>
        <li>
          <strong>Legal &amp; financial records</strong> — to meet accounting,
          tax and regulatory duties. Lawful basis: legal obligation.
        </li>
        <li>
          <strong>Website analytics &amp; marketing</strong> — only where you
          consent. Lawful basis: consent (withdrawable at any time).
        </li>
      </ul>

      <h2>Recipients</h2>
      <p>
        We share data only as needed with processors (IT, hosting, email/form
        and analytics providers), professional advisers (accountants, insurers),
        vetted sub-contractors, and authorities where legally required. All
        processors act under written agreements. We do not sell personal data.
      </p>

      <h2>International transfers</h2>
      <p>
        Where data is processed outside the UK, we rely on UK adequacy
        regulations or the International Data Transfer Agreement/Addendum to
        ensure an equivalent level of protection.
      </p>

      <h2>Retention</h2>
      <p>
        We keep enquiry data for up to 12 months, customer/contract records for
        up to 6 years after completion, and analytics data for the provider&apos;s
        defined period.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, rectify, erase, restrict, port and object
        to the processing of your personal data, and to withdraw consent. To
        exercise these rights, email{" "}
        <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. We
        respond within one month.
      </p>

      <h2>Complaints</h2>
      <p>
        You can complain to the Information Commissioner&apos;s Office (ICO),
        Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF, helpline 0303
        123 1113,{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>Full details</h2>
      <p>
        For complete information, please read our{" "}
        <a href="/privacy-policy">Privacy Policy</a> and{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>
    </LegalShell>
  );
}
