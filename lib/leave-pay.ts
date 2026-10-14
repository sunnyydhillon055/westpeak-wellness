/* WHAT A STRESS LEAVE PAYS IN BC, WEEK BY WEEK — 13 Oct 2026.
 *
 * The arithmetic behind /tools/stress-leave-pay-calculator, kept pure so the
 * server page can render a worked example from it (Google sees the answer
 * without running any script) and the small client component can run the
 * same function on the reader's own figure.
 *
 * It imports nothing. The EI maximum and the waiting-week window arrive as
 * arguments, read on the server from lib/benefit-figures.ts, so no dollar
 * figure is typed here and the client bundle carries a few functions only.
 *
 * WHAT IT MODELS, AND THE SOURCE FOR EACH RULE (all read 13 Oct 2026)
 *
 *   BC Employment Standards Act (gov.bc.ca, paid sick leave): after 90 days
 *   with the employer, 5 paid and 3 unpaid days of illness leave each
 *   calendar year, paid at an average day's pay. "3 completed months" stands
 *   in for 90 days.
 *
 *   Canada Labour Code s. 239 and IPG-118 (federally regulated work): 3 paid
 *   medical days after 30 days of continuous employment, then 1 more at the
 *   start of each month once a further complete month is served, to 10 a
 *   year, at the regular rate; plus up to 27 weeks of job-protected medical
 *   leave, which is protection and not pay.
 *
 *   EI sickness benefits (canada.ca): 55% of average insurable weekly
 *   earnings to the year's weekly maximum, for up to 26 weeks. The one-week
 *   waiting period is waived for new claims starting inside the temporary
 *   measure's window (lib/benefit-figures.ts EI_WAITING_WAIVER).
 *
 * WHAT IT DOES NOT DO
 *
 *   Put a number on a short-term disability plan or on WorkSafeBC. Both are
 *   set by someone else's terms; the picture names the route and leaves the
 *   amount to the plan or the Board.
 *
 *   Model partial weeks. A week with any employer-paid sick day is shown as
 *   paid by the employer for those days only, and EI starts the week after.
 *   Service Canada allocates sick pay to the week it covers and decides the
 *   rest itself.
 *
 * Rounding: every dollar figure is rounded to the dollar, as the published
 * weekly maximum is (55% of the year's maximum insurable earnings over 52). */

export type LeaveInput = {
  /** Average weekly insurable earnings before tax, dollars. */
  weeklyEarnings: number;
  /** Completed months with this employer. */
  monthsOfService: number;
  /** Paid sick or medical days already used this calendar year. */
  daysUsed?: number;
  /** Federally regulated employer (Canada Labour Code) rather than the BC Act. */
  federal?: boolean;
  /** The employer has a short-term disability plan. */
  shortTermDisability?: boolean;
  /** Work caused it: the WorkSafeBC route applies. */
  workCaused?: boolean;
};

export type EiFigure = { weekly: number; year: number };

export type PhaseKind = 'sick-pay' | 'waiting' | 'ei' | 'plan' | 'after';

export type Phase = {
  kind: PhaseKind;
  /** First and last week of the phase, 1-based and inclusive. */
  fromWeek: number;
  toWeek: number;
  /** Dollars a week, or null when the amount is not this tool's to state. */
  weeklyPay: number | null;
  /** Employer-paid sick days inside the phase (sick-pay only). */
  paidDays?: number;
};

export type LeavePicture = {
  /** EI sickness benefit a week for these earnings, before tax. */
  eiWeekly: number;
  /** True when the year's maximum, not 55%, set the EI figure. */
  capped: boolean;
  /** Employer-paid sick or medical days left to use this year. */
  paidDays: number;
  /** BC unpaid, job-protected sick days (3 after 90 days, else 0). */
  unpaidDays: number;
  waitingWeek: boolean;
  eiWeeks: number;
  phases: Phase[];
  /** Weeks the picture covers before the "after" phase. */
  weeksShown: number;
  /** Dollars before tax across the weeks shown, or null when a plan pays an
   *  amount this tool cannot know. */
  totalPaid: number | null;
  /** Usual pay across the same weeks, for comparison. */
  usualTotal: number;
};

export const EI_RATE = 0.55;
export const EI_SICKNESS_WEEKS = 26;
export const BC_PAID_DAYS = 5;
export const BC_UNPAID_DAYS = 3;
export const FEDERAL_MAX_DAYS = 10;
export const FEDERAL_PROTECTED_WEEKS = 27;
const DAYS_A_WEEK = 5;

const clean = (n: unknown, max = Number.POSITIVE_INFINITY) => {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
  return Math.min(Math.max(0, v), max);
};

/** EI sickness benefit a week: 55% of earnings, rounded, to the maximum. */
export function eiWeeklyBenefit(weeklyEarnings: number, maxWeekly: number): number {
  return Math.min(Math.round(clean(weeklyEarnings) * EI_RATE), maxWeekly);
}

/** Paid sick days earned under the Canada Labour Code after `months`
 *  completed months: 3 once 30 days are served, one more per further
 *  complete month after the first full calendar month, to 10. */
export function federalPaidDays(months: number): number {
  const m = Math.floor(clean(months));
  if (m < 1) return 0;
  return Math.min(FEDERAL_MAX_DAYS, 3 + Math.max(0, m - 2));
}

/** Paid and unpaid days the law gives before anyone else pays. */
export function sickDays(input: Pick<LeaveInput, 'monthsOfService' | 'federal' | 'daysUsed'>): { paid: number; unpaid: number } {
  const months = Math.floor(clean(input.monthsOfService));
  const used = Math.floor(clean(input.daysUsed));
  if (input.federal) return { paid: Math.max(0, federalPaidDays(months) - used), unpaid: 0 };
  if (months < 3) return { paid: 0, unpaid: 0 };
  return { paid: Math.max(0, BC_PAID_DAYS - used), unpaid: BC_UNPAID_DAYS };
}

/** Whether a claim starting on `isoDate` (YYYY-MM-DD) is inside the waiver. */
export function waitingWaivedOn(isoDate: string, window: { from: string; to: string }): boolean {
  return isoDate >= window.from && isoDate <= window.to;
}

/** The whole picture. `waitingWaived` is decided by the caller from the
 *  claim date and the waiver window, so the function stays pure. */
export function leavePay(input: LeaveInput, ei: EiFigure, waitingWaived: boolean): LeavePicture {
  const weekly = clean(input.weeklyEarnings);
  const eiWeekly = eiWeeklyBenefit(weekly, ei.weekly);
  const capped = Math.round(weekly * EI_RATE) > ei.weekly;
  const { paid, unpaid } = sickDays(input);
  const dayPay = weekly / DAYS_A_WEEK;

  const phases: Phase[] = [];
  let week = 1;
  let total = 0;

  /* Employer sick pay, a week at a time; a part week is paid for its days. */
  if (paid > 0) {
    const sickWeeks = Math.ceil(paid / DAYS_A_WEEK);
    for (let i = 0; i < sickWeeks; i++) {
      const days = Math.min(DAYS_A_WEEK, paid - i * DAYS_A_WEEK);
      const pay = Math.round(dayPay * days);
      const last = phases[phases.length - 1];
      if (last && last.kind === 'sick-pay' && last.paidDays === days && last.weeklyPay === pay) last.toWeek = week;
      else phases.push({ kind: 'sick-pay', fromWeek: week, toWeek: week, weeklyPay: pay, paidDays: days });
      total += pay;
      week++;
    }
  }

  const waitingWeek = !waitingWaived && !input.shortTermDisability;
  if (waitingWeek) {
    phases.push({ kind: 'waiting', fromWeek: week, toWeek: week, weeklyPay: 0 });
    week++;
  }

  const eiFrom = week;
  const eiTo = week + EI_SICKNESS_WEEKS - 1;
  let planUnknown = false;
  if (input.shortTermDisability) {
    phases.push({ kind: 'plan', fromWeek: eiFrom, toWeek: eiTo, weeklyPay: null });
    planUnknown = true;
  } else {
    phases.push({ kind: 'ei', fromWeek: eiFrom, toWeek: eiTo, weeklyPay: eiWeekly });
    total += eiWeekly * EI_SICKNESS_WEEKS;
  }
  const weeksShown = eiTo;
  phases.push({ kind: 'after', fromWeek: eiTo + 1, toWeek: eiTo + 1, weeklyPay: null });

  return {
    eiWeekly,
    capped,
    paidDays: paid,
    unpaidDays: unpaid,
    waitingWeek,
    eiWeeks: EI_SICKNESS_WEEKS,
    phases,
    weeksShown,
    totalPaid: planUnknown ? null : total,
    usualTotal: Math.round(weekly * weeksShown),
  };
}

/** "Week 3" or "Weeks 3 to 28". */
export function weekRange(p: Pick<Phase, 'fromWeek' | 'toWeek'>): string {
  return p.fromWeek === p.toWeek ? `Week ${p.fromWeek}` : `Weeks ${p.fromWeek} to ${p.toWeek}`;
}

/** A dollar sign and the amount with Canadian grouping, rounded to the dollar. */
export function dollars(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-CA');
}

/** The date in British Columbia today, YYYY-MM-DD, for the claim start. */
export function pacificToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
