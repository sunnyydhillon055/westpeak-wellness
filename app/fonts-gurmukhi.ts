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
 * and a second weight was ~14 kB for a distinction nobody would notice.
 *
 * NOT PRELOADED — 1 Oct 2026. The split above held for a while, and then the
 * module was imported by the home page (one decorative word), by the service
 * page template (applied only on punjabi-counselling) and by the English
 * practitioner-place template (applied only in its Punjabi variant). A
 * preload is emitted per importing route, not per use, so 63 of the 305
 * built documents — the home page and every English city page for both
 * counsellors among them — were again fetching 13 kB of Gurmukhi before
 * first paint, for text they do not contain. With no preload the @font-face
 * still ships in the inlined stylesheet, scoped by unicode-range, and the
 * browser fetches the file only on a page that actually paints ਪੰਜਾਬੀ in
 * this face. The Punjabi pages lose nothing measurable: their CSS is inlined
 * in the document head, so the face is discovered at the same parse as the
 * preload would have been. */
export const gurmukhi = Noto_Serif_Gurmukhi({
  subsets: ['gurmukhi'],
  display: 'swap',
  variable: '--font-gurmukhi',
  weight: ['600'],
  preload: false,
});
