import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { albertaPages, getRegionPage } from '@/lib/expansion';
import { ALBERTA_LIVE } from '@/lib/regions';
import { site } from '@/lib/site';
import RegionPageView from '@/components/RegionPageView';

/* Alberta regional pages. BUILT, NOT PUBLISHED.
 *
 * Regulation is clear — counselling therapy is not a regulated profession in
 * Alberta (verified 17 Aug 2026). Insurance is not: the practice's professional
 * liability policy does not extend outside British Columbia, confirmed by the
 * owner on 17 Aug 2026. These pages were live for a few hours that day and came
 * straight back down.
 *
 * A live page here is an advertisement, and an advertisement produces bookings
 * the practice cannot lawfully insure. Three locks in this file plus sitemap
 * exclusion — see ALBERTA_LAUNCH_CHECKLIST.md.
 */

export function generateStaticParams() {
  // LOCK 1 — routes are not built at all while gated.
  if (!ALBERTA_LIVE) return [];
  return albertaPages.map((p) => ({ path: p.path.split('/') }));
}

export function generateMetadata({ params }: { params: { path: string[] } }): Metadata {
  const page = getRegionPage('AB', params.path.join('/'));
  if (!page) return {};
  const url = `${site.domain}/alberta/${page.path}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: url },
    // LOCK 2 — noindex, nofollow while gated, even if a page somehow renders.
    robots: ALBERTA_LIVE ? undefined : { index: false, follow: false },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url },
  };
}

export default function Page({ params }: { params: { path: string[] } }) {
  // LOCK 3 — no render while gated.
  if (!ALBERTA_LIVE) notFound();
  const page = getRegionPage('AB', params.path.join('/'));
  if (!page) notFound();
  return <RegionPageView page={page} provinceSlug="alberta" />;
}
