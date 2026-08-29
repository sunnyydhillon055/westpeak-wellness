# Growth plan — from 150 impressions a day to 4,000

**Written:** 28 August 2026, against the fresh Search Console export (3-month view:
80 clicks, 4.22K impressions, CTR 1.9%, position 37.3; CSVs in `data/gsc/2026-08-28-*`).
**Target set by the owner:** 4,000 impressions/day and 30 clicks/day.

## What the chart actually says

1. **The peak was self-demolished, on purpose.** Impressions hit ~500/day on 11–13 Aug
   and fell to ~150/day by the 17th — the exact window in which this repo 301'd 37
   near-duplicate city pages and pulled the Alberta launch. Those were junk impressions
   on thin pages; the decline is a quality trade the audit trail predicted, not a
   penalty. But it means today's baseline is ~150/day, and the first milestone is simply
   winning back the peak with pages that deserve it.
2. **Demand found the site somewhere nobody was aiming.** The largest single impression
   cluster in the window (~170) is *definitional*: "registered clinical counsellor",
   "rcc bc", "rcc designation", "registered counsellor", "licensed counsellor" — and the
   site had **no page for it**. The comparison page was catching the bare query at
   position 40+ because it targets a different intent. **Fixed today:**
   `/resources/what-is-a-registered-clinical-counsellor` now carries the definitional
   intent and cross-links the compare and verify pages.
3. **The stress-leave cluster is the best page-2 asset on the site.** ~120 impressions
   across eight query phrasings at positions 16–28. The guide is already definitive —
   2,882 words, exact-phrase FAQs ("is stress leave paid in BC" is answered verbatim,
   with the 2026 EI figures). What it lacks is authority and time, not content.
4. **The Vancouver cluster (~260 impressions, positions 43–56) is authority-gated.**
   No on-page change moves position 45 to page 1 on "online counselling vancouver";
   referring domains and the directory/GBP stack do.
5. **The Punjabi intersection is confirmed on Google, not just Bing.** Surrey at
   position 8, an Abbotsford click. Small volume, real positions — the strategy's first
   Google-side receipts.
6. **CTR (1.9%) is a position problem, not a title problem.** Almost nothing sits in
   the top 10 on volume queries; the six top-3 rankings carry trivial impressions. CTR
   fixes itself as positions arrive; no title surgery needed.
7. Noise to ignore: careers queries (clicks, not clients), "counselling bc login",
   "derry west", "stay at work services" — wrong-intent impressions worth nothing.

## The honest arithmetic on 4,000/day

4,000/day is **27×** today's run-rate — the impression volume of BC counselling's
biggest content publishers, earned by hundreds of page-1 rankings plus a local surface.
30 clicks/day at a realistic blended CTR needs ~800–1,500 of those impressions sitting
on page 1. No tactic produces that this quarter; a system produces it inside a year.
And a capacity note that belongs in this plan: 30 clicks/day ≈ 900/month ≈ 25–45
enquiries/month at this site's funnel shape — **more than a solo caseload absorbs.**
The second-practitioner move (PATH_TO_950 §Move 3) is part of this target, not an aside.

## The milestone ladder

| Horizon | Impressions/day | Clicks/day | What gets it there |
|---|--:|--:|---|
| Now | ~150 | ~0.5 | — |
| 6 weeks | **500+** (retake the peak) | 3–5 | RCC page indexed · stress-leave push · six drafts published · GBP + directories submitted · IndexNow on every change |
| 3 months | **1,000–1,500** | 8–15 | BC-practicalities cluster built (below) · directories live · citations fixed · cadence at 2/month · seasonal pieces catching Sept–Oct demand |
| 6–12 months | **2,500–4,000** | 20–30 | Sustained calendar · the citable-research play (Access Report, PATH_TO_950 §Move 4) earning referring domains · GBP verified · second practitioner multiplying directory surface |

Anyone promising 4,000/day faster than this on a three-backlink domain is selling something.

## The plays, in order

**1. Serve the demand already measured (this week — largely code, largely done).**
The RCC definitional page shipped today. Next, the cluster the data votes for: BC
mental-health *practicalities* — the site's proven genre (stress leave, MSP, verify,
workplace are its four strongest organic assets). Build the adjacent pages, all
factual/regulatory, none requiring clinical sign-off:
EI sickness benefits and therapy · getting a doctor's note for a mental-health leave ·
return-to-work after a leave · WorkSafeBC psychological-injury claims · short-term
disability and counselling. Six to ten pages, each targeting query families the
stress-leave cluster proves exist.

**2. Push page 2 to page 1.** stress-leave-bc (16–28), msp-vs-extended (12),
workplace-mental-health (17), rcc-vs-psychologist compare (17), verify-a-counsellor
(31). On-page these are done; what moves them is freshness signals, internal anchors,
IndexNow pings — and above all play 4.

**3. Publish the six drafts (the counsellor, one hour).** Every guide is a new query surface;
the two seasonal pieces are aimed at the exact Sept–Oct demand window now opening.
This is still the highest points-per-minute action anyone can take.

**4. The off-site sprint (unchanged, now with demand numbers attached).** The
Vancouver cluster's 260 impressions at position 45 are what authority buys back.
`PATH_TO_700_2026-08-28.md` prices every action; nothing in this plan replaces it.

**5. Cadence, forever.** `CONTENT_CALENDAR.md` holds eleven timed pieces;
`SOCIAL_QUEUE.md` leads with the Punjabi surfaces. The 3-month milestone assumes
two publishes a month actually happen.

**6. Measure weekly, not vibes-ly.** Export GSC pages + queries into `data/gsc/`
weekly. Watch three numbers: stress-leave cluster position, definitional-cluster
position (new page), impressions/day trend. Re-run the audit scale two weeks after
the off-site sprint lands — not before.
