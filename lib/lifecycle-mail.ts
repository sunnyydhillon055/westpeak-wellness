import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links } from '@/lib/booking-mail';

/* The two hardest emails in this system to write, and the two most easily got
 * wrong — because the version that converts best is the version that should not
 * be sent.
 *
 * BCACC, AND WHY IT IS NOT THE ONLY CONSTRAINT
 *
 * The advertising standards rule out testimonials and outcome claims, which
 * removes the usual toolkit. But the real constraint here is not regulatory. A
 * former counselling client is not a lapsed subscriber. They may have finished
 * because the work was done — the good outcome — or because they could not
 * afford it, or because they did not find it useful, or because something
 * happened they would rather not revisit. The practice does not know which, and
 * an email written as though it were the first case lands badly on the other
 * three.
 *
 * So both templates below are built around one rule: **make it easy to come
 * back and equally easy to ignore.** No urgency, no scarcity, no "we miss you",
 * no implication that stopping was premature or that they should still be in
 * therapy. If a message needs the recipient to feel slightly bad to work, it is
 * the wrong message.
 *
 * ONCE, EVER. See lib/lifecycle.ts. One message per person for the lifetime of
 * the practice.
 */

/* ---- reactivation --------------------------------------------------------- */

export function reactivationEmail(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

This is a one-off note, and the only one of its kind you will get.

The practice has openings again. If at some point you want to pick
things up — whether that is soon, months from now, or not at all —
booking is here and you would not be starting from scratch:

${links.bookSession}

There is nothing to reply to and nothing you need to do. Finishing
counselling when you did was a decision you were entitled to make, and
this is not a suggestion that it was the wrong one. It is only so that
you know the door is open and know where it is.

If it would help to talk about whether now is a sensible time before
committing to a session, the free 15-minute consultation is still free
for people who have worked with the practice before:

${links.book}

If your circumstances have changed and the fee is the obstacle, say so
in a reply. There are lower-cost and no-cost options in BC and it is
worth being pointed at the right one rather than going without.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}
Online counselling across British Columbia
${site.domain}`);

  const html = shell(
    'The door is open, if you want it',
    p(esc(hi)) +
    p('This is a one-off note, and the only one of its kind you will get.') +
    p('The practice has openings again. If at some point you want to pick things up — soon, months from now, or not at all — booking is below, and you would not be starting from scratch.') +
    btn(links.bookSession, 'Book a session') +
    p('There is nothing to reply to and nothing you need to do. Finishing when you did was a decision you were entitled to make, and this is not a suggestion that it was the wrong one. It is only so you know the door is open, and where it is.') +
    p(`If it would help to talk about whether now is a sensible time first, the ${a(links.book, 'free 15-minute consultation')} is still free for people who have worked with the practice before.`) +
    p('<span style="color:#545e69;font-size:14px;">If circumstances have changed and the fee is the obstacle, say so in a reply — there are lower-cost and no-cost options in BC and it is worth being pointed at the right one rather than going without.</span>')
  );

  return { subject: 'A one-off note from Westpeak Wellness', text, html };
}

/* ---- missed session ------------------------------------------------------- */

export function missedSessionEmail(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  /* NOTHING ABOUT THE FEE. Deliberately, and this is the important line in the
   * file. Whether to charge for a missed session is a judgement about a person
   * in a clinical relationship — someone who did not attend may have been
   * unwell, in crisis, or avoiding precisely the thing they came to work on.
   * A scheduled job must not make that call, and must not pre-empt it by
   * raising the subject before a human has looked. The practice sees the missed
   * appointment in /admin and decides. */
  const text = wrap(
`${hi}

We had a session booked yesterday and you were not able to make it.

No explanation needed, and nothing is assumed. Missing one is common
and it is not treated as a statement about anything.

When you want another, here:
${links.bookSession}

If something got in the way that would be worth knowing about — a
change in circumstances, or the time of day no longer working — reply
and say so. It is easier to change than to work around.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}`);

  const html = shell(
    'We missed you yesterday',
    p(esc(hi)) +
    p('We had a session booked yesterday and you were not able to make it.') +
    p('No explanation needed, and nothing is assumed. Missing one is common and it is not treated as a statement about anything.') +
    btn(links.bookSession, 'Book another time') +
    p('If something got in the way that would be worth knowing about — a change in circumstances, or the time of day no longer working — reply and say so. It is easier to change than to work around.')
  );

  return { subject: 'About yesterday — Westpeak Wellness', text, html };
}
