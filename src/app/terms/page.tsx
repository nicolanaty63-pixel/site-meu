import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing use of the Nicolla Contractors Ltd website and our quotes and services, including liability, payment, IP and governing law (England & Wales).",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      intro="These terms govern your use of our website and set out the basis on which we provide quotes and services. Please read them carefully."
      updated={legal.lastUpdated}
    >
      <h2>1. About us</h2>
      <p>
        This website is operated by {legal.companyName} (company number{" "}
        {legal.companyNumber}), registered office {legal.registeredOffice}. To
        contact us, email{" "}
        <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a> or call{" "}
        <a href={legal.phoneHref}>{legal.phone}</a>.
      </p>

      <h2>2. Website use</h2>
      <p>
        By using this website you agree to these terms. You may use the site for
        lawful purposes only. You must not misuse the site, attempt to gain
        unauthorised access, introduce malicious code, or use it in any way that
        could damage or impair the site or others&apos; use of it. We may update
        or withdraw the site, or these terms, at any time.
      </p>

      <h2>3. Quotations and estimates</h2>
      <ul>
        <li>
          Any quote we provide is <strong>valid for 30 days</strong> from its
          date unless stated otherwise, and is subject to a site survey and
          confirmation of specification.
        </li>
        <li>
          Quotes are based on the information available to us at the time.
          Unforeseen works (for example issues discovered once works begin) may
          require a revised quote, which we will agree with you before
          proceeding.
        </li>
        <li>
          Prices include VAT only where expressly stated. Materials remain our
          property until paid for in full.
        </li>
      </ul>

      <h2>4. Our services</h2>
      <p>
        We will carry out our services with reasonable care and skill and to a
        professional standard. Specific project terms (scope, timeline, payment
        schedule and any guarantees) will be set out in your individual
        contract or written quote, which take precedence over these website
        terms in the event of conflict.
      </p>

      <h2>5. Payment terms</h2>
      <ul>
        <li>Payment terms for each project are set out in your quote or contract.</li>
        <li>Deposits or stage payments may be required for larger works, as agreed in advance.</li>
        <li>Invoices are payable within the period stated on the invoice.</li>
        <li>We reserve the right to charge interest on overdue amounts in accordance with the Late Payment of Commercial Debts (Interest) Act 1998 where applicable.</li>
      </ul>

      <h2>6. Your consumer rights</h2>
      <p>
        Nothing in these terms affects your statutory rights as a consumer,
        including under the Consumer Rights Act 2015. Where you enter into a
        contract with us off-premises or at a distance, you may have a 14-day
        right to cancel; details will be provided with your quote where this
        applies.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        Nothing in these terms limits or excludes our liability for death or
        personal injury caused by our negligence, for fraud, or for any other
        liability that cannot be excluded by law. Subject to that:
      </p>
      <ul>
        <li>
          We are not liable for any loss or damage that is not reasonably
          foreseeable, or for business losses (this website and its content are
          provided for general information).
        </li>
        <li>
          Our total liability arising from our services shall not exceed the
          price paid for the relevant works, save where the law requires
          otherwise.
        </li>
        <li>
          Website content is provided &quot;as is&quot; without warranties as to
          accuracy or availability.
        </li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>
        All content on this website — including text, design, graphics, logos
        and images — is owned by or licensed to {legal.companyName} and is
        protected by intellectual property laws. You may not copy, reproduce or
        republish any part of it without our prior written permission.
      </p>

      <h2>9. Third-party links</h2>
      <p>
        Our website may contain links to third-party sites. We are not
        responsible for their content or privacy practices.
      </p>

      <h2>10. Dispute resolution</h2>
      <p>
        If a dispute arises, please contact us first so we can try to resolve it
        amicably. If we cannot resolve it, the parties agree to consider
        alternative dispute resolution (such as mediation) before commencing
        court proceedings. This does not affect your right to bring a claim in
        court.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms, and any dispute arising out of or in connection with them,
        are governed by the laws of {legal.governingLaw}, and the courts of{" "}
        {legal.governingLaw} shall have exclusive jurisdiction.
      </p>
    </LegalShell>
  );
}
