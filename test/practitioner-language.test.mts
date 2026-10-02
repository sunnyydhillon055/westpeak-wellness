import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolvePlace, placesFor, placeDescription, SERVICE_CLAIMS } from '../lib/practitioner-places.ts';
import { getPractitioner, practitioners } from '../lib/practitioners.ts';
import { OFFERINGS, notOffered } from '../lib/practitioner-facts.ts';

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

/* Savneet Singh, 7 Sep 2026: the first counsellor with place pages who works in
   Punjabi. The shared BC copy was written for a Punjabi practice, so for her
   nothing should be stripped — and nothing about Tagalog should appear. */
const savneet = getPractitioner('savneet-singh')!;

test('every BC city page offers Savneet in Punjabi and never in Tagalog', () => {
  for (const raw of placesFor(['BC'])) {
    const text = textOf(resolvePlace(raw, savneet));
    assert.match(text, /punjabi/i, `${raw.slug} never mentions Punjabi on Savneet's page`);
    assert.doesNotMatch(text, /tagalog|filipino/i, `${raw.slug} offers Tagalog on Savneet's page`);
    const langLines = resolvePlace(raw, savneet).access
      .filter((a) => /english|tagalog|punjabi/i.test(`${a.label} ${a.detail}`));
    assert.equal(langLines.length, 1, `${raw.slug} has ${langLines.length} language lines`);
  }
});

test('Savneet has no Alberta pages until an insurance certificate is on file', () => {
  assert.deepEqual(savneet.provinces, ['BC']);
  assert.ok(placesFor(savneet.provinces).every((p) => p.province === 'BC'));
});

/* 2 Oct 2026: services, not only languages. Savneet offers no couples work
   and no EMDR, and her place pages carried the hub's "Can I have EMDR from
   Penticton?" and a meta description promising couples work. */
test('no place page mentions a service its counsellor does not offer, in its description or FAQ questions', () => {
  for (const o of OFFERINGS) {
    if (o.service === 'individual-therapy') continue;
    assert.ok(SERVICE_CLAIMS[o.service], `${o.service} has no claim pattern in lib/practitioner-places.ts`);
  }
  for (const p of practitioners) {
    if (!p.placePages) continue;
    const missing = OFFERINGS.filter((o) => !p.services.includes(o.service));
    assert.deepEqual(missing.map((o) => o.label), notOffered(p, practitioners).map((m) => m.label));
    for (const raw of placesFor(p.provinces)) {
      const r = resolvePlace(raw, p);
      const description = placeDescription(p, raw.city);
      for (const o of missing) {
        const rx = SERVICE_CLAIMS[o.service]!;
        assert.doesNotMatch(description, rx, `${p.slug}/${raw.slug} description offers ${o.label}`);
        for (const f of r.faqs) assert.doesNotMatch(f.q, rx, `${p.slug}/${raw.slug} asks about ${o.label}: ${f.q}`);
        for (const t of [r.blurb, ...r.local, ...r.access.map((a) => `${a.label} ${a.detail}`)]) {
          assert.doesNotMatch(t, rx, `${p.slug}/${raw.slug} offers ${o.label}: ${t.slice(0, 80)}`);
        }
      }
      assert.ok(description.length <= 158, `${p.slug}/${raw.slug} description is ${description.length}`);
    }
  }
});

test('Savneet is described one to one, Camille keeps couples work', () => {
  assert.match(placeDescription(savneet, 'Penticton'), /one to one/);
  assert.doesNotMatch(placeDescription(savneet, 'Penticton'), /couples/i);
  assert.match(placeDescription(camille, 'Kelowna'), /Trauma, anxiety, grief and couples work\./);
  const penticton = placesFor(['BC']).find((x) => x.slug === 'penticton')!;
  assert.ok(penticton.faqs.some((f) => /EMDR/.test(f.q)), 'the hub question this guards against has moved');
  assert.ok(resolvePlace(penticton, camille).faqs.some((f) => /EMDR/.test(f.q)), 'Camille offers EMDR and keeps it');
});
