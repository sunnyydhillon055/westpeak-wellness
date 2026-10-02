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
   population is a page with nothing true to say. The first cities below were
   the ones where the practice already had a city page AND where the community
   was substantial enough for the page to be about something.

   OWNER DECISION, 2 Oct 2026: every city with a city page gets its Tagalog
   page too, including cities where the community is small. Where it is small,
   the page states the real 2021 Census figure plainly, cites it, and argues
   honestly from it (few or no Tagalog-speaking counsellors locally, and video
   reaches one) rather than inflating the community. The rule below about
   census figures still holds: a number appears only with its source.

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
      'Surrey has one of the larger Filipino communities in British Columbia, and very little counselling delivered in Tagalog. What tends to happen instead is that the family member with the best English becomes the interpreter, for a parent, for a spouse, occasionally for a whole household, which works for a doctor\'s appointment and does not work at all for therapy.',
      'A session in Tagalog removes that. It also removes the part nobody talks about: the effort of translating a feeling into a second language while you are already struggling to name it in the first.',
    ],
    faqs: [
      { q: 'Can the whole session be in Tagalog?', a: 'Yes: in Tagalog, in English, or moving between the two as the conversation needs. Many people find themselves switching without planning to, and that is normal rather than a problem to fix.' },
      { q: 'Do I need to explain Filipino family expectations first?', a: 'No. Utang na loob, hiya, and the weight of what relatives will say are context rather than something to be taught from scratch at the start of a session.' },
      { q: 'Is there a counsellor in Surrey I could see in person instead?', a: 'There may be, and if an in-person option suits you it is a reasonable choice. What it usually costs here is availability, Tagalog-speaking counsellors in BC are few and carry waitlists. A virtual practice removes the travel and widens the field to the whole province.' },
    ],
  },
  {
    slug: 'vancouver',
    city: 'Vancouver',
    angle: 'A long-established Filipino community, and care that is easier to reach by video than across the city.',
    body: [
      'Vancouver\'s Filipino community is long-established and spread across the city rather than concentrated in one part of it, which means "a counsellor near me who speaks Tagalog" is frequently a contradiction. The nearest one who is taking clients may be a bus transfer and an hour each way.',
      'A great deal of Filipino employment in Vancouver is also shift-based: healthcare, care work, hospitality, and a standing weekday appointment does not survive a rotating roster. Sessions by video, with no travel either side, are the difference between attending and intending to.',
    ],
    faqs: [
      { q: 'I work shifts in healthcare. Can this fit?', a: 'Yes, and it is worth planning for at the start rather than discovering later. Booking block by block around a roster, with gaps between blocks, is an ordinary pattern here and pausing costs nothing.' },
      { q: 'Can I switch between Tagalog and English mid-session?', a: 'Yes. Most bilingual people do it without deciding to, particularly when something is difficult to say, and nothing about the session requires you to pick one and stay there.' },
      { q: 'Will what I say get back to my community?', a: 'No. Sessions are confidential, and the practice has no office anybody could be seen entering. The limits on confidentiality, risk of harm, and legal requirements, are set out on the standards page and are the same as they would be anywhere.' },
    ],
  },
  {
    slug: 'richmond',
    city: 'Richmond',
    angle: 'Local provision is built around Cantonese and Mandarin; Tagalog speakers are looking somewhere else.',
    body: [
      'Richmond has real counselling capacity, and it is built, correctly, around the city\'s Chinese-speaking communities. For a Tagalog speaker the local field is much thinner than the size of the city suggests, and people routinely search Vancouver or Surrey instead.',
      'The airport and the port are also large Filipino employers here, on rosters that change. A session you can attend from home between shifts is worth more than one you could theoretically drive to.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors in Richmond?', a: 'There are some, and far fewer than the size of the community would suggest. Most of Richmond\'s multilingual mental-health provision is oriented to Cantonese and Mandarin. That is a genuine local strength, and it is not the language everybody needs.' },
      { q: 'I work rotating shifts at YVR. Can therapy fit around that?', a: 'Yes. Booking in blocks around a roster with gaps between them is normal, and the calendar shows real open times.' },
      { q: 'What does a first session involve?', a: 'Thirty minutes free first, by video, to work out whether it is a fit at all. If it is, the first full session is about your story and what you want to be different, not a form to fill in.' },
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
      'Removing travel from both ends of a session is worth more than the session time itself. It is the difference between an appointment costing an hour and costing three, and it is what decides whether week six happens.',
    ],
    faqs: [
      { q: 'Do you cover Port Coquitlam and Port Moody?', a: 'Yes, on identical terms. The practice is virtual and covers all of British Columbia, so which of the three municipalities you live in changes nothing.' },
      { q: 'What is the latest appointment available?', a: 'The calendar shows every open time, and that is the honest answer to how late it goes. If none of them work, it is worth raising on the free consultation rather than forcing a time that will not survive a busy month.' },
      { q: 'Can sessions run in Tagalog?', a: 'Yes: in Tagalog, English, or both within one session.' },
    ],
  },
  {
    slug: 'delta',
    city: 'Delta',
    angle: 'Greenhouse and agricultural work runs to its own hours, and a tunnel sits between here and most of the counselling.',
    body: [
      'A great deal of the agricultural and greenhouse work in Delta is done by Filipino workers, and it runs to hours that were not designed around appointments: early, long, and seasonal. An evening slot on the other side of the tunnel is not a small ask after a day like that; it is another hour each way at exactly the time the tunnel is worst.',
      'A session by video removes the crossing entirely. It also removes the part people mention less: arriving at a counselling office tired, late and already braced, which is not the state anybody does useful work in.',
    ],
    faqs: [
      { q: 'Can the session be in Tagalog?', a: 'Yes: in Tagalog, in English, or moving between them as the conversation needs. Nothing has to be decided in advance.' },
      { q: 'Does it matter which part of Delta I am in?', a: 'No. North Delta, Ladner and Tsawwassen are served on identical terms, and the municipal boundary changes nothing about the fee or the availability.' },
      { q: 'I work seasonally. Can I stop and start?', a: 'Yes, and it is better to plan for that at the beginning than discover it in month two. Booking in blocks with gaps between them is an ordinary pattern and pausing costs nothing.' },
    ],
  },
  {
    slug: 'langley',
    city: 'Langley',
    angle: 'Families move out from Surrey for space, and frequently leave the community that came with being close together.',
    body: [
      'A common Langley story in Filipino families: the move outward for a bigger place, a yard, a bedroom each, and a quiet loss of the density that made everything else work. The church that was ten minutes away is now forty. The relatives who dropped in do not. The support that was never organised because it never needed to be organised has to be arranged now, by people with less time than before.',
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
      'The distance compounds it. Tagalog-speaking counsellors in BC are concentrated in the Lower Mainland, so the local answer has usually been a drive west at the end of a shift, which is why so many people here start and stop rather than never start.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors in Abbotsford?', a: 'Very few. Most in the province are in the Lower Mainland, and video is what removes the drive rather than the shortage.' },
      { q: 'Does this cover the eastern valley?', a: 'Yes, on the same terms and with no distance penalty for being further out. Mission has a page of its own.' },
      { q: 'Can I book around a seasonal schedule?', a: 'Yes. Blocks with gaps between them are normal here and there is no cost to pausing.' },
    ],
  },
  {
    slug: 'white-rock',
    city: 'White Rock',
    angle: 'A great deal of the care work in this area is done by Filipino staff, and care work is its own kind of exposure.',
    body: [
      'White Rock and South Surrey hold a concentration of long-term care and assisted living, and a large share of that workforce is Filipino. It is work that involves loss regularly, at close range, and with a professional expectation of composure, which is a specific combination and not the same thing as an ordinary difficult job.',
      'It also carries a particular silence. Talking about how heavy the work is can feel like a complaint about people you are fond of, so it goes unsaid, and the accumulation is invisible until it is not. Naming it in the language you think in, with somebody who does not need the setting explained, is frequently the whole of what makes it possible to say.',
    ],
    faqs: [
      { q: 'Is this different from ordinary work stress?', a: 'Repeated exposure to loss at close range is its own pattern rather than a stronger version of stress, and it responds to being treated as what it is.' },
      { q: 'Would my employer know?', a: 'No. This is a private practice, nothing is reported anywhere, and the limits of confidentiality are narrow and set out on the standards page.' },
      { q: 'Is South Surrey covered?', a: 'Yes, in practice it is one area, and the terms are identical.' },
    ],
  },
  {
    slug: 'victoria',
    city: 'Victoria',
    angle: 'Care work and hospitality run on rotations here, and the nearest Tagalog-speaking counsellor is usually across the water.',
    body: [
      'Greater Victoria has a long-established Filipino community working substantially in care, health services and hospitality, sectors that run on rotating schedules rather than office hours. A standing weekday appointment does not survive a roster that changes, which is the ordinary reason a course of counselling stops after the third session rather than any lack of willingness.',
      'The language makes it harder again. Tagalog-speaking clinicians in BC are concentrated on the mainland, so the traditional answer for somebody on the Island has been a ferry and most of a day. For weekly work that is not an answer at all.',
    ],
    faqs: [
      { q: 'Are there Tagalog-speaking counsellors on the Island?', a: 'Few, and fewer taking new clients. Video is what makes the whole provincial field available rather than only the local one.' },
      { q: 'I work rotating shifts. Can this fit?', a: 'Yes, and it is worth saying so in the first conversation. Booking in blocks around a roster is a normal pattern rather than a special arrangement.' },
      { q: 'Are Esquimalt and Oak Bay covered?', a: 'Yes, on identical terms, with no penalty for being outside the core.' },
    ],
  },
  {
    slug: 'kelowna',
    city: 'Kelowna',
    angle: 'Agricultural work in the Okanagan brings people here for seasons, sometimes a long way from anybody who speaks the language.',
    body: [
      'The Okanagan\'s agricultural sector draws workers seasonally, including people here on work permits and a long way from home. That combination: temporary, working hard, isolated by language: is one of the harder ones there is, and it is also the one least likely to reach counselling, because everything about the situation says this is temporary and will be endured.',
      'There is very little counselling delivered in Tagalog anywhere in the Interior. Video does not fix the isolation, but it does mean the person you talk to does not have to be found locally, which in the Okanagan is the difference between an option and none.',
    ],
    faqs: [
      { q: 'I am here on a work permit. Can I still see a counsellor?', a: 'Yes. Access to a private counsellor does not depend on immigration status. What it depends on is being located in the province during the session.' },
      { q: 'Is anything reported to my employer?', a: 'No. This is a private practice with no connection to any employer, and nothing is reported to anybody. The limits of confidentiality are set out on the standards page.' },
      { q: 'Are West Kelowna and Lake Country covered?', a: 'Yes, on identical terms across the province. Vernon has a page of its own.' },
    ],
  },
  /* SAANICH, 2 Oct 2026. TagalogCity has no sources field and the route
     renders plain text, so the figure is attributed in the sentence and cited
     on the Saanich hub, which links here. The claim behind it: Statistics Canada Table 98-10-0173-01, 2021 Census, mother
     tongue (single responses): Saanich 1,375 Tagalog, City of Victoria 1,145,
     Langford 670, every other Capital Region municipality fewer; Capital
     census division 4,145. https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917021,2021A00055917034,2021A00035917&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. Victoria's Tagalog page argues rosters and the ferry;
     this one argues that the community is in Saanich and the listings say
     Victoria. English only; no Tagalog sentences added. */
  {
    slug: 'saanich',
    city: 'Saanich',
    angle: 'More people in Saanich speak Tagalog as a first language than in any other municipality in the Capital Region, Victoria included.',
    body: [
      'Ask where Greater Victoria’s Filipino community lives and the usual answer is Victoria. The 2021 Census says Saanich: 1,375 Saanich residents reported Tagalog as their mother tongue, against 1,145 in the City of Victoria (Statistics Canada, 2021 Census Profile). That is easy to miss, including for people in the community who search for help under the city’s name and find little in their own language.',
      'A search for a Tagalog-speaking counsellor on the South Island turns up very little, so the ordinary result is therapy in English, a second language, at exactly the moment a first language matters most. A session in Tagalog by video needs no crossing and no drive downtown, and moving between Tagalog and English inside one session is normal.',
    ],
    faqs: [
      { q: 'Can sessions move between Tagalog and English?', a: 'Yes. Mixing the two is how many people talk at home, and a session can sound the same way. Nobody has to keep to one language for the counsellor’s sake.' },
      { q: 'Can my partner and I have couples sessions in Tagalog?', a: 'Yes. Couples sessions can run in Tagalog, English or both, which helps when partners are more comfortable in different languages.' },
      { q: 'I live in Sidney or Central Saanich. Does that change anything?', a: 'No. The Peninsula is served on identical terms, by secure video, with nothing to travel to.' },
    ],
  },
  /* MAPLE RIDGE, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Maple Ridge
     hub, which links here. Statistics Canada 2021 Census Profile, Maple
     Ridge CSD 5915075: Tagalog mother tongue 1,355 of 89,970 (1.5%); the
     Philippines is the most common place of birth among immigrants (2,000
     of 20,230) and among recent immigrants 2016 to 2021 (335 of 2,155).
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915075&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is the
     hub's: a city its workers leave, so the session goes where the person
     is that day. English only; no Tagalog words added. */
  {
    slug: 'maple-ridge',
    city: 'Maple Ridge',
    angle: 'The Philippines is the most common country of birth among Maple Ridge’s immigrants, in a city whose services are mostly built in English.',
    body: [
      'In the 2021 Census 1,355 Maple Ridge residents gave Tagalog as their mother tongue, about 1.5% of the city, and 2,000 of its 20,230 immigrants were born in the Philippines, more than in any other country (Statistics Canada, 2021 Census Profile). The community is smaller than Surrey’s or Vancouver’s, and still arriving: among people who moved here from abroad in the five years before that census, more came from the Philippines than from anywhere else.',
      'Settling somewhere new can mean long hours and family obligations on two continents, and counselling is rarely the first thing anyone looks for. When it is, the local options are in English, and Tagalog-speaking counsellors are few anywhere in British Columbia. Video means the counsellor does not have to be found locally, and that the session fits around a commute or a shift rather than adding another drive to it.',
    ],
    faqs: [
      { q: 'I arrived in the last few years. Does that change anything?', a: 'Not for counselling. A private counsellor can see anyone who is in British Columbia at the time of the session, whatever their immigration status, and settling in is an ordinary thing to bring to it.' },
      { q: 'My job is across the river. Can I join from near work?', a: 'Yes. Where you join from is up to you, as long as it is private and the connection holds. Near work that might be an empty meeting room, or the car before the drive home over the bridge.' },
      { q: 'Are Pitt Meadows and the east end of Maple Ridge included?', a: 'Yes: Pitt Meadows, Haney, Albion, Silver Valley and Whonnock, with nothing different about the service at the far east end.' },
    ],
  },
  /* VERNON, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Vernon hub,
     which links here. Statistics Canada 2021 Census Profile, Vernon CSD
     5937014: Tagalog mother tongue 305 of 43,730 (0.7%); Filipino 490 of
     43,110. Read 2 Oct 2026 through StatCan's data service.
     The Filipino Association of Vernon: Vernon Museum, Filipino Heritage
     Month, https://vernonmuseum.ca/filipino-heritage-month/ (typhoon relief;
     Stand Up Against Racism, Kal Beach, May 2021). English only; no Tagalog
     words added. */
  {
    slug: 'vernon',
    city: 'Vernon',
    angle: 'Vernon’s Filipino community is a few hundred people and organised, with an association that has raised typhoon relief and led anti-racism work.',
    body: [
      'In the 2021 Census 305 Vernon residents gave Tagalog as their mother tongue, under 1% of the city, and 490 were counted as Filipino (Statistics Canada, 2021 Census Profile). The Filipino Association of Vernon has raised relief for families in the Philippines after typhoons and started a Stand Up Against Racism initiative with an event at Kal Beach. A community that pulls together like that is also one where being recognised is likely, which is why talking to someone inside it about a marriage, money sent home or a parent’s expectations can feel impossible.',
      'Finding a counsellor nearby who speaks Tagalog and is not already part of that circle is hard in a town this size. One reached by video sits outside the community entirely, and sessions can move between Tagalog and English as the conversation needs.',
    ],
    faqs: [
      { q: 'The community here is small. Would anyone find out?', a: 'No. Sessions are confidential and there is no office for anyone to see you enter. The limits of confidentiality are set out on the standards page, and they are the same as anywhere.' },
      { q: 'Can my spouse and I have couples sessions in Tagalog?', a: 'Yes. Couples sessions can run in Tagalog, English or both, with each partner speaking in whichever language is easier for them.' },
      { q: 'Are Armstrong, Lumby and Enderby covered?', a: 'Yes, on identical terms anywhere in British Columbia, with no drive into Vernon for any of them.' },
    ],
  },  /* MISSION, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Mission hub,
     which links here. Statistics Canada 2021 Census Profile, Mission CSD
     5909056: Tagalog mother tongue 210 of 41,030 (0.5%), most often at home
     75; Filipino 480 of 40,625.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055909056&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is the
     size itself: nobody local to ask, and privacy harder, not easier. English
     only; no Tagalog words added. */
  {
    slug: 'mission',
    city: 'Mission',
    angle: 'Mission’s Tagalog-speaking community numbers in the hundreds, and at that size a counsellor who works in the language is rarely nearby.',
    body: [
      'In the 2021 Census 210 Mission residents gave Tagalog as their mother tongue, about 0.5% of the town, and 480 were counted as Filipino (Statistics Canada, 2021 Census Profile). This page does not pretend that is Surrey or Abbotsford. At that size the problem is not a long list to get onto but that there may be nobody local to ask, and a relative can end up translating at exactly the appointments where privacy matters most.',
      'Smallness also makes privacy harder. When the Filipino community in town is a few hundred people who know each other, the people most likely to recognise you are also the ones you would most want to choose whether to tell. A counsellor elsewhere in the province, by video, with no office anywhere, takes both of those questions off the table.',
    ],
    faqs: [
      { q: 'Is there a Tagalog-speaking counsellor in Mission?', a: 'This practice has no office in Mission or anywhere else. Sessions in Tagalog are by secure video, so where the counsellor sits does not matter, only that you are in British Columbia and have a private room.' },
      { q: 'My parent lives with us. Can they have sessions in Tagalog while I am at work?', a: 'Yes, from a private room at home. You can help set up the link the first time, and after that the session is theirs. Nothing about it is shared with the family unless they choose to share it.' },
      { q: 'Are Silverdale, Hatzic and Dewdney covered?', a: 'Yes, on identical terms across the province, with no penalty for being further east along the Lougheed.' },
    ],
  },  /* COURTENAY, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Courtenay
     hub, which links here. Statistics Canada 2021 Census Profile, Courtenay
     census agglomeration (943): Tagalog mother tongue 315 of 62,665 (0.5%);
     knowledge of Tagalog 435; Filipino 625.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021S0504943&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is the
     size itself in a valley where people know each other, and the distance
     to where Tagalog-speaking clinicians are. English only; no Tagalog words
     added. */
  {
    slug: 'courtenay',
    city: 'Courtenay',
    angle: 'The Comox Valley’s Filipino community is small, which makes a Tagalog-speaking counsellor harder to find and privacy harder to keep.',
    body: [
      'In the 2021 Census 315 people in the Courtenay census agglomeration, which centres on Courtenay, Comox and Cumberland, gave Tagalog as their mother tongue, about 0.5% of the area, and 625 were counted as Filipino (Statistics Canada, 2021 Census Profile). That is real but small: small enough that people in it tend to know one another, and a long way from the Lower Mainland, where Tagalog-speaking clinicians in BC are concentrated. From the valley, the route to one in person has been the drive down-Island and a ferry.',
      'That combination is the hard one. Talking to somebody from the community about a marriage, money sent home or a family argument carries a cost in a place this size, and talking in English means translating the feeling before you can describe it. Video removes both: a counsellor who speaks Tagalog and is not part of anybody’s circle here.',
    ],
    faqs: [
      { q: 'Will anyone in the community know I am seeing a counsellor?', a: 'Not through this practice. Sessions happen from your own home, the counsellor is not part of the valley’s Filipino community, and nothing is passed on to anybody, within the narrow limits explained at the start.' },
      { q: 'Can my spouse and I come together?', a: 'Yes. Couples sessions run in Tagalog, English or both, by secure video, and partners can join from two places as long as both are in British Columbia.' },
      { q: 'Are Comox, Cumberland and the islands included?', a: 'Yes. Comox, Cumberland, Royston, Union Bay, Fanny Bay, Denman and Hornby are served the same way as Courtenay, as is everywhere else in British Columbia.' },
    ],
  },
  /* LANGFORD, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Langford
     hub, which links here. Statistics Canada 2021 Census Profile, Langford
     CSD 5917044: Tagalog mother tongue 670 (1.4%); knowledge of Tagalog
     1,035; Filipino 1,405 (3.0%). Victoria CMA 935: Filipino 8,530 (2.2%).
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917044&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. Saanich argues that the
     community is in Saanich; this one that it is a larger share of a young
     city of recent arrivals, and still small. English only; no Tagalog
     words added. */
  {
    slug: 'langford',
    city: 'Langford',
    angle: 'Filipino residents are a larger share of Langford than of Greater Victoria, 3.0% against 2.2%, and still a small community.',
    body: [
      'In the 2021 Census 1,405 Langford residents were counted as Filipino and 670 gave Tagalog as their mother tongue, about 1.4% of the city (Statistics Canada, 2021 Census Profile). That is a real community but a small one, in a city that grew by almost a third in five years, and for many families who moved here the nearest relatives are in the Lower Mainland or overseas rather than down the road.',
      'That makes the language harder to find, not less needed. Without video, the realistic choices from the West Shore have been counselling in English with a parent or partner translating, or a long trip to reach somebody who speaks Tagalog. Video puts a Tagalog-speaking counsellor on the same screen as the person who needs one, with no highway and no sailing.',
    ],
    faqs: [
      { q: 'Is the Filipino community in Langford big enough for this to matter?', a: 'It is smaller than Surrey’s or Vancouver’s, and this page does not pretend otherwise. What matters is whether a counsellor speaks your language, and on the West Shore the realistic way to find one is by video.' },
      { q: 'Can a parent join in Tagalog while I join in English?', a: 'Yes. Family sessions can move between Tagalog and English, and family members can join from different places, as long as everyone is in British Columbia during the session.' },
      { q: 'Are Colwood, View Royal and Sooke covered?', a: 'Yes, with Metchosin and the Highlands. Where on the West Shore you live makes no difference to access.' },
    ],
  },
  /* CRANBROOK, 2 Oct 2026. Owner decision of the same day: the figure is
     stated plainly, attributed in the sentence and cited on the Cranbrook
     hub, which links here. Statistics Canada 2021 Census Profile, Cranbrook
     CSD 5901022: Tagalog mother tongue 90, most often at home 25, knowledge
     200; Filipino 270. East Kootenay RD 5901: knowledge of Tagalog 530.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055901022&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is the
     smallness itself, and the clock: Cranbrook is an hour ahead of the
     Pacific booking calendar in every season. English only; no Tagalog
     words added. */
  {
    slug: 'cranbrook',
    city: 'Cranbrook',
    angle: 'In the East Kootenay’s small Filipino community, a local Tagalog-speaking counsellor is unlikely, and any local counsellor may already know your family.',
    body: [
      'In the 2021 Census 270 Cranbrook residents were counted as Filipino and 90 gave Tagalog as their mother tongue, and across the whole East Kootenay 530 people could hold a conversation in it (Statistics Canada, 2021 Census Profile). That is a real community and a small one. It looks after its own, and it is also a community where everybody knows whose family is whose, which makes talking to anybody local about a private matter harder rather than easier.',
      'There is very little chance of finding a counsellor who works in Tagalog anywhere in the East Kootenay. Video means the person you talk to can be somebody in another part of the province who shares the language and not the social circle. One practical note: the booking calendar is in Pacific time, and Cranbrook is an hour ahead of it in every season.',
    ],
    faqs: [
      { q: 'Is there anybody in the East Kootenay who counsels in Tagalog?', a: 'In a community of this size it would be unusual, and the honest answer is that you should not expect to find one locally. Sessions in Tagalog, in English or in both by video are the practical route.' },
      { q: 'Would anybody in the community find out?', a: 'Not from the practice. Sessions are online with a counsellor outside your social circle, there is no connection to any employer or community group, and the narrow limits of confidentiality are set out on the standards page.' },
      { q: 'What time is my session if I live in Cranbrook?', a: 'An hour later than the booking calendar shows. The calendar is in Pacific time, and says so; the East Kootenay keeps Mountain time all year.' },
    ],
  },
  /* CAMPBELL RIVER, 2 Oct 2026. Owner decision of the same day: the figure
     is stated plainly, attributed in the sentence and cited on the Campbell
     River hub, which links here. Statistics Canada 2021 Census Profile,
     Campbell River CSD 5924034: Tagalog mother tongue 200 of 35,205 (0.6%),
     most often at home 90, knowledge 335; Filipino 400.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055924034&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is the
     smallness itself: few people, so a local Tagalog-speaking counsellor is
     unlikely and being seen is likelier, at the far end of the Island from
     where Tagalog-speaking clinicians are. English only; no Tagalog words
     added. */
  {
    slug: 'campbell-river',
    city: 'Campbell River',
    angle: 'Campbell River’s Filipino community is small, which makes a Tagalog-speaking counsellor harder to find locally and harder to see without being noticed.',
    body: [
      'In the 2021 Census 400 Campbell River residents were counted as Filipino and 200 gave Tagalog as their mother tongue, about 0.6% of the city (Statistics Canada, 2021 Census Profile). That is a real community, and a small one. People in it know each other’s families and often each other’s workplaces, so the worry about being seen going to counselling is sharper than it would be in Surrey or Vancouver, and it keeps people from asking at all.',
      'Tagalog-speaking clinicians in BC are concentrated on the mainland, and from the North Island the mainland is the length of the Island Highway and a ferry. Video takes away the need to find that person in town. On the North Island, that turns a choice between counselling in English or none into one that includes Tagalog.',
    ],
    faqs: [
      { q: 'Do I need to find a Tagalog-speaking counsellor locally?', a: 'No. Sessions run by secure video, so the counsellor can be anywhere in British Columbia, and nobody in town needs to know you are going.' },
      { q: 'I work shifts. Can sessions fit around a roster?', a: 'Yes. Sessions can be booked a few at a time as each new roster comes out rather than fixed to one weekday, and the booking calendar shows real open times.' },
      { q: 'Are Quadra Island and Gold River covered?', a: 'Yes. Quadra, Gold River and the rest of the North Island are booked exactly as Campbell River is.' },
    ],
  },
  /* NORTH VANCOUVER, 2 Oct 2026. Owner decision of the same day: the figure
     is stated plainly, attributed in the sentence and cited on the North
     Vancouver hub, which links here. Statistics Canada 2021 Census Profile:
     Tagalog mother tongue 1,675 in the City of North Vancouver (CSD 5915051),
     895 in the District (5915046) and 245 in West Vancouver (5915055), 2,815
     in all; in the City it is third after English 35,520 and Persian 5,205,
     ahead of French 980; Filipino 3,815 in the City.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915051,2021A00055915046,2021A00055915055&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service. The argument is
     concentration: a community large enough to have its own networks, in
     one municipality, so being known is the issue rather than being few.
     English only; no Tagalog words added. */
  {
    slug: 'north-vancouver',
    city: 'North Vancouver',
    angle: 'Tagalog is the City of North Vancouver’s third most common mother tongue, ahead of French, and most of the Shore’s speakers live there.',
    body: [
      'In the 2021 Census 1,675 residents of the City of North Vancouver gave Tagalog as their mother tongue, after English and Persian and ahead of French, and 3,815 were counted as Filipino; across the City, the District and West Vancouver the figure is 2,815 (Statistics Canada, 2021 Census Profile). That is a community concentrated in one municipality, large enough to have its own networks and small enough that everybody in them knows somebody who knows you.',
      'A Tagalog-speaking counsellor by video resolves that tension. The session is in the language the difficulty happened in, with somebody outside the Shore’s networks, and without a crossing to Vancouver or Surrey to find them. Moving between Tagalog and English in the middle of a sentence is normal and needs no apology.',
    ],
    faqs: [
      { q: 'I live in West Vancouver, not the City. Does that change anything?', a: 'No. West Vancouver, the District, Lions Bay and Bowen Island are served exactly as Lower Lonsdale is, and the Capilano River is not a boundary for a video session.' },
      { q: 'I speak Tagalog with my parents and English everywhere else. Is this still for me?', a: 'Yes. Plenty of people use Tagalog for family and English for work, and a session can follow whichever language a subject lives in. Nobody needs to be fluent in both.' },
      { q: 'Can my partner and I have couples sessions in Tagalog?', a: 'Yes. Couples sessions can run in Tagalog, English or both, and EMDR is available in Tagalog as well.' },
    ],
  },
];

export const getTagalogCity = (slug: string) => TAGALOG_CITIES.find((c) => c.slug === slug);

/** "Tagalog Counselling in <City>, BC | Westpeak Wellness", or without ", BC"
 *  where the city name (14 characters or more: Port Coquitlam, Campbell
 *  River, North Vancouver, New Westminster) would take it past the SEO gate's
 *  60. The H1, the description and the schema all carry the province. */
export function tagalogCityTitle(city: string): string {
  const withBc = `Tagalog Counselling in ${city}, BC | Westpeak Wellness`;
  return withBc.length <= 60 ? withBc : `Tagalog Counselling in ${city} | Westpeak Wellness`;
}

/** Whether the vertical has anyone behind it. A language page with no speaker
 *  is a claim the practice cannot honour, so the pages check rather than
 *  assume. */
export const TAGALOG_SPEAKERS = practitionersSpeaking('tl');
