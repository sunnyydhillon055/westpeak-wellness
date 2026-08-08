export type Comparison = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string;
  shortAnswer: string;
  updated: string;
  readMinutes: number;

  /** The comparison table — the reason someone landed here. */
  table: { columns: string[]; rows: string[][] };

  sections: { h2: string; body?: string[]; list?: { label: string; detail: string }[] }[];
  /** Soft, honest "where this practice fits" — never a hard sell. */
  howWeFit: string[];
  midCta: { text: string; label: string };
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: { href: string; label: string }[];
};

export const comparisons: Comparison[] = [
  {
    slug: "rcc-vs-psychologist-vs-social-worker-bc",
    title: "RCC, psychologist, or social worker: who should you see in BC?",
    metaTitle: "RCC vs Psychologist vs RSW in BC | Westpeak Wellness",
    metaDescription:
      "The real differences between an RCC, a psychologist, and a clinical social worker in BC — training, diagnosis, cost, coverage, and regulation.",
    eyebrow: "Comparison · Choosing a therapist",
    lede:
      "Three different letters after three different names, all offering something that looks like therapy. Here is what actually separates them in British Columbia.",
    shortAnswer:
      "If you want talk therapy, an RCC, a clinical social worker, and a psychologist can all provide it, and all three hold master's-level training or higher. The practical differences are diagnosis (psychologists and some clinical social workers can formally diagnose; RCCs cannot), formal assessments (psychologists only), cost (psychologists are typically the most expensive), and what your extended health plan happens to list.",
    updated: "2026-08-08",
    readMinutes: 7,
    table: {
      columns: ["", "Registered Clinical Counsellor (RCC)", "Registered Psychologist (R.Psych)", "Registered Clinical Social Worker (RCSW/RSW)"],
      rows: [
        ["Minimum training", "Master's in counselling or equivalent, plus supervised clinical hours", "Doctorate (PhD/PsyD/EdD) plus supervised practice and examination", "Master of Social Work, plus supervised hours for clinical registration"],
        ["Oversight in BC", "BCACC — a voluntary professional association, not a statutory college", "College of Health and Care Professionals of BC — statutory; \"psychologist\" is a protected title", "BC College of Social Workers — statutory; \"social worker\" is a protected title"],
        ["Can formally diagnose", "No", "Yes", "Clinical registration permits assessment and diagnosis of mental disorders"],
        ["Psychoeducational / cognitive assessments", "No", "Yes — the main thing only psychologists do", "No"],
        ["Typical BC private fee", "Roughly $120–$180 per session", "Roughly $225–$300+ per session", "Roughly $120–$180 per session"],
        ["Covered by MSP", "No", "No (outside public settings)", "No (outside public settings)"],
        ["Listed by extended health plans", "Commonly, but not universally — check the wording", "Almost always", "Commonly"],
      ],
    },
    sections: [
      {
        h2: "The regulation question — and what changes in 2027",
        body: [
          "This is the part most comparisons get wrong or leave out, so it is worth being precise.",
          "In British Columbia today, **counselling therapy is not a government-regulated profession**. \"Counsellor\" and \"therapist\" are not protected titles — legally, anyone may use them. \"Psychologist\" and \"social worker\" *are* protected, under their respective statutory colleges.",
          "The **RCC** designation is how counsellors have addressed that gap voluntarily. It is granted by the [BC Association of Clinical Counsellors](https://bcacc.ca), which is a professional association rather than a statutory college. To hold it, a counsellor must meet education and supervised-practice requirements, carry insurance, complete continuing education, and be bound by a code of ethics with a complaints process. It is real accountability — it just is not government accountability.",
          "**That is changing.** The Health Professions and Occupations Act replaced the old Health Professions Act on **1 April 2026**, and psychotherapy is being brought in as a regulated profession under the **College of Health and Care Professionals of BC**, with regulation of the profession beginning **29 November 2027**. It is a protected-title model, following the approach taken in New Brunswick, Nova Scotia, and PEI.",
          "**What this means for you right now:** until late 2027, the letters after someone's name are the main signal you have. An RCC, a CCC, or a clinical social worker has verifiable training, insurance, and somewhere to complain. Someone calling themselves a \"therapist\" with nothing after their name may be excellent — but there is no body you can check them against, and no process if something goes wrong. That is the distinction worth caring about, far more than which of the three registered designations you pick.",
        ],
      },
      {
        h2: "When the difference genuinely matters",
        list: [
          { label: "You need a formal diagnosis on paper", detail: "For disability benefits, academic accommodation, a workplace process, or a legal matter, you likely need a psychologist. An RCC cannot diagnose, and should tell you so rather than working around it." },
          { label: "You need psychoeducational or cognitive testing", detail: "ADHD assessments, learning-disability assessments, IQ testing — this is the one area only psychologists do, and it is usually a separate piece of work from ongoing therapy." },
          { label: "Cost is a real constraint", detail: "A psychologist can run twice an RCC's hourly fee. If your benefit cap is $800 a year, that is roughly three psychologist sessions or six with an RCC. For ongoing weekly therapy, that difference compounds fast." },
          { label: "Your plan only lists certain professions", detail: "Some plans reimburse psychologists and social workers but not RCCs. Read the actual wording before you book — this is the single most common source of unpleasant surprises." },
          { label: "You want a specific modality", detail: "EMDR, the Gottman Method, and most other approaches are training-based, not profession-based. Practitioners of any of the three designations may hold them. Ask about the training directly rather than inferring it from the letters." },
        ],
      },
      {
        h2: "What matters more than the designation",
        body: [
          "Across decades of psychotherapy research, one of the better predictors of whether therapy helps is the working relationship between client and therapist — how well you two fit, whether you feel understood, whether you can be honest. That is not determined by which of these three registers someone sits on.",
          "Which is why nearly every private practitioner in BC offers a free consultation. It exists precisely so you can test fit before spending money. Use it, and use it more than once if you need to — talking to two or three people before choosing is normal and slightly awkward and entirely reasonable.",
        ],
      },
    ],
    howWeFit: [
      "Westpeak Wellness is a Registered Clinical Counsellor practice, which places it in the first column: master's-level training, BCACC-bound, able to provide therapy but not formal diagnosis or psychoeducational assessment.",
      "So if what you need is an ADHD assessment or a diagnosis for a benefits claim, this is not the right door, and saying so on a consultation call takes about a minute. If what you need is ongoing therapy for anxiety, depression, trauma, or a relationship under strain — [particularly in Punjabi](/services/punjabi-counselling), where the options in BC are genuinely limited — then it may be.",
    ],
    midCta: {
      text: "Not sure which of the three you need? That is a reasonable thing to work out on a free 15-minute call, including if the answer is someone else.",
      label: "Book a free consultation",
    },
    faqs: [
      {
        q: "Is an RCC a \"real\" therapist?",
        a: "Yes. An RCC holds a master's degree in counselling or an equivalent field, has completed supervised clinical hours, carries professional liability insurance, completes ongoing continuing education, and is bound by the BCACC code of ethics with a formal complaints process. The distinction is that BCACC is a professional association rather than a government college — and that is changing, with psychotherapy regulation beginning in BC on 29 November 2027.",
      },
      {
        q: "Can an RCC diagnose anxiety or depression?",
        a: "No. Formal diagnosis in BC sits with psychologists, physicians, psychiatrists, and clinical social workers with the relevant registration. An RCC can absolutely work with anxiety or depression — they simply cannot put a diagnostic label on your file or produce documentation that depends on one.",
      },
      {
        q: "Why is a psychologist more expensive?",
        a: "Longer training — a doctorate rather than a master's — and a scope that includes formal assessment. It reflects the cost of the credential and the breadth of the scope, not a difference in how much someone cares about your outcome.",
      },
      {
        q: "Does MSP cover any of them?",
        a: "Not for private practice. BC's Medical Services Plan does not cover private counselling regardless of designation. Publicly funded mental-health services do exist through health authorities and are free at point of use, though wait times vary considerably by region.",
      },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors — regulation FAQs", url: "https://bcacc.ca/regulatory_faq/" },
      { label: "Province of BC — consultation to designate psychotherapy as a regulated health profession", url: "https://news.gov.bc.ca/releases/2024HLTH0070-000812" },
      { label: "Province of BC — health profession regulation", url: "https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/professional-regulation" },
      { label: "BC Laws — Psychologists Regulation (Health Professions Act)", url: "https://www.bclaws.gov.bc.ca/civix/document/id/loo64/loo64/442_99" },
      { label: "Kelty Mental Health — psychologists and registered clinical counsellors", url: "https://keltymentalhealth.ca/what-difference-between-psychologists-and-registered-clinical-counsellors" },
    ],
    related: [
      { href: "/guides/is-online-therapy-as-effective-as-in-person", label: "Is online therapy as effective as in-person?" },
      { href: "/pricing", label: "Fees and extended health coverage" },
      { href: "/services", label: "Counselling services offered across BC" },
      { href: "/faq", label: "Frequently asked questions about starting therapy" },
    ],
  },
  {
    slug: "individual-vs-couples-therapy",
    title: "Individual or couples therapy: which should you start with?",
    metaTitle: "Individual vs Couples Therapy | Westpeak Wellness",
    metaDescription:
      "When relationship difficulty is better addressed individually, when couples sessions make more sense, and when to do both.",
    eyebrow: "Comparison · Choosing a format",
    lede:
      "Relationship trouble does not automatically mean couples therapy — and starting in the wrong format wastes months.",
    shortAnswer:
      "Start with couples therapy when the problem lives in the pattern between you and both of you are willing to work on it. Start individually when what is driving the difficulty is largely yours to work on, when your partner is unwilling, or when something needs stabilising first. When there is ongoing violence or coercive control, couples sessions are not the safe starting point.",
    updated: "2026-08-08",
    readMinutes: 6,
    table: {
      columns: ["", "Individual therapy", "Couples therapy"],
      rows: [
        ["Who attends", "You", "Both partners, together"],
        ["What it works on", "Your patterns, history, reactions, and choices", "The pattern that happens between you"],
        ["Needs partner buy-in", "No", "Yes — it does not function with one willing participant"],
        ["Confidentiality", "Yours alone", "Shared; the relationship is effectively the client"],
        ["Typical session length", "50 minutes", "50 minutes, or a longer extended format"],
        ["Best when", "The difficulty is largely yours to work on, or your partner will not attend", "Both of you want change and keep failing to get there alone"],
        ["Not appropriate when", "Rarely — individual work is almost always available", "Ongoing violence or coercive control is present"],
      ],
    },
    sections: [
      {
        h2: "Start with couples therapy when…",
        list: [
          { label: "The same argument keeps happening", detail: "A recurring loop with predictable moves on both sides is the clearest indication for couples work — that pattern is difficult to change from one side alone." },
          { label: "You have drifted into logistics", detail: "Two competent people running a household with no remaining friendship. Common, unglamorous, and very responsive to structured work." },
          { label: "There has been a rupture and you both want to repair", detail: "An affair, a betrayal, a serious breach. Both words matter: both of you, and want." },
          { label: "You are facing a decision you cannot discuss", detail: "Children, moving, family obligation, money — where every attempt to talk about it ends badly." },
          { label: "You need clarity about whether to stay", detail: "A legitimate goal. Couples therapy is not obliged to produce a reconciliation, and a good practitioner will say so." },
        ],
      },
      {
        h2: "Start individually when…",
        list: [
          { label: "Your partner will not come", detail: "The most common reason. Individual work on a relationship is genuinely useful — changing your side of a pattern changes the pattern, sometimes enough that the other person becomes willing." },
          { label: "Something of yours needs attention first", detail: "Untreated trauma, depression, or addiction will limit what couples work can achieve. Sequencing it — or running both in parallel — usually gets further." },
          { label: "You do not know what you want", detail: "Working out whether you want to stay is often better done somewhere your partner is not in the room." },
          { label: "The pattern predates the relationship", detail: "If you recognise this dynamic from previous relationships, or from the house you grew up in, that points to individual work — see [intergenerational trauma](/guides/intergenerational-trauma-explained)." },
          { label: "You need somewhere entirely your own", detail: "Couples therapy is shared space. Sometimes what is needed first is space that is not." },
        ],
      },
      {
        h2: "The safety exception",
        body: [
          "This needs stating plainly. **Where there is ongoing intimate partner violence or coercive control, couples therapy is not the right starting point and can increase risk.** Sessions require honesty, and honesty is not safe when there are consequences afterward.",
          "A responsible practitioner screens for this — which is one reason a proper couples assessment includes individual sessions with each partner. If this is your situation, individual support and a specialist service are the safer route. **VictimLinkBC is available 24/7 at 1-800-563-0808**, and in immediate danger, call 911.",
        ],
      },
      {
        h2: "Doing both",
        body: [
          "The two are not mutually exclusive, and a common arrangement is couples sessions alongside individual therapy for one or both partners — usually with different counsellors, to keep the individual space genuinely separate and avoid the awkwardness of one practitioner holding private information from one partner.",
          "It costs more and it is often the most effective structure, particularly where the relationship difficulty and an individual difficulty are feeding each other. The [Gottman Method guide](/guides/how-the-gottman-method-works) covers what the couples side of that involves.",
        ],
      },
    ],
    howWeFit: [
      "Westpeak Wellness offers both [individual therapy](/services/individual-therapy) and [couples therapy](/services/couples-therapy) using the Gottman Method, virtually across BC. Because sessions are online, partners can even join from different locations when work makes that necessary.",
      "If you are unsure which to book, that is a reasonable thing to work out on the consultation call rather than in advance — and if the answer is individual therapy with someone else while couples work happens here, that is a fine outcome too.",
    ],
    midCta: {
      text: "Not sure which format fits? Fifteen minutes on a call usually settles it.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Can one counsellor do both our individual therapy and our couples therapy?", a: "Some practitioners will; many decline, and for good reason. Holding private individual information from one partner while also working with the couple creates a genuine conflict. Separate counsellors for individual work is the cleaner arrangement." },
      { q: "What if my partner refuses to come?", a: "Start individually. Relationship-focused individual therapy is real work, not a consolation prize — and partners who initially refuse sometimes reconsider once they see change rather than pressure." },
      { q: "Is couples therapy only for people in crisis?", a: "No. Couples who come before things are dire generally have an easier time of it. Arriving early is an advantage, not an overreaction." },
      { q: "Will the counsellor tell us to break up?", a: "No. That is not a counsellor's call. The work helps you both see the pattern clearly enough to make your own decision — whatever that turns out to be." },
    ],
    sources: [
      { label: "The Gottman Institute — research on couples", url: "https://www.gottman.com/about/research/" },
      { label: "VictimLinkBC — 24/7 support, 1-800-563-0808", url: "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/victimlinkbc" },
      { label: "HereToHelp BC — relationships and mental health", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/services/couples-therapy", label: "Couples therapy across BC" },
      { href: "/services/individual-therapy", label: "Individual therapy across BC" },
      { href: "/guides/how-the-gottman-method-works", label: "How the Gottman Method works" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
    ],
  },

  {
    slug: "cbt-vs-emdr-for-trauma",
    title: "CBT or EMDR for trauma: how they differ",
    metaTitle: "CBT vs EMDR for Trauma | Westpeak Wellness",
    metaDescription:
      "Two evidence-based trauma treatments compared — how each works, how much you have to talk, and which tends to suit what.",
    eyebrow: "Comparison · Trauma treatment",
    lede:
      "Both are recommended in clinical guidelines for PTSD. They get there by very different routes.",
    shortAnswer:
      "Trauma-focused CBT works through language — examining thoughts and beliefs about what happened, often with structured written or spoken exposure. EMDR works through reprocessing, using bilateral stimulation while you hold the memory in mind, and requires far less verbal description. Both are recommended for PTSD in major guidelines. The choice is usually about fit rather than efficacy.",
    updated: "2026-08-08",
    readMinutes: 6,
    table: {
      columns: ["", "Trauma-focused CBT", "EMDR"],
      rows: [
        ["Core mechanism", "Identifying and re-examining thoughts and beliefs; structured exposure", "Reprocessing memories with bilateral stimulation while holding them in mind"],
        ["How much you must describe", "Substantial — the work happens largely through language", "Considerably less; detailed narration is not required"],
        ["Homework between sessions", "Usually yes — thought records, structured practice", "Usually minimal; some journalling between sessions"],
        ["Session structure", "Agenda-led, collaborative, skills-oriented", "Eight-phase protocol with defined processing sets"],
        ["Guideline status for PTSD", "Recommended", "Recommended"],
        ["Often suits", "People who find it useful to talk things through and like structure and practice", "People who find describing it unbearable, or who understand it intellectually but still feel it"],
        ["Typical course", "Commonly 8–20 sessions for single-incident trauma", "Varies widely; single-incident may resolve in a handful of processing sessions"],
      ],
    },
    sections: [
      {
        h2: "The genuine difference: how much you have to say",
        body: [
          "For most people choosing between these, this is the deciding factor.",
          "**Trauma-focused CBT is a talking treatment in the fullest sense.** You examine what you believe about the event and about yourself because of it — *I should have stopped it*, *it was my fault*, *I cannot trust my judgement* — and test those beliefs against evidence. Structured exposure to the memory, written or spoken, is often part of it. It requires putting the experience into words, repeatedly.",
          "**EMDR requires far less of that.** Your counsellor needs enough to identify the target — an image, a belief, a body sensation, a distress rating — but the processing itself happens largely internally. You are not obliged to narrate what is passing through your mind. For people who have avoided therapy specifically because they cannot face describing what happened, this is frequently the deciding factor.",
        ],
      },
      {
        h2: "The head-versus-body gap",
        body: [
          "A pattern that shows up constantly in trauma work: people who fully understand, intellectually, that it was not their fault, and who still feel the whole weight of it.",
          "Where that gap is the main problem, EMDR is often the better-fitting tool, because it works on how the memory is stored rather than on what you consciously believe about it. Where the beliefs themselves are the live problem — persistent guilt, ongoing self-blame that has not been examined — CBT's direct engagement with those beliefs is well suited.",
          "This is a tendency rather than a rule. Plenty of people do well with either, and many courses of therapy end up drawing on both.",
        ],
      },
      {
        h2: "What matters more than the choice",
        body: [
          "Two things outrank the modality decision, and both get less attention than they deserve.",
          "**Stabilisation first.** Neither approach should begin processing before you have enough capacity to tolerate distress between sessions. If you are in an unsafe situation, in early substance-use recovery, or currently without much ground under you, the honest answer is often \"not yet\" regardless of which method is on offer. A practitioner proposing either in a first session, without knowing your history, is moving too fast.",
          "**Pacing.** Trauma work done too quickly can destabilise people, and that risk is identical across both approaches. Someone who checks in on how the last session landed, and slows down when the answer is bad, matters more than which protocol they were trained in.",
        ],
      },
    ],
    howWeFit: [
      "Westpeak Wellness offers [EMDR therapy](/services/emdr-therapy) and draws on CBT within broader [trauma therapy](/services/trauma-therapy) and [anxiety counselling](/services/anxiety-counselling). In practice most courses of work here are not purely one or the other — stabilisation skills first, then whichever processing approach fits what you are bringing.",
      "If what you actually need is a formal PTSD diagnosis for a benefits claim or a legal process, that requires a psychologist or physician rather than a counsellor — [the comparison of BC therapist types](/compare/rcc-vs-psychologist-vs-social-worker-bc) sets out why.",
    ],
    midCta: {
      text: "Unsure which fits what you are carrying? That is a good use of a free 15-minute call, before committing to either.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Can I do both?", a: "Yes, and it is common. CBT-derived skills are often used to build stability before EMDR processing, and many practitioners move between them depending on what a given piece of the work needs." },
      { q: "Which one is faster?", a: "EMDR has a reputation for being faster with single-incident trauma, and for some people it is. With complex or long-standing trauma both are slower, because most of the early work is stabilisation rather than processing." },
      { q: "Does EMDR work over video?", a: "Yes, using an on-screen moving target, alternating audio, or self-administered tapping. The guide on what EMDR is covers the adaptations in detail." },
      { q: "What if I have tried one and it did not help?", a: "Worth trying the other. It is also worth considering whether the issue was the modality, the pacing, or the fit with that particular practitioner — those are three different problems with three different fixes." },
    ],
    sources: [
      { label: "NICE — Post-traumatic stress disorder guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
      { label: "EMDR International Association — about EMDR therapy", url: "https://www.emdria.org/about-emdr-therapy/" },
      { label: "CAMH — trauma", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/trauma" },
    ],
    related: [
      { href: "/services/emdr-therapy", label: "EMDR therapy across BC" },
      { href: "/guides/what-is-emdr-and-how-a-session-works", label: "What is EMDR and how a session works" },
      { href: "/services/trauma-therapy", label: "Trauma therapy and trauma-informed care" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
    ],
  },
];

export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
