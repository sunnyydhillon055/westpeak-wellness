#!/usr/bin/env node
/* THE DEPLOY PING, WITHOUT A SECRET — 2 Oct 2026.
 *
 * .github/workflows/indexnow.yml used to POST /api/indexnow with CRON_SECRET,
 * and exited green with "CRON_SECRET not set … skipping" when the secret was
 * absent, which it has been since the job was written. So a push to main told
 * Bing nothing until the Monday cron, and a green tick proved nothing.
 *
 * The secret was never needed for this. The IndexNow key is public by
 * protocol: it is served at /<key>.txt so an engine can check that whoever
 * submits URLs for a host controls it. What the secret guards is the route,
 * which also writes the cron's health record; this script writes nothing on
 * the site. It submits straight to api.indexnow.org with the public key.
 *
 * ONLY WHAT THIS DEPLOY CHANGED — 4 Oct 2026. It used to send every sitemap
 * URL whose <lastmod> fell on or after the commit day, plus every retired URL
 * in lib/redirects.mjs, on every push. Three pushes in a day re-sent the same
 * pages three times, the ~retired list went out each time whether or not a
 * redirect had been added, and a commit that changed pages without
 * re-running `npm run hashes` (the 15-minute consultation change, 3 Oct,
 * about 190 files) moved no lastmod and so sent none of them.
 *
 * Now the pushed range decides. data/page-hashes.json records a hash of each
 * listed page's rendered <main> text (scripts/page-hash-dates.mjs), and
 * `npm run hashes:check` in verify:ci fails a commit whose pages moved
 * without the record moving with them. So the record at the pushed commit
 * against the record at the commit before the push says exactly which pages
 * changed. Sent:
 *   - pages whose hash differs, and pages new to the record;
 *   - pages that left the record (removed or no longer listed), so an engine
 *     re-fetches them and sees the 404 or redirect;
 *   - redirect sources added to lib/redirects.mjs in the range.
 * Nothing changed means no POST at all. A page's <title> or description
 * changing alone does not move its hash (the hash is <main> only, by design:
 * see scripts/lib/page-hash.mjs).
 *
 * The Monday cron (/api/indexnow) and the /admin button are unchanged and
 * still send everything whose lastmod is after the cron's last success.
 *
 *   node --experimental-strip-types scripts/indexnow-deploy.mjs --from <sha> --to <sha>
 *   node --experimental-strip-types scripts/indexnow-deploy.mjs --from <sha> --to <sha> --dry
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { INDEXNOW_KEY } from '../lib/indexnow.ts';

export const ENDPOINT = 'https://api.indexnow.org/indexnow';
export const ORIGIN = 'https://www.westpeakwellness.com';
export const RECORD = 'data/page-hashes.json';
const REDIRECTS = 'lib/redirects.mjs';
/** IndexNow's own ceiling for one submission. */
export const MAX_URLS = 10000;

/** A commit id after `flag`, or null. Only hex, so nothing else reaches git. */
export function shaArg(argv, flag) {
  const i = argv.indexOf(flag);
  const v = i >= 0 ? argv[i + 1] : '';
  return /^[0-9a-f]{7,40}$/i.test(v ?? '') && !/^0+$/.test(v) ? v : null;
}

/** The request body for one submission. */
export function payload(urls, origin = ORIGIN) {
  return {
    host: new URL(origin).host,
    key: INDEXNOW_KEY,
    keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
}

/** True for the two statuses IndexNow uses for an accepted submission. */
export const accepted = (status) => status === 200 || status === 202;

/** Paths whose page changed between two hash records, and paths that left. */
export function diffRecords(before, after) {
  const changed = [];
  const removed = [];
  for (const [path, v] of Object.entries(after)) {
    if (!before[path] || before[path].hash !== v.hash) changed.push(path);
  }
  for (const path of Object.keys(before)) if (!after[path]) removed.push(path);
  return { changed: changed.sort(), removed: removed.sort() };
}

/** Redirect sources present after and not before. */
export const addedSources = (before, after) => {
  const had = new Set(before);
  return [...new Set(after)].filter((s) => !had.has(s)).sort();
};

/** The absolute URLs to send, deduplicated, at most MAX_URLS. */
export function deployUrls({ changed, removed, retired }, origin = ORIGIN) {
  const paths = [...new Set([...changed, ...removed, ...retired])];
  return paths.map((p) => `${origin}${p === '/' ? '/' : p}`).slice(0, MAX_URLS);
}

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/** The file at a commit, or null when it did not exist there. */
function fileAt(sha, path) {
  try {
    return git(['show', `${sha}:${path}`]);
  } catch {
    return null;
  }
}

/** permanentLiteralSources() as lib/redirects.mjs stood at a commit. */
async function retiredAt(sha) {
  const src = fileAt(sha, REDIRECTS);
  if (src == null) return [];
  const dir = mkdtempSync(join(tmpdir(), 'indexnow-'));
  try {
    const file = join(dir, `redirects-${sha}.mjs`);
    writeFileSync(file, src);
    const mod = await import(pathToFileURL(file).href);
    return mod.permanentLiteralSources();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function main(argv) {
  const from = shaArg(argv, '--from');
  const to = shaArg(argv, '--to') ?? 'HEAD';
  if (!from) {
    console.error('Pass --from <sha> (the commit before the push) and --to <sha>.');
    return 1;
  }
  const beforeRaw = fileAt(from, RECORD);
  const afterRaw = fileAt(to, RECORD);
  if (afterRaw == null) {
    console.error(`${RECORD} is missing at ${to}.`);
    return 1;
  }
  const before = beforeRaw == null ? {} : JSON.parse(beforeRaw);
  const after = JSON.parse(afterRaw);
  const { changed, removed } = diffRecords(before, after);
  const retired = addedSources(await retiredAt(from), await retiredAt(to));
  const urls = deployUrls({ changed, removed, retired });

  console.log(`${from.slice(0, 7)}..${String(to).slice(0, 7)}: ${changed.length} changed or new, ${removed.length} removed, ${retired.length} new redirects.`);
  if (!urls.length) {
    console.log('No page content changed in this deploy; nothing sent.');
    return 0;
  }
  if (argv.includes('--dry')) {
    for (const u of urls) console.log(`  ${u}`);
    return 0;
  }
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload(urls)),
  });
  console.log(`IndexNow answered ${r.status} for ${urls.length} URLs`);
  if (!accepted(r.status)) {
    console.error((await r.text()).slice(0, 600));
    return 1;
  }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    },
  );
}
