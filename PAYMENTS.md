# Card on file, charged after the session

**Decision date:** 2026-08-14
**Status:** design agreed, build in stages. Nothing is live.

---

## Why this is a build and not a setting

Verified against Cliniko's own documentation and its API. Cliniko offers exactly three payment
paths, and **all three are patient-initiated**:

| Cliniko supports | Cliniko does not support |
|---|---|
| Payment at online booking (currently `required` on all 5 types) | Storing a card on file |
| Deposit at booking | Practitioner-initiated charging |
| Invoice payment links by email / SMS / QR | Automatic post-session charge |

There is no Cliniko feature that stores a card and charges it later. So the card must be held by
Stripe directly, charged by this site, and the resulting payment written **back** into Cliniko.

## The constraint that shapes everything

**Cliniko is the record for invoicing, and must stay that way.** It issues the invoice, holds the
clinical file, and is what the practice's accounting is reconciled from. A charge that happens in
Stripe and is not reflected in Cliniko means the books and the bank disagree within a week, and
the practice would not notice until month end.

So every successful charge does two things, in this order, or it is not finished:

1. Take the money in Stripe
2. Write a matching payment against the Cliniko invoice via the API

Step 2 failing after step 1 succeeded is the single worst state this system can reach — the
client has been charged and the practice's records say they have not. It must be retried, and it
must be visible when it fails.

---

## Architecture

```
Client saves a card            Session happens              After the session
─────────────────────          ───────────────              ─────────────────
/client-portal                 Cliniko holds the            cron (2-hourly)
  Stripe Elements              appointment                    ↓
  SetupIntent                                               find completed, unpaid
  card → Stripe direct                                        ↓
    ↓                                                       PaymentIntent
  payment_method id                                         off_session
  + mandate consent                                           ↓
    ↓                                                       write payment to Cliniko
  Blob: cliniko patient ↔ stripe customer                     ↓
                                                            receipt email
```

### Card details never touch this server

Stripe Elements collects the card in an iframe served by Stripe. The site sees a
`payment_method` id and nothing else. This is what keeps the practice out of PCI DSS scope
beyond SAQ-A, and it is not negotiable — no card number, CVC or expiry may ever be posted to,
logged by, or stored on this site.

### Off-session charging requires a mandate

Card networks require stored-credential agreements to be explicit. Stripe enforces this: the
SetupIntent must record that the client agreed to the card being charged later, and the charge
must be flagged `off_session`. Practically this means:

- The client must **actively agree** to specific wording before the card is saved
- The wording must say **what** will be charged, **when**, and **how to cancel**
- The agreement — text version, timestamp — is recorded alongside the customer mapping

Without this, charges are more likely to be declined as unauthorised, and the practice is
exposed on any dispute.

### Idempotency is the thing most likely to go wrong

The charge job runs every two hours over a window of recent appointments. A retry, an overlapping
run, or a timeout after the charge succeeded must never produce a second charge.

- Every PaymentIntent is created with an **idempotency key derived from the Cliniko appointment
  id**, so Stripe itself refuses a duplicate
- A local ledger records charged appointment ids before the next is attempted
- The ledger is written after Stripe confirms, not before

Double-charging a counselling client is not a bug that gets forgiven.

---

## What must NOT be charged

The job only charges an appointment that is **all** of:

- in the past, and finished at least 2 hours ago (a session running long must not trigger a charge)
- not `cancelled_at`, not `archived_at`
- not `did_not_arrive` — **no-shows are a policy decision, not an automatic charge.** The
  practice decides whether to bill a no-show; a background job must not make that call
- attached to a Cliniko invoice that is not already settled
- for a patient with a saved payment method and a recorded mandate

Anything failing these is skipped and counted, never guessed at.

---

## Failure paths, all of which are expected

| Failure | Behaviour |
|---|---|
| Card declined | Mark the attempt, email the client a Cliniko payment link, notify the practice. Do not retry silently — a decline is information, not a transient error |
| Card expired / removed | Same, plus prompt to update the card in the portal |
| Stripe up, Cliniko write fails | **Retry the Cliniko write.** Never re-charge. Surface loudly if it keeps failing |
| No saved card | Fall back to the invoice payment link. This is the normal path for a client who has not opted in |
| Stripe unreachable | Skip, leave unmarked, next run picks it up |

**The fallback is always the Cliniko invoice link.** Card-on-file is an upgrade over that path,
never a replacement for it — a client who does not want to store a card must still be able to pay.

---

## Owner steps — required before any of this can run

1. **Stripe API keys.** The Stripe account already exists (Cliniko uses it). Needed here:
   - `STRIPE_SECRET_KEY` — Stripe Dashboard → Developers → API keys
   - `STRIPE_PUBLISHABLE_KEY` — same page
   - `STRIPE_WEBHOOK_SECRET` — after creating the webhook endpoint below
2. **Webhook endpoint** in Stripe → Developers → Webhooks, pointing at
   `https://www.westpeakwellness.com/api/stripe/webhook`, subscribing to
   `payment_intent.succeeded`, `payment_intent.payment_failed`, `setup_intent.succeeded`.
3. **Decide the cancellation charge.** A card on file is the tool that makes a 24-hour policy
   enforceable. Whether a late cancel is charged in full, part, or not at all is a business
   decision, and it should be written into the mandate wording clients agree to.
4. **Cliniko appointment types** stay as they are until the new path is proven, then move from
   `required` to `optional` so booking no longer demands payment upfront. Reversible in seconds.

**Do not flip step 4 until a real charge has succeeded end to end.** Until then the practice
still gets paid at booking, which is the safe state.

---

## Build stages

| Stage | Contents | Verifiable without Stripe keys? |
|---|---|---|
| 1 | `lib/stripe.ts` client, customer/mandate store, types | Partly — shape and guards only |
| 2 | Card capture UI in the portal, SetupIntent route | No |
| 3 | Charge job + idempotency ledger + Cliniko write-back | No |
| 4 | Webhook receiver, receipt email, failure notices | No |
| 5 | Switch Cliniko to `optional`, monitor, then announce | No |

Stages 2 onward cannot be meaningfully tested without keys and Stripe test mode. That is the
gating item, not the code.

---

## The honest risk summary

Moving from paid-at-booking to charged-after is a **downgrade in payment certainty** in exchange
for lower friction at the moment a new client decides to book. The practice takes on:

- bad debt where a card declines and the client does not respond
- an admin path for failed charges that did not exist before
- a reconciliation surface between two systems that did not exist before

The mitigations are the mandate, the fallback invoice link, and the write-back. None of them make
the risk zero. It is a reasonable trade for a practice trying to lower the barrier to a first
session, and it should be reviewed after a month of real data rather than assumed to be working.
