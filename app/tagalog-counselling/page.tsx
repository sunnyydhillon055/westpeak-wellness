import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { TAGALOG_CITIES, TAGALOG_SPEAKERS } from '@/lib/tagalog';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { ogBase } from '@/lib/og-meta';

const TITLE = 'Tagalog-Speaking Counselling in BC | Westpeak Wellness';
const DESC =
  'Online counselling in Tagalog or English across British Columbia with a Registered Clinical Counsellor. Free 15-minute consultation, no referral needed.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: {
    canonical: `${site.domain}/tagalog-counselling`,
    /* Reciprocal with /tagalog, the page written in the language. hreflang that
       only points one way is ignored, so both ends declare the pair. */
    ...(TAGALOG_READY
      ? {
          languages: {
            'en-CA': `${site.domain}/tagalog-counselling`,
            tl: `${site.domain}/tagalog`,
          },
        }
      : {}),
  },
  openGraph: { ...ogBase('/tagalog-counselling'), title: TITLE, description: DESC, url: `${site.domain}/tagalog-counselling` },
};

/* THE ENGLISH-FACING HUB for Tagalog-speaking counselling.
 *
 * In English on purpose, and that is not an oversight. Somebody looking for a
 * therapist their mother could actually talk to searches "Tagalog speaking
 * counsellor BC" in English — they are usually the bilingual one in the
 * family. The page written IN Tagalog is /tagalog, and it stays gated until a
 * native speaker has read it.
 *
 * Same split the Punjabi vertical already uses: /services/punjabi-counselling
 * is English, /punjabi is Punjabi. This is a pattern the site has, not a new
 * one invented here. */
export default function TagalogCounsellingHub() {
  const speaker = TAGALOG_SPEAKERS[0];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${site.domain}/tagalog-counselling#service`,
      name: 'Tagalog-speaking counselling',
      serviceType: 'Counselling',
      description: DESC,
      provider: orgRef,
      areaServed: { '@type': 'State', name: 'British Columbia' },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/tagalog-counselling`,
        availableLanguage: ['Tagalog', 'English'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${site.domain}/tagalog-counselling#page`,
      isPartOf: siteRef,
      inLanguage: 'en-CA',
      hasPart: TAGALOG_CITIES.map((c) => ({
        '@type': 'WebPage',
        name: `Tagalog counselling in ${c.city}`,
        url: abs(`/tagalog-counselling/${c.slug}`),
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Tagalog-speaking counselling</p>
          <h1>Therapy in the language you think in.</h1>
          <p className="lede">
            Counselling in Tagalog or English, anywhere in British Columbia, by secure video.
            Some things only land in your first language, and nobody should have to translate
            themselves to be understood.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            {speaker && (
              <Link className="btn btn--ghost" href={`/practitioners/${speaker.slug}`}>
                Meet {speaker.name.split(' ')[0]}
              </Link>
            )}
            {/* The page written IN Tagalog. This hub is the English one about
                it, and somebody who reads Tagalog should not have to find the
                other page through the header alone. */}
            {TAGALOG_READY && (
              <Link className="btn btn--ghost" href="/tagalog" hrefLang="tl" lang="tl">
                Basahin ito sa Tagalog
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Tagalog counselling', path: '/tagalog-counselling' }]} />

          <div className="prose">
            <h2>Why the language matters more than it sounds like it should</h2>
            <p>
              Plenty of people who speak excellent English still find that the words for what is
              actually wrong live somewhere else. Describing grief, shame or fear in a second
              language adds a step. You feel it, translate it, then say it, and that step is
              exactly where the meaning gets rounded off.
            </p>
            <p>
              It also removes the interpreter problem. In a lot of Filipino families the person
              with the strongest English becomes the one who explains everybody else to a doctor.
              That works for a prescription. It works badly for therapy, where the person doing
              the interpreting is frequently part of what is being discussed.
            </p>
            <p>
              And it means the context does not have to be taught first. Utang na loob, hiya, and
              the weight of what relatives will say are not exotic details to be explained at the
              start of a session. They are the ordinary furniture of the conversation.
            </p>
          </div>

          <Figure name="language-in-therapy-tl" />

          {speaker && (
            <div className="prose" style={{ marginTop: 28 }}>
              <h2>Who you would be working with</h2>
              <p>
                Sessions in Tagalog are with{' '}
                <Link href={`/practitioners/${speaker.slug}`}>{speaker.name}</Link>,{' '}
                {speaker.postNominals}, registered with the BC Association of Clinical
                Counsellors and certified with the Canadian Counselling and Psychotherapy
                Association. Both numbers are on her profile, and both registers are public.
              </p>
              <p>{speaker.tagline}</p>
            </div>
          )}

          {speaker?.photos?.warm && (
            <figure className="photo" style={{ margin: '26px 0 0', maxWidth: 340 }}>
              <Image
                src={speaker.photos!.warm!.src}
                alt={`${speaker.name}, ${speaker.postNominals}, who offers counselling in Tagalog and English at Westpeak Wellness`}
                width={speaker.photos!.warm!.width}
                height={speaker.photos!.warm!.height}
                sizes="(max-width: 700px) 60vw, 340px"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
              <figcaption>{speaker.name}, {speaker.postNominals}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">By city</p>
          <h2>Tagalog counselling across British Columbia</h2>
          <p className="lede">
            The practice is entirely virtual, so every city is served on identical terms. These
            pages cover what finding care in Tagalog actually looks like from each place.
          </p>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {TAGALOG_CITIES.map((c) => (
              <Link className="chip" key={c.slug} href={`/tagalog-counselling/${c.slug}`}>
                Tagalog counselling in {c.city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <h2>What it costs, and what is covered</h2>
          <p>
            Fees are the same in either language. There is no premium for working in Tagalog.
            The full table is on <Link href="/pricing">fees and insurance</Link>, and many BC
            extended health plans reimburse a Registered Clinical Counsellor. If cost is the
            obstacle,{' '}
            <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link>{' '}
            lists the free and reduced-rate options, several of which are a better first step.
          </p>
          <p>
            If you would rather read all of this in Tagalog, that page is being prepared and will
            live at <code>/tagalog</code>. It is deliberately not published until a native
            speaker has checked every line of it.
          </p>
        </div>
      </section>

      <Figure name="first-session-flow" />

      <CtaBand
        heading="Start with a conversation"
        text="A free 15-minute consultation by video, in Tagalog or English. No card, no obligation."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
