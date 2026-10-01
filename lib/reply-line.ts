import type { Inbound } from './inbound';
import { isRealSubmission } from './inbound-quality';
import { replyTimeStats, type ReplyTimeStats } from './reply-templates';

/* THE MEASURED REPLY TIME, ONE DEFINITION FOR EVERY PAGE — 1 Oct 2026.
 *
 * /contact printed a median once five answered messages had a handledAt, and
 * computed it inline over every stored record. Two things were wrong with
 * that once /book and /message-sent wanted the same sentence: a third copy of
 * the rule would drift, and "every stored record" includes one-pager requests
 * (nobody replies to those) and honeypot-tripped scripts (/admin's Done marks
 * them too). So the sample is real enquiries only, and the threshold stays at
 * five: one good week must never mint a claim.
 *
 * Timestamps come from the "Mark answered" link in the practice alert
 * (lib/answered-link.ts) and the Done button in /admin. Nothing is
 * back-filled.
 */

export function measuredReply(items: Inbound[]): ReplyTimeStats {
  return replyTimeStats(items.filter((i) => i.kind === 'enquiry' && isRealSubmission(i)));
}

/** "18 hours" or "one business day". */
const medianWords = (s: ReplyTimeStats) =>
  s.medianHours < 24 ? `${s.medianHours} hours` : 'one business day';

/** The /contact info line: the promise, plus the measurement once it exists. */
export function contactReplyLine(s: ReplyTimeStats): string {
  return s.ready
    ? `Replies within one business day, median so far: ${medianWords(s)}, measured across ${s.sample} messages`
    : 'Replies within one business day';
}

/** One sentence for /book and /message-sent, or null until five replies are measured. */
export function measuredReplySentence(s: ReplyTimeStats): string | null {
  return s.ready
    ? `Measured so far: the median reply has taken ${medianWords(s)}, across ${s.sample} answered messages.`
    : null;
}
