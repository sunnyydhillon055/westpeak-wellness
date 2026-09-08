#!/usr/bin/env node
/* Page-by-page comparison of two counsellors' surfaces, from the BUILT HTML.
 *
 * Written 7 Sep 2026 when Savneet Singh joined and the owner asked for a
 * page-by-page score against Camille Granda. Nothing here is a judgement of
 * either counsellor; it measures what the site gives each of them — words,
 * an answer paragraph, FAQ schema, breadcrumbs, a language pair, a share
 * image, a photograph, a diagram, inbound links, and a registration number a
 * reader can check. The last is the one that matters most and the one only a
 * document can fix.
 *
 *   node scripts/roster-compare.mjs savneet-singh camille-granda > OUT.md
 *
 * Each page is scored out of 100 on the same rubric, so the two columns are
 * comparable and a gap names its cause.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), '.next', 'server', 'app');
const [A = 'savneet-singh', B = 'camille-granda'] = process.argv.slice(2);

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}
const pages = walk(ROOT);
const routeOf = (f) => '/' + f.slice(ROOT.length + 1).replace(/\\/g, '/').replace(/\.html$/, '').replace(/^index$/, '');
const html = new Map(pages.map((f) => [routeOf(f), readFileSync(f, 'utf8')]));

/* In-body inbound links: count pages whose <main> links to the route. */
const mainOf = (h) => (h.match(/<main[\s\S]*?<\/main>/) || [h])[0];
const inbound = new Map();
for (const [r, h] of html) {
  const m = mainOf(h);
  for (const x of m.matchAll(/href="(\/[^"#?]*)"/g)) {
    const t = x[1].replace(/\/$/, '') || '/';
    if (t !== r) inbound.set(t, (inbound.get(t) ?? 0) + 1);
  }
}

const text = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
const words = (h) => text(mainOf(h)).split(/\s+/).filter(Boolean).length;
const ld = (h) => [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

function score(route) {
  const h = html.get(route);
  if (!h) return null;
  const j = ld(h);
  const faqs = (j.match(/"@type":"Question"/g) || []).length;
  const w = words(h);
  const m = {
    words: w,
    answer: /class="direct-answer"/.test(h),
    faqs,
    crumbs: /"BreadcrumbList"/.test(j),
    pair: /rel="alternate" hrefLang=/.test(h),
    og: /property="og:image"/.test(h),
    photo: /<img[^>]+src="\/_next\/image\?url=%2Fimg%2Fphoto/.test(h),
    figure: /<figure|<svg[^>]*class="figure|class="figure/.test(h),
    inbound: inbound.get(route) ?? 0,
    registration: /#\s*\d{4,}/.test(text(h)),
  };
  const s =
    Math.min(20, Math.round((w / 1800) * 20)) +
    (m.answer ? 10 : 0) +
    Math.min(10, faqs * 2) +
    (m.crumbs ? 5 : 0) +
    (m.pair ? 10 : 0) +
    (m.og ? 5 : 0) +
    (m.photo ? 5 : 0) +
    (m.figure ? 10 : 0) +
    Math.min(15, m.inbound * 3) +
    (m.registration ? 10 : 0);
  return { ...m, score: s };
}

const fmt = (r) => (r ? `${r.score}` : '—');
const detail = (r) => r ? `${r.words}w · ${r.faqs} FAQ · in ${r.inbound}${r.registration ? ' · reg#' : ' · **no reg#**'}${r.pair ? '' : ' · no pair'}${r.figure ? '' : ' · no figure'}` : 'not built';

const rows = [];
const add = (label, ra, rb) => rows.push({ label, a: score(ra), b: score(rb), ra, rb });

add('Profile (English)', `/practitioners/${A}`, `/practitioners/${B}`);
add('Profile (own language)', `/practitioners/${A}/pa`, `/practitioners/${B}/tl`);
const cities = ['surrey', 'vancouver', 'abbotsford', 'victoria', 'kelowna', 'kamloops', 'prince-george', 'burnaby', 'langley', 'white-rock', 'richmond', 'coquitlam', 'delta', 'nanaimo', 'chilliwack'];
for (const c of cities) add(`${c} (English)`, `/practitioners/${A}/${c}`, `/practitioners/${B}/${c}`);
for (const c of cities) add(`${c} (own language)`, `/practitioners/${A}/${c}/pa`, `/practitioners/${B}/${c}/tl`);
add('Alberta: Calgary', `/practitioners/${A}/calgary`, `/practitioners/${B}/calgary`);
add('Alberta: Edmonton', `/practitioners/${A}/edmonton`, `/practitioners/${B}/edmonton`);
add('Language front door', '/punjabi', '/tagalog');
add('Language index in English', '/punjabi-counselling', '/tagalog-counselling');
add('Region/city index (own language)', '/punjabi/regions', '/tagalog');
const guidePairs = [
  ['panic-attack-ki-hai', 'ano-ang-panic-attack'],
  ['udaasi-jaan-thakevan', 'depresyon-o-pagod-lang'],
  ['parivar-naal-therapy-di-gall', 'pag-uusap-sa-pamilya-tungkol-sa-therapy'],
  ['pehle-session-vich-ki-hunda-hai', 'ano-ang-mangyayari-sa-unang-sesyon'],
];
for (const [a, b] of guidePairs) add(`Guide: ${a}`, `/punjabi/guides/${a}`, `/tagalog/gabay/${b}`);

let outA = 0, outB = 0, nA = 0, nB = 0;
console.log(`| Page | ${A} | ${B} | Detail (${A}) | Detail (${B}) |`);
console.log('|---|---|---|---|---|');
for (const r of rows) {
  if (r.a) { outA += r.a.score; nA++; }
  if (r.b) { outB += r.b.score; nB++; }
  console.log(`| ${r.label} | ${fmt(r.a)} | ${fmt(r.b)} | ${detail(r.a)} | ${detail(r.b)} |`);
}
console.log('');
console.log(`**${A}: ${nA} pages, average ${nA ? Math.round(outA / nA) : 0}/100. ${B}: ${nB} pages, average ${nB ? Math.round(outB / nB) : 0}/100.**`);
