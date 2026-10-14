import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locations } from '../lib/locations.ts';
import { htmlLength } from '../lib/city-hub.ts';
import { BC_HUB_FAQS } from '../lib/bc-hub-faqs.ts';
import { plainText, RAW_MD_LINK } from '../lib/plain-text.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { fallbackFee } from '../lib/cliniko-catalog.ts';

/* wf/tp-places, 3 Oct 2026: the hub title override, the /online-counselling
 * questions, and the hub FAQs that now carry links. */

test('a hub title override fits the SEO gate and names its city', () => {
  const overridden = locations.filter((l) => l.hubTitle);
  /* Kamloops 3 Oct 2026; the other four 13 Oct 2026, each from its own
     head queries (the notes on the entries). */
  assert.deepEqual(
    overridden.map((l) => l.slug).sort(),
    ['kamloops', 'langford', 'prince-george', 'vancouver', 'vernon'],
    'only these hubs carry their own title',
  );
  for (const l of overridden) {
    assert.ok(htmlLength(l.hubTitle!) <= 60, `${l.hubTitle} is ${htmlLength(l.hubTitle!)} as the gate counts it`);
    assert.ok(l.hubTitle!.includes(l.city));
    assert.match(l.hubTitle!, /Counsel/, `${l.slug}: every hub title keeps counselling or counsellor`);
  }
  const t = (slug: string) => locations.find((l) => l.slug === slug)!.hubTitle!;
  assert.ok(/Therapist/.test(t('kamloops')) && /Counsellor/.test(t('kamloops')), 'the words the Kamloops searches use');
  assert.ok(/Therapy/.test(t('prince-george')) && /Therapist/.test(t('prince-george')), '"therapy prince george", "therapist prince george"');
  assert.match(t('vancouver'), /^Online Counselling .*Virtual Therapy/, '"online counselling vancouver", "virtual therapy vancouver"');
  assert.match(t('vernon'), /^Online Therapy & Counselling/, '"online therapy vernon", "counselling vernon bc"');
  assert.match(t('langford'), /^Counselling in Langford/, '"counselling langford"');
});

/* 13 Oct 2026: an H1 override goes with a title override, and says the city. */
test('a hub H1 override names its city and only sits beside its own title', () => {
  for (const l of locations.filter((x) => x.hubH1)) {
    assert.ok(l.hubTitle, `${l.slug} has an H1 of its own but the composed title`);
    assert.ok(l.hubH1!.includes(l.city), `${l.slug}: ${l.hubH1}`);
  }
});

/* 13 Oct 2026: Google showed the North Vancouver hub for "online counselling
   vancouver". North Vancouver sends City of Vancouver readers to their own
   hub in the query's words; Vancouver's lede answers before it argues and
   cites the public door it describes; no hub fee is typed. */
test('Vancouver is linked by its query and carries its own sourced public door', () => {
  const nv = locations.find((l) => l.slug === 'north-vancouver')!;
  const nvText = [...(nv.localReality?.body ?? []), ...(nv.access ?? []).map((a) => a.detail)].join(' ');
  assert.match(nvText, /\[[Oo]nline counselling in Vancouver\]\(\/online-counselling\/vancouver\)/);
  const v = locations.find((l) => l.slug === 'vancouver')!;
  assert.match(v.blurb, /^Online counselling in Vancouver/);
  assert.ok(v.localReality!.body.some((b) => b.includes('Access and Assessment Centre')));
  assert.ok(v.sources!.some((s) => s.url.includes('access-and-assessment-centre')), 'the AAC claim is cited');
  const all = [v.blurb, ...(v.intro ?? []), ...v.localReality!.body, ...v.access!.map((a) => `${a.label} ${a.detail}`)].join(' ');
  assert.ok(all.includes(fallbackFee('Individual Counselling')), 'the fee comes from the catalogue');
  assert.doesNotMatch(all, /\b(evening|weekend|lunch)s?\b|\b\d{1,2}\s?(am|pm)\b/i, 'no availability claims, no typed hours');
  assert.doesNotMatch(all, /\$3,170/, 'the unsourced rent figure is gone');
});

/* MoreFrom labels a chip with `title ?? name ?? city`: a `title` on a
   Location would put the hub's search title on every "Other areas served"
   chip. Found in the build of this branch, 3 Oct 2026. */
test('no Location carries a title or name that would relabel its chips', () => {
  for (const l of locations) {
    assert.ok(!('title' in l) && !('name' in l), `${l.slug} has a title/name field`);
  }
});

test('every hub meta description stays inside its 155 characters', () => {
  for (const l of locations) {
    assert.ok(htmlLength(l.metaDescription) <= 155, `${l.slug}: ${htmlLength(l.metaDescription)}`);
  }
});

const RULES: [RegExp, string][] = [
  [/\bmost\b[^.]*\bplans?\b/i, 'coverage is plan-dependent, never "most plans"'],
  [/\b(evening|weekend|saturday|sunday)s?\b/i, 'no evening or weekend availability claims'],
  [/\b\d{1,2}(:\d\d)?\s?(a\.?m\.?|p\.?m\.?)/i, 'no typed hours'],
  [/\b(guarantee|proven to|will feel better|cure)\b/i, 'no outcome claims'],
  [/\b(review|testimonial)s?\b/i, 'no reviews or testimonials'],
];

test('the /online-counselling questions keep the practice rules', () => {
  assert.ok(BC_HUB_FAQS.length >= 3);
  for (const f of BC_HUB_FAQS) {
    const text = `${f.q} ${f.a}`;
    for (const [re, why] of RULES) assert.ok(!re.test(text), `${f.q}: ${why}`);
    assert.ok(!/\b(30|45|60)-minute consultation/.test(text), 'the free consultation is 15 minutes');
    assert.ok(!f.a.includes("'"), `${f.q}: typographic apostrophes only`);
  }
  assert.ok(BC_HUB_FAQS.some((f) => /waitlist/i.test(f.q)));
  assert.ok(BC_HUB_FAQS.some((f) => f.a.includes('(/signin)')), 'the sign-in question links the portal');
});

test('FAQ answers with links are plain text in the schema', () => {
  const answers = [
    ...BC_HUB_FAQS.map((f) => f.a),
    ...locations.flatMap((l) => (l.faqs ?? []).map((f) => f.a)),
  ];
  assert.ok(answers.some((a) => RAW_MD_LINK.test(a)), 'at least one answer carries a link');
  for (const a of answers) assert.ok(!RAW_MD_LINK.test(plainText(a)), `raw markdown left in: ${a.slice(0, 60)}`);
});

test('the Kamloops and Prince George hubs answer how to find someone locally', () => {
  const kam = locations.find((l) => l.slug === 'kamloops')!;
  assert.ok(kam.faqs!.some((f) => /find a therapist or counsellor in Kamloops/.test(f.q)));
  const pg = locations.find((l) => l.slug === 'prince-george')!;
  const free = pg.faqs!.find((f) => /free counselling in Prince George/.test(f.q));
  assert.ok(free && free.a.includes('31 March 2026'), 'the CMHA pause is dated');
  assert.ok(pg.sources!.some((s) => s.url.includes('foundrybc.ca')), 'Foundry is cited');
  assert.ok(pg.nearby!.includes('kamloops'));
});

test('the /online-counselling hero button is a counted location', () => {
  assert.ok(BOOK_LOCATIONS.includes('hero-online'));
});
