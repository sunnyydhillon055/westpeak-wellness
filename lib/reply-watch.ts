import { readInbound, type Inbound } from '@/lib/inbound';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { site } from '@/lib/site';

/* THE PROMISE-KEEPER.
 *
 * WHY THIS EXISTS
 *
 * On 17 Aug 2026 the enquiry form went from three pages to nearly all 116, and
 * every one of them now carries the same sentence: *a reply within one business
 * day, from your counsellor, not an assistant*. That sentence is the entire
 * reason the small ask works. It is also, until now, a promise nothing checked.
 *
 * A missed reply is worse than a missing form. Somebody wrote a first message
 * to a counsellor — frequently the hardest message they will send that year —
 * and heard nothing. They do not write again, and they do not tell you.
 *
 * WHAT IT DOES NOT DO
 *
 * It does not chase the person who wrote in. It emails the *practice*. The one
 * thing this site refuses to do is pursue people, and a system built to protect
 * a reply time must not become a system that nags a stranger.
 *
 * It also does not touch anything marked handled. `handled` is set in /admin
 * when the practice has actually answered, so the escalation stops the moment
 * the promise is kept.
 *
 * BUSINESS DAYS, NOT 24 HOURS
 *
 * "One business day" for a message that arrives on Friday evening means Monday.
 * Counting raw hours would fire an alarm every Saturday morning and train the
 * practice to ignore it, which is how monitoring dies.
 */

/* Only kinds that were promised a reply. A checklist signup asked for a file
 * and got it; nobody is waiting on a human for that one. */
const AWAITS_REPLY = new Set(['enquiry', 'waitlist']);

/** Whole days that are not Saturday or Sunday between two instants. */
export function businessDaysBetween(from: Date, to: Date): number {
  if (to <= from) return 0;
  let days = 0;
  const cur = new Date(from.getTime());
  cur.setUTCHours(0, 0, 0, 0);
  const end = new Date(to.getTime());
  end.setUTCHours(0, 0, 0, 0);
  while (cur < end) {
    cur.setUTCDate(cur.getUTCDate() + 1);
    const d = cur.getUTCDay();
    if (d !== 0 && d !== 6) days += 1;
  }
  return days;
}

export type Overdue = {
  id: string;
  kind: string;
  name: string;
  email: string;
  source: string;
  createdAt: string;
  businessDaysWaiting: number;
};

export type ReplyWatchResult =
  | { ok: false; reason: string }
  | { ok: true; checked: number; overdue: Overdue[]; alerted: boolean; dry: boolean };

/**
 * Finds messages promised a reply that have not had one, and tells the practice.
 *
 * `graceDays` is 1 because the promise is one business day. Anything that has
 * waited longer than that is, strictly, already late — which is the point at
 * which it is still recoverable with an apology rather than lost.
 */
export async function runReplyWatch(
  opts: { dry?: boolean; graceDays?: number; now?: Date } = {}
): Promise<ReplyWatchResult> {
  const dry = opts.dry === true;
  const grace = opts.graceDays ?? 1;
  const now = opts.now ?? new Date();

  const { items } = await readInbound({ fresh: true });
  const candidates = items.filter(
    (i: Inbound) => !i.handled && AWAITS_REPLY.has(i.kind)
  );

  const overdue: Overdue[] = candidates
    .map((i) => ({
      id: i.id,
      kind: i.kind,
      name: i.name,
      email: i.email,
      source: i.source,
      createdAt: i.createdAt,
      businessDaysWaiting: businessDaysBetween(new Date(i.createdAt), now),
    }))
    .filter((o) => o.businessDaysWaiting >= grace)
    /* Longest wait first — if there are several, the oldest is the one most
       likely to already be gone. */
    .sort((a, b) => b.businessDaysWaiting - a.businessDaysWaiting);

  if (!overdue.length) {
    return { ok: true, checked: candidates.length, overdue: [], alerted: false, dry };
  }
  if (dry || !mailConfigured()) {
    return { ok: true, checked: candidates.length, overdue, alerted: false, dry };
  }

  const worst = overdue[0].businessDaysWaiting;
  const subject =
    overdue.length === 1
      ? `Unanswered message, waiting ${worst} business day${worst === 1 ? '' : 's'}`
      : `${overdue.length} unanswered messages, longest ${worst} business days`;

  const lines = overdue.map(
    (o) =>
      `• ${o.name || '(no name given)'} <${o.email}>: ${o.kind}, from ${o.source}, ` +
      `waiting ${o.businessDaysWaiting} business day${o.businessDaysWaiting === 1 ? '' : 's'}`
  );

  const text = [
    `The site promises a reply within one business day on every page. ` +
      `${overdue.length === 1 ? 'One message has' : `${overdue.length} messages have`} passed that.`,
    '',
    ...lines,
    '',
    `Reply directly to each person, then mark them handled at ${site.domain}/admin#inbound.`,
    '',
    `This is the only reminder. Nobody is being chased on your behalf, and the ` +
      `people above have not been contacted again. That is deliberate.`,
  ].join('\n');

  const html =
    `<p>The site promises a reply within one business day on every page. ` +
    `${overdue.length === 1 ? 'One message has' : `${overdue.length} messages have`} passed that.</p>` +
    `<ul>${overdue
      .map(
        (o) =>
          `<li><strong>${o.name || '(no name given)'}</strong> &lt;${o.email}&gt;: ${o.kind}, ` +
          `from <code>${o.source}</code>, waiting ${o.businessDaysWaiting} business day${
            o.businessDaysWaiting === 1 ? '' : 's'
          }</li>`
      )
      .join('')}</ul>` +
    `<p>Reply to each person, then mark them handled at ` +
    `<a href="${site.domain}/admin#inbound">${site.domain}/admin</a>.</p>` +
    `<p style="color:#545e69">This is the only reminder. Nobody is being chased on your behalf.</p>`;

  await sendDetailed(site.email, subject, text, html);

  return { ok: true, checked: candidates.length, overdue, alerted: true, dry };
}
