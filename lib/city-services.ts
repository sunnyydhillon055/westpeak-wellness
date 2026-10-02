import { cityContexts, type CityContext } from '@/lib/city-context';
import { headingId } from '@/lib/toc';
import { fallbackFee, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { counsellorsFor, listOf } from '@/lib/city-service-page';

/* The Victoria EMDR answer, from the roster and the catalogue. EMDR bills
   weekly as an individual session and in the longer format as the intensive
   (lib/practitioner-facts.ts OFFERINGS). 1 Oct 2026. */
const minutesOf = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)?.minutes;
export function victoriaEmdrAnswer(): string {
  const who = counsellorsFor({ bookingService: 'emdr-therapy' }).map((p) => p.name);
  const offers = who.length
    ? ` ${listOf(who, 'and')} ${who.length === 1 ? 'offers' : 'offer'} EMDR to people in Victoria: weekly at ${fallbackFee('Individual Counselling')} for ${minutesOf('Individual Counselling')} minutes, or the ${minutesOf('EMDR Intensive')}-minute intensive at ${fallbackFee('EMDR Intensive')}, after a free 30-minute consultation.`
    : '';
  return `Yes. EMDR runs by secure video from anywhere on the Island, so there is no sailing at either end.${offers} The booking calendar shows real open times in Pacific time, which is Victoria's own clock.`;
}

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
  /* The name the <title> uses, when Search Console shows the page is found by
     a different name from the service's own. Title only: the heading, the
     description and the schema keep the service name. The page composes it
     to fit the 60-character gate. 1 Oct 2026. */
  titleName?: string;
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
      { q: 'How long is a couples session?', a: `Fifty minutes at ${fallbackFee('Couples Counselling')}, with a 110-minute extended session at ${fallbackFee('Couples Extended')} for work that genuinely needs the longer run. The extended format is usually a considered choice rather than the starting point.` },
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
      { q: 'Can sessions run in Punjabi if one of us is more comfortable that way?', a: 'Not for couples work at the moment: couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi, and where partners have different language preferences, that is worth naming early rather than working around.' },
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
      /* Search Console, 17 Sep 2026: EMDR therapy Guildford, twelve impressions at position 50, and the neighbourhood was not named. */
      { q: 'Does this cover Guildford, Newton and Fleetwood?', a: 'All of Surrey, by video: Guildford, Newton, Fleetwood, Whalley, Cloverdale and South Surrey, along with North Delta and White Rock. Somebody in Guildford searching for EMDR is usually looking for something within the neighbourhood so they are not on King George at rush hour; a session from home removes the question.' },
      { q: 'Can EMDR be done in Punjabi?', a: 'Not at the practice at the moment: EMDR currently runs in English or Tagalog. Individual counselling is available in Punjabi, and the free consultation is the place to talk through which of the two fits better.' },
      { q: 'How many sessions does EMDR take?', a: 'It varies too widely for an honest average. Some focused pieces of work are short; anything involving repeated or early experience generally is not. It is reviewed as you go rather than committed to in advance.' },
    ],
  },

  {
    city: 'burnaby', service: 'couples-therapy',
    angle: 'Two Burnaby commutes rarely converge anywhere convenient, which is why couples work here so often stalls at scheduling.',
    body: [
      'Couples in Burnaby frequently work in two different directions, one toward Vancouver, one east into Fraser Health territory, and an in-person appointment has to find a time and a place that defeats neither commute. That is a harder problem than it sounds, and it is the reason a lot of couples counselling here never gets past the enquiry.',
      'Removing the location from the equation leaves only the time, which is a solvable problem. It also means the two of you can join from different places, one still at work and the other at home, which is a compromise that in-person scheduling cannot offer at all, and the calendar shows the real open times.',
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
    /* Search Console, as read 1 Oct 2026: "marriage counselling abbotsford"
       and its variants 51 impressions, "couples counselling/therapy
       abbotsford" 33. */
    titleName: 'Marriage Counselling',
    angle: 'Two people, one highway, one appointment, Fraser Valley couples usually lose the attempt to the drive rather than to the work.',
    body: [
      'Couples counselling requires two people free simultaneously. In Abbotsford that has often meant two people free simultaneously and both willing to drive to Surrey, which is a materially harder condition to satisfy and the one on which most attempts fail.',
      'There is also a rhythm point. Couples work benefits from sessions close enough together to keep momentum; a fortnightly cadence chosen because weekly was logistically impossible changes what the work can do. Removing the drive makes the interval a genuine choice rather than a consequence of geography.',
    ],
    faqs: [
      /* Search Console, 17 Sep 2026: 70 impressions a quarter for marriage counselling Abbotsford, and the word appeared nowhere on this page. */
      { q: 'Is this the same as marriage counselling?', a: 'Yes. "Marriage counselling" is what most people in Abbotsford type, "couples therapy" is what the profession calls it, and the work is the same: married, common-law, engaged or neither. The only difference the word makes is that a couple searching for marriage counselling is often further along, sometimes at the point where one of them has said the word divorce, and that is worth saying at the first call so the pace is right.' },
      { q: 'Do you do premarital or pre-commitment work?', a: 'Yes, and it is generally more straightforward than work begun in a crisis, largely because nobody arrives already keeping score.' },
      { q: 'Can we book a longer first session?', a: `A 110-minute extended session is available at ${fallbackFee('Couples Extended')} where there is a lot to lay out. Most couples start with the standard 50 minutes and decide from there.` },
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
      /* Search Console, 17 Sep 2026: couples therapy Langley and marriage counselling Langley, 17 impressions. */
      { q: 'Is this marriage counselling?', a: 'Yes, if that is the word you use. Langley couples search for marriage counselling and couples therapy in about equal numbers and arrive at the same room. The approach is Gottman-informed, drawing on research with married and long-term couples that applies to both. Ask on the consultation what training your counsellor has.' },
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
      'Two people travelling together for two hours to discuss a difficult subject also has an obvious problem: the car journey home. Joining from your own kitchen, with no drive either side of the session, is not a downgrade from that arrangement.',
    ],
    faqs: [
      { q: 'What approach do you use with couples?', a: 'Couples work at the practice is Gottman-informed, which means structured rather than open-ended: patterns of interaction are looked at directly rather than circled around. Ask on the consultation which approach your counsellor uses.' },
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
      /* Search Console, 26 Sep 2026: "emdr therapy victoria" 9 impressions at
         19.56 plus four variants, 14 impressions at 19-38; the page itself 20
         at 29.65. This replaced a time-zone answer that said "the whole
         province is on one clock", which is false: the Peace region and the
         East Kootenay keep Mountain time, as the Fort St. John page says. Who
         offers EMDR and what it costs are read from the roster and the
         catalogue, never typed. 1 Oct 2026. */
      { q: 'Is EMDR therapy available in Victoria without a ferry?', a: victoriaEmdrAnswer() },
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
      /* Search Console, 17 Sep 2026: sixty impressions across marriage counselling Kelowna and its variants, position 55 to 62. */
      { q: 'Do you offer marriage counselling in Kelowna, or only couples therapy?', a: 'They are the same service under two names. The Kelowna searches split almost evenly between the two, and the practice uses "couples" only because it includes people who are not married and does not want them to feel excluded. If you are married and looking for marriage counselling, this is it, by video, which in the Okanagan usually means neither of you drives across the bridge at five o\'clock.' },
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
      /* Search Console, 17 Sep 2026: EMDR Peachland, Penticton and greater Okanagan, eleven impressions at positions 7 to 28, with none of those names on the page. */
      { q: 'Are Peachland, West Kelowna and Penticton covered?', a: 'Yes. EMDR by video is the same session from Peachland, Summerland, Penticton, West Kelowna, Lake Country or Vernon as it is from Kelowna itself, and for the smaller Okanagan towns it is often the only EMDR-trained option that does not involve the Coquihalla or the connector. Searches for an EMDR specialist in Peachland arrive here for that reason.' },
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
      /* Search Console, 17 Sep 2026: relationship counselling Kamloops and couples counselling Kamloops, 22 impressions, position 47 to 55. */
      { q: 'Is relationship counselling in Kamloops different from couples counselling?', a: 'No. Relationship counselling, couples counselling and marriage counselling describe the same work. The reason it matters in Kamloops is that the local options under any of those names are few, and a couple who has searched all three and found the same two clinics full should know that online sessions with a counsellor elsewhere in BC are a normal route, not a fallback.' },
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
    /* Search Console, as read 1 Oct 2026: only marriage-counselling queries
       reach this page; no couples-phrased query appears. */
    titleName: 'Marriage Counselling',
    angle: 'Northern couples are frequently far from family as well as from services, which changes what the relationship is carrying.',
    body: [
      'Many couples in the north are some distance from extended family, which means the relationship absorbs support that would otherwise be spread across more people. That is a specific pressure and a considerable one, and it is quite different from the difficulties that bring urban couples to counselling.',
      'Add rotational or resource work, long winters and limited local services, and the load is structural rather than a matter of two people not trying. Naming that accurately tends to be more useful than working on communication in isolation.',
    ],
    faqs: [
      /* Search Console, 17 Sep 2026: marriage counselling Prince George, nine impressions across three phrasings, position 36 to 38. */
      { q: 'Is there marriage counselling in Prince George?', a: 'Very little, which is why people search for it. A handful of practitioners in the city see couples, most have waits, and the alternative is a drive to nowhere closer. Online marriage counselling from a BC counsellor happens from your own home, with both of you on the same screen or on two, and the first 30-minute consultation is free.' },
      { q: 'Is there anything for couples locally?', a: 'General counselling exists in Prince George. Structured couples work with specific training is less reliably available, which is usually the gap people are trying to fill.' },
      { q: 'How do we start?', a: 'A free 30-minute video call, either together or one of you first. Both are ordinary ways to begin.' },
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
      { q: 'How soon could I start?', a: 'Usually sooner than a public waitlist. The first step is a free thirty-minute consultation, and the real timeline gets discussed there rather than promised here.' },
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
      { q: 'Does this cover the eastern valley?', a: 'Yes, on the same terms, with no distance penalty for being further out. Mission, north of the river, has an anxiety page of its own.' },
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
      /* Search Console, 17 Sep 2026: anxiety specialist Kelowna, anxiety therapist Kelowna, anxiety counselling Kelowna. */
      { q: 'Are you an anxiety specialist?', a: 'Anxiety is the most common thing brought to this practice and the counsellors work with it daily, using CBT, ACT and, where trauma sits underneath, EMDR. "Specialist" is not a protected term in counselling and it is worth being careful with; the protected credential is Registered Clinical Counsellor, and the training in anxiety-specific approaches is listed on each counsellor\'s profile.' },
      { q: 'Can I pause during my busy season?', a: 'Yes, and it is better to plan that at the start than discover it in month two. Pausing between blocks costs nothing.' },
      { q: 'Are West Kelowna and Lake Country covered?', a: 'Yes, on identical terms. The whole province is served on the same basis, and Vernon and the North Okanagan have pages of their own.' },
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
      /* Search Console, 17 Sep 2026: acceptance and commitment therapy Kamloops (12) and narrative therapy Kamloops (11), positions 47 to 50. */
      { q: 'Do you use ACT or narrative therapy?', a: 'Both are part of the anxiety work here. Acceptance and commitment therapy is used because anxiety rarely leaves on request and the useful question becomes what you do while it is present; narrative approaches because the story a person tells about their anxiety is often the thing keeping it in place. Kamloops has few practitioners naming either, which is why those searches arrive at a page about online sessions.' },
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
      'Victoria is not short of counselling in general. It is short of the particular, a specific approach, a time that fits without a commute, somebody taking new clients this month, and for anxiety the particular is usually what matters, because the version that responds fastest to structured work is easy to mistreat with general support.',
      'The traditional answer has been a ferry, which for weekly work is not an answer at all. A virtual practice turns the question from who happens to be on the Island into who is right, which is the question that should have been asked first.',
    ],
    faqs: [
      /* Search Console, 17 Sep 2026: Victoria BC anxiety disorder, anxiety therapy and anxiety treatment, eight impressions at 50 to 60. */
      { q: 'Is this anxiety treatment, or just talking?', a: 'It is treatment in the sense that matters: structured, evidence-based work on an anxiety disorder, whether or not one has been formally diagnosed. What it is not is medication or a diagnosis, both of which come from a physician. Many people in Victoria run the two in parallel, and the counsellor will say plainly if a doctor should be involved.' },
      { q: 'Are Esquimalt and Oak Bay covered?', a: 'Yes, on the same terms, with no penalty for being outside the core.' },
      { q: 'Will I have to travel for anything?', a: 'No. Everything including the first free consultation happens by video.' },
    ],
  },
  /* ---- TRAUMA x CITY, added 2 Sep 2026 ------------------------------------
     The second of the three condition sets. Books into individual
     counselling since 1 Oct 2026 (it routed to EMDR before), with the EMDR
     intensive offered as a later option — see lib/conditions.ts. */
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
      /* Search Console, 17 Sep 2026: trauma therapy Langley BC, ten impressions, and PTSD counselling Langley. */
      { q: 'Is PTSD counselling available in Langley?', a: 'By video, yes, and it is the same trauma work described on this page. The label matters mainly for coverage: after a crash, ICBC funds counselling without requiring a PTSD diagnosis, and after an incident at work, WorkSafeBC has its own claim process. Neither needs to be settled before a first conversation.' },
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
      /* Search Console, 17 Sep 2026: PTSD therapy Kelowna and PTSD counselling Kelowna. */
      { q: 'Is this the same as PTSD counselling?', a: 'Yes, where PTSD is what is going on, and also where it is not. PTSD is one diagnosis inside a wider set of responses to things that happened, and trauma therapy works with the whole set. A counsellor does not diagnose; if a diagnosis matters for a claim or a benefit, that comes from a physician and the counselling runs alongside.' },
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
      /* Search Console, 17 Sep 2026: trauma counselling Kamloops, 21 impressions at position 36; the page said only therapy. */
      { q: 'Trauma counselling or trauma therapy: is there a difference?', a: 'None that matters to you. People in Kamloops search for trauma counselling about twice as often as trauma therapy and both land here. The session is the same, the counsellor is the same, and so is the honest limit: a Registered Clinical Counsellor does not diagnose PTSD, and does not need to in order to do the work.' },
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
      /* Search Console, 17 Sep 2026: PTSD therapy Prince George, position 16.5, and the word PTSD was not on this page. */
      { q: 'Is this PTSD therapy?', a: 'It can be. PTSD is a diagnosis, and a counsellor does not make one; trauma therapy is the work, and it is the same work whether the diagnosis has been made by a physician, is suspected, or has never been raised. Many people in Prince George searching for PTSD therapy are in industrial, forestry or first-responder roles where a formal diagnosis has consequences at work. The counselling does not require one and does not create one.' },
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
      /* Search Console, 17 Sep 2026: PTSD treatment Victoria BC and Victoria BC PTSD, and trauma therapy Victoria at 27.6. */
      { q: 'Do you treat PTSD in Victoria?', a: 'Trauma therapy here includes work with people who have a PTSD diagnosis and people who do not; the diagnosis comes from a physician or psychologist, not a counsellor, and the therapy does not depend on it. In Victoria a large share of that work is with serving and former military, DND civilians and first responders, for whom the question of what goes on a file matters, and that is answered plainly in the first session.' },
      { q: 'Will this affect my career or my file?', a: 'This is a private practice and nothing is reported anywhere. The limits of confidentiality are set out on the standards page and they are narrow, specific, and the same as they would be anywhere.' },
      { q: 'Are Esquimalt, Oak Bay and James Bay covered?', a: 'Yes, on identical terms. Nothing about the service depends on where in the region you are.' },
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
      /* Search Console, 17 Sep 2026: depression assessment Abbotsford, position 27. */
      { q: 'Do you do depression assessments in Abbotsford?', a: 'A counsellor does not diagnose depression; a family doctor, nurse practitioner or psychologist does, and if a formal assessment is what you need for a claim or a leave, that is the route. What happens here is a clinical conversation about what is going on, with standard screening measures used to track change, and it can start this week rather than after a waitlist for assessment.' },
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
      { q: 'Are West Kelowna and Lake Country covered?', a: 'Yes, on identical terms across the province. Vernon has a page of its own.' },
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
      { q: 'Are Esquimalt and Oak Bay covered?', a: 'Yes, on identical terms, with no penalty for being outside the core.' },
    ],
  },
  /* ---- SAANICH, 2 Oct 2026 ---------------------------------------------
     Five arguments, none of them the strait (Victoria's): the term calendar
     (anxiety), later-life low mood on the Peninsula (depression), the gap
     between same-day public help and paced trauma work (trauma), marriages
     reshaped by retirement and caregiving (couples), and fitting EMDR's phases
     to a term (EMDR). Couples and EMDR book Camille only, so their language
     answers do not offer Punjabi. No counsellor is named. */
  {
    city: 'saanich', service: 'anxiety-counselling',
    angle: 'Around the university, anxiety runs to a term calendar, and the calendar does not pause for treatment.',
    body: [
      'Most of the University of Victoria sits inside Saanich, and Camosun’s Interurban campus is here too, so a large share of the anxiety people bring in this district has a date attached: a midterm, a thesis deadline, a practicum, a first term a long way from home. Anxiety that peaks on a schedule is easy to postpone dealing with, because there is always a quieter month coming.',
      'Campus counselling exists for exactly this and is the right first call. What it is not set up for is the person whose anxiety outlasts the term, or who wants the same counsellor through the summer at home in another part of the province. Video makes that continuity possible, provided both of you are in British Columbia during the session.',
    ],
    faqs: [
      { q: 'Should I use UVic or Camosun counselling instead?', a: 'If it fits, yes, and there is no reason to feel you are skipping a step by starting there. Private counselling is a reasonable next move when you want continuity past the end of term, more frequent sessions than a campus service can offer, or a specific approach to anxiety.' },
      { q: 'Can I keep going when I go home for the summer?', a: 'Yes, as long as home is in British Columbia. A BC-registered counsellor can see you only while you are physically in the province, so a summer in Alberta or overseas means a planned pause rather than sessions from there.' },
      { q: 'My anxiety is worst around exams. Is that worth treating?', a: 'Yes. Anxiety that arrives on a schedule is still anxiety, and the predictable timing helps: the work can be planned around the calendar, with the most practical part done before the pressure arrives rather than during it.' },
    ],
  },
  {
    city: 'saanich', service: 'depression-counselling',
    angle: 'On the Peninsula, low mood after retirement or a loss is easily put down to age rather than recognised as depression.',
    body: [
      'Sidney’s median age in the 2021 Census was 62, and North Saanich’s was nearly 57. In towns this old, the losses arrive closer together: a partner, friends, a role, health that used to be taken for granted. Low mood after that run of losses is so expected that it is rarely examined, and depression hides comfortably inside what everyone agrees is simply getting older.',
      'Age is not a cause of depression and it is not a reason to leave it alone. Counselling at seventy works on the same things it works on at thirty: what the low mood is doing to sleep, to contact with people, and to the days themselves. A session by video, from a familiar chair, removes the drive into town, which is often the first thing a low stretch makes impossible.',
    ],
    faqs: [
      { q: 'Is it depression, or am I just getting older?', a: 'Getting older brings losses, and sadness about them is ordinary. Depression is different in kind: a flatness that settles in, interest that does not come back, sleep and appetite that change. A counsellor can help you tell the two apart, and a physician can rule out a medical cause.' },
      { q: 'My doctor has suggested medication. Is counselling instead of that?', a: 'Not instead, and not in competition. Many people use both, and the decision about medication belongs to you and your doctor. Counselling works on the patterns that keep a low mood in place, whichever way that decision goes.' },
      { q: 'I am not used to video calls. How hard is it?', a: 'Less hard than most people expect. The link opens in a browser with nothing to install, and the opening minutes of a first session are routinely spent making sure sound and picture work. A family member can help set it up and then leave the room.' },
    ],
  },
  {
    city: 'saanich', service: 'trauma-therapy',
    angle: 'Same-day public help in Greater Victoria is good at the immediate; trauma work is rarely immediate and rarely short.',
    body: [
      'Island Health’s CARES service offers South Island residents a same-day assessment and walk-in counselling, and it is worth using when something needs attention now. Trauma that has been carried for years is a different kind of work. It needs time to build stability before anything difficult is approached, and a pace set together rather than by a single visit.',
      'That is where private trauma therapy sits alongside the public route rather than against it. Sessions by video from Saanich run on a plan you agree, at a frequency that suits you, with the same counsellor from the first session onwards, and starting privately does not remove you from any public list.',
    ],
    faqs: [
      { q: 'I have already been to CARES. Is private trauma therapy something different?', a: 'Usually, yes. CARES is built for same-day assessment and focused support, with follow-up and referral where needed. Trauma therapy is a longer piece of work with one counsellor, planned around stabilising first and processing later. Many people use both at different points.' },
      { q: 'Do I have to go through the worst of it straight away?', a: 'No. The early sessions are about stability: sleep, what sets things off, and how to settle when it happens. Nothing difficult is approached until you and the counsellor agree there is enough steadiness to approach it.' },
      { q: 'Can trauma sessions happen in Punjabi?', a: 'Yes. Trauma therapy here is booked as individual counselling, which is available in Punjabi, English or a mix, by video. About three in five of the region’s Punjabi mother-tongue speakers live in Saanich, and something hard is often easier to say in the language it happened in.' },
    ],
  },
  {
    city: 'saanich', service: 'couples-therapy',
    angle: 'On the Peninsula, couples counselling often arrives late: after a retirement, a diagnosis, or one partner becoming the other’s carer.',
    body: [
      'A marriage built around two working lives has to be rebuilt when both stop, and in the Peninsula towns, where a large share of residents are past sixty-five, a great many couples are doing that at once. Time together doubles overnight. Roles that were never discussed become the whole of the day, and an illness can turn a partner into a patient with very little warning.',
      'Couples rarely seek help at this stage, partly because counselling is assumed to be for younger marriages in trouble. It is not. Working out a retirement together, or how to stay partners while one cares for the other, is ordinary couples work, and joining from your own living room removes the drive into Victoria entirely.',
    ],
    faqs: [
      { q: 'Is it too late for couples counselling after forty years together?', a: 'No. Long marriages bring their own advantages to the work, including a great deal of shared history to draw on. What tends to be harder is naming patterns that have been in place for decades, and that is exactly what the sessions are for.' },
      { q: 'One of us is now caring for the other. Is that couples work?', a: 'It can be. Caregiving changes the balance of a relationship, and both partners often feel the loss of how things were without saying so. Sessions make room for both experiences rather than only the illness.' },
      { q: 'Can sessions run in Punjabi if one of us is more comfortable that way?', a: 'Not for couples sessions, which currently run in English or Tagalog. Punjabi is available for individual counselling, so a partner who would rather speak Punjabi can have sessions of their own in it. The free consultation is the place to sort out which combination fits.' },
    ],
  },
  {
    city: 'saanich', service: 'emdr-therapy',
    angle: 'For a student, EMDR’s preparation phase has to fit a term, and a term has an end date.',
    body: [
      'EMDR is not a single technique applied on the first day. It starts with history and preparation, practising ways to settle before any memory is processed, and the processing itself takes energy that a week of exams does not leave spare. In a district built around UVic and Camosun, the sensible question is not only whether to start, but when.',
      'Planning the phases against the academic calendar is ordinary: preparation during a lighter stretch, processing where there is room to recover, and a pause around exams if that suits you. Because sessions run by video anywhere in British Columbia, a summer at home elsewhere in the province does not have to interrupt the work halfway.',
    ],
    faqs: [
      { q: 'Should I start EMDR during exams?', a: 'Usually not the processing part. Preparation can start at almost any point, but processing a difficult memory is tiring, and it is better scheduled where there is space afterwards. The timing is agreed with you at the outset rather than assumed.' },
      { q: 'Can EMDR continue if I go home for the summer?', a: 'Yes, if home is in British Columbia, by the same secure video and with the same counsellor. Outside the province, sessions pause until you are back, and that is planned in advance rather than discovered in June.' },
      { q: 'Is EMDR available in Punjabi?', a: 'Not at the moment: EMDR currently runs in English or Tagalog. Individual counselling is available in Punjabi, and the free consultation is the place to talk through which fits.' },
    ],
  },
  /* ---- MAPLE RIDGE, 2 Oct 2026 -----------------------------------------
     Five arguments from one fact, that most of Ridge Meadows leaves town to
     work: the early start eating sleep (anxiety), the long solo drive
     (depression), commuter and shift-roster partners (couples), the two
     correctional centres and the hospital (trauma), and the bridge on the
     way home after processing (EMDR). Couples and EMDR book Camille only,
     so their language answers do not offer Punjabi. No counsellor named.
     Census 2021, Maple Ridge (CSD 5915075): 11,880 of 37,810 commuters
     (31.4%) left for work between 5:00 and 6:59; 27.1% commuted 45 minutes
     or more; 31,710 (83.9%) drove themselves. Cited on the hub. */
  {
    city: 'maple-ridge', service: 'anxiety-counselling',
    angle: 'When three in ten workers leave home between five and seven in the morning, anxiety takes the hours that were meant for sleep.',
    body: [
      'An early start on the Lougheed or the West Coast Express moves the whole day forward, and the worry that has nowhere to go in a working day tends to arrive at the one point there is quiet: lying awake, running tomorrow’s drive, tomorrow’s meeting, tomorrow’s everything. Short sleep then makes the next day’s anxiety louder, and the loop tightens without anyone deciding it should.',
      'Anxiety work here often starts with that loop rather than with the worry itself: what keeps the mind running at night, what an early alarm does to it, and which parts of the day can absorb what currently waits for bedtime. A session from home, with no drive added to an already long day, leaves room for the sleep this is all about.',
    ],
    faqs: [
      { q: 'Is lying awake worrying a reason to see a counsellor?', a: 'Yes. Night-time worry is one of the commonest ways anxiety shows itself, and it responds to the same work as daytime anxiety. If sleep is the main complaint, it is worth mentioning to a family doctor as well, so anything medical is not missed.' },
      { q: 'I only notice it on the drive. Does that count?', a: 'It does. Anxiety that rises in traffic, on a bridge or in the last kilometre before work is specific enough to work on directly, and knowing exactly where it starts is a useful place to begin rather than a trivial one.' },
    ],
  },

  {
    city: 'maple-ridge', service: 'depression-counselling',
    angle: 'More than a quarter of commuters here spend forty-five minutes or longer getting to work, and a low mood talks loudest on that drive.',
    body: [
      'More than eight in ten Maple Ridge commuters drive themselves to work. That is often a long stretch of the day with no one to talk to and nothing to do but think, and for someone whose mood has been sliding, the car is where the familiar lines get rehearsed: what is wrong with me, why bother, nothing changes. The drive home can feel like the worst part of the day without it being obvious why.',
      'Counselling for depression here pays attention to those hours, not only to the hour in the session. What gets rehearsed on the bridge, what the arrival home looks like, and what small change to the drive or the first ten minutes back is possible this week are ordinary starting points. None of it needs another trip across the river to begin.',
    ],
    faqs: [
      { q: 'I am functioning fine at work. Can it still be depression?', a: 'Yes. Plenty of people hold a demanding job together and come apart in the gaps: the drive, the days off, the time after the children are in bed. Being able to function at work is not evidence that nothing is wrong.' },
      { q: 'What if I am too tired after the commute for a session?', a: 'That is a common and fair worry. A session at a point in the week with less travel in it, or from a parked car before the drive home, are both workable, and the consultation is the place to work out which.' },
      { q: 'Should I see my doctor as well?', a: 'It is worth it. A family doctor or nurse practitioner can rule out physical causes and discuss medication if you want that conversation. Counselling and medical care run alongside each other rather than instead of each other.' },
    ],
  },

  {
    city: 'maple-ridge', service: 'couples-therapy',
    angle: 'When one partner keeps the train’s timetable and the other a shift roster, shared waking hours become scarce.',
    body: [
      'Ridge Meadows mixes two kinds of working week: commuters who leave early and return late on the West Coast Express or the bridges, and shift workers at the hospital and the two correctional centres whose rosters move. A couple with one of each can go days sharing a house and passing in the kitchen, and an in-person couples appointment needs both of them in the same place at the same time, plus the travel either side.',
      'Video lets the session sit inside the overlap there is, from the same couch, without anyone driving to it. It also helps with what the overlap is used for: when time together is that short it tends to fill with logistics and grievance, and a structured session makes room for the conversation that otherwise keeps getting postponed.',
    ],
    faqs: [
      { q: 'We barely see each other awake. Is that a reason to start or a reason to wait?', a: 'Usually a reason to start. Couples often wait for a calmer month that does not arrive. Starting with fewer, well-planned sessions fits a tight schedule better than waiting for a regular weekly slot to appear.' },
      { q: 'Could one of us speak Punjabi in a couples session?', a: 'Not at present. Couples sessions here are held in English or Tagalog. If either of you would rather work through your own side of things in Punjabi, individual counselling is offered in Punjabi, English or a mix of the two.' },
      { q: 'One of us is more willing than the other. Does that matter?', a: 'It is very common and not a reason to stay away. The reluctance is part of what gets talked about, openly, and a first session that is mostly about whether to continue is a reasonable first session.' },
    ],
  },

  /* BC Government, correctional centres list, read 2 Oct 2026: Fraser
     Regional Correctional Centre and Alouette Correctional Centre for Women
     are in Maple Ridge. WorkSafeBC, eligible occupations under the mental
     disorder presumption, read 2 Oct 2026: includes correctional officer,
     nurse and health care assistant; diagnosis by a psychiatrist or
     psychologist is a condition of the presumption. */
  {
    city: 'maple-ridge', service: 'trauma-therapy',
    angle: 'Two provincial correctional centres sit in Maple Ridge, and what happens inside them comes home on the same roads.',
    body: [
      'Corrections work involves violence, self-harm, overdoses and threats, often repeated and rarely talked about afterwards beyond a debrief. The effect is usually cumulative rather than tied to one event: sleep that does not settle, a shorter fuse at home, a watchfulness that does not switch off in a grocery store. Hospital staff on the emergency and psychiatric units carry a version of the same load.',
      'A practical point is often missed. In BC, a mental disorder arising from traumatic events at work has a claim route through WorkSafeBC, and for correctional officers, nurses and several other occupations there is a legal presumption that it is work-related once a psychiatrist or psychologist has made the diagnosis. Counselling can start before any of that is settled, and from home rather than in a waiting room where colleagues might be sitting.',
    ],
    faqs: [
      { q: 'I work corrections. Do I have to describe incidents in detail?', a: 'No. Trauma work does not depend on retelling every incident. What happened can be named in outline, and the work focuses on what it is doing to you now. Confidentiality and its legal limits are explained before anything else.' },
      { q: 'Is there a claim route for a psychological injury from work?', a: 'Yes. WorkSafeBC accepts claims for mental disorders arising from work. For correctional officers, nurses, health care assistants and some other occupations, a mental disorder diagnosed by a psychiatrist or psychologist after exposure to a traumatic event at work is presumed to be work-related. The resources section has a page on psychological injury claims that sets out the steps.' },
      { q: 'It was years ago. Is it too late to deal with it now?', a: 'No. People often come years after the event, once the effects have outlasted the explanation that it would pass. That is common rather than late.' },
    ],
  },

  {
    city: 'maple-ridge', service: 'emdr-therapy',
    angle: 'EMDR can leave you tired and raw, and from Ridge Meadows a clinician elsewhere means a bridge on the drive home.',
    body: [
      'EMDR asks a lot of the nervous system. Processing sessions often end with people tired, a little unsettled, or simply wanting quiet, and the advice is usually to keep the rest of the day gentle. For somebody in Maple Ridge or Pitt Meadows whose EMDR clinician turned out to be over the Golden Ears or Pitt River Bridge, the rest of the day starts with a drive through traffic.',
      'Video changes that end of the session. Processing happens from home, the closing phase that settles you before the session ends is the same as in a room, and afterwards you are already where you would want to be. The pool of trained clinicians also stops being whoever is within a bridge of Haney.',
    ],
    faqs: [
      { q: 'What do I need at home for EMDR by video?', a: 'A private room, a stable connection, and a device with a screen large enough to follow a moving point comfortably; a laptop is better than a phone. If following on screen does not suit you, self-administered tapping is an established alternative, and both are practised before any processing begins.' },
      { q: 'Should I plan anything for after a session?', a: 'Keep the rest of the day light where you can. Most people feel tired rather than distressed, and the preparation phase includes ways to settle that you can use afterwards. If a session lands harder than expected, that is raised at the next one and the pacing is adjusted.' },
    ],
  },
  /* ---- VERNON, 2 Oct 2026 ----------------------------------------------
     Five arguments from one fact, that Vernon is the centre of a catchment
     of small towns: being seen at the door (anxiety), the drive depression
     cannot face (depression), the 2021 White Rock Lake fire (trauma), no
     neutral counsellor where everyone knows everyone (couples), and the
     preparation stage that needs steady attendance (EMDR). Couples and EMDR
     book Camille only, so their language answers do not offer Punjabi.
     Trauma copy names no EMDR, because Savneet's card appears on it. No
     counsellor named. Sources are on the hub. */
  {
    city: 'vernon', service: 'anxiety-counselling',
    angle: 'Where a small town knows your vehicle, worry about being seen at a counsellor’s door keeps anxiety untreated.',
    body: [
      'Anxiety tends to make people overestimate how closely they are being watched, and in Lumby, Armstrong or Enderby the estimate is not always wrong. A vehicle outside a small practice gets noticed. That combination, an anxious mind and a genuinely visible appointment, is one of the quieter reasons people across the North Okanagan put off starting for years.',
      'A session by video takes the doorway out of the decision. The work itself is the ordinary work of anxiety counselling: understanding the pattern, practising a different response to it, and doing that from a room where nobody sees you arrive. For anyone aged 12 to 24, CMHA Vernon’s free youth drop-in counselling is a reasonable first step as well.',
    ],
    faqs: [
      { q: 'Does anyone in town have to know I am in counselling?', a: 'No. There is no office, no waiting room and no reception desk, so there is nothing for anyone to notice. Receipts for an extended health claim come to you, and what you tell anybody else is your decision.' },
      { q: 'My anxiety changes with the seasons. Is that worth mentioning?', a: 'Yes. A change that follows the time of year is useful information rather than a coincidence to set aside, and it shapes how the work is paced across the year, including where a planned pause makes sense.' },
      { q: 'I study at Okanagan College in Vernon. Where should I start?', a: 'With what is free: CMHA Vernon’s youth drop-in counselling covers ages 12 to 24, which includes many students. If you want something longer or more structured than a drop-in offers, private sessions by video fit around a timetable without a trip off campus.' },
    ],
  },
  {
    city: 'vernon', service: 'depression-counselling',
    angle: 'Depression shrinks how far a person can face travelling, and outside Vernon the nearest appointment is already a drive.',
    body: [
      'One of the first things low mood takes is the energy for errands, and an appointment in another town is an errand with a highway attached. From Cherryville, Lumby or Enderby, a regular session in Vernon or Kelowna asks for exactly the effort depression has removed, which is why the people who most need steady sessions are often the first to stop going.',
      'Video changes the arithmetic rather than the work. The session comes to the kitchen table, it needs no clear road and no free afternoon around it, and missing one because the drive felt impossible stops being part of the pattern. What remains is the work itself: noticing what has narrowed, and widening it again at a pace that can be kept.',
    ],
    faqs: [
      { q: 'I barely have the energy to get to work. Is counselling realistic right now?', a: 'Often that is the right time rather than the wrong one. A video session asks for fifty minutes and a private room, and starting slowly, with sessions spaced further apart at first, is a legitimate plan rather than a half measure.' },
      { q: 'Should I see my doctor as well?', a: 'It is worth doing. A family doctor can check for physical contributors and talk through medication if that is something you want to consider. Counselling runs alongside that and needs no referral to start.' },
      { q: 'Is there public help in Vernon too?', a: 'Yes. Interior Health’s Vernon Mental Health and Substance Use Centre is the public route, and anyone can self-refer through 310-MHSU (6478). Staying on a public list while seeing someone privately costs nothing; the two run side by side.' },
    ],
  },
  {
    city: 'vernon', service: 'trauma-therapy',
    angle: 'The 2021 White Rock Lake fire destroyed homes on the Okanagan Indian Band reserve and the northwest shore of Okanagan Lake.',
    body: [
      'People who lost homes, who were evacuated, or who spent that summer watching the smoke across the lake each came away with something different, and many have since filed it under “everybody went through it”. That phrase does a lot of work in the North Okanagan. It turns a real event into something that feels self-indulgent to mention.',
      'Trauma counselling does not require the event to have been the worst in the region. It starts with what still happens now: the smell of smoke, a phone alert, a summer that cannot be relaxed into. Those responses are understandable and workable, and the work can begin without going back through every detail of what happened.',
    ],
    faqs: [
      { q: 'Our house was not lost. Does it still count?', a: 'Yes. Evacuation, days of not knowing, and helping other people through their losses are experiences in their own right, and whether your own address survived is not what decides how much they weigh.' },
      { q: 'Is it too late to talk about something from 2021?', a: 'No. Time passing does not settle a response that is still active. What matters is whether it shows up now, not how long ago it happened.' },
      { q: 'Can I see someone from outside the community?', a: 'Yes, and in a small place that is often the reason to work by video. Nobody local is involved, and the practice has no connection to any employer or local agency.' },
    ],
  },
  {
    city: 'vernon', service: 'couples-therapy',
    angle: 'In a small community, finding a couples counsellor neither partner knows socially is harder than it sounds.',
    body: [
      'Couples work depends on both people feeling the room is neutral. In Armstrong, Lumby or Coldstream, the local options can include someone who knows a sister-in-law, coaches a child, or went to school with one of you. Even when nothing is ever said, one partner can feel the other arrived with home advantage, and the work stalls on that.',
      'Where a farm or a family business is involved, the relationship is also a partnership with payroll, and the argument about the books is often the same argument as the one about the marriage. A counsellor from elsewhere in British Columbia, seen by video from your own kitchen, starts with no history on either side.',
    ],
    faqs: [
      { q: 'Can we each join from a different place?', a: 'Yes. Partners can join from the same room or from separate ones, which helps when one of you works away for stretches or the house is never quiet enough for both.' },
      { q: 'Is couples counselling available in Punjabi?', a: 'No. Couples sessions run in English or Tagalog for now. If one of you would rather talk on your own in Punjabi, individual counselling is offered in Punjabi, English or a mix.' },
      { q: 'We run a business together. Is that something to bring?', a: 'Yes. When work and home share the same two people, the business is part of the relationship rather than a separate topic, and it belongs in the room alongside everything else.' },
    ],
  },
  {
    city: 'vernon', service: 'emdr-therapy',
    angle: 'EMDR depends on steady preparation sessions, and from the edges of the North Okanagan steady attendance is the hard part.',
    body: [
      'EMDR is not only the processing sessions people read about. It begins with history-taking and preparation, building the skills to stay steady before any memory is approached, and that stage depends on regular contact. If the trained practitioner with an opening is in Kelowna, someone in Lumby or Enderby is signing up for a long drive before the work proper has started.',
      'By secure video the preparation and the processing happen in the same private room each time, and the counsellor no longer has to be one of the few trained practitioners within driving distance of the North Okanagan. On screen, the bilateral part is usually following a dot with your eyes or tapping your own shoulders, rehearsed in preparation before it is used on anything difficult.',
    ],
    faqs: [
      { q: 'How do I know a counsellor is actually trained in EMDR?', a: 'Ask directly and expect a specific answer: where the training was completed and how long it has been part of the work. Each counsellor’s profile lists her training, and EMDR is offered only by a counsellor trained in it.' },
      { q: 'Can EMDR work if I share a house with family?', a: 'Yes, with planning. A closed door, headphones, and a few minutes after the session to settle before rejoining the household are the usual arrangements, and they are worked out during preparation.' },
      { q: 'Can EMDR be done in Punjabi?', a: 'Not at the moment: EMDR currently runs in English or Tagalog. Individual counselling, which does not include EMDR, is available in Punjabi, English or both.' },
    ],
  },  /* ---- MISSION, 2 Oct 2026 ---------------------------------------------
     Five arguments from one fact, that Mission is counted with the Fraser
     Valley while much of its working life happens outside it: being an hour
     from home if something goes wrong (anxiety), a winter working day that
     starts and ends in the dark (depression), the federal institution in the
     district (trauma), partners working in different regions (couples), and
     EMDR as the one session not to take from a parked car near work (EMDR).
     Census Profile, Mission CSD 5909056: commuting 60 minutes and over
     3,200 of 17,320 (18.5%); 5,050 of 13,015 with a usual place of work
     worked in a different census division. Cited on the hub. No counsellor
     is named and no language is offered here. */
  {
    city: 'mission', service: 'anxiety-counselling',
    angle: 'Nearly one Mission commuter in five works an hour or more from home, and anxiety can fasten on exactly that distance.',
    body: [
      'Being a long way from home is simply part of the working day for many Mission households, and for an anxious mind it turns into a question that keeps being asked: what if the school calls, what if a parent falls, what if the highway closes and there is no getting back. The phone gets checked, the route home gets rehearsed, and a distance that was only part of the job starts to feel like a risk taken every morning.',
      'Counselling for anxiety works on that pattern directly: how much of the worry is a real contingency that can be planned for once, and how much is the checking itself keeping the alarm switched on. Sessions by video add no further trip to the week and can sit on a day spent at home, so the work does not depend on being in one particular place either.',
    ],
    faqs: [
      { q: 'Is it anxiety, or just being sensible about the distance?', a: 'Often both, which is why it is hard to tell. A sensible plan gets made once and then left alone; anxiety asks the same question again an hour later. Sorting one from the other is a reasonable thing to bring to a first session, and nobody needs a label for it beforehand.' },
      { q: 'Can I have a session parked near work before driving home?', a: 'Parked, yes, if the car is private and the connection holds. Never while driving. Some people sit for a few minutes afterwards before setting off, and building that in is reasonable.' },
    ],
  },
  {
    city: 'mission', service: 'depression-counselling',
    angle: 'For a Mission commuter an hour or more from work, a winter working day can begin and end in the dark.',
    body: [
      'Mission sends a large share of its workers out of the Valley, and around the shortest days a long commute can mean leaving before sunrise and arriving home after sunset. Daylight, movement and unhurried time with the people at home are among the first things depression wears away, and a schedule like that removes them before a low mood has even had the chance.',
      'Depression then tends to argue that what is missing is the person’s own fault. Separating the two is a large part of the early work: how much of the flatness is the condition, and how much is a season with no light in the week. Sessions by video, with no extra trip either side, at least stop counselling from becoming one more thing taken out of that time.',
    ],
    faqs: [
      { q: 'Is it the winter, or is it depression?', a: 'It can be either, or one on top of the other. A low that lifts every spring has a recognised pattern of its own, and a family doctor is worth seeing about it. A low that stays whatever the season is worth bringing to counselling as it is, and neither question has to be settled before you book.' },
      { q: 'Do I need a diagnosis or a doctor’s referral first?', a: 'No. Seeing a Registered Clinical Counsellor privately needs no referral and no diagnosis. If a leave from work or a disability claim needs a formal assessment, that comes from a family doctor or nurse practitioner, and the two can run in parallel rather than one waiting on the other.' },
    ],
  },
  {
    city: 'mission', service: 'trauma-therapy',
    angle: 'Mission Institution brings federal corrections work into the district, and its incidents do not stay behind at the end of a shift.',
    body: [
      'Mission Institution is a Correctional Service Canada site with medium- and minimum-security units, and the people who work there live with a particular exposure: incidents that are sudden, sometimes violent, and followed by going straight back to the unit. Many cannot point to the one incident that changed things, only to a time after which sleep, temper or patience at home did not come back. The page for first responders and corrections staff sets out what tends to come up.',
      'Anyone whose work puts them close to other people’s worst days, in a hospital, an ambulance or a patrol car, carries a version of the same load, and from Mission they often carry it home over a long drive. With no office anywhere there is also no waiting room to share with people from work, which in a district of about 41,500 is a real consideration.',
    ],
    faqs: [
      { q: 'Does it have to be one serious incident to count?', a: 'No. Corrections work more often leaves its mark through accumulation: many smaller incidents, few of them talked about afterwards. A pattern that has built up over years is as legitimate a reason to start as a single event, and it is worked with in much the same way.' },
      { q: 'Would anyone at work know I am seeing someone?', a: 'Not from this practice. There is no local office, nothing is reported to an employer, and confidentiality has narrow legal limits that are set out on the standards page.' },
    ],
  },
  {
    city: 'mission', service: 'couples-therapy',
    angle: 'With one partner working outside the Valley and the other in town, a Mission couple can go days without a shared free hour.',
    body: [
      'Couples work needs both people at once, and in Mission that is harder than it sounds. One partner is at work beyond the Valley until late in the working day, the other is in town with the school pickup, and an office appointment in either place means one of them makes a trip the other does not. That is a logistics problem, and it is worth solving before the first session rather than during it.',
      'By video, each partner can join from wherever they are, including from two places when one is still at work. Sitting side by side is better when it can be managed, but a session held apart is better than one cancelled, and keeping the rhythm going is a large part of what lets the work build.',
    ],
    faqs: [
      { q: 'Can one of us join from work?', a: 'Yes, if there is a private room and headphones. It works best occasionally rather than as the pattern, and the counsellor can help you work out which sessions are better done side by side.' },
      { q: 'We live out past Hatzic and the signal is patchy. Can video still work?', a: 'Usually, with some planning. Audio holds up on far less bandwidth than video, so a session can carry on with cameras off for a while, and deciding beforehand who calls whom if the link fails keeps a dropout from ending the conversation. Sitting together by the stronger signal is the simplest fix of all.' },
    ],
  },
  {
    city: 'mission', service: 'emdr-therapy',
    angle: 'EMDR is the session a Mission commuter should not take from a parked car, so it gets planned around a day at home.',
    body: [
      'Much of the advice for Mission assumes a session can happen wherever the day puts you: a room near work, or a car before the drive back. EMDR is the exception. Processing can leave a person tired, raw or unusually quiet for the rest of the day, and the end of each session is kept for settling before it closes. That sits badly with an hour on the Lougheed straight afterwards.',
      'In practice that means choosing the days spent at home and protecting them. The phases stay where they always are, history and preparation before any processing, with eye movements or tapping set up for a screen, and when the session ends you are already in the room where the grounding was practised.',
    ],
    faqs: [
      { q: 'Can I do EMDR from my car near work?', a: 'It is better not to. EMDR suits a private room you can stay in afterwards, so people commuting out of Mission generally keep these sessions for a day at home and use the car, if at all, for ordinary sessions.' },
      { q: 'I only have one day a week at home. Is that enough for EMDR?', a: 'Often, yes. The sessions that ask most of you are the processing ones, and those are the ones to keep for the day at home; earlier preparation work can be arranged with your counsellor around the rest of the week. Spacing is agreed with you and reviewed as you go.' },
    ],
  },

  /* ── Courtenay, 2 Oct 2026: a posting town around a rescue base ── */
  {
    city: 'courtenay', service: 'anxiety-counselling',
    angle: 'The Comox Valley’s public route starts with a walk-in screening; structured anxiety work needs the same slot for weeks.',
    body: [
      'Island Health’s Comox Valley team is built for first contact: walk-ins welcome, screening and assessment with the nursing team, and a connection onward, with no referral needed. That is the right shape for a bad week and a sensible first step for almost anything. It is a different shape from the work an established anxiety pattern usually needs.',
      'Anxiety that has settled into a pattern, panic, constant checking, a dread that arrives before the day does, is usually approached through structured work done in sequence: understanding the cycle, practising against it, reviewing what happened in between. That needs continuity with one person more than it needs proximity, and continuity is what video protects in a valley where schedules and addresses move.',
    ],
    faqs: [
      { q: 'Should I try the walk-in service first?', a: 'If you have not been, it is a reasonable first step and it costs nothing. Starting private counselling does not remove you from Island Health’s services, and some people use the public assessment to get clearer on what they need before choosing ongoing work.' },
      { q: 'My anxiety is mostly about an upcoming move. Is that worth counselling?', a: 'Yes. Anticipatory anxiety about a posting, a new job or a family upheaval is ordinary and workable, and it is easier to work on before the move than in the middle of the boxes. Sessions continue after a move within British Columbia.' },
      { q: 'Does anyone at the base find out?', a: 'Not from this practice. It is independent of the Canadian Armed Forces, sits outside the chain of command, and reports nothing to a unit, a medical officer or a supervisor. Confidentiality has narrow legal limits, and those are explained in the first session.' },
    ],
  },
  {
    city: 'courtenay', service: 'depression-counselling',
    angle: 'In a posting town, the partner who followed starts again from nothing while the member walks into a ready-made unit.',
    body: [
      'Military families arrive in the Comox Valley on a posting and leave on the next one. The serving member arrives into a squadron, a role and colleagues on the first day. The partner who followed often arrives into none of that: a career paused or restarted, friendships to rebuild, children to settle, and a valley whose social circles formed long before they got here.',
      'That isolation is easy to mistake for an adjustment period that should pass on its own, and sometimes it does. When it does not, a low mood that has outlasted the first winter is worth treating as depression rather than as a failure to settle in, and the work does not have to restart if the next posting arrives first.',
    ],
    faqs: [
      { q: 'I am not in the military, just married to it. Is this for me?', a: 'Yes. The partner who followed a posting is often the one carrying the most change with the least structure around it. Member and Family Assistance Services also serves families for short-term support, and private counselling can run alongside it or after it.' },
      { q: 'How do I tell depression from a hard move?', a: 'Duration and spread are the usual guide: a low that has lasted weeks rather than days, and has reached sleep, appetite, interest or concentration rather than staying attached to the move itself. A physician can assess it medically; counselling does not depend on a diagnosis.' },
    ],
  },
  {
    city: 'courtenay', service: 'trauma-therapy',
    angle: 'The valley is home to the west coast’s primary air rescue unit, and rescue work rarely leaves only one memory behind.',
    body: [
      'From Comox, search-and-rescue crews cover British Columbia, the Yukon and hundreds of nautical miles of ocean, and the base is the centre for search-and-rescue training, home to the Canadian Forces School of Search and Rescue. The people who fly, and the people who support them, see the hard end of other people’s worst days repeatedly, debrief, and go back on the roster.',
      'What builds up from that work is often a set of specific calls rather than one defining event: a hoist that went wrong, a search that ended badly, a voice on the radio. Alongside them, sleep changes and home gets harder to be present in. Trauma work begins by working out which of those memories are still active, and paces from there. The same pattern is common among paramedics, hospital staff and firefighters.',
    ],
    faqs: [
      { q: 'My partner flies search and rescue. Can I come on my own account?', a: 'Yes. Living alongside rescue work, the call-outs, the absences, the things that are not talked about at dinner, carries its own weight, and a partner can have individual sessions in their own right without the member being involved.' },
      { q: 'Can I start with what is happening at home rather than the incidents?', a: 'Yes. Sleep, irritability and distance at home are often where people begin, and the incidents can wait until there is enough stability to look at them. Pacing is agreed with you, not imposed.' },
      { q: 'Is this connected to CF Health Services or Veterans Affairs?', a: 'No. This is an independent private practice. It does not replace care through the Canadian Armed Forces or Veterans Affairs Canada, and nothing is shared with either, within the narrow limits set out on the standards page.' },
    ],
  },
  {
    city: 'courtenay', service: 'couples-therapy',
    angle: 'In a posting town, one partner’s career usually decides where both of them live, and for how long.',
    body: [
      'Postings, long patrols and courses away from home put a particular structure on a relationship: one career sets the address, the other bends around it, and the household reorganises every time somebody leaves or comes back. Couples in the Comox Valley often arrive partway through that cycle, still carrying the last move.',
      'Those strains get read as incompatibility when much of them is structural. Couples work that starts by naming the structure, who gave up what, and what the next posting is likely to ask of each of you, tends to be more useful than another round on the latest argument. By video, it does not stop when the address changes within BC.',
    ],
    faqs: [
      { q: 'Can we keep going while one of us is away on a course?', a: 'Where both partners are physically in British Columbia, each with a private room and a connection, yes: joining from two locations is workable. Both need to be in the province at the time of the session, so a longer course outside it is planned around rather than through.' },
      { q: 'A posting is coming. Is it too late to start?', a: 'No. The months before a move are often when the questions are sharpest: whose work gives, and what the next place costs each of you. Moving within British Columbia does not end the work.' },
    ],
  },
  {
    city: 'courtenay', service: 'emdr-therapy',
    angle: 'EMDR needs one clinician from preparation through processing, and in a posting town a move used to end it midway.',
    body: [
      'EMDR is not a single technique applied in one session. It runs in phases, history and preparation first, then processing, then review, and the preparation is what makes the processing safe. Interrupt it halfway and the honest advice is usually to rebuild that groundwork with whoever comes next.',
      'In a valley this size, the number of EMDR-trained clinicians taking new clients at any moment can be small, and the alternative has been a drive down-Island and a sailing. By secure video the work continues with the same clinician whether you stay in Courtenay, move to Esquimalt or spend a month in Prince George, as long as you are in British Columbia.',
    ],
    faqs: [
      { q: 'Do I have to describe every call in detail?', a: 'No. EMDR works with a memory briefly held in mind rather than a full retelling, and much of the detail can stay unspoken. What is shared, and in what order, is agreed during preparation.' },
      { q: 'Is EMDR only for one big event?', a: 'No. It is used for single incidents and for a run of related ones, which is the more common pattern in rescue and emergency work. Which memories to start with is decided together during preparation rather than assumed.' },
    ],
  },
  /* ── Langford, 2 Oct 2026: a commuter city of recent arrivals ── */
  {
    city: 'langford', service: 'anxiety-counselling',
    angle: 'When anxiety attaches to driving, a Victoria appointment puts its hardest part on Highway 1, on both sides of the session.',
    body: [
      'For some people on the West Shore, anxiety has a route attached. The trip into Victoria runs along a stretch of Highway 1 that is prone to congestion and under construction until late fall 2027, and for somebody whose anxiety rises in traffic, on bridges or in merging lanes, the drive to an anxiety appointment can be the hardest part of the week.',
      'Working from home does not avoid that problem; it sets it aside so the work can start. Avoidance can be looked at directly, at a pace you agree, rather than rehearsed every week on the way to a session. If driving is the fear itself, it becomes part of the plan instead of the obstacle to reaching one.',
    ],
    faqs: [
      { q: 'Can anxiety about driving be worked on by video?', a: 'Yes. Driving anxiety is usually worked on through gradual, agreed steps between sessions, with the session used to plan them and to review how they went. None of that requires driving to the session, and some people find it easier to begin when they do not have to.' },
      { q: 'I get anxious on video calls too. Is that a problem?', a: 'It is common, and worth saying on the free consultation. The session opens from a link, the camera can stay off for part of it, and the first minutes can be spent getting comfortable with the setup rather than going straight into the hardest material.' },
    ],
  },
  {
    city: 'langford', service: 'depression-counselling',
    angle: 'In a city where more than four in ten residents moved in within five years, low mood can arrive with the move.',
    body: [
      'Langford is full of recent arrivals: more than four in ten residents aged five and over were living in another municipality five years before the 2021 Census. A move meant as a fresh start can quietly put somebody further from the people they used to see, and the low mood that follows tends to be blamed on the commute, the house or the weather rather than recognised for what it is.',
      'Depression after a move is easy to dismiss because the move was chosen. That is not evidence against it. Counselling treats it as a condition worth working on rather than a verdict on the decision to come here, and it does not need a local network to be in place before it can start.',
    ],
    faqs: [
      { q: 'I chose to move here. Can I still be depressed about it?', a: 'Yes. Choosing a change does not protect anyone from the losses that come with it: friends who are now a long drive or a ferry away, routines that did not survive the move, a commute that took the time things used to happen in. Those are ordinary contributors to depression, not ingratitude.' },
      { q: 'I have not found a family doctor since moving. Should I see one as well?', a: 'Often it is worth it, particularly if sleep, appetite or energy have changed for weeks. A counsellor does not diagnose or prescribe, and says plainly when a physician should be involved. Until you have a doctor of your own, 8-1-1 is a reasonable first call.' },
    ],
  },
  {
    city: 'langford', service: 'trauma-therapy',
    angle: 'The West Shore’s public front door opens with a same-day single session; trauma work usually needs a longer, paced arc.',
    body: [
      'Island Health’s Western Communities team is a real strength here: a phone call reaches it directly, and it offers a same-day, single-session counselling appointment. For a first conversation or a hard week, that is the right door. Trauma is often different. The work tends to run over months, at a pace the person sets, and it depends on one counsellor holding the thread.',
      'Private counselling can run alongside the public route rather than replacing it. Staying connected to Island Health costs nothing, and a trauma-focused course by video adds the continuity a single session is not designed to provide, without a drive into Victoria to reach it.',
    ],
    faqs: [
      { q: 'Should I call Island Health first or start privately?', a: 'Either order works, and many people do both. The Western Communities team can assess you and connect you to public services such as psychiatry or substance use support, which private counselling does not replace. Private trauma work adds a consistent counsellor and a pace you set.' },
      { q: 'Does the first session mean going back over what happened?', a: 'No. Trauma work starts with safety and stability, and what you share, and when, is yours to decide. Many people begin without going into the event at all, and the counsellor checks in on pacing as the work goes on.' },
    ],
  },
  {
    city: 'langford', service: 'couples-therapy',
    angle: 'Two commutes and young children can leave West Shore couples very little time in the same room, let alone an office.',
    body: [
      'Langford is younger than the region around it, with a larger share of children than Greater Victoria as a whole, and six in ten of its residents with a regular workplace commute to another municipality. For a couple that adds up to two schedules, one of them often on Highway 1, and childcare that has to be arranged before anyone can sit in a counsellor’s office together.',
      'Joining from home changes the arithmetic. The session starts once the children are settled and both partners are in the same house, rather than when two cars can meet somewhere in Victoria. Partners can also join from two places when one is still at work or away, which keeps a session that would otherwise be cancelled.',
    ],
    faqs: [
      { q: 'Can we do couples sessions from two different places?', a: 'Yes. Each partner joins the same secure session from their own device, which is often the only way a session happens at all when one of you is still at work or travelling. Joining together from one screen at home is just as common, and either can change from week to week.' },
      { q: 'What if one of us is more reluctant than the other?', a: 'That is the usual starting point rather than a problem. The first session is partly about what each of you wants from the work, and it is reasonable for the more reluctant partner to come to find out rather than to commit. The free consultation is a lower-stakes way to try that.' },
    ],
  },
  {
    city: 'langford', service: 'emdr-therapy',
    angle: 'An EMDR session can leave you tired or stirred up, and from Langford the drive home is Highway 1.',
    body: [
      'EMDR processing can leave people tired, emotional or unsettled for a while afterwards, which is why sessions close with grounding and why the time after them matters. From the West Shore, an EMDR appointment in Victoria means getting straight back onto a stretch of highway the Province itself describes as prone to congestion.',
      'By video, the quiet half-hour after a session happens at home. Langford also draws on the same finite Island pool of EMDR-trained clinicians that Victoria does; reaching the whole provincial pool means choosing the clinician whose training fits, rather than the one with the next opening down the highway.',
    ],
    faqs: [
      { q: 'Is it safe to do EMDR at home?', a: 'It can be, with preparation. Grounding and a safety plan are set up before any processing, the bilateral part uses what a screen allows, such as eyes following a target or tapping you do yourself, and the counsellor checks how you are before the session closes. A private room where you can rest afterwards matters more than where that room is.' },
      { q: 'Can we plan around how I feel after sessions?', a: 'Yes, and it is worth doing at the start. Many people book EMDR at a time with nothing demanding straight afterwards, and the counsellor checks how the days after a session went. You set the pace together, and it can change.' },
    ],
  },
  /* ── Cranbrook, 2 Oct 2026: Mountain clock, Pacific calendar, Elk Valley rosters ── */
  {
    city: 'cranbrook', service: 'anxiety-counselling',
    angle: 'In a regional centre this size, the anxious part of booking is often who might see you walk in.',
    body: [
      'Cranbrook has the hospital, the college and the services of a regional centre, and the social map of a much smaller place: the person at reception may coach your child’s team or work the opposite rotation to your partner. For anxiety specifically, that matters: worrying about being seen at the appointment is itself one of the reasons the appointment gets put off.',
      'A video session removes the building and the parked vehicle somebody might recognise outside it. There is a second, smaller anxiety it can remove too: the time. Open times are listed in Pacific time and Cranbrook is an hour ahead in every season, so the hour is translated once, before the first session, rather than worried about every week.',
    ],
    faqs: [
      { q: 'What if I am anxious about the video call itself?', a: 'That is common and worth saying at the start. The free 30-minute consultation is a first go at the format with nothing to decide at the end, and being on camera is never required: camera off for part of a session is an ordinary adjustment.' },
      { q: 'Does an anxiety session need a quiet house?', a: 'It needs somewhere private for fifty minutes, which is not always the house. A parked vehicle, a closed office or a room at a friend’s are all used, and choosing the place is part of planning the first session.' },
    ],
  },
  {
    city: 'cranbrook', service: 'depression-counselling',
    angle: 'Shift rotations and resort seasons both pull mood around the calendar, and the quiet stretch gets mistaken for the person.',
    body: [
      'Much of the East Kootenay works to a calendar that is not the ordinary one: mine rotations in the Elk Valley, and ski and summer seasons in Fernie, Kimberley and the Columbia Valley. Flatness that arrives on the days off, or in the shoulder months when the work and the people thin out, is easy to read as a personal failing when the pattern is doing a share of it.',
      'That does not make it less real, and it does not mean it lifts by itself. It means the work starts by mapping when the low points arrive, and then plans sessions to land before them rather than after, which is far easier when the session does not depend on a drive into Cranbrook.',
    ],
    faqs: [
      { q: 'Is this depression, or just the off-season?', a: 'Sometimes it is both, and the distinction matters less than whether it is getting in the way. A counsellor does not diagnose depression; if a physician should be involved, that is said plainly, and the two can run in parallel.' },
      { q: 'Can sessions follow my rotation rather than the calendar?', a: 'Yes. Blocks in the days off, a lighter pattern during the hitch, or a pause agreed in advance are all ordinary arrangements here.' },
    ],
  },
  {
    city: 'cranbrook', service: 'trauma-therapy',
    angle: 'Four steelmaking coal mines in the Elk Valley provide about 5,500 jobs, and an incident on site comes home with the crew.',
    body: [
      'Fernie, Sparwood and Elkford are the towns closest to those mines. Heavy equipment, haul roads and blasting carry real risk. When something goes wrong the formal response is a debrief, and then a crew goes back to work and later goes home to a town where everybody knows what happened.',
      'That last part is the difficult one. In a small community a serious incident becomes a shared story, and the person who was closest to it often ends up carrying the least-discussed version. A session with a counsellor outside the valley, from a private room, is somewhere that version can be said in full, at the pace you set.',
    ],
    faqs: [
      { q: 'Does anything from counselling reach the mine or my employer?', a: 'There is no reporting line from a private practice to an employer, a union or a safety office, so nothing goes to any of them. The narrow legal limits on confidentiality are set out on the standards page and walked through in the first session.' },
      { q: 'It was one incident, years ago. Is that too small for trauma therapy?', a: 'No. A single event that still produces a reaction now is the kind of thing trauma-focused work is built for, and the time since it happened does not close the door.' },
    ],
  },
  {
    city: 'cranbrook', service: 'couples-therapy',
    angle: 'A rotation in the Elk Valley and a home in Cranbrook make a relationship that runs on two calendars.',
    body: [
      'Couples here often live with one partner on a mine rotation and the other holding a job, children and a house to a different schedule. The handover days, the tired first night back and the conversation that never quite happens before the next hitch are structural, not evidence that either person stopped trying.',
      'Couples work that fits has to run on the days you are both available, and sometimes from two places at once. Video allows both: the two of you on one screen at home, or one partner joining from wherever in British Columbia the rotation has them, with the time translated once from Pacific to Mountain so neither of you is guessing.',
    ],
    faqs: [
      { q: 'Can my partner join from a different town?', a: 'Yes, if each of you is in British Columbia with a private room and a workable connection. Sessions with partners in two places are an ordinary arrangement, and the counsellor sets them up so neither person is a voice on a phone.' },
      { q: 'Which language are couples sessions in?', a: 'Couples sessions currently run in English or Tagalog. Individual counselling is available in more than one language, which the counsellor cards on this page show.' },
    ],
  },
  {
    city: 'cranbrook', service: 'emdr-therapy',
    angle: 'After an EMDR processing session from Cranbrook, you are already home, with no mountain pass to drive while it settles.',
    body: [
      'EMDR processing can leave a person tired or unsettled for the rest of the day, and the usual advice is to leave room after a session rather than go straight to work or a long drive. In the East Kootenay, an in-person specialist appointment can mean exactly that long drive afterwards, over a pass in winter. By video, the room you settle in is your own.',
      'EMDR is also the kind of specific training a regional private sector may hold one or two of, or none. By video the choice widens to clinicians trained in it anywhere in British Columbia, with the same preparation and pacing, and sessions an hour later on Cranbrook’s clock than the calendar shows.',
    ],
    faqs: [
      { q: 'Is EMDR by video as thorough as in a room?', a: 'The steps are the same: history, preparation, then processing. On video the bilateral stimulation is usually eye movements following a point on screen or tapping you do yourself, and it is practised before any processing starts.' },
      { q: 'What should I plan for after a processing session?', a: 'Some unstructured time if you can arrange it, rather than a shift or a drive. Being at home already makes that easier, and how you felt afterwards is reviewed at the start of the next session.' },
    ],
  },
  /* ── Campbell River, 2 Oct 2026: the end of one referral line and the start of another ── */
  {
    city: 'campbell-river', service: 'anxiety-counselling',
    angle: 'A federal end date for open-net salmon farming leaves farm households in Campbell River with a question nobody can answer yet.',
    body: [
      'Uncertainty of that kind is one of the ordinary ways anxiety takes hold: the mind rehearses the worst case at night, checks every update on the transition, and treats each rumour at the dock as settled. Counselling cannot settle the policy. It can work on the part that is yours, how the worry runs your sleep and your days, and how to plan for more than one outcome without living inside all of them at once.',
      'Island Health’s single-session walk-in in town is a sensible first step for a bad week. Anxiety that keeps coming back is usually worked on over a course of sessions with one person, and from Quadra, Sayward or Gold River a weekly appointment in town is a trip as well as an hour. By video it is the same fifty minutes each time, alongside the public service rather than instead of it.',
    ],
    faqs: [
      { q: 'Is one walk-in session enough?', a: 'Sometimes. A single session at Island Health’s walk-in costs nothing and can settle what kind of help fits. If it points to anxiety that needs ongoing work, private counselling is one way to do that work, and using one does not rule out the other.' },
      { q: 'My job is fine for now. Is it worth starting before anything changes?', a: 'Yes. Worry about what might happen is still worry, and it is easier to work on before a decision lands than in the middle of one. Nothing has to go wrong first for it to be worth a conversation.' },
    ],
  },
  {
    city: 'campbell-river', service: 'trauma-therapy',
    angle: 'Close calls on the water and in the woods come with the work, and the habit is to carry them quietly.',
    body: [
      'Commercial fishing, falling and fish-farm work all involve moments people do not forget: a line under tension, a tree that went the wrong way, a crewmate in the water. The culture around them in a working town is to get on with it, which is useful on the day and much less useful when the scene keeps coming back months later.',
      'Trauma counselling here starts with what is happening now, sleep, startle, avoiding the boat or the block, and works back from there at a pace you set. The first step is an ordinary individual session by video, with nobody at the dock or the yard any the wiser.',
    ],
    faqs: [
      { q: 'It happened years ago on a boat. Is it too late to deal with it?', a: 'No. What matters is whether it still shows up now, in sleep, in avoiding a place or a task, or in how quickly you are on edge, not how long ago it happened.' },
      { q: 'Would the company or the crew hear about it?', a: 'Not from this practice. Nothing goes to an employer without your written consent, and the legal limits on confidentiality are narrow and gone through in the first session. Whether you tell anyone on the boat or the block is your call.' },
    ],
  },
  {
    city: 'campbell-river', service: 'couples-therapy',
    angle: 'Boats, camps and farm sites take one partner away for weeks, so couples work has to fit the time both are home.',
    body: [
      'Plenty of Campbell River couples live a split calendar: one partner out on the water or at a remote site, one holding the house, and then a stretch together that has to absorb everything saved up from the time apart. The same argument tends to recur at the handover, which is often where a couple first notices that it is a pattern rather than a bad week.',
      'Structured, Gottman-informed couples work can be booked into the weeks you are both home, or held with each partner joining from a different place when one is away and has a private room and a steady connection. Both partners need to be in British Columbia at the time of the session.',
    ],
    faqs: [
      { q: 'Can my partner join from a work site?', a: 'Yes, if there is a private room and a connection that holds, and the site is in British Columbia. Sessions with partners in two places are workable, and some couples find a hard conversation easier that way rather than harder.' },
      { q: 'We only get a few weeks together at a time. Is that enough?', a: 'It can be. Sessions concentrated in the weeks at home, with something agreed to practise while apart, keep the work moving between blocks rather than starting over each time.' },
    ],
  },
  {
    city: 'campbell-river', service: 'emdr-therapy',
    angle: 'From Campbell River north, the EMDR question is often not who has an opening but who is within reach.',
    body: [
      'EMDR is a specific training, and a small private sector may hold a handful of people with it, or none taking new clients. From Campbell River the next pools are down-Island, in the Comox Valley, Nanaimo and Victoria, and from Port Hardy, Gold River or Cortes every one of those is a long trip to repeat for a weekly piece of work.',
      'By video the trip disappears and the choice widens to everyone in British Columbia trained in it. That matters more for EMDR than for most approaches, because fit with the clinician and steady continuity through the preparation phase do much of the work of making processing tolerable.',
    ],
    faqs: [
      { q: 'Can EMDR work over a patchy North Island connection?', a: 'It needs a connection steady enough to follow the moving point on screen, or to hear the counsellor while you tap. Testing the connection before the first processing session, and agreeing what happens if it drops, is part of preparation.' },
      { q: 'How much happens before the processing itself?', a: 'Usually some sessions of history, preparation and practising ways to settle yourself, so that processing starts from a stable footing. How many depends on you, and it is reviewed openly rather than fixed in advance.' },
    ],
  },
  {
    city: 'campbell-river', service: 'depression-counselling',
    angle: 'In a town built on forestry, fishing and fish farming, losing the work can mean losing the shape of a life.',
    body: [
      'Resource work in Campbell River is more than a pay cheque. It sets the year, the friendships and the sense of being good at something, and when a season does not come, a site closes or a body stops allowing the work, all of that goes at once. The low mood that follows is often read as a reasonable reaction to circumstances and left alone.',
      'Circumstance can start depression without being the whole of it. When the flatness outlasts the bad news, or sleep, appetite and interest stay down after things settle, it is worth treating as a condition in its own right. Sessions by video fit around job searching, retraining or a new rotation, and do not ask anyone to be seen walking into an office in town.',
    ],
    faqs: [
      { q: 'Isn’t this just a reaction to losing work?', a: 'It may have started that way. What matters is whether it has taken on a life of its own, which is worth establishing with somebody rather than assuming either way.' },
      { q: 'Does a physician need to be part of this?', a: 'If sleep, appetite or energy have changed for more than a couple of weeks, a visit is worthwhile: a physician or nurse practitioner can look for other causes and talk through medication. Counselling needs no referral, and it runs alongside medical care rather than replacing it.' },
    ],
  },
  {
    city: 'north-vancouver', service: 'anxiety-counselling',
    angle: 'On the North Shore, an appointment across the water is only as dependable as two bridges and a twelve-minute ferry.',
    body: [
      'Anxiety and the crossing feed each other here. A session downtown means the Lions Gate, the Ironworkers or the SeaBus at both ends, and for somebody whose anxiety already runs on what might go wrong, a stalled bridge or a missed sailing is not a neutral inconvenience. It becomes the thing the appointment is about, and then the appointment is the thing that gets cancelled.',
      'Taking the crossing out leaves the work itself. A session from Lower Lonsdale, Lynn Valley or West Vancouver spends its fifty minutes on the anxiety rather than on arriving, and what gets practised in the session is tried out in the same rooms where the worrying actually happens.',
    ],
    faqs: [
      { q: 'Is it worth starting if my anxiety is mostly about getting places?', a: 'Yes. Worry that has quietly narrowed where you go, a route avoided, a bridge planned around, a trip turned down, is ordinary material for this work. Starting from home means the first step is not also the hardest one.' },
      { q: 'Do I have to go through Central Intake first?', a: 'No. Vancouver Coastal Health’s Central Intake is the public route on the North Shore and asks for a referral from a family doctor or walk-in clinic. Counselling with a Registered Clinical Counsellor is booked directly, and staying on a public list at the same time costs nothing.' },
    ],
  },
  {
    city: 'north-vancouver', service: 'depression-counselling',
    titleName: 'Depression Therapy',
    angle: 'The North Shore’s public door asks for a doctor’s referral first, a sequence that depression makes hardest to start.',
    body: [
      'Vancouver Coastal Health’s Central Intake Team is the public route for adults on the North Shore, and it asks for a referral from a family doctor or a walk-in clinic before it gets in touch. Depression works directly against that kind of sequence: find a clinic, explain it to somebody new, then wait for a call. Each step is reasonable, and each is one more task on the days when tasks are the problem.',
      'Two shorter routes are worth knowing. The North Vancouver Urgent and Primary Care Centre treats low mood and depression as same-day concerns, and a private Registered Clinical Counsellor needs no referral at all. Neither replaces the other, and the second can begin while the first is still being arranged.',
    ],
    faqs: [
      { q: 'I have no family doctor. Can I still get help for depression here?', a: 'Yes. A walk-in clinic can make the referral to Central Intake, the Urgent and Primary Care Centre in North Vancouver offers same-day care for urgent concerns including low mood, and private counselling with an RCC needs no referral.' },
      { q: 'What if some weeks I cannot face a video call?', a: 'Say so rather than missing it quietly. The camera can stay off, and a pause agreed with a date to come back is a plan rather than a lapse.' },
    ],
  },
  {
    city: 'north-vancouver', service: 'trauma-therapy',
    angle: 'The Shore’s community psychiatric service is for serious or persistent illness, and the aftermath of one event rarely looks like either.',
    body: [
      'Vancouver Coastal Health describes its North Shore Adult Community Psychiatric Services as being for people with a serious or persistent mental illness, reached through a referral from a health-care provider. It leaves a large group in between: somebody shaken by a crash on the Upper Levels, a fall on a trail, or an emergency they were part of at work, who is still functioning, sleeping badly, and unsure their reaction counts.',
      'It counts. Trauma-focused counselling is built for that middle ground, and it needs neither a diagnosis nor a referral to begin. By video, the first conversation about what happened takes place somewhere you already feel settled, rather than after a drive past where it happened.',
    ],
    faqs: [
      { q: 'Is it trauma if nobody was badly hurt?', a: 'It can be. What matters is how the event has stayed with you: sleep, startle, avoiding a road or a trail, replaying it at odd moments. Those are reasons to talk to somebody whether or not anyone else would call it serious.' },
      { q: 'Do I have to describe what happened in detail straight away?', a: 'No. Early sessions are about steadiness and pacing, and how much is said, and when, is agreed with you rather than expected of you.' },
    ],
  },
  {
    city: 'north-vancouver', service: 'couples-therapy',
    angle: 'For a couple on Bowen Island, a mainland appointment means a sailing each way, together, on the ferry’s timetable rather than theirs.',
    body: [
      'Couples work already asks two people to be free at the same moment. On Bowen Island, which is reached by BC Ferries from Horseshoe Bay, it also asks them to fit that moment around a sailing in each direction, and in Lions Bay or Deep Cove around the drive to a bridge. The logistics can end the attempt before the relationship work has properly begun.',
      'On a small island there is a second cost, which is being seen. Sessions by video from home remove both, and they let a couple have the difficult conversation where they actually live it, and stay there afterwards, rather than sitting side by side on the ferry home.',
    ],
    faqs: [
      { q: 'One of us works across the bridge. Can we each join from where we are?', a: 'Yes. Two links or one shared screen both work, and one partner joining from a parked car or an office across the water is common enough to plan for on the free consultation.' },
      { q: 'Is it couples counselling if we are not sure we are staying together?', a: 'Yes. Working out whether to stay is one of the ordinary reasons to start, and the sessions do not assume an answer in either direction.' },
      { q: 'Can couples sessions be in Punjabi?', a: 'Not at the moment: couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi.' },
    ],
  },
  {
    city: 'north-vancouver', service: 'emdr-therapy',
    angle: 'Choosing an EMDR therapist by which side of Burrard Inlet they work on narrows an already specific search.',
    body: [
      'EMDR is chosen by name. People arrive already knowing what they are looking for, and the clinicians trained in it are a subset of a subset. Limiting that field to whoever practises on the Shore, or within an easy crossing of it, trades the right fit for the shortest trip, which is the wrong way round for a therapy that rests on trust and careful pacing.',
      'Processing also asks for regular sessions and a calm stretch afterwards. An appointment that ends in the queue for the Ironworkers or the SeaBus is a poor setup for that stretch. A session that ends at home, with nothing to drive, leaves room for it.',
    ],
    faqs: [
      { q: 'Do I need a referral from Central Intake for EMDR?', a: 'No. Central Intake is the public route on the North Shore and asks for a referral from a family doctor or walk-in clinic. EMDR with a private Registered Clinical Counsellor is booked directly, after a free 30-minute consultation.' },
      { q: 'What should I plan for after an EMDR session?', a: 'Some quiet time if you can arrange it. Processing can keep moving for a while after the session ends, and having nowhere to drive straight afterwards is one of the practical advantages of doing it from home.' },
      { q: 'Can EMDR sessions be in Punjabi?', a: 'Not at the moment: EMDR sessions currently run in English or Tagalog. Individual counselling is available in Punjabi.' },
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

/* WHERE A CONDITION CITY PAGE SENDS ITS READER UP — 1 Oct 2026.
 *
 * Anxiety, depression and trauma are conditions: they have city pages but no
 * service page of their own, and their up-link read "the anxiety counselling
 * page" while pointing at individual therapy. The province-level answer now
 * lives under its own heading on the service each condition books into, so
 * the link names the query and lands on that heading. The ids come from the
 * headings through headingId, so a retitle moves the link with it.
 * Trauma is the exception since 1 Oct 2026: it books into individual
 * counselling, and its province-level reading stays on the EMDR page, where
 * it was written. */
const up = (service: string, h2: string, label: string) => ({
  href: `/services/${service}#${headingId(h2)}`,
  label,
});
export const CONDITION_UPLINK: Record<string, { href: string; label: string } | undefined> = {
  'trauma-therapy': up('emdr-therapy', 'Online trauma therapy in BC, with and without EMDR', 'online trauma therapy across BC'),
  'anxiety-counselling': up('individual-therapy', 'Online anxiety counselling in BC', 'online anxiety counselling across BC'),
  'depression-counselling': up('individual-therapy', 'Online depression counselling in BC', 'online depression counselling across BC'),
};
