import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ['', '/about', '/services', '/pricing', '/contact', '/faq', '/online-counselling'];
  return [
    ...staticPages.map((p) => ({ url: `${site.domain}${p}`, lastModified: now,
      changeFrequency: 'monthly' as const, priority: p === '' ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${site.domain}/services/${s.slug}`, lastModified: now,
      changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...locations.map((l) => ({ url: `${site.domain}/online-counselling/${l.slug}`, lastModified: now,
      changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
