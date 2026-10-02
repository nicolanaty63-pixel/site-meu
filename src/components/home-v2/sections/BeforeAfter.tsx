import { beforeAfterCopy } from "../copy";
import CompareSlider from "./CompareSlider";
import "../styles/before-after.css";

/** Before & after (spec §3.6). */
export default function BeforeAfter() {
  const c = beforeAfterCopy;
  return (
    <section data-hv="before-after" className="hv-lv hv-lv-ba">
      <div className="hv-lv-wrap">
        <div className="hv-lv-ba-grid">
          <div className="hv-lv-head hv-rv">
            <span className="hv-lv-eyebrow">
              <i />
              {c.eyebrow}
            </span>
            <h2>
              {c.titleLines[0]}
              <br />
              {c.titleLines[1]}
            </h2>
            <p>{c.subtitle}</p>
          </div>
          <div className="hv-lv-ba-wrap hv-rv hv-d1">
            <div className="hv-lv-ba-glow" />
            <CompareSlider
              before={{ src: c.before.src, alt: c.before.alt, tag: c.before.tag, caption: c.before.caption }}
              after={{ src: c.after.src, alt: c.after.alt, tag: c.after.tag, caption: c.after.caption }}
              label={c.rangeLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
