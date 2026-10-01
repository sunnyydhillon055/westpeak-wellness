import type { Inbound } from '@/lib/inbound';
import { site } from '@/lib/site';

/* DRAFT REPLIES, NOT SEND BUTTONS.
 *
 * Every page on this site promises a reply within one business day, from the
 * counsellor rather than an assistant. That promise is the reason the small ask
 * works — and keeping it currently means composing an original email every
 * time, at whatever hour the message arrived.
 *
 * These are the four replies that actually get sent, as starting points. They
 * open a mail client with the draft already in it; nothing is sent by this
 * file, and nothing is sent automatically. A counselling reply that went out
 * without being read by a person would be worse than a slow one.
 *
 * TONE RULES, which are the whole point of writing them down once
 *
 * - Answer the question that was asked, first. Not "thank you for reaching out".
 * - Never imply the person has to book. Saying no is a normal outcome and the
 *   reply should make that visible rather than merely permitted.
 * - No urgency, no scarcity, no "spaces are limited" — even when they are.
 * - Where this practice is the wrong fit, say so plainly and point somewhere
 *   useful. That is a good outcome, not a lost one.
 * - Nothing clinical over ordinary email. Acknowledge, and move it to a session.
 */

export type ReplyTemplate = {
  key: string;
  label: string;
  /** One line, for the admin picker — when to reach for this one. */
  when: string;
  subject: string;
  body: (i: Inbound) => string;
};

const firstName = (i: Inbound) => (i.name || '').trim().split(/\s+/)[0] || '';
const greeting = (i: Inbound) => (firstName(i) ? `Hi ${firstName(i)},` : 'Hi,');

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    key: 'book',
    label: 'Yes, here is how to book',
    when: 'It sounds like a fit and they are ready.',
    subject: 'Re: your message',
    body: (i) => `${greeting(i)}

Thank you for writing, and for saying as much as you did.

The next step, if you want it, is a free 30-minute consultation by video. It is
a conversation rather than an assessment: you say what is going on in your own
words, ask whatever you want to ask, and we work out together whether this is
the right fit. Nothing is diagnosed and nothing is decided on the call.

You can pick a time here:
${site.domain}${site.bookingPath}

If none of those times work, tell me roughly when you are free and I will let
you know when something opens up.

And if you read this and change your mind, that is completely fine. You do not
need to reply to say so.

`,
  },
  {
    key: 'not-a-fit',
    label: 'Not the right fit, here is who is',
    when: 'Outside scope: assessments, court work, under 19, crisis, or a modality not offered.',
    subject: 'Re: your message',
    body: (i) => `${greeting(i)}

Thank you for writing, and for trusting me with that.

I want to be straight with you rather than take a booking that would not help:
based on what you have described, I do not think this practice is the right
place for it. [, say briefly why: outside scope / needs an assessment / needs
in-person / needs a specialism I do not hold ]

What I would suggest instead:

[, one or two concrete places, with links. Useful starting points:
  ${site.domain}/resources/low-cost-counselling-bc
  ${site.domain}/guides/how-to-find-a-therapist-in-bc
  ${site.domain}/resources/psychiatry-and-assessment-in-bc ]

This is a normal outcome rather than a door closing, and I would rather you got
to the right person quickly than spent a first session finding out.

If your situation changes, you are very welcome to write again.

`,
  },
  {
    key: 'urgent',
    label: 'This sounds urgent',
    when: 'Anything suggesting risk. Send this first, then decide about a booking.',
    subject: 'Re: your message, please read this part first',
    body: (i) => `${greeting(i)}

Thank you for writing. I am reading what you sent carefully, and I want to give
you the immediate things first, because this practice runs scheduled sessions
and has no on-call line, so I am not able to be the fastest help available to
you tonight.

If you are in immediate danger, call 911.

For urgent mental-health support in BC, at any hour:
  9-8-8: Suicide Crisis Helpline, call or text
  310-6789: BC Mental Health Support Line, no area code needed
  8-1-1: HealthLink BC, free advice from a nurse

More, including what each service actually does:
${site.domain}/resources/bc-crisis-and-support-directory

None of that is me passing you along. It is what I would want somebody to tell
me, and it is available right now in a way a scheduled appointment is not.

[, then, if appropriate: and here is what I can offer, and when ]

`,
  },
  {
    key: 'full',
    label: 'I am full right now',
    when: 'No capacity right now, but it would otherwise be a fit.',
    subject: 'Re: your message',
    body: (i) => `${greeting(i)}

Thank you for writing.

I want to be honest about timing rather than book you into something distant
and vague: I do not have regular openings at the moment. [: add the real
picture: roughly when you expect one, if you know. ]

If you would like, tell me roughly when you are free during a week and I will
write to you directly if something opens that fits. There is no obligation
attached to that.

If waiting is not workable, and for a lot of people it is not, these are
genuinely good places to look now:
  ${site.domain}/resources/low-cost-counselling-bc
  ${site.domain}/guides/how-to-find-a-therapist-in-bc

Either way, thank you for asking. Doing that is usually the hardest part.

`,
  },
  /* 1 Oct 2026: the 'employer' choice on the enquiry form. A draft like the
     others, opened in a mail client and sent by a person. It answers the
     questions HR actually asks and offers nothing the practice does not do:
     no contract, no workshops, no reports on employees. */
  {
    key: 'employer',
    label: 'Employer or HR enquiry',
    when: 'An employer, manager or HR lead asking about their team.',
    subject: 'Re: counselling for your team',
    body: (i) => `${greeting(i)}

Thank you for writing about your team.

[: answer their question first, in a line or two. ]

How it works, in short: an employee books directly, privately, and the
first 30-minute consultation is free. They pay at booking and claim the
receipt on their own plan where it covers a Registered Clinical Counsellor.
The practice is not an EAP and has no employer contract. Nothing about an
employee comes to you; with their written consent, a counsellor can confirm
attendance on given dates and nothing more.

The page written for employers has a paragraph for a benefits page, a note
a manager can send one person, and an email for your broker at renewal:
  ${site.domain}/for/employers-and-hr?utm_source=hr

A printable one-page summary is here:
  ${site.domain}/for/employers-and-hr/one-pager

If there is anything else you need to know, reply here.

`,
  },
];

export const getTemplate = (key: string) => REPLY_TEMPLATES.find((t) => t.key === key);

/** A mailto: URL with the draft already in it. Any recipient, any draft:
 *  the enquiry templates above and the booking drafts below both use it. */
export function mailtoDraft(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({ subject, body });
  /* URLSearchParams encodes spaces as "+", which mail clients render literally
     in a body. Percent-encoding is what they actually expect. */
  return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
}

/** A mailto: URL for an enquiry, with the chosen template already in it. */
export function mailtoFor(i: Inbound, key: string): string {
  const t = getTemplate(key);
  if (!t) return `mailto:${i.email}`;
  return mailtoDraft(i.email, t.subject, t.body(i));
}

/* ============================================================================
   BOOKING DRAFTS — for the alerts lib/booking-notify.ts sends the practice.
   ----------------------------------------------------------------------------
   Moved here on 1 Oct 2026 from docs/CLIENT_FOLLOWUPS.md (drafts 2 and 3),
   so the alert can carry a mailto: with the draft filled in rather than
   pointing at a file. Same rule as everything above: NOTHING HERE IS SENT.
   The alert goes to the practice and the counsellor; she reads the draft,
   edits it and sends it from her own mailbox, or does not.

   Not in REPLY_TEMPLATES, because those are offered against website
   enquiries in /admin and these two make no sense there.
   ========================================================================= */

export type DraftContext = {
  firstName: string;
  /** The day of the appointment, as the client would say it: "Tuesday, October 6". */
  day: string;
  /** The booking link the draft offers: her free calendar or her paid one. */
  link: string;
  /** Who signs it. Absent leaves a [Name] bracket to fill in by hand. */
  signer?: string;
};

export type BookingDraft = { key: 'rebook-consult' | 'after-consult'; subject: string; body: (c: DraftContext) => string };

const hiDraft = (c: DraftContext) => (c.firstName && c.firstName !== 'there' ? `Hi ${c.firstName},` : 'Hi,');
const sign = (c: DraftContext) => `${c.signer || '[Name]'}
Registered Clinical Counsellor, ${site.name}
${site.email}
`;

export const BOOKING_DRAFTS: BookingDraft[] = [
  {
    /* After a cancelled consultation. Send once, a day or so later, never the
       same hour, and never if they have already rebooked. The subject carries
       no name and no word "cancelled": it shows on a lock screen. */
    key: 'rebook-consult',
    subject: `Whenever suits | ${site.name}`,
    body: (c) => `${hiDraft(c)}

I saw that the consultation on ${c.day} was cancelled. No explanation needed,
and no reply needed either; this is the only message of its kind.

If you would like to pick another time, the calendar is here and shows what
is open:
${c.link}

If none of the times work, tell me roughly when in a week you are free and I
will write back when something opens up that fits. There is no obligation
attached to that.

If you have decided against it, or found somewhere that fits better, that is
a completely reasonable outcome and you do not need to say so.

${sign(c)}`,
  },
  {
    /* Roughly two weeks after a consultation with no session booked. The
       automatic day-after note promised to be the only one of its kind, so
       this one comes from a person, once, and is not a second nudge. */
    key: 'after-consult',
    subject: `One more thing, then I will leave it with you | ${site.name}`,
    body: (c) => `${hiDraft(c)}

Thank you again for the conversation on ${c.day}. I said I would not send a
sequence, and this is not one; it is one message, and after it the next step
is entirely yours.

The question people most often have after a consultation and do not ask is
what they are committing to. The honest answer is: one session. There is no
package, no minimum and no contract. Most people start weekly and go further
apart; around the fourth session we deliberately check whether it is
working and whether I am the right person, and stopping there is a normal
outcome.

If you would like to go ahead, sessions can be booked directly here:
${c.link}

If the cost is the thing, say so. I would rather know than guess: fees are
published in full at ${site.domain}/pricing, whether an extended health plan
reimburses depends on the plan rather than the insurer, and if private
counselling is not workable right now there are free and low-cost routes in
BC that I will happily point you to:
${site.domain}/resources/low-cost-counselling-bc

If you have decided this is not the right fit, or the timing is wrong, that
is a good outcome to have reached and no reply is needed.

${sign(c)}`,
  },
];

export const getBookingDraft = (key: BookingDraft['key']) => BOOKING_DRAFTS.find((d) => d.key === key)!;

/** The draft as a mailto: to the client, ready for a person to edit and send. */
export function mailtoBookingDraft(to: string, key: BookingDraft['key'], c: DraftContext): string {
  const d = getBookingDraft(key);
  return mailtoDraft(to, d.subject, d.body(c));
}

/** Whole business days a message has been waiting. Weekends do not count,
 *  because the promise is one BUSINESS day and a Saturday-old message is not
 *  late. Same rule as lib/reply-watch.ts. */
export function businessDaysWaiting(createdAt: string, now = new Date()): number {
  const from = new Date(createdAt);
  if (now <= from) return 0;
  let days = 0;
  const cur = new Date(from.getTime());
  cur.setUTCHours(0, 0, 0, 0);
  const end = new Date(now.getTime());
  end.setUTCHours(0, 0, 0, 0);
  while (cur < end) {
    cur.setUTCDate(cur.getUTCDate() + 1);
    const d = cur.getUTCDay();
    if (d !== 0 && d !== 6) days += 1;
  }
  return days;
}


/* HOW LONG REPLIES ACTUALLY TAKE.
 *
 * Every page carrying a form promises "a reply within one business day". Until
 * `handledAt` was added on 2026-08-23 there was no way to check that even
 * privately — `handled` was a boolean, so the site made a claim nothing could
 * verify.
 *
 * Reports nothing until there are at least five answered messages with a
 * timestamp. A median drawn from two replies is not a median, and a practice
 * that starts quoting a response time on the strength of one good week will
 * eventually quote one it cannot keep.
 */
export type ReplyTimeStats = {
  /** Answered messages that have a handledAt to measure. */
  sample: number;
  medianHours: number;
  withinOneBusinessDay: number;
  ready: boolean;
};

export function replyTimeStats(items: { createdAt: string; handledAt?: string }[]): ReplyTimeStats {
  const hours = items
    .filter((i) => i.handledAt)
    .map((i) => (new Date(i.handledAt as string).getTime() - new Date(i.createdAt).getTime()) / 3_600_000)
    .filter((h) => h >= 0)
    .sort((a, b) => a - b);

  if (hours.length === 0) {
    return { sample: 0, medianHours: 0, withinOneBusinessDay: 0, ready: false };
  }
  const mid = Math.floor(hours.length / 2);
  const median = hours.length % 2 ? hours[mid] : (hours[mid - 1] + hours[mid]) / 2;
  /* One business day, generously: anything answered inside 24 hours counts,
     which is the promise a reader would understand from the wording. */
  const within = hours.filter((h) => h <= 24).length;
  return {
    sample: hours.length,
    medianHours: Math.round(median * 10) / 10,
    withinOneBusinessDay: within,
    ready: hours.length >= 5,
  };
}
