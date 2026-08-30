import type { Metadata } from 'next';
import { policies } from '@/lib/policies';
import { site } from '@/lib/site';
import PolicyPage from '@/components/PolicyPage';
import { ogBase } from '@/lib/og-meta';

const doc = policies['standards'];

export const metadata: Metadata = {
  title: { absolute: doc.metaTitle },
  description: doc.metaDescription,
  alternates: { canonical: `${site.domain}/standards` },
  openGraph: { ...ogBase(`/standards`),
    type: 'article', title: doc.metaTitle, description: doc.metaDescription, modifiedTime: doc.updated,
  },
};

export default function Page() {
  return <PolicyPage doc={doc} />;
}
