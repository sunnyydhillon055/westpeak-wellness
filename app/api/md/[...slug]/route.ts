import { createHash } from 'node:crypto';
import { htmlToMarkdown, metaOf } from '@/lib/html-to-markdown';
import { site } from '@/lib/site';
import { normalise } from '@/lib/md-path';

/* ============================================================================
   EVERY PAGE, AS MARKDOWN, AT THE SAME URL WITH .md ON THE END
   ----------------------------------------------------------------------------
   /guides/stress-leave-bc.md is this route, via a rewrite in next.config.mjs.
   It renders the page it shadows and returns the content of <main> as
   Markdown: no CSS, no navigation, no React payload, no JSON-LD. About 22 KB
   where the HTML is 230 KB.

   WHY IT DERIVES RATHER THAN DUPLICATES
   Nothing here is written twice. The Markdown is produced from the page the
   visitor sees, so it cannot fall out of date, and a page edited anywhere in
   lib/ appears in its Markdown twin on the next request. A hand-maintained
   second copy of 295 pages would be wrong within a week.

   WHY IT FETCHES ITS OWN PAGE
   The pages are prerendered at build time and the build output is not
   addressable from a route handler at runtime, so the honest way to obtain the
   rendered page is to request it. That request is itself cached for a day, so
   a crawler costs one render per page per day. It also means the ten routes
   that render on demand — /book, /contact, /pricing among them — get a
   Markdown twin too, which a build-time generator could not have given them.

   WHY THE ROUTE IS NOT AN ISR ROUTE — 24 Sep 2026, second pass.
   It was `export const revalidate = 86400`, and Next then owns the response
   headers: the `cache-control` set below was replaced in production by a bare
   `Cache-Control: public`, with no max-age at all. Measured, not assumed. A
   crawler re-fetching 295 files with no freshness information and no
   validator is the opposite of what this route is for, so the route renders
   per request and the caching is stated here, while the upstream page fetch
   keeps the day-long data cache that made it cheap.

   CONDITIONAL REQUESTS
   Every response carries an ETag and a Last-Modified, and a request that
   comes back with either gets a 304 and no body. A crawler revisiting the
   whole site then spends a few hundred bytes instead of three megabytes, and
   the ones that budget by bytes come back more often.

   The path is sanitised and then only ever used as a path on this site's own
   origin, so this cannot be pointed at anything else. Pages that are not for
   the public are refused by name rather than by hoping the crawler stays out.
   ========================================================================= */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const plain = (body: string, status: number) =>
  new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

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
  if (!path) return plain('Not found\n', 404);

  /* The origin actually serving this request, so a preview deployment renders
     its own pages rather than production's. */
  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}${path}`, {
    headers: { 'user-agent': 'westpeak-markdown-twin' },
    next: { revalidate: 86400 },
  });

  if (!res.ok) return plain(`No page at ${path}\n`, res.status === 404 ? 404 : 502);

  const html = await res.text();

  /* A page that asks not to be indexed does not get a second address that is
     easier to index. */
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) {
    return plain(`No page at ${path}\n`, 404);
  }

  const meta = metaOf(html);
  const body = htmlToMarkdown(html, site.domain);
  const url = meta.canonical || site.domain + path;

  /* The same page in another language, where one exists. A model reading the
     Punjabi twin of a guide should know the English one is its translation
     and not a different document; a model reading the English one should know
     the practice publishes it in Punjabi at all. */
  const translations = meta.alternates.filter((a) => a.lang !== 'x-default' && a.href !== url);

  /* Front matter, so a retrieval system that takes only the first lines still
     comes away with what the page is, where it lives, when it last changed,
     and what language it is in — and with the practice's own statement of
     what it is, because a page fragment quoted without the practice attached
     is how a counselling site gets confused with another one. */
  const front = [
    '---',
    `title: ${JSON.stringify(meta.title || site.name)}`,
    meta.description ? `description: ${JSON.stringify(meta.description)}` : '',
    `url: ${url}`,
    `lang: ${meta.lang}`,
    meta.modified ? `date_modified: ${meta.modified}` : '',
    ...(translations.length
      ? ['translations:', ...translations.map((a) => `  - { lang: ${a.lang}, url: ${a.href} }`)]
      : []),
    `publisher: ${JSON.stringify(site.name)}`,
    'publisher_type: "Registered Clinical Counsellor practice, British Columbia, Canada"',
    'delivery: "secure video only; no in-person office"',
    'not: "not a crisis service; not a medical practice; not covered by MSP"',
    `contact: ${site.email}`,
    `source_html: ${url}`,
    `index_of_site: ${site.domain}/llms.txt`,
    'license: "Content © Westpeak Wellness. Quote with attribution and a link."',
    '---',
  ].filter(Boolean).join('\n');

  /* The page's own <h1> is already in the body. A second heading taken from
     the <title> would open every twin with the same thing said twice in two
     different wordings, which is how a retrieval system ends up quoting a
     heading the page does not have. The title is in the front matter either
     way; it is only added as a heading when the page has none. */
  const heading = /^# /m.test(body) ? '' : `# ${meta.title || site.name}\n\n`;
  const out = `${front}\n\n${heading}${body}`;

  /* A strong validator: the bytes are what they are, and a weak one would be
     useless for the conditional requests below. */
  const etag = `"${createHash('sha1').update(out).digest('base64url')}"`;
  const lastModified = meta.modified && !Number.isNaN(Date.parse(meta.modified))
    ? new Date(meta.modified).toUTCString()
    : null;

  const headers: Record<string, string> = {
    'content-type': 'text/markdown; charset=utf-8',
    'cache-control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
    'x-robots-tag': 'index, follow, max-snippet:-1, max-image-preview:large',
    etag,
    /* No `Vary: Accept`. The twin is a separate URL, not a representation
       negotiated at this one, and announcing a variance that does not exist
       costs every CDN in front of it a cache entry per Accept header. */
    link: `<${url}>; rel="canonical", <${site.domain}/llms.txt>; rel="alternate"; type="text/plain"`,
    'content-language': meta.lang,
    ...(lastModified ? { 'last-modified': lastModified } : {}),
  };

  /* 304 where the client already holds this. ETag first: it is exact, where
     a date is only as good as the page's own dateModified. */
  const inm = request.headers.get('if-none-match');
  const ims = request.headers.get('if-modified-since');
  const fresh = (inm && inm.split(',').some((t) => t.trim() === etag))
    || (!inm && ims && lastModified && Date.parse(ims) >= Date.parse(lastModified));

  if (fresh) return new Response(null, { status: 304, headers });

  return new Response(out, { headers });
}
