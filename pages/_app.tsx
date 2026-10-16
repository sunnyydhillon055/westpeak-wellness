import type { AppProps } from 'next/app';
import '../app/globals.css';
import '../app/premium.css';

/* THE PAGES ROUTER EXISTS FOR ONE ROUTE — 15 Oct 2026.
 *
 * /embed/stress-leave-pay-calculator is the only page here. Everything else on
 * the site is in app/, under app/layout.tsx, which renders the header, the
 * footer, the phone booking bar, the consent banner and analytics around every
 * route; a nested layout cannot remove what the root layout renders, and
 * moving all of app/ into a route group to give the embed a second root layout
 * would touch every route on the site. A page in pages/ never passes through
 * app/layout.tsx, so the framed calculator carries none of that chrome and the
 * root layout's JavaScript does not grow by a byte.
 *
 * The same two stylesheets as the site, so the calculator looks as it does on
 * /tools. Do not add a page here without a reason as narrow as this one. */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
