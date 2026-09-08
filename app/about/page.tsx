import Link from 'next/link';
import Updated from '@/components/Updated';
import type { Metadata } from 'next';
import Image from 'next/image';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import Motif from '@/components/brand/Motif';
import Breadcrumbs from '@/components/Breadcrumbs';
import { practitioners } from '@/lib/practitioners';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';

/* ABOUT US — rewritten 31 Aug 2026, at the owner's request, from ~1,720 words
 * to roughly 500.
 *
 * WHAT CHANGED AND WHY. This page was "Meet your counsellor", written in the
 * first person singular: "Why I do this work", "How I decide what to use",
 * "What I do not do". The practice now has more than one counsellor, and the
 * brief was an About Us about Westpeak's approach rather than one person's.
 * First person plural, practice level, and short enough to read standing up.
 *
 * THE LENGTH IS THE POINT. Nine hundred words of a counsellor explaining their
 * philosophy is a page written for the counsellor. Someone deciding whether to
 * book wants to know what this place is like, whether it fits, and what happens
 * next — and they want it in blocks they can scan. Sections here run 30–60
 * words each, deliberately.
 *
 * NAMES, SINCE 6 SEP 2026. The owner asked for the counsellors on this page,
 * so the roster renders here and scripts/expansion-verify.mjs allows the name
 * on /about alongside the profiles and /practitioners. The registration
 * number came off this page the same day: it is on each counsellor's own
 * profile, and nowhere else.
 *
 * THE LONG-FORM MATERIAL IS NOT DELETED, it moved. What a session is like, how
 * an approach gets chosen, working in Punjabi, and the scope limits all live in
 * the guides and on /standards, which is where someone who wants that depth
 * goes looking. Cutting this page did not cut the content behind it.
 */

export const metadata: Metadata = {
  openGraph: { ...ogBase('/about') },
  /* Absolute, so the template does not append the practice name to a title
     that already carries it. "and" rather than "&": the SEO gate measures the
     rendered HTML, where an ampersand is five characters. */
  title: { absolute: 'About Westpeak Wellness: Counselling in BC and Alberta' },
  description:
    'A virtual counselling practice serving all of British Columbia. Therapy in English, Punjabi or Tagalog with Registered Clinical Counsellors.',
  alternates: { canonical: `${site.domain}/about` },
};

/* Six blocks, each one thing. Kept as data so the grid stays even and nobody
   is tempted to grow one into three paragraphs. */
const BLOCKS: { h: string; p: string; href: string; cta: string }[] = [
  {
    h: 'How we work',
    p: 'Practical and collaborative. You set what matters; we bring the structure and the evidence base. No jargon you have to translate, and no homework for its own sake.',
    href: '/approaches',
    cta: 'The approaches we use',
  },
  {
    h: 'Entirely online',
    p: 'Every session runs by secure video, anywhere in British Columbia. No commute, no waiting room, and no clinic doorway anyone might notice you walking through.',
    href: '/online-counselling',
    cta: 'Areas we serve',
  },
  {
    h: 'English, Punjabi or Tagalog',
    p: 'Any session can run in either language, or move between the two. For a lot of people that is the difference between explaining a feeling and actually having it understood.',
    href: '/punjabi',
    cta: 'ਪੰਜਾਬੀ ਵਿੱਚ',
  },
  {
    h: 'Culturally grounded',
    p: 'You should not have to explain your family before you can talk about it. South Asian family expectations, and the weight of what people will say, are context we already have.',
    href: '/for/south-asian-intergenerational-conflict',
    cta: 'Who we work with',
  },
  {
    h: 'A free first call',
    p: 'Thirty minutes by video, no card and no obligation. It is for working out fit, and if someone else is a better fit, we will say so on the call.',
    href: site.bookingPath,
    cta: 'Book the consultation',
  },
  {
    h: 'Clear about money',
    p: 'Fees are published, the card is taken when you book, and cancelling more than 24 hours ahead is refunded in full. Nothing about the invoice should be a surprise.',
    href: '/pricing',
    cta: 'Fees and coverage',
  },
];

export default function About() {
  return (
    <>
      {/* This page carried no page-level entity. The layout's organisation and
          website nodes were on it, so a validator saw structured data and
          reported nothing wrong, while nothing described the page itself: no
          name, no description, no language, no date, no author. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPage({
              path: "/about",
              name: "About Westpeak Wellness",
              description:
                "Who the counsellors are, how the practice works, and the limits of what it does. Online counselling across British Columbia.",
              updated: COLLECTION_DATES["practitioners"],
              type: "AboutPage",
            })
          ),
        }}
      />
      {/* No hero portrait since 8 Sep 2026: it was the founder's photograph, which
          the roster below already carries, so the page showed her twice. */}
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <div>
            <p className="eyebrow">About us</p>
            <h1>Counselling that meets you where you are.</h1>
            <p className="lede">
              Westpeak Wellness is a virtual counselling practice serving all of British Columbia,
              working in English, Punjabi and Tagalog with Registered Clinical Counsellors.
            </p>
            <p className="direct-answer">
              Westpeak Wellness is an online counselling practice founded in British Columbia and serving all of BC and Alberta by secure video. Its counsellors are Registered Clinical Counsellors with the BC Association of Clinical Counsellors, offering individual, couples, family, EMDR and trauma therapy in English, Punjabi and Tagalog. There is no waitlist; the first 30-minute consultation is free.
            </p>
            <Updated iso={COLLECTION_DATES['practitioners']} />
            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
              <Link className="btn btn--ghost" href="/services">See our services</Link>
            </div>
            {/* No registration badge here since 6 Sep 2026. There was one, as
                the practice's identity anchor, but it was one counsellor's
                number on a page about a practice of several. The numbers live
                on each counsellor's own profile, beside the register they can
                be checked in, and the roster below leads there. */}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'About', path: '/about' }]} />

          {/* THE COUNSELLORS, FIRST. Added 6 Sep 2026 at the owner's request:
              this page showed one photograph and one registration number and
              read as a solo practice a week after it stopped being one.
              Rendered from the roster, so the next counsellor added appears
              here without an edit. Same row component as /practitioners; no
              registration numbers, which stay on each profile. */}
          <div className="prose" style={{ marginTop: 8 }}>
            <h2>Our counsellors</h2>
            <p>
              Registered counsellors, each with their own page: training, what they work with,
              the languages they practise in, and the register their number can be checked in.
            </p>
          </div>
          <div className="practitioner-list" style={{ marginTop: 18 }}>
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
                  <h3>
                    <Link className="practitioner-row-link" href={`/practitioners/${p.slug}`}>
                      {p.name}
                    </Link>
                  </h3>
                  <p className="practitioner-row-role">{p.role}{p.postNominals ? ` · ${p.postNominals}` : ''}</p>
                  <p className="practitioner-row-tagline">{p.tagline}</p>
                  <p className="practitioner-row-langs">
                    Works in {p.languages.map((l) => l.name).join(' and ')}
                    {' · '}
                    {p.acceptingNewClients ? (
                      <strong>Taking new clients</strong>
                    ) : (
                      'Not taking new clients at the moment'
                    )}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="prose" style={{ marginTop: 40, marginBottom: 8 }}>
            <h2>What we are here for</h2>
            <p>
              Westpeak is a small practice of registered counsellors working online across British
              Columbia. You can{' '}
              <Link href="/practitioners">read about each of our counsellors</Link>. Their
              training, what they work with, and the languages they practise in.
            </p>
            <p>
              Most people arrive having managed on their own for a long time, and having decided
              that managing is not the same as being alright. The work is not about being fixed. It
              is about understanding what keeps happening, and having something to do about it.
            </p>
          </div>

          <div className="grid grid-3" style={{ marginTop: 28 }}>
            {BLOCKS.map((b) => (
              <div className="card" key={b.h}>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
                <p style={{ marginBottom: 0 }}>
                  <Link href={b.href}>{b.cta} →</Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          {/* ADDED 2 Sep 2026. The page was 499 words and among the most
              visited on the site, and it said nothing about the two facts that
              most distinguish this practice from the others somebody is
              comparing it against: the languages, and the second province.
              Both were true and documented elsewhere and neither was here. */}
          <h2>The languages we work in</h2>
          <p>
            Sessions run in English, Punjabi or Tagalog, and in plenty of them the conversation
            moves between two of those without anybody planning it. That is not a feature bolted
            on, for a lot of people it is the difference between describing a feeling and
            translating one, and translating a feeling while you are still struggling to name it
            in your first language is its own kind of work.
          </p>
          <p>
            It also removes an explaining step. What relatives will say, what is owed to a family,
            what gets carried down. Those are the starting context of a session rather than
            something to be taught at the beginning of one. There are pages written in{' '}
            <Link href="/punjabi" lang="pa" hrefLang="pa">ਪੰਜਾਬੀ</Link> and in{' '}
            <Link href="/tagalog" lang="tl" hrefLang="tl">Tagalog</Link> rather than about them.
          </p>

          <h2>Where we can see you, and where we cannot</h2>
          <p>
            Counselling is regulated province by province, and a session counts as happening where
            you are sitting rather than where your counsellor is. This practice works across all of
            British Columbia. One counsellor, Camille Granda, who holds the national CCC
            certification alongside her BC registration, can also see clients located in Alberta.
          </p>
          <p>
            The rest of the country we cannot, and the pages say so rather than taking a booking
            and sorting it out later. If you are elsewhere in Canada, your provincial college or
            association keeps a directory of registrants who can.{' '}
            <Link href="/practitioners">Each counsellor&rsquo;s page</Link> states their
            registration numbers, the provinces they cover and the languages they work in.
          </p>

          <h2>Why there are no reviews here</h2>
          <p>
            The BC Association of Clinical Counsellors prohibits client testimonials, so this site
            publishes none, not for modesty and not because there is nothing to say. Where
            reviews would normally sit, there are registration numbers you can check yourself on a
            public register in about two minutes.{' '}
            <Link href="/reviews">Reviews and references</Link> explains the rule and what can be
            verified instead.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose">
          <h2>What we will tell you straight</h2>
          <p>
            Counselling is not right for everyone, and it is not right for everything. Where
            something needs a doctor, a psychiatrist or a crisis service instead, you will be told
            that rather than booked in.{' '}
            <Link href="/standards">Our standards and scope</Link> set out exactly what this
            practice does and does not treat, and how to raise a concern.
          </p>
          <p>
            Free and low-cost options exist across BC, and for plenty of people one of those is the
            better place to start. We would rather say so than take a booking.{' '}
            <Link href="/resources/low-cost-counselling-bc">Low-cost counselling in BC</Link> lists
            them.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Not sure yet?"
        text="A free 30-minute consultation is the easiest way to find out. No card, no commitment."
      />
    </>
  );
}
