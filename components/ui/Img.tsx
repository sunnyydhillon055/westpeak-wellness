import * as ReactDOM from 'react-dom';
import { imgProps, type ImageProps } from '@/lib/img-props';

/* A drop-in for next/image that renders on the server only — 15 Oct 2026 (item 542).
 *
 * Same props, same markup (lib/img-props.ts says how), and no client
 * component, so a page whose only reason to load chunk 3636 was a
 * photograph no longer loads it. With `priority` the image is preloaded the
 * way next/image preloads it in the App Router: react-dom's preload(), which
 * React hoists into the head as <link rel="preload" as="image"
 * imagesrcset imagesizes fetchpriority="high">, so the home and profile
 * heroes keep the head start their LCP was measured with.
 *
 * Not for a client component: there it would bundle the image helpers into
 * the browser. A client island takes imgProps() output as a prop instead
 * (components/BookChoice.tsx). */

type Preload = (href: string, o: Record<string, unknown>) => void;

export default function Img(p: ImageProps) {
  const a = imgProps(p);
  if (p.priority) {
    const preload = (ReactDOM as unknown as { preload?: Preload }).preload;
    preload?.(a.src, {
      as: 'image',
      imageSrcSet: a.srcSet,
      imageSizes: a.sizes,
      fetchPriority: 'high',
    });
  }
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...a} />;
}
