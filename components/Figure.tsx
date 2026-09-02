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
  alt,
  hint,
  eager = false,
}: {
  name: string;
  caption?: string;
  /* Overrides for a page in another language. The figure's own alt and caption
     live in lib/figures.ts in English; a Tagalog page that used them would be
     an English caption under a translated diagram. */
  alt?: string;
  hint?: string;
  eager?: boolean;
}) {
  const f = getFigure(name);
  if (!f) return null;

  return (
    <figure className="figure">
      <div className="figure-scroll">
        <img
          src={`/img/${f.file}`}
          alt={alt ?? f.alt}
          width={f.width}
          height={f.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <p className="figure-hint" aria-hidden="true">
        {hint ?? 'Scroll the diagram sideways to see all of it.'}
      </p>
      {(caption ?? f.caption) && (
        <figcaption>{caption ?? f.caption}</figcaption>
      )}
    </figure>
  );
}
