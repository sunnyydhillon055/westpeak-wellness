/* Client reviews.
 *
 * SHIPPED EMPTY, ON PURPOSE, AND IT MUST STAY THAT WAY UNTIL REAL ONES EXIST.
 *
 * Two independent reasons, either of which is sufficient:
 *
 *   1. BCACC advertising standards prohibit testimonials from counselling
 *      clients. This is not a technicality about wording — soliciting a public
 *      endorsement from someone in a therapeutic relationship is a conflict of
 *      interest, because the person being asked is not in a position to freely
 *      decline. Whatever a review says, the act of collecting it is the problem.
 *
 *   2. Invented reviews are fraud, and AggregateRating markup built on them is
 *      fraud a search engine can act on.
 *
 * So why does this file exist at all? Because non-client reviews are permitted
 * and useful: a colleague, a supervisor, a referring GP, a workshop attendee.
 * The component and schema are ready for those. `sourceNote` is required rather
 * than optional so that whoever adds an entry has to state where it came from
 * and cannot quietly add a client quote.
 *
 * If this array is empty the component renders nothing at all — no placeholder,
 * no "reviews coming soon", no AggregateRating with zero ratings. An empty
 * section advertising its own emptiness is worse than no section.
 */

export type Review = {
  /** Attribution as it may lawfully appear. Never a current or former client. */
  author: string;
  /** Their relationship to the practice — shown, not hidden. */
  relationship: string;
  body: string;
  /** Where this came from and how consent was obtained. Required. */
  sourceNote: string;
  datePublished: string;
  /** Only for genuinely rated sources such as a Google Business Profile. */
  rating?: 1 | 2 | 3 | 4 | 5;
};

export const reviews: Review[] = [
  // Intentionally empty. See the note above before adding anything.
  //
  // A permissible entry looks like this:
  // {
  //   author: 'Dr A. Example, MD',
  //   relationship: 'Referring family physician, Abbotsford',
  //   body: 'Referrals are acknowledged quickly and clients report feeling heard.',
  //   sourceNote: 'Written for the website at our request, reviewed and approved by the author 2026-08-01.',
  //   datePublished: '2026-08-01',
  // },
];

/** Ratings only ever come from genuinely rated sources, so an average is only
 *  computed when such reviews actually exist. Never synthesised. */
export function aggregate(): { value: number; count: number } | null {
  const rated = reviews.filter((r) => typeof r.rating === 'number');
  if (rated.length === 0) return null;
  const sum = rated.reduce((n, r) => n + (r.rating as number), 0);
  return { value: Math.round((sum / rated.length) * 10) / 10, count: rated.length };
}
