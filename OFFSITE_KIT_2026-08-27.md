# Off-site kit — everything the audit says only you can do

**Written:** 27 August 2026
**Why this exists:** the [50-category audit](VISIBILITY_50_2026-08-27.md) found 561 weighted
points available. Roughly 194 of them are code and have been taken. The rest — about
**250 weighted points, more than half the remaining total** — live outside this repository
entirely, in accounts only you can open.

This document is written so that each of those is a copy-and-paste job rather than a writing
job. Every field below is filled in with real, checked values. Nothing here needs drafting.

> **One rule for everything in this file.** BCACC advertising standards prohibit testimonials,
> client reviews, star ratings and outcome claims. Every line of copy below is written to
> comply. If a directory asks for a success rate or a client quote, leave it blank — an empty
> field is not a penalty, and a filled one is a complaints matter.

> **A second rule.** The counsellor's name is confined to `/about` **on the website**. That rule
> is about site pages and is enforced by a deploy gate. It does not apply to off-site
> professional profiles, which cannot exist without a registrant name.

---

## The reference block

Everything below reuses these. Copy them once, paste them everywhere. **Character-for-character
consistency matters more than wording** — citation matching is literal, and "Westpeak Wellness
Counselling" and "Westpeak Wellness" are two different businesses to a crawler.

| Field | Value |
|---|---|
| Business name | `Westpeak Wellness` |
| Legal name | `Westpeak Wellness Counselling` |
| Practitioner | `Aman Bains Dhillon, MA, RCC` |
| Registration | `BCACC #20111` |
| Register URL | `https://bc-counsellors.org/counsellors/` |
| Website | `https://www.westpeakwellness.com` |
| Email | `info@westpeakwellness.com` |
| Instagram | `https://www.instagram.com/westpeakwellness` |
| Service area | All of British Columbia — virtual only |
| Languages | English, Punjabi |
| Booking | `https://westpeak-wellness.ca1.cliniko.com/bookings` |

**Fees** — free 15-minute consultation · $140 / 50 min individual · $170 / 50 min couples ·
$340 / 110 min couples extended · $190 / 90 min EMDR intensive · free cancellation to 24 hours.

**Hours** — Mon 10:00–15:00 · Tue 09:00–18:00 · Wed 18:00–19:00 · Thu 18:00–19:00 · Fri 18:00–19:00.

> ⚠️ **Phone.** Every listing below has a phone field and several make it mandatory. You do not
> publish a number. Decide once, before you start: either get a number that forwards (a Google
> Voice or Cliniko line is enough) or leave the field blank wherever it is optional. The website
> now accepts a **callback request** — an optional number and preferred window on the enquiry
> form — so people who want a call have a route regardless. But a Google Business Profile will
> ask, and a listing with no contact method other than a form converts worse than one with both.

---

## 1. Google Business Profile — the single largest missing asset

**Audit score: 50/1000, lowest of fifty categories. Worth ~22 weighted points on its own.**

You have no physical office, and that is fine: Google supports **service-area businesses**
precisely for this. You give an address to verify, then hide it. Home-based practitioners across
the country are listed this way.

**Setup, in order:**

1. Go to `business.google.com` and create a profile for **Westpeak Wellness**.
2. Primary category: **Counselor**. (Not "Psychologist" — you are not one, and a wrong
   category is a suspension risk as well as a wrong-audience signal.)
3. Additional categories: **Mental Health Service**, **Family Counselor**.
4. When asked "Do you want to add a location customers can visit?" answer **No**.
5. Service areas: **Abbotsford, Chilliwack, Mission, Langley, Surrey, Vancouver** — plus
   **British Columbia** if it will accept the province. Twenty is the maximum; do not use it.
   Six honest ones beat twenty that imply a presence you do not have.
6. Verification will most likely be by video. Have ready: the BCACC certificate, a screen with
   the Cliniko booking page open, and the workspace where sessions happen.

**Business description** (750-character limit; this is 718):

```
Westpeak Wellness is a virtual counselling practice serving all of British Columbia. Sessions
are held by secure video with a Registered Clinical Counsellor (MA, RCC, BCACC #20111), in
English or Punjabi.

The practice offers individual counselling, couples counselling, EMDR, and trauma-focused
therapy, alongside support for anxiety, depression, grief and workplace stress. Approaches
include CBT, ACT, IFS-informed and somatic work — matched to the person rather than applied
from a template.

Every consultation begins with a free 15-minute video call, with no charge, no card and no
obligation to book anything afterwards. Registration can be verified in the public BCACC
register before you make contact. Counselling is not covered by MSP; most extended health
plans reimburse sessions with an RCC.
```

**Services to add** (each takes its own short description — the site already has the wording,
one service page each):

`Individual counselling` · `Couples counselling` · `EMDR therapy` · `Trauma therapy` ·
`Anxiety counselling` · `Depression counselling` · `Punjabi counselling` ·
`South Asian mental health` · `Online counselling`

**Attributes worth ticking:** Online appointments · Identifies as South Asian-owned (if you wish
to) · Language assistance: Punjabi · LGBTQ+ friendly (only if true and you will stand behind it).

**Products/Posts:** post once a fortnight. The site's guides are the source — link each post to
the guide it summarises. This is the cheapest recurring ranking signal available to you.

**Then:** once verified, set `NEXT_PUBLIC_GOOGLE_REVIEW_URL` in Vercel to the profile's review
link. `/reviews` already reads that variable and will surface the link automatically.

---

## 2. The five directories that own page one

**Audit score: 130/1000. Worth ~22 weighted points.**

The audit's most uncomfortable finding: for city-level queries, page one is directories, not
practices. Psychology Today, Counselling BC, First Session, Theravive and TherapyTribe are
DA 70–90 properties. **A three-month-old practice site does not outrank them — it gets listed in
them.** Every listing is a page-one slot you occupy by proxy, plus a citation feeding your own
domain.

Costs, so you can decide before you start: Psychology Today ~US$30/month, Counselling BC
~C$180/year, TherapyTribe has a free tier, Theravive ~US$30/month, First Session free to join.

### Profile copy — works in all five

**Headline / tagline (under 100 characters):**
```
Online counselling across BC, in English or Punjabi — MA, RCC
```

**Personal statement, long form** (Psychology Today allows ~1,400 characters; this is ~1,320):

```
Deciding to look for a counsellor is often harder than the first session turns out to be. If
you are reading this at an odd hour, weighing up whether it is worth it, that is an ordinary
place to start from.

I am a Registered Clinical Counsellor (MA, RCC) working entirely by secure video across British
Columbia. That means you can meet from home, from a parked car, or from wherever you can close
a door — which for a lot of people is the difference between starting and not starting.

My work is with adults navigating anxiety, depression, trauma, grief, relationship difficulty
and burnout, and with couples wanting to be understood by each other again. I am EMDR- and
Gottman-trained, and I draw on CBT, ACT, IFS-informed and somatic approaches — matched to the
person in front of me rather than applied from a template.

I offer sessions in English and Punjabi. For South Asian clients, that often matters less for
vocabulary than for not having to explain the context first — family obligation, the weight of
what other people will say, the gap between generations under one roof.

Every enquiry starts with a free 15-minute video call. No charge, no card, no obligation to book
anything afterwards. It exists so you can find out whether talking to me feels workable before
committing to anything.

My registration can be checked in the public BCACC register at any time.
```

**Short bio (300 characters, for the tighter directories):**

```
Registered Clinical Counsellor (MA, RCC) offering online therapy across BC in English and
Punjabi. Individual and couples work for anxiety, depression, trauma, grief and burnout.
EMDR- and Gottman-trained. Every enquiry starts with a free 15-minute video call.
```

**Specialties — tick these and stop.** Directories reward focus; a profile claiming thirty
specialties reads as claiming none.

> Anxiety · Depression · Trauma and PTSD · EMDR · Relationship issues · Grief ·
> Cultural and identity concerns · Stress · Life transitions · Couples

**Issues NOT to tick** — outside scope and each one invites a referral you will have to decline:
eating disorders, substance use as a primary presenting issue, psychosis, custody assessment,
under-18s.

| Field | What to enter |
|---|---|
| Session fee | `$140` |
| Sliding scale | Only if true |
| Free consultation | `Yes — 15 minutes` |
| Insurance | `Extended health / employee benefit plans. Not MSP.` |
| Session format | `Online video only` |
| Years in practice | Answer honestly. A new practice is not a weakness; a wrong number is. |
| Licence | `RCC #20111, BC Association of Clinical Counsellors` |

### Where to go

| Directory | Start at | Note |
|---|---|---|
| Psychology Today | `psychologytoday.com/ca` → "Join as a therapist" | Highest traffic of the five. Do this one first. |
| Counselling BC | `counsellingbc.com` → list your practice | Ranks for nearly every BC city term. |
| First Session | `firstsession.com` → for therapists | Video-led; see §6 below. |
| Theravive | `theravive.com` → join | Lower traffic, real citation value. |
| TherapyTribe | `therapytribe.com` → join | Has a free tier. Take it before paying. |

### Also worth doing, same copy

**South Asian Therapists** (`southasiantherapists.org`) — a directory the audit found ranking for
exactly the Punjabi and South Asian queries this practice is differentiated on, where the
competition is thin. Of everything on this page, it is the best fit-to-effort ratio.

---

## 3. Citations — same NAP, fifteen places

**Audit score: 90/1000. Worth ~21 weighted points.**

Paste the reference block verbatim into each. Consistency is the whole mechanism.

Yellow Pages Canada · Yelp Canada · Bing Places · Apple Business Connect · Foursquare ·
Cylex Canada · Canpages · Profile Canada · Chamber of Commerce (Abbotsford — see below) ·
GoLocal BC · Opendi · ShowMeLocal · N49 · Canada One · LocalStack

**Abbotsford Chamber of Commerce** deserves separate mention: membership is a few hundred dollars,
gets a real followed link from a `.ca` domain with local authority, and puts you in front of the
business owners who are a natural referral source. It is the closest thing to a shortcut on this
page.

---

## 4. Health and referral networks

**Audit score: 200/1000. Worth ~21 weighted points.**

- **Pathways BC** (`pathwaysbc.ca`) — how BC family physicians actually find and refer to
  practitioners. Free. A GP referral is a warmer lead than anything organic search will ever
  produce, and there is no competition for the listing.
- **Fraser Health** community resource listings — ask to be added to mental-health directories
  for the Fraser Valley.
- **EAP panels** — Homewood Health, Morneau Shepell/TELUS Health, LifeWorks. Panel work is lower
  fee and steadier, and the panel listing itself is a citation.
- **BC211** — the province's referral database.
- **University counselling offices** — UFV is in Abbotsford and maintains referral lists for
  students needing more than campus counselling can offer.

---

## 5. The BCACC listing you already have

**Audit score: 500/1000, and the only external listing that exists.**

It currently ranks **above the website** for the brand search. That makes it, right now, the most
important page about this practice on the internet — and it is almost certainly running on
whatever was typed when the registration was created.

Log in and check: the practice name matches the reference block; the website URL is
`https://www.westpeakwellness.com`; Punjabi is listed under languages; the specialties match §2;
and the bio is the 300-character version above rather than a stub.

Fifteen minutes, no cost, on the highest-authority page currently pointing anywhere near you.

---

## 6. Video — the gap no amount of writing closes

**Related audit categories: image optimisation (700), third-party validation (220), brand demand (200).**

Every competitor in the benchmark set has photographs of real people. This site has two images on
its homepage. That is not a design oversight — it is that there is nothing to publish.

- A **profile photograph**. Directories weight profiles with photos far above those without, and
  Psychology Today's ranking within its own search is visibly affected by it.
- A **60–90 second introduction video**. First Session is built entirely around these, and it is
  the single strongest trust asset available to a practice that is forbidden from using
  testimonials. Say who you are, how you work, and what the free consultation involves. Phone
  camera, window light, one take is fine — polish matters less than being a person.

---

## 7. Referral partners — the compliant substitute for reviews

**Audit score: public review volume 100/1000, third-party validation 220/1000.**

BCACC prohibits soliciting client testimonials. It does **not** prohibit professional references.
`lib/reviews.ts` ships empty and is already built to accept non-client references — a referring
physician, a colleague, a supervisor — with a source note recording that the author saw and
approved the wording.

Ten to fifteen approaches, by email, one paragraph each:

- Family physicians and nurse practitioners in Abbotsford, Chilliwack and Mission
- Registered dietitians, physiotherapists and chiropractors — overlapping caseloads
- Immigration consultants and family lawyers — clients under sustained stress
- Gurdwara and community organisations in Abbotsford and Surrey
- School counsellors in Abbotsford and Mission districts
- Other RCCs with full books or a different specialty

The ask is not "send me clients". It is: *"I have a virtual practice with capacity, I work in
Punjabi as well as English, and I take referrals across BC. May I send you a one-page summary?"*

---

## What this is worth, honestly

| Item | Audit category | Weighted points |
|---|---|--:|
| Google Business Profile | B1, B2, B3 | ~64 |
| The five directories | C2 | ~22 |
| Citations + chamber | B5, C1 | ~45 |
| Health & referral networks | C4 | ~21 |
| BCACC listing correction | C3 | ~13 |
| Photo + video | F9, D4, A5 | ~25 |
| Referral references | D1 | ~18 |
| Social profiles (Facebook, LinkedIn) | C6 | ~21 |
| | **Total** | **~229** |

Against roughly **19 weighted points** left in the entire technical build.

**The order that matters:** Google Business Profile, then Psychology Today, then Counselling BC,
then the BCACC correction. Those four are most of the value and about three hours of work.

Nothing on this page requires the website to change. That is the point of it.
