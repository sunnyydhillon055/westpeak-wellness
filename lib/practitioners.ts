/* ============================================================================
   THE PRACTITIONER ROSTER
   ----------------------------------------------------------------------------
   Added 1 Sep 2026, when the practice took on its first counsellor besides the
   founder.

   WHY THIS DOES NOT INCLUDE THE FOUNDER

   The owner's standing decision is that the founder's personal name appears
   nowhere on this site — enforced by `.name-guard` and check 8 in
   scripts/expansion-verify.mjs, which fails the build if it leaks. That is
   deliberate and unchanged. So this roster carries the counsellors who have
   agreed to be marketed by name, and /about continues to describe the practice
   rather than a person.

   That asymmetry is intentional, not an oversight. Do not "fix" it by adding
   the founder.

   EVERY FACT HERE CAME FROM A DOCUMENT

   Registration numbers, expiry dates and credentials were read from the
   BCACC membership card and CCPA record supplied on 1 Sep 2026. Nothing in
   this file is inferred, and nothing should be. A wrong registration number on
   a counselling site is the one error a prospective client can check in thirty
   seconds — and the whole trust argument on this site rests on numbers being
   checkable.

   PROVINCIAL SCOPE IS A SEPARATE QUESTION FROM CREDENTIALS

   A CCC is a national *certification*, not a licence to practise in another
   province. Counselling is regulated provincially and the service counts as
   delivered where the CLIENT sits. `provinces` below is therefore the list of
   places a practitioner may actually see clients, and it is deliberately
   narrow — see lib/regions.ts and ALBERTA_LAUNCH_CHECKLIST.md, where Alberta
   is gated on professional liability INSURANCE rather than on regulation.
   ========================================================================= */

export type Credential = {
  /** e.g. 'RCC' — shown after the name. */
  short: string;
  /** e.g. 'Registered Clinical Counsellor' */
  full: string;
  /** Awarding body, spelled out. */
  body: string;
  /** Registration or member number, exactly as issued. */
  number: string;
  /** Public register a stranger can check, if there is one. */
  verifyUrl?: string;
  /** ISO date the registration runs to, when the document states one. */
  validTo?: string;
};

export type Practitioner = {
  slug: string;
  name: string;
  /** Shown after the name: 'RCC, CCC'. Derived, but stated so it can be tuned. */
  postNominals: string;
  role: string;
  credentials: Credential[];
  /** Provinces where this person may actually see clients. BC unless proven. */
  provinces: string[];
  /** BCP 47 tags. The first is the language the profile is written in. */
  languages: { tag: string; name: string; nativeName: string }[];
  photo?: { src: string; width: number; height: number; alt: string };
  /** One line under the name. */
  tagline: string;
  /** 2–4 short paragraphs. Client-facing, not a CV. */
  intro: string[];
  /** Named areas of focus, each with a sentence of substance. */
  focus: { label: string; detail: string }[];
  /** "You may be…" — the situations this person is written for. */
  suits: string[];
  /** Practical facts for the booking decision. */
  sessionNote: string;
  /** Cliniko appointment types this person offers, by service slug. */
  services: string[];
  /** True once Cliniko has them bookable online. Gates the Book button. */
  bookable: boolean;
};

export const practitioners: Practitioner[] = [
  {
    slug: 'camille-granda',
    name: 'Camille Granda',
    postNominals: 'RCC, CCC',
    role: 'Registered Clinical Counsellor',
    credentials: [
      {
        short: 'RCC',
        full: 'Registered Clinical Counsellor',
        body: 'BC Association of Clinical Counsellors',
        number: '26894',
        verifyUrl: 'https://bc-counsellors.org/counsellors/',
        validTo: '2026-12-31',
      },
      {
        short: 'CCC',
        full: 'Canadian Certified Counsellor',
        body: 'Canadian Counselling and Psychotherapy Association',
        number: '11263060',
        verifyUrl: 'https://www.ccpa-accp.ca/',
        validTo: '2029-10-01',
      },
    ],
    /* BC ONLY, for now, and the reason is insurance rather than credentials.
       Her CCC would permit practice in provinces where counselling is not
       regulated — Alberta among them — but ALBERTA_LAUNCH_CHECKLIST.md records
       that the practice's professional liability policy does not extend
       outside BC, and that a live Alberta page produces bookings the policy
       may not cover. Adding 'AB' here is a one-word change once her insurance
       is confirmed to cover Alberta clients. It is not a judgement call to
       make on her behalf. */
    provinces: ['BC'],
    languages: [
      { tag: 'en-CA', name: 'English', nativeName: 'English' },
      { tag: 'tl', name: 'Tagalog', nativeName: 'Tagalog' },
    ],
    photo: {
      src: '/img/photo/camille-granda.jpg',
      width: 1200,
      height: 1800,
      alt: 'Camille Granda, Registered Clinical Counsellor at Westpeak Wellness',
    },
    tagline: 'Counselling in English or Tagalog, for people who have been holding it together for a long time.',
    intro: [
      'Camille works with adults and young adults who are thoughtful and self-aware, and who have reached the point where understanding themselves better is no longer optional. Most have been managing well from the outside for a long while.',
      'Sessions are collaborative and practical. The work looks at what is actually driving the pattern — the thoughts, the emotions, the behaviour underneath — and builds skills you can use, rather than insight you leave in the room.',
      'She practises in English and Tagalog, including moving between the two within a single session.',
    ],
    focus: [
      {
        label: 'Trauma',
        detail:
          'Working through difficult or overwhelming experiences while building safety, regulation, and a greater sense of control — at a pace you set.',
      },
      {
        label: 'Anxiety and chronic stress',
        detail:
          'The patterns underneath high-functioning anxiety, perfectionism and emotional exhaustion, which are frequently invisible to everyone else.',
      },
      {
        label: 'Grief, loss and life transitions',
        detail:
          'Space to process both expected and unexpected change — losses, identity shifts, and the uncertainty that comes with them.',
      },
    ],
    suits: [
      'Experiencing anxiety, overwhelm, burnout or emotional exhaustion',
      'Navigating a major life transition, relationship change, or loss',
      'Carrying experiences from the past that still affect how you feel, think, or relate to others',
      'Struggling with perfectionism, self-worth, people-pleasing, or feeling like you are never doing enough',
      'Trying to understand yourself within the context of culture, family expectations, identity, or intergenerational patterns',
      'Feeling disconnected from your body, your emotions, or your sense of self',
      'Wanting healthier relationships and more workable boundaries',
      'Looking for a therapist who offers both compassion and practical tools, rather than only listening',
    ],
    sessionNote:
      'You do not need to have everything figured out before starting. Sometimes knowing that something is not working any more is enough of a place to begin.',
    services: ['individual-therapy', 'emdr-therapy', 'family-counselling'],
    /* FALSE UNTIL CLINIKO IS SET UP. This gates the Book button on her pages,
       so the site cannot advertise a bookable slot that does not exist —
       which is the failure mode the whole booking-mail incident came from.
       Flip it after the Cliniko steps in CAMILLE_ONBOARDING.md are done. */
    bookable: false,
  },
];

export const getPractitioner = (slug: string) =>
  practitioners.find((p) => p.slug === slug);

/** Practitioners who speak a language other than English, for the language hubs. */
export const practitionersSpeaking = (tag: string) =>
  practitioners.filter((p) => p.languages.some((l) => l.tag === tag));
