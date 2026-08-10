import type { Metadata } from 'next';
import './globals.css';
import './premium.css';
import { fontVars, body as bodyFont } from './fonts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBook from '@/components/StickyBook';
import Analytics from '@/components/Analytics';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_ID } from '@/lib/analytics';
import { site } from '@/lib/site';
import { services } from '@/lib/services';

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
  applicationName: site.name,
  publisher: site.name,
  category: 'Health',
  /* telephone detection is deliberately left ON: the crisis numbers are the
   * most important tappable things on this site from a phone. */
  formatDetection: { address: false, email: false },
  openGraph: {
    type: 'website', locale: 'en_CA', url: site.domain, siteName: site.name,
    title: 'Online Counselling in BC | Westpeak Wellness',
    description: 'Virtual therapy across British Columbia in English or Punjabi. EMDR, trauma, anxiety, depression, and couples counselling.',
  },
  twitter: { card: 'summary_large_image', title: 'Online Counselling in BC | Westpeak Wellness',
    description: 'Virtual therapy across BC in English or Punjabi with a Registered Clinical Counsellor.' },
  /* Search Console / Bing ownership. Emitted only when the token is set, so
   * nothing ships an empty verification tag. */
  verification: {
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
  alternates: { canonical: site.domain },
  robots: site.isPreview
    ? { index: false, follow: false }
    : {
        index: true, follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      },
};

/* Site-wide structured data.
 *
 * The practice is described as an organisation rather than a person, because the
 * counsellor's personal name is confined to /about by design. Credentials,
 * languages, service area and the services offered all still resolve, which is
 * what a search engine actually needs to place this entity. */
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'ProfessionalService'],
  '@id': `${site.domain}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.domain,
  email: site.email,
  logo: { '@type': 'ImageObject', url: `${site.domain}/img/logo.svg`, width: 512, height: 512 },
  image: `${site.domain}/opengraph-image`,
  description:
    'Virtual counselling practice serving all of British Columbia, offering individual, couples, trauma and EMDR therapy in English and Punjabi with a Registered Clinical Counsellor.',
  slogan: site.tagline,
  areaServed: { '@type': 'State', name: 'British Columbia', containedInPlace: { '@type': 'Country', name: 'Canada' } },
  availableLanguage: [
    { '@type': 'Language', name: 'English', alternateName: 'en' },
    { '@type': 'Language', name: 'Punjabi', alternateName: 'pa' },
  ],
  medicalSpecialty: 'Psychiatric',
  isAcceptingNewPatients: true,
  currenciesAccepted: 'CAD',
  paymentAccepted: 'E-transfer, Credit Card',
  /* Must stay in step with site.availability and with Cliniko. This is the
     copy Google reads, so a stale entry here advertises a slot that cannot be
     booked — the worst kind of wrong, because the visitor only finds out after
     arriving at the calendar. Updated 2026-08-10: weekends came off, Wed–Fri
     evenings went on. */
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday'], opens: '10:00', closes: '15:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday', 'Friday'], opens: '18:00', closes: '19:00' },
  ],
  knowsLanguage: ['en-CA', 'pa'],
  knowsAbout: [
    'Eye Movement Desensitization and Reprocessing', 'Cognitive Behavioural Therapy',
    'Gottman Method Couples Therapy', 'Trauma-informed care', 'Anxiety disorders',
    'Depression', 'Intergenerational trauma', 'South Asian mental health',
    'Burnout', 'Online psychotherapy',
  ],
  memberOf: {
    '@type': 'Organization',
    name: 'BC Association of Clinical Counsellors',
    url: 'https://bcacc.ca/',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Professional designation',
    name: 'Registered Clinical Counsellor (RCC)',
    recognizedBy: { '@type': 'Organization', name: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
  },
  availableService: services.map((s) => ({
    '@type': 'MedicalTherapy',
    name: s.name,
    url: `${site.domain}/services/${s.slug}`,
    description: s.short,
  })),
  potentialAction: {
    '@type': 'ReserveAction',
    name: 'Book a free 15-minute consultation',
    target: { '@type': 'EntryPoint', urlTemplate: `${site.domain}${site.bookingPath}` },
  },
  sameAs: [site.instagramUrl],
};

const siteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.domain}/#website`,
  name: site.name,
  url: site.domain,
  inLanguage: 'en-CA',
  publisher: { '@id': `${site.domain}/#organization` },
  /* Added only once /search existed. It was deliberately omitted before that:
   * a SearchAction must point at a real endpoint, and markup describing a
   * capability the site does not have is how structured data gets distrusted. */
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${site.domain}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={fontVars}>
      <body className={bodyFont.className}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-reveal')}catch(e){}",
          }}
        />
        <a className="skip-link" href="#main">Skip to main content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <StickyBook />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, siteSchema]) }}
        />
        {/* GA4 only when an ID is configured, so local runs and preview
          * deployments send nothing. @next/third-parties loads it
          * afterInteractive, off the critical path. */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
