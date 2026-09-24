import { site } from '@/lib/site';

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

   WHY IT DERIVES FROM THE XML RATHER THAN REBUILDING THE LIST
   The URL list in app/sitemap.xml/route.ts is 170 lines of imports and
   composition, and two independently built lists of the same thing is two
   lists that will one day disagree — which is exactly the failure this site
   has already had with sitemaps, twice. This reads the XML sitemap and
   reformats it, so it is the same list by construction. One extra internal
   request, cached for a day.
   ========================================================================= */

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}/sitemap.xml`, { next: { revalidate: 86400 } });

  if (!res.ok) {
    return new Response('The sitemap could not be read.\n', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].trim())
    /* <loc> also appears inside <image:image>. Only the page URLs belong in a
       sitemap of pages, and an image loc sits inside image:loc, so this is
       already right — but the filter is explicit rather than implied. */
    .filter((u) => u.startsWith(site.domain) && !/\/img\//.test(u));

  /* The home page's twin is /index.md: it has no slug of its own. */
  const twin = (u: string) => (u === site.domain || u === `${site.domain}/` ? `${site.domain}/index.md` : `${u}.md`);

  const body = [
    `# ${site.name} — every page on this site, one URL per line.`,
    '# Plain-text sitemap. The XML one, with dates and languages, is at',
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
