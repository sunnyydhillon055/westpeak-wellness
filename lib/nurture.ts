import { site } from '@/lib/site';
import { shell, btn, p, a, esc, wrap, links } from '@/lib/booking-mail';
import { readInbound, type Inbound } from '@/lib/inbound';
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
 *   1. Leads only. Never a client, never an enquiry, never a waitlist signup.
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
    const hit = await get(KEY, { access: 'private' });
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

export async function optOut(email: string): Promise<void> {
  const e = normalizeEmail(email);
  const current = await readSent();
  await writeSent({ ...current, optedOut: { ...current.optedOut, [e]: new Date().toISOString() } });
}

/* ---- the two remaining emails --------------------------------------------- */

const footerNote = (email: string) =>
  `<p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#545e69;">
     You are getting this because you asked for the coverage checklist on our website.
     <a href="${unsubLink(email)}" style="color:#545e69;">Unsubscribe</a> — one click, no questions.
   </p>`;

function email2(firstName: string, to: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const text = wrap(
`${hi}

One of the most common reasons people put off booking is not cost. It
is not knowing what a first session is like — and imagining something
more exposing than it is.

Briefly: you will not be asked to lie on anything. You will not have to
start at the beginning of your life. "I don't want to go into that yet"
is a complete sentence and a reasonable one. Most of a first session is
working out what you want to be different, which is a more useful
question than what is wrong.

The longer version:
${links.firstSession}

And if you are not sure which kind of counselling fits — or whether it
is counselling you need at all — this takes about two minutes, and
several of its answers point somewhere other than here:
${site.domain}/tools/which-service

${site.name}

You are getting this because you asked for the coverage checklist.
Unsubscribe: ${unsubLink(to)}`);

  const html = shell(
    'What actually happens in a first session',
    p(esc(hi)) +
    p('One of the most common reasons people put off booking is not cost. It is not knowing what a first session is like — and imagining something more exposing than it is.') +
    p('Briefly: you will not be asked to lie on anything. You will not have to start at the beginning of your life. &ldquo;I don&rsquo;t want to go into that yet&rdquo; is a complete sentence and a reasonable one. Most of a first session is working out what you want to be different, which is a more useful question than what is wrong.') +
    btn(links.firstSession, 'The longer version') +
    p(`And if you are not sure which kind of counselling fits — or whether it is counselling you need at all — ${a(`${site.domain}/tools/which-service`, 'this takes about two minutes')}, and several of its answers point somewhere other than here.`) +
    footerNote(to)
  );
  return { subject: 'What actually happens in a first session', text, html };
}

function email3(firstName: string, to: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const text = wrap(
`${hi}

Last one from me.

If you have been turning this over since you downloaded that checklist,
a free fifteen-minute consultation is the least committal way to find
out whether it is worth going further. It is a conversation, not an
intake. Nothing to prepare, and no obligation to book afterwards.

${links.book}

It is also a perfectly good outcome of that call to conclude that
someone else is a better fit, or that now is not the time. If that is
where it lands, you will be told so plainly rather than sold to.

If the timing is wrong, that is completely fine — the guides stay up
and cost nothing:
${links.guides}

Take care of yourself,
${site.name}

You are getting this because you asked for the coverage checklist. This
is the last of three; there is nothing after it.
Unsubscribe: ${unsubLink(to)}`);

  const html = shell(
    'Fifteen minutes, if it is useful',
    p(esc(hi)) +
    p('Last one from me.') +
    p('If you have been turning this over since you downloaded that checklist, a free fifteen-minute consultation is the least committal way to find out whether it is worth going further. It is a conversation, not an intake — nothing to prepare, and no obligation to book afterwards.') +
    btn(links.book, 'Book a free consultation') +
    p('It is also a perfectly good outcome of that call to conclude that someone else is a better fit, or that now is not the time. If that is where it lands, you will be told so plainly rather than sold to.') +
    p(`If the timing is wrong, that is completely fine — ${a(links.guides, 'the guides stay up and cost nothing')}.`) +
    footerNote(to)
  );
  return { subject: 'Fifteen minutes, if it is useful', text, html };
}

/* ---- the run -------------------------------------------------------------- */

export type NurtureResult = {
  ok: boolean;
  sent: number;
  skipped: { optedOut: number; alreadyClient: number; notDue: number; done: number };
  failures: string[];
  reason?: string;
};

export async function runNurture(opts: { dry?: boolean } = {}): Promise<NurtureResult> {
  const base: NurtureResult = {
    ok: false, sent: 0,
    skipped: { optedOut: 0, alreadyClient: 0, notDue: 0, done: 0 }, failures: [],
  };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set' };
  }

  const { items } = await readInbound({ fresh: true });
  const sent = await readSent();
  if (sent.updatedAt === 'unreadable') {
    return { ...base, reason: 'nurture ledger unreadable — refusing to send rather than risk re-sending' };
  }

  /* Rule 3: anyone who became a client drops out of the sequence. The client
   * book is the authority, not the lead record. */
  const { readClients } = await import('@/lib/clients');
  const clientEmails = new Set((await readClients()).clients.map((c) => c.email));

  /* Someone who later wrote in or joined the waitlist is in a conversation with
   * the practice, and a marketing sequence running underneath that conversation
   * is worse than no sequence. */
  const inConversation = new Set(
    items.filter((i) => i.kind !== 'lead').map((i) => i.email)
  );

  const leads = items.filter((i: Inbound) => i.kind === 'lead');
  const now = Date.now();
  const step = { ...sent.step };

  for (const lead of leads) {
    const e = lead.email;
    if (sent.optedOut[e]) { base.skipped.optedOut++; continue; }
    if (clientEmails.has(e) || inConversation.has(e)) { base.skipped.alreadyClient++; continue; }

    const ageDays = (now - new Date(lead.createdAt).getTime()) / 864e5;
    const done = step[e] ?? 1; // email 1 went out with the signup
    if (done >= 3) { base.skipped.done++; continue; }

    const next = done + 1;
    const dueAt = next === 2 ? 4 : 11;
    if (ageDays < dueAt) { base.skipped.notDue++; continue; }
    /* A long-dormant lead is not worth waking. Somebody who asked for a
     * checklist three months ago and was never followed up has moved on, and a
     * sequence arriving out of nowhere reads as a list being worked. */
    if (ageDays > 45) { base.skipped.done++; continue; }

    const firstName = (lead.name || '').split(/\s+/)[0] ?? '';
    const mail = next === 2 ? email2(firstName, e) : email3(firstName, e);

    if (opts.dry) { base.sent++; step[e] = next; continue; }
    const res = await sendDetailed(e, mail.subject, mail.text, mail.html, { replyTo: site.email });
    if (res.ok) { step[e] = next; base.sent++; }
    else base.failures.push(`nurture ${next} -> ${e}: ${res.detail ?? 'failed'}`);
  }

  if (!opts.dry && base.sent > 0) await writeSent({ ...sent, step });
  return { ...base, ok: true };
}
