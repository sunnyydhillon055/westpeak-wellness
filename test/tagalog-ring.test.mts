import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TAGALOG_CITIES, TAGALOG_RING_ORDER, tagalogSiblings } from '../lib/tagalog.ts';
import { punjabiRegions, getPunjabiRegion } from '../lib/punjabi-regions.ts';

/* 15 Oct 2026 (wf/city9500). The Tagalog city pages were linked from <main>
   by two or three pages each; every one now names three others, walked from
   TAGALOG_RING_ORDER. The ring only works if the order is the whole list. */

test('the ring order names every Tagalog city exactly once', () => {
  assert.equal(new Set(TAGALOG_RING_ORDER).size, TAGALOG_RING_ORDER.length, 'a city twice');
  assert.deepEqual([...TAGALOG_RING_ORDER].sort(), TAGALOG_CITIES.map((c) => c.slug).sort());
});

test('every Tagalog city page names three others and is named by three', () => {
  const namedBy = new Map<string, number>();
  for (const c of TAGALOG_CITIES) {
    const s = tagalogSiblings(c.slug);
    assert.equal(s.length, 3, c.slug);
    assert.ok(!s.some((x) => x.slug === c.slug), `${c.slug} names itself`);
    for (const x of s) namedBy.set(x.slug, (namedBy.get(x.slug) ?? 0) + 1);
  }
  for (const c of TAGALOG_CITIES) assert.equal(namedBy.get(c.slug), 3, c.slug);
});

test('every Punjabi region page is named by at least two others, and no row passes six', () => {
  const namedBy = new Map<string, number>();
  for (const r of punjabiRegions) {
    assert.ok((r.nearby ?? []).length <= 5, `${r.slug}: the chip row is five regions and the hub`);
    for (const s of r.nearby ?? []) {
      assert.ok(getPunjabiRegion(s), `${r.slug} names a region with no page: ${s}`);
      namedBy.set(s, (namedBy.get(s) ?? 0) + 1);
    }
  }
  for (const r of punjabiRegions) assert.ok((namedBy.get(r.slug) ?? 0) >= 2, `${r.slug} is named by ${namedBy.get(r.slug) ?? 0}`);
});
