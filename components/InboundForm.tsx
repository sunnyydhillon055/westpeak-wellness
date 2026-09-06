'use client';
import FormStamp from '@/components/FormStamp';

import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';
import { hasEnoughSentences, MIN_SENTENCES } from '@/lib/sentences';

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
 * NO REQUIRED PHONE FIELD, no "how did you hear about us", no dropdown of
 * concerns. Every extra field on a first approach to a counselling practice is
 * a reason to close the tab, and the practice can ask anything it needs to in
 * the reply.
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
    event: 'enquiry_submit',
  },
} as const;

const TOO_SHORT =
  `Please write at least ${MIN_SENTENCES === 2 ? 'two' : String(MIN_SENTENCES)} sentences about what you are looking for.`;

export default function InboundForm({
  kind,
  done,
  practitioner,
  title,
  note,
  placeholder,
  button,
}: {
  kind: Kind;
  done?: 'ok' | 'err';
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

  if (done === 'ok') {
    return (
      <div className="crisis" id="form" style={{ marginTop: 8 }}>
        <p style={{ margin: 0 }}>
          <strong>{c.doneTitle}</strong> {c.doneBody}
        </p>
      </div>
    );
  }

  /* The native validity prompt rather than a custom banner: it appears at the
     field, in the browser's own words plus this one line, and it blocks the
     post. Cleared on every keystroke so the message updates as they type.
     With JavaScript off none of this runs and the server applies the rule. */
  const checkLength = (el: HTMLTextAreaElement) =>
    el.setCustomValidity(hasEnoughSentences(el.value) ? '' : TOO_SHORT);

  return (
    <form method="POST" action={c.action} className="lead-form" id="form"
      onSubmit={() => track(c.event, { page: pathname ?? '' })}>
      <p className="lead-form-title">{title ?? c.title}</p>
      <p className="lead-form-note">{note ?? c.note}</p>

      {/* Which page this came from — used for the return redirect and to work
          out which pages actually earn enquiries. Server-validated as a
          same-site path; see safePath() in lib/inbound-submit.ts. */}
      <input type="hidden" name="source" value={pathname ?? '/'} />
      {practitioner && <input type="hidden" name="practitioner" value={practitioner} />}
      <FormStamp />


      {/* Honeypot. Hidden from sight and from screen readers, and skipped by
          the tab order, so no human ever meets it. Bots fill it and are
          silently accepted rather than told they were caught. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`hp-${kind}`}>Company</label>
        <input id={`hp-${kind}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="lead-form-row">
        <label htmlFor={`in-name-${kind}`} className="sr-only">First name</label>
        <input id={`in-name-${kind}`} name="name" type="text" placeholder="First name"
          autoComplete="given-name" />
        <label htmlFor={`in-email-${kind}`} className="sr-only">Email address</label>
        <input id={`in-email-${kind}`} name="email" type="email" required
          placeholder="you@example.com" autoComplete="email" autoCapitalize="none"
          spellCheck={false} />
      </div>

      <label htmlFor="in-message" className="sr-only">What you are looking for</label>
      <textarea id="in-message" name="message" required rows={4}
        className="lead-form-area" placeholder={placeholder ?? c.placeholder}
        onInput={(e) => checkLength(e.currentTarget)}
        onInvalid={(e) => checkLength(e.currentTarget)} />

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
          <label htmlFor={`in-phone-${kind}`} className="sr-only">Phone number (optional)</label>
          <input id={`in-phone-${kind}`} name="phone" type="tel" inputMode="tel"
            autoComplete="tel" placeholder="Phone number (optional)" />
          <label htmlFor={`in-callwindow-${kind}`} className="sr-only">
            Best time to call (optional)
          </label>
          <input id={`in-callwindow-${kind}`} name="callWindow" type="text"
            placeholder="Best time to call" />
        </div>
        <p className="lead-form-note" style={{ marginTop: 8 }}>
          Leave these blank and you will be answered by email as usual. If you fill them in,
          the call comes from a private number and no message is left unless you say it is
          safe to leave one.
        </p>
      </details>

      {done === 'err' && (
        <p className="lead-form-note" role="alert" style={{ color: 'var(--clay-deep)' }}>
          That did not go through. Please check the email address, and write at least two
          sentences about what you are looking for.
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
