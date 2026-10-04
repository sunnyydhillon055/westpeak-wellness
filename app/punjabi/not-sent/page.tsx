import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import BookLink from '@/components/BookLink';
import { ogBase } from '@/lib/og-meta';
import { bookingFor, counsellorForLanguage } from '@/lib/booking-cta';

/* Where a refused message from the /punjabi form lands. 1 Oct 2026.
 *
 * /punjabi/sent is static and cannot read ?sent=, so from 25 Sep 2026, when
 * an enquiry began to require the three choices the /punjabi form does not
 * ask, every message sent from /punjabi was refused and the person was shown
 * a Punjabi heading saying it had arrived. lib/inbound-return.ts now sends a
 * refusal here instead (FAILED_PAGE), and this page never says it arrived.
 *
 * In English only. No new Punjabi wording is added without the counsellor
 * reading it first (the note on /punjabi), and a page that says something
 * went wrong is not the place to improvise it. Whether /punjabi should ask the
 * three choices at all is an owner decision and is not settled here.
 *
 * Static and noindex, like /punjabi/sent: it is reached only by posting a
 * form. */

const TITLE = 'Your message did not go through';
const DESC = 'The message from the Punjabi page was not sent. Email the practice or book a free consultation instead.';

export const metadata: Metadata = {
  openGraph: { ...ogBase('/punjabi/not-sent') },
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}/punjabi/not-sent` },
};

export default function PunjabiNotSentPage() {
  const who = counsellorForLanguage('pa');
  const book = bookingFor(undefined, 'pa').href;
  return (
    <div lang="en">
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container container--article">
          <p className="eyebrow">Message not sent</p>
          <h1>Your message did not go through.</h1>
          <p className="direct-answer">
            Nothing was received from the form, so no reply is on its way. Please email{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> directly
            {who ? <>, or book a free 15-minute consultation with {who.name}</> : <>, or book a free 15-minute consultation</>}.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs
            trail={[
              { name: 'Punjabi', path: '/punjabi' },
              { name: 'Message not sent', path: '/punjabi/not-sent' },
            ]}
          />
          <p style={{ marginTop: 20 }}>
            <a className="btn btn--primary" href={`mailto:${site.email}`}>Email {site.email}</a>
          </p>
          <p style={{ marginTop: 16 }}>
            <BookLink location="mid-language" href={book} className="btn btn--ghost">
              {who ? `Book a free consultation with ${who.name}` : 'Book a free consultation'}
            </BookLink>
          </p>
          <p style={{ marginTop: 24 }}>
            If you are in immediate danger call 911. For urgent mental-health support in BC at any
            hour, call or text 9-8-8.
          </p>
          <p style={{ marginTop: 24 }}>
            <Link href="/punjabi">Back to the Punjabi page</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
