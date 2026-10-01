#!/usr/bin/env node
/* Pull the last 28 days from Search Console into data/gsc/, in the exact
 * shape the "Export → CSV" button produces, so scripts/ctr-delta.mjs and the
 * gap analysis read it without anyone clicking anything.
 *
 * WHY THIS EXISTS
 *
 * Every decision about titles, links and pages on this site is measured
 * against a Search Console export, and every export so far arrived by hand,
 * when the owner remembered. The tool that says whether a change worked is
 * only as good as the cadence of its input. This makes the cadence a cron.
 *
 * WHAT IT NEEDS, ONCE, FROM THE OWNER
 *
 *   1. A Google Cloud service account with the Search Console API enabled
 *      (one already exists for the accountancy practice; any will do).
 *   2. That service account's email added as a user, Full or Restricted, on
 *      the westpeakwellness.com property in Search Console → Settings →
 *      Users and permissions.
 *   3. The service account's JSON key at the path in GSC_SA_JSON.
 *
 * Nothing here can grant itself access; step 2 is a click only the property
 * owner can make. Until it is made, the script says so and exits 2.
 *
 *   GSC_SA_JSON=C:/keys/sa.json node scripts/gsc-pull.mjs
 *   GSC_SA_JSON=... node scripts/gsc-pull.mjs --days 90
 *   GSC_SA_JSON=... node scripts/gsc-pull.mjs --no-inspect
 *
 * WHAT IT WRITES, SINCE 1 OCT 2026 (all under data/gsc/, prefixed with today)
 *
 *   pages.csv, queries.csv   as before; ctr-delta.mjs reads these
 *   page-query.csv           which query each page is shown for
 *   page-country.csv         the language pages by country
 *   date-page.csv            daily rows, so a release shows as a step
 *   window.json              the start and end dates the numbers cover
 *   inspect.json             URL Inspection for the money URLs and every
 *                            sitemap URL with no impressions
 *
 * .github/workflows/gsc-pull.yml runs it on Mondays and commits the files.
 *
 * No dependency: the JWT is signed with node:crypto and the two HTTP calls
 * use fetch. The key never leaves the machine and is never printed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { join } from 'node:path';
import { rowsToCsv, reportWindow, inspectionTargets, inspectionRow, sitemapLocs, LANGUAGE_PAGES } from './gsc-shape.mjs';

const PROPERTY = process.env.GSC_PROPERTY || 'sc-domain:westpeakwellness.com';
const DAYS = Number(process.argv[process.argv.indexOf('--days') + 1]) || 28;
const KEY_PATH = process.env.GSC_SA_JSON;
const OUT = join(process.cwd(), 'data', 'gsc');
const SITE = (process.env.SITE || 'https://www.westpeakwellness.com').replace(/\/+$/, '');
const NO_INSPECT = process.argv.includes('--no-inspect');

if (!KEY_PATH || !existsSync(KEY_PATH)) {
  console.error('GSC_SA_JSON is not set, or the file is missing. See the header of this script.');
  process.exit(2);
}

const sa = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claim)}`;
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` }),
  });
  if (!res.ok) throw new Error(`token: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

/* Search Analytics, paged. The API returns at most 25,000 rows a call; the
   page x query and date x page pulls can pass that on a good month, and a
   silently truncated export is the kind of gap nobody notices. */
async function query(token, dimensions, startDate, endDate, filters) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`;
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        startDate, endDate, dimensions, rowLimit: 25000, startRow, dataState: 'final',
        ...(filters ? { dimensionFilterGroups: [{ filters }] } : {}),
      }),
    });
    if (res.status === 403) {
      console.error(`Search Console refused (403). The service account ${sa.client_email} is not a user on ${PROPERTY}. Add it in Settings → Users and permissions.`);
      process.exit(2);
    }
    if (!res.ok) throw new Error(`${dimensions.join('x')}: ${res.status} ${await res.text()}`);
    const page = (await res.json()).rows ?? [];
    rows.push(...page);
    if (page.length < 25000) return rows;
  }
}

/* URL INSPECTION — added 1 Oct 2026.
   101 of 304 sitemap URLs had no impressions in the 26 Sep export, and the
   exports could not say whether Google holds them at all. One call per URL,
   sequential and spaced: the API allows 600 a minute and 2,000 a day. A URL
   that errors is recorded as an error rather than dropped, so a short file
   is never mistaken for a clean one. */
async function inspect(token, targets) {
  const out = [];
  for (const t of targets) {
    try {
      const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ inspectionUrl: t.url, siteUrl: PROPERTY, languageCode: 'en-CA' }),
      });
      if (res.status === 429) { out.push({ url: t.url, why: t.why, error: 'quota' }); break; }
      out.push(res.ok ? inspectionRow(t, await res.json()) : { url: t.url, why: t.why, error: `HTTP ${res.status}` });
    } catch (e) {
      out.push({ url: t.url, why: t.why, error: e instanceof Error ? e.message : 'failed' });
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  return out;
}

const { startDate, endDate } = reportWindow(new Date(), DAYS);
const token = await accessToken();
const [pages, queries, pageQuery, pageCountry, datePage] = await Promise.all([
  query(token, ['page'], startDate, endDate),
  query(token, ['query'], startDate, endDate),
  /* Which query each page earns. The stress-leave, Gottman and trauma
     questions in gsc.md could not be settled without it. */
  query(token, ['page', 'query'], startDate, endDate),
  /* BC searchers versus translation lookups, on the language pages only. */
  query(token, ['page', 'country'], startDate, endDate, [{ dimension: 'page', operator: 'includingRegex', expression: LANGUAGE_PAGES }]),
  /* Daily rows, so a change shipped on a given day shows as a step rather
     than being averaged into a 28-day number. */
  query(token, ['date', 'page'], startDate, endDate),
]);
mkdirSync(OUT, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const write = (name, text) => writeFileSync(join(OUT, `${stamp}-${name}`), text);
/* The two original files keep their exact names and shape: ctr-delta.mjs
   reads `-pages.csv` and `-queries.csv`, and the new names are chosen so its
   pattern can never pick one of them up by mistake. */
write('pages.csv', rowsToCsv(['Top pages'], pages));
write('queries.csv', rowsToCsv(['Top queries'], queries));
write('page-query.csv', rowsToCsv(['Page', 'Query'], pageQuery));
write('page-country.csv', rowsToCsv(['Page', 'Country'], pageCountry));
write('date-page.csv', rowsToCsv(['Date', 'Page'], datePage));
/* The window the numbers cover. The earlier exports never recorded it, so two
   files a week apart could not be told apart from two files covering the
   same weeks. */
write('window.json', JSON.stringify({
  property: PROPERTY, startDate, endDate, days: DAYS, dataState: 'final', pulledAt: new Date().toISOString(),
  rows: { pages: pages.length, queries: queries.length, pageQuery: pageQuery.length, pageCountry: pageCountry.length, datePage: datePage.length },
}, null, 2) + '\n');

let inspected = 0;
if (!NO_INSPECT) {
  const res = await fetch(`${SITE}/sitemap.xml`, { headers: { 'user-agent': 'westpeak-gsc-pull' } });
  if (res.ok) {
    const targets = inspectionTargets(sitemapLocs(await res.text()), pages.map((r) => r.keys[0]), SITE);
    const rows = await inspect(token, targets);
    inspected = rows.length;
    write('inspect.json', JSON.stringify({ inspectedAt: new Date().toISOString(), property: PROPERTY, rows }, null, 2) + '\n');
  } else {
    console.error(`sitemap ${res.status}: URL inspection skipped`);
  }
}

const clicks = pages.reduce((a, r) => a + r.clicks, 0), imps = pages.reduce((a, r) => a + r.impressions, 0);
console.log(`${startDate} to ${endDate}: ${pages.length} pages, ${queries.length} queries, ${pageQuery.length} page x query, ${datePage.length} daily rows, ${clicks} clicks, ${imps} impressions, ${inspected} URLs inspected → data/gsc/${stamp}-*`);
console.log('Now: node scripts/ctr-delta.mjs');
