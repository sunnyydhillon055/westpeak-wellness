#!/usr/bin/env node
/**
 * BING AI — what Copilot and Bing's AI answers cite from this site.
 *
 * Reads the AI Performance exports from Bing Webmaster Tools, saved by hand
 * as data/bing/<YYYY-MM-DD>-ai-<anything>.csv (one date per export; the
 * daily series, the pages tab and the grounding-queries tab may each be its
 * own file). Prints, for the newest export:
 *
 *   · citations over the last 7 days and the mean cited pages a day, with
 *     the change since the previous export
 *   · the most-cited URLs
 *   · the grounding queries mapped to the 3 Oct 2026 topic buckets
 *
 * Grounding queries are the retrieval queries the model rewrote before it
 * cited a page, not what anyone typed, which is why they are bucketed here
 * and not added to the Google query series in ctr-delta.mjs.
 *
 *   node scripts/bing-ai.mjs
 *
 * The parser and the topic buckets are ctr-delta's (scripts/lib/
 * query-topics.mjs); the summary is scripts/lib/bing-ai-core.mjs, which
 * /admin also reads. Nothing here fetches anything.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from './lib/query-topics.mjs';
import { exportsByDate, summarise, adminLine, byTopic } from './lib/bing-ai-core.mjs';

const DIR = join(process.cwd(), 'data', 'bing');
const files = existsSync(DIR) ? readdirSync(DIR) : [];
const dates = exportsByDate(files);

if (!dates.length) {
  console.log('\nNo Bing AI Performance export in data/bing/ yet.');
  console.log('Bing Webmaster Tools → AI Performance → Export, then save each CSV as');
  console.log('data/bing/<YYYY-MM-DD>-ai-<tab>.csv (for example 2026-10-10-ai-pages.csv).\n');
  process.exit(0);
}

const load = (d) => summarise(d.date, d.files.map((name) => ({ name, rows: parseCsv(readFileSync(join(DIR, name), 'utf8')) })));
const latest = load(dates[dates.length - 1]);
const previous = dates.length > 1 ? load(dates[dates.length - 2]) : null;

console.log(`\nBING AI PERFORMANCE — export of ${latest.date}${previous ? `, against ${previous.date}` : ''}\n`);
console.log('  ' + adminLine(latest, previous));
if (latest.days && latest.days < 7) console.log(`  (the daily file holds only ${latest.days} days)`);
if (previous && previous.citedPages7d !== null && latest.citedPages7d !== null) {
  const d = latest.citedPages7d - previous.citedPages7d;
  console.log(`  Cited pages: ${latest.citedPages7d.toFixed(1)} (${d >= 0 ? '+' : ''}${d.toFixed(1)} since ${previous.date})`);
}

if (latest.pages.length) {
  console.log('\nTOP CITED URLS\n');
  for (const p of latest.pages.slice(0, 15)) {
    console.log(`  ${String(p.cites).padStart(5)}  ${p.url.replace(/^https?:\/\/[^/]+/, '') || '/'}`);
  }
}

if (latest.queries.length) {
  console.log('\nGROUNDING QUERIES BY TOPIC (3 Oct 2026 buckets)\n');
  for (const g of byTopic(latest.queries)) {
    console.log(`  ${g.topic}: ${g.count} queries, ${g.cites} citations`);
    for (const q of g.list.slice(0, 8)) console.log(`    ${String(q.cites).padStart(5)}  ${q.query}`);
  }
}

if (latest.unrecognised.length) {
  console.log(`\nNot recognised (no date, page or query column): ${latest.unrecognised.join(', ')}`);
  console.log('Read the headers and teach shapeOf() in scripts/lib/bing-ai-core.mjs; do not rename columns by hand.');
}
console.log();
