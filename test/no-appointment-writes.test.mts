/* THE SITE NEVER CREATES, CHANGES OR DELETES A CLINIKO APPOINTMENT, BOOKING OR
 * INVOICE — 3 Oct 2026.
 *
 * /book embeds Cliniko's own hosted booking page, which takes the card. The
 * only Cliniko write in this codebase is the reminder-preference PATCH on a
 * PATIENT in lib/cliniko.ts. So a paid appointment with no payment (the owner
 * found one on 3 Oct) cannot have come from this site, and this test keeps it
 * that way by construction: any fetch() in app/, lib/, components/ or
 * scripts/ that sends POST, PUT, PATCH or DELETE (or a method it cannot read)
 * to an appointments, individual_appointments, group_appointments, bookings,
 * invoices or invoice_items endpoint fails the suite. The URL is read from the
 * call itself and, when it is a variable, from that variable's definitions.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIRS = ['app', 'lib', 'components', 'scripts'];
const ENDPOINT = /\b(individual_appointments|group_appointments|appointments|bookings|invoices|invoice_items)\b/;
const WRITE = /\bmethod\s*:\s*(?:(['"`])(POST|PUT|PATCH|DELETE)\1|(?!['"`]GET['"`])([A-Za-z_$][\w$.]*))/i;
const OTHER_CLIENTS = /\b(axios|XMLHttpRequest|sendBeacon)\b|\.(post|put|patch|delete)\s*\(/;

/** The one write allowed: reminder preferences on a patient. */
const ALLOWED = [{ file: 'lib/cliniko.ts', method: 'PATCH', target: /\/patients\// }];

type Hit = { file: string; line: number; method: string; target: string };

function files(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if (/\.(ts|tsx|js|mjs|cjs)$/.test(name)) out.push(p);
  }
  return out;
}

/** The text of a call starting at `open` (the index of its "("). */
function callSpan(src: string, open: number): string {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '(') depth++;
    else if (c === ')' && --depth === 0) return src.slice(open, i + 1);
  }
  return src.slice(open);
}

/** Non-GET fetches whose target names one of the forbidden endpoints. */
export function writesIn(file: string, src: string): Hit[] {
  const hits: Hit[] = [];
  for (const m of src.matchAll(/\bfetch\s*\(/g)) {
    const span = callSpan(src, m.index! + m[0].length - 1);
    const w = span.match(WRITE);
    if (!w) continue;
    const method = (w[2] ?? `dynamic (${w[3]})`).toUpperCase();
    /* The URL: the call's text, plus the definitions of a variable passed as
       its first argument. */
    const arg = span.slice(1).trim().match(/^([A-Za-z_$][\w$]*)\s*[,)]/)?.[1];
    let target = span;
    if (arg) {
      for (const d of src.matchAll(new RegExp(`\\b(?:const|let|var)\\s+${arg}\\b[^;]*;|\\b${arg}\\s*=[^=][^;]*;`, 'g'))) target += '\n' + d[0];
    }
    if (!ENDPOINT.test(target)) continue;
    hits.push({ file, line: src.slice(0, m.index).split('\n').length, method, target: target.split('\n')[0].slice(0, 120) });
  }
  /* Any other client aimed at Cliniko's write endpoints. */
  src.split('\n').forEach((l, i) => {
    if (OTHER_CLIENTS.test(l) && /cliniko/i.test(l) && ENDPOINT.test(l)) hits.push({ file, line: i + 1, method: 'other client', target: l.trim().slice(0, 120) });
  });
  return hits;
}

const allowed = (h: Hit) => ALLOWED.some((a) => a.file === h.file && a.method === h.method && a.target.test(h.target));

test('no code sends a write to a Cliniko appointment, booking or invoice endpoint', () => {
  const all: Hit[] = [];
  for (const d of DIRS) {
    for (const f of files(join(ROOT, d))) {
      all.push(...writesIn(relative(ROOT, f).replace(/\\/g, '/'), readFileSync(f, 'utf8')));
    }
  }
  const bad = all.filter((h) => !allowed(h));
  assert.deepEqual(bad, [], `forbidden writes:\n${bad.map((h) => `  ${h.file}:${h.line} ${h.method} ${h.target}`).join('\n')}`);
});

test('the one allowed write is still the patient PATCH, and nothing else in lib/cliniko.ts', () => {
  const src = readFileSync(join(ROOT, 'lib/cliniko.ts'), 'utf8');
  const methods = [...src.matchAll(/\bmethod\s*:\s*['"`](\w+)['"`]/g)].map((m) => m[1].toUpperCase());
  assert.deepEqual(methods, ['PATCH']);
  assert.match(src, /fetch\(`https:\/\/api\.\$\{a\.shard\}\.cliniko\.com\/v1\/patients\/\$\{found\.patientId\}`, \{\s*method: 'PATCH'/);
});

test('the scanner catches the shapes it is meant to, and passes a mail POST', () => {
  const f = 'x.ts';
  assert.equal(writesIn(f, "await fetch(`${base}/appointments`, { method: 'POST', body })").length, 1);
  assert.equal(writesIn(f, "const url = `${base}/individual_appointments/${id}`;\nawait fetch(url, { headers, method: 'PATCH' });").length, 1);
  assert.equal(writesIn(f, "await fetch(`https://api.ca1.cliniko.com/v1/invoices/${id}`, { method: \"DELETE\" })").length, 1);
  assert.equal(writesIn(f, "await fetch(`${base}/bookings`, { method: verb })").length, 1);
  assert.equal(writesIn(f, "axios.post(`https://api.ca1.cliniko.com/v1/appointments`, body)").length, 1);
  assert.equal(writesIn(f, "await fetch('https://api.resend.com/emails', { method: 'POST' })").length, 0);
  assert.equal(writesIn(f, "await fetch(`${base}/appointments?per_page=100`, { headers: headers(key), cache: 'no-store' })").length, 0);
  assert.equal(writesIn(f, "await fetch(`${base}/invoices`, { method: 'GET' })").length, 0);
});
