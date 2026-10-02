import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FALLBACK_CATALOG, money, type Catalog } from '../lib/cliniko-catalog.ts';
import { sessionsCovered, planMaximumParagraph } from '../lib/session-arithmetic.ts';
import { languageEntries, fundingBlock, concernsFromPairs, missingUrls, sitemapUrls } from '../lib/machine-facts.ts';
import { HOW_TO_CANCEL } from '../lib/faq.ts';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { claimsIn, scanGottmanClaims } from '../scripts/lib/gottman-claims.mjs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { coverageClaims, scanCoverageClaims } from '../scripts/coverage-claims.mjs';

const ROOT = process.cwd();
const abs = (p: string) => `https://example.test${p}`;
const fee = (n: string) => FALLBACK_CATALOG.items.find((i) => i.name === n)!;

/* ---- 111: the plan-maximum arithmetic ---------------------------------- */

test('sessionsCovered rounds down to whole sessions and refuses nonsense', () => {
  assert.equal(sessionsCovered(50000, 14000), 3);
  assert.equal(sessionsCovered(150000, 14000), 10);
  assert.equal(sessionsCovered(14000, 14000), 1);
  assert.equal(sessionsCovered(13999, 14000), 0);
  assert.equal(sessionsCovered(50000, 0), 0);
  assert.equal(sessionsCovered(-1, 14000), 0);
});

test('the coverage paragraph quotes catalogue fees, counts from them, and links the estimator', () => {
  const p = planMaximumParagraph();
  const ind = fee('Individual Counselling');
  const cpl = fee('Couples Counselling');
  assert.ok(p.includes(money(ind.cents)), p);
  assert.ok(p.includes(money(cpl.cents)), p);
  assert.ok(p.includes(`about ${sessionsCovered(50000, ind.cents)} individual sessions`), p);
  assert.ok(p.includes(`about ${sessionsCovered(150000, ind.cents)} (`), p);
  assert.ok(p.includes('(/tools/therapy-cost-bc)'), 'estimator not linked');
  assert.match(p, /per-?visit|cap each visit/i, 'per-session caps not caveated');
  assert.match(p, /percentage/i, 'percentage reimbursement not caveated');
  assert.doesNotMatch(p, /'/, 'a straight apostrophe in prose');
});

test('a fee change in the catalogue changes the paragraph with it', () => {
  const moved: Catalog = {
    ...FALLBACK_CATALOG,
    items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Individual Counselling' ? { ...i, cents: 25000 } : i)),
  };
  const p = planMaximumParagraph(moved);
  assert.ok(p.includes('$250'), p);
  assert.ok(p.includes('about 2 individual sessions'), p);
  assert.ok(p.includes('about 6 ('), p);
});

test('the coverage page carries the paragraph, the estimator in related, and the tool links back', () => {
  const res = readFileSync(join(ROOT, 'lib/resources-more2.ts'), 'utf8');
  assert.match(res, /body: \[planMaximumParagraph\(\)\]/);
  assert.match(res, /href: '\/tools\/therapy-cost-bc'/);
  const tools = readFileSync(join(ROOT, 'lib/tools.ts'), 'utf8');
  assert.match(tools, /href: '\/resources\/does-my-plan-cover-counselling-bc'/);
});

/* ---- 114: HSA and METC ------------------------------------------------- */

test('no page says an HSA or the tax credit covers RCC fees in BC unconditionally', () => {
  const files = ['lib/audiences-more4.ts', 'lib/resources-more.ts', 'lib/audiences-more3.ts', 'lib/resources-more2.ts', 'lib/resources.ts', 'lib/expansion-more.ts', 'lib/faq.ts'];
  const banned = [
    /which counselling by a registered counsellor does/i,
    /which counselling by an RCC is/i,
    /qualify as a medical expense on the federal return for BC residents/i,
    /HSA usually covers counselling/i,
    /counselling is generally an eligible expense/i,
    /health-spending accounts many companies layer on, commonly reimburse/i,
  ];
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const re of banned) assert.doesNotMatch(src, re, `${f} still says ${re}`);
  }
  assert.match(readFileSync(join(ROOT, 'lib/resources-more2.ts'), 'utf8'), /authorized-medical-practitioners-purposes-medical-expense-tax-credit/, 'CRA page not cited');
});

/* ---- 132: Gottman-trained ---------------------------------------------- */

test('"Gottman-trained" is allowed only in a roster entry that records it', () => {
  const roster = [
    "  {",
    "    slug: 'aman-bains-dhillon',",
    "    focus: 'Gottman-trained.',",
    "  },",
    "  {",
    "    slug: 'someone-else',",
    "    focus: 'Gottman-trained.',",
    "  },",
    "  {",
    "    slug: 'confirmed',",
    "    gottmanTraining: 'Level 2',",
    "    focus: 'Gottman trained.',",
    "  },",
  ].join('\n');
  const hits = claimsIn('lib/practitioners.ts', roster, true);
  assert.deepEqual(hits.map((h: { line: number }) => h.line), [7]);
  assert.equal(claimsIn('lib/locations.ts', 'This practice is EMDR- and Gottman-trained.').length, 1);
  assert.equal(claimsIn('lib/locations.ts', 'Couples work is Gottman-informed.').length, 0);
});

test('the site makes no unconfirmed Gottman-trained claim', () => {
  assert.deepEqual(scanGottmanClaims(ROOT), []);
  assert.match(readFileSync(join(ROOT, 'lib/services.ts'), 'utf8'), /metaTitle: "Gottman-Informed Couples/);
});

/* ---- 169: "most BC plans reimburse" ------------------------------------ */

test('the coverage gate catches the overclaim and passes the plan-dependent form', () => {
  assert.equal(coverageClaims('Most BC extended health plans reimburse RCC sessions.').length, 1);
  assert.equal(coverageClaims('Most BC plans that cover RCCs reimburse, including:').length, 1);
  assert.equal(coverageClaims('an RCC cannot diagnose and most plans cover both').length, 1);
  assert.equal(coverageClaims('Most BC extended health plans that cover RCCs will reimburse').length, 1);
  assert.equal(coverageClaims('Many extended health plans reimburse an RCC, depending on the plan; check yours.').length, 0);
  assert.equal(coverageClaims('Most plans have a deadline, frequently 90 days').length, 0);
  assert.equal(coverageClaims('the designation most plans name').length, 0);
});

test('nothing outside the pending list says most plans reimburse', () => {
  const { problems } = scanCoverageClaims(ROOT);
  assert.deepEqual(problems, []);
});

/* ---- 133 + 188: the machine files -------------------------------------- */

test('the funding block follows the one ICBC flag and never claims direct billing', () => {
  const off = fundingBlock(false, abs);
  assert.equal(off.direct_billing, false);
  assert.equal(off.icbc_vendor, false);
  assert.match(off.icbc, /not currently registered with ICBC and does not direct-bill/);
  assert.match(off.direct_billing_note, /Pacific Blue Cross/);
  assert.doesNotMatch(JSON.stringify(off), /\$\d/, 'a fee in the machine file');
  assert.match(fundingBlock(true, abs).icbc, /is registered with ICBC/);
});

test('each language lists only the accepting counsellors who work in it', () => {
  const taking = [
    { slug: 'a', name: 'A', languages: [{ tag: 'en-CA' }, { tag: 'tl' }] },
    { slug: 'b', name: 'B', languages: [{ tag: 'en-CA' }, { tag: 'pa' }] },
  ];
  const out = languageEntries(
    [{ tag: 'en-CA', name: 'English' }, { tag: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }, { tag: 'tl', name: 'Tagalog' }, { tag: 'fr', name: 'French' }],
    taking,
    { 'en-CA': { service: '/services', inLanguage: null }, pa: { service: '/services/punjabi-counselling', inLanguage: '/punjabi' }, tl: { service: '/services/tagalog-counselling', inLanguage: null } },
    abs,
    (s) => `/book?with=${s}`,
  );
  assert.deepEqual(out.map((l) => l.tag), ['en-CA', 'pa', 'tl'], 'a language nobody speaks is dropped');
  assert.deepEqual(out[0].counsellors.map((c) => c.name), ['A', 'B']);
  assert.deepEqual(out[1].counsellors.map((c) => c.name), ['B']);
  assert.equal(out[1].in_language_page, abs('/punjabi'));
  assert.equal(out[1].counsellors[0].booking_url, abs('/book?with=b'));
  assert.equal(out[2].in_language_page, null);
});

test('concerns come from the city pairs, once each, with their city pages', () => {
  const out = concernsFromPairs(
    [{ city: 'x', service: 'anxiety-counselling' }, { city: 'y', service: 'anxiety-counselling' }, { city: 'x', service: 'gone' }],
    (s) => (s === 'anxiety-counselling' ? { name: 'Anxiety Counselling', bookingService: 'individual-therapy' } : undefined),
    abs,
  );
  assert.equal(out.length, 1);
  assert.equal(out[0].through_service, abs('/services/individual-therapy'));
  assert.deepEqual(out[0].city_pages, [abs('/online-counselling/x/anxiety-counselling'), abs('/online-counselling/y/anxiety-counselling')]);
});

test('llms.txt lists what the sitemap has and it does not, never the founder', () => {
  const O = 'https://example.test';
  const xml = `<urlset><url><loc>${O}/refer</loc></url><url><loc>${O}/refer/doctor</loc><image:image><image:loc>${O}/img/a.png</image:loc></image:image></url><url><loc>${O}/practitioners/aman-bains-dhillon</loc></url><url><loc>${O}/punjabi</loc></url></urlset>`;
  const urls = sitemapUrls(xml, O);
  assert.deepEqual(urls, [`${O}/refer`, `${O}/refer/doctor`, `${O}/practitioners/aman-bains-dhillon`, `${O}/punjabi`]);
  const body = `- [Refer](${O}/refer): text`;
  assert.deepEqual(missingUrls(urls, body), [`${O}/refer/doctor`, `${O}/punjabi`]);
});

test('llms.txt reads its page count from the sitemap, not a typed number', () => {
  const src = readFileSync(join(ROOT, 'app/llms.txt/route.ts'), 'utf8');
  assert.doesNotMatch(src, /\$\{'295'\}/);
  assert.match(src, /allUrls\.length/);
  assert.doesNotMatch(src, /the counsellor's training/);
});

/* ---- 191: how to cancel ------------------------------------------------ */

test('the cancel procedure matches the emails: reply, no phone, nothing to lose on the consult', () => {
  assert.match(HOW_TO_CANCEL, /reply to your confirmation or reminder email/);
  assert.match(HOW_TO_CANCEL, /No phone call and no reason/);
  assert.match(HOW_TO_CANCEL, /free consultation carries no fee/);
  assert.doesNotMatch(HOW_TO_CANCEL, /link|portal/i, 'Cliniko disables self-cancel for paid-in-full sessions');
  const pricing = readFileSync(join(ROOT, 'app/pricing/page.tsx'), 'utf8');
  assert.equal((pricing.match(/HOW_TO_CANCEL/g) ?? []).length, 3, 'import, card and FAQPage answer');
});

/* ---- 137 + 170: /pricing ----------------------------------------------- */

test('/pricing renders its first-screen prices from the catalogue and sources the psychologist rate', () => {
  const src = readFileSync(join(ROOT, 'app/pricing/page.tsx'), 'utf8');
  assert.match(src, /className="price-glance"/);
  assert.match(src, /money\(item\.cents\)\} · \$\{item\.minutes\} min/);
  assert.doesNotMatch(src, /close to double, because/);
  /* The BCPA source moved to lib/fee-guides.ts on 1 Oct 2026; the page links it from there. */
  assert.match(src, /BCPA_PSYCHOLOGIST\.sourceUrl/);
  assert.match(readFileSync(join(ROOT, 'lib/fee-guides.ts'), 'utf8'), /psychologists\.bc\.ca/);
  assert.match(src, /style=\{GLANCE\.list\}/, 'styles inline, not in the global stylesheet');
});
