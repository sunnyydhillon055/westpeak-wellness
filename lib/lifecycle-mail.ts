import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links, paidCalendarFor, sessionLink, tagMail, type BookingPractitioner, type EmailTemplate } from '@/lib/booking-mail';
import { consultReplyTo } from '@/lib/booking-followups';

/* The counsellor a note is about, when the caller knows her. The few fields
   a template needs, so this file never imports the roster. */
export type MailCounsellor = Pick<BookingPractitioner, 'firstName' | 'clinikoPractitionerId'> & {
  /** False when she is not on the online calendar: then her calendar is not linked. */
  bookable?: boolean;
  alertEmail?: string;
  /** Her roster slug, so the link can go through /book/session. */
  slug?: string;
};

/* Her own paid calendar when she is on it, else null. Through /book/session
   when her slug is known (1 Oct 2026), which counts the click against the
   template and redirects to the same calendar; straight to Cliniko when it
   is not, as before. */
const herCalendar = (c: MailCounsellor | null | undefined, typeId: string | undefined, from: EmailTemplate): string | null =>
  c && c.bookable !== false && c.clinikoPractitionerId
    ? (c.slug
      ? sessionLink({ slug: c.slug, clinikoPractitionerId: c.clinikoPractitionerId }, typeId, from)
      : paidCalendarFor({ clinikoPractitionerId: c.clinikoPractitionerId } as BookingPractitioner, typeId))
    : null;

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

/* `counsellor`, 1 Oct 2026 (/admin, "Not seen lately"): when the person's
   counsellor is on the online calendar the button opens HER paid calendar
   and a reply reaches her as well as info@, rather than the practice-wide
   calendar that asks them to pick again. Without one, as before. Returns
   `replyTo` so the caller does not have to work it out. */
export function reactivationEmail(firstName: string, counsellor?: MailCounsellor | null) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const own = herCalendar(counsellor, undefined, 'reactivation');
  const bookUrl = own ?? sessionLink(null, undefined, 'reactivation');
  const bookLabel = own && counsellor?.firstName ? `Book a session with ${counsellor.firstName}` : 'Book a session';
  const replyTo = own ? consultReplyTo(counsellor ?? undefined) : site.email;

  const text = wrap(
`${hi}

This is a one-off note, and the only one of its kind you will get.

The practice has openings again. If at some point you want to pick
things up, whether that is soon, months from now, or not at all,
booking is here and you would not be starting from scratch:

${bookUrl}

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
    p('The practice has openings again. If at some point you want to pick things up, soon, months from now, or not at all, booking is below and you would not be starting from scratch.') +
    btn(bookUrl, bookLabel) +
    p('There is nothing to reply to and nothing you need to do. Finishing when you did was a decision you were entitled to make, and this is not a suggestion that it was the wrong one. It is only so you know the door is open, and where it is.') +
    p(`If it would help to talk about whether now is a sensible time first, the ${a(links.book, 'free 15-minute consultation')} is still free for people who have worked with the practice before.`) +
    p('<span style="color:#545e69;font-size:14px;">If circumstances have changed and the fee is the obstacle, say so in a reply. There are lower-cost and no-cost options in BC and it is worth being pointed at the right one rather than going without.</span>'),
    'A one-off note: booking is there if you want it, and nothing to reply to',
  );

  return tagMail({ subject: 'A one-off note from Westpeak Wellness', text, html, replyTo }, 'reactivation');
}

/* ---- missed session ------------------------------------------------------- */

/* A MISSED FREE CONSULTATION IS NOT A MISSED SESSION. Until 1 Oct 2026 both got
 * the same note, whose button opened the paid, card-required calendar: a person
 * who had not yet had the free call was offered a paid hour instead. A consult
 * now gets its own note, which rebooks the same free consultation with the
 * same counsellor (/book?with=<slug>#calendar) and mentions no fee at all.
 *
 * `consult` is optional so any other caller keeps the session wording. */
export function missedSessionEmail(
  firstName: string,
  consult?: { isConsult: boolean; practitionerSlug?: string; counsellor?: MailCounsellor | null; typeId?: string },
) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  if (consult?.isConsult) {
    const again = `${site.domain}${site.bookingPath}${consult.practitionerSlug ? `?with=${encodeURIComponent(consult.practitionerSlug)}` : ''}#calendar`;
    const text = wrap(
`${hi}

Your free consultation was booked for yesterday and it did not happen.

No explanation needed, and nothing is assumed. Plans change, and the
call is still there whenever suits. Here is the same calendar:
${again}

It is still free, still 15 minutes by secure video, and there is still
no obligation to book anything afterwards.

If the time of day was the problem, or something else got in the way,
reply and say so. It is easier to change than to work around.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}`);

    const html = shell(
      'Whenever suits',
      p(esc(hi)) +
      p('Your free consultation was booked for yesterday and it did not happen.') +
      p('No explanation needed, and nothing is assumed. Plans change, and the call is still there whenever suits.') +
      btn(again, 'Pick another time') +
      p('It is still free, still 15 minutes by secure video, and there is still no obligation to book anything afterwards.') +
      p('If the time of day was the problem, or something else got in the way, reply and say so. It is easier to change than to work around.'),
      'No explanation needed. The same free 15-minute call is there whenever suits',
    );

    return tagMail({ subject: 'About yesterday | Westpeak Wellness', text, html }, 'missed');
  }

  /* NOTHING ABOUT THE FEE. Deliberately, and this is the important line in the
   * file. Whether to charge for a missed session is a judgement about a person
   * in a clinical relationship — someone who did not attend may have been
   * unwell, in crisis, or avoiding precisely the thing they came to work on.
   * A scheduled job must not make that call, and must not pre-empt it by
   * raising the subject before a human has looked. The practice sees the missed
   * appointment in /admin and decides. */
  /* HER CALENDAR, HER NAME, 1 Oct 2026. The button opened the practice-wide
     paid calendar, which lists every type and every counsellor, and the note
     was signed by the practice. It now opens her paid calendar for the same
     appointment type, and is signed with her first name; booking-notify sets
     the reply-to to her and info@. Without a counsellor, as before. */
  const again = herCalendar(consult?.counsellor, consult?.typeId, 'missed') ?? sessionLink(null, undefined, 'missed');
  const signer = herCalendar(consult?.counsellor, undefined, 'missed') && consult?.counsellor?.firstName
    ? `${consult.counsellor.firstName}\n${site.name}`
    : site.name;
  const text = wrap(
`${hi}

We had a session booked yesterday and you were not able to make it.

No explanation needed, and nothing is assumed. Missing one is common
and it is not treated as a statement about anything.

When you want another, here:
${again}

If something got in the way that would be worth knowing about, a
change in circumstances, or the time of day no longer working, reply
and say so. It is easier to change than to work around.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${signer}`);

  const html = shell(
    'We missed you yesterday',
    p(esc(hi)) +
    p('We had a session booked yesterday and you were not able to make it.') +
    p('No explanation needed, and nothing is assumed. Missing one is common and it is not treated as a statement about anything.') +
    btn(again, 'Book another time') +
    p('If something got in the way that would be worth knowing about, a change in circumstances, or the time of day no longer working, reply and say so. It is easier to change than to work around.') +
    (signer !== site.name ? p(esc(signer).replace('\n', '<br>')) : ''),
    'No explanation needed. Booking another time, whenever suits',
  );

  return tagMail({ subject: 'About yesterday | Westpeak Wellness', text, html }, 'missed');
}
