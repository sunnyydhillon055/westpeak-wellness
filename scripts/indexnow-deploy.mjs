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
 * WHAT IT SENDS. The live sitemap's <loc>s whose <lastmod> is on or after the
 * commit day (`git log -1 --format=%cs`, passed as --since), plus the retired
 * URLs from lib/redirects.mjs, chosen by parseUrlset and selectUrls in
 * lib/indexnow.ts, so the cron and the deploy pick URLs the same way. One
 * POST; anything but 200 or 202 fails the job.
 *
 * The Monday cron (/api/indexnow) and the /admin button are unchanged and
 * still send everything since the cron's own last success.
 *
 *   node --experimental-strip-types scripts/indexnow-deploy.mjs --since 2026-10-02
 *   node --experimental-strip-types scripts/indexnow-deploy.mjs --since 2026-10-02 --dry
 */
import { pathToFileURL } from 'node:url';
import { parseUrlset, selectUrls, INDEXNOW_KEY } from '../lib/indexnow.ts';
import { permanentLiteralSources } from '../lib/redirects.mjs';

export const ENDPOINT = 'https://api.indexnow.org/indexnow';
export const ORIGIN = 'https://www.westpeakwellness.com';
/* The site answers a bare client differently from a browser on some edges;
   ask the way a person's browser would. */
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';

/** A YYYY-MM-DD day, or null. */
export function dayArg(argv) {
  const i = argv.indexOf('--since');
  const v = i >= 0 ? argv[i + 1] : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(v ?? '') ? v : null;
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

async function getText(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8' } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.text();
}

async function sitemapEntries(origin) {
  const xml = await getText(`${origin}/sitemap.xml`);
  if (!/<sitemapindex/.test(xml)) return parseUrlset(xml);
  const out = [];
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) out.push(...parseUrlset(await getText(m[1].trim())));
  return out;
}

async function main(argv) {
  const since = dayArg(argv);
  if (!since) {
    console.error('Pass --since YYYY-MM-DD (the commit day).');
    return 1;
  }
  const entries = await sitemapEntries(ORIGIN);
  if (!entries.length) {
    console.error('The sitemap yielded no URLs.');
    return 1;
  }
  const urls = selectUrls(entries, since, permanentLiteralSources(), ORIGIN);
  console.log(`${urls.length} URLs: lastmod on or after ${since}, plus ${permanentLiteralSources().length} retired.`);
  if (argv.includes('--dry')) {
    for (const u of urls) console.log(`  ${u}`);
    return 0;
  }
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload(urls)),
  });
  console.log(`IndexNow answered ${r.status}`);
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
