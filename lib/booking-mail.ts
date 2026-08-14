import { site } from '@/lib/site';

/* Confirmation and follow-up email, sent from westpeakwellness.com.
 *
 * WHY, GIVEN CLINIKO ALREADY SENDS A CONFIRMATION
 *
 * It does — an audit on 2026-08-14 found 23 of the last 100 communications
 * were appointment confirmations, one sent that afternoon. Nothing is broken in
 * Cliniko. The problem is the envelope:
 *
 *     from: "Westpeak Wellness,  <counsellor> (via Cliniko)" <notifications@cliniko.com>
 *
 * Clients do not recognise that sender, so it reads as spam and frequently is
 * filed as spam; searching an inbox for "westpeak" finds nothing; and replies
 * go to Cliniko rather than the practice. Cliniko does not support a custom
 * sending domain, only a custom reply-to, so this cannot be fixed there.
 *
 * FOLLOW-UPS DO NOT EXIST AT ALL. Cliniko's categories are Confirmation,
 * Reminder, Invoice, Patient Form, Cancellation and Practitioner Notification.
 * There is no post-session message and no feature to build one.
 *
 * So this is additive: Cliniko's confirmation remains the system-of-record
 * receipt, and the practice sends a recognisable one from its own domain plus
 * the follow-up Cliniko cannot.
 *
 * BCACC CONSTRAINTS, WHICH SHAPE THE FOLLOW-UP MORE THAN ANYTHING ELSE
 *
 *   - No soliciting testimonials or reviews from clients, including former
 *     ones. A "how did we do? leave us a review" follow-up is the single most
 *     common post-appointment email in every other industry and it is
 *     PROHIBITED here. Do not add one.
 *   - No outcome claims, no implication that progress is expected by now.
 *   - Nothing clinical in the email body. It goes to an inbox that may be
 *     shared, read on a lock screen, or seen by someone else in the house.
 *
 * That last point is why neither template names the presenting concern, the
 * service booked, or anything beyond the fact of an appointment.
 */

const BASE = site.domain;

/** Every link the emails use, in one place so they cannot rot separately. */
export const links = {
  book: `${BASE}${site.bookingPath}`,
  pricing: `${BASE}/pricing`,
  faq: `${BASE}/faq`,
  answers: `${BASE}/answers`,
  firstSession: `${BASE}/guides/what-to-expect-first-therapy-session`,
  coverage: `${BASE}/resources/bc-extended-health-coverage-for-counselling`,
  standards: `${BASE}/standards`,
  privacy: `${BASE}/privacy`,
  portal: `${BASE}/client-portal`,
  contact: `${BASE}/contact`,
  guides: `${BASE}/guides`,
  punjabi: `${BASE}/punjabi`,
  crisis: `${BASE}/standards#crisis`,
} as const;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Wrapped at 72 characters. Some mail clients hard-wrap plain text at 78 and
 * a paragraph that wraps twice reads as broken. */
function wrap(s: string, width = 72): string {
  return s.split('\n').map((line) => {
    if (line.length <= width) return line;
    const out: string[] = [];
    let cur = '';
    for (const word of line.split(' ')) {
      if ((cur + ' ' + word).trim().length > width) { out.push(cur.trim()); cur = word; }
      else cur += ' ' + word;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.join('\n');
  }).join('\n');
}

const shell = (heading: string, body: string) => `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f2ee;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#22262b;">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;">Westpeak Wellness</p>
<h1 style="margin:0 0 18px;font-size:21px;line-height:1.3;color:#1f3d4d;">${esc(heading)}</h1>
${body}
<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;">
<p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:#6b7280;">
Westpeak Wellness · Online counselling across British Columbia<br>
<a href="${links.contact}" style="color:#6b7280;">Contact</a> ·
<a href="${links.privacy}" style="color:#6b7280;">Privacy</a> ·
<a href="${links.standards}" style="color:#6b7280;">Standards &amp; scope</a>
</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">
If you are in immediate danger call 911. For urgent mental-health support in
BC, call or text <strong>9-8-8</strong> at any hour.
</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

const btn = (href: string, label: string) =>
  `<p style="margin:0 0 22px;"><a href="${href}" style="display:inline-block;background:#1f3d4d;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:6px;font-weight:600;font-size:15px;">${esc(label)}</a></p>`;

const p = (html: string) =>
  `<p style="margin:0 0 15px;font-size:15px;line-height:1.65;">${html}</p>`;

const a = (href: string, label: string) =>
  `<a href="${href}" style="color:#1f3d4d;">${esc(label)}</a>`;

export type Booking = {
  firstName: string;
  email: string;
  /** Localised, already formatted for America/Vancouver. */
  whenText: string;
  minutes: number;
  isConsult: boolean;
};

/* ---- confirmation -------------------------------------------------------- */

export function confirmationEmail(b: Booking) {
  const subject = b.isConsult
    ? 'Your free consultation is booked — Westpeak Wellness'
    : 'Your session is booked — Westpeak Wellness';

  const text = wrap(
`Hi ${b.firstName},

Your appointment with Westpeak Wellness is confirmed for:

  ${b.whenText}  (${b.minutes} minutes, by secure video)

You will receive a separate email from Cliniko, our booking system, with
the video link and calendar details. It arrives from notifications@
cliniko.com — worth checking your spam folder if you do not see it, and
marking it as safe so future ones arrive.

If it is your first time, this walks through what actually happens:
${links.firstSession}

A few things that come up often:

  What it costs and how extended health works
  ${links.pricing}

  Common questions, answered directly
  ${links.answers}

  How this practice works, and what is outside its scope
  ${links.standards}

Need to change or cancel? Reply to this email and we will sort it out.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
Online counselling across British Columbia
${BASE}`);

  const html = shell(
    b.isConsult ? 'Your free consultation is booked' : 'Your session is booked',
    p(`Hi ${esc(b.firstName)},`) +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f7f5f1;border-radius:8px;padding:16px 18px;width:100%;">
       <tr><td style="font-size:15px;line-height:1.6;">
         <strong style="color:#1f3d4d;">${esc(b.whenText)}</strong><br>
         <span style="color:#5a6470;">${b.minutes} minutes · secure video</span>
       </td></tr></table>` +
    p(`You will get a separate email from Cliniko, our booking system, carrying the video link and calendar invite. It arrives from <strong>notifications@cliniko.com</strong> — worth checking spam if it is not there, and marking it safe so future ones land.`) +
    (b.isConsult
      ? p(`This is a free 15-minute conversation to work out whether this is the right fit. There is no obligation to book anything afterwards, and a referral elsewhere is a perfectly good outcome.`)
      : '') +
    btn(links.firstSession, 'What to expect') +
    p(`Also useful: ${a(links.pricing, 'fees and extended health coverage')}, ${a(links.answers, 'common questions')}, and ${a(links.standards, 'how this practice works')}.`) +
    p(`Need to change or cancel? Just reply to this email.`)
  );

  return { subject, text, html };
}

/* ---- follow-up ----------------------------------------------------------- */

export function followUpEmail(b: Booking) {
  /* Deliberately does NOT: ask how the session went, request a review or
   * testimonial (BCACC prohibits soliciting these), imply progress should
   * have happened, or mention anything clinical. It exists to make the next
   * step easy and to be a door left open. */
  const subject = 'After your session — Westpeak Wellness';

  const text = wrap(
`Hi ${b.firstName},

Thanks for making the time yesterday.

No reply needed. This is just the practical bits in one place, so you do
not have to go looking for them.

  Book your next session
  ${links.book}

  Fees, receipts and extended health
  ${links.pricing}

  Reading, if you want it
  ${links.guides}

If anything came up afterwards that you would rather raise before the
next session, replying here reaches the practice directly.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
Online counselling across British Columbia
${BASE}`);

  const html = shell(
    'After your session',
    p(`Hi ${esc(b.firstName)},`) +
    p(`Thanks for making the time yesterday.`) +
    p(`No reply needed — this is just the practical bits in one place so you are not hunting for them.`) +
    btn(links.book, 'Book your next session') +
    p(`Also: ${a(links.pricing, 'fees, receipts and extended health')} · ${a(links.guides, 'reading, if you want it')}`) +
    p(`If something came up afterwards you would rather raise before next time, replying here reaches the practice directly.`)
  );

  return { subject, text, html };
}
