import { resolveMx } from 'node:dns/promises';
import type { Inbound, InboundKind } from '@/lib/inbound';

/* ============================================================================
   INBOUND TRIAGE — flagging automated and undeliverable submissions
   ----------------------------------------------------------------------------
   WHAT THIS IS NOT

   This does not decide whether a person is real. It cannot, and a counselling
   practice is the worst possible place to pretend otherwise. Someone in crisis
   at 3 a.m. writes from an address they made ten minutes ago, gives no name,
   types six words, and sends it twice because they were not sure it went. That
   person trips four of the seven signals below. They are the single most
   important message the practice will get that week.

   So the rule this file is built on: SORT, NEVER SILENCE. Every submission is
   stored, and every submission except a tripped honeypot still raises the
   practice alert. What triage buys is an ordered inbox — a chip in /admin that
   says why something looks automated — not a bin.

   WHAT IS DELIBERATELY NOT A SIGNAL

   - The person's NAME. Any "does this look like a real name" heuristic
     penalises exactly the people this practice exists for: Punjabi names,
     transliterated names, single names, names typed in Gurmukhi. There is no
     version of that check worth having and it is not implemented here.
   - IP ADDRESS, and therefore country, city, and per-IP rate limiting. The
     practice tells people no client record is created before a session; an
     enquiry about mental health tied to a network address is a record. Burst
     detection keys on the submitted email instead, which the person chose to
     give. See scripts/triage-guard.mjs, which fails the build if either of
     these creeps back in.
   - CAPTCHA of any kind. lib/inbound-submit.ts already says why: a distressed
     human should never be asked to prove they are not a robot.

   BANDS

   `quarantine` is reserved for the one case with no ambiguity — a hidden field
   that no human can see was filled in. Everything else is `review`: stored,
   alerted, flagged. `clear` is the ordinary path.
   ========================================================================= */

export type TriageFlag =
  | 'honeypot'    /* hidden field filled — no human can reach it */
  | 'no-mx'       /* email domain publishes no mail exchanger */
  | 'links'       /* URLs in a message to a counsellor */
  | 'fast'        /* submitted faster than the form can be read */
  | 'disposable'  /* known throwaway mail provider */
  | 'duplicate'   /* identical message already stored */
  | 'burst';      /* same address, repeatedly, in a day */

export type TriageBand = 'clear' | 'review' | 'quarantine';

export type TriageVerdict = {
  band: TriageBand;
  flags: TriageFlag[];
  /** One sentence for /admin. Empty when clear. */
  why: string;
};

/** Throwaway providers. Short and real — a long list goes stale and a wrong
 *  entry silently flags a legitimate address. `review` only, never a block:
 *  a burner address is a completely reasonable way to first contact a
 *  therapist, and plenty of people do it on purpose. */
const DISPOSABLE = new Set([
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'throwawaymail.com', 'sharklasers.com',
  'trashmail.com', 'dispostable.com', 'maildrop.cc', 'getnada.com',
  'fakeinbox.com', 'mailnesia.com', 'spamgourmet.com', 'mailcatch.com',
]);

/** Bare URLs and bare domains alike — form spam usually sends the latter. */
const LINK_RE = /(https?:\/\/|\bwww\.)\S+|\b[a-z0-9-]+\.(com|net|org|io|ru|cn|biz|info|xyz|top)\b/gi;

/** Below this, the form was not read. Generous on purpose: a returning visitor
 *  pasting a prepared message is quick, and being quick is not suspicious. */
const MIN_FILL_MS = 2500;

const countLinks = (s: string) => (s.match(LINK_RE) ?? []).length;

const domainOf = (email: string) => email.split('@')[1]?.toLowerCase() ?? '';

/** Collapse whitespace and case so "  Hello   there " and "hello there" are
 *  recognised as the same message body. */
const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

export type TriageInput = {
  kind: InboundKind;
  email: string;
  message: string;
  /** Raw value of the honeypot field, whatever arrived. */
  honeypot: string;
  /** Milliseconds between the form rendering and it being submitted, when the
   *  client supplied it. Undefined is NEUTRAL, never a penalty: a form posted
   *  without JavaScript is a supported way to reach this practice. */
  fillMs?: number;
};

/**
 * The synchronous signals — everything decidable from the submission itself
 * plus what is already stored. No network, so this runs before the record is
 * written and cannot delay or fail the store.
 */
export function triage(input: TriageInput, existing: Inbound[]): TriageVerdict {
  const flags: TriageFlag[] = [];

  if (input.honeypot.trim()) flags.push('honeypot');

  if (typeof input.fillMs === 'number' && input.fillMs >= 0 && input.fillMs < MIN_FILL_MS) {
    flags.push('fast');
  }

  if (DISPOSABLE.has(domainOf(input.email))) flags.push('disposable');

  /* Two or more links in a message to a counsellor. One is ordinary — people
     link the article that brought them, or their insurer's page. Two is the
     shape of an SEO pitch. `review` either way, so a wrong call costs a chip
     in /admin and nothing else. */
  if (input.kind === 'enquiry' && countLinks(input.message) >= 2) flags.push('links');

  const body = normalise(input.message);
  if (body.length > 0 && existing.some((i) => normalise(i.message) === body)) {
    flags.push('duplicate');
  }

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const sameAddress = existing.filter(
    (i) => i.email.toLowerCase() === input.email.toLowerCase() &&
           Date.parse(i.createdAt) >= dayAgo
  ).length;
  if (sameAddress >= 3) flags.push('burst');

  return verdict(flags);
}

/**
 * Does the address's domain accept mail at all?
 *
 * Run AFTER the record is stored — it is a network call and the store must not
 * depend on it. A domain with no MX cannot receive the acknowledgement, so the
 * ack is skipped; the practice alert is still sent, because a typo'd address on
 * a genuine message is far more likely than a forged one, and the practice may
 * still be able to help through another route.
 *
 * Fails OPEN. A DNS timeout means "unknown", never "fake".
 */
export async function hasMailExchanger(email: string, timeoutMs = 2500): Promise<boolean | null> {
  const domain = domainOf(email);
  if (!domain) return null;
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
    ]);
    return Array.isArray(records) && records.length > 0;
  } catch (err) {
    /* ENOTFOUND / ENODATA are real answers: the domain publishes no mail route.
       Anything else — timeout, SERVFAIL, no network on the box — is unknown. */
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOTFOUND' || code === 'ENODATA') return false;
    return null;
  }
}

/** Fold an MX result into an existing verdict. */
export function withMx(base: TriageVerdict, mx: boolean | null): TriageVerdict {
  if (mx !== false) return base;
  return verdict([...base.flags, 'no-mx']);
}

const REASON: Record<TriageFlag, string> = {
  honeypot: 'filled a field no human can see',
  'no-mx': 'the email domain accepts no mail, so a reply cannot arrive',
  links: 'links in the message',
  fast: 'submitted faster than the form can be read',
  disposable: 'throwaway email provider',
  duplicate: 'identical message already received',
  burst: 'third message from this address today',
};

function verdict(flags: TriageFlag[]): TriageVerdict {
  if (flags.length === 0) return { band: 'clear', flags: [], why: '' };
  /* Only the honeypot quarantines. Everything else is a hint for a human, and
     a hint that stops a message reaching a counsellor is not a hint. */
  const band: TriageBand = flags.includes('honeypot') ? 'quarantine' : 'review';
  const why = flags.map((f) => REASON[f]).join('; ');
  return { band, flags, why };
}
