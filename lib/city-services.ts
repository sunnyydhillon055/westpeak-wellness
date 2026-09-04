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
    angle: 'Two people, two commutes, one appointment. The logistics defeat more Vancouver couples than the therapy does.',
    body: [
      'Couples counselling has a scheduling problem that individual work does not: it needs two people free at the same time. In Vancouver that frequently means two different commutes converging on a third location at an hour that suits neither, and the first appointment either of them cannot make becomes the one that ends the attempt.',
      'Joining from home, or from two different places when that is what the week allows, removes the single most common practical reason couples work stops. It also changes the texture of the session. You are having a difficult conversation in the room where you actually have difficult conversations, rather than in a neutral office you both leave immediately afterwards.',
    ],
    faqs: [
      { q: 'Can we join from two separate locations?', a: 'Yes, and some couples deliberately do, occasionally because one partner travels, occasionally because separate rooms make a particular conversation more possible rather than less.' },
      { q: 'How long is a couples session?', a: 'Fifty minutes at $170, with a 110-minute extended session at $340 for work that genuinely needs the longer run. The extended format is usually a considered choice rather than the starting point.' },
    ],
  },

  {
    city: 'vancouver', service: 'emdr-therapy',
    angle: 'Vancouver has EMDR-trained clinicians; what it does not have is many with an opening this month.',
    body: [
      'EMDR is not rare in Vancouver in the sense that it is rare in most of the province, trained clinicians exist here in numbers. The constraint is different: EMDR tends to be offered by practitioners who are already established, which means the search usually ends in a waitlist rather than in an absence.',
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
      'None of that means the answer is more separation from family, and a counsellor who assumes it is will not be useful. The work is about being clear on which pressures are shared and which are inherited, and what the two of you actually want, which is a different conversation from the one that starts by treating obligation as the problem.',
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
      'That combination is a specific thing rather than a general claim about cultural fit. EMDR involves identifying the memory and the belief attached to it, and beliefs about shame, duty and reputation frequently sit in a first language. Working in the language the belief was formed in is not a nicety in this modality. It is closer to a working requirement.',
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
      'Couples in Burnaby frequently work in two different directions, one toward Vancouver, one east into Fraser Health territory, and an in-person appointment has to find a time and a place that defeats neither commute. That is a harder problem than it sounds, and it is the reason a lot of couples counselling here never gets past the enquiry.',
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
      'Practically speaking, looking for EMDR in Burnaby produces results in Vancouver. That is workable, but EMDR is a modality where consistency does real work, processing benefits from a predictable interval, and sessions that get moved because of traffic or a delayed bus interrupt something more specific than a chat would be.',
      'Delivered remotely, the interval is the only thing being scheduled. The bilateral stimulation is provided on screen or through self-administered tapping, both established remote protocols, and the preparation that makes EMDR safe is unchanged.',
    ],
    faqs: [
      { q: 'What if I feel destabilised after a session?', a: 'Preparation for exactly that comes before any processing begins, grounding you have practised, and an agreed plan for a difficult evening. This practice runs scheduled sessions with no on-call line, so that plan includes which crisis lines to use and when.' },
      { q: 'Can EMDR be combined with ordinary talking therapy?', a: 'Commonly, yes. Many courses of work use EMDR for specific stuck material inside a broader piece of counselling.' },
    ],
  },

  {
    city: 'abbotsford', service: 'couples-therapy',
    angle: 'Two people, one highway, one appointment, Fraser Valley couples usually lose the attempt to the drive rather than to the work.',
    body: [
      'Couples counselling requires two people free simultaneously. In Abbotsford that has often meant two people free simultaneously and both willing to drive to Surrey, which is a materially harder condition to satisfy and the one on which most attempts fail.',
      'There is also a rhythm point. Couples work benefits from sessions close enough together to keep momentum; a fortnightly cadence chosen because weekly was logistically impossible changes what the work can do. Removing the drive makes the interval a genuine choice rather than a consequence of geography.',
    ],
    faqs: [
      { q: 'Do you do premarital or pre-commitment work?', a: 'Yes, and it is generally more straightforward than work begun in a crisis, largely because nobody arrives already keeping score.' },
      { q: 'Can we book a longer first session?', a: 'A 110-minute extended session is available at $340 where there is a lot to lay out. Most couples start with the standard 50 minutes and decide from there.' },
    ],
  },

  {
    city: 'abbotsford', service: 'emdr-therapy',
    angle: 'EMDR is one of the modalities the Fraser Valley most reliably does not have locally.',
    body: [
      'Ask for EMDR in Abbotsford and the answer has commonly been that the nearest trained clinician is west of you. It is a specific enough training that a smaller local sector simply may not contain it, which is different from a service being busy. It is a service being absent.',
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
      { q: 'Is it too late for counselling if we are already talking about separating?', a: 'No. Some couples work is about deciding rather than repairing, and doing that deliberately, particularly where children are involved, is a legitimate use of the sessions.' },
      { q: 'Do you take sides?', a: 'No. Where something needs saying plainly it gets said plainly, which is a different thing from adjudicating between you.' },
    ],
  },

  {
    city: 'langley', service: 'emdr-therapy',
    angle: 'EMDR in Langley is available in principle and hard to book in practice, because the trained clinicians serve the whole eastern corridor.',
    body: [
      'The handful of EMDR-trained practitioners around Langley are absorbing demand from Surrey to Abbotsford, which is why the search so often ends in a waitlist. That is not a local failing. It is what happens when a specific training is thinly distributed across a wide corridor.',
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
      { q: 'What approach do you use with couples?', a: 'Gottman-trained, which is structured rather than open-ended, patterns of interaction are looked at directly rather than circled around.' },
      { q: 'Can we do this if we are in different places some weeks?', a: 'Yes. Partners joining from two locations is workable and reasonably common where shift patterns or travel make it necessary.' },
    ],
  },

  {
    city: 'chilliwack', service: 'emdr-therapy',
    angle: 'In the eastern Fraser Valley, EMDR is not a service that is busy. It is a service that is absent.',
    body: [
      'There is a difference between a modality being oversubscribed and a modality not being present, and Chilliwack usually meets the second. EMDR requires specific training that a smaller local sector may simply not contain, so the search does not end in a waitlist; it ends in nothing.',
      'This is the clearest case in the province for remote delivery. The protocol does not lose anything to video, bilateral stimulation is delivered on screen or by self-administered tapping, both established remote practice, and the alternative is not a different local option but no option at all.',
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
      'A session joined from home removes the question. That is not a minor point in a place where the relevant concern is not confidentiality in the formal sense, which any registered practice provides, but simply not being seen walking through a door.',
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
      'The Island EMDR pool is finite in a way a mainland pool is not. When the trained clinicians here are full, there is no adjacent city to try, the next option involves a sailing, and an intensive scheduled around ferry availability is a different piece of work from a weekly session.',
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
      'A large part of this economy runs on seasons: tourism, agriculture, construction, hospitality. That produces relationships where one partner is absent for months and then abruptly present, where income arrives unevenly, and where the winter conversation is entirely different from the summer one.',
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
      'A significant share of this region works away: camps, rotations, long shifts on the road. That produces relationships with a specific rhythm: intense reunion, awkward recalibration, departure, repeat. The difficulties it creates are structural rather than a sign that either person is doing something wrong.',
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
      'The private sector in Kamloops is small relative to the area it effectively serves, and specific trainings are not evenly distributed across small sectors. EMDR is frequently one of the gaps, not oversubscribed, simply not present in the numbers a region this size would need.',
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
      'EMDR benefits from a predictable interval: processing, then time to settle, then more. Delivered remotely, a northern client gets the ordinary weekly or fortnightly rhythm rather than an intensive built around flight availability.',
    ],
    faqs: [
      { q: 'Is remote EMDR established practice?', a: 'Yes. Remote protocols are well established, with bilateral stimulation delivered on screen or by self-administered tapping.' },
      { q: 'What if my connection drops mid-session?', a: 'It is agreed in advance what happens, normally a phone call to finish, and never leaving a session unresolved because of a technical failure.' },
    ],
  },
  /* ---- ANXIETY x CITY, added 2 Sep 2026 -----------------------------------
     Thirty of the fifty pages this file was designed for could not be built
     after anxiety, trauma and depression stopped being services in the
     five-service consolidation. They resolve through lib/conditions.ts now.
     These ten are the first of the three sets. Same rule as everything above:
     if a pair cannot be given its own argument it does not get a page. */
  {
    city: 'surrey', service: 'anxiety-counselling',
    angle: 'The barrier here is rarely finding somebody. It is being seen walking in.',
    body: [
      'Surrey has more counsellors than most of the province and a genuine shortage of privacy. In a community where families know each other, the counsellor who comes recommended is often connected to the very people you would least want to know you are going, and for anxiety specifically, that is not a small problem. Worrying about being seen at the appointment is itself a reason the appointment does not happen.',
      'A virtual practice removes the building, the car outside it, and the waiting room. What is left is the session. For a lot of people here that is the difference between starting in March and starting eventually.',
    ],
    faqs: [
      { q: 'Will anyone find out I am seeing a counsellor?', a: 'Not from this practice. Confidentiality is a legal duty and its limits are set out on the standards page. There is also no office anybody could see you enter, which is the part people actually ask about.' },
      { q: 'Is anxiety counselling different from general counselling?', a: 'The frame is narrower. Anxiety maintains itself through avoidance and checking, so the work targets those directly rather than talking around the worry, which is why it tends to be shorter than people expect.' },
    ],
  },
  {
    city: 'vancouver', service: 'anxiety-counselling',
    angle: 'A city that rewards looking fine, and charges the difference privately.',
    body: [
      'Vancouver runs on a lot of jobs where visible composure is part of the work: tech, film, hospitality, health care, anything client-facing. High-functioning anxiety is not a lesser version of the condition; it is the version that gets no help, because everybody around you can see the delivery and nobody can see the cost of producing it.',
      'The other Vancouver pattern is cost. Anxiety about money in an expensive city is a rational response to an expensive city, and treating it as a disorder misses the point. What can change is the part that has stopped being proportionate. The checking, the sleeplessness, the planning that never converts into rest.',
    ],
    faqs: [
      { q: 'I am functioning fine. Is that still worth bringing?', a: 'Yes, and it is the most common version seen here. Functioning is not the same as being alright, and the gap between the two is usually where the work is.' },
      { q: 'Can sessions fit around shift work?', a: 'Yes. Booking in blocks around a rotating roster, with gaps between them, is an ordinary pattern rather than a compromise, and pausing between blocks costs nothing.' },
    ],
  },
  {
    city: 'burnaby', service: 'anxiety-counselling',
    angle: 'The appointment becomes the third journey of the day, and the third one is the one that gets cancelled.',
    body: [
      'A great many people in Burnaby live in one city and work in another, so the day already contains two commutes before anything optional is added. An anxiety appointment in a third location, at a fixed hour, competes with the two journeys that are not negotiable, and loses, quietly, in about week five.',
      'That matters more for anxiety than for most things, because anxiety treatment depends on continuity. A course that stops after three sessions has usually stopped just before the part that works. Removing the journey removes the most common reason it stops.',
    ],
    faqs: [
      { q: 'Does it matter that I work outside Burnaby?', a: 'No. What matters is where you are sitting during the session, and that can be home, a car, or a quiet room at work, as long as it is private enough for you.' },
      { q: 'How many sessions does anxiety usually take?', a: 'Fewer than most people expect for focused anxiety work, and the honest answer depends on how long the pattern has been running. It is one of the things the free consultation is for.' },
    ],
  },
  {
    city: 'langley', service: 'anxiety-counselling',
    angle: 'The population grew faster than the number of people qualified to treat this.',
    body: [
      'Langley has added residents at a rate the local counselling capacity has not matched, and the effect shows up as waiting rather than as absence. There are counsellors; the ones taking new clients for anxiety specifically, at hours that suit somebody working, are a much shorter list than the size of the community implies.',
      'Waiting is its own problem here. Anxiety left alone tends to widen. The avoidance grows to cover more situations, and each one is harder to reverse than it would have been in month one. A virtual practice widens the field to the whole province without adding a drive west at the wrong hour.',
    ],
    faqs: [
      { q: 'Is Aldergrove covered?', a: 'Yes, on identical terms. Nothing about the service depends on distance inside the province.' },
      { q: 'How soon could I start?', a: 'Usually sooner than a public waitlist. The first step is a free fifteen-minute consultation, and the real timeline gets discussed there rather than promised here.' },
    ],
  },
  {
    city: 'abbotsford', service: 'anxiety-counselling',
    angle: 'For a lot of people here, the drive to the appointment is itself the anxious part.',
    body: [
      'Abbotsford sits far enough out that in-person counselling usually means a real drive, and close enough that people are told to make it anyway. For anxiety that is a specific trap rather than a general inconvenience: if driving, traffic or being far from home is part of what you are anxious about, the treatment has been placed on the other side of the symptom.',
      'It is also a valley that works to seasons and shifts more than to office hours. Booking in blocks with gaps between them is the normal pattern here, and it works better for anxiety than a rigid weekly slot that gets missed twice and then abandoned.',
    ],
    faqs: [
      { q: 'What if driving or leaving the house is part of the problem?', a: 'Then starting from home is not avoidance. It is a sensible first step, and one of the things the work can build outward from later if you want it to.' },
      { q: 'Does this cover Mission and the eastern valley?', a: 'Yes, on the same terms, with no distance penalty for being further out.' },
    ],
  },
  {
    city: 'chilliwack', service: 'anxiety-counselling',
    angle: 'A single highway decides whether you attend, which is a poor foundation for weekly work.',
    body: [
      'Travelling west from Chilliwack is a plan until it is not. The weather, a closure, an accident at the wrong point of Highway 1. An appointment that depends on one road is an appointment cancelled repeatedly, and repeated cancellation is corrosive for anxiety work specifically, because the gap between sessions is when the avoidance quietly rebuilds.',
      'Nothing about weather changes a video session. For somebody in the eastern valley that is not a convenience argument; it is the difference between a course of sessions that finishes and one that stops in February.',
    ],
    faqs: [
      { q: 'Are Agassiz and Hope covered?', a: 'Yes, on the same terms. There is no distance penalty inside the province.' },
      { q: 'What if my connection is poor?', a: 'The session can continue by voice. It is not a lesser session. Most of the work is the conversation, not the picture.' },
    ],
  },
  {
    city: 'kelowna', service: 'anxiety-counselling',
    angle: 'Seasonal work makes anxiety loudest in the months when the least is happening.',
    body: [
      'A great deal of work in the Central Okanagan is seasonal, and the shape of the year matters for anxiety in a way it does not elsewhere. The busy months bury it under activity; the quiet months take the activity away and leave the anxiety with nothing to hide behind. People here frequently arrive in the off-season convinced something has suddenly got worse, when what has changed is the distraction.',
      'Booking that follows the year rather than fighting it works better. Blocks during the heavy months, more regular work when the season turns, and no cost to pausing in between.',
    ],
    faqs: [
      { q: 'Can I pause during my busy season?', a: 'Yes, and it is better to plan that at the start than discover it in month two. Pausing between blocks costs nothing.' },
      { q: 'Are West Kelowna and Vernon covered?', a: 'Yes, on identical terms. The whole province is served on the same basis.' },
    ],
  },
  {
    city: 'kamloops', service: 'anxiety-counselling',
    angle: 'Shift work keeps the body braced, and a braced body reads as anxiety long after the shift ends.',
    body: [
      'Rotating shifts are ordinary in Kamloops, and they do something specific to anxiety: sleep goes first, and once sleep is unreliable the physical symptoms arrive on their own. The racing heart, the shallow breathing, the sense of being permanently about to react. People often reach for a psychological explanation for something a schedule is producing.',
      'That does not mean the anxiety is imaginary; it means the work has to include the pattern that is feeding it. Sessions booked around a rotation, rather than a rotation forced around a standing appointment, are the version that survives past week four.',
    ],
    faqs: [
      { q: 'I work rotating shifts. Can this fit?', a: 'Yes, and say so in the first conversation. Booking in blocks around a rotation is a normal pattern here rather than a special arrangement.' },
      { q: 'Are Merritt and Salmon Arm covered?', a: 'Yes, on the same terms, with no distance penalty for being further out.' },
    ],
  },
  {
    city: 'prince-george', service: 'anxiety-counselling',
    angle: 'A short local list and a long winter, which is a harder combination than either alone.',
    body: [
      'There are counsellors in Prince George, the ones taking clients fill quickly, and the wait for anything specialised is longer than almost anywhere else in the province. That is the arithmetic rather than a complaint about the place. For anxiety it bites twice, because the waiting itself becomes something to be anxious about.',
      'The winters are the other half. Months of darkness and limited movement narrow the range of things a person does, and a narrowed range is exactly the condition in which anxiety consolidates. A course of sessions that does not depend on a road or the weather is, for much of Northern BC, the only version that finishes.',
    ],
    faqs: [
      { q: 'Are Quesnel, Vanderhoof and Mackenzie covered?', a: 'Yes, on identical terms. No part of the service depends on distance within the province.' },
      { q: 'Should I stay on the public waitlist?', a: 'Generally yes. It costs nothing to stay in that queue while starting privately, and the two are parallel routes rather than alternatives.' },
    ],
  },
  {
    city: 'victoria', service: 'anxiety-counselling',
    angle: 'A city with real services, where the specific thing you need is still across the water.',
    body: [
      'Victoria is not short of counselling in general. It is short of the particular, a specific approach, an evening hour, somebody taking new clients this month, and for anxiety the particular is usually what matters, because the version that responds fastest to structured work is easy to mistreat with general support.',
      'The traditional answer has been a ferry, which for weekly work is not an answer at all. A virtual practice turns the question from who happens to be on the Island into who is right, which is the question that should have been asked first.',
    ],
    faqs: [
      { q: 'Are Saanich and Sooke covered?', a: 'Yes, on the same terms, with no penalty for being outside the core.' },
      { q: 'Will I have to travel for anything?', a: 'No. Everything including the first free consultation happens by video.' },
    ],
  },
  /* ---- TRAUMA x CITY, added 2 Sep 2026 ------------------------------------
     The second of the three condition sets. Routes to EMDR rather than to
     individual therapy — see lib/conditions.ts. */
  {
    city: 'surrey', service: 'trauma-therapy',
    angle: 'A great deal of what people carry here arrived with them, or with their parents.',
    body: [
      'Surrey holds one of the largest immigrant and second-generation populations in the country, and a significant share of what turns up in a counselling room here did not happen in Surrey. Migration itself can be traumatic: what was left, what was survived to get here, and what nobody spoke about afterwards because there was work to do. The second generation frequently arrives carrying a shape they cannot account for, because the events belong to somebody else.',
      'There is also a vocabulary problem. In plenty of families here there is no word for this that is not an insult, so it gets described as being sensitive, or difficult, or ungrateful. Naming it accurately is often the first useful thing that happens, and it can be done in Punjabi or English, or moving between them.',
    ],
    faqs: [
      { q: 'What if it happened to my parents rather than to me?', a: 'That is a recognised pattern rather than an unusual one, and it is workable. What gets transmitted is not the memory but the response to it, and the response is what the work addresses.' },
      { q: 'Do I have to describe what happened?', a: 'Not to begin, and not in detail unless you choose to. EMDR in particular does not require a full narrative account, which is one of the reasons it suits people who cannot yet put it into words.' },
    ],
  },
  {
    city: 'vancouver', service: 'trauma-therapy',
    angle: 'Some of the heaviest exposure in the province belongs to people who were at work when it happened.',
    body: [
      'Vancouver concentrates the hospitals, the ambulance service, the emergency departments and the downtown outreach work, and a large number of people here absorb other people\'s worst days as a condition of employment. Vicarious trauma has a specific shape: it accumulates rather than arriving, so there is rarely a single incident to point at, which is exactly why it goes unaddressed for years.',
      'The other reason it goes unaddressed is professional. People whose competence is the job are slow to describe themselves as affected by it, and a workplace culture that treats resilience as a personality trait rather than a finite resource makes that worse. Sessions outside the workplace, with no colleague in the building, are for a lot of people the only version they will actually attend.',
    ],
    faqs: [
      { q: 'Is this different from PTSD from a single incident?', a: 'Often, yes. Cumulative exposure tends to present as numbness, cynicism and a shortening fuse rather than as flashbacks, and it responds to being treated as what it is rather than as burnout.' },
      { q: 'Can sessions fit around a rotating hospital roster?', a: 'Yes. Booking in blocks around a roster, with gaps between them, is an ordinary pattern here and pausing between blocks costs nothing.' },
    ],
  },
  {
    city: 'burnaby', service: 'trauma-therapy',
    angle: 'It frequently surfaces only once life is finally stable enough to let it.',
    body: [
      'A pattern seen often in Burnaby: somebody arrives in their thirties or forties, settled, employed, housed, and describes symptoms that started recently for no reason they can identify. What has usually happened is not that something new occurred. It is that the conditions which made suppression necessary have finally eased, and the nervous system has taken the first opportunity in years to raise the subject.',
      'That is disorienting, and it is frequently misread by the person experiencing it as a sign of getting worse rather than of getting safer. It is neither a relapse nor a failure of the life that was built. It is the delayed part of an old event, arriving late because it could not arrive earlier.',
    ],
    faqs: [
      { q: 'Why now, when it happened years ago?', a: 'Because suppression takes resources, and it is usually released when the demand on those resources drops. Late onset after a period of stability is a common presentation rather than a strange one.' },
      { q: 'Does it matter that I cannot remember all of it?', a: 'No. Gaps are a feature of how traumatic memory is stored rather than an obstacle to the work, and nothing here requires you to reconstruct a complete account.' },
    ],
  },
  {
    city: 'langley', service: 'trauma-therapy',
    angle: 'Collisions on the corridor, and a funding route most people never learn exists.',
    body: [
      'The Langley corridor carries a lot of traffic, and motor vehicle incidents produce a specific and frequently underestimated aftermath: not the injury but the driving afterwards, the intersection that is now avoided, the passenger seat that is intolerable. People treat that as something to get over rather than as something treatable, and it narrows a life quietly.',
      'There is also a practical point almost nobody is told. Counselling after a motor vehicle incident in BC may be funded through the insurer rather than paid privately, and the entitlement is frequently unused because nobody mentions it. That is worth asking about before assuming the cost falls to you.',
    ],
    faqs: [
      { q: 'Might my counselling after a crash be covered?', a: 'Possibly. There is a funded route for counselling after a motor vehicle incident in BC, and it is worth asking your claim contact directly. It is often unclaimed simply because nobody raised it.' },
      { q: 'I was not badly hurt. Does that rule it out?', a: 'No. The severity of the physical injury is a poor predictor of the psychological aftermath, and a collision with no injury at all can leave a substantial one.' },
    ],
  },
  {
    city: 'abbotsford', service: 'trauma-therapy',
    angle: 'Agricultural and industrial work produces incidents, and the claim route for the psychological half is the part that gets missed.',
    body: [
      'Abbotsford works in agriculture, food processing, transport and trades, and those are sectors where serious incidents happen, to the person, or in front of them. The physical injury gets treated because it is visible and the process for it is well worn. The psychological injury from the same event frequently gets nothing, because the person assumes it is not covered and nobody corrects them.',
      'It usually is. A psychological injury arising from work can be claimed in BC, and the claim is separate from how the physical recovery went. People also present here long after the incident, having decided at the time that they were fine, which is ordinary rather than late.',
    ],
    faqs: [
      { q: 'Can a psychological injury from work be claimed?', a: 'Yes, in BC there is a route for exactly that, and it is separate from any physical claim. The resource page on WorkSafeBC psychological injury claims sets out how it works.' },
      { q: 'What if I only witnessed it?', a: 'Witnessing a serious incident is a recognised basis for the same effects and the same claim. Not having been the injured person does not put you outside this.' },
    ],
  },
  {
    city: 'chilliwack', service: 'trauma-therapy',
    angle: 'A community that has been flooded does not respond to the next forecast the way other places do.',
    body: [
      'Chilliwack and the eastern valley went through a flood that displaced households, cut the highway and reached farms and businesses across the Sumas Prairie. What that leaves behind is not only the practical loss. It is a changed relationship with weather: rain that is now monitored, forecasts that are read differently, and an autumn that arrives with a tension nobody outside the valley quite understands.',
      'That is a recognisable pattern rather than an overreaction, and it does not resolve simply because the water went down and the road reopened. It is treatable, and it does not require the original event to be relived in order to be worked with.',
    ],
    faqs: [
      { q: 'Is it normal to still react to heavy rain?', a: 'Yes, and it is a described response to a threat that recurs rather than one that ended. Anticipation of a repeat is part of the pattern rather than evidence of exaggeration.' },
      { q: 'Do I have to go back through the whole event?', a: 'No. EMDR in particular works without a full narrative retelling, which is one reason it suits events people would rather not describe in detail.' },
    ],
  },
  {
    city: 'kelowna', service: 'trauma-therapy',
    angle: 'Evacuation is an annual possibility here, which is a different thing from a single disaster.',
    body: [
      'Wildfire season in the Central Okanagan is a recurring feature rather than an exceptional event, and living with an annual threat produces something distinct from a one-off trauma. Households here have packed, left, waited on air quality and watched a ridge line, sometimes repeatedly. The stress does not end with the season, because the season returns.',
      'What often goes unrecognised is the aftermath in the years where nothing happened. A summer that stays clear can leave people feeling worse rather than relieved, because the readiness has nowhere to go. That is a described pattern in communities living with recurring risk, and it is workable.',
    ],
    faqs: [
      { q: 'Nothing actually burned. Does that still count?', a: 'Yes. Evacuation, prolonged threat and repeated readiness are their own experience, and whether property was lost is not what decides the effect.' },
      { q: 'Can I do this work during the season itself?', a: 'Yes, and some people prefer to. Sessions run by video and do not depend on being at a fixed address, which matters in a season that can move you.' },
    ],
  },
  {
    city: 'kamloops', service: 'trauma-therapy',
    angle: 'Trades and transport, and a workforce that arrives about a decade after the event.',
    body: [
      'Kamloops works in rail, transport, trades and resource industries, and those are settings where serious incidents are part of the job rather than an aberration. They are also settings where the culture around them is to carry on. The result is a very common presentation here: somebody in their forties or fifties describing something that happened long ago, who has never told anybody the whole of it.',
      'Delay is not a complication. It changes very little about whether the work is possible, and the fact that a decade has passed without it resolving on its own is usually the most useful piece of evidence that it was never going to.',
    ],
    faqs: [
      { q: 'It was years ago. Is it too late?', a: 'No. Time does not close the door on this work, and untreated events tend to persist rather than fade, which is generally what brings people in eventually.' },
      { q: 'Do I have to talk about it in detail?', a: 'Not to start, and not necessarily at all. The pacing is set by you, and EMDR does not require a full spoken account of the event.' },
    ],
  },
  {
    city: 'prince-george', service: 'trauma-therapy',
    angle: 'Serious incidents in the resource sector, a long way from anybody trained to treat the aftermath.',
    body: [
      'Forestry, milling, heavy transport and camp work carry real risk, and Northern BC is where a great deal of that work happens. When something goes wrong the physical response is well organised. The psychological one is not, because trauma-trained clinicians are concentrated in the south and the nearest one may be a long drive or a flight away.',
      'That gap is why so much of this goes untreated here rather than because people are unwilling. Virtual sessions remove the distance from the equation entirely, which for trauma work matters more than for most things. It needs continuity, and continuity is exactly what an eight-hour round trip destroys.',
    ],
    faqs: [
      { q: 'Can this work be done properly over video?', a: 'Yes, including EMDR, which is delivered by video routinely. The requirement is a private space and a workable connection rather than a shared room.' },
      { q: 'What if I work in a camp on rotation?', a: 'Booking in blocks around a rotation is normal and pausing between them costs nothing. It is worth planning at the start rather than discovering in month two.' },
    ],
  },
  {
    city: 'victoria', service: 'trauma-therapy',
    angle: 'A large service and veteran population, and a specific reluctance to be seen using local services.',
    body: [
      'Greater Victoria holds a substantial naval, military and veteran population, and with it a particular reluctance: a real concern about career consequences, and about being recognised in a waiting room by somebody who works alongside you. Whether or not that concern is justified in a given case, it reliably delays people from getting help, sometimes by years.',
      'Distance solves the visibility problem completely. There is no local waiting room, no car outside a building, and no chance of meeting a colleague on the way in, which for this population is frequently the difference between starting and continuing to manage it alone.',
    ],
    faqs: [
      { q: 'Will this affect my career or my file?', a: 'This is a private practice and nothing is reported anywhere. The limits of confidentiality are set out on the standards page and they are narrow, specific, and the same as they would be anywhere.' },
      { q: 'Are Saanich, Esquimalt and Sooke covered?', a: 'Yes, on identical terms. Nothing about the service depends on where in the region you are.' },
    ],
  },
  /* ---- DEPRESSION x CITY, added 2 Sep 2026 --------------------------------
     The last of the three condition sets, completing the fifty pages this file
     was designed for. Routes to individual therapy — see lib/conditions.ts. */
  {
    city: 'surrey', service: 'depression-counselling',
    angle: 'It gets called laziness first, usually by the person experiencing it.',
    body: [
      'In households built on effort. The family that arrived and worked, the parents who did without so the next generation would not have to, depression is unusually hard to name. The vocabulary available for somebody who cannot get out of bed is moral rather than clinical, and the person applies it to themselves long before anybody else does. Ungrateful is the word that comes up most.',
      'That framing is the obstacle, not the depression. What tends to help first is separating the symptom from the character judgement attached to it, and that conversation can happen in Punjabi or English, without the background needing to be explained from scratch.',
    ],
    faqs: [
      { q: 'How do I know it is not just laziness?', a: 'Laziness is a choice with the capacity intact. Depression removes the capacity, which is why effort produces exhaustion rather than progress. The distinction is one of the first things worth working out properly.' },
      { q: 'Do I need medication as well?', a: 'That is a question for a physician rather than a counsellor. Plenty of people do one, or the other, or both, and counselling does not require a decision about it first.' },
    ],
  },
  {
    city: 'vancouver', service: 'depression-counselling',
    angle: 'Grieving a future that got priced out is not the same as failing at it.',
    body: [
      'A particular version of low mood shows up in Vancouver: people who are working hard, earning reasonably, and watching the life they assumed they were building become arithmetically impossible. The house, the space, the timeline for children. That is a real loss rather than a distorted thought, and treating it as faulty thinking is both wrong and insulting.',
      'What the work can do is separate the grief, which is proportionate, from what has grown around it. The withdrawal, the comparison, the conclusion that the shortfall is a personal failure rather than a market. The first is worked with. The second is what tends to be doing the damage.',
    ],
    faqs: [
      { q: 'Is it depression if my situation is genuinely difficult?', a: 'It can be both. A reasonable response to hard circumstances and a depressive pattern can run at the same time, and the second is the part that responds to this work.' },
      { q: 'Will I be told to think positively?', a: 'No. Reframing a real constraint as an attitude problem is neither accurate nor useful, and it is not what happens here.' },
    ],
  },
  {
    city: 'burnaby', service: 'depression-counselling',
    angle: 'You can live in the middle of everything and still be an hour from anyone who knows you.',
    body: [
      'Burnaby is where a great many people end up because it is where the arithmetic worked, which frequently means living some distance from the friends, family and neighbourhood they actually came from. The city is central and the life inside it can be quite isolated, and isolation is one of the most reliable maintainers of low mood there is.',
      'It compounds quietly. Low mood reduces the energy available for the effort of seeing people, seeing fewer people lowers the mood further, and by the time somebody notices the pattern it has usually been running for months. Naming it as a loop rather than a personality is generally more useful than any advice about socialising more.',
    ],
    faqs: [
      { q: 'I am not sad exactly, just flat. Is that this?', a: 'Frequently, yes. Depression presents as absence at least as often as sadness, of energy, interest and the sense that anything matters, and the flat version is easy to dismiss for years.' },
      { q: 'How quickly would I notice anything?', a: 'That varies and nobody honest will promise a timeline. What can be said is that the early work is deliberately small and concrete, because depression removes exactly the energy that large plans require.' },
    ],
  },
  {
    city: 'langley', service: 'depression-counselling',
    angle: 'People move here for room, and sometimes trade away the network that came with being crowded.',
    body: [
      'A common Langley story: a move outward for space, a garden, a bedroom per child, and a quiet loss of the incidental contact that came with living closer in. Nobody drops by any more, the friendships require planning, and the social life that used to happen by accident now has to be organised by somebody who has less energy than they used to.',
      'That is a structural change rather than a character flaw, and it is worth treating as one. The work looks at what actually rebuilds contact at a scale that is possible right now, rather than at the version that assumes the energy has already returned.',
    ],
    faqs: [
      { q: 'Nothing bad has happened. Can it still be depression?', a: 'Yes. It does not require a cause you can point to, and the absence of an obvious trigger is one of the most common reasons people delay getting help.' },
      { q: 'Is Aldergrove covered?', a: 'Yes, on identical terms. No part of the service depends on distance inside the province.' },
    ],
  },
  {
    city: 'abbotsford', service: 'depression-counselling',
    angle: 'Seasonal work fills the summer and empties the winter, and the winter is when it lands.',
    body: [
      'A great deal of work in the valley follows the growing year, which means long, exhausting, fully occupied months followed by a stretch with very little in it. That shape is hard on mood in a specific way: the busy season leaves no room to notice anything, and the quiet one removes the structure that was holding the day together.',
      'People often arrive in January convinced something has gone suddenly wrong. Usually nothing has changed except the amount of activity available to sit on top of it. Building some deliberate structure into the off-season is unglamorous and tends to be the thing that matters most.',
    ],
    faqs: [
      { q: 'It only happens in winter. Is that different?', a: 'It may be seasonal, and that is worth naming precisely because the pattern is predictable, which means it can be planned for before it arrives rather than only responded to.' },
      { q: 'Can I stop during my busy season?', a: 'Yes, and better to plan that at the start. Booking in blocks with gaps between them is normal here and pausing costs nothing.' },
    ],
  },
  {
    city: 'chilliwack', service: 'depression-counselling',
    angle: 'In a town this size, being seen getting help is a real calculation rather than a paranoid one.',
    body: [
      'Chilliwack is large enough to have services and small enough that people know each other, and that combination produces a specific silence. Somebody weighing up counselling here is also weighing up whether the receptionist knows their family, whether the car is recognisable outside, and what gets said if it comes up. For depression that calculation is especially costly, because the condition already argues for staying home.',
      'A practice with no building removes the calculation entirely. It is a small structural point and it repeatedly turns out to be the deciding one.',
    ],
    faqs: [
      { q: 'Would anyone know I am doing this?', a: 'Not from here. There is no local office, no waiting room and no local staff, and confidentiality is a legal duty with narrow limits set out on the standards page.' },
      { q: 'Are Agassiz and Hope covered?', a: 'Yes, on the same terms, with no distance penalty inside the province.' },
    ],
  },
  {
    city: 'kelowna', service: 'depression-counselling',
    angle: 'Moving somewhere beautiful and feeling worse is more common here than anybody admits.',
    body: [
      'A lot of people arrive in the Okanagan on purpose, for the lake, the pace, the retirement, the fresh start. What is less discussed is how many find the first year harder rather than easier. The move removes the routines and the incidental company that were holding things together, and the setting makes that difficult to say out loud without sounding ungrateful.',
      'That silence is the problem worth addressing. Relocation depression is a described pattern, it is not a verdict on the decision to move, and it is usually more about the loss of structure and contact than about the place itself.',
    ],
    faqs: [
      { q: 'I moved here by choice. Why do I feel worse?', a: 'Because a move removes routine and incidental contact at the same time, and both were doing more work than they appeared to. It is a common pattern rather than an indictment of the decision.' },
      { q: 'Are West Kelowna and Vernon covered?', a: 'Yes, on identical terms across the province.' },
    ],
  },
  {
    city: 'kamloops', service: 'depression-counselling',
    angle: 'Night shifts flatten mood through the body clock, and it gets read as a character problem.',
    body: [
      'Shift work is ordinary in Kamloops, and prolonged night and rotating shifts do measurable things to sleep and daylight exposure, both of which sit close to mood. People working those patterns frequently describe flatness, irritability and a loss of interest, and then conclude something is wrong with them rather than with the schedule.',
      'The schedule is often not negotiable, so the work is not about advising a different job. It is about what can be protected inside the pattern that exists: light, timing, and the small number of things that hold a day together when the day starts at four in the afternoon.',
    ],
    faqs: [
      { q: 'Could my shifts be causing this?', a: 'They can certainly contribute, through sleep and light exposure. That does not make the low mood less real, and it does usually change what the useful first steps are.' },
      { q: 'Are Merritt and Salmon Arm covered?', a: 'Yes, on the same terms, with no distance penalty for being further out.' },
    ],
  },
  {
    city: 'prince-george', service: 'depression-counselling',
    angle: 'The darkest winter in the province, and the least local capacity to treat what it does.',
    body: [
      'Northern BC gets meaningfully less winter daylight than the south, and the effect on mood is well described rather than anecdotal. Combine that with months where getting anywhere is difficult and the range of things a person does contracts sharply, and a contracted range is one of the conditions in which low mood entrenches.',
      'The local counselling capacity is also the thinnest in the province, so the season with the highest need coincides with the longest wait. Sessions that do not depend on a road or the weather are, for a great many people here, the only version that runs through the months when it is actually needed.',
    ],
    faqs: [
      { q: 'Is this just seasonal?', a: 'It might be, and it is worth establishing rather than assuming, because a predictable pattern can be prepared for in advance instead of only reacted to.' },
      { q: 'Should I stay on the public waitlist?', a: 'Generally yes. Staying in that queue costs nothing while starting privately, and the two are parallel routes rather than alternatives.' },
    ],
  },
  {
    city: 'victoria', service: 'depression-counselling',
    angle: 'Feeling low in a place everybody else calls idyllic makes the feeling harder to say.',
    body: [
      'Victoria is mild, attractive and widely envied, and that produces a particular difficulty for anybody depressed in it. The setting invalidates the complaint before it is made: by family elsewhere, and more effectively by the person themselves, who concludes there is no legitimate reason to feel this way and therefore says nothing.',
      'Depression does not require a legitimate reason and does not respond to being argued out of one. What it responds to is being treated as a condition rather than as a failure of perspective, which is where the work starts.',
    ],
    faqs: [
      { q: 'I have no reason to feel like this. Does that matter?', a: 'No. Depression frequently arrives without a cause you can point to, and the absence of one is not evidence against it. It is one of the most common features.' },
      { q: 'Are Saanich and Sooke covered?', a: 'Yes, on identical terms, with no penalty for being outside the core.' },
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
