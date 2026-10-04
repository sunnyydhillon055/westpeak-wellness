#!/usr/bin/env node
/* Upcoming paid-type appointments with no paid Cliniko invoice — 3 Oct 2026.
 *
 *   npm run unpaid
 *
 * The same rows as /admin/unpaid, from lib/unpaid-bookings.ts rather than a
 * copy. READ ONLY: every request is a GET, and fetch is wrapped so any other
 * method throws before it leaves the machine. CLINIKO_API_KEY comes from the
 * environment or .env.local; it is never printed, and the shard is taken from
 * its suffix exactly as the site does. Without a key this says so and exits 0.
 * Clients appear as initials only. */
import { existsSync, readFileSync } from 'node:fs';
import { register } from 'node:module';
import { needsTypeStripping } from './lib/needs-type-stripping.mjs';

needsTypeStripping('scripts/unpaid-bookings.mjs');

const root = new URL('..', import.meta.url);
const envFile = new URL('.env.local', root);
if (!process.env.CLINIKO_API_KEY && existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?(CLINIKO_API_KEY|CLINIKO_SHARD)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
/* A key without a shard suffix, with the shard given separately. */
if (process.env.CLINIKO_API_KEY && process.env.CLINIKO_SHARD && !/-[a-z]{2}\d+$/i.test(process.env.CLINIKO_API_KEY.trim())) {
  process.env.CLINIKO_API_KEY = `${process.env.CLINIKO_API_KEY.trim()}-${process.env.CLINIKO_SHARD.trim()}`;
}
if (!process.env.CLINIKO_API_KEY?.trim()) {
  console.log('CLINIKO_API_KEY not set');
  process.exit(0);
}

const realFetch = globalThis.fetch;
globalThis.fetch = (url, init = {}) => {
  const method = String(init.method ?? 'GET').toUpperCase();
  if (method !== 'GET') throw new Error(`refused: ${method} from a read-only script`);
  return realFetch(url, init);
};

/* The "@/" alias the lib modules use, via the test suite's resolve hook. */
process.chdir(new URL('.', root).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
register('../test/alias-hooks.mjs', import.meta.url);
const { listUnpaid, formatUnpaidTable } = await import('../lib/unpaid-bookings.ts');

/* exitCode, not exit(): exiting with fetch's sockets still closing trips a
   libuv assertion on Windows. */
const r = await listUnpaid();
if (r.status === 'unconfigured') {
  console.log('CLINIKO_API_KEY not set (or it has no shard suffix)');
} else if (r.status === 'error') {
  console.log(`Cliniko could not be read: ${r.detail}`);
  process.exitCode = 1;
} else {
  console.log(`${r.rows.length} of ${r.checked} upcoming paid sessions without a paid invoice${r.truncated ? ' (appointment read truncated; a floor)' : ''}
`);
  console.log(formatUnpaidTable(r.rows));
}
