# 15 more things — second round

**17 August 2026.** Measured against the current build, after the first fifteen
shipped.

The first round fixed *having* a way to make contact: 94 of 116 pages offered
only a video-call booking, and now **116 of 116 carry a form**. That problem is
solved and does not need solving again.

This round is the next three constraints, in the order they actually bite:

1. **Nothing measures whether any of it works.**
2. **A reply promised in one business day is written from scratch every time.**
3. **People who raised a hand and then waited are dropped.**

---

## The finding this round turns on

`lib/analytics.ts`:

```js
export function track(event, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;   // ← silent no-op
  window.gtag('event', event, params);
}
```

`gtag` only exists when `NEXT_PUBLIC_GA_ID` is set, and it is not set.

So **every conversion event on this site fires into nothing**: `enquiry_submit`,
`book_click`, `scheduler_visible`, `scheduler_interact`, `waitlist_submit`,
`lead_magnet_submit`, `tool_share`. All of it instrumented, all of it discarded.

That is why nobody can answer "which page earns enquiries" — not because the
answer is bad, but because it was never recorded. Item 1 fixes it without
waiting on a Google account.

---

## Tier 1 — see what is happening (1–4)

**1. First-party conversion log, so telemetry works with no GA account.**
Mirror every `track()` call to a Blob-backed counter keyed by event and page.
Counts only, no identifiers — the same privacy posture as `lib/search-log.ts`.
The moment this ships, "which page produces enquiries" becomes answerable.

**2. Surface it in `/admin` beside the inbound list.**
Events by page, enquiries by source page, and the ratio. The `source` field is
already stored on every inbound record and has never been read.

**3. Consultation → client conversion, per source page.**
`lib/funnel-report.ts` already pulls Cliniko consults and new clients monthly.
It does not join them to the page the person arrived from. That join is the
single most valuable number this practice could have.

**4. Set `NEXT_PUBLIC_GA_ID`.** Owner-side, one variable. Item 1 makes the site
useful without it; this makes it useful *and* comparable to industry data.

## Tier 2 — make the promise keepable (5–8)

Every page now says *a reply within one business day, from your counsellor, not
an assistant.* That promise is the whole reason the small ask works, and right
now keeping it means composing an original email every time, at whatever hour
the message arrives.

**5. Reply templates.** Four real ones: *yes, here is how to book*; *I am not
the right fit, here is who is*; *that sounds urgent, here are the numbers*; and
*I am full, would you like the waitlist*. Drafts, not send-buttons.

**6. Prefilled reply from `/admin`.** The inbound list has a bare `mailto:`.
Make it open with subject, greeting and the chosen template already filled in.
The gap between "I should reply" and "I have replied" is where the promise dies.

**7. Waiting-time badge on each inbound row.** `reply-watch` emails when
something is overdue; `/admin` itself shows nothing. A row that has been waiting
two business days should look different from one that arrived an hour ago.

**8. One-tap "handled" already exists — add "handled + replied".**
Distinguish read from answered, so the overdue check stops nagging about
messages that were answered outside the system.

## Tier 3 — stop dropping the people who raised a hand (9–11)

**9. Waitlist check-in.** Somebody asked to be told when a slot opens and has
heard nothing since. Contacting them is **fulfilling their request**, not
marketing — which is exactly why this is legitimate where an enquiry sequence is
not. A single note at 30 days: still looking, or shall I take you off?

**10. Waitlist matching against real openings.** `cliniko-sync` already knows
the schedule. When a slot appears that fits a stated window, say so. Right now
the availability text people wrote is stored and never read.

**11. Consultation no-shows.** `booking-notify` already detects
`did_not_arrive`. A no-show is usually fear rather than disinterest, and the
existing missed-session email deliberately says nothing about the fee. Extend
the same handling to the free consultation, which is where it matters most.

## Tier 4 — reduce the remaining doubt at the ask (12–15)

**12. Trust line at the form itself.** The BCACC registration number and the
"reply from your counsellor" promise sit in the page body; the form sits lower
down. Put the credential where the decision is made.

**13. Show what a reply looks like.** One anonymised example of the practice's
own reply style — not a testimonial, which BCACC forbids, but a sample of *the
counsellor's own words*, which it does not. This is the single strongest
permitted trust signal available.

**14. Act on the search-gap list.** `searchGaps()` now reports terms this site's
own search answers with nothing. Those are content briefs written by the people
who wanted the content, and nobody has read them yet.

**15. Post the 52 queued social items.** `SOCIAL_QUEUE.md` has been written and
dated since the first round. Still unposted. It remains the cheapest distribution
the practice owns.

---

## What is built in this pass

Items **1, 2, 5, 6, 7, 9** — the ones that are mine to do and that compound.

Items **3, 10, 11** need live Cliniko data to verify against and are specified
but not shipped; building an untested join against a booking system is how you
get a report that is confidently wrong.

Items **4, 15** are owner actions. Item **14** is a decision, not a task.

## Still true, and it outranks all fifteen

`SEO_COMPETITIVE_2026-08-17.md`: the site appeared in **none** of four money
queries. Conversion multiplies traffic; it does not create it. Google Business
Profile, the directory listings and the referral channel remain worth more than
this entire list, and all three need the owner.
