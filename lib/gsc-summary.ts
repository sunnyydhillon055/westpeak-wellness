import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/* SEARCH CONSOLE ON /admin AND IN THE MONTHLY EMAIL — 1 Oct 2026.
 *
 * Every page decision on this site is argued from a Search Console export,
 * and nothing the owner reads every month showed one: the exports sat in
 * data/gsc/ for scripts/ctr-delta.mjs and the gap analysis. This reads the
 * committed exports (scripts/gsc-pull.mjs writes them on Mondays; the older
 * ones were saved by hand) and says three things:
 *
 *   · clicks, impressions and position for the pages that book (money)
 *     against the pages that inform (guides, resources, comparisons, tools)
 *   · the newest export against the mean of up to four before it
 *   · the five pages in each group whose clicks moved most
 *
 * HONEST ABOUT THE WINDOW. Each export is Search Console's own 28-day
 * window ending the day it was taken, not a week, so "newest against the
 * average" compares overlapping 28-day windows. The lines say so. When
 * gsc-pull starts writing date-page.csv the weekly cut can be made exactly;
 * until then this is the comparison the files support.
 *
 * Read at request time from the deployment's own copy of data/gsc (traced
 * into the /admin and funnel-report functions by next.config.mjs). A missing
 * or unreadable directory is reported as absent, never as zero clicks.
 * Pure below the reader, so the tests need no files. */

export type GscRow = { path: string; clicks: number; impressions: number; position: number };
export type GscExport = { date: string; rows: GscRow[] };
export type PageClass = 'money' | 'info' | 'other';

/** An export of the Pages tab: `2026-09-26-pages.csv`, or the early
 *  `2026-08-20-pages-28d.csv`. Not page-query.csv or date-page.csv. */
export const PAGES_FILE = /^(\d{4}-\d{2}-\d{2})-pages(?:-28d)?\.csv$/;

const MONEY = [
  /^\/$/, /^\/book$/, /^\/contact$/, /^\/pricing$/,
  /^\/services(\/|$)/, /^\/practitioners(\/|$)/, /^\/online-counselling(\/|$)/, /^\/for\//,
  /^\/punjabi(-counselling)?(\/|$)/, /^\/tagalog(-counselling)?(\/|$)/,
];
const INFO = [/^\/guides(\/|$)/, /^\/resources(\/|$)/, /^\/compare(\/|$)/, /^\/approaches(\/|$)/, /^\/tools(\/|$)/, /^\/glossary(\/|$)/, /^\/answers(\/|$)/];

/** Money: a page whose job is a booking. Info: a page whose job is an
 *  answer. Other: careers, about, the referral pages, legal — neither, and
 *  /careers alone drew 34 clicks in September from people seeking work. */
export function pageClass(path: string): PageClass {
  if (MONEY.some((r) => r.test(path))) return 'money';
  if (INFO.some((r) => r.test(path))) return 'info';
  return 'other';
}

const toPath = (url: string): string | null => {
  try {
    const p = new URL(url.trim()).pathname.replace(/\/+$/, '');
    return p || '/';
  } catch {
    return null;
  }
};

/** The Pages export as rows. Tolerates a quoted URL and a percentage CTR;
 *  skips any line that does not parse. Pure. */
export function parsePagesCsv(text: string): GscRow[] {
  const out: GscRow[] = [];
  for (const line of text.split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue;
    const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')) ?? [];
    const path = toPath(cells[0] ?? '');
    const clicks = Number(cells[1]);
    const impressions = Number(cells[2]);
    const position = Number(cells[4]);
    if (!path || !Number.isFinite(clicks) || !Number.isFinite(impressions)) continue;
    out.push({ path, clicks, impressions, position: Number.isFinite(position) ? position : 0 });
  }
  return out;
}

export type GroupTotals = { clicks: number; impressions: number; position: number; pages: number };
export type Mover = { path: string; clicks: number; before: number; delta: number; position: number };
export type GscSummary = {
  newest: string;
  /** The dates of the exports averaged against, newest first. */
  compared: string[];
  groups: Record<'money' | 'info', { now: GroupTotals; avg: GroupTotals | null }>;
  movers: Record<'money' | 'info', Mover[]>;
};
export type GscRead = { status: 'ok'; summary: GscSummary } | { status: 'absent'; reason: string };

/** Impression-weighted position, as Search Console aggregates it. */
function totals(rows: GscRow[]): GroupTotals {
  const clicks = rows.reduce((n, r) => n + r.clicks, 0);
  const impressions = rows.reduce((n, r) => n + r.impressions, 0);
  const weighted = rows.reduce((n, r) => n + r.position * r.impressions, 0);
  return { clicks, impressions, position: impressions ? Math.round((weighted / impressions) * 10) / 10 : 0, pages: rows.length };
}

const mean = (xs: GroupTotals[]): GroupTotals | null => {
  if (!xs.length) return null;
  const n = xs.length;
  const r1 = (v: number) => Math.round(v * 10) / 10;
  return {
    clicks: r1(xs.reduce((a, x) => a + x.clicks, 0) / n),
    impressions: r1(xs.reduce((a, x) => a + x.impressions, 0) / n),
    position: r1(xs.reduce((a, x) => a + x.position, 0) / n),
    pages: Math.round(xs.reduce((a, x) => a + x.pages, 0) / n),
  };
};

/** The newest export against the mean of up to `back` before it. Null for
 *  no exports. Pure. */
export function summariseGsc(exports: GscExport[], back = 4): GscSummary | null {
  const sorted = [...exports].sort((a, b) => b.date.localeCompare(a.date));
  const [newest, ...older] = sorted;
  if (!newest) return null;
  const prior = older.slice(0, back);
  const groups = {} as GscSummary['groups'];
  const movers = {} as GscSummary['movers'];
  for (const g of ['money', 'info'] as const) {
    const pick = (e: GscExport) => e.rows.filter((r) => pageClass(r.path) === g);
    groups[g] = { now: totals(pick(newest)), avg: mean(prior.map((e) => totals(pick(e)))) };
    const before = new Map<string, number>();
    for (const e of prior) for (const r of pick(e)) before.set(r.path, (before.get(r.path) ?? 0) + r.clicks / prior.length);
    const paths = new Set([...pick(newest).map((r) => r.path), ...before.keys()]);
    const now = new Map(pick(newest).map((r) => [r.path, r]));
    movers[g] = [...paths]
      .map((path) => {
        const b = Math.round((before.get(path) ?? 0) * 10) / 10;
        const c = now.get(path)?.clicks ?? 0;
        return { path, clicks: c, before: b, delta: Math.round((c - b) * 10) / 10, position: now.get(path)?.position ?? 0 };
      })
      .filter((m) => m.delta !== 0 && prior.length > 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.path.localeCompare(b.path))
      .slice(0, 5);
  }
  return { newest: newest.date, compared: prior.map((e) => e.date), groups, movers };
}

export const gscDir = () => join(process.cwd(), 'data', 'gsc');

/** The date of the newest Pages export in the directory, or null. */
export function newestGscDate(dir = gscDir()): string | null {
  try {
    const dates = readdirSync(dir).map((f) => PAGES_FILE.exec(f)?.[1]).filter((d): d is string => !!d).sort();
    return dates.length ? dates[dates.length - 1] : null;
  } catch {
    return null;
  }
}

/** Every Pages export in the directory, oldest first; empty on any failure.
 *  For the change register's before and after (lib/change-register.ts). */
export function readGscExports(dir = gscDir()): GscExport[] {
  try {
    return readdirSync(dir)
      .map((f) => ({ f, date: PAGES_FILE.exec(f)?.[1] }))
      .filter((x): x is { f: string; date: string } => !!x.date)
      .sort((a, b) => a.date.localeCompare(b.date))
      .filter((x, i, all) => all.findIndex((y) => y.date === x.date) === i)
      .map(({ f, date }) => ({ date, rows: parsePagesCsv(readFileSync(join(dir, f), 'utf8')) }));
  } catch {
    return [];
  }
}

/** The newest five Pages exports, summarised. */
export function readGscSummary(dir = gscDir()): GscRead {
  try {
    const files = readdirSync(dir)
      .map((f) => ({ f, date: PAGES_FILE.exec(f)?.[1] }))
      .filter((x): x is { f: string; date: string } => !!x.date)
      .sort((a, b) => b.date.localeCompare(a.date))
      /* One file per date: a day with both spellings keeps the plain one. */
      .filter((x, i, all) => all.findIndex((y) => y.date === x.date) === i)
      .slice(0, 5);
    if (!files.length) return { status: 'absent', reason: 'no Search Console export in data/gsc' };
    const summary = summariseGsc(files.map(({ f, date }) => ({ date, rows: parsePagesCsv(readFileSync(join(dir, f), 'utf8')) })));
    return summary ? { status: 'ok', summary } : { status: 'absent', reason: 'the exports could not be read' };
  } catch {
    return { status: 'absent', reason: 'data/gsc is not readable on this deployment' };
  }
}

/** The summary as text, shared by the email and /admin. `googleLandings`
 *  is the first-party count of sessions whose referrer was Google, printed
 *  beside Google's own click count so the two can be read together. */
export function gscLines(read: GscRead, googleLandings?: number): string[] {
  if (read.status !== 'ok') return [`Search Console: not available, ${read.reason}.`];
  const s = read.summary;
  const out = [
    `Search Console, the 28 days to ${s.newest}${s.compared.length ? `, against the mean of the ${s.compared.length} export${s.compared.length === 1 ? '' : 's'} before (${s.compared.join(', ')})` : ''}:`,
    '',
  ];
  const fmt = (t: GroupTotals) => `${t.clicks} clicks · ${t.impressions} impressions · position ${t.position}`;
  for (const g of ['money', 'info'] as const) {
    const { now, avg } = s.groups[g];
    out.push(`  ${g === 'money' ? 'Pages that book' : 'Pages that inform'} (${now.pages}): ${fmt(now)}`);
    if (avg) out.push(`  ${' '.repeat(g === 'money' ? 15 : 17)}before: ${fmt(avg)}`);
  }
  for (const g of ['money', 'info'] as const) {
    if (!s.movers[g].length) continue;
    out.push('', `  Biggest moves in clicks, ${g === 'money' ? 'pages that book' : 'pages that inform'}:`);
    for (const m of s.movers[g]) out.push(`  ${m.delta > 0 ? '+' : ''}${m.delta} (${m.before} → ${m.clicks}, position ${m.position || 'n/a'})  ${m.path}`);
  }
  if (googleLandings !== undefined) {
    out.push('', `  Sessions this site counted as arriving from Google, since landings began: ${googleLandings}.`);
  }
  out.push('', '  Each export is a 28-day window, so neighbouring exports overlap.');
  return out;
}
