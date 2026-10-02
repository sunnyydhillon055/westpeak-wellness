import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { glossary } from '../lib/glossary.ts';
import { GLOSSARY_ANCHORS, glossaryAnchor } from '../lib/glossary-anchors.ts';
import { punjabiRegions } from '../lib/punjabi-regions.ts';
import { TAGALOG_CITIES } from '../lib/tagalog.ts';
import { punjabiRegionLinks, tagalogCityLinks, regionLinksFor } from '../lib/region-links.ts';

/* wf/services-cards, 2 Oct 2026: items 367, 390 and 391. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const VAGUE = /^(click here|here|read more|learn more|more|this|link|see more)\.?$/i;

/* ---------- 390: glossary anchors ---------- */

test('every glossary term with a deeper page has its own anchor, and none is vague or repeated', () => {
  const linked = glossary.filter((t) => t.href);
  assert.ok(linked.length >= 27);
  const anchors = linked.map((t) => glossaryAnchor(t.term, t.href!));
  for (const t of linked) assert.ok(GLOSSARY_ANCHORS[t.term], `${t.term} has no anchor, and would fall back to its path`);
  for (const a of anchors) assert.doesNotMatch(a, VAGUE, a);
  assert.equal(new Set(anchors).size, anchors.length, 'two links on /glossary share an anchor');
  /* The seven to /services/individual-therapy say which part of it. */
  const individual = linked.filter((t) => t.href === '/services/individual-therapy');
  assert.ok(individual.length >= 7);
  for (const t of individual) assert.match(glossaryAnchor(t.term, t.href!), /individual therapy/i);
  /* No key names a term that no longer exists. */
  for (const k of Object.keys(GLOSSARY_ANCHORS)) assert.ok(linked.some((t) => t.term === k), `${k} is not a linked term`);
  assert.doesNotMatch(src('app/glossary/page.tsx'), /Read more/);
});

test('the vague-anchor gate strips a trailing arrow before testing', () => {
  const qa = src('scripts/quality-audit.mjs');
  assert.match(qa, /VAGUE\.test\(label\.replace\(\/\\s\*\[→›»\]\+\\s\*\$\/u, ''\)\)/);
  const strip = (l: string) => l.replace(/\s*[→›»]+\s*$/u, '');
  for (const l of ['Read more →', 'Learn more ›', 'More »', 'read more']) assert.match(strip(l), VAGUE, l);
  assert.doesNotMatch(strip('EMDR therapy in BC →'), VAGUE);
});

test('service cards link the name line, not the whole card', () => {
  for (const f of ['app/services/[slug]/page.tsx', 'app/services/page.tsx', 'app/page.tsx']) {
    const s = src(f);
    assert.doesNotMatch(s, /href=\{`\/services\/\$\{[os]\.slug\}`\} className="card-link"/, `${f} still wraps a whole service card in its anchor`);
    assert.match(s, /className="more card-stretch">\s*\{[os]\.name\} in BC<span aria-hidden="true"> →<\/span>/, f);
    assert.match(s, /card--stretch/, f);
  }
  assert.doesNotMatch(src('app/page.tsx'), /Learn more →/);
});

/* ---------- 367 and 391: the language pages by place ---------- */

test('the Punjabi row links every region page, Lower Mainland first, labelled from the data', () => {
  const links = punjabiRegionLinks();
  assert.equal(links.length, punjabiRegions.length);
  assert.deepEqual(links.map((l) => l.href), [
    '/punjabi-counselling/surrey', '/punjabi-counselling/abbotsford', '/punjabi-counselling/vancouver',
    '/punjabi-counselling/north-vancouver', '/punjabi-counselling/maple-ridge', '/punjabi-counselling/mission', '/punjabi-counselling/saanich', '/punjabi-counselling/langford', '/punjabi-counselling/courtenay', '/punjabi-counselling/campbell-river', '/punjabi-counselling/kamloops', '/punjabi-counselling/kelowna', '/punjabi-counselling/vernon', '/punjabi-counselling/cranbrook', '/punjabi-counselling/prince-george',
  ]);
  for (const r of punjabiRegions) {
    assert.ok(links.some((l) => l.href === `/punjabi-counselling/${r.slug}` && l.label === `Punjabi counselling in ${r.region}`), r.slug);
  }
});

test('the Tagalog row links every city page, labelled from the data', () => {
  const links = tagalogCityLinks();
  assert.equal(links.length, TAGALOG_CITIES.length);
  for (const c of TAGALOG_CITIES) {
    assert.ok(links.some((l) => l.href === `/tagalog-counselling/${c.slug}` && l.label === `Tagalog counselling in ${c.city}`), c.slug);
  }
  assert.equal(regionLinksFor('tl')!.heading, 'Tagalog-speaking counselling by city');
  assert.equal(regionLinksFor('pa')!.heading, 'Punjabi-speaking counselling by region');
  assert.equal(regionLinksFor(undefined), undefined);
  assert.equal(regionLinksFor('en-CA'), undefined);
});

test('the rows render on the two language services and the two Filipino /for pages, and nowhere else by accident', () => {
  const svc = src('app/services/[slug]/page.tsx');
  assert.match(svc, /const regionRow = regionLinksFor\(s\.language\);/);
  const forPage = src('app/for/[slug]/page.tsx');
  assert.match(forPage, /const regionRow = a\.language === 'tl' \? regionLinksFor\('tl'\) : undefined;/);
  /* The client-side component takes strings and never imports the data. */
  const comp = src('components/RegionLinks.tsx');
  assert.doesNotMatch(comp, /^'use client'/m);
  assert.doesNotMatch(comp, /punjabi-regions|lib\/tagalog|practitioners/);
});

test('the Punjabi service copy sends Kelowna and Prince George to the Punjabi pages', () => {
  const s = src('lib/services.ts');
  assert.match(s, /\[Punjabi counselling in Kelowna\]\(\/punjabi-counselling\/kelowna\)/);
  assert.match(s, /\[Punjabi counselling in Prince George\]\(\/punjabi-counselling\/prince-george\)/);
  assert.doesNotMatch(s, /\[Kelowna\]\(\/online-counselling\/kelowna\)/);
});
