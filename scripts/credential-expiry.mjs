#!/usr/bin/env node
/**
 * DEADLINES THAT CURRENTLY ONLY EXIST AS DATA.
 *
 * lib/practitioners.ts records `validTo` on a credential — the date the
 * registration runs to. It is displayed, it is accurate, and nothing has ever
 * looked at it. One of the two on file runs out on 2026-12-31.
 *
 * WHY THAT IS NOT AN ORDINARY STALE-CONTENT PROBLEM. Every counsellor page,
 * every city page and the schema.org markup on all of them assert a current
 * registration with a named regulator and a number a stranger can check. On
 * the day it lapses, all of that becomes a claim about a registration that no
 * longer exists — made by a health practice, about a regulated title, on
 * pages written to be trusted. It is a professional-standards problem that
 * happens to be expressed in HTML, and the only thing standing between the
 * practice and it is somebody remembering.
 *
 * AN ABSENT DATE IS ALSO REPORTED, and that is the larger half of this. A
 * credential with no validTo cannot expire as far as this repository is
 * concerned; it is not safe, it is unwatched. The same is true of professional
 * liability insurance, which gates whether Alberta can open at all and has
 * never been recorded here as a date at all — the reasoning about it lives in
 * a comment, which is not something a check can read.
 *
 *   node scripts/credential-expiry.mjs           report; fails only on lapsed
 *   node scripts/credential-expiry.mjs --strict  also fails inside the window
 */

import { readFileSync } from 'node:fs';

const STRICT = process.argv.includes('--strict');

/* Long enough to renew a registration without hurrying, which is the point:
   a warning that arrives the week before is a warning that arrives too late. */
const WARN_DAYS = 120;

const src = readFileSync('lib/practitioners.ts', 'utf8');

/* Read the source rather than importing it. This file is checked by CI before
   anything is built, the module pulls in half the site, and a regex over a
   field written in a fixed shape is enough. If that shape ever changes, the
   count below drops and the report says so out loud rather than passing. */
const names = [...src.matchAll(/^\s*name:\s*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
const creds = [...src.matchAll(
  /short:\s*['"]([^'"]+)['"][\s\S]{0,400}?full:\s*['"]([^'"]+)['"]/g
)].map((m) => ({ short: m[1], full: m[2] }));
const validTos = [...src.matchAll(/validTo:\s*['"](\d{4}-\d{2}-\d{2})['"]/g)].map((m) => m[1]);

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const days = (iso) => Math.round((Date.parse(iso) - Date.parse(today)) / 86_400_000);

const lapsed = [];
const soon = [];

for (const d of validTos) {
  const n = days(d);
  if (n < 0) lapsed.push({ date: d, days: n });
  else if (n <= WARN_DAYS) soon.push({ date: d, days: n });
}

const missing = creds.length - validTos.length;

console.log('\nCREDENTIAL AND COVER EXPIRY\n');
console.log(`  ${names.length} practitioner(s), ${creds.length} credential(s), ${validTos.length} with a recorded expiry\n`);

if (lapsed.length) {
  console.log(`  ${lapsed.length} LAPSED\n`);
  for (const l of lapsed) {
    console.log(`    ${l.date} — ${Math.abs(l.days)} days ago`);
  }
  console.log(
    '\n    Pages and schema.org markup across this site assert this registration\n' +
    '    as current. Take the claim down or renew it; leaving it is not an option.\n'
  );
}

if (soon.length) {
  console.log(`  ${soon.length} EXPIRING WITHIN ${WARN_DAYS} DAYS\n`);
  for (const s of soon) console.log(`    ${s.date} — ${s.days} days`);
  console.log('');
}

if (missing > 0) {
  console.log(`  ${missing} CREDENTIAL(S) WITH NO RECORDED EXPIRY\n`);
  console.log(
    '    Not watched rather than not expiring. Add validTo from the document,\n' +
    '    or this check is silent about it forever.\n'
  );
}

/* Insurance has no field at all, so its absence has to be asserted here rather
   than counted. Stated every run, deliberately: this is the gate on whether
   Alberta can open, and the whole reasoning about it currently lives in a
   source comment, which nothing can check and nobody re-reads. */
console.log('  PROFESSIONAL LIABILITY INSURANCE\n');
console.log('    No renewal date is recorded anywhere in this repository.');
console.log('    It gates the Alberta launch and it is the one deadline here with');
console.log('    no data behind it at all. Two dates are needed: the founder\'s');
console.log('    policy, and Camille\'s.\n');

if (lapsed.length) process.exit(1);
if (STRICT && (soon.length || missing > 0)) process.exit(1);
process.exit(0);
