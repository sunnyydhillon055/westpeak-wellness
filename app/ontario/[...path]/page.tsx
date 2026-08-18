import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ontarioPages, getRegionPage } from '@/lib/expansion';
import { ONTARIO_LIVE } from '@/lib/regions';
import { site } from '@/lib/site';
import RegionPageView from '@/components/RegionPageView';

/* Ontario regional pages. BUILT, NOT PUBLISHED.
 *
 * Psychotherapy is a controlled act in Ontario. CRPO permits an out-of-province
 * registrant to see the occasional Ontario client ONLY while not advertising in
 * Ontario. These pages are advertising. Publishing them removes the exemption.
 *
 * Three locks in this file, plus sitemap exclusion elsewhere. Do not remove any
 * of them without CRPO registration in hand — see ONTARIO_LAUNCH_CHECKLIST.md.
 */

export function generateStaticParams() {
  // LOCK 1 — the routes are not built at all while gated.
  if (!ONTARIO_LIVE) return [];
  return ontarioPages.map((p) => ({ path: p.path.split('/') }));
}

export function generateMetadata({ params }: { params: { path: string[] } }): Metadata {
  const page = getRegionPage('ON', params.path.join('/'));
  if (!page) return {};
  const url = `${site.domain}/ontario/${page.path}`;
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: { canonical: url },
    // LOCK 2 — noindex, nofollow while gated, even if a page somehow renders.
    robots: ONTARIO_LIVE ? undefined : { index: false, follow: false },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url },
  };
}

export default function Page({ params }: { params: { path: string[] } }) {
  // LOCK 3 — no render while gated.
  if (!ONTARIO_LIVE) notFound();
  const page = getRegionPage('ON', params.path.join('/'));
  if (!page) notFound();
  return <RegionPageView page={page} provinceSlug="ontario" />;
}
