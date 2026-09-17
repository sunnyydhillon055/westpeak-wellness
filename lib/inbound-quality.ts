import type { Inbound } from './inbound';

/* WHICH SUBMISSIONS ARE A PERSON WAITING FOR AN ANSWER — 17 Sep 2026.
 *
 * This lived inside the admin digest route, where it was written on 11 Sep
 * after reading the whole inbox with the owner: of the thirty non-test
 * messages, twenty-six were bots — newsletter scripts, crypto links pasted
 * into the name field, an SEO pitch, gibberish — and three were people.
 *
 * It is here now because the reply-time watch needed the same judgement and
 * did not have it. On 17 Sep the watch reported thirty-three messages past the
 * one-business-day promise and emailed the owner a list of them. Every single
 * one was a bot or one of this project's own test submissions:
 * selftest-ask@example.com, probe@example.com, three addresses at mail.ru,
 * one at mailinator. Nobody was waiting. The promise was being kept and the
 * monitor said otherwise, at nine in the morning, daily.
 *
 * Two filters, deliberately separate:
 *
 *   isTestSubmission   this project's own probes and the throwaway-domain
 *                      submissions. Never a person, ever.
 *   looksHuman         a judgement call about bots. Conservative in the
 *                      direction that matters: an empty message from /book
 *                      with a plausible name counts as a person, because that
 *                      is exactly what the three real leads looked like.
 *
 * Neither filter deletes anything or hides it from /admin. They decide what is
 * counted as somebody waiting for a reply, which is a different question from
 * what is kept.
 */

/** Test and throwaway addresses. Never a client. */
const TEST = /@(example\.com|example\.org|test\.com|mailinator\.com|.*\.invalid)$|\+test@|^selftest|^probe@/i;

/* A link, a newsletter request, or the vocabulary of a sales script. These are
   the exact patterns in this inbox, not a general-purpose spam list. */
const SPAM =
  /https?:\/\/|\.(org|net|ph|ru)\/|newsletter|mailing list|news and updates|email updates|special offers|weekly updates|bitcoin|mining|promo code|jackpot|seo|google rankings|advertising platform|buy now/i;

/* Free mail domains that, in this inbox, have only ever carried scripts. Used
   only together with an empty or link-bearing message — a real person on one
   of these is common and must not be filtered on the domain alone. */
const BOT_DOMAINS = /@(mail\.ru|yandex\.(ru|com)|rambler\.ru)$/i;

const GIBBERISH = /^[A-Za-z]{6,}$/; // one run of letters, no vowel pattern a name has

/** This project's own probes and throwaway domains. */
export function isTestSubmission(it: Pick<Inbound, 'email' | 'name'>): boolean {
  return TEST.test(String(it.email ?? '')) || /^selftest/i.test(String(it.name ?? ''));
}

/** A message a person could act on. False for scripts; see the note above. */
export function looksHuman(it: Pick<Inbound, 'email' | 'name' | 'message' | 'source'>): boolean {
  const name = String(it.name ?? '').trim();
  const msg = String(it.message ?? '').trim();
  if (SPAM.test(`${name} ${msg}`)) return false;
  if (/^[A-Za-z]{10,}$/.test(msg) || (GIBBERISH.test(name) && !/[aeiou]/i.test(name))) return false;
  if (BOT_DOMAINS.test(String(it.email ?? '')) && !msg) return false;
  if (!msg) return it.source === '/book' && /^[A-Za-z][a-z]+(\s[A-Za-z][a-z]+)?$/.test(name);
  return true;
}

/** Somebody who wrote in and is owed an answer: not a probe, not a script. */
export function awaitsHumanReply(it: Pick<Inbound, 'email' | 'name' | 'message' | 'source'>): boolean {
  return !isTestSubmission(it) && looksHuman(it);
}
