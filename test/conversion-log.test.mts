import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  allowedDetail, acceptedDetail, bookClickDetail, toolDetail, withSlugOf, splitBookDetail,
  BOOK_LOCATIONS, COUNSELLOR_SLUGS, TOOL_OUTCOMES, MAGNET_KEYS,
} from '@/lib/conversion-detail';
import {
  countConversion, readConversions, detailsOf, bookClickBreakdown, createConversionStore, type ConversionLog,
} from '@/lib/conversion-log';
import { createSearchStore } from '@/lib/search-log';
import { memoryLedger, type LedgerIO } from '@/lib/blob-ledger';
import { practitioners } from '@/lib/practitioners';
import { tools } from '@/lib/tools';

/* THE CONVERSION LOG'S ONE EXTRA COLUMN STAYS BOUNDED — 1 Oct 2026.
 *
 * The log's privacy posture is counts, never events, and no key anybody
 * typed. A `detail` was added so a booking click can say which button and
 * which counsellor; these tests are what stop that column from growing a
 * free-text dimension the next time somebody wants "just one more field".
 * Every key must come from the roster, the fixed CTA list or the tools' own
 * outcomes, and the file must still read as it did before the column existed. */

const ROOT = join(import.meta.dirname, '..');

/* No Blob token: the store works in memory, which is exactly what a unit
   test wants and exactly what the module does on a preview deployment. */
delete process.env.BLOB_READ_WRITE_TOKEN;

test('book_click detail is a known button, optionally with a roster slug', () => {
  assert.equal(bookClickDetail('sticky'), 'sticky');
  assert.equal(bookClickDetail('sticky', 'camille-granda'), 'sticky/camille-granda');
  assert.equal(bookClickDetail('sticky', 'nobody'), 'sticky', 'an unknown counsellor falls back to the button, never to nothing');
  assert.equal(bookClickDetail('hero'), null, 'a button nobody wired is not on the list');
  assert.equal(bookClickDetail('tool:which-service'), 'tool:which-service');
  assert.deepEqual(splitBookDetail('sticky/camille-granda'), { location: 'sticky', who: 'camille-granda' });
  assert.deepEqual(splitBookDetail('header'), { location: 'header' });
});

test('the allow-list admits exactly the product of the lists and nothing typed', () => {
  for (const l of BOOK_LOCATIONS) {
    assert.equal(allowedDetail('book_click', l), l);
    for (const s of COUNSELLOR_SLUGS) assert.equal(allowedDetail('book_click', `${l}/${s}`), `${l}/${s}`);
  }
  for (const bad of ['', 'hero', 'sticky/', 'sticky/nobody', 'sticky/<script>', '/book?with=camille-granda', 'x'.repeat(81)]) {
    assert.equal(allowedDetail('book_click', bad), null, `rejected: ${JSON.stringify(bad)}`);
  }
  assert.equal(allowedDetail('book_click', 42), null);
  assert.equal(allowedDetail('book_click', { toString: () => 'sticky' }), null);
  assert.equal(allowedDetail('book_click', undefined), null);

  for (const ev of ['book_direct', 'scheduler_visible', 'scheduler_interact', 'enquiry_submit']) {
    for (const s of COUNSELLOR_SLUGS) assert.equal(allowedDetail(ev, s), s);
    assert.equal(allowedDetail(ev, 'practice'), null);
    assert.equal(allowedDetail(ev, 'sticky'), null, `${ev} does not take a button`);
  }
  for (const m of MAGNET_KEYS) assert.equal(allowedDetail('lead_magnet_submit', m), m);
  assert.equal(allowedDetail('lead_magnet_submit', 'coverage'), null);

  /* Events with no detail dimension take none, and an unknown event takes none. */
  assert.equal(allowedDetail('ai_referral', 'camille-granda'), null);
  assert.equal(allowedDetail('scroll_75', 'sticky'), null);
});

test('the roster and the tools are the source of the slugs and outcomes', () => {
  assert.deepEqual([...COUNSELLOR_SLUGS], practitioners.map((p) => p.slug));
  for (const t of tools) {
    assert.ok(t.slug in TOOL_OUTCOMES, `${t.slug} has no outcome list`);
    assert.ok(BOOK_LOCATIONS.includes(`tool:${t.slug}`), `${t.slug}'s result CTA is not a known button`);
  }
  for (const slug of Object.keys(TOOL_OUTCOMES)) {
    assert.ok(tools.some((t) => t.slug === slug), `${slug} is in TOOL_OUTCOMES but is not a tool`);
  }
});

test('tool_complete carries the tool, and an outcome only where the tool has one', () => {
  assert.equal(toolDetail('which-service', 'couples'), 'which-service:couples');
  assert.equal(toolDetail('which-service', 'nonsense'), 'which-service');
  assert.equal(toolDetail('what-can-i-access', 'eap'), 'what-can-i-access:eap');
  assert.equal(toolDetail('therapy-cost-bc', 'unsure'), 'therapy-cost-bc:unsure');
  /* The reflection tools reach no verdict and the counter must not invent one. */
  assert.equal(toolDetail('stress-check', 'alone'), 'stress-check');
  assert.equal(toolDetail('burnout-or-depression', 'travels'), 'burnout-or-depression');
  assert.equal(toolDetail('not-a-tool', 'x'), null);
  assert.equal(allowedDetail('tool_complete', 'stress-check:alone'), null);
  assert.equal(allowedDetail('tool_complete', 'which-service:couples'), 'which-service:couples');
});

test('the counsellor is read from ?with= and only when it names the roster', () => {
  assert.equal(withSlugOf('/book?with=camille-granda#calendar'), 'camille-granda');
  assert.equal(withSlugOf('/book?with=savneet-singh'), 'savneet-singh');
  assert.equal(withSlugOf('/book'), undefined);
  assert.equal(withSlugOf('/book?with=evil'), undefined);
  assert.equal(withSlugOf('/book?with='), undefined);
  assert.equal(withSlugOf(undefined), undefined);
});

/* Every literal `location` a book_click is fired with must be on the fixed
   list, or the click is counted by page only and the "by button" table
   silently under-reports — which is the defect this whole change removes. */
function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(n)) out.push(p);
  }
  return out;
}

test('every book_click fired in the source names a button on the list', () => {
  const missing: string[] = [];
  for (const file of [...walk(join(ROOT, 'components')), ...walk(join(ROOT, 'app'))]) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/track\(\s*'book_click'[\s\S]{0,200}?location:\s*(['"`])([^'"`]+)\1/g)) {
      const loc = m[2]!;
      /* `tool:${tool}` is composed per tool; the list carries every tool. */
      if (loc.startsWith('tool:')) continue;
      if (!BOOK_LOCATIONS.includes(loc)) missing.push(`${file.slice(ROOT.length + 1)}: ${loc}`);
    }
    if (/<BookLink\b/.test(src)) {
      for (const m of src.matchAll(/<BookLink\b[^>]*\blocation="([^"]+)"/g)) {
        if (!BOOK_LOCATIONS.includes(m[1]!)) missing.push(`${file.slice(ROOT.length + 1)}: ${m[1]}`);
      }
    }
  }
  assert.deepEqual(missing, [], `book_click locations not on BOOK_LOCATIONS:\n  ${missing.join('\n  ')}`);
});

test('the sticky bar fires book_click and the forms no longer fire anything', () => {
  const sticky = readFileSync(join(ROOT, 'components/StickyBook.tsx'), 'utf8');
  assert.match(sticky, /track\(\s*'book_click',\s*\{\s*location:\s*'sticky'/);
  /* Counted server-side when the record is stored; a client beacon beside
     that would count the same submission twice. */
  for (const f of ['components/InboundForm.tsx', 'components/LeadCapture.tsx']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /\btrack\(/, `${f} still fires a client event`);
  }
  const submit = readFileSync(join(ROOT, 'lib/inbound-submit.ts'), 'utf8');
  assert.match(submit, /countConversion\(/);
  assert.match(submit, /'lead_magnet_submit'\s*:\s*'enquiry_submit'/);
});

test('the log keeps event → path → count as before, and event → detail → count beside it', async () => {
  const before = await readConversions();
  const t0 = before.total;
  assert.equal(await countConversion('book_click', '/practitioners/camille-granda', 'sticky/camille-granda'), true);
  assert.equal(await countConversion('book_click', '/', 'header'), true);
  assert.equal(await countConversion('book_click', '/guides', 'not-on-the-list'), true, 'the event counts even when the detail is dropped');
  assert.equal(await countConversion('tool_complete', '/tools/which-service', 'which-service:couples'), true, 'tool_complete is counted now');
  assert.equal(await countConversion('scroll_75', '/', undefined), false, 'the other declared-but-uncounted events stay dropped');
  assert.equal(await countConversion('book_click', '//evil.example', 'header'), false, 'the path rule is unchanged');

  const log = await readConversions();
  /* `firstSeen` is the one key added since (1 Oct 2026), and only appears
     once an event is counted for the first time; every older key is as it was. */
  assert.deepEqual(Object.keys(log).filter((k) => k !== 'firstSeen').sort(), ['details', 'events', 'since', 'total', 'updatedAt']);
  assert.equal(log.total, t0 + 4);
  assert.equal(log.events.book_click?.['/practitioners/camille-granda'], (before.events.book_click?.['/practitioners/camille-granda'] ?? 0) + 1);
  assert.equal(log.events.book_click?.['/guides'], (before.events.book_click?.['/guides'] ?? 0) + 1);
  assert.equal(log.details.book_click?.['sticky/camille-granda'], (before.details.book_click?.['sticky/camille-granda'] ?? 0) + 1);
  assert.equal(log.details.book_click?.['not-on-the-list'], undefined);
  assert.equal(log.details.tool_complete?.['which-service:couples'], (before.details.tool_complete?.['which-service:couples'] ?? 0) + 1);
  /* Every value in both maps is a count: no object, no string, no timestamp. */
  for (const m of [log.events, log.details]) {
    for (const byKey of Object.values(m)) for (const v of Object.values(byKey)) assert.equal(typeof v, 'number');
  }
  /* The JSON on disk is what the old readers parse: `events` is untouched. */
  const json = JSON.parse(JSON.stringify(log)) as { events: Record<string, Record<string, number>> };
  assert.equal(typeof json.events.book_click?.['/'], 'number');
});

test('the breakdowns split one key both ways and account for the unattributed', () => {
  const log: ConversionLog = {
    events: { book_click: { '/': 10, '/practitioners/camille-granda': 4 }, scheduler_visible: { '/book': 5 } },
    details: { book_click: { header: 6, 'sticky/camille-granda': 3, 'cta-band/savneet-singh': 1 }, scheduler_visible: { 'camille-granda': 2 } },
    total: 19, since: '2026-08-18T04:42:00.000Z', updatedAt: '2026-10-01T00:00:00.000Z',
  };
  const b = bookClickBreakdown(log);
  assert.equal(b.total, 14);
  assert.deepEqual(b.byLocation, [{ detail: 'header', count: 6 }, { detail: 'sticky', count: 3 }, { detail: 'cta-band', count: 1 }]);
  assert.deepEqual(b.byCounsellor, [{ detail: 'camille-granda', count: 3 }, { detail: 'savneet-singh', count: 1 }]);
  assert.equal(b.noCounsellor, 6);
  assert.equal(b.unattributed, 4, 'clicks counted before the detail existed are shown, not hidden');
  const d = detailsOf(log, 'scheduler_visible');
  assert.deepEqual(d.rows, [{ detail: 'camille-granda', count: 2 }]);
  assert.equal(d.unattributed, 3, 'the practice-wide calendar is the remainder');

  /* A file written before 1 Oct 2026 has no `details` key at all. */
  const legacy = { events: { book_click: { '/': 12 } }, total: 12, since: '', updatedAt: '' } as unknown as ConversionLog;
  assert.deepEqual(bookClickBreakdown(legacy), { total: 12, byLocation: [], byCounsellor: [], noCounsellor: 0, unattributed: 12 });
  assert.deepEqual(detailsOf(legacy, 'book_click'), { rows: [], unattributed: 12 });
});

test('the store keeps the button when the browser names an unknown counsellor', () => {
  assert.equal(acceptedDetail('book_click', 'sticky/nobody'), 'sticky');
  assert.equal(acceptedDetail('book_click', 'sticky/camille-granda'), 'sticky/camille-granda');
  assert.equal(acceptedDetail('book_click', 'hero/camille-granda'), null, 'an unwired button is still refused');
  assert.equal(acceptedDetail('tool_complete', 'which-service:not-an-outcome'), 'which-service');
  assert.equal(acceptedDetail('book_direct', 'nobody'), null);
  assert.equal(acceptedDetail('book_click', 42), null);
});

/* TWO INSTANCES, ONE FILE — 1 Oct 2026.
 *
 * countConversion() read the tally, added one and wrote it back with a plain
 * put(), and answered its own "fresh" read from the instance's last write for
 * 90 seconds. Two serverless instances counting at once each wrote their copy
 * over the other's. These stand two stores on one shared file whose reads and
 * writes take a random few milliseconds, so the operations interleave the way
 * two instances' do. */
const slow = (io: LedgerIO): LedgerIO => {
  const jitter = () => new Promise((r) => setTimeout(r, Math.random() * 6));
  return {
    async read() { await jitter(); return io.read(); },
    async write(json, cond) { await jitter(); return io.write(json, cond); },
  };
};

test('20 concurrent increments across two instances total 20', async () => {
  const cell = { version: 0 } as { json?: string; version: number };
  /* Every refusal means another increment landed, so 20 increments can be
     refused at most 19 times each: 20 attempts makes this exact, not lucky. */
  const a = createConversionStore(() => slow(memoryLedger(cell)), { attempts: 20, backoffMs: 4 });
  const b = createConversionStore(() => slow(memoryLedger(cell)), { attempts: 20, backoffMs: 4 });
  const events = ['scheduler_visible', 'scheduler_interact', 'book_direct', 'book_click'];
  await Promise.all(Array.from({ length: 20 }, (_, i) =>
    (i % 2 ? a : b).count(events[i % events.length]!, '/book', i % 3 ? 'camille-granda' : undefined)));
  const log = await a.read({ fresh: true });
  assert.equal(log.total, 20);
  const byPath = Object.values(log.events).reduce((n, m) => n + (m['/book'] ?? 0), 0);
  assert.equal(byPath, 20, 'every increment is in the path map too');
  assert.deepEqual(await b.read({ fresh: true }), log, 'both instances read the same file');
});

test('the shape /book produces (three events seconds apart) needs no tuning', async () => {
  const cell = { version: 0 } as { json?: string; version: number };
  const a = createConversionStore(() => slow(memoryLedger(cell)));
  const b = createConversionStore(() => slow(memoryLedger(cell)));
  await Promise.all([a.count('scheduler_visible', '/book'), b.count('scheduler_interact', '/book'), a.count('book_direct', '/book')]);
  assert.equal((await b.read({ fresh: true })).total, 3);
});

test('the race is real: the same interleaving without ifMatch loses increments', async () => {
  const cell = { version: 0 } as { json?: string; version: number };
  const blind = (): LedgerIO => { const io = slow(memoryLedger(cell)); return { read: io.read, write: (j) => io.write(j) }; };
  const a = createConversionStore(blind);
  const b = createConversionStore(blind);
  await Promise.all(Array.from({ length: 20 }, (_, i) => (i % 2 ? a : b).count('book_click', '/')));
  assert.ok((await a.read({ fresh: true })).total < 20, 'if this passes at 20 the test above proves nothing');
});

test('a weak ETag is written unconditionally rather than never', async () => {
  let stored: string | undefined;
  const weak: LedgerIO = {
    async read() { return stored ? { body: JSON.parse(stored), etag: 'W/"abc"' } : null; },
    async write(json, cond) { if (cond?.ifMatch || (cond?.create && stored)) return 'conflict'; stored = json; return 'ok'; },
  };
  const s = createConversionStore(() => weak, { backoffMs: 0 });
  await s.count('book_click', '/');
  await s.count('book_click', '/');
  assert.equal((await s.read({ fresh: true })).total, 2);
});

test('a store that refuses every write drops the one increment and keeps the file', async () => {
  const cell = { version: 0 } as { json?: string; version: number };
  const io = memoryLedger(cell);
  await io.write(JSON.stringify({ events: { book_click: { '/': 5 } }, details: {}, total: 5, since: 'x', updatedAt: 'x' }));
  const refusing: LedgerIO = { read: io.read, write: async () => 'conflict' };
  const s = createConversionStore(() => refusing, { attempts: 3, backoffMs: 0 });
  assert.equal(await s.count('book_click', '/'), true);
  assert.equal((await createConversionStore(() => io).read({ fresh: true })).total, 5);
});

test('the search-term counter has the same guard', async () => {
  const cell = { version: 0 } as { json?: string; version: number };
  const a = createSearchStore(() => slow(memoryLedger(cell)), { attempts: 20, backoffMs: 4 });
  const b = createSearchStore(() => slow(memoryLedger(cell)), { attempts: 20, backoffMs: 4 });
  const results = await Promise.all(Array.from({ length: 20 }, (_, i) => (i % 2 ? a : b).count(i % 4 ? 'emdr' : 'anxiety')));
  assert.ok(results.every(Boolean));
  const t = await a.read({ fresh: true });
  assert.equal(t.total, 20);
  assert.equal((t.terms.emdr ?? 0) + (t.terms.anxiety ?? 0), 20);
});

test('neither counter keeps a lastWrite or writes with a plain put any more', () => {
  for (const f of ['lib/conversion-log.ts', 'lib/search-log.ts']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /\blet lastWrite\b/, `${f} still answers reads from its own last write`);
    assert.doesNotMatch(src, /from '@vercel\/blob'/, `${f} writes outside lib/blob-ledger.ts`);
  }
});

test('a refused enquiry is counted by the rule it failed, and nothing else', () => {
  for (const r of ['email', 'detail', 'choices', 'repeated']) assert.equal(allowedDetail('enquiry_refused', r), r);
  assert.equal(allowedDetail('enquiry_refused', 'someone@example.com'), null);
  assert.equal(allowedDetail('enquiry_refused', 'I need help with'), null);
});
