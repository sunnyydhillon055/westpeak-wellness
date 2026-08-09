# Client portal and admin — how access works

Rewritten after the move to real accounts. Earlier versions of this file
described an emailed-link and shared-code system that no longer exists.

---

## Sign-in

One page, `/signin`, serving both areas. Which one you asked for decides the
wording and the destination — arriving from `/admin` says "Staff sign in", from
the portal it says "Client portal" — but there is one form, so there is no
second page to keep in step.

Two methods:

- **Google** — appears once `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set.
  Nothing secret is stored here, and Google's own 2FA applies.
- **Email and password** — optional, for people who do not want Google.
  Self-service from `/forgot`, or set by an administrator at `/admin`.

**Authentication and authorization are separate, deliberately.** The providers
answer *are you who you say you are*. The `signIn` callback in `auth.ts` answers
*are you allowed here* — the address must be on the client list, known to
Cliniko, or an administrator. A valid Google account on its own grants nothing.
Without that second check every Google account on earth would have access.

Google's unverified-email case is rejected explicitly. Google can assert an
address it has not confirmed, and that must not be enough to open someone
else's portal.

## Two gates, and why both are needed

1. **Middleware** checks there is a session with the right role, before
   anything renders. No I/O.
2. **The page** re-checks the person against the stored list on every render.

The second is not belt-and-braces. A session token stays valid until it
expires, so without it, removing someone in `/admin` would not take effect
until then. This is the mechanism that makes removal immediate.

`/admin` is staff only, enforced in both places. A client who follows a link
there is told plainly that the account has no admin access — not bounced.

## Password reset

`/forgot` → one-time link → `/reset`. No involvement from the practice.

**Single-use without a database.** The link carries a fingerprint derived from
the credential it was issued against. Changing the password changes the
fingerprint, so using a link spends it and cancels every other outstanding link
for that account. The fingerprint is a hash *of the stored hash*, never the hash
itself, so a reset URL cannot be worked backwards into anything.

The request step answers identically whether or not the address has an account,
in the same fixed time. On a counselling site, revealing whether someone has an
account reveals whether they are a client.

Eligibility is re-checked when the link is redeemed, not only when it is issued,
so someone removed from the list in between cannot complete a reset.

Needs `RESEND_API_KEY` and `PORTAL_FROM_EMAIL`. Without them the form accepts an
address and confirms, and no mail is sent.

## ⚠ Vercel Blob is not read-after-write consistent

**This caused two real bugs and is the thing to know before changing any of
this code.** A read immediately after a write can still return the previous
object.

Harmless for the client allowlist, where a few seconds of staleness costs
nothing. Not harmless for credentials:

- `setPassword` wrote and the route reported success unconditionally. When the
  write did not land, the old password kept working while the person had been
  told to use a new one — silent on both sides.
- The single-use check re-reads the credential, so a stale read allowed a used
  link to be replayed. Testing confirmed a replayed link actually overwrote the
  password.

Two mitigations, both in place:

1. **A write-through cache** in `lib/portal-users.ts`. A write is immediately
   visible to the process that made it, which is the case that matters — the
   reset, the verification and the replay check all happen in one request.
2. **The reset route reads the new password back and re-verifies it** before
   reporting success, and says so plainly when it cannot.

**What is still true:** writes propagate between serverless instances at their
own pace, so a replay landing on a cold instance inside that window could be
accepted. Closing that properly needs a strongly consistent store. It is a
narrow window on a low-traffic site, and it is a real limitation rather than a
theoretical one.

Never add a code path that decides access from a read taken straight after a
write without accounting for this.

## Managing clients

`/admin` — one address per line. On save the list is lowercased, de-duplicated,
sorted, and anything invalid is dropped, so what you see after saving is exactly
what is stored. Removal takes effect on the next click.

`PORTAL_ALLOWED_EMAILS` still works and is merged with the stored list, so
anyone configured before `/admin` existed keeps access. Prefer the screen.

Administrators live in `PORTAL_ADMIN_EMAILS`, deliberately outside the form that
manages clients — the screen that removes people must not be able to remove the
last way in.

## Cliniko

Optional. With `CLINIKO_API_KEY` set, anyone Cliniko knows as a patient can sign
in without being listed. **Additive, never subtractive**: consulted after the
stored list, and only a confident match grants access. An outage, a rotated key
or an unsupported filter all return "no" and let the other sources decide.
Treating Cliniko as the authority would mean one failed request locking every
client out at once.

Cliniko's docs do not confirm that `email` is a filterable field on the patients
endpoint. Use the connection test on `/admin` — it runs one live lookup and
reports which of seven states occurred.

## Privacy

The client allowlist is *who is receiving counselling*, which is health
information about identifiable people. The blob store is private, but it lives
in Vercel's `iad1` region — the United States — and Cliniko already holds the
same information. That is a second copy of clinical data in another country,
which for a BC practice under PIPA is a decision to make rather than a default
to accept.

Once Cliniko lookups are confirmed working, **emptying the stored list is what
actually removes the second copy.** That is the point of the Cliniko
integration, and it is a deliberate step.

## Environment variables

| Variable | Required | What it does |
|---|---|---|
| `AUTH_SECRET` | **yes** | Signs session tokens |
| `PORTAL_SECRET` | **yes** | Signs reset links |
| `PORTAL_ADMIN_EMAILS` | **yes** | Who may reach `/admin` |
| `BLOB_READ_WRITE_TOKEN` | **yes** | Set automatically when the store was linked |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | for Google | Redirect URI must be `https://<domain>/api/auth/callback/google` |
| `RESEND_API_KEY` / `PORTAL_FROM_EMAIL` | for reset emails | Without them `/forgot` confirms and sends nothing |
| `CLINIKO_API_KEY` | optional | Cliniko patients sign in without being listed |
| `PORTAL_ALLOWED_EMAILS` | optional | Legacy list, merged with the stored one |

All of these need a redeploy to take effect. **Editing the client list in
`/admin` does not** — that is why it lives in Blob.

## Deliberately not built

- **No self-service registration.** Being a client is decided by the practice.
- **No password complexity rules beyond a 10-character minimum.** Length beats
  punctuation, and composition rules mostly produce `Password1!`.
- **No client-side gating anywhere.** A static site would ship the secret in the
  bundle.
- **No account enumeration.** Sign-in and reset both answer the same way, in the
  same time, whether or not an address is known.
