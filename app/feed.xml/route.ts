import { site } from '@/lib/site';
import { guides } from '@/lib/guides';
import { resources } from '@/lib/resources';
import { comparisons } from '@/lib/comparisons';
import { audiences } from '@/lib/audiences';

export const dynamic = 'force-static';

/* RSS 2.0 for the guides.
 *
 * Not a growth lever on its own — it is a discovery surface. Aggregators,
 * readers and a number of AI ingestion pipelines look for a feed and will not
 * find one by guessing. It costs one route and stays correct automatically,
 * because it is built from the same guide data the pages render from.
 *
 * Sorted newest-first by `updated`, which is the field the sitemap and the
 * Article schema already use — so a reader, a crawler and a human all see the
 * same ordering.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

type Item = { slug: string; title: string; shortAnswer?: string; metaDescription?: string; updated?: string };

export function GET() {
  /* `guides` is already the combined export of all six guide files, importing
     any of them individually would double-count. */
  /* Guides only until 6 Sep 2026. The resources, comparisons and audience
     pages are dated, answer-shaped content of the same kind, and a feed that
     omits them tells a retrieval system the site publishes a third of what it
     does. Newest fifty across all four. */
  const pools: [Item[], string][] = [
    [guides as unknown as Item[], '/guides'],
    [resources as unknown as Item[], '/resources'],
    [comparisons as unknown as Item[], '/compare'],
    [audiences as unknown as Item[], '/for'],
  ];
  const items = pools
    .flatMap(([list, base]) => list.filter((g) => g?.slug && g?.title).map((g) => ({ ...g, url: `${site.domain}${base}/${g.slug}` })))
    .sort((a, b) => String(b.updated ?? '').localeCompare(String(a.updated ?? '')))
    .slice(0, 50);

  const now = new Date().toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}, Counselling guides and resources</title>
    <link>${site.domain}/guides</link>
    <description>Plain-language guides on counselling, therapy and mental-health coverage in British Columbia, from a Registered Clinical Counsellor.</description>
    <language>en-CA</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${site.domain}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map((g) => {
    const url = g.url;
    const desc = g.shortAnswer ?? g.metaDescription ?? '';
    const date = g.updated ? new Date(g.updated).toUTCString() : now;
    return `    <item>
      <title>${esc(g.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(desc)}</description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
