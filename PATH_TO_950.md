# Path to a 950 ceiling

**Date:** 2026-08-13
**Companion to:** `RANKING_MODEL.md`

---

## 1. The blunt part

**950 is not reachable on the queries currently being scored.** No amount of execution gets
there, because the ceiling is arithmetic, not effort.

Page 1 of a city head-term — "counselling Vancouver," "therapist Surrey" — decomposes roughly:

| Page-1 real estate | Points | Reachable by a no-office practice? |
|---|---:|---|
| Map pack (3 slots) | 250 | **No.** Requires a verified address in that city |
| Directory results (3–5 slots) | 200 | Yes — by *being listed*, not by outranking |
| Organic practice sites (2–4 slots) | 400 | Partially — competing against office'd incumbents with years of authority |
| Snippet / People-Also-Ask / AI overview | 150 | Yes |

Best case on a city head-term: `0 + 200 + ~250 + 120 = 570`. Vancouver is worse because the
organic slots are held by Lotus, Upstream, Jericho and Thrive.

**So the 488 weighted ceiling is not a failure of the site. It is the size of the box.**
To reach 950 you have to compete somewhere the box is a different shape.

---

## 2. Where the box changes shape

The 250 map-pack points are the whole problem. **They only exist on queries with local intent.**
Remove local intent and those 250 points redistribute into organic and snippet slots — which are
reachable.

Query classes with no map pack:

- **Province-level** — "online counselling British Columbia"
- **Language-specific** — "Punjabi speaking therapist BC"
- **Modality-specific** — "EMDR intensive BC"
- **Informational** — the entire guides stack, already built

On those, the ceiling decomposition becomes:

| | Points | Reachable? |
|---|---:|---|
| Map pack | 0 | n/a — doesn't trigger |
| Directories | 200 | Yes, by listing |
| Organic | 650 | Yes, with authority + depth |
| Snippet / AI overview | 150 | Yes |

**Ceiling 1000, of which ~950 is realistically attainable.** That is where the number lives.

---

## 3. The specific opening

The site's strongest asset is being scored against the wrong benchmark. **Punjabi-language
counselling** appears across 35 files, has a dedicated route, Gurmukhi font loading, and OG
imagery. It is a real, built, staffed capability — not a claim.

**But "Punjabi counselling Surrey" is contested.** Sampled competitors: Atlas Clinical
Counselling, Hundal Counselling Centre (Surrey + Abbotsford), Tidal Trauma (Cloverdale office),
plus Psychology Today's dedicated Punjabi filter pages for BC *and* Surrey, plus CounsellingBC's
Punjabi language filter. Several have physical offices. Realistic ceiling there: **~780**.

**The intersection is nearly empty.** The Prince George page already states the fact that makes
this work:

> *"Punjabi-speaking counsellors are concentrated in the Lower Mainland. Virtual access is, for
> most of Northern BC, the only realistic route to therapy in Punjabi."*

That sentence is a market position. Every Punjabi-speaking counsellor with an office is in
Surrey, Abbotsford or Vancouver. For a Punjabi-speaking person in Prince George, Kamloops,
Kelowna, Nanaimo or Cranbrook, **a virtual practice is not a compromise — it is the only option
that exists.**

On that intersection Westpeak is not competing for a slot. It is the best available answer.

| Target class | Ceiling | Why |
|---|---:|---|
| Punjabi × outside Lower Mainland | **960** | No map pack, no direct competitor, virtual is the only delivery |
| Punjabi × modality (EMDR, couples) | **930** | Same, further narrowed |
| Northern BC virtual counselling | **870** | Thin supply, documented gap, one competitor page for the whole region |
| EMDR intensive BC | **820** | Modality-level, no map pack, few offering true intensives |
| Punjabi counselling BC (province) | **780** | Contested but no map pack |
| "counselling &lt;city&gt;" head terms | **290–560** | Capped. Leave them where they are |

---

## 4. The four moves

### Move 1 — Retarget the scorecard *(free, immediate, mine)*
Stop scoring against city head-terms. Build the query portfolio above into `lib/` as the tracked
target set. This changes no code behaviour; it changes what "winning" means. **The single
highest-leverage action here, and it costs nothing.**

### Move 2 — Own the intersection *(mine, ~3–4 weeks)*
15–25 pages on Punjabi × region and Punjabi × modality, in both English and Punjabi, with real
Gurmukhi content rather than translated boilerplate. `hreflang` between pairs. This is the
content work with the highest ceiling-per-page on the site by a wide margin.

⚠️ Requires review by a fluent Punjabi speaker before publishing. Machine-assisted Punjabi
clinical copy that reads slightly wrong is worse than none — it undermines the exact credibility
the pages exist to establish.

### Move 3 — Multi-practitioner *(owner, already in motion)*
The RCC hire is the largest ceiling multiplier available, and it is already underway. Each
additional registered counsellor adds a BCACC listing, a Psychology Today profile, a
CounsellingBC entry, a Theravive entry — **directory surface scales per practitioner, and
directories are 200 of the reachable points.** Additional languages or modalities each open new
uncontested intersections.

### Move 4 — Original research → referring domains *(both, quarterly, 12–18 months to pay)*
Authority is 3/100 and it is the binding constraint. With review solicitation prohibited by
BCACC, the only reliable lever left is **being cited**.

The seed already exists: the Prince George page cites CMHA Northern BC's 519-appointment /
30-person-waitlist figure and the pilot's funding end. Extend it into an annual **BC Counselling
Access Report** — wait times by health authority, counsellor density per capita, language
availability by region. Original, checkable, genuinely useful, and the kind of thing regional
journalists and advocacy organisations cite.

That is how a practice with no reviews and no offices earns referring domains.

**Plus the non-negotiable base from `RANKING_MODEL.md` §6:** Psychology Today, CounsellingBC,
Theravive, TherapyTribe, the GSC recrawl request, and one service-area GBP in Surrey.

---

## 5. Timeline

| Horizon | Ceiling | State |
|---|---:|---|
| Today | 488 | City head-terms, 36/100 readiness |
| +3 months | 620 | Retargeted, directories live, GBP verified |
| +9 months | 780 | Intersection pages indexed and maturing |
| +18 months | 890 | Second practitioner, first research report cited |
| +24–30 months | **950** | Authority compounded, portfolio owned |

**18–30 months, not 6.** Anyone quoting faster on a domain with three backlinks is selling
something.

---

## 6. The caveat that matters more than the number

**A 950 ceiling on a small market can be worth less than a 400 on a large one.**

"Punjabi EMDR counselling Prince George" might see 20–50 searches a month. Ranking #1 on it is a
real, defensible, compounding asset — and on its own it does not fill a caseload.

So this is not "abandon the city pages." It is a portfolio:

- **Tier 1 (intersections)** — high ceiling, low volume, high intent, genuinely defensible.
  Compounds. Builds the authority that lifts everything else.
- **Tier 3 (city head-terms)** — low ceiling, high volume. Keep the six pages. They are already
  built and they cost nothing to maintain.

The ceiling score is a means. **Track booked consultations, not position.** If the number goes to
950 and the calendar stays empty, the model was measuring the wrong thing and should be thrown
out rather than defended.
