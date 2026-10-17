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
 * This file imports only lib/leave-pay.ts, which imports nothing (16 Oct
 * 2026, for the calculator's figures at the end), so a client bundle that
 * reaches it carries a few numbers and no data module. Do not write a dollar
 * sign in front of a weekly figure in this comment: the price-drift scan
 * reads comments too. */

import {
  dollars, EI_RATE, EI_SICKNESS_WEEKS, BC_PAID_DAYS, FEDERAL_MAX_DAYS, FEDERAL_PROTECTED_WEEKS,
} from '@/lib/leave-pay';

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
  2026: { weekly: 729, maxInsurableEarnings: 68900, sourceUrl: EI_SICKNESS_SOURCE, readOn: '2026-10-15' },
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

/* THE CALCULATOR'S FIGURES, AS DATA — 16 Oct 2026 (item 579).
 *
 * The figures table on /tools/stress-leave-pay-calculator (item 510) and the
 * CSV beside it (/tools/stress-leave-pay-calculator/figures.csv) are built
 * from these two lists, so the page, the file and the Dataset node cannot
 * disagree. Moved here from the page module, where the CSV route could not
 * reach them. Every value is composed from the constants above or from
 * lib/leave-pay.ts, which imports nothing, so this file still pulls in no
 * data module; no figure is typed beside its label. Each source carries the
 * date it was read. */
export type LeavePaySource = { label: string; read: string; url: string };
export const LEAVE_PAY_SOURCES: LeavePaySource[] = [
  { label: 'Government of Canada, EI sickness benefits: how much you could receive', read: '2026-10-15', url: EI_SICKNESS_SOURCE },
  { label: 'Canada Revenue Agency, EI premium rates and maximums: maximum annual insurable earnings', read: '2026-10-15', url: EI_MIE_SOURCE },
  { label: 'Government of Canada, EI sickness benefits: do you qualify', read: '2026-10-13', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/qualify.html' },
  { label: 'Government of Canada, EI sickness benefits: apply', read: '2026-10-13', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/apply.html' },
  { label: 'Government of Canada, EI sickness benefits: after you apply, the waiting period and the first payment', read: '2026-10-13', url: EI_SICKNESS_AFTER_APPLYING },
  { label: 'Government of Canada, temporary EI measures: waiving the waiting period', read: '2026-10-15', url: EI_WAITING_WAIVER.sourceUrl },
  { label: 'Province of BC, paid sick leave', read: '2026-10-15', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/paid-sick-leave' },
  { label: 'Government of Canada, medical leave with pay for federally regulated employees, IPG-118', read: '2026-10-15', url: 'https://www.canada.ca/en/employment-social-development/programs/laws-regulations/labour/interpretations-policies/medical-leave-pay.html' },
  { label: 'Province of BC, leaves of absence: serious personal illness or injury leave', read: '2026-10-15', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
  { label: 'Canada Labour Code, s. 239, medical leave of up to 27 weeks', read: '2026-10-15', url: 'https://laws-lois.justice.gc.ca/eng/acts/L-2/section-239.html' },
  { label: 'WorkSafeBC, mental health claims', read: '2026-10-13', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
];
/** The source entry for a URL in LEAVE_PAY_SOURCES. */
export const leavePaySource = (url: string): LeavePaySource => LEAVE_PAY_SOURCES.find((x) => x.url === url)!;

export type LeavePayFigure = { figure: string; value: string; url: string };
export const LEAVE_PAY_FIGURES: LeavePayFigure[] = [
  { figure: 'EI sickness benefit rate', value: `${Math.round(EI_RATE * 100)}% of average weekly insurable earnings`, url: EI_SICKNESS_SOURCE },
  { figure: `EI sickness weekly maximum, ${EI.year}`, value: `${dollars(EI.weekly)} a week, before tax`, url: EI_SICKNESS_SOURCE },
  { figure: `Maximum insurable earnings, ${EI.year}`, value: `${dollars(EI.maxInsurableEarnings)} a year`, url: EI_MIE_SOURCE },
  { figure: 'Length of EI sickness benefits', value: `Up to ${EI_SICKNESS_WEEKS} weeks`, url: EI_SICKNESS_SOURCE },
  {
    figure: 'EI waiting week',
    value: EI_WAITING_WAIVED
      ? `Waived for new claims starting ${longDate(EI_WAITING_WAIVER.from)} to ${longDate(EI_WAITING_WAIVER.to)}`
      : 'One unpaid week before benefits start',
    url: EI_WAITING_WAIVER.sourceUrl,
  },
  { figure: 'BC paid sick days (Employment Standards Act)', value: `${BC_PAID_DAYS} a year, after ${BC_SICK_DAYS_QUALIFYING_DAYS} days with the employer`, url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/paid-sick-leave' },
  { figure: 'BC serious personal illness or injury leave', value: `Up to ${ESA_ILLNESS_LEAVE_WEEKS} weeks in any 52-week period, unpaid and job-protected`, url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
  { figure: 'Canada Labour Code medical leave with pay', value: `${CLC_FIRST_MEDICAL_DAYS} days after ${CLC_QUALIFYING_DAYS} days of employment, then 1 a month, to ${FEDERAL_MAX_DAYS} a year`, url: 'https://www.canada.ca/en/employment-social-development/programs/laws-regulations/labour/interpretations-policies/medical-leave-pay.html' },
  { figure: 'Canada Labour Code medical leave', value: `Up to ${FEDERAL_PROTECTED_WEEKS} weeks, job-protected, unpaid by the employer`, url: 'https://laws-lois.justice.gc.ca/eng/acts/L-2/section-239.html' },
];
/** The newest read date behind the table: when the figures were last checked. */
export const FIGURES_CHECKED = LEAVE_PAY_FIGURES.map((f) => leavePaySource(f.url).read).sort().at(-1)!;

/** Where the figures are published as a file, relative to the site root. */
export const FIGURES_CSV_PATH = '/tools/stress-leave-pay-calculator/figures.csv';

const csvCell = (s: string) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
/** The figures as CSV: one row per figure, with the source page and the
 *  date it was read. CRLF line ends, as RFC 4180 has them. */
export function leavePayFiguresCsv(): string {
  const rows = [['figure', 'value', 'source', 'source_url', 'read_on']];
  for (const f of LEAVE_PAY_FIGURES) {
    const s = leavePaySource(f.url);
    rows.push([f.figure, f.value, s.label, s.url, s.read]);
  }
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
