import { partXml } from '@/lib/sitemap';
import { SITEMAP_PARTS, xmlResponse, type SitemapPart } from '@/lib/sitemap-shape';

/* One child of /sitemap.xml per template, 3 Oct 2026. See that route. Built at
 * compile time; a name that is not a part is a 404, not an empty urlset. */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return SITEMAP_PARTS.map((part) => ({ part: `${part}.xml` }));
}

export function GET(_req: Request, { params }: { params: { part: string } }) {
  const part = params.part.replace(/\.xml$/, '') as SitemapPart;
  if (!SITEMAP_PARTS.includes(part)) return new Response('Not found\n', { status: 404 });
  return xmlResponse(partXml(part));
}
