#!/usr/bin/env node
/**
 * BOOKING MAPPING - what the confirmation email says a client booked.
 *
 * WHY THIS EXISTS
 *
 * On 30 Aug 2026 a client booked the free 15-minute consultation. Cliniko
 * recorded it correctly. The confirmation this site sent said "50 minutes",
 * under the subject "Your session is booked" instead of "Your free
 * consultation is booked".
 *
 * One line did both:
 *
 *     minutes:   Number(ap.duration_in_minutes ?? 50)
 *     isConsult: Number(ap.duration_in_minutes ?? 50) <= 20
 *
 * GET /v1/appointments does not return `duration_in_minutes`. It returns
 * starts_at, ends_at, and appointment_type as a link object. The field was
 * always undefined, so the fallback always fired: every consultation ever
 * booked was confirmed as a 50-minute paid session, and every one was queued
 * for the wrong follow-up. Not an edge case - the only path.
 *
 * Nothing could have caught it. There is no test that builds an appointment
 * the way Cliniko really sends one and asks what the client would be told.
 * That is this file.
 *
 * THE RULE IT ENFORCES
 *
 * A default may never state a fact about someone's booking. Where the data is
 * absent the email says less; it does not guess. Any future `?? <number>` in
 * that mapping fails here.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { needsTypeStripping } from './lib/needs-type-stripping.mjs';
needsTypeStripping('booking-mapping');

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const fails = [];

const { durationOf, isConsultAppointment } = await import('../lib/booking-shape.ts');
/* The one id the mapping needs, read from lib/site.ts as text so this gate
   stays free of the app's module graph. */
const CONSULT = readFileSync(`${ROOT}lib/site.ts`, 'utf8')
  .match(/export const CONSULT_TYPE = '(\d+)'/)?.[1];
if (!CONSULT) {
  console.log('\n  FAIL  CONSULT_TYPE is no longer exported from lib/site.ts\n');
  process.exit(1);
}

/* Appointments shaped the way Cliniko actually returns them: no
   duration_in_minutes, ends_at present, appointment_type as a link. */
const appt = (typeId, startISO, endISO) => ({
  id: '1',
  starts_at: startISO,
  ends_at: endISO,
  appointment_type: { links: { self: `https://api.ca1.cliniko.com/v1/appointment_types/${typeId}` } },
});

const CASES = [
  {
    name: 'the real incident: 15-minute consult, as Cliniko sends it',
    ap: appt(CONSULT, '2026-09-02T17:00:00Z', '2026-09-02T17:15:00Z'),
    minutes: 15, consult: true,
  },
  {
    name: '50-minute paid session is not a consult',
    ap: appt('1466854657459489533', '2026-09-02T17:00:00Z', '2026-09-02T17:50:00Z'),
    minutes: 50, consult: false,
  },
  {
    name: '90-minute EMDR intensive keeps its real length',
    ap: appt('2013356655093221554', '2026-09-02T17:00:00Z', '2026-09-02T18:30:00Z'),
    minutes: 90, consult: false,
  },
  {
    name: 'no ends_at and no duration -> null, never a guessed number',
    ap: { starts_at: '2026-09-02T17:00:00Z', ends_at: null,
          appointment_type: { links: { self: `x/appointment_types/${CONSULT}` } } },
    minutes: null, consult: true,
  },
  {
    name: 'a short paid session is still not the consultation',
    ap: appt('1466854657459489533', '2026-09-02T17:00:00Z', '2026-09-02T17:15:00Z'),
    minutes: 15, consult: false,
  },
  {
    name: 'a long booking of the consult type is still the consultation',
    ap: appt(CONSULT, '2026-09-02T17:00:00Z', '2026-09-02T18:00:00Z'),
    minutes: 60, consult: true,
  },
  {
    name: 'missing appointment_type is not assumed to be a consult',
    ap: { starts_at: '2026-09-02T17:00:00Z', ends_at: '2026-09-02T17:15:00Z' },
    minutes: 15, consult: false,
  },
  {
    name: 'duration_in_minutes is honoured if Cliniko ever starts sending it',
    ap: { starts_at: '2026-09-02T17:00:00Z', duration_in_minutes: 15,
          appointment_type: { links: { self: `x/appointment_types/${CONSULT}` } } },
    minutes: 15, consult: true,
  },
];

for (const c of CASES) {
  const m = durationOf(c.ap);
  const k = isConsultAppointment(c.ap, CONSULT);
  if (m !== c.minutes) fails.push(`${c.name}\n          duration: got ${m}, want ${c.minutes}`);
  if (k !== c.consult) fails.push(`${c.name}\n          isConsult: got ${k}, want ${c.consult}`);
}

/* The email must not be able to print a length it does not have. */
const mail = readFileSync(`${ROOT}lib/booking-mail.ts`, 'utf8');
if (/\$\{b\.minutes\}\s*minutes/.test(mail)) {
  fails.push('lib/booking-mail.ts interpolates b.minutes directly - a null prints as "null minutes"');
}

/* And the mapping must not reintroduce a default. */
const notify = readFileSync(`${ROOT}lib/booking-notify.ts`, 'utf8');
const mapping = notify.slice(notify.indexOf('const booking: Booking'), notify.indexOf('if (needsConfirm)'));
if (/\?\?\s*\d/.test(mapping)) {
  fails.push('lib/booking-notify.ts the Booking mapping contains a numeric ?? default - that is the original bug');
}

/* ---------------------------------------------------------------------------
 * NOBODY MAY DEFAULT duration_in_minutes, ANYWHERE.
 *
 * The field is not returned by GET /v1/appointments. Three separate places
 * defaulted it to 50 and each produced a different wrong answer:
 *
 *   booking-notify.ts   confirmations said "50 minutes" for a 15-minute
 *                       consult, under the wrong subject line
 *   booking-notify.ts   the no-show window sat 35 minutes late
 *   funnel-report.ts    `50 <= 20` is false, so consultations reported 0
 *                       every month and every free consult was counted as a
 *                       paid session. The owner spotted it in the August 2026
 *                       report: 0 consultations, 12 paid.
 *
 * Two were found only because someone read the output and did not believe it.
 * The check below is cheap and would have caught all three.
 * ------------------------------------------------------------------------- */
const SRC = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', '.git'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) SRC.push(full);
  }
})(join(ROOT, 'lib'));
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', '.git'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) SRC.push(full);
  }
})(join(ROOT, 'app'));

for (const f of SRC) {
  /* Comments STRIPPED before scanning, not skipped by line prefix.
     The first version tested line.startsWith('*'), which misses indented code
     samples inside a block comment — and the notes explaining this very bug
     quote `duration_in_minutes ?? 50` in three files. It reported those as
     defects. A guard that flags the comment describing the fix is a guard
     nobody keeps. */
  const src = readFileSync(f, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  if (/duration_in_minutes\s*\?\?/.test(src)) {
    fails.push(`${relative(ROOT, f)} defaults duration_in_minutes — the field is never returned, so the default is the only value it ever has`);
  }
}

if (fails.length) {
  console.log('\nBOOKING MAPPING - failed\n');
  for (const f of fails) console.log('  FAIL  ' + f);
  console.log('\n  A confirmation must describe the booking that was actually made.\n');
  process.exit(1);
}

console.log(`\nBooking mapping - ${CASES.length} cases pass.`);
console.log('  duration derived from the appointment, consult decided by its type.\n');
