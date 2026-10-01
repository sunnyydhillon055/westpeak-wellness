import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { readCatalog } from '@/lib/cliniko-catalog';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { acceptingCounsellors } from '../accepting';

export const revalidate = 3600;

const TITLE = 'Front-desk cards for clinics';
const DESC =
  'A printable sheet of four cut-out cards for a clinic, campus or agency front desk: the free consultation by secure video, no referral needed, and the crisis lines.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${site.domain}/refer/handout` },
  openGraph: { ...ogBase('/refer/handout'), title: `${TITLE} | ${site.name}`, description: DESC, url: `${site.domain}/refer/handout` },
};

/* THE FRONT-DESK CARD — added 1 Oct 2026.
 *
 * docs/OUTREACH.md offered clinics "a one-page summary for the front desk"
 * that did not exist. /refer/doctor is a sheet for a physician; this is the
 * thing a receptionist can hand across a counter: four identical cards on one
 * page, cut along the dashed lines.
 *
 * What a card may say is narrow on purpose. Facts a stranger can act on: the
 * consultation (its length and price read from the Cliniko catalogue, never
 * typed), that no referral is needed, the languages the accepting counsellors
 * work in (names only), the booking address and email, and that this is not a
 * crisis service. No hours, no phone number first, no outcome, no review.
 *
 * PRINT. Everything except the sheet is .no-print, and the sheet's own rules
 * below size four cards to fit inside one Letter or A4 page at the 14 mm
 * margin app/premium.css sets. The cards are .callout so they inherit the
 * print border, then get a dashed one here because they are meant to be cut.
 *
 * The booking link carries utm_source=clinic so a booking that started from a
 * card can be told apart from one that started from a search, without anyone
 * being identified: it marks the card, not the person. */
export default async function ClinicHandout() {
  const catalog = await readCatalog();
  const consult = catalog.items.find((i) => i.name.toLowerCase() === 'initial consultation');
  const minutes = consult?.minutes;
  const free = consult ? consult.cents === 0 : false;

  const accepting = acceptingCounsellors();
  const languages = [...new Set(accepting.flatMap((c) => c.languages))];
  const languageLine = languages.length
    ? languages.length > 1
      ? `${languages.slice(0, -1).join(', ')} or ${languages[languages.length - 1]}`
      : languages[0]
    : null;

  const host = site.domain.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const bookHref = `${site.bookingPath}?utm_source=clinic`;

  const consultLine = consult
    ? `${free ? 'A free ' : 'A '}${minutes ? `${minutes}-minute ` : ''}consultation by secure video.`
    : 'A consultation by secure video.';

  const Card = () => (
    <div className="callout handout-card">
      <p className="handout-name">{site.name}</p>
      <p className="handout-what">Counselling by secure video with a Registered Clinical Counsellor.</p>
      <ul>
        <li>{consultLine}</li>
        <li>No referral needed. You book it yourself.</li>
        {languageLine ? <li>Sessions in {languageLine}.</li> : null}
      </ul>
      <p className="handout-book">
        Book: <Link href={bookHref}>{host}/book</Link>
        <br />
        Questions: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p className="handout-crisis">
        Not a crisis service. In crisis, call or text 9-8-8, or call 310-6789. In danger, 9-1-1.
      </p>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPage({
              path: '/refer/handout',
              name: 'Front-desk cards for clinics, campuses and agencies',
              description: DESC,
              updated: COLLECTION_DATES['services'],
              type: 'WebPage',
            })
          ),
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `.handout-sheet{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:24px}
.handout-card{margin:0}.handout-card ul{margin:8px 0;padding-left:18px}.handout-card p{margin:6px 0}
.handout-name{font-weight:700;font-size:1.15em}.handout-crisis{font-size:.9em}
@media print{.handout-page .hero,.handout-page .section>.container>:not(.handout-sheet){display:none!important}
.handout-sheet{grid-template-columns:1fr 1fr!important;gap:6mm!important;margin:0!important}
.handout-sheet .handout-card{border:1pt dashed #000!important;height:112mm;overflow:hidden;font-size:10.5pt;padding:7mm!important}}`,
        }}
      />
      <div className="handout-page">
        <section className="hero no-print" style={{ paddingBottom: 32 }}>
          <div className="container container--narrow">
            <p className="eyebrow">For the front desk</p>
            <h1>Four cards to print and cut.</h1>
            <p className="lede">
              For a clinic, a campus wellness office or an agency: one page, four identical
              cards, for the person who asks whether there is a counsellor they can see.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 24 }}>
          <div className="container container--narrow">
            <Breadcrumbs
              trail={[
                { name: 'Passing it on', path: '/refer' },
                { name: 'Front-desk cards', path: '/refer/handout' },
              ]}
            />

            <div className="prose no-print">
              <p>
                Press Ctrl&nbsp;+&nbsp;P (&#8984;&nbsp;+&nbsp;P on a Mac) and print, or choose
                &ldquo;Save as PDF&rdquo;. Everything except the four cards drops away, and they
                fit one Letter or A4 page. Cut along the dashed lines.
              </p>
              <p>
                Nothing on the card needs a referral form or a phone call. The person books the
                consultation at {host}/book and the address on the card tells us only that it came
                from a card. A physician who wants the longer summary, with scope limits and fees,
                can have <Link href="/refer/doctor">the one-page sheet for doctors</Link>.
              </p>
            </div>

            <div className="handout-sheet" id="cards">
              <Card />
              <Card />
              <Card />
              <Card />
            </div>

            <div className="prose no-print" style={{ marginTop: 32 }}>
              <p>
                A counsellor whose own caseload is full can see who is accepting here at{' '}
                <Link href="/refer/counsellors">for counsellors with a full caseload</Link>. A
                clinic that wants a stack of these sent, or something worded differently, can
                write to <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="no-print">
        <CtaBand />
      </div>
    </>
  );
}
