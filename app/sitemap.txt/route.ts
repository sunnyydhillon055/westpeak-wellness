import { site } from '@/lib/site';
import { sitemapPageUrls } from '@/lib/sitemap';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ============================================================================
   THE WHOLE SITE AS A LIST OF URLS, ONE PER LINE
   ----------------------------------------------------------------------------
   A plain-text sitemap. Google, Bing and Yandex have accepted this format for
   as long as they have accepted XML, and it is the form a script can consume
   without a parser: `curl .../sitemap.txt | while read url` is the whole
   integration.

   IT LISTS THE MARKDOWN TWINS TOO
   That is the point of it existing alongside sitemap.xml. The XML sitemap is
   for search engines and lists pages; this one lists the 295 pages AND the
   295 Markdown addresses, so a retrieval system can enumerate the entire
   machine-readable corpus in one request and fetch it without rendering
   anything. The twins are listed second, under a comment saying what they
   are, so a search engine reading this file top-down finds the canonical
   pages first.

   WHY IT READS THE SAME LIST AS THE XML
   Two independently built lists of the same thing will one day disagree,
   which this site has already had happen with sitemaps, twice. This used to
   fetch /sitemap.xml and reformat it; since that became an index of
   per-template children (3 Oct 2026) it reads lib/sitemap.ts, the list every
   child is built from, so it is still the same list by construction and
   costs no internal request.
   ========================================================================= */

export async function GET() {
  const urls = sitemapPageUrls();

  /* The home page's twin is /index.md: it has no slug of its own. */
  const twin = (u: string) => (u === site.domain || u === `${site.domain}/` ? `${site.domain}/index.md` : `${u}.md`);

  const body = [
    `# ${site.name} — every page on this site, one URL per line.`,
    '# Plain-text sitemap. The XML index, with dates and languages, is at',
    `# ${site.domain}/sitemap.xml`,
    '',
    ...urls,
    '',
    '# The same pages as Markdown. Same content, none of the page furniture,',
    '# about a twentieth of the bytes. Generated from the page each one',
    '# shadows, so the two cannot disagree.',
    '',
    ...urls.map(twin),
    '',
    `# ${site.domain}/llms.txt   the practice in one page`,
    `# ${site.domain}/ai.json    the practice as structured JSON`,
    `# ${site.domain}/feed.json  new and updated guides, with Markdown links`,
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
      'x-robots-tag': 'index, follow',
    },
  });
}
