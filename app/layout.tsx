import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: 'Online Counselling in BC | Westpeak Wellness',
    template: '%s | Westpeak Wellness',
  },
  description:
    'Online counselling across BC with a Registered Clinical Counsellor. EMDR, trauma, anxiety, depression, and couples therapy in English or Punjabi.',
  keywords: [
    'online counselling BC', 'virtual therapy BC', 'Registered Clinical Counsellor',
    'Punjabi counselling', 'EMDR therapy BC', 'couples counselling', 'South Asian therapist',
  ],
  openGraph: {
    type: 'website', locale: 'en_CA', url: site.domain, siteName: site.name,
    title: 'Online Counselling in BC | Westpeak Wellness',
    description: 'Virtual therapy across British Columbia in English or Punjabi. EMDR, trauma, anxiety, depression, and couples counselling.',
  },
  twitter: { card: 'summary_large_image', title: 'Online Counselling in BC | Westpeak Wellness',
    description: 'Virtual therapy across BC in English or Punjabi with a Registered Clinical Counsellor.' },
  alternates: { canonical: site.domain },
  robots: { index: true, follow: true },
};

const orgSchema = {
  '@context': 'https://schema.org', '@type': 'MedicalBusiness',
  name: site.name, url: site.domain, email: site.email,
  description: 'Online counselling across British Columbia in English and Punjabi.',
  areaServed: { '@type': 'State', name: 'British Columbia' },
  availableLanguage: ['English', 'Punjabi'],
  medicalSpecialty: 'Psychiatric',
  sameAs: [site.instagramUrl],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </body>
    </html>
  );
}
