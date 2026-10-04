import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locations } from '../lib/locations.ts';
import { htmlLength } from '../lib/city-hub.ts';
import { BC_HUB_FAQS } from '../lib/bc-hub-faqs.ts';
import { plainText, RAW_MD_LINK } from '../lib/plain-text.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* wf/tp-places, 3 Oct 2026: the hub title override, the /online-counselling
 * questions, and the hub FAQs that now carry links. */

test('a hub title override fits the SEO gate and names its city', () => {
  const overridden = locations.filter((l) => l.hubTitle);
  assert.deepEqual(overridden.map((l) => l.slug), ['kamloops'], 'only Kamloops carries its own title');
  for (const l of overridden) {
    assert.ok(htmlLength(l.hubTitle!) <= 60, `${l.hubTitle} is ${htmlLength(l.hubTitle!)} as the gate counts it`);
    assert.ok(l.hubTitle!.includes(l.city));
    assert.ok(/Therapist/.test(l.hubTitle!) && /Counsellor/.test(l.hubTitle!), 'the words the Kamloops searches use');
  }
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
