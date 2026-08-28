'use client';

import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

/* The two forms that give someone a way in other than picking a calendar slot.
 *
 * `enquiry`  — "I have a question", on /contact and at the foot of guides.
 * `waitlist` — "none of these times work", under both scheduler embeds.
 *
 * One component because they differ by two fields and a heading, and two
 * near-identical forms drift apart the first time one of them is edited.
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

type Kind = 'enquiry' | 'waitlist';

const COPY = {
  enquiry: {
    action: '/api/enquiry',
    title: 'Rather ask a question first?',
    note: 'Send a message instead of booking. It reaches the practice directly and you will have a reply within one business day.',
    placeholder: 'A sentence is genuinely enough — what is going on, or what you want to know.',
    button: 'Send message',
    doneTitle: 'Your message has arrived.',
    doneBody:
      'You will have a reply within one business day, and a copy is in your inbox. Nothing further is needed from you.',
    event: 'enquiry_submit',
  },
  waitlist: {
    action: '/api/waitlist',
    title: 'None of these times work?',
    note: 'The practice runs a small number of hours. Say roughly when you are free and you will hear directly when something opens that fits.',
    placeholder: 'e.g. weekday mornings before 9, or any time Saturday',
    button: 'Add me to the waitlist',
    doneTitle: 'Your availability is noted.',
    doneBody:
      'This is a real waitlist rather than a formality — when something opens that fits, you will hear directly. A confirmation is in your inbox.',
    event: 'waitlist_submit',
  },
} as const;

export default function InboundForm({ kind, done }: { kind: Kind; done?: 'ok' | 'err' }) {
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

  return (
    <form method="POST" action={c.action} className="lead-form" id="form"
      onSubmit={() => track(c.event, { page: pathname ?? '' })}>
      <p className="lead-form-title">{c.title}</p>
      <p className="lead-form-note">{c.note}</p>

      {/* Which page this came from — used for the return redirect and to work
          out which pages actually earn enquiries. Server-validated as a
          same-site path; see safePath() in lib/inbound-submit.ts. */}
      <input type="hidden" name="source" value={pathname ?? '/'} />

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

      {kind === 'enquiry' ? (
        <>
          <label htmlFor="in-message" className="sr-only">Your message</label>
          <textarea id="in-message" name="message" required rows={4}
            className="lead-form-area" placeholder={c.placeholder} />
        </>
      ) : (
        <>
          <label htmlFor="in-windows" className="sr-only">When you are free</label>
          <input id="in-windows" name="windows" type="text" className="lead-form-wide"
            placeholder={c.placeholder} />
        </>
      )}

      {/* OPTIONAL callback, on both kinds.
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
          That did not go through — please check the email address and try again.
        </p>
      )}

      <div className="lead-form-row" style={{ marginBottom: 6 }}>
        <button type="submit" className="btn btn--primary">{c.button}</button>
      </div>

      <p className="lead-form-note">
        {kind === 'enquiry'
          ? 'Please keep anything clinical for the session itself — ordinary email is not a secure channel. If you are in immediate danger call 911, or call or text 9-8-8 for urgent mental-health support in BC.'
          : 'Your address is used for this and nothing else. It does not create a client record and there is no mailing list.'}
      </p>
    </form>
  );
}
