import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/* Web app manifest.
 *
 * Both /manifest.json and /site.webmanifest were answering 404 with the full
 * HTML error page. Next serves this at /manifest.webmanifest and emits the
 * matching <link rel="manifest"> itself, so there is one declaration rather
 * than a file plus a hand-written tag that can drift apart.
 *
 * This is not an attempt to make the site installable — a counselling practice
 * has no business being a home-screen app. What it does is let a browser, and
 * anything reading the site as an entity, resolve the practice's name, short
 * name and brand colour from a single declared source instead of guessing from
 * the <title>.
 *
 * `display: 'browser'` is deliberate: 'standalone' would strip the URL bar if
 * anyone did add it to a home screen, and on a page that discusses fees and
 * booking, hiding the address is the wrong call.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Online Counselling in BC`,
    short_name: site.name,
    description:
      'Online counselling across British Columbia with a Registered Clinical Counsellor. EMDR, trauma, anxiety, depression and couples therapy, in English or Punjabi.',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#fbfcfe',
    theme_color: '#3f6ca3',
    lang: 'en-CA',
    dir: 'ltr',
    categories: ['health', 'medical', 'lifestyle'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/img/logo.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
