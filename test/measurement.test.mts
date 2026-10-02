import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allowedDetail, acceptedDetail, landingKeyOk, splitLandingKey, EMAIL_LOCATIONS, BOOK_LOCATIONS } from '@/lib/conversion-detail';
import { bookingCredit, funnelCuts, withIncrement, parseConversions, type ConversionLog } from '@/lib/conversion-log';
import { weekTable, slotSupply, parseSnapshot, tallyStaleness, type Snapshot, type WeekRow, type InboundLite } from '@/lib/conversion-snapshots';
import { parsePagesCsv, pageClass, summariseGsc, gscLines, readGscSummary, newestGscDate, parseDatePageCsv, mondayOf, gscWeeks, gscWeekLines, readGscWeeks } from '@/lib/gsc-summary';
import { weeklyKpis } from '@/lib/weekly-kpis';
import { convertedConsults } from '@/lib/booking-followups';
import { conversionEvents } from '@/lib/booking-tally';
import { TALLY_FIELDS } from '@/lib/booking-tally-read';
import { CHANNELS, REFERRER_CLASSES, channelOf, referrerClass } from '@/lib/conversion-detail-client';
import { rateRatio, verdictOf, touches, readout, dueChanges, readChanges, changeLines, type Change } from '@/lib/change-register';
import { measurementWarnings } from '@/lib/cron-health';
import { creditLines, arrivalRows } from '@/lib/funnel-report';
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
  /* Since the batch-2 merge the count rides scheduler-mobile's single
     listener, which accepts a message only from the frame's own origin AND
     window (lib/cliniko-frame.ts fromFrame), stricter than *.cliniko.com. */
  assert.match(s, /fromFrame\(e\.origin, e\.source, frame\.src, frame\.contentWindow\)/);
  assert.match(s, /msg\.page === 'confirmed' && !confirmed/);
  assert.match(s, /track\('scheduler_booked', \{ page: ctx\.page, detail: ctx\.who \}\)/);
  assert.equal(s.match(/addEventListener\('message'/g)?.length, 1, 'one Cliniko listener');
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

test('the Pages export parses and pages fall into home, money, info and other', () => {
  const rows = parsePagesCsv(CSV);
  assert.equal(rows.length, 4);
  assert.deepEqual(rows[3], { path: '/services/couples-therapy', clicks: 3, impressions: 100, position: 12 });
  assert.equal(pageClass('/'), 'home', 'the home page is mostly brand searches, not a page that books');
  assert.equal(pageClass('/book'), 'money');
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
  assert.equal(s.groups.money.now.clicks, 3, 'home left out of the pages that book');
  assert.equal(s.groups.home.now.clicks, 54);
  assert.equal(s.groups.home.avg?.clicks, 30);
  assert.equal(s.groups.info.now.impressions, 1884);
  assert.deepEqual(s.movers.money, [], 'the home page is no longer a booking-page mover');
  const text = gscLines({ status: 'ok', summary: s }, 12).join('\n');
  assert.match(text, /Pages that book, home left out \(1\): 3 clicks/);
  assert.match(text, /The home page, mostly brand searches: 54 clicks/);
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

/* ---- round 4: the weekly outcome numbers (251, 255, 256, 277, 297) ------- */

const tally2 = (rows: Record<string, Record<string, number>>) => ({ months: { '2026-10': rows }, updatedAt: '' });
const inb = (o: Partial<InboundLite>): InboundLite => ({
  kind: 'enquiry', email: 'a.person@shaw.ca', name: 'Ana Reyes', message: 'Looking for a counsellor for anxiety.', source: '/contact',
  createdAt: '2026-10-07T17:00:00Z', ...o,
});

test('251: paid sessions held and cancelled, and real enquiries per week, answered within a business day', () => {
  const older = snap('2026-10-05T08:00:00Z', { events: {} },
    tally2({ 'camille-granda': { paidHeld: 4, paidCancelled: 1 } }));
  const newer = snap('2026-10-12T08:00:00Z', { events: {} },
    tally2({ 'camille-granda': { paidHeld: 7, paidCancelled: 2 }, 'savneet-singh': { paidHeld: 2 } }));
  const inbound = [
    inb({ practitioner: 'camille-granda', handledAt: '2026-10-08T16:00:00Z' }),            // Wed, answered Thu: in a day
    inb({ createdAt: '2026-10-09T20:00:00Z', handledAt: '2026-10-14T16:00:00Z' }),          // Fri, answered Wed: late
    inb({ createdAt: '2026-10-10T20:00:00Z' }),                                             // not answered
    inb({ email: 'probe@example.com' }),                                                    // a probe
    inb({ message: 'Get more google rankings with our SEO' }),                              // a script
    inb({ kind: 'lead', message: '' }),                                                     // a real lead
    inb({ kind: 'lead', message: '', triage: { band: 'quarantine' } as unknown as InboundLite['triage'] }), // honeypot
    inb({ createdAt: '2026-10-01T00:00:00Z' }),                                             // the week before
  ];
  const rows = weekTable([newer, older], ['camille-granda', 'savneet-singh'], [], inbound);
  const all = rows.find((r) => r.who === 'all')!;
  assert.equal(all.paidHeld, 5);
  assert.equal(all.paidCancelled, 1);
  assert.equal(all.enquiries, 3);
  assert.equal(all.answeredInDay, 1);
  assert.equal(all.leads, 1);
  const cam = rows.find((r) => r.who === 'camille-granda')!;
  assert.equal(cam.paidHeld, 3);
  assert.equal(cam.enquiries, 1);
  assert.equal(cam.answeredInDay, 1);
  /* Without inbound records the columns are unknown, not zero. */
  assert.equal(weekTable([newer, older], [])[0].enquiries, null);
});

test('255: a held consultation whose patient then books a paid session converts, once, credited to its counsellor', () => {
  const DAY = 864e5;
  const NOW = Date.parse('2026-10-20T18:00:00Z');
  const at = (d: number) => new Date(NOW - d * DAY).toISOString();
  const isConsult = (ap: { appointment_type?: { links?: { self?: string } } }) => (ap.appointment_type?.links?.self ?? '').endsWith('/c');
  const ap = (id: string, patient: string, daysAgo: number, consult: boolean, o: Record<string, unknown> = {}) => ({
    id, patient: { links: { self: `x/patients/${patient}` } }, starts_at: at(daysAgo), ends_at: at(daysAgo - 0.02),
    appointment_type: { links: { self: consult ? 'x/c' : 'x/p' } }, ...o,
  });
  const appts = [
    ap('c1', 'p1', 5, true), ap('s1', 'p1', -3, false),                         // converted, paid session ahead
    ap('c2', 'p2', 5, true),                                                    // nothing after
    ap('c3', 'p3', 5, true), ap('s3', 'p3', -3, false, { cancelled_at: at(1) }), // paid session cancelled
    ap('c4', 'p4', 5, true, { did_not_arrive: true }), ap('s4', 'p4', -3, false), // consult missed
    ap('c5', 'p5', -1, true), ap('s5', 'p5', -3, false),                        // consult not held yet
    ap('c6', 'p6', 9, true), ap('c7', 'p6', 4, true), ap('s6', 'p6', -2, false), // two consults: the earliest
  ];
  const conv = convertedConsults(appts, { now: NOW, isConsult });
  assert.deepEqual(conv.map((a) => a.id).sort(), ['c1', 'c6']);
  const ev = conversionEvents(conv, { now: NOW, slugFor: (a) => (a.id === 'c1' ? 'savneet-singh' : undefined) });
  assert.deepEqual(ev.map((e) => `${e.key}:${e.month}:${e.slug}:${e.field}`).sort(),
    ['v:c1:2026-10:savneet-singh:consultConverted', 'v:c6:2026-10:unknown:consultConverted']);
  assert.ok((TALLY_FIELDS as readonly string[]).includes('consultConverted'));
  /* The job emits it beside the other tally events, under the same ledger. */
  const notify = src('lib/booking-notify.ts');
  assert.match(notify, /conversionEvents\(convertedConsults\(appts,/);
  assert.match(notify, /\]\.filter\(\(e\) => !tallied\.has\(e\.key\)\)/);
});

test('255: new paying clients are null before the tally carries the field, and partial in the week it starts', () => {
  const a = snap('2026-10-05T08:00:00Z', { events: {} }, tally2({ x: { consultBooked: 1 } }));
  const b = snap('2026-10-12T08:00:00Z', { events: {} }, tally2({ x: { consultBooked: 2, consultConverted: 3 } }));
  const c = snap('2026-10-19T08:00:00Z', { events: {} }, tally2({ x: { consultBooked: 2, consultConverted: 4 } }));
  const [w2, w1] = weekTable([c, b, a], []);
  assert.equal(w2.converted, 1);
  assert.deepEqual(w2.partial, []);
  assert.equal(w1.converted, 3);
  assert.ok(w1.partial.some((p) => p.startsWith('new paying clients counted from this week')));
  assert.equal(weekTable([a, a], [])[0].converted, null);
});

test('256: a week whose tally copy was behind the booking job is partial; a quiet tally is not', () => {
  const fresh = { at: '2026-10-12T06:00:00Z', ok: true };
  const behind = { at: '2026-10-11T20:00:00Z', ok: true };
  assert.equal(tallyStaleness({ takenAt: '2026-10-12T08:00:00Z', bookingJob: fresh }), null);
  assert.match(tallyStaleness({ takenAt: '2026-10-12T08:00:00Z', bookingJob: behind }) ?? '', /had not run for 12 h/);
  assert.match(tallyStaleness({ takenAt: '2026-10-12T08:00:00Z', bookingJob: { ...fresh, ok: false } }) ?? '', /failed/);
  assert.equal(tallyStaleness({ takenAt: '2026-10-12T08:00:00Z' }), null, 'an older copy cannot tell');
  const a = { ...snap('2026-10-05T08:00:00Z', { events: {} }, tally2({ x: { paidHeld: 1 } })), bookingJob: { at: '2026-10-05T07:00:00Z', ok: true } };
  const b = { ...snap('2026-10-12T08:00:00Z', { events: {} }, tally2({ x: { paidHeld: 3 } })), bookingJob: behind };
  const [row] = weekTable([b, a], []);
  assert.match(row.tallyStale ?? '', /12 h/);
  assert.equal(parseSnapshot(JSON.parse(JSON.stringify(b)))?.bookingJob?.at, behind.at, 'the job time survives the round trip');
  /* Nine reads in parallel, not in sequence. */
  assert.match(src('lib/conversion-snapshots.ts'), /await Promise\.all\(newest\.map\(/);
});

const weekRow = (to: string, o: Partial<WeekRow> = {}): WeekRow => ({
  from: '', to, who: 'all', landing: null, bookClick: null, visible: 10, interact: null, booked: null,
  consultBooked: 2, consultHeld: null, paidBooked: null, dna: null, paidHeld: 6, paidCancelled: 0, converted: 1,
  enquiries: 2, leads: 1, answeredInDay: 2, slots: 9, slotDays: [], timeRequests: 0, partial: [], ...o,
});
const eightWeeks = (o: (i: number) => Partial<WeekRow>) =>
  Array.from({ length: 8 }, (_, i) => weekRow(new Date(Date.parse('2026-11-30T08:00:00Z') - i * 7 * 864e5).toISOString(), o(i)));

test('256: six tiles, each against last week and a four-week mean; a dash and a reason when not measured', () => {
  const none = weeklyKpis([], { status: 'absent', reason: 'no date-page export in data/gsc yet; the Monday pull writes one once GSC_SA_JSON is set in the repository secrets' });
  assert.deepEqual(none.map((t) => t.id), ['google', 'calendar', 'enquiries', 'consults', 'converted', 'paidHeld']);
  for (const t of none) {
    assert.equal(t.value, null, `${t.id} is not 0`);
    assert.ok(t.reason && t.reason.length > 10, `${t.id} says why`);
  }
  assert.match(none[0].reason!, /GSC_SA_JSON/);

  const rows = eightWeeks((i) => (i === 0 ? { converted: null } : i === 2 ? { partial: ['9 days between snapshots'] } : {}));
  const t = weeklyKpis(rows, { status: 'absent', reason: 'x' });
  const by = Object.fromEntries(t.map((x) => [x.id, x]));
  assert.equal(by.enquiries.value, 3);
  assert.match(by.enquiries.sub ?? '', /2 enquiries, 2 answered within a business day/);
  assert.equal(by.consults.sub, 'of 9 open consult slots');
  assert.equal(by.converted.value, null);
  assert.match(by.converted.reason ?? '', /1 Oct 2026/);
  assert.equal(by.paidHeld.last, 6);
  assert.equal(by.paidHeld.mean4, 6, 'the partial week is left out of the mean');
  assert.match(by.paidHeld.trendText, /too few weeks to tell \(7 of 8/);
});

test('256: an up or down mark only when the interval leaves out no change', () => {
  const steady = weeklyKpis(eightWeeks((i) => ({ paidHeld: i % 2 ? 6 : 7 })), { status: 'absent', reason: 'x' }).find((x) => x.id === 'paidHeld')!;
  assert.equal(steady.trend, null);
  assert.match(steady.trendText, /^too few to tell/);
  const rising = weeklyKpis(eightWeeks((i) => ({ paidHeld: i < 4 ? 30 : 8 })), { status: 'absent', reason: 'x' }).find((x) => x.id === 'paidHeld')!;
  assert.equal(rising.trend, 'up');
  assert.match(rising.trendText, /^up ×3\.75, last four weeks against the four before \(32 then 120\)/);
  /* A stale tally leaves the calendar count whole. */
  const stale = eightWeeks((i) => (i === 1 ? { partial: ['the booking job had not run for 9 h when the copy was taken'], tallyStale: 'x' } : {}));
  const k = weeklyKpis(stale, { status: 'absent', reason: 'x' });
  assert.match(k.find((x) => x.id === 'calendar')!.trendText, /^too few to tell \(/);
  assert.match(k.find((x) => x.id === 'paidHeld')!.trendText, /7 of 8/);
  /* The strip is the first panel after the health warnings, above the
     reply promise and the stats row, and prints the due readouts. */
  const page = src('app/admin/page.tsx');
  const strip = page.indexOf('<KpiStrip tiles={kpis}');
  assert.ok(strip > page.indexOf('{healthProblems().length > 0 && ('));
  assert.ok(strip < page.indexOf('{replyTime.ready && ('));
  assert.ok(strip < page.indexOf('<div className="admin-stats">'));
  assert.match(page, /changeLines\(dueChanges\(readChanges\(\), snapshots, readGscExports\(\)\)\)/);
  assert.equal((page.match(/await readInbound\(/g) ?? []).length, 1, 'one read of the inbound store');
});

const DATE_CSV = (rows: [string, string, number][]) =>
  ['Date,Page,Clicks,Impressions,CTR,Position', ...rows.map(([d, p, c]) => `${d},https://www.westpeakwellness.com${p},${c},100,1%,9.00`)].join('\n');

test('277: Search Console by Monday-to-Sunday week, home apart, complete weeks only', () => {
  const days = (from: string, n: number) => Array.from({ length: n }, (_, i) => new Date(Date.parse(`${from}T00:00:00Z`) + i * 864e5).toISOString().slice(0, 10));
  const rows: [string, string, number][] = [];
  for (const d of days('2026-09-14', 7)) rows.push([d, '/', 2], [d, '/book', 1], [d, '/guides/stress-leave-bc', 3]);
  for (const d of days('2026-09-21', 4)) rows.push([d, '/', 1]);
  const parsed = parseDatePageCsv(DATE_CSV(rows));
  assert.equal(parsed.length, 25);
  assert.deepEqual(parsed[0], { date: '2026-09-14', path: '/', clicks: 2 });
  assert.equal(mondayOf('2026-09-20'), '2026-09-14');
  assert.equal(mondayOf('2026-09-21'), '2026-09-21');
  const weeks = gscWeeks([parsed]);
  assert.deepEqual(weeks.map((w) => [w.from, w.days, w.complete]), [['2026-09-21', 4, false], ['2026-09-14', 7, true]]);
  assert.deepEqual(weeks[1].clicks, { home: 14, money: 7, info: 21, other: 0 });
  assert.equal(weeks[1].nonHome, 28);
  /* A newer file wins a day both cover. */
  const newer = parseDatePageCsv(DATE_CSV([['2026-09-14', '/book', 50]]));
  assert.equal(gscWeeks([newer, parsed]).find((w) => w.from === '2026-09-14')!.clicks.money, 56);
  const text = gscWeekLines({ status: 'ok', weeks, files: [] }).join('\n');
  assert.match(text, /Newest complete week: 2026-09-14 to 2026-09-20/);
  /* The tile takes the newest complete week, with the home page beside it. */
  const g = weeklyKpis([], { status: 'ok', weeks, files: [] })[0];
  assert.equal(g.value, 28);
  assert.equal(g.week, '2026-09-14 to 2026-09-20');
  assert.equal(g.sub, '14 more on the home page');
  /* No date-page file is committed yet: absent, naming the secret. */
  const r = readGscWeeks(join(ROOT, 'data', 'gsc'));
  if (r.status === 'absent') assert.match(r.reason, /GSC_SA_JSON/);
  assert.equal(readGscWeeks(join(ROOT, 'no-such-dir')).status, 'absent');
});

test('297: earned links are reduced to edu, press and org, and the server takes the new words', () => {
  const cases: [string, string][] = [
    ['www.ubc.ca', 'edu'], ['students.sfu.ca', 'edu'], ['www.ufv.ca', 'edu'], ['sfss.ca', 'edu'], ['www.mit.edu', 'edu'],
    ['www.peacearchnews.com', 'press'], ['www.surreynowleader.com', 'press'], ['www.abbynews.com', 'press'], ['www.cbc.ca', 'press'],
    ['www.dcrs.ca', 'org'], ['mosaicbc.org', 'org'], ['bc.cmha.ca', 'org'], ['www.peopleslawschool.ca', 'org'],
    ['www.facebook.com', 'other'], ['notubc.ca', 'other'], ['ubc.ca.evil.example', 'other'],
  ];
  for (const [host, cls] of cases) assert.equal(referrerClass(host, 'www.westpeakwellness.com'), cls, host);
  for (const w of ['edu', 'press', 'org']) {
    assert.equal(allowedDetail('landing', w), w);
    assert.equal(landingKeyOk(`/resources/bc-crisis-and-support-directory|${w}`), true);
  }
  for (const c of ['press', 'student']) {
    assert.equal(channelOf(c), c);
    assert.equal(allowedDetail('channel_visit', c), c);
  }
  assert.deepEqual(CHANNELS.slice(-2), ['press', 'student'], 'appended, nothing reordered');
  assert.deepEqual(REFERRER_CLASSES.slice(0, 7), ['google', 'bing', 'duckduckgo', 'ai', 'listing', 'none', 'other']);
});

test('297: clicks and bookings summed by how the visit arrived, beside the sessions', () => {
  const credit = {
    byLanding: [
      { path: '/resources/bc-crisis-and-support-directory', via: 'edu', clicks: 3, booked: 1 },
      { path: '/', via: 'edu', clicks: 1, booked: 0 },
      { path: '/', via: 'google', clicks: 9, booked: 2 },
      { path: '/refer/doctor', via: 'gp', clicks: 2, booked: 0 },
    ],
    byButton: [], booked: 3, bookedWithLanding: 3,
  } as unknown as Parameters<typeof arrivalRows>[0];
  const rows = arrivalRows(credit, [{ detail: 'google', count: 80 }, { detail: 'edu', count: 6 }, { detail: 'press', count: 2 }]);
  assert.deepEqual(rows, [
    { via: 'google', sessions: 80, clicks: 9, booked: 2 },
    { via: 'edu', sessions: 6, clicks: 4, booked: 1 },
    { via: 'gp', sessions: null, clicks: 2, booked: 0 },
    { via: 'press', sessions: 2, clicks: 0, booked: 0 },
  ]);
  const text = creditLines(credit, [{ detail: 'edu', count: 6 }]).join('\n');
  assert.match(text, /edu, press and org are links earned/);
  assert.match(text, /\s6 ·\s+4 ·\s+1 {2}edu/);
});
