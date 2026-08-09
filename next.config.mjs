// The 37 near-duplicate city pages retired in the Phase 1 SEO audit
// (see SEO_AUDIT.md §2). Kept here rather than imported from lib/locations.ts
// because next.config.mjs is loaded by Node and cannot import TypeScript.
const retiredCitySlugs = [
  'burnaby', 'richmond', 'coquitlam', 'langley', 'chilliwack', 'mission',
  'maple-ridge', 'delta', 'white-rock', 'new-westminster', 'north-vancouver',
  'west-vancouver', 'port-coquitlam', 'port-moody', 'pitt-meadows', 'nanaimo',
  'victoria-saanich', 'courtenay', 'campbell-river', 'duncan', 'parksville',
  'vernon', 'penticton', 'kamloops', 'west-kelowna', 'salmon-arm',
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
    ];
  },
};
export default nextConfig;
