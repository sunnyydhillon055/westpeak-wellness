import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links, tagMail } from '@/lib/booking-mail';
import type { Inbound } from '@/lib/inbound';
import { LOOKING, WHERE, TIMING, labelOf } from '@/lib/enquiry-fields';
import { rosterLines, rosterText, rosterButtons, type RosterLine } from '@/lib/lead-roster';
import { magnetWords, SEQUENCE_PROMISE } from '@/lib/nurture-plan';
import { answeredLink } from '@/lib/answered-link';
import { WHO_SEES_A_CLAIM } from '@/lib/practice-facts';
import { consultDaysLine, PACIFIC } from '@/lib/availability-summary';

/* WHAT EVERY EMAIL 1 NOW ENDS WITH — 1 Oct 2026.
 *
 * All three said "a one-off, not a sequence, and there is nothing else
 * coming", and lib/nurture.ts then sent two more. Under CASL the consent is to
 * what the person was told, so the words now match NURTURE_SEQUENCE.md and the
 * unsubscribe that stops the other two is in the first email, not only in
 * them. The bare /book button became the two counsellors by name, each
 * linking her own calendar (lib/lead-roster.ts).
 *
 * `unsub` is passed in by the caller (lib/inbound-submit.ts) rather than
 * imported from lib/nurture.ts, which imports this file's neighbours and
 * would make a cycle. */
export type LeadMailOptions = {
  /** One-click unsubscribe for the two emails that follow. */
  unsub?: string;
  /** Who to offer. Defaults to the accepting, bookable roster. */
  roster?: RosterLine[];
};

const leadEndingText = (o: LeadMailOptions) => {
  const roster = o.roster ?? rosterLines();
  return [
    `That is everything you asked for. ${SEQUENCE_PROMISE}`,
    ...(o.unsub ? [`Not wanted? One click stops them: ${o.unsub}`] : []),
    '',
    roster.length
      ? `If you would like to talk any of it through, a free 30-minute\nconsultation carries no obligation. Each counsellor's own calendar:\n\n${rosterText(roster)}`
      : `If you would like to talk any of it through, a free 30-minute\nconsultation carries no obligation:\n${links.book}`,
  ].join('\n');
};

const leadEndingHtml = (o: LeadMailOptions) => {
  const roster = o.roster ?? rosterLines();
  return (
    p(`That is everything you asked for. ${esc(SEQUENCE_PROMISE)}` +
      (o.unsub ? ` <span style="color:#545e69;font-size:14px;">Not wanted? ${a(o.unsub, 'One click stops them')}.</span>` : '')) +
    (roster.length
      ? p('If you would like to talk any of it through, a free 30-minute consultation carries no obligation. Each counsellor&rsquo;s own calendar:') + rosterButtons(roster)
      : btn(links.book, 'Book a free 30-minute consultation')) +
    p('<span style="color:#545e69;font-size:14px;">No obligation, and deciding not to book is a completely normal outcome.</span>')
  );
};

/* Mail for the three inbound paths: the checklist someone asked for, the
 * acknowledgement of a message, and the alert to the practice.
 *
 * REPLY-TO, NOT FROM. Every acknowledgement below sets the practice address as
 * reply-to so that hitting reply reaches a person. This is the exact failure
 * that made Cliniko's own confirmations useless — see the header comment in
 * lib/booking-mail.ts — and it would be careless to rebuild it here.
 *
 * TONE. Someone writing to a counselling practice for the first time has
 * usually spent a while deciding to. The acknowledgements say what happens
 * next and stop; no marketing, no "meanwhile, here's our newsletter", nothing
 * that treats a person in difficulty as a lead being worked.
 *
 * WHAT NEVER GOES IN A SUBJECT LINE. Not the message body, not the name of a
 * concern, not the service. Subject lines show on lock screens and in shared
 * inboxes. The alert to the practice is the one exception where the body is
 * included in full — it goes to the practice's own inbox and is the entire
 * point of the alert.
 */

/* ---- the coverage checklist, which is the thing people actually asked for -- */

/* Sourced from /resources/bc-extended-health-coverage-for-counselling rather
 * than written fresh, so the email and the page cannot drift apart. If the
 * page changes materially, change these with it. */
const CHECKLIST: { q: string; why: string }[] = [
  {
    q: 'Does my plan reimburse a Registered Clinical Counsellor (RCC) in British Columbia?',
    why: 'The one that catches most people. Plans list professions, not services. A plan can cover "Psychologist" and "Registered Social Worker" and not RCCs, and then no amount of it being obviously counselling makes it reimbursable.',
  },
  {
    q: 'What is my annual maximum for mental-health practitioners, and when does it reset?',
    why: 'Usually a dollar cap per calendar year, resetting 1 January rather than on your hire date.',
  },
  {
    q: 'Is there a per-session limit as well as an annual one?',
    why: 'A plan can reimburse $80 a session with annual room left over, which leaves $60 out of pocket on a $140 session.',
  },
  {
    q: 'Do you pay a percentage or the full amount up to the cap?',
    why: '80% is common. It changes what you actually pay per session.',
  },
  {
    q: 'Is the limit shared with psychology or social work?',
    why: 'A combined pool means seeing two practitioners halves your effective coverage.',
  },
  {
    q: 'Do I have a health spending account, and can it be used for counselling?',
    why: 'The most commonly missed source. Whether an HSA can be used for counselling with an RCC is set by how your plan is written, including when the core plan does not list RCCs, so ask rather than assume.',
  },
  {
    q: 'Do you accept direct billing for RCCs, or do I pay and submit?',
    why: 'This practice does not direct-bill: you pay when you book and submit the receipt, which carries the registration number your plan asks for.',
  },
  {
    q: 'What does a receipt need to show for the claim to go through?',
    why: 'Practitioner name, designation, registration number, practice details, date, amount, service. A missing registration number is the single most common reason a claim bounces.',
  },
];

export function checklistEmail(firstName: string, o: LeadMailOptions = {}) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Here is the checklist you asked for, the questions worth asking your
extended health plan before booking counselling with anyone, not just
with this practice.

Call the number on your benefits card and ask these in order. Note down
who you spoke to.

${CHECKLIST.map((c, i) => `${i + 1}. ${c.q}\n   ${c.why}`).join('\n\n')}

${WHO_SEES_A_CLAIM}

The longer version, with the insurer-by-insurer table, is here:
${links.coverage}

${leadEndingText(o)}

${site.name}
Online counselling across British Columbia
${site.domain}`);

  const html = shell(
    'Your coverage checklist',
    p(esc(hi)) +
    p('These are the questions worth asking your extended health plan before booking counselling with anyone, not just with this practice. Call the number on your benefits card, ask them in order, and note down who you spoke to.') +
    `<ol style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.6;">` +
    CHECKLIST.map((c) =>
      `<li style="margin:0 0 14px;"><strong style="color:#3d6c92;">${esc(c.q)}</strong><br>
       <span style="color:#545e69;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    /* Item 393: what an insurer and an employer see, from lib/practice-facts.ts. */
    p(esc(WHO_SEES_A_CLAIM)) +
    p(`The longer version, with the insurer-by-insurer table, is ${a(links.coverage, 'on the site')}.`) +
    leadEndingHtml(o),
    'Eight questions to ask your plan before booking counselling with anyone',
  );

  return tagMail({ subject: 'Your coverage checklist', text, html }, 'magnet');
}


/* ---- the ICBC entitlement, which almost nobody knows they have ------------ */

/* SECOND LEAD MAGNET, AND A DELIBERATELY UNSELFISH ONE.
 *
 * Anyone injured in a crash in BC is pre-approved for twelve counselling
 * sessions with a Registered Clinical Counsellor in the first twelve weeks,
 * with no doctor's note needed to start. It is the largest funded stream for
 * counselling in the province and the overwhelming majority of people entitled
 * to it never use it, because nobody tells them.
 *
 * THE HONEST CONSTRAINT, WHICH IS ALSO WHY THIS WORKS.
 *
 * A provider has to be registered with ICBC for the pre-approved route to be
 * billed directly, and this practice is not currently on that list. So this
 * email tells people how to use the entitlement with ANY counsellor, and says
 * so plainly. Implying the twelve sessions can be used here today would be a
 * lie that unravels at the first phone call — and a one-pager that genuinely
 * helps somebody claim what they are owed elsewhere is worth more, to a
 * practice built on being straight with people, than one that does not.
 */
const ICBC_STEPS: { q: string; why: string }[] = [
  {
    q: 'Open a claim with ICBC, if you have not already.',
    why: 'The entitlement attaches to a claim. You can open one online or by phone, and doing so does not commit you to any decision about the rest of the claim.',
  },
  {
    q: 'Ask for the pre-approved treatment for counselling.',
    why: 'Twelve sessions with a Registered Clinical Counsellor within the first twelve weeks of the crash. No doctor\u2019s note is required to begin, which is the part almost nobody is told.',
  },
  {
    q: 'Find a counsellor registered with ICBC as a vendor.',
    why: 'Not every counsellor is, including this practice at present. Ask the question before the first session rather than after it \u2014 a registered provider can usually bill ICBC directly.',
  },
  {
    q: 'Check the clock, not the calendar.',
    why: 'The twelve weeks run from the date of the crash. If time has already passed, the sessions do not vanish \u2014 but the pre-approved route may need a treatment plan submitted instead, so ask rather than assume you are too late.',
  },
  {
    q: 'Keep every receipt, even where billing is direct.',
    why: 'A receipt needs the practitioner\u2019s name, designation, registration number, date, amount and service. A missing registration number is the most common reason a claim stalls.',
  },
  {
    q: 'If it is not a crash, there may still be a funded route.',
    why: 'The Crime Victim Assistance Program funds counselling after a violent crime, employer assistance programmes cover a set number of sessions, and many extended health plans reimburse an RCC directly.',
  },
];

export function icbcEmail(firstName: string, o: LeadMailOptions = {}) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Here is the one-pager you asked for \u2014 how the ICBC counselling
entitlement works, and how to actually use it.

The short version: if you were injured in a crash in British Columbia,
you are pre-approved for twelve counselling sessions with a Registered
Clinical Counsellor in the first twelve weeks, and you do not need a
doctor\u2019s note to start.

One thing worth saying plainly: this practice is not currently registered
with ICBC as a vendor, so those pre-approved sessions cannot be billed
here. This is written so you can use the entitlement wherever you like.
It is yours either way.

${ICBC_STEPS.map((c, i) => `${i + 1}. ${c.q}\n   ${c.why}`).join('\n\n')}

${leadEndingText(o)}

${site.name}
Online counselling across British Columbia
${site.domain}`
  );

  const html = shell(
    'The ICBC counselling entitlement',
    p(esc(hi)) +
    p('Here is the one-pager you asked for \u2014 how the ICBC counselling entitlement works, and how to actually use it.') +
    p('<strong>The short version:</strong> if you were injured in a crash in British Columbia, you are pre-approved for <strong>twelve counselling sessions</strong> with a Registered Clinical Counsellor in the first twelve weeks, and <strong>no doctor\u2019s note is required</strong> to start.') +
    p('<span style="color:#545e69;font-size:14px;">One thing worth saying plainly: this practice is <strong>not</strong> currently registered with ICBC as a vendor, so those pre-approved sessions cannot be billed here. This is written so you can use the entitlement wherever you like \u2014 it is yours either way.</span>') +
    `<ol style="padding-left:18px;margin:18px 0;">` +
    ICBC_STEPS.map((c) =>
      `<li style="margin:0 0 14px;"><strong style="color:#3d6c92;">${esc(c.q)}</strong><br>
       <span style="color:#545e69;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    leadEndingHtml(o),
    'How the twelve pre-approved sessions work, and how to use them with any counsellor',
  );

  return tagMail({ subject: 'The ICBC counselling entitlement', text, html }, 'magnet');
}

/* ---- how to start counselling in BC, on one page -------------------------- */

/* Sourced from /guides/what-to-expect-first-therapy-session,
 * /guides/questions-to-ask-a-therapist and /pricing rather than written
 * fresh, so the email and the pages cannot drift apart. Deliberately generic
 * about fees — dollar figures live in Cliniko and on /pricing, and a stale
 * number in an email someone saved is worse than a link. */
const STARTING: { q: string; why: string }[] = [
  {
    q: 'Name what you want help with. One sentence is enough.',
    why: '"I keep snapping at people I love" is a complete answer. A diagnosis, a theory, or a tidy story is not required to start, and arriving without one is the normal case.',
  },
  {
    q: 'Check your extended health plan before you book.',
    why: 'Plans list professions, not services. Confirm the plan reimburses a Registered Clinical Counsellor (RCC) in BC, and ask what the annual maximum is. MSP does not cover private counselling.',
  },
  {
    q: 'Shortlist two or three counsellors, and check each one in a public register.',
    why: 'BCACC, the College of Health and Care Professionals of BC, and the BC College of Social Workers each run a free searchable register. A registration number that checks out is a stronger signal than any website.',
  },
  {
    q: 'Use the free consultations, plural.',
    why: 'Fit between you and the counsellor is one of the better-supported predictors of whether therapy helps. Talking to two or three people before choosing is normal, slightly awkward, and entirely reasonable.',
  },
  {
    q: 'Ask direct questions on that call.',
    why: 'Training and registration, experience with what you are bringing, fees and cancellation terms, and what a typical session looks like. A good counsellor welcomes all of these.',
  },
  {
    q: 'Expect the first session to be mostly questions.',
    why: 'History, what brings you in, what you want to be different, and logistics. You are not expected to open with the hardest thing, and you are allowed to decide afterwards that the fit is wrong.',
  },
  {
    q: 'Review honestly after a few sessions.',
    why: 'Therapy should hold up to the same question as anything else you pay for: is this helping? Raising doubts with the counsellor is part of the work, and changing counsellors is common and not rude.',
  },
];

export function startingEmail(firstName: string, o: LeadMailOptions = {}) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Here is the one-pager you asked for: how to start counselling in BC,
from first thought to first session. It applies with any counsellor,
not just this practice.

${STARTING.map((c, i) => `${i + 1}. ${c.q}\n   ${c.why}`).join('\n\n')}

Current fees and how reimbursement works are here:
${site.domain}/pricing

${leadEndingText(o)}

${site.name}
Online counselling across British Columbia
${site.domain}`);

  const html = shell(
    'Starting counselling in BC',
    p(esc(hi)) +
    p('Here is the one-pager you asked for: how to start counselling in BC, from first thought to first session. It applies with any counsellor, not just this practice.') +
    `<ol style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.6;">` +
    STARTING.map((c) =>
      `<li style="margin:0 0 14px;"><strong style="color:#3d6c92;">${esc(c.q)}</strong><br>
       <span style="color:#545e69;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    p(`Current fees and how reimbursement works are ${a(`${site.domain}/pricing`, 'on the fees page')}.`) +
    leadEndingHtml(o),
    'From first thought to first session, in seven steps that apply with any counsellor',
  );

  return tagMail({ subject: 'Starting counselling in BC, the one-pager', text, html }, 'magnet');
}

/* ---- acknowledgement of a message ---------------------------------------- */

/* WHO WILL REPLY — 1 Oct 2026.
 * When lib/inbound-routing.ts sends an enquiry to exactly one counsellor, the
 * acknowledgement says so by name and links her own calendar; the caller
 * also sets reply-to to her and info@. Routed to more than one, it keeps the
 * practice-wide wording, because naming one would be a guess. */
export type AckCounsellor = { who: string; bookHref: string };

/* HER NEXT FREE DAYS, SO THE PERSON CAN BOOK BEFORE THE REPLY — 3 Oct 2026.
 * One line per counsellor the enquiry was routed to, from
 * consultationAvailability() (Cliniko, Pacific time), days only. The 2 Oct
 * sender wanted to start "as soon as possible" and was told only that a reply
 * would come. A counsellor whose calendar could not be read gets no line. */
export type AckDays = { first: string; bookHref: string; days: string[] };

export function enquiryAck(firstName: string, by?: AckCounsellor, open: readonly AckDays[] = []) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const book = by?.bookHref ?? links.book;
  const dayLines = open.flatMap((o) => {
    const line = consultDaysLine(o.first, o.days);
    return line ? [{ ...o, line }] : [];
  });
  /* With one line its link is the button below; with two, each line carries
     her own calendar. */
  const daysText = dayLines.length
    ? `\n${dayLines.map((d) => (dayLines.length > 1 ? `${d.line}\n${d.bookHref}` : d.line)).join('\n\n')}\n`
    : '';
  const daysHtml = dayLines
    .map((d) => p(dayLines.length > 1 ? a(d.bookHref, d.line) : esc(d.line)))
    .join('');
  const replyText = by
    ? `Thank you for writing. Your message has reached the practice and\n${by.who}, will reply within one business day.`
    : 'Thank you for writing. Your message has reached the practice and you\nwill have a reply within one business day.';
  const replyHtml = by
    ? `Thank you for writing. Your message has reached the practice and <strong>${esc(by.who)}</strong>, will reply <strong>within one business day</strong>. Nothing further is needed from you in the meantime.`
    : 'Thank you for writing. Your message has reached the practice and you will have a reply <strong>within one business day</strong>. Nothing further is needed from you in the meantime.';

  const text = wrap(
`${hi}

${replyText}

Nothing further is needed from you in the meantime.

Two things worth knowing, because they are the questions that usually
come next:

  What sessions cost, and how extended health works
  ${links.pricing}

  How this practice works, and what is outside its scope
  ${links.standards}

If you would rather just pick a time, the free 30-minute consultation
is here and carries no obligation:${daysText}
${book}

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}
Online counselling across British Columbia`);

  const html = shell(
    'Your message has arrived',
    p(esc(hi)) +
    p(replyHtml) +
    p(`Two things that usually come up next: ${a(links.pricing, 'what sessions cost and how extended health works')}, and ${a(links.standards, 'how this practice works')}.`) +
    daysHtml +
    btn(book, 'Or pick a time for a free consultation') +
    p('<span style="color:#545e69;font-size:14px;">If you are in immediate danger call 911. For urgent mental-health support in BC, call or text <strong>9-8-8</strong> at any hour.</span>'),
    /* Who replies and by when, which is what the inbox list should say
       (1 Oct 2026); it repeated the heading. Her name without letters. */
    by
      ? `${by.who.split(',')[0].trim()} will reply within one business day`
      : 'The practice will reply within one business day',
  );

  return tagMail({ subject: 'We have your message | Westpeak Wellness', text, html }, 'ack');
}

/* ---- the alert to the practice ------------------------------------------- */

/* A lead alert names the one-pager asked for (1 Oct 2026): every one used to
   say "Coverage checklist requested", which was wrong for 39 of 60 September
   leads. */
const labelFor = (item: Pick<Inbound, 'kind' | 'magnet'>) =>
  item.kind === 'enquiry' ? 'New enquiry' : magnetWords(item.magnet).alert;

/* A ONE-TAP REPLY DRAFT FOR THE COUNSELLOR — 3 Oct 2026.
 * 0 of 34 enquiries were ever ticked in /admin, so replies are written from
 * this alert, not from the drafts in /admin. When an enquiry is routed to one
 * counsellor, the alert carries a mailto: link that opens her mail app with a
 * reply already addressed: the person's first name, her next three
 * consultation days (Cliniko, Pacific time, days only), her calendar and her
 * fees from the catalogue, narrowed to what she offers. It is a draft she
 * edits and sends herself; the site sends nothing. */
export type ReplyDraft = {
  /** The counsellor's first name, to sign with. */
  counsellor: string;
  /** Absolute /book?with=<slug>#calendar. */
  bookHref: string;
  days: string[];
  /** sessionFeesPhrase for her services, or null when the catalogue has none. */
  fees: string | null;
};

export const REPLY_SUBJECT = 'Re: your message to Westpeak Wellness';

export function replyDraftBody(firstName: string, d: ReplyDraft): string {
  const listed = d.days.length > 1 ? `${d.days.slice(0, -1).join(', ')} and ${d.days[d.days.length - 1]}` : d.days[0];
  return [
    firstName ? `Hi ${firstName},` : 'Hi,',
    '',
    'Thank you for your message.',
    '',
    listed
      ? `My next free 30-minute consultation days are ${listed}${PACIFIC}. You can choose a time here:`
      : 'You can choose a time for a free 30-minute consultation here:',
    d.bookHref,
    ...(d.fees ? ['', `After the consultation, sessions are ${d.fees}.`] : []),
    '',
    d.counsellor,
  ].join('\n');
}

export function replyDraftHref(to: string, firstName: string, d: ReplyDraft): string {
  const q = (s: string) => encodeURIComponent(s.replace(/\n/g, '\r\n'));
  return `mailto:${encodeURIComponent(to).replace(/%40/g, '@')}?subject=${q(REPLY_SUBJECT)}&body=${q(replyDraftBody(firstName, d))}`;
}

export function practiceAlert(item: Inbound, draft?: ReplyDraft) {
  /* Enquiries only: nobody replies to a one-pager request. Null when links
     cannot be signed (no PORTAL_SECRET), and then nothing is printed. */
  const answered = item.kind === 'enquiry' ? answeredLink(item.id) : null;
  const firstName = (item.name || '').trim().split(/\s+/)[0] ?? '';
  const reply = item.kind === 'enquiry' && draft ? replyDraftHref(item.email, firstName, draft) : null;
  /* The only place a person's own words are reproduced. This goes to the
   * practice inbox and nowhere else. */
  const lines = [
    `${labelFor(item)}`,
    '',
    `Name:   ${item.name || '(not given)'}`,
    `Email:  ${item.email}`,
    /* A number only appears here when the person asked to be phoned. It stays
     * out of the subject and the preheader for the same reason the message
     * does — those two lines are visible without opening the email. */
    ...(item.practitioner ? [`Asked for: ${item.practitioner}`] : []),
    ...(item.phone ? [`Phone:  ${item.phone}  (asked to be called)`] : []),
    ...(item.callWindow ? [`Call:   ${item.callWindow}`] : []),
    ...(item.looking ? [`For:    ${labelOf(LOOKING, item.looking)}`] : []),
    ...(item.where ? [`Where:  ${labelOf(WHERE, item.where)}`] : []),
    ...(item.timing ? [`When:   ${labelOf(TIMING, item.timing)}`] : []),
    `Page:   ${item.source}`,
    `Time:   ${new Date(item.createdAt).toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}`,
    '',
    ...(item.message ? ['Message:', '', item.message, ''] : []),
    `Reply directly to this email to answer them.`,
    ...(reply ? ['', 'Or reply with your next times (a draft opens; nothing is sent until you send it):', reply] : []),
    ...(answered ? ['', 'Once you have replied, mark it answered so the reply time is measured:', answered] : []),
  ];

  const html = shell(
    labelFor(item),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">
      <tr><td style="color:#545e69;padding-right:14px;">Name</td><td>${esc(item.name || '(not given)')}</td></tr>
      <tr><td style="color:#545e69;padding-right:14px;">Email</td><td><a href="mailto:${esc(item.email)}" style="color:#3d6c92;">${esc(item.email)}</a></td></tr>
      ${item.phone ? `<tr><td style="color:#545e69;padding-right:14px;">Phone</td><td><a href="tel:${esc(item.phone.replace(/[^\d+]/g, ''))}" style="color:#3d6c92;">${esc(item.phone)}</a> <span style="color:#545e69;">, asked to be called</span></td></tr>` : ''}
      ${item.callWindow ? `<tr><td style="color:#545e69;padding-right:14px;">Best time</td><td>${esc(item.callWindow)}</td></tr>` : ''}
      ${item.practitioner ? `<tr><td style="color:#545e69;padding-right:14px;">Asked for</td><td><strong>${esc(item.practitioner)}</strong></td></tr>` : ''}
      ${item.looking ? `<tr><td style="color:#545e69;padding-right:14px;">For</td><td><strong>${esc(labelOf(LOOKING, item.looking))}</strong></td></tr>` : ''}
      ${item.where ? `<tr><td style="color:#545e69;padding-right:14px;">Where</td><td>${esc(labelOf(WHERE, item.where))}${item.where === 'other' ? ' <span style="color:#a0522d;">, outside BC and Alberta</span>' : ''}</td></tr>` : ''}
      ${item.timing ? `<tr><td style="color:#545e69;padding-right:14px;">When</td><td>${esc(labelOf(TIMING, item.timing))}</td></tr>` : ''}
      <tr><td style="color:#545e69;padding-right:14px;">Page</td><td>${esc(item.source)}</td></tr>
     </table>` +
    (item.message
      ? `<div style="background:#f7f2e8;border-radius:8px;padding:16px 18px;margin:0 0 18px;font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(item.message)}</div>`
      : '') +
    p('<span style="color:#545e69;font-size:14px;">Reply directly to this email to answer them.</span>') +
    (reply ? btn(esc(reply), 'Reply with your next times') : '') +
    (answered
      ? p(`<span style="color:#545e69;font-size:14px;">Once you have replied, ${a(answered, 'mark it answered')} so the reply time is measured. The link opens /admin and nothing is recorded until you press the button there.</span>`)
      : ''),
    /* The inbox preview line, and it obeys the same rule as the subject above:
       no name, no message, no service. A preheader is displayed in exactly the
       list a subject is, so anything unsafe for one is unsafe for the other.
       The page and the time are not identifying, and they are what makes the
       difference between "another alert" and "worth opening now". */
    `Received ${new Date(item.createdAt).toLocaleString('en-CA', {
      timeZone: 'America/Vancouver', dateStyle: 'medium', timeStyle: 'short',
    })} · from ${item.source}`
  );

  return {
    /* No name, no message, no service in the subject — a practice inbox is
     * still an inbox and may be read on a phone in public. */
    /* Which one-pager goes in the body only: "ICBC" in a subject says
       somebody was in a crash. */
    subject: `${item.kind === 'enquiry' ? 'New enquiry' : 'One-pager requested'}: Westpeak Wellness`,
    text: wrap(lines.join('\n')),
    html,
  };
}
