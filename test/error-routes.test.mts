import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { practitioners } from '../lib/practitioners.ts';
import { bookingsUrlFor, site } from '../lib/site.ts';
import { ERROR_CONSULT_COUNSELLORS, errorConsultLinks, ERROR_EMAIL, LOWERCASE_RETRY } from '../lib/error-routes.ts';

/* wf/services-cards, 2 Oct 2026, item 399: the error and 404 pages. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');

test('the error pages’ counsellors are exactly the roster’s accepting, bookable ones', () => {
  const want = practitioners
    .filter((p) => p.acceptingNewClients && p.bookable && p.clinikoPractitionerId)
    .map((p) => ({ first: p.name.split(' ')[0], clinikoPractitionerId: p.clinikoPractitionerId! }));
  assert.deepEqual([...ERROR_CONSULT_COUNSELLORS], want, 'lib/error-routes.ts has drifted from the roster');
  assert.ok(!ERROR_CONSULT_COUNSELLORS.some((c) => c.first === 'Aman'), 'the founder is not accepting');
});

test('each link goes straight to Cliniko’s consult calendar for her, and names her', () => {
  const links = errorConsultLinks();
  assert.equal(links.length, ERROR_CONSULT_COUNSELLORS.length);
  for (const [i, l] of links.entries()) {
    const c = ERROR_CONSULT_COUNSELLORS[i];
    assert.equal(l.href, bookingsUrlFor(c.clinikoPractitionerId));
    assert.match(l.href, /^https:\/\//, 'off this site, so it works when this site does not');
    assert.ok(l.href.includes(`practitioner_id=${c.clinikoPractitionerId}`));
    assert.equal(l.label, `Book a free consultation with ${c.first}`);
  }
  assert.equal(ERROR_EMAIL, site.email);
});

test('error.tsx and global-error.tsx: crisis lines first, no /book, Cliniko links and the email', () => {
  for (const f of ['app/error.tsx', 'app/global-error.tsx']) {
    const s = src(f);
    assert.match(s, /^'use client';/);
    assert.doesNotMatch(s, /lib\/practitioners/, `${f} must not ship the roster`);
    assert.doesNotMatch(s, /href="\/book"/, `${f} links the page most likely to have crashed`);
    assert.match(s, /errorConsultLinks\(\)\.map/);
    assert.match(s, /mailto:\$\{ERROR_EMAIL\}/);
    assert.ok(s.indexOf('tel:988') < s.indexOf('errorConsultLinks().map'), `${f}: the crisis line comes first`);
    assert.doesNotMatch(s.replace(/\/\*[\s\S]*?\*\//g, ''), /\b(evening|weekend)s?\b|\b\d{1,2}\s?(am|pm)\b/i, `${f}: no hours`);
  }
});

/* The retry, run against a fake location. */
const run = (pathname: string, search = '', hash = '') => {
  let replaced: string | undefined;
  const location = { pathname, search, hash, replace: (u: string) => { replaced = u; } };
  new Function('location', LOWERCASE_RETRY)(location);
  return replaced;
};

test('a 404 with capitals tries the lowercase path once, keeping the query and hash', () => {
  assert.equal(run('/Book'), '/book');
  assert.equal(run('/Services/EMDR-Therapy', '?a=B', '#Calendar'), '/services/emdr-therapy?a=B#Calendar');
  assert.equal(run('/book'), undefined, 'lowercase already: nothing, so a second 404 cannot loop');
  assert.equal(run('/this-page-does-not-exist'), undefined);
  assert.match(src('app/not-found.tsx'), /<script dangerouslySetInnerHTML=\{\{ __html: LOWERCASE_RETRY \}\} \/>/);
});

test('smoke checks /Book and /book', () => {
  const smoke = src('scripts/smoke.mjs');
  assert.match(smoke, /\['\/Book', 404\]/);
  assert.match(smoke, /\['\/book', 200\]/);
});
