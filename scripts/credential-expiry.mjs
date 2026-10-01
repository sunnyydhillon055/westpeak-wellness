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
 *                                                (a policy: lapsed past its grace)
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
/* Insurance blocks carry their own validTo; keep the two apart so a policy
   date is never counted as a registration date or vice versa. */
const insuranceBlocks = [...src.matchAll(/insurance:\s*\{([\s\S]*?)\n\s*\},/g)].map((m) => m[1]);
const insuranceTos = insuranceBlocks.map((b) => (b.match(/validTo:\s*['"](\d{4}-\d{2}-\d{2})['"]/) || [])[1]).filter(Boolean);
const srcNoInsurance = src.replace(/insurance:\s*\{[\s\S]*?\n\s*\},/g, '');
const validTos = [...srcNoInsurance.matchAll(/validTo:\s*['"](\d{4}-\d{2}-\d{2})['"]/g)].map((m) => m[1]);

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

/* PROFESSIONAL LIABILITY INSURANCE — a field since 8 Sep 2026, so it is
   counted rather than asserted. A practitioner with no `insurance` block is
   reported by name: cover that is not recorded cannot be watched, and it is
   the gate on which provinces a counsellor may be offered in. */
/* The grace period is read from the roster, so the script and the page gate
   (insuranceStatus in lib/practitioners.ts) cannot disagree about the day
   Alberta comes down. Inside the grace the pages still stand and this warns;
   from the gate day on the pages are already gated and this FAILS, because a
   lapsed policy is an owner action, not something to build past quietly. */
const GRACE = Number((src.match(/INSURANCE_GRACE_DAYS\s*=\s*(\d+)/) || [])[1] ?? NaN);
if (!Number.isFinite(GRACE)) {
  console.log('  INSURANCE_GRACE_DAYS not found in lib/practitioners.ts; treating any lapse as gated.');
}
const grace = Number.isFinite(GRACE) ? GRACE : 0;
const insLapsed = insuranceTos.filter((d) => days(d) <= -grace);
const insGrace = insuranceTos.filter((d) => days(d) < 0 && days(d) > -grace);
const insSoon = insuranceTos.filter((d) => days(d) >= 0 && days(d) <= WARN_DAYS);
const uninsured = names.length - insuranceBlocks.length;
console.log('  PROFESSIONAL LIABILITY INSURANCE\n');
console.log(`    ${insuranceBlocks.length} of ${names.length} practitioner(s) have a policy recorded`);
for (const d of insuranceTos) {
  const n = days(d);
  const tag = n <= -grace ? '  LAPSED - Alberta and Canada-wide reach are gated off; verify fails'
    : n < 0 ? `  LAPSED - in grace; Alberta pages come down on the first build ${grace + n} day(s) from now`
    : n <= WARN_DAYS ? '  RENEW' : '';
  console.log(`    policy to ${d} — ${n} days${tag}`);
}
if (insGrace.length) {
  console.log('\n    Record the renewal certificate dates in lib/practitioners.ts before the');
  console.log('    grace runs out, or the Alberta place pages and "anywhere in Canada" go.');
}
if (uninsured > 0) {
  console.log(`\n    ${uninsured} practitioner(s) with NO POLICY RECORDED. Not watched rather than`);
  console.log('    not insured: add the certificate\'s dates to the roster.');
}
console.log('');

/* THE REGISTER CHECK, DATED — 1 Oct 2026. Each profile prints "checked on
   the register <date>" beside its verify link (registerCheckedOn). The date
   is honest however old it gets, but a check from last year is not much of a
   check, so past REGISTER_DAYS it is reported, and --strict fails on it.
   Re-read the entry (bcacc.ca/search-our-member-register/?mid=<number>) and
   move the date; never move it without reading. */
const REGISTER_DAYS = 90;
const checks = [...src.matchAll(/registerCheckedOn:\s*['"](\d{4}-\d{2}-\d{2})['"]/g)].map((m) => m[1]);
const staleChecks = checks.filter((d) => -days(d) > REGISTER_DAYS);
console.log('  REGISTER CHECKS\n');
console.log(`    ${checks.length} registration(s) with a dated register check`);
for (const d of checks) {
  const n = -days(d);
  console.log(`    checked ${d} — ${n} days ago${n > REGISTER_DAYS ? `  STALE - over ${REGISTER_DAYS} days; re-read the register` : ''}`);
}
console.log('');

if (lapsed.length || insLapsed.length) process.exit(1);
if (STRICT && (soon.length || insSoon.length || insGrace.length || missing > 0 || uninsured > 0 || staleChecks.length)) process.exit(1);
process.exit(0);
