import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getJob, jobs } from '@/lib/careers';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* Static params so each posting gets its own card at build time rather than
   rendering on demand — a social card that 404s on first share is worse than
   no card at all. */
export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const job = getJob(params.slug);
  return ogImage({
    eyebrow: 'Now hiring',
    title: job ? `${job.title} — remote across BC` : 'Careers at Westpeak Wellness',
  });
}
