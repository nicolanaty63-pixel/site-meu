import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";
import type { Lead } from "@/lib/lead-schema";

/**
 * Lead delivery via the Resend SDK (server-only — never imported by a client
 * component). `buildLeadEmail` is a PURE function (no env, no network) so the
 * email payload can be unit-tested; `sendLeadEmail` performs the side effect.
 *
 * Required env (set in .env.local locally + Vercel in prod):
 *   RESEND_API_KEY   — secret API key from https://resend.com
 *   LEAD_TO_EMAIL    — inbox that receives leads   (default: site.email)
 *   LEAD_FROM_EMAIL  — verified sender             (default below)
 * Dev-only:
 *   LEAD_DRY_RUN=1   — compose but DON'T send (local testing without a key)
 */

export type LeadMeta = {
  source: string; // which form/page ("contact", "free-quote", …)
  ip: string;
  receivedAt: string; // ISO timestamp
};

/** Thrown when RESEND_API_KEY is absent — the route logs the lead + 503s. */
export class LeadConfigError extends Error {
  constructor() {
    super("Lead delivery is not configured (missing RESEND_API_KEY).");
    this.name = "LeadConfigError";
  }
}

/** Thrown when Resend rejects the send — the route logs the lead + 502s. */
export class LeadSendError extends Error {
  constructor(detail: string) {
    super(`Resend rejected the email: ${detail}`);
    this.name = "LeadSendError";
  }
}

// Minimal HTML-entity escape so user input can never break out of the markup.
function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const C = {
  ink: "#0a0d18",
  panel: "#0f1322",
  border: "#20273e",
  gold: "#c8a24c",
  goldLight: "#e7cd8c",
  text: "#e9ecf5",
  muted: "#9aa1b8",
};

export type LeadEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

/** PURE — compose the admin notification email from a validated lead. */
export function buildLeadEmail(lead: Lead, meta: LeadMeta): LeadEmail {
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `Nicolla Contractors Website <leads@nicollacontractors.co.uk>`;
  const to = process.env.LEAD_TO_EMAIL || site.email;

  const name = esc(lead.name);
  const email = esc(lead.email);
  const phone = esc(lead.phone);
  const service = esc(lead.service);
  const messageRaw = (lead.message ?? "").trim();
  const message = messageRaw ? esc(messageRaw).replace(/\n/g, "<br />") : "(none provided)";
  const postcode = lead.postcode ? esc(lead.postcode) : "";
  const phoneDigits = lead.phone.replace(/[^\d+]/g, "");

  const row = (label: string, value: string, href?: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${C.border};width:120px;color:${C.muted};font-size:13px;letter-spacing:.04em;text-transform:uppercase;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${C.border};color:${C.text};font-size:15px;font-weight:600;">${
        href ? `<a href="${href}" style="color:${C.goldLight};text-decoration:none;">${value}</a>` : value
      }</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${C.ink};">
  <div style="display:none;max-height:0;overflow:hidden;">New ${service} enquiry from ${name} — ${phone}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.panel};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
        <!-- header -->
        <tr><td style="padding:28px 32px 22px;border-bottom:1px solid ${C.border};">
          <div style="color:${C.gold};font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;">Nicolla Contractors</div>
          <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:6px;">New website enquiry</div>
          <div style="color:${C.muted};font-size:13px;margin-top:4px;">via the ${esc(meta.source)} form</div>
        </td></tr>
        <!-- details -->
        <tr><td style="padding:8px 32px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Name", name)}
            ${row("Phone", phone, phoneDigits ? `tel:${phoneDigits}` : undefined)}
            ${row("Email", email, `mailto:${email}`)}
            ${postcode ? row("Postcode", postcode) : ""}
            ${row("Service", service)}
          </table>
        </td></tr>
        <!-- message -->
        <tr><td style="padding:22px 32px 6px;">
          <div style="color:${C.muted};font-size:13px;letter-spacing:.04em;text-transform:uppercase;margin-bottom:8px;">Project details</div>
          <div style="color:${C.text};font-size:15px;line-height:1.7;background:${C.ink};border:1px solid ${C.border};border-radius:12px;padding:16px 18px;">${message}</div>
        </td></tr>
        <!-- actions -->
        <tr><td style="padding:22px 32px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;">
              <a href="mailto:${email}" style="display:inline-block;background:${C.gold};color:${C.ink};font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">Reply to ${name}</a>
            </td>
            ${
              phoneDigits
                ? `<td><a href="tel:${phoneDigits}" style="display:inline-block;border:1px solid ${C.border};color:${C.text};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:9999px;">Call ${phone}</a></td>`
                : ""
            }
          </tr></table>
        </td></tr>
        <!-- footer -->
        <tr><td style="padding:18px 32px 26px;border-top:1px solid ${C.border};margin-top:14px;">
          <div style="color:${C.muted};font-size:12px;line-height:1.7;">
            ✓ GDPR consent given at ${esc(meta.receivedAt)}<br />
            Source: ${esc(meta.source)} &nbsp;·&nbsp; IP: ${esc(meta.ip)}<br />
            Reply directly to this email to respond to ${name}.
          </div>
        </td></tr>
      </table>
      <div style="color:${C.muted};font-size:11px;margin-top:16px;">Sent automatically by your nicollacontractors.co.uk website.</div>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `NEW WEBSITE ENQUIRY (via ${meta.source} form)`,
    ``,
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
    `Email:   ${lead.email}`,
    ...(lead.postcode ? [`Postcode: ${lead.postcode}`] : []),
    `Service: ${lead.service}`,
    ``,
    `Project details:`,
    messageRaw || "(none provided)",
    ``,
    `—`,
    `GDPR consent given at ${meta.receivedAt}`,
    `Source: ${meta.source} · IP: ${meta.ip}`,
    `Reply directly to this email to respond to ${lead.name}.`,
  ].join("\n");

  return {
    from,
    to,
    replyTo: lead.email,
    subject: `New enquiry — ${lead.service} — ${lead.name}`,
    html,
    text,
  };
}

const DRY_RUN =
  process.env.NODE_ENV !== "production" && process.env.LEAD_DRY_RUN === "1";

/**
 * Side-effecting send. Throws {@link LeadConfigError} when unconfigured and
 * {@link LeadSendError} when the provider rejects — the route maps both to a
 * generic client message while logging the recoverable lead server-side.
 */
export async function sendLeadEmail(lead: Lead, meta: LeadMeta): Promise<{ id: string }> {
  const msg = buildLeadEmail(lead, meta);

  if (DRY_RUN) {
    console.log(`[lead] DRY_RUN — composed but not sent: "${msg.subject}" → ${msg.to}`);
    return { id: "dry-run" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new LeadConfigError();

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: msg.from,
    to: msg.to,
    replyTo: msg.replyTo,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
  });

  if (error) throw new LeadSendError(error.message ?? "unknown error");
  return { id: data?.id ?? "sent" };
}
