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
      `<li style="margin:0 0 14px;"><strong style="color:#1f3d4d;">${esc(c.q)}</strong><br>
       <span style="color:#5a6470;font-size:14px;">${esc(c.why)}</span></li>`
    ).join('') +
    `</ol>` +
    p(`The longer version, with the insurer-by-insurer table, is ${a(links.coverage, 'on the site')}.`) +
    p('That is everything — this is a one-off, not a sequence, and there is nothing else coming.') +
    btn(links.book, 'Book a free 15-minute consultation') +
    p('<span style="color:#5a6470;font-size:14px;">No obligation, and deciding not to book is a completely normal outcome.</span>')
  );

  return { subject: 'Your coverage checklist', text, html };
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
    p('<span style="color:#5a6470;font-size:14px;">If you are in immediate danger call 911. For urgent mental-health support in BC, call or text <strong>9-8-8</strong> at any hour.</span>')
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
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f7f5f1;border-radius:8px;padding:14px 18px;width:100%;">
       <tr><td style="font-size:14px;line-height:1.7;color:#22262b;">
       <strong style="color:#1f3d4d;">Current consultation hours</strong><br>
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
    `Page:   ${item.source}`,
    `Time:   ${new Date(item.createdAt).toLocaleString('en-CA', { timeZone: 'America/Vancouver' })}`,
    '',
    ...(item.message ? ['Message:', '', item.message, ''] : []),
    `Reply directly to this email to answer them.`,
  ];

  const html = shell(
    KIND_LABEL[item.kind],
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">
      <tr><td style="color:#6b7280;padding-right:14px;">Name</td><td>${esc(item.name || '(not given)')}</td></tr>
      <tr><td style="color:#6b7280;padding-right:14px;">Email</td><td><a href="mailto:${esc(item.email)}" style="color:#1f3d4d;">${esc(item.email)}</a></td></tr>
      ${item.windows ? `<tr><td style="color:#6b7280;padding-right:14px;">Windows</td><td>${esc(item.windows)}</td></tr>` : ''}
      <tr><td style="color:#6b7280;padding-right:14px;">Page</td><td>${esc(item.source)}</td></tr>
     </table>` +
    (item.message
      ? `<div style="background:#f7f5f1;border-radius:8px;padding:16px 18px;margin:0 0 18px;font-size:15px;line-height:1.65;white-space:pre-wrap;">${esc(item.message)}</div>`
      : '') +
    p('<span style="color:#5a6470;font-size:14px;">Reply directly to this email to answer them.</span>')
  );

  return {
    /* No name, no message, no service in the subject — a practice inbox is
     * still an inbox and may be read on a phone in public. */
    subject: `${KIND_LABEL[item.kind]} — Westpeak Wellness`,
    text: wrap(lines.join('\n')),
    html,
  };
}
