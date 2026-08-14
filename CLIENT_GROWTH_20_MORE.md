# 20 more — visibility and clients, second tranche

**Date:** 2026-08-14 · **Follows:** `CLIENT_GROWTH_25.md`

---

## STATUS — updated 2026-08-14, after building

**Built and pushed: 1–8, 11, 14–19.** Sixteen of twenty.

| # | Item | State |
|---|---|---|
| 1 | Sitemap `lastmod` | **Done.** 0 build timestamps, 113/113 URLs carry a real date from git |
| 2 | Uniform dates | **Done differently, and the premise was half wrong.** The dates were honest — the content genuinely was written in one push. The real defect was next to it: `Byline` took `updated` and printed it under the word "Reviewed", making a clinical-review claim out of an edit date on every dated page. Now `reviewed` is optional and the label says what actually happened |
| 3 | Search terms | **Done.** Counted, not logged — no timestamp, no session, nothing joining two searches to a person. Visible in `/admin` |
| 4 | Orphans | **Done.** 5 → 0 |
| 5 | Reactivation | **Done.** One button per person in `/admin`, once ever, recorded only on a confirmed send |
| 6 | Referrals | **Done.** `/refer` exists. No incentive and no tracking, both argued in the file |
| 7 | No-show recovery | **Done.** Says nothing about the fee, deliberately |
| 8 | Nurture sequence | **Done.** Days 4 and 11, one-click unsubscribe, drops anyone who becomes a client or writes in |
| 9 | Cliniko follow-ups | **Not doing it, and the list was wrong.** It would send every client two follow-ups — `lib/booking-mail.ts` already sends one. The list said it "costs nothing"; it costs a duplicate email |
| 17 | Punjabi × need | **Half done.** Intergenerational conflict built. Punjabi × EMDR still open |
| 19 | Conversion report | **Done.** Monthly, emailed, counts not percentages |

**Since first writing this: 11, 14, 15, 16, 17, 18 also done.** Sixteen of
twenty built.

| # | Item | State |
|---|---|---|
| 11 | Stress leave / STD | **Done.** `/guides/stress-leave-bc`. Leads with the fact an RCC *cannot* certify a leave — which is what makes it credible rather than self-serving, and what most counselling pages on this query leave vague |
| 14 | Seasonal planning | **Done.** `CONTENT_CALENDAR.md`. Eleven slots, each with a publish date six to eight weeks ahead of its peak, and four of them covered by pages that need a refresh rather than a rewrite |
| 15 | Social atomisation | **Done.** `npm run social` → `SOCIAL_QUEUE.md`, 52 dated posts built from `shortAnswer` rather than chopped-up paragraphs |
| 16 | Monthly email | **Consent built, send deliberately not built.** It contradicted item 8 — see below |
| 17 | Punjabi × need | **Done.** Intergenerational conflict page, plus EMDR-in-a-first-language on the EMDR page |
| 18 | Answer-engine pass | **Done.** The ten audience pages were the only money pages with no `shortAnswer`; all ten now have one and appear in `/answers` |

### Item 16 contradicted item 8, and item 8 was right

Item 8 says the sequence is three emails then permanent silence, because asking
for a checklist is CASL consent to receive the checklist — not to an indefinite
mailing list. Item 16 then proposed a monthly email to exactly those people.

What shipped is the separate consent: an unticked box on the lead form, its own
field on the record, and a count in `/admin`. **The send is not built**, and that
is a decision rather than an omission — a monthly email is a standing commitment
to write something worth reading every month, starting one and stopping is worse
than never starting, and a monthly email to four people is not a channel.

### Still to build

**10, 12, 13** — nine of the ten measured content gaps. PTSD and postpartum
depression as their own pages; separation and divorce, anxiety in relationships,
supporting a partner with anxiety; attachment styles, OCD and intrusive
thoughts, insomnia, seasonal affective disorder.

Each is a full guide, and each needs your clinical read before publishing. That
is the one part of this that should not be delegated — `VISIBILITY_30.md` said
so when it first measured the gap and it is still true.

**20 is blocked and I will not fake it.** Rank tracking needs a position data
source. There is no free reliable rank API, scraping Google is against its terms
and unreliable, and the Search Console API needs OAuth credentials only you can
create. A tracker with no data source is theatre — `scripts/targets.mjs` already
reports whether a *page* exists, and pretending that is a rank check would be
worse than the gap.

---

## 0. What is different about this list

The first list took the obvious levers. This one comes from a **measured sweep**
rather than a read-through, and most of it is things the site is doing wrong
quietly rather than things it has not done at all.

Everything below was verified on 2026-08-14 against the live site or the
repository. Where a number appears, it was counted.

**What I checked and found already done** — so it is not on the list, and so
nobody re-derives it: AI-crawler access in `app/robots.ts` (all 13 agents named),
`/llms.txt` and `/llms-full.txt` live and serving 200, `/feed.xml`, FAQPage
schema across 10 route families and 65 content items, `next/image` on all three
photographs, self-hosted fonts. The technical foundation is genuinely strong.
The gaps are elsewhere.

### The four measurements this list rests on

| Measured | Result |
|---|---|
| `<lastmod>` values in the live sitemap | **45 of 113 URLs emit the build timestamp** — they change on every deploy whether or not the page did |
| Remaining `<lastmod>` values | **66 share one identical date**, `2026-08-08T00:00:00Z` |
| Content pages with no editorial in-body link from any sibling page | **5 orphans, 17 more linked only once or twice** |
| The ten topic gaps `VISIBILITY_30.md` measured in August | **all ten still unbuilt** |

---

## BLOCK A — Signals the site is actively sending wrong — **+150**

These cost nothing to fix and are currently working against the site.

| # | Item | Pts |
|---|---|---:|
| **1** | **Stop emitting build time as `lastmod`.** 45 URLs currently claim to have changed at every deployment. Google learns, per site, whether `lastmod` is trustworthy — and a site whose dates all move on a deploy with no content change teaches it to ignore the field entirely. That discards the one crawl-priority signal a site can send directly, and it degrades the *other* 66 URLs along with it. Derive from real content dates, and where there is none, emit nothing rather than a lie. | **50** |
| **2** | **Give the 66 identical dates real ones.** Every page claiming the same `updated:` is both a weak freshness signal and inaccurate — those pages were not all reviewed on 8 August. Set genuine per-page review dates, and add a `reviewed` field distinct from `updated` so a factual re-check can be recorded without falsely claiming the content changed. | **30** |
| **3** | **Capture on-site search queries.** `/search` exists and nothing records what people type into it. That is free, first-party, high-intent keyword research — the exact words your visitors use for their own problem — being discarded on every use. Log to the same Blob store the enquiries use, surface in `/admin`. | **40** |
| **4** | **Fix the 5 orphans and 17 weak pages.** `/guides/health-anxiety`, `/guides/when-someone-you-love-is-drinking`, `/guides/chronic-illness-and-mood`, `/guides/workplace-bullying-in-bc` and the new `/for/punjabi-speaking-couples` have no contextual link from any sibling page — they are reachable only from a hub index, which carries a fraction of the weight. Not a link dump: one genuinely relevant in-body link each, both directions. | **30** |

---

## BLOCK B — The client lifecycle nobody is working — **+185**

The cheapest client is one you have already met. None of this is being done, and
all of it is BCACC-compliant.

| # | Item | Pts |
|---|---|---:|
| **5** | **Reactivation for paused and former clients.** `lib/clients.ts` keeps `paused` and `former` as distinct states specifically so the history survives — and nothing ever uses them. A single, unpushy, once-only message to people who finished a block of work is the highest-converting email a counselling practice can send, because the relationship already exists. Must be once-only and must not imply they should still be in therapy. | **55** |
| **6** | **Ask current clients for referrals — this is permitted.** BCACC prohibits *testimonials*, and it is worth being precise: a testimonial is a public endorsement used as marketing. Telling clients you have openings and that they may pass your details to someone is not that, and it is how most counselling practices actually fill. The site currently has no referral mechanism at all because the testimonial ban was applied more broadly than it reads. | **45** |
| **7** | **Late-cancel and no-show recovery.** Cliniko records `did_not_arrive`; `lib/booking-notify.ts` skips those appointments entirely. Someone who missed a session is the person most likely to drop out altogether, and a short human note — no fee talk, no reproach — is the intervention. Never automate the fee decision; that judgement is not a cron job's to make. | **35** |
| **8** | **Wire `NURTURE_SEQUENCE.md`.** Three emails, written, sitting unused since before there was anywhere to store a lead. There is now. Day 0 / 4 / 11, CASL-compliant unsubscribe, and only to people who asked for the checklist — never to clients. | **30** |
| **9** | **Turn on Cliniko's own follow-up templates.** `appointment_follow_up_templates` exists in the account and is unused. It cannot replace the practice-domain email — the `notifications@cliniko.com` envelope is why — but it costs nothing and catches anyone whose Cliniko mail lands while ours does not. | **20** |

---

## BLOCK C — The ten gaps that were measured and never filled — **+155**

`VISIBILITY_30.md` identified these in August from a real coverage sweep. All ten
are still missing. Each is a genuine query, on-brand, and needs your clinical
read before publishing.

| # | Item | Pts |
|---|---|---:|
| **10** | **PTSD as its own page, and postpartum depression as its own page.** Both currently fold into broader guides. Both are searched by name, at volume, by people who already know what they are looking for. | **35** |
| **11** | **Stress leave and short-term disability in BC.** Highest commercial intent of the ten by a distance — someone searching it needs documentation and a counsellor, in that order, and usually this month. Worth writing carefully: an RCC cannot certify a leave, and the page must say so while still being useful. | **35** |
| **12** | **Separation and divorce · anxiety in relationships · supporting a partner with anxiety.** A cluster, interlinked, feeding the couples pages. | **30** |
| **13** | **Attachment styles · OCD and intrusive thoughts · insomnia · seasonal affective disorder.** High-volume informational. Slower to convert; they build the topical authority the money pages borrow from. | **30** |
| **14** | **Seasonal publishing, planned rather than reactive.** BC winter low mood in October, not January. Tax-season money stress in February. Back-to-school in August. Nothing on this site is timed, and timed content is most of what earns links and shares in this field. | **25** |

---

## BLOCK D — Distribution, which the site does not do at all — **+120**

111 pages, and no mechanism for anyone to encounter them anywhere but a search
result.

| # | Item | Pts |
|---|---|---:|
| **15** | **Atomise the 39 guides into a social queue.** Each guide already contains four or five standalone paragraphs. Generate a scheduled queue of image-free text posts with the source URL, as files you post rather than an integration to maintain. Instagram is linked in the footer and in the schema `sameAs`, and nothing feeds it. | **40** |
| **16** | **A monthly email to the checklist list.** One genuinely useful thing per month — not a newsletter about the practice. This is the only owned channel that does not depend on Google, and the list currently receives nothing at all. | **30** |
| **17** | **Punjabi × EMDR, and Punjabi × intergenerational conflict.** Two open Tier-1 targets at 930 ceiling each, both buildable now, both extending the cluster that already works. | **30** |
| **18** | **Answer-engine formatting pass on the money pages.** `/llms.txt` is live, so retrieval works. What is missing is the shape answer engines quote: a direct one-sentence answer under each H2 before the elaboration. Cheap, and it is how a page gets cited rather than merely crawled. | **20** |

---

## BLOCK E — Knowing whether any of it worked — **+65**

| # | Item | Pts |
|---|---|---:|
| **19** | **A conversion path report, monthly, by email.** `lib/revenue-email.ts` already proves the pattern. Enquiries, waitlist signups, checklist requests, consult bookings, and consult-to-paid conversion — one email, so the practice finds out without opening a dashboard. **This one is worth more than it looks:** it is what makes every other item on both lists falsifiable. | **40** |
| **20** | **Rank tracking for the 26 targets.** `scripts/targets.mjs` scores whether a *page exists*. It cannot say whether the page ranks. A weekly position check against the tracked list turns the ceiling model from a theory into a measurement. | **25** |

---

## Totals

| Block | Pts |
|---|---:|
| A · Wrong signals | **150** |
| B · Client lifecycle | **185** |
| C · Measured content gaps | **155** |
| D · Distribution | **120** |
| E · Measurement | **65** |
| **Total** | **675** |

Lower than the first list's 850, which is correct — the biggest levers were
there and are now largely built. This is the second tranche, and Block B is the
part that would surprise most people: **the cheapest client available to this
practice is one it has already met**, and nothing in the system currently
reaches them.

## If you do five

**1, 3, 5, 6, 19.** Two stop the site sending signals that work against it, two
open the channel that costs nothing because the relationship already exists, and
the last one is what tells you whether any of the other 44 items across both
lists actually did anything.

## One thing to correct in your own head

**BCACC bans testimonials, not referrals.** That distinction has been applied
too broadly across this project — including by me — and it has cost the practice
the single most normal way a counselling practice grows. Item 6 is the fix.
