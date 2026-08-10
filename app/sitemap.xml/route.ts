import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { tools } from '@/lib/tools';
import { locations } from '@/lib/locations';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { audiences } from '@/lib/audiences';
import { resources } from '@/lib/resources';
import { approaches } from '@/lib/approaches';
import { getFigure } from '@/lib/figures';
import { openJobs } from '@/lib/careers';

export const dynamic = 'force-static';

/* Hand-built rather than using Next's sitemap convention, because
 * MetadataRoute.Sitemap in Next 14 silently discards image entries — the
 * `images` field only landed in Next 15. Every diagram on this site is original
 * artwork, and an image sitemap is the only way image search reliably
 * associates it with the page it illustrates. */

type Entry = {
  path: string;
  lastmod: Date;
  changefreq: 'monthly' | 'yearly';
  priority: number;
  figure?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const now = new Date();

  const core: Entry[] = [
    '', '/about', '/services', '/approaches', '/pricing', '/contact', '/faq',
    '/online-counselling', '/guides', '/compare', '/for', '/resources', '/glossary',
  ].map((p) => ({ path: p, lastmod: now, changefreq: 'monthly', priority: p === '' ? 1 : 0.8 }));

  const trust: Entry[] = ['/standards', '/editorial-policy', '/privacy', '/accessibility'].map(
    (p) => ({ path: p, lastmod: now, changefreq: 'yearly', priority: 0.4 })
  );

  const entries: Entry[] = [
    ...core,
    { path: '/book', lastmod: now, changefreq: 'monthly', priority: 0.9 },
    { path: '/tools', lastmod: now, changefreq: 'monthly', priority: 0.7 },
    { path: '/reviews', lastmod: now, changefreq: 'yearly', priority: 0.5 },
    { path: '/punjabi', lastmod: now, changefreq: 'monthly', priority: 0.7 },
    /* Careers. Only postings still inside their validThrough are listed: Google
       penalises stale JobPosting markup, and a sitemap that keeps advertising a
       closed role is exactly how a careers page turns into a liability. The hub
       stays listed either way, because it keeps its ranking between hires. */
    { path: '/careers', lastmod: now, changefreq: 'monthly', priority: 0.6 },
    ...openJobs().map((j) => ({
      path: `/careers/${j.slug}`,
      lastmod: new Date(j.datePosted),
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),
    ...tools.map((t) => ({
      path: `/tools/${t.slug}`, lastmod: now, changefreq: 'monthly' as const, priority: 0.7,
    })),
    ...trust,
    ...services.map((s) => ({
      path: `/services/${s.slug}`, lastmod: now, changefreq: 'monthly' as const,
      priority: 0.8, figure: s.figure,
    })),
    ...approaches.map((a) => ({
      path: `/approaches/${a.slug}`, lastmod: new Date(a.updated),
      changefreq: 'monthly' as const, priority: 0.7, figure: a.figure,
    })),
    ...guides.map((g) => ({
      path: `/guides/${g.slug}`, lastmod: new Date(g.updated),
      changefreq: 'monthly' as const, priority: 0.7, figure: g.figure,
    })),
    ...comparisons.map((c) => ({
      path: `/compare/${c.slug}`, lastmod: new Date(c.updated),
      changefreq: 'monthly' as const, priority: 0.7, figure: c.figure,
    })),
    ...audiences.map((a) => ({
      path: `/for/${a.slug}`, lastmod: new Date(a.updated),
      changefreq: 'monthly' as const, priority: 0.7, figure: a.figure,
    })),
    ...resources.map((r) => ({
      path: `/resources/${r.slug}`, lastmod: new Date(r.updated),
      changefreq: 'monthly' as const, priority: 0.7, figure: r.figure,
    })),
    ...locations.map((l) => ({
      path: `/online-counselling/${l.slug}`, lastmod: now,
      changefreq: 'monthly' as const, priority: 0.6, figure: l.figure,
    })),
  ];

  const body = entries
    .map((e) => {
      const f = e.figure ? getFigure(e.figure) : undefined;
      const image = f
        ? `\n    <image:image>\n      <image:loc>${esc(`${site.domain}/img/${f.file}`)}</image:loc>\n      <image:title>${esc(f.title)}</image:title>\n      <image:caption>${esc(f.alt)}</image:caption>\n    </image:image>`
        : '';
      return `  <url>
    <loc>${esc(site.domain + e.path)}</loc>
    <lastmod>${e.lastmod.toISOString()}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>${image}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
