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
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Preserve old Wix URLs so existing links / Google index don't 404
    return [
      // 37 near-duplicate city pages retired in the Phase 1 SEO audit.
      ...retiredCitySlugs.map((slug) => ({
        source: `/online-counselling/${slug}`,
        destination: '/online-counselling',
        permanent: true,
      })),
      { source: '/copy-of-new-page', destination: '/contact', permanent: true },
      { source: '/fees', destination: '/pricing', permanent: true },
      { source: '/copy-of-contact', destination: '/faq', permanent: true },
      { source: '/copy-of-fees', destination: '/services/individual-therapy', permanent: true },
      { source: '/copy-of-individual-2', destination: '/services/anxiety-counselling', permanent: true },
      { source: '/copy-of-individual-1', destination: '/services/trauma-therapy', permanent: true },
      { source: '/copy-of-individual', destination: '/services/emdr-therapy', permanent: true },
    ];
  },
};
export default nextConfig;
