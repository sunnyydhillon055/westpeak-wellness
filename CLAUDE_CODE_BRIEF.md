# Westpeak Wellness — Claude Code Build & Deploy Brief

## Context
This folder is a complete, ready-to-deploy Next.js 14 website. It is a NEW project — it has never been pushed to GitHub or deployed to Vercel. Your job is to set it up as a brand-new project from scratch: install, verify, make a couple of edits, push to a new GitHub repo, and deploy to a new Vercel project on a temporary URL. Everything you need already exists in this folder. Do not scaffold a new Next.js app — this one is done and builds cleanly.

## What the site is
Fully virtual counselling website for **Aman Bains Dhillon, MA, RCC**, serving all of British Columbia. Practice name **Westpeak Wellness**. Next.js 14 App Router + TypeScript, no database, ~64 statically generated pages, free to host on Vercel.

## Files already in this folder
- `app/` — Home (`page.tsx`), About, Services (overview + dynamic `[slug]`), Fees (`pricing`), FAQ, Contact, Online Counselling (index + dynamic `[city]`), `layout.tsx`, `globals.css`, `sitemap.ts`, `robots.ts`, `not-found.tsx`
- `components/` — Header, Footer, CtaBand
- `lib/` — `site.ts` (central config: name, email, bookingUrl, etc.), `services.ts` (9 services), `locations.ts` (45 BC cities), `faq.ts` (13 FAQs)
- `next.config.mjs` — has 301 redirects from old Wix URLs to new routes
- `package.json`, `tsconfig.json`, `.gitignore`, `README.md`, `DEPLOY.md`

## Design — do not change
Neutral light-blue counselling theme, serif display headings, responsive, keyboard-accessible. All theming via CSS variables in `app/globals.css`. Keep the look exactly as-is.

## TASKS — execute in this exact order

### 1. Verify the build
Run:
    npm install
    npm run build
Expect a clean compile generating ~64 static pages (7 core + 9 `/services/[slug]` + 45 `/online-counselling/[city]` + sitemap + robots). If any error appears, fix it minimally without changing design or copy, then rebuild until clean.

### 2. Pre-launch edits (these specific ones)
- In `lib/faq.ts`: DELETE the entire FAQ object whose question is "Can you direct-bill my insurance?" (Aman is not enrolled in direct billing). Remove the whole `{ q: ..., a: ... }` entry.
- In `app/pricing/page.tsx`: in the "Extended health" card, DELETE the sentence that begins "Pacific Blue Cross now offers direct billing for RCCs." Keep the rest of that card (the pay-and-submit reimbursement line stays).
- In `lib/site.ts`: LEAVE `bookingUrl` as the placeholder. The user is adding the real Calendly link later. Do not ask about it.
- Do not change any fees, credentials, service copy, or the light-blue theme.
- After edits, run `npm run build` again to confirm still clean.

### 3. Local preview
Start the production server (`npm start`) or dev server (`npm run dev`) and confirm the user can open http://localhost:3000. Point them to check Home, a service page, the Fees page, and a city page.

### 4. New GitHub repo
- If GitHub CLI is available and authed: `gh repo create westpeak-wellness --private --source=. --remote=origin`
- Otherwise instruct the user to create a private repo named `westpeak-wellness` on github.com, then set the remote.
- Then:
    git init
    git add .
    git commit -m "Initial Westpeak Wellness site"
    git branch -M main
    git push -u origin main
- `.gitignore` already excludes node_modules, .next, .vercel.

### 5. New Vercel project — temporary URL ONLY
- `npm i -g vercel` if needed, then `vercel login` (user authorizes).
- Run `vercel` and create a BRAND-NEW project (do not link to any existing project). Framework auto-detects Next.js; accept defaults.
- Then `vercel --prod` to get a production deployment.
- Result: a URL like `westpeak-wellness.vercel.app`. This is the review URL.
- **DO NOT add, buy, or transfer the domain westpeakwellness.com. DO NOT touch any DNS.** The user's current site is live on Wix and must stay untouched. The domain move is a separate manual step the user does later (documented in DEPLOY.md). Deploying to the temp URL is zero-risk to the live site.

### 6. Report back
Tell the user:
- The temporary Vercel URL to review.
- Exactly what you edited (the two direct-billing removals).
- Remaining to-dos: (a) add the real Calendly link in `lib/site.ts` and redeploy, (b) domain transfer is later per DEPLOY.md.

## Guardrails
- Healthcare/counselling site under BCACC advertising rules: add no outcome claims, guarantees, or new coverage specifics.
- Never touch the domain or DNS in this session. Temp URL only.
- Keep it static — no backend, analytics, or third-party scripts unless the user asks.
- Ask before anything destructive.
