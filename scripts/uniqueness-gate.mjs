#!/usr/bin/env node
/* DOES THE CITY x SERVICE MATRIX ACTUALLY SAY FIFTY DIFFERENT THINGS?
 *
 * WHY THIS EXISTS
 *
 * Content uniqueness is this site's highest-scoring measured category — 900 of
 * 1000, first of eleven practices — and it holds that position because the two
 * competitors running four-hundred-page programmatic clusters are obvious from
 * the first paragraph. Adding fifty city x service pages puts that at risk in
 * exactly the way those competitors got caught.
 *
 * lib/city-services.ts states the rule: every pair earns its own argument. This
 * script is what stops that being a comment somebody stops honouring. A rule
 * nothing checks decays on the first busy afternoon.
 *
 * WHAT IT MEASURES, AND WHY IT MEASURES THE RENDERED PAGE
 *
 * It reads the BUILT HTML, not the source data. Two pairs can hold completely
 * different `angle` and `body` values and still render 90% identically if the
 * shared service block dwarfs them — and the rendered page is what a crawler
 * judges. Checking the data would pass a page the crawler would fail.
 *
 * Three checks, each a different failure:
 *
 *   1. PAIRWISE SIMILARITY — shingled Jaccard over <main> text. Two pages
 *      above the threshold means the matrix is converging.
 *   2. UNIQUE SHARE — how much of each page is text that appears on no other
 *      page in the matrix. A page can be dissimilar to any ONE sibling while
 *      still being mostly boilerplate shared with all of them.
 *   3. TITLE AND DESCRIPTION COLLISIONS — exact duplicates, which are the
 *      cheapest possible signal that two pages are the same page.
 *
 * The RSC flight payload is stripped before comparison. It repeats across every
 * page in a route and would make fifty distinct pages look near-identical —
 * scanning raw HTML instead of <main> has produced false positives on this site
 * before.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SERVER = join(ROOT, '.next', 'server', 'app', 'online-counselling');

/* Tunable, and deliberately not tight. The point is to catch a template being
   introduced, not to police prose. A pair of pages about the same service in
   two cities SHOULD share their service section. */
const MAX_SIMILARITY = 0.62;   // above this, two pages are converging
/* 0.18 until 3 Oct 2026, when the city-service minimum sat exactly on it
   (chilliwack/depression). The service intro, "commonly used for" list and
   approach paragraph, identical on each service's twenty pages and 16.7% of
   all city-service text, were cut that day, and the floor rose with them. */
const MIN_UNIQUE_SHARE = 0.25; // below this, a page is mostly boilerplate
/* Two city-service descriptions sharing more than this share of the smaller
   one's word 4-grams are one description with the nouns swapped. */
const MAX_DESC_OVERLAP = 0.6;
/* The counsellor place pages keep the old floor. Their minimum was 24% on
   3 Oct 2026 and the cut that justified 0.25 for the matrix never touched
   them; they rise when their own shared blocks are cut. */
const PLACE_MIN_UNIQUE_SHARE = 0.18;
/* Pairwise ceilings for the families section 5 reads (3 Oct 2026). Measured
   maxima that day: /tl 49%, /pa 51%, Tagalog cities 36%, hubs 34%, Punjabi
   regions 25%. The /pa twins start at 52%, one point over the Nanaimo and
   Victoria pair, because their copy is lib/practitioner-places data this
   round does not own; 50% is the target, and TWIN_CEILING already holds the
   /tl twins to it. */
const TWIN_CEILING = 0.5;
const PA_TWIN_CEILING = 0.52;
const TAGALOG_CEILING = 0.4;
const HUB_CEILING = 0.4;
const PUNJABI_CEILING = 0.3;

if (!existsSync(SERVER)) {
  console.log('uniqueness-gate: no build found — run `npm run build` first. Skipping.');
  process.exit(0);
}

/** Recursively collect the built .html for every city/service page. */
function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collect(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/* <main> only. The flight payload and the shared header/footer are not content
   and counting them would drown the signal. */
function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = m ? m[1] : html;
  return scope
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Overlapping 8-word shingles — long enough that a shared stock phrase does
 *  not register, short enough that a lightly reworded paragraph still does. */
function shingles(text, n = 8) {
  const w = text.split(' ').filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
}

const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
};

/* ---- --gsc: THE CANDIDATES FOR THE ZERO-IMPRESSION RULE — 3 Oct 2026 ----
 *
 * Report only; it never fails. Nothing on the site joined the sitemap to the
 * Search Console exports, so "which pages has Google been shown for six weeks
 * and never once offered to anyone" was answered by hand, when it was
 * answered. This joins three things:
 *
 *   the built sitemap (.next/server/app/sitemap.xml.body), every URL;
 *   every data/gsc/*-pages*.csv export, impressions summed per URL;
 *   each page's first-commit date: the later of the day its route file was
 *     added under app/ and, for a page generated from data, the day its slug
 *     (or, for a city x service page, its pair) first appeared in lib/.
 *
 * and prints every page live LIVE_DAYS or more with no impressions in any
 * export, with its family and its nearest neighbour inside that family by
 * the same 8-word shingle Jaccard the gate uses. It decides nothing: noindex,
 * redirect or consolidation of an existing page needs its own rule and counts
 * (DECISIONS). A shallow clone has no history, so the dates and the list are
 * then reported as unavailable rather than guessed. */
const LIVE_DAYS = 42;

function gitOut(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

/* Each commit's date arrives on a line of its own, "DATE<tab>2026-10-03":
   a marker of "@" collided with the diff's own "@@" hunk headers. */
/** First-added date of every file under app/, keyed by repo path. */
function routeFileDates() {
  const out = new Map();
  let date = '';
  for (const line of gitOut(['log', '--reverse', '--diff-filter=A', '--name-only', '--format=DATE%x09%ad', '--date=short', '--', 'app']).split('\n')) {
    if (line.startsWith('DATE\t')) date = line.slice(5);
    else if (line.trim() && !out.has(line.trim())) out.set(line.trim(), date);
  }
  return out;
}

/** First date each slug, and each city x service pair, was added in lib/. */
function slugDates() {
  const slugs = new Map();
  const pairs = new Map();
  let date = '';
  const SLUG = /slug:\s*['"]([a-z0-9-]+)['"]/g;
  const PAIR = /city:\s*'([a-z-]+)',\s*service:\s*'([a-z-]+)'/g;
  for (const line of gitOut(['log', '--reverse', '--format=DATE%x09%ad', '--date=short', '-p', '-U0', '--', 'lib']).split('\n')) {
    if (line.startsWith('DATE\t')) { date = line.slice(5); continue; }
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    for (const m of line.matchAll(SLUG)) if (!slugs.has(m[1])) slugs.set(m[1], date);
    for (const m of line.matchAll(PAIR)) { const k = `${m[1]}/${m[2]}`; if (!pairs.has(k)) pairs.set(k, date); }
  }
  return { slugs, pairs };
}

/** The app/ page file that serves `segments`, with the dynamic values it bound. */
function routeFor(segments) {
  let dir = join(ROOT, 'app');
  let rel = 'app';
  const bound = [];
  for (const seg of segments) {
    if (!existsSync(dir)) return null;
    const entries = readdirSync(dir);
    const groups = entries.filter((e) => /^\(.+\)$/.test(e));
    let next = entries.includes(seg) ? seg : null;
    if (!next) {
      for (const g of groups) if (existsSync(join(dir, g, seg))) { rel = `${rel}/${g}`; dir = join(dir, g); next = seg; break; }
    }
    if (!next) {
      next = readdirSync(dir).find((e) => /^\[[^.\]]+\]$/.test(e)) ?? null;
      if (!next) return null;
      bound.push(seg);
    }
    dir = join(dir, next);
    rel = `${rel}/${next}`;
  }
  for (const f of ['page.tsx', 'page.ts', 'page.mdx']) if (existsSync(join(dir, f))) return { file: `${rel}/${f}`, bound };
  return null;
}

const FAMILIES = [
  [/^\/online-counselling\/[^/]+\/[^/]+$/, 'city x service'],
  [/^\/online-counselling\/[^/]+$/, 'city hub'],
  [/^\/practitioners\/[^/]+\/[^/]+\/tl$/, 'place /tl'],
  [/^\/practitioners\/[^/]+\/[^/]+\/pa$/, 'place /pa'],
  [/^\/practitioners\/[^/]+\/(tl|pa)$/, 'profile twin'],
  [/^\/practitioners\/[^/]+\/[^/]+$/, 'place'],
  [/^\/tagalog-counselling\/[^/]+$/, 'Tagalog city'],
  [/^\/punjabi-counselling\/[^/]+$/, 'Punjabi region'],
  [/^\/([^/]+)\/[^/]+$/, null],
];
const familyOf = (path) => {
  for (const [re, name] of FAMILIES) {
    const m = path.match(re);
    if (m) return name ?? `/${m[1]}`;
  }
  return 'top level';
};

function gscReport() {
  const APP_DIR = join(ROOT, '.next', 'server', 'app');
  const sm = ['sitemap.xml.body', 'sitemap.xml.html', 'sitemap.xml'].map((f) => join(APP_DIR, f)).find((f) => existsSync(f) && statSync(f).isFile());
  console.log('\nZERO-IMPRESSION CANDIDATES (--gsc, report only)\n' + '='.repeat(52));
  if (!sm) { console.log('  no built sitemap — run `npm run build` first. Nothing to report.'); return; }
  const urls = [...readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    .filter((u) => !/\.(png|jpe?g|webp|svg|gif)$/i.test(u));
  const pathOf = (u) => {
    try { return new URL(u).pathname.replace(/\/$/, '') || '/'; } catch { return u; }
  };

  const GSC = join(ROOT, 'data', 'gsc');
  const exports = existsSync(GSC) ? readdirSync(GSC).filter((f) => /-pages.*\.csv$/.test(f)).sort() : [];
  const impressions = new Map();
  for (const f of exports) {
    const [head, ...rows] = readFileSync(join(GSC, f), 'utf8').split(/\r?\n/).filter(Boolean);
    const col = head.split(',').findIndex((h) => /impressions/i.test(h));
    for (const r of rows) {
      const cells = r.split(',');
      const p = pathOf(cells[0]);
      impressions.set(p, (impressions.get(p) ?? 0) + (Number(cells[col]) || 0));
    }
  }

  const files = routeFileDates();
  if (!files.size) {
    console.log(`  ${urls.length} sitemap URLs, ${exports.length} exports; no git history here (shallow clone?), so no first-commit dates and no list.`);
    return;
  }
  const { slugs, pairs } = slugDates();
  const today = new Date();
  const ageOf = (iso) => Math.floor((today.getTime() - new Date(`${iso}T12:00:00Z`).getTime()) / 86400000);

  const textCache = new Map();
  const shOf = (path) => {
    if (textCache.has(path)) return textCache.get(path);
    const f = join(APP_DIR, `${path === '/' ? 'index' : path.slice(1)}.html`);
    const sh = existsSync(f) ? shingles(mainText(readFileSync(f, 'utf8'))) : null;
    textCache.set(path, sh);
    return sh;
  };

  const rows = [];
  let undated = 0;
  const byFamily = new Map();
  for (const u of urls) {
    const p = pathOf(u);
    const fam = familyOf(p);
    if (!byFamily.has(fam)) byFamily.set(fam, []);
    byFamily.get(fam).push(p);
  }
  for (const u of urls) {
    const p = pathOf(u);
    if ((impressions.get(p) ?? 0) > 0) continue;
    const segs = p === '/' ? [] : p.slice(1).split('/');
    const route = routeFor(segs);
    const dates = [];
    if (route && files.has(route.file)) dates.push(files.get(route.file));
    const fam = familyOf(p);
    if (fam === 'city x service') { const d = pairs.get(`${segs[1]}/${segs[2]}`); if (d) dates.push(d); }
    else if (route?.bound.length) { const d = slugs.get(route.bound[route.bound.length - 1]); if (d) dates.push(d); }
    if (!dates.length) { undated++; continue; }
    const first = dates.sort().at(-1);
    const age = ageOf(first);
    if (age < LIVE_DAYS) continue;
    let near = { v: 0, path: '' };
    const sh = shOf(p);
    if (sh) {
      for (const q of byFamily.get(fam)) {
        if (q === p) continue;
        const o = shOf(q);
        if (!o) continue;
        const v = jaccard(sh, o);
        if (v > near.v) near = { v, path: q };
      }
    }
    rows.push({ p, fam, first, age, near });
  }
  rows.sort((a, b) => a.fam.localeCompare(b.fam) || b.age - a.age);
  console.log(`  ${urls.length} sitemap URLs · ${exports.length} exports (${exports[0] ?? '-'} to ${exports.at(-1) ?? '-'}) · live ${LIVE_DAYS}+ days with 0 impressions: ${rows.length}${undated ? ` · ${undated} with no date found` : ''}`);
  for (const r of rows) {
    const near = r.near.path ? `${(r.near.v * 100).toFixed(0)}% ${r.near.path}` : 'no neighbour';
    console.log(`  ${r.fam.padEnd(16)} ${r.first}  ${String(r.age).padStart(3)}d  ${r.p}  (nearest ${near})`);
  }
  console.log('='.repeat(52));
  console.log('Report only. Acting on any of these needs its own rule and counts.');
}

if (process.argv.includes('--gsc')) {
  gscReport();
  process.exit(0);
}

const files = collect(SERVER).filter((f) => {
  /* Only the two-segment city/service pages. A city hub lives one level up. */
  const rel = f.slice(SERVER.length + 1).replace(/\\/g, '/');
  return rel.split('/').length === 2 && rel.endsWith('.html');
});

if (files.length === 0) {
  console.log('uniqueness-gate: no city/service pages built yet. Skipping.');
  process.exit(0);
}

const pages = files.map((f) => {
  const html = readFileSync(f, 'utf8');
  const rel = '/online-counselling/' + f.slice(SERVER.length + 1).replace(/\\/g, '/').replace(/\.html$/, '');
  const text = mainText(html);
  return {
    route: rel,
    text,
    words: text.split(' ').filter(Boolean).length,
    sh: shingles(text),
    title: (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim(),
    desc: (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || [, ''])[1].trim(),
  };
});

const fail = [];
const warn = [];

/* ---- 1. pairwise similarity ---- */
let worst = { v: 0, a: '', b: '' };
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const v = jaccard(pages[i].sh, pages[j].sh);
    if (v > worst.v) worst = { v, a: pages[i].route, b: pages[j].route };
    if (v > MAX_SIMILARITY) {
      fail.push(`${(v * 100).toFixed(0)}% similar: ${pages[i].route} vs ${pages[j].route}`);
    }
  }
}

/* ---- 2. unique share ---- */
const counts = new Map();
for (const p of pages) for (const s of p.sh) counts.set(s, (counts.get(s) || 0) + 1);
for (const p of pages) {
  let only = 0;
  for (const s of p.sh) if (counts.get(s) === 1) only++;
  const share = only / (p.sh.size || 1);
  p.uniqueShare = share;
  if (share < MIN_UNIQUE_SHARE) {
    fail.push(`${(share * 100).toFixed(0)}% unique (min ${MIN_UNIQUE_SHARE * 100}%): ${p.route}`);
  }
}

/* ---- 3. exact metadata collisions ---- */
for (const field of ['title', 'desc']) {
  const seen = new Map();
  for (const p of pages) {
    const v = p[field];
    if (!v) { warn.push(`empty ${field}: ${p.route}`); continue; }
    if (seen.has(v)) fail.push(`duplicate ${field}: ${p.route} and ${seen.get(v)}`);
    else seen.set(v, p.route);
  }
}

/* ---- 3b. near-duplicate descriptions — 3 Oct 2026 ----
 * Exact duplicates are caught above; "<Service> for <City>, by secure video
 * across BC..." on all 100 pages was not, because the city made each one
 * unique. Word 4-grams, entities decoded, overlap measured against the
 * smaller set. */
const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const grams4 = (s) => {
  const w = decode(s).toLowerCase().replace(/[^a-z0-9$’' -]+/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 4 <= w.length; i++) out.add(w.slice(i, i + 4).join(' '));
  return out;
};
let descWorst = { v: 0, a: '', b: '' };
const descGrams = pages.map((p) => ({ route: p.route, g: grams4(p.desc) }));
for (let i = 0; i < descGrams.length; i++) {
  for (let j = i + 1; j < descGrams.length; j++) {
    const a = descGrams[i].g;
    const b = descGrams[j].g;
    if (!a.size || !b.size) continue;
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const v = inter / Math.min(a.size, b.size);
    if (v > descWorst.v) descWorst = { v, a: descGrams[i].route, b: descGrams[j].route };
    if (v > MAX_DESC_OVERLAP) fail.push(`descriptions share ${(v * 100).toFixed(0)}% of 4-grams (max ${MAX_DESC_OVERLAP * 100}%): ${descGrams[i].route} vs ${descGrams[j].route}`);
  }
}

/* ---- 4. counsellor place pages: against each other, and against the hub ----
 *
 * Added 1 Oct 2026. Search Console dropped the Richmond and Vancouver hubs
 * from the export while /practitioners/savneet-singh/richmond sat at 6.93 and
 * /practitioners/camille-granda/vancouver at 8.38: the place pages were
 * competing with the city hub for its own head term. Two counsellors' pages
 * for one city are built from the same city record, so they are the pair
 * most likely to converge, and each is checked against its hub too. Same
 * thresholds as the matrix; the unique share is measured inside each city's
 * group (the hub plus every counsellor's page for that city). */
const APP = join(ROOT, '.next', 'server', 'app');
const PRAC = join(APP, 'practitioners');
const placeGroups = new Map();
if (existsSync(PRAC)) {
  for (const slug of readdirSync(PRAC)) {
    const dir = join(PRAC, slug);
    if (!statSync(dir).isDirectory()) continue;
    for (const entry of readdirSync(dir)) {
      if (!entry.endsWith('.html')) continue;
      const city = entry.replace(/\.html$/, '');
      if (city === 'tl' || city === 'pa') continue;
      const html = readFileSync(join(dir, entry), 'utf8');
      const text = mainText(html);
      if (!placeGroups.has(city)) placeGroups.set(city, []);
      placeGroups.get(city).push({ route: `/practitioners/${slug}/${city}`, sh: shingles(text) });
    }
  }
}
let placeWorst = { v: 0, a: '', b: '' };
let placeChecked = 0;
for (const [city, group] of placeGroups) {
  const hubFile = join(SERVER, `${city}.html`);
  const all = [...group];
  if (existsSync(hubFile)) all.push({ route: `/online-counselling/${city}`, sh: shingles(mainText(readFileSync(hubFile, 'utf8'))), hub: true });
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[i].hub && all[j].hub) continue;
      const v = jaccard(all[i].sh, all[j].sh);
      placeChecked++;
      if (v > placeWorst.v) placeWorst = { v, a: all[i].route, b: all[j].route };
      if (v > MAX_SIMILARITY) fail.push(`${(v * 100).toFixed(0)}% similar: ${all[i].route} vs ${all[j].route}`);
    }
  }
  if (all.length < 2) continue;
  const c = new Map();
  for (const p of all) for (const x of p.sh) c.set(x, (c.get(x) || 0) + 1);
  for (const p of group) {
    let only = 0;
    for (const x of p.sh) if (c.get(x) === 1) only++;
    const share = only / (p.sh.size || 1);
    if (share < PLACE_MIN_UNIQUE_SHARE) fail.push(`${(share * 100).toFixed(0)}% unique within ${city} (min ${PLACE_MIN_UNIQUE_SHARE * 100}%): ${p.route}`);
  }
}

/* ---- 5. the families this gate never read — 3 Oct 2026 ----
 *
 * Until today the gate collected only the city x service matrix and the
 * English place pages. Five families of templated pages went unmeasured, and
 * the unchecked maxima were the highest on the site: the /pa place twins at
 * 51%, the /tl twins at 49%, the Tagalog city pages at 36% and the city hubs
 * against each other at 34%. Each family is now checked pairwise against its
 * own ceiling. The twins start at 50%, the line the researcher's audit drew
 * (the /pa twins at 52% for now, see PA_TWIN_CEILING); the other three start
 * a few points above where they stand on 3 Oct, so the next template that
 * creeps in fails rather than the pages as they are.
 * A ceiling is lowered when a family is cleaned up, never raised to let a
 * page through. */
const FAMILY_CEILINGS = {
  'place /tl': TWIN_CEILING,
  'place /pa': PA_TWIN_CEILING,
  'Tagalog city': TAGALOG_CEILING,
  'city hub': HUB_CEILING,
  'Punjabi region': PUNJABI_CEILING,
};
function htmlIn(dir, keep = () => true) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((e) => e.endsWith('.html') && keep(e)).map((e) => join(dir, e));
}
function twins(file) {
  const out = [];
  if (!existsSync(PRAC)) return out;
  for (const slug of readdirSync(PRAC)) {
    const dir = join(PRAC, slug);
    if (!statSync(dir).isDirectory()) continue;
    for (const place of readdirSync(dir)) {
      const f = join(dir, place, `${file}.html`);
      if (existsSync(f)) out.push({ route: `/practitioners/${slug}/${place}/${file}`, f });
    }
  }
  return out;
}
const familyPages = {
  'place /tl': twins('tl'),
  'place /pa': twins('pa'),
  'Tagalog city': htmlIn(join(APP, 'tagalog-counselling')).map((f) => ({ route: `/tagalog-counselling/${f.split(/[\\/]/).pop().replace(/\.html$/, '')}`, f })),
  'city hub': htmlIn(SERVER).map((f) => ({ route: `/online-counselling/${f.split(/[\\/]/).pop().replace(/\.html$/, '')}`, f })),
  'Punjabi region': htmlIn(join(APP, 'punjabi-counselling')).map((f) => ({ route: `/punjabi-counselling/${f.split(/[\\/]/).pop().replace(/\.html$/, '')}`, f })),
};
const familyReports = [];
for (const [name, list] of Object.entries(familyPages)) {
  const ceiling = FAMILY_CEILINGS[name];
  const all = list.map((x) => ({ route: x.route, sh: shingles(mainText(readFileSync(x.f, 'utf8'))) }));
  let fw = { v: 0, a: '', b: '' };
  let n = 0;
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const v = jaccard(all[i].sh, all[j].sh);
      n++;
      if (v > fw.v) fw = { v, a: all[i].route, b: all[j].route };
      if (v > ceiling) fail.push(`${(v * 100).toFixed(0)}% similar (${name} ceiling ${ceiling * 100}%): ${all[i].route} vs ${all[j].route}`);
    }
  }
  familyReports.push({ name, count: all.length, pairs: n, worst: fw, ceiling });
}

/* ---- report ---- */
const shares = pages.map((p) => p.uniqueShare).sort((a, b) => a - b);
const mid = shares[Math.floor(shares.length / 2)];
console.log('\nCITY x SERVICE UNIQUENESS GATE\n' + '='.repeat(52));
console.log(`  pages           ${pages.length}`);
console.log(`  words / page    ${Math.round(pages.reduce((t, p) => t + p.words, 0) / pages.length)} median-ish mean`);
console.log(`  unique share    min ${(shares[0] * 100).toFixed(0)}%  median ${(mid * 100).toFixed(0)}%  (floor ${MIN_UNIQUE_SHARE * 100}%)`);
console.log(`  most similar    ${(worst.v * 100).toFixed(0)}%  (ceiling ${MAX_SIMILARITY * 100}%)`);
console.log(`                  ${worst.a}`);
console.log(`                  ${worst.b}`);
console.log(`  place pages     ${[...placeGroups.values()].reduce((t, g) => t + g.length, 0)} in ${placeGroups.size} cities, ${placeChecked} pairs; most similar ${(placeWorst.v * 100).toFixed(0)}%`);
console.log(`                  ${placeWorst.a}`);
console.log(`                  ${placeWorst.b}`);
console.log(`  descriptions    most alike ${(descWorst.v * 100).toFixed(0)}% of 4-grams (max ${MAX_DESC_OVERLAP * 100}%)`);
console.log(`                  ${descWorst.a}`);
console.log(`                  ${descWorst.b}`);
for (const f of familyReports) {
  console.log(`  ${f.name.padEnd(16)}${String(f.count).padStart(3)} pages, ${f.pairs} pairs; most similar ${(f.worst.v * 100).toFixed(0)}% (ceiling ${f.ceiling * 100}%)`);
  if (f.worst.a) console.log(`                  ${f.worst.a}  vs  ${f.worst.b}`);
}
for (const w of warn) console.log(`  note  ${w}`);
for (const f of fail) console.log(`  FAIL  ${f}`);
console.log('='.repeat(52));
if (fail.length) {
  console.log(`${fail.length} FAILURE(S) — the matrix is converging on a template.`);
  console.log('Fix by giving the named pages their own argument, not by raising the threshold.');
  process.exit(1);
}
console.log('All pages carry their own argument.');
