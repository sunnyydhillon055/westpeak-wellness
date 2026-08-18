import { readInbound, type Inbound } from '@/lib/inbound';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { shell, btn, p as para, a, esc, wrap, links } from '@/lib/booking-mail';
import { site } from '@/lib/site';
import { put, get } from '@vercel/blob';

/* ONE CHECK-IN FOR PEOPLE ON THE WAITLIST.
 *
 * WHY THIS IS ALLOWED WHEN AN ENQUIRY SEQUENCE IS NOT
 *
 * lib/nurture.ts says it plainly in its own header: leads only, never an
 * enquiry, never a waitlist signup. That refusal is correct for enquiries —
 * somebody who wrote a message consented to a reply, not to a sequence, and
 * dropping them into automated mail is worse than silence.
 *
 * The waitlist is a different thing entirely. A person on it **asked to be
 * contacted when something opens.** Writing to them is fulfilling the request
 * they made; staying silent for months is the failure. The site says the list
 * is "a real waitlist rather than a formality", and a list nobody is ever
 * contacted from makes that untrue.
 *
 * SO THE RULES ARE NARROW, AND THEY MATTER
 *
 *   - ONE note per person. Ever. Not a sequence, no second attempt, no
 *     re-entry. If they do not reply, that is their answer and it is respected.
 *   - Only after 30 days. Sooner reads as chasing.
 *   - Never to anyone who has since become a client, written in again, or been
 *     marked handled — they are already in a conversation.
 *   - It offers to REMOVE them as prominently as it offers to keep them. A
 *     check-in that only has a "yes" is a marketing email wearing a hat.
 *   - The ledger fails closed: if it cannot be read, nothing sends. Sending a
 *     duplicate to somebody waiting on a counsellor is worse than sending
 *     nothing.
 */

const KEY = 'inbound/waitlist-checkin.json';
const AFTER_DAYS = 30;

type Sent = { sent: Record<string, string>; updatedAt: string };
const EMPTY: Sent = { sent: {}, updatedAt: '' };

async function readSent(): Promise<Sent | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const v = (await new Response(hit.stream).json()) as Partial<Sent>;
    return { sent: (v.sent ?? {}) as Record<string, string>, updatedAt: String(v.updatedAt ?? '') };
  } catch {
    /* FAILS CLOSED. Returning EMPTY here would treat "cannot read the ledger"
       as "nobody has been written to", and re-send to everyone. */
    return null;
  }
}

async function record(sent: Sent, email: string) {
  const value: Sent = {
    sent: { ...sent.sent, [email]: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  };
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(KEY, JSON.stringify(value, null, 2), {
      access: 'private', contentType: 'application/json',
      addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
    });
  }
  return value;
}

function checkinEmail(i: Inbound) {
  const first = (i.name || '').trim().split(/\s+/)[0] ?? '';
  const hi = first ? `Hi ${first},` : 'Hi,';
  const when = i.windows ? `You said you were free around: ${i.windows}` : '';

  const text = wrap(
`${hi}

You joined the waitlist here about a month ago, and I said it was a real list
rather than a formality — so this is me keeping that promise rather than
letting it go quiet.

${when}

Nothing has opened yet that fits. I am not writing to sell you anything; I am
writing to ask one question, and either answer is completely fine:

  Would you like to stay on the list, or shall I take you off?

If you want to stay on, you do not need to do anything at all. If you would
rather come off, just reply saying so and it is done — no follow-up, and I
will not write again either way. This is the only check-in.

If you have found somebody else in the meantime, that is genuinely a good
outcome and I am glad.

And if waiting is not workable, these are real starting points rather than a
gesture:
${site.domain}/resources/low-cost-counselling-bc
${site.domain}/guides/how-to-find-a-therapist-in-bc`
  );

  const html = shell(
    'Still on the waitlist?',
    para(esc(hi)) +
    para('You joined the waitlist here about a month ago, and I said it was a real list rather than a formality — so this is me keeping that promise rather than letting it go quiet.') +
    (i.windows ? para(`<span style="color:#5a6470;font-size:14px;">You said you were free around: ${esc(i.windows)}</span>`) : '') +
    para('Nothing has opened yet that fits. I am not writing to sell you anything — just to ask one question, and <strong>either answer is completely fine</strong>:') +
    para('<strong>Would you like to stay on the list, or shall I take you off?</strong>') +
    para('If you want to stay on, you do not need to do anything at all. If you would rather come off, reply saying so and it is done. <strong>This is the only check-in</strong> — I will not write again either way.') +
    para('If you have found somebody else in the meantime, that is genuinely a good outcome and I am glad.') +
    para(`If waiting is not workable, these are real starting points rather than a gesture: ${a(`${site.domain}/resources/low-cost-counselling-bc`, 'free and low-cost counselling in BC')} and ${a(`${site.domain}/guides/how-to-find-a-therapist-in-bc`, 'how to find a therapist in BC')}.`) +
    btn(links.book, 'See current consultation times')
  );

  return { subject: 'Still on the waitlist?', text, html };
}

export type CheckinResult =
  | { ok: false; reason: string }
  | { ok: true; sent: number; skipped: { notDue: number; already: number; inConversation: number }; dry: boolean };

export async function runWaitlistCheckin(
  opts: { dry?: boolean; now?: Date } = {}
): Promise<CheckinResult> {
  const dry = opts.dry === true;
  const now = opts.now ?? new Date();

  const ledger = await readSent();
  if (!ledger) return { ok: false, reason: 'ledger unreadable — refusing to risk duplicates' };

  const { items } = await readInbound({ fresh: true });

  /* Anyone who later wrote in, or who is already a client, is in a real
     conversation and must not receive an automated note. */
  const { readClients } = await import('@/lib/clients');
  const clientEmails = new Set((await readClients()).clients.map((c) => c.email));
  const wroteIn = new Set(items.filter((i) => i.kind === 'enquiry').map((i) => i.email));

  const skipped = { notDue: 0, already: 0, inConversation: 0 };
  let sent = 0;

  for (const i of items.filter((x) => x.kind === 'waitlist')) {
    if (ledger.sent[i.email]) { skipped.already += 1; continue; }
    if (i.handled || clientEmails.has(i.email) || wroteIn.has(i.email)) {
      skipped.inConversation += 1; continue;
    }
    const ageDays = (now.getTime() - new Date(i.createdAt).getTime()) / 86_400_000;
    if (ageDays < AFTER_DAYS) { skipped.notDue += 1; continue; }

    if (dry || !mailConfigured()) { sent += 1; continue; }
    const m = checkinEmail(i);
    await sendDetailed(i.email, m.subject, m.text, m.html, { replyTo: site.email });
    await record(ledger, i.email);
    ledger.sent[i.email] = new Date().toISOString();
    sent += 1;
  }

  return { ok: true, sent, skipped, dry };
}
