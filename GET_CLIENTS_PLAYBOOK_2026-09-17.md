# Getting clients: the part that is not code

Written 17 September 2026, after four rounds of work on the site itself. The
site is now first of eleven local practices on every measurable on-page
category. The numbers below say where the clients are actually being lost, and
each item is something only the owner can do. Ordered by expected effect.
Times are honest estimates for one sitting.

## The evidence, in one table

| Where people drop | Number | Source |
|---|---|---|
| Reached the booking calendar (month to 16 Sep) | 73 | conversion log |
| Interacted with it | 38 | conversion log |
| New clients in Cliniko | 0 | client sync |
| Open consultation days this week, Camille | 2 | Cliniko |
| Open consultation days this week, Savneet | 1 | Cliniko |
| Real enquiries since 1 Aug | 3 | inbox, read with owner 11 Sep |
| Enquiries answered | 0 | inbox |
| Pages outranking us for "online counselling vancouver" with a phone number | 10 of 10 | SERP survey 17 Sep |
| ... with Google reviews visible | 9 of 10 | SERP survey 17 Sep |
| Westpeak Google Business Profile | exists, verified, 6 reviews; was never linked from the site (fixed 22 Sep) | found 22 Sep |

---

## 1. Answer the three people who wrote in (20 minutes)

Every acquisition effort is worth less than this. Open /admin, the Inbox
block. The three real enquiries are David, Thomas and Stephanie; the rest are
bots and are labelled. Reply from your own mail client, then press Done on
each. Also search info@ for anything that arrived between 6 and 17 September:
the store was frozen and those messages exist only as alert emails.

## 2. Fix the Cliniko consultation form (15 minutes)

Walked as a client on 17 Sep. For a free 30-minute call it demands:

- first name, last name
- **date of birth, three dropdowns, required**
- email
- **mobile number, required**
- **a payment choice**

Each is a place to stop. In Cliniko: Settings → Online bookings. Under the
patient details section, set date of birth and phone to optional. Under the
Initial Consultation appointment type, turn off "require payment" (it is a
$0 service; the payment step is pure friction). Keep email required; that is
how confirmations reach them.

## 3. Open more consultation windows (10 minutes, then ongoing)

Thirty-eight people interacted with a calendar showing two open days for
Camille and one for Savneet. The site now prints exactly which days are open,
on the home page, /book and both profiles, so more open time turns straight
into more visible time. Weekday evenings first: "evening" is the word in the
search data, and the practice has it in its copy already.

## 4. Google Business Profile — DONE 22 Sep 2026: profile existed, hours, area, description, categories, services and links completed with the owner. Remaining: photos, the review link in closing emails.

### (original notes kept for reference)

The single largest missing channel. Every page that outranks the site for the
money query has one. The site cannot create it; it is ready to receive it.

Create at business.google.com as a **service-area business** (no storefront
shown), service area: British Columbia, then Alberta for Camille.

| Field | Enter |
|---|---|
| Name | Westpeak Wellness |
| Primary category | Counselor |
| Additional categories | Mental health service; Family counselor; Marriage or relationship counselor |
| Website | https://www.westpeakwellness.com |
| Appointment link | https://www.westpeakwellness.com/book |
| Phone | see item 5 |
| Hours | Use what Cliniko is actually open. The site shows this week's at the top of /book. |
| Description | Online counselling across British Columbia with Registered Clinical Counsellors, in English, Punjabi and Tagalog. Individual, couples, family and EMDR therapy by secure video. Free 30-minute consultation, evenings available, no referral needed. |
| Services | Individual Therapy; Couples Therapy; EMDR Therapy; Family Counselling; Punjabi-Speaking Counselling |
| Languages | English, Punjabi, Tagalog |

**Reviews.** BCACC's advertising standard prohibits *the practice* from
publishing testimonials. It does not prohibit a client leaving a Google
review of their own accord, and it does not prohibit a neutral sentence in a
closing email: "If you found this useful, a Google review helps other people
find the practice." Nine of the ten pages outranking you show a star rating.
That is the gap. Do not reply to reviews with anything about the client's
care.

Then do the same in ten minutes each at Bing Places (bingplaces.com, imports
from Google) and Apple Business Connect.

## 5. A phone number (30 minutes)

Ten of ten competing pages show one. The site is already wired: set
`NEXT_PUBLIC_PHONE` in Vercel → Project → Environment Variables → Production,
in the form you want displayed (e.g. `604 555 0100`), redeploy, and a Call
button appears in the header, the sticky bar and the contact page, with click
tracking. A Google Voice or OpenPhone number that forwards to voicemail is
enough; the number's job is to exist. Use the same number on the Google
Business Profile.

## 6. Psychology Today (30 minutes)

The practice profile (westpeak-wellness-white-rock-bc/1080689) still says a
15-minute consultation and carries a 506 area-code number. Update to: 30
minutes; the new phone; "online across BC and Alberta"; both counsellors
named; website link. Camille's profile (1831823) is current. Savneet has two
profiles under her name in Edmonton, both reading "Registered Provisional
Psychologist"; she should confirm which is hers, retire the other, and change
it to RCC, this practice, and BC.

## 7. Directories that actually send BC clients (1 hour)

In order of value, all free:

1. **counsellingbc.com** — ranks third for "registered clinical counsellor",
   which is your largest search cluster. Listing form on the site.
2. **BCACC "Find a counsellor"** — confirm both counsellors' entries show
   online / province-wide and the website.
3. **Lumino Health** (Sun Life's provider directory) — Sun Life plan members
   search it to find a covered counsellor. Free provider listing.
4. **Alignable** — claim the existing Surrey listing and set it to virtual,
   all of BC (see CITATION_CLEANUP_2026-08-28.md for the other four
   listings, two of which misdescribe the practice and one of which may
   publish a home address).
5. **ICBC Recovery Network** — the site now says truthfully that you are not
   in it. Joining means ICBC pays you directly for post-crash counselling,
   which is a referral stream with no marketing cost. Application is through
   ICBC's provider portal; RCC is an eligible designation.

## 8. Referral letters to doctors (1 hour, once)

The site has /refer/doctor written for physicians. Print it, or send the
link, to the walk-in clinics and family practices in White Rock, South Surrey
and Abbotsford with one sentence: "We take new clients within the week, online,
in English, Punjabi and Tagalog; the free consultation is bookable directly
by the patient." Doctors refer to whoever has availability. You do.

## 9. Email authentication (10 minutes, one DNS record)

Checked 18 Sep: Resend's DKIM and SPF are in place on the sending subdomain
and Google handles inbound, so confirmations and consultation reminders are
authenticated. DMARC is set to `p=none`, which reports nothing and enforces
nothing. Change the `_dmarc` TXT record to
`v=DMARC1; p=quarantine; rua=mailto:info@westpeakwellness.com; pct=100`
so spoofed mail from the domain is quarantined and you get a weekly report.
Gmail and Yahoo treat an enforcing DMARC as a trust signal for bulk senders.

## 10. Liability insurance (before 1 October)

Camille's policy expires 1 October 2026. The founder has no policy recorded
on the roster. The site's credential-expiry check will start flagging the
first on the admin page and by build warning.

---

## What to watch

Export Search Console again around 15 October, save the three CSVs into
`data/gsc/` as `2026-10-15-pages.csv` and `2026-10-15-queries.csv`, and run
`node scripts/ctr-delta.mjs`. It separates pages whose position held from
pages that moved, so it says whether the September rewrites did the work.
The conversion log on /admin says whether the calendar is converting.
