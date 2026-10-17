import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { site, CONSULT_TYPE, CLINIKO_BUSINESS, bookingsUrlFor } from '../lib/site.ts';
import * as client from '../lib/site-client.ts';
import { opensCalendar, CHOOSE_HASH, CALENDAR_HASH } from '../lib/scheduler-open.ts';
import * as fetchMod from '../lib/availability-fetch.ts';
import * as slot from '../lib/consult-slot.ts';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { rosterNumbers } from '../scripts/roster-numbers.mjs';

/* THE SHARED CHROME, 16 Oct 2026 (items 599, 551, 575, 584, 597). */

const ROOT = process.cwd();
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');

function walk(d: string, out: string[] = []): string[] {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e)) out.push(p);
  }
  return out;
}

const resolveSpec = (from: string, spec: string): string | null => {
  const base = spec.startsWith('@/') ? join(ROOT, spec.slice(2)) : spec.startsWith('.') ? resolve(dirname(from), spec) : null;
  if (!base) return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (existsSync(c) && statSync(c).isFile()) return c;
  }
  return null;
};
const depsOf = (f: string) =>
  [...readFileSync(f, 'utf8').matchAll(/^\s*(?:import|export)\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)]
    .map((m) => resolveSpec(f, m[1]!))
    .filter((x): x is string => Boolean(x));

test('no client component reaches lib/site.ts, directly or through another module (item 599)', () => {
  const target = join(ROOT, 'lib', 'site.ts');
  const files = ['app', 'components', 'lib', 'pages'].flatMap((d) => walk(join(ROOT, d)));
  const bad: string[] = [];
  for (const f of files) {
    if (!/^['"]use client['"]/.test(readFileSync(f, 'utf8').trimStart()) && !f.includes(join('pages', 'embed'))) continue;
    const seen = new Set([f]);
    const q = [f];
    while (q.length) for (const d of depsOf(q.shift()!)) if (!seen.has(d)) { seen.add(d); q.push(d); }
    if (seen.has(target)) bad.push(relative(ROOT, f));
  }
  assert.deepEqual(bad, [], 'import lib/site-client instead: lib/site.ts is the server copy');
});

test('no registration number in either copy of the practice constants', () => {
  const numbers: string[] = rosterNumbers(src('lib/practitioners.ts')).map((e: { number: string }) => e.number);
  assert.ok(numbers.length > 0, 'read the roster numbers');
  for (const f of ['lib/site-client.ts', 'lib/site.ts']) {
    assert.doesNotMatch(src(f), /registration:/, f);
    for (const n of numbers) assert.ok(!src(f).includes(n), `${f} carries ${n}`);
  }
});

test('the server copy is built from the browser copy, so the two cannot differ', () => {
  const s = site as unknown as Record<string, unknown>;
  const c = client.site as unknown as Record<string, unknown>;
  for (const k of Object.keys(c)) if (k !== 'counsellor') assert.equal(s[k], c[k], k);
  assert.equal(site.counsellor.registerUrl, client.site.counsellor.registerUrl);
  assert.equal(CONSULT_TYPE, client.CONSULT_TYPE);
  assert.equal(CLINIKO_BUSINESS, client.CLINIKO_BUSINESS);
  assert.equal(site.bookingsUrl, client.site.bookingsFallbackUrl);
  assert.equal(bookingsUrlFor(), site.bookingsUrl);
  assert.equal(bookingsUrlFor('42'), `${site.bookingsUrl}&practitioner_id=42`);
  /* The two gate scripts read the consult id as text. */
  assert.match(src('lib/site-client.ts'), /export const CONSULT_TYPE = '(\d+)'/);
  assert.match(src('scripts/booking-mapping.mjs'), /lib\/site-client\.ts/);
  assert.match(src('scripts/booking-audit.mjs'), /lib\/site-client\.ts/);
});

test('the sticky bar takes the availability fetch from a module that imports nothing (item 599)', () => {
  assert.doesNotMatch(src('lib/availability-fetch.ts'), /^\s*import\s/m);
  assert.match(src('components/StickyBook.tsx'), /from '@\/lib\/availability-fetch'/);
  assert.doesNotMatch(src('components/StickyBook.tsx'), /lib\/consult-slot'/);
  /* One module, one promise: the slots and the bar share it. */
  assert.equal(slot.loadAvailability, fetchMod.loadAvailability);
  assert.equal(slot.resetAvailabilityForTests, fetchMod.resetAvailabilityForTests);
});

test('the consent banner is fetched only when a choice is needed, and stands on the bar (item 551)', () => {
  const gate = src('components/ConsentGate.tsx');
  assert.match(gate, /import\('@\/components\/ConsentBanner'\)/);
  assert.doesNotMatch(gate, /^import [^\n]*ConsentBanner/m, 'a static import would put the markup back in the layout chunk');
  assert.doesNotMatch(gate, /role="region"/);
  const banner = src('components/ConsentBanner.tsx');
  assert.match(banner, /No thanks/);
  assert.match(banner, /That&rsquo;s fine/);
  assert.match(banner, /href="\/privacy"/);
  const css = src('app/globals.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const narrow = css.slice(css.indexOf('.consent-banner{'));
  assert.match(narrow, /@media \(max-width:1020px\)\{\s*\.consent-banner\{bottom:var\(--sticky-h, 0px\)/);
  assert.match(narrow, /html\[data-scheduler-open\] \.consent-banner, html\[data-typing\] \.consent-banner\{display:none\}/);
  assert.match(src('components/StickyBook.tsx'), /setProperty\('--sticky-h'/);
});

test('?with= links do not prefetch the same /book payload again; bare /book still does (item 575)', () => {
  const book = src('components/BookLink.tsx');
  assert.match(book, /prefetch=\{to\.includes\('\?'\) \? false : undefined\}/);
  assert.match(src('components/StickyBook.tsx'), /\?with=\$\{encodeURIComponent\(slug\)\}#calendar`\}\r?\n\s*prefetch=\{false\}/);
  assert.match(src('components/StickyBook.tsx'), /prefetch=\{bookHref === site\.bookingPath \? undefined : false\}/);
  assert.match(src('components/Header.tsx'), /prefetch=\{bookHref === site\.bookingPath \? undefined : false\}/);
  const choice = src('components/BookChoice.tsx');
  const withLinks = [...choice.matchAll(/<Link[^>]*?href=\{`\$\{site\.bookingPath\}\?with=[\s\S]*?>/g)].map((m) => m[0]);
  assert.ok(withLinks.length >= 2);
  for (const l of withLinks) assert.match(l, /prefetch=\{false\}/, l);
});

test('on bare /book the sticky jump goes to the choice and opens nothing (item 584)', () => {
  assert.equal(opensCalendar(CHOOSE_HASH, '/book'), false);
  assert.equal(opensCalendar(CALENDAR_HASH, '/book'), true);
  assert.match(src('components/BookChoice.tsx'), /<div id="choose" className="book-choose"/);
  const bar = src('components/StickyBook.tsx');
  assert.match(bar, /href=\{CHOOSE_HASH\}/);
  assert.match(bar, /location: 'sticky-book-jump'/);
  assert.match(bar, /getElementById\(CHOOSE_HASH\.slice\(1\)\) \? CHOOSE_HASH : CALENDAR_HASH/);
});

test('images: a day of browser cache for /img, thirty days for /_next/image, and a hero sized to its float (item 597)', () => {
  const conf = src('next.config.mjs');
  assert.match(conf, /source: '\/img\/:path\*',\s*headers: \[\{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' \}\]/);
  assert.match(conf, /minimumCacheTTL: 2592000/);
  assert.match(conf, /imageSizes: \[16, 32, 48, 64, 96, 128, 256, 384, 480\]/);
  assert.match(src('app/page.tsx'), /sizes="\(max-width: 620px\) 42vw, \(max-width: 900px\) min\(40vw, 300px\), min\(44vw, 420px\)"/);
});
