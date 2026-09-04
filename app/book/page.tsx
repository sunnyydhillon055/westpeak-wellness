import type { Metadata } from 'next';
import Figure from '@/components/Figure';
import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import SchedulerEmbed from '@/components/SchedulerEmbed';
import Breadcrumbs from '@/components/Breadcrumbs';
import InboundForm from '@/components/InboundForm';
import { ogBase } from '@/lib/og-meta';
import { getPractitioner } from '@/lib/practitioners';
import { PROVINCE_NAME, type Province } from '@/lib/crisis';

export const metadata: Metadata = {
  title: 'Book a Free 15-Minute Consultation',
  description:
    'A free 15-minute video call. No card, no obligation, and if someone else would suit you better you will be told so. Anywhere in BC, in English, Punjabi or Tagalog.',
  alternates: { canonical: `${site.domain}/book` },
  openGraph: { ...ogBase(`/book`),
    title: `Book a Free 15-Minute Consultation | ${site.name}`,
    description: 'Free 15-minute consultation for online counselling anywhere in British Columbia.',
  },
};

export default function Book({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const waitlist = searchParams?.waitlist === 'ok' ? 'ok'
    : searchParams?.waitlist === 'err' ? 'err' : undefined;

  /* WHO THE READER CAME FOR — ?with=<slug>.
   *
   * Until 1 Sep 2026 every call to action on Camille's 24 pages pointed here
   * with nothing attached, and this page is written for the founder. So a
   * reader who had just spent a thousand words on Camille's Calgary page was
   * told "Sessions are for people located in British Columbia" and "Available
   * in English, Punjabi, or a mix of both" — ineligible on the first line and,
   * if they came for Tagalog, offered the wrong language on the second.
   *
   * The province and language lines below now come from whoever the reader
   * actually arrived for. With no ?with= the page is exactly what it was. */
  const withSlug = typeof searchParams?.with === 'string' ? searchParams.with : '';
  const who = withSlug ? getPractitioner(withSlug) : undefined;

  /* The founder is on the Cliniko calendar; a counsellor who is not yet on it
     cannot be booked by an embed that books somebody else. For them the page
     offers a request instead of a calendar, which is the honest version — and
     the request carries their name so whoever answers it knows. */
  const schedulable = !who || who.bookable;

  const provinceList = who
    ? who.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ')
    : 'British Columbia';
  /* WITH NO ?with=, THIS IS THE WHOLE PRACTICE, NOT THE FOUNDER.
     The fallback said "English, Punjabi, or a mix of both", which was true
     when there was one counsellor and stopped being true the day Camille
     joined: she works in English and Tagalog. A Tagalog speaker reaching the
     booking page was told the consultation could be in two languages, neither
     of which was theirs. Taken from site.languages so it cannot drift again.

     Note for whoever picks this up: the same stale pair is still in about 45
     other places, /about and /contact among them. Not swept here because those
     strings sit next to the per-practitioner resolver in
     lib/practitioner-places.ts and its tests, and that is a change worth
     making deliberately rather than at the end of an unrelated one. */
  const languageList = who
    ? who.languages.map((l) => l.name).join(' or ')
    : site.languages;

  return (
    <>
      {/* ======================================================================
          SLIMMED 3 Sep 2026, AND THE REASON IS THE ORDER, NOT THE LENGTH.

          This page had nine sections, two diagrams and about 860 words of
          prose, and the calendar sat behind roughly 500 of them. Somebody who
          arrives here has already decided to book: the click that got them
          here was the decision. Everything before the calendar was reassurance
          offered to a person who had stopped needing it, and on a phone it was
          several screens of scrolling to reach the one control the page exists
          for.

          The content is not gone. What was five paragraphs above the calendar
          is now a strip of facts and one boundary note; the four long
          explanatory sections are behind disclosures below it, where the person
          who wants them can still get them and the person who does not is not
          made to scroll past them. The crisis block stays open, always, because
          it is the one thing nobody should have to expand to find.

          One of the two diagrams went. booking-payment-flow and
          first-session-flow sat in the same section saying overlapping things,
          and the payment one belongs on /pricing.
          ====================================================================== */}

      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <p className="eyebrow">Free · 15 minutes · No commitment</p>
          <h1 style={{ marginBottom: 10 }}>Book a free consultation.</h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            A short conversation over secure video to work out whether this is a fit. Nothing is
            diagnosed, and there is no obligation to book a session afterwards.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Book', path: '/book' }]} />

          {/* Five paragraphs became five facts. Every one was already true and
              already on this page; what changed is that they can be taken in at
              a glance instead of read. */}
          <ul className="book-facts">
            <li>15 minutes</li>
            <li>Secure video</li>
            <li>No card</li>
            <li>No intake form</li>
            <li>Free cancellation up to {site.cancellationHours}h</li>
          </ul>

          {who && !schedulable ? (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Ask for a consultation with {who.name.split(' ')[0]}</h2>
              <p>
                {who.name.split(' ')[0]} is not on the online calendar yet, so this one is arranged
                by reply rather than by picking a slot. Leave your name and email with a line about
                what you are looking for and roughly when you are free, and you will hear back
                within one business day to fix a time.
              </p>
              <p>
                {who.name} · {who.postNominals}, sessions in {languageList}, anywhere in{' '}
                {provinceList}.{' '}
                <Link href={`/practitioners/${who.slug}`}>More about {who.name.split(' ')[0]}</Link>.
              </p>
              <InboundForm kind="waitlist" done={waitlist} practitioner={who.slug} />
            </div>
          ) : site.bookingReady ? (
            <>
              {/* The credentials at the moment of commitment. Everything here is
                  verifiable and already published elsewhere on the site: this is
                  placement, not new claims. */}
              <p className="book-credential">
                <strong>{site.counsellor.title} ({site.counsellor.credentials})</strong> ·{' '}
                <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">
                  check the BCACC register
                </a>{' '}
                · EMDR-trained · Gottman-trained
              </p>
              {who && (
                <p className="book-credential">
                  You arrived from {who.name}&rsquo;s page. The calendar below books the
                  consultation; say on the call that you were looking for{' '}
                  {who.name.split(' ')[0]} and it will be arranged.
                </p>
              )}
              <SchedulerEmbed
                url={site.bookingsUrl}
                title="Book a free 15-minute consultation"
                page="/book"
              />
            </>
          ) : (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Online scheduling is being set up</h2>
              <p>
                The booking calendar goes live here shortly. In the meantime, email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> with a sentence about what
                you&rsquo;re looking for and a couple of times that suit you, and your consultation
                will be confirmed by reply.
              </p>
              <div className="btn-row" style={{ marginTop: 22 }}>
                <a className="btn btn--primary" href={`mailto:${site.email}?subject=Free%2015-minute%20consultation`}>
                  Email to book your consultation
                </a>
                <a className="btn btn--ghost" href={site.bookingsFallbackUrl} target="_blank" rel="noopener">
                  Try the booking page directly
                </a>
              </div>
            </div>
          )}

          {/* WHERE THE CLIENT IS SITTING DECIDES WHICH PROVINCE THE SESSION
              HAPPENS IN. Counselling is regulated provincially and a session
              counts as happening where the client is, not where the counsellor
              is. Kept immediately UNDER the calendar rather than above it: it is
              a correction for the minority who are outside the province, and it
              should not be the first thing the majority read. */}
          <div className="book-notes">
            <p>
              <strong>
                Sessions {who ? `with ${who.name.split(' ')[0]} ` : ''}are for people located in {provinceList}.
              </strong>{' '}
              A session counts as happening where you are sitting, so this is a registration and
              insurance boundary rather than a preference. If you are elsewhere in Canada, say so on
              the call and you will be pointed toward someone who can properly see you.
            </p>

            {/* The Gurmukhi sentence is reused verbatim from /punjabi, which has
                been reviewed. Nothing here is newly composed Punjabi. Shown only
                when the consultation can actually be in Punjabi: offering it to
                somebody who arrived for a Tagalog-speaking counsellor is the
                same false promise this page was fixed for at the other end. */}
            {(!who || who.languages.some((l) => l.tag === 'pa')) && (
              <p>
                <span className={gurmukhi.className} lang="pa">
                  ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।
                </span>{' '}
                The consultation can be in Punjabi, English, or both.{' '}
                <Link href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ</Link>
              </p>
            )}
            {who && !who.languages.some((l) => l.tag === 'pa') && (
              <p>
                <strong>The consultation can be in {languageList}</strong>, including moving between
                them, which is what most bilingual people end up doing.
              </p>
            )}

            <p>
              <strong>After you book,</strong> a confirmation email arrives with the video link.
              Nothing to install, and any device with a camera works. No diagnosis, referral or
              decision on the spot is needed.{' '}
              <Link href="/resources/before-your-first-consultation">More on the call itself</Link>.
            </p>
          </div>

          {/* THE CALENDAR OFFERS 17 HOURS A WEEK, three of the five days being a
              single evening hour. For a good share of the people who get this far
              nothing on it is possible, so the hours and the waitlist belong
              together: the list is what makes somebody realise they need the form
              beside it. */}
          <div className="book-brief" style={{ marginTop: 28 }}>
            <div className="book-hours">
              <h3>Consultation hours</h3>
              <ul>
                {site.availability.map((a) => (
                  <li key={a.day}>
                    <span>{a.day}</span>
                    <span>{a.from} – {a.to}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* No heading and no intro here. InboundForm already renders both
                  for the waitlist kind, and writing my own produced two
                  headings and two near-identical sentences stacked on top of
                  each other. Caught by reading the rendered page rather than
                  the source, where the component's copy is not visible. */}
              <InboundForm kind="waitlist" done={waitlist} practitioner={who?.slug} />
            </div>
          </div>

          {/* Always open, never behind a disclosure. */}
          <div className="crisis" style={{ marginTop: 28 }}>
            <p style={{ margin: 0 }}>
              <strong>If you are in crisis:</strong> this is not a crisis service. Call or text{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> (Canada, 24/7) or BC Mental Health at{' '}
              <a href="tel:3106789"><strong>310-6789</strong></a>. In immediate danger, call{' '}
              <a href="tel:911"><strong>911</strong></a>.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================
          WHAT WAS FOUR FULL SECTIONS.

          Closed by default, and each summary is a real question rather than a
          heading, so the line is worth reading on its own. Native details, so it
          works with no JavaScript, is keyboard-operable for free, and is opened
          by a browser's find-in-page when the answer is inside it.
          ====================================================================== */}
      <section className="section section--tint">
        <div className="container container--article">
          <h2 style={{ marginTop: 0 }}>Before you decide</h2>

          <details className="faq-item">
            <summary>What actually happens in the 15 minutes?</summary>
            <div className="prose">
              <p>
                You say what brought you here, in your own words. There is no form and no history
                to assemble. &ldquo;Something is off and I do not know what&rdquo; is an ordinary
                opening, and a large share of consultations start close to it.
              </p>
              <p>
                You hear how the work would go: the approach that fits what you have described,
                roughly how long that tends to take, and what it costs. Then you decide, in your
                own time. Nobody is asked to commit on the call.
              </p>
              <Figure
                name="first-session-flow"
                caption="The consultation is step one of four, and stopping after it is a normal outcome."
              />
            </div>
          </details>

          <details className="faq-item">
            <summary>What do the first few sessions look like if I carry on?</summary>
            <div className="prose">
              <p>
                <strong>Session one</strong> is the whole picture: what is going on, how long it has
                been going on, and what you want to be different.
              </p>
              <p>
                <strong>Sessions two and three</strong> look for the pattern underneath the episodes
                rather than working through them one at a time.
              </p>
              <p>
                <strong>Around session four</strong> there is a deliberate check on whether this is
                working, asked out loud rather than left to you to raise.
              </p>
              <p>
                <strong>After that it is your call, every time.</strong>{' '}
                <Link href="/guides/how-long-does-therapy-take">How long therapy takes</Link> covers
                the commitment honestly, and{' '}
                <Link href="/guides/when-therapy-isnt-working">when therapy is not working</Link>{' '}
                covers what to do if it is not.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>Is there anything I should prepare?</summary>
            <div className="prose">
              <p>
                No. You are also not expected to tell the whole story: fifteen minutes is not enough
                for that and it is not what the call is for. If it helps to arrive with anything,
                one sentence on what is going on and one on how long it has been going on is more
                than sufficient.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>What should I ask on the call?</summary>
            <div className="prose">
              <p>
                The consultation goes both ways, and the more useful version has you asking rather
                than only answering. What approach would you use for this and why. How would we know
                it was working. What do you not work with. What does it cost and is that the whole
                cost.{' '}
                <Link href="/guides/questions-to-ask-a-therapist">Questions worth asking a therapist</Link>{' '}
                sets out the full list along with the answers that should make you wary. Every one
                of them is fair game here.
              </p>
            </div>
          </details>

          <details className="faq-item">
            <summary>What if it turns out not to be a fit?</summary>
            <div className="prose">
              <p>
                A consultation that ends with &ldquo;this is not the right fit&rdquo; is a success,
                not a failure. Sometimes that means a different counsellor; sometimes a physician, a
                psychologist for a formal assessment, or a specialised service. The limits of what
                this practice does are listed openly on{' '}
                <Link href="/standards">standards and accountability</Link>, and being told one of
                them applies to you is a better result than a booking that was never going to help.
              </p>
              <p>
                If cost is the obstacle,{' '}
                <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link>{' '}
                lists the free and reduced-cost routes, several of which have no waitlist at all.
              </p>
            </div>
          </details>

          <ul className="checklist" style={{ marginTop: 26 }}>
            <li>Sessions are fully online, anywhere in {provinceList}</li>
            <li>Available in {languageList}</li>
            <li>Individual sessions are 50 minutes; couples sessions are 50 or 110</li>
            <li>Fees and payment are on the <Link href="/pricing">fees page</Link></li>
            <li>Most BC extended health plans that cover RCCs will reimburse</li>
          </ul>

          <p style={{ marginTop: 18 }}>
            Would rather read first? The <Link href="/faq">FAQ</Link> covers fees and
            confidentiality, <Link href="/services">services</Link> covers the approaches, and{' '}
            <Link href="/about">about your counsellor</Link> covers who you would be speaking to.
            To ask something before booking anything, the <Link href="/contact">contact page</Link>{' '}
            gets a reply within one business day.
          </p>
        </div>
      </section>
    </>
  );
}
