/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Preserve old Wix URLs so existing links / Google index don't 404
    return [
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
