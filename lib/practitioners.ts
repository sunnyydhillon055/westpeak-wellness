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

export type PractitionerPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
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
  /* A SET OF PHOTOS, PLACED BY ROLE — not one portrait repeated.
   *
   * The same face three times on one page reads as a stock template. Each of
   * these appears in one place and once:
   *
   *   portrait  the profile hero — the one people decide from
   *   warm      further down a long page, where a face restarts attention
   *   candid    the language and city pages, so those are not the hero again
   *
   * `alt` is written per photo and per placement rather than repeated. Alt
   * text that says the same thing four times is alt text nobody wrote. */
  photos?: {
    portrait: PractitionerPhoto;
    warm?: PractitionerPhoto;
    candid?: PractitionerPhoto;
  };
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
    /* BC AND ALBERTA — and the second one is now evidenced, not assumed.
     *
     * Her BMS/Berkley certificate (CCPA-00111023-001, policy BC05211-2506,
     * period 1 Oct 2025 – 1 Oct 2026, $5M per claim) was supplied on
     * 1 Sep 2026. Three things on it settle the Alberta question:
     *
     *   · it is a CCPA NATIONAL member policy — "active and practicing members
     *     of the Canadian Counselling and Psychotherapy Association" — with no
     *     provincial restriction anywhere on the certificate
     *   · the wording that does bound it is national: "Out of Country 90 days"
     *     and loss of earnings "Canada only"
     *   · her own named-insured address is in CALGARY, ALBERTA. A policy that
     *     did not cover Alberta would not cover her at her own desk.
     *
     * With counselling therapy unregulated in Alberta and her CCC current to
     * 2029, that is the gate in ALBERTA_LAUNCH_CHECKLIST.md satisfied for HER —
     * the checklist's own exit was "an insured clinician who can take Alberta
     * clients".
     *
     * IT IS NOT SATISFIED FOR THE PRACTICE. The founder's policy still does not
     * extend outside BC, so the site-wide /alberta section stays gated. Alberta
     * is unlocked per practitioner, not globally — see lib/practitioner-places.ts.
     *
     * This reads an insurance certificate; it is not insurance advice. If
     * certainty is wanted, BMS confirms scope in one email. */
    provinces: ['BC', 'AB'],
    languages: [
      { tag: 'en-CA', name: 'English', nativeName: 'English' },
      { tag: 'tl', name: 'Tagalog', nativeName: 'Tagalog' },
    ],
    photos: {
      /* The chin-in-hand frame, chosen by the owner as her main image: she is
         looking at the reader and listening, which is the whole proposition.
         The standing shot became the secondary. */
      portrait: {
        src: '/img/photo/camille-chin.jpg',
        /* Native size of the file supplied. Smaller than ideal for a hero on a
           retina screen — the originals were HEIC and arrived truncated, so
           these are the downsized copies. Replace with full-resolution exports
           and bump these numbers if it ever looks soft. */
        width: 462,
        height: 645,
        alt: 'Camille Granda, Registered Clinical Counsellor, seated and listening',
      },
      warm: {
        src: '/img/photo/camille-chair.jpg',
        width: 432,
        height: 652,
        alt: 'Camille Granda smiling, leaning forward in conversation',
      },
      candid: {
        src: '/img/photo/camille-granda.jpg',
        width: 1200,
        height: 1800,
        alt: 'Camille Granda, Tagalog- and English-speaking counsellor at Westpeak Wellness',
      },
    },
    /* HER VOICE, FIRST PERSON, AND THE SOURCE MATTERS.
     *
     * These are drawn from the marketing document Camille supplied — her own
     * framing, her own phrases ("you don't need to have everything figured out
     * before starting", "thoughtfully self-aware"). Kept in the first person
     * because a profile written about someone in the third person reads like a
     * directory entry, and this one has to read like her.
     *
     * Nothing here is invented on her behalf. If a line needs to change, it
     * changes to something she wrote. */
    tagline: 'Therapy in English or Tagalog, for people who have been holding it together for a long time.',
    intro: [
      'Most of the people I work with are doing fine on paper. They are capable, other people rely on them, and somewhere along the way managing became the same thing as being alright. It usually is not.',
      'I work with adults and young adults who are thoughtfully self-aware and ready to understand themselves better — even if they are not at all sure where to begin. You do not need the words for it yet.',
      'Sessions are collaborative and practical. We look at what is actually keeping the pattern going, and you leave with something you can use, not just something you understood in the room.',
      'I work in English and in Tagalog, and plenty of sessions move between the two. There is no need to explain your family before you can talk about them.',
    ],
    focus: [
      {
        label: 'Trauma',
        detail:
          'Difficult or overwhelming experiences, worked through at a pace you set — building safety and a sense of control first, rather than going straight at the hardest thing.',
      },
      {
        label: 'Anxiety and chronic stress',
        detail:
          'The patterns underneath high-functioning anxiety, perfectionism and burnout. The kind almost nobody around you can see, because you are still delivering.',
      },
      {
        label: 'Grief, loss and life transitions',
        detail:
          'Room for the changes you chose and the ones you did not — endings, identity shifts, and the uncertainty that arrives with them.',
      },
    ],
    suits: [
      'Anxious, overwhelmed, burnt out, or running on empty',
      'In the middle of a big change — a relationship, a move, a loss',
      'Carrying something from before that still shapes how you feel and how you are with people',
      'Tired of perfectionism, people-pleasing, or never quite feeling like enough',
      'Trying to make sense of yourself alongside culture, family expectations, and what got handed down',
      'Disconnected from your body, your feelings, or who you actually are',
      'Wanting better relationships and boundaries that hold',
      'Looking for someone who brings warmth and practical tools, not just listening',
    ],
    sessionNote:
      'You do not need to have everything figured out before you start. Sometimes knowing that something is not working any more is enough of a reason to begin.',
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
