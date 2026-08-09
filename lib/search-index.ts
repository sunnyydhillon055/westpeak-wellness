import { services } from '@/lib/services';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { approaches } from '@/lib/approaches';
import { glossary } from '@/lib/glossary';
import { tools } from '@/lib/tools';

/* The search index, assembled from the same data the pages render from.
 *
 * Built at request time from imports rather than crawled or hand-maintained, so
 * it cannot drift: add a guide and it is searchable on the next build with no
 * separate step to forget. */

export type Entry = { href: string; title: string; summary: string; kind: string };

export function buildIndex(): Entry[] {
  const out: Entry[] = [
    ...services.map((s) => ({
      href: `/services/${s.slug}`, title: s.name, summary: s.short ?? s.hero, kind: 'Service',
    })),
    ...guides.map((g) => ({
      href: `/guides/${g.slug}`, title: g.title, summary: g.shortAnswer, kind: 'Guide',
    })),
    ...comparisons.map((c) => ({
      href: `/compare/${c.slug}`, title: c.title, summary: c.shortAnswer, kind: 'Comparison',
    })),
    ...resources.map((r) => ({
      href: `/resources/${r.slug}`, title: r.title, summary: r.shortAnswer, kind: 'Resource',
    })),
    ...audiences.map((a) => ({
      href: `/for/${a.slug}`, title: a.title, summary: a.lede, kind: 'Who we work with',
    })),
    ...approaches.map((a) => ({
      href: `/approaches/${a.slug}`, title: a.title, summary: a.shortAnswer, kind: 'Approach',
    })),
    ...tools.map((t) => ({
      href: `/tools/${t.slug}`, title: t.title, summary: t.short, kind: 'Tool',
    })),
    ...glossary.map((t) => ({
      href: `/glossary#${t.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: t.term, summary: t.definition, kind: 'Glossary',
    })),
  ];
  return out;
}

/* Deliberately simple: term frequency over title and summary, with a title
 * match weighted heavily. A real search service would be better and is not
 * worth a dependency, an API key and a per-query network call for a hundred
 * pages of static content. */
export function searchIndex(index: Entry[], query: string, limit = 25): Entry[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (terms.length === 0) return [];

  return index
    .map((e) => {
      const title = e.title.toLowerCase();
      const summary = (e.summary ?? '').toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += title.startsWith(t) ? 6 : 4;
        if (summary.includes(t)) score += 1;
      }
      // Every term must appear somewhere, so a two-word query does not match a
      // page that only contains the commoner of the two.
      const all = terms.every((t) => title.includes(t) || summary.includes(t));
      return { e, score: all ? score : 0 };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.e);
}
