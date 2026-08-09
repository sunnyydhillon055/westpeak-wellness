import { reviews, aggregate } from '@/lib/reviews';
import { orgRef } from '@/lib/schema';

/* Renders nothing when there are no reviews — not a placeholder, not a
 * "coming soon". A section that advertises its own emptiness reads worse than
 * its absence, and on a counselling site it invites exactly the testimonials
 * that must not be collected. See lib/reviews.ts. */
export default function Reviews({ heading = 'What colleagues say' }: { heading?: string }) {
  if (reviews.length === 0) return null;
  const agg = aggregate();

  const schema = {
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
  };

  return (
    <section className="section section--tint">
      <div className="container">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <p className="eyebrow">References</p>
        <h2>{heading}</h2>
        {agg && (
          <p className="lede">
            {agg.value} out of 5 from {agg.count} rated {agg.count === 1 ? 'review' : 'reviews'}.
          </p>
        )}
        <div className="grid grid-2" style={{ marginTop: 26 }}>
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
        <p className="avail-note">
          Westpeak Wellness does not publish client testimonials. BCACC standards prohibit
          soliciting them, because someone in a therapeutic relationship is not free to decline.
        </p>
      </div>
    </section>
  );
}
