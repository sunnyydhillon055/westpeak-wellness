# Westpeak Wellness — Website

Fully virtual counselling practice for [COUNSELLOR NAME], MA, RCC. Serving all of British Columbia. Built with Next.js 14 (App Router) + TypeScript. No database, no external services — deploys free on Vercel.

## What's in here

- **7 core pages:** Home, About, Services, Fees, FAQ, Contact, Online Counselling index
- **9 service pages:** individual, couples, EMDR, trauma, anxiety, depression, Punjabi-speaking, South Asian mental health, online counselling
- **45 BC location pages:** `/online-counselling/<city>` for SEO (Vancouver → Prince George)
- **SEO built in:** per-page titles + meta descriptions, Open Graph, JSON-LD schema (MedicalBusiness + FAQPage), auto sitemap.xml, robots.txt
- **Old Wix URLs redirected** (301) so existing links & Google index don't break
- ~64 pages total, all statically generated (fast + cheap to host)

## Run locally
    npm install
    npm run dev        # http://localhost:3000
    npm run build      # production build

## ⚠️ Before going live — edit these

1. **Calendly link** — in `lib/site.ts`, set `bookingUrl` to the counsellor's real Calendly URL. Every "Book" button uses it.
2. **Instagram URL** — confirm `instagramUrl` in `lib/site.ts` is correct.
3. **Direct billing line** — `app/pricing/page.tsx` and `lib/faq.ts` mention Pacific Blue Cross direct billing. Keep only if the counsellor is enrolled; otherwise delete that sentence.
4. **Fees** — confirm the fee table in `app/pricing/page.tsx` matches current pricing.

## Editing content

- Site-wide info (email, hours, name): `lib/site.ts`
- Service page content: `lib/services.ts`
- FAQ questions/answers: `lib/faq.ts`
- Cities served: `lib/locations.ts` (add/remove entries — pages generate automatically)

## Deploy to Vercel — see DEPLOY.md
