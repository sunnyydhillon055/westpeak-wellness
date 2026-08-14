# Payment model — decision record

**Decided 2026-08-14: payment stays at booking. Not revisited without a reason.**

Card-on-file with post-session charging was designed and started, then dropped in favour of the
simpler model already running. This file exists so nobody re-derives the research, and so a
future change starts from what was actually established rather than from scratch.

---

## What is live

All five Cliniko appointment types report, via the API:

```
online_payments_enabled = true
online_payments_mode    = "required"
```

The card is taken at the moment of booking, through the practice's own Stripe account, and
Cliniko issues the invoice and marks it paid. The site says so on `/pricing`, in the FAQ, in the
booking-payment diagram, and on the client portal.

Nothing about this needs maintaining.

## What was investigated, and the finding worth keeping

**Cliniko cannot store a card and charge it later.** Confirmed against its documentation and its
API. It offers exactly three payment paths and all three are patient-initiated:

| Cliniko supports | Cliniko does not support |
|---|---|
| Payment at online booking | Storing a card on file |
| Deposit at booking | Practitioner-initiated charging |
| Invoice payment links by email / SMS / QR | Automatic post-session charge |

So "card on file, charged after the session" is not a Cliniko setting. It requires holding the
card in Stripe directly, charging from this site, and writing the payment back into Cliniko.

## Why that write-back is the hard part

Cliniko is the invoicing record — it issues invoices, holds the clinical file, and is what the
accounting reconciles from. A charge that succeeds in Stripe and fails to land in Cliniko means
the books and the bank disagree, and nobody notices until month end. Any future build has to
treat "took the money, told nobody" as the state it is designed around, not an edge case.

## What paid-at-booking buys, and what it costs

**Buys:** payment is guaranteed. The 24-hour cancellation policy enforces itself. No bad debt, no
chasing, no failed-charge admin path, and no reconciliation surface between two systems.

**Costs:** friction at the exact moment a new client is deciding whether to book at all. That is
the only real argument for changing this, and it is a conversion question rather than a
bookkeeping one — worth revisiting only if booking abandonment turns out to be a measurable
problem rather than a suspected one.

## If it is revisited

The stage-1 groundwork — a Stripe REST client and a mandate/charge store — was written and then
removed as unused. It is in git history at commit `8c0cf2a` and can be restored with:

```
git show 8c0cf2a:lib/stripe.ts
git show 8c0cf2a:lib/payment-store.ts
```

The parts of that design worth carrying forward regardless of implementation:

- **Idempotency keyed on the Cliniko appointment id**, nothing time-varying. Stripe then refuses
  a duplicate itself, which holds even if local state is lost mid-run. Double-charging a
  counselling client is not a bug that gets forgiven.
- **Store the mandate wording and timestamp, not a boolean.** Card networks treat a stored card
  as a standing agreement; a boolean records that something happened without recording what,
  which is worthless in a dispute.
- **Never auto-charge a no-show.** Whether to bill someone who did not attend is a judgement
  about a person in a clinical relationship, not something a scheduled job should decide.
- **Card details never touch this server.** Collection via Stripe Elements, ids only. That
  boundary is what keeps the practice in SAQ-A rather than full PCI scope.
