import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spokes, SERVICE_ANCHOR, PAIRED_SERVICES, spokesForService, midSentence } from '../lib/spokes.ts';
import { getGuide } from '../lib/guides.ts';
import { getComparison } from '../lib/comparisons.ts';
import { getResource } from '../lib/resources.ts';
import { getAudience } from '../lib/audiences.ts';
import { getPair } from '../lib/city-services.ts';
import { cityContexts } from '../lib/city-context.ts';
import { locations } from '../lib/locations.ts';
import { cityLinkTargets } from '../lib/city-links.ts';

/* The spoke map exists to send links from the pages that rank to the pages
 * that earn a client. A spoke that names a page which does not exist sends a
 * crawler to a 404 from the site's best pages, which is worse than no spoke,
 * and nothing else in the build would notice: the component just renders the
 * href it was given. */

const lookup = { guides: getGuide, compare: getComparison, resources: getResource } as const;

test('every spoke key names a live guide, comparison or resource', () => {
  for (const key of Object.keys(spokes)) {
    const [section, slug] = key.split('/') as [keyof typeof lookup, string];
    assert.ok(lookup[section], `${key}: "${section}" is not a collection the spoke templates render`);
    assert.ok(lookup[section](slug), `${key} names a page that does not exist — the block would render on nothing`);
  }
});

test('every spoke service is one of the five paired services, with an anchor', () => {
  for (const [key, s] of Object.entries(spokes)) {
    if (!s.service) continue;
    assert.ok((PAIRED_SERVICES as readonly string[]).includes(s.service), `${key} → ${s.service} has no city pages`);
    assert.ok(SERVICE_ANCHOR[s.service], `${key} → ${s.service} has no anchor text`);
    assert.notEqual(SERVICE_ANCHOR[s.service], s.service, `${key}: the anchor is the slug, which is the defect this replaces`);
  }
});

test('every city × service link a spoke renders resolves to a built pair', () => {
  for (const [key, s] of Object.entries(spokes)) {
    if (!s.service) continue;
    for (const c of cityContexts) {
      assert.ok(getPair(c.slug, s.service), `${key} would link /online-counselling/${c.slug}/${s.service}, which has no pair`);
    }
  }
});

test('every spoke audience is a /for page, and a spoke says something', () => {
  for (const [key, s] of Object.entries(spokes)) {
    assert.ok(s.service || (s.audiences && s.audiences.length), `${key} is a spoke to nowhere`);
    for (const a of s.audiences ?? []) {
      assert.ok(getAudience(a), `${key} → /for/${a} does not exist`);
    }
    assert.ok((s.audiences?.length ?? 0) <= 4, `${key} names ${s.audiences?.length} audiences; a sentence holds four`);
  }
});

test('each paired service has at least two informational spokes', () => {
  for (const svc of PAIRED_SERVICES) {
    assert.ok(spokesForService(svc).length >= 2, `${svc} is reachable from fewer than two informational pages`);
  }
});

test('the twelve /for pages that had only /answers as a linker each have a spoke', () => {
  const quiet = [
    'first-responders', 'international-students', 'newcomers-to-canada', 'punjabi-speaking-couples',
    'south-asian-intergenerational-conflict', 'teens-and-young-adults', 'trades-and-construction-workers',
    'rotational-and-camp-workers', 'tech-workers', 'truck-drivers', 'teachers', 'men',
  ];
  for (const slug of quiet) {
    const n = Object.values(spokes).filter((s) => s.audiences?.includes(slug)).length;
    assert.ok(n >= 2, `/for/${slug} is named by ${n} spoke(s); the baseline asked for three`);
  }
});

/* CityLinks reaches every city page now, not the ten with context prose. The
 * five outside cityContexts had zero informational inbound in the baseline. */
test('CityLinks links every location, the ten hubs first, and invents nothing', () => {
  assert.equal(cityLinkTargets.length, locations.length);
  for (let i = 0; i < cityContexts.length; i++) assert.equal(cityLinkTargets[i].slug, cityContexts[i].slug);
  for (const t of cityLinkTargets) {
    const l = locations.find((x) => x.slug === t.slug);
    assert.ok(l, `${t.slug} is not a location — the chip would 404`);
    assert.equal(t.city, l!.city);
  }
  assert.equal(new Set(cityLinkTargets.map((t) => t.slug)).size, cityLinkTargets.length);
});

test('the heading keeps an acronym and lowers an ordinary word', () => {
  assert.equal(midSentence('EMDR therapy'), 'EMDR therapy');
  assert.equal(midSentence('Anxiety counselling'), 'anxiety counselling');
});

/* Item 391, 2 Oct 2026: the two Filipino /for pages had one informational
 * linker each and no spoke. */
test('the Filipino /for pages are named by the Tagalog pages, within four audiences each', () => {
  const named = (slug: string) => Object.entries(spokes).filter(([, s]) => s.audiences?.includes(slug)).map(([k]) => k);
  assert.deepEqual(named('filipino-canadian-families').sort(), [
    'compare/therapy-in-tagalog-vs-english',
    'guides/talking-to-your-family-about-therapy',
    'resources/counselling-in-tagalog-what-the-words-mean',
    'resources/finding-a-counsellor-in-punjabi-or-tagalog-in-bc',
  ]);
  assert.ok(named('filipino-healthcare-workers-and-caregivers').length >= 2);
  assert.ok(spokes['resources/finding-a-counsellor-in-punjabi-or-tagalog-in-bc'].audiences!.includes('first-gen-south-asian-adults'));
  for (const s of Object.values(spokes)) assert.ok((s.audiences?.length ?? 0) <= 4);
});
