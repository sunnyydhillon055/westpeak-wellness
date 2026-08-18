#!/usr/bin/env node
/* Push the URL list to IndexNow now, rather than waiting for Monday.
 *
 * WHY THIS EXISTS
 *
 * /api/indexnow is on a weekly cron (`0 9 * * 1`). That is a sensible default
 * for a site that publishes in batches, and a poor one the moment something is
 * published on a Tuesday — it then sits unannounced for six days. The cron is
 * the floor, not the mechanism; this is the mechanism.
 *
 * WHAT IT DOES NOT DO
 *
 * Google does not participate in IndexNow. This reaches Bing, Yandex, Seznam
 * and Naver, and it is worth doing because it is free and instant — but the
 * homepage re-crawl problem that matters most for this practice is a Google
 * problem and this will not touch it. That one needs Search Console.
 *
 *   CRON_SECRET=... node scripts/indexnow.mjs
 *   CRON_SECRET=... node scripts/indexnow.mjs --dry
 *   CRON_SECRET=... SITE=https://staging.example node scripts/indexnow.mjs
 */
const SITE = (process.env.SITE || 'https://www.westpeakwellness.com').replace(/\/+$/, '');
const SECRET = process.env.CRON_SECRET?.trim();
const DRY = process.argv.includes('--dry');

if (!SECRET) {
  console.error(
    'CRON_SECRET is not set.\n' +
    'It is the same value the Vercel cron uses; pull it with `vercel env pull` or copy it\n' +
    'from the project\'s environment variables. Without it the endpoint returns 401 —\n' +
    'which is the point, since submitting a URL list is a write to somebody else\'s index.'
  );
  process.exit(1);
}

const url = `${SITE}/api/indexnow${DRY ? '?dry=1' : ''}`;

try {
  const res = await fetch(url, { headers: { authorization: `Bearer ${SECRET}` } });
  const body = await res.text();

  if (!res.ok) {
    console.error(`${res.status} ${res.statusText} from ${url}`);
    console.error(body.slice(0, 600));
    process.exit(1);
  }

  /* The endpoint answers JSON; print it whole rather than a summary, because
     the per-engine results are the only evidence a submission landed and a
     "done" that hides a 4xx from one engine is worse than no message. */
  try {
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  } catch {
    console.log(body.slice(0, 1200));
  }
  console.log(DRY ? '\ndry run — nothing submitted' : '\nsubmitted');
} catch (e) {
  console.error(`Could not reach ${url}`);
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
