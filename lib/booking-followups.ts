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
  appointment_type?: { links?: { self?: string } } | null;
  practitioner?: { links?: { self?: string } } | null;
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

/* ============================================================================
   PAID CLIENTS — 1 Oct 2026
   ----------------------------------------------------------------------------
   Everything above watches consultations. Nothing watched a paying client who
   went quiet after a session, and a cancelled paid session was the commonest
   point at which a weekly client stopped without anybody noticing. The
   decisions below are the paid half: who has nothing booked, whether the
   after-session note is worth sending again, and who has not been seen in a
   long while. Pure, like the rest of this file.
   ========================================================================= */

type Linked = { links?: { self?: string } } | null;

/** The appointment-type id, from the type link. */
export const typeIdOf = (ap: { appointment_type?: Linked }) => idFromLink(ap.appointment_type?.links?.self);
/** The Cliniko practitioner id, from the practitioner link. */
export const practitionerIdOf = (ap: { practitioner?: Linked }) => idFromLink(ap.practitioner?.links?.self);
/** The Cliniko patient id, from the patient link. */
export const patientIdOf = (ap: ApptLite) => idFromLink(ap.patient?.links?.self);

const live = (ap: ApptLite) => !ap.cancelled_at && !ap.archived_at;
const startOf = (ap: ApptLite) => Date.parse(ap.starts_at as string);
const endOf = (ap: ApptLite) => Date.parse((ap.ends_at || ap.starts_at) as string);
/** Took place: not cancelled, not archived, attended, and over. */
const held = (ap: ApptLite, now: number) => live(ap) && !ap.did_not_arrive && Number.isFinite(endOf(ap)) && endOf(ap) <= now;

/* The same patient's next appointment that is still on, starting after this
   one (or after `from`, when given: a cancelled session asks what has been
   booked since the cancellation, which may be EARLIER than the slot that was
   cancelled), or null. Any type counts: a consultation booked after a
   session is still something booked. Reads only the list the caller holds. */
export function nextAfter<A extends ApptLite>(appts: A[], ap: A, from?: number): A | null {
  const pid = patientIdOf(ap);
  const start = from ?? startOf(ap);
  if (!pid || !Number.isFinite(start)) return null;
  let best: A | null = null;
  for (const o of appts) {
    if (o === ap || patientIdOf(o) !== pid || !live(o)) continue;
    const s = startOf(o);
    if (!Number.isFinite(s) || s <= start) continue;
    if (!best || s < startOf(best)) best = o;
  }
  return best;
}

/** Ledger key for the paid-lapse notice: patient and the session it is about. */
export const lapsedKey = (ap: ApptLite) => `${patientIdOf(ap)}:${ap.id}`;

/* A PAYING CLIENT WITH NOTHING BOOKED.
 *
 *   - the patient's LATEST held paid appointment (not a consultation, not
 *     cancelled, archived or did-not-arrive);
 *   - which ended 14 to 18 days ago, so a weekly or fortnightly client has
 *     clearly missed their usual rhythm and the cron has five days to catch it;
 *   - with nothing at all booked after it;
 *   - and not already the subject of this notice for that same session.
 *
 * Keyed on patient AND session, not patient alone: somebody who comes back,
 * has more sessions and goes quiet again is a new situation, but the same
 * gap is never noticed twice. Returns the last sessions; nothing here or in
 * the caller writes to the client. */
export function lapsedPaidClients<A extends ApptLite>(
  appts: A[],
  opts: { now: number; isConsult: (ap: A) => boolean; alreadyAlerted: Set<string> },
): A[] {
  const latest = new Map<string, A>();
  for (const ap of appts) {
    if (opts.isConsult(ap) || !held(ap, opts.now)) continue;
    const pid = patientIdOf(ap);
    if (!pid) continue;
    const prev = latest.get(pid);
    if (!prev || startOf(prev) < startOf(ap)) latest.set(pid, ap);
  }
  const out: A[] = [];
  for (const ap of latest.values()) {
    const since = opts.now - endOf(ap);
    if (since < 14 * DAY || since > 18 * DAY) continue;
    if (opts.alreadyAlerted.has(lapsedKey(ap))) continue;
    if (nextAfter(appts, ap)) continue;
    out.push(ap);
  }
  return out;
}

/* WHETHER THE AFTER-SESSION NOTE GOES OUT.
 *
 * It sent the same text and button after every paid session, so a weekly
 * client got the identical email every week, which reads as automated and
 * careless (see the header of lib/booking-notify.ts). Now it goes after the
 * FIRST paid session with that counsellor, or after any session with nothing
 * booked after it. `next`, when there is one, is shown in the email instead
 * of a booking button.
 *
 * "First" is judged on the list the job already reads, which reaches 20 days
 * back. Someone seen monthly therefore counts as first each time, and gets the
 * note: the safe direction, since it says when the next session is. */
export function paidFollowUpPlan<A extends ApptLite>(
  ap: A, appts: A[], opts: { isConsult: (ap: A) => boolean },
): { send: boolean; first: boolean; next: A | null } {
  const next = nextAfter(appts, ap);
  const pid = patientIdOf(ap);
  const who = practitionerIdOf(ap);
  const start = startOf(ap);
  const first = !appts.some((o) =>
    o !== ap && patientIdOf(o) === pid && !opts.isConsult(o) && live(o) && !o.did_not_arrive &&
    practitionerIdOf(o) === who && startOf(o) < start);
  return { send: first || !next, first, next };
}

/* NOT SEEN LATELY, for /admin.
 *
 * Patients with at least one held paid session, the last of which ended
 * `minDays` or more ago, and nothing upcoming of any kind. "Reaching back"
 * lists only clients whose status a person changed, and the Cliniko sync
 * never changes a status, so that list stayed empty while this one is what
 * actually happened. Whether to write is still a person's decision, one row
 * at a time. Most recently seen first: they are the likeliest to want it. */
export type NotSeenRow<A> = { patientId: string; last: A; held: number; daysSince: number };
export function notSeenLately<A extends ApptLite>(
  appts: A[],
  opts: { now: number; isConsult: (ap: A) => boolean; minDays?: number },
): NotSeenRow<A>[] {
  const minDays = opts.minDays ?? 45;
  const byPatient = new Map<string, { last: A; held: number; upcoming: boolean }>();
  for (const ap of appts) {
    const pid = patientIdOf(ap);
    if (!pid) continue;
    const row = byPatient.get(pid) ?? { last: undefined as unknown as A, held: 0, upcoming: false };
    if (live(ap) && startOf(ap) > opts.now) row.upcoming = true;
    if (!opts.isConsult(ap) && held(ap, opts.now)) {
      row.held++;
      if (!row.last || startOf(row.last) < startOf(ap)) row.last = ap;
    }
    byPatient.set(pid, row);
  }
  const out: NotSeenRow<A>[] = [];
  for (const [patientId, r] of byPatient) {
    if (!r.held || r.upcoming) continue;
    const daysSince = Math.floor((opts.now - endOf(r.last)) / DAY);
    if (daysSince < minDays) continue;
    out.push({ patientId, last: r.last, held: r.held, daysSince });
  }
  return out.sort((a, b) => a.daysSince - b.daysSince);
}
