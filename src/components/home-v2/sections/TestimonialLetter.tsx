import Link from "next/link";
import { homeTestimonials, testimonialsCopy } from "../copy";
import TestimonialRotator from "./TestimonialRotator";
import "../styles/testimonials.css";

/** Testimonials (spec §3.8): a cream letter with a rotating genuine review. */
export default function TestimonialLetter() {
  const c = testimonialsCopy;
  return (
    <section id="testimonials" data-hv="testimonials" className="hv-testi hv-sec">
      <div className="hv-wrap">
        <div className="hv-card2 hv-rv">
          <i className="hv-ck hv-tl" />
          <i className="hv-ck hv-tr" />
          <i className="hv-ck hv-bl" />
          <i className="hv-ck hv-br" />
          <div className="hv-top">
            <div>
              <div className="hv-lab">{c.eyebrow}</div>
              <TestimonialRotator items={homeTestimonials} intervalMs={c.intervalMs} />
            </div>
            <div className="hv-rate">
              <b className="hv-num">
                {c.rating}
                <small>{c.ratingOutOf}</small>
              </b>
              <span>{c.ratingLine}</span>
              <Link className="hv-link" href="/testimonials">
                {c.more}
                <svg viewBox="0 0 22 9" aria-hidden="true">
                  <path d="M0 4.5h20M16 1l4 3.5-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
