#!/usr/bin/env node
/* FIFTY CATEGORIES THAT DECIDE WHETHER A PROSPECTIVE CLIENT BOOKS —
 * Westpeak Wellness against ten BC counselling practices, 13 Sep 2026.
 *
 * Reads data/competitors/acquisition.json (scripts/acquisition-probe.mjs) and
 * data/competitors/scan.json (scripts/competitor-scan.mjs) and scores every
 * site 0-10 on each category with the same rule, so the ranking is arithmetic
 * rather than opinion. Where a category cannot be read from a public page it
 * is marked E (estimated) and the rule says what the estimate rests on.
 *
 *   node scripts/acquisition-50.mjs > CLIENT_ACQUISITION_AUDIT_2026-09-13.md
 *
 * CONFIDENCE  M measured from fetched pages · S public search evidence
 *             G Westpeak's own Search Console · E estimated from a proxy
 */
import { readFileSync } from 'node:fs';

const A = JSON.parse(readFileSync('data/competitors/acquisition.json', 'utf8')).results;
const S = JSON.parse(readFileSync('data/competitors/scan.json', 'utf8'));

/* Facts the probe cannot read, entered by hand with the reason. */
const KNOWN = {
  westpeak: {
    phone: false,               // the two tel: links are 9-8-8 and 911, not the practice
    consultMinutes: '30',       // Cliniko; the probe matched a stale figure in prose
    gscPosition: 53.7,          // Search Console, impression-weighted, to 6 Sep
    gbp: false,                 // no Google Business Profile found
    ptAccurate: false,          // PT profile lists the founder (on leave), 15-min, wrong phone
    testimonialsBanned: true,   // BCACC advertising standards; deliberate absence
    inPerson: false,            // virtual by design
    llms: true, referPage: true, portal: true,
    registrationNumber: true,   // on every profile and city page and the trust bar; the probe fetched the hub, not a profile
    intakeForm: false,          // the probe matched the sentence "No intake form"
  },
};

const sites = A.map((r) => ({ ...r, o: r.obs, k: KNOWN[r.key] ?? {}, scan: S[r.key] }));
const sitemapCount = (s) => s.scan?.sitemap?.count ?? 0;
const bingTier = (s) => { const n = parseInt(String(s.bing.resultsText).replace(/,/g, ''), 10) || s.bing.mentions || 0; return n >= 10000 ? 10 : n >= 1000 ? 8 : n >= 100 ? 6 : n >= 20 ? 4 : n > 0 ? 2 : 0; };
const yes = (b, full = 10) => (b ? full : 0);
const scale = (n, top, full = 10) => Math.max(0, Math.min(full, Math.round((n / top) * full)));
const hasPage = (s, p) => Boolean(s.pages[p]);
const social = (s) => ['instagram', 'facebook', 'linkedin', 'youtube', 'tiktok'].filter((k) => s.o[k]).length;

/* [group, category, confidence, rule text, scorer(site) -> 0..10] */
const CATS = [
  // A — BEING FOUND
  ['A', 'Organic position for money terms', 'G/E', 'Westpeak from Search Console (pos 54 = 2/10). Others: Bing index size as a proxy for an established domain, capped at 8.', (s) => s.k.gscPosition ? 2 : Math.min(8, bingTier(s))],
  ['A', 'Google Business Profile / map pack', 'E', '10 if the site links its own Google reviews or Maps listing; 5 if it names a street address; 0 if neither (Westpeak: none found).', (s) => s.k.gbp === false ? 0 : s.o.googleReviewsLink ? 10 : s.o.inPerson ? 5 : 0],
  ['A', 'Psychology Today listing exists', 'S', 'A profile URL for the practice appears in a PT search by name.', (s) => yes(s.psychologyToday.profileUrls.length > 0)],
  ['A', 'Psychology Today listing is current', 'S/E', 'Westpeak: 2 (lists a counsellor on leave, a 15-minute consult, a wrong phone). Others with a profile: 7 (unverified); none: 0.', (s) => s.k.ptAccurate === false ? 2 : s.psychologyToday.profileUrls.length ? 7 : 0],
  ['A', 'Bing and the engines it feeds', 'M', 'Bing site: results, tiered.', (s) => bingTier(s)],
  ['A', 'Local landing pages', 'M', 'City pages linked from the pages a client reads, scaled to 30.', (s) => scale(s.o.locationPages, 30)],
  ['A', 'Social footprint', 'M', 'Instagram, Facebook, LinkedIn, YouTube, TikTok linked: 2 each.', (s) => social(s) * 2],
  ['A', 'Content that draws readers', 'M', 'Blog/guide links from the client-facing pages, scaled to 40.', (s) => scale(s.o.blogLinks, 40)],
  ['A', 'Answer-engine readiness', 'M', 'LocalBusiness schema 4, FAQ schema 3, llms.txt 3.', (s) => yes(s.o.schemaLocalBusiness, 4) + yes(s.o.schemaFAQ, 3) + yes(s.k.llms, 3)],
  ['A', 'Site breadth', 'M', 'URLs in the sitemap, scaled to 250.', (s) => scale(sitemapCount(s), 250)],
  // B — TRUST BEFORE CONTACT
  ['B', 'Registration numbers on the page', 'M', 'A checkable number appears on the pages a client reads.', (s) => yes(s.k.registrationNumber ?? s.o.registrationNumber)],
  ['B', 'Designations named and explained', 'M', 'RCC/RSW/R.Psych/CCC phrases, scaled to 20.', (s) => scale(s.o.registeredPhrases, 20)],
  ['B', 'Counsellor photos', 'M', 'Team/portrait images on the pages read, scaled to 6.', (s) => scale(s.o.teamPhotos, 6)],
  ['B', 'Reviews and testimonials', 'M', 'Shown on site. Westpeak scores 0 by BCACC rule, which is a real disadvantage against practices that ignore it.', (s) => yes(s.o.testimonials && !s.k.testimonialsBanned)],
  ['B', 'Google reviews linked', 'M', 'A link to the practice\'s Google listing.', (s) => yes(s.o.googleReviewsLink)],
  ['B', 'A team page that answers "who are you"', 'M', 'A reachable team/about page.', (s) => yes(hasPage(s, 'team'))],
  ['B', 'Depth of the front door', 'M', 'Words on the homepage, scaled to 1,500; a homepage over 5,000 words scores 6 (nobody reads it).', (s) => s.o.wordsHome > 5000 ? 6 : scale(s.o.wordsHome, 1500)],
  ['B', 'Registered-counsellor density', 'M', 'RCC mentions, scaled to 20 — the practice says what its people are.', (s) => scale(s.o.rccCount, 20)],
  ['B', 'Safety and crisis information', 'M', '9-8-8 / crisis line / 911 present.', (s) => yes(s.o.crisisLine)],
  ['B', 'Psychology Today link from the site', 'M', 'Links to its own PT profile (a third-party validation a client recognises).', (s) => yes(s.o.psychologyTodayLink)],
  // C — FIT
  ['C', 'Languages beyond English', 'M', '5 per language named, capped.', (s) => Math.min(10, s.o.languages.length * 5)],
  ['C', 'Breadth of concerns addressed', 'M', 'Distinct concern words, scaled to 60.', (s) => scale(s.o.specialtiesCount, 60)],
  ['C', 'Pages written for a situation', 'M', '"/for/…" style audience pages linked, scaled to 12.', (s) => scale(s.o.audiencePages, 12)],
  ['C', 'Geographic reach stated', 'M', 'Canada-wide 10; two provinces 7; one 5; none 2.', (s) => s.o.canadaWide ? 10 : s.o.provincesNamed.length >= 2 ? 7 : s.o.provincesNamed.length === 1 ? 5 : 2],
  ['C', 'Online delivery', 'M', 'Video/online sessions offered.', (s) => yes(s.o.online)],
  ['C', 'In-person option', 'M', 'An office a client can walk into. Westpeak: none, by design.', (s) => yes(s.o.inPerson && s.k.inPerson !== false)],
  ['C', 'Evenings', 'M', 'Evening appointments mentioned.', (s) => yes(s.o.evenings)],
  ['C', 'Weekends', 'M', 'Weekend appointments mentioned.', (s) => yes(s.o.weekends)],
  ['C', 'Availability signal', 'M', '"Same week" / "within 48 hours" style promise.', (s) => yes(s.o.sameWeek)],
  ['C', '"Accepting new clients" stated', 'M', 'Said in words on the pages read.', (s) => yes(s.o.acceptingNew)],
  // D — CONVERTING
  ['D', 'Online booking system', 'M', 'Jane/Cliniko/Owl/Calendly embedded 10; link only 4; none 0.', (s) => /Jane|Cliniko|Owl|Calendly|Acuity|SimplePractice/.test(s.o.bookingSystem) ? 10 : s.o.bookingSystem === 'link only' ? 4 : 0],
  ['D', 'Free consultation offered', 'M', 'A free consult/discovery call.', (s) => yes(s.o.freeConsult)],
  ['D', 'Consultation length stated', 'M', 'A stated length; 30 minutes scores 10, 15-20 scores 7.', (s) => { const m = Number(s.k.consultMinutes ?? s.o.consultMinutes); return m >= 30 ? 10 : m > 0 ? 7 : 0; }],
  ['D', 'Fees published', 'M', 'Session prices on the site.', (s) => yes(s.o.feesShown)],
  ['D', 'A phone number', 'M', 'A practice number a client can call. Westpeak: none published.', (s) => yes(s.k.phone === false ? false : s.o.phone)],
  ['D', 'Email and a form', 'M', 'mailto link 5, form 5.', (s) => yes(s.o.email, 5) + yes(s.scan?.pages?.some?.((p) => p.hasForm), 5)],
  ['D', 'Response-time promise', 'M', '"Within one business day" or similar.', (s) => yes(s.o.responsePromise)],
  ['D', 'Live chat / instant answer', 'M', 'A chat widget.', (s) => yes(s.o.chat)],
  ['D', 'Booking friction', 'M', 'No intake form before a first conversation 10; intake/consent forms mentioned first 5.', (s) => (s.k.intakeForm ?? s.o.intakeForm) ? 5 : 10],
  ['D', 'Speed of the front door', 'M', 'Homepage time to fetch: <200 ms 10, <500 8, <1000 5, else 2.', (s) => s.ms.home < 200 ? 10 : s.ms.home < 500 ? 8 : s.ms.home < 1000 ? 5 : 2],
  ['D', 'Client-facing pages all reachable', 'M', 'contact, book, fees, team, services found at a guessable URL: 2 each.', (s) => ['contact', 'book', 'fees', 'team', 'services'].filter((p) => hasPage(s, p)).length * 2],
  // E — PAYING
  ['E', 'Direct billing', 'M', 'Direct billing to insurers offered.', (s) => yes(s.o.directBilling)],
  ['E', 'Insurers named', 'M', 'Distinct insurers/payers named, scaled to 5.', (s) => scale(s.o.insurersNamed.length, 5)],
  ['E', 'ICBC', 'M', 'ICBC counselling addressed.', (s) => yes(s.o.icbc)],
  ['E', 'WorkSafeBC', 'M', 'WorkSafeBC claims addressed.', (s) => yes(s.o.worksafe)],
  ['E', 'Low-cost path', 'M', 'Sliding scale, reduced fee, practicum or intern option, or a low-cost resource.', (s) => yes(s.o.slidingScale)],
  ['E', 'EFAP / employer route', 'M', 'EFAP or employer coverage explained.', (s) => yes(s.o.efap)],
  // F — KEEPING AND REFERRING
  ['F', 'Client portal', 'M', 'A signed-in place to book and pay again.', (s) => yes(s.o.portal || s.k.portal)],
  ['F', 'Referral page', 'M/E', 'A page for passing the practice on (Westpeak: /refer). Others: newsletter/subscribe as the nearest proxy.', (s) => yes(s.k.referPage || s.o.newsletter)],
  ['F', 'Newsletter or nurture', 'M', 'A way to stay in touch before someone is ready.', (s) => yes(s.o.newsletter)],
];

if (CATS.length !== 50) throw new Error(`expected 50 categories, have ${CATS.length}`);

const GROUPS = { A: 'Being found', B: 'Trust before contact', C: 'Fit', D: 'Converting', E: 'Paying', F: 'Keeping and referring' };
const scores = sites.map((s) => ({ key: s.key, name: s.name, per: CATS.map((c) => c[4](s)) }));
const total = (x) => x.per.reduce((a, b) => a + b, 0);
const rankIn = (arr, v) => arr.filter((x) => x > v).length + 1;

const order = [...scores].sort((a, b) => total(b) - total(a));
console.log(`# Fifty things that decide whether a client books — Westpeak against ten BC practices, 13 Sep 2026\n`);
console.log(`Measured by \`scripts/acquisition-probe.mjs\` (the pages a client reads: home, contact, book, fees, team, services; plus a Psychology Today search and a Bing index check) and scored by \`scripts/acquisition-50.mjs\`. Every site is scored 0-10 on each category by the same rule, printed beside the category. **Total is out of 500.** Confidence: M measured · S public search · G Search Console · E estimated from a stated proxy.\n`);
console.log(`## Overall\n\n| Rank | Practice | Total /500 |\n|---|---|---|`);
order.forEach((x, i) => console.log(`| ${i + 1} | ${x.key === 'westpeak' ? '**' + x.name + '**' : x.name} | ${x.key === 'westpeak' ? '**' + total(x) + '**' : total(x)} |`));

console.log(`\n## By group (Westpeak's rank of 11 in brackets)\n\n| Group | Westpeak | Best | Best practice |\n|---|---|---|---|`);
for (const [g, name] of Object.entries(GROUPS)) {
  const idx = CATS.map((c, i) => (c[0] === g ? i : -1)).filter((i) => i >= 0);
  const gs = scores.map((x) => ({ key: x.key, name: x.name, v: idx.reduce((a, i) => a + x.per[i], 0) }));
  const w = gs.find((x) => x.key === 'westpeak');
  const best = [...gs].sort((a, b) => b.v - a.v)[0];
  console.log(`| ${name} | ${w.v}/${idx.length * 10} (${rankIn(gs.map((x) => x.v), w.v)}) | ${best.v} | ${best.name} |`);
}

console.log(`\n## All fifty\n\nW = Westpeak's score; rank = among 11; then every competitor.\n`);
const heads = sites.map((s) => s.key === 'westpeak' ? '**W**' : s.key);
console.log(`| # | Category | Conf | ${heads.join(' | ')} | W rank | Rule |`);
console.log(`|---|---|---|${heads.map(() => '---').join('|')}|---|---|`);
CATS.forEach((c, i) => {
  const row = scores.map((x) => x.per[i]);
  const w = scores.find((x) => x.key === 'westpeak').per[i];
  console.log(`| ${i + 1} | ${GROUPS[c[0]].split(' ')[0]}: ${c[1]} | ${c[2]} | ${row.map((v, j) => (scores[j].key === 'westpeak' ? `**${v}**` : v)).join(' | ')} | ${rankIn(row, w)} | ${c[3]} |`);
});

const w = scores.find((x) => x.key === 'westpeak');
const gaps = CATS.map((c, i) => ({ i, c, w: w.per[i], best: Math.max(...scores.map((x) => x.per[i])) })).filter((g) => g.best - g.w >= 5).sort((a, b) => (b.best - b.w) - (a.best - a.w));
console.log(`\n## Where Westpeak trails the field by five points or more\n\n| Category | Westpeak | Best | Gap |\n|---|---|---|---|`);
for (const g of gaps) console.log(`| ${g.c[1]} | ${g.w} | ${g.best} | ${g.best - g.w} |`);
