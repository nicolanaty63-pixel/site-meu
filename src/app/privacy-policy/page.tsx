import { pageMeta } from "@/lib/seo";
import LegalShell from "@/components/legal/LegalShell";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Nicolla Contractors Ltd collects, uses and protects your personal data under UK GDPR, your rights, and how to contact us or the ICO.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      intro="This policy explains how we collect and use your personal data, the legal bases we rely on, and your rights under UK data protection law."
      updated={legal.lastUpdated}
    >
      <h2>1. Who we are (data controller)</h2>
      <p>
        {legal.companyName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
        the data controller responsible for your personal data. We are committed
        to protecting your privacy and handling your data in line with the UK
        General Data Protection Regulation (UK GDPR) and the Data Protection Act
        2018.
      </p>
      <ul>
        <li>
          <strong>Company:</strong> {legal.companyName}
        </li>
        {legal.companyNumber && (
          <li>
            <strong>Company registration number:</strong> {legal.companyNumber}
          </li>
        )}
        {legal.registeredOffice && (
          <li>
            <strong>Registered office:</strong> {legal.registeredOffice}
          </li>
        )}
        {legal.icoRegistration && (
          <li>
            <strong>ICO registration reference:</strong>{" "}
            {legal.icoRegistration}
          </li>
        )}
        <li>
          <strong>Privacy contact:</strong>{" "}
          <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>
        </li>
        <li>
          <strong>Telephone:</strong>{" "}
          <a href={legal.phoneHref}>{legal.phone}</a>
        </li>
      </ul>

      <h2>2. The personal data we collect</h2>
      <p>We may collect and process the following categories of personal data:</p>
      <ul>
        <li>
          <strong>Identity &amp; contact data</strong> — your name, email
          address, telephone number and postcode/address.
        </li>
        <li>
          <strong>Project data</strong> — details you provide about your
          renovation or building project (service required, timescale,
          property details and any information in your message).
        </li>
        <li>
          <strong>Correspondence</strong> — records of your communications with
          us by phone, email, WhatsApp or our forms.
        </li>
        <li>
          <strong>Technical &amp; usage data</strong> — where you consent to
          analytics cookies, information such as your IP address (anonymised),
          device, browser and how you use our website.
        </li>
      </ul>
      <p>
        We do not intentionally collect special category data and ask that you
        do not send it to us. Our website is not directed at children.
      </p>

      <h2>3. How we collect your data</h2>
      <ul>
        <li>Directly from you when you complete our quote or contact forms, call, email or message us.</li>
        <li>Automatically through cookies and similar technologies, only where you have given consent (see our <a href="/cookie-policy">Cookie Policy</a>).</li>
        <li>From third parties such as review platforms (e.g. MyBuilder) where you contact us through them.</li>
      </ul>

      <h2>4. Why we use your data and our lawful basis</h2>
      <p>
        Under UK GDPR we must have a lawful basis to process your personal data.
        We rely on the following:
      </p>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Data used</th>
            <th>Lawful basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responding to your enquiry and providing a quote</td>
            <td>Identity, contact &amp; project data</td>
            <td>Taking steps at your request prior to entering a contract; legitimate interests</td>
          </tr>
          <tr>
            <td>Carrying out our building/renovation services</td>
            <td>Identity, contact &amp; project data</td>
            <td>Performance of a contract</td>
          </tr>
          <tr>
            <td>Accounting, tax and legal record-keeping</td>
            <td>Identity, contact &amp; transaction data</td>
            <td>Legal obligation</td>
          </tr>
          <tr>
            <td>Website analytics to improve our service</td>
            <td>Technical &amp; usage data</td>
            <td>Consent</td>
          </tr>
          <tr>
            <td>Marketing communications (where applicable)</td>
            <td>Contact data</td>
            <td>Consent</td>
          </tr>
        </tbody>
      </table>
      <p>
        Where we rely on consent, you may withdraw it at any time without
        affecting the lawfulness of processing before withdrawal.
      </p>

      <h2>5. Cookies and analytics</h2>
      <p>
        We use strictly necessary cookies to operate our website. Analytics and
        marketing cookies are only set with your consent, which you give through
        our cookie banner and can change at any time. Where used, Google
        Analytics is configured with IP anonymisation. Full details are in our{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>6. Sharing your data</h2>
      <p>
        We do not sell your personal data. We may share it with trusted third
        parties who process data on our behalf under written agreements,
        including:
      </p>
      <ul>
        <li>IT, hosting and form/email service providers;</li>
        <li>Analytics providers (only with your consent);</li>
        <li>Accountants, insurers and professional advisers;</li>
        <li>Trusted sub-contractors where necessary to deliver your project;</li>
        <li>Regulators or authorities where required by law.</li>
      </ul>

      <h2>7. International transfers</h2>
      <p>
        We aim to keep your data within the UK/EEA. Where a provider processes
        data outside the UK (for example certain analytics providers), we ensure
        appropriate safeguards are in place, such as UK adequacy regulations or
        the International Data Transfer Agreement / Addendum.
      </p>

      <h2>8. How long we keep your data</h2>
      <ul>
        <li><strong>Enquiries that do not proceed:</strong> typically up to 12 months.</li>
        <li><strong>Customer/contract records:</strong> for the duration of the project and up to 6 years afterwards to meet legal, tax and warranty obligations.</li>
        <li><strong>Analytics data:</strong> retained for the period set by the analytics provider.</li>
      </ul>

      <h2>9. How we keep your data secure</h2>
      <p>
        We use appropriate technical and organisational measures to protect your
        data, including encryption in transit (HTTPS), access controls and
        limiting access to those who need it. No transmission over the internet
        is completely secure, but we take reasonable steps to safeguard your
        information.
      </p>

      <h2>10. Your rights under UK GDPR</h2>
      <p>You have the right to:</p>
      <ul>
        <li>be informed about how your data is used;</li>
        <li>access the personal data we hold about you;</li>
        <li>request correction of inaccurate or incomplete data;</li>
        <li>request erasure of your data (the &quot;right to be forgotten&quot;);</li>
        <li>restrict or object to processing;</li>
        <li>request data portability;</li>
        <li>withdraw consent at any time.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. We
        will respond within one month. There is normally no charge.
      </p>

      <h2>11. Complaints</h2>
      <p>
        If you have a concern, please contact us first and we will do our best
        to help. You also have the right to lodge a complaint with the UK
        supervisory authority, the Information Commissioner&apos;s Office (ICO):
      </p>
      <ul>
        <li>Information Commissioner&apos;s Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
        <li>Helpline: 0303 123 1113</li>
        <li>
          Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
        </li>
      </ul>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The latest version will
        always be available on this page with the &quot;last updated&quot; date
        above. Questions? Email{" "}
        <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a> or
        write to us at our registered office, {site.baseTown}, {site.region}.
      </p>
    </LegalShell>
  );
}
