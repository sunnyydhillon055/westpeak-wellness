# Westpeak Wellness — SEO & Visibility Audit

**Audited:** 8 August 2026
**Scope:** every prerendered route in the local production build (`.next/server/app`)
**Method:** programmatic parse of rendered HTML — not source inspection — so every number below
reflects what a crawler actually receives. Script retained at `audit-data.json`.

> **Status:** Phase 1 complete. Quick wins applied (§5). Nothing new has been built —
> the Phase 2 build plan is awaiting approval at **Gate 1**.

---

## 0. The one-paragraph version

The site is technically clean and editorially decent, and it has **one structural problem large
enough to suppress the entire domain**: 43 of its 61 pages are near-duplicates of one another.
Those 43 city pages carry **8,504 of the site's 12,309 words — 69% of all text on the
domain — at 55.6% average five-gram overlap with each other.** Every one of the
903 possible city-page pairs exceeds the 25% duplication ceiling. Meanwhile **not a single page
on the site reaches 700 words**, and the deepest page is 558 words. The domain is
simultaneously thin and repetitive, which is the specific combination Google's helpful-content
system demotes site-wide. The fix is not more pages. It is fewer, much deeper pages.

**One piece of very good news:** the site has never been live on `westpeakwellness.com` — it
currently exists only on a Vercel preview URL. **Nothing here has ever been indexed.** There is
no ranking equity to protect and no live URLs to break, so the 43 city pages can be cut with
essentially zero SEO downside. This audit is being done at the only moment when correcting the
architecture is free.

---

## 1a. Page inventory

**61 prerendered HTML routes** (+ `sitemap.xml` and `robots.txt`).
Note: the project README and `CLAUDE_CODE_BRIEF.md` both claim "~64 pages, 45 cities."
The real numbers are **61 pages and 43 cities**. Documentation drift — worth correcting.

"Unique words" = visible text inside `<main>`, excluding the shared header, footer, and the
closing `CtaBand` component, so shared chrome is not inflating any count.

### Core pages

| URL | Title | Desc | H1 | Unique words | Links out | Links in | Canon | JSON-LD |
|---|--:|--:|---|--:|--:|--:|:-:|---|
| `/` | 44 | 145 | Counselling that meets you where you are. | 452 | 9 | 60 | y | MedBiz |
| `/_not-found` | 44 | 145 | This page moved or never existed. | 17 | 1 | 0 | y | MedBiz |
| `/about` | 52 | 152 | Aman Bains Dhillon , MA, RCC | 243 | 4 | 0 | y | MedBiz |
| `/book` | 54 | 144 | Book a free consultation. | 332 | 4 | 59 | y | MedBiz |
| `/contact` | 38 | 142 | Let’s see if we’re a good fit. | 123 | 3 | 0 | y | MedBiz |
| `/faq` | 46 | 150 | Frequently asked questions | 558 | 2 | 3 | y | FAQPage,MedBiz |
| `/online-counselling` | 48 | 128 | Online counselling across British Columbia | 116 | 45 | 43 | y | MedBiz |
| `/pricing` | 40 | 151 | Clear, fair, accessible. | 151 | 4 | 12 | y | MedBiz |
| `/services` | 58 | 141 | Counselling matched to what you need. | 149 | 13 | 54 | y | MedBiz |

### Service pages

| URL | Title | Desc | H1 | Unique words | Links out | Links in | Canon | JSON-LD |
|---|--:|--:|---|--:|--:|--:|:-:|---|
| `/services/anxiety-counselling` | 54 | 144 | Turn down the volume on anxiety. | 172 | 8 | 1 | y | MedBiz |
| `/services/couples-therapy` | 52 | 141 | Strengthen communication, deepen connection, r | 186 | 8 | 53 | y | MedBiz |
| `/services/depression-counselling` | 57 | 152 | When everything feels heavy, you don&#x27;t ha | 173 | 8 | 1 | y | MedBiz |
| `/services/emdr-therapy` | 47 | 148 | Process painful memories so they stop running  | 196 | 8 | 53 | y | MedBiz |
| `/services/individual-therapy` | 57 | 149 | 1:1 sessions for the everyday weight of being  | 190 | 8 | 53 | y | MedBiz |
| `/services/online-counselling-bc` | 48 | 131 | Therapy that fits your real life, anywhere in  | 194 | 8 | 1 | y | MedBiz |
| `/services/punjabi-counselling` | 54 | 142 | You don&#x27;t have to translate yourself. | 186 | 8 | 45 | y | MedBiz |
| `/services/south-asian-mental-health` | 45 | 134 | Holding two cultural worlds, without splitting | 182 | 8 | 1 | y | MedBiz |
| `/services/trauma-therapy` | 53 | 140 | Trauma-informed care, at a pace you set. | 185 | 8 | 4 | y | MedBiz |

### City pages (`/online-counselling/[city]`)

All 43 are generated from one template whose only per-page inputs are `city`, `region`, and a
one-sentence `blurb`. They range from **192 to 209 unique words** — a 17-word spread across
43 pages, which is itself the clearest evidence of how little varies.

| URL | Title | Desc | H1 | Unique words | Links out | Links in | Canon | JSON-LD |
|---|--:|--:|---|--:|--:|--:|:-:|---|
| `/online-counselling/abbotsford` | 52 | 146 | Online counselling in Abbotsford , BC | 198 | 9 | 1 | y | MedBiz |
| `/online-counselling/burnaby` | 49 | 144 | Online counselling in Burnaby , BC | 197 | 9 | 1 | y | MedBiz |
| `/online-counselling/campbell-river` | 56 | 153 | Online counselling in Campbell River , BC | 202 | 9 | 1 | y | MedBiz |
| `/online-counselling/chilliwack` | 52 | 146 | Online counselling in Chilliwack , BC | 200 | 9 | 1 | y | MedBiz |
| `/online-counselling/coquitlam` | 51 | 146 | Online counselling in Coquitlam , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/courtenay` | 51 | 148 | Online counselling in Courtenay , BC | 195 | 9 | 1 | y | MedBiz |
| `/online-counselling/cranbrook` | 51 | 141 | Online counselling in Cranbrook , BC | 192 | 9 | 1 | y | MedBiz |
| `/online-counselling/delta` | 47 | 142 | Online counselling in Delta , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/duncan` | 48 | 145 | Online counselling in Duncan , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/fort-langley` | 54 | 148 | Online counselling in Fort Langley , BC | 201 | 9 | 1 | y | MedBiz |
| `/online-counselling/fort-st-john` | 55 | 147 | Online counselling in Fort St. John , BC | 209 | 9 | 1 | y | MedBiz |
| `/online-counselling/hope` | 46 | 140 | Online counselling in Hope , BC | 195 | 9 | 1 | y | MedBiz |
| `/online-counselling/kamloops` | 50 | 148 | Online counselling in Kamloops , BC | 192 | 9 | 1 | y | MedBiz |
| `/online-counselling/kelowna` | 49 | 138 | Online counselling in Kelowna , BC | 192 | 9 | 1 | y | MedBiz |
| `/online-counselling/langley` | 49 | 143 | Online counselling in Langley , BC | 196 | 9 | 1 | y | MedBiz |
| `/online-counselling/maple-ridge` | 53 | 148 | Online counselling in Maple Ridge , BC | 202 | 9 | 1 | y | MedBiz |
| `/online-counselling/mission` | 49 | 143 | Online counselling in Mission , BC | 195 | 9 | 1 | y | MedBiz |
| `/online-counselling/nanaimo` | 49 | 146 | Online counselling in Nanaimo , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/nelson` | 48 | 138 | Online counselling in Nelson , BC | 193 | 9 | 1 | y | MedBiz |
| `/online-counselling/new-westminster` | 57 | 152 | Online counselling in New Westminster , BC | 203 | 9 | 1 | y | MedBiz |
| `/online-counselling/north-vancouver` | 57 | 152 | Online counselling in North Vancouver , BC | 202 | 9 | 1 | y | MedBiz |
| `/online-counselling/parksville` | 52 | 149 | Online counselling in Parksville , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/penticton` | 51 | 140 | Online counselling in Penticton , BC | 192 | 9 | 1 | y | MedBiz |
| `/online-counselling/pitt-meadows` | 54 | 149 | Online counselling in Pitt Meadows , BC | 202 | 9 | 1 | y | MedBiz |
| `/online-counselling/port-coquitlam` | 56 | 151 | Online counselling in Port Coquitlam , BC | 200 | 9 | 1 | y | MedBiz |
| `/online-counselling/port-moody` | 52 | 147 | Online counselling in Port Moody , BC | 201 | 9 | 1 | y | MedBiz |
| `/online-counselling/powell-river` | 54 | 149 | Online counselling in Powell River , BC | 202 | 9 | 1 | y | MedBiz |
| `/online-counselling/prince-george` | 55 | 147 | Online counselling in Prince George , BC | 204 | 9 | 1 | y | MedBiz |
| `/online-counselling/prince-rupert` | 55 | 147 | Online counselling in Prince Rupert , BC | 201 | 9 | 1 | y | MedBiz |
| `/online-counselling/richmond` | 50 | 145 | Online counselling in Richmond , BC | 198 | 9 | 1 | y | MedBiz |
| `/online-counselling/salmon-arm` | 52 | 140 | Online counselling in Salmon Arm , BC | 199 | 9 | 1 | y | MedBiz |
| `/online-counselling/sechelt` | 49 | 144 | Online counselling in Sechelt , BC | 195 | 9 | 1 | y | MedBiz |
| `/online-counselling/squamish` | 50 | 141 | Online counselling in Squamish , BC | 198 | 9 | 1 | y | MedBiz |
| `/online-counselling/surrey` | 48 | 143 | Online counselling in Surrey , BC | 200 | 9 | 1 | y | MedBiz |
| `/online-counselling/terrace` | 49 | 141 | Online counselling in Terrace , BC | 193 | 9 | 1 | y | MedBiz |
| `/online-counselling/vancouver` | 51 | 146 | Online counselling in Vancouver , BC | 203 | 9 | 1 | y | MedBiz |
| `/online-counselling/vernon` | 48 | 137 | Online counselling in Vernon , BC | 192 | 9 | 1 | y | MedBiz |
| `/online-counselling/victoria` | 50 | 147 | Online counselling in Victoria , BC | 198 | 9 | 1 | y | MedBiz |
| `/online-counselling/victoria-saanich` | 49 | 146 | Online counselling in Saanich , BC | 194 | 9 | 1 | y | MedBiz |
| `/online-counselling/west-kelowna` | 54 | 143 | Online counselling in West Kelowna , BC | 200 | 9 | 1 | y | MedBiz |
| `/online-counselling/west-vancouver` | 56 | 151 | Online counselling in West Vancouver , BC | 201 | 9 | 1 | y | MedBiz |
| `/online-counselling/whistler` | 50 | 141 | Online counselling in Whistler , BC | 195 | 9 | 1 | y | MedBiz |
| `/online-counselling/white-rock` | 52 | 147 | Online counselling in White Rock , BC | 202 | 9 | 1 | y | MedBiz |

---

## 1b. Content problems

### ▲ CRITICAL — the 43 city pages are near-duplicates

Measured with 5-gram shingle similarity across all 903 possible pairs:

| Metric | Result |
|---|---|
| Average Jaccard similarity | **55.6%** |
| Average containment (max direction) | **72.4%** |
| Pairs exceeding the 25% ceiling | **903 of 903** (100%) |
| Worst pair | /online-counselling/coquitlam ~ /online-counselling/port-coquitlam: J=63.5% C=79.0% |
| Second worst | /online-counselling/hope ~ /online-counselling/mission: J=63.1% C=77.4% |
| Third worst | /online-counselling/kelowna ~ /online-counselling/vernon: J=62.6% C=77.0% |
| **Most distinct pair on the whole set** | /online-counselling/fort-st-john ~ /online-counselling/vancouver: J=51.2% |

That last row is the damning one. Even the *two least similar* city pages share **52%** of their
five-word sequences. There is no subset of these pages that passes a duplication test.

By contrast the **service pages are healthy**: 11.5% average Jaccard,
**0 of 36 pairs** over the 25% ceiling. Whatever is wrong with the city pages is a
property of that one template, not of the site's writing.

**Why this specific pattern is dangerous.** Westpeak is a 100% virtual practice — no office, no
local address, no local staff anywhere in BC. That means:

1. **The local map pack is structurally unreachable.** Google Business Profile requires a
   verifiable address and serves the pack on proximity. These pages cannot win the format that
   "counselling in Kelowna" actually returns.
2. **In organic, they are outgunned.** Those SERPs are held by directories with domain authority
   in the 70s-80s (Psychology Today, CounsellingBC, First Session) and by clinics with real
   offices in that city. A 200-word page with a swapped city noun beats neither.
3. **The penalty is site-wide, not page-level.** Google's helpful-content signals are evaluated
   across the domain. 8,504 words of near-duplicate text against 3,805 words of genuine
   content means **the duplicated mass outweighs the unique mass 2.2:1**. That ratio is the
   single biggest risk to this domain's ability to rank for anything at all — including the
   service pages, which are good.

### ▲ CRITICAL — every page on the site is thin

| Group | Pages | Unique words | Range |
|---|--:|--:|---|
| Core | 9 | 2,141 | 17–558 |
| Services | 9 | 1,664 | 172–196 |
| Cities | 43 | 8,504 | 192–209 |
| **Total** | **61** | **12,309** | — |

**Pages at or above 700 words: 0.** For competitive health queries the pages that rank are
routinely 1,200–2,500 words. The nine service pages are the site's commercial core and average
**185 words** — they read as well-written summaries of pages that do not exist yet.

### ▲ Orphans and weak internal linking

- **True orphans: 1** (`/_not-found` — a 404 page, correctly excluded from the sitemap).
- **But all 43 city pages had exactly one inbound link** (the `/online-counselling` hub) before this
  audit. One inbound link from one hub is barely above orphaned — it signals to a crawler that
  the site itself does not consider these pages important.
- `/services/online-counselling-bc` and `/services/south-asian-mental-health` also sit at 1
  inbound link, because the footer only lists the first 6 of 9 services.
- **No page anywhere links sideways.** The card grids link down; nothing links across. There is no
  cluster structure to speak of.

### ▲ Anchor text

- `Explore Services` × 44 and `View Fees` × 11 — these are hero buttons, so the cost is low, but
  they are the site's most repeated internal anchors and they describe nothing.
- Card grids use `Learn more →` as the visible call, though the `<a>` wraps the service name too,
  so the accessible name is acceptable. Worth tightening, not urgent.

### ▲ Images and alt text

The site had **zero content images** before this session. The About page portrait added today
carries descriptive alt text. No other page has an image — which is a missed opportunity for
engagement signals, not a defect.

---

## 1c. Technical SEO

| Item | Status | Note |
|---|:-:|---|
| `sitemap.xml` | ✅ | Generated from `lib/`; now includes `/book` |
| `robots.txt` | ✅ | `allow: /`, sitemap declared |
| Self-canonicals | ✅ | **61/61 pages** — clean |
| Title uniqueness | ✅ | Only `/` and `/_not-found` collide (404 is noindex in practice) |
| Title length ≤60 | ✅ | **Fixed this session** — was 8 over, now 0 |
| Description length ≤155 | ✅ | **Fixed this session** — was 53 over, now 0 |
| Open Graph title/desc | ✅ | Present |
| **Open Graph image** | ❌ | **0 of 61 pages.** Every shared link previews as a blank card |
| Twitter card | ⚠️ | `summary_large_image` declared site-wide but no image exists to fill it |
| JSON-LD | ⚠️ | Only `MedicalBusiness` (site-wide) + `FAQPage` on `/faq` |
| — missing | ❌ | No `Service`, `Article`, `BreadcrumbList`, or `Person` schema |
| — `sameAs` | ✅ | **Added this session** — links the Instagram profile to the business entity |
| Heading hierarchy | ✅ | Exactly one `<h1>` per page, no skipped levels |
| Mobile | ✅ | Verified at 375px — single column, no horizontal overflow |
| Core Web Vitals risk | ✅ | Fully static, 87 kB shared JS, one optimised image. Low risk |
| `lang` attribute | ✅ | `en-CA` |
| Redirects | ✅ | 7 Wix → new-route 301s intact in `next.config.mjs` |

---

## 1d. Keyword and intent gap map

**Method disclosure:** no keyword-volume tool is connected to this session (Ahrefs and similar
require authorisation), so **there are no measured search volumes in this document.** Ranking
below is by reasoned opportunity — live SERP inspection to judge what currently ranks and how
beatable it is, weighted by how close the query sits to a booking decision. Where I say "high
demand" it is a judgement, not a measurement. Volumes should be confirmed in Search Console
once the site is live on the real domain.

### What each existing page currently targets

| Page | Primary intent | Verdict |
|---|---|---|
| `/` | brand + "online counselling BC" | Reasonable, under-supported |
| `/services/*` (9) | commercial: "<service> counselling BC" | **Right targets, far too thin to win** |
| `/online-counselling/*` (43) | local: "counselling in <city>" | **Unwinnable — see §1b** |
| `/pricing` | "counselling cost BC", coverage | Good intent, 151 words |
| `/faq` | long-tail question intent | Best-structured page on the site |
| `/about` | brand / trust | Fine for its job |
| `/contact`, `/book` | navigational / conversion | Not search targets |

### Ranked gap list — this is what should drive Phase 2

**Tier 1 — build first. High intent, weak incumbents, directly feeds bookings.**

1. **Insurance & coverage.** "does insurance cover counselling BC", "is therapy covered by MSP",
   "which insurers cover an RCC". SERPs are entirely small-practice blog posts, most under 800
   words and several out of date. This is the last question a person asks *before* booking, and
   nobody in BC owns it properly. Highest opportunity on the list.
2. **Professional-title comparison.** "RCC vs psychologist BC", "counsellor vs therapist
   difference". Incumbents are practice blogs plus one Kelty page. Beatable with a genuinely
   complete BC-specific answer, and it is a decision query — the reader is choosing who to see.
3. **EMDR explainers.** "what is EMDR", "what happens in an EMDR session", "does EMDR work
   online". Current results are US-centric and generic. A BC-specific, virtual-specific answer
   is an unfilled gap, and it feeds the EMDR service page directly.
4. **Online-therapy efficacy.** "is online therapy as effective as in person". For a 100% virtual
   practice this is *the* objection. Owning the answer is worth more than ten city pages.

**Tier 2 — strong, build after Tier 1.**

5. **Anxiety differentiators.** "anxiety attack vs panic attack", "high-functioning anxiety
   signs". Large informational demand; feeds the anxiety service page.
6. **First-session expectations.** "what to expect first therapy session". Removes the single
   biggest booking blocker.
7. **Punjabi / South Asian cluster.** "therapy in Punjabi", "intergenerational trauma explained",
   "South Asian family expectations therapy". The head terms are locked up by directories, but
   **nobody owns the explainer content** — and this is the practice's only genuine moat. Strategic
   priority even where raw demand is smaller.
8. **Couples / Gottman.** "how the Gottman Method works", "couples therapy vs individual".
9. **Cost and access.** "how much does counselling cost in BC", "low-cost counselling BC",
   "sliding scale therapy".

**Tier 3 — audience pages, build selectively (3–5 max).**

10. New parents / postpartum · university students · first responders · healthcare shift workers ·
    first-gen professionals · men's mental health. Build only those where the copy would genuinely
    differ, not just the header.

**Tier 4 — explicitly DO NOT BUILD.**

- **Service × city matrix.** 9 services × 43 cities = 387 possible pages, or 54 even against a
  reduced city set. Every one would be a template with two swapped nouns. This is the exact
  doorway pattern that caused the current problem; building it would multiply the damage.
- **More cities.** The 43 are already 26 too many.
- **Condition pages duplicating service pages** (e.g. a `/guides/anxiety` that restates
  `/services/anxiety-counselling`). Deepen the service page instead.

---

## 1e. Prioritised fixes

### Quick wins — APPLIED THIS SESSION ✅

| Fix | Detail |
|---|---|
| **Counsellor name scoped to `/about`** | 22 violations removed across `app/`, `components/`, `lib/`. Name moved out of `lib/site.ts` into a local constant in `app/about/page.tsx` so it cannot leak again |
| **Titles ≤ 60 chars** | 8 over-length titles fixed; city titles switched to `absolute` so the brand template cannot push them over |
| **Descriptions ≤ 155 chars** | 53 over-length descriptions fixed (43 via the city template, 10 individually) |
| **Grammar bug in city meta** | `"and the Vancouver Island"` → `"and Vancouver Island"` across all 43 |
| **`sameAs` added to JSON-LD** | Links the Instagram profile to the business entity |
| **`/book` page created** | Dedicated on-site booking page; all 10 CTAs repointed to it |
| **`founder` removed from schema** | Was surfacing the counsellor's name site-wide in structured data |

### Structural — Phase 2/3, pending approval

1. **Resolve the 43 city pages** (recommendation in the Gate 1 note below). Highest priority.
2. **Deepen the 9 service pages** from ~185 to 700–900 words each. Highest ROI content work on
   the site — these are the pages closest to a booking.
3. **Build the Tier 1 guide and resource cluster.**
4. **Add an OG image** so shared links stop previewing blank.
5. **Add `Service`, `Article`, and `BreadcrumbList` schema.**
6. **Build real internal linking** — every page to ≥2 inbound links, in-body contextual links,
   descriptive anchors, hub-and-spoke clusters.

---

## 2. Recommendation on the 43 city pages

**Consolidate 43 → 6.** Cut 37, rebuild 6 properly.

**Keep and rebuild to 700+ words each:**

| City | Why this one survives |
|---|---|
| **Surrey** | The practice's home community and BC's largest Punjabi population. A genuinely different page can be written here |
| **Vancouver** | Largest raw demand in the province; worth one strong page |
| **Abbotsford** | Fraser Valley Punjabi community; distinct from Surrey in access and demographics |
| **Victoria** | Island hub — a real "why virtual matters when you're across the water" angle |
| **Kelowna** | Interior hub; genuine shortage of Punjabi-speaking RCCs |
| **Prince George** | Northern Health — the strongest honest case for virtual care anywhere in BC. Real scarcity, real wait times, real story |

**Cut (37):** every other city. 301 them to `/online-counselling` in `next.config.mjs`.

**Why 6 and not 12 or 20.** The test each page must pass is: *is there something true and
specific about accessing counselling from this place that changes what the page says?* Six pass
it. Burnaby, Coquitlam, Port Moody and the rest of Metro Vancouver do not — for a virtual
practice they are the same page as Vancouver with a different word in it. Nanaimo and Kamloops
are borderline; they can be added later if the first six earn impressions in Search Console.
Building on evidence beats building on hope.

**Why cutting is safe here.** These URLs have never been indexed — the site has never been live
on the real domain. There is no equity to lose. This is the one moment when this correction costs
nothing.

---

## 3. Proposed Phase 2 build plan

| Type | Now | Proposed | Change |
|---|--:|--:|---|
| Core pages | 8 | 8 | Deepen `/pricing`, `/faq`, `/online-counselling` |
| Service pages | 9 | 9 | **Deepen all 9** to 700–900 words. No new pages |
| City pages | 43 | **6** | **Cut 37**, rebuild 6 at 700+ words |
| Guides `/guides/[slug]` | 0 | 12 | Tier 1 + Tier 2 gaps |
| Comparisons `/compare/[slug]` | 0 | 4 | Tier 1 #2 and related decision queries |
| Resources `/resources/[slug]` | 0 | 5 | Insurance, MSP, crisis directory, glossary, low-cost |
| Audience `/for/[slug]` | 0 | 5 | Only where the copy genuinely differs |
| New hubs | 0 | 4 | `/guides`, `/compare`, `/resources`, `/for` |
| `/_not-found` | 1 | 1 | — |
| **Total** | **61** | **54** | **−7 pages** |

**53 indexable pages** (54 minus `/_not-found`), down from 60 today.

**Why this number.** The page count goes *down* 12% while unique content goes up roughly
**5×** — from 12,309 words to an estimated 45,000+, essentially all of it unique. That is the
trade this site needs. Every page in the proposed set answers a distinct question from the ranked
gap list, and every one can be made materially better than what ranks for it today, because the
incumbents are thin practice blogs rather than serious resources. If any page cannot clear that
bar during Phase 2, it gets cut and the total drops — the number above is a ceiling, not a quota.

---

## 4. Build completed — final state

Phases 2 and 3 were approved and built. Phase 4 QA results below are measured from the rendered
HTML of the local production build, not from source.

### Final page count

| Type | Before | After | Change |
|---|--:|--:|---|
| Core pages | 7 | 8 | `/book` added |
| Service pages | 9 | 9 | **All deepened**, 172–195 → 900–1,300 words |
| City pages | 43 | **6** | **37 cut and 301'd** |
| Guides `/guides/[slug]` | 0 | 9 | + hub |
| Comparisons `/compare/[slug]` | 0 | 3 | + hub |
| Audience `/for/[slug]` | 0 | 5 | + hub |
| Resources `/resources/[slug]` | 0 | 4 | + hub |
| Hubs | 0 | 4 | `/guides`, `/compare`, `/for`, `/resources` |
| **Indexable total** | **60** | **48** | **−20%** |

### Content mass

| | Before | After |
|---|--:|--:|
| Unique words site-wide | 12,309 | **40,281** |
| Of which near-duplicate city text | 8,504 (69%) | 0 |
| Pages ≥700 words | **0** | 32 |

**Page count fell 20% while unique content rose 3.3×.**

### Phase 4 QA results

| Gate | Result |
|---|---|
| `npm run build` | ✅ Clean, 53 routes generated |
| **Body-copy overlap ≤25%** | ✅ **Max pair 18.1%** (`/faq ~ /`). **Zero pairs above 25%** across all 1,128 combinations |
| **Orphans / inbound links** | ✅ **Zero pages with <2 in-body inbound links** (header/footer chrome excluded from the count) |
| **Counsellor name scoped to `/about`** | ✅ 4 matches, all in `app/about/page.tsx` |
| **Booking CTAs** | ✅ Every page has ≥3 touchpoints (hero, mid-page contextual, closing `CtaBand`), all reading `site.bookingPath`. `/book` itself correctly has none |
| Titles ≤60 chars | ✅ 0 over |
| Descriptions ≤155 chars | ✅ 0 over |
| Self-canonicals | ✅ 48/48 |
| Duplicate titles | ✅ None |
| Generic anchor text | ✅ None remaining |
| Broken internal links | ✅ None |
| JSON-LD | ✅ `Service`, `Article`, `FAQPage`, `BreadcrumbList`, `MedicalBusiness` |
| Deployed | ❌ **Not deployed**, as instructed |

**Uniqueness method:** 5-gram shingle Jaccard similarity across every page pair, computed on visible
`<main>` text with shared header, footer, and the closing `CtaBand` stripped, so site chrome cannot
inflate a match.

### What was deliberately NOT built

- **Service × city pages — zero.** 9 services × 6 cities = 54 pages of two swapped nouns. This is the
  doorway pattern that caused the original problem; building it would have multiplied the damage.
- **37 city pages cut**, not enriched. Only six places have something true and specific enough about
  local access to change what the page says.
- **3 of the 12 planned guides.** The remaining candidates overlapped pages that already exist — a
  `/guides/anxiety` would have restated `/services/anxiety-counselling`. Deepening the service page
  was the better move.
- **"Weekly vs biweekly sessions" comparison.** A real question with about two paragraphs of real
  answer. It belongs inside the individual therapy page, which is where it now lives.
- **Therapy-terms glossary.** Would have been a definition list restating terms already explained in
  context across the guides, with no query it could win.

**The final count is 48 because that is what could be justified**, not because a target was set.

---

*Phases 1–4 complete. Built locally, verified, not deployed.*
