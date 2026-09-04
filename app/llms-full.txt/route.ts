import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { approaches } from '@/lib/approaches';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { policyList } from '@/lib/policies';
import { getExtra } from '@/lib/depth';

export const dynamic = 'force-static';

/* llms-full.txt — the site's substantive text as plain markdown, in one file.
 *
 * Assembled from the data layer rather than by scraping the rendered HTML, so
 * it contains prose and no navigation, chrome or duplicated boilerplate. Inline
 * link markup is flattened to plain text: a model reading this wants the
 * sentence, not the anchor. */

const plain = (s: string) =>
  s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [label](/href) -> label
   .replace(/\*\*([^*]+)\*\*/g, '$1')
   .replace(/\*([^*]+)\*/g, '$1')
   .trim();

type Sec = { h2: string; body?: string[]; list?: { label: string; detail: string }[] };

const renderSections = (sections: Sec[] = []) =>
  sections
    .map((s) => {
      const parts = [`### ${s.h2}`];
      if (s.body) parts.push(s.body.map(plain).join('\n\n'));
      if (s.list) parts.push(s.list.map((i) => `- ${plain(i.label)}: ${plain(i.detail)}`).join('\n'));
      return parts.join('\n\n');
    })
    .join('\n\n');

const renderFaqs = (faqs: { q: string; a: string }[] = []) =>
  faqs.length ? `### Common questions\n\n${faqs.map((f) => `Q: ${f.q}\nA: ${plain(f.a)}`).join('\n\n')}` : '';

function page({
  area, slug, title, summary, updated, sections, faqs,
}: {
  area: string; slug: string; title: string; summary?: string;
  updated?: string; sections?: Sec[]; faqs?: { q: string; a: string }[];
}) {
  const extra = getExtra(area, slug) as Sec[];
  return [
    `## ${title}`,
    `URL: ${site.domain}/${area}/${slug}`,
    updated ? `Last reviewed: ${updated}` : '',
    summary ? plain(summary) : '',
    renderSections(sections),
    renderSections(extra),
    renderFaqs(faqs),
  ].filter(Boolean).join('\n\n');
}

export function GET() {
  const chunks: string[] = [];

  chunks.push(`# ${site.name}: full text

Virtual counselling practice serving all of British Columbia, Canada. Secure
video sessions only, no office, no phone sessions. Provided by a ${site.counsellor.title}
(${site.counsellor.credentials}) registered with the BC Association of Clinical
Counsellors, working in English and Punjabi.

Service area: British Columbia. Session length: 50 minutes. First consultation:
15 minutes, free. Booking: ${site.domain}${site.bookingPath}. Contact: ${site.email}.

Not covered by MSP. Many BC extended health plans reimburse a Registered
Clinical Counsellor; the practice does not direct-bill. A Registered Clinical
Counsellor does not diagnose, prescribe, or conduct formal psychological
assessment, and this is not a crisis service: in crisis, 9-8-8 (Canada, 24/7),
310-6789 (BC), or 9-1-1 in immediate danger.

This document is the substantive prose of the site in one file. It contains no
navigation or boilerplate. Every page it covers is also available at its own URL.

---`);

  for (const s of services) {
    chunks.push(page({
      area: 'services', slug: s.slug, title: s.name,
      summary: `${s.hero}\n\n${s.intro}\n\nThis helps with: ${s.helps.join('; ')}.\n\nHow the practice approaches it: ${s.approach}`,
      sections: [
        ...(s.whatItIs ? [s.whatItIs as Sec] : []),
        ...(s.signs ? [{ h2: 'What people tend to arrive with', list: s.signs }] : []),
        ...(s.sessionShape ? [s.sessionShape as Sec] : []),
      ],
      faqs: s.faqs,
    }));
  }
  for (const a of approaches) {
    chunks.push(page({ area: 'approaches', slug: a.slug, title: a.title, summary: a.shortAnswer, updated: a.updated, sections: a.sections as Sec[], faqs: a.faqs }));
  }
  for (const g of guides) {
    chunks.push(page({ area: 'guides', slug: g.slug, title: g.title, summary: g.shortAnswer, updated: g.updated, sections: g.sections as Sec[], faqs: g.faqs }));
  }
  for (const c of comparisons) {
    chunks.push(page({ area: 'compare', slug: c.slug, title: c.title, summary: c.shortAnswer, updated: c.updated, sections: c.sections as Sec[], faqs: c.faqs }));
  }
  for (const r of resources) {
    chunks.push(page({ area: 'resources', slug: r.slug, title: r.title, summary: r.shortAnswer, updated: r.updated, sections: r.sections as Sec[], faqs: r.faqs }));
  }
  for (const a of audiences) {
    chunks.push(page({ area: 'for', slug: a.slug, title: a.title, summary: a.opening.map(plain).join('\n\n'), updated: a.updated, sections: a.sections as Sec[], faqs: a.faqs }));
  }
  for (const p of policyList) {
    chunks.push(page({ area: '', slug: p.slug, title: p.title, summary: p.lede, updated: p.updated, sections: p.sections as Sec[] }));
  }

  const body = chunks.join('\n\n---\n\n') + '\n';

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
