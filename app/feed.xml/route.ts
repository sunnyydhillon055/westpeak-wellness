import { site } from '@/lib/site';
import { guides } from '@/lib/guides';

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
  /* `guides` is already the combined export of all six guide files — importing
     any of them individually would double-count. */
  const items = (guides as unknown as Item[])
    .filter((g) => g?.slug && g?.title)
    .sort((a, b) => String(b.updated ?? '').localeCompare(String(a.updated ?? '')))
    .slice(0, 50);

  const now = new Date().toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Counselling guides</title>
    <link>${site.domain}/guides</link>
    <description>Plain-language guides on counselling, therapy and mental-health coverage in British Columbia, from a Registered Clinical Counsellor.</description>
    <language>en-CA</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${site.domain}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map((g) => {
    const url = `${site.domain}/guides/${g.slug}`;
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
