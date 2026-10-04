/* CRAWL SIGNALS THAT MUST AGREE WITH EACH OTHER — 3 Oct 2026.
 *
 * Two checks for scripts/seo-audit.mjs, kept here as plain functions so a
 * test can pin them.
 *
 * ROBOTS AGAINST IMAGES. robots.txt disallowed /opengraph-image for every
 * agent while every page's og:image and its Article and Organization JSON-LD
 * image pointed at exactly that route. Googlebot could not fetch the image
 * the structured data names, and nothing failed, because no check read the
 * two files together.
 *
 * HREFLANG CLUSTERS. An alternate only counts when both pages state it. Two
 * Tagalog guides both claimed one English guide, so the English page could
 * name only one: the HTML named the first, the sitemap the last. Five Punjabi
 * guides declared English alternates the English guides never returned. The
 * live sitemap carried ten one-way alternates and no check noticed.
 */

/* ---- robots.txt --------------------------------------------------------- */

/** Groups of { agents, rules } in file order. Consecutive User-agent lines
 *  share one group, as the protocol (RFC 9309) says. */
export function parseRobots(text) {
  const groups = [];
  let current = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent || !current) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === 'allow' || key === 'disallow') current.rules.push({ type: key, path: value });
  }
  return groups;
}

/** The rules that apply to one agent: its own group(s), or `*` when it has none. */
export function rulesFor(groups, agent) {
  const a = agent.toLowerCase();
  const own = groups.filter((g) => g.agents.includes(a));
  const pick = own.length ? own : groups.filter((g) => g.agents.includes('*'));
  return pick.flatMap((g) => g.rules);
}

const toRegex = (pattern) => {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
};

/** True when `pattern` (with * and a trailing $) matches the start of `path`. */
export const robotsMatch = (pattern, path) => toRegex(pattern).test(path);

/** The Disallow rule that blocks `path` under `rules`, or null. Longest match
 *  wins, and Allow wins a tie, as Google resolves it. */
export function blockedBy(rules, path) {
  let best = null;
  for (const r of rules) {
    if (!r.path) continue;
    if (!robotsMatch(r.path, path)) continue;
    const len = r.path.length;
    if (!best || len > best.len || (len === best.len && r.type === 'allow')) best = { ...r, len };
  }
  return best && best.type === 'disallow' ? best.path : null;
}

/* ---- images a page names ------------------------------------------------ */

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

function collectImages(node, out) {
  if (Array.isArray(node)) {
    for (const n of node) collectImages(n, out);
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (k === 'image' || k === 'logo' || k === 'thumbnailUrl') {
      for (const item of Array.isArray(v) ? v : [v]) {
        if (typeof item === 'string') out.push(item);
        else if (item && typeof item === 'object') {
          if (typeof item.url === 'string') out.push(item.url);
          if (typeof item.contentUrl === 'string') out.push(item.contentUrl);
        }
      }
    }
    if (v && typeof v === 'object') collectImages(v, out);
  }
}

/** Every image URL the page's head meta and JSON-LD name, deduplicated. */
export function namedImages(html) {
  const out = [];
  for (const m of html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:image|og:image:url|og:image:secure_url|twitter:image)"[^>]*>/gi)) {
    const c = m[0].match(/\scontent="([^"]*)"/i);
    if (c) out.push(decode(c[1]));
  }
  for (const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      collectImages(JSON.parse(m[1]), out);
    } catch {
      /* unparseable JSON-LD is schema-audit's finding, not this one's */
    }
  }
  return [...new Set(out)];
}

/** Of `urls`, those on `origin` that robots.txt blocks for `agent`, as [url, rule]. */
export function blockedImages(urls, robotsText, origin, agent = '*') {
  const rules = rulesFor(parseRobots(robotsText), agent);
  const out = [];
  for (const u of urls) {
    let url;
    try {
      url = new URL(u, origin);
    } catch {
      continue;
    }
    if (url.origin !== new URL(origin).origin) continue;
    const rule = blockedBy(rules, url.pathname + url.search);
    if (rule) out.push([u, rule]);
  }
  return out;
}

/* ---- hreflang ------------------------------------------------------------ */

/** <link rel="alternate" hreflang> pairs in a page's head, in order. */
export function htmlAlternates(html) {
  const out = [];
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\brel="alternate"/i.test(tag)) continue;
    const lang = tag.match(/\bhreflang="([^"]+)"/i);
    const href = tag.match(/\bhref="([^"]+)"/i);
    if (lang && href) out.push({ lang: lang[1], href: decode(href[1]) });
  }
  return out;
}

/** loc -> alternates, for every <url> of a urlset that states any. */
export function sitemapAlternates(xml) {
  const out = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    const alts = [...m[1].matchAll(/<xhtml:link\b[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((a) => ({
      lang: a[1],
      href: decode(a[2]),
    }));
    if (alts.length) out.set(decode(loc.trim()), alts);
  }
  return out;
}

/**
 * Problems in a set of hreflang declarations. `declared` maps a page URL to
 * the alternates that page states. `known` is every URL whose declarations
 * were read; a target outside it is reported as unverified rather than wrong.
 *
 *   duplicate     one page names two URLs for one language
 *   no-self       a page's cluster does not include the page itself
 *   one-way       a page names a twin that does not name it back
 *   unverified    a twin whose own declarations could not be read
 */
export function hreflangProblems(declared, known = new Set(declared.keys())) {
  const problems = [];
  for (const [page, alts] of declared) {
    const seen = new Map();
    for (const a of alts) {
      const prior = seen.get(a.lang);
      if (prior !== undefined && prior !== a.href)
        problems.push({ kind: 'duplicate', page, detail: `${a.lang} is both ${prior} and ${a.href}` });
      seen.set(a.lang, a.href);
    }
    if (!alts.some((a) => a.href === page && a.lang !== 'x-default'))
      problems.push({ kind: 'no-self', page, detail: 'its own URL is not in its cluster' });
    for (const a of alts) {
      if (a.lang === 'x-default' || a.href === page) continue;
      if (!known.has(a.href)) {
        problems.push({ kind: 'unverified', page, detail: `${a.lang} ${a.href} was not read` });
        continue;
      }
      const back = declared.get(a.href) ?? [];
      if (!back.some((b) => b.href === page))
        problems.push({ kind: 'one-way', page, detail: `${a.lang} ${a.href} does not name it back` });
    }
  }
  return problems;
}

/** Pages whose sitemap cluster and HTML cluster differ, as [url, detail]. */
export function clusterMismatches(fromHtml, fromSitemap, listed = new Set(fromSitemap.keys())) {
  const key = (alts) => alts.map((a) => `${a.lang} ${a.href}`).sort().join(' | ');
  const out = [];
  for (const [url, alts] of fromSitemap) {
    const html = fromHtml.get(url);
    if (!html) continue;
    if (key(html) !== key(alts)) out.push([url, `sitemap: ${key(alts)}; page: ${key(html) || 'none'}`]);
  }
  for (const [url, alts] of fromHtml) {
    if (listed.has(url) && !fromSitemap.has(url) && alts.length) out.push([url, `page declares ${alts.length} alternates the sitemap does not`]);
  }
  return out;
}
