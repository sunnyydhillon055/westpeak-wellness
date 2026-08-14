# City ranking model — Westpeak Wellness

**Date:** 2026-08-13
**Question:** how should this site rank in the six cities it targets, scored 1–1000?

---

## What this is and is not

This is a **model**, not measurement. I do not have Search Console data, a rank tracker, or
backlink data. The scores below are derived from: the live SERPs for each city (sampled), the
measured depth of each city page in this repo, the site's observable authority signals, and the
structural constraints of a practice with no physical address.

**To replace the modelled numbers with real ones**, two things would do it:
- **Search Console export** — impressions, average position and query set per page
- **Authorize the Ahrefs connector** (it is available but unauthenticated in this session) —
  real backlink counts, referring domains, and keyword difficulty per city

Until then, treat every number here as an estimate with a wide band.

---

## 1. The finding that reframes everything

**Clearheart Counselling is running Westpeak's exact strategy, and winning.**

They rank on page 1 for Vancouver, Prince George and Kelowna — sampled and confirmed — using
`/virtual-locations-bc/<city>/` pages. That is structurally the same play as
`/online-counselling/<city>`.

The difference is not the idea. It is:

| | Westpeak | Clearheart |
|---|---|---|
| City pages | **6**, deep (3,900–5,195 chars structured) | **~29**, templated and thin |
| Physical offices | **0** | **2** (Vancouver + Coquitlam) |
| Map-pack eligible | No, anywhere | Yes |
| Site age | Content days–weeks old | Established |

This matters for a decision already made in this repo. `lib/locations.ts` retires 37 city pages
on the reasoning that *"a templated 'counselling in &lt;city&gt;' page competes only against
directories and clinics with real addresses — and loses."*

**Clearheart's templated city pages do not lose.** The reasoning was incomplete: templated city
pages lose *when the domain has no authority to push them*. With authority, they win.

The retirement was still the right call for a zero-authority site — 37 thin pages would have
diluted crawl budget and risked a doorway-pattern signal. But it should be understood as
**staged, not permanent**. As authority accumulates, more city pages become viable. Revisit at
the 12-month mark, not before.

---

## 2. The second finding: directories own these SERPs

Sampled page-1 composition:

| City | Directory results on page 1 | Named |
|---|---|---|
| Prince George | **5 of 8** | Psychology Today, CounsellingBC, Theravive, TherapyTribe, First Session |
| Vancouver | 3 of 7 | CounsellingBC, First Session, + aggregators |
| Kelowna | 2 of 8 | + CMHA (institutional) |

These are DA 70–90 properties. A practice site does not outrank them — **it gets listed in
them.** For city-level queries, the directory listings are not a supporting tactic. They *are*
the strategy. Every directory listing is a page-1 slot the practice occupies by proxy, plus a
citation that feeds the domain's own authority.

**Current state:** the BCACC listing is live and ranks #1 for the brand query — above the site
itself. Psychology Today, CounsellingBC, Theravive and TherapyTribe are all absent.

That single gap explains more of the missing reach than anything in the codebase.

---

## 3. The third finding: Google is still serving the old Wix homepage

A brand search returns the homepage titled:

> `Therapy | West Peak Wellness | Surrey`

The code has said `Online Counselling in BC | Westpeak Wellness` since the migration
(`app/layout.tsx:17`). So this is a **stale index entry from the pre-Vercel Wix site**.

Two consequences, both bad:
1. The homepage has not been meaningfully recrawled since the migration.
2. The indexed brand string is **"West Peak"** — two words. Brand-match signals for "Westpeak"
   are landing on a title that does not contain it.

**Fix:** Search Console → URL Inspection → the homepage → Request Indexing. One click. Then the
same for `/`, `/online-counselling`, and the six city pages.

---

## 4. The scoring model

```
City score (1–1000) = Ceiling(city) × Readiness(site) × Trust-delay
```

**Ceiling** is city-specific and fixed by SERP structure — how much visibility is available to a
virtual practice with no office there. **Readiness** and **Trust-delay** are site-wide, which is
why all six cities move together.

### Readiness scorecard (site-wide — this gates all six cities)

| Signal | Weight | Score /100 | Note |
|---|---:|---:|---|
| Technical SEO / on-page | 20% | **95** | Genuinely excellent. Not the problem |
| Content depth | 15% | **88** | 125 pages; six city pages all deep and cited |
| Domain authority / backlinks | 30% | **3** | ← **the binding constraint** |
| Directory citations | 20% | **15** | BCACC live; four majors absent |
| Google Business Profile | 15% | **0** | None |
| **Weighted readiness** | | **36 / 100** | |

**Trust-delay multiplier: ×0.35.** A site whose homepage Google still renders under its previous
title is not being evaluated on its current content yet. This decays to ~1.0 over roughly 4–8
months of consistent crawling.

### Scores

| City | Today | 12-month achievable | Structural ceiling |
|---|---:|---:|---:|
| **Prince George** | **95** | **430** | **720** |
| Abbotsford | 70 | 330 | 560 |
| Kelowna | 55 | 285 | 500 |
| Surrey | 50 | 250 | 440 |
| Victoria | 45 | 235 | 420 |
| Vancouver | 30 | 150 | 290 |
| **Weighted average** | **58** | **280** | **488** |

**Scale anchors:** 1000 = top-3 organic + map pack for the head commercial query.
~500 = reliably page 1 for mid-tail. ~250 = page 2–3, collecting long-tail.
Under 100 = effectively invisible. **58/1000 is consistent with ~10 impressions/day.**

### Why the ceilings differ

**Prince George — 720, the highest and it is not close.**
Thinnest counsellor supply in BC. The service gap is documented, not asserted — the city page
already cites CMHA Northern BC's 519-appointment/30-person-waitlist figure and the pilot's
31 March 2026 funding end. Virtual care is the *natural* answer to that gap rather than a
substitute, which changes searcher intent in Westpeak's favour. Only one Clearheart page covers
all of Northern BC. It is also the deepest page on the site (5,195 chars).

**Abbotsford — 560.** Fraser Valley, moderate competition, fewer established virtual players.

**Kelowna — 500.** Real local practices with offices, plus CMHA occupying institutional slots.

**Surrey — 440.** Dense market, large population, many practices with addresses.
**This is where a GBP should be registered** (see §5).

**Victoria — 420.** Dense, mature therapist market; strong local incumbents.

**Vancouver — 290, the worst use of effort.** Every directory plus Lotus, Upstream, Jericho,
Thrive, Clearheart and hundreds of practices with offices. A no-office newcomer competes for
roughly two organic slots against the most contested counselling SERP in the province.

---

## 5. The map pack is structurally unreachable in five of six cities

Three of page 1 is the local pack. It requires a verified Google Business Profile, and a GBP
requires a real, verifiable address — postcard verification to a physical location.

A **service-area business** GBP can hide the address publicly, but it still has to exist, and it
ranks by proximity to it. So:

> The practice can be map-pack competitive in **exactly one** city — whichever the registered
> address sits in — plus some spillover to immediate neighbours. Not province-wide.

That is a choice worth making deliberately rather than by default. **Surrey** is the pragmatic
pick: largest population among the realistic options, and it matches where the practice actually
operates from.

This does not conflict with the remote-only positioning. A service-area GBP displays no street
address and no "visit us" affordance. Nothing in the site copy needs to change, and the
never-re-add-in-person rule stays intact.

---

## 6. What actually moves the number

Ordered by points-per-unit-effort. Note that the top three are all owner-side — **none of the
remaining upside is in the codebase.**

| # | Action | Owner | Est. gain |
|---|---|---|---:|
| 1 | Psychology Today listing | Owner | **+45** |
| 2 | Request indexing on homepage + 6 city pages in GSC | Owner, 5 min | **+40** |
| 3 | CounsellingBC, Theravive, TherapyTribe listings | Owner | **+35** |
| 4 | GBP as service-area business, Surrey | Owner | **+30** |
| 5 | Bing Webmaster Tools verification | Owner | +15 |
| 6 | Deepen Prince George into the definitive Northern BC resource | Me | +25 |
| 7 | Earn 3–5 genuine referring domains | Both | +50 (slow) |
| 8 | Further on-page work | Me | **+3** |

**Item 8 is the point.** On-page is at 95/100. Another audit pass buys roughly three points out
of a thousand. The last several sessions have been spent there, and there is nothing meaningful
left to extract.

---

## 7. Honest timeline

- **Weeks 1–4:** near-flat. Recrawl propagates, brand title corrects. Impressions maybe 10 → 40.
- **Months 2–3:** directory listings index and start referring. 150–400/day.
- **Months 4–6:** trust-delay decays, long-tail guides begin ranking. 600–1,500/day.
- **Months 6–12:** Prince George and Abbotsford reach page 1 for mid-tail. 1,500–3,000/day.
- **Vancouver head terms:** not realistically winnable at any point on the current structure.

Anyone promising faster on a domain with three backlinks is selling something.

---

## 8. Constraint worth restating

BCACC prohibits testimonials, client reviews, star ratings, and outcome claims. That removes the
single strongest local-ranking lever available to most service businesses — review volume and
velocity. Competitors that are not BCACC-registered, and every directory, use it freely.

This is not a problem to solve. It is a permanent handicap to route around, and it is already
priced into the ceilings above. The routes around it are directory presence, cited authority
content, and referring domains — which is what §6 is.
