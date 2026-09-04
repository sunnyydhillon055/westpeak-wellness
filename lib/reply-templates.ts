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

The next step, if you want it, is a free 15-minute consultation by video. It is
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
    key: 'waitlist',
    label: 'I am full, waitlist?',
    when: 'No capacity right now, but it would otherwise be a fit.',
    subject: 'Re: your message',
    body: (i) => `${greeting(i)}

Thank you for writing.

I want to be honest about timing rather than book you into something distant
and vague: I do not have regular openings at the moment. [: add the real
picture: roughly when you expect one, if you know. ]

Two options, and neither is better than the other:

If you are happy to wait, tell me roughly when you are free during a week and I
will get in touch directly when something opens that fits. It is a real list
rather than a formality, and there is no obligation attached to being on it.

If waiting is not workable, and for a lot of people it is not. These are
genuinely good places to look now:
  ${site.domain}/resources/low-cost-counselling-bc
  ${site.domain}/guides/how-to-find-a-therapist-in-bc

Either way, thank you for asking. Doing that is usually the hardest part.

`,
  },
];

export const getTemplate = (key: string) => REPLY_TEMPLATES.find((t) => t.key === key);

/** A mailto: URL with the draft already in it. */
export function mailtoFor(i: Inbound, key: string): string {
  const t = getTemplate(key);
  if (!t) return `mailto:${i.email}`;
  const params = new URLSearchParams({ subject: t.subject, body: t.body(i) });
  /* URLSearchParams encodes spaces as "+", which mail clients render literally
     in a body. Percent-encoding is what they actually expect. */
  return `mailto:${i.email}?${params.toString().replace(/\+/g, '%20')}`;
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
