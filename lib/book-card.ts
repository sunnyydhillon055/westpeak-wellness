/* The short form of a /book card's availability line, for phones — 1 Oct 2026.
 *
 * The full sentence (availabilityLine in lib/availability-summary.ts) runs to
 * three lines on a 390px card and was most of why each card stood 340-400px
 * tall. On a phone the card says how many times are open and nothing more;
 * the days and times are one tap away, inside the calendar the card opens.
 * It names no hours and no days, so it cannot drift into an availability
 * claim the calendar does not back. Pure, typed structurally, no imports. */

export function shortAvailabilityLine(a: { count: number; error?: string } | null | undefined): string | null {
  if (!a || a.error) return null;
  if (a.count === 0) return 'No open times in the next two weeks.';
  return `${a.count} open ${a.count === 1 ? 'time' : 'times'} in the next two weeks.`;
}
