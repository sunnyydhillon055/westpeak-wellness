# Interprovincial expansion ledger

**17 August 2026.** Both clusters built. **Neither is published.**

Alberta went live and came back down the same day: the owner confirmed the
professional liability policy does not extend outside British Columbia. See
`ALBERTA_LAUNCH_CHECKLIST.md`.

## What shipped

| Cluster | Built | Published | Gated on |
|---|--:|---|---|
| Alberta | **7** | **no** | Insurance. Regulation is clear; cover is not. |
| Ontario | **7** | **no** | CRPO registration **and** insurance. |
| **Total** | **14** | | |

Nothing was deleted. Both clusters are complete and reverse with one environment
variable each.

`node scripts/expansion-verify.mjs` — **all checks pass**, including the four locks on
each gated province, province-correct crisis numbers, no protected titles, no premises
claimed where there is none, and a uniqueness worst-pair of **23%** against a
25% limit.

---

## The directive asked for ~60 pages. 14 shipped. Here is exactly why.

The directive specified ten page types per city across five cities. **Ten of
those types do not vary by city**, and building them per-city would have
produced precisely the duplication the directive's own <25% rule forbids.

### Cut, and the reason

| Cut | Count | Why |
|---|--:|---|
| `therapy-cost-and-coverage` per city | 4 | Alberta insurers do not differ between Calgary and Edmonton; Ontario insurers do not differ between Toronto and Oshawa. Built once per province instead, linked from every city page. |
| `finding-a-therapist` per city | 5 | Verification is a provincial question — it turns on which regulator exists, not which city you are in. Built once per province as `is-my-therapist-registered`. |
| `anxiety-counselling` per city | 5 | A service fact. "Calgary anxiety counselling" and "Edmonton anxiety counselling" differ by one word. |
| `depression-counselling` per city | 5 | Same. |
| `trauma-therapy` per city | 5 | Same. |
| `emdr-therapy` per city | 5 | Same. |
| `couples-counselling` per city | 5 | Same. |
| `online-counselling` for Calgary/Edmonton/Toronto/Brampton | 4 | Absorbed into the province hub and the wedge pages, which already carry the local context those pages would have. Oshawa kept its own, because Durham's shift-work and commuter framing is genuinely distinct. |
| `south-asian-therapist` for Calgary/Edmonton | 2 | Folded into the Punjabi pages for those cities rather than split across two near-identical pages. Kept separate for Brampton, where there is enough distinct material to carry both. |

**~40 pages cut.** Every one of them would have been a service page or a
province-level page with a city name swapped in.

### Why this is the right call and not a shortfall

Two things in this repository already say so, independently of me:

1. **`lib/locations.ts`** states the site's own governing rule, and it is why
   the practice runs six BC city pages rather than forty-three: *"A city page is
   kept ONLY where something true and specific about accessing care from that
   place changes what the page says."* The other 37 are 301'd.

2. **`SEO_COMPETITIVE_2026-08-17.md`** found the same thing from the other
   direction. Clearheart runs **30 templated city pages** at ~1,100 words and
   outranks this site. The audit's conclusion was that the *only* reason
   Westpeak's city pages are defensible is that they are **not** templated —
   content depth is the one category where this site leads the benchmark set
   (760/1000, first). Shipping 25 templated pages would have spent that
   advantage to buy volume the site cannot win on.

The directive anticipated this and provided the instruction I followed: *"if an
Edmonton page cannot be written distinctly, cut it and report the reduced
count."*

---

## Pages built, and the query each targets

### Alberta — built, gated on insurance

| Page | Target query | Why it can win |
|---|---|---|
| `/alberta` | online counselling alberta | Province hub; carries the regulatory answer nobody else states plainly. |
| `/alberta/calgary/punjabi-speaking-counselling` | punjabi counsellor calgary | **Wedge page.** Directory stubs rank here with no real content. |
| `/alberta/edmonton/punjabi-speaking-counselling` | punjabi therapist edmonton | Wedge. Supply genuinely thin; waitlists common. |
| `/alberta/punjabi-counselling` | punjabi counselling alberta | Province-wide surface, partly in ਪੰਜਾਬੀ. |
| `/alberta/counselling-coverage-alberta` | does ahcip cover counselling | **The linkable asset.** Reference table shape, built for citation. |
| `/alberta/is-my-therapist-registered` | is my therapist registered alberta | High-trust, genuinely useful, and nobody else answers it honestly because the honest answer is "there is no college". |
| `/alberta/red-deer-lethbridge-and-beyond` | counselling red deer / lethbridge online | Where provision is thinnest and video is the only route. |

### Ontario — built, dormant

| Page | Target query |
|---|---|
| `/ontario` | online counselling ontario |
| `/ontario/brampton/punjabi-speaking-counselling` | punjabi counsellor brampton |
| `/ontario/brampton/south-asian-therapist` | south asian therapist brampton |
| `/ontario/toronto/punjabi-speaking-counselling` | punjabi therapist toronto |
| `/ontario/oshawa/online-counselling` | counselling oshawa online |
| `/ontario/counselling-coverage-ontario` | does ohip cover therapy |
| `/ontario/punjabi-counselling` | punjabi counselling ontario |

---

## Infrastructure built

- **`lib/crisis.ts`** — province-keyed crisis resources. Every number verified
  against the operator's own site on 17 Aug 2026; the verification date renders
  on the page. Unverified numbers are omitted rather than guessed, so a reader
  falls through to 9-8-8, which always works.
- **`lib/regions.ts`** — the province model and the Ontario gate.
- **`lib/expansion.ts` / `lib/expansion-more.ts`** — page data.
- **`components/RegionPageView.tsx`** — one renderer, so the designation line,
  crisis block and schema cannot drift between provinces.
- **`components/CrisisBlock.tsx`** — `tel:` links on every number, because the
  realistic reader is on a phone.
- **`scripts/expansion-verify.mjs`** — the pre-deploy gate.

## Two real defects this found in the existing site

1. **The footer named the BC Mental Health Support Line on every page.** Correct
   while the site served only BC; with Alberta published it put a BC-only number
   in the footer of a page written for someone in Calgary, where 310-6789 does
   not reach. A crisis number that does not connect is worse than none. The
   footer now carries only 9-8-8 and 9-1-1, which work everywhere; province
   numbers live in the page body.
2. **`app/not-found.tsx` did the same**, and a 404 is reachable from any
   province. Also fixed.

A province-aware footer was tried first and does not work — the footer is
prerendered into every static page, so a client-side path check resolves to
nothing at build time and the BC number shipped anyway. That is why the fix is
"national numbers only" rather than "detect the province".

---

## What still gates ranking, and it is not the pages

`SEO_COMPETITIVE_2026-08-17.md` measured the site at **4,050/10,000 — last of
six**, with on-site first and off-site last. Alberta starts from a worse
position than BC, not a better one:

- **Index age: zero.** These URLs have never been crawled.
- **No Alberta citations.** No Psychology Today AB, no Counselling Alberta, no
  ACTA listing.
- **No GBP, and none possible** — there is no Alberta premises, and claiming one
  would be both inaccurate and a violation of Google's guidelines.
- **No local backlinks.**

The pages are necessary and not sufficient. The owner list below is what
actually decides whether any of this ranks.
