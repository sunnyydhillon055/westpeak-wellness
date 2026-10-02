/* WHAT CLOCK THE CALENDAR IS ON, FOR A READER IN ALBERTA — 2 Oct 2026.
 *
 * Camille's Calgary FAQ, the Alberta hub and two expansion pages said "Times
 * shown to you are Mountain Time … nothing needs converting". Every time the
 * calendar and the next-consultation lines print is Pacific time, and says so
 * (lib/availability-summary.ts, PACIFIC). A Calgary reader who trusted the
 * FAQ booked an hour off.
 *
 * The gap is computed, not typed. Alberta keeps Mountain time with daylight
 * saving; BC's clock is whatever the runtime's time-zone data says it is that
 * day, and that data is moving (Node 22 has BC on permanent UTC-7 from
 * November 2026, Node 24 does not yet). So the sentence reads the offsets for
 * the day it is rendered and says "the same clock" when they match, rather
 * than promising an hour that may not be there.
 *
 * Pure apart from `new Date()` defaults; no roster, safe anywhere. If
 * wf/pacific-time-availability lands its own offset helper, this should be
 * folded into it. */

const offsetMinutes = (timeZone: string, at: Date): number => {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!m) return 0;
  const mins = Number(m[2]) * 60 + Number(m[3] ?? 0);
  return m[1] === '-' ? -mins : mins;
};

/** Whole hours Alberta's clock is ahead of BC's at `at` (0 or 1 in practice). */
export const albertaHoursAhead = (at: Date = new Date()): number =>
  Math.round((offsetMinutes('America/Edmonton', at) - offsetMinutes('America/Vancouver', at)) / 60);

/** "Times on the calendar are Pacific time; Alberta is 1 hour ahead today." */
export function albertaClockSentence(hours: number): string {
  if (hours === 0) return 'Times on the calendar are Pacific time; Alberta is on the same clock as BC today.';
  return `Times on the calendar are Pacific time; Alberta is ${hours} hour${hours === 1 ? '' : 's'} ahead today.`;
}

/** The sentence for the moment it is rendered. */
export const albertaClockLine = (at: Date = new Date()): string => albertaClockSentence(albertaHoursAhead(at));
