import { indexXml } from '@/lib/sitemap';
import { xmlResponse } from '@/lib/sitemap-shape';

export const dynamic = 'force-static';

/* A SITEMAP INDEX — 3 Oct 2026.
 *
 * This was one urlset of 415 URLs. It is now an index of one child per
 * template (lib/sitemap-shape.ts, SITEMAP_PARTS), served at /sitemaps/<part>.xml
 * from the same list, so Search Console's Page indexing report can be read per
 * template: city-service pages, place pages, hubs and language pages each get
 * their own indexed-versus-submitted count. The URL is unchanged, so robots.txt
 * and the Search Console submission need no edit; Google reads the index and
 * fetches the children itself.
 *
 * The list, the dates, the hreflang clusters and the image rows are all built
 * in lib/sitemap.ts. Hand-built rather than Next's sitemap convention because
 * MetadataRoute.Sitemap in Next 14 discards image entries. */
export function GET() {
  return xmlResponse(indexXml());
}
