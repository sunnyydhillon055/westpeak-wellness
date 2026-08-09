import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/* The sitemap lists canonical-domain URLs. Google only trusts a sitemap
 * reference on the same host as the URLs inside it — so the reference is
 * emitted only once this build is actually being served from the canonical
 * domain. Until DNS moves, that domain still serves the previous site, and
 * pointing robots.txt at it would send a crawler somewhere else entirely.
 * After the domain moves, deployOrigin equals the canonical domain and the
 * Sitemap line reappears with no code change. */
export default function robots(): MetadataRoute.Robots {
  if (site.isPreview) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  const sameHost = site.deployOrigin === site.domain;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Generated social cards are images, not pages — keeping ~30 of them
        // out of the crawl leaves the budget for real content.
        disallow: ['/*/opengraph-image', '/opengraph-image'],
      },
    ],
    ...(sameHost ? { sitemap: `${site.domain}/sitemap.xml` } : {}),
  };
}
