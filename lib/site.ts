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

/* Cliniko online bookings. `ca1` is the Canadian shard — the account really is
 * westpeak-wellness.ca1.cliniko.com, not the westpeakwellness.cliniko.com that
 * was guessed here before it could be checked. */
const CLINIKO_BOOKINGS = (
  process.env.NEXT_PUBLIC_CLINIKO_URL || 'https://westpeak-wellness.ca1.cliniko.com/bookings'
).replace(/\/+$/, '');

/* Cliniko appointment type IDs, each verified by loading its own filtered
 * booking URL and reading back the service name, price and duration — the DOM
 * order on the unfiltered page is not a safe thing to infer a mapping from, and
 * getting one wrong would put the wrong service on the wrong page.
 *
 *   2013349744314681520  Initial Consultation      $0     15 min
 *   1466854657459489533  Individual Counselling  $140     50 min
 *   1909558292636502700  Couples Counselling     $170     50 min
 *   2013350310713493681  Couples Extended        $340    110 min
 *   2013356655093221554  EMDR Intensive          $190     90 min
 *
 * `?appointment_type_id=` takes a comma-separated list and restricts the page to
 * exactly those services. It is what lets the public page offer the free
 * consultation and nothing else. */
const CONSULT_TYPE = '2013349744314681520';
const PAID_TYPES = [
  '1466854657459489533',
  '1909558292636502700',
  '2013350310713493681',
  '2013356655093221554',
].join(',');

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
   * Status: the bookings URL is live and wired (below). Requiring payment at
   * booking is the one part still outstanding — it needs the four paid
   * appointment types set to "Require payment during booking" in Cliniko, and
   * then NEXT_PUBLIC_CLINIKO_PAID=1 here.
   */
  /* The live Cliniko online-bookings page, verified serving 200 on 2026-08-09.
   *
   * Held here rather than in an environment variable on purpose. It is a public
   * URL that appears in the page source of every visitor — there is nothing to
   * keep secret — and putting it in the code means it works in local
   * development, needs no Vercel configuration, and cannot be silently lost by
   * a project being recreated. NEXT_PUBLIC_CLINIKO_URL still overrides it if the
   * account is ever moved. */
  /* Two filtered calendars, because the two pages serve different people.
   *
   * /book is public. It offers the free consultation and nothing else — an
   * unfiltered calendar there let a stranger book a $340 extended session with
   * no card taken, since Stripe is not connected yet. Filtering closes that
   * without needing Stripe first.
   *
   * /client-portal is behind sign-in and only reachable by current clients, who
   * already have a relationship and an invoicing arrangement. That is where the
   * paid work belongs. */
  bookingsUrl: `${CLINIKO_BOOKINGS}?appointment_type_id=${CONSULT_TYPE}`,
  bookingsPaidUrl: `${CLINIKO_BOOKINGS}?appointment_type_id=${PAID_TYPES}`,
  bookingsFallbackUrl: `${CLINIKO_BOOKINGS}?appointment_type_id=${CONSULT_TYPE}`,
  bookingPath: "/book",
  portalPath: "/client-portal",
  /* Two gates, not one, because the two pages promise different things.
   *
   * /book offers the FREE 15-minute consultation. Nothing is charged, so it can
   * embed the moment there is a URL.
   *
   * /client-portal is where an existing client books a PAID session, and the
   * site states plainly — on /pricing, in the FAQ, and in the booking-payment
   * diagram — that the card is taken at the moment of booking. Embedding a
   * calendar that takes a booking without taking payment would make all three
   * of those false. So the portal stays on its notice until Stripe is actually
   * connected and the paid appointment types are set to "Require payment
   * during booking".
   *
   * Set NEXT_PUBLIC_CLINIKO_PAID=1 at that point. Nothing else needs changing. */
  bookingReady: Boolean(CLINIKO_BOOKINGS),
  paidBookingReady:
    Boolean(CLINIKO_BOOKINGS) && process.env.NEXT_PUBLIC_CLINIKO_PAID === "1",
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
