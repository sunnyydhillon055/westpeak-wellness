# Citation cleanup — the brand SERP is asserting things this practice never said

**Found:** 28 August 2026, category 7 of [the 25-category audit](VISIBILITY_25_2026-08-28.md).
**What happened:** the practice publishes no name-address-phone of its own, and scraper
directories have filled the vacuum. Five third-party listings now sit on page 1 of the
brand search, and every one of them asserts something wrong — a White Rock location, a
"family medicine" or "holistic wellness" categorisation, or a Surrey street address
scraped from the corporate registry.

> **Read this first.** Two of these listings say "Johnston Rd, White Rock" — a street
> this practice has never operated from. That pattern usually means one of two things:
> the scrapers copied each other's bad data, **or there is (or was) a different business
> called "Westpeak Wellness" in White Rock** and the listings describe it. Which one it
> is changes the fix: your own bad data gets corrected or removed; a same-name business
> gets outranked and disambiguated, not "corrected". Worth five minutes of checking
> before sending any removal request — a takedown demand for someone else's legitimate
> listing is a bad look.

The site's own side of the correction shipped today: the Organization schema now carries
a `disambiguatingDescription` stating plainly that the practice is fully virtual, serves
all of BC, and has **no physical office** — the one machine-readable assertion a
knowledge-graph builder can weigh against the scrapers.

## The five listings

| # | Listing | What it asserts | Correction path |
|---|---|---|---|
| 1 | [clinicfinder.ca](https://clinicfinder.ca/family-medicine/bc/white-rock/westpeak-wellness/) | "Family medicine", White Rock | Contact form / email on their site; request category correction to Counselling and location removal, or delisting. A counselling practice listed under family medicine is a misrepresentation either way. |
| 2 | [mindreach.ca](https://www.mindreach.ca/bc/white-rock/wellness-center/westpeak-wellness) | "Holistic Wellness Center", White Rock | Same: correction or removal request. "Holistic wellness center" materially misdescribes a registered clinical counselling practice. |
| 3 | [canadanear.com](https://canadanear.com/white-rock/715204-westpeak-wellness) | "Counselor Johnston Rd", White Rock, with a reviews page | This is the one most likely to be a different same-name business — it has a street. Check before acting. If it is this practice's data, request removal; a "reviews" page for a BCACC practice is a standing compliance hazard. |
| 4 | [alignable.com](https://www.alignable.com/surrey-bc/westpeak-wellness) | Surrey, BC | Alignable listings are claimable. Claiming it (free) and setting it to "virtual, serving all of BC" converts a wrong citation into a controlled one — the cheapest fix on this list. |
| 5 | [opengovca.com](https://opengovca.com/surrey-business/westpeak-wellness) | A Surrey street address, scraped from the BC corporate registry | ⚠️ **Privacy first, SEO second.** If the registered office on file is a home address, that is now republished on page 1 of the brand search. The registry record itself can be updated to a registered-agent or other service address; the scraper refreshes from the registry. An SEO fix that leaves a home address in the public record has fixed the wrong problem. |

## Why this is worth an hour

- These five listings are what a cautious prospective client finds when they search the
  practice by name before booking — currently they find three cities, two wrong
  categories, and a reviews page the practice cannot ethically have.
- Citation consistency is a local-ranking input, and right now the only NAP data Google
  has for this brand is wrong and third-party.
- Every profile the practice controls (Alignable claimed, plus the Facebook and LinkedIn
  profiles the audit's category 10 recommends) is one more page-1 brand result the
  practice owns instead of a scraper.

## The order to do it in

1. **Decide the opengovca/registry question** (privacy). Five minutes to check what
   address the registry holds; an owner decision if it needs changing.
2. **Determine whether White Rock listings are this practice or a name collision** —
   search the registry for other "Westpeak" registrations, look at what canadanear's
   page actually shows.
3. **Claim Alignable** (free, ~10 minutes, immediate win).
4. **Send the two correction/removal emails** (clinicfinder, mindreach) — and canadanear
   if step 2 says it is yours.
5. When the GBP/phone/NAP decision in [OFFSITE_KIT_2026-08-27.md](OFFSITE_KIT_2026-08-27.md)
   is made, the same canonical NAP goes everywhere at once — which is what prevents this
   from recurring.
