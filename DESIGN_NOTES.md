# Westpeak Wellness — Design Notes

The reference for anyone extending this site. Everything visual resolves to a
token in `app/globals.css`; the component kit lives in `components/`. If you are
adding a page, compose it from what is here rather than introducing new values.

**Status:** Phases 2–5 complete — foundations, motion layer, Home, and the
layout pass across every remaining page.

---

## 1. Typography

Loaded with `next/font` in `app/fonts.ts`, self-hosted at build time. No
render-blocking request, no layout shift, `display: swap` with matched fallbacks.

| Role | Face | Why |
|---|---|---|
| Display / headings | **Fraunces** (variable: `opsz`, `SOFT`, `WONK`) | A serif with warmth and an editorial feel rather than an institutional one. The `SOFT` axis lets large headings round off instead of turning brittle — h1 runs `SOFT 34, WONK 1`, body headings `SOFT 22–28`. |
| Body / UI | **Inter** (variable) | A humanist sans with a true weight range, chosen for legibility over the long reading lengths this site actually has — many pages run past 1,800 words. |
| Gurmukhi | **Noto Serif Gurmukhi** | So ਪੰਜਾਬੀ renders in a designed face rather than an OS substitute. On a practice offering sessions in Punjabi, letting that script fall back was a real omission. |

**Type scale** — 1.22 ratio, fluid via `clamp()` between 360px and 1280px:
`--fs-overline` `--fs-small` `--fs-body` `--fs-lead` `--fs-h4` `--fs-h3` `--fs-h2`
`--fs-h1` `--fs-display`. Headings carry negative tracking (−0.012em to −0.022em);
body sits at 1.68 line-height for calm reading.

---

## 2. Colour

The cool blue identity is unchanged. What was added is **warmth and layering** —
flat white everywhere is what made the previous build read as competent rather
than considered.

**One warm accent only.** `--clay: #c07a56`, with `--clay-deep`, `--clay-soft`,
`--clay-ghost`. Used sparingly: the eyebrow rule, hover underlines, the ghost
button hover, the motif's low sun, quote marks, the stepper's connecting thread.
A second accent would make it a palette instead of a voice.

**Layered neutrals** replace flat white so sections shift temperature rather than
meeting at a hard edge: `--surface-0` (white) · `--surface-1` (cool near-white) ·
`--surface-2` (warm off-white) · `--surface-3` (blue wash) · `--surface-4` (warm
sand) · `--surface-ink` (deep, for inverted blocks).

**Gradients** — `--grad-brand` (deep blue → soft blue → clay, on the primary CTA
hover and card accent edges), `--grad-hero`, `--grad-mist`, `--grad-ink` (the
Punjabi block).

**Grain** — `--grain`, an inline SVG `feTurbulence` data URI. No extra request.
Applied via `.grained` on large fills and inside `.photo`, at 14–50% opacity —
deliberately near the threshold of vision. It is what stops big surfaces looking
like plastic.

**Elevation** — `--shadow-xs` through `--shadow-xl`, each a tight contact shadow
plus a wide ambient one so cards read as lit rather than outlined. `--shadow-warm`
for clay-tinted surfaces.

---

## 3. Motion

`--ease: cubic-bezier(.22,.61,.36,1)` — a single gentle ease-out with no
overshoot, used for everything. Durations `--dur-fast` 140ms, `--dur-base` 260ms,
`--dur-slow` 520ms.

Nothing bounces, nothing loops, nothing demands attention. Buttons lift 2px and
bloom a shadow; the primary CTA cross-fades to the brand gradient; cards lift 4px
and draw an accent edge down their leading side; prose links thicken and warm
their underline; the nav underline wipes in from the left.

**`prefers-reduced-motion` is honoured globally** — a blanket override kills all
transitions and animations and forces every reveal visible.

---

## 4. Signature motif — "soft ridgeline"

`components/brand/Motif.tsx`. Variants: `ridge` (hero background), `mark` (brand
mark), `bloom` (organic contour), `arc` (accent rule).

The name is Westpeak, so the obvious move is a mountain — and the obvious mountain
is a sharp triangle, which reads alpine and effortful, the opposite of what a
counselling practice should feel like. So it is a peak drawn as **three
overlapping ridgelines with rounded shoulders and a low sun**: recognisably a
summit, but soft, layered and quiet.

The layering does double duty. It is the visual idiom of distance and calm, and
it is also the site's own argument — that difficulty has depth, and that you work
through it in stages rather than over it in one push.

`components/brand/SectionDivider.tsx` builds `ridge` / `wave` / `slope` dividers
from the same language, so section changes read as a landscape shifting rather
than two coloured boxes meeting.

---

## 5. Iconography

**Lucide** (`lucide-react`), one library, stroke weight 1.6–1.7, 24px grid.
Mapping is centralised in `lib/icon-map.ts` — `SERVICE_ICONS`, `HUB_ICONS`,
`PROCESS_ICONS`, `TRUST_ICONS` — so a page never picks an icon ad hoc and the
vocabulary stays consistent. Icons sit in `.icon-chip` (cool) or
`.icon-chip--warm` (clay) circular chips.

---

## 6. Photography

Sources — Unsplash Licence (free for commercial use, no attribution required;
credited anyway):

| File | Subject | Source |
|---|---|---|
| `public/img/photo/still-water-bc.jpg` | Lone tree on a mossy rock in mirror-flat lake water, Fairy Lake, Vancouver Island | Unsplash `photo-1518241353330` |
| `public/img/photo/forest-path.jpg` | Sunlit forest path, warm low light | Unsplash `photo-1441974231531` |
| `public/img/photo/counsellor-portrait.jpg` | Practice portrait (About page only) | Supplied by owner |

Every photograph goes through `components/ui/Photo.tsx`, which applies the
**unified treatment**: `saturate(.9) contrast(1.02)` on the image, a blue→clay
gradient veil matching the palette, and the same grain used on large surfaces —
plus consistent `--radius-lg` rounding. That treatment is what makes sourced
photography read as one brand rather than as stock.

All raster imagery goes through `next/image` (WebP/AVIF negotiated, explicit
sizes, `priority` on the hero only, lazy below the fold). **The 86 SVG diagrams
deliberately do not** — `next/image` cannot optimise SVG without
`dangerouslyAllowSVG`, and these are already 2–5 KB each with intrinsic
dimensions set, so routing them through the optimiser would add risk and cost
for no gain.

To add a photograph: drop it in `public/img/photo/`, render it through `Photo`,
give it descriptive alt text, and record it in the table above.

---

## 7. Component kit

| Component | Purpose |
|---|---|
| `brand/Motif` | Signature ridgeline, four variants |
| `brand/SectionDivider` | Ridge / wave / slope transitions |
| `ui/Photo` | Unified photography treatment |
| `ui/TrustBar` | Credential strip under hero CTAs |
| `ui/Stepper` | Connected process timeline |
| `ui/Reveal` | Scroll-in wrapper, reduced-motion aware |
| `Figure` | The site's own SVG diagrams |
| `Byline` | Authorship and review provenance |
| `CtaBand` `MoreFrom` `ExtraSections` `StickyBook` | Pre-existing, retained |

CSS classes available: `.icon-chip` `.trust-bar` `.stepper` `.pull-quote`
`.photo` `.grained` `.reveal` `.divider` `.fee-table` `.signature`.

---

## 8. Decisions worth knowing

**The reveal animation is progressive enhancement, not a dependency.** Content is
visible by default; it is only hidden once an inline script confirms JavaScript is
running *and* reduced motion is off (`html.js-reveal`). The component also shows
content immediately when `document.visibilityState !== 'visible'`, and carries a
2-second failsafe if the observer never fires. On a mental-health site, content
that can vanish behind a failed bundle is not an acceptable trade for an
animation.

**The trust bar does not claim insurance coverage.** The brief suggested "Covered
by most BC plans". That is a prevalence claim this practice cannot substantiate,
and it contradicts the site's own careful line elsewhere — that whether a plan
reimburses an RCC is plan-specific and must be confirmed with the insurer. It is
rendered as the verifiable fact instead: receipts are issued with the RCC
registration number. The reassurance survives; the unsupported claim does not.

**The Punjabi block is typographic, not photographic.** The brief allowed either a
warm background image or the brand gradient. A large ਪੰਜਾਬੀ set in Noto Serif
Gurmukhi at 7% opacity over `--grad-ink` is more ownable than any stock photograph
would have been, and it makes the language itself the design feature.

**`public/aman-bains-dhillon.jpg` was renamed** to
`public/img/photo/counsellor-portrait.jpg`. The name rule extends to file names,
and the old path leaked it into every request for that image.

**Restraint, deliberately:** no parallax, no counters, no carousels, no
scroll-jacking, no hero video, no testimonial slider (prohibited anyway), no
gradient text, no glassmorphism beyond a single 3px blur on the Punjabi quote
card. The bar was "calm, warm and expensive", and most of what reads as expensive
here is spacing, type and restraint rather than effect.

---

## 9. Phase 5 — what was applied to the rest of the site

**Global chrome.** Header is scroll-aware (condenses at 12px, passive listener), carries the brand mark, marks the active section with `aria-current` plus a persistent underline, and the mobile menu now locks body scroll, closes on Escape and on navigation. Footer rebuilt as a four-column dark surface with the brand mark, credential facts, icon contact links, a dedicated crisis block and the trust column.

**Interior heroes** get the ridgeline as a CSS background layer — one rule in `premium.css` rather than a component edit across fifteen page files. The home hero uses the full `<Motif>` component instead and is excluded from that rule.

**Per page:**
- **About** — organic `bloom` motif behind the portrait, an RCC/BCACC badge under the hero CTAs, and an icon on each of the six credential cards.
- **Services overview** — per-service Lucide icon plus a colour-coded accent bar so nine services are distinguishable at a glance. The bar walks the existing brand ramp rather than introducing new hues.
- **Service detail (all 10)** — an "at a glance" chip strip under the h1 (50 minutes · video or phone · English & ਪੰਜਾਬੀ · MA, RCC), and an icon chip on every "what people tend to arrive with" card.
- **Fees** — "What you are actually paying for" rendered as a `fee-callout` on the mist gradient.
- **FAQ** — grouped into four categories with icon headers and a sticky jump-nav at desktop. Questions and answers are untouched; `lib/faq.ts` only gained a mapping of which question sits under which heading.
- **Contact** — an icon chip on each of the six info blocks.
- **Hubs** (guides, approaches, compare, for, resources) — icon-led card heads.

## 10. Not done, and why

- ~~Sticky sidebar on service detail~~ — **done.** The "This can help with" panel was reparented into a `.svc-layout` grid together with the long body copy, so it has scroll distance to stick against; a sticky aside beside a three-paragraph section would never actually stick. The `whatItIs` block moved into the same main column. Copy unchanged, only its parent.
- ~~Icons on the four fee info cards~~ — **done**, by hand rather than by pattern-match. The fee table's Individual row is also highlighted.
- **Insurer logo strip.** Deliberately not built. Logos are trademarks and imply partnership or endorsement, which §1.3 forbids. The existing text list of insurer names — already on the page as factual coverage context — is the compliant form.
- **Schematic modality graphics** (bilateral stimulation, sound relationship house). The site already carries 86 original SVG diagrams including `emdr-phases` and `gottman-method`, which cover this ground; adding more would have duplicated them.
- **Lighthouse scores.** No headless Chrome is available in this environment, so Performance and a11y scores were not measured and are not claimed. Structural a11y was verified directly instead (see §11).

## 11. Verified

Build clean at 105 routes. Across `/`, `/about`, `/services`, a service detail, `/pricing`, `/faq`, `/contact` and `/guides`: exactly one `h1` each, **zero heading-level skips**, every image carrying alt text and intrinsic dimensions. Fonts self-hosted with variable axes resolving. Contrast measured: hero h1 14.16:1, lede 7.17:1, inverted Punjabi block 15.14:1 / 7.87:1, footer link 7.48:1, footer body 6.33:1, footer meta 5.13:1 — all above AA. Nav targets raised from 19px to 44px. No horizontal overflow. Name grep: `app/about/` only.


---

## 12. Measured performance

No headless Chrome is available in this environment, so **Lighthouse was not run
and no score is claimed**. What was measured directly:

| | |
|---|---|
| Shared JS (First Load) | **87.3 kB** — unchanged from before the elevation; Lucide tree-shakes and the two client components add ~0 net |
| CSS | 43 kB raw → **9 kB gzipped**, one file |
| Homepage HTML | 96 kB raw → **22 kB gzipped** |
| Fonts on disk | 540 kB across 13 woff2 files (three families, subset-sliced) |
| Photos (sources) | still-water 210 kB · forest-path 262 kB · portrait 172 kB — all served resized and re-encoded by `next/image` |
| Render-blocking | 1 stylesheet, 0 inline style blocks |

**The LCP element is correctly prioritised.** The hero photograph emits
`rel="preload" as="image"` with a nine-width srcset and `fetchPriority="high"`.

**Fonts are not preloaded** — a real gap, honestly reported. `next/font` marks a
preloadable file (`…-s.p.woff2`) but emits no `<link rel="preload">`, because the
fonts are applied through CSS variables on `<html>` and Next cannot statically
prove usage per route. Adding `body.className` to `<body>` did not change it.
The practical cost is roughly one round trip before the styled font swaps in;
it does **not** cause invisible text or layout shift, because `display: swap` is
set and `next/font` generates a size-adjusted fallback whose metrics match. A
hand-written preload link is possible but the file hashes change every build, so
it would need a build-time lookup — not worth the fragility for one round trip.

**CLS risk is structurally low:** every image has intrinsic dimensions or a
fixed aspect-ratio box, fonts swap against metric-matched fallbacks, and there
are no late-injected banners, ads or embeds.
