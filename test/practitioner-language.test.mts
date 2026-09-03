import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePlace, placesFor } from '../lib/practitioner-places.ts';
import { getPractitioner } from '../lib/practitioners.ts';

/* THE BUG THIS EXISTS FOR
 *
 * The BC city records are adapted from lib/locations.ts, which was written for
 * the founder's practice and states her languages. Rendered under a different
 * counsellor's name they promised counselling in Punjabi from somebody who does
 * not speak it — on 14 of 17 city pages, inside FAQPage schema, live.
 *
 * No gate could have caught that. The pages were unique, well-linked, correctly
 * marked up and factually wrong. Only a test that knows who speaks what can. */

const camille = getPractitioner('camille-granda')!;
const aman = getPractitioner('aman-bains-dhillon')!;

const textOf = (p: ReturnType<typeof resolvePlace>) =>
  [p.blurb, ...p.local, ...p.access.flatMap((a) => [a.label, a.detail]),
   ...p.faqs.flatMap((f) => [f.q, f.a])].join(' ');

test('no BC city page offers Camille in a language she does not work in', () => {
  for (const raw of placesFor(['BC'])) {
    const text = textOf(resolvePlace(raw, camille));
    assert.doesNotMatch(text, /punjabi/i, `${raw.slug} offers Punjabi on Camille's page`);
    assert.doesNotMatch(text, /log kya kahenge/i, `${raw.slug} carries Punjabi cultural framing`);
  }
});

test('every city page states the languages she does work in', () => {
  for (const raw of placesFor(['BC', 'AB'])) {
    const text = textOf(resolvePlace(raw, camille));
    assert.match(text, /tagalog/i, `${raw.slug} never mentions Tagalog`);
  }
});

test('exactly one language line per page, never two', () => {
  for (const raw of placesFor(['BC', 'AB'])) {
    const langLines = resolvePlace(raw, camille).access
      .filter((a) => /english|tagalog|punjabi/i.test(`${a.label} ${a.detail}`));
    assert.equal(langLines.length, 1,
      `${raw.slug} has ${langLines.length} language lines in its access list`);
  }
});

test('the founder keeps her own languages and loses Tagalog', () => {
  const surrey = placesFor(['BC']).find((p) => p.slug === 'surrey')!;
  const text = textOf(resolvePlace(surrey, aman));
  assert.match(text, /punjabi/i, 'the Punjabi speaker lost her own language');
  assert.doesNotMatch(text, /tagalog/i, 'the founder is offered in Tagalog');
});

test('a dropped language FAQ is replaced, never left as a hole', () => {
  for (const raw of placesFor(['BC'])) {
    const before = raw.faqs.length;
    const after = resolvePlace(raw, camille).faqs.length;
    assert.ok(after >= before, `${raw.slug} lost FAQs without replacement (${before} -> ${after})`);
  }
});

test('local paragraphs survive — filtering must not gut a page', () => {
  for (const raw of placesFor(['BC', 'AB'])) {
    assert.ok(resolvePlace(raw, camille).local.length >= 2,
      `${raw.slug} was reduced to fewer than two local paragraphs`);
  }
});
