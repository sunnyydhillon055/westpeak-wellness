# Why 10 impressions, and what actually gets to 3–4k

**Audited 2026-08-10** against live production as Googlebot.

---

## The sweep found nothing technically wrong

| Check | Result |
|---|---|
| `robots.txt` | `Allow: /`, sitemap declared |
| Homepage meta robots | `index, follow` |
| Canonical | self-referencing |
| `http`/`https`/apex/`www` | all funnel to `https://www.` |
| Server-rendered content | **1,682 words** in `<main>` on a service page, no JS required |
| H1 / schema | present; 4 JSON-LD blocks |
| Sitemap | 107 URLs, all 200 |

One minor finding: `http://westpeakwellness.com` takes **two hops** to reach the
canonical host. HSTS preload means real browsers skip it. Not worth chasing.

**Nothing is blocking Google.** So 10 impressions is not a technical fault, and
no amount of further on-site work changes it.

---

## What 10 impressions actually means

An impression means a page **appeared in someone's search results**. To get one,
a page must be (a) in the index and (b) ranking somewhere in the top ~100 for
something a person typed.

This domain has been serving the new site for days, and indexing was requested
yesterday. **Ten impressions is precisely what a site looks like in its first
week.** It is not a symptom of anything wrong; it is the number that a
site with almost nothing indexed produces.

**The one number that settles it:** Search Console → **Pages** → *Indexed*. If
that reads 5–20 against a 107-URL sitemap, indexation is the entire story and
everything below is just waiting. If it reads 80+, the constraint has already
moved to rankings.

---

## Is 3–4k a day realistic? Yes — but not soon

3,500 impressions/day is ~105,000/month. Across 107 pages that is **~33
impressions per page per day**.

For scale: a page ranking around position 8 for a term searched 500×/month
earns roughly 500 impressions/month — about 16/day. So this target needs most
of the site ranking on page one for terms with real volume, plus the long tail
of 37 guides working.

That is a reachable ceiling for this site. The content and the technical work
are already done to that standard. What is missing is **authority and time**.

### Honest curve

| When | Impressions/day | What is happening |
|---|---|---|
| Now | ~10 | Almost nothing indexed |
| Week 4 | 100–300 | Indexation completes across 107 pages |
| Month 3 | 400–900 | Long-tail guides start ranking 20–50 |
| Month 6 | 900–2,000 | First page-one rankings, if backlinks exist |
| Month 12–18 | **2,500–4,500** | Target range, with sustained off-site work |

Anyone promising month three is guessing. A new domain with **zero referring
domains** does not outrank established practices inside a quarter, however good
the pages are.

---

## The binding constraint, in order

### 1. Indexation — weeks, free, mostly already done
Nothing to build. Confirm the sitemap is submitted and watch the Pages report
climb toward 107.

### 2. Backlinks — the actual bottleneck
The site currently has **zero referring domains**. `Organization.sameAs` holds
one Instagram URL and nothing else. This is the single largest gap between this
site and every practice outranking it, and it cannot be fixed with code.

The fastest legitimate links, in order of effort-to-value:

| Source | Cost | Gives |
|---|---|---|
| **BCACC directory** | member fee | Regulator-authority citation |
| **Psychology Today** | ~$40/mo | Highest-intent referral traffic in Canadian counselling |
| **CounsellingBC** | low | BC-specific, well indexed |
| **TherapyDen / Theralist** | free | Free citations |
| Community orgs, chambers | free | Local relevance |

Kits 2, 3 and 4 in [kits/](kits/README.md) contain the finished copy for all of
these. They are the highest-value hours available and none of them is mine to do.

### 3. Google Business Profile — worth doing, but read this carefully
GBP drives the map pack and Maps, and those impressions report in **GBP
Insights, not Search Console**. So claiming GBP will not move the GSC number
directly. It matters anyway — it drives real bookings and it feeds brand
searches, which do show in GSC. [Kit 1](kits/KIT-1-google-business-profile.md).

### 4. Content gaps — small, real, worth doing eventually
The head-term sweep found the site has no page targeting: *trauma therapy BC*
as a phrase, *registered clinical counsellor* as a term, *therapy cost BC*, or
*MSP counselling*. The city pages target "Online Counselling in {City}", which
is honest and correct, but narrower than "counsellor in {city}" — the higher
volume phrase. Changing those titles is a judgement call: "Counsellor in
Vancouver" reads as a local office, and this practice has none. Left alone
deliberately.

---

## What I would do this week

1. **Open Search Console → Pages.** Read the Indexed count. That single number
   tells you whether to wait or to act.
2. **BCACC directory listing** — Kit 2. Highest-authority citation available,
   and the current listing is reportedly wrong anyway.
3. **Psychology Today** — Kit 3. Referral bookings while the SEO matures.
4. **CounsellingBC + TherapyDen** — Kits 4. Free.

Four listings, roughly two hours, and they are worth more to the impression
count over the next six months than anything further I can change in this
repository.

---

## The uncomfortable summary

The site scores **22,550/25,000** and is technically clean on every check run
today. That is not what is holding it back. A perfectly built site with no
backlinks and a two-week-old index gets ten impressions a day, and the honest
answer is that this is normal, expected, and fixed by patience plus the
off-site work — not by another code change.
