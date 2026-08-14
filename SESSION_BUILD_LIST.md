# Everything Claude Code can do in-session — 62 items

**Date:** 2026-08-13
**Companions:** `RANKING_MODEL.md`, `PATH_TO_950.md`

---

## 0. Read this before the list

Two different numbers keep getting conflated, and the honest answer depends on separating them.

| | Now | What this session can reach |
|---|---:|---:|
| **Today-score** (where the site actually ranks) | 58 | **~75** |
| **Ceiling** (where it *could* rank once authority arrives) | 488 | **~830** |

**Today-score barely moves in this session, and nothing in this list changes that.** It is gated
by domain authority (3/100), directory citations (15/100) and a homepage Google still serves
under its old Wix title. All three are owner-side. No file I write moves them.

**Ceiling moves a lot** — because ceiling is set by *what query space you own pages for*, and
building pages is exactly what I can do. Every item below is scored in **ceiling points**.

> **900 as an actual ranking is 18–30 months away and requires the owner-side work.** Anyone —
> including me — who hands you a 50-item code checklist that sums to 900 *rankings* is selling
> motion as progress. This list gets the ceiling to ~830. That is the real number.

**Points do not sum linearly.** They overlap and diminish; the block subtotals already discount
for that. The stated total is the discounted figure, not the column sum.

### The one gate I cannot pass

I can draft Punjabi clinical copy. **I cannot validate it.** Publishing slightly-wrong Gurmukhi
clinical language destroys the exact credibility those pages exist to build.

Resolved by sequencing: **most searches for Punjabi-language therapy are typed in English**
("Punjabi speaking counsellor Prince George"). Block B is English-language pages targeting those
searchers — full traffic value, zero translation risk, ships today. Block C is Gurmukhi-script
content, drafted and **held** for a fluent reviewer.

### Scope honesty

62 items is not one session. Roughly 40+ substantial pages with real research is multi-session
work. The list is ordered so that stopping at any point has banked the most ceiling available for
the time spent. Blocks A and B are ~70% of the total value.

---

## BLOCK A — Retargeting *(free, minutes, do first)* — **+35**

| # | Item | Pts |
|---|---|---:|
| 1 | Build the target query portfolio into `lib/targets.ts` as tracked data — the six-city head-term set is replaced as the definition of "winning" | **15** |
| 2 | Rewrite `SCORE_LEDGER.md` to score against the portfolio, not city head-terms | 8 |
| 3 | Add a `npm run targets` report listing each target, its ceiling, and whether a page exists for it | 7 |
| 4 | Amend the `lib/locations.ts` retirement comment — record that templated city pages lose *at zero authority*, and that the decision is staged, not permanent | 5 |

---

## BLOCK B — Punjabi × region, in English *(the highest-ceiling work on the site)* — **+185**

Ceiling on this intersection is **960**: no map pack triggers, no direct competitor, and virtual
is the only delivery method that reaches these searchers at all.

| # | Item | Pts |
|---|---|---:|
| 5 | `lib/punjabi-regions.ts` + `/punjabi/[region]` route, mirroring the depth contract in `lib/locations.ts` | **18** |
| 6 | Punjabi-speaking counselling — **Prince George / Northern BC** (deepest; the CMHA data already supports it) | **16** |
| 7 | Punjabi-speaking counselling — **Kamloops / Thompson-Nicola** | 12 |
| 8 | Punjabi-speaking counselling — **Kelowna / Okanagan** | 12 |
| 9 | Punjabi-speaking counselling — **Nanaimo / Vancouver Island** | 12 |
| 10 | Punjabi-speaking counselling — **Cranbrook / Kootenays** | 10 |
| 11 | Punjabi-speaking counselling — **Fort St John / Peace** | 10 |
| 12 | Punjabi-speaking counselling — **Terrace / Prince Rupert / Northwest** | 9 |
| 13 | Hub page: *Punjabi-speaking therapy anywhere in BC* — the province-level anchor the region pages link up to | **14** |
| 14 | Punjabi × **EMDR** | 11 |
| 15 | Punjabi × **couples counselling** | 11 |
| 16 | Punjabi × **anxiety** | 9 |
| 17 | Punjabi × **trauma** | 9 |
| 18 | Punjabi × **depression** | 8 |
| 19 | Punjabi × **intergenerational family conflict** — culturally specific, genuinely underserved, high intent | **13** |
| 20 | Punjabi × **mental-health stigma in South Asian communities** — the highest-empathy entry point in the cluster | **12** |
| 21 | Punjabi × **newcomer / immigration stress** | 9 |
| 22 | Cross-link matrix: every region page ↔ every modality page ↔ the hub | 8 |

---

## BLOCK C — Gurmukhi script *(drafted, HELD for fluent review)* — **+55**

⚠️ **None of this publishes without a fluent speaker signing off.** I will write it, mark every
page `draft: true`, and exclude it from the sitemap until cleared.

| # | Item | Pts |
|---|---|---:|
| 23 | Gurmukhi versions of the hub + top 5 region pages | **20** |
| 24 | `hreflang` pairing `en-CA` ↔ `pa-IN` across every pair, plus `x-default` | 10 |
| 25 | `inLanguage: 'pa'` on schema for Gurmukhi pages | 6 |
| 26 | Gurmukhi glossary — therapy terms mapped Gurmukhi ↔ English ↔ plain English | **10** |
| 27 | Gurmukhi OG images (Gurmukhi font already loads via `app/fonts-gurmukhi.ts`) | 5 |
| 28 | A `check-draft.mjs` that hard-fails the build if any `draft: true` page reaches the sitemap | 4 |

---

## BLOCK D — Northern & regional depth — **+70**

| # | Item | Pts |
|---|---|---:|
| 29 | Expand `/online-counselling/prince-george` into the definitive Northern BC access resource | **16** |
| 30 | New deep region pages — **Kamloops, Nanaimo, Fort St John, Cranbrook, Terrace** | **20** |
| 31 | ⚠️ Un-retire selected slugs from the 37 in `next.config.mjs` — **only** where a genuinely deep page now exists. Reverses a documented decision; I will list exactly which and why before touching redirects | 12 |
| 32 | Region hub `/online-counselling/northern-bc` with the five northern cities beneath it | 9 |
| 33 | Health-authority pages — Northern Health, Interior Health, Island Health — access routes and what private virtual care adds | **13** |

---

## BLOCK E — Original research *(the only authority lever that isn't owner-side)* — **+75**

With review solicitation prohibited by BCACC, being **cited** is the path to referring domains.

| # | Item | Pts |
|---|---|---:|
| 34 | Research + compile **BC counselling wait times by health authority** from public sources | **18** |
| 35 | Research + compile **counsellor density per capita by region** (BCACC register vs StatsCan) | **17** |
| 36 | Research + compile **language availability by region** — the data that proves the Punjabi thesis | **16** |
| 37 | Publish as the **BC Counselling Access Report 2026** — cited, dated, methodology stated, updateable | **14** |
| 38 | Machine-readable companion (CSV + JSON) so others can cite the dataset directly | 6 |
| 39 | `Dataset` schema on the report | 4 |

---

## BLOCK F — Modality clusters *(no map pack on these either)* — **+50**

| # | Item | Pts |
|---|---|---:|
| 40 | **EMDR intensive BC** cluster — few practices offer true intensives; it is already a bookable service at $190/90min | **15** |
| 41 | *EMDR intensive vs weekly EMDR* — decision-stage comparison | 10 |
| 42 | *What an EMDR intensive day actually looks like* | 8 |
| 43 | Couples-therapy province-level cluster | 9 |
| 44 | Low-cost / sliding-scale counselling in BC — real access content, high volume, genuine differentiator already offered | **8** |

---

## BLOCK G — Enablement, schema, technical — **+30**

| # | Item | Pts |
|---|---|---:|
| 45 | `Service` schema with province-level `areaServed` on all new clusters | 5 |
| 46 | Multi-practitioner readiness — refactor `Person` schema to an array so the RCC hire drops in without a rewrite | **7** |
| 47 | `lib/` module + route for practitioner profiles, hidden until staffed | 5 |
| 48 | `check-similarity.mjs` — uniqueness gate across all pages; the 40+ new pages make this mandatory, not optional | **6** |
| 49 | `check-hreflang.mjs` — validates every pair resolves both ways | 3 |
| 50 | Extend `llms.txt` / `llms-full.txt` to cover the new clusters | 2 |
| 51 | Add new clusters to `sitemap.xml` and the RSS feed | 2 |
| 52 | Internal links from the highest-authority existing pages into the new clusters | **5** |
| 53 | `check-orphans.mjs` — nothing new lands more than 3 clicks from `/` | 3 |

---

## BLOCK H — Conversion *(0 ceiling points; moves revenue, not rank)* — **+0**

Listed because ranking is not the goal — booked consultations are.

| # | Item | Pts |
|---|---|---:|
| 54 | Punjabi-language booking path copy, end to end | 0 |
| 55 | Language-preference field surfaced at booking | 0 |
| 56 | Region-aware CTA — a Prince George visitor sees availability framed for their timezone and access reality | 0 |
| 57 | "Is virtual right for me?" self-check on region pages | 0 |
| 58 | Track consultation bookings by entry cluster, so the portfolio can be judged on revenue rather than position | 0 |

---

## BLOCK I — Marginal on-page *(exhausted; listed for completeness)* — **+3**

On-page is 95/100. This block is the honest remainder.

| # | Item | Pts |
|---|---|---:|
| 59 | Re-audit the 108 over-length meta descriptions flagged earlier | 1 |
| 60 | Second pass on the 16 pages under 900 words | 1 |
| 61 | Mobile LCP item 8 — still open, still unmeasurable locally | 0.5 |
| 62 | Hydration-split item 52 — unverifiable without field data | 0.5 |

---

## Totals

| Block | Ceiling pts |
|---|---:|
| A — Retargeting | +35 |
| B — Punjabi × region (English) | +185 |
| C — Gurmukhi (held for review) | +55 |
| D — Northern & regional depth | +70 |
| E — Original research | +75 |
| F — Modality clusters | +50 |
| G — Enablement & technical | +30 |
| H — Conversion | +0 |
| I — Marginal on-page | +3 |
| **Discounted total** | **+342** |

**488 → ~830 ceiling.**

To close the last ~120 to 950 requires the second practitioner (Move 3) and 12–18 months of the
research report earning citations (Move 4). Neither is a file I can write.

---

## What none of this does

It does not raise today's ranking. That still needs, in order: Psychology Today, the GSC
recrawl request, CounsellingBC / Theravive / TherapyTribe, and one service-area GBP — roughly
six hours of owner time, worth **+150 today-points**, which is more than this entire list moves
the number people actually experience.

**Build the ceiling here. The owner-side six hours are what makes it pay.**
