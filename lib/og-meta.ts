import { site } from '@/lib/site';

/* THE OPEN GRAPH FIELDS EVERY PAGE SHOULD CARRY AND MOST DID NOT.
 *
 * app/layout.tsx sets a complete openGraph object - type, locale, url,
 * siteName, title, description. It reads as a site-wide default and it is not
 * one: Next replaces the whole `openGraph` object when a page declares its
 * own, rather than merging field by field. So every page that set a title and
 * a description silently dropped the locale and the site name, and every page
 * that set no `type` fell back to nothing rather than to 'website'.
 *
 * Measured on the build of 30 August 2026, before this file existed:
 *
 *   175 of 191 pages   no og:locale
 *    83 of 191 pages   no og:type
 *    13 of 191 pages   og:url pointing at the homepage rather than themselves
 *
 * The last of those is the one that actually misleads. A page inheriting the
 * root object inherits its `url`, so a link to /faq or /about pasted into
 * WhatsApp or Slack unfurled announcing the URL of the homepage - a card that
 * disagrees with the canonical tag on the same page about which page it is.
 *
 * Spread this first and override after:
 *
 *   openGraph: { ...ogBase(path), type: 'article', title, description }
 *
 * `url` is the argument rather than a default because that is the field that
 * was wrong, and a default it is possible to forget is how it got wrong.
 */
export function ogBase(path: string) {
  return {
    type: 'website' as const,
    locale: 'en_CA',
    siteName: site.name,
    url: path === '/' ? site.domain : `${site.domain}${path}`,
  };
}

/* Punjabi-language pages. og:locale is the language of the DOCUMENT, not of
   the audience, so this belongs only on pages actually written in Punjabi -
   /punjabi and its confirmation page - and not on the English pages about
   Punjabi-language counselling, which are the majority.
   `alternateLocale` names the other language the same content exists in, which
   is what tells a share card and a crawler these are a pair rather than two
   unrelated pages. */
export function ogBasePunjabi(path: string) {
  return { ...ogBase(path), locale: 'pa_IN', alternateLocale: ['en_CA'] };
}
