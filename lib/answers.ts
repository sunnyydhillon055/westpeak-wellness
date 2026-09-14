import { faqs } from './faq.ts';
import { guides } from './guides.ts';
import { resources } from './resources.ts';
import { comparisons } from './comparisons.ts';
import { audiences } from './audiences.ts';
import { services } from './services.ts';
import { approaches } from './approaches.ts';
import { practitioners } from './practitioners.ts';

/* EVERY QUESTION THE SITE ALREADY ANSWERS, IN ONE PLACE — 14 Sep 2026.
 *
 * The owner asked for an instant-answer page with more than a hundred
 * answers. The site already held several hundred, one FAQ at a time, at the
 * foot of guides, resources, comparisons, audience and service pages and in
 * each counsellor's own words. This module gathers them, strips markdown
 * links to plain text, drops duplicates by question, and records where each
 * answer lives so the page can send a reader to the fuller treatment.
 *
 * Nothing is written here that is not already published elsewhere on the
 * site, which is the point: an answer here carries the same review the page
 * it came from had. City and city-service questions are left out — they are
 * answered for a place, and a reader asking from nowhere in particular
 * should not be told about the Massey Tunnel. */

export type Answer = {
  q: string;
  a: string;
  /** Where the fuller page is. */
  href: string;
  /** Short label for the source page. */
  from: string;
  /** Topic bucket for the filter chips. */
  topic: string;
};

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
const key = (q: string) => plain(q).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

export function buildAnswers(): Answer[] {
  const out: Answer[] = [];
  const seen = new Set<string>();
  const add = (q: string, a: string, href: string, from: string, topic: string) => {
    const k = key(q);
    if (!k || seen.has(k) || !a) return;
    seen.add(k);
    out.push({ q: plain(q), a: plain(a), href, from, topic });
  };

  for (const f of faqs) add(f.q, f.a, '/faq', 'FAQ', (f as { topic?: string }).topic ?? 'Starting');
  for (const s of services) for (const f of s.faqs ?? []) add(f.q, f.a, `/services/${s.slug}`, s.name, 'Services');
  for (const p of practitioners) for (const v of p.voice ?? []) add(v.q, v.a.join(' '), `/practitioners/${p.slug}`, p.name, 'Your counsellor');
  for (const a of approaches) for (const f of a.faqs ?? []) add(f.q, f.a, `/approaches/${a.slug}`, a.title, 'Approaches');
  for (const r of resources) for (const f of r.faqs ?? []) add(f.q, f.a, `/resources/${r.slug}`, r.title, /cover|msp|extended|cost|fee|icbc|worksafe|benefit|ei /i.test(r.slug + ' ' + r.title) ? 'Cost and coverage' : 'Practical');
  for (const g of guides) for (const f of g.faqs ?? []) add(f.q, f.a, `/guides/${g.slug}`, g.title, /stress leave|sick|work|ei |disability|burnout/i.test(g.title) ? 'Work and leave' : 'Feeling');
  for (const c of comparisons) for (const f of c.faqs ?? []) add(f.q, f.a, `/compare/${c.slug}`, c.title, 'Choosing');
  for (const au of audiences) for (const f of au.faqs ?? []) add(f.q, f.a, `/for/${au.slug}`, au.title, 'Your situation');
  return out;
}

export const TOPICS = ['Starting', 'Cost and coverage', 'Services', 'Your counsellor', 'Approaches', 'Feeling', 'Work and leave', 'Choosing', 'Your situation', 'Practical'];
