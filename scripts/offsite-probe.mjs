/* OFF-SITE PROBE — the signals that decide local rankings, read from the only
 * place they can be read without a paid API: the sites' own markup.
 *
 * Map-pack eligibility is the largest single ranking difference between this
 * practice and every competitor, and it is not a code property. What CAN be
 * checked from here is whether a competitor publishes a postal address and
 * geo-coordinates at all — because a practice that does is eligible for a
 * Google Business Profile and the map pack, and one that does not is not.
 *
 * Review counts are read from visible text, not from schema, because several
 * of these sites print "N Google reviews" without marking it up. That makes the
 * number indicative rather than exact — it is reported as "seen on page", never
 * as a verified review count.
 */
const SITES = [
  ['westpeak', 'https://www.westpeakwellness.com/'],
  ['clearheart', 'https://clearheartcounselling.com/'],
  ['thrive', 'https://www.thrivewellbc.com/'],
  ['tidal', 'https://tidaltrauma.com/'],
  ['upstream', 'https://www.upstreamcounselling.com/'],
  ['wellbeings', 'https://wellbeingscounselling.ca/'],
  ['wellnest', 'https://www.wellnest.ca/'],
  ['crossroads', 'https://crossroadscollective.ca/'],
  ['sana', 'https://sanacounselling.ca/'],
  ['jashundal', 'https://www.jashundal.com/'],
];

const UA = 'Mozilla/5.0 (compatible; westpeak-audit/1.0; +https://www.westpeakwellness.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = [];
for (const [key, url] of SITES) {
  let html = '';
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
    html = await res.text();
  } catch (e) {
    rows.push({ key, error: String(e.message || e) });
    continue;
  }
  await sleep(1000);

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  const reviewMentions = [
    ...text.matchAll(/(\d{1,4})\s*(?:\+\s*)?(?:google\s+)?(?:5[- ]star\s+)?reviews?\b/gi),
  ].map((m) => Number(m[1])).filter((n) => n > 0 && n < 5000);

  rows.push({
    key,
    postalAddress: /"@type"\s*:\s*"PostalAddress"/i.test(html),
    geo: /"@type"\s*:\s*"GeoCoordinates"/i.test(html),
    streetAddress: /"streetAddress"\s*:\s*"[^"]{4,}"/i.test(html),
    areaServed: /"areaServed"/i.test(html),
    telephone: /"telephone"\s*:\s*"[^"]{6,}"/i.test(html),
    /* An embedded map is the other tell that a practice has a real front door. */
    embeddedMap: /google\.com\/maps|maps\.google|mapbox|goo\.gl\/maps/i.test(html),
    ratingMarkup: /"@type"\s*:\s*"AggregateRating"|"ratingValue"/i.test(html),
    reviewWordSeen: /\breviews?\b/i.test(text),
    reviewNumbersSeen: [...new Set(reviewMentions)].slice(0, 5),
    psychologyTodayLink: /psychologytoday\.com/i.test(html),
    counsellingBcLink: /counsellingbc\.com/i.test(html),
    firstSessionLink: /firstsession\.com/i.test(html),
    bcaccLink: /bc-counsellors\.org|bcacc/i.test(html),
    instagram: /instagram\.com/i.test(html),
    facebook: /facebook\.com/i.test(html),
    linkedin: /linkedin\.com/i.test(html),
    youtube: /youtube\.com|youtu\.be/i.test(html),
    tiktok: /tiktok\.com/i.test(html),
    bookingWidget: /janeapp|cliniko|calendly|acuity|owlpractice/i.test(html),
    liveChat: /intercom|tawk|drift|crisp\.chat|tidio/i.test(html),
  });
}

const cols = [
  'postalAddress', 'geo', 'streetAddress', 'telephone', 'embeddedMap', 'ratingMarkup',
  'psychologyTodayLink', 'counsellingBcLink', 'firstSessionLink', 'bcaccLink',
  'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok', 'bookingWidget',
];
console.log('site'.padEnd(11) + cols.map((c) => c.slice(0, 7).padEnd(8)).join(''));
for (const r of rows) {
  if (r.error) { console.log(r.key.padEnd(11) + 'ERROR ' + r.error); continue; }
  console.log(r.key.padEnd(11) + cols.map((c) => (r[c] ? 'yes'.padEnd(8) : '.'.padEnd(8))).join(''));
}
console.log('\nreview numbers seen in visible text (indicative only):');
for (const r of rows) if (!r.error) console.log('  ' + r.key.padEnd(12) + JSON.stringify(r.reviewNumbersSeen));
