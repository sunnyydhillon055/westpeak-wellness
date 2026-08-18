# 15 more — third round

**17 August 2026.** Measured against the current build, after rounds one and two.

Where the previous rounds landed:

- **Round 1** — 94 of 116 pages offered only a video-call booking. Now **116 of
  116 carry a form**.
- **Round 2** — every conversion event was firing into nothing, because `track()`
  was gated behind a `gtag` that is not configured. Now counted first-party.

This round is the moments **between** those two: the high-intent seconds where
somebody has already decided they want something and the site does not catch it.

---

## What measurement found this time

| Moment | Before | Why it matters |
|---|---|---|
| `/search` returns nothing | booking link only, **no form** | They searched, found nothing, and are one click from leaving |
| `/404` | list of links, **no form and no CTA band** | A 404 is a person who wanted something and did not get it |
| The credential | in the page body and footer, **0 mentions at the form** | ~900 words from where somebody decides whether to type |
| `inbound.source` | stored since round 1, **never read** | The only first-party attribution this practice has |

And one defect I introduced myself: the 404 crisis sentence read *"call or text
9-8-8 (Canada, 24/7), or — the Suicide Crisis Helpline…"*. My earlier
province-neutral edit removed the BC number and left the "or" dangling, on the
page most likely to be read by somebody lost. Fixed.

---

## The fifteen

### Built this pass (1–5)

**1. Ask form on `/search` when nothing matched.** The single highest-intent
moment on the site. Somebody typed a question, the site had no answer, and the
only offer was a calendar.

**2. Ask form on `/404`.** Same logic, different failure. It listed links and
never asked what they were actually looking for.

**3. The BCACC registration at the form itself.** *"Replies come from a
Registered Clinical Counsellor, BCACC #20111 — a registration you can check
yourself in about two minutes."* Testimonials are forbidden here, so a
verifiable credential is the strongest permitted trust signal there is, and it
was nowhere near the ask.

**4. Source attribution in the monthly report.** `inbound.source` records the
page somebody was reading when they decided to write. It has been stored since
round one and read by nothing. The monthly funnel report now lists the pages
that actually earned messages.

**5. The 404 crisis-line repair.** Above.

### Specified, not built — and the reason is the same for all three (6–8)

**6. Waitlist matching against real openings.** `cliniko-sync` knows the
schedule; the availability text people typed is stored and never compared to it.

**7. Consult → client conversion by source page.** Joining Cliniko appointments
to `inbound.source` would answer "which page produces *clients*", not just
messages.

**8. Reply-time distribution.** How long replies actually take, versus the one
business day promised on every page.

All three need **live Cliniko data to verify against**. I can write them; I
cannot confirm they are right from here, and a report that is confidently wrong
about a booking system is worse than no report. They need one run against real
data with `?dry=1` before they are trusted.

### Content, blocked on your clinical read (9–10)

**9. The two draft guides** — PTSD/complex PTSD and postpartum depression. Written,
`draft: true`, absent from sitemap and search, both URLs 404. Deleting the flag
publishes them.

**10. The seven remaining content gaps.** Listed at the foot of
`lib/guides-drafts.ts` with a finding attached: four of them overlap pages that
already exist and rank, so they are probably expansions rather than new pages.

### Yours, and worth more than everything above (11–15)

**11. Set `NEXT_PUBLIC_GA_ID`.** One variable. Round 2 made the site useful
without it; this makes it comparable.

**12. Add a client-location question to Cliniko intake.** Still the largest live
risk on the site. `/book` now says sessions are for people located in BC, but a
booking form that does not ask can be used by anybody, and the session counts as
happening where the client is sitting.

**13. Google Business Profile.** `kits/KIT-1`. Still the highest-value
unexecuted item measured anywhere in this repository.

**14. The directory listings.** Psychology Today, Counselling BC, First Session.
Five of the first six results for the Punjabi query are directory profiles and
the practice is in none of them.

**15. Post the 52 queued social items.** `SOCIAL_QUEUE.md`, written and dated
since round one.

---

## Honest note on diminishing returns

Three rounds in, the pattern is worth naming: **in each round, some of what I
proposed turned out to already exist.** Round 2 it was three items —
`WhichServiceTool` routing, the `/book` pre-handoff panel, the waitlist form
placement. This round it was no-show handling: `booking-notify` already emails
after any missed appointment including free consultations, with a deliberate
silence about the fee, and my round-2 item 11 asked for something already built.

That is a good sign about the site and a caution about lists. The on-site
conversion surface is now genuinely dense, and each further round buys less than
the one before.

**What has not changed across all three rounds:** the site appeared in **none**
of the four money queries measured on 17 August. Conversion multiplies traffic;
it cannot create it. Items 13 and 14 remain worth more than every on-site item
in all three lists combined, and both need you rather than the terminal.
