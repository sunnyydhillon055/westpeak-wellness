# Alberta launch checklist

**Status: BUILT, NOT PUBLISHED.** Seven pages, complete and verified, sitting
behind a flag. They were live for a few hours on 17 August 2026 and came
straight back down.

## Why they came down

**Not regulation.** Regulation in Alberta is genuinely clear and remains so:
counselling therapy is not a regulated profession there. The March 2024
announcement placing counselling therapists under the College of Alberta
Psychologists has no proclamation date, CAP is awaiting provincial funding, and
a workforce advisory committee reports through Fall 2026. Verified 17 Aug 2026.

**Insurance.** The practice's professional liability policy does not extend
outside British Columbia. Confirmed by the owner the same day the pages went up.

That combination is the problem. A live page is an advertisement; an
advertisement produces bookings; and the Cliniko scheduler has no idea which
province a person is sitting in. An uninsured session with a distressed stranger
in another province is not a marketing risk — it is precisely the risk the whole
profession carries insurance for.

## The four locks currently holding

| # | Lock | Where |
|---|---|---|
| 1 | `generateStaticParams` returns `[]` | `app/alberta/[...path]/page.tsx` |
| 2 | `robots: noindex, nofollow` | that file and `app/alberta/page.tsx` |
| 3 | Component calls `notFound()` | both files |
| 4 | Sitemap and `llms.txt` spreads empty | `app/sitemap.xml/route.ts`, `app/llms.txt/route.ts` |

All read `ALBERTA_LIVE` from `lib/regions.ts`
(`process.env.NEXT_PUBLIC_ALBERTA_LIVE === 'true'`). A string comparison, so an
unset variable, an empty string, `"false"` and `"0"` all mean not live.

`node scripts/expansion-verify.mjs` fails the run if any of them leaks.

---

## Two routes to unlocking this. Either one works.

### Route A — extend the policy
Ask the broker to extend professional liability to clients located in Alberta.
For a virtual practice this is a common request and often inexpensive, because
Alberta has no registration requirement to satisfy. Get it **in writing**, and
check whether the extension covers the practice entity as well as the individual
registrant.

### Route B — hire someone who is already covered
The owner's own note: *"the people we may hire will have it."* That is a real
route and it may be the faster one.

Three things to confirm before relying on it, all with a broker rather than with
the hire:

1. **Does their policy cover work done under this practice's name?** Individual
   policies sometimes cover the clinician personally and not the entity engaging
   them.
2. **Is the practice exposed vicariously?** If a client's complaint names the
   practice rather than the clinician, an individual policy may not respond.
3. **Who holds the clinical relationship?** If the practice is contracting the
   work, the practice usually needs its own cover regardless of what the
   contractor carries.

Until one of those routes is closed, **the pages stay down**. Insurance is the
gate; hiring intent is not.

---

## Then, in order

1. **Confirm cover in writing** (Route A or Route B above).
2. Set `NEXT_PUBLIC_ALBERTA_LIVE=true` in Vercel → Production. Redeploy.
3. Verify the locks released:
   ```
   npm run build && node scripts/expansion-verify.mjs && npm run seo
   ```
   Then by hand: `/alberta` returns 200, no `noindex`, and the sitemap contains
   the seven Alberta URLs.
4. **Add a client-location question to intake**, before the first paid session
   rather than after. See the standing risk below — this matters whether or not
   Alberta ever launches.
5. Alberta directory listings — Psychology Today (Alberta), Counselling Alberta,
   ACTA.
6. Request indexing in Search Console. These URLs have never been crawled, and
   were briefly live and then 404 — so expect nothing carried over.
7. Backlink outreach to Punjabi and South Asian community organisations in
   Calgary and Edmonton.

---

## The standing risk this does not fix

Taking the Alberta pages down stops the practice **advertising** into Alberta.
It does not stop an Alberta resident finding the BC site and booking, because
**nothing in the booking flow asks where the client is**.

That gap predates this work and is not created by it, but it is now the largest
remaining exposure and it applies to every province:

- `/book` now states plainly that sessions are for people located in British
  Columbia, and why. That is the cheap fix and it is done.
- **The real fix is an intake question** — "which province will you be in during
  sessions?" — asked at booking, in Cliniko. That is owner-side configuration.

A page that does not exist cannot be found. A booking form that does not ask can
be used by anybody.

---

## What is built and waiting

Seven pages, verified: uniqueness worst pair 23% against a 25% limit,
province-correct crisis numbers on every one, BCACC designation in visible copy,
no `LocalBusiness` or `PostalAddress` anywhere (there is no Alberta premises,
and claiming one would be both inaccurate and against Google's guidelines).

| Page | What it does |
|---|---|
| `/alberta` | Hub. States the regulatory position plainly. |
| `/alberta/calgary/punjabi-speaking-counselling` | Wedge page. What language does to a session; why distance is the point. |
| `/alberta/edmonton/punjabi-speaking-counselling` | Wedge. Older community, thinner supply, northern winter. |
| `/alberta/punjabi-counselling` | Province-wide, partly in ਪੰਜਾਬੀ. |
| `/alberta/counselling-coverage-alberta` | The linkable asset. AHCIP does not cover counselling. |
| `/alberta/is-my-therapist-registered` | High-trust explainer. Nobody else answers it honestly, because the honest answer is "there is no college". |
| `/alberta/red-deer-lethbridge-and-beyond` | Where provision is thinnest. |

Nothing was deleted. This is a visibility change, and it reverses with one
environment variable the moment there is cover.
