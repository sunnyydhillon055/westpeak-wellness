import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  PLAN_RESET_PAGE_WINDOW, PLAN_RESET_MAIL_WINDOW, PLAN_RESET_LINE, SEASONAL_WINDOWS,
  PLAN_YEAR_MAIL_PARAGRAPH, planResetPageLineShown, planResetMailParagraph, seasonalMailParagraph,
  planYearPageLineShown,
} from '../lib/seasonal.ts';
import { bookSummary, loadAvailability, resetAvailabilityForTests, type ClientAvailability } from '../lib/consult-slot.ts';
import { availabilityLine, summariseWindows } from '../lib/availability-summary.ts';
import { shortAvailabilityLine } from '../lib/book-card.ts';
import { imgProps } from '../lib/img-props.ts';
import { getImageProps } from 'next/dist/shared/lib/image-external.js';

const ROOT = process.cwd();
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
/* 19:00Z is late morning Pacific all year, well away from midnight. */
const at = (iso: string) => new Date(iso);

/* ---------- 513: the January counterpart ---------- */

test('the reset windows are the decided dates and never overlap the autumn ones', () => {
  assert.deepEqual(PLAN_RESET_PAGE_WINDOW, { from: '01-01', to: '02-15' });
  assert.deepEqual(PLAN_RESET_MAIL_WINDOW, { from: '01-05', to: '02-15' });
  assert.deepEqual(Object.keys(SEASONAL_WINDOWS).sort(), [
    'PLAN_RESET_MAIL_WINDOW', 'PLAN_RESET_PAGE_WINDOW', 'PLAN_YEAR_MAIL_WINDOW', 'PLAN_YEAR_PAGE_WINDOW',
  ]);
  for (const iso of ['2026-10-15T19:00:00Z', '2026-12-31T19:00:00Z', '2027-01-01T19:00:00Z', '2027-02-15T19:00:00Z', '2027-02-16T19:00:00Z']) {
    assert.ok(!(planYearPageLineShown(at(iso)) && planResetPageLineShown(at(iso))), iso);
  }
  assert.equal(planResetPageLineShown(at('2026-12-31T19:00:00Z')), false);
  assert.equal(planResetPageLineShown(at('2027-01-01T19:00:00Z')), true);
  assert.equal(planResetPageLineShown(at('2027-02-15T19:00:00Z')), true);
  assert.equal(planResetPageLineShown(at('2027-02-16T19:00:00Z')), false);
  assert.equal(planResetPageLineShown(at('2026-10-15T19:00:00Z')), false, 'not today');
});

test('drafts and email 3 carry one seasonal paragraph: autumn, January, or none', () => {
  assert.equal(seasonalMailParagraph(at('2026-11-02T19:00:00Z')), PLAN_YEAR_MAIL_PARAGRAPH);
  assert.equal(seasonalMailParagraph(at('2026-12-28T19:00:00Z')), null);
  assert.equal(seasonalMailParagraph(at('2027-01-02T19:00:00Z')), null, 'the mail window opens on 5 January');
  assert.equal(seasonalMailParagraph(at('2027-01-05T19:00:00Z')), PLAN_RESET_LINE);
  assert.equal(planResetMailParagraph(at('2027-02-15T19:00:00Z')), PLAN_RESET_LINE);
  assert.equal(seasonalMailParagraph(at('2027-02-16T19:00:00Z')), null);
  assert.match(src('lib/reply-templates.ts'), /seasonalMailParagraph\(c\.now \?\? new Date\(\)\)/);
  assert.match(src('lib/nurture.ts'), /seasonalMailParagraph\(extras\.now \?\? new Date\(\)\)/);
});

test('the January line is plan-dependent and names no insurer, fee, time or outcome', () => {
  assert.match(PLAN_RESET_LINE, /runs on the calendar year/);
  assert.match(PLAN_RESET_LINE, /depending on the plan/);
  assert.doesNotMatch(PLAN_RESET_LINE, /\$|\bmost\b|evening|weekend|Pacific Blue Cross|Manulife|Sun Life|Canada Life|Green ?Shield/i);
  assert.doesNotMatch(PLAN_RESET_LINE, /'/, 'typographic apostrophes only');
  for (const f of ['app/pricing/page.tsx', 'components/CoverageLine.tsx', 'components/BookChoice.tsx']) {
    assert.match(src(f), /planResetPageLineShown\((now)?\) && \(/, f);
    assert.match(src(f), /\{PLAN_RESET_LINE\}/, f);
  }
});

test('the year-end page turns into the reset piece in the data, not the template', () => {
  const s = src('lib/resources-more2.ts');
  assert.match(s, /const YE_RESET = planResetPageLineShown\(\);/);
  for (const field of ['title', 'metaTitle', 'lede', 'shortAnswer']) {
    assert.match(s, new RegExp(`${field}: YE_RESET \\? RESET_COPY\\.${field} :`), field);
  }
  assert.match(s, /YE_RESET \? RESET_COPY\.first : \{\s+h2: 'The date of the session decides the year'/);
  assert.doesNotMatch(src('app/resources/[slug]/page.tsx'), /YE_RESET|RESET_COPY|planReset/, 'the template is untouched');
});

/* ---------- 514: /book and /contact prerendered ---------- */

test('/book and /contact read no query string on the server and call no Cliniko at render', () => {
  for (const f of ['app/book/page.tsx', 'app/contact/page.tsx']) {
    const s = src(f);
    assert.doesNotMatch(s, /searchParams/, f);
    assert.doesNotMatch(s, /consultationAvailability|cliniko-availability|export const (revalidate|dynamic)/, f);
  }
  assert.match(src('components/BookChoice.tsx'), /useSearchParams\(\)/);
  assert.match(src('components/BookChoice.tsx'), /<Suspense fallback=\{null\}>\s*<QueryProbe/);
  assert.match(src('components/SentInboundForm.tsx'), /<Suspense fallback=\{null\}>\s*<SentProbe/);
});

test('the islands import no large data module and no image component', () => {
  for (const f of ['components/BookChoice.tsx', 'components/SentInboundForm.tsx', 'components/SchedulerEmbedView.tsx']) {
    const s = src(f);
    assert.doesNotMatch(s, /from '[^']*(practitioners|tools|cliniko-catalog|cliniko-availability|conversion-detail|booking-cta|crisis|practice-facts)(\.ts)?'/, f);
    assert.doesNotMatch(s, /from 'next\/image'|ui\/Img'/, f);
    assert.doesNotMatch(s, /^import (?!type )[^\n]*img-props/m, f + ': only the type crosses into the browser');
  }
  assert.match(src('components/BookChoice.tsx'), /^'use client';/);
  assert.match(src('components/SentInboundForm.tsx'), /^'use client';/);
  /* What the browser reads from the practice's constants is in
     lib/site-client.ts (item 599, 16 Oct 2026), which sits in the root
     layout's chunk: a new export read there is a byte on every page
     (layoutJs). Only `site`, which the layout already ships, is read. */
  assert.match(src('components/BookChoice.tsx'), /^import \{ site \} from '@\/lib\/site-client';$/m);
  assert.doesNotMatch(src('components/SchedulerEmbedView.tsx'), /lib\/site'/);
});

test('the calendar is drawn closed until the address is read, and the arrival counts once it is', () => {
  const s = src('components/BookChoice.tsx');
  assert.match(s, /pending=\{!ready\}/);
  assert.match(s, /\{ready && <BookArrive /);
  assert.match(src('components/SchedulerEmbedView.tsx'), /placeholder && pending \?/);
  assert.match(src('components/SchedulerEmbed.tsx'), /<SchedulerEmbedView\b/);
});

test('the card and calendar-box lines read /api/availability the way the server read Cliniko', () => {
  const a = summariseWindows('camille-granda', ['2026-10-06T16:00:00Z', '2026-10-03T16:00:00Z'], ['2026-10-08T17:00:00Z']);
  const api: ClientAvailability = { 'camille-granda': { first: 'Camille', next: a.next, count: a.count } };
  const b = bookSummary(api, 'camille-granda')!;
  assert.equal(availabilityLine(b, 'Camille'), availabilityLine(a, 'Camille'));
  assert.equal(shortAvailabilityLine(b), shortAvailabilityLine(a));
  assert.equal(bookSummary(api, 'savneet-singh'), undefined, 'unknown prints nothing');
  assert.equal(availabilityLine(bookSummary(null, 'camille-granda'), 'Camille'), null);
});

test('loadAvailability keeps its signature for StickyBook', async () => {
  resetAvailabilityForTests();
  let asked = 0;
  const fetcher = async () => { asked++; return { ok: true, json: async () => ({ x: { first: 'X', next: [], count: 0 } }) }; };
  const one = await loadAvailability(fetcher, 1000);
  const two = await loadAvailability(fetcher, 2000);
  assert.equal(asked, 1);
  assert.deepEqual(one, two);
  resetAvailabilityForTests();
});

test('inline-css --check fails a sitemap URL with no prerendered document', () => {
  const s = src('scripts/inline-css.mjs');
  assert.match(s, /const ALLOW_PER_REQUEST = \{/);
  assert.doesNotMatch(s.slice(s.indexOf('const ALLOW_PER_REQUEST'), s.indexOf('const sitemapBodies')), /'\/(book|contact)'/, 'never allowed again');
  assert.match(s, /if \(failingPR\.length\) \{[\s\S]*?process\.exit\(1\);/);
  assert.match(s, /sitemap/);
});

/* ---------- 560 (round 11): bare /book shows the choice before the explainer ---------- */

test('bare /book renders "Who would you like to talk to?" straight after the facts, then the 15-minute explainer', () => {
  const s = src('components/BookChoice.tsx');
  const at = (re: RegExp) => {
    const m = re.exec(s);
    assert.ok(m, String(re));
    return m.index;
  };
  const facts = at(/<ul className="book-facts">/);
  const choose = at(/<div className="book-choose"/);
  const what = at(/<ul className="book-what">/);
  const calendar = at(/<div id="calendar"/);
  /* Measured on production at 375x812 on 16 Oct 2026 with the block moved in
     the DOM: the heading at y=562 and the first "Book with" button at 803
     (from 1,094 and 1,335); the page's own CSS takes 8px more off below
     520px. The order in the source is the order in the HTML. */
  assert.ok(facts < choose && choose < what && what < calendar, `facts ${facts}, choose ${choose}, what ${what}, calendar ${calendar}`);
  /* Still only on bare /book, and nothing went behind a disclosure. */
  assert.match(s, /\{accepting\.length > 1 && !who && \(\s*<div className="book-choose"/);
  assert.doesNotMatch(s.slice(facts, calendar), /<details/);
  const css = src('app/book/page.tsx');
  assert.ok(css.indexOf('.book-facts{margin-bottom:12px}') > css.indexOf('@media (max-width:520px){'), 'phones only');
});

/* ---------- 542: no next/image client chunk ---------- */

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e)) out.push(p.split('\\').join('/'));
  }
  return out;
};

test('nothing under app/ or components/ imports next/image', () => {
  for (const f of [...walk('app'), ...walk('components')]) {
    assert.doesNotMatch(readFileSync(f, 'utf8'), /from 'next\/image'/, f);
  }
  assert.match(src('components/ui/Photo.tsx'), /import Image from '@\/components\/ui\/Img';/);
  assert.match(src('components/ui/Img.tsx'), /preload\?\.\(a\.src, \{\s*as: 'image',/);
});

test('imgProps renders the attributes next/image would', () => {
  const cases = [
    { src: '/img/a.jpg', alt: 'A', fill: true, sizes: '(max-width: 860px) 100vw, 50vw', quality: 72 },
    { src: '/img/b.jpg', alt: '', width: 600, height: 800, sizes: '96px', className: 'bk-card__img' },
    { src: '/img/c.jpg', alt: 'C', width: 600, height: 800, sizes: '72px', priority: true, style: { borderRadius: '50%' } },
  ];
  for (const c of cases) {
    const mine = imgProps(c);
    const theirs = getImageProps(c).props as Record<string, unknown>;
    for (const k of ['src', 'srcSet', 'sizes', 'width', 'height', 'loading', 'decoding', 'fetchPriority', 'className', 'alt']) {
      assert.deepEqual(mine[k], theirs[k], `${c.src} ${k}`);
    }
    assert.deepEqual(mine.style, theirs.style, `${c.src} style`);
    assert.equal(mine['data-nimg'], c.fill ? 'fill' : '1');
  }
});
