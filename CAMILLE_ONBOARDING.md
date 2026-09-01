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
| Portrait | **Live** — `public/img/photo/camille-granda.jpg` |
| Nav + footer entry | **Live** — "Counsellors" |
| Sitemap | **Live** — derived, so it updates itself |
| Cliniko | **Not done** — steps below |
| Alberta pages | **Blocked** — insurance question below |
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

## 2. The insurance question — this one blocks Alberta

You asked for **BC + Alberta**. The website is BC only, and the reason is not
her credentials.

Her CCC would permit practice in Alberta, because counselling is not a
regulated profession there. That part is fine. But `ALBERTA_LAUNCH_CHECKLIST.md`
records why the Alberta pages came down within hours of going live on
17 August 2026:

> The practice's professional liability policy does not extend outside British
> Columbia. A live page is an advertisement; an advertisement produces
> bookings; and the Cliniko scheduler has no idea which province a person is
> sitting in.

The checklist names the two ways out, and **one of them is hiring an insured
clinician who can take Alberta clients.** That may be exactly what has just
happened — but it depends on a fact neither her BCACC card nor her CCPA record
states.

**The question to answer:** does Camille's professional liability insurance
cover clients located in Alberta?

- **Yes** → tell me. It is a one-word change (`provinces: ['BC', 'AB']`) plus
  setting `NEXT_PUBLIC_ALBERTA_LIVE=true`, and I will build her Alberta city
  pages the same way as the BC ones.
- **No / not sure** → leave it. Her insurer will answer in one email.

I did not make this call on her behalf. An uninsured session with a distressed
stranger in another province is the risk the whole profession carries
insurance for.

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
