import Image from "next/image";
import Link from "next/link";
import { serviceImages, servicePositions } from "@/lib/service-images";
import { featuredServices, servicesCopy } from "../copy";
import ScrollStack from "./ScrollStack";
import "../styles/services.css";

const NUMERALS = ["I", "II", "III", "IV"];
const WAYS = ["hv-cream", "hv-navy", "hv-cream", "hv-navy"];

const LinkArrow = () => (
  <svg viewBox="0 0 22 9" aria-hidden="true">
    <path d="M0 4.5h20M16 1l4 3.5-4 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

/** What we do (spec §3.4): the four featured services as a ScrollStack. */
export default function ServicesStack() {
  return (
    <section id="services" data-hv="services" className="hv-lv hv-ss">
      <div className="hv-ss-head">
        <div className="hv-lab hv-rv">{servicesCopy.eyebrow}</div>
        <h2 className="hv-hook hv-rv hv-d1">
          {servicesCopy.titleLead}
          <br />
          {servicesCopy.titleTail} <em>{servicesCopy.titleAccent}</em>
        </h2>
        <p className="hv-sub hv-rv hv-d2">{servicesCopy.subtitle}</p>
      </div>
      <ScrollStack>
        {featuredServices.map((s, i) => (
          <article
            key={s.slug}
            className={`hv-ss-card ${WAYS[i % WAYS.length]}`}
            style={{ "--i": i } as React.CSSProperties}
          >
            <div>
              <div className="hv-rn">{NUMERALS[i]}</div>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              <Link className="hv-link" href={`/services/${s.slug}`}>
                {servicesCopy.cardLink}
                <LinkArrow />
              </Link>
            </div>
            <div className="hv-ss-frame">
              <Image
                src={serviceImages[s.slug]}
                alt={s.title}
                fill
                sizes="(max-width: 860px) 90vw, 480px"
                style={{ objectFit: "cover", objectPosition: servicePositions[s.slug] ?? "center" }}
              />
            </div>
          </article>
        ))}
        <div className="hv-ss-end" />
      </ScrollStack>
      <div className="hv-ss-more hv-rv">
        <Link className="hv-link" href="/services">
          {servicesCopy.more}
          <LinkArrow />
        </Link>
      </div>
    </section>
  );
}
