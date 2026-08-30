#!/usr/bin/env node
/**
 * LINK ROT — do the citations still resolve?
 *
 * WHY THIS EXISTS
 *
 * On 23 August 2026 a sweep found four dead external citations, three of them
 * on pages making claims about people's legal entitlements:
 *
 *   404  interiorhealth.ca/services/mental-health-substance-use
 *   404  gov.bc.ca .../employment-standards/time-off/illness-or-injury-leave
 *   404  worksafebc.com/en/health-safety/hazards-exposures/mental-health
 *   500  bclaws.gov.bc.ca .../statreg/03063_01
 *
 * The second was the source behind a "five paid and three unpaid days" figure
 * written three days earlier. Nothing had gone wrong on this site — government
 * and health-authority pages simply move, and a citation that 404s is worse
 * than no citation, because the whole argument of this site is "do not take my
 * word for it, here is where to check".
 *
 * Run it monthly. It is deliberately not part of `npm run seo`: a build must
 * not fail because a health authority reorganised its URLs overnight.
 *
 *   npm run links            check every external citation
 *   npm run links -- --slow  one request at a time, for a flaky connection
 *
 * A 403 is reported separately from a 404 and on purpose. Several government
 * and health sites refuse a plain scripted request while serving a browser
 * perfectly well; treating those as dead would send somebody rewriting a
 * citation that was never broken.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) {
  console.error('No build. Run `npm run build` first.');
  process.exit(1);
}

/* HREFS COME OUT OF HTML STILL ESCAPED — found 2026-08-30.
 *
 * An href in a document is HTML text, so `?a=1&b=2` is written `?a=1&amp;b=2`.
 * This file harvested the raw attribute and fetched it verbatim, which means
 * every citation carrying a query string has been checked as a different URL
 * than the one the reader clicks — `&amp;topic=1` instead of `&topic=1`.
 *
 * It went unnoticed for the reason these things always do: the request still
 * succeeded. Statistics Canada answers an unknown parameter set with HTTP 200
 * and a friendly not-found page, so six census citations — including the ones
 * behind the Punjabi mother-tongue figures that the practice's only ranking
 * niche is built on — reported "resolve" while pointing at nothing.
 *
 * The soft-404 check added in the same change is what surfaced it, and only
 * because it printed the landed path. A checker that merely counted status
 * codes would have gone on being confidently wrong.
 */
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodeEntities = (u) =>
  u.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    const k = name.toLowerCase();
    if (ENTITIES[k] !== undefined) return ENTITIES[k];
    if (k.startsWith('#x')) return String.fromCodePoint(parseInt(k.slice(2), 16));
    if (k.startsWith('#')) return String.fromCodePoint(parseInt(k.slice(1), 10));
    return whole;
  });

/* Where each URL is cited, so a failure names the page to edit. */
const cites = new Map();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
    if (url === '/index') url = '/';
    const html = readFileSync(p, 'utf8').replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
    const main = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
    for (const m of main.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      const href = decodeEntities(m[1].replace(/\\$/, ''));
      if (!cites.has(href)) cites.set(href, new Set());
      cites.get(href).add(url);
    }
  }
})(BUILT);

const urls = [...cites.keys()].sort();
const slow = process.argv.includes('--slow');
const UA = 'Mozilla/5.0 (compatible; westpeak-link-check/1.0)';
/* The same request a person's browser would make. Used only as a second
   opinion — see the soft-404 note below. Honest about being a checker on the
   first pass, and only borrows a browser's clothes to avoid libelling a live
   citation as dead. */
const UA_BROWSER =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/* SOFT 404s — added 2026-08-30, against a failure this file already knew about.
 *
 * lib/city-context.ts records it in prose: Fraser Health answers
 * /services/mental-health-and-substance-use with HTTP 200 and serves
 * /page-not-found. Two of the five health-authority citations behaved that way
 * and were caught only because somebody compared the LANDED url by hand and
 * wrote the finding into a comment. This checker passed both, because it was
 * reading the status code and a soft 404 is a 200.
 *
 * That is the same class of error as the two instrument bugs recorded in
 * VISIBILITY_25_AI: a test that reports the thing it measures rather than the
 * thing it is for. A citation is dead when it no longer shows the reader what
 * it promised, and "200 OK" is not evidence of that.
 *
 * Two signals, both requiring a redirect or a telltale title, so an ordinary
 * page is not condemned for the word "error" appearing in its body:
 *
 *   1. the response redirected, and the path it landed on says not-found
 *   2. the document's <title> says not-found
 *
 * Reported in its own category rather than merged into DEAD, because the fix
 * is different: a hard 404 needs a new URL, a soft 404 often means the content
 * moved and the site is hiding it behind a friendly page.
 */
const NOT_FOUND_PATH = /(page-not-found|not-found|notfound|404|page-unavailable)/i;
const NOT_FOUND_TITLE = /^\s*(page\s+not\s+found|not\s+found|404\b|oops|page\s+unavailable)/i;

function looksSoft404(requested, landed, body) {
  try {
    const a = new URL(requested), b = new URL(landed);
    const moved = a.pathname.replace(/\/$/, '') !== b.pathname.replace(/\/$/, '');
    if (moved && NOT_FOUND_PATH.test(b.pathname)) return `redirected to ${b.pathname}`;
  } catch { /* an unparseable landed url is not evidence of anything */ }
  const title = (body.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i) || [, ''])[1]
    .replace(/\s+/g, ' ').trim();
  if (title && NOT_FOUND_TITLE.test(title)) return `title: "${title.slice(0, 60)}"`;
  return null;
}

async function check(url) {
  const go = async (method, wantBody = false, ua = UA, ms = 15000) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const r = await fetch(url, { method, redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': ua } });
      /* Only the first 40 kB — a <title> is in the first few hundred bytes and
         pulling whole documents for 95 citations is rude and slow. */
      let body = '';
      if (wantBody && r.status === 200 && r.body) {
        const buf = await r.arrayBuffer();
        body = Buffer.from(buf).subarray(0, 40000).toString('utf8');
      }
      return { status: r.status, landed: r.url || url, body };
    } catch {
      return { status: 0, landed: url, body: '' };
    } finally {
      clearTimeout(t);
    }
  };
  /* HEAD first because it is cheap; a good many servers refuse it, so fall
     through to GET rather than reporting a phantom failure.
     A 200 from HEAD is now re-fetched with GET as well: HEAD returns no body
     and no title, and the title is half the soft-404 evidence. */
  let r = await go('HEAD');
  if (r.status === 0 || r.status === 405 || r.status === 403 || r.status === 501 || r.status === 200) {
    r = await go('GET', true);
  }
  /* NO RESPONSE GETS A SECOND OPINION TOO — 2026-08-30.
   *
   * cpa-apc.org was reported as unreachable on three consecutive runs and is
   * not: it is simply slow to first byte, and slower still for a request that
   * announces itself as a script. Fifteen seconds and a checker user-agent
   * were together enough to put the Canadian Psychiatric Association on a list
   * that a reader of this output would reasonably act on.
   *
   * "NO RESPONSE — re-run before believing it" was the honest hedge for that.
   * Doing the re-run here is better than asking a person to remember to. */
  if (r.status === 0) {
    const patient = await go('GET', true, UA_BROWSER, 30000);
    if (patient.status && patient.status < 400) r = patient;
  }

  let soft = r.status === 200 ? looksSoft404(url, r.landed, r.body) : null;

  /* A SOFT 404 GETS THE SAME SECOND CHANCE A 403 DOES — 2026-08-30.
   *
   * The first run of this check reported five dead census citations, among
   * them the Statistics Canada sources behind the Punjabi mother-tongue
   * figures that /punjabi-counselling and the whole Punjabi niche rest on.
   * They were not dead. Every one of them loads correctly in a browser;
   * www12.statcan.gc.ca inspects the user-agent and answers an obvious script
   * with its own not-found page.
   *
   * This file already knew that shape of lie — the header comment explains
   * why a 403 is reported separately, "treating those as dead would send
   * somebody rewriting a citation that was never broken". A UA-triggered soft
   * 404 is the same site behaviour wearing a 200, and it deserves the same
   * treatment rather than a place on a list headed DEAD.
   *
   * So: before reporting rot, ask again as a browser. If the page appears,
   * the citation is fine for every reader and the block is ours; it moves to
   * the refused-a-scripted-request list where a human can glance at it.
   */
  if (soft) {
    const second = await go('GET', true, UA_BROWSER);
    if (second.status === 200 && !looksSoft404(url, second.landed, second.body)) {
      return { ...second, soft: null, uaBlocked: true, status: 403 };
    }
  }
  return { ...r, soft };
}

const results = [];
if (slow) {
  for (const u of urls) results.push({ url: u, ...(await check(u)) });
} else {
  const queue = [...urls];
  const worker = async () => {
    while (queue.length) {
      const u = queue.shift();
      results.push({ url: u, ...(await check(u)) });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
}

const dead = results.filter((r) => r.status >= 400 && r.status !== 403 && r.status !== 429);
const soft = results.filter((r) => r.soft);
const blocked = results.filter((r) => r.status === 403 || r.status === 429);
const unreachable = results.filter((r) => r.status === 0);
const ok = results.length - dead.length - soft.length - blocked.length - unreachable.length;

console.log(`\nLINK ROT — ${results.length} external citations across the built site\n`);
console.log(`  ${String(ok).padStart(3)}  resolve`);
console.log(`  ${String(dead.length).padStart(3)}  DEAD`);
console.log(`  ${String(soft.length).padStart(3)}  SOFT 404 (200, but the page it lands on is a not-found page)`);
console.log(`  ${String(blocked.length).padStart(3)}  refused a scripted request (403/429) — almost certainly fine in a browser`);
console.log(`  ${String(unreachable.length).padStart(3)}  no response (timeout or DNS)\n`);

const show = (title, list, note) => {
  if (!list.length) return;
  console.log(title);
  for (const r of [...list].sort((a, b) => a.url.localeCompare(b.url))) {
    console.log(`  ${String(r.status).padStart(3)}  ${r.url}`);
    if (note && r.soft) console.log(`         ${r.soft}`);
    for (const page of [...cites.get(r.url)].sort()) console.log(`         cited on ${page}`);
  }
  console.log();
};

show('DEAD — fix these; a citation that 404s is worse than none', dead);
show(
  'SOFT 404 — answered 200 and showed a not-found page. Open one before rewriting:\n' +
  '           a site that soft-404s can also soft-404 a page that genuinely exists.',
  soft,
  true
);
show('NO RESPONSE — re-run before believing it', unreachable);
show(
  'REFUSED A SCRIPTED REQUEST - check by hand, do not rewrite blind. A 403 that answers a browser is a user-agent block, not rot.',
  blocked
);

process.exit(dead.length + soft.length ? 1 : 0);
