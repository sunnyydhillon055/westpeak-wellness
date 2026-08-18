#!/usr/bin/env node
/**
 * CITY VISIBILITY SCORE — every city Westpeak has a page for, out of 1,000.
 *
 * WHY THIS IS A SCRIPT AND NOT A DOCUMENT
 *
 * The August 17 competitive audit scored the whole site and was hand-assembled,
 * which means it cannot be re-run to see whether anything moved. This one takes
 * its structural inputs from the built HTML (npm run build first) and its SERP
 * inputs from a dated block below, so re-running it after a change tells you
 * what actually shifted rather than what you remember.
 *
 * HOW THE 1,000 IS SPLIT, AND WHY
 *
 *   A  Search presence        350   the only band that produces clients
 *   B  Off-site / entity      200   directories, citations, register
 *   C  Page substance         200   depth, sourcing, local specificity
 *   D  Internal authority     130   in-body inbound links, click depth
 *   E  Technical readiness     70   titles, schema, sitemap, prerender
 *   F  Cluster coverage        50   how many angles on the city are covered
 *
 * A and B are 55% of the score on purpose. The site's problem has never been
 * how the pages are built — the August 17 audit put it first of six on every
 * on-site category and last of six on every off-site one. A rubric that
 * weighted craft would score this practice highly and be useless.
 *
 * WHAT THIS SCORE IS NOT
 *
 * It is not a Google rank. The SERP block is measured with the search tool
 * available here, which has its own index and is not Google. Two things follow:
 * absence here is strong evidence of thin indexation but not proof of absence
 * from Google, and the one check that settles it is Search Console coverage.
 * Every number below that came from a search is dated and marked `measured`.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const BUILT = join(ROOT, '.next', 'server', 'app');

/* ────────────────────────────────────────────────────────────────────────────
 * MEASURED SERP + OFF-SITE INPUTS.  Dated, because they decay.
 *
 * Queries run 18 Aug 2026. For each city: the primary money query, plus the
 * Punjabi query where the city has a Punjabi page. `found` is the position of
 * any westpeakwellness.com URL, or null for absent.
 *
 * `siteRestricted` is the sharper test: the same city term with results
 * restricted to westpeakwellness.com. That removes every competitor, so a page
 * that still does not come back is not losing a ranking contest — it is not
 * retrievable at all.
 * ──────────────────────────────────────────────────────────────────────────── */
const MEASURED = {
  date: '2026-08-18',
  serp: {
    abbotsford:      { primary: null, punjabi: null, siteRestricted: false },
    kelowna:         { primary: null, punjabi: null, siteRestricted: false },
    'prince-george': { primary: null, punjabi: null, siteRestricted: false },
    surrey:          { primary: null, punjabi: null, siteRestricted: false },
    vancouver:       { primary: null, punjabi: null, siteRestricted: false },
    victoria:        { primary: null, punjabi: null, siteRestricted: false },
    kamloops:        { primary: null, punjabi: null, siteRestricted: false },
  },
  /* Third-party surfaces that name the practice AND the city. Counted per city
     because a Vancouver directory profile does nothing for Kamloops. */
  directoryProfiles: {
    abbotsford: 0, kelowna: 0, 'prince-george': 0,
    surrey: 0, vancouver: 0, victoria: 0, kamloops: 0,
  },
  /* Any third-party page associating the practice with that city specifically.
     Surrey only: the site's own homepage <title> reads "… | Surrey", the BCACC
     register entry is Surrey-based, and the TikTok account resolves to Surrey.
     Nothing anywhere ties the practice to the other six. */
  cityCitations: {
    surrey: 1,
    abbotsford: 0, kelowna: 0, 'prince-george': 0,
    vancouver: 0, victoria: 0, kamloops: 0,
  },
  /* BCACC register profile — province-wide, ranks first on the brand query.
     It is the single strongest off-site asset and it applies to every city. */
  registerProfile: true,
};

/* The cities. Which clusters each one has a page in is NOT hard-coded — it is
 * read from the build further down, because hard-coding it is a bug waiting to
 * happen and did in fact happen: the first run after four new pages shipped
 * still scored Vancouver and Abbotsford as having no Punjabi page and Kamloops
 * as having no city page, and quietly docked all three. A scoring script whose
 * inputs drift from the repository reports the past. */
const CITIES = {
  surrey:          { name: 'Surrey',        region: 'Lower Mainland' },
  vancouver:       { name: 'Vancouver',     region: 'Lower Mainland' },
  abbotsford:      { name: 'Abbotsford',    region: 'Fraser Valley' },
  victoria:        { name: 'Victoria',      region: 'Vancouver Island' },
  kelowna:         { name: 'Kelowna',       region: 'Okanagan' },
  'prince-george': { name: 'Prince George', region: 'Northern BC' },
  kamloops:        { name: 'Kamloops',      region: 'Thompson-Nicola' },
};

/* Judged inputs, stated openly so they can be argued with rather than buried.
 *
 * hardStat — does the page rest on a checkable number specific to THIS city,
 * as opposed to a fair characterisation? This is the sharpest quality split in
 * the set and it does not fall where you would expect: the Punjabi cluster is
 * 4 for 4, the online-counselling cluster is 1 for 6.
 *
 * distinctArgument — would this page survive a resident reading it, or could
 * the city name be swapped without the text becoming false? */
const JUDGED = {
  surrey:          { hardStat: true,  distinctArgument: true,  note: '128,305 mother-tongue speakers (2021 census), on the Punjabi page.' },
  vancouver:       { hardStat: true,  distinctArgument: true,  note: 'Now sourced twice: $3,170 average asking 2-bed rent, highest in Canada (StatCan Q1 2025), and 13,305 Punjabi mother tongue — fifth in the city.' },
  abbotsford:      { hardStat: true,  distinctArgument: true,  note: 'Now sourced: Punjabi mother tongue of 34,280 people, 22.6% of the city (2021 census, City of Abbotsford).' },
  victoria:        { hardStat: true,  distinctArgument: true,  note: 'JUDGEMENT CALL, STATED OPENLY: Victoria\'s anchor is a verifiable SERVICE fact — Island Health CARES, same-day walk-in counselling at 1119 Pembroke — not a statistic. It is checkable and city-specific, which is what this band is for, but somebody could reasonably score it 0. No Punjabi page: the CRD census figure could not be sourced.' },
  kelowna:         { hardStat: true,  distinctArgument: true,  note: 'Punjabi speakers 1.2% → 1.8%, 2016–2021.' },
  'prince-george': { hardStat: true,  distinctArgument: true,  note: 'The best-evidenced city in the set — CMHA 103 clients / 519 appointments / 30 waiting.' },
  kamloops:        { hardStat: true,  distinctArgument: true,  note: '4,260 South Asian residents, largest racialized group. City page added 2026-08-18 and argues the hub problem, not scarcity.' },
};

/* ── structural inputs, read from the build ──────────────────────────────── */
const strip = (h) => h.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
const mainOf = (h) => (strip(h).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
const wordsIn = (f) => f.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').split(/\s+/).filter(Boolean).length;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(BUILT)) {
  console.error('No .next build found. Run `npm run build` first — this script reads rendered HTML, not source.');
  process.exit(1);
}

const files = walk(BUILT);
const pages = new Map();   // url -> { html, body }
for (const f of files) {
  let url = '/' + relative(BUILT, f).replace(/\\/g, '/').replace(/\.html$/, '');
  if (url === '/index') url = '/';
  const html = readFileSync(f, 'utf8');
  pages.set(url, { html, body: mainOf(html) });
}

/* inbound in-body links */
const inbound = new Map();
const addLink = (target, src) => {
  const t = target.replace(/\/$/, '') || '/';
  if (t === src) return;
  if (!inbound.has(t)) inbound.set(t, new Set());
  inbound.get(t).add(src);
};
for (const [src, { body }] of pages) {
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) addLink(m[1], src);
}

/* ON-DEMAND ROUTES ARE INVISIBLE TO THE CRAWL ABOVE, AND ONE OF THEM MATTERS.
 *
 * Anything that reads searchParams or cookies is rendered per-request, so it
 * leaves no .html in .next/server/app and its outgoing links do not appear in
 * the map. The first version of this script therefore reported the Punjabi
 * cluster as having no hub — when /punjabi links to all four region pages and
 * simply is not a static file. `npm run seo` prints exactly this warning, which
 * is how it was caught.
 *
 * Source is a weaker signal than rendered HTML (a literal href in a file that
 * never runs still counts here), so it supplements rather than replaces. */
const onDemand = [];
const appDir = join(ROOT, 'app');
function findRoutes(dir, seg = '') {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      if (e.startsWith('(') || e.startsWith('_')) findRoutes(p, seg);
      else if (!e.startsWith('[')) findRoutes(p, `${seg}/${e}`);
    } else if (e === 'page.tsx') {
      const url = seg || '/';
      if (!pages.has(url)) onDemand.push({ url, file: p });
    }
  }
}
findRoutes(appDir);
for (const { url, file } of onDemand) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/href="(\/[^"#?{]*)"/g)) addLink(m[1], url);
}

function pageFacts(url) {
  const p = pages.get(url);
  if (!p) return null;
  const title = (p.html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1];
  const desc = (p.html.match(/<meta name="description" content="([\s\S]*?)"/i) || [, ''])[1];
  /* @type is emitted BOTH as a scalar ("@type":"FAQPage") and as an array
     ("@type":["MedicalBusiness","ProfessionalService"]). A scalar-only regex
     silently scores every page as having no LocalBusiness schema, which is what
     the first run of this script did — it reported 40/70 technical across the
     board and the uniformity is what gave it away. */
  const schema = [...p.html.matchAll(/"@type":\s*(\[[^\]]*\]|"[A-Za-z]+")/g)]
    .flatMap((m) => m[1].match(/[A-Za-z]+/g) || []);
  /* Off-domain citations inside <main> — the sources block. */
  const cites = new Set([...p.body.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]));
  const links = inbound.get(url) || new Set();
  const external = [...links].filter(
    (s) => !s.startsWith('/online-counselling') && !s.startsWith('/punjabi-counselling')
  );
  const faqs = (p.body.match(/<summary|itemprop="acceptedAnswer"|class="faq-q/gi) || []).length;
  return {
    url,
    words: wordsIn(p.body),
    titleLen: title.length,
    descLen: desc.length,
    hasFaqSchema: schema.includes('FAQPage'),
    hasLocalSchema: schema.some((s) => ['MedicalBusiness', 'ProfessionalService', 'LocalBusiness'].includes(s)),
    inboundTotal: links.size,
    inboundExternal: external.length,
    externalSources: external,
    faqs,
    cites: cites.size,
  };
}

/* sitemap membership */
/* The sitemap is a route handler at app/sitemap.xml/route.ts, not app/sitemap.ts.
   Checking the wrong path returns false and quietly docks every city 10 points. */
const smCandidates = [
  join(ROOT, 'app', 'sitemap.xml', 'route.ts'),
  join(ROOT, 'app', 'sitemap.ts'),
];
const smPath = smCandidates.find((p) => existsSync(p));
const sitemapCoversCities =
  !!smPath && /locations|punjabiRegions/.test(readFileSync(smPath, 'utf8'));

/* ── scoring ─────────────────────────────────────────────────────────────── */
const clamp = (v, max) => Math.max(0, Math.min(max, Math.round(v)));

function score(slug) {
  const j = JUDGED[slug];
  const m = MEASURED.serp[slug];

  /* Cluster membership comes from what actually built, not from a list. */
  const oc = pageFacts(`/online-counselling/${slug}`);
  const pc = pageFacts(`/punjabi-counselling/${slug}`);
  const c = { ...CITIES[slug], oc: !!oc, pc: !!pc };
  const owned = [oc, pc].filter(Boolean);
  if (!owned.length) return null;

  // A — search presence (350)
  const posScore = (p, max) => (p == null ? 0 : p <= 3 ? max : p <= 10 ? max * 0.6 : max * 0.2);
  const A =
    posScore(m.primary, 150) +
    posScore(m.punjabi, 100) +
    (m.siteRestricted ? 100 : 0);

  // B — off-site / entity (200)
  const B =
    clamp(MEASURED.directoryProfiles[slug] * 30, 90) +
    clamp(MEASURED.cityCitations[slug] * 30, 60) +
    (MEASURED.registerProfile ? 50 : 0);

  // C — page substance (200), on the city's strongest page
  const best = owned.reduce((a, b) => (b.words > a.words ? b : a));
  const C =
    clamp(((best.words - 600) / 700) * 40, 40) +            // depth
    clamp((best.faqs / 6) * 40, 40) +                        // questions answered on the page
    clamp((best.cites / 3) * 40, 40) +                       // off-domain citations in <main>
    (j.hardStat ? 50 : 0) +                                  // checkable figure specific to this city
    (j.distinctArgument ? 30 : 0);                           // survives a resident reading it

  // D — internal authority (130)
  const inTotal = owned.reduce((n, p) => n + p.inboundTotal, 0);
  const inExt = owned.reduce((n, p) => n + p.inboundExternal, 0);
  const D = clamp((inTotal / 12) * 60, 60) + clamp((inExt / 5) * 50, 50) + (c.oc ? 20 : 10);

  // E — technical readiness (70)
  const techOk = (p) =>
    (p.titleLen > 0 && p.titleLen <= 60 ? 15 : 0) +
    (p.descLen > 0 && p.descLen <= 158 ? 15 : 0) +
    (p.hasFaqSchema && p.hasLocalSchema ? 20 : 0) +
    (sitemapCoversCities ? 10 : 0) +
    10; // statically prerendered — it is in .next/server/app as HTML
  const E = Math.round(owned.reduce((n, p) => n + techOk(p), 0) / owned.length);

  // F — cluster coverage (50)
  const F = (c.oc && c.pc ? 30 : 15) + (inExt >= 2 ? 20 : inExt === 1 ? 10 : 0);

  const total = Math.round(A + B + C + D + E + F);
  return { slug, ...c, A: Math.round(A), B: Math.round(B), C: Math.round(C), D: Math.round(D), E, F, total, oc, pc, note: j.note };
}

const results = Object.keys(CITIES).map(score).filter(Boolean).sort((a, b) => b.total - a.total);

const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);

console.log(`\nCITY VISIBILITY SCORE — westpeakwellness.com — SERP measured ${MEASURED.date}\n`);
const HDR = pad('#', 3) + pad('City', 15) + pad('Region', 18) +
  lpad('Search', 9) + lpad('Offsite', 9) + lpad('Page', 9) + lpad('Links', 9) +
  lpad('Tech', 8) + lpad('Cover', 8) + lpad('TOTAL', 11);
console.log(HDR);
console.log('-'.repeat(HDR.length));
results.forEach((r, i) => {
  console.log(
    pad(i + 1, 3) + pad(r.name, 15) + pad(r.region, 18) +
    lpad(`${r.A}/350`, 9) + lpad(`${r.B}/200`, 9) + lpad(`${r.C}/200`, 9) +
    lpad(`${r.D}/130`, 9) + lpad(`${r.E}/70`, 8) + lpad(`${r.F}/50`, 8) +
    lpad(`${r.total}/1000`, 11)
  );
});

const mean = Math.round(results.reduce((n, r) => n + r.total, 0) / results.length);
console.log('-'.repeat(HDR.length));
console.log(pad('', 36) + lpad('mean', 44) + lpad(`${mean}/1000`, 11) + '\n');

console.log('PAGE-LEVEL STRUCTURE\n');
const PH = pad('url', 38) + lpad('words', 7) + lpad('inbound', 9) + lpad('ext', 6) +
  lpad('cites', 7) + lpad('faqs', 6) + lpad('title', 7) + lpad('desc', 6);
console.log(PH);
console.log('-'.repeat(PH.length));
for (const r of results) {
  for (const p of [r.oc, r.pc].filter(Boolean)) {
    console.log(pad(p.url, 38) + lpad(p.words, 7) + lpad(p.inboundTotal, 9) +
      lpad(p.inboundExternal, 6) + lpad(p.cites, 7) + lpad(p.faqs, 6) +
      lpad(p.titleLen, 7) + lpad(p.descLen, 6));
  }
}

console.log('\nWHERE THE SCORE IS LOST\n');
const lost = [
  ['Search presence', 350 - Math.round(results.reduce((n, r) => n + r.A, 0) / results.length)],
  ['Off-site / entity', 200 - Math.round(results.reduce((n, r) => n + r.B, 0) / results.length)],
  ['Page substance', 200 - Math.round(results.reduce((n, r) => n + r.C, 0) / results.length)],
  ['Internal authority', 130 - Math.round(results.reduce((n, r) => n + r.D, 0) / results.length)],
  ['Technical readiness', 70 - Math.round(results.reduce((n, r) => n + r.E, 0) / results.length)],
  ['Cluster coverage', 50 - Math.round(results.reduce((n, r) => n + r.F, 0) / results.length)],
].sort((a, b) => b[1] - a[1]);
for (const [band, gap] of lost) console.log(`  ${pad(band, 22)} ${lpad(gap, 4)} points forgone per city on average`);

console.log('\nPER-CITY NOTE\n');
for (const r of results) console.log(`  ${pad(r.name, 15)} ${r.note}`);
console.log();

/* ────────────────────────────────────────────────────────────────────────────
 * `--plan` — WHAT THE PLAN IS ACTUALLY WORTH, PHASE BY PHASE.
 *
 * A plan that says "this will raise your score" and does not show the
 * arithmetic is a wish. Every phase below re-runs the real scoring formulas
 * against the structural state that phase would produce, so the projected
 * numbers are computed rather than asserted, and a phase that turns out to be
 * worth less than it costs is visible before anyone starts.
 *
 * Phase 3 and 4 depend on search results, which nobody controls. They are
 * modelled as scenarios and labelled as such — not promised.
 * ──────────────────────────────────────────────────────────────────────────── */
if (process.argv.includes('--plan')) {
  const PHASES = [
    { key: 'now',  label: 'Today',                     desc: 'as measured' },
    { key: 'p1',   label: 'Phase 1 · on-site',         desc: 'links, hub, 4 pages, figures, FAQs — no owner needed' },
    { key: 'p2',   label: 'Phase 2 · directories',     desc: '+ 3 directory profiles listing all 7 cities (owner)' },
    { key: 'p3',   label: 'Phase 3 · retrievable',     desc: '+ pages actually returning in a site-restricted search' },
    { key: 'p4',   label: 'Phase 4 · top-10',          desc: 'scenario: page-one for the city query' },
    { key: 'p4b',  label: 'Ceiling · top-3',           desc: 'scenario: top-three for both queries' },
  ];

  /* Target structural state per phase. Phase 1 is the on-site build: every city
     page carries a sourced local figure, six answered questions, three or more
     citations, 1,300+ words, and sits on 12+ inbound links of which 5+ come from
     outside the city clusters — plus the missing cluster page in four cities. */
  const target = (slug, phase) => {
    const c = CITIES[slug];
    const built = phase !== 'now';
    return {
      words: built ? 1300 : null,
      faqs: built ? 6 : null,
      cites: built ? 3 : null,
      hardStat: built ? true : JUDGED[slug].hardStat,
      inTotal: built ? 12 : null,
      inExt: built ? 5 : null,
      bothClusters: built ? true : (c.oc && c.pc),
      hasCity: built ? true : c.oc,
      dirs: ['p2', 'p3', 'p4', 'p4b'].includes(phase) ? 3 : MEASURED.directoryProfiles[slug],
      retrievable: ['p3', 'p4', 'p4b'].includes(phase),
      primary: phase === 'p4' ? 8 : phase === 'p4b' ? 2 : null,
      punjabi: (phase === 'p4' ? 8 : phase === 'p4b' ? 2 : null),
    };
  };

  const project = (slug, phase) => {
    const t = target(slug, phase);
    const r = results.find((x) => x.slug === slug);
    const owned = [r.oc, r.pc].filter(Boolean);
    const best = owned.reduce((a, b) => (b.words > a.words ? b : a));

    const posScore = (p, max) => (p == null ? 0 : p <= 3 ? max : p <= 10 ? max * 0.6 : max * 0.2);
    const A = posScore(t.primary, 150) + posScore(t.punjabi, 100) + (t.retrievable ? 100 : 0);
    const B = clamp(t.dirs * 30, 90) + clamp(MEASURED.cityCitations[slug] * 30, 60) + 50;
    const C =
      clamp((((t.words ?? best.words) - 600) / 700) * 40, 40) +
      clamp(((t.faqs ?? best.faqs) / 6) * 40, 40) +
      clamp(((t.cites ?? best.cites) / 3) * 40, 40) +
      (t.hardStat ? 50 : 0) + (JUDGED[slug].distinctArgument ? 30 : 0);
    const inTotal = t.inTotal ?? owned.reduce((n, p) => n + p.inboundTotal, 0);
    const inExt = t.inExt ?? owned.reduce((n, p) => n + p.inboundExternal, 0);
    const D = clamp((inTotal / 12) * 60, 60) + clamp((inExt / 5) * 50, 50) + (t.hasCity ? 20 : 10);
    const E = 70;
    const F = (t.bothClusters ? 30 : 15) + (inExt >= 2 ? 20 : inExt === 1 ? 10 : 0);
    return Math.round(A + B + C + D + E + F);
  };

  console.log('PROJECTED SCORE BY PHASE\n');
  const PH = pad('City', 15) + PHASES.map((p) => lpad(p.label.split(' · ')[0], 12)).join('');
  console.log(PH);
  console.log('-'.repeat(PH.length));
  for (const r of results) {
    console.log(pad(r.name, 15) + PHASES.map((p) => lpad(project(r.slug, p.key), 12)).join(''));
  }
  console.log('-'.repeat(PH.length));
  console.log(pad('mean', 15) + PHASES.map((p) =>
    lpad(Math.round(results.reduce((n, r) => n + project(r.slug, p.key), 0) / results.length), 12)
  ).join(''));

  console.log('\nWHAT EACH PHASE IS\n');
  for (const p of PHASES) console.log(`  ${pad(p.label, 26)} ${p.desc}`);
  console.log('\n  Phases 4 and the ceiling are SCENARIOS, not forecasts. Nobody controls');
  console.log('  search results. Phases 1 and 2 are deterministic — they are work.\n');
}
