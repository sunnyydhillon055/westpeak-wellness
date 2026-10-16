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

/* Where the maximum insurable earnings are published: the CRA's EI premium
   rates and maximums table, which lists 68,900 for 2026 and 70,800 for 2027
   (read 15 Oct 2026). The EI sickness page states the weekly maximum but not
   the MIE, so the calculator's figures table cites this one for that row. */
export const EI_MIE_SOURCE =
  'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html';

/* Three leave rules the calculator's figures table states that lib/leave-pay.ts
   does not model as numbers (item 510). Each was read on its official page on
   15 Oct 2026: BC paid sick leave ("at least 90 days"), BC leaves of absence
   ("up to 27 weeks of unpaid leave within any 52-week period") and IPG-118
   ("first 3 days ... after completing their initial 30-day qualifying
   period"). */
export const BC_SICK_DAYS_QUALIFYING_DAYS = 90;
export const ESA_ILLNESS_LEAVE_WEEKS = 27;
export const CLC_FIRST_MEDICAL_DAYS = 3;
export const CLC_QUALIFYING_DAYS = 30;

/** EI sickness benefit weekly maximum, by Pacific calendar year. */
export const EI_SICKNESS_MAX: Record<number, WeeklyBenefitMax> = {
  2026: { weekly: 729, maxInsurableEarnings: 68900, sourceUrl: EI_SICKNESS_SOURCE, readOn: '2026-10-02' },
  2027: { weekly: 749, maxInsurableEarnings: 70800, sourceUrl: EI_SICKNESS_SOURCE, readOn: '2026-10-02' },
};

/** The Pacific "MM-DD" on which eiSicknessMax() moves to the next year's
 *  entry. The pages only move with a build, so this day is in GATE_DATES
 *  (lib/seasonal.ts) and the rebuild workflow has a line for it; the test in
 *  test/gate-dates.test.mts reads it from here. */
export const EI_YEAR_SWITCH = '01-01';

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

/* THE WAITING WEEK, AND THE MEASURE THAT WAIVES IT — 13 Oct 2026.
 *
 * Six leave pages said EI sickness starts "after a one-week unpaid waiting
 * period". Canada.ca, read 13 Oct 2026: the sickness "After you apply" page
 * still describes the one unpaid week, and links to "Temporary Employment
 * Insurance measures to respond to major changes in economic conditions"
 * (modified 6 Oct 2026), which says the waiting period "is waived for all new
 * claims for EI benefits that start between March 30, 2025, and October 9,
 * 2027". So for anyone claiming today there is no unpaid week, and the pages
 * say so while the window is open and say the ordinary rule once it closes,
 * from the same two dates. The pages are static: a build after the end date
 * is what moves them back. test/benefit-figures.test.mts fails once the end
 * date has passed, so the window is re-read rather than left to rot. */
export const EI_WAITING_SOURCE =
  'https://www.canada.ca/en/services/benefits/ei/temporary-measures-for-major-economic-conditions.html';
export const EI_SICKNESS_AFTER_APPLYING =
  'https://www.canada.ca/en/services/benefits/ei/ei-sickness/after-applying.html';

export type WaitingWaiver = { from: string; to: string; sourceUrl: string; readOn: string };

/** Claims starting on or between these Pacific dates serve no waiting week. */
export const EI_WAITING_WAIVER: WaitingWaiver = {
  from: '2025-03-30',
  to: '2027-10-09',
  sourceUrl: EI_WAITING_SOURCE,
  readOn: '2026-10-13',
};

/** The date in British Columbia at `now`, as YYYY-MM-DD. */
export function pacificDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Whether a claim starting at `now` falls inside the waiver. */
export function eiWaitingWaived(now: Date = new Date(), w: WaitingWaiver = EI_WAITING_WAIVER): boolean {
  const d = pacificDate(now);
  return d >= w.from && d <= w.to;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** "9 October 2027" from "2027-10-09". */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m! - 1]} ${y}`;
}

/** True when a claim made on the build date serves no waiting week. */
export const EI_WAITING_WAIVED = eiWaitingWaived();
/** A clause that follows "and": what the waiting week is for a claim made now. */
export const EI_WAITING_CLAUSE = EI_WAITING_WAIVED
  ? `the usual one-week unpaid waiting period is waived for new claims that start by ${longDate(EI_WAITING_WAIVER.to)}`
  : 'there is a one-week unpaid waiting period before benefits start';
