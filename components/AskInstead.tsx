'use client';

import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

/* The small ask, for the 94 pages that only ever offered the big one.
 *
 * WHY THIS EXISTS
 *
 * A crawl of all 116 URLs on 17 Aug 2026 found that booking a video call was
 * the ONLY route to contact on 94 of them. Booking is the highest-commitment
 * action on the site — a scheduled video call with a stranger — and on most
 * pages it was the only action available. Somebody reading the trauma guide at
 * two in the morning is not going to book a call. They might write a sentence.
 *
 * So this is deliberately the smallest possible thing: one line of text, one
 * email address, no name required, no phone field, no dropdown of concerns.
 * Every additional field on a first approach to a counselling practice is a
 * reason to close the tab, and anything else needed can be asked in the reply.
 *
 * WHY IT DOES NOT SHOW ITS OWN CONFIRMATION
 *
 * The full InboundForm bounces back to its own page and reads ?sent=ok. That
 * works on /contact, which is rendered on demand anyway. It cannot work here:
 * reading a query parameter inside a page opts that page out of static
 * generation, and this component is on ~94 prerendered pages. So it posts with
 * returnTo=/message-sent, a static page that carries the confirmation.
 *
 * WHAT IT PROMISES, AND WHY THE PROMISE IS THE POINT
 *
 * "A reply within one business day, from your counsellor, not an assistant" was
 * true before this component existed and appeared on exactly two pages. It is
 * the most reassuring sentence on the site, and it was invisible everywhere the
 * decision was actually being made.
 */
export default function AskInstead({
  /* Softer framing for pages about subjects where a cheerful booking prompt
     reads badly — intrusive thoughts, crisis, being at the end of your rope. */
  tone = 'default',
}: {
  tone?: 'default' | 'gentle';
}) {
  const pathname = usePathname();
  const gentle = tone === 'gentle';

  return (
    <form
      method="POST"
      action="/api/enquiry"
      className="ask-instead"
      onSubmit={() => track('enquiry_submit', { page: pathname ?? '' })}
    >
      <p className="ask-instead-title">
        {gentle ? 'Or just say what is going on.' : 'Not ready to book? Ask instead.'}
      </p>
      <p className="ask-instead-note">
        {gentle
          ? 'You do not have to be ready for anything, or know what you want. One line is enough, and it reaches your counsellor directly.'
          : 'One line is enough. It goes straight to your counsellor — not an assistant — and you will have a reply within one business day.'}
      </p>

      {/* The page it came from, for the record and for working out which pages
          actually earn enquiries. */}
      <input type="hidden" name="source" value={pathname ?? '/'} />
      {/* See the note above: this page is static and cannot render a
          confirmation, so the confirmation gets its own page. */}
      <input type="hidden" name="returnTo" value="/message-sent" />

      {/* Honeypot — hidden from sight, from screen readers and from the tab
          order, so no human ever meets it. Bots fill it and are silently
          accepted rather than told. Nobody reaching a counselling site should
          be asked to prove they are not a robot. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="hp-ask">Company</label>
        <input id="hp-ask" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor="ask-message" className="sr-only">
        What you would like to ask
      </label>
      <textarea
        id="ask-message"
        name="message"
        required
        rows={3}
        className="ask-instead-area"
        placeholder={
          gentle
            ? 'Whatever you can put into words.'
            : 'A sentence is genuinely enough.'
        }
      />

      <div className="ask-instead-row">
        <label htmlFor="ask-email" className="sr-only">
          Email address
        </label>
        <input
          id="ask-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
        />
        <button type="submit" className="btn btn--primary">
          Send
        </button>
      </div>

      {/* THE CREDENTIAL, AT THE FORM.
          It sits in the page body and in the footer, which is 900 words from
          where somebody actually decides whether to type. BCACC registration is
          the strongest permitted trust signal this practice has — testimonials
          are forbidden, so this is what there is — and it was nowhere near the
          ask. */}
      <p className="ask-instead-fine">
        Replies come from a <strong>Registered Clinical Counsellor</strong> registered with
        the BCACC — a registration you can{' '}
        <a href="https://bc-counsellors.org/counsellors/" rel="nofollow noopener" target="_blank">
          check yourself in about two minutes
        </a>
        .
      </p>
      <p className="ask-instead-fine">
        You get a reply and nothing else — no mailing list, and no client record is
        created. Please keep anything clinical for the session itself; ordinary email is not a
        secure channel. If you are in immediate danger call 911, or call or text 9-8-8 for
        urgent mental-health support in BC at any hour.
      </p>
    </form>
  );
}
