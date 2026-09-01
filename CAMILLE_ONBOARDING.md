# Onboarding — Camille Granda, RCC, CCC

Everything on the website side is built and deployed. This file is the part
that needs a human: Cliniko, one insurance question, and one review.

---

## Status

| Item | State |
|---|---|
| Practitioner roster entry | **Done** — `lib/practitioners.ts` |
| Profile page `/practitioners/camille-granda` | **Live** |
| 15 city pages under her profile | **Live** |
| Tagalog page | **Written, not published** — needs her review |
| Photos | **Live** — three, placed one per location |
| Nav + footer entry | **Live** — "Counsellors" |
| Sitemap | **Live** — derived, so it updates itself |
| Cliniko | **Not done** — steps below |
| Alberta pages (Calgary, Edmonton) | **Live for her** — insurance verified |
| `bookable: false` | **Deliberate** — flip after Cliniko |

---

## 1. Cliniko — what to set up

The site cannot do this; the API key is not on the dev machine and creating a
practitioner is not something to automate against a live clinical system.

**In Cliniko → Settings → Practitioners → Add practitioner:**

- Name: `Camille Granda`
- Designation / title: `RCC, CCC`
- Description: use the two-line version from her profile page
- **Show in online bookings: yes**

**Then, for each appointment type she offers, add her as a practitioner:**

| Appointment type | Offer? |
|---|---|
| Initial Consultation (15 min, $0) | **Yes** |
| Individual Counselling (50 min, $140) | **Yes** |
| EMDR Intensive (90 min, $190) | **Yes** |
| Family Counselling | **Yes** — create if it does not exist |
| Couples Counselling | Her call |
| Couples Extended | Her call |

Family Counselling is a service on the website already
(`/services/family-counselling`) but may not exist as a Cliniko appointment
type. If it does not, create it before pointing anyone at that page — the site
currently sends family enquiries into the free consultation, which works, but
the page reads better once the type exists.

**Availability:** set her hours in Cliniko. Then mirror them in
`site.availability` in `lib/site.ts` — the footer, the portal and Cliniko all
read from that one list, and a mismatch advertises a slot that cannot be
booked.

**Payments:** confirm each paid type she offers has
`Require payment during booking` enabled, the same as the existing five. The
site states in three places that the card is taken at booking; a type without
it makes that false.

### Then flip one flag

In `lib/practitioners.ts`, change:

```ts
bookable: false,   →   bookable: true,
```

That switches her page from *"online booking is being set up, use the free
consultation"* to a direct **Book with Camille** button. It is deliberately
off until Cliniko is real, because advertising a slot that does not exist is a
failure this practice has already had once in the other direction.

---

## 2. Insurance — verified, and Alberta is open for her

Her BMS/Berkley certificate was supplied on 1 Sep 2026 and answers it.

| | |
|---|---|
| Certificate | CCPA-00111023-001 |
| Policy | Berkley BC05211-2506 / BC05212-2506, via BMS Canada |
| Period | **1 Oct 2025 – 1 Oct 2026** |
| Limit | $5,000,000 per claim / $5,000,000 aggregate |
| Named insured address | **Calgary, Alberta** |
| Privacy & Data Protection | **Not covered** on the base policy — hence the cyber add-on |

**Three things make Alberta defensible for her:**

1. It is a **CCPA national member policy** — "active and practicing members of
   the Canadian Counselling and Psychotherapy Association" — with no
   provincial restriction anywhere on the certificate.
2. Its only geographic wording is national: loss of earnings "Canada only",
   "Out of Country 90 days".
3. **She lives in Calgary.** A policy that excluded Alberta would not cover her
   at her own desk.

With counselling therapy unregulated in Alberta and her CCC current to 2029,
that is the exit condition `ALBERTA_LAUNCH_CHECKLIST.md` already named — "an
insured clinician who can take Alberta clients."

**Her Calgary and Edmonton pages are live.**

### What did NOT change, and why it matters

The site-wide `/alberta` section is **still gated**, and
`NEXT_PUBLIC_ALBERTA_LIVE` is still off. Those pages advertise *the practice*
in Alberta, and the founder's policy still stops at the BC border. Alberta is
now unlocked **per practitioner**, against each person's own insurance and
registration — see `placesFor()` in `lib/practitioner-places.ts`. Anyone added
later gets what their own documents actually support.

### Two dates worth putting in a calendar

- **Her liability policy expires 1 October 2026** — about a month away. Alberta
  pages advertise a service that policy underwrites, so this is the more urgent
  of the two renewals.
- **Her BCACC registration expires 31 December 2026.**

*This reads an insurance certificate; it is not insurance advice. If you want
certainty rather than a careful reading, BMS will confirm scope in one email.*

---

## 3. The Tagalog page — needs her eyes before it publishes

Written and complete, sitting behind `TAGALOG_READY = false` in
`lib/practitioner-tl.ts`. The route 404s and the sitemap skips it while that
flag is false, so it cannot ship by accident.

**Why it is gated:** it is clinical copy about trauma, anxiety and grief,
written by someone who is not a native Tagalog speaker. That is exactly where a
technically-correct translation still lands wrong — register that reads
clinical where it should read warm, or a word for "trauma" that carries
different weight for a Manila-raised reader than a second-generation one in
Surrey.

**What to do:** send her `lib/practitioner-tl.ts`. She edits the strings
directly, or marks what is off. Then set `TAGALOG_READY = true` in the same
commit as her corrections. Do not translate her corrections back into
something else — if a string changes, it changes to what she wrote.

Once that flag flips, the Tagalog page appears at
`/practitioners/camille-granda/tl`, the language section returns to her
profile, hreflang links the two, and the sitemap picks it up. No other change
needed.

---

## 4. Two things worth knowing

**Her BCACC registration expires 31 December 2026.** It is on her profile as a
verifiable number, so a lapsed registration would be publishing a false claim.
Worth a calendar reminder for early December.

**Her name is published; the founder's is not.** That asymmetry is deliberate —
the founder's name is kept off the site by the owner's standing decision and
enforced by `.name-guard`. Camille's marketing document was supplied for this
purpose, which is the consent the roster rests on. If that ever changes, remove
her entry rather than editing around it.

---

## 5. Photos — supplied and in place

All three are live and each appears in one place only:

| File | Where it appears |
|---|---|
| `camille-chin.jpg` | Profile hero and roster card — her main image |
| `camille-chair.jpg` | Partway down her profile, and the Tagalog hub |
| `camille-granda.jpg` | The city pages |

**One caveat.** The two new files came through at 462x645 and 432x652, which is
smaller than ideal for a hero on a high-resolution screen. The originals were
HEIC and arrived truncated, so these are downsized copies. If the hero ever
looks soft, export the originals at 1200px or wider, drop them at the same two
paths, and update the `width`/`height` in `lib/practitioners.ts` to match.
Nothing else needs touching.
