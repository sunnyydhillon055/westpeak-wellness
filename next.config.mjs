import { REDIRECTS } from './lib/redirects.mjs';

/* THE REDIRECT LIST MOVED TO lib/redirects.mjs ON 1 OCT 2026, with every
   comment that explained it (the Kamloops shadow, the retired services, the
   careers block). It moved so lib/indexnow.ts can read the same list; read
   that file before adding a redirect, and before adding a page whose slug a
   redirect already claims. */

/* THE VERCEL ALIAS IS A SECOND COPY OF THE SITE — 1 Oct 2026.
 *
 * westpeak-wellness.vercel.app answered 200 with `X-Robots-Tag: index,
 * follow` and advertised /llms.txt (curl, 1 Oct 2026), and a web assistant
 * sent a user there. It is redirected here rather than in middleware because
 * the middleware matcher is deliberately narrow: widening it to every path
 * would put an edge invocation in front of every page on every host to
 * serve one alias.
 *
 * The exact production alias only. A preview deployment has its own
 * generated host (westpeak-wellness-<hash>-<team>.vercel.app or a -git-
 * branch host), and it must keep serving its own build, or previews stop
 * being previews. Those get noindex in headers() instead. `has` values are
 * anchored regular expressions, hence the escaped dots.
 *
 * /api/ is left alone on purpose. Vercel's documentation gives the cron
 * target as the project's production deployment URL, which can be this very
 * host, and a cron request does not follow a redirect: a 308 here would stop
 * booking-mail and reply-watch without a single error anywhere. An API route
 * is not a page and has nothing to be indexed. */
const VERCEL_HOST = '.+\\.vercel\\.app';
const VERCEL_ALIAS_REDIRECT = {
  source: '/:path((?!api/).*)',
  has: [{ type: 'host', value: 'westpeak-wellness\\.vercel\\.app' }],
  destination: 'https://www.westpeakwellness.com/:path',
  permanent: true,
};

/* WHAT A MACHINE READER SHOULD BE TOLD IT CAN HAVE — 24 Sep 2026.
 *
 * Two alternates, on every page response. The Markdown twin of the page in
 * front of it, and the site's llms.txt. An HTTP Link header rather than a
 * <link> in the head, because per-page metadata in the App Router replaces
 * its parent's `alternates` wholesale — a page that sets its own canonical
 * would silently drop the announcement, and most pages here set one.
 *
 * One header carrying both, comma-separated, as RFC 8288 allows: two entries
 * with the same key are not reliably merged.
 */
const LINKS = (mdPath) => [
  `<${mdPath}>; rel="alternate"; type="text/markdown"`,
  '</llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt"',
].join(', ');

/** @type {import('next').NextConfig} */
/* Content Security Policy, built from what this site actually loads:
 *   - GA4 needs googletagmanager for the script, google-analytics for beacons
 *   - the Cliniko booking widget is an iframe, so it needs frame-src
 *   - Google sign-in posts to accounts.google.com
 *   - fonts are self-hosted, so no external font host is allowed at all
 *
 * 'unsafe-inline' on script-src is required by Next's inline bootstrap and by
 * GA4's snippet. Nonces would mean giving up static rendering on every page,
 * which costs more than it buys on a site with no user-generated content.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://*.cliniko.com https://accounts.google.com",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

/* Evaluated once, when the build loads this file, so it is the build time. */
const BUILT_AT = new Date().toUTCString();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Nothing here needs a camera, microphone or location.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  /* Vercel's static layer answers HTML with Access-Control-Allow-Origin: *,
     which nothing on this site needs — no page is fetched cross-origin.
     Pinning it to the canonical origin replaces the wildcard (a header set
     here wins over the platform default) without changing anything a browser
     does with a normal navigation. Measured 6 Sep 2026. */
  { key: 'Access-Control-Allow-Origin', value: 'https://www.westpeakwellness.com' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* /admin and the monthly report read the committed Search Console exports
   * and the change register from disk (lib/gsc-summary.ts,
   * lib/change-register.ts). The file tracer cannot see a directory read,
   * so the files are named here or the functions ship without them. */
  experimental: {
    outputFileTracingIncludes: {
      '/admin': ['./data/gsc/*-pages*.csv', './data/changes.json'],
      '/api/cron/funnel-report': ['./data/gsc/*-pages*.csv', './data/changes.json'],
    },
  },
  /* CRITICAL-CSS INLINING WAS TRIED HERE AND DOES NOT WORK — 2026-08-28.
   * experimental.optimizeCss (critters) was enabled and built cleanly, and
   * the prerendered App Router HTML came out unchanged: zero inlined style
   * blocks, the same four render-blocking stylesheet links. The optimisation
   * targets the pages router. Recorded so the next session doesn't spend a
   * build cycle rediscovering it; the render-path lever that DID measure out
   * is content-visibility on below-fold sections (globals.css). */
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      /* WHAT AN ANSWER ENGINE MAY QUOTE — 24 Sep 2026.
       *
       * The page-level <meta name="robots"> says index,follow and nothing
       * else, which leaves the snippet length to each engine's default. For
       * Google that default is a short text snippet, and AI Overviews and
       * Gemini's grounding both draw on what the snippet directives permit.
       * `max-snippet:-1` says: quote as much as you find useful. A practice
       * that wants to be the source an assistant cites has no reason to cap
       * it. An HTTP header rather than only a meta tag, because the Markdown
       * twins, llms.txt and the JSON record are not HTML and cannot carry a
       * meta tag at all.
       *
       * noindex pages are unaffected: X-Robots-Tag and the meta tag combine,
       * The private routes are excluded by name and given the opposite
       * directive instead. Google documents that the more restrictive of a
       * meta tag and a header wins, so a permissive header on a noindex page
       * would probably be harmless — and "probably harmless" is not a basis
       * on which to send `index, follow` for the staff inbox. Two rules, each
       * saying one thing, and the lookahead keeps them from both matching. */
      {
        source: '/:path(admin|signin|forgot|reset|client-portal|message-sent|one-pager-sent|search)/:rest*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/:path(admin|signin|forgot|reset|client-portal|message-sent|one-pager-sent|search)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/:path((?!admin|signin|forgot|reset|client-portal|message-sent|one-pager-sent|search).*)',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
        ],
      },
      /* NO VERCEL HOST IS AN INDEXABLE COPY — 1 Oct 2026. The rule above sent
       * `index, follow` from every host that serves this build, preview
       * deployments included. After it, so it wins for the same key: any
       * *.vercel.app host says noindex. The production alias is redirected
       * outright (see redirects() below) and never reaches this. */
      {
        source: '/:path*',
        has: [{ type: 'host', value: VERCEL_HOST }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      /* The Markdown twin of a page, announced on the page itself. A client
       * that prefers Markdown can find it without guessing the convention,
       * and one that does not will never notice the header.
       *
       * The homepage is separate because it has no slug: the general rule
       * produced `</.md>` for it, which is not a URL. Assets and the twins
       * themselves are excluded, or /x.md would advertise /x.md.md. */
      /* WHEN THE HTML LAST CHANGED, AND HOW LONG IT MAY BE KEPT — 25 Sep 2026.
       *
       * Every page is prerendered at build time, so the build's own timestamp
       * is an honest Last-Modified for all of them: nothing in the HTML can
       * have changed since. The Markdown twins, feeds and sitemaps compute a
       * more precise one of their own and are excluded so this cannot replace
       * it. The platform's static layer answers HTML with max-age=0, which
       * tells a crawler nothing about how long a copy is good for; sixty
       * seconds is short enough that a deploy is never noticeably stale and
       * long enough to say the page is cacheable at all. */
      {
        source: '/:path((?!api/|_next/)(?!.*\\.(?:md|xml|txt|json|ico|svg|png|jpg|jpeg|webp|avif|vcf|webmanifest)$).*)',
        headers: [
          { key: 'Last-Modified', value: BUILT_AT },
          { key: 'Cache-Control', value: 'public, max-age=60, must-revalidate' },
        ],
      },
      { source: '/', headers: [{ key: 'Link', value: LINKS('/index.md') }] },
      {
        source: '/:path((?!api/|_next/|admin|signin|forgot|reset|client-portal)(?!.*\\.(?:md|xml|txt|json|ico|svg|png|jpg|jpeg|webp|avif|vcf|webmanifest)$).+)',
        headers: [
          { key: 'Link', value: LINKS('/:path.md') },
        ],
      },
    ];
  },
  async rewrites() {
    /* THE MARKDOWN TWINS — 24 Sep 2026. See app/api/md/route.ts.
     * Any page URL with .md appended serves the same content as Markdown.
     * /index.md is the homepage, which has no slug of its own. */
    return [
      { source: '/index.md', destination: '/api/md/index' },
      { source: '/:slug(.*).md', destination: '/api/md/:slug' },
    ];
  },
  async redirects() {
    return [VERCEL_ALIAS_REDIRECT, ...REDIRECTS];
  },
};
export default nextConfig;
