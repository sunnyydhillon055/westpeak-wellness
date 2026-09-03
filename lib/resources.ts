import { moreResources } from './resources-more';

import { albertaResources } from './resources-alberta';

export type ResourceSection = {
  h2: string;
  body?: string[];
  list?: { label: string; detail: string }[];
  table?: { columns: string[]; rows: string[][] };
};

export type Resource = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string;
  shortAnswer: string;
  updated: string;
  readMinutes: number;
  sections: ResourceSection[];
  midCta: { text: string; label: string };
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: { href: string; label: string }[];
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
  figure2?: string;      // second diagram, further down the page
};

const coreResources: Resource[] = [
  {
    slug: "bc-extended-health-coverage-for-counselling",
    figure2: "therapy-cost-in-bc",
    figure: "reimbursement-flow",
    title: "Extended health coverage for counselling in BC",
    metaTitle: "BC Extended Health & Counselling | Westpeak Wellness",
    metaDescription:
      "Which BC extended health plans cover Registered Clinical Counsellors, how reimbursement works, and the exact wording to check first.",
    eyebrow: "Resource · Coverage",
    lede:
      "The single most common unpleasant surprise in private therapy is discovering afterwards that your plan does not list your counsellor's designation.",
    shortAnswer:
      "Most major BC extended health plans cover counselling by a Registered Clinical Counsellor, but not all of them do — some list only psychologists and social workers. Coverage is typically a dollar cap per calendar year, sometimes with a per-session limit. Direct billing is uncommon for RCCs, so in most cases you pay and submit a receipt. Check the exact wording of your plan before your first session.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "The one thing to check before anything else",
        body: [
          "Open your benefits booklet or member portal and find the paramedical services section. You are looking for which **designations** are named, not whether \"counselling\" or \"mental health\" appears.",
          "This matters because plans list professions, not services. A plan may cover \"Psychologist\" and \"Registered Social Worker\" and say nothing about Registered Clinical Counsellors — in which case sessions with an RCC are not reimbursable no matter how clearly they are counselling. If \"Registered Clinical Counsellor\" or \"RCC\" appears in that list, you are covered up to whatever limit applies.",
          "**If the wording is ambiguous, call the number on your benefits card and ask directly:** *\"Does my plan reimburse services from a Registered Clinical Counsellor, RCC, in British Columbia?\"* Get the answer before you book, and note who told you.",
        ],
      },
      {
        h2: "Insurers commonly seen in BC",
        body: [
          "The following are the insurers most often encountered by BC counselling clients. **Coverage is determined by your specific plan, not by the insurer** — two people with the same insurer can have entirely different benefits, because coverage is negotiated by the employer or plan sponsor.",
        ],
        table: {
          columns: ["Insurer", "Typically covers RCCs?", "Notes"],
          rows: [
            ["Pacific Blue Cross", "Commonly", "Very widely held in BC, including many public-sector plans"],
            ["Manulife", "Commonly", "Coverage and caps vary considerably by plan sponsor"],
            ["Sun Life", "Commonly", "Check whether the plan specifies a per-session maximum"],
            ["Canada Life", "Commonly", "Absorbed Great-West Life plans; older wording sometimes differs"],
            ["Green Shield Canada", "Commonly", "Often has a combined mental-health practitioner limit"],
            ["Desjardins", "Commonly", "Verify designation wording specifically"],
            ["Empire Life / Equitable / others", "Varies", "Smaller plan sponsors vary most — always verify"],
          ],
        },
      },
      {
        h2: "How the money actually works",
        list: [
          { label: "Annual maximum", detail: "Most plans set a dollar cap per calendar year for mental-health practitioners — commonly somewhere between a few hundred and a few thousand dollars. It usually resets on 1 January, not on your hire date." },
          { label: "Per-session limit", detail: "Some plans reimburse a set amount per session (say $80) rather than the full fee, so a $140 session leaves $60 out of pocket even while you have annual room left." },
          { label: "Percentage coverage", detail: "Some plans pay a percentage — 80% is common — rather than the full amount up to the cap." },
          { label: "Combined pools", detail: "Watch for a shared limit across practitioner types. If psychology, social work and counselling draw on one pool, seeing two practitioners halves your effective coverage." },
          { label: "Pay and submit", detail: "Direct billing is uncommon for RCCs in BC, so the usual pattern is that you pay the practice directly and submit the receipt. Most insurers now accept submission through an app, and reimbursement typically lands within days." },
          { label: "Health spending accounts", detail: "If your plan includes an HSA, counselling is generally an eligible expense even where the core plan does not list RCCs. This is the most commonly missed source of coverage." },
        ],
      },
      {
        h2: "What a receipt needs to contain",
        body: [
          "For reimbursement, a receipt generally needs to show the practitioner's full name and designation, their registration number, the practice name and contact details, the date of service, the amount paid, and the service description. A receipt missing the registration number is the most common reason a claim gets bounced back.",
          "If your claim is refused, ask the insurer specifically why. \"Practitioner type not covered\" is a definitive no. \"Insufficient information\" usually means the receipt was missing a field and can be resubmitted. It is worth the phone call — refusals are not always correct.",
        ],
      },
      {
        h2: "If you have no coverage",
        body: [
          "No extended health plan is a common situation, and it does not mean support is out of reach. Some BC practices keep a limited number of reduced-fee spots, so it is a reasonable question to ask any practitioner you are considering — policies vary, and you will not know without asking.",
          "There is also a substantial free and low-cost landscape in BC that people frequently do not know about, from health authority services to Foundry to post-secondary counselling. That is set out on the [free and low-cost counselling page](/resources/low-cost-counselling-bc).",
        ],
      },
    ],
    midCta: {
      text: "Not sure what your plan covers? Bring the question to a free 15-minute call — the receipt details can be confirmed before you commit to anything.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Does MSP cover counselling?", a: "No. BC's Medical Services Plan does not cover private counselling with any designation. Publicly funded mental-health services through health authorities are free at point of use, but they are a separate system from private practice — the difference is explained on the MSP and extended health page." },
      { q: "Is there GST on counselling?", a: "Counselling services provided by qualifying practitioners in Canada are generally exempt from GST/HST. Your receipt should reflect that." },
      { q: "Can I use my spouse's plan too?", a: "Often yes. Coordination of benefits lets you claim the remainder from a second plan after the first pays its share, which can effectively double your annual coverage. Many couples never realise this is available." },
      { q: "Do virtual sessions get covered the same as in-person?", a: "Nearly always yes. Insurers overwhelmingly treat a virtual session with a covered practitioner identically to an in-person one. If your plan is unusually old, it is worth confirming." },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors — about RCCs", url: "https://bcacc.ca/" },
      { label: "Province of BC — Medical Services Plan coverage", url: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp" },
      { label: "HereToHelp BC — paying for mental health care", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/pricing", label: "Fees and payment" },
      { href: "/resources/msp-vs-extended-health", label: "MSP vs extended health: what covers what" },
      { href: "/resources/low-cost-counselling-bc", label: "Free and low-cost counselling in BC" },
      { href: "/compare/rcc-vs-psychologist-vs-social-worker-bc", label: "RCC, psychologist, or social worker in BC" },
      { href: "/tools/therapy-cost-bc", label: "Work out what it costs after coverage" },
    ],
  },

  {
    slug: "msp-vs-extended-health",
    figure2: "first-session-flow",
    figure: "therapy-cost-in-bc",
    title: "MSP vs extended health: what actually covers therapy in BC",
    metaTitle: "Does MSP Cover Therapy in BC? | Westpeak Wellness",
    metaDescription:
      "MSP does not pay for private counselling — but three public routes are free, and most extended-health plans reimburse an RCC. What each one covers.",
    eyebrow: "Resource · Coverage",
    lede:
      "British Columbians are used to health care being covered. Mental health is the place where that assumption breaks.",
    shortAnswer:
      "MSP covers medically necessary physician services — including your GP and, on referral, a psychiatrist. It does not cover private counselling with a counsellor, psychologist, or social worker. Free publicly funded mental-health care does exist through health authorities and community programs; private therapy is paid for out of pocket or through an extended health plan.",
    updated: "2026-08-08",
    readMinutes: 5,
    sections: [
      {
        h2: "The two systems, side by side",
        table: {
          columns: ["", "MSP (public)", "Extended health (private insurance)"],
          rows: [
            ["Who pays", "Province of BC", "Your employer's plan, or a policy you buy"],
            ["GP appointments", "Covered", "Not applicable"],
            ["Psychiatrist (on referral)", "Covered", "Not applicable"],
            ["Health authority mental-health services", "Covered", "Not applicable"],
            ["Private counselling (RCC)", "Not covered", "Commonly covered — check your plan wording"],
            ["Private psychologist", "Not covered", "Almost always covered"],
            ["Medication", "Not covered by MSP itself", "Often covered; PharmaCare may also apply"],
            ["Wait time", "Varies by region and urgency", "Usually days to a couple of weeks"],
          ],
        },
      },
      {
        h2: "What MSP does cover for mental health",
        body: [
          "It is worth being precise, because \"MSP doesn't cover therapy\" leads some people to assume nothing is available publicly, which is not true.",
          "**Your GP is covered**, and a GP appointment about mental health is a legitimate use of one. They can assess, discuss medication, sign you off work, and refer onward. **A psychiatrist is covered on referral** — psychiatrists are physicians, so their services fall under MSP. The constraint is availability rather than cost, and wait times can be long, particularly outside the Lower Mainland.",
          "**Health authority mental-health and substance-use services are free at point of use.** Each authority — Fraser Health, Vancouver Coastal, Island Health, Interior Health, Northern Health — runs assessment, counselling, and treatment programs, generally accessible by self-referral or GP referral.",
        ],
      },
      {
        h2: "What it does not cover, and why",
        body: [
          "MSP funds *medically necessary services delivered by physicians*. A Registered Clinical Counsellor is not a physician, so counselling sits outside the scheme regardless of how necessary it is. The same applies to psychologists and social workers in private practice.",
          "That is a structural feature of how the plan is defined rather than a judgement about whether therapy works, and it is why the private and public mental-health systems in BC feel so disconnected. It also explains the odd situation where a psychiatrist is free and a psychologist costs $250 an hour.",
          "The practical consequence: for most people the route to therapy without a long wait runs through an [extended health plan](/resources/bc-extended-health-coverage-for-counselling) or out-of-pocket payment — or through the [free and low-cost services](/resources/low-cost-counselling-bc) that do exist, if you can wait.",
        ],
      },
      {
        h2: "Choosing between public and private",
        list: [
          { label: "Cost is the deciding factor", detail: "Public services are free. If paying is not realistic and a waitlist is tolerable, start with your health authority or the free options in the low-cost guide." },
          { label: "You need to start soon", detail: "Private practitioners can often begin within a week or two. This is the main thing people are buying." },
          { label: "You need a diagnosis or medication", detail: "That is a physician or psychologist question, and the physician route is covered by MSP. A counsellor cannot do either." },
          { label: "You want to choose your practitioner", detail: "Public services assign you a clinician. Private practice lets you pick — including for language, gender, and specific specialisation." },
          { label: "You want long-term work", detail: "Public programs frequently cap the number of sessions. Private therapy can run as long as it is useful." },
          { label: "Using both", detail: "Entirely normal and often sensible — a GP or psychiatrist handling the medical side while a counsellor does the talking work." },
        ],
      },
    ],
    midCta: {
      text: "If you are weighing the wait against the cost, that is a reasonable thing to talk through on a free 15-minute call.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Can my GP refer me to a counsellor and have MSP pay?", a: "No. A GP referral does not convert private counselling into an MSP-covered service. A GP can, however, refer you into free health authority programs and to a psychiatrist, both of which are covered." },
      { q: "Does PharmaCare cover therapy?", a: "No — PharmaCare covers eligible prescription medication, not counselling services." },
      { q: "Is anything covered if I am on income assistance?", a: "Health authority mental-health services are free regardless of income, and some communities have additional no-cost counselling programs. Community and immigrant-serving agencies also run free counselling in many areas." },
      { q: "What about counselling for a crime I experienced?", a: "The Crime Victim Assistance Program may fund counselling for victims of crime in BC, and it operates separately from MSP. Applying is worthwhile if that applies to you." },
    ],
    sources: [
      { label: "Province of BC — Medical Services Plan", url: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp" },
      { label: "Province of BC — mental health and substance use support", url: "https://www2.gov.bc.ca/gov/content/mental-health-support-in-bc" },
      { label: "HereToHelp BC — navigating the system", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/resources/bc-extended-health-coverage-for-counselling", label: "Extended health coverage for counselling in BC" },
      { href: "/resources/low-cost-counselling-bc", label: "Free and low-cost counselling in BC" },
      { href: "/pricing", label: "Fees and coverage" },
      { href: "/guides/how-to-find-a-therapist-in-bc", label: "How to find a therapist in BC" },
      { href: "/tools/therapy-cost-bc", label: "Work out what it costs after coverage" },
    ],
  },

  {
    slug: "low-cost-counselling-bc",
    figure2: "first-session-flow",
    figure: "therapy-cost-in-bc",
    title: "Free and low-cost counselling in BC",
    metaTitle: "Free & Low-Cost Counselling in BC | Westpeak Wellness",
    metaDescription:
      "A working list of free and reduced-cost mental health support in British Columbia — who qualifies, what it covers, and how to access it.",
    eyebrow: "Resource · Access",
    lede:
      "Private therapy is one option among many, and for a lot of people it should not be the first one tried.",
    shortAnswer:
      "BC has more free and low-cost mental health support than most people realise: health authority services, Foundry for under-25s, Here2Talk for post-secondary students, CMHA programs, employee assistance programs, community agencies, and university training clinics. This page lists what exists and who each option is for.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "Free, province-wide",
        list: [
          { label: "9-8-8 Suicide Crisis Helpline", detail: "Call or text 9-8-8, 24/7, anywhere in Canada. For crisis, not ongoing therapy — but it is staffed around the clock and it is free." },
          { label: "310 Mental Health Support — 310-6789", detail: "BC's 24/7 emotional support and information line. No area code needed, free from anywhere in the province." },
          { label: "HealthLink BC — 8-1-1", detail: "Free 24/7 health information from a registered nurse, who can direct you to services in your area. Translation available in many languages." },
          { label: "Health authority mental-health services", detail: "Fraser Health, Vancouver Coastal, Island Health, Interior Health, and Northern Health each run free mental-health and substance-use services. Access by self-referral or through a GP; wait times vary by region and urgency." },
          { label: "Foundry BC", detail: "Free counselling and support for anyone aged 12–24, in centres across the province and virtually through the Foundry app. No referral needed." },
          { label: "Here2Talk", detail: "Free, confidential counselling for students registered at a BC post-secondary institution. Available 24/7 by app, phone, or online." },
        ],
      },
      {
        h2: "Free or low-cost, depending on your situation",
        list: [
          { label: "Employee assistance programs (EAP)", detail: "If you work for a mid-size or larger employer you likely have one, typically covering a set number of free sessions. A surprising number of people never check." },
          { label: "Post-secondary counselling services", detail: "Included in your student fees if you are enrolled. Session caps and waitlists apply, but the cost is already paid." },
          { label: "CMHA branch programs", detail: "Canadian Mental Health Association branches run free and low-cost groups and counselling that vary considerably by community — worth checking your local branch specifically." },
          { label: "University training clinics", detail: "Counselling psychology programs run clinics staffed by supervised student clinicians at substantially reduced rates. Supervision is close, and quality is often high." },
          { label: "Community and immigrant-serving agencies", detail: "Many settlement organisations offer free counselling, frequently in languages other than English, funded for newcomers to Canada." },
          { label: "Crime Victim Assistance Program", detail: "May fund counselling for victims of crime in BC. Applying is worth doing if it applies to you." },
          { label: "Reduced-fee spots in private practice", detail: "Fee policies vary between practices, so asking what a practitioner charges and whether they have any reduced-fee availability is an ordinary question worth putting to anyone you are considering." },
        ],
      },
      {
        h2: "How to pick where to start",
        body: [
          "**If you are in crisis right now**, use 9-8-8 or 310-6789. That is what they are for, and using them is not an overreaction.",
          "**If you are under 25**, start with Foundry — it is free, it is designed for your age group, and there is no referral to arrange.",
          "**If you are a post-secondary student**, use Here2Talk and your campus service. Both are already paid for.",
          "**If you are employed**, check whether you have an EAP before paying for anything.",
          "**If cost is the binding constraint and you can wait**, your health authority's service is free and the referral process is straightforward.",
          "**If you need to start soon, or need a specific language or specialisation**, private practice is usually the faster route, and fee policies vary between practitioners. There is more on how to compare them in the [guide to finding a therapist in BC](/guides/how-to-find-a-therapist-in-bc).",
        ],
      },
    ],
    midCta: {
      text: "If you have worked through the free options and none of them fit, a free 15-minute call is a reasonable next step.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Is free counselling lower quality?", a: "Not inherently. Publicly funded and non-profit services employ qualified clinicians. The usual trade-offs are waiting time, session caps, and not choosing your practitioner — rather than competence." },
      { q: "How long are health authority waitlists?", a: "They vary widely by region and by urgency, and access is generally thinnest in northern and rural communities. Urgent cases are prioritised; non-urgent referrals can take considerably longer." },
      { q: "Do I need a doctor's referral?", a: "Usually not. Most health authority mental-health services accept self-referral, as do Foundry and Here2Talk. A GP referral is required for a psychiatrist." },
      { q: "How do I ask a practitioner about cost without it being awkward?", a: "Ask directly — \"what are your fees, and do you have any reduced-fee spots available?\" It is an ordinary question that practitioners field constantly, and policies vary widely between practices." },
    ],
    sources: [
      { label: "Foundry BC — free services for ages 12–24", url: "https://foundrybc.ca/" },
      { label: "Here2Talk — free counselling for BC post-secondary students", url: "https://here2talk.ca/" },
      { label: "9-8-8 Suicide Crisis Helpline", url: "https://988.ca/" },
      { label: "HealthLink BC — 8-1-1", url: "https://www.healthlinkbc.ca/" },
      { label: "CMHA BC — programs and services", url: "https://cmha.bc.ca/" },
    ],
    related: [
      { href: "/resources/bc-crisis-and-support-directory", label: "BC crisis and support directory" },
      { href: "/resources/msp-vs-extended-health", label: "MSP vs extended health" },
      { href: "/guides/how-to-find-a-therapist-in-bc", label: "How to find a therapist in BC" },
      { href: "/pricing", label: "Fees and coverage" },
      { href: "/tools/therapy-cost-bc", label: "Work out what it costs after coverage" },
    ],
  },

  {
    slug: "bc-crisis-and-support-directory",
    figure2: "first-session-flow",
    figure: "bc-reach",
    title: "BC crisis and mental health support directory",
    metaTitle: "BC Crisis & Support Directory | Westpeak Wellness",
    metaDescription:
      "Every crisis line and mental health hotline covering British Columbia — who to call, when, and what each service actually does.",
    eyebrow: "Resource · Crisis support",
    lede:
      "Keep this one somewhere findable. The time to look it up is not the time you need it.",
    shortAnswer:
      "In immediate danger, call 911. For suicide crisis anywhere in Canada, call or text 9-8-8, free and 24/7. For emotional support and information in BC, call 310-6789 — no area code needed. Westpeak Wellness is not a crisis service and cannot respond to emergencies.",
    updated: "2026-08-08",
    readMinutes: 4,
    sections: [
      {
        h2: "If someone is in immediate danger",
        body: [
          "**Call 911.** That includes a suicide attempt in progress, a serious overdose, or immediate risk of harm to someone.",
          "If you are supporting someone else and it is safe to do so, stay with them until help arrives, and remove access to means where you can do it without putting yourself at risk.",
        ],
      },
      {
        h2: "Crisis lines",
        table: {
          columns: ["Service", "Contact", "What it is for"],
          rows: [
            ["9-8-8 Suicide Crisis Helpline", "Call or text 9-8-8", "Suicide crisis and emotional distress, Canada-wide, 24/7, free"],
            ["310 Mental Health Support", "310-6789 (no area code)", "BC emotional support, information, and resources, 24/7"],
            ["BC Crisis Centre", "1-800-SUICIDE (1-800-784-2433)", "24/7 support for anyone considering suicide, or concerned about someone"],
            ["KUU-US Crisis Line", "1-800-588-8717", "24/7 Indigenous-specific crisis support across BC"],
            ["Kids Help Phone", "Call 1-800-668-6868 or text CONNECT to 686868", "24/7 support for children and youth"],
            ["VictimLinkBC", "1-800-563-0808", "24/7 support for victims of family and sexual violence and other crime"],
            ["Alcohol & Drug Information and Referral", "1-800-663-1441", "24/7 substance use information and referral in BC"],
            ["HealthLink BC", "8-1-1", "24/7 registered nurse health advice and service navigation"],
          ],
        },
      },
      {
        h2: "Ongoing support, not crisis",
        list: [
          { label: "Your health authority", detail: "Fraser Health, Vancouver Coastal, Island Health, Interior Health, and Northern Health each run free mental-health and substance-use services, usually accessible by self-referral." },
          { label: "Foundry BC", detail: "Free counselling and support for ages 12–24, in centres and virtually through the Foundry app." },
          { label: "Here2Talk", detail: "Free 24/7 counselling for students registered at a BC post-secondary institution." },
          { label: "Pacific Post Partum Support Society", detail: "Free peer support for perinatal mental health across BC, for parents with a baby under eighteen months." },
          { label: "CMHA BC", detail: "Branch programs across the province, varying by community." },
          { label: "Your GP", detail: "Covered by MSP, and a legitimate first stop for assessment, medication questions, and referral." },
        ],
      },
      {
        h2: "What this practice is and is not",
        body: [
          "**Westpeak Wellness is not a crisis service.** Sessions are scheduled, messages are not monitored around the clock, and there is no capacity to respond to an emergency. If you are in crisis, the numbers above are staffed for exactly that and are free.",
          "What a counselling practice is for is the work that comes before and after crisis — and for the large majority of people who are not in crisis at all, just carrying something that has become heavy. If you are not sure which of those describes you, [the guide on finding a therapist in BC](/guides/how-to-find-a-therapist-in-bc) may help you place yourself.",
        ],
      },
    ],
    midCta: {
      text: "For non-urgent support, a free 15-minute consultation is a low-stakes way to work out what would actually help.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "What happens when I call 9-8-8?", a: "You reach a trained responder who talks with you about what is happening. It is not automatically an emergency dispatch — most calls are conversations, and the goal is support rather than intervention." },
      { q: "Can I text instead of calling?", a: "Yes. 9-8-8 accepts texts, and Kids Help Phone takes texts to 686868. For a lot of people texting is far more manageable than speaking." },
      { q: "Is it free?", a: "Yes. All the crisis lines listed here are free, including from a mobile." },
      { q: "What if I am calling about someone else?", a: "All these lines take calls from people worried about someone else. You do not need to be the person in crisis to use them." },
    ],
    sources: [
      { label: "9-8-8 Suicide Crisis Helpline", url: "https://988.ca/" },
      { label: "Province of BC — mental health support", url: "https://www2.gov.bc.ca/gov/content/mental-health-support-in-bc" },
      { label: "Crisis Centre BC", url: "https://crisiscentre.bc.ca/" },
      { label: "HealthLink BC", url: "https://www.healthlinkbc.ca/" },
    ],
    related: [
      { href: "/resources/low-cost-counselling-bc", label: "Free and low-cost counselling in BC" },
      { href: "/contact", label: "Contact Westpeak Wellness" },
      { href: "/guides/how-to-find-a-therapist-in-bc", label: "How to find a therapist in BC" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
    ],
  },
];

/* Alberta joins the set on 2 Sep 2026. Every page before this was
   BC-specific — MSP, WorkSafeBC, the BC crisis directory — which was right
   while the practice served only BC and stopped being right when a counsellor
   who can see Alberta clients joined. See lib/resources-alberta.ts for why
   these are resources rather than part of the gated /alberta section. */
export const resources: Resource[] = [...coreResources, ...moreResources, ...albertaResources];

export const getResource = (slug: string) => resources.find((r) => r.slug === slug);
