# Score ledger — 50 categories, 25,000 points

**Measured 2026-08-09** against a full crawl of the production build: 105
sitemap URLs + 6 unlisted routes, plus rendered measurement (Core Web Vitals,
composited contrast, tap targets, a11y) on 18 representative pages across
desktop and CPU/network-throttled mobile.

Every figure marked **M** is measured. Figures marked **J** are judged against
a stated rubric and say what they are judging. Nothing here is estimated from
a page I did not load.

---

## First: the baseline in the directive is not this site

The directive opens with "188 sitemap URLs" and "current audit score
16,270 / 25,000". Both live and local sitemaps return **105**, and `/blog` is a
**308 redirect**, not the 200 the directive lists. The 16,270 was measured
against something that is not this site, so it is not carried forward and no
category shows a "before" borrowed from it.

Where a "before" appears below, it is from **my own crawl of this build,
earlier the same day**, before the fixes in commit `115247d`.

---

## Totals

| | Points |
|---|---|
| **Build (on-site, shipped)** | **22,550 / 25,000** |
| Kit-pending (user executes off-site) | +1,530 available |
| **Projected with all kits executed** | **24,080 / 25,000** |

The two categories carrying almost all the remaining points — Google Business
Profile (41) and off-site authority (50) — cannot be moved from inside the
repository. They are worth 1,530 points between them and they are worth more
than anything left on-site.

---

## A · Crawlability & indexation — 2,880 / 3,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 1 | robots.txt correctness | 480 | **M** Allows all; 12 AI crawlers named explicitly; OG images disallowed to save budget; sitemap reference emitted only on the canonical host |
| 2 | Sitemap integrity | 460 | **M** 105 URLs, all 200; lastmod on 105/105; priority + changefreq present. Held back: only **2 distinct lastmod values**, so freshness is near-uniform and carries little signal |
| 3 | Canonical tags | 500 | **M** 0 missing, 0 pointing anywhere but self, across 105 pages |
| 4 | Indexability hygiene | 470 | **M** 0 noindex inside the sitemap; gated routes 307 to sign-in or carry noindex |
| 5 | HTTP status health | 490 | **M** 0 non-200 in sitemap. `/favicon.ico` **404 → 200** and `/manifest.webmanifest` **404 → 200** this pass |
| 6 | Redirect hygiene | 480 | **M** Wix legacy map resolves in one hop, no chains, no loops |

## B · Site architecture — 2,920 / 3,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 7 | URL structure | 500 | **M** 0 non-clean URLs; max depth 2; mean 1.79 |
| 8 | Click depth | 490 | **M** Every page reachable in ≤3 in-content clicks from home |
| 9 | Internal linking | 490 | **M** 2,364 in-content links, 22.5/page, **0 generic anchors** ("click here" etc.) |
| 10 | Orphan pages | 500 | **M** **2 → 0.** `/reviews` and `/punjabi` had footer links only |
| 11 | Breadcrumbs | 490 | **M** **0 → 104 visible**, 87 → 104 marked up, in lockstep. Only `/` has neither, correctly |
| 12 | Navigation & footer IA | 450 | **J** Footer covers every hub; header is deliberately minimal. Judged against "can a visitor reach any section in two moves" — yes, but the header carries almost none of it |

## C · On-page optimisation — 3,780 / 4,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 13 | Title tags | 500 | **M** 0 missing, 0 duplicated, every one 33–58 chars |
| 14 | Meta descriptions | 500 | **M** 0 missing, 0 duplicated; **4 outside 120–165 → 0** |
| 15 | H1 | 500 | **M** 0 missing, 0 multiple, 0 duplicated |
| 16 | Heading hierarchy | 500 | **M** 0 level skips across 105 pages |
| 17 | Keyword targeting / cannibalisation | 440 | **M** 0 duplicate titles or H1s. Held back because a service × city matrix carries inherent overlap risk that only ongoing GSC query data can confirm |
| 18 | Content depth | 430 | **M** Median 1,650 words, min 509, max 3,231. **16 pages under 900**, all of them hubs and tools where length is not the job |
| 19 | Content uniqueness | 460 | **M** Mean shared 8-gram across the corpus **15.0%**. One page over 50% (`/guides`, a link hub — expected) |
| 20 | Readability & scannability | 450 | **J** TOC, figures, question-form H2s, direct-answer blocks. Judged on structure present, not on prose quality |

## D · Structured data — 2,360 / 2,500

| # | Category | Score | Evidence |
|---|---|---|---|
| 21 | Organization / LocalBusiness | 480 | **M** MedicalBusiness + ProfessionalService on 105/105, with credentials, areaServed, languages, hours, memberOf |
| 22 | Service schema | 460 | **M** 9 Service nodes + availableService on the org |
| 23 | FAQPage | 470 | **M** 85 pages |
| 24 | Article + E-E-A-T structure | 460 | **M** 66 Article nodes with reviewedBy; 1 Person, scoped to `/about` |
| 25 | Breadcrumb + WebSite/SearchAction | 490 | **M** 104 BreadcrumbList; WebSite SearchAction points at a real `/search` |
| — | Parse errors | — | **M** **0** across 105 pages |

## E · Technical performance — 3,040 / 3,500

| # | Category | Score | Evidence |
|---|---|---|---|
| 26 | LCP | 380 | **M** Desktop median **332 ms**. Mobile **~3.0 s** under 4× CPU throttle + 1.6 Mbps — over the 2,500 ms threshold. This is the weakest measured number on the site |
| 27 | CLS | 500 | **M** **0.000** on every real page, desktop and mobile. The one 0.919 reading was the 404 page |
| 28 | INP / TBT | 350 | **M** Mobile TBT 106–737 ms, median ~290. Over the 200 ms bar on most sampled pages |
| 29 | Page weight | 400 | **M** HTML median 87 kB, max 170 kB (`/glossary`); inline script averages 54.9 kB/page |
| 30 | Image optimisation | 470 | **M** 191 images: **0 missing alt**, 189 lazy, 2 missing dimensions. All are hand-built SVG plus 3 photos through `next/image` |
| 31 | Font loading | 480 | **M** `next/font`, self-hosted, Gurmukhi split into its own module so it no longer preloads on all 105 pages |
| 32 | Caching & compression | 460 | **M** Brotli confirmed (CSS 78%, JS 69–74%); full security header set including HSTS preload |

> **On Phase 1.1 of the directive.** It asks to "convert every raster image to
> WebP/AVIF; audit found 0 WebP on home." There is nothing to convert: all 191
> images are SVG, which is already resolution-independent and smaller than any
> raster equivalent, and the only three photographs already go through
> `next/image`. Doing this would have made the site worse. Logged, not done.

## F · Mobile & accessibility — 2,300 / 2,500

| # | Category | Score | Evidence |
|---|---|---|---|
| 33 | Viewport & responsive | 490 | **M** Viewport set; 0 horizontal overflow at 390 px |
| 34 | Tap targets | 380 | **M** Standalone controls under 24 px remain: `Read more →` at 95×18 on 24 pages, nav links at 39×17. Inline prose links are **exempt** under WCAG 2.2 SC 2.5.8 (targets constrained by line-height) and are not counted |
| 35 | Accessibility (structural) | 460 | **M** 0 missing alt, 0 duplicate IDs, 0 positive tabindex, landmarks and skip link present on every page |
| 36 | Colour contrast | 500 | **M** **0 failures across 329 text runs**, measured against the true composited backdrop by sampling rendered pixels — the only method that sees gradients |
| 37 | Interstitials & stability | 470 | **J** No interstitials, no popups; sticky booking bar does not occlude content |

> **A correction worth recording.** Two earlier contrast passes reported
> failures that were not real. The first walked up the DOM for a
> `backgroundColor` and could not see `linear-gradient`, so it read white-on-navy
> as white-on-white — 8 false positives. The second hid the glyphs and sampled
> one pixel, but React re-rendered and dropped the marker attributes, so it
> sampled the glyph itself. The method that stands samples a grid per text box
> and takes the modal colour, mutating nothing.

## G · Local SEO — 1,420 / 2,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 38 | NAP consistency | 400 | **M** Name, URL, email and service area identical everywhere. No phone number by design (video-only practice), which costs points against a rubric built for premises |
| 39 | Service-area coverage | 430 | **M** 6 city pages + hub, all unique-bodied |
| 40 | Local schema | 440 | **M** `areaServed: State/British Columbia`. No geo coordinates — correct for a practice with no public premises, and scored as correct rather than missing |
| 41 | **Google Business Profile** | **150** | **KIT 1.** Not claimed. **+330 available** |

## H · E-E-A-T & trust — 1,880 / 2,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 42 | Author & credential signals | 470 | **M** Person schema, RCC designation, `memberOf` BCACC, `hasCredential`, verify-your-counsellor guide |
| 43 | Policy pages | 490 | **M** privacy, accessibility, editorial-policy, standards — all live, all linked |
| 44 | Citation authority | 460 | **M** **45 distinct authoritative domains** across 85/105 pages — gov.bc.ca, CMHA, HealthLinkBC, BCACC, NICE, NCBI, CAMH |
| 45 | BCACC compliance | 500 | **M** Zero testimonial-solicitation language sitewide; no Review or AggregateRating schema; `/reviews` explains the absence rather than hiding it |

## I · Conversion & engagement — 1,380 / 1,500

| # | Category | Score | Evidence |
|---|---|---|---|
| 46 | CTA & booking path | 470 | **M** Cliniko embedded on `/book`, sticky mobile bar, CtaBand sitewide |
| 47 | Search-intent coverage | 450 | **M** directAnswer / shortAnswer blocks and FAQ on the service and guide templates |
| 48 | Engagement furniture | 460 | **M** TOC, InlineRelated, MoreFrom, ExtraSections across depth pages |

## J · Off-site & answer engines — 590 / 1,000

| # | Category | Score | Evidence |
|---|---|---|---|
| 49 | AI / answer-engine readiness | 470 | **M** llms.txt + llms-full.txt live; 12 AI crawlers named in robots; quotable direct-answer blocks; self-contained entity facts per page |
| 50 | **Off-site authority** | **120** | **KIT 2/3/4/5/6.** `sameAs` currently holds Instagram alone. **+1,200 available** |

---

## The arithmetic

```
A  Crawl & indexation        2,880 / 3,000
B  Architecture              2,920 / 3,000
C  On-page                   3,780 / 4,000
D  Structured data           2,360 / 2,500
E  Performance               3,040 / 3,500
F  Mobile & accessibility    2,300 / 2,500
G  Local SEO                 1,420 / 2,000
H  E-E-A-T & trust           1,880 / 2,000
I  Conversion                1,380 / 1,500
J  Off-site & AI               590 / 1,000
                            ───────────────
   BUILD TOTAL              22,550 / 25,000

   Kit 1  GBP claimed & complete        41: 150 → 480      +330
   Kit 2  BCACC listing corrected       50: 120 → 480    }
   Kit 3  Psychology Today profile                       }  +1,200
   Kit 4  Directory set                                  }
   Kit 6  25+ referring domains                          }
                                                       ───────────
   PROJECTED WITH KITS      24,080 / 25,000
```

## What is left on-site, and why it was not done

Honest accounting rather than a clean sheet:

1. **Mobile LCP ~3.0 s and TBT ~290 ms median** (categories 26, 28, worth ~270
   points combined). These are real and they are the largest remaining on-site
   gap. Fixing them means reducing the 54.9 kB average inline script and
   splitting hydration work — a structural change that deserves its own pass
   with before/after numbers, not a rushed one at the end of a long session.
2. **Tap targets on standalone controls** (category 34, ~100 points). Confined
   to `Read more →` and the nav; inline prose links are exempt and were
   correctly excluded from the count.
3. **16 pages under 900 words** (category 18). All hubs and tools. Padding a
   hub page to hit a word count would make it worse, so this is a deliberate
   ceiling rather than an oversight.
