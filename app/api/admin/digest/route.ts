import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readInbound, type Inbound } from '@/lib/inbound';
import { practitioners } from '@/lib/practitioners';
import { site } from '@/lib/site';
import { sendDetailed } from '@/lib/portal-mail';
import { esc } from '@/lib/booking-mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/* ONE EMAIL WITH EVERY ENQUIRY TO DATE — 11 Sep 2026, owner's instruction.
 *
 * 41 messages had reached the site and sat in info@ with nobody answering.
 * This sends the whole list — contact details and message, oldest first — in
 * one message to every counsellor who has an alert address and is taking new
 * clients, with info@ in copy, so it lands as a single thread the practice
 * can work through.
 *
 * Admin-only and behind a button rather than a schedule: it is a one-off, and
 * a digest of client contact details is not something a cron should be able
 * to send twice by accident. Test submissions (example.com, mailinator, the
 * .invalid TLD) are left out; nothing is marked handled — that is done in
 * /admin as each one is actually answered. */

const TEST = /@(example\.com|mailinator\.com|.*\.invalid)$|\+test@/i;

/* READ ON 11 SEP 2026, WITH THE OWNER: of the 30 non-test messages, 26 were
   bots — "please add me to your newsletter" scripts, crypto links pasted
   into the name field, an SEO pitch, gibberish. Three were people who
   pressed "tell me when a time opens" on the old /book form and left no
   message. A digest of the whole list would have sent two counsellors 26
   pieces of spam. So the digest keeps only what a person could act on: a
   message with no link, no newsletter phrasing and no gibberish name — or
   a /book request with a real name and nothing else. */
const SPAM =
  /https?:\/\/|\.(org|net|ph|ru)\/|newsletter|mailing list|news and updates|email updates|special offers|weekly updates|bitcoin|mining|promo code|jackpot|seo|google rankings|advertising platform|buy now/i;
const GIBBERISH = /^[A-Za-z]{6,}$/; // one run of letters, no vowel pattern a name has
const looksHuman = (it: Inbound) => {
  const name = String(it.name ?? '').trim();
  const msg = String(it.message ?? '').trim();
  if (SPAM.test(`${name} ${msg}`)) return false;
  if (/^[A-Za-z]{10,}$/.test(msg) || (GIBBERISH.test(name) && !/[aeiou]/i.test(name))) return false;
  if (!msg) return it.source === '/book' && /^[A-Za-z][a-z]+(\s[A-Za-z][a-z]+)?$/.test(name);
  return true;
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));

function block(it: Inbound, i: number) {
  const who = it.practitioner ? ` · asked for ${it.practitioner}` : '';
  const text = [
    `${i}. ${it.name || '(no name)'} <${it.email}>${it.phone ? ` · ${it.phone}` : ''}`,
    `   ${fmt(it.createdAt)} · ${it.kind} · from ${it.source}${who}${it.callWindow ? ` · free: ${it.callWindow}` : ''}`,
    `   ${it.message || '(no message)'}`,
    '',
  ].join('\n');
  const html =
    `<div style="margin:0 0 18px;padding:0 0 14px;border-bottom:1px solid #e6ddce;">` +
    `<p style="margin:0 0 4px;"><strong>${i}. ${esc(it.name || '(no name)')}</strong> · <a href="mailto:${esc(it.email)}">${esc(it.email)}</a>${it.phone ? ` · ${esc(it.phone)}` : ''}</p>` +
    `<p style="margin:0 0 8px;color:#545e69;font-size:13px;">${esc(fmt(it.createdAt))} · ${esc(it.kind)} · from ${esc(it.source)}${esc(who)}${it.callWindow ? ` · free: ${esc(it.callWindow)}` : ''}</p>` +
    `<p style="margin:0;white-space:pre-wrap;">${esc(it.message || '(no message)')}</p></div>`;
  return { text, html };
}

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const book = await readInbound({ fresh: true });
  const items = book.items
    .filter((it) => !TEST.test(it.email) && looksHuman(it))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const to = practitioners.filter((p) => p.acceptingNewClients && p.alertEmail).map((p) => p.alertEmail!);
  if (!to.length) return NextResponse.redirect(new URL('/admin?digest=noaddress', req.url), 303);

  const parts = items.map((it, i) => block(it, i + 1));
  const subject = `All enquiries to date (${items.length}) — Westpeak Wellness`;
  const intro = `Every message that has reached the website, oldest first, ${items.length} in total. Reply to each person directly; then mark it handled in /admin so the reply-watch job stops flagging it.`;
  const text = `${intro}\n\n${parts.map((p) => p.text).join('\n')}`;
  const html =
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#2b3138;max-width:680px;">` +
    `<p>${esc(intro)}</p>${parts.map((p) => p.html).join('')}</div>`;

  const res = await sendDetailed(to, subject, text, html, { cc: [site.email], replyTo: site.email });
  console.log(`[digest] ${items.length} enquiries to ${to.join(', ')} cc ${site.email}: ${res.ok ? 'sent' : res.detail}`);
  return NextResponse.redirect(new URL(`/admin?digest=${res.ok ? `sent-${items.length}` : 'failed'}#inbox`, req.url), 303);
}
