import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { abs, orgRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { ogBase } from '@/lib/og-meta';

const TITLE = 'Our Counsellors | Westpeak Wellness';
const DESC =
  'The Registered Clinical Counsellors at Westpeak Wellness — credentials, areas of focus, and the languages each of them works in.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/practitioners` },
  openGraph: { ...ogBase('/practitioners'), title: TITLE, description: DESC, url: `${site.domain}/practitioners` },
};

/* The roster index.
 *
 * Deliberately short: it exists to route somebody to the right person, not to
 * summarise them twice. Each card carries the name, the credentials a stranger
 * can verify, the languages, and one line — everything else is on the profile.
 *
 * The founder is not listed. See the header of lib/practitioners.ts. */
export default function PractitionersPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${site.domain}/practitioners#page`,
    name: 'Our counsellors',
    description: DESC,
    url: `${site.domain}/practitioners`,
    about: orgRef,
    inLanguage: 'en-CA',
    hasPart: practitioners.map((p) => ({
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
      url: abs(`/practitioners/${p.slug}`),
      knowsLanguage: p.languages.map((l) => l.tag),
      worksFor: orgRef,
    })),
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Our counsellors</p>
          <h1>Who you would be working with.</h1>
          <p className="lede">
            Every counsellor here is registered, and every registration number below can be
            checked against a public register in about two minutes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Our counsellors', path: '/practitioners' }]} />

          <div className="prose" style={{ marginTop: 4, marginBottom: 8 }}>
            <p>
              Westpeak is a virtual practice, so the counsellor you work with is not decided by
              which office is nearest to you. That removes the usual constraint and leaves the one
              that actually matters: whether this particular person is a good fit for what you
              are bringing.
            </p>
            <p>
              Each profile below sets out what that counsellor works with, how they work, and the
              languages they practise in — including sessions that move between two languages
              within the hour. Registration numbers are shown in full so you can check them
              against a public register before booking anything, here or anywhere else.
            </p>
            <p>
              If you are not sure who to choose, the{' '}
              <Link href="/book">free 15-minute consultation</Link> is for exactly that, and it
              carries no obligation. Where somebody else would be a better fit — including outside
              this practice — you will be told so on the call.
            </p>
          </div>

          <div className="grid grid-2" style={{ marginTop: 24 }}>
            {practitioners.map((p) => (
              <article className="card" key={p.slug}>
                {p.photo && (
                  <Image
                    src={p.photo.src}
                    alt={p.photo.alt}
                    width={p.photo.width}
                    height={p.photo.height}
                    sizes="(max-width: 700px) 100vw, 420px"
                    style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 16 }}
                  />
                )}
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 2px' }}>
                  <Link href={`/practitioners/${p.slug}`}>{p.name}</Link>
                </h2>
                <p style={{ margin: '0 0 10px', color: 'var(--ink-soft)', fontSize: '.94rem' }}>
                  {p.role} · {p.postNominals}
                </p>
                <p style={{ marginBottom: 10 }}>{p.tagline}</p>
                <p style={{ margin: '0 0 10px', fontSize: '.92rem', color: 'var(--ink-soft)' }}>
                  Works in {p.languages.map((l) => l.name).join(' and ')}.
                </p>
                <p style={{ marginBottom: 0 }}>
                  <Link href={`/practitioners/${p.slug}`}>Read more about {p.name.split(' ')[0]} →</Link>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Not sure who to book with?"
        text="A free 15-minute consultation is the easiest way to find out. No card, no commitment."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
