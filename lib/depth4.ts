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
