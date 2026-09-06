import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* EVERY PRIVATE BLOB READ IN THIS REPOSITORY MUST BE A CONSISTENT READ.
 *
 * Found 6 Sep 2026. Vercel Blob serves get() through its CDN cache, and after
 * an overwrite at the same pathname the old content can be returned for up to
 * sixty seconds — `cacheControlMaxAge: 0` on the put does not change that,
 * because the minimum is one minute. Every JSON ledger here is overwritten in
 * place, and every one of them was read with the cache on.
 *
 * Two things that produced: the cron watchdog read a stale health file and
 * emailed the owner that booking-mail had stopped, from inside a booking-mail
 * run that had just recorded itself; and lib/inbound.ts read back a stale
 * copy after writing a submission, decided a concurrent write had erased it,
 * retried three times and logged "FAILED to persist" for a record that was
 * there all along.
 *
 * `useCache: false` reads from origin. It is slower and it is the only read
 * this code should ever do against a file it also writes. This test fails the
 * moment somebody adds a get() without it. */

const ROOT = join(import.meta.dirname, '..');
const DIRS = ['lib', 'app', 'components'];

function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(n)) out.push(p);
  }
  return out;
}

test('no @vercel/blob get() reads through the cache', () => {
  const offenders: string[] = [];
  for (const dir of DIRS) {
    for (const file of walk(join(ROOT, dir))) {
      const src = readFileSync(file, 'utf8');
      if (!/from '@vercel\/blob'/.test(src)) continue;
      /* A get() call and its options object, however it is laid out. */
      for (const m of src.matchAll(/\bget\(\s*[^,()]+,\s*\{([^}]*)\}/g)) {
        if (!/access:\s*'private'/.test(m[1]!)) continue;
        if (!/useCache:\s*false/.test(m[1]!)) {
          const line = src.slice(0, m.index).split('\n').length;
          offenders.push(`${file.slice(ROOT.length + 1)}:${line}`);
        }
      }
    }
  }
  assert.deepEqual(offenders, [], `cached private reads:\n  ${offenders.join('\n  ')}`);
});
