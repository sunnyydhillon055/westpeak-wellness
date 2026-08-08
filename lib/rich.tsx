import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Minimal inline-markup renderer for copy stored in lib/*.ts data files.
 *
 * Supported inside a paragraph string:
 *   [anchor text](/internal/path)   -> next/link  (descriptive anchors, in-body)
 *   [anchor text](https://ext.com)  -> external <a rel="noopener">
 *   **bold**                        -> <strong>
 *   *emphasis*                      -> <em>          (journal titles, etc.)
 *
 * This exists so contextual links can live *inside sentences* in the data layer
 * rather than only in card grids at the bottom of a page.
 *
 * The link pattern tolerates one level of nested parentheses in the URL, which
 * real citation links (…practice%20(1).pdf) genuinely contain.
 */
const LINK = String.raw`\[[^\]]+\]\((?:[^()]|\([^()]*\))*\)`;
const TOKEN = new RegExp(`(${LINK}|\\*\\*[^*]+\\*\\*|\\*[^*]+\\*)`, 'g');
const LINK_PARTS = new RegExp(String.raw`^\[([^\]]+)\]\(((?:[^()]|\([^()]*\))*)\)$`);

export function rich(text: string): ReactNode[] {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    const link = part.match(LINK_PARTS);
    if (link) {
      const [, label, href] = link;
      // Labels may contain **bold** / *emphasis* (journal titles in citations),
      // so run them through the same formatter. Labels cannot contain links,
      // so this recurses at most one level.
      const inner = rich(label);
      if (href.startsWith('/')) return <Link key={i} href={href}>{inner}</Link>;
      return <a key={i} href={href} target="_blank" rel="noopener">{inner}</a>;
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const em = part.match(/^\*([^*]+)\*$/);
    if (em) return <em key={i}>{em[1]}</em>;
    return <span key={i}>{part}</span>;
  });
}

/** Render an array of paragraph strings as <p> elements with inline markup. */
export function Paragraphs({ items }: { items: string[] }) {
  return <>{items.map((p, i) => <p key={i}>{rich(p)}</p>)}</>;
}
