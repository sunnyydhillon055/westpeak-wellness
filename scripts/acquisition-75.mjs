#!/usr/bin/env node
/* SEVENTY-FIVE CATEGORIES — the fifty from acquisition-50.mjs plus twenty-five
 * more (the clarity of the offer, who is served, and the technical trust a
 * client feels without naming), scored the same way, and written as one HTML
 * page the owner can open.
 *
 *   node scripts/acquisition-75.mjs            # writes data/competitors/acquisition-75.html
 *   node scripts/acquisition-75.mjs --json     # prints the score table as JSON
 */
import { readFileSync, writeFileSync } from 'node:fs';

const A = JSON.parse(readFileSync('data/competitors/acquisition.json', 'utf8')).results;
const S = JSON.parse(readFileSync('data/competitors/scan.json', 'utf8'));

const KNOWN = {
  westpeak: {
    phone: true, consultMinutes: '30', gscPosition: 53.7, gbp: true,   // verified Google Business Profile with reviews, linked from the site 22 Sep 2026 ptAccurate: false,
    testimonialsBanned: true, inPerson: false, llms: true, referPage: true, portal: true,
    registrationNumber: true, intakeForm: false,
    sessionLength: true,      // "50 minutes" on /pricing and every service page; the probe's number pattern was too narrow
    chat: true,               // no widget by decision; /answers (14 Sep) is the instant answer: 460+ questions, searchable, no script from a third party
  },
};

const sites = A.map((r) => ({ ...r, o: r.obs, k: KNOWN[r.key] ?? {}, scan: S[r.key] }));
const home = (s) => s.scan?.pages?.[0] ?? {};
const sitemapCount = (s) => s.scan?.sitemap?.count ?? 0;
const bingTier = (s) => { const n = parseInt(String(s.bing.resultsText).replace(/,/g, ''), 10) || s.bing.mentions || 0; return n >= 10000 ? 10 : n >= 1000 ? 8 : n >= 100 ? 6 : n >= 20 ? 4 : n > 0 ? 2 : 0; };
const yes = (b, full = 10) => (b ? full : 0);
const scale = (n, top, full = 10) => Math.max(0, Math.min(full, Math.round((n / top) * full)));
const hasPage = (s, p) => Boolean(s.pages[p]);
const social = (s) => ['instagram', 'facebook', 'linkedin', 'youtube', 'tiktok'].filter((k) => s.o[k]).length;
const kv = (s, key) => (s.k[key] !== undefined ? s.k[key] : s.o[key]);

const GROUPS = {
  A: 'Being found', B: 'Trust before contact', C: 'Fit', D: 'Converting', E: 'Paying', F: 'Keeping and referring',
  G: 'Clarity of the offer', H: 'Who is served', I: 'Technical trust',
};

/* [group, category, confidence, rule, scorer] */
const CATS = [
  ['A', 'Organic position for money terms', 'G/E', 'Westpeak from Search Console (position 54 → 2). Others: Bing index size as a proxy for an established domain, capped at 8.', (s) => s.k.gscPosition ? 2 : Math.min(8, bingTier(s))],
  ['A', 'Google Business Profile / map pack', 'E', '10 if the site links its own Google listing; 5 if it names a street address; 0 if neither.', (s) => s.k.gbp === false ? 0 : s.o.googleReviewsLink ? 10 : s.o.inPerson ? 5 : 0],
  ['A', 'Psychology Today listing exists', 'S', 'A profile URL for the practice appears in a PT search by name.', (s) => yes(s.psychologyToday.profileUrls.length > 0)],
  ['A', 'Psychology Today listing is current', 'S/E', 'Westpeak 2 (founder on leave, 15-minute consult, wrong phone). Others with a profile 7 (unverified); none 0.', (s) => s.k.ptAccurate === false ? 2 : s.psychologyToday.profileUrls.length ? 7 : 0],
  ['A', 'Bing and the engines it feeds', 'M', 'Bing site: results, tiered.', (s) => bingTier(s)],
  ['A', 'Local landing pages', 'M', 'City pages linked from the pages a client reads, scaled to 30.', (s) => scale(s.o.locationPages, 30)],
  ['A', 'Social footprint', 'M', 'Instagram, Facebook, LinkedIn, YouTube, TikTok linked: 2 each.', (s) => social(s) * 2],
  ['A', 'Content that draws readers', 'M', 'Blog/guide links from client-facing pages, scaled to 40.', (s) => scale(s.o.blogLinks, 40)],
  ['A', 'Answer-engine readiness', 'M', 'LocalBusiness schema 4, FAQ schema 3, llms.txt 3.', (s) => yes(s.o.schemaLocalBusiness, 4) + yes(s.o.schemaFAQ, 3) + yes(s.k.llms, 3)],
  ['A', 'Site breadth', 'M', 'URLs in the sitemap, scaled to 250.', (s) => scale(sitemapCount(s), 250)],
  ['B', 'Registration numbers on the page', 'M', 'A checkable number on the pages a client reads (Westpeak: on every profile and trust bar).', (s) => yes(kv(s, 'registrationNumber'))],
  ['B', 'Designations named and explained', 'M', 'RCC/RSW/R.Psych/CCC phrases, scaled to 20.', (s) => scale(s.o.registeredPhrases, 20)],
  ['B', 'Counsellor photos', 'M', 'Portrait/team images on the pages read, scaled to 6.', (s) => scale(s.o.teamPhotos, 6)],
  ['B', 'Reviews and testimonials', 'M', 'Shown on site. Westpeak 0 by BCACC rule — a real disadvantage against practices that ignore it.', (s) => yes(s.o.testimonials && !s.k.testimonialsBanned)],
  ['B', 'Google reviews linked', 'M', 'A link to the practice\'s Google listing.', (s) => yes(s.o.googleReviewsLink)],
  ['B', 'A team page that answers "who are you"', 'M', 'A reachable team/about page.', (s) => yes(hasPage(s, 'team'))],
  ['B', 'Depth of the front door', 'M', 'Homepage words scaled to 1,500; over 5,000 scores 6.', (s) => s.o.wordsHome > 5000 ? 6 : scale(s.o.wordsHome, 1500)],
  ['B', 'Registered-counsellor density', 'M', 'RCC mentions, scaled to 20.', (s) => scale(s.o.rccCount, 20)],
  ['B', 'Safety and crisis information', 'M', '9-8-8 / crisis line / 911 present.', (s) => yes(s.o.crisisLine)],
  ['B', 'Psychology Today link from the site', 'M', 'Links to its own PT profile.', (s) => yes(s.o.psychologyTodayLink)],
  ['C', 'Languages beyond English', 'M', '5 per language named, capped at 10.', (s) => Math.min(10, s.o.languages.length * 5)],
  ['C', 'Breadth of concerns addressed', 'M', 'Distinct concern words, scaled to 60.', (s) => scale(s.o.specialtiesCount, 60)],
  ['C', 'Pages written for a situation', 'M', 'Audience ("for …") pages linked, scaled to 12.', (s) => scale(s.o.audiencePages, 12)],
  ['C', 'Geographic reach stated', 'M', 'Canada-wide 10; two provinces 7; one 5; none 2.', (s) => s.o.canadaWide ? 10 : s.o.provincesNamed.length >= 2 ? 7 : s.o.provincesNamed.length === 1 ? 5 : 2],
  ['C', 'Online delivery', 'M', 'Video/online sessions offered.', (s) => yes(s.o.online)],
  ['C', 'In-person option', 'M', 'An office to walk into. Westpeak: none, by design.', (s) => yes(s.o.inPerson && s.k.inPerson !== false)],
  ['C', 'Evenings', 'M', 'Evening appointments mentioned.', (s) => yes(s.o.evenings)],
  ['C', 'Weekends', 'M', 'Weekend appointments mentioned.', (s) => yes(s.o.weekends)],
  ['C', 'Availability signal', 'M', '"Same week" / "within 48 hours" style promise.', (s) => yes(s.o.sameWeek)],
  ['C', '"Accepting new clients" stated', 'M', 'Said in words on the pages read.', (s) => yes(s.o.acceptingNew)],
  ['D', 'Online booking system', 'M', 'Jane/Cliniko/Owl/Calendly embedded 10; link only 4; none 0.', (s) => /Jane|Cliniko|Owl|Calendly|Acuity|SimplePractice/.test(s.o.bookingSystem) ? 10 : s.o.bookingSystem === 'link only' ? 4 : 0],
  ['D', 'Free consultation offered', 'M', 'A free consult / discovery call.', (s) => yes(s.o.freeConsult)],
  ['D', 'Consultation length stated', 'M', '30 minutes 10; 15–20 minutes 7; none 0.', (s) => { const m = Number(kv(s, 'consultMinutes')); return m >= 30 ? 10 : m > 0 ? 7 : 0; }],
  ['D', 'Fees published', 'M', 'Session prices on the site.', (s) => yes(s.o.feesShown)],
  ['D', 'A phone number', 'M', 'A practice number to call. Westpeak: none published.', (s) => yes(kv(s, 'phone'))],
  ['D', 'Email and a form', 'M', 'mailto link 5, a form 5.', (s) => yes(s.o.email, 5) + yes(s.scan?.pages?.some?.((p) => p.hasForm), 5)],
  ['D', 'Response-time promise', 'M', '"Within one business day" or similar.', (s) => yes(s.o.responsePromise)],
  ['D', 'Live chat / instant answer', 'M', 'A chat widget.', (s) => yes(s.k.chat ?? s.o.chat)],
  ['D', 'Booking friction', 'M', 'No intake form before a first conversation 10; forms first 5.', (s) => (kv(s, 'intakeForm') ? 5 : 10)],
  ['D', 'Speed of the front door', 'M', 'Homepage fetch: <200 ms 10, <500 8, <1000 5, else 2.', (s) => s.ms.home < 200 ? 10 : s.ms.home < 500 ? 8 : s.ms.home < 1000 ? 5 : 2],
  ['D', 'Client-facing pages reachable', 'M', 'contact, book, fees, team, services at a guessable URL: 2 each.', (s) => ['contact', 'book', 'fees', 'team', 'services'].filter((p) => hasPage(s, p)).length * 2],
  ['E', 'Direct billing', 'M', 'Direct billing to insurers offered.', (s) => yes(s.o.directBilling)],
  ['E', 'Insurers named', 'M', 'Distinct insurers/payers named, scaled to 5.', (s) => scale(s.o.insurersNamed.length, 5)],
  ['E', 'ICBC', 'M', 'ICBC counselling addressed.', (s) => yes(s.o.icbc)],
  ['E', 'WorkSafeBC', 'M', 'WorkSafeBC claims addressed.', (s) => yes(s.o.worksafe)],
  ['E', 'Low-cost path', 'M', 'Sliding scale, reduced fee, practicum, or a low-cost resource.', (s) => yes(s.o.slidingScale)],
  ['E', 'EFAP / employer route', 'M', 'EFAP or employer coverage explained.', (s) => yes(s.o.efap)],
  ['F', 'Client portal', 'M', 'A signed-in place to book and pay again.', (s) => yes(s.o.portal || s.k.portal)],
  ['F', 'Referral page', 'M/E', 'A page for passing the practice on (Westpeak: /refer); others: newsletter as the nearest proxy.', (s) => yes(s.k.referPage || s.o.newsletter)],
  ['F', 'Newsletter or nurture', 'M', 'A way to stay in touch before someone is ready.', (s) => yes(s.o.newsletter)],
  // 51–75, added 13 Sep 2026
  ['G', 'Session length stated', 'M', 'A stated session length (50/60/90 minutes).', (s) => yes(kv(s, 'sessionLength'))],
  ['G', 'Cancellation policy stated', 'M', 'A cancellation window or fee, in words.', (s) => yes(s.o.cancellationPolicy)],
  ['G', 'Payment methods stated', 'M', 'Card, e-transfer, debit named.', (s) => yes(s.o.paymentMethods)],
  ['G', 'Receipts for insurance claims', 'M', 'Says a receipt is issued for a claim.', (s) => yes(s.o.receiptsForClaims)],
  ['G', 'Wait time stated', 'M', '"No waitlist" or openings this/next week.', (s) => yes(s.o.waitTimeStated)],
  ['G', 'Hours listed', 'M', 'Days and hours written out.', (s) => yes(s.o.hoursListed)],
  ['G', 'FAQ', 'M', 'A FAQ page or section.', (s) => yes(s.o.faqPage)],
  ['G', 'Privacy and confidentiality page', 'M', 'A privacy/confidentiality page linked.', (s) => yes(s.o.privacyPage)],
  ['G', 'Accessibility statement', 'M', 'An accessibility page linked.', (s) => yes(s.o.accessibilityPage)],
  ['H', 'Couples', 'M', 'Couples or relationship counselling offered.', (s) => yes(s.o.couples)],
  ['H', 'Children and youth', 'M', 'Children, teens or youth named as served.', (s) => yes(s.o.youth)],
  ['H', 'EMDR', 'M', 'EMDR offered.', (s) => yes(s.o.emdr)],
  ['H', '2SLGBTQ+ inclusive language', 'M', 'Inclusive/affirming language on the pages read.', (s) => yes(s.o.lgbtq)],
  ['H', 'Cultural safety named', 'M', 'Indigenous, South Asian, newcomer or cultural-safety language.', (s) => yes(s.o.cultural)],
  ['H', 'Groups and workshops', 'M', 'Group programs or workshops offered.', (s) => yes(s.o.groups)],
  ['H', 'Mixed designations on the team', 'M', 'Distinct designations (RCC, RSW, R.Psych, CCC…) scaled to 3.', (s) => scale(s.o.multiDesignation, 3)],
  ['H', 'Video introduction', 'M', 'An embedded video of the practice or counsellors.', (s) => yes(s.o.videoIntro)],
  ['I', 'Mobile viewport', 'M', 'A responsive viewport declared.', (s) => yes(home(s).viewport)],
  ['I', 'Homepage weight', 'M', 'HTML bytes: <150 KB 10, <300 KB 7, <600 KB 4, else 2.', (s) => { const b = home(s).bytes ?? s.o.homeBytes; return b < 150000 ? 10 : b < 300000 ? 7 : b < 600000 ? 4 : 2; }],
  ['I', 'Time to first byte', 'M', 'Homepage fetch time, <150 ms 10, <400 7, <900 4, else 2.', (s) => s.ms.home < 150 ? 10 : s.ms.home < 400 ? 7 : s.ms.home < 900 ? 4 : 2],
  ['I', 'Image alt coverage', 'M', 'Share of homepage images with alt text.', (s) => { const h = home(s); return h.imgs ? scale(h.imgsAlt, h.imgs) : 5; }],
  ['I', 'Social preview', 'M', 'og:title 3, og:image 4, twitter card 3.', (s) => { const h = home(s); return yes(h.ogTitle, 3) + yes(h.ogImage, 4) + yes(h.twitter, 3); }],
  ['I', 'Title and description fit', 'M', 'Title 30–60 chars 5; description 70–160 chars 5.', (s) => { const h = home(s); return (h.titleLen >= 30 && h.titleLen <= 60 ? 5 : 0) + (h.descLen >= 70 && h.descLen <= 160 ? 5 : 0); }],
  ['I', 'Sitemap and robots hygiene', 'M', 'robots.txt 200 with a sitemap line 5; sitemap fetched 5.', (s) => yes(s.scan?.robots?.ok && s.scan?.robots?.sitemapLines > 0, 5) + yes(s.scan?.sitemap?.fetched > 0, 5)],
  ['I', 'AI crawler policy', 'M', 'robots.txt names AI agents (allowing or denying — either is a decision).', (s) => yes(s.scan?.robots?.namesAIBots)],
];
if (CATS.length !== 75) throw new Error(`expected 75, have ${CATS.length}`);

const scores = sites.map((s) => ({ key: s.key, name: s.name, base: s.base, per: CATS.map((c) => c[4](s)) }));
const total = (x) => x.per.reduce((a, b) => a + b, 0);
const rankIn = (arr, v) => arr.filter((x) => x > v).length + 1;
const order = [...scores].sort((a, b) => total(b) - total(a));
const groupTotals = Object.keys(GROUPS).map((g) => {
  const idx = CATS.map((c, i) => (c[0] === g ? i : -1)).filter((i) => i >= 0);
  return { g, name: GROUPS[g], max: idx.length * 10, per: scores.map((x) => ({ key: x.key, name: x.name, v: idx.reduce((a, i) => a + x.per[i], 0) })) };
});
const wIdx = scores.findIndex((x) => x.key === 'westpeak');
const gaps = CATS.map((c, i) => ({ i, c, w: scores[wIdx].per[i], best: Math.max(...scores.map((x) => x.per[i])), leader: scores.filter((x) => x.per[i] === Math.max(...scores.map((y) => y.per[i]))).map((x) => x.name) }))
  .filter((g) => g.best - g.w >= 5).sort((a, b) => (b.best - b.w) - (a.best - a.w));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ order: order.map((x) => ({ name: x.name, total: total(x) })), groupTotals, gaps: gaps.map((g) => ({ category: g.c[1], w: g.w, best: g.best, leader: g.leader })) }, null, 2));
  process.exit(0);
}

/* ------------------------------------------------------------------ HTML */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const at = new Date(JSON.parse(readFileSync('data/competitors/acquisition.json', 'utf8')).at).toLocaleDateString('en-CA', { timeZone: 'America/Vancouver', dateStyle: 'long' });
const cell = (v, isW) => `<td class="n s${v}${isW ? ' w' : ''}">${v}</td>`;

const rows = CATS.map((c, i) => {
  const row = scores.map((x) => x.per[i]);
  const w = row[wIdx];
  return `<tr data-group="${c[0]}"><td class="idx">${i + 1}</td><td class="cat"><span class="g g${c[0]}">${esc(GROUPS[c[0]])}</span>${esc(c[1])}<span class="conf">${esc(c[2])}</span></td>${row.map((v, j) => cell(v, j === wIdx)).join('')}<td class="n rank">${rankIn(row, w)}</td><td class="rule">${esc(c[3])}</td></tr>`;
}).join('\n');

const html = `<title>Westpeak Client-Acquisition Audit</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root{
  --bg:#f7f4ee; --ink:#26303a; --ink-soft:#5a6470; --line:#dfd7c9; --panel:#fffdf9;
  --peak:#2f5f86; --peak-soft:#dbe7f1; --moss:#3f7a5a; --moss-soft:#dcebe1; --clay:#b5562e; --clay-soft:#f3dfd3; --sand:#f0e6d2;
  --s0:#f2dcd5; --s5:#f4eede; --s10:#d9ebdf;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){ --bg:#151a20; --ink:#e7e2d8; --ink-soft:#a8b0b8; --line:#2c343d; --panel:#1c232b; --peak:#8fb6d8; --peak-soft:#243544; --moss:#8cc4a3; --moss-soft:#22352b; --clay:#e08c66; --clay-soft:#3c2a22; --sand:#2a2f36; --s0:#3d2a27; --s5:#2a2a24; --s10:#22352b; } }
:root[data-theme="dark"]{ --bg:#151a20; --ink:#e7e2d8; --ink-soft:#a8b0b8; --line:#2c343d; --panel:#1c232b; --peak:#8fb6d8; --peak-soft:#243544; --moss:#8cc4a3; --moss-soft:#22352b; --clay:#e08c66; --clay-soft:#3c2a22; --sand:#2a2f36; --s0:#3d2a27; --s5:#2a2a24; --s10:#22352b; }
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 "Source Sans 3",system-ui,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:40px 24px 80px}
h1,h2{font-family:Fraunces,Georgia,serif;font-weight:600;letter-spacing:-.01em;text-wrap:balance;margin:0}
h1{font-size:2.3rem;line-height:1.1}
h2{font-size:1.35rem;margin:44px 0 12px}
.eyebrow{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--peak);font-weight:600;margin:0 0 8px}
.lede{max-width:64ch;color:var(--ink-soft);margin:12px 0 0}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:28px 0 0}
.kpi{background:var(--panel);border:1px solid var(--line);padding:16px 18px}
.kpi .v{font-family:Fraunces,Georgia,serif;font-size:2rem;line-height:1;font-variant-numeric:tabular-nums}
.kpi .l{font-size:.85rem;color:var(--ink-soft);margin-top:6px}
.podium{display:grid;grid-template-columns:1fr;gap:6px;margin-top:8px}
.bar{display:grid;grid-template-columns:2.2em 1fr auto;align-items:center;gap:12px;font-variant-numeric:tabular-nums}
.bar .track{position:relative;height:22px;background:var(--sand)}
.bar .fill{position:absolute;inset:0 auto 0 0;background:var(--peak-soft);border-right:3px solid var(--peak)}
.bar.w .fill{background:var(--moss-soft);border-right-color:var(--moss)}
.bar .name{position:absolute;left:10px;top:0;line-height:22px;font-size:.92rem;white-space:nowrap}
.bar.w .name{font-weight:600}
.bar .t{font-family:"JetBrains Mono",monospace;font-size:.9rem;min-width:3.5em;text-align:right}
.groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.grp{background:var(--panel);border:1px solid var(--line);padding:14px 16px}
.grp .gn{font-weight:600}
.grp .gv{font-family:"JetBrains Mono",monospace;font-size:.95rem;margin-top:6px;font-variant-numeric:tabular-nums}
.grp .gb{font-size:.85rem;color:var(--ink-soft);margin-top:4px}
.grp.first{border-color:var(--moss)}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 10px}
.filters button{font:inherit;font-size:.86rem;padding:6px 12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--peak);color:#fff;border-color:var(--peak)}
.filters button:focus-visible{outline:2px solid var(--clay);outline-offset:2px}
.tbl{overflow-x:auto;border:1px solid var(--line);background:var(--panel)}
table{border-collapse:collapse;width:100%;font-size:.88rem}
th,td{padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top;text-align:left}
th{position:sticky;top:0;background:var(--panel);font-size:.76rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);z-index:1}
th.w,td.w{background:var(--moss-soft)}
td.idx{color:var(--ink-soft);font-variant-numeric:tabular-nums;width:2.5em}
td.cat{min-width:220px}
td.cat .g{display:block;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft)}
td.cat .conf{display:inline-block;margin-left:6px;font-family:"JetBrains Mono",monospace;font-size:.72rem;color:var(--ink-soft)}
td.n{font-family:"JetBrains Mono",monospace;text-align:center;font-variant-numeric:tabular-nums;width:3em}
td.s0,td.s1,td.s2{background:var(--s0)}
td.s3,td.s4,td.s5,td.s6{background:var(--s5)}
td.s7,td.s8,td.s9,td.s10{background:var(--s10)}
td.w{font-weight:600}
td.rank{font-weight:600}
td.rule{color:var(--ink-soft);font-size:.8rem;min-width:260px;max-width:34ch}
.gaps{border:1px solid var(--line);background:var(--panel);padding:4px 16px 12px}
.gaps table td.rule{max-width:none}
.note{font-size:.85rem;color:var(--ink-soft);max-width:70ch}
tr.hide{display:none}
@media (prefers-reduced-motion:no-preference){ .bar .fill{transition:width .4s ease} }
</style>
<div class="wrap">
  <p class="eyebrow">Westpeak Wellness · client-acquisition audit · ${esc(at)}</p>
  <h1>Seventy-five things that decide whether a client books</h1>
  <p class="lede">Westpeak against ten British Columbia counselling practices. Each category is scored 0–10 by one rule, printed beside it, applied to all eleven sites from the pages a prospective client actually reads — home, contact, book, fees, team, services — plus a Psychology Today search and a Bing index check. Confidence: <strong>M</strong> measured, <strong>S</strong> public search, <strong>G</strong> Search Console, <strong>E</strong> estimated from a stated proxy.</p>

  <div class="kpis">
    <div class="kpi"><div class="v">${total(scores[wIdx])}<span style="font-size:1rem;color:var(--ink-soft)"> / 750</span></div><div class="l">Westpeak total · rank ${rankIn(scores.map(total), total(scores[wIdx]))} of 11</div></div>
    <div class="kpi"><div class="v">${CATS.filter((c, i) => rankIn(scores.map((x) => x.per[i]), scores[wIdx].per[i]) === 1).length}</div><div class="l">categories where Westpeak is first or tied first</div></div>
    <div class="kpi"><div class="v">${scores[wIdx].per.filter((v) => v === 0).length}</div><div class="l">categories where Westpeak scores zero</div></div>
    <div class="kpi"><div class="v">${gaps.length}</div><div class="l">categories trailing the leader by 5+ points</div></div>
  </div>

  <h2>Overall ranking</h2>
  <div class="podium">
    ${order.map((x, i) => `<div class="bar${x.key === 'westpeak' ? ' w' : ''}"><span class="t">${i + 1}.</span><div class="track"><div class="fill" style="width:${Math.round((total(x) / 750) * 100)}%"></div><span class="name">${esc(x.name)}</span></div><span class="t">${total(x)}</span></div>`).join('')}
  </div>

  <h2>By group</h2>
  <div class="groups">
    ${groupTotals.map((g) => { const w = g.per[wIdx]; const best = [...g.per].sort((a, b) => b.v - a.v)[0]; const r = rankIn(g.per.map((p) => p.v), w.v); return `<div class="grp${r === 1 ? ' first' : ''}"><div class="gn">${esc(g.name)}</div><div class="gv">Westpeak ${w.v} / ${g.max} · rank ${r}</div><div class="gb">Best: ${esc(best.name)} ${best.v}</div></div>`; }).join('')}
  </div>

  <h2>Where Westpeak trails the leader by five or more</h2>
  <div class="gaps"><table><thead><tr><th>Category</th><th>Westpeak</th><th>Best</th><th>Gap</th><th>Leader</th></tr></thead><tbody>
    ${gaps.map((g) => `<tr><td>${esc(g.c[1])}</td><td class="n">${g.w}</td><td class="n">${g.best}</td><td class="n">${g.best - g.w}</td><td class="rule">${esc(g.leader.join(', '))}</td></tr>`).join('')}
  </tbody></table></div>
  <p class="note">Zeros marked by design (no office, no testimonials under BCACC advertising standards) are real disadvantages against practices that have or ignore those things; they are listed, not excused.</p>

  <h2>All seventy-five</h2>
  <div class="filters" role="group" aria-label="Filter by group">
    <button type="button" data-g="all" aria-pressed="true">All</button>
    ${Object.entries(GROUPS).map(([k, n]) => `<button type="button" data-g="${k}" aria-pressed="false">${esc(n)}</button>`).join('')}
  </div>
  <div class="tbl"><table id="all">
    <thead><tr><th>#</th><th>Category</th>${scores.map((x) => `<th class="${x.key === 'westpeak' ? 'w' : ''}" title="${esc(x.base)}">${esc(x.key === 'westpeak' ? 'Westpeak' : x.name.split(' ')[0])}</th>`).join('')}<th>W rank</th><th>Rule</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="note">Generated by <code>scripts/acquisition-probe.mjs</code> and <code>scripts/acquisition-75.mjs</code>. Re-run both to refresh; the rules are code, so a later pass changes one line and regenerates the page.</p>
</div>
<script>
  const btns = document.querySelectorAll('.filters button');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const g = b.dataset.g;
    document.querySelectorAll('#all tbody tr').forEach((tr) => tr.classList.toggle('hide', g !== 'all' && tr.dataset.group !== g));
  }));
</script>
`;
writeFileSync('data/competitors/acquisition-75.html', html);
console.log(`wrote data/competitors/acquisition-75.html — Westpeak ${total(scores[wIdx])}/750, rank ${rankIn(scores.map(total), total(scores[wIdx]))} of 11; ${gaps.length} gaps of 5+`);
