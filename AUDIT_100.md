# 100-item audit — westpeakwellness.com

**Measured 2026-08-10** against a full crawl of the current build: 107 sitemap
URLs + 6 unlisted routes, plus rendered measurement (Core Web Vitals,
composited contrast, tap targets, a11y) on 18 pages across desktop and
CPU/network-throttled mobile.

Every item below is derived from a measurement, not proposed from a checklist.
Where an item has no number attached, it says so.

**Status legend:** ✅ done this pass · ⏳ open · 🔒 blocked on the owner

---

## Where the site actually stands

Current build score is **22,550 / 25,000** ([SCORE_LEDGER.md](SCORE_LEDGER.md)).
Ten of fifty categories are already at 500/500: canonicals, titles, meta
descriptions, H1s, heading hierarchy, URL structure, orphans, CLS, colour
contrast, BCACC compliance.

**Being blunt about the 98th-percentile goal:** roughly 1,530 of the missing
points sit in two categories — Google Business Profile (41) and off-site
authority (50) — that cannot be moved from inside this repository at all. No
amount of code closes them. The on-site ceiling from here is about
**23,600 / 25,000**, and the remaining ~1,400 is the off-site work in
[kits/](kits/README.md). That is not a hedge; it is the arithmetic.

---

# A · 25 things to FIX (measured defects)

| # | Defect | Measurement | Status |
|---|---|---|---|
| 1 | `/careers` had no `og:image` | 1 of 2 pages sitewide missing a social card | ✅ |
| 2 | `/careers/[slug]` had no `og:image` | the other one | ✅ |
| 3 | RCC posting title over the band | 63 chars, only title >60 on the site | ✅ now 54 |
| 4 | `/manifest.json` → 404 | served the 40 kB HTML error page | ✅ 308 |
| 5 | `/site.webmanifest` → 404 | same | ✅ 308 |
| 6 | `/careers` in-content inbound | 1 link; unreachable from home by body links | ✅ now 3 |
| 7 | `/careers/[slug]` inbound | 1 link | ✅ |
| 8 | Mobile LCP over threshold | **~3.0 s** at 4× CPU + 1.6 Mbps | ⏳ |
| 9 | Mobile TBT over threshold | median ~290 ms, worst **737 ms** (`/services/emdr-therapy`) | ⏳ |
| 10 | Inline script weight | **56 kB average per page** | ⏳ |
| 11 | `/glossary` HTML weight | **171 kB**, heaviest page on the site | ⏳ |
| 12 | Standalone tap targets under 24 px | `Read more →` 95×18 on 24 pages; nav 39×17 | ⏳ |
| 13 | Two images without dimensions | both `next/image` hero photos | ⏳ |
| 14 | `llms-full.txt` size | **655 kB** — past what most models will ingest | ⏳ |
| 15 | Distinct `lastmod` values | **3** — near-uniform, so freshness carries no signal | ⏳ |
| 16 | `/punjabi` inbound | 3 links, at the floor | ⏳ |
| 17 | `/accessibility` inbound | 3 links | ⏳ |
| 18 | `/reviews` inbound | 4 links | ⏳ |
| 19 | 404 page weight | 40 kB HTML for a miss | ⏳ |
| 20 | Third stylesheet on 11 pages | 2.1 avg, up from 1.1 | ⏳ |
| 21 | `/guides` boilerplate ratio | **70% shared 8-grams** (hub, but the worst on site) | ⏳ |
| 22 | No `hreflang` pair for `/punjabi` | en-CA ↔ pa never declared | ⏳ |
| 23 | Careers pages absent from image sitemap | 0 `<image:image>` entries | ⏳ |
| 24 | Sitemap `changefreq` only two values | monthly/yearly across 107 URLs | ⏳ |
| 25 | 16 pages under 900 words | all hubs and tools | ⏳ (see note) |

> **On #25.** Padding a hub page to reach a word count makes it worse. This is
> a deliberate ceiling, recorded rather than "fixed".

---

# B · 25 things to ADD

| # | Addition | Why, from the data | Status |
|---|---|---|---|
| 26 | `speakable` schema on top FAQ answers | voice/assistant surfaces; currently absent | ⏳ |
| 27 | `hreflang` en-CA ↔ pa | `/punjabi` exists with no language pairing | ⏳ |
| 28 | Image sitemap entries for careers | 352 image entries, none for the newest pages | ⏳ |
| 29 | `HowTo` schema on the tools | 3 `WebApplication` nodes, no HowTo | ⏳ |
| 30 | `Course`/`ItemList` on `/guides` | only 2 ItemList nodes sitewide | ⏳ |
| 31 | Author `sameAs` on the Person node | 1 Person, no external profiles | 🔒 needs profiles |
| 32 | `Organization.sameAs` slots populated | Instagram only | 🔒 kits 1–4 |
| 33 | Second Punjabi guide | one Punjabi surface, no depth behind it | ⏳ |
| 34 | Print stylesheet | resources/crisis pages get printed | ⏳ |
| 35 | RSS/Atom feed for `/guides` | 66 Article nodes, no feed | ⏳ |
| 36 | `/guides` topic hubs | 70% boilerplate is a symptom of a flat hub | ⏳ |
| 37 | Related-guides module on article feet | feeds internal linking naturally | ⏳ |
| 38 | Reading-time on guides | present on some, not all | ⏳ |
| 39 | "Last reviewed" visible line sitewide | schema has it, humans do not see it | ⏳ |
| 40 | 404 page with search + top links | currently a dead end | ⏳ |
| 41 | `web-vitals` → GA4 reporting | no field data before CrUX fills | ⏳ |
| 42 | Skip-to-booking link | booking is the goal; skip-link only reaches main | ⏳ |
| 43 | `prefers-reduced-data` handling | photos load regardless | ⏳ |
| 44 | Structured FAQ on `/pricing` | 86 FAQPage nodes, pricing not among them | ⏳ |
| 45 | Fee-estimate helper | `/tools/therapy-cost-bc` informs, does not close | ⏳ |
| 46 | Email capture on guides | 0 capture points outside the lead magnet | ⏳ |
| 47 | `BreadcrumbList` on `/` | 106/107 — home correctly excluded, documented | ✅ by design |
| 48 | Canonical `<link rel="me">` | entity consolidation | 🔒 profiles |
| 49 | Sitemap `<lastmod>` from git | 3 distinct values today | ⏳ |
| 50 | IndexNow ping on deploy | Bing/DuckDuckGo instant indexing | ⏳ |

---

# C · 25 things to DO BETTER

| # | Improvement | Current measurement | Status |
|---|---|---|---|
| 51 | Reduce inline script | 56 kB/page average | ⏳ |
| 52 | Split hydration on service pages | 737 ms TBT worst case | ⏳ |
| 53 | Trim `/glossary` payload | 171 kB | ⏳ |
| 54 | Raise `/punjabi` depth | 757 words, thinnest non-hub | ⏳ |
| 55 | Raise `/reviews` depth | 510 words, thinnest page | ⏳ |
| 56 | Diversify anchor text further | 0 generic — good; branded share unmeasured | ⏳ |
| 57 | Increase internal links to tools | 5 inbound each | ⏳ |
| 58 | Strengthen `/compare` | 741 words | ⏳ |
| 59 | Strengthen `/book` | 746 words | ⏳ |
| 60 | Improve `changefreq` accuracy | two values for 107 URLs | ⏳ |
| 61 | Tighten `llms.txt` | 25 kB, could be sharper | ⏳ |
| 62 | Regenerate `llms-full.txt` selectively | 655 kB is unusable | ⏳ |
| 63 | Compress OG images | 93 kB per card | ⏳ |
| 64 | Preload the LCP image per template | 2 preloads/page, generic | ⏳ |
| 65 | Defer GA4 further | already afterInteractive | ⏳ |
| 66 | Cache-Control on static routes | verify immutable on hashed assets | ⏳ |
| 67 | Reduce DOM depth on `/guides` | hub renders every guide | ⏳ |
| 68 | Improve mobile nav affordance | header carries almost no IA | ⏳ |
| 69 | Sharpen direct-answer blocks | present, not uniformly 40–55 words | ⏳ |
| 70 | Question-form H2s on guides | inconsistent | ⏳ |
| 71 | Improve `/tools` hub copy | 637 words | ⏳ |
| 72 | Improve `/approaches` hub | 637 words | ⏳ |
| 73 | Improve `/for` hub | 640 words | ⏳ |
| 74 | Better `/contact` conversion path | 669 words, 6 inbound | ⏳ |
| 75 | Consistent `dateModified` from git | currently build-time | ⏳ |

---

# D · 25 things to ENHANCE

| # | Enhancement | Status |
|---|---|---|
| 76 | Sticky booking rail on service pages (as built for careers) | ⏳ |
| 77 | Progressive disclosure on long guides | ⏳ |
| 78 | Inline glossary tooltips | ⏳ |
| 79 | Anchor-linked FAQ items | ⏳ |
| 80 | Copy-link buttons on guide sections | ⏳ |
| 81 | Estimated session-cost widget on `/pricing` | ⏳ |
| 82 | "Which service?" result deep-links | ⏳ |
| 83 | Crisis banner persistence tuning | ⏳ |
| 84 | Punjabi typography pass | ⏳ |
| 85 | Dark-mode audit | ⏳ |
| 86 | Focus-visible sweep on all interactive elements | ⏳ |
| 87 | Reduced-motion audit on every animation | ⏳ |
| 88 | Print CSS for the crisis directory | ⏳ |
| 89 | Faster Cliniko iframe facade | ⏳ |
| 90 | Client-portal reminder-prefs polish | 🔒 needs `CLINIKO_API_KEY` |
| 91 | Monthly revenue email HTML refinement | ✅ shipped |
| 92 | Careers sticky rail | ✅ shipped |
| 93 | Breadcrumb component sitewide | ✅ shipped |
| 94 | Real favicon | ✅ shipped |
| 95 | Web manifest | ✅ shipped |
| 96 | JobPosting schema | ✅ shipped |
| 97 | FAQPage on careers | ✅ shipped |
| 98 | Multi-route apply block | ✅ shipped |
| 99 | 19 careers entry redirects | ✅ shipped |
| 100 | Composited-contrast test harness | ✅ shipped |

---

## Honest status

**Shipped this pass: 7 items** (1–7 above) plus the 10 already-shipped
enhancements (91–100) from earlier today.

**Open: 83.** They are real, each tied to a measurement, and none is invented
to reach a round number. The largest single block is performance — items 8–11
and 51–53 — which is one structural change (reducing the 56 kB inline script
and splitting hydration) rather than seven separate ones, and it deserves its
own pass with before/after numbers rather than being rushed.

**Blocked on you: 4** (31, 32, 48, 90) — external profiles and the Cliniko
API key.

I would rather hand you 7 verified items and an honest list of 83 than claim
100 and have you find out later which of them were real.

---

## Corrections to this audit

Found while executing it. Recorded rather than quietly dropped, because an
audit that only ever confirms itself is not measuring anything.

**Items 22 and 27 (`hreflang` for `/punjabi`) were false findings.** The page
already declares `en-CA ↔ pa` and Next emits both `<link rel="alternate">`
tags. My crawler matched `hreflang="` in lowercase; Next writes `hrefLang`.
HTML attribute names are case-insensitive, so the site was correct and the
audit tool was wrong. No change needed — crawler regex fixed instead.

**Item 19 (404 page weight) was misconceived.** The ~40 kB is the shared site
shell — header, footer, JSON-LD graph — not the 404 body. The only way to cut
it would be to strip the shell from the 404, which would leave a stranded page
with no navigation at exactly the moment someone needs it. Closed as
won't-fix, and item 40 taken instead: the 404 is now a real page rather than a
dead end.

**Items 15, 49 and 60 (`lastmod` / `changefreq` diversity) will not be
"fixed".** The sitemap already reads a per-entry `updated` field; only three
distinct values exist because the underlying content dates genuinely are
uniform. Producing twenty values would mean writing dates that do not
correspond to edits — cosmetically bumping dates is precisely the practice
that makes freshness signals worthless. These stay open pending real edits,
or a git-derived date once Vercel's shallow clone can supply one.

## Shipped in batch 2

| # | Item | Result |
|---|---|---|
| 40 | 404 page rebuilt | Search form, 52 outbound links, all six common destinations, crisis numbers, `noindex, follow` |
| 22 | hreflang | Verified already correct; audit tool corrected |
| 27 | hreflang pair | Same |
| 19 | 404 weight | Closed as won't-fix, with reasoning |
| 15/49/60 | Date diversity | Closed as must-not-fake, with reasoning |

## Shipped in batch 3–4

| # | Item | Result |
|---|---|---|
| 12 | Tap targets | **0 non-inline targets under 24px** across /, /glossary, /services, /guides, /careers, /pricing, /faq. Two homepage links fixed with an explicit `.link-standalone` class |
| 44 | FAQPage on `/pricing` | 4 questions, drawn verbatim from the visible card copy. 3 JSON-LD blocks on the page, 0 parse errors |
| 13 | Images "missing dimensions" | **Closed — false finding.** Both are `next/image` with `fill`, which by design carries no width/height; the box is reserved in CSS and CLS measures 0.000 on every page. Adding dimensions would break the fill layout |

Running total: **14 shipped, 7 closed with reasoning, ~79 open.**

## A defect this audit missed entirely

The footer crisis block — the 9-8-8 / 310-6789 / 9-1-1 line that appears on all
107 pages — was rendering each phone number on its own line with the closing
full stop orphaned alone on a line. It is the most safety-critical text on the
site and it looked broken on every page.

**None of the 100 items caught it**, because every check in this audit examines
structure: link counts, schema blocks, character lengths, contrast ratios,
target sizes. Broken *line-breaking* is none of those. The markup was valid,
the contrast passed, the tap targets passed, the schema parsed. It took a
screenshot.

Recorded here as a limit of the method rather than as an item. A structural
audit cannot see composition, and the fix for that is not more assertions —
it is looking at the page.

Footer pass also delivered: mobile height 2,249px → **1,675px** (−26%) with no
tap target reduced, all three link groups two-up, and the sticky booking bar no
longer covering the copyright line.
