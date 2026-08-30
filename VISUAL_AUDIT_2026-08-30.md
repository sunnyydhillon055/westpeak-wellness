# Visual audit — 30 August 2026

**Westpeak Wellness: 695 / 1000**, twenty categories, scored against what the
built site actually renders rather than against the stylesheet's intentions.

Measured the day of the oatmeal-cream repaint, immediately after it. That
timing matters: the two lowest scores below are both *consequences* of the
repaint rather than things that predate it, and neither was visible to any of
the fifteen gates this repo runs.

## Method, and its limits

Structure measured by fetching all sixteen page types and parsing the built
HTML — word counts, heading trees, paragraph lengths, figures, sections,
dividers. Colour measured arithmetically against WCAG 2.1 (`npm run contrast`).
Everything else is judgement, formed by looking at the pages at 500px and at
1400px in a real browser.

Three honest caveats:

1. **Judgement is not measurement.** Categories 6-20 are opinion informed by
   evidence, not arithmetic. They are scored to be argued with.
2. **A number can lie about a page.** `/guides` reports 43 headings all at the
   same level, which reads in the data like a wall of undifferentiated text.
   Looked at, it is 43 guide cards, one heading each, and it is fine. That
   category was re-scored upward after looking. Any audit that had stopped at
   the parse would have reported a defect that does not exist.
3. **No instrument here measures whether a picture is legible.** The
   Punjabi/English figure passed every gate on the site while its middle
   column was unreadable, crossing both strokes of a Venn whose overlap was
   24px wide holding 180px of text. Only looking found it.

## The scoreboard

| # | Category | Score | The evidence |
|--:|---|--:|---|
| 1 | Contrast and legibility | **880** | 32/32 token pairs at AA, gated in CI. Tightest 4.70. |
| 2 | Measure (line length) | **900** | Median 55 characters, range 48-55. Ideal band is 45-75. |
| 3 | Cards and components | **820** | One card idiom, used consistently across every page type. |
| 4 | Navigation and header | **820** | Legible, sticky, collapses cleanly. Was 1.00:1 this morning. |
| 5 | Buttons and CTA hierarchy | **820** | Primary/ghost/sticky-bar reads at a glance. 5.59:1 on the label. |
| 6 | Diagrams | **800** | 22 originals, alt text from each SVG's own `<desc>`. |
| 7 | Hero — home | **800** | Warm, layered, photograph now in the page's light. |
| 8 | Mobile layout | **780** | Checked at 500px across six page types. Nothing broke. |
| 9 | Footer | **780** | Tokenised today; was nine hardcoded blue-greys. |
| 10 | Brand distinctiveness | **780** | No stock imagery anywhere. Every diagram drawn for this site. |
| 11 | Photography | **760** | One treatment, one veil. Sample size of three images. |
| 12 | Forms | **740** | Correct labels, honest consent copy, visible focus. |
| 13 | Utility pages | **700** | 404 earns its keep — search, six destinations, crisis numbers. |
| 14 | Tables | **640** | Scroll containers work; clipped awkwardly at middling widths. |
| 15 | Vertical rhythm | **640** | 15 distinct section paddings on one page. A scale would be 5-6. |
| 16 | Type scale and hierarchy | **560** | Good scale, but see below: no third level where it is needed. |
| 17 | Palette coherence | **520** | 12 old-palette values survived the repaint. See finding A. |
| 18 | Page structure, long-form | **480** | 250-286 words per heading on guides. Flat. |
| 19 | Hero — interior | **380** | Eight variants, all on the previous palette. |
| 20 | Section transitions | **300** | 2 dividers on the homepage; 0 on the other 192 pages. |
| | **Mean** | **695** | |

## The three findings that cost the most

### A. Twelve colours a repaint could not see — categories 17, 19

Eight interior hero variants draw their ridgeline as an inline SVG data URI.
The colours inside those URIs are URL-encoded: `%23e8f0f9`, not `#e8f0f9`. The
repaint searched for hex literals, matched none of them, and reported success —
so every page on the site that is not the homepage kept a cold blue hero while
the homepage went warm. On `/pricing` at phone width that band occupied two
thirds of the first screen.

This is the same shape as the header bug found earlier the same day, and as
the five instrument errors before it: **the check and the thing being checked
did not use the same spelling.** A search for `#` cannot find `%23`, and
nothing failed.

*Fixed.* Twelve values remapped, ridge opacities down about a quarter — they
were tuned against a blue-grey ground and carried too much weight on cream.

### B. The edge every page but one ended on — category 20

Counted across the built site: the homepage renders 2 `divider` elements, and
all 192 other pages render 0. So the homepage hero dissolves into the page on
a wave and every other hero stops dead on a straight horizontal line.

*Fixed*, in one rule, and deliberately as a **mask** rather than as a
wave-shaped SVG filled with a colour. Filling one would have written the
ground colour into a string no stylesheet search can see — which is exactly
how finding A happened. The mask carries only a shape; the colour comes from
the token.

### C. Long-form pages have one heading level — categories 16, 18

| page | words | h2 | h3 | words per heading |
|---|--:|--:|--:|--:|
| `/guides/stress-leave-bc` | 3,247 | 12 | **0** | 250 |
| `/guides/what-is-emdr…` | 2,498 | 13 | **0** | 178 |
| `/tools/therapy-cost-bc` | 1,429 | 4 | **0** | 286 |
| `/compare/therapy-in-punjabi-vs-english` | 1,884 | 9 | **0** | 188 |
| `/services/emdr-therapy` | 2,657 | 15 | 9 | 106 |

The service pages get this right. The guides do not: 3,247 words under twelve
headings, all the same size, with nothing between them. The table of contents
on those pages therefore lists twelve flat items and cannot show shape,
because there is no shape to show.

**Not fixed, on purpose.** The fix is subheadings inside clinical copy, and
inventing headings for counselling content — deciding where an argument about
stress leave divides — is a clinical editorial judgement, not a design one. It
is the largest remaining item and it needs the counsellor, or explicit
instruction to draft them for review.

## What is genuinely good, and should not be touched

Worth recording so a later pass does not "improve" it:

- **The measure.** 48-55 characters is where prose should be, and it holds
  across every template.
- **The card idiom.** One card, one radius, one shadow scale, everywhere.
- **The restraint in the palette.** Two colours and a quiet third. Adding a
  fourth would make it a scheme rather than a voice.
- **Original artwork throughout.** Twenty-two diagrams drawn for this site,
  three photographs, no stock. That is most of category 10 and it is rare.
- **The sticky consultation bar.** Present, unobtrusive, offers the smaller
  ask beside the larger one.

## Second pass, same day

After the audit above, the work continued. What changed, and what it was worth:

| category | was | now | what actually changed |
|---|--:|--:|---|
| Section transitions | 300 | **840** | One masked wave rule. Every hero on the site now dissolves into the page; only the homepage did before. |
| Interior heroes | 380 | **800** | Twelve URL-encoded values repainted, ridge opacities down a quarter. |
| Palette coherence | 520 | **880** | Every colour on the site is now a token or a listed exception, enforced by a gate. |
| Vertical rhythm | 640 | **800** | 160 declarations snapped to a 4px grid; the scale exists as tokens. |
| Tables | 640 | **760** | A scroll container that says it scrolls. |

Nothing else was touched, so nothing else moves. That puts the mean at **773**.

**The number is still me marking my own work.** It is recorded because a
direction is more useful than a level, and because the five rows above are the
only ones where the change is objectively checkable — a gate passes or it does
not, a wave renders or it does not. Rows 1-13 of the original table are
unchanged and unaudited by anyone else.

## What the palette gate found once it existed

Worth listing, because none of it was visible before and all of it was live:

- the **CTA band**, on nearly every page, still on the previous blues
- the **footer links**, still a cool grey chosen for a navy that no longer exists
- the **PWA manifest** — an Android user opening this from a home-screen icon
  got a splash screen in the old blue-grey and the old blue
- the **sticky booking bar**, the most prominent conversion element on a phone,
  on every page, still near-white on a cream site
- the **nav scrim**, three stale `var()` fallbacks, and one `rgba()` written
  with spaces that a previous sweep had searched for without them

And then the gate itself was wrong. Its first version scraped every hex between
`:root{` and the radii comment — a range that is mostly prose, because the token
block carries long comments explaining what the previous palette was and quoting
it by name. It harvested the old palette out of the paragraphs explaining that
the old palette was wrong, allowlisted all of it, and passed a file with
`#5b8bc4` injected into it. That was caught by injecting exactly that and
watching it report success.

Six instrument errors this session, all the same shape. The gates are worth
having and none of them should be believed without a test that fails.

## What remains, and who it belongs to

**1. Long-form hierarchy** — the guides carry 3,247 words under twelve
same-level headings. Unchanged, and still the largest single item. The fix is
subheadings inside clinical copy, which is the counsellor's editorial call. I
can draft them for review; I will not invent them silently.

**2. Transactional email** — 86 colour literals across eleven templates, all
still on the pre-repaint palette. An HTML email cannot read a CSS variable, so
these are literal by necessity and the gate reports them without failing. It is
a real brand inconsistency and a genuinely different surface: the changes cannot
be verified without sending test mail through real clients.

Neither is blocked on design judgement. Both are blocked on a decision.
