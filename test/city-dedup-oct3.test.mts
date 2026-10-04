import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pairs, PUBLIC_ROUTE_SOURCES } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { FALLBACK_CATALOG, fallbackFee } from '../lib/cliniko-catalog.ts';
import { cityServiceDescription, counsellorsFor, cutAtClause, cutAtWord, generatedFaqs } from '../lib/city-service-page.ts';
import { metaLength, serviceSnippet } from '../lib/snippet-facts.ts';
import { getLocation } from '../lib/locations.ts';
import { comparisons } from '../lib/comparisons.ts';
import { BCPA_PSYCHOLOGIST } from '../lib/fee-guides.ts';

/* THE CITY-SERVICE DEDUPLICATION ROUND — 3 Oct 2026 (#415, #422, #432,
 * #433, #437, #449, #464). The uniqueness gate checks the rendered pages;
 * these hold the rules on the data, so a broken description or an unsourced
 * public route fails before a build is needed. */

const src = (p: string) => readFileSync(p, 'utf8');
const PAGE = 'app/online-counselling/[city]/[service]/page.tsx';
const HOURS = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|evenings?|weekends?|\d{1,2}(:\d{2})?\s?(am|pm|a\.m\.|p\.m\.))\b/i;

const describe = (p: (typeof pairs)[number]) => {
  const topic = getCityTopic(p.service)!;
  return cityServiceDescription({
    angle: p.angle,
    counsellors: counsellorsFor(topic),
    facts: serviceSnippet(FALLBACK_CATALOG, topic.bookingService, []),
  });
};

test('#422 every city-service description carries the catalogue fee, the free consult and fits the gate', () => {
  for (const p of pairs) {
    const topic = getCityTopic(p.service)!;
    const d = describe(p);
    const key = `${p.city}/${p.service}`;
    assert.ok(metaLength(d) <= 158, `${key}: ${metaLength(d)} chars: ${d}`);
    assert.ok(d.includes(`${fallbackFee(topic.bookingService === 'couples-therapy' ? 'Couples Counselling' : 'Individual Counselling')} per 50-min session`), `${key}: ${d}`);
    assert.match(d, /free 30-min consult\.$/, key);
    assert.ok(!HOURS.test(d), `${key} names a time: ${d}`);
    assert.ok(d.startsWith(p.angle.split(' ').slice(0, 3).join(' ')), `${key} does not open on its angle: ${d}`);
  }
});

test('#422 couples and EMDR name only the counsellor who offers the work', () => {
  for (const p of pairs.filter((x) => x.service === 'couples-therapy' || x.service === 'emdr-therapy')) {
    const who = counsellorsFor(getCityTopic(p.service)!);
    const d = describe(p);
    if (who.length !== 1) continue;
    assert.ok(d.includes(`With ${who[0].name.split(' ')[0]},`), `${p.city}/${p.service}: ${d}`);
    for (const other of counsellorsFor({ bookingService: 'individual-therapy' }).filter((x) => x.slug !== who[0].slug)) {
      assert.ok(!d.includes(other.name.split(' ')[0]), `${p.city}/${p.service} names ${other.name}`);
    }
  }
});

test('#422 the seven pages holding most impressions keep their whole angle sentence', () => {
  const top = ['abbotsford/couples-therapy', 'kamloops/depression-counselling', 'abbotsford/depression-counselling',
    'kamloops/trauma-therapy', 'burnaby/anxiety-counselling', 'kelowna/emdr-therapy', 'victoria/emdr-therapy'];
  for (const key of top) {
    const p = pairs.find((x) => `${x.city}/${x.service}` === key)!;
    const d = describe(p);
    assert.ok(d.includes('$'), `${key}: ${d}`);
    const first = p.angle.match(/^.*?[.!?](?=\s|$)/)![0];
    if (metaLength(first) <= 100) assert.ok(d.startsWith(first), `${key} cut a short angle: ${d}`);
  }
});

test('#422 no two descriptions share more than 60% of their word 4-grams (the gate, on the data)', () => {
  const grams = (s: string) => {
    const w = s.toLowerCase().replace(/[^a-z0-9$’' -]+/g, ' ').split(/\s+/).filter(Boolean);
    const out = new Set<string>();
    for (let i = 0; i + 4 <= w.length; i++) out.add(w.slice(i, i + 4).join(' '));
    return out;
  };
  const all = pairs.map((p) => ({ key: `${p.city}/${p.service}`, g: grams(describe(p)) }));
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      let inter = 0;
      for (const x of all[i].g) if (all[j].g.has(x)) inter++;
      const v = inter / Math.min(all[i].g.size, all[j].g.size);
      assert.ok(v <= 0.6, `${all[i].key} vs ${all[j].key}: ${(v * 100).toFixed(0)}%`);
    }
  }
});

test('cutAtWord keeps whole words, drops a trailing comma and marks the cut', () => {
  assert.equal(cutAtWord('One two, three four.', 11), 'One two…');
  assert.ok(metaLength(cutAtWord('A long sentence that will need cutting here.', 20)) <= 20);
  const d = cityServiceDescription({ angle: 'x '.repeat(120).trim() + '.', counsellors: [{ name: 'Ann Bee' }], facts: '$1 per 50-min session · free 30-min consult' });
  assert.ok(metaLength(d) <= 158 && d.includes('… With Ann,'), d);
});

test('cutAtClause ends on a whole clause, never on a fragment', () => {
  assert.equal(cutAtClause('Finding one in Surrey is possible; finding one in Punjabi is not.', 60), 'Finding one in Surrey is possible.');
  assert.equal(cutAtClause('Two Burnaby commutes rarely converge, which is why work stalls.', 50), 'Two Burnaby commutes rarely converge.');
  assert.equal(cutAtClause('When anxiety attaches to driving, the trip is hard, and so on.', 60), undefined, 'a subordinate opening has no whole clause before its comma');
  assert.equal(cutAtClause('Boats, camps and farm sites take one away.', 60), undefined, 'a list comma is not a clause end');
  /* The case that made this: the Surrey EMDR description must not name a
     language its one counsellor does not speak. */
  const surrey = pairs.find((p) => p.city === 'surrey' && p.service === 'emdr-therapy')!;
  assert.doesNotMatch(describe(surrey), /Punjabi/);
});

test('#437 only the places question is generated, and the page folds cost into the fee line', () => {
  const p = pairs.find((x) => x.city === 'surrey' && x.service === 'couples-therapy')!;
  const faqs = generatedFaqs({ topic: getCityTopic(p.service)!, ctx: { city: 'Surrey', authority: 'Fraser Health' }, loc: getLocation('surrey')! });
  assert.equal(faqs.length, 1);
  assert.match(faqs[0].q, /^Is couples therapy available in /);
  const page = src(PAGE);
  assert.match(page, /generatedFaqs\(\{ topic: svc, ctx, loc \}\)/);
});

test('#415 the shared service body is gone, its links stay; the sibling list no longer repeats angles', () => {
  const page = src(PAGE);
  for (const gone of ['svc.intro', 'svc.helps', 'svc.approach', '{p.angle}']) assert.ok(!page.includes(gone), `${gone} is back on the page`);
  for (const kept of ['SERVICE_FIGURE[svc.slug]', 'CONDITION_UPLINK[svc.slug]', '/tools/which-service', '/guides/what-to-expect-first-therapy-session']) {
    assert.ok(page.includes(kept), `${kept} was cut with the body`);
  }
});

test('#464 nine anxiety and depression pages carry their own public route, sourced and dated', () => {
  const routed = pairs.filter((p) => p.publicRoute);
  assert.deepEqual(routed.map((p) => `${p.city}/${p.service}`).sort(), [
    'chilliwack/anxiety-counselling', 'chilliwack/depression-counselling', 'kamloops/anxiety-counselling', 'kamloops/depression-counselling',
    'langley/anxiety-counselling', 'langley/depression-counselling', 'prince-george/anxiety-counselling', 'prince-george/depression-counselling',
    'victoria/depression-counselling',
  ]);
  for (const p of routed) {
    const r = p.publicRoute!;
    assert.ok(r.sources.length >= 1);
    for (const s of r.sources) {
      assert.ok(PUBLIC_ROUTE_SOURCES.includes(s));
      assert.match(s.label, /read 3 Oct 2026/);
      assert.match(s.url, /^https:\/\/(www\.)?(fraserhealth|interiorhealth|northernhealth|islandhealth)\.ca\/|^https:\/\/bouncebackbc\.ca\//);
    }
    assert.ok(!HOURS.test(r.text), `${p.city}/${p.service} names a time`);
    assert.ok(!/\b(will|cure|guarantee|proven)\b/i.test(r.text), `${p.city}/${p.service} predicts an outcome`);
    assert.ok(!/Anxiety Canada|MindShift/.test(r.text), 'Anxiety Canada closed on 1 April 2026');
    assert.ok(!r.text.includes("'"), 'straight apostrophe in a single-quoted string');
  }
  const shingles = (s: string) => {
    const w = s.toLowerCase().split(/\s+/);
    return new Set(w.map((_, i) => w.slice(i, i + 8).join(' ')).filter((x) => x.split(' ').length === 8));
  };
  for (const city of ['chilliwack', 'langley', 'kamloops', 'prince-george']) {
    const a = shingles(pairs.find((p) => p.city === city && p.service === 'anxiety-counselling')!.publicRoute!.text);
    const d = shingles(pairs.find((p) => p.city === city && p.service === 'depression-counselling')!.publicRoute!.text);
    assert.equal([...a].filter((x) => d.has(x)).length, 0, `${city}: anxiety and depression routes share an 8-word run`);
  }
  assert.match(src(PAGE), /pair\.publicRoute\?\.sources/);
});

test('#432 Surrey answers free counselling, couples included, from sourced facts and the catalogue', () => {
  const surrey = getLocation('surrey')!;
  const f = surrey.faqs!.find((x) => x.q === 'Is there free counselling in Surrey, including for couples?')!;
  assert.ok(f, 'the Surrey FAQ is missing');
  assert.match(f.a, /SFU Surrey Community Counselling/);
  assert.match(f.a, /couples sessions are not/, 'SFU lists relationship struggles, not couples sessions');
  assert.match(f.a, /Fraser Health’s Surrey Mental Health and Substance Use Centre/);
  assert.match(f.a, /\(\/resources\/low-cost-counselling-bc\)/);
  assert.ok(f.a.includes(fallbackFee('Individual Counselling')) && f.a.includes(fallbackFee('Couples Counselling')));
  assert.match(f.a, /free 30-minute consultation\.$/);
  assert.ok(!HOURS.test(f.a));
  assert.ok(!/\b(cost|fee)\b/i.test(f.q), 'a cost word in the question would suppress the generated cost FAQ');
  const urls = surrey.sources!.map((s) => s.url);
  assert.ok(urls.includes('https://www.sfu.ca/education/community-engagement/surrey-community-counselling.html'));
  assert.ok(urls.includes('https://www.fraserhealth.ca/Service-Directory/Locations/Surrey/surrey-mental-health-centre'));
});

test('#433 the comparison answers how to find a registered psychologist, with BCPA’s rate beside the fee', () => {
  const c = comparisons.find((x) => x.slug === 'rcc-vs-psychologist-vs-social-worker-bc')!;
  const f = c.faqs.find((x) => x.q === 'How do I find a registered psychologist in BC?')!;
  assert.ok(f);
  assert.ok(f.a.includes(BCPA_PSYCHOLOGIST.range), 'BCPA’s rate from lib/fee-guides.ts');
  assert.ok(f.a.includes(fallbackFee('Individual Counselling')), 'the catalogue fee');
  for (const link of ['https://psychologists.bc.ca/find-psychologist', 'https://chcpbc.alinityapp.com/client/publicdirectory', '/resources/psychiatry-and-assessment-in-bc']) {
    assert.ok(f.a.includes(`(${link})`), `${link} missing`);
  }
  for (const label of ['Find a Psychologist (read 3 Oct 2026)', 'psychology (read 3 Oct 2026)']) {
    assert.ok(c.sources.some((s) => s.label.endsWith(label)), label);
  }
});

test('#449 the gate reads the five families and the GSC report runs in npm run seo', () => {
  const gate = src('scripts/uniqueness-gate.mjs');
  assert.match(gate, /const MIN_UNIQUE_SHARE = 0\.\d+;/);
  for (const fam of ["'place /tl'", "'place /pa'", "'Tagalog city'", "'city hub'", "'Punjabi region'"]) assert.ok(gate.includes(fam), fam);
  assert.match(gate, /const TWIN_CEILING = 0\.5;/);
  assert.match(gate, /process\.argv\.includes\('--gsc'\)/);
  assert.match(gate, /const LIVE_DAYS = 42;/);
  const pkg = JSON.parse(src('package.json'));
  assert.match(pkg.scripts.seo, /uniqueness-gate\.mjs --gsc/);
});
