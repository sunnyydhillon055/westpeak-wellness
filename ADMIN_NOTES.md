# Client portal — access and administration

## How access works

Two gates, both required:

1. **Middleware** (`middleware.ts`) checks that the session cookie is one this
   site issued, for the area being requested. Signature only, no I/O.
2. **The page** re-checks the address against the stored list on every render.

The split exists because edge middleware cannot read the blob store. It is also
what makes removal immediate: a signed cookie stays cryptographically valid, so
if only the signature were checked, a removed client would keep access until
their cookie expired. The second check is not belt-and-braces — it is the
mechanism.

`/admin` and `/client-portal` use **separate cookies and separate signature
namespaces**. A client session cannot be replayed against the admin area, and a
sign-in link mailed to a client cannot be redeemed for an admin session even if
the URL is edited, because the scope is inside the signed payload.

## Managing clients

Sign in at **`/admin`** and edit the list. One address per line. On save the
list is lowercased, de-duplicated, sorted, and anything that is not a valid
address is dropped — what you see after saving is exactly what is stored.

Removing someone takes effect on their next click. There is no session to wait
out and nothing to rotate for anyone else.

`PORTAL_ALLOWED_EMAILS` still works and is merged with the stored list, so
anyone configured before `/admin` existed keeps access. Prefer the admin screen.

## Environment variables

| Variable | Required | What it does |
|---|---|---|
| `PORTAL_SECRET` | **yes** | Signs links and sessions. Unset ⇒ nobody gets in, anywhere. |
| `PORTAL_ADMIN_EMAILS` | **yes** | Who may reach `/admin`. Deliberately *not* editable from `/admin` — that screen must not be able to remove the last way in. |
| `RESEND_API_KEY`, `PORTAL_FROM_EMAIL` | for email sign-in | Sends the links. Without them the email path accepts an address and sends nothing. |
| `PORTAL_ADMIN_CODE` | bootstrap only | Opens an admin session for the first address in `PORTAL_ADMIN_EMAILS`. Exists so the owner is not locked out of the access screen before email works. **Delete once email is configured.** |
| `PORTAL_ACCESS_CODE` | legacy | Shared client code. Delete once clients are on email. |
| `BLOB_READ_WRITE_TOKEN` | **yes** | Set automatically when the blob store was linked. |
| `PORTAL_ALLOWED_EMAILS` | optional | Legacy client list, merged with the stored one. |
| `CLINIKO_API_KEY` | optional | Lets Cliniko patients sign in without being listed here. Must include the shard suffix (`…-au1`, `…-ca1`) — the host is derived from it. |

Changing any of these needs a redeploy to take effect. **Editing the client list
in `/admin` does not** — that is the point of the blob store.

## Privacy — read before scaling this up

The list is *who is receiving counselling*, which is health information about
identifiable people. Two facts to weigh:

- The blob store is **private** (no public URL; reads are authenticated), but it
  is in Vercel's **`iad1`** region — **the United States**.
- The same information already exists in Cliniko, under whatever residency was
  chosen there.

So this is a **second copy of clinical information, in another country**. For a
BC practice under PIPA/PIPEDA that is worth a deliberate decision rather than a
default.

### Cliniko as the source of truth

This is now built. Set `CLINIKO_API_KEY` and a portal sign-in also succeeds for
anyone Cliniko knows as a patient — add someone in Cliniko and they can sign in;
discharge them and they cannot. Nobody has to be typed into the list above.

**It is additive, never subtractive.** Cliniko is consulted *after* the env list
and the stored list, and only a confident match grants access. Every failure —
outage, rotated key, rate limit, an account where the email filter is not
available — returns "no" and lets the other sources decide. The alternative,
treating Cliniko as the authority, would mean one bad request locks every client
out of the portal at once.

Two things to know before relying on it:

- Cliniko's documentation does not state that `email` is a filterable field on
  the patients endpoint. It may simply work; it may return a 422. **Use the
  connection test on `/admin`** — it runs one live lookup and tells you which
  case you are in.
- Until you have confirmed a real address matches, keep the stored list
  populated. It costs nothing and it is what stops a surprise from locking
  people out.

Once lookups are confirmed working, emptying the stored list is what actually
removes the second copy of clinical data — that is the point, and it is a
deliberate step rather than something that happens automatically.

## What is deliberately not here

- **No password login.** Passwords would have to be stored and reset; signed
  links avoid both, and the mailbox is already the recovery channel.
- **No client-side gating.** A static site would ship the secret in the bundle.
- **No enumeration.** Sign-in returns the same response, in the same time,
  whether or not an address is recognised — an endpoint that answers "is this
  person a client of yours?" leaks clinical information to anyone who can type
  an email address.
