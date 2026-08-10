import Link from 'next/link';
import { breadcrumbs } from '@/lib/schema';

/* A breadcrumb trail — visible, and the BreadcrumbList that describes it.
 *
 * WHY BOTH COME FROM ONE COMPONENT. The site had BreadcrumbList markup on 87
 * pages and a visible trail on none. That is the arrangement Google's own
 * documentation warns against: the markup is meant to describe a trail the
 * visitor can see, and markup describing something absent is how structured
 * data stops being trusted. Emitting the two from one argument means they
 * cannot drift apart later either — there is no second place to update.
 *
 * `trail` is passed WITHOUT Home; it is always the first crumb, so no caller
 * can accidentally omit it or word it differently.
 *
 * The last crumb is the current page: rendered as text, not a link, and marked
 * aria-current="page". A link to where you already are is noise for everyone
 * and a small trap for screen-reader users.
 */
export default function Breadcrumbs({
  trail,
  className = '',
  schema = true,
}: {
  trail: { name: string; path: string }[];
  className?: string;
  /** Set false on pages that already emit their own BreadcrumbList as part of a
   *  larger graph. Two BreadcrumbList nodes on one page is not an error Google
   *  reports, which is exactly why it would go unnoticed. */
  schema?: boolean;
}) {
  const full = [{ name: 'Home', path: '/' }, ...trail];
  const last = full.length - 1;

  return (
    <>
      <nav aria-label="Breadcrumb" className={`crumbs ${className}`.trim()}>
        <ol>
          {full.map((c, i) => (
            <li key={c.path}>
              {i === last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.path}>{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs(full)) }}
        />
      )}
    </>
  );
}
