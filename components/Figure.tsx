import { getFigure } from '@/lib/figures';

/* Renders one of the site's own SVG diagrams.
 *
 * Intrinsic width/height are always emitted so the browser reserves the box
 * before the file arrives — no layout shift, which is the part of CLS that
 * images usually cost you. Alt text comes from the diagram's own <desc>, so it
 * describes what the picture shows rather than repeating the caption.
 *
 * THE DIAGRAM OPENS FULL SIZE — 1 Oct 2026. At 390px only 54% of a 660px
 * diagram is visible in its sideways-scrolling box, and a drag was the only
 * way to see the rest. The image is now a link to the SVG itself, which a
 * phone opens at full size and lets the reader zoom. `repeats` marks a
 * diagram that says what a list on the same page already says; below 680px
 * it stands down, as the home page's process diagram already does. */
export default function Figure({
  name,
  caption,
  alt,
  hint,
  eager = false,
  repeats = false,
}: {
  name: string;
  caption?: string;
  /* Overrides for a page in another language. The figure's own alt and caption
     live in lib/figures.ts in English; a Tagalog page that used them would be
     an English caption under a translated diagram. */
  alt?: string;
  hint?: string;
  eager?: boolean;
  /** The page already says this as a list; hidden on phones. */
  repeats?: boolean;
}) {
  const f = getFigure(name);
  if (!f) return null;

  return (
    <figure className={repeats ? 'figure figure--repeats' : 'figure'}>
      <div className="figure-scroll">
        <a href={`/img/${f.file}`} target="_blank" rel="noopener">
          <img
            src={`/img/${f.file}`}
            alt={alt ?? f.alt}
            width={f.width}
            height={f.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </a>
      </div>
      <p className="figure-hint" aria-hidden="true">
        {hint ?? 'Tap the diagram to open it full size, or scroll it sideways.'}
      </p>
      {(caption ?? f.caption) && (
        <figcaption>{caption ?? f.caption}</figcaption>
      )}
    </figure>
  );
}
