# The 15-part plan — raising every city's score

**18 August 2026.** Built against the measured baseline in
`CITY_RANK_2026-08-18.md`. Projections computed, not asserted:
`node scripts/city-rank.mjs --plan`.

| City | Today | Phase 1 | Phase 2 | Phase 3 | Phase 4* | Ceiling* |
|---|---:|---:|---:|---:|---:|---:|
| Prince George | 479 | 500 | 590 | 690 | 840 | 940 |
| Surrey | 475 | 530 | 620 | 720 | 870 | 970 |
| Kelowna | 470 | 500 | 590 | 690 | 840 | 940 |
| Kamloops | 348 | 500 | 590 | 690 | 840 | 940 |
| Vancouver | 330 | 500 | 590 | 690 | 840 | 940 |
| Victoria | 304 | 500 | 590 | 690 | 840 | 940 |
| Abbotsford | 303 | 500 | 590 | 690 | 840 | 940 |
| **Mean** | **387** | **504** | **594** | **694** | **844** | **944** |

\* Phases 4 and the ceiling are **scenarios, not forecasts**. Nobody controls
search results. Phases 1 and 2 are deterministic — they are work, and their
numbers will land.

**Read the Phase 1 column carefully.** Every city arrives at roughly the same
place, because the on-site ceiling is the same everywhere. Prince George gains
21 points; Abbotsford gains 197. Phase 1 does not reward the strong cities — it
ends the gap between them, and the gap is almost the whole spread in today's
ranking.

---

# Phase 1 — on-site. Nine parts, no owner action, +117 mean

## 1. Confirm indexation before building anything on top of it

**Search Console → Pages.** Look for the city URLs and what status they carry.

- *"Discovered — currently not indexed"* → Google has the URL from the sitemap
  and has chosen not to spend crawl budget. The fix is Parts 2–6: internal
  links and site structure. Content changes will do nothing.
- *"Crawled — currently not indexed"* → Google fetched the page and judged it
  not worth storing. The fix is Parts 7–9 and Part 13.
- *Indexed* → the audit's inference was wrong for Google specifically, this is
  an ordinary ranking problem, and Parts 10–13 become the whole plan.

**These three diagnoses lead in different directions.** Everything below is
built to be worth doing under all three, but the sequencing changes, and one
look at Search Console costs five minutes.

**Worth:** gates 350 points per city. Owner action, five minutes, do it first.

---

## 2. Wire the city pages into the site's spine

**Measured:** the homepage links to **zero** city pages. `/services` links to
**zero**. Every route to a city page currently runs through the
`/online-counselling` hub or a sibling.

The homepage and `/services` are the two highest-authority pages on the domain.
A page three editorial clicks from home, reachable only through one hub, is
exactly the crawl profile that produces "Discovered — currently not indexed".

**Do:** add a "Where clients are" block to the homepage and to `/services`,
linking all six city pages and — once Part 6 lands — all six Punjabi pages.
Real anchor text naming the city, not a chip row.

**Cities affected:** all seven. **Band:** D, and it is the most likely single
cause of the Part 1 diagnosis.

---

## 3. Build the `/punjabi-counselling` hub — and make it static

Two separate defects, one part.

**a) There is no hub route.** `app/punjabi-counselling/` contains only
`[region]`. `/online-counselling` has an index that links all six cities; the
Punjabi cluster has no equivalent URL.

**b) The page that *is* acting as its hub cannot be crawled as a static file.**
`/punjabi` links all four regions, but it is rendered per-request — and the
reason is one line:

```
app/punjabi/page.tsx:48
export default function PunjabiPage({ searchParams }: { searchParams?: { sent?: string } })
```

Reading `searchParams` opts the page out of static generation. This is the exact
trap already solved once on this site: `AskInstead` posts to `/message-sent`
rather than reading `?sent`, precisely so the ~94 pages carrying it stay static.
`/punjabi` predates that fix and still reads the query parameter.

**Do:** build `/punjabi-counselling` as a real hub. Convert `/punjabi` to post to
`/message-sent` so it prerenders. Both then appear in the static crawl and in
every link graph a crawler builds.

**Cities affected:** Surrey, Kelowna, Prince George, Kamloops today; all seven
after Part 6. **Band:** D and F.

---

## 4. Break Abbotsford and Victoria out of link isolation

**Measured:** both have **zero** in-body inbound links from outside the city
clusters. They are linked by their five siblings and the hub and by nothing else
on the site. Prince George has six such links — and tops the ranking largely
because of it.

The cheap fix is **reciprocity**. These pages already link out to topically
related guides; the guides do not link back. Abbotsford's own copy sends readers
to `/guides/intergenerational-trauma-explained`, and that guide has no link
returning. The editorial relationship is already established and argued — only
one direction of it was built.

Named donors, all existing pages:

| City | Donor pages that should link in |
|---|---|
| **Abbotsford** | `/guides/intergenerational-trauma-explained` · `/for/south-asian-intergenerational-conflict` · `/for/family-caregivers` · `/guides/setting-boundaries-with-family` · `/guides/talking-to-your-family-about-therapy` |
| **Victoria** | `/guides/is-online-therapy-as-effective-as-in-person` · `/guides/how-to-find-a-therapist-in-bc` · `/guides/waiting-for-therapy-in-bc` · `/for/healthcare-and-shift-workers` · `/guides/low-mood-through-a-bc-winter` |
| **Vancouver** | `/guides/money-stress-and-mental-health` · `/guides/high-functioning-anxiety` · `/guides/imposter-feelings-at-work` · `/for/university-students` |
| **Kamloops** | `/for/rotational-and-camp-workers` · `/guides/low-mood-through-a-bc-winter` |
| **Surrey** | `/for/first-gen-south-asian-adults` · `/guides/talking-to-your-family-about-therapy` |
| **Kelowna** | `/for/rotational-and-camp-workers` · `/guides/chronic-illness-and-mood` |

Target: **five external inbound links per city**, which is what caps band D.

**Band:** D and F. Abbotsford and Victoria each gain roughly 70 points from this
part alone.

---

## 5. Pair every city with its own Punjabi page, in both directions

Three findings, all from the same check:

- **Prince George's city page does not link to its own Punjabi page.** Surrey
  and Kelowna do; Prince George does not.
- **Victoria's city page links to Kamloops' and Prince George's Punjabi pages**
  — sensible as an argument about Island language access, but it means Victoria
  passes equity out of its own region and receives none back.
- **No Punjabi page links back to its city page. Not one.** The relationship is
  built entirely one-way, across the whole cluster.

**Do:** every city page links to its own Punjabi page where one exists; every
Punjabi page links back to its own city page. Fourteen links, all of them
editorially justified because the pages are about the same place.

**Band:** D and F, for every city with both pages.

---

## 6. The four missing cluster pages

| Page | Case for it | Status |
|---|---|---|
| `/punjabi-counselling/abbotsford` | `locations.ts` says Abbotsford has *"one of the largest Punjabi-speaking communities in Canada, with much the same dynamic as Surrey"*. `punjabi-regions.ts` names Abbotsford as one of three places BC's Punjabi-speaking counsellors are. A competitor ranks on *"Punjabi counselling in Surrey and Abbotsford"*. | **Build.** Two of the repo's own files already argue for it. |
| `/punjabi-counselling/vancouver` | Also named in `punjabi-regions.ts` as one of the three Lower Mainland centres. | **Build.** |
| `/online-counselling/kamloops` | Kamloops is the only city in one cluster and not the other. Its Punjabi page is strong and its city-query space is uncovered. | **Build.** |
| `/punjabi-counselling/victoria` | The Island language argument is already made *on the Victoria city page*. | **Conditional.** `punjabi-regions.ts` sets the standard: no page without a sourced population figure. Find the 2021 census figure for Greater Victoria first. If it cannot be sourced, do not build it — that rule is what keeps the cluster defensible. |

**Do not** template these. The Surrey Punjabi page exists because someone
noticed the scarcity argument would be *false* in Surrey and wrote an inverted
one. That judgement is the reason the cluster is the better-evidenced half of
the site.

**Band:** F (+15 each), D, and C.

---

## 7. A citable figure for Vancouver, Victoria and Abbotsford

**The single largest recoverable content gap, worth 50 points per city.**

All four Punjabi pages rest on a checkable number. Of six city pages, **one**
does — Prince George's CMHA figure. The other five argue from fair
characterisation: Vancouver's cost of living, the Valley's distances, the ferry,
the Okanagan's wildfire seasons. Every one of those is true. None is checkable,
and a claim a reader can verify is worth more than a claim they must accept.

| City | What to source |
|---|---|
| **Vancouver** | A published figure on counselling affordability or cost burden — VCH service volumes, or a BC-specific therapy-cost study. Not a national average. |
| **Victoria** | Island Health mental-health wait times, or a sourced count of Island clinicians against population. The ferry argument becomes far stronger attached to a number. |
| **Abbotsford** | Fraser Health service figures, or the 2021 census Punjabi mother-tongue count for Abbotsford — which would also be the foundation for its Punjabi page in Part 6. |
| Surrey · Kelowna | The city pages inherit their figure from the Punjabi page. Sourcing one directly would strengthen them, but the band is already earned. |

**Standard:** the figure must be published, attributable and dated, and go into
the page's `sources` array with a working URL. Same bar as the Punjabi cluster.
No estimates, no "studies show".

---

## 8. Six answered questions on every city page

**Measured:** most city pages carry three FAQs. The band scores against six.
Kelowna's Punjabi page already has six and Surrey's has five — which is why
those two score highest on page substance.

This is not padding. The Kelowna Punjabi page's extra questions are the best
content in the cluster: *"I work seasonally, can sessions stop and start?"* and
*"Can I have some sessions in Punjabi and some in English?"* are real questions
with answers nobody else on the internet is giving.

**Do:** three more genuine questions per city page, drawn from what people
actually ask about *that place* — not generic therapy FAQs restated. Each one
also becomes eligible for `FAQPage` rich results, which the schema already
supports.

**Band:** C, +20 per city.

---

## 9. Depth to 1,300 words, where it is earned

City pages run 907–1,275 words. The band caps at 1,300.

**This is the part most easily done badly.** Padding a page to hit a word count
makes it worse and the score would not know. Parts 7 and 8 supply the words
honestly: a sourced figure needs a paragraph of context, and three more
questions carry their own answers. If a page reaches 1,300 through Parts 7 and
8, it earned it. If it needs filler to get there, **leave it short** — 40 points
is not worth a page that reads like it was written to a target.

Kamloops (907) is furthest from the cap and has the most genuine room.

---

# Phase 2 — off-site. Two parts, owner only, +90 per city

Nothing in Phase 1 touches this band. Nothing in Phase 3 or 4 happens without
it.

## 10. The three directories

**Psychology Today, Counselling BC, First Session appeared in every one of the
ten city searches measured.** The practice is in none of them.

This is the mechanism by which a practice with no office becomes visible in a
city — and it is the mechanism the competition is using. Five of the first six
results for the Punjabi Surrey query are directory profiles.

Each directory allows multiple service areas or cities on one profile. **List
all seven cities on each.** Worth **+90 per city, in all seven at once** — the
single highest-value action in this document.

**Owner action.** I cannot create accounts or enter credentials.
`kits/KIT-1` has the copy.

---

## 11. Google Business Profile

Named the highest-value unexecuted item in every previous audit of this
repository, and still unexecuted.

The map pack is structurally unreachable — no office, and the profile must not
claim one. That is not the point. GBP is the entity record that ties the
practice name to a place in Google's knowledge graph, and right now the only
thing performing that job is the word "Surrey" in the homepage title.

**Owner action.** `kits/KIT-1`.

---

# Phase 3 and beyond — four parts that make it stick

## 12. City-specific third-party citations — the last 60 points of band B

Phase 2 takes off-site from 50 to 140, not to 200. The remaining 60 needs
third-party pages that name **the practice and a specific city together**.

Surrey has one, and it is instructive: the homepage title reads "… | Surrey",
the BCACC register entry is Surrey-based, the TikTok account resolves to Surrey.
**Not one of those was a search decision.** Surrey is the only city the wider web
associates with this practice at all, and it happened by accident.

**Do, without violating anything:** BCACC's directory profile lists service
areas — list all seven. Chamber or community-organisation listings in each
region. Referral-partner pages. Local health-network resource lists, which
routinely include virtual providers.

**Do not:** solicit testimonials or reviews (BCACC prohibits it), buy links, or
build citations claiming an address outside Abbotsford. Referrals are not
prohibited and are the correct route.

---

## 13. Service × city — query space that does not exist yet

The city pages already use anchors like "Individual Therapy in Kelowna" and
"EMDR Therapy in Kelowna" — pointing at province-wide service pages. The anchor
promises a page that isn't there.

Seven cities × six services is 42 pages, and **that is exactly the templated
doorway pattern `locations.ts` retired 37 pages to avoid.** Do not build the
matrix.

Build the intersections where something specific is true: EMDR in Prince George
(where the CMHA waitlist figure applies), Punjabi couples counselling in
Abbotsford, trauma therapy in Kelowna (wildfire seasons). **Perhaps six pages,
each meeting the sourced-figure bar from Part 7.**

Revisit only after Phase 2 is live and Part 1's diagnosis is known. A
zero-authority domain adding pages faster than it earns links is how the first
37 became a liability.

---

## 14. Rank tracking, so this is falsifiable

Every number in the baseline is a snapshot taken by hand. Without tracking,
"did the plan work" becomes a memory exercise — and this repository already
learned that lesson from a hand-assembled audit that could not be re-run.

**Do:**
- Re-run `node scripts/city-rank.mjs` after every phase. Structural bands (C, D,
  E, F) update automatically from the build.
- Update the `MEASURED` block with a re-run of the ten queries, dated.
- Once Search Console has data, export query × page and check the city URLs
  specifically for impressions — **impressions before clicks is the first
  evidence the pages are in the index at all**, and it will show up months
  before any ranking does.

**The falsifiable claim:** if the city pages have not gained impressions twelve
weeks after Phase 2 goes live, the diagnosis in Part 1 was wrong and this plan
should be reconsidered rather than extended.

---

## 15. What not to do

Each of these looks like progress and is not.

- **Do not rewrite the city pages hoping for rankings.** They were measured
  first of six on every on-site category. The pages are not the problem, and
  another rewrite is the most expensive way to learn that twice.
- **Do not build the 42-page service × city matrix.** See Part 13.
- **Do not add city pages for the 37 retired slugs.** `locations.ts` staged that
  retirement deliberately and set a 12-month review. That date has not arrived.
- **Do not solicit reviews or testimonials.** BCACC prohibits it. This is not a
  tactical choice.
- **Do not claim an address, staff or registration outside Abbotsford** — and
  nothing here changes the Alberta and Ontario gates.
- **Do not pad pages to hit 1,300 words.** See Part 9.
- **Do not chase the map pack.** No office means no map pack. Part 11 is about
  the entity record, not the map.

---

## The sequence

| Weeks | Parts | Who | Mean score |
|---|---|---|---:|
| **0** | 1 — confirm indexation | Owner, 5 min | 387 |
| **1–2** | 2, 3, 4, 5 — links, hub, isolation, pairing | Terminal | ~460 |
| **2–4** | 6, 7, 8, 9 — pages, figures, questions, depth | Terminal | **504** |
| **1–2** *(parallel)* | 10, 11 — directories, GBP | Owner | **594** |
| **5–12** | 12, 14 — citations, tracking | Both | 694 if indexation resolves |
| **12+** | 13 — service × city, only if Phase 2 worked | Terminal | scenario |

**Parts 10 and 11 do not depend on anything in Phase 1 and should start on day
one.** They are worth 90 points per city against Phase 1's 117 — and unlike
Phase 1, they are the only items in this plan that address why the pages cannot
currently be found at all.

If only one thing in this document gets done, make it Part 10.
