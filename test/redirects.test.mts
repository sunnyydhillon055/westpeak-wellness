import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error -- plain .mjs shared with next.config.mjs; no declaration file
import { REDIRECTS, permanentLiteralSources } from '../lib/redirects.mjs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { findChains, sourceRegExp } from '../scripts/redirect-chains.mjs';

type R = { source: string; destination: string; permanent: boolean };
const list = REDIRECTS as R[];
const dest = (source: string) => list.find((r) => r.source === source)?.destination;

test('the chain check finds a two-hop redirect, including through a parameter', () => {
  const chains = findChains([
    { source: '/jobs', destination: '/careers' },
    { source: '/jobs/:slug', destination: '/careers/:slug' },
    { source: '/careers/:slug', destination: '/about' },
    { source: '/careers', destination: '/about' },
    { source: '/fees', destination: '/pricing' },
  ]);
  assert.deepEqual(chains.map((c: { source: string }) => c.source), ['/jobs', '/jobs/:slug']);
});

test('source patterns match the way Next matches them', () => {
  assert.ok(sourceRegExp('/blog/:slug').test('/blog/a-post'));
  assert.ok(!sourceRegExp('/blog/:slug').test('/blog/a/b'));
  assert.ok(sourceRegExp('/:path(admin|signin)/:rest*').test('/admin/x/y'));
  assert.ok(!sourceRegExp('/fees').test('/fees-x'));
});

test('the live redirect list has no chains', () => {
  assert.deepEqual(findChains(list), []);
});

test('the 1 Oct destinations: trauma to EMDR, careers to /about, the truncated ADHD URL', () => {
  assert.equal(dest('/services/trauma-therapy'), '/services/emdr-therapy');
  assert.equal(dest('/copy-of-individual-1'), '/services/emdr-therapy');
  assert.equal(dest('/copy-of-individual-2'), '/services/individual-therapy');
  for (const s of ['/jobs', '/apply', '/careers/apply', '/careers/rcc', '/careers/registered-clinical-counsellor', '/work-here', '/jobs/:slug']) {
    assert.equal(dest(s), '/about', s);
  }
  assert.equal(dest('/guides/adhd-in-adults-and-what-counselling-do'), '/guides/adhd-in-adults-and-what-counselling-can-do');
  assert.ok(list.every((r) => r.permanent), 'every redirect is permanent now that no retired role can reopen');
});

test('permanent literal sources are what IndexNow is told to recrawl', () => {
  const s = permanentLiteralSources() as string[];
  assert.ok(s.includes('/services/depression-counselling'));
  assert.ok(s.includes('/careers'));
  assert.ok(!s.some((p) => /[:*(]/.test(p)), 'no parameterised source');
  assert.equal(new Set(s).size, s.length);
});
