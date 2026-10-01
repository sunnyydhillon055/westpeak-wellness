import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { practiceReach, reachSentence } from '../lib/practice-facts.ts';
import { practitioners } from '../lib/practitioners.ts';

/* NO TYPED CANADA-WIDE PROMISES — 1 Oct 2026.
 *
 * One counsellor's Canada-wide reach rests on an insurance policy whose
 * validTo is 2026-10-01; lib/practitioners.ts withdraws the reach 14 days
 * after that unless the renewal is recorded. Pages built from the roster
 * follow the gate. Sentences typed into copy did not: the international-
 * students FAQ said "Anywhere in Canada is possible with Camille Granda",
 * the employer paste block said "one counsellor also sees clients elsewhere
 * in Canada", and the access tool said "anywhere in Canada with Camille
 * Granda". The paste block is the worst of the three, because it is copied
 * onto HR intranets this site can never update.
 *
 * The scan looks for a PROMISE: the phrase tied to a typed name ("... with
 * Camille"), "sees clients anywhere/elsewhere in Canada", or "... is
 * possible". 9-8-8 lines say "anywhere in Canada" about the crisis line and
 * do not match the shape. lib/practice-facts.ts and lib/faq.ts build the
 * sentence from the roster and are exempt. Comments are stripped first. */

const PROMISE =
  /(anywhere|elsewhere) in Canada[^.'"`]{0,40}\bwith [A-Z]|\bsees? clients (located )?(anywhere|elsewhere) in Canada|(anywhere|elsewhere) in Canada is possible/i;

const EXEMPT_FILES = new Set(['lib/practice-facts.ts', 'lib/faq.ts']);

/* Known, and not this change's file to fix. Each needs a reason. */
const KNOWN: Record<string, string> = {
  'app/ai.json/route.ts':
    'says "one counsellor may see clients located anywhere in Canada" and defers to each counsellor’s `reach` field in the same JSON; flagged for the owner of ai.json to build from practiceReach().',
};

const stripComments = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, '');

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs)$/.test(e)) out.push(p.replace(/\\/g, '/'));
  }
  return out;
}

export function typedReachPromises(files: string[]): string[] {
  const hits: string[] = [];
  for (const f of files) {
    if (EXEMPT_FILES.has(f) || KNOWN[f]) continue;
    const lines = stripComments(readFileSync(f, 'utf8')).split('\n');
    lines.forEach((line, i) => {
      if (/9-8-8|\b988\b/.test(line)) return;
      if (PROMISE.test(line)) hits.push(`${f}:${i + 1}`);
    });
  }
  return hits;
}

test('the scan catches the three sentences it was written for', () => {
  for (const s of [
    'Anywhere in Canada is possible with Camille Granda; elsewhere in BC with any counsellor.',
    'in English, Punjabi or Tagalog, anywhere in BC; one counsellor also sees clients elsewhere in Canada.',
    'and anywhere in Canada with Camille Granda, whose national certification and cover reach across the country.',
  ]) assert.match(s, PROMISE, s);
  for (const s of [
    'call or text 9-8-8 anywhere in Canada, twenty-four hours a day',
    'Common here in a way it is not elsewhere in Canada.',
    '`or anywhere in Canada with ${names}`',
  ]) {
    assert.ok(/9-8-8/.test(s) || !PROMISE.test(s), s);
  }
});

test('no file in lib/, components/ or app/ types a Canada-wide promise', () => {
  const files = [...walk('lib'), ...walk('components'), ...walk('app')];
  assert.deepEqual(typedReachPromises(files), []);
});

test('reachSentence follows the roster, gate included', () => {
  const bcOnly = [{ name: 'A B', provinces: ['BC'] }];
  const wide = [...bcOnly, { name: 'Camille Granda', provinces: ['BC'], reach: 'canada' as const }];
  assert.equal(reachSentence(bcOnly), 'Sessions are possible in British Columbia.');
  assert.equal(reachSentence(wide), `Sessions are possible in ${practiceReach(wide)}.`);
  assert.match(reachSentence(wide), /anywhere in Canada with Camille/);
  assert.equal(reachSentence([]), '');
  // Whatever today's gated roster says, the sentence is built from it.
  const accepting = practitioners.filter((p) => p.acceptingNewClients);
  assert.equal(reachSentence(accepting), `Sessions are possible in ${practiceReach(accepting)}.`);
});
