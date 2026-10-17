import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pairs } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { cityContexts, getCityContext } from '../lib/city-context.ts';
import { getLocation, locations } from '../lib/locations.ts';
import { getPunjabiRegion, punjabiRegions } from '../lib/punjabi-regions.ts';
import { FALLBACK_CATALOG, CONSULT_MINUTES } from '../lib/cliniko-catalog.ts';
import { withLetters, practitioners } from '../lib/practitioners.ts';
import { services } from '../lib/services.ts';
import { TAGALOG_CITIES } from '../lib/tagalog.ts';
import { audiences } from '../lib/audiences.ts';
import { guides } from '../lib/guides.ts';
import { comparisons } from '../lib/comparisons.ts';
import { placesFor, resolvePlace } from '../lib/practitioner-places.ts';
import {
  cityServiceDescription, counsellorsFor, hubDirectAnswer, midSentence, serviceDirectAnswer,
} from '../lib/city-service-page.ts';
import { metaLength, serviceSnippet } from '../lib/snippet-facts.ts';

/* THE CITY-SERVICE SCARCITY AND SNIPPET ROUND — 15 Oct 2026 (#508, #532,
 * #534, #544, #526).
 *
 * 9cdaf6e took the "absent locally" claims out of the city-service bodies,
 * but the description is built from the pair's angle, so Google still showed
 * "EMDR is one of the modalities the Fraser Valley most reliably does not
 * have locally" for Abbotsford. A local-scarcity claim nobody sourced is not
 * something these pages may say, in the result or on the page. These tests
 * hold that on the data the pages are built from, and hold the description's
 * new shape: the query first, the city always, never an ellipsis. */

const SCARCITY = /does not have(?! to)|\babsen(?:t|ce)\b|not (?:reliably )?represented|least (?:local|reliably)|flight (?:south|away)|hard to book|short local list|list is short|scarc(?:e|est|ity)|handful|few trained|few (?:Punjabi|Tagalog)|fill (?:up|quickly)|only realistic|thinnest|thinly|longer than almost|honest local answer|not available here|not present|no option at all|unavailable|go(?:es)? without|a long way from anybody|one of the gaps|licensed to see/i;

/* Clinical or non-local uses the pattern also catches, each checked by hand.
   A stale entry fails, so the list cannot quietly outlive its text. */
const ALLOWED = [
  'one partner is absent for months',
  'presents as absence at least as often',
  'the absence of an obvious trigger',
  'the absence of one is not evidence',
  'shared waking hours become scarce',
];

const describe = (p: (typeof pairs)[number]) => {
  const topic = getCityTopic(p.service)!;
  return cityServiceDescription({
    service: topic.name,
    city: getCityContext(p.city)!.city,
    angle: p.angle,
    snippet: p.snippet,
    counsellors: counsellorsFor(topic),
    facts: serviceSnippet(FALLBACK_CATALOG, topic.bookingService, []),
  });
};

const strings = (v: unknown): string[] =>
  typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];

const scarce = (where: string, texts: string[], used: Set<string>) => {
  for (const t of texts) {
    if (!SCARCITY.test(t)) continue;
    const ok = ALLOWED.find((a) => t.includes(a));
    if (ok) { used.add(ok); continue; }
    assert.fail(`${where} makes a local-scarcity claim: ${t.match(new RegExp(`.{0,60}(${SCARCITY.source}).{0,60}`, 'i'))?.[0]}`);
  }
};

test('#508 no city-service description, angle, snippet, body, FAQ or public route claims local scarcity', () => {
  const used = new Set<string>();
  for (const p of pairs) {
    const key = `${p.city}/${p.service}`;
    scarce(`${key} description`, [describe(p)], used);
    scarce(key, [p.angle, p.snippet ?? '', ...p.body, ...p.faqs.flatMap((f) => [f.q, f.a]), p.publicRoute?.text ?? ''], used);
  }
  /* The city context renders on every city-service page and hub. */
  for (const c of cityContexts) scarce(`city context ${c.slug}`, strings(c), used);
  for (const a of ALLOWED) assert.ok(used.has(a), `stale allow-list entry: ${a}`);
});

test('#532 the hubs, the Prince George Punjabi page and the two overview sentences no longer claim scarcity', () => {
  const used = new Set<string>();
  for (const slug of ['prince-george', 'kelowna', 'new-westminster']) {
    /* Each hub's own copy: intro, local reality, access and FAQs. */
    const l = getLocation(slug)!;
    scarce(`/online-counselling/${slug}`, strings([l.intro, l.localReality, l.access]), used);
  }
  scarce('/punjabi-counselling/prince-george', strings(getPunjabiRegion('prince-george')), used);
  for (const f of ['app/page.tsx', 'app/online-counselling/page.tsx']) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /scarcity of clinicians|concentration of Punjabi-speaking/, f);
  }
  const cmp = readFileSync('lib/comparisons-more2.ts', 'utf8');
  assert.doesNotMatch(cmp, /counsellors are scarcest/);
  assert.equal(used.size, 0, `allow-list used on a hub: ${[...used]}`);
});

test('#534 every description opens "Online {service} for {City}", carries its own sentence whole, and never an ellipsis', () => {
  for (const p of pairs) {
    const topic = getCityTopic(p.service)!;
    const city = getCityContext(p.city)!.city;
    const d = describe(p);
    const key = `${p.city}/${p.service}`;
    assert.ok(d.startsWith(`Online ${midSentence(topic.name)} for ${city}`), `${key}: ${d}`);
    assert.ok(d.includes(city), `${key} lacks its city: ${d}`);
    assert.ok(!d.includes('…') && !d.includes('...'), `${key} is cut: ${d}`);
    assert.ok(metaLength(d) <= 158, `${key}: ${metaLength(d)} chars`);
    const first = p.angle.match(/^.*?[.!?](?=\s|$)/)![0];
    assert.ok(d.includes(first) || (p.snippet !== undefined && d.includes(p.snippet)), `${key} dropped its own sentence: ${d}`);
    assert.match(d, /free 15-min consult\.$/, key);
  }
});

test('#534 a snippet exists only where the angle cannot sit whole, and is shorter than it', () => {
  for (const p of pairs.filter((x) => x.snippet)) {
    const first = p.angle.match(/^.*?[.!?](?=\s|$)/)![0];
    assert.ok(!describe(p).includes(first), `${p.city}/${p.service}: the angle fits, so the snippet is dead weight`);
    assert.ok(p.snippet!.length < first.length, `${p.city}/${p.service}`);
    assert.doesNotMatch(p.snippet!, /'/, 'straight apostrophe');
  }
});

test('#534 Vernon EMDR and depression descriptions read as the query', () => {
  const vernon = (s: string) => describe(pairs.find((p) => p.city === 'vernon' && p.service === s)!);
  assert.match(vernon('emdr-therapy'), /^Online EMDR therapy for Vernon, by secure video\. .+ With Camille, \$/);
  assert.match(vernon('depression-counselling'), /^Online depression counselling for Vernon\. /);
});

/* scripts/ctr-delta.mjs marks a page REWRITTEN when its snapshot before an
   export differs from the one after it, so the 15 Oct snapshot must carry the
   descriptions these pages now publish, and the 14 Oct one the old ones. */
test('#534 the change is recorded in snippets.json for ctr-delta', () => {
  const snaps = JSON.parse(readFileSync('data/gsc/snippets.json', 'utf8'));
  for (const p of pairs) {
    const u = `/online-counselling/${p.city}/${p.service}`;
    assert.equal(snaps['2026-10-15'][u]?.desc, describe(p), `${u} not recorded`);
    assert.notEqual(snaps['2026-10-14'][u]?.desc, describe(p), `${u} unchanged since 14 Oct`);
    assert.equal(snaps['2026-10-15'][u].title, snaps['2026-10-14'][u].title, `${u}: titles stay`);
  }
});

test('#544 the direct answer names the counsellor who offers the service', () => {
  for (const service of ['emdr-therapy', 'couples-therapy', 'individual-therapy']) {
    const who = counsellorsFor({ bookingService: service });
    const a = serviceDirectAnswer('EMDR Therapy', 'Vernon', who);
    for (const p of who) assert.ok(a.includes(p.name), `${service}: ${a}`);
    assert.ok(a.includes(`free ${CONSULT_MINUTES}-minute consultation`), a);
    if (who.length === 1) {
      assert.ok(a.includes(withLetters(who[0])), a);
      assert.doesNotMatch(a, /Counsellors/, 'one counsellor, plural noun');
    } else {
      assert.match(a, / or /);
    }
    for (const p of counsellorsFor({ bookingService: 'individual-therapy' }).filter((x) => !who.includes(x))) {
      assert.ok(!a.includes(p.name), `${service} names ${p.name}, who does not offer it`);
    }
  }
  const hub = hubDirectAnswer('Vernon', counsellorsFor({ bookingService: 'individual-therapy' }));
  assert.match(hub, /^Online counselling for people in Vernon is with /);
  assert.doesNotMatch(hub, /\b\d{4,}\b/, 'a registration number');
  const page = readFileSync('app/online-counselling/[city]/[service]/page.tsx', 'utf8');
  assert.match(page, /serviceDirectAnswer\(svc\.name, ctx\.city, counsellors\)/);
  assert.doesNotMatch(page, /is delivered by secure video by Registered/);
});

test('#526 five depression pages link the winter guide from a body paragraph, each with its own anchor', () => {
  const GUIDE = '](/guides/low-mood-through-a-bc-winter)';
  const linked = pairs.filter((p) => p.body.some((b) => b.includes(GUIDE)));
  assert.deepEqual(linked.map((p) => p.city).sort(), ['abbotsford', 'courtenay', 'kamloops', 'mission', 'prince-george']);
  const anchors = new Set<string>();
  for (const p of linked) {
    assert.equal(p.service, 'depression-counselling');
    assert.ok(!p.faqs.some((f) => f.a.includes(GUIDE)), `${p.city}: link in an FAQ answer`);
    const anchor = p.body.join(' ').match(/\[([^\]]+)\]\(\/guides\/low-mood-through-a-bc-winter\)/)![1];
    assert.ok(/winter|daylight|shortest days/i.test(anchor), `${p.city}: ${anchor}`);
    anchors.add(anchor);
  }
  assert.equal(anchors.size, linked.length, 'two pages share an anchor');
  assert.match(readFileSync('lib/depth-services.ts', 'utf8'), /\[the darkest weeks of a BC winter\]\(\/guides\/low-mood-through-a-bc-winter\)/);
});

/* THE LANGUAGE, HUB AND PLACE PAGES — 16 Oct 2026 (item 571).
 *
 * The 15 Oct round held city-service data only. The same uncited claims went
 * on shipping on the language pages ("realistically the only route to
 * therapy in Punjabi", an FAQ asking whether there is "really nobody in the
 * Comox Valley who counsels in Punjabi"), on every hub's copy, and on the
 * per-counsellor place pages built from it. Nobody here has counted the
 * counsellors in a language by region, so none of that is said. What is said:
 * availability varies, the BCACC directory filters by language, and video
 * works anywhere in BC. Census counts are sourced and stay. */
const LANGUAGE_SCARCITY = new RegExp(
  `${SCARCITY.source}|realistically the only|the only route|nobody .* counsels|concentrated (?:\\w+ )?in (?:the Lower Mainland|Metro Vancouver)|thins the field|field narrows|still short of|in the depth the`,
  'i',
);

/* Clinical or non-local uses, each checked by hand. A stale entry fails. */
const WIDE_ALLOWED: string[] = [
  'in a handful of processing sessions',
  'a handful per issue per year',
  'A psychiatrist’s scarce time',
  'the absence of an accountable human',
  'the absence of skills nobody ever taught you',
  'Adoptive parents are largely absent from the public conversation',
  'run it thinly across six months',
  'does not have any role in medical fitness',
  'feel unavailable',
  'felt as waitlists rather than as absence',
  'is not scarcity in Kamloops',
  'What the Shore does not have is a short way to anywhere else',
  'without explaining an absence',
  'explain an absence',
  'only a handful of households to talk to',
  'does not argue that Punjabi-speaking counselling is unavailable nearby',
];

const hits: string[] = [];
const scarceWide = (where: string, texts: string[], used: Set<string>) => {
  for (const t of texts) {
    if (!LANGUAGE_SCARCITY.test(t)) continue;
    const ok = [...ALLOWED, ...WIDE_ALLOWED].find((a) => t.includes(a));
    if (ok) { used.add(ok); continue; }
    const at = `${where}: ${t.match(new RegExp(`.{0,60}(${LANGUAGE_SCARCITY.source}).{0,60}`, 'i'))?.[0]}`;
    if (!hits.includes(at)) hits.push(at);
  }
};

test('#571 no language, hub, audience or place page claims local scarcity', () => {
  const used = new Set<string>();
  hits.length = 0;
  after571(used);
  assert.deepEqual(hits, [], `local-scarcity claims:\n${hits.join('\n')}`);
  for (const a of WIDE_ALLOWED) assert.ok(used.has(a), `stale allow-list entry: ${a}`);
});

function after571(used: Set<string>) {
  for (const s of services) scarceWide(`/services/${s.slug}`, strings(s), used);
  for (const r of punjabiRegions) scarceWide(`/punjabi-counselling/${r.slug}`, strings(r), used);
  for (const c of TAGALOG_CITIES) scarceWide(`/tagalog-counselling/${c.slug}`, strings(c), used);
  for (const a of audiences) scarceWide(`/for/${a.slug}`, strings(a), used);
  for (const l of locations) scarceWide(`/online-counselling/${l.slug}`, strings(l), used);
  for (const g of guides.filter((x) => x.slug === 'is-online-therapy-as-effective-as-in-person')) scarceWide(`/guides/${g.slug}`, strings(g), used);
  for (const c of comparisons) scarceWide(`/compare/${c.slug}`, strings(c), used);
  for (const p of practitioners) {
    for (const place of placesFor(p.provinces)) {
      scarceWide(`/practitioners/${p.slug}/${place.slug}`, strings(resolvePlace(place, p)), used);
    }
  }
}

/* ROUND 11 — 16 Oct 2026. The #571 pattern missed claims phrased as growth
 * outrunning supply ("has not grown with it", "the lists are long"), as
 * coverage ("thinner local coverage", "the Island field is thin on"), as
 * queues ("queueing behind a region", "short or full", "few clinicians taking
 * new clients") and as regional deficit ("service gaps", "one option or none",
 * "a metropolitan privilege", the Prince George depth section). None was
 * sourced, so these phrasings fail on the same pages plus the depth sections
 * (lib/depth.ts, which carries lib/depth-other.ts). */
const ROUND11_SCARCITY = /has not grown with it|lists? (?:are|is) long|thinner (?:local )?coverage|queueing behind|(?:field|list) is thin|\bthin on\b|short or full|few clinicians|service gaps|one option or none|metropolitan privilege|runs short first/i;

test('round 11: growth, coverage and queue phrasings of local scarcity are caught too', async () => {
  const { depthOther } = await import('../lib/depth-other.ts');
  const found: string[] = [];
  const check = (where: string, texts: string[]) => {
    for (const t of texts) {
      const m = t.match(new RegExp(`.{0,50}(${ROUND11_SCARCITY.source}).{0,50}`, 'i'));
      if (m) found.push(`${where}: ${m[0]}`);
    }
  };
  for (const r of punjabiRegions) check(`/punjabi-counselling/${r.slug}`, strings(r));
  for (const c of TAGALOG_CITIES) check(`/tagalog-counselling/${c.slug}`, strings(c));
  for (const l of locations) check(`/online-counselling/${l.slug}`, strings(l));
  for (const c of cityContexts) check(`city context ${c.slug}`, strings(c));
  for (const p of pairs) check(`${p.city}/${p.service}`, strings(p));
  for (const [k, v] of Object.entries(depthOther)) check(`depth ${k}`, strings(v));
  for (const p of practitioners) {
    for (const place of placesFor(p.provinces)) check(`/practitioners/${p.slug}/${place.slug}`, strings(resolvePlace(place, p)));
  }
  assert.deepEqual(found, [], `local-scarcity claims:\n${found.join('\n')}`);
  /* Two of the rewrites held to their new wording, so a revert is noticed. */
  assert.match(strings(getLocation('nanaimo')).join(' '), /openings for a given approach come and go/);
  assert.match(strings(getLocation('courtenay')).join(' '), /Particular work is where choice matters/);
});

test('#571 a place page asks about the counsellor’s second language once', () => {
  for (const p of practitioners) {
    const second = p.languages[1]?.name;
    if (!second) continue;
    for (const place of placesFor(p.provinces)) {
      const asks = resolvePlace(place, p).faqs.filter((f) => new RegExp(`\\bsessions (?:be )?in ${second}\\b`, 'i').test(f.q));
      assert.ok(asks.length <= 1, `/practitioners/${p.slug}/${place.slug} asks about ${second} ${asks.length} times`);
    }
  }
});
