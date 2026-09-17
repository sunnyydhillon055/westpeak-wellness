import { readInbound, type Inbound } from '@/lib/inbound';
import { awaitsHumanReply } from '@/lib/inbound-quality';

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
 *
 * IT NO LONGER EMAILS, AND IT NO LONGER COUNTS BOTS - 17 Sep 2026
 *
 * Both changes come from the same morning. The watch had been emailing a list
 * of thirty-three "unanswered" messages: eight of them this project's own test
 * submissions, the rest newsletter scripts and crypto spam from throwaway
 * domains. Not one was a person waiting. It had been doing this every weekday
 * morning, which is how a monitor teaches the person reading it that the
 * subject does not matter.
 *
 * So the list is filtered through lib/inbound-quality.ts, which already knew
 * how to tell a script from a person and was being used only by the admin
 * digest; and the result is rendered in /admin beside each message rather than
 * sent. The owner asked for the mail to stop, and a monitor that has not once
 * been right has no standing to argue.
 */

/* Only kinds that were promised a reply. A checklist signup asked for a file
 * and got it; nobody is waiting on a human for that one. */
const AWAITS_REPLY = new Set(['enquiry']);

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
  /* Not handled, promised a reply, and actually a person - see
     lib/inbound-quality.ts for what the third clause excludes and why. */
  const candidates = items.filter(
    (i: Inbound) => !i.handled && AWAITS_REPLY.has(i.kind) && awaitsHumanReply(i)
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

  /* Nothing is sent from here. The caller logs the count and /admin shows each
     message with how long it has waited. Nobody is chased on the practice's
     behalf - that part was always the point and is unchanged. */
  return { ok: true, checked: candidates.length, overdue, alerted: false, dry };
}
