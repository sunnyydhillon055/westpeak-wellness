import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { strongEtag, isWeakEtag } from '../lib/blob-etag.ts';

/* A CONDITIONAL WRITE MAY ONLY CARRY A STRONG VALIDATOR — 17 Sep 2026.
 *
 * The bug this pins is the worst kind: correct code, correct concurrency
 * control, and a store that one day starts returning `W/"…"` instead of
 * `"…"` for a file. If-Match uses strong comparison, so a weak validator can
 * never match, so every write is refused, so the retry loop refuses three
 * times and gives up — silently, because a health log must not be able to
 * fail the job it is watching.
 *
 * Two stores froze this way and neither said a word:
 *
 *   inbound/messages.json  6 Sep. Eleven days of website enquiries never
 *                          reached the store. They reached the practice only
 *                          because the alert mail is sent whatever storage
 *                          says.
 *   ops/cron-health.json   14 Sep. Every job ran, none could record it, and
 *                          the watchdog emailed the owner every morning that
 *                          three jobs had stopped.
 *
 * So: the unit rule (a weak tag is not usable) and the static rule (nothing
 * hands `ifMatch` a validator that has not been through strongEtag). The
 * second is the one that survives somebody adding a third store.
 */

test('a weak validator is never usable for a conditional write', () => {
  assert.equal(strongEtag('W/"39cbf4808641114dd2fa34c96993645a"'), undefined);
  assert.equal(strongEtag('w/"39cbf480"'), undefined, 'lower-case W/ is still weak');
  assert.equal(isWeakEtag('W/"39cbf480"'), true);
});

test('a strong validator is passed through unchanged', () => {
  assert.equal(strongEtag('"082c26c8a6bc75226a31da5495cc9292"'), '"082c26c8a6bc75226a31da5495cc9292"');
  assert.equal(isWeakEtag('"082c26c8"'), false);
});

test('a missing or malformed validator is treated as no validator, not as a guess', () => {
  assert.equal(strongEtag(undefined), undefined);
  assert.equal(strongEtag(''), undefined);
  assert.equal(strongEtag('082c26c8'), undefined, 'unquoted is not a shape the store promised');
  assert.equal(isWeakEtag(undefined), false, 'absent is not weak — there is simply nothing to compare');
});

const ROOT = join(import.meta.dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(n)) out.push(p);
  }
  return out;
}

test('every conditional blob write guards its ETag through strongEtag', () => {
  const offenders: string[] = [];
  for (const file of ['lib', 'app'].flatMap((d) => walk(join(ROOT, d)))) {
    const src = readFileSync(file, 'utf8');
    /* Comments discuss ifMatch in several places; only a real option counts. */
    const uses = /ifMatch:/.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''));
    if (!uses) continue;
    if (!/from '\.\/blob-etag'|from '@\/lib\/blob-etag'/.test(src)) {
      offenders.push(file.slice(ROOT.length + 1).replace(/\\/g, '/'));
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `these pass ifMatch without importing strongEtag, so a weak ETag would freeze the store:\n  ${offenders.join('\n  ')}`
  );
});
