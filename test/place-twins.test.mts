import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PA_PLACES, PA_PLACE_SHARED, PA_EVENING_PROMISES, getPunjabiPlaceForPage, paAccessForPage, siblingRing,
} from '@/lib/practitioner-places-pa';
import { TL_PLACES, TL_PLACE_SHARED } from '@/lib/practitioner-places-tl';

/* The Tagalog and Punjabi place twins, 4 Oct 2026: the evening promises the
   1 Oct change missed are withheld, the sibling ring links every twin, and
   the words the pages now link (fee, fees page, standards page) are still
   in the copy, so a reworded string cannot silently drop a link. */

const EVENING_PROMISE = /ਲੋੜ ਪਵੇ ਤਾਂ ਸ਼ਾਮ|ਸ਼ਾਮ ਦੇ ਸਮੇਂ|ਸਿਰਫ਼ ਸ਼ਾਮ ਨੂੰ/;

test('every withheld evening promise still matches a string in the copy', () => {
  const all = new Set<string>([
    ...PA_PLACE_SHARED.access.map((a) => a.label),
    ...Object.values(PA_PLACES).flatMap((c) => [...c.local, ...c.faqs.map((f) => f.q)]),
  ]);
  for (const s of PA_EVENING_PROMISES) assert.ok(all.has(s), `no longer in the copy, retire it: ${s.slice(0, 40)}`);
});

test('no Punjabi twin shows a line that promises an evening time', () => {
  for (const a of paAccessForPage()) assert.doesNotMatch(a.label + a.detail, EVENING_PROMISE);
  assert.equal(paAccessForPage().length, PA_PLACE_SHARED.access.length - 1);
  for (const slug of Object.keys(PA_PLACES)) {
    const c = getPunjabiPlaceForPage(slug)!;
    for (const x of [...c.local, ...c.faqs.flatMap((f) => [f.q, f.a])]) assert.doesNotMatch(x, EVENING_PROMISE, slug);
    /* Withholding never empties a page: two local paragraphs and two questions at least. */
    assert.ok(c.local.length >= 2 && c.faqs.length >= 2, slug);
  }
});

test('the sibling ring: each twin links, and is linked by, min(n-1, 6) distinct siblings', () => {
  for (const n of [1, 2, 3, 7, 15]) {
    const list = Array.from({ length: n }, (_, i) => ({ slug: `c${i}` }));
    const inbound = new Map<string, number>();
    for (const c of list) {
      const ring = siblingRing(list, c.slug);
      assert.equal(ring.length, Math.min(n - 1, 6), `n=${n}`);
      assert.equal(new Set(ring.map((x) => x.slug)).size, ring.length);
      assert.ok(!ring.some((x) => x.slug === c.slug));
      for (const x of ring) inbound.set(x.slug, (inbound.get(x.slug) ?? 0) + 1);
    }
    for (const c of list) assert.equal(inbound.get(c.slug) ?? 0, Math.min(n - 1, 6), `n=${n} ${c.slug}`);
  }
  assert.deepEqual(siblingRing([{ slug: 'a' }], 'zzz'), []);
});

test('the words the twins link are still in the copy', () => {
  assert.match(TL_PLACE_SHARED.opening('Surrey'), /bayad/);
  assert.match(TL_PLACE_SHARED.nearbyNote, /bayad/);
  assert.match(PA_PLACE_SHARED.opening('ਸਰੀ', 'Savneet'), /ਫ਼ੀਸ/);
  assert.match(PA_PLACE_SHARED.nearbyNote, /ਫ਼ੀਸ/);
  const tlAnswers = Object.values(TL_PLACES).flatMap((c) => c.faqs.map((f) => f.a)).join(' ');
  assert.match(tlAnswers, /pahina ng mga bayarin/);
  assert.match(tlAnswers, /pahina ng mga pamantayan/);
  const paAnswers = Object.values(PA_PLACES).flatMap((c) => c.faqs.map((f) => f.a)).join(' ');
  assert.match(paAnswers, /ਫ਼ੀਸਾਂ ਵਾਲੇ ਪੰਨੇ/);
  assert.match(paAnswers, /ਮਿਆਰਾਂ ਵਾਲੇ ਪੰਨੇ/);
  const labels = PA_PLACE_SHARED.focus.map((f) => f.label);
  assert.ok(labels.includes('ਚਿੰਤਾ (anxiety)') && labels.includes('ਉਦਾਸੀ (depression)'));
});
