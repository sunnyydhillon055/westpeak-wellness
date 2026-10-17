#!/usr/bin/env node
/* Consult and paid times per counsellor per week, to 15 January — 16 Oct 2026
 * (item 559).
 *
 *   node --experimental-strip-types --no-warnings scripts/season-capacity.mjs
 *
 * WHY. /resources/counselling-benefits-before-year-end-bc tells readers to
 * book on or before 31 December, and that query family climbs in November
 * and December. A free consultation in December that cannot become a paid
 * session before 31 December is the one the page's whole argument loses.
 * lib/cliniko-availability.ts reads only the consultation type, two weeks
 * ahead, so nothing could see whether paid times were open that far out;
 * "open December" (round 3) and "open the calendar by 1 December" (OUTREACH
 * §26, owner item 13) were instructions with nothing to check them.
 *
 * WHAT IT PRINTS. For each counsellor accepting new clients, one row per
 * week from this week to 15 January, and one column per appointment type
 * she is offered under (the consultation, then each paid type her services
 * are billed as in OFFERINGS, ids from FALLBACK_CATALOG in
 * lib/cliniko-catalog.ts). Each cell is the number of start times Cliniko
 * would offer online that week. Then two flags:
 *
 *   1. YEAR-END GAP: a week that touches 16 Nov to 23 Dec with consultation
 *      times but no paid times.
 *   2. JANUARY: whether 4 to 15 January has consultation and paid times.
 *
 * WHAT IT IS NOT. Counts only; no time of day is printed, and nothing here
 * reaches the site, which states no hours by decision. READ ONLY: every
 * request is a GET, and fetch is wrapped so any other method throws before it
 * leaves the machine; nothing writes to Cliniko or to this repository.
 *
 * THE KEY, as scripts/cliniko-doctor.mjs handles it: CLINIKO_API_KEY from the
 * environment (or .env.local, as scripts/unpaid-bookings.mjs reads it), the
 * shard taken from its suffix ("-ca1"), Basic auth with the key as the user.
 * It is never printed. Without a key this says so and exits 0.
 *
 * OWNER: run it about 1 November and again about 1 December, and open paid
 * times in Cliniko wherever it flags a gap (docs/OWNER-ACTIONS-2026-10-15.md). */
import { existsSync, readFileSync } from 'node:fs';
import { register } from 'node:module';
import { needsTypeStripping } from './lib/needs-type-stripping.mjs';

needsTypeStripping('scripts/season-capacity.mjs');

const root = new URL('..', import.meta.url);
const envFile = new URL('.env.local', root);
if (!process.env.CLINIKO_API_KEY && existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?(CLINIKO_API_KEY|CLINIKO_SHARD)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
let key = (process.env.CLINIKO_API_KEY || '').trim();
/* A key without a shard suffix, with the shard given separately. */
if (key && process.env.CLINIKO_SHARD && !/-[a-z]{2}\d+$/i.test(key)) key = `${key}-${process.env.CLINIKO_SHARD.trim()}`;
if (!key) {
  console.log('CLINIKO_API_KEY not set: nothing read. Set it in this shell or .env.local and re-run.');
  process.exit(0);
}
const shard = (key.match(/-([a-z]{2}\d+)$/i) || [])[1];
if (!shard) {
  console.log('CLINIKO_API_KEY has no shard suffix (expected something like "-ca1"). Cannot build a URL.');
  process.exit(0);
}
const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');
const base = `https://api.${shard}.cliniko.com/v1`;

const realFetch = globalThis.fetch;
globalThis.fetch = (url, init = {}) => {
  const method = String(init.method ?? 'GET').toUpperCase();
  if (method !== 'GET') throw new Error(`refused: ${method} from a read-only script`);
  return realFetch(url, init);
};

/* The "@/" alias the lib modules use, via the test suite's resolve hook. */
process.chdir(new URL('.', root).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
register('../test/alias-hooks.mjs', import.meta.url);
const { CLINIKO_BUSINESS, CONSULT_TYPE } = await import('../lib/site.ts');
const { FALLBACK_CATALOG } = await import('../lib/cliniko-catalog.ts');
const { OFFERINGS } = await import('../lib/practitioner-facts.ts');
const { practitioners } = await import('../lib/practitioners.ts');

/* ---- dates: Pacific, week by week (Monday to Sunday) to 15 January ------- */
const pacificToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const toDate = (iso) => new Date(`${iso}T12:00:00Z`);
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => iso(new Date(toDate(s).getTime() + n * 86_400_000));
const year = Number(pacificToday.slice(0, 4));
/* The season this run is about: 15 January of the coming year, or of this
   year when run in the first half of January. */
const END = pacificToday <= `${year}-01-15` ? `${year}-01-15` : `${year + 1}-01-15`;
const endYear = Number(END.slice(0, 4));
const GAP_FROM = `${endYear - 1}-11-16`;
const GAP_TO = `${endYear - 1}-12-23`;
const JAN_FROM = `${endYear}-01-04`;
const JAN_TO = END;

const weeks = [];
{
  const dow = (toDate(pacificToday).getUTCDay() + 6) % 7; /* Monday = 0 */
  let monday = addDays(pacificToday, -dow);
  while (monday <= END) {
    const from = monday < pacificToday ? pacificToday : monday;
    const sunday = addDays(monday, 6);
    weeks.push({ from, to: sunday > END ? END : sunday, monday });
    monday = addDays(monday, 7);
  }
}

/* ---- the types: the consultation, then what each counsellor is billed as -- */
const byName = (name) => FALLBACK_CATALOG.items.find((i) => i.name === name);
const consult = FALLBACK_CATALOG.items.find((i) => i.id === CONSULT_TYPE);
function typesFor(p) {
  const names = [...new Set(OFFERINGS.filter((o) => p.services.includes(o.service)).flatMap((o) => o.billedAs.map((b) => b.name)))];
  const paid = names.map(byName).filter((i) => i && i.cents > 0 && i.onlineBookable);
  return [{ ...consult, paid: false }, ...paid.map((i) => ({ ...i, paid: true }))];
}

async function get(url) {
  const res = await fetch(url, {
    headers: { Authorization: auth, Accept: 'application/json', 'User-Agent': 'Westpeak Wellness season capacity (info@westpeakwellness.com)' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
  return res.json();
}

/* Start times Cliniko would offer online for one type, one practitioner, one
   window of at most seven days (Cliniko's cap). Pages are followed. */
async function countTimes(practitionerId, typeId, from, to) {
  let url = `${base}/businesses/${CLINIKO_BUSINESS}/practitioners/${practitionerId}/appointment_types/${typeId}/available_times?from=${from}&to=${to}&per_page=100`;
  let n = 0;
  for (let page = 0; url && page < 20; page++) {
    const body = await get(url);
    n += (body.available_times ?? []).length;
    url = body.links?.next ?? null;
    /* Cliniko allows 200 requests a minute; a short pause keeps a full run
       well inside it. */
    await new Promise((r) => setTimeout(r, 300));
  }
  return n;
}

const short = (s) => {
  const d = toDate(s);
  return `${d.getUTCDate()} ${d.toLocaleString('en-CA', { month: 'short', timeZone: 'UTC' }).replace('.', '')}`;
};
const label = (i) => (i.id === CONSULT_TYPE ? 'Consult' : i.name.replace(' Counselling', '').replace('Couples Extended', 'Couples 110'));

const accepting = practitioners.filter((p) => p.acceptingNewClients && p.bookable && p.clinikoPractitionerId);
console.log(`\nSEASON CAPACITY, read ${pacificToday} (Pacific), weeks to ${END}. Counts of online start times; no times of day.\n`);

const findings = [];
let failed = false;
for (const p of accepting) {
  const types = typesFor(p);
  const rows = [];
  try {
    for (const w of weeks) {
      const counts = [];
      for (const t of types) counts.push(await countTimes(p.clinikoPractitionerId, t.id, w.from, w.to));
      rows.push({ ...w, counts });
    }
  } catch (e) {
    console.log(`${p.name}: could not be read (${e instanceof Error ? e.message : 'request failed'})\n`);
    failed = true;
    continue;
  }

  const head = '  ' + 'week of'.padEnd(10) + types.map((t) => label(t).padStart(15)).join('');
  console.log(p.name);
  console.log(head);
  console.log('  ' + '-'.repeat(head.length - 2));
  for (const r of rows) console.log('  ' + short(r.monday).padEnd(10) + r.counts.map((c) => String(c).padStart(15)).join(''));
  console.log();

  const paidIn = (r) => r.counts.reduce((n, c, i) => n + (types[i].paid ? c : 0), 0);
  const consultIn = (r) => r.counts[0];
  for (const r of rows) {
    if (r.to < GAP_FROM || r.from > GAP_TO) continue;
    if (consultIn(r) > 0 && paidIn(r) === 0) {
      findings.push(`YEAR-END GAP  ${p.name}, week of ${short(r.monday)}: ${consultIn(r)} consultation time(s), no paid times. Open paid times that week or the next, before 31 December.`);
    }
  }
  const jan = rows.filter((r) => r.to >= JAN_FROM && r.from <= JAN_TO);
  const janPaid = jan.reduce((n, r) => n + paidIn(r), 0);
  const janConsult = jan.reduce((n, r) => n + consultIn(r), 0);
  findings.push(janPaid > 0 && janConsult > 0
    ? `JANUARY      ${p.name}: open for ${short(JAN_FROM)} to ${short(JAN_TO)} (${janConsult} consultation, ${janPaid} paid time(s)).`
    : `JANUARY      ${p.name}: NOT open for ${short(JAN_FROM)} to ${short(JAN_TO)} (${janConsult} consultation, ${janPaid} paid time(s)). Owner item 13: open the January calendar by 1 December.`);
}

if (!accepting.length) console.log('No counsellor is accepting new clients and bookable online: nothing to read.\n');
console.log('FLAGS');
for (const f of findings) console.log(`  ${f}`);
if (!findings.some((f) => f.startsWith('YEAR-END GAP')) && accepting.length && !failed) {
  console.log(`  No week between ${short(GAP_FROM)} and ${short(GAP_TO)} has consultation times without paid times.`);
}
console.log();
/* exitCode, not exit(): exiting with fetch's sockets still closing trips a
   libuv assertion on Windows. */
if (failed) process.exitCode = 1;
