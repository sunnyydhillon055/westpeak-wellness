#!/usr/bin/env node
/**
 * SMOKE - boots the built site and asks it for real URLs.
 *
 * WHY THIS EXISTS
 *
 * next.config.mjs carries the longest comment in this repo, and its point is
 * that a class of failure here is invisible to every other check:
 *
 *   "A real /online-counselling/kamloops page was written and shipped that
 *    day. It built correctly, appeared in .next/server/app, passed
 *    `npm run seo`, and scored 500/1000 - and in production it 308'd straight
 *    to /online-counselling, because a redirect declared here beats a route
 *    that exists. Nothing local catches that: `npm run build` does not
 *    exercise redirects, and a gate that scans built HTML finds a file that
 *    is genuinely there."
 *
 * "Nothing local catches that" was true. redirect-shadow.mjs was written
 * afterwards and closes most of it by comparing the two lists, but it is still
 * reasoning about configuration rather than asking the server. This file asks
 * the server.
 *
 * It boots `next start` against the existing build and makes a few dozen
 * requests. That is the only check in this repo that exercises middleware,
 * redirects, route precedence and status codes at all - everything else reads
 * files off disk.
 *
 * WHAT IT ASSERTS
 *
 *   200      the pages a reader arrives on, including ones with no HTML on
 *            disk, which every file-reading gate here is blind to
 *   404      routes that must not exist: the gated provinces, a retired slug
 *            that is not redirected, and a nonsense URL
 *   308      the Wix-era redirects, landing where they claim to
 *   no soft 404s - a 200 whose body is the not-found page
 *
 * Usage:  npm run build && npm run smoke
 */

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import net from 'node:net';

const PORT = process.env.SMOKE_PORT || 3123;
const BASE = `http://127.0.0.1:${PORT}`;

/* [path, expected status, optional expected destination for a redirect] */
const CHECKS = [
  ['/', 200],
  ['/about', 200],
  ['/faq', 200],
  ['/services', 200],
  ['/services/emdr-therapy', 200],
  ['/online-counselling', 200],
  ['/online-counselling/surrey', 200],
  ['/online-counselling/surrey/emdr-therapy', 200],
  ['/punjabi', 200],
  ['/punjabi-counselling/surrey', 200],
  ['/guides', 200],
  ['/compare/therapy-in-punjabi-vs-english', 200],
  ['/refer/doctor', 200],
  ['/resources/msp-vs-extended-health', 200],
  ['/accessibility', 200],
  ['/sitemap.xml', 200],
  ['/robots.txt', 200],
  ['/feed.xml', 200],
  ['/llms.txt', 200],

  /* Rendered on demand. Every gate that walks .next/server/app is blind to
     these, so this is the only place they are exercised at all. */
  ['/contact', 200],
  ['/pricing', 200],
  ['/search', 200],

  /* Generated images. 51 routes gained one on 30 August 2026; a broken edge
     function there fails silently, because a share card nobody has shared yet
     is a 500 nobody has seen. */
  ['/opengraph-image', 200],
  ['/online-counselling/surrey/emdr-therapy/opengraph-image', 200],
  ['/refer/doctor/opengraph-image', 200],

  /* Gated provinces. These must 404 until the counsellor is registered
     there - a 200 here is a compliance failure, not an SEO one. */
  ['/alberta', 404],
  ['/ontario', 404],
  ['/alberta/calgary', 404],

  ['/this-page-does-not-exist', 404],

  /* Retired city slugs, which must still land where the redirect says. This is
     the kamloops case, asked of the server instead of inferred. */
  /* Richmond and Nanaimo were here until 31 Aug 2026, when both were given
     real pages and removed from retiredCitySlugs. Two slugs that are still
     retired take their place, so this keeps testing the redirect behaviour
     rather than testing nothing. */
  ['/online-counselling/mission', 308, '/online-counselling'],
  ['/online-counselling/maple-ridge', 308, '/online-counselling'],
  /* And the four that now must NOT redirect. This is the assertion that would
     have caught the shadow the moment it appeared. */
  ['/online-counselling/richmond', 200],
  ['/online-counselling/coquitlam', 200],
  ['/online-counselling/delta', 200],
  ['/online-counselling/nanaimo', 200],
  ['/online-counselling/white-rock', 200],
  ['/for/mens-mental-health', 308, '/for'],
  /* /answers retired 31 Aug 2026. 196 internal links pointed at it, so it
     redirects rather than 404s. */
  ['/answers', 308, '/faq'],

  /* And the counter-case: a city that WAS retired and then given a real page
     must not redirect. Getting this wrong is how the original bug shipped. */
  ['/online-counselling/kamloops', 200],
  ['/online-counselling/burnaby', 200],
  ['/online-counselling/langley', 200],
  ['/online-counselling/chilliwack', 200],
];

/* Matched against the <title> ONLY, and that restriction is load-bearing.
   The first version of this check searched the whole document for the 404
   page's heading and reported all 22 healthy pages as soft 404s: Next embeds
   the not-found boundary in the streamed RSC payload of every page, so the
   string is genuinely present in all of them. The title is the one place it
   appears only when the 404 is what was actually served. */
const NOT_FOUND_TITLE = /page not found/i;

/* REFUSE TO TEST A SERVER THIS SCRIPT DID NOT START.
 *
 * On 31 Aug 2026 a `next start` from an earlier run was still holding 3123 on
 * the dev machine, serving a build several commits old. Every local smoke run
 * silently checked THAT - reporting 36/36 while two of the assertions it was
 * making had already stopped being true of the current build. It surfaced only
 * on CI, where the port is always free and the checks ran against the code
 * actually being shipped.
 *
 * A green check against stale code is worse than no check: it is precisely
 * what made two wrong assertions look correct for a whole session. So a busy
 * port is a hard stop, never something to work around. */
const portBusy = await new Promise((resolve) => {
  /* A raw socket, not fetch. process.exit() while an undici request is still
     tearing down trips `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`
     on Windows, printing a crash under a message that had already read
     cleanly. A net socket closes deterministically. */
  const sock = net.connect({ port: Number(PORT), host: '127.0.0.1' });
  const done = (v) => { sock.destroy(); resolve(v); };
  sock.once('connect', () => done(true));
  sock.once('error', () => done(false));
  sock.setTimeout(1500, () => done(false));
});

if (portBusy) {
  console.error(`
  Port ${PORT} is already in use.

  Something is serving on it that this script did not start, so any result
  would describe that process rather than this build. Stop it and run again,
  or set SMOKE_PORT to a free port.
`);
  process.exit(1);
}

console.log(`\nSMOKE - booting the built site on ${PORT}\n`);

const isWin = process.platform === 'win32';

/* `detached` on POSIX so the server gets its own PROCESS GROUP.
 *
 * npx spawns `next start` as a grandchild. Killing npx alone leaves that
 * grandchild running — holding the port, and holding the stdout/stderr pipes
 * this process inherited to it, so the streams never end and a successful run
 * never exits.
 *
 * This was described in commit 220de52 and NOT actually applied: the edit that
 * was supposed to make it aborted partway and only the backstop timer landed.
 * CI went green because that timer force-exits after 5s, which hid the hang
 * without fixing the leak — and the leak is what left a stale `next start`
 * holding 3123 on the dev machine, which is what made every local smoke run
 * report success against a build several commits old. One unapplied edit,
 * three downstream failures. */
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: isWin,
  detached: !isWin,
});

let serverOut = '';
server.stdout.on('data', (d) => { serverOut += d; });
server.stderr.on('data', (d) => { serverOut += d; });

const stop = () => {
  try {
    if (!isWin && server.pid) {
      /* Negative pid = the whole group, so the grandchild goes too. */
      process.kill(-server.pid, 'SIGTERM');
    } else if (isWin && server.pid) {
      /* Windows has no process group to signal, and server.kill() takes down
         only the shell. /T kills the tree. */
      spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      server.kill();
    }
  } catch { /* already gone */ }
  /* Release the pipes too: a stream still attached to a dead process is
     enough on its own to hold the event loop open. */
  try { server.stdout?.destroy(); server.stderr?.destroy(); } catch { /* fine */ }
};
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

/* Wait for the server rather than sleeping a fixed amount: a fixed sleep is
   either slower than it needs to be or flaky on a cold CI runner. */
let up = false;
for (let i = 0; i < 60; i++) {
  await sleep(1000);
  try {
    const r = await fetch(`${BASE}/robots.txt`, { redirect: 'manual' });
    if (r.status) { up = true; break; }
  } catch { /* not listening yet */ }
}
if (!up) {
  console.error('  server did not come up within 60s. Output:\n');
  console.error(serverOut.split('\n').slice(-25).join('\n'));
  stop();
  process.exit(1);
}

const failures = [];
let passed = 0;

for (const [path, want, wantDest] of CHECKS) {
  let res;
  try {
    res = await fetch(BASE + path, { redirect: 'manual' });
  } catch (e) {
    failures.push(`${path} - request failed: ${e.message}`);
    continue;
  }

  if (res.status !== want) {
    failures.push(`${path} - expected ${want}, got ${res.status}`);
    continue;
  }

  if (wantDest) {
    const got = (res.headers.get('location') || '').replace(/^https?:\/\/[^/]+/, '');
    if (got.replace(/\/$/, '') !== wantDest.replace(/\/$/, '')) {
      failures.push(`${path} - redirects to ${got || '(no Location)'}, expected ${wantDest}`);
      continue;
    }
  }

  /* A 200 that serves the not-found page is the failure this repo has already
     shipped once in another form, and it is the one a status code hides. */
  if (want === 200 && (res.headers.get('content-type') || '').includes('text/html')) {
    const body = await res.text();
    const title = (body.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i) || [, ''])[1];
    if (NOT_FOUND_TITLE.test(title)) {
      failures.push(`${path} - answered 200 with the 404 page (title: "${title.trim()}")`);
      continue;
    }
  }

  passed++;
}

stop();

console.log(`  ${passed}/${CHECKS.length} checks passed\n`);
if (failures.length) {
  console.log('FAILED');
  for (const f of failures) console.log(`   ${f}`);
  console.log();
  process.exit(1);
}
console.log('  Every route answers what it should, redirects included.\n');

/* Backstop. Everything above should let the loop drain on its own; if some
   handle still holds it open, exit anyway rather than burning the job's
   timeout on a run that already passed. Unref'd, so a clean exit never waits
   for it, and it only fires if something else is keeping the process alive. */
setTimeout(() => process.exit(process.exitCode ?? 0), 5000).unref();
