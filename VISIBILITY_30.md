# 30 ways to grow visibility, with Claude

**Written 2026-08-10** after a full-scope sweep: live crawl as Googlebot,
107-URL inventory, head-term coverage test, and a topic audit of all 37 guides,
7 comparisons, 8 resources, 8 audience pages, 6 approaches and 3 tools.

Ordered by expected impact on impressions. Each says **what Claude does** and
**what only you can do** — because on this site the second column is where the
bottleneck actually sits.

---

## First, the honest frame

Impressions need three things: indexed pages, rankings, and queries with
volume. The site has 107 well-built pages and no technical faults. The two
things missing are **time** and **zero referring domains**.

So items 1–8 below add impression *surface*. Items 9–16 raise the chance that
surface ranks. Items 17–24 are the off-site work that decides whether any of it
outranks anyone. Items 25–30 tell you whether it worked.

**If you only do four things, do 17, 18, 19 and 20.** They are worth more than
items 1–16 combined over six months, and none of them is code.

---

# A · Add impression surface (Claude writes, you approve)

**1. Ten guides on measured topic gaps.**
The sweep found no page for: attachment styles, PTSD specifically, OCD and
intrusive-thought disorders, postpartum depression as its own page, insomnia
as its own page, separation and divorce, supporting a partner with anxiety,
stress leave and short-term disability in BC, anxiety in relationships,
seasonal affective disorder as distinct from winter low mood. Each is a real
query and each is on-brand.
*Claude: full drafts with citations, FAQ, schema, internal links. You: read
them for clinical accuracy before publishing — this is the one thing you must
not delegate.*

**2. Expand the 16 pages under 900 words.**
All hubs and tools. Not padding — the hubs are thin because they list rather
than explain.
*Claude: expand each with genuinely useful orientation copy.*

**3. FAQ blocks on all 9 service pages.**
86 pages carry FAQPage markup; the service pages are where buying questions
land. Just added to `/pricing`; the rest are open.

**4. Direct-answer blocks on every guide.**
40–55 words directly under the H1, phrased as the query. This is what wins
featured snippets and what AI assistants quote.

**5. Question-form H2s across the guide set.**
"How long does EMDR take?" outranks "Duration". Mechanical, high yield.

**6. Six BC city pages beyond the current six.**
Kamloops, Nanaimo, Kelowna and Prince George exist; Burnaby, Richmond,
Coquitlam, Langley, Chilliwack and Maple Ridge were retired as near-duplicates
in an earlier audit. They can return **only** if each is genuinely distinct —
local wait times, regional health authority, local crisis lines. Thin city
pages are worse than none.

**7. Four more comparison pages.**
`/compare` has 7 and converts well: add EMDR vs somatic, RCC vs online
platforms (BetterHelp-type, describing the model not the brand), group vs
individual, short-term vs open-ended therapy.

**8. A "what is an RCC" explainer.**
"Registered clinical counsellor" is a real informational query with no page.
It is also pure E-E-A-T: what the designation requires, how to verify it.

---

# B · Make that surface rank (Claude does most of it)

**9. Internal links to the thin-inbound pages.**
`/punjabi` (3), `/accessibility` (3), `/reviews` (4), tools (5 each). Every
page under 6 in-content inbound links.

**10. `speakable` schema on the top FAQ answers.** Voice and assistant surfaces.

**11. `HowTo` schema on the three tools.**

**12. Real `dateModified` from git history.**
Only 3 distinct `lastmod` values today because the content dates genuinely are
uniform. Cannot be faked — but can be derived from actual commits.

**13. Title and description CTR pass.**
Same rankings, more clicks: numbers, years where honest, question form.

**14. An `/answers` hub.**
One page collecting every direct answer on the site — the format AI assistants
retrieve from most readily.

**15. Video schema and a facade player, ready before you record.**
So the afternoon you record, publishing is a config change.

**16. Sharpen `llms.txt` and shrink `llms-full.txt`.**
655 kB is past what most models will ingest, so it is currently decorative.

---

# C · The actual bottleneck (Claude writes it, you send it)

**17. BCACC directory listing.** [Kit 2](kits/KIT-2-bcacc-listing.md).
Regulator-authority citation, and yours is reportedly wrong ("West Peak
Wellness", Surrey/in-person framing). **Highest value single hour available.**

**18. Psychology Today profile.** [Kit 3](kits/KIT-3-psychology-today.md).
Highest-intent referral traffic in Canadian counselling. ~$40/month, pays for
itself on one client.

**19. Google Business Profile.** [Kit 1](kits/KIT-1-google-business-profile.md).
Note: GBP impressions report in GBP Insights, **not** Search Console — so this
will not move the number you are watching. It will move bookings.

**20. CounsellingBC + TherapyDen + Theralist.** [Kit 4](kits/KIT-4-6-8-directories-and-outreach.md). Free or cheap.

**21. Punjabi-community outreach.** Five pitch emails written and ready. The
Punjabi page is a genuine differentiator no competitor has.

**22. HARO / Connectively responses.** Templates written; you send. Press links
are the highest-authority links available and cost nothing but time.

**23. Referral partner kit.** Bookkeepers, GPs, dietitians, doulas. Two-way
referrals beat any link.

**24. Local news pitch.** Punjabi-language therapy access is a genuine story
angle. Draft written.

---

# D · Know whether it worked

**25. GSC rank log.** Weekly append of 80+ tracked queries to a CSV, with trend.
Until this runs, every ranking claim is a guess.

**26. Content decay detector.** GSC API: which pages are rising, flat, decaying,
or sitting at positions 11–20. **Striking distance is the cheapest ranking
available** — a page at 12 needs far less to reach 8 than a new page needs to
reach 50.

**27. Cannibalisation audit.** Where two of your pages compete for one query.
With a service × city matrix this is a real risk.

**28. Monthly one-page KPI report.** Sessions, bookings, impressions, top
movements.

**29. AI-visibility battery.** Ask the six major assistants the 30 questions a
BC client would ask; log whether Westpeak is named. This is a real and growing
discovery channel and nobody measures it.

**30. Indexation watch.** Weekly Pages-report check until all 107 are indexed.
Right now this is the single most informative number about the site.

---

## What I would do in what order

| When | Do |
|---|---|
| **This week** | 17, 18, 20 — three listings, ~90 minutes, your first backlinks |
| **This week** | 30 — read the Indexed count in Search Console |
| **Next** | 1 and 8 — ten guides plus the RCC explainer, Claude drafts, you verify |
| **Then** | 3, 4, 5, 9 — the mechanical on-page pass |
| **Ongoing** | 26 — refresh whatever lands at positions 11–20 |
| **When traffic exists** | 25, 28, 29 |

Items 1–16 are mine. Items 17–24 are yours and they matter more.
