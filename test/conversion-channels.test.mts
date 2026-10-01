import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { allowedDetail } from '@/lib/conversion-detail';
import { CHANNELS, REFERRER_CLASSES, channelOf, referrerClass, isAssistantHost } from '@/lib/conversion-detail-client';
import {
  channelVisits, clicksOfLandings, diffLogs, withIncrement, parseConversions, type ConversionLog,
} from '@/lib/conversion-log';
import { snapshotKey, parseSnapshot, lastWeek, type Snapshot } from '@/lib/conversion-snapshots';

/* WHERE VISITS CAME FROM, AND LAST WEEK — 1 Oct 2026.
 *
 * Three additions to the conversion log, each held to the log's posture:
 * a word from a fixed list or nothing, counts and never events. These are
 * the tests that stop "just one more value" from becoming a free-text field,
 * and that stop the weekly view from inventing negative or joined numbers. */

const ROOT = join(import.meta.dirname, '..');

const log = (events: ConversionLog['events'], details: ConversionLog['details'] = {}, total?: number): ConversionLog => ({
  events, details, since: '2026-08-18T00:00:00.000Z', updatedAt: '',
  total: total ?? Object.values(events).reduce((n, m) => n + Object.values(m).reduce((a, b) => a + b, 0), 0),
});

test('a utm_source on the channel list is counted, anything else is dropped in the browser', () => {
  assert.equal(channelOf('gbp'), 'gbp');
  assert.equal(channelOf('GBP '), 'gbp', 'case and stray space are not a different channel');
  assert.equal(channelOf('hr'), 'hr');
  for (const bad of ['', null, undefined, 'facebook', 'newsletter', 'camille-granda', 'dr-smith', 'gbp;x', 'g'.repeat(200)]) {
    assert.equal(channelOf(bad), null, `rejected: ${JSON.stringify(bad)}`);
  }
});

test('the server accepts exactly the channel and referrer lists, and nothing a person could be', () => {
  for (const c of CHANNELS) assert.equal(allowedDetail('channel_visit', c), c);
  for (const r of REFERRER_CLASSES) assert.equal(allowedDetail('landing', r), r);
  for (const bad of ['facebook', 'GBP', 'camille-granda', 'https://www.google.com/', 'google.com', '']) {
    assert.equal(allowedDetail('channel_visit', bad), null, `channel rejected: ${bad}`);
    assert.equal(allowedDetail('landing', bad), null, `landing rejected: ${bad}`);
  }
  /* A channel is not a referrer class and the reverse. */
  assert.equal(allowedDetail('landing', 'gbp'), null);
  assert.equal(allowedDetail('channel_visit', 'duckduckgo'), null);
  /* Names an organisation type, never a person: no roster slug is a channel. */
  const roster = readFileSync(join(ROOT, 'lib/practitioners.ts'), 'utf8');
  for (const m of roster.matchAll(/slug:\s*'([^']+)'/g)) assert.ok(!(CHANNELS as readonly string[]).includes(m[1]!));
});

test('a referrer host is reduced to one class', () => {
  const cases: [string, string][] = [
    ['', 'none'],
    ['www.westpeakwellness.com', 'none'],
    ['www.google.com', 'google'],
    ['www.google.ca', 'google'],
    ['com.google.android.googlequicksearchbox', 'google'],
    ['gemini.google.com', 'ai'],
    ['chatgpt.com', 'ai'],
    ['www.perplexity.ai', 'ai'],
    ['www.bing.com', 'bing'],
    ['duckduckgo.com', 'duckduckgo'],
    ['www.psychologytoday.com', 'listing'],
    ['bcacc.ca', 'listing'],
    ['counsellingbc.com', 'listing'],
    ['maps.apple.com', 'listing'],
    ['www.facebook.com', 'other'],
    ['notgoogle.com', 'other'],
    ['google.com.evil.example', 'other'],
  ];
  for (const [host, cls] of cases) assert.equal(referrerClass(host, 'www.westpeakwellness.com'), cls, host);
  for (const [host] of cases) assert.ok((REFERRER_CLASSES as readonly string[]).includes(referrerClass(host)));
  assert.equal(isAssistantHost('claude.ai'), true);
  assert.equal(isAssistantHost('www.google.com'), false);
});

test('the browser sends the class and the channel, never the host or the URL', () => {
  const src = readFileSync(join(ROOT, 'components/Analytics.tsx'), 'utf8');
  assert.match(src, /track\('landing',\s*\{\s*detail:\s*referrerClass\(/);
  assert.match(src, /track\('channel_visit',\s*\{\s*detail:\s*channel\s*\}\)/);
  assert.doesNotMatch(src, /track\('(landing|channel_visit)'[^)]*\b(host|href|search|referrer)\b/);
  /* The utm-only gbp counter is replaced, not run alongside. */
  assert.doesNotMatch(src, /track\('gbp_visit'/);
  /* The browser half stays free of data imports (the 1 Oct perf rule). */
  const client = readFileSync(join(ROOT, 'lib/conversion-detail-client.ts'), 'utf8');
  assert.doesNotMatch(client, /^import\b/m, 'lib/conversion-detail-client.ts must import nothing');
});

test('the gbp row keeps the profile visits counted before channel_visit replaced gbp_visit', () => {
  const l = log({ gbp_visit: { '/': 4, '/book': 1 }, channel_visit: { '/': 6 } }, { channel_visit: { gbp: 2, bcacc: 3, gp: 1 } });
  assert.deepEqual(channelVisits(l), [
    { detail: 'gbp', count: 7 },
    { detail: 'bcacc', count: 3 },
    { detail: 'gp', count: 1 },
  ]);
  assert.deepEqual(channelVisits(log({})), []);
});

test('booking clicks are printed against the landings on the same page', () => {
  const l = log({ book_click: { '/': 12, '/practitioners/camille-granda': 4 }, landing: { '/': 300, '/guides': 50 } });
  assert.deepEqual(clicksOfLandings(l), [
    { path: '/', clicks: 12, landings: 300 },
    { path: '/practitioners/camille-granda', clicks: 4, landings: 0 },
  ]);
});

test('firstSeen records the day an event is first counted, and never rewrites it', () => {
  const old = parseConversions({ events: { book_click: { '/': 3 } }, details: {}, total: 3, since: '2026-08-18T00:00:00.000Z', updatedAt: '' });
  const a = withIncrement(old, 'book_click', '/', null, '2026-10-02T10:00:00.000Z');
  assert.equal(a.firstSeen, undefined, 'an event already in the file began some earlier day');
  const b = withIncrement(a, 'landing', '/', 'google', '2026-10-02T10:00:00.000Z');
  assert.deepEqual(b.firstSeen, { landing: '2026-10-02' });
  const c = withIncrement(b, 'landing', '/', 'bing', '2026-10-09T10:00:00.000Z');
  assert.deepEqual(c.firstSeen, { landing: '2026-10-02' });
  assert.deepEqual(parseConversions(JSON.parse(JSON.stringify(c))).firstSeen, { landing: '2026-10-02' });
});

test('a week is the newer snapshot minus the older, by event, page and detail', () => {
  const older = log({ book_click: { '/': 10, '/book': 2 }, landing: { '/': 100 } }, { book_click: { header: 8 }, landing: { google: 60, none: 40 } });
  const newer = log(
    { book_click: { '/': 13, '/book': 2, '/guides': 1 }, landing: { '/': 140, '/guides': 9 }, channel_visit: { '/': 2 } },
    { book_click: { header: 10, sticky: 1 }, landing: { google: 80, none: 60, ai: 9 }, channel_visit: { gbp: 2 } },
  );
  const d = diffLogs(older, newer);
  assert.equal(d.total, newer.total - older.total);
  assert.deepEqual(d.events.map((e) => [e.event, e.count]), [['landing', 49], ['book_click', 4], ['channel_visit', 2]]);
  const clicks = d.events.find((e) => e.event === 'book_click')!;
  assert.deepEqual(clicks.byPath, [{ key: '/', count: 3 }, { key: '/guides', count: 1 }], 'an unchanged page is not listed');
  assert.deepEqual(clicks.byDetail, [{ key: 'header', count: 2 }, { key: 'sticky', count: 1 }]);
  /* A key trimmed out of a full map reads as zero, never as a negative week. */
  const shrunk = diffLogs(newer, log({ book_click: { '/': 13 } }, {}, newer.total));
  assert.deepEqual(shrunk.events, []);
});

test('last week needs two snapshots, newest first', () => {
  const s = (takenAt: string, l: ConversionLog): Snapshot => ({ takenAt, conversions: l });
  assert.equal(lastWeek([]), null);
  assert.equal(lastWeek([s('2026-10-05T08:00:00.000Z', log({}))]), null);
  const w = lastWeek([
    s('2026-10-12T08:00:00.000Z', log({ book_click: { '/': 5 } })),
    s('2026-10-05T08:00:00.000Z', log({ book_click: { '/': 2 } })),
  ])!;
  assert.equal(w.from, '2026-10-05T08:00:00.000Z');
  assert.equal(w.to, '2026-10-12T08:00:00.000Z');
  assert.deepEqual(w.events.map((e) => [e.event, e.count]), [['book_click', 3]]);
  assert.equal(snapshotKey(new Date('2026-10-05T08:00:00.000Z')), 'analytics/snapshots/2026-10-05.json');
  assert.equal(parseSnapshot({ conversions: {} }), null, 'a file without takenAt is not a snapshot');
  assert.equal(parseSnapshot({ takenAt: 'x', conversions: { events: { a: { '/': 1 } } } })!.conversions.events.a!['/'], 1);
});

test('the weekly snapshot is scheduled on Mondays, watched, and sends nothing', () => {
  const crons = (JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8')) as { crons: { path: string; schedule: string }[] }).crons;
  const job = crons.find((c) => c.path === '/api/cron/weekly-snapshot');
  assert.ok(job, 'not scheduled');
  assert.match(job.schedule, /^\S+ \S+ \* \* 1$/, 'Mondays');
  for (const f of ['app/api/cron/weekly-snapshot/route.ts', 'lib/conversion-snapshots.ts']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /portal-mail|sendDetailed|resend|nodemailer|alert-mail/i, `${f} must not send anything`);
  }
  const route = readFileSync(join(ROOT, 'app/api/cron/weekly-snapshot/route.ts'), 'utf8');
  assert.match(route, /CRON_SECRET/);
  assert.match(route, /withCronHealth\('weekly-snapshot'/);
});
