import { site, bookingsPaidUrlFor } from '@/lib/site';
import { FALLBACK_CATALOG, money, type Catalog } from '@/lib/cliniko-catalog';
import { formatPacific } from '@/lib/pacific-time';
import { CAMERA_OPTIONAL } from '@/lib/practice-facts';

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
 * CORRECTED 2026-08-14. An earlier version of this comment claimed Cliniko has
 * no post-session follow-up at all. That was wrong -- Settings > Communication >
 * Follow-up messages exists (appointment_follow_up_templates), and the claim was
 * made from an incomplete list rather than from looking.
 *
 * The reason for sending our own is therefore only the envelope, not a missing
 * feature. If the from-address problem above ever stops mattering -- Cliniko
 * adding a custom sending domain, say -- then Cliniko's native follow-up is the
 * simpler option and this module should be retired rather than maintained.
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
  /* The paid calendar, direct.
   *
   * /book is filtered to the free consultation, so pointing a consult
   * attendee there sends them back to the thing they have already done. The
   * portal would work but costs them a sign-in at the exact moment they had
   * decided to go ahead.
   *
   * Linking the Cliniko paid calendar straight from the email is safe now in a
   * way it was not before: all five appointment types are online_payments_mode
   * "required", verified 2026-08-14, so nobody can take a $340 slot without
   * paying for it. That was the original reason for the filter, and it no
   * longer applies. */
  bookSession: site.bookingsPaidUrl,
  pricing: `${BASE}/pricing`,
  faq: `${BASE}/faq`,
  answers: `${BASE}/answers`,
  firstSession: `${BASE}/guides/what-to-expect-first-therapy-session`,
  /* The page written for the free call itself. Until 1 Oct 2026 consult
     bookers were sent to firstSession, the guide to a first PAID session,
     which describes an hour they have not booked. */
  consultPrep: `${BASE}/resources/before-your-first-consultation`,
  /* The in-language first-session guides, linked when the counsellor works
     in that language. Existing pages; nothing new is written in either. */
  firstSessionPa: `${BASE}/punjabi/guides/pehle-session-vich-ki-hunda-hai`,
  firstSessionTl: `${BASE}/tagalog/gabay/ano-ang-mangyayari-sa-unang-sesyon`,
  coverage: `${BASE}/resources/bc-extended-health-coverage-for-counselling`,
  standards: `${BASE}/standards`,
  privacy: `${BASE}/privacy`,
  contact: `${BASE}/contact`,
  guides: `${BASE}/guides`,
  /* portal, refer, punjabi and crisis were removed on 3 Sep 2026 — no email in
     this file or in lib/inbound-mail.ts referenced any of them. `coverage`
     looked equally dead from inside this file and is used twice by
     inbound-mail, which is the reason to grep the repository rather than the
     module. Adding one back is a single line. */
} as const;

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* WHICH AUTOMATED EMAIL A VISIT OR A PAID BOOKING CAME FROM — 1 Oct 2026.
 *
 * No link in any client email carried a source, and the paid-calendar links
 * went straight to Cliniko, so a click never touched the site: /admin could
 * not say whether the consult follow-up has ever opened a paid calendar.
 *
 * Two pieces. Every link to this site in a client email is tagged
 * ?utm_source=email&utm_campaign=<template> by tagMail(), applied once to a
 * builder's finished output, so no link can be missed by hand ('email' is on
 * CHANNELS in lib/conversion-detail-client.ts). And the paid-calendar links
 * go through /book/session (app/book/session/route.ts), which counts a
 * book_click with detail `email:<template>` and redirects to the same Cliniko
 * calendar as before. The template is one word from this fixed list; nothing
 * about the person is ever in a link. */
export const EMAIL_TEMPLATES = [
  'ack', 'magnet', 'nurture2', 'nurture3', 'confirm', 'remind', 'consult', 'after', 'missed', 'reactivation',
] as const;
export type EmailTemplate = (typeof EMAIL_TEMPLATES)[number];

/** The templates whose paid-calendar link goes through /book/session. */
export const SESSION_TEMPLATES: readonly EmailTemplate[] = ['consult', 'after', 'missed', 'reactivation'];

/* Not tagged: the unsubscribe and every other /api/ link (they are actions,
   not visits, and List-Unsubscribe must match the body link), and
   /book/session, which records its own source. */
const UNTAGGED = /^\/(api\/|book\/session)/;

/** One site URL with the email source added, before any #fragment. Any
 *  other URL is returned unchanged. */
export function tagged(url: string, template: EmailTemplate): string {
  if (!url.startsWith(BASE)) return url;
  const rest = url.slice(BASE.length);
  if (rest && !rest.startsWith('/') && !rest.startsWith('?') && !rest.startsWith('#')) return url;
  if (UNTAGGED.test(rest) || /[?&]utm_source=/.test(url)) return url;
  const hash = url.indexOf('#');
  const head = hash < 0 ? url : url.slice(0, hash);
  const frag = hash < 0 ? '' : url.slice(hash);
  return `${head}${head.includes('?') ? '&' : '?'}utm_source=email&utm_campaign=${template}${frag}`;
}

const BASE_PATTERN = BASE.replace(/[.*+?^$()|[\]\\/{}]/g, (c) => `\\${c}`);
const SITE_URL = new RegExp(BASE_PATTERN + '[^\\s"\'<>)]*', 'g');

/** Tags every link to this site in a finished email's text and HTML. A
 *  trailing full stop or comma in prose is left outside the link. */
export function tagMail<M extends { text: string; html: string }>(mail: M, template: EmailTemplate): M {
  const tag = (s: string) => s.replace(SITE_URL, (m) => {
    const tail = /[.,;:!?]+$/.exec(m)?.[0] ?? '';
    return tagged(m.slice(0, m.length - tail.length), template) + tail;
  });
  return { ...mail, text: tag(mail.text), html: tag(mail.html) };
}

/** The first-party link to a paid calendar: /book/session names the
 *  counsellor by roster slug, the paid type and the template, and redirects
 *  to bookingsPaidUrlFor(). The counsellor is named only when she has a
 *  Cliniko id, exactly as paidCalendarFor() narrowed before. */
export function sessionLink(
  pr: { slug?: string; clinikoPractitionerId?: string } | null | undefined,
  typeId: string | undefined,
  from: EmailTemplate,
): string {
  const q = new URLSearchParams();
  if (pr?.slug && pr.clinikoPractitionerId) q.set('with', pr.slug);
  if (typeId && /^\d{1,24}$/.test(typeId)) q.set('type', typeId);
  q.set('from', from);
  return `${BASE}/book/session?${q.toString()}`;
}

/* "Fri, Oct 9, 2:00 p.m.", in Vancouver time, for a subject or a preheader
   where the long form does not fit. Null when there is no date to format,
   and then the caller says nothing about the time rather than a guess. */
export function shortWhen(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  /* Through lib/pacific-time.ts, so a runtime with pre-1 Nov 2026 tz data
     still prints BC's UTC-7 clock in winter. */
  return formatPacific(d, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

/* Wrapped at 72 characters. Some mail clients hard-wrap plain text at 78 and
 * a paragraph that wraps twice reads as broken. */
export function wrap(s: string, width = 72): string {
  return s.split('\n').map((line) => {
    if (line.length <= width) return line;
    const out: string[] = [];
    let cur = '';
    for (const word of line.split(' ')) {
      /* `cur.trim()` guard: a word longer than the width on its own (a URL)
         used to push an empty line ahead of itself, so every long link in a
         plain-text email sat after a stray blank line. */
      if ((cur + ' ' + word).trim().length > width && cur.trim()) { out.push(cur.trim()); cur = word; }
      else cur += ' ' + word;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.join('\n');
  }).join('\n');
}

/* The shared HTML shell for every email this practice sends.
 *
 * TWO THINGS ADDED 2026-08-23, both invisible until they are missing.
 *
 * `color-scheme: light`: without it, Apple Mail and Outlook in dark mode
 * force-invert a light template. They do it crudely: backgrounds flip, inline
 * colours often do not, and the result is grey-on-grey text in a message from a
 * counsellor. Declaring the scheme means the client leaves it alone.
 *
 * The preheader is the grey line an inbox shows after the subject. With nothing
 * there, clients scrape the first text they find, which for these templates was
 * the words "Westpeak Wellness" followed by the heading again. It defaults to
 * the heading, so no existing caller has to change, and the zero-width spaces
 * stop a client dragging body copy into the preview after it. */
export const shell = (heading: string, body: string, preheader?: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:#faf7f1;">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
${esc(preheader ?? heading)}${'&#8203;&nbsp;'.repeat(60)}
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f1;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;padding:32px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2b3138;">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#545e69;">Westpeak Wellness</p>
<h1 style="margin:0 0 18px;font-size:21px;line-height:1.3;color:#3d6c92;">${esc(heading)}</h1>
${body}
<hr style="border:none;border-top:1px solid #e6ddce;margin:28px 0 16px;">
<p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:#545e69;">
Westpeak Wellness · Online counselling across British Columbia<br>
<a href="${links.contact}" style="color:#545e69;">Contact</a> ·
<a href="${links.privacy}" style="color:#545e69;">Privacy</a> ·
<a href="${links.standards}" style="color:#545e69;">Standards &amp; scope</a>
</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:#545e69;">
If you are in immediate danger call 911. For urgent mental-health support in
BC, call or text <strong>9-8-8</strong> at any hour.
</p>
</td></tr></table>
</td></tr></table>
</body></html>`;

export const btn = (href: string, label: string) =>
  `<p style="margin:0 0 22px;"><a href="${href}" style="display:inline-block;background:#3d6c92;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:6px;font-weight:600;font-size:15px;">${esc(label)}</a></p>`;

export const p = (html: string) =>
  `<p style="margin:0 0 15px;font-size:15px;line-height:1.65;">${html}</p>`;

export const a = (href: string, label: string) =>
  `<a href="${href}" style="color:#3d6c92;">${esc(label)}</a>`;

export type Booking = {
  firstName: string;
  email: string;
  /** Localised, already formatted for America/Vancouver. */
  whenText: string;
  /* Null when the booking did not say. Renders as nothing rather than as a
     guess. A confirmation that states the wrong length is worse than one that
     states no length. See the header of lib/booking-notify.ts for the 30 Aug
     2026 incident that made this nullable. */
  minutes: number | null;
  isConsult: boolean;
  /* WHO THE APPOINTMENT IS WITH, added 1 Oct 2026. Resolved by
     lib/booking-notify.ts from the practitioner link on the appointment and
     the Cliniko id on the roster. Absent when the counsellor is not on the
     roster, and then every template prints no name at all, never a guess
     and never "undefined". Kept to the few fields a template needs, so this
     file does not import the roster. */
  practitioner?: BookingPractitioner | null;
  /* Cliniko's Telehealth join link for this appointment, when Cliniko
     returns one. Null or absent renders no button: the client is then
     pointed at Cliniko's own email, as before. See telehealthUrlOf() in
     lib/booking-notify.ts for what is accepted. */
  telehealthUrl?: string | null;
  /* The Cliniko appointment-type id, 1 Oct 2026, so a paid rebook link opens
     the same type with the same counsellor. bookingsPaidUrlFor() ignores it
     unless it is a paid type. */
  typeId?: string;
  /* THE NEXT SESSION ALREADY BOOKED, for the paid follow-up: when it is, the
     email says when and with whom instead of offering a booking button. Null
     or absent means nothing is booked. */
  next?: { whenText: string; withName?: string; startsAt?: string } | null;
  /* The appointment's start as Cliniko gave it (ISO), 1 Oct 2026, so the
     subject and the inbox preview line can carry a short day and time
     (shortWhen). Absent: neither does, and the long whenText still shows. */
  startsAt?: string;
};

export type BookingPractitioner = {
  slug: string;
  /** 'Savneet Singh, RCC', from withLetters() on the roster. */
  nameWithLetters: string;
  firstName: string;
  /** English names of the languages she works in, roster order: en first. */
  languages: { tag: string; name: string }[];
  clinikoPractitionerId?: string;
  /* Her roster service slugs, 1 Oct 2026, so the consult follow-up offers
     only the paid types she does (firstSessionTypes). Absent: both. */
  services?: string[];
};

/* "English or Punjabi, or both". English alone stays "English". */
export function languagePhrase(langs: { name: string }[]): string {
  const names = [...new Set(langs.map((l) => l.name))];
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} or ${names[1]}, or both`;
  return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}, or a mix`;
}

/** "Savneet Singh, RCC · English or Punjabi, or both", or '' with no one. */
export function withLine(pr?: BookingPractitioner | null): string {
  if (!pr || !pr.nameWithLetters) return '';
  const langs = languagePhrase(pr.languages);
  return langs ? `${pr.nameWithLetters} · ${langs}` : pr.nameWithLetters;
}

/* The in-language first-session guide, when the counsellor works in Punjabi
   or Tagalog. English wording around the link; the page itself already
   exists in that language. */
export function inLanguageGuide(pr?: BookingPractitioner | null): { href: string; label: string } | null {
  const tags = new Set((pr?.languages ?? []).map((l) => l.tag.toLowerCase()));
  if (tags.has('pa')) return { href: links.firstSessionPa, label: 'What happens in a first session, in Punjabi' };
  if (tags.has('tl')) return { href: links.firstSessionTl, label: 'What happens in a first session, in Tagalog' };
  return null;
}

/** That counsellor's own paid calendar, or the practice-wide one; narrowed
 *  to one paid appointment type when `typeId` names one. */
export const paidCalendarFor = (pr?: BookingPractitioner | null, typeId?: string) =>
  bookingsPaidUrlFor(pr?.clinikoPractitionerId, typeId);

/* The camera sentence is /accessibility's, read from lib/practice-facts.ts
   (item 392, 2 Oct 2026): copy in the existing confirmation and reminder,
   no new mail and no change to when either is sent. */
const ONLINE_LINE =
  `This is an online appointment by secure video. There is no office to come to; join from somewhere private. ${CAMERA_OPTIONAL}`;

/* The cancellation terms for a PAID booking, worded as /pricing and the FAQ
   word them (24 hours from site.cancellationHours; 50% as published there).
   Never shown for the free consultation, where nothing is charged. */
export const paidCancellationTerms = () =>
  `Need to change or cancel? Reply to this email. Cancelling or moving it more than ${site.cancellationHours} hours ahead is refunded in full; inside ${site.cancellationHours} hours, or for a missed session, 50% of the fee is kept. There are exceptions for genuine emergencies.`;

/* The fees a consult attendee is weighing, read from the catalogue by
   appointment-type id and formatted with money(). Never typed here: change
   the catalogue and the email changes with it. A type missing from the
   catalogue drops its clause rather than printing a guess.

   SINCE 1 OCT 2026, ONLY HERS. The note named individual and couples fees to
   everybody, so a person who had just met Savneet, who offers individual
   counselling only, was quoted a couples fee she does not offer. With her
   roster services it names the first-session types she offers; without
   them (no roster match), both, as before. */
const INDIVIDUAL_TYPE = '1466854657459489533';
const COUPLES_TYPE = '1909558292636502700';
const FIRST_SESSION_TYPE: Record<string, string> = {
  'individual-therapy': INDIVIDUAL_TYPE,
  'punjabi-counselling': INDIVIDUAL_TYPE,
  'couples-therapy': COUPLES_TYPE,
};

/** The paid first-session types she offers that the catalogue prices, in
 *  catalogue order: individual, then couples. */
export function firstSessionTypes(catalog: Catalog = FALLBACK_CATALOG, services?: string[]) {
  const wanted = services
    ? new Set(services.map((s) => FIRST_SESSION_TYPE[s]).filter(Boolean))
    : new Set([INDIVIDUAL_TYPE, COUPLES_TYPE]);
  return [INDIVIDUAL_TYPE, COUPLES_TYPE]
    .filter((id) => wanted.has(id))
    .map((id) => catalog.items.find((i) => i.id === id && i.cents > 0))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
}

export function feeFacts(catalog: Catalog = FALLBACK_CATALOG, services?: string[]): string | null {
  const parts = firstSessionTypes(catalog, services)
    .map((i) => `${i.name.toLowerCase().replace(/ counselling$/, '')} counselling, ${i.minutes} minutes, is ${money(i.cents)}`);
  if (parts.length === 0) return null;
  const fees = parts.join('; ');
  return `${fees.charAt(0).toUpperCase()}${fees.slice(1)}. Cliniko takes the card when you book. Cancelling more than ${site.cancellationHours} hours ahead is refunded in full. The practice does not direct-bill: the receipt carries the registration number an insurer asks for, and whether your plan reimburses depends on the plan.`;
}

/* The video button, when the link is known. */
const joinBtn = (b: Booking) => (b.telehealthUrl ? btn(b.telehealthUrl, 'Join the video call') : '');

/* The ONLY two places a booking's length may be turned into words. Both take
   null and print no length at all rather than a guess. Nothing else in this
   file may interpolate b.minutes: scripts/booking-mapping.mjs fails the build
   if it finds a bare one, because a null rendered directly reads "null
   minutes" to a client. */

/** "30 minutes, by secure video", or just "by secure video". */
const lengthPhrase = (m: number | null) =>
  m ? `${m} minutes, by secure video` : 'by secure video';

/** "30 minutes · secure video", or just "secure video". */
const lengthChip = (m: number | null) =>
  m ? `${m} minutes &middot; secure video` : 'secure video';

/* ---- shared pieces, 1 Oct 2026 ------------------------------------------- */

/* "Is this online or in person?" was asked by a client the week this was
   written. The only "online" in these emails was the footer tagline. So the
   confirmation and the reminder now say it in the body, name who the
   appointment is with and in which languages, and, for a paid booking, state
   the cancellation terms the client agreed to on /pricing. */

const whenChip = (b: Booking) => {
  const who = withLine(b.practitioner);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f7f2e8;border-radius:8px;padding:16px 18px;width:100%;">
       <tr><td style="font-size:15px;line-height:1.6;">
         <strong style="color:#3d6c92;">${esc(b.whenText)}</strong><br>
         <span style="color:#545e69;">${lengthChip(b.minutes)}</span>${who ? `<br>
         <span style="color:#545e69;">With ${esc(who)}</span>` : ''}
       </td></tr></table>`;
};

const whenText = (b: Booking) => {
  const who = withLine(b.practitioner);
  return `  ${b.whenText}  (${lengthPhrase(b.minutes)})${who ? `\n  With ${who}` : ''}`;
};

/* THE INBOX PREVIEW LINE, 1 Oct 2026. shell() defaulted it to the heading
   and no client builder passed one, so every preview repeated the H1. For an
   appointment it now says what an inbox list should: when, with whom, and
   that it is by video. "Fri, Oct 9, 2:00 p.m. Pacific · with Camille Granda
   · secure video, no office". Her name without letters, which fit nowhere
   in a preview; the service never, by the same rule as the subject. */
const shortName = (pr?: BookingPractitioner | null) => (pr?.nameWithLetters ? pr.nameWithLetters.split(',')[0].trim() : '');
const apptPreheader = (b: Booking) => {
  const when = shortWhen(b.startsAt);
  const who = shortName(b.practitioner);
  return [when ? `${when} Pacific` : b.whenText, who ? `with ${who}` : '', 'secure video, no office'].filter(Boolean).join(' · ');
};

/* What to read first: the consultation page for the free call, the first
   full session guide for a paid one. */
const prepLink = (b: Booking) => (b.isConsult ? links.consultPrep : links.firstSession);

const changeLine = (b: Booking) =>
  b.isConsult ? 'Need to change or cancel? Just reply to this email.' : paidCancellationTerms();

/* ---- confirmation -------------------------------------------------------- */

export function confirmationEmail(b: Booking) {
  /* The day and time in the subject, 1 Oct 2026: the inbox list is where a
     person checks when it is. Never the service. */
  const when = shortWhen(b.startsAt);
  const subject = b.isConsult
    ? (when ? `Free consultation booked: ${when} | Westpeak Wellness` : 'Your free online consultation is booked | Westpeak Wellness')
    : (when ? `Session booked: ${when} | Westpeak Wellness` : 'Your online session is booked | Westpeak Wellness');
  const guide = inLanguageGuide(b.practitioner);

  const text = wrap(
`Hi ${b.firstName},

Your appointment with Westpeak Wellness is confirmed for:

${whenText(b)}

${ONLINE_LINE}

${b.telehealthUrl
  ? `Join the video call here when it is time:
${b.telehealthUrl}

Cliniko, our booking system, also sends a confirmation from
notifications@cliniko.com with the same link and the calendar details.`
  : `You will receive a separate email from Cliniko, our booking system, with
the video link and calendar details. It arrives from notifications@
cliniko.com, worth checking your spam folder if you do not see it, and
marking it as safe so future ones arrive.`}

${b.isConsult
  ? `Before the call, this covers what the thirty minutes contain:`
  : `If it is your first time, this walks through what actually happens:`}
${prepLink(b)}
${guide ? `\n${guide.label}:\n${guide.href}\n` : ''}
A few things that come up often:

  What it costs and how extended health works
  ${links.pricing}

  Common questions, answered directly
  ${links.answers}

  How this practice works, and what is outside its scope
  ${links.standards}

${b.isConsult ? 'Need to change or cancel? Reply to this email and we will sort it out.' : paidCancellationTerms()}

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
Online counselling across British Columbia
${BASE}`);

  const html = shell(
    b.isConsult ? 'Your free online consultation is booked' : 'Your online session is booked',
    p(`Hi ${esc(b.firstName)},`) +
    whenChip(b) +
    p(`<strong>${esc(ONLINE_LINE)}</strong>`) +
    joinBtn(b) +
    (b.telehealthUrl
      ? p(`Cliniko, our booking system, also sends a confirmation from <strong>notifications@cliniko.com</strong> with the same link and the calendar invite.`)
      : p(`You will get a separate email from Cliniko, our booking system, carrying the video link and calendar invite. It arrives from <strong>notifications@cliniko.com</strong>, worth checking spam if it is not there, and marking it safe so future ones land.`)) +
    (b.isConsult
      ? p(`This is a free 30-minute conversation to work out whether this is the right fit. There is no obligation to book anything afterwards, and a referral elsewhere is a perfectly good outcome.`)
      : '') +
    btn(prepLink(b), 'What to expect') +
    (guide ? p(a(guide.href, guide.label)) : '') +
    p(`Also useful: ${a(links.pricing, 'fees and extended health coverage')}, ${a(links.answers, 'common questions')}, and ${a(links.standards, 'how this practice works')}.`) +
    p(esc(changeLine(b))),
    apptPreheader(b),
  );

  return tagMail({ subject, text, html }, 'confirm');
}

/* ---- reminder, the day before ------------------------------------------- */

/* THE STAGE THAT WAS MISSING.
 *
 * A confirmation went out at booking and a follow-up the day after the session.
 * Between them, nothing, so an appointment booked a week ahead had no reminder
 * at all, which is the definition of an easy no-show.
 *
 * It matters more here than at most practices. There are three bookable hours a
 * week outside working hours; a no-show on one of them costs a third of the
 * week's out-of-hours capacity and cannot be resold at an hour's notice.
 *
 * Written to make rearranging as easy as attending, and deliberately not
 * written to guilt anybody into turning up. The most useful outcome of a
 * reminder is frequently somebody moving the appointment rather than keeping
 * it. A slot released a day ahead can go to somebody else, and a slot
 * abandoned on the hour cannot. So the reschedule line comes before the
 * what-to-expect one.
 *
 * The free consultation carries no fee and the reminder says nothing about
 * one. A PAID session states the cancellation terms at the end, since 1 Oct
 * 2026: they are the terms the client agreed to when booking, and finding
 * them out afterwards is worse than reading them here. */
export function reminderEmail(b: Booking) {
  const when = shortWhen(b.startsAt);
  const subject = b.isConsult
    ? (when ? `Tomorrow, ${when}: free consultation | Westpeak Wellness` : 'Tomorrow: your free online consultation | Westpeak Wellness')
    : (when ? `Tomorrow, ${when}: your session | Westpeak Wellness` : 'Tomorrow: your online session | Westpeak Wellness');
  const guide = inLanguageGuide(b.practitioner);

  const text = wrap(
`Hi ${b.firstName},

A short reminder that your appointment is tomorrow:

${whenText(b)}

${ONLINE_LINE}

${b.telehealthUrl
  ? `Join the video call here when it is time:
${b.telehealthUrl}`
  : `The video link is in the email from Cliniko, our booking system, sent
when you booked. It comes from notifications@cliniko.com, so it is worth
a look in spam if you cannot find it.`}

If tomorrow no longer works, reply to this email and we will move it.
Rearranging is genuinely easier for everybody than a missed appointment,
and there is nothing awkward about asking.

${b.isConsult
  ? `This is a free 30-minute conversation. Nothing to prepare, nothing to
bring, and no obligation to book anything afterwards.`
  : `Nothing to prepare. If there is something you want to start with, it
is a good thing to arrive with, and it is equally fine not to have one.`}

${b.isConsult ? 'What the call contains, if you want to know beforehand:' : 'What actually happens, if it is your first time:'}
${prepLink(b)}
${guide ? `\n${guide.label}:\n${guide.href}\n` : ''}${b.isConsult ? '' : `\n${paidCancellationTerms()}\n`}
If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
${BASE}`);

  const html = shell(
    b.isConsult ? 'Your free online consultation is tomorrow' : 'Your online session is tomorrow',
    p(`Hi ${esc(b.firstName)},`) +
    whenChip(b) +
    p(`<strong>${esc(ONLINE_LINE)}</strong>`) +
    (b.telehealthUrl
      ? joinBtn(b)
      : p(`The video link is in the email Cliniko sent when you booked, from <strong>notifications@cliniko.com</strong>, worth checking spam if it is not in your inbox.`)) +
    p(`<strong>If tomorrow no longer works, just reply.</strong> Moving it is easier for everybody than a missed appointment, and there is nothing awkward about asking.`) +
    (b.isConsult
      ? p(`This is a free 30-minute conversation. Nothing to prepare, nothing to bring, and no obligation to book anything afterwards.`)
      : p(`Nothing to prepare. If there is something you want to start with, it is a good thing to arrive with, and equally fine not to have one.`)) +
    btn(prepLink(b), 'What actually happens') +
    (guide ? p(a(guide.href, guide.label)) : '') +
    p(esc(changeLine(b))),
    apptPreheader(b),
  );

  return tagMail({ subject, text, html }, 'remind');
}

/* ---- consultation follow-up ---------------------------------------------- */

/* The consultation is the one point where the practice has already met the
 * person and nothing at all happens next unless they act. Cliniko's own message
 * is a receipt for a call that has now been and gone, and the generic follow-up
 * below says "book your NEXT session", wrong for someone who has not had a
 * first one.
 *
 * Its restraint is the point. Someone who had a thirty-minute call and did not
 * book may be thinking about it, may have decided against it, or may have found
 * the call itself hard. A nudge written for the first reading is unpleasant for
 * the other two, and BCACC's advertising standards rule out the usual toolkit
 * regardless: no urgency, no scarcity, no outcome claims, no spots-filling-up.
 * What is left is the honest version: here is the link, here is the cost, and
 * choosing someone else is a fine outcome.
 *
 * SINCE 1 OCT 2026 it books THE SAME COUNSELLOR. The button used to open the
 * practice-wide paid calendar, which lists every practitioner and every paid
 * type, so a person who had just met Savneet was asked to choose again. It
 * now opens her paid calendar (bookingsPaidUrlFor), is signed with her first
 * name, and booking-notify sets its reply-to to her address and info@. With
 * no roster match it falls back to the practice-wide calendar and no name.
 *
 * It also states the fees, read from the catalogue, and that the card is
 * taken at booking. The first sight of the card form used to be after the
 * click.
 *
 * Sent once, a day after the consultation, and never repeated. */
export function consultFollowUpEmail(b: Booking, catalog: Catalog = FALLBACK_CATALOG) {
  const pr = b.practitioner ?? null;
  const signoff = pr?.firstName ? `${pr.firstName}\n${site.name}` : site.name;

  /* THE FIRST SESSION IS ALREADY BOOKED, 1 Oct 2026. Counsellors are asked
     to book session one on the call, and those people were sent a booking
     button and a fee pitch the next day for a session they already had. Now
     the note confirms it instead: when, with whom, what a first session is,
     and the cancellation terms they agreed to. No calendar link at all. */
  if (b.next) {
    const nx = b.next;
    const guide = inLanguageGuide(pr);
    const preWhen = shortWhen(nx.startsAt);
    const preheader = [preWhen ? `${preWhen} Pacific` : nx.whenText, nx.withName ? `with ${nx.withName.split(',')[0].trim()}` : '', 'nothing else to do before it']
      .filter(Boolean).join(' · ');
    const text = wrap(
`Hi ${b.firstName},

Thank you for the call yesterday. Your first session is booked:

  ${nx.whenText}${nx.withName ? `\n  With ${nx.withName}` : ''}

${ONLINE_LINE}

No reply needed, and nothing else to do before it. This is the only
message of its kind.

What happens in a first full session:
${links.firstSession}
${guide ? `\n${guide.label}:\n${guide.href}\n` : ''}
${paidCancellationTerms()}

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${signoff}
Online counselling across British Columbia
${BASE}`);

    const html = shell(
      'Your first session is booked',
      p(`Hi ${esc(b.firstName)},`) +
      p('Thank you for the call yesterday. Your first session is booked:') +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f7f2e8;border-radius:8px;padding:16px 18px;width:100%;">
       <tr><td style="font-size:15px;line-height:1.6;">
         <strong style="color:#3d6c92;">${esc(nx.whenText)}</strong>${nx.withName ? `<br>
         <span style="color:#545e69;">With ${esc(nx.withName)}</span>` : ''}
       </td></tr></table>` +
      p(`<strong>${esc(ONLINE_LINE)}</strong>`) +
      p('No reply needed, and nothing else to do before it. This is the only message of its kind.') +
      btn(links.firstSession, 'What happens in a first full session') +
      (guide ? p(a(guide.href, guide.label)) : '') +
      p(esc(paidCancellationTerms())) +
      (pr?.firstName ? p(`${esc(pr.firstName)}<br>${esc(site.name)}`) : ''),
      preheader,
    );
    return tagMail({ subject: 'Your first session is booked | Westpeak Wellness', text, html }, 'consult');
  }

  /* NOTHING BOOKED: her types, her fees, her calendar. firstSessionTypes()
     reads the catalogue the caller passes (readCatalog() in booking-notify),
     so a Savneet consult names only the individual fee and, being one type,
     opens her calendar on it. Two types: her calendar, both fees. */
  const subject = 'After your consultation | Westpeak Wellness';
  const types = firstSessionTypes(catalog, pr?.services);
  const bookUrl = sessionLink(pr, types.length === 1 ? types[0].id : undefined, 'consult');
  const fees = feeFacts(catalog, pr?.services);
  const bookLabel = pr?.firstName ? `Book a first session with ${pr.firstName}` : 'Book a first session';

  const text = wrap(
`Hi ${b.firstName},

Thank you for the call yesterday.

No reply needed, and this is the only message of its kind. There is no
sequence behind it.

${pr?.firstName
  ? `If you would like to go ahead, a first session with ${pr.firstName} can be booked here:`
  : 'If you would like to go ahead, a first session can be booked here:'}
${bookUrl}
${fees ? `\n${fees}\n` : ''}
  What sessions cost, and how extended health reimbursement works
  ${links.pricing}

  What actually happens in a first full session
  ${links.firstSession}

The question almost nobody asks on the call is how much of your life and
money this takes. There is no package and no minimum number of sessions:
weekly at first for most people, then further apart, with a deliberate
check around session four about whether it is working and whether it is
the right person. Stopping there is a normal outcome.

If you decided this is not the right fit, that is a completely
reasonable outcome and no explanation is owed to anyone. If it would
help to be pointed toward something that fits better, a different
approach, a lower fee, or a service with no fee at all, reply and say
roughly what you are looking for.

  Common questions, answered directly
  ${links.answers}

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${signoff}
Online counselling across British Columbia
${BASE}`);

  const html = shell(
    'After your consultation',
    p(`Hi ${esc(b.firstName)},`) +
    p(`Thank you for the call yesterday. No reply needed, and this is the only message of its kind. There is no sequence behind it.`) +
    /* The commitment question, answered without being asked. It is the one
       thing somebody is weighing the day after a consultation, and leaving it
       unanswered is a reason a good call does not become a booking. Descriptive
       only, BCACC prohibits outcome claims. */
    p(`One thing that rarely gets asked on the call: there is no package and no minimum number of sessions. Weekly at first for most people, then further apart, with a deliberate check around session four about whether it is working and whether it is the right person. Stopping there is a normal outcome.`) +
    (pr?.firstName ? p(`<strong>Booking with ${esc(pr.firstName)}:</strong>`) : '') +
    btn(bookUrl, bookLabel) +
    (fees ? p(`<span style="color:#545e69;font-size:14px;">${esc(fees)}</span>`) : '') +
    p(`Useful either way: ${a(links.pricing, 'what sessions cost and how extended health works')} · ${a(links.firstSession, 'what happens in a first full session')}`) +
    p(`If you decided this is not the right fit, that is a completely reasonable outcome and no explanation is owed to anyone. If it would help to be pointed toward something that fits better, a different approach, a lower fee, or a service with no fee at all, reply and say roughly what you are looking for.`) +
    (pr?.firstName ? p(`${esc(pr.firstName)}<br>${esc(site.name)}`) : ''),
    pr?.firstName
      ? `Booking with ${pr.firstName}, what it costs, no package or minimum`
      : 'Booking a first session, what it costs, no package or minimum',
  );

  return tagMail({ subject, text, html }, 'consult');
}

/* ---- follow-up ----------------------------------------------------------- */

export function followUpEmail(b: Booking) {
  /* Deliberately does NOT: ask how the session went, request a review or
   * testimonial (BCACC prohibits soliciting these), imply progress should
   * have happened, or mention anything clinical. It exists to make the next
   * step easy and to be a door left open.
   *
   * "Book your next session" pointed at /book until 1 Oct 2026, and /book is
   * the FREE-consultation calendar, so a paying client was offered the
   * consult for session two. It now opens that counsellor's paid calendar,
   * or the practice-wide paid one when the roster does not know her. */
  const subject = 'After your session | Westpeak Wellness';
  /* Through /book/session since 1 Oct 2026, which counts the click as
     email:after and redirects to the same calendar (sessionLink). */
  const nextUrl = sessionLink(b.practitioner, b.typeId, 'after');
  /* SINCE 1 OCT 2026: when the next session is already booked it is stated
     rather than offering a button to book one, and the note is signed by the
     counsellor, as the consultation note is. booking-notify also sends it
     only after the first paid session with her or when nothing is booked
     after the session, so a weekly client is not sent the same text weekly. */
  const pr = b.practitioner ?? null;
  const nextLine = b.next ? `Your next session: ${b.next.whenText}${b.next.withName ? ` with ${b.next.withName}` : ''}` : '';
  const signoff = pr?.firstName ? `${pr.firstName}\n${site.name}` : site.name;

  const text = wrap(
`Hi ${b.firstName},

Thanks for making the time yesterday.

No reply needed. This is just the practical bits in one place, so you do
not have to go looking for them.

${nextLine
  ? `  ${nextLine}
  To move it, reply to this email.`
  : `  Book your next session
  ${nextUrl}`}

  Fees, receipts and extended health
  ${links.pricing}

  Reading, if you want it
  ${links.guides}

If anything came up afterwards that you would rather raise before the
next session, replying here reaches the practice directly.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

${signoff}
Online counselling across British Columbia
${BASE}`);

  const html = shell(
    'After your session',
    p(`Hi ${esc(b.firstName)},`) +
    p(`Thanks for making the time yesterday.`) +
    p(`No reply needed. This is just the practical bits in one place so you are not hunting for them.`) +
    (nextLine
      ? p(`<strong>${esc(nextLine)}</strong><br><span style="color:#545e69;font-size:14px;">To move it, reply to this email.</span>`)
      : btn(nextUrl, 'Book your next session')) +
    p(`Also: ${a(links.pricing, 'fees, receipts and extended health')} · ${a(links.guides, 'reading, if you want it')}`) +
    p(`If something came up afterwards you would rather raise before next time, replying here reaches the practice directly.`) +
    (pr?.firstName ? p(`${esc(pr.firstName)}<br>${esc(site.name)}`) : ''),
    nextLine
      ? `${nextLine.replace(/^Your next session: /, 'Next session: ')}, and the practical bits`
      : pr?.firstName
        ? `Booking your next session with ${pr.firstName}, fees and receipts`
        : 'Booking your next session, fees and receipts',
  );

  return tagMail({ subject, text, html }, 'after');
}
