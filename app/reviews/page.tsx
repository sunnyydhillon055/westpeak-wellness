import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { reviews, aggregate } from '@/lib/reviews';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';

const TITLE = 'Reviews and references | Westpeak Wellness';
const DESC =
  'Why this practice publishes no client testimonials, what can be verified instead, and how to check a counsellor’s registration in BC yourself.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/reviews` },
  openGraph: { title: TITLE, description: DESC, url: `${site.domain}/reviews` },
};

/* A page about the absence of testimonials.
 *
 * The obvious build here is an empty "reviews coming soon" shell. On a
 * counselling site that is worse than useless: it implies testimonials are on
 * their way, and they are not, because BCACC prohibits soliciting them from
 * clients. So this page explains the rule, sets out what can be verified
 * instead, and points at the public register — which is a stronger trust signal
 * than five stars from strangers, and one the reader can check themselves.
 */
export default function ReviewsPage() {
  const agg = aggregate();
  const hasReal = reviews.length > 0;
  const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': abs('/reviews'),
      name: TITLE,
      description: DESC,
      isPartOf: siteRef,
      about: orgRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Reviews', item: abs('/reviews') },
      ],
    },
    /* Review markup is emitted ONLY when genuinely non-client references exist.
     * Structured data asserting a rating nobody gave is fabrication a search
     * engine can act on, and this page exists partly to say so. */
    ...(hasReal
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: reviews.map((r, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Review',
                author: { '@type': 'Person', name: r.author },
                reviewBody: r.body,
                datePublished: r.datePublished,
                itemReviewed: orgRef,
                ...(r.rating
                  ? { reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 } }
                  : {}),
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container container--article">
          <p className="eyebrow">Trust</p>
          <h1>Reviews and references</h1>
          <p className="direct-answer">
            Westpeak Wellness publishes no client testimonials. That is not modesty and not an
            oversight: the BC Association of Clinical Counsellors prohibits soliciting them,
            because someone in a therapeutic relationship is not in a position to freely decline.
            What can be verified instead is below — and it is checkable by you rather than
            asserted by us.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container reading">
          <div className="prose">
            <Breadcrumbs trail={[{ name: 'Reviews and references', path: '/reviews' }]} />

            <h2 id="why-none">Why there are no client reviews here</h2>
            <p>
              A counselling relationship is not a symmetrical one. The person being asked for a
              public endorsement may still be in your care, may want to please you, or may simply
              find it hard to refuse a request from their counsellor. That is why the prohibition
              exists, and it does not depend on how the request is worded or how positive the
              review turns out to be.
            </p>
            <p>
              It follows that a counselling practice showing you a wall of five-star client
              reviews is telling you something — just not what it intends to. Worth knowing
              before you compare practices on that basis.
            </p>

            <Figure name="accountability-chain" />

            <h2 id="verify">What you can check instead, in about four minutes</h2>
            <ul className="checklist">
              <li>
                <strong>The registration.</strong> A Registered Clinical Counsellor appears on
                the BCACC register, which is public and searchable.{' '}
                <Link href="/resources/verify-a-counsellor-in-bc">How to verify a counsellor in BC</Link>{' '}
                walks through it, and it is worth doing before booking with anyone — here
                included.
              </li>
              <li>
                <strong>What the designation means.</strong>{' '}
                <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link>{' '}
                sets out the training, scope and limits behind each title. In BC,
                &ldquo;counsellor&rdquo; and &ldquo;therapist&rdquo; are not protected titles, so
                the designation is what carries a standard behind it.
              </li>
              <li>
                <strong>What this practice holds itself to.</strong>{' '}
                <Link href="/standards">Standards and accountability</Link> states the scope
                limits, what is deliberately not offered, and the complaints route — which runs
                to the association, not to us.
              </li>
              <li>
                <strong>How the writing here is produced.</strong>{' '}
                <Link href="/editorial-policy">The editorial policy</Link> covers sourcing and
                review, since the guides are what most people judge this practice on long before
                they speak to anyone.
              </li>
            </ul>

            {hasReal && (
              <>
                <h2 id="references">References</h2>
                {agg && (
                  <p>
                    {agg.value} out of 5 from {agg.count} rated{' '}
                    {agg.count === 1 ? 'review' : 'reviews'}.
                  </p>
                )}
                <div className="grid grid-2" style={{ marginTop: 20 }}>
                  {reviews.map((r) => (
                    <figure className="card review-card" key={r.author + r.datePublished}>
                      <blockquote>{r.body}</blockquote>
                      <figcaption>
                        <strong>{r.author}</strong>
                        <span>{r.relationship}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </>
            )}

            <h2 id="leaving-one">If you have worked with this practice</h2>
            <p>
              A public review is never requested and never solicited, for the reasons above. If
              you decide entirely on your own that you want to leave one, Google is the usual
              place, and there is no need to tell anyone here that you have.
              {googleUrl ? (
                <>
                  {' '}
                  <a href={googleUrl} target="_blank" rel="noopener nofollow">
                    The Google listing is here
                  </a>
                  .
                </>
              ) : null}
            </p>
            <p>
              Please leave out anything you would not want public. A review is visible to
              everyone, permanently, and it is not a confidential channel. Feedback meant for the
              practice is better sent to <a href={`mailto:${site.email}`}>{site.email}</a>, where
              it stays private and is considerably more useful.
            </p>

            <h2 id="deciding">Deciding without reviews</h2>
            <p>
              The honest substitute for a testimonial is a conversation.{' '}
              <Link href={site.bookingPath}>The free 15-minute consultation</Link> costs nothing
              and carries no obligation, and it will tell you more about fit than any number of
              strangers&rsquo; opinions.{' '}
              <Link href="/guides/how-to-find-a-therapist-in-bc">How to find a therapist in BC</Link>{' '}
              covers what to listen for, and{' '}
              <Link href="/faq">the frequently asked questions</Link> answer most of what people
              want to know before booking.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading="No testimonials. Just a conversation."
        text="Fifteen minutes, free, and no obligation to book anything afterwards."
      />
    </>
  );
}
