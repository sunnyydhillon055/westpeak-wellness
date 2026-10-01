import type { Inbound } from './inbound';
import { isTestSubmission, looksDisposable } from './inbound-quality';

/* WHO THE NURTURE CRON MAY WRITE TO, AS A PURE FUNCTION — 1 Oct 2026.
 *
 * Pulled out of lib/nurture.ts so it can be tested without Blob or Resend,
 * because the rule it enforces failed in production. 64 of the 69 stored
 * leads on 1 Oct were scripts that had filled the hidden honeypot field
 * (band 'quarantine'), and runNurture never read the band: the ledger already
 * showed email 2 sent to four of them and email 3 to one, and about fifty more
 * reached day 4 on 2 Oct. Unsolicited mail from the domain that sends booking
 * confirmations is how those confirmations end up in spam.
 *
 * THE ORDER IS THE POLICY
 *
 *   quarantine     a tripped honeypot. Never a person.
 *   bot            this project's probes, throwaway addresses.
 *   noAck          email 1 never went (no mail exchanger, the throttle, a
 *                  send that failed), or the lead predates the wording that
 *                  told people two more emails would follow. Either way the
 *                  person was not told about a sequence, so there is none.
 *   optedOut       one click, honoured for good.
 *   alreadyClient  a client, or somebody in conversation with the practice.
 *   done           all three sent, or dormant past 45 days.
 *   notDue         day 4 for email 2, day 11 for email 3.
 */

/* The first moment the sign-up wording said "two more short ones over the
 * next fortnight, then nothing" rather than "a one-off, not a sequence".
 * Under CASL the consent covers what the person was told, so a lead from
 * before it gets nothing further. `ackSentAt` is the stronger guard (only the
 * new code writes it); this date is the second one, in case a record ever
 * arrives with an ackSentAt from somewhere else. */
export const NURTURE_FROM = '2026-10-01T00:00:00Z';

export type NurtureSkip = 'quarantine' | 'bot' | 'noAck' | 'optedOut' | 'alreadyClient' | 'done' | 'notDue';
export type NurtureDecision = { send: 2 | 3 } | { skip: NurtureSkip };

export type NurtureContext = {
  /** Highest step already sent to this address; email 1 counts as 1. */
  step?: number;
  optedOut: boolean;
  /** A client, or has an enquiry on file. */
  known: boolean;
  now: number;
};

export function nurtureDecision(
  lead: Pick<Inbound, 'email' | 'name' | 'triage' | 'createdAt' | 'ackSentAt'>,
  ctx: NurtureContext
): NurtureDecision {
  if (lead.triage?.band === 'quarantine') return { skip: 'quarantine' };
  if (!lead.email || isTestSubmission(lead) || looksDisposable(lead.email)) return { skip: 'bot' };
  if (!lead.ackSentAt || Date.parse(lead.createdAt) < Date.parse(NURTURE_FROM)) return { skip: 'noAck' };
  if (ctx.optedOut) return { skip: 'optedOut' };
  if (ctx.known) return { skip: 'alreadyClient' };

  const done = ctx.step ?? 1;
  if (done >= 3) return { skip: 'done' };
  const next = (done + 1) as 2 | 3;
  const ageDays = (ctx.now - Date.parse(lead.createdAt)) / 864e5;
  if (ageDays < (next === 2 ? 4 : 11)) return { skip: 'notDue' };
  /* A long-dormant lead is not worth waking. */
  if (ageDays > 45) return { skip: 'done' };
  return { send: next };
}

/* WHICH ONE-PAGER THEY ASKED FOR, IN WORDS — 1 Oct 2026.
 * Emails 2 and 3 said "you asked for the coverage checklist" to everyone; 39
 * of 60 September leads had asked for something else. Keys match
 * MAGNET_KEYS in lib/conversion-detail.ts; an unknown key reads as the
 * checklist, which is also what the submit path falls back to. */
export type MagnetWords = { asked: string; that: string; alert: string };

export const MAGNET_WORDS: Record<string, MagnetWords> = {
  'coverage-checklist': {
    asked: 'the coverage checklist', that: 'that checklist', alert: 'Coverage checklist requested',
  },
  'icbc-after-a-crash': {
    asked: 'the ICBC one-pager', that: 'that one-pager', alert: 'ICBC one-pager requested',
  },
  'starting-counselling': {
    asked: 'the one-pager on starting counselling', that: 'that one-pager',
    alert: 'Starting-counselling one-pager requested',
  },
};

export const magnetWords = (magnet?: string): MagnetWords =>
  MAGNET_WORDS[magnet ?? ''] ?? MAGNET_WORDS['coverage-checklist'];

/* The promise every sign-up surface now makes, word for word from
 * NURTURE_SEQUENCE.md. Kept here so the three email-1 endings say the same
 * thing; components/LeadCapture.tsx repeats it as a literal because a client
 * component must not import server modules. */
export const SEQUENCE_PROMISE = 'No sequence of sales emails: two more short ones over the next fortnight, then nothing.';
