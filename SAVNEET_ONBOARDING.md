# Onboarding — Savneet Singh

Everything on the website side is built and deployed (7 Sep 2026). This file
is the part that needs a human: her registration, Cliniko, and one review.

---

## Status

| Item | State |
|---|---|
| Practitioner roster entry | **Done** — `lib/practitioners.ts` |
| Profile page `/practitioners/savneet-singh` | **Live** |
| 15 BC city pages under her profile | **Live** |
| Punjabi profile `/practitioners/savneet-singh/pa` | **Live, unreviewed** — needs her read |
| 15 Punjabi city twins `/practitioners/savneet-singh/<city>/pa` | **Live, unreviewed** — needs her read |
| 4 Punjabi guides `/punjabi/guides/*` | **Live, unreviewed** — needs her read |
| Named on `/punjabi`, `/punjabi/regions`, `/punjabi-counselling` | **Live** |
| Photos | **Live** — two, converted from the PNGs supplied |
| Nav + footer entry | **Live** — rendered from the roster |
| Sitemap + hreflang pairs | **Live** — derived, so they update themselves |
| **Registration number and designation** | **MISSING** — see 1 |
| Cliniko | **Not done** — see 2 |
| `bookable` | **false** until Cliniko is done |
| Alberta pages | **Not built** — no insurance certificate on file |

---

## 1. Her registration — the one thing the site cannot guess

Neither document she supplied ("About Savneet", the onboarding questionnaire)
names a designation or a registration number. The rule in
`lib/practitioners.ts` is that a number is read from the card, never
assumed, so today her pages:

- show her name alone, with no letters after it;
- say **Counsellor**, not Registered Clinical Counsellor;
- carry no registration line in the trust bar;
- score 0 on the "registration a reader can check" row of the comparison,
  which is the single largest gap between her pages and Camille's.

**What is needed:** her BCACC membership card (RCC) and/or CCPA record
(CCC), or whichever body she is registered with. From the document, fill in
`credentials` on her record — `short`, `full`, `body`, `number`, `validTo`,
`scope` — set `postNominals`, and change `role` to the title the body grants.
One edit, one commit; every page updates.

If she is not yet registered with any body, say so, and the pages stay as
they are. "Counsellor" is not a protected title in BC and the site claims
nothing more for her.

## 2. Cliniko

**In Cliniko → Settings → Practitioners → Add practitioner:**

- Name: `Savneet Singh`
- Designation / title: as on her card
- **Show in online bookings: yes**
- Business: Westpeak Wellness (`2029887882486877088`), the same as Camille

**Appointment types she offers:**

| Appointment type | Offer? |
|---|---|
| Initial Consultation (30 min, $0) | **Yes** |
| Individual Counselling (50 min, $140) | **Yes** |
| Couples Counselling / Extended | **No** — she says couples work is outside her scope |
| EMDR Intensive | **No** — not in her training as described |
| Family Counselling | Her call |

**Then on the site:** read her `practitioner_id` off the public booking page
(the same way Camille's was found — the `bookingsStart()` call on
`westpeak-wellness.ca1.cliniko.com/bookings`), put it in
`clinikoPractitionerId`, and set `bookable: true`. Until then her profile says
the consultation is arranged by reply, and `/book?with=savneet-singh` offers a
request rather than a calendar.

**Routing:** the practice-wide `/book` still embeds Camille's calendar because
she is listed first among counsellors accepting new clients. If Punjabi
enquiries should go to Savneet by default, the order in `lib/practitioners.ts`
is the routing rule — move her above Camille, or add a language-aware default.

## 3. The Punjabi review

Savneet is a native Punjabi speaker and the copy under her name was written
by someone who is not. Send her these files and change what she marks to
what she wrote — do not machine-translate a correction back:

- `lib/practitioner-pa.ts` — her Punjabi profile (her own verbatim answer to
  the family question is already in it)
- `lib/practitioner-places-pa.ts` — the shared frame and fifteen city entries
- `lib/punjabi-guides.ts` — four guides
- `app/punjabi/page.tsx` and `app/punjabi/regions/page.tsx` — the two hubs,
  which predate her and have never been read by a native speaker either

## 4. Alberta

Not offered. Camille's Alberta pages exist because her CCPA member policy
covers her there (see `lib/practitioners.ts`). Savneet's provinces are
`['BC']` until a professional-liability certificate that reaches Alberta is
supplied; adding `'AB'` then builds Calgary and Edmonton for her automatically.
