import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resources } from '../lib/resources.ts';
import { guides } from '../lib/guides.ts';
import { audiences } from '../lib/audiences.ts';
import { coverageClaims, PENDING } from '../scripts/coverage-claims.mjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { services } from '../lib/services.ts';
import { draftGuides } from '../lib/guides-drafts.ts';
import { FIRST_HOLIDAYS_CLEARED } from '../lib/guides-more3.ts';
import { live, PUBLISHED_GUIDES } from '../lib/live-links.ts';
import { liveLinks, type GatedLink } from '../lib/seasonal.ts';

/* ONE DIAGRAM, ONCE — 16 Oct 2026 (item 593).
 *
 * figure and figure2 render at two points in the same article. Four pages set
 * both to the same key, so the same diagram and its caption printed twice:
 * the WorkSafeBC, disability-benefits and before-your-first-consultation
 * resources (the last is linked from /book) and the Punjabi intergenerational
 * page. This is the duplicate render only; which diagram suits a page is a
 * separate judgement and is not tested here. */
test('no page renders the same diagram as its figure and its figure2', () => {
  const pages: { where: string; figure?: string; figure2?: string }[] = [
    ...resources.map((r) => ({ where: `/resources/${r.slug}`, figure: r.figure, figure2: r.figure2 })),
    ...guides.map((g) => ({ where: `/guides/${g.slug}`, figure: g.figure, figure2: g.figure2 })),
    ...audiences.map((a) => ({ where: `/for/${a.slug}`, figure: (a as { figure?: string }).figure, figure2: (a as { figure2?: string }).figure2 })),
  ];
  const dup = pages.filter((p) => p.figure && p.figure === p.figure2).map((p) => `${p.where} (${p.figure})`);
  assert.deepEqual(dup, []);
});

/* THE COVERAGE GATE'S OPENING ADVERB — 16 Oct 2026 (item 580). */
test('the coverage gate catches an answer opening "Commonly, not universally", and its pending list is empty', () => {
  assert.equal(coverageClaims("{ q: 'Does insurance cover an RCC?', a: 'Commonly, not universally. Many extended health plans reimburse RCC counselling, depending on the plan.' }").length, 1);
  assert.equal(coverageClaims('Commonly, but not universally, check the wording').length, 1);
  assert.equal(coverageClaims("a: 'Typically, plans reimburse an RCC.'").length, 1);
  assert.equal(coverageClaims('Many extended health plans reimburse an RCC, depending on the plan; some list only psychologists and social workers.').length, 0);
  assert.deepEqual(PENDING, []);
});

/* LINKS TO A DRAFT, WIRED BEFORE IT PUBLISHES — 16 Oct 2026 (item 558).
 *
 * Six pages link the holidays guide (a draft) and /for/family-caregivers
 * links the grief guide's first-holidays section (behind
 * FIRST_HOLIDAYS_CLEARED). While neither is approved every one of those
 * pages must render exactly as before: the live related list is the list as
 * it stood, entry for entry, so the inline link, the chips and the device
 * slots are byte-identical. When the owner approves, they all appear. */

const HOLIDAYS = 'holidays-with-family-you-find-difficult';
const ANCHOR = '/guides/grief-without-a-timeline#the-first-holidays-after-a-loss';

/** The related lists as they stood on main before item 558, by page. */
const BEFORE: Record<string, string[]> = {
  '/guides/setting-boundaries-with-family': ['/services/individual-therapy', '/services/family-counselling', '/online-counselling/abbotsford', '/for/first-gen-south-asian-adults', '/guides/intergenerational-trauma-explained', '/guides/talking-to-your-family-about-therapy', '/for/women', '/book'],
  '/guides/talking-to-your-family-about-therapy': ['/services/family-counselling', '/online-counselling/surrey', '/privacy', '/for/first-gen-south-asian-adults', '/guides/setting-boundaries-with-family', '/for/couples', '/book'],
  '/guides/grief-without-a-timeline': ['/services/individual-therapy', '/services/individual-therapy', '/guides/what-trauma-actually-means', '/guides/when-someone-you-love-is-drinking', '/guides/chronic-illness-and-mood', '/resources/bc-crisis-and-support-directory', '/book'],
  '/for/south-asian-intergenerational-conflict': ['/punjabi-counselling/abbotsford', '/for/first-gen-south-asian-adults', '/guides/intergenerational-trauma-explained', '/for/punjabi-speaking-couples', '/punjabi', '/book'],
  '/for/filipino-canadian-families': ['/for/filipino-healthcare-workers-and-caregivers', '/tagalog/gabay/pag-uusap-sa-pamilya-tungkol-sa-therapy', '/compare/therapy-in-tagalog-vs-english', '/services/tagalog-counselling', '/book'],
  '/services/family-counselling': ['/services/couples-therapy', '/services/punjabi-counselling', '/for/south-asian-intergenerational-conflict'],
  '/for/family-caregivers': ['/online-counselling/abbotsford', '/for/women', '/guides/grief-without-a-timeline', '/guides/setting-boundaries-with-family', '/resources/psychiatry-and-assessment-in-bc', '/book'],
};

function relatedOf(path: string): GatedLink[] {
  const [, kind, slug] = path.split('/');
  if (kind === 'guides') return guides.find((g) => g.slug === slug)!.related;
  if (kind === 'for') return audiences.find((a) => a.slug === slug)!.related;
  return services.find((s) => s.slug === slug)!.related ?? [];
}

test('while the holidays guide and the first-holidays section are unapproved, every linking page renders its old related list', () => {
  assert.ok(draftGuides.some((g) => g.slug === HOLIDAYS) && !PUBLISHED_GUIDES.has(HOLIDAYS), 'the holidays guide is still a draft');
  assert.equal(FIRST_HOLIDAYS_CLEARED, false);
  for (const [path, hrefs] of Object.entries(BEFORE)) {
    const all = relatedOf(path);
    assert.ok(all.length > hrefs.length, `${path} carries a gated link`);
    assert.deepEqual(live(all).map((l) => l.href), hrefs, `${path} renders as before`);
    assert.ok(live(all).every((l) => !l.guide && !l.flag), `${path}: no gated link survives`);
  }
});

test('once approved, six pages link the holidays guide and the caregivers page links the first-holidays section', () => {
  const published = new Set([...PUBLISHED_GUIDES, HOLIDAYS]);
  const on = { FIRST_HOLIDAYS_CLEARED: true };
  const linking = Object.keys(BEFORE).filter((p) => liveLinks(relatedOf(p), published, on).some((l) => l.href === `/guides/${HOLIDAYS}`));
  assert.equal(linking.length, 6);
  assert.ok(liveLinks(relatedOf('/for/family-caregivers'), published, on).some((l) => l.href === ANCHOR));
  /* The boundaries guide's inline link is the holidays guide once live. */
  assert.equal(liveLinks(relatedOf('/guides/setting-boundaries-with-family'), published, on)[0]!.href, `/guides/${HOLIDAYS}`);
});

test('every related link to a draft guide or the flagged anchor is gated, so it can never 404', () => {
  const drafts = new Set(draftGuides.map((g) => g.slug));
  const lists: [string, GatedLink[]][] = [
    ...guides.map((g) => [`/guides/${g.slug}`, g.related] as [string, GatedLink[]]),
    ...audiences.map((a) => [`/for/${a.slug}`, a.related] as [string, GatedLink[]]),
    ...services.map((s) => [`/services/${s.slug}`, s.related ?? []] as [string, GatedLink[]]),
  ];
  for (const [where, links] of lists) {
    for (const l of links) {
      const m = l.href.match(/^\/guides\/([a-z0-9-]+)/);
      if (m && drafts.has(m[1]!)) assert.equal(l.guide, m[1], `${where} links draft ${l.href} without guide`);
      if (l.href.includes('#the-first-holidays-after-a-loss')) assert.equal(l.flag, 'FIRST_HOLIDAYS_CLEARED', `${where}: ${l.href} without its flag`);
    }
  }
});

test('the three templates and the shelf read related links through live()', () => {
  const read = (...p: string[]) => readFileSync(join(process.cwd(), ...p), 'utf8');
  assert.match(read('app', 'guides', '[slug]', 'page.tsx'), /const related = live\(g\.related\)/);
  assert.match(read('app', 'for', '[slug]', 'page.tsx'), /const related = live\(a\.related\)/);
  assert.match(read('app', 'services', '[slug]', 'page.tsx'), /const related = s\.related && live\(s\.related\)/);
  for (const p of [['app', 'guides', '[slug]', 'page.tsx'], ['app', 'for', '[slug]', 'page.tsx'], ['app', 'services', '[slug]', 'page.tsx']]) {
    assert.doesNotMatch(read(...p), /\b[gas]\.related(?:\?)?\.map|\b[gas]\.related(?:\?\.)?\[\d\]/, `${p.join('/')} renders a related link unfiltered`);
  }
  assert.match(read('components', 'SeasonalShelf.tsx'), /liveShelfLinks\(PUBLISHED_GUIDES, LINK_FLAGS\)/);
});
