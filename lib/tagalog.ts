import { practitionersSpeaking } from './practitioners';

/* ============================================================================
   THE TAGALOG VERTICAL
   ----------------------------------------------------------------------------
   Built 1 Sep 2026, on the same shape as the Punjabi one, because the practice
   now has a counsellor who works in Tagalog.

   TWO KINDS OF PAGE, AND THE DISTINCTION IS THE WHOLE DESIGN.

     ENGLISH pages about Tagalog-speaking counselling  — publish now.
       /services/tagalog-counselling and /tagalog-counselling/<city>.
       Written in English, describing that sessions are available in Tagalog.
       This is how a great many people actually search: a second-generation
       Filipino-Canadian looking for a therapist their parent could talk to
       types "Tagalog speaking counsellor Surrey" in English. These pages
       carry no Tagalog prose that needs verifying, so nothing blocks them.

     TAGALOG pages, written in Tagalog — gated on TAGALOG_READY.
       /tagalog. Held until Camille has read every line, for the reason set
       out in lib/practitioner-tl.ts: clinical copy in a language the author
       does not speak natively is exactly where a correct translation still
       lands wrong.

   The Punjabi vertical works the same way — /services/punjabi-counselling is
   English, /punjabi is Punjabi — so this is a pattern the site already has
   rather than a new one invented for this.

   CITIES ARE CHOSEN, NOT GENERATED. Filipino communities in BC are real and
   unevenly distributed, and a page for a city with no particular Filipino
   population is a page with nothing true to say. The five below are the ones
   where the practice already has a city page AND where the community is
   substantial enough for the page to be about something.

   NO INVENTED CENSUS FIGURES, same rule as everywhere else on this site. The
   Punjabi city pages quote exact mother-tongue counts because those were
   looked up; nothing equivalent was verified here, so these pages are
   qualitative. If someone looks the numbers up later, they can be added — and
   they would strengthen the pages considerably.
   ========================================================================= */

export type TagalogCity = {
  slug: string;
  city: string;
  /** Why this city rather than a template. One sentence, checkable. */
  angle: string;
  body: string[];
  faqs: { q: string; a: string }[];
};

export const TAGALOG_CITIES: TagalogCity[] = [
  {
    slug: 'surrey',
    city: 'Surrey',
    angle: 'A large Filipino community, and a shortage of therapy in the language it speaks at home.',
    body: [
      'Surrey has one of the larger Filipino communities in British Columbia, and very little counselling delivered in Tagalog. What tends to happen instead is that the family member with the best English becomes the interpreter — for a parent, for a spouse, occasionally for a whole household — which works for a doctor\'s appointment and does not work at all for therapy.',
      'A session in Tagalog removes that. It also removes the part nobody talks about: the effort of translating a feeling into a second language while you are already struggling to name it in the first.',
    ],
    faqs: [
      { q: 'Can the whole session be in Tagalog?', a: 'Yes — in Tagalog, in English, or moving between the two as the conversation needs. Many people find themselves switching without planning to, and that is normal rather than a problem to fix.' },
      { q: 'Do I need to explain Filipino family expectations first?', a: 'No. Utang na loob, hiya, and the weight of what relatives will say are context rather than something to be taught from scratch at the start of a session.' },
      { q: 'Is there a counsellor in Surrey I could see in person instead?', a: 'There may be, and if an in-person option suits you it is a reasonable choice. What it usually costs here is availability — Tagalog-speaking counsellors in BC are few and carry waitlists. A virtual practice removes the travel and widens the field to the whole province.' },
    ],
  },
  {
    slug: 'vancouver',
    city: 'Vancouver',
    angle: 'A long-established Filipino community, and care that is easier to reach by video than across the city.',
    body: [
      'Vancouver\'s Filipino community is long-established and spread across the city rather than concentrated in one part of it, which means "a counsellor near me who speaks Tagalog" is frequently a contradiction. The nearest one who is taking clients may be a bus transfer and an hour each way.',
      'A great deal of Filipino employment in Vancouver is also shift-based — healthcare, care work, hospitality — and a standing weekday appointment does not survive a rotating roster. Evening sessions, with no travel either side, is the difference between attending and intending to.',
    ],
    faqs: [
      { q: 'I work shifts in healthcare. Can this fit?', a: 'Yes, and it is worth planning for at the start rather than discovering later. Booking block by block around a roster, with gaps between blocks, is an ordinary pattern here and pausing costs nothing.' },
      { q: 'Can I switch between Tagalog and English mid-session?', a: 'Yes. Most bilingual people do it without deciding to, particularly when something is difficult to say, and nothing about the session requires you to pick one and stay there.' },
      { q: 'Will what I say get back to my community?', a: 'No. Sessions are confidential, and the practice has no office anybody could be seen entering. The limits on confidentiality — risk of harm, and legal requirements — are set out on the standards page and are the same as they would be anywhere.' },
    ],
  },
  {
    slug: 'richmond',
    city: 'Richmond',
    angle: 'Local provision is built around Cantonese and Mandarin; Tagalog speakers are looking somewhere else.',
    body: [
      'Richmond has real counselling capacity, and it is built — correctly — around the city\'s Chinese-speaking communities. For a Tagalog speaker the local field is much thinner than the size of the city suggests, and people routinely search Vancouver or Surrey instead.',
      'The airport and the port are also large Filipino employers here, on rosters that change. A session you can attend from home between shifts is worth more than one you could theoretically drive to.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors in Richmond?', a: 'There are some, and far fewer than the size of the community would suggest — most of Richmond\'s multilingual mental-health provision is oriented to Cantonese and Mandarin. That is a genuine local strength, and it is not the language everybody needs.' },
      { q: 'I work rotating shifts at YVR. Can therapy fit around that?', a: 'Yes. Booking in blocks around a roster with gaps between them is normal, and evening appointments are available by request.' },
      { q: 'What does a first session involve?', a: 'Fifteen minutes free first, by video, to work out whether it is a fit at all. If it is, the first full session is about your story and what you want to be different — not a form to fill in.' },
    ],
  },
  {
    slug: 'burnaby',
    city: 'Burnaby',
    angle: 'A growing Filipino population, and public intake that runs through the health authority people do not expect.',
    body: [
      'Burnaby\'s Filipino community has grown substantially, and the counselling available in Tagalog has not grown with it. People here also hit a specific administrative trap: Burnaby looks west to Vancouver for most things but sits in Fraser Health, and a referral into the wrong queue costs weeks that nobody flags at the time.',
      'Private counselling in Tagalog sidesteps the queue question entirely, and works perfectly well alongside a public wait rather than instead of one.',
    ],
    faqs: [
      { q: 'Which health authority covers Burnaby?', a: 'Fraser Health, not Vancouver Coastal, despite how close the city sits to Vancouver. It is worth confirming before joining a public waitlist, because a referral into the wrong authority is a delay that only surfaces when you chase it.' },
      { q: 'Can my parent have sessions in Tagalog while I book on their behalf?', a: 'Yes, with their consent. It is common for an adult child to make the first contact, and the free consultation is a good place to sort out how that works.' },
      { q: 'Is this covered by extended health?', a: 'Many BC plans reimburse a Registered Clinical Counsellor. Coverage varies by plan, so confirming the designation with your insurer before booking is worth the phone call.' },
    ],
  },
  {
    slug: 'coquitlam',
    city: 'Coquitlam',
    angle: 'A Tri-Cities commute that takes the evening a weekly appointment would need.',
    body: [
      'The Filipino community across the Tri-Cities is substantial, and the practical obstacle here is the same one everybody in Coquitlam, Port Coquitlam and Port Moody faces: the commute takes the evening. An appointment on the other side of a bridge is a commitment that lasts about four weeks.',
      'Removing travel from both ends of a session is worth more than the session time itself — it is the difference between an appointment costing an hour and costing three, and it is what decides whether week six happens.',
    ],
    faqs: [
      { q: 'Do you cover Port Coquitlam and Port Moody?', a: 'Yes, on identical terms. The practice is virtual and covers all of British Columbia, so which of the three municipalities you live in changes nothing.' },
      { q: 'What is the latest appointment available?', a: 'Evening slots run on weekdays by request. If none of the listed windows work, it is worth raising on the free consultation rather than forcing a time that will not survive a busy month.' },
      { q: 'Can sessions run in Tagalog?', a: 'Yes — in Tagalog, English, or both within one session.' },
    ],
  },
  {
    slug: 'delta',
    city: 'Delta',
    angle: 'Greenhouse and agricultural work runs to its own hours, and a tunnel sits between here and most of the counselling.',
    body: [
      'A great deal of the agricultural and greenhouse work in Delta is done by Filipino workers, and it runs to hours that were not designed around appointments — early, long, and seasonal. An evening slot on the other side of the tunnel is not a small ask after a day like that; it is another hour each way at exactly the time the tunnel is worst.',
      'A session by video removes the crossing entirely. It also removes the part people mention less: arriving at a counselling office tired, late and already braced, which is not the state anybody does useful work in.',
    ],
    faqs: [
      { q: 'Can the session be in Tagalog?', a: 'Yes — in Tagalog, in English, or moving between them as the conversation needs. Nothing has to be decided in advance.' },
      { q: 'Does it matter which part of Delta I am in?', a: 'No. North Delta, Ladner and Tsawwassen are served on identical terms, and the municipal boundary changes nothing about the fee or the availability.' },
      { q: 'I work seasonally. Can I stop and start?', a: 'Yes, and it is better to plan for that at the beginning than discover it in month two. Booking in blocks with gaps between them is an ordinary pattern and pausing costs nothing.' },
    ],
  },
  {
    slug: 'langley',
    city: 'Langley',
    angle: 'Families move out from Surrey for space, and frequently leave the community that came with being close together.',
    body: [
      'A common Langley story in Filipino families: the move outward for a bigger place, a yard, a bedroom each — and a quiet loss of the density that made everything else work. The church that was ten minutes away is now forty. The relatives who dropped in do not. The support that was never organised because it never needed to be organised has to be arranged now, by people with less time than before.',
      'That is a real loss rather than an ungrateful complaint about a good decision, and it is worth naming as one. A session in Tagalog does not require that context to be explained from the beginning, which for a lot of people is most of why they finally book.',
    ],
    faqs: [
      { q: 'Is Aldergrove covered?', a: 'Yes, on identical terms. No part of the service depends on distance inside the province.' },
      { q: 'Do I have to explain Filipino family expectations first?', a: 'No. Utang na loob, hiya and the weight of what relatives will say are the starting context rather than something to be taught at the start of a session.' },
      { q: 'Can I bring my partner?', a: 'Couples sessions are available, and the language works the same way in them. Whether that or individual work fits better is one of the things the free consultation is for.' },
    ],
  },
  {
    slug: 'abbotsford',
    city: 'Abbotsford',
    angle: 'Food processing and agriculture employ a large Filipino workforce on shifts that do not fit a weekday appointment.',
    body: [
      'Abbotsford runs on agriculture, food processing and transport, and a substantial part of that workforce is Filipino. Those are jobs with early starts, long days and seasonal peaks, and none of that arranges itself around a counsellor with weekday afternoon availability. The appointment that assumes a free Tuesday is the appointment missed twice and then abandoned.',
      'The distance compounds it. Tagalog-speaking counsellors in BC are concentrated in the Lower Mainland, so the local answer has usually been a drive west at the end of a shift — which is why so many people here start and stop rather than never start.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors in Abbotsford?', a: 'Very few. Most in the province are in the Lower Mainland, and video is what removes the drive rather than the shortage.' },
      { q: 'Does this cover Mission and the eastern valley?', a: 'Yes, on the same terms and with no distance penalty for being further out.' },
      { q: 'Can I book around a seasonal schedule?', a: 'Yes. Blocks with gaps between them are normal here and there is no cost to pausing.' },
    ],
  },
  {
    slug: 'white-rock',
    city: 'White Rock',
    angle: 'A great deal of the care work in this area is done by Filipino staff, and care work is its own kind of exposure.',
    body: [
      'White Rock and South Surrey hold a concentration of long-term care and assisted living, and a large share of that workforce is Filipino. It is work that involves loss regularly, at close range, and with a professional expectation of composure — which is a specific combination and not the same thing as an ordinary difficult job.',
      'It also carries a particular silence. Talking about how heavy the work is can feel like a complaint about people you are fond of, so it goes unsaid, and the accumulation is invisible until it is not. Naming it in the language you think in, with somebody who does not need the setting explained, is frequently the whole of what makes it possible to say.',
    ],
    faqs: [
      { q: 'Is this different from ordinary work stress?', a: 'Repeated exposure to loss at close range is its own pattern rather than a stronger version of stress, and it responds to being treated as what it is.' },
      { q: 'Would my employer know?', a: 'No. This is a private practice, nothing is reported anywhere, and the limits of confidentiality are narrow and set out on the standards page.' },
      { q: 'Is South Surrey covered?', a: 'Yes — in practice it is one area, and the terms are identical.' },
    ],
  },
  {
    slug: 'victoria',
    city: 'Victoria',
    angle: 'Care work and hospitality run on rotations here, and the nearest Tagalog-speaking counsellor is usually across the water.',
    body: [
      'Greater Victoria has a long-established Filipino community working substantially in care, health services and hospitality — sectors that run on rotating schedules rather than office hours. A standing weekday appointment does not survive a roster that changes, which is the ordinary reason a course of counselling stops after the third session rather than any lack of willingness.',
      'The language makes it harder again. Tagalog-speaking clinicians in BC are concentrated on the mainland, so the traditional answer for somebody on the Island has been a ferry and most of a day. For weekly work that is not an answer at all.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors on the Island?', a: 'Few, and fewer taking new clients. Video is what makes the whole provincial field available rather than only the local one.' },
      { q: 'I work rotating shifts. Can this fit?', a: 'Yes, and it is worth saying so in the first conversation. Booking in blocks around a roster is a normal pattern rather than a special arrangement.' },
      { q: 'Are Saanich and Sooke covered?', a: 'Yes, on identical terms, with no penalty for being outside the core.' },
    ],
  },
  {
    slug: 'kelowna',
    city: 'Kelowna',
    angle: 'Agricultural work in the Okanagan brings people here for seasons, sometimes a long way from anybody who speaks the language.',
    body: [
      'The Okanagan\'s agricultural sector draws workers seasonally, including people here on work permits and a long way from home. That combination — temporary, working hard, isolated by language — is one of the harder ones there is, and it is also the one least likely to reach counselling, because everything about the situation says this is temporary and will be endured.',
      'There is very little counselling delivered in Tagalog anywhere in the Interior. Video does not fix the isolation, but it does mean the person you talk to does not have to be found locally, which in the Okanagan is the difference between an option and none.',
    ],
    faqs: [
      { q: 'I am here on a work permit. Can I still see a counsellor?', a: 'Yes. Access to a private counsellor does not depend on immigration status. What it depends on is being located in the province during the session.' },
      { q: 'Is anything reported to my employer?', a: 'No. This is a private practice with no connection to any employer, and nothing is reported to anybody. The limits of confidentiality are set out on the standards page.' },
      { q: 'Are West Kelowna and Vernon covered?', a: 'Yes, on identical terms across the province.' },
    ],
  },
];

export const getTagalogCity = (slug: string) => TAGALOG_CITIES.find((c) => c.slug === slug);

/** Whether the vertical has anyone behind it. A language page with no speaker
 *  is a claim the practice cannot honour, so the pages check rather than
 *  assume. */
export const TAGALOG_SPEAKERS = practitionersSpeaking('tl');
