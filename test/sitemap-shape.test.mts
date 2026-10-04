import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partOf, clusterAlternates, renderIndex, renderUrlset, newest, SITEMAP_PARTS } from '../lib/sitemap-shape.ts';
import { tagalogGuides } from '../lib/tagalog-guides.ts';
import { urlLastmod, URL_DATES } from '../lib/url-dates.ts';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { indexLocs } from '../scripts/lib/built-sitemap.mjs';

const O = 'https://www.westpeakwellness.com';

test('every URL lands in the child for the template that renders it', () => {
  const cases: [string, string][] = [
    ['', 'core'],
    ['/about', 'core'],
    ['/services/emdr-therapy', 'core'],
    ['/practitioners/camille-granda', 'core'],
    ['/for/employers-and-hr/one-pager', 'core'],
    ['/guides/stress-leave-bc', 'guides'],
    ['/resources/verify-a-counsellor', 'guides'],
    ['/compare/rcc-vs-psychologist', 'guides'],
    ['/for/couples', 'guides'],
    ['/online-counselling/kamloops', 'city-hubs'],
    ['/online-counselling/kamloops/anxiety-counselling', 'city-services'],
    ['/practitioners/camille-granda/surrey', 'places'],
    ['/practitioners/savneet-singh/surrey/pa', 'languages'],
    ['/practitioners/camille-granda/tl', 'languages'],
    ['/punjabi', 'languages'],
    ['/punjabi/guides/panic-attack-ki-hai', 'languages'],
    ['/tagalog/gabay/ano-ang-panic-attack', 'languages'],
    ['/punjabi-counselling', 'communities'],
    ['/punjabi-counselling/surrey', 'communities'],
    ['/tagalog-counselling/surrey', 'communities'],
  ];
  for (const [path, part] of cases) assert.equal(partOf(path), part, path);
  assert.equal(new Set(SITEMAP_PARTS).size, SITEMAP_PARTS.length);
});

test('a cluster holds every translation of an English page, and a contested twin is refused', () => {
  const listed = new Set(['/a', '/a/pa', '/a/tl', '/b', '/b/tl', '/c']);
  const langOf = (p: string) => (p.endsWith('/pa') ? 'pa' : 'tl');
  const { alternates, conflicts } = clusterAlternates(
    [['/a', '/a/pa'], ['/a', '/a/tl'], ['/b', '/a/tl'], ['/b', '/b/tl'], ['/c', '/not-listed']],
    listed, O, langOf,
  );
  assert.deepEqual(alternates.get('/a')!.map((x) => x.lang), ['en-CA', 'pa', 'tl', 'x-default']);
  assert.equal(alternates.get('/a/pa'), alternates.get('/a'));
  assert.deepEqual(conflicts, [`/a/tl is paired with both /a and /b`]);
  assert.equal(alternates.has('/c'), false, 'a twin not in the sitemap is not stated');
  const second = clusterAlternates([['/a', '/a/tl'], ['/a', '/b/tl']], listed, O, langOf);
  assert.deepEqual(second.conflicts, ['/a has two tl pages: /a/tl and /b/tl']);
});

test('no English guide is claimed by two Tagalog guides', () => {
  const hrefs = tagalogGuides.map((g) => g.englishHref).filter(Boolean);
  assert.equal(new Set(hrefs).size, hrefs.length, hrefs.join(', '));
});

test('the index lists each child with its newest date, and the gates can read it back', () => {
  const xml = renderIndex([
    { loc: `${O}/sitemaps/core.xml`, lastmod: '2026-10-01T00:00:00.000Z' },
    { loc: `${O}/sitemaps/guides.xml`, lastmod: null },
  ]);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.deepEqual(indexLocs(xml), [`${O}/sitemaps/core.xml`, `${O}/sitemaps/guides.xml`]);
  assert.equal((xml.match(/<lastmod>/g) || []).length, 1, 'no date is invented for a child without one');
  assert.equal(newest([
    { path: '/a', lastmod: '2026-09-01T00:00:00.000Z', changefreq: 'monthly', priority: 1 },
    { path: '/b', lastmod: null, changefreq: 'monthly', priority: 1 },
    { path: '/c', lastmod: '2026-10-02T00:00:00.000Z', changefreq: 'monthly', priority: 1 },
  ]), '2026-10-02T00:00:00.000Z');
});

test('a child keeps its hreflang and image rows', () => {
  const alts = new Map([['/a', [{ lang: 'en-CA', href: `${O}/a` }, { lang: 'x-default', href: `${O}/a` }]]]);
  const xml = renderUrlset(
    [{ path: '/a', lastmod: null, changefreq: 'monthly', priority: 0.7, figure: 'f' }],
    O, alts, () => ({ loc: `${O}/img/f.svg`, title: 'T & U', caption: 'C' }),
  );
  assert.match(xml, /<xhtml:link rel="alternate" hreflang="en-CA" href="https:\/\/www\.westpeakwellness\.com\/a"\/>/);
  assert.match(xml, /<image:title>T &amp; U<\/image:title>/);
  assert.doesNotMatch(xml, /<lastmod>/);
});

test('a page’s own date wins over its collection’s, and an unhashed page keeps the collection’s', () => {
  const [path, day] = Object.entries(URL_DATES)[0] ?? ['/', undefined];
  if (day) assert.equal(urlLastmod(path, '2000-01-01T00:00:00.000Z'), `${day}T00:00:00.000Z`);
  assert.equal(urlLastmod('/never-hashed', '2026-09-06T00:00:00.000Z'), '2026-09-06T00:00:00.000Z');
  assert.equal(urlLastmod('/never-hashed', null), null);
});
