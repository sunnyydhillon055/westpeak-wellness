import type { DepthSection } from './depth';

/* Fourth depth pass, 2026-08-28: the four city pages that had no extra
 * sections at all — Burnaby, Chilliwack, Kamloops and Langley — which made
 * them the thinnest pages doing ranking work on the site. (The other six
 * cities were deepened in depth-other.ts.)
 *
 * Register: access, logistics and choosing — the things that are genuinely
 * different city to city. No clinical content, no invented local statistics;
 * every local fact here is checkable (campuses, geography, health
 * authorities, commuting patterns). */
export const depth4: Record<string, DepthSection[]> = {
  'online-counselling/burnaby': [
    {
      h2: 'Counselling around a Burnaby commute',
      body: [
        'Burnaby sits in the middle of everything, which is exactly the problem. A large share of the city works somewhere else — downtown Vancouver, Surrey, the Tri-Cities — and the SkyTrain that makes that workable also makes a 5:30 pm appointment anywhere a fiction. The classic Burnaby counselling arrangement is a lunchtime office you can never quite reach or an evening slot that costs ninety minutes of travel for fifty minutes of session.',
        'Video sessions dissolve that arithmetic. An evening session happens from home in Brentwood, Edmonds or Metrotown without re-crossing the region, and a lunchtime session happens from a booked meeting room or a parked car near work. The practical requirement is privacy for the hour, not geography — and the [evening availability](/contact) this practice actually holds is published rather than implied.',
        'One Burnaby-specific note: SFU students on the mountain already have a no-cost route in [Here2Talk](https://here2talk.ca), the province-wide 24/7 service for post-secondary students, alongside campus health and counselling. Private counselling is a complement to those, not a replacement — the fuller picture is on the [student supports page](/resources/student-mental-health-supports-bc).',
      ],
    },
    {
      h2: 'Choosing between Burnaby options',
      list: [
        { label: 'You want a room to go to', detail: 'Burnaby and the neighbouring cities have plenty of in-person practices, and for some people leaving the house is part of what makes therapy work. That is a legitimate preference, and this virtual practice is honestly not the fit for it.' },
        { label: 'Privacy from a shared household', detail: 'A common reason Burnaby residents choose video with a camera in a parked car or a booked room rather than a home office: multi-generational households where a weekly "appointment" invites questions. Sessions here can also run in Punjabi — relevant to exactly the households where that privacy question is sharpest.' },
        { label: 'Continuity beats geography', detail: 'Renters move — Burnaby to New West to Coquitlam is a normal three-year arc. A virtual practice serving all of BC means the counsellor does not change when the postal code does.' },
        { label: 'The evening problem, solved differently', detail: 'In-person evening slots are the scarcest thing in Lower Mainland counselling. Video evening slots are scarce too — but they compete on availability, not on who can physically reach an office by 6 pm.' },
      ],
    },
  ],

  'online-counselling/chilliwack': [
    {
      h2: 'The eastern-valley supply problem, stated plainly',
      body: [
        'Counselling supply in the Fraser Valley concentrates westward: Abbotsford and Langley hold most of the region’s practices, and the further east you live — Chilliwack, Agassiz, Hope — the more “local counselling” quietly means a drive on Highway 1. That drive is the real barrier: an hour of travel wrapped around every session is how therapy becomes the first thing dropped in a busy month.',
        'Video sessions remove the highway from the equation without removing the standard of care — the same Registered Clinical Counsellor, the same registration you can [verify in the public register](/resources/verify-a-counsellor-in-bc), reachable identically from Sardis, Promontory, Yarrow or Hope. For the eastern valley specifically, virtual is less a preference than the practical route to consistency.',
        'Chilliwack also keeps agricultural and trades rhythms the standard counselling calendar ignores: seasonal intensity, early starts, weather-dependent weeks. A practice with published evening windows and a [waitlist that actually notifies](/book) fits those rhythms better than a fixed weekly slot that assumes an office schedule.',
      ],
    },
    {
      h2: 'What Chilliwack residents ask before booking',
      list: [
        { label: 'Is video counselling as private as an office visit?', detail: 'The session itself is — secure video, no waiting room, and confidentiality bound by the same professional standards either way. The private space on your end is the one part you control; a parked truck works better than people expect.' },
        { label: 'Does my UFV status get me anything?', detail: 'Yes — UFV’s Chilliwack campus students have campus counselling and the province-wide Here2Talk service at no cost, and student plans commonly reimburse private RCC sessions on top. The student supports page has the full map.' },
        { label: 'What about the drive I was already making?', detail: 'If you have been commuting to an Abbotsford or Langley counsellor and it works, keep it — continuity matters more than format. The people this page is for are the ones for whom the drive is why counselling keeps not happening.' },
        { label: 'Punjabi-speaking options east of Abbotsford', detail: 'Effectively nonexistent locally. Sessions here run in Punjabi or English from anywhere in the valley — for Punjabi-speaking Chilliwack, virtual is not one option among several; it is the option.' },
      ],
    },
  ],

  'online-counselling/kamloops': [
    {
      h2: 'Interior distances, and what they do to therapy',
      body: [
        'Kamloops is the hub of a region where distance is the defining fact of health care. The city itself has counsellors — fewer per capita than the coast, with the waitlists that implies — and the moment you live outside it, in Barriere, Chase, Merritt, Logan Lake or anywhere up the North Thompson, “seeing someone in town” means winter driving on the exact weeks you least have the capacity for it.',
        'That is the honest case for video counselling in the Interior: not that it is more convenient, but that it is the version of weekly therapy that survives January. A session from home happens whether or not the Coquihalla is a mess, and a practice serving all of BC by video is indifferent to which side of the river — or which town — you are on.',
        'TRU students have the same provincial floor as every BC campus: [Here2Talk](https://here2talk.ca), 24/7 and free, plus campus counselling — and student extended-health plans commonly reimburse private RCC sessions when campus waitlists lengthen late in term.',
      ],
    },
    {
      h2: 'Practicalities for Kamloops and the surrounding region',
      list: [
        { label: 'Connection quality outside town', detail: 'Video sessions need a stable connection more than a fast one, and where video strains, sessions can run by phone — a clinical judgement made together rather than a technical failure. Rural connectivity is a real constraint and it is workable.' },
        { label: 'Shift and rotational patterns', detail: 'Mining, rail, health care and wildfire seasons all run on schedules that fixed weekly slots ignore. Evening windows and a functioning waitlist absorb irregular rhythms better than a calendar built for office hours.' },
        { label: 'Interior Health’s public options', detail: 'Public mental-health intake exists and is free; it is also triaged, which in practice means waits for anything non-acute. Private counselling is how people stop waiting — and the two are not exclusive: being on a public list while doing private sessions is common and sensible. The low-cost options page maps the whole landscape.' },
        { label: 'Punjabi-speaking counselling in the Interior', detail: 'Concentrated almost entirely in the Lower Mainland. For Punjabi speakers in Kamloops and the surrounding towns, virtual sessions in Punjabi are, practically speaking, how that service exists at all — a point the Punjabi counselling hub covers region by region.' },
      ],
    },
  ],

  /* --- Retargeting pass, 2026-08-28 evening. Each section below aims an
   * existing page at query phrasings Search Console proves it is being shown
   * for but never says in a heading. Exact-match H2s, direct answers first. */

  'services/trauma-therapy': [
    {
      h2: 'Working with an online trauma therapist',
      body: [
        'The phrase people actually search is "online trauma therapist", and it deserves a direct answer: trauma therapy over secure video is an established practice, not a pandemic improvisation. The structured trauma protocols — EMDR with on-screen or self-administered bilateral stimulation, cognitive processing work, stabilisation and resourcing — all adapt to video, and the [research on video-delivered therapy](/guides/is-online-therapy-as-effective-as-in-person) includes trauma-focused work specifically.',
        'Two things matter more online than in a room, and both are manageable. The first is your space: trauma work needs privacy and a plan for the hour after the session — not a car in a work parking lot before a shift. The second is pacing, which is a clinical skill rather than a format property: a trauma therapist who rushes is a problem in any medium, and one who paces well loses nothing over video. For some people the screen genuinely helps — being in your own home, with your own exits, changes what feels sayable.',
        'And where the work keeps being cut short by the standard hour — a target memory that takes twenty minutes just to access — the [90-minute EMDR intensive](/services/emdr-intensive) exists for exactly that arithmetic, once stability is in place.',
      ],
    },
  ],

  'services/emdr-therapy': [
    {
      h2: 'EMDR online: how the therapy works over video',
      body: [
        'EMDR online replaces the therapist’s moving hand with an on-screen target, alternating audio tones, or self-administered tapping — adaptations with years of clinical use behind them, not workarounds. Everything else about the method is unchanged: the same eight phases, the same preparation before processing, the same closing discipline at the end of every session.',
        'Practically, online EMDR asks for a private room, headphones, and a stable connection — and it removes the commute that would otherwise bracket an emotionally heavy hour on both sides. For the longer [90-minute intensive format](/services/emdr-intensive), that absence of a commute turns out to matter more, not less: the session can end with proper closing and then simply… end, in your own space.',
      ],
    },
  ],

  'services/anxiety-counselling': [
    {
      h2: 'Anxiety counselling online: why the format fits this problem',
      body: [
        'For anxiety specifically, online counselling solves a problem the condition itself creates: the appointment is reachable on the days the anxiety says the drive, the waiting room, or the unfamiliar building is too much. Nobody white-knuckles a commute to get help with the thing the commute triggers.',
        'The evidence base for video-delivered anxiety treatment is among the strongest in all of online therapy — structured approaches like CBT translate almost without loss, and the skills-practice between sessions happens in the exact environment the anxiety lives in, which is a quiet advantage over learning calm in an office you will never be anxious in. The [effectiveness guide](/guides/is-online-therapy-as-effective-as-in-person) covers the research; the free consultation is how you test the fit for yourself.',
      ],
    },
  ],

  'guides/grief-without-a-timeline': [
    {
      h2: 'How long should you wait for bereavement counselling?',
      body: [
        'The question gets asked as if there were a mandatory quarantine, and there is not. The old advice to "wait six months or a year" is a distortion of something true: acute grief in the early weeks is not a disorder, most people move through it carried by their own people, and counselling is not a required part of normal grieving. Nothing about that makes early support wrong — it makes it optional.',
        'A more honest rule: come when the grief is not moving, whenever that is. Right away, if the death was traumatic, if the relationship was complicated, or if there is simply no one to fall apart in front of. Months later, if the numbness never thawed or the wave pattern never started spacing out. Years later, if it calcified into something you walk around. There is no too early that a decent counsellor cannot simply say "this is normal grieving, you may not need me yet" — and no too late.',
      ],
    },
  ],

  'guides/how-the-gottman-method-works': [
    {
      h2: 'Finding Gottman Method couples counselling in British Columbia',
      body: [
        'The Gottman Method is a training, not a franchise — any BC couples therapist may have completed Gottman training levels, and the practical way to find one is to ask directly: which level of training, and how the method structures their assessment and sessions. The Gottman Institute’s own referral directory lists clinicians by region, and "Gottman-trained" is a claim a practitioner should be able to make specific.',
        'At Westpeak Wellness, [couples counselling](/services/couples-therapy) is Gottman-informed and delivered by video across all of BC — which for this method matters less than couples expect, since the assessment questionnaires, the structured conversations and the between-session work translate directly. For how it compares to the other major evidence-based couples approach, the [Gottman vs EFT comparison](/compare/gottman-method-vs-eft-for-couples) sets the two side by side.',
      ],
    },
  ],

  'resources/low-cost-counselling-bc': [
    {
      h2: 'Is therapy free in BC?',
      body: [
        'Some of it, genuinely — and the honest map has three territories. **Free:** health-authority mental-health services, Foundry centres for ages 12–24, Here2Talk for post-secondary students, crisis lines, and community agencies with grant-funded programs. These are real services with real clinicians; their cost is usually time — intake processes and waitlists. **Effectively free:** counselling your extended-health plan reimburses, employee assistance sessions, ICBC- or claim-funded treatment where an entitlement exists. **Paid:** private practice, where the fee buys you choice of counsellor and no waitlist.',
        'What MSP itself covers is narrower than people hope: physician care — including psychiatrists, with a referral — but not counselling in private practice. The [MSP vs extended health explainer](/resources/msp-vs-extended-health) draws that boundary precisely, and everything below on this page is the free-and-low-cost territory itemised.',
      ],
    },
  ],

  'resources/student-mental-health-supports-bc': [
    {
      h2: 'Student counselling in BC: the short version',
      body: [
        'Every post-secondary student in BC has two guaranteed layers before money enters the picture: **campus counselling**, funded by fees at every major institution, and **Here2Talk**, the provincial 24/7 single-session service, free by app, phone or chat for all registered students. High-school students have school counsellors and, for ages 12–24, the Foundry network. None of these require a diagnosis, a referral, or a parent’s involvement for adults.',
        'The honest limits: campus services are short-term models with late-semester waits, and Here2Talk is single-session by design. When a student needs ongoing weekly work, the usual route is private counselling reimbursed through the student union’s extended-health plan — most plans cover Registered Clinical Counsellors, and the annual cap typically funds a meaningful stretch of sessions. Therapists for students, in other words, exist at every price point including zero; the sections below map who qualifies for what.',
      ],
    },
  ],

  'services/couples-therapy': [
    {
      h2: 'Online couples counselling in BC: how two people share one session',
      body: [
        'The phrase people search is "online couples counselling bc", and the practical question inside it is simple: does couples work survive the screen? The structured approaches used here translate directly — assessment questionnaires, guided conversations, between-session practice — and the format solves the scheduling problem that sinks more couples therapy than any clinical issue does: two working adults, one appointment, no babysitter needed for the commute portion of the evening.',
        'The setup that works: both partners on one couch and one camera where possible — the therapist reads the space between you, and sharing a frame keeps that visible. Where life requires it (a rotation, a work trip, a separation-in-progress), three-way video from two locations is workable and sometimes clinically useful. The one non-negotiable is the same as in-person: a private hour, phones down, door shut.',
      ],
    },
  ],

  'services/depression-counselling': [
    {
      h2: 'Depression counselling online: when leaving the house is the barrier',
      body: [
        'For depression specifically, online counselling removes the tax the condition itself levies on getting help: the shower-dress-drive-waiting-room sequence that can consume a whole day’s capacity. A session you can attend from the corner of the couch is not a lesser session — it is the one that actually happens during the weeks when the alternative was cancelling.',
        'Video-delivered treatment for depression carries one of the stronger evidence bases in online therapy, and behavioural approaches adapt naturally: the work happens in the environment where the patterns live. The honest caveat runs the other way — where isolation is a driver, sessions should be a bridge back toward the world, not a reason never to re-enter it, and a decent counsellor holds that line deliberately. The [effectiveness research](/guides/is-online-therapy-as-effective-as-in-person) covers the evidence in full.',
      ],
    },
  ],

  'guides/high-functioning-anxiety': [
    {
      h2: 'What therapy for high-functioning anxiety actually looks like',
      body: [
        'The searched phrase is "high functioning anxiety therapy", and it deserves a concrete answer rather than reassurance. The work usually starts somewhere counterintuitive: not with relaxing, but with mapping what the anxiety is currently *doing for you* — the deadlines it meets, the standards it enforces, the disasters it believes it is preventing. High-functioning anxiety persists precisely because it pays; therapy that ignores the payment gets politely outperformed by the symptom.',
        'From there the work is specific: separating standards from threats (you can keep the excellence and retire the dread that powers it), practising sub-maximal effort on purpose in low-stakes places, letting the body’s alarm complete instead of overriding it, and — often the deepest layer — the history of where performing became the price of safety. Approaches drawn on here include CBT and, where the roots are older than the job, [EMDR](/services/emdr-therapy). None of it requires your performance to collapse first; arriving while everything still looks fine from outside is the standard entry, not the exception.',
      ],
    },
  ],

  'online-counselling/index': [
    {
      h2: '“Counsellor near me”, when the answer is virtual',
      body: [
        'A meaningful share of the people reading this arrived through some version of "counsellor near me" — and for a virtual practice, the honest response is to take the question seriously rather than dodge it. What "near me" is usually asking for is *reachable, soon, and legitimate*: an appointment that fits your week, a practitioner accountable to a real register, sessions that do not require rearranging life to attend. Distance was always a proxy for those things, not the point of them.',
        'Video sessions answer the underlying asks directly — bookable this week, [verifiable in the BCACC register](/resources/verify-a-counsellor-in-bc), attended from wherever you are in BC — and they beat "near" precisely where near fails: evenings, small towns, mobility limits, privacy from a small community, and therapy in Punjabi outside the Lower Mainland. Where an office genuinely matters to you, that is a real preference and the city pages below link honestly to what each community offers locally. For everyone else, "near" turns out to mean "on my laptop, at 7 pm, with someone I checked out in two minutes."',
      ],
    },
  ],

  'resources/msp-vs-extended-health': [
    {
      h2: 'Does MSP cover therapy?',
      body: [
        'The forty-word version, since this is the exact question that brings most people here: **no — MSP does not cover counselling or therapy in private practice.** It covers physician care, which includes psychiatrists reached by referral, and that is the whole of its mental-health reach for most adults.',
        'What pays for therapy in BC instead: extended health benefits through work or school (the common route for Registered Clinical Counsellor sessions), specific entitlements where they apply — ICBC after a crash, CVAP for victims of crime, FNHA coverage — and the genuinely [free and low-cost services](/resources/low-cost-counselling-bc) that exist outside the fee system entirely. The rest of this page draws the boundary precisely, insurer by situation.',
      ],
    },
  ],

  'resources/verify-a-counsellor-in-bc': [
    {
      h2: 'Using BCACC’s find-a-counsellor register',
      body: [
        'The register at bc-counsellors.org does two jobs, and people mostly know only one. It **verifies** — type any counsellor’s name and confirm their registration is current, which is this page’s four-minute check. It also **finds**: the same search filters by community, language and area of focus, which makes it one of the few counsellor directories in BC where every single listing is, by construction, a registered and insured practitioner. A directory that cannot contain an unregistered listing is worth more than one that merely tends not to.',
        'The register covers RCCs only; psychologists and social workers have their own colleges’ registers, linked in the sections above. And for the fuller how-to-choose process — shortlisting, free consultations, the questions worth asking — the [finding a therapist guide](/guides/how-to-find-a-therapist-in-bc) picks up where verification ends.',
      ],
    },
  ],

  'resources/workplace-mental-health-bc': [
    {
      h2: 'The work-and-money cluster, mapped',
      body: [
        'This page is the hub of a set that now covers the whole arc, each piece written to stand alone: [sick days and mental-health days](/guides/sick-days-and-mental-health-days-bc) for the single-day entitlement; [stress leave](/guides/stress-leave-bc) for the full certified-leave picture; [getting the doctor’s note](/guides/doctors-note-for-a-mental-health-leave) for the appointment the leave hinges on; [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy) for the money during it; [returning to work](/guides/return-to-work-after-a-mental-health-leave) for the stretch where leaves either consolidate or unravel; [WorkSafeBC psychological-injury claims](/resources/worksafebc-psychological-injury-claims) for when work caused the injury; and [disability benefits](/resources/disability-benefits-and-counselling-bc) for when 26 weeks is not enough.',
        'If you are reading this in advance of needing it: that is the best time, and the two pages worth reading first are the sick-days one and the stress-leave one — the entitlement you will use casually, and the map you will want ready. And if you are reading it as the employer rather than the employee, the [counselling support for BC teams](/resources/counselling-support-for-bc-teams) page is this cluster from your side of the desk.',
      ],
    },
  ],

  'online-counselling/langley': [
    {
      h2: 'Langley has counsellors. Here is when virtual still wins.',
      body: [
        'Unlike most pages in this set, the honest starting point for Langley is abundance: the City and the Township hold a genuine concentration of counselling practices, and someone who wants an office to drive to has real choices here. A page that pretended otherwise would be advertising, not information.',
        'So the Langley case for virtual is specific rather than general. It is the fastest-growing corner of the Lower Mainland, which means new arrivals without a local anything yet; it is a commuter base for Surrey and Vancouver jobs, which recreates the evening-slot problem the SkyTrain cities know; and it is geographically enormous — Walnut Grove to Aldergrove is a real drive, and “in Langley” on a directory listing can still mean forty minutes away.',
        'The other Langley-specific factor is proximity itself. In a community of connected congregations, schools and businesses, some people specifically do not want their car in a local counsellor’s parking lot. A virtual practice based nowhere nearby is the structural answer to that concern — confidentiality plus distance, which the [privacy page](/privacy) treats as the legitimate consideration it is.',
      ],
    },
    {
      h2: 'Sorting the Langley options quickly',
      list: [
        { label: 'You want in-person, full stop', detail: 'Then use the local abundance — check any candidate in the BCACC register first, use their free consultations, and choose on fit. The how-to-choose guide applies to any practice, including ones that are not this one.' },
        { label: 'Evenings are the constraint', detail: 'Commuters lose the 9-to-5 window entirely, and in-person evening slots are the scarcest resource in local counselling. Video evening sessions from home skip the drive that makes a 6 pm appointment impossible.' },
        { label: 'You just moved here', detail: 'Langley’s growth means thousands of households each year with no local GP, no local anything. A virtual counsellor works from day one and does not need re-choosing if the next move is Abbotsford or back across the river.' },
        { label: 'Punjabi or bilingual sessions', detail: 'Langley’s Punjabi-speaking community is substantial and the local Punjabi-language counselling supply is not. Sessions here run in Punjabi, English, or moving between the two — the comparison page on therapy language covers why that flexibility matters.' },
      ],
    },
  ],
};
