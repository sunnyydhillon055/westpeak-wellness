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
 * Westpeak is a fully virtual practice, so a templated "counselling in <city>"
 * page competes against directories and clinics with real addresses — and
 * loses.
 *
 * CORRECTED 31 Aug 2026. This used to say the practice has "no office anywhere
 * in BC, so the local map pack is structurally unreachable". The second half
 * was false and had been for years: the practice holds a Google Business
 * Profile registered in White Rock, with four reviews, older than this
 * website. The map pack is reachable — from one pin, in one city.
 *
 * That does not resurrect the other 36 slugs. It does mean the reasoning below
 * rests on authority, not on eligibility, and that WHITE ROCK is a different
 * case from every other city here: it is where the practice already has a
 * local entity a search engine recognises. Its page was written the same day
 * this note was. A city page is kept ONLY where something true and
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
    blurb: "Northern BC has the thinnest counselling coverage in the province, virtual care is how the gap gets closed.",
    metaDescription:
      "Online counselling for Prince George and Northern BC: EMDR, trauma, anxiety, depression and couples therapy by secure video. Free 15-minute consultation.",
    intro: [
      "If you live in Prince George and have tried to find a counsellor, you already know the shape of the problem: there are not many, the ones who are here fill up, and the wait for a psychiatrist or specialist is longer than almost anywhere else in the province. That is not a failure of effort on anyone's part. It is arithmetic: Northern Health covers roughly two-thirds of BC's landmass for about 300,000 people, and mental-health clinicians cluster where the population does.",
      "Virtual counselling does not fix that arithmetic. What it does is remove distance from the equation entirely. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) working out of the Lower Mainland is exactly as available to you in Prince George as to someone in Burnaby: same 50-minute session, same secure platform, same [BCACC](https://bcacc.ca) code of ethics.",
    ],
    localReality: {
      h2: "What access actually looks like here",
      body: [
        "The gap is documented, not anecdotal. In February 2026 the Canadian Mental Health Association's Northern BC branch reported that its no-barrier counselling program in Prince George, funded as a Northern Health pilot, had supported **103 clients across 519 appointments in ten months and still carried a waitlist of 30 people**. The program paused on 31 March 2026 when the pilot funding concluded.",
        "CMHA Northern BC has also said plainly that in-person, one-to-one services across the north remain sparse, and that people seeking a specialist or psychiatrist in the region routinely wait longer than elsewhere in BC.",
        "None of that means there is nothing available. Northern Health runs mental-health and substance-use services in Prince George: assessment, treatment, counselling, education and referral: delivered in person, by phone, and by video. If you are already connected to those services, staying connected to them is worth doing. Private virtual counselling is a parallel option, not a replacement, and it is most useful when the wait for a public service is longer than you can comfortably hold, or when you want continuity that does not depend on a pilot's funding cycle.",
        "Those figures describe counselling in English. Add the requirement that the counsellor speak Punjabi and the local supply does not thin out. It disappears, and the nearest with an office is roughly eight hours south. [Punjabi-speaking counselling for Prince George](/punjabi-counselling/prince-george) covers that specifically, with the local numbers.",
      ],
    },
    access: [
      { label: "No drive, no weather", detail: "Sessions happen wherever you have a private room and a connection. January in the Interior stops being a scheduling problem." },
      { label: "Continuity if you move or travel", detail: "Work camps, rotations, and moves within BC do not interrupt the work. The practice is licensed to see clients anywhere in the province." },
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
        a: "For the concerns most people bring: anxiety, depression, trauma, relationship difficulty. The research on video-delivered therapy shows outcomes broadly comparable to in-person work. There are real trade-offs, and they are worth talking through on a consultation. There is a fuller answer in the guide on whether online therapy is as effective as in-person.",
      },
      {
        q: "What if I am in crisis tonight?",
        a: "Westpeak Wellness is not a crisis service and cannot respond to emergencies. Call or text 9-8-8 (Canada, 24/7), or 310-6789 for BC Mental Health Support. No area code needed. In immediate danger, call 911.",
      },
      {
        q: "I am on a Northern Health waitlist already. Should I come off it?",
        a: "No, stay on it. Public and private care are not mutually exclusive, and the public services are worth keeping regardless of what you do here. Private virtual counselling is most useful as something that starts now rather than something that replaces what you are waiting for. If the public service comes through and suits you better, that is a good outcome.",
      },
      {
        q: "I work a camp rotation. Can I have sessions from site?",
        a: "Often yes, and it is worth testing the connection before booking rather than discovering it mid-session. Camp internet varies enormously. Turning the camera off cuts the bandwidth a session needs considerably, and scheduling around a rotation, blocks with gaps rather than the same weekday for six months, is the normal pattern here rather than the exception.",
      },
      {
        q: "Winter here is long. Does that actually come up in counselling?",
        a: "Frequently, and it is not a small thing. Prince George gets meaningfully less daylight in December than the south coast, and low mood that arrives every year on roughly the same schedule is a real pattern rather than a character flaw. It responds to treatment, and it is worth naming rather than waiting out.",
      },
    ],
    sources: [
      { label: "CMHA Northern BC, no-barrier counselling program (Prince George Daily News, Feb 2026)", url: "https://pgdailynews.ca/index.php/2026/02/25/cmha-of-northern-bc-pauses-no-barrier-prince-george-counselling-program-as-pilot-funding-concludes/" },
      { label: "Northern Health, mental health and substance use programs", url: "https://www.northernhealth.ca/services/mental-health-substance-use/programs-and-services" },
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
    blurb: "Home ground, and the community where the demand for Punjabi-language therapy is highest in the province.",
    metaDescription:
      "Online counselling for Surrey, BC. Therapy in Punjabi or English: EMDR, trauma, anxiety, and couples counselling by secure video.",
    intro: [
      "Surrey is one of the fastest-growing cities in Canada and home to one of the largest Punjabi-speaking populations anywhere outside South Asia. It is also a city where the mental-health conversation has changed enormously in a decade, and where a great many people still have not had it out loud with anyone.",
      "Westpeak Wellness is rooted here. That matters less as a marketing line than as a practical fact about the work: you will not have to explain what *log kya kahenge* means, why moving out is not a straightforward option, or why a family's expectations carry the weight they do. That context is the starting point rather than something to be established first.",
    ],
    localReality: {
      h2: "What is specific about seeking therapy in Surrey",
      body: [
        "The barrier here is usually not availability, Surrey has more Punjabi-speaking counsellors than anywhere else in BC. It is **privacy**. [Punjabi-speaking counselling for Surrey](/punjabi-counselling/surrey) is written about that specifically, why the counsellor who comes recommended is often the one connected to the people you would least want to know. In a community this interconnected, the concern people voice most often is not whether therapy works. It is who might see them walking into a clinic, and whether it will get back to family.",
        "That concern is not paranoia, and it is not something to be talked out of. It is a realistic assessment of how information moves in a tight community. A fully virtual practice answers it directly: there is no waiting room, no parking lot, and no building. Nobody sees you arrive because there is nowhere to arrive.",
        "The second pattern specific to this community is who tends to come first. Frequently it is the second generation: adults in their twenties and thirties who grew up here, carry the family's expectations, and are the first in the family to consider therapy at all. There is often no template and nobody to ask. That is covered in more depth on the page for [first- and second-generation South Asian adults](/for/first-gen-south-asian-adults).",
      ],
    },
    access: [
      { label: "No one sees you attend", detail: "The most common reason people here choose virtual over a local clinic. No waiting room, no building, no chance encounter." },
      { label: "Punjabi, English, or both", detail: "Including switching mid-sentence, which is how a lot of people in Surrey actually think and speak." },
      { label: "Evening appointments", detail: "By request, useful when you live with family and daytime privacy is the harder problem." },
      { label: "Continuity if you move", detail: "Registration covers all of BC, so a move to Abbotsford, Vancouver, or anywhere in the province does not end the work." },
    ],
    faqs: [
      { q: "Will anyone in my family find out?", a: "No. Counselling is confidential, and whether you tell anyone is entirely your decision. Because sessions are virtual there is no clinic to be seen entering. The only limits on confidentiality are risk of serious harm and a court order." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or moving between them within a session. You do not need to decide in advance which you want." },
      { q: "I live with family and have no private space. What do people do?", a: "This is one of the most common practical questions here, and there are workable answers, a parked car, a session scheduled during a work break from the office, headphones and a closed door. It is worth raising on the consultation call so it can be solved before the first session rather than during it." },
      { q: "Surrey has plenty of Punjabi-speaking counsellors. Why look outside it?", a: "For many people there is no reason to, and you would be told so on a consultation call. The reason people write in from Surrey is narrower: in a community this interconnected, the counsellor who comes recommended is often connected to the very people you would least want to know you are going. Confidentiality is a legal duty everywhere, distance is what makes it feel true." },
      { q: "I am the first person in my family to consider therapy. Where do I even start?", a: "That is the most common position people arrive in from Surrey, and there is no template because the generation before did not have one either. A free 15-minute consultation is a reasonable place to work out what you are actually looking for, with no obligation attached, and if somebody else would be a better fit, you would be told that plainly." },
      { q: "Do my parents have to be involved if the problem is my parents?", a: "No. Individual counselling is yours, and what you discuss stays confidential within the usual legal limits. Some people later choose to bring a family member into a session and some never do; both are ordinary. Nothing is disclosed to family because they asked." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["vancouver", "abbotsford"],
  },

  {
    slug: "vancouver",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Vancouver",
    region: "Lower Mainland",
    blurb: "The most therapists in the province, and still a waitlist, because the constraint here is affordability, not supply.",
    metaDescription:
      "Online counselling for Vancouver, BC: EMDR, trauma, anxiety, depression and couples therapy by secure video, in English or Punjabi. Free consultation.",
    intro: [
      "Vancouver has more counsellors per capita than anywhere else in British Columbia. It is also the city where people most often report giving up on finding one, which sounds contradictory until you look at what the actual constraint is.",
      "It is not supply. It is cost, time, and the specific difficulty of finding someone who is both a genuine fit and currently accepting clients. In a city where housing already takes an outsized share of income, a $140 weekly session is a real decision rather than an obvious one.",
    ],
    localReality: {
      h2: "The Vancouver-specific obstacles",
      body: [
        "**Cost against cost of living, with the actual number attached.** In the first quarter of 2025 Vancouver had **the highest average asking rent for a two-bedroom apartment in Canada, at $3,170**: ahead of Toronto, Victoria and Ottawa. Against a figure like that, a $140 weekly session is not an obvious decision, and treating it as one would be dishonest. Therapy competes directly with rent here in a way it does not in most of the province, which is exactly why it is worth checking [what your extended health plan reimburses](/resources/bc-extended-health-coverage-for-counselling), and what [free and low-cost options exist across BC](/resources/low-cost-counselling-bc), before deciding you cannot afford it.",
        "**Language access is quietly harder here than the city's reputation suggests.** Vancouver is one of the most linguistically diverse cities in the country, but Punjabi is only the fifth mother tongue at 2.0%, well behind Cantonese and Mandarin, so services offered \"in your language\" here usually are not. [Punjabi-speaking counselling for Vancouver](/punjabi-counselling/vancouver) covers what that means in practice, and why the answer has historically been a trip to Surrey.",
        "**Time and geography.** A 50-minute session that requires crossing the city at 5pm is not a 50-minute commitment; it is closer to two hours. That is the single most common reason people book therapy and then quietly stop going. Removing the travel changes the arithmetic. A session becomes something that fits in a lunch break or between the end of work and dinner.",
        "**Isolation in density.** Vancouver has a well-documented reputation for being a hard city to make friends in, particularly for people who moved here as adults. A great deal of what comes up in this work is not a diagnosable condition at all. It is loneliness in a place where everyone appears to have arrived with their social life already assembled.",
      ],
    },
    access: [
      { label: "No commute attached to the session", detail: "In a city where cross-town travel can double the time cost of an appointment, this is usually what determines whether people keep going." },
      { label: "Lunch-break appointments", detail: "A session from a closed office or a parked car is entirely workable, and removes the need to explain an absence." },
      { label: "It follows you", detail: "Moving within BC, common here, does not mean starting again with someone new." },
    ],
    faqs: [
      { q: "Is virtual therapy cheaper than in-person?", a: "Fees here are the same either way. What virtual removes is the surrounding cost: transit or parking, and the hour or more of travel that an in-person appointment adds to a working day." },
      { q: "I have extended health through work. Will it cover this?", a: "Most BC plans that list Registered Clinical Counsellors will. Some list only psychologists and social workers, so it is worth checking the exact wording, the extended health coverage page explains what to look for." },
      { q: "What if I cannot afford private fees?", a: "Vancouver Coastal Health runs free mental-health services, and there is a broader set of free and low-cost options across BC worth checking before paying out of pocket. Those are listed on the free and low-cost counselling page." },
      { q: "Can I have sessions in Punjabi without going to Surrey?", a: "Yes, and that is most of why the Vancouver Punjabi page exists. Punjabi is the fifth mother tongue in Vancouver proper and the community's clinicians and institutions are largely across the river, so the historic answer has been a bridge and most of an evening. Sessions here run in Punjabi, English, or moving between them, from wherever you are." },
      { q: "I just moved here and do not know anyone. Is that a reason to come?", a: "Yes, and it is one of the more common ones. Vancouver has a well-documented reputation as a hard city to build a social life in, particularly for people who arrived as adults, and a great deal of what comes up in this work is not a diagnosable condition at all. It is loneliness in a place where everyone appears to have arrived with their friendships already assembled. That is worth working on rather than waiting out." },
      { q: "Does a session have to be from home? I have roommates.", a: "No, and in this city that question comes up constantly. A closed office, a booked meeting room, a parked car, all of them work, and headphones do more for privacy than most people expect. It is worth raising on the consultation call so it is solved before the first session rather than during it." },
    ],
    sources: [
      { label: "Vancouver Coastal Health, mental health and substance use", url: "https://www.vch.ca/en/health-topics/mental-health" },
      { label: "CMHA BC, programs and services", url: "https://cmha.bc.ca/" },
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
      "Online counselling for Abbotsford and the Fraser Valley. Therapy in Punjabi or English: EMDR, trauma, anxiety, and couples sessions.",
    intro: [
      "Abbotsford sits in a particular gap. It is large enough to have services, far enough from Vancouver that accessing the Lower Mainland's depth of specialists means a real commitment of a day, and spread out enough that even a local appointment can involve a significant drive.",
      "It also has one of the largest Punjabi-speaking communities in Canada, and the scale of it is easy to underestimate from outside: in the 2021 census **Punjabi was the mother tongue of 34,280 Abbotsford residents, 22.6% of the city**, second only to English at 61%. Nearly a quarter of a city is not a minority community in any ordinary sense. It brings much the same dynamic as Surrey. A strong community, and a corresponding concern about privacy that keeps people from walking into a local clinic.",
    ],
    localReality: {
      h2: "Distance, agriculture, and privacy",
      body: [
        "**The Valley is spread out.** For people in Abbotsford's rural areas, or in Mission, Chilliwack, or further east, a counselling appointment has historically meant driving, and that drive is the reason a lot of courses of therapy quietly end after three or four sessions. Virtual sessions remove that variable entirely.",
        "**Agricultural and seasonal work does not fit a 9-to-5 appointment slot.** The Valley's economy includes a significant agricultural workforce with seasonal peaks and long days during them. Evening availability, and the ability to attend without losing travel time either side, is the practical difference between possible and not.",
        "**Privacy operates the way it does in Surrey, only with less room.** In a community where families know each other, being seen entering a counselling office carries a weight that is entirely rational to want to avoid. What makes Abbotsford its own case rather than a smaller Surrey is the arithmetic: a comparable share of the population in a city less than a third the size means fewer degrees of separation available, not more. [Punjabi-speaking counselling for Abbotsford](/punjabi-counselling/abbotsford) is written about that specifically. A virtual practice removes the question entirely. There is no building to be seen at.",
        "For the broader picture of what this work involves within South Asian families, [the guide on intergenerational trauma](/guides/intergenerational-trauma-explained) covers the patterns that come up most.",
      ],
    },
    access: [
      { label: "No drive, in any weather", detail: "Valley fog, winter roads, and harvest-season hours stop being scheduling obstacles." },
      { label: "Serves the wider Valley", detail: "Mission, Chilliwack, Hope, and rural areas east of Abbotsford, with no travel penalty for being further out." },
      { label: "Punjabi or English", detail: "Including both within a session, with no need to travel to the Lower Mainland to access it." },
      { label: "No local clinic to be seen at", detail: "The privacy concern that keeps many people in a tight community from booking at all." },
    ],
    faqs: [
      { q: "Do you serve Mission, Chilliwack, and Hope?", a: "Yes. The practice is virtual and covers all of British Columbia, so anywhere in the Fraser Valley works the same as anywhere else, with no additional travel for you." },
      { q: "Can I have sessions in Punjabi?", a: "Yes, in Punjabi, English, or a mix of both, and without needing to travel to Surrey or Vancouver to find it." },
      { q: "What if my internet is unreliable out here?", a: "Turning the camera off cuts the bandwidth a session needs considerably, and it is worth agreeing in advance what happens if a connection drops mid-session so that it is an inconvenience rather than an interruption to the work." },
      { q: "There are Punjabi-speaking counsellors in Abbotsford already. Why this?", a: "For plenty of people there is no reason, and you would be told so on a consultation call, if a local office suits you, book locally with a clear conscience. The people who write in from Abbotsford are usually those for whom the local option carries a privacy cost: a familiar waiting room, a counsellor connected to the same community, a car recognised outside a clinic on a main road." },
      { q: "I work the berry season. Can counselling fit around that?", a: "Yes, and planning for it from the start works far better than discovering it in July. Agricultural and greenhouse work here runs on a season, and a schedule assuming the same weekday at the same time for six months does not survive contact with a peak. Booking block by block, with gaps, is a normal pattern and nothing is lost by pausing." },
      { q: "Is Abbotsford close enough to Surrey that I should just look there?", a: "You can, and the choice is wider. What it costs is the drive and the same privacy question one city over. The Fraser Valley and Surrey's South Asian communities are not separate worlds, and for some people a counsellor in Surrey is closer to home socially than geographically. A practice with no office in either place is a different proposition." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
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
      "Victoria has a solid local counselling community, and for a lot of people it covers what they need. Where it runs out is specialisation, a particular modality, a particular language, or a practitioner with specific experience in what you are bringing.",
      "Historically the answer was a ferry. A single appointment on the mainland means a sailing each way, a day given up, and a cost that turns weekly therapy into an impossibility. Which meant the practical choice was usually not \"which practitioner is the best fit\" but \"which practitioner is on this side of the water\".",
    ],
    localReality: {
      h2: "What the water actually costs",
      body: [
        "The Strait is not a minor inconvenience for continuity of care. Weekly therapy requiring a return sailing is not something most people can sustain financially or logistically, so Island residents have effectively been choosing from a smaller pool than mainland residents, not because of anything about the clinicians here, but because of geography.",
        "**Start with what is free, because in Victoria it is unusually good.** Island Health runs Central Access and Rapid Engagement Services (CARES) at 1119 Pembroke Street, offering **same-day assessment and walk-in counselling** for South Island residents whose mental-health or substance-use concern does not need a hospital: in person or virtually, Monday to Friday, 8:30am to 4:30pm. There is no wait and no referral. If that fits what you need, use it; a practice that did not tell you it exists would not be worth trusting on anything else. Where it runs out is ongoing specialist work, and non-urgent psychiatric care in Victoria has become harder rather than easier as recruitment has failed to keep pace with retirements.",
        "Virtual sessions remove that constraint entirely. A counsellor on the mainland is exactly as available as one in Fairfield: same 50 minutes, same platform, same [BCACC](https://bcacc.ca) obligations, no sailing.",
        "**Language access is the sharpest version of this.** Punjabi-speaking clinicians in BC are concentrated overwhelmingly in the Lower Mainland. For Island residents wanting [therapy in Punjabi](/services/punjabi-counselling), virtual sessions are not a convenience. They are realistically the only route. The same argument, with the local numbers, is on the [Kamloops](/punjabi-counselling/kamloops) and [Prince George](/punjabi-counselling/prince-george) pages.",
        "The same applies further up-Island. Nanaimo, the Comox Valley, Campbell River, and the west coast communities have thinner local coverage again, and the gap widens the further north you go.",
      ],
    },
    access: [
      { label: "No sailing, no day lost", detail: "The main practical change. Weekly work becomes sustainable in a way a ferry schedule never allowed." },
      { label: "Access to mainland specialisation", detail: "Modality and language options that were previously a full travel day away." },
      { label: "Works up-Island too", detail: "Nanaimo, Courtenay, Campbell River, and smaller communities where local options thin out considerably." },
      { label: "Continuity through moves", detail: "Island to mainland or back, common here, without restarting with a new counsellor." },
    ],
    faqs: [
      { q: "Can a mainland counsellor see me on the Island?", a: "Yes. Registration is province-wide, so a BC-registered counsellor can work with clients anywhere in British Columbia by secure video, under the same ethical and privacy standards as in person." },
      { q: "Do you work with people further up-Island?", a: "Yes: Nanaimo, Duncan, the Comox Valley, Campbell River, and smaller communities. Distance from Victoria makes no difference to a virtual session." },
      { q: "Is online therapy actually as good as in-person?", a: "The research finds outcomes broadly comparable for the concerns most people bring, with some genuine trade-offs. The guide on online versus in-person therapy sets out both sides." },
      { q: "Is there something free I should try first?", a: "Yes, and it is genuinely good. Island Health's CARES service at 1119 Pembroke Street offers same-day assessment and walk-in counselling, in person or virtually, with no referral and no wait. If that meets what you need, use it. Private counselling is the better fit when the work is ongoing rather than immediate, or when what you need is specific enough that the local list is short." },
      { q: "Can I have sessions in Punjabi from the Island?", a: "Yes. Punjabi-speaking clinicians in BC are concentrated overwhelmingly in the Lower Mainland, so for Island residents virtual sessions are not a convenience. They are realistically the only route. There is no Island-specific page for this yet, deliberately: the population figure needed to write one honestly could not be sourced, and a page resting on an estimate is not worth having." },
      { q: "I am moving off-Island soon. Is it worth starting?", a: "Yes, and that is one of the better arguments for working this way. Registration covers all of British Columbia, so a move from Victoria to the mainland, or back, which is just as common, does not end the work or mean repeating your history to somebody new. Continuity is worth more to most people than proximity ever was." },
    ],
    sources: [
      { label: "Island Health, mental health and substance use services", url: "https://www.islandhealth.ca/our-services/mental-health-substance-use-services" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["vancouver", "prince-george"],
  },

  {
    slug: "kelowna",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Kelowna",
    region: "Okanagan",
    blurb: "The Okanagan's population has grown faster than its mental-health services have, and specialist options remain thin.",
    metaDescription:
      "Online counselling for Kelowna and the Central Okanagan. EMDR, trauma, anxiety, and couples therapy by secure video, English or Punjabi.",
    intro: [
      "Kelowna has grown quickly, and it has grown in a specific way: retirees, remote workers who left the coast, students at UBC Okanagan, and a large seasonal workforce in agriculture and tourism. Health and social services have not expanded at the same pace, and mental health is where that gap shows most clearly.",
      "The result is that local options exist but fill up, and the specialist end. A particular modality, a particular language, is thin enough that many people do without.",
    ],
    localReality: {
      h2: "What the Okanagan gap looks like",
      body: [
        "**Specialisation is the scarce thing, not counsellors in general.** If what you need is a practitioner trained in a specific approach for what you are carrying, the Central Okanagan list is short, and a short list with waitlists is not a choice.",
        "**Language access is scarcer still.** The Okanagan has a long-established South Asian community, particularly through agriculture, and few Punjabi-speaking clinicians. Virtual sessions are, for most people here, the only realistic route to [counselling in Punjabi](/services/punjabi-counselling), and [Punjabi-speaking counselling for Kelowna](/punjabi-counselling/kelowna) covers what is and is not available locally.",
        "**Seasonal work resists standard scheduling.** Agricultural and tourism employment peaks hard, and during a peak a fixed weekly daytime appointment is not attendable. Flexibility about timing, and no travel either side, is what makes therapy possible rather than theoretical during those months.",
        "**Wildfire seasons have left a mark.** Recent years in the Interior have included evacuations, property loss, and repeated summers of smoke and alert. That is a genuine and recurring source of anxiety and trauma in this region, and it is the kind of thing people tend to describe as \"everyone went through it\" rather than as something worth addressing. It is worth addressing, [trauma therapy](/services/individual-therapy) and [EMDR](/services/emdr-therapy) are both well suited to a specific, identifiable event.",
      ],
    },
    access: [
      { label: "Reaches specialisation that is not local", detail: "Modality and language options that the Central Okanagan list does not currently include." },
      { label: "Works around seasonal peaks", detail: "Evening appointments by request, and no travel time either side of the session." },
      { label: "Covers the wider Okanagan", detail: "West Kelowna, Vernon, Penticton, and the smaller Interior communities where local coverage thins further." },
      { label: "Continues through evacuation or travel", detail: "Anywhere in BC with a connection, which in a wildfire season is not a hypothetical benefit." },
    ],
    faqs: [
      { q: "Do you work with people in Vernon, Penticton, or West Kelowna?", a: "Yes. The practice covers all of British Columbia, so anywhere in the Okanagan works identically, and smaller communities gain the most, since local options are thinnest there." },
      { q: "Can I get counselling about wildfire evacuation or loss?", a: "Yes. Evacuation, property loss, and repeated seasons of alert are legitimate reasons to seek support, and the fact that a whole community experienced it does not make your response to it less real." },
      { q: "Are sessions available in Punjabi?", a: "Yes: in Punjabi, English, or both, without needing to travel to the coast to find it. The Kelowna Punjabi page covers what is and is not available locally, with the census figures behind it." },
      { q: "I work the season. Can sessions stop and start?", a: "Yes, and in the Okanagan that is the normal pattern rather than the exception. Agricultural and hospitality work here runs on a season, and a schedule assuming the same weekday at the same time for six months straight does not survive contact with it. Booking block by block, with gaps, works, and nothing is lost by pausing. Better to plan for that than to book weekly, miss three, and conclude counselling did not suit you." },
      { q: "Is there a free option I should try first?", a: "CMHA Kelowna runs a free virtual counselling programme for adults 25 and over, and it is worth looking at before paying for anything. Interior Health also provides mental-health and substance-use services across the Okanagan. Both are real options and this page is not an argument against using them." },
      { q: "Everyone here went through the fires. Does mine really count?", a: "Yes. A shared experience does not become less real for being shared, and \"other people had it worse\" is one of the most reliable ways people talk themselves out of getting help. Evacuation, property loss and repeated seasons of alert are legitimate reasons to seek support, and a specific, identifiable event is precisely the kind of thing trauma therapy and EMDR are well suited to." },
    ],
    sources: [
      { label: "Interior Health, mental health and substance use services", url: "https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["prince-george", "vancouver", "kamloops"],
  },

  /* KAMLOOPS, ADDED 2026-08-18.
   *
   * Kamloops was the only city on the site present in one cluster and not the
   * other — it had /punjabi-counselling/kamloops and no city page, which meant
   * the whole English-language query space for the Thompson-Nicola was
   * uncovered.
   *
   * ITS ARGUMENT IS NOT PRINCE GEORGE'S, AND THAT MATTERS.
   *
   * Prince George argues scarcity: there is almost nothing here. Kamloops
   * cannot argue that and should not try — it is a genuine regional centre with
   * Interior Health services, a university and a real private sector. The true
   * thing about Kamloops is the opposite and less obvious: it is the HUB, and
   * a hub is defined by how far people drive to reach it. For Clearwater,
   * Barriere, Merritt, Ashcroft, Logan Lake, Chase and Cache Creek, "services
   * are available in Kamloops" already means an hour each way on a highway that
   * is not always open.
   *
   * The Punjabi page for Kamloops carries the census figure and argues language
   * scarcity. This page must not repeat that argument — it links to it instead. */
  {
    slug: "kamloops",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Kamloops",
    region: "Thompson-Nicola",
    blurb: "Kamloops is where the region's services are, which means everyone else in the region drives here for them.",
    metaDescription:
      "Online counselling for Kamloops and the Thompson-Nicola: EMDR, trauma, anxiety, depression and couples therapy by secure video. Free 15-minute consultation.",
    intro: [
      "Kamloops is a regional centre, and it is worth being straightforward about what that means: there are counsellors here, Interior Health runs mental-health and substance-use services from Lansdowne Street, and Thompson Rivers University brings a steady population of students and staff with it. If you live in the city and want to see somebody in person, that is a real and reasonable option.",
      "The thing that is specific about this region is not scarcity in Kamloops. It is that Kamloops is the place the rest of the Thompson-Nicola drives to. For anyone in Clearwater, Barriere, Merritt, Ashcroft, Logan Lake, Chase or Cache Creek, \"available in Kamloops\" already means an hour or more each way, on highways that close.",
    ],
    localReality: {
      h2: "What a hub looks like from outside it",
      body: [
        "The Thompson-Nicola Regional District covers roughly 45,000 square kilometres for about 140,000 people, and rather more than half of them live in Kamloops itself. That distribution is the whole story: the services concentrate where the population does, and the remaining communities are spread across an area larger than several countries.",
        "A weekly appointment that requires a 90-minute drive each way is not a 50-minute commitment; it is most of a day. That is the single most common reason a course of counselling ends after three or four sessions, not because it was not working, but because the travel stopped being sustainable in February. Removing the drive removes the variable.",
        "**Winter is not a footnote here.** The Coquihalla and Highway 5 close, and the 2021 floods took out sections of highway across this region for months. Continuity of care that depends on a road is continuity that stops when the road does.",
        "**Language access is the sharpest version of the same problem.** South Asian residents are the largest racialized group in Kamloops and Punjabi is the most commonly spoken non-official language in the city's homes, but Punjabi-speaking clinical counsellors in the Thompson-Nicola are close to absent, and the nearest with an office is roughly four hours down the Coquihalla. That is covered properly on [Punjabi-speaking counselling for Kamloops](/punjabi-counselling/kamloops).",
        "**Seasonal and shift work resists a standing appointment.** Ranching, forestry, the mills, the mines and the tourism season all peak, and during a peak a fixed weekday-afternoon slot is not attendable by anyone working it.",
      ],
    },
    access: [
      { label: "No drive, in any weather", detail: "Highway closures, winter conditions and a two-hour round trip stop being scheduling problems. For the communities outside Kamloops this is usually the whole difference." },
      { label: "Covers the whole Thompson-Nicola", detail: "Merritt, Clearwater, Barriere, Chase, Ashcroft, Logan Lake and Cache Creek on identical terms, distance is not a factor in a virtual practice." },
      { label: "Punjabi, English, or both", detail: "Without the four-hour drive to the Lower Mainland that has historically been the only route to therapy in Punjabi from here." },
      { label: "Works around shifts and seasons", detail: "Weekday evenings by request, which matters for mill and mine rotations, ranching, and the tourism season." },
      { label: "Continuity through a move", detail: "Registration covers all of BC, so leaving Kamloops, for the coast, for school, for work, does not mean starting again with somebody new." },
    ],
    faqs: [
      {
        q: "There are counsellors in Kamloops. Why would I do this online?",
        a: "If you live in the city and an in-person appointment suits you, that is a perfectly good choice and you would be told so on a consultation call. Virtual makes the clearest difference in two situations: when you are outside Kamloops and the appointment carries an hour of highway each way, and when what you need is specific. A particular approach, or a session in Punjabi, and the local list for that is short.",
      },
      {
        q: "Do you work with people in Merritt, Clearwater or Barriere?",
        a: "Yes, and on identical terms. The practice is registered across British Columbia, so anywhere in the Thompson-Nicola is the same session. The smaller communities gain the most from it, because they are the ones currently paying for access in driving time.",
      },
      {
        q: "What happens if the highway closes or the power goes out?",
        a: "Sessions carry on as long as you have a connection, which is the point, a closed Coquihalla no longer cancels an appointment. If your connection drops mid-session it is worth agreeing in advance what happens, so it is an inconvenience rather than an interruption to the work. Turning the camera off cuts the bandwidth a session needs considerably.",
      },
      {
        q: "Can I have sessions in Punjabi?",
        a: "Yes: in Punjabi, English, or moving between them within a session, without the drive to the Lower Mainland that has historically been the only way to find it from here. The Kamloops Punjabi page covers what is and is not available locally.",
      },
      {
        q: "I am a student at TRU. Is there something cheaper first?",
        a: "Very possibly, and it is worth checking before paying out of pocket. TRU has its own counselling provision, Foundry serves ages 12 to 24 across BC including a virtual service, and there is a broader set of free and low-cost options on the low-cost counselling page. None of that is a sales pitch against them, if a free service fits, use it.",
      },
      {
        q: "I work a rotation. Can sessions stop and start?",
        a: "Yes, and in this region that is the normal pattern rather than the exception. Booking block by block, with gaps, works, and nothing is lost by pausing. It is better to plan for that from the start than to book weekly, miss three, and conclude that counselling did not suit you.",
      },
    ],
    sources: [
      { label: "Interior Health, Kamloops Mental Health & Substance Use", url: "https://www.interiorhealth.ca/locations/kamloops-mental-health-substance-use" },
      { label: "Interior Health, access mental health and substance use services", url: "https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services" },
      { label: "Statistics Canada, Focus on Geography Series, 2021 Census, Kamloops (Census subdivision)", url: "https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=10&dguid=2021A00055933042" },
      { label: "CMHA Kamloops Branch", url: "https://kamloops.cmha.bc.ca/" },
    ],
    nearby: ["kelowna", "prince-george"],
  },

  /* ── Three cities brought back, 2026-08-28 ────────────────────────────────
   *
   * The amendment at the top of this file sets one condition for restoring a
   * retired slug: a genuinely deep page must be writable for it. These three
   * meet it, and each for a different reason rather than because a template
   * could be filled in.
   *
   *   Burnaby     public intake runs through FRASER Health, not Vancouver
   *               Coastal, which routinely surprises people who work downtown
   *               and costs them weeks in the wrong queue.
   *   Langley     two municipalities sharing one name, so "a counsellor in
   *               Langley" tells a resident of Aldergrove almost nothing.
   *   Chilliwack  the point where the valley stops being commutable, and where
   *               specific modalities are absent rather than merely busy.
   *
   * All three are removed from retiredCitySlugs in next.config.mjs in the same
   * change. Leaving a slug in that list while building a page for it produces a
   * page that exists and 308s — which has already happened on this site, was
   * shipped, and was reported as live off a green local gate. `npm run
   * redirect-shadow` now fails the build on exactly that. */
  {
    slug: "burnaby",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Burnaby",
    region: "Metro Vancouver",
    blurb: "Burnaby looks west for services and is covered by Fraser Health. A mismatch that costs people weeks.",
    metaDescription:
      "Online counselling for Burnaby. Therapy in Punjabi or English: anxiety, trauma, EMDR and couples sessions, with no commute across the city.",
    intro: [
      "Burnaby is a city that mostly faces west. People work in Vancouver, look for services in Vancouver, and reasonably assume the health authority covering downtown covers them too.",
      "It does not. **Public mental-health intake for a Burnaby address runs through Fraser Health, not Vancouver Coastal.** That is a small administrative fact with a real cost: people discover it at the wrong end of a referral, having already waited, and start again in a different queue.",
    ],
    localReality: {
      h2: "The authority mismatch, and what it does not affect",
      body: [
        "**The public route depends on your address, not your commute.** If you live in Burnaby, Fraser Health is the intake route regardless of where you work. Checking that before making a referral request saves the weeks most commonly lost in this city.",
        "**None of it applies to private counselling.** Registration with the BC Association of Clinical Counsellors is provincial. An RCC may work with any client in British Columbia, and no health-authority boundary, referral or diagnosis enters into it. For someone who has just lost a month to the wrong queue, that is worth saying plainly rather than leaving to be inferred.",
        "**Specialised private practice here is thinner than the population suggests.** Burnaby's private sector does not scale with its size, which is why the default for anything specific has long been to travel west, adding a commute to the appointment least suited to having one afterwards.",
        "What sessions cost, and what extended health will and will not reimburse, is set out on [the fees page](/pricing).",
      ],
    },
    access: [
      { label: "No trip across the city", detail: "The commute west is the most common reason a course of sessions here ends early." },
      { label: "No referral, no diagnosis", detail: "Counselling with an RCC is accessed directly, whichever authority covers your address." },
      { label: "Punjabi or English", detail: "Including moving between both inside a single session." },
      { label: "Evening availability", detail: "Sessions on four evenings, so an appointment need not cost a working afternoon as well." },
    ],
    faqs: [
      { q: "Which health authority covers Burnaby?", a: "Fraser Health, not Vancouver Coastal, which surprises a lot of people who work in Vancouver. It determines the public intake route for your address, and has no bearing at all on seeing a Registered Clinical Counsellor privately." },
      { q: "Do I need a doctor's referral?", a: "No. Counselling with an RCC is accessed directly. There is no referral, no diagnosis, and no waiting for a physician appointment first." },
      { q: "Is counselling covered by MSP?", a: "No. MSP does not cover counselling with an RCC. Most extended health plans reimburse it, and receipts carry the registration number insurers ask for." },
      { q: "Can I have a session on a work day?", a: "There are evening slots Tuesday through Friday and daytime hours Monday and Tuesday. Because there is no travel, an evening session costs the evening rather than the afternoon as well." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["vancouver", "surrey"],
  },
  {
    slug: "langley",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Langley",
    region: "Fraser Valley",
    blurb: "Two municipalities share the name, so a practice “in Langley” may be nowhere near you.",
    metaDescription:
      "Online counselling for Langley City and the Township. Therapy in Punjabi or English: anxiety, trauma, EMDR and couples sessions across BC.",
    intro: [
      "Langley is two municipalities that share a name: the City of Langley, and the Township that surrounds it. A directory listing saying “Langley” therefore tells you very little about whether a practice is anywhere near you.",
      "For a resident of Aldergrove, a counsellor in Willoughby is a drive. For someone in Brookswood, half the listings are on the far side of the Township. It is the kind of detail that looks pedantic until it is the reason a third appointment was missed.",
    ],
    localReality: {
      h2: "Well served in general, thin in particular",
      body: [
        "**Langley does not look underserved, and for general counselling it is not.** Practices exist, they advertise, and a straightforward course of talking therapy is genuinely available locally.",
        "**The gap appears when you need something specific.** Trauma-focused work, EMDR and structured couples work are a narrower field here, and the usual advice is to look toward Surrey or Abbotsford. That produces the characteristic Langley false start: several weeks with a counsellor who is capable, but not trained for what you brought.",
        "**The corridor competes for the same clinicians.** Practitioners with specific training around Langley absorb demand from Surrey through to Abbotsford, which is why a search for a specialism so often ends in a waitlist rather than an opening. A virtual practice widens the pool from whoever is within driving distance to whoever is registered in British Columbia.",
        "If you are weighing up who you actually need, [the comparison of RCCs, psychologists and social workers](/compare/rcc-vs-psychologist-vs-social-worker-bc) is the place to start.",
      ],
    },
    access: [
      { label: "City or Township, no difference", detail: "Aldergrove, Brookswood, Willoughby and Fort Langley all get identical access." },
      { label: "Specialisms without the corridor drive", detail: "EMDR and structured couples work, without looking to Surrey or Abbotsford." },
      { label: "Punjabi or English", detail: "Available without travelling west to find it." },
      { label: "No waiting room", detail: "In a community where people know each other, this matters more than it sounds." },
    ],
    faqs: [
      { q: "Do you cover both the City of Langley and the Township?", a: "Both, and the distinction stops mattering. Sessions are by secure video anywhere in British Columbia, so where in Langley you live has no bearing on access." },
      { q: "How do I check a counsellor is trained for what I need?", a: "Ask directly and expect a specific answer rather than a reassuring one. This practice is EMDR- and Gottman-trained, and the BCACC registration number is published so you can verify it in the public register yourself." },
      { q: "What if it turns out not to be the right fit?", a: "Say so. A referral onward is a normal outcome and a better one than continuing out of politeness." },
      { q: "Is there a free consultation first?", a: "Yes: 15 minutes by video, no charge, no card, and no obligation to book anything afterwards." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["surrey", "abbotsford"],
  },

  /* WHITE ROCK — added 31 Aug 2026, and the one city on this list with a
   * reason unlike any of the others.
   *
   * The practice's Google Business Profile is registered at an address in
   * White Rock, carries four reviews, and predates this website by years. That
   * makes White Rock the single place in BC where the practice has a local
   * entity a search engine already recognises — and until today it was the
   * only such place with no page, because 'white-rock' sat in
   * retiredCitySlugs and the URL 308'd to the index. It is removed from that
   * list in the same change; see the note at the head of this file about what
   * happens when a page exists and a redirect still points away from it.
   *
   * NO CENSUS FIGURES HERE, deliberately. The Abbotsford and Surrey entries
   * quote exact mother-tongue counts because those were looked up. Nothing
   * equivalent was verified for White Rock, and a plausible-sounding invented
   * statistic on a counselling site is worse than no statistic — every other
   * number on this site can be checked, and that has to stay true. What is
   * written below is qualitative and verifiable. */
  {
    slug: "white-rock",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "White Rock",
    region: "Metro Vancouver",
    blurb: "A small city on the border where the counsellor you can reach may be someone you will see again at the pier.",
    metaDescription:
      "Online counselling for White Rock and the Semiahmoo Peninsula. Therapy in English or Punjabi: EMDR, trauma, anxiety, grief and couples sessions.",
    intro: [
      "White Rock is small in a way that changes what privacy means. A city of a few square kilometres wrapped around one hill, one promenade and one main street is a place where the person in the waiting room is quite often someone you know, and where the counsellor you would be booking with may share a grocery store, a beach walk and a dentist with you.",
      "It is also a city that skews older than almost anywhere else in Metro Vancouver, and that shapes what people actually come to therapy for here: retirement that turned out to be harder than expected, caregiving for a partner, grief after a long marriage, health anxiety with a real diagnosis underneath it, and adult children who moved away. Those are not the presentations a general \"anxiety and depression\" page is written for.",
    ],
    localReality: {
      h2: "A small city, an older population, and a border",
      body: [
        "**Small enough that discretion is a real constraint.** In a city this size the ordinary privacy of a counselling office is thinner than it looks. Being seen going in is not paranoia. It is arithmetic. A virtual practice has no doorway on Johnston Road to be noticed at, which for some people here is the difference between starting and not.",
        "**An older population needs different work, not gentler work.** Grief, retirement, chronic illness and caregiver exhaustion are the substance of a great deal of counselling on the Peninsula, and they are frequently treated as things to be endured rather than worked on. [Grief without a timeline](/guides/grief-without-a-timeline) and the page for [family caregivers](/for/family-caregivers) cover what that work actually involves.",
        "**South Surrey is next door, and is not the same thing.** White Rock is its own municipality entirely surrounded by Surrey, and residents move between the two without thinking about it, but the services, the intake queues and the counsellor listings are organised by boundaries that do not match how anyone actually lives here. [Counselling in Surrey](/online-counselling/surrey) covers the larger picture, including the Punjabi-speaking practice that many Peninsula residents are looking for and searching one city over to find.",
        "**Public intake runs through Fraser Health.** Not Vancouver Coastal, despite the Metro Vancouver address. The same mismatch that costs Burnaby residents weeks in the wrong queue. Worth knowing before joining a waitlist.",
      ],
    },
    access: [
      { label: "No doorway to be seen at", detail: "In a city where the pier, the pharmacy and the main street are shared, that is the practical privacy concern rather than an abstract one." },
      { label: "No drive up the hill", detail: "Sessions from home matter more where mobility, weather or a steep grade are part of the calculation." },
      { label: "Serves the whole Peninsula", detail: "White Rock, South Surrey, Crescent Beach and Ocean Park, on identical terms, municipal boundaries do not change availability." },
      { label: "English or Punjabi", detail: "Including both within one session, without travelling into Surrey to find it." },
    ],
    faqs: [
      { q: "Do you have an office in White Rock?", a: "No. The practice is fully virtual and every session happens by secure video, wherever you are. You may find the business listed with a White Rock address. That is the registered address, not a clinic you would attend, and there is no waiting room." },
      { q: "Do you cover South Surrey, Crescent Beach and Ocean Park?", a: "Yes, and on exactly the same terms. The practice covers all of British Columbia, so which side of the White Rock–Surrey boundary you live on changes nothing about availability or fee." },
      { q: "I am retired. Is counselling still worth starting?", a: "Yes, and the question comes up here more than almost anywhere. Grief, the shape of retirement, caregiving and health worry are ordinary reasons to start and respond to the work as well as anything else does. A free 15-minute consultation is a reasonable way to find out whether it is worth your time, and saying no afterwards costs nothing." },
      { q: "I am not confident with video calls. Is that a problem?", a: "No. The link opens in a browser with nothing to install and no account to create, and the first few minutes of a first session are routinely spent making sure it works. If the video is the obstacle, say so on the consultation call and it can be sorted out then rather than on the day." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or a mix of the two. The Peninsula's Punjabi-speaking community is substantial and continuous with South Surrey's, and a great many people here have been searching in Surrey for what is available from home." },
      { q: "Is it better to look for someone local?", a: "Sometimes, and you would be told so on a consultation call. A counsellor you can drive to suits plenty of people. What a local option costs in a city this small is the privacy question, and White Rock has few enough counsellors that \"local\" frequently means Surrey or Langley anyway, at which point the drive is buying you nothing." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["surrey", "langley"],
  },

  /* FOUR CITIES ADDED 31 AUG 2026, at the owner's explicit instruction.
   *
   * The note at the head of this file argues against exactly this: a 24-day-old
   * domain has no authority to push more city pages, and thin ones read as a
   * doorway pattern. That argument was put to the owner and the answer was to
   * build them. It is their call and this comment is not a hedge against it —
   * but the reasoning stays on the page so the next person sees both halves.
   *
   * The condition the file sets is met for each: a page is kept ONLY where
   * something true and specific about accessing care from that place changes
   * what the page says. Richmond's counselling supply is oriented to languages
   * this practice does not offer. The Tri-Cities lose their evenings to a
   * commute. Delta is three communities sharing a municipality and nothing
   * else. Nanaimo is across water, which turns "see a Lower Mainland
   * specialist" into a full day and a ferry.
   *
   * NO INVENTED STATISTICS, same rule as White Rock. Where a number would help
   * and was not verified, the sentence is written without one. */
  {
    slug: "richmond",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Richmond",
    region: "Metro Vancouver",
    blurb: "A large city whose counselling supply is organised around languages this practice does not offer, which thins the field more than the population suggests.",
    metaDescription:
      "Online counselling for Richmond, BC. Therapy in English or Punjabi: EMDR, trauma, anxiety, depression and couples sessions by secure video.",
    intro: [
      "Richmond is one of the larger cities in Metro Vancouver, and on paper that should mean a wide choice of counsellors. In practice the choice narrows quickly depending on what you need it in. A great deal of Richmond's mental-health provision is built, correctly and deliberately, around its Chinese-speaking communities, Cantonese and Mandarin services are a genuine local strength.",
      "If you are looking in English or Punjabi, the field is thinner than the city's size implies, and people routinely end up searching in Vancouver or Surrey instead. That is the gap this page is about. It is worth saying plainly that **this practice offers English and Punjabi and not Cantonese or Mandarin**, if those are what you need, Richmond is a better place to look locally than almost anywhere in the province, and you should.",
    ],
    localReality: {
      h2: "Language, the airport, and a bridge",
      body: [
        "**Language shapes the local supply more than distance does.** Richmond's counselling capacity is real; the question is whether it exists in the language you want to be understood in. For English or Punjabi speakers here, \"local\" often means crossing a bridge anyway, at which point the drive is buying nothing that a video call does not.",
        "**Shift work at YVR and the port does not fit a 9-to-5 slot.** Airport operations, ground handling, freight and hospitality run on rosters that change, and a standing weekly appointment at 2pm is not something those schedules survive. Evening availability, and the ability to attend from wherever you are between shifts, is the practical difference.",
        "**Public intake runs through Vancouver Coastal Health**, not Fraser Health, which matters if you have been given a referral or joined a waitlist and are trying to work out which queue you are actually in.",
        "**Punjabi-speaking counselling is the specific case.** Richmond's Punjabi-speaking community is smaller than Surrey's or Abbotsford's and the local provision reflects that. [Punjabi-speaking counselling](/services/punjabi-counselling) covers what sessions in Punjabi actually involve, and [counselling in Surrey](/online-counselling/surrey) covers the larger picture one bridge east.",
      ],
    },
    access: [
      { label: "No bridge, no tunnel", detail: "The Massey Tunnel and the Oak Street bridge stop being part of the appointment." },
      { label: "English or Punjabi", detail: "Including both within one session. Cantonese and Mandarin are not offered here, Richmond is genuinely well served for those locally." },
      { label: "Built for shift rosters", detail: "Evening appointments, and no travel time either side of a session." },
      { label: "Serves all of Richmond", detail: "Steveston, Brighouse, Hamilton and the island's east side on identical terms." },
    ],
    faqs: [
      { q: "Do you offer counselling in Cantonese or Mandarin?", a: "No. Sessions are in English or Punjabi, or a mix of the two. If you want to work in Cantonese or Mandarin, Richmond is one of the better places in BC to look locally, and doing so is the right call rather than a compromise. This page is not trying to talk you out of it." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or both within the same session, with no need to travel to Surrey or Vancouver to find it." },
      { q: "I work rotating shifts at the airport. Can therapy fit around that?", a: "Yes, and it works far better if it is planned for from the start rather than discovered in month two. Booking block by block around a roster, with gaps, is a normal pattern and nothing is lost by pausing between blocks." },
      { q: "Which health authority covers Richmond?", a: "Vancouver Coastal Health, not Fraser Health. It is worth knowing before joining a public waitlist, because a referral into the wrong authority's queue is a delay nobody tells you about until you ask." },
      { q: "Is there a free consultation first?", a: "Yes: 15 minutes by video, no charge, no card, and no obligation afterwards. If it turns out someone else is a better fit, you will be told that on the call." },
    ],
    sources: [
      { label: "Vancouver Coastal Health, mental health and substance use", url: "https://www.vch.ca/en/service/mental-health-substance-use-services" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["vancouver", "surrey"],
  },

  {
    slug: "coquitlam",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Coquitlam",
    region: "Metro Vancouver",
    blurb: "The Tri-Cities commute takes the evenings a weekly appointment would have to live in.",
    metaDescription:
      "Online counselling for Coquitlam and the Tri-Cities. Therapy in English or Punjabi: EMDR, trauma, anxiety, depression and couples sessions.",
    intro: [
      "The thing that ends courses of therapy in the Tri-Cities is rarely the therapy. It is the commute. A working day that starts with a drive or a SkyTrain ride into Vancouver or Burnaby and ends with the same in reverse leaves an evening with very little slack in it, and a 6pm appointment on the other side of a bridge is a commitment that survives about four weeks.",
      "Coquitlam, Port Coquitlam and Port Moody function as one place for most purposes and are three municipalities for administrative ones, which is its own small source of confusion when you are trying to work out what you are entitled to and where.",
    ],
    localReality: {
      h2: "A commute, three municipalities, and a growing population",
      body: [
        "**The commute is the constraint, and it is not a soft one.** Removing travel from either side of a session is worth more here than the session time itself. It is the difference between an appointment costing an hour and costing three. That is the variable that decides whether week six happens.",
        "**Three municipalities, one lived reality.** Someone in Port Coquitlam searching \"counsellor in Coquitlam\" is doing the sensible thing; the boundaries do not describe how anyone lives. Availability here does not change across them.",
        "**Public intake runs through Fraser Health.** The Tri-Cities sit in Fraser Health despite looking west for work and for most services. The same mismatch that costs [Burnaby](/online-counselling/burnaby) residents weeks in the wrong queue, and worth checking before joining a waitlist.",
        "**The population has grown faster than the provision.** New density along the Evergreen extension arrived quicker than local services expanded to meet it, which is felt as waitlists rather than as absence.",
      ],
    },
    access: [
      { label: "No commute on top of the commute", detail: "The single largest reason a course of therapy quietly stops here." },
      { label: "Covers all three cities", detail: "Coquitlam, Port Coquitlam and Port Moody on identical terms, plus Anmore and Belcarra." },
      { label: "Evening appointments", detail: "Weekday evenings by request, which is when a commuting schedule actually has room." },
      { label: "English or Punjabi", detail: "Including both within a session." },
    ],
    faqs: [
      { q: "Do you cover Port Coquitlam and Port Moody?", a: "Yes, and on the same terms. The practice is virtual and covers all of British Columbia, so which of the three municipalities you live in changes nothing about availability or fee." },
      { q: "Which health authority covers the Tri-Cities?", a: "Fraser Health, despite most people here looking west to Vancouver and Burnaby for work and for a lot of services. It is worth confirming before joining a public waitlist. A referral into the wrong authority's queue costs weeks that nobody flags." },
      { q: "I get home late. What is the latest appointment?", a: "Evening slots run on weekdays by request. The current bookable windows are listed on the booking page, and if none of them work it is worth saying so on the consultation call rather than forcing a time that will not survive a busy month." },
      { q: "Does virtual therapy actually work as well?", a: "For the concerns most people bring: anxiety, depression, trauma, relationship difficulty. The research on video-delivered therapy shows outcomes broadly comparable to in-person work. The trade-offs are real and worth talking through on a consultation." },
      { q: "Is there a free consultation first?", a: "Yes: 15 minutes by video, no charge, no card, and no obligation to book anything afterwards." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["burnaby", "vancouver"],
  },

  {
    slug: "delta",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Delta",
    region: "Metro Vancouver",
    blurb: "Three communities sharing a municipality and almost nothing else, including how hard it is to reach a counsellor.",
    metaDescription:
      "Online counselling for Delta, BC: North Delta, Ladner and Tsawwassen. Therapy in English or Punjabi, by secure video across the province.",
    intro: [
      "Delta is one municipality containing three places that do not much resemble each other. North Delta sits against Surrey and shares its communities and its pace. Ladner is a smaller, older river town. Tsawwassen is at the end of a peninsula with a ferry terminal on it. \"A counsellor in Delta\" tells a resident of any of the three almost nothing about whether that counsellor is reachable.",
      "What they have in common is that local provision is thin relative to the population, and that reaching the Lower Mainland's depth of specialists means a drive that is longer than the map suggests, through a tunnel that decides how long your evening takes.",
    ],
    localReality: {
      h2: "A tunnel, a ferry terminal, and North Delta's own case",
      body: [
        "**The Massey Tunnel is the local variable everything else is scheduled around.** An appointment in Vancouver or Richmond is a different proposition at 4pm than at 11am, and a weekly commitment that depends on the tunnel behaving is a weekly commitment that will eventually be missed.",
        "**North Delta's situation is Surrey's situation.** The Punjabi-speaking community here is substantial and continuous with Surrey's, and it brings the same dynamic: a strong community, and a corresponding concern about privacy that keeps people from walking into a local clinic where they may be recognised. [Punjabi-speaking counselling for Surrey](/punjabi-counselling/surrey) is written about that specifically, and applies directly across the boundary.",
        "**Ladner and Tsawwassen are small towns for these purposes.** Fewer counsellors, less choice of modality, and the same privacy arithmetic that applies in any place where people know each other. For anything specific, EMDR, structured couples work, the local field narrows to very little.",
        "**Shift work at Deltaport and the ferry terminal does not fit a standing slot.** Port and terminal rosters change, and evening availability with no travel either side is what makes attendance realistic rather than aspirational.",
        "**Public intake runs through Fraser Health.**",
      ],
    },
    access: [
      { label: "The tunnel stops mattering", detail: "No appointment is scheduled around traffic that cannot be predicted a week ahead." },
      { label: "All three communities", detail: "North Delta, Ladner and Tsawwassen on identical terms, the municipal boundary changes nothing." },
      { label: "English or Punjabi", detail: "Including both within one session, without driving into Surrey to find it." },
      { label: "No local clinic to be seen at", detail: "The privacy concern that keeps many people in a close community from booking at all." },
    ],
    faqs: [
      { q: "Do you cover North Delta, Ladner and Tsawwassen?", a: "Yes, all three and on the same terms. The practice is virtual and covers all of British Columbia, so where in Delta you live changes nothing about availability or fee." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or a mix of both. North Delta's Punjabi-speaking community is continuous with Surrey's, and a great many people here have been searching one city over for what is available from home." },
      { q: "I work shifts at the port. Can counselling fit around that?", a: "Yes, and planning for it from the start works better than discovering it later. Booking block by block around a roster, with gaps between blocks, is a normal pattern and pausing costs nothing." },
      { q: "There are counsellors in Delta already. Why this?", a: "For plenty of people there is no reason, and you would be told so on a consultation call. What a local option costs some people here is the privacy question, a familiar waiting room in a community where families know each other. A practice with no office anywhere removes the question." },
      { q: "Which health authority covers Delta?", a: "Fraser Health. Worth confirming before joining a public waitlist, since a referral into the wrong authority's queue is a delay that tends to surface only when you chase it." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["surrey", "richmond"],
  },

  {
    slug: "nanaimo",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Nanaimo",
    region: "Vancouver Island",
    blurb: "Everything the Lower Mainland offers is across water, which turns a specialist appointment into a whole day and a ferry.",
    metaDescription:
      "Online counselling for Nanaimo and central Vancouver Island. EMDR, trauma, anxiety, depression and couples therapy in English or Punjabi, by video.",
    intro: [
      "Nanaimo has counsellors. What it does not have, in the depth the Lower Mainland does, is choice within a specific modality, and the moment you need something particular, the shortlist gets very short. The usual answer to that is to look across the water, and the water is the problem: a ferry each way turns a 50-minute appointment into most of a day, at a cost that makes a weekly course of therapy unaffordable long before the session fee does.",
      "That is the case for virtual work here, and it is a stronger one than in most of the province. Distance stops being a variable entirely: a counsellor on the mainland is exactly as available to you in Nanaimo as to someone in Burnaby.",
    ],
    localReality: {
      h2: "Water, a regional catchment, and Island Health",
      body: [
        "**The ferry is not an inconvenience, it is a budget.** Sailings, parking, and the walk-on-versus-drive-on decision are all things a weekly appointment would have to survive. Almost none do. Removing the crossing does not make therapy easier at the margin. It makes a sustained course of it possible at all.",
        "**Nanaimo is the catchment for a large stretch of the Island.** People travel in from Parksville, Ladysmith, Lantzville, Gabriola and further up-Island, which means the local waitlists carry more than the city's own population. If you are on one, you are queueing behind a region.",
        "**Specific modalities are the gap, not counselling in general.** For [EMDR](/services/emdr-therapy) or structured couples work, the local field narrows quickly. That is where the mainland's depth was worth the ferry, and where it is now worth nothing extra at all.",
        "**Public intake runs through Island Health**, and its services are real and worth staying connected to if you already are. Private virtual counselling is a parallel option rather than a replacement. Most useful when the public wait is longer than you can comfortably hold.",
        "**Gabriola and the smaller islands add a second crossing.** For anyone there, a mainland appointment is two ferries, and even a Nanaimo appointment is one.",
      ],
    },
    access: [
      { label: "No ferry, no sailing schedule", detail: "The single largest cost of accessing mainland specialists disappears, not reduced, removed." },
      { label: "Modalities the Island field is thin on", detail: "EMDR and structured couples work, without the crossing that used to be the price of them." },
      { label: "Serves central Vancouver Island", detail: "Nanaimo, Parksville, Ladysmith, Lantzville and Gabriola on identical terms." },
      { label: "English or Punjabi", detail: "Punjabi-speaking counsellors are concentrated in the Lower Mainland; virtual access is the realistic route to it from here." },
    ],
    faqs: [
      { q: "Can a mainland counsellor legally see me in Nanaimo?", a: "Yes. Registration applies province-wide, so a BC-registered Registered Clinical Counsellor can work with clients anywhere in British Columbia by secure video, under the same ethical, legal and privacy standards that would apply in person." },
      { q: "Do you cover Parksville, Ladysmith and Gabriola?", a: "Yes, and on the same terms. Anywhere in British Columbia works identically: being further out, or across another crossing, carries no travel penalty and no difference in fee." },
      { q: "What if my connection is unreliable?", a: "Turning the camera off cuts the bandwidth a session needs considerably, and it is worth agreeing in advance what happens if a connection drops mid-session so that it is an inconvenience rather than an interruption to the work." },
      { q: "Which health authority covers Nanaimo?", a: "Island Health. Its mental-health and substance-use services are worth staying connected to if you already are, private counselling alongside them is a parallel route, not a replacement for one." },
      { q: "Is virtual counselling as effective as in person?", a: "For the concerns most people bring: anxiety, depression, trauma, relationship difficulty. The research on video-delivered therapy shows outcomes broadly comparable to in-person work. There are real trade-offs and they are worth talking through on a consultation call." },
    ],
    sources: [
      { label: "Island Health, mental health and substance use services", url: "https://www.islandhealth.ca/our-services/mental-health-substance-use-services" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["victoria", "vancouver"],
  },

  {
    slug: "chilliwack",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Chilliwack",
    region: "Eastern Fraser Valley",
    blurb: "Chilliwack is where the Fraser Valley stops being commutable, and where specific modalities stop being available.",
    metaDescription:
      "Online counselling for Chilliwack and the eastern Fraser Valley. EMDR, trauma, anxiety and couples therapy across BC, no drive, in any weather.",
    intro: [
      "West of Chilliwack the Fraser Valley is commutable. At Chilliwack it stops. A Surrey appointment is a two-hour round trip in good conditions, and between November and March Highway 1 does not reliably provide good conditions.",
      "That is the honest reason a great many people here have never seriously pursued counselling, not reluctance, but a standing arrangement that was never realistic to sustain through a winter.",
    ],
    localReality: {
      h2: "Absent rather than busy",
      body: [
        "**There is a difference between a service being oversubscribed and a service not being present.** Chilliwack usually meets the second. EMDR and structured couples work require specific training that a smaller local sector may simply not contain, so a search does not end in a waitlist. It ends in nothing.",
        "**Travelling for it inverts the arrangement.** Where people have travelled, the pattern is a demanding session followed immediately by an hour of highway, often in the dark. People manage that by managing the session, keeping it lighter than it needs to be. The drive quietly sets a ceiling on the work.",
        "**Weather is a clinical variable here, not a footnote.** A course of counselling that depends on the highway has a seasonal failure mode built into it, and the season it fails in is the one when people most need it to hold.",
        "For what a first session actually involves, [the guide on what to expect](/guides/what-to-expect-first-therapy-session) sets it out plainly.",
      ],
    },
    access: [
      { label: "No highway, in any weather", detail: "A closed road does not cancel a video session. In this part of the valley that is the whole argument." },
      { label: "Modalities not available locally", detail: "EMDR and Gottman-informed couples work, without travelling west for them." },
      { label: "Serves the eastern valley", detail: "Sardis, Rosedale, Agassiz and Hope, with no travel penalty for being further out." },
      { label: "Phone fallback", detail: "Where a connection is unreliable, sessions run by phone, agreed in advance rather than improvised." },
    ],
    faqs: [
      { q: "Is there anything available locally in Chilliwack?", a: "There is local practice, and for general counselling it may well be the right answer. This practice is virtual and covers the whole province, which matters most when what you need is specific rather than general." },
      { q: "What happens if my internet is unreliable?", a: "Sessions can run by phone instead, and turning the camera off cuts the bandwidth needed considerably. It is worth agreeing in advance what happens if a connection drops, so it is an inconvenience rather than an interruption to the work." },
      { q: "Do you cover Hope and Agassiz?", a: "Yes, anywhere in British Columbia. Being further east carries no penalty at all, which is the one respect in which virtual care is genuinely different from the alternative." },
      { q: "What does a session cost?", a: "$140 for 50 minutes, after a free 15-minute consultation. Most extended health plans reimburse sessions with a Registered Clinical Counsellor; MSP does not cover them." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["abbotsford", "langley"],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);

// The remaining retired city slugs and their 301s live in next.config.mjs.
// Burnaby, Langley and Chilliwack were removed from that list on 2026-08-28
// when the records above were written — see the note beside them.
