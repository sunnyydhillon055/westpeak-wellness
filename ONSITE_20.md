# 20 things Claude Code can do now

**Measured 17 August 2026** against a clean local production build of the current `main`
(116 URLs crawled and parsed, rendered — not read off the source).

Read this next to `SEO_COMPETITIVE_2026-08-17.md`. That audit put on-site at **3,290/4,000 — first
in the set** and off-site at **760/6,000 — last**. So be clear-eyed about what this list is: the
four things that actually move rankings fastest need your Google account, not my terminal. This is
the rest — real, measured, and worth doing, but it is the smaller half.

Two corrections to what I said earlier: the site has **zero orphan pages** (a first pass said eight;
that was a regex that could not see template-literal `href`s, not a defect), and internal linking is
genuinely healthy — 115 of 116 pages carry breadcrumbs and the anchor text on the Punjabi service
page runs to 20 distinct phrasings across 41 links. The gaps below are narrower than I expected.

---

## Tier 1 — measured defects, small fixes

**1. Nine meta descriptions are being truncated in results.**
Over 158 characters, so Google is cutting them mid-sentence right now:
`/guides/stress-leave-bc` (174), `/for/south-asian-intergenerational-conflict` (172), `/answers`
(171), `/careers` (165), `/punjabi-counselling/surrey` (161), `/online-counselling/vancouver` (161),
`/online-counselling/prince-george` (161), `/guides/how-to-find-a-therapist-in-bc` (161),
`/for/punjabi-speaking-couples` (160). Rewrite to ~150 with the hook in the first 120.

**2. Four page titles are over 60 characters — all four Punjabi region pages.**
`Punjabi-Speaking Counselling in Prince George, BC | Westpeak Wellness` is 69. The brand suffix is
what pushes them over; drop it to `| Westpeak` on this cluster, as `/guides/stress-leave-bc` already
does.

**3. `/answers` has zero in-body inbound links.**
It is reachable only from navigation. It is the page built specifically to be quoted by answer
engines, and nothing on the site points at it in prose. Link it from the guide and service pages
whose questions it aggregates.

**4. `/refer` has zero in-body inbound links.**
Same problem, on the asset the competitive audit called the highest-value permitted channel under
BCACC. Referrals are the one form of social proof this practice is allowed. Link it from `/about`,
`/standards`, `/pricing` and the guides where a physician or adjuster would plausibly land.

**5. The Punjabi region cluster is the weakest-linked part of the site — and it is the differentiator.**
All four pages measured: 1–3 inbound links, 7 outbound (site minimum is 2, median is far higher),
zero images, and `/punjabi-counselling/kelowna` is 871 words. Meanwhile Psychology Today owns five
of the top six results for the Punjabi query. This cluster should be the strongest thing on the
site and it is currently the thinnest.

---

## Tier 2 — schema that is missing, and cheap

**6. `MedicalWebPage` — 0 of 116 pages.**
This is YMYL health content and it is currently typed as generic `Article` on 69 pages.
`MedicalWebPage` with `lastReviewed` and `reviewedBy` is the correct type. `reviewedBy` is already
on those 69 pages; `lastReviewed` is on **4**. This is mostly a type change plus wiring a field that
already exists.

**7. Prices are missing from schema on 9 of 12 service pages.**
Only 3 pages of 116 emit `priceCurrency`. The prices are already public on `/pricing`
($140 individual, $170 couples, $190 EMDR intensive). Putting them into `Offer` on each service page
lets a result carry the price — and price is the single most common reason someone bounces before
booking.

**8. No `hreflang` or `inLanguage` for Punjabi — 0 pages.**
The site has a Punjabi section, four regional pages and Gurmukhi anchor text, and nothing tells a
search engine any of it is in Punjabi. Annotate the Punjabi pages `pa`, and the rest `en-CA`.

**9. No `speakable` markup — 0 pages.**
Every money page already has a `shortAnswer` field written to be the quotable sentence. Marking it
`speakable` is a small change to a component that already renders it.

**10. `FAQPage` is on 94 of 116 — the hubs are missing it.**
`/punjabi`, `/online-counselling`, `/approaches`, `/compare`, `/for` and `/services` all carry
question-shaped content without the markup. Worth a pass to add it where the Q&A is genuine, and
nowhere it is not.

---

## Tier 3 — content volume, the real on-site lever

**11. The nine remaining content gaps.**
PTSD and postpartum depression as their own pages, then separation and divorce, anxiety in
relationships, supporting a partner with anxiety, attachment styles, OCD and intrusive thoughts,
insomnia, seasonal affective disorder. Each is a full guide. **Each needs your clinical read before
it publishes** — that has been true since `VISIBILITY_30.md` and it is still the one part that
should not be delegated.

**12. City pages, 7 → about 20.**
Clearheart runs 30 and ranks on them. But their pages are templated and 1,118 words; the reason
Westpeak's city pages are defensible is that they are not. **Expansion is only worth doing if the
uniqueness bar holds** — twenty thin pages would be worse than seven good ones, and would put the
whole site's quality signal at risk.

**13. Punjabi × city, 4 regions → the full city set.**
The highest-intent intersection on the site, and the one where the competition is directories rather
than practices.

**14. Service × city for the top three services.**
Anxiety, couples and EMDR against the same city list. Same uniqueness caveat as 12.

**15. Seven pages under 900 words.**
`/reviews` (688), `/refer` (730), `/approaches` (814), `/tools` (815), `/tools/which-service` (819),
`/punjabi-counselling/kelowna` (871), `/for` (888). Four are hubs where short is correct — but
`/refer` and the Kelowna page are both load-bearing and both thin.

---

## Tier 4 — media, crawl, and not regressing

**16. Three photographs for a 116-page site.**
Seven pages render zero images: `/answers`, `/refer`, all four Punjabi region pages, and the careers
post. Competitors run 22–106 images on the homepage alone. I can extend the existing SVG figure
system to cover these; real photography is yours.

**17. Image pipeline — WebP/AVIF, descriptive filenames, alt text audit.**
Currently 3 JPG and 27 SVG, no modern formats.

**18. Verify IndexNow actually fires on content change.**
The endpoint exists. Whether it is called on every publish is not something I have confirmed —
worth wiring into the build rather than remembering to run it.

**19. Turn the search-term log into a content decision.**
`lib/search-log.ts` has been counting on-site searches. Nobody has read it. That is the only
first-party demand data this practice has.

**20. `npm run seo` — a standing gate for everything above.**
Title length, description length, orphan detection, schema coverage, thin-page detection,
zero-image pages. Every check in this document, run on every build, so none of it silently comes
back. This is the item that keeps the other nineteen fixed.

---

## What this list will not do

It will not put the site in the four SERPs it is currently absent from. On-site is already the
strongest in the benchmark set and it did not produce rankings, because the deficit is Google
Business Profile, directory listings, a homepage re-crawl and referral relationships — all four of
which need you, and are worth roughly four times this entire list.

Do these anyway. They are cheap, several are outright defects, and item 20 makes them permanent.
But do them alongside the four, not instead.
