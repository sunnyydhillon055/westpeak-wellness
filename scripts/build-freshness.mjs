#!/usr/bin/env node
/**
 * BUILD FRESHNESS - refuse to audit a build older than the source.
 *
 * WHY THIS EXISTS
 *
 * Almost every gate in this repo reads .next/server/app off disk. None of them
 * check whether that build corresponds to the code currently in the tree, so a
 * stale .next makes the entire suite describe a site that is no longer being
 * written.
 *
 * That happened twice on 31 Aug 2026, and both times the result was a GREEN
 * check that was simply about something else:
 *
 *   · `npm run verify:ci` failed on two pages for a registration number that
 *     was not in the current source. A rebuild cleared it. The gate had been
 *     reading artefacts from an earlier state of the tree.
 *   · Separately, smoke.mjs found a `next start` from a previous run still
 *     holding its port and checked THAT for the rest of the session, passing
 *     36/36 while two of its assertions had already stopped being true.
 *     (Fixed in smoke.mjs itself: a busy port is now a hard stop.)
 *
 * The shared failure is not the staleness. It is that a check reported success
 * without testing what it claimed to test, which is worse than reporting
 * nothing — it is what makes a wrong assertion look verified.
 *
 * WHAT IT ASSERTS
 *
 * The newest source file that can affect a build is older than the build. If
 * it is not, stop and say so, rather than letting fourteen gates audit the
 * wrong artefacts and print a verdict.
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const BUILD = join(ROOT, '.next');

if (!existsSync(BUILD)) {
  console.log('\n  No .next directory. Run `npm run build` first.\n');
  process.exit(1);
}

/* BUILD_ID is written once, at the end of a successful build, so it is the
   honest timestamp for "when did this build finish". Directory mtimes are not:
   they move when anything inside them is touched. */
const stamp = join(BUILD, 'BUILD_ID');
if (!existsSync(stamp)) {
  console.log('\n  .next exists but has no BUILD_ID — the build did not finish. Run `npm run build`.\n');
  process.exit(1);
}
const builtAt = statSync(stamp).mtimeMs;

/* Directories whose contents change what gets built. node_modules is excluded
   deliberately: `npm ci` rewrites it wholesale and would make every build look
   stale for reasons that do not affect output. */
const WATCH = ['app', 'lib', 'components', 'public'];
const FILES = ['next.config.mjs', 'package.json', 'tsconfig.json'];

let newest = { at: 0, path: '' };
const consider = (p) => {
  const at = statSync(p).mtimeMs;
  if (at > newest.at) newest = { at, path: p.replace(ROOT, '').replace(/\\/g, '/') };
};

const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else consider(full);
  }
};

for (const d of WATCH) walk(join(ROOT, d));
for (const f of FILES) if (existsSync(join(ROOT, f))) consider(join(ROOT, f));

/* A couple of seconds of slack: a build writes BUILD_ID at the end, and an
   editor can touch a file a moment later without that meaning anything. */
const SLACK_MS = 5000;

if (newest.at > builtAt + SLACK_MS) {
  const mins = Math.round((newest.at - builtAt) / 60000);
  console.log(`
BUILD FRESHNESS - failed

  ${newest.path} is newer than the build${mins >= 1 ? ` by about ${mins} minute(s)` : ''}.

  Every gate after this one reads .next off disk. Auditing a stale build does
  not fail loudly — it passes, about the wrong code. Run:

      npm run build

  then run the gates again.
`);
  process.exit(1);
}

console.log('\nBuild freshness - .next is newer than every source file it depends on.\n');
