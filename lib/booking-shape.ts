/* ============================================================================
   WHAT WAS BOOKED — read from the booking, never guessed
   ----------------------------------------------------------------------------
   On 30 Aug 2026 a client booked the free 15-minute consultation. Cliniko
   recorded it correctly. The confirmation this site sent said "50 minutes",
   under the subject "Your session is booked" rather than "Your free
   consultation is booked".

   One line in lib/booking-notify.ts did both:

       minutes:   Number(ap.duration_in_minutes ?? 50)
       isConsult: Number(ap.duration_in_minutes ?? 50) <= 20

   `GET /v1/appointments` does not return `duration_in_minutes`. It returns
   `starts_at`, `ends_at`, and `appointment_type` as a link object. The field
   was always undefined, so the fallback always fired: every consultation ever
   booked was confirmed as a 50-minute session and queued for the follow-up
   meant for paying clients. Not an edge case — the only path.

   TWO RULES

     1. Duration is DERIVED from starts_at/ends_at and is null when it cannot
        be. Null prints nothing. A default must never state a fact about
        someone's booking — a confirmation that omits the length is a gap, one
        that asserts the wrong length is a lie the client acts on.
     2. Consultation-or-not comes from the APPOINTMENT TYPE. Identity is a
        property of what was booked, not of how long it happens to run, and it
        decides which follow-up the person receives.

   Kept in its own module, separate from the polling and mail I/O, so it can be
   exercised directly by scripts/booking-mapping.mjs against payloads shaped
   the way Cliniko really sends them. The original bug survived because no test
   could reach the mapping without a Cliniko key and a mail server.
   ========================================================================= */

export type ApptLike = {
  starts_at?: string;
  ends_at?: string | null;
  /** Not returned by /v1/appointments. Honoured if it ever appears. */
  duration_in_minutes?: number | null;
  appointment_type?: { links?: { self?: string } } | null;
};

/** Minutes, or null when the appointment does not say. Never a default. */
export function durationOf(ap: ApptLike): number | null {
  const start = ap.starts_at ? Date.parse(ap.starts_at) : NaN;
  const end = ap.ends_at ? Date.parse(ap.ends_at) : NaN;
  if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
    return Math.round((end - start) / 60_000);
  }
  const d = Number(ap.duration_in_minutes);
  return Number.isFinite(d) && d > 0 ? d : null;
}

/** True only when the booking IS the free consultation type.
 *
 *  The id is passed in rather than imported so this module depends on nothing
 *  at all — that is what lets scripts/booking-mapping.mjs load and exercise it
 *  directly. The caller supplies site.CONSULT_TYPE. */
export function isConsultAppointment(ap: ApptLike, consultTypeId: string): boolean {
  const self = ap.appointment_type?.links?.self;
  if (!self || !consultTypeId) return false;
  /* The type id is the last path segment of the link. */
  return self.split('/').filter(Boolean).pop() === consultTypeId;
}
