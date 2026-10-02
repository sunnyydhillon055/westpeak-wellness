import type { WeekRow } from '@/lib/conversion-snapshots';
import type { GscWeeksRead } from '@/lib/gsc-summary';
import { rateRatio, verdictOf } from '@/lib/change-register';

/* THIS WEEK, SIX NUMBERS — 1 Oct 2026.
 *
 * /admin had one weekly view: a twelve-column table per counsellor, below
 * the inbox and about twenty lists, with no change shown. These are the six
 * outcomes the practice is run on, for the newest week between two Monday
 * snapshots, each beside the week before and the mean of the four before it:
 *
 *   Google clicks, home page left out   Search Console date-page.csv, by
 *                                       Monday-to-Sunday week (the home page
 *                                       is mostly people searching the name)
 *   /book calendar seen                 scheduler_visible, portal left out
 *   real enquiries and leads            lib/inbound-quality.ts
 *   consults booked                     against the open consult slots
 *   new paying clients                  tally consultConverted
 *   paid sessions held                  tally paidHeld
 *
 * THE NOISE TEST. A week here is about seventeen calendar views and three
 * bookings, so week-on-week percentages are mostly noise. A tile gets an up
 * or down mark only when the last four weeks against the four before fall
 * outside a 95% Poisson interval (rateRatio/verdictOf in
 * lib/change-register.ts, the same test as the change register); otherwise
 * it says "too few to tell". A week marked partial is left out of the mean
 * and the test, and with fewer than eight whole weeks there is no test.
 *
 * A number that was not measured is null with the reason, never 0. Pure:
 * no reads, no imports beyond types and the interval. Nothing is sent. */

export type KpiId = 'google' | 'calendar' | 'enquiries' | 'consults' | 'converted' | 'paidHeld';

export type KpiTile = {
  id: KpiId;
  label: string;
  /** The week the value is for, as a readable span, or null. */
  week: string | null;
  value: number | null;
  /** Why there is no value, when there is none. */
  reason?: string;
  /** A qualifier printed under the value, e.g. "of 12 open slots". */
  sub?: string;
  /** The value's own week is partial: shown, but said. */
  partial?: string;
  last: number | null;
  /** Mean of the whole weeks among the four before, one decimal. */
  mean4: number | null;
  trend: 'up' | 'down' | null;
  trendText: string;
};

type Point = { value: number | null; usable: boolean; partial?: string };

/* Reasons that concern only the booking tally, so a calendar or inbound
   count from the same week is still whole. */
const TALLY_REASON = /booking tally|booking job|new paying clients/;

const point = (r: WeekRow, value: number | null, tally: boolean): Point => {
  const blocking = r.partial.filter((p) => tally || !TALLY_REASON.test(p));
  return { value, usable: value !== null && blocking.length === 0, ...(blocking.length ? { partial: blocking.join('; ') } : {}) };
};

const r1 = (v: number) => Math.round(v * 10) / 10;

/** Last week, the four-week mean and the noise test for one series, newest
 *  first. Pure. */
export function trendOf(series: Point[]): Pick<KpiTile, 'last' | 'mean4' | 'trend' | 'trendText'> {
  const last = series[1]?.value ?? null;
  const prior = series.slice(1, 5).filter((p) => p.usable);
  const mean4 = prior.length ? r1(prior.reduce((n, p) => n + (p.value as number), 0) / prior.length) : null;
  const eight = series.slice(0, 8);
  const whole = eight.filter((p) => p.usable).length;
  if (eight.length < 8 || whole < 8) {
    return { last, mean4, trend: null, trendText: `too few weeks to tell (${whole} of 8 whole weeks)` };
  }
  const recent = eight.slice(0, 4).reduce((n, p) => n + (p.value as number), 0);
  const before = eight.slice(4, 8).reduce((n, p) => n + (p.value as number), 0);
  const i = rateRatio(before, recent);
  if (!i || (i.low <= 1 && i.high >= 1)) {
    return { last, mean4, trend: null, trendText: `too few to tell (${before} then ${recent} over four weeks)` };
  }
  return {
    last, mean4,
    trend: i.ratio > 1 ? 'up' : 'down',
    trendText: verdictOf(i).replace(' against the untouched pages', `, last four weeks against the four before (${before} then ${recent})`),
  };
}

const span = (r: WeekRow) => `week to ${r.to.slice(0, 10)}`;

/** The six tiles from the practice rows of weekTable() (newest first) and
 *  the Search Console weeks. Pure. */
export function weeklyKpis(weeks: WeekRow[], gsc: GscWeeksRead): KpiTile[] {
  const rows = weeks.filter((r) => r.who === 'all');
  const head = rows[0];
  const noWeek = 'needs two Monday snapshots; the first week appears after the second';

  const fromRows = (
    id: KpiId, label: string, pick: (r: WeekRow) => number | null, tally: boolean, whyNull: string,
    sub?: (r: WeekRow) => string | undefined,
  ): KpiTile => {
    if (!head) return { id, label, week: null, value: null, reason: noWeek, last: null, mean4: null, trend: null, trendText: '' };
    const series = rows.map((r) => point(r, pick(r), tally));
    const now = series[0];
    return {
      id, label, week: span(head), value: now.value,
      ...(now.value === null ? { reason: whyNull } : {}),
      ...(now.value !== null && sub?.(head) ? { sub: sub(head) } : {}),
      ...(now.value !== null && now.partial ? { partial: now.partial } : {}),
      ...trendOf(series),
    };
  };

  const google: KpiTile = (() => {
    const label = 'Google clicks, home page left out';
    if (gsc.status !== 'ok') return { id: 'google', label, week: null, value: null, reason: gsc.reason, last: null, mean4: null, trend: null, trendText: '' };
    const whole = gsc.weeks.filter((w) => w.complete);
    if (!whole.length) return { id: 'google', label, week: null, value: null, reason: 'no complete Monday-to-Sunday week in the Search Console data yet', last: null, mean4: null, trend: null, trendText: '' };
    /* Consecutive weeks only: a gap between pulls must not join two
       distant weeks into one run of eight. */
    const run: Point[] = [];
    for (let i = 0; i < whole.length; i++) {
      if (i > 0 && Date.parse(whole[i - 1].from) - Date.parse(whole[i].from) !== 7 * 864e5) break;
      run.push({ value: whole[i].nonHome, usable: true });
    }
    return { id: 'google', label, week: `${whole[0].from} to ${whole[0].to}`, value: whole[0].nonHome, sub: `${whole[0].clicks.home} more on the home page`, ...trendOf(run) };
  })();

  return [
    google,
    fromRows('calendar', '/book calendar seen', (r) => r.visible, false, 'calendar views were not counted yet that week'),
    fromRows('enquiries', 'Real enquiries and leads',
      (r) => (r.enquiries === null || r.leads === null ? null : r.enquiries + r.leads), false,
      'the inbound records could not be read',
      (r) => (r.enquiries === null ? undefined : `${r.enquiries} enquir${r.enquiries === 1 ? 'y' : 'ies'}, ${r.answeredInDay ?? 0} answered within a business day`)),
    fromRows('consults', 'Consults booked', (r) => r.consultBooked, true,
      'the booking tally was not copied at both ends of the week',
      (r) => (r.slots === null ? undefined : `of ${r.slots} open consult slot${r.slots === 1 ? '' : 's'}`)),
    fromRows('converted', 'New paying clients', (r) => r.converted, true,
      'counted from 1 Oct 2026; needs a snapshot carrying it at each end of the week'),
    fromRows('paidHeld', 'Paid sessions held', (r) => r.paidHeld, true,
      'the booking tally was not copied at both ends of the week'),
  ];
}
