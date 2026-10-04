/* THE SHAPE OF THE SITEMAP, WITHOUT THE DATA — 3 Oct 2026.
 *
 * lib/sitemap.ts assembles the list of pages from a dozen collections; this
 * file holds everything about that list that does not need the collections:
 * which child sitemap a URL belongs to, how language pairs become hreflang
 * clusters, and how a list of entries is written out as XML. Kept apart so a
 * test can exercise it without loading the roster and every guide. */

export type Changefreq = 'monthly' | 'yearly';

export type SitemapEntry = {
  path: string;
  lastmod: string | null;
  changefreq: Changefreq;
  priority: number;
  figure?: string;
};

export type Alternate = { lang: string; href: string };

export type SitemapImage = { loc: string; title: string; caption: string };

/* ONE CHILD SITEMAP PER TEMPLATE.
 *
 * /sitemap.xml was one urlset of 415 URLs. Search Console reports indexing
 * per submitted sitemap, so with one file nobody could tell the city-service
 * pages nobody has indexed from the ones that are indexed and simply do not
 * rank. Split by the template that renders the page, the Page indexing report
 * gives that answer per template: the early warning for pages built at scale.
 *
 * Derived from the path rather than tagged where each entry is built, so a new
 * collection lands in the right child without anyone remembering to say so,
 * and a test can pin every rule. Order is the order of the index. */
export const SITEMAP_PARTS = [
  'core',
  'guides',
  'city-hubs',
  'city-services',
  'places',
  'communities',
  'languages',
] as const;
export type SitemapPart = (typeof SITEMAP_PARTS)[number];

export function partOf(path: string): SitemapPart {
  const seg = path.split('/').filter(Boolean);
  /* Pages written in Punjabi or Tagalog, wherever they sit. */
  if (seg[0] === 'punjabi' || seg[0] === 'tagalog') return 'languages';
  if (seg[0] === 'practitioners' && (seg.at(-1) === 'pa' || seg.at(-1) === 'tl') && seg.length >= 3) return 'languages';
  /* English pages for a language community: the Punjabi region pages and the
     Tagalog city pages. */
  if (seg[0] === 'punjabi-counselling' || seg[0] === 'tagalog-counselling') return 'communities';
  if (seg[0] === 'online-counselling' && seg.length === 3) return 'city-services';
  if (seg[0] === 'online-counselling' && seg.length === 2) return 'city-hubs';
  if (seg[0] === 'practitioners' && seg.length === 3) return 'places';
  if (['guides', 'resources', 'compare', 'for'].includes(seg[0] ?? '') && seg.length === 2) return 'guides';
  return 'core';
}

export const partPath = (part: SitemapPart) => `/sitemaps/${part}.xml`;

/* HREFLANG CLUSTERS.
 *
 * `pairs` is [englishPath, translationPath]. A cluster is an English page and
 * every translation of it; each member lists the whole cluster, itself
 * included, with English as x-default. Building clusters rather than writing
 * each pair separately means an English page with two translations states
 * both, where the old map kept whichever pair came last. A pair whose halves
 * are not both listed is dropped: a twin that is not in the sitemap is not one
 * a crawler can use.
 *
 * One translation may belong to one English page only, and one English page
 * may have one translation per language. A pair that breaks either rule is
 * returned in `conflicts` and left out, so the sitemap never states a cluster
 * the pages themselves cannot agree with. */
export function clusterAlternates(
  pairs: [string, string][],
  listed: Set<string>,
  origin: string,
  langOf: (path: string) => string,
): { alternates: Map<string, Alternate[]>; conflicts: string[] } {
  const clusters = new Map<string, Map<string, string>>();
  const owner = new Map<string, string>();
  const conflicts: string[] = [];
  for (const [en, other] of pairs) {
    if (!listed.has(en) || !listed.has(other)) continue;
    const lang = langOf(other);
    const prior = owner.get(other);
    if (prior !== undefined && prior !== en) {
      conflicts.push(`${other} is paired with both ${prior} and ${en}`);
      continue;
    }
    const cluster = clusters.get(en) ?? new Map<string, string>();
    const held = cluster.get(lang);
    if (held !== undefined && held !== other) {
      conflicts.push(`${en} has two ${lang} pages: ${held} and ${other}`);
      continue;
    }
    cluster.set(lang, other);
    clusters.set(en, cluster);
    owner.set(other, en);
  }
  const alternates = new Map<string, Alternate[]>();
  for (const [en, cluster] of clusters) {
    const set: Alternate[] = [
      { lang: 'en-CA', href: origin + en },
      ...[...cluster].sort(([a], [b]) => a.localeCompare(b)).map(([lang, p]) => ({ lang, href: origin + p })),
      { lang: 'x-default', href: origin + en },
    ];
    alternates.set(en, set);
    for (const p of cluster.values()) alternates.set(p, set);
  }
  return { alternates, conflicts };
}

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderUrlset(
  entries: SitemapEntry[],
  origin: string,
  alternates: Map<string, Alternate[]>,
  imageFor: (figure: string) => SitemapImage | undefined,
): string {
  const body = entries
    .map((e) => {
      const f = e.figure ? imageFor(e.figure) : undefined;
      const image = f
        ? `\n    <image:image>\n      <image:loc>${esc(f.loc)}</image:loc>\n      <image:title>${esc(f.title)}</image:title>\n      <image:caption>${esc(f.caption)}</image:caption>\n    </image:image>`
        : '';
      const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
      const xhtml = (alternates.get(e.path) ?? [])
        .map((a) => `\n    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${esc(a.href)}"/>`)
        .join('');
      return `  <url>\n    <loc>${esc(origin + e.path)}</loc>${lastmod}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>${xhtml}${image}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
}

/** The newest lastmod among some entries, or null when none carries one. */
export function newest(entries: SitemapEntry[]): string | null {
  return entries.map((e) => e.lastmod).filter((d): d is string => Boolean(d)).sort().at(-1) ?? null;
}

export function renderIndex(children: { loc: string; lastmod: string | null }[]): string {
  const rows = children
    .map((c) => `  <sitemap>\n    <loc>${esc(c.loc)}</loc>${c.lastmod ? `\n    <lastmod>${c.lastmod}</lastmod>` : ''}\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</sitemapindex>
`;
}

export const xmlResponse = (xml: string) =>
  new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
