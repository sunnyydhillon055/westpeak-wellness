import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { usableSnapshotKeys, latestAfters, ledgerMismatches, buildIsStale, ledgerChanged, decodeEntities, fieldOf } from '../scripts/lib/snippet-ledger.mjs';

/* Item 567, 16 Oct 2026: the snapshot guard and the one ledger. */

test('pre-deploy snapshots and the non-date keys are never a baseline', () => {
  const store = {
    '2026-10-04': {}, 'title-changes': [], '2026-10-14': {}, '2026-10-15': {}, '2026-10-16': {},
    'snapshot-notes': { '2026-10-14': 'pre-deploy: stale build', '2026-10-15': 'pre-deploy: stale build' },
  };
  assert.deepEqual(usableSnapshotKeys(store), ['2026-10-04', '2026-10-16']);
});

test('the latest after wins, by date and then by order; desc rows are their own field', () => {
  const ledger = [
    { date: '2026-10-13', path: '/a', after: 'Second' },
    { date: '2026-10-03', path: '/a', after: 'First' },
    { date: '2026-10-13', path: '/a', after: 'Third' },
    { date: '2026-10-14', path: '/a', field: 'desc', after: 'A description' },
  ];
  assert.equal(latestAfters(ledger).get('/a'), 'Third');
  assert.equal(latestAfters(ledger, 'desc').get('/a'), 'A description');
  assert.equal(fieldOf({}), 'title');
});

test('a built title that disagrees with the ledger is refused; entities are not a difference', () => {
  const ledger = [{ date: '2026-10-13', path: '/o', after: 'Online Counselling &amp; Therapy' }, { date: '2026-10-13', path: '/gone', after: 'X' }];
  assert.deepEqual(ledgerMismatches({ '/o': { title: 'Online Counselling & Therapy', desc: '' } }, ledger).map((m: { path: string }) => m.path), ['/gone']);
  assert.equal(ledgerMismatches({ '/o': { title: 'Old title', desc: '' }, '/gone': { title: 'X', desc: '' } }, ledger).length, 1);
  assert.equal(decodeEntities('A &#x27;b&#x27; &quot;c&quot;'), 'A \'b\' "c"');
});

test('a build older than HEAD is stale; a ledger change inside the window counts as a rewrite', () => {
  assert.equal(buildIsStale(1000, 2000), true);
  assert.equal(buildIsStale(3000, 2000), false);
  assert.equal(buildIsStale(3000, Number.NaN), false);
  const ledger = [{ date: '2026-10-13', path: '/a' }];
  assert.equal(ledgerChanged(ledger, '/a', '2026-10-04', '2026-10-20'), true);
  assert.equal(ledgerChanged(ledger, '/a', '2026-10-13', '2026-10-20'), false);
});

test('the real ledger: every row has a field, and the stale snapshots are noted pre-deploy', () => {
  const store = JSON.parse(readFileSync('data/gsc/snippets.json', 'utf8'));
  for (const r of store['title-changes']) {
    assert.ok(r.field === 'title' || r.field === 'desc', `${r.path} ${r.date}`);
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(typeof r.after === 'string' && r.after.length > 0, r.path);
  }
  for (const k of ['2026-10-14', '2026-10-15']) assert.match(store['snapshot-notes'][k], /^pre-deploy/);
  assert.ok(!usableSnapshotKeys(store).includes('2026-10-15'));
  for (const p of ['/about', '/answers', '/for/trades-and-construction-workers', '/practitioners/camille-granda']) {
    assert.ok(store['title-changes'].some((r: { path: string; date: string; field: string }) => r.path === p && r.date === '2026-10-15' && r.field === 'title'), p);
  }
});
