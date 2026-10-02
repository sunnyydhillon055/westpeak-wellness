import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links, tagMail } from '@/lib/booking-mail';
import { readInbound, type Inbound } from '@/lib/inbound';
import { nurtureDecision, magnetWords, type MagnetWords, type NurtureSkip } from '@/lib/nurture-plan';
import { rosterLines, rosterText, rosterHtml, individualFeeLine, type RosterLine } from '@/lib/lead-roster';
import { readCatalog } from '@/lib/cliniko-catalog';
import { planYearMailParagraph } from '@/lib/seasonal';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';
import { createHmac } from 'node:crypto';

/* The three-email sequence from NURTURE_SEQUENCE.md, finally connected.
 *
 * It was written before there was anywhere to store a lead and has sat unused
 * since — /api/lead validated addresses and discarded them, so there was never
 * a list to send it to. There is now.
 *
 * Email 1 is already sent, synchronously, by lib/inbound-submit.ts: it is the
 * checklist itself and arrives immediately because it is the thing the person
 * asked for. This module sends 2 and 3, on day 4 and day 11.
 *
 * FOUR RULES, ALL OF WHICH CAN LOSE THE PRACTICE MORE THAN THE SEQUENCE GAINS
 *
 *   1. Leads only. Never a client, never an enquiry.
 *      Somebody who asked a question is not somebody who asked to be marketed
 *      to, and a counselling client receiving a nurture email is a boundary
 *      problem rather than a growth tactic.
 *   2. Three emails, then silence. Permanently. Not a newsletter with a pause.
 *   3. Stop the moment they become a client. Continuing to send marketing to a
 *      new client is the fastest way to make a first session awkward.
 *   4. A working one-click unsubscribe on every send. CASL requires it, and one
 *      click means one click — not a preference centre, not a sign-in.
 *
 * CASL, briefly. Asking for the checklist is express consent to receive the
 * checklist and material about it, which is what this is. It is not consent to
 * an indefinite mailing list, which is why rule 2 is not negotiable.
 */

const KEY = 'inbound/nurture.json';

type Sent = {
  /** normalised email -> highest step number sent (2 or 3) */
  step: Record<string, number>;
  /** normalised email -> ISO date they opted out */
  optedOut: Record<string, string>;
  updatedAt: string;
};

const EMPTY: Sent = { step: {}, optedOut: {}, updatedAt: '' };

async function readSent(): Promise<Sent> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const hit = await get(KEY, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const v = (await new Response(hit.stream).json()) as Partial<Sent>;
    return {
      step: v.step && typeof v.step === 'object' ? v.step : {},
      optedOut: v.optedOut && typeof v.optedOut === 'object' ? v.optedOut : {},
      updatedAt: String(v.updatedAt ?? ''),
    };
  } catch {
    /* Fails CLOSED: an unreadable ledger must look like "everything already
     * sent", never like "nothing sent yet". The second would re-send the whole
     * sequence to everybody. */
    return { step: {}, optedOut: {}, updatedAt: 'unreadable' };
  }
}

async function writeSent(v: Sent): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(KEY, JSON.stringify({ ...v, updatedAt: new Date().toISOString() }, null, 2), {
    access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
  });
}

/* ---- unsubscribe tokens --------------------------------------------------- */

/* HMAC of the address under PORTAL_SECRET. Nothing to store, nothing to expire,
 * and — importantly — the link cannot be used to unsubscribe somebody else by
 * editing the address in the URL, which a bare `?email=` would allow. */
export function unsubToken(email: string): string {
  const secret = process.env.PORTAL_SECRET ?? '';
  return createHmac('sha256', secret).update(normalizeEmail(email)).digest('hex').slice(0, 32);
}

export function unsubValid(email: string, token: string): boolean {
  const expected = unsubToken(email);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

export function unsubLink(email: string): string {
  return `${site.domain}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${unsubToken(email)}`;
}

/* ONE-CLICK UNSUBSCRIBE IN THE HEADER, 1 Oct 2026 (RFC 8058).
 *
 * The link was in the body only, so Gmail and Yahoo offered nothing but
 * "Report spam" beside a lead email, and nurture mail signs on the same root
 * domain as booking confirmations. These two headers put an Unsubscribe
 * control next to the sender; the client POSTs "List-Unsubscribe=One-Click"
 * to the same signed link, which app/api/unsubscribe/route.ts accepts. Lead
 * and nurture mail only (email 1 in lib/inbound-submit.ts, emails 2 and 3
 * below): booking and portal mail is transactional and never carries them. */
export function unsubHeaders(email: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${unsubLink(email)}>, <mailto:${site.email}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

export async function optOut(email: string): Promise<void> {
  const e = normalizeEmail(email);
  const current = await readSent();
  await writeSent({ ...current, optedOut: { ...current.optedOut, [e]: new Date().toISOString() } });
}

/* ---- the two remaining emails --------------------------------------------- */

/* Which one-pager they asked for, named — 1 Oct 2026. Both emails said "the
   coverage checklist" to everybody; see MAGNET_WORDS in lib/nurture-plan.ts. */
const footerNote = (email: string, w: MagnetWords) =>
  `<p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#545e69;">
     You are getting this because you asked for ${esc(w.asked)} on our website.
     <a href="${unsubLink(email)}" style="color:#545e69;">Unsubscribe</a>, one click, no questions.
   </p>`;

/* SINCE 1 OCT 2026 email 2 has a booking step. Its one button was the guide
   to a first PAID session; it now opens the page about the free 30-minute
   call, and the counsellors follow by name, each linking her own calendar,
   as email 3 already does. The guide stays as a link in the paragraph. Same
   send, same day, same consent: nothing is added to the sequence. */
export function email2(
  firstName: string,
  to: string,
  magnet?: string,
  extras: { roster?: RosterLine[] } = {}
) {
  const w = magnetWords(magnet);
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const roster = extras.roster ?? rosterLines();
  const text = wrap(
`${hi}

One of the most common reasons people put off booking is not cost. It
is not knowing what a first session is like, and imagining something
more exposing than it is.

Briefly: you will not be asked to lie on anything. You will not have to
start at the beginning of your life. "I don't want to go into that yet"
is a complete sentence and a reasonable one. Most of a first session is
working out what you want to be different, which is a more useful
question than what is wrong.

The longer version:
${links.firstSession}

Before any of that, there is a free 30-minute call, which is a
conversation rather than an intake. What it is like:
${links.consultPrep}

${roster.length ? `Each counsellor's own calendar:\n\n${rosterText(roster)}` : links.book}

And if you are not sure which kind of counselling fits, or whether it
is counselling you need at all. This takes about two minutes, and
several of its answers point somewhere other than here:
${site.domain}/tools/which-service

${site.name}

You are getting this because you asked for ${w.asked}.
Unsubscribe: ${unsubLink(to)}`);

  const html = shell(
    'What actually happens in a first session',
    p(esc(hi)) +
    p('One of the most common reasons people put off booking is not cost. It is not knowing what a first session is like, and imagining something more exposing than it is.') +
    p(`Briefly: you will not be asked to lie on anything. You will not have to start at the beginning of your life. &ldquo;I don&rsquo;t want to go into that yet&rdquo; is a complete sentence and a reasonable one. Most of a first session is working out what you want to be different, which is a more useful question than what is wrong. ${a(links.firstSession, 'The longer version')}.`) +
    p('Before any of that, there is a free 30-minute call, which is a conversation rather than an intake.') +
    btn(links.consultPrep, 'What the free 30 minutes is like') +
    (roster.length
      ? p('Each counsellor&rsquo;s own calendar:') + rosterHtml(roster)
      : btn(links.book, 'Book a free consultation')) +
    p(`And if you are not sure which kind of counselling fits, or whether it is counselling you need at all, ${a(`${site.domain}/tools/which-service`, 'this takes about two minutes')}, and several of its answers point somewhere other than here.`) +
    footerNote(to, w),
    'No couch, no life story, and a free 30-minute call before any of it',
  );
  return tagMail({ subject: 'What actually happens in a first session', text, html }, 'nurture2');
}

/* Email 3 names who the consultation would be with, each linking her own
   calendar, and states the individual fee from the catalogue as it stands on
   the day it is sent (lib/lead-roster.ts). Both are passed in so the run
   reads the roster and the catalogue once. */
export function email3(
  firstName: string,
  to: string,
  magnet?: string,
  extras: { roster?: RosterLine[]; feeLine?: string | null; now?: Date } = {}
) {
  const w = magnetWords(magnet);
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const roster = extras.roster ?? rosterLines();
  const feeLine = extras.feeLine ?? null;
  /* 15 Oct to 20 Dec only (lib/seasonal.ts), beside the fee line. Same
     audience and same single send as before; no new email. Item 222. */
  const season = planYearMailParagraph(extras.now ?? new Date());
  const text = wrap(
`${hi}

Last one from me.

If you have been turning this over since you asked for ${w.that},
a free thirty-minute consultation is the least committal way to find
out whether it is worth going further. It is a conversation, not an
intake. Nothing to prepare, and no obligation to book afterwards.

${roster.length ? `Each counsellor's own calendar:\n\n${rosterText(roster)}` : links.book}
${feeLine ? `\n${feeLine}\n` : ''}${season ? `\n${season}\n` : ''}
It is also a perfectly good outcome of that call to conclude that
someone else is a better fit, or that now is not the time. If that is
where it lands, you will be told so plainly rather than sold to.

If the timing is wrong, that is completely fine. The guides stay up
and cost nothing:
${links.guides}

Take care of yourself,
${site.name}

You are getting this because you asked for ${w.asked}. This
is the last of three; there is nothing after it.
Unsubscribe: ${unsubLink(to)}`);

  const html = shell(
    'Thirty minutes, if it is useful',
    p(esc(hi)) +
    p('Last one from me.') +
    p(`If you have been turning this over since you asked for ${esc(w.that)}, a free thirty-minute consultation is the least committal way to find out whether it is worth going further. It is a conversation, not an intake, nothing to prepare, and no obligation to book afterwards.`) +
    (roster.length
      ? p('Each counsellor&rsquo;s own calendar:') + rosterHtml(roster)
      : btn(links.book, 'Book a free consultation')) +
    (feeLine ? p(`<span style="color:#545e69;font-size:14px;">${esc(feeLine)}</span>`) : '') +
    (season ? p(`<span style="color:#545e69;font-size:14px;">${esc(season)}</span>`) : '') +
    p('It is also a perfectly good outcome of that call to conclude that someone else is a better fit, or that now is not the time. If that is where it lands, you will be told so plainly rather than sold to.') +
    p(`If the timing is wrong, that is completely fine, ${a(links.guides, 'the guides stay up and cost nothing')}.`) +
    footerNote(to, w),
    roster.length
      ? `The last of three: a free call with ${roster.map((r) => r.firstName).join(' or ')}, if it is useful`
      : 'The last of three: a free 30-minute call, if it is useful',
  );
  return tagMail({ subject: 'Thirty minutes, if it is useful', text, html }, 'nurture3');
}

/* ---- the run -------------------------------------------------------------- */

export type NurtureResult = {
  ok: boolean;
  sent: number;
  skipped: Record<NurtureSkip, number>;
  failures: string[];
  reason?: string;
};

export async function runNurture(opts: { dry?: boolean } = {}): Promise<NurtureResult> {
  const base: NurtureResult = {
    ok: false, sent: 0,
    skipped: { quarantine: 0, bot: 0, noAck: 0, optedOut: 0, alreadyClient: 0, notDue: 0, done: 0 },
    failures: [],
  };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set' };
  }

  const { items } = await readInbound({ fresh: true });
  const sent = await readSent();
  if (sent.updatedAt === 'unreadable') {
    return { ...base, reason: 'nurture ledger unreadable, refusing to send rather than risk re-sending' };
  }

  /* Rule 3: anyone who became a client drops out of the sequence. The client
   * book is the authority, not the lead record. */
  const { readClients } = await import('@/lib/clients');
  const clientEmails = new Set((await readClients()).clients.map((c) => c.email));

  /* Someone who later wrote in is in a conversation with
   * the practice, and a marketing sequence running underneath that conversation
   * is worse than no sequence. */
  const inConversation = new Set(
    items.filter((i) => i.kind !== 'lead').map((i) => i.email)
  );

  const leads = items.filter((i: Inbound) => i.kind === 'lead');
  const now = Date.now();
  const step = { ...sent.step };
  /* Read once per run, at send time: email 3 names who is accepting today and
     the fee as the catalogue holds it today. */
  const roster = rosterLines();
  const feeLine = individualFeeLine(await readCatalog());

  for (const lead of leads) {
    const e = lead.email;
    /* Who may be written to, and which step, is decided in one pure function
       (lib/nurture-plan.ts): honeypot-tripped scripts, probes and throwaway
       addresses, leads whose email 1 never went or that were told "one-off",
       opt-outs, clients and people in conversation, and the not-yet-due. */
    const decision = nurtureDecision(lead, {
      step: step[e],
      optedOut: Boolean(sent.optedOut[e]),
      known: clientEmails.has(e) || inConversation.has(e),
      now,
    });
    if ('skip' in decision) { base.skipped[decision.skip]++; continue; }
    const next = decision.send;

    const firstName = (lead.name || '').split(/\s+/)[0] ?? '';
    const mail = next === 2
      ? email2(firstName, e, lead.magnet, { roster })
      : email3(firstName, e, lead.magnet, { roster, feeLine });

    if (opts.dry) { base.sent++; step[e] = next; continue; }
    const res = await sendDetailed(e, mail.subject, mail.text, mail.html, { replyTo: site.email, headers: unsubHeaders(e) });
    if (res.ok) { step[e] = next; base.sent++; }
    else base.failures.push(`nurture ${next} -> ${e}: ${res.detail ?? 'failed'}`);
  }

  if (!opts.dry && base.sent > 0) await writeSent({ ...sent, step });
  return { ...base, ok: true };
}
