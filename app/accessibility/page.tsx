import type { Metadata } from 'next';
import { policies } from '@/lib/policies';
import { site } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';

const doc = policies['accessibility'];

export const metadata: Metadata = {
  title: { absolute: doc.metaTitle },
  description: doc.metaDescription,
  alternates: { canonical: `${site.domain}/accessibility` },
  openGraph: {
    type: 'article', title: doc.metaTitle, description: doc.metaDescription,
    url: `${site.domain}/accessibility`, modifiedTime: doc.updated,
  },
};

export default function Page() {
  return <PolicyPage doc={doc} />;
}
