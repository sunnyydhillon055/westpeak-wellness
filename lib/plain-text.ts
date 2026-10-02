/* MARKDOWN TO PLAIN TEXT, for the places rich() cannot reach — 1 Oct 2026
 * (item 370).
 *
 * Copy in lib/*.ts carries the small markup lib/rich.tsx renders: links,
 * **bold**, *emphasis*. On the page rich() turns it into elements. In JSON-LD
 * (FAQPage answers) there is no renderer, and the raw "[label](/path)" was
 * landing in the structured data as literal brackets. This strips it to the
 * words a reader would see.
 *
 * The link pattern matches rich()'s: one level of nested parentheses in the
 * URL is tolerated. Links go first, so a bold link ("**[Foundry](…)**")
 * becomes "**Foundry**" and then "Foundry".
 *
 * No imports: safe anywhere, including tests run under strip-types. */

const LINK = /\[([^\]]+)\]\((?:[^()]|\([^()]*\))*\)/g;

/** The words of a markdown string, without link targets or emphasis marks. */
export function plainText(md: string): string {
  return md
    .replace(LINK, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

/** True when `text` still shows a markdown link to a reader: the pattern
 *  scripts/quality-audit.mjs looks for in built HTML. */
export const RAW_MD_LINK = /\[[^\]]+\]\((\/|https?:)/;
