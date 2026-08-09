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
  /* ---- Booking & payments (Cliniko) -----------------------------------
   * The practice runs on Cliniko, which is the single source of truth for
   * scheduling, payment and invoicing. Relevant capabilities, as configured:
   *
   *   · Online bookings can be embedded so the client never leaves this site.
   *   · The appointment type is set to "Require payment during booking", so
   *     the session is paid in full before the booking completes. Payment runs
   *     through the practice's own Stripe account; Cliniko never receives card
   *     details and neither does this website.
   *   · On payment, Cliniko creates the invoice and marks it paid. That is why
   *     no payment path is implemented here — a second one would not reconcile.
   *
   * IMPORTANT — this shapes the cancellation copy on /client-portal:
   * Cliniko disables the self-cancel link for appointments paid in full in
   * advance (self-serve cancelling only survives when a *deposit* was taken).
   * So the site must not promise self-serve cancellation. Free cancellation
   * inside the window is honoured by contacting the practice.
   *
   * TODO (owner): paste the Cliniko online-bookings URL, then flip
   * bookingReady. It looks like https://<practice>.cliniko.com/bookings
   */
  /* Fallback is the conventional Cliniko subdomain for this practice name and
   * is UNVERIFIED — see BUILD_LOG.md. It is used for the link-out only; the
   * calendar is embedded solely when NEXT_PUBLIC_CLINIKO_URL is set, because a
   * dead iframe on a live counselling site is worse than an honest notice. */
  bookingsUrl: process.env.NEXT_PUBLIC_CLINIKO_URL || "",
  bookingsFallbackUrl: "https://westpeakwellness.cliniko.com/bookings",
  bookingPath: "/book",
  portalPath: "/client-portal",
  /* While false, /book and /client-portal explain the process and route to
   * email instead of embedding a calendar that is not there yet. Do not set
   * true until bookingsUrl loads AND the appointment type requires payment. */
  bookingReady: Boolean(process.env.NEXT_PUBLIC_CLINIKO_URL),
  /* Hours of free cancellation. Put the same number in Cliniko's "terms of
   * use" for online bookings so clients agree to it as they book. */
  cancellationHours: 24,

  domain: CANONICAL,
  /* Where this build is actually reachable. Used only by robots.txt. */
  deployOrigin: DEPLOY,
  /* Vercel sets this on preview deployments only. Previews are excluded from
   * the index so a branch build can never compete with the real site. */
  isPreview: process.env.VERCEL_ENV === 'preview',
  /* Real bookable windows. This is the one source of truth for availability —
   * the footer, the portal and Cliniko must all agree, so change it here and
   * mirror it in Cliniko rather than editing any page directly. */
  availability: [
    { day: "Monday",   from: "9:00 am",  to: "12:00 pm" },
    { day: "Tuesday",  from: "4:00 pm",  to: "7:00 pm"  },
    { day: "Saturday", from: "10:00 am", to: "2:00 pm"  },
    { day: "Sunday",   from: "10:00 am", to: "2:00 pm"  },
  ],
  hours: "Mon 9–12 · Tue 4–7 · Sat & Sun 10–2",
  serviceArea: "Virtual counselling across British Columbia",
  languages: "English & Punjabi",
  languagesNative: "English · ਪੰਜਾਬੀ",
} as const;
