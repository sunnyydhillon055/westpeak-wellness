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
