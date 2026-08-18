# Ontario launch checklist

**Status: BUILT, NOT PUBLISHED.** Do not work through this list until step 1 is
genuinely done. The pages are written and dormant; that is the correct state.

## Why they are dormant

Psychotherapy is a **controlled act** in Ontario. CRPO permits a therapist
regulated in another province to see the **occasional** Ontario client, but that
allowance is explicitly conditional on **not advertising or promoting services
in Ontario**, and on Ontario clients not being a substantial share of the
caseload.

Publishing SEO pages that target Toronto, Brampton and Oshawa **is** advertising
in Ontario. It would remove the exemption the practice would otherwise rely on,
and it would breach BCACC advertising standards, which require advertising not
to mislead about the services a registrant may lawfully provide.

So the unlock is not a decision. It is a registration.

## The four locks currently holding

Deliberately four rather than one, because a single flag failing open would be a
regulatory problem rather than a bug.

| # | Lock | Where |
|---|---|---|
| 1 | `generateStaticParams` returns `[]` — routes are not built | `app/ontario/[...path]/page.tsx` |
| 2 | `robots: noindex, nofollow` | same file, and `app/ontario/page.tsx` |
| 3 | Component calls `notFound()` | same files |
| 4 | Sitemap spread is empty | `app/sitemap.xml/route.ts` |

All four read `ONTARIO_LIVE` from `lib/regions.ts`, which is
`process.env.NEXT_PUBLIC_ONTARIO_LIVE === 'true'`. A string comparison, so an
unset variable, an empty string, `"false"` and `"0"` all mean not live. The safe
state is the default state.

`node scripts/expansion-verify.mjs` fails the run if any of them leaks.

---

## The order. Do not reorder it.

### 1. Obtain CRPO registration — **the only real gate**
CRPO **cannot impose a residency requirement**, so a counsellor resident in BC
can register in Ontario. That is the unlock. Everything below is mechanical.

Given Brampton's demographics this is worth pursuing on its own merits — the
Brampton Punjabi cluster is the strongest page set in this entire build, and it
is aimed at one of the largest Punjabi-speaking populations in Canada.

Until the registration number exists, stop here.

### 2. Confirm professional liability insurance covers Ontario clients
Insurers commonly scope coverage by province. Confirm in writing that the policy
extends to clients located in Ontario. This is the same confirmation Alberta
needs and it is listed in `BUILD_LOG.md` as an owner action.

### 3. Set the flag
```
NEXT_PUBLIC_ONTARIO_LIVE=true
```
in Vercel project environment variables, for Production. Redeploy.

### 4. Verify the locks actually released
```
npm run build && node scripts/expansion-verify.mjs
```
Then confirm by hand: `/ontario` returns 200, a child page returns 200, neither
carries `noindex`, and `/sitemap.xml` now contains the Ontario URLs.

### 5. Update every Ontario page's designation line
`DESIGNATION` in `lib/regions.ts` currently reads *"Registered Clinical
Counsellor (RCC) registered with the BC Association of Clinical Counsellors."*
Once CRPO registration exists, Ontario pages must state the Ontario
registration — that is the whole point of holding it, and continuing to show
only the BC designation on an Ontario page would understate what the practice
lawfully holds.

Add a province-specific designation rather than editing the shared constant, so
Alberta keeps saying the accurate thing for Alberta.

### 6. Submit to Search Console
Request indexing for `/ontario` and the child pages. They have never been
crawled, so there is no history to overcome — but equally no accumulated
authority, and they will start from nothing.

### 7. Only then, advertise
Directory listings, outreach, anything that promotes Ontario services. Not
before step 1.

---

## What is built and waiting

7 pages, all to the same standard as the published Alberta cluster.

| Page | Note |
|---|---|
| `/ontario` | Hub. OHIP does not cover private psychotherapy. |
| `/ontario/brampton/punjabi-speaking-counselling` | **The strongest page in the build.** Argues privacy rather than scarcity — the opposite of every other city page, because in Brampton supply is genuinely good and the barrier is degrees of separation. |
| `/ontario/brampton/south-asian-therapist` | The explaining tax, three-generation households, and what culturally fluent counselling actually saves you. |
| `/ontario/toronto/punjabi-speaking-counselling` | Commute as a clinical problem; where to take the call. |
| `/ontario/oshawa/online-counselling` | Durham: rotating shift work and the commuter squeeze. |
| `/ontario/counselling-coverage-ontario` | OHIP, extended health, EAP. |
| `/ontario/punjabi-counselling` | Province-wide; two different problems in one province. |

## One honest caveat about the Brampton pages

They are written to be the warmest and most culturally specific pages on the
site, and they make claims about community dynamics — *izzat*, degrees of
separation, what people are actually protecting — that are true as far as I can
tell but are **not mine to assert on the practice's behalf**. Read them before
they publish. If any of it rings false, it will ring false to a reader from
Brampton far faster than it did to me.
