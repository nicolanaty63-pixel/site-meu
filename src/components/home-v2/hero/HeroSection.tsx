import HeroTitle from "./HeroTitle";
import DepthCarousel from "./DepthCarousel";
import { heroCopy, heroSlides } from "../copy";
import "../styles/hero.css";

/**
 * Hero (spec §3.2): cream field with four soft gold "clouds", the title +
 * paragraph + glinting "Get in touch" on the left and the DepthCarousel of
 * recent work on the right. Server-rendered; only the title enhancement and
 * the carousel hydrate.
 */
export default function HeroSection() {
  return (
    <section id="top" data-hv="hero" className="hv-hero">
      <div className="hv-cloud hv-a" aria-hidden="true" />
      <div className="hv-cloud hv-b" aria-hidden="true" />
      <div className="hv-cloud hv-c" aria-hidden="true" />
      <div className="hv-cloud hv-d" aria-hidden="true" />
      <div className="hv-hero-in">
        <div className="hv-hero-text">
          <HeroTitle />
          <p className="hv-p">{heroCopy.paragraph}</p>
          <div className="hv-cta">
            <a className="hv-btn-wave" href="#contact">
              <span data-t={heroCopy.cta}>{heroCopy.cta}</span>
              <svg viewBox="0 0 26 10" aria-hidden="true">
                <path d="M0 5h24M19 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </a>
          </div>
        </div>
        <div className="hv-hero-side">
          <DepthCarousel slides={heroSlides} label={heroCopy.carouselLabel} />
        </div>
      </div>
    </section>
  );
}
