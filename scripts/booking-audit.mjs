#!/usr/bin/env node
/**
 * BOOKING AUDIT - which clients were told the wrong thing, and what to say.
 *
 * READ-ONLY. Sends no email, writes nothing, changes nothing in Cliniko. It
 * only asks Cliniko what happened and compares it against what the site would
 * have said at the time.
 *
 * WHY
 *
 * Until 30 Aug 2026, lib/booking-notify.ts built every confirmation with:
 *
 *     minutes:   Number(ap.duration_in_minutes ?? 50)
 *     isConsult: Number(ap.duration_in_minutes ?? 50) <= 20
 *
 * GET /v1/appointments does not return duration_in_minutes, so the fallback
 * fired every single time. Consequences, for every appointment ever confirmed
 * by this site:
 *
 *   · the confirmation said "50 minutes", whatever was actually booked
 *   · the subject said "Your session is booked" even for a free consultation
 *   · isConsult was false, so consult attendees got the follow-up written for
 *     paying clients - "book your next session" to someone who has not had a
 *     first one
 *
 * A 50-minute individual session was told the truth by accident. Everything
 * else was not. This lists exactly who, so a correction can be sent by hand to
 * the people who need one and nobody else.
 *
 * USAGE
 *
 *     CLINIKO_API_KEY=... node scripts/booking-audit.mjs
 *     CLINIKO_API_KEY=... node scripts/booking-audit.mjs --days 365
 *
 * The key is the same one set on Vercel. It is read from the environment and
 * never written anywhere.
 */

import { readFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const KEY = (process.env.CLINIKO_API_KEY || '').trim();
if (!KEY) {
  console.log(`
  CLINIKO_API_KEY is not set.

  This audit reads appointment history, so it needs the same key Vercel has.
  Get it from the Vercel project's environment variables, then:

      CLINIKO_API_KEY=your-key node scripts/booking-audit.mjs

  Nothing is sent and nothing is modified - it only reads.
`);
  process.exit(1);
}

const shard = KEY.match(/-([a-z]{2}\d+)$/i)?.[1]?.toLowerCase();
if (!shard) {
  console.log('\n  That key has no shard suffix (…-ca1). Cliniko keys end in one.\n');
  process.exit(1);
}

const daysArg = process.argv.indexOf('--days');
const DAYS = daysArg > -1 ? Number(process.argv[daysArg + 1]) || 365 : 365;

/* The one id that decides consult-or-not, read from lib/site.ts so this script
   and the running site can never disagree about which type is the consult. */
const CONSULT = readFileSync(`${ROOT}lib/site.ts`, 'utf8')
  .match(/export const CONSULT_TYPE = '(\d+)'/)?.[1];

class Bail extends Error {}

const headers = {
  Authorization: 'Basic ' + Buffer.from(`${KEY}:`).toString('base64'),
  Accept: 'application/json',
  'User-Agent': 'Westpeak Wellness website (info@westpeakwellness.com)',
};

const get = async (url) => {
  const res = await fetch(url, { headers, cache: 'no-store' });
  /* Thrown, not exited. Calling process.exit() while a fetch is still in
     flight trips a libuv assertion on Windows and buries the message. */
  if (res.status === 401) {
    throw new Bail(
      'Cliniko rejected that key (401).\n\n' +
      '  Check it is the full key including the shard suffix, and that it is\n' +
      '  the one set on Vercel rather than an old one. Nothing was changed.'
    );
  }
  if (res.status === 403) {
    throw new Bail(
      'Cliniko accepted the key but refused the request (403).\n\n' +
      '  The key may lack permission to read appointments. Nothing was changed.'
    );
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url.split('?')[0]}`);
  return res.json();
};

const fmt = (iso) => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Vancouver', year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  } catch { return iso; }
};

/* ---- gather ------------------------------------------------------------- */

try {

const from = new Date(Date.now() - DAYS * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');
const appts = [];
let url =
  `https://api.${shard}.cliniko.com/v1/appointments` +
  `?per_page=100&sort=starts_at:desc&q[]=${encodeURIComponent(`starts_at:>=${from}`)}`;

console.log(`\n  Reading appointments since ${from.slice(0, 10)} …`);
while (url) {
  const page = await get(url);
  appts.push(...(page.appointments ?? []));
  url = page.links?.next ?? null;
}

const typeNames = new Map();
const nameOfType = async (link) => {
  if (!link) return '(none)';
  if (typeNames.has(link)) return typeNames.get(link);
  try {
    const t = await get(link);
    typeNames.set(link, t.name ?? '(unnamed)');
  } catch { typeNames.set(link, '(unreadable)'); }
  return typeNames.get(link);
};

const patients = new Map();
const patientOf = async (link) => {
  if (!link) return null;
  if (patients.has(link)) return patients.get(link);
  try {
    const p = await get(link);
    patients.set(link, { first: p.first_name ?? '', email: p.email ?? '' });
  } catch { patients.set(link, null); }
  return patients.get(link);
};

/* ---- compare ------------------------------------------------------------ */

const rows = [];
for (const ap of appts) {
  if (ap.cancelled_at || ap.archived_at) continue;
  const start = ap.starts_at;
  const end = ap.ends_at;
  const real =
    start && end && Date.parse(end) > Date.parse(start)
      ? Math.round((Date.parse(end) - Date.parse(start)) / 60_000)
      : null;

  const typeLink = ap.appointment_type?.links?.self;
  const typeId = typeLink?.split('/').filter(Boolean).pop();
  const isConsult = typeId === CONSULT;

  /* What the OLD code produced, for every appointment, always. */
  const toldMinutes = 50;
  const toldConsult = false;

  const wrongLength = real !== null && real !== toldMinutes;
  const wrongSubject = isConsult !== toldConsult;
  if (!wrongLength && !wrongSubject) continue;

  const pt = await patientOf(ap.patient?.links?.self);
  rows.push({
    when: fmt(start),
    startsAt: start,
    who: pt?.first ? `${pt.first} <${pt.email || 'no email'}>` : '(no patient record)',
    type: await nameOfType(typeLink),
    real,
    wrongLength,
    wrongSubject,
    past: Date.parse(start) < Date.now(),
  });
}

/* ---- report ------------------------------------------------------------- */

console.log(`  ${appts.length} appointment(s) read, ${rows.length} affected.\n`);

if (!rows.length) {
  console.log('  Nothing was mis-described. No correction to send.\n');
  process.exit(0);
}

console.log('  AFFECTED - each of these received a confirmation saying "50 minutes"');
console.log('  ' + '-'.repeat(94));
for (const r of rows.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))) {
  const issues = [
    r.wrongLength ? `length: said 50, was ${r.real}` : null,
    r.wrongSubject ? 'subject: called a session, was the free consultation' : null,
    r.wrongSubject && r.past ? 'follow-up: got the paying-client message' : null,
  ].filter(Boolean);
  console.log(`  ${r.when}`);
  console.log(`    ${r.who}`);
  console.log(`    ${r.type}`);
  for (const i of issues) console.log(`      · ${i}`);
  console.log('');
}

const consults = rows.filter((r) => r.wrongSubject);
const followedUp = consults.filter((r) => r.past);
console.log('  ' + '-'.repeat(94));
console.log(`  ${rows.length} client(s) told the wrong session length.`);
console.log(`  ${consults.length} booked the free consultation and were called a paid session.`);
console.log(`  ${followedUp.length} of those have already happened, so the wrong follow-up may have gone too.`);
console.log(`
  These are the people worth a one-line correction. The fix is deployed, so
  anything booked from now on is described correctly - this is history only.
`);

} catch (err) {
  /* exitCode, not process.exit(). Exiting while an undici socket is still
     closing trips `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)` on
     Windows — a crash printed underneath a message that had already explained
     the problem cleanly. Setting the code lets Node unwind and exit itself. */
  if (err instanceof Bail) {
    console.log('\n  ' + err.message + '\n');
  } else {
    console.log(`
  The audit could not finish: ${err.message}
  Nothing was sent or changed.
`);
  }
  process.exitCode = 1;
}
