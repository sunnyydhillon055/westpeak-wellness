/* ============================================================================
   THE PRACTITIONER ROSTER
   ----------------------------------------------------------------------------
   Added 1 Sep 2026, when the practice took on its first counsellor besides the
   founder.

   THE FOUNDER IS ON THIS ROSTER NOW, AND THAT IS A REVERSAL

   Her name was kept off this site entirely from 28 Aug 2026 — enforced by
   `.name-guard` and check 8 in scripts/expansion-verify.mjs. On 1 Sep 2026 the
   owner asked for a counsellor page for her, with the scope stated plainly:
   "keep it at one page for her total".

   So the guard was scoped rather than removed. Her profile may name her; the
   other ~185 pages still may not, and the build fails if the name appears on
   any of them. That preserves the reason the rule existed — the name was
   drawing search impressions in its own right — while doing what was asked.

   She gets ONE page. No city pages, no language pages, no roster of places.
   That asymmetry with Camille is deliberate and instructed; do not "fix" it.

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
  /* WHERE THIS CREDENTIAL CARRIES WEIGHT.
   *
   * A provincial college means everything in its own province and is a
   * curiosity outside it. Camille's Alberta pages led with "BC Association of
   * Clinical Counsellors", so the first thing an Albertan read about her was a
   * body with no standing where they live, while the national certification
   * that does apply there sat underneath it.
   *
   * Ordered per page from this, rather than by the order they happen to be
   * listed in. */
  scope: 'national' | 'provincial';
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
  /* IN HER OWN WORDS. Questions a person actually has before booking, answered
   * by the counsellor herself, first person, from a document she supplied.
   * Rendered as a Q&A on the profile and published as FAQPage schema, so an
   * answer engine can quote her rather than paraphrase her.
   *
   * Nothing here is written on her behalf. Trim, never invent; and nothing
   * that promises an outcome (BCACC advertising standards, see /standards). */
  voice?: { q: string; a: string[]; lang?: string }[];
  /** Cliniko appointment types this person offers, by service slug. */
  services: string[];
  /** True once Cliniko has them bookable online. Gates the Book button. */
  bookable: boolean;
  /* Cliniko's id for this practitioner. `?practitioner_id=` on the public
     booking URL pre-selects them, so /book can embed THEIR calendar rather
     than the practice's. Read off the public bookings page markup on
     6 Sep 2026 (data-practitioner-id) and confirmed by loading the filtered
     URL and reading "Select a time with Camille Granda" back. Absent means
     the unfiltered calendar. */
  clinikoPractitionerId?: string;
  /* WHETHER THIS PERSON IS TAKING NEW CLIENTS AT ALL.
   *
   * Separate from `bookable`, which is about Cliniko plumbing. This one is a
   * capacity decision the owner makes. Set false on 6 Sep 2026 for the
   * founder: every consultation request and every Book button on the site now
   * goes to whoever is accepting (see defaultBookingPractitioner below), and
   * her profile says so rather than offering a calendar she is not opening.
   *
   * Existing clients are unaffected — they book paid sessions through the
   * client portal, which does not read this. */
  acceptingNewClients: boolean;
  /* Whether this person gets per-city pages beneath their profile.
   *
   * False for the founder, at the owner's instruction on 1 Sep 2026 — "keep it
   * at one page for her total". Not an oversight and not a bug: the founder's
   * visibility is deliberately narrower than the counsellors she hires, which
   * is the same decision that kept her name off the site entirely until now. */
  placePages: boolean;
};

export const practitioners: Practitioner[] = [
  {
    slug: 'aman-bains-dhillon',
    name: 'Aman Bains Dhillon',
    postNominals: 'MA, RCC',
    role: 'Registered Clinical Counsellor · Founder',
    credentials: [
      {
        short: 'RCC',
        full: 'Registered Clinical Counsellor',
        body: 'BC Association of Clinical Counsellors',
        number: '20111',
        verifyUrl: 'https://bc-counsellors.org/counsellors/',
        scope: 'provincial',
      },
    ],
    provinces: ['BC'],
    languages: [
      { tag: 'en-CA', name: 'English', nativeName: 'English' },
      { tag: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    ],
    photos: {
      portrait: {
        src: '/img/photo/counsellor-portrait.jpg',
        width: 800,
        height: 1000,
        alt: 'Aman Bains Dhillon, Registered Clinical Counsellor and founder of Westpeak Wellness',
      },
    },
    tagline: 'Counselling in English or Punjabi, without having to explain the background first.',
    intro: [
      'I started Westpeak because too many people I knew were putting off therapy for reasons that had nothing to do with whether they needed it. The drive, the waiting room, the worry that someone would see them going in.',
      'I was born and raised in Surrey, in a household where mental health was rarely discussed openly and the weight of it was always there anyway. That shapes how I work. You should not have to explain your family before you can talk about them.',
      'My approach is warm and direct, and grounded in what the evidence actually supports rather than in one school of thought. We work at your pace, and I will tell you plainly if I think someone else is a better fit.',
    ],
    focus: [
      {
        label: 'Trauma and EMDR',
        detail:
          'EMDR-trained, for the experiences that are still shaping how you feel and react long after they ended.',
      },
      {
        label: 'Couples work',
        detail:
          'Gottman-trained. The patterns underneath the arguments, and what to do about the ones that will not resolve.',
      },
      {
        label: 'Culture, family and identity',
        detail:
          'South Asian family expectations, generational silence, and the space between who you are at home and everywhere else.',
      },
    ],
    suits: [
      'Anxious, low, or worn down and not sure why',
      'Carrying something from before that has not settled',
      'Stuck in the same argument with someone who matters',
      'Caught between what your family expects and what you want',
      'Wanting to work in Punjabi, or move between Punjabi and English',
    ],
    sessionNote:
      'The first fifteen minutes are free and there is no obligation attached to them. If it turns out I am not the right fit, I will say so and point you somewhere better.',
    services: ['individual-therapy', 'couples-therapy', 'emdr-therapy', 'punjabi-counselling'],
    /* Bookable: the practice's existing Cliniko types are hers. */
    bookable: true,
    /* Not taking new clients as of 6 Sep 2026, at the owner's instruction.
       The Cliniko calendar still exists for existing clients via the portal;
       nothing public offers it. */
    acceptingNewClients: false,
    /* ONE PAGE TOTAL. See the note on the field. */
    placePages: false,
  },
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
        scope: 'provincial',
      },
      {
        short: 'CCC',
        full: 'Canadian Certified Counsellor',
        body: 'Canadian Counselling and Psychotherapy Association',
        number: '11263060',
        verifyUrl: 'https://www.ccpa-accp.ca/',
        validTo: '2029-10-01',
        scope: 'national',
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
      'I work with adults and young adults who are thoughtfully self-aware and ready to understand themselves better, even if they are not at all sure where to begin. You do not need the words for it yet.',
      'Sessions are collaborative and practical. We look at what is actually keeping the pattern going, and you leave with something you can use, not just something you understood in the room.',
      'I work in English and in Tagalog, and plenty of sessions move between the two. There is no need to explain your family before you can talk about them.',
    ],
    focus: [
      {
        label: 'Trauma',
        detail:
          'Difficult or overwhelming experiences, worked through at a pace you set, building safety and a sense of control first, rather than going straight at the hardest thing.',
      },
      {
        label: 'Anxiety and chronic stress',
        detail:
          'The patterns underneath high-functioning anxiety, perfectionism and burnout. The kind almost nobody around you can see, because you are still delivering.',
      },
      {
        label: 'Grief, loss and life transitions',
        detail:
          'Room for the changes you chose and the ones you did not: endings, identity shifts, and the uncertainty that arrives with them.',
      },
    ],
    suits: [
      'Anxious, overwhelmed, burnt out, or running on empty',
      'In the middle of a big change, a relationship, a move, a loss',
      'Carrying something from before that still shapes how you feel and how you are with people',
      'Tired of perfectionism, people-pleasing, or never quite feeling like enough',
      'Trying to make sense of yourself alongside culture, family expectations, and what got handed down',
      'Disconnected from your body, your feelings, or who you actually are',
      'Wanting better relationships and boundaries that hold',
      'Looking for someone who brings warmth and practical tools, not just listening',
    ],
    sessionNote:
      'You do not need to have everything figured out before you start. Sometimes knowing that something is not working any more is enough of a reason to begin.',
    /* From "Counsellor Onboarding — Camille Granda", 3 Sep 2026, supplied by
       the owner on 6 Sep. Fourteen questions were answered; these are the ones
       that help somebody decide whether to book. Left out on purpose: the
       photo notes and the changed-my-mind essay (both good, neither a booking
       question), and her home-office and dog details are kept to a line. Her
       wording, lightly cut for length. */
    voice: [
      {
        q: 'What is it actually like to sit with you for an hour?',
        a: [
          'I want sitting with me to feel like the biggest belly breath you have ever taken. Like you can finally exhale and put some of what you have been carrying down for a while.',
          'I am warm, curious, and not overly clinical, though our time together is grounded in evidence-based approaches. I am not going to sit across from you silently taking notes while you wonder what I am thinking. I will laugh with you when things are funny, sit with you when things are heavy, and gently challenge you when I think it might help.',
          'My goal is for you to feel like you can show up exactly as you are: messy thoughts, contradictions, swear words, silence and all, without having to perform, have the right words, or explain yourself perfectly.',
        ],
      },
      {
        q: 'What do you do when someone starts crying, or goes completely silent?',
        a: [
          'I do not rush to fill the silence or try to make the crying stop. Sometimes the most therapeutic thing I can do is just stay with you. I might slow us down, check in with what you are noticing in your body, offer a grounding exercise, or simply let there be quiet.',
          'There is no pressure to explain what is happening before you are ready. Tears and silence are both communication, and neither makes me uncomfortable.',
        ],
      },
      {
        q: 'Will you make me talk about the worst thing before I am ready?',
        a: [
          'No. Especially in trauma-informed work, I do not believe healing comes from pushing someone past what their nervous system can manage. You are always allowed to say no, slow down, change direction, or tell me something feels like too much.',
          'Even with EMDR, we spend time building safety, resources and trust before moving toward difficult memories. You do not have to tell me every detail of what happened for us to work with how it is affecting you now.',
        ],
      },
      {
        q: 'Do people leave with something to do, or is it the hour and that is it?',
        a: [
          'Usually a bit of both. I do not believe therapy should feel like homework every week, but I do want what happens in the room to translate into your actual life. A session is one hour of your week; there is a lot of time outside it to chew on what I call food for thought.',
          'Some weeks you might leave with something concrete to practise, notice, journal about, or try differently. Other weeks the work is simply noticing what came up and letting your system process it. We decide together what would actually be useful rather than handing you a worksheet for the sake of having one.',
        ],
      },
      {
        q: 'How does someone know it is working, and roughly how long does it take?',
        a: [
          'I usually tell people to look for small shifts before they look for dramatic ones. Maybe you recover more quickly after being triggered. Maybe you notice a pattern before automatically reacting to it. Maybe you say no without explaining yourself for twenty minutes, or you realise you are speaking to yourself differently.',
          'There is not one timeline, because people come to therapy with very different histories and goals. Some people need focused, short-term support and others want deeper, longer-term work. I check in regularly about whether therapy is actually helping, and adjust when it is not.',
        ],
      },
      {
        q: 'My family thinks therapy is not for people like us. What would you say?',
        a: [
          'You do not need your family to understand therapy for you to be allowed to benefit from it.',
          'A lot of us grew up in families where private things stayed private. You dealt with problems yourself, kept going, and asking for help could feel uncomfortable, or even disloyal. But therapy does not have to mean blaming your family or rejecting where you came from. Sometimes it is simply about understanding what you inherited, deciding what you want to carry forward, and giving yourself permission to do some things differently.',
          'You can love your family and still choose yourself. You can honour where you came from and still choose a different way forward. Hindi kailangang mamili. You do not always have to choose one or the other. Sometimes healing is learning that there is room for both.',
        ],
      },
      {
        q: 'What do you find yourself saying most often?',
        a: [
          '“Two things can be true at the same time.” We are taught to sort our experiences into good or bad: anger is bad, confidence is good, grief is something to move past. When I say something is neither good nor bad, I am never minimising how deeply it may be affecting you. Pain is still pain. It is an invitation to take away some of the judgment, shame or pressure we attach to what we are feeling, and simply listen to it.',
          'You can love someone and need distance from them. You can understand why something happened and still be hurt by it. You can be scared and still choose something different.',
        ],
      },
      {
        q: 'How would you describe your training to someone who does not know what the letters mean?',
        a: [
          'My training combines traditional counselling psychology with trauma-focused and body-based approaches. I am trained to work with thoughts, emotions, relationships and behaviour, and I also pay attention to what is happening in the nervous system and body.',
          'I have pursued additional training in EMDR, somatic trauma therapy, polyvagal-informed work, trauma-informed yoga and relationship therapy. The letters after my name mainly mean that I have completed graduate-level counselling training and meet professional standards for ethical practice and ongoing education.',
        ],
      },
      {
        q: 'When are you not the right counsellor?',
        a: [
          'I am probably not the right counsellor if you are looking for a quick fix, a formula, or someone who will simply tell you what to do. I will absolutely offer ideas, tools, perspective and gentle challenge, but I see therapy as collaborative rather than prescriptive. My role is not to make decisions for you; it is to help you understand yourself more deeply and feel supported in making the choices that are right for you.',
          'I am also not the right fit if you are looking for a formal psychological diagnosis or assessment, which falls outside my scope as a clinical counsellor. If you need something I cannot provide, I will say so, offer a referral where I can, and help put together a plan for what comes next. Sometimes being the right counsellor means knowing when I am not.',
        ],
      },
      {
        q: 'What will I see when the video call opens?',
        a: [
          'A warm, neutral home-office space with a couple of degrees on the wall, some plants and soft lighting. Nothing clinical or distracting, just a comfortable, grounded space where you can exhale a little. You might see me with a little less makeup and dressed a little comfier than in my photos, and I encourage you to be too. Occasionally my cockapoo, Honey, makes a guest appearance.',
        ],
      },
      {
        q: 'Outside of the work, what keeps you well?',
        a: [
          'Movement, mostly. I have spent years practising and teaching yoga, and these days I love Pilates, walking, and surfing whenever I can. I am a huge foodie, I love travelling and trying new things, and more than anything I make space to be creative, curious and playful. There is some good science behind that: novelty, curiosity and play engage the systems involved in learning and reward, which is part of how the brain practises something different.',
        ],
      },
    ],
    /* Couples added 1 Sep 2026 at the owner's request. It was asked for when
       she was onboarded and never reached this array, so her profile listed
       three services while her Tagalog pages and her own "better relationships
       and boundaries" line both implied four. */
    services: ['individual-therapy', 'couples-therapy', 'emdr-therapy', 'family-counselling'],
    placePages: true,
    /* TRUE since 6 Sep 2026: she is on the public Cliniko booking page with
       her own practitioner id (below), and /book embeds her calendar directly.
       It was false until then so the site could not advertise a slot that did
       not exist — the failure mode the booking-mail incident came from. */
    bookable: true,
    clinikoPractitionerId: '2029879067058112997',
    acceptingNewClients: true,
  },
];

/* Who a consultation goes to when the reader has not asked for anyone in
 * particular, or has asked for someone who is not taking new clients. The
 * first practitioner on the roster who is accepting; undefined if nobody is,
 * in which case /book falls back to the practice-wide path and says so. */
export const defaultBookingPractitioner = (): Practitioner | undefined =>
  practitioners.find((p) => p.acceptingNewClients);

export const getPractitioner = (slug: string) =>
  practitioners.find((p) => p.slug === slug);

/** Practitioners who speak a language other than English, for the language hubs. */
export const practitionersSpeaking = (tag: string) =>
  practitioners.filter((p) => p.languages.some((l) => l.tag === tag));
