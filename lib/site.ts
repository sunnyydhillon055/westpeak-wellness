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
  domain: "https://www.westpeakwellness.com",
  hours: "Mon–Fri: 9 AM – 7 PM · evenings by request",
  serviceArea: "Virtual counselling across British Columbia",
  languages: "English & Punjabi",
  languagesNative: "English · ਪੰਜਾਬੀ",
} as const;
