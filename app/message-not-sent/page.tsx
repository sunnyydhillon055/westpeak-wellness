import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';
import { askForTimeHref } from '@/lib/booking-cta';
import { MIN_WORDS } from '@/lib/sentences';
import { safePath, whyOf, whySentence } from '@/lib/inbound-return';

/* WHERE A REFUSED MESSAGE FROM A STATIC PAGE LANDS — 2 Oct 2026.
 *
 * The enquiry form on the seventeen city hubs posts returnTo=/message-sent,
 * a static page that cannot read ?sent= and so would tell a refused person
 * their message had arrived. lib/inbound-return.ts (FAILED_PAGE) sends any
 * state other than ok here instead, with the reason the route refused it
 * (?why=, from a fixed list of five words) and the page the form was on
 * (?from=, a same-site path checked by safePath). This page never says the
 * message arrived.
 *
 * Rendered on request, like /one-pager-sent, because it reads both. It is
 * reached only by posting a form, so being dynamic costs nothing a search
 * engine sees; noindex for /message-sent's reason.
 *
 * The way back links to the form's page with ?sent=err, so InboundForm puts
 * back what the person typed (it kept it in this tab's sessionStorage as the
 * form was sent). No outcome claims, no hours. */

const TITLE = 'Your message did not go through';
const DESC = 'The message was not sent. What to change, how to email the practice instead, and how to ask for a time.';

export const metadata: Metadata = {
  openGraph: { ...ogBase('/message-not-sent') },
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}/message-not-sent` },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export default function MessageNotSentPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const why = whyOf(one(searchParams?.why));
  const from = safePath(one(searchParams?.from), '');
  const back = from ? `${from}?sent=err${why ? `&why=${why}` : ''}#form` : '';
  return (
    <div>
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container container--narrow">
          <p className="eyebrow">Message not sent</p>
          <h1>Your message did not go through.</h1>
          <p className="lede">
            Nothing was received, so no reply is on its way. {whySentence(why, MIN_WORDS)}
          </p>
          {why === 'store' && (
            <p>
              Please write to <a href={`mailto:${site.email}`}>{site.email}</a> instead. It reaches the
              same people.
            </p>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container container--narrow">
          <Breadcrumbs trail={[{ name: 'Message not sent', path: '/message-not-sent' }]} />

          <div className="prose">
            {back && (
              <p>
                <Link className="btn btn--primary" href={back}>Back to the form</Link>{' '}
                In the same tab, what you typed is put back in the form, so nothing needs writing
                twice.
              </p>
            )}

            <h2>What the form asks for</h2>
            <ul>
              <li>An email address with an @ and a full domain, such as name@gmail.com.</li>
              <li>An answer to each of the three questions: what you are looking for, where you
                will be for sessions, and how soon you are hoping to start.</li>
              <li>A message of at least two sentences, about {MIN_WORDS} words, on what you are
                looking for.</li>
              <li>The message in the message box only, not repeated in the name or call-time
                boxes.</li>
            </ul>

            <h2>Other ways to reach the practice</h2>
            <p>
              Email <strong>{site.email}</strong> directly
              (<a href={`mailto:${site.email}`}>open your email app</a>). Or{' '}
              <Link href={askForTimeHref()}>ask for a time on the booking page</Link>, where the
              calendar shows real open times for a free 30-minute consultation.
            </p>

            <p>
              If you are in immediate danger call 911. For urgent mental-health support in BC at
              any hour, call or text 9-8-8.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
