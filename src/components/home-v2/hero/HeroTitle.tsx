import { heroCopy } from "../copy";
import HeroWordmark from "./HeroWordmark";
import "../styles/wordmark.css";

/**
 * The hero title — the page's only <h1> and its LCP element. It is real,
 * server-rendered text in EB Garamond 800 italic that paints straight from
 * the HTML (spec rule 7); each line slides up out of its own clip in pure
 * CSS (spec §4.2). Once hydrated and the entrance has finished, HeroWordmark
 * overlays the same letters as SVG paths in exactly the same box and takes
 * over (spec §4.4) — the text stays in place for assistive tech.
 */
export default function HeroTitle() {
  return (
    <h1 className="hv-wm">
      <span className="hv-wm-lines">
        {heroCopy.titleLines.map((line) => (
          <span key={line} className="hv-l">
            <span className="hv-li">{line}</span>{" "}
          </span>
        ))}
      </span>
      <HeroWordmark />
    </h1>
  );
}
