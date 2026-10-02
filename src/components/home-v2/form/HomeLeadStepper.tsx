"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useLeadForm, type LeadValues } from "@/lib/use-lead-form";
import { Honeypot } from "@/components/lead/fields";
import { jobChips, startChips, stepperCopy as T } from "../copy";
import SlideCommit, { type SlideCommitHandle, type SlideCommitResult } from "./SlideCommit";
import "../styles/stepper.css";

const N = 4;
const okPhone = (v: string) => {
  const d = v.replace(/\D/g, "");
  return (d.startsWith("44") && d.length === 12) || (d.startsWith("0") && (d.length === 10 || d.length === 11));
};
const okMail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const NAME_ERROR = "Please enter your name";
const CONSENT_ERROR = "Please tick the consent box so we can reply";
/** Which question each lead field belongs to (server/schema errors jump back). */
const FIELD_STEP: Record<keyof LeadValues, number> = {
  service: 1,
  message: 2,
  name: 3,
  phone: 3,
  email: 4,
  consent: 4,
  postcode: 4,
};
type Bad = Partial<Record<"phone" | "name" | "email" | "consent", boolean>>;

const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * The Home quote form (spec §3.11 / §4.14): four questions in a Stepper
 * (slide transitions, animated height, gold step indicators), sent with
 * SlideCommit. It runs on the site's one lead pipeline — useLeadForm +
 * leadSchema unchanged: same /api/lead, honeypot, time-trap, explicit
 * unticked consent. The start time travels in `message`.
 */
export default function HomeLeadStepper() {
  const f = useLeadForm({ source: "home", requireMessage: false });
  const uid = useId();
  const [cur, setCur] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [job, setJob] = useState("");
  const [start, setStart] = useState("");
  const [stepErr, setStepErr] = useState<Record<number, string | null>>({});
  const [bad, setBad] = useState<Bad>({});
  const [done, setDone] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const scRef = useRef<SlideCommitHandle>(null);
  const curRef = useRef(1);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  // latest values for event handlers (state would be one render stale)
  const data = useRef({ job: "", start: "", phone: "", name: "", email: "", consent: false });
  const latest = useRef(f);
  latest.current = f;

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const go = (k: number) => {
    const c = curRef.current;
    const body = bodyRef.current;
    if (busyRef.current || k === c || k < 1 || k > N || !body) return;
    const dir = k > c ? 1 : -1;
    const from = stepRefs.current[c - 1]!;
    const to = stepRefs.current[k - 1]!;
    busyRef.current = true;
    body.style.height = `${from.offsetHeight}px`;
    to.classList.add("hv-measure");
    const h = to.offsetHeight;
    to.classList.remove("hv-measure");
    from.classList.remove("hv-live");
    from.classList.add(dir > 0 ? "hv-exit-f" : "hv-exit-b");
    to.classList.add(dir > 0 ? "hv-enter-f" : "hv-enter-b");
    to.style.pointerEvents = "auto";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        body.style.height = `${h}px`;
        to.classList.remove("hv-enter-f", "hv-enter-b");
        to.style.transform = "none";
        to.style.opacity = "1";
        later(() => {
          from.classList.remove("hv-exit-f", "hv-exit-b");
          to.classList.add("hv-live");
          to.style.cssText = "";
          body.style.height = "";
          busyRef.current = false;
          const inp = to.querySelector<HTMLInputElement>("input:not([type=checkbox])");
          if (inp && window.matchMedia("(hover: hover)").matches) inp.focus({ preventScroll: true });
        }, 440);
      }),
    );
    curRef.current = k;
    setCur(k);
    setMaxReached((m) => Math.max(m, k));
  };

  const shake = (step: number) => {
    const s = stepRefs.current[step - 1];
    const t = s?.querySelector<HTMLElement>(".hv-chips") ?? s?.querySelector<HTMLElement>(".hv-stp-fields") ?? s?.querySelector<HTMLElement>("input");
    if (!t) return;
    t.classList.remove("hv-shake");
    void t.offsetWidth;
    t.classList.add("hv-shake");
  };
  const showErr = (step: number, msg: string | null) => {
    setStepErr((e) => ({ ...e, [step]: msg }));
    if (msg) shake(step);
  };

  /** Client check for one question; marks the offending fields. */
  const check = (k: number): string | null => {
    const d = data.current;
    if (k === 1) return d.job ? null : T.steps[0].error;
    if (k === 2) return d.start ? null : T.steps[1].error;
    if (k === 3) {
      const phoneOk = okPhone(d.phone);
      const nameOk = d.name.trim().length >= 2;
      setBad((b) => ({ ...b, phone: !phoneOk, name: !nameOk }));
      return !phoneOk ? T.steps[2].error : !nameOk ? NAME_ERROR : null;
    }
    const mailOk = okMail(d.email);
    setBad((b) => ({ ...b, email: !mailOk, consent: mailOk && !d.consent }));
    return !mailOk ? T.steps[3].error : !d.consent ? CONSENT_ERROR : null;
  };
  const advance = () => {
    const c = curRef.current;
    const msg = check(c);
    showErr(c, msg);
    if (msg) return;
    if (c < N) go(c + 1);
    else scRef.current?.commit();
  };

  const pickJob = (label: string, service: string) => {
    data.current.job = label;
    setJob(label);
    f.setField("service", service);
    showErr(1, null);
    if (curRef.current === 1) later(() => !busyRef.current && advance(), 380);
  };
  const pickStart = (choice: string) => {
    data.current.start = choice;
    setStart(choice);
    f.setField("message", T.messageFromStart(choice));
    showErr(2, null);
    if (curRef.current === 2) later(() => !busyRef.current && advance(), 380);
  };
  const type = (key: "phone" | "name" | "email", v: string) => {
    data.current[key] = v;
    f.setField(key, v);
    setBad((b) => ({ ...b, [key]: false }));
    showErr(curRef.current, null);
  };
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  };

  // SlideCommit bridge
  const validateLast = () => {
    const msg = check(N);
    showErr(N, msg);
    return !msg;
  };
  const submit = async (): Promise<SlideCommitResult> => {
    for (let k = 1; k < N; k++) {
      const msg = check(k);
      if (msg) {
        showErr(k, msg);
        later(() => go(k), 700);
        return "invalid";
      }
    }
    await latest.current.onSubmit({ preventDefault() {} } as React.FormEvent<HTMLFormElement>);
    // The hook reports through React state: wait (≤1s) for the render that
    // carries the outcome — success, field errors or a form-level error.
    const settled = () => {
      const h = latest.current;
      return h.status === "success" || !!h.formError || Object.values(h.errors).some(Boolean);
    };
    for (let i = 0; i < 60 && !settled(); i++) await new Promise((r) => requestAnimationFrame(() => r(null)));
    const h = latest.current;
    if (h.status === "success") return "ok";
    const field = (Object.keys(h.errors) as (keyof LeadValues)[]).find((k) => h.errors[k]);
    if (field) {
      const step = FIELD_STEP[field];
      showErr(step, h.errors[field] ?? null);
      if (step !== N) later(() => go(step), 700);
      return "invalid";
    }
    showErr(N, h.formError ?? "Something went wrong sending your enquiry.");
    return "error";
  };

  const v = f.values;
  return (
    <form
      className={`hv-stp${done ? " hv-done" : ""}`}
      data-step={cur}
      data-hv="stepper"
      noValidate
      onSubmit={(e) => e.preventDefault()}
    >
      <Honeypot inputRef={f.honeypotRef} />
      <div className="hv-stp-top">
        <span>{T.header}</span>
        <span className="hv-dsk">{T.headerAside}</span>
      </div>

      <div className="hv-stp-row">
        {Array.from({ length: N }, (_, i) => {
          const k = i + 1;
          const cls = k === cur ? " hv-active" : k < cur ? " hv-complete" : "";
          return (
            <Fragment key={k}>
              {i > 0 && (
                <span className={`hv-stp-con${cur > i ? " hv-done" : ""}`}>
                  <i />
                </span>
              )}
              <button
                type="button"
                className={`hv-stp-ind${cls}${k > maxReached ? " hv-locked" : ""}`}
                aria-label={`Step ${k}`}
                aria-current={k === cur ? "step" : undefined}
                onClick={() => k <= maxReached && go(k)}
              >
                <i className="hv-n">{k}</i>
                <i className="hv-d" />
                <Check className="hv-ck" />
              </button>
            </Fragment>
          );
        })}
      </div>

      <div ref={bodyRef} className="hv-stp-body">
        {/* 1 — service */}
        <section ref={(el) => void (stepRefs.current[0] = el)} className="hv-stp-step hv-live" aria-labelledby={`${uid}-q1`}>
          <span className="hv-stp-k">{T.questionOf(1, N)}</span>
          <h3 id={`${uid}-q1`}>{T.steps[0].title}</h3>
          <div className="hv-chips" role="group" aria-labelledby={`${uid}-q1`}>
            {jobChips.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`hv-chip${job === c.label ? " hv-on" : ""}`}
                aria-pressed={job === c.label}
                onClick={() => pickJob(c.label, c.service)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className={`hv-stp-err${stepErr[1] ? " hv-show" : ""}`} role="alert">
            {stepErr[1] ?? T.steps[0].error}
          </p>
        </section>

        {/* 2 — timing */}
        <section ref={(el) => void (stepRefs.current[1] = el)} className="hv-stp-step" aria-labelledby={`${uid}-q2`}>
          <span className="hv-stp-k">{T.questionOf(2, N)}</span>
          <h3 id={`${uid}-q2`}>{T.steps[1].title}</h3>
          <div className="hv-chips" role="group" aria-labelledby={`${uid}-q2`}>
            {startChips.map((c) => (
              <button
                key={c}
                type="button"
                className={`hv-chip${start === c ? " hv-on" : ""}`}
                aria-pressed={start === c}
                onClick={() => pickStart(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <p className={`hv-stp-err${stepErr[2] ? " hv-show" : ""}`} role="alert">
            {stepErr[2] ?? T.steps[1].error}
          </p>
        </section>

        {/* 3 — phone + name */}
        <section ref={(el) => void (stepRefs.current[2] = el)} className="hv-stp-step" aria-labelledby={`${uid}-q3`}>
          <span className="hv-stp-k">{T.questionOf(3, N)}</span>
          <h3 id={`${uid}-q3`}>{T.steps[2].title}</h3>
          <div className="hv-stp-fields">
            <label className="hv-stp-f">
              <span>{T.phoneLabel}</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={T.phonePlaceholder}
                value={v.phone}
                className={bad.phone ? "hv-bad" : undefined}
                aria-invalid={!!bad.phone}
                onChange={(e) => type("phone", e.target.value)}
                onKeyDown={onEnter}
              />
            </label>
            <label className="hv-stp-f">
              <span>{T.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                placeholder={T.namePlaceholder}
                value={v.name}
                className={bad.name ? "hv-bad" : undefined}
                aria-invalid={!!bad.name}
                onChange={(e) => type("name", e.target.value)}
                onKeyDown={onEnter}
              />
            </label>
          </div>
          <p className={`hv-stp-err${stepErr[3] ? " hv-show" : ""}`} role="alert">
            {stepErr[3] ?? T.steps[2].error}
          </p>
        </section>

        {/* 4 — email + consent */}
        <section ref={(el) => void (stepRefs.current[3] = el)} className="hv-stp-step" aria-labelledby={`${uid}-q4`}>
          <span className="hv-stp-k">{T.questionOf(4, N)}</span>
          <h3 id={`${uid}-q4`}>{T.steps[3].title}</h3>
          <label className="hv-stp-f">
            <span>{T.emailLabel}</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={T.emailPlaceholder}
              value={v.email}
              className={bad.email ? "hv-bad" : undefined}
              aria-invalid={!!bad.email}
              onChange={(e) => type("email", e.target.value)}
              onKeyDown={onEnter}
            />
          </label>
          <label className={`hv-stp-consent${bad.consent ? " hv-bad" : ""}`}>
            <input
              type="checkbox"
              checked={v.consent}
              aria-invalid={!!bad.consent}
              onChange={(e) => {
                data.current.consent = e.target.checked;
                f.setField("consent", e.target.checked);
                setBad((b) => ({ ...b, consent: false }));
                showErr(N, null);
              }}
            />
            <span className="hv-box" aria-hidden="true">
              <Check />
            </span>
            <span>
              I consent to Nicolla Contractors Ltd storing and using the details I provide to respond to my
              enquiry, in line with the <Link href="/privacy-policy">Privacy Policy</Link>. We will not share your
              details or send marketing without your consent.
            </span>
          </label>
          <p className={`hv-stp-err${stepErr[4] ? " hv-show" : ""}`} role="alert">
            {stepErr[4] ?? T.steps[3].error}
          </p>
          <p className="hv-stp-fine">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>{T.privacyLine}</span>
          </p>
        </section>
      </div>

      <div className="hv-stp-foot">
        <button type="button" className={`hv-stp-back${cur === 1 ? " hv-off" : ""}`} onClick={() => go(curRef.current - 1)}>
          {T.back}
        </button>
        <button type="button" className="hv-stp-next" onClick={advance}>
          <span>{T.next}</span>
          <svg viewBox="0 0 26 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M0 5h24M20 1l4 4-4 4" />
          </svg>
        </button>
        <SlideCommit
          ref={scRef}
          label={T.slide.label}
          doneLabel={T.slide.doneLabel}
          errorLabel={T.slide.errorLabel}
          ariaLabel="Slide to send your request"
          validate={validateLast}
          onCommit={submit}
          onDone={() => setDone(true)}
        />
      </div>

      <div className="hv-stp-done" aria-live="polite">
        {done && (
          <>
            <div className="hv-ok">
              <Check />
            </div>
            <h3>{T.success.title(v.name.trim())}</h3>
            <p className="hv-msg">{T.success.line(v.phone.trim(), v.email.trim())}</p>
            <div className="hv-sum">
              <span>{job}</span>
              <span>{start}</span>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
