# Why nobody is reaching out — 52 findings

**23 August 2026.** Full-funnel audit: demand → arrival → persuasion → submission
→ delivery → reply. Evidence for every finding is either in `data/gsc/`, the
repository, or a live check recorded below.

---

## The answer, before the list

**In the 28 days to 20 August the site received 14 non-brand clicks.**

Not 14 hundred. Fourteen. The other 50 of your 64 clicks went to the homepage
at a 50.5% click-through rate, which only happens when somebody searches your
name — they already knew you existed.

A counselling website converts somewhere between 2% and 5% of visitors into an
enquiry. Fourteen visits at 4% is **0.6 enquiries per month**. At a wildly
optimistic 10% it is 1.4.

**Zero enquiries is the arithmetically expected outcome.** Nothing is broken.
The site is not failing to convert visitors; it is not being shown to anybody.

Everything below is true, and findings 21 onward would not have produced a
single additional client this month, because there was nobody there to convert.
I am listing them because you asked for the full picture and because they matter
the moment traffic arrives — not because they explain the silence.

---

## A. Demand — this is the cause (1–10)

**1. Fourteen non-brand clicks in 28 days.** The single fact that explains
everything. Source: `data/gsc/2026-08-20-pages-28d.csv`.

**2. Average position 39.9 — page four.** Nobody goes to page four.

**3. 1,299 impressions sit below position 35 and produced exactly zero
clicks.** That is 45% of all your visibility, worth nothing.

**4. 98% of your clicks are on queries Google refuses to name.** The Queries
export accounts for 1 of 64 clicks. Google withholds rare and personally
identifying queries, which is itself evidence that the clicked queries are
brand-name searches by small numbers of people.

**5. "westpeak wellness" does not appear in the query export at all** — not
even as a single impression. Confused variants do: "westshore wellness",
"west bay wellness", "west end counseling and wellness". Your brand search
volume is below Google's reporting floor.

**6. You are in none of the three directories that appear in every single money
search.** Psychology Today, Counselling BC and First Session showed up in all
ten city queries measured. For the Vancouver Punjabi query, Psychology Today
holds **six of the first eight results**, including five sub-neighbourhood
pages.

**7. No Google Business Profile.** No entity record tying the practice name to a
place in Google's knowledge graph.

**8. The money queries are being served — at position 43 to 56.** "online
counselling vancouver" (64 impressions, position 43), "counsellor online
vancouver" (40 @ 46), "online therapy vancouver" (36 @ 54), "virtual
counselling vancouver" (30 @ 50). Google knows your Vancouver page answers
these. It ranks it fortieth.

**9. Search Console history begins 9 August.** You have roughly two weeks of
data. Some of this is simply youth.

**10. Roughly 43 impressions are wrong-intent** and will never convert:
"counselling bc login" (people wanting CounsellingBC's directory), "stay at
work services" (a WorkSafeBC programme), "psychiatric consultation service for
primary care" (physician-facing), and a "derry west" cluster that is
Mississauga, Ontario.

---

## B. The brand-traffic puzzle — worth your attention (11–14)

**11. Fifty homepage visits a month from people who searched your name, and
zero enquiries.** This is the one number in the whole audit that is genuinely
odd. People searching a practice by name are warm. Something should have come
of fifty of them.

**12. The most likely explanation is that they are existing clients** heading to
`/client-portal`, which they would reach by searching the brand name. If so,
your true prospect traffic is not 64 clicks — it is closer to 14.

**13. Your own visits are probably in this number.** Every time you open the
site from a Google search, that is a brand click.

**14. You cannot currently tell these apart**, because there is no analytics —
see 15.

---

## C. Measurement blind spots (15–20)

**15. `NEXT_PUBLIC_GA_ID` is unset.** There is no behavioural analytics on the
site at all. You cannot see how far people scroll, where they leave, or whether
anyone reached a form and abandoned it.

**16. The first-party conversion log exists but nothing surfaces it to you.**
`lib/conversion-log.ts` records events; reading them means opening `/admin`.

**17. There is no query × page join.** The standard export gives them as
separate tables, so which query earns which page is inference, not fact.

**18. `BLOB_READ_WRITE_TOKEN` cannot be verified from here.** If it is unset in
production, `addInbound` skips the write entirely and the record lives only in
the memory of one serverless instance — gone on the next cold start.

**19. `RESEND_API_KEY` / `PORTAL_FROM_EMAIL` cannot be verified from here.** If
mail is unconfigured, `mailConfigured()` returns false, and **you are never told
an enquiry arrived.** It would sit in `/admin` unseen.

**20. No end-to-end test enquiry has ever been run against production.** This is
the single cheapest way to eliminate 18 and 19, and it is three minutes of your
time. See "What to do" below.

---

## D. Pipeline integrity — mostly sound (21–29)

**21. The submit path is correctly ordered: store first, notify second.**
`lib/inbound-submit.ts` records the person before attempting email, so a mail
outage cannot lose them. This is right and worth keeping.

**22. The honeypot is safe.** `.hp` is genuinely hidden (`position:absolute;
left:-9999px`), present in the built CSS, and all three forms set
`autoComplete="off"` and `tabIndex={-1}`. A real person's browser will not
autofill it, so nobody is being silently discarded. I checked this first
because it would have been the worst possible cause.

**23. There is still one total-loss path.** If `addInbound` returns null the
code does `return back('err')` — the person sees an error, nothing is stored,
and **no alert email is sent**. It only triggers on a malformed email address,
which the client-side `type="email"` should prevent, so the risk is small. It
is not zero.

**24. The blob write is conditional on an env var** and silently does nothing
without it. There is no warning, no log, no fallback.

**25. Booking works.** I drove it live: seven open days, real slots at 9:00am,
10:30am, 12:00pm, 1:30pm, 3:00pm, 4:30pm, 6:00pm and 7:30pm, with morning,
afternoon and evening tabs, under "Select a time with Aman Bains Dhillon". **The
booking funnel is not your problem.**

**26. The booking deep-link is being dropped.** `/book` embeds
`...cliniko.com/bookings?appointment_type_id=2013349744314681520`, but Cliniko
lands on the generic service-selection screen instead of the consultation. Every
visitor pays one unnecessary click.

**27. Nothing is bookable for two days.** On the 23rd, the first open day was the
25th. Somebody who decides at 11pm cannot be seen sooner than 48 hours out.

**28. All 116 pages carry a contact form.** No page is a dead end.

**29. `/book` states the consultation is free and links the fee page**, so
nobody is ambushed by price.

---

## E. Trust and persuasion (30–40)

**30. You publish no testimonials, and every competitor does.** This is
BCACC-mandated and correct — but be clear-eyed that it is a genuine competitive
disadvantage, not a neutral choice. A prospect comparing you against a practice
with forty five-star reviews sees a difference and does not know why.

**31. There is no third-party rating anywhere.** No GBP reviews, no Psychology
Today profile, nothing outside your own domain vouches for you.

**32. No direct billing.** Pay-and-submit. Several competitors direct-bill, and
for someone counting money that is a real reason to choose them.

**33. No sliding scale.** The site points to free and low-cost alternatives
honestly, which is admirable and also routes budget-constrained prospects away.

**34. $140 for 50 minutes is mid-to-upper for BC**, stated plainly with no
anchoring or comparison to help a reader judge whether it is reasonable.

**35. Your only credential proof is self-published**, plus a link to the BCACC
register. True and checkable, but it requires the reader to do work.

**36. No introduction video.** For counselling specifically this is the highest-
leverage trust asset there is — people choose a therapist on whether they feel
they could talk to them, and text cannot carry that.

**37. Name and photo appear only on `/about`** by your own standing rule. That
rule costs conversion on every other page; it may still be the right trade, but
it is a trade.

**38. The "reply within one business day" promise is unverifiable to a
stranger** and appears without evidence.

**39. No phone number anywhere.** Deliberate, and it does close a door for
people who want to hear a voice before typing.

**40. The free consultation is 15 minutes** where many competitors offer 20–30.

---

## F. Competitive position (41–46)

**41. Clearheart Counselling appears in five of the seven city searches**
measured, using roughly 29 templated `/virtual-locations-bc/<city>/` pages. Your
hand-written, sourced city pages appear in none.

**42. Directories occupy the top of every money search**, so you are not
competing with practices — you are competing with aggregators that list
hundreds of practices.

**43. Several competitors hold physical offices** and are therefore map-pack
eligible. You are structurally not.

**44. The domain is young with negligible authority.** This is the mechanism
behind every ranking finding above.

**45. `/services/trauma-therapy` has 36 internal links and ranks 81.8.**
`/services/emdr-therapy` has 36 and ranks 77.8. **This is the proof that
internal linking is exhausted as a lever** — the constraint is off-site
authority and nothing on the site will change it.

**46. You are not listed in a single BC counselling directory.**

---

## G. Content and coverage gaps (47–52)

**47. "how long should you wait for bereavement counselling" — 18 impressions at
position 42**, the largest genuinely under-served query. `/guides/grief-without-
a-timeline` argues grief has no timeline; this asks the narrower practical
question of when to start.

**48. ADHD assessment — about 16 impressions** across several phrasings, with no
dedicated page.

**49. Vocabulary gaps.** Pages exist; they use your words instead of the
searcher's. "licensed counsellor" (21 impressions), "mental health hotline"
(the page says crisis line), "therapy prices / therapist rates / charges" (the
page says fees), "eap" (the page says EFAP), "counseling for moms" (the page
says new parents). Cheapest fixes on the site.

**50. The crisis-line cluster is about 30 impressions across a dozen
phrasings**, and the directory page ranks 55th.

**51. About 25% of queries have only a partial page match or none.**

**52. The nine service pages carry no `lastReviewed` date.** Deliberate and
documented — `lib/schema.ts` says inventing one "would put a fabricated clinical
claim into structured data". Only you can clear this, by actually reviewing them.

---

## What to do, in order

**1 — Run a test enquiry today. Three minutes.** From your phone, on mobile
data, fill the form on any page with a real address you can check. Confirm three
things: the acknowledgement email arrives, an alert reaches
`info@westpeakwellness.com`, and the message appears in `/admin`. **If any of
those fails, findings 18 and 19 become the whole story and everything else is
noise.** This is the only item that could overturn the audit's conclusion.

**2 — The three directory profiles.** Psychology Today, Counselling BC, First
Session. They are in every search you want to be in. `kits/KIT-3` has the copy.
This is the highest-value hour available to you anywhere.

**3 — Google Business Profile.** `kits/KIT-1`.

**4 — Set `NEXT_PUBLIC_GA_ID`.** One variable. Until then you are guessing about
the fifty brand visitors.

**5 — Ask the fifty.** If existing clients are searching your name to reach the
portal, put a portal link in your appointment-confirmation emails and take them
out of the equation, so the number you watch is prospects only.

**Expect nothing from the site for several months.** Directory profiles take
weeks to rank, and a young domain takes longer. The honest forecast is that
enquiries begin when items 2 and 3 are done and have aged — not when the next
page is written.

---

## What I would not do

Write more pages. Rewrite the city pages again. Add more internal links. Chase
the map pack. Buy links. Solicit reviews. All of these are either exhausted,
forbidden, or address a bottleneck that is not the bottleneck.
