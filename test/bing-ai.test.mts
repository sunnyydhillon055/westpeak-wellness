import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseCsv, isConversational, topicOf } from '../scripts/lib/query-topics.mjs';
import { shapeOf, exportsByDate, summarise, adminLine, byTopic, AI_FILE } from '../scripts/lib/bing-ai-core.mjs';
import { bingAiLine } from '../lib/bing-ai.ts';

/* #455: the conversational series in ctr-delta, and #463: the Bing AI
   Performance reader and its /admin line. 3 Oct 2026. */

test('conversational: a trailing ?, nine or more words, or a follow-up opener', () => {
  for (const q of ['what about bc?', 'can i be fired for this?', 'yes short term disability', 'how about paid leave',
    'are you allowed to take a mental health day from work']) {
    assert.equal(isConversational(q), true, q);
  }
  for (const q of ['stress leave bc', 'emdr therapy online', 'westpeak wellness', 'nothing', '', 'yesterday counselling']) {
    assert.equal(isConversational(q), false, q);
  }
});

test('topics follow the five 3 Oct buckets, first match wins', () => {
  assert.equal(topicOf('can i be fired for this?'), 'leave');
  assert.equal(topicOf('stress leave surrey'), 'leave');
  assert.equal(topicOf('is an rcc covered by msp'), 'rcc');
  assert.equal(topicOf('counseling meaning in punjabi'), 'language-brand');
  assert.equal(topicOf('emdr therapy online'), 'modalities');
  assert.equal(topicOf('what about bc?'), 'places');
  assert.equal(topicOf('yes please'), 'other');
});

test('the CSV reader handles quotes, CRLF and a BOM', () => {
  const rows = parseCsv('﻿Top queries,Clicks\r\n"stress leave, bc",3\r\nplain,0\r\n');
  assert.deepEqual(rows, [{ 'Top queries': 'stress leave, bc', Clicks: '3' }, { 'Top queries': 'plain', Clicks: '0' }]);
});

test('ctr-delta still reads its exports with the same file pattern and the shared parser', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync('scripts/ctr-delta.mjs', 'utf8');
  assert.match(src, /from '\.\/lib\/query-topics\.mjs'/);
  assert.match(src, /conversationalSeries\(\)/);
  assert.doesNotMatch(src, /function parseCsv/, 'one parser, not two');
});

const daily = (rows: [string, number, number][]) =>
  parseCsv(['Date,Citations,Cited pages', ...rows.map((r) => r.join(','))].join('\n'));

test('a file is recognised by its columns, and an unknown one is not guessed', () => {
  assert.equal(shapeOf(daily([['2026-10-01', 3, 2]])).kind, 'daily');
  assert.equal(shapeOf(parseCsv('URL,Citations\nhttps://www.westpeakwellness.com/a,4')).kind, 'pages');
  assert.equal(shapeOf(parseCsv('Grounding query,Citations\nbc stress leave,2')).kind, 'queries');
  assert.equal(shapeOf(parseCsv('Foo,Bar\n1,2')).kind, 'unrecognised');
  assert.equal(shapeOf([]).kind, 'empty');
});

test('exports group by date; other files are ignored', () => {
  const g = exportsByDate(['2026-10-10-ai-pages.csv', '2026-10-03-ai-daily.csv', '2026-10-10-ai-daily.csv', 'notes.txt', '2026-10-10-pages.csv']);
  assert.deepEqual(g.map((x: { date: string }) => x.date), ['2026-10-03', '2026-10-10']);
  assert.deepEqual(g[1].files, ['2026-10-10-ai-daily.csv', '2026-10-10-ai-pages.csv']);
  assert.ok(AI_FILE.test('2026-10-10-ai-grounding-queries.csv'));
});

test('7-day citations, cited pages, change since the last export, and topics', () => {
  const prev = summarise('2026-10-03', [{ name: 'd', rows: daily([['2026-09-27', 1, 1], ['2026-10-01', 2, 1]]) }]);
  const days: [string, number, number][] = [];
  for (let i = 1; i <= 9; i++) days.push([`2026-10-0${i}`, i, 2]);
  const latest = summarise('2026-10-10', [
    { name: 'd', rows: daily(days) },
    { name: 'p', rows: parseCsv('URL,Citations\nhttps://x/b,1\nhttps://x/a,5') },
    { name: 'q', rows: parseCsv('Grounding query,Citations\nmental health leave bc employer,4\nemdr online bc,1\nrcc vs psychologist,2') },
  ]);
  assert.equal(latest.citations7d, 3 + 4 + 5 + 6 + 7 + 8 + 9);
  assert.equal(latest.citedPages7d, 2);
  assert.equal(latest.pages[0].url, 'https://x/a');
  assert.deepEqual(byTopic(latest.queries).map((g: { topic: string }) => g.topic), ['leave', 'rcc', 'modalities']);
  assert.equal(adminLine(latest, prev), 'Copilot citations, 7 days: 42 to 2026-10-10, 2.0 cited pages (+39 since 2026-10-03).');
});

test('/admin says there is no export rather than printing zero', () => {
  assert.match(adminLine(null, null), /no Bing export yet/);
  assert.match(bingAiLine(join(tmpdir(), 'no-such-bing-dir-r6')), /no Bing export yet/);
  const dir = mkdtempSync(join(tmpdir(), 'bing-'));
  try {
    assert.match(bingAiLine(dir), /no Bing export yet/);
    writeFileSync(join(dir, '2026-10-10-ai-daily.csv'), 'Date,Citations\n2026-10-09,2\n2026-10-10,3\n');
    assert.equal(bingAiLine(dir), 'Copilot citations, 7 days: 5 to 2026-10-10.');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
