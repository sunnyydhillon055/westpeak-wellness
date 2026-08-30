import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links } from '@/lib/booking-mail';
import type { Inbound } from '@/lib/inbound';

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
    why: 'The one that catches most people. Plans list professions, not services — a plan can cover "Psychologist" and "Registered Social Worker" and not RCCs, and then no amount of it being obviously counselling makes it reimbursable.',
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
    why: 'The most commonly missed source of coverage. An HSA usually covers counselling even when the core plan does not list RCCs.',
  },
  {
    q: 'Do you accept direct billing for RCCs, or do I pay and submit?',
    why: 'Direct billing is uncommon for RCCs in BC. Expect to pay and submit a receipt.',
  },
  {
    q: 'What does a receipt need to show for the claim to go through?',
    why: 'Practitioner name, designation, registration number, practice details, date, amount, service. A missing registration number is the single most common reason a claim bounces.',
  },
];

export function checklistEmail(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Here is the checklist you asked for — the questions worth asking your
extended health plan before booking counselling with anyone, not just
with this practice.

Call the number on your benefits card and ask these in order. Note down
who you spoke to.

${CHECKLIST.map((c, i) => `${i + 1}. ${c.q}\n   ${c.why}`).join('\n\n')}

The longer version, with the insurer-by-insurer table, is here:
${links.coverage}

That is everything — this is a one-off, not a sequence, and there is
nothing else coming.

If you would like to talk any of it through, a free 15-minute
consultation carries no obligation:
${links.book}

${site.name}
Online counselling across British Columbia
${site.domain}`);

  const html = shell(
    'Your coverage checklist',
    p(esc(hi)) +
    p('These are the questions worth asking your extended health plan before booking counselling with anyone — not just with this practice. Call the number on your benefits card, ask them in order, and note down who you spoke to.') +
    `<ol style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.6;">` +
    CHECKLIST.map((c) =>
      `<li style="margin:0 0 14px;"><strong style="color:#3d6c92;">${esc(c.q)}</strong><br>
       <span style="color:#545e69;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    p(`The longer version, with the insurer-by-insurer table, is ${a(links.coverage, 'on the site')}.`) +
    p('That is everything — this is a one-off, not a sequence, and there is nothing else coming.') +
    btn(links.book, 'Book a free 15-minute consultation') +
    p('<span style="color:#545e69;font-size:14px;">No obligation, and deciding not to book is a completely normal outcome.</span>')
  );

  return { subject: 'Your coverage checklist', text, html };
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

export function icbcEmail(firstName: string) {
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

That is everything \u2014 this is a one-off, not a sequence, and there is
nothing else coming.`
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
    p('That is everything \u2014 this is a one-off, not a sequence, and there is nothing else coming.') +
    btn(links.book, 'Book a free 15-minute consultation') +
    p('<span style="color:#545e69;font-size:14px;">No obligation, and deciding not to book is a completely normal outcome.</span>')
  );

  return { subject: 'The ICBC counselling entitlement', text, html };
}

/* ---- how to start counselling in BC, on one page -------------------------- */

/* Sourced from /guides/what-to-expect-first-therapy-session,
 * /guides/questions-to-ask-a-therapist and /pricing rather than written
 * fresh, so the email and the pages cannot drift apart. Deliberately generic
 * about fees — dollar figures live in Cliniko and on /pricing, and a stale
 * number in an email someone saved is worse than a link. */
const STARTING: { q: string; why: string }[] = [
  {
    q: 'Name what you want help with — one sentence is enough.',
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
    q: 'Use the free consultations — plural.',
    why: 'Fit between you and the counsellor is one of the better-supported predictors of whether therapy helps. Talking to two or three people before choosing is normal, slightly awkward, and entirely reasonable.',
  },
  {
    q: 'Ask direct questions on that call.',
    why: 'Training and registration, experience with what you are bringing, fees and cancellation terms, and what a typical session looks like. A good counsellor welcomes all of these.',
  },
  {
    q: 'Expect the first session to be mostly questions.',
    why: 'History, what brings you in, what you want to be different, and logistics. You are not expected to open with the hardest thing — and you are allowed to decide afterwards that the fit is wrong.',
  },
  {
    q: 'Review honestly after a few sessions.',
    why: 'Therapy should hold up to the same question as anything else you pay for: is this helping? Raising doubts with the counsellor is part of the work, and changing counsellors is common and not rude.',
  },
];

export function startingEmail(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Here is the one-pager you asked for — how to start counselling in BC,
from first thought to first session. It applies with any counsellor,
not just this practice.

${STARTING.map((c, i) => `${i + 1}. ${c.q}\n   ${c.why}`).join('\n\n')}

Current fees and how reimbursement works are here:
${site.domain}/pricing

That is everything — this is a one-off, not a sequence, and there is
nothing else coming.

If you would like to talk any of it through, a free 15-minute
consultation carries no obligation:
${links.book}

${site.name}
Online counselling across British Columbia
${site.domain}`);

  const html = shell(
    'Starting counselling in BC',
    p(esc(hi)) +
    p('Here is the one-pager you asked for — how to start counselling in BC, from first thought to first session. It applies with any counsellor, not just this practice.') +
    `<ol style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.6;">` +
    STARTING.map((c) =>
      `<li style="margin:0 0 14px;"><strong style="color:#3d6c92;">${esc(c.q)}</strong><br>
       <span style="color:#545e69;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    p(`Current fees and how reimbursement works are ${a(`${site.domain}/pricing`, 'on the fees page')}.`) +
    p('That is everything — this is a one-off, not a sequence, and there is nothing else coming.') +
    btn(links.book, 'Book a free 15-minute consultation') +
    p('<span style="color:#545e69;font-size:14px;">No obligation, and deciding not to book is a completely normal outcome.</span>')
  );

  return { subject: 'Starting counselling in BC — the one-pager', text, html };
}

/* ---- acknowledgement of a message ---------------------------------------- */

export function enquiryAck(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Thank you for writing. Your message has reached the practice and you
will have a reply within one business day.

Nothing further is needed from you in the meantime.

Two things worth knowing, because they are the questions that usually
come next:

  What sessions cost, and how extended health works
  ${links.pricing}

  How this practice works, and what is outside its scope
  ${links.standards}

If you would rather just pick a time, the free 15-minute consultation
is here and carries no obligation:
${links.book}

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}
Online counselling across British Columbia`);

  const html = shell(
    'Your message has arrived',
    p(esc(hi)) +
    p('Thank you for writing. Your message has reached the practice and you will have a reply <strong>within one business day</strong>. Nothing further is needed from you in the meantime.') +
    p(`Two things that usually come up next: ${a(links.pricing, 'what sessions cost and how extended health works')}, and ${a(links.standards, 'how this practice works')}.`) +
    btn(links.book, 'Or pick a time for a free consultation') +
    p('<span style="color:#545e69;font-size:14px;">If you are in immediate danger call 911. For urgent mental-health support in BC, call or text <strong>9-8-8</strong> at any hour.</span>')
  );

  return { subject: 'We have your message — Westpeak Wellness', text, html };
}

/* ---- acknowledgement of a waitlist request -------------------------------- */

export function waitlistAck(firstName: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';

  const text = wrap(
`${hi}

Thank you — your availability is noted.

The practice runs a small number of hours, so this is a real waitlist
rather than a formality: when something opens that fits the times you
gave, you will hear directly, and the note goes to a person rather than
into a queue.

Current consultation hours, in case something here does work after all:

${site.availability.map((v) => `  ${v.day} — ${v.from} to ${v.to}`).join('\n')}

  ${links.book}

If your situation changes or becomes urgent, reply to this email and
say so.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${site.name}`);

  const html = shell(
    'Your availability is noted',
    p(esc(hi)) +
    p('Thank you — your availability is noted.') +
    p('The practice runs a small number of hours, so this is a real waitlist rather than a formality. When something opens that fits the times you gave, you will hear directly.') +
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f7f2e8;border-radius:8px;padding:14px 18px;width:100%;">
       <tr><td style="font-size:14px;line-height:1.7;color:#2b3138;">
       <strong style="color:#3d6c92;">Current consultation hours</strong><br>
       ${site.availability.map((v) => `${esc(v.day)} &mdash; ${esc(v.from)} to ${esc(v.to)}`).join('<br>')}
       </td></tr></table>` +
    btn(links.book, 'See live availability') +
    p('If your situation changes or becomes urgent, replying here reaches the practice directly.')
  );

  return { subject: 'Your availability is noted — Westpeak Wellness', text, html };
}

/* ---- the alert to the practice ------------------------------------------- */

const KIND_LABEL: Record<Inbound['kind'], string> = {
  enquiry: 'New enquiry',
  waitlist: 'Waitlist request',
  lead: 'Coverage checklist requested',
};

export function practiceAlert(item: Inbound) {
  /* The only place a person's own words are reproduced. This goes to the
   * practice inbox and nowhere else. */
  const lines = [
    `${KIND_LABEL[item.kind]}`,
    '',
    `Name:   ${item.name || '(not given)'}`,
    `Email:  ${item.email}`,
    ...(item.windows ? [`Windows: ${item.windows}`] : []),
    /* A number only appears here when the person asked to be phoned. It stays
     * out of the subject and the preheader for the same reason the message
     * does — those two lines are visible without opening the email. */
    ...(item.phone ? [`Phone:  ${item.phone}  (asked to be called)`] : []),
    ...(item.callWindow ? [`Call:   ${item.callWindow}`] : []),
    `Page:   ${item.source}`,
    `Time:   ${new Date(item.createdAt).toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}`,
    '',
    ...(item.message ? ['Message:', '', item.message, ''] : []),
    `Reply directly to this email to answer them.`,
  ];

  const html = shell(
    KIND_LABEL[item.kind],
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">
      <tr><td style="color:#545e69;padding-right:14px;">Name</td><td>${esc(item.name || '(not given)')}</td></tr>
      <tr><td style="color:#545e69;padding-right:14px;">Email</td><td><a href="mailto:${esc(item.email)}" style="color:#3d6c92;">${esc(item.email)}</a></td></tr>
      ${item.windows ? `<tr><td style="color:#545e69;padding-right:14px;">Windows</td><td>${esc(item.windows)}</td></tr>` : ''}
      ${item.phone ? `<tr><td style="color:#545e69;padding-right:14px;">Phone</td><td><a href="tel:${esc(item.phone.replace(/[^\d+]/g, ''))}" style="color:#3d6c92;">${esc(item.phone)}</a> <span style="color:#545e69;">&mdash; asked to be called</span></td></tr>` : ''}
      ${item.callWindow ? `<tr><td style="color:#545e69;padding-right:14px;">Best time</td><td>${esc(item.callWindow)}</td></tr>` : ''}
      <tr><td style="color:#545e69;padding-right:14px;">Page</td><td>${esc(item.source)}</td></tr>
     </table>` +
    (item.message
      ? `<div style="background:#f7f2e8;border-radius:8px;padding:16px 18px;margin:0 0 18px;font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(item.message)}</div>`
      : '') +
    p('<span style="color:#545e69;font-size:14px;">Reply directly to this email to answer them.</span>'),
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
    subject: `${KIND_LABEL[item.kind]} — Westpeak Wellness`,
    text: wrap(lines.join('\n')),
    html,
  };
}
