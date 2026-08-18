# Westpeak Wellness — client acquisition, rankings & visibility audit

**Measured:** 17 August 2026
**Frame:** 10 categories × 1,000 points = **10,000**
**Benchmark set:** the five practices that actually appear in the SERPs Westpeak is built to win
**Scope:** client acquisition, Google rankings, visibility — so **off-site factors are included**

---

## The one thing to read

**Westpeak Wellness: 4,050 / 10,000 — last of six.**

The previous scorecard (`COMPETITIVE_AUDIT.md`, 8 Aug) put Westpeak first at 9,295/10,000. Both
numbers are correct. They measure different things, and the gap between them **is** the finding.

That audit excluded backlinks, reviews and Google Business Profile *by request*, and scored what a
build can control. This one was asked to score client acquisition and rankings, which are decided
mostly by the things that audit left out.

| | Westpeak | Best competitor |
|---|--:|--:|
| **On-site build** (cat. 6–9, /4,000) | **3,290 — 1st** | 2,510 |
| **Off-site presence** (cat. 1–5, 10, /6,000) | **760 — 6th** | 4,740 |

**This is the best-built site in the set and the least visible one.** Nothing in the repository
fixes that, because the deficit is not in the repository.

---

## Scoreboard

| Rank | Practice | Score | % | Shape |
|--:|---|--:|--:|---|
| 1 | **Clearheart Counselling** | 7,240 | 72.4% | Established (2012), 2 offices, broad citations |
| 2 | **Thrive Collective** | 6,680 | 66.8% | Owns Abbotsford/Chilliwack in the map pack |
| 3 | **Tidal Trauma Centre** | 6,430 | 64.3% | 547 pages, Surrey office, Punjabi overlap |
| 4 | **Lotus Therapy** | 6,390 | 63.9% | Ranks #1 for the Vancouver head term |
| 5 | **Upstream Counselling** | 5,730 | 57.3% | Ontario practice ranking in BC on page volume |
| 6 | **Westpeak Wellness** | **4,050** | **40.5%** | Best build, near-zero off-site footprint |

### Why these five

They were not chosen from a list — they are the sites that came back when the money queries were
actually run. **Thrive** and **Clearheart** both rank for Abbotsford virtual therapy, which is the
home market. **Tidal** holds both the BC-online term *and* Punjabi/Surrey, so it overlaps Westpeak's
differentiator directly. **Lotus** holds the Vancouver head term. **Upstream** is a
Kitchener–Waterloo practice with no BC presence at all, ranking in BC on 406 pages of programmatic
content — which is itself worth knowing.

Lotus serves `403` to automated sitemap requests; its page count is unmeasured and its score is
built from homepage and SERP evidence only. Every other figure below was fetched and parsed.

---

## The ten categories

| # | Category | WP | Clear | Thrive | Tidal | Lotus | Up |
|---|---|--:|--:|--:|--:|--:|--:|
| 1 | Organic SERP presence, money queries | **180** | 780 | 730 | 690 | 820 | 700 |
| 2 | Local & map-pack eligibility | **90** | 820 | 850 | 800 | 760 | 300 |
| 3 | Off-site authority & link equity | **120** | 780 | 600 | 560 | 700 | 650 |
| 4 | Directory & marketplace presence | **120** | 880 | 720 | 650 | 650 | 640 |
| 5 | Reputation & social proof | **100** | 780 | 800 | 620 | 640 | 560 |
| 6 | Content depth & topical authority | **760** | 640 | 660 | 680 | 600 | 700 |
| 7 | Technical SEO & index health | **780** | 620 | 500 | 560 | 580 | 520 |
| 8 | Structured data & AI answer visibility | **900** | 600 | 400 | 620 | 420 | 480 |
| 9 | Conversion architecture & capture | **850** | 640 | 700 | 650 | 600 | 620 |
| 10 | Brand demand & off-site distribution | **150** | 700 | 720 | 600 | 620 | 560 |
| | **Total** | **4,050** | **7,240** | **6,680** | **6,430** | **6,390** | **5,730** |

Westpeak is **first in all four on-site categories and last in all six off-site ones.** There is no
category anywhere in the middle.

---

## 1. Organic SERP presence — 180/1000

Four money queries were run. Westpeak appeared in **none of them**:

| Query | Westpeak | Who did appear |
|---|---|---|
| online counselling BC / virtual therapy RCC | absent | Clearheart, Thrive, Crossroads, First Session |
| online counselling Vancouver BC | absent | Lotus (#1), Haven, Upstream, Thrive, Tidal |
| Punjabi speaking counsellor BC | absent | Psychology Today ×5, Counselling BC, Narra, Tidal |
| counselling Abbotsford Fraser Valley online | absent | Clearheart, Thrive, Wellbeings, Focus Forward |

It surfaced only on **brand** and **site-scoped** queries. The pages exist and are indexed —
`/guides/waiting-for-therapy-in-bc` and `/services/depression-counselling` both returned with their
correct current titles — they simply are not ranking on head terms.

The Punjabi row is the expensive one. It is the practice's sharpest differentiator, the whole first
page is directories, and **Westpeak is in none of those directories.** That is not a ranking problem,
it is an inventory problem.

## 2. Local & map-pack eligibility — 90/1000

Structural, and mostly not a defect.

Westpeak is deliberately fully remote and publishes no address, so it is **ineligible for the map
pack in every city it targets**. Every BC competitor is eligible everywhere Westpeak is not:

| | Offices | Address + geo in schema |
|---|---|---|
| Thrive | Abbotsford + Chilliwack | LocalBusiness, PostalAddress, geo |
| Tidal | Surrey | LocalBusiness, PostalAddress, geo |
| Clearheart | Vancouver + Coquitlam | MedicalBusiness, PostalAddress, geo, `local-sitemap.xml` |
| Lotus | yes | Place + PostalAddress |
| **Westpeak** | **none** | **`areaServed: State` only** |

**Thrive holds a physical office in Abbotsford** — the home market — with reviews attached to it.
That position cannot be taken by content.

No Google Business Profile was found. A service-area business with no storefront can still hold one,
and `kits/KIT-1-google-business-profile.md` is written and waiting. It is the single highest-value
unexecuted item on the list.

## 3. Off-site authority — 120/1000

No Ahrefs (the connector is present but unauthenticated), so this is proxied by domain age, archive
depth and citations found in the wild. Treat it as a band, not a number.

| | First archived | Archive months | Citations surfaced |
|---|---|--:|---|
| Clearheart | Nov 2012 | 80 | Yelp, YellowPages, Psych Today, Facebook, 3 aggregators |
| Lotus | Sep 2021 | 37 | — |
| Upstream | Dec 2021 | 27 | First Session, Psych Today |
| Thrive | Jan 2019 | 19 | YellowPages, Abbotsford Local, Established Companies, Facebook |
| Tidal | Dec 2021 | 14 | blog cluster |
| **Westpeak** | **Mar 2023** | **10** | **BCACC register profile, TikTok** |

Youngest domain, thinnest archive, two off-site references. Clearheart has a **fourteen-year** head
start and it shows in every category that depends on accumulation.

## 4. Directory presence — 120/1000

| Directory | Westpeak | Competitors |
|---|---|---|
| Psychology Today | **no** | Clearheart, Upstream, Tidal |
| Counselling BC | **no** | widely listed |
| Yelp / YellowPages | **no** | Clearheart, Thrive |
| First Session | **no** | Upstream |
| BCACC register | yes (personal profile) | yes |

Psychology Today alone occupied **five of the first six results** for the Punjabi query. The kits for
these — `KIT-2`, `KIT-3`, `KIT-4-6-8` — are written. None are submitted. This is the cheapest
distance between the current position and the first page.

## 5. Reputation & social proof — 100/1000

Zero public reviews. Clearheart carries 4.5★ aggregated across platforms; Thrive's own copy cites
clients arriving *because of* its Google reviews.

**The ceiling here is regulatory, not a failure.** BCACC prohibits soliciting client testimonials,
and the site handles this correctly: `lib/reviews.ts` holds an empty list with the reasoning written
into it, and no `Review` or `AggregateRating` markup is emitted anywhere. That is the right call and
should not change.

But the ceiling is not zero. **Referrals are not prohibited** — a referring physician, an ICBC
adjuster, a nurse practitioner may all say something on the record. `/refer` and
`kits/KIT-9-funded-referral-networks.md` are built for exactly this and have not been used.

## 6. Content depth — 760/1000 (1st)

Westpeak wins on quality and loses on volume.

| | Sitemap URLs | Words, city page | Homepage `<img>` |
|---|--:|--:|--:|
| Tidal | 547 | 1,378 | 22 |
| Upstream | 406 | 2,948 | 81 |
| Thrive | 197 | 3,534 | 106 |
| Clearheart | 148 | 1,118 | 43 |
| **Westpeak** | **116** | **1,161** | **2** |

**Smallest site in the set.** 39 guides, 11 services, real clusters, original tools, a glossary and
an answers hub — all genuinely unique, which none of the competitors' templated city pages are. But
7 city pages against Clearheart's 30, and 2 images on the homepage against 43–106.

The image gap is the clearest quick win: 3 photographs and 27 SVGs for a 116-page site forfeits image
search entirely and costs engagement on every page.

## 7. Technical SEO & index health — 780/1000 (1st)

Clean: canonical on every page, `lastmod` on **116/116** URLs, sensible architecture, robots.txt with
an explicit AI-crawler allowlist. Competitors are messier — Upstream ships **no canonical, no Open
Graph and an empty meta description** on its homepage; Thrive emits two canonicals and a 932 KB page;
Tidal's homepage is 3,274 KB.

**One real defect, and it is on the most important page.** The homepage is indexed under its
*previous* identity:

> **Indexed:** `Therapy | West Peak Wellness | Surrey` — "located in Surrey… meet in Surrey or by
> video conference… low cost options"
> **Live:** `Online Counselling in BC | Westpeak Wellness` — remote-only, BC-wide, $140/session

Interior pages are indexed correctly, so this is the homepage specifically. The last Wayback capture
is **7 June 2026**, before the rebuild. Anyone searching the brand sees a Surrey walk-in practice
that no longer exists, and "low cost" attached to a practice not positioned that way.

`kits/KIT-7-reindex.md` covers this. It needs Search Console, which needs the owner.

## 8. Structured data & AI visibility — 900/1000 (1st, decisively)

The strongest category, and the widest margin in the audit. `MedicalBusiness` + `ProfessionalService`
with credentials, languages, service area, hours and payment; 13 `FAQPage`; 14 `BreadcrumbList`;
`HowTo`, `DefinedTermSet`, `Person`; `shortAnswer` on every money page; `/answers` as a dedicated
quotable hub; every major AI crawler explicitly allowed.

Thrive ships four schema types total. Upstream ships no Open Graph at all.

If answer engines become a material referral channel, this is where Westpeak is already positioned to
win — and it is the one lead that does not depend on anybody else's timeline.

## 9. Conversion architecture — 850/1000 (1st)

Free consultation booking, enquiry form, waitlist, lead magnet with proper CASL consent, a three-email
sequence that stops, three interactive tools, a referral page and scheduler telemetry. Built this
month, and ahead of every competitor in the set.

The caveat: **conversion architecture converts traffic, and the traffic is category 1.** An 850 here
multiplied by a 180 there is the arithmetic of the whole audit.

## 10. Brand demand & distribution — 150/1000

TikTok only. `SOCIAL_QUEUE.md` holds 52 dated posts, unposted. No GBP, so no GBP posts. The monthly
email has consent plumbing but no send.

Brand search is also **muddied**: the index holds "West Peak Wellness" (two words, old), the live site
is "Westpeak Wellness" (one word), and an unrelated BC practice trades as "Peak Wellness Therapy".
Three entities competing for one brand.

---

## What actually moves the number

Ranked by points per unit of effort. **The first four cannot be done from the repository** — and they
are worth roughly 1,750 points between them, against perhaps 400 available on-site.

| | Action | Owner? | Est. |
|---|---|---|--:|
| 1 | **Claim the Google Business Profile** as a service-area business. `KIT-1`. | **yes** | +500 |
| 2 | **Submit to Psychology Today, Counselling BC, First Session.** `KIT-2/3/4`. Five of six results on the Punjabi query are directories. | **yes** | +600 |
| 3 | **Force a homepage re-crawl** so the brand stops reading as a Surrey walk-in. `KIT-7`. | **yes** | +250 |
| 4 | **Work the referral channel** — physicians, ICBC, EAPs. Permitted under BCACC where testimonials are not. `KIT-9`. | **yes** | +400 |
| 5 | Post the 52 queued social items. | yes | +150 |
| 6 | Add real photography — 2 images on a 116-page site. | shared | +120 |
| 7 | Expand city pages 7 → ~20, holding the uniqueness bar. | Claude | +150 |
| 8 | Build the nine remaining content gaps (PTSD, postpartum, OCD, insomnia, SAD…). | Claude + clinical read | +130 |

---

## Honest limits

- **No Search Console, no rank tracker, no backlink data.** SERP presence was sampled by running the
  queries, not measured over time. Category 3 is proxied by domain age and citations found, which is
  a band and not a number. Authorising the Ahrefs connector or exporting GSC would replace roughly
  half the estimates here with measurements.
- **Competitor scores come from a homepage plus a sampled interior page**, not a full crawl. Lotus
  blocks automated access and is scored from its homepage and SERP position alone.
- **Category 5 has a regulatory ceiling** Westpeak cannot and should not raise the way competitors do.
- Points are a **judged rubric**, not an index. The ordering is defensible; individual scores carry
  perhaps ±50.
