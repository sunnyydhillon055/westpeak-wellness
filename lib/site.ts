/* The canonical origin. Defaults to the production domain; override with
 * NEXT_PUBLIC_SITE_URL if the canonical host ever changes. */
const CANONICAL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.westpeakwellness.com')
  .replace(/\/+$/, '');

/* The origin this particular deployment is actually served from. Until DNS is
 * moved, that is the Vercel URL rather than the canonical domain — and robots.txt
 * must advertise a sitemap on the host that really serves it, otherwise the
 * reference points at a host still running the old site. */
const DEPLOY =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : CANONICAL);

export const site = {
  name: "Westpeak Wellness",
  legalName: "Westpeak Wellness Counselling",
  tagline: "Counselling that meets you where you are.",
  // The counsellor's personal name lives ONLY in app/about/page.tsx.
  // Everywhere else the practice is referred to by name, or as
  // "your counsellor" / "a Registered Clinical Counsellor".
  counsellor: {
    credentials: "MA, RCC",
    title: "Registered Clinical Counsellor",
  },
  email: "info@westpeakwellness.com",
  instagram: "@westpeakwellness",
  instagramUrl: "https://www.instagram.com/westpeakwellness",
  // TODO: replace with the real Calendly link when ready.
  // Used ONLY on /book (the on-site booking page) — every CTA across the site
  // points at bookingPath, so the Calendly URL lives in exactly one place.
  bookingUrl: "https://calendly.com/westpeakwellness/consultation",
  bookingPath: "/book",
  // Flip to true once bookingUrl is the real Calendly link. This switches /book
  // from the "scheduling is being set up" notice to the live inline embed.
  bookingReady: false,
  domain: CANONICAL,
  /* Where this build is actually reachable. Used only by robots.txt. */
  deployOrigin: DEPLOY,
  /* Vercel sets this on preview deployments only. Previews are excluded from
   * the index so a branch build can never compete with the real site. */
  isPreview: process.env.VERCEL_ENV === 'preview',
  hours: "Mon–Fri: 9 AM – 7 PM · evenings by request",
  serviceArea: "Virtual counselling across British Columbia",
  languages: "English & Punjabi",
  languagesNative: "English · ਪੰਜਾਬੀ",
} as const;
