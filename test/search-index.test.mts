import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIndex, searchIndex, stem, meaningfulTerms, expand, topService } from '../lib/search-index.ts';
import { SYNONYM_GROUPS, PHRASE_PAGES } from '../lib/search-synonyms.ts';
import { services } from '../lib/services.ts';
import { practitioners } from '../lib/practitioners.ts';

const index = buildIndex();
const first = (q: string) => searchIndex(index, q)[0]?.href;

/* Real queries from the Search Console export of 26 Sep 2026
   (data/gsc/2026-09-26-queries.csv), each pinned to the page that answers it.
   Every one of these returned nothing, or the wrong first result, before
   1 Oct 2026. */
const PINNED: [string, string][] = [
  ['how to get stress leave in bc', '/guides/stress-leave-bc'],
  ['how does stress leave work in bc', '/guides/stress-leave-bc'],
  ['how to go on stress leave bc', '/guides/stress-leave-bc'],
  ['how to apply for stress leave in bc', '/guides/stress-leave-bc'],
  ['wcb stress leave bc', '/guides/stress-leave-bc'],
  ['mental health days bc', '/guides/sick-days-and-mental-health-days-bc'],
  ['bc sick days mental health', '/guides/sick-days-and-mental-health-days-bc'],
  ['counselling meaning in punjabi', '/resources/counselling-in-punjabi-what-the-words-mean'],
  ['therapy meaning in punjabi', '/resources/counselling-in-punjabi-what-the-words-mean'],
  ['salah mashwara in english', '/resources/counselling-in-punjabi-what-the-words-mean'],
  ['what is a registered clinical counsellor', '/resources/verify-a-counsellor-in-bc'],
  ['bcacc find a counsellor', '/guides/how-to-find-a-therapist-in-bc'],
  ['couples counselling abbotsford', '/online-counselling/abbotsford/couples-therapy'],
  ['marriage counseling abbotsford bc', '/online-counselling/abbotsford/couples-therapy'],
  ['anxiety counselling kamloops', '/online-counselling/kamloops/anxiety-counselling'],
  ['depression counselling vancouver', '/online-counselling/vancouver/depression-counselling'],
  ['emdr kelowna', '/online-counselling/kelowna/emdr-therapy'],
  ['icbc counselling', '/resources/icbc-counselling-after-a-crash-bc'],
  ['stay at work services', '/resources/workplace-mental-health-bc'],
  ['is therapy covered by alberta health care', '/resources/counselling-coverage-in-alberta'],
  ['psychiatrist vs psychologist', '/compare/psychologist-vs-psychiatrist-bc'],
  ['virtual counselling jobs bc', '/resources/becoming-a-counsellor-in-bc'],
];

for (const [q, href] of PINNED) {
  test(`"${q}" opens on ${href}`, () => assert.equal(first(q), href));
}

test('the pages that book are in the index', () => {
  const hrefs = new Set(index.map((e) => e.href));
  for (const h of ['/pricing', '/book', '/faq', '/answers', '/punjabi-counselling', '/tagalog-counselling',
    '/online-counselling/abbotsford', '/online-counselling/surrey', '/practitioners/camille-granda', '/practitioners/savneet-singh']) {
    assert.ok(hrefs.has(h), h);
  }
  assert.equal(first('camille'), '/practitioners/camille-granda');
  assert.equal(first('savneet'), '/practitioners/savneet-singh');
  assert.equal(first('abbotsford'), '/online-counselling/abbotsford');
  assert.equal(first('fees'), '/pricing');
  assert.equal(first('price'), '/pricing');
});

test('a city hub is found by the towns it serves', () => {
  assert.ok(searchIndex(index, 'cloverdale').some((e) => e.href === '/online-counselling/surrey'));
  assert.ok(searchIndex(index, 'mission').some((e) => e.href === '/online-counselling/mission'));
  assert.ok(searchIndex(index, 'hatzic').some((e) => e.href === '/online-counselling/mission'));
});

test('only counsellors accepting clients are listed, never with a registration number', () => {
  const listed = index.filter((e) => e.kind === 'Counsellor').map((e) => e.href);
  for (const p of practitioners) {
    assert.equal(listed.includes(`/practitioners/${p.slug}`), p.acceptingNewClients, p.slug);
    for (const c of p.credentials) {
      if (!c.number) continue;
      assert.ok(!index.some((e) => e.summary.includes(c.number) || e.title.includes(c.number)), 'registration number');
    }
  }
  const resting = practitioners.filter((p) => !p.acceptingNewClients).map((p) => p.name);
  for (const n of resting) assert.ok(!index.some((e) => e.title.includes(n) || e.summary.includes(n)), n);
});

test('no hours or evening and weekend promises in the entries this file writes', () => {
  /* City summaries quote the hub's own blurb, which this file does not write. */
  for (const e of index.filter((x) => ['Page', 'Counsellor'].includes(x.kind))) {
    assert.doesNotMatch(`${e.title} ${e.summary}`, /\bevening|\bweekend|\b\d{1,2}\s?(am|pm)\b/i, e.href);
  }
});

test('whole words, not substrings: "men" no longer finds "mental", "fee" not "feelings"', () => {
  for (const e of searchIndex(index, 'men')) {
    assert.match(`${e.title} ${e.summary}`, /\bmen\b/i, e.href);
  }
  for (const e of searchIndex(index, 'fee')) {
    assert.doesNotMatch(e.title, /^feeling/i, e.href);
  }
});

test('spelling and plural variants fold together', () => {
  assert.equal(stem('counseling'), stem('counselling'));
  assert.equal(stem('counsellor'), stem('counselor'));
  assert.equal(stem('therapist'), stem('therapy'));
  assert.equal(stem('fees'), 'fee');
  assert.equal(stem('stories'), 'story');
  assert.equal(stem('stress'), 'stress');
  assert.deepEqual(meaningfulTerms('how do I get stress leave in BC?'), ['stress', 'leave']);
  assert.ok(expand('wcb').includes('worksafebc'));
});

test('ties go to a service or a counsellor rather than the glossary', () => {
  const r = searchIndex(index, 'emdr');
  const g = r.findIndex((e) => e.kind === 'Glossary');
  const s = r.findIndex((e) => e.kind === 'Service');
  assert.ok(s >= 0 && (g < 0 || s < g));
});

test('the top hit names the service to book when it is one', () => {
  assert.equal(topService(searchIndex(index, 'couples counselling abbotsford')), 'couples-therapy');
  assert.equal(topService(searchIndex(index, 'anxiety counselling')), 'individual-therapy');
  assert.equal(topService(searchIndex(index, 'stress leave')), undefined);
  for (const e of index) if (e.service) assert.ok(services.some((s) => s.slug === e.service), e.service);
});

test('every synonym row and phrase cites the query it came from', () => {
  for (const g of SYNONYM_GROUPS) assert.ok(g.from.length > 3 && g.words.length > 1);
  const hrefs = new Set(index.map((e) => e.href));
  for (const p of PHRASE_PAGES) {
    assert.ok(p.from.length > 3, p.phrase);
    assert.ok(hrefs.has(p.href), `${p.phrase} points at ${p.href}, which is not indexed`);
  }
});

test('nothing for an empty query or one made only of stopwords', () => {
  assert.deepEqual(searchIndex(index, ''), []);
  assert.deepEqual(searchIndex(index, 'how to in the'), []);
});
