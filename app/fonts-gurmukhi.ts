import { Noto_Serif_Gurmukhi } from 'next/font/google';

/* Gurmukhi lives in its own module, and that is the whole point of the file.
 *
 * next/font attaches its preload links per *module*, not per element: every
 * route that reaches a module gets a preload for every font declared in it.
 * app/layout.tsx imports app/fonts.ts for the global font variables, so while
 * this face was declared alongside the other two, all 105 routes preloaded and
 * fetched it — 13 kB each — no matter where `.variable` was actually applied.
 *
 * Verified on the deployed site before the split: /about, which renders no
 * Gurmukhi at all, was preloading f87f46f1033803fb-s.p.woff2 and paying for it.
 *
 * Declared here and imported only by the three pages that render ਪੰਜਾਬੀ, the
 * other 102 never see it.
 *
 * One weight: the script appears as a heading and as a decorative watermark,
 * and a second weight was ~14 kB for a distinction nobody would notice. */
export const gurmukhi = Noto_Serif_Gurmukhi({
  subsets: ['gurmukhi'],
  display: 'swap',
  variable: '--font-gurmukhi',
  weight: ['600'],
});
