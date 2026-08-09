import { getFigure } from '@/lib/figures';

/* Renders one of the site's own SVG diagrams.
 *
 * Intrinsic width/height are always emitted so the browser reserves the box
 * before the file arrives — no layout shift, which is the part of CLS that
 * images usually cost you. Alt text comes from the diagram's own <desc>, so it
 * describes what the picture shows rather than repeating the caption. */
export default function Figure({
  name,
  caption,
  eager = false,
}: {
  name: string;
  caption?: string;
  eager?: boolean;
}) {
  const f = getFigure(name);
  if (!f) return null;

  return (
    <figure className="figure">
      <div className="figure-scroll">
        <img
          src={`/img/${f.file}`}
          alt={f.alt}
          width={f.width}
          height={f.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <p className="figure-hint" aria-hidden="true">Scroll the diagram sideways to see all of it.</p>
      {(caption ?? f.caption) && (
        <figcaption>{caption ?? f.caption}</figcaption>
      )}
    </figure>
  );
}
