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

/* ==== Round 4, 1 Oct 2026: items 258, 263, 264, 268, 269, 274, 275, 298 ==== */

import { readdirSync, statSync } from 'node:fs';
import { getResource, citationFor, LINKABLE_SLUGS, resources } from '../lib/resources.ts';
import { ONLINE_COVERAGE } from '../lib/practice-facts.ts';
import { findPunjabiTherapistAnswer, punjabiCounsellorNames } from '../lib/resources-more3.ts';
import { practitioners } from '../lib/practitioners.ts';
import { getGuide } from '../lib/guides.ts';
import { RCC_PLAIN } from '../lib/site.ts';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { ROOTS as COVERAGE_ROOTS } from '../scripts/coverage-claims.mjs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { ROOTS as GOTTMAN_ROOTS } from '../scripts/lib/gottman-claims.mjs';

/* ---- 268: the gate reads JSX across line breaks, and the new shapes ----- */

test('the coverage gate joins a phrase that JSX split over three lines, and reports it once', () => {
  const jsx = [
    '    <p className="hero-note hero-coverage">',
    "      Most BC{' '}",
    '      <Link href="/resources/does-my-plan-cover-counselling-bc">extended health plans</Link>{\' \'}',
    '      reimburse sessions with a Registered Clinical Counsellor; MSP does not.',
    '    </p>',
  ].join('\n');
  const hits = coverageClaims(jsx);
  assert.equal(hits.length, 1, JSON.stringify(hits));
  assert.equal(hits[0].line, 2);
  const fixed = jsx.replace("Most BC{' '}", "Many{' '}").replace('reimburse sessions', 'reimburse a Registered Clinical Counsellor, depending on the plan, so check yours;');
  assert.deepEqual(coverageClaims(fixed), []);
  /* Markdown wrapped over two lines, and inside a quote. */
  assert.equal(coverageClaims('> but most extended health\n> plans reimburse RCC sessions.').length, 1);
});

test('the coverage gate catches list, recognise, "Most, not all", trades plans and teachers', () => {
  for (const s of [
    'Most BC extended-health plans list one or both',
    'the body most BC extended-health plans recognise',
    'Issues receipts most extended plans recognise',
    'Most, not all: BC extended-health plans reimburse RCC counselling',
    'Most BC trades plans reimburse a Registered Clinical Counsellor',
    'Most BC teachers can put counselling here through their own benefits',
    'Most BC extended health plans do cover RCC sessions',
    'Most BC extended health plans listing RCCs.',
    'most BC extended health plans that list a Registered Clinical Counsellor do.',
  ]) assert.equal(coverageClaims(s).length, 1, s);
  for (const s of [
    'Many BC extended-health plans list one or both, depending on the plan',
    'the designation most plans name',
    'Most plans do not require one; a few do',
  ]) assert.equal(coverageClaims(s).length, 0, s);
});

test('CoverageLine says what /pricing says', () => {
  const src = readFileSync(join(ROOT, 'components/CoverageLine.tsx'), 'utf8');
  assert.match(src, /Many\{' '\}/);
  assert.match(src, /depending on the plan, so check yours/);
  assert.equal(coverageClaims(src).length, 0);
});

/* ---- 258: the off-site copy ------------------------------------------- */

const offsite = (): string[] => {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(md|html)$/.test(e)) out.push(p);
    }
  };
  walk(join(ROOT, 'docs'));
  walk(join(ROOT, 'kits'));
  return out;
};

test('the claims gates scan docs/, kits/ and the August outreach kit', () => {
  for (const roots of [COVERAGE_ROOTS, GOTTMAN_ROOTS]) {
    for (const r of ['lib', 'app', 'components', 'docs', 'kits', 'OUTREACH_KIT_2026-08-28.md']) assert.ok(roots.includes(r), r);
  }
});

test('nothing in docs/ or kits/ carries a retired claim', () => {
  const banned = [/Gottman/i, /\$170\b/, /20111/, /Master's research/i, /most extended health/i, /within days/i, /\b15[- ]minute consult/i];
  for (const f of offsite()) {
    const src = readFileSync(f, 'utf8');
    for (const re of banned) assert.doesNotMatch(src, re, `${f}: ${re}`);
  }
});

test('nothing in docs/ or kits/ promises evenings, weekends or a wait', () => {
  /* Body copy, not just metadata: these files are pasted into listings. A
     client's own question ("whether evenings exist") is not a promise. */
  const PROMISE = /\bevening (?:availability|times?|sessions?|appointments?)\b|\bevenings? and weekdays?\b|\bweekend (?:availability|times?|sessions?|appointments?)\b|\bavailable (?:in the )?(?:evenings?|weekends?)\b|\busually within days\b/i;
  for (const f of [...offsite(), join(ROOT, 'OUTREACH_KIT_2026-08-28.md')]) {
    const src = readFileSync(f, 'utf8').replace(/^> \*\*SUPERSEDED[\s\S]*?\n\n/m, '');
    assert.doesNotMatch(src, PROMISE, f);
  }
  assert.match('Evening and weekday times both exist', PROMISE);
});

test('the superseded kits say so at the top, and the NAP block names no practitioner', () => {
  for (const f of ['KIT-1-google-business-profile.md', 'KIT-2-bcacc-listing.md', 'KIT-3-psychology-today.md', 'KIT-4-6-8-directories-and-outreach.md', 'KIT-7-reindex.md', 'KIT-9-funded-referral-networks.md']) {
    assert.match(readFileSync(join(ROOT, 'kits', f), 'utf8').slice(0, 600), /SUPERSEDED, 1 October 2026/, f);
  }
  assert.match(readFileSync(join(ROOT, 'OUTREACH_KIT_2026-08-28.md'), 'utf8').slice(0, 600), /SUPERSEDED, 1 October 2026/);
  const readme = readFileSync(join(ROOT, 'kits/README.md'), 'utf8');
  const nap = readme.slice(readme.indexOf('```'), readme.indexOf('```', readme.indexOf('```') + 3));
  assert.match(nap, /Languages:\s+English, Punjabi, Tagalog/);
  assert.doesNotMatch(nap, /Practitioner:/);
});

test('the standing press bio names the accepting roster, no founder and no registration number', () => {
  const readme = readFileSync(join(ROOT, 'kits/README.md'), 'utf8');
  const bio = readme.slice(readme.indexOf('## Standing press bio'));
  for (const p of practitioners) {
    if (p.acceptingNewClients) assert.ok(bio.includes(p.name), p.name);
    else assert.ok(!bio.includes(p.name), `${p.name} is not accepting`);
    for (const c of p.credentials) if ('number' in c && c.number) assert.ok(!bio.includes(String(c.number)), 'registration number in the bio');
  }
});

/* ---- 263: the work-and-leave guides ----------------------------------- */

test('the leave guides drop the invented figures, the treatment rule and the after-work line', () => {
  const src = readFileSync(join(ROOT, 'lib/guides-more7.ts'), 'utf8');
  for (const re of [/one in five/, /The 40%/, /neither can most psychologists/, /assumes you are under care/, /expects you to be doing something/, /lunch hour/, /end of the day/, /review date, and\. The step/]) {
    assert.doesNotMatch(src, re, String(re));
  }
  const note = getGuide('doctors-note-for-a-mental-health-leave')!;
  const sick = note.faqs.find((f) => /psychologist write a sick note/.test(f.q))!;
  assert.match(sick.a, /psychologist/);
  assert.match(sick.a, /Service Canada/);
  assert.match(sick.a, /letter confirming you are in treatment/, 'the counsellor-letter clause stays until R2 #156');
  const ei = getGuide('ei-sickness-benefits-and-therapy')!;
  assert.match(ei.faqs.find((f) => /keep my claim/.test(f.q))!.a, /biweekly reports/);
});

/* ---- 264: both names for the leave ------------------------------------ */

test('the stress-leave hub carries "mental health leave" in its title and a heading', () => {
  const g = getGuide('stress-leave-bc')!;
  assert.equal(g.metaTitle, 'Stress or Mental Health Leave in BC: How to Apply, Paid?');
  assert.ok(g.metaTitle.length <= 60);
  assert.equal(g.sections[1].h2, 'Mental health leave in BC: the same leave as stress leave');
  assert.match(g.sections[1].body![0], /no separate "mental health leave"/);
  assert.match(g.sections[1].body![0], /five days/);
  assert.match(g.sections[1].body![0], /job-protected/);
  assert.ok(g.sections.some((s) => s.h2 === 'Is stress or mental health leave paid in BC? Sick days, EI, STD and LTD'));
});

/* ---- 269: the RCC page ------------------------------------------------- */

test('the RCC page opens with the definition and has one "not regulated" section', () => {
  const r = getResource('verify-a-counsellor-in-bc')!;
  assert.ok(r.shortAnswer.startsWith(`A Registered Clinical Counsellor (RCC) in BC is a counsellor with ${RCC_PLAIN}.`));
  assert.match(r.shortAnswer, /not a government licence; psychotherapy becomes regulated in BC on 29 November 2027/);
  const h2s = r.sections.map((s) => s.h2);
  assert.equal(h2s[1], 'Registered counsellor, clinical counsellor, licensed counsellor: what each title means in BC');
  assert.equal(h2s[0], 'What the letters actually certify');
  assert.ok(!h2s.includes('Why this is necessary in BC specifically'));
  assert.ok(!h2s.some((h) => /thirty-second orientation/.test(h)));
  const titles = r.sections[1].body!.join(' ');
  assert.match(titles, /almost always means an RCC/);
  assert.match(titles, /BC has no "licensed counsellor"/);
  const all = JSON.stringify(r);
  assert.equal((all.match(/not protected titles/g) ?? []).length, 1);
  assert.match(all, /29 November 2027/);
  const fac = r.faqs.find((f) => /Find a Counsellor tool/.test(f.q))!;
  assert.match(fac.a, /at bc-counsellors\.org/);
  assert.doesNotMatch(all, /\b\d{5}\b/, 'a registration number');
});

/* ---- 274: one answer on video coverage --------------------------------- */

test('online coverage is answered once, plan-dependent, wherever it is asked', () => {
  assert.match(ONLINE_COVERAGE, /depends on the plan/);
  assert.match(ONLINE_COVERAGE, /same maximum\?$/);
  for (const f of ['lib/guides.ts', 'lib/faq.ts', 'lib/punjabi-regions.ts', 'lib/resources.ts']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /Nearly all BC extended health plans|generally treat video sessions|Nearly always yes\. Insurers overwhelmingly|treat virtual sessions on the same terms as in-person ones/, f);
    assert.match(src, /ONLINE_COVERAGE/, f);
  }
  const page = getResource('does-my-plan-cover-counselling-bc')!;
  const sec = page.sections.find((s) => s.h2 === 'Is online counselling covered the same as in person?')!;
  assert.equal(sec.body![0], ONLINE_COVERAGE);
  assert.equal(page.faqs.find((f) => f.q === 'Is online counselling covered the same as in person?')!.a, ONLINE_COVERAGE);
  assert.ok(page.sections.some((s) => s.table?.rows.some((row) => /Virtual sessions/.test(row[0]))));
  for (const home of ['https://www.pac.bluecross.ca/', 'https://www.sunlife.ca/', 'https://www.manulife.ca/', 'https://www.canadalife.com/']) {
    assert.ok(!page.sources.some((s) => s.url === home), `${home} is a home page, not a source`);
  }
  assert.ok(page.sources.some((s) => /Direct Billing for Mental Health Providers in BC Starting July 11/.test(s.label)));
});

/* ---- 275: the linkable block ------------------------------------------ */

test('the four outreach pages are linkable and nothing else is', () => {
  const flagged = resources.filter((r) => r.linkable).map((r) => r.slug).sort();
  assert.deepEqual(flagged, [...LINKABLE_SLUGS].sort());
});

test('the citation line names the publisher, title, date and canonical URL', () => {
  const c = citationFor({ title: 'BC crisis directory', slug: 'bc-crisis-and-support-directory', updated: '2026-10-01' }, 'https://www.westpeakwellness.com');
  assert.equal(c, 'Westpeak Wellness, “BC crisis directory”, updated October 1, 2026. https://www.westpeakwellness.com/resources/bc-crisis-and-support-directory');
});

test('the resource template renders the block above Sources and the print rules exist', () => {
  const src = readFileSync(join(ROOT, 'app/resources/[slug]/page.tsx'), 'utf8');
  const block = src.indexOf('<h2 id="using-this-page">');
  assert.ok(block > 0 && block < src.indexOf('<h2 id="sources">'));
  for (const s of ['Free to link', 'reproduced', 'with attribution', 'Last updated', 'Spotted something out of date', 'citationFor(r, site.domain)']) assert.ok(src.includes(s), s);
  const css = readFileSync(join(ROOT, 'app/premium.css'), 'utf8');
  const tail = css.slice(css.indexOf('/* item 275: linkable resource print view'));
  assert.ok(tail.length > 0);
  assert.match(tail, /\.linkable-noprint \{ display: none !important; \}/);
  assert.match(tail, /\.linkable-print-url \{\s*display: block !important;/);
  assert.doesNotMatch(tail, /#[0-9a-f]{3,6}\b/i, 'a hex colour');
});

/* ---- 298: the seeker's question --------------------------------------- */

test('the language-access page answers "how do I find a Punjabi-speaking therapist", practice last', () => {
  const r = getResource('finding-a-counsellor-in-punjabi-or-tagalog-in-bc')!;
  assert.equal(r.metaTitle, 'How to Find a Punjabi or Tagalog-Speaking Counsellor in BC');
  assert.ok(r.metaTitle.length <= 60);
  assert.match(r.title, /for the person helping/);
  assert.equal(r.faqs[0].q, 'How do I find a Punjabi-speaking therapist in BC?');
  const a = r.faqs[0].a;
  const order = ['Find a Counsellor', 'RCC Register', 'DIVERSEcity', 'this practice'].map((s) => a.indexOf(s));
  assert.ok(order.every((i) => i >= 0) && order.every((i, k) => k === 0 || i > order[k - 1]), String(order));
  for (const n of punjabiCounsellorNames()) assert.ok(a.includes(n), n);
  assert.doesNotMatch(a, /\bAman\b/);
  assert.doesNotMatch(a, /[਀-੿]/, 'no Punjabi prose');
});

test('the Punjabi answer follows the roster: nobody accepting, nobody named', () => {
  const none = findPunjabiTherapistAnswer([]);
  assert.match(none, /when one is taking new clients/);
  const two = findPunjabiTherapistAnswer(['A', 'B']);
  assert.match(two, /A and B, Registered Clinical Counsellors who work/);
  assert.deepEqual(
    punjabiCounsellorNames([
      { name: 'X', acceptingNewClients: false, languages: [{ tag: 'pa', name: 'Punjabi', nativeName: '' }] },
      { name: 'Y', acceptingNewClients: true, languages: [{ tag: 'pa', name: 'Punjabi', nativeName: '' }] },
      { name: 'Z', acceptingNewClients: true, languages: [{ tag: 'tl', name: 'Tagalog', nativeName: '' }] },
    ]),
    ['Y'],
  );
});

test('the Punjabi service page FAQ asks the same question and links the resource', () => {
  const src = readFileSync(join(ROOT, 'lib/services.ts'), 'utf8');
  assert.match(src, /q: "How do I find a Punjabi-speaking counsellor in BC\?"[^\n]*\/resources\/finding-a-counsellor-in-punjabi-or-tagalog-in-bc/);
});
