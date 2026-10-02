import { processCopy } from "../copy";
import ThreadSteps from "./ThreadSteps";
import "../styles/process.css";

/** How it works (spec §3.7): sticky intro + five steps on a gold thread. */
export default function ProcessThread() {
  const c = processCopy;
  return (
    <section data-hv="process" className="hv-proc hv-sec">
      <div className="hv-wrap">
        <div className="hv-cols">
          <div className="hv-sticky">
            <div className="hv-lab hv-rv">{c.eyebrow}</div>
            <h2 className="hv-hook hv-sm hv-rv hv-d1">
              {c.titleLead}
              <br />
              {c.titleTail} <em>{c.titleAccent}</em>
            </h2>
            <p className="hv-p hv-rv hv-d2">{c.paragraph}</p>
            <a className="hv-btn hv-rv hv-d3" href="#contact">
              <i className="hv-tk hv-a" />
              <i className="hv-tk hv-b" />
              {c.cta}
            </a>
          </div>
          <ThreadSteps>
            {c.steps.map((s, i) => (
              <div key={s.title} className="hv-step">
                <div className="hv-rn">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </ThreadSteps>
        </div>
      </div>
    </section>
  );
}
