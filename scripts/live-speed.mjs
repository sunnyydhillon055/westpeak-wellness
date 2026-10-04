#!/usr/bin/env node
/* LIVE SPEED — one mobile pass over the eight templates, weekly. 3 Oct 2026 (item 471).
 *
 * WHY. On 1 Oct 2026 the inlined first-paint CSS stopped reaching every page
 * that revalidates (scripts/inline-css.mjs explains how), and nothing noticed
 * for two days: every local gate reads the build, and the build was fine. By
 * 3 Oct production served the guides and resources with three blocking
 * stylesheet links and Lighthouse charged 100-430 ms of render-blocking on
 * the top templates. This asks production itself, once a week, as part of
 * `npm run verify:weekly`.
 *
 * WHAT. For each of the eight template URLs below, 2 s apart:
 *   - with PAGESPEED_API_KEY set: one mobile Lighthouse run through the
 *     PageSpeed Insights API (the keyless quota answered 429 with a limit of
 *     0 on 3 Oct, so it is not tried without a key);
 *   - else, with a `lighthouse` binary on PATH or in node_modules/.bin: one
 *     local mobile run;
 *   - else: the HTML alone, read with a browser user agent: stylesheet links
 *     that block first paint, whether the inlined block is there, and the
 *     document's size. The browser metrics are then null and say why.
 * It writes perf, FCP, LCP, TBT, CLS, the render-blocking count and the RSC
 * prefetch bytes to data/speed/<date>.json with the change since the last
 * file there, and prints the same.
 *
 * FAILS (exit 1) when a static template blocks first paint on a stylesheet
 * again, or CLS is measured above 0.1. Everything else is reported, not
 * judged: a single Lighthouse pass moves by 10 points between runs.
 *
 * Production requests: eight, one per template. No cookies, no forms.
 *
 * Usage: node scripts/live-speed.mjs [--out dir] [--base https://…] [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, delimiter } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

export const TEMPLATES = [
  '/',
  '/guides/stress-leave-bc',
  '/resources/msp-vs-extended-health',
  '/compare/therapy-in-punjabi-vs-english',
  '/practitioners/savneet-singh',
  '/practitioners/savneet-singh/surrey',
  '/online-counselling/surrey',
  '/online-counselling/surrey/emdr-therapy',
];
/** Every template above is a static document since item 429; one that blocks
 *  first paint on a stylesheet has regressed. */
export const STATIC_TEMPLATES = new Set(TEMPLATES);
export const CLS_LIMIT = 0.1;
const UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

/* ---------- pure parts, tested in test/live-speed.test.mts ---------- */

/** Stylesheet links that block first paint, and whether the inlined block is there. */
export function htmlBlocking(html) {
  const links = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  const blocking = links.filter((l) => !/media="print"/.test(l)).length;
  return { blocking, inlined: html.includes('<style data-inlined>'), bytes: Buffer.byteLength(html) };
}

/** The numbers this report keeps, from a Lighthouse result (lhr). */
export function fromLighthouse(lhr) {
  const a = lhr?.audits ?? {};
  const num = (k) => (typeof a[k]?.numericValue === 'number' ? Math.round(a[k].numericValue * (k === 'cumulative-layout-shift' ? 1000 : 1)) / (k === 'cumulative-layout-shift' ? 1000 : 1) : null);
  const items = a['network-requests']?.details?.items ?? [];
  const prefetchBytes = items
    .filter((i) => typeof i.url === 'string' && /[?&]_rsc=/.test(i.url))
    .reduce((n, i) => n + (i.transferSize ?? 0), 0);
  const score = lhr?.categories?.performance?.score;
  return {
    perf: typeof score === 'number' ? Math.round(score * 100) : null,
    fcp: num('first-contentful-paint'),
    lcp: num('largest-contentful-paint'),
    tbt: num('total-blocking-time'),
    cls: num('cumulative-layout-shift'),
    renderBlocking: a['render-blocking-resources']?.details?.items?.length ?? null,
    prefetchBytes,
  };
}

const FIELDS = ['perf', 'fcp', 'lcp', 'tbt', 'cls', 'renderBlocking', 'prefetchBytes', 'htmlBytes'];

/** Per URL, the change in each field since the previous run, where both have it. */
export function diffRuns(prev, cur) {
  const before = new Map((prev?.pages ?? []).map((p) => [p.path, p]));
  return cur.pages.map((p) => {
    const b = before.get(p.path);
    const change = {};
    for (const f of FIELDS) {
      if (b && typeof b[f] === 'number' && typeof p[f] === 'number') change[f] = Math.round((p[f] - b[f]) * 1000) / 1000;
    }
    return { path: p.path, change };
  });
}

/** What fails the run. Unmeasured values never fail it; they are reported. */
export function failuresOf(pages) {
  const out = [];
  for (const p of pages) {
    if (p.error) { out.push(`${p.path}: ${p.error}`); continue; }
    const blocking = typeof p.renderBlocking === 'number' ? p.renderBlocking : null;
    if (STATIC_TEMPLATES.has(p.path) && blocking !== null && blocking > 0) {
      out.push(`${p.path}: ${blocking} render-blocking stylesheet(s) on a static template`);
    }
    if (typeof p.cls === 'number' && p.cls > CLS_LIMIT) out.push(`${p.path}: CLS ${p.cls} is above ${CLS_LIMIT}`);
  }
  return out;
}

/* ---------- the run ---------- */

function lighthouseBin() {
  const dirs = [join(process.cwd(), 'node_modules', '.bin'), ...(process.env.PATH ?? '').split(delimiter)];
  for (const d of dirs) {
    for (const n of process.platform === 'win32' ? ['lighthouse.cmd', 'lighthouse.exe'] : ['lighthouse']) {
      if (d && existsSync(join(d, n))) return join(d, n);
    }
  }
  return null;
}

async function viaPsi(url, key) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(url)}&key=${encodeURIComponent(key)}`;
  const res = await fetch(api);
  if (!res.ok) throw new Error(`PSI HTTP ${res.status}`);
  return fromLighthouse((await res.json()).lighthouseResult);
}

function viaLocal(bin, url) {
  const r = spawnSync(bin, [url, '--output=json', '--output-path=stdout', '--form-factor=mobile', '--only-categories=performance', '--quiet', '--chrome-flags=--headless=new'], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: process.platform === 'win32',
  });
  if (r.status !== 0) throw new Error(`lighthouse exited ${r.status}`);
  return fromLighthouse(JSON.parse(r.stdout));
}

async function main() {
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
  const base = (arg('--base', 'https://www.westpeakwellness.com')).replace(/\/$/, '');
  const outDir = arg('--out', join(process.cwd(), 'data', 'speed'));
  const dry = process.argv.includes('--dry');
  const key = process.env.PAGESPEED_API_KEY || '';
  const bin = key ? null : lighthouseBin();
  const mode = key ? 'psi' : bin ? 'lighthouse' : 'html';
  const why = mode === 'html' ? 'no PAGESPEED_API_KEY and no lighthouse binary: browser metrics not measured' : undefined;

  console.log(`\nLIVE SPEED - ${TEMPLATES.length} templates on ${base}, mode ${mode}${why ? ` (${why})` : ''}\n`);
  const pages = [];
  for (const [i, path] of TEMPLATES.entries()) {
    if (i) await sleep(2000);
    const url = base + path;
    const row = { path };
    try {
      /* The document itself, always: the inlined block and the blocking
         links are what regressed on 1 Oct, and they need no browser. */
      const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, redirect: 'manual' });
      if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
      const h = htmlBlocking(await res.text());
      Object.assign(row, { inlined: h.inlined, htmlBytes: h.bytes, renderBlocking: h.blocking });
      if (mode !== 'html') {
        const m = mode === 'psi' ? await viaPsi(url, key) : viaLocal(bin, url);
        Object.assign(row, m, { renderBlocking: m.renderBlocking ?? h.blocking });
      } else {
        Object.assign(row, { perf: null, fcp: null, lcp: null, tbt: null, cls: null, prefetchBytes: null });
      }
    } catch (e) {
      row.error = e instanceof Error ? e.message : String(e);
    }
    pages.push(row);
    const f = (v, u = '') => (v === null || v === undefined ? '-' : `${v}${u}`);
    console.log(`  ${path.padEnd(44)} perf ${f(row.perf)}  FCP ${f(row.fcp, 'ms')}  LCP ${f(row.lcp, 'ms')}  TBT ${f(row.tbt, 'ms')}  CLS ${f(row.cls)}  blocking ${f(row.renderBlocking)}  inlined ${f(row.inlined)}  prefetch ${f(row.prefetchBytes, 'B')}${row.error ? `  ERROR ${row.error}` : ''}`);
  }

  /* The Pacific calendar date, as the rest of the site dates things. */
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver' }).format(new Date());
  const run = { date, base, mode, ...(why ? { note: why } : {}), pages };
  let prev = null;
  if (existsSync(outDir)) {
    const files = readdirSync(outDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f !== `${date}.json`).sort();
    if (files.length) prev = JSON.parse(readFileSync(join(outDir, files[files.length - 1]), 'utf8'));
  }
  run.sincePrevious = prev ? { date: prev.date, pages: diffRuns(prev, run) } : null;
  if (prev) {
    console.log(`\n  change since ${prev.date}:`);
    for (const d of run.sincePrevious.pages) {
      const parts = Object.entries(d.change).filter(([, v]) => v !== 0).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`);
      console.log(`   ${d.path.padEnd(44)} ${parts.join('  ') || 'no change'}`);
    }
  }
  if (!dry) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${date}.json`), JSON.stringify(run, null, 2) + '\n');
    console.log(`\n  wrote ${join(outDir, `${date}.json`)}`);
  }

  const fails = failuresOf(pages);
  if (fails.length) {
    console.log('\nFAILED');
    for (const f of fails) console.log(`   ${f}`);
    console.log('\n  A static template that blocks on its stylesheet has lost the inlined CSS; see scripts/inline-css.mjs.\n');
    process.exit(1);
  }
  console.log('\n  No static template blocks first paint on a stylesheet; no measured CLS above 0.1.\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
