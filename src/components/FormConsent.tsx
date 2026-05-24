import Link from "next/link";
import Icon from "@/components/ui/Icon";

// GDPR consent + anti-spam block shared by all lead forms.
export default function FormConsent() {
  return (
    <div className="space-y-3">
      {/* Honeypot: hidden from people, often filled by bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Leave this field empty
          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-concrete">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#c8a24c]"
        />
        <span>
          I consent to Nicolla Contractors Ltd storing and using the details I
          provide to respond to my enquiry, in line with the{" "}
          <Link href="/privacy-policy" className="text-gold underline">
            Privacy Policy
          </Link>
          . We will not share your details or send marketing without your
          consent.
        </span>
      </label>

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-concrete-dark">
        <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
        Your data is processed securely and never sold. See our{" "}
        <Link href="/gdpr" className="underline">
          GDPR notice
        </Link>
        .
      </p>
    </div>
  );
}
