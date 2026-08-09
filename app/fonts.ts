import { Fraunces, Inter } from 'next/font/google';

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

/* Gurmukhi is declared in app/fonts-gurmukhi.ts, not here.
 *
 * Keeping it in this module was not enough to keep it off the other pages:
 * next/font emits its preloads per module, and app/layout.tsx imports this file
 * for `fontVars`, so every route preloaded and fetched the Gurmukhi face
 * regardless of where `.variable` was applied. Splitting the module is what
 * actually scopes it. */

export const fontVars = `${display.variable} ${body.variable}`;
