import { guides } from '@/lib/guides';
import { FIRST_HOLIDAYS_CLEARED } from '@/lib/guides-more3';
import { liveLinks, type GatedLink, type LinkFlags } from '@/lib/seasonal';

/* WHAT IS LIVE, FOR A LINK THAT MAY NOT BE YET — 16 Oct 2026 (item 558).
 *
 * The "This season" shelf already dropped a link to a draft guide or a
 * flagged anchor (item 538). Related links on guides, /for pages and
 * services now carry the same `guide` and `flag` keys, so a page can link
 * the holidays guide, or the grief guide's first-holidays section, before
 * either is cleared: until then the link is dropped and the page renders
 * byte for byte as it did, and on the build that publishes it every inbound
 * link appears at once. test/r11-figures-and-draft-links.test.mts checks
 * both halves.
 *
 * Server-only data (it imports every guide): never import this from a
 * client component. */

export const PUBLISHED_GUIDES: ReadonlySet<string> = new Set(guides.map((g) => g.slug));

export const LINK_FLAGS: LinkFlags = { FIRST_HOLIDAYS_CLEARED };

/** The links in `links` that are live on this build. */
export function live<T extends GatedLink>(links: readonly T[]): T[] {
  return liveLinks(links, PUBLISHED_GUIDES, LINK_FLAGS);
}
