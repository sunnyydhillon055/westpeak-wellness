import Image from 'next/image';

/* Unified photography treatment.
 *
 * Every photograph on the site passes through this wrapper so they read as one
 * brand rather than as a collection of stock. The treatment is three layers:
 * a mild desaturation and contrast lift on the image itself, a blue-to-clay
 * gradient veil matching the palette, and the same fine grain used on large
 * surfaces — which is what stops a photo sitting on the page like a sticker.
 *
 * Sizing is explicit and the aspect ratio is set by a class, so the box is
 * reserved before the file arrives. That is the CLS-critical part.
 *
 * `priority` should be true for exactly one image per page — the LCP element. */
export default function Photo({
  src,
  alt,
  ratio = 'wide',
  priority = false,
  sizes = '(max-width: 860px) 100vw, 50vw',
  className,
  credit,
}: {
  src: string;
  alt: string;
  ratio?: 'wide' | 'tall' | 'square';
  priority?: boolean;
  sizes?: string;
  className?: string;
  credit?: string;
}) {
  return (
    <figure className={`photo photo--${ratio}${className ? ` ${className}` : ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={72}
      />
      {credit && <figcaption className="photo-credit">{credit}</figcaption>}
    </figure>
  );
}
