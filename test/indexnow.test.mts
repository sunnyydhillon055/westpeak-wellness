import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUrlset, selectUrls } from '../lib/indexnow.ts';

const O = 'https://www.westpeakwellness.com';
const xml = `<?xml version="1.0"?>
<urlset>
  <url>
    <loc>${O}/</loc>
    <lastmod>2026-10-01T00:00:00.000Z</lastmod>
    <image:image><image:loc>${O}/img/x.png</image:loc></image:image>
  </url>
  <url>
    <loc>${O}/guides/a?x=1&amp;y=2</loc>
    <lastmod>2026-09-02</lastmod>
  </url>
  <url>
    <loc>${O}/no-date</loc>
  </url>
  <url>
    <loc>https://elsewhere.example/</loc>
    <lastmod>2026-10-01</lastmod>
  </url>
</urlset>`;

test('parseUrlset reads page locs and lastmods, not image locs', () => {
  const e = parseUrlset(xml);
  assert.deepEqual(e.map((x) => x.loc), [`${O}/`, `${O}/guides/a?x=1&y=2`, `${O}/no-date`, 'https://elsewhere.example/']);
  assert.equal(e[0].lastmod, '2026-10-01T00:00:00.000Z');
  assert.equal(e[2].lastmod, null);
});

test('with no successful run on record, everything on-host is sent, plus redirect sources', () => {
  const urls = selectUrls(parseUrlset(xml), null, ['/services/depression-counselling'], O);
  assert.deepEqual(urls, [`${O}/`, `${O}/guides/a?x=1&y=2`, `${O}/no-date`, `${O}/services/depression-counselling`]);
});

test('after a successful run, only pages dated that day or later, compared by day', () => {
  /* The last run was at 09:00 on 1 Oct; a page dated 1 Oct with no time must
     still go, or a same-day re-date is lost until it changes again. */
  const urls = selectUrls(parseUrlset(xml), '2026-10-01T09:00:00.000Z', ['/careers'], O);
  assert.deepEqual(urls, [`${O}/`, `${O}/careers`]);
});

test('redirect sources are always sent and never duplicated', () => {
  const urls = selectUrls([], '2026-10-01T00:00:00Z', ['/a', '/a', '/b'], O);
  assert.deepEqual(urls, [`${O}/a`, `${O}/b`]);
});
