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

test('the vercel.app alias goes to www, and no preview host or chain check is caught by it', async () => {
  const cfg = (await import('../next.config.mjs')).default as {
    redirects: () => Promise<Array<R & { has?: Array<{ type: string; value: string }> }>>;
  };
  const all = await cfg.redirects();
  const alias = all.find((r) => r.has?.some((h) => h.type === 'host'));
  assert.ok(alias, 'host redirect present');
  assert.equal(alias.destination, 'https://www.westpeakwellness.com/:path');
  const src = sourceRegExp(alias.source);
  assert.ok(src.test('/pricing') && src.test('/') && src.test('/llms.txt'));
  assert.ok(!src.test('/api/cron/booking-mail'), 'cron routes are never redirected');
  assert.equal(alias.permanent, true);
  /* Next anchors `has` values as ^value$. */
  const host = new RegExp(`^${alias.has![0].value}$`);
  assert.ok(host.test('westpeak-wellness.vercel.app'));
  for (const preview of ['westpeak-wellness-git-main-sunny.vercel.app', 'westpeak-wellness-abc123-sunny.vercel.app', 'www.westpeakwellness.com', 'westpeak-wellnessxvercel.app']) {
    assert.ok(!host.test(preview), preview);
  }
  assert.deepEqual(findChains(all), []);
});
