import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { mainText, hashText, nextTable, formatTable, renderUrlDates, pacificDay } from '../scripts/lib/page-hash.mjs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { listedDays } from '../scripts/page-hash-dates.mjs';

const page = (body: string) =>
  `<html><head><title>x</title></head><body><header>nav</header><main><h1>Anxiety counselling</h1>${body}</main><footer>f</footer></body></html>`;

test('only the visible text of <main> is hashed', () => {
  const a = page('<p class="hero-note">Updated <!-- -->October 3, 2026</p><p>Fees are $140.</p>');
  assert.equal(mainText(a), 'Anxiety counselling Updated Fees are $140');
  assert.equal(mainText('<html><body>no main</body></html>'), null);
});

test('a re-dated page does not change its own hash, or the next build would re-date it again', () => {
  const before = page('<p class="hero-note">Updated <!-- -->September 17, 2026</p><p>Same words.</p>');
  const after = page('<p class="hero-note">Updated <!-- -->October 3, 2026</p><p>Same words.</p>');
  assert.equal(hashText(mainText(before)), hashText(mainText(after)));
  assert.equal(mainText(page('<p>Reviewed 3 October 2026 and 2026-10-03.</p>')), 'Anxiety counselling Reviewed and');
});

test('the Cliniko next-consultation line and appointment times are not content', () => {
  const a = page('<p class="next-consult"><strong>Next free 15-minute consultation (Pacific time):</strong> Camille, Tue Oct 7, 10:00 am <a href="/book">book with Camille</a></p><p>Body.</p><td>Thu Oct 9, 2:30 pm (3 times)</td>');
  const b = page('<p class="next-consult">No one has a time in the next two weeks. <a href="/book">Ask for a time</a></p><p>Body.</p><td>tomorrow 9:00 am</td>');
  assert.equal(hashText(mainText(a)), hashText(mainText(b)));
});

test('a real edit changes the hash', () => {
  assert.notEqual(hashText(mainText(page('<p>EMDR is one option.</p>'))), hashText(mainText(page('<p>EMDR is first-line.</p>'))));
});

test('only a page whose hash moved takes today; a new page takes the date it already had, or none', () => {
  const prev = {
    '/a': { hash: 'h1', date: '2026-09-17' },
    '/b': { hash: 'h2', date: '2026-09-17' },
    '/gone': { hash: 'h9', date: '2026-08-01' },
  };
  const hashes = new Map([['/a', 'h1'], ['/b', 'CHANGED'], ['/new', 'h3'], ['/undated', 'h4']]);
  const r = nextTable(prev, hashes, { today: '2026-10-03', seed: new Map([['/new', '2026-10-01'], ['/a', '2026-10-03']]) });
  assert.deepEqual(r.table['/a'], { hash: 'h1', date: '2026-09-17' }, 'a collection date moving does not move the page');
  assert.deepEqual(r.table['/b'], { hash: 'CHANGED', date: '2026-10-03' });
  assert.deepEqual(r.table['/new'], { hash: 'h3', date: '2026-10-01' });
  assert.deepEqual(r.table['/undated'], { hash: 'h4', date: null }, 'no date is invented');
  assert.deepEqual(r.changed, ['/b']);
  assert.deepEqual(r.removed, ['/gone']);
  assert.equal('/gone' in r.table, false);
});

test('the record is one URL per line, and the generated module skips undated pages', () => {
  const table = { '/b': { hash: 'h2', date: '2026-10-03' }, '/a': { hash: 'h1', date: null } };
  const json = formatTable(table);
  assert.deepEqual(JSON.parse(json), table);
  assert.equal(json.split('\n').length, 5);
  const ts = renderUrlDates(table);
  assert.match(ts, /"\/b": "2026-10-03",/);
  assert.doesNotMatch(ts, /"\/a"/);
  assert.match(ts, /export function urlLastmod/);
});

test('today is the Pacific day, not the UTC one', () => {
  /* 05:30 UTC on 3 Nov 2026 is 21:30 or 22:30 on 2 Nov in BC, depending on
     whether the runtime has BC on UTC-8 or the permanent UTC-7, and either
     way an hour and a half or more from midnight. */
  assert.equal(pacificDay(new Date('2026-11-03T05:30:00Z')), '2026-11-02');
  assert.equal(pacificDay(new Date('2026-07-15T18:00:00Z')), '2026-07-15');
});

test('the sitemap rows give each path its lastmod day', () => {
  const xml = `<urlset><url><loc>https://x.test</loc><lastmod>2026-10-01T00:00:00.000Z</lastmod></url><url><loc>https://x.test/a?b=1&amp;c=2</loc></url></urlset>`;
  const days = listedDays(xml);
  assert.equal(days.get('/'), '2026-10-01');
  assert.equal(days.get('/a'), null);
});
