import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Figure from '@/components/Figure';
import { StepsArt } from '@/components/Art';
import '@/app/art.css';
import Link from 'next/link';
import { site, bookingsUrlFor, RCC_PLAIN, CLINIKO_EMBED_PARAM } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import Breadcrumbs from '@/components/Breadcrumbs';
import MeasuredReply from '@/components/MeasuredReply';
import BookChoice, { type BookData, type BookPerson } from '@/components/BookChoice';
import { ogBase } from '@/lib/og-meta';
import { practitioners, defaultBookingPractitioner, withLetters, insuredProvinces, vancouverToday, type Practitioner } from '@/lib/practitioners';
import { PROVINCE_NAME, type Province } from '@/lib/crisis';
import { readCatalog, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { sessionFeesPhrase, sessionLengthsLine } from '@/lib/book-fees';
import { imgProps } from '@/lib/img-props';
import { FirstSessionRows } from '@/components/FirstSessionRow';
import { notTakingLine, WHO_FINDS_OUT, CAMERA_OPTIONAL } from '@/lib/practice-facts';
import { BEFORE_SESSION_ONE } from '@/lib/faq';

export const metadata: Metadata = {
  title: 'Book a Free 15-Minute Consultation',
  description:
    'A free 15-minute video call, with no card and no obligation. Online counselling anywhere in BC, in English, Punjabi or Tagalog.',
  alternates: { canonical: `${site.domain}/book` },
  openGraph: { ...ogBase(`/book`),
    title: `Book a Free 15-Minute Consultation | ${site.name}`,
    description: 'Free 15-minute consultation for online counselling anywhere in British Columbia.',
  },
};

/* STATIC SINCE 15 OCT 2026 (item 514).
 *
 * This page used to read ?with=, ?for= and ?sent= on the server and stream
 * three Cliniko reads, so it rendered per request: no edge cache, and five
 * render-blocking stylesheets, because scripts/inline-css.mjs only reaches
 * prerendered documents (curl, 15 Oct: `private, no-cache, no-store`,
 * X-Vercel-Cache MISS, 5 blocking links, 0 inlined blocks). It is now
 * prerendered as bare /book. Everything that depends on the address is
 * decided in the browser by components/BookChoice.tsx, from the plain data
 * built below, and the Cliniko lines come from /api/availability there.
 * What stays here is what the roster, the catalogue and the inbound store
 * say at build: the fees (from the catalogue, never typed), who is
 * accepting, who is insured where, the measured reply line and the
 * photographs. The history of each branch (1 Sep, 6 Sep, 8 Sep, 1 Oct,
 * 3 Oct) is kept beside the JSX in BookChoice, which carries the same
 * branches. */

/* THE /book COUNSELLOR CARDS, COMPACT ON A PHONE — 1 Oct 2026.
 *
 * Bare /book at 390px: the two cards were 407px and 339px tall and the second
 * "Book with" button sat at about 1,680px, three screens down. Under 520px
 * the portrait drops to 56px beside the name and languages, the focus line and
 * the availability run full width beneath, and the availability is the short
 * form (lib/book-card.ts). The inline styles these replace are classes now
 * because a media query cannot live in a style attribute; they are set here,
 * on the one page that uses them, rather than in app/premium.css, which is
 * inlined into every document on the site. */
const CARD_CSS = `
.bk-card{display:grid;grid-template-columns:96px minmax(0,1fr);gap:0 14px;align-items:center;text-decoration:none;color:inherit}
.bk-card__img{grid-row:1/span 3;width:96px;height:96px;object-fit:cover;object-position:top;border-radius:50%}
.bk-card h3{margin:0 0 2px;font-size:1.15rem}
.bk-card p.bk-card__meta,.bk-card p.bk-card__focus{margin:0;color:var(--ink-soft);font-size:.92rem}
.bk-card p.bk-card__focus{margin-top:4px;font-size:.9rem}
.bk-card .book-card-avail{grid-column:2}
.bk-card p.bk-card__open{margin:0;font-size:.9rem;line-height:1.5;color:var(--blue-deep);font-weight:600}
.bk-card__btn{grid-column:1/-1;justify-self:start;margin-top:14px}
.bk-short{display:none}
@media (max-width:520px){
.bk-card{grid-template-columns:56px minmax(0,1fr);gap:0 12px;padding:16px}
.bk-card__img{grid-row:auto;width:56px;height:56px}
.bk-card__focus,.bk-card .book-card-avail{grid-column:1/-1}
.bk-card h3{font-size:1.05rem;line-height:1.25}
.bk-card p.bk-card__meta,.bk-card p.bk-card__focus{font-size:.86rem;line-height:1.4}
.bk-card p.bk-card__focus{margin-top:8px}
.bk-card .book-card-avail{min-height:1.5em;margin-top:2px}
.bk-long{display:none}.bk-short{display:inline}
.bk-card__btn{justify-self:stretch;margin-top:8px}
}`;

const areaOf = (p: { provinces: string[]; reach?: 'canada' }) =>
  p.reach === 'canada' ? 'anywhere in Canada' : p.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ');

export default async function Book() {
  /* WHO ACTUALLY TAKES THE CONSULTATION — decided 6 Sep 2026: whoever on
     the roster is accepting. Nobody is the default (8 Sep): bare /book shows
     every accepting counsellor and the practice-wide calendar. */
  const accepting = practitioners.filter((p) => p.acceptingNewClients);
  const fallback = defaultBookingPractitioner();
  /* The fees, from the catalogue as it stands at build, through the same
     reader the streamed line used. Session lengths for the checklist come
     from the catalogue's known-good values, as before. */
  const catalog = await readCatalog();
  const today = vancouverToday();

  const person = (p: Practitioner): BookPerson => {
    const portrait = p.photos?.portrait;
    const shot = (sizes: string, extra: { alt?: string; className?: string; style?: CSSProperties }) =>
      imgProps({
        src: portrait!.src, alt: extra.alt ?? portrait!.alt, width: portrait!.width, height: portrait!.height,
        sizes, className: extra.className, style: extra.style,
      });
    const couples = p.services.includes('couples-therapy');
    return {
      slug: p.slug,
      name: p.name,
      letters: withLetters(p),
      languages: p.languages.map((l) => ({ name: l.name, tag: l.tag })),
      area: areaOf(p),
      cardArea: p.reach === 'canada' ? 'Anywhere in Canada' : p.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and '),
      ...(p.reach ? { reach: p.reach } : {}),
      focus: p.focus.slice(0, 3).map((f) => f.label).join(', '),
      bookable: p.bookable,
      couples,
      ...(p.clinikoPractitionerId ? { clinikoPractitionerId: p.clinikoPractitionerId } : {}),
      bookingsUrl: bookingsUrlFor(p.clinikoPractitionerId),
      /* Credential letters and verify links only; no registration number. */
      credentials: p.credentials.map((c) => ({ short: c.short, full: c.full, ...(c.verifyUrl ? { verifyUrl: c.verifyUrl } : {}) })),
      insured: insuredProvinces(p, today),
      ...(portrait ? {
        img: {
          row: shot('48px', { style: { width: 48, height: 48, flex: '0 0 48px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' } }),
          card: shot('96px', { alt: '', className: 'bk-card__img' }),
          wait: shot('72px', { style: { width: 72, height: 72, objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' } }),
        },
      } : {}),
      fees: sessionFeesPhrase(catalog, { services: p.services }),
      feesCouples: couples ? sessionFeesPhrase(catalog, { couples: true }) : null,
      lengths: sessionLengthsLine(FALLBACK_CATALOG, { services: p.services }),
      lengthsCouples: couples ? sessionLengthsLine(FALLBACK_CATALOG, { couples: true }) : null,
    };
  };

  /* WITH NO ?with=, THIS IS THE WHOLE PRACTICE, NOT THE FOUNDER: the
     provinces of everyone accepting; BookChoice takes the languages from
     site.languages. */
  const provinceList = accepting.some((p) => p.reach === 'canada')
    ? `${[...new Set(accepting.filter((p) => !p.reach).flatMap((p) => p.provinces))].map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ')}, or anywhere in Canada with ${accepting.filter((p) => p.reach === 'canada').map((p) => p.name.split(' ')[0]).join(' or ')}`
    : [...new Set(accepting.flatMap((p) => p.provinces))].map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ');

  const data: BookData = {
    accepting: accepting.map(person),
    others: practitioners.filter((p) => !p.acceptingNewClients).map((p) => p.slug),
    bare: {
      fees: sessionFeesPhrase(catalog, {}),
      lengths: sessionLengthsLine(FALLBACK_CATALOG, {}),
      provinceList,
      canadaWide: accepting.some((p) => p.reach === 'canada'),
      bookingsUrl: bookingsUrlFor(undefined),
    },
    /* Names nobody who is not accepting (item 361, lib/practice-facts.ts). */
    notTaking: notTakingLine(accepting.map((p) => p.name.split(' ')[0]!), fallback?.name.split(' ')[0]),
    cameraOptional: CAMERA_OPTIONAL,
    rccPlain: RCC_PLAIN,
    embedParam: CLINIKO_EMBED_PARAM,
    builtAt: Date.now(),
  };

  /* THE PUNJABI THREAD — 1 Oct 2026 (wf/book-and-cta). Reused verbatim from
     /punjabi, which has been reviewed; nothing here is newly composed
     Punjabi (test/book-page.test.mts). BookChoice places it once: under the
     heading when the chosen counsellor can be booked in Punjabi, otherwise
     in the notes below the calendar. */
  const punjabiLine = (
    <>
      <span className={gurmukhi.className} lang="pa">
        ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।
      </span>{' '}
      The consultation can be in Punjabi, English, or both.{' '}
      <Link href="/punjabi" lang="pa" className={gurmukhi.className}>ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ</Link>
    </>
  );

  return (
    <>
      {/* The compact card rules, for the bare page's two cards. */}
      <style dangerouslySetInnerHTML={{ __html: CARD_CSS }} />
      <BookChoice
        data={data}
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Book', path: '/book' }]} />}
        punjabiLine={punjabiLine}
        measured={<MeasuredReply />}
        firstSession={<FirstSessionRows people={accepting} />}
      >
        {/* ======================================================================
            WHAT WAS FOUR FULL SECTIONS (3 Sep 2026). Closed by default, and
            each summary is a real question rather than a heading. Native
            details, so it works with no JavaScript, and a browser's
            find-in-page opens one when the answer is inside it. Nothing here
            changes with ?with=, so it stays server-rendered.
            ====================================================================== */}
        <h2 style={{ marginTop: 0 }}>Before you decide</h2>
        {/* The whole path in three steps (15 Oct 2026). The drawing is
            decoration; the list under it says the same thing in text. */}
        <StepsArt
          steps={[
            'Book the free 15-minute consultation',
            'Meet by secure video',
            'Book sessions if you want to carry on',
          ]}
        />

        {/* Open by default: it is the question a booking summary with a
            street address on it raises, and the answer is one line. */}
        <details className="faq-item" open>
          <summary>Is this online or in person?</summary>
          <div className="prose">
            <p>
              Online. The consultation and every session are by secure video, from wherever you
              are sitting. There is no office and nowhere to attend; any address on a
              booking confirmation is the booking system&rsquo;s mailing record, not a place to go.
            </p>
          </div>
        </details>

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
              been going on, and what you want to be different.{' '}
              {/* Item 368: the paperwork before it, from lib/faq.ts. */}
              {BEFORE_SESSION_ONE}
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
          <summary>How does the video work, and where is my information held?</summary>
          <div className="prose">
            <p>
              The link arrives by email and opens in your browser: nothing to install, no account
              to create, and sessions are never recorded. {CAMERA_OPTIONAL} Bookings and records
              are held in Cliniko, in an account on its Canadian region.{' '}
              <Link href="/privacy">The privacy page</Link> names every service involved.
            </p>
          </div>
        </details>

        {/* Item 358: the question people from the workplace guides bring,
            read from lib/practice-facts.ts like /faq and /pricing. */}
        <details className="faq-item">
          <summary>Will my employer, insurer or family find out?</summary>
          <div className="prose">
            <p>{WHO_FINDS_OUT}</p>
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
      </BookChoice>
    </>
  );
}
