/* WHAT THE BROWSER MAY KNOW ABOUT THE PRACTICE — 16 Oct 2026 (item 599).
 *
 * lib/site.ts was imported by the header, the sticky bar, MailLink, /book's
 * island, the error boundary (through lib/error-routes.ts) and the leave-pay
 * embed, so the whole `site` object went to every visitor in the root
 * layout's chunk: the tagline, the legal name, the GA ID, the paid calendar
 * URL, the ICBC flag, and the founder's BCACC registration number. `grep -rl <her number> .next/static`
 * found it in five chunks, including one loaded on 64 routes and the
 * third-party calculator embed. A registration number belongs on its
 * counsellor's profile and nowhere else (scripts/expansion-verify.mjs).
 *
 * This file holds only what client components read. lib/site.ts builds the
 * full `site` from it, so each value is written once and the server copy
 * cannot drift from the browser's. A client component imports this file and
 * never lib/site; test/site-client.test.mts holds both rules.
 *
 * Adding a field: only if a 'use client' file reads it. Every byte here is
 * paid on every page (data/perf-budget.json, layoutJs). Any new process.env
 * read must also be inlined in next.config.mjs `env` (DECISIONS, 15 Oct). */

/* The canonical origin. Defaults to the production domain; override with
 * NEXT_PUBLIC_SITE_URL if the canonical host ever changes. */
export const CANONICAL_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.westpeakwellness.com')
  .replace(/\/+$/, '');

/* Cliniko online bookings. `ca1` is the Canadian shard — the account really is
 * westpeak-wellness.ca1.cliniko.com, not the westpeakwellness.cliniko.com that
 * was guessed here before it could be checked. */
export const CLINIKO_BOOKINGS = (
  process.env.NEXT_PUBLIC_CLINIKO_URL || 'https://westpeak-wellness.ca1.cliniko.com/bookings'
).replace(/\/+$/, '');

/* Cliniko appointment type IDs, each verified by loading its own filtered
 * booking URL and reading back the service name, price and duration — the DOM
 * order on the unfiltered page is not a safe thing to infer a mapping from, and
 * getting one wrong would put the wrong service on the wrong page.
 *
 *   2013349744314681520  Initial Consultation      $0     15 min (30 until 3 Oct 2026)
 *   1466854657459489533  Individual Counselling  $140     50 min
 *   1909558292636502700  Couples Counselling     $175     50 min
 *   2013350310713493681  Couples Extended        $340    110 min
 *   2013356655093221554  EMDR Intensive          $190     90 min
 *
 * `?appointment_type_id=` takes a comma-separated list and restricts the page to
 * exactly those services. It is what lets the public page offer the free
 * consultation and nothing else.
 *
 * Exported because it is the ONLY reliable way to tell a free consultation
 * from a paid session. lib/booking-notify.ts used to infer it from the
 * appointment's duration, which the /v1/appointments endpoint does not return
 * — see the note there. Identity comes from the appointment type.
 * scripts/booking-audit.mjs and scripts/booking-mapping.mjs read this line as
 * text; keep its shape. */
export const CONSULT_TYPE = '2013349744314681520';

/* THE BUSINESS ONLINE BOOKINGS ATTACH TO — 6 Sep 2026.
 *
 * Cliniko holds two "businesses": the founder's original one ("Westpeak
 * Wellness, Amandeep Bains", 1466854657870531165, with her registration
 * number and a White Rock street address on every booking summary), and the
 * practice itself ("Westpeak Wellness", 2029887882486877088), created when
 * the practice stopped being one person. Camille's availability and the
 * Stripe account are on the practice business, so that is the one every
 * public link names. Read off the public booking page's bookingsStart() call
 * rather than guessed, and the practice-wide URL carries it too so a bare
 * /book never lands on the founder's business by default. */
export const CLINIKO_BUSINESS = '2029887882486877088';

/* The free-consultation calendar (see `bookingsUrl` in lib/site.ts for why
 * /book is filtered to it). */
export const CONSULT_BOOKINGS_URL = `${CLINIKO_BOOKINGS}?business_id=${CLINIKO_BUSINESS}&appointment_type_id=${CONSULT_TYPE}`;

/* A counsellor's own booking calendar. Cliniko honours `practitioner_id` on
 * the public bookings URL and opens on that person's times ("Select a time
 * with Camille Granda"), which is what lets /book embed one counsellor's
 * calendar rather than a list that also shows one who is not taking new
 * clients. Still filtered to the free consultation, like site.bookingsUrl.
 * No id means the ordinary practice-wide consultation URL. Here rather than
 * in lib/site.ts because the error boundary (lib/error-routes.ts), which
 * ships with the root layout, builds these links in the browser. */
export const bookingsUrlFor = (practitionerId?: string): string =>
  practitionerId
    ? `${CONSULT_BOOKINGS_URL}&practitioner_id=${practitionerId}`
    : CONSULT_BOOKINGS_URL;

/* The practice's number, set 23 Sep 2026 by the owner; the env var still wins
 * if one is ever set. Notes in lib/site.ts. */
const PHONE = process.env.NEXT_PUBLIC_PHONE || '(604) 259-0810';

export const site = {
  name: 'Westpeak Wellness',
  email: 'info@westpeakwellness.com',
  phone: PHONE,
  phoneTel: (() => { const d = PHONE.replace(/[^+\d]/g, ''); return d.startsWith('+') ? d : `+1${d.replace(/^1/, '')}`; })(),
  bookingPath: '/book',
  portalPath: '/client-portal',
  bookingsFallbackUrl: CONSULT_BOOKINGS_URL,
  bookingReady: Boolean(CLINIKO_BOOKINGS),
  domain: CANONICAL_ORIGIN,
  languages: 'English, Punjabi & Tagalog',
  languagesNative: 'English · ਪੰਜਾਬੀ · Tagalog',
  /* The register, never a number: numbers live on each counsellor's own
     profile (lib/practitioners.ts). */
  counsellor: {
    registerUrl: 'https://bcacc.ca/search-our-member-register/',
  },
  /* See lib/site.ts ("ALREADY SURE? START WITH A FIRST SESSION"). */
  directFirstSession: false as boolean,
} as const;
