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
    'A free 15-minute video call — no card, no obligation, and if someone else would suit you better you will be told so. Anywhere in BC, English or Punjabi.',
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
  const languageList = who
    ? who.languages.map((l) => l.name).join(' or ')
    : 'English, Punjabi, or a mix of both';

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Free · 15 minutes · No commitment</p>
          <h1>Book a free consultation.</h1>
          <p className="lede">
            The first step is a short, no-pressure conversation over secure video. It costs
            nothing, and there is no obligation to book a session afterward.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Book', path: '/book' }]} />

          {/* Expectation strip, directly above the calendar.
            *
            * Without it a visitor meets the embed cold, and the first thing
            * they learn is that the next opening is several days away — which
            * reads as "they are too busy for me" rather than "these are the
            * hours". Stating the shape of the call and the real windows first
            * turns a wait into information. Availability comes from
            * site.availability, so it cannot drift from the footer or Cliniko. */}
          <div className="book-brief">
            <div>
              <h2>Before you pick a time</h2>
              <p>
                Fifteen minutes, by secure video. You describe what is going on in your own
                words, ask anything you want, and we work out together whether this is a good
                fit. Nothing is diagnosed and nothing is decided on the call.
              </p>
              <p className="book-brief-note">
                No card, no intake form, and no obligation to book a session afterwards —
                deciding not to is a completely normal outcome.
              </p>
              {/* WHERE THE CLIENT IS SITTING DECIDES WHICH PROVINCE THE SESSION
                  HAPPENS IN. Counselling is regulated provincially and the
                  service is delivered where the client is, not where the
                  counsellor is. The scheduler cannot know that, and the practice
                  is registered and insured in British Columbia only. This is the
                  cheapest place to catch it — before a booking rather than in
                  the session. Added 17 Aug 2026 after confirming the liability
                  policy does not extend outside BC. */}
              <p className="book-brief-note">
                <strong>
                  Sessions {who ? `with ${who.name.split(' ')[0]} ` : ''}are for people located in {provinceList}.
                </strong>{' '}
                Counselling is regulated province by province, and a session counts as happening
                where you are sitting rather than where your counsellor is — so this is a
                registration and insurance boundary rather than a preference. If you are elsewhere
                in Canada, say so on the consultation and you will be pointed toward someone who
                can properly see you.
              </p>
              {/* Punjabi searchers reach this page directly from Punjabi-language
                  SERPs and previously met a wall of English at the highest-intent
                  moment on the site. The Gurmukhi sentence is reused VERBATIM
                  from /punjabi (already reviewed) — nothing here is newly
                  composed Punjabi, per the fluent-review rule.

                  Shown only when the consultation can actually be in Punjabi.
                  Offering it to somebody who arrived for a Tagalog-speaking
                  counsellor is the same false promise this page was fixed for
                  at the other end. */}
              {(!who || who.languages.some((l) => l.tag === 'pa')) && (
                <p className="book-brief-note">
                  <span className={gurmukhi.className} lang="pa">
                    ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ
                  </span>{' '}
                  — the consultation itself can be in Punjabi, English, or both.{' '}
                  <Link href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ</Link>
                </p>
              )}
              {who && !who.languages.some((l) => l.tag === 'pa') && (
                <p className="book-brief-note">
                  <strong>The consultation can be in {languageList}</strong> — including moving
                  between them, which is what most bilingual people end up doing.
                </p>
              )}
              {/* The last-mile objections, answered where they strike rather
                  than three clicks away on /pricing and /client-portal. */}
              <p className="book-brief-note">
                <strong>After you book:</strong> a confirmation email arrives with the video link —
                nothing to install, any device with a camera works. Rescheduling or cancelling is
                free up to {site.cancellationHours} hours ahead. And nothing about the call requires
                a diagnosis, a referral, or a decision on the spot. The full shape of the call is on{' '}
                <Link href="/resources/before-your-first-consultation">the consultation-prep page</Link>.
              </p>
            </div>
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
              <p>
                If none of these work,{' '}
                <a href={`mailto:${site.email}`}>email {site.email}</a> and say roughly when you
                are free.
              </p>
            </div>
          </div>

          {/* A counsellor who is not on the calendar yet gets a request path
              rather than an embed that would book somebody else. */}
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
                {who.name} · {who.postNominals} — sessions in {languageList}, anywhere in{' '}
                {provinceList}. <Link href={`/practitioners/${who.slug}`}>More about {who.name.split(' ')[0]}</Link>.
              </p>
              <InboundForm kind="waitlist" done={waitlist} practitioner={who.slug} />
            </div>
          ) : site.bookingReady ? (
            <>
              {/* The credentials at the moment of commitment. Everything here
                  is verifiable and already published elsewhere on the site —
                  this is placement, not new claims. */}
              <p className="book-brief-note" style={{ textAlign: 'center', marginBottom: 10 }}>
                <strong>{site.counsellor.title} ({site.counsellor.credentials})</strong> ·{' '}
                <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">
                  check the BCACC register
                </a>{' '}
                · EMDR-trained · Gottman-trained · English &amp; ਪੰਜਾਬੀ
              </p>
              {who && (
                <p className="book-brief-note" style={{ textAlign: 'center', marginBottom: 10 }}>
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
              {/* The calendar offers 17 hours a week, three of the five days
                  being a single evening hour. For a good share of the people
                  who get this far, nothing on it is possible — and until now
                  the entire fallback was a mailto: link in the sidebar. */}
              <InboundForm kind="waitlist" done={waitlist} />
            </>
          ) : (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Online scheduling is being set up</h2>
              <p>
                The booking calendar goes live here shortly. In the meantime, email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> with a sentence about what
                you&rsquo;re looking for and a couple of times that suit you, and your
                consultation will be confirmed by reply.
              </p>
              <p>
                Already a client? Everything to do with sessions, payment and receipts lives
                in the <Link href={site.portalPath}>client portal</Link>.
              </p>
              {/* One row, primary first. These were two separate paragraphs,
                  which stacked them at ragged widths and put the action we
                  actually want above the fallback in source order but below it
                  on screen. */}
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
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">What happens in the 15 minutes</p>
          <Figure name="booking-payment-flow" />

          <h2>No intake forms, no pressure.</h2>
          <Figure name="first-session-flow" caption="The consultation is step one of four — and stopping after it is a normal outcome." />
          <div className="steps" style={{ marginTop: 26, maxWidth: 760 }}>
            <div className="step"><div className="step-num">1</div><div>
              <h3>You say what brought you here</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                As much or as little as you want. You do not need it organised, and you will not
                be asked to tell the whole story on a first call.
              </p>
            </div></div>
            <div className="step"><div className="step-num">2</div><div>
              <h3>You hear how the work would go</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Which approach fits what you&rsquo;ve described, what a session looks like, and
                roughly how often people usually meet. Questions are welcome — that&rsquo;s the point
                of the call.
              </p>
            </div></div>
            <div className="step"><div className="step-num">3</div><div>
              <h3>You decide, in your own time</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                If it feels like a fit, you can book a first session. If it doesn&rsquo;t, that is a
                completely fine outcome — and a referral in a better direction can be suggested.
              </p>
            </div></div>
          </div>
        </div>
      </section>

      {/* WHAT COMES AFTER THE CONSULTATION.
        *
        * The site described the consultation and the first session well and
        * said nothing about what follows. The unspoken question at the end of
        * a fifteen-minute call is not "was that useful" — it is "how much of my
        * life and money is this going to take", and leaving it unanswered is
        * one of the reasons a good consultation does not become a booking.
        *
        * Descriptive, never predictive. BCACC advertising standards prohibit
        * outcome claims, so nothing here says the work will help, how much or
        * how fast — only what the shape of it usually is. */}
      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '46rem' }}>
          <p className="eyebrow">If you carry on</p>
          <h2>What the first few sessions usually look like</h2>
          <p>
            Nobody asks this on the call and almost everybody wants to know it. There is no
            standard programme and no minimum number of sessions, and the shape below is a
            description of what commonly happens rather than a plan you are agreeing to.
          </p>
          <div className="steps" style={{ marginTop: 24 }}>
            <div className="step"><div className="step-num">1</div><div>
              <h3>Session one — the whole picture</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Fifty minutes on your history and what you want to be different. More listening
                than questions, and no requirement to start with the hardest thing.
              </p>
            </div></div>
            <div className="step"><div className="step-num">2</div><div>
              <h3>Sessions two and three — finding the pattern</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Working out what is actually keeping the thing going, rather than only how it
                feels. This is usually where something you have not named before gets named.
              </p>
            </div></div>
            <div className="step"><div className="step-num">3</div><div>
              <h3>Around session four — a deliberate check</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Is this working, is it the right approach, and is it the right person? Asked
                out loud rather than left to you to raise. Stopping here is a normal outcome
                and so is changing direction.
              </p>
            </div></div>
            <div className="step"><div className="step-num">4</div><div>
              <h3>After that — your call, every time</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Weekly at first for most people, then fortnightly, then further apart. Nothing
                is booked in advance beyond what you have agreed, there is no package, and
                pausing costs nothing.
              </p>
            </div></div>
          </div>
          <p style={{ marginTop: 22 }}>
            How long any of it takes depends on what you bring, and anybody who quotes you a
            number before meeting you is guessing.{' '}
            <Link href="/guides/how-long-does-therapy-take">How long therapy takes</Link> is the
            honest version, and{' '}
            <Link href="/guides/when-therapy-isnt-working">when therapy is not working</Link>{' '}
            covers what to do if it is not.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Before you book</p>
            <ul className="checklist">
              <li>Sessions are fully online, anywhere in {provinceList}</li>
              <li>Available in {languageList}</li>
              <li>Individual sessions are 50 minutes; couples sessions are 50 or 110</li>
              <li>Session fees and payment methods are set out on the <Link href="/pricing">fees page</Link></li>
              <li>Most BC extended health plans that cover RCCs will reimburse</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Not sure yet?</p>
            <p>
              If you&rsquo;d rather read first, the{' '}
              <Link href="/faq">frequently asked questions</Link> cover fees, confidentiality,
              and what a first session is actually like — or there is a full walkthrough of{' '}
              <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>.
              You can also browse{' '}
              <Link href="/services">the full list of services</Link> to see which approach
              matches what you&rsquo;re carrying, or read{' '}
              <Link href="/about">about your counsellor</Link> first.
            </p>
            <p>
              Prefer to ask a question before booking anything? The{' '}
              <Link href="/contact">contact page</Link> has an email address and a reply usually
              comes within one business day.
            </p>
            <div className="crisis" style={{ marginTop: 20 }}>
              <p style={{ margin: 0 }}>
                <strong>If you&rsquo;re in crisis:</strong> Westpeak Wellness is not a crisis
                service. Call or text <strong>9-8-8</strong> (Canada, 24/7) or BC Mental Health
                at <strong>310-6789</strong>. In immediate danger, call <strong>911</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <p className="eyebrow">Before and after the call</p>
          <h2>What you do not need to prepare</h2>
          <p>
            Nothing. There is no form to complete before a consultation, no history to assemble, and
            no requirement to have worked out what the problem is. &ldquo;Something is off and I do not
            know what&rdquo; is a completely ordinary opening, and a large share of consultations start
            somewhere close to it.
          </p>
          <p>
            You are also not expected to tell the whole story. Fifteen minutes is not enough for that
            and it is not what the call is for — it exists to establish whether the work would fit,
            not to begin it. If it helps to arrive with anything, one sentence on what is going on and
            one on how long it has been going on is more than sufficient.
          </p>

          <h2>What you might want to ask</h2>
          <p>
            The consultation goes both ways, and the more useful version of it has you asking
            questions rather than only answering them. What approach would you use for this and why.
            How would we know it was working. What do you not work with. What does it cost and is that
            the whole cost.{' '}
            <Link href="/guides/questions-to-ask-a-therapist">Questions worth asking a therapist</Link>{' '}
            sets out the full list along with the answers that should make you wary — every one of them
            is fair game here.
          </p>

          <h2>Deciding not to book is a normal outcome</h2>
          <p>
            A consultation that ends with &ldquo;this is not the right fit&rdquo; is a success, not a
            failure. Sometimes that means a different counsellor; sometimes it means a physician, a
            psychologist for a formal assessment, or a specialised service. The limits of what this
            practice does are listed openly on{' '}
            <Link href="/standards">standards and accountability</Link>, and being told one of them
            applies to you is a better result than a booking that was never going to help.
          </p>
          <p>
            If you would rather understand the shape of the whole thing before speaking to anyone,{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>{' '}
            covers the stage after the consultation,{' '}
            <Link href="/guides/how-long-does-therapy-take">how long therapy takes</Link> covers the
            commitment honestly, and <Link href="/pricing">fees and insurance</Link> covers the money.
            If cost is the obstacle,{' '}
            <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> lists the
            free and reduced-cost routes, several of which have no waitlist at all.
          </p>
        </div>
      </section>
    </>
  );
}
