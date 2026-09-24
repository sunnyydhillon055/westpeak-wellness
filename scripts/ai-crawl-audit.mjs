#!/usr/bin/env node
/**
 * WHAT A MACHINE READER ACTUALLY GETS — the AI-crawlability gate.
 *
 * WHY THIS EXISTS
 *
 * On 24 September 2026 this site gained a set of things that exist only for
 * programs: a Markdown twin of every page, /ai.json, a rewritten robots.txt
 * that names them, Link headers announcing them, and entity links in the
 * structured data. Not one of those is visible on the site. A person can
 * click through all 295 pages and never notice that /pricing.md has been
 * returning the word "Loading" for a month, or that a rewrite stopped
 * matching, or that robots.txt lost the lines that point at any of it.
 *
 * That is the whole argument for this file. Everything here is invisible to
 * the eye and visible to a request, so it is checked by request.
 *
 * It already earned its place before it was finished: the first version of
 * the Markdown route returned a 711-byte page for /pricing whose entire body
 * was "Loading current fees…", because the fee table renders inside a
 * Suspense boundary and arrives later in the response. Every page looked
 * right in a browser.
 *
 * WHAT IT CHECKS
 *   · robots.txt  — the AI crawler groups, the sitemap, and the lines that
 *                   tell a language model where llms.txt and ai.json are
 *   · llms.txt    — present, plain text, and carrying the correction block
 *   · ai.json     — parses, holds the fields it promises, and leaks neither
 *                   the founder's name nor a registration number
 *   · the twins   — a sample across every page shape: right type, real
 *                   content, front matter, no HTML, no "Loading"
 *   · the refusals— /admin.md and friends are 404, not quietly served
 *   · the headers — Link alternates and the snippet directives
 *   · the schema  — entity sameAs, speakable, abstract and citation are
 *                   actually in the rendered JSON-LD
 *
 * WHAT IT DOES NOT CHECK unless asked
 *   The encyclopaedia URLs in lib/entities.ts are only requested with
 *   --links. They are third-party and rate-limited, and a gate that fails
 *   because Wikipedia returned 429 teaches everyone to ignore the gate.
 *   Without the flag it says so rather than implying they were verified.
 */

import { spawn } from 'node:child_process';
import net from 'node:net';
import { readFileSync } from 'node:fs';

const PORT = process.env.AI_AUDIT_PORT || 3124;
const LIVE = process.argv.includes('--live')
  ? process.argv[process.argv.indexOf('--live') + 1]
  : null;
const CHECK_LINKS = process.argv.includes('--links');
const BASE = LIVE || `http://127.0.0.1:${PORT}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const failures = [];
const notes = [];
let passed = 0;

const ok = (what) => { passed++; console.log(`  PASS  ${what}`); };
const bad = (what, detail) => { failures.push(`${what}\n          ${detail}`); console.log(`  FAIL  ${what}`); };

function check(what, condition, detail) {
  if (condition) ok(what); else bad(what, detail);
}

/* ------------------------------------------------------------------ server */

let server = null;
const isWin = process.platform === 'win32';

/* The lifecycle below is scripts/smoke.mjs's, for the reasons recorded there:
   a busy port means the result would describe someone else's build, and on
   Windows only `taskkill /T` takes down the grandchild that holds the port. */
async function boot() {
  if (LIVE) { console.log(`\nAI CRAWL AUDIT - against ${LIVE}\n`); return; }

  const busy = await new Promise((resolve) => {
    const sock = net.connect({ port: Number(PORT), host: '127.0.0.1' });
    const done = (v) => { sock.destroy(); resolve(v); };
    sock.once('connect', () => done(true));
    sock.once('error', () => done(false));
    sock.setTimeout(1500, () => done(false));
  });
  if (busy) {
    console.error(`\n  Port ${PORT} is in use, so any result would describe that process\n  rather than this build. Stop it, or set AI_AUDIT_PORT.\n`);
    process.exit(1);
  }

  console.log(`\nAI CRAWL AUDIT - booting the built site on ${PORT}\n`);
  server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'], shell: isWin, detached: !isWin,
  });
  let out = '';
  server.stdout.on('data', (d) => { out += d; });
  server.stderr.on('data', (d) => { out += d; });

  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    try { const r = await fetch(`${BASE}/robots.txt`); if (r.status) return; } catch { /* not yet */ }
  }
  console.error('  server did not come up within 60s:\n' + out.split('\n').slice(-20).join('\n'));
  stop();
  process.exit(1);
}

function stop() {
  if (!server) return;
  try {
    if (!isWin && server.pid) process.kill(-server.pid, 'SIGTERM');
    else if (isWin && server.pid) spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    else server.kill();
  } catch { /* already gone */ }
  try { server.stdout?.destroy(); server.stderr?.destroy(); } catch { /* fine */ }
}
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

const get = async (path) => {
  const res = await fetch(BASE + path, { redirect: 'manual' });
  return { res, body: await res.text() };
};

/* ------------------------------------------------------------------- start */

await boot();

/* ---- robots.txt ---------------------------------------------------------- */

{
  const { res, body } = await get('/robots.txt');
  check('robots.txt is served', res.status === 200, `got ${res.status}`);

  for (const agent of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'OAI-SearchBot', 'CCBot']) {
    check(`robots.txt names ${agent}`, new RegExp(`User-Agent: ${agent}\\b`, 'i').test(body), 'group missing');
  }
  check('robots.txt still points at the sitemap', /^Sitemap: https:\/\/.+\/sitemap\.xml$/m.test(body), 'no Sitemap line');
  check('robots.txt points a language model at llms.txt', /llms\.txt/.test(body), 'no llms.txt reference');
  check('robots.txt points at ai.json', /ai\.json/.test(body), 'no ai.json reference');
  check('robots.txt explains the .md convention', /\.md/.test(body) && /append/i.test(body), 'convention not stated');
  check('robots.txt says this is not a crisis service', /9-8-8/.test(body), 'crisis line missing');
}

/* ---- llms.txt and llms-full.txt ------------------------------------------ */

for (const path of ['/llms.txt', '/llms-full.txt']) {
  const { res, body } = await get(path);
  check(`${path} is served as plain text`, res.status === 200 && /text\/plain/.test(res.headers.get('content-type') || ''), `${res.status} ${res.headers.get('content-type')}`);
  check(`${path} is not empty`, body.length > 2000, `${body.length} bytes`);
}

{
  const { body } = await get('/llms.txt');
  check('llms.txt states the corrections an engine gets wrong', /not a crisis service/i.test(body), 'correction block missing');
  check('llms.txt states that MSP does not cover it', /MSP does not cover/i.test(body), 'coverage correction missing');
  check('llms.txt documents the Markdown twins', /\.md/.test(body) && /ai\.json/.test(body), 'machine-readable section missing');
}

/* ---- ai.json ------------------------------------------------------------- */

{
  const { res, body } = await get('/ai.json');
  check('/ai.json is served as JSON', res.status === 200 && /application\/json/.test(res.headers.get('content-type') || ''), `${res.status} ${res.headers.get('content-type')}`);

  let doc = null;
  try { doc = JSON.parse(body); } catch (e) { bad('/ai.json parses', e.message); }

  if (doc) {
    for (const key of ['name', 'url', 'what_it_is', 'not', 'service_area', 'languages', 'contact', 'consultation', 'counsellors', 'crisis', 'machine_readable']) {
      check(`/ai.json carries ${key}`, doc[key] !== undefined, 'field missing');
    }
    check('/ai.json says plainly that it is not a crisis service', Array.isArray(doc.not) && doc.not.some((n) => /crisis/i.test(n)), 'the correction is not in `not`');
    check('/ai.json names only counsellors taking clients', Array.isArray(doc.counsellors) && doc.counsellors.every((c) => c.accepting_new_clients === true), 'a counsellor not taking clients is listed');
    check('/ai.json carries no registration number', !/\b(20111|26894|11263060|27067)\b/.test(body), 'a registration number leaked into the machine record');
    check('/ai.json points back at the Markdown convention', /\.md/.test(JSON.stringify(doc.machine_readable ?? {})), 'convention not referenced');
  }
}

/* ---- the Markdown twins -------------------------------------------------- */

/* One of each page shape, because the shapes fail differently: a guide is
   prerendered prose, /pricing streams, /faq is all <details>, a city page is
   generated, /index has no slug of its own. */
const TWINS = [
  ['/index.md', 'the home page'],
  ['/guides/stress-leave-bc.md', 'a guide'],
  ['/pricing.md', 'a page that streams its content'],
  ['/book.md', 'the booking page'],
  ['/faq.md', 'a page built of accordions'],
  ['/services/emdr-therapy.md', 'a service'],
  ['/online-counselling/vancouver.md', 'a city page'],
  ['/about.md', 'the about page'],
  ['/resources/verify-a-counsellor-in-bc.md', 'a resource'],
];

for (const [path, what] of TWINS) {
  const { res, body } = await get(path);
  if (res.status !== 200) { bad(`Markdown twin for ${what} (${path})`, `got ${res.status}`); continue; }

  const problems = [];
  if (!/text\/markdown/.test(res.headers.get('content-type') || '')) problems.push(`content-type ${res.headers.get('content-type')}`);
  if (body.length < 1200) problems.push(`only ${body.length} bytes`);
  if (!body.startsWith('---\n')) problems.push('no front matter');
  if (!/^url: https:\/\//m.test(body)) problems.push('front matter has no url');
  if (/<(div|span|section|p|a) /.test(body)) problems.push('raw HTML survived the conversion');
  if (/\bLoading\b/.test(body)) problems.push('serving a Suspense fallback instead of the content');
  if (!/\n#{1,3} /.test(body)) problems.push('no headings at all');

  check(`Markdown twin for ${what} (${path})`, problems.length === 0, problems.join('; '));
}

/* The twins must not become a second address for what is not public. */
for (const path of ['/admin.md', '/signin.md', '/client-portal.md', '/api/cron/nurture.md']) {
  const { res } = await get(path);
  check(`${path} is refused`, res.status === 404, `got ${res.status}`);
}

{
  const { res } = await get('/this-page-does-not-exist.md');
  check('a twin of a page that does not exist is 404', res.status === 404, `got ${res.status}`);
}

/* ---- the headers --------------------------------------------------------- */

{
  const { res } = await get('/guides/stress-leave-bc');
  const link = res.headers.get('link') || '';
  check('an HTML page announces its own Markdown twin',
    link.includes('/guides/stress-leave-bc.md') && link.includes('type="text/markdown"'),
    `Link: ${link || '(none)'}`);
  check('an HTML page announces llms.txt', link.includes('/llms.txt'), `Link: ${link || '(none)'}`);

  const robots = res.headers.get('x-robots-tag') || '';
  check('the snippet limit is lifted for every engine, not only Google',
    /max-snippet:-1/.test(robots) && /max-image-preview:large/.test(robots),
    `X-Robots-Tag: ${robots || '(none)'}`);
}

/* The private routes get the opposite directive, and must not also get the
   permissive one: two X-Robots-Tag values on one response is how a staff page
   ends up with `index, follow` sitting beside `noindex`. */
for (const path of ['/admin', '/signin', '/client-portal', '/search']) {
  const { res } = await get(path);
  const robots = res.headers.get('x-robots-tag') || '';
  check(`${path} is told not to be indexed`,
    /noindex/.test(robots) && !/(^|,|\s)index/.test(robots.replace(/noindex/g, '')),
    `X-Robots-Tag: ${robots || '(none)'}`);
}

{
  const { res } = await get('/');
  const link = res.headers.get('link') || '';
  check('the home page announces /index.md and not "/.md"',
    link.includes('/index.md') && !link.includes('</.md>'),
    `Link: ${link || '(none)'}`);
}

/* ---- the structured data ------------------------------------------------- */

const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap((m) => { try { const v = JSON.parse(m[1]); return Array.isArray(v) ? v : [v]; } catch { return []; } });

{
  const { body } = await get('/services/emdr-therapy');
  const nodes = jsonLd(body);
  const svc = nodes.find((n) => n['@type'] === 'Service');
  check('a service page names the method as an entity',
    Boolean(svc?.about?.sameAs?.length),
    'no about.sameAs on the Service node');
  check('the entity link resolves EMDR to the thing an engine already knows',
    JSON.stringify(svc?.about ?? {}).includes('wikipedia.org'),
    'about carries no encyclopaedia reference');
}

{
  const { body } = await get('/guides/stress-leave-bc');
  const nodes = jsonLd(body);
  const art = nodes.find((n) => n['@type'] === 'Article');
  check('a guide offers its own summary as `abstract`', typeof art?.abstract === 'string' && art.abstract.length > 40, 'no abstract on the Article node');
  check('a guide lists its sources as `citation`', Array.isArray(art?.citation) && art.citation.length > 0, 'no citation array');
  check('a guide still names who reviewed it', Boolean(art?.reviewedBy), 'reviewedBy gone');
}

{
  const { body } = await get('/pricing');
  const nodes = jsonLd(body);
  const page = nodes.find((n) => n.speakable);
  check('a commercial page names which sentences answer the question',
    Boolean(page?.speakable?.cssSelector?.length),
    'no speakable on /pricing');
}

/* ---- the third-party links, only when asked ------------------------------ */

if (CHECK_LINKS) {
  const src = readFileSync(new URL('../lib/entities.ts', import.meta.url), 'utf8');
  const urls = [...new Set([...src.matchAll(/\$\{W\}([A-Za-z0-9_()%-]+)/g)].map((m) => `https://en.wikipedia.org/wiki/${m[1]}`))];
  for (const url of urls) {
    let status = 0;
    try { status = (await fetch(url, { redirect: 'follow' })).status; } catch { status = 0; }
    if (status === 429) { notes.push(`${url} — rate-limited, not checked`); console.log(`  ....  ${url} (429, not checked)`); }
    else check(`entity URL resolves: ${url.split('/wiki/')[1]}`, status === 200, `got ${status}`);
    await sleep(1200);
  }
} else {
  notes.push('The encyclopaedia URLs in lib/entities.ts were NOT requested. Run with --links to check them.');
}

/* ------------------------------------------------------------------ report */

console.log(`\n${'-'.repeat(78)}\n`);

if (notes.length) {
  console.log('  Not checked:');
  for (const n of notes) console.log(`    - ${n}`);
  console.log('');
}

if (failures.length) {
  console.log(`  ${passed} passed, ${failures.length} FAILED\n`);
  for (const f of failures) console.log(`    - ${f}`);
  console.log('\n  Everything above is invisible on the site and visible to a request,');
  console.log('  which is why it is checked by request. Fix before deploying.\n');
  stop();
  process.exit(1);
}

console.log(`  ${passed}/${passed} checks passed.\n`);
console.log('  Every page has a Markdown twin, robots.txt says where the machine-');
console.log('  readable files are, and the structured data names its entities.\n');
stop();
process.exit(0);
