import { getImgProps, type ImageProps } from 'next/dist/shared/lib/get-img-props.js';
import * as loaderModule from 'next/dist/shared/lib/image-loader.js';
import type { ImageConfigComplete } from 'next/dist/shared/lib/image-config.js';

/* THE <img> next/image WOULD HAVE RENDERED, WITHOUT ITS CLIENT CHUNK — 15 Oct 2026 (item 542).
 *
 * In the App Router next/image is a client component, so every route with a
 * photograph downloaded chunk 3636 (15,479 B raw, 5,965 B gzip: the image
 * component, ImageConfigContext, AmpStateContext and a copy of lib/site) to
 * hydrate an element that never changes after the server renders it. 32
 * routes carried it, /book among them.
 *
 * Not `getImageProps` from 'next/image' either: that module's first lines
 * require the client image component, so importing it from a server file
 * still registers the client reference and the chunk ships anyway. This
 * calls the function getImageProps itself calls, with the same loader and
 * the same build-time image config (the define plugin replaces
 * process.env.__NEXT_IMAGE_OPTS in every compiled module, this one too), so
 * the src, srcset, sizes, width, height, loading, decoding and style are the
 * ones the component produced. data-nimg is added back because
 * scripts/quality-audit.mjs reads it to tell a fill image from a sized one.
 *
 * Plain data in, plain attributes out: no React, no hooks, safe to call from
 * a server component and to hand the result to a client one as a prop. */

export type { ImageProps };
export type ImgAttrs = Record<string, unknown> & { src: string; alt: string };

const CONF = process.env.__NEXT_IMAGE_OPTS as unknown as ImageConfigComplete | undefined;

/* The default loader, whichever way the CommonJS module was wrapped: the
   bundler hands its `default` export through, plain node (the tests) hands
   the whole module.exports as the default. */
type Loader = Parameters<typeof getImgProps>[1]['defaultLoader'];
const lm = loaderModule as unknown as { default: Loader | { default: Loader } };
const defaultLoader: Loader = typeof lm.default === 'function' ? lm.default : lm.default.default;

export function imgProps(p: ImageProps): ImgAttrs {
  const { props, meta } = getImgProps(p, {
    defaultLoader,
    imgConf: CONF as ImageConfigComplete,
  });
  const out: Record<string, unknown> = { ...props, 'data-nimg': meta.fill ? 'fill' : '1' };
  for (const [k, v] of Object.entries(out)) if (v === undefined) delete out[k];
  return out as ImgAttrs;
}
