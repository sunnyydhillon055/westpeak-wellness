import Link from 'next/link';

/* A single contextual link, set as a rule across the reading column.
 *
 * The related links already exist on these pages, but only as a grid of chips
 * after the article has ended — which is both the least visually useful place
 * to put them and the least useful place for a reader, who has to finish
 * everything before being offered the thing that might have been what they
 * actually wanted.
 *
 * Pulling one of them into the body does two things at once: it gives the
 * middle of a long article a break that is not decoration, and it puts an
 * internal link in body content rather than in a footer-shaped block.
 */
export default function InlineRelated({
  href,
  label,
  kicker = 'Keep reading',
}: {
  href: string;
  label: string;
  kicker?: string;
}) {
  return (
    <aside className="inline-related">
      <span className="inline-related-kicker">{kicker}</span>
      <Link href={href}>
        {label}
        <span aria-hidden="true"> →</span>
      </Link>
    </aside>
  );
}
