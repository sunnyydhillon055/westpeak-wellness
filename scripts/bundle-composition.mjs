#!/usr/bin/env node
/**
 * BUNDLE COMPOSITION — what ended up in the JavaScript the browser downloads.
 *
 * scripts/perf-budget.mjs already ratchets how many bytes ship. This asks a
 * different and more dangerous question: WHICH code shipped.
 *
 * THE FAILURE THIS EXISTS FOR. A server-only module reaches the client bundle
 * the moment something in its import chain gains `'use client'`, and nothing
 * announces it. The build succeeds. The page renders. The bytes go up by an
 * amount too small to trip a budget. And the client bundle now contains a
 * library that expects to hold a secret — @vercel/blob reads
 * BLOB_READ_WRITE_TOKEN, the mail client reads RESEND_API_KEY, the Cliniko
 * client reads an API key. Next inlines nothing that is not NEXT_PUBLIC_, so
 * the key itself does not travel; what travels is the endpoint shapes, the
 * request builders and the internal structure of how this practice talks to
 * its client records. That is a map, handed out.
 *
 * It is also exactly the mistake that is easy to make here. Every form on this
 * site is a client component sitting a couple of imports away from
 * lib/inbound-submit.ts, and one careless shared import is all it takes.
 *
 * WHY MATCH ON THE PACKAGE NAME AND NOT THE BYTES. A bundled module's
 * identifiers are minified, but the import specifiers of external packages
 * survive in the module map and in Next's own chunk metadata, and the
 * distinctive string constants inside them survive minification entirely.
 * Matching those is crude, and crude is right for a gate: a false positive
 * costs a minute of reading, a false negative costs a disclosure.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const STATIC = '.next/static';

/* Packages that must never appear in anything a browser downloads, and the
   fingerprint to look for. A bare package name is not enough — "resend" also
   appears in ordinary copy — so each one names a string that only its own
   source contains. */
const SERVER_ONLY = [
  { pkg: '@vercel/blob', marks: ['blob.vercel-storage.com', 'BLOB_READ_WRITE_TOKEN'] },
  { pkg: 'resend', marks: ['api.resend.com'] },
  { pkg: 'next-auth', marks: ['NEXTAUTH_SECRET'] },
  { pkg: 'cliniko', marks: ['api.au1.cliniko.com', 'api.ca1.cliniko.com', 'CLINIKO_API_KEY'] },
  { pkg: 'node:crypto / bcrypt', marks: ['bcrypt_lib', 'scryptSync'] },
];

/* Environment variable names that are not NEXT_PUBLIC_ and therefore must
   never be referenced from client code at all. Next replaces NEXT_PUBLIC_ ones
   at build time and leaves the rest as `process.env.X`, which is `undefined`
   in a browser — so a match here is not a leaked value, it is a leaked NAME,
   and a name tells an attacker exactly what to go looking for. */
const SECRET_NAMES = [
  'RESEND_API_KEY', 'BLOB_READ_WRITE_TOKEN', 'CLINIKO_API_KEY',
  'NEXTAUTH_SECRET', 'ADMIN_PASSWORD', 'CRON_SECRET', 'INDEXNOW_KEY',
];

if (!existsSync(STATIC)) {
  console.error('\nNo .next/static — run `npm run build` first.\n');
  process.exit(2);
}

const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : [];
});

const files = walk(STATIC);
const hits = [];

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const { pkg, marks } of SERVER_ONLY) {
    const found = marks.filter((m) => src.includes(m));
    if (found.length) hits.push({ file: f, what: pkg, why: found.join(', ') });
  }
  for (const name of SECRET_NAMES) {
    if (src.includes(name)) hits.push({ file: f, what: 'secret name', why: name });
  }
}

console.log(`\nBUNDLE COMPOSITION - ${files.length} client chunks\n`);

if (!hits.length) {
  console.log('  No server-only package or secret name reached the browser.\n');
  process.exit(0);
}

console.log(`  ${hits.length} PROBLEM(S)\n`);
for (const h of hits) {
  console.log(`    ${h.what}  ←  ${h.why}`);
  console.log(`        ${h.file}`);
}
console.log(
  '\n  Something server-only is being downloaded by visitors. Find the import\n' +
  "  chain from a 'use client' file to it, and move the server work behind a\n" +
  '  route handler or a server action instead of importing it directly.\n'
);
process.exit(1);
