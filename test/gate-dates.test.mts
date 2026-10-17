import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  GATE_DATES, SEASONAL_SHELF, PLAN_YEAR_PAGE_WINDOW, PLAN_RESET_PAGE_WINDOW, YEAR_END_PATH,
  dayAfter, windowGates, liveShelfLinks, activeShelf, activeSeasonal, inSeason,
} from '../lib/seasonal.ts';
import { EI_YEAR_SWITCH, EI_WAITING_WAIVER } from '../lib/benefit-figures.ts';
import { resources, getResource } from '../lib/resources.ts';
import { guides, getGuide } from '../lib/guides.ts';
import { draftGuides } from '../lib/guides-drafts.ts';
import { FIRST_HOLIDAYS_CLEARED } from '../lib/guides-more3.ts';
import { headingId } from '../lib/toc.ts';

/* EVERY DAY A STATIC PAGE CHANGES BY DATE HAS A BUILD — 15 Oct 2026 (item 511).
 *
 * Indexable pages are fully static, so a seasonal window opens or closes on
 * the page only when the site is built. GATE_DATES (lib/seasonal.ts) lists
 * those days and .github/workflows/rebuild-on-gate-dates.yml has a schedule
 * line for each. These tests tie the three together: a window in the code
 * with no gate, a gate with no schedule line, or a schedule line with no gate
 * all fail here.
 *
 * Instants are noon UTC or later, so they sit well inside the Pacific day
 * whether tz data puts Vancouver on UTC-7 or UTC-8. */

const ROOT = process.cwd();
const WORKFLOW = readFileSync(join(ROOT, '.github', 'workflows', 'rebuild-on-gate-dates.yml'), 'utf8').replace(/\r\n/g, '\n'); // CRLF checkouts read the same as CI's LF
const at = (iso: string) => new Date(iso);

/** The schedule lines: minute, hour, day of month, month. */
const CRONS = [...WORKFLOW.matchAll(/cron:\s*'(\d+) (\d+) (\d+) (\d+) \*'/g)].map((m) => ({
  line: m[0],
  hour: Number(m[2]),
  md: `${m[4]!.padStart(2, '0')}-${m[3]!.padStart(2, '0')}`,
}));

/** Every day a window in the code opens or closes a page. */
function boundaries(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const add = (md: string, why: string) => out.set(md, [...(out.get(md) ?? []), why]);
  const win = (w: { from: string; to: string }, why: string) => {
    const [open, close] = windowGates(w);
    add(open, `${why} opens`);
    add(close, `${why} closes`);
  };
  win(PLAN_YEAR_PAGE_WINDOW, 'PLAN_YEAR_PAGE_WINDOW');
  win(PLAN_RESET_PAGE_WINDOW, 'PLAN_RESET_PAGE_WINDOW');
  for (const r of resources) if (r.seasonal) win(r.seasonal, `resources/${r.slug} seasonal`);
  for (const g of guides) if (g.seasonal) win(g.seasonal, `guides/${g.slug} seasonal`);
  for (const w of SEASONAL_SHELF) win(w, `shelf ${w.from}..${w.to}`);
  add(EI_YEAR_SWITCH, 'EI_YEAR_SWITCH');
  add(dayAfter(EI_WAITING_WAIVER.to.slice(5)), 'EI_WAITING_WAIVER ends');
  return out;
}

test('dayAfter and windowGates give the first closed day, across the year end', () => {
  assert.equal(dayAfter('12-31'), '01-01');
  assert.equal(dayAfter('02-28'), '03-01');
  assert.equal(dayAfter('01-31'), '02-01');
  assert.equal(dayAfter('10-09'), '10-10');
  assert.deepEqual(windowGates({ from: '10-15', to: '12-31' }), ['10-15', '01-01']);
});

test('every window boundary in the code is a gate date', () => {
  const gates = new Set(GATE_DATES.map((g) => g.md));
  for (const [md, why] of boundaries()) assert.ok(gates.has(md), `${md} (${why.join('; ')}) is missing from GATE_DATES`);
});

test('every gate date is a boundary something in the code still has', () => {
  const b = boundaries();
  for (const g of GATE_DATES) assert.ok(b.has(g.md), `GATE_DATES ${g.md} matches no window: remove it, and its schedule line`);
  assert.equal(new Set(GATE_DATES.map((g) => g.md)).size, GATE_DATES.length, 'no gate twice');
});

test('every gate date has a schedule line that lands on that Pacific day', () => {
  for (const g of GATE_DATES) {
    const lines = CRONS.filter((c) => c.md === g.md);
    assert.ok(lines.length, `no cron line in rebuild-on-gate-dates.yml for ${g.md}`);
    /* 08:00-23:59 UTC is the same calendar day in BC on UTC-7 and UTC-8. */
    for (const c of lines) assert.ok(c.hour >= 8 && c.hour <= 23, `${c.line}: hour ${c.hour} UTC can fall on the day before in BC`);
  }
});

test('every schedule line is for a gate date', () => {
  const gates = new Set(GATE_DATES.map((g) => g.md));
  assert.ok(CRONS.length >= GATE_DATES.length);
  for (const c of CRONS) assert.ok(gates.has(c.md), `${c.line} is for no GATE_DATES day`);
});

test('the job builds, rehashes, pushes, waits and sends IndexNow, in that order', () => {
  const steps = ['npm ci', 'npm run build', 'npm run hashes', 'git add data/page-hashes.json lib/url-dates.ts', 'git push origin HEAD:main', 'sleep 150', 'scripts/indexnow-deploy.mjs --from'];
  const jobs = WORKFLOW.slice(WORKFLOW.indexOf('jobs:\n'));
  let last = -1;
  for (const s of steps) {
    const i = jobs.indexOf(s, last + 1);
    assert.ok(i > last, `"${s}" missing or out of order`);
    last = i;
  }
  assert.match(WORKFLOW, /fetch-depth: 0/);
});

/* ---- the shelf (item 538) --------------------------------------------- */

const PUBLISHED = new Set(guides.map((g) => g.slug));
const FLAGS = { FIRST_HOLIDAYS_CLEARED };

/** True when an href lands on a published page, and on a heading the page
 *  prints when it carries an anchor. */
function resolves(href: string): boolean {
  const [path, anchor] = href.split('#');
  const m = path!.match(/^\/(guides|resources)\/([a-z0-9-]+)$/);
  if (!m) return false;
  const page = m[1] === 'guides' ? getGuide(m[2]!) : getResource(m[2]!);
  if (!page || !(m[1] === 'guides' ? PUBLISHED.has(m[2]!) : true)) return false;
  if (!anchor) return true;
  return page.sections.some((s) => headingId(s.h2) === anchor);
}

test('every live shelf link resolves to a published page, in every shelf window', () => {
  for (const day of ['2026-10-15T19:00:00Z', '2026-11-20T19:00:00Z', '2026-12-31T19:00:00Z', '2027-01-01T19:00:00Z', '2027-01-31T19:00:00Z']) {
    const links = liveShelfLinks(PUBLISHED, FLAGS, at(day));
    assert.ok(links.length >= 2, `${day}: a shelf of ${links.length}`);
    for (const l of links) assert.ok(resolves(l.href), `${day}: ${l.href} is not a live page`);
  }
});

test('a draft guide or an unset flag keeps its link off the shelf', () => {
  const autumn = at('2026-11-20T19:00:00Z');
  const holidays = 'holidays-with-family-you-find-difficult';
  assert.ok(draftGuides.some((g) => g.slug === holidays) && !PUBLISHED.has(holidays), 'the holidays guide is still a draft');
  const hrefs = liveShelfLinks(PUBLISHED, FLAGS, autumn).map((l) => l.href);
  assert.ok(!hrefs.some((h) => h.includes(holidays)));
  if (!FIRST_HOLIDAYS_CLEARED) assert.ok(!hrefs.some((h) => h.includes('#the-first-holidays-after-a-loss')));
  /* With both published, both appear: the filter is what hides them. */
  const all = liveShelfLinks(new Set([...PUBLISHED, holidays]), { FIRST_HOLIDAYS_CLEARED: true }, autumn).map((l) => l.href);
  assert.ok(all.some((h) => h.includes(holidays)));
  assert.ok(all.some((h) => h.endsWith('#the-first-holidays-after-a-loss')));
});

test('the shelf carries the year-end page in the autumn, the reset pages in January, and nothing in summer', () => {
  assert.ok(liveShelfLinks(PUBLISHED, FLAGS, at('2026-10-20T19:00:00Z')).some((l) => l.href === YEAR_END_PATH));
  const jan = liveShelfLinks(PUBLISHED, FLAGS, at('2027-01-10T19:00:00Z')).map((l) => l.href);
  assert.ok(!jan.includes(YEAR_END_PATH), 'no year-end link after 31 December');
  assert.ok(jan.includes('/resources/does-my-plan-cover-counselling-bc'));
  assert.ok(jan.includes('/guides/return-to-work-after-a-mental-health-leave'));
  assert.equal(activeShelf(at('2026-07-01T19:00:00Z')), null);
  assert.equal(activeShelf(at('2027-02-01T19:00:00Z')), null);
});

test('the shelf is a server component wired into /guides and the homepage list', () => {
  const comp = readFileSync(join(ROOT, 'components', 'SeasonalShelf.tsx'), 'utf8');
  assert.doesNotMatch(comp, /['"]use client['"]/);
  assert.match(readFileSync(join(ROOT, 'app', 'guides', 'page.tsx'), 'utf8'), /<SeasonalShelf variant="block" \/>/);
  const home = readFileSync(join(ROOT, 'app', 'page.tsx'), 'utf8');
  const i = home.indexOf('Most people arrive with a situation');
  const j = home.indexOf('<SeasonalShelf variant="cell" />');
  assert.ok(i > 0 && j > i && j < home.indexOf('WHERE YOU ARE'), 'one cell, inside the situation grid');
});

/* ---- the sick-days guide's reset section (item 576) -------------------- */

test('the sick-days guide carries the reset section from 1 Dec to 31 Jan, cited, with a permanent FAQ and a shelf link', () => {
  const g = getGuide('sick-days-and-mental-health-days-bc')!;
  assert.ok(g.seasonal);
  assert.equal(g.seasonal.from, '12-01');
  assert.equal(g.seasonal.to, '01-31');
  assert.equal(activeSeasonal(g.seasonal, at('2026-11-30T19:00:00Z')), null);
  assert.ok(activeSeasonal(g.seasonal, at('2026-12-01T19:00:00Z')));
  assert.ok(activeSeasonal(g.seasonal, at('2027-01-31T19:00:00Z')));
  assert.equal(activeSeasonal(g.seasonal, at('2027-02-01T19:00:00Z')), null);
  assert.match(g.seasonal.body.join('\n'), /bclaws\.gov\.bc\.ca/);
  assert.ok(g.faqs.some((f) => f.q === 'Do BC sick days reset on January 1?'));
  const href = '/guides/sick-days-and-mental-health-days-bc';
  const on = (iso: string) => liveShelfLinks(PUBLISHED, FLAGS, at(iso)).some((l) => l.href === href);
  assert.ok(!on('2026-11-20T19:00:00Z'), 'not on the shelf before the section opens');
  assert.ok(on('2026-12-10T19:00:00Z'));
  assert.ok(on('2027-01-10T19:00:00Z'));
});

/* ---- the winter guide's dated section (item 512) ----------------------- */

test('the winter guide carries the time-change section from 20 Oct to 28 Feb, and the page renders it', () => {
  const g = getGuide('low-mood-through-a-bc-winter')!;
  assert.ok(g.seasonal);
  assert.equal(g.seasonal.from, '10-20');
  assert.equal(g.seasonal.to, '02-28');
  assert.ok(activeSeasonal(g.seasonal, at('2026-11-02T19:00:00Z')));
  assert.ok(activeSeasonal(g.seasonal, at('2027-02-28T19:00:00Z')));
  assert.equal(activeSeasonal(g.seasonal, at('2027-03-01T19:00:00Z')), null);
  assert.equal(inSeason(g.seasonal.from, g.seasonal.to, at('2026-10-19T19:00:00Z')), false);
  const body = g.seasonal.body.join('\n');
  assert.match(body, /gov\.bc\.ca/);
  assert.match(body, /nrc\.canada\.ca/);
  assert.match(body, /9:05 a\.m\./);
  assert.ok(g.faqs.some((f) => f.q === 'Does ending the time change affect winter low mood?'));
  assert.ok(g.sources.some((s) => s.url === 'https://sad.psychiatry.ubc.ca/'));
  assert.ok(g.sources.some((s) => s.url.includes('healthlinkbc.ca/healthwise/light-therapy')));
  const page = readFileSync(join(ROOT, 'app', 'guides', '[slug]', 'page.tsx'), 'utf8');
  assert.match(page, /activeSeasonal\(g\.seasonal\)/);
  assert.match(page, /\{i === 0 && seasonal && \(/);
});
