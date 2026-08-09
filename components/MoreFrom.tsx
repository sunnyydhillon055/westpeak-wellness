import Link from 'next/link';

/* Deterministic sibling links.
 *
 * Every item in a collection links to the next three items in that collection,
 * cyclically. That guarantees each page receives at least three inbound links
 * from within its own cluster no matter how the curated `related` lists are
 * written — so a newly added page can never land as an orphan, which is what
 * happened the first time this site grew. */
export default function MoreFrom({
  items,
  currentSlug,
  base,
  heading,
  eyebrow,
}: {
  items: { slug: string; title?: string; name?: string; city?: string }[];
  currentSlug: string;
  base: string;
  heading: string;
  eyebrow?: string;
}) {
  const i = items.findIndex((x) => x.slug === currentSlug);
  if (i < 0 || items.length < 2) return null;

  const picks = [1, 2, 3]
    .map((k) => items[(i + k) % items.length])
    .filter((x, idx, arr) => x.slug !== currentSlug && arr.findIndex((y) => y.slug === x.slug) === idx);

  if (!picks.length) return null;

  const label = (x: { title?: string; name?: string; city?: string }) =>
    x.title ?? x.name ?? x.city ?? '';

  return (
    <section className="section section--ghost" style={{ paddingTop: 54, paddingBottom: 54 }}>
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 style={{ fontSize: '1.5rem' }}>{heading}</h2>
        <div className="chip-grid" style={{ marginTop: 18 }}>
          {picks.map((x) => (
            <Link className="chip" key={x.slug} href={`${base}/${x.slug}`}>
              {label(x)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
