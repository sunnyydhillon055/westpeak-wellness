export type Location = {
  slug: string;
  city: string;
  region: string;
  blurb: string;            // hero one-liner
  metaDescription: string;  // <= 155 chars

  // Rich fields. A city page only earns its place if these can be written with
  // real, checkable local substance — see SEO_AUDIT.md §2. Optional so pages can
  // be deepened one at a time without breaking the build.
  intro?: string[];
  localReality?: { h2: string; body: string[] };
  access?: { label: string; detail: string }[];
  faqs?: { q: string; a: string }[];
  sources?: { label: string; url: string }[];
  nearby?: string[];        // sibling slugs, for across-cluster links
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
  figure2?: string;      // second diagram, further down the page
};

/**
 * Six cities, not forty-three.
 *
 * Westpeak is a fully virtual practice with no office anywhere in BC, so the
 * local map pack is structurally unreachable and a templated "counselling in
 * <city>" page competes only against directories and clinics with real
 * addresses — and loses. A city page is kept ONLY where something true and
 * specific about accessing care from that place changes what the page says.
 * The other 37 are 301'd to /online-counselling in next.config.mjs.
 *
 * AMENDED 2026-08-13. The reasoning above is incomplete, and the correction
 * matters for when this gets revisited.
 *
 * Clearheart Counselling runs ~29 templated /virtual-locations-bc/<city>/
 * pages and ranks page one for Vancouver, Prince George and Kelowna with them.
 * Templated city pages do not inherently lose. They lose WHEN THE DOMAIN HAS
 * NO AUTHORITY TO PUSH THEM — which was, and still is, the situation here.
 * (Clearheart also holds two physical offices, so they are map-pack eligible
 * in a way this practice is not. That is a separate advantage, not the
 * mechanism.)
 *
 * So the retirement was right for a zero-authority site: 37 thin pages would
 * have diluted crawl budget and risked reading as a doorway pattern. But treat
 * it as STAGED, NOT PERMANENT. As authority accumulates more city pages become
 * viable. Revisit at the 12-month mark, and only for slugs where a genuinely
 * deep page can be written — the optional rich fields on Location above are
 * what keep that honest.
 *
 * The strategic response in the meantime is not more city pages. It is query
 * space where the map pack never triggers at all — see lib/targets.ts.
 */
export const locations: Location[] = [
  {
    slug: "prince-george",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Prince George",
    region: "Northern BC",
    blurb: "Northern BC has the thinnest counselling coverage in the province — virtual care is how the gap gets closed.",
    metaDescription:
      "Online counselling for Prince George and Northern BC — EMDR, trauma, anxiety, depression and couples therapy by secure video. Free 15-minute consultation.",
    intro: [
      "If you live in Prince George and have tried to find a counsellor, you already know the shape of the problem: there are not many, the ones who are here fill up, and the wait for a psychiatrist or specialist is longer than almost anywhere else in the province. That is not a failure of effort on anyone's part. It is arithmetic — Northern Health covers roughly two-thirds of BC's landmass for about 300,000 people, and mental-health clinicians cluster where the population does.",
      "Virtual counselling does not fix that arithmetic. What it does is remove distance from the equation entirely. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) working out of the Lower Mainland is exactly as available to you in Prince George as to someone in Burnaby — same 50-minute session, same secure platform, same [BCACC](https://bcacc.ca) code of ethics.",
    ],
    localReality: {
      h2: "What access actually looks like here",
      body: [
        "The gap is documented, not anecdotal. In February 2026 the Canadian Mental Health Association's Northern BC branch reported that its no-barrier counselling program in Prince George — funded as a Northern Health pilot — had supported **103 clients across 519 appointments in ten months and still carried a waitlist of 30 people**. The program paused on 31 March 2026 when the pilot funding concluded.",
        "CMHA Northern BC has also said plainly that in-person, one-to-one services across the north remain sparse, and that people seeking a specialist or psychiatrist in the region routinely wait longer than elsewhere in BC.",
        "None of that means there is nothing available. Northern Health runs mental-health and substance-use services in Prince George — assessment, treatment, counselling, education and referral — delivered in person, by phone, and by video. If you are already connected to those services, staying connected to them is worth doing. Private virtual counselling is a parallel option, not a replacement, and it is most useful when the wait for a public service is longer than you can comfortably hold, or when you want continuity that does not depend on a pilot's funding cycle.",
      ],
    },
    access: [
      { label: "No drive, no weather", detail: "Sessions happen wherever you have a private room and a connection. January in the Interior stops being a scheduling problem." },
      { label: "Continuity if you move or travel", detail: "Work camps, rotations, and moves within BC do not interrupt the work — the practice is licensed to see clients anywhere in the province." },
      { label: "Punjabi-language sessions", detail: "Punjabi-speaking counsellors are concentrated in the Lower Mainland. Virtual access is, for most of Northern BC, the only realistic route to therapy in Punjabi." },
      { label: "Evening appointments", detail: "Weekday evenings by request, which matters for shift work and for parents." },
    ],
    faqs: [
      {
        q: "Can a counsellor in the Lower Mainland legally see me in Prince George?",
        a: "Yes. Registration applies province-wide, so a BC-based Registered Clinical Counsellor can work with clients anywhere in British Columbia by secure video. The same ethical, legal, and privacy standards apply as they would in person.",
      },
      {
        q: "Is virtual counselling actually as good as sitting in a room with someone?",
        a: "For the concerns most people bring — anxiety, depression, trauma, relationship difficulty — the research on video-delivered therapy shows outcomes broadly comparable to in-person work. There are real trade-offs, and they are worth talking through on a consultation. There is a fuller answer in the guide on whether online therapy is as effective as in-person.",
      },
      {
        q: "What if I am in crisis tonight?",
        a: "Westpeak Wellness is not a crisis service and cannot respond to emergencies. Call or text 9-8-8 (Canada, 24/7), or 310-6789 for BC Mental Health Support — no area code needed. In immediate danger, call 911.",
      },
    ],
    sources: [
      { label: "CMHA Northern BC — no-barrier counselling program (Prince George Daily News, Feb 2026)", url: "https://pgdailynews.ca/index.php/2026/02/25/cmha-of-northern-bc-pauses-no-barrier-prince-george-counselling-program-as-pilot-funding-concludes/" },
      { label: "Northern Health — mental health and substance use programs", url: "https://www.northernhealth.ca/services/mental-health-substance-use/programs-and-services" },
      { label: "CMHA Northern BC Branch", url: "https://northernbc.cmha.ca/" },
    ],
    nearby: ["kelowna", "victoria"],
  },

  {
    slug: "surrey",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Surrey",
    region: "Lower Mainland",
    blurb: "Home ground — and the community where the demand for Punjabi-language therapy is highest in the province.",
    metaDescription:
      "Online counselling for Surrey, BC. Therapy in Punjabi or English — EMDR, trauma, anxiety, and couples counselling by secure video.",
    intro: [
      "Surrey is one of the fastest-growing cities in Canada and home to one of the largest Punjabi-speaking populations anywhere outside South Asia. It is also a city where the mental-health conversation has changed enormously in a decade — and where a great many people still have not had it out loud with anyone.",
      "Westpeak Wellness is rooted here. That matters less as a marketing line than as a practical fact about the work: you will not have to explain what *log kya kahenge* means, why moving out is not a straightforward option, or why a family's expectations carry the weight they do. That context is the starting point rather than something to be established first.",
    ],
    localReality: {
      h2: "What is specific about seeking therapy in Surrey",
      body: [
        "The barrier here is usually not availability — Surrey has more Punjabi-speaking counsellors than anywhere else in BC. It is **privacy**. [Punjabi-speaking counselling for Surrey](/punjabi-counselling/surrey) is written about that specifically — why the counsellor who comes recommended is often the one connected to the people you would least want to know. In a community this interconnected, the concern people voice most often is not whether therapy works. It is who might see them walking into a clinic, and whether it will get back to family.",
        "That concern is not paranoia, and it is not something to be talked out of. It is a realistic assessment of how information moves in a tight community. A fully virtual practice answers it directly: there is no waiting room, no parking lot, and no building. Nobody sees you arrive because there is nowhere to arrive.",
        "The second pattern specific to this community is who tends to come first. Frequently it is the second generation — adults in their twenties and thirties who grew up here, carry the family's expectations, and are the first in the family to consider therapy at all. There is often no template and nobody to ask. That is covered in more depth on the page for [first- and second-generation South Asian adults](/for/first-gen-south-asian-adults).",
      ],
    },
    access: [
      { label: "No one sees you attend", detail: "The most common reason people here choose virtual over a local clinic. No waiting room, no building, no chance encounter." },
      { label: "Punjabi, English, or both", detail: "Including switching mid-sentence, which is how a lot of people in Surrey actually think and speak." },
      { label: "Evening appointments", detail: "By request — useful when you live with family and daytime privacy is the harder problem." },
      { label: "Continuity if you move", detail: "Registration covers all of BC, so a move to Abbotsford, Vancouver, or anywhere in the province does not end the work." },
    ],
    faqs: [
      { q: "Will anyone in my family find out?", a: "No. Counselling is confidential, and whether you tell anyone is entirely your decision. Because sessions are virtual there is no clinic to be seen entering. The only limits on confidentiality are risk of serious harm and a court order." },
      { q: "Can I have sessions in Punjabi?", a: "Yes — in Punjabi, English, or moving between them within a session. You do not need to decide in advance which you want." },
      { q: "I live with family and have no private space. What do people do?", a: "This is one of the most common practical questions here, and there are workable answers — a parked car, a session scheduled during a work break from the office, headphones and a closed door. It is worth raising on the consultation call so it can be solved before the first session rather than during it." },
    ],
    sources: [
      { label: "Fraser Health — mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["vancouver", "abbotsford"],
  },

  {
    slug: "vancouver",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Vancouver",
    region: "Lower Mainland",
    blurb: "The most therapists in the province, and still a waitlist — because the constraint here is affordability, not supply.",
    metaDescription:
      "Online counselling for Vancouver, BC — EMDR, trauma, anxiety, depression and couples therapy by secure video, in English or Punjabi. Free consultation.",
    intro: [
      "Vancouver has more counsellors per capita than anywhere else in British Columbia. It is also the city where people most often report giving up on finding one — which sounds contradictory until you look at what the actual constraint is.",
      "It is not supply. It is cost, time, and the specific difficulty of finding someone who is both a genuine fit and currently accepting clients. In a city where housing already takes an outsized share of income, a $140 weekly session is a real decision rather than an obvious one.",
    ],
    localReality: {
      h2: "The Vancouver-specific obstacles",
      body: [
        "**Cost against cost of living.** Vancouver consistently ranks among the least affordable cities in Canada. Therapy competes directly with rent in a way it does not in most of the province, which is why it is worth checking [what your extended health plan reimburses](/resources/bc-extended-health-coverage-for-counselling) — and what [free and low-cost options exist across BC](/resources/low-cost-counselling-bc) — before deciding you cannot afford it.",
        "**Time and geography.** A 50-minute session that requires crossing the city at 5pm is not a 50-minute commitment; it is closer to two hours. That is the single most common reason people book therapy and then quietly stop going. Removing the travel changes the arithmetic — a session becomes something that fits in a lunch break or between the end of work and dinner.",
        "**Isolation in density.** Vancouver has a well-documented reputation for being a hard city to make friends in, particularly for people who moved here as adults. A great deal of what comes up in this work is not a diagnosable condition at all — it is loneliness in a place where everyone appears to have arrived with their social life already assembled.",
      ],
    },
    access: [
      { label: "No commute attached to the session", detail: "In a city where cross-town travel can double the time cost of an appointment, this is usually what determines whether people keep going." },
      { label: "Lunch-break appointments", detail: "A session from a closed office or a parked car is entirely workable, and removes the need to explain an absence." },
      { label: "It follows you", detail: "Moving within BC — common here — does not mean starting again with someone new." },
    ],
    faqs: [
      { q: "Is virtual therapy cheaper than in-person?", a: "Fees here are the same either way. What virtual removes is the surrounding cost: transit or parking, and the hour or more of travel that an in-person appointment adds to a working day." },
      { q: "I have extended health through work. Will it cover this?", a: "Most BC plans that list Registered Clinical Counsellors will. Some list only psychologists and social workers, so it is worth checking the exact wording — the extended health coverage page explains what to look for." },
      { q: "What if I cannot afford private fees?", a: "Vancouver Coastal Health runs free mental-health services, and there is a broader set of free and low-cost options across BC worth checking before paying out of pocket. Those are listed on the free and low-cost counselling page." },
    ],
    sources: [
      { label: "Vancouver Coastal Health — mental health and substance use", url: "https://www.vch.ca/en/health-topics/mental-health" },
      { label: "CMHA BC — programs and services", url: "https://cmha.bc.ca/" },
    ],
    nearby: ["surrey", "victoria"],
  },

  {
    slug: "abbotsford",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Abbotsford",
    region: "Fraser Valley",
    blurb: "Fraser Valley distances make virtual sessions less a convenience than the thing that makes attending possible.",
    metaDescription:
      "Online counselling for Abbotsford and the Fraser Valley. Therapy in Punjabi or English — EMDR, trauma, anxiety, and couples sessions.",
    intro: [
      "Abbotsford sits in a particular gap. It is large enough to have services, far enough from Vancouver that accessing the Lower Mainland's depth of specialists means a real commitment of a day, and spread out enough that even a local appointment can involve a significant drive.",
      "It also has one of the largest Punjabi-speaking communities in Canada, with much the same dynamic as Surrey — a strong community, and a corresponding concern about privacy that keeps people from walking into a local clinic.",
    ],
    localReality: {
      h2: "Distance, agriculture, and privacy",
      body: [
        "**The Valley is spread out.** For people in Abbotsford's rural areas, or in Mission, Chilliwack, or further east, a counselling appointment has historically meant driving — and that drive is the reason a lot of courses of therapy quietly end after three or four sessions. Virtual sessions remove that variable entirely.",
        "**Agricultural and seasonal work does not fit a 9-to-5 appointment slot.** The Valley's economy includes a significant agricultural workforce with seasonal peaks and long days during them. Evening availability, and the ability to attend without losing travel time either side, is the practical difference between possible and not.",
        "**Privacy operates the same way it does in Surrey.** In a community where families know each other, being seen entering a counselling office carries a weight that is entirely rational to want to avoid. A virtual practice removes the question.",
        "For the broader picture of what this work involves within South Asian families, [the guide on intergenerational trauma](/guides/intergenerational-trauma-explained) covers the patterns that come up most.",
      ],
    },
    access: [
      { label: "No drive, in any weather", detail: "Valley fog, winter roads, and harvest-season hours stop being scheduling obstacles." },
      { label: "Serves the wider Valley", detail: "Mission, Chilliwack, Hope, and rural areas east of Abbotsford, with no travel penalty for being further out." },
      { label: "Punjabi or English", detail: "Including both within a session — with no need to travel to the Lower Mainland to access it." },
      { label: "No local clinic to be seen at", detail: "The privacy concern that keeps many people in a tight community from booking at all." },
    ],
    faqs: [
      { q: "Do you serve Mission, Chilliwack, and Hope?", a: "Yes. The practice is virtual and covers all of British Columbia, so anywhere in the Fraser Valley works the same as anywhere else — with no additional travel for you." },
      { q: "Can I have sessions in Punjabi?", a: "Yes, in Punjabi, English, or a mix of both — and without needing to travel to Surrey or Vancouver to find it." },
      { q: "What if my internet is unreliable out here?", a: "Turning the camera off cuts the bandwidth a session needs considerably, and it is worth agreeing in advance what happens if a connection drops mid-session so that it is an inconvenience rather than an interruption to the work." },
    ],
    sources: [
      { label: "Fraser Health — mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["surrey", "vancouver"],
  },

  {
    slug: "victoria",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Victoria",
    region: "Vancouver Island",
    blurb: "On the Island, specialist care has often meant a ferry, a day off, and a return sailing. It no longer has to.",
    metaDescription:
      "Online counselling for Victoria and Vancouver Island. EMDR, trauma, anxiety, and couples therapy by secure video, in English or Punjabi.",
    intro: [
      "Victoria has a solid local counselling community, and for a lot of people it covers what they need. Where it runs out is specialisation — a particular modality, a particular language, or a practitioner with specific experience in what you are bringing.",
      "Historically the answer was a ferry. A single appointment on the mainland means a sailing each way, a day given up, and a cost that turns weekly therapy into an impossibility. Which meant the practical choice was usually not \"which practitioner is the best fit\" but \"which practitioner is on this side of the water\".",
    ],
    localReality: {
      h2: "What the water actually costs",
      body: [
        "The Strait is not a minor inconvenience for continuity of care. Weekly therapy requiring a return sailing is not something most people can sustain financially or logistically, so Island residents have effectively been choosing from a smaller pool than mainland residents — not because of anything about the clinicians here, but because of geography.",
        "Virtual sessions remove that constraint entirely. A counsellor on the mainland is exactly as available as one in Fairfield: same 50 minutes, same platform, same [BCACC](https://bcacc.ca) obligations, no sailing.",
        "**Language access is the sharpest version of this.** Punjabi-speaking clinicians in BC are concentrated overwhelmingly in the Lower Mainland. For Island residents wanting [therapy in Punjabi](/services/punjabi-counselling), virtual sessions are not a convenience — they are realistically the only route. The same argument, with the local numbers, is on the [Kamloops](/punjabi-counselling/kamloops) and [Prince George](/punjabi-counselling/prince-george) pages.",
        "The same applies further up-Island. Nanaimo, the Comox Valley, Campbell River, and the west coast communities have thinner local coverage again, and the gap widens the further north you go.",
      ],
    },
    access: [
      { label: "No sailing, no day lost", detail: "The main practical change. Weekly work becomes sustainable in a way a ferry schedule never allowed." },
      { label: "Access to mainland specialisation", detail: "Modality and language options that were previously a full travel day away." },
      { label: "Works up-Island too", detail: "Nanaimo, Courtenay, Campbell River, and smaller communities where local options thin out considerably." },
      { label: "Continuity through moves", detail: "Island to mainland or back — common here — without restarting with a new counsellor." },
    ],
    faqs: [
      { q: "Can a mainland counsellor see me on the Island?", a: "Yes. Registration is province-wide, so a BC-registered counsellor can work with clients anywhere in British Columbia by secure video, under the same ethical and privacy standards as in person." },
      { q: "Do you work with people further up-Island?", a: "Yes — Nanaimo, Duncan, the Comox Valley, Campbell River, and smaller communities. Distance from Victoria makes no difference to a virtual session." },
      { q: "Is online therapy actually as good as in-person?", a: "The research finds outcomes broadly comparable for the concerns most people bring, with some genuine trade-offs. The guide on online versus in-person therapy sets out both sides." },
    ],
    sources: [
      { label: "Island Health — mental health and substance use services", url: "https://www.islandhealth.ca/our-services/mental-health-substance-use-services" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["vancouver", "prince-george"],
  },

  {
    slug: "kelowna",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Kelowna",
    region: "Okanagan",
    blurb: "The Okanagan's population has grown faster than its mental-health services have — and specialist options remain thin.",
    metaDescription:
      "Online counselling for Kelowna and the Central Okanagan. EMDR, trauma, anxiety, and couples therapy by secure video, English or Punjabi.",
    intro: [
      "Kelowna has grown quickly, and it has grown in a specific way: retirees, remote workers who left the coast, students at UBC Okanagan, and a large seasonal workforce in agriculture and tourism. Health and social services have not expanded at the same pace, and mental health is where that gap shows most clearly.",
      "The result is that local options exist but fill up, and the specialist end — a particular modality, a particular language — is thin enough that many people do without.",
    ],
    localReality: {
      h2: "What the Okanagan gap looks like",
      body: [
        "**Specialisation is the scarce thing, not counsellors in general.** If what you need is a practitioner trained in a specific approach for what you are carrying, the Central Okanagan list is short — and a short list with waitlists is not a choice.",
        "**Language access is scarcer still.** The Okanagan has a long-established South Asian community, particularly through agriculture, and few Punjabi-speaking clinicians. Virtual sessions are, for most people here, the only realistic route to [counselling in Punjabi](/services/punjabi-counselling) — and [Punjabi-speaking counselling for Kelowna](/punjabi-counselling/kelowna) covers what is and is not available locally.",
        "**Seasonal work resists standard scheduling.** Agricultural and tourism employment peaks hard, and during a peak a fixed weekly daytime appointment is not attendable. Flexibility about timing, and no travel either side, is what makes therapy possible rather than theoretical during those months.",
        "**Wildfire seasons have left a mark.** Recent years in the Interior have included evacuations, property loss, and repeated summers of smoke and alert. That is a genuine and recurring source of anxiety and trauma in this region, and it is the kind of thing people tend to describe as \"everyone went through it\" rather than as something worth addressing. It is worth addressing — [trauma therapy](/services/trauma-therapy) and [EMDR](/services/emdr-therapy) are both well suited to a specific, identifiable event.",
      ],
    },
    access: [
      { label: "Reaches specialisation that is not local", detail: "Modality and language options that the Central Okanagan list does not currently include." },
      { label: "Works around seasonal peaks", detail: "Evening appointments by request, and no travel time either side of the session." },
      { label: "Covers the wider Okanagan", detail: "West Kelowna, Vernon, Penticton, and the smaller Interior communities where local coverage thins further." },
      { label: "Continues through evacuation or travel", detail: "Anywhere in BC with a connection — which in a wildfire season is not a hypothetical benefit." },
    ],
    faqs: [
      { q: "Do you work with people in Vernon, Penticton, or West Kelowna?", a: "Yes. The practice covers all of British Columbia, so anywhere in the Okanagan works identically — and smaller communities gain the most, since local options are thinnest there." },
      { q: "Can I get counselling about wildfire evacuation or loss?", a: "Yes. Evacuation, property loss, and repeated seasons of alert are legitimate reasons to seek support, and the fact that a whole community experienced it does not make your response to it less real." },
      { q: "Are sessions available in Punjabi?", a: "Yes — in Punjabi, English, or both, without needing to travel to the coast to find it." },
    ],
    sources: [
      { label: "Interior Health — mental health and substance use services", url: "https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["prince-george", "vancouver"],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);

// The 37 retired city slugs and their 301s live in next.config.mjs.
