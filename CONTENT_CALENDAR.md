# Seasonal content calendar

**Item 14 of `CLIENT_GROWTH_20_MORE.md`.** Nothing on this site is timed, and
timed content is most of what earns links and shares in this field.

---

## The rule that makes this work

**Publish six to eight weeks before the season, not during it.**

A page about winter low mood published in January is competing with every other
page about winter low mood, from domains that published theirs in October and
have had three months of ranking signals. The same page published in early
October arrives before the competition and before the searches, and is already
established when volume peaks.

This is the single most common mistake in seasonal content and it is almost
entirely a scheduling problem rather than a writing one.

---

## The year

Ordered by publish date. **"Peak"** is when the searching actually happens.

| Publish | Peak | Piece | Why it earns attention |
|---|---|---|---|
| **Early Aug** | Sep | **Back to school, for the parent** | Everything written for September is addressed to children. Almost nothing addresses the parent whose anxiety returns with the routine, or the household where September means conflict again. Pairs with `/for/new-parents`. |
| **Late Aug** | Sep–Oct | **Starting university away from home** | First-year students and, more usefully, the ones who did not settle by October. `/for/university-students` exists and has nothing timed feeding it. |
| **Early Oct** | Nov–Feb | **Low mood through a BC winter** | Already written — `/guides/low-mood-through-a-bc-winter`. It does not need rewriting, it needs **republishing attention in October**: refresh the review date, resubmit to IndexNow, and put it at the top of the social queue. |
| **Late Oct** | Nov–Jan | **When the holidays mean seeing family you find difficult** | The highest-shareability piece in the year for this practice, and it sits directly on the intergenerational cluster. Not a general "holiday stress" page — specifically the family you have to be in a room with. |
| **Mid Nov** | Dec–Jan | **Getting through a first holiday after a loss** | Grief spikes here and the existing `/guides/grief-without-a-timeline` is timeless rather than timely. A seasonal companion, linked both ways. |
| **Early Jan** | Jan | **Why "new year, new you" makes some people feel worse** | Counter-programming. January is saturated with self-improvement content and the contrarian, kinder piece is the one that gets shared. |
| **Late Jan** | Feb–Apr | **Money stress and mental health, at tax time** | `/guides/money-stress-and-mental-health` exists and is not timed. Give it a tax-season companion or a seasonal refresh. |
| **Feb** | Mar–Apr | **Extended health benefits reset on 1 January — and most people never use them** | Commercially the strongest of the year. Directly feeds `/pricing` and `/resources/bc-extended-health-coverage-for-counselling`. Publish in February, because people notice the reset when they finally look at a benefits statement. |
| **Mar** | Apr–Jun | **Punjabi families and the wedding season** | Vaisakhi through summer. Family expectation, marriage pressure, and the particular strain the season places on people already negotiating both. Feeds `/for/punjabi-speaking-couples` and `/for/south-asian-intergenerational-conflict`. Nobody else in BC is writing this. |
| **May** | Jun–Aug | **Summer is not restful for everyone** | Counter-programming again. Unstructured time, children home, and the loneliness of a season everybody else appears to enjoy. |
| **Jun** | Jul–Sep | **Rotational work and a summer away** | Feeds `/for/rotational-and-camp-workers`, which is currently linked from almost nowhere. |

---

## What to do with pieces that already exist

Four of the eleven slots are covered by pages already on the site. **Do not
rewrite them.** A seasonal refresh is:

1. Re-read for anything now inaccurate, and fix it.
2. Set `reviewed` on the item — the field added 2026-08-14 — so the byline shows
   a real clinical review date rather than an edit date.
3. `npm run dates` so the sitemap reflects it.
4. Ping IndexNow (`/api/indexnow`).
5. Move it to the front of `SOCIAL_QUEUE.md`.

That is roughly twenty minutes and it is most of the value. A rewrite is rarely
what a seasonal page needs.

---

## The constraint that shapes every piece above

**No outcome claims, no statistics invented to make a season sound urgent, and
no testimonials.** BCACC applies to a seasonal post exactly as it does to a
service page. The reason these topics work is that they are *true and timely*,
not that they are urgent — and a counselling practice that manufactures urgency
around Christmas is doing something worse than ineffective marketing.

**Nothing here should be published without a clinical read.** Grief at
Christmas and family conflict at a wedding are subjects where a wrong note is
not a stylistic problem.
