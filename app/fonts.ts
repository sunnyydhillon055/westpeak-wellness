import { Fraunces, Inter, Noto_Serif_Gurmukhi } from 'next/font/google';

/* Typography system.
 *
 * Fraunces for display: a variable serif with optical sizing and a SOFT axis,
 * which lets headings soften as they get larger rather than turning brittle.
 * It reads editorial and warm rather than institutional — the difference
 * between a clinic and a practice.
 *
 * Inter for body and UI: a humanist sans with a true weight range, chosen for
 * legibility at the long reading lengths this site actually has (many pages
 * run past 1,800 words).
 *
 * Noto Serif Gurmukhi so ਪੰਜਾਬੀ renders in a designed face rather than
 * whatever the operating system substitutes. On a site that offers sessions in
 * Punjabi, letting that script fall back to a default is a real omission.
 *
 * All three are self-hosted by next/font at build time — no render-blocking
 * request to Google, no layout shift, and `display: swap` with a matched
 * fallback so the first paint is never invisible. */

export const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600'],
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
});

/* Gurmukhi is deliberately NOT in the global font variables.
 *
 * It was loading on all 105 pages — 28 kB every time — for text that appears on
 * three of them. It is applied per page instead, via `gurmukhi.variable` on the
 * pages that actually render ਪੰਜਾਬੀ, so the other 102 never fetch it at all.
 *
 * One weight rather than two: the script appears as a heading and a decorative
 * watermark, and the second weight was ~14 kB for a distinction nobody would
 * notice. */
export const gurmukhi = Noto_Serif_Gurmukhi({
  subsets: ['gurmukhi'],
  display: 'swap',
  variable: '--font-gurmukhi',
  weight: ['600'],
});

export const fontVars = `${display.variable} ${body.variable}`;
