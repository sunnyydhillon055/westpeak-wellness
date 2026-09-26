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
 *
 * No dependency: the JWT is signed with node:crypto and the two HTTP calls
 * use fetch. The key never leaves the machine and is never printed.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { join } from 'node:path';

const PROPERTY = process.env.GSC_PROPERTY || 'sc-domain:westpeakwellness.com';
const DAYS = Number(process.argv[process.argv.indexOf('--days') + 1]) || 28;
const KEY_PATH = process.env.GSC_SA_JSON;
const OUT = join(process.cwd(), 'data', 'gsc');

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

async function query(token, dimension, startDate, endDate) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions: [dimension], rowLimit: 5000, dataState: 'final' }),
  });
  if (res.status === 403) {
    console.error(`Search Console refused (403). The service account ${sa.client_email} is not a user on ${PROPERTY}. Add it in Settings → Users and permissions.`);
    process.exit(2);
  }
  if (!res.ok) throw new Error(`${dimension}: ${res.status} ${await res.text()}`);
  return (await res.json()).rows ?? [];
}

const iso = (d) => d.toISOString().slice(0, 10);
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const toCsv = (label, rows) =>
  [`${label},Clicks,Impressions,CTR,Position`, ...rows
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .map((r) => [csvCell(r.keys[0]), r.clicks, r.impressions, `${(r.ctr * 100).toFixed(2)}%`, r.position.toFixed(2)].join(','))]
    .join('\n') + '\n';

const end = new Date(); end.setUTCDate(end.getUTCDate() - 2);       // GSC lags about two days
const start = new Date(end); start.setUTCDate(start.getUTCDate() - DAYS + 1);
const token = await accessToken();
const [pages, queries] = await Promise.all([query(token, 'page', iso(start), iso(end)), query(token, 'query', iso(start), iso(end))]);
mkdirSync(OUT, { recursive: true });
const stamp = iso(new Date());
writeFileSync(join(OUT, `${stamp}-pages.csv`), toCsv('Top pages', pages));
writeFileSync(join(OUT, `${stamp}-queries.csv`), toCsv('Top queries', queries));
const clicks = pages.reduce((a, r) => a + r.clicks, 0), imps = pages.reduce((a, r) => a + r.impressions, 0);
console.log(`${iso(start)} to ${iso(end)}: ${pages.length} pages, ${queries.length} queries, ${clicks} clicks, ${imps} impressions → data/gsc/${stamp}-*.csv`);
console.log('Now: node scripts/ctr-delta.mjs');
