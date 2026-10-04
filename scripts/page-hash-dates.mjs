#!/usr/bin/env node
/* DATE EACH PAGE BY ITS OWN RENDERED CONTENT — 3 Oct 2026.
 *
 * WHY THIS EXISTS
 *
 * scripts/page-dates.mjs dates a page by the last commit to the file its copy
 * lives in, and most pages share a file with dozens of others. A one-FAQ edit
 * to the Kamloops anxiety page (3cce0d1) touched lib/city-services.ts, so all
 * 100 city-service pages, the 27 city hubs and the 16 Punjabi region pages
 * took that day's date; 167 of 415 sitemap URLs said 2026-10-03. That is the
 * failure page-dates.mjs's own header warns about: dates that move on an
 * unrelated change teach Google to ignore lastmod.
 *
 * WHAT IT DOES
 *
 * After a build, it hashes the visible text of each listed page's <main>
 * (scripts/lib/page-hash.mjs says what is left out and why) and compares with
 * data/page-hashes.json. A page whose hash moved takes today's date (Pacific);
 * every other page keeps the date it had. The first time a page is seen it
 * takes the date the sitemap already gives it, so the first run changes no
 * lastmod at all. It then writes lib/url-dates.ts, which the sitemap and
 * lib/page-dates.ts read first, with the collection date as the fallback.
 *
 * Pages rendered on demand have no file to hash and keep their collection
 * date; the run names them.
 *
 *   npm run build && npm run hashes          update the record and the dates
 *   node scripts/page-hash-dates.mjs --check  report pages whose content moved
 *                                             without a new date; exit 1 if any
 *   --today YYYY-MM-DD                        the day to give a changed page
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readBuiltSitemap } from './lib/built-sitemap.mjs';
import { mainText, hashText, nextTable, formatTable, renderUrlDates, pacificDay } from './lib/page-hash.mjs';

const RECORD = join('data', 'page-hashes.json');
const GENERATED = join('lib', 'url-dates.ts');

/** path -> lastmod day, for every <url> in the built sitemap. */
export function listedDays(xml) {
  const out = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    const path = new URL(loc.trim().replace(/&amp;/g, '&')).pathname || '/';
    const lastmod = (m[1].match(/<lastmod>(\d{4}-\d{2}-\d{2})/) || [])[1];
    out.set(path, lastmod ?? null);
  }
  return out;
}

const htmlFor = (built, path) => join(built, path === '/' ? 'index.html' : `${path.slice(1)}.html`);

function main(argv) {
  const built = join(process.cwd(), '.next', 'server', 'app');
  const sitemap = existsSync(built) ? readBuiltSitemap(built) : null;
  if (!sitemap) {
    console.error('No built sitemap. Run `npm run build` first.');
    return 1;
  }
  if (sitemap.missing.length) {
    console.error(`The sitemap index names children that were not built: ${sitemap.missing.join(', ')}`);
    return 1;
  }
  const i = argv.indexOf('--today');
  const today = i >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(argv[i + 1] ?? '') ? argv[i + 1] : pacificDay();

  const listed = listedDays(sitemap.xml);
  const hashes = new Map();
  const unhashed = [];
  for (const path of listed.keys()) {
    const file = htmlFor(built, path);
    const text = existsSync(file) ? mainText(readFileSync(file, 'utf8')) : null;
    if (text) hashes.set(path, hashText(text));
    else unhashed.push(path);
  }
  const prev = existsSync(RECORD) ? JSON.parse(readFileSync(RECORD, 'utf8')) : {};
  const seed = new Map([...listed].filter(([, d]) => d).map(([p, d]) => [p, d]));
  const { table, changed, added, removed } = nextTable(prev, hashes, { today, seed });

  console.log(`  ${hashes.size} pages hashed; ${changed.length} changed, ${added.length} new, ${removed.length} gone`);
  for (const p of changed.slice(0, 40)) console.log(`    changed  ${p}`);
  if (changed.length > 40) console.log(`    …and ${changed.length - 40} more`);
  if (unhashed.length) console.log(`  not hashed (rendered on demand, collection date kept): ${unhashed.join(', ')}`);

  if (argv.includes('--check')) {
    if (changed.length || added.length) {
      console.log('  content moved without a new date: run `npm run hashes` after the build and commit both files.');
      return 1;
    }
    return 0;
  }
  writeFileSync(RECORD, formatTable(table));
  writeFileSync(GENERATED, renderUrlDates(table));
  console.log(`  ${RECORD} and ${GENERATED} written; changed pages dated ${today}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
