import { faqs } from "@/lib/data";
import { faqCopy } from "../copy";
import FolderFaq from "./FolderFaq";
import "../styles/faq.css";

/** FAQ (spec §3.9): FolderFloat + conversation card, all six `faqs`. */
export default function FaqFolder() {
  const c = faqCopy;
  return (
    <section id="faq" data-hv="faq" className="hv-lv hv-lv-faq">
      <div className="hv-lv-wrap">
        <div className="hv-lv-head hv-center hv-rv">
          <span className="hv-lv-eyebrow">
            <i />
            {c.eyebrow}
          </span>
          <h2>{c.title}</h2>
        </div>
        <FolderFaq
          faqs={faqs}
          copy={{ folderLabel: c.folderLabel, folderSub: c.folderSub, clientLabel: c.clientLabel, usLabel: c.usLabel }}
        />
        <p className="hv-faqf-hint">
          <span className="hv-hov">{c.hintPointer}</span>
          <span className="hv-tap">{c.hintTouch}</span>
        </p>
      </div>
    </section>
  );
}
