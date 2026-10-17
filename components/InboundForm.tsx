'use client';
import FormStamp from '@/components/FormStamp';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import MailLink from '@/components/MailLink';
import {
  detailProgress, hasEnoughDetail, MIN_SENTENCES, MIN_WORDS, ENQUIRY_FLOORS, TIME_REQUEST_FLOOR, TIME_REQUEST_FORM,
} from '@/lib/sentences';
import { LOOKING, WHERE, TIMING, EMPLOYER, lookingFromAbout } from '@/lib/enquiry-fields';
import { DRAFT_FIELDS, DRAFT_KEY, EMAIL_PATTERN, EMAIL_TITLE, parseDraft, sendState, whySentence, type Draft, type Why } from '@/lib/inbound-return';
import { track } from '@/lib/analytics';
import { gaLead } from '@/lib/ga-lead';
/* Which rule a blocked send failed first, as one word from
   ENQUIRY_BLOCKS in lib/conversion-detail.ts (kept as literals here: that
   module carries the roster). Nothing typed is read beyond the count. */
function blockedRule(el: EventTarget | null, floor = ENQUIRY_FLOORS.enquiry): string | null {
  if (el instanceof HTMLTextAreaElement) {
    const p = detailProgress(el.value, floor);
    return p.stage === 'one-sentence' ? 'one-sentence' : 'short';
  }
  if (el instanceof HTMLSelectElement) return 'choices';
  if (el instanceof HTMLInputElement && el.name === 'email') return 'email';
  return null;
}

/* The form that gives someone a way in other than picking a calendar slot.
 *
 * `enquiry`  — "I have a question", on /contact and at the foot of guides —
 *              and, with the copy overridden, the consultation request on
 *              /book for a counsellor who is not on the online calendar.
 *
 * There used to be a second kind, `waitlist` — "none of these times work",
 * under both scheduler embeds. Removed 6 Sep 2026: people were joining the
 * list instead of booking, and a form beside a calendar read as an
 * alternative to it rather than a fallback. There are now exactly two ways
 * in: a message that says what the person is looking for, or a consultation.
 * The `kind` prop stays so the call sites did not all have to change, and so
 * a second kind can be added deliberately rather than by forking this file.
 *
 * AT LEAST TWO SENTENCES. Decided the same day. The message field refuses a
 * one-worder in the browser (setCustomValidity, so the native prompt says why)
 * and the route refuses it again on the server. See lib/sentences.ts.
 *
 * PLAIN HTML POST, NOT FETCH. It works before hydration, works with JavaScript
 * off, and survives a flaky connection — which is the state a fair number of
 * people are in when they finally decide to write to a counsellor. The server
 * redirects back with ?sent=ok, so the confirmation survives a refresh instead
 * of vanishing into client state.
 *
 * NO REQUIRED PHONE FIELD, no "how did you hear about us". Every extra field
 * on a first approach to a counselling practice is a reason to close the tab,
 * and the practice can ask anything it needs to in the reply.
 *
 * THREE REQUIRED CHOICES SINCE 25 SEP 2026 — what for, where, how soon — on
 * the owner's instruction, after templated enquiries that met the two-sentence
 * rule and said nothing. Selects, so they cost a tap each and cannot be
 * pasted. The message also has to reach about twenty words. See
 * lib/enquiry-fields.ts and lib/sentences.ts.
 *
 * THE RULES ARE VISIBLE — 1 Oct 2026. The three questions carry visible
 * labels rather than living only in a disabled first option, and the message
 * has a visible hint and a word count tied to it with aria-describedby
 * (lib/sentences.ts, detailProgress). Nothing about the rule changed; before
 * this, the first a person heard of it was the browser refusing to send.
 *
 * A REFUSAL SAYS WHICH RULE, AND GIVES BACK WHAT WAS TYPED — 2 Oct 2026.
 * The route sends the reason as ?why= (lib/inbound-return.ts) and this prints
 * the one sentence that matches; a failed store write says the fault was the
 * practice's and shows the address. The fields are kept in sessionStorage as
 * the form is sent, for this tab only, restored when the address bar says
 * sent=err and cleared when it says sent=ok. Read from location after mount,
 * like ?about=, so a static page can restore too. Nothing new leaves the
 * browser.
 */

type Kind = 'enquiry';

const COPY = {
  enquiry: {
    action: '/api/enquiry',
    title: 'Send a message',
    note: `Tell us in at least ${MIN_SENTENCES === 2 ? 'two' : String(MIN_SENTENCES)} sentences what you are looking for. It reaches the practice directly and you will have a reply within one business day.`,
    placeholder: 'What is going on for you, and what you are hoping for from counselling. A couple of sentences is enough.',
    button: 'Send message',
    doneTitle: 'Your message has arrived.',
    doneBody:
      'You will have a reply within one business day, and a copy is in your inbox. Nothing further is needed from you.',
  },
} as const;

const TOO_SHORT =
  `Please write at least ${MIN_SENTENCES === 2 ? 'two' : String(MIN_SENTENCES)} sentences, about ${MIN_WORDS} words, on what you are looking for.`;

export default function InboundForm({
  kind,
  done,
  practitioner,
  title,
  note,
  placeholder,
  button,
  returnTo,
  doneExtra,
  floor,
}: {
  kind: Kind;
  /* THE ASK-FOR-A-TIME FORM ON /book — 16 Oct 2026 (item 577). Sends
     form=time-request and holds the message to ENQUIRY_FLOORS[
     TIME_REQUEST_FLOOR] (lib/sentences.ts), which is today's enquiry floor
     until the owner flips the constant. The server applies the same floor
     only for a post from /book. Every other form is unchanged. */
  floor?: 'time-request';
  done?: 'ok' | 'err';
  /* Shown under the confirmation once a message is sent: /contact and /book
     pass each counsellor's next free consultation day as a booking link
     (15 Oct 2026), so a person who has just written can book the free call
     without waiting for the reply. Server-built; nothing when absent. */
  doneExtra?: React.ReactNode;
  /* Where the person lands afterwards, for a page that cannot read ?sent=
     itself. The city hubs pass '/message-sent'; a refusal then goes to
     /message-not-sent (FAILED_PAGE in lib/inbound-return.ts). 2 Oct 2026. */
  returnTo?: string;
  /* Slug of the counsellor this request is for, when the reader arrived from
     one of their pages. Server-validated against the roster; see
     lib/inbound-submit.ts. */
  practitioner?: string;
  /* Copy overrides, for the one place the same form is a consultation request
     rather than a question: /book, when the counsellor is not on the online
     calendar. The mechanics — route, validation, acknowledgement — do not
     change; only what the reader is told they are doing. */
  title?: string;
  note?: string;
  placeholder?: string;
  button?: string;
}) {
  const pathname = usePathname();
  const c = COPY[kind];
  const rule = floor ? ENQUIRY_FLOORS[TIME_REQUEST_FLOOR] : ENQUIRY_FLOORS.enquiry;
  const [message, setMessage] = useState('');
  const progress = detailProgress(message, rule);

  /* ?about=employer preselects the employer choice (1 Oct 2026), read after
     mount from location rather than useSearchParams, which would take every
     static page this form sits on out of static generation. Without
     JavaScript nothing is preselected and all three choices are asked, which
     the server accepts too. */
  const [looking, setLooking] = useState('');
  useEffect(() => {
    const about = lookingFromAbout(new URLSearchParams(window.location.search).get('about'));
    if (about) setLooking(about);
  }, []);
  const employer = looking === EMPLOYER;

  /* The last send, as the address bar reports it (after mount), and the
     draft to put back. `restore` is applied after the render that shows the
     where/timing selects, which only exist once `looking` is not employer. */
  const [why, setWhy] = useState<Why | null>(null);
  const [failedHere, setFailedHere] = useState(false);
  const [restore, setRestore] = useState<Draft | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    try {
      const st = sendState(window.location.search);
      if (done === 'ok' || st.sent === 'ok') {
        sessionStorage.removeItem(DRAFT_KEY);
        return;
      }
      if (done === 'err' || st.sent === 'err') {
        setFailedHere(st.sent === 'err');
        setWhy(st.why);
        const d = parseDraft(sessionStorage.getItem(DRAFT_KEY));
        if (d) {
          if (d.looking) setLooking(d.looking);
          setRestore(d);
        }
      }
    } catch { /* storage blocked: the form simply starts empty, as before */ }
  }, [done]);
  useEffect(() => {
    const f = formRef.current;
    if (!restore || !f) return;
    for (const k of DRAFT_FIELDS) {
      if (k === 'looking') continue;
      const el = f.elements.namedItem(k);
      const v = restore[k];
      if (v && (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) {
        el.value = v;
      }
    }
    if (restore.message) setMessage(restore.message);
    if (restore.phone || restore.callWindow) f.querySelector('details')?.setAttribute('open', '');
    setRestore(null);
  }, [restore]);

  /* Kept as the form leaves, not on every keystroke: one write, and only
     when the person actually pressed send. */
  const keepDraft = (f: HTMLFormElement) => {
    try {
      const d: Draft = {};
      for (const k of DRAFT_FIELDS) {
        const el = f.elements.namedItem(k);
        if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
          if (el.value) d[k] = el.value.slice(0, 5000);
        }
      }
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch { /* never load-bearing */ }
  };
  const failed = done === 'err' || failedHere;

  /* A SEND THE BROWSER STOPPED — 15 Oct 2026. The native checks below
     block the post, so the server never hears of it and nothing counted
     it. `invalid` fires on each failing control, in order, when the person
     presses send; the first one names the rule, once per form view. Only
     the rule word and the page leave the browser (lib/conversion-detail.ts
     ENQUIRY_BLOCKS). A listener on the form in the capture phase, because
     `invalid` does not bubble. */
  const blockedOnce = useRef(false);
  useEffect(() => {
    const f = formRef.current;
    if (!f) return;
    const onInvalid = (e: Event) => {
      if (blockedOnce.current) return;
      const failed = blockedRule(e.target, rule);
      if (!failed) return;
      blockedOnce.current = true;
      track('enquiry_blocked', { detail: failed });
    };
    f.addEventListener('invalid', onInvalid, true);
    return () => f.removeEventListener('invalid', onInvalid, true);
  }, [rule]);

  /* GA4's lead event when the confirmation shows (lib/ga-lead.ts, item 588).
     GA only: the counter has enquiry_submit from the server already. */
  useEffect(() => {
    if (done === 'ok') gaLead('enquiry');
  }, [done]);

  if (done === 'ok') {
    return (
      <div className="crisis" id="form" style={{ marginTop: 8 }}>
        <p style={{ margin: 0 }}>
          <strong>{c.doneTitle}</strong> {c.doneBody}
        </p>
        {doneExtra}
      </div>
    );
  }

  /* The native validity prompt rather than a custom banner: it appears at the
     field, in the browser's own words plus this one line, and it blocks the
     post. Cleared on every keystroke so the message updates as they type.
     With JavaScript off none of this runs and the server applies the rule. */
  const tooShort = rule === ENQUIRY_FLOORS.enquiry
    ? TOO_SHORT
    : `Please write about ${rule.words} words on when you are usually free and what you are looking for.`;
  const checkLength = (el: HTMLTextAreaElement) =>
    el.setCustomValidity(hasEnoughDetail(el.value, rule) ? '' : tooShort);

  return (
    /* No onSubmit beacon. This is a native POST, and a beacon fired as it
       leaves lost the race often enough that six weeks recorded 3 of 40
       enquiries. The server counts `enquiry_submit` when it stores the
       record (lib/inbound-submit.ts), against the `source` page below, so
       the count is the inbound store's and nothing counts twice. 1 Oct 2026. */
    <form method="POST" action={c.action} className="lead-form" id="form" ref={formRef}
      onSubmit={(e) => keepDraft(e.currentTarget)}>
      <p className="lead-form-title">{title ?? c.title}</p>
      <p className="lead-form-note">{note ?? c.note}</p>

      {/* Which page this came from — used for the return redirect and to work
          out which pages actually earn enquiries. Server-validated as a
          same-site path; see safePath() in lib/inbound-submit.ts. */}
      <input type="hidden" name="source" value={pathname ?? '/'} />
      {practitioner && <input type="hidden" name="practitioner" value={practitioner} />}
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      {floor && <input type="hidden" name="form" value={TIME_REQUEST_FORM} />}
      <FormStamp />


      {/* Honeypot. Hidden from sight and from screen readers, and skipped by
          the tab order, so no human ever meets it. Bots fill it and are
          silently accepted rather than told they were caught. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`hp-${kind}`}>Company</label>
        <input id={`hp-${kind}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* VISIBLE LABELS, 1 Oct 2026 (finishing R2 #96, which did the
          selects). These were sr-only, so the placeholder was the only
          visible label and it vanished on the first keystroke: a hard form
          for a second-language or stressed reader, who is who /accessibility
          says the site is written for. */}
      <div className="lead-form-row">
        <div className="lead-form-field">
          <label htmlFor={`in-name-${kind}`}>First name</label>
          <input id={`in-name-${kind}`} name="name" type="text" placeholder="First name"
            autoComplete="given-name" />
        </div>
        <div className="lead-form-field">
          <label htmlFor={`in-email-${kind}`}>Email address</label>
          <input id={`in-email-${kind}`} name="email" type="email" required
            pattern={EMAIL_PATTERN} title={EMAIL_TITLE}
            placeholder="you@example.com" autoComplete="email" autoCapitalize="none"
            spellCheck={false} />
        </div>
      </div>

      {/* THREE CHOICES BEFORE THE MESSAGE — 25 Sep 2026, the owner's decision.
          See lib/enquiry-fields.ts for why the rule at the top of this file
          was reversed. Selects, not text: a script that pastes one string into
          every field cannot answer them, and a person answers each in one
          tap. They are what the first reply would otherwise have to ask. */}
      <div className="lead-form-row">
        <div className="lead-form-field">
          <label htmlFor={`in-looking-${kind}`}>What are you looking for?</label>
          <select id={`in-looking-${kind}`} name="looking" required value={looking}
            onChange={(e) => setLooking(e.currentTarget.value)}>
            <option value="" disabled>Choose one</option>
            {LOOKING.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {/* Not asked of an employer: both are about a client's sessions. */}
        {!employer && (
          <>
            <div className="lead-form-field">
              <label htmlFor={`in-where-${kind}`}>Where will you be for sessions?</label>
              <select id={`in-where-${kind}`} name="where" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {WHERE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="lead-form-field">
              <label htmlFor={`in-timing-${kind}`}>How soon are you hoping to start?</label>
              <select id={`in-timing-${kind}`} name="timing" required defaultValue="">
                <option value="" disabled>Choose one</option>
                {TIMING.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="lead-form-field">
        <label htmlFor="in-message">Your message</label>
        <p className="lead-form-hint" id={`in-message-hint-${kind}`}>
          {rule === ENQUIRY_FLOORS.enquiry
            ? <>About {MIN_WORDS} words, in two sentences or more: what is going on, and what you are
              hoping for.</>
            : <>About {rule.words} words: when you are usually free, and what you are looking for.</>}
        </p>
        <textarea id="in-message" name="message" required rows={4}
          className="lead-form-area" placeholder={placeholder ?? c.placeholder}
          aria-describedby={`in-message-hint-${kind} in-message-count-${kind}`}
          onInput={(e) => { checkLength(e.currentTarget); setMessage(e.currentTarget.value); }}
          onInvalid={(e) => checkLength(e.currentTarget)} />
        {/* The visible count changes on every word; the live region beside it
            only when the stage does, so a screen reader hears it three times. */}
        <p className="lead-form-hint" id={`in-message-count-${kind}`} data-stage={progress.stage}>
          {progress.count}
        </p>
        <p className="sr-only" aria-live="polite">{message ? progress.status : ''}</p>
      </div>

      {/* OPTIONAL callback.
          The practice publishes no phone number, so until now nobody could ask
          to be phoned — the only ways in were email and a calendar. Plenty of
          people will not write a paragraph about why they want counselling but
          will leave a number and a window.

          A <details> rather than two more visible inputs. Closed it costs one
          line and reads as an offer; opened, it is entirely the visitor's
          choice. That keeps faith with the rule at the top of this file: the
          objection there is to a REQUIRED phone field, and to fields that greet
          everyone whether they want them or not.

          type="tel" and no pattern. See lib/inbound-submit.ts for why nothing
          here validates the number. */}
      <details className="lead-form-callback">
        <summary>Would rather be phoned than emailed?</summary>
        <div className="lead-form-row" style={{ marginTop: 10 }}>
          <div className="lead-form-field">
            <label htmlFor={`in-phone-${kind}`}>Phone number (optional)</label>
            <input id={`in-phone-${kind}`} name="phone" type="tel" inputMode="tel"
              autoComplete="tel" placeholder="Phone number (optional)" />
          </div>
          <div className="lead-form-field">
            <label htmlFor={`in-callwindow-${kind}`}>Best time to call (optional)</label>
            <input id={`in-callwindow-${kind}`} name="callWindow" type="text"
              placeholder="Best time to call" />
          </div>
        </div>
        <p className="lead-form-note" style={{ marginTop: 8 }}>
          Leave these blank and you will be answered by email as usual. If you fill them in,
          the call comes from a private number and no message is left unless you say it is
          safe to leave one.
        </p>
      </details>

      {failed && (
        <p className="lead-form-note" role="alert" style={{ color: 'var(--clay-deep)' }}>
          That did not go through. {whySentence(why, MIN_WORDS)}
          {why === 'store' && (
            <> Please write to <MailLink where="book-fallback" /> instead; what you typed is
            still in the form above, so it can be copied across.</>
          )}
        </p>
      )}

      <div className="lead-form-row" style={{ marginBottom: 6 }}>
        <button type="submit" className="btn btn--primary">{button ?? c.button}</button>
      </div>

      <p className="lead-form-note">
        Please keep anything clinical for the session itself, ordinary email is not a secure
        channel. If you are in immediate danger call 911, or call or text 9-8-8 for urgent
        mental-health support in BC.
      </p>
    </form>
  );
}
