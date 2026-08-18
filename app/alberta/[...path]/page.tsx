import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { albertaPages, getRegionPage } from '@/lib/expansion';
import { site } from '@/lib/site';
import RegionPageView from '@/components/RegionPageView';

/* Alberta regional pages. Published: counselling therapy is not a regulated
 * profession in Alberta (verified 17 Aug 2026 — see lib/regions.ts). */

export function generateStaticParams() {
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
    openGraph: { title: page.metaTitle, description: page.metaDescription, url },
  };
}

export default function Page({ params }: { params: { path: string[] } }) {
  const page = getRegionPage('AB', params.path.join('/'));
  if (!page) notFound();
  return <RegionPageView page={page} provinceSlug="alberta" />;
}
