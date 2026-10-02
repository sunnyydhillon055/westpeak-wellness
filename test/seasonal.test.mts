import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  inSeason, pacificMonthDay, activeSeasonal, planYearMailParagraph, planYearPageLineShown,
  PLAN_YEAR_PAGE_WINDOW, PLAN_YEAR_MAIL_WINDOW, YEAR_END_PATH,
} from '../lib/seasonal.ts';
import { remainingBalanceSessions, remainingBalanceSentence, sessionsCovered } from '../lib/session-arithmetic.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { getResource, resources } from '../lib/resources.ts';
import { getGuide } from '../lib/guides.ts';
import { FIRST_HOLIDAYS_CLEARED, FIRST_HOLIDAYS_SECTION, FIRST_HOLIDAYS_FAQ } from '../lib/guides-more3.ts';
import { showsInfoCards } from '../lib/counsellor-cards.ts';

/* SEASONAL COPY — 1 Oct 2026, items 210, 212, 220-223 and 247. */

const ROOT = process.cwd();
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
/* Instants, chosen around the Pacific/UTC boundary. Vancouver is UTC-7 in
   October. From November 2026 BC stops changing its clocks, and newer tz data
   (Node 22.23 on CI) keeps Vancouver at UTC-7 through the winter while older
   data (Node 24.15 here) still says UTC-8. Winter instants below sit an hour
   or more from midnight so they hold under either rule (1 Oct 2026: the
   one-minute version passed here and failed on CI). */
const at = (iso: string) => new Date(iso);
const IND = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!;

test('the season is read on the Pacific calendar, not UTC', () => {
  assert.equal(pacificMonthDay(at('2026-10-01T06:59:00Z')), '09-30');
  assert.equal(pacificMonthDay(at('2026-10-01T07:00:00Z')), '10-01');
  /* 4 p.m. on 31 December in Vancouver is already 1 January in UTC. */
  assert.equal(pacificMonthDay(at('2027-01-01T00:30:00Z')), '12-31');
  assert.equal(inSeason('10-01', '12-31', at('2027-01-01T05:30:00Z')), true, 'still 31 Dec in Vancouver');
  assert.equal(inSeason('10-01', '12-31', at('2027-01-01T09:30:00Z')), false, '1 Jan in Vancouver');
  assert.equal(inSeason('10-01', '12-31', at('2026-10-01T06:59:00Z')), false, 'still 30 Sep in Vancouver');
});

test('windows are inclusive, can wrap the new year, and a malformed bound is never in season', () => {
  assert.equal(inSeason('10-15', '12-20', at('2026-10-15T19:00:00Z')), true);
  assert.equal(inSeason('10-15', '12-20', at('2026-12-20T19:00:00Z')), true);
  assert.equal(inSeason('10-15', '12-20', at('2026-12-21T19:00:00Z')), false);
  assert.equal(inSeason('10-15', '12-20', at('2026-10-14T19:00:00Z')), false);
  assert.equal(inSeason('12-15', '01-15', at('2027-01-10T19:00:00Z')), true);
  assert.equal(inSeason('12-15', '01-15', at('2026-12-16T19:00:00Z')), true);
  assert.equal(inSeason('12-15', '01-15', at('2026-11-16T19:00:00Z')), false);
  assert.equal(inSeason('10-1', '12-31', at('2026-11-01T19:00:00Z')), false);
  assert.equal(inSeason('13-01', '12-31', at('2026-11-01T19:00:00Z')), false);
});

test('the coverage pages carry a year-end block that shows 1 Oct to 31 Dec and never in January', () => {
  const pages = ['does-my-plan-cover-counselling-bc', 'counselling-coverage-in-alberta'];
  for (const slug of pages) {
    const r = getResource(slug)!;
    assert.ok(r.seasonal, `${slug} has no seasonal block`);
    assert.equal(r.seasonal!.from, '10-01');
    assert.ok(r.seasonal!.to <= '12-31' && r.seasonal!.to >= r.seasonal!.from, `${slug} must end by 31 Dec`);
    assert.equal(activeSeasonal(r.seasonal, at('2026-09-30T19:00:00Z')), null, `${slug} before`);
    assert.ok(activeSeasonal(r.seasonal, at('2026-10-01T19:00:00Z')), `${slug} on 1 Oct`);
    assert.ok(activeSeasonal(r.seasonal, at('2026-12-31T19:00:00Z')), `${slug} on 31 Dec`);
    assert.equal(activeSeasonal(r.seasonal, at('2027-01-01T19:00:00Z')), null, `${slug} on 1 Jan`);
    const body = r.seasonal!.body.join('\n');
    assert.match(body, /date of the session decides/);
    assert.match(body, /anniversary year/);
    assert.match(body, /do not carry over/);
    /* Item 383: the BC page prints planMaximumParagraph, so its seasonal
       block drops the remaining-balance arithmetic; the fee is still on the
       page, from the catalogue, once. */
    const page = JSON.stringify(r);
    assert.ok((r.seasonal!.body.some((p) => p.includes('$300 left')) ? body : page).includes(money(IND.cents)), 'fee from the catalogue');
    assert.doesNotMatch(body, /evening|weekend|\b\d{1,2}(:\d\d)?\s?(a\.m\.|p\.m\.|am|pm)\b/i, 'no hours');
  }
  /* Every seasonal block anywhere ends by 31 Dec unless it deliberately wraps. */
  for (const r of resources) if (r.seasonal) assert.ok(r.seasonal.to <= '12-31');
  /* The template renders it through activeSeasonal and nothing else. */
  assert.match(src('app/resources/[slug]/page.tsx'), /activeSeasonal\(r\.seasonal\)/);
});

test('the BC coverage page links the year-end page; the Alberta one does not', () => {
  const bc = getResource('does-my-plan-cover-counselling-bc')!.seasonal!.body.join('\n');
  const ab = getResource('counselling-coverage-in-alberta')!.seasonal!.body.join('\n');
  assert.ok(bc.includes(`(${YEAR_END_PATH})`));
  assert.ok(!ab.includes(YEAR_END_PATH));
  assert.match(ab, /Canadian Certified Counsellor/);
});

test('the permanent carry-over FAQ is plan-dependent', () => {
  const f = getResource('does-my-plan-cover-counselling-bc')!.faqs.find((x) => x.q === 'Do unused counselling benefits carry over?');
  assert.ok(f);
  assert.match(f!.a, /depends on the plan/);
});

test('remainingBalanceSessions counts whole sessions at the catalogue fee', () => {
  assert.equal(remainingBalanceSessions(30000), sessionsCovered(30000, IND.cents));
  assert.equal(remainingBalanceSessions(60000), sessionsCovered(60000, IND.cents));
  assert.equal(remainingBalanceSessions(0), 0);
  const doubled = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Individual Counselling' ? { ...i, cents: 30000 } : i)) };
  assert.equal(remainingBalanceSessions(60000, doubled), 2, 'follows the catalogue');
  const s = remainingBalanceSentence();
  assert.ok(s.includes(money(IND.cents)));
  assert.ok(s.includes(`covers ${remainingBalanceSessions(30000)} whole`));
  assert.match(s, /cap each visit/);
  assert.doesNotMatch(s, /'/, 'a straight apostrophe in prose');
});

test('the year-end page exists, carries cards, cites its facts, and promises no time', () => {
  const r = getResource('counselling-benefits-before-year-end-bc')!;
  assert.ok(r, 'no year-end page');
  assert.equal(r.slug, YEAR_END_PATH.split('/').pop());
  assert.ok(r.metaTitle.length <= 60, r.metaTitle);
  assert.ok(r.metaDescription.replace(/&/g, '&amp;').length <= 158, r.metaDescription);
  assert.equal(showsInfoCards('resources', r.slug, r.whoYouWouldSee), true);
  const all = JSON.stringify(r);
  assert.match(all, /Pacific Blue Cross/);
  assert.match(all, /30 June or 31 December/);
  assert.match(all, /\$1,000 per calendar year/);
  assert.match(all, /members only/);
  assert.match(all, /\/for\/university-students/);
  assert.match(all, /free 30-minute consultation/);
  assert.match(all, /real open times/);
  assert.doesNotMatch(all, /evening|weekend|slots? left|spots? left/i);
  assert.ok(r.sources.some((s) => s.url.includes('pac.bluecross.ca')));
  assert.ok(r.sources.some((s) => s.url.includes('pebt.ca')));
  assert.ok(r.sources.some((s) => s.url.includes('bcgeu.ca')));
  /* Linked from where the item says. */
  assert.match(src('lib/tools.ts'), /counselling-benefits-before-year-end-bc/);
  assert.match(src('lib/audiences-more3.ts'), /counselling-benefits-before-year-end-bc/);
  assert.match(src('app/pricing/page.tsx'), /YEAR_END_PATH/);
});

test('the /pricing and /book line shows 15 Oct to 31 Dec only', () => {
  assert.deepEqual(PLAN_YEAR_PAGE_WINDOW, { from: '10-15', to: '12-31' });
  assert.equal(planYearPageLineShown(at('2026-10-14T19:00:00Z')), false);
  assert.equal(planYearPageLineShown(at('2026-10-15T19:00:00Z')), true);
  assert.equal(planYearPageLineShown(at('2026-12-31T19:00:00Z')), true);
  assert.equal(planYearPageLineShown(at('2027-01-01T19:00:00Z')), false);
  for (const f of ['app/pricing/page.tsx', 'app/book/page.tsx']) assert.match(src(f), /planYearPageLineShown\(\)/, f);
});

test('the mail paragraph runs 15 Oct to 20 Dec and is gone on 21 Dec and 1 Jan', () => {
  assert.deepEqual(PLAN_YEAR_MAIL_WINDOW, { from: '10-15', to: '12-20' });
  assert.ok(planYearMailParagraph(at('2026-10-15T19:00:00Z')));
  assert.ok(planYearMailParagraph(at('2026-12-20T19:00:00Z')));
  assert.equal(planYearMailParagraph(at('2026-12-21T19:00:00Z')), null);
  assert.equal(planYearMailParagraph(at('2027-01-01T19:00:00Z')), null);
  assert.doesNotMatch(planYearMailParagraph(at('2026-11-01T19:00:00Z'))!, /\$|evening|weekend/);
});

test('the claim-deadline and reset wording no longer states a typical deadline or a single reset date', () => {
  assert.doesNotMatch(src('lib/depth2-other.ts'), /frequently 90 days from the date of service/);
  assert.match(src('lib/depth2-other.ts'), /Deadlines are set by each plan and vary widely/);
  assert.doesNotMatch(src('lib/resources.ts'), /usually resets on 1 January, not on your hire date/);
  for (const f of ['lib/resources.ts', 'lib/depth-other.ts']) {
    assert.match(src(f), /Many plans reset on 1 January; some run on an anniversary year\. The booklet says which\./, f);
  }
});

test('the winter guide leads with seasonal depression and keeps the no-diagnosis line', () => {
  const g = getGuide('low-mood-through-a-bc-winter')!;
  assert.match(g.metaTitle, /Seasonal Depression \(SAD\)/);
  assert.ok(g.metaTitle.length <= 60);
  assert.match(g.metaDescription, /seasonal depression/i);
  assert.ok(g.metaDescription.length <= 155);
  assert.ok(g.faqs.some((f) => /does not diagnose/.test(f.a)));
  assert.equal(showsInfoCards('guides', g.slug), true);
});

test('the first-holidays grief section is written but not live until the clinical read', () => {
  assert.equal(FIRST_HOLIDAYS_CLEARED, false, 'flip only after the owner’s clinical read');
  const g = getGuide('grief-without-a-timeline')!;
  assert.ok(!g.sections.some((s) => s.h2 === FIRST_HOLIDAYS_SECTION.h2), 'section is live');
  assert.ok(!g.faqs.some((f) => f.q === FIRST_HOLIDAYS_FAQ.q), 'FAQ is live');
  const text = JSON.stringify([FIRST_HOLIDAYS_SECTION, FIRST_HOLIDAYS_FAQ]);
  assert.match(text, /empty chair/);
  assert.match(text, /9-8-8/);
  assert.doesNotMatch(text, /will help|helps you heal|guarantee|clients (say|tell)/i, 'no outcome claims');
});
