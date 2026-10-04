/**
 * BING AI PERFORMANCE — the pure half, shared by scripts/bing-ai.mjs and the
 * /admin line (lib/bing-ai.ts). Added 3 Oct 2026.
 *
 * Bing Webmaster Tools' AI Performance report counts how often Copilot and
 * Bing's AI answers cite this site, which pages, and the grounding queries:
 * the rewritten retrieval queries the model ran before citing. They are not
 * what a person typed, so they get their own topic mapping (the 3 Oct buckets
 * in query-topics.mjs) rather than being mixed into the Google query series.
 *
 * Exports are saved by hand as data/bing/<YYYY-MM-DD>-ai-<anything>.csv, the
 * date being the day of the export. The report's CSV headers were not
 * published when this was written, so a file is recognised by its columns,
 * case-insensitively:
 *   · a date column and a citations column        → the daily series
 *   · a page / URL column and a citations column  → cited pages
 *   · a query column                              → grounding queries
 * A file that matches none is listed as unrecognised, never guessed at.
 */

import { parseCsv, num, topicOf } from './query-topics.mjs';

export const AI_FILE = /^(\d{4}-\d{2}-\d{2})-ai-.*\.csv$/i;

const col = (head, re) => head.find((h) => re.test(h));

/** Which of the three shapes a parsed export is, with the columns it uses. */
export function shapeOf(rows) {
  if (!rows.length) return { kind: 'empty' };
  const head = Object.keys(rows[0]);
  const cites = col(head, /^(total )?citations?$/i) ?? col(head, /citations?(?! share)/i);
  const date = col(head, /^(date|day)$/i);
  const pages = col(head, /cited pages|unique pages/i);
  const url = col(head, /^(url|page|pages|top pages|page url)$/i);
  const query = col(head, /query/i);
  if (date && cites) return { kind: 'daily', date, cites, pages };
  if (url && cites) return { kind: 'pages', url, cites };
  if (query) return { kind: 'queries', query, cites, pages };
  return { kind: 'unrecognised', head };
}

/** Group file names by export date, newest last. */
export function exportsByDate(files) {
  const by = new Map();
  for (const f of files) {
    const m = AI_FILE.exec(f);
    if (!m) continue;
    if (!by.has(m[1])) by.set(m[1], []);
    by.get(m[1]).push(f);
  }
  return [...by.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, list]) => ({ date, files: list.sort() }));
}

const isoDay = (v) => {
  const s = String(v ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

/** One export date's figures from its parsed files: [{ name, rows }]. */
export function summarise(date, parsed) {
  const out = { date, citations7d: null, citedPages7d: null, days: 0, pages: [], queries: [], unrecognised: [] };
  for (const { name, rows } of parsed) {
    const s = shapeOf(rows);
    if (s.kind === 'daily') {
      const daily = rows
        .map((r) => ({ day: isoDay(r[s.date]), cites: num(r[s.cites]), pages: s.pages ? num(r[s.pages]) : null }))
        .filter((r) => r.day)
        .sort((a, b) => a.day.localeCompare(b.day));
      const last7 = daily.slice(-7);
      out.days = last7.length;
      out.citations7d = last7.reduce((n, r) => n + r.cites, 0);
      const withPages = last7.filter((r) => r.pages !== null);
      out.citedPages7d = withPages.length ? withPages.reduce((n, r) => n + r.pages, 0) / withPages.length : null;
    } else if (s.kind === 'pages') {
      out.pages = rows.map((r) => ({ url: String(r[s.url]).trim(), cites: num(r[s.cites]) }))
        .filter((r) => r.url).sort((a, b) => b.cites - a.cites);
    } else if (s.kind === 'queries') {
      out.queries = rows.map((r) => ({
        query: String(r[s.query]).replace(/\s+/g, ' ').trim(),
        cites: s.cites ? num(r[s.cites]) : 0,
      })).filter((r) => r.query).map((r) => ({ ...r, topic: topicOf(r.query) }));
    } else if (s.kind === 'unrecognised') {
      out.unrecognised.push(name);
    }
  }
  /* No daily file: the pages export still gives a count of cited pages. */
  if (out.citedPages7d === null && out.pages.length) out.citedPages7d = out.pages.filter((p) => p.cites > 0).length;
  return out;
}

const signed = (n, digits = 0) => (n >= 0 ? '+' : '') + n.toFixed(digits);

/** The one /admin line. `latest` and `previous` are summarise() results. */
export function adminLine(latest, previous) {
  if (!latest) return 'Copilot citations, 7 days: no Bing export yet (save the AI Performance CSVs as data/bing/<date>-ai-*.csv).';
  if (latest.citations7d === null) return `Copilot citations, 7 days: the ${latest.date} Bing export has no daily citations file.`;
  let line = `Copilot citations, 7 days: ${latest.citations7d} to ${latest.date}`;
  if (latest.citedPages7d !== null) line += `, ${latest.citedPages7d.toFixed(1)} cited pages`;
  if (previous && previous.citations7d !== null) line += ` (${signed(latest.citations7d - previous.citations7d)} since ${previous.date})`;
  return line + '.';
}

/** Grounding queries grouped by 3 Oct topic bucket, largest first. */
export function byTopic(queries) {
  const g = {};
  for (const q of queries) (g[q.topic] ||= []).push(q);
  return Object.entries(g)
    .map(([topic, list]) => ({ topic, count: list.length, cites: list.reduce((n, q) => n + q.cites, 0), list: list.sort((a, b) => b.cites - a.cites) }))
    .sort((a, b) => b.cites - a.cites || b.count - a.count);
}
