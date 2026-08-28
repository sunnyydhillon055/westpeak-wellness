/* COMPETITOR SCAN — the same measurement applied to every site in the set.
 *
 * WHY THIS EXISTS
 *
 * Two previous competitive audits in this repo disagreed by 5,000 points
 * (COMPETITIVE_AUDIT.md scored Westpeak 1st; SEO_COMPETITIVE_2026-08-17.md
 * scored it last). Both were right — they scored different things. The way to
 * stop that recurring is to record what was actually fetched, so a later pass
 * reads raw numbers instead of re-deriving them from a summary.
 *
 * WHAT IT DOES NOT MEASURE
 *
 * Backlinks, Google Business Profile, reviews and rank positions are off-site
 * and cannot be read out of a site's own HTML. Those are gathered separately
 * and marked as such. Nothing here is a ranking.
 *
 * POLITENESS
 *
 * One request at a time with a delay. A scan that hammers eleven small
 * practices is both rude and a good way to earn a 403 and record a wrong
 * answer as if it were a finding.
 */
import { writeFileSync } from 'node:fs';

const SITES = [
  ['westpeak', 'https://www.westpeakwellness.com'],
  ['clearheart', 'https://clearheartcounselling.com'],
  ['thrive', 'https://www.thrivewellbc.com'],
  ['tidal', 'https://tidaltrauma.com'],
  ['upstream', 'https://www.upstreamcounselling.com'],
  ['wellbeings', 'https://wellbeingscounselling.ca'],
  ['skylark', 'https://abbotsford.skylarkclinic.ca'],
  ['wellnest', 'https://www.wellnest.ca'],
  ['crossroads', 'https://crossroadscollective.ca'],
  ['sana', 'https://sanacounselling.ca'],
  ['jashundal', 'https://www.jashundal.com'],
];

const UA = 'Mozilla/5.0 (compatible; westpeak-audit/1.0; +https://www.westpeakwellness.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grab(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow' });
    const body = await res.text();
    return {
      ok: res.ok, status: res.status, url: res.url, body,
      bytes: Buffer.byteLength(body),
      cache: res.headers.get('cache-control') || '',
      server: res.headers.get('server') || '',
    };
  } catch (e) {
    return { ok: false, status: 0, url, body: '', bytes: 0, error: String(e.message || e) };
  }
}

/* Strip script/style/svg before counting words, or every inline JSON-LD blob and
   hydration payload counts as prose. That exact mistake inflated a page-depth
   figure earlier in this project and produced three findings that had to be
   withdrawn. */
function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function attr(tag, name) {
  const m = tag.match(new RegExp(name + '\\s*=\\s*["\']([^"\']*)["\']', 'i'));
  return m ? m[1] : '';
}

function parsePage(html, origin) {
  const jsonld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  for (const m of jsonld) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) types.add(t[1]);
    /* Array form too: `"@type":["MedicalBusiness","ProfessionalService"]`. The
       first version of this scan matched only the string form and therefore
       reported that Westpeak had no LocalBusiness-family type when its own
       layout.tsx emits exactly that. A scan that misses a type it was written
       to find produces a confident wrong answer, which is worse than no scan. */
    for (const t of m[1].matchAll(/"@type"\s*:\s*\[([^\]]+)\]/g)) {
      for (const one of t[1].matchAll(/"([^"]+)"/g)) types.add(one[1]);
    }
  }
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
  const internal = links.filter((h) => h.startsWith('/') || h.startsWith(origin));
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (n) => {
    const t = metas.find((x) => attr(x, 'name').toLowerCase() === n || attr(x, 'property').toLowerCase() === n);
    return t ? attr(t, 'content') : '';
  };
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const canonTag = (html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i) || [''])[0];
  const text = textOf(html);
  return {
    title, titleLen: title.length,
    descLen: meta('description').length,
    canonical: canonTag ? attr(canonTag, 'href') : '',
    ogTitle: !!meta('og:title'), ogImage: !!meta('og:image'), ogType: !!meta('og:type'),
    twitter: !!meta('twitter:card'),
    viewport: !!meta('viewport'),
    robotsMeta: meta('robots'),
    h1: (html.match(/<h1\b/gi) || []).length,
    h2: (html.match(/<h2\b/gi) || []).length,
    h3: (html.match(/<h3\b/gi) || []).length,
    words: text.split(' ').filter(Boolean).length,
    imgs: imgs.length,
    imgsAlt: imgs.filter((i) => /\balt\s*=\s*["'][^"']+["']/i.test(i)).length,
    imgsLazy: imgs.filter((i) => /loading\s*=\s*["']lazy["']/i.test(i)).length,
    imgsModern: imgs.filter((i) => /\.(webp|avif)/i.test(i)).length,
    links: links.length, internal: internal.length,
    schemaTypes: [...types],
    lang: attr((html.match(/<html\b[^>]*>/i) || [''])[0], 'lang'),
    hreflang: (html.match(/hreflang=/gi) || []).length,
    hasForm: /<form\b/i.test(html),
    telLinks: (html.match(/href=["']tel:/gi) || []).length,
    mailLinks: (html.match(/href=["']mailto:/gi) || []).length,
  };
}

async function sitemapUrls(origin, robotsBody) {
  const found = new Set();
  let lastmod = 0;
  const seeds = [...robotsBody.matchAll(/^[ \t]*sitemap:[ \t]*(\S+)/gim)].map((m) => m[1]);
  if (!seeds.length) seeds.push(origin + '/sitemap.xml', origin + '/sitemap_index.xml');
  const seen = new Set();
  const queue = [...new Set(seeds)];
  let fetched = 0;
  while (queue.length && fetched < 12) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    const r = await grab(sm);
    fetched++;
    await sleep(500);
    if (!r.ok) continue;
    lastmod += (r.body.match(/<lastmod>/gi) || []).length;
    const isIndex = /<sitemapindex/i.test(r.body);
    for (const m of r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      if (isIndex) queue.push(m[1]); else found.add(m[1]);
    }
  }
  return { urls: [...found], sitemapsFetched: fetched, lastmod, seeds };
}

const out = {};
for (const [key, origin] of SITES) {
  process.stdout.write('\n== ' + key + ' ' + origin + '\n');
  const rec = { key, origin };

  const robots = await grab(origin + '/robots.txt');
  await sleep(700);
  rec.robots = {
    ok: robots.ok, status: robots.status,
    disallows: (robots.body.match(/^[ \t]*disallow:/gim) || []).length,
    sitemapLines: (robots.body.match(/^[ \t]*sitemap:/gim) || []).length,
    namesAIBots: /GPTBot|CCBot|anthropic|ClaudeBot|PerplexityBot/i.test(robots.body),
  };

  const sm = await sitemapUrls(origin, robots.ok ? robots.body : '');
  rec.sitemap = { count: sm.urls.length, fetched: sm.sitemapsFetched, lastmod: sm.lastmod, seeds: sm.seeds };
  process.stdout.write('   robots ' + robots.status + '  sitemap urls ' + sm.urls.length + '\n');

  /* Homepage plus an even spread through the sitemap, so the sample is not five
     pages off the same template. */
  const pool = sm.urls.filter((u) => !/\.(xml|jpg|png|pdf|webp)$/i.test(u));
  const picks = [origin + '/'];
  if (pool.length) {
    const step = Math.max(1, Math.floor(pool.length / 5));
    for (let i = 0; i < pool.length && picks.length < 6; i += step) picks.push(pool[i]);
  }

  rec.pages = [];
  for (const u of [...new Set(picks)].slice(0, 6)) {
    const r = await grab(u);
    await sleep(900);
    if (!r.ok) { rec.pages.push({ url: u, status: r.status, error: r.error || 'not ok' }); continue; }
    rec.pages.push({ url: u, status: r.status, bytes: r.bytes, cache: r.cache, server: r.server, ...parsePage(r.body, origin) });
    process.stdout.write('   ' + r.status + ' ' + String(r.bytes).padStart(7) + 'b  ' + u.slice(0, 76) + '\n');
  }
  out[key] = rec;
}

writeFileSync(new URL('../data/competitors/scan.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('\nwrote data/competitors/scan.json');
