import { practitioners, insuredProvinces, vancouverToday, type Practitioner } from './practitioners.ts';
import { fallbackFee } from './cliniko-catalog.ts';

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
  /* THE COMMUNITIES AROUND THE CITY — 26 Sep 2026. Search Console shows
     "emdr therapy guildford", "emdr specialist peachland", "counselling
     tri-cities", "online therapy okanagan": places inside or beside a city
     that has a page, typed by people the page never named. A virtual
     practice serves them identically, so naming them is a fact, not a
     doorway. Rendered as one sentence and one answer on the city page. */
  communities?: string[];
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
  figure2?: string;      // second diagram, further down the page
  /* THE NAME THE HUB IS SEARCHED BY, WHEN IT IS NOT THE CITY'S — 1 Oct 2026.
     The title, H1 and OG title use it; the slug, the breadcrumb and every
     sentence that means the municipality keep `city`. White Rock only: its
     hub named South Surrey seven times and never in its title, H1 or meta,
     and /online-counselling/south-surrey returned 404 (now a 308 here). */
  displayPlace?: string;
  /* Places the hub serves by name, beside the city, for areaServed. Each is
     contained in the named municipality. */
  areaPlaces?: { name: string; containedIn: string }[];
  /* The /for pages written for people this hub also serves — 1 Oct 2026.
     Rendered as one "Also written for" line under the counsellor cards, by
     each audience's own title. Links only: no claim about local employers or
     communities is made by listing one. Slugs must exist in lib/audiences.ts
     (test/city-hub.test.mts). */
  audiences?: string[];
};

/* WHO CAN SEE YOU ON THE ALBERTA SIDE — 1 Oct 2026.
 *
 * The Fort St. John page says who can keep seeing somebody who works across
 * the Alberta line. That is a fact about the roster and an insurance policy,
 * not about the city, so it is generated: counsellors taking new clients whose
 * provinces still include Alberta once insuredProvinces() has applied the
 * insurance gate. When a policy lapses the sentence goes with it, on the next
 * build, without anybody editing this file. Names link to the profile; no
 * registration number, which lives on the profile by decision. */
type Rostered = Pick<Practitioner, 'name' | 'slug' | 'acceptingNewClients' | 'provinces' | 'insurance'>;

/** Counsellors taking new clients who may be offered in Alberta on `today`. */
export const albertaCounsellors = <T extends Rostered>(roster: readonly T[], today: string): T[] =>
  roster.filter((p) => p.acceptingNewClients && insuredProvinces(p, today).includes('AB'));

/** The sentence for the Fort St. John page, or '' when nobody can. Leads with a space. */
export function albertaLine(roster: readonly Rostered[], today: string): string {
  const ab = albertaCounsellors(roster, today);
  if (!ab.length) return '';
  const links = ab.map((p) => `[${p.name}](/practitioners/${p.slug})`);
  const list = links.length === 1 ? links[0] : `${links.slice(0, -1).join(', ')} and ${links[links.length - 1]}`;
  return ab.length === 1
    ? ` ${list} is the one counsellor here whose certification and insurance also reach Alberta, and can see you while you are working on that side of the line.`
    : ` ${list} hold certification and insurance that also reach Alberta, and can see you while you are working on that side of the line.`;
}

/** The FAQ's closing sentence on the same condition, naming nobody. */
export function albertaFaq(roster: readonly Rostered[], today: string): string {
  const n = albertaCounsellors(roster, today).length;
  if (!n) return '';
  return ` If you would rather keep going while you are working on the Alberta side, say so when you book: ${n === 1 ? 'one counsellor here can' : `${n} counsellors here can`} see clients there, and it decides who you book with.`;
}

/* The counsellor taking new clients who works in Punjabi, for the White Rock
   answer. Read from the roster so the name goes when she stops accepting; the
   question is dropped rather than answered with nobody. 1 Oct 2026. */
const PUNJABI_COUNSELLOR = practitioners.find(
  (p) => p.acceptingNewClients && p.provinces.includes('BC') && p.languages.some((l) => l.name === 'Punjabi'),
);

const TODAY = vancouverToday();
const ALBERTA_LINE = albertaLine(practitioners, TODAY);
const ALBERTA_FAQ = albertaFaq(practitioners, TODAY);

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
    /* Fort St. John moved to `nearby` on 1 Oct 2026: it has its own page, and
       it is about 440 km from here. Prince Rupert is named because its retired
       URL now lands on this page (lib/redirects.mjs). */
    communities: ["Quesnel", "Vanderhoof", "Mackenzie", "Terrace", "Prince Rupert"],
    region: "Northern BC",
    blurb: "Northern BC has the thinnest counselling coverage in the province, virtual care is how the gap gets closed.",
    metaDescription:
      "Online counselling for Prince George and Northern BC. EMDR, trauma, anxiety, depression and couples therapy by secure video. Free 30-minute consultation.",
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
    nearby: ["fort-st-john", "kelowna", "victoria"],
    audiences: ["healthcare-and-shift-workers", "rotational-and-camp-workers"],
  },

  {
    slug: "surrey",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Surrey",
    communities: ["Guildford", "Newton", "Fleetwood", "Cloverdale", "South Surrey"],
    region: "Lower Mainland",
    blurb: "Home ground, and the community where the demand for Punjabi-language therapy is highest in the province.",
    metaDescription:
      "Online counselling for Surrey with a Punjabi-speaking counsellor. EMDR, trauma, anxiety and couples counselling by secure video.",
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
        /* Fraser Health's Mental Health Centres directory, read 1 Oct 2026:
           the Surrey centre is at 13401 108th Avenue, and the White
           Rock/South Surrey centre at 15521 Russell Avenue, White Rock. */
        "**South Surrey has its own public door.** On the Semiahmoo Peninsula, Fraser Health's adult mental health intake is the White Rock/South Surrey Mental Health and Substance Use Centre on Russell Avenue in White Rock, not the Surrey centre on 108th Avenue, and both accept a self-referral. The [White Rock and South Surrey page](/online-counselling/white-rock) covers the Peninsula itself.",
      ],
    },
    access: [
      { label: "No one sees you attend", detail: "The most common reason people here choose virtual over a local clinic. No waiting room, no building, no chance encounter." },
      { label: "Punjabi, English, or both", detail: "Including switching mid-sentence, which is how a lot of people in Surrey actually think and speak." },
      { label: "Continuity if you move", detail: "Registration covers all of BC, so a move to Abbotsford, Vancouver, or anywhere in the province does not end the work." },
    ],
    faqs: [
      { q: "Will anyone in my family find out?", a: "No. Counselling is confidential, and whether you tell anyone is entirely your decision. Because sessions are virtual there is no clinic to be seen entering. The only limits on confidentiality are risk of serious harm and a court order." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or moving between them within a session. You do not need to decide in advance which you want." },
      { q: "I live with family and have no private space. What do people do?", a: "This is one of the most common practical questions here, and there are workable answers, a parked car, a session scheduled during a work break from the office, headphones and a closed door. It is worth raising on the consultation call so it can be solved before the first session rather than during it." },
      { q: "Surrey has plenty of Punjabi-speaking counsellors. Why look outside it?", a: "For many people there is no reason to, and you would be told so on a consultation call. The reason people write in from Surrey is narrower: in a community this interconnected, the counsellor who comes recommended is often connected to the very people you would least want to know you are going. Confidentiality is a legal duty everywhere, distance is what makes it feel true." },
      { q: "I am the first person in my family to consider therapy. Where do I even start?", a: "That is the most common position people arrive in from Surrey, and there is no template because the generation before did not have one either. A free 30-minute consultation is a reasonable place to work out what you are actually looking for, with no obligation attached, and if somebody else would be a better fit, you would be told that plainly." },
      { q: "Do my parents have to be involved if the problem is my parents?", a: "No. Individual counselling is yours, and what you discuss stays confidential within the usual legal limits. Some people later choose to bring a family member into a session and some never do; both are ordinary. Nothing is disclosed to family because they asked." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "Fraser Health, Mental Health Centres directory", url: "https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    /* Its physical neighbours, 1 Oct 2026: White Rock sits inside Surrey and
       Langley borders it, and the live hub linked neither (79 impressions at
       15.41 on 26 Sep, the local page nearest page one). Vancouver is still
       one click away through the index and every other hub. */
    nearby: ["white-rock", "langley", "abbotsford"],
    audiences: ["healthcare-and-shift-workers", "first-gen-south-asian-adults", "punjabi-speaking-couples"],
  },

  {
    slug: "vancouver",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Vancouver",
    communities: ["East Vancouver", "Kitsilano", "the West End", "North Vancouver", "West Vancouver"],
    region: "Lower Mainland",
    blurb: "The most therapists in the province, and still a waitlist, because the constraint here is affordability, not supply.",
    metaDescription:
      "Online and virtual counselling for Vancouver, BC. Trauma, EMDR, anxiety and couples therapy by secure video, with no commute across town.",
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
      /* 17 Sep 2026: the pages outranking this one for the Vancouver query all
         mention ICBC and call the service virtual counselling or telehealth
         as well as online. This one did neither. */
      { q: "Is this the same as virtual counselling or telehealth?", a: "Yes. Online counselling, virtual counselling, virtual therapy and telehealth all describe the same thing here: a scheduled session by secure video with a Registered Clinical Counsellor, from wherever in Vancouver or beyond you are. The only word that would mean something different is in-person, which this practice does not offer." },
      { q: "Does ICBC cover counselling after a crash in Vancouver?", a: "ICBC funds counselling after a motor vehicle crash in BC regardless of fault, with an initial block of sessions pre-approved and no doctor's referral needed. Whether it pays a counsellor directly depends on whether they are in ICBC's Recovery Network; this practice is not, so you would pay at booking and ask ICBC, in writing, whether it reimburses receipts from a qualified counsellor outside the network. The ICBC counselling page sets out how to open the claim and what is covered." },
      { q: "Is virtual therapy cheaper than in-person?", a: "Fees here are the same either way. What virtual removes is the surrounding cost: transit or parking, and the hour or more of travel that an in-person appointment adds to a working day." },
      { q: "I have extended health through work. Will it cover this?", a: "Many plans that list Registered Clinical Counsellors will, depending on the plan. Some list only psychologists and social workers, so it is worth checking the exact wording, the extended health coverage page explains what to look for." },
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
    communities: ["Aldergrove", "Clearbrook", "Matsqui"],
    region: "Fraser Valley",
    blurb: "Fraser Valley distances make virtual sessions less a convenience than the thing that makes attending possible.",
    metaDescription:
      "Online counselling for Abbotsford with a Punjabi-speaking counsellor. EMDR, trauma, anxiety and couples sessions across the Fraser Valley.",
    intro: [
      "Abbotsford sits in a particular gap. It is large enough to have services, far enough from Vancouver that accessing the Lower Mainland's depth of specialists means a real commitment of a day, and spread out enough that even a local appointment can involve a significant drive.",
      "It also has one of the largest Punjabi-speaking communities in Canada, and the scale of it is easy to underestimate from outside: in the 2021 census **Punjabi was the mother tongue of 34,280 Abbotsford residents, 22.6% of the city**, second only to English at 61%. Nearly a quarter of a city is not a minority community in any ordinary sense. It brings much the same dynamic as Surrey. A strong community, and a corresponding concern about privacy that keeps people from walking into a local clinic.",
    ],
    localReality: {
      h2: "Distance, agriculture, and privacy",
      body: [
        "**The Valley is spread out.** For people in Abbotsford's rural areas, or in Mission, Chilliwack, or further east, a counselling appointment has historically meant driving, and that drive is the reason a lot of courses of therapy quietly end after three or four sessions. Virtual sessions remove that variable entirely.",
        "**Agricultural and seasonal work does not fit a 9-to-5 appointment slot.** The Valley's economy includes a significant agricultural workforce with seasonal peaks and long days during them. Attending without losing travel time either side, at a time picked from what the counsellor has open rather than a clinic's fixed slot, is the practical difference between possible and not.",
        "**Privacy operates the way it does in Surrey, only with less room.** In a community where families know each other, being seen entering a counselling office carries a weight that is entirely rational to want to avoid. What makes Abbotsford its own case rather than a smaller Surrey is the arithmetic: a comparable share of the population in a city less than a third the size means fewer degrees of separation available, not more. [Punjabi-speaking counselling for Abbotsford](/punjabi-counselling/abbotsford) is written about that specifically. A virtual practice removes the question entirely. There is no building to be seen at.",
        "For the broader picture of what this work involves within South Asian families, [the guide on intergenerational trauma](/guides/intergenerational-trauma-explained) covers the patterns that come up most.",
      ],
    },
    access: [
      { label: "No drive, in any weather", detail: "Valley fog, winter roads, and harvest-season hours stop being scheduling obstacles." },
      { label: "Serves the wider Valley", detail: "Chilliwack, Hope, and rural areas east of Abbotsford, with no travel penalty for being further out. [Mission and the north bank](/online-counselling/mission) have a page of their own." },
      { label: "Punjabi or English", detail: "Including both within a session, with no need to travel to the Lower Mainland to access it." },
      { label: "No local clinic to be seen at", detail: "The privacy concern that keeps many people in a tight community from booking at all." },
    ],
    faqs: [
      { q: "Do you serve Chilliwack, Hope and the rest of the Valley?", a: "Yes. The practice is virtual and covers all of British Columbia, so anywhere in the Fraser Valley works the same as anywhere else, with no additional travel for you. Mission, across the river, has a page of its own." },
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
    nearby: ["surrey", "vancouver", "mission"],
    audiences: ["healthcare-and-shift-workers", "first-gen-south-asian-adults", "punjabi-speaking-couples"],
  },

  {
    slug: "victoria",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Victoria",
    communities: ["Esquimalt", "Oak Bay", "Langford", "Colwood", "Sooke"],
    region: "Vancouver Island",
    blurb: "On the Island, specialist care has often meant a ferry, a day off, and a return sailing. It no longer has to.",
    metaDescription:
      "Online counselling for Victoria and Vancouver Island. EMDR, trauma, anxiety and couples therapy by secure video, with no ferry to catch.",
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
        "**Language access is the sharpest version of this.** Punjabi-speaking clinicians in BC are concentrated overwhelmingly in the Lower Mainland. For Island residents wanting [therapy in Punjabi](/services/punjabi-counselling), virtual sessions are not a convenience. They are realistically the only route. The same argument, with the local numbers, is on the [Kamloops](/punjabi-counselling/kamloops) and [Prince George](/punjabi-counselling/prince-george) pages, and for the Island itself on the [Saanich](/punjabi-counselling/saanich) page, where most of the region’s Punjabi-speaking community lives.",
        "The same applies further up-Island. [Nanaimo](/online-counselling/nanaimo), the Comox Valley, Campbell River, and the west coast communities have thinner local coverage again, and the gap widens the further north you go. Closer in, [Saanich and the Peninsula](/online-counselling/saanich) have a page of their own.",
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
      { q: "Can I have sessions in Punjabi from the Island?", a: "Yes. Punjabi-speaking clinicians in BC are concentrated overwhelmingly in the Lower Mainland, so for Island residents virtual sessions are not a convenience. They are realistically the only route. Most of the region’s Punjabi-speaking community lives in Saanich, and the Punjabi-speaking counselling page for Saanich sets out the 2021 Census figures and where they come from." },
      { q: "I am moving off-Island soon. Is it worth starting?", a: "Yes, and that is one of the better arguments for working this way. Registration covers all of British Columbia, so a move from Victoria to the mainland, or back, which is just as common, does not end the work or mean repeating your history to somebody new. Continuity is worth more to most people than proximity ever was." },
    ],
    sources: [
      { label: "Island Health, mental health and substance use services", url: "https://www.islandhealth.ca/our-services/mental-health-substance-use-services" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["saanich", "nanaimo", "vancouver"],
    audiences: ["healthcare-and-shift-workers", "first-responders"],
  },

  {
    slug: "kelowna",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Kelowna",
    communities: ["West Kelowna", "Peachland", "Lake Country"],
    region: "Okanagan",
    blurb: "The Okanagan's population has grown faster than its mental-health services have, and specialist options remain thin.",
    metaDescription:
      "Online counselling for Kelowna and the Central Okanagan. EMDR, trauma, anxiety and couples therapy by secure video.",
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
      { label: "Works around seasonal peaks", detail: "No travel time either side of the session, so a session costs fifty minutes rather than an afternoon." },
      { label: "Covers the wider Okanagan", detail: "West Kelowna, Lake Country and the smaller Interior communities where local coverage thins further. [Penticton and the South Okanagan](/online-counselling/penticton) and [Vernon and the North Okanagan](/online-counselling/vernon) have pages of their own." },
      { label: "Continues through evacuation or travel", detail: "Anywhere in BC with a connection, which in a wildfire season is not a hypothetical benefit." },
    ],
    faqs: [
      { q: "Do you work with people in Lake Country, Peachland, or West Kelowna?", a: "Yes. The practice covers all of British Columbia, so anywhere in the Okanagan works identically, and smaller communities gain the most, since local options are thinnest there. Vernon and the North Okanagan have a page of their own." },
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
    nearby: ["penticton", "vernon", "kamloops", "vancouver"],
    audiences: ["healthcare-and-shift-workers", "university-students"],
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
    /* Williams Lake, 100 Mile House, Clearwater and Revelstoke added 1 Oct
       2026. Each is Interior Health, and none was named anywhere on the site. */
    communities: ["Merritt", "Salmon Arm", "Chase", "Sun Peaks", "Logan Lake", "Clearwater", "Revelstoke", "100 Mile House", "Williams Lake"],
    region: "Thompson-Nicola",
    blurb: "Kamloops is where the region's services are, which means everyone else in the region drives here for them.",
    metaDescription:
      "Online counselling for Kamloops and the Thompson-Nicola. EMDR, trauma, anxiety, depression and couples therapy by secure video. Free 30-minute consultation.",
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
      { label: "Works around shifts and seasons", detail: "No travel either side of a session, which matters for mill and mine rotations, ranching, and the tourism season." },
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
    audiences: ["healthcare-and-shift-workers", "rotational-and-camp-workers", "university-students"],
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
    communities: ["Metrotown", "Brentwood", "Lougheed", "New Westminster"],
    region: "Metro Vancouver",
    blurb: "Burnaby looks west for services and is covered by Fraser Health. A mismatch that costs people weeks.",
    metaDescription:
      "Online counselling for Burnaby, BC. Anxiety, trauma, EMDR and couples sessions by secure video, with no commute across the city.",
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
    ],
    faqs: [
      { q: "Which health authority covers Burnaby?", a: "Fraser Health, not Vancouver Coastal, which surprises a lot of people who work in Vancouver. It determines the public intake route for your address, and has no bearing at all on seeing a Registered Clinical Counsellor privately." },
      { q: "Do I need a doctor's referral?", a: "No. Counselling with an RCC is accessed directly. There is no referral, no diagnosis, and no waiting for a physician appointment first." },
      { q: "Is counselling covered by MSP?", a: "No. MSP does not cover counselling with an RCC. Many extended health plans reimburse it, depending on the plan, so check yours; receipts carry the registration number insurers ask for." },
      { q: "Can I have a session on a work day?", a: "Times depend on the counsellor, and the booking page shows what is open. Because there is no travel, a session costs the session rather than the afternoon around it as well." },
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
    communities: ["Walnut Grove", "Willoughby", "Fort Langley", "Brookswood", "Aldergrove"],
    region: "Fraser Valley",
    blurb: "Two municipalities share the name, so a practice “in Langley” may be nowhere near you.",
    metaDescription:
      "Online counselling for Langley City and the Township. Anxiety, trauma, EMDR and couples sessions by secure video across BC.",
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
      { q: "How do I check a counsellor is trained for what I need?", a: "Ask directly and expect a specific answer rather than a reassuring one. Training here is per counsellor, not practice-wide: one counsellor taking new clients lists additional training in EMDR and relationship therapy, the other works in CBT, ACT and DBT, and couples work is Gottman-informed. Each counsellor's own profile, linked from the practitioners page, sets out her training and her BCACC registration number, so you can verify it in the public register yourself." },
      { q: "What if it turns out not to be the right fit?", a: "Say so. A referral onward is a normal outcome and a better one than continuing out of politeness." },
      { q: "Is there a free consultation first?", a: "Yes: 30 minutes by video, no charge, no card, and no obligation to book anything afterwards." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["surrey", "abbotsford", "maple-ridge"],
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
   * ONE CENSUS FIGURE, LOOKED UP. Until 1 Oct 2026 this said no figure had
   * been verified, and the page said the city "skews older than almost
   * anywhere else in Metro Vancouver", a comparison nobody had checked. The
   * age split was then read from the Statistics Canada 2021 Census Profile
   * for White Rock (CSD 5915007): 8,185 of 21,940 residents aged 65 and over,
   * 37.3%. It is cited in sources. Re-read the profile before changing it. A
   * plausible-sounding invented statistic on a counselling site is worse than
   * no statistic, and that rule still holds for everything else below.
   *
   * WHITE ROCK & SOUTH SURREY, 1 Oct 2026. The hub's title, H1 and meta lead
   * with both names (displayPlace); /online-counselling/south-surrey and
   * /semiahmoo 308 here (lib/redirects.mjs). Search Console, 26 Sep: 8
   * impressions at 6.38, White Rock terms already at position 1, so the
   * volume to gain is South Surrey's. Two lines left the same day: the
   * Johnston Road doorway (the street scraper listings attach to the
   * practice) and a sentence calling the Peninsula's Punjabi-speaking
   * community "substantial", which was unverified and generalised about a
   * community. */
  {
    slug: "white-rock",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "White Rock",
    displayPlace: "White Rock & South Surrey",
    areaPlaces: [{ name: "South Surrey", containedIn: "Surrey" }],
    communities: ["South Surrey", "Ocean Park", "Crescent Beach", "Morgan Creek"],
    region: "Metro Vancouver",
    blurb: "A small city on the border where the counsellor you can reach may be someone you will see again at the pier.",
    metaDescription:
      "Online and virtual counselling for White Rock and South Surrey. EMDR, trauma, anxiety, grief and couples sessions by secure video.",
    intro: [
      "White Rock is small in a way that changes what privacy means. A city of a few square kilometres wrapped around one hill, one promenade and one main street is a place where the person in the waiting room is quite often someone you know, and where the counsellor you would be booking with may share a grocery store, a beach walk and a dentist with you.",
      "It is also an older city: in the 2021 Census, 8,185 of White Rock's 21,940 residents, about 37%, were 65 or over. That shapes what people actually come to therapy for here: retirement that turned out to be harder than expected, caregiving for a partner, grief after a long marriage, health anxiety with a real diagnosis underneath it, and adult children who moved away. Those are not the presentations a general \"anxiety and depression\" page is written for.",
    ],
    localReality: {
      h2: "A small city, an older population, and a border",
      body: [
        "**Small enough that discretion is a real constraint.** In a city this size the ordinary privacy of a counselling office is thinner than it looks. Being seen going in is not paranoia. It is arithmetic. A virtual practice has no doorway to be noticed at, which for some people here is the difference between starting and not.",
        "**An older population needs different work, not gentler work.** Grief, retirement, chronic illness and caregiver exhaustion are the substance of a great deal of counselling on the Peninsula, and they are frequently treated as things to be endured rather than worked on. [Grief without a timeline](/guides/grief-without-a-timeline) and the page for [family caregivers](/for/family-caregivers) cover what that work actually involves.",
        "**South Surrey is next door, and is not the same thing.** White Rock is its own municipality entirely surrounded by Surrey, and residents move between the two without thinking about it, but the services, the intake queues and the counsellor listings are organised by boundaries that do not match how anyone actually lives here. [Counselling in Surrey](/online-counselling/surrey) covers the larger picture, including the Punjabi-speaking practice that many Peninsula residents are looking for and searching one city over to find.",
        /* Fraser Health's Mental Health Centres directory, read 1 Oct 2026:
           "White Rock/South Surrey Mental Health and Substance Use Centre,
           15521 Russell Avenue, Russell Unit, White Rock"; adults 19+, and
           referrals accepted from patients themselves. */
        "**Public intake runs through Fraser Health.** Not Vancouver Coastal, despite the Metro Vancouver address. For the Peninsula the public door is the White Rock/South Surrey Mental Health and Substance Use Centre at 15521 Russell Avenue, which takes adults 19 and over and accepts a self-referral. Worth knowing before joining a waitlist anywhere else.",
      ],
    },
    access: [
      { label: "No doorway to be seen at", detail: "In a city where the pier, the pharmacy and the main street are shared, that is the practical privacy concern rather than an abstract one." },
      { label: "No drive up the hill", detail: "Sessions from home matter more where mobility, weather or a steep grade are part of the calculation." },
      { label: "Serves the whole Peninsula", detail: "White Rock, South Surrey, Crescent Beach and Ocean Park, on identical terms, municipal boundaries do not change availability." },
      { label: "English, Punjabi or Tagalog", detail: "Which of the three depends on the counsellor. Moving between a language and English mid-session is normal, and needs no travel into Surrey to find." },
    ],
    faqs: [
      { q: "Do you have an office in White Rock?", a: "No. Every session is by secure video; there is no office anywhere." },
      { q: "Do you cover South Surrey, Crescent Beach and Ocean Park?", a: "Yes, and on exactly the same terms. The practice covers all of British Columbia, so which side of the White Rock–Surrey boundary you live on changes nothing about availability or fee." },
      { q: "I am retired. Is counselling still worth starting?", a: "Yes, and the question comes up here more than almost anywhere. Grief, the shape of retirement, caregiving and health worry are ordinary reasons to start and respond to the work as well as anything else does. A free 30-minute consultation is a reasonable way to find out whether it is worth your time, and saying no afterwards costs nothing." },
      { q: "I am not confident with video calls. Is that a problem?", a: "No. The link opens in a browser with nothing to install and no account to create, and the first few minutes of a first session are routinely spent making sure it works. If the video is the obstacle, say so on the consultation call and it can be sorted out then rather than on the day." },
      ...(PUNJABI_COUNSELLOR
        ? [{ q: "Can I have sessions in Punjabi?", a: `Yes, with ${PUNJABI_COUNSELLOR.name}, in Punjabi, English or a mix.` }]
        : []),
      { q: "Is it better to look for someone local?", a: "Sometimes, and you would be told so on a consultation call. A counsellor you can drive to suits plenty of people. What a local option costs in a city this small is the privacy question, and White Rock has few enough counsellors that \"local\" frequently means Surrey or Langley anyway, at which point the drive is buying you nothing." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
      { label: "Statistics Canada, 2021 Census Profile: White Rock (CSD 5915007)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915007&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Fraser Health, Mental Health Centres directory", url: "https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres" },
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
    communities: ["Steveston", "Brighouse", "Hamilton", "Sea Island"],
    region: "Metro Vancouver",
    blurb: "A large city whose counselling supply is organised around languages this practice does not offer, which thins the field more than the population suggests.",
    metaDescription:
      "Online counselling for Richmond, BC. EMDR, trauma, anxiety, depression and couples sessions by secure video, with no drive.",
    intro: [
      "Richmond is one of the larger cities in Metro Vancouver, and on paper that should mean a wide choice of counsellors. In practice the choice narrows quickly depending on what you need it in. A great deal of Richmond's mental-health provision is built, correctly and deliberately, around its Chinese-speaking communities, Cantonese and Mandarin services are a genuine local strength.",
      "If you are looking in English, Punjabi or Tagalog, the field is thinner than the city's size implies, and people routinely end up searching in Vancouver or Surrey instead. That is the gap this page is about. It is worth saying plainly that **this practice offers English and Punjabi and not Cantonese or Mandarin**, if those are what you need, Richmond is a better place to look locally than almost anywhere in the province, and you should.",
    ],
    localReality: {
      h2: "Language, the airport, and a bridge",
      body: [
        "**Language shapes the local supply more than distance does.** Richmond's counselling capacity is real; the question is whether it exists in the language you want to be understood in. For English, Punjabi or Tagalog speakers here, \"local\" often means crossing a bridge anyway, at which point the drive is buying nothing that a video call does not.",
        "**Shift work at YVR and the port does not fit a 9-to-5 slot.** Airport operations, ground handling, freight and hospitality run on rosters that change, and a standing weekly appointment at 2pm is not something those schedules survive. Attending from wherever you are between shifts, at a time picked from what the counsellor has open, is the practical difference.",
        "**Public intake runs through Vancouver Coastal Health**, not Fraser Health, which matters if you have been given a referral or joined a waitlist and are trying to work out which queue you are actually in.",
        "**Punjabi-speaking counselling is the specific case.** Richmond's Punjabi-speaking community is smaller than Surrey's or Abbotsford's and the local provision reflects that. [Punjabi-speaking counselling](/services/punjabi-counselling) covers what sessions in Punjabi actually involve, and [counselling in Surrey](/online-counselling/surrey) covers the larger picture one bridge east.",
      ],
    },
    access: [
      { label: "No bridge, no tunnel", detail: "The Massey Tunnel and the Oak Street bridge stop being part of the appointment." },
      { label: "English, Punjabi or Tagalog", detail: "Which of the three depends on the counsellor, and moving between one and English mid-session is normal. Cantonese and Mandarin are not offered here, Richmond is genuinely well served for those locally." },
      { label: "Built for shift rosters", detail: "No travel time either side of a session, and a time picked from what the counsellor has open rather than a fixed weekly slot." },
      { label: "Serves all of Richmond", detail: "Steveston, Brighouse, Hamilton and the island's east side on identical terms." },
    ],
    faqs: [
      { q: "Do you offer counselling in Cantonese or Mandarin?", a: "No. Sessions are in English, Punjabi or Tagalog, or a mix of two. If you want to work in Cantonese or Mandarin, Richmond is one of the better places in BC to look locally, and doing so is the right call rather than a compromise. This page is not trying to talk you out of it." },
      { q: "Can I have sessions in Punjabi?", a: "Yes: in Punjabi, English, or both within the same session, with no need to travel to Surrey or Vancouver to find it." },
      { q: "I work rotating shifts at the airport. Can therapy fit around that?", a: "Yes, and it works far better if it is planned for from the start rather than discovered in month two. Booking block by block around a roster, with gaps, is a normal pattern and nothing is lost by pausing between blocks." },
      { q: "Which health authority covers Richmond?", a: "Vancouver Coastal Health, not Fraser Health. It is worth knowing before joining a public waitlist, because a referral into the wrong authority's queue is a delay nobody tells you about until you ask." },
      { q: "Is there a free consultation first?", a: "Yes: 30 minutes by video, no charge, no card, and no obligation afterwards. If it turns out someone else is a better fit, you will be told that on the call." },
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
    communities: ["Port Coquitlam", "Port Moody", "Anmore", "Belcarra"],
    region: "Metro Vancouver",
    blurb: "The Tri-Cities commute takes the evenings a weekly appointment would have to live in.",
    metaDescription:
      "Online counselling for Coquitlam and the Tri-Cities. EMDR, trauma, anxiety, depression and couples sessions, with no commute.",
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
      { label: "English, Punjabi or Tagalog", detail: "Which of the three depends on the counsellor. Moving between one and English within a session is normal." },
    ],
    faqs: [
      { q: "Do you cover Port Coquitlam and Port Moody?", a: "Yes, and on the same terms. The practice is virtual and covers all of British Columbia, so which of the three municipalities you live in changes nothing about availability or fee." },
      { q: "Which health authority covers the Tri-Cities?", a: "Fraser Health, despite most people here looking west to Vancouver and Burnaby for work and for a lot of services. It is worth confirming before joining a public waitlist. A referral into the wrong authority's queue costs weeks that nobody flags." },
      { q: "I get home late. What is the latest appointment?", a: "Times depend on the counsellor, and the booking page shows what is open right now. If none of them work it is worth saying so on the consultation call rather than forcing a time that will not survive a busy month." },
      { q: "Does virtual therapy actually work as well?", a: "For the concerns most people bring: anxiety, depression, trauma, relationship difficulty. The research on video-delivered therapy shows outcomes broadly comparable to in-person work. The trade-offs are real and worth talking through on a consultation." },
      { q: "Is there a free consultation first?", a: "Yes: 30 minutes by video, no charge, no card, and no obligation to book anything afterwards." },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["burnaby", "vancouver", "maple-ridge"],
  },

  {
    slug: "delta",
    figure2: 'first-session-flow',
    figure: "bc-reach",
    city: "Delta",
    communities: ["Ladner", "Tsawwassen", "North Delta"],
    region: "Metro Vancouver",
    blurb: "Three communities sharing a municipality and almost nothing else, including how hard it is to reach a counsellor.",
    metaDescription:
      "Online counselling for Delta: North Delta, Ladner and Tsawwassen. Sessions by secure video with a Registered Clinical Counsellor.",
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
        "**Shift work at Deltaport and the ferry terminal does not fit a standing slot.** Port and terminal rosters change, and a session with no travel either side, booked from what the counsellor has open rather than a standing slot, is what makes attendance realistic rather than aspirational.",
        "**Public intake runs through Fraser Health.**",
      ],
    },
    access: [
      { label: "The tunnel stops mattering", detail: "No appointment is scheduled around traffic that cannot be predicted a week ahead." },
      { label: "All three communities", detail: "North Delta, Ladner and Tsawwassen on identical terms, the municipal boundary changes nothing." },
      { label: "English, Punjabi or Tagalog", detail: "Which of the three depends on the counsellor, and none of it requires driving into Surrey to find." },
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
    /* Duncan, Chemainus and Port Alberni added 1 Oct 2026, all Island Health.
       Duncan's retired URL lands here (lib/redirects.mjs). */
    communities: ["Parksville", "Ladysmith", "Qualicum Beach", "Lantzville", "Gabriola Island", "Duncan", "Chemainus", "Port Alberni"],
    region: "Vancouver Island",
    blurb: "Everything the Lower Mainland offers is across water, which turns a specialist appointment into a whole day and a ferry.",
    metaDescription:
      "Online counselling for Nanaimo and central Vancouver Island. EMDR, trauma, anxiety and couples therapy by video, with no ferry.",
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
      { label: "Serves central Vancouver Island", detail: "Nanaimo, Parksville, Ladysmith, Lantzville and Gabriola on identical terms, and south to Duncan, Chemainus and the Cowichan Valley or west to Port Alberni." },
      { label: "English, Punjabi or Tagalog", detail: "Punjabi- and Tagalog-speaking counsellors are concentrated in the Lower Mainland; virtual access is the realistic route to it from here." },
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
    communities: ["Sardis", "Agassiz", "Harrison Hot Springs", "Hope", "Yarrow"],
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
      { q: "What does a session cost?", a: `${fallbackFee('Individual Counselling')} for 50 minutes, after a free 30-minute consultation. Many extended health plans reimburse sessions with a Registered Clinical Counsellor, depending on the plan, so check yours; MSP does not cover them.` },
    ],
    sources: [
      { label: "Fraser Health, mental health and substance use services", url: "https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
    nearby: ["abbotsford", "langley"],
  },

  /* ── Two regional pages, 1 Oct 2026 ──────────────────────────────────────
   *
   * Both slugs were among the 37 retired in the Phase 1 audit and 308'd to
   * the index until today. Each is removed from lib/redirects.mjs in the same
   * change. The condition at the top of this file is met for each, and for a
   * reason neither neighbour's page already makes:
   *
   *   Penticton     the South Okanagan queues BEHIND Kelowna. Kelowna's
   *                 page argues it is the valley's hub; this is the same
   *                 arithmetic seen from the end of the line, and Search
   *                 Console has "emdr counseling penticton" at 28 with
   *                 nothing on the site naming the town.
   *   Fort St. John the Peace keeps UTC-7 all year (the clock BC itself
   *                 keeps from 1 Nov 2026, so the old "an hour ahead in
   *                 winter" no longer holds; corrected 2 Oct 2026), works on
   *                 rotation across the Alberta line, and is about 440 km
   *                 from Prince George, whose page named it only in passing.
   *
   * No wait times and no hours, as everywhere else. */
  {
    slug: "penticton",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Penticton",
    communities: ["Summerland", "Naramata", "Okanagan Falls", "Oliver", "Osoyoos", "Keremeos"],
    region: "Okanagan",
    blurb: "The South Okanagan sits at the far end of a referral line that runs up the valley to Kelowna.",
    metaDescription:
      "Online counselling for Penticton and the South Okanagan. Summerland to Osoyoos and Keremeos: EMDR, trauma, anxiety and couples therapy by video.",
    intro: [
      "Penticton is a regional centre in its own right. Penticton Regional Hospital serves the South Okanagan, Okanagan College has a campus here, and the private sector covers a good deal of general counselling well. What Penticton is not is the top of the valley's referral line. Specialised services in the Okanagan concentrate in Kelowna, and Kelowna's practices already absorb demand from Vernon and West Kelowna as well as from the south.",
      "So the South Okanagan queues behind Kelowna, and the further south you live the longer that queue looks. From Oliver or Osoyoos, \"available in Kelowna\" means Highway 97 up the length of the valley and back; from Keremeos it means the Similkameen first. Virtual counselling takes the highway out of it. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) anywhere in BC is exactly as available to you in Summerland as to somebody in downtown Kelowna.",
    ],
    localReality: {
      h2: "Second in line for the valley's specialists",
      body: [
        "**Interior Health is the public route here**, as it is in Kelowna and Kamloops, and its mental-health and substance-use services in Penticton are worth using, and worth staying connected to if you already are. Where local options run out is where they run out across the Interior: a particular approach, a particular language, or a practitioner with specific experience of what you are bringing.",
        "**The queue has a direction.** When a South Okanagan list is full, the next suggestion is usually Kelowna, and Kelowna's lists are already carrying the rest of the valley. The [Kelowna page](/online-counselling/kelowna) describes that from the hub; this is the same arithmetic from the far end. Widening a search to Kelowna rarely makes it shorter. It makes it an hour further away.",
        "**EMDR is the clearest case.** People here search for EMDR by name, and it is the kind of specific training a smaller local sector may hold one or two of, or none. [EMDR therapy](/services/emdr-therapy) runs by secure video with the same preparation and pacing as in a room, and [EMDR for Kelowna and the Okanagan](/online-counselling/kelowna/emdr-therapy) sets out why the valley's EMDR clusters where it does.",
        "**Orchards, vineyards and the summer trade keep their own calendar.** Picking, the crush, and a tourist season that fills Penticton and Osoyoos all peak hard, and a standing weekday appointment does not survive a peak. Booking in blocks around the season, with a planned pause, is ordinary here rather than a sign of dropping out.",
        "**Smoke and fire seasons are part of the year now.** Summers of evacuation alerts and smoke across the South Okanagan and the Similkameen are a real and recurring strain, and the fact that a whole community lived through them does not make one person's response smaller. A specific, identifiable event is the kind of thing trauma-focused work and EMDR are suited to.",
        "**Language is thinner again.** Punjabi-speaking clinicians are concentrated in the Lower Mainland, and the Interior has few. [Punjabi-speaking counselling for the Okanagan](/punjabi-counselling/kelowna) covers what is and is not available in the valley, Penticton included.",
      ],
    },
    access: [
      { label: "No Highway 97 commute", detail: "From Oliver, Osoyoos or Keremeos a Kelowna appointment is most of a day. A video session is fifty minutes and a closed door." },
      { label: "Not queuing behind Kelowna", detail: "The pool is everyone in British Columbia trained in what you need, not the shortlist the whole valley shares." },
      { label: "Summerland to Osoyoos, and the Similkameen", detail: "Summerland, Naramata, Okanagan Falls, Oliver, Osoyoos and Keremeos on identical terms, with no penalty for being further south." },
      { label: "Fits the harvest and the summer rush", detail: "Pausing for a season and starting again afterwards is planned for at the outset, so a busy month does not end the work." },
    ],
    faqs: [
      { q: "Isn’t Kelowna close enough to drive to?", a: "For some people it is, and if an in-person appointment in Kelowna suits you, that is a reasonable choice. The difficulty is that a weekly appointment an hour up the valley is not a fifty-minute commitment, it is most of an afternoon, and from Oliver or Osoyoos it is longer. Travel is one of the ordinary reasons a course of counselling stops early, and video removes it." },
      { q: "Can I have EMDR from Penticton?", a: "Yes, by secure video, with the same preparation and pacing as in person. Bilateral stimulation is usually a moving point on screen or self-administered tapping, both established remote methods, and both are explained and practised before any processing begins. Being in the South Okanagan rather than Kelowna or the coast changes nothing about the session." },
      { q: "Which health authority covers the South Okanagan?", a: "Interior Health, the same authority as Kelowna and Kamloops. Its public mental-health and substance-use services run alongside private counselling rather than instead of it, so starting privately does not mean leaving a public list." },
      { q: "I work the harvest. Can sessions stop and start?", a: "Yes. Picking, the crush and the summer season each run on their own calendar, and a plan that assumes the same weekday from spring to fall rarely holds. Sessions can be concentrated before and after the busy stretch with a pause agreed in the middle, which keeps the thread of the work rather than losing it to three missed weeks." },
      { q: "Is there something free I should look at first?", a: "Yes. Interior Health's mental-health and substance-use services are the public route, 8-1-1 connects to HealthLink BC at any hour, and the low-cost counselling page lists free and reduced-fee options across the province. If one of those fits, use it." },
    ],
    sources: [
      { label: "Interior Health, access mental health and substance use services", url: "https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["kelowna", "kamloops"],
  },

  {
    slug: "fort-st-john",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Fort St. John",
    communities: ["Dawson Creek", "Taylor", "Chetwynd", "Hudson’s Hope", "Fort Nelson"],
    region: "Northern BC",
    blurb: "The Peace never changes its clocks, works on rotation, and sits a long day's drive from Prince George.",
    metaDescription:
      "Online counselling for Fort St. John and the Peace region. Dawson Creek, Chetwynd, Fort Nelson: built around rotations and camp work, by video.",
    intro: [
      "Fort St. John is the largest city in BC's Peace region, and it is a long way from the rest of the province: about 440 kilometres to Prince George over the Pine Pass, and further again to anywhere on the coast. Northern Health runs mental-health and substance-use services here, and they are worth using. What the Peace does not have is depth, and specialist care has generally meant Prince George or a flight.",
      "The Peace also works differently from most of BC. Energy, the dams, construction, agriculture and the trades that follow them run on rotation, and a lot of people here split their weeks between home, camp and the Alberta side of the line. Counselling that assumes the same weekday every week, from the same town, does not fit that life. Video sessions can.",
    ],
    localReality: {
      h2: "A clock that never changes, and a different week",
      body: [
        "**The Peace keeps Mountain Standard Time all year.** Fort St. John, Dawson Creek, Chetwynd, Taylor and Hudson’s Hope do not change their clocks, and Fort Nelson joined them in 2015. For years that put the Peace an hour ahead of Vancouver every winter. From November 2026 British Columbia stops changing its clocks too, so a time on the booking calendar, which is Pacific time, is the same hour in the Peace all year. The Alberta side of the line is the one to check: if you book from there, look at which clock the booking confirmation is written in before the first appointment rather than on the day.",
        "**Rotation is the normal working pattern, not a niche.** The page on [counselling for rotational and camp workers](/for/rotational-and-camp-workers) sets out what tends to come up: the re-entry problem, sleep that never settles, a relationship run largely by phone. Sessions concentrated in the days at home, sessions from camp where the connection and the privacy allow, or a pattern that changes with the shift are all workable, and the booking calendar shows each counsellor's real open times.",
        "**The Alberta side of the line is a legal question, not a scheduling one.** A counsellor has to be registered where you are physically sitting during a session, so sessions with a BC Registered Clinical Counsellor run while you are in British Columbia." + ALBERTA_LINE,
        "**Prince George is the north's referral centre, and it is a long way off.** The [Prince George page](/online-counselling/prince-george) sets out how thin coverage is across Northern Health. From the Peace, that thin coverage is also a day's return drive away, over a pass that winter weather can close.",
        "**In a small town, privacy is the real question.** In Taylor, Chetwynd or Hudson’s Hope, the counsellor in town may also be a neighbour, a coach or somebody's cousin. A practice based elsewhere in the province removes that: no waiting room, and no truck in a parking lot that anyone would recognise.",
        "**What happens at work stays with people.** Serious incidents on site get a debrief and then everyone goes back to work. Where a specific incident has stayed with you, [EMDR therapy](/services/emdr-therapy) is a direct route, and it runs by video.",
      ],
    },
    access: [
      { label: "Built around a rotation", detail: "Blocks of sessions during the days at home, or sessions from camp where the connection allows. The camera can stay off, which cuts what a camp connection has to carry." },
      { label: "No Pine Pass, no flight", detail: "Specialist work that used to mean Prince George or the coast happens from wherever you have a private room." },
      { label: "Dawson Creek to Fort Nelson", detail: "Taylor, Chetwynd, Hudson’s Hope, Dawson Creek and Fort Nelson on identical terms, with no travel penalty for being further out." },
      { label: "Privacy in a small community", detail: "Nobody local sees you attend, because there is nowhere to attend." },
    ],
    faqs: [
      { q: "What time will my session be in Fort St. John?", a: "The same hour the booking calendar shows. The Peace stays on Mountain Standard Time all year, and from November 2026 the rest of British Columbia keeps that same clock, so Pacific time and Peace time match in every season. If you book while on the Alberta side of the line, check which time zone the booking confirmation shows, and if anything is unclear, ask before the first session rather than on the day." },
      { q: "I work in Alberta part of the time. Can I still have sessions?", a: "Yes, while you are in British Columbia. A BC Registered Clinical Counsellor can only see you while you are physically in BC, so sessions are planned for the days you are back on this side of the line." + ALBERTA_FAQ },
      { q: "Can sessions happen from a work camp?", a: "Where the connection and a private room allow, yes. Privacy is usually the harder of the two: a vehicle, a closed room off-shift, or keeping sessions for the days at home are the common answers. Test the connection before booking rather than partway through a session." },
      { q: "Which health authority covers the Peace?", a: "Northern Health. Its mental-health and substance-use services are the public route, and staying on a public list while starting privately costs nothing: the two run side by side." },
    ],
    sources: [
      { label: "Northern Health, mental health and substance use services", url: "https://www.northernhealth.ca/services/mental-health-substance-use" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
    nearby: ["prince-george", "kamloops"],
  },

  /* ── Saanich, 2 Oct 2026 ──
   * The argument: Greater Victoria's largest municipality is filed under
   * Victoria by every listing, and the things that shape counselling here are
   * its own: the university (about 60% of the UVic campus is in Saanich, per
   * UVic Campus Planning), Camosun's Interurban campus, the Peninsula's older
   * towns (Sidney median age 62.0 in 2021) and an emergency department in
   * Saanichton that keeps set hours, and the region's largest Punjabi-speaking
   * community (2,655 of the Capital census division's 4,350). Victoria's page
   * argues the strait; this one does not.
   * Language, EMDR and couples claims are kept out of intro, access and
   * faqs[0..4], because place pages copy those (SHAPE §4), and Savneet offers
   * neither EMDR nor couples. No wait times, no hours, no weekday names. */
  {
    slug: "saanich",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Saanich",
    communities: ["Gordon Head", "Cordova Bay", "Royal Oak", "Central Saanich", "North Saanich", "Sidney"],
    region: "Vancouver Island",
    blurb: "Greater Victoria’s largest municipality is filed under Victoria by most directories, and is not the same place.",
    metaDescription:
      "Online counselling for Saanich and the Peninsula. Gordon Head and UVic to Sidney: trauma, anxiety, depression and couples therapy by secure video.",
    intro: [
      "Saanich is the largest municipality in Greater Victoria, larger than the City of Victoria itself, and almost nobody looking for a counsellor from here types its name. Listings, directories and referrals file it under Victoria. That is mostly harmless. It stops being harmless when the public door is downtown, when most of the university sits on the Saanich side of the boundary, and when the Peninsula towns at the end of Highway 17 live at a different pace from either.",
      "None of that is a complaint about Victoria’s services, which are good. It is about the distance between where people live and where help is listed. From Sidney or North Saanich, \"in Victoria\" means Highway 17 both ways; from Gordon Head it means a bus downtown between lectures. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) by secure video takes the trip out of it, and puts Cordova Bay and Brentwood Bay on the same footing as a street off Douglas.",
    ],
    localReality: {
      h2: "The municipality everyone calls Victoria",
      body: [
        /* Island Health news release, 13 Jun 2024, read 2 Oct 2026: CARES at
           1119 Pembroke Street offers same-day assessment and walk-in
           counselling to people on the South Island whose concern does not
           need a hospital; no referral; sessions also virtual. Hours omitted
           by rule. */
        "**The public door is downtown, and it is a good one.** Island Health’s Central Access and Rapid Engagement Services (CARES) on Pembroke Street offers South Island residents a same-day assessment and walk-in counselling, in person or by video. For something that needs attention this week, that is the place to begin. Private counselling earns its place later: when the work runs for months rather than a visit, or calls for an approach the South Island has few people trained in.",
        /* 2021 Census, age (Sidney), read 2 Oct 2026 through StatCan's data service; cited at the Census Profile. Island Health,
           Saanich Peninsula Hospital page, read 2 Oct 2026: the emergency
           department keeps set daily hours and directs people to Royal Jubilee
           or Victoria General outside them. */
        "**The Peninsula is older, and its emergency department keeps set hours.** In the 2021 Census, 5,540 of Sidney’s 12,320 residents were 65 or over, and the town’s median age was 62. In a town with that age profile, [grief](/guides/grief-without-a-timeline), [caregiving](/for/family-caregivers) and the shape of retirement are close to home for a great many households. Saanich Peninsula Hospital’s emergency department is not open around the clock; outside its hours Island Health directs people to Royal Jubilee or Victoria General. Better known before a hard moment than during one.",
        /* UVic Campus Planning, read 2 Oct 2026: "approximately 40% of the
           campus located within the District of Oak Bay and 60% in the
           District of Saanich". Camosun: the Interurban campus is in Saanich. */
        "**The university is mostly in Saanich.** About 60% of the University of Victoria’s campus lies inside the District of Saanich, and Camosun College’s Interurban campus is here too. Students have UVic Student Wellness and Camosun’s counselling centre, and should use them. What a campus service is not built for is the summer at home in Kelowna or Prince George: a provincial registration means the same counsellor can keep working with you in both places, as long as you are in British Columbia. More on [counselling for university students](/for/university-students).",
        /* 2021 Census, mother tongue (single responses), read 2 Oct 2026 through
           StatCan's data service (Table 98-10-0173-01): Saanich 2,655 Punjabi and
           1,375 Tagalog; City of Victoria 410 and 1,145; Capital census division
           4,350 and 4,145. Cited at the Census Profile, as every other city is. */
        "**The region’s largest Punjabi-speaking community lives here, not downtown.** In the 2021 Census 2,655 Saanich residents reported Punjabi as their mother tongue, against 410 in the City of Victoria: about three in every five in the Capital Region. Yet the counsellors who work in Punjabi are mostly on the far side of the Salish Sea, so for a family in Royal Oak a session in the language has usually meant a sailing. [Punjabi-speaking counselling for Saanich](/punjabi-counselling/saanich) sets out the numbers.",
        "**The same is true of Tagalog.** In the same census, 1,375 Saanich residents reported Tagalog as their mother tongue, more than in any other municipality in the region, the City of Victoria (1,145) included. [Tagalog-speaking counselling in Saanich](/tagalog-counselling/saanich) covers what that means in practice.",
        "**On the Peninsula, the local counsellor may be a neighbour.** In Sidney, Brentwood Bay or Saanichton the person in the waiting room, or the one you would book with, may be somebody you see at the pharmacy. A practice with no local office removes the question. The [Victoria page](/online-counselling/victoria) covers what the strait costs; here, the shorter distances count because they come weekly.",
      ],
    },
    access: [
      { label: "Not filed under Victoria", detail: "Gordon Head, Cordova Bay, Royal Oak and the Peninsula on the same terms as downtown, with nothing to cross town for." },
      { label: "Highway 17 stays out of it", detail: "From Sidney or North Saanich, a downtown appointment means the Pat Bay Highway there and back. By video the session starts where you already are." },
      { label: "The same counsellor between terms", detail: "Students who spend the summer elsewhere in British Columbia keep working with the same person, rather than starting again each September." },
      { label: "No one at the pharmacy knows", detail: "In Sidney or Brentwood Bay the people you would pass on the way to a local office are the people you see every week. A video session has no front door on Beacon Avenue." },
    ],
    faqs: [
      { q: "Isn’t Saanich just part of Victoria?", a: "Not administratively. Saanich is its own district municipality, the largest in Greater Victoria, though most listings file it under Victoria. For counselling it makes no practical difference: Island Health is the public authority for both, and a Registered Clinical Counsellor anywhere in British Columbia can see you by secure video wherever in the district you live." },
      { q: "Which health authority covers Saanich and the Peninsula?", a: "Island Health. Its CARES service on Pembroke Street offers South Island residents same-day assessment and walk-in counselling, in person or by video. Using CARES and seeing a private counsellor are not either-or: many people do one while waiting on, or after, the other." },
      { q: "I study at UVic or Camosun. Should I use campus counselling first?", a: "Usually, yes. UVic Student Wellness and Camosun’s Counselling Centre exist for students, and UVic’s SupportConnect is free and confidential for UVic students. Private counselling suits people who want continuity past the end of term, including over a summer spent elsewhere in British Columbia, or whose needs are more specific than a campus service is set up for." },
      { q: "Is Saanich Peninsula Hospital’s emergency department always open?", a: "No. It keeps set daily hours, and outside them Island Health directs people to Royal Jubilee or Victoria General. In an emergency call 9-1-1. In a crisis, 9-8-8 answers by call or text at any hour, the Vancouver Island Crisis Line is 1-888-494-3888, and 310-6789 reaches mental-health support anywhere in BC with no area code." },
      { q: "Is there something free or low-cost I should look at first?", a: "Yes. CARES is Island Health’s public walk-in route, 8-1-1 connects to HealthLink BC at any hour, and the Greater Victoria Citizens’ Counselling Centre has a sliding fee scale based on family income. The low-cost counselling page lists more across the province. If one of those fits, use it." },
      { q: "Can I have sessions in Punjabi from Saanich?", a: "Yes, for individual counselling, in Punjabi, English or a mix of the two, by secure video. Saanich is home to about three in five of the Capital Region’s Punjabi mother-tongue speakers, while counsellors working in the language are mostly across the water, so for most families here video is how a Punjabi session happens at all. Couples work and EMDR currently run in English or Tagalog." },
      { q: "Is anyone working in Tagalog?", a: "Yes. Individual and couples sessions can run in Tagalog, English or both, by secure video. The Tagalog-speaking counselling page for Saanich sets out the rest." },
    ],
    sources: [
      { label: "Island Health, same-day mental health and substance use supports (CARES), news release", url: "https://www.islandhealth.ca/news/news-releases/more-options-available-people-needing-same-day-mental-health-and-addiction-supports" },
      { label: "Island Health, Saanich Peninsula Hospital", url: "https://www.islandhealth.ca/locations/hospitals-health-centre-locations/saanich-peninsula-hospital" },
      { label: "Statistics Canada, Census Profile, 2021 Census of Population: Sidney and North Saanich (age)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917010,2021A00055917005&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Statistics Canada, Census Profile, 2021 Census of Population: Saanich, Victoria and the Capital Regional District (population, mother tongue)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917021,2021A00055917034,2021A00035917&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "University of Victoria, campus planning regulations (Saanich and Oak Bay)", url: "https://www.uvic.ca/campusplanning/about/regulations/index.php" },
      { label: "Vancouver Island Crisis Society, Vancouver Island Crisis Line", url: "https://www.vicrisis.ca/" },
      { label: "Crisis Centre of BC, 310 Mental Health Support (310-6789) and 9-8-8", url: "https://crisiscentre.bc.ca/" },
      { label: "University of Victoria, SupportConnect", url: "https://www.uvic.ca/student-wellness/wellness-resources/supportconnect/index.php" },
      { label: "Camosun College, Interurban campus", url: "https://camosun.ca/about/our-campuses/interurban-campus" },
      { label: "Greater Victoria Citizens’ Counselling Centre", url: "https://www.citizenscounselling.com/" },
    ],
    nearby: ["victoria", "nanaimo"],
    audiences: ["university-students", "family-caregivers"],
  },

  /* ── Maple Ridge, 2 Oct 2026 ─────────────────────────────────────────────
   *
   * Retired in the Phase 1 audit and 308'd to the index until today; removed
   * from lib/redirects.mjs in the same change, and 'pitt-meadows' now lands
   * here (RETIRED_TOWN_HOMES). The condition at the top of this file is met
   * for a reason no neighbour's page makes:
   *
   *   Maple Ridge   a city its workers leave. 2021 Census: about 62% of
   *                 employed residents with a usual place of work worked
   *                 outside Maple Ridge, about 80% in Pitt Meadows, and more
   *                 than a quarter commuted 45 minutes or more. The real
   *                 choice is a counsellor near home or near work, and both
   *                 lose. Coquitlam argues the commute eats the time; this is
   *                 the choice between two places, seen from the far bank.
   *
   * Census figures were read from the Statistics Canada Census Profile for
   * Maple Ridge (CSD 5915075) and Pitt Meadows (CSD 5915070), both cited in
   * sources. Re-read them before changing a number. Read 2 Oct 2026 through StatCan's
   * data service, when the www12 Census Profile pages returned 404 from here;
   * cited at the Census Profile, as every other city is. Language, EMDR and
   * couples claims stay out of intro, access and faqs[0..4], which the place
   * pages copy. No wait times, no hours. */
  {
    slug: "maple-ridge",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Maple Ridge",
    communities: ["Pitt Meadows", "Haney", "Hammond", "Albion", "Silver Valley", "Whonnock"],
    region: "Metro Vancouver",
    blurb: "Most of Maple Ridge leaves town to work, so any counsellor is either near home or near work.",
    metaDescription:
      "Online counselling for Maple Ridge and Pitt Meadows. Haney, Albion, Silver Valley: sessions by secure video, with no bridge on either side of them.",
    intro: [
      "Maple Ridge is a city its workers leave. In the 2021 Census about six in ten employed residents with a usual place of work worked outside the city, and in Pitt Meadows about eight in ten. Nine in ten commuters went by car, and more than a quarter spent 45 minutes or longer getting there. The day starts on the Lougheed Highway, the Pitt River Bridge or the Golden Ears Bridge, and ends there too.",
      "That turns finding a counsellor into a choice between two places. One near work means an hour carved out of the working day and nothing on a day off. One near home means arriving after the drive back, already tired. Video takes the place out of it. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) anywhere in BC is as reachable from Silver Valley as from a desk downtown.",
    ],
    localReality: {
      h2: "A city that empties out by morning",
      body: [
        "**The commute sets the shape of the day.** About three in ten Maple Ridge workers left for work between five and seven in the morning in 2021, and the West Coast Express runs west from Port Haney, Maple Meadows and Pitt Meadows in the morning and back in the afternoon, at commuter peaks only. A standing appointment has to fit around that, and one that needs its own drive is hard to keep through a month of it.",
        "**Near home or near work is a false choice.** Picking a counsellor by side of the river means picking which half of the week the work has to fit into, and the other half still happens. A session by video goes wherever you are that day: a parked car outside work, a closed door at home, or a quiet room on a day off.",
        "**Ridge Meadows shares its public services.** Maple Ridge and Pitt Meadows are one service area for Fraser Health. Ridge Meadows Hospital serves both, with an emergency department and an inpatient psychiatry unit, and the Maple Ridge Mental Health and Substance Use Centre on Dewdney Trunk Road takes adults 19 and over and accepts referrals from patients themselves. Foundry Ridge Meadows offers free services, including counselling, for young people aged 12 to 24 and their families.",
        "**Not everyone keeps the train's timetable.** Two provincial correctional centres, Fraser Regional and Alouette Correctional Centre for Women, are in Maple Ridge, and Ridge Meadows Hospital runs around the clock. Shift rosters do not line up with anyone's weekly slot. [Counselling for first responders and corrections staff](/for/first-responders) covers what that work leaves behind and the claim route that exists for it.",
        "**Anything specialised usually means a bridge.** The Golden Ears Bridge replaced the Albion ferry in 2009 and connects Maple Ridge and Pitt Meadows to Langley and Surrey; the Pitt River Bridge leads west to Coquitlam. When a particular approach such as [EMDR therapy](/services/emdr-therapy) is the need, the search tends to cross one of them, and the [Langley](/online-counselling/langley) and [Coquitlam](/online-counselling/coquitlam) pages describe what is on the other side.",
        "**Language communities here are real and small.** In the 2021 Census about 1.5% of Maple Ridge residents gave Punjabi as their mother tongue and about 1.5% gave Tagalog. That is a community, and too small for many local services to run in either language. [Punjabi-speaking counselling for Maple Ridge](/punjabi-counselling/maple-ridge) and [Tagalog-speaking counselling for Maple Ridge](/tagalog-counselling/maple-ridge) say what is available without crossing the river.",
      ],
    },
    access: [
      { label: "No third bridge crossing", detail: "For many here the working day already crosses the Pitt River or the Fraser twice. A session from home or a parked car adds nothing to that." },
      { label: "Near home and near work at once", detail: "The session goes where you are that day, so a week split between Maple Ridge and a job across the river does not decide which counsellor you can see." },
      { label: "Pitt Meadows to Whonnock", detail: "Pitt Meadows, Haney, Hammond, Albion, Silver Valley and Whonnock on identical terms, with no penalty for living at the far east end." },
      { label: "Built for rosters as well as commutes", detail: "Hospital and corrections rosters change from one rotation to the next. The booking calendar shows each counsellor's real open times, so sessions can follow the roster instead of a fixed day of the week." },
    ],
    faqs: [
      { q: "I work across the river. Should I look for a counsellor near work or near home?", a: "Whichever you choose, one side of the week loses. A counsellor near work means time cut out of the working day and nothing on days off; one near home means a session after the drive back. Video removes the choice: the same counsellor, from wherever you are that day, with nothing to cross." },
      { q: "Which health authority covers Maple Ridge and Pitt Meadows?", a: "Fraser Health. The public door is the Maple Ridge Mental Health and Substance Use Centre on Dewdney Trunk Road, which takes adults 19 and over and accepts a self-referral, and Ridge Meadows Hospital has an emergency department. A place in the public queue is not given up by starting with a private counsellor in the meantime." },
      { q: "I work shifts at a correctional centre or the hospital. Can sessions fit?", a: "Yes. Describe how the roster runs at the consultation, and sessions are spaced to match that pattern rather than pinned to one day. The booking calendar shows each counsellor's real open times. A run of nights or a stretch of overtime is a reason to space sessions further apart, not to stop." },
      { q: "Is there something free for a teenager or young adult here?", a: "Yes. Foundry Ridge Meadows on the Lougheed Highway offers free, confidential services for young people aged 12 to 24 and their families, including counselling. For adults, Fraser Health's mental-health centre and the low-cost counselling page are the places to start." },
      { q: "Who do I call if it cannot wait?", a: "Call or text 9-8-8 if you are thinking about suicide or worried about someone. The Fraser Health Crisis Line, 604-951-8855 or 1-877-820-7444, answers at any hour, and 310-6789 (no area code) reaches mental-health support anywhere in BC. In an emergency call 9-1-1 or go to the emergency department at Ridge Meadows Hospital. Counselling is not a crisis service." },
      { q: "Can I have EMDR from Maple Ridge?", a: "Yes. EMDR by secure video keeps the same phases as anywhere else: history and preparation first, then processing, then a closing step that settles you before the session ends. Your eyes follow a point moving across the screen, or you tap for yourself if that suits you better, and whichever is used is rehearsed long before it touches anything difficult. Afterwards there is no bridge to cross on the way home." },
    ],
    sources: [
      { label: "Fraser Health, Mental Health Centres directory (Maple Ridge Mental Health and Substance Use Centre)", url: "https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres" },
      { label: "Statistics Canada, 2021 Census Profile: Maple Ridge (CSD 5915075)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915075&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Statistics Canada, 2021 Census Profile: Pitt Meadows (CSD 5915070)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915070&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Foundry Ridge Meadows", url: "https://foundrybc.ca/ridgemeadows/" },
      { label: "Fraser Health, Ridge Meadows Hospital", url: "https://www.fraserhealth.ca/Service-Directory/Locations/Maple-Ridge---Pitt-Meadows/ridge-meadows-hospital" },
      { label: "Fraser Health, Psychiatry Unit, Ridge Meadows Hospital", url: "https://www.fraserhealth.ca/Service-Directory/Service-at-Location/4/6/psychiatry-unit---ridge-meadows-hospital" },
      { label: "Crisis Centre of BC, 310 Mental Health Support (310-6789) and 9-8-8", url: "https://crisiscentre.bc.ca/" },
      { label: "Fraser Health Crisis Line (Options Community Services)", url: "https://www.options.bc.ca/program/fraser-health-crisis-line" },
      { label: "Province of British Columbia, correctional centres", url: "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/corrections/correctional-centres" },
      { label: "TransLink, West Coast Express schedules", url: "https://www.translink.ca/schedules-and-maps/west-coast-express" },
      { label: "TransLink, The Buzzer: reflecting on the Golden Ears Bridge", url: "https://buzzer.translink.ca/2011/11/reflecting-on-the-golden-ears-bridge/" },
    ],
    nearby: ["langley", "coquitlam"],
    audiences: ["healthcare-and-shift-workers", "first-responders"],
  },

  /* ── Vernon, 2 Oct 2026 ──────────────────────────────────────────────────
   *
   * Retired in the Phase 1 audit and 308'd to Kelowna until today; removed
   * from lib/redirects.mjs (list and RETIRED_TOWN_HOMES) in the same change,
   * and Kelowna stops naming it. The argument no neighbour's page makes:
   *
   *   Vernon        not the far end of Kelowna's line, as Penticton is, but
   *                 the North Okanagan's own centre, with a small-town
   *                 catchment north on 97A (Armstrong, Spallumcheen,
   *                 Enderby) and east on Highway 6 (Lumby, Cherryville).
   *                 Two things follow: privacy where the local counsellor
   *                 may be a neighbour, and a specialist line that runs
   *                 south to Kelowna. The 2021 White Rock Lake fire burned
   *                 homes on the Okanagan Indian Band reserve and the
   *                 northwest shore of Okanagan Lake (The Tyee, 14 Dec 2021).
   *
   * Census figures (Punjabi 505, Tagalog 305 by mother tongue, of 43,730)
   * were read 2 Oct 2026 through StatCan's data service, when the www12
   * Census Profile pages returned 404 from here; cited at the Census
   * Profile, as every other city is. Language, EMDR and couples claims stay
   * out of intro, access and faqs[0..4], which the place pages copy; the
   * EMDR question sits at faqs[5]. No wait times, no hours. */
  {
    slug: "vernon",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Vernon",
    communities: ["Coldstream", "Armstrong", "Spallumcheen", "Enderby", "Lumby", "Cherryville"],
    region: "Okanagan",
    blurb: "The North Okanagan’s centre, with a catchment of small towns where the counsellor nearby may be a neighbour.",
    metaDescription:
      "Online counselling for Vernon and the North Okanagan. Coldstream, Armstrong, Enderby and Lumby: trauma, anxiety, EMDR and couples therapy by video.",
    intro: [
      "Vernon is where the North Okanagan comes for services. Interior Health runs a mental-health and substance-use centre on 14th Avenue that takes self-referrals, CMHA Vernon runs a free youth drop-in, and Okanagan College has its Vernon campus on College Way in Coldstream. What makes counselling here its own problem is the catchment, which runs north along 97A to Armstrong and Enderby and east through Lumby to Cherryville.",
      "Two things follow from that. In the smaller towns the counsellor nearby may be somebody you already know, and when what you need is something specific, the search tends to widen down Highway 97 to Kelowna. Seeing a [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) by video answers both at once: nobody in Enderby sees where you go, and the drive south drops out of the plan.",
    ],
    localReality: {
      h2: "A regional centre with a small-town catchment",
      body: [
        "**Interior Health is the public door, and it takes self-referrals.** The Vernon Mental Health and Substance Use Centre on 14th Avenue offers counselling and treatment, substance-use services and crisis response, and anyone can start by calling 310-MHSU (6478) rather than waiting for a doctor’s referral. If you are connected to it already, stay connected. Private counselling runs alongside public care, not instead of it.",
        "**The specialist line runs south.** When the North Okanagan’s own list for a particular approach is short or full, the next suggestion is usually Kelowna, which the [Kelowna page](/online-counselling/kelowna) covers from the other end. From Vernon that is a drive down Highway 97 past Kalamalka and Wood Lakes. From Enderby or Cherryville it is longer again, and it comes round every week.",
        "**EMDR is a common example.** It is a separate training on top of counselling, so the question is not whether Vernon has counsellors but whether one trained in EMDR has an opening. [EMDR therapy](/services/emdr-therapy) is offered by secure video, and [EMDR for Vernon](/online-counselling/vernon/emdr-therapy) explains why its preparation stage is where distance hurts most.",
        "**Small towns make privacy a practical question.** In Lumby, Armstrong or Enderby, the counsellor in town may also coach your child’s team or stand behind you at the post office. Some people are comfortable with that. Plenty are not, and quietly go without. A practice based elsewhere in the province has no waiting room and no parking lot where anyone would recognise your vehicle.",
        "**The 2021 fire is still recent.** The White Rock Lake fire destroyed homes on the Okanagan Indian Band reserve, and at Killiney Beach and Estamont on the northwest shore of Okanagan Lake. People who were evacuated, or who spent that summer watching the smoke across the lake, often file it under “everyone went through it”. That phrase can keep a real response unspoken for years, and [trauma counselling for Vernon](/online-counselling/vernon/trauma-therapy) is written for exactly that.",
        "**Young people have a free route of their own.** CMHA Vernon’s Youth Integrated Services Hub offers free, confidential drop-in counselling for ages 12 to 24 while Foundry North Okanagan is in development. For a student at Okanagan College’s Vernon campus or a teenager in Coldstream, that is worth trying first, and [counselling for teens and young adults](/for/teens-and-young-adults) covers what private sessions add.",
        "**Two language communities, both small.** In the 2021 Census 505 Vernon residents gave Punjabi as their mother tongue and 305 gave Tagalog, about 1.2% and 0.7% of the city. Communities that size rarely have a local counsellor working in their language, and they are small enough that people know one another. [Punjabi-speaking counselling for Vernon](/punjabi-counselling/vernon) and [Tagalog-speaking counselling for Vernon](/tagalog-counselling/vernon) say plainly what that means.",
      ],
    },
    access: [
      { label: "No Highway 97 for a specialist", detail: "A particular approach no longer depends on who between Enderby and Kelowna has an opening. Any counsellor trained in it who practises in BC is within reach." },
      { label: "Armstrong to Cherryville, on the same terms", detail: "Coldstream, Armstrong, Spallumcheen, Enderby, Lumby and Cherryville get the same session as downtown Vernon, with no penalty for distance." },
      { label: "No small-town waiting room", detail: "No reception desk, no parking lot and no neighbour in the next chair. The session happens behind your own door." },
      { label: "Winter roads stop mattering", detail: "Highway 6 from Lumby or 97A from Enderby in snow is no longer part of the appointment." },
    ],
    faqs: [
      { q: "How do I get public mental-health care in Vernon?", a: "Through Interior Health, with no doctor’s referral needed. Call 310-MHSU (6478) or go to the Vernon Mental Health and Substance Use Centre on 14th Avenue; an intake clinician asks some screening questions, with your permission, and connects you with the right team. Starting privately as well does not mean leaving a public list." },
      { q: "Should I widen my search to Kelowna?", a: "You can, and if a Kelowna practice has what you need at a time you can reach it, that is a fair choice. Count the whole trip, though: from Armstrong or Lumby a weekly appointment in Kelowna takes much of the day, and travel is one of the ordinary reasons a course of counselling stops early. A video session from home costs the session and nothing around it." },
      { q: "Does anyone in town need to know I am seeing a counsellor?", a: "No. There is no office, no waiting room and no vehicle parked outside anywhere, so in Armstrong, Lumby or Enderby there is nothing for anyone to notice. What you tell people is your decision." },
      { q: "What free help is there in the North Okanagan?", a: "Interior Health’s Vernon centre is the public route and is free. For ages 12 to 24, CMHA Vernon’s Youth Integrated Services Hub offers free drop-in counselling. 8-1-1 connects to HealthLink BC at any hour, and the Interior Crisis Line Network answers at 1-888-353-2273. If one of those fits, use it." },
      { q: "We were evacuated in 2021. Is it too late to talk about it?", a: "No. What matters is whether it still shows up now, in the smell of smoke, a phone alert, or a summer you cannot relax into, not how long ago it happened. Evacuation counts even where the house survived." },
      { q: "Is EMDR offered to people in Vernon?", a: "Yes, by secure video with a counsellor trained in it; the EMDR page for Vernon shows who that is. Preparation comes first and is not rushed, and the eye-movement or tapping part is rehearsed before any memory is worked on, so the first sessions are about getting ready rather than diving in." },
    ],
    sources: [
      { label: "Interior Health, Vernon Mental Health and Substance Use Centre", url: "https://www.interiorhealth.ca/locations/vernon-mental-health-substance-use" },
      { label: "Interior Health, access mental health and substance use services (310-MHSU self-referral, Interior Crisis Line Network)", url: "https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services" },
      { label: "CMHA Vernon and District, youth services", url: "https://cmhavernon.ca/youth-services/" },
      { label: "Okanagan College, Vernon campus housing (College Way, Coldstream)", url: "https://www.okanagancollege.ca/housing/campus-housing-in-vernon" },
      { label: "The Tyee, the White Rock Lake fire, 14 December 2021", url: "https://thetyee.ca/News/2021/12/14/Everything-Is-Burning-Your-House-Is-Gone/" },
      { label: "Statistics Canada, 2021 Census Profile: Vernon (CSD 5937014)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055937014&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
    ],
    nearby: ["kelowna", "kamloops", "penticton"],
    audiences: ["teens-and-young-adults"],
  },

  /* ── Mission, 2 Oct 2026 ─────────────────────────────────────────────────
   *
   * Retired in the Phase 1 audit and 308'd to Abbotsford until today; removed
   * from lib/redirects.mjs (list and RETIRED_TOWN_HOMES) in the same change,
   * and Abbotsford stops naming it. The argument no neighbour's page makes:
   *
   *   Mission       counted with the Fraser Valley, working outside it. Its
   *                 services and its nearest larger centre are across the
   *                 bridge in Abbotsford, but in the 2021 Census about 36%
   *                 of residents with a usual place of work worked in
   *                 Mission and about 39% worked outside the Fraser Valley
   *                 regional district altogether (Abbotsford: 64% in the
   *                 city). Nearly one Mission commuter in five travelled an
   *                 hour or more each way (Abbotsford: about one in twelve).
   *                 So home, the Valley's services and the working day are
   *                 three places, not two; Maple Ridge's page argues the
   *                 choice between home and work, this one the third corner.
   *
   * Census Profile, Mission CSD 5909056: usual place of work 13,015, of
   * whom 4,695 in Mission, 3,250 elsewhere in the census division, 5,050 in
   * a different census division; commuting 60 minutes and over 3,200 of
   * 17,320. Mother tongue Punjabi 2,925 and Tagalog 210 of 41,030.
   * Abbotsford CSD 5909052: 31,680 of 49,390 in the city; 5,375 of 64,190
   * an hour or more. Read 2 Oct 2026 through StatCan's data service, when
   * the www12 Census Profile pages returned 404 from here; cited at the
   * Census Profile, as every other city is. Language, EMDR and couples
   * claims stay out of intro, access and faqs[0..4], which the place pages
   * copy; the EMDR and couples question sits at faqs[5]. No wait times, no
   * hours. */
  {
    slug: "mission",
    figure2: "first-session-flow",
    figure: "bc-reach",
    city: "Mission",
    communities: ["Silverdale", "Cedar Valley", "Hatzic", "Hatzic Prairie", "Dewdney", "Deroche"],
    region: "Fraser Valley",
    blurb: "Counted with the Fraser Valley, though nearly four in ten of its workers spend the working day outside it.",
    metaDescription:
      "Online counselling for Mission, BC, on the north bank of the Fraser. Silverdale, Hatzic, Dewdney and Deroche: anxiety, trauma and depression by video.",
    intro: [
      "Mission sits on the north bank of the Fraser, across the bridge from Abbotsford, and is usually filed as part of Abbotsford’s catchment. Its working life points somewhere else. In the 2021 Census, of residents with a usual place of work, about 36% worked in Mission and about 39% worked outside the Fraser Valley regional district altogether. In Abbotsford, nearly two-thirds work in the city itself.",
      "So somebody in Mission looking for a counsellor is choosing among three places rather than one: home on the north bank, the Valley’s services across the bridge, and a workplace further west. Each is a detour from the other two. A [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) seen by video sits in none of them, which leaves only the question of a private room.",
    ],
    localReality: {
      h2: "Counted with the Valley, working outside it",
      body: [
        "**Mission’s working day mostly happens elsewhere.** Of the roughly 13,000 residents the 2021 Census counted with a usual place of work, about 4,700 worked in Mission. Around 3,250 worked elsewhere in the Fraser Valley regional district, and about 5,050 left it entirely. Nearly one commuter in five spent an hour or more getting to work, one way; in Abbotsford it was about one in twelve. The West Coast Express begins its run to downtown Vancouver at Mission City station.",
        "**Three directions, and an appointment in only one of them.** A counsellor in town is a drive back from wherever work is. One across the bridge in Abbotsford sits on nobody’s route west. One near a workplace in Metro Vancouver means staying on after work and driving the Lougheed home later still. Video takes all three detours out: the booking calendar shows each counsellor's real open times, and the session happens wherever you are when one of them suits.",
        "**The public door is on Hurd Street.** Fraser Health is the authority for Mission, and its Mission Mental Health and Substance Use Centre takes adults 19 and over and accepts referrals from patients themselves. Fraser Health’s access line, 1-833-866-6478, helps work out which service fits. Fraser House Society offers substance use counselling in Mission, with a rural program run from Deroche. Private sessions run alongside any of those rather than replacing them, and [free and low-cost options across BC](/resources/low-cost-counselling-bc) are listed too.",
        "**East along the Lougheed is further again.** Hatzic Prairie, Dewdney and Deroche are rural communities strung out east of town, and from there even Mission’s own services are a drive before any bridge is reached. [Abbotsford’s page](/online-counselling/abbotsford) covers the Valley south of the river. From the east end of this side, a session at home is the only kind that does not begin in the car.",
        "**A federal institution keeps its own clock.** Mission Institution, a Correctional Service Canada site with medium- and minimum-security units, is in the district, and the people who staff it work rosters that rarely line up with a weekly appointment. What that work tends to leave behind is set out on the page for [first responders and corrections staff](/for/first-responders).",
        "**Punjabi is Mission’s largest mother tongue after English.** In the 2021 Census 2,925 residents, about 7.1%, gave it as their mother tongue, far ahead of any other language, and 210 gave Tagalog. [Punjabi-speaking counselling for Mission](/punjabi-counselling/mission) explains why the answer is not simply Abbotsford, and [Tagalog-speaking counselling for Mission](/tagalog-counselling/mission) says plainly what a community that small means.",
      ],
    },
    access: [
      { label: "Wherever the day puts you", detail: "At home north of the river, a room with a door near work, or a parked car before the drive back. A session needs privacy and a connection, not an address in any particular town." },
      { label: "No extra crossing", detail: "For the nearly one commuter in five already spending an hour or more each way, a counselling trip over the bridge or along the Lougheed is the first thing to be dropped." },
      { label: "Silverdale to Deroche, on the same terms", detail: "Silverdale, Cedar Valley, Hatzic, Hatzic Prairie, Dewdney and Deroche, with no penalty for living further east." },
      { label: "Bookable around a rotation", detail: "Rosters at the institution or on the road change from week to week. Sessions are booked from what the calendar actually has open rather than one standing slot." },
    ],
    faqs: [
      { q: "I work in Metro Vancouver. Where would my sessions happen?", a: "Wherever you have privacy on the day: at home in Mission, a closed room at work, or a parked car before the drive home. Some people keep sessions for days when they are not commuting at all. Which suits your week is worth settling on the consultation call, before the first session rather than during it." },
      { q: "Which health authority covers Mission?", a: "Fraser Health. Its Mission Mental Health and Substance Use Centre on Hurd Street serves adults 19 and over and accepts self-referrals, and the Fraser Health access line, 1-833-866-6478, helps you find the right service. Seeing a Registered Clinical Counsellor privately needs no referral and runs alongside the public route rather than replacing it." },
      { q: "Do you cover Hatzic, Dewdney and Deroche?", a: "Yes, and on identical terms. The practice is online and covers all of British Columbia, so Silverdale, Cedar Valley, Hatzic Prairie and the communities east along the Lougheed get the same session as anywhere else, with no drive at either end." },
      { q: "I work rotating shifts. Can counselling keep up?", a: "Yes, by booking from what the calendar shows each week rather than holding one fixed slot. Rosters at Mission Institution, in healthcare or in transport rarely repeat, and a plan that expects that from the start holds up better than one built on the same day every week." },
      { q: "Is there something free I should look at first?", a: "Yes. Fraser Health’s Mission centre is the public route, Fraser House Society offers substance use counselling in Mission and from Deroche, 8-1-1 connects to HealthLink BC at any hour, and the low-cost counselling page lists free and reduced-fee options across the province. If one of those fits, use it." },
      { q: "Can I have EMDR or couples sessions from Mission?", a: "Yes, by secure video, with the counsellor on the roster who offers them; the profiles say which. EMDR still begins with a preparation phase and is paced with you, and for couples, partners can join from home or from two places when one of them is still at work. Being north of the river changes nothing about either." },
    ],
    sources: [
      { label: "Fraser Health, Mission Mental Health and Substance Use Centre", url: "https://www.fraserhealth.ca/Service-Directory/Locations/Mission/mission-mental-health-centre" },
      { label: "Fraser Health, Mental Health Centres directory (access line 1-833-866-6478)", url: "https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres" },
      { label: "Statistics Canada, 2021 Census Profile: Mission (CSD 5909056)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055909056&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Statistics Canada, 2021 Census Profile: Abbotsford (CSD 5909052)", url: "https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055909052&GENDERlist=1&STATISTIClist=1&HEADERlist=0" },
      { label: "Fraser House Society, substance use counselling in Mission", url: "https://fraserhouse.org/" },
      { label: "TransLink, West Coast Express", url: "https://www.translink.ca/schedules-and-maps/west-coast-express" },
      { label: "Correctional Service Canada, Mission Institution", url: "https://www.canada.ca/en/correctional-service/corporate/facilities-security/institutional-profiles/pacific/mission-institution.html" },
    ],
    nearby: ["abbotsford", "chilliwack", "maple-ridge"],
    audiences: ["first-responders", "healthcare-and-shift-workers"],
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);

// The remaining retired city slugs and their 308s live in lib/redirects.mjs.
// Burnaby, Langley and Chilliwack were removed from that list on 2026-08-28
// when the records above were written — see the note beside them.
