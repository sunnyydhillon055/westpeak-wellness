# ONSITE_20 — what got done

**17 August 2026.** Status against `ONSITE_20.md`. Every number here comes from
`npm run seo` against a clean production build, not from reading source.

## The measurement

| | Errors | Warnings |
|---|--:|--:|
| Baseline | **14** | **211** |
| Now | **0** | **13** |

`npm run seo` fails a build on any error. `npm run seo:warn` is the advisory run.

---

## Done and verified — 14 of 20

| # | Item | Evidence |
|--:|---|---|
| 1 | 9 over-length meta descriptions | all ≤158; gate clean |
| 2 | 4 over-length titles | one template change; all ≤60 |
| 3 | `/answers` had no in-body inbound links | now linked from `/faq`, `/guides`, `/services` |
| 4 | `/refer` had no in-body inbound links | now linked from `/about`, `/pricing`, `/contact` |
| 5 | Punjabi region cluster weakest on the site | now linked from `/punjabi` (both scripts) and the Surrey, Kelowna and Victoria city pages; off the weak-inbound list |
| 6 | `MedicalWebPage` on 0 pages | 63 clinical pages, plus `lastReviewed` wired to the date already in the byline |
| 7 | Price missing from 9 of 12 service pages | `"price":"190.00"`, `"priceCurrency":"CAD"` verified live |
| 9 | `speakable` on 0 pages | on every clinical page, pointed at the short answer |
| 15 | Thin pages | `/refer` 730 → 1,180; Kelowna 870 → 891 |
| 16 | 7 pages rendering zero images | 0 remaining |
| 18 | IndexNow not firing on publish | `npm run indexnow`, and `?dry=1` added to the route first |
| 19 | Search log never read | `searchGaps()` + a block in `/admin` |
| 20 | No standing gate | `scripts/seo-audit.mjs` |
| 11a | First two content gaps | PTSD and postpartum written, behind a draft gate |

## Already done — 2 of 20, and I was wrong to list them

| # | Item | What was actually true |
|--:|---|---|
| 8 | hreflang for Punjabi | **Already correct and reciprocal.** My check grepped lowercase `hreflang`; React emits `hrefLang`. Also: `/punjabi` is genuinely majority Gurmukhi (2,521 vs 1,496 Latin characters) so `pa` is right there — but the region pages are English (39 vs 5,970). Tagging those `pa` would have been a false signal. |
| 17 | Image pipeline | **Already handled.** The three photos go through `next/image`, which serves WebP/AVIF automatically, and the gate finds zero `<img>` without alt. |

## Judged not worth doing — 1 of 20

| # | Item | Why |
|--:|---|---|
| 10 | `FAQPage` on hub pages | 94 of 116 pages carry it. The 22 without are hubs and policy pages. Adding FAQ markup to an index page because a checker counts it is the gate driving the content. Left alone. |

## Not done — 3 of 20, all content, all needing your judgement

| # | Item | State |
|--:|---|---|
| 11b | Seven remaining content gaps | Listed with notes at the foot of `lib/guides-drafts.ts`. **Finding attached:** four of them — attachment styles, OCD, insomnia, SAD — overlap pages that already exist and rank. Those are probably expansions, not new pages, and a near-duplicate would compete with the page you already have. Worth deciding before writing. |
| 12 | City pages 7 → ~20 | Not started, deliberately. Clearheart runs 30 templated pages at ~1,100 words. The only reason your seven are defensible is that they are not templated. Twenty thin pages would be worse than seven good ones and would put the site-wide quality signal at risk. This needs a real per-city argument each, which is the same effort as seven guides. |
| 13–14 | Punjabi × city, service × city | Same constraint as 12, and the same reason to hold. |

---

## Two things worth knowing about the gate

**It reads the prerendered HTML**, not the source. Both wrong findings in my own
audits came from regexes reading source nobody had rendered — the phantom eight
orphan pages (a regex that could not see template-literal `href`s) and per-page
counts that were really per-line counts.

**It reports its own blind spot.** Nine routes render on demand and have no
static file, so they are unaudited *and their outgoing links are invisible* —
which is exactly why `/refer` still reads as 1 inbound link when three pages
point at it. The gate prints that list every run rather than letting the number
look complete.

## Still true

None of this changes the finding in `SEO_COMPETITIVE_2026-08-17.md`. On-site was
already the strongest in the benchmark set and it did not produce rankings. GBP,
the directory submissions, the homepage re-crawl and the referral channel are
worth roughly four times this entire list, and all four need you.
