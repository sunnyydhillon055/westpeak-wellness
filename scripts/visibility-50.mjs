/* FIFTY-CATEGORY VISIBILITY AUDIT — Westpeak Wellness against ten practices.
 *
 * The scores live in this file rather than in prose so the arithmetic is done
 * once, by a machine, and so a later pass can change one number and regenerate
 * the whole document instead of editing a table by hand and introducing a
 * total that no longer adds up.
 *
 * CONFIDENCE is recorded per category and is not decoration:
 *   M  measured — fetched and parsed this pass (data/competitors/scan.json)
 *   G  Google Search Console — the site's own 28-day export, real positions
 *   S  SERP / public evidence — searched and read, but not a rank-tracker
 *   E  estimated — reasoned from structure, NOT measured. Treat as a band.
 *
 * `rank` is Westpeak's position among the eleven sites (1 = best). Where the
 * category is off-site and only partially observable, rank is given as a band
 * and the confidence letter says why.
 */
import { writeFileSync } from 'node:fs';

const G = [
  { key: 'A', name: 'Demand capture & rankings', weight: 22 },
  { key: 'B', name: 'Local presence & the map pack', weight: 14 },
  { key: 'C', name: 'Off-site authority & directories', weight: 18 },
  { key: 'D', name: 'Reputation & proof', weight: 8 },
  { key: 'E', name: 'Content & topical authority', weight: 14 },
  { key: 'F', name: 'Technical SEO & performance', weight: 12 },
  { key: 'G', name: 'Conversion, contact & capture', weight: 12 },
];

/* [group, category, score/1000, rank/11, confidence, evidence] */
const C = [
  ['A', 'Impression-weighted average position', 90, 11, 'G', 'Position 53.7 across 317 ranking queries. Page 6 of Google. No competitor in the set sits below page 2 for its own money terms.'],
  ['A', 'Top-3 rankings on commercial queries', 60, 11, 'G', 'Six queries rank above position 4; together they carry 6 impressions. Zero commercial terms in the top 3.'],
  ['A', 'Page-1 presence, head money terms', 70, 11, 'G', '"online counselling bc" pos 70.4 · "online counselling vancouver" pos 43.0 · "registered clinical counsellor" pos 45.3. None on page 1.'],
  ['A', 'Non-brand click volume', 80, 11, 'G', '14 non-brand clicks in 28 days from 2,802 impressions.'],
  ['A', 'Branded demand', 200, 10, 'G', '99 brand impressions, 50 clicks at 50.5% CTR. The channel works; almost nobody searches the name.'],
  ['A', 'Click-through rate at achieved positions', 150, 11, 'G', '0.50% CTR excluding the homepage. 67 of 76 pages earn impressions and zero clicks.'],
  ['A', 'Ranking query breadth', 420, 6, 'G', '317 distinct queries earn impressions — genuinely broad for a site this age, but 272 of them sit below position 21.'],
  ['A', 'Indexed-page productivity', 480, 5, 'G', '76 of 119 sitemap URLs earn impressions (64%). Coverage is healthy; conversion of coverage into position is not.'],

  ['B', 'Google Business Profile', 50, 11, 'S', 'No profile found. Every competitor with an address has one. This is the single largest missing asset.'],
  ['B', 'Map-pack eligibility', 60, 11, 'M', 'No PostalAddress, no GeoCoordinates, no embedded map. 5 of 9 measurable competitors publish all three.'],
  ['B', 'NAP consistency across the web', 150, 11, 'M', 'There is no name-address-phone to be consistent about: the practice publishes an email address and nothing else.'],
  ['B', 'Local landing-page depth', 620, 3, 'M', 'Six city pages at 3,900-5,195 structured characters — deeper than Clearheart templates that outrank them.'],
  ['B', 'Local citations & community signals', 90, 11, 'S', 'BCACC only. No chamber, no Fraser Valley directory, no community listing found.'],
  /* This read 480 and "areaServed is absent" in the first draft of this file.
     That was wrong: the probe collected the field and the summary never printed
     the column, so the claim was written from an absence of output rather than
     an absence of markup. app/layout.tsx:95 emits it site-wide. */
  ['B', 'Service-area definition', 820, 2, 'M', 'areaServed emits site-wide as State: British Columbia within Country: Canada, alongside availableLanguage for English and Punjabi. Only Upstream declares service area as precisely.'],

  ['C', 'Referring domains', 80, 11, 'E', 'No backlink API is authorised in this session, so this is a structural estimate: one association listing and an Instagram profile.'],
  ['C', 'Therapy-directory listings', 130, 11, 'S', 'Psychology Today, CounsellingBC, First Session, Theravive and TherapyTribe searched — no Westpeak profile found in any. These five own page 1 for the city terms.'],
  ['C', 'Professional-association presence', 500, 5, 'S', 'BCACC listing is live and ranks for the brand term — currently above the site itself.'],
  ['C', 'Health & referral networks', 200, 9, 'S', 'No Pathways BC, Fraser Health or EAP-panel presence found.'],
  ['C', 'Earned mentions & digital PR', 60, 11, 'S', 'No third-party editorial mentions found.'],
  ['C', 'Social profile footprint', 180, 11, 'M', 'Instagram only. 9 of 9 measurable competitors run Instagram and Facebook; 5 also run LinkedIn.'],
  ['C', 'AI answer-engine visibility', 820, 1, 'M', 'robots.txt names and admits GPTBot, CCBot, ClaudeBot and PerplexityBot; SpeakableSpecification and MedicalWebPage are emitted. No competitor in the set does any of this.'],

  ['D', 'Public review volume', 100, 11, 'S', 'Zero. Constrained by BCACC advertising standards, but a Google profile could still carry non-client references.'],
  ['D', 'Verifiable credential display', 900, 1, 'M', 'Registration 20111 shown with the public register beside it. No competitor publishes a checkable number this prominently.'],
  ['D', 'Trust architecture', 880, 1, 'M', '/standards and a /reviews page that explains the absence of testimonials rather than faking them.'],
  ['D', 'Third-party validation', 220, 9, 'S', 'Thin. Association membership is the only external corroboration.'],

  ['E', 'Indexable page count', 380, 9, 'M', '119 URLs. Set median is 406; Crossroads 494, Wellbeings 485, Tidal 547.'],
  ['E', 'Average content depth', 720, 3, 'M', '2,086 words per sampled page. Set median 1,590. Only Crossroads (7,297) and Wellbeings (3,746) are deeper.'],
  ['E', 'Topical cluster architecture', 850, 1, 'M', 'Services, approaches, guides, resources, compare, for-audience and city clusters, all cross-linked.'],
  ['E', 'Content uniqueness', 900, 1, 'M', 'Hand-written throughout. Upstream and Wellbeings show clear programmatic templating across 400+ URLs.'],
  ['E', 'Freshness signalling', 780, 2, 'M', '119 of 119 sitemap URLs carry lastmod. Upstream and Wellnest carry none at all.'],
  ['E', 'Publishing cadence', 400, 8, 'M', 'No dated article stream. Competitors on Squarespace publish continuously; recency is a ranking input this site does not feed.'],
  ['E', 'Query-to-page coverage', 560, 5, 'G', '317 queries served, but the head terms have no dedicated page strong enough to hold them.'],
  ['E', 'Punjabi-language content', 800, 2, 'M', 'A full Gurmukhi surface and six regional pages. Only Jash Undal competes here, with a single page.'],

  ['F', 'HTML payload', 850, 2, 'M', '105 kB average. Set median 190 kB; Tidal 707 kB, Thrive 347 kB. Only Wellnest is lighter.'],
  ['F', 'Core Web Vitals', 600, 4, 'E', 'Mobile LCP ~3.0 s and TBT ~290 ms per the repo ledger. Not re-measured this pass.'],
  ['F', 'Structured-data coverage', 950, 1, 'M', '24 schema types including MedicalBusiness, ProfessionalService, MedicalWebPage and SpeakableSpecification. Nearest rival Tidal has 27 but no speakable markup.'],
  ['F', 'Canonicalisation & index hygiene', 930, 1, 'M', '6 of 6 sampled pages carry a self-referential canonical (Wellnest none, Upstream 4 of 6); a redirect-shadow gate blocks routes hidden behind redirects, and Alberta and Ontario 404 by design and stay out of the sitemap.'],
  ['F', 'Sitemap & robots hygiene', 920, 1, 'M', 'Single clean sitemap, complete lastmod coverage, 26 deliberate disallows.'],
  ['F', 'Title tags', 900, 1, 'M', '44-48 characters, unique, front-loaded. Thrive averages 95 characters and truncates.'],
  ['F', 'Meta descriptions', 900, 1, 'M', '142-145 characters across the sample. Sana averages 70.'],
  ['F', 'Heading hierarchy', 930, 1, 'M', 'Exactly one h1 per page. Tidal averages 8, Wellnest 6, Sana 5.'],
  ['F', 'Image optimisation & alt text', 700, 3, 'M', '100% alt coverage — but two images on the homepage. The site is text-rich and picture-poor.'],
  ['F', 'Mobile usability', 700, 4, 'M', '25 of 83 tap targets under 40 px, one image overflowing the viewport edge.'],
  ['F', 'Internal linking', 880, 2, 'M', '80 internal links per page against a set median of 119 — lower but far more purposeful than nav-chrome repetition.'],

  ['G', 'Telephone capture', 100, 11, 'M', 'The practice publishes no phone number. Every tel: link on the site is a crisis line. There is no way for anyone to call.'],
  ['G', 'Booking-path friction', 600, 6, 'M', 'Homepage CTA reaches /book in one hop, but /book leads with a mailto and offers Cliniko as the secondary button.'],
  ['G', 'Enquiry capture breadth', 780, 3, 'M', 'Forms, email and a client portal, with a honeypot correctly hidden and a store-before-notify submit path.'],
  ['G', 'Conversion architecture', 850, 2, 'M', 'CTA bands, comparison pages and decision tools throughout; a build well ahead of the traffic reaching it.'],
  ['G', 'Live-chat & instant response', 300, 8, 'M', 'None. 0 of 10 sites run live chat, so this costs little — but reply speed is the only lever left without a phone.'],
  ['G', 'Response-time proof', 700, 2, 'M', 'A measured reply median now exists in /admin, gated to appear only above five samples.'],
];

const byGroup = new Map(G.map((g) => [g.key, []]));
for (const row of C) byGroup.get(row[0]).push(row);

let overall = 0;
const groupScores = [];
for (const g of G) {
  const rows = byGroup.get(g.key);
  const avg = rows.reduce((t, r) => t + r[2], 0) / rows.length;
  groupScores.push({ ...g, avg, n: rows.length });
  overall += (avg * g.weight) / 100;
}

const L = [];
L.push('# Westpeak Wellness — 50-category visibility audit');
L.push('');
L.push('**Measured:** 27 August 2026 · **Benchmark set:** ten BC and Canadian counselling practices');
L.push('**Scale:** every category scored out of 1,000 · overall is the weighted mean');
L.push('');
L.push('## Overall');
L.push('');
L.push('# ' + Math.round(overall) + ' / 1,000');
L.push('');
L.push('| Group | Weight | Categories | Score |');
L.push('|---|--:|--:|--:|');
for (const g of groupScores) {
  L.push('| ' + g.key + '. ' + g.name + ' | ' + g.weight + '% | ' + g.n + ' | **' + Math.round(g.avg) + '** |');
}
L.push('');
const sorted = [...C].sort((a, b) => b[2] - a[2]);
L.push('## The ten strongest');
L.push('');
L.push('| # | Category | Score | Rank |');
L.push('|--:|---|--:|--:|');
sorted.slice(0, 10).forEach((r, i) => L.push('| ' + (i + 1) + ' | ' + r[1] + ' | **' + r[2] + '** | ' + r[3] + '/11 |'));
L.push('');
L.push('## The ten weakest');
L.push('');
L.push('| # | Category | Score | Rank |');
L.push('|--:|---|--:|--:|');
sorted.slice(-10).reverse().forEach((r, i) => L.push('| ' + (i + 1) + ' | ' + r[1] + ' | **' + r[2] + '** | ' + r[3] + '/11 |'));
L.push('');
L.push('## All fifty');
L.push('');
for (const g of G) {
  L.push('### ' + g.key + '. ' + g.name + ' — ' + Math.round(groupScores.find((x) => x.key === g.key).avg) + '/1000');
  L.push('');
  L.push('| # | Category | Score | Rank | Conf | Evidence |');
  L.push('|--:|---|--:|--:|:-:|---|');
  byGroup.get(g.key).forEach((r, i) => {
    L.push('| ' + (C.indexOf(r) + 1) + ' | ' + r[1] + ' | **' + r[2] + '** | ' + r[3] + '/11 | ' + r[4] + ' | ' + r[5] + ' |');
  });
  L.push('');
}
L.push('---');
L.push('');
L.push('**Confidence key** — M measured this pass · G Search Console export · S searched public evidence · E estimated, not measured.');
L.push('');
L.push('Generated by `scripts/visibility-50.mjs` from `data/competitors/scan.json` and `data/gsc/2026-08-20-*.csv`.');

writeFileSync(new URL('../VISIBILITY_50_2026-08-27.md', import.meta.url), L.join('\n') + '\n');
writeFileSync(
  new URL('../data/competitors/visibility-50.json', import.meta.url),
  JSON.stringify({ overall: Math.round(overall), groups: groupScores, categories: C }, null, 2)
);
console.log('overall ' + Math.round(overall) + '/1000');
for (const g of groupScores) console.log('  ' + g.key + ' ' + String(Math.round(g.avg)).padStart(4) + '  ' + g.name);
