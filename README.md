# Westpeak Wellness — Website

Fully virtual counselling practice serving all of British Columbia. Next.js 14
(App Router) + TypeScript, deployed on Vercel.

> This file was rewritten on 30 August 2026. The previous version described the
> site as it shipped in early August — 64 pages, a Calendly booking link, "no
> database, no external services" — and had been wrong about all three for
> weeks. A stale README is the one piece of documentation everybody reads
> first, so the counts below are the build output, not a memory of it.

## What's in here

193 prerendered pages plus ten rendered on demand.

- **Core** — Home, About, Services, Fees, FAQ, Contact, Standards, Editorial
  policy, Privacy, Accessibility
- **Services** — 10 service pages (`lib/services.ts`)
- **Cities** — `/online-counselling/<city>` (`lib/locations.ts`)
- **City × service** — 50 pages at `/online-counselling/<city>/<service>`,
  each carrying its own argument (`lib/city-services.ts`); the uniqueness gate
  fails the build if any two converge
- **Guides, comparisons, resources, audiences, approaches, glossary, tools**
- **Punjabi** — `/punjabi` (written in Punjabi), plus `/punjabi-counselling/<region>`
- **Referral** — `/refer/doctor`, written to be handed to a GP
- **Client portal, admin, booking** — rendered on demand; Cliniko-backed
- **Interprovincial** — `/alberta` and `/ontario` exist and are **gated**: they
  build a 404 shell and must stay out of the sitemap until the counsellor is
  registered there. `npm run parity` and `scripts/expansion-verify.mjs` both
  enforce it.

## Run locally

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # production build

## Verification

Every gate reads the **built** HTML in `.next/server/app`, so it checks what
was produced rather than what a source file says should exist. Run the build
first.

    npm run verify      # everything, including the network checks
    npm run verify:ci   # everything offline — what CI runs on each push

| Command | What it checks |
| --- | --- |
| `npm run seo` | Redirect shadowing, then titles, descriptions, canonicals, schema presence, inbound-link counts |
| `npm run schema` | Every JSON-LD block parses and is typed |
| `npm run budget` | CSS, JS and HTML weight against a recorded baseline |
| `npm run uniqueness` | The 50 city × service pages have not converged |
| `npm run cta` | Every non-exempt page offers the reader an action |
| `npm run internal` | Internal links resolve — no 404s, no needless redirect hops, no dead `#fragments` |
| `npm run parity` | The sitemap and the build agree, in both directions |
| `npm run meta` | og:title/description/type/locale, twitter:card, canonical/og:url agreement |
| `npm run contrast` | The palette against WCAG 2.1 AA — the claim `/accessibility` and the FAQ both make |
| `npm run quality` | Accessibility, heading structure, link text, duplicate metadata, dead ends |
| `npm run visual` | Long pages carrying nothing but prose |
| `npm run links` | The external citations resolve. **Not** in `verify:ci` — see below |
| `npm run drift` | Published fees against Cliniko. Needs `CLINIKO_API_KEY` |

`npm run links` makes ~95 requests to government and health-authority sites. It
runs monthly in CI (`.github/workflows/link-rot.yml`) rather than on every push,
because a build must not fail because a health authority reorganised its URLs
overnight.

Two notes on reading gate output, both learned the hard way and both recorded
in the scripts themselves:

- **Verify the instrument before acting on what it reports.** Five separate
  false-positive classes have been found in these gates so far. If a gate
  reports something that contradicts a fact you know about the site, suspect
  the gate.
- **A gate that cannot see a page must say so.** Ten routes render on demand
  and have no HTML on disk; every gate that walks the build directory prints
  what it skipped rather than treating absence as a finding.

## Continuous integration

- `.github/workflows/verify.yml` — builds and runs `verify:ci` on push and PR
- `.github/workflows/link-rot.yml` — checks external citations monthly
- `.github/workflows/indexnow.yml` — pings IndexNow after a deploy to `main`

## Editing content

| What | Where |
| --- | --- |
| Site-wide info (email, hours, booking path) | `lib/site.ts` |
| Service copy | `lib/services.ts` |
| FAQ | `lib/faq.ts` — a question **must** also appear in `GROUP_OF` or the build fails |
| Cities | `lib/locations.ts` |
| City × service arguments | `lib/city-services.ts`, `lib/city-context.ts` |
| Guides / comparisons / resources | `lib/guides*.ts`, `lib/comparisons*.ts`, `lib/resources*.ts` |
| Diagrams | `public/img/*.svg` + the registry in `lib/figures.ts` |

After editing page content, regenerate the real commit dates the sitemap uses:

    npm run dates

This runs against committed history, so commit first. A route absent from
`lib/page-dates.ts` gets no `<lastmod>` — which is valid and honest. An
invented date is neither, and teaches Google to distrust the field site-wide.

## Environment

`.env.example` documents every variable, what it drives, and what happens when
it is unset. Copy it to `.env.local` for development; production values live in
Vercel. `.env.local` is git-ignored; `.env.example` deliberately is not.

## Guardrails

This is a regulated healthcare site. Before changing copy, read
`DESIGN_NOTES.md` and `/standards`:

- No outcome claims, guarantees, or new coverage specifics (BCACC advertising
  standards)
- The counsellor's personal name appears nowhere on the published site or in
  any generated image — `scripts/expansion-verify.mjs` enforces it
- No client testimonials — soliciting them from counselling clients is
  prohibited; `/reviews` explains what is published instead
- A slug must never appear both in the retired-city redirects in
  `next.config.mjs` and in `lib/locations.ts`. That combination has shipped
  once and 308'd a real page in production; `npm run redirect-shadow` now
  fails the build on it.

## Deploy

See `DEPLOY.md`.
