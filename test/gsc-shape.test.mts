import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { rowsToCsv, reportWindow, inspectionTargets, inspectionRow, sitemapLocs } from '../scripts/gsc-shape.mjs';

const O = 'https://www.westpeakwellness.com';
const row = (keys: string[], clicks: number, impressions: number) => ({ keys, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: 9.5 });

test('a one-dimension CSV is byte-for-byte the shape ctr-delta.mjs reads', () => {
  const csv = rowsToCsv(['Top pages'], [row([`${O}/a`], 1, 10), row([`${O}/b`], 3, 5)]);
  assert.equal(csv, `Top pages,Clicks,Impressions,CTR,Position\n${O}/b,3,5,60.00%,9.50\n${O}/a,1,10,10.00%,9.50\n`);
});

test('two dimensions get two columns, quoted when needed, and daily rows sort by date', () => {
  const pq = rowsToCsv(['Page', 'Query'], [row([`${O}/a`, 'stress leave, bc'], 0, 4)]);
  assert.equal(pq.split('\n')[1], `${O}/a,"stress leave, bc",0,4,0.00%,9.50`);
  const daily = rowsToCsv(['Date', 'Page'], [row(['2026-10-02', '/x'], 9, 9), row(['2026-09-30', '/x'], 0, 1)]);
  assert.deepEqual(daily.split('\n').slice(1, 3).map((l: string) => l.slice(0, 10)), ['2026-09-30', '2026-10-02']);
});

test('the window ends two days back and spans the requested days', () => {
  assert.deepEqual(reportWindow(new Date('2026-10-05T12:00:00Z'), 28), { startDate: '2026-09-06', endDate: '2026-10-03' });
});

test('inspection takes every money URL, then the silent ones, capped', () => {
  const urls = [`${O}/`, `${O}/book`, `${O}/services/emdr-therapy`, `${O}/practitioners/camille-granda`, `${O}/practitioners/camille-granda/surrey`, `${O}/guides/a`, `${O}/guides/b`];
  const t = inspectionTargets(urls, [`${O}/guides/a`, `${O}/`], O);
  assert.deepEqual(t.filter((x: { why: string }) => x.why === 'money').map((x: { url: string }) => x.url), [`${O}/`, `${O}/book`, `${O}/services/emdr-therapy`, `${O}/practitioners/camille-granda`]);
  assert.deepEqual(t.filter((x: { why: string }) => x.why === 'zero-impressions').map((x: { url: string }) => x.url), [`${O}/practitioners/camille-granda/surrey`, `${O}/guides/b`]);
  assert.equal(inspectionTargets(urls, [], O, 2).length, 2);
});

test('an inspection result keeps the coverage and canonical fields and nothing else', () => {
  const r = inspectionRow({ url: `${O}/x`, why: 'money' }, {
    inspectionResult: { inspectionResultLink: 'https://search.google.com/x', indexStatusResult: { verdict: 'PASS', coverageState: 'Submitted and indexed', googleCanonical: `${O}/x`, userCanonical: `${O}/x`, lastCrawlTime: '2026-09-30T01:02:03Z', referringUrls: ['a'] } },
  });
  assert.deepEqual(r, { url: `${O}/x`, why: 'money', verdict: 'PASS', coverageState: 'Submitted and indexed', indexingState: null, googleCanonical: `${O}/x`, userCanonical: `${O}/x`, lastCrawlTime: '2026-09-30T01:02:03Z' });
});

test('sitemap locs skip image locs', () => {
  const xml = `<urlset><url><loc>${O}/a</loc><image:image><image:loc>${O}/img/x.png</image:loc></image:image></url><url><loc>${O}/b?x=1&amp;y=2</loc></url></urlset>`;
  assert.deepEqual(sitemapLocs(xml), [`${O}/a`, `${O}/b?x=1&y=2`]);
});

test('ctr-delta picks up pages.csv and queries.csv and none of the new files', () => {
  /* The same pattern ctr-delta.mjs builds, read from its source so the two
     cannot drift apart unnoticed. */
  const src = readFileSync('scripts/ctr-delta.mjs', 'utf8');
  assert.match(src, /new RegExp\(`-\$\{kind\}\(-\[\^\.\]\*\)\?\\\.csv\$`\)/);
  const re = (kind: string) => new RegExp(`-${kind}(-[^.]*)?\.csv$`);
  const files = ['2026-10-05-pages.csv', '2026-10-05-queries.csv', '2026-10-05-page-query.csv', '2026-10-05-page-country.csv', '2026-10-05-date-page.csv', '2026-10-05-window.json', '2026-10-05-inspect.json'];
  assert.deepEqual(files.filter((f) => re('pages').test(f)), ['2026-10-05-pages.csv']);
  assert.deepEqual(files.filter((f) => re('queries').test(f)), ['2026-10-05-queries.csv']);
});
