# Why there are no clients yet — and what actually gets them, 11 Sep 2026

Written after a full pass over the site, the enquiry store (ids, dates and
sources only — no message bodies), Search Console, the booking calendar and
the practice's public listings. The short version: **the website is not the
bottleneck any more, and it has not been for a week.** Two things upstream of
it are.

## 1. What the data says

**Correction, same day: the enquiries are almost all bots.** The first
version of this section counted 25 "real" enquiries from addresses and
sources alone. Read with the owner an hour later, the 30 non-test messages
are: 26 bots (newsletter-subscription scripts, crypto links pasted into the
name field, an SEO pitch, gibberish) and **three people** — David, Thomas and
Stephanie — who pressed "tell me when a time opens" on the old `/book` form
between 4 and 6 September and left no message. Those three are the leads.
Write to them.

Two things follow. The 30-second version of "are people contacting you" is
**no, not yet** — the site is being found by scripts before it is found by
people, which is normal for a new domain. And the spam stopped on 6
September, the day the two-sentence rule and the removal of the waitlist
form went live; nothing at all has arrived since, spam or real, so the
form is not the leak either.

**Search is working as well as a five-week-old domain can.** 8,807
impressions and 141 clicks in the month to 6 Sep; 90 clicks were people
typing the practice name. Non-brand pages sit at positions 20–80. That is
the profile of a site Google has indexed and is testing but does not yet
trust — a domain-authority problem, and no amount of on-page work moves it.
The scorecard is at 9,715 / 10,000 for a reason: what remains on-site is
worth points, not clients.

**Bing now holds the domain** (10 mentions on a brand search; it had zero on
6 Sep). The IndexNow submissions worked.

## 2. The two leaks that matter more than anything on the site

### Leak 1 — Psychology Today is sending people to the wrong counsellor
The practice has a Psychology Today profile
(`psychologytoday.com/ca/therapists/westpeak-wellness/1080689`) and it is
the founder's: her name, her bio, "free **15** minute consultation", a phone
number with a **506 (New Brunswick) area code**, and "available in-person
and online, Abbotsford". Psychology Today is where the majority of private-
practice clients in Canada actually come from. Right now every person who
finds you there reads about a counsellor who is on leave and not taking
clients, is offered a consultation length you no longer run, and is given a
phone number I cannot explain.

**Fix (an hour, and the single highest-value action in this document):**
- Edit the profile: 30-minute consultation; remove or correct the phone;
  "online only, all of BC; anywhere in Canada with Camille".
- Add Camille and Savneet as clinicians on the practice profile, or open one
  profile each (Psychology Today charges per profile). Each profile: her
  photo from the site, her registration number, languages, "accepting new
  clients", and the site's `/book?with=<slug>` link as the booking URL.
- Mark the founder's profile "not accepting new clients" until she is back.

### Leak 2 — the enquiries (see §1)
Answer them. Then keep `/admin` honest: press **Handled** as each one is
dealt with, so the reply-watch job stops crying wolf and starts meaning
something.

## 3. Where clients come from, in order, for a practice like this

1. **Psychology Today** — fix and expand, above. Expect it to become the
   largest source within a month.
2. **Google Business Profile** — I could not find one. Create it as
   "Westpeak Wellness — Online counselling", service-area business (no
   storefront), hours "by appointment", website link, both languages.
   This is what makes "counsellor near me" and "Punjabi counsellor Surrey"
   show the practice in the map pack, which no page can do. Reviews cannot
   be solicited (BCACC) but the profile itself is allowed and expected.
3. **The BCACC directory** — every RCC gets a free listing at
   bc-counsellors.org. Make sure Camille's and Savneet's list languages,
   online, and "accepting"; it is the register clients are told to check.
4. **Insurer and network listings** — Pacific Blue Cross and Sun Life have
   provider directories; Lumino Health (Sun Life) is free and heavily used.
   EFAP networks (TELUS Health, Homewood, LifeWorks) take applications from
   RCCs and send referred clients with sessions already paid for.
5. **ICBC and WorkSafeBC** — both have pages on the site now; both have
   provider registration for counsellors. A registered provider gets
   referred clients directly.
6. **Family doctors** — `/refer/doctor` exists for this. Print it, and walk
   it into the clinics on 72nd and Scott Road that see the Punjabi
   community; a GP who knows a Punjabi-speaking RCC is taking clients will
   refer weekly.
7. **Community** — gurdwara notice boards, Filipino community associations,
   the international-student offices at SFU Surrey, UFV and KPU. The two
   pages added today (`/for/truck-drivers`, `/for/international-students`)
   are written to be handed to exactly those people.
8. **Google Ads, small and specific** — $10–15/day on "Punjabi counsellor
   Surrey", "Tagalog counsellor Vancouver", "online counselling BC", landing
   on the counsellor pages. The only way to be on page one this month.
9. **Instagram / TikTok** — linked from the site, and nothing has been
   posted from the site's queue (`npm run social`). Consistent is worth
   more than good here.

## 4. What I changed on the site today

- `/for/truck-drivers` and `/for/international-students`: two audiences the
  practice is unusually well placed for and had nothing for.
- The comparison, scorecard and this document are in the repo; the site
  itself has nothing left that would plausibly turn a stranger into a
  client faster than the eight items above.

## 5. What to send me back

- Whether the 25 enquiries were answered, and what came of them.
- The Psychology Today login, or confirmation that the profile is updated.
- Whether a Google Business Profile exists.
- After the profiles are live: the next Search Console export in October,
  and I will show you what moved.
