#!/usr/bin/env node
/* CLIENT-ACQUISITION PROBE — what a prospective client can see on each site.
 *
 * Companion to competitor-scan.mjs, which measures SEO structure. This one
 * fetches the pages a person actually reads before booking (home, contact,
 * book, fees, about/team, services) and records the things that decide
 * whether they do: a booking system, a phone number, a free consultation,
 * published fees, direct billing, languages, evenings, "accepting new
 * clients", proof, and how big the team is. Plus two off-site checks that can
 * be read from public pages: a Psychology Today listing, and how many pages
 * Bing holds.
 *
 * Polite: one request at a time, a pause between sites. Output is raw
 * observations; scoring is a separate step (acquisition-50.mjs).
 *
 *   node scripts/acquisition-probe.mjs > data/competitors/acquisition.json
 */
import { writeFileSync } from 'node:fs';

const SITES = [
  ['westpeak', 'https://www.westpeakwellness.com', 'Westpeak Wellness'],
  ['clearheart', 'https://clearheartcounselling.com', 'Clear Heart Counselling'],
  ['thrive', 'https://www.thrivewellbc.com', 'Thrive Wellness'],
  ['tidal', 'https://tidaltrauma.com', 'Tidal Trauma'],
  ['upstream', 'https://www.upstreamcounselling.com', 'Upstream Counselling'],
  ['wellbeings', 'https://wellbeingscounselling.ca', 'Well Beings Counselling'],
  ['skylark', 'https://abbotsford.skylarkclinic.ca', 'Skylark Clinic'],
  ['wellnest', 'https://www.wellnest.ca', 'Wellnest'],
  ['crossroads', 'https://crossroadscollective.ca', 'Crossroads Collective'],
  ['sana', 'https://sanacounselling.ca', 'Sana Counselling'],
  ['jashundal', 'https://www.jashundal.com', 'Jashun Dal'],
];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grab(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const body = await res.text();
    return { ok: res.ok, status: res.status, url: res.url, body, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, status: 0, url, body: '', ms: Date.now() - t0, error: String(e.message || e) };
  }
}
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const count = (s, re) => (s.match(re) || []).length;

/* Candidate paths for the pages a client reads. First that answers 200 wins. */
const PAGES = {
  contact: ['/contact', '/contact-us', '/contact/'],
  book: ['/book', '/book-now', '/booking', '/book-online', '/appointments', '/schedule', '/book-a-session'],
  fees: ['/pricing', '/fees', '/rates', '/fees-and-insurance', '/rates-and-insurance', '/fees-insurance', '/cost', '/investment'],
  team: ['/practitioners', '/team', '/our-team', '/about', '/about-us', '/counsellors', '/therapists', '/meet-the-team'],
  services: ['/services', '/counselling-services', '/what-we-treat', '/areas-of-work', '/specialties'],
};

async function probe([key, base, name]) {
  const out = { key, name, base, pages: {}, ms: {} };
  const home = await grab(base);
  out.homeStatus = home.status; out.ms.home = home.ms;
  let corpus = home.body;
  out.pages.home = home.url;
  for (const [kind, paths] of Object.entries(PAGES)) {
    for (const p of paths) {
      await sleep(400);
      const r = await grab(base.replace(/\/$/, '') + p);
      if (r.ok && r.status === 200 && r.body.length > 2000 && !/404|not found/i.test((r.body.match(/<title[^>]*>([^<]*)/i) || ['', ''])[1])) {
        out.pages[kind] = r.url; corpus += '\n' + r.body; out.ms[kind] = r.ms; break;
      }
    }
  }
  const t = text(corpus);
  const raw = corpus;
  out.obs = {
    bookingSystem:
      /janeapp\.com/i.test(raw) ? 'Jane' :
      /cliniko\.com/i.test(raw) ? 'Cliniko' :
      /owlpractice|owl\.practice/i.test(raw) ? 'Owl' :
      /calendly\.com/i.test(raw) ? 'Calendly' :
      /acuityscheduling|squarespace\.com\/scheduling/i.test(raw) ? 'Acuity' :
      /simplepractice/i.test(raw) ? 'SimplePractice' :
      /psychologytoday\.com\/.*book|clientsecure/i.test(raw) ? 'PT/other' :
      /book (an|your) (appointment|session)|book online|book now/i.test(t) ? 'link only' : 'none',
    bookOnlineWording: /book (an? |your )?(appointment|session|consult|online|now)/i.test(t),
    freeConsult: /free (\d+[- ]?min(ute)?s? )?(consult|consultation|call|phone call|discovery|intro)/i.test(t),
    consultMinutes: (t.match(/free (\d{2})[- ]?min/i) || [])[1] || '',
    phone: count(raw, /href=["']tel:/gi) > 0 || /\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}/.test(t),
    email: count(raw, /href=["']mailto:/gi) > 0,
    feesShown: /\$\s?\d{2,3}(\.\d{2})?\s*(\/|per|for)?\s*(session|hour|50|60|min)/i.test(t) || /\$\s?1[0-9]{2}\b/.test(t),
    feeFigures: [...new Set((t.match(/\$\s?\d{2,3}(?:\.\d{2})?/g) || []).map((s) => s.replace(/\s/g, '')))].slice(0, 6),
    directBilling: /direct[- ]bill/i.test(t),
    insurersNamed: [...new Set((t.match(/Pacific Blue Cross|Sun Life|Manulife|Canada Life|Green ?Shield|Blue Cross|ICBC|WorkSafeBC|WorkSafe BC|CVAP|Crime Victim/gi) || []).map((s) => s.replace(/\s+/g, ' ')))],
    icbc: /ICBC/i.test(t),
    worksafe: /WorkSafe ?BC/i.test(t),
    slidingScale: /sliding[- ]scale|reduced[- ]fee|low[- ]cost|practicum|intern/i.test(t),
    efap: /EFAP|EAP\b|employee (and family )?assistance/i.test(t),
    acceptingNew: /accepting new clients|now accepting|taking new clients|currently accepting/i.test(t),
    waitlist: /waitlist|wait list/i.test(t),
    evenings: /evening/i.test(t),
    weekends: /weekend|saturday|sunday/i.test(t),
    sameWeek: /same[- ]week|within (a|one) week|this week|next[- ]day|within 48 hours|within 24 hours/i.test(t),
    online: /online|virtual|video|telehealth/i.test(t),
    inPerson: /in[- ]person|our office|clinic location|visit us/i.test(t),
    languages: [...new Set((t.match(/\b(Punjabi|Hindi|Tagalog|Filipino|Cantonese|Mandarin|Spanish|French|Farsi|Persian|Arabic|Korean|Urdu|Vietnamese|German|Russian|Japanese|Gujarati)\b/g) || []))],
    rccCount: count(t, /\bRCC\b/g),
    registeredPhrases: count(t, /Registered Clinical Counsellor|Registered Psychologist|Registered Social Worker|CCC\b|RSW\b|R\.?Psych/gi),
    registrationNumber: /#\s?\d{4,6}|registration (number|#)\s*:?\s*\d{4,6}|\b(RCC|CCC|RSW)\s*#?\s*\d{4,8}\b/i.test(t),
    testimonials: /testimonial|what (our )?clients say|reviews?\b|★|stars?\b/i.test(t),
    googleReviewsLink: /google\.com\/maps|g\.page|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(raw),
    psychologyTodayLink: /psychologytoday\.com/i.test(raw),
    teamPhotos: count(raw, /<img[^>]+(headshot|team|staff|counsellor|therapist|portrait|profile)[^>]*>/gi),
    teamSizeGuess: Math.max(count(t, /\b(RCC|RSW|R\.?Psych|CCC)\b/g), 0),
    specialtiesCount: count(t, /\b(anxiety|depression|trauma|PTSD|EMDR|couples|grief|ADHD|OCD|addiction|eating|burnout|anger|self-esteem|perinatal|postpartum|LGBTQ|autism|stress|family|teens?|children|youth)\b/gi),
    audiencePages: count(raw, /href=["'][^"']*(\/for\/|for-|-for-)[^"']*["']/gi),
    locationPages: count(raw, /href=["'][^"']*(surrey|vancouver|abbotsford|kelowna|langley|burnaby|richmond|victoria|kamloops|chilliwack|coquitlam|delta|nanaimo)[^"']*["']/gi),
    blogLinks: count(raw, /href=["'][^"']*\/(blog|guides|articles|resources|insights)\/[^"']+["']/gi),
    intakeForm: /intake form|new client form|client forms|consent form/i.test(t),
    portal: /client portal|patient portal|portal/i.test(t),
    responsePromise: /within (one|1|24|48|two|2) (business )?(day|days|hours)/i.test(t),
    chat: /tawk\.to|intercom|drift\.com|crisp\.chat|livechat|tidio|hubspot.*chat/i.test(raw),
    newsletter: /newsletter|subscribe/i.test(t),
    instagram: /instagram\.com\//i.test(raw),
    facebook: /facebook\.com\//i.test(raw),
    linkedin: /linkedin\.com\//i.test(raw),
    youtube: /youtube\.com|youtu\.be/i.test(raw),
    tiktok: /tiktok\.com/i.test(raw),
    crisisLine: /9-?8-?8|crisis line|1-800-SUICIDE|911/i.test(t),
    schemaLocalBusiness: /"@type"\s*:\s*"?(LocalBusiness|MedicalBusiness|ProfessionalService|HealthAndBeautyBusiness|Physician|MedicalClinic)/i.test(raw),
    schemaPerson: /"@type"\s*:\s*"?Person/i.test(raw),
    schemaFAQ: /"@type"\s*:\s*"?FAQPage/i.test(raw),
    canadaWide: /across canada|anywhere in canada|canada-wide|all of canada/i.test(t),
    provincesNamed: [...new Set((t.match(/\b(British Columbia|Alberta|Ontario|Saskatchewan|Manitoba|Quebec|Nova Scotia)\b/g) || []))],
    wordsHome: text(home.body).split(' ').filter(Boolean).length,
    homeBytes: home.body.length,
    /* Second set, 13 Sep 2026: the offer's clarity, who is served, and the
       technical trust signals a client feels without naming. */
    sessionLength: /\b(50|45|60|75|80|90)[- ]?min(ute)?s?\b/i.test(t),
    cancellationPolicy: /cancel(lation)? (policy|fee|notice)|\b(24|48)[- ]hours?['’]? notice|cancel(lation)?s? (free|up to)/i.test(t),
    paymentMethods: /credit card|visa|mastercard|e-?transfer|interac|debit|paypal/i.test(t),
    receiptsForClaims: /receipt/i.test(t),
    waitTimeStated: /no wait ?list|no waiting list|immediate (availability|openings)|openings? (this|next) week|book (this|next) week/i.test(t),
    hoursListed: /\b(mon|tue|wed|thu|fri)[a-z]*\s*(-|to|–)\s*(fri|sat|sun)[a-z]*|\b\d{1,2}(:\d{2})?\s?(am|pm)\s*(-|to|–)\s*\d{1,2}(:\d{2})?\s?(am|pm)/i.test(t),
    faqPage: /href=["'][^"']*\/faq[^"']*["']|frequently asked/i.test(raw),
    privacyPage: /href=["'][^"']*(privacy|confidentiality)[^"']*["']/i.test(raw),
    accessibilityPage: /href=["'][^"']*accessib[^"']*["']|accessibility statement/i.test(raw),
    couples: /couples?|marriage|relationship counselling/i.test(t),
    youth: /\b(children|child|teen|teens|youth|adolescent)s?\b/i.test(t),
    emdr: /\bEMDR\b/.test(t),
    lgbtq: /LGBTQ|2SLGBTQ|queer|gender[- ]affirming|non-?binary/i.test(t),
    cultural: /Indigenous|First Nations|cultur(al|ally) (safe|safety|sensitive|competent|responsive|informed)|anti-?racis|South Asian|immigrant|newcomer/i.test(t),
    groups: /group (therapy|program|session|counselling)|workshop|webinar|support group/i.test(t),
    multiDesignation: [...new Set((t.match(/\b(RCC|RSW|R\.?Psych|CCC|RTC|RP\b|MSW)\b/g) || []))].length,
    videoIntro: /youtube\.com\/embed|vimeo\.com|<video/i.test(raw),
  };
  /* Off-site, public: Psychology Today search by practice name, Bing index. */
  await sleep(600);
  const pt = await grab(`https://www.psychologytoday.com/ca/therapists?search=${encodeURIComponent(name)}`);
  out.psychologyToday = { status: pt.status, hits: count(pt.body, new RegExp(name.split(' ')[0], 'gi')), profileUrls: [...new Set((pt.body.match(/https:\/\/www\.psychologytoday\.com\/ca\/therapists\/[a-z0-9-]+\/\d+/g) || []))].slice(0, 5) };
  await sleep(600);
  const host = new URL(base).host.replace(/^www\./, '');
  const bing = await grab(`https://www.bing.com/search?q=site%3A${host}`);
  out.bing = { status: bing.status, resultsText: (bing.body.match(/([\d,]+)\s+results/i) || [])[1] || '', mentions: count(bing.body, new RegExp(host.replace(/\./g, '\\.'), 'gi')) };
  return out;
}

const results = [];
for (const s of SITES) {
  process.stderr.write(`== ${s[0]}\n`);
  results.push(await probe(s));
  await sleep(800);
}
writeFileSync('data/competitors/acquisition.json', JSON.stringify({ at: new Date().toISOString(), results }, null, 2));
process.stderr.write('wrote data/competitors/acquisition.json\n');
