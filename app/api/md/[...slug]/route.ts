import { htmlToMarkdown, metaOf } from '@/lib/html-to-markdown';
import { site } from '@/lib/site';
import { normalise } from '@/lib/md-path';

/* ============================================================================
   EVERY PAGE, AS MARKDOWN, AT THE SAME URL WITH .md ON THE END
   ----------------------------------------------------------------------------
   /guides/stress-leave-bc.md is this route, via a rewrite in next.config.mjs.
   It renders the page it shadows and returns the content of <main> as
   Markdown: no CSS, no navigation, no React payload, no JSON-LD. About 12 KB
   where the HTML is 230 KB.

   WHY IT DERIVES RATHER THAN DUPLICATES
   Nothing here is written twice. The Markdown is produced from the page the
   visitor sees, so it cannot fall out of date, and a page edited anywhere in
   lib/ appears in its Markdown twin on the next request. A hand-maintained
   second copy of 295 pages would be wrong within a week.

   WHY IT FETCHES ITS OWN PAGE
   The pages are prerendered at build time and the build output is not
   addressable from a route handler at runtime, so the honest way to obtain the
   rendered page is to request it. That is one internal request per uncached
   .md, and the response is cached for a day at the edge, so a crawler costs
   one render per page per day. It also means the ten routes that render on
   demand — /book, /contact, /pricing among them — get a Markdown twin too,
   which a build-time generator could not have given them.

   The path is sanitised and then only ever used as a path on this site's own
   origin, so this cannot be pointed at anything else. Pages that are not for
   the public are refused by name rather than by hoping the crawler stays out.
   ========================================================================= */

export const runtime = 'nodejs';
export const revalidate = 86400;

export async function GET(
  request: Request,
  { params }: { params: { slug?: string[] } },
) {
  /* The rewrite hands the page's own path through as the slug: /index for the
     homepage, which has no slug of its own. `?path=` is accepted as well, so
     the route can be exercised directly by scripts/ai-crawl-audit.mjs. */
  const fromSlug = (params.slug ?? []).join('/');
  const raw = fromSlug
    ? (fromSlug === 'index' ? '/' : `/${fromSlug}`)
    : (new URL(request.url).searchParams.get('path') ?? '');
  const path = normalise(raw);
  if (!path) return new Response('Not found\n', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });

  /* The origin actually serving this request, so a preview deployment renders
     its own pages rather than production's. */
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}${path}`, {
    headers: { 'user-agent': 'westpeak-markdown-twin' },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return new Response(`No page at ${path}\n`, {
      status: res.status === 404 ? 404 : 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const html = await res.text();

  /* A page that asks not to be indexed does not get a second address that is
     easier to index. */
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    return new Response(`No page at ${path}\n`, { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  const meta = metaOf(html);
  const body = htmlToMarkdown(html, site.domain);

  /* Front matter, so a retrieval system that takes only the first lines still
     comes away with what the page is, where it lives, and when it last
     changed — and with the practice's own statement of what it is, because a
     page fragment quoted without the practice attached is how a counselling
     site gets confused with another one. */
  const front = [
    '---',
    `title: ${JSON.stringify(meta.title || site.name)}`,
    meta.description ? `description: ${JSON.stringify(meta.description)}` : '',
    `url: ${meta.canonical || site.domain + path}`,
    meta.modified ? `date_modified: ${meta.modified}` : '',
    `publisher: ${JSON.stringify(site.name)}`,
    'publisher_type: "Registered Clinical Counsellor practice, British Columbia, Canada"',
    'delivery: "secure video only; no in-person office"',
    `contact: ${site.email}`,
    `source_html: ${meta.canonical || site.domain + path}`,
    'license: "Content © Westpeak Wellness. Quote with attribution and a link."',
    '---',
  ].filter(Boolean).join('\n');

  /* The page's own <h1> is already in the body. A second heading taken from
     the <title> would open every twin with the same thing said twice in two
     different wordings, which is how a retrieval system ends up quoting a
     heading the page does not have. The title is in the front matter either
     way; it is only added as a heading when the page has none. */
  const heading = /^# /m.test(body) ? '' : `# ${meta.title || site.name}\n\n`;

  return new Response(`${front}\n\n${heading}${body}`, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'x-robots-tag': 'index, follow, max-snippet:-1, max-image-preview:large',
      link: `<${meta.canonical || site.domain + path}>; rel="canonical"`,
    },
  });
}
