import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Credential } from '@/lib/practitioners';
import { registerEntryUrl } from '@/lib/practitioner-facts';

/* ============================================================================
   LINKS IN WORDS THE TWINS ALREADY SAY — 4 Oct 2026
   ----------------------------------------------------------------------------
   The Tagalog and Punjabi pages (profile twins and city twins) said "the fee
   does not change with where you live", "the full fee is on the fees page"
   and "the limits are on the standards page", and linked none of them; the
   register a reader checks Savneet or Camille on was named in the trust bar
   and linked only from the footer. No new Tagalog or Punjabi is written here:
   each helper puts a link on words the copy already carries, so the page
   points where it says it points. Server-only, no client JS.
   ========================================================================= */

/** The phrase-to-page pairs a twin's copy refers to, in each language. */
export const TL_PHRASE_LINKS: readonly [string, string][] = [
  ['pahina ng mga bayarin', '/pricing'],
  ['pahina ng mga pamantayan', '/standards'],
];
export const PA_PHRASE_LINKS: readonly [string, string][] = [
  ['ਫ਼ੀਸਾਂ ਵਾਲੇ ਪੰਨੇ', '/pricing'],
  ['ਮਿਆਰਾਂ ਵਾਲੇ ਪੰਨੇ', '/standards'],
];

/** `text` with the first occurrence of each phrase made a link to its page. */
export function linkPhrases(text: string, links: readonly [string, string][]): ReactNode {
  const out: ReactNode[] = [];
  const done = new Set<string>();
  let rest = text;
  for (;;) {
    let best: { i: number; phrase: string; href: string } | null = null;
    for (const [phrase, href] of links) {
      if (done.has(phrase)) continue;
      const i = rest.indexOf(phrase);
      if (i !== -1 && (!best || i < best.i)) best = { i, phrase, href };
    }
    if (!best) break;
    done.add(best.phrase);
    out.push(rest.slice(0, best.i));
    out.push(<Link key={best.phrase} href={best.href}>{best.phrase}</Link>);
    rest = rest.slice(best.i + best.phrase.length);
  }
  out.push(rest);
  return out.length === 1 ? text : out;
}

/** The registering body's name, linked to her entry on its public register. */
export function RegisterName({ c }: { c: Credential }) {
  const href = registerEntryUrl(c);
  return href ? <a href={href} target="_blank" rel="noopener" lang="en-CA">{c.body}</a> : <>{c.body}</>;
}
