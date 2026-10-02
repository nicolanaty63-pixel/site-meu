import { site } from "@/lib/site";
import { contactCopy } from "../copy";
import GlowCards from "../contact/GlowCards";
import HomeLeadStepper from "../form/HomeLeadStepper";
import "../styles/contact.css";

const ico = {
  className: "hv-lv-ico",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Get in touch (spec §3.10): BorderGlow contact cards + the quote Stepper. */
export default function ContactSection() {
  const c = contactCopy;
  return (
    <section id="contact" data-hv="contact" className="hv-lv hv-lv-contact">
      <div className="hv-lv-wrap">
        <div className="hv-lv-contact-grid">
          <div>
            <div className="hv-lv-head hv-rv">
              <span className="hv-lv-eyebrow">
                <i />
                {c.eyebrow}
              </span>
              <h2>{c.title}</h2>
              <p>{c.subtitle}</p>
            </div>
            <GlowCards>
              <div className="hv-lv-rc hv-bgl">
                <span className="hv-edge-light" aria-hidden="true" />
                <span className="hv-ci">
                  <svg {...ico}>
                    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 11l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
                  </svg>
                </span>
                <span>
                  <small>{c.callLabel}</small>
                  <b>
                    <a href={site.phoneHref}>{site.phoneDisplay}</a>
                    <i className="hv-sep" aria-hidden="true">
                      ·
                    </i>
                    <a href={site.phone2Href}>{site.phone2Display}</a>
                  </b>
                </span>
              </div>
              <a className="hv-lv-rc hv-bgl" href={`mailto:${site.email}`}>
                <span className="hv-edge-light" aria-hidden="true" />
                <span className="hv-ci">
                  <svg {...ico}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M4 7l8 6 8-6" />
                  </svg>
                </span>
                <span>
                  <small>{c.emailLabel}</small>
                  <b>{site.email}</b>
                </span>
              </a>
              <div className="hv-lv-rc hv-bgl">
                <span className="hv-edge-light" aria-hidden="true" />
                <span className="hv-ci">
                  <svg {...ico}>
                    <path d="M12 21s-6.5-5.5-6.5-10a6.5 6.5 0 0 1 13 0c0 4.5-6.5 10-6.5 10Z" />
                    <circle cx="12" cy="11" r="2.3" />
                  </svg>
                </span>
                <span>
                  <small>{c.basedLabel}</small>
                  <b>
                    {site.baseTown}, {site.region}
                  </b>
                </span>
              </div>
            </GlowCards>
          </div>
          <div className="hv-stp-col hv-rv hv-d1">
            <HomeLeadStepper />
          </div>
        </div>
      </div>
    </section>
  );
}
