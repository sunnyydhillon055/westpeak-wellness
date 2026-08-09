/* The canonical origin. Defaults to the production domain; override with
 * NEXT_PUBLIC_SITE_URL if the canonical host ever changes. */
const CANONICAL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.westpeakwellness.com')
  .replace(/\/+$/, '');

/* The origin this particular deployment is actually served from. Until DNS is
 * moved, that is the Vercel URL rather than the canonical domain — and robots.txt
 * must advertise a sitemap on the host that serves it, otherwise the
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
  /* ---- Booking & payments (Clio) --------------------------------------
   * The practice runs on Clio. Two distinct Clio surfaces are used, and they
   * are NOT the same URL:
   *
   *   schedulerUrl — Clio Scheduler (requires the Clio Grow add-on). A public
   *                  booking link that can be embedded on this site. Shows live
   *                  availability, and for a *paid* appointment type it takes
   *                  the card at the moment of booking. That is what makes
   *                  "paid before the session" true rather than aspirational.
   *
   *   portalUrl    — "Clio for Clients". The ongoing client portal: bills,
   *                  payment methods, documents, secure messages. Clio Payments
   *                  is live in Canada and stores cards PCI-compliantly.
   *
   * Nothing about payment is implemented on this website, deliberately. A
   * second payment path would not reconcile against Clio's own invoicing, and
   * this site is static with no server to take a card safely.
   *
   * TODO (owner): paste the two real URLs, then flip the *Ready flags.
   */
  schedulerUrl: "",
  portalUrl: "",
  bookingPath: "/book",
  portalPath: "/client-portal",
  /* Each flag gates one surface. While false the page explains the process and
   * routes to email rather than shipping a dead link. Do not set bookingReady
   * true until schedulerUrl loads AND the appointment type is set to take
   * payment; do not set portalReady true until portalUrl resolves. */
  bookingReady: false,
  portalReady: false,
  /* Hours of free cancellation. This is a practice policy the counsellor
   * applies — Clio Scheduler does not auto-charge late cancellations — so this
   * number and what the client is told must always agree. */
  cancellationHours: 24,

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
