# Go live — the one step only you can do

The site is built, tested and deployed. It runs at
**https://westpeak-wellness.vercel.app**.

It is not yet on **westpeakwellness.com** because only the domain owner can
change DNS at the registrar. That is the single remaining action, and it is
below.

---

## 1. Add the domain in Vercel

Vercel → project **westpeak-wellness** → **Settings → Domains → Add**:

```
westpeakwellness.com
www.westpeakwellness.com
```

Vercel will show the exact records. They will be these:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

## 2. Set those records where the DNS actually lives

**Checked 2026-08-09, because this section previously guessed Wix and was
wrong.** What is actually true:

| | |
|---|---|
| Registrar | **Squarespace Domains II LLC** — it acquired Google Domains in 2023 |
| Nameservers | `ns-cloud-d1…d4.googledomains.com` |
| Apex `A` | `23.236.62.147` — Wix, hosted on Google Cloud |
| `www` | CNAME → `www141.wixdns.net` |
| `MX` | **Google Workspace** (`aspmx.l.google.com` plus four `alt*`) |

Wix is only where the records *point*. It is not where they are edited. Start at
**https://account.squarespace.com/domains** → the domain → DNS.

The nameservers being Google's usually means Squarespace inherited the zone at
migration and it is editable there. If that panel is read-only, the zone lives in
Google Cloud DNS instead and needs access to the GCP project holding it.

Replace the `A` for `@` and the `CNAME` for `www` with the two values above.

**Leave the `MX` records completely alone.** Email on this domain is Google
Workspace, so info@westpeakwellness.com stops receiving mail if they are changed
or dropped. It is the most damaging mistake available here and also the easiest
to make — some panels offer to "replace all existing records" when you add new
ones.

**Do not transfer the registrar.** Nothing here needs it. The domain shows
`client transfer prohibited`, which is the ordinary registrar lock: it blocks
transfers, not DNS edits. Leave it locked.

**Take the TTL down to 300 seconds a few hours beforehand if you can.** It makes
the switch minutes rather than hours, and it makes backing out just as fast.

## 3. Nothing goes down while this happens

The Wix site keeps serving until each resolver picks up the change, and Vercel
serves the moment it does. There is no window where the domain resolves to
nothing. Vercel issues the TLS certificate automatically once it can see the
records — usually a few minutes, occasionally an hour.

Watch Vercel → Domains until both entries read **Valid Configuration**.

**If something looks wrong:** put the old DNS records back. With a 300-second
TTL you are returned to Wix within minutes. Nothing on the Wix side has been
touched or deleted.

---

## 4. Straight after the switch

In this order — the first two are what actually start the indexing clock.

1. **Google Search Console** — add `https://www.westpeakwellness.com`, verify by
   DNS TXT, then submit `https://www.westpeakwellness.com/sitemap.xml`.
   *If you would rather verify by meta tag:* set `NEXT_PUBLIC_GSC_VERIFICATION`
   in Vercel to the token and redeploy — the tag is already wired.
2. **Bing Webmaster Tools** — import from Search Console, which carries the
   verification across. Or set `NEXT_PUBLIC_BING_VERIFICATION` and redeploy.
3. **Check the old Wix URLs redirect.** All of them are in `next.config.mjs`.
   Spot-check two:
   `westpeakwellness.com/fees` → `/pricing`, and
   `westpeakwellness.com/copy-of-contact` → `/faq`.
4. **Confirm both hosts serve** — `westpeakwellness.com` and `www.` — and that
   one redirects to the other rather than both answering.
5. **Google Business Profile** — claim it, and make the practice name, URL and
   service area *character-for-character* identical to the site. This is the
   single biggest off-site factor for a local practice, and mismatched details
   are the usual reason it underperforms.

---

## 5. Environment variables worth setting

The site is live and fully functional without every one of these. Each unlocks
something specific, and nothing breaks while one is missing — that is by design.

| Variable | Unlocks | Without it |
|---|---|---|
| `NEXT_PUBLIC_CLINIKO_URL` | The booking calendar embedded on `/book` and the portal | Both pages explain the process and route to email |
| `NEXT_PUBLIC_GA_ID` | GA4 and every conversion event | No analytics is loaded at all |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Meta-tag verification | Verify by DNS instead — same result |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | "Continue with Google" on `/signin` | The button is hidden; password sign-in works |
| `CLINIKO_API_KEY` | Cliniko patients sign in without being listed in `/admin` | The `/admin` list is the only route |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Lead-magnet emails forwarded to your inbox | The form still confirms; the address is not captured |
| `RESEND_API_KEY` + `PORTAL_FROM_EMAIL` | Password-reset emails from `/forgot` | The form confirms but no link is sent, so reset is unavailable |

All of them are documented in `.env.example`. **Changing any of them requires a
redeploy** — Vercel → Deployments → ⋯ → Redeploy.

For Google sign-in, the authorised redirect URI must be exactly:

```
https://www.westpeakwellness.com/api/auth/callback/google
```

---

## 6. What is still yours to do, off-site

None of this is code, and it is what moves the remaining ground:

- Google Business Profile, claimed and complete
- Psychology Today, the BCACC directory, TherapyToday — **identical** name, URL
  and service area on each
- Real Google reviews, gathered over time. Note that BCACC prohibits soliciting
  testimonials from counselling clients — the reviews component on the site is
  built and deliberately empty, and is for colleagues and referrers rather than
  clients. See `lib/reviews.ts`.
