# Onboarding — Savneet Singh

Everything on the website side is built and deployed (7 Sep 2026; registration,
Cliniko and insurance added 8 Sep). What still needs a human: her read of the
Punjabi, the Cliniko appointment-type check, and the Alberta decision.

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
| **Registration number and designation** | **Done 8 Sep** — RCC #27067, expires 2026-12-31, from her BCACC card |
| Cliniko | **Done 8 Sep** — practitioner `2033684891660454425` on the practice business; `/book?with=savneet-singh` embeds her calendar; `/book` offers a choice between her and Camille |
| `bookable` | **true** since 8 Sep |
| Professional liability insurance | **Recorded 8 Sep** — McFarlan Rowlands Psychology Liability Program, NPL1005330NM, 1 Jun 2026 – 1 Jun 2027, $5M/claim; watched by `npm run expiry` |
| Alberta pages | **Not built — your decision** — see 4 |

---

## 1. Her registration — done 8 Sep 2026

Read from her BCACC membership card: Registered Member, **#27067**, expires
**31 December 2026**. On the roster as `credentials`, so every page carries
the number, the register link and the letters, and `npm run expiry` will
warn 120 days before it lapses (it already does: 114 days at the time of
writing — the renewal is due the same day as Camille's).

## 2. Cliniko — done 8 Sep 2026

She is on the practice business (`2029887882486877088`) as practitioner
`2033684891660454425`, read off the public booking page and verified by
loading her filtered calendar. `bookable: true`; `/book?with=savneet-singh`
embeds her calendar and `/book` offers a choice between her and Camille.

Still to confirm in Cliniko, by hand: that she offers **Initial Consultation
(30 min, $0)** and **Individual Counselling (50 min, $140)** and nothing she
has said is outside her scope (couples, EMDR), and that her paid types have
"Require payment during booking" on, as the other five do.

**Default routing:** with no `?with=`, `/book` still opens Camille's calendar
because she is first among those accepting. Order in `lib/practitioners.ts`
is the rule; move Savneet above her to change it.

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

## 4. Alberta — the insurance now allows it; the pages do not yet

Her certificate carries no provincial restriction and her insured address is
in Edmonton — the same evidence that opened Alberta for Camille. Two things
stop it being a one-line change:

- Camille's Alberta pages answer "Is the counsellor registered in Alberta?"
  with her **CCPA** certification. Savneet holds the BCACC registration only,
  so the Alberta copy would need its own answer for her before it is true.
- Counselling therapy is unregulated in Alberta; the practice's standards
  page and the Alberta FAQ describe how a reader can check a counsellor there.
  That check, for her, is the BCACC register — a BC body — which is honest but
  is a weaker answer than the one those pages currently give.

If you want her in Alberta: say so, and the Alberta copy gets a per-counsellor
answer, then `provinces: ['BC', 'AB']` builds Calgary and Edmonton for her.
