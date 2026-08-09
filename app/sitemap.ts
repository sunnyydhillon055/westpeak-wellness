import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { audiences } from '@/lib/audiences';
import { resources } from '@/lib/resources';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${site.domain}${p}`;

  const core = ['', '/about', '/services', '/pricing', '/contact', '/faq', '/online-counselling', '/guides', '/compare', '/for', '/resources', '/glossary'];

  // Trust-and-transparency pages: indexable, but lower priority than the pages
  // someone is actually searching for.
  const trust = ['/standards', '/editorial-policy', '/privacy', '/accessibility'];

  return [
    ...core.map((p) => ({
      url: url(p), lastModified: now, changeFrequency: 'monthly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    { url: url('/book'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 },
    ...trust.map((p) => ({
      url: url(p), lastModified: now, changeFrequency: 'yearly' as const, priority: 0.4,
    })),
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`), lastModified: now,
      changeFrequency: 'monthly' as const, priority: 0.8,
    })),
    ...guides.map((g) => ({
      url: url(`/guides/${g.slug}`), lastModified: new Date(g.updated),
      changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...comparisons.map((c) => ({
      url: url(`/compare/${c.slug}`), lastModified: new Date(c.updated),
      changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...audiences.map((a) => ({
      url: url(`/for/${a.slug}`), lastModified: new Date(a.updated),
      changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...resources.map((r) => ({
      url: url(`/resources/${r.slug}`), lastModified: new Date(r.updated),
      changeFrequency: 'monthly' as const, priority: 0.7,
    })),
    ...locations.map((l) => ({
      url: url(`/online-counselling/${l.slug}`), lastModified: now,
      changeFrequency: 'monthly' as const, priority: 0.6,
    })),
  ];
}
