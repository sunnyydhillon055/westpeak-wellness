import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/* THE CHANGE REGISTER, AND AN HONEST BEFORE AND AFTER — 1 Oct 2026.
 *
 * WHY. Seventy-four changes shipped on 1 Oct 2026 in nine batches. Without a
 * record of what changed, where and when, October's numbers cannot be
 * attributed to any of them, and the next round of decisions would be made
 * the way this one was: from argument. An A/B test on /book was considered
 * and rejected in round 1 — about fifteen calendar opens a week cannot
 * power one. What fits a practice this size is a register and a readout
 * that says plainly when the numbers are too small to tell.
 *
 * WHAT. data/changes.json lists each change: an id, the day it shipped, the
 * pages it touched (path prefixes), the ONE metric it was meant to move,
 * and a read-after date 28 days on. A readout compares the 28 days before
 * with the 28 days after, on the touched pages and on every other page over
 * the same weeks, so a site-wide swing (a holiday, a ranking update) is not
 * credited to the change:
 *
 *     ratio = (touched after / touched before) / (untouched after / untouched before)
 *
 * with a 95% interval from the Poisson counts (the log of the ratio has
 * variance 1/a + 1/b + 1/c + 1/d). An interval that includes 1 — no change
 * — prints "too few to tell", and so does any zero count. That is the
 * expected answer at this volume for most changes, and saying it is the
 * point: a number that cannot distinguish a change from noise should not
 * be read as a verdict.
 *
 * WHERE THE COUNTS COME FROM
 *   conv:<event>   the weekly snapshots of the conversion log, by path
 *                  (lib/conversion-snapshots.ts); a snapshot within five
 *                  days of each boundary is used, none is invented
 *   gsc:clicks     the committed Search Console Pages exports, each a
 *                  28-day window; one ending within seven days of the
 *                  change is "before", one ending ~28 days after is "after"
 *   tally:<field>  the booking tally copied into each snapshot; it has no
 *                  page, so there is no untouched comparison
 *   none           a measurement change with nothing of its own to move
 *
 * No imports beyond node:fs so scripts/change-readout.mjs can load this
 * file with Node's type stripping. Pure except readChanges(). */

export type Change = {
  id: string;
  /** YYYY-MM-DD the change reached production. */
  date: string;
  /** Path prefixes. "/" alone means the homepage only. */
  pages: string[];
  metric: string;
  /** YYYY-MM-DD, normally `date` + 28 days. */
  readAfter: string;
  note?: string;
};

export type SnapshotLike = {
  takenAt: string;
  conversions: { events: Record<string, Record<string, number>>; since?: string };
  bookings?: unknown;
};
export type GscExportLike = { date: string; rows: { path: string; clicks: number }[] };

export type Interval = { ratio: number; low: number; high: number } | null;
export type ChangeReadout = {
  id: string;
  metric: string;
  readAfter: string;
  status: 'ok' | 'no-data' | 'measurement';
  /** Why there is no readout, when there is none. */
  reason?: string;
  touched?: { before: number; after: number };
  untouched?: { before: number; after: number } | null;
  interval?: Interval;
  verdict?: string;
};

const DAY = 864e5;
const WINDOW_DAYS = 28;

export function readChanges(file = join(process.cwd(), 'data', 'changes.json')): Change[] {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as { changes?: unknown };
    return Array.isArray(raw.changes) ? (raw.changes as Change[]).filter((c) => c && typeof c.id === 'string' && typeof c.date === 'string') : [];
  } catch {
    return [];
  }
}

/** True when a path is one of the change's pages. */
export function touches(c: Pick<Change, 'pages'>, path: string): boolean {
  return c.pages.some((p) => (p === '/' ? path === '/' : p.endsWith('/') ? path.startsWith(p) : path === p || path.startsWith(`${p}/`)));
}

/** Rate ratio with a 95% Poisson interval; null when any count is zero. */
export function rateRatio(touchedBefore: number, touchedAfter: number, untouchedBefore?: number, untouchedAfter?: number): Interval {
  const counts = [touchedBefore, touchedAfter, ...(untouchedBefore === undefined ? [] : [untouchedBefore, untouchedAfter ?? 0])];
  if (counts.some((n) => !(n > 0))) return null;
  const ratio = untouchedBefore === undefined
    ? touchedAfter / touchedBefore
    : (touchedAfter / touchedBefore) / ((untouchedAfter as number) / untouchedBefore);
  const se = Math.sqrt(counts.reduce((a, n) => a + 1 / n, 0));
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return { ratio: r2(ratio), low: r2(ratio * Math.exp(-1.96 * se)), high: r2(ratio * Math.exp(1.96 * se)) };
}

export function verdictOf(i: Interval): string {
  if (!i) return 'too few to tell (a count is zero)';
  if (i.low <= 1 && i.high >= 1) return `too few to tell (×${i.ratio}, 95% interval ${i.low} to ${i.high} includes no change)`;
  return `${i.ratio > 1 ? 'up' : 'down'} ×${i.ratio} against the untouched pages (95% interval ${i.low} to ${i.high})`;
}

const nearest = <T>(items: T[], at: number, timeOf: (x: T) => number, slackDays: number): T | undefined => {
  let best: T | undefined;
  let gap = slackDays * DAY + 1;
  for (const x of items) {
    const d = Math.abs(timeOf(x) - at);
    if (d < gap) { best = x; gap = d; }
  }
  return best;
};

const split = (c: Change, newer: Record<string, number>, older: Record<string, number>) => {
  let t = 0;
  let u = 0;
  for (const [path, n] of Object.entries(newer)) {
    const d = Math.max(0, n - (older[path] ?? 0));
    if (touches(c, path)) t += d;
    else u += d;
  }
  return { t, u };
};

const tallyTotal = (bookings: unknown, field: string): number => {
  const months = (bookings as { months?: Record<string, Record<string, Record<string, number>>> } | undefined)?.months ?? {};
  let n = 0;
  for (const rows of Object.values(months)) for (const r of Object.values(rows ?? {})) n += Number(r?.[field]) || 0;
  return n;
};

/** One change's readout from whatever data exists. Pure. */
export function readout(c: Change, snaps: SnapshotLike[], gsc: GscExportLike[]): ChangeReadout {
  const base = { id: c.id, metric: c.metric, readAfter: c.readAfter };
  if (c.metric === 'none') return { ...base, status: 'measurement', reason: 'a measurement change; nothing of its own to move' };
  const at = Date.parse(`${c.date}T00:00:00Z`);
  if (!Number.isFinite(at)) return { ...base, status: 'no-data', reason: 'the change has no readable date' };
  const before = at - WINDOW_DAYS * DAY;
  const after = at + WINDOW_DAYS * DAY;

  if (c.metric.startsWith('conv:') || c.metric.startsWith('tally:')) {
    const when = (s: SnapshotLike) => Date.parse(s.takenAt);
    /* Five days' slack: snapshots are Monday's, so one always falls within
       three and a half days of any date unless a Monday was missed. The
       first was 5 Oct 2026, four days after the 1 Oct batches, which is why
       it is five and not four: those four days count as "before". */
    const s1 = nearest(snaps, at, when, 5);
    const s2 = nearest(snaps, after, when, 5);
    /* No snapshot 28 days before (the snapshots began on 1 Oct 2026): the
       log itself is cumulative from `since`, so everything counted up to
       the change is a longer "before". With an untouched comparison the
       window lengths cancel out of the ratio; without one (tally) they do
       not, so the fallback is only for conv: metrics. */
    const sinceOk = !!s1?.conversions.since && Date.parse(s1.conversions.since) <= before;
    const s0 = nearest(snaps, before, when, 5)
      ?? (c.metric.startsWith('conv:') && sinceOk ? { takenAt: s1!.conversions.since!, conversions: { events: {} } } : undefined);
    if (!s0 || !s1 || !s2) {
      const first = [...snaps].map((s) => s.takenAt.slice(0, 10)).sort()[0];
      return { ...base, status: 'no-data', reason: `needs weekly snapshots near ${new Date(before).toISOString().slice(0, 10)}, ${c.date} and ${new Date(after).toISOString().slice(0, 10)}${first ? `; the first is ${first}` : '; there are none yet'}` };
    }
    if (c.metric.startsWith('tally:')) {
      const f = c.metric.slice(6);
      const tb = tallyTotal(s1.bookings, f) - tallyTotal(s0.bookings, f);
      const ta = tallyTotal(s2.bookings, f) - tallyTotal(s1.bookings, f);
      const interval = rateRatio(tb, ta);
      return { ...base, status: 'ok', touched: { before: tb, after: ta }, untouched: null, interval, verdict: verdictOf(interval).replace(' against the untouched pages', ' (site-wide; nothing untouched to compare)') };
    }
    const ev = c.metric.slice(5);
    const b = split(c, s1.conversions.events[ev] ?? {}, s0.conversions.events[ev] ?? {});
    const a = split(c, s2.conversions.events[ev] ?? {}, s1.conversions.events[ev] ?? {});
    const interval = rateRatio(b.t, a.t, b.u, a.u);
    return { ...base, status: 'ok', touched: { before: b.t, after: a.t }, untouched: { before: b.u, after: a.u }, interval, verdict: verdictOf(interval) };
  }

  if (c.metric === 'gsc:clicks') {
    const when = (e: GscExportLike) => Date.parse(`${e.date}T00:00:00Z`);
    const e1 = nearest(gsc, at, when, 7);
    const e2 = nearest(gsc, after, when, 7);
    if (!e1 || !e2 || e1 === e2) return { ...base, status: 'no-data', reason: `needs Search Console exports near ${c.date} and ${new Date(after).toISOString().slice(0, 10)}` };
    const sum = (e: GscExportLike) => e.rows.reduce((acc, r) => (touches(c, r.path) ? { ...acc, t: acc.t + r.clicks } : { ...acc, u: acc.u + r.clicks }), { t: 0, u: 0 });
    const b = sum(e1);
    const a = sum(e2);
    const interval = rateRatio(b.t, a.t, b.u, a.u);
    return { ...base, status: 'ok', touched: { before: b.t, after: a.t }, untouched: { before: b.u, after: a.u }, interval, verdict: verdictOf(interval) };
  }
  return { ...base, status: 'no-data', reason: `metric ${c.metric} is not one this readout knows` };
}

/** Every change whose read-after date has passed, read out. Pure. */
export function dueChanges(changes: Change[], snaps: SnapshotLike[], gsc: GscExportLike[], now = new Date()): ChangeReadout[] {
  const today = now.toISOString().slice(0, 10);
  return changes.filter((c) => c.readAfter <= today).map((c) => readout(c, snaps, gsc));
}

export function changeLines(rows: ChangeReadout[]): string[] {
  if (!rows.length) return [];
  const out = ['Changes whose 28 days are up (data/changes.json; before and after, touched pages against the rest):', ''];
  for (const r of rows) {
    if (r.status !== 'ok') {
      out.push(`  ${r.id} (${r.metric}): ${r.reason}`);
      continue;
    }
    const t = r.touched!;
    const u = r.untouched;
    out.push(`  ${r.id} (${r.metric}): touched ${t.before} → ${t.after}${u ? `, untouched ${u.before} → ${u.after}` : ''}; ${r.verdict}`);
  }
  out.push('', '  node scripts/change-readout.mjs prints the same for any change, due or not.');
  return out;
}
