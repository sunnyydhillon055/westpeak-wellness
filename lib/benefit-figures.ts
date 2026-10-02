/* PUBLIC BENEFIT FIGURES, KEYED BY YEAR — 2 Oct 2026 (item 386).
 *
 * WHY THIS FILE EXISTS
 *
 * The EI sickness weekly maximum was typed twelve times across the stress
 * leave guide, the EI guide and the workplace leave resource, each copy saying
 * "in 2026". Those are the leave pages that rank, and on 1 January every one
 * of them would have stated last year's figure. The figure is now written
 * once, here, keyed by the Pacific calendar year, and the pages compose their
 * sentences from it.
 *
 * HOW THE FIGURE IS SET
 *
 * The weekly maximum is 55% of the year's maximum insurable earnings (MIE),
 * divided by 52 and rounded to the dollar. `weekly` is the published figure;
 * `maxInsurableEarnings` is there so a test can check the two agree.
 *
 *   2026  MIE 68,900  -> 729 a week (canada.ca EI sickness page, read 2 Oct 2026)
 *   2027  MIE 70,800  -> 749 a week (ESDC release of 14 Sep 2026 setting the
 *                        2027 MIE; read 2 Oct 2026)
 *
 * KEEPING IT HONEST
 *
 * scripts/price-drift.mjs fails the run if the current Pacific year has no
 * entry, or if either weekly figure is typed as a dollar literal anywhere in
 * lib/, app/ or components/. When ESDC announces the next year's MIE (usually
 * September or October), add the entry and its readOn here; nothing else
 * changes. Until it is added, the pages keep stating the latest year that has
 * one, with that year named, which is stale but never false.
 *
 * Pages are statically built, so the year is the year of the build: a deploy
 * on or after 1 January is what moves the pages to the new figure.
 *
 * This file imports nothing, so a client bundle that reaches it carries a few
 * numbers and no data module. Do not write a dollar sign in front of a
 * weekly figure in this comment: the price-drift scan reads comments too. */

export type WeeklyBenefitMax = {
  /** The published weekly maximum, in whole dollars. */
  weekly: number;
  /** Maximum insurable earnings for the year, in whole dollars. */
  maxInsurableEarnings: number;
  sourceUrl: string;
  /** ISO date the source was read. */
  readOn: string;
};

export const EI_SICKNESS_SOURCE =
  'https://www.canada.ca/en/services/benefits/ei/ei-sickness/benefit-amount.html';

/** EI sickness benefit weekly maximum, by Pacific calendar year. */
export const EI_SICKNESS_MAX: Record<number, WeeklyBenefitMax> = {
  2026: { weekly: 729, maxInsurableEarnings: 68900, sourceUrl: EI_SICKNESS_SOURCE, readOn: '2026-10-02' },
  2027: { weekly: 749, maxInsurableEarnings: 70800, sourceUrl: EI_SICKNESS_SOURCE, readOn: '2026-10-02' },
};

/** The calendar year in British Columbia at `now`. */
export function pacificYear(now: Date = new Date()): number {
  return Number(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric' }).format(now));
}

/** The entry for the Pacific year at `now`, or the latest earlier year that
 *  has one (stale, but named, so the sentence stays true). */
export function eiSicknessMax(now: Date = new Date(), table: Record<number, WeeklyBenefitMax> = EI_SICKNESS_MAX): WeeklyBenefitMax & { year: number; current: boolean } {
  const want = pacificYear(now);
  const years = Object.keys(table).map(Number).sort((a, b) => a - b);
  const year = table[want] ? want : [...years].reverse().find((y) => y <= want) ?? years[0]!;
  return { ...table[year]!, year, current: year === want };
}

const EI = eiSicknessMax();

/** The year the figure below applies to: "2026". */
export const EI_YEAR = String(EI.year);
/** The weekly maximum with its dollar sign, for the current year. */
export const EI_WEEKLY = `$${EI.weekly}`;
/** "<dollar figure> a week in <year>". */
export const EI_WEEKLY_IN_YEAR = `${EI_WEEKLY} a week in ${EI_YEAR}`;
