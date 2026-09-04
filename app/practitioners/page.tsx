import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { abs, orgRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';

const TITLE = 'Our Counsellors | Westpeak Wellness';
const DESC =
  'The Registered Clinical Counsellors at Westpeak Wellness: credentials, areas of focus, and the languages each of them works in.';

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
    /* Real commit date for the module this page's copy lives in, from
       lib/page-dates.ts. Without it this page made no freshness claim at
       all, which a retrieval system reads as unknown rather than fresh. */
    datePublished: COLLECTION_DATES['practitioners'],
    dateModified: COLLECTION_DATES['practitioners'],
    author: orgRef,
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
              languages they practise in, including sessions that move between two languages
              within the hour. Registration numbers are shown in full so you can check them
              against a public register before booking anything, here or anywhere else.
            </p>
            <p>
              If you are not sure who to choose, the{' '}
              <Link href="/book">free 15-minute consultation</Link> is for exactly that, and it
              carries no obligation. Where somebody else would be a better fit, including outside
              this practice. You will be told so on the call.
            </p>
          </div>

          {/* ONE PER ROW, photo left, detail right — not a grid of cards.
              Two people in a two-column grid reads as a pair of thumbnails and
              gives neither of them room to say anything. Stacked, each row has
              space for the credentials and the focus areas, which is what
              somebody choosing between counsellors actually needs.

              THE WHOLE ROW IS THE LINK. The <a> on the name is stretched over
              the card with a positioned ::after, so clicking anywhere in the
              box navigates — while the accessible name, the tab stop and the
              right-click target all stay on the real anchor. A div with an
              onClick would have needed a keyboard handler, a role and a
              tabindex to be equivalent, and would still not be a link. */}
          <div className="practitioner-list">
            {practitioners.map((p) => (
              <article className="practitioner-row" key={p.slug}>
                {p.photos?.portrait && (
                  <Image
                    className="practitioner-row-photo"
                    src={p.photos.portrait.src}
                    alt={p.photos.portrait.alt}
                    width={p.photos.portrait.width}
                    height={p.photos.portrait.height}
                    sizes="(max-width: 700px) 40vw, 240px"
                  />
                )}
                <div className="practitioner-row-body">
                  <h2>
                    <Link className="practitioner-row-link" href={`/practitioners/${p.slug}`}>
                      {p.name}
                    </Link>
                  </h2>
                  <p className="practitioner-row-role">{p.role} · {p.postNominals}</p>
                  <p className="practitioner-row-tagline">{p.tagline}</p>
                  <ul className="practitioner-row-focus">
                    {p.focus.map((f) => <li key={f.label}>{f.label}</li>)}
                  </ul>
                  <p className="practitioner-row-langs">
                    {/* Languages and designations only — NO registration
                        numbers. Those are confined to /about and each
                        counsellor's own profile, and expansion-verify fails the
                        build if one appears anywhere else. It caught this card
                        on the first build. The number belongs where somebody is
                        deciding, not on a routing page. */}
                    Works in {p.languages.map((l) => l.name).join(' and ')}
                    {p.credentials.length
                      ? ` · ${p.credentials.map((c) => c.short).join(', ')}, verifiable on her profile`
                      : ''}
                  </p>
                  <span className="practitioner-row-more" aria-hidden="true">
                    Read more about {p.name.split(' ')[0]} &rarr;
                  </span>
                </div>
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
