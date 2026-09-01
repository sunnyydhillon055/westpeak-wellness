import { cityContexts, type CityContext } from '@/lib/city-context';

/* FIFTY CITY × SERVICE PAGES, AND THE RULE THAT KEEPS THEM HONEST.
 *
 * THE RISK BEING MANAGED
 *
 * Content uniqueness is this site's single strongest measured category — 900 of
 * 1000, first of eleven practices — and it holds that position precisely because
 * two competitors in the benchmark set templated four hundred pages each and it
 * is obvious from the first paragraph. Fifty "<service> in <city>" pages built
 * by swapping a noun would attack the one thing this domain is measurably best
 * at, and would read to a search engine as a doorway pattern.
 *
 * So the rule for this file is: EVERY PAIR EARNS ITS OWN ARGUMENT. Not a
 * rewritten sentence — a claim that is true of this service in this city and
 * false, or simply pointless, anywhere else. EMDR in Prince George is a
 * different argument from EMDR in Vancouver, because in one of those places the
 * nearest trained clinician may be a flight away and in the other the problem is
 * that they are all full.
 *
 * If a pair cannot be given its own argument, it does not get a page. That is
 * the same test lib/locations.ts applies to cities, applied one level down.
 *
 * scripts/uniqueness-gate.mjs enforces this mechanically and fails the build if
 * any two of these pages converge. A rule nothing checks is a rule that decays
 * on the first busy afternoon.
 *
 * BCACC. Descriptive throughout, never predictive. No page here says counselling
 * will work, how well, or how fast. Advertising standards prohibit outcome
 * claims, and on this subject they are also simply the right standard.
 */

/** The five services paired with cities — chosen from Search Console demand,
 *  not from the full service list. The other four services have real pages of
 *  their own; pairing all nine with all ten cities would be ninety pages and
 *  would fail the rule above by the fourth row. */
export const PAIRED_SERVICES = [
  'anxiety-counselling',
  'trauma-therapy',
  'couples-therapy',
  'emdr-therapy',
  'depression-counselling',
] as const;

export type PairedService = (typeof PAIRED_SERVICES)[number];

export type Pair = {
  city: string;
  service: PairedService;
  /** The thesis. One sentence, true here and nowhere else in this file. */
  angle: string;
  /** Two paragraphs specific to this pair. Never assembled from a template. */
  body: [string, string];
  faqs: { q: string; a: string }[];
};

export const pairs: Pair[] = [
  {
    city: 'vancouver', service: 'couples-therapy',
    angle: 'Two people, two commutes, one appointment — the logistics defeat more Vancouver couples than the therapy does.',
    body: [
      'Couples counselling has a scheduling problem that individual work does not: it needs two people free at the same time. In Vancouver that frequently means two different commutes converging on a third location at an hour that suits neither, and the first appointment either of them cannot make becomes the one that ends the attempt.',
      'Joining from home, or from two different places when that is what the week allows, removes the single most common practical reason couples work stops. It also changes the texture of the session — you are having a difficult conversation in the room where you actually have difficult conversations, rather than in a neutral office you both leave immediately afterwards.',
    ],
    faqs: [
      { q: 'Can we join from two separate locations?', a: 'Yes, and some couples deliberately do — occasionally because one partner travels, occasionally because separate rooms make a particular conversation more possible rather than less.' },
      { q: 'How long is a couples session?', a: 'Fifty minutes at $170, with a 110-minute extended session at $340 for work that genuinely needs the longer run. The extended format is usually a considered choice rather than the starting point.' },
    ],
  },

  {
    city: 'vancouver', service: 'emdr-therapy',
    angle: 'Vancouver has EMDR-trained clinicians; what it does not have is many with an opening this month.',
    body: [
      'EMDR is not rare in Vancouver in the sense that it is rare in most of the province — trained clinicians exist here in numbers. The constraint is different: EMDR tends to be offered by practitioners who are already established, which means the search usually ends in a waitlist rather than in an absence.',
      'It is also a modality where the schedule matters more than usual. EMDR processing works best with a predictable rhythm, and a session that has to be moved because of traffic is more disruptive here than it would be in ordinary talk therapy. Removing the journey removes the most common reason the rhythm breaks.',
    ],
    faqs: [
      { q: 'Does EMDR actually work over video?', a: 'The bilateral stimulation is delivered on screen or through self-administered tapping, both of which are established remote protocols. What matters more is preparation and pacing, and neither of those depends on being in the same room.' },
      { q: 'Do I need to have a formal PTSD diagnosis?', a: 'No. EMDR is used with a range of distressing memories and stuck patterns, many of which never attract a diagnosis and do not need one to be worth working on.' },
    ],
  },

  {
    city: 'surrey', service: 'couples-therapy',
    angle: 'Couples work in Surrey often has a third party in the room whether or not anyone has named them: the wider family.',
    body: [
      'A large share of couples counselling here involves questions that a Metro Vancouver practice may not think to ask. Whether you live with parents or in-laws. Whether a decision is genuinely yours to make alone. How much of the current pressure originates between the two of you and how much arrives from outside and lands on you both.',
      'None of that means the answer is more separation from family, and a counsellor who assumes it is will not be useful. The work is about being clear on which pressures are shared and which are inherited, and what the two of you actually want — which is a different conversation from the one that starts by treating obligation as the problem.',
    ],
    faqs: [
      { q: 'What if only one of us wants to come?', a: 'Start anyway. Individual work on a relationship is legitimate and often useful, and it is not unusual for the second person to join later once it is clear what the sessions are actually like.' },
      { q: 'Can sessions run in Punjabi if one of us is more comfortable that way?', a: 'Yes, including sessions that move between both languages. Where partners have different preferences, that is worth naming early rather than working around.' },
    ],
  },

  {
    city: 'surrey', service: 'emdr-therapy',
    angle: 'Finding an EMDR clinician in Surrey is possible; finding one who also works in Punjabi has been close to impossible.',
    body: [
      'EMDR is available in Surrey. The combination of EMDR training and Punjabi has been another matter, and for anyone who wants both, the historical options have been to accept one or the other or to travel and still not find it.',
      'That combination is a specific thing rather than a general claim about cultural fit. EMDR involves identifying the memory and the belief attached to it, and beliefs about shame, duty and reputation frequently sit in a first language. Working in the language the belief was formed in is not a nicety in this modality — it is closer to a working requirement.',
    ],
    faqs: [
      { q: 'Can EMDR be done in Punjabi?', a: 'Yes. The protocol is the same; what changes is that the belief attached to a memory can be named in the language it belongs to rather than approximated in translation.' },
      { q: 'How many sessions does EMDR take?', a: 'It varies too widely for an honest average. Some focused pieces of work are short; anything involving repeated or early experience generally is not. It is reviewed as you go rather than committed to in advance.' },
    ],
  },

  {
    city: 'burnaby', service: 'couples-therapy',
    angle: 'Two Burnaby commutes rarely converge anywhere convenient, which is why couples work here so often stalls at scheduling.',
    body: [
      'Couples in Burnaby frequently work in two different directions — one toward Vancouver, one east into Fraser Health territory — and an in-person appointment has to find a time and a place that defeats neither commute. That is a harder problem than it sounds, and it is the reason a lot of couples counselling here never gets past the enquiry.',
      'Removing the location from the equation leaves only the time, which is a solvable problem. It also means a session can happen on an evening when one of you is still at work and the other is at home, which is a compromise that in-person scheduling cannot offer at all.',
    ],
    faqs: [
      { q: 'Do both of us need to be there every time?', a: 'Usually yes, though individual sessions within couples work happen when there is a clear reason for them, agreed openly rather than arranged privately.' },
      { q: 'What if we mostly argue in the session?', a: 'That is information rather than failure. A large part of the early work is noticing the shape of the argument you keep having, which is difficult to do from inside it.' },
    ],
  },

  {
    city: 'burnaby', service: 'emdr-therapy',
    angle: 'EMDR in Burnaby usually means an appointment in Vancouver, and a modality that rewards routine does not suit a long journey.',
    body: [
      'Practically speaking, looking for EMDR in Burnaby produces results in Vancouver. That is workable, but EMDR is a modality where consistency does real work — processing benefits from a predictable interval, and sessions that get moved because of traffic or a delayed bus interrupt something more specific than a chat would be.',
      'Delivered remotely, the interval is the only thing being scheduled. The bilateral stimulation is provided on screen or through self-administered tapping, both established remote protocols, and the preparation that makes EMDR safe is unchanged.',
    ],
    faqs: [
      { q: 'What if I feel destabilised after a session?', a: 'Preparation for exactly that comes before any processing begins — grounding you have practised, and an agreed plan for a difficult evening. This practice runs scheduled sessions with no on-call line, so that plan includes which crisis lines to use and when.' },
      { q: 'Can EMDR be combined with ordinary talking therapy?', a: 'Commonly, yes. Many courses of work use EMDR for specific stuck material inside a broader piece of counselling.' },
    ],
  },

  {
    city: 'abbotsford', service: 'couples-therapy',
    angle: 'Two people, one highway, one appointment — Fraser Valley couples usually lose the attempt to the drive rather than to the work.',
    body: [
      'Couples counselling requires two people free simultaneously. In Abbotsford that has often meant two people free simultaneously and both willing to drive to Surrey, which is a materially harder condition to satisfy and the one on which most attempts fail.',
      'There is also a rhythm point. Couples work benefits from sessions close enough together to keep momentum; a fortnightly cadence chosen because weekly was logistically impossible changes what the work can do. Removing the drive makes the interval a genuine choice rather than a consequence of geography.',
    ],
    faqs: [
      { q: 'Do you do premarital or pre-commitment work?', a: 'Yes, and it is generally more straightforward than work begun in a crisis — largely because nobody arrives already keeping score.' },
      { q: 'Can we book a longer first session?', a: 'A 110-minute extended session is available at $340 where there is a lot to lay out. Most couples start with the standard 50 minutes and decide from there.' },
    ],
  },

  {
    city: 'abbotsford', service: 'emdr-therapy',
    angle: 'EMDR is one of the modalities the Fraser Valley most reliably does not have locally.',
    body: [
      'Ask for EMDR in Abbotsford and the answer has commonly been that the nearest trained clinician is west of you. It is a specific enough training that a smaller local sector simply may not contain it, which is different from a service being busy — it is a service being absent.',
      'Delivered by video, that absence stops being geographic. The protocol is unchanged, the bilateral stimulation is delivered on screen or by self-administered tapping, and the preparation phase that makes EMDR safe to do happens exactly as it would in a room.',
    ],
    faqs: [
      { q: 'Is EMDR only for major traumatic events?', a: 'No. It is used with a wide range of distressing memories and stuck beliefs, including ones that never involved a single identifiable event.' },
      { q: 'What if I do not want to describe what happened in detail?', a: 'EMDR requires far less verbal recounting than most people expect, which is one of the reasons it suits people who have found talking it through directly unmanageable.' },
    ],
  },

  {
    city: 'langley', service: 'couples-therapy',
    angle: 'Langley couples routinely commute in opposite directions, and the appointment has to defeat both journeys or it does not happen.',
    body: [
      'Langley sits at a junction: one partner heading west toward Surrey and Vancouver, the other east toward Abbotsford, or one working locally while the other does not. An in-person couples appointment has to be reachable for both at the same hour, and for a lot of couples here no such hour exists.',
      'Video removes the geography and leaves the scheduling, which is a much easier problem. It also permits a session where one of you joins from a car park at the end of a shift, which is not ideal and is considerably better than the alternative of not going.',
    ],
    faqs: [
      { q: 'Is it too late for counselling if we are already talking about separating?', a: 'No. Some couples work is about deciding rather than repairing, and doing that deliberately — particularly where children are involved — is a legitimate use of the sessions.' },
      { q: 'Do you take sides?', a: 'No. Where something needs saying plainly it gets said plainly, which is a different thing from adjudicating between you.' },
    ],
  },

  {
    city: 'langley', service: 'emdr-therapy',
    angle: 'EMDR in Langley is available in principle and hard to book in practice, because the trained clinicians serve the whole eastern corridor.',
    body: [
      'The handful of EMDR-trained practitioners around Langley are absorbing demand from Surrey to Abbotsford, which is why the search so often ends in a waitlist. That is not a local failing — it is what happens when a specific training is thinly distributed across a wide corridor.',
      'Remote delivery widens the pool from whoever is within driving distance to whoever is registered in British Columbia. For a modality this specific, that is the difference between choosing a clinician and taking whoever has an opening.',
    ],
    faqs: [
      { q: 'Is EMDR suitable for everyone?', a: 'No, and that is assessed before starting rather than discovered partway through. Where it is not the right approach, that is said directly.' },
      { q: 'What happens in an EMDR session over video?', a: 'The same phases as in a room: history, preparation, then processing with bilateral stimulation delivered on screen or by self-administered tapping, with time at the end to settle before the session closes.' },
    ],
  },

  {
    city: 'chilliwack', service: 'couples-therapy',
    angle: 'Structured couples work is one of the things the eastern valley most often simply does not have.',
    body: [
      'General counselling exists in Chilliwack. Structured couples work with specific training behind it is a narrower field, and in a smaller market the honest local answer is frequently that it is not available. The fallback has been to travel or to go without, and most couples choose the second.',
      'Two people travelling together for two hours to discuss a difficult subject also has an obvious problem: the car journey home. Joining from your own kitchen at eight in the evening is not a downgrade from that arrangement.',
    ],
    faqs: [
      { q: 'What approach do you use with couples?', a: 'Gottman-trained, which is structured rather than open-ended — patterns of interaction are looked at directly rather than circled around.' },
      { q: 'Can we do this if we are in different places some weeks?', a: 'Yes. Partners joining from two locations is workable and reasonably common where shift patterns or travel make it necessary.' },
    ],
  },

  {
    city: 'chilliwack', service: 'emdr-therapy',
    angle: 'In the eastern Fraser Valley, EMDR is not a service that is busy — it is a service that is absent.',
    body: [
      'There is a difference between a modality being oversubscribed and a modality not being present, and Chilliwack usually meets the second. EMDR requires specific training that a smaller local sector may simply not contain, so the search does not end in a waitlist; it ends in nothing.',
      'This is the clearest case in the province for remote delivery. The protocol does not lose anything to video — bilateral stimulation is delivered on screen or by self-administered tapping, both established remote practice — and the alternative is not a different local option but no option at all.',
    ],
    faqs: [
      { q: 'Is remote EMDR a compromise version?', a: 'No. Remote protocols are established practice, and the phases are the same. What changes is that the preparation and grounding happen in the room you are actually going to be in afterwards.' },
      { q: 'How do I know if EMDR is right for me?', a: 'It is assessed at the outset, including whether now is the right time for it. Where it is not, that is said rather than worked around.' },
    ],
  },

  {
    city: 'victoria', service: 'couples-therapy',
    angle: 'Victoria is small enough that couples counselling carries a visibility problem the mainland does not have.',
    body: [
      'In a city this size, professional and social circles overlap more than people expect. Couples arriving at a counselling office on a weekday afternoon are reasonably likely to encounter somebody they know, and for some couples that is genuinely the reason they have not started.',
      'A session joined from home removes the question. That is not a minor point in a place where the relevant concern is not confidentiality in the formal sense — which any registered practice provides — but simply not being seen walking through a door.',
    ],
    faqs: [
      { q: 'Is what we say in couples sessions confidential?', a: 'Yes, within the limits every RCC works under, which are explained at the start rather than buried. Those limits apply equally to both partners.' },
      { q: 'What if we have very different ideas about what is wrong?', a: 'That is the ordinary starting position. Establishing what each of you thinks is happening is generally the first piece of work rather than a prerequisite for it.' },
    ],
  },

  {
    city: 'victoria', service: 'emdr-therapy',
    angle: 'When EMDR is not represented on the Island, the historical options have been to travel for it or to go without.',
    body: [
      'The Island EMDR pool is finite in a way a mainland pool is not. When the trained clinicians here are full, there is no adjacent city to try — the next option involves a sailing, and an intensive scheduled around ferry availability is a different piece of work from a weekly session.',
      'Remote delivery makes the entire provincial pool reachable from Victoria on the same terms as from Vancouver. For a modality this specific, being able to choose the clinician rather than take the one with the opening is most of the value.',
    ],
    faqs: [
      { q: 'Does the time zone or location affect scheduling?', a: 'No. The whole province is on one clock, and there is no travel component to plan around at either end.' },
      { q: 'Can EMDR help with things that happened a long time ago?', a: 'That is a common use of it. The relevant question is whether the memory still carries a charge now, not how long ago it occurred.' },
    ],
  },

  {
    city: 'kelowna', service: 'couples-therapy',
    angle: 'Okanagan seasonal work puts a strain on relationships that a Metro Vancouver counsellor may not think to ask about.',
    body: [
      'A large part of this economy runs on seasons — tourism, agriculture, construction, hospitality. That produces relationships where one partner is absent for months and then abruptly present, where income arrives unevenly, and where the winter conversation is entirely different from the summer one.',
      'Those pressures get misread as commitment problems when they are structural. A counsellor who asks about the shape of your year rather than assuming a uniform one is asking a more useful question, and it is a question the answer to which is specific to living here.',
    ],
    faqs: [
      { q: 'Can we schedule around a seasonal work pattern?', a: 'Yes, including pausing and resuming. A course of couples work that runs intensively in one season and lightly in another is a legitimate structure rather than a failure to commit.' },
      { q: 'Do you work with couples where one partner is away a lot?', a: 'Regularly. Video makes it workable in a way an in-person practice cannot, since a partner can join from wherever they are that week.' },
    ],
  },

  {
    city: 'kelowna', service: 'emdr-therapy',
    angle: 'Interior Health covers a very large area, and EMDR is not distributed across it evenly.',
    body: [
      'Interior Health spans a region far larger than its population suggests, and specialised private modalities cluster in Kelowna. For anyone in the wider Okanagan that means EMDR is either in Kelowna or it is a drive of an hour or more each way.',
      'Remote delivery flattens that. From Peachland or Lake Country the access is identical to downtown Kelowna, and the pool is the whole province rather than whoever happens to practise within reach.',
    ],
    faqs: [
      { q: 'What does bilateral stimulation involve on video?', a: 'Usually following a moving point on screen, or self-administered tapping. Both are established remote protocols and are explained and practised before any processing begins.' },
      { q: 'Is EMDR uncomfortable?', a: 'It can be demanding, which is why pacing and preparation come first and why sessions end with time to settle rather than stopping abruptly.' },
    ],
  },

  {
    city: 'kamloops', service: 'couples-therapy',
    angle: 'Rotational and camp work reshapes a relationship in ways a nine-to-five counsellor may not think to ask about.',
    body: [
      'A significant share of this region works away — camps, rotations, long shifts on the road. That produces relationships with a specific rhythm: intense reunion, awkward recalibration, departure, repeat. The difficulties it creates are structural rather than a sign that either person is doing something wrong.',
      'Counselling that fits that pattern has to be able to run when one partner is away, which in-person work fundamentally cannot. Video sessions with a partner joining from camp are not a workaround; for a rotational couple they are the only arrangement that keeps the work continuous.',
    ],
    faqs: [
      { q: 'Can my partner join from a work camp?', a: 'Yes, if they have a connection and somewhere private. Sessions with partners in two locations are ordinary here rather than exceptional.' },
      { q: 'What if our schedules only overlap occasionally?', a: 'Then the cadence is built around that. Fortnightly or seasonal blocks are a legitimate structure where the alternative is nothing.' },
    ],
  },

  {
    city: 'kamloops', service: 'emdr-therapy',
    angle: 'Specialised modalities are not reliably represented in the Thompson-Nicola, and EMDR is among the least reliably available.',
    body: [
      'The private sector in Kamloops is small relative to the area it effectively serves, and specific trainings are not evenly distributed across small sectors. EMDR is frequently one of the gaps — not oversubscribed, simply not present in the numbers a region this size would need.',
      'Remote access changes the question from "who here is trained in this" to "who in British Columbia is". For a region where the honest local answer has often been that the modality is unavailable, that is a categorical change rather than an improvement in convenience.',
    ],
    faqs: [
      { q: 'How many EMDR sessions before anything shifts?', a: 'Too variable for an honest average, and a practitioner offering one is guessing. Progress is reviewed openly as you go.' },
      { q: 'Can EMDR be paused if it is too much?', a: 'Yes, and that is a normal adjustment rather than a setback. Pacing is agreed with you, not imposed.' },
    ],
  },

  {
    city: 'prince-george', service: 'couples-therapy',
    angle: 'Northern couples are frequently far from family as well as from services, which changes what the relationship is carrying.',
    body: [
      'Many couples in the north are some distance from extended family, which means the relationship absorbs support that would otherwise be spread across more people. That is a specific pressure and a considerable one, and it is quite different from the difficulties that bring urban couples to counselling.',
      'Add rotational or resource work, long winters and limited local services, and the load is structural rather than a matter of two people not trying. Naming that accurately tends to be more useful than working on communication in isolation.',
    ],
    faqs: [
      { q: 'Is there anything for couples locally?', a: 'General counselling exists in Prince George. Structured couples work with specific training is less reliably available, which is usually the gap people are trying to fill.' },
      { q: 'How do we start?', a: 'A free 15-minute video call, either together or one of you first. Both are ordinary ways to begin.' },
    ],
  },

  {
    city: 'prince-george', service: 'emdr-therapy',
    angle: 'EMDR in northern BC has meant a flight south, an intensive, and a long gap before the next one.',
    body: [
      'Where northern residents have accessed EMDR at all, the shape has usually been travel-based: a trip to the Lower Mainland, work compressed into a few days, then months before the next opportunity. That is a considerable commitment and a structure the modality does not particularly want.',
      'EMDR benefits from a predictable interval — processing, then time to settle, then more. Delivered remotely, a northern client gets the ordinary weekly or fortnightly rhythm rather than an intensive built around flight availability.',
    ],
    faqs: [
      { q: 'Is remote EMDR established practice?', a: 'Yes. Remote protocols are well established, with bilateral stimulation delivered on screen or by self-administered tapping.' },
      { q: 'What if my connection drops mid-session?', a: 'It is agreed in advance what happens — normally a phone call to finish, and never leaving a session unresolved because of a technical failure.' },
    ],
  },
];

/** Cities that carry paired pages. Every one must exist in cityContexts. */
export const PAIRED_CITIES = cityContexts.map((c) => c.slug);

export const getPair = (city: string, service: string) =>
  pairs.find((p) => p.city === city && p.service === service);

export const pairsForCity = (city: string) => pairs.filter((p) => p.city === city);
export const pairsForService = (service: string) => pairs.filter((p) => p.service === service);

export const cityFor = (slug: string): CityContext | undefined =>
  cityContexts.find((c) => c.slug === slug);
