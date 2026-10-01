import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allowedDetail, acceptedDetail, landingKeyOk, splitLandingKey, EMAIL_LOCATIONS, BOOK_LOCATIONS } from '@/lib/conversion-detail';
import { bookingCredit, funnelCuts, withIncrement, parseConversions, type ConversionLog } from '@/lib/conversion-log';
import { weekTable, slotSupply, parseSnapshot, type Snapshot } from '@/lib/conversion-snapshots';
import { parsePagesCsv, pageClass, summariseGsc, gscLines, readGscSummary, newestGscDate } from '@/lib/gsc-summary';
import { rateRatio, verdictOf, touches, readout, dueChanges, readChanges, changeLines, type Change } from '@/lib/change-register';
import { measurementWarnings } from '@/lib/cron-health';
import { creditLines } from '@/lib/funnel-report';
import { bookingFor } from '@/lib/booking-cta';
import { WHICH_SERVICE_OUTCOMES } from '@/lib/tools';

/* THE MEASUREMENT BATCH — 1 Oct 2026: Cliniko-confirmed bookings (102),
 * landing and button credit (105), the eight-week table (121), the change
 * register (122), email clicks (149), the staff switch (150), Search Console
 * on /admin (176) and tool results that book the right counsellor (185). */

delete process.env.BLOB_READ_WRITE_TOKEN;
const ROOT = process.cwd();
const src = (f: string) => readFileSync(join(ROOT, f), 'utf8');

const log = (o: Partial<ConversionLog>): ConversionLog => ({ events: {}, details: {}, total: 0, since: '', updatedAt: '', ...o });

/* ---- 102: scheduler_booked ---------------------------------------------- */

test('scheduler_booked takes the scheduler keys, and nothing typed', () => {
  assert.equal(allowedDetail('scheduler_booked', 'camille-granda'), 'camille-granda');
  assert.equal(allowedDetail('scheduler_booked', 'portal:savneet-singh'), 'portal:savneet-singh');
  assert.equal(allowedDetail('scheduler_booked', 'someone-else'), null);
  assert.equal(allowedDetail('scheduler_booked', '2026-10-02 10:00'), null);
});

test('the calendar listens for Cliniko’s confirmation from cliniko.com only, once', () => {
  const s = src('components/SchedulerTelemetry.tsx');
  assert.match(s, /addEventListener\('message'/);
  assert.match(s, /removeEventListener\('message'/);
  assert.match(s, /cliniko-bookings-page:confirmed/);
  assert.match(s, /endsWith\('\.cliniko\.com'\)/);
  assert.match(s, /startsWith\('https:\/\/'\)/);
  assert.match(s, /if \(booked\) return;/);
  assert.match(s, /track\('scheduler_booked', \{ page, detail: who \}\)/);
  assert.match(src('lib/analytics.ts'), /\| 'scheduler_booked'/);
});

test('funnelCuts carries booked beside seen and touched', () => {
  const { calendar } = funnelCuts(log({
    events: { scheduler_visible: { '/book': 3 }, scheduler_booked: { '/book': 1 } },
    details: { scheduler_visible: { 'camille-granda': 3 }, scheduler_booked: { 'camille-granda': 1 } },
  }));
  assert.deepEqual(calendar, [{ who: 'camille-granda', surface: 'book', seen: 3, touched: 0, opened: 0, booked: 1 }]);
});

/* ---- 105: landing and button credit ------------------------------------- */

test('a landing key is a lower-case path and a word from the lists', () => {
  assert.ok(landingKeyOk('/resources/workplace-mental-health-bc|google'));
  assert.ok(landingKeyOk('/|none'));
  assert.ok(landingKeyOk('/book|gbp'));
  assert.ok(!landingKeyOk('/book|someone@example.com'));
  assert.ok(!landingKeyOk('/Book|google'));
  assert.ok(!landingKeyOk('/book?with=x|google'));
  assert.ok(!landingKeyOk('https://evil.example/|google'));
  assert.ok(!landingKeyOk(`/${'a'.repeat(75)}|google`));
  assert.equal(allowedDetail('click_from', '/guides/stress-leave-bc|bing'), '/guides/stress-leave-bc|bing');
  assert.equal(allowedDetail('booked_from', 'not a path|google'), null);
  assert.equal(allowedDetail('landing', '/guides/x|google'), null, 'the shape is for the two credit events only');
  assert.deepEqual(splitLandingKey('/a/b|ai'), { path: '/a/b', via: 'ai' });
});

test('booked_via is a button from the list or direct', () => {
  assert.equal(allowedDetail('booked_via', 'sticky'), 'sticky');
  assert.equal(allowedDetail('booked_via', 'direct'), 'direct');
  assert.equal(allowedDetail('booked_via', 'sticky/camille-granda'), null, 'the button half only');
  for (const b of BOOK_LOCATIONS) assert.equal(allowedDetail('booked_via', b), b);
});

test('bookingCredit joins clicks and bookings per landing and per button', () => {
  let l = parseConversions(null);
  const at = '2026-10-02T00:00:00Z';
  l = withIncrement(l, 'book_click', '/', 'header', at);
  l = withIncrement(l, 'book_click', '/', 'header', at);
  l = withIncrement(l, 'book_click', '/guides/x', 'cta-band/camille-granda', at);
  l = withIncrement(l, 'click_from', '/', '/guides/x|google', at);
  l = withIncrement(l, 'click_from', '/', '/guides/x|google', at);
  l = withIncrement(l, 'click_from', '/guides/x', '/|none', at);
  l = withIncrement(l, 'booked_from', '/book', '/guides/x|google', at);
  l = withIncrement(l, 'booked_via', '/book', 'header', at);
  l = withIncrement(l, 'booked_via', '/book', 'direct', at);
  const c = bookingCredit(l);
  assert.deepEqual(c.byLanding[0], { path: '/guides/x', via: 'google', clicks: 2, booked: 1 });
  assert.deepEqual(c.byButton.find((b) => b.button === 'header'), { button: 'header', clicks: 2, booked: 1 });
  assert.deepEqual(c.byButton.find((b) => b.button === 'direct'), { button: 'direct', clicks: 0, booked: 1 });
  assert.equal(c.booked, 2);
  assert.equal(c.bookedWithLanding, 1);
  const lines = creditLines(c).join('\n');
  assert.match(lines, /\/guides\/x \(google\)/);
  assert.match(lines, /booked in a visit with no landing kept/);
});

test('the browser keeps the landing and the last button, and sends credit beside the events', () => {
  const a = src('lib/analytics.ts');
  assert.match(a, /event === 'book_click'/);
  assert.match(a, /\['click_from', from\]/);
  assert.match(a, /'booked_via', session\(LAST_BUTTON_KEY\) \|\| 'direct'/);
  assert.match(a, /startsWith\('portal:'\)/, 'a portal rebooking is not credited to a landing');
  const an = src('components/Analytics.tsx');
  assert.match(an, /sessionStorage\.setItem\(LANDING_KEY, `\$\{window\.location\.pathname\}\|\$\{linkChannel \?\? cls\}`\)/);
  /* The perf lesson: no data module in the browser bundle for this. */
  for (const f of ['lib/analytics.ts', 'components/Analytics.tsx', 'components/MailLink.tsx', 'components/NoCountSwitch.tsx']) {
    assert.doesNotMatch(src(f), /lib\/(practitioners|tools|conversion-detail)'/, `${f} imports a data module`);
  }
});

/* ---- 121: eight weeks --------------------------------------------------- */

const snap = (takenAt: string, conv: Partial<ConversionLog>, bookings?: unknown, slots?: Snapshot['slots']): Snapshot => ({
  takenAt, conversions: log(conv), ...(bookings ? { bookings } : {}), ...(slots ? { slots } : {}),
});
const tally = (rows: Record<string, Record<string, number>>) => ({ months: { '2026-10': rows }, updatedAt: '' });

test('weekTable diffs neighbouring snapshots, per counsellor, with bookings and slots', () => {
  const older = snap('2026-10-05T08:00:00Z',
    { events: { landing: { '/': 10 }, book_click: { '/': 4 }, scheduler_booked: { '/book': 1, '/client-portal': 1 } },
      details: { book_click: { 'header': 3, 'sticky/camille-granda': 1 }, scheduler_booked: { 'camille-granda': 1, 'portal:camille-granda': 1 } } },
    tally({ 'camille-granda': { consultBooked: 2, consultHeld: 1, paidBooked: 1, dna: 0 } }),
    { 'camille-granda': { count: 6, days: ['Tue', 'Sat'] }, 'savneet-singh': { count: 3, days: ['Mon'] } });
  const newer = snap('2026-10-12T08:00:00Z',
    { events: { landing: { '/': 25 }, book_click: { '/': 9 }, scheduler_booked: { '/book': 3, '/client-portal': 2 } },
      details: { book_click: { 'header': 5, 'sticky/camille-granda': 4 }, scheduler_booked: { 'camille-granda': 3, 'portal:camille-granda': 2 } } },
    tally({ 'camille-granda': { consultBooked: 5, consultHeld: 3, paidBooked: 2, dna: 1 } }));
  const rows = weekTable([newer, older], ['camille-granda', 'savneet-singh'], [
    { createdAt: '2026-10-07T00:00:00Z', practitioner: 'camille-granda' },
    { createdAt: '2026-10-01T00:00:00Z', practitioner: 'camille-granda' },
  ]);
  const all = rows.find((r) => r.who === 'all')!;
  assert.equal(all.landing, 15);
  assert.equal(all.bookClick, 5);
  assert.equal(all.booked, 2, '/book only; the portal is a rebooking');
  assert.equal(all.consultBooked, 3);
  assert.equal(all.slots, 9);
  assert.equal(all.timeRequests, 1);
  assert.deepEqual(all.partial, []);
  const cam = rows.find((r) => r.who === 'camille-granda')!;
  assert.equal(cam.landing, null, 'a landing has no counsellor');
  assert.equal(cam.bookClick, 3);
  assert.equal(cam.booked, 2);
  assert.equal(cam.dna, 1);
  assert.equal(cam.slots, 6);
  const sav = rows.find((r) => r.who === 'savneet-singh')!;
  assert.equal(sav.consultBooked, 0);
  assert.equal(sav.slots, 3);
});

test('weekTable says when a week is partial and a column did not exist', () => {
  const a = snap('2026-10-05T08:00:00Z', { events: { book_click: { '/': 1 } } });
  const b = snap('2026-10-16T08:00:00Z', { events: { book_click: { '/': 2 }, scheduler_booked: { '/book': 1 } }, firstSeen: { scheduler_booked: '2026-10-09' } });
  const [all] = weekTable([b, a], []);
  assert.equal(all.visible, null);
  assert.equal(all.booked, 1);
  assert.equal(all.consultBooked, null, 'no tally copied');
  assert.ok(all.partial.some((p) => p.includes('11 days')));
  assert.ok(all.partial.some((p) => p.includes('scheduler booked counted from 2026-10-09')));
  assert.ok(all.partial.includes('no booking tally copied'));
});

test('a snapshot keeps slots as a count and weekdays, and nothing else', () => {
  assert.deepEqual(
    slotSupply({ 'camille-granda': { count: 4, days: ['Tue'], next: ['Thu 18 Sep, 10:00 am'] } as never, bad: { error: 'x' }, 'Not A Slug': { count: 1 } }),
    { 'camille-granda': { count: 4, days: ['Tue'] } },
  );
  assert.deepEqual(parseSnapshot({ takenAt: 'x', conversions: {}, slots: { 'a-b': { count: 2, days: ['Mon'] } } })?.slots, { 'a-b': { count: 2, days: ['Mon'] } });
});

/* ---- 122: the change register ------------------------------------------- */

test('the rate ratio interval says too few when it spans no change or a count is zero', () => {
  assert.equal(rateRatio(0, 3, 10, 10), null);
  assert.match(verdictOf(rateRatio(4, 6, 40, 40)), /^too few to tell/);
  const big = rateRatio(100, 300, 1000, 1000)!;
  assert.ok(big.low > 1, 'a tripling on these counts is clear');
  assert.match(verdictOf(big), /^up ×3/);
  assert.match(verdictOf(rateRatio(300, 100, 1000, 1000)), /^down/);
});

test('touched pages: prefixes, exact pages, and / as the homepage only', () => {
  const c = { pages: ['/', '/services/', '/punjabi'] };
  assert.ok(touches(c, '/'));
  assert.ok(touches(c, '/services/couples-therapy'));
  assert.ok(touches(c, '/punjabi'));
  assert.ok(touches(c, '/punjabi/regions'));
  assert.ok(!touches(c, '/punjabi-counselling'));
  assert.ok(!touches(c, '/guides/x'));
});

const CH: Change = { id: 't', date: '2026-10-01', pages: ['/services/'], metric: 'conv:book_click', readAfter: '2026-10-29' };

test('a readout compares touched and untouched pages across three snapshots', () => {
  const s0 = snap('2026-09-03T08:00:00Z', { events: { book_click: { '/services/a': 10, '/': 100 } } });
  const s1 = snap('2026-10-01T08:00:00Z', { events: { book_click: { '/services/a': 20, '/': 200 } } });
  const s2 = snap('2026-10-29T08:00:00Z', { events: { book_click: { '/services/a': 50, '/': 300 } } });
  const r = readout(CH, [s2, s1, s0], []);
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.touched, { before: 10, after: 30 });
  assert.deepEqual(r.untouched, { before: 100, after: 100 });
  assert.equal(r.interval?.ratio, 3);
});

test('with no snapshot before, the log since its start is the baseline; with none at all it says so', () => {
  const s1 = snap('2026-10-05T08:00:00Z', { events: { book_click: { '/services/a': 20, '/': 200 } }, since: '2026-08-18T00:00:00Z' });
  const s2 = snap('2026-10-29T08:00:00Z', { events: { book_click: { '/services/a': 50, '/': 300 } }, since: '2026-08-18T00:00:00Z' });
  const r = readout(CH, [s2, s1], []);
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.touched, { before: 20, after: 30 });
  const none = readout(CH, [], []);
  assert.equal(none.status, 'no-data');
  assert.match(none.reason!, /there are none yet/);
  assert.equal(readout({ ...CH, metric: 'none' }, [], []).status, 'measurement');
});

test('gsc:clicks reads the export at the change against the one 28 days on', () => {
  const r = readout({ ...CH, metric: 'gsc:clicks' }, [], [
    { date: '2026-09-26', rows: [{ path: '/services/a', clicks: 10 }, { path: '/', clicks: 50 }] },
    { date: '2026-10-27', rows: [{ path: '/services/a', clicks: 20 }, { path: '/', clicks: 50 }] },
  ]);
  assert.equal(r.status, 'ok');
  assert.deepEqual(r.touched, { before: 10, after: 20 });
});

test('the register is seeded with today’s batches, each read 28 days on', () => {
  const changes = readChanges(join(ROOT, 'data', 'changes.json'));
  const ids = changes.map((c) => c.id.replace('2026-10-01-', ''));
  for (const b of ['mail', 'funnel', 'book', 'services', 'cards', 'language', 'trust', 'tech', 'schema']) assert.ok(ids.includes(b), b);
  for (const c of changes) {
    assert.match(c.metric, /^(conv:[a-z_]+|gsc:clicks|tally:[a-zA-Z]+|none)$/);
    assert.equal((Date.parse(c.readAfter) - Date.parse(c.date)) / 864e5, 28, c.id);
  }
  assert.deepEqual(dueChanges(changes, [], [], new Date('2026-10-15T00:00:00Z')), []);
  const due = dueChanges(changes, [], [], new Date('2026-10-30T00:00:00Z'));
  assert.equal(due.length, changes.length);
  assert.match(changeLines(due).join('\n'), /Changes whose 28 days are up/);
});

/* ---- 149: email clicks --------------------------------------------------- */

test('email_click is counted, from the fixed list of places', () => {
  assert.deepEqual([...EMAIL_LOCATIONS], ['sticky', 'book-fallback', 'contact', 'footer', 'refer']);
  for (const w of EMAIL_LOCATIONS) assert.equal(acceptedDetail('email_click', w), w);
  assert.equal(acceptedDetail('email_click', 'someone@example.com'), null);
  assert.match(src('lib/conversion-log.ts'), /'email_click',\r?\n\]\);/);
});

test('every mailto: to the practice in these files goes through MailLink', () => {
  for (const f of ['app/book/page.tsx', 'app/contact/page.tsx', 'components/Footer.tsx', 'components/StickyBook.tsx',
    'app/refer/counsellors/page.tsx', 'app/refer/doctor/page.tsx', 'app/refer/handout/page.tsx']) {
    const s = src(f);
    assert.doesNotMatch(s, /href=\{`mailto:/, `${f} still has a bare mailto:`);
    assert.match(s, /<MailLink where="/, f);
  }
  assert.match(src('components/MailLink.tsx'), /track\('email_click', \{ location: where, detail: where \}\)/);
});

/* ---- 150: the staff switch ----------------------------------------------- */

test('track returns before sending anything in an excluded browser', () => {
  const a = src('lib/analytics.ts');
  assert.match(a, /export const NO_COUNT_KEY = 'wp-no-count'/);
  const body = a.slice(a.indexOf('export function track('));
  assert.ok(body.indexOf('if (excludedBrowser()) return;') < body.indexOf('window.gtag'), 'excluded before GA too');
  assert.match(a, /try \{\s+return !!window\.localStorage\.getItem\(NO_COUNT_KEY\);\s+\} catch/);
  assert.match(src('app/admin/page.tsx'), /<NoCountSwitch \/>/);
});

/* ---- 176: Search Console and stale measurement --------------------------- */

const CSV = [
  'Top pages,Clicks,Impressions,CTR,Position',
  'https://www.westpeakwellness.com/,54,241,22.41%,9.06',
  'https://www.westpeakwellness.com/careers,34,582,5.84%,8.1',
  'https://www.westpeakwellness.com/resources/workplace-mental-health-bc,17,1884,0.9%,11.76',
  '"https://www.westpeakwellness.com/services/couples-therapy",3,100,3%,12',
].join('\n');

test('the Pages export parses and pages fall into money, info and other', () => {
  const rows = parsePagesCsv(CSV);
  assert.equal(rows.length, 4);
  assert.deepEqual(rows[3], { path: '/services/couples-therapy', clicks: 3, impressions: 100, position: 12 });
  assert.equal(pageClass('/'), 'money');
  assert.equal(pageClass('/practitioners/camille-granda/calgary'), 'money');
  assert.equal(pageClass('/guides/stress-leave-bc'), 'info');
  assert.equal(pageClass('/careers'), 'other');
});

test('the newest export is set against the mean of the ones before, with movers', () => {
  const rows = parsePagesCsv(CSV);
  const older = rows.map((r) => ({ ...r, clicks: r.path === '/' ? 30 : r.clicks }));
  const s = summariseGsc([{ date: '2026-09-17', rows: older }, { date: '2026-09-26', rows }])!;
  assert.equal(s.newest, '2026-09-26');
  assert.deepEqual(s.compared, ['2026-09-17']);
  assert.equal(s.groups.money.now.clicks, 57);
  assert.equal(s.groups.money.avg?.clicks, 33);
  assert.equal(s.groups.info.now.impressions, 1884);
  assert.deepEqual(s.movers.money[0], { path: '/', clicks: 54, before: 30, delta: 24, position: 9.06 });
  const text = gscLines({ status: 'ok', summary: s }, 12).join('\n');
  assert.match(text, /Pages that book/);
  assert.match(text, /arriving from Google.*12/);
});

test('the committed exports are found and read', () => {
  const r = readGscSummary(join(ROOT, 'data', 'gsc'));
  assert.equal(r.status, 'ok');
  assert.match(newestGscDate(join(ROOT, 'data', 'gsc')) ?? '', /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(readGscSummary(join(ROOT, 'no-such-dir')).status, 'absent');
});

test('stale measurement is listed: GSC over 10 days, no snapshot in 8, no report after the 2nd', () => {
  const now = Date.parse('2026-10-08T12:00:00Z');
  const w = measurementWarnings({ gscNewest: '2026-09-26', snapshotNewest: '2026-09-28T08:00:00Z', health: {} }, now);
  assert.deepEqual(w.map((x) => x.job), ['gsc-pull', 'weekly-snapshot', 'funnel-report']);
  const ok = measurementWarnings({
    gscNewest: '2026-10-05', snapshotNewest: '2026-10-05T08:00:00Z',
    health: { 'funnel-report': { job: 'funnel-report', at: '2026-10-01T15:00:00Z', ok: true, detail: '' } },
  }, now);
  assert.deepEqual(ok, []);
  assert.deepEqual(measurementWarnings({ gscNewest: '2026-10-01', snapshotNewest: '2026-10-01', health: {} }, Date.parse('2026-10-02T12:00:00Z')), []);
});

/* ---- 185: tool results book the counsellor who offers the service -------- */

test('a couples or EMDR result opens the calendar of the counsellor who offers it', () => {
  assert.equal(bookingFor('couples-therapy').href, '/book?with=camille-granda');
  assert.equal(bookingFor('individual-therapy').href, '/book');
  const trauma = WHICH_SERVICE_OUTCOMES.find((o) => o.tag === 'trauma')!;
  assert.equal(trauma.href, '/services/emdr-therapy');
  assert.match(src('components/tools/ResultCta.tsx'), /href=\{href \?\? site\.bookingPath\}/);
  assert.match(src('components/tools/ResultCta.tsx'), /bookClickDetail\(`tool:\$\{tool\}`, withSlugOf\(href\)\)/);
  assert.match(src('app/tools/which-service/page.tsx'), /<WhichServiceTool bookHrefs=\{BOOK_HREFS\} \/>/);
  assert.match(src('app/tools/therapy-cost-bc/page.tsx'), /bookingFor\('couples-therapy'\)\.href/);
});
