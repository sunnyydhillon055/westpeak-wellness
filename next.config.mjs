// The near-duplicate city pages retired in the Phase 1 SEO audit
// (see SEO_AUDIT.md §2). Kept here rather than imported from lib/locations.ts
// because next.config.mjs is loaded by Node and cannot import TypeScript.
//
// KAMLOOPS WAS REMOVED FROM THIS LIST ON 2026-08-18, AND THE WAY IT WAS FOUND
// IS THE REASON THIS COMMENT EXISTS.
//
// A real /online-counselling/kamloops page was written and shipped that day.
// It built correctly, appeared in .next/server/app, passed `npm run seo`, and
// scored 500/1000 — and in production it 308'd straight to /online-counselling,
// because a redirect declared here beats a route that exists. Nothing local
// catches that: `npm run build` does not exercise redirects, and a gate that
// scans built HTML finds a file that is genuinely there.
//
// It surfaced only from a curl against production after deploy. scripts/
// redirect-shadow.mjs now checks for it, and `npm run seo` runs it.
//
// So: BEFORE ADDING A PAGE WHOSE SLUG APPEARS BELOW, remove it from this list
// in the same change. And before adding a slug here, check no page owns it.
/* Burnaby, Langley and Chilliwack left this list on 2026-08-28, when real city
   pages were written for them in lib/locations.ts. A slug must never appear
   both here and there: that combination builds a page and then 308s it, which
   has already shipped once on this site and was reported as live off a green
   local gate. `npm run redirect-shadow` now fails the build on it. */
const retiredCitySlugs = [
  /* richmond, coquitlam, delta and nanaimo removed 31 Aug 2026 — each now has
     a deep page. A slug left here while a page exists produces a page that
     renders and 308s; `npm run redirect-shadow` fails the build on it. */
  'mission',
  /* 'white-rock' removed 31 Aug 2026: it now has a deep page. It is the one
     city where the practice holds a Google Business Profile, so a URL that
     308'd to the index was throwing away the only local entity it has. */
  'maple-ridge', 'new-westminster', 'north-vancouver',
  'west-vancouver', 'port-coquitlam', 'port-moody', 'pitt-meadows',
  'victoria-saanich', 'courtenay', 'campbell-river', 'duncan', 'parksville',
  'vernon', 'penticton', 'west-kelowna', 'salmon-arm',
  'fort-st-john', 'cranbrook', 'nelson', 'prince-rupert', 'terrace',
  'squamish', 'whistler', 'powell-river', 'sechelt', 'fort-langley', 'hope',
];

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

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Nothing here needs a camera, microphone or location.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* CRITICAL-CSS INLINING WAS TRIED HERE AND DOES NOT WORK — 2026-08-28.
   * experimental.optimizeCss (critters) was enabled and built cleanly, and
   * the prerendered App Router HTML came out unchanged: zero inlined style
   * blocks, the same four render-blocking stylesheet links. The optimisation
   * targets the pages router. Recorded so the next session doesn't spend a
   * build cycle rediscovering it; the render-path lever that DID measure out
   * is content-visibility on below-fold sections (globals.css). */
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // Preserve old Wix URLs so existing links / Google index don't 404
    return [
      // 37 near-duplicate city pages retired in the Phase 1 SEO audit.
      ...retiredCitySlugs.map((slug) => ({
        source: `/online-counselling/${slug}`,
        destination: '/online-counselling',
        permanent: true,
      })),
      // Retired audience page — the practice no longer publishes a men's page.
      { source: '/for/mens-mental-health', destination: '/for', permanent: true },
      { source: '/copy-of-new-page', destination: '/contact', permanent: true },
      { source: '/fees', destination: '/pricing', permanent: true },
      /* /answers retired 31 Aug 2026 at the owner's request: one FAQ, not two
         pages answering questions. It held 97 entries and 196 internal links,
         so it is redirected rather than deleted — the inbound equity and any
         external link land on /faq instead of a 404. */
      { source: '/answers', destination: '/faq', permanent: true },

      /* SERVICES REDUCED TO FIVE, 31 Aug 2026, at the owner's request:
         individual, couples, EMDR, family, and Punjabi-speaking.
         Six service pages retired. None are deleted — each 301s to the
         service that absorbed it, so the ranking equity and every inbound
         link land somewhere that answers the same question.

         Anxiety, depression and trauma are not "not offered". They are what
         individual counselling is FOR, and the page says so. Folding three
         thin pillars into one strong one is the point of the change. */
      { source: '/services/anxiety-counselling', destination: '/services/individual-therapy', permanent: true },
      { source: '/services/depression-counselling', destination: '/services/individual-therapy', permanent: true },
      { source: '/services/trauma-therapy', destination: '/services/individual-therapy', permanent: true },
      { source: '/services/emdr-intensive', destination: '/services/emdr-therapy', permanent: true },
      { source: '/services/south-asian-mental-health', destination: '/services/punjabi-counselling', permanent: true },
      { source: '/services/online-counselling-bc', destination: '/online-counselling', permanent: true },

      /* The 30 city x service pages built on the three retired services go to
         their CITY page rather than to individual-therapy. Someone searching
         "anxiety counselling in Surrey" wants Surrey kept, not swapped for a
         generic service page — the local intent is the more valuable half of
         that query. */
      ...['surrey', 'vancouver', 'burnaby', 'abbotsford', 'langley', 'chilliwack',
          'victoria', 'kelowna', 'kamloops', 'prince-george'].flatMap((city) =>
        ['anxiety-counselling', 'depression-counselling', 'trauma-therapy'].map((svc) => ({
          source: `/online-counselling/${city}/${svc}`,
          destination: `/online-counselling/${city}`,
          permanent: true,
        }))
      ),
      /* /blog was a 404. The guides engine already is the article stack —
         dated, Article-schema'd and internally linked — so this points at it
         rather than standing up a second one that would split topic authority
         and double the maintenance. */
      { source: '/blog', destination: '/guides', permanent: true },
      { source: '/blog/:slug', destination: '/guides/:slug', permanent: true },
      { source: '/copy-of-contact', destination: '/faq', permanent: true },
      { source: '/copy-of-fees', destination: '/services/individual-therapy', permanent: true },
      { source: '/copy-of-individual-2', destination: '/services/anxiety-counselling', permanent: true },
      { source: '/copy-of-individual-1', destination: '/services/trauma-therapy', permanent: true },
      { source: '/copy-of-individual', destination: '/services/emdr-therapy', permanent: true },

      /* Careers. Nobody reliably guesses "/careers" — people type /jobs, or
         /hiring, or whatever the last site they applied to used. Each of these
         costs nothing and closes a door that would otherwise be a 404, which
         matters most on the route where somebody retypes a URL from a screenshot
         or a forwarded message.

         /apply is a 307 rather than a 301 on purpose: it points at whichever
         role is currently open, so it must not be cached permanently against
         this one.

         THE RCC POSTING WAS CLOSED 2026-08-20, and that foresight is why this
         block needed so little changing. Everything that pointed at the posting
         now points at /careers, and every one of those is a 307 — the slug may
         be reused when the role reopens, and a 301 cached in a browser or an
         index would then send people away from the very page they wanted.
         /careers itself is unaffected: it was written to be useful when nothing
         is open. */
      { source: '/jobs', destination: '/careers', permanent: true },
      { source: '/job', destination: '/careers', permanent: true },
      { source: '/hiring', destination: '/careers', permanent: true },
      { source: '/join-us', destination: '/careers', permanent: true },
      { source: '/join', destination: '/careers', permanent: true },
      { source: '/work-with-us', destination: '/careers', permanent: true },
      { source: '/employment', destination: '/careers', permanent: true },
      { source: '/career', destination: '/careers', permanent: true },
      { source: '/vacancies', destination: '/careers', permanent: true },
      { source: '/careers/rcc', destination: '/careers', permanent: false },
      { source: '/jobs/:slug', destination: '/careers/:slug', permanent: true },
      { source: '/apply', destination: '/careers', permanent: false },
      { source: '/careers/apply', destination: '/careers', permanent: false },
      /* The closed posting. It was indexed and carried JobPosting markup, so
         sending it somewhere useful beats a 404 — /careers still explains the
         arrangement to anyone who arrives from an old link or a screenshot. */
      { source: '/careers/registered-clinical-counsellor', destination: '/careers', permanent: false },

      /* Keyword-shaped entry points. These are REDIRECTS, not pages, and that
         distinction is the whole point: a set of near-identical city or
         job-title pages for a single opening is a doorway-page pattern, and
         Google has penalised that for years. A redirect costs nothing, cannot
         be thin content, and still catches the URL somebody types after
         hearing about the role secondhand. */
      /* Both of these answered 404 with the full 40 kB HTML error page. Next
         serves the manifest at /manifest.webmanifest; these are the two paths
         browsers and crawlers try first. */
      { source: '/manifest.json', destination: '/manifest.webmanifest', permanent: true },
      { source: '/site.webmanifest', destination: '/manifest.webmanifest', permanent: true },

      /* THE /punjabi-counselling REDIRECT WAS REMOVED ON 2026-08-18.
         It read: "its hub is /services/punjabi-counselling, which already
         existed — standing up a second would cannibalise the first for the
         same query." That was reasonable when there was no hub at the bare
         prefix, and it stopped being true the moment one was built. The new
         hub 308'd to the service page in production while passing every local
         check, for the same reason the Kamloops page did.

         The two pages do different jobs and do not compete: the service page
         answers "what is Punjabi-speaking counselling", the hub answers "what
         is available where I live". The variants below still point at the
         service page, which is the right destination for them. */
      { source: '/punjabi-therapist', destination: '/services/punjabi-counselling', permanent: true },
      { source: '/punjabi-therapy', destination: '/services/punjabi-counselling', permanent: true },
      { source: '/punjabi-counsellor', destination: '/services/punjabi-counselling', permanent: true },

      { source: '/counselling-jobs', destination: '/careers', permanent: true },
      { source: '/counsellor-jobs', destination: '/careers', permanent: true },
      { source: '/therapist-jobs', destination: '/careers', permanent: true },
      { source: '/rcc-jobs', destination: '/careers', permanent: true },
      { source: '/counselling-careers', destination: '/careers', permanent: true },
      { source: '/work-here', destination: '/careers', permanent: true },
    ];
  },
};
export default nextConfig;
