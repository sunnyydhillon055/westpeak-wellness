# 25 things Claude Code can do to get more clients

**Date:** 2026-08-14 · **Companions:** `SESSION_BUILD_LIST.md` (ranking ceiling), `RANKING_MODEL.md`

---

## 0. Read this first — the scale, and two things it cannot fix

**Points here are not ranking points.** `SESSION_BUILD_LIST.md` scores *ceiling* — what query
space the site could own. This file scores something different and more useful: **share of the
realistically achievable new-client growth over the next six months**, out of 1000.

The two are not the same work. A page that lifts the ceiling by 40 points may bring zero clients
this year, because ceiling is gated by domain authority the site does not have yet. Everything
below is scored on whether it puts a person in front of the booking calendar in **months, not
years**.

### The constraint no page fixes

`site.availability` allows **17 bookable hours a week** — Mon 10–3, Tue 9–6, and three 1-hour
evening windows Wed–Fri. Someone who works 9–5 outside Tuesday has three one-hour slots to choose
from, weeks out. Marketing that works against a calendar like this converts interest into a
bounced booking page. Items 3 and 5 exist to catch those people; **widening the calendar is worth
more than any item on this list and only you can do it.**

### The channel Claude cannot open

For a solo virtual counsellor in BC, **directory listings are the single largest source of new
clients** — larger than organic search, for a domain this young. Psychology Today in particular is
where people who are not searching a name go. Claude can write every word of those profiles
(items 11–15). **Claude cannot create the accounts or pay for them.** That boundary is real and
not negotiable, so those items are written as "drafted and ready to paste."

### What the sweep actually found

Verified against the live site and the deployed environment on 2026-08-14:

| Finding | Where |
|---|---|
| **Lead-magnet emails are discarded.** The route validates the address, returns success, stores nothing. `NEXT_PUBLIC_FORM_ENDPOINT` is not set in Vercel production. | `app/api/lead/route.ts` |
| **No analytics at all.** `NEXT_PUBLIC_GA_ID` is absent from production env. `book_click`, `consult_cta_click` and `booking_widget_loaded` fire into nothing. | `lib/analytics.ts:21`, `app/layout.tsx:177` |
| **One lead capture on 111 pages**, and it is on `/pricing`. | `app/pricing/page.tsx:230` |
| **`/contact` has no form** — it is `mailto:` only, which on desktop frequently opens nothing at all. | `app/contact/page.tsx:28` |
| **One conversion path exists: book a video call with a stranger.** No async option anywhere. | site-wide |
| `punjabi speaking therapist surrey` is **open**, ceiling 780, and Surrey has the largest Punjabi-speaking population in Canada. | `npm run targets` |
| Punjabi appears **nowhere in the navigation**, despite being the practice's clearest differentiator. | `components/Header.tsx:15-19` |

---

## BLOCK 1 — Stop losing the people already arriving — **+245 (discounted)**

This block is worth more than the other four combined, because it costs nothing to reach these
people. They are already on the site.

| # | Item | Pts |
|---|---|---:|
| **1** | **Persist lead-magnet signups instead of discarding them.** Write to Blob using the `lib/clients.ts` pattern, email the practice on each capture, and send the requester the checklist immediately — all through Resend, whose domain is already verified. Right now the form is a polite black hole. | **70** |
| **2** | **A real enquiry form on `/contact` and `/book`.** Name, email, one free-text box, sent via Resend with a copy to the sender. Replaces `mailto:`. This is the "not ready for a video call at 11pm" path, and it does not currently exist. | **60** |
| **3** | **Consult → paid follow-through.** `lib/booking-notify.ts` already reads appointments from Cliniko. Add a consult-specific 24-hour follow-up carrying the direct paid-booking link. Someone who has already had the free call is the warmest lead the practice will ever have, and today nothing reaches them. | **50** |
| **4** | **Turn GA4 on and verify the funnel end to end.** The event vocabulary is already written and typed. Without it nobody can say whether five people or five hundred reached the booking embed last month, so every later item on this list is scored on guesswork. *(Owner: create the GA4 property and hand over the ID. Claude wires and proves it.)* | **45** |
| **5** | **Off-hours / waitlist capture.** A short "none of these times work" form under both scheduler embeds, storing preferred windows. Given 17 bookable hours a week, this is not an edge case — it is a large share of everyone who reaches the calendar. | **45** |

---

## BLOCK 2 — The Punjabi position — **+180 (discounted)**

The one place this practice has no real competitor. Most searches for Punjabi-language therapy
are typed **in English**, so this ships without translation risk.

| # | Item | Pts |
|---|---|---:|
| **6** | **`/punjabi-counselling/surrey`.** Open target, ceiling 780. Largest Punjabi-speaking population in Canada, and virtual delivery is genuinely competitive there. The highest-value single page not yet built. | **65** |
| **7** | **Put Punjabi in the navigation and above the fold.** `languagesNative: "English · ਪੰਜਾਬੀ"` exists in `lib/site.ts` and appears in no menu. The differentiator is currently invisible to anyone who does not go looking. | **30** |
| **8** | **Delta, Abbotsford and Vancouver-metro Punjabi pages** on the existing `[region]` route. | **35** |
| **9** | **Punjabi × specific need** — intergenerational conflict, couples, and the stigma question, each as its own page. These are the searches with intent behind them, not just location. | **30** |
| **10** | **Gurmukhi-script landing page, drafted and held.** Written now, published only after a fluent reviewer signs off. Do not skip that gate — wrong clinical Gurmukhi destroys the exact credibility the page exists to build. | **20** |

---

## BLOCK 3 — Directory and referral assets — **+165 (discounted)**

Claude writes; you paste and submit. Scored on what they return once submitted, because the
writing is not the bottleneck — the submitting is.

| # | Item | Pts |
|---|---|---:|
| **11** | **Psychology Today profile, written to their field structure** — personal statement, specialties, the finance block, and the photo brief. The largest single referral channel available to this practice. | **55** |
| **12** | **A citation and directory pack** — Counselling BC, BCACC's own find-a-counsellor listing, Lumino/insurer finders, and the local BC directories — with identical NAP text so the citations reinforce rather than fragment. | **40** |
| **13** | **Referral one-pager for GPs, physios and naturopaths.** A single PDF-ready page stating scope, waitlist honesty, fees, and how to refer. Warm referral is the highest-converting channel that exists and the practice has no asset for it. | **35** |
| **14** | **EAP and insurer provider-network application pack** — the standing answers these forms all ask for, assembled once. | **20** |
| **15** | **South Asian community-organisation outreach kit** — gurdwara and settlement-services introductions, in a register those organisations actually respond to. | **15** |

---

## BLOCK 4 — Conversion craft on traffic that already arrives — **+150 (discounted)**

| # | Item | Pts |
|---|---|---:|
| **16** | **Instrument the booking embed's drop-off.** The Cliniko iframe is a black box: nobody knows whether people reach it and leave, or never reach it. Measure load, first interaction, and abandonment. This tells you which of items 17–21 is actually worth doing. | **40** |
| **17** | **A trust block that works without testimonials.** BCACC forbids client reviews, so the usual proof is unavailable — which makes the *substitutes* worth building properly: registration number verifiable against the BCACC register, training, supervision, and a plain scope statement. Currently these facts are scattered. | **35** |
| **18** | **"Is this right for me?" objection page.** The real hesitations — cost, whether online works, what happens if it is not a fit, whether 15 minutes is enough to tell — answered without sales language. | **25** |
| **19** | **Wire the coverage tool to the booking flow.** `/tools/therapy-cost-bc` computes what someone pays after extended health and then leaves them there. Ending on a number and a booking link is the whole point of the tool. | **25** |
| **20** | **Exit paths on the 39 guides.** `CtaBand` appears on 26 pages; the guide bodies mostly end cold. Not more CTAs — one relevant next step per guide. | **20** |
| **21** | **State a response-time promise and honour it.** "Replied to within one business day" on every contact surface. Cheap, and it is the single most common unstated worry when emailing a stranger about therapy. | **15** |

---

## BLOCK 5 — New reach — **+110 (discounted)**

| # | Item | Pts |
|---|---|---:|
| **22** | **Google Business Profile copy and citation text.** Service-area business, no storefront. *(Owner: claim and verify the profile — Claude cannot.)* | **40** |
| **23** | **`/services/emdr-intensive` deepened for `emdr intensive bc`.** Open target, ceiling 820, and a $190 service with almost no competition in BC. | **30** |
| **24** | **Low-cost and sliding-scale counselling in BC.** Open target, ceiling 740. High volume, and honest about when this practice is *not* the answer — which is what makes it rank and what makes the referrals it generates real. | **25** |
| **25** | **Stress leave and short-term disability in BC.** Named in `VISIBILITY_30.md` as a measured gap. Strong intent: people searching it need documentation and a counsellor, in that order. | **15** |

---

## Totals

| Block | Raw | Discounted |
|---|---:|---:|
| 1 · Stop the leaks | 270 | **245** |
| 2 · Punjabi position | 180 | **180** |
| 3 · Directories and referral | 165 | **165** |
| 4 · Conversion craft | 160 | **150** |
| 5 · New reach | 110 | **110** |
| **Total** | **885** | **850** |

Discounts are for overlap, not for doubt: items 6–9 compete with each other for the same
searchers, and 18–21 all address the same hesitation from different angles.

**850 is not 850 clients.** It is the share of the growth that is actually reachable — the rest
sits in domain authority, calendar width, and the directory accounts only you can open.

## If you do five things

**1, 2, 3, 6, 11.** Three of them close leaks in a site that is already receiving people, one
opens the position nobody else holds, and one opens the channel that brings counselling clients
faster than search does.
