/* Stripe, as REST calls rather than the SDK.
 *
 * Same reasoning as lib/portal-mail.ts: one file to change if the provider
 * changes, no dependency to keep current, and nothing hidden behind a wrapper
 * on a path that moves money. The Stripe API is form-encoded, not JSON, which
 * is the only surprising thing about talking to it directly.
 *
 * CARD DETAILS NEVER REACH THIS SERVER. Collection happens in Stripe Elements,
 * in an iframe Stripe serves. Everything here deals in ids -- customer,
 * payment method, payment intent. No card number, CVC or expiry may ever be
 * passed to, logged by, or stored through this module. That boundary is what
 * keeps the practice within SAQ-A rather than full PCI scope, and it is not a
 * detail to trade away for convenience later.
 */

const API = 'https://api.stripe.com/v1';

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export type StripeResult<T> =
  | { ok: true; data: T }
  | { ok: false; code?: string; message: string; declined?: boolean };

/* Stripe wants form encoding, including for nested objects, which it expresses
 * as bracket notation: mandate_data[customer_acceptance][type]=online. */
function encode(obj: Record<string, unknown>, prefix = ''): string[] {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object' && !Array.isArray(v)) {
      parts.push(...encode(v as Record<string, unknown>, key));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts;
}

async function call<T>(
  path: string,
  body?: Record<string, unknown>,
  /* Stripe deduplicates on this key for 24 hours. Passing one derived from the
   * appointment is what makes a retry safe: Stripe returns the ORIGINAL charge
   * rather than creating a second one. This is the primary defence against
   * double-charging, ahead of any ledger we keep ourselves. */
  idempotencyKey?: string
): Promise<StripeResult<T>> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return { ok: false, message: 'STRIPE_SECRET_KEY is not set on this deployment' };

  try {
    const res = await fetch(`${API}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-06-20',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      ...(body ? { body: encode(body).join('&') } : {}),
      cache: 'no-store',
    });

    const json = await res.json();
    if (res.ok) return { ok: true, data: json as T };

    const err = json?.error ?? {};
    return {
      ok: false,
      code: err.code,
      message: err.message ?? `Stripe HTTP ${res.status}`,
      /* A decline is information, not a transient fault. Callers must not
       * retry it -- the card said no and retrying says no again, while looking
       * to the client like repeated attempts on their account. */
      declined: err.type === 'card_error',
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'request failed' };
  }
}

/* ---- customers ----------------------------------------------------------- */

export type StripeCustomer = { id: string };

export async function createCustomer(
  email: string, name?: string, clinikoPatientId?: string
): Promise<StripeResult<StripeCustomer>> {
  return call<StripeCustomer>('/customers', {
    email,
    ...(name ? { name } : {}),
    /* The Cliniko id travels with the customer so a Stripe dashboard row can
     * always be traced back to a patient without consulting this site. */
    ...(clinikoPatientId ? { metadata: { cliniko_patient_id: clinikoPatientId } } : {}),
  });
}

/* ---- saving a card ------------------------------------------------------- */

export type SetupIntent = { id: string; client_secret: string; payment_method?: string };

/** Starts card capture. The client_secret is handed to Stripe Elements in the
 *  browser; the card goes from the browser to Stripe and never via here. */
export async function createSetupIntent(customerId: string): Promise<StripeResult<SetupIntent>> {
  return call<SetupIntent>('/setup_intents', {
    customer: customerId,
    payment_method_types: { 0: 'card' },
    /* off_session declares the intent to charge when the client is not present.
     * Stripe records the mandate against it, and a PaymentIntent later made
     * off_session is judged against this. Omitting it is how stored-card
     * charges end up declined as unauthorised. */
    usage: 'off_session',
  });
}

/* ---- charging later ------------------------------------------------------ */

export type PaymentIntent = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  latest_charge?: string;
};

/**
 * Charges a saved card for a completed session.
 *
 * `amountCents` is an integer. Money is never a float anywhere in this
 * codebase — see lib/cliniko-revenue.ts for the same rule.
 *
 * `idempotencyKey` MUST be derived from the Cliniko appointment id and nothing
 * time-varying, or the protection it provides evaporates on the first retry.
 */
export async function chargeSavedCard(opts: {
  customerId: string;
  paymentMethodId: string;
  amountCents: number;
  description: string;
  idempotencyKey: string;
  clinikoAppointmentId: string;
}): Promise<StripeResult<PaymentIntent>> {
  if (!Number.isInteger(opts.amountCents) || opts.amountCents <= 0) {
    return { ok: false, message: `refusing to charge a non-positive amount (${opts.amountCents})` };
  }
  return call<PaymentIntent>(
    '/payment_intents',
    {
      amount: opts.amountCents,
      currency: 'cad',
      customer: opts.customerId,
      payment_method: opts.paymentMethodId,
      description: opts.description,
      /* off_session + confirm: charge now, client not present. Stripe will
       * decline rather than prompt if the card needs authentication, which is
       * correct — there is nobody there to complete a 3DS challenge. The
       * decline is then handled as a decline. */
      off_session: true,
      confirm: true,
      metadata: { cliniko_appointment_id: opts.clinikoAppointmentId },
    },
    opts.idempotencyKey
  );
}

export async function detachPaymentMethod(pmId: string): Promise<StripeResult<unknown>> {
  return call(`/payment_methods/${pmId}/detach`, {});
}
