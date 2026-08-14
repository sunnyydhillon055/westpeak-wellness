import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* Who has a card on file, what they agreed to, and what has already been
 * charged.
 *
 * THE MANDATE IS THE POINT OF THIS FILE. Card networks treat a stored card as a
 * standing agreement, not a saved convenience, and require the cardholder to
 * have been told what will be charged, when, and how to stop it. Stripe judges
 * off-session charges against that agreement; a charge made without one is more
 * likely to be declined and is far weaker if disputed.
 *
 * So the exact wording shown to the client is stored with the timestamp — not a
 * boolean "agreed", which records that something happened without recording
 * what. If the terms change, MANDATE_VERSION changes, and anyone on an older
 * version is re-asked rather than silently held to wording they never saw.
 *
 * NO CARD DATA. Ids only — a Stripe customer id and a payment method id. The
 * last four digits and brand are kept purely so the portal can say "Visa ending
 * 4242" instead of nothing, and they come back from Stripe rather than from any
 * form on this site.
 */

const KEY = 'portal/payment-methods.json';
const CHARGED_KEY = 'portal/charged.json';

/* Bump when the wording below changes in a way that alters what the client is
 * agreeing to. Cosmetic edits do not count; a change to amount, timing or
 * cancellation terms does. */
export const MANDATE_VERSION = 1;

export const MANDATE_TEXT =
  'I authorise Westpeak Wellness to store this card securely with Stripe and to charge it ' +
  'the published fee for each counselling session after that session has taken place. ' +
  'Sessions cancelled with at least 24 hours notice are not charged. I can remove this card ' +
  'at any time from the client portal, and I will be emailed a receipt for every charge.';

export type SavedCard = {
  email: string;
  stripeCustomerId: string;
  paymentMethodId: string;
  brand?: string;
  last4?: string;
  /** The agreement, recorded rather than assumed. */
  mandateVersion: number;
  mandateText: string;
  agreedAt: string;
  updatedAt: string;
};

type Store = Record<string, SavedCard>;

async function readStore(): Promise<Store> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    return ((await new Response(hit.stream).json()) as Store) ?? {};
  } catch {
    return {};
  }
}

async function writeStore(s: Store): Promise<void> {
  await put(KEY, JSON.stringify(s, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function getSavedCard(email: string): Promise<SavedCard | null> {
  const s = await readStore();
  return s[normalizeEmail(email)] ?? null;
}

export async function saveCard(card: Omit<SavedCard, 'updatedAt'>): Promise<void> {
  const s = await readStore();
  s[normalizeEmail(card.email)] = { ...card, email: normalizeEmail(card.email), updatedAt: new Date().toISOString() };
  await writeStore(s);
}

export async function removeCard(email: string): Promise<SavedCard | null> {
  const s = await readStore();
  const e = normalizeEmail(email);
  const existing = s[e] ?? null;
  delete s[e];
  await writeStore(s);
  return existing;
}

/** True when the client has a card AND agreed to the current wording. An old
 *  mandate version is deliberately not good enough to charge against. */
export async function canChargeOffSession(email: string): Promise<boolean> {
  const card = await getSavedCard(email);
  return Boolean(card && card.mandateVersion === MANDATE_VERSION && card.paymentMethodId);
}

/* ---- what has already been charged --------------------------------------
 *
 * Second line of defence only. Stripe's idempotency key is the first and the
 * stronger one, because it holds even if this store is lost or a run crashes
 * between charging and recording. This exists so the job can skip work cheaply
 * and so the practice can see what happened without opening Stripe.
 */

export type ChargeRecord = {
  appointmentId: string;
  email: string;
  amountCents: number;
  paymentIntentId: string;
  chargedAt: string;
  /** Whether the matching payment reached Cliniko. A charge that took the money
   *  but never landed in the practice's books is the worst state this system
   *  can reach, so it is tracked explicitly rather than assumed. */
  writtenToCliniko: boolean;
  clinikoPaymentId?: string;
};

type Ledger = Record<string, ChargeRecord>;

export async function readCharges(): Promise<Ledger> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(CHARGED_KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    return ((await new Response(hit.stream).json()) as Ledger) ?? {};
  } catch {
    return {};
  }
}

export async function recordCharge(rec: ChargeRecord): Promise<void> {
  const l = await readCharges();
  l[rec.appointmentId] = rec;
  await put(CHARGED_KEY, JSON.stringify(l, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Charges that took money but never reached Cliniko. Anything in here needs
 *  attention — it is real money the practice's records do not know about. */
export async function unreconciled(): Promise<ChargeRecord[]> {
  const l = await readCharges();
  return Object.values(l).filter((c) => !c.writtenToCliniko);
}

/** Derived from the appointment id alone. Must not include a timestamp, a run
 *  id, or anything else that varies between attempts — that is precisely what
 *  would let a retry become a second charge. */
export const idempotencyKeyFor = (appointmentId: string) => `wpw-appt-${appointmentId}`;
