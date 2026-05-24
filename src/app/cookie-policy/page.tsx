import type { Metadata } from "next";
import LegalShell from "@/components/legal/LegalShell";
import ManageCookiesButton from "@/components/consent/ManageCookiesButton";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Nicolla Contractors Ltd uses cookies, the categories we use, and how to manage your consent under PECR and UK GDPR.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      intro="This policy explains how we use cookies and similar technologies, and how you can control them. We only set non-essential cookies with your consent."
      updated={legal.lastUpdated}
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a
        website. They help sites work, remember your preferences and understand
        how the site is used. We also use similar technologies such as local
        storage. We refer to all of these as &quot;cookies&quot; in this policy.
      </p>

      <h2>2. Our approach to consent</h2>
      <p>
        In line with the Privacy and Electronic Communications Regulations
        (PECR) and UK GDPR, we do not set analytics or marketing cookies until
        you have given your consent. Strictly necessary cookies do not require
        consent because they are essential for the website to function. You can
        accept all, reject all, or choose specific categories, and you can
        change your choice at any time.
      </p>

      <h2>3. Cookies we use</h2>
      <table>
        <thead>
          <tr>
            <th>Cookie / item</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Category</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>nicolla-cookie-consent</td>
            <td>This website</td>
            <td>Remembers your cookie preferences</td>
            <td>Strictly necessary</td>
            <td>180 days</td>
          </tr>
          <tr>
            <td>_ga, _ga_*</td>
            <td>Google Analytics</td>
            <td>Measures website usage (IP anonymised)</td>
            <td>Analytics (consent)</td>
            <td>Up to 2 years</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>Google Analytics</td>
            <td>Distinguishes users</td>
            <td>Analytics (consent)</td>
            <td>24 hours</td>
          </tr>
        </tbody>
      </table>
      <p>
        Analytics cookies are only created after you opt in. If you reject them,
        they are not set.
      </p>

      <h2>4. Managing your preferences</h2>
      <p>
        You can change or withdraw your consent at any time using the button
        below or the &quot;Cookie preferences&quot; link in our website footer.
      </p>
      <p>
        <ManageCookiesButton className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink no-underline transition-transform hover:scale-[1.03]">
          Manage cookie preferences
        </ManageCookiesButton>
      </p>
      <p>
        You can also control cookies through your browser settings, including
        blocking or deleting them. Note that disabling strictly necessary
        cookies may stop parts of the site from working.
      </p>

      <h2>5. More information</h2>
      <p>
        For how we handle personal data more generally, see our{" "}
        <a href="/privacy-policy">Privacy Policy</a>. If you have any questions
        about our use of cookies, email{" "}
        <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>.
      </p>
    </LegalShell>
  );
}
