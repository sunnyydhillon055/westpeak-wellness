import { FALLBACK_CATALOG, money, type Catalog } from '@/lib/cliniko-catalog';

/* HOW MANY SESSIONS A PLAN MAXIMUM BUYS — 1 Oct 2026.
 *
 * The coverage page (/resources/does-my-plan-cover-counselling-bc) gave plan
 * maximums of $500 and $1,500 and no fee to read them against, so a reader
 * could not tell what either figure meant here. The answer is arithmetic on
 * the catalogue, done here rather than typed, so a fee change in Cliniko
 * changes the session counts with it and scripts/price-drift.mjs has nothing
 * hand-typed to catch.
 *
 * Whole sessions only, rounded down: a plan maximum that runs out partway
 * through a session leaves the client paying the rest of that one, and "about
 * 3.6 sessions" is not a number anybody books.
 *
 * Kept free of any large data module so it can be imported anywhere. */

/** Whole sessions a plan maximum covers at a fee, both in integer cents,
 *  assuming the plan pays the full fee (no per-visit cap, no percentage). */
export function sessionsCovered(maxCents: number, feeCents: number): number {
  if (!Number.isFinite(maxCents) || !Number.isFinite(feeCents) || maxCents <= 0 || feeCents <= 0) return 0;
  return Math.floor(maxCents / feeCents);
}

function cents(name: string, catalog: Catalog): { cents: number; minutes: number } {
  const item = catalog.items.find((i) => i.name === name);
  if (!item) throw new Error(`catalogue has no "${name}"`);
  return { cents: item.cents, minutes: item.minutes };
}

/** The paragraph the coverage page carries: this practice's fees, how far a
 *  $500 and a $1,500 maximum go at them, the caveat, and the cost tool. */
export function planMaximumParagraph(catalog: Catalog = FALLBACK_CATALOG): string {
  const ind = cents('Individual Counselling', catalog);
  const cpl = cents('Couples Counselling', catalog);
  const low = sessionsCovered(50000, ind.cents);
  const high = sessionsCovered(150000, ind.cents);
  const lowCpl = sessionsCovered(50000, cpl.cents);
  const highCpl = sessionsCovered(150000, cpl.cents);
  return (
    `What that buys here: an individual session is ${money(ind.cents)} for ${ind.minutes} minutes and a couples session ${money(cpl.cents)} for ${cpl.minutes} minutes, ` +
    'paid by card at booking, with a receipt carrying the counsellor’s registration number. ' +
    `If the plan pays the whole fee, a $500 annual maximum covers about ${low} individual sessions (${lowCpl} couples sessions) and a $1,500 maximum about ${high} (${highCpl} couples). ` +
    'Many plans do not pay the whole fee: some cap each visit and some reimburse a percentage, which leaves part of every session with you and changes the count. ' +
    'The [cost estimator](/tools/therapy-cost-bc) does the same arithmetic with your plan’s own numbers.'
  );
}

/* WHAT A REMAINING BALANCE BUYS — 1 Oct 2026 (items 210 and 212).
 *
 * The year-end sections talk about what is left on a plan, not the whole
 * maximum, so the figures are the two a reader is likely to have left in
 * the autumn, $300 and $600. Same rule as above: catalogue fee, whole
 * sessions, rounded down, and the plan paying the full fee is an assumption
 * stated in the sentence rather than buried. */

/** Whole individual sessions a remaining balance (integer cents) covers at
 *  the catalogue's individual fee, assuming no per-visit cap. */
export function remainingBalanceSessions(balanceCents: number, catalog: Catalog = FALLBACK_CATALOG): number {
  return sessionsCovered(balanceCents, cents('Individual Counselling', catalog).cents);
}

/** The sentence the year-end sections carry. */
export function remainingBalanceSentence(catalog: Catalog = FALLBACK_CATALOG): string {
  const ind = cents('Individual Counselling', catalog);
  const n300 = remainingBalanceSessions(30000, catalog);
  const n600 = remainingBalanceSessions(60000, catalog);
  const word = (n: number) => (n === 1 ? 'session' : 'sessions');
  return (
    `At this practice’s individual fee of ${money(ind.cents)} for ${ind.minutes} minutes, $300 left on a plan covers ${n300} whole ${word(n300)} and $600 covers ${n600}, ` +
    'if the plan pays the full fee. Many plans cap each visit or pay a percentage, which leaves part of every session with you and changes the count; ' +
    'the [cost estimator](/tools/therapy-cost-bc) does the arithmetic with your plan’s own numbers.'
  );
}
