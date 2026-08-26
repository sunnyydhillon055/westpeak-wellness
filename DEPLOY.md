# Deploying Westpeak Wellness to Vercel + transferring the domain

This is a SEPARATE Vercel project from your other sites. Follow in order.

## Step 1 — Push to GitHub
1. Create a new **private** repo on github.com (e.g. `westpeak-wellness`). Don't add a README (one exists).
2. In this project folder:
       git init
       git add .
       git commit -m "Initial Westpeak Wellness site"
       git branch -M main
       git remote add origin https://github.com/<your-username>/westpeak-wellness.git
       git push -u origin main

## Step 2 — Create the Vercel project
1. Go to vercel.com → **Add New → Project**.
2. Import the `westpeak-wellness` repo.
3. Framework preset auto-detects **Next.js**. Leave build settings default.
4. Click **Deploy**. In ~1 min you'll get a temporary URL like `westpeak-wellness.vercel.app`.
5. **Review the whole site on that temp URL** with Aman before touching the domain — zero risk, current live site stays up.

## Step 3 — Add the domain (do this only after review)
Because westpeakwellness.com currently points at Wix, transfer with NO downtime:
1. In the Vercel project → **Settings → Domains** → add `westpeakwellness.com` and `www.westpeakwellness.com`.
2. Vercel shows the DNS records to set (an A record + a CNAME for www).
3. Log in to wherever the domain's DNS lives (Wix, or your registrar) and update those records to the values Vercel gives you.
   - If the domain is *registered through Wix*, you may first need to unlock/point it out — Wix → Domains → Advanced → change nameservers or edit DNS.
   - Easiest long-term: transfer the domain registration to a neutral registrar (Cloudflare, Namecheap) and manage DNS there. Not required to launch, but cleaner.
4. DNS changes take anywhere from a few minutes to a few hours. Vercel auto-issues the SSL certificate once it sees the records.
5. Once Vercel shows the domain as "Valid Configuration," the new site is live at westpeakwellness.com.

## Step 4 — Post-launch SEO
1. Add the site to **Google Search Console** (search.google.com/search-console), verify ownership, and submit `https://www.westpeakwellness.com/sitemap.xml`.
2. This tells Google about all ~64 pages and helps the 301 redirects from old Wix URLs pass ranking to the new pages.

## Ongoing edits
Any change: edit files → `git commit` → `git push`. Vercel auto-deploys every push to `main` in ~1 minute.

## Before you deploy — one command

```
npm run build && npm run verify
```

`verify` runs, in order:

| | what fails it |
|---|---|
| `redirect-shadow` | a page exists that a redirect makes unreachable |
| `seo-audit` | title/description limits, missing schema, orphan pages |
| `expansion-verify` | Alberta or Ontario content became reachable, or the counsellor's name appeared outside `/about` |
| `link-rot` | an external citation now 404s |
| `quality-audit` | accessibility and metadata defects (reports, does not fail) |
| `visual-audit` | pages that have become walls of text (reports) |
| `price-drift` | the fees on the site no longer match Cliniko |

The first four fail the chain. The last three report and continue.

`price-drift` is deliberately non-fatal here even though it exits non-zero
on its own: without `CLINIKO_API_KEY` it cannot compare at all, and a
verify step that fails on every machine without a key is a step people
learn to ignore. Run `npm run drift` directly, with the key set, when you
want that answer.

**Run `npm run dates` whenever page content changes.** The sitemap's
`lastmod` comes from `lib/page-dates.ts`, and a stale one tells Google
nothing has changed — which on 23 August was suppressing recrawl of a
week's work, including twelve rewritten snippets.
