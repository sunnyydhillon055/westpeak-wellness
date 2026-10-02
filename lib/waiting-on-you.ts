import type { Practitioner } from '@/lib/practitioners';
import { insuranceStatus, insuranceGateDate } from '@/lib/practitioners';
import type { Availability } from '@/lib/availability-summary';

/* /admin "WAITING ON YOU" — 1 Oct 2026.
 *
 * Every switch on the site that only the owner can throw, with its deadline
 * and what it keeps or unlocks, computed from the code that holds it. It
 * replaces the "Open, and owned by a person" table in DECISIONS.md, which was
 * last updated on 6 Sep and had missed the insurance gate, the client
 * agreement, the Gottman level, the drafts and the counsellors' access.
 *
 * Pure: the component (components/admin/WaitingOnYou.tsx) passes the roster,
 * today's date, the flags and the availability in, so every row is tested on
 * fixtures. It reads; it sends nothing and changes nothing.
 *
 * Two inputs cannot be read from the running site, because the source tree is
 * not deployed: whether /client-agreement exists, and whether the /punjabi
 * form decision (item 205) has been recorded. Those are passed as booleans
 * from constants beside the component, and test/waiting-on-you.test.mts fails
 * if the client-agreement constant disagrees with app/. */

/* Not readable on the deployed site (the source tree is not there). Kept
   true to app/ by test/waiting-on-you.test.mts. */
export const CLIENT_AGREEMENT_LIVE = false;
/* Set true when the owner's decision on the /punjabi form (item 205) is
   recorded in DECISIONS.md. */
export const PUNJABI_FORM_DECIDED = false;

export type WaitingRow = {
  /** What is waiting. */
  item: string;
  /** Where it stands, from the code. */
  state: string;
  /** YYYY-MM-DD the row turns urgent, when there is one. */
  due?: string;
  /** What acting on it keeps or unblocks. */
  unlocks: string;
  /** True when the row needs action now (overdue, or within 30 days). */
  urgent: boolean;
};

export type WaitingInputs = {
  roster: readonly Practitioner[];
  today: string;
  /** Alberta place pages per counsellor slug, on the recorded roster. */
  albertaPages: Record<string, number>;
  draftGuides: number;
  icbcVendor: boolean;
  directFirstSession: boolean;
  clientAgreementLive: boolean;
  punjabiFormDecided: boolean;
  availability: Record<string, Availability | null | undefined>;
};

const DAY = 86_400_000;
const days = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
const soon = (today: string, due: string, within = 30) => days(today, due) <= within;
const first = (p: Pick<Practitioner, 'name'>) => p.name.split(' ')[0]!;

/** Days since a register check after which it is reported as stale. */
export const REGISTER_STALE_DAYS = 90;

export function waitingRows(x: WaitingInputs): WaitingRow[] {
  const rows: WaitingRow[] = [];
  const accepting = x.roster.filter((p) => p.acceptingNewClients);

  /* Liability insurance: the date the gate closes, and what it takes down. */
  for (const p of x.roster.filter((q) => q.insurance)) {
    const status = insuranceStatus(p, x.today);
    const gate = insuranceGateDate(p)!;
    const ab = x.albertaPages[p.slug] ?? 0;
    const keeps = [
      ...(p.provinces.includes('AB') ? [`${ab} Alberta place ${ab === 1 ? 'page' : 'pages'}`] : []),
      ...(p.reach === 'canada' ? ['“anywhere in Canada”'] : []),
    ];
    rows.push({
      item: `${first(p)}’s liability insurance renewal`,
      state: status === 'current'
        ? `current to ${p.insurance!.validTo}`
        : status === 'grace'
          ? `expired ${p.insurance!.validTo}; in the 14-day grace, gate closes ${gate}`
          : `lapsed; gate closed ${gate}`,
      due: status === 'current' ? p.insurance!.validTo : gate,
      unlocks: keeps.length
        ? `Record the renewal dates in lib/practitioners.ts to keep ${keeps.join(' and ')}`
        : 'Record the renewal dates in lib/practitioners.ts',
      urgent: status !== 'current' || soon(x.today, p.insurance!.validTo),
    });
  }

  /* Registrations: expiry, and how long since someone read the register. */
  for (const p of x.roster) {
    for (const c of p.credentials) {
      if (c.validTo) {
        rows.push({
          item: `${first(p)}’s ${c.short} registration`,
          state: c.validTo < x.today ? `expired ${c.validTo}` : `valid to ${c.validTo}`,
          due: c.validTo,
          unlocks: `A new expiry date keeps her ${c.short} on her profile and her bookings open`,
          urgent: soon(x.today, c.validTo, 45),
        });
      }
      if (c.verifyUrl && c.registerCheckedOn && days(c.registerCheckedOn, x.today) > REGISTER_STALE_DAYS) {
        rows.push({
          item: `${first(p)}’s ${c.short} register check`,
          state: `last read off the register ${c.registerCheckedOn}, ${days(c.registerCheckedOn, x.today)} days ago`,
          unlocks: 'A fresh registerCheckedOn date keeps the “checked on the register” line honest',
          urgent: true,
        });
      }
    }
  }

  if (x.draftGuides > 0) {
    rows.push({
      item: 'Guides waiting on a clinical read',
      state: `${x.draftGuides} in lib/guides-drafts.ts with draft: true`,
      unlocks: 'Each one cleared publishes a guide; nothing else is needed',
      urgent: false,
    });
  }

  for (const p of accepting.filter((q) => q.services.includes('couples-therapy') && !('gottmanTraining' in q))) {
    rows.push({
      item: `${first(p)}’s Gottman training level (owner item #67)`,
      state: 'not recorded; couples work is described as “Gottman-informed”',
      unlocks: 'A gottmanTraining field on her roster entry lets her own pages state the level',
      urgent: false,
    });
  }

  if (!x.icbcVendor) {
    rows.push({
      item: 'ICBC vendor registration',
      state: 'site.icbcVendor is false: the site says the practice cannot bill ICBC',
      unlocks: 'Registering, then flipping the flag, changes /pricing, /refer and /ai.json together',
      urgent: false,
    });
  }

  if (!x.clientAgreementLive) {
    rows.push({
      item: 'Client agreement page',
      state: 'no /client-agreement route',
      unlocks: 'A page a client can read before booking, linked from /book and /pricing',
      urgent: false,
    });
  }

  if (!x.punjabiFormDecided) {
    rows.push({
      item: 'The /punjabi form (item 205)',
      state: 'decision not recorded',
      unlocks: 'Lets the Punjabi page’s form be kept or changed as decided',
      urgent: false,
    });
  }

  if (!x.directFirstSession) {
    rows.push({
      item: '“Already sure? Start with a first session” (item 211)',
      state: 'built; site.directFirstSession is false',
      unlocks: 'A direct paid first-session row on /book and each profile, logged in data/changes.json',
      urgent: false,
    });
  }

  for (const p of accepting.filter((q) => q.bookable)) {
    const a = x.availability[p.slug];
    if (!a || a.error) {
      rows.push({ item: `${first(p)}’s consultation days`, state: 'Cliniko could not be read', unlocks: 'More open days, fewer people lost at the calendar', urgent: false });
      continue;
    }
    const week = a.week ?? a;
    rows.push({
      item: `${first(p)}’s consultation days`,
      state: `${week.days.length} ${week.days.length === 1 ? 'day' : 'days'} with a free-consultation time in the next 7 days${week.days.length ? ` (${week.days.join(', ')})` : ''}`,
      unlocks: 'More open days, fewer people lost at the calendar',
      urgent: week.days.length < 2,
    });
  }

  /* Urgent first, then by due date, undated last. */
  return rows.sort((a, b) => Number(b.urgent) - Number(a.urgent) || (a.due ?? '9999').localeCompare(b.due ?? '9999'));
}
