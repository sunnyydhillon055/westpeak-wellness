#!/usr/bin/env node
/* Pre-deploy gate for the interprovincial expansion.
 *
 * The Ontario checks are the reason this file exists. Publishing pages that
 * target Ontario cities is advertising in Ontario, which removes the CRPO
 * allowance letting an out-of-province registrant see the occasional Ontario
 * client. A leak here is a regulatory problem rather than a bug, so it fails
 * the run instead of warning.
 *
 *   node scripts/expansion-verify.mjs      (run after `npm run build`)
 *
 * TWO THINGS THIS FILE LEARNED THE HARD WAY
 *
 * 1. Scan VISIBLE content, not raw HTML. Next serialises the not-found boundary
 *    into the RSC flight payload of every page, so a raw-HTML scan found the
 *    404 page's BC crisis line on all seven Alberta pages and reported seven
 *    leaks no reader could ever see.
 * 2. Alberta protects "psychologist" as a TITLE. An earlier version flagged the
 *    bare word and lit up twenty correct BC pages, including the one whose job
 *    is explaining the difference between an RCC and a psychologist. The check
 *    looks for the practice CLAIMING the title, not discussing it.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const APP = join(process.cwd(), '.next', 'server', 'app');
const fail = [];
const pass = [];
const note = [];

const MAIN_RE = new RegExp('<main[^>]*>([\\s\\S]*?)</main>', 'i');
const mainOf = (html) => (html.match(MAIN_RE) || [null, ''])[1];
const textOf = (html) => mainOf(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(APP)) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

const files = walk(APP);
const routeOf = (f) => {
  const r = relative(APP, f).split(sep).join('/').replace(/\.html$/, '');
  return r === 'index' ? '/' : '/' + r;
};
const pages = new Map(files.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));
const published = [...pages.entries()].filter(([r]) => !r.startsWith('/ontario'));
/* Content checks (crisis numbers, designation, protected titles, uniqueness)
 * only mean anything on pages that actually render. While Alberta is gated
 * these are 404 shells, so the checks are skipped and the gate checks above are
 * what is being relied on. */
const abLive = process.env.NEXT_PUBLIC_ALBERTA_LIVE === 'true';
const abPages = abLive
  ? published.filter(([r]) => r === '/alberta' || r.startsWith('/alberta/'))
  : [];
if (!abLive) note.push('Alberta content checks skipped — province is gated, pages render 404');

/* ---------- 1. GATED PROVINCES MUST NOT BE PUBLISHED ----------
 *
 * Both provinces are gated, for different reasons. Alberta is gated on
 * INSURANCE: the liability policy does not extend outside BC, confirmed by the
 * owner on 17 Aug 2026 after the pages had briefly gone live. Ontario is gated
 * on REGISTRATION. Either way, a rendered indexable page is an advertisement,
 * and an advertisement produces bookings — which is the thing that must not
 * happen while the practice cannot lawfully take them.
 */
const GATED = [
  { slug: 'alberta', name: 'Alberta', env: 'NEXT_PUBLIC_ALBERTA_LIVE' },
  { slug: 'ontario', name: 'Ontario', env: 'NEXT_PUBLIC_ONTARIO_LIVE' },
].filter((g) => process.env[g.env] !== 'true');

for (const g of GATED) {
  const rendered = [...pages.keys()].filter((r) => r === `/${g.slug}` || r.startsWith(`/${g.slug}/`));
  const leaked = rendered.filter((r) => {
    const h = pages.get(r);
    const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h);
    const real = /Online Counselling in|Punjabi Counselling in|Punjabi-speaking counselling|What .* plans cover/i.test(mainOf(h));
    return real && !noindex;
  });
  if (leaked.length) fail.push(`${g.name.toUpperCase()} LEAK: rendered and indexable: ${leaked.join(', ')}`);
  else pass.push(`${g.name}: gated — ${rendered.length} build artefact(s), none rendering indexable content`);
}
if (!GATED.length) note.push('No province is gated in this build — check that is intended');

/* ---------- 2. ONTARIO MUST NOT BE IN THE SITEMAP ---------- */
let sitemapText = '';
for (const cand of ['sitemap.xml.body', 'sitemap.xml']) {
  const p = join(APP, cand);
  if (existsSync(p) && statSync(p).isFile()) sitemapText = readFileSync(p, 'utf8');
}
if (sitemapText) {
  for (const g of GATED) {
    const n = (sitemapText.match(new RegExp(`/${g.slug}`, 'g')) || []).length;
    if (n > 0) fail.push(`${g.name.toUpperCase()} LEAK: ${n} /${g.slug} URL(s) in the sitemap`);
    else pass.push(`${g.name}: absent from the sitemap`);
  }
} else {
  note.push('Sitemap generated on demand — also verify against a running server');
}

/* ---------- 3. NO SELF-DESCRIPTION WITH A PROTECTED TITLE ---------- */
const SELF_CLAIM = [
  { re: /\b(our|the practice's)\s+psychologist\b/i, why: 'holds the practice out as a psychologist' },
  { re: /\bis a (?:registered )?psychologist\b/i, why: 'claims the psychologist title' },
  { re: /\bpsychological services\b/i, why: 'protected service description in Alberta' },
  { re: /\bregistered (?:in|with) (?:the province of )?Alberta\b/i, why: 'claims Alberta registration' },
  { re: /\bAlberta[- ]registered\b/i, why: 'claims Alberta registration' },
  { re: /\bregistered with the College of Alberta\b/i, why: 'claims Alberta college registration' },
];
let claimFail = false;
for (const [route, html] of abPages) {
  const text = textOf(html);
  for (const b of SELF_CLAIM) {
    const m = text.match(b.re);
    if (!m) continue;
    const at = text.indexOf(m[0]);
    const around = text.slice(Math.max(0, at - 100), at + m[0].length + 100);
    /* A question ("Is the counsellor registered in Alberta?") and a negation
       ("no Alberta college registers counsellors") are the opposite of a claim. */
    if (/\?/.test(around) || /\b(not|no|never|cannot|does not|nor)\b/i.test(around)) continue;
    fail.push(`${route}: ${b.why} — "${m[0]}"`);
    claimFail = true;
  }
}
if (!claimFail) pass.push(`No protected-title or registration claims across ${abPages.length} Alberta pages`);

/* ---------- 4. CRISIS NUMBERS MUST BE PROVINCE-CORRECT ---------- */
let crisisFail = false;
for (const [route, html] of abPages) {
  const v = mainOf(html);
  if (!/1-877-303-2642/.test(v)) { fail.push(`${route}: missing the Alberta Mental Health Help Line`); crisisFail = true; }
  if (/310-6789/.test(v)) { fail.push(`${route}: carries the BC crisis line on an Alberta page`); crisisFail = true; }
  if (!/988|9-8-8/.test(v)) { fail.push(`${route}: missing 9-8-8`); crisisFail = true; }
}
if (abPages.length && !crisisFail) pass.push(`Crisis block province-correct on all ${abPages.length} Alberta pages`);

/* ---------- 5. NO PREMISES CLAIMED WHERE THERE IS NONE ---------- */
let premisesFail = false;
for (const [route, html] of abPages) {
  if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) { fail.push(`${route}: LocalBusiness schema, no premises in Alberta`); premisesFail = true; }
  if (/"PostalAddress"/.test(html)) { fail.push(`${route}: PostalAddress schema, no premises in Alberta`); premisesFail = true; }
}
if (abPages.length && !premisesFail) pass.push('No LocalBusiness or PostalAddress on out-of-province pages');

/* ---------- 6. DESIGNATION LINE VISIBLE ---------- */
let desigFail = false;
for (const [route, html] of abPages) {
  if (!/BC Association of Clinical Counsellors/i.test(mainOf(html))) {
    fail.push(`${route}: no visible BCACC designation line`); desigFail = true;
  }
}
if (abPages.length && !desigFail) pass.push('BCACC designation in visible copy on every Alberta page');

/* ---------- 7. UNIQUENESS ---------- */
const bodyWords = (html) => {
  let m = mainOf(html);
  /* Strip what is identical BY DESIGN and must be — the designation line, the
     crisis block, the closing CTA. Counting those as duplicate copy would
     penalise exactly the compliance elements every page is required to carry.
     What is measured is whether the ARGUMENT of each page is distinct. */
  m = m
    .replace(new RegExp('<p class="designation-note"[\\s\\S]*?</p>', 'gi'), ' ')
    .replace(new RegExp('<aside class="crisis"[\\s\\S]*?</aside>', 'gi'), ' ')
    .replace(new RegExp('<div class="cta-band"[\\s\\S]*?</div>', 'gi'), ' ');
  return m
    .replace(new RegExp('<script[\\s\\S]*?</script>', 'gi'), ' ')
    .replace(/<[^>]*>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z਀-੿ ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);
};
const shingles = (ws) => {
  const s = new Set();
  for (let i = 0; i + 4 < ws.length; i++) s.add(ws.slice(i, i + 5).join(' '));
  return s;
};
const sig = abPages.map(([r, h]) => [r, shingles(bodyWords(h))]);
let worst = { a: '', b: '', pct: 0 };
for (let i = 0; i < sig.length; i++) {
  for (let j = i + 1; j < sig.length; j++) {
    const [ra, sa] = sig[i];
    const [rb, sb] = sig[j];
    if (!sa.size || !sb.size) continue;
    let shared = 0;
    for (const x of sa) if (sb.has(x)) shared++;
    const pct = Math.round((100 * shared) / Math.min(sa.size, sb.size));
    if (pct > worst.pct) worst = { a: ra, b: rb, pct };
    if (pct > 25) fail.push(`UNIQUENESS: ${ra} and ${rb} share ${pct}% of 5-word phrases (limit 25%)`);
  }
}
if (sig.length > 1) pass.push(`Uniqueness: worst pair ${worst.pct}% (${worst.a} vs ${worst.b}), limit 25%`);

/* ---------- 8. THE COUNSELLOR'S NAME STAYS ON /about ---------- */
let nameFail = false;
for (const [route, html] of published) {
  if (route === '/about') continue;
  if (/\b(aman|dhillon|bains)\b/i.test(html)) { fail.push(`${route}: counsellor name outside /about`); nameFail = true; }
}
if (!nameFail) pass.push('Counsellor name appears only under /about');

/* ---------- REPORT ---------- */
console.log('\nINTERPROVINCIAL EXPANSION — PRE-DEPLOY GATE\n' + '='.repeat(52));
for (const p of pass) console.log(`  PASS  ${p}`);
for (const n of note) console.log(`  note  ${n}`);
for (const f of fail) console.log(`  FAIL  ${f}`);
console.log('='.repeat(52));
console.log(fail.length ? `${fail.length} FAILURE(S) — DO NOT DEPLOY` : 'All checks passed.');
process.exit(fail.length ? 1 : 0);
