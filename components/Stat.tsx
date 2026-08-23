import Link from 'next/link';

/* A number, given the room it earns.
 *
 * WHY THIS EXISTS
 *
 * The visual audit of 23 August found the site had no device for showing a
 * figure. That is a strange gap on a site whose whole argument is "here is a
 * checkable number and here is where to check it" — the strongest facts on it
 * were all buried mid-paragraph:
 *
 *   34,280   Punjabi mother tongue in Abbotsford, 22.6% of the city
 *   128,305  the same in Surrey, the largest of any city in Canada
 *   103      CMHA clients in Prince George across 519 appointments, 30 waiting
 *   $729     the 2026 weekly EI sickness cap
 *
 * Each one does more work than the sentence around it and none of them was
 * doing any of it visually.
 *
 * WHY IT CARRIES ITS SOURCE
 *
 * A big number with no attribution is the house style of every content-farm
 * health page on the internet, and this site's credibility rests on being the
 * opposite of that. `source` is not optional decoration — if a figure is worth
 * enlarging it is worth citing, and a reader who wants to check should not have
 * to hunt the footnotes. That is also why the link, when there is one, is the
 * source rather than a call to action: this component informs, it does not sell.
 */
export default function Stat({
  value,
  label,
  source,
  href,
  tone = 'default',
}: {
  /** The figure itself. Kept short — "34,280", "22.6%", "$729 a week". */
  value: string;
  /** What it counts, in a phrase. */
  label: string;
  /** Who published it. Required, on purpose — see the note above. */
  source: string;
  /** Where to verify it. External links open in a new tab. */
  href?: string;
  /** `quiet` for a figure that supports a point rather than making it. */
  tone?: 'default' | 'quiet';
}) {
  const external = href?.startsWith('http');
  const cite = href ? (
    external ? (
      <a href={href} rel="nofollow noopener" target="_blank">{source}</a>
    ) : (
      <Link href={href}>{source}</Link>
    )
  ) : (
    source
  );

  return (
    <figure className={`stat${tone === 'quiet' ? ' stat--quiet' : ''}`}>
      <div className="stat-value">{value}</div>
      <figcaption className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-source">{cite}</p>
      </figcaption>
    </figure>
  );
}
