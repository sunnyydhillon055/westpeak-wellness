import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { tools } from '@/lib/tools';
import { locations } from '@/lib/locations';
import { pairs } from '@/lib/city-services';
import { punjabiRegions } from '@/lib/punjabi-regions';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { audiences } from '@/lib/audiences';
import { resources } from '@/lib/resources';
import { approaches } from '@/lib/approaches';
import { getFigure } from '@/lib/figures';
import { openJobs } from '@/lib/careers';
import { lastmodFor, collectionLastmod } from '@/lib/page-dates';
import { albertaPages, ontarioPages } from '@/lib/expansion';
import { ALBERTA_LIVE, ONTARIO_LIVE } from '@/lib/regions';

export const dynamic = 'force-static';

/* Hand-built rather than using Next's sitemap convention, because
 * MetadataRoute.Sitemap in Next 14 silently discards image entries — the
 * `images` field only landed in Next 15. Every diagram on this site is original
 * artwork, and an image sitemap is the only way image search reliably
 * associates it with the page it illustrates. */

/* `lastmod` is nullable on purpose.
 *
 * It used to be `Date` and every page without its own `updated` field was given
 * `new Date()` — the build timestamp. That made 45 of 113 URLs claim to have
 * changed at every deployment, which is not merely useless: Google decides per
 * site whether lastmod can be trusted, and dates that move on an unrelated
 * deploy teach it to ignore the field entirely, taking the 66 URLs with real
 * dates down with them.
 *
 * Real dates now come from git via lib/page-dates.ts. Where there is genuinely
 * no date, the element is omitted. A sitemap entry without lastmod is valid and
 * honest; one with an invented lastmod is neither. */
type Entry = {
  path: string;
  lastmod: string | null;
  changefreq: 'monthly' | 'yearly';
  priority: number;
  figure?: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const core: Entry[] = [
    '', '/about', '/services', '/approaches', '/pricing', '/contact', '/faq',
    '/online-counselling', '/guides', '/compare', '/for', '/resources', '/glossary',
  ].map((p) => ({ path: p, lastmod: lastmodFor(p), changefreq: 'monthly', priority: p === '' ? 1 : 0.8 }));

  const trust: Entry[] = ['/standards', '/editorial-policy', '/privacy', '/accessibility'].map(
    (p) => ({ path: p, lastmod: lastmodFor(p), changefreq: 'yearly', priority: 0.4 })
  );

  const entries: Entry[] = [
    ...core,
    { path: '/book', lastmod: lastmodFor('/book'), changefreq: 'monthly', priority: 0.9 },
    { path: '/tools', lastmod: lastmodFor('/tools'), changefreq: 'monthly', priority: 0.7 },
    { path: '/reviews', lastmod: lastmodFor('/reviews'), changefreq: 'yearly', priority: 0.5 },
    { path: '/refer', lastmod: lastmodFor('/refer'), changefreq: 'yearly', priority: 0.5 },
    /* The GP one-pager. Listed separately from /refer because it answers a
       query of its own — whether a referral is needed to see a counsellor in
       BC — rather than being a subsection of the word-of-mouth page. */
    { path: '/refer/doctor', lastmod: lastmodFor('/refer/doctor'), changefreq: 'yearly', priority: 0.5 },
    { path: '/punjabi', lastmod: lastmodFor('/punjabi'), changefreq: 'monthly', priority: 0.7 },
    /* The answers index: one URL holding every direct answer on the site.
       High priority because it is the page an answer engine retrieves from. */
    /* Careers. Only postings still inside their validThrough are listed: Google
       penalises stale JobPosting markup, and a sitemap that keeps advertising a
       closed role is exactly how a careers page turns into a liability. The hub
       stays listed either way, because it keeps its ranking between hires. */
    { path: '/careers', lastmod: lastmodFor('/careers'), changefreq: 'monthly', priority: 0.6 },
    ...openJobs().map((j) => ({
      path: `/careers/${j.slug}`,
      lastmod: new Date(j.datePosted).toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),
    ...tools.map((t) => ({
      path: `/tools/${t.slug}`, lastmod: collectionLastmod('tools'), changefreq: 'monthly' as const, priority: 0.7,
    })),
    ...trust,
    /* ALBERTA — gated on INSURANCE, not on regulation.
       Regulation is clear; the liability policy does not extend outside BC
       (owner-confirmed 17 Aug 2026). A sitemap entry is advertising, and an
       advertisement produces bookings that cannot be insured. Empty until
       cover exists. See ALBERTA_LAUNCH_CHECKLIST.md. */
    ...(ALBERTA_LIVE
      ? [
          { path: '/alberta', lastmod: lastmodFor('/alberta'), changefreq: 'monthly' as const, priority: 0.8 },
          ...albertaPages.map((a) => ({
            path: `/alberta/${a.path}`,
            lastmod: new Date(a.updated).toISOString(),
            changefreq: 'monthly' as const,
            priority: 0.7,
          })),
        ]
      : []),

    /* ONTARIO — deliberately absent.
       Psychotherapy is a controlled act in Ontario, and CRPO's allowance for an
       out-of-province registrant to see the occasional Ontario client is
       conditional on NOT advertising in Ontario. A sitemap entry is advertising.
       This spread stays empty until CRPO registration exists; the pages are
       already noindex and unrouted, and this is the fourth lock rather than the
       only one. See ONTARIO_LAUNCH_CHECKLIST.md. */
    ...(ONTARIO_LIVE
      ? [
          { path: '/ontario', lastmod: lastmodFor('/ontario'), changefreq: 'monthly' as const, priority: 0.8 },
          ...ontarioPages.map((o) => ({
            path: `/ontario/${o.path}`,
            lastmod: new Date(o.updated).toISOString(),
            changefreq: 'monthly' as const,
            priority: 0.7,
          })),
        ]
      : []),

    ...services.map((s) => ({
      path: `/services/${s.slug}`, lastmod: collectionLastmod('services'), changefreq: 'monthly' as const,
      priority: 0.8, figure: s.figure,
    })),
    ...approaches.map((a) => ({
      path: `/approaches/${a.slug}`, lastmod: new Date(a.updated).toISOString(),
      changefreq: 'monthly' as const, priority: 0.7, figure: a.figure,
    })),
    ...guides.map((g) => ({
      path: `/guides/${g.slug}`, lastmod: new Date(g.updated).toISOString(),
      changefreq: 'monthly' as const, priority: 0.7, figure: g.figure,
    })),
    ...comparisons.map((c) => ({
      path: `/compare/${c.slug}`, lastmod: new Date(c.updated).toISOString(),
      changefreq: 'monthly' as const, priority: 0.7, figure: c.figure,
    })),
    ...audiences.map((a) => ({
      path: `/for/${a.slug}`, lastmod: new Date(a.updated).toISOString(),
      changefreq: 'monthly' as const, priority: 0.7, figure: a.figure,
    })),
    ...resources.map((r) => ({
      path: `/resources/${r.slug}`, lastmod: new Date(r.updated).toISOString(),
      changefreq: 'monthly' as const, priority: 0.7, figure: r.figure,
    })),
    ...locations.map((l) => ({
      path: `/online-counselling/${l.slug}`, lastmod: collectionLastmod('locations'),
      changefreq: 'monthly' as const, priority: 0.6, figure: l.figure,
    })),
    /* City x service. Priority 0.7 — ABOVE the city hubs they sit under,
     * because these match the query somebody actually types ("emdr therapy
     * kelowna") while the hub matches a vaguer one. A hub ranked above its own
     * leaves tells the crawler to prefer the less specific page. */
    ...pairs.map((p) => ({
      path: `/online-counselling/${p.city}/${p.service}`,
      lastmod: collectionLastmod('locations'),
      changefreq: 'monthly' as const, priority: 0.7,
    })),
    /* The Punjabi-by-region cluster. Priority above the city pages on purpose:
     * these target query space with no map pack, where the practice can rank
     * outright rather than compete for the two organic slots a no-office
     * practice can reach. See lib/targets.ts. */
    /* The cluster hub, added 2026-08-18 with the page itself. The region pages
       were listed here from the day they existed; there was no index for them
       to sit under, which is most of why they were the least-linked pages on
       the site. */
    {
      path: '/punjabi-counselling', lastmod: collectionLastmod('punjabiRegions'),
      changefreq: 'monthly' as const, priority: 0.8,
    },
    ...punjabiRegions.map((r) => ({
      path: `/punjabi-counselling/${r.slug}`, lastmod: collectionLastmod('punjabiRegions'),
      changefreq: 'monthly' as const, priority: 0.8,
    })),
  ];

  const body = entries
    .map((e) => {
      const f = e.figure ? getFigure(e.figure) : undefined;
      const image = f
        ? `\n    <image:image>\n      <image:loc>${esc(`${site.domain}/img/${f.file}`)}</image:loc>\n      <image:title>${esc(f.title)}</image:title>\n      <image:caption>${esc(f.alt)}</image:caption>\n    </image:image>`
        : '';
      const lastmod = e.lastmod ? `
    <lastmod>${e.lastmod}</lastmod>` : '';
      return `  <url>
    <loc>${esc(site.domain + e.path)}</loc>${lastmod}
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
