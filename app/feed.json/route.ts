import { site } from '@/lib/site';
import { guides } from '@/lib/guides';
import { resources } from '@/lib/resources';
import { comparisons } from '@/lib/comparisons';
import { audiences } from '@/lib/audiences';
import { tagalogGuides } from '@/lib/tagalog-guides';
import { punjabiGuides } from '@/lib/punjabi-guides';
import { COLLECTION_DATES } from '@/lib/page-dates';

export const dynamic = 'force-static';

/* JSON Feed 1.1 — the same fifty items as /feed.xml, in the format that does
 * not need an XML parser.
 *
 * WHY BOTH
 * RSS is what readers and most aggregators expect and it stays. JSON Feed is
 * what an ingestion pipeline written this decade expects, and the difference
 * matters here for one specific reason: every item carries the URL of the
 * page's Markdown twin. A client that finds this feed can then retrieve the
 * whole corpus as Markdown without rendering a single page or guessing at a
 * convention. That is the entire chain — feed to twin to content — in two
 * requests.
 *
 * Built from the same four pools /feed.xml uses, so the two cannot list
 * different things. Sorted newest-first by `updated`, the field the sitemap
 * and the Article schema already use.
 */

type Item = { slug: string; title: string; shortAnswer?: string; metaDescription?: string; updated?: string };

export function GET() {
  const pools: [Item[], string][] = [
    [guides as unknown as Item[], '/guides'],
    [resources as unknown as Item[], '/resources'],
    [comparisons as unknown as Item[], '/compare'],
    [audiences as unknown as Item[], '/for'],
    [(tagalogGuides as unknown as Item[]).map((g) => ({ ...g, updated: g.updated ?? COLLECTION_DATES['tagalog'] })), '/tagalog/gabay'],
    [(punjabiGuides as unknown as Item[]).map((g) => ({ ...g, updated: g.updated ?? COLLECTION_DATES['punjabiGuides'] })), '/punjabi/guides'],
  ];

  const items = pools
    .flatMap(([list, base]) =>
      list.filter((g) => g?.slug && g?.title).map((g) => ({ ...g, path: `${base}/${g.slug}`, lang: base.startsWith('/tagalog') ? 'tl' : base.startsWith('/punjabi') ? 'pa' : 'en-CA' })))
    .sort((a, b) => String(b.updated ?? '').localeCompare(String(a.updated ?? '')))
    .slice(0, 50);

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${site.name}, counselling guides and resources`,
    home_page_url: `${site.domain}/guides`,
    feed_url: `${site.domain}/feed.json`,
    description:
      'Plain-language guides on counselling, therapy and mental-health coverage in British Columbia, from Registered Clinical Counsellors. Every item links a Markdown copy of the page.',
    language: 'en-CA',
    authors: [{ name: site.name, url: site.domain }],
    /* Not part of the JSON Feed spec, and named so it cannot be mistaken for
       it. A client that ignores extensions loses nothing; one that reads it
       finds the rest of the machine-readable site without crawling for it. */
    _westpeak: {
      markdown_convention: 'Append .md to any page URL on this site.',
      llms_txt: `${site.domain}/llms.txt`,
      ai_json: `${site.domain}/ai.json`,
      sitemap_txt: `${site.domain}/sitemap.txt`,
      not: 'Not a crisis service. In Canada: 9-8-8, or 9-1-1 in immediate danger.',
    },
    items: items.map((g) => ({
      id: `${site.domain}${g.path}`,
      url: `${site.domain}${g.path}`,
      title: g.title,
      summary: g.shortAnswer ?? g.metaDescription ?? '',
      content_text: g.shortAnswer ?? g.metaDescription ?? '',
      ...(g.updated ? { date_modified: new Date(`${g.updated}T00:00:00Z`).toISOString() } : {}),
      language: g.lang,
      /* The same page as Markdown. `attachments` is the spec's field for
         another representation of the item. */
      attachments: [{
        url: `${site.domain}${g.path}.md`,
        mime_type: 'text/markdown',
        title: 'This page as Markdown',
      }],
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'content-type': 'application/feed+json; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
