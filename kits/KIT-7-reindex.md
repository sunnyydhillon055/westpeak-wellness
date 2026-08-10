# Kit 7 — Get the new site indexed

**Time: 20 minutes. Do this one first.** Google is still serving the old Wix
snippet for this domain. Until the new pages are crawled, every other
improvement is invisible.

---

## Step 1 — Submit the sitemap (2 minutes)

1. Open [Search Console](https://search.google.com/search-console) and select
   the `https://www.westpeakwellness.com` property.
2. Left menu → **Sitemaps**.
3. In "Add a new sitemap", enter exactly:

```
sitemap.xml
```

4. **Submit.** It should report *Success* and **105 discovered URLs**. If it
   says 0, wait an hour and refresh rather than resubmitting — resubmitting
   does not speed it up.

## Step 2 — Request indexing for 15 URLs (15 minutes)

For each URL below: paste it into the **search bar at the top** of Search
Console → wait for "URL is not on Google" or "URL is on Google" → click
**Request Indexing** → wait for the confirmation box.

It takes about a minute each. Google caps this at roughly 10–12 requests per
day, so **do the first 10 today and the last 5 tomorrow** — the list is already
in priority order.

```
https://www.westpeakwellness.com/
https://www.westpeakwellness.com/services
https://www.westpeakwellness.com/pricing
https://www.westpeakwellness.com/book
https://www.westpeakwellness.com/about
https://www.westpeakwellness.com/services/individual-therapy
https://www.westpeakwellness.com/services/couples-therapy
https://www.westpeakwellness.com/services/emdr-therapy
https://www.westpeakwellness.com/services/anxiety-counselling
https://www.westpeakwellness.com/services/punjabi-counselling
```

Tomorrow:

```
https://www.westpeakwellness.com/online-counselling/vancouver
https://www.westpeakwellness.com/online-counselling/surrey
https://www.westpeakwellness.com/guides/how-to-find-a-therapist-in-bc
https://www.westpeakwellness.com/guides/what-to-expect-first-therapy-session
https://www.westpeakwellness.com/faq
```

## Step 3 — Kill the stale Wix snippet (3 minutes)

If Google is still showing old Wix wording for `westpeakwellness.com`, the page
that produced it is gone and the 301s already point at the new pages. To make
Google refetch rather than wait:

1. Search Console → **Removals** → **New request** → **Clear cached URL**.
2. Enter `https://www.westpeakwellness.com/` and submit.

This clears the cached snippet without deindexing the page — it forces a fresh
fetch. **Do not use "Temporarily remove URL"**, which does deindex it.

## Step 4 — Bing (5 minutes)

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Choose **Import from Google Search Console** and authorise. This carries the
   verification and the sitemap across, so there is nothing else to enter.
3. If you would rather verify by meta tag: send me the token, I will set
   `NEXT_PUBLIC_BING_VERIFICATION` — the tag is already wired and just needs
   the value.

Bing matters more than its search share suggests: it is the index behind
Microsoft Copilot and DuckDuckGo.

## Step 5 — Check in a week

Search Console → **Pages**. You are looking for *Indexed* climbing toward 105.
Anything under **Not indexed** with the reason *Crawled – currently not
indexed* is normal for a new site and usually resolves on its own; send me the
list if it is still there in a month.

---

**Executing this kit is estimated worth +90 points in categories 1, 5 and 49
(see SCORE_LEDGER.md)** — and, more importantly, it is what makes the other
22,550 points visible to anyone.
