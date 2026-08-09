import { moreAudiences } from './audiences-more';

export type Audience = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string;
  updated: string;
  readMinutes: number;

  opening: string[];
  /** The specific things this group actually says — not generic symptom lists. */
  whatComesUp: { label: string; detail: string }[];
  sections: { h2: string; body?: string[]; list?: { label: string; detail: string }[] }[];
  servicesThatFit: { href: string; label: string; why: string }[];
  midCta: { text: string; label: string };
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: { href: string; label: string }[];
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
};

const coreAudiences: Audience[] = [
  {
    slug: "new-parents",
    figure: "first-session-flow",
    title: "Counselling for new parents in BC",
    metaTitle: "Counselling for New Parents in BC | Westpeak Wellness",
    metaDescription:
      "Online counselling for new and expecting parents across BC — postpartum depression and anxiety, identity shift, and relationship strain. Free consultation.",
    eyebrow: "For · New and expecting parents",
    lede:
      "The gap between how you were told this would feel and how it actually feels can be enormous — and there is very little permission to say so out loud.",
    updated: "2026-08-08",
    readMinutes: 6,
    opening: [
      "Almost a quarter of Canadian parents who have recently given birth report symptoms consistent with postpartum depression or an anxiety disorder, according to [Statistics Canada's 2019 survey](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7910326/). That is not a rare complication. It is roughly one in four — and the figure counts only those who reported it.",
      "The reason it still feels isolating is that the postpartum period comes with a very narrow script. You are supposed to be tired but grateful. If what you actually feel is flat, or frightened, or resentful, or nothing much at all, the script has no line for it — so most people stop talking rather than risk the reaction.",
      "Counselling is somewhere the script does not apply. You can say the thing you have not said to your partner, your mother, or your public health nurse, and have it met as information rather than as an alarm.",
    ],
    whatComesUp: [
      { label: "\"I love them and I want my old life back\"", detail: "Both of these are true at once for a great many people, and holding them together is not a sign that anything has gone wrong." },
      { label: "Intrusive thoughts that frighten you", detail: "Sudden, unwanted, vivid thoughts about harm coming to the baby are extremely common in the postpartum period and are typically a feature of anxiety rather than an intention. Most parents have never been told this, and carry them in silence for months." },
      { label: "Rage that arrives out of nowhere", detail: "Postpartum distress does not always look like sadness. For a lot of people it looks like a short fuse and then guilt about the short fuse." },
      { label: "The relationship has quietly become logistics", detail: "Two people managing shifts. Score-keeping about sleep. Resentment neither of you planned on and both of you feel guilty about." },
      { label: "Losing the person you were", detail: "Career, body, friendships, autonomy, the version of yourself that existed before — grief for that is legitimate and does not compete with loving your child." },
      { label: "Cultural expectation on top of everything", detail: "Family arriving with strong views on feeding, sleeping, and what a good mother does. Managing that while depleted is its own separate load, and it is heavier when the expectations come in a language and a framework you cannot simply opt out of." },
    ],
    sections: [
      {
        h2: "This is not only about the person who gave birth",
        body: [
          "Partners and non-birthing parents experience postpartum depression and anxiety too, and are far less likely to be screened for it or asked about it. Adoptive parents are largely absent from the public conversation altogether. If you are exhausted, anxious, and functioning while nobody has asked how you are once, that is worth bringing somewhere.",
        ],
      },
      {
        h2: "When it is worth talking to someone",
        body: [
          "There is no threshold you have to cross to deserve support, and waiting to be bad enough is a common and costly mistake. That said, these are the patterns that most often bring people in:",
        ],
        list: [
          { label: "It has been more than two or three weeks", detail: "Short-lived mood swings in the first fortnight are extremely common. Something that has settled in and stayed is different." },
          { label: "You are not enjoying anything", detail: "Not just the baby — anything. Flatness that does not lift when the baby sleeps or a friend visits." },
          { label: "Anxiety is running the day", detail: "Constant checking, inability to sleep even when the baby does, a persistent sense that something terrible is imminent." },
          { label: "You are avoiding being alone with the baby", detail: "Or arranging your day so you never have to be." },
          { label: "You feel like they would be better off without you", detail: "This one does not wait. Call or text 9-8-8 (Canada, 24/7), or 310-6789 for BC Mental Health Support. If you are in immediate danger, call 911." },
        ],
      },
      {
        h2: "What is actually available in BC",
        body: [
          "Private counselling is one option among several, and it is not always the first one worth trying:",
          "**[Pacific Post Partum Support Society](https://postpartum.org/)** runs free peer support groups, online and in person, for parents in BC with a baby under eighteen months, plus a support line. Free, specific to this, and staffed by people who have been through it. For many parents it is the right first call.",
          "**Public health nurses** in your health authority screen for postpartum mood concerns and can refer onward. **HealthLink BC at 8-1-1** is free, 24/7, and will talk through symptoms with a nurse. **Your GP or midwife** can assess whether medication is worth discussing — a question a counsellor cannot answer, and should not pretend to.",
          "**Private counselling** fits when you want sustained one-to-one work rather than a group, when you want to go into territory a group setting does not reach, or when the waitlist for a public service is longer than you can comfortably hold. It is not a replacement for the medical side of things, and the two work perfectly well in parallel.",
        ],
      },
      {
        h2: "Why virtual sessions tend to suit this particular stage",
        body: [
          "This is the one group for whom video is often not a compromise but the better format. There is no childcare to arrange and no travel window to protect. Sessions can happen during a nap, or with a baby asleep on you, or in a parked car outside the house because that is the only door that closes. Nobody has to be presentable. If the session gets interrupted, it gets interrupted — that is expected, not a problem.",
          "For a parent in the first year, the difference between \"therapy I have to get to\" and \"therapy that happens where I already am\" is frequently the difference between going and not going.",
        ],
      },
    ],
    servicesThatFit: [
      { href: "/services/depression-counselling", label: "Depression counselling", why: "For postpartum depression, persistent low mood, and the flatness that does not lift." },
      { href: "/services/anxiety-counselling", label: "Anxiety counselling", why: "For postpartum anxiety, intrusive thoughts, and checking behaviour." },
      { href: "/services/couples-therapy", label: "Couples therapy", why: "For the relationship strain that arrives with a newborn and the resentment neither of you planned on." },
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling", why: "For navigating family expectation around new motherhood without having to translate the context first." },
      { href: "/services/trauma-therapy", label: "Trauma therapy", why: "For a birth that was frightening, or a medical experience that has not settled." },
    ],
    midCta: {
      text: "If you have read this far, some of it probably landed. Fifteen minutes on a call costs nothing and commits you to nothing.",
      label: "Book a free consultation",
    },
    faqs: [
      {
        q: "Can I bring the baby to a session?",
        a: "Yes. This is a virtual practice, so the baby is welcome by definition — feeding, holding, settling, all fine. Sessions get interrupted and that is entirely expected. Waiting until you have childcare usually means waiting a long time.",
      },
      {
        q: "Is what I am feeling postpartum depression, or just exhaustion?",
        a: "A counsellor cannot diagnose in BC, so that specific question belongs with your GP, midwife, or a psychologist. What counselling can do is help you describe what is happening clearly enough to make that conversation useful — and work on it in the meantime.",
      },
      {
        q: "I had my baby two years ago. Is it too late?",
        a: "No. Plenty of people come to this work well after the first year, often once there is finally enough space to notice what the first year cost. There is no expiry on being able to process it.",
      },
      {
        q: "My partner is the one struggling. Can they come?",
        a: "Yes — partners and non-birthing parents experience postpartum depression and anxiety too and are screened for it far less often. They can book individually, or you can look at couples sessions together.",
      },
    ],
    sources: [
      { label: "Symptoms of postpartum anxiety and depression among women in Canada — national cross-sectional survey", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7910326/" },
      { label: "Pacific Post Partum Support Society — free peer support across BC", url: "https://postpartum.org/" },
      { label: "HealthLink BC — postpartum depression", url: "https://www.healthlinkbc.ca/healthwise/postpartum-depression-0" },
      { label: "HereToHelp BC — postpartum depression info sheet", url: "https://www.heretohelp.bc.ca/infosheet/postpartum-depression" },
    ],
    related: [
      { href: "/guides/is-online-therapy-as-effective-as-in-person", label: "Is online therapy as effective as in-person?" },
      { href: "/compare/rcc-vs-psychologist-vs-social-worker-bc", label: "RCC, psychologist, or social worker — who to see in BC" },
      { href: "/pricing", label: "Fees and extended health coverage" },
      { href: "/faq", label: "Frequently asked questions about starting therapy" },
    ],
  },
  {
    slug: "university-students",
    figure: "therapy-cost-in-bc",
    title: "Counselling for university and college students in BC",
    metaTitle: "Counselling for BC Students | Westpeak Wellness",
    metaDescription:
      "Online counselling for post-secondary students across BC — anxiety, burnout, family expectation, and the free options worth using first.",
    eyebrow: "For · Post-secondary students",
    lede:
      "Everyone says these are the best years of your life, which makes it harder to admit you are barely holding it together.",
    updated: "2026-08-08",
    readMinutes: 6,
    opening: [
      "Post-secondary compresses an unusual number of hard things into a short window. You are making decisions with long consequences while your prefrontal cortex is still finishing, often away from home for the first time, frequently in debt, and surrounded by people who appear to be managing effortlessly. Almost none of them are.",
      "The specific difficulty is that the pressure is invisible from outside. Nobody sees the 2am panic about whether you picked the right programme, or the phone call home where you say everything is fine. What they see is someone getting through it.",
      "**Before anything else — use the free options.** Your institution's counselling service is already paid for in your fees. [Here2Talk](https://here2talk.ca/) offers free, confidential counselling to students registered at a BC post-secondary institution, 24/7, by app, phone, or online. [Foundry](https://foundrybc.ca/) provides free counselling for anyone aged 12 to 24 across BC, virtually and in centres. Private therapy is worth paying for when those are full, when the waitlist runs past the point you can wait, or when you want continuity that does not reset each term.",
    ],
    whatComesUp: [
      { label: "\"I picked the wrong programme\"", detail: "Two years in, a great deal of money spent, and the growing certainty that this is not it — plus the fear of what changing course would mean to the people funding it." },
      { label: "Performing fine while not being fine", detail: "Grades holding, attendance holding, everything on the outside intact, and nothing underneath it. This is when people delay getting help longest." },
      { label: "The gap between your life and your family's expectations", detail: "Particularly when they sacrificed to get you here. Disappointing them can feel less survivable than being miserable." },
      { label: "Comparison as a constant background hum", detail: "Everyone's highlight reel, all day, on a device you cannot put down — plus the classmates who genuinely do seem to find it easy." },
      { label: "Sleep gone completely sideways", detail: "Nocturnal schedules, all-nighters, caffeine to start and something to stop. Sleep disruption both causes and mimics anxiety and low mood." },
      { label: "Loneliness in a crowd", detail: "Surrounded by thousands of people and knowing none of them well. Very common, rarely said out loud, and worse for commuter and international students." },
    ],
    sections: [
      {
        h2: "The pressure that is specifically about family",
        body: [
          "For many students in BC — and disproportionately for students from immigrant families — the academic pressure is not really academic. It is about what the degree represents: the reason a family moved, the justification for what a parent gave up, the security everyone is counting on.",
          "That turns an ordinary bad semester into something much heavier. A failed course is not a failed course; it is evidence about whether the whole thing was worth it. And it makes the obvious solutions — switch programmes, take a term off, reduce your course load — feel unavailable, even when they are clearly the right call.",
          "This is workable, and it usually starts with separating the two things that have fused: what you want, and what you owe. Those are different questions, and most people have never been given room to ask the first one. There is more on that pattern in the guide to [intergenerational trauma](/guides/intergenerational-trauma-explained) and on the page for [first- and second-gen South Asian adults](/for/first-gen-south-asian-adults).",
        ],
      },
      {
        h2: "When to get support rather than wait it out",
        list: [
          { label: "It has outlasted the stressor", detail: "Exam-period stress that lifts after exams is normal. Stress that stays once the term ends is different." },
          { label: "You have stopped attending", detail: "Skipping the class you cannot face, then avoiding the professor, then the whole course. Avoidance compounds fast in a structured programme." },
          { label: "Substances are doing the regulating", detail: "Needing something to sleep, to socialise, or to sit down and work is worth taking seriously early." },
          { label: "You are isolating", detail: "Declining things you would normally want to do, going quiet on people, spending most of your time alone in your room." },
          { label: "Any thought of not being here", detail: "That does not wait for an appointment. Call or text 9-8-8 (Canada, 24/7), or 310-6789 for BC Mental Health Support. In immediate danger, call 911." },
        ],
      },
      {
        h2: "Why virtual usually suits student life",
        body: [
          "No travel between campus and an office, which matters when your day is already fragmented. Sessions that survive moving home for the summer, going on co-op, or transferring institutions — the counselling relationship does not reset with your address, as long as you are in BC. And a format that works from a residence room with the door shut, which is often the only private space available.",
          "Evening appointments help too, since most student days do not have a convenient hole in the middle of them.",
        ],
      },
    ],
    servicesThatFit: [
      { href: "/services/anxiety-counselling", label: "Anxiety counselling", why: "For exam anxiety, panic, social anxiety, and worry that has stopped switching off." },
      { href: "/services/depression-counselling", label: "Depression counselling", why: "For low mood, loss of motivation, and the flatness that outlasts the semester." },
      { href: "/services/individual-therapy", label: "Individual therapy", why: "For identity, direction, and working out what you actually want." },
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling", why: "For talking about family expectation without translating the cultural context first." },
      { href: "/services/south-asian-mental-health", label: "South Asian mental health", why: "For the specific weight of being the one the family's plans depend on." },
    ],
    midCta: {
      text: "If the free campus service has a three-week waitlist and three weeks is too long, a free 15-minute call is a reasonable next step.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Is my campus counselling service not enough?", a: "Often it is, and it is free — start there. Its limits are usually capacity and session caps, so private therapy tends to make sense when the waitlist is longer than you can wait or you need work that runs longer than a fixed number of sessions." },
      { q: "Will my parents find out?", a: "No. If you are 19 or over, counselling is confidential and your family has no access to it. Under 19, confidentiality still generally applies where you are capable of consenting to your own care. The limits are risk of serious harm and court orders — not parental curiosity." },
      { q: "Can I afford this as a student?", a: "Check your student health plan first — many post-secondary plans include counselling coverage that students never claim. Here2Talk and your campus counselling service are free and already paid for through your fees, and both are worth using before paying out of pocket." },
      { q: "What if I go home for the summer?", a: "As long as home is in BC, sessions continue unchanged. That continuity is one of the practical advantages of a virtual practice for students." },
    ],
    sources: [
      { label: "Here2Talk — free 24/7 counselling for BC post-secondary students", url: "https://here2talk.ca/" },
      { label: "Foundry BC — free services for ages 12–24", url: "https://foundrybc.ca/" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety" },
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first session" },
      { href: "/resources/low-cost-counselling-bc", label: "Free and low-cost counselling in BC" },
      { href: "/for/first-gen-south-asian-adults", label: "For first- and second-gen South Asian adults" },
    ],
  },

  {
    slug: "healthcare-and-shift-workers",
    figure: "burnout-vs-depression",
    title: "Counselling for healthcare and shift workers in BC",
    metaTitle: "Counselling for Shift Workers BC | Westpeak Wellness",
    metaDescription:
      "Online counselling for nurses, care aides, first responders, and shift workers across BC — burnout, moral injury, and sleep disruption.",
    eyebrow: "For · Healthcare and shift work",
    lede:
      "You are good in a crisis. That is exactly why nobody notices when you are in one.",
    updated: "2026-08-08",
    readMinutes: 6,
    opening: [
      "Healthcare and emergency work select for people who function under pressure and keep going. Those are genuine strengths, and they are also the reason distress in this workforce goes unnoticed for years — including by the person carrying it. Competence is very effective camouflage.",
      "The pressures here are not the ordinary ones. Rotating shifts that put your body permanently out of phase. Decisions made with insufficient information and real consequences. Exposure to other people's worst days as a routine feature of the job. Short staffing that turns every shift into triage. And a workplace culture where saying you are struggling can feel like admitting you are not up to it.",
      "**A note on cost:** in BC, mental-health conditions arising from work-related traumatic events can be compensable through WorkSafeBC, and for eligible first responders and certain other occupations a presumption applies — meaning the condition may be presumed work-related rather than requiring you to prove it. If your difficulty is connected to what you have seen at work, it is worth finding out what you are entitled to before paying privately. Your union or professional association is usually the fastest route to that answer.",
    ],
    whatComesUp: [
      { label: "\"I should be able to handle this\"", detail: "The belief that training makes you exempt, and that struggling means you were never suited to it. This keeps more people out of therapy in this field than anything else." },
      { label: "Moral injury, not just stress", detail: "The particular damage of being required to act against your own sense of right — sending someone home too early, rationing time, following a policy you believe is wrong. It behaves differently from ordinary burnout and responds to different work." },
      { label: "Compassion that has gone flat", detail: "Finding yourself detached from patients or clients you would once have cared about, and then feeling ashamed of that. It is a recognised feature of sustained exposure, not a character defect." },
      { label: "Sleep that never resets", detail: "Nights, then days, then nights. Your circadian rhythm has not been in phase for years, and disrupted sleep both causes and imitates anxiety and depression." },
      { label: "Bringing it home", detail: "Being physically present and mentally still on the ward. Partners noticing before you do. The specific guilt of having nothing left for the people you actually chose." },
      { label: "The debrief that never happened", detail: "A bad call, a bad outcome, a death that stayed with you — and a shift that simply continued afterward, because there was nobody to cover you." },
    ],
    sections: [
      {
        h2: "Moral injury is not the same as burnout",
        body: [
          "This distinction matters because the two need different work and get conflated constantly.",
          "**Burnout** is depletion — the WHO describes it as exhaustion, mental distance from the job, and reduced effectiveness arising from chronic unmanaged workplace stress. It responds to changes in load, recovery, and boundaries. There is more in the guide on [burnout versus depression](/guides/burnout-vs-depression).",
          "**Moral injury** is different. It is the damage done by participating in, witnessing, or failing to prevent something that violates your own moral code. Rest does not touch it, because the problem is not depletion — it is a conflict between what you did or could not do and who you understand yourself to be. It shows up as guilt, shame, and a loss of trust in the institution or in yourself, and it needs to be worked through rather than recovered from.",
          "A great deal of what gets labelled burnout in healthcare is actually this. Being offered a wellness webinar for it is, understandably, infuriating.",
        ],
      },
      {
        h2: "Why the usual advice does not apply",
        body: [
          "Standard mental-health guidance assumes a life you can adjust: keep regular sleep, exercise in the morning, protect your evenings. If you work rotating twelve-hour shifts, most of that is not available, and being told it repeatedly starts to feel like being blamed.",
          "Useful work here starts from the actual constraints. What recovery is possible inside a rotation rather than in an imagined stable schedule. How to protect the transition between shift and home when there is no commute to decompress in. What can be done about the specific incidents that are still with you. And how to hold boundaries in a workplace that will absorb every hour you offer it.",
        ],
      },
      {
        h2: "Scheduling that fits a rotation",
        body: [
          "The practical barrier for this workforce is almost always scheduling. A weekly Tuesday-at-four appointment is unusable when your rotation moves. A virtual practice removes travel from the equation, which makes an appointment on a day off far more feasible, and evening slots are available by request.",
          "It also means sessions can happen from home rather than requiring you to be presentable and somewhere else — which, on the fourth day of a stretch, is often the deciding factor between attending and cancelling.",
        ],
      },
    ],
    servicesThatFit: [
      { href: "/services/trauma-therapy", label: "Trauma therapy", why: "For critical incidents, cumulative exposure, and the calls that stayed with you." },
      { href: "/services/emdr-therapy", label: "EMDR therapy", why: "For specific incidents that still intrude — and it requires less detailed retelling than talk-based approaches." },
      { href: "/services/depression-counselling", label: "Depression counselling", why: "For the flatness, detachment, and loss of meaning that follow sustained exposure." },
      { href: "/services/anxiety-counselling", label: "Anxiety counselling", why: "For hypervigilance, dread before shifts, and sleep that will not come." },
      { href: "/services/couples-therapy", label: "Couples therapy", why: "For the strain that shift work and emotional depletion put on a relationship." },
    ],
    midCta: {
      text: "If you have been meaning to deal with this since a shift you can still name, that is usually the signal.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Will this affect my licence or my employer?", a: "No. Private counselling is confidential and is not reported to your employer, your union, or your regulatory college. The limits are the standard ones — risk of serious harm, a child at risk, or a court order — and those apply to everyone." },
      { q: "Is this covered by WorkSafeBC?", a: "It may be, where the condition arises from work-related traumatic exposure, and a presumption applies for eligible first responders and certain other occupations. Your union or professional association can usually tell you quickly. Worth checking before paying out of pocket." },
      { q: "I only have random days off. Can that work?", a: "Yes. Appointments do not have to be the same slot every week, and virtual sessions remove travel, which is the part that usually makes an irregular rotation unworkable." },
      { q: "Does my EAP not cover this already?", a: "Often it covers a set number of sessions, and for many people that is the right starting point. Its limits are session caps and sometimes limited choice of practitioner — private therapy makes sense when you need longer work or a specific fit." },
    ],
    sources: [
      { label: "WorkSafeBC — mental health claims and presumptions", url: "https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-claims" },
      { label: "World Health Organization — burn-out as an occupational phenomenon", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
      { label: "CMHA BC — workplace mental health", url: "https://cmha.bc.ca/" },
    ],
    related: [
      { href: "/guides/burnout-vs-depression", label: "Burnout or depression — how to tell" },
      { href: "/services/emdr-therapy", label: "EMDR therapy across BC" },
      { href: "/guides/what-is-emdr-and-how-a-session-works", label: "What is EMDR and how a session works" },
      { href: "/resources/bc-crisis-and-support-directory", label: "BC crisis and support directory" },
    ],
  },
  {
    slug: "first-gen-south-asian-adults",
    figure: "window-of-tolerance",
    title: "Counselling for first- and second-generation South Asian adults",
    metaTitle: "South Asian Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online counselling in Punjabi or English for South Asian adults in BC — family expectation, duty, identity, and generational silence.",
    eyebrow: "For · South Asian adults",
    lede:
      "Not the therapy where you spend the first twenty minutes explaining why you cannot simply move out.",
    updated: "2026-08-08",
    readMinutes: 7,
    opening: [
      "The most common reason South Asian clients give for having avoided therapy is not stigma. It is the anticipated effort — the expectation of having to explain the entire cultural architecture before anything useful can happen, and of eventually being told that the obvious answer is to set a boundary, move out, or care less what your family thinks.",
      "That advice is not wrong exactly. It is built for a model of adulthood in which independence is the goal and family obligation is a problem to be solved. In a collectivist frame it lands as a suggestion that you become a worse person.",
      "This is counselling that starts further along. Family expectation, duty, izzat, *log kya kahenge* — these do not need translating, and they are not treated as pathology to be corrected. They are the context the work happens inside.",
    ],
    whatComesUp: [
      { label: "Being the first in the family to do this", detail: "No template, nobody to ask, and often a private worry that seeking help proves something bad about you. Frequently combined with not telling anyone you are going." },
      { label: "Guilt that arrives with any independent choice", detail: "Career, partner, city, religion, how you spend money. Choosing for yourself feeling like a small betrayal rather than a normal adult act." },
      { label: "Two selves that do not overlap", detail: "One version at home, another at work or with friends, and the exhaustion of maintaining both — plus the question of which one is real." },
      { label: "\"Log kya kahenge\"", detail: "Decisions shaped by community perception rather than by what you want. Not vanity — a real social currency with real consequences for your parents as well as you." },
      { label: "Silence around mental health at home", detail: "A household where distress was met with practicality, prayer, or nothing at all. Not cruelty; usually a generation that had no capacity for it and no language." },
      { label: "Carrying what was never named", detail: "Migration, financial precarity, partition histories, racism absorbed in silence. Nobody discussed it, and it shaped the house you grew up in anyway — see [intergenerational trauma](/guides/intergenerational-trauma-explained)." },
    ],
    sections: [
      {
        h2: "What language actually changes",
        body: [
          "People who are fluent in English often assume the option of therapy in Punjabi is not for them. In practice, first language and emotional language are frequently not the same thing.",
          "You may be entirely comfortable presenting in English at work and still find that the words for grief, shame, obligation, or the particular texture of a family argument only exist properly in Punjabi. Some things get flattened in translation — and if you spend a session translating, you spend it at one remove from what you are actually feeling.",
          "Sessions here can be in Punjabi, English, or moving between them mid-sentence, which is how many people actually think. [Punjabi-speaking counselling](/services/punjabi-counselling) covers the practical detail. It also matters that Punjabi-speaking clinicians in BC are heavily concentrated in the Lower Mainland — for most of the province, virtual sessions are the only realistic route to therapy in Punjabi at all.",
        ],
      },
      {
        h2: "This is not about choosing between your family and yourself",
        body: [
          "The fear that keeps a lot of people out of the room is that therapy will conclude with an instruction to cut people off. It is a reasonable fear, because plenty of Western therapeutic writing does treat enmeshment as the diagnosis and distance as the cure.",
          "Most people arriving here want something more difficult: to stay in relationship with their family and stop carrying the parts that are not theirs. That is a legitimate goal and it is workable. What usually shifts is not the amount of contact but what you are willing to be responsible for — the difference between declining to manage someone else's disappointment and abandoning them.",
          "Sometimes the work does lead to more distance, and that is your call, not a target set in advance. And sometimes it leads the other way — people report better relationships with parents once they stop needing them to become different people first.",
        ],
      },
      {
        h2: "The specific weight of being the one it worked out for",
        body: [
          "For many second-generation adults there is a particular and rarely-voiced burden: your parents' migration is understood to have been worth it because of how you turned out. That makes ordinary adult difficulty — a job you hate, a marriage that is failing, a diagnosis, a business that folded — carry an additional charge. It is not just your problem; it is evidence about whether the sacrifice paid off.",
          "That is a heavy thing to carry silently, and it is one of the most common threads in this work. Naming it out loud, often for the first time, tends to be the point where something starts to move.",
        ],
      },
    ],
    servicesThatFit: [
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling", why: "Sessions in Punjabi, English, or both — without translating your context first." },
      { href: "/services/south-asian-mental-health", label: "South Asian mental health", why: "Family expectation, identity, and intergenerational patterns as the main work." },
      { href: "/services/anxiety-counselling", label: "Anxiety counselling", why: "For the vigilance and performance pressure that often come with this territory." },
      { href: "/services/individual-therapy", label: "Individual therapy", why: "For identity, direction, and working out what you want separately from what you owe." },
      { href: "/services/couples-therapy", label: "Couples therapy", why: "For relationships navigating two families' expectations alongside their own." },
    ],
    midCta: {
      text: "If the idea of not having to explain the background is what appeals, that is exactly what the consultation is for.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Will my family find out I am in therapy?", a: "No. Counselling is confidential, and whether you tell anyone is entirely your decision. Sessions are virtual, so there is no waiting room and no clinic to be seen entering. The limits on confidentiality are risk of serious harm and court orders — nothing else." },
      { q: "Can I have sessions in Punjabi?", a: "Yes — in Punjabi, in English, or moving between them within a session, which is how a lot of people actually think. You do not have to choose in advance." },
      { q: "Will I be told to cut off my family?", a: "No. That framing misreads the situation for most people. The work is usually about staying in relationship while stopping carrying what is not yours — and any decision about distance is yours, not a goal set for you." },
      { q: "My parents think therapy is for people with serious problems. Are they wrong?", a: "They are describing a generation's understanding of it, formed when the only visible mental-health care was for crisis. Most therapy is not that — it is ordinary people working on ordinary difficulty before it becomes serious." },
    ],
    sources: [
      { label: "HereToHelp BC — mental health information for British Columbians", url: "https://www.heretohelp.bc.ca/" },
      { label: "CMHA BC — mental health resources", url: "https://cmha.bc.ca/" },
      { label: "BC Association of Clinical Counsellors — find a counsellor", url: "https://bcacc.ca/" },
    ],
    related: [
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling in BC" },
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety" },
      { href: "/for/university-students", label: "Counselling for BC post-secondary students" },
    ],
  },
];

export const audiences: Audience[] = [...coreAudiences, ...moreAudiences];

export const getAudience = (slug: string) => audiences.find((a) => a.slug === slug);
