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

/* ICBC'S OWN COUNSELLING RATE, BESIDE THIS PRACTICE'S FEE — 1 Oct 2026 (item 366).
 *
 * ICBC publishes what it pays for a counselling treatment in the first twelve
 * weeks after a crash, and re-sets it every 1 April. Read on ICBC's page
 * "Accessing treatment during your first 12 weeks of recovery" on 1 Oct 2026:
 * 12 pre-approved counselling treatments, 160 dollars per treatment, minimum 50
 * minutes, for treatments between 1 April 2026 and 31 March 2027; no referral
 * or ICBC approval needed; out-of-pocket receipts submitted within 180 days are
 * reimbursed "to the level of our approved rates". The window is carried with
 * the figure so a test fails once it lapses rather than the page quietly
 * printing last year's rate. The practice's own fee comes from the catalogue. */
export const ICBC_COUNSELLING = {
  treatments: 12,
  cents: 16000,
  minMinutes: 50,
  from: '2026-04-01',
  to: '2027-03-31',
  read: '2026-10-01',
} as const;

/** The sentence that sets this practice's individual fee beside ICBC's
 *  published rate. Says which side of the rate the fee falls on and nothing
 *  about whether ICBC will reimburse: that is the adjuster's answer. */
export function icbcFeeSentence(catalog: Catalog = FALLBACK_CATALOG): string {
  const ind = cents('Individual Counselling', catalog);
  const rate = money(ICBC_COUNSELLING.cents);
  const where =
    ind.cents > ICBC_COUNSELLING.cents
      ? `above ICBC’s ${rate} rate, so where ICBC reimburses a receipt from here, the ${money(ind.cents - ICBC_COUNSELLING.cents)} difference on each session stays with you`
      : ind.cents === ICBC_COUNSELLING.cents
        ? `the same as ICBC’s ${rate} rate`
        : `below ICBC’s ${rate} rate`;
  return (
    `For comparison, an individual session at this practice is ${money(ind.cents)} for ${ind.minutes} minutes, ${where}. ` +
    'This practice is not an ICBC vendor and does not bill ICBC directly, so you pay at booking and submit the receipt yourself; confirm with your adjuster, before the first session, that ICBC will reimburse a counsellor outside its Recovery Network.'
  );
}

/* THE INDIVIDUAL FEE AS A PHRASE — 3 Oct 2026 (item 431). For a table cell
   or a sentence that sets this practice's fee beside something else ("an
   individual session here is …"), read from the catalogue like every figure
   above. */
export function individualFeePhrase(catalog: Catalog = FALLBACK_CATALOG): string {
  const ind = cents('Individual Counselling', catalog);
  return `${money(ind.cents)} for ${ind.minutes} minutes`;
}
