import { stats } from "@/lib/data";
import CountUp from "./CountUp";
import "../styles/stats.css";

const delay = ["", " hv-d1", " hv-d2", " hv-d3"];

/** Stats (spec §3.3): four gold numbers counting up — no boxes, no badges. */
export default function StatsSection() {
  return (
    <section data-hv="stats" className="hv-lv hv-lv-stats">
      <div className="hv-lv-wrap">
        <div className="hv-lv-stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className={`hv-lv-tile hv-rv${delay[i] ?? ""}`}>
              <div className="hv-lv-num">
                <CountUp to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
              </div>
              <div className="hv-lv-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
