/* ============================================================================
   PURE DECISIONS BEHIND THE BOOKING JOB — 1 Oct 2026
   ----------------------------------------------------------------------------
   lib/booking-notify.ts needs a Cliniko key, Blob and a mail server, so
   nothing in it can be tested directly. The decisions that can go wrong
   quietly live here instead, importing nothing but lib/site.ts, and test/booking-mail.test.mts
   exercises them against appointments shaped the way Cliniko sends them.
   ========================================================================= */

import { site } from '@/lib/site';

/* Reply-to for the consultation note, which she signs: her address and
   info@, or info@ alone when the roster has no address for her. */
export const consultReplyTo = (pr?: { alertEmail?: string }): string | string[] =>
  pr?.alertEmail ? [pr.alertEmail, site.email] : site.email;

export type ApptLite = {
  id: string | number;
  starts_at?: string;
  ends_at?: string | null;
  cancelled_at?: string | null;
  archived_at?: string | null;
  did_not_arrive?: boolean | null;
  patient?: { links?: { self?: string } } | null;
  telehealth_url?: string | null;
};

/** The last path segment of a Cliniko link: its id. */
export const idFromLink = (link?: string | null) => (link ? link.split('/').filter(Boolean).pop() ?? '' : '');

/* THE VIDEO JOIN LINK. Cliniko's Telehealth puts a per-appointment URL on
   the appointment (`telehealth_url`) once Telehealth is switched on for the
   account. Until it is, the field is absent or null and the emails say what
   they always said: the link is in Cliniko's own email.

   Accepted only as an https URL on a cliniko.com host, so a stray value can
   never become a button in a client's email. Anything else is null. NOT YET
   SEEN on a live appointment from this account (no Cliniko key on the
   machine this was written on); see the commit for how to confirm it. */
export function telehealthUrlOf(ap: { telehealth_url?: unknown }): string | null {
  const raw = typeof ap.telehealth_url === 'string' ? ap.telehealth_url.trim() : '';
  if (!raw) return null;
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return null;
    if (u.hostname !== 'cliniko.com' && !u.hostname.endsWith('.cliniko.com')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

const DAY = 864e5;

/* A CONSULTATION THAT DID NOT BECOME A SESSION.
 *
 * docs/CLIENT_FOLLOWUPS.md, draft 3, says to write once, about two weeks after
 * a consultation, when no session has been booked. Nothing told anybody who
 * those people were. This finds them:
 *
 *   - a consultation, not cancelled, not archived, not marked did-not-arrive;
 *   - whose automatic day-after note went out (it is in `followedUp`), and
 *     which ended 11 to 15 days ago, so that note went 10 to 14 days ago;
 *   - whose patient has no later appointment that is not a consultation and
 *     not cancelled, in the same list the job already read (it reaches 120
 *     days ahead, so a booked session is in it);
 *   - and whose patient has never been the subject of this alert, ever.
 *
 * One per patient: the latest qualifying consultation wins. Returns the
 * consultation appointments; the caller sends the practice the notice. */
export function unconvertedConsults<A extends ApptLite>(
  appts: A[],
  opts: { now: number; isConsult: (ap: A) => boolean; followedUp: Set<string>; alreadyAlerted: Set<string> },
): A[] {
  const byPatient = new Map<string, A>();
  for (const ap of appts) {
    if (!opts.isConsult(ap) || ap.cancelled_at || ap.archived_at || ap.did_not_arrive) continue;
    const id = String(ap.id);
    if (!opts.followedUp.has(id)) continue;
    const pid = idFromLink(ap.patient?.links?.self);
    if (!pid || opts.alreadyAlerted.has(pid)) continue;
    const end = Date.parse((ap.ends_at || ap.starts_at) as string);
    if (!Number.isFinite(end)) continue;
    const since = opts.now - end;
    if (since < 11 * DAY || since > 15 * DAY) continue;
    const start = Date.parse(ap.starts_at as string);
    const converted = appts.some((o) =>
      o !== ap &&
      idFromLink(o.patient?.links?.self) === pid &&
      !opts.isConsult(o) && !o.cancelled_at && !o.archived_at &&
      Date.parse(o.starts_at as string) > start);
    if (converted) continue;
    const prev = byPatient.get(pid);
    if (!prev || Date.parse(prev.starts_at as string) < start) byPatient.set(pid, ap);
  }
  return [...byPatient.values()];
}
