import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { reachesAlberta } from '@/lib/practice-facts';
import { abs, orgRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';
import BookLink from '@/components/BookLink';
import CounsellorCompare from '@/components/CounsellorCompare';
import { readCatalog } from '@/lib/cliniko-catalog';
import { FirstOpen } from '@/components/NextConsultSlot';
import { lowestFee, consultLine, rosterOrder } from '@/lib/practitioner-facts';

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
 * Counsellors taking new clients first, each with her status, lowest fee,
 * next free consultation and her own Book button; anyone not taking new
 * clients last, as a short row that says so and links her profile, with no
 * reason given (2 Oct 2026). The only Book link here used to be the closing
 * band, and the first row was someone who cannot be booked. */

/* Fully static since 3 Oct 2026 (item 429). Each row's next free
   consultation is filled in by the browser from /api/availability
   (components/NextConsultSlot.tsx), so the page no longer re-renders every
   thirty minutes and keeps its inlined first-paint CSS in production. */
export default async function PractitionersPage() {
  const roster = rosterOrder(practitioners);
  const catalog = await readCatalog();
  const consult = consultLine(catalog);

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
    hasPart: roster.map((p) => ({
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
            Every counsellor here is registered, and each profile carries her registration
            number, which can be checked against a public register in about two minutes.
          </p>
          <p className="direct-answer">
            Westpeak Wellness is a virtual counselling practice whose counsellors are Registered Clinical Counsellors with the BC Association of Clinical Counsellors. Sessions are offered in English, Punjabi and Tagalog by secure video across British Columbia{reachesAlberta(practitioners) ? ' and, for the counsellor certified there, Alberta' : ''}. Each profile lists training, languages, areas of focus, registration and whether the counsellor is currently taking new clients.
          </p>
          <Updated iso={COLLECTION_DATES['practitioners']} />
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
              within the hour. The registration number is on each profile in full, so you can
              check it against a public register before booking anything, here or anywhere else.
            </p>
            <p>
              If you are not sure who to choose, the{' '}
              <Link href="/book">free 30-minute consultation</Link> is for exactly that, and it
              carries no obligation. Where somebody else would be a better fit, including outside
              this practice. You will be told so on the call.
            </p>

            <h2 id="how-to-choose">How to choose between counsellors</h2>
            <p>
              Start with language, because it is the one thing a good counsellor cannot
              compensate for. If part of what you carry only comes out properly in Punjabi or
              Tagalog, choose the person who works in it, even if the rest of the profile reads
              as a slightly less exact match. Then look at focus. A counsellor who names trauma
              and EMDR is telling you where their training and their caseload sit; one who names
              CBT, ACT and DBT is telling you something different. Neither is better, and the
              wrong fit is not a failure of either of you. It is simply information, and the
              consultation exists so that it costs nothing to find out.
            </p>
          </div>

          {/* Side by side, every cell computed (components/CounsellorCompare.tsx). */}
          <CounsellorCompare roster={practitioners} catalog={catalog} location="counsellor-compare" />

          <div className="prose" style={{ marginTop: 24, marginBottom: 8 }}>
            <p>
              Availability is the last filter, not the first. A profile marked as not taking new
              clients still tells you what the practice as a whole works with, and the
              consultation is booked with whoever is open, so nobody is asked to wait for a
              particular person. Existing clients are unaffected by that status; it only governs
              who a new enquiry is routed to.
            </p>

            <h2 id="what-registration-means">What the registration number means</h2>
            <p>
              &ldquo;Counsellor&rdquo; is not yet a protected title in British Columbia, which is
              why every profile here shows a registration number beside the designation. A
              Registered Clinical Counsellor has met the BC Association of Clinical Counsellors&rsquo;
              requirements: a master&rsquo;s degree in counselling or a closely related field,
              supervised clinical hours, professional liability insurance, continuing education,
              and a code of ethics with a public complaints process behind it. The number is
              searchable in the{' '}
              <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">BCACC register</a>,
              and <Link href="/resources/verify-a-counsellor-in-bc">checking it takes about two minutes</Link>.
              <Link href="/resources/verify-a-counsellor-in-bc"> What an RCC is</Link>,
              and how the designation compares with a psychologist or a social worker, is set out
              on its own pages; the <Link href="/accessibility">accessibility statement</Link>{' '}
              covers how sessions and this site accommodate disability.
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
            {roster.map((p) => (
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
                  <p className="practitioner-row-role">{p.role}{p.postNominals ? ` · ${p.postNominals}` : ''}</p>
                  <p className="practitioner-row-tagline">{p.tagline}</p>
                  <p className="practitioner-row-langs" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                    {p.acceptingNewClients ? 'Taking new clients' : 'Not taking new clients'}
                  </p>
                  {/* Focus areas only for someone a reader can book. */}
                  {p.acceptingNewClients && (
                    <ul className="practitioner-row-focus">
                      {p.focus.map((f) => <li key={f.label}>{f.label}</li>)}
                    </ul>
                  )}
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
                  {p.acceptingNewClients && (lowestFee(p, catalog) || consult) && (
                    <p className="practitioner-row-langs">
                      {[lowestFee(p, catalog) ? `From ${lowestFee(p, catalog)}` : null, consult ? consult.charAt(0).toLowerCase() + consult.slice(1) : null].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  {/* One line held open for the time, so the button under it
                      does not move when it arrives. */}
                  {p.acceptingNewClients && p.bookable && (
                    <p className="practitioner-row-langs consult-slot" style={{ '--lm': 1, '--ld': 1 } as React.CSSProperties}>
                      <FirstOpen slug={p.slug} prefix="Next free consultation: " />
                    </p>
                  )}
                  {/* Above the row's stretched link (its ::after covers the
                      card), so the button is its own target. */}
                  {p.acceptingNewClients && p.bookable ? (
                    <div style={{ position: 'relative', zIndex: 1, marginTop: 4 }}>
                      <BookLink location="practitioners-row" href={`${site.bookingPath}?with=${p.slug}#calendar`}>
                        Book with {p.name.split(' ')[0]}
                      </BookLink>
                    </div>
                  ) : (
                    <span className="practitioner-row-more" aria-hidden="true">
                      Read more about {p.name.split(' ')[0]} &rarr;
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
          {/* Psychology Today is where much of the province looks first; the
              link is the same one each profile carries, for the counsellors
              taking new clients. */}
          {practitioners.some((p) => p.acceptingNewClients && p.sameAs?.some((u) => /psychologytoday\.com/.test(u))) && (
            <p style={{ marginTop: 18, fontSize: '.92rem', color: 'var(--ink-soft)' }}>
              Also listed on Psychology Today:{' '}
              {practitioners
                .filter((p) => p.acceptingNewClients && p.sameAs?.some((u) => /psychologytoday\.com/.test(u)))
                .map((p, i, arr) => (
                  <span key={p.slug}>
                    <a href={p.sameAs!.find((u) => /psychologytoday\.com/.test(u))} target="_blank" rel="noopener">{p.name}</a>
                    {i < arr.length - 1 ? (i === arr.length - 2 ? ' and ' : ', ') : '.'}
                  </span>
                ))}
            </p>
          )}
        </div>
      </section>

      <CtaBand
        heading="Not sure who to book with?"
        text="A free 30-minute consultation is the easiest way to find out. No card, no commitment."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
